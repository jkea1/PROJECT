<script setup defer lang="ts">
import ModalItem from '../components/ModalItem.vue'
import ModalItemSkeleton from '../components/ModalItemSkeleton.vue'
import { useRouter } from 'vue-router'
import TheBtn from '../components/TheBtn.vue'

const router = useRouter()
function offModal() {
  router.push('/')
}
</script>

<template>
  <div class="modal">
    <div
      class="background"
      @click="offModal"></div>
    <div class="contents">
      <div class="btn-area">
        <TheBtn
          @close="offModal"
          class="close-btn"
          ><span class="material-symbols-outlined"> close </span></TheBtn
        >
      </div>
      <Suspense>
        <template #fallback>
          <ModalItemSkeleton />
        </template>
        <template #default>
          <ModalItem />
        </template>
      </Suspense>
    </div>
  </div>
</template>

<style lang="scss">
.modal {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9;
  display: flex;
  justify-content: center;
  align-items: center;
  .background {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(#000, 0.7);
  }

  .contents {
    width: 100%;
    max-width: 700px;
    min-height: 300px;
    max-height: calc(100vh - 40px);
    overflow: auto;
    border-radius: 6px;
    background-color: #fff;
    position: relative;
    .btn-area {
      .close-btn {
        .material-symbols-outlined {
        }
      }
    }
  }
}
</style>
