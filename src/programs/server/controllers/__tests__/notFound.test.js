const errors = require('throw.js');
const notFound = require('../notFound');

describe('Not Found', () => {
    it('should answer with a 404 http error', () => {
        const next = jest.fn();
        notFound(undefined, undefined, next);

        expect(next).toHaveBeenCalledWith(new errors.NotFound());
    });
});
