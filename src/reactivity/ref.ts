import { hasChanged, isObject } from "../shared";
import { isTracking, trackEffects, triggerEffects } from "./effect";
import { reactive } from "./reactive";

class RefImpl {// impl 接口缩写
    private _value: any;
    public dep;
    private _rawValue: any;
    public __v_isRef = true;
    constructor(value) {
        this._rawValue = value;
        this._value = convert(value);
        // value -> reactive
        // 1. 看看value 是不是对象 
        this.dep = new Set();
    }
    get value() {
        trackRefValue(this);//收集依赖
        return this._value;
    }
    set value(newValue) {
        //一定是先去修改了 value值，
        // newValue -> this._value
        //hasChanged
        // 对比的时候 object 
        if (hasChanged(newValue, this._rawValue)) {
            this._rawValue = newValue;
            this._value = convert(newValue);
            triggerEffects(this.dep);//触发依赖
        };
    }
}

function trackRefValue(ref) {
    if (isTracking()) {
        trackEffects(ref.dep)
    }
}

export function ref(value) {
    return new RefImpl(value);
}

export function isRef(ref) {
    // 
    return !!ref.__v_isRef;
}

export function unRef(ref) {
    //  看看是不是ref -> ref.value
    // ref 
    return isRef(ref) ? ref.value : ref
}

export function proxyRefs(objectWithRefs) {
    // get set 
    return new Proxy(objectWithRefs, {
        get(target, key) {
            // get -> age(ref) 那么就给他返回 .value 
            // not ref -> value
            return unRef(Reflect.get(target, key));
        },
        set(target, key, value) {
            if (isRef(target[key]) && !isRef(value)) {
                return target[key].value = value;
            } else {
                return Reflect.set(target, key, value)
            }
        }
    })
}

function convert(value) {
    return isObject(value) ? reactive(value) : value;
}