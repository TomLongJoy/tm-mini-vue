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
    // processElemtn();
    processComponent(vnode, container);
}

function processComponent(vnode: any, container: any) {

    mountComponent(vnode, container)
}

function mountComponent(vnode: any, container: any) {

    const instance = createComponentInstance(vnode)

    setupComponent(instance);
    setupRenderEffect(instance, container);

}


function setupRenderEffect(instance: any, container: any) {

    const subTree = instance.render();
    // vnode  -> patch 
    // vnode -> element -> 

    patch(subTree, container);


}