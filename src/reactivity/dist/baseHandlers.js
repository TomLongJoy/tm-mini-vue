"use strict";
exports.__esModule = true;
exports.shallowReadonlyHandlers = exports.readonlyHandlers = exports.mutableHandlers = void 0;
var shared_1 = require("../shared");
var effect_1 = require("./effect");
var reactive_1 = require("./reactive");
var get = createGetter();
var set = createSetter();
var readonlyGet = createGetter(true);
var shallowReadonlyGet = createGetter(true, true);
function createGetter(isReadOnly, shallow) {
    if (isReadOnly === void 0) { isReadOnly = false; }
    if (shallow === void 0) { shallow = false; }
    return function get(target, key) {
        /*
        Reflect.get方法查找并返回target对象的name属性，如果没有该属性返回undefined
         */
        // debugger
        if (key === "__v_isReactive" /* IS_REACTIVE */) {
            return !isReadOnly;
        }
        else if (key === "__v_isReadonly" /* IS_READONLY */) {
            return isReadOnly;
        }
        var res = Reflect.get(target, key); // 取值操作，类似 target.key
        if (shallow) {
            return res;
        }
        //看看 res 是不是 object 
        if (shared_1.isObject(res)) {
            return isReadOnly ? reactive_1.readonly(res) : reactive_1.reactive(res);
        }
        if (!isReadOnly) {
            /*
                跟踪
             */
            //info 收集依赖
            effect_1.track(target, key);
        }
        return res;
    };
}
function createSetter() {
    return function set(target, key, value) {
        debugger;
        //Reflect.set方法设置target对象的name属性等于value。
        var res = Reflect.set(target, key, value);
        /*
            trigger
            n. （枪械等的）扳机；（尤指引发不良反应或发展的）起因，诱因；（炸弹的）引爆器，触发器
            v. 引发，激发；起动，触发；引爆（炸弹）
         */
        effect_1.trigger(target, key); // info 触发依赖
        return res;
    };
}
exports.mutableHandlers = {
    get: get,
    set: set
};
exports.readonlyHandlers = {
    get: readonlyGet,
    set: function (target, key, value) {
        console.warn("key:" + key + " set \u5931\u8D25\u56E0\u4E3A target \u662F readonly", target);
        return true;
    }
};
exports.shallowReadonlyHandlers = shared_1.extend({}, exports.readonlyHandlers, {
    get: shallowReadonlyGet
});
