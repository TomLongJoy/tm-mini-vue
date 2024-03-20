### 1.折叠代码
```js 
    
    1.折叠所有 Ctrl+K+0 
    2.展开所有 Ctrl+K+J
    3.折叠当前方法 Ctrl+Shift+[ 
    4.展开当前方法 Ctrl+Shift+]
    5.递归展开折叠 Ctrl+k Ctrl+] 
```

### watch
```js 
    yarn build --watch
```


```js


     const vnode = {
        type,
        props,
        children,
        component: null,
        key: props && props.key,
        shapeFlag: getShapeFlag(type),
        el: null,
    };
```