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
        1.reactive 深层转换
            1.1深层转换,将对象内部的嵌套对象也能转换为响应式对象
            1.2 解包ref,同时维持ref的响应性
            const count = ref(1)
            const obj = reactive({ count })
            // ref 会被解包
            console.log(obj.count === count.value) // true
            // 它会更新 `obj.count`
            count.value++
            console.log(count.value) // 2
            console.log(obj.count) // 2
        2.readonly 响应式对象深度只读代理,会自动解包ref
        3.isProxy 检查对象是否是由 reactive 或 readonly 创建的 proxy
        4.isReactive 检查对象是否是由 reactive 创建的响应式代理. 特殊:由 reactive 创建的代理被包裹了readonly,将readonly传入它也会返回 true
        5.isReadonly 检查对象是否是由 readonly 创建的只读代理。
        6.toRaw 返回 reactive 或 readonly 代理的原始对象. 作用: 这是一个“逃生舱”，可用于临时读取数据而无需承担代理访问/跟踪的开销，也可用于写入数据而避免触发更改。
        7.markRaw 标记一个对象，使其永远不会转换为 proxy。返回对象本身。为浅标记,对于该对象的嵌套对象不做处理.
            // 作用: 
            // 有些值不应该是响应式的，例如复杂的第三方类实例或 Vue 组件对象。
            // 当渲染具有不可变数据源的大列表时，跳过 proxy 转换可以提高性能
            const foo = markRaw({})
            console.log(isReactive(reactive(foo))) // false
            
            // 嵌套在其他响应式对象中时也可以使用
            const bar = reactive({ foo })
            console.log(isReactive(bar.foo)) // false
        8.shallowReactive 响应式对象浅转换,对于嵌套对象不做响应式转换,并且不会自动解包ref
        9.shallowReadonly 响应式对象浅只读转换,不会自动解包ref
        10.ref 转换基础类型的值为响应式,通过.value读改的方式保持与对象响应式的统一行为.对于支持ts的类型是传入范型
        11.unref 参数是一个 ref，则返回内部值，否则返回参数本身
            // val = isRef(val) ? val.value : val 的语法糖函数
        12.toRef 转换响应式对象某个属性为ref,同时保留双方的响应式联系. 当转换的属性不存在时,会自动创建双方都对应响应式属性.
            // 作用:对于获取单个props属性时有用
            export default {
                setup(props) {
                    useSomeFeature(toRef(props, 'foo'))
                }
            }
    13.toRefs 转换响应式对象为单个的ref对象,同时保留所有响应式联系. 只转换存在的属性
        // 作用:将对象打散在setup函数中返回并保持响应式
    14.isRef 检查值是否为一个 ref 对象
    15.customRef 自定义ref构造器,返回一个ref
        // v-model与自定义ref形成debounce
        <input v-model="text" />

        function useDebouncedRef(value, delay = 200) {
            let timeout
            // 需传入带有track/trigger参数,并返回带有get/set对象的函数
            return customRef((track, trigger) => {
                return {
                    get() {
                        track()
                        return value
                    },
                    set(newValue) {
                        clearTimeout(timeout)
                        timeout = setTimeout(() => {
                            value = newValue
                            trigger()
                        }, delay)
                    }
                }
            })
        }
        
        export default {
            setup() {
                return {
                    text: useDebouncedRef('hello')
                }
            }
        }
    16.shallowRef ref浅转换,只能监听 .value的改变,对于.value以下的对象属性值不会做任何监听.与triggerRef共用
    17.triggerRef 针对shallowRef使用的触发副作用的函数
        const shallow = shallowRef({
            greet: 'Hello, world'
        })
        // 第一次运行时记录一次 "Hello, world"
        watchEffect(() => {
            console.log(shallow.value.greet)
        })
        // 这不会触发副作用，因为 ref 是浅层的
        shallow.value.greet = 'Hello, universe'
        // 记录 "Hello, universe"
        triggerRef(shallow)
    18.computed 响应变化,返回只读与可修改的ref对象
        // 接受一个 getter 函数，并为从 getter 返回的值返回一个不变的响应式 ref 对象
        const count = ref(1)
        const plusOne = computed(() => count.value + 1)
        console.log(plusOne.value) // 2
        plusOne.value++ // 错误
        // 也可以使用具有 get 和 set 函数的对象来创建可写的 ref 对象
        const count = ref(1)
        const plusOne = computed({
            get: () => count.value + 1,
            set: val => {
                count.value = val - 1
            }
        })
        plusOne.value = 1
        console.log(count.value) // 0

        // ts类型声明
        // 只读的
        function computed<T>(getter: () => T): Readonly<Ref<Readonly<T>>>
        // 可写的
        function computed<T>(options: { get: () => T; set: (value: T) => void }): Ref<T>
    19.watchEffect 在响应式地跟踪其依赖项时立即运行一个函数，并在更改依赖项时重新运行它
        const count = ref(0)
        watchEffect(() => console.log(count.value))

        // ts类型声明
        function watchEffect(
        effect: (onInvalidate: InvalidateCbRegistrator) => void,
            options?: WatchEffectOptions
        ): StopHandle
        interface WatchEffectOptions {
            flush?: 'pre' | 'post' | 'sync' // 默认：'pre'
            onTrack?: (event: DebuggerEvent) => void
            onTrigger?: (event: DebuggerEvent) => void
        }
        interface DebuggerEvent {
            effect: ReactiveEffect
            target: any
            type: OperationTypes
            key: string | symbol | undefined
        }
        type InvalidateCbRegistrator = (invalidate: () => void) => void
        type StopHandle = () => void
    20.watch 在响应式变量发生改变时触发.能获取先前值与当前值. // 与watchEffect相同的行为, 手动停止/副作用无效/flush timing/debugging方面行为一致
        // 20.1 侦听单一源
        // 侦听一个 getter
        const state = reactive({ count: 0 })
        watch(
            () => state.count,
            (count, prevCount) => {
                /* ... */
            }
        )
        // 直接侦听一个 ref
        const count = ref(0)
        watch(count, (count, prevCount) => {
            /* ... */
        })
        // 20.2 侦听多个源
        watch([fooRef, barRef], ([foo, bar], [prevFoo, prevBar]) => {
            /* ... */
        })
        // ts类型声明
        // 侦听单一源
        function watch<T>(
        source: WatcherSource<T>,
        callback: (
            value: T,
            oldValue: T,
            onInvalidate: InvalidateCbRegistrator
        ) => void,
            options?: WatchOptions
        ): StopHandle
        // 侦听多个源
        function watch<T extends WatcherSource<unknown>[]>(
        sources: T
        callback: (
            values: MapSources<T>,
            oldValues: MapSources<T>,
            onInvalidate: InvalidateCbRegistrator
        ) => void,
            options? : WatchOptions
        ): StopHandle
        type WatcherSource<T> = Ref<T> | (() => T)
        type MapSources<T> = {
            [K in keyof T]: T[K] extends WatcherSource<infer V> ? V : never
        }
        // 参见 `watchEffect` 类型声明共享选项
        interface WatchOptions extends WatchEffectOptions {
            immediate?: boolean // 默认：false
            deep?: boolean
        }
   
      组合式api: 组件options中的setup()
        const isAbsent = Symbol()
        // defineComponent为支持ts
        export default defineComponent({
            props: {
                foo: { default: isAbsent }
            },
            // context为组件实例,有attrs/slot/emit属性
            // props不能解构,使用toRefs. context可以解构
            setup(props, context) {
                if (props.foo === isAbsent) {
                    // foo 没有被传入。
                }
                // 生命周期,不包含beforeCreate与created,因为setup在这两个周期前创建
                onMounted(() => {
                  console.log('mounted!')
                })
                onUpdated(() => {
                  console.log('updated!')
                })
                onUnmounted(() => {
                  console.log('unmounted!')
                })
                // provide/inject示例
                // import { InjectionKey, provide, inject } from 'vue'
                const key: InjectionKey<string> = Symbol()
                provide(key, 'foo')
                const foo = inject<string>('foo')

                // getCurrentInstance访问内部各种组件实例,用于库作者  import { getCurrentInstance } from 'vue'
                const internalInstance = getCurrentInstance()
                internalInstance.appContext.config.globalProperties // 访问 globalProperties

                return {} // 或者 return h('div') 渲染函数
            }
        })

      选项: 组件的options // 不能使用箭头函数
        export default defineComponent({
            // 1.Data
            // vm.$data 访问原始数据对象. 
            // 以 _ 或 $ 开头的 property 不会被组件实例代理，因为它们可能和 Vue 内置的 property、API 方法冲突
            data() {
                return {}
            },
            // 类型: Array<string> | Object
            props: {
                // 类型检查
                height: Number,
                // 类型检查 + 其他验证
                age: {
                    type: Number,
                    default: 0,
                    required: true,
                    validator: value => {
                        return value >= 0
                    }
                }
            },
            // 类型: { [key: string]: Function | { get: Function, set: Function } }
            computed: {
                // 仅读取
                aDouble() {
                    return this.a * 2
                },
                // 读取和设置
                aPlus: {
                    get() {
                        return this.a + 1
                    },
                    set(v) {
                        this.a = v - 1
                    }
                }
            },
            // 类型:{ [key: string]: string | Function | Object | Array}
            // 可以侦听data和computed变量,可以通过$watch调用,可以deep、immediate 和 flush
            watch: {
                // 侦听顶级 property
                a(val, oldVal) {
                    console.log(`new: ${val}, old: ${oldVal}`)
                },
                // 字符串方法名
                b: 'someMethod',
                // 该回调会在任何被侦听的对象的 property 改变时被调用，不论其被嵌套多深
                c: {
                    handler(val, oldVal) {
                        console.log('c changed')
                    },
                    deep: true
                },
                // 侦听单个嵌套 property
                'c.d': function (val, oldVal) {
                    // do something
                },
                // 该回调将会在侦听开始之后被立即调用
                e: {
                handler(val, oldVal) {
                    console.log('e changed')
                },
                immediate: true
                },
                // 你可以传入回调数组，它们会被逐一调用
                f:[
                    'handle1',
                    function handle2(val, oldVal) {
                        console.log('handle2 triggered')
                    },
                    {
                        handler: function handle3(val, oldVal) {
                        console.log('handle3 triggered')
                    }
                        /* ... */
                    }
                ]
            },
            // 类型: { [key: string]: Function } 
            methods: {},
            // 类型: Array<string> | Object
            // 作用于声明组件事件代替.native修饰符,与事件的显示声明与参数校验
            // emits 选项中列出的事件不会从组件的根元素继承，也将从 $attrs property 中移除
            emits: {
                // 没有验证函数
                click: null,
                // 带有验证函数
                submit: payload => {
                  if (payload.email && payload.password) {
                    return true
                  } else {
                    console.warn(`Invalid submit event payload!`)
                    return false
                  }
                }
            },
        // 2.DOM
            // 模板将会替换所挂载元素的 innerHTML
            // 类型: string
            template: '',
            // render 函数的优先级高于根据 template 选项或挂载元素的 DOM 内 HTML 模板编译的渲染函数
            // 类型: Function
            render() {
                return h('div')
            },
        // 3. 生命周期 类型:Function
            // beforeCreate 在实例初始化之后，数据观测 (data observer) 和 event/watcher 事件配置之前被调用。
            // created 在实例创建完成后被立即调用.完成：数据观测 (data observer)，property 和方法的运算，watch/event 事件回调. 未开始:挂载阶段还没开始，$el property 目前尚不可用
            // beforeMount 在挂载开始之前被调用：相关的 render 函数首次被调用
            // mounted 实例被挂载后调用，这时 app.mount 被新创建的 vm.$el 替换了. 但mounted 不会保证所有的子组件也都一起被挂载,使用 vm.$nextTick. 该钩子在服务器端渲染期间不被调用。
            // beforeUpdate 数据更新时调用，发生在虚拟 DOM 打补丁之前。 这里适合在更新之前访问现有的 DOM，比如手动移除已添加的事件监听器。 该钩子在服务器端渲染期间不被调用，因为只有初次渲染会在服务端进行。
            // updated 由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子. updated 不会保证所有的子组件也都一起被重绘,使用 vm.$nextTick. 该钩子在服务器端渲染期间不被调用。
            // activated 被 keep-alive 缓存的组件激活时调用。该钩子在服务器端渲染期间不被调用。
            // deactivated 被 keep-alive 缓存的组件停用时调用。该钩子在服务器端渲染期间不被调用。
            // beforeUnmount 在卸载组件实例之前调用。该钩子在服务器端渲染期间不被调用。
            // unmounted 卸载组件实例后调用。该钩子在服务器端渲染期间不被调用。
            // errorCaptured 当捕获一个来自子孙组件的错误时被调用
                // 三个参数：错误对象、发生错误的组件实例以及一个包含错误来源信息的字符串
                // 返回 false 以阻止该错误继续向上传播
                类型: (err: Error, instance: Component, info: string) => ?boolean
                错误传播规则:
                    默认情况下，如果全局的 config.errorHandler 被定义，所有的错误仍会发送它，因此这些错误仍然会向单一的分析服务的地方进行汇报。
                    如果一个组件的继承或父级从属链路中存在多个 errorCaptured 钩子，则它们将会被相同的错误逐个唤起。
                    如果此 errorCaptured 钩子自身抛出了一个错误，则这个新错误和原本被捕获的错误都会发送给全局的 config.errorHandler。
                    一个 errorCaptured 钩子能够返回 false 以阻止错误继续向上传播。本质上是说“这个错误已经被搞定了且应该被忽略”。它会阻止其它任何会被这个错误唤起的 errorCaptured 钩子和全局的 config.errorHandler。
            // renderTracked 跟踪虚拟 DOM 重新渲染时调用
                // DebuggerEvent 某个操作跟踪了组件目标对象和键以及类型
                类型: (e: DebuggerEvent) => void
            // renderTriggered 当虚拟 DOM 重新渲染被触发时调用
                // DebuggerEvent 某个操作跟踪了组件目标对象和键以及类型
                类型：(e: DebuggerEvent) => void
        
        // 4.选项/资源
            directives: {
                focus: { // v-focus
                    mounted(el) {
                        el.focus()
                    }
                }
            },
            components: {},
        // 5.组合
            // 类型: Array<Object>
            // 混入vue 选项,默认生命周期优先执行,合并规则可定制
            mixins: [{vueOptions}],
            // 类型：Object | Function
            // 允许声明扩展另一个组件
            extends: {vueOptions},
            // provide 和 inject 绑定并不是响应式的。这是刻意为之的。然而，如果你传入了一个响应式的对象，那么其对象的 property 仍是响应式的。
            // 类型：Object | () => Object
            provide: {},
            // 类型：Array<string> | { [key: string]: string | Symbol | Object }
            // 用法示例:
                // 普通:
                    // 父级组件 provide  'foo'
                    const Provider = {
                        provide: {
                            foo: 'bar'
                        }
                        // ...
                    }
                    // 子组件 inject  'foo'
                    const Child = {
                    inject: ['foo'],
                    created() {
                        console.log(this.foo) // => "bar"
                        }
                        // ...
                    }
                // Symbol:
                    const s = Symbol()
                    const Provider = {
                        provide() {
                            return {
                                [s]: 'foo'
                            }
                        }
                    }
                    // inject 的值作为一个 property 的默认值：
                    const Child = {
                        inject: ['foo'],
                        props: {
                            bar: {
                                default() {
                                    return this.foo
                                }
                            }
                        }
                    }
                // 使用一个 inject 的值作为数据入口：
                    const Child = {
                        inject: ['foo'],
                        data() {
                            return {
                                bar: this.foo
                            }
                        }
                    }
                // Inject 可以通过设置默认值使其变成可选项：
                    const Child = {
                        inject: {
                            foo: { default: 'foo' }
                        }
                    }
                // 如果它需要从一个不同名字的 property 注入，则使用 from 来表示其源 property：
                    const Child = {
                        inject: {
                            foo: {
                                from: 'bar',
                                default: 'foo'
                            }
                        }
                    }
                // 与 prop 的默认值类似，你需要对非原始值使用一个工厂方法：
                    const Child = {
                        inject: {
                            foo: {
                                from: 'bar',
                                default: () => [1, 2, 3]
                            }
                        }
                    }
                    const Child = {
                        inject: { s }
                        // ...
                    }
            inject: [],
            // 调用时间: 在创建组件实例时，在初始 prop 解析之后立即调用 setup。在生命周期方面，它是在 beforeCreate 钩子之前调用的。
            setup() {},
        // 6.杂项
            // 类型：string
            name: '',
            // 类型：boolean
            // 默认情况下父作用域的不被认作 props 的 attribute 绑定 (attribute bindings) 将会“回退”且作为普通的 HTML attribute 应用在子组件的根元素上
            // inheritAttrs:false，这些默认行为将会被去掉。而通过实例 property $attrs 可以让这些 attribute 生效，且可以通过 v-bind 显性的绑定到非根元素上。
            inheritAttrs: true,
            // 类型：Object
            // 这是与应用级别的 compilerOptions 配置相对应的组件级别配置。
            compilerOptions: {}
        })

      实例property: 针对组件实例this的属性
        1. $data 组件实例正在侦听的数据对象。
        2. $props 当前组件接收到的 props 对象。 
        3. $el 组件实例正在使用的根 DOM 元素。 对于使用了片段的组件，$el 是占位 DOM 节点，Vue 使用它来跟踪组件在 DOM 中的位置
        4. $options  用于当前组件实例的初始化选项。
        5. $parent 父实例，如果当前实例有的话
        6. $root 当前组件树的根组件实例。如果当前实例没有父实例，此实例将会是其自己。
        7. $slots 用来以编程方式访问通过插槽分发的内容
        8. $refs 一个对象，持有注册过 ref attribute 的所有 DOM 元素和组件实例。
        9. $attrs 包含了父作用域中不作为组件 props 或自定义事件的 attribute 绑定和事件。
        // 当一个组件没有声明任何 prop 时，这里会包含所有父作用域的绑定，并且可以通过 v-bind="$attrs" 传入内部组件——这在创建高阶的组件时会非常有用。

      实例方法: 针对组件实例this的方法
        1. $watch 侦听组件实例上的响应式 property 或函数计算结果的变化。deep深度监听/ immediate立即触发/ flush触发提前/同步/延迟
        2. $emit 触发当前实例上的事件
        3. $nextTick 将回调延迟到下次 DOM 更新循环之后执行。
        4. $forceUpdate 迫使组件实例重新渲染。注意它仅仅影响实例本身和插入插槽内容的子组件，而不是所有子组件

      指令:
        1. v-text
            <span v-text="msg"></span>
            <!-- 等价于 -->
            <span>{{msg}}</span>
        2. v-html 内容按普通 HTML 插入
        3. v-show 根据表达式的真假值，切换元素的 display CSS property。 当条件变化时该指令触发过渡效果。
        4. v-if 根据表达式的真假值来有条件地渲染元素。当条件变化时该指令触发过渡效果。当和 v-for 一起使用时，v-if 的优先级比 v-for 更高。
        5. v-else-if 
        6. v-else
        7. v-for
            <div v-for="item in items" :key="item.id">
                {{ item.text }}
            </div>
        8. v-on
           缩写：@
           修饰符：
                .stop - 调用 event.stopPropagation()。
                .prevent - 调用 event.preventDefault()。
                .capture - 添加事件侦听器时使用 capture 模式。
                .self - 只当事件是从侦听器绑定的元素本身触发时才触发回调。
                .{keyAlias} - 仅当事件是从特定键触发时才触发回调。
                .once - 只触发一次回调。
                .left - 只当点击鼠标左键时触发。
                .right - 只当点击鼠标右键时触发。
                .middle - 只当点击鼠标中键时触发。
                .passive - { passive: true } 模式添加侦听器,用于移动端滚动优化
        9. v-bind
           缩写：:
           修饰符：
                .camel - 将 kebab-case attribute 名转换为 camelCase。
        10. v-model
            限制于：
                <input>
                <select>
                <textarea>
                components
            修饰符：
                .lazy - 监听 change 而不是 input 事件
                .number - 输入字符串转为有效的数字
                .trim - 输入首尾空格过滤
        11. v-slot
            缩写：#
            限用于：
                <template>
                组件 (对于一个单独的带 prop 的默认插槽)
            具名作用域插槽:
                <!-- 接收 prop 的具名插槽 -->
                <infinite-scroll>
                  <template v-slot:item="slotProps">
                    <div class="item">
                      {{ slotProps.item.text }}
                    </div>
                  </template>
                </infinite-scroll>
        12. v-pre 跳过这个元素和它的子元素的编译过程。
        13. v-cloak 这个指令保持在元素上直到关联组件实例结束编译。用于loading的显示,元素的隐藏
            // 和 CSS 规则如 [v-cloak] { display: none } 一起用时，这个指令可以隐藏未编译的 Mustache 标签直到组件实例准备完毕。
            // html
            <div v-cloak>
                {{ message }}
            </div>
            // css
            [v-cloak] {
                display: none;
            }
        14. v-once 只渲染元素和组件一次。
      特殊指令:
        1. key key 特殊 attribute 主要用做 Vue 的虚拟 DOM 算法的提示，以在比对新旧节点组时辨识 VNodes.
        2. ref ref 被用来给元素或子组件注册引用信息。
        3. is 使用动态组件
           <table>
            <tr is="vue:my-row-component"></tr>
           </table>
      内置组件:
        1. component 动态组件
            <!--  动态组件由 vm 实例的 `componentId` property 控制 -->
            <component :is="componentId"></component>
        2. transition
           Props：
                name - string 用于自动生成 CSS 过渡类名。例如：name: 'fade' 将自动拓展为 .fade-enter，.fade-enter-active 等。
                appear - boolean，是否在初始渲染时使用过渡。默认为 false。
                persisted - boolean。如果是 true，表示这是一个不真实插入/删除元素的转换，而是切换显示/隐藏状态。过渡钩子被注入，但渲染器将跳过。相反，自定义指令可以通过调用注入的钩子 (例如 v-show) 来控制转换。
                css - boolean。是否使用 CSS 过渡类。默认为 true。如果设置为 false，将只通过组件事件触发注册的 JavaScript 钩子。
                type - string。指定过渡事件类型，侦听过渡何时结束。有效值为 "transition" 和 "animation"。默认 Vue.js 将自动检测出持续时间长的为过渡事件类型。
                mode - string 控制离开/进入过渡的时间序列。有效的模式有 "out-in" 和 "in-out"；默认同时进行。
                duration - number | { enter: number, leave: number }。指定过渡的持续时间。默认情况下，Vue 会等待过渡所在根元素的第一个 transitionend 或 animationend 事件。
                enter-from-class - string
                leave-from-class - string
                appear-class - string
                enter-to-class - string
                leave-to-class - string
                appear-to-class - string
                enter-active-class - string
                leave-active-class - string
                appear-active-class - string
           事件：
                before-enter
                before-leave
                enter
                leave
                appear
                after-enter
                after-leave
                after-appear
                enter-cancelled
                leave-cancelled (仅 v-show)
                appear-cancelled
           用法: 
                <!-- 单个元素 -->
                <transition>
                  <div v-if="ok">toggled content</div>
                </transition>
                
                <!-- 动态组件 -->
                <transition name="fade" mode="out-in" appear>
                  <component :is="view"></component>
                </transition>
                
                <!-- 事件钩子 -->
                <div id="transition-demo">
                  <transition @after-enter="transitionComplete">
                    <div v-show="ok">toggled content</div>
                  </transition>
                </div>
        3. transition-group
           Props：
                tag - string - 如果未定义，则不渲染动画元素。
                move-class - 覆盖移动过渡期间应用的 CSS 类。
                除了 mode - 其他 attribute 和 <transition> 相同。
           事件：
                事件和 <transition> 相同。
           用法:
                <transition-group tag="ul" name="slide">
                    <li v-for="item in items" :key="item.id">
                        {{ item.text }}
                    </li>
                </transition-group>
        4. keep-alive <keep-alive> 包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们。
           Props：
                include - string | RegExp | Array。只有名称匹配的组件会被缓存。
                exclude - string | RegExp | Array。任何名称匹配的组件都不会被缓存。
                max - number | string。最多可以缓存多少组件实例。
           用法: 
               <!-- 基本 -->
                <keep-alive>
                  <component :is="view"></component>
                </keep-alive>
                <!-- 多个条件判断的子组件 -->
                <keep-alive>
                  <comp-a v-if="a > 1"></comp-a>
                  <comp-b v-else></comp-b>
                </keep-alive>
                <!-- 和 `<transition>` 一起使用 -->
                <transition>
                  <keep-alive>
                    <component :is="view"></component>
                  </keep-alive>
                </transition>
        5. slot
           Props：
                name - string，用于具名插槽
           用法：
                <slot> 元素作为组件模板之中的内容分发插槽。<slot> 元素自身将被替换。
        6. teleport 移动实际的 DOM 节点，而不是被销毁和重新创建，并且它还将保持任何组件实例的活动状态。
           Props：
                to - string。指定将在其中移动 <teleport> 内容的目标元素
                disabled - boolean。此可选属性可用于禁用 <teleport> 的功能，这意味着其插槽内容将不会移动到任何位置，而是在你在周围父组件中指定了 <teleport> 的位置渲染。
           用法:
                <teleport to="#popup" :disabled="displayVideoInline">
                    <video src="./my-movie.mp4">
                </teleport>


