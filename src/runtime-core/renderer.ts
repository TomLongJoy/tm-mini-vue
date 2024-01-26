import { effect } from "../reactivity/effect";
import { EMPTY_OBJ } from "../shared";
import { ShapeFlags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { createAppApi } from "./createApp";
import { Fragment, Text } from "./vnode";

export function createRender(options) {

    // 此处的方法 在  runtime-dom\index.ts 里面实现
    const {
        createElement: hostCreateElement,
        patchProp: hostPatchProp,
        insert: hostInsert,
        remove: hostRemove,
        setElementText: hostSetElementText,
    } = options;

    function render(vnode, container,) {
        // patch 
        // 
        patch(null, vnode, container, null)
    }

    // n1 -> 老的
    //n2 -> 新的
    function patch(n1, n2, container, parentComponent: any) {

        // 去处理组件
        // 判断 是不是 element
        // todo 判断vnode 是不是一个element
        // 思考题：如何区分是 element / component 类型
        // ShapeFlags
        // vnode -> flag
        // element 
        const { type, shapeFlag } = n2;
        // Fragment -> children
        switch (type) {
            case Fragment:
                processFragment(n1, n2, container, parentComponent);
                break;
            case Text:
                processText(n1, n2, container);
                break;
            default:
                if (shapeFlag & ShapeFlags.ELEMENT) {
                    processElement(n1, n2, container, parentComponent);
                    // STATEFUL_COMPONENT 
                } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
                    processComponent(n1, n2, container, parentComponent);
                }
                break;
        }

    }

    function processElement(n1, n2: any, container: any, parentComponent: any) {
        if (!n1) {
            //init -> update
            mountElement(n2, container, parentComponent)
        } else {
            // debugger
            patchElement(n1, n2, container, parentComponent);
        }
    }

    function patchElement(n1, n2, container, parentComponent) {
        console.log("patchElement")
        console.log("n1", n1)
        console.log("n2", n2)
        const oldProps = n1.props || EMPTY_OBJ;
        const newProps = n2.props || EMPTY_OBJ;
        const el = (n2.el = n1.el);
        patchChildren(n1, n2, el, parentComponent);
        patchProps(el, oldProps, newProps);
    }

    function patchChildren(n1: any, n2: any, container: any, parentComponent: any) {

        const prevShapeFlag = n1.shapeFlag;
        const { shapeFlag } = n2;

        const c1 = n1.children;
        const c2 = n2.children;
        if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
            if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
                //1.把老的children清空
                unmountChildren(n1.children);
                //2. 设置 text 
                // hostSetElementText(container, c2)
            }
            if (c1 !== c2) {
                hostSetElementText(container, c2)

            }
        } else {
            //new array 
            if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
                hostSetElementText(container, "");
                mountChildren(c2, container, parentComponent)

            }
        }
    }

    function unmountChildren(children: any) {

        for (let i = 0; i < children.length; i++) {
            const el = children[i].el;
            //remove 
            // 同  insert 一样

            hostRemove(el);

        }
    }

    function patchProps(el, oldProps: any, newProps: any) {

        if (oldProps !== newProps) {
            for (const key in newProps) {
                const prevProp = oldProps[key];
                const nextProp = newProps[key];
                if (prevProp !== nextProp) {
                    hostPatchProp(el, key, prevProp, nextProp);
                }
            }

            if (oldProps !== EMPTY_OBJ) {
                for (const key in oldProps) {
                    if (!(key in newProps)) {
                        hostPatchProp(el, key, oldProps[key], null);

                    }
                }
            }

        }


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
            mountChildren(vnode.children, el, parentComponent) // container 应该是el
        }
        // props 
        const { props } = vnode;
        for (const key in props) {
            const val = props[key];
            hostPatchProp(el, key, null, val);
        }
        // container.append(el)
        hostInsert(el, container);
    }

    function mountChildren(children, container, parentComponent: any) {

        children.forEach((v) => {
            patch(null, v, container, parentComponent)
        })
    }

    function processComponent(n1, n2: any, container: any, parentComponent: any) {

        mountComponent(n2, container, parentComponent)
    }

    function mountComponent(initialVNode: any, container: any, parentComponent: any) {

        const instance = createComponentInstance(initialVNode, parentComponent)
        setupComponent(instance);
        setupRenderEffect(instance, initialVNode, container);
    }

    function setupRenderEffect(instance: any, initialVNode, container: any) {

        effect(() => {

            if (!instance.isMounted) {
                const { proxy } = instance;
                const subTree = (instance.subTree = instance.render.call(proxy));
                // vnode  -> patch 
                // vnode -> element -> 
                patch(null, subTree, container, instance);
                // element -> mount         // 
                initialVNode.el = subTree.el
                instance.isMounted = true;
            } else {
                console.log("update");
                const { proxy } = instance;
                const subTree = instance.render.call(proxy);
                const prevSubTree = instance.subTree;
                instance.subTree = subTree;
                // console.log("subTree", subTree);
                // console.log("prev  ", prevSubTree);
                patch(prevSubTree, subTree, container, instance);

            }


        })


    }


    function processFragment(n1, n2: any, container: any, parentComponent: any) {
        // implement 
        mountChildren(n2.children, container, parentComponent);
    }

    function processText(n1, n2: any, container: any) {
        const { children } = n2;
        const textNode = (n2.el = document.createTextNode(children));
        container.append(textNode)
    }

    return {
        createApp: createAppApi(render)
    }

}



