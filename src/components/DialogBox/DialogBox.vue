<template>
    <div class="affix-container">
        <t-affix class="affix" :offset-top="initialTop">
            <t-button theme="primary" size="large" class="t-button" shape="circle" @click="bodyVisible = true">
                <template #default>
                    <img :src="RobotWhite" />
                </template>
            </t-button>
            <t-drawer className="t-drawer" header="综测填报智能体" :size="drawerSize" :visible="bodyVisible"
                :onBeforeOpen="createDialog" sizeDraggable :onClose="bodyClose" :closeBtn="true" closeOnOverlayClick>
                <transition-group name="list" tag="div" ref="messageListRef" class="transition-group">
                    <MessageBox v-for="(item, index) in messageList" :key="index" :type="item.type"
                        :content="item.content" :followUps="item.followUps" @follow-up="getAnswer" />
                </transition-group>
                <template #footer>
                    <QuestionBox class="question-box" @submit="getAnswer" :loading />
                </template>
            </t-drawer>
        </t-affix>
    </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue';
import RobotWhite from '@assets/images/robot_white.png';

import apis from '@/apis/index';
import MessageBox from '@/components/MessageBox/MessageBox.vue';
import interact from '@/utils/interact';

const bodyVisible = ref(false);
const loading = ref(false);
const conversationId = ref<string | null>(null);
const isFirst = ref(true);
const offsetBottom = 80;
const messageListRef = ref<HTMLDivElement | null>(null);
const initialTop = ref<number>(0);
const drawerSize = ref<string>('40%');

interface MessageItem {
    type: 'bot' | 'user';
    content: string;
    followUps?: string[];
}

const messageList = ref<MessageItem[]>([
    {
        type: 'bot',
        content: '你好，我是你的综测填报小助手，关于综测填报的任何问题都可以咨询我噢！',
    },
]);

const getAnswer = async (question: string) => {
    // 滚动到底部
    nextTick(() => {
        const el = messageListRef.value;
        if (el) {
            el.scrollTop = el.scrollHeight;
        }
    });
    messageList.value.push({
        type: 'user',
        content: question,
    });
    loading.value = true;
    try {
        const { answer, followUps } = await apis.getAnswer(question);
        if (answer && answer.length > 0) {
            messageList.value.push({
                type: 'bot',
                content: answer,
                followUps
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

const bodyClose = () => {
    bodyVisible.value = false;
};

const createDialog = async () => {
    if (isFirst.value === true) {
        isFirst.value = false;
        try {
            conversationId.value = await apis.createDialog();
            console.log('当前会话id: ' + conversationId.value);
        } catch (err) {
            console.error(err);
        }
    }
};

const calcDrawerSize = () => {
    const viewportWidth = window.innerWidth;
    if (viewportWidth > 850) drawerSize.value = '40%';
    else if (viewportWidth > 600 && viewportWidth < 850) drawerSize.value = '50%';
    else if (viewportWidth > 500 && viewportWidth < 600) drawerSize.value = '60%';
    else if (viewportWidth > 400 && viewportWidth < 500) drawerSize.value = '70%';
    else if (viewportWidth < 400) drawerSize.value = '100%';
    else null;
}

// 计算初始/更新offset-top
const calculateInitialTop = () => {
    const viewportHeight = window.innerHeight; // 获取当前窗口高度
    initialTop.value = viewportHeight - offsetBottom; // 动态计算顶部偏移
};

// 定义防抖函数（避免频繁触发计算）
const debounce = (fn: () => void, delay = 100) => {
    let timer: NodeJS.Timeout | null = null;
    return () => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(fn, delay);
    };
};

onMounted(() => {
    calculateInitialTop();
    calcDrawerSize();
    const handleResizeAffix = debounce(calculateInitialTop); // 防抖处理
    const handleResizeDrow = debounce(calcDrawerSize);
    window.addEventListener('resize', handleResizeAffix); // 监听窗口变化
    window.addEventListener('resize', handleResizeDrow);

    // 组件卸载时移除监听（避免内存泄漏）
    onUnmounted(() => {
        window.removeEventListener('resize', handleResizeAffix);
        window.removeEventListener('resize', handleResizeDrow);
    });
});
</script>

<style scoped lang="scss">
.affix-container {
    position: fixed;
    right: 40px;

    .t-button {
        padding: 6px;
        padding-bottom: 7px;
    }

    .transition-group {
        @include flex(column, flex-start, flex-start);
        @include padding(0 0 10rem 0);
        flex: 1 0;
        width: 100%;
        // max-width: $pad;
        gap: 1.6rem;
        overflow-y: auto;

        &::-webkit-scrollbar {
            display: none;
            width: 0;
            height: 0;
        }
    }

    .t-drawer {
        min-width: 20vw !important;

        .question-box {
            margin: 0 auto;
        }
    }

}
</style>