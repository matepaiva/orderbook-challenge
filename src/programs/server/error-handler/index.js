const logger = require('winston');

module.exports = (app) => {
    /* eslint-disable-next-line */
    app.use((err, req, res, next) => {
        const env = req.app.get('env');

        logger.error(err);

        if (env !== 'development' && env !== 'test') delete err.stack;

        res.status(err.statusCode || 500).json(err);
    });
};
