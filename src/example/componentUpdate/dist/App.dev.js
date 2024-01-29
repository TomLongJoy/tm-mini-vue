"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.App = void 0;

var _guideMiniVueEsm = require("../../../lib/guide-mini-vue.esm.js");

var _Child = _interopRequireDefault(require("./Child.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var App = {
  name: "App",
  setup: function setup() {
    var msg = (0, _guideMiniVueEsm.ref)("123");
    var count = (0, _guideMiniVueEsm.ref)(1);
    window.msg = msg;

    var changeChildProps = function changeChildProps() {
      msg.value = "456";
    };

    var changeCount = function changeCount() {
      count.value++;
    };

    return {
      msg: msg,
      changeChildProps: changeChildProps,
      changeCount: changeCount,
      count: count
    };
  },
  render: function render() {
    return (0, _guideMiniVueEsm.h)("div", {}, [(0, _guideMiniVueEsm.h)("div", {}, "你好"), (0, _guideMiniVueEsm.h)("button", {
      onClick: this.changeChildProps
    }, "change child props "), (0, _guideMiniVueEsm.h)(_Child["default"], {
      msg: this.msg
    }), (0, _guideMiniVueEsm.h)("button", {
      onClick: this.changeCount
    }, "change self count"), (0, _guideMiniVueEsm.h)("p", {}, "count:" + this.count)]);
  }
};
exports.App = App;