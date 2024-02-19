"use strict";
exports.__esModule = true;
exports.transform = void 0;
function transform(root, options) {
    var context = createTransformContext(root, options);
    //1.遍历 - 深度优先搜索
    traversNode(root, context);
    //2. 修改 text content 
}
exports.transform = transform;
function traversNode(node, context) {
    var nodeTransforms = context.nodeTransforms;
    for (var i = 0; i < nodeTransforms.length; i++) {
        var transform_1 = nodeTransforms[i];
        transform_1(node);
    }
    traverseChildren(node, context);
}
function traverseChildren(node, context) {
    var children = node.children;
    if (children) {
        for (var i = 0; i < children.length; i++) {
            var node_1 = children[i];
            traversNode(node_1, context);
        }
    }
}
function createTransformContext(root, options) {
    var context = {
        root: root,
        nodeTransforms: options.nodeTransforms || []
    };
    return context;
}
