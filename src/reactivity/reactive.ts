import { track,trigger } from "./effect";
export function reactive(raw: any) {
    return new Proxy(raw, {
        get(target, key) {
            const res = Reflect.get(target, key);
            //info 收集依赖
            track(target, key);
            return res;
        },
        set(target, key, value) {
            const res = Reflect.set(target, key, value);
            // info 触发依赖
            trigger(target, key);
            return res;
        }
    })
}