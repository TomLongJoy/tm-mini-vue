"use strict";
exports.__esModule = true;
exports.toHandlerKey = exports.capitalize = exports.camelize = exports.hasOwn = exports.hasChanged = exports.isObject = exports.extend = void 0;
exports.extend = Object.assign;
exports.isObject = function (val) {
    return val !== null && typeof val === 'object';
};
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
