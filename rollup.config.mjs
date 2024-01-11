
// 视频中的 rollup.config.js 改为 rollup.config.mjs

import pkg from "./package.json" assert {type: 'json'};
import typescript from "@rollup/plugin-typescript";

export default {
    input: "./src/index.ts",
    output: [
        //1.cjs -> commonjs
        //2.esm -> 

        {
            format: "cjs",
            // file: 'lib/guide-mini-vue.cjs.js'
            file: pkg.main
        },

        {
            format: "es",
            // file: 'lib/guide-mini-vue.esm.js'
            file: pkg.module
        },
    ],
    plugins: [
        typescript()
    ]
}