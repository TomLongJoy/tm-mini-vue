
export const App = {

    // .vuew 
    // template

    // render

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