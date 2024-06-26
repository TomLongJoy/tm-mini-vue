import { camelize, toHandlerKey } from "../shared/index";
export function  emit(instance, event, ...args) {
    console.log("componentEmit---emit", event);
    const { props } = instance;
    // add -> Add    // add-foo -> addFoo 
    const handlerName = toHandlerKey(camelize(event));
    const handler = props[handlerName];
    debugger
    handler && handler(...args);
} 