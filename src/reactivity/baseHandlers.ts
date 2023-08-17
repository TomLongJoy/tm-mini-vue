import { track, trigger } from "./effect";

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);


function createGetter(isReadOnly = false) {
    return function get(target: object, key: any) {
        const res = Reflect.get(target, key);
        if (!isReadOnly) {
            track(target, key);////info 收集依赖
        }
        return res;
    }
}

function createSetter() {
    return function set(target: object, key: any, value: any) {
        const res = Reflect.set(target, key, value);
        trigger(target, key);// info 触发依赖
        return res;
    }
}

export const mutableHandlers = {
    get,
    set
}


export const readonlyHandlers = {
    get:readonlyGet,
    set(target: any, key: any, value: any) {
        console.warn(`key:${key} set 失败因为 target 是 readonly`, target);
        return true;
    }
}