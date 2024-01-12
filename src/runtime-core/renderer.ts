import { ShapeFlags } from "../shared/ShapeFlags";
import { isObject } from "../shared/index";
import { createComponentInstance, setupComponent } from "./component";

export function render(vnode, container) {
    // patch 
    // 
    patch(vnode, container)


}

function patch(vnode, container) {

    // 去处理组件
    // 判断 是不是 element

    // todo 判断vnode 是不是一个element
    // 思考题：如何区分是 element / component 类型


    // ShapeFlags
    // vnode -> flag
    // element 

    const { shapeFlag } = vnode;
    if (shapeFlag & ShapeFlags.ELEMENT) {
        processElemtn(vnode, container);
        // STATEFUL_COMPONENT 
    } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        processComponent(vnode, container);
    }
}

function processElemtn(vnode: any, container: any) {
    //init -> update

    mountElement(vnode, container)
}

function mountElement(vnode: any, container: any) {

    // vnode -> element -> div
    const el = (vnode.el = document.createElement(vnode.type));

    const { children, shapeFlag } = vnode;

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
        el.textContent = children;
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // array_children 
        // vnode 
        mountChildren(vnode, el) // container 应该是el

    }
    // props 
    const { props } = vnode;
    for (const key in props) {
        const val = props[key];
        // console.log(key)
        // 具体的 click -> 通用

        // on + Event name
        //onMousedown 
        // debugger
        const isOn = (key: string) => /^on[A-Z]/.test(key);
        if (isOn(key)) {
            const event = key.slice(2).toLowerCase();
            el.addEventListener(event, val);
        } else {
            // todo setAttribute 需要了解下
            el.setAttribute(key, val);
        }
    }
    container.append(el)
}

function mountChildren(vnode, container) {

    vnode.children.forEach((v) => {
        patch(v, container)
    })

}

function processComponent(vnode: any, container: any) {

    mountComponent(vnode, container)
}

function mountComponent(initialVNode: any, container: any) {

    const instance = createComponentInstance(initialVNode)

    setupComponent(instance);
    setupRenderEffect(instance, initialVNode, container);

}

function setupRenderEffect(instance: any, initialVNode, container: any) {

    const { proxy } = instance;
    const subTree = instance.render.call(proxy);
    // vnode  -> patch 
    // vnode -> element -> 

    patch(subTree, container);

    // element -> mount 
    // 
    initialVNode.el = subTree.el
}


