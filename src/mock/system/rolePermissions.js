/** 角色与权限 mock：功能模块树 + 动作列配置 + 初始角色权限矩阵。 */

// 动作列（权限矩阵表头）
export const MOCK_ACTION_COLUMNS = [
  { id: 'view', label: '查看' },
  { id: 'add', label: '新增' },
  { id: 'edit', label: '编辑' },
  { id: 'import', label: '导入' },
  { id: 'export', label: '导出' },
  { id: 'delete', label: '删除' },
  { id: 'batchDelete', label: '批量删除' },
  { id: 'print', label: '打印' },
];

// 功能模块树（按模块分组，支持父子）
export const MOCK_PERMISSION_MODULES = [
  {
    id: 'module_pda',
    name: 'PDA',
    preset: true,
    children: [
      { id: 'pda_scan', name: '扫码入库' },
      { id: 'pda_pick', name: '拣货' },
      { id: 'pda_out', name: '出库' },
    ],
  },
  {
    id: 'module_new',
    name: '新品页',
    preset: false,
    children: [
      { id: 'new_list', name: '新品列表' },
      { id: 'new_apply', name: '新品申请' },
    ],
  },
  {
    id: 'module_product',
    name: '产品',
    preset: true,
    children: [
      { id: 'product_master', name: '产品主数据' },
      { id: 'product_bom', name: 'BOM管理' },
      { id: 'product_attr', name: '属性管理' },
    ],
  },
  {
    id: 'module_order',
    name: '订单/销售',
    preset: true,
    children: [
      { id: 'order_list', name: '订单列表' },
      { id: 'order_export', name: '订单导出' },
      { id: 'order_refund', name: '售后/退款' },
    ],
  },
  {
    id: 'module_warehouse',
    name: '仓库',
    preset: true,
    children: [
      { id: 'wh_inbound', name: '入库单' },
      { id: 'wh_outbound', name: '出库单' },
      { id: 'wh_inventory', name: '库存查询' },
    ],
  },
];

/** 扁平化：用于表格行（含分组行），每项 { id, name, level, moduleId?, isGroup } */
export function flattenPermissionRows(modules) {
  const rows = [];
  (modules || []).forEach((mod) => {
    rows.push({ id: mod.id, name: mod.name, level: 0, moduleId: mod.id, isGroup: true });
    (mod.children || []).forEach((c) => {
      rows.push({ id: c.id, name: c.name, level: 1, moduleId: mod.id, isGroup: false });
    });
  });
  return rows;
}

/** 初始权限：默认管理员全选、其他角色部分勾选（原型用） */
function buildInitialRolePermissions(roleId, actionColumns) {
  const perms = {};
  const allActionIds = (actionColumns || []).map((a) => a.id);
  MOCK_PERMISSION_MODULES.forEach((mod) => {
    [mod.id, ...(mod.children || []).map((c) => c.id)].forEach((rowId) => {
      perms[rowId] = {};
      allActionIds.forEach((aid) => {
        perms[rowId][aid] = roleId === 'role_admin' || (rowId === mod.id && aid === 'view');
      });
    });
  });
  return perms;
}

/** 返回 permissionMeta（模块树 + 动作列 + 扁平行） */
export function getMockPermissionMeta() {
  return {
    actionColumns: MOCK_ACTION_COLUMNS.map((a) => ({ ...a })),
    modules: MOCK_PERMISSION_MODULES.map((m) => ({
      ...m,
      children: (m.children || []).map((c) => ({ ...c })),
    })),
    flatRows: flattenPermissionRows(MOCK_PERMISSION_MODULES),
  };
}

/** 返回所有角色的初始权限 { [roleId]: { [rowId]: { [actionId]: boolean } } } */
export function getMockInitialRolePermissions() {
  const meta = getMockPermissionMeta();
  const byRole = {};
  ['role_admin', 'role_product', 'role_ops', 'role_sales', 'role_finance', 'role_hr', 'role_dev', 'role_procurement', 'role_warehouse', 'role_cs'].forEach((rid) => {
    byRole[rid] = buildInitialRolePermissions(rid, meta.actionColumns);
  });
  return byRole;
}

// ---------- 字段权限 meta（表格：字段 | 可见 | 不可见 | 仅跟进人可见）----------
export const MOCK_FIELD_PERMISSION_FIELDS = [
  { id: 'cost', name: '采购成本' },
  { id: 'price', name: '库存单价' },
  { id: 'profit', name: '利润' },
  { id: 'supplier', name: '供应商' },
  { id: 'stock', name: '库存数量' },
];

export function getMockFieldPermissionMeta() {
  return {
    options: [
      { id: 'visible', label: '可见' },
      { id: 'invisible', label: '不可见' },
      { id: 'follower', label: '仅跟进人可见' },
    ],
    fields: MOCK_FIELD_PERMISSION_FIELDS.map((f) => ({ ...f })),
  };
}

// ---------- 数据权限 meta（二级 Tabs + 权限设置表格）----------
export const MOCK_DATA_PERMISSION_SUBTABS = [
  { key: 'sku', label: 'SKU数据权限' },
  { key: 'doc', label: '单据数据权限' },
  { key: 'log', label: '全局日志数据权限' },
  { key: 'listing', label: 'Listing数据权限' },
  { key: 'tool', label: '工具数据权限' },
];

export const MOCK_DATA_PERMISSION_SCOPE_OPTIONS = [
  { id: 'self', label: '本人' },
  { id: 'dept', label: '部门' },
  { id: 'user', label: '用户' },
];

export const MOCK_DATA_PERMISSION_ROWS = [
  { moduleId: 'order', moduleName: '订单', functionId: 'order_list', functionName: '订单列表' },
  { moduleId: 'order', moduleName: '订单', functionId: 'order_export', functionName: '订单导出' },
  { moduleId: 'product', moduleName: '产品', functionId: 'product_master', functionName: '产品主数据' },
];

export function getMockDataPermissionMeta() {
  return {
    subTabs: MOCK_DATA_PERMISSION_SUBTABS.map((t) => ({ ...t })),
    scopeOptions: MOCK_DATA_PERMISSION_SCOPE_OPTIONS.map((o) => ({ ...o })),
    rows: MOCK_DATA_PERMISSION_ROWS.map((r) => ({ ...r })),
  };
}
