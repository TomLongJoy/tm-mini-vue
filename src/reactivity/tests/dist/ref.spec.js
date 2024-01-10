"use strict";
exports.__esModule = true;
var effect_1 = require("../effect");
var ref_1 = require("../ref");
describe("ref", function () {
    it("happy path", function () {
        var a = ref_1.ref(1);
        expect(a.value).toBe(1);
    });
    it("should be reactive", function () {
        var a = ref_1.ref(1);
        var dummy;
        var calls = 0;
        effect_1.effect(function () {
            calls++;
            dummy = a.value;
        });
        expect(calls).toBe(1);
        expect(dummy).toBe(1);
        a.value = 2;
        expect(calls).toBe(2);
        expect(dummy).toBe(2);
        // same value should not trigger
        a.value = 2;
        expect(calls).toBe(3);
        expect(dummy).toBe(2);
    });
    it("should make nested properties reactive", function () {
        var a = ref_1.ref({
            count: 1
        });
        var dummy;
        effect_1.effect(function () {
            dummy = a.value.count;
        });
        expect(dummy).toBe(1);
        a.value.count = 2;
        expect(dummy).toBe(2);
    });
});
