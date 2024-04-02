

import { h, renderSlots } from "../../../lib/guide-mini-vue.esm.js";
export const Foo = {
    setup() { },

    render() {
        const foo = h("p", {}, "foo");
        //Foo .vnode. children 
        // debugger
        console.log(this.$slots);
        //children -> vnode 
        //vnode 
        // renderSlots
        // 1.获取到要渲染的元素 
        //2. 获取到渲染的位置
        // 作用域插槽
        const age = 18;
        return h("div", {}, [
            renderSlots(this.$slots, 'header', {
                age,
            }),
            foo,
            renderSlots(this.$slots, "footer")
        ]);
    }
} 