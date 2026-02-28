/** 定时任务 mock 数据，供 settingsScheduler service 初始化与 reset 使用。 */

const MOCK_SCHEDULER_LIST = [
  { id: 'sch1', name: '每日数据汇总', cron: '0 2 * * *', status: 'enabled', lastRunAt: null, nextRunAt: null, durationMs: null, lastResult: null },
  { id: 'sch2', name: '每2小时同步', cron: '0 */2 * * *', status: 'enabled', lastRunAt: null, nextRunAt: null, durationMs: null, lastResult: null },
  { id: 'sch3', name: '每周报表', cron: '0 9 * * 1', status: 'disabled', lastRunAt: null, nextRunAt: null, durationMs: null, lastResult: null },
  { id: 'sch4', name: '库存对账', cron: '30 1 * * *', status: 'enabled', lastRunAt: null, nextRunAt: null, durationMs: null, lastResult: null },
  { id: 'sch5', name: '订单同步', cron: '0 */1 * * *', status: 'disabled', lastRunAt: null, nextRunAt: null, durationMs: null, lastResult: null },
];

/** 返回可用于初始化的定时任务列表副本。 */
export default function getMockSchedulerList() {
  return MOCK_SCHEDULER_LIST.map((item) => ({ ...item }));
}
