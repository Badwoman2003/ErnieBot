<template>
  <div class="message-box" :style="{
    '--borderRadius': borderRadius,
    '--bgColor': bgColor,
    '--color': color,
    '--flexDirection': flexDirection,
  }">
    <t-avatar v-if="type === 'bot'" class="message-box_avatar" :image="RobotAvatar" :size="avatarSize"></t-avatar>
    <t-avatar v-else class="message-box_avatar" :size="avatarSize">
      <template #icon>
        <UserIcon />
      </template>
    </t-avatar>
    <div>
      <div ref="markdownContainer" class="message-box_bubble" v-html="parsedContent"></div>
      <div v-if="type === 'bot' && props.followUps && props.followUps.length" class="follow-up-list">
        <t-button v-for="(item, idx) in props.followUps" :key="idx" @click="emit('follow-up', item)" theme="default"
          variant="base" size="small" class="follow-up-btn">
          {{ item }}
        </t-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import RobotAvatar from '@assets/images/robot.png';
import { UserIcon } from 'tdesign-icons-vue-next';
import { computed, ref, onMounted, defineEmits } from 'vue';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.min.css';
import { useAppConfig } from '@/utils/store/app-config';

const props = defineProps<{
  type: 'user' | 'bot';
  content: string;
  followUps?: string[];
}>();

const emit = defineEmits<{
  (e: 'follow-up', followUp: string): void;
}>();

const appConfig = useAppConfig();
const markdownContainer = ref<HTMLDivElement | null>(null);

// 配置marked和highlight.js
marked.use({
  breaks: false,
  gfm: true,
  mangle: false,
  headerIds: false
});

// 解析Markdown内容
const parsedContent = computed(() => {
  if (!props.content || typeof props.content !== 'string') return '';
  return marked.parse(props.content.trim());
});

// 样式计算属性
const borderRadius = computed(() =>
  props.type === 'user' ? '0.8rem 0.8rem 1.6rem 0.8rem' : '0.8rem 0.8rem 0.8rem 1.6rem'
);

const bgColor = computed(() =>
  props.type === 'user' ? 'var(--td-brand-color)' : '#ffffff'
);

const color = computed(() =>
  props.type === 'user' ? '#ffffff' : '#444444'
);

const flexDirection = computed(() =>
  props.type === 'user' ? 'row-reverse' : 'row'
);

const avatarSize = computed(() =>
  appConfig.enableMobileLayout ? 'medium' : 'large'
);

// md高亮渲染
onMounted(() => {
  if (markdownContainer.value) {
    const codeBlocks = markdownContainer.value.querySelectorAll('pre code');
    codeBlocks.forEach((block) => {
      hljs.highlightElement(block as HTMLElement);
    });
  }
});
</script>

<style scoped lang="scss">
.message-box {
  display: flex;
  flex-direction: var(--flexDirection);
  align-items: flex-start;
  gap: 0.8rem;
  width: 100%;
  padding: 0.5rem 1rem;
}

.message-box_avatar {
  flex-shrink: 0;
}

.message-box_bubble {
  padding: 1.2rem;
  flex-shrink: 1;
  // max-width: 80%;
  word-break: break-word;
  color: var(--color);
  background-color: var(--bgColor);
  border-radius: var(--borderRadius);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  &,
  * {
    user-select: text !important;
    -webkit-user-select: text !important;
    /* Safari */
    -moz-user-select: text !important;
    /* Firefox */
    -ms-user-select: text !important;
    /* IE10+ */
  }

  // 代码块样式
  pre {
    margin: 1rem 0;
    border-radius: 6px;
    overflow-x: auto;
    background: #2d2d2d;
    padding: 1rem;
    color: #ccc;

    code {
      font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
      font-size: 0.9rem;
      line-height: 1.5;
      display: block;
      white-space: pre;
      overflow-x: auto;
      padding: 0;
      background: transparent;
    }
  }

  // 行内代码样式
  code:not(pre code) {
    font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
    background: rgba(175, 184, 193, 0.2);
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-size: 0.9em;
    word-break: break-word;
  }

  // 基础Markdown样式
  p {
    margin: 0.5rem 0;
    line-height: 1.6;
  }

  strong {
    font-weight: 600;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0.8rem 0 0.4rem;
    line-height: 1.3;
  }

  blockquote {
    margin: 0.5rem 0;
    padding: 0 1rem;
    border-left: 3px solid #ddd;
    color: #777;
  }
}

.follow-up-list {
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  .follow-up-btn {
    margin-top: 1rem;
    padding: 1.3rem 1rem;
  }
}
</style>