import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'
import { State } from '../store/index'

declare module '@vue/runtime-core' {
    /*interface的声明合并*/
    interface ComponentCustomProperties{
        $store: Store<State>
    }
}
