import React, { useMemo } from 'react';
import { AlertTriangle, GitBranch, MessageSquareWarning, ShieldCheck } from 'lucide-react';
import { getMockQualityComplaintRecords } from '../../mock/quality';
import QualityWorkbenchPage, { StatusTag } from './QualityWorkbenchPage';

const complaintStatusToneMap = {
  待受理: 'warning',
  待分析: 'primary',
  追溯中: 'primary',
  待整改: 'danger',
  已完成: 'success',
  已关闭: 'neutral',
};

const responsibilityToneMap = {
  供应商责任: 'danger',
  运输责任: 'warning',
  仓储责任: 'warning',
  平台责任: 'neutral',
  待确认: 'primary',
};

const severityToneMap = {
  轻微: 'neutral',
  一般: 'primary',
  严重: 'warning',
  紧急: 'danger',
};

const SEARCH_FIELDS = [
  { key: 'complaintNo', label: '客诉单号', placeholder: '请输入客诉单号' },
  {
    key: 'complaintStatus',
    label: '客诉状态',
    type: 'select',
    placeholder: '全部客诉状态',
    options: [
      { value: '待受理', label: '待受理' },
      { value: '待分析', label: '待分析' },
      { value: '追溯中', label: '追溯中' },
      { value: '待整改', label: '待整改' },
      { value: '已完成', label: '已完成' },
      { value: '已关闭', label: '已关闭' },
    ],
  },
  {
    key: 'complaintType',
    label: '客诉类型',
    type: 'select',
    placeholder: '全部客诉类型',
    options: [
      { value: '结构缺陷', label: '结构缺陷' },
      { value: '性能异常', label: '性能异常' },
      { value: '外观不良', label: '外观不良' },
      { value: '包装破损', label: '包装破损' },
      { value: '气味异常', label: '气味异常' },
    ],
  },
  { key: 'orderNo', label: '订单号', placeholder: '请输入订单号' },
  { key: 'sku', label: 'SKU', placeholder: '请输入 SKU' },
  { key: 'productName', label: '商品名称', placeholder: '请输入商品名称' },
  { key: 'customerKeyword', label: '客户名称 / 客户ID', placeholder: '请输入客户名称或 ID' },
  { key: 'supplierName', label: '供应商', placeholder: '请输入供应商' },
  { key: 'productionBatchNo', label: '批次号', placeholder: '请输入生产批次号' },
  {
    id: 'feedbackRange',
    label: '反馈时间范围',
    type: 'dateRange',
    startKey: 'feedbackStart',
    endKey: 'feedbackEnd',
  },
  {
    key: 'responsibilityJudgement',
    label: '责任判定',
    type: 'select',
    placeholder: '全部责任判定',
    options: [
      { value: '供应商责任', label: '供应商责任' },
      { value: '运输责任', label: '运输责任' },
      { value: '仓储责任', label: '仓储责任' },
      { value: '平台责任', label: '平台责任' },
      { value: '待确认', label: '待确认' },
    ],
  },
  { key: 'handler', label: '处理人', placeholder: '请输入处理人' },
];

const INITIAL_FILTERS = {
  complaintNo: '',
  complaintStatus: '',
  complaintType: '',
  orderNo: '',
  sku: '',
  productName: '',
  customerKeyword: '',
  supplierName: '',
  productionBatchNo: '',
  feedbackStart: '',
  feedbackEnd: '',
  responsibilityJudgement: '',
  handler: '',
};

export default function QualityComplaintPage() {
  const records = useMemo(() => getMockQualityComplaintRecords(), []);

  const summaryCards = useMemo(() => {
    const waitingAnalysis = records.filter((item) => item.complaintStatus === '待分析').length;
    const tracing = records.filter((item) => item.complaintStatus === '追溯中').length;
    const supplierRelated = records.filter((item) => item.traceableToSupplier === '是').length;
    const closedLoop = records.filter((item) => item.complaintStatus === '已完成').length;

    return [
      {
        label: '待分析客诉',
        value: `${waitingAnalysis} 单`,
        helper: '从客户反馈进入质量分析环节',
        icon: MessageSquareWarning,
        iconClassName: 'bg-brand-50 text-brand-700',
      },
      {
        label: '追溯中客诉',
        value: `${tracing} 单`,
        helper: '正在关联订单、批次与供应商做质量追溯',
        icon: GitBranch,
        iconClassName: 'bg-warning-50 text-warning-700',
      },
      {
        label: '可追溯供应商问题',
        value: `${supplierRelated} 单`,
        helper: '已初步锁定供应商或批次维度风险',
        icon: AlertTriangle,
        iconClassName: 'bg-danger-50 text-danger-700',
      },
      {
        label: '已形成闭环',
        value: `${closedLoop} 单`,
        helper: '已完成责任判定、整改验证与结案',
        icon: ShieldCheck,
        iconClassName: 'bg-success-50 text-success-700',
      },
    ];
  }, [records]);

  const columns = useMemo(
    () => [
      {
        key: 'complaintNo',
        title: '客诉单号',
        width: 150,
        render: (record) => <span className="font-medium text-text">{record.complaintNo}</span>,
      },
      { key: 'complaintTitle', title: '客诉标题', width: 240 },
      {
        key: 'complaintStatus',
        title: '客诉状态',
        width: 100,
        render: (record) => (
          <StatusTag tone={complaintStatusToneMap[record.complaintStatus]}>{record.complaintStatus}</StatusTag>
        ),
      },
      { key: 'complaintType', title: '客诉类型', width: 100 },
      { key: 'orderNo', title: '订单号', width: 160 },
      { key: 'sku', title: 'SKU', width: 150, cellClassName: 'font-mono text-xs text-text' },
      { key: 'productName', title: '商品名称', width: 180 },
      { key: 'customerName', title: '客户名称', width: 130 },
      {
        key: 'feedbackQty',
        title: '反馈数量',
        width: 90,
        render: (record) => `${record.feedbackQty} 件`,
      },
      { key: 'issuePhenomenon', title: '问题现象', width: 200 },
      { key: 'supplierName', title: '供应商', width: 190 },
      { key: 'productionBatchNo', title: '批次号', width: 130 },
      {
        key: 'responsibilityJudgement',
        title: '责任判定',
        width: 110,
        render: (record) => (
          <StatusTag tone={responsibilityToneMap[record.responsibilityJudgement]}>
            {record.responsibilityJudgement}
          </StatusTag>
        ),
      },
      {
        key: 'handler',
        title: '处理人',
        width: 100,
        render: (record) => record.handler || <span className="text-text-subtle">待分配</span>,
      },
      { key: 'feedbackAt', title: '反馈时间', width: 150 },
      { key: 'dueAt', title: '截止时间', width: 150 },
      {
        key: 'remark',
        title: '备注',
        width: 220,
        render: (record) => <span className="line-clamp-2">{record.remark}</span>,
      },
    ],
    []
  );

  return (
    <QualityWorkbenchPage
      title="客诉质量"
      description="以客户反馈为入口，串联订单、商品、批次、供应商与责任判定，形成从问题识别到整改闭环的质量追溯台账。"
      summaryCards={summaryCards}
      searchFields={SEARCH_FIELDS}
      initialFilters={INITIAL_FILTERS}
      records={records}
      columns={columns}
      filterRecords={(record, filters, helpers) => {
        const includes = (field, value) => {
          if (!value) return true;
          return helpers.normalizeText(record[field]).includes(helpers.normalizeText(value));
        };

        const customerMatched =
          !filters.customerKeyword ||
          helpers.normalizeText(record.customerName).includes(helpers.normalizeText(filters.customerKeyword)) ||
          helpers.normalizeText(record.customerId).includes(helpers.normalizeText(filters.customerKeyword));

        return (
          includes('complaintNo', filters.complaintNo) &&
          (!filters.complaintStatus || record.complaintStatus === filters.complaintStatus) &&
          (!filters.complaintType || record.complaintType === filters.complaintType) &&
          includes('orderNo', filters.orderNo) &&
          includes('sku', filters.sku) &&
          includes('productName', filters.productName) &&
          customerMatched &&
          includes('supplierName', filters.supplierName) &&
          includes('productionBatchNo', filters.productionBatchNo) &&
          helpers.inDateRange(record.feedbackAt, filters.feedbackStart, filters.feedbackEnd) &&
          (!filters.responsibilityJudgement || record.responsibilityJudgement === filters.responsibilityJudgement) &&
          includes('handler', filters.handler)
        );
      }}
      drawerTitle={(record) => `客诉质量详情 · ${record.complaintNo}`}
      drawerSubtitle={(record) =>
        `${record.customerName} · ${record.productName} · ${record.responsibilityJudgement}`
      }
      drawerSections={[
        {
          title: '客诉信息',
          description: '从客户反馈入口查看客诉来源、状态、处理人与时效要求。',
          fields: [
            { label: '客诉单号', key: 'complaintNo' },
            { label: '客诉标题', key: 'complaintTitle' },
            {
              label: '客诉状态',
              render: (record) => (
                <StatusTag tone={complaintStatusToneMap[record.complaintStatus]}>{record.complaintStatus}</StatusTag>
              ),
            },
            { label: '客诉类型', key: 'complaintType' },
            { label: '反馈渠道', key: 'feedbackChannel' },
            { label: '反馈时间', key: 'feedbackAt' },
            { label: '客户名称 / 客户ID', value: (record) => `${record.customerName} / ${record.customerId}` },
            { label: '联系方式', key: 'contactInfo' },
            { label: '处理人', key: 'handler' },
            { label: '截止时间', key: 'dueAt' },
          ],
        },
        {
          title: '订单与商品信息',
          description: '把客户反馈与订单、商品、仓库和站点信息关联起来，定位发生场景。',
          fields: [
            { label: '订单号', key: 'orderNo' },
            { label: '下单时间', key: 'orderedAt' },
            { label: 'SKU', key: 'sku' },
            { label: '商品名称', key: 'productName' },
            { label: '规格', key: 'specification' },
            { label: '购买数量', value: (record) => `${record.purchaseQty} 件` },
            { label: '客诉数量', value: (record) => `${record.complaintQty} 件` },
            { label: '仓库 / 发货仓', key: 'shipWarehouse' },
            { label: '站点 / 店铺', key: 'siteStore', span: 2 },
          ],
        },
        {
          title: '质量问题信息',
          description: '沉淀客户感知到的问题现象、风险程度与初步判定。',
          fields: [
            { label: '问题现象', key: 'issuePhenomenon' },
            { label: '问题描述', key: 'issueDescription', span: 2 },
            {
              label: '严重程度',
              render: (record) => <StatusTag tone={severityToneMap[record.severityLevel]}>{record.severityLevel}</StatusTag>,
            },
            { label: '附件说明', value: (record) => record.attachmentNotes },
            { label: '是否影响安全 / 使用', key: 'safetyImpact' },
            { label: '初步判定', key: 'preliminaryJudgement', span: 2 },
          ],
        },
        {
          title: '追溯信息',
          description: '核心体现客户反馈如何追溯到采购、批次、供应商与历史质检结论。',
          fields: [
            { label: '供应商', key: 'supplierName' },
            { label: '采购单号', key: 'purchaseOrderNo' },
            { label: '入库批次号', key: 'inboundBatchNo' },
            { label: '生产批次号', key: 'productionBatchNo' },
            { label: '质检方式', key: 'inspectionMode' },
            { label: '最近质检结论', key: 'latestInspectionResult' },
            { label: '是否同批次重复发生', key: 'repeatedSameBatch' },
            { label: '是否可追溯到供应商问题', key: 'traceableToSupplier' },
          ],
        },
        {
          title: '闭环信息',
          description: '沉淀责任判定、整改措施、供应商反馈与预防动作，形成质量优化闭环。',
          fields: [
            {
              label: '责任判定',
              render: (record) => (
                <StatusTag tone={responsibilityToneMap[record.responsibilityJudgement]}>
                  {record.responsibilityJudgement}
                </StatusTag>
              ),
            },
            { label: '根因分析', key: 'rootCauseAnalysis', span: 2 },
            { label: '整改措施', key: 'correctiveAction', span: 2 },
            { label: '供应商反馈', key: 'supplierFeedback', span: 2 },
            { label: '预防措施', key: 'preventiveAction', span: 2 },
            { label: '闭环结论', key: 'closureConclusion', span: 2 },
            { label: '完成时间', value: (record) => record.completedAt || '未完成' },
          ],
        },
      ]}
      tableMinWidth={2550}
      emptyText="暂无符合条件的客诉质量台账"
    />
  );
}
