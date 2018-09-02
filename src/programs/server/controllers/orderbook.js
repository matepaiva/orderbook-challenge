const { get } = require('lodash');
const errors = require('throw.js');

const { orderbook } = require('../../../modules');

module.exports = {
    start,
    rebalance,
};

async function start(req, res, next) {
    try {
        const { fundAmount } = get(res, 'locals.params');

        const { orderbookId, portfolioId, instructions } = await orderbook.start(Number(fundAmount));

        res.format({
            'application/csv': () => {
                const csv = orderbook.convertToCsv(instructions);
                const filename = orderbook.setFilename('orderbook', orderbookId, portfolioId, '.csv');
                res.attachment(filename);
                res.send(csv);
            },
            'application/json': () => res.json({ orderbookId, portfolioId, instructions }),
        });
    } catch (error) {
        next(error);
    }
}

async function rebalance(req, res, next) {
    try {
        const { orderbookId } = get(res, 'locals.params');

        res.json({ route: 'rebalance', orderbookId });
    } catch (error) {
        next(error);
    }
}
