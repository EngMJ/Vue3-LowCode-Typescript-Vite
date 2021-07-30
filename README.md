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
9.

### Vite
描述于==》vite.config.ts

### Vuex - TS

### VueRouter - TS

