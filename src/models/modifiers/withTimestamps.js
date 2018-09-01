module.exports = (target) => {
    class WithTimestamps extends target {
        constructor(...args) {
            super(...args);

            this.createdAt = { type: Date };
            this.updatedAt = { type: Date };
        }

        preSave() {
            if (!this._id) {
                return this.createdAt = new Date();
            }
            return this.updatedAt = new Date();
        }
    }

    Reflect.defineProperty(WithTimestamps, 'name', { value: `${target.name}_${WithTimestamps.name}` });

    return WithTimestamps;
};
