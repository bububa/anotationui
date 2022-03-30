import { RouteRecordRaw } from 'vue-router';
import { AboutPage } from '@/router/constant';
import { ProjectOutlined } from '@vicons/antd';
import { renderIcon, renderNew } from '@/utils/index';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/about',
    name: 'about',
    component: AboutPage,
    meta: {
      title: 'About',
      extra: renderNew(),
      icon: renderIcon(ProjectOutlined),
    }
  },
];

export default routes;
