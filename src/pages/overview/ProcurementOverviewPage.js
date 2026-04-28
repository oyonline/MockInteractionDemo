// src/pages/overview/ProcurementOverviewPage.js
//
// 供应链采购概览（轻量看板）：
//   数据来源优先级：mockStore[SUPPLY_PLANS] / mockStore[APPROVALS] → fallback 演示数据。
//   - 4 KPI：供应商数量 / 待跟进采购计划 / SKU 迭代 / 待审批事项
//   - 中部左：供应商等级分布（fallback 演示）
//   - 中部右：最近动态（含主线供应商 SUP-001 提示）
//   - 子页导航：供应商管理 / 供应商绩效（暂无独立 route，toast 占位）/ 采购计划跟踪 / SKU 迭代

import React, { useMemo } from 'react';
import {
  ShoppingCart, Truck, Users, ClipboardList, Award, RefreshCcw,
  TrendingUp, AlertTriangle, ArrowRight, FileText,
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { toast } from '../../components/ui/Toast';
import { mockStore } from '../../services/_mockStore';
import { SUPPLY_PLANS, APPROVALS } from '../../utils/storageKeys';

// 供应商等级分布演示数据（基于跨页面 _seed 中三个供应商）
const SUPPLIER_GRADE_DEMO = [
  { key: 'A', label: 'A 战略供应商',  count: 5,  cls: 'bg-success-500' },
  { key: 'B', label: 'B 重点供应商',  count: 8,  cls: 'bg-brand-500' },
  { key: 'C', label: 'C 备选供应商',  count: 4,  cls: 'bg-warning-500' },
  { key: 'D', label: 'D 待审核',      count: 1,  cls: 'bg-slate-400' },
];

const SUB_ENTRIES = [
  { id: 'supplier',     name: '供应商管理',   desc: '档案、资质、绩效全景', icon: Users,         path: '/procurement/supplier',        tone: 'brand'   },
  { id: 'performance',  name: '供应商绩效',   desc: 'QCDS 四维度评估排行',  icon: Award,         path: '/procurement/supplier',        tone: 'success', hint: '绩效详情请进入供应商详情页查看' },
  { id: 'plan',         name: '采购计划跟踪', desc: '订单交期与执行状态',   icon: ClipboardList, path: '/procurement/plan-tracking',   tone: 'warning' },
  { id: 'iteration',    name: 'SKU 迭代',     desc: 'SKU 版本变更与审批',   icon: RefreshCcw,    path: '/procurement/sku-iteration',   tone: 'primary' },
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

function GradeBar({ data, total }) {
  return (
    <div className="space-y-3">
      {data.map((row) => {
        const pct = total > 0 ? Math.round((row.count / total) * 100) : 0;
        return (
          <div key={row.key}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-text">{row.label}</span>
              <span className="text-text-muted">{row.count} 家 · {pct}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-subtle">
              <div className={`h-full rounded-full ${row.cls}`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SubEntryCard({ entry, onNavigate, onSoftHint }) {
  const Icon = entry.icon;
  const handleClick = () => {
    if (entry.hint) onSoftHint(entry.hint);
    onNavigate(entry.path, entry.name);
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
        <ArrowRight className="h-4 w-4 text-text-subtle transition-colors group-hover:text-brand-700" />
      </div>
      <h3 className="mt-3 text-base font-semibold text-text">{entry.name}</h3>
      <p className="mt-1 text-xs text-text-subtle">{entry.desc}</p>
    </Card>
  );
}

const ProcurementOverviewPage = ({ onNavigate }) => {
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
  const handleSoftHint = (hint) => toast.info(hint);

  const { plans, approvals, recent } = useMemo(() => {
    const planList = mockStore.get(SUPPLY_PLANS) || [];
    const approvalList = mockStore.get(APPROVALS) || [];

    const recentItems = [];
    const procurementApprovals = approvalList.filter((a) => a.sourceModule === '采购');
    if (procurementApprovals.length > 0) {
      const pendingProc = procurementApprovals.filter((a) => (a.status || '').startsWith('pending'));
      if (pendingProc.length > 0) {
        recentItems.push({ id: 'r-proc', text: `采购相关待审批 ${pendingProc.length} 单（含供应商货款结算等）`, tone: 'warning' });
      }
    }
    if (planList.length > 0) {
      recentItems.push({ id: 'r-plan', text: `供应计划已生成 ${planList.length} 条，可推进采购下单`, tone: 'success' });
    }
    recentItems.push({ id: 'r-sup', text: 'SUP-001（深圳市渔具制造有限公司）Q1 绩效待评估', tone: 'primary' });
    recentItems.push({ id: 'r-iter', text: '主线 SKU FW-2026-001 系列采购建议已生成', tone: 'neutral' });

    return {
      plans: planList,
      approvals: approvalList,
      recent: recentItems,
    };
  }, []);

  const kpis = useMemo(() => {
    const supplierCount = SUPPLIER_GRADE_DEMO.reduce((s, r) => s + r.count, 0); // 18
    const pendingPlans = plans.filter((p) => p.status === 'pending_confirm').length;
    const pendingApprovals = approvals.filter((a) => (a.status || '').startsWith('pending')).length;
    const skuIterDemo = 12; // 演示数据：SKU 迭代数量
    return [
      { id: 'k1', icon: Users,         label: '供应商数量',     value: supplierCount,    helper: '含战略 / 重点 / 备选',  tone: 'brand'   },
      { id: 'k2', icon: ClipboardList, label: '待跟进采购计划', value: pendingPlans,     helper: '来自供应计划列表',     tone: 'warning' },
      { id: 'k3', icon: RefreshCcw,    label: 'SKU 迭代',       value: skuIterDemo,      helper: '近 30 天版本变更',     tone: 'primary' },
      { id: 'k4', icon: AlertTriangle, label: '待审批事项',     value: pendingApprovals, helper: '含采购单 / 货款结算等', tone: 'danger'  },
    ];
  }, [plans, approvals]);

  const totalGrade = SUPPLIER_GRADE_DEMO.reduce((s, r) => s + r.count, 0);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* 标题区 */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
            <ShoppingCart className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">供应链采购概览</h1>
            <p className="text-sm text-gray-500">供应商档案、采购计划、SKU 迭代与采购审批的统一入口</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          {/* KPI */}
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
                  <h3 className="text-base font-semibold text-text">供应商等级分布</h3>
                  <p className="mt-1 text-xs text-text-subtle">基于 QCDS 评分自动归档（演示数据）</p>
                </div>
                <Badge tone="primary">共 {totalGrade} 家</Badge>
              </div>
              <GradeBar data={SUPPLIER_GRADE_DEMO} total={totalGrade} />
            </Card>

            <Card className="p-5">
              <div className="mb-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-orange-600" />
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

          {/* 子页面导航 */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text">子页面入口</h2>
              <Button variant="ghost" size="sm" icon={Truck} onClick={() => safeNavigate('/procurement/supplier', '供应商管理')}>
                进入主线
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {SUB_ENTRIES.map((entry) => (
                <SubEntryCard key={entry.id} entry={entry} onNavigate={safeNavigate} onSoftHint={handleSoftHint} />
              ))}
            </div>
          </section>

          {/* 底部判断条 */}
          <Card className="border border-dashed border-orange-200 bg-orange-50/40 p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-white p-2.5 shadow-sm">
                <FileText className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-text">当前采购运营判断</h3>
                <p className="mt-1 text-sm text-text-muted">
                  {plans.length === 0
                    ? '尚未生成供应计划，建议先到「供应链计划 → 供应计划」基于销售预测生成下游采购建议。'
                    : `供应计划已就绪 ${plans.length} 条，建议本周完成与战略供应商（A 级）的下单确认；同时关注 SUP-001 Q1 绩效复评。`}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProcurementOverviewPage;
