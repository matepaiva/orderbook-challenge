const express = require('express');

const config = require('./config');
const routes = require('./routes');
const errorHandler = require('./error-handler');

module.exports = () => {
    const app = express();

    config(app);
    routes(app);
    errorHandler(app);

    app.listen(3000);

    console.log('>> App running on port 3000.');
};
