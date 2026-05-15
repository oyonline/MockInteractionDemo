/** 供应链计划 Service - Forecast Tracking + Opening ITO */

import {
  getMockForecastByMonth,
  getMockTrendData,
  getMockPieData,
  getMockTopUnderperformed,
  getMockCategoryAnalysis,
  // Opening ITO mock methods
  getMockOpeningItoMonthOptions,
  getMockOpeningItoBuOptions,
  getMockOpeningItoCategoryOptions,
  getMockOpeningItoMetricCards,
  getMockOpeningItoBuWarehouseTable,
  getMockOpeningItoBuCategoryTable,
  getMockOpeningItoPieData,
  getMockOpeningItoYearlyTrend,
  getMockOpeningItoMonthlyTrend,
  getMockOpeningItoBuComparison,
  getMockCategoryAnalysisData,
  getMockCategoryDescriptionTop10,
  getMockExcessTabs,
  getMockExcessMetrics,
  getMockExcessMainTable,
  getMockExcessAgingTop10,
  getMockExcessInventoryAge,
  getMockExcessInventoryAgeComparison,
  getMockExcessInventoryAgeWarehouseDrilldown,
  getMockExcessAnalysisData,
  getMockInventoryAgeOver365Analysis,
  getMockInventoryAgeOver365DrilldownTop10,
  generateDefaultPeriods,
  generateBaseRows,
  generateMonthlyForRow,
  getForecastMonthKeys,
  generatePlanSuggestForRow,
  BU_VALUES,
} from '../mock/supply-chain';
import * as storage from '../utils/storage';
import {
  SUPPLY_CHAIN_EXCESS_ARCHIVES,
  SUPPLY_CHAIN_EXCESS_TOP10_NOTES,
  SUPPLY_CHAIN_SALES_FORECAST_V1,
} from '../utils/storageKeys';

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

// 计算上一个月（用于P-1口径分析）
export function getPreviousMonth(monthStr) {
  const [year, mon] = monthStr.split('-').map(Number);
  const d = new Date(year, mon - 2, 1); // 减1个月
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

// 获取TOP10未达成
export function getTopUnderperformed(query) {
  const { month = getDefaultMonth(), category = 'all', bu = 'all', dataType = 'amount' } = query;

  // 使用上一个月的数据进行分析（P-1口径）
  const analysisMonth = getPreviousMonth(month);

  const mockData = getMockTopUnderperformed(analysisMonth, { category, bu });

  // 计算总偏差（用于占比计算）
  const totalDeviation = mockData.reduce((sum, item) => {
    const deviation = dataType === 'amount'
      ? (item.forecastAmount - item.actualAmount)
      : (item.forecastQty - item.actualQty);
    return sum + Math.max(0, deviation); // 只统计未达成（正偏差）
  }, 0);

  // 增强数据格式：增加排名、占比、描述等字段
  return mockData.map((item, index) => {
    const deviationAmount = item.forecastAmount - item.actualAmount;
    const deviationQty = item.forecastQty - item.actualQty;
    const deviationRate = item.forecastAmount > 0
      ? ((item.actualAmount - item.forecastAmount) / item.forecastAmount * 100)
      : 0;

    // 计算占比（该SKU偏差占总未达成的比例）
    const share = totalDeviation > 0
      ? (Math.max(0, deviationAmount) / totalDeviation * 100)
      : 0;

    return {
      rank: index + 1,                              // 排名
      bu: item.bu,                                  // BU
      category: item.category,                      // 供应链类目
      description: item.skuName,                    // 描述（skuName映射）
      qty: item.actualQty,                          // 数量
      amount: item.actualAmount,                    // 金额
      deviationQty,                                 // 偏差数量
      deviationAmount,                              // 偏差金额
      deviationRate: deviationRate.toFixed(2),      // 偏差率
      share: `${share.toFixed(1)}%`,               // 占比
      skuId: item.skuId,                           // SKU ID（用于详情跳转）
      analysisMonth,                                // 分析月份（P-1口径）
    };
  });
}

// 获取未达成类目分析
export function getCategoryAnalysis(query) {
  const { month = getDefaultMonth(), bu = 'all', dataType = 'amount' } = query;

  // 使用上一个月的数据进行分析（P-1口径）
  const analysisMonth = getPreviousMonth(month);

  const mockData = getMockCategoryAnalysis(analysisMonth, { bu });

  // 计算总偏差用于占比
  const totalDeviation = mockData.reduce((sum, item) => sum + Math.max(0, item.totalDeviation), 0);

  // 增强数据：添加排名、占比、BU维度
  return mockData.map((item, index) => {
    const share = totalDeviation > 0
      ? (Math.max(0, item.totalDeviation) / totalDeviation * 100)
      : 0;

    return {
      rank: index + 1,                              // 排名
      category: item.category,                      // 类目
      skuCount: item.skuCount,                      // SKU数量
      totalDeviation: item.totalDeviation,          // 总偏差金额
      totalDeviationQty: item.totalDeviationQty || item.totalDeviation / 1000, // 总偏差数量（估算）
      deviationRate: item.deviationRate,           // 偏差率
      share: `${share.toFixed(1)}%`,               // 占比
      bu: bu !== 'all' ? bu : '多BU汇总',          // BU维度
      analysisMonth,                                // 分析月份（P-1口径）
    };
  });
}

// 获取未达成类目矩阵透视数据（类目×BU矩阵）
export function getUnderperformedMatrix(query) {
  const { month = getDefaultMonth(), category = 'all', bu = 'all', dataType = 'amount' } = query;

  // 使用上一个月的数据进行分析（P-1口径）
  const analysisMonth = getPreviousMonth(month);

  const allData = require('../mock/supply-chain').getMockForecastList();

  // 筛选数据
  let filtered = allData.filter(item => item.month === analysisMonth);

  // 只取未达成的数据（actual < forecast）
  filtered = filtered.filter(item => item.actualAmount < item.forecastAmount);

  if (category && category !== 'all') {
    filtered = filtered.filter(item => item.category === category);
  }
  if (bu && bu !== 'all') {
    filtered = filtered.filter(item => item.bu === bu);
  }

  // 获取所有类目和BU（从全局数据中获取完整维度，确保矩阵完整）
  const allCategories = [...new Set(allData.map(item => item.category))].sort();
  const allBus = [...new Set(allData.map(item => item.bu))].sort();

  // 初始化矩阵数据结构
  const matrixData = {};
  const columnTotals = {};

  // 初始化列总计
  allBus.forEach(b => {
    columnTotals[b] = 0;
  });

  // 按类目和BU聚合偏差数据
  allCategories.forEach(cat => {
    matrixData[cat] = {};
    let rowTotal = 0;

    allBus.forEach(b => {
      // 计算该类目+BU的偏差总和
      const cellData = filtered.filter(item => item.category === cat && item.bu === b);
      const deviation = cellData.reduce((sum, item) => {
        return sum + (dataType === 'amount'
          ? (item.forecastAmount - item.actualAmount)
          : (item.forecastQty - item.actualQty));
      }, 0);

      matrixData[cat][b] = deviation;
      columnTotals[b] += deviation;
      rowTotal += deviation;
    });

    matrixData[cat].total = rowTotal;
  });

  // 计算总计
  const grandTotal = allBus.reduce((sum, b) => sum + columnTotals[b], 0);

  return {
    categories: allCategories,        // 类目列表（行）
    bus: allBus,                       // BU列表（列）
    data: matrixData,                  // 矩阵数据 data[category][bu]
    columnTotals,                     // 列总计
    grandTotal,                       // 总计
    month: analysisMonth,             // 分析月份（P-1口径）
    dataType,                        // 数据类型
    targetMonth: month,               // 目标月份（原始筛选月份）
  };
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
 * - X轴固定 01月-12月，支持按年份切换显示
 */
export function getOverallTrend(query) {
  const { 
    month = getDefaultMonth(), 
    category = 'all', 
    bu = 'all', 
    dataType = 'amount',
    displayYear // 新增：指定展示年份（可选）
  } = query;

  const allData = require('../mock/supply-chain').getMockForecastList();
  const [targetYear, targetMon] = month.split('-').map(Number);
  
  // 确定实际展示年份（优先使用传入的 displayYear，否则用 targetYear）
  const effectiveYear = displayYear || targetYear;

  // 固定月份 01-12月（始终展示12个月，使用 effectiveYear）
  const months = Array.from({ length: 12 }, (_, i) => ({
    monthNum: i + 1,
    monthLabel: `${String(i + 1).padStart(2, '0')}月`,
    monthStr: `${effectiveYear}-${String(i + 1).padStart(2, '0')}`,
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
    // yearFactor 基于 effectiveYear（当前展示年份）计算，确保切换年份时数据合理性
    const yearFactor = 1 - ((effectiveYear - year) * 0.08);
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

  // 3. 根据 effectiveYear 筛选相关的 forecast 版本
  // 只保留覆盖范围包含 effectiveYear 年份月份的版本
  const relevantForecastVersions = forecastVersions.filter((version) => {
    return version.coverageMonths.some((monthStr) => {
      const [year] = monthStr.split('-').map(Number);
      return year === effectiveYear;
    });
  });

  // 聚合相关 Forecast 版本数据
  const forecastSeries = relevantForecastVersions.map((version) => {
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
  // Forecast：彩虹色渐变（根据实际显示的版本数量均匀分布）
  const totalRelevantVersions = relevantForecastVersions.length;
  const getForecastColor = (idx) => {
    // 彩虹渐变：从蓝色(200°) 到 绿色(120°)，跨越180°色环
    // 根据实际显示的版本数量均匀分布颜色
    const hueStep = totalRelevantVersions > 1 ? 180 / (totalRelevantVersions - 1) : 0;
    const hue = 200 + (idx * hueStep); // 均匀分布
    const finalHue = hue > 360 ? hue - 360 : hue; // 超过360则循环
    const saturation = 65 + (idx % 3) * 10; // 65-95%
    const lightness = 45 + (idx % 2) * 10; // 45-55%，保持中等亮度避免过深或过浅
    return `hsl(${finalHue}, ${saturation}%, ${lightness}%)`;
  };

  // 6. 计算可选年份范围（根据 forecastVersions 覆盖范围）
  const allYears = new Set();
  forecastVersions.forEach((v) => {
    // 从版本月份解析年份
    const [vYear] = v.versionMonth.split('-').map(Number);
    // 添加版本年份及其覆盖年份（通常跨2年：版本年份+覆盖到下一年）
    allYears.add(vYear);
    allYears.add(vYear + 1);
  });
  
  // 过滤：只包含有数据且 >=2024, <=2027 的年份
  // 注：2026.02期数的forecast版本会覆盖到2027.01，因此需要包含2027
  const availableYears = Array.from(allYears)
    .sort()
    .filter(y => y >= 2024 && y <= 2027);

  return {
    months: months.map(m => m.monthLabel),
    availableYears,  // 返回可选年份列表
    currentYear: effectiveYear,  // 当前展示年份
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
  const currentMonth = month;
  
  // 使用Date对象正确计算前两个月（处理跨年）
  const [year, mon] = month.split('-').map(Number);
  const currentDate = new Date(year, mon - 1, 1);
  
  const prevDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  const prevMonth = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;
  
  const prev2Date = new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 1);
  const prev2Month = `${prev2Date.getFullYear()}-${String(prev2Date.getMonth() + 1).padStart(2, '0')}`;

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

    // 判断连续两期异常：上上期->上期 或 上期->本期 (阈值从20%放宽到15%)
    const isAbnormal = (val) => val !== null && (parseFloat(val) > 15 || parseFloat(val) < -15);
    // 根据数据类型调整金额阈值（qty的数量级比amount小很多）
    const minAmountThreshold = dataType === 'amount' ? 3000 : 30;
    const isAmountValid = (amt) => amt !== null && amt >= minAmountThreshold;

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

// ==================== Opening & ITO Dashboard Services ====================

/**
 * 获取 Opening ITO 看板的筛选选项
 */
export function getOpeningItoFilterOptions() {
  return {
    months: getMockOpeningItoMonthOptions(),
    bus: getMockOpeningItoBuOptions(),
    categories: getMockOpeningItoCategoryOptions(),
  };
}

/**
 * 获取 Opening ITO 指标卡数据
 * @param {Object} query - 查询参数
 * @param {string} query.month - 月份
 * @param {string} query.dataType - 数据类型：'amount' | 'qty'
 * @param {boolean} query.includeRetail - 是否包含商超数据
 */
export function getOpeningItoMetricCards(query) {
  return getMockOpeningItoMetricCards(query);
}

/**
 * 获取 BU-仓位维度表格数据
 * @param {Object} query - 查询参数
 * @param {string} query.month - 月份
 * @param {string} query.dataType - 数据类型：'amount' | 'qty'
 * @param {boolean} query.includeRetail - 是否包含商超数据
 */
export function getOpeningItoBuWarehouseTable(query) {
  return getMockOpeningItoBuWarehouseTable(query);
}

/**
 * 获取 BU-类目维度表格数据
 * @param {Object} query - 查询参数
 * @param {string} query.month - 月份
 * @param {string} query.dataType - 数据类型：'amount' | 'qty'
 * @param {boolean} query.includeRetail - 是否包含商超数据
 */
export function getOpeningItoBuCategoryTable(query) {
  return getMockOpeningItoBuCategoryTable(query);
}

/**
 * 获取饼图数据
 * @param {Object} query - 查询参数
 * @param {string} query.month - 月份
 * @param {string} query.dataType - 数据类型：'amount' | 'qty'
 * @param {string} query.dimension - 维度：'category' | 'bu'
 * @param {boolean} query.includeRetail - 是否包含商超数据
 */
export function getOpeningItoPieData(query) {
  return getMockOpeningItoPieData(query);
}

/**
 * 获取年度趋势数据（2025 vs 2026 对比）
 * @param {Object} query - 查询参数
 * @param {string} query.dataType - 数据类型：'amount' | 'qty'
 * @param {boolean} query.includeRetail - 是否包含商超数据
 */
export function getOpeningItoYearlyTrend(query) {
  return getMockOpeningItoYearlyTrend(query);
}

/**
 * 获取月度趋势数据（本期期初+ITO）
 * @param {Object} query - 查询参数
 * @param {string} query.year - 年份：'2025' | '2026'
 * @param {string} query.dataType - 数据类型：'amount' | 'qty'
 * @param {boolean} query.includeRetail - 是否包含商超数据
 */
export function getOpeningItoMonthlyTrend(query) {
  return getMockOpeningItoMonthlyTrend(query);
}

export function getOpeningItoBuComparison(query) {
  return getMockOpeningItoBuComparison(query);
}

/**
 * 获取类目分析数据
 * @param {Object} query - 查询参数
 * @param {string} query.month - 月份：'2026-03'
 * @param {string} query.dataType - 数据类型：'amount' | 'qty'
 * @param {boolean} query.includeRetail - 是否包含商超数据
 */
export function getCategoryAnalysisData(query) {
  return getMockCategoryAnalysisData(query);
}

export function getCategoryDescriptionTop10(query) {
  return getMockCategoryDescriptionTop10(query);
}

/**
 * 获取 Excess 看板 BU Tabs
 */
export function getExcessTabs() {
  return getMockExcessTabs();
}

/**
 * 获取 Excess 指标卡数据
 * @param {Object} query
 * @param {string} query.bu - 总览 | BU
 * @param {string} query.dataType - amount | qty
 */
export function getExcessMetrics(query) {
  return getMockExcessMetrics(query);
}

/**
 * 获取 Excess 主表数据
 * @param {Object} query
 * @param {string} query.bu - 总览 | BU
 * @param {string} query.dataType - amount | qty
 */
export function getExcessMainTable(query) {
  return getMockExcessMainTable(query);
}

/**
 * 获取 >365 天 TOP10 数据
 * @param {Object} query
 * @param {string} query.bu - 总览 | BU
 * @param {string} query.dataType - amount | qty
 */
export function getExcessAgingTop10(query) {
  return getMockExcessAgingTop10(query);
}

/**
 * 获取库存年龄分布
 * @param {Object} query
 * @param {string} query.bu - 总览 | BU
 * @param {string} query.dataType - amount | qty
 */
export function getExcessInventoryAge(query) {
  return getMockExcessInventoryAge(query);
}

export function getExcessInventoryAgeComparison(query) {
  return getMockExcessInventoryAgeComparison(query);
}

export function getExcessInventoryAgeWarehouseDrilldown(query) {
  return getMockExcessInventoryAgeWarehouseDrilldown(query);
}

/**
 * 获取 Excess 过量分析弹窗数据
 * @param {Object} query
 * @param {string} query.bu - 总览 | BU
 * @param {string} query.dataType - amount | qty
 * @param {string} query.level1 - category | bu
 * @param {string} query.selectedMetric - safe | excess3 | excess6 | excess12
 */
export function getExcessAnalysisData(query) {
  return getMockExcessAnalysisData(query);
}

/**
 * 库龄分析：>365 天按 BU / 类目 / 仓库汇总（全量行，不截断 TOP）
 * @param {Object} query
 * @param {string} query.activeBuTab - 主看板当前 BU Tab
 * @param {string} query.dataType - amount | qty
 * @param {string} query.dimension - bu | category | warehouse
 */
export function getInventoryAgeOver365Analysis(query) {
  return getMockInventoryAgeOver365Analysis(query);
}

/**
 * 库龄分析下钻：类目/仓库 -> 描述 TOP10
 * @param {Object} query
 * @param {string[]} query.bus
 * @param {string} query.dataType - amount | qty
 * @param {string} query.dimension - category | warehouse
 * @param {string} query.dimensionName - 维度值
 */
export function getInventoryAgeOver365DrilldownTop10(query) {
  return getMockInventoryAgeOver365DrilldownTop10(query);
}

/**
 * 留档：保存 Excess 看板快照
 * @param {Object} snapshot
 */
export function createExcessArchive(snapshot) {
  const currentList = storage.get(SUPPLY_CHAIN_EXCESS_ARCHIVES) || [];
  const record = {
    archiveId: `excess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    archiveName: snapshot?.archiveName || `Excess留档 ${new Date().toLocaleString()}`,
    createdAt: new Date().toISOString(),
    ...snapshot,
  };
  const nextList = [record, ...currentList].slice(0, 100);
  storage.set(SUPPLY_CHAIN_EXCESS_ARCHIVES, nextList);
  return record;
}

/**
 * 获取 Excess 留档列表（按时间倒序）
 */
export function getExcessArchives() {
  const list = storage.get(SUPPLY_CHAIN_EXCESS_ARCHIVES) || [];
  return [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

/**
 * 按 ID 获取单条留档
 * @param {string} archiveId
 */
export function getExcessArchiveById(archiveId) {
  const list = getExcessArchives();
  return list.find((item) => item.archiveId === archiveId) || null;
}

/**
 * 获取 Excess TOP10 备注月份选项（最近12个月，含当前月）
 */
export function getExcessTop10MonthOptions() {
  const now = new Date();
  const options = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    options.push({
      value,
      label: `${d.getFullYear()}年${d.getMonth() + 1}月`,
    });
  }
  return options;
}

/**
 * 获取指定月份、指定行的 TOP10 备注
 * @param {Object} query
 * @param {string} query.month - yyyy-MM
 * @param {string[]} query.rowKeys
 */
export function getExcessTop10Notes(query = {}) {
  const { month, rowKeys = [] } = query;
  if (!month || rowKeys.length === 0) return {};
  const all = storage.get(SUPPLY_CHAIN_EXCESS_TOP10_NOTES) || {};
  const monthData = all[month] || {};
  return rowKeys.reduce((acc, rowKey) => {
    acc[rowKey] = monthData[rowKey] || {
      planReason: '',
      actionSuggestion: '',
      operationFeedback: '',
      updatedAt: '',
    };
    return acc;
  }, {});
}

/**
 * 新增/更新指定月份、指定行的 TOP10 备注
 * @param {Object} payload
 * @param {string} payload.month - yyyy-MM
 * @param {string} payload.rowKey
 * @param {Object} payload.patch
 */
export function upsertExcessTop10Note(payload = {}) {
  const { month, rowKey, patch = {} } = payload;
  if (!month || !rowKey) return null;

  const all = storage.get(SUPPLY_CHAIN_EXCESS_TOP10_NOTES) || {};
  const monthData = all[month] || {};
  const previous = monthData[rowKey] || {
    planReason: '',
    actionSuggestion: '',
    operationFeedback: '',
    updatedAt: '',
  };

  const nextRecord = {
    ...previous,
    ...patch,
    updatedAt: new Date().toISOString(),
  };

  const nextAll = {
    ...all,
    [month]: {
      ...monthData,
      [rowKey]: nextRecord,
    },
  };
  storage.set(SUPPLY_CHAIN_EXCESS_TOP10_NOTES, nextAll);
  return nextRecord;
}

// --- 销量预计管理（独立） ---
const SF_STATUS = Object.freeze({
  待下推: '待下推',
  校验中: '校验中',
  已驳回: '已驳回',
  已确认: '已确认',
});

export { SF_STATUS as SALES_FORECAST_BU_STATUS };

/** 安全库存可选天数（与产品规则保持一致） */
export const SAFETY_STOCK_DAY_OPTIONS = Object.freeze([15, 30, 45, 60, 90, 120]);

/** 安全库存层级（与 SKU 产品层级一致） */
export const SAFETY_STOCK_LEVELS = Object.freeze(['A', 'B', 'C', 'D', 'E', 'F']);

/** 月份模式枚举 */
export const SAFETY_STOCK_MONTH_MODES = Object.freeze({
  WHOLE_YEAR: 'whole_year',
  SINGLE: 'single',
  MULTI: 'multi',
});

function sfSummarizePeriodStatuses(statusByBu = {}) {
  const vals = BU_VALUES.map((bu) => statusByBu[bu] || SF_STATUS.待下推);
  const all = (s) => vals.every((v) => v === s);
  const some = (s) => vals.some((v) => v === s);
  if (all(SF_STATUS.已确认)) return '全部已确认';
  if (all(SF_STATUS.待下推)) return '全部待下推';
  if (some(SF_STATUS.已驳回)) return '含驳回';
  if (some(SF_STATUS.已确认)) return '部分确认';
  if (some(SF_STATUS.待下推)) return '含待下推';
  return SF_STATUS.校验中;
}

/** 确保每期、每个固定 BU 都有状态槽位 */
function sfEnsurePeriodBuStatus(store) {
  const periods = sfMergePeriods(store);
  const periodBuStatus = { ...(store.periodBuStatus || {}) };
  let changed = false;
  periods.forEach((p) => {
    if (!periodBuStatus[p.id]) {
      periodBuStatus[p.id] = {};
      changed = true;
    }
    BU_VALUES.forEach((bu) => {
      if (periodBuStatus[p.id][bu] == null || periodBuStatus[p.id][bu] === '') {
        periodBuStatus[p.id][bu] = SF_STATUS.待下推;
        changed = true;
      }
    });
  });
  if (!changed) return store;
  const next = { ...store, periodBuStatus };
  sfSaveStore(next);
  return next;
}

/** 旧数据无存 periodBuStatus 时视为已全部接入，全部为校验中（避免存量演示一片空白） */
function sfMigrateLegacyPeriodBuStatusIfNeeded(store) {
  if (store.periodBuStatus != null && typeof store.periodBuStatus === 'object') return store;
  const periods = sfMergePeriods(store);
  const periodBuStatus = {};
  periods.forEach((p) => {
    periodBuStatus[p.id] = {};
    BU_VALUES.forEach((bu) => {
      periodBuStatus[p.id][bu] = SF_STATUS.校验中;
    });
  });
  const next = { ...store, periodBuStatus };
  sfSaveStore(next);
  return next;
}

function sfGetBuStatus(store, periodId, bu) {
  return store.periodBuStatus?.[periodId]?.[bu] || SF_STATUS.待下推;
}

function sfDefaultStore() {
  const periods = generateDefaultPeriods();
  const periodBuStatus = {};
  periods.forEach((p) => {
    periodBuStatus[p.id] = {};
    BU_VALUES.forEach((bu) => {
      periodBuStatus[p.id][bu] = SF_STATUS.待下推;
    });
  });
  return {
    periods,
    selectedPeriodId: periods[0]?.id || null,
    monthlyOverrides: {},
    deletedRowIds: [],
    extraPeriods: [],
    removedPeriodIds: [],
    operationLogs: [],
    periodBuStatus,
  };
}

function sfLoadStore() {
  let raw = storage.get(SUPPLY_CHAIN_SALES_FORECAST_V1);
  if (!raw || !Array.isArray(raw.periods)) {
    raw = sfDefaultStore();
    storage.set(SUPPLY_CHAIN_SALES_FORECAST_V1, raw);
  }
  if (!Array.isArray(raw.removedPeriodIds)) {
    raw = { ...raw, removedPeriodIds: [] };
    storage.set(SUPPLY_CHAIN_SALES_FORECAST_V1, raw);
  }
  if (!raw.selectedPeriodId && raw.periods[0]) {
    raw.selectedPeriodId = raw.periods[0].id;
    storage.set(SUPPLY_CHAIN_SALES_FORECAST_V1, raw);
  }
  let next = sfMigrateLegacyPeriodBuStatusIfNeeded(raw);
  next = sfEnsurePeriodBuStatus(next);
  return next;
}

function sfSaveStore(next) {
  storage.set(SUPPLY_CHAIN_SALES_FORECAST_V1, next);
}

function sfMergePeriods(store) {
  const byYm = new Map();
  [...store.periods, ...(store.extraPeriods || [])].forEach((p) => {
    if (!p?.forecastYm) return;
    byYm.set(p.forecastYm, p);
  });
  const removed = new Set(store.removedPeriodIds || []);
  return Array.from(byYm.values())
    .filter((p) => !removed.has(p.id))
    .sort((a, b) => (a.forecastYm < b.forecastYm ? 1 : -1));
}

function sfAppendLog(store, entry) {
  const logs = Array.isArray(store.operationLogs) ? [...store.operationLogs] : [];
  logs.unshift({
    id: `sf-log-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    at: new Date().toISOString(),
    ...entry,
  });
  return { ...store, operationLogs: logs.slice(0, 200) };
}

export function getSalesForecastPeriods() {
  const store = sfLoadStore();
  const periods = sfMergePeriods(store);
  const periodBadgeById = {};
  periods.forEach((p) => {
    periodBadgeById[p.id] = sfSummarizePeriodStatuses(store.periodBuStatus[p.id] || {});
  });
  return { periods, selectedPeriodId: store.selectedPeriodId, periodBadgeById };
}

export function setSalesForecastSelectedPeriod(periodId) {
  const store = sfLoadStore();
  sfSaveStore({ ...store, selectedPeriodId: periodId });
}

export function addSalesForecastPeriod(payload) {
  const { forecastYm, creator = 'Kerr' } = payload || {};
  if (!forecastYm || !/^\d{4}-\d{2}$/.test(forecastYm)) return null;
  const store = sfLoadStore();
  const id = `sf-period-${forecastYm}`;
  if (sfMergePeriods(store).some((p) => p.id === id)) {
    return { ok: false, message: '该期数已存在' };
  }
  const period = {
    id,
    forecastYm,
    createdAt: new Date().toISOString(),
    creator,
  };
  const extraPeriods = [...(store.extraPeriods || []), period];
  const periodBuStatus = { ...(store.periodBuStatus || {}) };
  periodBuStatus[id] = {};
  BU_VALUES.forEach((bu) => {
    periodBuStatus[id][bu] = SF_STATUS.待下推;
  });
  let next = {
    ...store,
    extraPeriods,
    selectedPeriodId: id,
    periodBuStatus,
  };
  next = sfAppendLog(next, { action: '新增期数', detail: forecastYm });
  sfSaveStore(next);
  return { ok: true, period };
}

/**
 * 删除指定期数（至少保留 1 个；当前选中被删时自动切到剩余期数）
 */
export function deleteSalesForecastPeriod(periodId) {
  if (!periodId) {
    return { ok: false, message: '未选择要删除的期数' };
  }
  const store = sfLoadStore();
  const periods = sfMergePeriods(store);
  if (periods.length <= 1) {
    return { ok: false, message: '至少保留一个 Forecast 期数' };
  }
  if (!periods.some((p) => p.id === periodId)) {
    return { ok: false, message: '期数不存在或已删除' };
  }

  const removedPeriodIds = [...new Set([...(store.removedPeriodIds || []), periodId])];
  const periodBuStatus = { ...(store.periodBuStatus || {}) };
  delete periodBuStatus[periodId];

  let selectedPeriodId = store.selectedPeriodId;
  if (selectedPeriodId === periodId) {
    const remaining = periods.filter((p) => p.id !== periodId);
    selectedPeriodId = remaining[0]?.id || null;
  }

  let next = { ...store, removedPeriodIds, selectedPeriodId, periodBuStatus };
  next = sfAppendLog(next, { action: '删除期数', detail: periodId });
  sfSaveStore(next);
  return { ok: true };
}

export function refreshSalesForecastData() {
  const fresh = sfDefaultStore();
  const next = sfAppendLog(fresh, { action: '重置演示数据', detail: '期数与 SKU 恢复初始种子' });
  sfSaveStore(next);
  return getSalesForecastPeriods();
}

function sfRowMonthly(store, periodId, anchorYm, rowId) {
  const base = generateMonthlyForRow(anchorYm, rowId);
  const ov = store.monthlyOverrides?.[periodId]?.[rowId] || {};
  const out = { ...base };
  Object.keys(ov).forEach((k) => {
    if (ov[k] !== undefined && ov[k] !== null) out[k] = ov[k];
  });
  return out;
}

export function querySalesForecastRows(query = {}) {
  const store = sfLoadStore();
  const periods = sfMergePeriods(store);
  const period = periods.find((p) => p.id === store.selectedPeriodId) || periods[0];
  if (!period) {
    return {
      monthKeys: [],
      planSuggestMonthKeys: [],
      total: 0,
      rows: [],
      period: null,
      pendingPush: false,
      currentBuStatus: null,
    };
  }
  const anchorYm = period.forecastYm;
  const monthKeys = getForecastMonthKeys(anchorYm, 18);
  const planSuggestMonthKeys = getForecastMonthKeys(anchorYm, 5);

  const {
    buTab = 'all',
    productLevel = '',
    shipAttr = '',
    productAttr = '',
    newOld = '',
    staffName = '',
    skuKeyword = '',
    page = 1,
    pageSize = 20,
  } = query;

  if (buTab && buTab !== 'all') {
    const st = sfGetBuStatus(store, period.id, buTab);
    if (st === SF_STATUS.待下推) {
      return {
        period,
        monthKeys,
        planSuggestMonthKeys,
        total: 0,
        rows: [],
        page: Number(page),
        pageSize: Number(pageSize),
        pendingPush: true,
        currentBuStatus: st,
      };
    }
  }

  let list = generateBaseRows().filter((r) => !(store.deletedRowIds || []).includes(r.id));

  if (!buTab || buTab === 'all') {
    list = list.filter((r) => sfGetBuStatus(store, period.id, r.bu) !== SF_STATUS.待下推);
  } else {
    list = list.filter((r) => r.bu === buTab);
  }
  if (productLevel) {
    list = list.filter((r) => r.productLevel === productLevel);
  }
  if (shipAttr) {
    list = list.filter((r) => r.shipAttr === shipAttr);
  }
  if (productAttr) {
    list = list.filter((r) => r.productAttr === productAttr);
  }
  if (newOld) {
    list = list.filter((r) => r.newOld === newOld);
  }
  if (staffName) {
    list = list.filter((r) => r.staffName === staffName);
  }
  if (skuKeyword && String(skuKeyword).trim()) {
    const kw = String(skuKeyword).trim().toLowerCase();
    list = list.filter((r) => r.sku.toLowerCase().includes(kw));
  }

  const total = list.length;
  const start = (Number(page) - 1) * Number(pageSize);
  const slice = list.slice(start, start + Number(pageSize));

  const rows = slice.map((r) => ({
    ...r,
    monthly: sfRowMonthly(store, period.id, anchorYm, r.id),
    planSuggestQty: generatePlanSuggestForRow(anchorYm, r.id),
  }));

  return {
    period,
    monthKeys,
    planSuggestMonthKeys,
    total,
    rows,
    page: Number(page),
    pageSize: Number(pageSize),
    pendingPush: false,
    currentBuStatus:
      buTab && buTab !== 'all' ? sfGetBuStatus(store, period.id, buTab) : null,
  };
}

export function updateSalesForecastRowMonthly(payload = {}) {
  const { rowId, monthlyPatch = {} } = payload;
  if (!rowId) return null;
  const store = sfLoadStore();
  const periods = sfMergePeriods(store);
  const period = periods.find((p) => p.id === store.selectedPeriodId) || periods[0];
  if (!period) return null;
  const periodId = period.id;
  const anchorYm = period.forecastYm;
  const base = generateMonthlyForRow(anchorYm, rowId);
  const prevOv = store.monthlyOverrides?.[periodId]?.[rowId] || {};
  const merged = { ...base, ...prevOv, ...monthlyPatch };
  const monthlyOverrides = { ...(store.monthlyOverrides || {}) };
  monthlyOverrides[periodId] = { ...(monthlyOverrides[periodId] || {}), [rowId]: merged };
  let next = { ...store, monthlyOverrides };
  next = sfAppendLog(next, { action: '编辑Forecast', detail: rowId });
  sfSaveStore(next);
  return merged;
}

export function deleteSalesForecastRow(rowId) {
  if (!rowId) return false;
  const store = sfLoadStore();
  const deletedRowIds = [...new Set([...(store.deletedRowIds || []), rowId])];
  let next = { ...store, deletedRowIds };
  next = sfAppendLog(next, { action: '删除行', detail: rowId });
  sfSaveStore(next);
  return true;
}

export function batchDeleteSalesForecastRows(rowIds = []) {
  if (!rowIds.length) return false;
  const store = sfLoadStore();
  const deletedRowIds = [...new Set([...(store.deletedRowIds || []), ...rowIds])];
  let next = { ...store, deletedRowIds };
  next = sfAppendLog(next, { action: '批量删除', detail: `${rowIds.length} 条` });
  sfSaveStore(next);
  return true;
}

export function getSalesForecastOperationLogs() {
  const store = sfLoadStore();
  return store.operationLogs || [];
}

export function getSalesForecastFilterOptions() {
  const all = generateBaseRows();
  const uniq = (key) => [...new Set(all.map((r) => r[key]).filter(Boolean))].sort();
  return {
    productLevels: ['A', 'B', 'C', 'D', 'E', 'F'],
    shipAttrs: ['海标', '空标', '空海标'],
    productAttrs: ['春夏款', '冬季款', '全年款', '特殊款'],
    newOlds: uniq('newOld'),
    staffNames: uniq('staffName'),
  };
}

/** 当前期数下各 BU 状态（中文），用于 Tab 角标 */
export function getSalesForecastBuStatusesForPeriod(periodId) {
  const store = sfLoadStore();
  const m = store.periodBuStatus?.[periodId] || {};
  const out = {};
  BU_VALUES.forEach((bu) => {
    out[bu] = m[bu] || SF_STATUS.待下推;
  });
  return out;
}

/** 模拟 BU 下推/上传成功 → 「校验中」（来源：待下推、已驳回） */
export function simulateSalesForecastBuPush(periodId, bu) {
  if (!periodId || !bu || !BU_VALUES.includes(bu)) {
    return { ok: false, message: '参数无效' };
  }
  const store = sfLoadStore();
  const cur = sfGetBuStatus(store, periodId, bu);
  if (cur !== SF_STATUS.待下推 && cur !== SF_STATUS.已驳回) {
    return { ok: false, message: `当前为「${cur}」，无需重复接入` };
  }
  const periodBuStatus = {
    ...store.periodBuStatus,
    [periodId]: { ...store.periodBuStatus?.[periodId], [bu]: SF_STATUS.校验中 },
  };
  let next = { ...store, periodBuStatus };
  next = sfAppendLog(next, { action: 'BU数据接入', detail: `${periodId}｜${bu}` });
  sfSaveStore(next);
  return { ok: true };
}

/** 校验通过 → 「已确认」 */
export function salesForecastVerifyPass(periodId, bu) {
  if (!periodId || !bu || !BU_VALUES.includes(bu)) {
    return { ok: false, message: '参数无效' };
  }
  const store = sfLoadStore();
  const cur = sfGetBuStatus(store, periodId, bu);
  if (cur !== SF_STATUS.校验中) {
    return { ok: false, message: `仅「校验中」可通过，当前为「${cur}」` };
  }
  const periodBuStatus = {
    ...store.periodBuStatus,
    [periodId]: { ...store.periodBuStatus?.[periodId], [bu]: SF_STATUS.已确认 },
  };
  let next = { ...store, periodBuStatus };
  next = sfAppendLog(next, { action: '校验通过', detail: `${periodId}｜${bu}` });
  sfSaveStore(next);
  return { ok: true };
}

/** 校验驳回 → 「已驳回」 */
export function salesForecastVerifyReject(periodId, bu) {
  if (!periodId || !bu || !BU_VALUES.includes(bu)) {
    return { ok: false, message: '参数无效' };
  }
  const store = sfLoadStore();
  const cur = sfGetBuStatus(store, periodId, bu);
  if (cur !== SF_STATUS.校验中) {
    return { ok: false, message: `仅「校验中」可驳回，当前为「${cur}」` };
  }
  const periodBuStatus = {
    ...store.periodBuStatus,
    [periodId]: { ...store.periodBuStatus?.[periodId], [bu]: SF_STATUS.已驳回 },
  };
  let next = { ...store, periodBuStatus };
  next = sfAppendLog(next, { action: '校验驳回', detail: `${periodId}｜${bu}` });
  sfSaveStore(next);
  return { ok: true };
}

// ===== 安全库存逻辑设定（按 期数 + BU 维度持久化） =====

/** 默认空规则 */
function sfEmptySafetyStockRule() {
  return {
    hasSafetyStock: false,
    byLevel: false,
    daysByLevel: { A: null, B: null, C: null, D: null, E: null, F: null },
    monthMode: SAFETY_STOCK_MONTH_MODES.WHOLE_YEAR,
    singleMonths: [],
    multiGroups: [],
    updatedAt: null,
  };
}

/** 当前期数 anchorYm 起始的 12 个月 yyyy-MM 数组（与产品口径一致：自然月 1~12 → 对应当前 Forecast 12 个月窗口） */
export function getSafetyStockForecastMonths(periodId) {
  const store = sfLoadStore();
  const period = sfMergePeriods(store).find((p) => p.id === periodId);
  if (!period) return [];
  return getForecastMonthKeys(period.forecastYm, 12);
}

/** 读取（不存在则返回空模板） */
export function getSalesForecastSafetyStockRule(periodId, bu) {
  if (!periodId || !bu) return sfEmptySafetyStockRule();
  const store = sfLoadStore();
  const v = store.safetyStockRulesByPeriodBu?.[periodId]?.[bu];
  if (!v) return sfEmptySafetyStockRule();
  return { ...sfEmptySafetyStockRule(), ...v };
}

/** SKU 粘贴解析：换行/逗号/空白分隔 → 去重去空 */
export function parsePastedSkus(text) {
  if (!text) return [];
  return Array.from(
    new Set(
      String(text)
        .split(/[\s,，;；]+/)
        .map((s) => s.trim())
        .filter(Boolean),
    ),
  );
}

function sfValidateSafetyStockRule(rule) {
  const errors = [];
  if (!rule.hasSafetyStock) return { ok: true, errors };
  if (rule.byLevel) {
    const empty = SAFETY_STOCK_LEVELS.filter(
      (lv) => !SAFETY_STOCK_DAY_OPTIONS.includes(rule.daysByLevel?.[lv]),
    );
    if (empty.length === SAFETY_STOCK_LEVELS.length) {
      errors.push('请按层级至少配置一个安全库存天数');
    }
  }
  switch (rule.monthMode) {
    case SAFETY_STOCK_MONTH_MODES.WHOLE_YEAR:
      break;
    case SAFETY_STOCK_MONTH_MODES.SINGLE:
      if (!Array.isArray(rule.singleMonths) || rule.singleMonths.length === 0) {
        errors.push('请勾选至少一个特定月份');
      }
      break;
    case SAFETY_STOCK_MONTH_MODES.MULTI:
      if (!Array.isArray(rule.multiGroups) || rule.multiGroups.length === 0) {
        errors.push('请新增至少一组「月份 + SKU」配置');
      } else {
        rule.multiGroups.forEach((g, idx) => {
          if (!g.months?.length) errors.push(`第 ${idx + 1} 组：请勾选月份`);
          if (!g.skus?.length) errors.push(`第 ${idx + 1} 组：请粘贴汇总 SKU`);
        });
      }
      break;
    default:
      errors.push('未知的月份模式');
  }
  return { ok: errors.length === 0, errors };
}

/** 保存（仅当前期数 + 当前 BU），返回 { ok, errors } */
export function saveSalesForecastSafetyStockRule(periodId, bu, rule) {
  if (!periodId || !bu || !BU_VALUES.includes(bu)) {
    return { ok: false, errors: ['参数无效'] };
  }
  const next = { ...sfEmptySafetyStockRule(), ...rule };
  // 互斥保护：选「否」清空深层无意义字段不破坏已存配置由 UI 控制；此处仅按月份模式裁剪
  if (next.monthMode !== SAFETY_STOCK_MONTH_MODES.SINGLE) next.singleMonths = [];
  if (next.monthMode !== SAFETY_STOCK_MONTH_MODES.MULTI) next.multiGroups = [];
  if (!next.byLevel) {
    next.daysByLevel = { A: null, B: null, C: null, D: null, E: null, F: null };
  }
  if (!next.hasSafetyStock) {
    // 「否」时不强制清空；仅置 enabled=false，方便切回再编辑
  }
  const validate = sfValidateSafetyStockRule(next);
  if (!validate.ok) return validate;

  next.updatedAt = new Date().toISOString();
  const store = sfLoadStore();
  const all = { ...(store.safetyStockRulesByPeriodBu || {}) };
  all[periodId] = { ...(all[periodId] || {}), [bu]: next };
  let save = { ...store, safetyStockRulesByPeriodBu: all };
  save = sfAppendLog(save, {
    action: '更新安全库存规则',
    detail: `${periodId}｜${bu}｜${next.hasSafetyStock ? '启用' : '关闭'}`,
  });
  sfSaveStore(save);
  return { ok: true, errors: [] };
}