"use strict";
exports.__esModule = true;
exports.toHandlerKey = exports.capitalize = exports.camelize = exports.hasOwn = exports.hasChanged = exports.isString = exports.isObject = exports.EMPTY_OBJ = exports.extend = void 0;
exports.extend = Object.assign;
exports.EMPTY_OBJ = {};
exports.isObject = function (val) {
    return val !== null && typeof val === 'object';
};
exports.isString = function (value) { return typeof value === "string"; };
exports.hasChanged = function (val, newValue) {
    return !Object.is(val, newValue);
};
exports.hasOwn = function (val, key) { return Object.prototype.hasOwnProperty.call(val, key); };
exports.camelize = function (str) {
    return str.replace(/-(\w)/g, function (_, c) {
        return c ? c.toUpperCase() : "";
    });
};
exports.capitalize = function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
exports.toHandlerKey = function (str) {
    return str ? "on" + exports.capitalize(str) : "";
};
