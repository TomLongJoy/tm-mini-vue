"use strict";
exports.__esModule = true;
exports.createApp = void 0;
var renderer_1 = require("./renderer");
var vnode_1 = require("./vnode");
function createApp(rootComponent) {
    return {
        mount: function (rootContainer) {
            // 先vnode 
            //component - vnode 
            //所有的逻辑操作，都会基于 vnode 做处理
            var vnode = vnode_1.createVNode(rootComponent);
            renderer_1.render(vnode, rootContainer);
        }
    };
}
exports.createApp = createApp;
