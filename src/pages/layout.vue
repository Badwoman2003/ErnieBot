<template>
  <div class="root-layout">
    <div class="root-layout_header">{{ constants.appTitle }}</div>
    <div class="root-layout_body">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import constants from '@/utils/constants';

console.log(constants);
</script>

<style scoped lang="scss">
.root-layout {
  @include flex(column, flex-start, flex-start);
  @include size();

  &_header {
    @include flex(row, center, center);
    position: relative;
    z-index: 1;
    width: 100%;
    height: 5.6rem;
    flex-shrink: 0;
    font-size: 2rem;
    letter-spacing: 1px;
    background: #f6f6f6;
    box-shadow: 0 0 0.5rem 0 rgba(0, 0, 0, 0.1);
    color: var(--brand-main);
  }
  &_body {
    flex: 1 0;
    width: 100%;
    overflow: hidden;
  }
}
</style>
