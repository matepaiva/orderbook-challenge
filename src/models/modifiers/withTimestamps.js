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

    // This changes the name of the class dinamically.
    // It is helpful for debugging, otherwise all Models would
    // appear to have the same name. If we call withTimestamps(User)
    // the class name will be User_WithTimestamps.
    Reflect.defineProperty(WithTimestamps, 'name', { value: `${target.name}_${WithTimestamps.name}` });

    return WithTimestamps;
};
