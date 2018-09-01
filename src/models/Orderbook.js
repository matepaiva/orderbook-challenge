const { Document } = require('camo');
const { withTimestamps } = require('./modifiers');

class Orderbook extends Document {
    constructor() {
        super();

        this.fundAmount = {
            type: Number,
            required: true,
            min: 1000,
        };

        this.portfolioId = {
            type: String,
            required: true,
        };
    }

    static collectionName() {
        return 'orderbooks';
    }
}

module.exports = withTimestamps(Orderbook);
