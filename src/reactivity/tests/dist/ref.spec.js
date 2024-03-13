"use strict";
exports.__esModule = true;
var effect_1 = require("../effect");
var reactive_1 = require("../reactive");
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
        expect(calls).toBe(2);
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
    it('isRef', function () {
        var a = ref_1.ref(1);
        var user = reactive_1.reactive({
            age: 1
        });
        expect(ref_1.isRef(a)).toBe(true);
        expect(ref_1.isRef(1)).toBe(false);
        expect(ref_1.isRef(user)).toBe(false);
    });
    it('unRef', function () {
        var a = ref_1.ref(1);
        var user = reactive_1.reactive({
            age: 1
        });
        expect(ref_1.unRef(a)).toBe(1);
        expect(ref_1.unRef(1)).toBe(1);
    });
    it("proxyRefs", function () {
        var user = {
            age: ref_1.ref(10),
            name: 'xiaohong'
        };
        var proxyUser = ref_1.proxyRefs(user);
        expect(user.age.value).toBe(10);
        expect(proxyUser.age).toBe(10);
        expect(proxyUser.name).toBe("xiaohong");
        // template
        // ref.value
        // vue3
        // setup() { return { ref }}
        proxyUser.age = 20;
        expect(proxyUser.age).toBe(20);
        expect(user.age.value).toBe(20);
        proxyUser.age = ref_1.ref(10);
        expect(proxyUser.age).toBe(10);
        expect(user.age.value).toBe(10);
    });
});
// isRef ->  unRef 
