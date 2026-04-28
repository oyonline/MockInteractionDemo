// src/pages/overview/SupplyChainOverviewPage.js
//
// 供应链计划概览（轻量看板）：
//   数据来源优先级：mockStore[SUPPLY_PLANS] → mockStore[SALES_FORECAST_PAGE_STATE] → fallback。
//   - 4 KPI：已生成供应计划 / 待确认 / 缺口预警 SKU / 已推送预测版本数
//   - 中部左：供应计划状态分布（简单 inline 条形）
//   - 中部右：最近动态 / 风险提醒（基于真实 store 数据 + 兜底）
//   - 子页导航：Forecast Tracking / 供应计划 / Opening ITO / Excess
//
// 跳转：复用 QualityOverviewPage 的 safeNavigate 模式 — props.onNavigate 优先，否则 history.pushState + popstate。

import React, { useMemo } from 'react';
import {
  CalendarDays, BarChart3, ClipboardList, AlertTriangle, Sparkles,
  TrendingUp, ArrowRight, FileText, Boxes, Layers,
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { toast } from '../../components/ui/Toast';
import { mockStore } from '../../services/_mockStore';
import { SUPPLY_PLANS, SALES_FORECAST_PAGE_STATE } from '../../utils/storageKeys';

const FALLBACK_RECENT = [
  { id: 'r1', text: '销售预测 V3 待推送（默认演示数据）', tone: 'warning' },
  { id: 'r2', text: '尚未生成供应计划，前往「供应计划」页面点击「基于销售预测生成」', tone: 'primary' },
  { id: 'r3', text: 'Excess 库存预警阈值：超 6 个月未动销', tone: 'neutral' },
];

const STATUS_TONE = {
  pending_confirm: { label: '待确认', cls: 'bg-warning-500' },
  generated:       { label: '已生成', cls: 'bg-brand-500' },
  confirmed:       { label: '已确认', cls: 'bg-success-500' },
  adjusted:        { label: '已调整', cls: 'bg-slate-400' },
};

const SUB_ENTRIES = [
  { id: 'forecast-tracking', name: 'Forecast Tracking', desc: '预测跟踪与执行偏差监控', icon: TrendingUp,    path: '/supply-chain/forecast-tracking', tone: 'brand' },
  { id: 'supply-plan',       name: '供应计划',          desc: '基于预测生成补货建议',     icon: ClipboardList, path: '/supply-chain/supply-plan',       tone: 'success' },
  { id: 'opening-ito',       name: 'Opening ITO',       desc: '期初库存与周转看板',       icon: Boxes,         path: '/supply-chain/opening-ito-dashboard', tone: 'primary' },
  { id: 'excess',            name: 'Excess 库存',       desc: '过量库存风险与库龄分析',   icon: AlertTriangle, path: '/supply-chain/excess-dashboard',  tone: 'danger' },
];

const TONE_BG = {
  brand:   'bg-brand-50 text-brand-700',
  success: 'bg-success-50 text-success-700',
  warning: 'bg-warning-50 text-warning-700',
  danger:  'bg-danger-50 text-danger-700',
  primary: 'bg-cyan-50 text-cyan-700',
  neutral: 'bg-slate-100 text-slate-700',
};

function KpiCard({ icon: Icon, label, value, helper, tone = 'brand' }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-text-subtle">{label}</p>
          <p className="mt-2 text-2xl font-bold text-text">{value}</p>
          {helper && <p className="mt-1 text-xs text-text-subtle">{helper}</p>}
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${TONE_BG[tone] || TONE_BG.brand}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}

function StatusBar({ data, total }) {
  if (!total) {
    return <p className="text-sm text-text-subtle">暂无供应计划数据，可前往「供应计划」页面生成。</p>;
  }
  return (
    <div className="space-y-3">
      {data.map((row) => {
        const pct = total > 0 ? Math.round((row.count / total) * 100) : 0;
        return (
          <div key={row.key}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-text">{STATUS_TONE[row.key]?.label || row.key}</span>
              <span className="text-text-muted">{row.count} 条 · {pct}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-subtle">
              <div className={`h-full rounded-full ${STATUS_TONE[row.key]?.cls || 'bg-slate-400'}`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SubEntryCard({ entry, onNavigate }) {
  const Icon = entry.icon;
  return (
    <Card
      interactive
      onClick={() => onNavigate(entry.path, entry.name)}
      className="group cursor-pointer p-5 transition-shadow hover:shadow-elevated"
    >
      <div className="flex items-start justify-between gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${TONE_BG[entry.tone] || TONE_BG.brand}`}>
          <Icon className="h-5 w-5" />
        </div>
        <ArrowRight className="h-4 w-4 text-text-subtle transition-colors group-hover:text-brand-700" />
      </div>
      <h3 className="mt-3 text-base font-semibold text-text">{entry.name}</h3>
      <p className="mt-1 text-xs text-text-subtle">{entry.desc}</p>
    </Card>
  );
}

const SupplyChainOverviewPage = ({ onNavigate }) => {
  // 跳转兜底：参考 QualityOverviewPage 的 safeNavigate 模式
  const safeNavigate = (path, name) => {
    try {
      if (typeof onNavigate === 'function') {
        onNavigate(path, name);
        return;
      }
      window.history.pushState({ path }, '', path);
      window.dispatchEvent(new PopStateEvent('popstate', { state: { path } }));
    } catch (e) {
      toast.info(`演示功能：请从左侧菜单进入「${name}」`);
    }
  };

  const { plans, forecastVersionsCount, recent } = useMemo(() => {
    const planList = mockStore.get(SUPPLY_PLANS) || [];
    const forecastState = mockStore.get(SALES_FORECAST_PAGE_STATE) || {};

    let pendingForecastCount = 0;
    Object.values(forecastState).forEach((m) => {
      (m?.versions || []).forEach((v) => { if (v?.status === 'pending_plan') pendingForecastCount += 1; });
    });

    const recentItems = [];
    if (pendingForecastCount > 0) {
      recentItems.push({ id: 'r-fp', text: `已有 ${pendingForecastCount} 个 BU/月份的预测推送至计划确认`, tone: 'success' });
    }
    if (planList.length > 0) {
      recentItems.push({ id: 'r-plan', text: `已生成 ${planList.length} 条供应计划`, tone: 'primary' });
      const gapCount = planList.filter((p) => (p.gapQty || 0) > 0).length;
      if (gapCount > 0) {
        recentItems.push({ id: 'r-gap', text: `${gapCount} 个 SKU 存在补货缺口，需关注`, tone: 'warning' });
      }
    }
    recentItems.push({ id: 'r-excess', text: 'Excess 库存阈值：超 6 个月未动销 → 进入预警', tone: 'neutral' });

    return {
      plans: planList,
      forecastVersionsCount: pendingForecastCount,
      recent: recentItems.length >= 2 ? recentItems : FALLBACK_RECENT,
    };
  }, []);

  const stats = useMemo(() => {
    const total = plans.length;
    const pending = plans.filter((p) => p.status === 'pending_confirm').length;
    const generated = plans.filter((p) => p.status === 'generated').length;
    const confirmed = plans.filter((p) => p.status === 'confirmed').length;
    const adjusted = plans.filter((p) => p.status === 'adjusted').length;
    const gapCount = plans.filter((p) => (p.gapQty || 0) > 0).length;

    const distribution = [
      { key: 'pending_confirm', count: pending },
      { key: 'generated',       count: generated },
      { key: 'confirmed',       count: confirmed },
      { key: 'adjusted',        count: adjusted },
    ].filter((r) => r.count > 0);

    return { total, pending, gapCount, distribution };
  }, [plans]);

  // 缺数据时的展示性 fallback（保证看板不空、数字合理）
  const kpis = stats.total > 0
    ? [
        { id: 'k1', icon: ClipboardList, label: '已生成供应计划',  value: stats.total,    helper: `本月 ${stats.total} 条`, tone: 'brand' },
        { id: 'k2', icon: Sparkles,      label: '待确认计划',       value: stats.pending,  helper: '需运营复核',           tone: 'warning' },
        { id: 'k3', icon: AlertTriangle, label: '缺口预警 SKU',     value: stats.gapCount, helper: '建议立即补货',         tone: 'danger' },
        { id: 'k4', icon: TrendingUp,    label: '已推送预测版本',   value: forecastVersionsCount, helper: '来自销售预测页',  tone: 'success' },
      ]
    : [
        { id: 'k1', icon: ClipboardList, label: '已生成供应计划',  value: 0,  helper: '点子页面卡进入「供应计划」生成', tone: 'brand' },
        { id: 'k2', icon: Sparkles,      label: '待确认计划',       value: 0,  helper: '需运营复核',           tone: 'warning' },
        { id: 'k3', icon: AlertTriangle, label: '缺口预警 SKU',     value: 0,  helper: '生成后自动统计',       tone: 'danger' },
        { id: 'k4', icon: TrendingUp,    label: '已推送预测版本',   value: forecastVersionsCount, helper: '来自销售预测页', tone: 'success' },
      ];

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* 标题区 */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-50">
            <CalendarDays className="h-5 w-5 text-cyan-600" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">供应链计划概览</h1>
            <p className="text-sm text-gray-500">销售预测、供应计划、库存周转与 Excess 风险的整体看板</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          {/* KPI 行 */}
          <section>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {kpis.map((k) => <KpiCard key={k.id} {...k} />)}
            </div>
          </section>

          {/* 中部 2 栏 */}
          <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <Card className="p-5 xl:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-text">供应计划状态分布</h3>
                  <p className="mt-1 text-xs text-text-subtle">来源：mockStore.SUPPLY_PLANS（最新生成的快照）</p>
                </div>
                <Badge tone="primary">共 {stats.total} 条</Badge>
              </div>
              <StatusBar data={stats.distribution} total={stats.total} />
            </Card>

            <Card className="p-5">
              <div className="mb-4 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-brand-700" />
                <h3 className="text-base font-semibold text-text">最近动态 / 风险提醒</h3>
              </div>
              <ul className="space-y-3">
                {recent.map((item) => (
                  <li key={item.id} className="flex items-start gap-2">
                    <span className={`mt-1.5 inline-block h-2 w-2 flex-shrink-0 rounded-full ${
                      item.tone === 'warning' ? 'bg-warning-500' :
                      item.tone === 'success' ? 'bg-success-500' :
                      item.tone === 'danger'  ? 'bg-danger-500'  :
                      item.tone === 'primary' ? 'bg-brand-500'   : 'bg-slate-400'
                    }`} />
                    <p className="text-sm text-text">{item.text}</p>
                  </li>
                ))}
              </ul>
            </Card>
          </section>

          {/* 子页面导航 */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text">子页面入口</h2>
              <Button variant="ghost" size="sm" icon={Layers} onClick={() => safeNavigate('/supply-chain/supply-plan', '供应计划')}>
                进入主线
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {SUB_ENTRIES.map((entry) => (
                <SubEntryCard key={entry.id} entry={entry} onNavigate={safeNavigate} />
              ))}
            </div>
          </section>

          {/* 底部判断条 */}
          <Card className="border border-dashed border-cyan-200 bg-cyan-50/40 p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-white p-2.5 shadow-sm">
                <FileText className="h-5 w-5 text-cyan-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-text">当前供应链运营判断</h3>
                <p className="mt-1 text-sm text-text-muted">
                  {stats.total === 0
                    ? '尚未生成供应计划。建议先在销售预测页推送 V3，再到「供应计划」基于预测一键生成下游计划。'
                    : `当前共有 ${stats.total} 条供应计划，其中 ${stats.pending} 条待确认、${stats.gapCount} 条存在缺口；建议优先处理缺口预警 SKU。`}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SupplyChainOverviewPage;
