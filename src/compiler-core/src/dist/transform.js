"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.transform = void 0;
var runtimeHelpers_1 = require("./runtimeHelpers");
function transform(root, options) {
    if (options === void 0) { options = {}; }
    var context = createTransformContext(root, options);
    //1. 遍历 - 深度优先搜索
    traverseNode(root, context);
    //2. 修改 nextcontent
    createRootCodegen(root);
    root.helpers = __spreadArrays(context.helpers.keys());
}
exports.transform = transform;
function traverseNode(node, context) {
    var nodeTransforms = context.nodeTransforms;
    var exitFns = [];
    for (var i_1 = 0; i_1 < nodeTransforms.length; i_1++) {
        var transform_1 = nodeTransforms[i_1];
        var onExit = transform_1(node, context);
        if (onExit)
            exitFns.push(onExit);
    }
    switch (node.type) {
        case 0 /* INTERPOLATION */:
            context.helper(runtimeHelpers_1.TO_DISPLAY_STRING);
            break;
        case 4 /* ROOT */:
        case 2 /* ELEMENT */:
            traverseChildren(node, context);
            break;
        default:
            break;
    }
    var i = exitFns.length;
    while (i--) {
        exitFns[i]();
    }
}
function traverseChildren(node, context) {
    var children = node.children;
    for (var i = 0; i < children.length; i++) {
        var node_1 = children[i];
        traverseNode(node_1, context);
    }
}
function createTransformContext(root, options) {
    var context = {
        root: root,
        nodeTransforms: options.nodeTransforms || [],
        helpers: new Map(),
        helper: function (key) {
            context.helpers.set(key, 1);
        }
    };
    return context;
}
function createRootCodegen(root) {
    var child = root.children[0];
    if (child.type === 2 /* ELEMENT */) {
        root.codegenNode = child.codegenNode;
    }
    else {
        root.codegenNode = root.children[0];
    }
}
