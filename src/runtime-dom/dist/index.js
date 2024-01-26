"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
exports.__esModule = true;
exports.createApp = void 0;
var runtime_core_1 = require("../runtime-core"); //  "moduleResolution": "node10", zlj 
function createElement(type) {
    return document.createElement(type);
}
function patchProp(el, key, val) {
    // console.log(key)
    // 具体的 click -> 通用
    // on + Event name
    //onMousedown 
    // debugger
    var isOn = function (key) { return /^on[A-Z]/.test(key); };
    if (isOn(key)) {
        var event = key.slice(2).toLowerCase();
        el.addEventListener(event, val);
    }
    else {
        // todo setAttribute 需要了解下
        el.setAttribute(key, val);
    }
}
function insert(el, parent) {
    parent.append(el);
}
var renderer = runtime_core_1.createRender({
    createElement: createElement,
    patchProp: patchProp,
    insert: insert
});
function createApp() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return renderer.createApp.apply(renderer, args);
}
exports.createApp = createApp;
__exportStar(require("../runtime-core"), exports);
