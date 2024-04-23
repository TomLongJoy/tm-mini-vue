import { proxyRefs } from "../reactivity";
import { shallowReadonly } from "../reactivity/reactive";
import { hasOwn } from "../shared";
import { emit } from "./componentEmit";
import { initProps } from "./componentProps";
import { PublicInstancePoxyHandlers } from "./componentPublicInstance";
import { initSlots } from "./componentSlots";

export function createComponentInstance(vnode, parent) {
    const componet = {
        vnode,
        type: vnode.type,
        next: null,
        setupState: {},
        props: {},
        slots: {},
        provides: parent ? parent.provides : {},
        parent,
        isMounted: false,
        subTree: {},
        emit: () => { }
    };
    componet.emit = emit.bind(null, componet) as any;
    return componet;
}
export function setupComponent(instance) {
    //1
    initProps(instance, instance.vnode.props);
    //2
    initSlots(instance, instance.vnode.children);
    //3 -- 初始化有状态的component <组件>
    setupStatefulComponent(instance);
    // 4 走完之后会进入到path
}
function setupStatefulComponent(instance: any) {
    // TODO：component组件，其实就是，app.js中 App对象。
    const component = instance.type;
    console.log("componetn的name:"+component.name)
    instance.proxy = new Proxy({ _: instance }, PublicInstancePoxyHandlers);
    const { setup } = component
    if (setup) {
        setCurrentInstance(instance);
        const propsTem = shallowReadonly(instance.props);// 在initProps 处理。
        // debugger// setup返回值
        const setupResult = setup(propsTem, { emit: instance.emit });
        setCurrentInstance(null);
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult: any) {
    if (typeof setupResult === "object") {
        instance.setupState = proxyRefs(setupResult);// 为了返回值，需要使用proxyRefs。
    }
    finishComponentSetup(instance)
}
function finishComponentSetup(instance: any) {
    const Component = instance.type;
    if (compiler && !Component.render) {
        if (Component.template) {
            Component.render = compiler(Component.template)
        }
    }
    instance.render = Component.render;
}
let currentInstance = null;
export function getCurrentInstance() {// 只有在setup才能获取到。
    return currentInstance;
}
export function setCurrentInstance(instance) {
    currentInstance = instance;
}
let compiler;
export function registerRuntimeCompiler(_comiler) {
    compiler = _comiler;
}