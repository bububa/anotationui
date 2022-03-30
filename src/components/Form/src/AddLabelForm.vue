<template>
  <n-modal v-model:show="showModal" :show-icon="false" preset="dialog" :title="formTitle">
    <n-form
      :model="formParams"
      :rules="rules"
      ref="formRef"
      label-placement="left"
      :label-width="80"
      class="py-4"
    >
      <n-form-item label="Label" path="name">
        <n-input placeholder="Please input label" v-model:value="formParams.name" />
      </n-form-item>
    </n-form>

    <template #action>
      <n-space>
        <n-button @click="hide">cancel</n-button>
        <n-button type="info" :loading="formBtnLoading" @click="confirmForm">confirm</n-button>
      </n-space>
    </template>
  </n-modal>
</template>
<script lang="ts">
  import { reactive, ref, defineComponent } from 'vue';
  import type { ValidateError } from 'async-validator'
  import { addFaceIDLabel } from '@/api/faceid/addLabel';

  export default defineComponent({
    name: 'AddLabelForm',
    props:{ 
      value: String,
      request: {
        type: Function as PropType<(...arg: any[]) => Promise<any>>,
        default: null,
        required: true,
      },
    },
    emits: [
      'create:success',
      'create:error'
    ],
    setup(props, { emit }) {

      const formTitle = "Create a new Label";

      const formRef: any = ref(null);
      const showModal = ref(false);
      const formBtnLoading = ref(false);
      const formParams = reactive({
        name: props.value 
      });

      const rules = {
        name: {
          required: true,
          trigger: ['blur', 'input'],
          message: 'Please input label name',
        }
      };

      function confirmForm(e: Event) {
        e.preventDefault();
        formRef.value.validate((errors: ValidateError[][]) => {
          if (errors) {
            return
          }
          addLabel(formParams.name)
        });
      }

      function setLoading(loading: boolean) {
          formBtnLoading.value = loading
      }

      async function addLabel(name: string | undefined ) {
        if (!name) {
          return
        }
        try {
          setLoading(true)
          const params = { name: name }
          // const res = await addFaceIDLabel(params)
          const res = await props.request(params)
          emit('create:success', res )
          hide();
        } catch(err) {
          emit('create:error', err)
        } finally {
          setLoading(false)
        }
      }

      function show() {
        showModal.value = true
        formParams.name = ''
      }

      function hide() {
        showModal.value = false
        formParams.name = ''
      }

      return {
        formRef,
        formTitle,
        showModal,
        formBtnLoading,
        formParams,
        rules,
        confirmForm,
        show,
        hide
     } 
    }

  })

</script>


