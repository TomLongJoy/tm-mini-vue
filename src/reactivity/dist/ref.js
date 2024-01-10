"use strict";
exports.__esModule = true;
exports.proxyRefs = exports.unRef = exports.isRef = exports.ref = void 0;
var shared_1 = require("../shared");
var effect_1 = require("./effect");
var reactive_1 = require("./reactive");
var RefImpl = /** @class */ (function () {
    function RefImpl(value) {
        this.__v_isRef = true;
        this._rawValue = value;
        this._value = convert(value);
        // value -> reactive
        // 1. 看看value 是不是对象 
        this.dep = new Set();
    }
    Object.defineProperty(RefImpl.prototype, "value", {
        get: function () {
            trackRefValue(this);
            return this._value;
        },
        set: function (newValue) {
            //一定是先去修改了 value值，
            // newValue -> this._value
            //hasChanged
            // 对比的时候 object 
            if (shared_1.hasChanged(newValue, this._rawValue)) {
                this._rawValue = newValue;
                this._value = convert(newValue);
                effect_1.triggerEffects(this.dep);
            }
            ;
        },
        enumerable: false,
        configurable: true
    });
    return RefImpl;
}());
function trackRefValue(ref) {
    if (effect_1.isTracking()) {
        effect_1.trackEffects(ref.dep);
    }
}
function ref(value) {
    return new RefImpl(value);
}
exports.ref = ref;
function isRef(ref) {
    // 
    return !!ref.__v_isRef;
}
exports.isRef = isRef;
function unRef(ref) {
    //  看看是不是ref -> ref.value
    // ref 
    return isRef(ref) ? ref.value : ref;
}
exports.unRef = unRef;
function proxyRefs(objectWithRefs) {
    // get set 
    return new Proxy(objectWithRefs, {
        get: function (target, key) {
            // get -> age(ref) 那么就给他返回 .value 
            // not ref -> value
            return unRef(Reflect.get(target, key));
        },
        set: function (target, key, value) {
            if (isRef(target[key]) && !isRef(value)) {
                return target[key].value = value;
            }
            else {
                return Reflect.set(target, key, value);
            }
        }
    });
}
exports.proxyRefs = proxyRefs;
function convert(value) {
    return shared_1.isObject(value) ? reactive_1.reactive(value) : value;
}
