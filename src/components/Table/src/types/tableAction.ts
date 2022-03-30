import { NButton } from 'naive-ui';
import { VNode } from 'vue';
import { Fn } from '/#/index';

export interface ActionItem extends NButton.props {
  onClick?: Fn;
  label?: string;
  icon?: ((icon: any) => VNode);
  popConfirm?: PopConfirm;
  disabled?: boolean;
  divider?: boolean;
  // 业务控制是否显示
  ifShow?: boolean | ((action: ActionItem) => boolean);
}

export interface PopConfirm {
  title: string;
  okText?: string;
  cancelText?: string;
  confirm: Fn;
  cancel?: Fn;
  iconColor?: string;
  icon?: ((icon: any) => VNode);
}
