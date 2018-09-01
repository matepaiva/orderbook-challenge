const { Document } = require('camo');
const { Orderbook } = require('../index');

jest.mock('../modifiers', () => ({
    withTimestamps: (val) => val,
}));

jest.mock('camo', () => ({
    Document: class MockDocument { },
}));


describe('Orderbook', () => {
    describe('.constructor()', () => {
       it('should define fields', () => {
           const orderbook = new Orderbook();

           expect(orderbook).toMatchSnapshot();
           expect(orderbook).toBeInstanceOf(Document);
       });
    });

    describe('.collectionName()', () => {
        it('should return the collection name', () => {
            expect(Orderbook.collectionName()).toBe('orderbooks');
        });
    });
});
