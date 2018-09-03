const { start } = require('..');

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
        static create(props) {
            return new Model(props);
        }

        save(props) {
            this.savedProps = props;
            this._id = '1234';

            return this;
        }

        toJSON() {
            return this;
        }
    }

    return {
        Portfolio: Model,
        Orderbook: Model,
        Instruction: Model,
    };
});

describe('orderbook start', () => {
    it('should throw if first parameter is not an number', () => {
        try {
            start('foo');
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    });

    it('should throw if first parameter is less than 999', () => {
        try {
            start(998);
        } catch (error) {
            expect(error instanceof Error).toBeTruthy();
        }
    });

    it('should return portfolio id', async () => {
        const result = await start(1000);

        expect(result.portfolioId).toEqual('1234');
    });

    it('should return orderbook id', async () => {
        const result = await start(1000);

        expect(result.orderbookId).toEqual('1234');
    });

    it('should return instructions', async () => {
        const fundAmount = 1000;
        const { instructions } = await start(fundAmount);

        expect(instructions).toHaveLength(2);

        instructions.forEach(({ props }) => {
            expect(fundAmount * props.weight).toEqual(props.amount);
            expect(props.price * props.quantity).toEqual(props.amount);
            expect(props.orderbookId).toEqual('1234');
        });
    });
});
