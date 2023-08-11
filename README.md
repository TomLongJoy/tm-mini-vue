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