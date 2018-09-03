const { get } = require('lodash');

const { orderbook } = require('../../../modules');

module.exports = {
    start,
    rebalance,
};

async function start(req, res, next) {
    try {
        const { fundAmount } = get(res, 'locals.params');
        const product = await orderbook.start(Number(fundAmount));

        respond(res, 'orderbook', product);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function rebalance(req, res, next) {
    try {
        const { id } = get(res, 'locals.params');
        const product = await orderbook.rebalance(id);

        respond(res, 'rebalance', product);
    } catch (error) {
        next(error);
    }
}

function respond (res, responseType, {
    instructions,
    orderbookId,
    portfolioId,
}) {
    res.format({
        'text/csv': () => {
            const csv = orderbook.convertToCsv(instructions);
            const filename = orderbook.setFilename(responseType, orderbookId, portfolioId, '.csv');
            res.attachment(filename);
            res.send(csv);
        },
        'application/json': () => res.json({ orderbookId, portfolioId, instructions }),
    });
}
