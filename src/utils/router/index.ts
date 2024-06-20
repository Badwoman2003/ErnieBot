import DefaultLayout from '@components/layout/default-layout.vue';
import NotFound from '@components/not-found.vue';
import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';

import { Route, getAsyncRoutes } from './async-routes';
import constants from '../constants';

// @pages/ 下的 page.vue, layout.vue, loading.vue 受到影响
const modules = import.meta.glob('../../pages/**/*.vue');

// 根据目录结构生成路由配置
const asyncRouteRoot = getAsyncRoutes(modules);

function setRouteRecords(asyncRoute: Route, target: RouteRecordRaw[]) {
  // TODO: Loading + Suspense Component
  const { path, component, layout, children } = asyncRoute;
  const record: RouteRecordRaw = {
    path,
    // 目标 Layout
    component: layout || DefaultLayout,
    children: [],
  };
  if (component) {
    // 目标 Page
    record.children.push({
      path: '',
      component,
      children: [],
    });
  }
  if (children.length === 0) {
    record.children.push({
      path: '/:pathMatch(.*)*',
      component: NotFound,
      children: [],
    });
  } else {
    children.forEach((item) => {
      setRouteRecords(item, record.children);
    });
    // 404 路由
    record.children.push({
      path: '/:pathMatch(.*)*',
      component: NotFound,
      children: [],
    });
  }
  target.push(record);
}

const routes: RouteRecordRaw[] = [
  // 额外的路由
];

setRouteRecords(asyncRouteRoot, routes);

routes.push({
  path: '/:pathMatch(.*)*',
  component: NotFound,
  children: [],
});

const router = createRouter({
  routes,
  history: createWebHistory(constants.base || '/'),
  scrollBehavior() {
    // 始终滚动到顶部
    return { top: 0 };
  },
});

// 路由守卫：路由前
router.beforeEach((_to, _from, next) => {
  // if (to.path === '/') {
  //   return next({
  //     path: '/index/'
  //   });
  // }
  return next();
});

export default router;
