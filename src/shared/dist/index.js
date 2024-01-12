"use strict";
exports.__esModule = true;
exports.hasOwn = exports.hasChanged = exports.isObject = exports.extend = void 0;
exports.extend = Object.assign;
exports.isObject = function (val) {
    return val !== null && typeof val === 'object';
};
exports.hasChanged = function (val, newValue) {
    return !Object.is(val, newValue);
};
exports.hasOwn = function (val, key) { return Object.prototype.hasOwnProperty.call(val, key); };
