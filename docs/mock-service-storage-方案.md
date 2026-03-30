# Mock / Service / Storage 方案（已实施）

> 本文档记录项目 mock、service、storage 层的实现方案。**当前状态：已完全实施**

---

## 实施状态概览

| 模块 | 状态 | 说明 |
|------|------|------|
| `src/mock/` | ✅ 已实施 | 按模块组织 mock 数据 |
| `src/services/` | ✅ 已实施 | Service 层统一封装 |
| `src/utils/storage.js` | ✅ 已实施 | localStorage 封装 |
| `src/utils/storageKeys.js` | ✅ 已实施 | Key 常量定义 |
| `src/hooks/useLocalStorage.js` | ✅ 已实施 | 状态同步 Hook |
| `src/components/TablePagination.js` | ✅ 已实施 | 分页组件 |
| `src/components/ActionBar.js` | ✅ 已实施 | 操作栏组件 |

---

## 1) 文件/目录结构

### 已创建的文件清单

| 路径 | 职责 |
|------|------|
| `src/mock/index.js` | 统一入口：按模块 re-export 各 mock 数据 |
| `src/mock/settings/basic.js` | 基础配置 mock |
| `src/mock/settings/dict.js` | 数据字典 mock |
| `src/mock/settings/enum.js` | 枚举与规则 mock |
| `src/mock/settings/sync.js` | 接口同步 mock |
| `src/mock/settings/params.js` | 参数设置 mock |
| `src/mock/settings/scheduler.js` | 定时任务 mock |
| `src/mock/settings/log.js` | 系统日志 mock |
| `src/mock/logistics/vendors.js` | 物流商 mock |
| `src/mock/logistics/channels.js` | 物流渠道 mock |
| `src/mock/logistics/addresses.js` | 仓库地址 mock |
| `src/mock/logistics/hsCodes.js` | HSCode mock |
| `src/mock/logistics/declarations.js` | 申报资料 mock |
| `src/mock/logistics/routingRules.js` | 路由规则 mock |
| `src/mock/logistics/consolidationRules.js` | 集货规则 mock |
| `src/mock/system/users.js` | 用户 mock |
| `src/mock/system/roles.js` | 角色 mock |
| `src/mock/system/rolePermissions.js` | 权限 mock |
| `src/services/index.js` | Service 统一入口 |
| `src/services/settings.js` | 系统设置 service |
| `src/services/logistics.js` | 物流服务 |
| `src/services/system.js` | 系统服务 |
| `src/utils/storage.js` | localStorage 封装 |
| `src/utils/storageKeys.js` | 业务 key 常量 |
| `src/hooks/useLocalStorage.js` | localStorage Hook |
| `src/components/TablePagination.js` | 分页 UI 组件 |
| `src/components/ActionBar.js` | 表格操作栏组件 |

---

## 2) Mock 数据组织方式

### 按模块组织

```
src/mock/
├── index.js              # 统一导出
├── settings/             # 系统设置
│   ├── basic.js
│   ├── dict.js
│   ├── enum.js
│   ├── log.js
│   ├── params.js
│   ├── scheduler.js
│   └── sync.js
├── logistics/            # 物流与报关
│   ├── addresses.js
│   ├── channels.js
│   ├── consolidationRules.js
│   ├── declarations.js
│   ├── hsCodes.js
│   ├── index.js
│   ├── routingRules.js
│   └── vendors.js
└── system/               # 系统权限
    ├── rolePermissions.js
    ├── roles.js
    └── users.js
```

### 数据导出示例

```javascript
// src/mock/settings/params.js
const mockParams = [
  { id: 1, key: 'site_name', value: 'EPoseidon', description: '站点名称' },
  // ...
];

export default mockParams;
export const getMockParamsList = () => mockParams;
```

---

## 3) Service 层接口形态

### 通用接口约定

```javascript
// list(query) → { list, total }
const { list, total } = await service.list({ 
  keyword: '', 
  status: '', 
  page: 1, 
  pageSize: 10 
});

// get(id) → 单条数据对象
const record = await service.get(id);

// create(payload) → 新对象
const newRecord = await service.create({ name: 'xxx' });

// update(id, patch) → 更新后对象
const updated = await service.update(id, { name: 'yyy' });

// remove(id) → void
await service.remove(id);
```

### 实际使用示例

```javascript
// 页面中调用
import { logisticsVendor } from '@/services/logistics';

// 获取列表
const { list, total } = await logisticsVendor.list({ 
  keyword: searchText,
  page: currentPage,
  pageSize: 10
});

// 获取详情
const vendor = await logisticsVendor.get(vendorId);
```

---

## 4) localStorage 规范

### Key 命名规则

- 统一前缀：`ecommerce:`
- 格式：`ecommerce:<module>:<entity>`

```javascript
// src/utils/storageKeys.js
const PREFIX = 'ecommerce:';

export const SETTINGS_PARAMS = PREFIX + 'settings:params';
export const SETTINGS_DICT = PREFIX + 'settings:dict';
export const LOGISTICS_VENDORS = PREFIX + 'logistics:vendors';
// ...
```

### storage.js 功能

```javascript
import { storage } from '@/utils/storage';

// 基础操作
storage.get(key);
storage.set(key, value);
storage.remove(key);
storage.clear();

// 按前缀清除
storage.clearByPrefix('ecommerce:settings:');
```

### useLocalStorage Hook

```javascript
import { useLocalStorage } from '@/hooks/useLocalStorage';

// 状态自动持久化
const [value, setValue] = useLocalStorage('ecommerce:user:preferences', defaultValue);
```

---

## 5) 组件使用

### TablePagination

```jsx
import { TablePagination } from '@/components/TablePagination';

<TablePagination
  currentPage={currentPage}
  totalPages={totalPages}
  total={total}
  onPageChange={setCurrentPage}
  itemName="条记录"
/>
```

### ActionBar

```jsx
import { ActionBar } from '@/components/ActionBar';

<ActionBar
  primaryAction={{ label: '编辑', onClick: handleEdit }}
  secondaryAction={{ label: '查看', onClick: handleView }}
  moreActions={[
    { label: '删除', onClick: handleDelete, danger: true }
  ]}
/>
```

---

## 6) 后续扩展建议

| 方向 | 建议 |
|------|------|
| 新增模块 | 按同样模式创建 `src/mock/[模块]/` + `src/services/[模块].js` |
| 后端对接 | 只需修改 service 层，页面代码无需改动 |
| 数据迁移 | 使用 storage.js 的 schemaVersion 机制做数据版本控制 |
| Mock 开关 | 可在 `src/mock/index.js` 添加 `__USE_MOCK__` 全局开关 |

---

*方案已完全实施，如有新模块开发，请遵循本文档约定。*

*最后更新：2026-03-27*
