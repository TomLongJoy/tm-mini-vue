"use strict";
exports.__esModule = true;
var test_class_1 = require("../test-class");
describe("reactive", function () {
    it.only('objcet', function () {
        var obj1 = {};
        var obj2 = obj1;
        obj2.name = "Xxx";
        console.log(obj1.name); //
        expect(obj1).toBe(obj2);
    });
    it("tes-js-class", function () {
        var benz = new test_class_1.Car("舒马赫", "benz");
        benz.age = 10;
        var putlog = benz.drive();
        expect(putlog).toBe(true);
    });
    it("set-map", function () {
        var mySet = new Set([1, 2, 3]);
        mySet.add(2);
        debugger;
    });
});
