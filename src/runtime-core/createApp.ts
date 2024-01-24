import { createVNode } from "./vnode";


export function createAppApi(render) {

    return function createApp(rootComponent) {

        return {
            mount(rootContainer) {

                // 先vnode 
                //component - vnode 
                //所有的逻辑操作，都会基于 vnode 做处理
                const vnode = createVNode(rootComponent);

                render(vnode, rootContainer);

            }
        }
    }

}




