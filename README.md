# Vue 3 + LowCode + Typescript + Vite

### Vue

1. 生命周期函数，组件销毁  beforeUnmount/unmounted
2. 显示发出事件声明，为对象时能校验事件参数是否正确。 emits，当在 emits 选项中定义了原生事件 (如 click) 时，将使用组件中的事件替代原生事件侦听器（替代vue2x的.native修饰符）
3. 组件多根节点，非Prop的Attribute继承时会警告，可通过$attrs进行单一绑定
4. 组件上v-model：
---
    //父组件中：
    <my-component v-model：key.test="val"></my-component>

---
       // 子组件
       app.component('my-component', {
       props: ['key','keyModifiers'], 
       // 自定义参数为key，自定义修饰符为 自定义参数 + "Modifiers"
       // 没有自定义参数时，默认值为 modelValue，自定义修饰符为Modifiers
       emits: ['update:key'], 
       // 没有自定义参数时为update:modelValue
       template: `
           <input
           type="text"
           :value="title"
           @input="$emit('update:title', $event.target.value)">
       `，
          created() {
            // 在当组件的 created 生命周期钩子触发时才有值
            console.log(this.keyModifiers.test)  // { test: true}
          }
       })
5. 插槽v-slot:name='作用域变量'，当获取默认插槽作用域时可写 v-slot='作用域变量'。
   可解构，动态具名插槽v-slot:[dynamicSlotName]，具名插槽缩写v-slot：header => #header
6.异步组件：

---
      const { createApp, defineAsyncComponent } = Vue
      const app = createApp({})
      const AsyncComp = defineAsyncComponent(
         () =>
            new Promise((resolve, reject) => {
            resolve({
               template: '<div>I am async!</div>'
            })
         })
         // 或者improt（）
         // return import('./components/AsyncComponent.vue')
      )
      app.component('async-example', AsyncComp)
7. 强制更新 this.$forceUpdate()
8. transition-group/transition内置组件，过渡钩子，过渡class，首次渲染appear属性及对应钩子
9. 组合式api： setup() / ref(任意类型) / reactive({}) / computed(cb/{get:cb,set:cb}) / watch(key,cb,optionObj) / watchEffect(cb) / provide(key,value) / inject(key,可选默认值) / toRefs()

---
       provide/Inject实现响应式特性
       1. options中:
       app.component('todo-list', {
       provide() {
           return {
               todoLength: Vue.computed(() => this.todos.length)
           }
       }
       })
       app.component('todo-list-statistics', {
           inject: ['todoLength'],
           created() {
               console.log(`Injected property: ${this.todoLength.value}`) // > Injected property: 5
           }
       })
      2. setup中:
      provide('location', reactive({*}) / ref(*))
         

      toRefs特性
      1. 可将响应式属性进行解构，并保持响应式特性
      
      toRef特性
      如果 title 是可选的 prop，则传入的 props 中可能没有 title 。在这种情况下，toRefs 将不会为 title 创建一个 ref：
      // MyBook.vue
      import { toRef } from 'vue'
         setup(props) {
         const title = toRef(props, 'title')
         console.log(title.value)
      }

      setup特性
      1. 避免使用this，不是组件实例
      2. setup的调用在data、computed、methods之前，无法获取对应内容
      3. 函数接受两个参数，props/context(attrs/slot/emit)，props不能解构，否则失去响应性。 
      4. 如果你打算根据 attrs 或 slots 更改应用副作用，那么应该在 onUpdated 生命周期钩子中执行此操作
      5. return的对象结果暴露给组件，任何地方都可使用。 也可以return () => h('div', []) 渲染函数

      ref特性
      1. 返回值包裹为一个对象通过 .value访问， 原因是要让js基础类型与引用类型的按地址传递的行为统一，保持其响应式引用

      生命周期钩子特性
      1. onBeforeMount/onMounted/onBeforeUpdate/onUpdated/onBeforeUnmount/onUnmounted/onActivated/onDeactivated
      2. onErrorCaptured/onRenderTracked/onRenderTriggered
      3. 没有beforeCreate/created, 可将写在这些生命周期中的代码，直接写在setup函数中
      
      watch特性
      1. watch(key或getter或[key1,key2]或()=> {...reactive({})}, (newValue, oldValue) => {
         console.log('The new counter value is: ' + counter.value)
      },{deep:true})
      2. 数据更新后执行回调
      3. deep为深度监听
      4. 针对reactive的响应式对象/数组的监听，需使用值克隆
      5. 返回值是可用于清除监听的函数

      watchEffect特性
      1. 会立即执行传入函数,即使监听数据没有更新
      2. 通过返回值进行清除监听，也可在传入函数 的参数onInvalidate函数 进行失效清除。
      3. 数据更新后，监听回调默认在组件更新前执行，如需在更新后执行则watchEffect(cb,{ flush: 'post' }),需要同步更新传入sync

      vue特殊按需加载
      1. readonly() 只读
      2. propsType 自定义props传入参数的类型

10.Mixin

---
      1. 示例
      const myMixin = {
         created() {
            this.hello()
         },
         methods: {
            hello() {
               console.log('hello from mixin!')
            }
         }
      }
      
      const app = Vue.createApp({
         mixins: [myMixin]
      })

      2. 选项合并，同名数据的 property 发生冲突时，会以组件自身的数据为优先。同名钩子函数将合并为一个数组，因此都将被调用。值为对象的选项，例如 methods、components 和 directives，将被合并为同一个对象。
      3. 自定义合并逻辑，app.config.optionMergeStrategies添加函数：
      const app = Vue.createApp({
         custom: 'hello!'
      })
      app.config.optionMergeStrategies.custom = (toVal, fromVal) => {
         console.log(fromVal, toVal)
         // => "goodbye!", undefined
         // => "hello", "goodbye!"
         return fromVal || toVal
      }
      app.mixin({
         custom: 'goodbye!',
         created() {
            console.log(this.$options.custom) // => "hello!"
         }
      })
      4. 不足之处，易命名冲突，不易复用

11. teleport组件
---
      1. 示例，挂载至body
      app.component('modal-button', {
      template: `
         <button @click="modalOpen = true">
         Open full screen modal! (With teleport!)
         </button>
          <teleport to="body">
            <div v-if="modalOpen" class="modal">
              <div>
                I'm a teleported modal! 
                (My parent is "body")
                <button @click="modalOpen = false">
                  Close
                </button>
              </div>
            </div>
          </teleport>
      `,
      data() {
         return {
            modalOpen: false
         }
      }
      })
   
      2.在同一目标上使用多个 teleport，顺序将是一个简单的追加，稍后挂载将位于目标元素中较早的挂载之后
12. 渲染函数
---
      1. 示例
      import { h } from 'vue'
      export default defineComponent({
         render() {
            return h(
               // {String | Object | Function} tag
               // 一个 HTML 标签名、一个组件、一个异步组件、或
               // 一个函数式组件。
               //
               // 必需的。
               'div',
               
               // {Object} props
               // 与 attribute、prop 和事件相对应的对象。
               // 我们会在模板中使用。
               //
               // 可选的。
               {},
               
               // {String | Array | Object} children
               // 子 VNodes, 使用 `h()` 构建,
               // 或使用字符串获取 "文本 Vnode" 或者
               // 有插槽的对象。
               //
               // 可选的。
               [
                  'Some text comes first.',
                  h('h1', 'A headline'),
                  h(MyComponent, {
                  someProp: 'foobar'
                  })
               ]
            )
         }
      })
      
      2. render与h函数都返回vNode（虚拟DOM），return出去的vNode（h函数）必须唯一。也可返回字符串/数组
      render() {
         // 错误 - 重复的 Vnode!
         // const myParagraphVNode = h('p', 'hi')
         // return h('div', [
         // myParagraphVNode, myParagraphVNode
         // ])
         return h('div',
            Array.from({ length: 20 }).map(() => {
               return h('p', 'hi')
            })
         )
      }
      
      // 返回字符串
         render() {
            return 'Hello world!'
         }      

      // 返回数组
         // 相当于模板 `Hello<br>world!`
         render() {
            return [
               'Hello',
               h('br'),
               'world!'
            ]
         }

      // 返回jsx模板
         import AnchoredHeading from './AnchoredHeading.vue'
         const app = createApp({
            render() {
               return (
                  <AnchoredHeading level={1}>
                  <span>Hello</span> world!
                  </AnchoredHeading>
               )
            }
         })
         app.mount('#demo')
      
      // 函数式组件
         1. 如果你将一个函数作为第一个参数传入 h，它将会被当作一个函数式组件来对待
         2. 函数式组件没有组件实例，没有生命周期。接受两个参数props,context（attrs、emit、slots）
         3. 函数就是自身的render函数
         const FunctionalComponent = (props, context) => {
            // ...
         }
         FunctionalComponent.props = ['value']
         FunctionalComponent.emits = ['click']

      3.通过名称解析组件
      const { h, resolveComponent } = Vue
      render() {
         const ButtonCounter = resolveComponent('ButtonCounter')
         return h(ButtonCounter)
      }
      4. v-model
         props: ['modelValue'],
         emits: ['update:modelValue'],
         render() {
            return h(SomeComponent, {
               modelValue: this.modelValue,
               'onUpdate:modelValue': value => this.$emit('update:modelValue', value)
            })
         }
      5. 事件绑定，要处理 click 事件，prop 名称应该是 onClick
      6. 事件修饰符
         // 方式1
         render() {
            return h('input', {
               onClickCapture: this.doThisInCapturingMode,
               onKeyupOnce: this.doThisOnce,
               onMouseoverOnceCapture: this.doThisOnceInCapturingMode
            })
         }
         // 方式2
         render() {
            return h('input', {
               onKeyUp: event => {
                  // 如果触发事件的元素不是事件绑定的元素
                  // 则返回
                  if (event.target !== event.currentTarget) return
                  // 如果向上键不是回车键，则终止
                  // 没有同时按下按键 (13) 和 shift 键
                  if (!event.shiftKey || event.keyCode !== 13) return
                  // 停止事件传播
                  event.stopPropagation()
                  // 阻止该元素默认的 keyup 事件
                  event.preventDefault()
                  // ...
               }
            })
         }
      7. 插槽
         props: ['message'],
         render() {
            // `<div><slot :text="message"></slot></div>`
            return h('div', {}, this.$slots.default({
               text: this.message
            }))
         }
      8. 作用域插槽
         const { h, resolveComponent } = Vue
         render() {
            // `<div><child v-slot="props"><span>{{ props.text }}</span></child></div>`
            return h('div', [
               h(
                  resolveComponent('child'),
                  {},
                  // 将 `slots` 以 { name: props => VNode | Array<VNode> } 的形式传递给子对象。
                  {
                     default: (props) => Vue.h('span', props.text)
                  }
               )
            ])
         }
      10. component与is
         // resolveDynamicComponent
         const { h, resolveDynamicComponent } = Vue
         // `<component :is="name"></component>`
         render() {
            const Component = resolveDynamicComponent(this.name)
            return h(Component)
         }
         // 简写版`<component :is="bold ? 'strong' : 'em'"></component>`
         render() {
            return h(this.bold ? 'strong' : 'em')
         }
      11. 内置组件
         const { h, KeepAlive, Teleport, Transition, TransitionGroup } = Vue
         // ...
         render () {
            return h(Transition, { mode: 'out-in' }, /* ... */)
         }
      12. 自定义指令
         const { h, resolveDirective, withDirectives } = Vue
         // <div v-pin:top.animate="200"></div>
         render () {
            // resolveDirectives是解析指令的函数
            const pin = resolveDirective('pin')
            return withDirectives(h('div'), [
               [pin, 200, 'top', { animate: true }]
            ])
         }

13. 高阶指南
---
      1. 响应式原理
         1.1 vue3数据代理使用 es6 的 Proxi 进行数据监听
             vue2使用Object.defineProperty，对象无法检测到 property 的添加或删除，数组无法检测到利用索引直接设置一个数组项 vm.items[indexOfItem] = newValue，无法检测修改数组的长度 vm.items.length = newLength。使用$set进行数据响应式更新 this.$set(this.someObject, 'key', val)

         1.2 effect副作用是 属性更新后所需运行的关键逻辑代码
            // 第一步：当一个值被读取时进行追踪：proxy 的 get 处理函数中 track 函数记录了该 property 和当前副作用。
            // 第二步：当某个值改变时进行检测：在 proxy 上调用 set 处理函数。
            // 第三步：重新运行代码来读取原始值：trigger 函数查找哪些副作用依赖于该 property 并执行它们。
            const dinner = {
               meal: 'tacos'
            }
            const handler = {
               // target被代理的对象 、 property属性字符串 、 value修改值 、 receiver 表示原始操作行为所在对象，一般是 Proxy 实例本身
               get(target, property, receiver) {
                  // track函数记录property并绑定对应的effect
                  track(target, property)
                  // Es6 Reflect将this上的方法及属性，全部绑定到Proxi对象上，使Proxi对象可以拦截到对应方法
                  // Reflect.get(target, property, receiver) 查找并返回 target 对象的 property 属性,返回值为查找到的对应属性
                  return Reflect.get(...arguments)
               },
               set(target, property, value, receiver) {
                  // trigger函数查询对应property的effect，并执行effect
                  trigger(target, property)
                  // Reflect.set(target, property, value, receiver) 将 target 的 property 属性设置为 value。返回值为 boolean ，true 表示修改成功，false 表示失败。
                  return Reflect.set(...arguments)
               }
            }
            // proxi返回值是对象的浅拷贝
            const proxy = new Proxy(dinner, handler)

         1.3 响应式代理中访问嵌套对象，该对象在被返回之前也被转换为一个代理
            const handler = {
               get(target, property, receiver) {
                  track(target, property)
                  const value = Reflect.get(...arguments)
                  if (isObject(value)) {
                  // 将嵌套对象包裹在自己的响应式代理中
                     return reactive(value)
                  } else {
                     return value
                  }
               }
            }

         1.4 视图渲染响应式，组件模板被编译为render函数，该函数被effect包裹成关键逻辑，监听render函数所有的vue property，任何一个发生改变则运行effect
         1.5 reactive 相当于 Vue 2.x 中的 Vue.observable()，能 深度转换 传递对象的所有嵌套 property。组件中的 data() 返回对象时，它在内部交由 reactive() 使其成为响应式对象
         1.6 ref能将基础类型转换为响应式，并统一为引用类型的行为模式
         1.7 toRefs响应式解构
         1.8 readonly只读响应式
      2. 渲染机制与优化
         2.1 使用虚拟DOM树（ast语法树）进行数据更改，并一次性添加进DOM树中，以减少DOM操作，优化性能。
         2.2 通过diff算法比较虚拟DOM与真实DOM之间差异，然后进行DOM更新
         2.3 异步更新队列,将在同一事件循环中发生的所有数据变更到一个队列。如果同一个侦听器被多次触发，它只会被推入到队列中一次。在下一个的事件循环“tick”中，Vue 刷新队列并执行实际 (已去重的) 工作（Promise.then、MutationObserver 和 setImmediate，如果执行环境不支持，则会采用 setTimeout(fn, 0)）。
         2.4 Vue.nextTick(callback)、this.$nextTick(cb) ，回调会在Vue完成更新DOM执行 
      3. vue2中更改检查警告
         

14. typeScript支持
---
      1. tsconfig.ts 设置严格模式，对this进行类型检查 compilerOptions.strict = true
      2. webpack中设置ts-loader处理<script lang="ts">代码
      module: {
         rules:[
            {
              test: /\.tsx?$/,
              loader: 'ts-loader',
              options: {
                appendTsSuffixTo: [/\.vue$/],
              },
              exclude: /node_modules/,
            }
         ]
      }
      3. 使用defineComponent函数定义组件，这样可支持类型检查与语法推荐
         import { defineComponent } from 'vue'
         export default defineComponent({
            // 已启用类型推断
         })
      4. 为globalProperties扩充类型，需在根目录或src/typings文件夹中创建*.d.ts文件进行全局声明
         // 增加this.$http 与 this.$validate 属性
         declare module '@vue/runtime-core' {
            export interface ComponentCustomProperties {
               $http: typeof axios
               $validate: (data: object, rule: object) => boolean
            }
         }
      5. 属性注解
      import { defineComponent, PropType, ref } from 'vue'
      interface Book {
         title: string
         author: string
         year: number
      }
      const Component = defineComponent({
         // emits属性注解
         emits: {
            addBook(payload: { bookName: string }) {
               // perform runtime 验证
               return payload.bookName.length > 0
            }
         },
         // computed属性注解
         computed: {
            greeting(): string {
               return this.message + '!'
            },
         },
         // props属性注解
         props: {
            name: String,
            id: [Number, String],
            success: { type: String },
            callback: {
               type: Function as PropType<() => void>
            },
            book: {
               type: Object as PropType<Book>,
               required: true
            },
            metadata: {
               type: null // metadata 的类型是 any
            }
         },
         // setup中props不需要注解，直接引用props组件选项推断类型
         setup(props) {
            // 正确, 'message' 被声明为字符串
            const result = props.message.split('') 
            // 将引发错误: Property 'filter' does not exist on type 'string'
            const filtered = props.message.filter(p => p.value) 
            // ref声明类型，需使用范型
            const year = ref<string | number>('2020')
            // 组件ref的类型声明
            // <myModal ref="modal" />
            const modal = ref<InstanceType<typeof MyModal>>()
            // reactive类型声明
            const book = reactive<Book>({ title: 'Vue 3 Guide' })
            // or
            const book: Book = reactive({ title: 'Vue 3 Guide' })
            // or
            const book = reactive({ title: 'Vue 3 Guide' }) as Book
            // dom事件声明注解
            const handleChange = (evt: Event) => {
               console.log((evt.target as HTMLInputElement).value)
            }
         }
      })
      
15. 自定义指令
---
      指令生命周期：created、beforeMount、mounted、beforeUpdate、updated、beforeUnmount、unmounted
      示例：
       // <a v-pin:[arg]="200"></a>
       directives: {
          pin: {
            // el为绑定指令的dom
            // options（arg传递的参数、value传递的值） 
             mounted(el,options) {
               // options.value 200
               // options.arg arg
             }
          }
       }
16. 插件
---
      功能：
         1. 添加全局方法或属性
         2. 添加全局资源，指令、过滤器、过渡
         3. 添加全局mixin添加组件选项
         4. 添加全局实例方法
         5. 为库提供api
      创建示例：
      // plugins/i18n.js
      // app为由 Vue 的 createApp生成的app 对象
      // options用户传入的选项
      export default {
         install: (app, options) => {
            app.config.globalProperties.$translate = (key) => {
               return key.split('.')
                  .reduce((o, i) => { if (o) return o[i] }, options)
            }
            app.provide('i18n', options)
            app.directive('my-directive', {
               mounted (el, binding, vnode, oldVnode) {
                  ...
               }
            })
            app.mixin({
               created() {
                  ...
               }
            })
         }
      }
      使用：
      app.use(Plugin, myOptions)

### Vue3 api参考

---
   

### Vuex 4x - TS

---
      vuex特点：
      1. 记录变更、保存状态快照、历史回滚/时光旅行
      2. 为响应式状态，可用于computed
      3. 单一状态树，仅有一个store实例
      4. 通过this.$store直接访问
      5. 核心概念State、Getter、Mutation、Action、Module
      6. mapState
         // 在单独构建的版本中辅助函数为 Vuex.mapState
         import { mapState } from 'vuex'
         export default {
            computed:{
               ...mapState({
                  // 箭头函数可使代码更简练
                  count: state => state.count,
                   // 传字符串参数 'count' 等同于 `state => state.count`
                  countAlias: 'count',
                   // 为了能够使用 `this` 获取局部状态，必须使用常规函数
                  countPlusLocalState (state) {
                     return state.count + this.localCount
                  }
               })
            } 
         }
         // 简写
         computed: {
            ...mapState([
               // 映射 this.count 为 store.state.count
               'count'
            ])
         }
      7. mapGetters
         import { mapGetters } from 'vuex'
         export default {
            computed: {
               // 使用对象展开运算符将 getter 混入 computed 对象中
               ...mapGetters([
                  'doneTodosCount',
                  'anotherGetter'
               ])
            }
         }

      8. mapActions
         import { mapActions } from 'vuex'
         export default {
            methods: {
            ...mapActions([
               // 将 `this.increment()` 映射为 `this.$store.dispatch('increment')`
               'increment',
               // `mapActions` 也支持载荷：
               // 将 `this.incrementBy(amount)` 映射为 `this.$store.dispatch('incrementBy', amount)`
               'incrementBy'
            ]),
            ...mapActions({
               // 将 `this.add()` 映射为 `this.$store.dispatch('increment')`
               add: 'increment'
            })
            }
         }
      9. module 内部能获取自身state及根节点state。
      10. module 模块内部的 action 、 mutation、Getter 默认 注册在全局命名空间，多个模块能对同一个 action 或 mutation 作出响应
      11. module 添加 namespaced: true 的方式使vuex模块成为带命名空间的模块
         const store = createStore({
            modules: {
               account: {
                     namespaced: true,
                     // 模块内容（module assets）
                     state: () => ({ ... }), // 模块内的状态已经是嵌套的了，使用 `namespaced` 属性不会对其产生影响
                     getters: {
                       isAdmin () { ... } // -> getters['account/isAdmin']
                     },
                     actions: {
                       login () { ... } // -> dispatch('account/login')
                     },
                     mutations: {
                       login () { ... } // -> commit('account/login')
                     },
               
                     // 嵌套模块
                     modules: {
                       // 继承父模块的命名空间
                       myPage: {
                         state: () => ({ ... }),
                         getters: {
                           profile () { ... } // -> getters['account/profile']
                         }
                       },
               
                       // 进一步嵌套命名空间
                       posts: {
                         namespaced: true,
                         state: () => ({ ... }),
                         getters: {
                           popular () { ... } // -> getters['account/posts/popular']
                         }
                       }
                     }
               }
            }
         })
      12. 命名空间module的辅助函数使用
         方式1：
            computed: {
               ...mapState('some/nested/module', {
                  a: state => state.a,
                  b: state => state.b
               })
            },
            methods: {
               ...mapActions('some/nested/module', [
                  'foo', // -> this.foo()
                  'bar' // -> this.bar()
               ])
            }
         方式2：
            import { createNamespacedHelpers } from 'vuex'
            const { mapState, mapActions } = createNamespacedHelpers('some/nested/module')
            export default {
               computed: {
                  // 在 `some/nested/module` 中查找
                  ...mapState({
                     a: state => state.a,
                     b: state => state.b
                  })
               },
               methods: {
                  // 在 `some/nested/module` 中查找
                  ...mapActions([
                     'foo',
                     'bar'
                  ])
               }
            }
      13. module动态注册
         import { createStore } from 'vuex'
         const store = createStore({ /* 选项 */ })
         // 注册模块 `myModule`
         store.registerModule('myModule', {
            // ...
         })
         // 注册嵌套模块 `nested/myModule`
         store.registerModule(['nested', 'myModule'], {
            // ...
         })
         // 注册模块，但保留根节点原有的state
         store.registerModule('myModule', {...}, { preserveState: true })
         // 卸载模块 `nested/myModule`
         store.unregisterModule('myModule')
         // 检查模块是否被注册
         store.hasModule('myModule')
         // 嵌套模块应该以数组形式传递给 registerModule 和 hasModule
         store.unregisterModule(['myModule'])
         store.hasModule(['myModule'])

      14. 组合式api中使用useStore访问store,与this.$store等效
         import { computed } from 'vue'
         import { useStore } from 'vuex'
         export default {
            setup () {
            const store = useStore()
                return {
                  // 在 computed 函数中访问 state
                  count: computed(() => store.state.count),
                  // 使用 mutation
                  increment: () => store.commit('increment'),
                  // 在 computed 函数中访问 getter
                  double: computed(() => store.getters.double),
                  // 使用 action
                  asyncIncrement: () => store.dispatch('asyncIncrement')
                }
            }
         }
      15. vuex插件
         function plugin(store) {
            // 当 store 初始化后调用
            // 插件中不允许直接修改状态——类似于组件，只能通过提交 mutation 来触发变化
            store.commit('receiveData', data)
            // 快照保存更新前状态
            let prevState = _.cloneDeep(store.state)
            // store.subscribe函数每次 mutation 之后调用
            store.subscribe((mutationObj, state) => {
               // mutationObj 的格式为 { type, payload }
               let nextState = _.cloneDeep(state)
               // 比较 prevState 和 nextState...
               // 保存状态，用于下一次 mutation
               prevState = nextState
            })
         }
         const store = createStore({
            plugins: [plugin]
         })
      16. strict: true 严格模式,无论何时发生了状态变更且不是由 mutation 函数引起的，将会抛出错误
      17. store.hotUpdate() 支持webpack HMR热重载
      18. TS支持
         18.1 支持this.$store,创建d.ts文件
            // vuex.d.ts
            import { ComponentCustomProperties } from 'vue'
            import { Store } from 'vuex'
            declare module '@vue/runtime-core' {
               // 声明自己的 store state
               interface State {
                  count: number
               }
            
               // 为 `this.$store` 提供类型声明
               interface ComponentCustomProperties {
                  $store: Store<State>
               }
            }
         18.2 useStore 组合式函数类型声明
            简化版：
               // 18.1 在store.ts中,将 store 安装到 Vue 应用时提供类型化的 InjectionKey 。
               // 18.2 在store.ts中,定义类型化的 InjectionKey。
               // 18.3 在main.ts中,将类型化的 InjectionKey 传给 useStore 方法。
               // 18.4 在*.vue文件中,使用包装的useStore函数获取store对象
               
               // store.ts文件
               import { InjectionKey } from 'vue'
               import { createStore, useStore as baseUseStore, Store } from 'vuex'
               export interface State {
                  count: number
               }
               export const key: InjectionKey<Store<State>> = Symbol()
               export const store = createStore<State>({
                  state: {
                     count: 0
                  }
               })
               // 定义自己的 `useStore` 组合式函数
               export function useStore () {
                  return baseUseStore(key)
               }

               // main.ts 文件
               import { createApp } from 'vue'
               import { store, key } from './store'
               const app = createApp({ ... })
               // 传入 injection key
               app.use(store, key)
               app.mount('#app')

               // vue 组件文件
               import { useStore } from './store'
               export default {
                  setup () {
                     const store = useStore()
                     store.state.count // 类型为 number
                  }
               }

### VueRouter 4x - TS

---


### Vite
描述于==》vite.config.ts
