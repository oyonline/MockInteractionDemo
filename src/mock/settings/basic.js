/** 基础配置 mock：configItem[]，供 settingsBasic service 初始化与 reset 使用。 */

const NOW = '2025-08-15 12:00:00';

const CURRENCY_OPTIONS = [
  { label: '人民币', value: 'CNY' },
  { label: '美元', value: 'USD' },
  { label: '欧元', value: 'EUR' },
  { label: '英镑', value: 'GBP' },
  { label: '日元', value: 'JPY' },
  { label: '港币', value: 'HKD' },
];

const SHIPPING_WAY_OPTIONS = [
  { label: '海运', value: 'SEA' },
  { label: '空运', value: 'AIR' },
  { label: '铁路', value: 'RAIL' },
  { label: '国际快递', value: 'EXPRESS' },
  { label: '亚马逊官方物流', value: 'FBA_AMZ' },
];

const ORDER_TYPE_OPTIONS = [
  { label: '普通订单', value: 'NORMAL' },
  { label: '预售订单', value: 'PRESELL' },
  { label: '补发订单', value: 'REPLENISH' },
  { label: '线下订单', value: 'OFFLINE' },
];

const MOCK_BASIC_CONFIG = [
  { key: 'siteName', label: '站点名称', group: '通用', type: 'text', value: '跨境电商系统', desc: '系统显示名称', updatedAt: NOW },
  { key: 'defaultTimezone', label: '默认时区', group: '通用', type: 'text', value: 'Asia/Shanghai', desc: '如 Asia/Shanghai、America/New_York', updatedAt: NOW },
  { key: 'defaultCurrency', label: '默认币种', group: '通用', type: 'select', value: 'CNY', options: CURRENCY_OPTIONS, desc: '财务与展示默认币种', updatedAt: NOW },
  { key: 'enableDebug', label: '调试模式', group: '通用', type: 'switch', value: false, desc: '开启后输出调试日志', updatedAt: NOW },
  { key: 'defaultShippingWay', label: '默认物流方式', group: '物流', type: 'select', value: 'SEA', options: SHIPPING_WAY_OPTIONS, desc: '运费试算与下单默认渠道', updatedAt: NOW },
  { key: 'syncTimeoutMs', label: '同步超时(ms)', group: '物流', type: 'number', value: 30000, desc: '接口同步超时时间（毫秒）', updatedAt: NOW },
  { key: 'defaultOrderType', label: '默认订单类型', group: '销售', type: 'select', value: 'NORMAL', options: ORDER_TYPE_OPTIONS, desc: '新建订单默认类型', updatedAt: NOW },
  { key: 'defaultTaxRate', label: '默认税率(%)', group: '财务', type: 'number', value: 13, desc: '默认增值税率', updatedAt: NOW },
];

/** 返回 { configItem[] } 用于初始化 storage。 */
export default function getMockBasicConfig() {
  return MOCK_BASIC_CONFIG.map((item) => ({ ...item, options: item.options ? item.options.slice() : undefined }));
}
