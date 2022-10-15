import path from "path"
// 定位模块
import resolve from '@rollup/plugin-node-resolve'
//node_modules 文件夹中的大多数包可能是遗留的 commonjs 而不是 javascript 模块
import commonjs from 'rollup-plugin-commonjs'
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import babel from "@rollup/plugin-babel";
import { DEFAULT_EXTENSIONS } from "@babel/core";
// 替换文件中的目标字符串
import replace from "@rollup/plugin-replace";
import { uglify } from "rollup-plugin-uglify";
import clear from "rollup-plugin-clear";
import nodePolyfills from "rollup-plugin-polyfill-node";
import pkg from "./package.json";
const production = process.env.NODE_ENV === "production";
const development = process.env.NODE_ENV === "development";
const ext = production ? "min.js" : "js";

/** 输入的文件夹 */
let input_path = "src"
/** 输出的文件夹 */
let output_path = "dist"
/** 需要编译的文件名 不带后缀 */
let input_file_name_no_ext_list = pkg._need_handle_files

/** 插件配置 */
let plugins_1=[
    //清除dist打包文件
    clear({
        targets: ["dist"],
    }),
    // ts 的功能只在于编译出声明文件，所以 target 为 ESNext，编译交给 babel 来做
    typescript({
        tsconfig:'./tsconfig.json'
    }),
    // node polyfill
    nodePolyfills(),
    // 将自定义选项传递给解析插件
    resolve({
        customResolveOptions:{
            moduleDirectory: "node_modules",
        }
    }),
    commonjs(), // 配合 commnjs 解析第三方模块
    babel({
        // 只转换源代码
        exclude: "node_modules/**",
        // bable默认不支持ts
        extensions: [...DEFAULT_EXTENSIONS, ".ts"],
    }),
    //可将json 文件转换为es6模块
    json()
]
// 压缩
let plugins_2= plugins_1.concat([uglify()])
// 不需要打包的依赖
let lib_dep = ["axios"];

let task_list = [].concat(
    input_file_name_no_ext_list.map((name)=>{
        let replace_obj = {};
        input_file_name_no_ext_list.forEach((n) => {
            replace_obj[`${n}.ts`] = n;
        });
        return {
            //amd为AMD标准，cjs为CommonJS标准，esm\es为ES模块标准，iife为立即调用函数， umd同时支持amd、cjs和iife
            input: `${input_path}/${name}.ts`,
            output:[
                {
                    file: `${output_path}/amd/${name}.js`,
                    format: 'amd',
                  },
                  {
                    file:  `${output_path}/cjs/${name}.js`,
                    format: 'cjs'
                  },
                //   {
                //     file:  `${output_path}/esm/${name}.esm.js`,
                //     format: 'esm'
                //   },
                //   {
                //     file: `${output_path}/umd/${name}.js`,
                //     format: 'umd',
                //   },
            ],
            // 排除不需要的依赖
            external: lib_dep.concat(
                input_file_name_no_ext_list.filter(n=>n!==name).map(n=>path.resolve(`./src/${n}.ts`))
            ),
            plugins: plugins_2.concat(
                replace({
                    values: replace_obj,
                    preventAssign: true,
                })
            )
        }
    })
)


export default task_list