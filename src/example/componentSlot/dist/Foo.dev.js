"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Foo = void 0;

var _guideMiniVueEsm = require("../../../lib/guide-mini-vue.esm.js");

var Foo = {
  setup: function setup() {},
  render: function render() {
    var foo = (0, _guideMiniVueEsm.h)("p", {}, "foo"); //Foo .vnode. children 
    // debugger

    console.log(this.$slots); //children -> vnode 
    //vnode 
    // 
    // renderSlots
    // 1.获取到要渲染的元素 
    //2. 获取到渲染的位置
    // 作用域插槽

    var age = 18;
    return (0, _guideMiniVueEsm.h)("div", {}, [(0, _guideMiniVueEsm.renderSlots)(this.$slots, 'header', {
      age: age
    }), foo, (0, _guideMiniVueEsm.renderSlots)(this.$slots, "footer")]);
  }
};
exports.Foo = Foo;