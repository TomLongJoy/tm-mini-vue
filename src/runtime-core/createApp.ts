/*
视频 20-实现初始化 component 主流程 5:03开始

*/

import { createVNode } from "./vnode";

export function createAppApi(render) {
    return function createApp(rootComponent) {
        /*
        zlj -- 学了这么久，重新梳理下概念，会有助于理解
            组件：  组件就是 vnode.component.type，即 App = { name:"", render(){}, setup(){}}
                    .vue文件中template中的内容，会被编译成 render 函数，即 App.render = function(){ return {type:"div", children:"hello"}}
            容器：显示网页内容，html标签。
        */
        return {
            mount(rootContainer) { // div#app
               //  rootComponent 就是 main.js 中App = { name:"", render(){}, setup(){}}。
               debugger
                const vnode = createVNode(rootComponent); 
                render(vnode, rootContainer); // renderer.ts 中的 render 函数.
            } 
        }
    }
}