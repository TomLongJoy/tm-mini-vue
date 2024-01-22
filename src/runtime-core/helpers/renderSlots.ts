import { Fragment, createVNode } from "../vnode";


export function renderSlots(slots, name, props) {

    const slot = slots[name];
    if (slot) {
        // function
        if (typeof slot === "function") {
            // children 是不可以有array 
            // 只需要把 chirldern 
            return createVNode(Fragment, {}, slot(props))


        }

    }

}