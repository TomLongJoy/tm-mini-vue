"use strict";
exports.__esModule = true;
exports.isProxy = exports.isReadonly = exports.isReactive = exports.shallowReadonly = exports.readonly = exports.reactive = void 0;
var baseHandlers_1 = require("./baseHandlers");
function reactive(raw) {
    return createActiveObject(raw, baseHandlers_1.mutableHandlers);
}
exports.reactive = reactive;
function readonly(raw) {
    return createActiveObject(raw, baseHandlers_1.readonlyHandlers);
}
exports.readonly = readonly;
function shallowReadonly(raw) {
    return createActiveObject(raw, baseHandlers_1.shallowReadonlyHandlers);
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
function createActiveObject(raw, baseHandlers) {
    return new Proxy(raw, baseHandlers);
}
