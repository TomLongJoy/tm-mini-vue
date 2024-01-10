import { hasChanged, isObject } from "../shared";
import { isTracking, trackEffects, triggerEffects } from "./effect";
import { reactive } from "./reactive";

class RefImpl {
    private _value: any;
    public dep;
    private _rawValue: any;
    constructor(value) {
        this._rawValue = value;
        this._value = convert(value);
        // value -> reactive
        // 1. 看看value 是不是对象 

        this.dep = new Set();
    }

    get value() {

        trackRefValue(this)
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
            triggerEffects(this.dep)
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

function convert(value) {
    return isObject(value) ? reactive(value) : value;
}