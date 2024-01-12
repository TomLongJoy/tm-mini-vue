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
    // emit
    return (0, _guideMiniVueEsm.h)("div", {}, [(0, _guideMiniVueEsm.h)("div", {}, "App"), (0, _guideMiniVueEsm.h)(_Foo.Foo, {
      // element  on + Event 
      onAdd: function onAdd(a, b) {
        console.log("onAdd", a, b);
      },
      // add-foo -> addFoo
      onAddFoo: function onAddFoo() {
        console.log("onAddFoo");
      }
    })]);
  },
  setup: function setup() {
    return {};
  }
};
exports.App = App;