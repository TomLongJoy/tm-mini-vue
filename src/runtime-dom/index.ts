
import { createRender } from "../runtime-core"; //  "moduleResolution": "node10", zlj 


function createElement(type: any) {
    return document.createElement(type)
}

function patchProp(el, key, prevVal, nextVal) {
    const isOn = (key: string) => /^on[A-Z]/.test(key);
    if (isOn(key)) {
        const event = key.slice(2).toLowerCase();
        el.addEventListener(event, nextVal);
    } else {
        if (nextVal === undefined || nextVal === null) {
            el.removeAttribute(key)
        } else {
            // todo setAttribute 需要了解下
            // 2024-01-26 已经明白
            el.setAttribute(key, nextVal);
        }


    }
}

function insert(child, parent, anchor) {

    // parent.append(el)
    parent.insertBefore(child, anchor || null);
}

function remove(child) {
    const parent = child.parentNode;
    if (parent) {
        parent.removeChild(child);
    }
}

function setElementText(el: any, text: any) {
    el.textContent = text;
}

const renderer: any = createRender({
    createElement,
    patchProp,
    insert,
    remove,
    setElementText
})

export function createApp(...args) {
    return renderer.createApp(...args);
}

export * from '../runtime-core'
