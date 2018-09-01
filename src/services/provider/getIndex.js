const firstIndex = require('./assets/first.json');
const updatedIndex = require('./assets/updated.json');

module.exports = (updated) => updated ? updatedIndex : firstIndex;
