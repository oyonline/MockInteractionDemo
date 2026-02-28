# Mock 与数据层方案建议（物流与报关模块）

> 目标：为基础资料页（物流商/渠道/地址/HS/申报要素）提供 20～50 条可关联、可跨页联动、可模拟审批流的数据，并给出 A/B 方案结论与 MVP 落地方案。

---

## 1) 现状：Mock 分布与 Service 封装

### Mock 数据分布在哪些地方

| 类型 | 位置 | 说明 |
|------|------|------|
| **已走 mock + service + storage** | `src/mock/`、页面调 `*Service` | 系统设置 7 个子模块（params/dict/log/sync/scheduler/enum/basic）、用户管理（users）、角色与权限（roles、rolePermissions）。数据在 mock 文件定义，service 内优先读 localStorage，缺则用 mock 初始化并回写。 |
| **页面内联 mock** | 页面组件内 `useMemo`/常量 | **SupplierListPage.js**：`defaultSupplierData`（约 7 条供应商，第 19～213 行），支持 `data` 注入覆盖。**ExpenseFactPage.js**：`mockApprovalRecords` 大数组（第 171 行起），审批状态/金额等。**ExpenseApprovalListPage.simple.js**：内置 mock（第 6、225 行），父组件不传 `records` 时用。**BrandManagementPage.js**：支持注入，不传则本地 mock（第 9 行）。**CategoryTemplatePage.js**：注释「mock 数据：后续可替换」（第 10 行）。 |
| **仅 state 无持久化** | 各类列表页 | 如 ProductMasterPage、SalesTargetPage、OrganizationManagementPage 等，列表来自 state 或 props，刷新即丢失。 |

**代表性文件**：
- Mock 集中：`src/mock/index.js`（聚合导出）、`src/mock/system/users.js`、`src/mock/settings/params.js`
- 内联大块 mock：`src/pages/SupplierListPage.js`（defaultSupplierData）、`src/pages/ExpenseFactPage.js`（mockApprovalRecords）
- 无 request 层：全仓库无 `src/api`、`src/request` 等，仅有 `src/services/*.js` 封装「读 mock / 读写 localStorage」

### Service / Request 封装现状

- **有**：`src/services/index.js` 导出 `settingsParams`、`userService`、`rolePermissionService`；`src/services/settings.js`、`src/services/system.js` 实现 list/get/create/update/remove（或模块特有方法），内部用 `src/utils/storage.js`（get/set/remove、schemaVersion 包装）和 `src/utils/storageKeys.js`（业务 key 常量）。
- **无**：没有统一的 HTTP request 封装（无 axios/fetch 封装层），没有「按环境切换 mock / 真实接口」的请求层；页面直接调用上述 service，不经过 request。

**结论**：仓库是**混合态**——部分模块已是「mock 目录 + service + localStorage」，部分仍是页面内联 mock；物流与报关目前无任何 mock/service，需新增。

---

## 2) 方案 A vs B 与推荐结论

### 方案 A：继续页面内联 Mock

| 优点 | 缺点 |
|------|------|
| 零基建，新页复制粘贴即跑 | 物流 5 类基础资料 × 20～50 条 = 体量大，内联会撑爆单文件 |
| 与现有 SupplierListPage、ExpenseFactPage 一致 | **关联一致性**难维护：物流商→渠道→规则/费率、SKU→HS→申报要素，改一处要改多处 |
| | **跨页联动**时，列表页与详情页各持一份数据，要么 props 钻取要么全局 state，易不一致 |
| | **审批流**：提交/审核/驳回后状态要持久，内联 mock 刷新即丢失，无法模拟「生效后各页看到」 |
| | 无法复用现有 storage/schemaVersion 与「重置为初始 mock」的交互 |

### 方案 B：新增 src/mock + src/services + localStorage 持久化（按接口形态组织）

| 优点 | 缺点 |
|------|------|
| **关联一致**：mock 按实体生成（物流商 id → 渠道 vendorId → 规则 channelId），service 读写同一份 storage，列表/详情/审批共源 | 需新增 mock 文件、service、storageKeys，首次搭建成本高于单页内联 |
| **跨页联动**：列表 `onOpenDetail` 打开详情 tab，详情用 `get(id)` 取同源数据，刷新/重开 tab 仍一致 | |
| **审批流**：审批状态、审批记录写 storage，各页 list/get 自然拿到最新状态 | |
| 与现有「用户/角色/系统设置」模式统一，后续切真实接口只需改 service 内部 | |
| 支持「重置为初始 mock」、schemaVersion 升级 | |

### 推荐结论

**推荐采用方案 B**：新增 `src/mock/logistics/*`、`src/services/logistics.js`（或扩展现有 services）、扩展 `storageKeys`，按「接口形态」提供 list/get/create/update/remove 及审批相关方法；数据存 localStorage，与现有 `storage.js` 约定一致。

**理由简述**：  
- 物流基础资料**实体多、关联强**（物流商→渠道→地址/HS/申报要素），内联难以维护一致性和 20～50 条可追溯数据。  
- **跨页联动**（列表→详情新 tab）与**审批流**（提交/审核/生效/驳回 + 审批记录）都依赖「单一数据源 + 持久化」，仅方案 B 能自然满足。  
- 仓库已有成熟 B 实践（system、settings），延续同一套 mock/service/storage 成本低、可维护性好。

---

## 3) 方案 B 落地：目录/文件职责与示例接口形态

### 建议新增目录与文件（职责一句话 + 示例）

| 路径 | 职责 |
|------|------|
| `src/utils/storageKeys.js`（扩展现有） | 新增物流相关 key：如 `LOGISTICS_VENDORS`、`LOGISTICS_CHANNELS`、`LOGISTICS_ADDRESSES`、`LOGISTICS_HS`、`LOGISTICS_DECL_ELEMENTS`、`LOGISTICS_APPROVAL_RECORDS` 等，与现有 `ecommerce:` 前缀一致。 |
| `src/mock/logistics/vendors.js` | 物流商基础数据：20～50 条，含 id/name/code/contact/status 等；导出 `getMockVendorList()`，供 service 初始化。 |
| `src/mock/logistics/channels.js` | 渠道数据：每条带 vendorId，与 vendors 关联；导出 `getMockChannelList(vendorList)` 或从同一 seed 生成，保证 id 可追溯。 |
| `src/mock/logistics/addresses.js` | 地址库：可挂 vendorId 或 channelId，与渠道/物流商关联。 |
| `src/mock/logistics/hsCodes.js` | HS 编码表：与 SKU/申报要素可关联（如 hsCode 外键）。 |
| `src/mock/logistics/declElements.js` | 申报要素：按 HS 或通用，与 hsCodes 关联一致。 |
| `src/mock/logistics/approval.js` | 审批流 mock：初始若干条「待提交/待审核/已生效/已驳回」及审批记录，结构含 objectType/objectId/status/approvalSteps。 |
| `src/mock/logistics/index.js` | 聚合导出上述 getMock*，供 `src/mock/index.js` 与 service 引用。 |
| `src/services/logistics.js` | 物流模块 service：实现 vendors/channels/addresses/hs/declElements 的 list/get/create/update/remove；审批相关 submit/approve/reject、getApprovalRecords；内部读 storage，缺则用 mock 初始化并写入。 |
| `src/services/index.js`（扩展现有） | 增加 `export { logisticsService } from './logistics'`（或按子域拆为 logisticsVendorService 等，建议先单文件 logistics.js）。 |

**示例 Service 接口形态（以物流商为例）**

```js
// 与现有 settingsParams / userService 风格一致

logisticsService.vendors = {
  list(query = {}) {
    // query: { keyword, status, page, pageSize }
    // 从 storage.get(LOGISTICS_VENDORS) 或 getMockVendorList() 取数，筛选 + 分页
    return { list: [], total: 0 };
  },
  get(id) {
    // 单条，不存在返回 null
    return null;
  },
  create(payload) {
    // 生成 id（如 vendor_ + Date.now()），写入 storage，返回新对象
    return {};
  },
  update(id, patch) {
    // 合并 patch，写回 storage，返回更新后对象
    return {};
  },
  remove(id) {
    // 从列表中删，写回 storage
  },
};

// 审批（示例）
logisticsService.approval = {
  submit(objectType, objectId) { /* 状态 -> 待审核，写审批记录 */ },
  approve(objectType, objectId, remark) { /* 状态 -> 已生效，写记录 */ },
  reject(objectType, objectId, remark) { /* 状态 -> 已驳回，写记录 */ },
  getRecords(objectType, objectId) { return []; },
};
```

**说明**：list 返回 `{ list, total }`，get 返回单条或 null；create/update 返回对象；remove 无返回或返回新列表；审批相关方法改变状态并追加审批记录，全部读写同一 storage key，保证各页刷新后看到最新状态。

---

## 4) 数据一致性与审批流

### 实体主键策略

| 实体 | 建议主键 | 说明 |
|------|----------|------|
| 物流商 | `vendorId`，如 `vendor_1`、`vendor_1730000000000` | 字符串，新建可用 `vendor_` + Date.now()`，mock 可用 `vendor_1`～`vendor_N`。 |
| 渠道 | `channelId`，如 `channel_1` | 每条带 `vendorId`，关联物流商。 |
| 地址 | `addressId` | 可带 `vendorId` 或 `channelId` 或两者，按业务选。 |
| HS 编码 | `hsCode` 或 `id`（如 `hs_01012100`） | 可与申报要素、SKU 关联。 |
| 申报要素 | `elementId` 或 `id` | 可带 `hsCode` 外键。 |
| 审批记录 | `recordId` | 每条带 objectType、objectId、status、steps（子表或数组）。 |

**关联规则**：mock 生成时先生成 vendors，再根据 vendorId 生成 channels，再生成 addresses（带 vendorId/channelId）；HS 与申报要素可先独立列表，再在「物流单/试算」等业务 mock 里通过 id 引用，保证 20～50 条内 id 可追溯、不冲突。

### 如何生成 20～50 条并保持可追溯

- **方式一**：在 mock 文件中用固定 seed（如 20 个物流商 id），再循环生成渠道/地址，渠道的 vendorId 只从这 20 个里取；HS/申报要素可固定 30 条，id 与名称一一对应。
- **方式二**：写一个 `generateLogisticsMock()`，接收 `{ vendorCount: 25, channelsPerVendor: 2 }` 等，生成 vendors 数组，再生成 channels（每个 channel 指向已有 vendorId），再生成 addresses；导出为 getMockVendorList 等，保证同一份 mock 内 id 一致。
- **可追溯**：所有 list/get 从 storage 读，storage 初次来自 mock；创建/更新/删除只改 storage，不改 mock 源；需要「重置为初始」时，用 mock 重新 set 回 storage即可。

### 审批流与 localStorage

- **状态**：每条业务对象（如某条渠道配置）可有 status：`draft` | `pending` | `approved` | `rejected`；提交 → pending，审核通过 → approved，驳回 → rejected。
- **审批记录**：单独 key（如 `LOGISTICS_APPROVAL_RECORDS`）存数组，每项含 objectType、objectId、submitAt、approveAt、approver、remark、steps（可选，多级审批）。
- **持久化**：必须用 localStorage（方案 B）；提交/审核/驳回时 service 内：1）更新该对象的 status；2）追加一条审批记录。这样列表页、详情页、审批记录页都通过 list/get 读同一 storage，刷新后仍是最新状态。
- **是否需要 localStorage**：是；否则审批后刷新即丢失，无法模拟「生效后各页看到」。

---

## 5) 物流与报关模块最小落地方案（MVP）

### 先做哪些基础资料页（优先级）

| 顺序 | 页面 | 说明 |
|------|------|------|
| 1 | 物流商基础信息 | 列表 + 详情（新 tab）+ 新增/编辑 Modal；列表 20～30 条，支持 keyword/status 筛选、分页。 |
| 2 | 渠道（或「物流渠道」） | 列表带物流商名称（vendorId 解析），详情新 tab；20～50 条，与物流商关联。 |
| 3 | 地址库 | 列表可带物流商/渠道，详情可简化；与渠道/物流商关联一致。 |
| 4 | HS 编码 | 列表 + 详情（可简化）；与申报要素关联，先做独立列表即可。 |
| 5 | 申报要素 | 列表可带 HS 编码，与 HS 关联；字段可先做核心几项。 |

**说明**：物流计划执行、备货试算、物流单-跨境/国内、报关/清关、上架索赔、对账等「业务页」可在基础资料与 service 稳定后再做；MVP 只做「基础资料」的列表 + 详情 + 增删改 + 审批雏形。

### 字段先简化

- **物流商**：id、code、name、contact、phone、status、createdAt；可选 later：银行信息、资质。
- **渠道**：id、vendorId、name、code、type、status；可选 later：费率、时效。
- **地址**：id、vendorId 或 channelId、label、country、region、address、contact；可选 later：邮编、电话。
- **HS**：id/hsCode、name、description；可选 later：税率、监管条件。
- **申报要素**：id、hsCode、elementName、required、example；可选 later：多语言、校验规则。

审批流 MVP：每条资料有 status（draft/pending/approved/rejected）；提供「提交」「审核通过」「驳回」按钮 + 审批记录列表（从 storage 读），不要求多级审批。

### 哪些联动必须做

| 联动 | 实现方式 |
|------|----------|
| 列表 → 详情（新 tab） | 列表页接收 `onOpenDetail`，点击行或「详情」调用 `onOpenDetail({ id, name, path, data })`；App 注入 `openTab`，`renderTabContent` 中详情 path 渲染详情页，`tab.data` 或 `get(id)` 取数。 |
| 物流商 → 渠道 | 渠道 list 支持按 vendorId 筛选；渠道列表/详情展示物流商名称（通过 vendorId 调 vendors.get(vendorId) 或 list 里 join）。 |
| 渠道 / 物流商 → 地址 | 地址 list 支持按 vendorId/channelId 筛选；地址展示所属物流商或渠道名。 |
| HS → 申报要素 | 申报要素 list 支持按 hsCode 筛选；申报要素详情/表单展示 HS 名称（get(hsCode)）。 |
| 审批状态在各页可见 | 所有 list/get 从 storage 读；提交/审核/驳回只改 storage，各页刷新或重新 list 即看到最新 status 与审批记录。 |

**跨页联动与现有约定一致**：使用 `onOpenDetail` + `openTab`，详情页用 `tab.data` 或 `logisticsService.xxx.get(id)` 保证数据同源。

---

## 6) 小结

| 项目 | 结论 |
|------|------|
| **方案选择** | **方案 B**：新增 `src/mock/logistics/*`、`src/services/logistics.js`、扩展 `storageKeys`，按接口形态提供 list/get/create/update/remove 与审批方法，数据 localStorage 持久化。 |
| **数据一致性** | 主键统一（vendorId/channelId/addressId/hsCode/elementId）；mock 按实体顺序生成并关联；所有读写经 service 走 storage，审批状态与记录写 storage，各页同源。 |
| **MVP 范围** | 先做 5 类基础资料（物流商→渠道→地址→HS→申报要素）的列表+详情+增删改，审批流做「提交/审核/驳回+审批记录」；字段先简化，联动做列表→详情新 tab、物流商→渠道→地址、HS→申报要素；业务页（计划/试算/物流单等）后置。 |

若需要，可在下一步输出 `storageKeys` 具体 key 名、`logisticsService` 的完整方法列表与 `getMockVendorList` 的 20 条示例结构，便于直接落代码。
