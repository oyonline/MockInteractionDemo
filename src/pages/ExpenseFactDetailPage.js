// src/pages/ExpenseFactDetailPage.js
// 费用事实详情 - 全新设计
import React from 'react';
import {
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  X,
  ArrowLeft,
  FileText,
  User,
  Building2,
  Wallet,
  CreditCard,
  Calendar,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Printer,
  Share2,
  MoreHorizontal,
  CircleDollarSign,
  Landmark,
  Receipt,
  Package
} from 'lucide-react';

const cn = (...args) => args.filter(Boolean).join(' ');

// 状态配置
const statusConfig = {
  pending_accounting: { 
    label: '待会计审核', 
    color: 'bg-amber-500',
    lightColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
    icon: Clock
  },
  pending_director: { 
    label: '待总监审核', 
    color: 'bg-orange-500',
    lightColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-200',
    icon: AlertCircle
  },
  pending_kingdee: { 
    label: '待推送金蝶', 
    color: 'bg-blue-500',
    lightColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    icon: Landmark
  },
  completed: { 
    label: '已完成', 
    color: 'bg-emerald-500',
    lightColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200',
    icon: CheckCircle2
  },
  rejected: { 
    label: '已驳回', 
    color: 'bg-red-500',
    lightColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200',
    icon: XCircle
  }
};

// 审批结果配置
const flowResultConfig = {
  approved: { icon: CheckCircle2, color: 'text-emerald-600', bgColor: 'bg-emerald-100', borderColor: 'border-emerald-200', label: '通过' },
  pending: { icon: Clock, color: 'text-gray-400', bgColor: 'bg-gray-100', borderColor: 'border-gray-200', label: '待审批' },
  rejected: { icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-100', borderColor: 'border-red-200', label: '驳回' },
  noted: { icon: AlertCircle, color: 'text-blue-600', bgColor: 'bg-blue-100', borderColor: 'border-blue-200', label: '知会' }
};

function ExpenseFactDetailPage({ record, onClose }) {
  if (!record) {
    return (
      <div className="min-h-full flex items-center justify-center bg-gray-50/50">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">暂无数据</h3>
          <p className="text-sm text-gray-500">请从费用事实列表进入详情</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount, currency) => {
    const symbol = currency === 'CNY' ? '¥' : currency === 'USD' ? '$' : '€';
    return `${symbol}${Number(amount).toLocaleString()}`;
  };

  // 预算计算
  const budgetTotal = Number(record.budgetTotal) || 0;
  const budgetUsed = Number(record.budgetUsed) || 0;
  const amount = Number(record.amount) || 0;
  const remainingNow = budgetTotal - budgetUsed;
  const remainingAfterApproval = remainingNow - amount;
  const usageRate = record.budgetUsageRate || 0;

  // 状态配置
  const statusCfg = statusConfig[record.status] || statusConfig.pending_accounting;
  const StatusIcon = statusCfg.icon;

  return (
    <div className="min-h-full bg-gray-50/50">
      {/* 顶部导航栏 */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">返回</span>
            </button>
            <div className="h-6 w-px bg-gray-200" />
            <div className="flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", statusCfg.lightColor)}>
                <StatusIcon className={cn("w-5 h-5", statusCfg.textColor)} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">费用审批单</h1>
                <p className="text-xs text-gray-500 font-mono">{record.approvalNo}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Printer className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {/* 金额卡片 - 突出显示 */}
        <div className="mb-6">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 text-white shadow-xl">
            {/* 装饰背景 */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative flex items-end justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2 opacity-90">
                  <CircleDollarSign className="w-5 h-5" />
                  <span className="text-sm font-medium">付款金额</span>
                </div>
                <div className="text-5xl font-bold tracking-tight">
                  {formatCurrency(record.amount, record.currency)}
                </div>
                <div className="mt-3 flex items-center gap-4 text-sm opacity-80">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    预计付款：{record.expectedPaymentDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Wallet className="w-4 h-4" />
                    {record.paymentMethod}
                  </span>
                </div>
              </div>
              <div className={cn(
                "px-4 py-2 rounded-full text-sm font-medium border-2 border-white/30 backdrop-blur-sm",
                "bg-white/20"
              )}>
                {statusCfg.label}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* 左侧主要内容 */}
          <div className="col-span-8 space-y-6">
            {/* 基本信息卡片 */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">基本信息</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">提交人</p>
                      <p className="text-sm font-medium text-gray-900">{record.submitter}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Building2 className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">提交部门</p>
                      <p className="text-sm font-medium text-gray-900">{record.submitDept}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Package className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">费用承担部门</p>
                      <p className="text-sm font-medium text-gray-900">{record.expenseDept}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Building2 className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">客户分组</p>
                      <p className="text-sm font-medium text-gray-900">{record.customerGroup}</p>
                    </div>
                  </div>
                  <div className="col-span-2 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Receipt className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-0.5">付款事由</p>
                      <p className="text-sm font-medium text-gray-900 bg-gray-50 rounded-lg px-3 py-2">
                        {record.paymentReason}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 付款信息卡片 */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900">付款信息</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">付款主体</p>
                      <p className="text-sm font-medium text-gray-900">{record.paymentEntity}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">收款方</p>
                      <p className="text-sm font-medium text-gray-900">{record.receiverName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">收款账户</p>
                      <p className="text-sm font-mono text-gray-700 bg-gray-50 px-3 py-1.5 rounded-lg">
                        {record.receiverAccount}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">开户行</p>
                      <p className="text-sm font-medium text-gray-900">{record.receiverBank}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">预计付款日期</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <p className="text-sm font-medium text-gray-900">{record.expectedPaymentDate}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">付款方式</p>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        {record.paymentMethod}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 审批流程时间轴 */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900">审批流程</h3>
              </div>
              <div className="p-6">
                <div className="space-y-0">
                  {record.approvalFlow?.map((step, index) => {
                    const resultCfg = flowResultConfig[step.result] || flowResultConfig.pending;
                    const ResultIcon = resultCfg.icon;
                    const isLast = index === record.approvalFlow.length - 1;
                    
                    return (
                      <div key={step.id} className="relative flex gap-4">
                        {/* 时间轴线 */}
                        {!isLast && (
                          <div className="absolute left-5 top-10 w-0.5 h-full bg-gray-100" />
                        )}
                        
                        {/* 图标 */}
                        <div className={cn(
                          "relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2",
                          resultCfg.bgColor,
                          resultCfg.borderColor
                        )}>
                          <ResultIcon className={cn("w-5 h-5", resultCfg.color)} />
                        </div>
                        
                        {/* 内容 */}
                        <div className={cn("flex-1 pb-6", isLast && "pb-0")}>
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900">{step.nodeName}</span>
                                <span className={cn(
                                  "px-2 py-0.5 rounded-full text-xs font-medium border",
                                  resultCfg.bgColor,
                                  resultCfg.color,
                                  resultCfg.borderColor
                                )}>
                                  {resultCfg.label}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{step.approver}</p>
                              {step.remark && (
                                <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                  <p className="text-sm text-gray-600">{step.remark}</p>
                                </div>
                              )}
                            </div>
                            <span className="text-xs text-gray-400 whitespace-nowrap">
                              {step.timestamp || '待处理'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* 右侧预算信息 */}
          <div className="col-span-4 space-y-6">
            {/* 预算执行卡片 */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Landmark className="w-4 h-4 text-amber-600" />
                </div>
                <h3 className="font-semibold text-gray-900">预算执行</h3>
              </div>
              <div className="p-5">
                {/* 预算科目 */}
                <div className="mb-5 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">预算科目</p>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-white px-2 py-1 rounded border border-gray-200 font-mono">
                      {record.budgetSubjectCode}
                    </code>
                    <span className="text-xs text-gray-500">·</span>
                    <span className="text-xs text-gray-600">{record.budgetVersion}</span>
                  </div>
                </div>

                {/* 预算进度圆环 */}
                <div className="flex items-center justify-center mb-6">
                  <div className="relative w-36 h-36">
                    <svg className="w-full h-full -rotate-90">
                      <circle
                        cx="72"
                        cy="72"
                        r="60"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="12"
                      />
                      <circle
                        cx="72"
                        cy="72"
                        r="60"
                        fill="none"
                        stroke={usageRate >= 90 ? '#ef4444' : usageRate >= 70 ? '#f97316' : '#10b981'}
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={`${(usageRate / 100) * 377} 377`}
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={cn(
                        "text-2xl font-bold",
                        usageRate >= 90 ? 'text-red-600' : usageRate >= 70 ? 'text-orange-600' : 'text-emerald-600'
                      )}>
                        {usageRate}%
                      </span>
                      <span className="text-xs text-gray-500">执行率</span>
                    </div>
                  </div>
                </div>

                {/* 预算数字 */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-sm text-gray-600">预算总额</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(budgetTotal, record.currency)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-sm text-gray-600">已使用</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(budgetUsed, record.currency)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-100">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      <span className="text-sm text-amber-700">本次剩余</span>
                    </div>
                    <span className="text-sm font-semibold text-amber-700">
                      {formatCurrency(remainingNow, record.currency)}
                    </span>
                  </div>
                </div>

                {/* 预计剩余警告 */}
                {remainingAfterApproval < 0 ? (
                  <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-100 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-red-700">超预算警告</p>
                      <p className="text-xs text-red-600 mt-0.5">
                        审批后将超支 {formatCurrency(Math.abs(remainingAfterApproval), record.currency)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-100 flex items-start gap-2">
                    <TrendingDown className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-emerald-700">预计剩余</p>
                      <p className="text-xs text-emerald-600 mt-0.5">
                        审批后剩余 {formatCurrency(remainingAfterApproval, record.currency)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 金蝶信息 */}
            {record.kingdeePayableNo && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                  <h3 className="font-semibold text-gray-900">金蝶信息</h3>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <Landmark className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-xs text-blue-600 mb-0.5">应付单号</p>
                      <p className="text-sm font-mono font-medium text-blue-700">
                        {record.kingdeePayableNo}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 提交信息 */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                <h3 className="font-semibold text-gray-900">提交信息</h3>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">提交时间</span>
                  <span className="text-sm text-gray-900">{record.submitDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">单据状态</span>
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium border",
                    statusCfg.lightColor,
                    statusCfg.textColor,
                    statusCfg.borderColor
                  )}>
                    {statusCfg.label}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExpenseFactDetailPage;
