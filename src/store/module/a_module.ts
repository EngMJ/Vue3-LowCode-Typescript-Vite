import { ActionContext } from 'vuex'
import { State } from '../index'
interface moduleState{
    num:number
}
const moduleA = {
    // 局部命名空间
    namespaced: true,
    state() {
        return {
            num: 0
        }
    },
    mutations:{
        // 这个state代表的是本模块的状态
        add (state: moduleState) {
            // ...
            state.num++
        }
    },
    actions: {
        // 以下内容仅针对  namespace：true的情况
        // context.rootGetters 根节点getter
        // context.getters 模块getter
        // 通过 context.dispatch('actionName', null, { root: true }) 可直接对根节点actions提交修改
        // 通过 context.commit('mutationName', null, { root: true }) 可直接对根节点mutations提交修改
        async asyncSum(context:ActionContext<moduleState,State>, payload: any) {
            setTimeout(() => {
                // 输出本模块的state
                console.log(context.state)
                // 输出根节点的state
                console.log(context.rootState)
            }, 0)
        },
        // 注册到根节点的action
        someAction: {
            root: true,
            handler (namespacedContext:ActionContext<moduleState,State>, payload:any) {
              // ...
            }
        }
    },
    getters: {
        // rootState代表着根节点State
        // rootGetters代表根节点getters
        sum (state:moduleState, getters:any, rootState:State, rootGetters:any) {
            // ...
            return state.num + 10
        }
    }
}

export default moduleA
