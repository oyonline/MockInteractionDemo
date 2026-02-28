# Mock / Service / Storage 最小可维护方案

**约束**：不引入新依赖，仍为 CRA + React + Tailwind + JS；mock 当前分散在页面内联，无 service/request、无 localStorage 封装；系统设置 7 个页面将从不占位变为可交互原型，路由为 `App.js` 的 `renderTabContent(tab.path)` switch/case。

---

## 1) 建议新增文件/目录（完整路径 + 职责一句）

| 路径 | 职责 |
|------|------|
| `src/mock/index.js` | 统一入口：按模块 re-export 各 mock 数据或生成函数，便于页面/ service 引用；可在此做 `__USE_MOCK__` 开关（从 window 或 env 读）。 |
| `src/mock/settings/basic.js` | 基础配置 mock：返回数组或对象，如站点名、logo、时区等配置项。 |
| `src/mock/settings/dict.js` | 数据字典 mock：字典类型列表 + 字典项列表，结构贴近后端（如 typeCode + items）。 |
| `src/mock/settings/enum.js` | 枚举与规则 mock：枚举定义列表（code/name/options 等）。 |
| `src/mock/settings/sync.js` | 接口同步 mock：同步任务/接口列表、上次同步时间等。 |
| `src/mock/settings/params.js` | 参数设置 mock：参数 key/value/描述/分组等。 |
| `src/mock/settings/scheduler.js` | 定时任务 mock：任务列表（cron、状态、上次执行等）。 |
| `src/mock/settings/log.js` | 系统日志 mock：操作日志列表（时间、操作人、模块、动作等）。 |
| `src/services/index.js` | Service 入口：对外暴露各模块的 service 对象或方法（如 `settingsParams.list(query)`），内部先走 mock 或后续切真实请求。 |
| `src/services/settings.js` | 系统设置相关 service：实现 params/dict/log/sync 等 list/get/create/update/remove，内部读 `src/mock/settings/*` 或调 localStorage（见下）。 |
| `src/utils/storage.js` | localStorage 封装：统一 key 命名空间、序列化/反序列化、schemaVersion、get/set/remove/clearByPrefix；不包含业务 key 定义。 |
| `src/utils/storageKeys.js` | 仅定义业务 key 常量（如 `SETTINGS_PARAMS`、`SETTINGS_DICT`），供 storage 与 service 使用，避免魔法字符串。 |
| `src/hooks/useLocalStorage.js` | 封装「key + 初始值」的 useState + 持久化：读 storage 初值、写时同步 setState 与 localStorage；可选 schemaVersion 校验与 reset。 |

**可选（若采用方案 B）**：

| 路径 | 职责 |
|------|------|
| `src/components/TablePagination.js` | 通用分页 UI：接收 currentPage/totalPages/total/pageSize(可选)/onPageChange/itemName(可选)，渲染「共 N 条」+ 上一页/下一页，样式与 SupplierListPage 底部分页一致。 |
| `src/hooks/useListFilterPagination.js` | 列表筛选+分页逻辑：入参 data + filterFn + initialFilters + pageSize；返回 filters/setFilters/resetFilters/filteredData/paginatedData/currentPage/setCurrentPage/totalPages，避免每页重复 useMemo 与翻页重置。 |

---

## 2) Mock 数据组织方式与系统设置命名建议

- **组织方式**：**按模块**，再按页面/领域拆文件。系统设置单独目录 `src/mock/settings/`，与「产品/财务/采购」等将来可对应 `src/mock/product/`、`src/mock/finance/` 等，便于按模块开关 mock 或替换为接口。
- **系统设置 7 个子模块命名**（与路由 path 一致，便于对照）：
  - `basic` → 基础配置（/settings/basic）
  - `dict` → 数据字典（/settings/dict）
  - `enum` → 枚举与规则（/settings/enum）
  - `sync` → 接口同步（/settings/sync）
  - `params` → 参数设置（/settings/params）
  - `scheduler` → 定时任务（/settings/scheduler）
  - `log` → 系统日志（/settings/log）

每个文件默认 export 一份数据或一个 `function getMockXxx() { return [...]; }`，在 `src/mock/index.js` 中聚合，例如：

```js
// src/mock/index.js 示意
export { default as settingsBasic } from './settings/basic';
export { default as settingsParams } from './settings/params';
// ...
```

或按需导出函数：

```js
export { getMockParamsList } from './settings/params';
```

---

## 3) Service 层接口形态（统一约定）

**通用形状**（与是否用 mock 无关，页面只调 service）：

- **list(query)** → `{ list, total }`  
  - `list`: 当前页数据数组  
  - `total`: 满足条件的总条数（用于分页）
- **get(id)** → 单条数据对象，不存在可返回 null
- **create(payload)** → 新对象（含后端生成的 id 等），或返回新列表（原型可二选一）
- **update(id, patch)** → 更新后对象或新列表
- **remove(id)** → 无返回值或返回删除后的列表（原型可约定 void）

**query 常见字段**（list 入参）：

| 字段 | 类型 | 说明 |
|------|------|------|
| keyword | string | 关键词，多用于名称/编码模糊匹配 |
| status | string | 状态筛选（启用/停用等） |
| page | number | 页码，从 1 开始 |
| pageSize | number | 每页条数，默认 10 |
| sortBy | string | 排序字段 |
| sortOrder | 'asc' \| 'desc' | 排序方向 |

各模块可只实现用到的字段；未传的字段不参与筛选/排序。

**函数签名伪代码**：

```js
// src/services/settings.js 示意（不实现具体业务）

export const settingsParams = {
  list(query = {}) {
    const { keyword = '', status = '', page = 1, pageSize = 10 } = query;
    // 从 getMockParamsList() 或 storage 取数据，filter + slice，返回 { list, total }
    return { list: [], total: 0 };
  },
  get(id) { return null; },
  create(payload) { return payload; },
  update(id, patch) { return patch; },
  remove(id) {},
};

export const settingsLog = {
  list(query) { return { list: [], total: 0 }; },
  get(id) { return null; },
  // 日志通常无 create/update/remove，按需省略
};
```

页面侧只依赖 `import { settingsParams } from '@/services/settings'`（或相对路径），不直接引用 mock 或 storage。

---

## 4) localStorage 规范

### Key 命名空间规则

- 统一前缀：`ecommerce:`，避免与其他项目冲突。
- 模块+业务：`ecommerce:<module>:<entity>`。
- 系统设置示例：
  - `ecommerce:settings:params` — 参数设置列表
  - `ecommerce:settings:dict` — 数据字典（或拆成 type 与 item 两个 key，按需）
  - `ecommerce:settings:log` — 系统日志（若做“写入后持久化”）
  - `ecommerce:settings:scheduler` — 定时任务列表
- 所有 key 常量放在 `src/utils/storageKeys.js`，例如：

```js
const PREFIX = 'ecommerce:';
export const SETTINGS_PARAMS = PREFIX + 'settings:params';
export const SETTINGS_DICT = PREFIX + 'settings:dict';
// ...
```

### schemaVersion 版本策略

- 在存入时带版本号，例如 `{ schemaVersion: 1, data: [...] }`。
- 读取时若 `schemaVersion` 小于当前约定版本（如 1），则视为旧数据，可选择：丢弃并重新用 mock 初始化、或迁移函数升级。
- 在 `storage.js` 的 get 中统一处理：发现版本不符则返回 null 或默认值，由调用方决定是否用 mock 回填。

### resetMockData 方案

- 提供工具函数，例如在 `src/utils/storage.js` 或 `src/services/settings.js` 中：
  - `clearSettingsStorage()`：删除所有以 `ecommerce:settings:` 开头的 key（用 `Object.keys(localStorage).filter(k => k.startsWith('ecommerce:settings:'))` 再 removeItem）。
  - 或 `clearByPrefix(prefix)`：在 storage 封装里实现按前缀批量删除。
- 开发阶段可在控制台或页面“重置数据”按钮中调用，便于恢复为 mock 初始状态；上线后可按需保留或移除该能力。

---

## 5) 方案 A 与 B 的推荐选择

- **A**：完全不抽公共模块，页面复制 SupplierListPage 风格，mock 仍可迁到 `src/mock/` 并由 service 读，但分页/筛选逻辑每页各写一遍。
- **B**：只抽 **TablePagination** + 可选 **useListFilterPagination**，其余（统计卡片、筛选区、表格、Modal）仍按页复制。

**推荐：B（只抽 TablePagination，useListFilterPagination 视情况加）**

理由简述：

1. **与本仓库风格一致**：现有页面已是“每页一文件、内联表格与筛选”，没有大而全的 ProTable；只抽分页 UI 和可选的一层筛选/分页状态，改动面小，不破坏现有习惯。
2. **最小改动**：TablePagination 只替代底栏“共 N 条 + 上一页/下一页”那一块，接口简单（currentPage/totalPages/onPageChange 等），各页替换成本低；useListFilterPagination 仅在“多页都出现相同 filter+slice 模式”时再引入，避免过度抽象。
3. **可维护性**：7 个系统设置页若都手写分页，改样式或加“每页条数”要改 7 处；一个 TablePagination 改一处即可。mock/service/storage 方案与是否抽 UI 无关，但配合 B 更利于后续统一列表体验。

若时间极紧，可先只做 **TablePagination**，useListFilterPagination 留到第二版或等 3 个以上列表页再抽。

---

## 6) 若继续页面内联 mock 且不做 storage/service 的 3 个具体问题

1. **对接后端时改动面大、易漏**：每个列表/表单页都要自己把“读本地数组”改成“调接口”，容易漏改（例如筛选项仍从内联数组取、分页仍用前端 slice）。有统一 service 层后，只需在 service 内把“读 mock/读 storage”换成请求，页面不动。
2. **无法做“刷新不丢”的简单持久化**：例如参数设置/数据字典在原型里改了几条，希望刷新后仍保留，用于演示或给产品看。没有 localStorage 封装和 key 规范，要么每页自己乱写 key、序列化方式不统一，要么做不到；有了 storage + schemaVersion，可约定“某模块优先读 storage，空则用 mock 初始化并写入”。
3. **Mock 数据重复与不一致**：多个页面可能用到同一份基础数据（如字典类型、枚举选项），若各自内联一份，改一处要搜全项目；且同一实体的结构容易在不同页面上演变成两套。集中到 `src/mock/settings/` 并按模块导出，配合 service 统一读，可保证“单源、易查、易改”。

---

*以上为结构与接口规范，不包含具体业务页面实现；实现时按本方案建目录与文件，再在系统设置各页中调用 service、按需使用 TablePagination 与 useLocalStorage。*
