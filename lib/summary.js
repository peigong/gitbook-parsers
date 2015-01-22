var _ = require("lodash");

// Is the link an external link
var isExternal = function(href) {
    try {
        return Boolean(url.parse(href).protocol);
    } catch(err) { }

    return false;
};


function normalizeChapters(chapterList, level, base) {
	var i = base || 0;
	return _.map(chapterList, function(chapter) {
		chapter.level = (level? [level || "", i] : [i]).join(".");
		chapter.exteral = isExternal(chapter.path);
		chapter.article = normalizeChapters(chapter.articles || [], chapter.level, 1);

		i = i + 1;
		return chapter;
	});
};

function normalizeSummary(summary) {
	if (_.isArray(summary)) summary = { chapters: summary };
	summary.chapters = normalizeChapters(summary.chapters);
	return summary;
};

module.exports = {
	normalize: normalizeSummary
};
