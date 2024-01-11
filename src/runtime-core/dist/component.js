"use strict";
exports.__esModule = true;
exports.setupComponent = exports.createComponentInstance = void 0;
var componentPublicInstance_1 = require("./componentPublicInstance");
function createComponentInstance(vnode) {
    var componet = {
        vnode: vnode,
        type: vnode.type,
        setupState: {}
    };
    return componet;
}
exports.createComponentInstance = createComponentInstance;
function setupComponent(instance) {
    // todo
    // initProps()
    // initSlots()
    //   
    setupStatefulComponent(instance);
}
exports.setupComponent = setupComponent;
function setupStatefulComponent(instance) {
    var component = instance.type;
    // ctx <context>
    instance.proxy = new Proxy({ _: instance }, componentPublicInstance_1.PublicInstancePoxyHandlers);
    var setup = component.setup;
    if (setup) {
        // function Object 
        var setupResult = setup();
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
    var Component = instance.type;
    instance.render = Component.render;
    // if (Component.render) {
    // }
}
