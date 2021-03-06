import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'


/*
* vite 意思快速
* 特点：
* 1. esbuild更快的打包速度，go语言编写。 通过 依赖预构建将所有代码转换为esm语法并打包成单个模块，再配合cache-control强缓存max-age，实现构建速度的提升。
* 2. 更好的HMR更新
* 3. 真正的按需加载构建，使用浏览器为模块化加载工具，以vite为模块提供者。  将依赖与源码在预构建时转化为esm语法，具有更好的按需加载性能。 并且将 源码 使用304协商缓存，从而进一步提升构建效率。
* 4. 被不同异步chunk共同引用的异步chunk，因为vite的预加载机制，只会被加载一次。
* 5. 预构建缓存位置：node_modules/.vite，强制 Vite 重新构建依赖，重新运行并添加--force命令
*
* webpack差异： 1. 全量的依赖代码加载 2.HMR性能会随着项目的增大而减缓速度
*
*
* 插件
* 1. 兼容rollup插件，vite的官方插件基本涵盖了对应的rollup插件
* 2. 插件排序enforce（pre/post），按需应用 apply（'build'/'serve'）
* 3. 官方插件
    @vitejs/plugin-vue
    提供 Vue 3 单文件组件支持
    #@vitejs/plugin-vue-jsx
    提供 Vue 3 JSX 支持（通过 专用的 Babel 转换插件）。
    #@vitejs/plugin-react-refresh
    提供 React Fast Refresh 支持
    #@vitejs/plugin-legacy
    为打包后的文件提供传统浏览器兼容性支持
*
* 多入口页面
* 1.build.rollupOptions.input
*  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        nested: resolve(__dirname, 'nested/index.html')
      }
    }
  }
*
*
* 浏览器兼容
* 1. build.target 最低支持 es2015
* 2. vite只处理语法编译，不包含任何 polyfill
* 3. 传统浏览器兼容使用@vitejs/plugin-legacy插件
*
* optimizeDeps
* 1. 对依赖的预构建的自定义读取与自定义排除，增加可选项include/exclude
*
*
* css特点
* 1. *.module.css 模块化加载
* 2. 预置postcss/各种css预处理器， 预处理器依然要要安装依赖
* 3. css代码分割，将对应代码分割到异步chunk中，加载chunk时加载对应css
*
*
* 静态资源
* 1. 可使用import加载转化url
*   import imgUrl from './img.png'
    document.getElementById('hero-img').src = imgUrl
    *
* 2. 使用特殊查询字符转换特定资源，如：
* // 显式加载资源为一个 URL
import assetAsURL from './asset.js?url'
* // 以字符串形式加载资源
import assetAsString from './shader.glsl?raw'
* // 导入脚本作为 Worker
import Worker from './shader.js?worker'
const worker = new Worker()
*
*
* 环境变量
* 1. import.meta.env为收纳环境变量的对象
    import.meta.env.MODE: {string} 应用运行的模式。
    import.meta.env.BASE_URL: {string} 部署应用时的基本 URL。他由base 配置项决定。
    import.meta.env.PROD: {boolean} 应用是否运行在生产环境。
    import.meta.env.DEV: {boolean} 应用是否运行在开发环境 (永远与 import.meta.env.PROD相反)。
* 2.环境变量可被静态替换，动态 key 取值 import.meta.env[key] 是无效的
* 3.环境目录.env文件，以 VITE_ 为前缀的环境变量会暴露给客户端
    .env                # 所有情况下都会加载
    .env.local          # 所有情况下都会加载，但会被 git 忽略
    .env.[mode]         # 只在指定模式下加载
    .env.[mode].local   # 只在指定模式下加载，但会被 git 忽略
* 4. 打包时，将加载对应mode的变量，如果想覆盖操作，则需在运行打包命令时增加对应的 --mode * 命令
*
*
*
* json
* 1. 支持按需加载
*
*
* Glob导入
* const modules = import.meta.glob('./dir/*.js')
* 编译为：
* // vite 生成的代码
const modules = {
  './dir/foo.js': () => import('./dir/foo.js'),
  './dir/bar.js': () => import('./dir/bar.js')
}
*
*
*
*
* */

/*
  // defineConfig支持ts与代码提示

  @params {
    command: 'build' | 'serve';
    mode: string;
  }
  情景模式
  export default defineConfig(({ command, mode }) => {
    if (command === 'serve') {
      return {
        // serve 独有配置
      }
    } else {
      return {
        // build 独有配置
      }
    }
  })
  异步模式
  export default defineConfig(async ({ command, mode }) => {
    const data = await asyncFunction()
    return {
      // 构建模式所需的特有配置
    }
  }
*/
export default defineConfig({
  // 类型: string
  // default: process.cwd()
  // 项目根目录，可以是一个绝对路径，或者是一个相对于该配置文件本身的路径
  root: process.cwd(),

  // 类型: string
  // default: /,
  // 开发或者生产环境服务的公共基础路径，合法的值包括
  /*
    1. 绝对url路径名，如`/foo/`
    2. 完整的url，如`https://foo.com/`
    3. 空字符串或`./`（用于开发环境）
  */
  base: '/',

  // 类型: string,
  // 默认: command为serve时默认为`development`，为build时默认为`production`
  // 在配置中指明将会把`serve`和`build`时的模式都覆盖掉
  // 可以通过命令行`--mode`来重写
  mode: 'development',

  // 类型: Record<string, any>
  // 定义全局变量替换方式，每项在开发时会被定义为全局变量，而在构建时则是静态替换
  /*
    1. 从 2.0.0-beta.70 版本开始，字符串值将作为一个直接的表达式，所以如果定义为了一个字符串常量，它需要被显式地引用（例如：通过 JSON.stringify）
    2. 替换知会在匹配到周围是单词边界(\b)时执行
  */
  define: { // todo
    a: 123
  },

  // 需要用的的插件，配置模式的时候在这儿配置
  // 类型：(Plugin | Plugin[])[]
  /*
    plugins: [
    {
      vue(),
      apply: 'build', // serve build
      enforce: 'pre' // pre前置 post后置
    }
  ]
  */
  plugins: [vue()],

  // 类型: string
  // 默认: public
  // 作为静态资源服务的文件夹。这个目录中的文件会再开发中被服务于 /，在构建时，会被拷贝到 outDir 根目录，并没有转换，永远只是复制到这里。该值可以是文件系统的绝对路径，也可以是相对于项目根的路径。
  publicDir: path.resolve(__dirname, 'public'),

  // 存储缓存文件的目录。此目录下会存储预打包的依赖项或 vite 生成的某些缓存文件，使用缓存可以提高性能。如需重新生成缓存文件，你可以使用 --force 命令行选项或手动删除目录。此选项的值可以是文件的绝对路径，也可以是以项目根目录为基准的相对路径。
  cacheDir: "node_modules/.vite",

  // 解析配置
  resolve: {
    // 类型: Record<string, string> | Array<{ find: string | RegExp, replacement: string }>
    // 别名
    // 将会被传递到 @rollup/plugin-alias 作为它的 entries。也可以是一个对象，或一个 { find, replacement } 的数组
    // 当使用文件系统路径的别名时，请始终使用绝对路径。相对路径作别名值将按原样使用导致不会解析到文件系统路径中。
    alias: {
      '@': path.resolve(__dirname, 'src')
    },

    // 类型: string[]
    // 如果你在你的应用程序中有相同依赖的副本（比如monorepos），使用这个选项来强制vite总是将列出的依赖关系解析到相同的副本（从项目根目录）
    // dedupe: [], // todo ？？

    // 类型: string[]
    // 在解析包的情景导出时允许的附加条件
    /*
      一个带有情景导出的包可能在它的package.json中有以下exports字段
      ```json
        {
          "exports": {
            ".": {
              "import": "./index.esm.js",
              "require": "./index.cjs.js"
            }
          }
        }
      ```
      在这里，`import`和`require`被称为‘情景’。情景可以嵌套，并且应该从最特定的到最不特定的指定。
    */
    // Vite 有一个“允许的情景”列表和并且会匹配列表中第一个情景。默认允许的情景是：import，module，browser，default，和基于当前情景为 production/development。resolve.conditions 配置项使得可以指定其他允许的情景。
    // conditions: [], // todo ？？？

    // 类型: string[],
    // 默认: ['module', 'jsnext:main', 'jsnext']
    // `package.json`中，在解析包的入口点时尝试的字段列表。注意，这比从`exports`字段解析的情景导出优先级低。
    // 如果一个入口点从`exports`成功解析，主字段将被忽略
    mainFields: ['module', 'jsnext:main', 'jsnext'],

    // 类型: string[]
    // 默认: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
    // 导入时想要省略的扩展名列表。
    // 注意：不建议忽略自定义导入类型的扩展名（例如：`.vue`），因为它会干扰IDE和类型支持
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },
  // css配置
  css: {
    /*
      @types

      ```ts
      interface CSSModulesOptions {
        scopeBehaviour?: 'global' | 'local'
        globalModulePaths?: string[]
        generateScopedName?:
          | string
          | ((name: string, filename: string, css: string) => string)
        hashPrefix?: string
        //* 默认：'camelCaseOnly'
        localsConvention?: 'camelCase' | 'camelCaseOnly' | 'dashes' | 'dashesOnly'
      }
      ```
    */
    // 配置`css modules`的行为，选项将被传递给`postcss-modules`

    // 以为 *.module.css为后缀名的 CSS 文件都被认为是一个 CSS modules 文件。可以实现js import的按需加载，其行为可在module中进行配置
    modules: {},

    // 类型: string | (postcss.ProcessOptions & { plugins?: postcss.Plugin[] })
    // 内联的PostCss配置（格式同postcss.config.js），或者一个（默认基于项目根目录的）自定义的PostCss配置路径。
    // 其路径搜索是通过`postcss-load-config`实现的
    //* 注意：如果提供来该内联配置，vite将不会搜索其他PostCss配置源
    postcss: '',

    // 类型: Record<string, object>
    /*
      指定传递给CSS预处理器的选项，例如：
      ```js
        export default {
          css: {
            preprocessorOptions: {
              scss: {
                additionalData: `$injectedColor: orange;`
              }
            }
          }
        }
      ```
    */
    preprocessorOptions: {}
  },
  // json配置
  json: {
    // 类型: boolean
    // 默认: true
    // 是否支持从`.json`文件中进行按名导入(按需加载)
    namedExports: true,

    // 类型: boolean
    // 默认: false
    // 若设置为 true，导入的 JSON 会被转换为 export default JSON.parse("...") 会比转译成对象字面量性能更好，尤其是当 JSON 文件较大的时候
    //* 开启此项，则会禁用按名导入
    stringify: false
  },
  // esbuild配置（vite使用了esbuild来进行编译）
  // 类型: ESBuildOptions | false
  /*
    ESBuildOptions继承自esbuild转换选项(https://esbuild.github.io/api/#transform-api)
    最常见的用例是自定义JSX

    ```js
    export default {
      esbuild: {
        jsxFactory: 'h',
        jsxFragment: 'Fragment'
      }
    }
    ```
    默认情况下，ESbuild 应用在 ts、jsx、tsx 文件。你可以通过 esbuild.include 和 esbuild.exclude 对其进行配置，它们两个配置的类型是string | RegExp | (string | RegExp)[]。
    设置成 false 可以禁用 ESbuild 转换（默认应用于 .ts. .tsx 和 .jsx 文件）。

  */

  /*
    此外，你还可以通过esbuild.jsxInject来自动为每一个被 ESbuild 转换的文件注入 JSX helper。

    ```js
    export default {
      esbuild: {
        jsxFactory: 'h',
        jsxFragment: 'Fragment'，
        jsxInject: `import React from 'react'`
      }
    }
    ```
  */
  // esbuild: {}, // todo esbuild api

  // 静态文件处理配置
  // 类型: string | RegExp | (string | RegExp)[]
  // 相关内容（https://cn.vitejs.dev/guide/assets.html）
  // 指定其他文件类型作为静态资源处理（这样导入它们就会返回解析后的 URL）
  assetsInclude: '',

  // 日志级别配置
  // 类型: 'info' | 'warn' | 'error' | 'silent'
  // 调整控制台输出的级别，默认为`info`
  logLevel: 'info',

  // 是否清屏
  // 类型: boolean
  // 默认: true
  // 设为 false 可以避免 Vite 清屏而错过在终端中打印某些关键信息。命令行模式下请通过 --clearScreen false 设置。
  clearScreen: true,

  // 用于加载 .env 文件的目录。可以是一个绝对路径，也可以是相对于项目根的路径。
  envDir: 'root',

  // 服务相关配置
  server: {
    // 类型: string
    // 指定服务器主机名
    host: 'localhost',

    // 类型: number
    // 指定服务器端口。
    //* 注意：如果端口已经被使用，Vite 会自动尝试下一个可用的端口，所以这可能不是服务器最终监听的实际端口。
    port: 10086,

    // 类型: boolean
    // 设为true时若端口已被占用则会直接退出，而不是尝试下一个可用端口
    strictPort: false,

    // 类型: boolean | https.ServerOptions
    // 启用 TLS + HTTP/2。注意当 server.proxy option 也被使用时，将会仅使用 TLS。
    // 这个值也可以是一个传递给 https.createServer() 的 选项对象。
    https: false,

    // 类型: boolean | string
    // 在服务器启动时自动在浏览器中打开应用程序
    /*
      注意: 当此值为字符串时，会被用作URL的路径名

      ```js
        export default {
          server: {
            open: '/docs/index.html'
          }
        }
      ```
    */
    open: true,

    // 本地服务代理
    // 类型: Record<string, string | ProxyOptions>
    // 为开发服务器配置自定义代理规则。期望接收一个 { key: options } 对象。如果 key 值以 ^ 开头，将会被解释为 RegExp。
    /*
      使用`http-proxy`，完整选项详见https://github.com/http-party/node-http-proxy#options

      @example

      ```js
        export default {
          server: {
            proxy: {
              // 字符串简写写法
              '/foo': 'http://localhost:4567/foo',
              // 选项写法
              '/api': {
                target: 'http://jsonplaceholder.typicode.com',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '')
              },
              // 正则表达式写法
              '^/fallback/.*': {
                target: 'http://jsonplaceholder.typicode.com',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/fallback/, '')
              }
            }
          }
        }

      ```
    */
    proxy: {},

    // 类型: boolean | CorsOptions
    // 为开发服务器配置 CORS。默认启用并允许任何源，传递一个 选项对象 来调整行为或设为 false 表示禁用。
    cors: true,

    // 类型: boolean
    // 相关内容: https://cn.vitejs.dev/guide/dep-pre-bundling.html
    // 设置为`true`强制使依赖预构建
    force: false,

    // 类型: boolean | { protocol?: string, host?: string, port?: number, path?: string, timeout?: number, overlay?: boolean }
    // 禁用或配置HMR链接（用于HMR websocket 必须使用不同的http服务器地址的情况）
    // 设置`server.hmr.overlay`为`false`可以禁用服务器错误遮罩层
    hmr: true,

    // 类型: object
    // 传递给`chokidar`的文件系统监视器选项
    // https://github.com/paulmillr/chokidar#api
    // watch: {},

    // 类型： 'ssr' | 'html'
    // 以中间件模式创建 Vite 服务器。（不含 HTTP 服务器）
    // 'ssr' 将禁用 Vite 自身的 HTML 服务逻辑，因此你应该手动为 index.html 提供服务。
    // 'html' 将启用 Vite 自身的 HTML 服务逻辑。
    // middlewareMode: 'html'
  },
  // 构建的配置
  build: {
    // 类型: string
    // 默认: modules
    // 相关内容：https://cn.vitejs.dev/guide/build.html#%E6%B5%8F%E8%A7%88%E5%99%A8%E5%85%BC%E5%AE%B9%E6%80%A7
    // 选项: https://esbuild.github.io/api/#target
    /*
      设置最终构建的浏览器兼容目标。默认值是一个 Vite 特有的值，'modules'，这是指 支持原生 ES 模块的浏览器。
      另一个特殊值是 “esnext” —— 即指执行 minify 转换（作最小化压缩）并假设有原生动态导入支持。
      转换过程将会由 esbuild 执行，并且此值应该是一个合法的 esbuild 目标选项。自定义目标也可以是一个 ES 版本（例如：es2015）、一个浏览器版本（例如：chrome58）或是多个目标组成的一个数组。
      注意，如果代码包含不能被 esbuild 安全地编译的特性，那么构建将会失败。查看 esbuild 文档 获取更多细节。
    */
    target: 'modules',

    // 类型: string
    // 默认: dist
    // 指定输出路径（相对于项目根目录）
    outDir: 'dist',

    // 类型: string
    // 默认: assets
    // 指定生成静态资源的存放路径（相对于build.outDir）
    assetsDir: 'assets',

    // 类型: number
    // 默认: 4096（4kb）
    // 小于此阈值的导入或引用资源将内联为 base64 编码，以避免额外的 http 请求。设置为 0 可以完全禁用此项。
    assetsInlineLimit: 4096,

    // 类型: boolean
    // 默认: true
    // 启用/禁用 CSS 代码拆分。当启用时，在异步 chunk 中导入的 CSS 将内联到异步 chunk 本身，并在块加载时插入。
    // 如果禁用，整个项目中的所有 CSS 将被提取到一个 CSS 文件中。
    cssCodeSplit: true,

    // 类型: boolean
    // 默认: false
    // 构建后是否生成sourceMap文件
    sourcemap: false,

    // 类型: RollupOptions
    // https://rollupjs.org/guide/en/#big-list-of-options
    // 自定义底层的 Rollup 打包配置。这与从 Rollup 配置文件导出的选项相同，并将与 Vite 的内部 Rollup 选项合并。查看 Rollup 选项文档 获取更多细节。
    // https://rollupjs.org/guide/en/#big-list-of-options
    rollupOptions: {},

    // 类型: RollupCommonJSOptions
    // https://github.com/rollup/plugins/tree/master/packages/commonjs#options
    // 传递给 @rollup/plugin-commonjs 插件的选项。
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    commonjsOptions: {},

    // 类型: { entry: string, name?: string, formats?: ('es' | 'cjs' | 'umd' | 'iife')[] }
    // 相关内容: https://cn.vitejs.dev/guide/build.html#%E5%BA%93%E6%A8%A1%E5%BC%8F
    //* 构建为库。entry 是必须的因为库不可以使用 HTML 作为入口。name 则是暴露的全局变量，并且在 formats 包含 'umd' 或 'iife' 时是必须的。默认 formats 是 ['es', 'umd']。
    lib: {
      entry: ''
    },

    // 类型: boolean
    // 默认: false
    // 相关内容: https://cn.vitejs.dev/guide/backend-integration.html
    // 当设置为 true，构建后将会生成 manifest.json 文件，映射没有被 hash 的资源文件名和它们的 hash 版本。可以为一些服务器框架渲染时提供正确的资源引入链接。
    manifest: false,

    // 类型: boolean | 'terser' | 'esbuild'
    // 默认: 'terser'
    // 设置为 false 可以禁用最小化混淆，或是用来指定使用哪种混淆器。默认为 Terser，虽然 Terser 相对较慢，但大多数情况下构建后的文件体积更小。ESbuild 最小化混淆更快但构建后的文件相对更大。
    // https://github.com/terser/terser
    minify: 'terser',

    // 类型: TerserOptions
    // 传递给Terser的更多minify选项
    // https://terser.org/docs/api-reference#minify-options
    terserOptions: {},

    // 类型: boolean
    // 默认: true
    // 设置为 false 来禁用将构建后的文件写入磁盘。这常用于 编程式地调用 build() 在写入磁盘之前，需要对构建后的文件进行进一步处理。
    // https://cn.vitejs.dev/guide/api-javascript.html#build
    write: true,

    // 类型: boolean
    // 默认: 若outDir在root目录下，则为true
    // 默认情况下，若 outDir 在 root 目录下，则 Vite 会在构建时清空该目录。若 outDir 在根目录之外则会抛出一个警告避免意外删除掉重要的文件。可以设置该选项来关闭这个警告。该功能也可以通过命令行参数 --emptyOutDir 来使用。
    emptyOutDir: true,

    // 类型: boolean
    // 默认: true
    // 启用/禁用 brotli 压缩大小报告。压缩大型输出文件可能会很慢，因此禁用该功能可能会提高大型项目的构建性能。
    brotliSize: true,

    // 类型: number
    // 默认: 500
    // chunk大小警告的限制，以kbs为单位
    chunkSizeWarningLimit: 500,

    // 类型： WatcherOptions| null
    // 默认： null
    // 设置为 {} 则会启用 rollup 的监听器。在涉及只用在构建时的插件时和集成开发流程中很常用。
    watch: null
  },
  // 依赖优化
  optimizeDeps: {
    // 入口
    // 类型: string | string[]
    // 默认情况下，Vite 会抓取你的 index.html 来检测需要预构建的依赖项。如果指定了 `build.rollupOptions.input`，Vite 将转而去抓取这些入口点。
    // 如果这两者都不适合你的需要，则可以使用此选项指定自定义条目 - 该值需要遵循 fast-glob 模式 ，或者是相对于 vite 项目根的模式数组。这将覆盖掉默认条目推断。
    // https://github.com/mrmlnc/fast-glob#basic-syntax
    entries: '', // 预构建的入口文件

    // 类型: string[]
    // 在预构建中强制排除的依赖项
    exclude: [],

    // 类型: string[]
    // 默认情况下，不在 node_modules 中的，链接的包不会被预构建。使用此选项可强制预构建链接的包。
    include: [],

    // 打包器有时需要重命名符号以避免冲突。 设置此项为 true 可以在函数和类上保留 name 属性
    keepNames: false
  }
})
