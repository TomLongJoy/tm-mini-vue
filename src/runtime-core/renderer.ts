import { ShapeFlags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { createAppApi } from "./createApp";
import { Fragment, Text } from "./vnode";

export function createRender(options) {

    const {
        createElement: hostCreateElement,
        patchProp: hostPatchProp,
        insert: hostInsert,
    } = options;

    function render(vnode, container,) {
        // patch 
        // 
        patch(vnode, container, null)
    }

    function patch(vnode, container, parentComponent: any) {

        // 去处理组件
        // 判断 是不是 element
        // todo 判断vnode 是不是一个element
        // 思考题：如何区分是 element / component 类型
        // ShapeFlags
        // vnode -> flag
        // element 
        const { type, shapeFlag } = vnode;
        // Fragment -> children
        switch (type) {
            case Fragment:
                processFragment(vnode, container, parentComponent);
                break;
            case Text:
                processText(vnode, container);
                break;
            default:
                if (shapeFlag & ShapeFlags.ELEMENT) {
                    processElement(vnode, container, parentComponent);
                    // STATEFUL_COMPONENT 
                } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
                    processComponent(vnode, container, parentComponent);
                }
                break;
        }

    }

    function processElement(vnode: any, container: any, parentComponent: any) {
        //init -> update
        mountElement(vnode, container, parentComponent)
    }

    function mountElement(vnode: any, container: any, parentComponent: any) {

        // vnode -> element -> div
        const el = (vnode.el = hostCreateElement(vnode.type));
        const { children, shapeFlag } = vnode;
        if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
            el.textContent = children;
        } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
            // array_children 
            // vnode 
            mountChildren(vnode, el, parentComponent) // container 应该是el
        }
        // props 
        const { props } = vnode;
        for (const key in props) {
            const val = props[key];
            hostPatchProp(el, key, val);
        }
        // container.append(el)
        hostInsert(el, container);
    }

    function mountChildren(vnode, container, parentComponent: any) {

        vnode.children.forEach((v) => {
            patch(v, container, parentComponent)
        })
    }

    function processComponent(vnode: any, container: any, parentComponent: any) {

        mountComponent(vnode, container, parentComponent)
    }

    function mountComponent(initialVNode: any, container: any, parentComponent: any) {

        const instance = createComponentInstance(initialVNode, parentComponent)
        setupComponent(instance);
        setupRenderEffect(instance, initialVNode, container);
    }

    function setupRenderEffect(instance: any, initialVNode, container: any) {
        const { proxy } = instance;
        const subTree = instance.render.call(proxy);
        // vnode  -> patch 
        // vnode -> element -> 
        patch(subTree, container, instance);
        // element -> mount         // 
        initialVNode.el = subTree.el
    }


    function processFragment(vnode: any, container: any, parentComponent: any) {
        // implement 
        mountChildren(vnode, container, parentComponent);
    }

    function processText(vnode: any, container: any) {
        const { children } = vnode;
        const textNode = (vnode.el = document.createTextNode(children));
        container.append(textNode)
    }

    return {
        createApp: createAppApi(render)
    }

}