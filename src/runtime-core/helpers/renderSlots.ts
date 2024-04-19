import { Fragment, createVNode } from "../vnode";
export function renderSlots(slots, name, props) {
    const slot = slots[name];
    if (slot) {
        // function
        if (typeof slot === "function") {
           //slot(props), 是个函数
            return createVNode(Fragment, {}, slot(props))
        }
    }
}