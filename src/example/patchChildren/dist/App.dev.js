"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _guideMiniVueEsm = require("../../../lib/guide-mini-vue.esm.js");

var _ArrayToText = _interopRequireDefault(require("./ArrayToText.js"));

var _TextToText = _interopRequireDefault(require("./TextToText.js"));

var _TextToArray = _interopRequireDefault(require("./TextToArray.js"));

var _ArrayToArray = _interopRequireDefault(require("./ArrayToArray.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = {
  name: "App",
  setup: function setup() {},
  render: function render() {
    return (0, _guideMiniVueEsm.h)("div", {
      tId: 1
    }, [(0, _guideMiniVueEsm.h)("p", {}, "主页"), // h(ArrayToText),
    // h(TextToText),
    // h(TextToArray)
    (0, _guideMiniVueEsm.h)(_ArrayToArray["default"]) // 比较复杂 ， diff算法。
    ]);
  }
};
exports["default"] = _default;