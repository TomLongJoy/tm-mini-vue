"use strict";
exports.__esModule = true;
exports.setCurrentInstance = exports.getCurrentInstance = exports.setupComponent = exports.createComponentInstance = void 0;
var reactivity_1 = require("../reactivity");
var reactive_1 = require("../reactivity/reactive");
var componentEmit_1 = require("./componentEmit");
var componentProps_1 = require("./componentProps");
var componentPublicInstance_1 = require("./componentPublicInstance");
var componentSlots_1 = require("./componentSlots");
function createComponentInstance(vnode, parent) {
    console.log("createComponentInstance", parent);
    var componet = {
        vnode: vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        slots: {},
        provides: parent ? parent.provides : {},
        parent: parent,
        isMounted: false,
        subTree: {},
        emit: function () { }
    };
    componet.emit = componentEmit_1.emit.bind(null, componet);
    return componet;
}
exports.createComponentInstance = createComponentInstance;
function setupComponent(instance) {
    // todo
    componentProps_1.initProps(instance, instance.vnode.props);
    componentSlots_1.initSlots(instance, instance.vnode.children);
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
        // currentInstance = instance;
        setCurrentInstance(instance);
        // function Object 
        var setupResult = setup(reactive_1.shallowReadonly(instance.props), {
            emit: instance.emit
        });
        setCurrentInstance(null);
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    // function Object 
    // todo function 
    if (typeof setupResult === "object") {
        instance.setupState = reactivity_1.proxyRefs(setupResult);
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    var Component = instance.type;
    instance.render = Component.render;
    // if (Component.render) {
    // }
}
var currentInstance = null;
function getCurrentInstance() {
    return currentInstance;
}
exports.getCurrentInstance = getCurrentInstance;
function setCurrentInstance(instance) {
    currentInstance = instance;
}
exports.setCurrentInstance = setCurrentInstance;
