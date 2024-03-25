import { proxyRefs } from "../reactivity";
import { shallowReadonly } from "../reactivity/reactive";
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
    // debugger // 这个地方逻辑卡住，需要继续研究
    // todo
    //1
    initProps(instance, instance.vnode.props);
    //2
    initSlots(instance, instance.vnode.children);
    //3 -- 初始化有状态的component <组件>
    setupStatefulComponent(instance);

    // 4 走完之后会进入到path
    // debugger
}
function setupStatefulComponent(instance: any) {
    const component = instance.type;
    instance.proxy = new Proxy({ _: instance }, PublicInstancePoxyHandlers);
    const { setup } = component
    if (setup) {
        // currentInstance = instance;
        setCurrentInstance(instance);
        // function Object 
        const setupResult = setup(shallowReadonly(instance.props), {
            emit: instance.emit
        });
        setCurrentInstance(null);
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult: any) {
    // function Object 
    // todo function 
    if (typeof setupResult === "object") {
        instance.setupState = proxyRefs(setupResult);
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
export function getCurrentInstance() {
    return currentInstance;
}
export function setCurrentInstance(instance) {
    currentInstance = instance;
}
let compiler;
export function registerRuntimeCompiler(_comiler) {
    compiler = _comiler;
}