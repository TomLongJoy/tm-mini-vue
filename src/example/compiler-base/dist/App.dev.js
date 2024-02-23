"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.App = void 0;

var _guideMiniVueEsm = require("../../../lib/guide-mini-vue.esm.js");

// export const App = {
//     name: "App",
//     template: `<div>h1,{{message}}</div>`,
//     setup() {
//         return {
//             message: "mini-vue"
//         }
//     }
// }
var App = {
  name: "App",
  template: "<div>h1,{{count}}</div>",
  setup: function setup() {
    var count = window.count = (0, _guideMiniVueEsm.ref)(1);
    return {
      count: count
    };
  }
};
exports.App = App;