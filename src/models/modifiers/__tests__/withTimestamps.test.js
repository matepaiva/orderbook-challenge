const { withTimestamps } = require('../');

class Testclass {
    constructor(id) {
        this._id = id;
    }
}

describe('withTimestamps', () => {
    it('should enhance class with props createdAt and updatedAt', () => {
        const instance = new Testclass();

        const TimestampedClass = withTimestamps(Testclass);
        const TimestampedInstance = new TimestampedClass();

        expect(instance.createdAt).toEqual(undefined);
        expect(TimestampedInstance.createdAt).toEqual({ type: Date });
        expect(instance.updatedAt).toEqual(undefined);
        expect(TimestampedInstance.updatedAt).toEqual({ type: Date });
    });

    describe('.preSave()', () => {
        const originalDate = global.Date;

        beforeAll(() => {
            const constantDate = new Date('2018-02-28T09:39:59');
            global.Date = class extends Date {
                constructor() {
                    super();

                    return constantDate;
                }
            };
        });

        afterAll(() => {
            global.Date = originalDate;
        });

        it('should modify value of createdAt to current date if there is no _id', () => {
            const TimestampedClass = withTimestamps(Testclass);
            const TimestampedInstance = new TimestampedClass();


            TimestampedInstance.preSave();
            expect(TimestampedInstance.createdAt).toEqual(new Date());
            expect(TimestampedInstance.updatedAt).toEqual({ type: Date });
        });

        it('should modify value of updatedAt to current date if there is _id', () => {
            const TimestampedClass = withTimestamps(Testclass);
            const TimestampedInstance = new TimestampedClass(123);

            TimestampedInstance.preSave();
            expect(TimestampedInstance.updatedAt).toEqual(new Date());
            expect(TimestampedInstance.createdAt).toEqual({ type: Date });
        });
    });
});
