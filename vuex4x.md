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
