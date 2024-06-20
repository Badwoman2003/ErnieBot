<template>
  <div
    class="message-box"
    :style="{
      '--borderRadius': borderRadius,
      '--justifyContent': justifyContent,
      '--bgColor': bgColor,
      '--color': color,
    }"
  >
    <div class="message-box_bubble">
      {{ content }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  type: 'user' | 'bot';
  content: string;
}>();

const borderRadius = computed(() => {
  if (props.type === 'user') {
    return '0.8rem 0.8rem 1.6rem 0.8rem';
  }
  return '0.8rem 0.8rem 0.8rem 1.6rem';
});

const justifyContent = computed(() => {
  if (props.type === 'user') {
    return 'flex-end';
  }
  return 'flex-start';
});

const bgColor = computed(() => {
  if (props.type === 'user') {
    return 'var(--td-brand-color)';
  }
  return '#ffffff';
});

const color = computed(() => {
  if (props.type === 'user') {
    return '#ffffff';
  }
  return '#444444';
});
</script>

<style scoped lang="scss">
.message-box {
  @include flex(row, var(--justifyContent), center);
  @include size(100%, fit-content);
  flex-shrink: 0;

  &_bubble {
    @include padding(1.2rem);
    max-width: 90%;
    word-break: break-all;
    white-space: pre-wrap;
    color: var(--color);
    background-color: var(--bgColor);
    border-radius: var(--borderRadius);
  }
}
</style>
