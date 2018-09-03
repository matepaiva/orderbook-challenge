const { parse } = require('json2csv');
const { convertToCsv } = require('../');

jest.mock('json2csv', () => ({
    parse: jest.fn((instructions, { fields }) => ({
        parsed: true,
        instructions,
        fields,
    })),
}));

jest.mock('cryptocurrencies', () => ({ foo: 'bar', baz: 'bah' }));

jest.mock('d3-format', () => ({
    formatLocale: () => ({
        format: (a) => (b) => ([a, b]),
    }),
}));

const firstInstruction = {
    targetCurrency: 'foo',
    sourceCurrency: 'BTC',
    weight: 0.5,
    amount: 37,
};
const secondInstruction = {
    targetCurrency: 'baz',
    sourceCurrency: 'EUR',
    weight: 0.5,
    amount: -38,
};
const instructions = [firstInstruction, secondInstruction];


describe('Convert to CSV', () => {
    const map = convertToCsv(instructions);
    const fields = map.fields.reduce((obj, field) => ({
        ...obj,
        [field.label]: field.value,
    }), {});

    it('should process it with a parser', () => {
        expect(map).toMatchSnapshot();
        expect(parse).toHaveBeenCalled();
    });

    it('should map `Name` field to target currency name', () => {
        const value = fields.Name;

        expect(value(firstInstruction)).toBe('bar');
        expect(value(secondInstruction)).toBe('bah');
        expect(value({ targetCurrency: 'random' })).toBe('random');
    });

    it('should map `Trading pair` field to target currency and source currency relationship', () => {
        const value = fields['Trading pair'];

        expect(value(firstInstruction)).toBe(`${firstInstruction.sourceCurrency}/${firstInstruction.targetCurrency}`);
        expect(value(secondInstruction)).toBe(`${secondInstruction.sourceCurrency}/${secondInstruction.targetCurrency}`);
    });

    it('should map `Weight %` field to weight prop', () => {
        const value = fields['Weight %'];

        expect(value(firstInstruction)).toBe(firstInstruction.weight);
        expect(value(secondInstruction)).toBe(secondInstruction.weight);
    });

    it('should map `€ Amount` field to amount prop', () => {
        const value = fields['€ Amount'];

        expect(value(firstInstruction)).toEqual(['$,.3f', 37]);
        expect(value(secondInstruction)).toEqual(['$,.3f', 38]);
    });

    it('should map `Action` field according to amount prop', () => {
        const value = fields.Action;

        expect(value(firstInstruction)).toEqual('BUY');
        expect(value(secondInstruction)).toEqual('SELL');
    });
});
