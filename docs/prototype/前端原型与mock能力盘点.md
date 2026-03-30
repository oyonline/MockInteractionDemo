# 前端原型与 Mock 能力盘点

> 说明：本仓库为 **React（CRA）** 技术栈，非 Vue/Vite。以下按实际技术栈与结构盘点。

---

## A. 技术栈与基础约定

### 1) 框架与构建版本（来自 package.json）

| 项目 | 版本/说明 |
|------|-----------|
| **框架** | React ^19.2.3、react-dom ^19.2.3 |
| **构建** | react-scripts 5.0.1（Create React App，无 Vite） |
| **语言** | 全 JS（.js/.jsx），**无 TypeScript** |
| **Vue/Vite/TS** | 未使用 |

### 2) UI 组件库与自封装组件

- **无 Naive UI / Ant Design / Material UI 等第三方 UI 库**，页面全部为**原生 HTML + Tailwind CSS** 手写。
- **图标**：`lucide-react` 统一提供（如 `Search`、`Plus`、`Edit2`、`X` 等）。
- **自封装组件**：`src/components/` 目录下仅有 2 个组件：
  - `TablePagination.js`：通用分页组件
  - `ActionBar.js`：表格行操作栏（含 Portal 下拉菜单）

### 3) 路由方案

- **未使用 react-router**。路由为 **App 内基于 path 的 switch + 多标签页** 实现：
  - **路由定义位置**：`src/App.js` 内 `renderTabContent(tab)` 的 `switch (tab.path)`
  - **导航配置**：`src/layouts/DynamicSidebar.js` 的 `navConfig`

### 4) 状态管理

- **无 Redux/Zustand/Mobx**。全局状态仅为 **App.js 内 React useState**：
  - 标签列表 `tabs`
  - 当前激活标签 `activeTabId`
  - 侧栏显隐（首页不显示侧栏）

### 5) 代码规范与样式工具

| 工具 | 是否使用 | 配置文件/说明 |
|------|----------|----------------|
| **ESLint** | 是 | `package.json` 内 `eslintConfig: { extends: ["react-app", "react-app/jest"] }` |
| **Prettier** | 否 | 无 `.prettierrc*` / prettier 依赖 |
| **Tailwind CSS** | 是 | `tailwind.config.js` + `postcss.config.js` |

---

## B. Layout 与页面容器结构

### 1) 左侧导航 + 顶部 Header 的布局组件路径

- **布局文件**：`src/layouts/DynamicSidebar.js`（动态侧栏）、`src/layouts/ModuleLayout.js`（模块布局）
- **主应用**：`src/App.js` 整合布局、标签栏、主内容区

### 2) 内容区容器的 class / 样式约定

- **主内容容器**：`<main className="flex-1 min-h-0 overflow-auto p-6">`
- 占满剩余高度（`flex-1 min-h-0`）、可滚动（`overflow-auto`）、内边距 `p-6`

### 3) 负责渲染右侧内容区的组件/插槽

- **等价于 router-view 的渲染点**：`App.js` 中 `{renderTabContent(activeTab)}`
- 根据当前激活标签的 `tab.path` 在 `renderTabContent` 的 switch 中返回对应页面组件

---

## C. 列表页/表单页的「标准模板」

### 1) 推荐的标准列表页文件路径

**`src/pages/SupplierListPage.js`**
- 具备：筛选区 + 表格 + 分页 + 新增/编辑弹窗 + 统计卡片
- 结构清晰、mock 内聚、可作为模板复制

### 2) 页面组成部分

| 区块 | 实现方式 |
|------|----------|
| **统计卡片** | `grid grid-cols-4` 展示关键指标 |
| **筛选/查询** | 内联表单项，无独立 SearchForm 组件 |
| **表格** | 原生 `<table>` + Tailwind，表头 `sticky top-0` |
| **分页** | 使用 `TablePagination` 组件 |
| **新增/编辑** | Modal 弹窗（`fixed inset-0 z-50`） |
| **详情** | 通过 `onOpenDetail` 回调打开新标签页 |

### 3) 其他参考页面

- `UserManagementPage.js`：带分页的列表页
- `ExpenseCategoryPage.js`：树+表格组合
- `ProductAttributePage.js`：分组配置型页面

---

## D. Mock / Service / API 层现状

### 1) Mock 数据体系

- **组织方式**：按模块放在 `src/mock/[模块]/` 目录下
  - `src/mock/settings/`：系统设置相关 mock
  - `src/mock/logistics/`：物流相关 mock
  - `src/mock/system/`：系统权限相关 mock
- **统一入口**：`src/mock/index.js` 聚合导出

### 2) Service / Request 层

- **Service 目录**：`src/services/`
  - `settings.js`：系统设置相关 service
  - `logistics.js`：物流服务
  - `system.js`：系统服务
  - `index.js`：统一入口

### 3) localStorage 封装

- **工具文件**：`src/utils/storage.js`（封装方法）
- **Key 定义**：`src/utils/storageKeys.js`（常量定义）
- **Hook**：`src/hooks/useLocalStorage.js`（状态同步）

---

## E. 系统设置 7 个页面现状

| 序号 | 页面名称 | 路由 path | 文件路径 | 状态 |
|------|----------|-----------|----------|------|
| 1 | 基础配置 | `/settings/basic` | `src/pages/settings/SettingsBasicPage.js` | ✅ 可用 |
| 2 | 数据字典 | `/settings/dict` | `src/pages/settings/SettingsDictPage.js` | ✅ 可用 |
| 3 | 枚举与规则 | `/settings/enum` | `src/pages/settings/SettingsEnumRulePage.js` | ✅ 可用 |
| 4 | 接口同步 | `/settings/sync` | `src/pages/settings/SettingsApiSyncPage.js` | ✅ 可用 |
| 5 | 参数设置 | `/settings/params` | `src/pages/settings/SettingsParamsPage.js` | ✅ 可用 |
| 6 | 定时任务 | `/settings/scheduler` | `src/pages/settings/SettingsSchedulerPage.js` | ✅ 可用 |
| 7 | 系统日志 | `/settings/log` | `src/pages/settings/SettingsLogPage.js` | ✅ 可用 |

**说明**：系统设置 7 个页面已全部实现，使用统一的列表+分页+弹窗模式。

---

## F. 建议复用与新增清单

### 建议复用的组件

| 类型 | 路径 | 用途 |
|------|------|------|
| 分页组件 | `src/components/TablePagination.js` | 统一分页 UI |
| 操作栏 | `src/components/ActionBar.js` | 表格行操作（Portal 下拉） |
| 布局 | `src/layouts/ModuleLayout.js` | 模块级布局容器 |
| 存储 Hook | `src/hooks/useLocalStorage.js` | 持久化状态 |

### 建议新增页面时的参考

- 列表页：复制 `SupplierListPage.js` 结构
- 树+表格：参考 `ExpenseCategoryPage.js`
- 配置型页面：参考 `ProductAttributePage.js`

---

*盘点完成。若后续开发新页面，建议沿用现有模式：Service 层 + Mock 数据 + 统一分页组件。*
