/** 用户管理 mock：用户列表 + 下拉元数据，供 userService 初始化与 reset 使用。 */

function ts(dayOffset, h, m) {
  const d = new Date();
  d.setDate(d.getDate() - dayOffset);
  d.setHours(h, m, 0, 0);
  return d.toISOString().slice(0, 19).replace('T', ' ');
}

export const MOCK_ROLES = ['管理员', '产品经理', '运营', '销售', '财务', '人事', '开发', '采购', '仓库', '客服'];

export const MOCK_DEPTS = [
  { id: 'D_TECH', name: '技术部' },
  { id: 'D_PRODUCT', name: '产品部' },
  { id: 'D_OPS', name: '运营部' },
  { id: 'D_SALES', name: '销售部' },
  { id: 'D_FIN', name: '财务部' },
  { id: 'D_HR', name: '人事部' },
  { id: 'D_PROC', name: '采购部' },
  { id: 'D_LOG', name: '物流部' },
  { id: 'D_CS', name: '客服部' },
];

export const MOCK_STORES = [
  { id: 'S_AMZ_US', name: 'Amazon-US' },
  { id: 'S_AMZ_EU', name: 'Amazon-EU' },
  { id: 'S_SHOPEE_SG', name: 'Shopee-SG' },
  { id: 'S_WMT_US', name: 'Walmart-US' },
];

export const MOCK_WAREHOUSES = [
  { id: 'W_SH', name: '上海仓' },
  { id: 'W_GZ', name: '广州仓' },
  { id: 'W_US_LA', name: '美国LA仓' },
  { id: 'W_DE', name: '德国仓' },
];

export const MOCK_ACCOUNTS_1688 = [
  { id: 'A1688_01', name: '1688-采购一组' },
  { id: 'A1688_02', name: '1688-采购二组' },
  { id: 'A1688_03', name: '1688-辅料账号' },
];

export const MOCK_PLANS = [
  { id: 'P_DEFAULT', name: '默认计划' },
  { id: 'P_SALES', name: '销售计划' },
  { id: 'P_STOCK', name: '备货计划' },
];

const deptIdByName = Object.fromEntries(MOCK_DEPTS.map((d) => [d.name, d.id]));

const MOCK_USERS = [
  { id: 'u1', username: 'admin', realName: '系统管理员', phone: '13800138000', email: 'admin@company.com', status: 'enabled', deptId: deptIdByName['技术部'], department: '技术部', storeId: 'S_AMZ_US', warehouseId: 'W_SH', account1688Id: 'A1688_01', createdAt: ts(90, 9, 0), roles: '管理员', permissionSummary: '系统设置、用户管理、角色权限', loginCount: 256, lastLoginAt: ts(0, 8, 30), lastLoginIp: '192.168.1.100', thirdPartyAuth: null },
  { id: 'u2', username: 'zhangsan', realName: '张三', phone: '13800138001', email: 'zhangsan@company.com', status: 'enabled', deptId: deptIdByName['产品部'], department: '产品部', storeId: 'S_AMZ_EU', warehouseId: 'W_SH', account1688Id: 'A1688_01', createdAt: ts(80, 10, 0), roles: '产品经理', permissionSummary: '产品主数据、BOM、类目', loginCount: 120, lastLoginAt: ts(1, 9, 15), lastLoginIp: '192.168.1.101', thirdPartyAuth: null },
  { id: 'u3', username: 'lisi', realName: '李四', phone: '13800138002', email: 'lisi@company.com', status: 'enabled', deptId: deptIdByName['运营部'], department: '运营部', storeId: 'S_SHOPEE_SG', warehouseId: 'W_GZ', account1688Id: 'A1688_02', createdAt: ts(70, 14, 0), roles: '运营', permissionSummary: '订单、库存、店铺', loginCount: 89, lastLoginAt: ts(2, 10, 0), lastLoginIp: '192.168.1.102', thirdPartyAuth: '企业微信' },
  { id: 'u4', username: 'wangwu', realName: '王五', phone: '13800138003', email: 'wangwu@company.com', status: 'enabled', deptId: deptIdByName['销售部'], department: '销售部', storeId: 'S_WMT_US', warehouseId: 'W_US_LA', account1688Id: 'A1688_03', createdAt: ts(60, 9, 30), roles: '销售', permissionSummary: '销售主数据、目标、预测', loginCount: 156, lastLoginAt: ts(0, 17, 20), lastLoginIp: '192.168.1.103', thirdPartyAuth: null },
  { id: 'u5', username: 'zhaoliu', realName: '赵六', phone: '13800138004', email: 'zhaoliu@company.com', status: 'disabled', deptId: deptIdByName['财务部'], department: '财务部', storeId: 'S_AMZ_US', warehouseId: 'W_SH', account1688Id: null, createdAt: ts(50, 11, 0), roles: '财务', permissionSummary: '成本中心、分摊、预算', loginCount: 45, lastLoginAt: ts(30, 16, 0), lastLoginIp: '192.168.1.104', thirdPartyAuth: null },
  { id: 'u6', username: 'sunqi', realName: '孙七', phone: '13800138005', email: 'sunqi@company.com', status: 'enabled', deptId: deptIdByName['人事部'], department: '人事部', storeId: '', warehouseId: '', account1688Id: '', createdAt: ts(45, 8, 0), roles: '人事', permissionSummary: '组织架构、用户、角色', loginCount: 67, lastLoginAt: ts(3, 9, 0), lastLoginIp: '192.168.1.105', thirdPartyAuth: null },
  { id: 'u7', username: 'zhouba', realName: '周八', phone: '13800138006', email: 'zhouba@company.com', status: 'enabled', deptId: deptIdByName['技术部'], department: '技术部', storeId: 'S_AMZ_EU', warehouseId: 'W_DE', account1688Id: 'A1688_02', createdAt: ts(40, 10, 0), roles: '开发', permissionSummary: '接口同步、定时任务、日志', loginCount: 98, lastLoginAt: ts(1, 14, 30), lastLoginIp: '192.168.1.106', thirdPartyAuth: null },
  { id: 'u8', username: 'wujiu', realName: '吴九', phone: '13800138007', email: 'wujiu@company.com', status: 'enabled', deptId: deptIdByName['运营部'], department: '运营部', storeId: 'S_SHOPEE_SG', warehouseId: 'W_GZ', account1688Id: 'A1688_02', createdAt: ts(35, 15, 0), roles: '运营', permissionSummary: '物流单、报关、对账', loginCount: 72, lastLoginAt: ts(2, 11, 0), lastLoginIp: '192.168.1.107', thirdPartyAuth: '钉钉' },
  { id: 'u9', username: 'zhengshi', realName: '郑十', phone: '13800138008', email: 'zhengshi@company.com', status: 'enabled', deptId: deptIdByName['销售部'], department: '销售部', storeId: 'S_WMT_US', warehouseId: 'W_US_LA', account1688Id: '', createdAt: ts(30, 9, 0), roles: '销售', permissionSummary: '销售目标、达成、预测', loginCount: 134, lastLoginAt: ts(0, 16, 45), lastLoginIp: '192.168.1.108', thirdPartyAuth: null },
  { id: 'u10', username: 'chenyy', realName: '陈一一', phone: '13800138009', email: 'chenyy@company.com', status: 'enabled', deptId: deptIdByName['产品部'], department: '产品部', storeId: 'S_AMZ_US', warehouseId: 'W_SH', account1688Id: 'A1688_01', createdAt: ts(28, 14, 0), roles: '产品经理', permissionSummary: '属性、标签、编码规则', loginCount: 55, lastLoginAt: ts(5, 10, 0), lastLoginIp: '192.168.1.109', thirdPartyAuth: null },
  { id: 'u11', username: 'linse', realName: '林二', phone: '13800138010', email: 'linse@company.com', status: 'enabled', deptId: deptIdByName['技术部'], department: '技术部', storeId: 'S_AMZ_EU', warehouseId: 'W_DE', account1688Id: '', createdAt: ts(25, 10, 30), roles: '开发', permissionSummary: '数据字典、基础配置', loginCount: 88, lastLoginAt: ts(1, 8, 0), lastLoginIp: '192.168.1.110', thirdPartyAuth: null },
  { id: 'u12', username: 'huangsan', realName: '黄三', phone: '13800138011', email: 'huangsan@company.com', status: 'disabled', deptId: deptIdByName['财务部'], department: '财务部', storeId: 'S_AMZ_US', warehouseId: 'W_SH', account1688Id: null, createdAt: ts(22, 11, 0), roles: '财务', permissionSummary: '费用、预算版本', loginCount: 23, lastLoginAt: ts(45, 9, 0), lastLoginIp: '192.168.1.111', thirdPartyAuth: null },
  { id: 'u13', username: 'xusiy', realName: '徐四', phone: '13800138012', email: 'xusiy@company.com', status: 'enabled', deptId: deptIdByName['采购部'], department: '采购部', storeId: 'S_AMZ_US', warehouseId: 'W_GZ', account1688Id: 'A1688_01', createdAt: ts(20, 9, 0), roles: '采购', permissionSummary: '供应商、SKU迭代', loginCount: 112, lastLoginAt: ts(0, 12, 0), lastLoginIp: '192.168.1.112', thirdPartyAuth: null },
  { id: 'u14', username: 'maowu', realName: '毛五', phone: '13800138013', email: 'maowu@company.com', status: 'enabled', deptId: deptIdByName['物流部'], department: '物流部', storeId: 'S_AMZ_EU', warehouseId: 'W_US_LA', account1688Id: '', createdAt: ts(18, 14, 0), roles: '仓库', permissionSummary: '物流计划、备货、跨境', loginCount: 76, lastLoginAt: ts(2, 15, 30), lastLoginIp: '192.168.1.113', thirdPartyAuth: null },
  { id: 'u15', username: 'xieliu', realName: '谢六', phone: '13800138014', email: 'xieliu@company.com', status: 'enabled', deptId: deptIdByName['客服部'], department: '客服部', storeId: 'S_SHOPEE_SG', warehouseId: 'W_GZ', account1688Id: '', createdAt: ts(15, 10, 0), roles: '客服', permissionSummary: '订单查询、售后', loginCount: 201, lastLoginAt: ts(0, 11, 20), lastLoginIp: '192.168.1.114', thirdPartyAuth: '企业微信' },
  { id: 'u16', username: 'tangqi', realName: '唐七', phone: '13800138015', email: 'tangqi@company.com', status: 'enabled', deptId: deptIdByName['技术部'], department: '技术部', storeId: 'S_AMZ_US', warehouseId: 'W_SH', account1688Id: '', createdAt: ts(12, 8, 30), roles: '开发', permissionSummary: '系统设置、日志', loginCount: 34, lastLoginAt: ts(7, 9, 0), lastLoginIp: '192.168.1.115', thirdPartyAuth: null },
  { id: 'u17', username: 'hanba', realName: '韩八', phone: '13800138016', email: 'hanba@company.com', status: 'enabled', deptId: deptIdByName['运营部'], department: '运营部', storeId: 'S_AMZ_EU', warehouseId: 'W_DE', account1688Id: '', createdAt: ts(10, 16, 0), roles: '运营', permissionSummary: '店铺、库存同步', loginCount: 91, lastLoginAt: ts(1, 14, 0), lastLoginIp: '192.168.1.116', thirdPartyAuth: null },
  { id: 'u18', username: 'fengjiu', realName: '冯九', phone: '13800138017', email: 'fengjiu@company.com', status: 'enabled', deptId: deptIdByName['销售部'], department: '销售部', storeId: 'S_WMT_US', warehouseId: 'W_US_LA', account1688Id: '', createdAt: ts(8, 9, 0), roles: '销售', permissionSummary: '销售主数据、目标', loginCount: 145, lastLoginAt: ts(0, 17, 0), lastLoginIp: '192.168.1.117', thirdPartyAuth: null },
  { id: 'u19', username: 'caoshi', realName: '曹十', phone: '13800138018', email: 'caoshi@company.com', status: 'enabled', deptId: deptIdByName['产品部'], department: '产品部', storeId: 'S_AMZ_US', warehouseId: 'W_SH', account1688Id: 'A1688_01', createdAt: ts(6, 10, 0), roles: '产品经理', permissionSummary: 'BOM、虚拟组合', loginCount: 62, lastLoginAt: ts(3, 10, 30), lastLoginIp: '192.168.1.118', thirdPartyAuth: null },
  { id: 'u20', username: 'pengaa', realName: '彭甲', phone: '13800138019', email: 'pengaa@company.com', status: 'disabled', deptId: deptIdByName['人事部'], department: '人事部', storeId: '', warehouseId: '', account1688Id: '', createdAt: ts(5, 11, 0), roles: '人事', permissionSummary: '组织、用户', loginCount: 18, lastLoginAt: ts(20, 8, 0), lastLoginIp: '192.168.1.119', thirdPartyAuth: null },
  { id: 'u21', username: 'yuanbb', realName: '袁乙', phone: '13800138020', email: 'yuanbb@company.com', status: 'enabled', deptId: deptIdByName['财务部'], department: '财务部', storeId: 'S_AMZ_US', warehouseId: 'W_SH', account1688Id: null, createdAt: ts(4, 14, 0), roles: '财务', permissionSummary: '成本中心、费用', loginCount: 78, lastLoginAt: ts(1, 16, 0), lastLoginIp: '192.168.1.120', thirdPartyAuth: null },
  { id: 'u22', username: 'jiangcc', realName: '江丙', phone: '13800138021', email: 'jiangcc@company.com', status: 'enabled', deptId: deptIdByName['采购部'], department: '采购部', storeId: 'S_AMZ_EU', warehouseId: 'W_GZ', account1688Id: 'A1688_03', createdAt: ts(3, 9, 30), roles: '采购', permissionSummary: '供应商管理', loginCount: 95, lastLoginAt: ts(0, 10, 0), lastLoginIp: '192.168.1.121', thirdPartyAuth: null },
  { id: 'u23', username: 'shedd', realName: '沈丁', phone: '13800138022', email: 'shedd@company.com', status: 'enabled', deptId: deptIdByName['物流部'], department: '物流部', storeId: 'S_AMZ_EU', warehouseId: 'W_DE', account1688Id: '', createdAt: ts(2, 8, 0), roles: '仓库', permissionSummary: '物流单、清关', loginCount: 56, lastLoginAt: ts(2, 9, 0), lastLoginIp: '192.168.1.122', thirdPartyAuth: null },
  { id: 'u24', username: 'hanee', realName: '韩戊', phone: '13800138023', email: 'hanee@company.com', status: 'enabled', deptId: deptIdByName['客服部'], department: '客服部', storeId: 'S_SHOPEE_SG', warehouseId: 'W_GZ', account1688Id: '', createdAt: ts(1, 15, 0), roles: '客服', permissionSummary: '订单、售后', loginCount: 167, lastLoginAt: ts(0, 12, 30), lastLoginIp: '192.168.1.123', thirdPartyAuth: '钉钉' },
  { id: 'u25', username: 'yangff', realName: '杨己', phone: '13800138024', email: 'yangff@company.com', status: 'enabled', deptId: deptIdByName['技术部'], department: '技术部', storeId: 'S_AMZ_US', warehouseId: 'W_SH', account1688Id: '', createdAt: ts(0, 10, 0), roles: '开发', permissionSummary: '全模块只读', loginCount: 12, lastLoginAt: ts(0, 10, 5), lastLoginIp: '192.168.1.124', thirdPartyAuth: null },
];

/** 返回用户列表副本 */
export default function getMockUserList() {
  return MOCK_USERS.map((u) => ({ ...u }));
}

/** 返回筛选/表单需要的元数据（页面不得直接 import mock，需走 service）；部分项带 isPreset 供编辑页展示「预设」标签 */
export function getMockUserMeta() {
  return {
    roles: MOCK_ROLES.map((r, i) => ({ id: r, name: r, isPreset: i < 2 })),
    depts: MOCK_DEPTS.map((d) => ({ ...d })),
    stores: MOCK_STORES.map((s, i) => ({ ...s, isPreset: i < 2 })),
    warehouses: MOCK_WAREHOUSES.map((w, i) => ({ ...w, isPreset: i < 2 })),
    accounts1688: MOCK_ACCOUNTS_1688.map((a) => ({ ...a })),
    plans: MOCK_PLANS.map((p) => ({ ...p })),
  };
}
