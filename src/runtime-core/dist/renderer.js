"use strict";
exports.__esModule = true;
exports.createRender = void 0;
var effect_1 = require("../reactivity/effect");
var shared_1 = require("../shared");
var component_1 = require("./component");
var createApp_1 = require("./createApp");
var vnode_1 = require("./vnode");
function createRender(options) {
    // 此处的方法 在  runtime-dom\index.ts 里面实现
    var hostCreateElement = options.createElement, hostPatchProp = options.patchProp, hostInsert = options.insert, hostRemove = options.remove, hostSetElementText = options.setElementText;
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
            // debugger
            patchElement(n1, n2, container, parentComponent);
        }
    }
    function patchElement(n1, n2, container, parentComponent) {
        console.log("patchElement");
        console.log("n1", n1);
        console.log("n2", n2);
        var oldProps = n1.props || shared_1.EMPTY_OBJ;
        var newProps = n2.props || shared_1.EMPTY_OBJ;
        var el = (n2.el = n1.el);
        patchChildren(n1, n2, el, parentComponent);
        patchProps(el, oldProps, newProps);
    }
    function patchChildren(n1, n2, container, parentComponent) {
        var prevShapeFlag = n1.shapeFlag;
        var shapeFlag = n2.shapeFlag;
        var c1 = n1.children;
        var c2 = n2.children;
        if (shapeFlag & 4 /* TEXT_CHILDREN */) {
            if (prevShapeFlag & 8 /* ARRAY_CHILDREN */) {
                //1.把老的children清空
                unmountChildren(n1.children);
                //2. 设置 text 
                // hostSetElementText(container, c2)
            }
            if (c1 !== c2) {
                hostSetElementText(container, c2);
            }
        }
        else {
            //new array 
            if (prevShapeFlag & 4 /* TEXT_CHILDREN */) {
                hostSetElementText(container, "");
                mountChildren(c2, container, parentComponent);
            }
        }
    }
    function unmountChildren(children) {
        for (var i = 0; i < children.length; i++) {
            var el = children[i].el;
            //remove 
            // 同  insert 一样
            hostRemove(el);
        }
    }
    function patchProps(el, oldProps, newProps) {
        if (oldProps !== newProps) {
            for (var key in newProps) {
                var prevProp = oldProps[key];
                var nextProp = newProps[key];
                if (prevProp !== nextProp) {
                    hostPatchProp(el, key, prevProp, nextProp);
                }
            }
            if (oldProps !== shared_1.EMPTY_OBJ) {
                for (var key in oldProps) {
                    if (!(key in newProps)) {
                        hostPatchProp(el, key, oldProps[key], null);
                    }
                }
            }
        }
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
            mountChildren(vnode.children, el, parentComponent); // container 应该是el
        }
        // props 
        var props = vnode.props;
        for (var key in props) {
            var val = props[key];
            hostPatchProp(el, key, null, val);
        }
        // container.append(el)
        hostInsert(el, container);
    }
    function mountChildren(children, container, parentComponent) {
        children.forEach(function (v) {
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
        mountChildren(n2.children, container, parentComponent);
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
