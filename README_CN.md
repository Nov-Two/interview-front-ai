# 面试准备文档 (Interview Preparation)

## 1. 技术栈 (Tech Stack)

本项目是一个现代化的移动端 H5 聊天应用，采用目前前端主流的 "Vue 3 + Vite + TypeScript" 技术栈。

*   **核心框架**: [Vue 3](https://vuejs.org/) (使用 Composition API, `<script setup>`)
*   **构建工具**: [Vite](https://vitejs.dev/) (极速的开发服务器和构建工具)
*   **语言**: [TypeScript](https://www.typescriptlang.org/) (提供类型安全，增强代码可维护性)
*   **UI 组件库**: [Vant 4](https://vant-ui.github.io/vant/) (轻量、可靠的移动端 Vue 组件库)
*   **CSS 框架**: [Tailwind CSS](https://tailwindcss.com/) (原子化 CSS，快速构建现代 UI)
*   **状态管理**: [Pinia](https://pinia.vuejs.org/) (Vue 官方推荐的状态管理库，替代 Vuex)
*   **路由管理**: [Vue Router 4](https://router.vuejs.org/)
*   **国际化**: [Vue I18n 9](https://vue-i18n.intlify.dev/) (支持中英切换)
*   **自动导入**: `unplugin-auto-import` 和 `unplugin-vue-components` (自动导入 Vue API 和组件，提升开发体验)
*   **CSS 预处理**: Less (配合 Vant 使用)

## 2. 功能实现 (Features)

*   **聊天功能**:
    *   发送文本消息
    *   发送图片消息 (模拟上传)
    *   模拟 AI 自动回复
    *   消息气泡 UI (区分用户和 AI)
*   **会话管理**:
    *   创建新会话
    *   删除会话 (左滑删除)
    *   会话分组 (通用/工作)
    *   **合并会话**: 支持多选合并多个会话记录
*   **用户系统**:
    *   登录/退出 (模拟)
    *   权限控制 (未登录可浏览，发消息/查看历史需登录)
*   **国际化**:
    *   全站中英文切换
    *   登录页无需登录即可切换语言

## 3. 难点与解决方案 (Challenges & Solutions)

### 3.1 移动端适配与布局
*   **难点**: 聊天页面的布局需要头部固定、底部输入框固定，中间消息区域自适应滚动。在移动端键盘弹出时，通过 `resize` 或 `scroll` 事件处理可能会有兼容性问题。
*   **解决**: 使用 Flex 布局 (`flex-col`, `flex-1`, `overflow-y-auto`) 实现经典的 "Holy Grail" 布局。输入框使用 `textarea` 并监听 `input` 事件动态调整高度，提升用户体验。

### 3.2 自动导入配置
*   **难点**: 手动引入 `ref`, `computed`, `watch` 以及 Vant 组件非常繁琐。
*   **解决**: 配置 `vite.config.ts` 使用 `unplugin-auto-import` 和 `unplugin-vue-components`。
    *   `AutoImport`: 自动引入 `vue`, `vue-router`, `pinia`, `vue-i18n` 等 API。
    *   `Components`: 自动引入并注册 Vant 组件。
    *   配置 `dts` 生成类型声明文件，解决 TS 报错问题。

### 3.3 Tailwind CSS 集成
*   **难点**: 在 Vite 项目中配置 Tailwind CSS 4.0 (最新版)。
*   **解决**: 使用 `@tailwindcss/vite` 插件，在 CSS 中引入 `@import "tailwindcss";`。结合 Vue 的 `<style scoped>` 使用时，尽量使用 Utility Classes 直接写在 template 中，减少 CSS 代码量。

### 3.4 国际化 (i18n) 动态切换
*   **难点**: 如何在不刷新页面的情况下动态切换语言，且未登录用户也能切换。
*   **解决**: 使用 `vue-i18n` 的 Composition API (`useI18n`)。
    *   将 `locale` 变量绑定到 UI 切换按钮。
    *   所有文案使用 `$t('key')` 动态获取。
    *   Pinia Store 中的数据如果包含静态文案（如分组名称），改为在组件渲染时使用 `$t` 动态翻译。

### 3.5 聊天记录合并逻辑
*   **难点**: 如何将多个会话的消息合并，并保持时间顺序。
*   **解决**:
    *   在 Pinia 中实现 `mergeSessions` action。
    *   选定一个目标会话，将其他选中会话的 `messages` 数组合并进来。
    *   使用 `sort((a, b) => a.timestamp - b.timestamp)` 重新按时间排序。
    *   删除被合并的旧会话。

## 4. 面试常见问题 (Q&A)

**Q: 为什么选择 Pinia 而不是 Vuex?**
A: Pinia 是 Vue 3 官方推荐的状态库。它去掉了 Mutation，只有 State, Getter, Action，概念更简单。它对 TypeScript 支持更好，不需要复杂的类型包装。体积也更小。

**Q: 如何处理组件的自动导入带来的类型问题?**
A: `unplugin-auto-import` 会生成 `auto-imports.d.ts` 文件，我们需要在 `tsconfig.json` 的 `include` 字段中包含这个文件，这样 TS 就能识别全局导入的 API。

**Q: Vue 3 的 Composition API 有什么优势?**
A: 相比 Options API，Composition API 允许我们将逻辑关注点（Feature）组织在一起，而不是按 data/methods/mounted 分散。这使得代码复用（Hooks）更容易，逻辑更清晰，也更有利于 TS 类型推导。

**Q: 移动端 1px 边框问题如何解决?**
A: 虽然现在很多手机支持，但在本项目中 Vant 组件库内部已经处理了 1px 问题（通常使用 `transform: scale(0.5)` 或 `border-image`）。如果自己写，Tailwind 的 `border` 类在高清屏下表现通常是可以接受的，或者使用 `shadow-sm` 替代边框。

