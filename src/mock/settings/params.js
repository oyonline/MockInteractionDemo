/** 参数设置 mock 数据，供 settingsParams service 初始化与 reset 使用。 */

export const MOCK_PARAMS_LIST = [
  { id: 'p1', group: 'system', key: 'site_name', value: '跨境电商系统', desc: '站点名称', status: 'enabled', updatedAt: '2024-01-15 10:00:00' },
  { id: 'p2', group: 'system', key: 'site_logo', value: '/logo.png', desc: '站点 Logo 路径', status: 'enabled', updatedAt: '2024-01-15 10:00:00' },
  { id: 'p3', group: 'system', key: 'timezone', value: 'Asia/Shanghai', desc: '默认时区', status: 'enabled', updatedAt: '2024-01-15 10:00:00' },
  { id: 'p4', group: 'system', key: 'maintenance_mode', value: 'false', desc: '维护模式开关', status: 'disabled', updatedAt: '2024-01-10 14:20:00' },
  { id: 'p5', group: 'sync', key: 'sync_interval_min', value: '30', desc: '同步间隔（分钟）', status: 'enabled', updatedAt: '2024-01-18 09:00:00' },
  { id: 'p6', group: 'sync', key: 'sync_retry_times', value: '3', desc: '同步失败重试次数', status: 'enabled', updatedAt: '2024-01-18 09:00:00' },
  { id: 'p7', group: 'sync', key: 'sync_batch_size', value: '500', desc: '单次同步批次大小', status: 'enabled', updatedAt: '2024-01-18 09:00:00' },
  { id: 'p8', group: 'order', key: 'order_auto_confirm_hours', value: '24', desc: '订单自动确认时长（小时）', status: 'enabled', updatedAt: '2024-01-20 11:30:00' },
  { id: 'p9', group: 'order', key: 'order_cancel_timeout_min', value: '30', desc: '未支付订单取消超时（分钟）', status: 'enabled', updatedAt: '2024-01-20 11:30:00' },
  { id: 'p10', group: 'inventory', key: 'stock_warn_threshold', value: '10', desc: '库存预警阈值', status: 'enabled', updatedAt: '2024-01-22 08:00:00' },
  { id: 'p11', group: 'inventory', key: 'allow_negative_stock', value: 'false', desc: '是否允许负库存', status: 'enabled', updatedAt: '2024-01-22 08:00:00' },
  { id: 'p12', group: 'finance', key: 'tax_rate_default', value: '13', desc: '默认税率（%）', status: 'enabled', updatedAt: '2024-01-25 16:00:00' },
  { id: 'p13', group: 'finance', key: 'currency', value: 'CNY', desc: '默认币种', status: 'enabled', updatedAt: '2024-01-25 16:00:00' },
  { id: 'p14', group: 'log', key: 'log_retention_days', value: '90', desc: '日志保留天数', status: 'enabled', updatedAt: '2024-02-01 10:00:00' },
  { id: 'p15', group: 'log', key: 'log_level', value: 'info', desc: '日志级别', status: 'enabled', updatedAt: '2024-02-01 10:00:00' },
];

/** 返回可用于初始化的参数列表副本（可在此做时间戳等动态处理）。 */
export default function getMockParamsList() {
  return MOCK_PARAMS_LIST.map((item) => ({ ...item }));
}
