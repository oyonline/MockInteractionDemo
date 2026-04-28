import React from 'react';
import {
  ArrowLeft,
  FileText,
  User,
  Building2,
  DollarSign,
  Paperclip,
  TrendingUp,
  Download,
  CheckCircle2,
  Clock3,
  XCircle,
  AlertCircle,
  Calendar as CalendarIcon,
  Target,
  Layers3,
  ArrowUpRight,
} from 'lucide-react';
import cn from '../../utils/cn';
import { toast } from '../../components/ui/Toast';
import { confirm } from '../../components/ui/ConfirmDialog';
import { mockStore } from '../../services/_mockStore';
import { APPROVALS } from '../../utils/storageKeys';

/** 待审批的复合状态：当前流程未到终态。 */
const isPendingApproval = (status = '') => status.startsWith('pending');

/** 当前时间字符串（与 mock 数据风格一致：YYYY-MM-DD HH:mm） */
function nowStr() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const DIM_TYPES = {
  DEPT_CUSTGROUP_CUST_EXPENSE: 'dept-custgroup-cust-expense',
  DEPT_PROJECT: 'dept-project',
  CUSTGROUP_EXPENSE: 'custgroup-expense',
  DEPT: 'dept',
};

function getDimensionTypeBySubjectCode(subjectCode = '') {
  if (!subjectCode) return null;
  if (subjectCode.startsWith('2241')) return DIM_TYPES.DEPT;
  if (subjectCode.startsWith('6602')) return DIM_TYPES.DEPT_CUSTGROUP_CUST_EXPENSE;
  if (subjectCode.startsWith('5301')) return DIM_TYPES.DEPT_PROJECT;
  if (subjectCode.startsWith('6601')) return DIM_TYPES.CUSTGROUP_EXPENSE;
  return DIM_TYPES.DEPT;
}

function getDimensionBadges(dimensionType) {
  switch (dimensionType) {
    case DIM_TYPES.DEPT_CUSTGROUP_CUST_EXPENSE:
      return [
        { label: '部门', classes: 'bg-brand-50 text-brand-700 border-brand-100' },
        { label: '客户分组', classes: 'bg-violet-50 text-violet-700 border-violet-100' },
        { label: '客户', classes: 'bg-success-50 text-success-700 border-success-100' },
        { label: '费用编码', classes: 'bg-warning-50 text-warning-700 border-warning-100' },
      ];
    case DIM_TYPES.DEPT_PROJECT:
      return [
        { label: '部门', classes: 'bg-brand-50 text-brand-700 border-brand-100' },
        { label: '项目', classes: 'bg-violet-50 text-violet-700 border-violet-100' },
      ];
    case DIM_TYPES.CUSTGROUP_EXPENSE:
      return [
        { label: '客户分组', classes: 'bg-violet-50 text-violet-700 border-violet-100' },
        { label: '费用编码', classes: 'bg-warning-50 text-warning-700 border-warning-100' },
      ];
    case DIM_TYPES.DEPT:
    default:
      return [{ label: '部门', classes: 'bg-brand-50 text-brand-700 border-brand-100' }];
  }
}

function formatCurrency(amount = 0, currency = 'CNY') {
  const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '¥';
  const num = Number.isFinite(amount) ? amount : 0;
  return `${symbol}${num.toLocaleString()}`;
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
  const base = 'border';
  if (status === 'pending_accounting') {
    return <Badge className={`${base} bg-warning-50 text-warning-700 border-warning-100`}>待会计审核</Badge>;
  }
  if (status === 'pending_director') {
    return <Badge className={`${base} bg-orange-50 text-orange-700 border-orange-100`}>待总监审核</Badge>;
  }
  if (status === 'pending_kingdee') {
    return <Badge className={`${base} bg-brand-50 text-brand-700 border-brand-100`}>待推送金蝶</Badge>;
  }
  if (status === 'completed') {
    return <Badge className={`${base} bg-success-50 text-success-700 border-success-100`}>已完成</Badge>;
  }
  return <Badge className={`${base} bg-danger-50 text-danger-700 border-danger-100`}>已驳回</Badge>;
}

function PriorityBadge({ priority }) {
  if (priority === 'high') {
    return <Badge className="bg-danger-50 text-danger-700 border-danger-100">高优先级</Badge>;
  }
  if (priority === 'low') {
    return <Badge className="bg-slate-100 text-slate-700 border-slate-200">低优先级</Badge>;
  }
  return <Badge className="bg-warning-50 text-warning-700 border-warning-100">中优先级</Badge>;
}

function StepIcon({ result }) {
  if (result === 'approved') return <CheckCircle2 className="h-5 w-5 text-success-700" />;
  if (result === 'pending') return <Clock3 className="h-5 w-5 text-text-subtle" />;
  if (result === 'rejected') return <XCircle className="h-5 w-5 text-danger-700" />;
  return <AlertCircle className="h-5 w-5 text-brand-700" />;
}

function AttachmentIcon({ type }) {
  if (type === 'image') return 'IMG';
  if (type === 'sheet') return 'XLS';
  return 'PDF';
}

const FALLBACK_RECORD = {
  approvalNo: '-',
  title: '待办审批详情',
  submitter: '-',
  submitDept: '-',
  expenseDept: '-',
  sourceModule: '财务',
  currentNode: '待处理',
  priority: 'medium',
  deadlineAt: '-',
  updatedAt: '-',
  customerGroup: '-',
  paymentReason: '-',
  accountingDimension: null,
  budgetSubjectCode: '',
  amount: 0,
  currency: 'CNY',
  paymentMethod: '-',
  paymentEntity: '-',
  expectedPaymentDate: '-',
  receiverName: '-',
  receiverAccount: '-',
  receiverBank: '-',
  status: 'pending_accounting',
  hasAttachment: false,
  attachments: [],
  submitDate: '-',
  budgetVersion: '-',
  budgetUsageRate: 0,
  budgetTotal: 0,
  budgetUsed: 0,
  kingdeePayableNo: '',
  approvalFlow: [],
  summary: '',
};

/** 通过：把所有 pending 节点标记为 approved，整体状态设 completed。
 *  纳入"演示环境：审批通过"备注，便于在时间线上看到操作记录。 */
function applyApprove(rec) {
  const ts = nowStr();
  const approvalFlow = (rec.approvalFlow || []).map((step) =>
    step.result === 'pending'
      ? { ...step, result: 'approved', timestamp: ts, remark: step.remark || '演示环境：审批通过' }
      : step
  );
  return {
    ...rec,
    status: 'completed',
    currentNode: '已完成',
    approvedAt: ts,
    updatedAt: ts,
    approvalFlow,
  };
}

/** 驳回：把第一个 pending 节点标记为 rejected，整体状态设 rejected。 */
function applyReject(rec, reason = '演示环境：审批驳回') {
  const ts = nowStr();
  let firstPendingHit = false;
  const approvalFlow = (rec.approvalFlow || []).map((step) => {
    if (!firstPendingHit && step.result === 'pending') {
      firstPendingHit = true;
      return { ...step, result: 'rejected', timestamp: ts, remark: reason };
    }
    return step;
  });
  return {
    ...rec,
    status: 'rejected',
    currentNode: '已驳回',
    rejectedAt: ts,
    updatedAt: ts,
    approvalFlow,
  };
}

export default function ApprovalDetailPage({ record, onBack }) {
  // 优先从 mockStore 读取该单据的最新状态（来自上次审批后的写入）；
  // 没有命中则用 props.record，再没有用 fallback。这样切回详情页能看到最新结果。
  const computeInitial = React.useCallback(() => {
    const stored = mockStore.get(APPROVALS) || [];
    if (record && record.id) {
      const hit = stored.find((x) => x.id === record.id);
      if (hit) return hit;
    }
    return record || FALLBACK_RECORD;
  }, [record]);

  const [r, setR] = React.useState(computeInitial);

  // props.record 变化时（如父级打开不同审批单）重新初始化本地 state
  React.useEffect(() => {
    setR(computeInitial());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record?.id]);

  const isPending = isPendingApproval(r.status);

  /** 把单条修改后的 record 写回 mockStore 列表中对应位置。 */
  const persistRecord = React.useCallback((updated) => {
    if (!updated?.id) return;
    mockStore.update(
      APPROVALS,
      (prev) => {
        const list = Array.isArray(prev) ? prev : [];
        const idx = list.findIndex((x) => x.id === updated.id);
        if (idx === -1) return [updated, ...list];
        const next = list.slice();
        next[idx] = updated;
        return next;
      },
      []
    );
  }, []);

  const handleApprove = async () => {
    if (!isPending) {
      toast.warning('当前状态不可执行通过操作');
      return;
    }
    const ok = await confirm({
      title: '确认通过',
      description: `确定通过审批单「${r.title}」？通过后将进入下一节点或完成审批。`,
      confirmText: '通过',
      cancelText: '取消',
    });
    if (!ok) return;
    try {
      const next = applyApprove(r);
      setR(next);
      persistRecord(next);
      toast.success('审批已通过');
    } catch (err) {
      toast.error('操作失败：审批通过未能保存');
    }
  };

  const handleReject = async () => {
    if (!isPending) {
      toast.warning('当前状态不可执行驳回操作');
      return;
    }
    const ok = await confirm({
      title: '确认驳回',
      description: `确定驳回审批单「${r.title}」？驳回后申请人需重新提交。`,
      confirmText: '驳回',
      cancelText: '取消',
      danger: true,
    });
    if (!ok) return;
    try {
      const next = applyReject(r);
      setR(next);
      persistRecord(next);
      toast.success('审批已驳回');
    } catch (err) {
      toast.error('操作失败：审批驳回未能保存');
    }
  };

  const dimensionType = r.accountingDimension || getDimensionTypeBySubjectCode(r.budgetSubjectCode);
  const badges = getDimensionBadges(dimensionType);
  const progress = Math.max(0, Math.min(100, Number(r.budgetUsageRate) || 0));
  const balance = (Number(r.budgetTotal) || 0) - (Number(r.budgetUsed) || 0);
  const expectedRemain = balance - (Number(r.amount) || 0);
  const attachments = Array.isArray(r.attachments) ? r.attachments : [];

  return (
    <div className="min-h-0 flex-1 overflow-auto bg-surface-muted">
      <div className="mx-auto max-w-[1440px] space-y-6 p-6">
        <Card className="overflow-hidden">
          <div className="border-b border-border px-6 py-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex flex-wrap items-start gap-4">
                <button
                  onClick={onBack}
                  className="inline-flex h-10 items-center rounded-xl border border-border bg-surface px-4 text-sm font-medium text-text transition-colors hover:border-border-strong hover:bg-surface-subtle"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  返回列表
                </button>
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
                    <Layers3 className="h-3.5 w-3.5" />
                    审批详情
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-xl font-semibold text-text">{r.title || '审批单详情'}</h1>
                      <ArrowUpRight className="h-4 w-4 text-text-subtle" />
                    </div>
                    <p className="mt-1 text-sm text-text-subtle">审批单号：{r.approvalNo}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={r.status} />
                <PriorityBadge priority={r.priority} />
                <Badge className="border-border bg-surface-subtle text-text-muted">{r.sourceModule || '财务'}</Badge>
                {isPending && (
                  <>
                    <button
                      type="button"
                      onClick={handleReject}
                      className="inline-flex h-10 items-center rounded-xl border border-danger-100 bg-danger-50 px-4 text-sm font-medium text-danger-700 transition-colors hover:bg-danger-100"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      驳回
                    </button>
                    <button
                      type="button"
                      onClick={handleApprove}
                      className="inline-flex h-10 items-center rounded-xl bg-success-600 px-4 text-sm font-medium text-white transition-colors hover:bg-success-700"
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      通过
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => toast.info('演示功能：导出 PDF')}
                  className="inline-flex h-10 items-center rounded-xl border border-border bg-surface px-4 text-sm font-medium text-text transition-colors hover:border-border-strong hover:bg-surface-subtle"
                >
                  <Download className="mr-2 h-4 w-4" />
                  导出PDF
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 px-6 py-5 md:grid-cols-2 xl:grid-cols-4">
            <SummaryCard label="当前节点" value={r.currentNode || '待处理'} icon={Clock3} />
            <SummaryCard label="截止处理时间" value={r.deadlineAt || '-'} icon={CalendarIcon} />
            <SummaryCard label="提交人" value={r.submitter || '-'} icon={User} />
            <SummaryCard label="最后更新时间" value={r.updatedAt || '-'} icon={TrendingUp} />
          </div>
        </Card>

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <Card className="p-6">
              <SectionTitle icon={FileText} title="基础信息" />

              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <InfoItem label="审批单号" value={<span className="font-medium text-brand-700">{r.approvalNo}</span>} />
                  <InfoItem
                    label="提交人"
                    value={
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-text-subtle" />
                        <span>{r.submitter}</span>
                      </div>
                    }
                  />
                  <InfoItem
                    label="提交部门"
                    value={
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-text-subtle" />
                        <span>{r.submitDept}</span>
                      </div>
                    }
                  />
                  <InfoItem
                    label="费用承担部门"
                    value={
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-brand-700" />
                        <span>{r.expenseDept}</span>
                      </div>
                    }
                  />
                  <InfoItem label="来源模块" value={r.sourceModule || '-'} />
                  <InfoItem
                    label="提交时间"
                    value={
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-text-subtle" />
                        <span>{r.submitDate}</span>
                      </div>
                    }
                  />
                </div>

                <Divider />

                <InfoItem
                  label="任务摘要"
                  value={<div className="rounded-2xl bg-surface-subtle p-4 text-text">{r.summary || r.paymentReason}</div>}
                  full
                />

                <InfoItem
                  label="付款事由"
                  value={<div className="rounded-2xl bg-surface-subtle p-4 text-text">{r.paymentReason}</div>}
                  full
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <InfoItem
                    label="成本中心"
                    value={
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-warning-700" />
                        <span>{r.costCenter || '-'}</span>
                      </div>
                    }
                  />
                  <InfoItem
                    label="核算维度"
                    value={
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {badges.map((item, index) => (
                          <Badge key={`${item.label}-${index}`} className={item.classes}>
                            {item.label}
                          </Badge>
                        ))}
                      </div>
                    }
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <InfoItem
                    label="会计科目"
                    value={<code className="rounded-xl border border-border bg-surface-subtle px-3 py-2 text-sm">{r.budgetSubjectCode}</code>}
                  />
                  <InfoItem label="预算版本" value={r.budgetVersion} />
                </div>

                <div>
                  <div className="mb-3 text-xs text-text-subtle">预算执行情况</div>
                  <div className="rounded-2xl border border-brand-100 bg-brand-50 p-4">
                    <div className="grid gap-3 md:grid-cols-2">
                      <MiniKV label="预算总额度" value={formatCurrency(r.budgetTotal, r.currency)} />
                      <MiniKV label="已使用金额" value={formatCurrency(r.budgetUsed, r.currency)} />
                      <MiniKV label="当前余额" value={formatCurrency(balance, r.currency)} />
                      <MiniKV label="预计剩余" value={formatCurrency(expectedRemain, r.currency)} />
                    </div>

                    <Divider className="my-4 bg-brand-100" />

                    <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                      <div>
                        <div className="text-xs text-brand-700">本次申请金额</div>
                        <div className="mt-1 text-2xl font-semibold text-brand-700">
                          {formatCurrency(r.amount, r.currency)}
                        </div>
                      </div>
                      <div className="text-right text-sm text-text-subtle">
                        预算执行率 {progress}%
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="h-2 overflow-hidden rounded-full bg-white/70">
                        <div className="h-full rounded-full bg-brand-600" style={{ width: `${progress}%` }} />
                      </div>
                      <div className="mt-2 text-xs text-text-subtle">
                        {progress > 90 ? '预算使用率较高，请关注剩余额度。' : '预算余量充足，可按流程继续处理。'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <SectionTitle icon={DollarSign} title="收款方信息" />
              <div className="grid gap-4 md:grid-cols-2">
                <InfoItem
                  label="预计付款日期"
                  value={
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-text-subtle" />
                      <span>{r.expectedPaymentDate}</span>
                    </div>
                  }
                />
                <InfoItem label="付款方式" value={r.paymentMethod} />
                <InfoItem label="付款主体" value={r.paymentEntity} />
                <InfoItem label="客户分组" value={r.customerGroup} />
              </div>

              <Divider className="my-4" />

              <div className="grid gap-4 md:grid-cols-2">
                <InfoItem label="收款账户名" value={r.receiverName} />
                <InfoItem label="收款银行" value={r.receiverBank} />
                <InfoItem
                  label="收款账号"
                  value={<div className="rounded-xl border border-border bg-surface-subtle px-3 py-2 font-mono">{r.receiverAccount}</div>}
                  full
                />
              </div>
            </Card>

            <Card className="p-6">
              <SectionTitle icon={Paperclip} title="附件" />

              {r.hasAttachment && attachments.length > 0 ? (
                <div className="space-y-3">
                  {attachments.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between rounded-2xl border border-border bg-surface-subtle p-3 transition-colors hover:bg-slate-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-200 text-xs font-semibold text-slate-700">
                          {AttachmentIcon({ type: file.type })}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-text">{file.name}</div>
                          <div className="text-xs text-text-subtle">{file.size}</div>
                        </div>
                      </div>
                      <button className="inline-flex h-9 items-center rounded-xl border border-border bg-surface px-3 text-sm text-text transition-colors hover:border-border-strong hover:bg-surface">
                        <Download className="mr-2 h-4 w-4" />
                        下载
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl bg-surface-subtle py-10 text-center">
                  <Paperclip className="mx-auto mb-3 h-12 w-12 text-slate-300" />
                  <p className="text-sm text-text-subtle">暂无附件</p>
                </div>
              )}
            </Card>
          </div>

          <div className="xl:col-span-1">
            <Card className="sticky top-6 p-6">
              <SectionTitle icon={TrendingUp} title="审批流程" />

              <div className="space-y-4">
                {(r.approvalFlow || []).map((step, index) => (
                  <div key={step.id || index} className="relative">
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <StepIcon result={step.result} />
                        {index < (r.approvalFlow || []).length - 1 && (
                          <div className="my-2 h-16 w-0.5 bg-border" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium text-text">{step.nodeName}</span>
                          {step.result === 'approved' && (
                            <Badge className="bg-success-50 text-success-700 border-success-100">通过</Badge>
                          )}
                          {step.result === 'rejected' && (
                            <Badge className="bg-danger-50 text-danger-700 border-danger-100">驳回</Badge>
                          )}
                          {step.result === 'pending' && (
                            <Badge className="bg-surface-subtle text-text-muted border-border">待处理</Badge>
                          )}
                        </div>
                        <div className="mt-1 text-xs text-text-muted">操作人：{step.approver}</div>
                        {step.timestamp && <div className="mt-1 text-xs text-text-subtle">{step.timestamp}</div>}
                        {step.remark && (
                          <div className="mt-2 rounded-xl border border-brand-100 bg-brand-50 px-3 py-2 text-xs text-brand-700">
                            {step.remark}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {(!r.approvalFlow || r.approvalFlow.length === 0) && (
                  <div className="text-sm text-text-subtle">暂无审批记录</div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ icon: Icon, title }) {
  return (
    <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-text">
      <Icon className="h-5 w-5 text-brand-700" />
      {title}
    </h3>
  );
}

function SummaryCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-border bg-surface-subtle p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-brand-700 shadow-sm">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-xs text-text-subtle">{label}</div>
          <div className="mt-1 text-sm font-medium text-text">{value}</div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value, full = false }) {
  return (
    <div className={full ? 'md:col-span-2' : ''}>
      <div className="mb-1 text-xs text-text-subtle">{label}</div>
      <div className="text-sm text-text">{typeof value === 'undefined' || value === null ? '-' : value}</div>
    </div>
  );
}

function MiniKV({ label, value }) {
  return (
    <div>
      <div className="mb-1 text-xs text-text-subtle">{label}</div>
      <div className="text-sm font-medium text-text">{value}</div>
    </div>
  );
}

function Divider({ className = '' }) {
  return <div className={cn('h-px w-full bg-border', className)} />;
}
