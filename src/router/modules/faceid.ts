import { RouteRecordRaw } from 'vue-router';
import { FaceIDListPage, FaceIDInfoPage } from '@/router/constant';
import { FaceId } from "@vicons/tabler"
import { renderIcon } from '@/utils/index';
import ParentLayout from '@/layout/parentLayout.vue'

/**
 * @param name 路由名称, 必须设置,且不能重名
 * @param meta 路由元信息（路由附带扩展信息）
 * @param redirect 重定向地址, 访问这个路由时,自定进行重定向
 * @param meta.disabled 禁用整个菜单
 * @param meta.title 菜单名称
 * @param meta.icon 菜单图标
 * @param meta.keepAlive 缓存该路由
 * @param meta.sort 排序越小越排前
 * */
const routes: Array<RouteRecordRaw> = [
  {
    path: '/faceid',
    name: 'faceid',
    component: ParentLayout,
    meta: {
      title: 'FaceID',
      icon: renderIcon(FaceId),
    },
    children: [
      {
        path: '/faceid/list',
        name: 'faceid/list',
        component: FaceIDListPage,
        meta: {
          title: 'FaceID List',
          icon: renderIcon(FaceId),
        },
      },
      {
        path: '/faceid/info/:id(\\d+)',
        name: 'faceid/info',
        component: FaceIDInfoPage,
        props(route) {
          const props: Recordable = { ...route.params }
          props.id = Number(props.id)
          return props
        },
        meta: {
          title: 'FaceID Info',
          icon: renderIcon(FaceId),
        }
      }
    ]
  }
];

export default routes;
