"use strict";
exports.__esModule = true;
exports.createRender = void 0;
var effect_1 = require("../reactivity/effect");
var component_1 = require("./component");
var createApp_1 = require("./createApp");
var vnode_1 = require("./vnode");
function createRender(options) {
    var hostCreateElement = options.createElement, hostPatchProp = options.patchProp, hostInsert = options.insert;
    function render(vnode, container) {
        // patch 
        // 
        patch(null, vnode, container, null);
    }
    // n1 -> 老的
    //n2 -> 新的
    function patch(n1, n2, container, parentComponent) {
        // 去处理组件
        // 判断 是不是 element
        // todo 判断vnode 是不是一个element
        // 思考题：如何区分是 element / component 类型
        // ShapeFlags
        // vnode -> flag
        // element 
        var type = n2.type, shapeFlag = n2.shapeFlag;
        // Fragment -> children
        switch (type) {
            case vnode_1.Fragment:
                processFragment(n1, n2, container, parentComponent);
                break;
            case vnode_1.Text:
                processText(n1, n2, container);
                break;
            default:
                if (shapeFlag & 1 /* ELEMENT */) {
                    processElement(n1, n2, container, parentComponent);
                    // STATEFUL_COMPONENT 
                }
                else if (shapeFlag & 2 /* STATEFUL_COMPONENT */) {
                    processComponent(n1, n2, container, parentComponent);
                }
                break;
        }
    }
    function processElement(n1, n2, container, parentComponent) {
        if (!n1) {
            //init -> update
            mountElement(n2, container, parentComponent);
        }
        else {
            patchElement(n1, n2, container);
        }
    }
    function patchElement(n1, n2, container) {
        console.log("patchElement");
        console.log("n1", n1);
        console.log("n2", n2);
    }
    function mountElement(vnode, container, parentComponent) {
        // vnode -> element -> div
        var el = (vnode.el = hostCreateElement(vnode.type));
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
            hostPatchProp(el, key, val);
        }
        // container.append(el)
        hostInsert(el, container);
    }
    function mountChildren(vnode, container, parentComponent) {
        vnode.children.forEach(function (v) {
            patch(null, v, container, parentComponent);
        });
    }
    function processComponent(n1, n2, container, parentComponent) {
        mountComponent(n2, container, parentComponent);
    }
    function mountComponent(initialVNode, container, parentComponent) {
        var instance = component_1.createComponentInstance(initialVNode, parentComponent);
        component_1.setupComponent(instance);
        setupRenderEffect(instance, initialVNode, container);
    }
    function setupRenderEffect(instance, initialVNode, container) {
        effect_1.effect(function () {
            if (!instance.isMounted) {
                var proxy = instance.proxy;
                var subTree = (instance.subTree = instance.render.call(proxy));
                // vnode  -> patch 
                // vnode -> element -> 
                patch(null, subTree, container, instance);
                // element -> mount         // 
                initialVNode.el = subTree.el;
                instance.isMounted = true;
            }
            else {
                console.log("update");
                var proxy = instance.proxy;
                var subTree = instance.render.call(proxy);
                var prevSubTree = instance.subTree;
                instance.subTree = subTree;
                // console.log("subTree", subTree);
                // console.log("prev  ", prevSubTree);
                patch(prevSubTree, subTree, container, instance);
            }
        });
    }
    function processFragment(n1, n2, container, parentComponent) {
        // implement 
        mountChildren(n2, container, parentComponent);
    }
    function processText(n1, n2, container) {
        var children = n2.children;
        var textNode = (n2.el = document.createTextNode(children));
        container.append(textNode);
    }
    return {
        createApp: createApp_1.createAppApi(render)
    };
}
exports.createRender = createRender;
