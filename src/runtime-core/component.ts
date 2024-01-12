import { shallowReadonly } from "../reactivity/reactive";
import { emit } from "./componentEmit";
import { initProps } from "./componentProps";
import { PublicInstancePoxyHandlers } from "./componentPublicInstance";

export function createComponentInstance(vnode) {

    const componet = {
        vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        emit: () => { }
    };

    componet.emit = emit.bind(null, componet) as any;
    return componet;
}


export function setupComponent(instance) {
    // todo
    initProps(instance, instance.vnode.props);
    // initSlots()

    //   
    setupStatefulComponent(instance);

}


function setupStatefulComponent(instance: any) {

    const component = instance.type;

    // ctx <context>
    instance.proxy = new Proxy({ _: instance }, PublicInstancePoxyHandlers);

    const { setup } = component
    if (setup) {

        // function Object 
        const setupResult = setup(shallowReadonly(instance.props), { emit: instance.emit });
        handleSetupResult(instance, setupResult);
    }
}

function handleSetupResult(instance, setupResult: any) {

    // function Object 
    // todo function 
    if (typeof setupResult === "object") {
        instance.setupState = setupResult;
    }

    finishComponentSetup(instance)
}


function finishComponentSetup(instance: any) {

    const Component = instance.type;
    instance.render = Component.render;
    // if (Component.render) {

    // }
}