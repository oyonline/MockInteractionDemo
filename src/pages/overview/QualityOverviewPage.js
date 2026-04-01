import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  GitBranch,
  RefreshCcw,
  TestTube,
  TrendingUp,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import cn from '../../utils/cn';
import { getMockQualityOverviewData } from '../../mock/quality/overview';

const SOURCE_COLORS = ['#0F766E', '#0EA5E9', '#F59E0B'];
const COMPLAINT_TYPE_COLOR = '#14B8A6';

function OverviewSectionTitle({ title, subtitle }) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
    </div>
  );
}

function MetricCard({ item }) {
  const toneStyles = {
    primary: 'bg-teal-50 text-teal-700',
    success: 'bg-green-50 text-green-700',
    warning: 'bg-amber-50 text-amber-700',
    danger: 'bg-red-50 text-red-700',
  };

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500">{item.label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900">{item.value}</p>
        </div>
        <div className={cn('rounded-xl px-2.5 py-1 text-xs font-medium', toneStyles[item.tone] || toneStyles.primary)}>
          {item.helper}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
        <TrendingUp className="h-4 w-4 text-teal-600" />
        <span>{item.trend}</span>
      </div>
    </Card>
  );
}

function FlowEntryCard({ item, onNavigate }) {
  const toneStyles = {
    primary: 'border-teal-200 bg-teal-50/60',
    warning: 'border-amber-200 bg-amber-50/60',
    danger: 'border-red-200 bg-red-50/60',
  };

  return (
    <Card className={cn('border p-5', toneStyles[item.tone] || toneStyles.primary)}>
      <div className="flex h-full flex-col justify-between gap-4">
        <div>
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-base font-semibold text-gray-900">{item.title}</h3>
            <Badge tone={item.tone === 'danger' ? 'danger' : item.tone === 'warning' ? 'warning' : 'primary'}>
              {item.stat}
            </Badge>
          </div>
          <p className="mt-3 text-sm leading-6 text-gray-600">{item.description}</p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-gray-500">{item.helper}</p>
          <Button variant="ghost" size="sm" icon={ArrowRight} onClick={() => onNavigate(item.path, item.pathName)}>
            前往页面
          </Button>
        </div>
      </div>
    </Card>
  );
}

function RankingItem({ item, showSupplier = false }) {
  return (
    <div className="rounded-xl bg-gray-50 px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-gray-800">
            {item.supplierName || item.productName}
            {showSupplier ? '' : ` · ${item.batchNo}`}
          </p>
          <p className="mt-1 text-xs text-gray-500">{showSupplier ? item.summary : `${item.sku} · ${item.supplierName}`}</p>
        </div>
        <Badge tone={item.riskLevel === '高风险' || item.riskLevel === '高发' ? 'danger' : item.riskLevel === '中风险' || item.riskLevel === '重复发生' ? 'warning' : 'primary'}>
          {item.riskLevel}
        </Badge>
      </div>
      <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
        <span>{showSupplier ? `风险得分 ${item.score}` : `风险指数 ${item.score}`}</span>
        <span>{showSupplier ? `${item.issueCount} 个关联问题` : `${item.occurrences} 次命中`}</span>
      </div>
      {!showSupplier && (
        <div className="mt-2 flex flex-wrap gap-2">
          {item.sources.map((source) => (
            <span key={source} className="rounded-lg bg-white px-2 py-1 text-[11px] text-gray-500 shadow-sm">
              {source}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function TodoPanel({ panel, onNavigate }) {
  return (
    <Card className="p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-gray-900">{panel.title}</h3>
          <p className="mt-1 text-sm text-gray-500">{panel.subtitle}</p>
        </div>
        <Button variant="ghost" size="sm" icon={ArrowRight} onClick={() => onNavigate(panel.actionPath, panel.actionName)}>
          查看全部
        </Button>
      </div>
      <div className="space-y-3">
        {panel.items.map((item) => (
          <div key={item.id} className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-gray-800">{item.title}</p>
                <p className="mt-1 text-xs leading-5 text-gray-500">{item.meta}</p>
              </div>
              <Badge tone={item.tone}>{item.tag}</Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function QualityOverviewPage({ onNavigate }) {
  const [range, setRange] = useState('30d');
  const [warehouse, setWarehouse] = useState('');
  const [supplier, setSupplier] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [lastUpdatedAt, setLastUpdatedAt] = useState('10:00:00');

  const overviewData = useMemo(
    () => getMockQualityOverviewData({ range, warehouse, supplier, refreshKey }),
    [range, warehouse, supplier, refreshKey]
  );

  const safeNavigate = (path, name) => {
    if (typeof onNavigate === 'function') {
      onNavigate(path, name);
      return;
    }
    window.history.pushState({ path }, '', path);
    window.dispatchEvent(new PopStateEvent('popstate', { state: { path } }));
  };

  const handleRefresh = () => {
    setRefreshKey((current) => current + 1);
    setLastUpdatedAt(new Date().toLocaleTimeString('zh-CN', { hour12: false }));
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
              <TestTube className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">质量概览</h1>
              <p className="text-sm text-gray-500">从入库发现、任务处理到客诉闭环的质量运营总览</p>
            </div>
          </div>
          <div className="text-sm text-gray-500">最近刷新：{lastUpdatedAt}</div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          <Card className="p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900">筛选与刷新</h2>
                <p className="mt-1 text-sm text-gray-500">通过时间、仓库和供应商口径查看当前质量态势。</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center rounded-xl bg-gray-100 p-1">
                  {overviewData.filterOptions.ranges.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setRange(item.value)}
                      className={cn(
                        'rounded-lg px-3 py-1.5 text-sm transition-colors',
                        range === item.value ? 'bg-white text-teal-700 shadow-sm' : 'text-gray-600 hover:text-gray-800'
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                <select value={warehouse} onChange={(event) => setWarehouse(event.target.value)} className="ui-select w-44">
                  <option value="">全部仓库</option>
                  {overviewData.filterOptions.warehouses.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <select value={supplier} onChange={(event) => setSupplier(event.target.value)} className="ui-select w-52">
                  <option value="">全部供应商</option>
                  {overviewData.filterOptions.suppliers.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <Button variant="secondary" icon={RefreshCcw} onClick={handleRefresh}>
                  刷新
                </Button>
              </div>
            </div>
          </Card>

          <section>
            <OverviewSectionTitle
              title="核心指标"
              subtitle="先看当前压力面、闭环效率和高风险集中点，快速判断今天最该处理什么。"
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">
              {overviewData.metrics.map((item) => (
                <MetricCard key={item.id} item={item} />
              ))}
            </div>
          </section>

          <section>
            <OverviewSectionTitle
              title="业务主线与入口"
              subtitle="不是三张列表拼接，而是沿着“问题发现 -> 任务处理 -> 客诉闭环”组织质量工作。"
            />
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              {overviewData.moduleEntrances.map((item) => (
                <FlowEntryCard key={item.id} item={item} onNavigate={safeNavigate} />
              ))}
            </div>
          </section>

          <section>
            <OverviewSectionTitle
              title="趋势与分析"
              subtitle="同时观察三类质量事件的变化，识别风险来源、供应商热点和重复问题批次。"
            />
            <div className="grid grid-cols-1 gap-6 2xl:grid-cols-3">
              <Card className="p-5 2xl:col-span-2">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">质量事件趋势</h3>
                    <p className="mt-1 text-sm text-gray-500">观察入库质检、质量任务、客诉质量三条线的事件变化。</p>
                  </div>
                  <Badge tone="primary">{overviewData.summary.riskSupplierCount} 家高风险供应商</Badge>
                </div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={overviewData.trendSeries} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="label" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                      <RechartsTooltip contentStyle={{ borderRadius: 12, borderColor: '#E5E7EB' }} />
                      <Legend />
                      <Line type="monotone" dataKey="inboundCount" name="入库质检相关" stroke="#0F766E" strokeWidth={2.5} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="taskCount" name="质量检查任务" stroke="#0EA5E9" strokeWidth={2.5} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="complaintCount" name="客诉质量单" stroke="#F59E0B" strokeWidth={2.5} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="p-5">
                <div className="mb-4">
                  <h3 className="text-base font-semibold text-gray-900">质量来源分布</h3>
                  <p className="mt-1 text-sm text-gray-500">看当前质量压力主要来自入库、任务还是客户反馈。</p>
                </div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={overviewData.sourceDistribution}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="45%"
                        innerRadius={58}
                        outerRadius={88}
                        paddingAngle={2}
                      >
                        {overviewData.sourceDistribution.map((item, index) => (
                          <Cell key={item.name} fill={SOURCE_COLORS[index % SOURCE_COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip contentStyle={{ borderRadius: 12, borderColor: '#E5E7EB' }} />
                      <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 2xl:grid-cols-3">
              <Card className="p-5">
                <div className="mb-4">
                  <h3 className="text-base font-semibold text-gray-900">供应商质量风险排行</h3>
                  <p className="mt-1 text-sm text-gray-500">综合入库排期、任务压力和客诉追溯识别当前热点供应商。</p>
                </div>
                <div className="space-y-3">
                  {overviewData.supplierRiskRanking.map((item) => (
                    <RankingItem key={item.supplierName} item={item} showSupplier />
                  ))}
                </div>
              </Card>

              <Card className="p-5">
                <div className="mb-4">
                  <h3 className="text-base font-semibold text-gray-900">SKU / 批次问题排行</h3>
                  <p className="mt-1 text-sm text-gray-500">用于发现重复发生问题的 SKU 或批次，给采购和质控复盘输入。</p>
                </div>
                <div className="space-y-3">
                  {overviewData.skuBatchRiskRanking.map((item) => (
                    <RankingItem key={`${item.sku}-${item.batchNo}`} item={item} />
                  ))}
                </div>
              </Card>

              <Card className="p-5">
                <div className="mb-4">
                  <h3 className="text-base font-semibold text-gray-900">客诉问题类型分布</h3>
                  <p className="mt-1 text-sm text-gray-500">从客户反馈结构识别当前最常见的问题表现。</p>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={overviewData.complaintTypeDistribution} margin={{ top: 8, right: 8, bottom: 16, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} angle={-15} textAnchor="end" height={52} />
                      <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                      <RechartsTooltip contentStyle={{ borderRadius: 12, borderColor: '#E5E7EB' }} />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]} fill={COMPLAINT_TYPE_COLOR} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </section>

          <section>
            <OverviewSectionTitle
              title="待办与风险清单"
              subtitle="把最需要处理的排期、任务、客诉和高风险问题拆成独立工作面板，方便快速下钻。"
            />
            <div className="grid grid-cols-1 gap-6 2xl:grid-cols-2">
              {overviewData.todoPanels.map((panel) => (
                <TodoPanel key={panel.id} panel={panel} onNavigate={safeNavigate} />
              ))}
            </div>
          </section>

          <Card className="border border-dashed border-teal-200 bg-teal-50/50 p-5">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-white p-2.5 shadow-sm">
                  <GitBranch className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">当前质量运营判断</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    当前更需要优先处理的是供应商重复问题批次与超期任务，建议先稳住入库前置排期，再推动任务验证和客诉闭环。
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge tone="warning">排期压力需要关注</Badge>
                <Badge tone="danger">供应商重复问题需复盘</Badge>
                <Badge tone="primary">客户反馈持续驱动追溯</Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
