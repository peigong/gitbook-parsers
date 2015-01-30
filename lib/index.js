var Q = require("q");
var _ = require("lodash");
var path = require("path");

var summaryUtils = require("./summary");
var glossaryUtils = require("./glossary");
var langsUtils = require("./langs");

// This list is ordered by priority of parsers to use
var PARSERS = _.chain([
		{
			name: "markdown",
			extensions: [".md", ".markdown", ".mdown"],
			parser: require("gitbook-markdown")
		},
		{
			name: "asciidoc",
			extensions: [".adoc", ".asciidoc"],
			parser: require("gitbook-asciidoc")
		},
		{
			name: "restructuredtext",
			extensions: [".rst"],
			parser: require("gitbook-restructuredtext")
		}
	])
	.map(function(type) {
		if (!type.parser) return null;
		type.parser = composeParser(type.parser);
		return type;
	})
	.compact()
	.value();

// Wrap Q
function wrapQ(func) {
	return _.wrap(func, function(_func) {
		var args = Array.prototype.slice.call(arguments, 1);
		return Q()
		.then(function() {
			return _func.apply(null, args)
		})
	});
}

// Prepare and compose a parser
function composeParser(parser) {
	var oldSummaryParser = wrapQ(parser.summary);
	return {
		summary: function(src, options) {
			return oldSummaryParser(src)
			.then(function(summary) {
				return summaryUtils.normalize(summary, options);
			});
		},
		glossary: wrapQ(_.compose(glossaryUtils.normalize, parser.glossary)),
		langs: wrapQ(_.compose(langsUtils.normalize, parser.langs)),
		readme: wrapQ(parser.readme),
		page: wrapQ(parser.page)
	};
	return parser;
};

// Return a specific parser according to an extension
function getParser(ext) {
	return _.find(PARSERS, function(input) {
		return _.contains(input.extensions, ext);
	});
}

// Return parser for a file
function getParserForFile(filename) {
	return getParser(path.extname(filename));
};

module.exports = {
	all: PARSERS,
	extensions: _.flatten(_.pluck(PARSERS, "extensions")),
	get: getParser,
	getForFile: getParserForFile,
	glossary: {
		entryId: glossaryUtils.entryId
	}
};
