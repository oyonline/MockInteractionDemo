// src/pages/overview/UsSalesOverviewPage.js
//
// 美国事业部概览（轻量看板）：
//   数据来源：mockStore[SALES_FORECAST_PAGE_STATE]（按 dept='US' 过滤） + fallback。
//   - 4 KPI：本月销售目标 / US 预测版本总数 / 已推送预测 / 滞销预警 SKU
//   - 中部左：US BU 预测版本状态分布
//   - 中部右：最近动态
//   - 子页导航：6 卡（销售目标 / 销量预测 / 销售产品 / 数据聚合 / 滞销分析 / 销售计划看板）

import React, { useMemo } from 'react';
import {
  Globe, TrendingUp, DollarSign, Package, Target, BarChart3,
  AlertTriangle, ArrowRight, Layers, ClipboardList, Activity,
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
  { id: 'target',    name: '销售目标',     desc: '月度目标分解到店铺',     icon: Target,        path: '/sales/us/target',           tone: 'brand'   },
  { id: 'forecast',  name: '销量预测',     desc: 'V1/V2/V3 版本管理',     icon: TrendingUp,    path: '/sales/us/forecast',         tone: 'success' },
  { id: 'product',   name: '销售产品',     desc: '美国市场 SPU/SKU',      icon: Package,       path: '/sales/us/product',          tone: 'warning' },
  { id: 'aggregate', name: '数据聚合',     desc: '多维销售数据汇总',       icon: BarChart3,     path: '/sales/us/data-aggregation', tone: 'primary' },
  { id: 'slow',      name: '滞销分析',     desc: '低周转 SKU 风险预警',    icon: AlertTriangle, path: '/sales/us/slow-moving',      tone: 'danger'  },
  { id: 'plan',      name: '销售计划看板', desc: '目标 / 预测 / 实际对比', icon: ClipboardList, path: '/sales/us/plan-dashboard',   tone: 'brand'   },
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
  if (!total) return <p className="text-sm text-text-subtle">暂无版本数据，可前往「销量预测」页面查看或推送</p>;
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

const UsSalesOverviewPage = ({ onNavigate }) => {
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

  // 从 SalesForecastPage 持久化数据中按 dept='US' 过滤版本
  const { distribution, total, pendingPlanCount, recent } = useMemo(() => {
    const state = mockStore.get(SALES_FORECAST_PAGE_STATE) || {};
    const versions = [];
    Object.entries(state).forEach(([key, m]) => {
      if (!key.startsWith('US_')) return;
      (m?.versions || []).forEach((v) => versions.push(v));
    });

    const counts = {};
    versions.forEach((v) => { counts[v.status] = (counts[v.status] || 0) + 1; });
    const dist = Object.entries(counts).map(([key, count]) => ({ key, count }));
    const totalCount = versions.length;
    const pendingPlan = (counts.pending_plan || 0);

    const items = [];
    if (pendingPlan > 0) {
      items.push({ id: 'r1', text: `欧美 BU 已有 ${pendingPlan} 个月份的预测推送至供应链`, tone: 'success' });
    }
    if (totalCount > 0) {
      items.push({ id: 'r2', text: `当前共维护 ${totalCount} 个版本（含草稿、已推送、最终版与历史）`, tone: 'primary' });
    }
    items.push({ id: 'r3', text: '主线 SKU FW-2026-001-C 因渠道波动 V3 预测较 V2 下调 15%', tone: 'warning' });
    items.push({ id: 'r4', text: '滞销预警：路亚竿 SKU 群组库龄超 60 天 8 条', tone: 'danger' });

    return {
      distribution: dist,
      total: totalCount,
      pendingPlanCount: pendingPlan,
      recent: items,
    };
  }, []);

  const kpis = [
    { id: 'k1', icon: DollarSign, label: '本月销售目标', value: '$1.86M',          helper: '目标完成率 78.4%（演示）', tone: 'brand'   },
    { id: 'k2', icon: TrendingUp, label: 'US 预测版本',  value: total || 0,         helper: '含草稿 / 已推送 / 最终',  tone: 'success' },
    { id: 'k3', icon: Target,     label: '已推送预测',   value: pendingPlanCount,   helper: '已传至供应链规划',        tone: 'primary' },
    { id: 'k4', icon: AlertTriangle, label: '滞销预警 SKU', value: 8,             helper: '库龄 > 60 天',           tone: 'danger'  },
  ];

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
            <Globe className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">美国事业部概览</h1>
            <p className="text-sm text-gray-500">销售目标、销量预测、滞销分析与销售计划的统一入口</p>
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
                  <h3 className="text-base font-semibold text-text">US 预测版本状态分布</h3>
                  <p className="mt-1 text-xs text-text-subtle">来源：mockStore.SALES_FORECAST_PAGE_STATE（按 dept='US' 过滤）</p>
                </div>
                <Badge tone="primary">共 {total} 个版本</Badge>
              </div>
              <StatusBar data={distribution} total={total} />
            </Card>

            <Card className="p-5">
              <div className="mb-4 flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-600" />
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
              <Button variant="ghost" size="sm" icon={Layers} onClick={() => safeNavigate('/sales/us/forecast', '销量预测')}>
                进入主线
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SUB_ENTRIES.map((entry) => (
                <SubEntryCard key={entry.id} entry={entry} onNavigate={safeNavigate} />
              ))}
            </div>
          </section>

          <Card className="border border-dashed border-blue-200 bg-blue-50/40 p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-white p-2.5 shadow-sm">
                <Globe className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-text">当前美国事业部运营判断</h3>
                <p className="mt-1 text-sm text-text-muted">
                  {pendingPlanCount === 0
                    ? '尚未推送任何预测版本至供应链。建议先到「销量预测」页面调整数据并推送 V3。'
                    : `已推送 ${pendingPlanCount} 个月份的预测至供应链；建议本周关注主线 SKU 渠道波动与滞销预警 SKU 库存清理节奏。`}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UsSalesOverviewPage;
