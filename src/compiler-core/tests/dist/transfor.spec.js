"use strict";
exports.__esModule = true;
var parse_1 = require("../src/parse");
var transform_1 = require("../src/transform");
describe('transform', function () {
    it('happy path ', function () {
        var ast = parse_1.baseParse("<div>hi,{{message}}</div>");
        var plugin = function (node) {
            if (node.type === 3 /* TEXT */) {
                node.content += "mini-vue";
            }
        };
        transform_1.transform(ast, {
            nodeTransforms: [plugin]
        });
        var nodeText = ast.children[0].children[0];
        expect(nodeText.content).toBe("hi,mini-vue");
    });
});
