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
### Vite
描述于==》vite.config.ts

### Vuex - TS

### VueRouter - TS

