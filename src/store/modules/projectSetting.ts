import { defineStore } from 'pinia';
import { store } from '@/store';
import projectSetting from '@/settings/projectSetting';
import type { IheaderSetting, IcrumbsSetting, ImenuSetting } from '/#/config';

const {
  navTheme,
  headerSetting,
  showFooter,
  crumbsSetting,
  menuSetting,
  isPageAnimate,
  pageAnimateType,
} = projectSetting;

interface ProjectSettingState {
  navTheme: string; //导航风格
  headerSetting: IheaderSetting; //顶部设置
  showFooter: boolean; //页脚
  isPageAnimate: boolean; //是否开启路由动画
  pageAnimateType: string; //路由动画类型
  crumbsSetting: IcrumbsSetting,
  menuSetting: ImenuSetting
}

export const useProjectSettingStore = defineStore({
  id: 'app-project-setting',
  state: (): ProjectSettingState => ({
    navTheme,
    headerSetting,
    showFooter,
    isPageAnimate,
    pageAnimateType,
    crumbsSetting,
    menuSetting
  }),
  getters: {
    getNavTheme(): string {
      return this.navTheme;
    },
    getHeaderSetting(): object {
      return this.headerSetting;
    },
    getShowFooter(): boolean {
      return this.showFooter;
    },
    getIsPageAnimate(): boolean {
      return this.isPageAnimate;
    },
    getPageAnimateType(): string {
      return this.pageAnimateType;
    },
    getCrumbsSetting(): IcrumbsSetting {
      return this.crumbsSetting;
    },
    getMenuSetting(): ImenuSetting {
      return this.menuSetting;
    }
  },
  actions: {
    setNavTheme(value: string): void {
      this.navTheme = value;
    },
  },
});

// Need to be used outside the setup
export function useProjectSettingStoreWithOut() {
  return useProjectSettingStore(store);
}
