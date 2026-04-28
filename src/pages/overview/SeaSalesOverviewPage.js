// src/pages/overview/SeaSalesOverviewPage.js
//
// 东南亚事业部概览（轻量看板）：
//   数据来源：mockStore[SALES_FORECAST_PAGE_STATE]（按 dept='SEA' 过滤） + fallback。
//   - 4 KPI：本月销售额 / SEA 预测版本 / 区域市场数 / 风险 SKU 数
//   - 中部左：SEA BU 预测版本状态分布
//   - 中部右：最近动态
//   - 子页导航：5 卡（3 真实路由 + 2 toast.info 占位）

import React, { useMemo } from 'react';
import {
  Globe2, TrendingUp, DollarSign, Package, Target, BarChart3,
  AlertTriangle, ArrowRight, Layers, ClipboardList, Activity, MapPin,
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { toast } from '../../components/ui/Toast';
import { mockStore } from '../../services/_mockStore';
import { SALES_FORECAST_PAGE_STATE } from '../../utils/storageKeys';

const VERSION_STATUS_META = {
  draft_editing: { label: '草稿编辑中', cls: 'bg-warning-500' },
  pending_plan:  { label: '已推送计划', cls: 'bg-brand-500' },
  final:         { label: '最终版',     cls: 'bg-success-500' },
  archived:      { label: '历史归档',   cls: 'bg-slate-400' },
};

const SUB_ENTRIES = [
  { id: 'target',    name: '销售目标',     desc: 'SEA 各国家月度目标',      icon: Target,        path: '/sales/sea/target',   tone: 'brand'   },
  { id: 'forecast',  name: '销量预测',     desc: 'SEA BU 预测版本管理',    icon: TrendingUp,    path: '/sales/sea/forecast', tone: 'success' },
  { id: 'product',   name: '销售产品',     desc: '东南亚市场 SPU/SKU',     icon: Package,       path: '/sales/sea/maindata', tone: 'warning' },
  { id: 'aggregate', name: '数据聚合',     desc: '多国家维度汇总',          icon: BarChart3,     path: '/sales/sea/data-aggregation', tone: 'primary', demo: true },
  { id: 'plan',      name: '销售计划看板', desc: '目标 / 预测 / 实际',      icon: ClipboardList, path: '/sales/sea/plan-dashboard',   tone: 'danger',  demo: true },
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
  if (!total) return <p className="text-sm text-text-subtle">暂无版本数据</p>;
  return (
    <div className="space-y-3">
      {data.map((row) => {
        const pct = total > 0 ? Math.round((row.count / total) * 100) : 0;
        return (
          <div key={row.key}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-text">{VERSION_STATUS_META[row.key]?.label || row.key}</span>
              <span className="text-text-muted">{row.count} 个 · {pct}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-subtle">
              <div className={`h-full rounded-full ${VERSION_STATUS_META[row.key]?.cls || 'bg-slate-400'}`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SubEntryCard({ entry, onNavigate, onDemo }) {
  const Icon = entry.icon;
  const handleClick = () => {
    if (entry.demo) onDemo(entry.name);
    else onNavigate(entry.path, entry.name);
  };
  return (
    <Card
      interactive
      onClick={handleClick}
      className="group cursor-pointer p-5 transition-shadow hover:shadow-elevated"
    >
      <div className="flex items-start justify-between gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${TONE_BG[entry.tone] || TONE_BG.brand}`}>
          <Icon className="h-5 w-5" />
        </div>
        {entry.demo
          ? <Badge tone="neutral">演示</Badge>
          : <ArrowRight className="h-4 w-4 text-text-subtle transition-colors group-hover:text-brand-700" />}
      </div>
      <h3 className="mt-3 text-base font-semibold text-text">{entry.name}</h3>
      <p className="mt-1 text-xs text-text-subtle">{entry.desc}</p>
    </Card>
  );
}

const SeaSalesOverviewPage = ({ onNavigate }) => {
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
  const handleDemo = (name) => toast.info(`演示功能：「${name}」入口为占位，正式版将开放独立页面`);

  const { distribution, total, pendingPlanCount, recent } = useMemo(() => {
    const state = mockStore.get(SALES_FORECAST_PAGE_STATE) || {};
    const versions = [];
    Object.entries(state).forEach(([key, m]) => {
      if (!key.startsWith('SEA_')) return;
      (m?.versions || []).forEach((v) => versions.push(v));
    });

    const counts = {};
    versions.forEach((v) => { counts[v.status] = (counts[v.status] || 0) + 1; });
    const dist = Object.entries(counts).map(([key, count]) => ({ key, count }));
    const totalCount = versions.length;
    const pendingPlan = (counts.pending_plan || 0);

    const items = [
      ...(pendingPlan > 0 ? [{ id: 'r1', text: `SEA BU 已有 ${pendingPlan} 个月份的预测推送至供应链`, tone: 'success' }] : []),
      { id: 'r2', text: '新加坡 Shopee 渠道 1 月销售额同比增长 28%', tone: 'success' },
      { id: 'r3', text: '马来西亚 Lazada 仓库爆仓，已扩容 +30%', tone: 'primary' },
      { id: 'r4', text: '越南雨季影响：3 个 SKU 出库延期 1-2 天', tone: 'warning' },
      { id: 'r5', text: '泰国市场 NPI 上市预热中', tone: 'neutral' },
    ];

    return {
      distribution: dist,
      total: totalCount,
      pendingPlanCount: pendingPlan,
      recent: items,
    };
  }, []);

  const kpis = [
    { id: 'k1', icon: DollarSign, label: '本月销售额',  value: '¥1,560 万',     helper: '同比 +35.0%（演示）',   tone: 'brand'   },
    { id: 'k2', icon: TrendingUp, label: 'SEA 预测版本', value: total || 0,      helper: '含草稿 / 已推送 / 最终', tone: 'success' },
    { id: 'k3', icon: MapPin,     label: '区域市场数',   value: 5,               helper: 'SG/MY/TH/VN/ID',       tone: 'warning' },
    { id: 'k4', icon: AlertTriangle, label: '风险 SKU 数', value: 6,             helper: '汇率 / 物流 / 政策',     tone: 'danger'  },
  ];

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
            <Globe2 className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">东南亚事业部概览</h1>
            <p className="text-sm text-gray-500">Shopee / Lazada / TikTok 等多区域多平台销售统一入口</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          <section>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {kpis.map((k) => <KpiCard key={k.id} {...k} />)}
            </div>
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <Card className="p-5 xl:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-text">SEA 预测版本状态分布</h3>
                  <p className="mt-1 text-xs text-text-subtle">来源：mockStore.SALES_FORECAST_PAGE_STATE（按 dept='SEA' 过滤）</p>
                </div>
                <Badge tone="primary">共 {total} 个版本</Badge>
              </div>
              <StatusBar data={distribution} total={total} />
            </Card>

            <Card className="p-5">
              <div className="mb-4 flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-600" />
                <h3 className="text-base font-semibold text-text">最近动态 / 风险提醒</h3>
              </div>
              <ul className="space-y-3">
                {recent.map((item) => (
                  <li key={item.id} className="flex items-start gap-2">
                    <span className={`mt-1.5 inline-block h-2 w-2 flex-shrink-0 rounded-full ${
                      item.tone === 'warning' ? 'bg-warning-500' :
                      item.tone === 'success' ? 'bg-success-500' :
                      item.tone === 'danger'  ? 'bg-danger-500'  :
                      item.tone === 'primary' ? 'bg-cyan-500'    : 'bg-slate-400'
                    }`} />
                    <p className="text-sm text-text">{item.text}</p>
                  </li>
                ))}
              </ul>
            </Card>
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text">子页面入口</h2>
              <Button variant="ghost" size="sm" icon={Layers} onClick={() => safeNavigate('/sales/sea/forecast', '销量预测')}>
                进入主线
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SUB_ENTRIES.map((entry) => (
                <SubEntryCard key={entry.id} entry={entry} onNavigate={safeNavigate} onDemo={handleDemo} />
              ))}
            </div>
          </section>

          <Card className="border border-dashed border-green-200 bg-green-50/40 p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-white p-2.5 shadow-sm">
                <Globe2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-text">当前东南亚事业部运营判断</h3>
                <p className="mt-1 text-sm text-text-muted">
                  {pendingPlanCount === 0
                    ? 'SEA BU 预测版本尚未推送至供应链，建议先维护 SEA 各国家销量预测。'
                    : `SEA BU 已推送 ${pendingPlanCount} 个月份预测；建议关注马来西亚仓库吞吐与越南雨季出库延期。`}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SeaSalesOverviewPage;
