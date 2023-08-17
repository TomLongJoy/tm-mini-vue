"use strict";
exports.__esModule = true;
exports.readonlyHandlers = exports.mutableHandlers = void 0;
var effect_1 = require("./effect");
var get = createGetter();
var set = createSetter();
var readonlyGet = createGetter(true);
function createGetter(isReadOnly) {
    if (isReadOnly === void 0) { isReadOnly = false; }
    return function get(target, key) {
        var res = Reflect.get(target, key);
        if (!isReadOnly) {
            effect_1.track(target, key); ////info 收集依赖
        }
        return res;
    };
}
function createSetter() {
    return function set(target, key, value) {
        var res = Reflect.set(target, key, value);
        effect_1.trigger(target, key); // info 触发依赖
        return res;
    };
}
exports.mutableHandlers = {
    get: get,
    set: set
};
exports.readonlyHandlers = {
    get: readonlyGet,
    set: function (target, key, value) {
        console.warn("key:" + key + " set \u5931\u8D25\u56E0\u4E3A target \u662F readonly", target);
        return true;
    }
};
