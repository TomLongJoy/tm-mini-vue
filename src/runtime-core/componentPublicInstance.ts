import { hasOwn } from "../shared/index";


const publicPropertiesMap = {
    $el: (i) => i.vnode.el,
    $slots: (i) => i.slots,
    $props: (i) => i.props,
}

export const PublicInstancePoxyHandlers = {
    get({ _: instance }, key) {
        debugger
        const { setupState, props } = instance;
        if (key in setupState) {
            return setupState[key];
        }
        if (hasOwn(setupState, key)) {
            return setupState[key];
        } else if (hasOwn(props, key)) {
            return props[key];
        }
        const publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
    }
}

// key -> $el
// if (key === '$el') {
//     return instance.vnode.el;
// }