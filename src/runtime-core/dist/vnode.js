"use strict";
exports.__esModule = true;
exports.createVNode = void 0;
function createVNode(type, props, children) {
    var vnode = {
        type: type,
        props: props,
        children: children,
        el: null
    };
    return vnode;
}
exports.createVNode = createVNode;
