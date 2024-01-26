"use strict";

var _guideMiniVueEsm = require("../../../lib/guide-mini-vue.esm.js");

var _App = require("./App.js");

// vue3 
var rootContainer = document.querySelector("#app");
(0, _guideMiniVueEsm.createApp)(_App.App).mount(rootContainer);