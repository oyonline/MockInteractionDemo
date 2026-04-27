/** Excess 过量看板 mock 数据 */

const BU_LIST = [
  'KK Amazon',
  'KK Shopify',
  'Tik Tok ACCU',
  'China',
  'EMEA',
  'Outdoor Amazon',
  'Walmart线上',
  'Ebay',
  'Retail',
  '推广&福利',
  'Amazon',
  'Other',
];

const CATEGORY_SERIES = [
  { description: 'Hammer编织线，线下主 Lines', category: 'Lines', series: 'Hammer' },
  { description: 'Road 轮组渠道备货', category: 'Rods', series: 'Road-R' },
  { description: 'Reels 高频补货款', category: 'Reels', series: 'Reel-Pro' },
  { description: 'Sunglass 促销清仓', category: 'Sunglass', series: 'Sun-X' },
  { description: 'Accessories 组合包', category: 'Accessories', series: 'ACC-Bundle' },
  { description: 'Tackle 管理SKU', category: 'Tackle Management', series: 'TM-100' },
  { description: 'Cabo 品线尾货', category: 'Cabo', series: 'Cabo-Z' },
  { description: 'Dry Bag 仓储调拨', category: 'Dry Bag', series: 'DB-MAX' },
  { description: 'Lure 季节性库存', category: 'Lure', series: 'Lure-S' },
  { description: 'Furniture 慢动清理', category: 'Furniture', series: 'Furn-1' },
  { description: 'Others Tool 延迟消化', category: 'Others Tool', series: 'OT-Kit' },
  { description: 'Apparel 季末库存', category: 'Apparel', series: 'App-Run' },
];

const AGE_STAGES = ['<30天', '31~90天', '91~180天', '181~365天', '>365天'];

function stableHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 131 + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

function positiveModulo(value, divisor) {
  return ((value % divisor) + divisor) % divisor;
}

function getScopedBus(bu) {
  if (!bu || bu === '总览') return BU_LIST;
  return BU_LIST.includes(bu) ? [bu] : BU_LIST;
}

function buildAmountQty(seedKey) {
  const h = stableHash(seedKey);
  const amountBase = 60000 + (h % 320000);
  const momPct = (positiveModulo(h >>> 7, 61) - 30) / 100; // [-30%, +30%]
  const currentAmount = Math.round(amountBase * (1 + momPct * 0.35));
  const previousAmount = Math.round(amountBase);
  const unitPrice = 25 + positiveModulo(h >>> 15, 90); // [25, 114], 避免除零
  const currentQty = Math.round(currentAmount / unitPrice);
  const previousQty = Math.round(previousAmount / unitPrice);
  return {
    currentAmount,
    previousAmount,
    currentQty,
    previousQty,
  };
}

function sumByType(items, dataType, fieldPrefix) {
  return items.reduce((sum, item) => {
    const key = `${fieldPrefix}${dataType === 'amount' ? 'Amount' : 'Qty'}`;
    return sum + item[key];
  }, 0);
}

function buildDataset(bu) {
  const scopedBus = getScopedBus(bu);
  const rows = [];

  scopedBus.forEach((busName) => {
    CATEGORY_SERIES.forEach((cs, idx) => {
      const metric = buildAmountQty(`${busName}-${cs.category}-${cs.series}-${idx}`);
      rows.push({
        bu: busName,
        description: cs.description,
        category: cs.category,
        series: cs.series,
        excess3CurrentAmount: Math.round(metric.currentAmount * 0.38),
        excess3PreviousAmount: Math.round(metric.previousAmount * 0.38),
        excess6CurrentAmount: Math.round(metric.currentAmount * 0.62),
        excess6PreviousAmount: Math.round(metric.previousAmount * 0.62),
        excess12CurrentAmount: Math.round(metric.currentAmount * 0.88),
        excess12PreviousAmount: Math.round(metric.previousAmount * 0.88),
        excess3CurrentQty: Math.round(metric.currentQty * 0.38),
        excess3PreviousQty: Math.round(metric.previousQty * 0.38),
        excess6CurrentQty: Math.round(metric.currentQty * 0.62),
        excess6PreviousQty: Math.round(metric.previousQty * 0.62),
        excess12CurrentQty: Math.round(metric.currentQty * 0.88),
        excess12PreviousQty: Math.round(metric.previousQty * 0.88),
      });
    });
  });

  return rows;
}

export function getMockExcessTabs() {
  return ['总览', ...BU_LIST];
}

export function getMockExcessMetrics(query = {}) {
  const { bu = '总览', dataType = 'amount' } = query;
  const rows = buildDataset(bu);

  const safeCurrent = sumByType(rows, dataType, 'excess6Current');
  const safePrevious = sumByType(rows, dataType, 'excess6Previous');
  const excess3Current = sumByType(rows, dataType, 'excess3Current');
  const excess3Previous = sumByType(rows, dataType, 'excess3Previous');
  const excess12Current = sumByType(rows, dataType, 'excess12Current');
  const excess12Previous = sumByType(rows, dataType, 'excess12Previous');

  return {
    metrics: [
      {
        key: 'safe',
        label: '超出周转&安全库存',
        value: Math.round(safeCurrent * 1.08),
        momDiff: Math.round((safeCurrent - safePrevious) * 1.08),
      },
      {
        key: 'excess3',
        label: 'Excess3个月',
        value: excess3Current,
        momDiff: excess3Current - excess3Previous,
      },
      {
        key: 'excess6',
        label: 'Excess6个月',
        value: safeCurrent,
        momDiff: safeCurrent - safePrevious,
      },
      {
        key: 'excess12',
        label: 'Excess12个月',
        value: excess12Current,
        momDiff: excess12Current - excess12Previous,
      },
    ],
  };
}

export function getMockExcessMainTable(query = {}) {
  const { bu = '总览', dataType = 'amount' } = query;
  const rows = buildDataset(bu);

  const grouped = new Map();
  rows.forEach((item) => {
    const key = `${item.category}-${item.series}`;
    if (!grouped.has(key)) {
      grouped.set(key, {
        description: item.description,
        category: item.category,
        series: item.series,
        current: 0,
        previous: 0,
      });
    }
    const g = grouped.get(key);
    g.current += item[dataType === 'amount' ? 'excess6CurrentAmount' : 'excess6CurrentQty'];
    g.previous += item[dataType === 'amount' ? 'excess6PreviousAmount' : 'excess6PreviousQty'];
  });

  const list = Array.from(grouped.values()).map((item) => {
    const diff = item.current - item.previous;
    const momRate = item.previous === 0 ? 0 : (diff / item.previous) * 100;
    return {
      description: item.description,
      category: item.category,
      series: item.series,
      excess6: Math.round(item.current),
      momDiff: Math.round(diff),
      momRate: Number(momRate.toFixed(2)),
      share: 0,
    };
  });

  const total = list.reduce((sum, item) => sum + item.excess6, 0);
  list.forEach((item) => {
    item.share = total === 0 ? 0 : Number(((item.excess6 / total) * 100).toFixed(2));
  });

  return {
    rows: list
      .sort((a, b) => b.excess6 - a.excess6)
      .slice(0, 10),
  };
}

export function getMockExcessAgingTop10(query = {}) {
  const { bu = '总览', dataType = 'amount' } = query;
  const rows = buildDataset(bu);
  const list = rows.map((item) => {
    const current = item[dataType === 'amount' ? 'excess12CurrentAmount' : 'excess12CurrentQty'];
    const previous = item[dataType === 'amount' ? 'excess12PreviousAmount' : 'excess12PreviousQty'];
    const diff = current - previous;
    return {
      bu: item.bu,
      category: item.category,
      value: Math.round(current),
      momRate: previous === 0 ? 0 : Number((((diff / previous) * 100)).toFixed(2)),
      share: 0,
    };
  });

  const top10 = list.sort((a, b) => b.value - a.value).slice(0, 10);
  const total = top10.reduce((sum, item) => sum + item.value, 0);
  top10.forEach((item) => {
    item.share = total === 0 ? 0 : Number(((item.value / total) * 100).toFixed(2));
  });

  return { rows: top10 };
}

export function getMockExcessInventoryAge(query = {}) {
  const { bu = '总览', dataType = 'amount' } = query;
  const rows = buildDataset(bu);

  const total = rows.reduce((sum, item) => {
    return sum + item[dataType === 'amount' ? 'excess12CurrentAmount' : 'excess12CurrentQty'];
  }, 0);

  const stageRatios = [0.24, 0.3, 0.2, 0.14, 0.12];
  const stages = AGE_STAGES.map((stage, idx) => ({
    stage,
    value: Math.round(total * stageRatios[idx]),
  }));

  return { stages };
}

function getMetricCurrentPrevious(item, dataType, metricKey) {
  const suffix = dataType === 'amount' ? 'Amount' : 'Qty';
  if (metricKey === 'safe') {
    const current = item[`excess6Current${suffix}`] * 1.08;
    const previous = item[`excess6Previous${suffix}`] * 1.08;
    return { current, previous };
  }
  if (metricKey === 'excess3') {
    return {
      current: item[`excess3Current${suffix}`],
      previous: item[`excess3Previous${suffix}`],
    };
  }
  if (metricKey === 'excess12') {
    return {
      current: item[`excess12Current${suffix}`],
      previous: item[`excess12Previous${suffix}`],
    };
  }
  return {
    current: item[`excess6Current${suffix}`],
    previous: item[`excess6Previous${suffix}`],
  };
}

function getMetricLabel(metricKey) {
  if (metricKey === 'safe') return '超出周转';
  if (metricKey === 'excess3') return 'Excess3个月';
  if (metricKey === 'excess12') return 'Excess12个月';
  return 'Excess6个月';
}

/**
 * 过量分析弹窗数据
 * @param {Object} query
 * @param {string} query.bu - 当前BU筛选（总览/某BU）
 * @param {string} query.dataType - amount | qty
 * @param {string} query.level1 - category | bu
 * @param {string} query.selectedMetric - safe | excess3 | excess6 | excess12
 */
export function getMockExcessAnalysisData(query = {}) {
  const {
    bu = '总览',
    dataType = 'amount',
    level1 = 'category',
    selectedMetric = 'safe',
  } = query;
  const rows = buildDataset(bu);
  const dimensionKey = level1 === 'bu' ? 'bu' : 'category';

  const grouped = new Map();
  rows.forEach((item) => {
    const name = item[dimensionKey];
    if (!grouped.has(name)) {
      grouped.set(name, { name, current: 0, previous: 0 });
    }
    const metric = getMetricCurrentPrevious(item, dataType, selectedMetric);
    const g = grouped.get(name);
    g.current += metric.current;
    g.previous += metric.previous;
  });

  const rankingRows = Array.from(grouped.values())
    .map((item) => {
      const diff = item.current - item.previous;
      const momRate = item.previous === 0 ? 0 : (diff / item.previous) * 100;
      return {
        dimensionName: item.name,
        currentValue: Math.round(item.current),
        momDiff: Math.round(diff),
        momRate: Number(momRate.toFixed(2)),
      };
    })
    .sort((a, b) => b.currentValue - a.currentValue)
    .slice(0, 10);

  const chartTotal = rankingRows.reduce((sum, item) => sum + item.currentValue, 0);
  const chartData = rankingRows.map((item) => ({
    name: item.dimensionName,
    value: item.currentValue,
    percent: chartTotal === 0 ? 0 : Number(((item.currentValue / chartTotal) * 100).toFixed(2)),
  }));

  const metricKeys = ['safe', 'excess3', 'excess6', 'excess12'];
  const summary = metricKeys.map((metricKey) => {
    let current = 0;
    let previous = 0;
    rows.forEach((item) => {
      const metric = getMetricCurrentPrevious(item, dataType, metricKey);
      current += metric.current;
      previous += metric.previous;
    });
    const diff = current - previous;
    const momRate = previous === 0 ? 0 : (diff / previous) * 100;
    return {
      key: metricKey,
      label: getMetricLabel(metricKey),
      momDiff: Math.round(diff),
      momRate: Number(momRate.toFixed(2)),
    };
  });

  return {
    level1,
    selectedMetric,
    selectedMetricLabel: getMetricLabel(selectedMetric),
    summary,
    chartData,
    rankingRows,
  };
}

const INVENTORY_AGE_WAREHOUSE_LABELS = [
  '华东RDC',
  '美西3PL',
  '华南中心仓',
  'UK Hub',
  '东南亚 Hub',
  '德州跨境',
  '宁波保税',
  '加州前置仓',
];

function getInventoryAgeWarehouseKey(item) {
  const h = stableHash(`${item.bu}|${item.category}|${item.series}`);
  return INVENTORY_AGE_WAREHOUSE_LABELS[h % INVENTORY_AGE_WAREHOUSE_LABELS.length];
}

function getExcess12Pair(item, dataType) {
  const suffix = dataType === 'amount' ? 'Amount' : 'Qty';
  return {
    current: item[`excess12Current${suffix}`],
    previous: item[`excess12Previous${suffix}`],
  };
}

/**
 * 库龄分析：>365 天 SKU 按维度汇总（mock 口径与「大于365天排名」一致，使用 excess12 字段代理）
 * @param {Object} query
 * @param {string} query.activeBuTab - 主看板当前 BU Tab（总览 | 某 BU）
 * @param {string} query.dataType - amount | qty
 * @param {string} query.dimension - bu | category | warehouse
 */
export function getMockInventoryAgeOver365Analysis(query = {}) {
  const { activeBuTab = '总览', dataType = 'amount', dimension = 'bu' } = query;

  const rows = buildDataset(activeBuTab);

  const grouped = new Map();
  rows.forEach((item) => {
    let key;
    if (dimension === 'bu') key = item.bu;
    else if (dimension === 'category') key = item.category;
    else key = getInventoryAgeWarehouseKey(item);

    if (!grouped.has(key)) {
      grouped.set(key, { current: 0, previous: 0 });
    }
    const pair = getExcess12Pair(item, dataType);
    const g = grouped.get(key);
    g.current += pair.current;
    g.previous += pair.previous;
  });

  const list = Array.from(grouped.entries())
    .map(([dimensionName, agg]) => {
      const diff = agg.current - agg.previous;
      const momRate = agg.previous === 0 ? 0 : (diff / agg.previous) * 100;
      return {
        dimensionName,
        value: Math.round(agg.current),
        momRate: Number(momRate.toFixed(2)),
      };
    })
    .sort((a, b) => b.value - a.value);

  return {
    dimension,
    rows: list,
  };
}
