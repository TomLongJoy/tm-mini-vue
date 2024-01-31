"use strict";
exports.__esModule = true;
exports.createRender = void 0;
var effect_1 = require("../reactivity/effect");
var shared_1 = require("../shared");
var component_1 = require("./component");
var componentUpdateUtils_1 = require("./componentUpdateUtils");
var createApp_1 = require("./createApp");
var scheduler_1 = require("./scheduler");
var vnode_1 = require("./vnode");
function createRender(options) {
    // 此处的方法 在  runtime-dom\index.ts 里面实现
    var hostCreateElement = options.createElement, hostPatchProp = options.patchProp, hostInsert = options.insert, hostRemove = options.remove, hostSetElementText = options.setElementText;
    function render(vnode, container) {
        // patch 
        // 
        patch(null, vnode, container, null, null);
    }
    // n1 -> 老的
    //n2 -> 新的
    function patch(n1, n2, container, parentComponent, anchor) {
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
                processFragment(n1, n2, container, parentComponent, anchor);
                break;
            case vnode_1.Text:
                processText(n1, n2, container);
                break;
            default:
                if (shapeFlag & 1 /* ELEMENT */) {
                    processElement(n1, n2, container, parentComponent, anchor);
                    // STATEFUL_COMPONENT 
                }
                else if (shapeFlag & 2 /* STATEFUL_COMPONENT */) {
                    processComponent(n1, n2, container, parentComponent, anchor);
                }
                break;
        }
    }
    function processElement(n1, n2, container, parentComponent, anchor) {
        if (!n1) {
            //init -> update
            mountElement(n2, container, parentComponent, anchor);
        }
        else {
            // debugger
            patchElement(n1, n2, container, parentComponent, anchor);
        }
    }
    function patchElement(n1, n2, container, parentComponent, anchor) {
        var oldProps = n1.props || shared_1.EMPTY_OBJ;
        var newProps = n2.props || shared_1.EMPTY_OBJ;
        var el = (n2.el = n1.el);
        patchChildren(n1, n2, el, parentComponent, anchor);
        patchProps(el, oldProps, newProps);
    }
    function patchChildren(n1, n2, container, parentComponent, anchor) {
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
                mountChildren(c2, container, parentComponent, anchor);
            }
            else {
                patchKeyedChildren(c1, c2, container, parentComponent, anchor);
            }
        }
    }
    // todo 算法 
    function patchKeyedChildren(c1, c2, container, parentComponent, parentAnchor) {
        var l2 = c2.length;
        var i = 0;
        var e1 = c1.length - 1;
        var e2 = l2 - 1;
        function isSomeVNodeType(n1, n2) {
            //type 
            //key 
            return n1.type === n2.type && n1.key === n2.key;
        }
        //左侧
        while (i <= e1 && i <= e2) {
            var n1 = c1[i];
            var n2 = c2[i];
            if (isSomeVNodeType(n1, n2)) {
                patch(n1, n2, container, parentComponent, parentAnchor);
            }
            else {
                break;
            }
            i++;
        }
        //右侧
        while (i <= e1 && i <= e2) {
            var n1 = c1[e1];
            var n2 = c2[e2];
            if (isSomeVNodeType(n1, n2)) {
                patch(n1, n2, container, parentComponent, parentAnchor);
            }
            else {
                break;
            }
            e1--;
            e2--;
        }
        //3. 新的比老的多，创建
        if (i > e1) {
            if (i <= e2) {
                var nextPos = e2 + 1;
                var anchor = nextPos < l2 ? c2[nextPos].el : null;
                while (i <= e2) {
                    patch(null, c2[i], container, parentComponent, anchor);
                    i++;
                }
            }
        }
        else if (i >= e2) {
            while (i <= e1) {
                hostRemove(c1[i].el);
                i++;
            }
        }
        else {
            //todo 乱序的部分
            //中间对比
            var s1 = i;
            var s2 = i;
            var tobePatched = e2 - s2 + 1;
            var patched = 0;
            var keyToNewIndexMap = new Map();
            var newIndexToOldIndexMap = new Array(tobePatched);
            var moved = false;
            var maxNewIndexSoFar = 0;
            newIndexToOldIndexMap[i] = 0;
            for (var i_1 = 0; i_1 < tobePatched; i_1++) {
                newIndexToOldIndexMap[i_1] = 0;
            }
            for (var i_2 = s2; i_2 <= e2; i_2++) {
                var nextChild = c2[i_2];
                keyToNewIndexMap.set(nextChild.key, i_2);
            }
            // null undefined 
            for (var i_3 = s1; i_3 <= e1; i_3++) {
                var prevChild = c1[i_3];
                if (patched >= tobePatched) {
                    hostRemove(prevChild.el);
                    continue;
                }
                var newIndex = void 0;
                if (prevChild.key != null) {
                    newIndex = keyToNewIndexMap.get(prevChild.key);
                }
                else {
                    for (var j_1 = s2; j_1 < e2; j_1++) {
                        if (isSomeVNodeType(prevChild, c2[j_1])) {
                            newIndex = j_1;
                            break;
                        }
                    }
                }
                if (newIndex === undefined) {
                    hostRemove(prevChild.el);
                }
                else {
                    if (newIndex >= maxNewIndexSoFar) {
                        maxNewIndexSoFar = newIndex;
                    }
                    else {
                        moved = true;
                    }
                    newIndexToOldIndexMap[newIndex - s2] = i_3 + 1;
                    patch(prevChild, c2[newIndex], container, parentComponent, null);
                    patched++;
                }
            }
            var increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : [];
            var j = increasingNewIndexSequence.length - 1;
            for (var i_4 = (tobePatched - 1); i_4 >= 0; i_4--) {
                var nextindex = i_4 + s2;
                var nextChild = c2[nextindex];
                var anchor = nextindex + 1 < l2 ? c2[nextindex + 1].el : null;
                if (newIndexToOldIndexMap[i_4] === 0) {
                    patch(null, nextChild, container, parentComponent, anchor);
                }
                else if (moved) {
                    if (j < 0 || i_4 !== increasingNewIndexSequence[j]) {
                        console.log("移动位置");
                        hostInsert(nextChild.el, container, anchor);
                    }
                    else {
                        j--;
                    }
                }
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
    function mountElement(vnode, container, parentComponent, anchor) {
        // vnode -> element -> div
        var el = (vnode.el = hostCreateElement(vnode.type));
        var children = vnode.children, shapeFlag = vnode.shapeFlag;
        if (shapeFlag & 4 /* TEXT_CHILDREN */) {
            el.textContent = children;
        }
        else if (shapeFlag & 8 /* ARRAY_CHILDREN */) {
            // array_children 
            // vnode 
            mountChildren(vnode.children, el, parentComponent, anchor); // container 应该是el
        }
        // props 
        var props = vnode.props;
        for (var key in props) {
            var val = props[key];
            hostPatchProp(el, key, null, val);
        }
        // container.append(el)
        hostInsert(el, container, anchor);
    }
    function mountChildren(children, container, parentComponent, anchor) {
        children.forEach(function (v) {
            patch(null, v, container, parentComponent, anchor);
        });
    }
    function processComponent(n1, n2, container, parentComponent, anchor) {
        if (!n1) {
            mountComponent(n2, container, parentComponent, anchor);
        }
        else {
            updateComponent(n1, n2);
        }
    }
    function updateComponent(n1, n2) {
        var instance = (n2.component = n1.component);
        if (componentUpdateUtils_1.shouldUpdateComponent(n1, n2)) {
            instance.next = n2;
            instance.update();
        }
        else {
            n2.el = n1.el;
            instance.vnode = n2;
        }
    }
    function mountComponent(initialVNode, container, parentComponent, anchor) {
        var instance = (initialVNode.component = component_1.createComponentInstance(initialVNode, parentComponent));
        component_1.setupComponent(instance);
        setupRenderEffect(instance, initialVNode, container, anchor);
    }
    function setupRenderEffect(instance, initialVNode, container, anchor) {
        instance.update = effect_1.effect(function () {
            if (!instance.isMounted) {
                var proxy = instance.proxy;
                var subTree = (instance.subTree = instance.render.call(proxy));
                // vnode  -> patch 
                // vnode -> element -> 
                patch(null, subTree, container, instance, anchor);
                // element -> mount         // 
                initialVNode.el = subTree.el;
                instance.isMounted = true;
            }
            else {
                console.log("update");
                //需要一个 vnode 
                var next = instance.next, vnode = instance.vnode;
                if (next) {
                    next.el = vnode.el;
                    updateComponentPreRender(instance, next);
                }
                var proxy = instance.proxy;
                var subTree = instance.render.call(proxy);
                var prevSubTree = instance.subTree;
                instance.subTree = subTree;
                patch(prevSubTree, subTree, container, instance, anchor);
            }
        }, {
            scheduler: function () {
                console.log("update - scheduler ");
                scheduler_1.queueJobs(instance.update);
            }
        });
    }
    function processFragment(n1, n2, container, parentComponent, anchor) {
        // implement 
        mountChildren(n2.children, container, parentComponent, anchor);
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
function updateComponentPreRender(instance, nextVNode) {
    instance.vnode = nextVNode;
    instance.next = null;
    instance.props = nextVNode.props;
}
//  [4,2,3,1,5]  --->[2,3,5]
function getSequence(arr) {
    var p = arr.slice();
    var result = [0];
    var i, j, u, v, c;
    var len = arr.length;
    for (i = 0; i < len; i++) {
        var arrI = arr[i];
        if (arrI !== 0) {
            j = result[result.length - 1];
            if (arr[j] < arrI) {
                p[i] = j;
                result.push(i);
                continue;
            }
            u = 0;
            v = result.length - 1;
            while (u < v) {
                c = (u + v) >> 1;
                if (arr[result[c]] < arrI) {
                    u = c + 1;
                }
                else {
                    v = c;
                }
            }
            if (arrI < arr[result[u]]) {
                if (u > 0) {
                    p[i] = result[u - 1];
                }
                result[u] = i;
            }
        }
    }
    u = result.length;
    v = result[u - 1];
    while (u-- > 0) {
        result[u] = v;
        v = p[v];
    }
    return result;
}
