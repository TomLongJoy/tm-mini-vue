'use strict';

const isObject = (val) => {
    return val !== null && typeof val === 'object';
};

const publicPropertiesMap = {
    $el: (i) => i.vnode.el,
};
const PublicInstancePoxyHandlers = {
    get({ _: instance }, key) {
        // setupState 
        const { setupState } = instance;
        if (key in setupState) {
            return setupState[key];
        }
        // key -> $el
        // if (key === '$el') {
        //     return instance.vnode.el;
        // }
        const publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
    }
};

function createComponentInstance(vnode) {
    const componet = {
        vnode,
        type: vnode.type,
        setupState: {}
    };
    return componet;
}
function setupComponent(instance) {
    // todo
    // initProps()
    // initSlots()
    //   
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    const component = instance.type;
    // ctx <context>
    instance.proxy = new Proxy({ _: instance }, PublicInstancePoxyHandlers);
    const { setup } = component;
    if (setup) {
        // function Object 
        const setupResult = setup();
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    // function Object 
    // todo function 
    if (typeof setupResult === "object") {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    const Component = instance.type;
    instance.render = Component.render;
    // if (Component.render) {
    // }
}

function render(vnode, container) {
    // patch 
    // 
    patch(vnode, container);
}
function patch(vnode, container) {
    // 去处理组件
    // 判断 是不是 element
    // todo 判断vnode 是不是一个element
    // 思考题：如何区分是 element / component 类型
    console.log(vnode.type);
    if (typeof vnode.type === "string") {
        processElemtn(vnode, container);
    }
    else if (isObject(vnode.type)) {
        processComponent(vnode, container);
    }
}
function processElemtn(vnode, container) {
    //init -> update
    mountElement(vnode, container);
}
function mountElement(vnode, container) {
    // vnode -> element -> div
    const el = (vnode.el = document.createElement(vnode.type));
    const { children } = vnode;
    if (typeof children === "string") {
        el.textContent = children;
    }
    else if (Array.isArray(children)) {
        // vnode 
        mountChildren(vnode, el); // container 应该是el
    }
    // props 
    const { props } = vnode;
    for (const key in props) {
        const val = props[key];
        // todo setAttribute 需要了解下
        el.setAttribute(key, val);
    }
    container.append(el);
}
function mountChildren(vnode, container) {
    vnode.children.forEach((v) => {
        patch(v, container);
    });
}
function processComponent(vnode, container) {
    mountComponent(vnode, container);
}
function mountComponent(initialVNode, container) {
    const instance = createComponentInstance(initialVNode);
    setupComponent(instance);
    setupRenderEffect(instance, initialVNode, container);
}
function setupRenderEffect(instance, initialVNode, container) {
    const { proxy } = instance;
    const subTree = instance.render.call(proxy);
    // vnode  -> patch 
    // vnode -> element -> 
    patch(subTree, container);
    // element -> mount 
    // 
    initialVNode.el = subTree.el;
}

function createVNode(type, props, children) {
    const vnode = {
        type,
        props,
        children,
        el: null,
    };
    return vnode;
}

function createApp(rootComponent) {
    return {
        mount(rootContainer) {
            // 先vnode 
            //component - vnode 
            //所有的逻辑操作，都会基于 vnode 做处理
            const vnode = createVNode(rootComponent);
            render(vnode, rootContainer);
        }
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

exports.createApp = createApp;
exports.h = h;
