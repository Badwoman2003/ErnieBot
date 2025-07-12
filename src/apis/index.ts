import axios from 'axios';

import constants from '@/utils/constants';
import { useDialogStore } from '@/utils/store/dialog';
import { useUserStore } from '@/utils/store/usr';
import sleep from '@/utils/tools/sleep';

axios.defaults.baseURL = constants.apiPrefix;
axios.defaults.headers.common.Authorization = `Bearer ${constants.accessToken}`;
axios.defaults.headers.common['Content-Type'] = 'application/json';
const useUser = useUserStore();
const useDialog = useDialogStore();
const { userId } = useUser;

const showAnswer = async (chatId: string): Promise<any> => {
  const AnswerUrl = 'v3/chat/message/list';
  const { conversationId } = useDialog;

  const res = await axios.get(AnswerUrl, {
    params: {
      conversation_id: conversationId,
      chat_id: chatId,
    },
  });
  const resData = res.data;
  if (resData.code !== 0) {
    throw new Error(`获取回答时出错 (${resData.code}): ${resData.msg}`);
  }
  return resData.data;
};

const confirmAnswer = async (chatId: string): Promise<any> => {
  const ConfirmUrl = 'v3/chat/retrieve';
  const { conversationId } = useDialog;
  console.log(conversationId);

  let status: string = ''; // 对话状态

  for (let time: number = 0; time < constants.max_time; time++) {
    const res = await axios.get(ConfirmUrl, {
      params: {
        conversation_id: conversationId,
        chat_id: chatId,
      },
    });
    const resData = res.data;

    if (resData.code !== 0) {
      throw new Error(`确认对话时出错 (${resData.code}): ${resData.msg}`);
    }

    status = resData.data.status;
    console.log(`请求次数：${time}，对话状态: ${status}`);

    if (status === 'completed') {
      // 对话状态为完成，获取回答内容
      const content = await showAnswer(chatId);
      return content;
    }

    // 如果未完成且未达到最大次数，则等待1秒后继续
    if (time < constants.max_time) {
      await sleep(1000);
    }
  }

  // 达到最大请求次数仍未完成
  throw new Error('对话状态未完成，请稍后再试。');
};

const startConversation = async (question: string): Promise<any> => {
  const { conversationId } = useDialog;
  const AgentUrl = `v3/chat?conversation_id=${conversationId}`;

  const res = await axios.post(AgentUrl, {
    bot_id: constants.bot_id,
    user_id: userId,
    stream: false,
    auto_save_history: true,
    additional_messages: [
      {
        role: 'user',
        content: question,
        content_type: 'text',
      },
    ],
  });
  const resData = res.data;
  if (resData.code !== 0) {
    throw new Error(`发送对话时出错 (${resData.code}): ${resData.msg}`);
  }

  return resData.data.id; // 请求成功，返回对话ID
};

const createDialog = async (): Promise<any> => {
  const DialogUrl = 'v1/conversation/create';
  const res = await axios.post(DialogUrl, {
    bot_id: constants.bot_id,
  });
  const resData = res.data;
  if (resData.code !== 0) {
    throw new Error(`创建会话时出错 (${resData.code}): ${resData.msg}`);
  }
  const conversationId = resData.data.id; // 获取会话ID
  useDialog.setConversationId(conversationId);
  return conversationId;
};

const getAnswer = async (question: string): Promise<any> => {
  const chatId = await startConversation(question); // 获取对话ID
  const answerList = await confirmAnswer(chatId); // 确认对话并获取回答内容
  const answerMessages = answerList.filter((item: any) => item.type === 'answer');
  const followUpMessages = answerList.filter((item: any) => item.type === 'follow_up');

  let answer: string = '';
  answerMessages.forEach((msg: any, index: number) => {
    answer += `${index + 1 === 1 ? '' : `${index + 1}. `}${msg.content}\n`;
  });
  answer = answer.trim();

  return {
    answer,
    followUps: followUpMessages.map((item: any) => item.content),
  };
};

export default {
  createDialog,
  getAnswer,
};
