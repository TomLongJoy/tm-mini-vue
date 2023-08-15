import { extend } from "../shared";

class ReactiveEffect {
    private _fn: any;
    deps = [];
    active = true;
    onStop?: () => void;
    public scheduler: Function | undefined;
    constructor(fn: any, public _scheduler?: Function) {
        this._fn = fn;
        this.scheduler = _scheduler;
    }
    run() {
        activeEffect = this;
        return this._fn();
    }
    stop() {
        if (this.active) {
            cleanupEffect(this);
            if (this.onStop) {
                this.onStop();
            }
            this.active = false;
        }
    }
}

function cleanupEffect(effect: any) {
    effect.deps.forEach((dep: any) => {
        dep.delete(effect)
    });
}
const targetMap = new Map();
export function track(target: any, key: any) {
    // target -> key -> dep
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        depsMap = new Map();// map.set(key,value) 
        targetMap.set(target, depsMap)
    }
    let dep = depsMap.get(key);
    if (!dep) {
        dep = new Set();
        depsMap.set(key, dep)
    }
    if(!activeEffect) return;
    dep.add(activeEffect)
    activeEffect.deps.push(dep);
}

export function trigger(target: any, key: string | symbol) {
    let depsMap = targetMap.get(target);
    let dep = depsMap.get(key);
    for (const effect of dep) {
        if (effect.scheduler) {
            effect.scheduler();
        } else {
            effect.run();
        }
    }
}
let activeEffect: any;
export function effect(fn: any, options: any = {}) {
    //fn
    const _effect = new ReactiveEffect(fn, options.scheduler);

    // _effect.onStop = options.onStop;
    //options 
    // Object.assign(_effect,options)
    extend(_effect, options)

    _effect.run();
    const runner: any = _effect.run.bind(_effect);
    /*
        runner是个函数，怎么能 .effect
        https://juejin.cn/post/7076967942079905806 
    */
    runner.effect = _effect; // 这里忘记写，报错了。 
    return runner;//bind -- learn 2 
}
export function stop(runner: any) {
    runner.effect.stop();
}