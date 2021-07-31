import { createStore, Store, useStore as baseUseStore } from 'vuex'
import { InjectionKey } from 'vue'
import moduleA from './module/a_module'
import moduleB from './module/b_module'

export interface State {
    num: number
}

export const key:InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
    // 严格模式,无论何时发生了状态变更且不是由 mutation 函数引起的，将会抛出错误
    strict: true,
    state:{
        num: 0
    },
    // 同步方法，通过this.$store.commit('add', payload)触发
    mutations: {
        // payload为传入的参数
        add (state, payload) {
            state.num++
            console.log(state)
        }
    },
    getters: {
        // getters 为当前store的getter
        sum (state, getters) {
            return state.num + 10
        }
    },
    // 处理异步事务
    actions: {
        // 通过this.$store.dispatch('asyncSum', payload)触发
        // context是store实例的克隆,因为需要支持module功能
        // payload为传入参数
        // 使action函数返回promise对象，可使用链式操作
        async asyncSum(context, payload) {
            setTimeout(() => {
                context.commit('add')
            }, 0)
        }
    },
    modules: {
        a: moduleA,
        b: moduleB
    }
})

export function useStore() {
    return baseUseStore(key)
}
