const { orderbook } = require('../index');
const { orderbook: orderbookModule } = require('../../../../modules');

orderbookModule.start = jest.fn(() => ({
    instructions: ['foo'],
    orderbookId: 'orderbookId',
    portfolioId: 'portfolioId',
}));
orderbookModule.rebalance = jest.fn(() => ({
    instructions: ['foo'],
    orderbookId: 'orderbookId',
    portfolioId: 'portfolioId',
}));
orderbookModule.convertToCsv = jest.fn(() => 'csvFile');
orderbookModule.setFilename = jest.fn(() => 'file.csv');

const res = {
    locals: { params: { id : 4} },
    send: jest.fn(),
    attachment: jest.fn(),
    format: jest.fn(),
};

const next = jest.fn();

describe('orderbook', () => {
    it('should check format to answer', async () => {
        await orderbook.start(undefined, res, next);

        expect(res.format).toHaveBeenCalled();
    });
});
