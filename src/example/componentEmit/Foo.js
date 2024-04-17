

import { h } from "../../../lib/guide-mini-vue.esm.js";
export const Foo = {
    name:"foo",
    //TODO  emit 就是componentEmit.ts 中的emit方法。
    setup(props, { emit }) {
        const emitAdd = () => {
            console.log("emit add")
            emit("add", 1, 2);
            // emit("add-foo", 1, 2);
        }
        return {
            emitAdd
        }
    },
    render() {
        // debugger
        const btn = h("button", {
            class: "four",
            onClick: this.emitAdd
        }, "emitAdd-buttonText");
        const foo = h("p", {class:"three"}, "foo")
        return h('div', {class:"two"}, [foo, btn]);
    }
}