/** Forecast Tracking mock data generator */

import { get, set } from '../../utils/storage';
import { SUPPLY_CHAIN_FORECAST } from '../../utils/storageKeys';

// 生成模拟SKU数据
const categories = ['Reels', 'Rods', 'Lures', 'Hooks', 'Lines', 'Accessories'];
const bus = [
  'KK Amazon', 'KK Shopify', 'Tik Tok ACCU', 'Tik Tok SEA', 'China', 'EMEA',
  'Outdoor Amazon', 'Walmart Online', 'Ebay', 'Retail', 'Promotion',
  'JP Amazon', 'Other'
];

/**
 * 生成模拟数据
 * 关键概念：P-1/P-3/P-5 表示"在N月前做出的对当前月份的预测"
 * 例如：对于2026-02月的记录
 * - p1ForecastAmount = 2026-01版本对2026-02的预测
 * - p3ForecastAmount = 2025-12版本对2026-02的预测
 * - p5ForecastAmount = 2025-10版本对2026-02的预测
 */
function generateMockData() {
  const data = [];
  // 使用固定参考时间确保数据一致性（模拟2026年3月）
  const REFERENCE_NOW = new Date('2026-03-15');
  const now = REFERENCE_NOW;
  const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  // 先生成基础数据模板（用于跨月引用）
  const baseDataTemplate = {};

  // 先生成固定的SKU清单（确保36个月都有相同的SKU集合，用于连续异常判断）
  const fixedSkuList = [];
  let skuIndex = 0;
  bus.forEach(bu => {
    categories.forEach(category => {
      // 每个BU每个类目固定生成4个SKU（不再随机）
      for (let j = 0; j < 4; j++) {
        const skuId = `SKU${String(skuIndex).padStart(4, '0')}`;
        skuIndex++;
        // 基础金额和数量（使用伪随机确保跨月一致性）
        const baseAmount = 50000 + ((skuIndex * 12345) % 200000);
        // qty基数放大10倍，确保在数量模式下也能满足异常判断阈值(>=30)
        const baseQty = 1000 + ((skuIndex * 567) % 5000);
        
        fixedSkuList.push({
          skuId,
          skuName: `${category} Product ${j + 1}`,
          category,
          bu,
          baseAmount,
          baseQty,
          skuSeed: `${bu}-${category}-${skuId}`,
        });
      }
    });
  });

  // 生成36个月的数据（覆盖2024、2025、2026三年，从2026-03往前推）
  for (let i = 0; i < 36; i++) {
    const month = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - i, 1);
    const monthStr = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`;
    baseDataTemplate[monthStr] = {};
    
    // 使用固定的SKU清单填充每个月
    fixedSkuList.forEach(sku => {
      baseDataTemplate[monthStr][sku.skuSeed] = { ...sku };
    });
  }
  
  // 第二次遍历：为每个月生成实际数据和历史预测数据
  for (let i = 0; i < 36; i++) {
    const month = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - i, 1);
    const monthStr = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`;
    
    // 获取P-1, P-3, P-5对应的月份
    const p1Month = new Date(month.getFullYear(), month.getMonth() - 1, 1);
    const p1MonthStr = `${p1Month.getFullYear()}-${String(p1Month.getMonth() + 1).padStart(2, '0')}`;
    const p3Month = new Date(month.getFullYear(), month.getMonth() - 3, 1);
    const p3MonthStr = `${p3Month.getFullYear()}-${String(p3Month.getMonth() + 1).padStart(2, '0')}`;
    const p5Month = new Date(month.getFullYear(), month.getMonth() - 5, 1);
    const p5MonthStr = `${p5Month.getFullYear()}-${String(p5Month.getMonth() + 1).padStart(2, '0')}`;
    
    Object.keys(baseDataTemplate[monthStr]).forEach(skuSeed => {
      const template = baseDataTemplate[monthStr][skuSeed];
      const { skuId, skuName, category, bu, baseAmount, baseQty } = template;
      
      // 当前版本的Forecast（本月最新预测）
      const forecastAmount = Math.round(baseAmount * (0.8 + Math.random() * 0.4));
      const forecastQty = Math.round(baseQty * (0.8 + Math.random() * 0.4));
      
      // 为每个SKU生成固定的偏差倾向（基于skuSeed的hash）
      // 这样同一SKU在不同月份会有相似的偏差倾向，提高连续异常概率
      const skuHash = skuSeed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      // 基础偏差倾向：-35% ~ +35% 的固定偏移（确保部分SKU必定超过±15%阈值）
      const baseBias = ((skuHash % 70) - 35) / 100;
      // 随机波动：-20% ~ +20%
      const randomDeviation = (Math.random() - 0.5) * 0.4;
      // 总偏差 = 固定倾向 + 随机波动，范围约 -55% ~ +55%
      const deviationRate = baseBias + randomDeviation;
      const actualAmount = Math.round(forecastAmount * (1 + deviationRate));
      const actualQty = Math.round(forecastQty * (1 + deviationRate));
      
      /**
       * P-1: 上月(P-1Month)版本中对此月份(month)的预测
       * 即从P-1Month的数据模板中获取对此月份的预测值
       */
      let p1ForecastAmount = null;
      let p1ForecastQty = null;
      if (i > 0 && baseDataTemplate[p1MonthStr] && baseDataTemplate[p1MonthStr][skuSeed]) {
        const p1Template = baseDataTemplate[p1MonthStr][skuSeed];
        // P-1月的预测对当前月：使用基础值的0.85-1.15倍，并加入一些随机性
        const p1Seed = (p1Template.baseAmount * 1000) % 100 / 100;
        p1ForecastAmount = Math.round(p1Template.baseAmount * (0.85 + p1Seed * 0.3));
        p1ForecastQty = Math.round(p1Template.baseQty * (0.85 + p1Seed * 0.3));
      }
      
      /**
       * P-3: 3月前(P-3Month)版本中对此月份(month)的预测
       */
      let p3ForecastAmount = null;
      let p3ForecastQty = null;
      if (i > 2 && baseDataTemplate[p3MonthStr] && baseDataTemplate[p3MonthStr][skuSeed]) {
        const p3Template = baseDataTemplate[p3MonthStr][skuSeed];
        const p3Seed = (p3Template.baseAmount * 100) % 100 / 100;
        p3ForecastAmount = Math.round(p3Template.baseAmount * (0.9 + p3Seed * 0.2));
        p3ForecastQty = Math.round(p3Template.baseQty * (0.9 + p3Seed * 0.2));
      }

      /**
       * P-5: 5月前(P-5Month)版本中对此月份(month)的预测
       */
      let p5ForecastAmount = null;
      let p5ForecastQty = null;
      if (i > 4 && baseDataTemplate[p5MonthStr] && baseDataTemplate[p5MonthStr][skuSeed]) {
        const p5Template = baseDataTemplate[p5MonthStr][skuSeed];
        const p5Seed = (p5Template.baseAmount * 10) % 100 / 100;
        p5ForecastAmount = Math.round(p5Template.baseAmount * (0.92 + p5Seed * 0.16));
        p5ForecastQty = Math.round(p5Template.baseQty * (0.92 + p5Seed * 0.16));
      }

      data.push({
        id: `${monthStr}-${bu}-${category}-${skuId}`,
        sku: skuId,
        skuName,
        category,
        bu,
        month: monthStr,
        forecastAmount,
        forecastQty,
        actualAmount,
        actualQty,
        deviationRate: Number(((actualAmount - forecastAmount) / forecastAmount).toFixed(4)),
        p1ForecastAmount,
        p1ForecastQty,
        p3ForecastAmount,
        p3ForecastQty,
        p5ForecastAmount,
        p5ForecastQty,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    });
  }
  
  return data;
}

export function getMockForecastList() {
  // 数据版本号：当数据结构变化时更新，强制清除缓存重新生成
  const DATA_VERSION = 'v3-continuous-abnormal';
  const VERSION_KEY = `${SUPPLY_CHAIN_FORECAST}_version`;
  
  const storedVersion = get(VERSION_KEY);
  const stored = get(SUPPLY_CHAIN_FORECAST);
  
  // 如果版本匹配且数据存在，使用缓存
  if (storedVersion === DATA_VERSION && stored && Array.isArray(stored) && stored.length > 0) {
    return stored;
  }
  
  // 版本不匹配或数据不存在，重新生成
  console.log('[Mock] Regenerating forecast data, version:', DATA_VERSION);
  const mockData = generateMockData();
  try {
    set(VERSION_KEY, DATA_VERSION);
    set(SUPPLY_CHAIN_FORECAST, mockData);
  } catch (e) {
    // 忽略 localStorage quota 超限错误，直接返回 mock 数据
    if (e.name !== 'QuotaExceededError') {
      // eslint-disable-next-line no-console
      console.warn('Failed to cache forecast mock data:', e.message);
    }
  }
  return mockData;
}

// 获取按月份聚合的数据
export function getMockForecastByMonth(month, query = {}) {
  const { category, bu } = query;
  const allData = getMockForecastList();
  
  let filtered = allData.filter(item => item.month === month);
  
  if (category && category !== 'all') {
    filtered = filtered.filter(item => item.category === category);
  }
  
  if (bu && bu !== 'all') {
    filtered = filtered.filter(item => item.bu === bu);
  }
  
  return filtered;
}

// 获取趋势数据（最近N个月）
export function getMockTrendData(months = 6, query = {}) {
  const { category, bu } = query;
  const allData = getMockForecastList();
  
  // 获取最近months个月的月份列表（使用固定参考时间）
  const REFERENCE_NOW = new Date('2026-03-15');
  const now = REFERENCE_NOW;
  const monthList = [];
  for (let i = 0; i < months; i++) {
    const m = new Date(now.getFullYear(), now.getMonth() - i, 1);
    monthList.push(`${m.getFullYear()}-${String(m.getMonth() + 1).padStart(2, '0')}`);
  }
  
  // 按月聚合数据
  const trendData = monthList.map(month => {
    let monthData = allData.filter(item => item.month === month);
    
    if (category && category !== 'all') {
      monthData = monthData.filter(item => item.category === category);
    }
    if (bu && bu !== 'all') {
      monthData = monthData.filter(item => item.bu === bu);
    }
    
    return {
      month,
      forecastAmount: monthData.reduce((sum, item) => sum + item.forecastAmount, 0),
      forecastQty: monthData.reduce((sum, item) => sum + item.forecastQty, 0),
      actualAmount: monthData.reduce((sum, item) => sum + item.actualAmount, 0),
      actualQty: monthData.reduce((sum, item) => sum + item.actualQty, 0),
      p1Amount: monthData.reduce((sum, item) => sum + (item.p1ForecastAmount || 0), 0),
      p1Qty: monthData.reduce((sum, item) => sum + (item.p1ForecastQty || 0), 0),
      p3Amount: monthData.reduce((sum, item) => sum + (item.p3ForecastAmount || 0), 0),
      p3Qty: monthData.reduce((sum, item) => sum + (item.p3ForecastQty || 0), 0),
      p5Amount: monthData.reduce((sum, item) => sum + (item.p5ForecastAmount || 0), 0),
      p5Qty: monthData.reduce((sum, item) => sum + (item.p5ForecastQty || 0), 0),
    };
  }).reverse(); // 正序排列
  
  return trendData;
}

// 获取饼图数据（按类目分布）
export function getMockPieData(month, dataType = 'actual', query = {}) {
  const { bu } = query;
  const allData = getMockForecastList();
  
  let filtered = allData.filter(item => item.month === month);
  if (bu && bu !== 'all') {
    filtered = filtered.filter(item => item.bu === bu);
  }
  
  // 按类目聚合
  const categoryData = {};
  filtered.forEach(item => {
    if (!categoryData[item.category]) {
      categoryData[item.category] = { name: item.category, value: 0, count: 0 };
    }
    categoryData[item.category].value += dataType === 'actual' ? item.actualAmount : item.forecastAmount;
    categoryData[item.category].count += 1;
  });
  
  return Object.values(categoryData);
}

// 获取TOP10未达成
export function getMockTopUnderperformed(month, query = {}) {
  const { category, bu } = query;
  const allData = getMockForecastList();
  
  let filtered = allData.filter(item => item.month === month && item.actualAmount < item.forecastAmount);
  
  if (category && category !== 'all') {
    filtered = filtered.filter(item => item.category === category);
  }
  if (bu && bu !== 'all') {
    filtered = filtered.filter(item => item.bu === bu);
  }
  
  // 按偏差金额排序（取最大的10个）
  return filtered
    .map(item => ({
      ...item,
      deviationAmount: item.forecastAmount - item.actualAmount,
      deviationRate: ((item.actualAmount - item.forecastAmount) / item.forecastAmount * 100).toFixed(2),
    }))
    .sort((a, b) => b.deviationAmount - a.deviationAmount)
    .slice(0, 10);
}

// 获取未达成类目分析
export function getMockCategoryAnalysis(month, query = {}) {
  const { bu } = query;
  const allData = getMockForecastList();

  let filtered = allData.filter(item => item.month === month && item.actualAmount < item.forecastAmount);

  if (bu && bu !== 'all') {
    filtered = filtered.filter(item => item.bu === bu);
  }

  // 按类目聚合
  const categoryMap = {};
  filtered.forEach(item => {
    if (!categoryMap[item.category]) {
      categoryMap[item.category] = {
        category: item.category,
        skuCount: 0,
        totalDeviation: 0,
        totalDeviationQty: 0,
        totalForecast: 0,
        totalForecastQty: 0,
        totalActual: 0,
        totalActualQty: 0,
      };
    }
    categoryMap[item.category].skuCount += 1;
    categoryMap[item.category].totalDeviation += (item.forecastAmount - item.actualAmount);
    categoryMap[item.category].totalDeviationQty += (item.forecastQty - item.actualQty);
    categoryMap[item.category].totalForecast += item.forecastAmount;
    categoryMap[item.category].totalForecastQty += item.forecastQty;
    categoryMap[item.category].totalActual += item.actualAmount;
    categoryMap[item.category].totalActualQty += item.actualQty;
  });

  return Object.values(categoryMap)
    .map(item => ({
      ...item,
      deviationRate: ((item.totalActual - item.totalForecast) / (item.totalForecast || 1) * 100).toFixed(2),
      deviationRateQty: ((item.totalActualQty - item.totalForecastQty) / (item.totalForecastQty || 1) * 100).toFixed(2),
    }))
    .sort((a, b) => b.totalDeviation - a.totalDeviation);
}

// 重置数据
export function resetForecastData() {
  const newData = generateMockData();
  set(SUPPLY_CHAIN_FORECAST, newData);
  return newData;
}
