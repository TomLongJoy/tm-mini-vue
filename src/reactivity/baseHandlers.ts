import { extend, isObject } from "../shared";
import { track, trigger } from "./effect";
import { ReactiveFlags, reactive, readonly, shallowReadonly } from "./reactive";

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);

function createGetter(isReadOnly = false, shallow = false) {


    return function get(target: object, key: any) {
        /*
        Reflect.get方法查找并返回target对象的name属性，如果没有该属性返回undefined
         */
        // debugger
        if (key === ReactiveFlags.IS_REACTIVE) {
            return !isReadOnly;
        } else if (key === ReactiveFlags.IS_READONLY) {
            return isReadOnly;
        }

        const res = Reflect.get(target, key);// 取值操作，类似 target.key

        if (shallow) {
            return res;
        }

        //看看 res 是不是 object 
        if (isObject(res)) {

            return isReadOnly ? readonly(res) : reactive(res)
        }


        if (!isReadOnly) {
            /*
                跟踪
             */
            //info 收集依赖
            track(target, key);
        }
        return res;
    }
}

function createSetter() {
    return function set(target: object, key: any, value: any) {
        debugger
        //Reflect.set方法设置target对象的name属性等于value。
        const res = Reflect.set(target, key, value);
        /*
            trigger
            n. （枪械等的）扳机；（尤指引发不良反应或发展的）起因，诱因；（炸弹的）引爆器，触发器
            v. 引发，激发；起动，触发；引爆（炸弹）
         */
        trigger(target, key);// info 触发依赖
        return res;
    }
}

export const mutableHandlers = {
    get,
    set
}

export const readonlyHandlers = {
    get: readonlyGet,
    set(target: any, key: any, value: any) {
        console.warn(`key:${key} set 失败因为 target 是 readonly`, target);
        return true;
    }
}

export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
    get: shallowReadonlyGet
})  