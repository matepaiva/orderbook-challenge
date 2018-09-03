const config = require('../');

const app = {
    use: jest.fn(),
};

describe('server config', () => {
    config(app);

    it('should add libs as middleware to config', () => {
        expect(app.use).toHaveBeenCalledTimes(3);
    });
});
