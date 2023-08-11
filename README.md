# tm-mini-vue
 练习minivue

# 1创建步骤 vue3 pinia ts  node v16.20.0  

```js 

    1. yarn init -y 

    2. yarn add typescript --dev

    3. npx tsc --init

    4. yarn add jest @types/jest --dev

    5. index.spec.ts 文件，types字段添加jest，  "types": ["jest"],  

    6. package.json 文件，添加scripts字段 {"test":"jest"}

    7. yarn test 测试运行      

    8. yarn add --dev babel-jest @babel/core @babel/preset-env

    9. yarn add --dev @babel/preset-typescript 

    10. 
    babel.config.js文件内容
    module.exports = {
        presets: [
            ['@babel/preset-env', { targets: { node: 'current' } }],
            '@babel/preset-typescript',
        ],
    };

    11. yarn test 

    12. 查看目录结构
    tree -aI ".git*|.vscode|node_modules" -C -L 4
    .
    ├── LICENSE
    ├── README.md
    ├── babel.config.js
    ├── package.json
    ├── src
    │   └── reactivity
    │       ├── index.ts
    │       └── tests
    │           └── index.spec.ts
    ├── tsconfig.json
    └── yarn.lock

    3 directories, 8 files
```

# ps: 模块关系图
```js 

                     +---------------------+    +----------------------+
                      |                     |    |                      |
        +------------>|  @vue/compiler-dom  +--->|  @vue/compiler-core  |
        |             |                     |    |                      |
   +----+----+        +---------------------+    +----------------------+
   |         |
   |   vue   |
   |         |
   +----+----+        +---------------------+    +----------------------+    +-------------------+
        |             |                     |    |                      |    |                   |
        +------------>|  @vue/runtime-dom   +--->|  @vue/runtime-core   +--->|  @vue/reactivity  |
                      |                     |    |                      |    |                   |
                      +---------------------+    +----------------------+    +-------------------+
```