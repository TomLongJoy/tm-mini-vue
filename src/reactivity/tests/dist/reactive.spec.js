"use strict";
exports.__esModule = true;
// 0x000000
var reactive_1 = require("../reactive");
describe("reactive", function () {
    it("happy path ", function () {
        var original = { foo: 1 };
        /*
        Reflect
        Proxy
        */
        var observed = reactive_1.reactive(original);
        expect(observed).not.toBe(original);
        expect(observed.foo).toBe(1);
        expect(reactive_1.isReactive(observed)).toBe(true);
        expect(reactive_1.isReactive(original)).toBe(false);
        expect(reactive_1.isProxy(observed)).toBe(true);
    });
    test("nested reactive", function () {
        var original = {
            nested: {
                foo: 1
            },
            array: [{ bar: 2 }]
        };
        var observed = reactive_1.reactive(original);
        expect(reactive_1.isReactive(observed.nested)).toBe(true);
        expect(reactive_1.isReactive(observed.array)).toBe(true);
        expect(reactive_1.isReactive(observed.array[0])).toBe(true);
    });
});
