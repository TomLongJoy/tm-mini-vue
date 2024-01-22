"use strict";
exports.__esModule = true;
exports.inject = exports.provide = void 0;
var component_1 = require("./component");
function provide(key, value) {
    var _a;
    // 存   
    //key value 
    var currentInstance = component_1.getCurrentInstance();
    if (currentInstance) {
        var provides = currentInstance.provides;
        var parentProvides = (_a = currentInstance.parent) === null || _a === void 0 ? void 0 : _a.provides;
        // init  
        if (provides === parentProvides) {
            provides = currentInstance.provides = Object.create(parentProvides);
        }
        provides[key] = value;
    }
}
exports.provide = provide;
function inject(key, defaultValue) {
    //取
    var currentInstance = component_1.getCurrentInstance();
    if (currentInstance) {
        var parent = currentInstance.parent;
        var parentProvides = currentInstance.parent.provides;
        if (key in parentProvides) {
            return parentProvides[key];
        }
        else if (defaultValue) {
            if (typeof defaultValue === "function") {
                return defaultValue();
            }
            return defaultValue;
        }
    }
}
exports.inject = inject;
