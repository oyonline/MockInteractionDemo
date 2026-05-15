/** 销量预计管理 — mock 数据（独立于 Forecast Tracking） */

const BU_VALUES = [
  'KK Amazon',
  'KK Shopify',
  'Tik Tok ACCU',
  'Tik Tok SEA',
  'China',
  'EMEA',
  'Outdoor Amazon',
  'Walmart Online',
  'Ebay',
  'Retail',
  'Promotion',
  'JP Amazon',
  'Other',
];

/** 产品层级 */
const PRODUCT_LEVELS = ['A', 'B', 'C', 'D', 'E', 'F'];
/** 运输方式 */
const SHIP_METHODS = ['海标', '空标', '空海标'];
/** 产品属性 */
const PRODUCT_ATTRS = ['春夏款', '冬季款', '全年款', '特殊款'];
const NEW_OLD = ['新品', '老品'];
const STAFF = ['Effie', 'Tom', 'Kerr', 'Amy', 'Leo', 'Zoe'];

const BASIC_ISSUE_TAGS = ['信息不全', '类目待确认', '—'];
const DATA_ISSUE_TAGS = ['波动异常', '与历史偏离', '—'];
const ADJUST_REASONS = ['促销备货', '供应链约束', '业务调整', '—'];

function shiftYm(ym, delta) {
  const [y, m] = ym.split('-').map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

/** 从起始月份连续 N 个月的 yyyy-MM 列表 */
export function getForecastMonthKeys(anchorYm, count = 18) {
  const keys = [];
  for (let i = 0; i < count; i++) {
    keys.push(shiftYm(anchorYm, i));
  }
  return keys;
}

function hashSeed(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pick(arr, seed, idx) {
  return arr[(seed + idx) % arr.length];
}

/**
 * 生成默认期数列表（倒序，最新在前）
 */
export function generateDefaultPeriods(count = 16) {
  const periods = [];
  const base = new Date(2026, 4, 1);
  for (let i = 0; i < count; i++) {
    const d = new Date(base.getFullYear(), base.getMonth() - i, 1);
    const forecastYm = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const created = new Date(d.getFullYear(), d.getMonth() - 1, 28);
    periods.push({
      id: `sf-period-${forecastYm}`,
      forecastYm,
      createdAt: created.toISOString(),
      creator: pick(['Kerr', 'Amy', 'Tom'], hashSeed(forecastYm), 0),
    });
  }
  return periods;
}

/**
 * 为单个 SKU 行生成 18 个月 forecast
 */
export function generateMonthlyForRow(anchorYm, rowId) {
  const keys = getForecastMonthKeys(anchorYm, 18);
  const seed = hashSeed(`${anchorYm}|${rowId}`);
  const monthly = {};
  keys.forEach((k, i) => {
    const v = 80 + (seed % 500) + ((seed >> (i % 8)) & 127) + i * 3;
    monthly[k] = Math.max(0, Math.round(v));
  });
  return monthly;
}

/**
 * 锚点月起连续 5 个月的计划建议数量（只读演示）
 */
export function generatePlanSuggestForRow(anchorYm, rowId) {
  const keys = getForecastMonthKeys(anchorYm, 5);
  const seed = hashSeed(`planSuggest|${anchorYm}|${rowId}`);
  const obj = {};
  keys.forEach((k, i) => {
    obj[k] = Math.max(0, Math.round(40 + (seed % 280) + i * 21 + ((seed >> (i % 8)) & 63)));
  });
  return obj;
}

/**
 * 生成全量基础行
 */
export function generateBaseRows(total = 160) {
  const rows = [];
  BU_VALUES.forEach((bu) => {
    const perBu = Math.max(8, Math.ceil(total / BU_VALUES.length));
    for (let j = 0; j < perBu && rows.length < total; j++) {
      const rowId = `sf-row-${bu}-${String(j).padStart(3, '0')}`;
      const seed = hashSeed(rowId);
      const letter = String.fromCharCode(65 + (seed % 26));
      const sku = `K${letter}PGLV${seed % 9}A-${String(seed % 1000).padStart(3, '0')}BO`;
      rows.push({
        id: rowId,
        bu,
        sku,
        shipIndex: Number((0.6 + (seed % 40) / 100).toFixed(2)),
        purchaseInterval: 14 + (seed % 10),
        replenishmentInterval: 7 + (seed % 14),
        logisticsShipCycle: 18 + (seed % 12),
        logisticsOrderDays: 2 + (seed % 5),
        warehouseOpDays: 1 + (seed % 4),
        earliestSalesDate: `202${3 + (seed % 3)}-${String(1 + (seed % 12)).padStart(2, '0')}-${String(1 + (seed % 28)).padStart(2, '0')}`,
        newOld: pick(NEW_OLD, seed, 1),
        productLevel: pick(PRODUCT_LEVELS, seed, 2),
        shipAttr: pick(SHIP_METHODS, seed, 0),
        shipCycleDays: 25 + (seed % 20),
        productAttr: pick(PRODUCT_ATTRS, seed, 1),
        safetyStockDays: 30 + (seed % 40),
        listingDays: 60 + (seed % 120),
        staffName: pick(STAFF, seed, 3),
        basicIssueTag: pick(BASIC_ISSUE_TAGS, seed, 5),
        basicRemark1: seed % 4 === 0 ? '—' : `基础备注${(seed % 90) + 1}`,
        dataIssueTag: pick(DATA_ISSUE_TAGS, seed, 6),
        adjustReason: pick(ADJUST_REASONS, seed, 7),
        dataRemark2: seed % 5 === 0 ? '—' : `数据备注${(seed % 50) + 1}`,
        excessBizTransit: Number((120 + (seed % 800) / 10).toFixed(1)),
        excessDc: Number((80 + (seed % 600) / 10).toFixed(1)),
        excessOpenPo: Number((60 + (seed % 400) / 10).toFixed(1)),
        excessMeetingRemark: seed % 6 === 0 ? '—' : `会议跟进${(seed % 12) + 1}`,
      });
    }
  });
  return rows.slice(0, total);
}

export { BU_VALUES };
