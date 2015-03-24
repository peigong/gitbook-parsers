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
            path: "hello\\test2.md"
        }
    ]);

    it('should normalize paths', function() {
        assert.equal(summary.chapters[1].path, "test1.md");
        assert.equal(summary.chapters[2].path, "hello/test2.md");
    });
});
