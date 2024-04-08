 
import { h } from "../../../lib/guide-mini-vue.esm.js";
import { Foo } from "./Foo.js";

window.self = null;
export const App = { // 必须要写ruender
    name: "App",
    // .vue 
    // <template></template> 转为 render函数 
    // render  -- 对应的是 template
    render() { // ui 逻辑
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
                // h("p", {}, "hi," + this.msg),//第一步
                h(Foo, { count: 1, })//第二步
            ]
        );
        return vnode;
    },
    setup() { // 数据
        return {
            msg: "mini-vue,hahah",
        }
    }
}


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