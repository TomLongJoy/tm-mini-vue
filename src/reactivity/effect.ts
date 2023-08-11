

class ReactiveEffect {
    private _fn: any;

    constructor(fn: any) {

        this._fn = fn;
    }
    run() {
        activeEffect = this;
        this._fn();
    }
}



const targetMap = new Map();
export function track(target: any, key: any) {

    // target -> key -> dep
    let depsMap = targetMap.get(target);

    if (!depsMap) {
        depsMap = new Map();
        targetMap.set(target, depsMap)
    }
    let dep = depsMap.get(key);
    if (!dep) {
        dep = new Set();
        depsMap.set(key, dep)
    }
    // const dep = new Set();

    dep.add(activeEffect)

}

export function trigger(target: any, key: string | symbol) {

    let depsMap = targetMap.get(target);
    let dep = depsMap.get(key);
    for (const effect of dep) {
        effect.run(); 
    }
}

let activeEffect: any;
export function effect(fn: any) {
    // fn 
    const _effect = new ReactiveEffect(fn)


    _effect.run();
}