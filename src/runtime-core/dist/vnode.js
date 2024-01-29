"use strict";
exports.__esModule = true;
exports.createTextVNode = exports.createVNode = exports.Text = exports.Fragment = void 0;
exports.Fragment = Symbol("Fragment");
exports.Text = Symbol("Text");
function createVNode(type, props, children) {
    var vnode = {
        type: type,
        props: props,
        children: children,
        component: null,
        key: props && props.key,
        shapeFlag: getShapeFlag(type),
        el: null
    };
    // debugger
    //children
    if (typeof children === 'string') {
        vnode.shapeFlag |= 4 /* TEXT_CHILDREN */;
    }
    else if (Array.isArray(children)) {
        vnode.shapeFlag |= 8 /* ARRAY_CHILDREN */;
    }
    // 组件 + children object 
    if (vnode.shapeFlag & 2 /* STATEFUL_COMPONENT */) {
        if (typeof children === 'object') {
            vnode.shapeFlag |= 16 /* SLOT_CHILDREN */; // zlj 是个地方写错，导致报错
        }
    }
    return vnode;
}
exports.createVNode = createVNode;
function createTextVNode(text) {
    return createVNode(exports.Text, {}, text);
}
exports.createTextVNode = createTextVNode;
function getShapeFlag(type) {
    return typeof type === 'string'
        ? 1 /* ELEMENT */
        : 2 /* STATEFUL_COMPONENT */;
}
