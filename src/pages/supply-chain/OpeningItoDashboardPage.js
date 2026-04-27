// src/pages/supply-chain/OpeningItoDashboardPage.js
// 期初&ITO各BU看板 - Opening Inventory & ITO Dashboard

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  BarChart3,
  Download,
  Calendar,
  Filter,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  X,
} from 'lucide-react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import * as supplyChainService from '../../services/supply-chain';
import cn from '../../utils/cn';

// 主题色
const COLORS = {
  primary: '#3B82F6',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  purple: '#8B5CF6',
};

const PIE_COLORS = [
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#8B5CF6',
  '#EF4444',
  '#14B8A6',
  '#F97316',
  '#6366F1',
  '#84CC16',
  '#06B6D4',
  '#D946EF',
  '#F43F5E',
  '#8B5CF6',
];

// BU 列表（与 mock 一致）
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

// 格式化数值
const formatValue = (val, dataType) => {
  if (val === null || val === undefined) return '-';
  if (dataType === 'amount') {
    return `¥${(val / 10000).toFixed(2)}万`;
  }
  return `${val.toLocaleString()}`;
};

const formatRate = (val) => {
  if (val === null || val === undefined) return '-';
  const sign = val >= 0 ? '+' : '';
  return `${sign}${val.toFixed(2)}%`;
};

// ==================== 组件 ====================

// Portal Tooltip 容器
const TooltipPortal = ({ children, targetRect }) => {
  if (!targetRect) return null;
  
  const style = {
    position: 'fixed',
    top: targetRect.bottom + 8,
    left: targetRect.left,
    zIndex: 9999,
    pointerEvents: 'none',
  };

  return createPortal(
    <div style={style}>{children}</div>,
    document.body
  );
};

// 指标卡浮层组件（对齐 Forecast Tracking 格式）
const MetricCardTooltip = ({ payload, dataType }) => {
  if (!payload) return null;

  const { value, lastMonthValue, lastYearValue, momRate, yoyRate, isTotal } = payload;

  // 防御性处理 undefined 值
  const safeValue = value ?? 0;
  const safeLastMonthValue = lastMonthValue ?? 0;
  const safeLastYearValue = lastYearValue ?? 0;
  const safeMomRate = momRate ?? 0;
  const safeYoyRate = yoyRate ?? 0;

  // 计算日期区间（简化版，只显示月份）
  const getMonthRange = (offset) => {
    const now = new Date(2026, 2, 1); // 参考时间 2026-03
    const start = new Date(now.getFullYear(), now.getMonth() + offset, 1);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
    return `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')} 至 ${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, '0')}-${String(end.getDate()).padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-[560px] pointer-events-auto">
      <div className="space-y-3 min-w-[520px]">
        {/* 本期 */}
        <div className="grid grid-cols-[56px_1fr] items-center gap-4">
          <span className="text-sm text-gray-500">本期</span>
          <span className="text-sm font-semibold text-gray-800">{formatValue(safeValue, dataType)}</span>
        </div>

        {/* 环比 */}
        <div className="grid grid-cols-[56px_1fr] items-center pt-2 border-t border-gray-100 gap-4 whitespace-nowrap">
          <span className="text-sm text-gray-500">环比</span>
          <div className="flex items-center gap-4 whitespace-nowrap">
            <span className="text-sm font-semibold text-gray-800">
              {formatValue(safeLastMonthValue, dataType)}
            </span>
            <span className={`text-sm ${safeMomRate >= 0 ? 'text-red-500' : 'text-green-500'}`}>
              {formatRate(safeMomRate)}
            </span>
            <span className="text-xs text-gray-400">{getMonthRange(-1)}</span>
          </div>
        </div>

        {/* 同比 - Total 不展示 */}
        {!isTotal && (
          <div className="grid grid-cols-[56px_1fr] items-center pt-2 border-t border-gray-100 gap-4 whitespace-nowrap">
            <span className="text-sm text-gray-500">同比</span>
            <div className="flex items-center gap-4 whitespace-nowrap">
              <span className="text-sm font-semibold text-gray-800">
                {formatValue(safeLastYearValue, dataType)}
              </span>
              <span className={`text-sm ${safeYoyRate >= 0 ? 'text-red-500' : 'text-green-500'}`}>
                {formatRate(safeYoyRate)}
              </span>
              <span className="text-xs text-gray-400">{getMonthRange(-12)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ITO 指标卡浮层（对齐 Forecast Tracking 格式）
const ItoCardTooltip = ({ payload }) => {
  if (!payload) return null;

  const { ito, lastMonthIto, itoMomRate, isTotal } = payload;

  // 防御性处理 undefined 值
  const safeIto = ito ?? 0;
  const safeLastMonthIto = lastMonthIto ?? 0;
  const safeItoMomRate = itoMomRate ?? 0;

  // 计算日期区间
  const getMonthRange = (offset) => {
    const now = new Date(2026, 2, 1);
    const start = new Date(now.getFullYear(), now.getMonth() + offset, 1);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
    return `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')} 至 ${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, '0')}-${String(end.getDate()).padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-[560px] pointer-events-auto">
      <div className="space-y-3 min-w-[520px]">
        {/* 本期 ITO */}
        <div className="grid grid-cols-[56px_1fr] items-center gap-4">
          <span className="text-sm text-gray-500">本期 ITO</span>
          <span className="text-sm font-semibold text-gray-800">{safeIto.toFixed(2)}</span>
        </div>

        {/* 较上月 */}
        <div className="grid grid-cols-[56px_1fr] items-center pt-2 border-t border-gray-100 gap-4 whitespace-nowrap">
          <span className="text-sm text-gray-500">较上月</span>
          <div className="flex items-center gap-4 whitespace-nowrap">
            <span className="text-sm font-semibold text-gray-800">{safeLastMonthIto.toFixed(2)}</span>
            <span className={`text-sm ${safeItoMomRate <= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {safeItoMomRate >= 0 ? '+' : ''}
              {safeItoMomRate.toFixed(2)}%
            </span>
            <span className="text-xs text-gray-400">{getMonthRange(-1)}</span>
          </div>
        </div>

        {/* 较上年 - 简化显示 */}
        {!isTotal && (
          <div className="grid grid-cols-[56px_1fr] items-center pt-2 border-t border-gray-100 gap-4 whitespace-nowrap">
            <span className="text-sm text-gray-500">较上年</span>
            <div className="flex items-center gap-4 whitespace-nowrap">
              <span className="text-sm font-semibold text-gray-800">{safeLastMonthIto.toFixed(2)}</span>
              <span className={`text-sm ${safeItoMomRate <= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {safeItoMomRate >= 0 ? '+' : ''}
                {safeItoMomRate.toFixed(2)}%
              </span>
              <span className="text-xs text-gray-400">{getMonthRange(-12)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// 指标卡组件
const MetricCard = ({ title, value, momRate, yoyRate, isTotal, dataType, type = 'value' }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const cardRef = useRef(null);
  const [cardRect, setCardRect] = useState(null);

  // 防御性处理 undefined 值
  const safeValue = value ?? 0;
  const safeMomRate = momRate ?? 0;
  const safeYoyRate = yoyRate ?? 0;

  const tooltipPayload =
    type === 'value'
      ? { value: safeValue, momRate: safeMomRate, yoyRate: safeYoyRate, isTotal, dataType }
      : { ito: safeValue, lastMonthIto: safeMomRate, itoMomRate: safeYoyRate, isTotal };

  const handleMouseEnter = () => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setCardRect(rect);
    }
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <>
      <div
        ref={cardRef}
        className="relative bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="text-sm text-gray-500 mb-1">{title}</div>

        {type === 'value' ? (
          <>
            <div className="text-2xl font-bold text-gray-900">{formatValue(safeValue, dataType)}</div>
            <div className="mt-2 flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500 whitespace-nowrap">环比</span>
                <span
                  className={`text-sm font-medium ${
                    safeMomRate >= 0 ? 'text-red-500' : 'text-green-500'
                  }`}
                >
                  {formatRate(safeMomRate)}
                </span>
              </div>
              {!isTotal && (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-500 whitespace-nowrap">同比</span>
                  <span
                    className={`text-sm font-medium ${
                      safeYoyRate >= 0 ? 'text-red-500' : 'text-green-500'
                    }`}
                  >
                    {formatRate(safeYoyRate)}
                  </span>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* ITO 卡片：显示本期值、较上月差值、较上年差值 */}
            <div className="text-2xl font-bold text-gray-900">{safeValue.toFixed(2)}</div>
            <div className="mt-2 flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500 whitespace-nowrap">较上月</span>
                <span
                  className={`text-sm font-medium ${
                    safeMomRate <= 0 ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {safeMomRate >= 0 ? '+' : ''}
                  {safeMomRate.toFixed(2)}
                </span>
              </div>
              {!isTotal && (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-500 whitespace-nowrap">较上年</span>
                  <span
                    className={`text-sm font-medium ${
                      safeYoyRate <= 0 ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {safeYoyRate >= 0 ? '+' : ''}
                    {safeYoyRate.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Tooltip Portal */}
      {showTooltip && cardRect && (
        <TooltipPortal targetRect={cardRect}>
          {type === 'value' ? (
            <MetricCardTooltip payload={tooltipPayload} dataType={dataType} />
          ) : (
            <ItoCardTooltip payload={tooltipPayload} />
          )}
        </TooltipPortal>
      )}
    </>
  );
};

// 主组件
const OpeningItoDashboardPage = () => {
  // 状态
  const [dataType, setDataType] = useState('amount'); // 'amount' | 'qty'
  const [selectedMonth, setSelectedMonth] = useState(supplyChainService.getDefaultMonth());
  const [includeRetail, setIncludeRetail] = useState(true); // 是否含商超
  const [tableDimension, setTableDimension] = useState('bu-warehouse'); // 'bu-warehouse' | 'bu-category'
  const [pieDimension, setPieDimension] = useState('category'); // 'category' | 'bu'
  const [loading, setLoading] = useState(false);
  const [analysisModalOpen, setAnalysisModalOpen] = useState(false); // 期初各BU看分析弹窗
  const [categoryAnalysisModalOpen, setCategoryAnalysisModalOpen] = useState(false); // 类目分析弹窗

  // 数据
  const [metricCardsData, setMetricCardsData] = useState(null);
  const [tableData, setTableData] = useState(null);
  const [pieData, setPieData] = useState(null);
  const [filterOptions, setFilterOptions] = useState({ months: [], bus: [], categories: [] });

  // 分析弹窗数据
  const [yearlyTrendData, setYearlyTrendData] = useState(null);
  const [monthlyTrendData, setMonthlyTrendData] = useState(null);
  const [categoryAnalysisData, setCategoryAnalysisData] = useState(null);

  // 加载筛选选项
  useEffect(() => {
    const options = supplyChainService.getOpeningItoFilterOptions();
    setFilterOptions(options);
  }, []);

  // 加载数据
  useEffect(() => {
    setLoading(true);

    // 加载指标卡数据
    const metricData = supplyChainService.getOpeningItoMetricCards({
      month: selectedMonth,
      dataType,
      includeRetail,
    });
    setMetricCardsData(metricData);

    // 加载表格数据
    if (tableDimension === 'bu-warehouse') {
      const warehouseTable = supplyChainService.getOpeningItoBuWarehouseTable({
        month: selectedMonth,
        dataType,
        includeRetail,
      });
      setTableData(warehouseTable);
    } else {
      const categoryTable = supplyChainService.getOpeningItoBuCategoryTable({
        month: selectedMonth,
        dataType,
        includeRetail,
      });
      setTableData(categoryTable);
    }

    // 加载饼图数据
    const pie = supplyChainService.getOpeningItoPieData({
      month: selectedMonth,
      dataType,
      dimension: pieDimension,
      includeRetail,
    });
    setPieData(pie);

    setLoading(false);
  }, [selectedMonth, dataType, includeRetail, tableDimension, pieDimension]);

  // 加载分析弹窗数据
  useEffect(() => {
    if (analysisModalOpen) {
      // 加载年度趋势数据（2025 vs 2026）
      const yearlyData = supplyChainService.getOpeningItoYearlyTrend({
        dataType,
        includeRetail,
      });
      setYearlyTrendData(yearlyData);

      // 加载月度趋势数据（2026）
      const monthlyData = supplyChainService.getOpeningItoMonthlyTrend({
        year: '2026',
        dataType,
        includeRetail,
      });
      setMonthlyTrendData(monthlyData);
    }
  }, [analysisModalOpen, dataType, includeRetail]);

  // 加载类目分析弹窗数据
  useEffect(() => {
    if (categoryAnalysisModalOpen) {
      const data = supplyChainService.getCategoryAnalysisData({
        month: selectedMonth,
        dataType,
        includeRetail,
      });
      setCategoryAnalysisData(data);
    }
  }, [categoryAnalysisModalOpen, selectedMonth, dataType, includeRetail]);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* 页面标题 */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">期初&ITO各BU看板</h1>
            <p className="text-sm text-gray-500 mt-1">库存计划与周转率分析</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            导出报告
          </button>
        </div>
      </div>

      {/* 筛选栏 */}
      <div className="bg-white border-b px-6 py-3">
        <div className="flex items-center gap-4">
          {/* 数量/金额切换 */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                dataType === 'amount'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setDataType('amount')}
            >
              金额
            </button>
            <button
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                dataType === 'qty'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setDataType('qty')}
            >
              数量
            </button>
          </div>

          {/* 月份选择 */}
          <div className="relative">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="appearance-none bg-gray-100 border-0 rounded-lg px-4 py-2 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {filterOptions.months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>

          {/* 是否含商超 */}
          <div className="relative">
            <select
              value={includeRetail ? 'yes' : 'no'}
              onChange={(e) => setIncludeRetail(e.target.value === 'yes')}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer hover:border-gray-400 transition-colors"
            >
              <option value="yes">是否含商超：是</option>
              <option value="no">是否含商超：否</option>
            </select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 overflow-auto p-6">
        {/* 指标卡区域（统一边框包裹） */}
        {metricCardsData && (
          <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
            {/* 区域标题栏 */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-gray-800">期初&ITO指标卡</h2>
                {!includeRetail && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-700 border border-orange-200">
                    不含Retail
                  </span>
                )}
              </div>
              <button
                onClick={() => setAnalysisModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                期初各BU看分析
              </button>
            </div>

            <div className="space-y-6">
              {/* 期初金额/数量卡组 */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  {dataType === 'amount' ? '期初金额' : '期初数量'}
                </h3>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {/* Total */}
                  <div className="flex-shrink-0 w-[200px]">
                    <MetricCard
                      title="Total"
                      value={metricCardsData.total.value}
                      momRate={metricCardsData.total.momRate}
                      yoyRate={metricCardsData.total.yoyRate}
                      isTotal={true}
                      dataType={dataType}
                      type="value"
                    />
                  </div>
                  {/* BU 卡片 */}
                  {metricCardsData.buCards.map((bu) => (
                    <div key={bu.bu} className="flex-shrink-0 w-[200px]">
                      <MetricCard
                        title={bu.bu}
                        value={bu.value}
                        momRate={bu.momRate}
                        yoyRate={bu.yoyRate}
                        isTotal={false}
                        dataType={dataType}
                        type="value"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* ITO 卡组 */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">ITO</h3>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {/* Total ITO */}
                  <div className="flex-shrink-0 w-[200px]">
                    <MetricCard
                      title="Total"
                      value={metricCardsData.total.ito}
                      momRate={metricCardsData.total.itoMomDiff}
                      yoyRate={metricCardsData.total.itoYoyDiff}
                      isTotal={true}
                      dataType={dataType}
                      type="ito"
                    />
                  </div>
                  {/* BU ITO 卡片 */}
                  {metricCardsData.buCards.map((bu) => (
                    <div key={`ito-${bu.bu}`} className="flex-shrink-0 w-[200px]">
                      <MetricCard
                        title={bu.bu}
                        value={bu.ito}
                        momRate={bu.itoMomDiff}
                        yoyRate={bu.itoYoyDiff}
                        isTotal={false}
                        dataType={dataType}
                        type="ito"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 表格区 */}
        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          {/* 表格区头部 + 维度切换 */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <h3 className="font-medium text-gray-800">明细数据</h3>
            <div className="flex items-center gap-3">
              {/* 类目分析按钮 - 仅在BU-类目维度显示 */}
              {tableDimension === 'bu-category' && (
                <button
                  onClick={() => setCategoryAnalysisModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                >
                  <BarChart3 className="w-4 h-4" />
                  类目分析
                </button>
              )}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    tableDimension === 'bu-warehouse'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setTableDimension('bu-warehouse')}
                >
                  BU-仓位维度
                </button>
                <button
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    tableDimension === 'bu-category'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setTableDimension('bu-category')}
                >
                  BU-类目维度
                </button>
              </div>
            </div>
          </div>

          {/* 表格内容 */}
          <div className="overflow-x-auto">
            {tableDimension === 'bu-warehouse' ? (
              // BU-仓位维度表格
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 border-b sticky left-0 bg-gray-50 z-10 min-w-[120px]">
                      BU/仓位
                    </th>
                    <th
                      colSpan={3}
                      className="px-4 py-2 text-center font-medium text-gray-700 border-b min-w-[300px]"
                    >
                      {tableData?.meta?.currentMonthLabel || selectedMonth}
                    </th>
                    <th
                      colSpan={3}
                      className="px-4 py-2 text-center font-medium text-gray-700 border-b min-w-[300px]"
                    >
                      {tableData?.meta?.lastMonthLabel || '上月'}
                    </th>
                    <th
                      colSpan={3}
                      className="px-4 py-2 text-center font-medium text-gray-700 border-b min-w-[300px]"
                    >
                      环比金额
                    </th>
                    <th
                      colSpan={3}
                      className="px-4 py-2 text-center font-medium text-gray-700 border-b min-w-[300px]"
                    >
                      环比
                    </th>
                  </tr>
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-600 border-b sticky left-0 bg-gray-50 z-10"></th>
                    <th className="px-3 py-2 text-center font-medium text-gray-600 border-b">共享仓</th>
                    <th className="px-3 py-2 text-center font-medium text-gray-600 border-b">业务仓</th>
                    <th className="px-3 py-2 text-center font-medium text-gray-600 border-b">总计</th>
                    <th className="px-3 py-2 text-center font-medium text-gray-600 border-b">共享仓</th>
                    <th className="px-3 py-2 text-center font-medium text-gray-600 border-b">业务仓</th>
                    <th className="px-3 py-2 text-center font-medium text-gray-600 border-b">总计</th>
                    <th className="px-3 py-2 text-center font-medium text-gray-600 border-b">共享仓</th>
                    <th className="px-3 py-2 text-center font-medium text-gray-600 border-b">业务仓</th>
                    <th className="px-3 py-2 text-center font-medium text-gray-600 border-b">总计</th>
                    <th className="px-3 py-2 text-center font-medium text-gray-600 border-b">共享仓</th>
                    <th className="px-3 py-2 text-center font-medium text-gray-600 border-b">业务仓</th>
                    <th className="px-3 py-2 text-center font-medium text-gray-600 border-b">总计</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData?.rows?.map((row) => (
                    <tr key={row.bu} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900 font-medium border-b sticky left-0 bg-white z-10">
                        {row.bu}
                      </td>
                      <td className="px-3 py-3 text-gray-700 border-b text-right">
                        {formatValue(row.sharedCurrent, dataType)}
                      </td>
                      <td className="px-3 py-3 text-gray-700 border-b text-right">
                        {formatValue(row.bizCurrent, dataType)}
                      </td>
                      <td className="px-3 py-3 text-gray-900 font-medium border-b text-right">
                        {formatValue(row.totalCurrent, dataType)}
                      </td>
                      <td className="px-3 py-3 text-gray-500 border-b text-right">
                        {formatValue(row.sharedLastMonth, dataType)}
                      </td>
                      <td className="px-3 py-3 text-gray-500 border-b text-right">
                        {formatValue(row.bizLastMonth, dataType)}
                      </td>
                      <td className="px-3 py-3 text-gray-500 border-b text-right">
                        {formatValue(row.totalLastMonth, dataType)}
                      </td>
                      <td
                        className={`px-3 py-3 border-b text-right ${
                          row.sharedMomDiff >= 0 ? 'text-red-600' : 'text-green-600'
                        }`}
                      >
                        {row.sharedMomDiff >= 0 ? '+' : ''}
                        {formatValue(Math.abs(row.sharedMomDiff), dataType)}
                      </td>
                      <td
                        className={`px-3 py-3 border-b text-right ${
                          row.bizMomDiff >= 0 ? 'text-red-600' : 'text-green-600'
                        }`}
                      >
                        {row.bizMomDiff >= 0 ? '+' : ''}
                        {formatValue(Math.abs(row.bizMomDiff), dataType)}
                      </td>
                      <td
                        className={`px-3 py-3 border-b text-right font-medium ${
                          row.totalMomDiff >= 0 ? 'text-red-600' : 'text-green-600'
                        }`}
                      >
                        {row.totalMomDiff >= 0 ? '+' : ''}
                        {formatValue(Math.abs(row.totalMomDiff), dataType)}
                      </td>
                      <td
                        className={`px-3 py-3 border-b text-right ${
                          row.sharedMomRate >= 0 ? 'text-red-600' : 'text-green-600'
                        }`}
                      >
                        {formatRate(row.sharedMomRate)}
                      </td>
                      <td
                        className={`px-3 py-3 border-b text-right ${
                          row.bizMomRate >= 0 ? 'text-red-600' : 'text-green-600'
                        }`}
                      >
                        {formatRate(row.bizMomRate)}
                      </td>
                      <td
                        className={`px-3 py-3 border-b text-right font-medium ${
                          row.totalMomRate >= 0 ? 'text-red-600' : 'text-green-600'
                        }`}
                      >
                        {formatRate(row.totalMomRate)}
                      </td>
                    </tr>
                  ))}
                  {/* 汇总行 */}
                  {tableData?.summaryRow && (
                    <tr className="bg-gray-50 font-medium">
                      <td className="px-4 py-3 text-gray-900 border-b sticky left-0 bg-gray-50 z-10">
                        汇总
                      </td>
                      <td className="px-3 py-3 text-gray-900 border-b text-right">
                        {formatValue(tableData.summaryRow.sharedCurrent, dataType)}
                      </td>
                      <td className="px-3 py-3 text-gray-900 border-b text-right">
                        {formatValue(tableData.summaryRow.bizCurrent, dataType)}
                      </td>
                      <td className="px-3 py-3 text-gray-900 border-b text-right">
                        {formatValue(tableData.summaryRow.totalCurrent, dataType)}
                      </td>
                      <td className="px-3 py-3 text-gray-700 border-b text-right">
                        {formatValue(tableData.summaryRow.sharedLastMonth, dataType)}
                      </td>
                      <td className="px-3 py-3 text-gray-700 border-b text-right">
                        {formatValue(tableData.summaryRow.bizLastMonth, dataType)}
                      </td>
                      <td className="px-3 py-3 text-gray-700 border-b text-right">
                        {formatValue(tableData.summaryRow.totalLastMonth, dataType)}
                      </td>
                      <td
                        className={`px-3 py-3 border-b text-right ${
                          tableData.summaryRow.sharedMomDiff >= 0 ? 'text-red-600' : 'text-green-600'
                        }`}
                      >
                        {tableData.summaryRow.sharedMomDiff >= 0 ? '+' : ''}
                        {formatValue(Math.abs(tableData.summaryRow.sharedMomDiff), dataType)}
                      </td>
                      <td
                        className={`px-3 py-3 border-b text-right ${
                          tableData.summaryRow.bizMomDiff >= 0 ? 'text-red-600' : 'text-green-600'
                        }`}
                      >
                        {tableData.summaryRow.bizMomDiff >= 0 ? '+' : ''}
                        {formatValue(Math.abs(tableData.summaryRow.bizMomDiff), dataType)}
                      </td>
                      <td
                        className={`px-3 py-3 border-b text-right ${
                          tableData.summaryRow.totalMomDiff >= 0 ? 'text-red-600' : 'text-green-600'
                        }`}
                      >
                        {tableData.summaryRow.totalMomDiff >= 0 ? '+' : ''}
                        {formatValue(Math.abs(tableData.summaryRow.totalMomDiff), dataType)}
                      </td>
                      <td
                        className={`px-3 py-3 border-b text-right ${
                          tableData.summaryRow.sharedMomRate >= 0 ? 'text-red-600' : 'text-green-600'
                        }`}
                      >
                        {formatRate(tableData.summaryRow.sharedMomRate)}
                      </td>
                      <td
                        className={`px-3 py-3 border-b text-right ${
                          tableData.summaryRow.bizMomRate >= 0 ? 'text-red-600' : 'text-green-600'
                        }`}
                      >
                        {formatRate(tableData.summaryRow.bizMomRate)}
                      </td>
                      <td
                        className={`px-3 py-3 border-b text-right ${
                          tableData.summaryRow.totalMomRate >= 0 ? 'text-red-600' : 'text-green-600'
                        }`}
                      >
                        {formatRate(tableData.summaryRow.totalMomRate)}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : (
              // BU-类目维度表格
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 border-b sticky left-0 bg-gray-50 z-10 min-w-[120px]">
                      Category
                    </th>
                    {BU_LIST.map((bu) => (
                      <th
                        key={bu}
                        className="px-3 py-3 text-center font-medium text-gray-700 border-b min-w-[100px]"
                      >
                        {bu}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-center font-medium text-gray-700 border-b sticky right-0 bg-gray-50 z-10 min-w-[120px]">
                      汇总
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableData?.rows?.map((row) => (
                    <tr key={row.category} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900 font-medium border-b sticky left-0 bg-white z-10">
                        {row.category}
                      </td>
                      {BU_LIST.map((bu) => (
                        <td key={bu} className="px-3 py-3 text-gray-700 border-b text-right">
                          {formatValue(row[bu], dataType)}
                        </td>
                      ))}
                      <td className="px-4 py-3 text-gray-900 font-medium border-b text-right sticky right-0 bg-white z-10">
                        {formatValue(row.total, dataType)}
                      </td>
                    </tr>
                  ))}
                  {/* 汇总行 */}
                  {tableData?.summaryRow && (
                    <tr className="bg-gray-50 font-medium">
                      <td className="px-4 py-3 text-gray-900 border-b sticky left-0 bg-gray-50 z-10">
                        汇总
                      </td>
                      {BU_LIST.map((bu) => (
                        <td key={bu} className="px-3 py-3 text-gray-900 border-b text-right">
                          {formatValue(tableData.summaryRow[bu], dataType)}
                        </td>
                      ))}
                      <td className="px-4 py-3 text-gray-900 border-b text-right sticky right-0 bg-gray-50 z-10">
                        {formatValue(tableData.summaryRow.total, dataType)}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* 饼图区 */}
        <div className="bg-white rounded-lg border border-gray-200">
          {/* 饼图区头部 + 维度切换 */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <h3 className="font-medium text-gray-800">占比分析</h3>
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  pieDimension === 'category'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setPieDimension('category')}
              >
                类目维度
              </button>
              <button
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  pieDimension === 'bu'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setPieDimension('bu')}
              >
                BU维度
              </button>
            </div>
          </div>

          {/* 饼图内容 */}
          <div className="p-6">
            <div className="grid grid-cols-2 gap-8">
              {/* 期初库存占比 */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-4 text-center">期初库存占比</h4>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={pieData?.openingDistribution || []}
                        cx="40%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        nameKey="name"
                      >
                        {(pieData?.openingDistribution || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        formatter={(value, name, props) => {
                          const total = pieData?.openingDistribution?.reduce(
                            (sum, item) => sum + item.value,
                            0
                          );
                          const percent = total ? ((value / total) * 100).toFixed(2) : '0.00';
                          return [`${formatValue(value, dataType)} (${percent}%)`, name];
                        }}
                      />
                      <Legend
                        layout="vertical"
                        align="right"
                        verticalAlign="middle"
                        wrapperStyle={{ fontSize: '12px' }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 实销占比 */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-4 text-center">实销占比</h4>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={pieData?.salesDistribution || []}
                        cx="40%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        nameKey="name"
                      >
                        {(pieData?.salesDistribution || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        formatter={(value, name, props) => {
                          const total = pieData?.salesDistribution?.reduce(
                            (sum, item) => sum + item.value,
                            0
                          );
                          const percent = total ? ((value / total) * 100).toFixed(2) : '0.00';
                          return [`${formatValue(value, dataType)} (${percent}%)`, name];
                        }}
                      />
                      <Legend
                        layout="vertical"
                        align="right"
                        verticalAlign="middle"
                        wrapperStyle={{ fontSize: '12px' }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 分析弹窗 */}
      {analysisModalOpen && (
        <OpeningItoAnalysisModal
          isOpen={analysisModalOpen}
          onClose={() => setAnalysisModalOpen(false)}
          dataType={dataType}
          includeRetail={includeRetail}
          yearlyTrendData={yearlyTrendData}
          monthlyTrendData={monthlyTrendData}
        />
      )}

      {/* 类目分析弹窗 */}
      {categoryAnalysisModalOpen && (
        <CategoryAnalysisModal
          isOpen={categoryAnalysisModalOpen}
          onClose={() => setCategoryAnalysisModalOpen(false)}
          dataType={dataType}
          month={selectedMonth}
          includeRetail={includeRetail}
          data={categoryAnalysisData}
        />
      )}
    </div>
  );
};

/**
 * 期初各BU看分析弹窗组件
 */
const OpeningItoAnalysisModal = ({
  isOpen,
  onClose,
  dataType,
  includeRetail,
  yearlyTrendData,
  monthlyTrendData,
  onBuChange,
}) => {
  // BU 列表
  const allBus = [
    'Total',
    'KK Amazon',
    'KK Shopify',
    'Tik Tok ACCU',
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

  // 根据是否含商超过滤BU选项
  const availableBus = includeRetail
    ? allBus
    : allBus.filter((bu) => bu !== 'Retail');

  const [selectedBus, setSelectedBus] = useState(['Total']);

  // 当 availableBus 变化时（比如切换是否含商超），重置选中状态
  useEffect(() => {
    if (!includeRetail && selectedBus.includes('Retail')) {
      setSelectedBus(['Total']);
    }
  }, [includeRetail, selectedBus]);

  // 处理BU选择变化
  const handleBuChange = (bu) => {
    let newSelection;
    if (bu === 'Total') {
      newSelection = selectedBus.includes('Total') ? [] : ['Total'];
    } else {
      if (selectedBus.includes(bu)) {
        newSelection = selectedBus.filter((b) => b !== bu);
        if (newSelection.length === 0) {
          newSelection = ['Total'];
        }
      } else {
        if (selectedBus.includes('Total')) {
          newSelection = [bu];
        } else {
          newSelection = [...selectedBus, bu];
        }
      }
    }
    setSelectedBus(newSelection);
    if (onBuChange) {
      onBuChange(newSelection);
    }
  };

  if (!isOpen) return null;

  const formatValue = (value) => {
    if (dataType === 'amount') {
      return `¥${(value / 10000).toFixed(2)}万`;
    }
    return `${value.toFixed(0)}`;
  };

  // 图表1数据：合并2025和2026数据
  const chart1Data = yearlyTrendData?.months.map((month, index) => ({
    month: `${month}月`,
    opening2025: yearlyTrendData.data2025[index]?.opening || 0,
    opening2026: yearlyTrendData.data2026[index]?.opening || 0,
    ito2025: yearlyTrendData.data2025[index]?.ito || 0,
    ito2026: yearlyTrendData.data2026[index]?.ito || 0,
  })) || [];

  // 图表2数据
  const chart2Data = monthlyTrendData?.data.map((item) => ({
    month: `${item.month}月`,
    opening: item.opening,
    ito: item.ito,
  })) || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-[95vw] h-[90vh] flex flex-col">
        {/* 弹窗头部 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">期初各BU趋势分析</h2>
            <p className="text-sm text-gray-500 mt-1">
              {dataType === 'amount' ? '金额' : '数量'}维度
              {!includeRetail && '（不含Retail）'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* BU 筛选下拉 */}
            <div className="relative">
              <select
                value={selectedBus[0] || 'Total'}
                onChange={(e) => handleBuChange(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer hover:border-gray-400 transition-colors"
              >
                {availableBus.map((bu) => (
                  <option key={bu} value={bu}>
                    {bu === 'Total' ? 'BU：Total' : `BU：${bu}`}
                  </option>
                ))}
              </select>
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>        </div>

        {/* 弹窗内容 */}
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* 解释区域 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-2">解释</h3>
            <p className="text-sm text-blue-700">
              如果看板页面选择了"无商超"，此分析页面的数据应为不包含商超的数据，且 BU 筛选器中无 Retail 选项。数据仅包含所选 BU 的聚合结果（选择 Total 时包含所有 BU）。
            </p>
          </div>

          {/* 图表1：年度对比趋势 */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-base font-medium text-gray-800 mb-4">
              期初 & ITO 年度对比趋势（2025 vs 2026）
            </h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chart1Data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) =>
                      dataType === 'amount' ? `${(value / 10000).toFixed(0)}万` : value
                    }
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => value.toFixed(2)}
                  />
                  <RechartsTooltip
                    formatter={(value, name) => {
                      if (name.includes('期初')) {
                        return [formatValue(value), name];
                      }
                      return [value.toFixed(2), name];
                    }}
                  />
                  <Legend
                    wrapperStyle={{ cursor: 'pointer' }}
                  />

                  {/* 2025 期初 - 蓝色柱 */}
                    <Bar
                      yAxisId="left"
                      dataKey="opening2025"
                      name="2025年 期初"
                      fill="#3B82F6"
                      radius={[4, 4, 0, 0]}
                    />
                  {/* 2026 期初 - 紫色柱 */}
                    <Bar
                      yAxisId="left"
                      dataKey="opening2026"
                      name="2026年 期初"
                      fill="#8B5CF6"
                      radius={[4, 4, 0, 0]}
                    />
                  {/* 2025 ITO - 灰色线 */}
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="ito2025"
                      name="2025年 ITO"
                      stroke="#6B7280"
                      strokeWidth={2}
                    />
                  {/* 2026 ITO - 绿色线 */}
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="ito2026"
                      name="2026年 ITO"
                      stroke="#10B981"
                      strokeWidth={2}
                    />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              点击图例可隐藏/显示对应数据系列
            </p>
          </div>

          {/* 图表2：本期期初 & ITO */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-base font-medium text-gray-800 mb-4">
              本期期初 & ITO（2026年）
            </h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chart2Data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) =>
                      dataType === 'amount' ? `${(value / 10000).toFixed(0)}万` : value
                    }
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => value.toFixed(2)}
                  />
                  <RechartsTooltip
                    formatter={(value, name) => {
                      if (name.includes('期初')) {
                        return [formatValue(value), name];
                      }
                      return [value.toFixed(2), name];
                    }}
                  />
                  <Legend
                    wrapperStyle={{ cursor: 'pointer' }}
                  />

                  {/* 本期期初 - 蓝色柱 */}
                    <Bar
                      yAxisId="left"
                      dataKey="opening"
                      name="本期期初"
                      fill="#3B82F6"
                      radius={[4, 4, 0, 0]}
                    />
                  {/* 本期 ITO - 绿色线 */}
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="ito"
                      name="本期 ITO"
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              点击图例可隐藏/显示对应数据系列
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 类目分析弹窗组件
 */
const CategoryAnalysisModal = ({
  isOpen,
  onClose,
  dataType,
  month,
  includeRetail,
  data,
}) => {
  if (!isOpen) return null;

  const formatValue = (value) => {
    if (value === null || value === undefined) return '-';
    if (dataType === 'amount') {
      return `¥${(value / 10000).toFixed(2)}万`;
    }
    return `${value.toLocaleString()}`;
  };

  // BU列表（不含Retail如果includeRetail为false）
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-[95vw] h-[90vh] flex flex-col">
        {/* 弹窗头部 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              类目分析 - {dataType === 'amount' ? '金额' : '数量'}（{month}）
            </h2>
            {!includeRetail && (
              <p className="text-sm text-orange-600 mt-1">不含Retail数据</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* 弹窗内容 */}
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* 区域1：环比差异表格 */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-base font-medium text-gray-800 mb-4">
              本期期初库存 VS 上期期初库存
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 border-b sticky left-0 bg-gray-50 z-10 min-w-[120px]">
                      Category
                    </th>
                    {buList.map((bu) => (
                      <th
                        key={bu}
                        className="px-3 py-3 text-center font-medium text-gray-700 border-b min-w-[100px]"
                      >
                        {bu}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-center font-medium text-gray-700 border-b sticky right-0 bg-gray-50 z-10 min-w-[120px]">
                      汇总
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data?.categoryDiffs?.map((row) => (
                    <tr key={row.category} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900 font-medium border-b sticky left-0 bg-white z-10">
                        {row.category}
                      </td>
                      {buList.map((bu) => {
                        const diff = row[bu] || 0;
                        return (
                          <td
                            key={bu}
                            className={`px-3 py-3 border-b text-right ${
                              diff > 0
                                ? 'text-red-600'
                                : diff < 0
                                ? 'text-green-600'
                                : 'text-gray-700'
                            }`}
                          >
                            {diff > 0 ? '+' : ''}
                            {formatValue(diff)}
                          </td>
                        );
                      })}
                      <td
                        className={`px-4 py-3 border-b text-right sticky right-0 bg-white z-10 font-medium ${
                          row.total > 0
                            ? 'text-red-600'
                            : row.total < 0
                            ? 'text-green-600'
                            : 'text-gray-900'
                        }`}
                      >
                        {row.total > 0 ? '+' : ''}
                        {formatValue(row.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 区域2：TOP10增加排名 */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-base font-medium text-gray-800 mb-4">
              本期期初库存增加排名 TOP10
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-center font-medium text-gray-700 border-b w-[80px]">
                      排名
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 border-b">
                      BU
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 border-b">
                      Category
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-gray-700 border-b">
                      金额（正值）
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data?.top10?.map((item, index) => (
                    <tr key={`${item.bu}-${item.category}`} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-center text-gray-900 font-medium border-b">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 text-gray-900 border-b">
                        {item.bu}
                      </td>
                      <td className="px-4 py-3 text-gray-900 border-b">
                        {item.category}
                      </td>
                      <td className="px-4 py-3 text-right text-red-600 font-medium border-b">
                        +{formatValue(item.value)}
                      </td>
                    </tr>
                  ))}
                  {(!data?.top10 || data.top10.length === 0) && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-8 text-center text-gray-500 border-b"
                      >
                        暂无数据
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpeningItoDashboardPage;
