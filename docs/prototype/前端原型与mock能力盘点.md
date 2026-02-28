# 前端仓库「纯前端原型 + Mock 数据」能力盘点

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
- **自封装组件**：**无独立 `components/` 目录**。各页面内自用的小块（如 `NavItem`、`TabBar`、`TablePagination`）均写在对应页面文件内，未抽成可复用组件。

### 3) 路由方案

- **未使用 vue-router**。路由为 **App 内基于 path 的 switch + 多标签页** 实现：
  - **路由定义位置**：`src/App.js` 内 `navigationConfig`（含系统设置 7 个子项）与 `renderTabContent(tab)` 的 `switch (tab.path)`。
  - **系统设置模块路由**：在 `navigationConfig` 中，`id: 'settings'` 下 children 定义：
    - `/settings/basic` 基础配置
    - `/settings/dict` 数据字典
    - `/settings/enum` 枚举与规则
    - `/settings/sync` 接口同步
    - `/settings/params` 参数设置
    - `/settings/scheduler` 定时任务
    - `/settings/log` 系统日志  
  上述 path 在 `renderTabContent` 中**均未单独 case**，统一走 `default` → `PlaceholderPage`。

### 4) 状态管理

- **无 pinia/vuex**。全局状态仅为 **App.js 内 React useState**：侧栏展开项、侧栏显隐、标签列表、当前激活标签等，无独立 store 目录或跨页面状态库。

### 5) 代码规范与样式工具

| 工具 | 是否使用 | 配置文件/说明 |
|------|----------|----------------|
| **ESLint** | 是 | `package.json` 内 `eslintConfig: { extends: ["react-app", "react-app/jest"] }`，无独立 `.eslintrc*` |
| **Prettier** | 否 | 无 `.prettierrc*` / prettier 依赖 |
| **UnoCSS** | 否 | 无 `uno.config*` |
| **Tailwind CSS** | 是 | `tailwind.config.js`（content: `./src/**/*.{js,jsx,ts,tsx}`），配合 `postcss.config.js`（tailwindcss + autoprefixer） |

---

## B. Layout 与页面容器结构（仅补内容区）

### 1) 左侧导航 + 顶部 Header 的布局组件路径

- **单一文件**：`src/App.js`。  
- 布局全部在该文件中：左侧 `aside`（导航 + Logo + 底部用户信息）、右侧区域（顶部 header + 标签栏 TabBar + 主内容区）。**无独立 Layout 组件文件**。

### 2) 内容区容器的 class / 样式约定

- **主内容容器**：`<main className="flex-1 min-h-0 overflow-auto p-6">`  
  - 占满剩余高度（`flex-1 min-h-0`）、可滚动（`overflow-auto`）、内边距 `p-6`。
- 页面内部常见写法：`flex flex-col h-full` 或 `flex flex-col min-h-0`，表格区域多为 `flex-1 min-h-0 overflow-auto`，以保证在 Layout 内不撑破高度。

### 3) 负责渲染右侧内容区的组件/插槽

- **等价于 router-view 的渲染点**：`App.js` 中  
  `{renderTabContent(activeTab)}`  
  位于 `<main className="flex-1 min-h-0 overflow-auto p-6">` 内。  
- 根据当前激活标签的 `tab.path` 在 `renderTabContent` 的 switch 中返回对应页面组件；未匹配的 path（含全部 7 个系统设置页）走 `default`，渲染 `<PlaceholderPage pageName={tab.name} path={tab.path} />`。

---

## C. 列表页/表单页的「标准模板」

### 1) 推荐的标准列表页文件路径

**`src/pages/SupplierListPage.js`**  
（具备：筛选区 + 表格 + 分页 + 新增/编辑弹窗 + 可选详情通过 `onOpenDetail` 开新标签，且结构清晰、mock 内聚）

### 2) 页面由哪些部分组成（摘要）

| 区块 | 实现方式 |
|------|----------|
| **统计卡片** | 页面内 `grid grid-cols-4` 的 4 个卡片，展示供应商总数、关联 SKU、近期订单金额、A 级数量等 |
| **筛选/查询** | 内联表单项：关键词、类型、状态、评级、类目等，无独立 SearchForm 组件 |
| **表格** | 原生 `<table>` + Tailwind，支持操作列（查看/编辑等） |
| **分页** | 页面内 `currentPage`/`pageSize` + 上一页/下一页/页码，无全局 Pagination 组件 |
| **新增/编辑** | 单一 Modal（`showCreateModal` + `editingSupplier`），表单字段在同一 Modal 内 |
| **详情** | 通过 `onOpenDetail(tabInfo)` 由 App 打开新标签页，详情页可另文件（本页未实现详情页组件，仅传 data） |

其他可参考的列表型页面：`ExpenseCategoryPage.js`（树+表格+分页）、`ProductAttributePage.js`（属性管理，表格+分组+弹窗）、`BrandManagementPage.js`（支持注入数据，否则用本地 mock）。

### 3) 表格列配置/列设置组件

- **不存在** `TableColumnSetting` 或列设置/列显隐类组件。  
- 表格列均为各页面内手写 `<th>`/`<td>`，无统一列 schema 或列配置驱动。

---

## D. Mock / Service / API 层现状

### 1) Mock 数据体系

- **无** mockjs、msw、或独立 mock 目录/本地 json 请求。
- **现状**：Mock 数据**按页面内联**在各自页面文件中，例如：
  - `SupplierListPage.js`：`supplierData` 数组
  - `ExpenseCategoryPage.js`：`initialExpenseCategories`、树数据等
  - `OrganizationManagementPage.js`、`CategoryTemplatePage.js`、`SalesForecastPage.js`、`ExpenseFactPage.js`、`ExpenseApprovalListPage.simple.js`、`BrandManagementPage.js`、`SkuIterationPage.js` 等：均在文件顶部或组件内定义 mock 数组/生成函数
- **结论**：无统一 mock 入口或开关，纯前端原型可直接沿用「页面内 mock」，后续若要统一可抽离到 `src/mock/` 或通过一层 service 切换。

### 2) Service / Request 层

- **无** 独立 `request`、`axios` 或 `api/`/`services/` 封装。
- **无** 全局 HTTP 客户端或接口模块。  
- **纯原型复用建议**：保持页面内用内存数据即可；若希望「先走 mock、后接真实接口」，可新增 `src/services/`（如 `getXxxList()` 先 return 本地 mock，再改为请求），页面只调 service，不直接写死数组。

### 3) localStorage 封装或 hooks

- **无** `useStorage`、`useLocalStorage` 或统一 localStorage 封装。  
- 未在仓库内搜到 localStorage 使用。若需「原型内持久化」（如列表筛选条件、表格列显隐），可新增 `src/hooks/useLocalStorage.js` 或 `src/utils/storage.js`。

---

## E. 系统设置 7 个页面现状

| 序号 | 页面名称 | 路由 path | 文件路径 | 当前实现状态 |
|------|----------|-----------|----------|--------------|
| 1 | 基础配置 | `/settings/basic` | 无独立页面，由 App 渲染 | **占位**：`PlaceholderPage`（页面开发中） |
| 2 | 数据字典 | `/settings/dict` | 无独立页面 | **占位**：`PlaceholderPage` |
| 3 | 枚举与规则 | `/settings/enum` | 无独立页面 | **占位**：`PlaceholderPage` |
| 4 | 接口同步 | `/settings/sync` | 无独立页面 | **占位**：`PlaceholderPage` |
| 5 | 参数设置 | `/settings/params` | 无独立页面 | **占位**：`PlaceholderPage` |
| 6 | 定时任务 | `/settings/scheduler` | 无独立页面 | **占位**：`PlaceholderPage` |
| 7 | 系统日志 | `/settings/log` | 无独立页面 | **占位**：`PlaceholderPage` |

- **占位组件**：`src/pages/PlaceholderPage.js`，接收 `pageName`、`path`，展示「页面开发中」及当前路径。  
- 上述 7 个 path 在 `App.js` 的 `renderTabContent` 中均未单独 case，因此全部走 `default` → `PlaceholderPage`。

---

## F. 建议「复用」的组件清单（含路径）与「建议新增」的通用模块

### 建议复用的组件/模式（路径与原因）

| 类型 | 路径/位置 | 建议复用原因 |
|------|-----------|--------------|
| 布局与导航 | `src/App.js`（aside + header + TabBar + main） | 已实现多标签、侧栏折叠、路由映射，系统设置仅需在 `renderTabContent` 中加 case 即可接入新页 |
| 占位页 | `src/pages/PlaceholderPage.js` | 未实现或开发中的路由可继续用其占位，保持体验一致 |
| 列表页结构参考 | `src/pages/SupplierListPage.js` | 筛选 + 表格 + 分页 + Modal 增改 + 统计卡片，可作为系统设置列表页（如数据字典、参数设置）的复制模板 |
| 带树+表格的参考 | `src/pages/ExpenseCategoryPage.js` | 左侧树 + 右侧表格 + 分页 + Mock 数据结构，适合「数据字典/枚举与规则」等层级配置页参考 |
| 属性/配置型参考 | `src/pages/ProductAttributePage.js` | 分组、类型配置、表格+弹窗、inline mock，适合「枚举与规则」「基础配置」等配置型页参考 |
| 图标库 | `lucide-react` | 已统一使用，新页面继续用同一套图标即可 |

### 建议新增的通用模块（mock / service / types / storage）

| 模块 | 建议新增原因 |
|------|--------------|
| **mock**（如 `src/mock/`） | 将各页内联 mock 抽到按模块或页面的 json/js 中，便于统一开关（如 __USE_MOCK__）和后续替换为接口，减少页面文件体积 |
| **service**（如 `src/services/`） | 提供一层「获取列表/详情」的 API，当前返回 mock 或本地数据，后续改为请求后端，页面只调 service 不关心数据来源，便于纯原型与联调切换 |
| **types**（若引入 TS 或 JSDoc） | 当前无类型定义，若后续上 TS 或加强 JSDoc，可增加 `src/types/` 统一字典、枚举、配置项等类型，减少重复与错误 |
| **storage**（如 `src/utils/storage.js` 或 `src/hooks/useLocalStorage.js`） | 原型阶段若有「记住筛选条件、列显隐、主题」等需求，可统一封装 localStorage，避免各页手写 key 与序列化 |

---

*盘点完成。若后续为系统设置 7 个页面开发原型，建议：在 `renderTabContent` 中为每个 `/settings/*` 增加 case，新建 7 个页面组件（或部分共用一个列表模板），数据层优先使用上述 mock/service 方案，页面布局与样式延续现有 main 内 `p-6` 与 flex 约定。*
