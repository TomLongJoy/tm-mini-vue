
import { h } from "../../../lib/guide-mini-vue.esm.js";
import { Foo } from "./Foo.js";

window.self = null;

// export const App = {
//     render() {
//         window.self = this;// 调试 $el
//         return h(
//             "div",
//             {
//                 id: "root",
//                 class: ["red", "hard"],
//             },
//             "hi," + this.msg, //第二步
//         );
//     },
//     setup() {
//         return {
//             msg: 'mini-vue'
//         }
//     }
// }

export const App = {
    // 必须要写ruender
    name: "App",
    render() {
        window.self = this;
        const vnode = h(
            "div",
            {
                id: "root",
                class: ["red", "hard"],
                onClick() {
                    console.log(9 + 9);
                },
                onMousedown() {
                    console.log("mouseDown")
                },
            },
            [
                h("div", {}, "hi," + this.msg),//第一步
                h(Foo, { count: 1, })//第二步
            ]
        );
        return vnode;
    },
    setup() {
        return {
            msg: "mini-vue,hahah",
        }
    }
}