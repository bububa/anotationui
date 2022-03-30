<template>
  <n-card 
    hoverable
    size="small"
  >
    <template #cover>
      <img :src="handGuestureSampleImageLink(label.id, item.id)">
    </template>
    <n-ellipsis style="max-width: 100%;">
      {{ item.name }}
    </n-ellipsis>
    <template #action>
      <n-space justify="center">
        <n-popconfirm 
          negative-text="No" 
          positive-text="Yes" 
          @positive-click="handleRemove(item)" 
        >
          <template #icon>
            <n-icon color="error">
              <AlertOutlined />
            </n-icon>
          </template>
          <template #trigger>
            <n-button
              size="small"
              type="error"
              circle
            >
              <template #icon>
                <n-icon>
                  <DeleteOutlined />
                </n-icon>
              </template>
            </n-button>
          </template>
          Do you want to delete this label? 
        </n-popconfirm>
      </n-space>
    </template>
  </n-card>
</template>
<script lang="ts">
import { ref, defineComponent } from 'vue';
import { DeleteOutlined, AlertOutlined } from '@vicons/antd';
import { handGuestureSampleImageLink } from '@/api/handguesture/sampleImage';
export default defineComponent({
  name: 'HandGuestureInfoItem',
  components: {
    DeleteOutlined,
    AlertOutlined,
  },
  props: {
    label: {
      type: Object,
      required: true
    },
    item: {
      type: Object,
      required: true
    }
  },
  emits: [
    'delete'
  ],
  setup(props, { emit }) {
    const labelRef = ref(props.label);
    const itemRef = ref(props.item);

    function handleRemove() {
      emit('delete', { label_id: labelRef.value.id, sample_id: itemRef.value.id })
    }

    return {
      label: labelRef,
      item: itemRef,
      handGuestureSampleImageLink,
      handleRemove,
    }
  }
})
</script>
