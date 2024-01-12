"use strict";
exports.__esModule = true;
exports.emit = void 0;
var index_1 = require("../shared/index");
function emit(instance, event) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    console.log("emit", event);
    // instance.props -> event 
    var props = instance.props;
    // add -> Add
    // add-foo -> addFoo 
    // tpp 
    //先去写一个特定的行为， -》 通用的行为
    var handlerName = index_1.toHandlerKey(index_1.camelize(event));
    var handler = props[handlerName];
    handler && handler.apply(void 0, args);
}
exports.emit = emit;
