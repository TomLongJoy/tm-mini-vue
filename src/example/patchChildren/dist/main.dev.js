"use strict";

var _guideMiniVueEsm = require("../../../lib/guide-mini-vue.esm.js");

var _App = _interopRequireDefault(require("./App.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var rootContainer = document.querySelector("#root");
(0, _guideMiniVueEsm.createApp)(_App["default"]).mount(rootContainer);