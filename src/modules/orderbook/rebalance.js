const { get, orderBy, pick } = require('lodash');
const { Orderbook, Instruction, Portfolio } = require('../../models');
const { getIndexFromProvider } = require('../../services');

module.exports = async (orderbookId) => {
    if (!orderbookId) throw new Error('Orderbook Id is required');

    const instructions = await Instruction.find({ orderbookId });
    const { portfolioId } = await Orderbook.findOne({ _id: orderbookId });
    const index = getIndexFromProvider(true);
    const assets = get(index, 'data[0].assets');
    const newFundAmount = getNewFundTotal(instructions, assets);
    const { credits, debits } = evaluateProfits(instructions, assets, newFundAmount);
    const rebalanceTransactions = getRebalanceTransactions(credits, debits);
    const portfolio = await Portfolio.findOne({ _id: portfolioId });

    portfolio.fundAmount = newFundAmount;

    await portfolio.save();

    const { _id: newOrderbookId } = await Orderbook.create({
        portfolioId,
        fundAmount: newFundAmount,
    }).save();


    const transactions = await saveTransactions(rebalanceTransactions, newOrderbookId);

    return { instructions: transactions, portfolioId, orderbookId: newOrderbookId };
};

async function saveTransactions(rebalanceTransactions, orderbookId) {
    return Promise.all(rebalanceTransactions.map(async (transaction) => {
        const instruction = await Instruction.create({ ...transaction, orderbookId }).save();

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

function getRebalanceTransactions(credits, debits) {
    const transactions = [];

    debits.forEach((debit) => {
        debit.amountDiff = Math.abs(debit.amountDiff);
        const orderedCredits = orderBy(credits, 'amountDiff', 'desc');

        orderedCredits.some((credit) => {
            const amount = Math.min(credit.amountDiff, debit.amountDiff);

            credit.amountDiff -= amount;
            debit.amountDiff -= amount;

            transactions.push({
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

    return transactions;
}
