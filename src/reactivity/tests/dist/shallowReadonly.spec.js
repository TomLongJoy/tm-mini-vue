"use strict";
exports.__esModule = true;
var reactive_1 = require("../reactive");
describe("shallowReadonly", function () {
    test("should not mak non-reactive properties reactive", function () {
        var props = reactive_1.shallowReadonly({ n: { foo: 1 } });
        expect(reactive_1.isReadonly(props)).toBe(true);
        expect(reactive_1.isReadonly(props.n)).toBe(false);
    });
    it('should call console.warn when set', function () {
        console.warn = jest.fn();
        var user = reactive_1.shallowReadonly({
            age: 10
        });
        user.age = 11;
        expect(console.warn).toBeCalled();
    });
});
