const { get } = require('lodash');
const { Orderbook, Instruction } = require('../../models');
const { getIndexFromProvider } = require('../../services');

module.exports = async (orderbookId) => {
    const instructions = await Instruction.find({ orderbookId });
    const { portfolioId } = await Orderbook.findOne({ _id: orderbookId });

    const index = getIndexFromProvider(true);
    const assets = get(index, 'data[0].assets');

    // const newFundTotal = Object.keys(assets).map((assetName) => {
    //     const asset = assets[assetName];
    // });

    console.log(assets, portfolioId,instructions);
};
