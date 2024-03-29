
// export const App = {
//     name: "App",
//     template: `<div>h1,{{message}}</div>`,
//     setup() {
//         return {
//             message: "mini-vue"
//         }
//     }
// }




import { ref } from "../../../lib/guide-mini-vue.esm.js";

export const App = {
    name: "App",
    template: `<div>h1,{{count}}</div>`,
    setup() {
        const count = window.count = ref(1);
        return {
            count,
        }
    }
}
