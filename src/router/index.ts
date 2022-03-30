import { App } from 'vue';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { RedirectRoute } from '@/router/base';
import { PageEnum } from '@/enums/pageEnum';

const modules = import.meta.globEager('./modules/**/*.ts');

const routeModuleList: RouteRecordRaw[] = [];

Object.keys(modules).forEach((key) => {
  const mod = modules[key].default || {};
  const modList = Array.isArray(mod) ? [...mod] : [mod];
  routeModuleList.push(...modList);
});

function sortRoute(a: RouteRecordRaw, b: RouteRecordRaw): number {
  return (a.meta?.sort as number || 0) - (b.meta?.sort as number || 0);
}

routeModuleList.sort(sortRoute);

export const keepAliveComponents = routeModuleList.filter((v: RouteRecordRaw) => {
  return v.meta?.keepAlive;
})

export const RootRoute: RouteRecordRaw = {
  path: '/',
  name: 'Root',
  redirect: PageEnum.BASE_HOME,
  meta: {
    title: 'Root',
  },
};


export const constantRouter: any[] = [RootRoute, RedirectRoute, ...routeModuleList];

const router = createRouter({
  history: createWebHistory(''),
  routes: constantRouter,
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

export function setupRouter(app: App) {
  app.use(router);
}

export default router;
