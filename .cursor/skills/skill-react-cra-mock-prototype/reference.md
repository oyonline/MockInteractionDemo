# 系统设置 7 页面字段与操作（参考）

每页至少：标题+说明、筛选、表格、分页、Modal（如适用）、成功/失败提示。

---

## 4.1 /settings/params 参数设置（推荐第一个实现）

- **表格字段**：`key, value, desc, group, status, updatedAt`
- **操作**：新增/编辑/删除、启用/停用
- **筛选**：keyword + group/status（二选一即可）
- **持久化**：是

---

## 4.2 /settings/log 系统日志

- **字段**：`time, module, action, result, operator, detail`
- **操作**：查看详情（Modal 展示 JSON）；一般不提供 create/update/remove（可选“清空日志”）
- **筛选**：keyword + module/result（简化）
- **持久化**：可选（若需“同步/任务执行写日志”则建议持久化）

---

## 4.3 /settings/sync 接口同步

- **字段**：`name, endpoint, lastRunAt, status, durationMs, lastResult`
- **操作**：手动同步（模拟 loading → success/fail）、查看详情（Modal）
- **与日志联动**：同步完成写入 settings log（推荐）

---

## 4.4 /settings/dict 数据字典

- **UI**：类型列表 + 项目表格（左右或上下均可）
- **类型字段**：`typeCode, typeName, status`
- **项字段**：`value, label, status, sort`
- **操作**：类型新增/编辑/删除；项新增/编辑/删除、启用/禁用、排序（sort 数值）

---

## 4.5 /settings/basic 基础配置

- **UI**：分组卡片配置
- **字段**：`key, label, value, desc, type(text/select/switch)`
- **操作**：编辑保存、恢复默认（可选）
- **持久化**：是

---

## 4.6 /settings/enum 枚举与规则

- **UI**：规则列表
- **字段**：`code, name, expression, priority, status`
- **操作**：新增/编辑、启用停用、调整 priority（上移下移）

---

## 4.7 /settings/scheduler 定时任务

- **字段**：`name, cron, status, lastRunAt, nextRunAt`
- **操作**：启用停用、立即执行（模拟生成一次 run 记录并写入日志）
- **持久化**：可选（建议是）
