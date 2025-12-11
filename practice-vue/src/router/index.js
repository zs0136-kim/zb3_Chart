import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
      path: '/login',
      component: () => import('../pages/Login.vue'),
      meta: { hideLayout: true }, // サイドメニュー＆ヘッダーを隠すフラグ
    },
    {
        path: '/',
        component: () => import('../pages/Home.vue'),
        meta: { title: 'ダッシュボード' }
    },
    {
        path: '/quotations',
        component: () => import('../pages/Quotations.vue'),
        meta: { title: '見積り' },
        children: [
        { path: '', redirect: 'quotationslist' },
        { path: 'quotationslist',     name: 'quotations-list' },
        { path: 'quotationsentries',  name: 'quotations-entries' },
        { path: 'quotationsactivity', name: 'quotations-activity' },
        { path: 'quotationspricebook',name: 'quotations-pricebook' },
        ],
    },
    {
        path: '/ordertaking',
        component: () => import('../pages/Ordertaking.vue'),
        meta: { title: '受注' },
        children: [
        { path: '', redirect: 'ordertakinglist' },
        { path: 'ordertakinglist',     name: 'ordertaking-list' },
        { path: 'ordertakingentries',  name: 'ordertaking-entries' },
        { path: 'ordertakingitemlist', name: 'ordertaking-itemlist' }
        ],
    },
  { 
    path: '/settings',
    component: () => import('../pages/Settings.vue'),
    meta: { title: '設定' }
  }
]


const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
