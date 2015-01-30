var _ = require("lodash");

// Normalize langs
function normalize(entries) {
	return _.chain(entries)
        .filter(function(entry) {
            return Boolean(entry.path);
        })
        .map(function(entry) {
            return {
                title: entry.title.trim(),
                path: entry.path,
                lang: entry.path.replace("/", "")
            };
        })
        .value();
}

module.exports = {
	normalize: normalize
};
