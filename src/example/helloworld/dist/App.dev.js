"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.App = void 0;
var App = {
  // .vuew 
  // template
  // render
  render: function render() {
    // 
    return h("div", "hi," + this.msg);
  },
  setup: function setup() {
    // composition api 
    return {
      msg: "mini-vue"
    };
  }
};
exports.App = App;