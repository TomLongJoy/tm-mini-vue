"use strict";
exports.__esModule = true;
var codegen_1 = require("../src/codegen");
var parse_1 = require("../src/parse");
var transform_1 = require("../src/transform");
describe('codegen', function () {
    it('string', function () {
        var ast = parse_1.baseParse("hi");
        transform_1.transform(ast);
        var code = codegen_1.generate(ast).code;
        //快照 
        //1. 抓bug
        //2. 有意
        expect(code).toMatchSnapshot();
    });
});
