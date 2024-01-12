"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Foo = void 0;

var _guideMiniVueEsm = require("../../../lib/guide-mini-vue.esm.js");

var Foo = {
  setup: function setup(props) {
    //props.count
    console.log(props); //3.
    // readonly 
  },
  render: function render() {
    return (0, _guideMiniVueEsm.h)('div', {}, "foo:" + this.count);
  }
};
exports.Foo = Foo;