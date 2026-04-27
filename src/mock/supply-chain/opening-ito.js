/** Opening & ITO Dashboard mock data generator */

import { get, set } from '../../utils/storage';
import { SUPPLY_CHAIN_OPENING_ITO } from '../../utils/storageKeys';

// BU 列表（与规划一致）
const BU_LIST = [
  'KK Amazon',
  'KK Shopify',
  'Tik Tok ACCU',
  'Tik Tok东南亚',
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

// 类目列表
const CATEGORY_LIST = [
  'Reels',
  'Rods',
  'Lures',
  'Hooks',
  'Lines',
  'Accessories',
];

// 仓位类型
const WAREHOUSE_TYPES = ['共享仓', '业务仓'];

// 商超相关 SKU 黑名单（不含商超时需要排除）
const RETAIL_SKU_BLACKLIST = [
  'KRLCSTM12-75LDG',
  'KRLCSTM12-75RDG',
  'KRLSPNKP-S30GM',
  'KRLSPNKP-S40GM',
  'KRLSPNKP-S50GM',
  'KRLSPNKP-S60GM',
  'KRLSPNKP-S80GM',
  'KRLCSTSDE-DB74RGS',
  'KRLCSTSDE-DB74LGS',
];

// 商超BU
const RETAIL_BU = 'Retail';

/**
 * 过滤商超数据
 * @param {Array} data - 原始数据
 * @param {boolean} includeRetail - 是否包含商超
 * @returns {Array} 过滤后的数据
 */
function filterRetailData(data, includeRetail = true) {
  if (includeRetail) return data;
  
  return data.filter(item => {
    // 排除 Retail BU
    if (item.bu === RETAIL_BU) return false;
    // 排除黑名单 SKU
    if (RETAIL_SKU_BLACKLIST.includes(item.sku)) return false;
    return true;
  });
}

/**
 * 生成稳定的随机值（基于 seed）
 */
function stableRandom(seed, min = 0, max = 1) {
  const x = Math.sin(seed) * 10000;
  const r = x - Math.floor(x);
  return min + r * (max - min);
}

/**
 * 生成 mock 数据
 * 覆盖 2024-2026 共 36 个月的数据
 */
function generateMockData() {
  const data = [];
  const now = new Date('2026-03-15'); // 固定参考时间
  const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // 生成 36 个月的数据
  for (let i = 0; i < 36; i++) {
    const month = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - i, 1);
    const monthStr = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`;

    // 为每个 BU + 仓位 + 类目 组合生成数据
    BU_LIST.forEach((bu, buIndex) => {
      WAREHOUSE_TYPES.forEach((warehouseType, whIndex) => {
        CATEGORY_LIST.forEach((category, catIndex) => {
          // 生成唯一 seed
          const baseSeed =
            (buIndex + 1) * 10000 + (whIndex + 1) * 1000 + (catIndex + 1) * 100 + i;

          // 期初金额（50万-500万）
          const openingAmount = Math.round(stableRandom(baseSeed, 500000, 5000000));
          // 期初数量（1000-10000）
          const openingQty = Math.round(stableRandom(baseSeed + 1, 1000, 10000));
          // 实销金额
          const salesAmount = Math.round(openingAmount * stableRandom(baseSeed + 2, 0.3, 0.8));
          // 实销数量
          const salesQty = Math.round(openingQty * stableRandom(baseSeed + 3, 0.3, 0.8));
          // ITO（0.5-6.0）
          const ito = Number(stableRandom(baseSeed + 4, 0.5, 6.0).toFixed(2));

          // 上月数据（用于环比计算）
          const prevMonthSeed = baseSeed + 100;
          const lastMonthOpeningAmount = Math.round(stableRandom(prevMonthSeed, 500000, 5000000));
          const lastMonthOpeningQty = Math.round(stableRandom(prevMonthSeed + 1, 1000, 10000));
          const lastMonthSalesAmount = Math.round(
            lastMonthOpeningAmount * stableRandom(prevMonthSeed + 2, 0.3, 0.8)
          );
          const lastMonthSalesQty = Math.round(
            lastMonthOpeningQty * stableRandom(prevMonthSeed + 3, 0.3, 0.8)
          );
          const lastMonthIto = Number(stableRandom(prevMonthSeed + 4, 0.5, 6.0).toFixed(2));

          // 去年同期数据（用于同比计算）
          const lastYearSeed = baseSeed + 200;
          const lastYearOpeningAmount = Math.round(stableRandom(lastYearSeed, 500000, 5000000));
          const lastYearOpeningQty = Math.round(stableRandom(lastYearSeed + 1, 1000, 10000));
          const lastYearSalesAmount = Math.round(
            lastYearOpeningAmount * stableRandom(lastYearSeed + 2, 0.3, 0.8)
          );
          const lastYearSalesQty = Math.round(
            lastYearOpeningQty * stableRandom(lastYearSeed + 3, 0.3, 0.8)
          );
          const lastYearIto = Number(stableRandom(lastYearSeed + 4, 0.5, 6.0).toFixed(2));

          data.push({
            id: `${monthStr}-${bu}-${warehouseType}-${category}`,
            month: monthStr,
            bu,
            warehouseType,
            category,
            openingAmount,
            openingQty,
            salesAmount,
            salesQty,
            ito,
            lastMonthOpeningAmount,
            lastMonthOpeningQty,
            lastMonthSalesAmount,
            lastMonthSalesQty,
            lastMonthIto,
            lastYearOpeningAmount,
            lastYearOpeningQty,
            lastYearSalesAmount,
            lastYearSalesQty,
            lastYearIto,
          });
        });
      });
    });
  }

  return data;
}

/**
 * 获取 Opening ITO 数据列表
 */
export function getMockOpeningItoList() {
  // 版本号：当数据结构变化时更新，强制重新生成
  const DATA_VERSION = 'v2-ito-rate';
  const VERSION_KEY = `${SUPPLY_CHAIN_OPENING_ITO}_version`;

  const storedVersion = get(VERSION_KEY);
  const stored = get(SUPPLY_CHAIN_OPENING_ITO);

  // 如果版本匹配且数据存在，使用缓存
  if (storedVersion === DATA_VERSION && stored && Array.isArray(stored) && stored.length > 0) {
    return stored;
  }

  // 版本不匹配或数据不存在，重新生成
  console.log('[Mock] Regenerating opening-ito data, version:', DATA_VERSION);
  const mockData = generateMockData();
  try {
    set(VERSION_KEY, DATA_VERSION);
    set(SUPPLY_CHAIN_OPENING_ITO, mockData);
  } catch (e) {
    if (e.name !== 'QuotaExceededError') {
      console.warn('Failed to cache opening-ito mock data:', e.message);
    }
  }
  return mockData;
}

/**
 * 按月份和条件筛选数据
 */
export function getMockOpeningItoByMonth(month, query = {}) {
  const { bu, warehouseType, category } = query;
  const allData = getMockOpeningItoList();

  let filtered = allData.filter((item) => item.month === month);

  if (bu && bu !== 'all') {
    filtered = filtered.filter((item) => item.bu === bu);
  }

  if (warehouseType && warehouseType !== 'all') {
    filtered = filtered.filter((item) => item.warehouseType === warehouseType);
  }

  if (category && category !== 'all') {
    filtered = filtered.filter((item) => item.category === category);
  }

  return filtered;
}

/**
 * 获取月份选项
 */
export function getMockOpeningItoMonthOptions() {
  const allData = getMockOpeningItoList();
  const months = [...new Set(allData.map((item) => item.month))].sort().reverse();

  return months.map((month) => {
    const [year, mon] = month.split('-');
    return {
      value: month,
      label: `${year}年${parseInt(mon, 10)}月`,
    };
  });
}

/**
 * 获取 BU 选项
 */
export function getMockOpeningItoBuOptions() {
  return [
    { value: 'all', label: '全部BU' },
    ...BU_LIST.map((bu) => ({ value: bu, label: bu })),
  ];
}

/**
 * 获取类目选项
 */
export function getMockOpeningItoCategoryOptions() {
  return [
    { value: 'all', label: '全部类目' },
    ...CATEGORY_LIST.map((cat) => ({ value: cat, label: cat })),
  ];
}

/**
 * 获取指标卡数据
 */
export function getMockOpeningItoMetricCards(query) {
  const { month, dataType = 'amount', includeRetail = true } = query;
  const allData = getMockOpeningItoList();

  // 筛选当月数据并应用商超过滤
  let monthData = allData.filter((item) => item.month === month);
  monthData = filterRetailData(monthData, includeRetail);

  // 计算 Total
  const totalValue =
    dataType === 'amount'
      ? monthData.reduce((sum, item) => sum + item.openingAmount, 0)
      : monthData.reduce((sum, item) => sum + item.openingQty, 0);

  const lastMonthValue =
    dataType === 'amount'
      ? monthData.reduce((sum, item) => sum + item.lastMonthOpeningAmount, 0)
      : monthData.reduce((sum, item) => sum + item.lastMonthOpeningQty, 0);

  const lastYearValue =
    dataType === 'amount'
      ? monthData.reduce((sum, item) => sum + item.lastYearOpeningAmount, 0)
      : monthData.reduce((sum, item) => sum + item.lastYearOpeningQty, 0);

  const totalIto =
    monthData.reduce((sum, item) => sum + item.ito, 0) / (monthData.length || 1);
  const totalLastMonthIto =
    monthData.reduce((sum, item) => sum + item.lastMonthIto, 0) / (monthData.length || 1);
  const totalLastYearIto =
    monthData.reduce((sum, item) => sum + item.lastYearIto, 0) / (monthData.length || 1);

  // 计算各 BU 数据（根据是否含商超过滤BU列表）
  const filteredBuList = includeRetail ? BU_LIST : BU_LIST.filter(bu => bu !== RETAIL_BU);
  const buCards = filteredBuList.map((bu) => {
    const buData = monthData.filter((item) => item.bu === bu);

    const value =
      dataType === 'amount'
        ? buData.reduce((sum, item) => sum + item.openingAmount, 0)
        : buData.reduce((sum, item) => sum + item.openingQty, 0);

    const lastMonthBuValue =
      dataType === 'amount'
        ? buData.reduce((sum, item) => sum + item.lastMonthOpeningAmount, 0)
        : buData.reduce((sum, item) => sum + item.lastMonthOpeningQty, 0);

    const lastYearBuValue =
      dataType === 'amount'
        ? buData.reduce((sum, item) => sum + item.lastYearOpeningAmount, 0)
        : buData.reduce((sum, item) => sum + item.lastYearOpeningQty, 0);

    const buIto =
      buData.reduce((sum, item) => sum + item.ito, 0) / (buData.length || 1);
    const buLastMonthIto =
      buData.reduce((sum, item) => sum + item.lastMonthIto, 0) / (buData.length || 1);
    const buLastYearIto =
      buData.reduce((sum, item) => sum + item.lastYearIto, 0) / (buData.length || 1);

    return {
      bu,
      value,
      lastMonthValue: lastMonthBuValue,
      lastYearValue: lastYearBuValue,
      momRate: lastMonthBuValue ? ((value - lastMonthBuValue) / lastMonthBuValue) * 100 : 0,
      yoyRate: lastYearBuValue ? ((value - lastYearBuValue) / lastYearBuValue) * 100 : 0,
      ito: buIto,
      lastMonthIto: buLastMonthIto,
      lastYearIto: buLastYearIto,
      // ITO 变化率（百分比）
      itoMomRate: buLastMonthIto ? ((buIto - buLastMonthIto) / buLastMonthIto) * 100 : 0,
      itoYoyRate: buLastYearIto ? ((buIto - buLastYearIto) / buLastYearIto) * 100 : 0,
    };
  });

  return {
    total: {
      value: totalValue,
      lastMonthValue,
      lastYearValue,
      momRate: lastMonthValue ? ((totalValue - lastMonthValue) / lastMonthValue) * 100 : 0,
      yoyRate: lastYearValue ? ((totalValue - lastYearValue) / lastYearValue) * 100 : 0,
      ito: totalIto,
      lastMonthIto: totalLastMonthIto,
      lastYearIto: totalLastYearIto,
      // ITO 变化率（百分比）
      itoMomRate: totalLastMonthIto ? ((totalIto - totalLastMonthIto) / totalLastMonthIto) * 100 : 0,
      itoYoyRate: totalLastYearIto ? ((totalIto - totalLastYearIto) / totalLastYearIto) * 100 : 0,
    },
    buCards,
    dataType,
  };
}

/**
 * 获取 BU-仓位维度表格数据
 */
export function getMockOpeningItoBuWarehouseTable(query) {
  const { month, dataType = 'amount', includeRetail = true } = query;
  const allData = getMockOpeningItoList();

  // 筛选当月数据并应用商超过滤
  let monthData = allData.filter((item) => item.month === month);
  monthData = filterRetailData(monthData, includeRetail);

  // 按 BU + 仓位聚合（过滤后的BU列表）
  const filteredBuList = includeRetail ? BU_LIST : BU_LIST.filter(bu => bu !== RETAIL_BU);
  const rows = filteredBuList.map((bu) => {
    const buData = monthData.filter((item) => item.bu === bu);

    // 共享仓
    const sharedData = buData.filter((item) => item.warehouseType === '共享仓');
    const sharedCurrent =
      dataType === 'amount'
        ? sharedData.reduce((sum, item) => sum + item.openingAmount, 0)
        : sharedData.reduce((sum, item) => sum + item.openingQty, 0);
    const sharedLastMonth =
      dataType === 'amount'
        ? sharedData.reduce((sum, item) => sum + item.lastMonthOpeningAmount, 0)
        : sharedData.reduce((sum, item) => sum + item.lastMonthOpeningQty, 0);

    // 业务仓
    const bizData = buData.filter((item) => item.warehouseType === '业务仓');
    const bizCurrent =
      dataType === 'amount'
        ? bizData.reduce((sum, item) => sum + item.openingAmount, 0)
        : bizData.reduce((sum, item) => sum + item.openingQty, 0);
    const bizLastMonth =
      dataType === 'amount'
        ? bizData.reduce((sum, item) => sum + item.lastMonthOpeningAmount, 0)
        : bizData.reduce((sum, item) => sum + item.lastMonthOpeningQty, 0);

    // 总计
    const totalCurrent = sharedCurrent + bizCurrent;
    const totalLastMonth = sharedLastMonth + bizLastMonth;

    return {
      bu,
      sharedCurrent,
      sharedLastMonth,
      sharedMomDiff: sharedCurrent - sharedLastMonth,
      sharedMomRate: sharedLastMonth ? ((sharedCurrent - sharedLastMonth) / sharedLastMonth) * 100 : 0,
      bizCurrent,
      bizLastMonth,
      bizMomDiff: bizCurrent - bizLastMonth,
      bizMomRate: bizLastMonth ? ((bizCurrent - bizLastMonth) / bizLastMonth) * 100 : 0,
      totalCurrent,
      totalLastMonth,
      totalMomDiff: totalCurrent - totalLastMonth,
      totalMomRate: totalLastMonth ? ((totalCurrent - totalLastMonth) / totalLastMonth) * 100 : 0,
    };
  });

  // 计算汇总行
  const summaryRow = {
    bu: '汇总',
    sharedCurrent: rows.reduce((sum, row) => sum + row.sharedCurrent, 0),
    sharedLastMonth: rows.reduce((sum, row) => sum + row.sharedLastMonth, 0),
    bizCurrent: rows.reduce((sum, row) => sum + row.bizCurrent, 0),
    bizLastMonth: rows.reduce((sum, row) => sum + row.bizLastMonth, 0),
    totalCurrent: rows.reduce((sum, row) => sum + row.totalCurrent, 0),
    totalLastMonth: rows.reduce((sum, row) => sum + row.totalLastMonth, 0),
  };

  summaryRow.sharedMomDiff = summaryRow.sharedCurrent - summaryRow.sharedLastMonth;
  summaryRow.sharedMomRate = summaryRow.sharedLastMonth
    ? ((summaryRow.sharedCurrent - summaryRow.sharedLastMonth) / summaryRow.sharedLastMonth) * 100
    : 0;
  summaryRow.bizMomDiff = summaryRow.bizCurrent - summaryRow.bizLastMonth;
  summaryRow.bizMomRate = summaryRow.bizLastMonth
    ? ((summaryRow.bizCurrent - summaryRow.bizLastMonth) / summaryRow.bizLastMonth) * 100
    : 0;
  summaryRow.totalMomDiff = summaryRow.totalCurrent - summaryRow.totalLastMonth;
  summaryRow.totalMomRate = summaryRow.totalLastMonth
    ? ((summaryRow.totalCurrent - summaryRow.totalLastMonth) / summaryRow.totalLastMonth) * 100
    : 0;

  return {
    columns: [
      { key: 'bu', title: 'BU/仓位', fixed: true },
      {
        key: 'currentMonth',
        title: '202603', // 动态替换
        children: [
          { key: 'sharedCurrent', title: '共享仓' },
          { key: 'bizCurrent', title: '业务仓' },
          { key: 'totalCurrent', title: '总计' },
        ],
      },
      {
        key: 'lastMonth',
        title: '202602', // 动态替换
        children: [
          { key: 'sharedLastMonth', title: '共享仓' },
          { key: 'bizLastMonth', title: '业务仓' },
          { key: 'totalLastMonth', title: '总计' },
        ],
      },
      {
        key: 'momDiff',
        title: '环比金额',
        children: [
          { key: 'sharedMomDiff', title: '共享仓' },
          { key: 'bizMomDiff', title: '业务仓' },
          { key: 'totalMomDiff', title: '总计' },
        ],
      },
      {
        key: 'momRate',
        title: '环比',
        children: [
          { key: 'sharedMomRate', title: '共享仓' },
          { key: 'bizMomRate', title: '业务仓' },
          { key: 'totalMomRate', title: '总计' },
        ],
      },
    ],
    rows,
    summaryRow,
    meta: {
      month,
      dataType,
      currentMonthLabel: month,
      lastMonthLabel: getPreviousMonthStr(month),
    },
  };
}

/**
 * 获取 BU-类目维度表格数据
 */
export function getMockOpeningItoBuCategoryTable(query) {
  const { month, dataType = 'amount', includeRetail = true } = query;
  const allData = getMockOpeningItoList();

  // 筛选当月数据并应用商超过滤
  let monthData = allData.filter((item) => item.month === month);
  monthData = filterRetailData(monthData, includeRetail);

  // 按类目聚合
  const rows = CATEGORY_LIST.map((category) => {
    const catData = monthData.filter((item) => item.category === category);

    // 按 BU 汇总
    const buValues = {};
    BU_LIST.forEach((bu) => {
      const buData = catData.filter((item) => item.bu === bu);
      buValues[bu] =
        dataType === 'amount'
          ? buData.reduce((sum, item) => sum + item.openingAmount, 0)
          : buData.reduce((sum, item) => sum + item.openingQty, 0);
    });

    // 汇总
    const total = Object.values(buValues).reduce((sum, val) => sum + val, 0);

    return {
      category,
      ...buValues,
      total,
    };
  });

  // 添加 Others 行（如果有数据）
  const othersData = monthData.filter(
    (item) => !CATEGORY_LIST.includes(item.category)
  );
  if (othersData.length > 0) {
    const buValues = {};
    BU_LIST.forEach((bu) => {
      const buData = othersData.filter((item) => item.bu === bu);
      buValues[bu] =
        dataType === 'amount'
          ? buData.reduce((sum, item) => sum + item.openingAmount, 0)
          : buData.reduce((sum, item) => sum + item.openingQty, 0);
    });
    const total = Object.values(buValues).reduce((sum, val) => sum + val, 0);
    rows.push({
      category: 'Others',
      ...buValues,
      total,
    });
  }

  // 计算汇总行
  const summaryRow = { category: '汇总' };
  BU_LIST.forEach((bu) => {
    summaryRow[bu] = rows.reduce((sum, row) => sum + (row[bu] || 0), 0);
  });
  summaryRow.total = rows.reduce((sum, row) => sum + row.total, 0);

  return {
    columns: [
      { key: 'category', title: 'Category', fixed: true },
      ...BU_LIST.map((bu) => ({ key: bu, title: bu })),
      { key: 'total', title: '汇总', fixed: 'right' },
    ],
    rows,
    summaryRow,
    meta: {
      month,
      dataType,
    },
  };
}

/**
 * 获取饼图数据
 */
export function getMockOpeningItoPieData(query) {
  const { month, dataType = 'amount', dimension = 'category', includeRetail = true } = query;
  const allData = getMockOpeningItoList();

  // 筛选当月数据并应用商超过滤
  let monthData = allData.filter((item) => item.month === month);
  monthData = filterRetailData(monthData, includeRetail);

  let openingDistribution = [];
  let salesDistribution = [];

  if (dimension === 'category') {
    // 按类目维度
    openingDistribution = CATEGORY_LIST.map((category) => {
      const catData = monthData.filter((item) => item.category === category);
      const value =
        dataType === 'amount'
          ? catData.reduce((sum, item) => sum + item.openingAmount, 0)
          : catData.reduce((sum, item) => sum + item.openingQty, 0);
      return { name: category, value };
    });

    salesDistribution = CATEGORY_LIST.map((category) => {
      const catData = monthData.filter((item) => item.category === category);
      const value =
        dataType === 'amount'
          ? catData.reduce((sum, item) => sum + item.salesAmount, 0)
          : catData.reduce((sum, item) => sum + item.salesQty, 0);
      return { name: category, value };
    });
  } else {
    // 按 BU 维度
    openingDistribution = BU_LIST.map((bu) => {
      const buData = monthData.filter((item) => item.bu === bu);
      const value =
        dataType === 'amount'
          ? buData.reduce((sum, item) => sum + item.openingAmount, 0)
          : buData.reduce((sum, item) => sum + item.openingQty, 0);
      return { name: bu, value };
    });

    salesDistribution = BU_LIST.map((bu) => {
      const buData = monthData.filter((item) => item.bu === bu);
      const value =
        dataType === 'amount'
          ? buData.reduce((sum, item) => sum + item.salesAmount, 0)
          : buData.reduce((sum, item) => sum + item.salesQty, 0);
      return { name: bu, value };
    });
  }

  return {
    openingDistribution,
    salesDistribution,
    meta: {
      month,
      dataType,
      dimension,
    },
  };
}

/**
 * 获取上一个月字符串
 */
function getPreviousMonthStr(monthStr) {
  const [year, mon] = monthStr.split('-').map(Number);
  const d = new Date(year, mon - 2, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

/**
 * 获取年度趋势数据（用于图表1：2025 vs 2026 对比）
 * @param {Object} query - 查询参数
 * @param {string} query.dataType - 数据类型：'amount' | 'qty'
 * @param {boolean} query.includeRetail - 是否包含商超数据
 */
export function getMockOpeningItoYearlyTrend(query) {
  const { dataType = 'amount', includeRetail = true } = query;
  const allData = getMockOpeningItoList();

  // 过滤商超数据
  const filteredData = filterRetailData(allData, includeRetail);

  // 生成12个月的数据
  const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

  const data2025 = months.map((month) => {
    const monthKey = `2025-${month}`;
    const monthData = filteredData.filter((item) => item.month === monthKey);

    const openingValue =
      dataType === 'amount'
        ? monthData.reduce((sum, item) => sum + item.openingAmount, 0)
        : monthData.reduce((sum, item) => sum + item.openingQty, 0);

    const itoValue =
      monthData.reduce((sum, item) => sum + item.ito, 0) / (monthData.length || 1);

    return {
      month,
      monthKey,
      opening: openingValue,
      ito: itoValue,
    };
  });

  const data2026 = months.map((month) => {
    const monthKey = `2026-${month}`;
    const monthData = filteredData.filter((item) => item.month === monthKey);

    const openingValue =
      dataType === 'amount'
        ? monthData.reduce((sum, item) => sum + item.openingAmount, 0)
        : monthData.reduce((sum, item) => sum + item.openingQty, 0);

    const itoValue =
      monthData.reduce((sum, item) => sum + item.ito, 0) / (monthData.length || 1);

    return {
      month,
      monthKey,
      opening: openingValue,
      ito: itoValue,
    };
  });

  return {
    months,
    data2025,
    data2026,
    meta: {
      dataType,
      includeRetail,
      years: ['2025', '2026'],
    },
  };
}

/**
 * 获取月度趋势数据（用于图表2：本期期初+ITO）
 * @param {Object} query - 查询参数
 * @param {string} query.year - 年份：'2025' | '2026'
 * @param {string} query.dataType - 数据类型：'amount' | 'qty'
 * @param {boolean} query.includeRetail - 是否包含商超数据
 */
export function getMockOpeningItoMonthlyTrend(query) {
  const { year = '2026', dataType = 'amount', includeRetail = true } = query;
  const allData = getMockOpeningItoList();

  // 过滤商超数据
  const filteredData = filterRetailData(allData, includeRetail);

  // 生成12个月的数据
  const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

  const monthlyData = months.map((month) => {
    const monthKey = `${year}-${month}`;
    const monthData = filteredData.filter((item) => item.month === monthKey);

    const openingValue =
      dataType === 'amount'
        ? monthData.reduce((sum, item) => sum + item.openingAmount, 0)
        : monthData.reduce((sum, item) => sum + item.openingQty, 0);

    const itoValue =
      monthData.reduce((sum, item) => sum + item.ito, 0) / (monthData.length || 1);

    return {
      month,
      monthKey,
      opening: openingValue,
      ito: itoValue,
    };
  });

  return {
    months,
    data: monthlyData,
    meta: {
      year,
      dataType,
      includeRetail,
    },
  };
}

/**
 * 获取类目分析数据
 * @param {Object} query - 查询参数
 * @param {string} query.month - 月份：'2026-03'
 * @param {string} query.dataType - 数据类型：'amount' | 'qty'
 * @param {boolean} query.includeRetail - 是否包含商超数据
 */
export function getMockCategoryAnalysisData(query) {
  const { month = '2026-03', dataType = 'amount', includeRetail = true } = query;
  const allData = getMockOpeningItoList();

  // 过滤商超数据
  const filteredData = filterRetailData(allData, includeRetail);

  // 解析当前月份和上一月份
  const [year, mon] = month.split('-');
  const currentMonth = month;
  const prevMonth = `${year}-${String(parseInt(mon) - 1).padStart(2, '0')}`;

  // 获取类目列表
  const categories = [...new Set(filteredData.map((item) => item.category))].sort();

  // BU列表（根据includeRetail过滤）
  const buList = [
    'KK Amazon',
    'KK Shopify',
    'Tik Tok ACCU',
    'China',
    'EMEA',
    'Outdoor Amazon',
    'Walmart线上',
    'Ebay',
    ...(includeRetail ? ['Retail'] : []),
    '推广&福利',
    'Amazon',
    'Other',
  ];

  // 计算每个类目在每个BU下的期初差异（本期 - 上期）
  const categoryDiffs = categories.map((category) => {
    const row = { category, total: 0 };

    buList.forEach((bu) => {
      // 本期数据
      const currentData = filteredData.filter(
        (item) =>
          item.category === category && item.bu === bu && item.month === currentMonth
      );
      const currentValue =
        dataType === 'amount'
          ? currentData.reduce((sum, item) => sum + item.openingAmount, 0)
          : currentData.reduce((sum, item) => sum + item.openingQty, 0);

      // 上期数据
      const prevData = filteredData.filter(
        (item) =>
          item.category === category && item.bu === bu && item.month === prevMonth
      );
      const prevValue =
        dataType === 'amount'
          ? prevData.reduce((sum, item) => sum + item.openingAmount, 0)
          : prevData.reduce((sum, item) => sum + item.openingQty, 0);

      // 差异
      const diff = currentValue - prevValue;
      row[bu] = diff;
      row.total += diff;
    });

    return row;
  });

  // 计算TOP10增加排名（找出所有正值中最大的10个）
  const allIncreases = [];
  categoryDiffs.forEach((row) => {
    buList.forEach((bu) => {
      const diff = row[bu];
      if (diff > 0) {
        allIncreases.push({
          bu,
          category: row.category,
          value: diff,
        });
      }
    });
  });

  // 按金额从大到小排序，取前10
  const top10 = allIncreases
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  return {
    categoryDiffs,
    top10,
    meta: {
      month: currentMonth,
      prevMonth,
      dataType,
      includeRetail,
      buList,
    },
  };
}
