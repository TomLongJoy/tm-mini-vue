
import { h } from "../../../lib/guide-mini-vue.esm.js";
import { Foo } from "./Foo.js";
export const App = {
    name: "App",
    render() {
        // emit
        debugger
        return h(
            "div",
            { class: 'one' },
            [
                // h("div", {}, "App"),
                h(
                    Foo,
                    {
                        onAdd(a, b) {//  app.js  Foo 的 props
                            console.log("onAdd", a, b)
                        },
                        onAddFoo() {// add-foo -> addFoo
                            console.log("onAddFoo")
                        }
                    },
                    'zhe ge shi sha',
                )
            ]
        );
    },
    setup() {
        return {
        }
    }
}
