var _ = require("lodash");
var url = require("url");

// Is the link an external link
var isExternal = function(href) {
    try {
        return Boolean(url.parse(href).protocol);
    } catch(err) { }

    return false;
};

function defaultChapterList(chapterList, options) {
    var first = _.first(chapterList);

    // Check if introduction node was specified in SUMMARY.md
    if (first && first.path == options.entryPoint) {
        return chapterList;
    }

    // It wasn't specified, so add in default
    return [
        {
        	path: options.entryPoint,
        	title: options.entryPointTitle
        }
    ].concat(chapterList);
}

function normalizeChapters(chapterList, options, level, base) {
	var i = base || 0;
	return _.map(chapterList, function(chapter) {
		chapter.level = (level? [level || "", i] : [i]).join(".");
		chapter.external = isExternal(chapter.path);
        chapter.exists = (chapter.external || !options.files || _.contains(options.files, chapter.path));

		i = i + 1;
		return {
            path: chapter.path,
            title: chapter.title.trim(),
            level: chapter.level,
            articles: normalizeChapters(chapter.articles || [], options, chapter.level, 1),
            exists: chapter.exists,
            external: chapter.external,
            introduction: chapter.path == options.entryPoint
        };
	});
};

function normalizeSummary(summary, options) {
    options = _.defaults(options || {}, {
        entryPoint: "README.md",
        entryPointTitle: "introduction",
        files: null
    })

	if (_.isArray(summary)) summary = { chapters: summary };
    summary.chapters = defaultChapterList(summary.chapters, options);
	summary.chapters = normalizeChapters(summary.chapters, options);
	return summary;
};

module.exports = {
	normalize: normalizeSummary
};
