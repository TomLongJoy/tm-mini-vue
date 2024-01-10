
export function createComponentInstance(vnode) {

    const componet = {
        vnode,
        type: vnode.type,
    }


    return componet;
}


export function setupComponent(instance) {
    // todo
    // initProps()
    // initSlots()

    //   
    setupStatefulComponent(instance);

}


function setupStatefulComponent(instance: any) {

    const component = instance.type;

    const { setup } = component
    if (setup) {

        // function Object 
        const setupResult = setup();
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

    if (Component.render) {
        instance.render = Component.render;
    }
}