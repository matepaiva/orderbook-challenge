
const app = {
    use: jest.fn(),
    listen: jest.fn(),
};

jest.doMock('express', () => () => app);

const server = require('../');
const config = require('../config');
const routes = require('../routes');
const errorHandler = require('../error-handler');

jest.mock('../config');
jest.mock('../routes');
jest.mock('../error-handler');

describe('server', () => {
    it('should config', () => {
        server();

        expect(config).toBeCalledWith(app);
    });

    it('should inject routes', () => {
        server();

        expect(routes).toBeCalledWith(app);
    });

    it('should inject error handler', () => {
        server();

        expect(errorHandler).toBeCalledWith(app);
    });

    it('should initialize server on port 3000', () => {
        server();

        expect(app.listen).toBeCalledWith(3000);
    });
});
