"use strict";
exports.__esModule = true;
// 0x000001
var effect_1 = require("../effect");
var reactive_1 = require("../reactive");
describe("happy path ", function () {
    test("happy path one", function () {
        var user = reactive_1.reactive({
            age: 10
        });
        var nextAge;
        effect_1.effect(function () {
            nextAge = user.age + 1;
        });
        expect(nextAge).toBe(11);
        // update 
        user.age++;
        expect(nextAge).toBe(12);
    });
    it("should return runner when call effect", function () {
        //1. effect(fn) -> function ( runner ) -> fn -> return;
        var foo = 10;
        var runner = effect_1.effect(function () {
            foo++;
            return "foo";
        });
        expect(foo).toBe(11);
        var r = runner();
        expect(foo).toBe(12);
        expect(r).toBe("foo");
    });
    // 从vue3复制来的。
    it("scheduler", function () {
        // 1.通过 effect 的第二个参数给定的一个 scheduler 的 fn
        // 2. effect 第一次执行的时候，还会执行fn
        // 3. 当响应式对象 set update 不执行 fn 而是执行 scheduler
        // 4. 如果说当执行 runner 的时候，会再次的执行 fn
        // 5.
        var dummy;
        var run;
        var scheduler = jest.fn(function () {
            run = runner;
        });
        var obj = reactive_1.reactive({ foo: 1 });
        var runner = effect_1.effect(function () {
            dummy = obj.foo;
        }, { scheduler: scheduler });
        expect(scheduler).not.toHaveBeenCalled();
        expect(dummy).toBe(1);
        // should be called on first trigger
        obj.foo++; // 这里 obj.foo = obje.foo + 1;  
        expect(scheduler).toHaveBeenCalledTimes(1);
        // obj.foo = obj.foo + 1;  
        // expect(scheduler).toHaveBeenCalledTimes(2);
        // // should not run yet
        expect(dummy).toBe(1);
        // // manually run
        run();
        // // should have run
        expect(dummy).toBe(2);
    });
    it("stop", function () {
        var dummy;
        var obj = reactive_1.reactive({ prop: 1 });
        var runner = effect_1.effect(function () {
            dummy = obj.prop;
        });
        obj.prop = 2;
        expect(dummy).toBe(2);
        effect_1.stop(runner);
        // obj.prop = 3;
        // get set 
        // obj.prop = obj.prop + 1;
        obj.prop++;
        expect(dummy).toBe(2);
        runner();
        expect(dummy).toBe(3);
    });
    it("onStop", function () {
        var obj = reactive_1.reactive({ foo: 1 });
        var onStop = jest.fn();
        var dummy;
        var runner = effect_1.effect(function () {
            dummy = obj.foo;
        }, {
            onStop: onStop
        });
        effect_1.stop(runner);
        expect(onStop).toBeCalledTimes(1);
    });
});
