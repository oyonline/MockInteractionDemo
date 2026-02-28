---
name: skill-react-cra-mock-prototype
description: Builds interactive front-end prototypes with mock data in a React (CRA) + JS + Tailwind repo using App.js Tab Switch routing (navigationConfig + renderTabContent). Fills content for existing settings paths with minimal changes. Use when adding or refining system settings pages, mock services, or localStorage-backed prototypes in this codebase.
---

# React（CRA）+ Mock 数据可交互原型（Tab Switch 路由）

**适用**：React 19 + react-scripts (CRA)、JavaScript（无 TypeScript）、Tailwind CSS、`src/App.js` 内 Tab 路由（navigationConfig + renderTabContent）。

---

## 0. 仓库事实（必须遵守）

- **技术栈**：React CRA + JS + Tailwind（无 Vue/Vite/TS/第三方 UI 组件库）。
- **布局与导航**：全部在 `src/App.js`（侧栏 + Header + TabBar + `<main className="flex-1 min-h-0 overflow-auto p-6">`）。
- **页面渲染**：`renderTabContent(activeTab)` 通过 `switch(tab.path)` 决定内容（等价 router-view）。
- **Tab 数据结构**：`{ id, name, path, data? }`（无 component 字段）。
- **系统设置**：navigationConfig 中已配置 7 个 path，当前均未在 `renderTabContent` 单独 case，全部走 `default -> <PlaceholderPage />`。

---

## 1. 目标

在不改 Layout/TabBar 的前提下，将系统设置 7 个页面逐步从占位升级为可交互原型（可 CRUD、筛选分页、保存/刷新不丢可选）。

| Path | 页面 |
|------|------|
| `/settings/basic` | 基础配置 |
| `/settings/dict` | 数据字典 |
| `/settings/enum` | 枚举与规则 |
| `/settings/sync` | 接口同步 |
| `/settings/params` | 参数设置 |
| `/settings/scheduler` | 定时任务 |
| `/settings/log` | 系统日志 |

---

## 2. 核心原则（最小改动）

1. **不重构 App.js**：只做必要 import + switch/case 增量。
2. **分阶段上线**：做了的 path 写 case；没做的继续 `default -> PlaceholderPage`。
3. **页面优先复制现有模式**：参考 `src/pages/SupplierListPage.js`（筛选 + 表格 + 分页 + Modal）。
4. **数据来源统一**：页面不内联 mock，统一走 `services`（service 内使用 mock + localStorage）。
5. **不引入新依赖**：只用原生 localStorage + React hooks。

---

## 3. 目录与文件约定

### 3.1 Mock 数据（按模块）

新增：

- `src/mock/index.js` — 统一入口，聚合导出 settings mock
- `src/mock/settings/basic.js`
- `src/mock/settings/dict.js`
- `src/mock/settings/enum.js`
- `src/mock/settings/sync.js`
- `src/mock/settings/params.js`
- `src/mock/settings/scheduler.js`
- `src/mock/settings/log.js`

约定：以模块文件为单位导出默认数据（数组/对象），或导出 `getMockXxx()` 生成函数（推荐用于带时间字段的 log/sync）。目录命名与路由一致。

### 3.2 Storage（统一 localStorage）

新增：

- `src/utils/storage.js` — 封装 get/set/remove/clearByPrefix，统一序列化/反序列化，支持 schemaVersion
- `src/utils/storageKeys.js` — 只定义 key 常量，禁止页面写魔法字符串
- `src/hooks/useLocalStorage.js` — hook：`key + initialValue` → state + 自动持久化

**Key 命名**（必须）：

- 前缀：`ecommerce:`
- 模块：`settings`
- 示例：`ecommerce:settings:params`、`ecommerce:settings:dict`、`ecommerce:settings:log`、`ecommerce:settings:scheduler`、`ecommerce:settings:basic`、`ecommerce:settings:enum`、`ecommerce:settings:sync`

**schemaVersion**（必须）：

- 存储结构：`{ schemaVersion: 1, data: <any> }`
- 读取版本不一致 → 视为无效，返回 null，由 service 用 mock 回填

**reset**：storage 提供 `clearByPrefix(prefix)`（如 `ecommerce:settings:`），用于开发一键重置。

### 3.3 Service（页面唯一数据入口）

新增：

- `src/services/index.js` — 聚合导出
- `src/services/settings.js` — 系统设置 service（params/dict/log/sync/basic/enum/scheduler）

约定：

- 页面只调用 service，不直接 import mock 或读 localStorage。
- list 统一返回 `{ list, total }`。
- 常用 query 字段：`keyword, status, page, pageSize, sortBy, sortOrder`。
- 原型阶段可同步返回；如需模拟加载，在页面层加 setTimeout 或 service 简单延迟开关。

---

## 4. 系统设置 7 页面形态（最小闭环）

每页至少：标题+说明、筛选、表格、分页、Modal（如适用）、成功/失败提示。

- **推荐第一个实现**：`/settings/params`（参数设置）— 表格 key/value/desc/group/status/updatedAt，新增/编辑/删除、启用/停用，持久化演示价值高。
- 其余 6 页的字段与操作要点见 [reference.md](reference.md)。

---

## 5. 接入 App.js（唯一正确方式）

### 5.1 新增页面文件

目录：`src/pages/settings/`

- `SettingsBasicPage.js`
- `SettingsDictPage.js`
- `SettingsEnumRulePage.js`
- `SettingsApiSyncPage.js`
- `SettingsParamsPage.js`
- `SettingsSchedulerPage.js`
- `SettingsLogPage.js`

### 5.2 App.js 修改

1. 顶部 import 上述页面组件。
2. 在 `renderTabContent(tab)` 的 `default:` 之前增加：

```js
// ---------- 系统设置（逐步上线：未做的继续走 default 占位） ----------
case '/settings/basic': return <SettingsBasicPage />;
case '/settings/dict': return <SettingsDictPage />;
case '/settings/enum': return <SettingsEnumRulePage />;
case '/settings/sync': return <SettingsApiSyncPage />;
case '/settings/params': return <SettingsParamsPage />;
case '/settings/scheduler': return <SettingsSchedulerPage />;
case '/settings/log': return <SettingsLogPage />;
```

---

## 快速检查清单

- [ ] Mock 按模块放在 `src/mock/settings/*.js`，由 `src/mock/index.js` 聚合
- [ ] Storage 使用 `ecommerce:settings:*`，结构带 schemaVersion，有 clearByPrefix
- [ ] 页面仅通过 `services/settings.js` 读写数据
- [ ] 新页面参考 SupplierListPage（筛选+表格+分页+Modal）
- [ ] App.js 只增加 import 与上述 7 个 case，不改 Layout/TabBar
