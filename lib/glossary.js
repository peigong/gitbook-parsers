var _ = require("lodash");
var normall = require('normall');

// Normalize glossary
function normalize(glossary) {
	return _.map(glossary, function(entry) {
		entry.id = entryId(entry.name);
		return entry;
	});
}

// Normalizes a glossary entry's name to create an ID
function entryId(name) {
    return normall.filename(name.toLowerCase());
}

module.exports = {
	entryId: entryId,
	normalize: normalize
};
