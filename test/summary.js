var _ = require('lodash');
var assert = require('assert');

var summaryUtils = require('../lib/summary');

describe('Summary normalization', function () {
    var summary = summaryUtils.normalize([
        {
            title: "Test 1",
            path: "./test1.md"
        },
        {
            title: "Test 2",
            path: "hello\\test2.md",
            articles: [
                {
                    title: "Test 2.1",
                    path: "./test21.md"
                },
                {
                    title: "Test 2.2",
                    path: "./test22.md"
                }
            ]
        },
        {
            title: "Test 3"
        }
    ]);

    it('should normalize paths', function() {
        assert.equal(summary.chapters[1].path, "test1.md");
        assert.equal(summary.chapters[2].path, "hello/test2.md");
        assert.equal(summary.chapters[3].exists, false);
    });

    it('should normalize levels', function() {
        assert.equal(summary.chapters[1].level, "1");
        assert.equal(summary.chapters[2].level, "2");
        assert.equal(summary.chapters[2].articles[0].level, "2.1");
        assert.equal(summary.chapters[2].articles[1].level, "2.2");
    });
});
