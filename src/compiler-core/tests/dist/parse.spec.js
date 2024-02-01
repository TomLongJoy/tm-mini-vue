"use strict";
exports.__esModule = true;
var parse_1 = require("../src/parse");
describe('Parse', function () {
    describe('interpolation', function () {
        test('simple interpolation', function () {
            var ast = parse_1.baseParse("{{message}}");
            //root
            expect(ast.children[0]).toStrictEqual({
                type: 0 /* INTERPOLATION */,
                content: {
                    type: 1 /* SIMPLE_EXPRESSION */,
                    content: "message"
                }
            });
        });
        describe('element', function () {
            it("simple element div ", function () {
                var ast = parse_1.baseParse("<div></div>");
                //root
                expect(ast.children[0]).toStrictEqual({
                    type: 2 /* ELEMENT */,
                    tag: "div"
                });
            });
        });
        describe('text', function () {
            it("simple text", function () {
                var ast = parse_1.baseParse("some text");
                expect(ast.children[0]).toStrictEqual({
                    type: 3 /* TEXT */,
                    context: "some text"
                });
            });
        });
    });
});
