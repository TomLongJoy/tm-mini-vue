import { hasOwn } from "../shared/index";

// this.xxx 的时候会调用这里 get 方法。
const publicPropertiesMap = {// i 对应 instance 
    $el: (i) => i.vnode.el,
    $slots: (i) => i.slots,
    $props: (i) => i.props,
}

export const PublicInstancePoxyHandlers = {
    get({ _: instance }, key) {
        // debugger
        const { setupState, props } = instance;
        // if (key in setupState) {
        //     return setupState[key];
        // }
        if (hasOwn(setupState, key)) {
            return setupState[key];
        } else if (hasOwn(props, key)) {// Foo.js 中 render this.count触发
            return props[key];
        }
        const publicGetter = publicPropertiesMap[key];// 需要调用publicGetter()方法才能拿到值。
        if (publicGetter) {
            return publicGetter(instance);
        }
    }
}

// key -> $el
// if (key === '$el') {
//     return instance.vnode.el;
// }