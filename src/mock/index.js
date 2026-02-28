/** Mock 统一入口：聚合导出各模块 mock 数据或生成函数，供 service 使用。 */

export { default as getMockParamsList } from './settings/params';
export { default as getMockLogList } from './settings/log';
export { default as getMockSyncList } from './settings/sync';
export { default as getMockSchedulerList } from './settings/scheduler';
export { default as getMockDictData } from './settings/dict';
export { default as getMockBasicConfig } from './settings/basic';
export { default as getMockEnumRules } from './settings/enum';
export { default as getMockUserList, getMockUserMeta } from './system/users';
export { default as getMockRoleList } from './system/roles';
export { getMockPermissionMeta, getMockInitialRolePermissions, getMockFieldPermissionMeta, getMockDataPermissionMeta } from './system/rolePermissions';
