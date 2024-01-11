"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.App = void 0;

var _guideMiniVueEsm = require("../../../lib/guide-mini-vue.esm.js");

var App = {
  // 必须要写ruender
  render: function render() {
    // 
    return (0, _guideMiniVueEsm.h)("div", "hi," + this.msg);
  },
  setup: function setup() {
    // composition api 
    return {
      msg: "mini-vue"
    };
  }
};
exports.App = App;