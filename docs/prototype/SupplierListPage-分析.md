# SupplierListPage.js 结构分析

**文件路径**：`src/pages/SupplierListPage.js`

---

## 1) 页面 UI 结构分区

| 分区 | 位置（行号） | 说明 |
|------|--------------|------|
| **统计卡片** | 314–358 | `grid grid-cols-4 gap-4 mb-4`，4 个白底卡片：供应商总数（启用数）、A 级供应商（占比）、关联 SKU（均值）、近期采购额（本季度累计）。每卡含标题、主数字、副文案、右侧图标。 |
| **筛选区** | 360–339 | `bg-white rounded-lg shadow-sm p-4 mb-4`。顶部一行：左侧标题「供应商管理」、右侧「新增供应商」按钮；下方一行：关键词 input（带 Search 图标）+ 类型/品类/状态/评级 4 个 select +「重置」按钮。筛选变更时会 `setCurrentPage(1)`。 |
| **表格区** | 341–424 | `flex-1 bg-white rounded-lg shadow-sm`，内层 `overflow-auto`，`<table className="w-full text-sm min-w-[1300px]">`。表头 sticky，12 列（编码/名称/类型/品类/联系人/联系方式/状态/评级/关联SKU/近期采购额/合作日期/操作）。空数据时显示「暂无符合条件的供应商」占位。 |
| **分页区** | 406–432 | 表格卡片底边 `border-t bg-gray-50`：左侧「共 N 家供应商（已筛选…）」；右侧「上一页 / 当前页/总页数 / 下一页」按钮，仅 `totalPages > 1` 时显示。 |
| **Modal** | 434–548 | `showCreateModal` 为 true 时渲染：固定全屏遮罩 + 居中 `w-[800px] max-h-[90vh]` 白框。结构：标题栏（编辑/新增 + 关闭）、滚动表单区、底部「取消」「确认新增/保存修改」。 |

整体根容器：`<div className="flex flex-col h-full">`，表格区用 `flex-1` 占满剩余高度。

---

## 2) 状态变量清单（useState）

| 变量 | 初始值 | 用途 |
|------|--------|------|
| `filters` | `{ keyword: '', type: '', status: '', rating: '', category: '' }` | 筛选条件；变更时由各 input/select 的 onChange 更新，并常伴随 `setCurrentPage(1)`。 |
| `showCreateModal` | `false` | 控制新增/编辑弹窗显隐。打开：新增按钮或 `handleEdit(supplier)`；关闭：`handleCloseModal()`。 |
| `editingSupplier` | `null` | 当前编辑行数据；新增时为 null，编辑时为对应 supplier 对象。与 `showCreateModal` 一起控制标题和表单项 defaultValue。 |
| `currentPage` | `1` | 当前页码，用于 `paginatedData` 的 slice；重置筛选时置为 1。 |

**非 state**：`pageSize = 10` 为组件内常量，未放入 state。

---

## 3) 列表数据流：数据源 → filtered → paged → render

```
数据源 supplierData
    = props.data ?? 组件内 Mock 数组（8 条）
        ↓
filteredData = useMemo(
  () => supplierData.filter(按 filters：keyword/type/status/rating/category 匹配),
  [supplierData, filters]
)
        ↓
paginatedData = useMemo(
  () => filteredData.slice((currentPage - 1) * pageSize, (currentPage - 1) * pageSize + pageSize),
  [filteredData, currentPage, pageSize]
)
        ↓
totalPages = Math.ceil(filteredData.length / pageSize)
        ↓
渲染：<tbody>{ paginatedData.map(supplier => <tr>...</tr>) }</tbody>
      底部分页展示 filteredData.length / totalPages / currentPage
```

- **数据源**：优先用父组件传入的 `data`（props 命名为 `externalData`），否则用页面内 Mock 数组。
- **筛选**：关键词匹配 name/code/shortName（不区分大小写）；类型/状态/评级/品类为精确匹配。
- **分页**：前端内存分页，固定 `pageSize = 10`。

---

## 4) Modal 表单字段清单与校验方式

**字段清单**（按表单顺序）：

| 字段 | 类型 | 必填（UI） | 编辑时 | 说明 |
|------|------|------------|--------|------|
| 供应商编码 | input text | 标* | disabled | defaultValue=editingSupplier?.code，占位「系统自动生成」 |
| 供应商简称 | input text | 标* | 可编辑 | placeholder 10 字以内 |
| 供应商全称 | input text | 标* | 可编辑 | 占位「完整公司名称」 |
| 供应商类型 | select | 标* | 可编辑 | typeOptions |
| 主营品类 | input text | 标* | 可编辑 | 占位「主营品类」 |
| 联系人 | input text | 标* | 可编辑 | 占位「联系人姓名」 |
| 联系电话 | input tel | 标* | 可编辑 | 占位「联系电话」 |
| 邮箱 | input email | 否 | 可编辑 | 占位「邮箱地址」 |
| 结算方式 | select | 否 | 可编辑 | 现结/预付50%/预付全款/月结30天/45天/60天 |
| 详细地址 | input text | 否 | 可编辑 | 占位「详细地址」 |
| 营业执照号 | input text | 否 | 可编辑 | 占位「统一社会信用代码」 |
| 税率(%) | select | 否 | 可编辑 | 0/1/3/6/9/13 |
| 银行账户 | input text | 否 | 可编辑 | 占位「开户行及账号」 |
| 状态 | select | 否 | 仅编辑时显示 | statusOptions |
| 评级 | select | 否 | 仅编辑时显示 | 待评定 + ratingOptions |

**校验方式**：**无**。所有表单项均为**非受控**（`defaultValue`），底部「确认新增」「保存修改」按钮**没有** `onClick` 处理函数，没有提交逻辑、没有必填校验、没有错误提示。当前 Modal 仅做展示与关闭，未接真实新增/更新。

---

## 5) 分页实现方式

- **pageSize**：**固定**，`const pageSize = 10`，无下拉或配置。
- **实现**：纯前端分页。
  - `paginatedData = filteredData.slice((currentPage - 1) * pageSize, start + pageSize)`。
  - 底栏：上一页（`setCurrentPage(p => Math.max(1, p - 1))`）、`currentPage / totalPages` 文案、下一页（`setCurrentPage(p => Math.min(totalPages, p + 1))`）。
  - 仅当 `totalPages > 1` 时渲染上一页/下一页区域。
- **无**每页条数切换、无跳页、无总数展示（总数在左侧「共 N 家供应商」中）。

---

## 6) 迁移到「系统设置-参数设置/系统日志/接口同步」时的最小抽象建议

**可复用模式**：统计卡片（可选）、筛选区 + 表格 + 前端分页 + 新增/编辑 Modal；数据流 数据源 → filter → slice → 渲染。

---

### 方案 A：不抽组件（复制粘贴，最小改动）

- **做法**：为参数设置/系统日志/接口同步各复制一版 SupplierListPage，只改：页面标题、数据源（mock 或后续接口）、`filters` 字段与选项、表格列与操作、Modal 表单项。分页逻辑、`currentPage`/`pageSize`、Modal 显隐/`editingSupplier` 保持原样。
- **优点**：改动的都是「业务差异」部分，不动现有结构；每个页面独立，互不影响。
- **缺点**：分页 UI、筛选区布局、Modal 壳子会重复 3 份；若以后改分页样式或加校验要改多处。
- **适用**：页面数量少（3 个）、且短期内以「能跑起来」为主、不追求统一分页/弹窗体验时。

**最小改动点**：只改「数据 + 列 + 筛选项 + Modal 字段」，其余照抄。

---

### 方案 B：抽 1～2 个最小通用模块

建议只抽两处复用率高、且与业务弱相关的部分：

1. **TablePagination 组件**（推荐必抽）  
   - **入参**：`currentPage`, `totalPages`, `totalItems`, `pageSize`（可选，仅用于展示「每页 N 条」时用）, `onPageChange(page)`, 可选 `itemName`（如「条」「家」）用于文案「共 N 条」。  
   - **职责**：左侧文案「共 N itemName」+ 上一页/下一页按钮 + 禁用态。  
   - **位置**：如 `src/components/TablePagination.js`（或 `src/components/common/TablePagination.js`）。  
   - **原因**：三个系统设置页分页逻辑完全一致，抽成组件后改样式或加「每页条数」只改一处；页面内仍保留 `currentPage` state 和 `paginatedData` 的 slice 逻辑（或再抽成 `usePagination(filteredData, pageSize)` 见下）。

2. **useListFilterPagination hook**（可选）  
   - **入参**：`data`（原始列表）, `filterFn(filters, item) => boolean`, 可选 `initialFilters`, `pageSize = 10`。  
   - **返回**：`{ filters, setFilters, resetFilters, filteredData, paginatedData, currentPage, setCurrentPage, totalPages, pageSize }`。  
   - **职责**：统一「筛选 + 分页」状态与派生数据；各页面只传数据和自己的 filter 逻辑，减少重复的 useMemo 和 setCurrentPage(1)。  
   - **位置**：如 `src/hooks/useListFilterPagination.js`。  
   - **原因**：参数设置/系统日志/接口同步的筛选字段不同，但「关键词 + 若干下拉 + 重置 → filtered → paged」模式相同，hook 可只管状态与计算，UI 仍各写各的。

**不建议当前阶段抽的**：  
- 通用「列表页布局」或「SearchForm」组件：各页面筛选项和统计卡片差异大，抽象收益小。  
- 通用 Modal 表单组件：字段和校验需求不同，保留每页一个 Modal 更清晰。  
- 表格组件：列和操作列差异大，用配置驱动反而增加理解成本，复制表格 JSX 更直接。

**小结**：  
- **A**：完全不抽，三个系统设置页各复制一份 SupplierListPage，只改数据/列/筛选项/Modal。  
- **B**：只抽 **TablePagination**（必选）+ 可选 **useListFilterPagination**，其余（统计卡片、筛选区、表格、Modal）仍按页复制并改业务内容。

这样在「最小改动」和「后续统一分页/筛选逻辑」之间取得平衡，且不引入过多抽象。
