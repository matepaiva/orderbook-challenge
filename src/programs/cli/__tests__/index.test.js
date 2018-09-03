const cli = require('../');
const { orderbook } = require('../../../modules');
const fs = require('fs');

fs.writeFile = jest.fn();
orderbook.start = jest.fn(() => ({
    instructions: ['foo', 'bar'],
    orderbookId: 'orderbookId',
    portfolioId: 'portfolioId',
}));
orderbook.rebalance = jest.fn(() => ({
    instructions: ['foo', 'bar'],
    orderbookId: 'orderbookId',
    portfolioId: 'portfolioId',
}));
orderbook.convertToCsv = jest.fn(() => 'csvFile');
orderbook.setFilename = jest.fn(() => 'file.csv');

describe('command line interface', () => {
    it('should call program help if no arg is passed', () => {
        const help = jest.fn();

        cli({ help }, {});

        expect(help).toHaveBeenCalled();
    });

    it('should start orderbook', async () => {
        await cli({}, { orderbook: 1000 });

        expect(orderbook.start).toHaveBeenCalledWith(1000);
    });

    it('should rebalance orderbook', async () => {
        await cli({}, { rebalance: 'foo' });

        expect(orderbook.rebalance).toHaveBeenCalledWith('foo');
    });

    it('should convert orderbook to csv', async () => {
        await cli({}, { orderbook: 1000 });

        expect(orderbook.convertToCsv).toHaveBeenCalledWith(['foo', 'bar']);
    });

    it('should set file name', async () => {
        await cli({}, { orderbook: 1000 });

        expect(orderbook.setFilename).toHaveBeenCalledWith(
            'orderbook',
            'orderbookId',
            'portfolioId',
            '.csv'
        );
    });
});
