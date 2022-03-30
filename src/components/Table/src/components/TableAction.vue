<template>
  <div class="tableAction">
    <div class="flex items-center justify-center">
      <template v-for="(action, index) in getActions" :key="`${index}-${action.label}`">
        <n-tooltip trigger="hover" placement="top-end">
          <template #trigger>
            <n-popconfirm v-if="action.popConfirm" 
              :negative-text="action.popConfirm.cancelText" 
              :positive-text="action.popConfirm.okText" 
              :show-icon="action.popConfirm.icon" 
              placement="top-end"
              @positive-click="action.popConfirm.confirm" 
              @negative-click="action.popConfirm.cancel"
            >
              <template v-if="action.popConfirm.icon" #icon>
                <n-icon :color="action.popConfirm.iconColor">
                  <component :is="action.popConfirm.icon" />
                </n-icon>
              </template>
              <template #trigger>
                <n-button v-bind="action" class="mx-2">
                  <template v-if="action.icon" #icon>
                    <n-icon>
                      <component :is="action.icon" />
                    </n-icon>
                  </template>{{ action.label }}
                </n-button>
              </template>
              {{ action.popConfirm.title }}
            </n-popconfirm>
            <n-button v-else v-bind="action" class="mx-2">
              <template v-if="action.icon" #icon>
                <n-icon>
                  <component :is="action.icon" />
                </n-icon>
              </template>{{ action.label }}
            </n-button>
          </template>
          {{ action.tooltip }}
        </n-tooltip>
      </template>
      <n-dropdown
        v-if="dropDownActions && getDropdownList.length"
        trigger="hover"
        :options="getDropdownList"
        @select="select"
      >
        <slot name="more"></slot>
        <n-button v-bind="getMoreProps" class="mx-2" v-if="!$slots.more" icon-placement="right">
          <div class="flex items-center">
            <span>more</span>
            <n-icon size="14" class="ml-1">
              <DownOutlined />
            </n-icon>
          </div>
          <!--          <template #icon>-->
          <!--            -->
          <!--          </template>-->
        </n-button>
      </n-dropdown>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, PropType, computed, toRaw } from 'vue';
  import { ActionItem } from '@/components/Table';
  import { isBoolean, isFunction } from '@/utils/is';
  import { DownOutlined } from '@vicons/antd';

  export default defineComponent({
    name: 'TableAction',
    components: { DownOutlined },
    props: {
      actions: {
        type: Array as PropType<ActionItem[]>,
        default: null,
        required: true,
      },
      dropDownActions: {
        type: Array as PropType<ActionItem[]>,
        default: null,
      },
      style: {
        type: String as PropType<String>,
        default: 'button',
      },
      select: {
        type: Function as PropType<Function>,
        default: () => {},
      },
    },
    setup(props) {

      const actionType =
        props.style === 'button' ? 'default' : props.style === 'text' ? 'primary' : 'default';
      const actionText =
        props.style === 'button' ? undefined : props.style === 'text' ? true : undefined;

      const getMoreProps = computed(() => {
        return {
          text: actionText,
          type: actionType,
          size: 'small',
        };
      });

      const getDropdownList = computed(() => {
        return (toRaw(props.dropDownActions) || [])
          .filter((action) => {
            return isIfShow(action)// hasPermission(action.auth) && isIfShow(action);
          })
          .map((action) => {
            const { popConfirm } = action;
            return {
              size: 'small',
              text: actionText,
              type: actionType,
              ...action,
              ...popConfirm,
              onConfirm: popConfirm?.confirm,
              onCancel: popConfirm?.cancel,
            };
          });
      });

      function isIfShow(action: ActionItem): boolean {
        const ifShow = action.ifShow;

        let isIfShow = true;

        if (isBoolean(ifShow)) {
          isIfShow = ifShow;
        }
        if (isFunction(ifShow)) {
          isIfShow = ifShow(action);
        }
        return isIfShow;
      }

      const getActions = computed(() => {
        return (toRaw(props.actions) || [])
          .filter((action) => {
            return isIfShow(action)// hasPermission(action.auth) && isIfShow(action);
          })
          .map((action) => {
            const { popConfirm } = action;
            //需要展示什么风格，自己修改一下参数
            return {
              size: 'small',
              text: actionText,
              type: actionType,
              ...action,
              ...(popConfirm || {}),
              onConfirm: popConfirm?.confirm,
              onCancel: popConfirm?.cancel,
              enable: !!popConfirm,
            };
          });
      });

      return {
        getActions,
        getDropdownList,
        getMoreProps,
      };
    },
  });
</script>
