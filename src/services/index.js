/** Service 聚合导出：对外暴露各模块 service，页面仅通过此处或具体 service 文件引用。 */

export { settingsParams } from './settings';
export { userService, rolePermissionService } from './system';
export { logisticsService } from './logistics';
export * as supplyChainService from './supply-chain';
