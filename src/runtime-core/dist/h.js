"use strict";
exports.__esModule = true;
exports.h = void 0;
var vnode_1 = require("./vnode");
function h(type, props, children) {
    return vnode_1.createVNode(type, props, children);
}
exports.h = h;
