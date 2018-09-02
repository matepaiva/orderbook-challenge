const { Document } = require('camo');
const { withTimestamps } = require('./modifiers');

class Instruction extends Document {
    constructor() {
        super();

        this.weight = {
            type: Number,
            required: true,
            min: 0,
            max: 1,
        };

        this.price = {
            type: Number,
            required: true,
            min: 0,
        };

        this.sourceCurrency = {
            type: String,
            required: true,
        };

        this.targetCurrency = {
            type: String,
            required: true,
        };

        this.amount = {
            type: Number,
            required: true,
        };

        this.quantity = {
            type: Number,
            required: true,
        };

        this.orderbookId = {
            type: String,
            required: true,
        };
    }

    static collectionName() {
        return 'instructions';
    }
}

module.exports = withTimestamps(Instruction);
