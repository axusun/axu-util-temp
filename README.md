# util-template

使用模板公共库

模板提供给的命令行地址：

<!-- [winkcli-main](https://github.com/huahuahuahuahuahua/winkcli-main/tree/master/) -->

实现的需求:

- 支持编辑器的快速补全和提示
- 自动化构建
- 支持自动生成 changlog
- 代码通过 lint 和测试后才能提交、发布

## 涉及的库

- eslint + @typescript-eslint/parser 检测 ts
- typescript ts 库
- @rollup ts 打包工具
- jest 测试工具
- @microsoft/api-extractor .d.ts 打包
- gulp 打包
- husky+lint-staged 预编译
- typedoc 生成文档

## 目录结构

```shell

├───.husky
│   └───_
├───src   工具开发
├───README.md 文档
├───README.tmpl.md 公共文档（可生成README.md）
├───test  测试
└───...配置文件

```

## 示例代码

如需直接使用

```shell
npm run build --文件打包
npm run dev  --监听ts文件
npm run doc --生成文档
npm run lint--测试
npm run release--npm发布
```

## LICENSE

MIT
