import type { RouteRecordRaw } from 'vue-router';
import { Error404Page, RedirectName } from '@/router/constant';

// 404 on a page
export const ErrorPageRoute: RouteRecordRaw = {
  path: '/:path(.*)*',
  name: 'error',
  component: Error404Page,
  meta: {
    title: 'Error',
    hideBreadcrumb: true,
  }
};

export const RedirectRoute: RouteRecordRaw = {
  path: '/redirect/:path(.*)',
  name: RedirectName,
  component: () => import('@/views/redirect/index.vue'),
  meta: {
    title: RedirectName,
    hideBreadcrumb: true,
  }
};
