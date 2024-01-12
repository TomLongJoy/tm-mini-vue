"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createApp = createApp;
exports.h = h;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var publicPropertiesMap = {
  $el: function $el(i) {
    return i.vnode.el;
  }
};
var PublicInstancePoxyHandlers = {
  get: function get(_ref, key) {
    var instance = _ref._;
    // setupState 
    var setupState = instance.setupState;

    if (key in setupState) {
      return setupState[key];
    } // key -> $el
    // if (key === '$el') {
    //     return instance.vnode.el;
    // }


    var publicGetter = publicPropertiesMap[key];

    if (publicGetter) {
      return publicGetter(instance);
    }
  }
};

function createComponentInstance(vnode) {
  var componet = {
    vnode: vnode,
    type: vnode.type,
    setupState: {}
  };
  return componet;
}

function setupComponent(instance) {
  // todo
  initProps(instance, instance.vnode.props); // initSlots()
  //   

  setupStatefulComponent(instance);
}

function setupStatefulComponent(instance) {
  var component = instance.type; // ctx <context>

  instance.proxy = new Proxy({
    _: instance
  }, PublicInstancePoxyHandlers);
  var setup = component.setup;

  if (setup) {
    // function Object 
    var setupResult = setup();
    handleSetupResult(instance, setupResult);
  }
}

function handleSetupResult(instance, setupResult) {
  // function Object 
  // todo function 
  if (_typeof(setupResult) === "object") {
    instance.setupState = setupResult;
  }

  finishComponentSetup(instance);
}

function finishComponentSetup(instance) {
  var Component = instance.type;
  instance.render = Component.render; // if (Component.render) {
  // }
}

function render(vnode, container) {
  // patch 
  // 
  patch(vnode, container);
}

function patch(vnode, container) {
  // 去处理组件
  // 判断 是不是 element
  // todo 判断vnode 是不是一个element
  // 思考题：如何区分是 element / component 类型
  // ShapeFlags
  // vnode -> flag
  // element 
  var shapeFlag = vnode.shapeFlag;

  if (shapeFlag & 1
  /* ShapeFlags.ELEMENT */
  ) {
      processElemtn(vnode, container); // STATEFUL_COMPONENT 
    } else if (shapeFlag & 2
  /* ShapeFlags.STATEFUL_COMPONENT */
  ) {
      processComponent(vnode, container);
    }
}

function processElemtn(vnode, container) {
  //init -> update
  mountElement(vnode, container);
}

function mountElement(vnode, container) {
  // vnode -> element -> div
  var el = vnode.el = document.createElement(vnode.type);
  var children = vnode.children,
      shapeFlag = vnode.shapeFlag;

  if (shapeFlag & 4
  /* ShapeFlags.TEXT_CHILDREN */
  ) {
      el.textContent = children;
    } else if (shapeFlag & 8
  /* ShapeFlags.ARRAY_CHILDREN */
  ) {
      // array_children 
      // vnode 
      mountChildren(vnode, el); // container 应该是el
    } // props 


  var props = vnode.props;

  for (var key in props) {
    var val = props[key];
    console.log(key); // 具体的 click -> 通用
    // on + Event name
    //onMousedown 
    // debugger

    var isOn = function isOn(key) {
      return /^on[A-Z]/.test(key);
    };

    if (isOn(key)) {
      var event = key.slice(2).toLowerCase();
      el.addEventListener(event, val);
    } else {
      // todo setAttribute 需要了解下
      el.setAttribute(key, val);
    }
  }

  container.append(el);
}

function mountChildren(vnode, container) {
  vnode.children.forEach(function (v) {
    patch(v, container);
  });
}

function processComponent(vnode, container) {
  mountComponent(vnode, container);
}

function mountComponent(initialVNode, container) {
  var instance = createComponentInstance(initialVNode);
  setupComponent(instance);
  setupRenderEffect(instance, initialVNode, container);
}

function setupRenderEffect(instance, initialVNode, container) {
  var proxy = instance.proxy;
  var subTree = instance.render.call(proxy); // vnode  -> patch 
  // vnode -> element -> 

  patch(subTree, container); // element -> mount 
  // 

  initialVNode.el = subTree.el;
}

function createVNode(type, props, children) {
  var vnode = {
    type: type,
    props: props,
    children: children,
    shapeFlag: getShapeFlag(type),
    el: null
  }; // debugger
  //children

  if (typeof children === 'string') {
    vnode.shapeFlag |= 4
    /* ShapeFlags.TEXT_CHILDREN */
    ;
  } else if (Array.isArray(children)) {
    vnode.shapeFlag |= 8
    /* ShapeFlags.ARRAY_CHILDREN */
    ;
  }

  return vnode;
}

function getShapeFlag(type) {
  return typeof type === 'string' ? 1
  /* ShapeFlags.ELEMENT */
  : 2
  /* ShapeFlags.STATEFUL_COMPONENT */
  ;
}

function createApp(rootComponent) {
  return {
    mount: function mount(rootContainer) {
      // 先vnode 
      //component - vnode 
      //所有的逻辑操作，都会基于 vnode 做处理
      var vnode = createVNode(rootComponent);
      render(vnode, rootContainer);
    }
  };
}

function h(type, props, children) {
  return createVNode(type, props, children);
}