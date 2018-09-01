const { Document } = require('camo');
const { Instruction } = require('../index');

jest.mock('../modifiers', () => ({
    withTimestamps: (val) => val,
}));

jest.mock('camo', () => ({
    Document: class MockDocument { },
}));


describe('Instruction', () => {
    describe('.constructor()', () => {
       it('should define fields', () => {
           const instruction = new Instruction();

           expect(instruction).toMatchSnapshot();
           expect(instruction).toBeInstanceOf(Document);
       });
    });

    describe('.collectionName()', () => {
        it('should return the collection name', () => {
            expect(Instruction.collectionName()).toBe('instructions');
        });
    });
});
