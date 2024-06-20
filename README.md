# ChatBot

> 前端项目指南

## 快速开始

1. 确保 `Node.js` 版本 `>= 18`，确保已全局安装 `pnpm`

2. 安装依赖

   ```bash
   pnpm i
   ```

3. 启动 Dev 服务器

   ```bash
   pnpm dev
   ```

4. 生产模式打包构建

   ```bash
   pnpm build
   ```

## 开发提示

1. VS Code 插件

   - Vue.volar
   - dbaeumer.vscode-eslint
   - esbenp.prettier-vscode

2. 规范化工具

   - ESLint
   - Prettier

## 常见问题

1. 如何更改后台地址前缀？

   - 开发环境：修改 `.env.development` 下的 `VITE_API_PREFIX` 属性
   - 生产环境：修改 `.env.production` 下的 `VITE_API_PREFIX` 属性
