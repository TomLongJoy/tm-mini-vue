"use strict";
exports.__esModule = true;
exports.PublicInstancePoxyHandlers = void 0;
var publicPropertiesMap = {
    $el: function (i) { return i.vnode.el; }
};
exports.PublicInstancePoxyHandlers = {
    get: function (_a, key) {
        var instance = _a._;
        // setupState 
        var setupState = instance.setupState;
        if (key in setupState) {
            return setupState[key];
        }
        // key -> $el
        // if (key === '$el') {
        //     return instance.vnode.el;
        // }
        var publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
    }
};
