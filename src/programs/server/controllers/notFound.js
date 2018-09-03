const errors = require('throw.js');

module.exports = (req, res, next) => next(new errors.NotFound());
