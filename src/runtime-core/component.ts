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
    // todo
    initProps(instance, instance.vnode.props);
    initSlots(instance, instance.vnode.children);

    //   
    setupStatefulComponent(instance);

}


function setupStatefulComponent(instance: any) {

    const component = instance.type;

    // ctx <context>
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
    instance.render = Component.render;
    // if (Component.render) {

    // }
}

let currentInstance = null;
export function getCurrentInstance() {

    return currentInstance;
}

export function setCurrentInstance(instance) {

    currentInstance = instance;
}
