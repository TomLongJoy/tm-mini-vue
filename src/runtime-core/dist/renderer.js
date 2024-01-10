"use strict";
exports.__esModule = true;
exports.render = void 0;
var component_1 = require("./component");
function render(vnode, container) {
    // patch 
    // 
    patch(vnode, container);
}
exports.render = render;
function patch(vnode, container) {
    // 去处理组件
    // 判断 是不是 element
    processComponent(vnode, container);
}
function processComponent(vnode, container) {
    mountComponent(vnode, container);
}
function mountComponent(vnode, container) {
    var instance = component_1.createComponentInstance(vnode);
    component_1.setupComponent(instance);
    setupRenderEffect(instance, container);
}
function setupRenderEffect(instance, container) {
    var subTree = instance.render();
    // vnode  -> patch 
    // vnode -> element -> 
    patch(subTree, container);
}
