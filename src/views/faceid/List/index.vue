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
      :request="addFaceIDLabel"
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
  import { classifyFaceIDCamera } from '@/api/faceid/classify';
  import { sampleFaceIDCamera } from '@/api/faceid/sampleCamera';
  import { faceIDSampleImageLink } from '@/api/faceid/sampleImage';
  import { useRouter } from 'vue-router';
  import { trainFaceID } from '@/api/faceid/train';
  import { addFaceIDLabel } from '@/api/faceid/addLabel';
  import { getFaceIDLabelList } from '@/api/faceid/labelList';
  import { updateFaceIDLabel } from '@/api/faceid/updateLabel';
  import { delFaceIDLabel } from '@/api/faceid/delLabel';
  import { resetFaceIDLabel } from '@/api/faceid/resetLabel';

  export default defineComponent({
    name: 'FaceIDList',
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
        return await getFaceIDLabelList({ ...params.value, ...res });
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
        router.push({ name: 'faceid/info', params: { id: record.id } })
      }

      function showUploadImageModal(record: Recordable) {
        const uploadUrl = '/api/faceid/sample/add'
        const headers = {
            'x-label-id': record.id
        }
        uploadModalRef.value.showModal(uploadUrl, 1000, headers ) 
      }

      function showCameraModal(record: Recordable) {
        cameraModalRef.value.showModal({ playAction: () => {sampleFaceIDCamera({id: record.id})}, showPlayBtn: true }) 
      }

      function showClassifyCameraModal() {
        classifyCameraModalRef.value.showModal({ playAction: classifyFaceIDCamera, showPlayBtn: true }) 
      }

      async function handleEdit(e: any) {
        try {
          const params = { id: e.record.id, name: e.value }
          const res = await updateFaceIDLabel(params)
          actionRef.value.updateValue(res.id, e.key, res.name)
        } catch {
          actionRef.value.updateValue(e.index, e.key, e.old)
        }
      }

      async function handleDelete(record: Recordable) {
        try {
          const params = { id: record.id }
          await delFaceIDLabel(params)
          reloadTable()
        } catch {}
      }

      async function handleReset(record: Recordable) {
        try {
          const params = { id: record.id }
          const res = await resetFaceIDLabel(params)
          actionRef.value.updateValue(res.id, "items_count", 0)
        } catch {}
      }

      function handleUploadDone({ file, result }) {
        if (result.item_ids && result.item_ids.length === 0) {
          file.status = 'error'
        }
        const link = faceIDSampleImageLink(result.label_id, result.item_ids[0])
        file.url = link
        const rec: Recordable = actionRef.value.getRecord(result.label_id)
        actionRef.value.updateValue(result.label_id, "items_count", (rec.items_count || 0) + result.item_ids.length)
      }

      function showClassifyImageModal() {
        const uploadUrl = '/api/faceid/classify/image'
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
          await trainFaceID()
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
        addFaceIDLabel,
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
