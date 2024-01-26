"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _guideMiniVueEsm = require("../../../lib/guide-mini-vue.esm.js");

var prevChildren = [(0, _guideMiniVueEsm.h)("p", {
  key: "A"
}, "A"), (0, _guideMiniVueEsm.h)("p", {
  key: "B"
}, "B"), (0, _guideMiniVueEsm.h)("p", {
  key: "C"
}, "C")];
var nextChildren = [(0, _guideMiniVueEsm.h)("p", {
  key: "A"
}, "A"), (0, _guideMiniVueEsm.h)("p", {
  key: "B"
}, "B"), (0, _guideMiniVueEsm.h)("p", {
  key: "D"
}, "D"), (0, _guideMiniVueEsm.h)("p", {
  key: "E"
}, "E")];
var _default = {
  name: "ArrayToArray",
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