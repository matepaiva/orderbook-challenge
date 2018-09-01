const { parse } = require('json2csv');
const cryptocurrencies = require('cryptocurrencies');
const { formatLocale } = require('d3-format');

const CURRENCY = '€';
const { format } = formatLocale({
    decimal: '.',
    thousands: ',',
    currency: [CURRENCY, ''],
    grouping: [3],
});

module.exports = (instructions) => {
    const fields = [
        {
            label: 'Name',
            value: ({ targetCurrency }) => cryptocurrencies[targetCurrency] || targetCurrency,
        },
        {
            label: 'Trading pair',
            value: ({ sourceCurrency, targetCurrency }) => `${sourceCurrency}/${targetCurrency}`,
        },
        {
            label: 'Weight %',
            value: ({ weight }) => weight,
        },
        {
            label: '€ Amount',
            value: ({ amount }) => format('$,.3f')(Math.abs(amount)),
        },
        {
            label: 'Action',
            value: ({ amount }) => (amount > 0) ? 'BUY' : 'SELL',
        },
    ];

    return parse(instructions, { fields });
};
