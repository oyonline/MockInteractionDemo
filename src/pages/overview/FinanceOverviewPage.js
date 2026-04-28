// src/pages/overview/FinanceOverviewPage.js
//
// 财务中心概览（轻量看板）：
//   数据来源：mockStore[APPROVALS]（来自 ApprovalCenter 持久化）+ fallback。
//   - 4 KPI：本月费用 / 待审批金额 / 预算执行率 / 成本异常项
//   - 中部左：审批状态分布（基于 APPROVALS 真实状态聚合）
//   - 中部右：最近动态（基于真实数据 + fallback）
//   - 子页导航：10 卡（店铺部门映射 / 成本中心 / 分摊规则 / 费用类别 / 费用事实 / 预算版本 / 财务审批 / 收入分析 / 成本分析 / 利润分析）

import React, { useMemo } from 'react';
import {
  DollarSign, PieChart, TrendingUp, Calculator, FileText, Building2,
  Layers, Boxes, ClipboardList, BarChart3, ArrowRight, Activity,
  AlertTriangle, Briefcase, Map,
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { toast } from '../../components/ui/Toast';
import { mockStore } from '../../services/_mockStore';
import { APPROVALS } from '../../utils/storageKeys';

const APPROVAL_STATUS_META = {
  pending_accounting: { label: '待会计审核', cls: 'bg-warning-500' },
  pending_director:   { label: '待总监审核', cls: 'bg-warning-500' },
  pending_kingdee:    { label: '待推送金蝶', cls: 'bg-brand-500' },
  completed:          { label: '已完成',     cls: 'bg-success-500' },
  rejected:           { label: '已驳回',     cls: 'bg-danger-500' },
};

const SUB_ENTRIES = [
  { id: 'mapping',           name: '店铺部门映射', desc: '店铺与成本中心归属', icon: Map,           path: '/finance/mapping',           tone: 'brand'   },
  { id: 'cost-center',       name: '成本中心',     desc: '成本中心档案与变更', icon: Building2,     path: '/finance/cost-center',       tone: 'success' },
  { id: 'allocation-rule',   name: '分摊规则',     desc: '费用分摊规则配置',   icon: Layers,        path: '/finance/allocation-rule',   tone: 'warning' },
  { id: 'expense-category',  name: '费用类别',     desc: '费用类别与金蝶映射', icon: Boxes,         path: '/finance/expense-category',  tone: 'primary' },
  { id: 'expense-fact',      name: '费用事实',     desc: '实际费用单据明细',   icon: FileText,      path: '/finance/expense-fact',      tone: 'brand'   },
  { id: 'budget-version',    name: '预算版本',     desc: '预算版本管理与对比', icon: ClipboardList, path: '/finance/budget-version',    tone: 'success' },
  { id: 'approval',          name: '财务审批',     desc: '费用审批中心',       icon: TrendingUp,    path: '/finance/approval/list',     tone: 'warning' },
  { id: 'revenue-analysis',  name: '收入分析',     desc: '收入多维分析',       icon: DollarSign,    path: '/finance/revenue-analysis',  tone: 'success' },
  { id: 'cost-analysis',     name: '成本分析',     desc: '成本结构与异常',     icon: PieChart,      path: '/finance/cost-analysis',     tone: 'danger'  },
  { id: 'profit-analysis',   name: '利润分析',     desc: '利润分布与趋势',     icon: BarChart3,     path: '/finance/profit-analysis',   tone: 'primary' },
];

const TONE_BG = {
  brand:   'bg-brand-50 text-brand-700',
  success: 'bg-success-50 text-success-700',
  warning: 'bg-warning-50 text-warning-700',
  danger:  'bg-danger-50 text-danger-700',
  primary: 'bg-cyan-50 text-cyan-700',
  neutral: 'bg-slate-100 text-slate-700',
};

function formatMoney(n, currency = 'CNY') {
  if (n == null || isNaN(n)) return '-';
  const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '¥';
  return `${symbol}${Number(n).toLocaleString('zh-CN', { maximumFractionDigits: 0 })}`;
}

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
  if (!total) return <p className="text-sm text-text-subtle">暂无审批数据</p>;
  return (
    <div className="space-y-3">
      {data.map((row) => {
        const pct = total > 0 ? Math.round((row.count / total) * 100) : 0;
        return (
          <div key={row.key}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-text">{APPROVAL_STATUS_META[row.key]?.label || row.key}</span>
              <span className="text-text-muted">{row.count} 单 · {pct}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-subtle">
              <div className={`h-full rounded-full ${APPROVAL_STATUS_META[row.key]?.cls || 'bg-slate-400'}`} style={{ width: `${pct}%` }} />
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

const FinanceOverviewPage = ({ onNavigate }) => {
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

  const { distribution, total, pendingCount, pendingAmount, completedCount, rejectedCount, recent } = useMemo(() => {
    const list = mockStore.get(APPROVALS) || [];

    const counts = {};
    let pending = 0;
    let pendingAmt = 0;
    let completed = 0;
    let rejected = 0;
    list.forEach((a) => {
      const s = a.status || '';
      counts[s] = (counts[s] || 0) + 1;
      if (s.startsWith('pending')) {
        pending += 1;
        // 简单累加（不区分币种，演示用，将 USD 按 ~7.2 折算）
        const amt = Number(a.amount) || 0;
        pendingAmt += a.currency === 'USD' ? amt * 7.2 : amt;
      } else if (s === 'completed') {
        completed += 1;
      } else if (s === 'rejected') {
        rejected += 1;
      }
    });

    const dist = Object.entries(counts).map(([key, count]) => ({ key, count }));

    const items = [];
    if (pending > 0) {
      items.push({ id: 'r1', text: `当前 ${pending} 单待审批，累计金额约 ${formatMoney(pendingAmt)}`, tone: 'warning' });
    }
    if (completed > 0) {
      items.push({ id: 'r2', text: `本月已通过审批 ${completed} 单`, tone: 'success' });
    }
    if (rejected > 0) {
      items.push({ id: 'r3', text: `存在 ${rejected} 单已驳回，需补充重提`, tone: 'danger' });
    }
    items.push({ id: 'r4', text: '本月预算执行率 62.4%（演示）', tone: 'primary' });
    items.push({ id: 'r5', text: '直营电商部 1 月达人投放费用即将到付款日', tone: 'neutral' });

    return {
      distribution: dist,
      total: list.length,
      pendingCount: pending,
      pendingAmount: pendingAmt,
      completedCount: completed,
      rejectedCount: rejected,
      recent: items,
    };
  }, []);

  const kpis = [
    { id: 'k1', icon: DollarSign,    label: '本月费用',     value: '¥285 万',                   helper: '同比 +6.8%（演示）',   tone: 'brand'   },
    { id: 'k2', icon: TrendingUp,    label: '待审批',       value: pendingCount,                helper: pendingAmount > 0 ? `约 ${formatMoney(pendingAmount)}` : '暂无待审批', tone: 'warning' },
    { id: 'k3', icon: Calculator,    label: '预算执行率',   value: '62.4%',                     helper: '本年度累计',           tone: 'success' },
    { id: 'k4', icon: AlertTriangle, label: '成本异常项',   value: 3,                           helper: '超阈值 / 偏差预警',     tone: 'danger'  },
  ];

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
            <DollarSign className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">财务中心概览</h1>
            <p className="text-sm text-gray-500">费用、预算、成本、利润、审批与多维分析的统一入口</p>
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
                  <h3 className="text-base font-semibold text-text">审批状态分布</h3>
                  <p className="mt-1 text-xs text-text-subtle">来源：mockStore.APPROVALS（来自 ApprovalCenter 实时持久化）</p>
                </div>
                <Badge tone="primary">共 {total} 单</Badge>
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
              <Button variant="ghost" size="sm" icon={Briefcase} onClick={() => safeNavigate('/finance/approval/list', '财务审批')}>
                进入主线
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {SUB_ENTRIES.map((entry) => (
                <SubEntryCard key={entry.id} entry={entry} onNavigate={safeNavigate} />
              ))}
            </div>
          </section>

          <Card className="border border-dashed border-green-200 bg-green-50/40 p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-white p-2.5 shadow-sm">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-text">当前财务运营判断</h3>
                <p className="mt-1 text-sm text-text-muted">
                  {pendingCount === 0
                    ? '当前无待审批单据。建议关注预算执行节奏与本月费用申报完成度。'
                    : `当前 ${pendingCount} 单待审批${completedCount > 0 ? `、${completedCount} 单已通过` : ''}${rejectedCount > 0 ? `、${rejectedCount} 单已驳回` : ''}；建议优先处理金额较大的待会计审核单据。`}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FinanceOverviewPage;
