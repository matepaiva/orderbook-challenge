const { writeFile } = require('fs');
const { promisify } = require('util');
const { join } = require('path');
const { orderbook } = require('../modules');

const writeFileAsync = promisify(writeFile);
const ROOT = process.cwd();

module.exports = async (program, { rebalance, orderbook: fundAmount }) => {
    if (!(rebalance || fundAmount)) {
        program.help();
    }

    if (fundAmount) {
        const { instructions, orderbookId, portfolioId } = await orderbook.start(fundAmount);
        const csv = orderbook.convertToCsv(instructions);
        const path = join(ROOT, `orderbookId_${orderbookId}__portfolioId_${portfolioId}.csv`);

        await writeFileAsync(path, csv);

        console.log(`Orderbook ${orderbookId} created at ${path}`);
    }

    if (rebalance) {
        const x = await orderbook.rebalance(rebalance);
    }

};
