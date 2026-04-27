// src/pages/supply-chain/ExcessDashboardPage.js
import React, { useEffect, useMemo, useState } from 'react';
import * as supplyChainService from '../../services/supply-chain';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

const momColorClass = (value) => {
  if (value > 0) return 'text-red-600';
  if (value < 0) return 'text-green-600';
  return 'text-gray-600';
};

const ANALYSIS_LEVEL1_OPTIONS = [
  { key: 'category', label: '类目概览' },
  { key: 'bu', label: 'BU概览' },
];

const ANALYSIS_METRIC_OPTIONS = [
  { key: 'safe', label: '超出周转' },
  { key: 'excess3', label: 'Excess3个月' },
  { key: 'excess6', label: 'Excess6个月' },
  { key: 'excess12', label: 'Excess12个月' },
];

const INVENTORY_AGE_DIMENSION_OPTIONS = [
  { key: 'bu', label: 'BU' },
  { key: 'category', label: '类目' },
  { key: 'warehouse', label: '仓库' },
];

const PIE_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#14B8A6', '#F97316', '#6366F1'];

const getArchiveSlice = (record, dataType, bu) => {
  const byType = record?.globalSnapshot?.[dataType];
  if (byType && byType[bu]) return byType[bu];
  if (byType && byType['总览']) return byType['总览'];
  if (record?.payload) return record.payload; // 兼容旧留档
  return {
    metrics: [],
    mainTableRows: [],
    top10Rows: [],
    ageRows: [],
  };
};

const ExcessDashboardPage = () => {
  const [dataType, setDataType] = useState('amount');
  const [tabs, setTabs] = useState([]);
  const [activeBuTab, setActiveBuTab] = useState('总览');
  const [metrics, setMetrics] = useState([]);
  const [mainTableRows, setMainTableRows] = useState([]);
  const [top10Rows, setTop10Rows] = useState([]);
  const [ageRows, setAgeRows] = useState([]);
  const [archives, setArchives] = useState([]);
  const [archivePanelOpen, setArchivePanelOpen] = useState(false);
  const [archiveViewMeta, setArchiveViewMeta] = useState(null);
  const [analysisModalOpen, setAnalysisModalOpen] = useState(false);
  const [analysisLevel1, setAnalysisLevel1] = useState('category');
  const [analysisMetric, setAnalysisMetric] = useState('safe');
  const [analysisData, setAnalysisData] = useState({
    summary: [],
    chartData: [],
    rankingRows: [],
  });
  const [inventoryAgeModalOpen, setInventoryAgeModalOpen] = useState(false);
  const [inventoryAgeDimension, setInventoryAgeDimension] = useState('bu');
  const [inventoryAgeRows, setInventoryAgeRows] = useState([]);

  const analysisLevel1Label = useMemo(() => {
    return ANALYSIS_LEVEL1_OPTIONS.find((opt) => opt.key === analysisLevel1)?.label || '类目概览';
  }, [analysisLevel1]);

  const analysisMetricLabel = useMemo(() => {
    return ANALYSIS_METRIC_OPTIONS.find((opt) => opt.key === analysisMetric)?.label || '超出周转';
  }, [analysisMetric]);

  const formatValue = useMemo(() => {
    return (value) => {
      if (value === null || value === undefined) return '-';
      if (dataType === 'amount') return `¥${Number(value).toLocaleString()}`;
      return Number(value).toLocaleString();
    };
  }, [dataType]);

  useEffect(() => {
    const buTabs = supplyChainService.getExcessTabs();
    setTabs(buTabs);
  }, []);

  useEffect(() => {
    if (archiveViewMeta) {
      const slice = getArchiveSlice(archiveViewMeta, dataType, activeBuTab);
      setMetrics(slice?.metrics || []);
      setMainTableRows(slice?.mainTableRows || []);
      setTop10Rows(slice?.top10Rows || []);
      setAgeRows(slice?.ageRows || []);
      return;
    }

    const query = { bu: activeBuTab, dataType };
    const metricRes = supplyChainService.getExcessMetrics(query);
    const tableRes = supplyChainService.getExcessMainTable(query);
    const top10Res = supplyChainService.getExcessAgingTop10(query);
    const ageRes = supplyChainService.getExcessInventoryAge(query);

    setMetrics(metricRes?.metrics || []);
    setMainTableRows(tableRes?.rows || []);
    setTop10Rows(top10Res?.rows || []);
    setAgeRows(ageRes?.stages || []);
  }, [activeBuTab, dataType, archiveViewMeta]);

  const loadArchives = () => {
    const list = supplyChainService.getExcessArchives();
    setArchives(list);
  };

  const handleSaveArchive = () => {
    const tabList = tabs.length > 0 ? tabs : supplyChainService.getExcessTabs();
    const globalSnapshot = {
      amount: {},
      qty: {},
    };

    ['amount', 'qty'].forEach((type) => {
      tabList.forEach((buTab) => {
        const query = { bu: buTab, dataType: type };
        const metricRes = supplyChainService.getExcessMetrics(query);
        const tableRes = supplyChainService.getExcessMainTable(query);
        const top10Res = supplyChainService.getExcessAgingTop10(query);
        const ageRes = supplyChainService.getExcessInventoryAge(query);

        globalSnapshot[type][buTab] = {
          metrics: metricRes?.metrics || [],
          mainTableRows: tableRes?.rows || [],
          top10Rows: top10Res?.rows || [],
          ageRows: ageRes?.stages || [],
        };
      });
    });

    const record = supplyChainService.createExcessArchive({
      archiveName: `Excess留档 ${new Date().toLocaleString()}`,
      filters: { dataType, activeBuTab },
      globalSnapshot,
      payload: {
        metrics,
        mainTableRows,
        top10Rows,
        ageRows,
      },
    });
    loadArchives();
    setArchivePanelOpen(true);
    // 留档后仍保持实时模式
    return record;
  };

  const handleOpenArchives = () => {
    loadArchives();
    setArchivePanelOpen(true);
  };

  const handleViewArchive = (archiveId) => {
    const record = supplyChainService.getExcessArchiveById(archiveId);
    if (!record) return;
    setArchiveViewMeta(record);
    setDataType(record?.filters?.dataType || 'amount');
    setActiveBuTab(record?.filters?.activeBuTab || '总览');
    setArchivePanelOpen(false);
  };

  const handleExitArchiveView = () => {
    setArchiveViewMeta(null);
  };

  useEffect(() => {
    if (!analysisModalOpen) return;
    const res = supplyChainService.getExcessAnalysisData({
      bu: activeBuTab,
      dataType,
      level1: analysisLevel1,
      selectedMetric: analysisMetric,
    });
    setAnalysisData(res || { summary: [], chartData: [], rankingRows: [] });
  }, [analysisModalOpen, activeBuTab, dataType, analysisLevel1, analysisMetric]);

  useEffect(() => {
    if (!inventoryAgeModalOpen) return;
    const res = supplyChainService.getInventoryAgeOver365Analysis({
      activeBuTab,
      dataType,
      dimension: inventoryAgeDimension,
    });
    setInventoryAgeRows(res?.rows || []);
  }, [inventoryAgeModalOpen, activeBuTab, dataType, inventoryAgeDimension]);

  const inventoryAgeDimensionLabelCol = useMemo(() => {
    if (inventoryAgeDimension === 'bu') return 'BU';
    if (inventoryAgeDimension === 'category') return '类目';
    return '仓库';
  }, [inventoryAgeDimension]);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="p-6 pb-3">
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto border-b border-gray-200">
            <div className="inline-flex min-w-max">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-3 text-sm whitespace-nowrap transition-colors border-b-2 ${
                    activeBuTab === tab
                      ? 'border-blue-600 text-blue-600 font-medium'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setActiveBuTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="px-4 py-3 flex flex-wrap items-center gap-3">
            <div className="flex items-center bg-gray-100 rounded p-0.5">
              <button
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  dataType === 'amount'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setDataType('amount')}
              >
                金额
              </button>
              <button
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  dataType === 'qty'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setDataType('qty')}
              >
                数量
              </button>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={handleSaveArchive}
                className="px-3 py-1.5 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                留档当前数据
              </button>
              <button
                onClick={handleOpenArchives}
                className="px-3 py-1.5 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                查看留档记录
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 pt-3 space-y-6">
        {archiveViewMeta && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-center justify-between">
            <div className="text-sm text-amber-800">
              当前查看留档：
              <span className="font-medium ml-1">{archiveViewMeta.archiveName}</span>
              <span className="ml-2 text-amber-700/80">（可切换Tab与金额/数量）</span>
            </div>
            <button
              onClick={handleExitArchiveView}
              className="px-3 py-1 text-sm rounded-md bg-white border border-amber-300 text-amber-700 hover:bg-amber-100 transition-colors"
            >
              退出回看
            </button>
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-700">可视化指标版块</h3>
            <button
              onClick={() => setAnalysisModalOpen(true)}
              className="px-3 py-1.5 text-sm rounded-md bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 transition-colors"
            >
              过量分析
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {metrics.map((card) => (
              <div key={card.key} className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-600">{card.label}</h3>
                <div className="mt-2 text-2xl font-semibold text-gray-900">{formatValue(card.value)}</div>
                <div className="mt-3 text-sm">
                  <span className="text-gray-500 mr-2">较上月</span>
                  <span className={`font-medium ${momColorClass(card.momDiff)}`}>
                    {card.momDiff > 0 ? '+' : ''}
                    {formatValue(card.momDiff)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="font-medium text-gray-800">
              EXCESS6个月-{dataType === 'amount' ? '金额' : '数量'}TOP10
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[1060px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-center font-medium text-gray-700 border-b w-[80px]">排名</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 border-b">描述</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 border-b">类目</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 border-b">系列</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700 border-b">EXCESS6个月</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700 border-b">较上个月</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700 border-b">环比</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700 border-b">占比</th>
                </tr>
              </thead>
              <tbody>
                {mainTableRows.map((row, idx) => (
                  <tr key={`${row.category}-${row.series}`} className="hover:bg-gray-50">
                    <td className="px-4 py-3 border-b text-center text-gray-900 font-medium">{idx + 1}</td>
                    <td className="px-4 py-3 border-b text-gray-700">{row.description}</td>
                    <td className="px-4 py-3 border-b text-gray-900">{row.category}</td>
                    <td className="px-4 py-3 border-b text-gray-700">{row.series}</td>
                    <td className="px-4 py-3 border-b text-right text-gray-900 font-medium">
                      {formatValue(row.excess6)}
                    </td>
                    <td className={`px-4 py-3 border-b text-right font-medium ${momColorClass(row.momDiff)}`}>
                      {row.momDiff > 0 ? '+' : ''}
                      {formatValue(row.momDiff)}
                    </td>
                    <td className={`px-4 py-3 border-b text-right font-medium ${momColorClass(row.momRate)}`}>
                      {row.momRate > 0 ? '+' : ''}
                      {row.momRate.toFixed(2)}%
                    </td>
                    <td className="px-4 py-3 border-b text-right text-gray-700">{row.share.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="font-medium text-gray-800">库龄概览</h3>
            </div>
            <div className="p-4">
              <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                {ageRows.map((row, idx) => (
                  <div
                    key={row.stage}
                    className={`flex items-center justify-between px-4 py-3 text-sm ${
                      idx !== ageRows.length - 1 ? 'border-b border-gray-200' : ''
                    }`}
                  >
                    <span className="font-medium text-gray-700">{row.stage}</span>
                    <span className="text-gray-900">{formatValue(row.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between gap-3">
              <h3 className="font-medium text-gray-800">大于365天排名 TOP10</h3>
              <button
                type="button"
                onClick={() => {
                  setInventoryAgeDimension('bu');
                  setInventoryAgeModalOpen(true);
                }}
                className="shrink-0 px-3 py-1.5 text-sm rounded-md bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 transition-colors"
              >
                库龄分析
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[640px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-center font-medium text-gray-700 border-b w-[80px]">排名</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 border-b">BU</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 border-b">类目</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-700 border-b">
                      {dataType === 'amount' ? '金额' : '数量'}
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-gray-700 border-b">环比</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-700 border-b">占比</th>
                  </tr>
                </thead>
                <tbody>
                  {top10Rows.map((row, idx) => (
                    <tr key={`${row.bu}-${row.category}-${idx}`} className="hover:bg-gray-50">
                      <td className="px-4 py-3 border-b text-center text-gray-900 font-medium">{idx + 1}</td>
                      <td className="px-4 py-3 border-b text-gray-900">{row.bu}</td>
                      <td className="px-4 py-3 border-b text-gray-700">{row.category}</td>
                      <td className="px-4 py-3 border-b text-right text-gray-900 font-medium">
                        {formatValue(row.value)}
                      </td>
                      <td className={`px-4 py-3 border-b text-right font-medium ${momColorClass(row.momRate)}`}>
                        {row.momRate > 0 ? '+' : ''}
                        {row.momRate.toFixed(2)}%
                      </td>
                      <td className="px-4 py-3 border-b text-right text-gray-700">{row.share.toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {archivePanelOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-[860px] max-w-[95vw] max-h-[80vh] overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">Excess 留档记录</h3>
              <button
                onClick={() => setArchivePanelOpen(false)}
                className="px-2 py-1 text-sm text-gray-500 hover:text-gray-700"
              >
                关闭
              </button>
            </div>
            <div className="overflow-auto p-4">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">留档名称</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">时间</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">口径</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">BU</th>
                    <th className="px-3 py-2 text-right font-medium text-gray-700 border-b">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {archives.map((item) => (
                    <tr key={item.archiveId} className="hover:bg-gray-50">
                      <td className="px-3 py-2 border-b text-gray-900">{item.archiveName}</td>
                      <td className="px-3 py-2 border-b text-gray-600">
                        {new Date(item.createdAt).toLocaleString()}
                      </td>
                      <td className="px-3 py-2 border-b text-gray-600">
                        {item?.filters?.dataType === 'amount' ? '金额' : '数量'}
                      </td>
                      <td className="px-3 py-2 border-b text-gray-600">{item?.filters?.activeBuTab || '-'}</td>
                      <td className="px-3 py-2 border-b text-right">
                        <button
                          onClick={() => handleViewArchive(item.archiveId)}
                          className="px-2 py-1 text-sm rounded-md border border-blue-300 text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          查看
                        </button>
                      </td>
                    </tr>
                  ))}
                  {archives.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-3 py-8 text-center text-gray-500">
                        暂无留档记录
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {inventoryAgeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-[720px] max-w-[96vw] max-h-[86vh] overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">库龄分析（大于365天）</h3>
              <button
                type="button"
                onClick={() => setInventoryAgeModalOpen(false)}
                className="px-2 py-1 text-sm text-gray-500 hover:text-gray-700"
              >
                关闭
              </button>
            </div>
            <div className="px-5 py-3 border-b border-gray-200">
              <div className="inline-flex bg-gray-100 rounded-lg p-1">
                {INVENTORY_AGE_DIMENSION_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setInventoryAgeDimension(opt.key)}
                    className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                      inventoryAgeDimension === opt.key
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 overflow-auto p-5">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="max-h-[min(52vh,520px)] overflow-auto">
                  <table className="w-full text-sm min-w-[480px]">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-2.5 text-center font-medium text-gray-700 border-b w-[72px]">序号</th>
                        <th className="px-4 py-2.5 text-left font-medium text-gray-700 border-b">
                          {inventoryAgeDimensionLabelCol}
                        </th>
                        <th className="px-4 py-2.5 text-right font-medium text-gray-700 border-b">
                          {dataType === 'amount' ? '金额' : '数量'}
                        </th>
                        <th className="px-4 py-2.5 text-right font-medium text-gray-700 border-b">环比</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventoryAgeRows.map((row, idx) => (
                        <tr key={`${row.dimensionName}-${idx}`} className="hover:bg-gray-50">
                          <td className="px-4 py-2.5 border-b text-center text-gray-900">{idx + 1}</td>
                          <td className="px-4 py-2.5 border-b text-gray-800">{row.dimensionName}</td>
                          <td className="px-4 py-2.5 border-b text-right text-gray-900 font-medium">
                            {formatValue(row.value)}
                          </td>
                          <td className={`px-4 py-2.5 border-b text-right font-medium ${momColorClass(row.momRate)}`}>
                            {row.momRate > 0 ? '+' : ''}
                            {row.momRate.toFixed(2)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {analysisModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-[1100px] max-w-[96vw] max-h-[86vh] overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">过量分析</h3>
              <button
                onClick={() => setAnalysisModalOpen(false)}
                className="px-2 py-1 text-sm text-gray-500 hover:text-gray-700"
              >
                关闭
              </button>
            </div>

            <div className="px-5 py-3 border-b border-gray-200 flex flex-wrap items-center gap-3">
              <div className="inline-flex bg-gray-100 rounded-lg p-1">
                {ANALYSIS_LEVEL1_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setAnalysisLevel1(opt.key)}
                    className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                      analysisLevel1 === opt.key
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <div className="inline-flex bg-gray-100 rounded-lg p-1">
                {ANALYSIS_METRIC_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setAnalysisMetric(opt.key)}
                    className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                      analysisMetric === opt.key
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-auto p-5">
              <div className="grid grid-cols-1 lg:grid-cols-[35%_65%] gap-5">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-800 mb-3">
                    {analysisLevel1Label} - {analysisMetricLabel}
                  </h4>
                  <div className="h-[360px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={analysisData.chartData || []}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={95}
                          innerRadius={46}
                          paddingAngle={2}
                        >
                          {(analysisData.chartData || []).map((entry, idx) => (
                            <Cell key={`${entry.name}-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip
                          formatter={(value, name, item) => {
                            const p = item?.payload?.percent ?? 0;
                            return [`${formatValue(value)} (${p}%)`, name];
                          }}
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-800 mb-3">
                    排名明细（{analysisLevel1 === 'category' ? '类目' : 'BU'}）
                  </h4>
                  <div>
                    <table className="w-full table-fixed text-xs">
                      <colgroup>
                        <col style={{ width: '56px' }} />
                        <col style={{ width: '24%' }} />
                        <col style={{ width: '18%' }} />
                        <col style={{ width: '24%' }} />
                        <col style={{ width: '18%' }} />
                      </colgroup>
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-2 py-2 border-b text-center font-medium text-gray-700">序号</th>
                          <th className="px-2 py-2 border-b text-left font-medium text-gray-700">维度名</th>
                          <th className="px-2 py-2 border-b text-right font-medium text-gray-700">
                            {dataType === 'amount' ? '金额' : '数量'}
                          </th>
                          <th className="px-2 py-2 border-b text-right font-medium text-gray-700">
                            较上月差异
                          </th>
                          <th className="px-2 py-2 border-b text-right font-medium text-gray-700">
                            较上月环比
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(analysisData.rankingRows || []).map((row, idx) => (
                          <tr key={`${row.dimensionName}-${idx}`} className="hover:bg-gray-50">
                            <td className="px-2 py-2 border-b text-center text-gray-900">{idx + 1}</td>
                            <td className="px-2 py-2 border-b text-gray-700 truncate" title={row.dimensionName}>
                              {row.dimensionName}
                            </td>
                            <td className="px-2 py-2 border-b text-right text-gray-900 font-medium whitespace-nowrap">
                              {formatValue(row.currentValue)}
                            </td>
                            <td className={`px-2 py-2 border-b text-right font-medium whitespace-nowrap ${momColorClass(row.momDiff)}`}>
                              {row.momDiff > 0 ? '+' : ''}
                              {formatValue(row.momDiff)}
                            </td>
                            <td className={`px-2 py-2 border-b text-right font-medium whitespace-nowrap ${momColorClass(row.momRate)}`}>
                              {row.momRate > 0 ? '+' : ''}
                              {row.momRate.toFixed(2)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExcessDashboardPage;
