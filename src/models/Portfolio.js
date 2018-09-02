const { Document } = require('camo');
const { withTimestamps } = require('./modifiers');

class Portfolio extends Document {
    constructor() {
        super();

        this.fundAmount = {
            type: Number,
            required: true,
            min: 1000,
        };
    }

    static collectionName() {
        return 'portfolios';
    }
}

module.exports = withTimestamps(Portfolio);
