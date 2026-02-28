/** 系统日志 mock 数据，供 settingsLog service 初始化与 reset 使用。 */

function iso(offsetMinutes = 0) {
  const d = new Date();
  d.setMinutes(d.getMinutes() + offsetMinutes);
  return d.toISOString();
}

const MOCK_LOG_LIST = [
  { id: 'log1', time: iso(-60), module: 'settings-sync', action: 'sync', result: 'success', operator: 'system', message: '接口同步完成', detail: { endpoint: '/api/sync', count: 120 } },
  { id: 'log2', time: iso(-120), module: 'settings-scheduler', action: 'run', result: 'success', operator: 'system', message: '定时任务执行成功', detail: { taskId: 'task-daily', duration: 3200 } },
  { id: 'log3', time: iso(-180), module: 'settings-params', action: 'update', result: 'success', operator: 'admin', message: '参数 site_name 已更新', detail: { key: 'site_name', oldValue: '旧站点', newValue: '跨境电商系统' } },
  { id: 'log4', time: iso(-240), module: 'settings-sync', action: 'sync', result: 'fail', operator: 'system', message: '同步超时', detail: { endpoint: '/api/sync', error: 'ETIMEDOUT' } },
  { id: 'log5', time: iso(-300), module: 'settings-scheduler', action: 'run', result: 'success', operator: 'system', message: '定时任务执行成功', detail: { taskId: 'task-hourly' } },
  { id: 'log6', time: iso(-360), module: 'settings-params', action: 'update', result: 'success', operator: 'admin', message: '参数 timezone 已更新', detail: { key: 'timezone' } },
  { id: 'log7', time: iso(-420), module: 'settings-sync', action: 'sync', result: 'success', operator: 'system', message: '接口同步完成', detail: { count: 85 } },
  { id: 'log8', time: iso(-480), module: 'settings-log', action: 'clear', result: 'success', operator: 'admin', message: '日志已清空', detail: {} },
];

/** 返回可用于初始化的日志列表副本。 */
export default function getMockLogList() {
  return MOCK_LOG_LIST.map((item) => ({ ...item, detail: item.detail ? { ...item.detail } : {} }));
}
