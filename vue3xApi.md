### Vue3 api参考

---
      应用配置: // app实例挂载前，可以修改property, app.config
         1. errorHandler
             app.config.errorHandler = (err, vm, info) => {
                // 处理错误
                // `info` 是 Vue 特定的错误信息，比如错误所在的生命周期钩子
             }
         2.warnHandler 只开开发环境运行
             app.config.warnHandler = function(msg, vm, trace) {
                // `trace` 是组件的继承关系追踪
             }
        3. globalProperties vue全局属性
            // 之前(Vue 2.x)
            Vue.prototype.$http = () => {}
            // 之后(Vue 3.x), 组件的 property 在命名冲突具有优先权
            const app = createApp({})
            app.config.globalProperties.$http = () => {}
        4.optionMergeStrategies 用于mixin的命名冲突的合并优先级策略
           const app = createApp({
               mounted() {
               console.log(this.$options.hello)
               }
           })
            // parent/child父子实例
            app.config.optionMergeStrategies.hello = (parent, child) => {
                return `Hello, ${child}`
            }
            app.mixin({
                hello: 'Vue'
            })
        5. performance true/false,用于开启浏览器对组件的性能追踪
        6. compilerOptions 编译器配置
            6.1 compilerOptions.isCustomElement 自定义组件
            // 任何 'ion-' 开头的元素都会被识别为自定义元素,无需全局注册
            app.config.compilerOptions.isCustomElement = tag => tag.startsWith('ion-')

            6.2 compilerOptions.whitespace 空格压缩
                // condense 压缩空格
                // 6.2.1 元素内的多个开头/结尾空格会被压缩成一个空格
                // 6.2.2 元素之间的包括折行在内的多个空格会被移除
                // 6.2.3 文本结点之间可被压缩的空格都会被压缩成为一个空格
                // preserve 保留6.2.2与6.2.3  
                app.config.compilerOptions.whitespace = 'condense'

            6.3 compilerOptions.comments 移除生成环境模板内注释
                // false为保留,true为清除
                app.config.compilerOptions.comments = true

      应用api: createApp创建的app实例属性
         1. component
         // 注册或检索全局组件。注册还会使用给定的 name 参数自动设置组件的 name
         import { createApp } from 'vue'
         const app = createApp({})
         // 注册一个名为my-component的组件
         app.component('my-component', {
            /* ... */
         })
         // 检索注册的组件(始终返回构造函数)
         const MyComponent = app.component('my-component', {})

         2. config 应用配置全局对象
         import { createApp } from 'vue'
         const app = createApp({})
         app.config = {...}

         3. directive 注册或检索全局指令,传指令函数内容参数则返回app实例,不传就搜索并返回对应指令定义
         import { createApp } from 'vue'
         const app = createApp({})
         // 注册
         app.directive('my-directive', {
            // 指令是具有一组生命周期的钩子：
            // 在绑定元素的 attribute 或事件监听器被应用之前调用
            created() {},
            // 在绑定元素的父组件挂载之前调用
            beforeMount() {},
            // 绑定元素的父组件被挂载时调用
            mounted() {},
            // 在包含组件的 VNode 更新之前调用
            beforeUpdate() {},
            // 在包含组件的 VNode 及其子组件的 VNode 更新之后调用
            updated() {},
            // 在绑定元素的父组件卸载之前调用
            beforeUnmount() {},
            // 卸载绑定元素的父组件时调用
            unmounted() {}
         })
         // 注册 (功能指令)
         app.directive('my-directive', () => {
            // 这将被作为 `mounted` 和 `updated` 调用
         })
         // getter, 如果已注册，则返回指令定义
         const myDirective = app.directive('my-directive')

         4. mixin 全局混入
         app.mixin({...})

         5. mount app挂载,将挂载DOM的innerHTML替换为根组件的模板渲染结果
         // 返回根组件实例
         app.mount('#my-app')

         6. provide
            // 返回应用实例 app
            // 主要作用于给vue插件提供provide值,因为插件一般无法使用组件provide
            app.provide('key', 'value')

         7. unmount app卸载
            app.unmount()

         8. use 安装vue插件
            // 返回app实例
            // 当在同一个插件上多次调用此方法时，该插件将仅安装一次
            app.use(MyPlugin)
            
         9. version Vue版本号
            app.version

      全局api: 通过improt { 全局api } from Vue
        1.createApp 创建应用实例
            const app = createApp(
                { props: ['username'] }, // 组件的option
                { username: 'Evan' } // 作为prop传入组件
            )
        
        2. h 渲染函数
           // render函数中使用,返回vNode
           render() {
              return h('h1', {}, 'Some title')
           }
           
        3. defineComponent 用于ts/IDE工具支持
           // 使用options风格的对象
           const MyComponent = defineComponent({
              data() {
                 return { count: 1 }
              },
              methods: {
                 increment() {
                    this.count++
                 }
              }
           })
           // 使用setup 函数作为参数，函数名称将作为组件名称来使用
           const HelloWorld = defineComponent(function HelloWorld() {
              const count = ref(0)
              return { count }
           })
        4. defineAsyncComponent 创建异步组件
        4.1 简化异步加载
           const AsyncComp = defineAsyncComponent(() =>
              import('./components/AsyncComponent.vue')
           )
        4.2 高阶用法
            import { defineAsyncComponent } from 'vue'
            const AsyncComp = defineAsyncComponent({
                // 工厂函数
                loader: () => import('./Foo.vue'),
                // 加载异步组件时要使用的组件
                loadingComponent: LoadingComponent,
                // 加载失败时要使用的组件
                errorComponent: ErrorComponent,
                // 在显示 loadingComponent 之前的延迟 | 默认值：200（单位 ms）
                delay: 200,
                // 如果提供了 timeout ，并且加载组件的时间超过了设定值，将显示错误组件
                // 默认值：Infinity（即永不超时，单位 ms）
                timeout: 3000,
                // 定义组件是否可挂起 | 默认值：true
                suspensible: false,
                /**
                *
                * @param {*} error 错误信息对象
                * @param {*} retry 一个函数，用于指示当 promise 加载器 reject 时，加载器是否应该重试
                * @param {*} fail  一个函数，指示加载程序结束退出
                * @param {*} attempts 允许的最大重试次数
                  */
                  onError(error, retry, fail, attempts) {
                      if (error.message.match(/fetch/) && attempts <= 3) {
                        // 请求发生错误时重试，最多可尝试 3 次
                        retry()
                      } else {
                          // 注意，retry/fail 就像 promise 的 resolve/reject 一样：
                          // 必须调用其中一个才能继续错误处理。
                          fail()
                      }
                  }
              })
          
        5. resolveComponent 按name参数加载组件 // resolveComponent只能在render或setup函数中使用
           import { resolveComponent } from 'vue'
           render() {
              const MyComponent = resolveComponent('MyComponent')
           }
        6. resolveDynamicComponent 按component参数加载组件 // resolveDynamicComponent 只能在 render 或 setup 函数中使用。
           // 允许使用与 <component :is=""> 相同的机制来解析一个 component
           import { resolveDynamicComponent } from 'vue'
           render () {
            const MyComponent = resolveDynamicComponent('MyComponent')
           }
        7. resolveDirective 按name参数加载指令 // resolveDirective 只能在 render 或 setup 函数中使用。
           // 返回一个 Directive。如果没有找到，则返回 undefined
           import { resolveDirective } from 'vue'
           render () {
            const highlightDirective = resolveDirective('highlight')
           }
        8. withDirectives 为vNode创建指令指令 // withDirectives 只能在 render 或 setup 函数中使用。
            import { withDirectives, resolveDirective } from 'vue'
            const foo = resolveDirective('foo')
            const bar = resolveDirective('bar')
            return withDirectives(h('div'), [
                [指令名称, 值, 参数, 修饰符],
                [bind, cb,click,stop]
            ])
        9. createRenderer 创建渲染器应用于多平台
        10. nextTick 将回调推迟到下一个 DOM 更新周期之后执行
            // 返回值为promise
            await nextTick()
        11. mergeProps 覆盖对象,后面的覆盖前面的,对于事件监听器/class/style等进行合并
            import { h, mergeProps } from 'vue'
            export default {
                inheritAttrs: false,
                render() {
                    const props = mergeProps({
                    // 该 class 将与 $attrs 中的其他 class 合并。
                    class: 'active'
                    }, this.$attrs)
                    return h('div', props)
                }
            }
            
        12. useCssModule  允许在 setup 的单文件组件函数中访问 CSS 模块 // useCssModule 只能在 render 或 setup 函数中使用。
            <script>
                import { h, useCssModule } from 'vue'
                export default {
                  setup () {
                    const style = useCssModule()
                    return () => h('div', {
                      class: style.success
                    }, 'Task complete!')
                  }
                }
            </script>
                <style module>
                .success {
                  color: #090;
                }
            </style> 
            
        13. version  Vue版本号



      响应式api: 用于setup()函数内的api

      组合式api: 组件options中的setup()

      选项: 组件的options

      实例property: 针对组件实例this的属性

      实例方法: 针对组件实例this的方法

      指令:

      特殊指令:

      内置组件:


