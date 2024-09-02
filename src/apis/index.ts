import axios from 'axios';

import constants from '@/utils/constants';
import { useUserStore } from '@/utils/store/usr';

axios.defaults.baseURL = constants.apiPrefix;

export default {
  getAnswer(question: string) {
    const userStore = useUserStore();
    const { userId } = userStore;
    const AgentUrl = `/getAnswer?access_token=${constants.accessToken}&appId=${constants.appId}&secretKey=${constants.secretKey}`;
    return axios.post(
      AgentUrl,
      {
        message: {
          content: {
            type: 'text',
            value: {
              showText: question,
            },
          },
        },
        source: 'AZFia0j1xnvgM963icwo9F60CvTSAza4',
        from: 'openapi',
        openId: userId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  },
};
