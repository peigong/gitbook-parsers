var _ = require("lodash");
var path = require("path");

var summaryUtils = require("./summary");
var glossaryUtils = require("./glossary");

// This list is ordered by priority of parsers to use
var PARSER = [
	{
		name: "markdown",
		extensions: [".md", ".markdown"],
		parser: composeParser(require("gitbook-markdown"))
	},
	{
		name: "asciidoc",
		extensions: [".adoc", ".asciidoc"],
		parser: composeParser(require("gitbook-asciidoc"))
	}
];

// Prepare and compose a parser
function composeParser(parser) {
	parser.summary = _.compose(summaryUtils.normalize, parser.summary);
	parser.glossary = _.compose(glossaryUtils.normalize, parser.glossary);
	return parser;
};

// Return a specific parser according to an extension
function getParser(ext) {
	return _.find(PARSER, function(input) {
		return _.contains(input.extensions, ext);
	});
}

// Return parser for a file
function getParserForFile(filename) {
	return getParser(path.extname(filename));
};

module.exports = {
	extensions: _.flatten(_.pluck(PARSER, "extensions")),
	get: getParser,
	getForFile: getParserForFile,
	glossary: {
		entryId: glossaryUtils.entryId
	}
};
