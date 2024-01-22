"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.App = void 0;

var _guideMiniVueEsm = require("../../../lib/guide-mini-vue.esm.js");

var _Foo = require("./Foo.js");

var App = {
  name: "App",
  render: function render() {
    var app = (0, _guideMiniVueEsm.h)("div", {}, "App"); // 数组  单值 
    // object key  

    var foo = (0, _guideMiniVueEsm.h)(_Foo.Foo, {}, {
      // element -> text 
      header: function header(_ref) {
        var age = _ref.age;
        return [(0, _guideMiniVueEsm.h)("p", {}, "header" + age), (0, _guideMiniVueEsm.createTextVNode)("你好呀")];
      },
      footer: function footer() {
        return (0, _guideMiniVueEsm.h)("p", {}, "footer  ");
      }
    }); // const foo = h(Foo, {}, h("p", {}, "123"));

    return (0, _guideMiniVueEsm.h)("div", {}, [app, foo]);
  },
  setup: function setup() {
    return {};
  }
};
exports.App = App;