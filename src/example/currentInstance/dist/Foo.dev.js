"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Foo = void 0;

var _guideMiniVueEsm = require("../../../lib/guide-mini-vue.esm.js");

var Foo = {
  name: "Foo",
  setup: function setup() {
    var instance = (0, _guideMiniVueEsm.getCurrentInstance)();
    console.log("Foo:", instance);
    return {};
  },
  render: function render() {
    return (0, _guideMiniVueEsm.h)("div", {}, "foo");
  }
};
exports.Foo = Foo;