const { get } = require('lodash');
const { Portfolio, Orderbook, Instruction } = require('../../models');
const { getIndexFromProvider } = require('../../services');

module.exports = async (fundAmount, sourceCurrency = 'EUR') => {
    if (isNaN(fundAmount) || fundAmount < 999) {
        throw new Error('Invalid parameter: fund amount must be a number bigger than 1000');
    }

    const portfolio = await Portfolio.create({ fundAmount }).save();
    const orderbook = await Orderbook.create({ portfolioId: portfolio._id, fundAmount }).save();
    const instructions = await saveInstructions(fundAmount, sourceCurrency, orderbook._id);

    return {
        portfolioId: portfolio._id,
        orderbookId: orderbook._id,
        fundAmount,
        instructions,
    };
};

async function saveInstructions(fundAmount, sourceCurrency, orderbookId) {
    const index = getIndexFromProvider();
    const assets = get(index, 'data[0].assets');
    const instructions = [];

    await Promise.all(
        Object.keys(assets).map(async (targetCurrency) => {
            const { weight, price } = assets[targetCurrency];
            const amount = fundAmount * weight;
            const quantity = amount / price;

            if (amount === 0) return;

            const instruction = await Instruction.create({
                weight,
                price,
                sourceCurrency,
                targetCurrency,
                amount,
                quantity,
                orderbookId,
            }).save();
            instructions.push(instruction.toJSON());
        })
    );

    return instructions;
}
