"use strict";
exports.__esModule = true;
exports.stop = exports.effect = exports.triggerEffects = exports.trigger = exports.isTracking = exports.trackEffects = exports.track = void 0;
var shared_1 = require("../shared");
var shouldTrack;
var ReactiveEffect = /** @class */ (function () {
    function ReactiveEffect(fn, _scheduler) {
        this._scheduler = _scheduler;
        this.deps = [];
        this.active = true;
        this._fn = fn;
        this.scheduler = _scheduler;
    }
    ReactiveEffect.prototype.run = function () {
        activeEffect = this;
        return this._fn();
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
function cleanupEffect(effect) {
    effect.deps.forEach(function (dep) {
        dep["delete"](effect);
    });
}
//todo -- 收集依赖 06视频 14:30
var targetMap = new Map();
function track(target, key) {
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
    if (!activeEffect)
        return;
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
}
exports.trackEffects = trackEffects;
function isTracking() {
    return shouldTrack && activeEffect !== undefined;
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
var activeEffect;
function effect(fn, options) {
    if (options === void 0) { options = {}; }
    //fn
    var _effect = new ReactiveEffect(fn, options.scheduler);
    // _effect.onStop = options.onStop;
    //options 
    // Object.assign(_effect,options)
    shared_1.extend(_effect, options);
    _effect.run();
    // bind(this: Function, thisArg: any, ...argArray: any[]): any;
    var runner = _effect.run.bind(_effect);
    /*
        runner是个函数，怎么能 .effect
        https://juejin.cn/post/7076967942079905806
    */
    runner.effect = _effect; // 这里忘记写，报错了。 
    return runner; //bind -- learn 2 
}
exports.effect = effect;
function stop(runner) {
    runner.effect.stop();
}
exports.stop = stop;
