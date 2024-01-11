
import { h } from "../../../lib/guide-mini-vue.esm.js";

export const App = {

    // 必须要写ruender
    render() {
        // 
        return h("div", "hi," + this.msg);
    },

    setup() {

        // composition api 

        return {

            msg: "mini-vue",
        }
    }
}