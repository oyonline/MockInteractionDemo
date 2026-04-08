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

function shiftMonthStr(monthStr, deltaMonths) {
  const [year, mon] = monthStr.split('-').map(Number);
  const d = new Date(year, mon - 1 + deltaMonths, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function stableSeedFromString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

function getForecastWithVersionFallback(item, period, dataType) {
  const base = dataType === 'amount' ? (item.forecastAmount || 0) : (item.forecastQty || 0);
  const p1 = dataType === 'amount' ? item.p1ForecastAmount : item.p1ForecastQty;
  const p3 = dataType === 'amount' ? item.p3ForecastAmount : item.p3ForecastQty;
  const p5 = dataType === 'amount' ? item.p5ForecastAmount : item.p5ForecastQty;

  const raw = period === 'p1' ? p1 : period === 'p3' ? p3 : period === 'p5' ? p5 : undefined;
  if (raw !== null && raw !== undefined && raw !== 0) return raw;

  // 字段缺失时：做"版本差异化"回退，确保 P1/P3/P5 有明显差异且稳定
  const seedStr = `${item.bu || ''}-${item.category || ''}-${item.sku || item.skuId || item.id || ''}-${item.month || ''}`;
  const seed = stableSeedFromString(seedStr);
  const jitter = ((seed % 1000) / 1000 - 0.5) * 0.04; // [-2%, +2%]
  const periodBaseFactor = period === 'p1' ? 0.98 : period === 'p3' ? 1.03 : period === 'p5' ? 1.07 : 1.0;
  const factor = Math.max(0.85, Math.min(1.2, periodBaseFactor + jitter));
  return base * factor;
}

// 统一的偏差计算口径，保证卡片与趋势图一致
function getDeviationMetricsByMonth(monthStr, period, { category, bu, dataType }) {
  const monthData = getMockForecastByMonth(monthStr, { category, bu });

  const actual = dataType === 'amount'
    ? monthData.reduce((sum, item) => sum + item.actualAmount, 0)
    : monthData.reduce((sum, item) => sum + item.actualQty, 0);

  // 版本月映射规则：
  // p1 => V=T-1，对应目标月记录内的 p1Forecast
  // p3 => V=T-3，对应目标月记录内的 p3Forecast
  // p5 => V=T-5，对应目标月记录内的 p5Forecast
  // 若字段缺失，回退到目标月当月 forecast，保证图表可计算。
  const forecast = dataType === 'amount'
    ? monthData.reduce((sum, item) => {
        switch (period) {
          case 'p1': return sum + getForecastWithVersionFallback(item, 'p1', 'amount');
          case 'p3': return sum + getForecastWithVersionFallback(item, 'p3', 'amount');
          case 'p5': return sum + getForecastWithVersionFallback(item, 'p5', 'amount');
          default: return sum + (item.forecastAmount || 0);
        }
      }, 0)
    : monthData.reduce((sum, item) => {
        switch (period) {
          case 'p1': return sum + getForecastWithVersionFallback(item, 'p1', 'quantity');
          case 'p3': return sum + getForecastWithVersionFallback(item, 'p3', 'quantity');
          case 'p5': return sum + getForecastWithVersionFallback(item, 'p5', 'quantity');
          default: return sum + (item.forecastQty || 0);
        }
      }, 0);

  const deviation = actual - forecast;
  const deviationRateSigned = actual !== 0 ? Number((((forecast - actual) / actual) * 100).toFixed(2)) : 0;
  const deviationRateAbs = Math.abs(deviationRateSigned);

  return {
    month: monthStr,
    forecast,
    actual,
    deviation,
    deviationRateSigned,
    deviationRateAbs,
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

  // B口径：过去区指标卡以"上一完整月"作为目标月，P-1/P-3/P-5 仅切换预测版本字段
  const basePastMonth = prevMonthStr;
  const p1Month = basePastMonth;
  const p3Month = basePastMonth;
  const p5Month = basePastMonth;

  const p1Metrics = getDeviationMetricsByMonth(basePastMonth, 'p1', { category, bu, dataType });
  const p3Metrics = getDeviationMetricsByMonth(basePastMonth, 'p3', { category, bu, dataType });
  const p5Metrics = getDeviationMetricsByMonth(basePastMonth, 'p5', { category, bu, dataType });

  const p1Forecast = p1Metrics.forecast;
  const p1Deviation = p1Metrics.deviation;
  const p1DeviationRate = p1Metrics.deviationRateAbs.toFixed(2);
  const p1DeviationRateAbs = p1Metrics.deviationRateAbs.toFixed(2);

  const p3Forecast = p3Metrics.forecast;
  const p3Deviation = p3Metrics.deviation;
  const p3DeviationRate = p3Metrics.deviationRateAbs.toFixed(2);
  const p3DeviationRateAbs = p3Metrics.deviationRateAbs.toFixed(2);

  const p5Forecast = p5Metrics.forecast;
  const p5Deviation = p5Metrics.deviation;
  const p5DeviationRate = p5Metrics.deviationRateAbs.toFixed(2);
  const p5DeviationRateAbs = p5Metrics.deviationRateAbs.toFixed(2);

  // P-3 / P-5 对应版本月份（用于浮窗说明，避免字符串拼接跨年错误）
  const p3VersionDate = new Date(year, mon - 1 - 3, 1);
  const p3VersionMonth = `${p3VersionDate.getFullYear()}-${String(p3VersionDate.getMonth() + 1).padStart(2, '0')}`;
  const p5VersionDate = new Date(year, mon - 1 - 5, 1);
  const p5VersionMonth = `${p5VersionDate.getFullYear()}-${String(p5VersionDate.getMonth() + 1).padStart(2, '0')}`;

  // 计算过去区浮窗的环比/同比（基于"偏差值卡/偏差率卡"的主口径）
  const calcDeviationForMonthAndPeriod = (targetMonth, period) => {
    const m = getDeviationMetricsByMonth(targetMonth, period, { category, bu, dataType });
    return {
      actual: m.actual,
      forecast: m.forecast,
      deviationAbs: Math.abs(m.deviation),
      deviationRate: Number(m.deviationRateAbs.toFixed(2)),
    };
  };

  const calcMomOrYoYRate = (currentValue, baseValue) => {
    if (baseValue === 0) return 0;
    return Number(((currentValue - baseValue) / baseValue * 100).toFixed(2));
  };

  const p1Cur = calcDeviationForMonthAndPeriod(month, 'p1');
  const p3Cur = calcDeviationForMonthAndPeriod(month, 'p3');
  const p5Cur = calcDeviationForMonthAndPeriod(month, 'p5');

  const p1Prev = calcDeviationForMonthAndPeriod(prevMonthStr, 'p1');
  const p3Prev = calcDeviationForMonthAndPeriod(prevMonthStr, 'p3');
  const p5Prev = calcDeviationForMonthAndPeriod(prevMonthStr, 'p5');

  const p1Last = calcDeviationForMonthAndPeriod(lastYearStr, 'p1');
  const p3Last = calcDeviationForMonthAndPeriod(lastYearStr, 'p3');
  const p5Last = calcDeviationForMonthAndPeriod(lastYearStr, 'p5');

  const p1MomValueRate = calcMomOrYoYRate(p1Cur.deviationAbs, p1Prev.deviationAbs);
  const p3MomValueRate = calcMomOrYoYRate(p3Cur.deviationAbs, p3Prev.deviationAbs);
  const p5MomValueRate = calcMomOrYoYRate(p5Cur.deviationAbs, p5Prev.deviationAbs);

  const p1MomRateRate = calcMomOrYoYRate(p1Cur.deviationRate, p1Prev.deviationRate);
  const p3MomRateRate = calcMomOrYoYRate(p3Cur.deviationRate, p3Prev.deviationRate);
  const p5MomRateRate = calcMomOrYoYRate(p5Cur.deviationRate, p5Prev.deviationRate);

  const p1YoYValueRate = calcMomOrYoYRate(p1Cur.deviationAbs, p1Last.deviationAbs);
  const p3YoYValueRate = calcMomOrYoYRate(p3Cur.deviationAbs, p3Last.deviationAbs);
  const p5YoYValueRate = calcMomOrYoYRate(p5Cur.deviationAbs, p5Last.deviationAbs);

  const p1YoYRateRate = calcMomOrYoYRate(p1Cur.deviationRate, p1Last.deviationRate);
  const p3YoYRateRate = calcMomOrYoYRate(p3Cur.deviationRate, p3Last.deviationRate);
  const p5YoYRateRate = calcMomOrYoYRate(p5Cur.deviationRate, p5Last.deviationRate);

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
      actual: p1Metrics.actual,
      deviation: p1Deviation,
      deviationRate: Number(p1DeviationRate),
      deviationRateAbs: Number(p1DeviationRateAbs),
      label: 'P-1',
      month: p1Month,
    },
    p3: {
      forecast: p3Forecast,
      actual: p3Metrics.actual,
      deviation: p3Deviation,
      deviationRate: Number(p3DeviationRate),
      deviationRateAbs: Number(p3DeviationRateAbs),
      label: 'P-3',
      month: p3VersionMonth,
    },
    p5: {
      forecast: p5Forecast,
      actual: p5Metrics.actual,
      deviation: p5Deviation,
      deviationRate: Number(p5DeviationRate),
      deviationRateAbs: Number(p5DeviationRateAbs),
      label: 'P-5',
      month: p5VersionMonth,
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
    /** 过去区指标卡浮窗：Pn 口径 + 环比/同比（基于偏差值/偏差率主口径） */
    tooltipPast: {
      filterMonth: month,
      p1: {
        forecast: p1Forecast,
        actual: currentActual,
        deviation: p1Deviation,
        deviationRate: Number(p1DeviationRate),
        versionMonth: prevMonthStr,
        mom: {
          baseMonth: prevMonthStr,
          baseValueAbs: p1Prev.deviationAbs,
          rateValue: p1MomValueRate,
          baseValueRate: p1Prev.deviationRate,
          rateRate: p1MomRateRate,
        },
        yoy: {
          baseMonth: lastYearStr,
          baseValueAbs: p1Last.deviationAbs,
          rateValue: p1YoYValueRate,
          baseValueRate: p1Last.deviationRate,
          rateRate: p1YoYRateRate,
        },
      },
      p3: {
        forecast: p3Forecast,
        actual: currentActual,
        deviation: p3Deviation,
        deviationRate: Number(p3DeviationRate),
        versionMonth: p3VersionMonth,
        mom: {
          baseMonth: prevMonthStr,
          baseValueAbs: p3Prev.deviationAbs,
          rateValue: p3MomValueRate,
          baseValueRate: p3Prev.deviationRate,
          rateRate: p3MomRateRate,
        },
        yoy: {
          baseMonth: lastYearStr,
          baseValueAbs: p3Last.deviationAbs,
          rateValue: p3YoYValueRate,
          baseValueRate: p3Last.deviationRate,
          rateRate: p3YoYRateRate,
        },
      },
      p5: {
        forecast: p5Forecast,
        actual: currentActual,
        deviation: p5Deviation,
        deviationRate: Number(p5DeviationRate),
        versionMonth: p5VersionMonth,
        mom: {
          baseMonth: prevMonthStr,
          baseValueAbs: p5Prev.deviationAbs,
          rateValue: p5MomValueRate,
          baseValueRate: p5Prev.deviationRate,
          rateRate: p5MomRateRate,
        },
        yoy: {
          baseMonth: lastYearStr,
          baseValueAbs: p5Last.deviationAbs,
          rateValue: p5YoYValueRate,
          baseValueRate: p5Last.deviationRate,
          rateRate: p5YoYRateRate,
        },
      },
    },
    /** 未来区指标卡浮窗：仅环比 + 窗口月份说明 */
    tooltipFuture: {
      3: {
        label: '未来三月',
        months: future3Window.months,
        currentTotal: future3Window.forecast,
        previousTotal: prevMonthFuture3.forecast,
        momRate: prevMonthFuture3.forecast !== 0
          ? Number(((future3Window.forecast - prevMonthFuture3.forecast) / prevMonthFuture3.forecast * 100).toFixed(2))
          : 0,
        comparePeriodMonth: prevMonthStr,
      },
      6: {
        label: '未来六月',
        months: future6Window.months,
        currentTotal: future6Window.forecast,
        previousTotal: prevMonthFuture6.forecast,
        momRate: prevMonthFuture6.forecast !== 0
          ? Number(((future6Window.forecast - prevMonthFuture6.forecast) / prevMonthFuture6.forecast * 100).toFixed(2))
          : 0,
        comparePeriodMonth: prevMonthStr,
      },
      11: {
        label: '未来十一月',
        months: future11Window.months,
        currentTotal: future11Window.forecast,
        previousTotal: prevMonthFuture11.forecast,
        momRate: prevMonthFuture11.forecast !== 0
          ? Number(((future11Window.forecast - prevMonthFuture11.forecast) / prevMonthFuture11.forecast * 100).toFixed(2))
          : 0,
        comparePeriodMonth: prevMonthStr,
      },
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

  // 获取baseMonth当月起的N个月（包含baseMonth）
  for (let i = 0; i < windowMonths; i++) {
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

// 获取偏差趋势图数据（左图 - 偏差率趋势）
/**
 * 新口径：展示1-12月的偏差率对比（当年 vs 去年）
 * - X轴固定显示1月-12月（只显示月份，不带年份）
 * - Y轴显示偏差率百分比
 * - 数据系列：当年偏差率、去年偏差率
 * - 偏差率口径：|(forecast - actual) / actual| * 100%
 * - period控制使用哪个forecast版本（P-1/P-3/P-5）
 */
export function getDeviationTrend(query) {
  const { period = 'p1', category = 'all', bu = 'all', dataType = 'amount', targetMonth } = query;
  const [targetYearRaw, targetMonRaw] = (targetMonth || '').split('-').map(Number);
  const targetYear = targetYearRaw || new Date().getFullYear();
  const selectedMon = targetMonRaw || (new Date().getMonth() + 1);
  const lastYear = targetYear - 1;
  return Array.from({ length: 12 }, (_, i) => {
    const monthNum = i + 1;
    const monthLabel = `${monthNum}月`;
    const currentYm = `${targetYear}-${String(monthNum).padStart(2, '0')}`;
    const lastYm = `${lastYear}-${String(monthNum).padStart(2, '0')}`;
    // 趋势图按目标月本身计算，period 仅决定采用哪个版本预测字段
    const currentMetrics = getDeviationMetricsByMonth(currentYm, period, { category, bu, dataType });
    const lastMetrics = getDeviationMetricsByMonth(lastYm, period, { category, bu, dataType });

    return {
      month: monthLabel,
      // 当年：< 当前筛选月 显示；>= 当前筛选月 不显示点（null）
      currentYear: monthNum < selectedMon ? Number(currentMetrics.deviationRateSigned.toFixed(2)) : null,
      // 去年：全年展示（随筛选条件变化）
      lastYear: Number(lastMetrics.deviationRateSigned.toFixed(2)),
    };
  });
}

// 获取增长趋势图数据（已废弃，使用getFutureWindowTrend替代）
export function getGrowthTrend(query) {
  const { range = 3, category = 'all', bu = 'all', dataType = 'amount' } = query;
  // 此方法保留以保持兼容性，实际使用getFutureWindowTrend
  return getFutureWindowTrend({ ...query, window: range });
}

/**
 * 获取未来窗口趋势图数据（右图 - 本期vs上期forecast对比）
 * 展示未来N个目标月份中，本期forecast vs 上期forecast的逐月对比
 * - window: 3 | 6 | 11（未来三月/六月/十一月）
 * - X轴：显示未来窗口内的目标月份（如3月/4月/5月）
 * - Y轴：金额或数量
 * - 数据系列：本期（当前筛选期数版本）、上期（上一期版本）
 */
export function getFutureWindowTrend(query) {
  const { window = 3, category = 'all', bu = 'all', dataType = 'amount', targetMonth } = query;

  const allData = require('../mock/supply-chain').getMockForecastList();

  // 从targetMonth确定起始月份
  let baseDate;
  if (targetMonth) {
    const [year, mon] = targetMonth.split('-').map(Number);
    baseDate = new Date(year, mon - 1, 1);
  } else {
    baseDate = new Date();
  }

  const baseYear = baseDate.getFullYear();
  const baseMonth = baseDate.getMonth() + 1;

  // 获取上一期月份（用于获取上期forecast）
  const prevMonthDate = new Date(baseYear, baseMonth - 2, 1);
  const prevMonthStr = `${prevMonthDate.getFullYear()}-${String(prevMonthDate.getMonth() + 1).padStart(2, '0')}`;

  // 生成未来N个月的目标月份列表（包含targetMonth当月）
  const targetMonths = [];
  for (let i = 0; i < window; i++) {
    const targetDate = new Date(baseYear, baseMonth - 1 + i, 1);
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth() + 1;
    targetMonths.push({
      yearMonth: `${year}-${String(month).padStart(2, '0')}`,
      label: `${month}月`,
    });
  }

  return targetMonths.map(({ yearMonth, label }) => {
    // 获取当前期数版本对目标月份的预测
    let currentData = allData.filter(item => item.month === yearMonth);
    // 获取上一期版本对同一目标月份的预测（使用p1Forecast字段）
    let prevData = allData.filter(item => item.month === yearMonth);

    if (category && category !== 'all') {
      currentData = currentData.filter(item => item.category === category);
      prevData = prevData.filter(item => item.category === category);
    }
    if (bu && bu !== 'all') {
      currentData = currentData.filter(item => item.bu === bu);
      prevData = prevData.filter(item => item.bu === bu);
    }

    // 本期forecast（当前筛选期数版本）
    const currentValue = dataType === 'amount'
      ? currentData.reduce((sum, item) => sum + item.forecastAmount, 0)
      : currentData.reduce((sum, item) => sum + item.forecastQty, 0);

    // 上期forecast（上一期版本对该目标月的预测）
    const previousValue = dataType === 'amount'
      ? prevData.reduce((sum, item) => sum + (item.p1ForecastAmount || item.forecastAmount), 0)
      : prevData.reduce((sum, item) => sum + (item.p1ForecastQty || item.forecastQty), 0);

    return {
      month: label,
      current: currentValue,
      previous: previousValue,
    };
  });
}

// 获取饼图数据
export function getPieChartData(query) {
  const { month = getDefaultMonth(), dataType = 'actual', category = 'all', bu = 'all' } = query;
  
  return getMockPieData(month, dataType, { category, bu });
}

/**
 * 获取 Forecast Tracking 类目占比对比数据
 * - previousActual: 上期月份(actual)类目占比
 * - currentForecast: 本期月份(forecast)类目占比
 */
export function getForecastCategoryShare(query = {}) {
  const {
    month = getDefaultMonth(),
    dataType = 'amount',
    category = 'all',
    bu = 'all',
  } = query;

  const previousMonth = shiftMonthStr(month, -1);
  const allData = require('../mock/supply-chain').getMockForecastList();

  const aggregateByCategory = (targetMonth, metricType) => {
    let filtered = allData.filter((item) => item.month === targetMonth);
    if (bu && bu !== 'all') {
      filtered = filtered.filter((item) => item.bu === bu);
    }
    if (category && category !== 'all') {
      filtered = filtered.filter((item) => item.category === category);
    }

    const categoryMap = new Map();
    filtered.forEach((item) => {
      const value = metricType === 'actual'
        ? (dataType === 'amount' ? item.actualAmount : item.actualQty)
        : (dataType === 'amount' ? item.forecastAmount : item.forecastQty);
      const next = (categoryMap.get(item.category) || 0) + (value || 0);
      categoryMap.set(item.category, next);
    });

    const rawList = Array.from(categoryMap.entries())
      .map(([name, value]) => ({ name, value }))
      .filter((item) => item.value > 0);

    const total = rawList.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) return [];

    return rawList
      .map((item) => ({
        ...item,
        ratio: Number(((item.value / total) * 100).toFixed(2)),
      }))
      .sort((a, b) => b.value - a.value);
  };

  return {
    previousActual: aggregateByCategory(previousMonth, 'actual'),
    currentForecast: aggregateByCategory(month, 'forecast'),
    previousMonth,
    currentMonth: month,
  };
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

/**
 * 生成月份标签 (Mmm-YYYY)
 * 如: Jan-2025, Feb-2025, Mar-2026
 */
function formatMonthLabel(monthStr) {
  const [year, mon] = monthStr.split('-').map(Number);
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${monthNames[mon - 1]}-${year}`;
}

/**
 * 获取整体趋势图数据（多系列混合图）
 * 数据来源：复用明细页主表数据聚合逻辑
 * - 柱状系列：18个版本 Forecast（当前期数往前推18个月）
 * - 折线系列：Actual 2024、Actual 2025
 * - X轴固定 01月-12月
 */
export function getOverallTrend(query) {
  const { month = getDefaultMonth(), category = 'all', bu = 'all', dataType = 'amount' } = query;

  const allData = require('../mock/supply-chain').getMockForecastList();
  const [targetYear, targetMon] = month.split('-').map(Number);

  // 固定月份 01-12月
  const months = Array.from({ length: 12 }, (_, i) => ({
    monthNum: i + 1,
    monthLabel: `${String(i + 1).padStart(2, '0')}月`,
    monthStr: `${targetYear}-${String(i + 1).padStart(2, '0')}`,
  }));
  const targetYearMonths = months.map(m => m.monthStr);

  // 筛选数据（BU、类目）- 复用明细页筛选逻辑
  let filtered = allData;
  if (category && category !== 'all') {
    filtered = filtered.filter(item => item.category === category);
  }
  if (bu && bu !== 'all') {
    filtered = filtered.filter(item => item.bu === bu);
  }

  // 按 SKU+BU 分组（复用明细页逻辑）
  const skuGroups = {};
  filtered.forEach((item) => {
    const key = `${item.bu}-${item.sku}`;
    if (!skuGroups[key]) {
      skuGroups[key] = {
        sku: item.sku,
        category: item.category,
        bu: item.bu,
        monthsData: {},
      };
    }
    skuGroups[key].monthsData[item.month] = item;
  });

  // 辅助函数：生成基于seed的稳定随机值
  const getStableValue = (seedKey, baseValue, monthIdx) => {
    const seed = stableSeedFromString(seedKey);
    const seasonal = 0.86 + ((monthIdx % 6) * 0.035);
    const jitter = 0.88 + ((seed % 19) * 0.012);
    return Math.max(2000, Math.round(baseValue * seasonal * jitter));
  };

  // 辅助函数：获取某年某月的Actual值（优先用真实数据，无则模拟）
  const getActualValue = (skuGroup, year, monthNum) => {
    const monthStr = `${year}-${String(monthNum).padStart(2, '0')}`;
    const data = skuGroup.monthsData[monthStr];
    const value = data
      ? (dataType === 'amount' ? data.actualAmount : data.actualQty)
      : 0;
    if (value > 0) return value;

    // 模拟数据
    const seedBase = `${skuGroup.bu}-${skuGroup.category}-${skuGroup.sku}`;
    const baseline = Math.max(
      500 + (stableSeedFromString(seedBase) % 1500),
      3000
    );
    const yearFactor = 1 - ((targetYear - year) * 0.08);
    return getStableValue(`${seedBase}-actual-${year}-${monthNum}`, baseline * yearFactor, monthNum - 1);
  };

  // 辅助函数：获取某版本的Forecast值（优先用真实数据，无则模拟）
  const getForecastValue = (skuGroup, versionMonth, targetMonthStr, monthIdx) => {
    const versionData = skuGroup.monthsData[versionMonth];
    const baseValue = versionData
      ? (dataType === 'amount' ? versionData.forecastAmount : versionData.forecastQty)
      : 0;

    if (baseValue > 0) {
      // 版本对特定月份的预测 = 基础预测 * 版本因子 * 季节性
      const seed = stableSeedFromString(`${skuGroup.bu}-${skuGroup.category}-${skuGroup.sku}-${versionMonth}`);
      const versionFactor = 0.84 + ((seed % 17) * 0.01);
      const seasonal = 0.8 + ((monthIdx % 6) * 0.07);
      const jitter = 0.9 + ((seed % 20 + monthIdx) * 0.01);
      return Math.round(baseValue * versionFactor * seasonal * jitter);
    }

    // 模拟数据
    const seedBase = `${skuGroup.bu}-${skuGroup.category}-${skuGroup.sku}`;
    const baseline = 500 + (stableSeedFromString(seedBase) % 1500);
    return getStableValue(`${seedBase}-${versionMonth}-${targetMonthStr}`, baseline, monthIdx);
  };

  // 1. 聚合 Actual 2024、2025 数据
  const actualYears = [2024, 2025].filter(y => y <= targetYear);
  const actualSeries = actualYears.map((year) => {
    const values = months.map(({ monthNum }, idx) => {
      return Object.values(skuGroups).reduce((sum, group) => {
        return sum + getActualValue(group, year, monthNum);
      }, 0);
    });

    return {
      key: `actual_${year}`,
      name: `Actual ${year}`,
      type: 'line',
      year,
      values,
    };
  });

  // 2. 生成 Forecast 版本列表（当前期数往前推18个月）- 复用明细页逻辑
  const forecastVersions = [];
  for (let i = 17; i >= 0; i--) {
    const versionDate = new Date(targetYear, targetMon - 1 - i, 1);
    const versionMonth = `${versionDate.getFullYear()}-${String(versionDate.getMonth() + 1).padStart(2, '0')}`;
    const [vYear, vMon] = versionMonth.split('-').map(Number);

    // 计算该版本的覆盖月份（12个月）
    const coverageMonths = [];
    for (let j = 0; j < 12; j++) {
      const d = new Date(vYear, vMon - 1 + j, 1);
      coverageMonths.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    }

    forecastVersions.push({
      key: `forecast_${vYear}_${String(vMon).padStart(2, '0')}`,
      name: `Forecast(${formatMonthLabel(versionMonth)})`,
      versionMonth,
      year: vYear,
      coverageMonths,
    });
  }

  // 3. 聚合18个Forecast版本数据
  const forecastSeries = forecastVersions.map((version) => {
    const values = months.map(({ monthStr }, idx) => {
      // 检查该月份是否在版本的覆盖范围内
      const isInCoverage = version.coverageMonths.includes(monthStr);

      if (!isInCoverage) {
        return 0; // 不在覆盖范围内，值为0
      }

      // 聚合所有SKU在该版本对该月份的预测
      return Object.values(skuGroups).reduce((sum, group) => {
        return sum + getForecastValue(group, version.versionMonth, monthStr, idx);
      }, 0);
    });

    return {
      key: version.key,
      name: version.name,
      type: 'bar',
      year: version.year,
      values,
    };
  });

  // 4. 构建 chartData（Recharts 直接可用的扁平结构）
  const chartData = months.map(({ monthLabel }, idx) => {
    const row = { monthLabel };

    // Forecast 系列（18个）
    forecastSeries.forEach((series) => {
      row[series.key] = series.values[idx];
    });

    // Actual 系列（2024、2025）
    actualSeries.forEach((series) => {
      row[series.key] = series.values[idx];
    });

    return row;
  });

  // 5. 生成颜色
  // Forecast：彩虹色渐变（18个版本从蓝色→紫色→红色→橙色→黄色→绿色）
  const getForecastColor = (idx) => {
    // 彩虹渐变：从蓝色(200°) 到 绿色(120°)，跨越180°色环
    const hue = 200 + (idx * 10); // 每版本增加10°，200~380°(即20°)
    const finalHue = hue > 360 ? hue - 360 : hue; // 超过360则循环
    const saturation = 65 + (idx % 3) * 10; // 65-95%
    const lightness = 45 + (idx % 2) * 10; // 45-55%，保持中等亮度避免过深或过浅
    return `hsl(${finalHue}, ${saturation}%, ${lightness}%)`;
  };

  return {
    months: months.map(m => m.monthLabel),
    series: [
      ...forecastSeries.map((s, idx) => ({
        ...s,
        color: getForecastColor(idx),
      })),
      ...actualSeries.map((s, idx) => ({
        ...s,
        // Actual 使用高识别度颜色
        color: idx === 0 ? '#10B981' : '#F59E0B', // 绿色:2024, 橙色:2025
      })),
    ],
    chartData,
  };
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

// ==================== Forecast Detail 明细数据接口 ====================

/**
 * 获取 Forecast 明细矩阵数据（重构版）
 * 按 SKU 分组，包含固定26行 Type 行（Budget Plan, 18期Forecast, 3年Actual, 3行Error, 达成率）
 * 月份列固定展示当年01-12月 + 环比
 * @param {Object} query - 查询参数
 * @param {string} query.month - 当前期数（如 '2026-03'）
 * @param {string[]} query.selectedBus - 选中的BU列表（多选）
 * @param {string[]} query.selectedCategories - 选中的类目列表（多选）
 * @param {string[]} query.selectedPlanners - 选中的计划人员列表（多选）
 * @param {string} query.descriptionKeyword - Description模糊搜索关键词
 * @param {string} query.summarySkuKeyword - 汇总SKU精确搜索关键词
 * @param {number} query.page - 页码（默认1）
 * @param {number} query.pageSize - 每页SKU数（默认20）
 */
export function getForecastDetailMatrix(query) {
  const {
    month = getDefaultMonth(),
    selectedBus = [],
    selectedCategories = [],
    selectedPlanners = [],
    descriptionKeyword = '',
    summarySkuKeyword = '',
    page = 1,
    pageSize = 20,
  } = query;

  const allData = require('../mock/supply-chain').getMockForecastList();

  // 解析当前期数
  const [targetYear, targetMon] = month.split('-').map(Number);

  // 固定月份列：当年01-12月
  const monthColumns = Array.from({ length: 12 }, (_, i) => ({
    month: `${targetYear}-${String(i + 1).padStart(2, '0')}`,
    label: `${String(i + 1).padStart(2, '0')}月`,
  }));
  const targetYearMonths = monthColumns.map((c) => c.month);

  // 生成Forecast版本列表（当前期数往前推18个月）
  const forecastVersions = [];
  for (let i = 17; i >= 0; i--) {
    const versionDate = new Date(targetYear, targetMon - 1 - i, 1);
    const versionMonth = `${versionDate.getFullYear()}-${String(versionDate.getMonth() + 1).padStart(2, '0')}`;
    forecastVersions.push({
      month: versionMonth,
      label: formatMonthLabel(versionMonth),
      offset: i,
    });
  }

  // 需要查询的所有月份：targetYear全年 + 实销历史3年 + forecastVersions各版本月份
  const actualYears = [targetYear - 2, targetYear - 1, targetYear];
  const actualQueryMonths = [];
  actualYears.forEach((year) => {
    for (let i = 1; i <= 12; i++) {
      actualQueryMonths.push(`${year}-${String(i).padStart(2, '0')}`);
    }
  });
  const allQueryMonths = [
    ...new Set([...targetYearMonths, ...actualQueryMonths, ...forecastVersions.map((v) => v.month)]),
  ];

  // 筛选数据（获取所有可能需要的月份数据）
  let filtered = allData.filter((item) => allQueryMonths.includes(item.month));

  // BU多选筛选
  if (selectedBus && selectedBus.length > 0 && !selectedBus.includes('all')) {
    filtered = filtered.filter((item) => selectedBus.includes(item.bu));
  }

  // Category多选筛选
  if (selectedCategories && selectedCategories.length > 0 && !selectedCategories.includes('all')) {
    filtered = filtered.filter((item) => selectedCategories.includes(item.category));
  }

  // Description模糊搜索
  if (descriptionKeyword) {
    const keyword = descriptionKeyword.toLowerCase();
    filtered = filtered.filter((item) => (item.skuName || '').toLowerCase().includes(keyword));
  }

  // 汇总SKU精确搜索
  if (summarySkuKeyword) {
    filtered = filtered.filter((item) => item.sku === summarySkuKeyword);
  }

  // 计划人员列表
  const planners = ['Mina', 'Anjony', 'Belly', 'Dani'];
  const suppliers = ['供应商A', '供应商B', '供应商C', '供应商D', '供应商E'];

  // 根据SKU获取计划人员（mock映射）
  const getPlannerBySku = (sku) => {
    const hash = (sku.charCodeAt(3) || 0) + (sku.charCodeAt(5) || 0);
    return planners[hash % planners.length];
  };

  // 根据SKU获取供应商（mock映射）
  const getSupplierBySku = (sku) => {
    const hash = (sku.charCodeAt(4) || 0) + (sku.charCodeAt(6) || 0);
    return suppliers[hash % suppliers.length];
  };

  // 按 SKU+BU 分组（确保唯一性）
  const skuGroups = {};
  filtered.forEach((item) => {
    const key = `${item.bu}-${item.sku}`;
    if (!skuGroups[key]) {
      skuGroups[key] = {
        sku: item.sku,
        category: item.category,
        description: item.skuName || `${item.category} Product`,
        bu: item.bu,
        planner: getPlannerBySku(item.sku), // 计划人员
        supplier: getSupplierBySku(item.sku), // 供应商
        monthsData: {},
      };
    }
    skuGroups[key].monthsData[item.month] = item;
  });

  // 计算环比
  const calcMom = (values, months) => {
    const moms = {};
    months.forEach((m, idx) => {
      if (idx === 0) {
        moms[m] = 0;
      } else {
        const prevMonth = months[idx - 1];
        const prev = values[prevMonth] || 0;
        const curr = values[m] || 0;
        moms[m] = prev > 0 ? (((curr - prev) / prev) * 100).toFixed(2) : 0;
      }
    });
    return moms;
  };

  const calcTotal = (values, months) => months.reduce((sum, m) => sum + (Number(values[m]) || 0), 0);

  const calcAverage = (values, months) => {
    if (months.length === 0) return 0;
    return calcTotal(values, months) / months.length;
  };

  const buildMetrics = (values, referenceValues, currentMonth) => {
    const total = calcTotal(values, targetYearMonths);
    const referenceTotal = calcTotal(referenceValues, targetYearMonths);
    const currentValue = Number(values[currentMonth]) || 0;
    const currentReference = Number(referenceValues[currentMonth]) || 0;

    return {
      ytdRate: referenceTotal > 0 ? ((total / referenceTotal) * 100).toFixed(2) : 0,
      bias: currentReference > 0 ? (((currentValue - currentReference) / currentReference) * 100).toFixed(2) : 0,
      total,
    };
  };

  const buildPercentMetrics = (values, currentMonth) => ({
    ytdRate: calcAverage(values, targetYearMonths).toFixed(2),
    bias: (Number(values[currentMonth]) || 0).toFixed(2),
    total: calcAverage(values, targetYearMonths).toFixed(2),
  });

  const buildFallbackSeries = (seedKey, baseValue, minValue = 2000) => {
    const values = {};
    targetYearMonths.forEach((monthStr, idx) => {
      const seed = stableSeedFromString(`${seedKey}-${monthStr}`);
      const seasonal = 0.86 + ((idx % 6) * 0.035);
      const jitter = 0.88 + ((seed % 19) * 0.012);
      values[monthStr] = Math.max(minValue, Math.round(baseValue * seasonal * jitter));
    });
    return values;
  };

  const fillSeries = (seedKey, rawValues, baseValue) => {
    const fallbackValues = buildFallbackSeries(seedKey, baseValue);
    const values = {};
    targetYearMonths.forEach((monthStr) => {
      const raw = Number(rawValues[monthStr]) || 0;
      values[monthStr] = raw > 0 ? raw : fallbackValues[monthStr];
    });
    return values;
  };

  // 计算涉及的所有年份（根据Forecast版本范围）- 移到函数顶部
  const allYears = new Set([targetYear]);
  forecastVersions.forEach((v) => {
    const [y] = v.month.split('-').map(Number);
    allYears.add(y);
    allYears.add(y + 1); // 每个版本可能跨到下一年
  });
  const availableYears = Array.from(allYears).sort();

  // 生成每个SKU的行数据
  let allGroups = Object.values(skuGroups).map((group) => {
    const rows = [];
    const seedBase = `${group.bu}-${group.category}-${group.sku}`;
    const currentMonth = month;
    const latestMonthData = group.monthsData[currentMonth] || Object.values(group.monthsData)[0] || {};
    const baselineValue = Math.max(
      latestMonthData.actualQty || 0,
      latestMonthData.forecastQty || 0,
      500 + (stableSeedFromString(seedBase) % 1500)
    );

    // 辅助函数：获取某年的Actual数据（01-12月）- 数量维度
    const getYearActualValues = (year) => {
      const values = {};
      for (let i = 1; i <= 12; i++) {
        const monthStr = `${year}-${String(i).padStart(2, '0')}`;
        const data = group.monthsData[monthStr];
        // 优先使用真实数据，如果没有则生成模拟数据
        const actualQty = data ? data.actualQty || 0 : 0;
        if (actualQty > 0) {
          values[monthStr] = actualQty;
        } else {
          // 生成基于 seed 的模拟数据，确保不为0
          const seed = stableSeedFromString(`${seedBase}-actual-${year}-${i}`);
          const yearFactor = 1 - ((targetYear - year) * 0.08);
          const seasonal = 0.8 + ((i % 6) * 0.07);
          const jitter = 0.9 + ((seed % 20) * 0.01);
          values[monthStr] = Math.round(baselineValue * yearFactor * seasonal * jitter);
        }
      }
      const yearMonths = getYearMonths(year);
      return { values, total: calcTotal(values, yearMonths) };
    };

    // 辅助函数：获取某版本的Forecast对其12个月覆盖范围的数据 - 数量维度
    const getVersionForecastValues = (versionMonth, coverageMonths, versionLabel) => {
      const versionData = group.monthsData[versionMonth];
      const versionSeed = stableSeedFromString(`${seedBase}-${versionMonth}`);
      const values = {};
      // 为覆盖范围内的所有月份生成数据
      coverageMonths.forEach((monthStr, idx) => {
        const baseForecast = versionData?.forecastQty || baselineValue;
        const versionFactor = 0.84 + ((versionSeed % 17) * 0.01);
        const seasonal = 0.8 + ((idx % 6) * 0.07);
        const jitter = 0.9 + ((versionSeed % 20 + idx) * 0.01);
        values[monthStr] = Math.round(baseForecast * versionFactor * seasonal * jitter);
      });
      return values;
    };

    // 辅助函数：按年份重新组织数据
    const buildDataByYear = (values, metrics) => {
      const dataByYear = {};
      availableYears.forEach((year) => {
        const yearMonths = getYearMonths(year);
        const yearValues = {};
        yearMonths.forEach((m) => {
          yearValues[m] = values[m] || 0;
        });
        dataByYear[year] = {
          monthValues: yearValues,
          monthMoms: calcMom(yearValues, yearMonths),
          ytdRate: metrics.ytdRate,
          bias: metrics.bias,
          total: metrics.total,
        };
      });
      return dataByYear;
    };

    // 辅助函数：计算Error (Actual - Forecast) / Forecast %
    const calcErrorValues = (actualValues, forecastValues) => {
      const errors = {};
      availableYears.forEach((year) => {
        const yearMonths = getYearMonths(year);
        yearMonths.forEach((m) => {
          const actual = actualValues[m] || 0;
          const forecast = forecastValues[m] || 0;
          errors[m] = forecast > 0 ? (((actual - forecast) / forecast) * 100).toFixed(2) : 0;
        });
      });
      return errors;
    };

    // 辅助函数：计算达成率
    const calcAchievementValues = (actualValues, budgetValues) => {
      const achievements = {};
      availableYears.forEach((year) => {
        const yearMonths = getYearMonths(year);
        yearMonths.forEach((m) => {
          const actual = actualValues[m] || 0;
          const budget = budgetValues[m] || 1;
          achievements[m] = ((actual / budget) * 100).toFixed(2);
        });
      });
      return achievements;
    };

    // 先获取 targetYear 年的 Actual 数据（用于 Budget Plan 计算）
    const actual2026 = getYearActualValues(targetYear);

    // 1. Budget Plan 行（固定targetYear年有数据，其他年份为0）
    const budgetRawValues = {};
    targetYearMonths.forEach((m) => {
      const seed = stableSeedFromString(`${seedBase}-budget-${m}`);
      const uplift = 1.08 + ((seed % 11) * 0.01);
      budgetRawValues[m] = Math.round(actual2026.values[m] * uplift);
    });
    const budgetValues = fillSeries(`${seedBase}-budget`, budgetRawValues, baselineValue * 1.08);
    const budgetMetrics = buildMetrics(budgetValues, budgetValues, currentMonth);

    const budgetDataByYear = {};
    availableYears.forEach((year) => {
      const yearMonths = getYearMonths(year);
      if (year === targetYear) {
        budgetDataByYear[year] = {
          monthValues: budgetValues,
          monthMoms: calcMom(budgetValues, yearMonths),
          ytdRate: budgetMetrics.ytdRate,
          bias: budgetMetrics.bias,
          total: budgetMetrics.total,
        };
      } else {
        const zeroValues = {};
        yearMonths.forEach((m) => (zeroValues[m] = 0));
        budgetDataByYear[year] = {
          monthValues: zeroValues,
          monthMoms: calcMom(zeroValues, yearMonths),
          ytdRate: 0,
          bias: 0,
          total: 0,
        };
      }
    });

    rows.push({
      type: 'Budget Plan',
      typeCode: 'budget',
      dataByYear: budgetDataByYear,
      isPercent: false,
    });

    // 2-19. Forecast 行（18个版本）
    forecastVersions.forEach((version) => {
      // 计算该版本的覆盖月份（12个月）
      const [vYear, vMon] = version.month.split('-').map(Number);
      const coverageMonths = [];
      for (let i = 0; i < 12; i++) {
        const d = new Date(vYear, vMon - 1 + i, 1);
        coverageMonths.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
      }

      // 为覆盖范围内的所有月份生成forecast数据
      const coverageValues = getVersionForecastValues(version.month, coverageMonths);

      // 按年份组织数据（覆盖范围内有数据，范围外为0）
      const forecastDataByYear = {};
      availableYears.forEach((year) => {
        const yearMonths = getYearMonths(year);
        const yearValues = {};
        yearMonths.forEach((m) => {
          // 如果该月份在coverage范围内，使用生成的数据，否则为0
          yearValues[m] = coverageValues[m] || 0;
        });
        const metrics = buildMetrics(yearValues, budgetValues, currentMonth);
        forecastDataByYear[year] = {
          monthValues: yearValues,
          monthMoms: calcMom(yearValues, yearMonths),
          ytdRate: metrics.ytdRate,
          bias: metrics.bias,
          total: metrics.total,
        };
      });

      rows.push({
        type: `Forecast(${version.label})`,
        typeCode: 'forecast',
        versionMonth: version.month,
        coverageMonths,
        dataByYear: forecastDataByYear,
        isPercent: false,
      });
    });

    // 20-22. Actual 行（2024, 2025, 2026）- 固定三年
    [2024, 2025, 2026].forEach((actualYear) => {
      const actualYearValues = getYearActualValues(actualYear);

      // 按年份组织数据（只有对应年份有数据，其他年份为0）
      const actualDataByYear = {};
      availableYears.forEach((year) => {
        const yearMonths = getYearMonths(year);
        if (year === actualYear) {
          const metrics = buildMetrics(actualYearValues.values, budgetValues, currentMonth);
          actualDataByYear[year] = {
            monthValues: actualYearValues.values,
            monthMoms: calcMom(actualYearValues.values, yearMonths),
            ytdRate: metrics.ytdRate,
            bias: metrics.bias,
            total: metrics.total,
          };
        } else {
          const zeroValues = {};
          yearMonths.forEach((m) => (zeroValues[m] = 0));
          actualDataByYear[year] = {
            monthValues: zeroValues,
            monthMoms: calcMom(zeroValues, yearMonths),
            ytdRate: 0,
            bias: 0,
            total: 0,
          };
        }
      });

      rows.push({
        type: `Actual${actualYear}`,
        typeCode: 'actual',
        year: actualYear,
        dataByYear: actualDataByYear,
        isPercent: false,
      });
    });

    // 23-25. Error 行（Vs P-1, P-3, P-5）
    // 先存储所有 forecast 版本的 dataByYear 供后续使用
    const forecastVersionsData = {};
    rows
      .filter((r) => r.typeCode === 'forecast')
      .forEach((r) => {
        forecastVersionsData[r.versionMonth] = r.dataByYear;
      });

    // 存储所有 actual 行的 dataByYear 供后续使用
    const actualDataByYear = {};
    rows
      .filter((r) => r.typeCode === 'actual')
      .forEach((r) => {
        actualDataByYear[r.year] = r.dataByYear;
      });

    // P-1/P-3/P-5 对应 forecastVersions 的倒数第1/3/5个版本
    // forecastVersions 是按时间顺序排列的（从旧到新），所以倒数就是最新的
    const pIndices = [1, 3, 5];
    ['P-1', 'P-3', 'P-5'].forEach((pLabel, idx) => {
      const pIndex = pIndices[idx];
      // 从后往前数第pIndex个版本
      const versionIndex = forecastVersions.length - pIndex;
      const version = forecastVersions[versionIndex] || forecastVersions[forecastVersions.length - 1];

      // 获取该版本的forecast dataByYear
      const versionForecastData = forecastVersionsData[version.month] || {};

      // 计算各年份的Error
      const errorDataByYear = {};
      availableYears.forEach((year) => {
        const yearMonths = getYearMonths(year);
        const actualYearData =
          year >= 2024 && year <= 2026 ? actualDataByYear[year]?.[year]?.monthValues || {} : {};

        const errors = {};
        yearMonths.forEach((m) => {
          const actual = actualYearData[m] || 0;
          const forecast = versionForecastData[year]?.monthValues?.[m] || 0;
          errors[m] = forecast > 0 ? (((actual - forecast) / forecast) * 100).toFixed(2) : 0;
        });

        const errorMoms = calcMom(errors, yearMonths);
        const errorMetrics = buildPercentMetrics(errors, currentMonth);

        errorDataByYear[year] = {
          monthValues: errors,
          monthMoms: errorMoms,
          ytdRate: errorMetrics.ytdRate,
          bias: errorMetrics.bias,
          total: errorMetrics.total,
        };
      });

      rows.push({
        type: `Error(Vs ${pLabel})`,
        typeCode: 'error',
        compareTo: pLabel,
        dataByYear: errorDataByYear,
        isPercent: true,
      });
    });

    // 26. 达成率 行
    const achievementDataByYear = {};
    availableYears.forEach((year) => {
      const yearMonths = getYearMonths(year);
      // 使用之前存储的 actualDataByYear
      const actualYearData =
        year >= 2024 && year <= 2026 ? actualDataByYear[year]?.[year]?.monthValues || {} : {};

      const achievements = {};
      yearMonths.forEach((m) => {
        const actual = actualYearData[m] || 0;
        const budget = budgetDataByYear[year]?.monthValues[m] || 1;
        achievements[m] = ((actual / budget) * 100).toFixed(2);
      });

      const achievementMoms = calcMom(achievements, yearMonths);
      const achievementMetrics = buildPercentMetrics(achievements, currentMonth);

      achievementDataByYear[year] = {
        monthValues: achievements,
        monthMoms: achievementMoms,
        ytdRate: achievementMetrics.ytdRate,
        bias: achievementMetrics.bias,
        total: achievementMetrics.total,
      };
    });

    rows.push({
      type: '达成率',
      typeCode: 'achievement',
      dataByYear: achievementDataByYear,
      isPercent: true,
    });

    return {
      sku: group.sku,
      category: group.category,
      description: group.description,
      bu: group.bu,
      planner: group.planner,
      supplier: group.supplier,
      rows,
    };
  });

  // 计划人员筛选
  if (selectedPlanners && selectedPlanners.length > 0 && !selectedPlanners.includes('all')) {
    allGroups = allGroups.filter((group) => selectedPlanners.includes(group.planner));
  }

  // 按 Actual2026 Total 排序（降序）
  allGroups.sort((a, b) => {
    const aActual = a.rows.find((r) => r.type === `Actual${targetYear}`);
    const bActual = b.rows.find((r) => r.type === `Actual${targetYear}`);
    return (bActual?.dataByYear?.[targetYear]?.total || 0) - (aActual?.dataByYear?.[targetYear]?.total || 0);
  });

  // 分页
  const totalCount = allGroups.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (page - 1) * pageSize;
  const paginatedGroups = allGroups.slice(startIndex, startIndex + pageSize);

  return {
    frozenColumns: ['汇总SKU', '供应链类目&备注', '计划/供应商', 'BU', 'Type', 'YTD%', 'Bias', 'Total'],
    monthColumns: monthColumns,
    momColumns: monthColumns.map((c) => ({ ...c, label: `${c.label}环比` })),
    groups: paginatedGroups,
    totalCount,
    totalPages,
    currentPage: page,
    pageSize,
    targetYear,
    availableYears,
    defaultYear: targetYear,
  };
}

// 辅助函数：按年份重新组织数据
const getYearMonths = (year) =>
  Array.from({ length: 12 }, (_, i) => `${year}-${String(i + 1).padStart(2, '0')}`);

/**
 * 获取 Forecast 异常摘要数据
 * 识别连续两期达成率异常（>20% 或 <-20%）且金额>=3000的SKU
 * @param {Object} query - 查询参数
 */
export function getForecastExceptionSummary(query) {
  const {
    month = getDefaultMonth(),
    selectedBus = [],
    selectedCategories = [],
    dataType = 'amount',
  } = query;

  const allData = require('../mock/supply-chain').getMockForecastList();

  // 获取判断窗口的三个月份（上上期、上期、本期）
  const [year, mon] = month.split('-').map(Number);
  const currentMonth = month;
  const prevMonth = `${year}-${String(mon - 1).padStart(2, '0')}`;
  const prev2Month = mon > 2 ? `${year}-${String(mon - 2).padStart(2, '0')}` : `${year - 1}-12`;

  const windowMonths = [prev2Month, prevMonth, currentMonth];

  // 筛选数据
  let filtered = allData.filter((item) => windowMonths.includes(item.month));

  // BU筛选
  if (selectedBus && selectedBus.length > 0 && !selectedBus.includes('all')) {
    filtered = filtered.filter((item) => selectedBus.includes(item.bu));
  }

  // Category筛选
  if (selectedCategories && selectedCategories.length > 0 && !selectedCategories.includes('all')) {
    filtered = filtered.filter((item) => selectedCategories.includes(item.category));
  }

  // 按 SKU+BU 分组，收集三个月数据
  const skuGroups = {};
  filtered.forEach((item) => {
    const key = `${item.bu}-${item.sku}`;
    if (!skuGroups[key]) {
      skuGroups[key] = {
        bu: item.bu,
        sku: item.sku,
        category: item.category,
        description: item.skuName || `${item.category} Product`,
        monthsData: {},
      };
    }
    skuGroups[key].monthsData[item.month] = item;
  });

  // 归因人员列表
  const owners = ['Mina', 'Anjony', 'Belly', 'Dani'];

  // 识别异常
  const exceptions = [];
  const ownerStats = owners.map((name) => ({ name, count: 0 }));

  Object.values(skuGroups).forEach((group) => {
    // 获取三个月的达成率 (Actual / Forecast)
    const getAchievement = (monthStr) => {
      const data = group.monthsData[monthStr];
      if (!data) return null;
      const actual = dataType === 'amount' ? data.actualAmount : data.actualQty;
      const forecast = dataType === 'amount' ? data.forecastAmount : data.forecastQty;
      if (forecast <= 0) return null;
      return {
        rate: ((actual / forecast) * 100 - 100).toFixed(2), // 偏差率
        amount: actual,
      };
    };

    const prev2 = getAchievement(prev2Month);
    const prev1 = getAchievement(prevMonth);
    const current = getAchievement(currentMonth);

    // 判断连续两期异常：上上期->上期 或 上期->本期
    const isAbnormal = (val) => val !== null && (parseFloat(val) > 20 || parseFloat(val) < -20);
    const isAmountValid = (amt) => amt !== null && amt >= 3000;

    let isException = false;
    let exceptionType = '';
    let exceptionValue = null;

    // 连续两期判断
    if (prev2 && prev1 && isAbnormal(prev2.rate) && isAbnormal(prev1.rate)) {
      if (isAmountValid(prev2.amount) && isAmountValid(prev1.amount)) {
        isException = true;
        exceptionType = '连续两期异常（上上期→上期）';
        exceptionValue = prev1.rate;
      }
    }
    if (prev1 && current && isAbnormal(prev1.rate) && isAbnormal(current.rate)) {
      if (isAmountValid(prev1.amount) && isAmountValid(current.amount)) {
        isException = true;
        exceptionType = '连续两期异常（上期→本期）';
        exceptionValue = current.rate;
      }
    }

    if (isException) {
      // 随机归因（mock阶段）
      const ownerIndex = (group.sku.charCodeAt(3) + group.sku.charCodeAt(5)) % owners.length;
      const owner = owners[ownerIndex];
      ownerStats[ownerIndex].count++;

      exceptions.push({
        bu: group.bu,
        category: group.category,
        description: group.description,
        sku: group.sku,
        previous2: prev2 ? parseFloat(prev2.rate) : null,
        previous1: prev1 ? parseFloat(prev1.rate) : null,
        current: current ? parseFloat(current.rate) : null,
        reason: exceptionType,
        severity: Math.abs(parseFloat(exceptionValue)),
        owner,
      });
    }
  });

  // 按严重程度排序
  exceptions.sort((a, b) => b.severity - a.severity);

  return {
    ownerStats,
    list: exceptions,
    total: exceptions.length,
    rule: {
      threshold: 20, // 20%
      minAmount: 3000,
    },
  };
}

/**
 * 获取 Forecast 归因统计数据
 * 各责任人的异常数量统计
 * @param {Object} query - 查询参数
 */
export function getForecastOwnerAttribution(query) {
  // 复用异常摘要的统计逻辑
  const summary = getForecastExceptionSummary(query);
  return {
    ownerStats: summary.ownerStats,
  };
}