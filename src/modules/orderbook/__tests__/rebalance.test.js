const { rebalance } = require('..');

jest.mock('../../../services', () => ({
    getIndexFromProvider: () => ({
        data: [{
            assets: {
                'AAA': {
                    weight: 0.5,
                    price: 1,
                },
                'BBB': {
                    weight: 0.5,
                    price: 2,
                },
                'CCC': {
                    weight: 0,
                    price: 2,
                },
            },
        }],
    }),
}));

jest.mock('../../../models', () => {
    class Model {
        constructor(props) {
            this.props = props;
        }

        static findOne(props) {
            const model = new Model(props);
            model._id = '_id';
            model.portfolioId = 'portfolioId';

            return model;
        }

        static find() {
            const model1 = new Model();
            model1._id = '_id1';
            model1.weight = 0.5;
            model1.price = 2;
            model1.sourceCurrency = 'EUR';
            model1.targetCurrency = 'AAA';
            model1.amount = 1000;
            model1.quantity = 500;
            model1.orderbookId = 'orderbookId';

            const model2 = new Model();
            model2._id = '_id2';
            model2.weight = 0.5;
            model2.price = 1;
            model2.sourceCurrency = 'EUR';
            model2.targetCurrency = 'BBB';
            model2.amount = 1000;
            model2.quantity = 1000;
            model2.orderbookId = 'orderbookId';

            return [model1, model2];
        }


        static create(props) {
            return new Model(props);
        }

        save(props) {
            this.savedProps = props;
            if (!this._id) {
                this._id = '1234';
            }

            return this;
        }

        toJSON() {
            return {
                ...this,
            };
        }
    }

    return {
        Portfolio: Model,
        Orderbook: Model,
        Instruction: Model,
    };
});

describe('orderbook rebalance', () => {
    it('should throw if no param is passed', async () => {
        try {
            await rebalance();
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    });

    it('should return portfolio id', async () => {
        const result = await rebalance('orderbookId');
        expect(result.portfolioId).toEqual('portfolioId');
    });

    it('should return new orderbook id', async () => {
        const result = await rebalance('orderbookId');
        expect(result.orderbookId).toEqual('1234');
    });

    it('should return new instructions', async () => {
        const result = await rebalance('orderbookId');
        expect(result.instructions[0].props).toEqual({
            amount: 750,
            orderbookId: '1234',
            price: 1,
            quantity: 750,
            sourceCurrency: 'BBB',
            targetCurrency: 'AAA',
            weight: 0.5,
        });
    });
});
