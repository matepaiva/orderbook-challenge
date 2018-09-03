const errors = require('throw.js');

module.exports = (app) => {
    /* eslint-disable-next-line */
    app.use((err, req, res, next) => {
        console.log(err);

        const error = err.statusCode ? err : new errors.InternalServerError(err.message);

        res.status(error.statusCode).json(error);
    });
};
