import {mutableHandlers, readonlyHandlers} from './baseHandlers';
// import {track, trigger} from "./effect";


export const enum ReactiveFlags {
    IS_REACTIVE= "__v_isReactive",
    IS_READONLY = "__v_isReadonly",
}

export function reactive(raw: any) {
    return createActiveObject(raw, mutableHandlers)
}

export function readonly(raw: any) {
    return createActiveObject(raw, readonlyHandlers)
}

export function isReactive(value) {
    return  !!value[ReactiveFlags.IS_REACTIVE]; 
}

export function isReadonly(value) {
    return !!value[ReactiveFlags.IS_READONLY]
}
function createActiveObject(raw: any, baseHandlers) {

    return new Proxy(raw, baseHandlers);
}
