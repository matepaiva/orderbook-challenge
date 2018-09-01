const { getIndexFromProvider } = require('../../');
const firstIndex = require('../assets/first.json');
const updatedIndex = require('../assets/updated.json');


describe('getIndexFromProvider', () => {
    it('should get first index if invoked with falsy parameter', () => {
        const index = getIndexFromProvider();

        expect(index).toBe(firstIndex);
    });

    it('should get updated index if invoked with truthy parameter', () => {
        const index = getIndexFromProvider(true);

        expect(index).toBe(updatedIndex);
    });
});
