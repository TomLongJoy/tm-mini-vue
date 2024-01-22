"use strict";
exports.__esModule = true;
exports.renderSlots = void 0;
var vnode_1 = require("../vnode");
function renderSlots(slots, name, props) {
    var slot = slots[name];
    if (slot) {
        // function
        if (typeof slot === "function") {
            // children 是不可以有array 
            // 只需要把 chirldern 
            return vnode_1.createVNode(vnode_1.Fragment, {}, slot(props));
        }
    }
}
exports.renderSlots = renderSlots;
