const { setFilename } = require('..');

describe('orderbook set filename', () => {
    it('should set filename according to parameters', () => {
        const productType = 'orderbook';
        const orderbookId = '123';
        const portfolioId = '456';
        const extension = '.pdf';

        expect(setFilename(productType, orderbookId, portfolioId, extension))
            .toBe(`${productType}Id_${orderbookId}__portfolioId_${portfolioId}${extension}`);
    });
});
