### VueRouter 4x - TS

---
      功能特点:
         1. 嵌套路由映射
         2. 动态路由选择
         3. 模块化、基于组件的路由配置
         4. 路由参数、查询、通配符
         5. 展示由 Vue.js 的过渡系统提供的过渡效果
         6. 细致的导航控制
         7. 自动激活 CSS 类的链接
         8. HTML5 history 模式或 hash 模式
         9. 可定制的滚动行为
         10. URL 的正确编码
      1. router-link组件
         1.1 转译为正确 `href` 属性的 `<a>` 标签
         1.2 通过to属性指定跳转路径
      2. router-view组件, 将显示对应路由的组件
      3. 参数动态路由,以:设置动态路由参数
         匹配设置: /users/:username/posts/:postId
         匹配路径: /users/eduardo/posts/123
         this.$route.params: { username: 'eduardo', postId: '123' }
      4. 正则参数动态路由,针对当前参数的正则写在 () 内部, 针对整个路由的可直接写在 参数 后面, 两者可以组合使用
         const routes = [
            // 将匹配所有内容并将其放在 `$route.params.pathMatch` 下
            { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
            // 将匹配以 `/user-` 开头的所有内容，并将其放在 `$route.params.afterUser` 下
            { path: '/user-:afterUser(.*)', component: UserGeneric },
            // /:chapters ->  匹配 /one, /one/two, /one/two/three, 等
            { path: '/:chapters+' },
            // /:chapters -> 匹配 /, /one, /one/two, /one/two/three, 等
            { path: '/:chapters*' },
            // 仅匹配数字
            // 匹配 /1, /1/2, 等
            { path: '/:chapters(\\d+)+' },
            // 匹配 /, /1, /1/2, 等
            { path: '/:chapters(\\d+)*' },
            // 匹配 /users 和 /users/posva
            { path: '/users/:userId?' },
            // 匹配 /users 和 /users/42
            { path: '/users/:userId(\\d+)?' },
         ]
      5. 相同组件不同路径,在切换时会复用组件,这时组件的生命周期钩子不会被调用,可通过对params的变化进行切换响应
         4.1 watch
            watch: {
               '$route.params': function(toParams, preParams) {
                  //...
               }
            }
         4.2 beforeRouteUpdate组件导航守卫
            async beforeRouteUpdate(to, from) {
               // 对路由变化做出响应...
               this.userData = await fetchUser(to.params.id)
            }
      6. 路由嵌套属性 children
      7. 导航: 声明式<router-link :to="...">, 编程式router.push(...),都会向 history 栈添加一个新的记录
         // 字符串路径
         router.push('/users/eduardo')
         // 带有路径的对象
         router.push({ path: '/users/eduardo' })
         // 命名的路由，并加上参数，让路由建立 url
         router.push({ name: 'user', params: { username: 'eduardo' } })
         // 带查询参数，结果是 /register?plan=private
         router.push({ path: '/register', query: { plan: 'private' } })
         // 带 hash，结果是 /about#team
         router.push({ path: '/about', hash: '#team' })
         特殊: 如果提供了 path会让params 会被忽略
         router.push({ path: '/user', params: { username } }) // -> /user
         更改为:
         router.push(`/user/${username}`) // -> /user/eduardo
      8. router.push 和所有其他导航方法都会返回一个 Promise,导航完成后才知道成功还是失败
      9. 替换: 声明式<router-link :to="..." replace>,编程式router.replace(...),都不会向 history 添加新记录
         router.push({ path: '/home', replace: true }) 等同 router.replace({ path: '/home' })
      10.  router.go
         // 刷新
         router.go(0)
         // 向前移动一条记录，与 router.forward() 相同
         router.go(1)
         // 返回一条记录，与router.back() 相同
         router.go(-1)
         // 如果没有那么多记录，静默失败
         router.go(-100)
         router.go(100)
      11. 命名路由 name属性
         const routes = [
            {
               path: '/user/:username',
               name: 'user',
               component: User
            }
         ]
         // /user/erina
         router.push({ name: 'user', params: { username: 'erina' } })
      12. 命名视图 router-view,可在一个路径上显示不同视图
         // *.vue
         <router-view class="view left-sidebar" name="LeftSidebar"></router-view>
         <router-view class="view main-content"></router-view>
         <router-view class="view right-sidebar" name="RightSidebar"></router-view>
         // router.js
         const router = createRouter({
            history: createWebHashHistory(),
            routes: [
               {
                  path: '/',
                  components: {
                     // 默认视图
                     default: Home,
                     // LeftSidebar: LeftSidebar 的缩写
                     LeftSidebar,
                     // 它们与 `<router-view>` 上的 `name` 属性匹配
                     RightSidebar,
                  },
               },
            ],
         })
      13. 重定向, 组件内导航守卫只会应用到重定向的最终组件, 以下例子中home组件不会触发导航守卫
         // 重定向
         const routes = [{ path: '/home', redirect: '/' }]
         // 命名路由重定向
         const routes = [{ path: '/home', redirect: { name: 'homepage' } }]
         // 函数重定向
         const routes = [
            {
               // /search/screens 重定向为 /search?q=screens
               path: '/search/:searchText',
               redirect: to => {
                  // 方法接收目标路由作为参数
                  // return 重定向的字符串路径/路径对象
                  return { path: '/search', query: { q: to.params.searchText } }
               },
            },
            {
               path: '/search',
               // ...
            },
         ]
      14. 别名 alias
         // 单别名
         const routes = [{ path: '/', component: Homepage, alias: '/home' }]
         // 多别名
         const routes = [
            {
               path: '/users',
               component: UsersLayout,
               children: [
                  // 为这 3 个 URL 呈现 UserList
                  // - /users
                  // - /users/list
                  // - /people
                  { path: '', component: UserList, alias: ['/people', 'list'] },
               ],
            },
         ]
         // 路由有参数，请确保在任何绝对别名中包含它们
         const routes = [
            {
               path: '/users/:id',
               component: UsersByIdLayout,
               children: [
                  // 为这 3 个 URL 呈现 UserDetails
                  // - /users/24
                  // - /users/24/profile
                  // - /24
                  { path: 'profile', component: UserDetails, alias: ['/:id', ''] },
               ],
            },
         ]
      15. 将props传递给组件
         // 当 props 设置为 true 时，route.params 将被设置为组件的 props。
         const User = {
            props: ['id'],
            template: '<div>User {{ id }}</div>'
         }
         const routes = [{ path: '/user/:id', component: User, props: true }]
         // 命名视图打开props
         const routes = [
            {
               path: '/user/:id',
               components: { default: User, sidebar: Sidebar },
               props: { default: true, sidebar: false }
            }
         ]
         // 静态props
         const routes = [
            {
               path: '/promotion/from-newsletter',
               component: Promotion,
               props: { newsletterPopup: false }
            }
         ]
         // 函数props
         const routes = [
            {
               path: '/search',
               component: SearchUser,
               props: route => ({ query: route.query.q })
            }
         ]
      16. 历史模式
         // Hash模式
         import { createRouter, createWebHashHistory } from 'vue-router'
         const router = createRouter({
         history: createWebHashHistory(),
            routes: [
               //...
            ],
         })
         // history模式,需配置nginx,不会出现404
         import { createRouter, createWebHistory } from 'vue-router'
         const router = createRouter({
         history: createWebHistory(),
            routes: [
               //...
            ],
         })
      17. 导航守卫
         完整流程:
            1.导航被触发。
            2.在失活的组件里调用 beforeRouteLeave 守卫。
            3.调用全局的 beforeEach 守卫。
            4.在重用的组件里调用 beforeRouteUpdate 守卫(2.2+)。
            5.在路由配置里调用 beforeEnter。
            6.解析异步路由组件。
            7.在被激活的组件里调用 beforeRouteEnter。
            8.调用全局的 beforeResolve 守卫(2.5+)。
            9.导航被确认。
            10.调用全局的 afterEach 钩子。
            11.触发 DOM 更新。
            12.调用 beforeRouteEnter 守卫中传给 next 的回调函数，创建好的组件实例会作为回调函数的参数传入。
         17.1 全局前置守卫通过router.beforeEach注册,将按照顺序触发
         触发时间: 导航开始前
         作用: 鉴权
            const router = createRouter({ ... })
            // 错误时,调用router.onError() 回调
            // to: 即将要进入的目标, from: 当前导航正要离开的路由, next()可以输入路由则重定向,不输入则继续导航
            router.beforeEach((to, from, next) => {
               // 返回路由地址,则会以router.push()跳转
               // 返回true或undefined则导航有效继续
               // 返回 false 以取消导航,并将url改回跳转前url地址
               return false
            })
         17.2 全局解析守卫router.beforeResolve
         触发时间:  每次导航会触发，在导航被确认之前，同时在所有组件内守卫和异步路由组件被解析之后
         作用: router.beforeResolve 是一个理想的位置，可以在用户无法进入页面的情况下，获取数据或进行任何其他你想避免的操作
            router.beforeResolve(async (to, from, next) => {
               if (to.meta.requiresCamera) {
                  try {
                     await askForCameraPermission()
                  } catch (error) {
                     if (error instanceof NotAllowedError) {
                        // ... 处理错误，然后取消导航
                        return false
                     } else {
                        // 意料之外的错误，取消导航并把错误传给全局处理器
                        throw error
                     }
                  }
               }
            })
         17.3 全局后置钩子
         触发时间: 导航结束
         作用: 它们对于分析、更改页面标题、声明页面等辅助功能以及许多其他事情都很有用
            // failure是带有一些额外属性的 Error 实例,导航失败时可以使用
            router.afterEach((to, from, failure) => {
               sendToAnalytics(to.fullPath)
            })
         17.4 路由独享守卫
            // 只在进入路由时触发，不会在 params、query 或 hash 改变时触发
            const routes = [
               {
                  path: '/users/:id',
                  component: UserDetails,
                  beforeEnter: (to, from) => {
                     return false
                  },
                  // 数组方式 beforeEnter: [fn]
               },
            ]
         17.5 组件内守卫
            const UserDetails = {
               template: `...`,
               // 进入守卫
               beforeRouteEnter(to, from, next) {
                  // 在渲染该组件的对应路由被验证前调用
                  // 不能获取组件实例 `this` ！
                  // 因为当守卫执行时，组件实例还没被创建！
                  // 在next回调中可访问组件实例
                  next(vm => {
                     // 通过 `vm` 访问组件实例
                  })
               },
               // 更新守卫,
               beforeRouteUpdate(to, from) {
                  // 在当前路由改变，但是该组件被复用时调用
                  // 举例来说，对于一个带有动态参数的路径 `/users/:id`，在 `/users/1` 和 `/users/2` 之间跳转的时候，
                  // 由于会渲染同样的 `UserDetails` 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。

                  // 因为在这种情况发生的时候，组件已经挂载好了，导航守卫可以访问组件实例 `this`
               },
               // 离开守卫
               beforeRouteLeave(to, from) {
                  // 在导航离开渲染该组件的对应路由时调用
                  // 与 `beforeRouteUpdate` 一样，它可以访问组件实例 `this`
                  // 常用来预防用户在还未保存修改前突然离开
               },
            }
      18. 路由元信息meta,可在路由地址和导航守卫上都被访问
         18.1 $route.meta访问与导航参数to.meta from.meta访问
         18.2 typescript声明RouteMeta 接口来输入 meta 字段
         // typings.d.ts or router.ts
         import 'vue-router'
         declare module 'vue-router' {
            interface RouteMeta {
               // 是可选的
               isAdmin?: boolean
               // 每个路由都必须声明
               requiresAuth: boolean
            }
         }
      19. 组合式api使用router/route,watch
         import { useRouter, useRoute } from 'vue-router'
         export default {
            setup() {
               const router = useRouter()
               const route = useRoute()
               // route 对象是一个响应式对象,避免监听整个 route 对象
               watch(
                  () => route.params,
                  async newParams => {
                    userData.value = await fetchUser(newParams.id)
                  }
               )
            },
         }
      20. 组合式 api的路由导航守卫
         import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'
         export default {
            setup() {
               // 与 beforeRouteLeave 相同，无法访问 `this`
               onBeforeRouteLeave((to, from) => {
                  const answer = window.confirm(
                  'Do you really want to leave? you have unsaved changes!'
                  )
                  // 取消导航并停留在同一页面上
                  if (!answer) return false
               })
               const userData = ref()
               // 与 beforeRouteLeave 相同，无法访问 `this`
               onBeforeRouteUpdate(async (to, from) => {
                  //仅当 id 更改时才获取用户，例如仅 query 或 hash 值已更改
                  if (to.params.id !== from.params.id) {
                    userData.value = await fetchUser(to.params.id)
                  }
               })
            },
         }
      21. 组合式api RouterLink useLink ,将路由信息传递给 setup的props参数
         import { RouterLink, useLink } from 'vue-router'
         export default {
            name: 'AppLink',
            props: {
               // 如果使用 TypeScript，请添加 @ts-ignore
               ...RouterLink.props,
               inactiveClass: String,
            },
            setup(props) {
               // 获取路由信息
               const { route, href, isActive, isExactActive, navigate } = useLink(props)
               const isExternalLink = computed(
                     () => typeof props.to === 'string' && props.to.startsWith('http')
               )
               return { isExternalLink, href, navigate, isActive }
            },
         }
      22. 路由过渡
           <transition :name="route.meta.transition || 'fade'">
               <router-view></router-view>
           </transition>
      23. 滚动行为 scrollBehavior
         限制: 这个功能只在支持 history.pushState 的浏览器中可用
         const router = createRouter({
            history: createWebHashHistory(),
            routes: [...],
            // to和 from 路由对象,savedPosition，只有当这是一个 popstate 导航时才可用（由浏览器的后退/前进按钮触发）。
            scrollBehavior (to, from, savedPosition) {
               // return 期望滚动到哪个的位置,无效值则不会发生滚动
               return {
                  el: '#main', // 滚动到锚点
                  top: -10, // 有el时,滚动到el相对位置. 没有时则是全屏滚动
                  left: 0, // 有el时,滚动到el相对位置. 没有时则是全屏滚动
                  behavior: 'smooth', // 滚动方式, 平滑smooth, 默认直接跳转
               }
            }
            // 延迟滚动, scrollBehavior返回promise
            scrollBehavior(to, from, savedPosition) {
               return new Promise((resolve, reject) => {
                  setTimeout(() => {
                     resolve({ left: 0, top: 0 })
                  }, 500)
               })
            },
         })
      24. 路由懒加载, 不要在路由中使用异步组件
         const routes = [{ path: '/users/:id', component: () => import('./views/UserDetails') }]
      25. 导航故障 Navigation Failure
         25.1 导致用户停留在同一个页面上，由 router.push 返回的 Promise 的解析值将是 Navigation Failure
            const navigationResult = await router.push('/my-profile')
            if (navigationResult) {
               // 导航被阻止
            } else {
               // 导航成功 (包括重新导航的情况), navigationResult 是falsy 值(通常是 undefined)
               this.isMenuOpen = false
            }
         25.2 鉴别故障类型
            import { NavigationFailureType, isNavigationFailure } from 'vue-router'
            // 试图离开未保存的编辑文本界面
            const failure = await router.push('/articles/2')
            if (isNavigationFailure(failure, NavigationFailureType.aborted)) {
               // 给用户显示一个小通知
               showToast('You have unsaved changes, discard and leave anyway?')
            }
      26. 动态路由
         // 这将会删除之前已经添加的路由，因为他们具有相同的名字且名字必须是唯一的
         router.addRoute({ path: '/other', name: 'about', component: Other })
         // 删除路由
         router.removeRoute('about')
         // 检查路由是否存在
         router.hasRoute()
         // 获取一个包含所有路由记录的数组
         router.getRoutes()
