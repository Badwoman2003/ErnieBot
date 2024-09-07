<template>
  <div class="root" ref="rootRef">
    <transition-group name="list" tag="div" class="body">
      <MessageBox v-for="(item, index) in messageList" :key="index" :type="item.type" :content="item.content" />
    </transition-group>
    <QuestionBox @submit="getAnswer" :loading />
    <t-sticky-tool @click="handleStickyToolClick" :offset="stickyToolOffset" :type="stickyToolType" placement="right-bottom">
      <t-sticky-item label="新对话">
        <template #icon>
          <chat-add-icon />
        </template>
      </t-sticky-item>
      <t-sticky-item label="信息">
        <template #icon>
          <info-circle-icon />
        </template>
      </t-sticky-item>
    </t-sticky-tool>
  </div>
</template>

<script setup lang="ts">
import { ChatAddIcon, InfoCircleIcon } from 'tdesign-icons-vue-next';
import { ref, nextTick, computed } from 'vue';

import apis from '@/apis';
import MessageBox from '@/components/MessageBox/MessageBox.vue';
import QuestionBox from '@/components/QuestionBox/QuestionBox.vue';
import interact from '@/utils/interact';
import { useAppConfig } from '@/utils/store/app-config';

interface MessageItem {
  type: 'bot' | 'user';
  content: string;
}

const appConfig = useAppConfig();

const messageList = ref<MessageItem[]>([
  {
    type: 'bot',
    content: '你好，我是你的综测填报小助手，关于综测填报的任何问题都可以咨询我噢！',
  },
]);
const rootRef = ref<HTMLDivElement>();
const loading = ref(false);

const stickyToolType = computed(() => (appConfig.enableMobileLayout ? 'compact' : 'normal'));

const stickyToolOffset = computed(() => (appConfig.enableMobileLayout ? [-70, 55] : [-60, 60]));

// 新对话
function clearMessageList() {
  messageList.value = [];
}

// 信息弹框
function showInfo() {
  interact.dialog({
    body: 'Powered by Vue3 & Vite & cc-devtools.',
    theme: 'info',
    cancelText: null,
  });
}

function handleStickyToolClick(context: any) {
  const { item } = context;
  if (item.label === '新对话') {
    clearMessageList();
    return;
  }
  if (item.label === '信息') {
    showInfo();
  }
}

async function getAnswer(question: string) {
  messageList.value.push({
    type: 'user',
    content: question,
  });
  loading.value = true;
  try {
    const data = await apis.getAnswer(question);
    console.log(data);
    const botReply = data.data.data.content;
    if (botReply && botReply.length > 0) {
      const replyText = botReply[0].data;
      messageList.value.push({
        type: 'bot',
        content: replyText,
      });
    } else {
      messageList.value.push({
        type: 'bot',
        content: 'err',
      });
    }

    // 滚动到底部
    nextTick(() => {
      rootRef.value?.scrollTo(0, rootRef.value?.scrollHeight);
    });
  } catch (err) {
    console.log(err);
    interact.message.error('提问出错，请稍后再试');
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped lang="scss">
.root {
  @include size();
  @include flex(column, flex-start, center);
  @include padding();
  position: relative;
  overflow: hidden;
  background: #f6f6f6;
  scroll-behavior: smooth;
}
.body {
  @include flex(column, flex-start, flex-start);
  @include padding(0 0 7.2rem 0);
  flex: 1 0;
  width: 100%;
  max-width: $pad;
  gap: 1.6rem;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
