import router from '@utils/router';
import { useAppConfig } from '@utils/store/app-config';
import debounce from '@utils/tools/debounce';
import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from './App.vue';
import { useUserStore } from './utils/store/usr';

import '@assets/styles/reset.scss';
import '@assets/styles/theme.css';

const pinia = createPinia();

createApp(App).use(pinia).use(router).mount('#app');

const appConfig = useAppConfig();
const userId = '20212434027';
const userStore = useUserStore();
userStore.setUserId(userId);

// 窗口调整时更新屏幕信息
window.addEventListener(
  'resize',
  debounce(() => {
    appConfig.updateWindowSize();
  }),
);
