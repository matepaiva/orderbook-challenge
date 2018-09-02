const { writeFile } = require('fs');
const { promisify } = require('util');
const { join } = require('path');
const { orderbook } = require('../../modules');

const writeFileAsync = promisify(writeFile);
const ROOT = process.cwd();

module.exports = async (program, { rebalance, orderbook: fundAmount }) => {
    if (!(rebalance || fundAmount)) {
        program.help();
    }

    const productType = rebalance ? 'rebalance' : 'orderbook';
    const { instructions, orderbookId, portfolioId } = rebalance
        ? await orderbook.rebalance(rebalance)
        : await orderbook.start(fundAmount);
    const csv = orderbook.convertToCsv(instructions);
    const filename = orderbook.setFilename(productType, orderbookId, portfolioId, '.csv');
    const path = join(ROOT, filename);

    await writeFileAsync(path, csv);
    console.log(`The ${productType} ${orderbookId} was created at ${path}.`);
};
