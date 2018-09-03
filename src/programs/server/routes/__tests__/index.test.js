const routes = require('../');
const { orderbook, notFound } = require('../../controllers');
const { requiredParams } = require('../../middlewares');

jest.mock('../../controllers');
jest.mock('../../middlewares');

const app = {
    post: jest.fn(),
    use: jest.fn(),
};

describe('Routes', () => {
    it('should instanciate routes middlewares', () => {
        routes(app);

        expect(app.post).toHaveBeenNthCalledWith(1, '/orderbooks', requiredParams(['fundAmount']), orderbook.start);
        expect(app.post).toHaveBeenNthCalledWith(2, '/orderbooks/:id/rebalance', requiredParams(['id']), orderbook.rebalance);
        expect(app.use).toHaveBeenCalledWith(notFound);
    });
});
