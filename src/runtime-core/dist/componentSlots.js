"use strict";
exports.__esModule = true;
exports.initSlots = void 0;
function initSlots(instance, children) {
    // children object 
    // instance.slots = Array.isArray(children) ? children : [children];
    // slots 
    var vnode = instance.vnode;
    if (vnode.shapeFlag & 16 /* SLOT_CHILDREN */) {
        normalizeObjectSlots(children, instance.slots);
    }
}
exports.initSlots = initSlots;
function normalizeObjectSlots(children, slots) {
    var _loop_1 = function (key) {
        var value = children[key];
        slots[key] = function (props) { return normalizeSlotValue(value(props)); };
    };
    for (var key in children) {
        _loop_1(key);
    }
}
function normalizeSlotValue(value) {
    return Array.isArray(value) ? value : [value];
}
