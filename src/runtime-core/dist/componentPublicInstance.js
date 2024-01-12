"use strict";
exports.__esModule = true;
exports.PublicInstancePoxyHandlers = void 0;
var index_1 = require("../shared/index");
var publicPropertiesMap = {
    $el: function (i) { return i.vnode.el; }
};
exports.PublicInstancePoxyHandlers = {
    get: function (_a, key) {
        var instance = _a._;
        // setupState 
        var setupState = instance.setupState, props = instance.props;
        if (key in setupState) {
            return setupState[key];
        }
        if (index_1.hasOwn(setupState, key)) {
            return setupState[key];
        }
        else if (index_1.hasOwn(props, key)) {
            return props[key];
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
