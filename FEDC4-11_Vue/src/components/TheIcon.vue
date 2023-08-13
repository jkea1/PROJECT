<template>
  <div class="the-icon">
    <span
      class="material-symbols-outlined"
      style="font-size: 30px">
      <slot></slot>
    </span>
  </div>
</template>

<style scoped lang="scss">
.the-icon {
  color: black;
  width: 30px;
  height: 30px;
  // border: 1px solid var(--border-color);
  border-radius: 50%;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  // background-color: dodgerblue;
}
</style>
