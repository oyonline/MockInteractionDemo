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

function generateMockData() {
  const data = [];
  const now = new Date();
  const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  // 生成最近24个月的数据
  for (let i = 0; i < 24; i++) {
    const month = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - i, 1);
    const monthStr = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`;
    
    // 每个BU每个类目生成2-5个SKU
    bus.forEach(bu => {
      categories.forEach(category => {
        const skuCount = 2 + Math.floor(Math.random() * 4);
        
        for (let j = 0; j < skuCount; j++) {
          const skuId = `SKU${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`;
          const baseAmount = 50000 + Math.random() * 200000;
          const baseQty = 100 + Math.floor(Math.random() * 500);
          
          // Forecast数据（预测数据）
          const forecastAmount = Math.round(baseAmount * (0.8 + Math.random() * 0.4));
          const forecastQty = Math.round(baseQty * (0.8 + Math.random() * 0.4));
          
          // 实际销售数据（与预测有一定偏差）
          const deviationRate = (Math.random() - 0.5) * 0.4; // -20% ~ +20%
          const actualAmount = Math.round(forecastAmount * (1 + deviationRate));
          const actualQty = Math.round(forecastQty * (1 + deviationRate));
          
          // P-1: 上月forecast (如果i>0则有数据)
          const p1ForecastAmount = i > 0 ? Math.round(baseAmount * (0.85 + Math.random() * 0.3)) : null;
          const p1ForecastQty = i > 0 ? Math.round(baseQty * (0.85 + Math.random() * 0.3)) : null;
          
          // P-3: 3月前forecast (如果i>2则有数据)
          const p3ForecastAmount = i > 2 ? Math.round(baseAmount * (0.9 + Math.random() * 0.2)) : null;
          const p3ForecastQty = i > 2 ? Math.round(baseQty * (0.9 + Math.random() * 0.2)) : null;

          // P-5: 5月前forecast (如果i>4则有数据)
          const p5ForecastAmount = i > 4 ? Math.round(baseAmount * (0.92 + Math.random() * 0.16)) : null;
          const p5ForecastQty = i > 4 ? Math.round(baseQty * (0.92 + Math.random() * 0.16)) : null;

          data.push({
            id: `${monthStr}-${bu}-${category}-${skuId}`,
            sku: skuId,
            skuName: `${category} Product ${j + 1}`,
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
        }
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
  set(SUPPLY_CHAIN_FORECAST, mockData);
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
