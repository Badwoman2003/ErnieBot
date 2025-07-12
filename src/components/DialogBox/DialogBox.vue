<template>
  <div class="page-content" ref="pageContentRef">
    <test-content />
    <!-- 悬浮询问AI按钮 -->
    <transition name="t-fade">
      <t-button v-if="showAskBtn" :style="askBtnStyle" size="small" class="ask-ai-btn" @click="handleAskAI"> 询问AI
      </t-button>
    </transition>
  </div>

  <div class="affix-container">
    <t-affix class="affix" :offset-top="initialTop">
      <t-button theme="primary" size="large" class="t-button" shape="circle" @click="bodyVisible = true">
        <template #default>
          <img :src="RobotWhite" />
        </template>
      </t-button>
      <t-drawer drawerClassName="t-drawer" header="综测填报智能体" :visible="bodyVisible" :onBeforeOpen="createDialog"
        sizeDraggable :onClose="bodyClose" :closeBtn="true" :size="drawerWidth" closeOnOverlayClick>
        <transition-group name="list" tag="div" ref="messageListRef" class="transition-group">
          <MessageBox v-for="(item, index) in messageList" :key="index" :type="item.type" :content="item.content"
            :followUps="item.followUps" @follow-up="getAnswer" />
        </transition-group>
        <template #footer>
          <QuestionBox class="question-box" @submit="getAnswer" :loading />
        </template>
      </t-drawer>
    </t-affix>
  </div>
</template>

<script setup lang="ts">
import RobotWhite from '@assets/images/robot_white.png';
import { ref, nextTick, onMounted, onUnmounted } from 'vue';

import TestContent from './TestContent.vue';

import apis from '@/apis/index';
import MessageBox from '@/components/MessageBox/MessageBox.vue';
import interact from '@/utils/interact';
import debounce from '@/utils/tools/debounce';
import sleep from '@/utils/tools/sleep';
import constants from '@/utils/constants';

// 控制抽屉显示
const bodyVisible = ref(false);
// 控制加载状态
const loading = ref(false);
// 当前会话ID
const conversationId = ref<string | null>(null);
// 是否首次创建会话
const isFirst = ref(true);
// 抽屉底部偏移量
const offsetBottom = 80;
// 消息列表容器ref
const messageListRef = ref<HTMLDivElement | null>(null);
// 抽屉顶部偏移
const initialTop = ref<number>(0);
// 抽屉宽度
const drawerWidth = ref<string>('40%');
// page-content区域ref
const pageContentRef = ref<HTMLElement | null>(null);
// 控制AI划词按钮显示
const showAskBtn = ref(false);
// AI划词按钮样式
const askBtnStyle = ref<Record<string, string>>({});
// 用户当前选中的文本
const selectedText = ref('');

// 消息项类型定义
interface MessageItem {
  type: 'bot' | 'user';
  content: string;
  followUps?: string[];
}

// 消息列表
const messageList = ref<MessageItem[]>([
  {
    type: 'bot',
    content: '你好，我是你的综测填报小助手，关于综测填报的任何问题都可以咨询我噢！',
  },
]);

/**
 * 发送问题并获取AI回答
 * @param question 用户输入的问题
 */
const getAnswer = async (question: string) => {
  // 隐藏上一条bot消息的联想追问
  const lastMsg = messageList.value
    .slice()
    .reverse()
    .find((msg) => msg.type === 'bot');
  if (lastMsg && lastMsg.followUps) {
    lastMsg.followUps = [];
  }

  // 滚动到底部
  nextTick(() => {
    const el = messageListRef.value;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  });

  // 添加用户消息
  messageList.value.push({
    type: 'user',
    content: question,
  });
  loading.value = true;
  try {
    // 获取AI回答
    const { answer, followUps } = await apis.getAnswer(question);
    if (answer && answer.length > 0) {
      messageList.value.push({
        type: 'bot',
        content: answer,
        followUps,
      });
    } else {
      messageList.value.push({
        type: 'bot',
        content: '未获得有效回答，请稍后再试。',
      });
    }
  } catch (err) {
    console.error(err);
    interact.message.error('提问出错，请稍后再试');
  } finally {
    loading.value = false;
    // 滚动到底部
    nextTick(() => {
      const el = messageListRef.value;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    });
  }
};

// 关闭抽屉
const bodyClose = () => {
  bodyVisible.value = false;
};

/**
 * 创建新对话，仅首次触发
 */
const createDialog = async () => {
  if (isFirst.value === true) {
    isFirst.value = false;
    try {
      conversationId.value = await apis.createDialog();
      console.log(`当前会话id: ${conversationId.value}`);
    } catch (err) {
      console.error(err);
    }
  }
};

/**
 * 计算抽屉顶部偏移
 */
const calculateInitialTop = () => {
  const viewportHeight = window.innerHeight;
  initialTop.value = viewportHeight - offsetBottom;
};

/**
 * 监听用户选中文本，判断是否在page-content内
 */
const handleSelectionChange = () => {
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed) {
    showAskBtn.value = false;
    selectedText.value = '';
    return;
  }
  const text = selection.toString().trim();
  if (!text) {
    showAskBtn.value = false;
    selectedText.value = '';
    return;
  }
  // 判断选区是否在page-content内
  const { anchorNode } = selection;
  if (!anchorNode) {
    showAskBtn.value = false;
    selectedText.value = '';
    return;
  }
  let parent: Node | null = anchorNode;
  let isInPageContent = false;
  while (parent) {
    if (parent === pageContentRef.value) {
      isInPageContent = true;
      break;
    }
    parent = parent.parentNode;
  }
  if (!isInPageContent) {
    showAskBtn.value = false;
    selectedText.value = '';
    return;
  }
  selectedText.value = text;
};

/**
 * 鼠标松开时判断是否弹出AI划词按钮，并计算按钮位置
 */
const handleMouseUp = () => {
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed) {
    showAskBtn.value = false;
    return;
  }
  if (!selectedText.value) {
    showAskBtn.value = false;
    return;
  }
  // 获取选区位置
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  // 如果选区太靠上，按钮显示在下方，否则在上方
  let top = rect.top - 36;
  if (rect.top < 60) {
    top = rect.bottom + 12;
  }
  askBtnStyle.value = {
    position: 'fixed',
    left: `${rect.left + rect.width / 2 - 40}px`,
    top: `${top}px`,
    zIndex: '9999',
  };
  showAskBtn.value = true;
};

/**
 * 点击AI划词按钮，打开抽屉并自动提问
 */
const handleAskAI = async () => {
  try {
    showAskBtn.value = false;
    bodyVisible.value = true;
    await createDialog();
    await sleep(600); // 等待抽屉动画
    getAnswer(selectedText.value);
  } catch (err) {
    interact.message.error('提问出错，请稍后再试');
    console.error(err);
  }
};

// 对应断点的抽屉宽度
const calculateDrawerWidth = () => {
  const viewportWidth = window.innerWidth;
  if (viewportWidth < constants.mobileLayoutBreakpoint) {
    drawerWidth.value = '100%';
  } else if (viewportWidth < constants.padLayoutBreakpoint) {
    drawerWidth.value = '80%';
  } else if (viewportWidth < constants.desktopLayoutBreakpoint) {
    drawerWidth.value = '60%';
  } else {
    drawerWidth.value = '40%';
  }
}

// 防抖处理：窗口resize时调整抽屉和affix
const handleResizeAffix = debounce(calculateInitialTop);
const handleResizeDrawer = debounce(calculateDrawerWidth);

// 生命周期：挂载时添加事件监听，卸载时移除
onMounted(() => {
  calculateInitialTop();
  calculateDrawerWidth();

  window.addEventListener('resize', handleResizeAffix);
  window.addEventListener('resize', handleResizeDrawer);
  document.addEventListener('selectionchange', handleSelectionChange);
  document.addEventListener('mouseup', handleMouseUp);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResizeAffix);
  window.removeEventListener('resize', handleResizeDrawer);
  document.removeEventListener('selectionchange', handleSelectionChange);
  document.removeEventListener('mouseup', handleMouseUp);
});
</script>

<style scoped lang="scss">
.t-fade-enter-active,
.t-fade-leave-active {
  transition: opacity 0.3s cubic-bezier(0.38, 0, 0.24, 1);
}

.t-fade-enter-from,
.t-fade-leave-to {
  opacity: 0;
}

.t-fade-enter-to,
.t-fade-leave-from {
  opacity: 1;
}

.affix-container {
  z-index: 3000;
  position: fixed;
  right: 40px;
  bottom: 40px;

  .t-button {
    padding: 6px;
    padding-bottom: 7px;
  }

  .transition-group {
    @include flex(column, flex-start, flex-start);
    flex: 1 0;
    width: 100%;
    gap: 1.6rem;
    overflow-y: auto;

    &::-webkit-scrollbar {
      display: none;
      width: 0;
      height: 0;
    }
  }

  .t-affix {
    z-index: 3000;
  }

  :deep(.t-drawer) {
    z-index: 3100 !important;

    .question-box {
      margin: 0 auto;
    }
  }
}

.ask-ai-btn {
  position: fixed;
  z-index: 9999;
  pointer-events: auto;
  background-color: var(--td-brand-color-6);
  border: 0;
}
</style>
