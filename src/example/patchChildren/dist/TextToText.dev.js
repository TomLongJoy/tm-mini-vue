"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _guideMiniVueEsm = require("../../../lib/guide-mini-vue.esm.js");

// 新的是 text
// 老的是 text
var prevChildren = "oldChild";
var nextChildren = "newChild";
var _default = {
  name: "TextToText",
  setup: function setup() {
    var isChange = (0, _guideMiniVueEsm.ref)(false);
    window.isChange = isChange;
    return {
      isChange: isChange
    };
  },
  render: function render() {
    var self = this;
    return self.isChange === true ? (0, _guideMiniVueEsm.h)("div", {}, nextChildren) : (0, _guideMiniVueEsm.h)("div", {}, prevChildren);
  }
};
exports["default"] = _default;