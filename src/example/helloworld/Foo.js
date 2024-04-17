import { h } from "../../../lib/guide-mini-vue.esm.js";
export const Foo = {
    name:"foo",
    setup(props) {
        // console.log(props);
        debugger
    },
    render() {
        debugger // 
        /*
        1.this.count的值怎么来的。
            this是代理，代理的值是什么时候取到
        
        */ 
        return h('span', {id:"foo"}, "foo:" + this.count);
    }
}