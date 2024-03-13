"use strict";
exports.__esModule = true;
exports.stop = exports.effect = exports.triggerEffects = exports.trigger = exports.isTracking = exports.trackEffects = exports.track = exports.ReactiveEffect = void 0;
var shared_1 = require("../shared");
var activeEffect;
var shouldTrack; // 是否需要收集
var ReactiveEffect = /** @class */ (function () {
    function ReactiveEffect(fn, _scheduler) {
        this._scheduler = _scheduler;
        //onStop 4:28
        this.deps = [];
        this.active = true;
        this._fn = fn;
        this.scheduler = _scheduler;
    }
    ReactiveEffect.prototype.run = function () {
        //1.会收集依赖
        // shouldTrack 来做区分
        if (!this.active) {
            return this._fn();
        }
        shouldTrack = true;
        activeEffect = this;
        var result = this._fn();
        // reset 
        shouldTrack = false;
        return result;
    };
    ReactiveEffect.prototype.stop = function () {
        if (this.active) {
            cleanupEffect(this);
            if (this.onStop) {
                this.onStop();
            }
            this.active = false;
        }
    };
    return ReactiveEffect;
}());
exports.ReactiveEffect = ReactiveEffect;
function cleanupEffect(effect) {
    effect.deps.forEach(function (dep) {
        dep["delete"](effect);
    });
    effect.deps.length = 0;
}
//todo -- 收集依赖 06视频 14:30
var targetMap = new Map();
function track(target, key) {
    if (!isTracking())
        return;
    // target -> key -> dep
    var depsMap = targetMap.get(target);
    if (!depsMap) {
        depsMap = new Map(); // map.set(key,value) 
        targetMap.set(target, depsMap);
    }
    var dep = depsMap.get(key);
    if (!dep) {
        dep = new Set();
        depsMap.set(key, dep);
    }
    trackEffects(dep);
}
exports.track = track;
function trackEffects(dep) {
    //看看 dep 之前有没有添加过，添加过的话 那么就不添加了
    if (dep.has(activeEffect))
        return;
    dep.add(activeEffect);
    // todo 这个是什么意思  对应的 cleanupEffect()方法 里面有删除操作。 https://www.zhihu.com/question/439459521
    //https://www.zhihu.com/question/439459521
    //https://zhuanlan.zhihu.com/p/576055727
    activeEffect.deps.push(dep); // 反向搜集
}
exports.trackEffects = trackEffects;
function isTracking() {
    return shouldTrack && activeEffect !== undefined;
    // if (!activeEffect) return;
    // if (!shouldTrack) return;
}
exports.isTracking = isTracking;
// todo -- 触发依赖
function trigger(target, key) {
    var depsMap = targetMap.get(target);
    var dep = depsMap.get(key);
    triggerEffects(dep);
}
exports.trigger = trigger;
function triggerEffects(dep) {
    for (var _i = 0, dep_1 = dep; _i < dep_1.length; _i++) {
        var effect_1 = dep_1[_i];
        if (effect_1.scheduler) {
            effect_1.scheduler();
        }
        else {
            effect_1.run();
        }
    }
}
exports.triggerEffects = triggerEffects;
// _effect.onStop = options.onStop;
//options 
// Object.assign() 静态方法将一个或者多个源对象中所有可枚举的自有属性复制到目标对象，并返回修改后的目标对象。
/*
    const target = { a: 1, b: 2 };
    const source = { b: 4, c: 5 };
    const returnedTarget = Object.assign(target, source);
    console.log(target);
    // Expected output: Object { a: 1, b: 4, c: 5 }
    console.log(returnedTarget === target);
    // Expected output: true
*/
// bind(this: Function, thisArg: any, ...argArray: any[]): any;
/*
    Function 实例的 bind() 方法创建一个新函数，当调用该新函数时，它会调用原始函数并将其 this 关键字设置为给定的值，
    同时，还可以传入一系列指定的参数，这些参数会插入到调用新函数时传入的参数的前面。
*/
// bind() 创建一个新函数，runner(), runner()被调用的时候仍然执行 _effect.run()函数，这时候_effect.run()的this就是参数 _effect;
/*
   runner是个函数，怎么能 .effect
   https://juejin.cn/post/7076967942079905806
*/
function effect(fn, options) {
    if (options === void 0) { options = {}; }
    var _effect = new ReactiveEffect(fn, options.scheduler);
    shared_1.extend(_effect, options); // export const extend = Object.assign;
    _effect.run();
    var runner = _effect.run.bind(_effect);
    runner.effect = _effect; // 这里忘记写，报错了。 
    return runner; //bind -- learn 2 
}
exports.effect = effect;
function stop(runner) {
    runner.effect.stop();
}
exports.stop = stop;
