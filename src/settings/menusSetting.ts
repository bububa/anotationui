import { DashboardOutlined, InfoOutlined } from "@vicons/antd"
import { FaceId, HandRock, HandTwoFingers } from "@vicons/tabler"
import { FrontHandOutlined, DirectionsRunOutlined, SportsKabaddiOutlined } from "@vicons/material"
import { BodyOutline } from "@vicons/ionicons5"
import { renderIcon } from '@/utils/index';
import { MenuOption } from 'naive-ui'
import { RouterLink } from 'vue-router'
import { h } from 'vue'

export const MenuList: Array<MenuOption> = [
  {
    key: "dashboard",
    icon: renderIcon(DashboardOutlined),
    title: 'Dashboard',
    label: h(
      RouterLink,
      {
        to: {
          name: 'dashboard'
        }
      },
      {
        default: () => { 'Dashboard' }
      }
    )
  },
  {
    key: "faceid/list",
    icon: renderIcon(FaceId),
    title: 'FaceID',
    label: h(
      RouterLink,
      {
        to: {
          name: 'faceid/list',
        }
      },
      {
        default: () => { 'FaceID' }
      }
    )
  },
  {
    key: "hand",
    icon: renderIcon(FrontHandOutlined),
    title: 'Hand',
    children: [
      {
        key: "hand-pose/list",
        icon: renderIcon(HandRock),
        title: 'Hand Pose Classify',
        label: h(
          RouterLink,
          {
            to: {
              name: "hand-pose/list"
            }
          },
          {
            default: () => { 'Hand Pose Classify' }
          }
        )
      },
      {
        key: "hand-guesture/list",
        icon: renderIcon(HandTwoFingers),
        title: "Hand Guesture Classify",
        label: h(
          RouterLink,
          {
            to: {
              name: "hand-guesture/list"
            }
          },
          {
            default: () => { 'Hand Guesture Classify' }
          }
        )
      }
    ]
  },
  {
    key: "body",
    icon: renderIcon(BodyOutline),
    title: 'Body',
    children: [
      {
        key: "body-pose",
        icon: renderIcon(SportsKabaddiOutlined),
        title: "Body Pose Classify",
        label: h(
          RouterLink,
          {
            to: {
              name: "body-pose"
            }
          },
          {
            default: () => { 'Body Pose Classify' }
          }
        )
      },
      {
        key: "body-gesture",
        icon: renderIcon(DirectionsRunOutlined),
        title: "Body Gesture Classify",
        label: h(
          RouterLink,
          {
            to: {
              name: "body-gesture"
            }
          },
          {
            default: () => { 'Body Gesture Classify' }
          }
        )
      }
    ]
  },
  {
    key: "about",
    icon: renderIcon(InfoOutlined),
    title: "About",
    label: h(
      RouterLink,
      {
        to: {
          name: "about"
        }
      },
      {
        default: () => { 'About' }
      }
    )
  }
];
