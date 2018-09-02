const { isNil, isEmpty } = require('lodash');
const errors = require('throw.js');

module.exports = (requiredParams = []) => (req, res, next) => {
    try {
        const params = { ...req.params, ...req.body, ...req.query };
        const missingParams = requiredParams.filter((param) => isNil(params[param]));

        if (!isEmpty(missingParams)) {
            const errorMessage = `Missing required parameter(s): ${missingParams.join(', ')}.`;

            return next(new errors.UnprocessableEntity(errorMessage));
        }

        res.locals.params = params;

        return next();
    } catch (error) {
        console.log(error);
        next(error);
    }
};
