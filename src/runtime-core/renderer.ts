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

    console.log(vnode.type)
    if (typeof vnode.type === "string") {
        processElemtn(vnode, container);
    } else if (isObject(vnode.type)) {
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

    const { children } = vnode;

    if (typeof children === "string") {
        el.textContent = children;
    } else if (Array.isArray(children)) {
        // vnode 
        mountChildren(vnode, el) // container 应该是el

    }
    // props 
    const { props } = vnode;
    for (const key in props) {
        const val = props[key];
        // todo setAttribute 需要了解下
        el.setAttribute(key, val);

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


