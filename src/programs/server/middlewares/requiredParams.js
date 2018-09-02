const { isNil, isEmpty } = require('lodash');
const errors = require('throw.js');

module.exports = (requiredParams = []) => (req, res, next) => {
    try {
        const params = { ...req.params, ...req.body, ...req.query };
        const missingParams = requiredParams.filter((param) => isNil(params[param]));

        if (!isEmpty(missingParams)) {
            return next(new errors.UnprocessableEntity());
        }

        res.locals.params = params;

        return next();
    } catch (error) {
        next(error);
    }
};
