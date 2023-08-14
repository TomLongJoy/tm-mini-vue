class ReactiveEffect {
    private _fn: any;
    constructor(fn: any, public scheduler?: any) {
        this._fn = fn;
    }
    run() {
        activeEffect = this;
        return this._fn();
    }
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
    dep.add(activeEffect)
    console.log("--------添加完成");
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
    const _effect = new ReactiveEffect(fn, options.scheduler)
    _effect.run();
    return _effect.run.bind(_effect);//bind -- learn 2 
}