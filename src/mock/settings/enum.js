/** 枚举与规则 mock：rule[]，供 settingsEnum service 初始化与 reset 使用。 */

const NOW = '2025-08-20 12:00:00';

const MOCK_ENUM_RULES = [
  { id: 'er1', name: '含电走专线', targetTypeCode: 'logistics_shipping_way', status: 'enabled', priority: 10, expression: '当 restrictedType 包含 BATTERY 时，推荐物流方式为 EXPRESS 或专线渠道', desc: '含电商品走专线', updatedAt: NOW },
  { id: 'er2', name: '超大件走海运', targetTypeCode: 'logistics_shipping_way', status: 'enabled', priority: 20, expression: '当 weight > 30kg 或 volume > 0.5 CBM 时，推荐 SEA', desc: '大件走海运', updatedAt: NOW },
  { id: 'er3', name: '紧急订单走空运', targetTypeCode: 'logistics_shipping_way', status: 'enabled', priority: 30, expression: '当 order.urgent === true 或 deliveryDeadline 距今天数 < 7 时，推荐 AIR', desc: '加急走空运', updatedAt: NOW },
  { id: 'er4', name: '含电商品渠道提示', targetTypeCode: 'logistics_restricted_type', status: 'enabled', priority: 10, expression: '当 item 含 BATTERY 时，仅允许 EXPRESS/FBA_AMZ，并提示用户确认电池类型', desc: '含电限制', updatedAt: NOW },
  { id: 'er5', name: '液体粉末走特定渠道', targetTypeCode: 'logistics_restricted_type', status: 'enabled', priority: 20, expression: '当 restrictedType 包含 LIQUID 或 POWDER 时，需走危险品专线并附加说明', desc: '液体粉末', updatedAt: NOW },
  { id: 'er6', name: '预售订单额外校验', targetTypeCode: 'sales_order_type', status: 'enabled', priority: 10, expression: '当 orderType === PRESELL 时，校验 presellEndDate 且库存预留逻辑启用', desc: '预售规则', updatedAt: NOW },
  { id: 'er7', name: '补发订单需要原单号', targetTypeCode: 'sales_order_type', status: 'enabled', priority: 20, expression: '当 orderType === REPLENISH 时，必填 originalOrderId 且原单状态为已发货/已完成', desc: '补发规则', updatedAt: NOW },
];

/** 返回 rule[] 用于初始化 storage。 */
export default function getMockEnumRules() {
  return MOCK_ENUM_RULES.map((r) => ({ ...r }));
}
