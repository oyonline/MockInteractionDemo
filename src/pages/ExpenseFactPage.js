// src/pages/ExpenseFactPage.js
// 费用事实页面 - 费用审批明细
import React from 'react';
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  FileText,
  User,
  Building2,
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Send,
  Eye,
  DollarSign,
} from 'lucide-react';

// 轻量工具：className 拼接
const cn = (...args) => args.filter(Boolean).join(' ');

// --------------- 核算维度类型定义和工具函数 ---------------
const DimensionTypeLabels = {
  'dept': '仅部门',
  'dept-custgroup': '部门+客户分组',
  'dept-custgroup-cust': '部门+客户分组+客户',
  'dept-custgroup-cust-expense': '部门+客户分组+客户+费用类别',
  'custgroup-expense': '客户分组+费用类别',
};

const getDimensionTypeBySubjectCode = (subjectCode) => {
  if (!subjectCode) return null;
  // 根据科目代码前缀判断维度类型
  if (subjectCode.startsWith('6601')) {
    // 销售费用一般需要完整维度
    return 'dept-custgroup-cust-expense';
  } else if (subjectCode.startsWith('6602')) {
    // 管理费用一般仅需部门
    return 'dept';
  } else if (subjectCode.startsWith('6603')) {
    // 研发费用
    return 'dept';
  }
  return 'dept-custgroup-cust-expense';
};

const getDimensionTypeLabel = (dimensionType) => {
  return DimensionTypeLabels[dimensionType] || dimensionType;
};

// --------------- 轻量组件 ---------------
const IconButton = ({ children, onClick, className, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={cn(
      'inline-flex items-center justify-center h-9 px-3 rounded-md border border-gray-200 text-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed',
      className
    )}
    type="button"
  >
    {children}
  </button>
);

const Input = (props) => (
  <input
    {...props}
    className={cn(
      'h-9 px-3 rounded-md border border-gray-200 outline-none focus:ring-2 focus:ring-blue-100 text-sm',
      props.className
    )}
  />
);

const Select = ({ value, onChange, children, className, placeholder }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={cn(
      'h-9 px-3 rounded-md border border-gray-200 bg-white text-sm',
      className
    )}
  >
    {placeholder && <option value="">{placeholder}</option>}
    {children}
  </select>
);

const Badge = ({ children, className }) => (
  <span
    className={cn(
      'inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium',
      className
    )}
  >
    {children}
  </span>
);

const Card = ({ children, className }) => (
  <div className={cn('bg-white rounded-lg border border-gray-200 shadow-sm', className)}>
    {children}
  </div>
);

// 简易 Tooltip
const Tooltip = ({ children, content }) => {
  const [show, setShow] = React.useState(false);
  return (
    <div className="relative inline-block" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && content && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap">
          {content}
        </div>
      )}
    </div>
  );
};

// 简易分页
const TablePagination = ({ currentPage, totalPages, pageSize, totalItems, onPageChange }) => (
  <div className="flex items-center justify-between text-sm text-gray-600">
    <div>显示 {Math.min((currentPage - 1) * pageSize + 1, totalItems)} - {Math.min(currentPage * pageSize, totalItems)} 条，共 {totalItems} 条</div>
    <div className="flex items-center gap-2">
      <IconButton disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>上一页</IconButton>
      <div className="flex items-center gap-1">
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          let page = i + 1;
          if (totalPages > 5) {
            if (currentPage <= 3) page = i + 1;
            else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
            else page = currentPage - 2 + i;
          }
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                'w-8 h-8 rounded text-sm',
                currentPage === page ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 hover:bg-gray-50'
              )}
            >
              {page}
            </button>
          );
        })}
      </div>
      <IconButton disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>下一页</IconButton>
    </div>
  </div>
);

// --------------- 模拟数据 - 审批流步骤 ---------------
const sampleApprovalFlow = [
  { id: '1', timestamp: '2025-07-03 09:22', nodeName: '提交人', approver: '王婷', result: 'approved' },
  { id: '2', timestamp: '2025-07-03 09:23', nodeName: '系统校验', approver: '系统自动', result: 'approved', remark: '预算余额充足，自动通过' },
  { id: '3', timestamp: '2025-07-03 10:00', nodeName: '部门负责人', approver: '李森', result: 'approved' },
  { id: '4', timestamp: '2025-07-04 11:30', nodeName: '会计审核', approver: '何静', result: 'approved', remark: '核对预算余量' },
  { id: '5', timestamp: '2025-07-05 15:00', nodeName: '财务总监审批', approver: '周立', result: 'approved', remark: '次月合并付款' },
  { id: '6', timestamp: '2025-07-06 09:00', nodeName: '推送金蝶费用凭证', approver: '系统自动', result: 'approved', remark: '生成应付单 AP-20250706-009' },
  { id: '7', timestamp: '2025-07-06 10:30', nodeName: '出纳执行', approver: '财务-张敏', result: 'approved' },
  { id: '8', timestamp: '2025-07-06 11:00', nodeName: '推送金蝶付款单', approver: '系统自动', result: 'approved', remark: '生成付款单 PAY-20250706-009' },
];

// --------------- 模拟数据 - 审批记录 ---------------
const mockApprovalRecords = [
  {
    id: '1',
    approvalNo: 'OA-RBX-20250703-012',
    submitter: '王婷',
    submitterId: 'EMP-WANGTING',
    submitDept: '亚太事业部',
    submitDeptId: 'BM000008',
    expenseDept: '品牌营销中心',
    expenseDeptId: 'BM000123',
    costCenter: 'CC_APAC_MKT_01',
    customerGroup: 'Amazon US',
    paymentReason: '2025年7月KOL视频推广合作',
    accountingDimension: 'dept-custgroup-cust-expense',
    budgetSubjectCode: '6601.16',
    amount: 68000,
    currency: 'CNY',
    paymentMethod: '银行转账',
    paymentEntity: '波赛冬集团',
    expectedPaymentDate: '2025-07-10',
    receiverName: '上海云创文化传媒有限公司',
    receiverAccount: '6214*********0987',
    receiverBank: '招商银行深圳南山支行',
    status: 'completed',
    hasAttachment: true,
    submitDate: '2025-07-03 09:22',
    budgetVersion: 'V2025.02',
    budgetUsageRate: 96,
    budgetTotal: 1700000,
    budgetUsed: 1632000,
    kingdeePayableNo: 'AP-20250706-009',
    approvalFlow: sampleApprovalFlow,
  },
  {
    id: '2',
    approvalNo: 'OA-RBX-20250705-028',
    submitter: '李森',
    submitterId: 'EMP-LISEN',
    submitDept: '欧美事业部',
    submitDeptId: 'BM000007',
    expenseDept: '直营电商部',
    expenseDeptId: 'BM000094',
    costCenter: 'CC_EMEA_DTC_01',
    customerGroup: 'Walmart',
    paymentReason: '平台推广费 - Facebook Ads',
    accountingDimension: 'dept-custgroup-cust-expense',
    budgetSubjectCode: '6601.08',
    amount: 125000,
    currency: 'USD',
    paymentMethod: 'PayPal',
    paymentEntity: 'KKAmazon',
    expectedPaymentDate: '2025-07-15',
    receiverName: 'Meta Platforms Inc.',
    receiverAccount: 'paypal@meta.com',
    receiverBank: '-',
    status: 'pending_director',
    hasAttachment: true,
    submitDate: '2025-07-05 14:30',
    budgetVersion: 'V2025.02',
    budgetUsageRate: 82,
    budgetTotal: 2500000,
    budgetUsed: 2050000,
    approvalFlow: [
      { id: '1', timestamp: '2025-07-05 14:30', nodeName: '提交申请', approver: '李森', result: 'approved' },
      { id: '2', timestamp: '2025-07-05 15:20', nodeName: '部门主管审批', approver: 'Tate', result: 'approved' },
      { id: '3', timestamp: '2025-07-06 10:00', nodeName: '财务审核', approver: 'Lyn', result: 'approved' },
      { id: '4', timestamp: '', nodeName: '总监审批', approver: '待审核', result: 'pending' },
    ],
  },
  {
    id: '3',
    approvalNo: 'OA-RBX-20250708-045',
    submitter: '汤甜',
    submitterId: 'EMP-TANGTIAN',
    submitDept: '亚太事业部',
    submitDeptId: 'BM000008',
    expenseDept: '国内客服部',
    expenseDeptId: 'BM000122',
    costCenter: 'CC_APAC_CS_01',
    customerGroup: 'Retail',
    paymentReason: '客服系统年度续费',
    accountingDimension: 'dept',
    budgetSubjectCode: '6602.23',
    amount: 45000,
    currency: 'CNY',
    paymentMethod: '银行转账',
    paymentEntity: '波赛冬集团',
    expectedPaymentDate: '2025-07-20',
    receiverName: '深圳智云科技有限公司',
    receiverAccount: '6228*********1234',
    receiverBank: '中国银行深圳福田支行',
    status: 'pending_accounting',
    hasAttachment: true,
    submitDate: '2025-07-08 11:00',
    budgetVersion: 'V2025.02',
    budgetUsageRate: 65,
    budgetTotal: 800000,
    budgetUsed: 520000,
    approvalFlow: [
      { id: '1', timestamp: '2025-07-08 11:00', nodeName: '提交申请', approver: '汤甜', result: 'approved' },
      { id: '2', timestamp: '2025-07-08 14:30', nodeName: '部门主管审批', approver: '杨萌', result: 'approved' },
      { id: '3', timestamp: '', nodeName: '财务审核', approver: '待审核', result: 'pending' },
    ],
  },
  {
    id: '4',
    approvalNo: 'OA-RBX-20250710-067',
    submitter: '林燊',
    submitterId: 'EMP-LINSHEN',
    submitDept: '全球共享服务中心',
    submitDeptId: 'BM000109',
    expenseDept: '信息技术与系统服务部',
    expenseDeptId: 'BM000129',
    customerGroup: '-',
    paymentReason: '云服务器扩容费用（AWS）',
    accountingDimension: 'dept',
    budgetSubjectCode: '6602.25',
    amount: 38000,
    currency: 'USD',
    paymentMethod: '信用卡',
    paymentEntity: '波赛冬集团',
    expectedPaymentDate: '2025-07-25',
    receiverName: 'Amazon Web Services',
    receiverAccount: 'AWS-CN-*****',
    receiverBank: '-',
    status: 'pending_kingdee',
    hasAttachment: true,
    submitDate: '2025-07-10 09:15',
    budgetVersion: 'V2025.02',
    budgetUsageRate: 88,
    budgetTotal: 580000,
    budgetUsed: 510400,
    approvalFlow: [
      { id: '1', timestamp: '2025-07-10 09:15', nodeName: '提交申请', approver: '林燊', result: 'approved' },
      { id: '2', timestamp: '2025-07-10 10:30', nodeName: '部门主管审批', approver: 'CH', result: 'approved' },
      { id: '3', timestamp: '2025-07-10 15:00', nodeName: '财务审核', approver: 'Lyn', result: 'approved' },
      { id: '4', timestamp: '2025-07-11 09:00', nodeName: '总监审批', approver: 'Harry', result: 'approved' },
      { id: '5', timestamp: '', nodeName: '推送金蝶', approver: '待推送', result: 'pending' },
    ],
  },
  {
    id: '5',
    approvalNo: 'OA-RBX-20250706-033',
    submitter: '张云廷',
    submitterId: 'EMP-ZHANGYUNTING',
    submitDept: '全球共享服务中心',
    submitDeptId: 'BM000109',
    expenseDept: '产品研发部',
    expenseDeptId: 'BM000121',
    customerGroup: '-',
    paymentReason: '研发工具采购 - Figma企业版',
    accountingDimension: 'dept',
    budgetSubjectCode: '6603.12',
    amount: 28000,
    currency: 'CNY',
    paymentMethod: '银行转账',
    paymentEntity: '波赛冬集团',
    expectedPaymentDate: '2025-07-12',
    receiverName: 'Figma China',
    receiverAccount: '6225*********5678',
    receiverBank: '工商银行北京朝阳支行',
    status: 'rejected',
    hasAttachment: false,
    submitDate: '2025-07-06 16:00',
    budgetVersion: 'V2025.02',
    budgetUsageRate: 45,
    budgetTotal: 350000,
    budgetUsed: 157500,
    approvalFlow: [
      { id: '1', timestamp: '2025-07-06 16:00', nodeName: '提交申请', approver: '张云廷', result: 'approved' },
      { id: '2', timestamp: '2025-07-07 10:00', nodeName: '部门主管审批', approver: 'David', result: 'rejected', remark: '预算不足，建议下季度申请' },
    ],
  },
  {
    id: '6',
    approvalNo: 'OA-RBX-20250709-051',
    submitter: 'Jason',
    submitterId: 'EMP-JASON',
    submitDept: '欧美事业部',
    submitDeptId: 'BM000007',
    expenseDept: '平台电商部',
    expenseDeptId: 'BM000101',
    customerGroup: 'Amazon US',
    paymentReason: 'Amazon平台交易费 - Q2结算',
    accountingDimension: 'dept-custgroup-cust-expense',
    budgetSubjectCode: '6601.09',
    amount: 156000,
    currency: 'USD',
    paymentMethod: '自动扣款',
    paymentEntity: 'KKAmazon',
    expectedPaymentDate: '2025-07-15',
    receiverName: 'Amazon Services LLC',
    receiverAccount: 'AUTO-DEDUCT',
    receiverBank: '-',
    status: 'completed',
    hasAttachment: true,
    submitDate: '2025-07-09 10:00',
    budgetVersion: 'V2025.02',
    budgetUsageRate: 78,
    budgetTotal: 3200000,
    budgetUsed: 2496000,
    kingdeePayableNo: 'AP-20250710-015',
    approvalFlow: [
      { id: '1', timestamp: '2025-07-09 10:00', nodeName: '提交申请', approver: 'Jason', result: 'approved' },
      { id: '2', timestamp: '2025-07-09 11:30', nodeName: '部门主管审批', approver: 'Tate', result: 'approved' },
      { id: '3', timestamp: '2025-07-09 14:00', nodeName: '财务审核', approver: 'Lyn', result: 'approved' },
      { id: '4', timestamp: '2025-07-10 09:00', nodeName: '总监审批', approver: 'Tate', result: 'approved' },
      { id: '5', timestamp: '2025-07-10 10:30', nodeName: '推送金蝶', approver: '系统自动', result: 'approved', remark: '生成应付单 AP-20250710-015' },
    ],
  },
  {
    id: '7',
    approvalNo: 'OA-RBX-20250701-003',
    submitter: 'Tate',
    submitterId: 'EMP-TATE',
    submitDept: '欧美事业部',
    submitDeptId: 'BM000007',
    expenseDept: '海外仓储与物流部',
    expenseDeptId: 'BM000102',
    customerGroup: 'Amazon US',
    paymentReason: '美国仓库租金Q3预付',
    accountingDimension: 'custgroup-expense',
    budgetSubjectCode: '6601.18',
    amount: 285000,
    currency: 'USD',
    paymentMethod: '电汇',
    paymentEntity: 'KKAmazon',
    expectedPaymentDate: '2025-07-01',
    receiverName: 'Prologis Warehouse LLC',
    receiverAccount: 'US-WIRE-*****',
    receiverBank: 'Bank of America',
    status: 'completed',
    hasAttachment: true,
    submitDate: '2025-06-28 15:00',
    budgetVersion: 'V2025.02',
    budgetUsageRate: 72,
    budgetTotal: 5000000,
    budgetUsed: 3600000,
    kingdeePayableNo: 'AP-20250701-003',
    approvalFlow: [
      { id: '1', timestamp: '2025-06-28 15:00', nodeName: '提交申请', approver: 'Tate', result: 'approved' },
      { id: '2', timestamp: '2025-06-28 16:30', nodeName: '部门主管审批', approver: 'Harry', result: 'approved' },
      { id: '3', timestamp: '2025-06-29 10:00', nodeName: '财务审核', approver: 'Lyn', result: 'approved' },
      { id: '4', timestamp: '2025-06-29 14:00', nodeName: '总监审批', approver: 'Harry', result: 'approved' },
      { id: '5', timestamp: '2025-06-30 09:00', nodeName: '推送金蝶', approver: '系统自动', result: 'approved' },
    ],
  },
  {
    id: '8',
    approvalNo: 'OA-RBX-20250711-072',
    submitter: '杨萌',
    submitterId: 'EMP-YANGMENG',
    submitDept: '亚太事业部',
    submitDeptId: 'BM000008',
    expenseDept: '国内客服部',
    expenseDeptId: 'BM000122',
    customerGroup: 'Lazada',
    paymentReason: '7月客服外包服务费',
    accountingDimension: 'dept-custgroup-cust-expense',
    budgetSubjectCode: '6601.12',
    amount: 52000,
    currency: 'CNY',
    paymentMethod: '银行转账',
    paymentEntity: '波赛冬集团',
    expectedPaymentDate: '2025-08-05',
    receiverName: '广州优客服务有限公司',
    receiverAccount: '6217*********3456',
    receiverBank: '建设银行广州天河支行',
    status: 'completed',
    hasAttachment: true,
    submitDate: '2025-07-11 09:30',
    budgetVersion: 'V2025.02',
    budgetUsageRate: 68,
    budgetTotal: 920000,
    budgetUsed: 625600,
    kingdeePayableNo: 'AP-20250712-021',
    approvalFlow: [
      { id: '1', timestamp: '2025-07-11 09:30', nodeName: '提交申请', approver: '杨萌', result: 'approved' },
      { id: '2', timestamp: '2025-07-11 11:00', nodeName: '部门主管审批', approver: 'Linda', result: 'approved' },
      { id: '3', timestamp: '2025-07-11 15:00', nodeName: '财务审核', approver: '何静', result: 'approved' },
      { id: '4', timestamp: '2025-07-12 09:00', nodeName: '总监审批', approver: 'Linda', result: 'approved' },
      { id: '5', timestamp: '2025-07-12 10:00', nodeName: '推送金蝶', approver: '系统自动', result: 'approved' },
    ],
  },
  {
    id: '9',
    approvalNo: 'OA-RBX-20250712-080',
    submitter: 'David',
    submitterId: 'EMP-DAVID',
    submitDept: '全球共享服务中心',
    submitDeptId: 'BM000109',
    expenseDept: '产品研发部',
    expenseDeptId: 'BM000121',
    customerGroup: '-',
    paymentReason: 'GitHub Enterprise年度订阅',
    accountingDimension: 'dept',
    budgetSubjectCode: '6603.11',
    amount: 15000,
    currency: 'USD',
    paymentMethod: '信用卡',
    paymentEntity: '波赛冬集团',
    expectedPaymentDate: '2025-07-20',
    receiverName: 'GitHub Inc.',
    receiverAccount: 'VISA-****',
    receiverBank: '-',
    status: 'pending_accounting',
    hasAttachment: true,
    submitDate: '2025-07-12 14:00',
    budgetVersion: 'V2025.02',
    budgetUsageRate: 55,
    budgetTotal: 180000,
    budgetUsed: 99000,
    approvalFlow: [
      { id: '1', timestamp: '2025-07-12 14:00', nodeName: '提交申请', approver: 'David', result: 'approved' },
      { id: '2', timestamp: '2025-07-12 15:30', nodeName: '部门主管审批', approver: 'CH', result: 'approved' },
      { id: '3', timestamp: '', nodeName: '财务审核', approver: '待审核', result: 'pending' },
    ],
  },
  {
    id: '10',
    approvalNo: 'OA-RBX-20250704-020',
    submitter: '陈楠',
    submitterId: 'EMP-CHENNAN',
    submitDept: '欧美事业部',
    submitDeptId: 'BM000007',
    expenseDept: '品牌与市场部',
    expenseDeptId: 'BM000095',
    customerGroup: 'Walmart',
    paymentReason: 'Google Ads Q3广告预算',
    accountingDimension: 'dept-custgroup-cust-expense',
    budgetSubjectCode: '6601.08',
    amount: 98000,
    currency: 'USD',
    paymentMethod: '自动扣款',
    paymentEntity: 'KKAmazon',
    expectedPaymentDate: '2025-07-30',
    receiverName: 'Google LLC',
    receiverAccount: 'GOOGLE-ADS-****',
    receiverBank: '-',
    status: 'completed',
    hasAttachment: true,
    submitDate: '2025-07-04 10:15',
    budgetVersion: 'V2025.02',
    budgetUsageRate: 85,
    budgetTotal: 1500000,
    budgetUsed: 1275000,
    kingdeePayableNo: 'AP-20250708-012',
    approvalFlow: [
      { id: '1', timestamp: '2025-07-04 10:15', nodeName: '提交申请', approver: '陈楠', result: 'approved' },
      { id: '2', timestamp: '2025-07-04 14:00', nodeName: '部门主管审批', approver: 'Tate', result: 'approved' },
      { id: '3', timestamp: '2025-07-05 09:00', nodeName: '财务审核', approver: 'Lyn', result: 'approved' },
      { id: '4', timestamp: '2025-07-05 15:00', nodeName: '总监审批', approver: 'Harry', result: 'approved' },
      { id: '5', timestamp: '2025-07-08 09:00', nodeName: '推送金蝶', approver: '系统自动', result: 'approved' },
    ],
  },
  {
    id: '11',
    approvalNo: 'OA-RBX-20250713-085',
    submitter: 'Lyn',
    submitterId: 'EMP-LYN',
    submitDept: '全球共享服务中心',
    submitDeptId: 'BM000109',
    expenseDept: '财务共享服务中心',
    expenseDeptId: 'BM000110',
    customerGroup: '-',
    paymentReason: '金蝶系统维护升级费用',
    accountingDimension: 'dept',
    budgetSubjectCode: '6602.24',
    amount: 89000,
    currency: 'CNY',
    paymentMethod: '银行转账',
    paymentEntity: '波赛冬集团',
    expectedPaymentDate: '2025-07-25',
    receiverName: '金蝶软件（中国）有限公司',
    receiverAccount: '6228*********7890',
    receiverBank: '招商银行深圳科技园支行',
    status: 'pending_director',
    hasAttachment: true,
    submitDate: '2025-07-13 10:00',
    budgetVersion: 'V2025.02',
    budgetUsageRate: 76,
    budgetTotal: 1200000,
    budgetUsed: 912000,
    approvalFlow: [
      { id: '1', timestamp: '2025-07-13 10:00', nodeName: '提交申请', approver: 'Lyn', result: 'approved' },
      { id: '2', timestamp: '2025-07-13 14:00', nodeName: '部门主管审批', approver: 'Harry', result: 'approved' },
      { id: '3', timestamp: '2025-07-14 09:00', nodeName: '财务审核', approver: '何静', result: 'approved' },
      { id: '4', timestamp: '', nodeName: '总监审批', approver: '待审核', result: 'pending' },
    ],
  },
  {
    id: '12',
    approvalNo: 'OA-RBX-20250702-010',
    submitter: 'Linda',
    submitterId: 'EMP-LINDA',
    submitDept: '亚太事业部',
    submitDeptId: 'BM000008',
    expenseDept: '供应链管理部',
    expenseDeptId: 'BM000124',
    customerGroup: 'Shopee',
    paymentReason: '深圳仓库货架采购',
    accountingDimension: 'dept-custgroup-cust-expense',
    budgetSubjectCode: '6602.18',
    amount: 35000,
    currency: 'CNY',
    paymentMethod: '银行转账',
    paymentEntity: '波赛冬集团',
    expectedPaymentDate: '2025-07-15',
    receiverName: '深圳华力仓储设备有限公司',
    receiverAccount: '6225*********2345',
    receiverBank: '平安银行深圳分行',
    status: 'completed',
    hasAttachment: true,
    submitDate: '2025-07-02 09:45',
    budgetVersion: 'V2025.02',
    budgetUsageRate: 62,
    budgetTotal: 680000,
    budgetUsed: 421600,
    kingdeePayableNo: 'AP-20250705-008',
    approvalFlow: [
      { id: '1', timestamp: '2025-07-02 09:45', nodeName: '提交申请', approver: 'Linda', result: 'approved' },
      { id: '2', timestamp: '2025-07-02 14:00', nodeName: '部门主管审批', approver: 'Linda', result: 'approved' },
      { id: '3', timestamp: '2025-07-03 10:00', nodeName: '财务审核', approver: '何静', result: 'approved' },
      { id: '4', timestamp: '2025-07-04 09:00', nodeName: '总监审批', approver: 'Linda', result: 'approved' },
      { id: '5', timestamp: '2025-07-05 09:00', nodeName: '推送金蝶', approver: '系统自动', result: 'approved' },
    ],
  },
  {
    id: '13',
    approvalNo: 'OA-RBX-20250714-091',
    submitter: 'CH',
    submitterId: 'EMP-CH',
    submitDept: '全球共享服务中心',
    submitDeptId: 'BM000109',
    expenseDept: '信息技术与系统服务部',
    expenseDeptId: 'BM000129',
    customerGroup: '-',
    paymentReason: '办公网络升级改造',
    accountingDimension: 'dept',
    budgetSubjectCode: '6602.26',
    amount: 125000,
    currency: 'CNY',
    paymentMethod: '银行转账',
    paymentEntity: '波赛冬集团',
    expectedPaymentDate: '2025-07-28',
    receiverName: '华为技术有限公司',
    receiverAccount: '6228*********4567',
    receiverBank: '工商银行深圳南山支行',
    status: 'pending_kingdee',
    hasAttachment: true,
    submitDate: '2025-07-14 11:00',
    budgetVersion: 'V2025.02',
    budgetUsageRate: 81,
    budgetTotal: 1800000,
    budgetUsed: 1458000,
    approvalFlow: [
      { id: '1', timestamp: '2025-07-14 11:00', nodeName: '提交申请', approver: 'CH', result: 'approved' },
      { id: '2', timestamp: '2025-07-14 15:00', nodeName: '部门主管审批', approver: 'Harry', result: 'approved' },
      { id: '3', timestamp: '2025-07-15 09:00', nodeName: '财务审核', approver: 'Lyn', result: 'approved' },
      { id: '4', timestamp: '2025-07-15 14:00', nodeName: '总监审批', approver: 'Harry', result: 'approved' },
      { id: '5', timestamp: '', nodeName: '推送金蝶', approver: '待推送', result: 'pending' },
    ],
  },
  {
    id: '14',
    approvalNo: 'OA-RBX-20250707-040',
    submitter: '周立',
    submitterId: 'EMP-ZHOULI',
    submitDept: '欧美事业部',
    submitDeptId: 'BM000007',
    expenseDept: '海外营销部',
    expenseDeptId: 'BM000103',
    customerGroup: 'Target',
    paymentReason: 'TikTok红人营销合作',
    accountingDimension: 'dept-custgroup-cust-expense',
    budgetSubjectCode: '6601.16',
    amount: 45000,
    currency: 'USD',
    paymentMethod: 'PayPal',
    paymentEntity: 'KKEMEA',
    expectedPaymentDate: '2025-07-22',
    receiverName: 'Influencer Marketing Agency',
    receiverAccount: 'paypal@ima.com',
    receiverBank: '-',
    status: 'rejected',
    hasAttachment: false,
    submitDate: '2025-07-07 13:30',
    budgetVersion: 'V2025.02',
    budgetUsageRate: 94,
    budgetTotal: 650000,
    budgetUsed: 611000,
    approvalFlow: [
      { id: '1', timestamp: '2025-07-07 13:30', nodeName: '提交申请', approver: '周立', result: 'approved' },
      { id: '2', timestamp: '2025-07-07 16:00', nodeName: '部门主管审批', approver: 'Harry', result: 'approved' },
      { id: '3', timestamp: '2025-07-08 10:00', nodeName: '财务审核', approver: 'Lyn', result: 'rejected', remark: '预算执行率过高，建议下月申请' },
    ],
  },
  {
    id: '15',
    approvalNo: 'OA-RBX-20250715-095',
    submitter: 'Harry',
    submitterId: 'EMP-HARRY',
    submitDept: '全球共享服务中心',
    submitDeptId: 'BM000109',
    expenseDept: '人力资源部',
    expenseDeptId: 'BM000111',
    customerGroup: '-',
    paymentReason: 'Q3招聘平台年费',
    accountingDimension: 'dept',
    budgetSubjectCode: '6602.15',
    amount: 48000,
    currency: 'CNY',
    paymentMethod: '银行转账',
    paymentEntity: '波赛冬集团',
    expectedPaymentDate: '2025-08-01',
    receiverName: 'BOSS直聘',
    receiverAccount: '6228*********8901',
    receiverBank: '招商银行北京分行',
    status: 'pending_accounting',
    hasAttachment: true,
    submitDate: '2025-07-15 10:20',
    budgetVersion: 'V2025.02',
    budgetUsageRate: 58,
    budgetTotal: 950000,
    budgetUsed: 551000,
    approvalFlow: [
      { id: '1', timestamp: '2025-07-15 10:20', nodeName: '提交申请', approver: 'Harry', result: 'approved' },
      { id: '2', timestamp: '2025-07-15 14:00', nodeName: '部门主管审批', approver: 'Harry', result: 'approved' },
      { id: '3', timestamp: '', nodeName: '财务审核', approver: '待审核', result: 'pending' },
    ],
  },
  {
    id: '16',
    approvalNo: 'OA-RBX-20250701-005',
    submitter: '何静',
    submitterId: 'EMP-HEJING',
    submitDept: '全球共享服务中心',
    submitDeptId: 'BM000109',
    expenseDept: '财务共享服务中心',
    expenseDeptId: 'BM000110',
    customerGroup: '-',
    paymentReason: '审计服务费Q2结算',
    accountingDimension: 'dept',
    budgetSubjectCode: '6602.12',
    amount: 180000,
    currency: 'CNY',
    paymentMethod: '银行转账',
    paymentEntity: '波赛冬集团',
    expectedPaymentDate: '2025-07-10',
    receiverName: '德勤华永会计师事务所',
    receiverAccount: '6225*********6789',
    receiverBank: '中国银行深圳福田支行',
    status: 'completed',
    hasAttachment: true,
    submitDate: '2025-07-01 09:00',
    budgetVersion: 'V2025.02',
    budgetUsageRate: 90,
    budgetTotal: 2000000,
    budgetUsed: 1800000,
    kingdeePayableNo: 'AP-20250703-005',
    approvalFlow: [
      { id: '1', timestamp: '2025-07-01 09:00', nodeName: '提交申请', approver: '何静', result: 'approved' },
      { id: '2', timestamp: '2025-07-01 11:00', nodeName: '部门主管审批', approver: 'Lyn', result: 'approved' },
      { id: '3', timestamp: '2025-07-01 15:00', nodeName: '财务审核', approver: 'Lyn', result: 'approved' },
      { id: '4', timestamp: '2025-07-02 09:00', nodeName: '总监审批', approver: 'Harry', result: 'approved' },
      { id: '5', timestamp: '2025-07-03 09:00', nodeName: '推送金蝶', approver: '系统自动', result: 'approved' },
    ],
  },
  {
    id: '17',
    approvalNo: 'OA-RBX-20250710-068',
    submitter: '张婷婷',
    submitterId: 'EMP-ZHANGTINGTING',
    submitDept: '亚太事业部',
    submitDeptId: 'BM000008',
    expenseDept: '国内电商运营部',
    expenseDeptId: 'BM000125',
    customerGroup: 'JD',
    paymentReason: '京东平台推广费',
    accountingDimension: 'dept-custgroup-cust-expense',
    budgetSubjectCode: '6601.07',
    amount: 72000,
    currency: 'CNY',
    paymentMethod: '自动扣款',
    paymentEntity: '波赛冬集团',
    expectedPaymentDate: '2025-07-20',
    receiverName: '京东集团',
    receiverAccount: 'AUTO-DEDUCT',
    receiverBank: '-',
    status: 'completed',
    hasAttachment: true,
    submitDate: '2025-07-10 11:00',
    budgetVersion: 'V2025.02',
    budgetUsageRate: 71,
    budgetTotal: 1100000,
    budgetUsed: 781000,
    kingdeePayableNo: 'AP-20250711-018',
    approvalFlow: [
      { id: '1', timestamp: '2025-07-10 11:00', nodeName: '提交申请', approver: '张婷婷', result: 'approved' },
      { id: '2', timestamp: '2025-07-10 14:00', nodeName: '部门主管审批', approver: 'Linda', result: 'approved' },
      { id: '3', timestamp: '2025-07-10 16:00', nodeName: '财务审核', approver: '何静', result: 'approved' },
      { id: '4', timestamp: '2025-07-11 09:00', nodeName: '总监审批', approver: 'Linda', result: 'approved' },
      { id: '5', timestamp: '2025-07-11 10:00', nodeName: '推送金蝶', approver: '系统自动', result: 'approved' },
    ],
  },
  {
    id: '18',
    approvalNo: 'OA-RBX-20250716-098',
    submitter: '李明',
    submitterId: 'EMP-LIMING',
    submitDept: '欧美事业部',
    submitDeptId: 'BM000007',
    expenseDept: '产品采购部',
    expenseDeptId: 'BM000096',
    customerGroup: 'Costco',
    paymentReason: '样品采购与快递费用',
    accountingDimension: 'dept-custgroup-cust-expense',
    budgetSubjectCode: '6601.14',
    amount: 8500,
    currency: 'USD',
    paymentMethod: '信用卡',
    paymentEntity: 'KKEMEA',
    expectedPaymentDate: '2025-07-25',
    receiverName: 'FedEx International',
    receiverAccount: 'VISA-****',
    receiverBank: '-',
    status: 'pending_director',
    hasAttachment: true,
    submitDate: '2025-07-16 09:15',
    budgetVersion: 'V2025.02',
    budgetUsageRate: 43,
    budgetTotal: 420000,
    budgetUsed: 180600,
    approvalFlow: [
      { id: '1', timestamp: '2025-07-16 09:15', nodeName: '提交申请', approver: '李明', result: 'approved' },
      { id: '2', timestamp: '2025-07-16 11:00', nodeName: '部门主管审批', approver: 'Tate', result: 'approved' },
      { id: '3', timestamp: '2025-07-16 14:00', nodeName: '财务审核', approver: 'Lyn', result: 'approved' },
      { id: '4', timestamp: '', nodeName: '总监审批', approver: '待审核', result: 'pending' },
    ],
  },
  {
    id: '19',
    approvalNo: 'OA-RBX-20250708-048',
    submitter: '赵娜',
    submitterId: 'EMP-ZHAONA',
    submitDept: '亚太事业部',
    submitDeptId: 'BM000008',
    expenseDept: '品牌营销中心',
    expenseDeptId: 'BM000123',
    customerGroup: 'Tmall',
    paymentReason: '天猫超级品牌日营销费',
    accountingDimension: 'dept-custgroup-cust-expense',
    budgetSubjectCode: '6601.15',
    amount: 150000,
    currency: 'CNY',
    paymentMethod: '银行转账',
    paymentEntity: '波赛冬集团',
    expectedPaymentDate: '2025-07-18',
    receiverName: '阿里巴巴（中国）有限公司',
    receiverAccount: '6228*********5432',
    receiverBank: '支付宝',
    status: 'completed',
    hasAttachment: true,
    submitDate: '2025-07-08 13:20',
    budgetVersion: 'V2025.02',
    budgetUsageRate: 87,
    budgetTotal: 2000000,
    budgetUsed: 1740000,
    kingdeePayableNo: 'AP-20250710-016',
    approvalFlow: [
      { id: '1', timestamp: '2025-07-08 13:20', nodeName: '提交申请', approver: '赵娜', result: 'approved' },
      { id: '2', timestamp: '2025-07-08 15:00', nodeName: '部门主管审批', approver: 'Linda', result: 'approved' },
      { id: '3', timestamp: '2025-07-09 09:00', nodeName: '财务审核', approver: '何静', result: 'approved' },
      { id: '4', timestamp: '2025-07-09 14:00', nodeName: '总监审批', approver: 'Linda', result: 'approved' },
      { id: '5', timestamp: '2025-07-10 09:00', nodeName: '推送金蝶', approver: '系统自动', result: 'approved' },
    ],
  },
  {
    id: '20',
    approvalNo: 'OA-RBX-20250717-102',
    submitter: '刘洋',
    submitterId: 'EMP-LIUYANG',
    submitDept: '全球共享服务中心',
    submitDeptId: 'BM000109',
    expenseDept: '行政管理部',
    expenseDeptId: 'BM000112',
    customerGroup: '-',
    paymentReason: '办公室装修工程款',
    accountingDimension: 'dept',
    budgetSubjectCode: '6602.17',
    amount: 280000,
    currency: 'CNY',
    paymentMethod: '银行转账',
    paymentEntity: '波赛冬集团',
    expectedPaymentDate: '2025-08-05',
    receiverName: '深圳市美居装饰工程有限公司',
    receiverAccount: '6225*********7890',
    receiverBank: '建设银行深圳宝安支行',
    status: 'pending_kingdee',
    hasAttachment: true,
    submitDate: '2025-07-17 10:30',
    budgetVersion: 'V2025.02',
    budgetUsageRate: 92,
    budgetTotal: 3500000,
    budgetUsed: 3220000,
    approvalFlow: [
      { id: '1', timestamp: '2025-07-17 10:30', nodeName: '提交申请', approver: '刘洋', result: 'approved' },
      { id: '2', timestamp: '2025-07-17 14:00', nodeName: '部门主管审批', approver: 'Harry', result: 'approved' },
      { id: '3', timestamp: '2025-07-18 09:00', nodeName: '财务审核', approver: 'Lyn', result: 'approved' },
      { id: '4', timestamp: '2025-07-18 14:00', nodeName: '总监审批', approver: 'Harry', result: 'approved' },
      { id: '5', timestamp: '', nodeName: '推送金蝶', approver: '待推送', result: 'pending' },
    ],
  },
];

// --------------- 页面主体 ---------------
function ExpenseApprovalDetail({ onOpenDetail }) {
  const [selectedStatus, setSelectedStatus] = React.useState('all');
  const [searchKeyword, setSearchKeyword] = React.useState('');
  const [selectedSubmitter, setSelectedSubmitter] = React.useState('all');
  const [selectedDept, setSelectedDept] = React.useState('all');
  const [selectedExpenseDept, setSelectedExpenseDept] = React.useState('all');
  const [selectedCustomer, setSelectedCustomer] = React.useState('all');
  const [selectedCurrency, setSelectedCurrency] = React.useState('all');
  const [selectedPaymentEntity, setSelectedPaymentEntity] = React.useState('all');
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 10;

  // 获取唯一值列表
  const submitters = [...new Set(mockApprovalRecords.map(r => r.submitter))];
  const depts = [...new Set(mockApprovalRecords.map(r => r.submitDept))];
  const expenseDepts = [...new Set(mockApprovalRecords.map(r => r.expenseDept))];
  const customers = [...new Set(mockApprovalRecords.map(r => r.customerGroup))];
  const currencies = [...new Set(mockApprovalRecords.map(r => r.currency))];
  const paymentEntities = [...new Set(mockApprovalRecords.map(r => r.paymentEntity))];

  // 计算状态卡片数据
  const statusCards = [
    {
      status: 'pending_accounting',
      label: '待会计审核',
      count: mockApprovalRecords.filter((r) => r.status === 'pending_accounting').length,
      totalAmount: mockApprovalRecords
        .filter((r) => r.status === 'pending_accounting')
        .reduce((sum, r) => sum + r.amount, 0),
      color: 'bg-yellow-50 border-yellow-200 text-yellow-700',
      icon: <Clock className="w-5 h-5" />,
    },
    {
      status: 'pending_director',
      label: '待总监审核',
      count: mockApprovalRecords.filter((r) => r.status === 'pending_director').length,
      totalAmount: mockApprovalRecords
        .filter((r) => r.status === 'pending_director')
        .reduce((sum, r) => sum + r.amount, 0),
      color: 'bg-orange-50 border-orange-200 text-orange-700',
      icon: <AlertCircle className="w-5 h-5" />,
    },
    {
      status: 'pending_kingdee',
      label: '待推送金蝶',
      count: mockApprovalRecords.filter((r) => r.status === 'pending_kingdee').length,
      totalAmount: mockApprovalRecords
        .filter((r) => r.status === 'pending_kingdee')
        .reduce((sum, r) => sum + r.amount, 0),
      color: 'bg-blue-50 border-blue-200 text-blue-700',
      icon: <Send className="w-5 h-5" />,
    },
    {
      status: 'completed',
      label: '已完成',
      count: mockApprovalRecords.filter((r) => r.status === 'completed').length,
      totalAmount: mockApprovalRecords
        .filter((r) => r.status === 'completed')
        .reduce((sum, r) => sum + r.amount, 0),
      color: 'bg-green-50 border-green-200 text-green-700',
      icon: <CheckCircle2 className="w-5 h-5" />,
    },
    {
      status: 'rejected',
      label: '驳回',
      count: mockApprovalRecords.filter((r) => r.status === 'rejected').length,
      totalAmount: mockApprovalRecords
        .filter((r) => r.status === 'rejected')
        .reduce((sum, r) => sum + r.amount, 0),
      color: 'bg-red-50 border-red-200 text-red-700',
      icon: <XCircle className="w-5 h-5" />,
    },
  ];

  // 筛选数据
  const filteredRecords = mockApprovalRecords.filter((record) => {
    if (selectedStatus !== 'all' && record.status !== selectedStatus) return false;
    if (selectedSubmitter !== 'all' && record.submitter !== selectedSubmitter) return false;
    if (selectedDept !== 'all' && record.submitDept !== selectedDept) return false;
    if (selectedExpenseDept !== 'all' && record.expenseDept !== selectedExpenseDept) return false;
    if (selectedCustomer !== 'all' && record.customerGroup !== selectedCustomer) return false;
    if (selectedCurrency !== 'all' && record.currency !== selectedCurrency) return false;
    if (selectedPaymentEntity !== 'all' && record.paymentEntity !== selectedPaymentEntity) return false;
    if (
      searchKeyword &&
      !record.approvalNo.toLowerCase().includes(searchKeyword.toLowerCase()) &&
      !record.paymentReason.toLowerCase().includes(searchKeyword.toLowerCase()) &&
      !record.customerGroup.toLowerCase().includes(searchKeyword.toLowerCase())
    )
      return false;
    return true;
  });

  // 分页数据
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const totalPages = Math.ceil(filteredRecords.length / pageSize);

  const handleRecordClick = (record) => {
    if (onOpenDetail) {
      onOpenDetail(record);
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
        return null;
    }
  };

  const formatCurrency = (amount, currency) => {
    const symbol = currency === 'CNY' ? '¥' : currency === 'USD' ? '$' : '€';
    return `${symbol}${amount.toLocaleString()}`;
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* 页面标题 */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <h1 className="text-2xl font-semibold text-gray-900">费用审批明细</h1>
        <p className="text-gray-500 mt-1">
          查看各部门提交的费用审批单明细，支持按审批状态、付款主体、预算科目、客户维度等条件筛选
        </p>
      </div>

      {/* 顶部筛选栏 */}
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="grid grid-cols-4 gap-3 mb-3">
          <Select value={selectedSubmitter} onChange={setSelectedSubmitter}>
            <option value="all">全部提交人</option>
            {submitters.map(s => <option key={s} value={s}>{s}</option>)}
          </Select>

          <Select value={selectedDept} onChange={setSelectedDept}>
            <option value="all">全部提交部门</option>
            {depts.map(d => <option key={d} value={d}>{d}</option>)}
          </Select>

          <Select value={selectedExpenseDept} onChange={setSelectedExpenseDept}>
            <option value="all">全部费用承担部门</option>
            {expenseDepts.map(d => <option key={d} value={d}>{d}</option>)}
          </Select>

          <Select value={selectedCustomer} onChange={setSelectedCustomer}>
            <option value="all">全部客户分组</option>
            {customers.map(c => <option key={c} value={c}>{c}</option>)}
          </Select>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <Select value={selectedCurrency} onChange={setSelectedCurrency}>
            <option value="all">全部币种</option>
            {currencies.map(c => <option key={c} value={c}>{c}</option>)}
          </Select>

          <Select value={selectedPaymentEntity} onChange={setSelectedPaymentEntity}>
            <option value="all">全部付款主体</option>
            {paymentEntities.map(p => <option key={p} value={p}>{p}</option>)}
          </Select>

          <div className="col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="搜索付款事由、客户、审批单号..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Filter className="w-4 h-4" />
            共找到 <span className="text-blue-600 font-medium">{filteredRecords.length}</span> 条审批记录
          </div>
          <div className="flex items-center gap-2">
            <IconButton>
              <Download className="w-4 h-4 mr-2" />
              导出数据
            </IconButton>
            <IconButton>
              <RefreshCw className="w-4 h-4 mr-2" />
              刷新数据
            </IconButton>
          </div>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="p-8 space-y-6">
          {/* 状态卡片 */}
          <div className="grid grid-cols-5 gap-4">
            {statusCards.map((card) => (
              <Card
                key={card.status}
                className={cn(
                  'p-4 cursor-pointer transition-all hover:shadow-md',
                  selectedStatus === card.status && 'ring-2 ring-blue-500'
                )}
                onClick={() => setSelectedStatus(selectedStatus === card.status ? 'all' : card.status)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={cn('text-sm font-medium', card.color.split(' ')[2])}>{card.label}</span>
                  <span className={card.color.split(' ')[2]}>{card.icon}</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{card.count}</div>
                <div className="text-xs text-gray-500 mt-1">
                  合计 ¥{card.totalAmount.toLocaleString()}
                </div>
              </Card>
            ))}
          </div>

          {/* 审批单列表 */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[1600px]">
                <thead className="bg-gray-50">
                  <tr className="text-left">
                    <th className="px-4 py-3 font-medium text-gray-700 whitespace-nowrap">飞书审批单号</th>
                    <th className="px-4 py-3 font-medium text-gray-700 whitespace-nowrap">提交人</th>
                    <th className="px-4 py-3 font-medium text-gray-700 whitespace-nowrap">提交部门</th>
                    <th className="px-4 py-3 font-medium text-gray-700 whitespace-nowrap">费用承担部门</th>
                    <th className="px-4 py-3 font-medium text-gray-700 whitespace-nowrap">客户分组</th>
                    <th className="px-4 py-3 font-medium text-gray-700 whitespace-nowrap">付款事由</th>
                    <th className="px-4 py-3 font-medium text-gray-700 whitespace-nowrap">核算维度</th>
                    <th className="px-4 py-3 font-medium text-gray-700 whitespace-nowrap">会计科目</th>
                    <th className="px-4 py-3 font-medium text-gray-700 whitespace-nowrap">付款金额</th>
                    <th className="px-4 py-3 font-medium text-gray-700 whitespace-nowrap">付款主体</th>
                    <th className="px-4 py-3 font-medium text-gray-700 whitespace-nowrap">预计付款日期</th>
                    <th className="px-4 py-3 font-medium text-gray-700 whitespace-nowrap">状态</th>
                    <th className="px-4 py-3 font-medium text-gray-700 whitespace-nowrap">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRecords.length === 0 ? (
                    <tr>
                      <td colSpan={13} className="text-center py-12 text-gray-500">
                        暂无数据
                      </td>
                    </tr>
                  ) : (
                    paginatedRecords.map((record, index) => (
                      <tr
                        key={record.id}
                        className={cn(
                          'border-t border-gray-100 hover:bg-gray-50',
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                        )}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-500" />
                            <span className="text-blue-600 font-medium">{record.approvalNo}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3 text-gray-400" />
                            <span>{record.submitter}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <Building2 className="w-3 h-3 text-gray-400" />
                            <span className="text-sm">{record.submitDept}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <Building2 className="w-3 h-3 text-blue-400" />
                            <span className="text-sm">{record.expenseDept}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-700">{record.customerGroup}</span>
                        </td>
                        <td className="px-4 py-3 max-w-xs">
                          <Tooltip content={record.paymentReason}>
                            <p className="text-sm truncate cursor-help">{record.paymentReason}</p>
                          </Tooltip>
                        </td>
                        <td className="px-4 py-3">
                          {(() => {
                            const dimensionType = getDimensionTypeBySubjectCode(record.budgetSubjectCode);
                            return dimensionType ? (
                              <Badge className="bg-gray-50 text-gray-600 border-gray-200 text-xs">
                                {getDimensionTypeLabel(dimensionType)}
                              </Badge>
                            ) : (
                              <span className="text-xs text-gray-400">-</span>
                            );
                          })()}
                        </td>
                        <td className="px-4 py-3">
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {record.budgetSubjectCode}
                          </code>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3 text-green-600" />
                            <span className="text-gray-900 font-medium">
                              {formatCurrency(record.amount, record.currency)}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">{record.currency}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-700">{record.paymentEntity}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3 text-gray-400" />
                            <span className="text-sm">{record.expectedPaymentDate}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">{getStatusBadge(record.status)}</td>
                        <td className="px-4 py-3">
                          <button
                            className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                            onClick={() => handleRecordClick(record)}
                          >
                            <Eye className="w-3 h-3" />
                            查看详情
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* 分页 */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <TablePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  pageSize={pageSize}
                  totalItems={filteredRecords.length}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </Card>
        </div>
      </div>

    </div>
  );
}

// 默认导出（详情改为独立页面，通过 onOpenDetail 打开新标签）
export default function ExpenseFactPage({ onOpenDetail }) {
  return <ExpenseApprovalDetail onOpenDetail={onOpenDetail} />;
}
