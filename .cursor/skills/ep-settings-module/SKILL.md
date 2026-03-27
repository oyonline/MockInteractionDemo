---
name: ep-settings-module
description: Develop system settings module for EPoseidon2.0 IT admin. Use when creating or modifying settings pages including basic config, data dictionary, enum rules, API sync, parameters, scheduler jobs, or system logs. Covers CRUD operations with localStorage persistence.
---

# EPoseidon2.0 系统设置模块（IT专用）

## 7 个设置页面

| Path | 页面 | 特性 | 优先级 |
|------|------|------|--------|
| `/settings/params` | 参数设置 | key/value，高持久化价值 | ⭐ 1 |
| `/settings/log` | 系统日志 | 只读，查看详情 | ⭐ 2 |
| `/settings/scheduler` | 定时任务 | cron + 立即执行 | ⭐ 3 |
| `/settings/sync` | 接口同步 | 与日志联动 | ⭐ 4 |
| `/settings/dict` | 数据字典 | 二级结构（类型+项目） | ⭐ 5 |
| `/settings/basic` | 基础配置 | 分组卡片 | ⭐ 6 |
| `/settings/enum` | 枚举规则 | 优先级排序 | ⭐ 7 |

## 已实现页面

✅ `SettingsParamsPage.js` - 参数设置
✅ `SettingsLogPage.js` - 系统日志
✅ `SettingsSchedulerPage.js` - 定时任务
✅ `SettingsApiSyncPage.js` - 接口同步
✅ `SettingsDictPage.js` - 数据字典
✅ `SettingsBasicPage.js` - 基础配置
✅ `SettingsEnumRulePage.js` - 枚举规则

## 开发步骤

```
- [ ] 1. 确认页面是否已存在（上述7页已完成）
- [ ] 2. 如需修改，参考对应页面文件
- [ ] 3. Mock 数据在 `src/mock/settings/`
- [ ] 4. Service 在 `src/services/settings.js`
```

## Storage Key 规范

```
ecommerce:settings:basic
ecommerce:settings:dict
ecommerce:settings:enum
ecommerce:settings:sync
ecommerce:settings:params
ecommerce:settings:scheduler
ecommerce:settings:log
```

## 页面结构模板（已存在）

参考 `SettingsParamsPage.js`：

```javascript
export default function SettingsParamsPage() {
    const [data, setData] = useState([]);
    const [query, setQuery] = useState({ keyword: '', status: '', page: 1 });
    const [modalVisible, setModalVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);

    // 加载数据
    useEffect(() => {
        const { list, total } = getParamsList(query);
        setData(list);
    }, [query]);

    // 表格列：key, value, desc, group, status, updatedAt
    // 操作：新增、编辑、删除、启用/停用
    // Modal：表单编辑
}
```

## 与日志联动

scheduler/sync 操作后写入日志：

```javascript
import { addLog } from '../services/settings';

// 执行操作后
addLog({
    module: '定时任务',
    action: `执行任务: ${taskName}`,
    result: 'success',
    operator: '当前用户',
    detail: { taskId: id, durationMs: 1234 }
});
```

## 快速检查清单

- [ ] 页面使用 `ecommerce:settings:*` 前缀的 storage key
- [ ] 数据通过 `services/settings.js` 读写
- [ ] 列表返回 `{ list, total }` 格式
- [ ] 包含筛选、表格、分页、Modal
- [ ] 操作后自动刷新列表
