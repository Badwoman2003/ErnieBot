import axios from 'axios';

import constants from '@/utils/constants';

axios.defaults.baseURL = constants.apiPrefix;

export default {
  getAnswer(question: string) {
    return axios.get('get_answer', {
      params: {
        question,
      },
    });
  },
};
