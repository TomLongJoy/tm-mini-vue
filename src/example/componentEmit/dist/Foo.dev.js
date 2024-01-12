"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Foo = void 0;

var _guideMiniVueEsm = require("../../../lib/guide-mini-vue.esm.js");

var Foo = {
  setup: function setup(props, _ref) {
    var emit = _ref.emit;

    var emitAdd = function emitAdd() {
      console.log("emit add");
      emit("add", 1, 2);
      emit("add-foo", 1, 2);
    };

    return {
      emitAdd: emitAdd
    };
  },
  render: function render() {
    var btn = (0, _guideMiniVueEsm.h)("button", {
      onClick: this.emitAdd
    }, "emitAdd");
    var foo = (0, _guideMiniVueEsm.h)("p", {}, "foo");
    return (0, _guideMiniVueEsm.h)('div', {}, [foo, btn]);
  }
};
exports.Foo = Foo;