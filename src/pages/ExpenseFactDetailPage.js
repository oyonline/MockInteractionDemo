// src/pages/ExpenseFactDetailPage.js
// 费用事实详情 - 独立页面（非抽屉）
import React from 'react';
import {
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  X,
  ArrowLeft,
} from 'lucide-react';

const cn = (...args) => args.filter(Boolean).join(' ');

const Card = ({ children, className }) => (
  <div className={cn('bg-white rounded-lg border border-gray-200 shadow-sm', className)}>
    {children}
  </div>
);

const Badge = ({ children, className }) => (
  <span className={cn('inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium', className)}>
    {children}
  </span>
);

function ExpenseFactDetailPage({ record, onClose }) {
  if (!record) {
    return (
      <div className="p-6 text-gray-500">
        暂无数据，请从费用事实列表进入详情。
      </div>
    );
  }

  const formatCurrency = (amount, currency) => {
    const symbol = currency === 'CNY' ? '¥' : currency === 'USD' ? '$' : '€';
    return `${symbol}${Number(amount).toLocaleString()}`;
  };

  const getFlowStepIcon = (result) => {
    switch (result) {
      case 'approved':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-gray-400" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'noted':
        return <AlertCircle className="w-4 h-4 text-blue-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending_accounting':
        return <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">待会计审核</Badge>;
      case 'pending_director':
        return <Badge className="bg-orange-50 text-orange-700 border-orange-200">待总监审核</Badge>;
      case 'pending_kingdee':
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200">待推送金蝶</Badge>;
      case 'completed':
        return <Badge className="bg-green-50 text-green-700 border-green-200">已完成</Badge>;
      case 'rejected':
        return <Badge className="bg-red-50 text-red-700 border-red-200">驳回</Badge>;
      default:
        return <Badge className="bg-gray-50 text-gray-700 border-gray-200">{status}</Badge>;
    }
  };

  // 预算执行增强：本次剩余、预计剩余（如审批执行后）
  const budgetTotal = Number(record.budgetTotal) || 0;
  const budgetUsed = Number(record.budgetUsed) || 0;
  const amount = Number(record.amount) || 0;
  const remainingNow = budgetTotal - budgetUsed;           // 本次剩余
  const remainingAfterApproval = remainingNow - amount;    // 预计剩余（如审批执行后）

  return (
    <div className="space-y-6">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">返回</span>
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">费用事实详情</h1>
            <p className="text-sm text-gray-500">{record.approvalNo}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700"
          title="关闭"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid gap-6">
        {/* 基本信息 */}
        <Card className="p-5">
          <h4 className="text-sm font-medium text-gray-900 mb-4">基本信息</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">提交人：</span>
              <span className="text-gray-900">{record.submitter}</span>
            </div>
            <div>
              <span className="text-gray-500">提交部门：</span>
              <span className="text-gray-900">{record.submitDept}</span>
            </div>
            <div>
              <span className="text-gray-500">费用承担部门：</span>
              <span className="text-gray-900">{record.expenseDept}</span>
            </div>
            <div>
              <span className="text-gray-500">客户分组：</span>
              <span className="text-gray-900">{record.customerGroup}</span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-500">付款事由：</span>
              <span className="text-gray-900">{record.paymentReason}</span>
            </div>
            <div>
              <span className="text-gray-500">状态：</span>
              {getStatusBadge(record.status)}
            </div>
            <div>
              <span className="text-gray-500">提交时间：</span>
              <span className="text-gray-900">{record.submitDate}</span>
            </div>
          </div>
        </Card>

        {/* 付款信息 */}
        <Card className="p-5">
          <h4 className="text-sm font-medium text-gray-900 mb-4">付款信息</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">付款金额：</span>
              <span className="text-gray-900 font-medium">{formatCurrency(record.amount, record.currency)}</span>
            </div>
            <div>
              <span className="text-gray-500">付款主体：</span>
              <span className="text-gray-900">{record.paymentEntity}</span>
            </div>
            <div>
              <span className="text-gray-500">付款方式：</span>
              <span className="text-gray-900">{record.paymentMethod}</span>
            </div>
            <div>
              <span className="text-gray-500">预计付款日期：</span>
              <span className="text-gray-900">{record.expectedPaymentDate}</span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-500">收款方：</span>
              <span className="text-gray-900">{record.receiverName}</span>
            </div>
            <div>
              <span className="text-gray-500">收款账户：</span>
              <span className="text-gray-900">{record.receiverAccount}</span>
            </div>
            <div>
              <span className="text-gray-500">开户行：</span>
              <span className="text-gray-900">{record.receiverBank}</span>
            </div>
          </div>
        </Card>

        {/* 预算执行 */}
        <Card className="p-5">
          <h4 className="text-sm font-medium text-gray-900 mb-4">预算执行</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">预算科目：</span>
              <code className="text-xs bg-gray-100 px-2 py-0.5 rounded">{record.budgetSubjectCode}</code>
            </div>
            <div>
              <span className="text-gray-500">预算版本：</span>
              <span className="text-gray-900">{record.budgetVersion}</span>
            </div>
            <div>
              <span className="text-gray-500">已使用：</span>
              <span className="text-gray-900">{formatCurrency(record.budgetUsed || 0, record.currency)}</span>
            </div>
            <div>
              <span className="text-gray-500">总额度：</span>
              <span className="text-gray-900">{formatCurrency(record.budgetTotal || 0, record.currency)}</span>
            </div>
            <div>
              <span className="text-gray-500">本次剩余：</span>
              <span className="text-gray-900 font-medium">{formatCurrency(remainingNow, record.currency)}</span>
            </div>
            <div>
              <span className="text-gray-500">预计剩余（如审批执行后）：</span>
              <span
                className={cn(
                  'font-medium',
                  remainingAfterApproval < 0 ? 'text-red-600' : 'text-gray-900'
                )}
              >
                {formatCurrency(remainingAfterApproval, record.currency)}
              </span>
            </div>
            {record.kingdeePayableNo && (
              <div>
                <span className="text-gray-500">金蝶应付单号：</span>
                <span className="text-blue-600">{record.kingdeePayableNo}</span>
              </div>
            )}
          </div>
          {/* 预算执行率与进度条一起展示 */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-500">预算执行率</span>
              <span
                className={cn(
                  'font-medium',
                  record.budgetUsageRate >= 90 ? 'text-red-600' :
                  record.budgetUsageRate >= 70 ? 'text-orange-600' : 'text-green-600'
                )}
              >
                {record.budgetUsageRate}%
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full',
                  record.budgetUsageRate >= 90 ? 'bg-red-500' :
                  record.budgetUsageRate >= 70 ? 'bg-orange-500' : 'bg-green-500'
                )}
                style={{ width: `${Math.min(record.budgetUsageRate, 100)}%` }}
              />
            </div>
          </div>
        </Card>

        {/* 审批流程 */}
        <Card className="p-5">
          <h4 className="text-sm font-medium text-gray-900 mb-4">审批流程</h4>
          <div className="space-y-3">
            {record.approvalFlow?.map((step, index) => (
              <div key={step.id} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  {getFlowStepIcon(step.result)}
                  {index < record.approvalFlow.length - 1 && (
                    <div className="w-px h-8 bg-gray-200 my-1" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{step.nodeName}</span>
                    <span className="text-xs text-gray-500">{step.timestamp || '-'}</span>
                  </div>
                  <div className="text-sm text-gray-600">{step.approver}</div>
                  {step.remark && (
                    <div className="text-xs text-gray-500 mt-1 bg-gray-50 px-2 py-1 rounded">
                      {step.remark}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default ExpenseFactDetailPage;
