"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.App = void 0;

var _guideMiniVueEsm = require("../../../lib/guide-mini-vue.esm.js");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var App = {
  name: "App",
  setup: function setup() {
    var count = (0, _guideMiniVueEsm.ref)(0);

    var onClick = function onClick() {
      count.value++;
    }; //34


    var props = (0, _guideMiniVueEsm.ref)({
      foo: "foo",
      bar: "bar"
    });

    var onChangePropsDemo1 = function onChangePropsDemo1() {
      props.value.foo = "new-foo";
    };

    var onChangePropsDemo2 = function onChangePropsDemo2() {
      props.value.foo = undefined;
    };

    var onChangePropsDemo3 = function onChangePropsDemo3() {
      props.value = {
        foo: 'foo'
      };
    };

    return {
      count: count,
      onClick: onClick,
      onChangePropsDemo1: onChangePropsDemo1,
      onChangePropsDemo2: onChangePropsDemo2,
      onChangePropsDemo3: onChangePropsDemo3,
      props: props
    };
  },
  render: function render() {
    console.log(this.count);
    return (0, _guideMiniVueEsm.h)("div", _objectSpread({
      id: "root"
    }, this.props), [(0, _guideMiniVueEsm.h)("div", {}, "count:" + this.count), //依赖收集
    (0, _guideMiniVueEsm.h)("button", {
      onClick: this.onClick
    }, "click"), (0, _guideMiniVueEsm.h)("button", {
      onClick: this.onChangePropsDemo1
    }, "changeProps - 值改变了 - 修改"), (0, _guideMiniVueEsm.h)("button", {
      onClick: this.onChangePropsDemo2
    }, "changeProps - 值变成了undefined - 删除"), (0, _guideMiniVueEsm.h)("button", {
      onClick: this.onChangePropsDemo3
    }, "changeProps - key在新的里面没有了 - 删除")]);
  }
};
exports.App = App;