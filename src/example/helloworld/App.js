
import { h } from "../../../lib/guide-mini-vue.esm.js";
import { Foo } from "./Foo.js";

window.self = null;

export const App = {
    render(){
        return h("div",
        {
            id:"root",
            class:["red","hard"],
        },
        "hi," + this.msg,
        // [h("p", { class:"red"},"hi"), h("p",{clsass:"blue"},"mini-vue")]
        );
    },
    setup(){
        return {
            msg:'mini-vue'
        }
    }
}

// export const App = {
//     // 必须要写ruender
//     name: "App",

    
//     render() {
//         window.self = this;
//         return h(
//             "div",
//             {
//                 id: "root",
//                 class: ["red", "hard"],
//                 onClick() {
//                     console.log(9 + 9);
//                 },
//                 onMousedown() {
//                     console.log("mouseDown")
//                 },
//             },
//             //Array
//             [h("div", {}, "hi," + this.msg), h(Foo, {
//                 count: 1,
//             })]
            
//         );
//     },
//     setup() {
//         // composition api 
//         return {
//             msg: "mini-vue,hahah",
//         }
//     }
// }