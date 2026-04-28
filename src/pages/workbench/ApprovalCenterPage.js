import React from 'react';
import {
  Search,
  FileText,
  User,
  Building2,
  CheckCircle2,
  Clock3,
  XCircle,
  AlertCircle,
  Layers3,
  ArrowUpRight,
  CalendarClock,
} from 'lucide-react';
import cn from '../../utils/cn';
import { mockStore } from '../../services/_mockStore';
import { APPROVALS } from '../../utils/storageKeys';

/** 内置 mock 列表：仅作 fallback。
 *  实际数据来源：mockStore.get(APPROVALS) ?? approvalMockFallback。
 *  通过/驳回操作在 ApprovalDetailPage 内完成并写回 mockStore。 */
const approvalMockFallback = [
  {
    id: 'AP-202601-001',
    approvalNo: 'AP-202601-001',
    title: '达人投放合作费用待会计审核',
    submitter: '张三',
    submitDept: '直营电商部',
    expenseDept: '直营电商部',
    sourceModule: '财务',
    todoView: 'pending_me',
    currentNode: '会计审核',
    priority: 'high',
    deadlineAt: '2026-01-16 18:00',
    updatedAt: '2026-01-14 11:20',
    summary: 'TikTok US 1 月达人投放合作费，需在付款日前完成凭证校验。',
    customerGroup: 'TikTok US',
    paymentReason: '达人投放合作费用（1月）',
    accountingDimension: null,
    budgetSubjectCode: '6602.01.001',
    amount: 12000,
    currency: 'CNY',
    paymentMethod: '银行转账',
    paymentEntity: '深圳波塞冬科技有限公司',
    expectedPaymentDate: '2026-01-20',
    receiverName: '上海XX文化传媒有限公司',
    receiverAccount: '6222 8888 1234 5678',
    receiverBank: '招商银行上海分行',
    status: 'pending_accounting',
    hasAttachment: true,
    attachments: [
      { name: '达人合作合同.pdf', size: '2.1 MB', type: 'pdf' },
      { name: '投放排期.xlsx', size: '164 KB', type: 'sheet' },
    ],
    submitDate: '2026-01-12 10:23',
    budgetVersion: 'FY2026.V1',
    budgetUsageRate: 62,
    budgetTotal: 1000000,
    budgetUsed: 620000,
    kingdeePayableNo: '',
    approvalFlow: [
      { id: 'f1', timestamp: '2026-01-12 10:24', nodeName: '提交', approver: '张三', result: 'approved', remark: '已提交' },
      { id: 'f2', timestamp: '', nodeName: '会计审核', approver: 'Lyn', result: 'pending' },
      { id: 'f3', timestamp: '', nodeName: '总监审核', approver: '杨萌', result: 'pending' },
    ],
  },
  {
    id: 'AP-202601-002',
    approvalNo: 'AP-202601-002',
    title: 'Amazon 广告投放费用已审批完成',
    submitter: '李四',
    submitDept: '平台电商部',
    expenseDept: '平台电商部',
    sourceModule: '市场',
    todoView: 'initiated_by_me',
    currentNode: '已完成',
    priority: 'medium',
    deadlineAt: '2026-01-25 18:00',
    updatedAt: '2026-01-11 15:20',
    summary: 'Amazon Q1 广告预算已审批完成，待财务按计划执行。',
    customerGroup: 'Amazon',
    paymentReason: '亚马逊广告投放费用（Q1）',
    accountingDimension: null,
    budgetSubjectCode: '6602.02.001',
    amount: 35000,
    currency: 'USD',
    paymentMethod: '银行转账',
    paymentEntity: '深圳波塞冬科技有限公司',
    expectedPaymentDate: '2026-01-25',
    receiverName: 'Amazon Advertising LLC',
    receiverAccount: '1234 5678 9012 3456',
    receiverBank: 'Bank of America',
    status: 'completed',
    hasAttachment: true,
    attachments: [
      { name: '平台广告账单.pdf', size: '1.4 MB', type: 'pdf' },
      { name: '预算审批截图.png', size: '612 KB', type: 'image' },
    ],
    submitDate: '2026-01-10 14:15',
    budgetVersion: 'FY2026.V1',
    budgetUsageRate: 45,
    budgetTotal: 500000,
    budgetUsed: 225000,
    kingdeePayableNo: 'KD202601001',
    approvalFlow: [
      { id: 'f1', timestamp: '2026-01-10 14:16', nodeName: '提交', approver: '李四', result: 'approved', remark: '已提交' },
      { id: 'f2', timestamp: '2026-01-11 09:30', nodeName: '会计审核', approver: 'Lyn', result: 'approved', remark: '审核通过' },
      { id: 'f3', timestamp: '2026-01-11 15:20', nodeName: '总监审核', approver: '杨萌', result: 'approved', remark: '同意' },
    ],
  },
  {
    id: 'AP-202601-003',
    approvalNo: 'AP-202601-003',
    title: '供应商货款结算待财务总监审核',
    submitter: '王五',
    submitDept: '供应链管理部',
    expenseDept: '供应链管理部',
    sourceModule: '采购',
    todoView: 'pending_me',
    currentNode: '财务总监审核',
    priority: 'high',
    deadlineAt: '2026-01-15 16:00',
    updatedAt: '2026-01-14 09:05',
    summary: '12 月供应商货款结算，本周内需完成终审并安排付款。',
    customerGroup: '内部',
    paymentReason: '供应商货款结算（12月）',
    accountingDimension: null,
    budgetSubjectCode: '2201.01.001',
    amount: 85000,
    currency: 'CNY',
    paymentMethod: '银行转账',
    paymentEntity: '深圳波塞冬科技有限公司',
    expectedPaymentDate: '2026-01-18',
    receiverName: '东莞XX制造有限公司',
    receiverAccount: '8888 6666 1234 5678',
    receiverBank: '中国工商银行东莞分行',
    status: 'pending_director',
    hasAttachment: false,
    attachments: [],
    submitDate: '2026-01-13 11:45',
    budgetVersion: 'FY2026.V1',
    budgetUsageRate: 78,
    budgetTotal: 2000000,
    budgetUsed: 1560000,
    kingdeePayableNo: '',
    approvalFlow: [
      { id: 'f1', timestamp: '2026-01-13 11:46', nodeName: '提交', approver: '王五', result: 'approved', remark: '已提交' },
      { id: 'f2', timestamp: '2026-01-13 16:10', nodeName: '会计审核', approver: 'Lyn', result: 'approved', remark: '单据齐全' },
      { id: 'f3', timestamp: '', nodeName: '财务总监审核', approver: '陈总', result: 'pending' },
    ],
  },
  {
    id: 'AP-202601-004',
    approvalNo: 'AP-202601-004',
    title: '品牌推广活动费用被驳回',
    submitter: '赵六',
    submitDept: '市场部',
    expenseDept: '市场部',
    sourceModule: '市场',
    todoView: 'initiated_by_me',
    currentNode: '会计审核驳回',
    priority: 'medium',
    deadlineAt: '2026-01-17 12:00',
    updatedAt: '2026-01-09 10:15',
    summary: '预算不足，需调整费用结构后重新发起申请。',
    customerGroup: '内部',
    paymentReason: '品牌推广活动费用',
    accountingDimension: null,
    budgetSubjectCode: '6601.03.002',
    amount: 25000,
    currency: 'CNY',
    paymentMethod: '银行转账',
    paymentEntity: '深圳波塞冬科技有限公司',
    expectedPaymentDate: '2026-01-22',
    receiverName: '北京XX广告有限公司',
    receiverAccount: '9999 7777 1234 5678',
    receiverBank: '中国建设银行北京分行',
    status: 'rejected',
    hasAttachment: true,
    attachments: [
      { name: '活动报价单.pdf', size: '842 KB', type: 'pdf' },
    ],
    submitDate: '2026-01-08 09:20',
    budgetVersion: 'FY2026.V1',
    budgetUsageRate: 35,
    budgetTotal: 300000,
    budgetUsed: 105000,
    kingdeePayableNo: '',
    approvalFlow: [
      { id: 'f1', timestamp: '2026-01-08 09:21', nodeName: '提交', approver: '赵六', result: 'approved', remark: '已提交' },
      { id: 'f2', timestamp: '2026-01-09 10:15', nodeName: '会计审核', approver: 'Lyn', result: 'rejected', remark: '预算不足，请重新申请' },
    ],
  },
  {
    id: 'AP-202601-005',
    approvalNo: 'AP-202601-005',
    title: '物流服务费用待推送金蝶',
    submitter: '孙七',
    submitDept: '物流部',
    expenseDept: '物流部',
    sourceModule: '物流',
    todoView: 'copied_to_me',
    currentNode: '推送金蝶',
    priority: 'low',
    deadlineAt: '2026-01-19 11:00',
    updatedAt: '2026-01-15 08:45',
    summary: '审批已结束，等待系统生成应付单并回写单号。',
    customerGroup: '内部',
    paymentReason: '物流服务费用（1月）',
    accountingDimension: null,
    budgetSubjectCode: '6602.05.001',
    amount: 18000,
    currency: 'CNY',
    paymentMethod: '银行转账',
    paymentEntity: '深圳波塞冬科技有限公司',
    expectedPaymentDate: '2026-01-19',
    receiverName: '深圳XX物流有限公司',
    receiverAccount: '7777 5555 1234 5678',
    receiverBank: '中国银行深圳分行',
    status: 'pending_kingdee',
    hasAttachment: true,
    attachments: [
      { name: '物流对账单.pdf', size: '1.1 MB', type: 'pdf' },
      { name: '结算清单.xlsx', size: '226 KB', type: 'sheet' },
    ],
    submitDate: '2026-01-14 16:30',
    budgetVersion: 'FY2026.V1',
    budgetUsageRate: 55,
    budgetTotal: 800000,
    budgetUsed: 440000,
    kingdeePayableNo: '',
    approvalFlow: [
      { id: 'f1', timestamp: '2026-01-14 16:31', nodeName: '提交', approver: '孙七', result: 'approved', remark: '已提交' },
      { id: 'f2', timestamp: '2026-01-15 08:45', nodeName: '会计审核', approver: 'Lyn', result: 'approved', remark: '审核通过' },
      { id: 'f3', timestamp: '2026-01-15 09:10', nodeName: '部门总监审核', approver: '刘总', result: 'approved', remark: '同意执行' },
      { id: 'f4', timestamp: '', nodeName: '推送金蝶', approver: '系统自动', result: 'pending' },
    ],
  },
  {
    id: 'AP-202601-006',
    approvalNo: 'AP-202601-006',
    title: '软件授权费用已归档',
    submitter: '周八',
    submitDept: '研发部',
    expenseDept: '研发部',
    sourceModule: '人事',
    todoView: 'initiated_by_me',
    currentNode: '已完成',
    priority: 'medium',
    deadlineAt: '2026-01-28 18:00',
    updatedAt: '2026-01-12 16:30',
    summary: '年度软件授权采购已审批完成，等待后续回款核销。',
    customerGroup: '内部',
    paymentReason: '软件授权费用（年度）',
    accountingDimension: null,
    budgetSubjectCode: '6602.06.001',
    amount: 50000,
    currency: 'CNY',
    paymentMethod: '银行转账',
    paymentEntity: '深圳波塞冬科技有限公司',
    expectedPaymentDate: '2026-01-28',
    receiverName: '上海XX软件技术有限公司',
    receiverAccount: '6666 4444 1234 5678',
    receiverBank: '交通银行上海分行',
    status: 'completed',
    hasAttachment: true,
    attachments: [
      { name: '软件授权合同.pdf', size: '3.2 MB', type: 'pdf' },
      { name: '采购审批截图.png', size: '488 KB', type: 'image' },
    ],
    submitDate: '2026-01-11 13:20',
    budgetVersion: 'FY2026.V1',
    budgetUsageRate: 40,
    budgetTotal: 600000,
    budgetUsed: 240000,
    kingdeePayableNo: 'KD202601002',
    approvalFlow: [
      { id: 'f1', timestamp: '2026-01-11 13:21', nodeName: '提交', approver: '周八', result: 'approved', remark: '已提交' },
      { id: 'f2', timestamp: '2026-01-12 10:00', nodeName: '会计审核', approver: 'Lyn', result: 'approved', remark: '审核通过' },
      { id: 'f3', timestamp: '2026-01-12 16:30', nodeName: '技术总监审核', approver: '张总', result: 'approved', remark: '同意支付' },
    ],
  },
];

const STATUS_META = {
  pending_accounting: {
    label: '待会计审核',
    tone: 'bg-warning-50 text-warning-700 border-warning-100',
    icon: Clock3,
  },
  pending_director: {
    label: '待总监审核',
    tone: 'bg-orange-50 text-orange-700 border-orange-100',
    icon: AlertCircle,
  },
  pending_kingdee: {
    label: '待推送金蝶',
    tone: 'bg-brand-50 text-brand-700 border-brand-100',
    icon: Clock3,
  },
  completed: {
    label: '已完成',
    tone: 'bg-success-50 text-success-700 border-success-100',
    icon: CheckCircle2,
  },
  rejected: {
    label: '已驳回',
    tone: 'bg-danger-50 text-danger-700 border-danger-100',
    icon: XCircle,
  },
};

const PRIORITY_META = {
  high: { label: '高优先级', tone: 'bg-danger-50 text-danger-700 border-danger-100' },
  medium: { label: '中优先级', tone: 'bg-warning-50 text-warning-700 border-warning-100' },
  low: { label: '低优先级', tone: 'bg-slate-100 text-slate-700 border-slate-200' },
};

const TODO_VIEW_OPTIONS = [
  { value: '', label: '全部视角' },
  { value: 'pending_me', label: '待我处理' },
  { value: 'initiated_by_me', label: '我发起的' },
  { value: 'copied_to_me', label: '抄送给我' },
];

const STATUS_OPTIONS = [
  { value: '', label: '全部状态' },
  { value: 'pending_accounting', label: '待会计审核' },
  { value: 'pending_director', label: '待总监审核' },
  { value: 'pending_kingdee', label: '待推送金蝶' },
  { value: 'completed', label: '已完成' },
  { value: 'rejected', label: '已驳回' },
];

const MODULE_OPTIONS = [
  { value: '', label: '全部模块' },
  { value: '财务', label: '财务' },
  { value: '采购', label: '采购' },
  { value: '物流', label: '物流' },
  { value: '市场', label: '市场' },
  { value: '人事', label: '人事' },
];

const isPendingStatus = (status = '') => status.startsWith('pending');

function formatCurrency(amount = 0, currency = 'CNY') {
  const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '¥';
  return `${symbol}${Number(amount || 0).toLocaleString()}`;
}

function Card({ children, className }) {
  return (
    <div className={cn('rounded-2xl border border-border bg-surface shadow-panel', className)}>
      {children}
    </div>
  );
}

function Badge({ children, className }) {
  return (
    <span className={cn('inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium', className)}>
      {children}
    </span>
  );
}

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.rejected;
  const Icon = meta.icon;
  return (
    <Badge className={meta.tone}>
      <Icon className="mr-1 h-3.5 w-3.5" />
      {meta.label}
    </Badge>
  );
}

function PriorityBadge({ priority }) {
  const meta = PRIORITY_META[priority] || PRIORITY_META.medium;
  return <Badge className={meta.tone}>{meta.label}</Badge>;
}

function StatCard({ title, value, helper, tone = 'brand', icon: Icon }) {
  const toneClasses = {
    brand: 'bg-brand-50 text-brand-700 border-brand-100',
    warning: 'bg-warning-50 text-warning-700 border-warning-100',
    success: 'bg-success-50 text-success-700 border-success-100',
    danger: 'bg-danger-50 text-danger-700 border-danger-100',
  };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-2xl border', toneClasses[tone])}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-text-subtle">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-text">{value}</p>
          <p className="mt-1 text-xs text-text-subtle">{helper}</p>
        </div>
      </div>
    </Card>
  );
}

export default function ApprovalCenterPage({ records = [], onOpenDetail }) {
  const [keyword, setKeyword] = React.useState('');
  const [todoView, setTodoView] = React.useState('');
  const [status, setStatus] = React.useState('');
  const [sourceModule, setSourceModule] = React.useState('');

  // 原型级持久化：列表数据从 mockStore 读取（含其他页面操作后的最新状态）；
  // 没有则使用内置 fallback。每次组件重新挂载（如切回该 tab）会重新读取，
  // 所以从 ApprovalDetailPage 通过/驳回后切回列表页可以看到状态变化。
  const stored = React.useMemo(() => mockStore.get(APPROVALS) ?? approvalMockFallback, []);
  // 首次挂载时把首帧 mock 数据固化到 storage（避免后续详情页操作后无 base 数据）。
  React.useEffect(() => {
    if (mockStore.get(APPROVALS) == null) {
      mockStore.set(APPROVALS, approvalMockFallback);
    }
  }, []);

  const source = records && records.length > 0 ? records : stored;

  const filtered = React.useMemo(() => {
    const search = keyword.trim().toLowerCase();
    return source.filter((item) => {
      const matchesKeyword =
        !search ||
        (item.approvalNo || '').toLowerCase().includes(search) ||
        (item.title || '').toLowerCase().includes(search) ||
        (item.submitter || '').toLowerCase().includes(search) ||
        (item.submitDept || '').toLowerCase().includes(search) ||
        (item.currentNode || '').toLowerCase().includes(search);
      const matchesView = !todoView || item.todoView === todoView;
      const matchesStatus = !status || item.status === status;
      const matchesModule = !sourceModule || item.sourceModule === sourceModule;
      return matchesKeyword && matchesView && matchesStatus && matchesModule;
    });
  }, [keyword, todoView, status, sourceModule, source]);

  const stats = React.useMemo(() => {
    const pendingMe = source.filter((item) => item.todoView === 'pending_me' && isPendingStatus(item.status)).length;
    const inProgress = source.filter((item) => isPendingStatus(item.status)).length;
    const completed = source.filter((item) => item.status === 'completed').length;
    const rejected = source.filter((item) => item.status === 'rejected').length;
    return { pendingMe, inProgress, completed, rejected };
  }, [source]);

  const resetFilters = () => {
    setKeyword('');
    setTodoView('');
    setStatus('');
    setSourceModule('');
  };

  const hasFilters = Boolean(keyword || todoView || status || sourceModule);

  return (
    <div className="min-h-0 flex-1 overflow-auto bg-surface-muted p-6">
      <div className="mx-auto max-w-[1440px] space-y-5">
        <Card className="overflow-hidden">
          <div className="border-b border-border px-6 py-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
                  <Layers3 className="h-3.5 w-3.5" />
                  工作台 / 待办与审批
                </div>
                <div>
                  <h1 className="ui-page-title">待办 & 审批中心</h1>
                  <p className="mt-1 text-sm text-text-subtle">
                    聚合待我处理、我发起和抄送给我的审批任务，保留原有审批详情查看路径。
                  </p>
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-surface-subtle px-4 py-3 text-sm text-text-muted">
                <p>当前列表共 <span className="font-semibold text-text">{filtered.length}</span> 条任务</p>
                <p className="mt-1 text-xs text-text-subtle">点击任意行进入审批详情</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 border-b border-border px-6 py-5 md:grid-cols-2 xl:grid-cols-4">
            <StatCard title="待我处理" value={stats.pendingMe} helper="我需要尽快处理的审批" tone="warning" icon={AlertCircle} />
            <StatCard title="审批中" value={stats.inProgress} helper="仍在流转中的任务" tone="brand" icon={Clock3} />
            <StatCard title="已完成" value={stats.completed} helper="已通过并归档" tone="success" icon={CheckCircle2} />
            <StatCard title="已驳回" value={stats.rejected} helper="需补充后再次发起" tone="danger" icon={XCircle} />
          </div>

          <div className="px-6 py-5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-full md:w-80">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle" />
                <input
                  className="ui-input pl-10"
                  placeholder="搜索审批单号、标题、提交人、当前节点"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>

              <select
                value={todoView}
                onChange={(e) => setTodoView(e.target.value)}
                className="ui-select w-full md:w-40"
              >
                {TODO_VIEW_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="ui-select w-full md:w-40"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <select
                value={sourceModule}
                onChange={(e) => setSourceModule(e.target.value)}
                className="ui-select w-full md:w-36"
              >
                {MODULE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {hasFilters && (
                <button
                  onClick={resetFilters}
                  className="text-sm font-medium text-brand-600 transition-colors hover:text-brand-700"
                >
                  清除筛选
                </button>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-text-subtle">
              <span className="inline-flex items-center gap-1 rounded-full bg-surface-subtle px-3 py-1">
                <AlertCircle className="h-4 w-4" />
                待办与审批混合视图
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-surface-subtle px-3 py-1">
                <Building2 className="h-4 w-4" />
                支持跨模块 mock 内容
              </span>
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1180px] text-sm">
              <thead className="bg-surface-subtle">
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left font-medium text-text-muted">任务信息</th>
                  <th className="px-4 py-3 text-left font-medium text-text-muted">提交人与来源</th>
                  <th className="px-4 py-3 text-left font-medium text-text-muted">金额 / 摘要</th>
                  <th className="px-4 py-3 text-left font-medium text-text-muted">优先级 / 时效</th>
                  <th className="px-4 py-3 text-left font-medium text-text-muted">当前状态</th>
                  <th className="px-4 py-3 text-left font-medium text-text-muted">更新时间</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle bg-white">
                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="cursor-pointer hover:bg-surface-muted"
                    onClick={() => onOpenDetail && onOpenDetail(item)}
                  >
                    <td className="px-4 py-4 align-top">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-text">{item.title}</p>
                            <ArrowUpRight className="h-3.5 w-3.5 text-text-subtle" />
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-text-subtle">
                            <span className="rounded-full bg-surface-subtle px-2.5 py-1">{item.approvalNo}</span>
                            <span className="rounded-full bg-surface-subtle px-2.5 py-1">{item.currentNode}</span>
                          </div>
                          <p className="mt-2 max-w-md text-xs leading-5 text-text-subtle">{item.summary}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="space-y-2 text-text-muted">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-text-subtle" />
                          <span>{item.submitter}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-text-subtle" />
                          <span>{item.submitDept}</span>
                        </div>
                        <Badge className="border-border bg-surface-subtle text-text-muted">
                          {item.sourceModule} / {item.todoView === 'pending_me' ? '待我处理' : item.todoView === 'initiated_by_me' ? '我发起的' : '抄送给我'}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <p className="font-semibold text-text">{formatCurrency(item.amount, item.currency)}</p>
                      <p className="mt-1 text-xs text-text-subtle">{item.paymentReason}</p>
                      <p className="mt-1 text-xs text-text-subtle">预算版本 {item.budgetVersion}</p>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="space-y-2">
                        <PriorityBadge priority={item.priority} />
                        <div className="inline-flex items-center gap-1 text-xs text-text-subtle">
                          <CalendarClock className="h-3.5 w-3.5" />
                          {item.deadlineAt}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="text-sm text-text">{item.updatedAt}</div>
                      <div className="mt-1 text-xs text-text-subtle">提交于 {item.submitDate}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="px-6 py-16 text-center text-text-subtle">
              <Layers3 className="mx-auto mb-3 h-12 w-12 text-slate-300" />
              <p className="text-base font-medium text-text">
                {hasFilters ? '当前筛选条件下没有匹配的任务' : '暂无待办与审批任务'}
              </p>
              <p className="mt-2 text-sm">
                {hasFilters ? '可以尝试清除筛选或调整关键词、状态和来源模块。' : '后续任务流会在这里集中呈现。'}
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
