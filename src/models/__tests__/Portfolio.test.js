const { Document } = require('camo');
const { Portfolio } = require('../index');

jest.mock('../modifiers', () => ({
    withTimestamps: (val) => val,
}));

jest.mock('camo', () => ({
    Document: class MockDocument { },
}));


describe('Portfolio', () => {
    describe('.constructor()', () => {
       it('should define fields', () => {
           const portfolio = new Portfolio();

           expect(portfolio).toMatchSnapshot();
           expect(portfolio).toBeInstanceOf(Document);
       });
    });

    describe('.collectionName()', () => {
        it('should return the collection name', () => {
            expect(Portfolio.collectionName()).toBe('portfolios');
        });
    });
});
