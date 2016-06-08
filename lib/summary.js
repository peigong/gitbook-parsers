var _ = require("lodash");
var url = require("url");
var path = require("path");

var counter = 1, // 页码计数器
    conf = {
        hasEntryPoint: false, // 目录中是否强制包含入口README.md文件
        useRealNumber: true, // 目录中是否使用实际的页码
        startPageNumber: 6 // 正文起始页码
    };

// Is the link an external link
var isExternal = function(href) {
    try {
        return Boolean(url.parse(href).protocol);
    } catch(err) { }

    return false;
};

function defaultChapterList(chapterList, options) {
    // Check if introduction node was specified in SUMMARY.md
    var hasIntro = _.find(chapterList, function(entry) {
        return normalizePath(entry.path) == normalizePath(options.entryPoint);
    });

    if (hasIntro) return chapterList;

    // It wasn't specified, so add in default
    var items = [];
    if(conf.hasEntryPoint){
        items.push({
            path: options.entryPoint,
            title: options.entryPointTitle
        });
    }
    return items.concat(chapterList);
}

// Normalize path
// 1. Convert Window's "\" to "/"
// 2. Remove leading "/" if exists
function normalizePath(p) {
    if (!p) return p;
    return path.normalize(p).replace(/\\/g, '/').replace(/^\/+/, '');
}

function normalizeChapters(chapterList, options, level, base, paths) {
    base = base || 0;
    paths = paths || {};

    var i = base;

    return _.chain(chapterList)
        .map(function(chapter) {
            chapter.path = normalizePath(chapter.path);

            // Ignore multiple entries with same filename
            if (chapter.path){
                if(paths[chapter.path]) return null;
                paths[chapter.path] = true;
            }

            if(conf.useRealNumber){
                chapter.level = counter + '';
            }else{
                chapter.level = (level? [level || "", i] : [i]).join(".");
            }
            chapter.external = isExternal(chapter.path);
            chapter.exists = chapter.path? (
                chapter.external ||
                !options.files ||
                !!_.find(options.files, function(f) { return normalizePath(f) == chapter.path; })
            ) : false;

            var articles = chapter.articles || [];
            if(0 === articles.length){
                var sep = '@',
                    nums = 1, // 所占的页码数量
                    arr = chapter.title.split(sep);
                if(arr.length > 1){
                    nums = arr.pop();
                    nums *= 1;
                    nums = isNaN(nums) ? 1 : nums;
                }
                chapter.title = arr.join(sep);
                counter += nums;
            }
            i = i + 1;
            return {
                path: chapter.path,
                title: chapter.title.trim(),
                level: chapter.level,
                articles: normalizeChapters(articles, options, chapter.level, 1, paths),
                exists: chapter.exists,
                external: chapter.external,
                introduction: chapter.path == options.entryPoint
            };
        })
        .compact()
        .value();
};


function normalizeSummary(summary, options) {
    counter = conf.startPageNumber; // 重置页面计数器
    options = _.defaults(options || {}, {
        entryPoint: "README.md",
        entryPointTitle: "Introduction",
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
