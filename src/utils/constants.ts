export default {
  appTitle: import.meta.env.VITE_APP_TITLE,
  appSlogan: import.meta.env.VITE_APP_SLOGAN,
  base: import.meta.env.VITE_BASE,
  mobileLayoutBreakpoint: Number(import.meta.env.VITE_MOBILE_LAYOUT_BREAKPOINT || '480'),
  padLayoutBreakpoint: Number(import.meta.env.VITE_PAD_LAYOUT_BREAKPOINT || '768'),
  desktopLayoutBreakpoint: Number(import.meta.env.VITE_DESKTOP_LAYOUT_BREAKPOINT || '1024'),
  apiPrefix: import.meta.env.VITE_API_PREFIX,
  bot_id: import.meta.env.VITE_BOT_ID || '7483114266577518644',
  accessToken: 'pat_h174x86qAzy1uBbFUjqjDwzHjO1R7YN8CD348fM4oSXEXcyKnDoq2f2RoFSu66pz',
  appId: 'AZFia0j1xnvgM963icwo9F60CvTSAza4',
  secretKey: '4agt2GAElLMFJYtFKclG9e7wMFwqT99H',
  max_time: 50, // 最大请求次数(1s间隔)
};
