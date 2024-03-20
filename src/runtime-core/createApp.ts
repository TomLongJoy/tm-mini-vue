/*
视频 20-实现初始化 component 主流程 5:03开始

*/

import { createVNode } from "./vnode";

export function createAppApi(render) {
    return function createApp(rootComponent) {
        return {
            mount(rootContainer) { // div#app
                // 先vnode 
                //component - vnode 
                //所有的逻辑操作，都会基于 vnode 做处理
                /*
                    const vnode = {
                        type,
                        props,
                        children,
                        component: null,
                        key: props && props.key,
                        shapeFlag: getShapeFlag(type),
                        el: null,
                    }
                */ 
               //  rootComponent 就是 main.js 中App = { name:"", render(){}, setup(){}}。
                const vnode = createVNode(rootComponent); 
                render(vnode, rootContainer); // renderer.ts 中的 render 函数.
            } 
        }
    }
}




