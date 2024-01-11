
import { h } from "../../../lib/guide-mini-vue.esm.js";

window.self = null;

export const App = {
    // 必须要写ruender
    render() {
        window.self = this;
        // 
        return h(
            "div",
            {
                id: "root",
                class: ["red", "hard"],
                onClick() {
                    console.log("click");
                },
                onMousedown() {
                    console.log("mouseDown")
                }
            },
            // setupState
            // this.$el   -> get root element 
            "hi," + this.msg
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