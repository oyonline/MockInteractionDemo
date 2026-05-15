// src/pages/supply-chain/ExcessDashboardPage.js
import React, { useEffect, useMemo, useRef, useState } from 'react';
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
const SAFE_METRIC_DEFINITION = [
  { cycle: '0', text: '当月FCST+安全库存' },
  { cycle: '30', text: '当月FCST+下个月FCST+安全库存' },
  { cycle: '60', text: '当月FCST+下2个月FCST+安全库存' },
];

const TOP10_NOTE_FIELDS = [
  { key: 'planReason', label: '计划原因分析' },
  { key: 'actionSuggestion', label: '建议措施' },
  { key: 'operationFeedback', label: '运营反馈' },
];

const getTop10RowKey = (row) => `${row.category || ''}||${row.series || ''}`;

const toArchiveBusKey = (selectedBus = []) => {
  if (!Array.isArray(selectedBus) || selectedBus.length === 0) return '__ALL__';
  return [...selectedBus].sort().join('||');
};

const getArchiveSlice = (record, dataType, selectedBus = []) => {
  const byType = record?.globalSnapshot?.[dataType];
  const key = toArchiveBusKey(selectedBus);
  if (byType && byType[key]) return byType[key];
  if (byType && byType.__ALL__) return byType.__ALL__;
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
  const [buOptions, setBuOptions] = useState([]);
  const [selectedBus, setSelectedBus] = useState([]);
  const [buDropdownOpen, setBuDropdownOpen] = useState(false);
  const [monthOptions, setMonthOptions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [metrics, setMetrics] = useState([]);
  const [mainTableRows, setMainTableRows] = useState([]);
  const [top10Rows, setTop10Rows] = useState([]);
  const [top10NotesMap, setTop10NotesMap] = useState({});
  const [editingCell, setEditingCell] = useState(null);
  const [editingValue, setEditingValue] = useState('');
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
  const [inventoryAgeDrilldown, setInventoryAgeDrilldown] = useState(null);
  const buDropdownRef = useRef(null);
  const inventoryHoverHideTimerRef = useRef(null);
  const [ageWarehouseHover, setAgeWarehouseHover] = useState(null);
  const ageWarehouseHoverTimerRef = useRef(null);

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
    const tabs = supplyChainService.getExcessTabs();
    const options = tabs.filter((item) => item !== '总览');
    setBuOptions(options);
    const months = supplyChainService.getExcessTop10MonthOptions();
    setMonthOptions(months);
    setSelectedMonth(months[0]?.value || '');
  }, []);

  useEffect(() => {
    if (!buDropdownOpen) return;
    const handleClickOutside = (event) => {
      if (!buDropdownRef.current) return;
      if (!buDropdownRef.current.contains(event.target)) {
        setBuDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [buDropdownOpen]);

  useEffect(() => {
    return () => {
      if (inventoryHoverHideTimerRef.current) {
        clearTimeout(inventoryHoverHideTimerRef.current);
      }
      if (ageWarehouseHoverTimerRef.current) {
        clearTimeout(ageWarehouseHoverTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (archiveViewMeta) {
      const slice = getArchiveSlice(archiveViewMeta, dataType, selectedBus);
      setMetrics(slice?.metrics || []);
      setMainTableRows(slice?.mainTableRows || []);
      setTop10Rows(slice?.top10Rows || []);
      setAgeRows(slice?.ageRows || []);
      return;
    }

    const query = { bus: selectedBus, dataType };
    const metricRes = supplyChainService.getExcessMetrics(query);
    const tableRes = supplyChainService.getExcessMainTable(query);
    const top10Res = supplyChainService.getExcessAgingTop10(query);
    const ageRes = supplyChainService.getExcessInventoryAgeComparison(query);

    setMetrics(metricRes?.metrics || []);
    setMainTableRows(tableRes?.rows || []);
    setTop10Rows(top10Res?.rows || []);
    setAgeRows(ageRes?.stages || []);
  }, [selectedBus, dataType, archiveViewMeta]);

  useEffect(() => {
    if (!selectedMonth) return;
    if (mainTableRows.length === 0) {
      setTop10NotesMap({});
      return;
    }
    const rowKeys = mainTableRows.map((row) => getTop10RowKey(row));
    const notes = supplyChainService.getExcessTop10Notes({ month: selectedMonth, rowKeys });
    setTop10NotesMap(notes || {});
  }, [selectedMonth, mainTableRows]);

  const loadArchives = () => {
    const list = supplyChainService.getExcessArchives();
    setArchives(list);
  };

  const handleSaveArchive = () => {
    const buKey = toArchiveBusKey(selectedBus);
    const globalSnapshot = {
      amount: {
        [buKey]: {
          metrics: supplyChainService.getExcessMetrics({ bus: selectedBus, dataType: 'amount' })?.metrics || [],
          mainTableRows: supplyChainService.getExcessMainTable({ bus: selectedBus, dataType: 'amount' })?.rows || [],
          top10Rows: supplyChainService.getExcessAgingTop10({ bus: selectedBus, dataType: 'amount' })?.rows || [],
          ageRows: supplyChainService.getExcessInventoryAgeComparison({ bus: selectedBus, dataType: 'amount' })?.stages || [],
        },
      },
      qty: {
        [buKey]: {
          metrics: supplyChainService.getExcessMetrics({ bus: selectedBus, dataType: 'qty' })?.metrics || [],
          mainTableRows: supplyChainService.getExcessMainTable({ bus: selectedBus, dataType: 'qty' })?.rows || [],
          top10Rows: supplyChainService.getExcessAgingTop10({ bus: selectedBus, dataType: 'qty' })?.rows || [],
          ageRows: supplyChainService.getExcessInventoryAgeComparison({ bus: selectedBus, dataType: 'qty' })?.stages || [],
        },
      },
    };

    const record = supplyChainService.createExcessArchive({
      archiveName: `Excess留档 ${new Date().toLocaleString()}`,
      filters: { dataType, selectedBus },
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
    const archiveBus = Array.isArray(record?.filters?.selectedBus)
      ? record.filters.selectedBus
      : record?.filters?.activeBuTab && record.filters.activeBuTab !== '总览'
        ? [record.filters.activeBuTab]
        : [];
    setSelectedBus(archiveBus);
    setBuDropdownOpen(false);
    setArchivePanelOpen(false);
  };

  const handleExitArchiveView = () => {
    setArchiveViewMeta(null);
  };

  useEffect(() => {
    if (!analysisModalOpen) return;
    const res = supplyChainService.getExcessAnalysisData({
      bus: selectedBus,
      dataType,
      level1: analysisLevel1,
      selectedMetric: analysisMetric,
    });
    setAnalysisData(res || { summary: [], chartData: [], rankingRows: [] });
  }, [analysisModalOpen, selectedBus, dataType, analysisLevel1, analysisMetric]);

  useEffect(() => {
    if (!inventoryAgeModalOpen) return;
    const res = supplyChainService.getInventoryAgeOver365Analysis({
      bus: selectedBus,
      dataType,
      dimension: inventoryAgeDimension,
    });
    setInventoryAgeRows(res?.rows || []);
  }, [inventoryAgeModalOpen, selectedBus, dataType, inventoryAgeDimension]);

  const inventoryAgeDimensionLabelCol = useMemo(() => {
    if (inventoryAgeDimension === 'bu') return 'BU';
    if (inventoryAgeDimension === 'category') return '类目';
    return '仓库';
  }, [inventoryAgeDimension]);

  const inventoryAgeCanDrilldown = useMemo(() => {
    return inventoryAgeDimension === 'category' || inventoryAgeDimension === 'warehouse';
  }, [inventoryAgeDimension]);

  const valueLabel = dataType === 'amount' ? '金额' : '数量';

  const buDisplayText = useMemo(() => {
    if (selectedBus.length === 0) return '全部BU';
    return `已选${selectedBus.length}项`;
  }, [selectedBus]);

  const toggleBuSelection = (bu) => {
    if (archiveViewMeta) return;
    setSelectedBus((prev) => {
      if (prev.includes(bu)) return prev.filter((item) => item !== bu);
      return [...prev, bu];
    });
  };

  const startEditTop10Note = (row, fieldKey) => {
    if (!selectedMonth || archiveViewMeta) return;
    const rowKey = getTop10RowKey(row);
    const currentValue = top10NotesMap?.[rowKey]?.[fieldKey] || '';
    setEditingCell({
      rowKey,
      fieldKey,
      rowLabel: `${row.category || '-'} / ${row.series || '-'}`,
      fieldLabel: TOP10_NOTE_FIELDS.find((item) => item.key === fieldKey)?.label || '',
    });
    setEditingValue(currentValue);
  };

  const saveTop10Note = () => {
    if (!editingCell || !selectedMonth) return;
    const { rowKey, fieldKey } = editingCell;
    const next = supplyChainService.upsertExcessTop10Note({
      month: selectedMonth,
      rowKey,
      patch: { [fieldKey]: editingValue.trim() },
    });
    setTop10NotesMap((prev) => ({
      ...prev,
      [rowKey]: next,
    }));
    setEditingCell(null);
    setEditingValue('');
  };

  const cancelEditTop10Note = () => {
    setEditingCell(null);
    setEditingValue('');
  };

  const clearInventoryHoverHideTimer = () => {
    if (!inventoryHoverHideTimerRef.current) return;
    clearTimeout(inventoryHoverHideTimerRef.current);
    inventoryHoverHideTimerRef.current = null;
  };

  const scheduleInventoryHoverHide = () => {
    clearInventoryHoverHideTimer();
    inventoryHoverHideTimerRef.current = setTimeout(() => {
      setInventoryAgeDrilldown(null);
    }, 120);
  };

  const clearAgeWarehouseHoverHideTimer = () => {
    if (!ageWarehouseHoverTimerRef.current) return;
    clearTimeout(ageWarehouseHoverTimerRef.current);
    ageWarehouseHoverTimerRef.current = null;
  };

  const scheduleAgeWarehouseHoverHide = () => {
    clearAgeWarehouseHoverHideTimer();
    ageWarehouseHoverTimerRef.current = setTimeout(() => {
      setAgeWarehouseHover(null);
    }, 120);
  };

  const handleAgeWarehouseHoverEnter = (stage, event) => {
    clearAgeWarehouseHoverHideTimer();
    const res = supplyChainService.getExcessInventoryAgeWarehouseDrilldown({
      bus: selectedBus,
      dataType,
      stage,
    });
    const panelWidth = 520;
    const panelHeight = 360;
    const margin = 16;
    const left = Math.max(margin, Math.min(event.clientX + 16, window.innerWidth - panelWidth - margin));
    const top = Math.max(margin, Math.min(event.clientY + 12, window.innerHeight - panelHeight - margin));
    setAgeWarehouseHover({
      stage,
      rows: res?.rows || [],
      position: { left, top },
    });
  };

  const handleInventoryAgeDrilldownHover = (row, event) => {
    if (!inventoryAgeCanDrilldown) return;
    const dimensionName = row?.dimensionName;
    if (!dimensionName) return;
    clearInventoryHoverHideTimer();
    const res = supplyChainService.getInventoryAgeOver365DrilldownTop10({
      bus: selectedBus,
      dataType,
      dimension: inventoryAgeDimension,
      dimensionName,
    });
    const panelWidth = 980;
    const panelHeight = 520;
    const margin = 16;
    const left = Math.max(
      margin,
      Math.min(event.clientX + 16, window.innerWidth - panelWidth - margin)
    );
    const top = Math.max(
      margin,
      Math.min(event.clientY + 12, window.innerHeight - panelHeight - margin)
    );
    setInventoryAgeDrilldown({
      dimension: inventoryAgeDimension,
      dimensionName,
      rows: res?.rows || [],
      position: { left, top },
    });
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="p-6 pb-3">
        <div className="bg-white border border-gray-200 rounded-lg overflow-visible">
          <div className="px-4 py-3 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">月份</span>
              <select
                value={selectedMonth}
                onChange={(event) => setSelectedMonth(event.target.value)}
                className="h-8 px-3 text-sm rounded-md border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              >
                {monthOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative" ref={buDropdownRef}>
              <button
                type="button"
                onClick={() => !archiveViewMeta && setBuDropdownOpen((prev) => !prev)}
                className={`h-8 px-3 text-sm rounded-md border transition-colors flex items-center gap-2 ${
                  archiveViewMeta
                    ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
                title={selectedBus.length > 0 ? selectedBus.join('、') : '全部BU'}
              >
                <span>BU：{buDisplayText}</span>
                <span className="text-xs text-gray-500">{buDropdownOpen ? '▲' : '▼'}</span>
              </button>
              {buDropdownOpen && !archiveViewMeta && (
                <div className="absolute left-0 top-10 z-20 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-2">
                  <div className="max-h-64 overflow-auto pr-1">
                    {buOptions.map((bu) => {
                      const checked = selectedBus.includes(bu);
                      return (
                        <label
                          key={bu}
                          className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleBuSelection(bu)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{bu}</span>
                        </label>
                      );
                    })}
                  </div>
                  <div className="pt-2 mt-2 border-t border-gray-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setSelectedBus([])}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      清空（全部BU）
                    </button>
                    <button
                      type="button"
                      onClick={() => setBuDropdownOpen(false)}
                      className="px-2 py-1 text-xs rounded border border-gray-300 text-gray-600 hover:bg-gray-50"
                    >
                      完成
                    </button>
                  </div>
                </div>
              )}
            </div>

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
              <span className="ml-2 text-amber-700/80">（可切换金额/数量，BU按留档快照锁定）</span>
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
                <h3 className="text-sm font-medium text-gray-600 flex items-center gap-1.5">
                  <span>{card.label}</span>
                  {card.key === 'safe' && (
                    <span className="relative inline-flex items-center justify-center group">
                      <button
                        type="button"
                        className="w-4 h-4 rounded-full border border-gray-300 text-[10px] leading-none text-gray-500 hover:text-gray-700 hover:border-gray-400"
                        aria-label="超出周转定义说明"
                      >
                        ?
                      </button>
                      <div className="hidden group-hover:block absolute left-0 top-6 z-20 w-[360px] p-3 rounded-lg border border-emerald-200 bg-emerald-50 shadow-lg text-xs text-gray-700">
                        <div className="font-semibold text-emerald-700 mb-2">超出周转的定义：</div>
                        <table className="w-full border-collapse">
                          <thead>
                            <tr>
                              <th className="text-left font-medium py-1 pr-3 border-b border-emerald-200">补货周期</th>
                              <th className="text-left font-medium py-1 border-b border-emerald-200">周转库存</th>
                            </tr>
                          </thead>
                          <tbody>
                            {SAFE_METRIC_DEFINITION.map((item) => (
                              <tr key={item.cycle}>
                                <td className="py-1 pr-3 align-top">{item.cycle}</td>
                                <td className="py-1">{item.text}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </span>
                  )}
                </h3>
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
            <table className="w-full text-sm min-w-[1540px]">
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
                  {dataType === 'amount' && (
                    <>
                      <th className="px-4 py-3 text-left font-medium text-gray-700 border-b min-w-[220px]">计划原因分析</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700 border-b min-w-[220px]">建议措施</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700 border-b min-w-[220px]">运营反馈</th>
                    </>
                  )}
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
                    {dataType === 'amount' && TOP10_NOTE_FIELDS.map((field) => {
                      const rowKey = getTop10RowKey(row);
                      const cellValue = top10NotesMap?.[rowKey]?.[field.key] || '';
                      return (
                        <td key={`${rowKey}-${field.key}`} className="px-4 py-3 border-b text-gray-700 align-top">
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-gray-700 break-words">{cellValue || '-'}</span>
                            <button
                              type="button"
                              onClick={() => startEditTop10Note(row, field.key)}
                              disabled={!!archiveViewMeta}
                              className={`shrink-0 w-6 h-6 rounded border flex items-center justify-center ${
                                archiveViewMeta
                                  ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                                  : 'border-gray-300 text-gray-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50'
                              }`}
                              title={archiveViewMeta ? '留档回看模式不可编辑' : `编辑${field.label}`}
                            >
                              ✎
                            </button>
                          </div>
                        </td>
                      );
                    })}
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
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2.5 text-left font-medium text-gray-700">库龄段</th>
                      <th className="px-4 py-2.5 text-right font-medium text-gray-700">上期</th>
                      <th className="px-4 py-2.5 text-right font-medium text-gray-700">本期{valueLabel}</th>
                      <th className="px-4 py-2.5 text-right font-medium text-gray-700">差异</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ageRows.map((row) => {
                      const previousValue = row.previousValue ?? 0;
                      const currentValue = row.currentValue ?? row.value ?? 0;
                      const diffValue = row.diffValue ?? (currentValue - previousValue);
                      return (
                        <tr key={row.stage} className="border-t border-gray-200">
                          <td className="px-4 py-2.5 text-gray-800">
                            <button
                              type="button"
                              onMouseEnter={(event) => handleAgeWarehouseHoverEnter(row.stage, event)}
                              onMouseLeave={scheduleAgeWarehouseHoverHide}
                              className="text-left text-blue-600 hover:text-blue-700 hover:underline"
                            >
                              {row.stage}
                            </button>
                          </td>
                          <td className="px-4 py-2.5 text-right text-gray-700">{formatValue(previousValue)}</td>
                          <td className={`px-4 py-2.5 text-right font-medium ${momColorClass(diffValue)}`}>
                            {diffValue > 0 ? '+' : ''}
                            {formatValue(diffValue)}
                          </td>
                          <td className="px-4 py-2.5 text-right text-gray-900 font-medium">{formatValue(currentValue)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
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
                  setInventoryAgeDrilldown(null);
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
                      <td colSpan={3} className="px-3 py-8 text-center text-gray-500">
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
          <div className="bg-white rounded-xl shadow-2xl w-[980px] max-w-[96vw] max-h-[86vh] overflow-hidden flex flex-col">
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
                    onClick={() => {
                      setInventoryAgeDimension(opt.key);
                      setInventoryAgeDrilldown(null);
                    }}
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
                        <th className="px-4 py-2.5 text-right font-medium text-gray-700 border-b">上个月{valueLabel}</th>
                        <th className="px-4 py-2.5 text-right font-medium text-gray-700 border-b">本期{valueLabel}</th>
                        <th className="px-4 py-2.5 text-right font-medium text-gray-700 border-b">差额</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventoryAgeRows.map((row, idx) => (
                        <tr key={`${row.dimensionName}-${idx}`} className="hover:bg-gray-50">
                          <td className="px-4 py-2.5 border-b text-center text-gray-900">{idx + 1}</td>
                          <td className="px-4 py-2.5 border-b text-gray-800">
                            {inventoryAgeCanDrilldown ? (
                              <button
                                type="button"
                                onMouseEnter={(event) => handleInventoryAgeDrilldownHover(row, event)}
                                onMouseLeave={scheduleInventoryHoverHide}
                                className="text-left text-blue-600 hover:text-blue-700 hover:underline"
                              >
                                {row.dimensionName}
                              </button>
                            ) : (
                              row.dimensionName
                            )}
                          </td>
                          <td className="px-4 py-2.5 border-b text-right text-gray-700">
                            {formatValue(row.previousValue)}
                          </td>
                          <td className="px-4 py-2.5 border-b text-right text-gray-900 font-medium">
                            {formatValue(row.currentValue)}
                          </td>
                          <td className={`px-4 py-2.5 border-b text-right font-medium ${momColorClass(row.diffValue)}`}>
                            {row.diffValue > 0 ? '+' : ''}
                            {formatValue(row.diffValue)}
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

      {inventoryAgeDrilldown && (
        <div
          className="fixed z-[70] w-[760px] max-w-[92vw] bg-white rounded-xl border border-gray-200 shadow-2xl"
          style={{
            left: inventoryAgeDrilldown.position?.left || 24,
            top: inventoryAgeDrilldown.position?.top || 24,
          }}
          onMouseEnter={clearInventoryHoverHideTimer}
          onMouseLeave={scheduleInventoryHoverHide}
        >
          <div className="rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">
                {inventoryAgeDrilldown.dimension === 'category' ? '类目' : '仓库'}：{inventoryAgeDrilldown.dimensionName}（描述TOP10）
              </h3>
            </div>
            <div className="overflow-auto p-4">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="max-h-[420px] overflow-auto">
                  <table className="w-full text-sm min-w-[640px]">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-3 py-2.5 text-center font-medium text-gray-700 border-b w-[64px]">序号</th>
                        <th className="px-3 py-2.5 text-left font-medium text-gray-700 border-b">类目</th>
                        <th className="px-3 py-2.5 text-right font-medium text-gray-700 border-b w-[160px]">上个月{valueLabel}</th>
                        <th className="px-3 py-2.5 text-right font-medium text-gray-700 border-b w-[160px]">本期{valueLabel}</th>
                        <th className="px-3 py-2.5 text-right font-medium text-gray-700 border-b w-[140px]">差额</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventoryAgeDrilldown.rows.map((row, idx) => (
                        <tr key={`${row.description}-${row.series}-${idx}`} className="hover:bg-gray-50">
                          <td className="px-3 py-2.5 border-b text-center text-gray-900">{idx + 1}</td>
                          <td className="px-3 py-2.5 border-b text-gray-900">{row.category}</td>
                          <td className="px-3 py-2.5 border-b text-right text-gray-700">
                            {formatValue(row.previousValue)}
                          </td>
                          <td className="px-3 py-2.5 border-b text-right text-gray-900 font-medium">
                            {formatValue(row.currentValue)}
                          </td>
                          <td className={`px-3 py-2.5 border-b text-right font-medium ${momColorClass(row.diffValue)}`}>
                            {row.diffValue > 0 ? '+' : ''}
                            {formatValue(row.diffValue)}
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

      {ageWarehouseHover && (
        <div
          className="fixed z-[70] w-[520px] max-w-[92vw] bg-white rounded-xl border border-gray-200 shadow-2xl"
          style={{
            left: ageWarehouseHover.position?.left || 24,
            top: ageWarehouseHover.position?.top || 24,
          }}
          onMouseEnter={clearAgeWarehouseHoverHideTimer}
          onMouseLeave={scheduleAgeWarehouseHoverHide}
        >
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-xl">
            <h4 className="text-sm font-semibold text-gray-900">下钻：{ageWarehouseHover.stage} 库龄段仓库分布</h4>
          </div>
          <div className="max-h-[320px] overflow-auto rounded-b-xl">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">仓库</th>
                  <th className="px-3 py-2 text-right font-medium text-gray-700 border-b">上个月{valueLabel}</th>
                  <th className="px-3 py-2 text-right font-medium text-gray-700 border-b">本期{valueLabel}</th>
                  <th className="px-3 py-2 text-right font-medium text-gray-700 border-b">差额</th>
                </tr>
              </thead>
              <tbody>
                {ageWarehouseHover.rows.map((item) => (
                  <tr key={item.warehouse} className="hover:bg-gray-50">
                    <td className="px-3 py-2 border-b text-gray-800">{item.warehouse}</td>
                    <td className="px-3 py-2 border-b text-right text-gray-700">{formatValue(item.previousValue)}</td>
                    <td className="px-3 py-2 border-b text-right text-gray-900 font-medium">{formatValue(item.currentValue)}</td>
                    <td className={`px-3 py-2 border-b text-right font-medium ${momColorClass(item.diffValue)}`}>
                      {item.diffValue > 0 ? '+' : ''}
                      {formatValue(item.diffValue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

      {editingCell && (
        <div className="fixed inset-0 z-[60] bg-black/30 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-[640px] max-w-[96vw] overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-900">{editingCell.fieldLabel}</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  月份：{selectedMonth || '-'} ｜ 行：{editingCell.rowLabel}
                </p>
              </div>
              <button
                type="button"
                onClick={cancelEditTop10Note}
                className="px-2 py-1 text-sm text-gray-500 hover:text-gray-700"
              >
                关闭
              </button>
            </div>
            <div className="p-5 space-y-3">
              <textarea
                value={editingValue}
                onChange={(event) => setEditingValue(event.target.value)}
                rows={6}
                className="w-full px-3 py-2 text-sm rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                placeholder={`请输入${editingCell.fieldLabel}`}
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={cancelEditTop10Note}
                  className="px-3 py-1.5 text-sm rounded border border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={saveTop10Note}
                  className="px-3 py-1.5 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExcessDashboardPage;
