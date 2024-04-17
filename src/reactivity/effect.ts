import { extend } from "../shared";

let activeEffect: any;
let shouldTrack: any; // 是否需要收集 stop测试时候 ++ 问题。

export class ReactiveEffect {
    private _fn: any;
    deps = [];
    active = true;// 判断是否有onStop
    onStop?: () => void;
    public scheduler: Function | undefined;// scheduler (调度器)
    constructor(fn: any, public _scheduler?: Function) {
        this._fn = fn;
        this.scheduler = _scheduler;
    }
    run() {
        //1.会收集依赖
        // shouldTrack 来做区分
        if (!this.active) {
            return this._fn();
        }
        shouldTrack = true;
        activeEffect = this;
        const result = this._fn();
        // reset 
        shouldTrack = false;
        return result;
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
    effect.deps.length = 0;
}

//todo -- 收集依赖 06视频 14:30
const targetMap = new Map();
export function track(target: any, key: any) {    
    if(!activeEffect){
        debugger
    }
    if (!isTracking()) return;
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
    trackEffects(dep);
    console.log('收集依赖-end')
}

export function trackEffects(dep) {
    //看看 dep 之前有没有添加过，添加过的话 那么就不添加了
    if (dep.has(activeEffect)) return;
    dep.add(activeEffect)
    activeEffect.deps.push(dep); // 反向搜集   
}

export function isTracking() { // 12集，10：45创建。  zlj 16集，10：12 有使用
    return shouldTrack && activeEffect !== undefined;
    // if (!activeEffect) return;
    // if (!shouldTrack) return;
}

// todo -- 触发依赖
export function trigger(target: any, key: string | symbol) {
    let depsMap = targetMap.get(target);
    let dep = depsMap.get(key);
    triggerEffects(dep)
}

export function triggerEffects(dep) {
    for (const effect of dep) {
        if (effect.scheduler) {
            effect.scheduler();
        } else {
            effect.run();
        }
    }
}

// 创建effect,执行run()方法，runner.effect绑定。
export function effect(fn: any, options: any = {}) {
    const _effect = new ReactiveEffect(fn, options.scheduler);
    extend(_effect, options) // export const extend = Object.assign;
    _effect.run();// run中的this就是 _effect
    const runner: any = _effect.run.bind(_effect);
    runner.effect = _effect; // 这里忘记写，报错了。 
    return runner;//bind -- learn 2 
}
export function stop(runner: any) {
    runner.effect.stop();
}

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




 // // start --- test 
    // let count = 0;
    // if( activeEffect.deps.length ){
    //     testMethod(activeEffect);
    // }
    // function testMethod(activeEffect){
    //     const dep = activeEffect.deps[0]
    //     for (const effect of dep) {            
    //         count++;
    //         if(count > 1000){
    //             debugger
    //             console.log('循环结束')
    //             return;
    //         }
    //         testMethod(effect);
            
    //     }
    // }
    // // end -- test 