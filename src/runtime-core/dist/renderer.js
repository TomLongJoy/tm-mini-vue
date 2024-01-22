"use strict";
exports.__esModule = true;
exports.render = void 0;
var component_1 = require("./component");
var vnode_1 = require("./vnode");
function render(vnode, container) {
    // patch 
    // 
    patch(vnode, container, null);
}
exports.render = render;
function patch(vnode, container, parentComponent) {
    // 去处理组件
    // 判断 是不是 element
    // todo 判断vnode 是不是一个element
    // 思考题：如何区分是 element / component 类型
    // ShapeFlags
    // vnode -> flag
    // element 
    var type = vnode.type, shapeFlag = vnode.shapeFlag;
    // Fragment -> children
    switch (type) {
        case vnode_1.Fragment:
            processFragment(vnode, container, parentComponent);
            break;
        case vnode_1.Text:
            processText(vnode, container);
            break;
        default:
            if (shapeFlag & 1 /* ELEMENT */) {
                processElement(vnode, container, parentComponent);
                // STATEFUL_COMPONENT 
            }
            else if (shapeFlag & 2 /* STATEFUL_COMPONENT */) {
                processComponent(vnode, container, parentComponent);
            }
            break;
    }
}
function processElement(vnode, container, parentComponent) {
    //init -> update
    mountElement(vnode, container, parentComponent);
}
function mountElement(vnode, container, parentComponent) {
    // vnode -> element -> div
    var el = (vnode.el = document.createElement(vnode.type));
    var children = vnode.children, shapeFlag = vnode.shapeFlag;
    if (shapeFlag & 4 /* TEXT_CHILDREN */) {
        el.textContent = children;
    }
    else if (shapeFlag & 8 /* ARRAY_CHILDREN */) {
        // array_children 
        // vnode 
        mountChildren(vnode, el, parentComponent); // container 应该是el
    }
    // props 
    var props = vnode.props;
    for (var key in props) {
        var val = props[key];
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
    container.append(el);
}
function mountChildren(vnode, container, parentComponent) {
    vnode.children.forEach(function (v) {
        patch(v, container, parentComponent);
    });
}
function processComponent(vnode, container, parentComponent) {
    mountComponent(vnode, container, parentComponent);
}
function mountComponent(initialVNode, container, parentComponent) {
    var instance = component_1.createComponentInstance(initialVNode, parentComponent);
    component_1.setupComponent(instance);
    setupRenderEffect(instance, initialVNode, container);
}
function setupRenderEffect(instance, initialVNode, container) {
    var proxy = instance.proxy;
    var subTree = instance.render.call(proxy);
    // vnode  -> patch 
    // vnode -> element -> 
    patch(subTree, container, instance);
    // element -> mount 
    // 
    initialVNode.el = subTree.el;
}
function processFragment(vnode, container, parentComponent) {
    // implement 
    mountChildren(vnode, container, parentComponent);
}
function processText(vnode, container) {
    var children = vnode.children;
    var textNode = (vnode.el = document.createTextNode(children));
    container.append(textNode);
}
