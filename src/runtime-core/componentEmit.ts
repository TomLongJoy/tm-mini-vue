import { camelize, toHandlerKey } from "../shared/index";

export function emit(instance, event, ...args) {
    console.log("emit", event);
    // instance.props -> event 
    const { props } = instance;
    // add -> Add
    // add-foo -> addFoo 
    // tpp 
    //先去写一个特定的行为， -》 通用的行为
    const handlerName = toHandlerKey(camelize(event));
    const handler = props[handlerName];
    handler && handler(...args);
} 