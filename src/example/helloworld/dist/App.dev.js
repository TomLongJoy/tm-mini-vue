"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.App = void 0;

var _guideMiniVueEsm = require("../../../lib/guide-mini-vue.esm.js");

var _Foo = require("./Foo.js");

window.self = null;
var App = {
  // 必须要写ruender
  name: "App",
  render: function render() {
    window.self = this;
    return (0, _guideMiniVueEsm.h)("div", {
      id: "root",
      "class": ["red", "hard"],
      onClick: function onClick() {
        console.log(9 + 9);
      },
      onMousedown: function onMousedown() {
        console.log("mouseDown");
      }
    }, [(0, _guideMiniVueEsm.h)("div", {}, "hi," + this.msg), (0, _guideMiniVueEsm.h)(_Foo.Foo, {
      count: 1
    })] // setupState
    // this.$el   -> get root element 
    // "hi," + this.msg
    //string
    // 'hi,mini-vue'
    //Array 
    // [h('p', { class: "red" }, 'hi'), h("p", { class: "blue" }, 'mini-vue')]
    );
  },
  setup: function setup() {
    // composition api 
    return {
      msg: "mini-vue,hahah"
    };
  }
};
exports.App = App;