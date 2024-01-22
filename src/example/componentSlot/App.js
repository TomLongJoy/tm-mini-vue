
import { h, createTextVNode } from "../../../lib/guide-mini-vue.esm.js";
import { Foo } from "./Foo.js";


export const App = {
    name: "App",
    render() {
        const app = h("div", {}, "App");

        // 数组  单值 
        // object key  
        const foo = h(Foo, {}, {
            // element -> text 
            header: ({ age }) => [h("p", {}, "header" + age),
            createTextVNode("你好呀")
            ],
            footer: () => h("p", {}, "footer  ")
        });
        // const foo = h(Foo, {}, h("p", {}, "123"));

        return h("div", {}, [app, foo]);
    },

    setup() {
        return {};
    }
}
