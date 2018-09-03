const firstIndex = require('./assets/first.json');
const updatedIndex = require('./assets/updated.json');

// This is faking a request to a third party service.
// If update is true, we get the updated mock index.
// Otherwise, we get the first one.
module.exports = (updated) => updated ? updatedIndex : firstIndex;
