
import { h } from "../../../lib/guide-mini-vue.esm.js";

export const App = {

    // 必须要写ruender
    render() {
        // 
        return h(
            "div",
            {
                id: "root",
                class: ["red", "hard"]
            },
            // "hi," + this.msg
            //string
            // 'hi,mini-vue'

            //Array 
            [h('p', { class: "red" }, 'hi'), h("p", { class: "blue" }, 'mini-vue')]
        );
    },

    setup() {

        // composition api 

        return {

            msg: "mini-vue",
        }
    }
}