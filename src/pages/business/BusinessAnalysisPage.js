// src/pages/business/BusinessAnalysisPage.js
//
// 经营管理分析（轻量看板）：集团经营驾驶舱。
//   - 4 KPI：总营收 / 毛利率 / 净利润 / 经营效率
//   - 4 图表区改为 inline CSS 条形图（不引入 Recharts，与其他 overview 风格统一）
//     1) 月度营收趋势（6 月柱状图）
//     2) 事业部销售占比（4 BU 水平条形 + %）
//     3) 费用 vs 利润趋势（6 月对比柱）
//     4) 供应链风险分布（4 类风险 + 等级徽章）

import React from 'react';
import { TrendingUp, DollarSign, Target, PieChart, Activity, Calendar, Boxes } from 'lucide-react';

const REVENUE_TREND = [
  { month: '10月', value: 920 },
  { month: '11月', value: 1080 },
  { month: '12月', value: 1240 },
  { month: '1月',  value: 1320 },
  { month: '2月',  value: 1180 },
  { month: '3月',  value: 1410 },
];

const BU_SHARE = [
  { name: '欧美事业部',   pct: 42, color: 'bg-blue-500',   amount: '$3.6M' },
  { name: '亚太事业部',   pct: 28, color: 'bg-rose-500',   amount: '$2.4M' },
  { name: '东南亚事业部', pct: 18, color: 'bg-green-500',  amount: '$1.5M' },
  { name: '欧洲事业部',   pct: 12, color: 'bg-purple-500', amount: '$1.0M' },
];

const COST_PROFIT_TREND = [
  { month: '10月', cost: 580, profit: 340 },
  { month: '11月', cost: 640, profit: 440 },
  { month: '12月', cost: 720, profit: 520 },
  { month: '1月',  cost: 780, profit: 540 },
  { month: '2月',  cost: 700, profit: 480 },
  { month: '3月',  cost: 820, profit: 590 },
];

const RISK_DIST = [
  { label: '物流延迟',     count: 4, level: '中',  cls: 'bg-warning-50 text-warning-700 border-warning-100' },
  { label: '供应商履约',   count: 2, level: '低',  cls: 'bg-success-50 text-success-700 border-success-100' },
  { label: 'Excess 库存',  count: 8, level: '高',  cls: 'bg-danger-50 text-danger-700 border-danger-100' },
  { label: '汇率波动',     count: 3, level: '中',  cls: 'bg-warning-50 text-warning-700 border-warning-100' },
];

const MAX_REVENUE = Math.max(...REVENUE_TREND.map((x) => x.value));
const MAX_CP = Math.max(
  ...COST_PROFIT_TREND.map((x) => Math.max(x.cost, x.profit))
);

const BusinessAnalysisPage = () => {
  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* 页面标题 */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">经营分析</h1>
            <p className="text-sm text-gray-500 mt-1">企业经营数据分析与决策支持</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700">2026年Q1</span>
          </div>
        </div>
      </div>

      {/* 核心指标 */}
      <div className="grid grid-cols-4 gap-4 p-6">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">总营收</p>
              <p className="text-2xl font-semibold text-gray-800 mt-1">$8.5M</p>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+15.3%</span>
            <span className="text-gray-400 ml-1">同比</span>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">毛利率</p>
              <p className="text-2xl font-semibold text-gray-800 mt-1">42.8%</p>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <PieChart className="w-5 h-5 text-green-500" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+2.1%</span>
            <span className="text-gray-400 ml-1">同比</span>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">净利润</p>
              <p className="text-2xl font-semibold text-gray-800 mt-1">$1.2M</p>
            </div>
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-purple-500" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+8.7%</span>
            <span className="text-gray-400 ml-1">同比</span>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">经营效率</p>
              <p className="text-2xl font-semibold text-gray-800 mt-1">87.5%</p>
            </div>
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-orange-500" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+3.4%</span>
            <span className="text-gray-400 ml-1">同比</span>
          </div>
        </div>
      </div>

      {/* 图表区域 */}
      <div className="flex-1 px-6 pb-6 overflow-auto">
        <div className="grid grid-cols-2 gap-6">
          {/* 1) 月度营收趋势 */}
          <div className="bg-white rounded-lg border p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-800">月度营收趋势</h3>
              <span className="text-xs text-gray-400">单位：万元</span>
            </div>
            <div className="flex items-end justify-between gap-3 h-56 px-2">
              {REVENUE_TREND.map((item) => {
                const heightPct = Math.round((item.value / MAX_REVENUE) * 100);
                return (
                  <div key={item.month} className="flex flex-1 flex-col items-center gap-2">
                    <div className="text-xs font-medium text-gray-600">{item.value}</div>
                    <div className="flex h-40 w-full items-end">
                      <div
                        className="w-full rounded-t-md bg-gradient-to-t from-blue-500 to-blue-400 transition-all"
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500">{item.month}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2) 事业部销售占比 */}
          <div className="bg-white rounded-lg border p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-800">事业部销售占比</h3>
              <span className="text-xs text-gray-400">2026 Q1</span>
            </div>
            <div className="space-y-4 mt-2">
              {BU_SHARE.map((bu) => (
                <div key={bu.name}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="text-gray-700">{bu.name}</span>
                    <span className="text-gray-500">{bu.amount} · {bu.pct}%</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                    <div className={`h-full rounded-full ${bu.color} transition-all`} style={{ width: `${bu.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
              欧美事业部贡献最大（42%），亚太次之；建议关注欧洲事业部增长机会。
            </div>
          </div>

          {/* 3) 费用 vs 利润趋势 */}
          <div className="bg-white rounded-lg border p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-800">费用 vs 利润趋势</h3>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-gray-500">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm bg-rose-400" />费用
                </span>
                <span className="flex items-center gap-1.5 text-gray-500">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm bg-emerald-500" />利润
                </span>
              </div>
            </div>
            <div className="flex items-end justify-between gap-2 h-56 px-2">
              {COST_PROFIT_TREND.map((item) => {
                const cPct = Math.round((item.cost / MAX_CP) * 100);
                const pPct = Math.round((item.profit / MAX_CP) * 100);
                return (
                  <div key={item.month} className="flex flex-1 flex-col items-center gap-2">
                    <div className="flex h-40 w-full items-end justify-center gap-1">
                      <div
                        className="w-3 rounded-t-md bg-rose-400 transition-all"
                        style={{ height: `${cPct}%` }}
                        title={`费用 ${item.cost}`}
                      />
                      <div
                        className="w-3 rounded-t-md bg-emerald-500 transition-all"
                        style={{ height: `${pPct}%` }}
                        title={`利润 ${item.profit}`}
                      />
                    </div>
                    <div className="text-xs text-gray-500">{item.month}</div>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
              利润率持续提升，1 月利润首次突破 540 万；3 月费用与利润同向增长。
            </div>
          </div>

          {/* 4) 供应链 / 经营风险分布 */}
          <div className="bg-white rounded-lg border p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-800">经营风险分布</h3>
              <Boxes className="h-4 w-4 text-gray-400" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {RISK_DIST.map((r) => (
                <div key={r.label} className={`rounded-lg border p-4 ${r.cls}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs opacity-80">{r.label}</p>
                      <p className="mt-1 text-2xl font-bold">{r.count}</p>
                    </div>
                    <span className="rounded-full border border-current bg-white/60 px-2 py-0.5 text-[11px] font-medium">
                      {r.level}
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] opacity-75">需关注 {r.count} 个事项</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
              当前 Excess 库存为最高风险，建议优先处理超 6 个月未动销 SKU。
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessAnalysisPage;
