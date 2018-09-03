const helmet = require('helmet');
const bodyParser = require('body-parser');

module.exports = (app) => {
    // Set HTTP headers to secure the requests
    app.use(helmet());

    // Accept POSTs with JSON body
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
};
