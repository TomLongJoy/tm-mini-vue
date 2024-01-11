"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _pluginTypescript = _interopRequireDefault(require("@rollup/plugin-typescript"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = {
  input: "./src/index.ts",
  output: [//1.cjs -> commonjs
  //2.esm -> 
  {
    format: "cjs",
    file: 'lib/guide-mini-vue.cjs.js'
  }, {
    format: "es",
    file: 'lib/guide-mini-vue.esm.js'
  }],
  plugins: [(0, _pluginTypescript["default"])()]
};
exports["default"] = _default;