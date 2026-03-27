/** 供应链计划 Service - Forecast Tracking */

import {
  getMockForecastByMonth,
  getMockTrendData,
  getMockPieData,
  getMockTopUnderperformed,
  getMockCategoryAnalysis,
} from '../mock/supply-chain';

// 获取当前月份的上一个月（默认月份）
export function getDefaultMonth() {
  const now = new Date();
  const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  return `${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, '0')}`;
}

// 获取月份列表（用于下拉选择）
export function getMonthOptions() {
  const now = new Date();
  const options = [];
  for (let i = 1; i <= 12; i++) {
    const m = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${m.getFullYear()}-${String(m.getMonth() + 1).padStart(2, '0')}`;
    const label = `${m.getFullYear()}年${m.getMonth() + 1}月`;
    options.push({ value, label });
  }
  return options;
}

// 计算环比（与上月比）
function calculateMoM(current, previous, type = 'amount') {
  if (!previous || previous === 0) return { rate: 0, baseValue: 0 };
  const currentValue = type === 'amount' ? current.forecastAmount : current.forecastQty;
  const previousValue = type === 'amount' ? previous.actualAmount : previous.actualQty;
  const rate = ((currentValue - previousValue) / previousValue) * 100;
  return {
    rate: Number(rate.toFixed(2)),
    baseValue: previousValue,
    currentValue,
  };
}

// 计算同比（与去年同期比）
function calculateYoY(current, lastYearData, type = 'amount') {
  if (!lastYearData || lastYearData.length === 0) return { rate: 0, baseValue: 0 };
  
  const currentValue = type === 'amount' ? current.forecastAmount : current.forecastQty;
  const lastYearValue = type === 'amount' 
    ? lastYearData.reduce((sum, item) => sum + item.actualAmount, 0)
    : lastYearData.reduce((sum, item) => sum + item.actualQty, 0);
  
  if (lastYearValue === 0) return { rate: 0, baseValue: 0 };
  
  const rate = ((currentValue - lastYearValue) / lastYearValue) * 100;
  return {
    rate: Number(rate.toFixed(2)),
    baseValue: lastYearValue,
    currentValue,
  };
}

// 获取指标卡数据（含环比/同比计算）
export function getForecastMetrics(query) {
  const { month = getDefaultMonth(), category = 'all', bu = 'all', dataType = 'amount' } = query;
  
  // 当前月份数据
  const currentData = getMockForecastByMonth(month, { category, bu });
  
  // 计算本期总值
  const currentValue = dataType === 'amount' 
    ? currentData.reduce((sum, item) => sum + item.forecastAmount, 0)
    : currentData.reduce((sum, item) => sum + item.forecastQty, 0);
  
  // 上月数据（用于环比）
  const [year, mon] = month.split('-').map(Number);
  const prevMonthDate = new Date(year, mon - 2, 1); // month - 2 因为 JS month 是 0-based
  const prevMonthStr = `${prevMonthDate.getFullYear()}-${String(prevMonthDate.getMonth() + 1).padStart(2, '0')}`;
  const prevMonthData = getMockForecastByMonth(prevMonthStr, { category, bu });
  
  // 去年同期数据（用于同比）
  const lastYearDate = new Date(year - 1, mon - 1, 1);
  const lastYearStr = `${lastYearDate.getFullYear()}-${String(lastYearDate.getMonth() + 1).padStart(2, '0')}`;
  const lastYearData = getMockForecastByMonth(lastYearStr, { category, bu });
  
  // 环比
  const mom = calculateMoM(
    { forecastAmount: currentValue, forecastQty: currentValue },
    {
      actualAmount: prevMonthData.reduce((sum, item) => sum + item.actualAmount, 0),
      actualQty: prevMonthData.reduce((sum, item) => sum + item.actualQty, 0),
    },
    dataType
  );
  
  // 同比
  const yoy = calculateYoY(
    { forecastAmount: currentValue, forecastQty: currentValue },
    lastYearData,
    dataType
  );
  
  // P-1 数据（上月forecast vs 上月actual）
  const p1Data = prevMonthData;
  const p1Forecast = dataType === 'amount'
    ? p1Data.reduce((sum, item) => sum + (item.forecastAmount || 0), 0)
    : p1Data.reduce((sum, item) => sum + (item.forecastQty || 0), 0);
  const p1Actual = dataType === 'amount'
    ? p1Data.reduce((sum, item) => sum + item.actualAmount, 0)
    : p1Data.reduce((sum, item) => sum + item.actualQty, 0);
  const p1Deviation = p1Actual - p1Forecast;
  const p1DeviationRate = p1Forecast !== 0 ? (p1Deviation / p1Forecast * 100).toFixed(2) : 0;
  
  // P-3 数据（3月前forecast vs 3月前actual）
  const p3MonthDate = new Date(year, mon - 4, 1);
  const p3MonthStr = `${p3MonthDate.getFullYear()}-${String(p3MonthDate.getMonth() + 1).padStart(2, '0')}`;
  const p3Data = getMockForecastByMonth(p3MonthStr, { category, bu });
  const p3Forecast = dataType === 'amount'
    ? p3Data.reduce((sum, item) => sum + (item.forecastAmount || 0), 0)
    : p3Data.reduce((sum, item) => sum + (item.forecastQty || 0), 0);
  const p3Actual = dataType === 'amount'
    ? p3Data.reduce((sum, item) => sum + item.actualAmount, 0)
    : p3Data.reduce((sum, item) => sum + item.actualQty, 0);
  const p3Deviation = p3Actual - p3Forecast;
  const p3DeviationRate = p3Forecast !== 0 ? (p3Deviation / p3Forecast * 100).toFixed(2) : 0;

  // P-5 数据（5月前forecast vs 5月前actual）
  const p5MonthDate = new Date(year, mon - 6, 1);
  const p5MonthStr = `${p5MonthDate.getFullYear()}-${String(p5MonthDate.getMonth() + 1).padStart(2, '0')}`;
  const p5Data = getMockForecastByMonth(p5MonthStr, { category, bu });
  const p5Forecast = dataType === 'amount'
    ? p5Data.reduce((sum, item) => sum + (item.p5ForecastAmount || item.forecastAmount || 0), 0)
    : p5Data.reduce((sum, item) => sum + (item.p5ForecastQty || item.forecastQty || 0), 0);
  const p5Actual = dataType === 'amount'
    ? p5Data.reduce((sum, item) => sum + item.actualAmount, 0)
    : p5Data.reduce((sum, item) => sum + item.actualQty, 0);
  const p5Deviation = p5Actual - p5Forecast;
  const p5DeviationRate = p5Forecast !== 0 ? (p5Deviation / p5Forecast * 100).toFixed(2) : 0;

  return {
    current: {
      value: currentValue,
      label: '本期',
      month,
    },
    mom: {
      rate: mom.rate,
      baseValue: mom.baseValue,
      currentValue: mom.currentValue,
      label: '环比',
      baseMonth: prevMonthStr,
    },
    yoy: {
      rate: yoy.rate,
      baseValue: yoy.baseValue,
      currentValue: yoy.currentValue,
      label: '同比',
      baseMonth: lastYearStr,
    },
    p1: {
      forecast: p1Forecast,
      actual: p1Actual,
      deviation: p1Deviation,
      deviationRate: Number(p1DeviationRate),
      label: 'P-1',
      month: prevMonthStr,
    },
    p3: {
      forecast: p3Forecast,
      actual: p3Actual,
      deviation: p3Deviation,
      deviationRate: Number(p3DeviationRate),
      label: 'P-3',
      month: p3MonthStr,
    },
    p5: {
      forecast: p5Forecast,
      actual: p5Actual,
      deviation: p5Deviation,
      deviationRate: Number(p5DeviationRate),
      label: 'P-5',
      month: p5MonthStr,
    },
  };
}

// 获取偏差趋势图数据（按P-1/P-3筛选）
export function getDeviationTrend(query) {
  const { period = 'p1', months = 6, category = 'all', bu = 'all', dataType = 'amount' } = query;
  
  const trendData = getMockTrendData(months, { category, bu });
  
  return trendData.map(item => {
    const month = item.month;
    const [year, mon] = month.split('-').map(Number);
    
    if (period === 'p1') {
      // P-1: 上月forecast vs 上月actual
      const prevMonthDate = new Date(year, mon - 2, 1);
      const prevMonthStr = `${prevMonthDate.getFullYear()}-${String(prevMonthDate.getMonth() + 1).padStart(2, '0')}`;
      const prevData = trendData.find(d => d.month === prevMonthStr);
      
      const forecast = dataType === 'amount' ? (prevData?.p1Amount || 0) : (prevData?.p1Qty || 0);
      const actual = dataType === 'amount' ? item.actualAmount : item.actualQty;
      
      return {
        month: prevMonthStr,
        forecast,
        actual,
        deviation: actual - forecast,
        deviationRate: forecast !== 0 ? ((actual - forecast) / forecast * 100).toFixed(2) : 0,
      };
    } else {
      // P-3: 3月前forecast vs 3月前actual
      const p3MonthDate = new Date(year, mon - 4, 1);
      const p3MonthStr = `${p3MonthDate.getFullYear()}-${String(p3MonthDate.getMonth() + 1).padStart(2, '0')}`;
      const p3Data = trendData.find(d => d.month === p3MonthStr);
      
      const forecast = dataType === 'amount' ? (p3Data?.p3Amount || 0) : (p3Data?.p3Qty || 0);
      const actual = dataType === 'amount' ? item.actualAmount : item.actualQty;
      
      return {
        month: p3MonthStr,
        forecast,
        actual,
        deviation: actual - forecast,
        deviationRate: forecast !== 0 ? ((actual - forecast) / forecast * 100).toFixed(2) : 0,
      };
    }
  }).filter(item => item.forecast > 0);
}

// 获取增长趋势图数据（按时间范围筛选）
export function getGrowthTrend(query) {
  const { range = 3, category = 'all', bu = 'all', dataType = 'amount' } = query;
  // range: 3=近三月, 6=近六月, 11=近十一月
  
  const trendData = getMockTrendData(range, { category, bu });
  
  return trendData.map((item, index, arr) => {
    if (index === 0) {
      return { month: item.month, growthRate: 0, value: 0 };
    }
    
    const prev = arr[index - 1];
    const currentValue = dataType === 'amount' ? item.forecastAmount : item.forecastQty;
    const prevValue = dataType === 'amount' ? prev.forecastAmount : prev.forecastQty;
    
    const growthRate = prevValue !== 0 ? ((currentValue - prevValue) / prevValue * 100).toFixed(2) : 0;
    
    return {
      month: item.month,
      growthRate: Number(growthRate),
      value: currentValue,
    };
  });
}

// 获取饼图数据
export function getPieChartData(query) {
  const { month = getDefaultMonth(), dataType = 'actual', category = 'all', bu = 'all' } = query;
  
  return getMockPieData(month, dataType, { category, bu });
}

// 获取TOP10未达成
export function getTopUnderperformed(query) {
  const { month = getDefaultMonth(), category = 'all', bu = 'all' } = query;
  
  return getMockTopUnderperformed(month, { category, bu });
}

// 获取未达成类目分析
export function getCategoryAnalysis(query) {
  const { month = getDefaultMonth(), bu = 'all' } = query;
  
  return getMockCategoryAnalysis(month, { bu });
}

// 获取整体趋势图数据（forecast + actual对比）
export function getOverallTrend(query) {
  const { months = 12, category = 'all', bu = 'all', dataType = 'amount' } = query;
  
  const trendData = getMockTrendData(months, { category, bu });
  
  return trendData.map(item => ({
    month: item.month,
    forecast: dataType === 'amount' ? item.forecastAmount : item.forecastQty,
    actual: dataType === 'amount' ? item.actualAmount : item.actualQty,
    lastYear: null, // 可扩展添加去年同期数据
  }));
}

// 获取年度对比数据（当前年vs去年的1-12月）
export function getYearlyComparisonData(query) {
  const { year, category = 'all', bu = 'all', dataType = 'amount' } = query;
  const targetYear = year || new Date().getFullYear();
  const lastYear = targetYear - 1;

  const allData = require('../mock/supply-chain').getMockForecastList();

  // 生成1-12月的数据
  const months = Array.from({ length: 12 }, (_, i) => {
    const monthNum = String(i + 1).padStart(2, '0');
    return {
      current: `${targetYear}-${monthNum}`,
      last: `${lastYear}-${monthNum}`,
      monthLabel: `${monthNum}月`,
    };
  });

  return months.map(({ current, last, monthLabel }) => {
    // 当前年份数据
    let currentData = allData.filter(item => item.month === current);
    // 去年数据
    let lastData = allData.filter(item => item.month === last);

    if (category && category !== 'all') {
      currentData = currentData.filter(item => item.category === category);
      lastData = lastData.filter(item => item.category === category);
    }
    if (bu && bu !== 'all') {
      currentData = currentData.filter(item => item.bu === bu);
      lastData = lastData.filter(item => item.bu === bu);
    }

    const currentValue = dataType === 'amount'
      ? currentData.reduce((sum, item) => sum + item.actualAmount, 0)
      : currentData.reduce((sum, item) => sum + item.actualQty, 0);

    const lastValue = dataType === 'amount'
      ? lastData.reduce((sum, item) => sum + item.actualAmount, 0)
      : lastData.reduce((sum, item) => sum + item.actualQty, 0);

    return {
      month: monthLabel,
      currentYear: currentValue,
      lastYear: lastValue,
    };
  });
}

// 获取跨期对比数据（本期forecast vs 上期forecast相同月份）
export function getCrossPeriodComparisonData(query) {
  const { currentPeriod, comparePeriod, range, category = 'all', bu = 'all', dataType = 'amount' } = query;
  // currentPeriod: 'current' | 'p1' | 'p3' | 'p5' - 本期使用的forecast版本
  // comparePeriod: 'current' | 'p1' | 'p3' | 'p5' - 对比的forecast版本
  // range: 3 | 6 | 11 - 近三月/六月/十一月

  const months = range || 3;
  const allData = require('../mock/supply-chain').getMockForecastList();

  // 获取最近N个月的月份列表
  const now = new Date();
  const monthList = [];
  for (let i = 0; i < months; i++) {
    const m = new Date(now.getFullYear(), now.getMonth() - i, 1);
    monthList.push(`${m.getFullYear()}-${String(m.getMonth() + 1).padStart(2, '0')}`);
  }
  monthList.reverse(); // 正序排列

  return monthList.map(month => {
    let monthData = allData.filter(item => item.month === month);

    if (category && category !== 'all') {
      monthData = monthData.filter(item => item.category === category);
    }
    if (bu && bu !== 'all') {
      monthData = monthData.filter(item => item.bu === bu);
    }

    // 获取指定版本的forecast值
    const getForecastValue = (period) => {
      switch (period) {
        case 'p1':
          return dataType === 'amount'
            ? monthData.reduce((sum, item) => sum + (item.p1ForecastAmount || 0), 0)
            : monthData.reduce((sum, item) => sum + (item.p1ForecastQty || 0), 0);
        case 'p3':
          return dataType === 'amount'
            ? monthData.reduce((sum, item) => sum + (item.p3ForecastAmount || 0), 0)
            : monthData.reduce((sum, item) => sum + (item.p3ForecastQty || 0), 0);
        case 'p5':
          return dataType === 'amount'
            ? monthData.reduce((sum, item) => sum + (item.p5ForecastAmount || 0), 0)
            : monthData.reduce((sum, item) => sum + (item.p5ForecastQty || 0), 0);
        case 'current':
        default:
          return dataType === 'amount'
            ? monthData.reduce((sum, item) => sum + item.forecastAmount, 0)
            : monthData.reduce((sum, item) => sum + item.forecastQty, 0);
      }
    };

    const [year, mon] = month.split('-');

    return {
      month: `${mon}月`,
      current: getForecastValue(currentPeriod || 'current'),
      previous: getForecastValue(comparePeriod || 'p1'),
    };
  });
}

// 重置数据
export function resetForecast() {
  const { resetForecastData } = require('../mock/supply-chain');
  return resetForecastData();
}
