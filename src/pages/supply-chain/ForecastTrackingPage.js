// src/pages/supply-chain/ForecastTrackingPage.js
// Forecast Tracking - 预测跟踪与执行监控（重构版）

import React, { useState, useEffect, useMemo, useRef, useCallback, useTransition, Suspense } from 'react';
import {
  BarChart3,
  Download,
  Info,
  Calendar,
  Filter,
  Search,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  User,
  FileSpreadsheet,
} from 'lucide-react';
import { toast } from '../../components/ui/Toast';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from 'recharts';
import * as supplyChainService from '../../services/supply-chain';

// 主题色
const COLORS = {
  primary: '#3B82F6',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  purple: '#8B5CF6',
  lastYear: '#9CA3AF',
  currentYear: '#3B82F6',
};
const PIE_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#14B8A6', '#F97316'];

// BU/渠道选项（14个渠道）
const BU_OPTIONS = [
  { value: 'all', label: '整体概况' },
  { value: 'KK Amazon', label: 'KK Amazon' },
  { value: 'KK Shopify', label: 'KK Shopify' },
  { value: 'Tik Tok ACCU', label: 'Tik Tok ACCU' },
  { value: 'Tik Tok SEA', label: 'Tik Tok东南亚' },
  { value: 'China', label: 'China' },
  { value: 'EMEA', label: 'EMEA' },
  { value: 'Outdoor Amazon', label: 'Outdoor Amazon' },
  { value: 'Walmart Online', label: 'Walmart线上' },
  { value: 'Ebay', label: 'Ebay' },
  { value: 'Retail', label: 'Retail' },
  { value: 'Promotion', label: '推广&福利' },
  { value: 'JP Amazon', label: 'JP Amazon' },
  { value: 'Other', label: 'Other' },
];

// 供应链类目选项
const CATEGORY_OPTIONS = [
  { value: 'all', label: '全部类目' },
  { value: 'Reels', label: 'Reels' },
  { value: 'Rods', label: 'Rods' },
  { value: 'Lures', label: 'Lures' },
  { value: 'Hooks', label: 'Hooks' },
  { value: 'Lines', label: 'Lines' },
  { value: 'Accessories', label: 'Accessories' },
];

// 格式化数值
const formatValue = (val, dataType) => {
  if (val === null || val === undefined) return '-';
  if (dataType === 'amount') {
    return `¥${(val / 10000).toFixed(2)}万`;
  }
  return `${(val / 10000).toFixed(2)}万`;
};

const formatTooltipValue = (val, dataType) => {
  if (val === null || val === undefined) return '-';
  if (dataType === 'amount') {
    return `¥${(val / 10000).toFixed(2)}万`;
  }
  return `${(val / 10000).toFixed(2)}万`;
};

const formatRatio = (val) => `${Number(val || 0).toFixed(2)}%`;

// 过去区浮窗：本期 + 环比 + 同比
// - 本期数值：由卡片主指标决定（偏差率卡=百分比、偏差值卡=金额/数量差值）
// - 环比/同比：沿用页面卡片展示的 momRate / yoyRate，并显示对比月份的覆盖日期区间
const PastMetricTooltip = ({
  visible,
  dataType,
  payload,
  mainValue,
  mainKind, // 'rate' | 'value'
}) => {
  if (!visible || !payload) return null;

  const { mom, yoy } = payload;

  const pickBaseAndRate = () => {
    if (mainKind === 'rate') {
      return {
        base: mom.baseValueRate,
        rate: mom.rateRate,
        yBase: yoy.baseValueRate,
        yRate: yoy.rateRate,
      };
    }
    return {
      base: mom.baseValueAbs,
      rate: mom.rateValue,
      yBase: yoy.baseValueAbs,
      yRate: yoy.rateValue,
    };
  };

  const { base, rate, yBase, yRate } = pickBaseAndRate();

  const shiftYm = (ym, deltaMonths) => {
    const [y, m] = ym.split('-').map(Number);
    const d = new Date(y, m - 1 + deltaMonths, 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  };

  const formatDate = (d) => {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  // 过去区：环比/同比行展示的是“对比窗口(3个月)”的覆盖区间
  // - 环比：start = (baseMonth-3个月)的02日；end = (baseMonth-1个月)的月末日
  // - 同比：start = (baseMonth-1个月)的01日；end = (baseMonth+2个月)的01日
  const getMomRangeLine = (baseMonth) => {
    if (!baseMonth) return '-';
    const momEndYm = shiftYm(baseMonth, -1);
    const [ey, em] = momEndYm.split('-').map(Number);
    const endDate = new Date(ey, em, 0); // 月末日

    const momStartYm = shiftYm(baseMonth, -3);
    const [sy, sm] = momStartYm.split('-').map(Number);
    const startDate = new Date(sy, sm - 1, 2);

    return `${formatDate(startDate)} 至 ${formatDate(endDate)}`;
  };

  const getYoYRangeLine = (baseMonth) => {
    if (!baseMonth) return '-';
    const startYm = shiftYm(baseMonth, -1);
    const [sy, sm] = startYm.split('-').map(Number);
    const startDate = new Date(sy, sm - 1, 1);

    const endYm = shiftYm(baseMonth, 2);
    const [ey, em] = endYm.split('-').map(Number);
    const endDate = new Date(ey, em - 1, 1);

    return `${formatDate(startDate)} 至 ${formatDate(endDate)}`;
  };

  const formatMain = () => {
    if (mainKind === 'rate') return `${Number(mainValue).toFixed(2)}%`;
    return formatTooltipValue(mainValue, dataType);
  };

  const formatBase = (v) => {
    if (mainKind === 'rate') return `${Number(v).toFixed(2)}%`;
    return formatTooltipValue(v, dataType);
  };

  return (
    <div className="absolute z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-[560px] max-w-[90vw] mt-2 top-full left-0 overflow-x-auto">
      <div className="space-y-3 min-w-[520px]">
        {/* 本期 */}
        <div className="grid grid-cols-[56px_1fr] items-center gap-4">
          <span className="text-sm text-gray-500">本期</span>
          <span className="text-sm font-semibold text-gray-800 text-left">{formatMain()}</span>
        </div>

        {/* 环比 */}
        <div className="grid grid-cols-[56px_1fr] items-center gap-4 whitespace-nowrap">
          <span className="text-sm text-gray-500">环比</span>
          <div className="flex items-center gap-4 whitespace-nowrap">
            <span className="text-sm font-semibold text-gray-800">{formatBase(base)}</span>
            <span className={`text-sm ${rate <= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {rate > 0 ? '+' : ''}{rate}%
            </span>
            <span className="text-xs text-gray-400">{getMomRangeLine(mom.baseMonth)}</span>
          </div>
        </div>

        {/* 同比 */}
        <div className="grid grid-cols-[56px_1fr] items-center pt-2 border-t border-gray-100 gap-4 whitespace-nowrap">
          <span className="text-sm text-gray-500">同比</span>
          <div className="flex items-center gap-4 whitespace-nowrap">
            <span className="text-sm font-semibold text-gray-800">{formatBase(yBase)}</span>
            <span className={`text-sm ${yRate <= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {yRate > 0 ? '+' : ''}{yRate}%
            </span>
            <span className="text-xs text-gray-400">{getYoYRangeLine(yoy.baseMonth)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// 未来区浮窗：本期 + 环比（无同比）
const FutureMetricTooltip = ({ visible, dataType, payload, mainValue }) => {
  if (!visible || !payload) return null;

  const { months, momRate, previousTotal } = payload;

  const shiftYm = (ym, deltaMonths) => {
    const [y, m] = ym.split('-').map(Number);
    const d = new Date(y, m - 1 + deltaMonths, 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  };

  // 环比对比的是上一期窗口：日期区间使用“上期窗口”月份
  const prevMonths = Array.isArray(months) && months.length > 0
    ? months.map((m) => shiftYm(m, -1))
    : [];

  // 直接用首尾月拼区间：start月起日 ~ end月止日
  let startEndText = '-';
  if (prevMonths.length > 0) {
    const first = prevMonths[0];
    const last = prevMonths[prevMonths.length - 1];
    const [y1, m1] = first.split('-');
    const [y2, m2] = last.split('-');
    const start = new Date(y1, m1 - 1, 1);
    const end = new Date(y2, m2, 0);
    startEndText = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')} 至 ${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, '0')}-${String(end.getDate()).padStart(2, '0')}`;
  }

  return (
    <div className="absolute z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-[560px] max-w-[90vw] mt-2 top-full left-0 overflow-x-auto">
      <div className="space-y-3 min-w-[520px]">
        {/* 本期 */}
        <div className="grid grid-cols-[56px_1fr] items-center gap-4">
          <span className="text-sm text-gray-500">本期</span>
          <span className="text-sm font-semibold text-gray-800 text-left">{formatTooltipValue(mainValue, dataType)}</span>
        </div>

        {/* 环比 */}
        <div className="grid grid-cols-[56px_1fr] items-center pt-2 border-t border-gray-100 gap-4 whitespace-nowrap">
          <span className="text-sm text-gray-500">环比</span>
          <div className="flex items-center gap-4 whitespace-nowrap">
            <span className="text-sm font-semibold text-gray-800">{formatTooltipValue(previousTotal, dataType)}</span>
            <span className={`text-sm ${momRate <= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {momRate > 0 ? '+' : ''}{momRate}%
            </span>
            <span className="text-xs text-gray-400">{startEndText}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// 指标卡组件（图一样式）
const CompactMetricCard = ({
  title,
  value,
  momRate,
  yoyRate,
  dataType,
  signed = false,
  tooltipVariant,
  pastTooltipPayload,
  futureTooltipPayload,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const getDisplayValue = () => {
    if (!signed) {
      return dataType === 'amount'
        ? `¥${(value / 10000).toFixed(2)}万`
        : `${(value / 10000).toFixed(2)}万`;
    }
    const sign = value > 0 ? '+' : value < 0 ? '-' : '';
    const abs = Math.abs(value);
    return dataType === 'amount'
      ? `${sign}¥${(abs / 10000).toFixed(2)}万`
      : `${sign}${(abs / 10000).toFixed(2)}万`;
  };

  const valueClass = signed
    ? value > 0 ? 'text-red-600' : value < 0 ? 'text-green-600' : 'text-gray-800'
    : 'text-gray-800';

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:border-gray-300 transition-colors relative"
    >
      {/* 顶部标签 */}
      <div className="text-xs text-gray-500 mb-1">{title}</div>
      {/* 主数值 */}
      <div className={`text-xl font-bold mb-2 ${valueClass}`}>
        {getDisplayValue()}
      </div>
      {/* 环比和同比 */}
      <div
        className="flex flex-col gap-1"
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div
          className="flex items-center gap-2 text-xs cursor-help"
          onMouseEnter={() => setShowTooltip(true)}
        >
          <span className="text-gray-400">环比</span>
          <span className={momRate <= 0 ? 'text-green-500' : 'text-red-500'}>
            {momRate > 0 ? '+' : ''}{momRate}%
          </span>
        </div>
        {yoyRate !== undefined && yoyRate !== null && (
          <div
            className="flex items-center gap-2 text-xs cursor-help"
            onMouseEnter={() => setShowTooltip(true)}
          >
            <span className="text-gray-400">同比</span>
            <span className={yoyRate <= 0 ? 'text-green-500' : 'text-red-500'}>
              {yoyRate > 0 ? '+' : ''}{yoyRate}%
            </span>
          </div>
        )}
      </div>
      {tooltipVariant === 'past' && (
        <PastMetricTooltip
          visible={showTooltip}
          dataType={dataType}
          payload={pastTooltipPayload}
          mainValue={value}
          mainKind="value"
        />
      )}
      {tooltipVariant === 'future' && (
        <FutureMetricTooltip
          visible={showTooltip}
          dataType={dataType}
          payload={futureTooltipPayload}
          mainValue={value}
        />
      )}
    </div>
  );
};

// 偏差率指标卡组件（显示百分比）
const DeviationRateCard = ({ title, rate, momRate, yoyRate, dataType, pastTooltipPayload }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const rateClass = rate > 0 ? 'text-red-600' : rate < 0 ? 'text-green-600' : 'text-gray-800';

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:border-gray-300 transition-colors relative"
    >
      {/* 顶部标签 */}
      <div className="text-xs text-gray-500 mb-1">{title}</div>
      {/* 主数值 - 百分比格式 */}
      <div className={`text-xl font-bold mb-2 ${rateClass}`}>
        {rate > 0 ? '+' : ''}{rate.toFixed(2)}%
      </div>
      {/* 环比和同比 */}
      <div
        className="flex flex-col gap-1"
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div
          className="flex items-center gap-2 text-xs cursor-help"
          onMouseEnter={() => setShowTooltip(true)}
        >
          <span className="text-gray-400">环比</span>
          <span className={momRate <= 0 ? 'text-green-500' : 'text-red-500'}>
            {momRate > 0 ? '+' : ''}{momRate}%
          </span>
        </div>
        {yoyRate !== undefined && yoyRate !== null && (
          <div
            className="flex items-center gap-2 text-xs cursor-help"
            onMouseEnter={() => setShowTooltip(true)}
          >
            <span className="text-gray-400">同比</span>
            <span className={yoyRate <= 0 ? 'text-green-500' : 'text-red-500'}>
              {yoyRate > 0 ? '+' : ''}{yoyRate}%
            </span>
          </div>
        )}
      </div>
      <PastMetricTooltip
        visible={showTooltip}
        dataType={dataType}
        payload={pastTooltipPayload}
        mainValue={rate}
        mainKind="rate"
      />
    </div>
  );
};

// 带下拉菜单的BU标签组件
const BuTabWithDropdown = ({ option, isActive, activeView, onBuClick, onViewChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // 点击下拉选项时，先切换BU，再切换视图
  const handleViewChange = (view) => {
    onBuClick(option.value); // 先切换到这个BU
    onViewChange(view);      // 再切换视图
    setIsOpen(false);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 标签按钮 */}
      <button
        className={`flex-shrink-0 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
          isActive
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-600 hover:text-gray-800'
        }`}
        onClick={() => onBuClick(option.value)}
      >
        {option.label}
      </button>

      {/* 下拉菜单 - 所有标签hover都显示 */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-0 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1">
          <button
            className={`w-full text-left px-4 py-2 text-sm transition-colors ${
              isActive && activeView === 'overview'
                ? 'bg-teal-50 text-teal-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => handleViewChange('overview')}
          >
            数据概览
          </button>
          <button
            className={`w-full text-left px-4 py-2 text-sm transition-colors ${
              isActive && activeView === 'detail'
                ? 'bg-teal-50 text-teal-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => handleViewChange('detail')}
          >
            数据明细
          </button>
        </div>
      )}
    </div>
  );
};

// 偏差趋势折线图组件（左图 - 受P-1/P-3/P-5控制）
/**
 * 左图：偏差趋势图
 * - X轴：固定显示1月-12月
 * - Y轴：偏差率百分比，默认范围-40%~+40%
 * - 数据系列：当年偏差率、去年偏差率
 * - 数据点标签：显示整数百分比
 */
const DeviationTrendChart = ({ data, period, targetYear }) => {
  const [hiddenSeries, setHiddenSeries] = useState({
    currentYear: false,
    lastYear: false,
  });

  // 动态计算Y轴范围，优先约束在-40%~+40%
  const allValues = data
    .flatMap(d => [d.currentYear, d.lastYear])
    .filter((v) => v !== null && v !== undefined);
  const maxVal = Math.max(...allValues, 40);
  const minVal = Math.min(...allValues, -40);
  const yDomain = [Math.min(minVal, -40), Math.max(maxVal, 40)];

  const handleLegendClick = (entry) => {
    const key = entry?.dataKey;
    if (!key) return;
    setHiddenSeries((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
          <YAxis
            tick={{ fontSize: 11 }}
            tickFormatter={(val) => `${val}%`}
            domain={yDomain}
          />
          <RechartsTooltip
            formatter={(value, name) => [`${value}%`, name]}
          />
          <Legend wrapperStyle={{ fontSize: 11, cursor: 'pointer' }} onClick={handleLegendClick} />
          <Line
            type="monotone"
            dataKey="currentYear"
            stroke={COLORS.currentYear}
            name={`偏差率（Vs ${period.toUpperCase()}）${targetYear}年`}
            strokeWidth={2}
            dot={{ r: 3, fill: COLORS.currentYear }}
            hide={hiddenSeries.currentYear}
          />
          <Line
            type="monotone"
            dataKey="lastYear"
            stroke={COLORS.lastYear}
            name={`偏差率（Vs ${period.toUpperCase()}）${targetYear - 1}年`}
            strokeWidth={2}
            dot={{ r: 3, fill: COLORS.lastYear }}
            hide={hiddenSeries.lastYear}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// 未来窗口趋势折线图组件（右图 - 受未来三月/六月/十一月控制）
/**
 * 右图：增长趋势图
 * - X轴：显示未来窗口内的目标月份（如3月/4月/5月）
 * - Y轴：金额或数量
 * - 数据系列：本期（当前筛选期数版本）、上期（上一期版本）
 */
const FutureWindowTrendChart = ({ data, dataType }) => {
  const [hiddenSeries, setHiddenSeries] = useState({
    current: false,
    previous: false,
  });

  const handleLegendClick = (entry) => {
    const key = entry?.dataKey;
    if (!key) return;
    setHiddenSeries((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} tickFormatter={(val) => `${(val / 10000).toFixed(0)}`} />
          <RechartsTooltip formatter={(value, name) => [formatValue(value, dataType), name]} />
          <Legend wrapperStyle={{ fontSize: 11, cursor: 'pointer' }} onClick={handleLegendClick} />
          <Line
            type="monotone"
            dataKey="current"
            stroke={COLORS.success}
            name="本期"
            strokeWidth={2}
            dot={{ r: 3, fill: COLORS.success }}
            hide={hiddenSeries.current}
          />
          <Line
            type="monotone"
            dataKey="previous"
            stroke={COLORS.warning}
            name="上期"
            strokeWidth={2}
            dot={{ r: 3, fill: COLORS.warning }}
            hide={hiddenSeries.previous}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const CategoryShareCard = ({ title, data, dataType, emptyText }) => {
  const valueLabel = dataType === 'amount' ? '金额' : '数量';

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="text-sm font-medium text-gray-700 mb-3">{title}</div>
        <div className="h-72 flex items-center justify-center text-sm text-gray-400">{emptyText}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="text-sm font-medium text-gray-700 mb-3">{title}</div>
      <div className="grid grid-cols-[240px_1fr] gap-4 items-center min-h-[288px]">
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={48}
                outerRadius={82}
                stroke="#fff"
                strokeWidth={1}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${entry.name}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip
                formatter={(value, name, item) => [
                  `${formatTooltipValue(value, dataType)} (${formatRatio(item?.payload?.ratio)})`,
                  name,
                ]}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>

        <div className="text-xs text-gray-600">
          <div className="grid grid-cols-[1.2fr_1fr_70px] gap-2 pb-2 border-b border-gray-100 font-medium text-gray-500">
            <span>类目</span>
            <span className="text-right">{valueLabel}</span>
            <span className="text-right">占比</span>
          </div>
          <div className="max-h-56 overflow-auto">
            {data.map((item, idx) => (
              <div key={item.name} className="grid grid-cols-[1.2fr_1fr_70px] gap-2 py-2 border-b border-gray-50 last:border-0">
                <span className="flex items-center gap-2 truncate">
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                  />
                  <span className="truncate">{item.name}</span>
                </span>
                <span className="text-right">{formatValue(item.value, dataType)}</span>
                <span className="text-right">{formatRatio(item.ratio)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// 整体趋势混合图组件（柱状图 + 折线图）
const OverallTrendMixedChart = ({ data, dataType, displayYear, onYearChange }) => {
  const [hiddenSeries, setHiddenSeries] = useState({});

  if (!data || !data.chartData || !data.series || data.series.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="text-sm font-medium text-gray-700 mb-3">整体趋势图</div>
        <div className="h-80 flex items-center justify-center text-sm text-gray-400">暂无数据</div>
      </div>
    );
  }

  const { chartData, series } = data;

  // 分离柱状系列和折线系列
  const barSeries = series.filter(s => s.type === 'bar');
  const lineSeries = series.filter(s => s.type === 'line');

  const handleLegendClick = (entry) => {
    const key = entry?.dataKey;
    if (!key) return;
    setHiddenSeries((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // 自定义 Tooltip 格式
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null;

    // 过滤掉隐藏的和值为0/null的数据，只显示有实际数值的series
    const validPayload = payload.filter((entry) => {
      if (hiddenSeries[entry.dataKey]) return false;
      const value = entry.value;
      // 只显示有实际数值的数据（不为0、null、undefined）
      return value !== null && value !== undefined && value !== 0;
    });

    // 如果没有有效数据，显示提示
    if (validPayload.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3">
          <div className="text-sm font-medium text-gray-700 mb-2">{label}</div>
          <div className="text-xs text-gray-400">暂无数据</div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3 max-h-80 overflow-auto">
        <div className="text-sm font-medium text-gray-700 mb-2">{label}</div>
        <div className="space-y-1">
          {validPayload.map((entry, idx) => {
            const value = entry.value;
            const formatted = dataType === 'amount'
              ? `¥${(value / 10000).toFixed(2)}万`
              : `${(value / 10000).toFixed(2)}万`;
            return (
              <div key={idx} className="flex items-center gap-2 text-xs">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-sm"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-gray-600">{entry.name}:</span>
                <span className="font-medium text-gray-800">{formatted}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      {/* 标题栏 + 年份切换器 */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-medium text-gray-700">整体趋势图</div>
        
        {/* Forecast年份 切换器 */}
        {data?.availableYears && data.availableYears.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Forecast年份</span>
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
              {data.availableYears.map((year) => (
                <button
                  key={year}
                  onClick={() => onYearChange(year)}
                  className={`px-2 py-1 text-xs rounded-md transition-colors ${
                    displayYear === year
                      ? 'bg-white text-gray-800 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {year}年
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="monthLabel"
              tick={{ fontSize: 11 }}
            />
            <YAxis
              tick={{ fontSize: 11 }}
              tickFormatter={(val) => `${(val / 10000).toFixed(0)}`}
            />
            <RechartsTooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 11, cursor: 'pointer', paddingTop: 10 }}
              onClick={handleLegendClick}
            />

            {/* Forecast 系列柱状图（18个版本并排） */}
            {barSeries.map((s) => (
              <Bar
                key={s.key}
                dataKey={s.key}
                name={s.name}
                fill={s.color}
                hide={hiddenSeries[s.key]}
                barSize={4}
              />
            ))}

            {/* Actual 系列折线图 */}
            {lineSeries.map((s) => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.name}
                stroke={s.color}
                strokeWidth={2}
                dot={{ r: 3, fill: s.color }}
                hide={hiddenSeries[s.key]}
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ==================== TOP10未达成与类目分析组件 ====================

// 复制数据到剪贴板功能
const copyToClipboard = (data, headers, rows) => {
  const csvRows = [
    headers.join(','),
    ...rows.map(row => row.map(cell => {
      // 处理包含逗号的文本
      const cellStr = String(cell ?? '');
      if (cellStr.includes(',') || cellStr.includes('\n') || cellStr.includes('"')) {
        return `"${cellStr.replace(/"/g, '""')}"`;
      }
      return cellStr;
    }).join(','))
  ];
  const csv = csvRows.join('\n');

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(csv).then(() => {
      // eslint-disable-next-line no-console
      console.log('数据已复制到剪贴板');
    }).catch(err => {
      // eslint-disable-next-line no-console
      console.error('复制失败:', err);
    });
  } else {
    // 降级方案：创建临时textarea
    const textarea = document.createElement('textarea');
    textarea.value = csv;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('复制失败:', e);
    }
    document.body.removeChild(textarea);
  }
};

// TOP10未达成表格组件（集成类目分析弹窗）
const TopUnderperformedSection = ({ data, dataType, matrixData, month }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-medium text-gray-700">TOP10未达成（供应链描述）</div>
        </div>
        <div className="h-40 flex items-center justify-center text-sm text-gray-400">
          暂无数据
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-medium text-gray-700">TOP10未达成（供应链描述）</div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-1.5 bg-teal-50 text-teal-700 text-xs font-medium rounded-md hover:bg-teal-100 transition-colors"
          >
            类目分析
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-2 py-2 text-left font-medium text-gray-600 w-12">排名</th>
                <th className="px-2 py-2 text-left font-medium text-gray-600">BU</th>
                <th className="px-2 py-2 text-left font-medium text-gray-600">类目</th>
                <th className="px-2 py-2 text-left font-medium text-gray-600">描述</th>
                <th className="px-2 py-2 text-right font-medium text-gray-600">
                  {dataType === 'amount' ? '金额' : '数量'}
                </th>
                <th className="px-2 py-2 text-right font-medium text-gray-600">偏差率</th>
                <th className="px-2 py-2 text-right font-medium text-gray-600">占比</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-2 py-1.5 text-center">
                    <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-medium ${
                      item.rank <= 3 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {item.rank}
                    </span>
                  </td>
                  <td className="px-2 py-1.5 text-gray-700">{item.bu}</td>
                  <td className="px-2 py-1.5 text-gray-700">{item.category}</td>
                  <td className="px-2 py-1.5 text-gray-700 truncate max-w-40" title={item.description}>
                    {item.description}
                  </td>
                  <td className="px-2 py-1.5 text-right font-mono text-gray-700">
                    {dataType === 'amount' ? `¥${(item.amount / 10000).toFixed(2)}万` : `${(item.qty / 10000).toFixed(2)}万`}
                  </td>
                  <td className="px-2 py-1.5 text-right">
                    <span className={`font-mono ${Number(item.deviationRate) < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {item.deviationRate}%
                    </span>
                  </td>
                  <td className="px-2 py-1.5 text-right font-mono text-gray-600">{item.share}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CategoryAnalysisModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        matrixData={matrixData}
        dataType={dataType}
      />
    </>
  );
};

// 类目分析矩阵弹窗组件
const CategoryAnalysisModal = ({ isOpen, onClose, matrixData, dataType }) => {
  if (!isOpen || !matrixData) return null;

  const { categories, bus, data, columnTotals, grandTotal, month } = matrixData;

  const formatCellValue = (val) => {
    if (val === 0 || val === null || val === undefined) return '-';
    const formatted = dataType === 'amount' ? `¥${(val / 10000).toFixed(1)}万` : `${(val / 10000).toFixed(1)}万`;
    return formatted;
  };

  // 数据类型标签
  const dataTypeLabel = dataType === 'amount' ? '金额' : '数量';
  // 格式化月份显示 (2025-02 -> 2025.02)
  const formatMonthDisplay = (monthStr) => {
    if (!monthStr) return '';
    return monthStr.replace('-', '.');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* 弹窗头部 */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div>
            <h3 className="text-base font-semibold text-gray-800">
              未达成类目分析 - {dataTypeLabel}（{formatMonthDisplay(month)}）
            </h3>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
          >
            关闭
          </button>
        </div>

        {/* 矩阵表格 */}
        <div className="flex-1 overflow-auto p-4">
          <div className="min-w-max">
            <table className="w-full text-xs border-collapse">
              <thead className="sticky top-0 z-10">
                <tr className="bg-gray-50">
                  <th className="px-2 py-2 text-left font-medium text-gray-600 border border-gray-200 sticky left-0 bg-gray-50 z-20">
                    类目 \\ BU
                  </th>
                  {bus.map(b => (
                    <th key={b} className="px-2 py-2 text-right font-medium text-gray-600 border border-gray-200 min-w-20">
                      {b}
                    </th>
                  ))}
                  <th className="px-2 py-2 text-right font-medium text-gray-600 border border-gray-200 bg-gray-100 sticky right-0 z-20">
                    总计
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat, idx) => (
                  <tr key={cat} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-2 py-1.5 font-medium text-gray-700 border border-gray-200 sticky left-0 bg-inherit z-10">
                      {cat}
                    </td>
                    {bus.map(b => {
                      const val = data[cat]?.[b] || 0;
                      const isNegative = val < 0; // 负值表示超达成
                      const isPositive = val > 0; // 正值表示未达成
                      return (
                        <td
                          key={`${cat}-${b}`}
                          className={`px-2 py-1.5 text-right font-mono border border-gray-200 ${
                            isPositive ? 'bg-blue-50 text-blue-700' : isNegative ? 'bg-orange-50 text-orange-700' : 'text-gray-400'
                          }`}
                        >
                          {formatCellValue(val)}
                        </td>
                      );
                    })}
                    <td className="px-2 py-1.5 text-right font-mono font-medium text-gray-700 border border-gray-200 bg-gray-100 sticky right-0 z-10">
                      {formatCellValue(data[cat]?.total || 0)}
                    </td>
                  </tr>
                ))}
                {/* 总计行 */}
                <tr className="bg-gray-100 font-medium sticky bottom-0 z-10">
                  <td className="px-2 py-2 text-gray-700 border border-gray-200 sticky left-0 bg-gray-100 z-20">
                    总计
                  </td>
                  {bus.map(b => (
                    <td key={b} className="px-2 py-2 text-right font-mono text-gray-700 border border-gray-200">
                      {formatCellValue(columnTotals[b] || 0)}
                    </td>
                  ))}
                  <td className="px-2 py-2 text-right font-mono text-gray-800 border border-gray-200">
                    {formatCellValue(grandTotal)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// 主组件
export default function ForecastTrackingPage() {
  // 状态管理
  const [activeBu, setActiveBu] = useState('all');
  const [activeView, setActiveView] = useState('overview');
  const [isPendingView, startViewTransition] = useTransition(); // 视图切换过渡
  const [dataType, setDataType] = useState('amount');
  const [category, setCategory] = useState('all');
  const [month, setMonth] = useState(supplyChainService.getDefaultMonth());

  // 左区域状态
  const [pastPeriod, setPastPeriod] = useState('p1'); // p1 | p3 | p5

  // 右区域状态
  const [futureRange, setFutureRange] = useState(3); // 3 | 6 | 11

  // 数据状态
  const [metrics, setMetrics] = useState(null);
  const [deviationTrendData, setDeviationTrendData] = useState([]);
  const [futureWindowTrendData, setFutureWindowTrendData] = useState([]);
  const [categoryShareData, setCategoryShareData] = useState({
    previousActual: [],
    currentForecast: [],
    previousMonth: '',
    currentMonth: '',
  });
  const [overallTrendData, setOverallTrendData] = useState(null);
  const [overallDisplayYear, setOverallDisplayYear] = useState(null); // null 表示使用默认（targetYear）

  // TOP10未达成与类目分析数据
  const [topUnderperformedData, setTopUnderperformedData] = useState([]);
  const [categorySummaryData, setCategorySummaryData] = useState([]);
  const [underperformedMatrixData, setUnderperformedMatrixData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Detail 视图状态
  const [detailMatrixData, setDetailMatrixData] = useState(null);
  const [exceptionSummary, setExceptionSummary] = useState(null);
  const [ownerAttribution, setOwnerAttribution] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // 异常归因留言抽屉状态
  const [commentsDrawerOpen, setCommentsDrawerOpen] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);
  // 留言数据存储（mock 内存存储）
  const [ownerComments, setOwnerComments] = useState({});

  // 视图切换处理器（使用 transition 避免卡顿）
  const handleViewChange = useCallback((newView) => {
    if (newView === activeView) return;
    
    startViewTransition(() => {
      setActiveView(newView);
      // 切换视图时重置Detail加载状态
      if (newView === 'detail') {
        setDetailLoading(true);
      }
    });
  }, [activeView, startViewTransition]);

  // Detail 筛选状态
  const [selectedBus, setSelectedBus] = useState(['all']);
  const [selectedCategories, setSelectedCategories] = useState(['all']);
  const [selectedPlanners, setSelectedPlanners] = useState(['all']);
  const [descriptionKeyword, setDescriptionKeyword] = useState('');
  const [summarySkuKeyword, setSummarySkuKeyword] = useState('');

  // 计划人员选项
  const PLANNER_OPTIONS = [
    { value: 'all', label: '全部计划' },
    { value: 'Mina', label: 'Mina' },
    { value: 'Anjony', label: 'Anjony' },
    { value: 'Belly', label: 'Belly' },
    { value: 'Dani', label: 'Dani' },
  ];

  // Detail 分页状态
  const [detailPage, setDetailPage] = useState(1);
  const DETAIL_PAGE_SIZE = 20;

  // 月份选项
  const monthOptions = useMemo(() => supplyChainService.getMonthOptions(), []);

  // 加载数据
  useEffect(() => {
    const loadData = () => {
      setLoading(true);
      const query = { month, category, bu: activeBu, dataType };

      // 指标卡数据
      const metricsData = supplyChainService.getForecastMetrics(query);
      setMetrics(metricsData);

      // 左图：偏差趋势图数据（受P-1/P-3/P-5影响）
      const deviationData = supplyChainService.getDeviationTrend({
        period: pastPeriod,
        category,
        bu: activeBu,
        dataType,
        targetMonth: month,
      });
      setDeviationTrendData(deviationData);

      // 右图：未来窗口趋势图数据（受未来三月/六月/十一月影响）
      const futureWindowData = supplyChainService.getFutureWindowTrend({
        window: futureRange,
        category,
        bu: activeBu,
        dataType,
        targetMonth: month,
      });
      setFutureWindowTrendData(futureWindowData);

      const shareData = supplyChainService.getForecastCategoryShare({
        month,
        category,
        bu: activeBu,
        dataType,
      });
      setCategoryShareData(shareData);

      // 整体趋势图数据
      const overallTrend = supplyChainService.getOverallTrend({
        month,
        category,
        bu: activeBu,
        dataType,
        displayYear: overallDisplayYear, // 传入当前选中年份
      });
      setOverallTrendData(overallTrend);

      // 如果没有指定年份，使用返回的 currentYear 作为默认
      if (!overallDisplayYear && overallTrend.currentYear) {
        setOverallDisplayYear(overallTrend.currentYear);
      }

      // 加载TOP10未达成数据
      const topUnderperformed = supplyChainService.getTopUnderperformed({
        month,
        category,
        bu: activeBu,
        dataType,
      });
      setTopUnderperformedData(topUnderperformed);

      // 加载类目分析汇总数据（用于卡片展示TOP3）
      const categoryAnalysis = supplyChainService.getCategoryAnalysis({
        month,
        bu: activeBu,
        dataType,
      });
      setCategorySummaryData(categoryAnalysis);

      // 加载类目矩阵数据（用于弹窗）
      const matrixData = supplyChainService.getUnderperformedMatrix({
        month,
        category,
        bu: activeBu,
        dataType,
      });
      setUnderperformedMatrixData(matrixData);

      setLoading(false);
    };

    loadData();
  }, [month, category, activeBu, dataType, pastPeriod, futureRange, overallDisplayYear]);

  // 加载 Detail 数据（异步分批加载优化渲染体验）
  useEffect(() => {
    if (activeView !== 'detail') return;

    const loadDetailData = async () => {
      setDetailLoading(true);

      const detailQuery = {
        month,
        selectedBus,
        selectedCategories,
        selectedPlanners,
        descriptionKeyword,
        summarySkuKeyword,
        page: detailPage,
        pageSize: DETAIL_PAGE_SIZE,
      };

      // 分批异步加载 - 优先加载主数据，延迟加载次要数据
      // 批次1: 主明细矩阵数据（最高优先级）
      await new Promise(resolve => setTimeout(resolve, 0));
      const matrixData = supplyChainService.getForecastDetailMatrix(detailQuery);
      setDetailMatrixData(matrixData);

      // 批次2: 异常摘要数据
      await new Promise(resolve => setTimeout(resolve, 10));
      const exceptionData = supplyChainService.getForecastExceptionSummary({
        month,
        selectedBus,
        selectedCategories,
      });
      setExceptionSummary(exceptionData);

      // 批次3: 归因统计数据
      await new Promise(resolve => setTimeout(resolve, 10));
      const attributionData = supplyChainService.getForecastOwnerAttribution({
        month,
        selectedBus,
        selectedCategories,
      });
      setOwnerAttribution(attributionData);

      setDetailLoading(false);
    };

    loadDetailData();
  }, [
    activeView,
    month,
    selectedBus,
    selectedCategories,
    selectedPlanners,
    descriptionKeyword,
    summarySkuKeyword,
    detailPage,
  ]);

  // 获取左区域偏差数据（根据P-1/P-3/P-5选择）
  const getPastDeviationData = () => {
    if (!metrics) return { rate: 0, value: 0, forecast: 0, actual: 0 };

    switch (pastPeriod) {
      case 'p3':
        return {
          rate: Math.abs(metrics.p3.deviationRate),
          value: metrics.p3.deviation,
          forecast: metrics.p3.forecast,
          actual: metrics.p3.actual,
          trend: metrics.p3.deviation >= 0 ? 'up' : 'down',
        };
      case 'p5':
        return {
          rate: Math.abs(metrics.p5.deviationRate),
          value: metrics.p5.deviation,
          forecast: metrics.p5.forecast,
          actual: metrics.p5.actual,
          trend: metrics.p5.deviation >= 0 ? 'up' : 'down',
        };
      case 'p1':
      default:
        return {
          rate: Math.abs(metrics.p1.deviationRate),
          value: metrics.p1.deviation,
          forecast: metrics.p1.forecast,
          actual: metrics.p1.actual,
          trend: metrics.p1.deviation >= 0 ? 'up' : 'down',
        };
    }
  };

  // 获取右区域未来窗口指标
  const getFutureWindowData = () => {
    if (!metrics) return { value: 0, momRate: 0, label: '' };
    if (futureRange === 3) {
      return {
        value: metrics.future3.forecast,
        momRate: metrics.future3MoM.rate,
        label: '未来三月Forecast',
      };
    } else if (futureRange === 6) {
      return {
        value: metrics.future6.forecast,
        momRate: metrics.future6MoM.rate,
        label: '未来六月Forecast',
      };
    } else {
      return {
        value: metrics.future11?.forecast || 0,
        momRate: metrics.future11MoM?.rate || 0,
        label: '未来十一月Forecast',
      };
    }
  };

  const pastData = getPastDeviationData();
  const futureData = getFutureWindowData();
  const selectedYear = useMemo(() => Number((month || '').split('-')[0]) || new Date().getFullYear(), [month]);

  const pastTooltipPayload = useMemo(() => {
    if (!metrics?.tooltipPast) return null;
    const tp = metrics.tooltipPast;
    const period = tp[pastPeriod];
    if (!period) return null;
    return {
      filterMonth: tp.filterMonth,
      mom: period.mom,
      yoy: period.yoy,
      forecast: period.forecast,
      actual: period.actual,
      deviationRate: period.deviationRate,
      versionMonth: period.versionMonth,
    };
  }, [metrics, pastPeriod]);

  const futureTooltipPayload = useMemo(() => {
    if (!metrics?.tooltipFuture) return null;
    return metrics.tooltipFuture[futureRange] ?? null;
  }, [metrics, futureRange]);

  // 渲染加载状态
  if (loading && !metrics) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* 页面标题 */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Forecast Tracking</h1>
            <p className="text-sm text-gray-500 mt-1">预测跟踪与执行监控</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm">
            <Download className="w-4 h-4" />
            导出报表
          </button>
        </div>
      </div>

      {/* BU/渠道标签栏（带下拉菜单） */}
      <div className="bg-white border-b">
        <div className="px-6">
          {/* 移除overflow-x-auto，改用flex-wrap让标签换行，避免下拉菜单被裁剪 */}
          <div className="flex items-center flex-wrap">
            {BU_OPTIONS.map((buOption) => (
              <BuTabWithDropdown
                key={buOption.value}
                option={buOption}
                isActive={activeBu === buOption.value}
                activeView={activeView}
                onBuClick={setActiveBu}
                onViewChange={handleViewChange}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 筛选区 - 仅在概览视图显示 */}
      {activeView === 'overview' && (
        <div className="bg-white border-b px-6 py-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* 金额/数量切换 - 轻量分段器 */}
            <div className="flex items-center bg-gray-50 rounded-md p-0.5 border border-gray-200">
              <button
                className={`px-3 py-1 text-xs font-medium rounded-sm transition-colors ${
                  dataType === 'amount'
                    ? 'bg-white text-gray-800 shadow-sm border border-gray-200'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setDataType('amount')}
              >
                金额
              </button>
              <button
                className={`px-3 py-1 text-xs font-medium rounded-sm transition-colors ${
                  dataType === 'quantity'
                    ? 'bg-white text-gray-800 shadow-sm border border-gray-200'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setDataType('quantity')}
              >
                数量
              </button>
            </div>

            {/* 分隔线 */}
            <div className="w-px h-4 bg-gray-300 mx-1" />

            {/* 供应链类目 - 轻量下拉 */}
            <div className="relative">
              <select
                className="appearance-none bg-white border border-gray-200 rounded-md px-3 py-1.5 pr-8 text-xs text-gray-700 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 hover:border-gray-300 transition-colors h-7"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
            </div>

            {/* Forecast期数（年月） - 轻量下拉 */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Forecast期数（年月）</span>
              <div className="relative">
                <select
                  className="appearance-none bg-white border border-gray-200 rounded-md px-3 py-1.5 pr-8 text-xs text-gray-700 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 hover:border-gray-300 transition-colors h-7"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                >
                  {monthOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 数据概览视图 */}
      {activeView === 'overview' && (
        <div className="flex-1 overflow-auto p-6">
          {/* 左右两栏布局 */}
          <div className="grid grid-cols-2 gap-6">
            {/* 左区域：过去 */}
            <div className="bg-white rounded-lg border border-gray-200">
              {/* 标题栏 */}
              <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">过去</span>
                  <Info className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
                  {['p1', 'p3', 'p5'].map((p) => (
                    <button
                      key={p}
                      className={`px-3 py-1 text-xs rounded-md transition-colors ${
                        pastPeriod === p
                          ? 'bg-white text-gray-800 shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={() => setPastPeriod(p)}
                    >
                      {p.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* 中部指标卡 - 偏差率是百分比，偏差值是金额/数量 */}
              <div className="p-4">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {metrics && (
                    <>
                      <DeviationRateCard
                        title={`${pastPeriod.toUpperCase()}偏差率`}
                        rate={pastData.rate}
                        momRate={metrics.mom.rate}
                        yoyRate={metrics.yoy.rate}
                        dataType={dataType}
                        pastTooltipPayload={pastTooltipPayload}
                      />
                      <CompactMetricCard
                        title={`${pastPeriod.toUpperCase()}偏差值`}
                        value={pastData.value}
                        momRate={metrics.mom.rate}
                        yoyRate={metrics.yoy.rate}
                        dataType={dataType}
                        signed
                        tooltipVariant="past"
                        pastTooltipPayload={pastTooltipPayload}
                      />
                    </>
                  )}
                </div>

                {/* 底部图表：偏差趋势（受P-1/P-3/P-5影响） */}
                <div>
                  <h3 className="text-xs font-medium text-gray-500 mb-2">
                    偏差趋势（1-12月对比）
                  </h3>
                  <DeviationTrendChart data={deviationTrendData} period={pastPeriod} targetYear={selectedYear} />
                </div>
              </div>
            </div>

            {/* 右区域：未来（未来窗口forecast汇总 + 环比） */}
            <div className="bg-white rounded-lg border border-gray-200">
              {/* 标题栏 */}
              <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">未来</span>
                  <Info className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
                  {[
                    { value: 3, label: '未来三月' },
                    { value: 6, label: '未来六月' },
                    { value: 11, label: '未来十一月' },
                  ].map((range) => (
                    <button
                      key={range.value}
                      className={`px-3 py-1 text-xs rounded-md transition-colors ${
                        futureRange === range.value
                          ? 'bg-white text-gray-800 shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={() => setFutureRange(range.value)}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 中部指标卡 - 未来窗口Forecast汇总 + 环比 */}
              <div className="p-4">
                <div className="grid grid-cols-1 gap-3 mb-4">
                  {metrics && (
                    <CompactMetricCard
                      title={futureData.label}
                      value={futureData.value}
                      momRate={futureData.momRate}
                      dataType={dataType}
                      tooltipVariant="future"
                      futureTooltipPayload={futureTooltipPayload}
                    />
                  )}
                </div>

                {/* 底部图表：未来窗口趋势（受未来三月/六月/十一月影响） */}
                <div>
                  <h3 className="text-xs font-medium text-gray-500 mb-2">
                    增长趋势（未来{futureRange}个月对比）
                  </h3>
                  <FutureWindowTrendChart data={futureWindowTrendData} dataType={dataType} />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-6">
            <CategoryShareCard
              title={`上期月份实销占比（${categoryShareData.previousMonth || '-'} actual）`}
              data={categoryShareData.previousActual}
              dataType={dataType}
              emptyText="上期月份暂无可展示数据"
            />
            <CategoryShareCard
              title={`本期Forecast占比（${categoryShareData.currentMonth || '-'} forecast）`}
              data={categoryShareData.currentForecast}
              dataType={dataType}
              emptyText="本期Forecast暂无可展示数据"
            />
          </div>

          {/* 整体趋势图 */}
          <div className="mt-6">
            <OverallTrendMixedChart
              data={overallTrendData}
              dataType={dataType}
              displayYear={overallDisplayYear}
              onYearChange={setOverallDisplayYear}
            />
          </div>

          {/* TOP10未达成与类目分析区域 */}
          <div className="mt-6">
            <TopUnderperformedSection
              data={topUnderperformedData}
              dataType={dataType}
              matrixData={underperformedMatrixData}
              month={month}
            />
          </div>
        </div>
      )}

      {/* 数据明细视图 - 使用 Suspense 和骨架屏优化切换体验 */}
      {activeView === 'detail' && (
        <Suspense fallback={<DetailViewSkeleton />}>
          <DetailView
            dataType={dataType}
            month={month}
            monthOptions={monthOptions}
            selectedBus={selectedBus}
            setSelectedBus={setSelectedBus}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            selectedPlanners={selectedPlanners}
            setSelectedPlanners={setSelectedPlanners}
            plannerOptions={PLANNER_OPTIONS}
            descriptionKeyword={descriptionKeyword}
            setDescriptionKeyword={setDescriptionKeyword}
            summarySkuKeyword={summarySkuKeyword}
            setSummarySkuKeyword={setSummarySkuKeyword}
            detailMatrixData={detailMatrixData}
            exceptionSummary={exceptionSummary}
            ownerAttribution={ownerAttribution}
            detailLoading={detailLoading}
            currentPage={detailPage}
            setCurrentPage={setDetailPage}
            // 异常归因抽屉
            commentsDrawerOpen={commentsDrawerOpen}
            setCommentsDrawerOpen={setCommentsDrawerOpen}
            selectedOwner={selectedOwner}
            setSelectedOwner={setSelectedOwner}
            ownerComments={ownerComments}
            setOwnerComments={setOwnerComments}
          />
        </Suspense>
      )}
    </div>
  );
}

// ==================== Detail View Components ====================

// 多选下拉框组件
const MultiSelectDropdown = ({ label, options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleOptionClick = (optionValue) => {
    if (optionValue === 'all') {
      onChange(['all']);
    } else {
      let newValue;
      if (value.includes(optionValue)) {
        newValue = value.filter((v) => v !== optionValue && v !== 'all');
      } else {
        newValue = [...value.filter((v) => v !== 'all'), optionValue];
      }
      onChange(newValue.length === 0 ? ['all'] : newValue);
    }
  };

  const displayText = value.includes('all')
    ? placeholder
    : value.length === 1
      ? options.find((o) => o.value === value[0])?.label
      : `已选 ${value.length} 项`;

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">{label}</span>
        <button
          onClick={handleToggle}
          className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-md text-xs text-gray-700 hover:border-gray-300 transition-colors min-w-[100px]"
        >
          <span className="truncate">{displayText}</span>
          <ChevronDown className="w-3 h-3 text-gray-400" />
        </button>
      </div>
      {isOpen && (
        <div className="absolute top-full mt-1 left-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 max-h-60 overflow-auto">
          <div
            className={`px-4 py-2 text-xs cursor-pointer ${
              value.includes('all') ? 'bg-teal-50 text-teal-600' : 'hover:bg-gray-50'
            }`}
            onClick={() => handleOptionClick('all')}
          >
            {placeholder}
          </div>
          {options
            .filter((o) => o.value !== 'all')
            .map((option) => (
              <div
                key={option.value}
                className={`px-4 py-2 text-xs cursor-pointer ${
                  value.includes(option.value) ? 'bg-teal-50 text-teal-600' : 'hover:bg-gray-50'
                }`}
                onClick={() => handleOptionClick(option.value)}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 border rounded-sm flex items-center justify-center ${
                      value.includes(option.value)
                        ? 'bg-teal-500 border-teal-500'
                        : 'border-gray-300'
                    }`}
                  >
                    {value.includes(option.value) && (
                      <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  {option.label}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

// 行数据单元格子组件
// 使用React.memo缓存行数据单元格组件，避免不必要的重渲染
const RowDataCells = React.memo(({ row, displayYear, yearMonths, formatNumber, formatPercent, getValueCellStyle }) => {
  // Actual行始终显示对应年份，其他行根据displayYear
  const rowDisplayYear = row.typeCode === 'actual' ? row.year : displayYear;
  const rowData = row.dataByYear?.[rowDisplayYear];
  const rowYearMonths =
    row.typeCode === 'actual'
      ? Array.from({ length: 12 }, (_, i) => ({
          month: `${rowDisplayYear}-${String(i + 1).padStart(2, '0')}`,
          label: `${String(i + 1).padStart(2, '0')}月`,
        }))
      : yearMonths;

  return (
    <>
      {/* 冻结列 - YTD% */}
      <td className="sticky left-[610px] bg-white px-3 py-1.5 text-right border-r border-b border-gray-200">
        {rowData?.ytdRate !== undefined && rowData.ytdRate !== null
          ? `${parseFloat(rowData.ytdRate).toFixed(0)}%`
          : '-'}
      </td>

      {/* 冻结列 - Bias */}
      <td
        className={`sticky left-[670px] bg-white px-3 py-1.5 text-right border-r border-b border-gray-200 ${
          rowData?.bias && parseFloat(rowData.bias) > 0
            ? 'text-red-600'
            : rowData?.bias && parseFloat(rowData.bias) < 0
              ? 'text-green-600'
              : ''
        }`}
      >
        {rowData?.bias !== undefined && rowData.bias !== null ? formatPercent(rowData.bias) : '-'}
      </td>

      {/* 冻结列 - Total */}
      <td className="sticky left-[730px] bg-white px-3 py-1.5 text-right border-r border-b border-gray-200 font-medium">
        {rowData?.total !== undefined && rowData.total !== null ? formatNumber(rowData.total) : '-'}
      </td>

      {/* 月份数值列 */}
      {rowYearMonths.map((col) => (
        <td
          key={col.month}
          className={`px-2 py-1.5 text-right border-r border-b border-gray-200 ${getValueCellStyle(
            row,
            rowData?.monthValues?.[col.month]
          )}`}
        >
          {row.isPercent
            ? formatPercent(rowData?.monthValues?.[col.month])
            : formatNumber(rowData?.monthValues?.[col.month])}
        </td>
      ))}

      {/* 环比列 */}
      {rowYearMonths.map((col) => (
        <td
          key={`mom-${col.month}`}
          className={`px-2 py-1.5 text-right border-r border-b border-gray-200 bg-gray-50/50 ${
            rowData?.monthMoms?.[col.month] && parseFloat(rowData.monthMoms[col.month]) > 0
              ? 'text-red-600'
              : rowData?.monthMoms?.[col.month] && parseFloat(rowData.monthMoms[col.month]) < 0
                ? 'text-green-600'
                : ''
          }`}
        >
          {rowData?.monthMoms?.[col.month] ? formatPercent(rowData.monthMoms[col.month]) : '-'}
        </td>
      ))}
    </>
  );
});

RowDataCells.displayName = 'RowDataCells';

// 明细矩阵表格组件（重构版 + 展开/收缩功能 + 年份切换 + 性能优化）
// DetailView 骨架屏组件
const DetailViewSkeleton = () => (
  <div className="h-full flex flex-col bg-gray-50 animate-pulse">
    {/* 头部骨架 */}
    <div className="bg-white border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-6 w-48 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
        <div className="h-10 w-24 bg-gray-200 rounded"></div>
      </div>
    </div>
    {/* 筛选栏骨架 */}
    <div className="bg-white border-b px-6 py-3">
      <div className="flex gap-3">
        <div className="h-8 w-32 bg-gray-200 rounded"></div>
        <div className="h-8 w-32 bg-gray-200 rounded"></div>
        <div className="h-8 w-32 bg-gray-200 rounded"></div>
      </div>
    </div>
    {/* 表格骨架 */}
    <div className="flex-1 p-4">
      <div className="bg-white rounded-lg border border-gray-200 h-full">
        <div className="h-10 bg-gray-100 border-b"></div>
        <div className="divide-y">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-12 flex items-center px-4 gap-4">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
              <div className="h-4 w-16 bg-gray-200 rounded"></div>
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
              <div className="h-4 w-12 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const DetailMatrixTable = ({ data, displayYear }) => {
  // ========== 所有 Hooks 必须在最顶部，在任何条件判断之前 ==========
  // 展开的SKU列表（默认全部收缩）
  const [expandedSkus, setExpandedSkus] = useState(new Set());
  // 分页状态：默认显示前15条SKU（减少初始渲染负担）
  const [visibleCount, setVisibleCount] = useState(15);

  // 根据 displayYear 生成年份对应的月份列 - 使用useMemo缓存
  const yearMonths = useMemo(() => {
    if (!displayYear) return [];
    return Array.from({ length: 12 }, (_, i) => ({
      month: `${displayYear}-${String(i + 1).padStart(2, '0')}`,
      label: `${String(i + 1).padStart(2, '0')}月`,
    }));
  }, [displayYear]);

  // 数据变化时重置展开状态和可见数量
  useEffect(() => {
    setExpandedSkus(new Set());
    setVisibleCount(15);
  }, [data?.groups?.length, data?.pagination?.page]);

  // 计算派生数据（使用useMemo缓存）
  const groups = data?.groups || [];
  const totalGroups = groups.length;
  const hasMore = visibleCount < totalGroups;

  // 使用useMemo缓存可见的groups，避免每次渲染都计算
  const visibleGroups = useMemo(() => {
    return groups.slice(0, visibleCount);
  }, [groups, visibleCount]);

  // 切换SKU展开/收缩状态 - 使用useCallback缓存函数引用
  const toggleSku = useCallback((skuKey) => {
    setExpandedSkus(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(skuKey)) {
        newExpanded.delete(skuKey);
      } else {
        newExpanded.add(skuKey);
      }
      return newExpanded;
    });
  }, []);

  // 全部展开 - 只展开可见的SKU，避免一次性展开过多导致卡顿
  const expandAll = useCallback(() => {
    const visibleKeys = visibleGroups.map((g) => `${g.bu}-${g.sku}`);
    setExpandedSkus(new Set(visibleKeys));
  }, [visibleGroups]);

  // 全部收缩
  const collapseAll = useCallback(() => {
    setExpandedSkus(new Set());
  }, []);

  // 加载更多（每次加载15条）
  const loadMore = useCallback(() => {
    setVisibleCount(prev => Math.min(prev + 15, totalGroups));
  }, [totalGroups]);

  // 格式化数值 - 使用useCallback缓存
  const formatNumber = useCallback((val) => {
    if (val === null || val === undefined || val === '') return '-';
    const num = parseFloat(val);
    if (Math.abs(num) >= 10000) {
      return `${(num / 10000).toFixed(1)}万`;
    }
    return `${Math.round(num)}`;
  }, []);

  // 格式化百分比 - 使用useCallback缓存
  const formatPercent = useCallback((val) => {
    if (val === null || val === undefined || val === '') return '-';
    const num = parseFloat(val);
    return `${num > 0 ? '+' : ''}${num.toFixed(1)}%`;
  }, []);

  // 根据类型获取行样式 - 使用useMemo缓存样式映射
  const typeStyleMap = useMemo(() => ({
    budget: 'text-gray-800 font-medium',
    forecast: 'text-blue-600',
    actual: 'text-green-600',
    error: 'text-orange-600',
    achievement: 'text-purple-600 font-medium',
  }), []);

  const getTypeStyle = useCallback((typeCode) => {
    return typeStyleMap[typeCode] || 'text-gray-700';
  }, [typeStyleMap]);

  // 获取数值单元格样式（高亮异常值）- 使用useCallback缓存
  const getValueCellStyle = useCallback((row, val) => {
    if (row.typeCode === 'error' && val) {
      const num = parseFloat(val);
      if (num > 20) return 'text-orange-600 font-medium bg-orange-50';
      if (num < -20) return 'text-blue-600 font-medium bg-blue-50';
    }
    return '';
  }, []);

  // ========== 条件渲染必须在所有 Hooks 之后 ==========
  if (!data || !data.groups || data.groups.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-dashed border-gray-300 p-12">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
            <BarChart3 className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500">暂无数据，请调整筛选条件</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* 批量控制按钮 */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">展开控制：</span>
          <button
            onClick={expandAll}
            className="px-2 py-1 text-xs bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
          >
            全部展开
          </button>
          <button
            onClick={collapseAll}
            className="px-2 py-1 text-xs bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
          >
            全部收缩
          </button>
          <span className="text-xs text-gray-400 ml-2">
            已展开 {expandedSkus.size} / {visibleGroups.length} 个SKU (共{totalGroups}条)
          </span>
        </div>
        {hasMore && (
          <button
            onClick={loadMore}
            className="px-3 py-1 text-xs bg-teal-50 text-teal-700 border border-teal-200 rounded hover:bg-teal-100 transition-colors"
          >
            加载更多 ({visibleCount}/{totalGroups})
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <table className="min-w-full text-xs">
            {/* 表头 */}
            <thead className="bg-gray-50 sticky top-0 z-20">
              <tr>
                {/* 冻结列 */}
                <th className="sticky left-0 bg-gray-50 px-3 py-2 text-left font-medium text-gray-700 border-r border-b border-gray-200 min-w-[140px] z-30">
                  汇总SKU
                </th>
                <th className="sticky left-[140px] bg-gray-50 px-3 py-2 text-left font-medium text-gray-700 border-r border-b border-gray-200 min-w-[150px] z-30">
                  供应链类目&备注
                </th>
                <th className="sticky left-[290px] bg-gray-50 px-3 py-2 text-left font-medium text-gray-700 border-r border-b border-gray-200 min-w-[100px] z-30">
                  计划/供应商
                </th>
                <th className="sticky left-[390px] bg-gray-50 px-3 py-2 text-left font-medium text-gray-700 border-r border-b border-gray-200 min-w-[80px] z-30">
                  BU
                </th>
                <th className="sticky left-[470px] bg-gray-50 px-3 py-2 text-left font-medium text-gray-700 border-r border-b border-gray-200 min-w-[140px] z-30">
                  Type
                </th>
                <th className="sticky left-[610px] bg-gray-50 px-3 py-2 text-right font-medium text-gray-700 border-r border-b border-gray-200 min-w-[60px] z-30">
                  YTD%
                </th>
                <th className="sticky left-[670px] bg-gray-50 px-3 py-2 text-right font-medium text-gray-700 border-r border-b border-gray-200 min-w-[60px] z-30">
                  Bias
                </th>
                <th className="sticky left-[730px] bg-gray-50 px-3 py-2 text-right font-medium text-gray-700 border-r border-b border-gray-200 min-w-[80px] z-30">
                  Total
                </th>

                {/* 月份列 - 根据 displayYear */}
                {yearMonths.map((col) => (
                  <th
                    key={col.month}
                    className="px-2 py-2 text-center font-medium text-gray-700 border-r border-b border-gray-200 min-w-[65px] bg-gray-50"
                  >
                    {col.label}
                  </th>
                ))}

                {/* 环比列 - 根据 displayYear */}
                {yearMonths.map((col) => (
                  <th
                    key={`mom-${col.month}`}
                    className="px-2 py-2 text-center font-medium text-gray-700 border-r border-b border-gray-200 min-w-[65px] bg-gray-100"
                  >
                    {col.label}环比
                  </th>
                ))}
              </tr>
            </thead>

            {/* 表体 */}
            <tbody>
              {visibleGroups.map((group) => {
                const skuKey = `${group.bu}-${group.sku}`;
                const isExpanded = expandedSkus.has(skuKey);
                // 收缩时只显示第一行（Budget Plan）
                const visibleRows = isExpanded ? group.rows : [group.rows[0]];

                return (
                  <React.Fragment key={skuKey}>
                    {visibleRows.map((row, rowIdx) => {
                      const isFirstRow = rowIdx === 0;
                      const typeStyle = getTypeStyle(row.typeCode);

                      return (
                        <tr key={`${group.sku}-${row.type}`} className="hover:bg-gray-50">
                          {/* 冻结列 - 汇总SKU（首行显示，带展开按钮） */}
                          <td
                            className={`sticky left-0 bg-white px-3 py-1.5 text-left border-r border-b border-gray-200 ${
                              isFirstRow ? 'font-medium text-gray-900' : ''
                            }`}
                          >
                            {isFirstRow ? (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => toggleSku(skuKey)}
                                  className="p-0.5 hover:bg-gray-100 rounded transition-colors"
                                >
                                  {isExpanded ? (
                                    <ChevronDown className="w-4 h-4 text-gray-500" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4 text-gray-500" />
                                  )}
                                </button>
                                <span>{group.sku}</span>
                                {!isExpanded && (
                                  <span className="text-xs text-gray-400">({group.rows.length}行)</span>
                                )}
                              </div>
                            ) : (
                              ''
                            )}
                          </td>

                          {/* 冻结列 - 供应链类目&备注 */}
                          <td
                            className={`sticky left-[140px] bg-white px-3 py-1.5 text-left border-r border-b border-gray-200`}
                          >
                            {isFirstRow ? (
                              <div>
                                <div className="font-medium text-gray-700">{group.category}</div>
                                <div className="text-gray-500 text-[10px] truncate max-w-[130px]">{group.description}</div>
                              </div>
                            ) : (
                              ''
                            )}
                          </td>

                          {/* 冻结列 - 计划/供应商 */}
                          <td
                            className={`sticky left-[290px] bg-white px-3 py-1.5 text-left border-r border-b border-gray-200`}
                          >
                            {isFirstRow ? (
                              <div>
                                <div className="font-medium text-gray-800">{group.planner}</div>
                                <div className="text-gray-500 text-[10px]">{group.supplier}</div>
                              </div>
                            ) : (
                              ''
                            )}
                          </td>

                          {/* 冻结列 - BU */}
                          <td
                            className={`sticky left-[390px] bg-white px-3 py-1.5 text-left border-r border-b border-gray-200`}
                          >
                            {isFirstRow ? group.bu : ''}
                          </td>

                          {/* 冻结列 - Type */}
                          <td
                            className={`sticky left-[470px] bg-white px-3 py-1.5 text-left border-r border-b border-gray-200 ${typeStyle}`}
                          >
                            {row.type}
                          </td>

                          {/* 计算当前行应该展示的年份数据 */}
                          {/* Actual行：始终显示对应年份(2024/2025/2026)；其他行：根据displayYear */}
                          <RowDataCells row={row} displayYear={displayYear} yearMonths={yearMonths} formatNumber={formatNumber} formatPercent={formatPercent} getValueCellStyle={getValueCellStyle} />
                        </tr>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 异常波动摘要区组件
const ExceptionSummarySection = ({ data }) => {
  if (!data || !data.list || data.list.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-sm font-medium text-gray-800 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-orange-500" />
          异常波动摘要
        </h3>
        <p className="text-sm text-gray-500 text-center py-8">当前筛选条件下暂无异常波动数据</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-medium text-gray-800 mb-4 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-orange-500" />
        异常波动摘要
        <span className="text-xs text-gray-400 font-normal">（连续两期达成率偏差超过±20%且金额≥3000）</span>
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-xs">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">BU</th>
              <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">类目</th>
              <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">描述</th>
              <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">SKU</th>
              <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">上上期偏差</th>
              <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">上期偏差</th>
              <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">本期偏差</th>
              <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">责任人</th>
              <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">异常原因</th>
            </tr>
          </thead>
          <tbody>
            {data.list.slice(0, 10).map((item) => (
              <tr key={`${item.bu}-${item.sku}`} className="hover:bg-gray-50">
                <td className="px-3 py-2 text-gray-700 border-b">{item.bu}</td>
                <td className="px-3 py-2 text-gray-600 border-b">{item.category}</td>
                <td className="px-3 py-2 text-gray-700 border-b max-w-[150px] truncate" title={item.description}>{item.description}</td>
                <td className="px-3 py-2 text-gray-900 font-medium border-b">{item.sku}</td>
                <td
                  className={`px-3 py-2 border-b ${
                    item.previous2 !== null ? (parseFloat(item.previous2) > 20 || parseFloat(item.previous2) < -20 ? 'text-orange-600 font-medium' : 'text-gray-700') : 'text-gray-400'
                  }`}
                >
                  {item.previous2 !== null ? `${parseFloat(item.previous2) > 0 ? '+' : ''}${item.previous2}%` : '-'}
                </td>
                <td
                  className={`px-3 py-2 border-b ${
                    item.previous1 !== null ? (parseFloat(item.previous1) > 20 || parseFloat(item.previous1) < -20 ? 'text-orange-600 font-medium' : 'text-gray-700') : 'text-gray-400'
                  }`}
                >
                  {item.previous1 !== null ? `${parseFloat(item.previous1) > 0 ? '+' : ''}${item.previous1}%` : '-'}
                </td>
                <td
                  className={`px-3 py-2 border-b ${
                    item.current !== null ? (parseFloat(item.current) > 20 || parseFloat(item.current) < -20 ? 'text-orange-600 font-medium' : 'text-gray-700') : 'text-gray-400'
                  }`}
                >
                  {item.current !== null ? `${parseFloat(item.current) > 0 ? '+' : ''}${item.current}%` : '-'}
                </td>
                <td className="px-3 py-2 text-gray-700 border-b">{item.owner}</td>
                <td className="px-3 py-2 text-gray-600 border-b">{item.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {data.list.length > 10 && (
          <p className="text-xs text-gray-400 text-center py-2">还有 {data.list.length - 10} 条异常记录...</p>
        )}
      </div>
    </div>
  );
};

// 归因统计卡组件
const OwnerAttributionCards = ({ data, onOwnerClick }) => {
  if (!data || !data.ownerStats) return null;

  const colors = {
    Mina: 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100 cursor-pointer',
    Anjony: 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 cursor-pointer',
    Belly: 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100 cursor-pointer',
    Dani: 'bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100 cursor-pointer',
  };

  return (
    <div className="grid grid-cols-4 gap-3">
      {data.ownerStats.map((owner) => (
        <div
          key={owner.name}
          onClick={() => onOwnerClick?.(owner)}
          className={`rounded-lg border p-3 transition-colors ${colors[owner.name] || 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 cursor-pointer'}`}
        >
          <div className="flex items-center gap-2 mb-2">
            <User className="w-4 h-4" />
            <span className="font-medium">{owner.name}</span>
          </div>
          <div className="text-2xl font-bold">{owner.count}</div>
          <div className="text-xs opacity-75">异常数量</div>
        </div>
      ))}
    </div>
  );
};

// 异常归因留言抽屉组件
const OwnerCommentsDrawer = ({ isOpen, onClose, owner, exceptionData, comments, onUpdateComment, currentMonth }) => {
  const [editingComment, setEditingComment] = useState('');
  const [selectedSku, setSelectedSku] = useState(null);

  // 获取当前 Owner 的所有异常 SKU
  const ownerExceptions = useMemo(() => {
    if (!owner || !exceptionData || !exceptionData.list) return [];
    return exceptionData.list.filter(item => item.owner === owner.name);
  }, [owner, exceptionData]);

  // 获取上月的异常数据（用于带出借注）
  const getPreviousMonthComment = (sku) => {
    const prevMonth = supplyChainService.getPreviousMonth(currentMonth);
    const key = `${sku}_${prevMonth}_${owner?.name}`;
    return comments[key] || '';
  };

  // 获取当前评论
  const getCurrentComment = (sku) => {
    const key = `${sku}_${currentMonth}_${owner?.name}`;
    return comments[key] || '';
  };

  // 开始编辑
  const startEdit = (sku, item) => {
    setSelectedSku(sku);
    const existingComment = getCurrentComment(sku);
    // 如果没有当前评论，尝试带出借注
    if (!existingComment) {
      const prevComment = getPreviousMonthComment(sku);
      setEditingComment(prevComment || '');
    } else {
      setEditingComment(existingComment);
    }
  };

  // 保存评论
  const saveComment = () => {
    if (!selectedSku || !owner) return;
    const key = `${selectedSku}_${currentMonth}_${owner.name}`;
    onUpdateComment(prev => ({
      ...prev,
      [key]: editingComment
    }));
    setSelectedSku(null);
    setEditingComment('');
  };

  // 取消编辑
  const cancelEdit = () => {
    setSelectedSku(null);
    setEditingComment('');
  };

  if (!isOpen || !owner) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* 遮罩层 */}
      <div 
        className="absolute inset-0 bg-black/20 transition-opacity" 
        onClick={onClose}
      />
      
      {/* 抽屉 */}
      <div className="relative w-[600px] h-full bg-white shadow-xl flex flex-col animate-slide-in-right">
        {/* 头部 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{owner.name} 的异常SKU留言管理</h3>
            <p className="text-sm text-gray-500 mt-1">共 {owner.count} 条异常记录</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 内容区 */}
        <div className="flex-1 overflow-auto p-4">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-3 py-3 text-left font-medium text-gray-700 border-b">BU</th>
                <th className="px-3 py-3 text-left font-medium text-gray-700 border-b">类目</th>
                <th className="px-3 py-3 text-left font-medium text-gray-700 border-b">描述</th>
                <th className="px-3 py-3 text-left font-medium text-gray-700 border-b">汇总SKU</th>
                <th className="px-3 py-3 text-left font-medium text-gray-700 border-b">留言备注</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ownerExceptions.map((item) => {
                const currentComment = getCurrentComment(item.sku);
                const prevComment = getPreviousMonthComment(item.sku);
                const isEditing = selectedSku === item.sku;
                const hasInherited = !currentComment && prevComment;

                return (
                  <tr key={item.sku} className="hover:bg-gray-50">
                    <td className="px-3 py-3 text-gray-700">{item.bu}</td>
                    <td className="px-3 py-3 text-gray-600">{item.category}</td>
                    <td className="px-3 py-3 text-gray-700 max-w-[120px] truncate" title={item.description}>
                      {item.description}
                    </td>
                    <td className="px-3 py-3 text-gray-900 font-medium">{item.sku}</td>
                    <td className="px-3 py-3">
                      {isEditing ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editingComment}
                            onChange={(e) => setEditingComment(e.target.value)}
                            placeholder={hasInherited ? "（继承自上期备注）" : "输入留言..."}
                            className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                            autoFocus
                          />
                          <button
                            onClick={saveComment}
                            className="px-2 py-1 bg-teal-600 text-white text-xs rounded hover:bg-teal-700"
                          >
                            保存
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300"
                          >
                            取消
                          </button>
                        </div>
                      ) : (
                        <div 
                          onClick={() => startEdit(item.sku, item)}
                          className="cursor-pointer group"
                        >
                          {currentComment ? (
                            <span className="text-gray-700">{currentComment}</span>
                          ) : hasInherited ? (
                            <span className="text-gray-400 italic">{prevComment} <span className="text-xs text-orange-500">（上期）</span></span>
                          ) : (
                            <span className="text-gray-400 italic group-hover:text-teal-600">点击添加留言...</span>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Detail View 主组件
const DetailView = ({
  dataType,
  month,
  monthOptions,
  selectedBus,
  setSelectedBus,
  selectedCategories,
  setSelectedCategories,
  selectedPlanners,
  setSelectedPlanners,
  plannerOptions,
  descriptionKeyword,
  setDescriptionKeyword,
  summarySkuKeyword,
  setSummarySkuKeyword,
  detailMatrixData,
  exceptionSummary,
  ownerAttribution,
  detailLoading,
  currentPage,
  setCurrentPage,
  // 异常归因抽屉相关
  commentsDrawerOpen,
  setCommentsDrawerOpen,
  selectedOwner,
  setSelectedOwner,
  ownerComments,
  setOwnerComments,
}) => {
  // 导出Excel功能（mock）
  const handleExportExcel = () => {
    toast.info('导出 Excel：演示模式将导出当前筛选条件下的明细数据');
  };

  // 分页处理
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (detailMatrixData?.totalPages || 1)) {
      setCurrentPage(newPage);
    }
  };

  // 年份切换
  const [displayYear, setDisplayYear] = useState(detailMatrixData?.defaultYear || 2026);

  // 当数据加载时更新默认年份
  useEffect(() => {
    if (detailMatrixData?.defaultYear) {
      setDisplayYear(detailMatrixData.defaultYear);
    }
  }, [detailMatrixData?.defaultYear]);

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="space-y-4">
        {/* Detail 筛选栏 */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* BU多选 */}
            <MultiSelectDropdown
              label="BU"
              options={BU_OPTIONS}
              value={selectedBus}
              onChange={(val) => {
                setSelectedBus(val);
                setCurrentPage(1); // 重置到第一页
              }}
              placeholder="全部BU"
            />

            {/* Category多选 */}
            <MultiSelectDropdown
              label="类目"
              options={CATEGORY_OPTIONS}
              value={selectedCategories}
              onChange={(val) => {
                setSelectedCategories(val);
                setCurrentPage(1);
              }}
              placeholder="全部类目"
            />

            {/* 计划人员多选 */}
            <MultiSelectDropdown
              label="计划"
              options={plannerOptions}
              value={selectedPlanners}
              onChange={(val) => {
                setSelectedPlanners(val);
                setCurrentPage(1);
              }}
              placeholder="全部计划"
            />

            {/* Description模糊搜索 */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Description</span>
              <div className="relative">
                <input
                  type="text"
                  value={descriptionKeyword}
                  onChange={(e) => {
                    setDescriptionKeyword(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="模糊搜索..."
                  className="w-32 px-3 py-1.5 pr-7 bg-white border border-gray-200 rounded-md text-xs text-gray-700 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
                />
                <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
              </div>
            </div>

            {/* 汇总SKU精确搜索 */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">汇总SKU</span>
              <div className="relative">
                <input
                  type="text"
                  value={summarySkuKeyword}
                  onChange={(e) => {
                    setSummarySkuKeyword(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="精确匹配..."
                  className="w-32 px-3 py-1.5 pr-7 bg-white border border-gray-200 rounded-md text-xs text-gray-700 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
                />
                <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
              </div>
            </div>

            {/* 导出按钮 */}
            <div className="flex-1" />
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 text-white rounded-md text-xs hover:bg-teal-700 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              导出Excel
            </button>
          </div>
        </div>

        {/* 主明细矩阵表格 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-800">
              明细矩阵数据
              {detailMatrixData && (
                <span className="text-xs text-gray-400 ml-2">
                  共 {detailMatrixData.totalCount} 个SKU × 26行 = {detailMatrixData.totalCount * 26} 行数据
                  {detailMatrixData.targetYear && ` (${detailMatrixData.targetYear}年)`}
                </span>
              )}
            </h3>

            {/* 年份切换器 - 移至表格标题右侧 */}
            {detailMatrixData?.availableYears && detailMatrixData.availableYears.length > 1 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">年份</span>
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
                  {detailMatrixData.availableYears.map((year) => (
                    <button
                      key={year}
                      onClick={() => setDisplayYear(year)}
                      className={`px-2 py-1 text-xs rounded-md transition-colors ${
                        displayYear === year
                          ? 'bg-white text-gray-800 shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {year}年
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          {detailLoading ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <div className="text-sm text-gray-500">加载中...</div>
            </div>
          ) : (
            <DetailMatrixTable data={detailMatrixData} displayYear={displayYear} />
          )}
        </div>

        {/* 分页控件 */}
        {detailMatrixData && detailMatrixData.totalPages > 1 && (
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                显示第 {((detailMatrixData.currentPage - 1) * detailMatrixData.pageSize) + 1} - {Math.min(detailMatrixData.currentPage * detailMatrixData.pageSize, detailMatrixData.totalCount)} 条，
                共 {detailMatrixData.totalCount} 条
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="px-3 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  上一页
                </button>
                <span className="text-xs text-gray-600">
                  {currentPage} / {detailMatrixData.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= detailMatrixData.totalPages}
                  className="px-3 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  下一页
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 归因统计卡 */}
        {ownerAttribution && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-medium text-gray-800 mb-3">异常归因统计</h3>
            <OwnerAttributionCards 
              data={ownerAttribution} 
              onOwnerClick={(owner) => {
                setSelectedOwner(owner);
                setCommentsDrawerOpen(true);
              }}
            />
          </div>
        )}

        {/* 异常波动摘要区 */}
        {exceptionSummary && (
          <ExceptionSummarySection data={exceptionSummary} />
        )}
      </div>

      {/* 异常归因留言抽屉 */}
      <OwnerCommentsDrawer
        isOpen={commentsDrawerOpen}
        onClose={() => setCommentsDrawerOpen(false)}
        owner={selectedOwner}
        exceptionData={exceptionSummary}
        comments={ownerComments}
        onUpdateComment={setOwnerComments}
        currentMonth={month}
      />
    </div>
  );
};
