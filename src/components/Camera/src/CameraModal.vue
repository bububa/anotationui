<template>
  <basicModal @register="modalRegister" ref="modalRef" class="basicModal" @on-close="onCloseModal">
    <template #default>
      <n-space 
        align="center" 
        size="large"
        vertical
      >
        <n-image 
          width="640"
          height="480"
          object-fit="contain"
          :show-toolbar="false"
          :src="streamLink"
        />
        <n-button
          v-if="showPlayBtnRef && isCountingdown"
          circle
          size="large"
          :color="playBtnColor"
          @click="handlePlayToggle"
        >
          {{ countdownNum }}
        </n-button>
        <n-button
          v-else-if="showPlayBtnRef"
          circle
          size="large"
          :color="playBtnColor"
          @click="handlePlayToggle"
        >
          <template #icon>
            <n-icon>
              <component :is="playBtn"/>
            </n-icon>
          </template>
        </n-button>
      </n-space>
    </template>
  </basicModal>
</template>
<script lang="ts">
import { ref, defineComponent, computed, Ref } from 'vue';
import { basicModal, useModal } from '@/components/Modal';
import { cameraStreamLink } from '@/api/camera/stream';
import { cameraClose } from '@/api/camera/close';
import { cameraReset } from '@/api/camera/reset';
import { PlayArrowSharp, PauseSharp } from '@vicons/material';
import { Fn } from '/#/index';
export default defineComponent({
  name: 'CameraModal',
  components: { 
    basicModal
  },
  props: {
      title: String,
      delay: Number 
  },
  emits: [
    "register"
  ],
  setup(props) {

    const modalRef: any = ref(null);
    const showPlayBtnRef: Ref<boolean> = ref(false);
    const isPlaying: Ref<boolean> = ref(false);
    const countdownNum: Ref<number> = ref(0);

    const playActionRef: Ref<Fn | null> = ref(null);

    const streamLink = computed((): string => { 
      return cameraStreamLink(props.delay); 
    })

    const isCountingdown = computed((): boolean => {
      return isPlaying.value && countdownNum.value > 0
    })

    const playBtn = computed(() => {
      return isPlaying.value ? PauseSharp : PlayArrowSharp
    })

    const playBtnColor = computed((): string => {
      return isPlaying.value ? "red" : "green" 
    })

    const [modalRegister, { openModal }] = useModal({
      title: props.title || 'Video Camera',
      width: 704,
      cancelBtuText: 'Close',
    });

    async function showModal({ playAction, showPlayBtn }) {
      playActionRef.value = playAction
      showPlayBtnRef.value = showPlayBtn ? true : false
      isPlaying.value = false
      openModal();
    }

    async function onCloseModal() {
      try {
        await cameraClose()
      } catch{}
    }

    function countdownPlay(init:boolean) {
      if (init) {
        isPlaying.value = true
        countdownNum.value = 3
      }
      return new Promise((resove, _) => {
        setTimeout(() => {
          countdownNum.value --
          if (countdownNum.value <= 0) {
            resove(countdownNum)
            if (playActionRef.value) {
              playActionRef.value() 
            }
            return
          }
          countdownPlay(false)
        }, 1000)
      })
    }

    async function handlePlayToggle() {
      try {
        if (isPlaying.value) {
          await cameraReset()
          isPlaying.value = false
        } else if (playActionRef.value){
          await countdownPlay(true)
        }
      } catch(err) {console.log(err)}
    }

    return {
      modalRef,
      modalRegister,
      showModal,
      onCloseModal,
      streamLink,
      showPlayBtnRef,
      playBtn,
      playBtnColor,
      isCountingdown,
      countdownNum,
      handlePlayToggle,
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
</style>
