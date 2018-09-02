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

    const product = rebalance ? 'rebalance' : 'orderbook';
    const { instructions, orderbookId, portfolioId } = rebalance
        ? await orderbook.rebalance(rebalance)
        : await orderbook.start(fundAmount);
    const csv = orderbook.convertToCsv(instructions);
    const path = join(ROOT, `${product}Id_${orderbookId}__portfolioId_${portfolioId}.csv`);

    await writeFileAsync(path, csv);
    console.log(`The ${product} ${orderbookId} was created at ${path}.`);
};
