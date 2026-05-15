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
  { description: 'Lines 渠道备货基础款', category: 'Lines', series: 'Line-Basic' },
  { description: 'Lines 促销活动组合装', category: 'Lines', series: 'Line-Promo' },
  { description: 'Road 轮组渠道备货', category: 'Rods', series: 'Road-R' },
  { description: 'Rods 海外仓快反补货', category: 'Rods', series: 'Road-X' },
  { description: 'Rods 老款尾货消化', category: 'Rods', series: 'Road-Old' },
  { description: 'Reels 高频补货款', category: 'Reels', series: 'Reel-Pro' },
  { description: 'Reels 新品导入备货', category: 'Reels', series: 'Reel-New' },
  { description: 'Reels 渠道清仓款', category: 'Reels', series: 'Reel-Clear' },
  { description: 'Sunglass 促销清仓', category: 'Sunglass', series: 'Sun-X' },
  { description: 'Sunglass 常规补货款', category: 'Sunglass', series: 'Sun-Base' },
  { description: 'Accessories 组合包', category: 'Accessories', series: 'ACC-Bundle' },
  { description: 'Accessories 门店引流包', category: 'Accessories', series: 'ACC-Traffic' },
  { description: 'Tackle 管理SKU', category: 'Tackle Management', series: 'TM-100' },
  { description: 'Tackle 慢动SKU整理', category: 'Tackle Management', series: 'TM-200' },
  { description: 'Cabo 品线尾货', category: 'Cabo', series: 'Cabo-Z' },
  { description: 'Cabo 季末去化款', category: 'Cabo', series: 'Cabo-Runout' },
  { description: 'Dry Bag 仓储调拨', category: 'Dry Bag', series: 'DB-MAX' },
  { description: 'Dry Bag 跨区转仓款', category: 'Dry Bag', series: 'DB-Flow' },
  { description: 'Lure 季节性库存', category: 'Lure', series: 'Lure-S' },
  { description: 'Lure 节日促销备货', category: 'Lure', series: 'Lure-Festival' },
  { description: 'Lure 渠道常规款', category: 'Lure', series: 'Lure-Core' },
  { description: 'Furniture 慢动清理', category: 'Furniture', series: 'Furn-1' },
  { description: 'Furniture 清仓特卖款', category: 'Furniture', series: 'Furn-Clear' },
  { description: 'Others Tool 延迟消化', category: 'Others Tool', series: 'OT-Kit' },
  { description: 'Others Tool 零散组合款', category: 'Others Tool', series: 'OT-Mix' },
  { description: 'Apparel 季末库存', category: 'Apparel', series: 'App-Run' },
  { description: 'Apparel 旧款去化包', category: 'Apparel', series: 'App-Old' },
];

const AGE_STAGES = ['<30天', '31~90天', '91~180天', '181~365天', '>365天'];
const AGE_STAGE_CURRENT_RATIOS = [0.24, 0.3, 0.2, 0.14, 0.12];
const AGE_STAGE_PREVIOUS_RATIOS = [0.22, 0.29, 0.22, 0.15, 0.12];

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

function normalizeSelectedBus(query = {}) {
  const { bus, bu, activeBuTab, selectedBus } = query;
  const candidate = Array.isArray(bus)
    ? bus
    : Array.isArray(selectedBus)
      ? selectedBus
      : [];

  if (candidate.length > 0) {
    const valid = candidate.filter((item) => BU_LIST.includes(item));
    return valid.length > 0 ? valid : BU_LIST;
  }

  const singleBu = bu || activeBuTab;
  if (!singleBu || singleBu === '总览') return BU_LIST;
  return BU_LIST.includes(singleBu) ? [singleBu] : BU_LIST;
}

function getScopedBus(query = {}) {
  return normalizeSelectedBus(query);
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

function buildDataset(query = {}) {
  const scopedBus = getScopedBus(query);
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
  const { dataType = 'amount' } = query;
  const rows = buildDataset(query);

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
  const { dataType = 'amount' } = query;
  const rows = buildDataset(query);

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
  const { dataType = 'amount' } = query;
  const rows = buildDataset(query);
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
  const { dataType = 'amount' } = query;
  const rows = buildDataset(query);

  const total = rows.reduce((sum, item) => {
    return sum + item[dataType === 'amount' ? 'excess12CurrentAmount' : 'excess12CurrentQty'];
  }, 0);

  const stageRatios = AGE_STAGE_CURRENT_RATIOS;
  const stages = AGE_STAGES.map((stage, idx) => ({
    stage,
    value: Math.round(total * stageRatios[idx]),
  }));

  return { stages };
}

export function getMockExcessInventoryAgeComparison(query = {}) {
  const { dataType = 'amount' } = query;
  const rows = buildDataset(query);
  const currentTotal = rows.reduce((sum, item) => {
    return sum + item[dataType === 'amount' ? 'excess12CurrentAmount' : 'excess12CurrentQty'];
  }, 0);
  const previousTotal = rows.reduce((sum, item) => {
    return sum + item[dataType === 'amount' ? 'excess12PreviousAmount' : 'excess12PreviousQty'];
  }, 0);

  const stages = AGE_STAGES.map((stage, idx) => {
    const currentValue = Math.round(currentTotal * AGE_STAGE_CURRENT_RATIOS[idx]);
    const previousValue = Math.round(previousTotal * AGE_STAGE_PREVIOUS_RATIOS[idx]);
    const diffValue = currentValue - previousValue;
    const diffRate = previousValue === 0 ? 0 : (diffValue / previousValue) * 100;
    return {
      stage,
      previousValue,
      currentValue,
      diffValue,
      diffRate: Number(diffRate.toFixed(2)),
    };
  });

  return { stages };
}

export function getMockExcessInventoryAgeWarehouseDrilldown(query = {}) {
  const { dataType = 'amount', stage = '' } = query;
  const rows = buildDataset(query);
  const stageIndex = Math.max(0, AGE_STAGES.findIndex((item) => item === stage));
  const currentStageRatio = AGE_STAGE_CURRENT_RATIOS[stageIndex] || AGE_STAGE_CURRENT_RATIOS[0];
  const previousStageRatio = AGE_STAGE_PREVIOUS_RATIOS[stageIndex] || AGE_STAGE_PREVIOUS_RATIOS[0];

  const grouped = new Map();
  rows.forEach((item) => {
    const warehouse = getInventoryAgeWarehouseKey(item);
    if (!grouped.has(warehouse)) {
      grouped.set(warehouse, { current: 0, previous: 0 });
    }
    const pair = getExcess12Pair(item, dataType);
    const g = grouped.get(warehouse);
    g.current += pair.current * currentStageRatio;
    g.previous += pair.previous * previousStageRatio;
  });

  const list = Array.from(grouped.entries())
    .map(([warehouse, agg]) => {
      const value = Math.round(agg.current);
      const diff = agg.current - agg.previous;
      const momRate = agg.previous === 0 ? 0 : (diff / agg.previous) * 100;
      return {
        warehouse,
        previousValue: Math.round(agg.previous),
        currentValue: value,
        diffValue: Math.round(diff),
        value,
        momRate: Number(momRate.toFixed(2)),
        share: 0,
      };
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  const total = list.reduce((sum, item) => sum + item.value, 0);
  list.forEach((item) => {
    item.share = total === 0 ? 0 : Number(((item.value / total) * 100).toFixed(2));
  });

  return { stage, rows: list };
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
    dataType = 'amount',
    level1 = 'category',
    selectedMetric = 'safe',
  } = query;
  const rows = buildDataset(query);
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
  const { dataType = 'amount', dimension = 'bu' } = query;
  const rows = buildDataset(query);

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
        previousValue: Math.round(agg.previous),
        currentValue: Math.round(agg.current),
        diffValue: Math.round(diff),
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

/**
 * 库龄分析下钻：类目/仓库 维度下钻到描述 TOP10
 * @param {Object} query
 * @param {string} query.dataType - amount | qty
 * @param {string} query.dimension - category | warehouse
 * @param {string} query.dimensionName - 维度值
 */
export function getMockInventoryAgeOver365DrilldownTop10(query = {}) {
  const { dataType = 'amount', dimension = 'category', dimensionName = '' } = query;
  const rows = buildDataset(query);
  const filtered = rows.filter((item) => {
    if (dimension === 'category') return item.category === dimensionName;
    if (dimension === 'warehouse') return getInventoryAgeWarehouseKey(item) === dimensionName;
    return false;
  });

  const grouped = new Map();
  filtered.forEach((item) => {
    const key = `${item.description}||${item.category}||${item.series}`;
    if (!grouped.has(key)) {
      grouped.set(key, {
        description: item.description,
        category: item.category,
        series: item.series,
        current: 0,
        previous: 0,
      });
    }
    const pair = getExcess12Pair(item, dataType);
    const g = grouped.get(key);
    g.current += pair.current;
    g.previous += pair.previous;
  });

  const list = Array.from(grouped.values()).map((item) => {
    const diff = item.current - item.previous;
    const momRate = item.previous === 0 ? 0 : (diff / item.previous) * 100;
    return {
      description: item.description,
      category: item.category,
      series: item.series,
      previousValue: Math.round(item.previous),
      currentValue: Math.round(item.current),
      diffValue: Math.round(diff),
      value: Math.round(item.current),
      momDiff: Math.round(diff),
      momRate: Number(momRate.toFixed(2)),
      share: 0,
    };
  });

  const total = list.reduce((sum, item) => sum + item.value, 0);
  list.forEach((item) => {
    item.share = total === 0 ? 0 : Number(((item.value / total) * 100).toFixed(2));
  });

  return {
    dimension,
    dimensionName,
    rows: list.sort((a, b) => b.value - a.value).slice(0, 10),
  };
}
