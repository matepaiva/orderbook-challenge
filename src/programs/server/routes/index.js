const { requiredParams } = require('../middlewares');
const { orderbook, notFound } = require('../controllers');

module.exports = (app) => {
    // Create a new orderbook
    app.post('/orderbooks', requiredParams(['fundAmount']), orderbook.start);

    // Rebalance the orderbook, generating a new orderbook from it;
    app.post('/orderbooks/:id/rebalance', requiredParams(['id']), orderbook.rebalance);

    // Catch 404 and forward to error handler
    app.use(notFound);
};
