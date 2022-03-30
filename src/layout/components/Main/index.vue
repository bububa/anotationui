<template>
  <RouterView>
    <template #default="{ Component, route }">
      <transition :name="getTransitionName" mode="out-in" appear>
        <keep-alive v-if="keepAliveComponents" :include="keepAliveComponents">
          <component :is="Component" :key="route.fullPath" />
        </keep-alive>
        <component v-else :is="Component" :key="route.fullPath" />
      </transition>
    </template>
  </RouterView>
</template>

<script>
  import { defineComponent, computed, unref } from 'vue';
  import { useProjectSetting } from '@/hooks/setting/useProjectSetting';
  import { keepAliveComponents } from '@/router/index';

  export default defineComponent({
    name: 'MainView',
    components: {},
    props: {
      notNeedKey: {
        type: Boolean,
        default: false,
      },
      animate: {
        type: Boolean,
        default: true,
      },
    },
    setup() {
      const { getIsPageAnimate, getPageAnimateType } = useProjectSetting();

      const getTransitionName = computed(() => {
        return unref(getIsPageAnimate) ? unref(getPageAnimateType) : '';
      });

      return {
        getTransitionName,
        keepAliveComponents
      };
    },
  });
</script>

<style lang="less" scoped></style>
