'use strict';

const Fragment = Symbol("Fragment");
const Text = Symbol("Text");
/**
 * 创建一个虚拟节点（VNode）
 * @param type 节点的类型，可以是字符串（代表HTML标签）或者构造函数（代表组件）
 * @param props 节点的属性对象，可选
 * @param children 节点的子元素，可以是字符串、数组或者另一个虚拟节点，可选
 * @returns 返回一个虚拟节点对象
 */
function createVNode(type, props, children) {
    const vnode = {
        type,
        props,
        children,
        component: null,
        key: props && props.key,
        shapeFlag: getShapeFlag(type),
        el: null, // $el 
    };
    if (typeof children === 'string') {
        vnode.shapeFlag |= 4 /* ShapeFlags.TEXT_CHILDREN */;
    }
    else if (Array.isArray(children)) {
        vnode.shapeFlag |= 8 /* ShapeFlags.ARRAY_CHILDREN */;
    }
    // 组件 + children object 
    if (vnode.shapeFlag & 2 /* ShapeFlags.STATEFUL_COMPONENT */) {
        if (typeof children === 'object') {
            vnode.shapeFlag |= 16 /* ShapeFlags.SLOT_CHILDREN */; // zlj 是个地方写错，导致报错
        }
    }
    if (vnode.shapeFlag & 1 /* ShapeFlags.ELEMENT */) {
        console.log(`创建element元素 type:${type} -- ${JSON.stringify(props)}`);
    }
    else if (vnode.shapeFlag & 2 /* ShapeFlags.STATEFUL_COMPONENT */) {
        console.log(`创建component组件type.name=${type.name}`);
    }
    // debugger
    return vnode;
}
function createTextVNode(text) {
    return createVNode(Text, {}, text);
}
function getShapeFlag(type) {
    return typeof type === 'string'
        ? 1 /* ShapeFlags.ELEMENT */
        : 2 /* ShapeFlags.STATEFUL_COMPONENT */;
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

function renderSlots(slots, name, props) {
    const slot = slots[name];
    if (slot) {
        // function
        if (typeof slot === "function") {
            // children 是不可以有array 
            // 只需要把 chirldern 
            return createVNode(Fragment, {}, slot(props));
        }
    }
}

function toDisplayString(value) {
    return String(value);
}

const extend = Object.assign;
const EMPTY_OBJ = {};
const isObject = (val) => {
    return val !== null && typeof val === 'object';
};
const isString = (value) => typeof value === "string";
const hasChanged = (val, newValue) => {
    return !Object.is(val, newValue);
};
const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key);
const camelize = (str) => {
    return str.replace(/-(\w)/g, (_, c) => {
        return c ? c.toUpperCase() : "";
    });
};
const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
const toHandlerKey = (str) => {
    return str ? "on" + capitalize(str) : "";
};

let activeEffect;
let shouldTrack; // 是否需要收集
class ReactiveEffect {
    constructor(fn, _scheduler) {
        this._scheduler = _scheduler;
        this.deps = [];
        this.active = true;
        this._fn = fn;
        this.scheduler = _scheduler;
    }
    run() {
        //1.会收集依赖
        // shouldTrack 来做区分
        if (!this.active) {
            return this._fn();
        }
        shouldTrack = true;
        activeEffect = this;
        const result = this._fn();
        // reset 
        shouldTrack = false;
        return result;
    }
    stop() {
        if (this.active) {
            cleanupEffect(this);
            if (this.onStop) {
                this.onStop();
            }
            this.active = false;
        }
    }
}
function cleanupEffect(effect) {
    effect.deps.forEach((dep) => {
        dep.delete(effect);
    });
    effect.deps.length = 0;
}
//todo -- 收集依赖 06视频 14:30
const targetMap = new Map();
function track(target, key) {
    if (!isTracking())
        return;
    // target -> key -> dep
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        depsMap = new Map(); // map.set(key,value) 
        targetMap.set(target, depsMap);
    }
    let dep = depsMap.get(key);
    if (!dep) {
        dep = new Set();
        depsMap.set(key, dep);
    }
    trackEffects(dep);
}
function trackEffects(dep) {
    //看看 dep 之前有没有添加过，添加过的话 那么就不添加了
    if (dep.has(activeEffect))
        return;
    dep.add(activeEffect);
    // todo 这个是什么意思  对应的 cleanupEffect()方法 里面有删除操作。 https://www.zhihu.com/question/439459521
    //https://www.zhihu.com/question/439459521
    //https://zhuanlan.zhihu.com/p/576055727
    activeEffect.deps.push(dep); // 反向搜集
}
function isTracking() {
    return shouldTrack && activeEffect !== undefined;
    // if (!activeEffect) return;
    // if (!shouldTrack) return;
}
// todo -- 触发依赖
function trigger(target, key) {
    let depsMap = targetMap.get(target);
    let dep = depsMap.get(key);
    triggerEffects(dep);
}
function triggerEffects(dep) {
    for (const effect of dep) {
        if (effect.scheduler) {
            effect.scheduler();
        }
        else {
            effect.run();
        }
    }
}
// _effect.onStop = options.onStop;
//options 
// Object.assign() 静态方法将一个或者多个源对象中所有可枚举的自有属性复制到目标对象，并返回修改后的目标对象。
/*
    const target = { a: 1, b: 2 };
    const source = { b: 4, c: 5 };
    const returnedTarget = Object.assign(target, source);
    console.log(target);
    // Expected output: Object { a: 1, b: 4, c: 5 }
    console.log(returnedTarget === target);
    // Expected output: true
*/
// bind(this: Function, thisArg: any, ...argArray: any[]): any;
/*
    Function 实例的 bind() 方法创建一个新函数，当调用该新函数时，它会调用原始函数并将其 this 关键字设置为给定的值，
    同时，还可以传入一系列指定的参数，这些参数会插入到调用新函数时传入的参数的前面。
*/
// bind() 创建一个新函数，runner(), runner()被调用的时候仍然执行 _effect.run()函数，这时候_effect.run()的this就是参数 _effect;
/*
   runner是个函数，怎么能 .effect
   https://juejin.cn/post/7076967942079905806
*/
function effect(fn, options = {}) {
    const _effect = new ReactiveEffect(fn, options.scheduler);
    extend(_effect, options); // export const extend = Object.assign;
    _effect.run();
    const runner = _effect.run.bind(_effect);
    runner.effect = _effect; // 这里忘记写，报错了。 
    return runner; //bind -- learn 2 
}

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);
function createGetter(isReadOnly = false, shallow = false) {
    return function get(target, key) {
        /*
        Reflect.get方法查找并返回target对象的name属性，如果没有该属性返回undefined
         */
        if (key === "__v_isReactive" /* ReactiveFlags.IS_REACTIVE */) {
            return !isReadOnly;
        }
        else if (key === "__v_isReadonly" /* ReactiveFlags.IS_READONLY */) {
            return isReadOnly;
        }
        const res = Reflect.get(target, key); // 取值操作，类似 target.key
        if (shallow) {
            return res;
        }
        //看看 res 是不是 object 
        if (isObject(res)) {
            return isReadOnly ? readonly(res) : reactive(res);
        }
        if (!isReadOnly) {
            //info 收集依赖 跟踪
            track(target, key);
        }
        return res;
    };
}
function createSetter() {
    return function set(target, key, value) {
        debugger;
        //Reflect.set方法设置target对象的name属性等于value。
        const res = Reflect.set(target, key, value);
        /*
            trigger
            n. （枪械等的）扳机；（尤指引发不良反应或发展的）起因，诱因；（炸弹的）引爆器，触发器
            v. 引发，激发；起动，触发；引爆（炸弹）
         */
        trigger(target, key); // info 触发依赖
        return res;
    };
}
const mutableHandlers = {
    get,
    set
};
const readonlyHandlers = {
    get: readonlyGet,
    set(target, key, value) {
        console.warn(`key:${key} set 失败因为 target 是 readonly`, target);
        return true;
    }
};
const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
    get: shallowReadonlyGet
});

function reactive(raw) {
    return createActiveObject(raw, mutableHandlers);
}
function readonly(raw) {
    return createActiveObject(raw, readonlyHandlers);
}
function shallowReadonly(raw) {
    return createActiveObject(raw, shallowReadonlyHandlers);
}
function createActiveObject(target, baseHandlers) {
    if (!isObject(target)) {
        console.warn(`target ${target} 必须是一个对象`);
        return target;
    }
    return new Proxy(target, baseHandlers); // tsconfig.json  lib处理。
}

class RefImpl {
    constructor(value) {
        this.__v_isRef = true;
        this._rawValue = value;
        this._value = convert(value);
        // value -> reactive
        // 1. 看看value 是不是对象 
        this.dep = new Set();
    }
    get value() {
        trackRefValue(this);
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
            triggerEffects(this.dep);
        }
    }
}
function trackRefValue(ref) {
    if (isTracking()) {
        trackEffects(ref.dep);
    }
}
function ref(value) {
    return new RefImpl(value);
}
function isRef(ref) {
    // 
    return !!ref.__v_isRef;
}
function unRef(ref) {
    //  看看是不是ref -> ref.value
    // ref 
    return isRef(ref) ? ref.value : ref;
}
function proxyRefs(objectWithRefs) {
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
            }
            else {
                return Reflect.set(target, key, value);
            }
        }
    });
}
function convert(value) {
    return isObject(value) ? reactive(value) : value;
}

function emit(instance, event, ...args) {
    console.log("componentEmit---emit", event);
    const { props } = instance;
    // add -> Add
    // add-foo -> addFoo 
    const handlerName = toHandlerKey(camelize(event));
    const handler = props[handlerName];
    handler && handler(...args);
}

function initProps(instance, rawProps) {
    instance.props = rawProps || {};
}

const publicPropertiesMap = {
    $el: (i) => i.vnode.el,
    $slots: (i) => i.slots,
    $props: (i) => i.props,
};
const PublicInstancePoxyHandlers = {
    get({ _: instance }, key) {
        // debugger
        const { setupState, props } = instance;
        if (key in setupState) {
            return setupState[key];
        }
        if (hasOwn(setupState, key)) {
            return setupState[key];
        }
        else if (hasOwn(props, key)) {
            return props[key];
        }
        const publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
    }
};
// key -> $el
// if (key === '$el') {
//     return instance.vnode.el;
// }

function initSlots(instance, children) {
    const { vnode } = instance;
    if (vnode.shapeFlag & 16 /* ShapeFlags.SLOT_CHILDREN */) {
        normalizeObjectSlots(children, instance.slots);
    }
}
function normalizeObjectSlots(children, slots) {
    for (const key in children) {
        const value = children[key];
        slots[key] = (props) => normalizeSlotValue(value(props));
    }
}
function normalizeSlotValue(value) {
    return Array.isArray(value) ? value : [value];
}

function createComponentInstance(vnode, parent) {
    const componet = {
        vnode,
        type: vnode.type,
        next: null,
        setupState: {},
        props: {},
        slots: {},
        provides: parent ? parent.provides : {},
        parent,
        isMounted: false,
        subTree: {},
        emit: () => { }
    };
    componet.emit = emit.bind(null, componet);
    return componet;
}
function setupComponent(instance) {
    debugger;
    // debugger // 这个地方逻辑卡住，需要继续研究
    // todo
    //1
    initProps(instance, instance.vnode.props);
    //2
    initSlots(instance, instance.vnode.children);
    //3 -- 初始化有状态的component <组件>
    setupStatefulComponent(instance);
    // 4 走完之后会进入到path
}
function setupStatefulComponent(instance) {
    // TODO：component组件，其实就是，app.js中 App对象。
    const component = instance.type;
    instance.proxy = new Proxy({ _: instance }, PublicInstancePoxyHandlers);
    // instance.proxy = new Proxy( {} , {
    //     get( target, key){
    //         const { setupState } = instance;
    //         console.log(setupState);
    //         debugger
    //     }
    // })
    // instance.proxy.msg;
    const { setup } = component;
    if (setup) {
        setCurrentInstance(instance);
        // debugger// 调用foot setup
        const setupResult = setup(shallowReadonly(instance.props), { emit: instance.emit });
        setCurrentInstance(null);
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    if (typeof setupResult === "object") {
        instance.setupState = proxyRefs(setupResult);
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    const Component = instance.type;
    if (compiler && !Component.render) {
        if (Component.template) {
            Component.render = compiler(Component.template);
        }
    }
    instance.render = Component.render;
}
let currentInstance = null;
function getCurrentInstance() {
    return currentInstance;
}
function setCurrentInstance(instance) {
    currentInstance = instance;
}
let compiler;
function registerRuntimeCompiler(_comiler) {
    compiler = _comiler;
}

function provide(key, value) {
    var _a;
    // 存   
    //key value 
    const currentInstance = getCurrentInstance();
    if (currentInstance) {
        let { provides } = currentInstance;
        const parentProvides = (_a = currentInstance.parent) === null || _a === void 0 ? void 0 : _a.provides;
        // init  
        if (provides === parentProvides) {
            provides = currentInstance.provides = Object.create(parentProvides);
        }
        provides[key] = value;
    }
}
function inject(key, defaultValue) {
    //取
    const currentInstance = getCurrentInstance();
    if (currentInstance) {
        const { parent } = currentInstance;
        const parentProvides = parent.provides;
        if (key in parentProvides) {
            return parentProvides[key];
        }
        else if (defaultValue) {
            if (typeof defaultValue === "function") {
                return defaultValue();
            }
            return defaultValue;
        }
    }
}

function shouldUpdateComponent(prevVNode, nextVNode) {
    const { props: prevProps } = prevVNode;
    const { props: nextProps } = nextVNode;
    for (const key in nextProps) {
        if (nextProps[key] !== prevProps[key]) {
            return true;
        }
    }
    return false;
}

/*
视频 20-实现初始化 component 主流程 5:03开始

*/
function createAppApi(render) {
    return function createApp(rootComponent) {
        /*
        zlj -- 学了这么久，重新梳理下概念，会有助于理解
            组件：  组件就是 vnode.component.type，即 App = { name:"", render(){}, setup(){}}
                    .vue文件中template中的内容，会被编译成 render 函数，即 App.render = function(){ return {type:"div", children:"hello"}}
            容器：显示网页内容，html标签。
        */
        return {
            mount(rootContainer) {
                //  rootComponent 就是 main.js 中App = { name:"", render(){}, setup(){}}。
                debugger;
                const vnode = createVNode(rootComponent);
                render(vnode, rootContainer); // renderer.ts 中的 render 函数.
            }
        };
    };
}

const queue = [];
const p = Promise.resolve();
let isFlushPending = false;
function nextTick(fn) {
    return fn ? p.then(fn) : p;
}
function queueJobs(job) {
    if (!queue.includes(job)) {
        queue.push(job);
    }
    queueFlush();
}
function queueFlush() {
    if (isFlushPending)
        return;
    isFlushPending = true;
    nextTick(flushJobs);
}
function flushJobs() {
    isFlushPending = false;
    let job;
    // 取出头部
    while (job = queue.shift()) {
        job && job();
    }
}

/*
    todo : 生成js代码。
    npm run build --watch

*/
function createRender(options) {
    /*
    const renderer: any = createRender({
    createElement,
    patchProp,
    insert,
    remove,
    setElementText
    })
    */
    const { //此处的方法 在  runtime-dom\index.ts 里面实现
    createElement: hostCreateElement, patchProp: hostPatchProp, insert: hostInsert, remove: hostRemove, setElementText: hostSetElementText, } = options;
    //0x000000
    function render(vnode, container) {
        // patch 
        patch(null, vnode, container, null, null);
    }
    // n1 -> 老的 //n2 -> 新的
    //0x000001
    function patch(n1, n2, container, parentComponent, anchor) {
        const { type, shapeFlag } = n2;
        switch (type) {
            case Fragment:
                processFragment(n1, n2, container, parentComponent, anchor);
                break;
            case Text:
                processText(n1, n2, container);
                break;
            default:
                if (shapeFlag & 1 /* ShapeFlags.ELEMENT */) { // 
                    processElement(n1, n2, container, parentComponent, anchor);
                }
                else if (shapeFlag & 2 /* ShapeFlags.STATEFUL_COMPONENT */) { // todo 先处理组件
                    processComponent(n1, n2, container, parentComponent, anchor);
                }
                break;
        }
    }
    //0x000002
    function processComponent(n1, n2, container, parentComponent, anchor) {
        if (!n1) {
            // 先创建
            mountComponent(n2, container, parentComponent, anchor);
        }
        else {
            updateComponent(n1, n2);
        }
    }
    // 0x000003
    function mountComponent(initialVNode, container, parentComponent, anchor) {
        //1.创建instance
        const instance = (initialVNode.component = createComponentInstance(initialVNode, parentComponent));
        //2.更新组件 有3个方法调用
        setupComponent(instance);
        setupRenderEffect(instance, initialVNode, container, anchor);
    }
    // 0x000004
    function setupRenderEffect(instance, initialVNode, container, anchor) {
        instance.update = effect(() => {
            if (!instance.isMounted) {
                const { proxy } = instance;
                // 根据instance 调用 render函数，生成虚拟节点树。
                // debugger
                const subTree = (instance.subTree = instance.render.call(proxy, proxy)); // instance.render 就是App.js 中render 函数。
                patch(null, subTree, container, instance, anchor);
                // debugger
                initialVNode.el = subTree.el; // 2024-03-28  <23-实现组件代理对象，需要再加深>
                instance.isMounted = true;
            }
            else {
                console.log("update");
                //需要一个 vnode 
                const { next, vnode, } = instance;
                if (next) {
                    next.el = vnode.el;
                    updateComponentPreRender(instance, next);
                }
                const { proxy } = instance;
                const subTree = instance.render.call(proxy, proxy); // 当前的subtree
                const prevSubTree = instance.subTree; // 上一次的subtree
                instance.subTree = subTree; // 更新, 下次使用的subtree
                patch(prevSubTree, subTree, container, instance, anchor);
            }
        }, {
            scheduler() {
                // console.log("update - scheduler ")
                queueJobs(instance.update);
            }
        });
    }
    //0x000005            
    function processElement(n1, n2, container, parentComponent, anchor) {
        if (!n1) {
            mountElement(n2, container, parentComponent, anchor);
        }
        else {
            patchElement(n1, n2, container, parentComponent, anchor);
        }
    }
    //0x000006
    function mountElement(vnode, container, parentComponent, anchor) {
        // vnode -> element -> div
        // debugger
        const el = (vnode.el = hostCreateElement(vnode.type));
        const { children, shapeFlag } = vnode;
        if (shapeFlag & 4 /* ShapeFlags.TEXT_CHILDREN */) {
            el.textContent = children;
        }
        else if (shapeFlag & 8 /* ShapeFlags.ARRAY_CHILDREN */) { // array_children 
            mountChildren(vnode.children, el, parentComponent, anchor); // container 应该是el
        }
        // props 
        const { props } = vnode;
        for (const key in props) {
            const val = props[key];
            hostPatchProp(el, key, null, val); // runtime-dom\index.ts  -patchProp()
        }
        // container.append(el)
        hostInsert(el, container, anchor);
    }
    //0x000007
    function mountChildren(children, container, parentComponent, anchor) {
        children.forEach((v) => {
            patch(null, v, container, parentComponent, anchor);
        });
    }
    function unmountChildren(children) {
        for (let i = 0; i < children.length; i++) {
            const el = children[i].el;
            //同 insert 一样
            hostRemove(el);
        }
    }
    function patchElement(n1, n2, container, parentComponent, anchor) {
        const oldProps = n1.props || EMPTY_OBJ;
        const newProps = n2.props || EMPTY_OBJ;
        const el = (n2.el = n1.el);
        patchChildren(n1, n2, el, parentComponent, anchor);
        patchProps(el, oldProps, newProps);
    }
    function patchProps(el, oldProps, newProps) {
        if (oldProps !== newProps) {
            for (const key in newProps) {
                const prevProp = oldProps[key];
                const nextProp = newProps[key];
                if (prevProp !== nextProp) {
                    hostPatchProp(el, key, prevProp, nextProp);
                }
            }
            if (oldProps !== EMPTY_OBJ) {
                for (const key in oldProps) {
                    if (!(key in newProps)) {
                        hostPatchProp(el, key, oldProps[key], null);
                    }
                }
            }
        }
    }
    function patchChildren(n1, n2, container, parentComponent, anchor) {
        const prevShapeFlag = n1.shapeFlag;
        const { shapeFlag } = n2;
        const c1 = n1.children;
        const c2 = n2.children;
        if (shapeFlag & 4 /* ShapeFlags.TEXT_CHILDREN */) {
            if (prevShapeFlag & 8 /* ShapeFlags.ARRAY_CHILDREN */) {
                //1.把老的children清空
                unmountChildren(n1.children);
                //2. 设置 text   
                // hostSetElementText(container, c2)
            }
            if (c1 !== c2) {
                hostSetElementText(container, c2);
            }
        }
        else {
            //new array 
            if (prevShapeFlag & 4 /* ShapeFlags.TEXT_CHILDREN */) {
                hostSetElementText(container, "");
                mountChildren(c2, container, parentComponent, anchor);
            }
            else {
                patchKeyedChildren(c1, c2, container, parentComponent, anchor);
            }
        }
    }
    // todo 算法 
    function patchKeyedChildren(c1, c2, container, parentComponent, parentAnchor) {
        const l2 = c2.length;
        let i = 0;
        let e1 = c1.length - 1; //老
        let e2 = l2 - 1; //新
        function isSomeVNodeType(n1, n2) {
            //type  //key 
            return n1.type === n2.type && n1.key === n2.key;
        }
        //左侧
        while (i <= e1 && i <= e2) {
            const n1 = c1[i];
            const n2 = c2[i];
            if (isSomeVNodeType(n1, n2)) {
                patch(n1, n2, container, parentComponent, parentAnchor);
            }
            else {
                break;
            }
            i++;
        }
        //右侧
        while (i <= e1 && i <= e2) {
            const n1 = c1[e1];
            const n2 = c2[e2];
            if (isSomeVNodeType(n1, n2)) {
                patch(n1, n2, container, parentComponent, parentAnchor);
            }
            else {
                break;
            }
            e1--;
            e2--;
        }
        //3. 新的比老的多，创建
        if (i > e1) {
            if (i <= e2) {
                const nextPos = e2 + 1;
                const anchor = nextPos < l2 ? c2[nextPos].el : null;
                while (i <= e2) {
                    patch(null, c2[i], container, parentComponent, anchor);
                    i++;
                }
            }
        }
        else if (i >= e2) {
            while (i <= e1) {
                hostRemove(c1[i].el);
                i++;
            }
        }
        else {
            //todo 乱序的部分
            //中间对比
            let s1 = i; //老节点开始
            let s2 = i;
            const tobePatched = e2 - s2 + 1; // 新接口右侧 e2 - 左侧索引 s2   结果需要+1；长度
            let patched = 0;
            const keyToNewIndexMap = new Map();
            const newIndexToOldIndexMap = new Array(tobePatched);
            let moved = false;
            let maxNewIndexSoFar = 0;
            newIndexToOldIndexMap[i] = 0;
            for (let i = 0; i < tobePatched; i++) {
                newIndexToOldIndexMap[i] = 0;
            }
            for (let i = s2; i <= e2; i++) {
                const nextChild = c2[i];
                keyToNewIndexMap.set(nextChild.key, i);
            }
            // null undefined 
            for (let i = s1; i <= e1; i++) {
                const prevChild = c1[i];
                if (patched >= tobePatched) {
                    hostRemove(prevChild.el);
                    continue;
                }
                let newIndex;
                if (prevChild.key != null) {
                    newIndex = keyToNewIndexMap.get(prevChild.key);
                }
                else {
                    for (let j = s2; j < e2; j++) {
                        if (isSomeVNodeType(prevChild, c2[j])) {
                            newIndex = j;
                            break;
                        }
                    }
                }
                if (newIndex === undefined) {
                    hostRemove(prevChild.el);
                }
                else {
                    if (newIndex >= maxNewIndexSoFar) {
                        maxNewIndexSoFar = newIndex;
                    }
                    else {
                        moved = true;
                    }
                    newIndexToOldIndexMap[newIndex - s2] = i + 1;
                    patch(prevChild, c2[newIndex], container, parentComponent, null);
                    patched++;
                }
            }
            // 最长递增子序列
            const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : [];
            let j = increasingNewIndexSequence.length - 1;
            for (let i = (tobePatched - 1); i >= 0; i--) {
                const nextindex = i + s2;
                const nextChild = c2[nextindex];
                const anchor = nextindex + 1 < l2 ? c2[nextindex + 1].el : null;
                if (newIndexToOldIndexMap[i] === 0) {
                    patch(null, nextChild, container, parentComponent, anchor);
                }
                else if (moved) {
                    if (j < 0 || i !== increasingNewIndexSequence[j]) {
                        console.log("移动位置");
                        hostInsert(nextChild.el, container, anchor);
                    }
                    else {
                        j--;
                    }
                }
            }
        }
    }
    function updateComponent(n1, n2) {
        const instance = (n2.component = n1.component);
        if (shouldUpdateComponent(n1, n2)) {
            instance.next = n2;
            instance.update();
        }
        else {
            n2.el = n1.el;
            instance.vnode = n2;
        }
    }
    function processFragment(n1, n2, container, parentComponent, anchor) {
        // implement 
        mountChildren(n2.children, container, parentComponent, anchor);
    }
    function processText(n1, n2, container) {
        const { children } = n2;
        const textNode = (n2.el = document.createTextNode(children));
        container.append(textNode);
    }
    return {
        createApp: createAppApi(render)
    };
}
function updateComponentPreRender(instance, nextVNode) {
    instance.vnode = nextVNode;
    instance.next = null;
    instance.props = nextVNode.props;
}
//  [4,2,3,1,5]  --->[2,3,5]
function getSequence(arr) {
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
                }
                else {
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

function createElement(type) {
    return document.createElement(type);
}
function patchProp(el, key, prevVal, nextVal) {
    const isOn = (key) => /^on[A-Z]/.test(key);
    if (isOn(key)) {
        const event = key.slice(2).toLowerCase();
        el.addEventListener(event, nextVal);
    }
    else {
        if (nextVal === undefined || nextVal === null) {
            el.removeAttribute(key);
        }
        else {
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
function setElementText(el, text) {
    el.textContent = text;
}
const renderer = createRender({
    createElement,
    patchProp,
    insert,
    remove,
    setElementText
});
function createApp(...args) {
    return renderer.createApp(...args);
}

var runtimeDom = /*#__PURE__*/Object.freeze({
    __proto__: null,
    createApp: createApp,
    createElementVNode: createVNode,
    createRender: createRender,
    createTextVNode: createTextVNode,
    getCurrentInstance: getCurrentInstance,
    h: h,
    inject: inject,
    nextTick: nextTick,
    provide: provide,
    proxyRefs: proxyRefs,
    ref: ref,
    registerRuntimeCompiler: registerRuntimeCompiler,
    renderSlots: renderSlots,
    toDisplayString: toDisplayString
});

const TO_DISPLAY_STRING = Symbol("toDisplayString");
const CREATE_ELEMENT_VNODE = Symbol("createElementVNode");
const helperMapName = {
    [TO_DISPLAY_STRING]: "toDisplayString",
    [CREATE_ELEMENT_VNODE]: "createElementVNode"
};

function generate(ast) {
    const context = createCodegenContext();
    const { push } = context;
    genFunctionPreamble(ast, context);
    const functionName = "render";
    const args = ["_ctx", "_cache"];
    const signature = args.join(",");
    push(`function ${functionName}(${signature}){`);
    // console.log(ast);
    push("return ");
    genNode(ast.codegenNode, context);
    push("}");
    return {
        code: context.code
    };
}
function genFunctionPreamble(ast, context) {
    const { push } = context;
    const VueBinging = "Vue";
    const aliasHelper = (s) => `${helperMapName[s]}:_${helperMapName[s]}`;
    if (ast.helpers.length > 0) {
        push(`const { ${ast.helpers.map(aliasHelper).join(", ")}} = ${VueBinging}`);
    }
    push("\n");
    push("return ");
}
function genNode(node, context) {
    switch (node.type) {
        case 3 /* NodeTypes.TEXT */:
            genText(node, context);
            break;
        case 0 /* NodeTypes.INTERPOLATION */:
            genInterpolation(node, context);
            break;
        case 1 /* NodeTypes.SIMPLE_EXPRESSION */:
            genExpression(node, context);
            break;
        case 2 /* NodeTypes.ELEMENT */:
            genElement(node, context);
            break;
        case 5 /* NodeTypes.COMPOUND_EXPRESSION */:
            genCompoundExpression(node, context);
            break;
    }
}
function genElement(node, context) {
    const { push, helper } = context;
    const { tag, children, props } = node;
    push(`${helper(CREATE_ELEMENT_VNODE)}(`);
    genNodeList(genNullable([tag, props, children]), context);
    push(")");
}
function genNodeList(nodes, context) {
    const { push } = context;
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (isString(node)) {
            push(node);
        }
        else {
            genNode(node, context);
        }
        if (i < nodes.length - 1) {
            push(", ");
        }
    }
}
function genText(node, context) {
    const { push } = context;
    push(`'${node.content}'`);
}
function createCodegenContext() {
    const context = {
        code: "",
        push(source) {
            context.code += source;
        },
        helper(key) {
            return `_${helperMapName[key]}`;
        }
    };
    return context;
}
function genInterpolation(node, context) {
    const { push, helper } = context;
    push(`${helper(TO_DISPLAY_STRING)}(`);
    genNode(node.content, context);
    push(')');
}
function genExpression(node, context) {
    const { push } = context;
    push(`${node.content}`);
}
function genCompoundExpression(node, context) {
    const { push } = context;
    const children = node.children;
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (isString(child)) {
            push(child);
        }
        else {
            debugger;
            genNode(child, context);
        }
    }
}
function genNullable(args) {
    return args.map((arg) => arg || "null");
}

function baseParse(content) {
    const context = createParseContent(content);
    return createRoot(parseChildren(context, []));
}
function parseChildren(context, ancestors) {
    const nodes = [];
    while (!isEnd(context, ancestors)) {
        let node;
        const s = context.source;
        if (s.startsWith("{{")) {
            node = parseInterpolation(context);
        }
        else if (s[0] === '<') {
            if (/[a-z]/i.test(s[1])) {
                node = parseElement(context, ancestors);
            }
        }
        if (!node) {
            node = parseText(context);
        }
        nodes.push(node);
    }
    return nodes;
}
function isEnd(context, ancestors) {
    const s = context.source;
    if (s.startsWith("</")) {
        for (let i = 0; i < ancestors.length; i++) {
            const tag = ancestors[i].tag;
            if (startWithEndTagOpen(s, tag)) {
                return true;
            }
        }
    }
    //2.当遇到结束标签的时候
    // if (parentTag && s.startsWith(`</${parentTag}>`)) {
    //     return true;
    // }
    //1.source 有值的时候
    return !context.source;
}
function parseInterpolation(context) {
    // {{message}}
    const openDelimiter = "{{";
    const closeDelimiter = "}}";
    const clsoeIndex = context.source.indexOf("}}", openDelimiter.length);
    advanceBy(context, openDelimiter.length);
    const rawContentLength = clsoeIndex - openDelimiter.length;
    const rawContent = parseTextData(context, rawContentLength); // context.source.slice(0, rawContentLength);
    const content = rawContent.trim();
    advanceBy(context, closeDelimiter.length);
    return {
        type: 0 /* NodeTypes.INTERPOLATION */,
        content: {
            type: 1 /* NodeTypes.SIMPLE_EXPRESSION */,
            content: content,
        }
    };
}
function advanceBy(context, length) {
    context.source = context.source.slice(length);
}
function createRoot(children) {
    return {
        children,
        type: 4 /* NodeTypes.ROOT */,
        helpers: [],
    };
}
function createParseContent(content) {
    return {
        source: content
    };
}
function parseElement(context, ancestors) {
    //Implement
    // 1.解析tag
    const element = parseTag(context, 0 /* TagType.Start */);
    ancestors.push(element);
    element.children = parseChildren(context, ancestors);
    ancestors.pop();
    if (startWithEndTagOpen(context.source, element.tag)) {
        parseTag(context, 1 /* TagType.End */);
    }
    else {
        throw new Error(`缺少结束标签：${element.tag}`);
    }
    return element;
}
function startWithEndTagOpen(source, tag) {
    return source.startsWith("</") && source.slice(2, 2 + tag.length).toLowerCase() === tag.toLowerCase();
}
function parseTag(context, type) {
    const match = /^<\/?([a-z]*)/i.exec(context.source);
    // console.log(match);
    const tag = match[1];
    //2.删除处理完成的代码
    advanceBy(context, match[0].length);
    advanceBy(context, 1);
    // console.log(context);
    if (type === 1 /* TagType.End */)
        return;
    return {
        type: 2 /* NodeTypes.ELEMENT */,
        tag,
    };
}
function parseText(context) {
    let endIndex = context.source.length;
    let endTokens = ["<", "{{"];
    for (let i = 0; i < endTokens.length; i++) {
        const index = context.source.indexOf(endTokens[i]);
        if (index !== -1 && endIndex > index) {
            endIndex = index;
        }
    }
    //1. 获取content
    const content = parseTextData(context, endIndex);
    // console.log("content-------------", content);
    // console.log(context.source);
    return {
        type: 3 /* NodeTypes.TEXT */,
        content
    };
}
function parseTextData(context, length) {
    const content = context.source.slice(0, length);
    //2.推进
    advanceBy(context, length);
    return content;
}

function transform(root, options = {}) {
    const context = createTransformContext(root, options);
    //1. 遍历 - 深度优先搜索
    traverseNode(root, context);
    //2. 修改 nextcontent
    createRootCodegen(root);
    root.helpers = [...context.helpers.keys()];
}
function traverseNode(node, context) {
    const nodeTransforms = context.nodeTransforms;
    const exitFns = [];
    for (let i = 0; i < nodeTransforms.length; i++) {
        const transform = nodeTransforms[i];
        const onExit = transform(node, context);
        if (onExit)
            exitFns.push(onExit);
    }
    switch (node.type) {
        case 0 /* NodeTypes.INTERPOLATION */:
            context.helper(TO_DISPLAY_STRING);
            break;
        case 4 /* NodeTypes.ROOT */:
        case 2 /* NodeTypes.ELEMENT */:
            traverseChildren(node, context);
            break;
    }
    let i = exitFns.length;
    while (i--) {
        exitFns[i]();
    }
}
function traverseChildren(node, context) {
    const children = node.children;
    for (let i = 0; i < children.length; i++) {
        const node = children[i];
        traverseNode(node, context);
    }
}
function createTransformContext(root, options) {
    const context = {
        root,
        nodeTransforms: options.nodeTransforms || [],
        helpers: new Map(),
        helper(key) {
            context.helpers.set(key, 1);
        },
    };
    return context;
}
function createRootCodegen(root) {
    const child = root.children[0];
    if (child.type === 2 /* NodeTypes.ELEMENT */) {
        root.codegenNode = child.codegenNode;
    }
    else {
        root.codegenNode = root.children[0];
    }
}

function createVNodeCall(context, tag, props, children) {
    context.helper(CREATE_ELEMENT_VNODE);
    return {
        type: 2 /* NodeTypes.ELEMENT */,
        tag,
        props,
        children
    };
}

function transformElement(node, context) {
    if (node.type === 2 /* NodeTypes.ELEMENT */) {
        return () => {
            //中间处理层
            //tag
            const vnodeTag = `'${node.tag}'`;
            // props 
            let vnodeProps;
            //children
            const children = node.children;
            let vnodeChildren = children[0];
            node.codegenNode = createVNodeCall(context, vnodeTag, vnodeProps, vnodeChildren);
        };
    }
}

function transformExpression(node) {
    if (node.type === 0 /* NodeTypes.INTERPOLATION */) {
        node.content = processExprssion(node.content);
    }
}
function processExprssion(node) {
    node.content = `_ctx.${node.content}`;
    return node;
}

function isText(node) {
    return (node.type === 3 /* NodeTypes.TEXT */ || node.type === 0 /* NodeTypes.INTERPOLATION */);
}

function transformText(node) {
    if (node.type === 2 /* NodeTypes.ELEMENT */) {
        return () => {
            const { children } = node;
            let currentContainer;
            for (let i = 0; i < children.length; i++) {
                const child = children[i];
                if (isText(child)) {
                    for (let j = i + 1; j < children.length; j++) {
                        const next = children[j];
                        if (isText(next)) {
                            if (!currentContainer) {
                                currentContainer = children[i] = {
                                    type: 5 /* NodeTypes.COMPOUND_EXPRESSION */,
                                    children: [child]
                                };
                            }
                            currentContainer.children.push(" + ");
                            currentContainer.children.push(next);
                            children.splice(j, 1);
                            j--;
                        }
                        else {
                            currentContainer = undefined;
                            break;
                        }
                    }
                }
            }
        };
    }
}

function baseCompile(template) {
    const ast = baseParse(template);
    transform(ast, {
        nodeTransforms: [transformExpression, transformElement, transformText]
    });
    return generate(ast);
}

// mini-vue 出口
function compileToFunction(template) {
    const { code } = baseCompile(template);
    const render = new Function("Vue", code)(runtimeDom);
    return render;
}
registerRuntimeCompiler(compileToFunction);

exports.createApp = createApp;
exports.createElementVNode = createVNode;
exports.createRender = createRender;
exports.createTextVNode = createTextVNode;
exports.getCurrentInstance = getCurrentInstance;
exports.h = h;
exports.inject = inject;
exports.nextTick = nextTick;
exports.provide = provide;
exports.proxyRefs = proxyRefs;
exports.ref = ref;
exports.registerRuntimeCompiler = registerRuntimeCompiler;
exports.renderSlots = renderSlots;
exports.toDisplayString = toDisplayString;
