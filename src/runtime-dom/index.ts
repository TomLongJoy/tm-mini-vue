
import { createRender } from "../runtime-core"; //  "moduleResolution": "node10", zlj 


function createElement(type: any) {
    console.log("createElement -- ")
    return document.createElement(type)
}

function patchProp(el, key, val) {
    // console.log(key)
    // 具体的 click -> 通用
    // on + Event name
    //onMousedown 
    // debugger
    console.log("patchProp -- ")
    const isOn = (key: string) => /^on[A-Z]/.test(key);
    if (isOn(key)) {
        const event = key.slice(2).toLowerCase();
        el.addEventListener(event, val);
    } else {
        // todo setAttribute 需要了解下
        el.setAttribute(key, val);
    }
}

function insert(el, parent) {
    console.log("insert -- ")

    parent.append(el)
}


const renderer: any = createRender({
    createElement,
    patchProp,
    insert
})

export function createApp(...args) {
    return renderer.createApp(...args);
}

export * from '../runtime-core'
