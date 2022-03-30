<template>
  <n-card :bordered="false" class="proCard" :title="`${label.id}: ${label.name}`">
    <template #header-extra>
      <n-button
        text
        @click="reload"
      >
        <template #icon>
          <n-icon>
            <ReloadOutlined/>
          </n-icon>
        </template>
      </n-button>
    </template>
    <n-spin :show="loading">
      <n-grid 
        cols="12 s:4 m:6 l:12 xl:12 xxl:12" 
        responsive="screen" 
        x-gap="4" 
        y-gap="4"
      >
        <n-grid-item
          v-for="item of samples" 
          :key="item.name"
        >
          <Item 
            :label="label" 
            :item="item" 
            @delete="handleRemove"
          />
        </n-grid-item>
      </n-grid>
    </n-spin>
    <template #action>
      <n-pagination 
        :page="pageRef.page" 
        :page-count="pageRef.page_count" 
        :page-size="pageRef.page_size" 
        show-size-picker
        :page-sizes="[10, 20, 30, 40]"
        @update:page="fetchPage"
        @update:page-size="onPageSizeChange"
      />
    </template>
  </n-card>
</template>
<script lang="ts">
  import { ref, defineComponent, watch, onMounted } from 'vue';
  import type { RecordModel, RecordListResponseModel } from '@/api/types/index';
  import Item  from './item.vue'
  import { ReloadOutlined } from '@vicons/antd';
  import { getHandPoseLabelInfo } from '@/api/handpose/labelInfo';
  import { getHandPoseSampleList } from '@/api/handpose/sampleList';
  import { delHandPoseSample } from '@/api/handpose/delSample';

  export default defineComponent({
    name: 'HandPoseInfo',
    components: {
      ReloadOutlined,
      Item,
    },
    props: {
        id: Number,
    },
    setup(props) {
      const listRef = ref(Array<RecordModel>());
      const labelRef = ref({} as RecordModel);
      const loadingRef = ref(false)

      watch(
        () => props.id,
        (labelID: number) => {
          getLabel(labelID)
        },
        {
          immediate: true,
        }
      );

      const pageRef = ref({
        page: 1,
        page_size: 30,
        page_count: 1,
      });

      function setLoading(v: boolean) {
        loadingRef.value = v
      }

      async function reload() {
        pageRef.value.page = 1
        await fetch()
      };

      async function fetchPage(page: number) {
        if (page > pageRef.value.page_count) {
          return
        }
        pageRef.value.page = page
        await fetch()
      }

      async function onPageSizeChange(pageSize: number) {
        pageRef.value.page_size = pageSize
        pageRef.value.page = 1
        await reload()
      }

      async function fetch() {
        setLoading(true)
        try {
          const payload = {
            page: pageRef.value.page,
            page_size: pageRef.value.page_size,
            id: labelRef.value.id
          }
          const res: RecordListResponseModel = await getHandPoseSampleList(payload);
          pageRef.value.page_count = res.page_count || 0;
          listRef.value = res.list || []
        } finally{
          setLoading(false)
        }
      };
    
      async function getLabel (labelID: number) {
        try {
          const res: RecordModel = await getHandPoseLabelInfo(labelID) 
          labelRef.value = res
        }catch{}
      }

      async function handleRemove(record: RecordModel) {
        try {
          await delHandPoseSample(record)
          await fetch()
        }catch{}
      }

      onMounted(async () => {
        await getLabel(props.id as number)
        await reload()
      }) 

      return {
        loading: loadingRef,
        label: labelRef,
        samples: listRef,
        pageRef,
        handleRemove,
        onPageSizeChange,
        reload,
        fetchPage,
      }
    }
  })
</script>
