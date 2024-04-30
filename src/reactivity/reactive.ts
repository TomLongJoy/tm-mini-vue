import { isObject } from '../shared/index';
import { mutableHandlers, readonlyHandlers, shallowReadonlyHandlers } from './baseHandlers';
// import {track, trigger} from "./effect";


export const enum ReactiveFlags {
    IS_REACTIVE = "__v_isReactive",
    IS_READONLY = "__v_isReadonly",
}

export function reactive(raw: any) {
    return createActiveObject(raw, mutableHandlers)
}

export function readonly(raw: any) {
    return createActiveObject(raw, readonlyHandlers)
}

export function shallowReadonly(raw) {
    return createActiveObject(raw, shallowReadonlyHandlers)
}

export function isReactive(value) {
    return !!value[ReactiveFlags.IS_REACTIVE];// 触发get
}

export function isReadonly(value) {
    return !!value[ReactiveFlags.IS_READONLY] // 触发的get
}

export function isProxy(value) {
    return isReactive(value) || isReadonly(value)
}

function createActiveObject(target: any, baseHandlers) {
    getSequence([4,2,3,1,5]);
    if (!isObject(target)) {
        console.warn(`target ${target} 必须是一个对象`);
        return target;
    }
    return new Proxy(target, baseHandlers);// tsconfig.json  lib处理。
}


//  [4,2,3,1,5]  --->[2,3,5]
function getSequence(arr: number[]): number[] {
    debugger
    const p = arr.slice();
    const result = [0];
    let i, j, u, v, c;
    const len = arr.length;
    for (i = 0; i < len; i++) {
        const arrI = arr[i];
        if (arrI !== 0) {
            j = result[result.length - 1];
            if (arr[j] < arrI) {
                p[i] = j;
                result.push(i);
                continue;
            }
            u = 0;
            v = result.length - 1;
            while (u < v) {
                c = (u + v) >> 1;
                if (arr[result[c]] < arrI) {
                    u = c + 1;
                } else {
                    v = c;
                }
            }
            if (arrI < arr[result[u]]) {
                if (u > 0) {
                    p[i] = result[u - 1];
                }
                result[u] = i;
            }
        }
    }
    u = result.length;
    v = result[u - 1];
    while (u-- > 0) {
        result[u] = v;
        v = p[v];
    }
    return result;
}
