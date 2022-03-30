import { computed } from 'vue';
import { useProjectSettingStore } from '@/store/modules/projectSetting';

export function useProjectSetting() {
  const projectStore = useProjectSettingStore();

  const getNavTheme = computed(() => projectStore.navTheme);

  const getHeaderSetting = computed(() => projectStore.headerSetting);

  const getCrumbsSetting = computed(() => projectStore.crumbsSetting);

  const getMenuSetting = computed(() => projectStore.menuSetting);

  const getShowFooter = computed(() => projectStore.showFooter);

  const getIsPageAnimate = computed(() => projectStore.isPageAnimate);

  const getPageAnimateType = computed(() => projectStore.pageAnimateType);

  return {
    getNavTheme,
    getHeaderSetting,
    getCrumbsSetting,
    getShowFooter,
    getIsPageAnimate,
    getPageAnimateType,
    getMenuSetting
  };
}
