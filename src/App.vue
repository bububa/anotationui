<template>
  <NConfigProvider
    :locale="zhCN"
    :theme="getDarkTheme"
    :theme-overrides="getThemeOverrides"
    :date-locale="dateZhCN"
  >
    <AppProvider>
      <Layout />
    </AppProvider>
  </NConfigProvider>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { zhCN, dateZhCN, darkTheme } from 'naive-ui';
  import { AppProvider } from '@/components/Application';
  import { useDesignSettingStore } from '@/store/modules/designSetting';
  import { Layout } from '@/layout/Layout'
  import { lighten } from '@/utils/index';

  const designStore = useDesignSettingStore();

  /**
   * @type import('naive-ui').GlobalThemeOverrides
   */
  const getThemeOverrides = computed(() => {
    const appTheme = designStore.appTheme;
    const lightenStr = lighten(designStore.appTheme, 6);
    return {
      common: {
        primaryColor: appTheme,
        primaryColorHover: lightenStr,
        primaryColorPressed: lightenStr,
      },
      LoadingBar: {
        colorLoading: appTheme,
      },
    };
  });

  const getDarkTheme = computed(() => (designStore.darkTheme ? darkTheme : undefined));

</script>

<style lang="less">
  @import 'styles/index.less';
</style>
