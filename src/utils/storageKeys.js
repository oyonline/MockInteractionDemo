/** 仅定义 localStorage 业务 key 常量，禁止在页面或 service 中写魔法字符串。 */

const PREFIX = 'ecommerce:';

export const SETTINGS_PARAMS = PREFIX + 'settings:params';
export const SETTINGS_LOG = PREFIX + 'settings:log';
export const SETTINGS_SYNC = PREFIX + 'settings:sync';
export const SETTINGS_SCHEDULER = PREFIX + 'settings:scheduler';
export const SETTINGS_DICT = PREFIX + 'settings:dict';
export const SETTINGS_BASIC = PREFIX + 'settings:basic';
export const SETTINGS_ENUM = PREFIX + 'settings:enum';
export const SYSTEM_USERS = PREFIX + 'system:users';
export const SYSTEM_ROLES = PREFIX + 'system:roles';
export const SYSTEM_ROLE_PERMISSIONS = PREFIX + 'system:rolePermissions';
export const SYSTEM_ROLE_FIELD_PERMISSIONS = PREFIX + 'system:roleFieldPermissions';
export const SYSTEM_ROLE_DATA_PERMISSIONS = PREFIX + 'system:roleDataPermissions';

// 物流与报关 - 基础资料
export const LOGISTICS_VENDORS = PREFIX + 'logistics:vendors';
export const LOGISTICS_CHANNELS = PREFIX + 'logistics:channels';
export const LOGISTICS_ADDRESSES = PREFIX + 'logistics:addresses';
export const LOGISTICS_HS_CODES = PREFIX + 'logistics:hsCodes';
export const LOGISTICS_DECLARATIONS = PREFIX + 'logistics:declarations';
export const LOGISTICS_APPROVAL_RECORDS = PREFIX + 'logistics:approvalRecords';
// 物流规则配置（核心功能）
export const LOGISTICS_ROUTING_RULES = PREFIX + 'logistics:routingRules';
export const LOGISTICS_CONSOLIDATION_RULES = PREFIX + 'logistics:consolidationRules';

// 供应链计划
export const SUPPLY_CHAIN_FORECAST = PREFIX + 'supply-chain:forecast:v2';
export const SUPPLY_CHAIN_OPENING_ITO = PREFIX + 'supply-chain:opening-ito';
export const SUPPLY_CHAIN_EXCESS_ARCHIVES = PREFIX + 'supply-chain:excess:archives';

// 销售预测页（原型级状态持久化：版本管理、推送状态）
export const SALES_FORECAST_PAGE_STATE = PREFIX + 'sales:forecast-page-state';

// 工作台 - 审批中心（审批单整体列表，含通过/驳回后的状态与时间线）
export const APPROVALS = PREFIX + 'approvals';

// 供应链计划 - 供应计划列表（基于销售预测生成的 mock 计划）
export const SUPPLY_PLANS = PREFIX + 'supply-chain:supply-plans';
