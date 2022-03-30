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
        <n-button 
          type="primary" 
          text
          @click="showClassifyImageModal"
          class="m-2"
        >
          <template #icon>
            <n-icon>
              <FileImageOutlined />
            </n-icon>
          </template>
          Test Image Model
        </n-button>
      </template>
    </BasicTable>
    <AddLabelForm
      ref="addLabelFormRef"
      :request="addHandPoseLabel"
      @create:success="handleAddLabelSuccess"
    />
    <UploadModal
      ref="classifyImageModalRef"
      title="Upload Image for Classification Test"
      :show-preview="true"
      @upload:done="handleClassifyImageDone"
    />
    <UploadModal
      ref="uploadModalRef"
      title="Upload Sample Images"
      @upload:done="handleUploadDone"
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
  import { UploadModal } from '@/components/Upload';
  import { CameraModal } from '@/components/Camera';
  import { PlusOutlined, DeleteOutlined, FileImageOutlined, UnorderedListOutlined, VideoCameraOutlined } from '@vicons/antd';
  import { CleaningServicesOutlined, ModelTrainingOutlined } from '@vicons/material';
  import { classifyHandPoseCamera } from '@/api/handpose/classify';
  import { sampleHandPoseCamera } from '@/api/handpose/sampleCamera';
  import { handPoseSampleImageLink } from '@/api/handpose/sampleImage';
  import { useRouter } from 'vue-router';
  import { trainHandPose } from '@/api/handpose/train';
  import { addHandPoseLabel } from '@/api/handpose/addLabel';
  import { getHandPoseLabelList } from '@/api/handpose/labelList';
  import { updateHandPoseLabel } from '@/api/handpose/updateLabel';
  import { delHandPoseLabel } from '@/api/handpose/delLabel';
  import { resetHandPoseLabel } from '@/api/handpose/resetLabel';

  export default defineComponent({
    name: 'HandPoseList',
    components: {
      ModelTrainingOutlined,
      FileImageOutlined,
      BasicTable,
      AddLabelForm,
      UploadModal,
      CameraModal,
      PlusOutlined,
      VideoCameraOutlined
    },
    setup() {

      const router = useRouter();
      const addLabelFormRef = ref();
      const actionRef = ref();
      const uploadModalRef = ref();
      const classifyImageModalRef = ref();
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
                tooltip: 'Upload Image Samples',
                text: true,
                icon: FileImageOutlined,
                onClick: showUploadImageModal.bind(null, record),
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
        return await getHandPoseLabelList({ ...params.value, ...res });
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
        router.push({ name: 'hand-pose/info', params: { id: record.id } })
      }

      function showUploadImageModal(record: Recordable) {
        const uploadUrl = '/api/handpose/sample/add'
        const headers = {
            'x-label-id': record.id
        }
        uploadModalRef.value.showModal(uploadUrl, 1000, headers ) 
      }

      function showCameraModal(record: Recordable) {
        cameraModalRef.value.showModal({ playAction: () => {sampleHandPoseCamera({id: record.id})}, showPlayBtn: true }) 
      }

      function showClassifyCameraModal() {
        classifyCameraModalRef.value.showModal({ playAction: classifyHandPoseCamera, showPlayBtn: true }) 
      }

      async function handleEdit(e: any) {
        try {
          const params = { id: e.record.id, name: e.value }
          const res = await updateHandPoseLabel(params)
          actionRef.value.updateValue(res.id, e.key, res.name)
        } catch {
          actionRef.value.updateValue(e.index, e.key, e.old)
        }
      }

      async function handleDelete(record: Recordable) {
        try {
          const params = { id: record.id }
          await delHandPoseLabel(params)
          reloadTable()
        } catch {}
      }

      async function handleReset(record: Recordable) {
        try {
          const params = { id: record.id }
          const res = await resetHandPoseLabel(params)
          actionRef.value.updateValue(res.id, "items_count", 0)
        } catch {}
      }

      function handleUploadDone({ file, result }) {
        if (result.item_ids && result.item_ids.length === 0) {
          file.status = 'error'
        }
        const link = handPoseSampleImageLink(result.label_id, result.item_ids[0])
        file.url = link
        const rec: Recordable = actionRef.value.getRecord(result.label_id)
        actionRef.value.updateValue(result.label_id, "items_count", (rec.items_count || 0) + result.item_ids.length)
      }

      function showClassifyImageModal() {
        const uploadUrl = '/api/handpose/classify/image'
        classifyImageModalRef.value.showModal(uploadUrl, undefined, null) 
      }

      function handleClassifyImageDone({ file, result }) {
        if (!result.image) {
          file.status = 'error'
          return
        }
        file.url = result.image
      }

      function handleSubmit(values: Recordable) {
        console.log(values);
        reloadTable();
      }

      async function handleTrain() {
        training.value = true
        try {
          await trainHandPose()
        } catch {
        } finally {
          training.value = false
        }
      }

      return {
        columns,
        addLabelFormRef,
        uploadModalRef,
        cameraModalRef,
        classifyImageModalRef,
        classifyCameraModalRef,
        addHandPoseLabel,
        actionRef, 
        actionColumn,
        addLabel,
        loadDataTable,
        onCheckedRow,
        reloadTable,
        training,
        handleTrain,
        showClassifyImageModal,
        showClassifyCameraModal,
        handleAddLabelSuccess,
        handleEdit,
        handleDelete,
        handleSubmit,
        handleReset,
        handleUploadDone,
        handleClassifyImageDone
      }
    }
  })
</script>
