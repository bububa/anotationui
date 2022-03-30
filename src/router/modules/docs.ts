import { RouteRecordRaw } from 'vue-router';
import { DocumentTextOutline } from '@vicons/ionicons5';
import { DocPage } from '@/router/constant';
import { renderIcon } from '@/utils/index';

const routeName = "doc"

const routes: Array<RouteRecordRaw> = [
  {
    path: '/doc',
    name: routeName,
    component: DocPage,
    meta: {
      title: '项目文档',
      icon: renderIcon(DocumentTextOutline),
    },
  },
];

export default routes;
