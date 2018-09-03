const { get, orderBy, pick } = require('lodash');
const { Orderbook, Instruction, Portfolio } = require('../../models');
const { getIndexFromProvider } = require('../../services');

module.exports = async (orderbookId) => {
    if (!orderbookId) throw new Error('Orderbook Id is required');

    const instructions = await Instruction.find({ orderbookId });
    const { portfolioId, fundAmount } = (await Orderbook.findOne({ _id: orderbookId }) || {});

    if (!portfolioId) throw new Error('Orderbook not found.');

    // Get updated index of assets
    const index = getIndexFromProvider(true);
    const assets = get(index, 'data[0].assets');

    // Calculate the new fund total based on updated asset prices
    const newFundAmount = getNewFundTotal(instructions, assets);

    if (fundAmount === newFundAmount) throw new Error('Orderbook does not need to rebalance');

    // Evaluate old instructions and generate credits and debits needs.
    const { credits, debits } = evaluateProfits(instructions, assets, newFundAmount);

    // Create new instructions to clear credits and debits
    const rebalanceInstructions = getRebalanceInstructions(credits, debits);

    // Update portfolio
    const portfolio = await Portfolio.findOne({ _id: portfolioId });
    portfolio.fundAmount = newFundAmount;
    await portfolio.save();

    // Create new orderbook and save
    const { _id: newOrderbookId } = await Orderbook.create({
        portfolioId,
        fundAmount: newFundAmount,
    }).save();

    // Save new instructions
    const newInstructions = await saveInstructions(rebalanceInstructions, newOrderbookId);

    return { instructions: newInstructions, portfolioId, orderbookId: newOrderbookId };
};

// Save at database for future consumption
async function saveInstructions(rebalanceInstructions, orderbookId) {
    return Promise.all(rebalanceInstructions.map(async (instr) => {
        const instruction = await Instruction.create({
            ...instr,
            orderbookId,
        }).save();

        return instruction.toJSON();
    }));
}

function getNewFundTotal(instructions, assets) {
    return instructions.reduce((total, { quantity, targetCurrency }) => {
        const { price } = assets[targetCurrency];
        const currentAmount = quantity * price;

        return total + currentAmount;
    }, 0);
}

function evaluateProfits(instructions, assets, newFundAmount) {
    const evaluation = instructions.map(({ targetCurrency, quantity, weight }) => {
        const { price } = assets[targetCurrency];
        const currentAmount = quantity * price;
        const expectedAmount = weight * newFundAmount;

        return {
            currentAmount,
            price,
            targetCurrency,
            weight,
            amountDiff: (expectedAmount - currentAmount) * -1,
        };
    });

    const credits = evaluation.filter(({ amountDiff }) => amountDiff > 0);
    const debits = orderBy(evaluation.filter(({ amountDiff }) => amountDiff < 0), 'amountDiff', 'desc');

    return { credits, debits };
}

function getRebalanceInstructions(credits, debits) {
    const instructions = [];

    debits.forEach((debit) => {
        debit.amountDiff = Math.abs(debit.amountDiff);

        // It's necessary to always reorder the credits,
        // Because its amountDiff changes always that
        // a debit consumes it (and it happens in each iteration).
        const orderedCredits = orderBy(credits, 'amountDiff', 'desc');

        // Iterate over each credit and consumes its amountDiff
        // until it zeroes. If necessary, goes to another credit.
        orderedCredits.some((credit) => {
            const amount = Math.min(credit.amountDiff, debit.amountDiff);

            credit.amountDiff -= amount;
            debit.amountDiff -= amount;

            instructions.push({
                ...pick(debit, ['weight', 'price', 'targetCurrency']),
                sourceCurrency: credit.targetCurrency,
                amount,
                quantity: amount / debit.price,
            });

            // If credit has no credit, ask to next credit.
            // Otherwise, stop the loop.
            return credit.amountDiff;
        });
    });

    return instructions;
}
