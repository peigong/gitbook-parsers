var _ = require("lodash");

// Normalize glossary
function normalize(glossary) {
	return _.map(glossary, function(entry) {
		entry.id = entryId(entry.name);
		return entry;
	});
}

// Normalizes a glossary entry's name to create an ID
function entryId(name) {
    return name.toLowerCase()
    	.replace(/[\/\\\?\%\*\:\;\|\"\'\\<\\>\#\$\(\)\!\.\@]/g, '')
    	.replace(/ /g, '_')
    	.trim();
}

module.exports = {
	entryId: entryId,
	normalize: normalize
};
