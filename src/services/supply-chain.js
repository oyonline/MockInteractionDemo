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
/**
 * 优化后的口径定义：
 * - 总体偏差率 = |(本期预测值 - 本期实销值) / 本期实销值| * 100%
 * - 总体偏差金额/数量 = |本期预测值 - 本期实销值|
 * - "本期实销值"固定取当前筛选月份的 actual
 * - "本期预测值"按 P-1/P-3/P-5 取"历史对应版本对当前筛选月份的预测"
 */
export function getForecastMetrics(query) {
  const { month = getDefaultMonth(), category = 'all', bu = 'all', dataType = 'amount' } = query;

  const [year, mon] = month.split('-').map(Number);

  // 当前筛选月份的数据（用于获取actual）
  const currentData = getMockForecastByMonth(month, { category, bu });

  // 本期实销值（固定取当前筛选月份的actual）
  const currentActual = dataType === 'amount'
    ? currentData.reduce((sum, item) => sum + item.actualAmount, 0)
    : currentData.reduce((sum, item) => sum + item.actualQty, 0);

  // 计算本期Forecast（最新版本对当前月的预测）
  const currentForecast = dataType === 'amount'
    ? currentData.reduce((sum, item) => sum + item.forecastAmount, 0)
    : currentData.reduce((sum, item) => sum + item.forecastQty, 0);

  // 上月数据（用于环比计算）
  const prevMonthDate = new Date(year, mon - 2, 1);
  const prevMonthStr = `${prevMonthDate.getFullYear()}-${String(prevMonthDate.getMonth() + 1).padStart(2, '0')}`;
  const prevMonthData = getMockForecastByMonth(prevMonthStr, { category, bu });

  // 去年同期数据（用于同比）
  const lastYearDate = new Date(year - 1, mon - 1, 1);
  const lastYearStr = `${lastYearDate.getFullYear()}-${String(lastYearDate.getMonth() + 1).padStart(2, '0')}`;
  const lastYearData = getMockForecastByMonth(lastYearStr, { category, bu });

  // 环比（本期forecast vs 上月actual）
  const mom = calculateMoM(
    { forecastAmount: currentForecast, forecastQty: currentForecast },
    {
      actualAmount: prevMonthData.reduce((sum, item) => sum + item.actualAmount, 0),
      actualQty: prevMonthData.reduce((sum, item) => sum + item.actualQty, 0),
    },
    dataType
  );

  // 同比
  const yoy = calculateYoY(
    { forecastAmount: currentForecast, forecastQty: currentForecast },
    lastYearData,
    dataType
  );

  /**
   * P-1 数据：上月版本中对此月份(month)的预测 vs 此月份实际
   * 即：取当前筛选月份数据中的 p1ForecastAmount（这是P-1月对当前月的预测）
   */
  const p1Forecast = dataType === 'amount'
    ? currentData.reduce((sum, item) => sum + (item.p1ForecastAmount || 0), 0)
    : currentData.reduce((sum, item) => sum + (item.p1ForecastQty || 0), 0);
  const p1Deviation = currentActual - p1Forecast;
  const p1DeviationRate = currentActual !== 0 ? Math.abs(p1Deviation / currentActual * 100).toFixed(2) : 0;

  /**
   * P-3 数据：3月前版本中对此月份(month)的预测 vs 此月份实际
   */
  const p3Forecast = dataType === 'amount'
    ? currentData.reduce((sum, item) => sum + (item.p3ForecastAmount || 0), 0)
    : currentData.reduce((sum, item) => sum + (item.p3ForecastQty || 0), 0);
  const p3Deviation = currentActual - p3Forecast;
  const p3DeviationRate = currentActual !== 0 ? Math.abs(p3Deviation / currentActual * 100).toFixed(2) : 0;

  /**
   * P-5 数据：5月前版本中对此月份(month)的预测 vs 此月份实际
   */
  const p5Forecast = dataType === 'amount'
    ? currentData.reduce((sum, item) => sum + (item.p5ForecastAmount || 0), 0)
    : currentData.reduce((sum, item) => sum + (item.p5ForecastQty || 0), 0);
  const p5Deviation = currentActual - p5Forecast;
  const p5DeviationRate = currentActual !== 0 ? Math.abs(p5Deviation / currentActual * 100).toFixed(2) : 0;

  // 未来窗口数据：当前筛选月之后N个月的forecast汇总
  const future3Window = getFutureWindowData(month, 3, { category, bu, dataType });
  const future6Window = getFutureWindowData(month, 6, { category, bu, dataType });
  const future11Window = getFutureWindowData(month, 11, { category, bu, dataType });

  // 上一期forecast版本对同一窗口的预测（用于环比）
  const prevMonthFuture3 = getFutureWindowData(prevMonthStr, 3, { category, bu, dataType });
  const prevMonthFuture6 = getFutureWindowData(prevMonthStr, 6, { category, bu, dataType });
  const prevMonthFuture11 = getFutureWindowData(prevMonthStr, 11, { category, bu, dataType });

  return {
    current: {
      value: currentForecast,
      actual: currentActual,
      label: '本期Forecast',
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
      actual: currentActual,
      deviation: p1Deviation,
      deviationRate: Number(p1DeviationRate),
      label: 'P-1',
      month: prevMonthStr,
    },
    p3: {
      forecast: p3Forecast,
      actual: currentActual,
      deviation: p3Deviation,
      deviationRate: Number(p3DeviationRate),
      label: 'P-3',
      month: `${year}-${String(mon - 3).padStart(2, '0')}`,
    },
    p5: {
      forecast: p5Forecast,
      actual: currentActual,
      deviation: p5Deviation,
      deviationRate: Number(p5DeviationRate),
      label: 'P-5',
      month: `${year}-${String(mon - 5).padStart(2, '0')}`,
    },
    // 未来窗口数据
    future3: {
      forecast: future3Window.forecast,
      label: '未来三月',
      months: future3Window.months,
    },
    future6: {
      forecast: future6Window.forecast,
      label: '未来六月',
      months: future6Window.months,
    },
    future11: {
      forecast: future11Window.forecast,
      label: '未来十一月',
      months: future11Window.months,
    },
    // 环比对比（本期版本 vs 上期版本对未来窗口的预测）
    future3MoM: {
      rate: prevMonthFuture3.forecast !== 0
        ? Number(((future3Window.forecast - prevMonthFuture3.forecast) / prevMonthFuture3.forecast * 100).toFixed(2))
        : 0,
      baseValue: prevMonthFuture3.forecast,
      currentValue: future3Window.forecast,
    },
    future6MoM: {
      rate: prevMonthFuture6.forecast !== 0
        ? Number(((future6Window.forecast - prevMonthFuture6.forecast) / prevMonthFuture6.forecast * 100).toFixed(2))
        : 0,
      baseValue: prevMonthFuture6.forecast,
      currentValue: future6Window.forecast,
    },
    future11MoM: {
      rate: prevMonthFuture11.forecast !== 0
        ? Number(((future11Window.forecast - prevMonthFuture11.forecast) / prevMonthFuture11.forecast * 100).toFixed(2))
        : 0,
      baseValue: prevMonthFuture11.forecast,
      currentValue: future11Window.forecast,
    },
  };
}

/**
 * 获取未来N个月窗口的forecast汇总
 */
function getFutureWindowData(baseMonth, windowMonths, query) {
  const { category, bu, dataType } = query;
  const allData = require('../mock/supply-chain').getMockForecastList();

  const [year, mon] = baseMonth.split('-').map(Number);
  const months = [];

  // 获取baseMonth之后的N个月
  for (let i = 1; i <= windowMonths; i++) {
    const targetMonth = new Date(year, mon - 1 + i, 1);
    months.push(`${targetMonth.getFullYear()}-${String(targetMonth.getMonth() + 1).padStart(2, '0')}`);
  }

  let totalForecast = 0;

  months.forEach(month => {
    let monthData = allData.filter(item => item.month === month);

    if (category && category !== 'all') {
      monthData = monthData.filter(item => item.category === category);
    }
    if (bu && bu !== 'all') {
      monthData = monthData.filter(item => item.bu === bu);
    }

    const monthForecast = dataType === 'amount'
      ? monthData.reduce((sum, item) => sum + item.forecastAmount, 0)
      : monthData.reduce((sum, item) => sum + item.forecastQty, 0);

    totalForecast += monthForecast;
  });

  return {
    forecast: totalForecast,
    months,
  };
}

// 获取偏差趋势图数据（按P-1/P-3/P-5筛选，展示近12期偏差率/偏差值趋势）
/**
 * 新口径：展示近12个月的偏差趋势
 * - 每个月显示：该月actual vs 对应P-X版本对该月的预测
 * - period: 'p1' | 'p3' | 'p5'
 * - 返回近12期的偏差率和偏差值
 */
export function getDeviationTrend(query) {
  const { period = 'p1', months = 12, category = 'all', bu = 'all', dataType = 'amount', targetMonth } = query;

  const allData = require('../mock/supply-chain').getMockForecastList();

  // 确定月份列表（从目标月份回溯12期，或默认最近12个月）
  let endDate;
  if (targetMonth) {
    const [year, mon] = targetMonth.split('-').map(Number);
    endDate = new Date(year, mon - 1, 1);
  } else {
    endDate = new Date();
  }

  const monthList = [];
  for (let i = months - 1; i >= 0; i--) {
    const m = new Date(endDate.getFullYear(), endDate.getMonth() - i, 1);
    monthList.push(`${m.getFullYear()}-${String(m.getMonth() + 1).padStart(2, '0')}`);
  }

  return monthList.map(month => {
    let monthData = allData.filter(item => item.month === month);

    if (category && category !== 'all') {
      monthData = monthData.filter(item => item.category === category);
    }
    if (bu && bu !== 'all') {
      monthData = monthData.filter(item => item.bu === bu);
    }

    // 获取actual值
    const actual = dataType === 'amount'
      ? monthData.reduce((sum, item) => sum + item.actualAmount, 0)
      : monthData.reduce((sum, item) => sum + item.actualQty, 0);

    // 根据period获取对应版本的forecast（对应当前月份的预测）
    let forecast = 0;
    switch (period) {
      case 'p1':
        forecast = dataType === 'amount'
          ? monthData.reduce((sum, item) => sum + (item.p1ForecastAmount || item.forecastAmount), 0)
          : monthData.reduce((sum, item) => sum + (item.p1ForecastQty || item.forecastQty), 0);
        break;
      case 'p3':
        forecast = dataType === 'amount'
          ? monthData.reduce((sum, item) => sum + (item.p3ForecastAmount || item.forecastAmount), 0)
          : monthData.reduce((sum, item) => sum + (item.p3ForecastQty || item.forecastQty), 0);
        break;
      case 'p5':
        forecast = dataType === 'amount'
          ? monthData.reduce((sum, item) => sum + (item.p5ForecastAmount || item.forecastAmount), 0)
          : monthData.reduce((sum, item) => sum + (item.p5ForecastQty || item.forecastQty), 0);
        break;
      default:
        forecast = dataType === 'amount'
          ? monthData.reduce((sum, item) => sum + item.forecastAmount, 0)
          : monthData.reduce((sum, item) => sum + item.forecastQty, 0);
    }

    const deviation = actual - forecast;
    const deviationRate = actual !== 0 ? Number((Math.abs(deviation) / actual * 100).toFixed(2)) : 0;

    return {
      month,
      forecast,
      actual,
      deviation,
      deviationRate,
    };
  }).filter(item => item.actual > 0);
}

// 获取增长趋势图数据（已废弃，使用getFutureWindowTrend替代）
export function getGrowthTrend(query) {
  const { range = 3, category = 'all', bu = 'all', dataType = 'amount' } = query;
  // 此方法保留以保持兼容性，实际使用getFutureWindowTrend
  return getFutureWindowTrend({ ...query, window: range });
}

/**
 * 获取未来窗口趋势图数据
 * 展示未来N个月的forecast汇总趋势
 * - window: 3 | 6 （未来三月/六月）
 * - 返回近12期的未来窗口forecast汇总值
 */
export function getFutureWindowTrend(query) {
  const { window = 3, months = 12, category = 'all', bu = 'all', dataType = 'amount', targetMonth } = query;

  const allData = require('../mock/supply-chain').getMockForecastList();

  // 确定月份列表
  let endDate;
  if (targetMonth) {
    const [year, mon] = targetMonth.split('-').map(Number);
    endDate = new Date(year, mon - 1, 1);
  } else {
    endDate = new Date();
  }

  const monthList = [];
  for (let i = months - 1; i >= 0; i--) {
    const m = new Date(endDate.getFullYear(), endDate.getMonth() - i, 1);
    monthList.push(`${m.getFullYear()}-${String(m.getMonth() + 1).padStart(2, '0')}`);
  }

  return monthList.map(month => {
    const [year, mon] = month.split('-').map(Number);

    // 计算未来N个月窗口
    const windowMonths = [];
    for (let i = 1; i <= window; i++) {
      const targetMonth = new Date(year, mon - 1 + i, 1);
      windowMonths.push(`${targetMonth.getFullYear()}-${String(targetMonth.getMonth() + 1).padStart(2, '0')}`);
    }

    // 计算当前版本对未来窗口的预测汇总
    let currentForecast = 0;
    windowMonths.forEach(targetMonth => {
      let targetData = allData.filter(item => item.month === targetMonth);
      if (category && category !== 'all') {
        targetData = targetData.filter(item => item.category === category);
      }
      if (bu && bu !== 'all') {
        targetData = targetData.filter(item => item.bu === bu);
      }

      currentForecast += dataType === 'amount'
        ? targetData.reduce((sum, item) => sum + item.forecastAmount, 0)
        : targetData.reduce((sum, item) => sum + item.forecastQty, 0);
    });

    // 计算上一期版本（上月）对同一窗口的预测汇总
    const prevMonth = new Date(year, mon - 2, 1);
    const prevMonthStr = `${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, '0')}`;

    let previousForecast = 0;
    windowMonths.forEach(targetMonth => {
      let targetData = allData.filter(item => item.month === targetMonth);
      if (category && category !== 'all') {
        targetData = targetData.filter(item => item.category === category);
      }
      if (bu && bu !== 'all') {
        targetData = targetData.filter(item => item.bu === bu);
      }

      // 上一期版本的预测用p1Forecast替代（即上月版本对后续月份的预测）
      previousForecast += dataType === 'amount'
        ? targetData.reduce((sum, item) => sum + (item.p1ForecastAmount || item.forecastAmount), 0)
        : targetData.reduce((sum, item) => sum + (item.p1ForecastQty || item.forecastQty), 0);
    });

    // 计算环比
    const momRate = previousForecast !== 0
      ? Number(((currentForecast - previousForecast) / previousForecast * 100).toFixed(2))
      : 0;

    return {
      month,
      current: currentForecast,
      previous: previousForecast,
      momRate,
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
