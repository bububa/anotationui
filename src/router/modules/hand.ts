import { RouteRecordRaw } from 'vue-router';
import { HandPoseListPage, HandPoseInfoPage, HandGuestureListPage, HandGuestureInfoPage } from '@/router/constant';
import { FrontHandOutlined } from "@vicons/material"
import { HandRock, HandTwoFingers } from "@vicons/tabler"
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
    path: '/hand',
    name: 'hand',
    component: ParentLayout,
    meta: {
      title: 'Hand',
      icon: renderIcon(FrontHandOutlined),
    },
    children: [
      {
        path: '/hand-pose/list',
        name: 'hand-pose/list',
        component: HandPoseListPage,
        meta: {
          title: 'Hand Pose List',
          icon: renderIcon(HandRock),
        },
      },
      {
        path: '/hand-pose/info/:id(\\d+)',
        name: 'hand-pose/info',
        component: HandPoseInfoPage,
        props(route) {
          const props: Recordable = { ...route.params }
          props.id = Number(props.id)
          return props
        },
        meta: {
          title: 'Hand Pose Info',
          icon: renderIcon(HandRock),
        }
      },
      {
        path: '/hand-guesture/list',
        name: 'hand-guesture/list',
        component: HandGuestureListPage,
        meta: {
          title: 'Hand Geuesture List',
          icon: renderIcon(HandTwoFingers),
        },
      },
      {
        path: '/hand-guesture/info/:id(\\d+)',
        name: 'hand-guesture/info',
        component: HandGuestureInfoPage,
        props(route) {
          const props: Recordable = { ...route.params }
          props.id = Number(props.id)
          return props
        },
        meta: {
          title: 'Hand Guesture Info',
          icon: renderIcon(HandTwoFingers),
        }
      }
    ]
  }
];

export default routes;
