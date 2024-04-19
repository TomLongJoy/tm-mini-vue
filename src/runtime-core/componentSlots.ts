import { ShapeFlags } from "../shared/ShapeFlags";
export function initSlots(instance, children) {
    const { vnode } = instance;
    if (vnode.shapeFlag & ShapeFlags.SLOT_CHILDREN) {
        normalizeObjectSlots(children, instance.slots);
    }
}
function normalizeObjectSlots(children: any, slots: any) {
    for (const key in children) {
        const value = children[key];// value === function 
        debugger;// 看看值是什么         
        slots[key] = (props) => normalizeSlotValue(value(props));
        // slots[key] = (props) => {

        //     return normalizeSlotValue(value(props));
        // }
    }
}
function normalizeSlotValue(value) {
    return Array.isArray(value) ? value : [value];
}