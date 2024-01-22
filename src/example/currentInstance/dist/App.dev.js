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
    return (0, _guideMiniVueEsm.h)("div", {}, [(0, _guideMiniVueEsm.h)("p", {}, "currentInstance demo"), (0, _guideMiniVueEsm.h)(_Foo.Foo)]);
  },
  setup: function setup() {
    var instance = (0, _guideMiniVueEsm.getCurrentInstance)();
    console.log("App:", instance);
  }
};
exports.App = App;