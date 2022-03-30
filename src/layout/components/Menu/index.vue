<template>
  <NMenu
    :options="menus"
    :inverted="inverted"
    :collapsed="collapsed"
    :collapsed-width="64"
    :collapsed-icon-size="20"
    :indent="24"
    :expanded-keys="openKeys"
    :value="getSelectedKeys"
    @update:value="clickMenuItem"
    @update:expanded-keys="menuExpanded"
  />
</template>

<script lang="ts">
  import { defineComponent, ref, reactive, computed, watch, toRefs, unref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { MenuList } from '@/settings/menusSetting';
  import { useProjectSettingStore } from '@/store/modules/projectSetting';

  export default defineComponent({
    name: 'Menu',
    components: {},
    props: {
      collapsed: {
        // 侧边栏菜单是否收起
        type: Boolean,
      }
    },
    emits: ['update:collapsed'],
    setup() {
      // 当前路由
      const currentRoute = useRoute();
      const router = useRouter();
      const settingStore = useProjectSettingStore();
      const menus = ref(MenuList);
      console.log(menus)
      const selectedKeys = ref<string>(currentRoute.name as string);

      // 获取当前打开的子菜单
      const matched = currentRoute.matched;

      const getOpenKeys = matched && matched.length ? matched.map((item) => item.name) : [];

      const state = reactive({
        openKeys: getOpenKeys,
      });

      const inverted = computed(() => {
        return ['dark', 'header-dark'].includes(settingStore.navTheme);
      });

      // 监听菜单收缩状态
      // watch(
      //   () => props.collapsed,
      //   (newVal) => {
      //   }
      // );

      // 跟随页面路由变化，切换菜单选中状态
      watch(
        () => currentRoute.fullPath,
        () => {
          const matched = currentRoute.matched;
          state.openKeys = matched.map((item) => item.name);
          const activeMenu: string = (currentRoute.meta?.activeMenu as string) || '';
          selectedKeys.value = activeMenu ? (activeMenu as string) : (currentRoute.name as string);
        }
      );

      const getSelectedKeys = computed(() => {
        return unref(selectedKeys);
      });

      // 点击菜单
      function clickMenuItem(key: string) {
        if (/http(s)?:/.test(key)) {
          window.open(key);
        } else {
          router.push({ name: key });
        }
      }

      //展开菜单
      function menuExpanded(openKeys: string[]) {
        if (!openKeys) return;
        const latestOpenKey = openKeys.find((key) => state.openKeys.indexOf(key) === -1);
        const isExistChildren = findChildrenLen(latestOpenKey as string);
        state.openKeys = isExistChildren ? (latestOpenKey ? [latestOpenKey] : []) : openKeys;
      }

      //查找是否存在子路由
      function findChildrenLen(key: string) {
        if (!key) return false;
        const subRouteChildren: string[] = [];
        for (const { children, key } of unref(menus)) {
          if (children && children.length) {
            subRouteChildren.push(key as string);
          }
        }
        return subRouteChildren.includes(key);
      }

      return {
        ...toRefs(state),
        inverted,
        menus,
        selectedKeys,
        getSelectedKeys,
        clickMenuItem,
        menuExpanded,
      };
    },
  });
</script>
