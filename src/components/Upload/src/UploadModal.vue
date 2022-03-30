<template>
  <basicModal @register="modalRegister" ref="modalRef" class="basicModal">
    <template #default>
      <n-space 
        v-if="showPreview && uploadFiles.length > 0"
        vertical 
        size="large"
        justify="center"
      >
        <img 
          :src="uploadFiles[uploadFiles.length-1].url"
          class="carousel-img"
        />
      </n-space>
      <n-upload 
        :action="uploadUrl"
        :headers="headers"
        accept="image/jpeg,image/png,application/zip"
        :max="maxFileNum"
        :multiple="getMultiple"
        :default-file-list="fileList"
        list-type="image"
        :create-thumbnail-url="createThumbnailUrl"
        :show-remove-button="false"
        @remove="handleRemove"
        @finish="onUploadFinish"
      >
        <n-upload-dragger>
          <div style="margin-bottom: 12px;">
            <n-icon size="48" :depth="3">
              <ImagesOutline />
            </n-icon>
          </div>
          <n-text style="font-size: 16px;">Click or drag to this area to upload files</n-text>
          <n-p depth="3" style="margin: 8px 0 0 0;">
            Please do not upload sensitive data, like bank card, password, secure code etc.
          </n-p>
        </n-upload-dragger>
      </n-upload>
    </template>
  </basicModal>
</template>
<script lang="ts">
import { ref, defineComponent, computed } from 'vue';
import { basicModal, useModal } from '@/components/Modal';
import { ImagesOutline } from '@vicons/ionicons5';
import { useMessage, UploadFileInfo } from 'naive-ui'
export default defineComponent({
  name: 'UploadModal',
  components: { 
    basicModal,
    ImagesOutline
  },
  props: {
      title: String,
      showPreview: Boolean,
  },
  emits: [
    "register",
    "upload:done"
  ],
  setup(props, { emit }) {

    const modalRef: any = ref(null);

    const [modalRegister, { openModal }] = useModal({
      title: props.title || 'Upload Images',
      cancelBtuText: 'Close',
    });

    const message = useMessage();

    const fileListRef = ref()
    const uploadFilesRef = ref(Array<UploadFileInfo>())
    const maxFileNumRef = ref<number | undefined>(undefined)
    const uploadUrlRef = ref<string>('')
    const headersRef = ref<any>(null)

    const showPreview = computed(() => props.showPreview )
    const getMultiple = computed(() => maxFileNumRef.value && maxFileNumRef.value > 1)

    function showModal(uploadUrl: string, maxFileNum: number | undefined, headers: Object | undefined) {
      maxFileNumRef.value = maxFileNum
      uploadUrlRef.value = uploadUrl
      headersRef.value = headers
      uploadFilesRef.value = []
      openModal();
    }

    function onUploadFinish({ file, event}): UploadFileInfo {
        const { status, responseText, response} = event.target as XMLHttpRequest;
        if (status !== 200) {
           message.error(responseText) 
           file.status = 'error'
           return file 
        }
        const data = JSON.parse(response)
        if (data.code !== 0) {
           message.error(data.message) 
           file.status = 'error'
           return file
        }
        const result = data.result
        emit('upload:done', { file: file, result: result })
        uploadFilesRef.value.push(file)
        return file
    }

    function handleRemove({ file, fileList }) {
        console.log(file, fileList)
    }

    function handleReset(values: Recordable) {
      console.log(values);
    }

    function createThumbnailUrl(file: File) {
      return new Promise((resolve, reject) => {
        if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
            reject('')
        }
        const reader = new FileReader();
        reader.addEventListener("load", function () {
          // convert image file to base64 string
          resolve(reader.result);
        }, false);
        reader.addEventListener("error", reject)

        reader.readAsDataURL(file);
      })
      // console.log(file)
    }

    return {
      modalRef,
      modalRegister,
      handleReset,
      showModal,
      getMultiple,
      showPreview,
      maxFileNum: maxFileNumRef,
      uploadUrl: uploadUrlRef,
      headers: headersRef,
      fileList: fileListRef,
      uploadFiles: uploadFilesRef,
      handleRemove,
      onUploadFinish,
      createThumbnailUrl
    };
  },
});
</script>

<style lang="less">
  .n-dialog.basicModal {
    width: 640px;
  }

  .n-dialog.basicModalLight {
    width: 416px;
    padding-top: 26px;
  }
  .carousel-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>
