"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.App = exports["default"] = void 0;

var _guideMiniVueEsm = require("../../../lib/guide-mini-vue.esm.js");

// 组件 provide 和 inject 功能
var ProviderOne = {
  name: "Provider",
  setup: function setup() {
    (0, _guideMiniVueEsm.provide)("foo", "fooVal");
    (0, _guideMiniVueEsm.provide)("bar", "barVal");
  },
  render: function render() {
    return (0, _guideMiniVueEsm.h)("div", {}, [(0, _guideMiniVueEsm.h)("p", {}, "Provider"), (0, _guideMiniVueEsm.h)(ProviderTwo)]);
  }
};
var ProviderTwo = {
  name: "ProviderTwo",
  setup: function setup() {
    (0, _guideMiniVueEsm.provide)("foo", "fooTwo");
    var foo = (0, _guideMiniVueEsm.inject)("foo");
    return {
      foo: foo
    };
  },
  render: function render() {
    return (0, _guideMiniVueEsm.h)("div", {}, [(0, _guideMiniVueEsm.h)("p", {}, "ProviderTwo foo:".concat(this.foo)), (0, _guideMiniVueEsm.h)(Consumer)]);
  }
};
var Consumer = {
  name: "Consumer",
  setup: function setup() {
    var foo = (0, _guideMiniVueEsm.inject)("foo");
    var bar = (0, _guideMiniVueEsm.inject)("bar"); // const baz = inject("baz", "bazDefault")

    var baz = (0, _guideMiniVueEsm.inject)("baz", function () {
      return "bazDefault";
    });
    return {
      foo: foo,
      bar: bar,
      baz: baz
    };
  },
  render: function render() {
    return (0, _guideMiniVueEsm.h)("div", {}, "Consumer: - ".concat(this.foo, " - ").concat(this.bar, " - ").concat(this.baz));
  }
};
var _default = {
  name: "App",
  setup: function setup() {
    return function () {
      return (0, _guideMiniVueEsm.h)("div", {}, [(0, _guideMiniVueEsm.h)("p", {}, "apiInject"), (0, _guideMiniVueEsm.h)(ProviderOne)]);
    };
  }
};
exports["default"] = _default;
var App = ProviderOne;
exports.App = App;