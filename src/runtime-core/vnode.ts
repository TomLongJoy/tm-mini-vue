import { ShapeFlags } from "../shared/ShapeFlags";
export const Fragment = Symbol("Fragment");
export const Text = Symbol("Text");
export { createVNode as createElementVNode }
/**
 * 创建一个虚拟节点（VNode）
 * @param type 节点的类型，可以是字符串（代表HTML标签）或者构造函数（代表组件）
 * @param props 节点的属性对象，可选
 * @param children 节点的子元素，可以是字符串、数组或者另一个虚拟节点，可选
 * @returns 返回一个虚拟节点对象
 */
export function createVNode(type, props?, children?) {
    const vnode = {
        type,// string <元素> 或者 object <组件>
        props,
        children,
        component: null,
        key: props && props.key,
        shapeFlag: getShapeFlag(type),
        el: null, // $el 
    }
    if (typeof children === 'string') {
        vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN;
       
    } else if (Array.isArray(children)) {
        vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN;
    }
    // 组件 + children object 
    if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        if (typeof children === 'object') {
            vnode.shapeFlag |= ShapeFlags.SLOT_CHILDREN; // zlj 是个地方写错，导致报错
        }
    }
    if(vnode.shapeFlag & ShapeFlags.ELEMENT){
        console.log(`创建element元素 type:${type} -- ${JSON.stringify(props)}`)
    }else if(vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT){
        console.log(`创建component组件type.name=${type.name}`)
    }
    // debugger
    return vnode;
}

export function createTextVNode(text: string) {
    return createVNode(Text, {}, text)
}
function getShapeFlag(type) {
    return typeof type === 'string'
        ? ShapeFlags.ELEMENT
        : ShapeFlags.STATEFUL_COMPONENT;
}