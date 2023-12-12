import {track, trigger} from "./effect";
import {ReactiveFlags} from "./reactive";

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);

function createGetter(isReadOnly = false) {
    return function get(target: object, key: any) {
        /*
        Reflect.get方法查找并返回target对象的name属性，如果没有该属性返回undefined
         */
        if (key === ReactiveFlags.IS_REACTIVE) {
            return !isReadOnly;
        } else if (key === ReactiveFlags.IS_READONLY) {
            return isReadOnly;
        }

        const res = Reflect.get(target, key);
        if (!isReadOnly) {
            /*
                跟踪
             */
            track(target, key);////info 收集依赖
        }
        return res;
    }
}

function createSetter() {
    return function set(target: object, key: any, value: any) {
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