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
  const now = new Date();
  const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  // 先生成基础数据模板（用于跨月引用）
  const baseDataTemplate = {};
  
  // 生成最近24个月的数据
  for (let i = 0; i < 24; i++) {
    const month = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - i, 1);
    const monthStr = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`;
    baseDataTemplate[monthStr] = {};
    
    // 每个BU每个类目生成2-5个SKU
    bus.forEach(bu => {
      categories.forEach(category => {
        const skuCount = 2 + Math.floor(Math.random() * 4);
        
        for (let j = 0; j < skuCount; j++) {
          const skuId = `SKU${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`;
          // 基础金额和数量（用于保持一致性）
          const baseAmount = 50000 + Math.random() * 200000;
          const baseQty = 100 + Math.floor(Math.random() * 500);
          
          // 为每个SKU创建一个稳定的随机种子，确保跨月预测一致性
          const skuSeed = `${bu}-${category}-${skuId}`;
          
          if (!baseDataTemplate[monthStr][skuSeed]) {
            baseDataTemplate[monthStr][skuSeed] = {};
          }
          
          baseDataTemplate[monthStr][skuSeed] = {
            skuId,
            skuName: `${category} Product ${j + 1}`,
            category,
            bu,
            baseAmount,
            baseQty,
          };
        }
      });
    });
  }
  
  // 第二次遍历：为每个月生成实际数据和历史预测数据
  for (let i = 0; i < 24; i++) {
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
      
      // 实际销售数据（与最新预测有一定偏差）
      const deviationRate = (Math.random() - 0.5) * 0.4; // -20% ~ +20%
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
  const stored = get(SUPPLY_CHAIN_FORECAST);
  if (stored && Array.isArray(stored) && stored.length > 0) {
    return stored;
  }
  
  const mockData = generateMockData();
  try {
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
  
  // 获取最近months个月的月份列表
  const now = new Date();
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
        totalForecast: 0,
        totalActual: 0,
      };
    }
    categoryMap[item.category].skuCount += 1;
    categoryMap[item.category].totalDeviation += (item.forecastAmount - item.actualAmount);
    categoryMap[item.category].totalForecast += item.forecastAmount;
    categoryMap[item.category].totalActual += item.actualAmount;
  });
  
  return Object.values(categoryMap)
    .map(item => ({
      ...item,
      deviationRate: ((item.totalActual - item.totalForecast) / item.totalForecast * 100).toFixed(2),
    }))
    .sort((a, b) => b.totalDeviation - a.totalDeviation);
}

// 重置数据
export function resetForecastData() {
  const newData = generateMockData();
  set(SUPPLY_CHAIN_FORECAST, newData);
  return newData;
}
