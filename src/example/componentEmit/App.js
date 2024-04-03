
import { h } from "../../../lib/guide-mini-vue.esm.js";
import { Foo } from "./Foo.js";
export const App = {
    name: "App",
    render() {
        // emit
        return h(
            "div",
            {},
            [
                h("div", {}, "App"),
                h(Foo, {
                    onAdd(a, b) {// element  on + Event 
                        console.log("onAdd", a, b)
                    },
                    onAddFoo() {// add-foo -> addFoo
                        console.log("onAddFoo")
                    }
                })]);
    },
    setup() {
        return {
        }
    }
}
