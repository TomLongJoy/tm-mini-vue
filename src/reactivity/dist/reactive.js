"use strict";
exports.__esModule = true;
exports.readonly = exports.reactive = void 0;
var baseHandlers_1 = require("./baseHandlers");
function reactive(raw) {
    return createActiveObject(raw, baseHandlers_1.mutableHandlers);
}
exports.reactive = reactive;
function readonly(raw) {
    return createActiveObject(raw, baseHandlers_1.readonlyHandlers);
}
exports.readonly = readonly;
function createActiveObject(raw, baseHandlers) {
    return new Proxy(raw, baseHandlers);
}
