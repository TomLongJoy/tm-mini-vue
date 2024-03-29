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
    if (!isObject(target)) {
        console.warn(`target ${target} 必须是一个对象`);
        return;
    }
    return new Proxy(target, baseHandlers);
}

