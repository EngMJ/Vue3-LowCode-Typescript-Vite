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
6. provide类型 Object/Function, Inject类型 Array。实现数据响应，需使用组合式api
---
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
7.异步组件：

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
8.强制更新 this.$forceUpdate()
9. transition-group/transition内置组件，过渡钩子，过渡class，首次渲染appear属性及对应钩子
10. 组合式api： setup() / ref(任意类型) / reactive({}) / computed(cb/{get:cb,set:cb}) / watch(key,cb,optionObj) / watchEffect(cb) / provide() / inject() / toRefs()
---
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

### Vite
描述于==》vite.config.ts

### Vuex - TS

### VueRouter - TS

