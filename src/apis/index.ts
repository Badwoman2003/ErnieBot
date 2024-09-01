import axios from 'axios';

import constants from '@/utils/constants';

axios.defaults.baseURL = constants.apiPrefix;

export default {
  getAnswer(question: string) {
    return axios.post(
      '/getAnswer?access_token=24.c97cb0fa3d8d9ae0f35cc4c31aa7bf0f.2592000.1727623138.282335-95964131&appId=AZFia0j1xnvgM963icwo9F60CvTSAza4&secretKey=4agt2GAElLMFJYtFKclG9e7wMFwqT99H',
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
        openId: '20212434027',
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  },
};
