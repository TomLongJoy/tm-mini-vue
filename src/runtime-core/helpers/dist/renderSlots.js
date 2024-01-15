"use strict";
exports.__esModule = true;
exports.renderSlots = void 0;
var vnode_1 = require("../vnode");
function renderSlots(slots, name, props) {
    var slot = slots[name];
    if (slot) {
        // function
        if (typeof slot === "function") {
            return vnode_1.createVNode("div", {}, slot(props));
        }
    }
}
exports.renderSlots = renderSlots;
