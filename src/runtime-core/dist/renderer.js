"use strict";
exports.__esModule = true;
exports.render = void 0;
var index_1 = require("../shared/index");
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
    // todo 判断vnode 是不是一个element
    // 思考题：如何区分是 element / component 类型
    console.log(vnode.type);
    if (typeof vnode.type === "string") {
        processElemtn(vnode, container);
    }
    else if (index_1.isObject(vnode.type)) {
        processComponent(vnode, container);
    }
}
function processElemtn(vnode, container) {
    //init -> update
    mountElement(vnode, container);
}
function mountElement(vnode, container) {
    var el = document.createElement(vnode.type);
    var children = vnode.children;
    if (typeof children === "string") {
        el.textContent = children;
    }
    else if (Array.isArray(children)) {
        // vnode 
        mountChildren(vnode, el); // container 应该是el
    }
    // props 
    var props = vnode.props;
    for (var key in props) {
        var val = props[key];
        // todo setAttribute 需要了解下
        el.setAttribute(key, val);
    }
    container.append(el);
}
function mountChildren(vnode, container) {
    vnode.children.forEach(function (v) {
        patch(v, container);
    });
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
