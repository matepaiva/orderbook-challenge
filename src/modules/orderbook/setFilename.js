module.exports = (productType, orderbookId, portfolioId, extension) =>
    `${productType}Id_${orderbookId}__portfolioId_${portfolioId}${extension}`;
