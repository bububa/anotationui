<template>
  <n-card :bordered="false" class="proCard">
    <BasicTable
      :columns="columns"
      :request="loadDataTable"
      :row-key="(row) => row.id"
      ref="actionRef"
      :actionColumn="actionColumn"
      :scroll-x="1090"
      :fetchOnce="true"
      @update:checked-row-keys="onCheckedRow"
      @edit-end="handleEdit"
    >
      <template #tableTitle>
        <n-button type="primary" @click="addLabel">
          <template #icon>
            <n-icon>
              <PlusOutlined />
            </n-icon>
          </template>
          New Label 
        </n-button>
      </template>

      <template #toolbar>
        <n-button 
          type="primary" 
          text
          :loading="training"
          @click="handleTrain"
          class="m-2"
        >
          <template #icon>
            <n-icon>
              <ModelTrainingOutlined />
            </n-icon>
          </template>
          Train Model
        </n-button>
        <n-button 
          type="primary" 
          text
          @click="showClassifyCameraModal"
          class="m-2"
        >
          <template #icon>
            <n-icon>
              <VideoCameraOutlined />
            </n-icon>
          </template>
          Test Model in Video
        </n-button>
      </template>
    </BasicTable>
    <AddLabelForm
      ref="addLabelFormRef"
      :request="addHandGuestureLabel"
      @create:success="handleAddLabelSuccess"
    />
    <CameraModal
      ref="classifyCameraModalRef"
      title="Estimate faces in video camera"
    />
    <CameraModal
      ref="cameraModalRef"
      title="Upload Samples with video camera"
    />
  </n-card>
</template>
<script lang="ts">
  import { h, reactive, ref, defineComponent } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';
  import { columns } from './columns';
  import { AddLabelForm } from '@/components/Form';
  import { CameraModal } from '@/components/Camera';
  import { PlusOutlined, DeleteOutlined, FileImageOutlined, UnorderedListOutlined, VideoCameraOutlined } from '@vicons/antd';
  import { CleaningServicesOutlined, ModelTrainingOutlined } from '@vicons/material';
  import { classifyHandGuestureCamera } from '@/api/handguesture/classify';
  import { sampleHandGuestureCamera } from '@/api/handguesture/sampleCamera';
  import { useRouter } from 'vue-router';
  import { trainHandGuesture } from '@/api/handguesture/train';
  import { addHandGuestureLabel } from '@/api/handguesture/addLabel';
  import { getHandGuestureLabelList } from '@/api/handguesture/labelList';
  import { updateHandGuestureLabel } from '@/api/handguesture/updateLabel';
  import { delHandGuestureLabel } from '@/api/handguesture/delLabel';
  import { resetHandGuestureLabel } from '@/api/handguesture/resetLabel';

  export default defineComponent({
    name: 'HandGuestureList',
    components: {
      ModelTrainingOutlined,
      FileImageOutlined,
      BasicTable,
      AddLabelForm,
      CameraModal,
      PlusOutlined,
      VideoCameraOutlined
    },
    setup() {

      const router = useRouter();
      const addLabelFormRef = ref();
      const actionRef = ref();
      const classifyCameraModalRef = ref();
      const cameraModalRef = ref();
      const training = ref(false);

      const params = ref({
        page_size: 10,
        label: null,
      });

      const actionColumn = reactive({
        width: 220,
        title: 'Operation',
        key: 'action',
        fixed: 'right',
        align: 'right',
        render(record: any) {
          return h(TableAction as any, {
            style: 'button',
            actions: [
              {
                tooltip: 'Samples',
                text: true,
                icon: UnorderedListOutlined,
                onClick: gotoSampleList.bind(null, record),
                type: 'default'
              },
              {
                tooltip: 'Upload Samples with video camera',
                text: true,
                icon: VideoCameraOutlined,
                onClick: showCameraModal.bind(null, record),
                type: 'default'
              },
              {
                tooltip: 'Delete Label',
                icon: DeleteOutlined,
                text: true,
                popConfirm: {
                  title: 'Do you want to delete label: "' + record.name + '"?',
                  okText: 'Yes',
                  cancelText: 'No',
                  confirm: handleDelete.bind(null, record),
                },
                type: 'error',
              },
              {
                tooltip: 'Reset Label Items',
                icon: CleaningServicesOutlined,
                text: true,
                popConfirm: {
                  title: 'Do you want to delete all items in label: "' + record.name + '"?',
                  okText: 'Yes',
                  cancelText: 'No',
                  confirm: handleReset.bind(null, record),
                },
                type: 'error',
              },
            ]
          });
        }
      });

      function addLabel() {
        addLabelFormRef.value.show();
      }

      const loadDataTable = async (res) => {
        return await getHandGuestureLabelList({ ...params.value, ...res });
      };

      function onCheckedRow(rowKeys) {
        console.log(rowKeys);
      }

      function reloadTable() {
        actionRef.value.reload();
      }

      function handleAddLabelSuccess(record: Recordable) {
        actionRef.value.addRecord(record)
        // reloadTable()
      }

      function gotoSampleList(record: Recordable) {
        router.push({ name: 'hand-guesture/info', params: { id: record.id } })
      }

      function showCameraModal(record: Recordable) {
        cameraModalRef.value.showModal({ playAction: () => {sampleHandGuestureCamera({id: record.id})}, showPlayBtn: true }) 
      }

      function showClassifyCameraModal() {
        classifyCameraModalRef.value.showModal({ playAction: classifyHandGuestureCamera, showPlayBtn: true }) 
      }

      async function handleEdit(e: any) {
        try {
          const params = { id: e.record.id, name: e.value }
          const res = await updateHandGuestureLabel(params)
          actionRef.value.updateValue(res.id, e.key, res.name)
        } catch {
          actionRef.value.updateValue(e.index, e.key, e.old)
        }
      }

      async function handleDelete(record: Recordable) {
        try {
          const params = { id: record.id }
          await delHandGuestureLabel(params)
          reloadTable()
        } catch {}
      }

      async function handleReset(record: Recordable) {
        try {
          const params = { id: record.id }
          const res = await resetHandGuestureLabel(params)
          actionRef.value.updateValue(res.id, "items_count", 0)
        } catch {}
      }

      function handleSubmit(values: Recordable) {
        console.log(values);
        reloadTable();
      }

      async function handleTrain() {
        training.value = true
        try {
          await trainHandGuesture()
        } catch {
        } finally {
          training.value = false
        }
      }

      return {
        columns,
        addLabelFormRef,
        cameraModalRef,
        classifyCameraModalRef,
        addHandGuestureLabel,
        actionRef, 
        actionColumn,
        addLabel,
        loadDataTable,
        onCheckedRow,
        reloadTable,
        training,
        handleTrain,
        showClassifyCameraModal,
        handleAddLabelSuccess,
        handleEdit,
        handleDelete,
        handleSubmit,
        handleReset
      }
    }
  })
</script>
