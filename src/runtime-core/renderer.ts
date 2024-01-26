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

    function render(vnode, container) {
        // patch 
        // 
        patch(null, vnode, container, null, null)
    }

    // n1 -> 老的
    //n2 -> 新的
    function patch(n1, n2, container, parentComponent: any, anchor: any) {

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
                processFragment(n1, n2, container, parentComponent, anchor);
                break;
            case Text:
                processText(n1, n2, container);
                break;
            default:
                if (shapeFlag & ShapeFlags.ELEMENT) {
                    processElement(n1, n2, container, parentComponent, anchor);
                    // STATEFUL_COMPONENT 
                } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
                    processComponent(n1, n2, container, parentComponent, anchor);
                }
                break;
        }

    }

    function processElement(n1, n2: any, container: any, parentComponent: any, anchor) {
        if (!n1) {
            //init -> update
            mountElement(n2, container, parentComponent, anchor)
        } else {
            // debugger
            patchElement(n1, n2, container, parentComponent, anchor);
        }
    }

    function patchElement(n1, n2, container, parentComponent, anchor) {

        const oldProps = n1.props || EMPTY_OBJ;
        const newProps = n2.props || EMPTY_OBJ;
        const el = (n2.el = n1.el);
        patchChildren(n1, n2, el, parentComponent, anchor);
        patchProps(el, oldProps, newProps);
    }

    function patchChildren(n1: any, n2: any, container: any, parentComponent: any, anchor) {

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
                mountChildren(c2, container, parentComponent, anchor)

            } else {
                patchKeyedChildren(c1, c2, container, parentComponent, anchor);
            }
        }
    }

    // todo 算法 
    function patchKeyedChildren(c1: any, c2: any, container, parentComponent, parentAnchor) {

        const l2 = c2.length;

        let i = 0;
        let e1 = c1.length - 1;
        let e2 = l2 - 1;

        function isSomeVNodeType(n1, n2) {
            //type 
            //key 
            return n1.type === n2.type && n1.key === n2.key;
        }

        //左侧
        while (i <= e1 && i <= e2) {
            const n1 = c1[i]
            const n2 = c2[i]

            if (isSomeVNodeType(n1, n2)) {
                patch(n1, n2, container, parentComponent, parentAnchor)
            } else {
                break;
            }
            i++;
        }

        //右侧
        while (i <= e1 && i <= e2) {
            const n1 = c1[e1];
            const n2 = c2[e2];

            if (isSomeVNodeType(n1, n2)) {
                patch(n1, n2, container, parentComponent, parentAnchor);
            } else {
                break;
            }

            e1--;
            e2--;
        }

        //3. 新的比老的多，创建
        if (i > e1) {
            if (i <= e2) {

                const nextPos = e2 + 1;
                const anchor = nextPos < l2 ? c2[nextPos].el : null;

                while (i <= e2) {
                    patch(null, c2[i], container, parentComponent, anchor)
                    i++;
                }

            }
        } else if (i >= e2) {
            while (i <= e1) {
                hostRemove(c1[i].el);
                i++;
            }

        } else {
            //todo 乱序的部分

            //中间对比
            let s1 = i;
            let s2 = i;

            const tobePatched = e2 - s2 + 1;
            let patched = 0;
            const keyToNewIndexMap = new Map();
            for (let i = s2; i <= e2; i++) {
                const nextChild = c2[i];
                keyToNewIndexMap.set(nextChild.key, i);
            }



            // null undefined 


            for (let i = s1; i <= e1; i++) {
                const prevChild = c1[i];

                if (patched >= tobePatched) {
                    hostRemove(prevChild.el)
                    continue;
                }
                let newIndex;
                if (prevChild.key != null) {
                    newIndex = keyToNewIndexMap.get(prevChild.key);
                } else {
                    for (let j = s2; j < e2; j++) {
                        if (isSomeVNodeType(prevChild, c2[j])) {
                            newIndex = j;
                            break;
                        }
                    }
                }

                if (newIndex === undefined) {
                    hostRemove(prevChild.el)
                } else {
                    patch(prevChild, c2[newIndex], container, parentComponent, null);
                    patched++;
                }
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

    function mountElement(vnode: any, container: any, parentComponent: any, anchor) {

        // vnode -> element -> div
        const el = (vnode.el = hostCreateElement(vnode.type));
        const { children, shapeFlag } = vnode;
        if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
            el.textContent = children;
        } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
            // array_children 
            // vnode 
            mountChildren(vnode.children, el, parentComponent, anchor) // container 应该是el
        }
        // props 
        const { props } = vnode;
        for (const key in props) {
            const val = props[key];
            hostPatchProp(el, key, null, val);
        }
        // container.append(el)
        hostInsert(el, container, anchor);
    }

    function mountChildren(children, container, parentComponent: any, anchor) {

        children.forEach((v) => {
            patch(null, v, container, parentComponent, anchor)
        })
    }

    function processComponent(n1, n2: any, container: any, parentComponent: any, anchor) {

        mountComponent(n2, container, parentComponent, anchor)
    }

    function mountComponent(initialVNode: any, container: any, parentComponent: any, anchor) {

        const instance = createComponentInstance(initialVNode, parentComponent)
        setupComponent(instance);
        setupRenderEffect(instance, initialVNode, container, anchor);
    }

    function setupRenderEffect(instance: any, initialVNode, container: any, anchor) {

        effect(() => {

            if (!instance.isMounted) {
                const { proxy } = instance;
                const subTree = (instance.subTree = instance.render.call(proxy));
                // vnode  -> patch 
                // vnode -> element -> 
                patch(null, subTree, container, instance, anchor);
                // element -> mount         // 
                initialVNode.el = subTree.el
                instance.isMounted = true;
            } else {
                const { proxy } = instance;
                const subTree = instance.render.call(proxy);
                const prevSubTree = instance.subTree;
                instance.subTree = subTree;

                patch(prevSubTree, subTree, container, instance, anchor);

            }


        })


    }


    function processFragment(n1, n2: any, container: any, parentComponent: any, anchor) {
        // implement 
        mountChildren(n2.children, container, parentComponent, anchor);
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



