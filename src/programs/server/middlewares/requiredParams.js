const { isNil, isEmpty } = require('lodash');
const errors = require('throw.js');

// Check if requiredParams are being passed.
// If so, inject them into res.locals, as recommended by express.
// Otherwise, throw error.
module.exports = (requiredParams = []) => (req, res, next) => {
    try {
        const params = { ...req.body, ...req.query, ...req.params };
        const missingParams = requiredParams.filter((param) => isNil(params[param]));

        if (!isEmpty(missingParams)) {
            const errorMessage = `Missing required parameter(s): ${missingParams.join(', ')}.`;

            return next(new errors.UnprocessableEntity(errorMessage));
        }

        res.locals.params = params;

        return next();
    } catch (error) {
        next(error);
    }
};
