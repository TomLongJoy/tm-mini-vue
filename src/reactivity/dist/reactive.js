"use strict";
exports.__esModule = true;
exports.isProxy = exports.isReadonly = exports.isReactive = exports.shallowReadonly = exports.readonly = exports.reactive = void 0;
var index_1 = require("../shared/index");
var baseHandlers_1 = require("./baseHandlers");
function reactive(raw) {
    return createRctiveObject(raw, baseHandlers_1.mutableHandlers);
}
exports.reactive = reactive;
function readonly(raw) {
    return createRctiveObject(raw, baseHandlers_1.readonlyHandlers);
}
exports.readonly = readonly;
function shallowReadonly(raw) {
    return createRctiveObject(raw, baseHandlers_1.shallowReadonlyHandlers);
}
exports.shallowReadonly = shallowReadonly;
function isReactive(value) {
    return !!value["__v_isReactive" /* IS_REACTIVE */];
}
exports.isReactive = isReactive;
function isReadonly(value) {
    return !!value["__v_isReadonly" /* IS_READONLY */];
}
exports.isReadonly = isReadonly;
function isProxy(value) {
    return isReactive(value) || isReadonly(value);
}
exports.isProxy = isProxy;
function createRctiveObject(target, baseHandlers) {
    if (!index_1.isObject(target)) {
        console.warn("target " + target + " \u5FC5\u987B\u662F\u4E00\u4E2A\u5BF9\u8C61");
        return;
    }
    return new Proxy(target, baseHandlers);
}
