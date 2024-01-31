"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
exports.__esModule = true;
var h_1 = require("./h");
__createBinding(exports, h_1, "h");
var renderSlots_1 = require("./helpers/renderSlots");
__createBinding(exports, renderSlots_1, "renderSlots");
var vnode_1 = require("./vnode");
__createBinding(exports, vnode_1, "createTextVNode");
var component_1 = require("./component");
__createBinding(exports, component_1, "getCurrentInstance");
var apiInject_1 = require("./apiInject");
__createBinding(exports, apiInject_1, "provide");
__createBinding(exports, apiInject_1, "inject");
var renderer_1 = require("./renderer");
__createBinding(exports, renderer_1, "createRender");
var scheduler_1 = require("./scheduler");
__createBinding(exports, scheduler_1, "nextTick");
