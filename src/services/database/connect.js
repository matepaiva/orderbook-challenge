const { connect } = require('camo');
const osTmpDir = require('os-tmpdir')();

const DB_SUFFIX = 'nedb://';

module.exports = () => connect(`${DB_SUFFIX}${osTmpDir}`);
