"use strict";
exports.__esModule = true;
var reactive_1 = require("../reactive");
describe("readonly", function () {
    it("happy path", function () {
        //not set
        var original = { foo: 1, bar: { baz: 2 } };
        var wrapped = reactive_1.readonly(original);
        expect(wrapped).not.toBe(1);
        expect(wrapped.foo).toBe(1);
    });
    it('warn then call set ', function () {
        // console.warn()
        // mock 
        console.warn = jest.fn();
        var user = reactive_1.readonly({
            age: 10
        });
        user.age = 11;
        expect(console.warn).toBeCalled();
    });
});
