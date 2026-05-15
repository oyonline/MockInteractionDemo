// src/pages/supply-chain/SalesForecastManagementPage.js
// 销量预计管理 — 独立功能（mock + localStorage）

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Trash2, Search, PanelLeftClose, PanelLeft, FileUp, Download, LayoutGrid } from 'lucide-react';
import * as supplyChainService from '../../services/supply-chain';
import SafetyStockRuleModal from './SafetyStockRuleModal';

const BU_TABS = [
  { value: 'all', label: 'All' },
  { value: 'KK Amazon', label: 'KK Amazon' },
  { value: 'KK Shopify', label: 'KK Shopify' },
  { value: 'Tik Tok ACCU', label: 'Tik Tok ACCU' },
  { value: 'Tik Tok SEA', label: 'Tik Tok 东南亚' },
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

const SEARCH_TYPES = [{ value: 'sku', label: 'SKU' }];

const SF = supplyChainService.SALES_FORECAST_BU_STATUS;

function periodSummaryBadgeClass(text) {
  if (!text) return 'text-gray-400';
  if (text.includes('驳回')) return 'text-red-700 font-medium';
  if (text.includes('全部已确认')) return 'text-green-700 font-medium';
  if (text.includes('全部待下推')) return 'text-gray-500';
  if (text.includes('校验中') || text.includes('部分')) return 'text-amber-800 font-medium';
  return 'text-blue-800 font-medium';
}

function buTabStatusClass(st) {
  if (!st) return 'text-gray-400';
  if (st === SF.已确认) return 'text-green-700';
  if (st === SF.校验中) return 'text-amber-700';
  if (st === SF.已驳回) return 'text-red-700';
  return 'text-gray-500';
}

/** yyyy-MM → 「YYYY年M月」 */
function formatPlanSuggestHeaderYm(ym) {
  const [y, m] = ym.split('-').map(Number);
  return `${y}年${m}月`;
}

const EXCESS_COLUMN_LABELS = [
  '近6月(业务仓+在途)Excess-货量',
  '近6月(DC)Excess-货量',
  '近6月(未交PO)Excess-货量',
  '过量会议备注',
];

function downloadText(filename, text) {
  const blob = new Blob([text], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const SalesForecastManagementPage = () => {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [periods, setPeriods] = useState([]);
  const [selectedPeriodId, setSelectedPeriodId] = useState(null);
  const [buTab, setBuTab] = useState('all');
  const [productLevel, setProductLevel] = useState('');
  const [shipAttr, setShipAttr] = useState('');
  const [productAttr, setProductAttr] = useState('');
  const [newOld, setNewOld] = useState('');
  const [staffName, setStaffName] = useState('');
  const [searchType, setSearchType] = useState('sku');
  const [skuInput, setSkuInput] = useState('');
  const [skuKeyword, setSkuKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [table, setTable] = useState(null);
  const [toast, setToast] = useState(null);

  const [addPeriodOpen, setAddPeriodOpen] = useState(false);
  const [newPeriodYm, setNewPeriodYm] = useState('2026-06');
  const [logOpen, setLogOpen] = useState(false);
  const [logs, setLogs] = useState([]);
  const [periodBadgeById, setPeriodBadgeById] = useState({});
  const [buStatusByBu, setBuStatusByBu] = useState({});
  const [safetyStockOpen, setSafetyStockOpen] = useState(false);

  const filterOptions = useMemo(() => supplyChainService.getSalesForecastFilterOptions(), []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const reloadPeriods = useCallback(() => {
    const p = supplyChainService.getSalesForecastPeriods();
    setPeriods(p.periods);
    setSelectedPeriodId(p.selectedPeriodId);
    setPeriodBadgeById(p.periodBadgeById || {});
  }, []);

  const reloadTable = useCallback(() => {
    const r = supplyChainService.querySalesForecastRows({
      buTab,
      productLevel,
      shipAttr,
      productAttr,
      newOld,
      staffName,
      skuKeyword,
      page,
      pageSize,
    });
    setTable(r);
    if (selectedPeriodId) {
      setBuStatusByBu(supplyChainService.getSalesForecastBuStatusesForPeriod(selectedPeriodId));
    }
  }, [buTab, productLevel, shipAttr, productAttr, newOld, staffName, skuKeyword, page, pageSize, selectedPeriodId]);

  useEffect(() => {
    reloadPeriods();
  }, [reloadPeriods]);

  // selectedPeriodId：切换期数后需重查（query 读 store 中的选中期）
  useEffect(() => {
    reloadTable();
  }, [reloadTable, selectedPeriodId]);

  const handleSelectPeriod = (id) => {
    supplyChainService.setSalesForecastSelectedPeriod(id);
    setSelectedPeriodId(id);
    setPage(1);
  };

  const handleDeletePeriod = () => {
    if (!selectedPeriodId) {
      showToast('请先选择要删除的期数');
      return;
    }
    if (periods.length <= 1) {
      showToast('至少保留一个 Forecast 期数');
      return;
    }
    if (!window.confirm('确定删除当前选中的 Forecast 期数？')) return;
    const res = supplyChainService.deleteSalesForecastPeriod(selectedPeriodId);
    if (!res?.ok) {
      showToast(res?.message || '删除失败');
      return;
    }
    reloadPeriods();
    setPage(1);
    showToast('已删除期数');
  };

  const handleAddPeriod = () => {
    const res = supplyChainService.addSalesForecastPeriod({ forecastYm: newPeriodYm.trim() });
    if (!res?.ok) {
      showToast(res?.message || '新增失败');
      return;
    }
    reloadPeriods();
    setSelectedPeriodId(res.period.id);
    setAddPeriodOpen(false);
    showToast('已新增期数');
  };

  const handleResetFilters = () => {
    setProductLevel('');
    setShipAttr('');
    setProductAttr('');
    setNewOld('');
    setStaffName('');
    setSkuInput('');
    setSkuKeyword('');
    setBuTab('all');
    setPage(1);
  };

  const handleSearch = () => {
    if (searchType === 'sku') setSkuKeyword(skuInput.trim());
    setPage(1);
  };

  const openLogs = () => {
    setLogs(supplyChainService.getSalesForecastOperationLogs());
    setLogOpen(true);
  };

  const handleExport = () => {
    if (!table?.rows?.length) {
      showToast('无数据可导出');
      return;
    }
    const fkeys = table.monthKeys || [];
    const pkeys = table.planSuggestMonthKeys || [];
    const headers = [
      'BU',
      'SKU',
      ...fkeys,
      '业务人员',
      '基础信息问题标签',
      '问题备注1',
      '数据问题标签',
      '调整原因',
      '问题备注2',
      ...pkeys.map(formatPlanSuggestHeaderYm),
      ...EXCESS_COLUMN_LABELS,
    ];
    const lines = [headers.join(',')];
    table.rows.forEach((r) => {
      const vals = [
        r.bu,
        r.sku,
        ...fkeys.map((k) => r.monthly[k] ?? ''),
        r.staffName,
        r.basicIssueTag,
        r.basicRemark1,
        r.dataIssueTag,
        r.adjustReason,
        r.dataRemark2,
        ...pkeys.map((k) => r.planSuggestQty?.[k] ?? ''),
        r.excessBizTransit,
        r.excessDc,
        r.excessOpenPo,
        r.excessMeetingRemark,
      ];
      lines.push(vals.join(','));
    });
    downloadText(`销量预计导出_${table.period?.forecastYm || 'data'}.csv`, lines.join('\n'));
    showToast('已导出当前页 CSV');
  };

  const handleVerifyExport = () => {
    showToast('forecast校验导出（演示）：已生成占位文件');
    downloadText(`forecast校验_${table?.period?.forecastYm || 'export'}.csv`, 'sku,period,check_status\n');
  };

  const refreshSfViews = useCallback(() => {
    reloadPeriods();
    reloadTable();
  }, [reloadPeriods, reloadTable]);

  const handleSimulateBuPush = () => {
    if (!selectedPeriodId || buTab === 'all') return;
    const r = supplyChainService.simulateSalesForecastBuPush(selectedPeriodId, buTab);
    showToast(r.ok ? '已模拟 BU 数据接入，进入「校验中」' : r.message);
    if (r.ok) refreshSfViews();
  };

  const handleVerifyPass = () => {
    if (!selectedPeriodId || buTab === 'all') return;
    const r = supplyChainService.salesForecastVerifyPass(selectedPeriodId, buTab);
    showToast(r.ok ? '校验通过，当前 BU 已为「已确认」' : r.message);
    if (r.ok) refreshSfViews();
  };

  const handleVerifyReject = () => {
    if (!selectedPeriodId || buTab === 'all') return;
    const r = supplyChainService.salesForecastVerifyReject(selectedPeriodId, buTab);
    showToast(r.ok ? '已驳回，当前 BU 已为「已驳回」，可重新接入后再校验' : r.message);
    if (r.ok) refreshSfViews();
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (selectedPeriodId && buTab !== 'all') {
      const r = supplyChainService.simulateSalesForecastBuPush(selectedPeriodId, buTab);
      showToast(
        r.ok ? `已导入占位「${file.name}」，BU 已进入「校验中」（演示）` : r.message,
      );
      if (r.ok) refreshSfViews();
      return;
    }
    showToast(`已选择文件：${file.name}（请切换到具体 BU 可演示接入后状态流转）`);
  };

  const totalPages = table ? Math.max(1, Math.ceil(table.total / pageSize)) : 1;

  const isAllTab = buTab === 'all';
  const tableLocked = Boolean(table?.pendingPush);
  const currentBuStatus = isAllTab ? null : table?.currentBuStatus ?? buStatusByBu[buTab];
  const pushDisabled =
    !selectedPeriodId ||
    isAllTab ||
    !currentBuStatus ||
    (currentBuStatus !== SF.待下推 && currentBuStatus !== SF.已驳回);
  const verifyActDisabled =
    !selectedPeriodId || isAllTab || currentBuStatus !== SF.校验中;

  return (
    <div className="h-full flex flex-col bg-gray-100 min-h-0">
      {toast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[70] px-4 py-2 rounded-lg bg-gray-900 text-white text-sm shadow-lg">
          {toast}
        </div>
      )}

      <div className="flex flex-1 min-h-0">
        {/* 左侧期数 */}
        <div
          className={`shrink-0 border-r border-gray-200 bg-white flex flex-col transition-[width] duration-200 overflow-hidden ${
            sidebarVisible ? 'w-[320px]' : 'w-0'
          }`}
        >
          <div className="p-3 border-b border-gray-200 flex gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setAddPeriodOpen(true)}
              className="flex-1 px-3 py-1.5 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              新增期数
            </button>
            <button
              type="button"
              onClick={handleDeletePeriod}
              disabled={periods.length <= 1 || !selectedPeriodId}
              className={`flex-1 px-3 py-1.5 text-sm rounded-md border flex items-center justify-center gap-1 ${
                periods.length <= 1 || !selectedPeriodId
                  ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
                  : 'border-gray-300 text-gray-700 hover:bg-red-50 hover:border-red-200 hover:text-red-700'
              }`}
              title={periods.length <= 1 ? '至少保留一期' : '删除当前选中的期数'}
            >
              <Trash2 className="w-3.5 h-3.5" />
              删除期数
            </button>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-2 py-2 text-left font-medium text-gray-600 w-8" />
                  <th className="px-2 py-2 text-left font-medium text-gray-600">Forecast期数</th>
                  <th className="px-2 py-2 text-left font-medium text-gray-600">创建日期</th>
                  <th className="px-2 py-2 text-left font-medium text-gray-600">创建人</th>
                </tr>
              </thead>
              <tbody>
                {periods.map((p) => (
                  <tr
                    key={p.id}
                    className={`border-t border-gray-100 hover:bg-gray-50 cursor-pointer ${
                      selectedPeriodId === p.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => handleSelectPeriod(p.id)}
                  >
                    <td className="px-2 py-2 text-center">
                      <input
                        type="radio"
                        checked={selectedPeriodId === p.id}
                        onChange={() => handleSelectPeriod(p.id)}
                        className="accent-blue-600"
                      />
                    </td>
                    <td className="px-2 py-2 align-top">
                      <div className="text-gray-900 font-medium">{p.forecastYm}</div>
                      <div
                        className={`text-[10px] mt-0.5 leading-snug ${periodSummaryBadgeClass(periodBadgeById[p.id])}`}
                      >
                        {periodBadgeById[p.id] || '—'}
                      </div>
                    </td>
                    <td className="px-2 py-2 text-gray-600">
                      {p.createdAt ? String(p.createdAt).slice(0, 10) : '-'}
                    </td>
                    <td className="px-2 py-2 text-gray-600">{p.creator || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 右侧主区 */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          <div className="bg-white border-b border-gray-200 px-4 py-3 shrink-0">
            <h1 className="text-lg font-semibold text-gray-900">销量预计管理</h1>
            <p className="text-xs text-gray-500 mt-0.5">Forecast 期数与 SKU 月度销量维护（演示原型）</p>
            {!isAllTab && (
              <p className="text-xs mt-1 text-gray-700">
                当前 BU 状态：
                <span className={`font-medium ${buTabStatusClass(currentBuStatus)}`}>
                  {currentBuStatus || SF.待下推}
                </span>
                {tableLocked && (
                  <span className="text-amber-800 ml-2">接入后可查看 SKU 明细与导出。</span>
                )}
              </p>
            )}
          </div>

          {/* BU — 标签页样式 */}
          <div className="bg-white shrink-0 overflow-x-auto">
            <nav
              className="flex gap-0 min-w-max border-b border-gray-200 px-2"
              role="tablist"
              aria-label="BU 筛选"
            >
              {BU_TABS.map((t) => {
                const active = buTab === t.value;
                return (
                  <button
                    key={t.value}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => {
                      setBuTab(t.value);
                      setPage(1);
                    }}
                    className={`relative px-4 py-2 text-sm whitespace-nowrap border-b-2 -mb-px transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2 rounded-t ${
                      active
                        ? 'border-blue-600 text-blue-600 font-semibold'
                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    }`}
                  >
                    <span className="flex flex-col items-center gap-0.5 leading-tight">
                      <span>{t.label}</span>
                      {t.value !== 'all' && (
                        <span
                          className={`text-[10px] font-normal max-w-[6.5rem] truncate ${buTabStatusClass(buStatusByBu[t.value])}`}
                          title={buStatusByBu[t.value] || SF.待下推}
                        >
                          {buStatusByBu[t.value] || SF.待下推}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* 筛选：产品层级 / 运输方式 / 产品属性 / 新老品 / 业务人员 / SKU */}
          <div className="bg-white border-b border-gray-200 px-4 py-3 shrink-0">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <select
                value={productLevel}
                onChange={(e) => {
                  setProductLevel(e.target.value);
                  setPage(1);
                }}
                className="border border-gray-300 rounded-md px-2 py-1.5 text-gray-800 bg-white min-w-[108px]"
              >
                <option value="">产品层级</option>
                {filterOptions.productLevels.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
              <select
                value={shipAttr}
                onChange={(e) => {
                  setShipAttr(e.target.value);
                  setPage(1);
                }}
                className="border border-gray-300 rounded-md px-2 py-1.5 text-gray-800 bg-white min-w-[108px]"
              >
                <option value="">运输方式</option>
                {filterOptions.shipAttrs.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
              <select
                value={productAttr}
                onChange={(e) => {
                  setProductAttr(e.target.value);
                  setPage(1);
                }}
                className="border border-gray-300 rounded-md px-2 py-1.5 text-gray-800 bg-white min-w-[108px]"
              >
                <option value="">产品属性</option>
                {filterOptions.productAttrs.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
              <select
                value={newOld}
                onChange={(e) => {
                  setNewOld(e.target.value);
                  setPage(1);
                }}
                className="border border-gray-300 rounded-md px-2 py-1.5 text-gray-800 bg-white"
              >
                <option value="">新老品</option>
                {filterOptions.newOlds.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
              <select
                value={staffName}
                onChange={(e) => {
                  setStaffName(e.target.value);
                  setPage(1);
                }}
                className="border border-gray-300 rounded-md px-2 py-1.5 text-gray-800 bg-white min-w-[108px]"
              >
                <option value="">业务人员</option>
                {filterOptions.staffNames.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
              <div className="flex flex-1 items-stretch min-w-[280px] max-w-xl border border-gray-300 rounded-md overflow-hidden bg-white">
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="shrink-0 px-2 py-1.5 border-0 bg-gray-50 text-gray-700 text-sm"
                >
                  {SEARCH_TYPES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <input
                  value={skuInput}
                  onChange={(e) => setSkuInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="请输入SKU"
                  className="flex-1 min-w-[140px] px-2 py-1.5 text-sm outline-none border-0 border-l border-gray-200"
                />
                <div className="flex items-center shrink-0 border-l border-gray-200 bg-gray-50 px-0.5">
                  <button
                    type="button"
                    onClick={handleSearch}
                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded"
                    title="搜索"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className="p-1.5 text-gray-400 hover:bg-gray-100 rounded"
                    title="批量/扫码（演示）"
                    tabIndex={-1}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                重置
              </button>
            </div>
          </div>

          {/* 工具栏 */}
          <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex flex-wrap gap-2 shrink-0 items-center">
            <button
              type="button"
              onClick={openLogs}
              className="px-3 py-1.5 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              操作日志
            </button>
            {!isAllTab && (
              <>
                <button
                  type="button"
                  onClick={handleSimulateBuPush}
                  disabled={pushDisabled}
                  title={
                    pushDisabled
                      ? currentBuStatus === SF.校验中 || currentBuStatus === SF.已确认
                        ? `当前为「${currentBuStatus}」，无需重复接入`
                        : !selectedPeriodId
                          ? '请先选择期数'
                          : ''
                      : '模拟下推/上传完成后进入「校验中」'
                  }
                  className={`px-3 py-1.5 text-sm rounded-md border ${
                    pushDisabled
                      ? 'border-gray-200 text-gray-400 bg-gray-100 cursor-not-allowed'
                      : 'border-blue-200 text-blue-800 bg-white hover:bg-blue-50'
                  }`}
                >
                  模拟 BU 下推
                </button>
                <button
                  type="button"
                  onClick={handleVerifyPass}
                  disabled={verifyActDisabled}
                  title={verifyActDisabled ? '仅「校验中」可通过' : '校验通过 → 已确认'}
                  className={`px-3 py-1.5 text-sm rounded-md border ${
                    verifyActDisabled
                      ? 'border-gray-200 text-gray-400 bg-gray-100 cursor-not-allowed'
                      : 'border-green-200 text-green-800 bg-white hover:bg-green-50'
                  }`}
                >
                  校验通过
                </button>
                <button
                  type="button"
                  onClick={handleVerifyReject}
                  disabled={verifyActDisabled}
                  title={verifyActDisabled ? '仅「校验中」可驳回' : '驳回 → 已驳回'}
                  className={`px-3 py-1.5 text-sm rounded-md border ${
                    verifyActDisabled
                      ? 'border-gray-200 text-gray-400 bg-gray-100 cursor-not-allowed'
                      : 'border-orange-200 text-orange-900 bg-white hover:bg-orange-50'
                  }`}
                >
                  校验驳回
                </button>
              </>
            )}
            <label className="px-3 py-1.5 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 cursor-pointer inline-flex items-center gap-1">
              <FileUp className="w-3.5 h-3.5" />
              导入上传备份
              <input type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={handleImport} />
            </label>
            <button
              type="button"
              onClick={handleExport}
              disabled={tableLocked}
              title={tableLocked ? '待接入确认后可导出当前 BU 明细' : ''}
              className={`px-3 py-1.5 text-sm rounded-md border inline-flex items-center gap-1 ${
                tableLocked
                  ? 'border-gray-200 text-gray-400 bg-gray-100 cursor-not-allowed'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              导出
            </button>
            <button
              type="button"
              onClick={handleVerifyExport}
              disabled={tableLocked}
              title={tableLocked ? '待接入后可导出校验视图' : ''}
              className={`px-3 py-1.5 text-sm rounded-md border ${
                tableLocked
                  ? 'border-gray-200 text-gray-400 bg-gray-100 cursor-not-allowed'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              forecast校验导出
            </button>
            {!isAllTab && (
              <button
                type="button"
                onClick={() => currentBuStatus === SF.已确认 && setSafetyStockOpen(true)}
                disabled={currentBuStatus !== SF.已确认}
                title={
                  currentBuStatus !== SF.已确认
                    ? `仅「${SF.已确认}」后可维护安全库存规则（当前「${currentBuStatus || SF.待下推}」）`
                    : '打开安全库存规则（原型示意）'
                }
                className={`px-3 py-1.5 text-sm rounded-md border ${
                  currentBuStatus !== SF.已确认
                    ? 'border-gray-200 text-gray-400 bg-gray-100 cursor-not-allowed'
                    : 'border-violet-200 text-violet-900 bg-white hover:bg-violet-50'
                }`}
              >
                安全库存规则设置
              </button>
            )}
            <button
              type="button"
              onClick={() => setSidebarVisible((v) => !v)}
              className="px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 inline-flex items-center gap-1 ml-auto"
            >
              {sidebarVisible ? (
                <>
                  <PanelLeftClose className="w-4 h-4" />
                  隐藏左侧
                </>
              ) : (
                <>
                  <PanelLeft className="w-4 h-4" />
                  显示左侧
                </>
              )}
            </button>
          </div>

          {/* 表格 */}
          <div className="flex-1 min-h-0 flex flex-col min-w-0 overflow-hidden bg-white">
            {table?.pendingPush && (
              <div className="shrink-0 mx-4 mt-3 px-3 py-2 rounded-md bg-amber-50 border border-amber-200 text-sm text-amber-950">
                当前 BU 为「待下推」：请先使用工具栏「模拟 BU 下推」或在具体 BU 下「导入上传备份」，接入成功后进入「校验中」再维护明细。
              </div>
            )}
            <div className="flex-1 min-h-0 overflow-auto">
            <table className="min-w-[4540px] w-full text-xs border-collapse">
              <thead className="sticky top-0 z-20 shadow-sm bg-gray-50">
                <tr>
                  <th
                    rowSpan={2}
                    className="sticky left-0 z-40 bg-gray-50 px-2 py-2 border-b border-r border-gray-200 text-left font-medium text-gray-700 whitespace-nowrap min-w-[88px] align-middle"
                  >
                    BU
                  </th>
                  <th
                    rowSpan={2}
                    className="sticky left-[88px] z-40 bg-gray-50 px-2 py-2 border-b border-r border-gray-200 text-left font-medium text-gray-700 whitespace-nowrap min-w-[140px] align-middle"
                  >
                    SKU
                  </th>
                  {[
                    '发货指数',
                    '采购间隔',
                    '补货间隔',
                    '物流发运周期',
                    '物流下单天数',
                    '仓库作业天数',
                    '最早销售日期',
                    '新老品',
                    '产品层级',
                    '运输方式',
                    '运输周期',
                    '产品属性',
                    '安全库存天数',
                    '上架天数',
                    '业务人员',
                  ].map((h) => (
                    <th
                      key={h}
                      rowSpan={2}
                      className="bg-gray-50 px-2 py-2 border-b border-gray-200 text-left font-medium text-gray-700 whitespace-nowrap align-middle"
                    >
                      {h}
                    </th>
                  ))}
                  {(table?.monthKeys || []).map((mk) => (
                    <th
                      key={mk}
                      rowSpan={2}
                      className="bg-gray-50 px-2 py-2 border-b border-gray-200 text-left font-medium text-blue-700 whitespace-nowrap min-w-[72px] align-middle"
                    >
                      {mk}
                    </th>
                  ))}
                  <th
                    colSpan={2}
                    className="sticky top-0 z-[35] bg-sky-100 px-1 py-2 border-b border-gray-200 text-center text-xs font-semibold text-gray-800 align-middle"
                  >
                    基础信息问题标签栏
                  </th>
                  <th
                    colSpan={3}
                    className="sticky top-0 z-[35] bg-sky-100 px-1 py-2 border-b border-gray-200 text-center text-xs font-semibold text-gray-800 align-middle"
                  >
                    数据问题标签栏
                  </th>
                  <th
                    colSpan={5}
                    className="sticky top-0 z-[35] bg-sky-100 px-1 py-2 border-b border-gray-200 text-center text-xs font-semibold text-gray-800 align-middle"
                  >
                    计划建议数量 (只校验五个月)
                  </th>
                  <th
                    colSpan={4}
                    className="sticky top-0 z-[35] bg-sky-100 px-1 py-2 border-b border-gray-200 text-center text-xs font-semibold text-gray-800 align-middle"
                  >
                    过量数据栏
                  </th>
                </tr>
                <tr>
                  <th className="bg-amber-50 px-2 py-2.5 border-b border-gray-200 text-center text-[11px] font-medium text-red-600 whitespace-nowrap min-w-[148px]">
                    基础信息问题标签
                  </th>
                  <th className="bg-amber-50 px-2 py-2.5 border-b border-gray-200 text-center text-[11px] font-medium text-red-600 min-w-[228px]">
                    问题备注1
                  </th>
                  <th className="bg-amber-50 px-2 py-2.5 border-b border-gray-200 text-center text-[11px] font-medium text-red-600 whitespace-nowrap min-w-[140px]">
                    数据问题标签
                  </th>
                  <th className="bg-amber-50 px-2 py-2.5 border-b border-gray-200 text-center text-[11px] font-medium text-red-600 whitespace-nowrap min-w-[140px]">
                    调整原因
                  </th>
                  <th className="bg-amber-50 px-2 py-2.5 border-b border-gray-200 text-center text-[11px] font-medium text-red-600 min-w-[228px]">
                    问题备注2
                  </th>
                  {(table?.planSuggestMonthKeys || []).map((pk) => (
                    <th
                      key={pk}
                      className="bg-amber-50 px-2 py-2 border-b border-gray-200 text-center text-[10px] font-medium text-red-600 whitespace-nowrap min-w-[96px]"
                    >
                      {formatPlanSuggestHeaderYm(pk)}
                    </th>
                  ))}
                  {EXCESS_COLUMN_LABELS.map((label, idx) => (
                    <th
                      key={label}
                      className={`bg-teal-50 py-2.5 border-b border-gray-200 text-center font-medium text-red-600 ${
                        idx < 3
                          ? 'px-2 text-[10px] whitespace-nowrap min-w-[240px]'
                          : 'px-2 text-[11px] whitespace-nowrap min-w-[152px]'
                      }`}
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(table?.rows || []).map((row) => (
                  <tr key={row.id} className="hover:bg-blue-50/40 border-b border-gray-100">
                    <td className="sticky left-0 z-10 bg-white px-2 py-2 border-r border-gray-100 text-gray-800 whitespace-nowrap">
                      {row.bu}
                    </td>
                    <td className="sticky left-[88px] z-10 bg-white px-2 py-2 border-r border-gray-100 text-gray-900 font-mono whitespace-nowrap">
                      {row.sku}
                    </td>
                    <td className="px-2 py-2 text-gray-700">{row.shipIndex}</td>
                    <td className="px-2 py-2 text-gray-700">{row.purchaseInterval}</td>
                    <td className="px-2 py-2 text-gray-700">{row.replenishmentInterval}</td>
                    <td className="px-2 py-2 text-gray-700">{row.logisticsShipCycle}</td>
                    <td className="px-2 py-2 text-gray-700">{row.logisticsOrderDays}</td>
                    <td className="px-2 py-2 text-gray-700">{row.warehouseOpDays}</td>
                    <td className="px-2 py-2 text-gray-700 whitespace-nowrap">{row.earliestSalesDate}</td>
                    <td className="px-2 py-2 text-gray-700">{row.newOld}</td>
                    <td className="px-2 py-2 text-gray-700">{row.productLevel}</td>
                    <td className="px-2 py-2 text-gray-700">{row.shipAttr}</td>
                    <td className="px-2 py-2 text-gray-700">{row.shipCycleDays}</td>
                    <td className="px-2 py-2 text-gray-700">{row.productAttr}</td>
                    <td className="px-2 py-2 text-gray-700">{row.safetyStockDays}</td>
                    <td className="px-2 py-2 text-gray-700">{row.listingDays}</td>
                    <td className="px-2 py-2 text-gray-700">{row.staffName}</td>
                    {(table?.monthKeys || []).map((mk) => (
                      <td key={mk} className="px-2 py-2 text-gray-800 tabular-nums">
                        {row.monthly[mk] ?? '-'}
                      </td>
                    ))}
                    <td className="px-2 py-2 text-gray-800 text-center border-l border-gray-200 min-w-[148px] whitespace-nowrap">
                      {row.basicIssueTag ?? '—'}
                    </td>
                    <td className="px-2 py-2 text-gray-700 text-center text-[11px] leading-snug min-w-[228px]">
                      {row.basicRemark1 ?? '—'}
                    </td>
                    <td className="px-2 py-2 text-gray-800 text-center min-w-[140px] whitespace-nowrap">
                      {row.dataIssueTag ?? '—'}
                    </td>
                    <td className="px-2 py-2 text-gray-700 text-center text-[11px] min-w-[140px] whitespace-nowrap">
                      {row.adjustReason ?? '—'}
                    </td>
                    <td className="px-2 py-2 text-gray-700 text-center text-[11px] leading-snug min-w-[228px]">
                      {row.dataRemark2 ?? '—'}
                    </td>
                    {(table?.planSuggestMonthKeys || []).map((pk) => (
                      <td
                        key={pk}
                        className="px-2 py-2 text-gray-800 tabular-nums text-center bg-amber-50/30 whitespace-nowrap min-w-[96px]"
                      >
                        {row.planSuggestQty?.[pk] ?? '-'}
                      </td>
                    ))}
                    <td className="px-2 py-2 text-gray-800 tabular-nums text-center border-l border-teal-100 bg-teal-50/25 whitespace-nowrap min-w-[240px]">
                      {row.excessBizTransit ?? '—'}
                    </td>
                    <td className="px-2 py-2 text-gray-800 tabular-nums text-center bg-teal-50/25 whitespace-nowrap min-w-[240px]">
                      {row.excessDc ?? '—'}
                    </td>
                    <td className="px-2 py-2 text-gray-800 tabular-nums text-center bg-teal-50/25 whitespace-nowrap min-w-[240px]">
                      {row.excessOpenPo ?? '—'}
                    </td>
                    <td className="px-2 py-2 text-gray-700 text-center text-[11px] min-w-[152px] max-w-[220px] bg-teal-50/25 break-words">
                      {row.excessMeetingRemark ?? '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!table?.rows?.length && table && !table.pendingPush && (
              <div className="py-16 text-center text-gray-500 text-sm">暂无数据</div>
            )}
            </div>
          </div>

          {/* 分页 */}
          <div className="bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-end gap-3 text-sm shrink-0">
            <span className="text-gray-600">共 {table?.total ?? 0} 条</span>
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-2 py-1 rounded border border-gray-300 disabled:opacity-40"
            >
              上一页
            </button>
            <span className="text-gray-700">
              {page} / {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-2 py-1 rounded border border-gray-300 disabled:opacity-40"
            >
              下一页
            </button>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="border border-gray-300 rounded px-2 py-1"
            >
              {[10, 20, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n}条/页
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 安全库存逻辑设定 */}
      <SafetyStockRuleModal
        open={safetyStockOpen}
        periodId={selectedPeriodId}
        periodYm={table?.period?.forecastYm}
        bu={buTab}
        onClose={() => setSafetyStockOpen(false)}
        onSaved={() => showToast('已保存安全库存规则')}
      />

      {/* 新增期数 */}
      {addPeriodOpen && (
        <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-5">
            <h3 className="text-base font-semibold text-gray-900 mb-3">新增 Forecast 期数</h3>
            <label className="block text-sm text-gray-600 mb-1">期数（YYYY-MM）</label>
            <input
              value={newPeriodYm}
              onChange={(e) => setNewPeriodYm(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mb-4"
              placeholder="2026-06"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setAddPeriodOpen(false)}
                className="px-3 py-1.5 text-sm rounded-md border border-gray-300"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleAddPeriod}
                className="px-3 py-1.5 text-sm rounded-md bg-blue-600 text-white"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 操作日志 */}
      {logOpen && (
        <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col">
            <div className="px-5 py-3 border-b flex justify-between items-center">
              <h3 className="text-base font-semibold">操作日志</h3>
              <button type="button" onClick={() => setLogOpen(false)} className="text-gray-500 text-sm">
                关闭
              </button>
            </div>
            <div className="p-4 overflow-auto text-sm">
              {logs.length === 0 ? (
                <p className="text-gray-500">暂无记录</p>
              ) : (
                <ul className="space-y-2">
                  {logs.map((l) => (
                    <li key={l.id} className="border-b border-gray-100 pb-2">
                      <div className="text-gray-800">
                        <span className="font-medium">{l.action}</span>
                        {l.detail ? ` · ${l.detail}` : ''}
                      </div>
                      <div className="text-xs text-gray-500">{l.at}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SalesForecastManagementPage;
