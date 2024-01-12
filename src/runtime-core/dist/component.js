"use strict";
exports.__esModule = true;
exports.setupComponent = exports.createComponentInstance = void 0;
var reactive_1 = require("../reactivity/reactive");
var componentEmit_1 = require("./componentEmit");
var componentProps_1 = require("./componentProps");
var componentPublicInstance_1 = require("./componentPublicInstance");
function createComponentInstance(vnode) {
    var componet = {
        vnode: vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        emit: function () { }
    };
    componet.emit = componentEmit_1.emit.bind(null, componet);
    return componet;
}
exports.createComponentInstance = createComponentInstance;
function setupComponent(instance) {
    // todo
    componentProps_1.initProps(instance, instance.vnode.props);
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
        var setupResult = setup(reactive_1.shallowReadonly(instance.props), { emit: instance.emit });
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
