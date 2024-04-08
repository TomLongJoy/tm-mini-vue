import { h } from "../../../lib/guide-mini-vue.esm.js";
export const Foo = {
    name:"foo",
    setup(props) {
        // console.log(props);
        debugger
    },
    render() {
        debugger
        return h('span', {id:"foo"}, "foo:" + this.count);
    }
}