
import { h } from "../../../lib/guide-mini-vue.esm.js";
import { Foo } from "./Foo.js";

window.self = null;

export const App = {
    // 必须要写ruender
    name: "App",
    render() {
        window.self = this;
        // 
        return h(
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
            [h("div", {}, "hi," + this.msg), h(Foo, {
                count: 1,

            })]

            // setupState
            // this.$el   -> get root element 
            // "hi," + this.msg
            //string
            // 'hi,mini-vue'

            //Array 
            // [h('p', { class: "red" }, 'hi'), h("p", { class: "blue" }, 'mini-vue')]
        );
    },

    setup() {

        // composition api 

        return {

            msg: "mini-vue,hahah",
        }
    }
}