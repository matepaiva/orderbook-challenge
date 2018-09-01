const { connect } = require('camo');
const osTmpDir = require('os-tmpdir')();
const { connectToDatabase } = require('../../');

jest.mock('camo', () => ({
    connect: jest.fn(() => 'connection'),
}));

jest.mock('os-tmpdir', () => () => 'tmpDir');


describe('database connect', () => {
    it('should trigger connect with tmp dir path', () => {
        const connection = connectToDatabase();

        expect(connection).toBe('connection');
        expect(connect).toHaveBeenCalledWith(`nedb://${osTmpDir}`);
    });
});
