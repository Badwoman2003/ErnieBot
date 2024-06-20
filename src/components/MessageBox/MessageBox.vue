<template>
  <div
    class="message-box"
    :style="{
      '--borderRadius': borderRadius,
      '--bgColor': bgColor,
      '--color': color,
      '--flexDirection': flexDirection,
    }"
  >
    <t-avatar
      v-if="type === 'bot'"
      class="message-box_avatar"
      :image="RobotAvatar"
      :size="avatarSize"
    ></t-avatar>
    <t-avatar v-else class="message-box_avatar" :size="avatarSize">
      <template #icon>
        <UserIcon />
      </template>
    </t-avatar>
    <div class="message-box_bubble">
      {{ content }}
    </div>
  </div>
</template>

<script setup lang="ts">
import RobotAvatar from '@assets/images/robot.png';
import { UserIcon } from 'tdesign-icons-vue-next';
import { computed } from 'vue';

import { useAppConfig } from '@/utils/store/app-config';

const props = defineProps<{
  type: 'user' | 'bot';
  content: string;
}>();

const appConfig = useAppConfig();

const borderRadius = computed(() => {
  if (props.type === 'user') {
    return '0.8rem 0.8rem 1.6rem 0.8rem';
  }
  return '0.8rem 0.8rem 0.8rem 1.6rem';
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

const flexDirection = computed(() => {
  if (props.type === 'user') {
    return 'row-reverse';
  }
  return 'row';
});

const avatarSize = computed(() =>
  appConfig.enableMobileLayout ? 'medium' : 'large',
);
</script>

<style scoped lang="scss">
.message-box {
  @include flex(var(--flexDirection), flex-start, center);
  @include size(100%, fit-content);
  flex-shrink: 0;
  gap: 0.8rem;

  &_avatar {
    flex-shrink: 0;
    position: relative;
    z-index: 0;
  }

  &_bubble {
    @include padding(1.2rem);
    flex-shrink: 0;
    max-width: 80%;
    word-break: break-all;
    white-space: pre-wrap;
    color: var(--color);
    background-color: var(--bgColor);
    border-radius: var(--borderRadius);
  }
}
</style>
