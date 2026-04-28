// src/pages/supply-chain/SupplyPlanPage.js
//
// 供应计划管理（原型级）：基于已推送的销售预测版本生成供应计划，写入 mockStore，刷新保留。
//
// 数据闭环：
//   SalesForecastPage（推送 V3）
//     → mockStore[SALES_FORECAST_PAGE_STATE].versions[].status === 'pending_plan'
//     → 本页"基于销售预测生成"按钮读取上述快照、解析 forecastData、抽取 SKU + 月份 + forecast 值
//     → 映射成 SupplyPlan 行写入 mockStore[SUPPLY_PLANS]
//     → 刷新仍在
//
// 不做：真实供应链算法、采购单、库存调整、跨页通知。

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ClipboardList, Calendar, Filter, Plus, Search, Truck, Package, Clock,
  Sparkles, RotateCcw, AlertTriangle,
} from 'lucide-react';
import { toast } from '../../components/ui/Toast';
import { mockStore } from '../../services/_mockStore';
import { SUPPLY_PLANS, SALES_FORECAST_PAGE_STATE } from '../../utils/storageKeys';

/* ============================== 工具与常量 ============================== */

const STATUS_META = {
  pending_confirm: { label: '待确认', cls: 'bg-warning-50 text-warning-700 border-warning-100' },
  generated:       { label: '已生成', cls: 'bg-brand-50 text-brand-700 border-brand-100' },
  confirmed:       { label: '已确认', cls: 'bg-success-50 text-success-700 border-success-100' },
  adjusted:        { label: '已调整', cls: 'bg-slate-100 text-slate-700 border-slate-200' },
};

const STATUS_OPTIONS = [
  { value: '', label: '全部状态' },
  { value: 'pending_confirm', label: '待确认' },
  { value: 'generated', label: '已生成' },
  { value: 'confirmed', label: '已确认' },
  { value: 'adjusted', label: '已调整' },
];

const WAREHOUSES = ['深圳备货仓', '宁波备货仓', '美西海外仓', '德国海外仓', '上海中转仓'];
const SUPPLIERS = ['深圳市渔具制造有限公司', '厦门海钓渔具有限公司', '广州龙鱼渔具厂'];

function nowStr() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function genPlanNo(idx) {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  return `PLAN-${ymd}-${String(idx).padStart(3, '0')}`;
}

/** 给定 SKU + 月份 + 预测数量，返回一行供应计划。
 *  库存与安全库存用伪随机但稳定的 mock，suggestedSupplyQty = max(0, forecast + safety - stock)。 */
function buildPlanRow({ idx, skuId, skuName, month, forecastQty, generatedFrom }) {
  const seed = (skuId || '').length + (month || '').length + idx;
  const currentStock = 200 + ((seed * 73) % 1500);
  const safetyStock = 80 + ((seed * 17) % 220);
  const suggestedSupplyQty = Math.max(0, (forecastQty || 0) + safetyStock - currentStock);
  const gapQty = (forecastQty || 0) - currentStock;
  return {
    id: `sp-${Date.now()}-${idx}`,
    planNo: genPlanNo(idx + 1),
    skuId,
    skuName,
    month,
    forecastQty: forecastQty || 0,
    suggestedSupplyQty,
    currentStock,
    safetyStock,
    gapQty,
    warehouse: WAREHOUSES[seed % WAREHOUSES.length],
    supplierName: SUPPLIERS[seed % SUPPLIERS.length],
    status: 'pending_confirm',
    generatedFrom: generatedFrom || 'fallback',
    generatedAt: nowStr(),
    updatedAt: nowStr(),
  };
}

/** 浅层解析 SalesForecastPage 持久化的 allVersions：
 *   - 优先选择 status === 'pending_plan' 的版本（任一 BU、任一月份）
 *   - 解析其 forecastData：PL[] → SPU[] → SKU[]，扁平化所有 SKU
 *   - 对每个 SKU 用其 monthlyData[0] 的 forecast 值（即次月）
 *   返回 { plans, sourceVersion } 或 null（未找到任何已推送版本）。 */
function tryGenerateFromForecast() {
  const state = mockStore.get(SALES_FORECAST_PAGE_STATE);
  if (!state || typeof state !== 'object') return null;

  // 找 status === 'pending_plan' 的最新版本
  let chosen = null;
  for (const key of Object.keys(state)) {
    const versions = state[key]?.versions;
    if (!Array.isArray(versions)) continue;
    const v = versions.find((x) => x?.status === 'pending_plan');
    if (v) {
      chosen = { key, version: v, dept: state[key].dept, month: state[key].month };
      break;
    }
  }
  if (!chosen) return null;

  // 扁平化所有 SKU
  const flat = [];
  const fdata = Array.isArray(chosen.version.forecastData) ? chosen.version.forecastData : [];
  fdata.forEach((pl) => {
    (pl?.spus || []).forEach((spu) => {
      (spu?.skus || []).forEach((sku) => {
        flat.push({
          skuId: sku?.id,
          skuName: sku?.name || sku?.id,
          monthlyData: Array.isArray(sku?.monthlyData) ? sku.monthlyData : [],
        });
      });
    });
  });
  if (flat.length === 0) return null;

  // 取前 8 个 SKU 用 monthlyData[0] 的 forecast 生成行
  const targetMonth = chosen.month || '次月';
  const plans = flat.slice(0, 8).map((s, idx) =>
    buildPlanRow({
      idx,
      skuId: s.skuId,
      skuName: s.skuName,
      month: targetMonth,
      forecastQty: Math.round(Number(s.monthlyData?.[0]?.forecast) || 0),
      generatedFrom: chosen.version.id,
    })
  );
  return { plans, sourceVersion: chosen.version, dept: chosen.dept, month: chosen.month };
}

/** 找不到预测时使用的演示数据（保持跨页面 SKU 命名一致）。 */
function buildFallbackPlans() {
  const seeds = [
    { skuId: 'SKU-FW-2026-001-A', skuName: 'KingKong 路亚竿 1.8m ML 调', month: '2026-04', forecastQty: 1280 },
    { skuId: 'SKU-FW-2026-001-B', skuName: 'KingKong 路亚竿 2.1m M 调',  month: '2026-04', forecastQty: 1640 },
    { skuId: 'SKU-FW-2026-001-C', skuName: 'KingKong 路亚竿 2.4m MH 调', month: '2026-04', forecastQty: 2050 },
    { skuId: 'SKU-FW-2026-001-A', skuName: 'KingKong 路亚竿 1.8m ML 调', month: '2026-05', forecastQty: 1320 },
    { skuId: 'SKU-FW-2026-001-B', skuName: 'KingKong 路亚竿 2.1m M 调',  month: '2026-05', forecastQty: 1720 },
    { skuId: 'SKU-FW-2026-001-C', skuName: 'KingKong 路亚竿 2.4m MH 调', month: '2026-05', forecastQty: 2180 },
  ];
  return seeds.map((s, idx) => buildPlanRow({ ...s, idx, generatedFrom: 'fallback' }));
}

/* ============================== 子组件 ============================== */

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.pending_confirm;
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${meta.cls}`}>
      {meta.label}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, tone = 'brand' }) {
  const map = {
    brand:   'bg-brand-50 text-brand-700',
    warning: 'bg-warning-50 text-warning-700',
    success: 'bg-success-50 text-success-700',
    danger:  'bg-danger-50 text-danger-700',
  };
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-white p-4">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${map[tone] || map.brand}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs text-text-subtle">{label}</p>
        <p className="mt-0.5 text-xl font-semibold text-text">{value}</p>
      </div>
    </div>
  );
}

/* ============================== 主组件 ============================== */

const SupplyPlanPage = () => {
  // 优先从 storage 读，没数据走空数组（首次进入展示 Empty State + 引导生成）
  const [plans, setPlans] = useState(() => {
    const v = mockStore.get(SUPPLY_PLANS);
    return Array.isArray(v) ? v : [];
  });

  // 自动同步：任何 setPlans 后写回 storage，保证刷新仍在
  useEffect(() => {
    mockStore.set(SUPPLY_PLANS, plans);
  }, [plans]);

  // 筛选 state
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  /** 基于销售预测生成供应计划（核心动作） */
  const handleGenerateFromForecast = useCallback(() => {
    try {
      const result = tryGenerateFromForecast();
      if (result && Array.isArray(result.plans) && result.plans.length > 0) {
        setPlans(result.plans);
        toast.success(`供应计划已生成（基于预测版本 ${result.version?.id || '已推送计划'}，共 ${result.plans.length} 条）`);
        return;
      }
      // 找不到已推送预测：使用 fallback，并 warning 告知
      const fb = buildFallbackPlans();
      setPlans(fb);
      toast.warning('未找到已推送预测，已使用演示数据生成');
    } catch (err) {
      toast.error('生成失败：解析销售预测数据时出错');
    }
  }, []);

  /** 重置：清空已生成计划，回到空态 */
  const handleReset = useCallback(() => {
    setPlans([]);
    toast.info('供应计划已重置');
  }, []);

  const filtered = useMemo(() => {
    const k = keyword.trim().toLowerCase();
    return plans.filter((p) => {
      const matchKeyword = !k || (p.planNo || '').toLowerCase().includes(k)
        || (p.skuId || '').toLowerCase().includes(k)
        || (p.skuName || '').toLowerCase().includes(k)
        || (p.supplierName || '').toLowerCase().includes(k);
      const matchStatus = !statusFilter || p.status === statusFilter;
      return matchKeyword && matchStatus;
    });
  }, [plans, keyword, statusFilter]);

  const stats = useMemo(() => ({
    total: plans.length,
    pending: plans.filter((p) => p.status === 'pending_confirm').length,
    confirmed: plans.filter((p) => p.status === 'confirmed').length,
    gapPositive: plans.filter((p) => (p.gapQty || 0) > 0).length,
  }), [plans]);

  const hasPlans = plans.length > 0;

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* 页面标题 */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">供应计划管理</h1>
            <p className="text-sm text-gray-500 mt-1">基于销售预测生成供应建议；采购计划、生产计划与库存规划</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleGenerateFromForecast}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
            >
              <Sparkles className="h-4 w-4" />
              基于销售预测生成
            </button>
            {hasPlans && (
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text-muted transition-colors hover:bg-surface-subtle"
              >
                <RotateCcw className="h-4 w-4" />
                重置
              </button>
            )}
            <button
              type="button"
              onClick={() => toast.info('演示功能：手动新建计划将在 V2 支持')}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text-muted transition-colors hover:bg-surface-subtle"
            >
              <Plus className="h-4 w-4" />
              新建计划
            </button>
          </div>
        </div>
      </div>

      {/* 筛选栏 */}
      <div className="bg-white border-b px-6 py-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700">2026 年</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-sm text-gray-700 focus:outline-none"
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value || 'all'} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜索计划编号 / SKU / 供应商..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-auto p-6">
        {/* 统计行（有计划时显示） */}
        {hasPlans && (
          <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            <StatCard icon={ClipboardList} label="计划总数" value={stats.total} tone="brand" />
            <StatCard icon={Clock} label="待确认" value={stats.pending} tone="warning" />
            <StatCard icon={Truck} label="已确认" value={stats.confirmed} tone="success" />
            <StatCard icon={AlertTriangle} label="缺口预警条数" value={stats.gapPositive} tone="danger" />
          </div>
        )}

        {/* 表格 / 空态 */}
        {!hasPlans ? (
          <div className="bg-white rounded-lg border border-dashed border-gray-300 p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                <ClipboardList className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无供应计划</h3>
              <p className="text-sm text-gray-500 max-w-md mb-6">
                此页面用于基于销售预测自动生成采购、生产与库存计划。点击右上角「基于销售预测生成」开始演示。
              </p>
              <div className="flex gap-3">
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm">采购计划</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm">生产计划</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm">库存规划</span>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-6 max-w-3xl">
                <div className="rounded-lg border bg-white p-4 text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <Truck className="w-4 h-4 text-blue-500" />
                    <h4 className="text-sm font-medium text-gray-800">采购计划</h4>
                  </div>
                  <p className="text-xs text-gray-500">基于预测生成采购建议，管理供应商交期</p>
                </div>
                <div className="rounded-lg border bg-white p-4 text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-4 h-4 text-purple-500" />
                    <h4 className="text-sm font-medium text-gray-800">生产计划</h4>
                  </div>
                  <p className="text-xs text-gray-500">协调生产排程，优化产能利用率</p>
                </div>
                <div className="rounded-lg border bg-white p-4 text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <h4 className="text-sm font-medium text-gray-800">库存规划</h4>
                  </div>
                  <p className="text-xs text-gray-500">安全库存设置，补货策略管理</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">计划编号</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">SKU</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">月份</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-700">预测量</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-700">现库存</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-700">安全库存</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-700">建议补货</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-700">缺口</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">备货仓</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">主供应商</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">状态</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="px-4 py-12 text-center text-text-subtle">
                        当前筛选条件下无数据
                      </td>
                    </tr>
                  ) : (
                    filtered.map((p) => (
                      <tr key={p.id} className="border-b last:border-b-0 hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-xs text-text">{p.planNo}</td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-text">{p.skuId}</div>
                          <div className="text-xs text-text-subtle truncate max-w-[200px]" title={p.skuName}>{p.skuName}</div>
                        </td>
                        <td className="px-4 py-3 text-text">{p.month}</td>
                        <td className="px-4 py-3 text-right text-text font-medium">{Number(p.forecastQty).toLocaleString()}</td>
                        <td className="px-4 py-3 text-right text-text-muted">{Number(p.currentStock).toLocaleString()}</td>
                        <td className="px-4 py-3 text-right text-text-muted">{Number(p.safetyStock).toLocaleString()}</td>
                        <td className="px-4 py-3 text-right text-brand-700 font-medium">{Number(p.suggestedSupplyQty).toLocaleString()}</td>
                        <td className={`px-4 py-3 text-right font-medium ${p.gapQty > 0 ? 'text-danger-600' : 'text-text-subtle'}`}>
                          {p.gapQty > 0 ? `+${Number(p.gapQty).toLocaleString()}` : Number(p.gapQty).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-text-muted">{p.warehouse}</td>
                        <td className="px-4 py-3 text-text-muted truncate max-w-[160px]" title={p.supplierName}>{p.supplierName}</td>
                        <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="border-t border-border bg-surface-subtle px-4 py-2 text-xs text-text-subtle">
              共 {filtered.length} 条 / 全部 {plans.length} 条 · 数据来源：
              {plans[0]?.generatedFrom === 'fallback' ? '演示 fallback' : `预测版本 ${plans[0]?.generatedFrom}`}
              {plans[0]?.generatedAt && ` · 生成于 ${plans[0].generatedAt}`}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplyPlanPage;
