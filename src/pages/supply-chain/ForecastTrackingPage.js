// src/pages/supply-chain/ForecastTrackingPage.js
// Forecast Tracking - 预测跟踪与执行监控（重构版）

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Download,
  Info,
  Calendar,
  Filter,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
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

// 浮窗组件（图二样式）
const MetricTooltip = ({ data, visible, dataType }) => {
  if (!visible || !data) return null;

  const formatTooltipValue = (val) => {
    if (dataType === 'amount') {
      return `¥${(val / 10000).toFixed(2)}万`;
    }
    return `${(val / 10000).toFixed(2)}万`;
  };

  // 获取日期范围显示
  const getDateRange = (baseMonth) => {
    if (!baseMonth) return '-';
    const [year, month] = baseMonth.split('-');
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);
    return `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')} 至 ${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, '0')}-${String(end.getDate()).padStart(2, '0')}`;
  };

  return (
    <div className="absolute z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-72 mt-2 top-full left-0">
      <div className="space-y-3">
        {/* 本期 */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">本期</span>
          <span className="text-sm font-semibold text-gray-800">
            {formatTooltipValue(data.current.value)}
          </span>
        </div>
        {/* 环比 */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">环比</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-800">{formatTooltipValue(data.mom.baseValue)}</span>
            <span className={`text-sm ${data.mom.rate <= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {data.mom.rate > 0 ? '+' : ''}{data.mom.rate}%
            </span>
          </div>
        </div>
        <div className="text-xs text-gray-400 text-right">
          {getDateRange(data.mom.baseMonth)}
        </div>
        {/* 同比 */}
        <div className="flex justify-between items-center pt-2 border-t">
          <span className="text-sm text-gray-500">同比</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-800">{formatTooltipValue(data.yoy.baseValue)}</span>
            <span className={`text-sm ${data.yoy.rate <= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {data.yoy.rate > 0 ? '+' : ''}{data.yoy.rate}%
            </span>
          </div>
        </div>
        <div className="text-xs text-gray-400 text-right">
          {getDateRange(data.yoy.baseMonth)}
        </div>
      </div>
    </div>
  );
};

// 指标卡组件（图一样式）
const CompactMetricCard = ({ title, value, momRate, yoyRate, dataType, tooltipData }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:border-gray-300 transition-colors relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* 顶部标签 */}
      <div className="text-xs text-gray-500 mb-1">{title}</div>
      {/* 主数值 */}
      <div className="text-xl font-bold text-gray-800 mb-2">
        {dataType === 'amount'
          ? `¥${(value / 10000).toFixed(2)}万`
          : `${(value / 10000).toFixed(2)}万`}
      </div>
      {/* 环比和同比 */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-400">环比</span>
          <span className={momRate <= 0 ? 'text-green-500' : 'text-red-500'}>
            {momRate > 0 ? '+' : ''}{momRate}%
          </span>
        </div>
        {yoyRate !== undefined && yoyRate !== null && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-400">同比</span>
            <span className={yoyRate <= 0 ? 'text-green-500' : 'text-red-500'}>
              {yoyRate > 0 ? '+' : ''}{yoyRate}%
            </span>
          </div>
        )}
      </div>
      {/* 浮窗 */}
      <MetricTooltip data={tooltipData} visible={showTooltip} dataType={dataType} />
    </div>
  );
};

// 偏差率指标卡组件（显示百分比）
const DeviationRateCard = ({ title, rate, momRate, yoyRate, tooltipData }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:border-gray-300 transition-colors relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* 顶部标签 */}
      <div className="text-xs text-gray-500 mb-1">{title}</div>
      {/* 主数值 - 百分比格式 */}
      <div className="text-xl font-bold text-gray-800 mb-2">
        {rate.toFixed(2)}%
      </div>
      {/* 环比和同比 */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-400">环比</span>
          <span className={momRate <= 0 ? 'text-green-500' : 'text-red-500'}>
            {momRate > 0 ? '+' : ''}{momRate}%
          </span>
        </div>
        {yoyRate !== undefined && yoyRate !== null && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-400">同比</span>
            <span className={yoyRate <= 0 ? 'text-green-500' : 'text-red-500'}>
              {yoyRate > 0 ? '+' : ''}{yoyRate}%
            </span>
          </div>
        )}
      </div>
      {/* 浮窗 */}
      <MetricTooltip data={tooltipData} visible={showTooltip} dataType="amount" />
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
const DeviationTrendChart = ({ data, dataType }) => {
  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 11 }}
            tickFormatter={(val) => `${(val / 10000).toFixed(0)}`}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 11 }}
            tickFormatter={(val) => `${val.toFixed(0)}%`}
          />
          <RechartsTooltip
            formatter={(value, name) => {
              if (name === '偏差率') return [`${value}%`, name];
              return [formatValue(value, dataType), name];
            }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="actual"
            stroke={COLORS.success}
            name="实际销售"
            strokeWidth={2}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="forecast"
            stroke={COLORS.primary}
            strokeDasharray="5 5"
            name="预测值"
            strokeWidth={2}
            dot={false}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="deviationRate"
            stroke={COLORS.warning}
            name="偏差率"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// 未来窗口趋势折线图组件（右图 - 受未来三月/六月控制）
const FutureWindowTrendChart = ({ data, dataType }) => {
  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} tickFormatter={(val) => `${(val / 10000).toFixed(0)}`} />
          <RechartsTooltip formatter={(value, name) => [formatValue(value, dataType), name]} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Line
            type="monotone"
            dataKey="previous"
            stroke={COLORS.warning}
            name="上期Forecast"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="current"
            stroke={COLORS.success}
            name="本期Forecast"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// 主组件
export default function ForecastTrackingPage() {
  // 状态管理
  const [activeBu, setActiveBu] = useState('all');
  const [activeView, setActiveView] = useState('overview');
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
  const [loading, setLoading] = useState(false);

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
        months: 12,
        category,
        bu: activeBu,
        dataType,
        targetMonth: month,
      });
      setDeviationTrendData(deviationData);

      // 右图：未来窗口趋势图数据（受未来三月/六月影响）
      const futureWindowData = supplyChainService.getFutureWindowTrend({
        window: futureRange,
        months: 12,
        category,
        bu: activeBu,
        dataType,
        targetMonth: month,
      });
      setFutureWindowTrendData(futureWindowData);

      setLoading(false);
    };

    loadData();
  }, [month, category, activeBu, dataType, pastPeriod, futureRange]);

  // 获取左区域偏差数据（根据P-1/P-3/P-5选择）
  const getPastDeviationData = () => {
    if (!metrics) return { rate: 0, value: 0, forecast: 0, actual: 0 };

    switch (pastPeriod) {
      case 'p3':
        return {
          rate: Math.abs(metrics.p3.deviationRate),
          value: Math.abs(metrics.p3.deviation),
          forecast: metrics.p3.forecast,
          actual: metrics.p3.actual,
          trend: metrics.p3.deviation >= 0 ? 'up' : 'down',
        };
      case 'p5':
        return {
          rate: Math.abs(metrics.p5.deviationRate),
          value: Math.abs(metrics.p5.deviation),
          forecast: metrics.p5.forecast,
          actual: metrics.p5.actual,
          trend: metrics.p5.deviation >= 0 ? 'up' : 'down',
        };
      case 'p1':
      default:
        return {
          rate: Math.abs(metrics.p1.deviationRate),
          value: Math.abs(metrics.p1.deviation),
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
                onViewChange={setActiveView}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 筛选区 */}
      <div className="bg-white border-b px-6 py-3">
        <div className="flex flex-wrap items-center gap-4">
          {/* 金额/数量切换 */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                dataType === 'amount' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'
              }`}
              onClick={() => setDataType('amount')}
            >
              金额
            </button>
            <button
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                dataType === 'quantity' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'
              }`}
              onClick={() => setDataType('quantity')}
            >
              数量
            </button>
          </div>

          {/* 供应链类目 */}
          <div className="relative">
            <select
              className="appearance-none bg-gray-100 border-0 rounded-lg px-4 py-2 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Forecast期数（年月） */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Forecast期数（年月）</span>
            <div className="relative">
              <select
                className="appearance-none bg-gray-100 border-0 rounded-lg px-4 py-2 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              >
                {monthOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

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
                        tooltipData={metrics}
                      />
                      <CompactMetricCard
                        title={`${pastPeriod.toUpperCase()}偏差值`}
                        value={pastData.value}
                        momRate={metrics.mom.rate}
                        yoyRate={metrics.yoy.rate}
                        dataType={dataType}
                        tooltipData={metrics}
                      />
                    </>
                  )}
                </div>

                {/* 底部图表：偏差趋势（受P-1/P-3/P-5影响） */}
                <div>
                  <h3 className="text-xs font-medium text-gray-500 mb-2">
                    偏差趋势（{pastPeriod.toUpperCase()}版本近12期）
                  </h3>
                  <DeviationTrendChart data={deviationTrendData} dataType={dataType} />
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
                      tooltipData={metrics}
                    />
                  )}
                </div>

                {/* 底部图表：未来窗口趋势（受未来三月/六月/十一月影响） */}
                <div>
                  <h3 className="text-xs font-medium text-gray-500 mb-2">
                    未来窗口趋势（
                    {futureRange === 3 ? '三月' : futureRange === 6 ? '六月' : '十一月'}
                    窗口近12期对比）
                  </h3>
                  <FutureWindowTrendChart data={futureWindowTrendData} dataType={dataType} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 数据明细视图 */}
      {activeView === 'detail' && (
        <div className="flex-1 p-6">
          <div className="bg-white rounded-lg border border-dashed border-gray-300 p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="w-8 h-8 text-teal-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">数据明细</h3>
              <p className="text-sm text-gray-500 max-w-md">
                当前BU: {BU_OPTIONS.find(b => b.value === activeBu)?.label}。此视图将展示详细的SKU级别预测与实际销售对比数据，支持筛选、排序和导出。
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
