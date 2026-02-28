/** 角色与权限 mock：角色列表，供 rolePermissionService 初始化与持久化。 */

export const MOCK_ROLES = [
  { id: 'role_admin', name: '系统管理员', preset: true },
  { id: 'role_product', name: '产品经理', preset: true },
  { id: 'role_ops', name: '运营', preset: false },
  { id: 'role_sales', name: '销售', preset: false },
  { id: 'role_finance', name: '财务', preset: false },
  { id: 'role_warehouse', name: '仓库', preset: false },
];

export default function getMockRoleList() {
  return MOCK_ROLES.map((r) => ({ ...r }));
}
