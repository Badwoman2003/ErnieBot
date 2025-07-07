<template>
    <div>
        <t-button theme="primary" @click="bodyVisible = true">点击打开对话</t-button>
        <t-dialog header="综测填报智能体" :visible="bodyVisible" :onClose="bodyClose" :onConfirm="bodyClose"
            :closeOnOverlayClick=false :confirmOnEnter=true confirmBtn="退出" :cancelBtn=null>

            <transition-group name="list" tag="div" class="transition-group">
                <MessageBox v-for="(item, index) in messageList" :key="index" :type="item.type"
                    :content="item.content" />
            </transition-group>
            <QuestionBox class="question-box" @submit="getAnswer" :loading />

        </t-dialog>
    </div>

</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import apis from '@/apis';
import MessageBox from '@/components/MessageBox/MessageBox.vue';
import interact from '@/utils/interact';

const bodyVisible = ref(false);
const loading = ref(false);
const rootRef = ref<HTMLDivElement>();

interface MessageItem {
    type: 'bot' | 'user';
    content: string;
}

const messageList = ref<MessageItem[]>([
    {
        type: 'bot',
        content: '你好，我是你的综测填报小助手，关于综测填报的任何问题都可以咨询我噢！',
    },
]);

async function getAnswer(question: string) {
    messageList.value.push({
        type: 'user',
        content: question,
    });
    loading.value = true;
    try {
        const answer = await apis.getAnswer(question);
        console.log('获得回答：' + answer);
        // 滚动到底部
        nextTick(() => {
            rootRef.value?.scrollTo(0, rootRef.value?.scrollHeight);
        });
    } catch (err) {
        console.error(err);
        interact.message.error('提问出错，请稍后再试');
    } finally {
        loading.value = false;
    }
}

const bodyClose = () => {
    bodyVisible.value = false;
};

</script>

<style scoped lang="scss">
.transition-group {
    @include flex(column, flex-start, flex-start);
    @include padding(0 0 7.2rem 0);
    flex: 1 0;
    width: 100%;
    max-width: $pad;
    gap: 1.6rem;
    overflow-y: auto;
    max-height: 400px;
    overflow-y: auto;

    &::-webkit-scrollbar {
        display: none;
        width: 0;
        height: 0;
    }
}

.question-box {
    margin-top: 20px;
}
</style>