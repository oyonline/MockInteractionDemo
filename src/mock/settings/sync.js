/** 接口同步任务 mock 数据，供 settingsSync service 初始化与 reset 使用。 */

const MOCK_SYNC_LIST = [
  { id: 'sync1', name: '商品主数据同步', endpoint: '/api/v1/product/sync', status: 'fail', lastRunAt: '2024-02-28T10:00:00.000Z', durationMs: 2800, lastResult: { type: 'timeout', summary: '请求超时，部分商品未能同步成功', errorCode: 'TIMEOUT', retryable: true } },
  { id: 'sync2', name: '库存同步', endpoint: '/api/v1/inventory/sync', status: 'success', lastRunAt: '2024-02-28T09:30:00.000Z', durationMs: 520, lastResult: { type: 'partial', summary: '部分商品未能同步成功', stats: { total: 120, success: 112, fail: 8 }, details: ['SKU 10001：请求超时', 'SKU 10002：校验失败'], retryable: true } },
  { id: 'sync3', name: '订单同步', endpoint: '/api/v1/order/sync', status: 'success', lastRunAt: '2024-02-28T09:00:00.000Z', durationMs: 5200, lastResult: { type: 'partial', summary: '部分商品未能同步成功', stats: { total: 20000, success: 17000, fail: 3000 }, details: (() => { const d = []; for (let i = 0; i < 20; i++) d.push('SKU ' + (20000 + i) + '：请求超时'); return d; })(), retryable: true } },
  { id: 'sync4', name: '供应商同步', endpoint: '/api/v1/supplier/sync', status: 'idle', lastRunAt: null, durationMs: null, lastResult: '' },
  { id: 'sync5', name: '价格同步', endpoint: '/api/v1/price/sync', status: 'idle', lastRunAt: null, durationMs: null, lastResult: '' },
];

/** 返回可用于初始化的同步任务列表副本。 */
export default function getMockSyncList() {
  return MOCK_SYNC_LIST.map((item) => ({ ...item }));
}
