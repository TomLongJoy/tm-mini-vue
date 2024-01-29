"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _guideMiniVueEsm = require("../../../lib/guide-mini-vue.esm.js");

var _default = {
  name: "Child",
  setup: function setup(Props, _ref) {
    var emit = _ref.emit;
  },
  render: function render(proxy) {
    return (0, _guideMiniVueEsm.h)("div", {}, [(0, _guideMiniVueEsm.h)("div", {}, "child - props -msg" + this.$props.msg)]);
  }
};
exports["default"] = _default;