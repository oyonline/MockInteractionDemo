import React, { useMemo } from 'react';
import { ClipboardList, Clock3, PackageCheck, ShieldAlert } from 'lucide-react';
import { getMockQualityTaskRecords } from '../../mock/quality';
import QualityWorkbenchPage, { StatusTag } from './QualityWorkbenchPage';

const taskStatusToneMap = {
  待分配: 'warning',
  待检查: 'primary',
  检查中: 'primary',
  待处理: 'danger',
  已完成: 'success',
  已关闭: 'neutral',
};

const taskTypeToneMap = {
  抽检: 'primary',
  全检: 'warning',
};

const SEARCH_FIELDS = [
  { key: 'taskNo', label: '质量任务单号', placeholder: '请输入质量任务单号' },
  {
    key: 'taskType',
    label: '任务类型',
    type: 'select',
    placeholder: '全部任务类型',
    options: [
      { value: '抽检', label: '抽检' },
      { value: '全检', label: '全检' },
    ],
  },
  {
    key: 'taskStatus',
    label: '任务状态',
    type: 'select',
    placeholder: '全部任务状态',
    options: [
      { value: '待分配', label: '待分配' },
      { value: '待检查', label: '待检查' },
      { value: '检查中', label: '检查中' },
      { value: '待处理', label: '待处理' },
      { value: '已完成', label: '已完成' },
      { value: '已关闭', label: '已关闭' },
    ],
  },
  { key: 'sku', label: 'SKU', placeholder: '请输入 SKU' },
  { key: 'batchNo', label: '批次号', placeholder: '请输入批次号' },
  { key: 'supplierName', label: '供应商', placeholder: '请输入供应商' },
  { key: 'locationCode', label: '仓位', placeholder: '请输入仓位' },
  { key: 'purchaseOrderNo', label: '采购单号', placeholder: '请输入采购单号' },
  {
    id: 'createdRange',
    label: '创建时间范围',
    type: 'dateRange',
    startKey: 'createdStart',
    endKey: 'createdEnd',
  },
  {
    id: 'dueRange',
    label: '截止时间范围',
    type: 'dateRange',
    startKey: 'dueStart',
    endKey: 'dueEnd',
  },
  { key: 'owner', label: '负责人', placeholder: '请输入负责人' },
];

const INITIAL_FILTERS = {
  taskNo: '',
  taskType: '',
  taskStatus: '',
  sku: '',
  batchNo: '',
  supplierName: '',
  locationCode: '',
  purchaseOrderNo: '',
  createdStart: '',
  createdEnd: '',
  dueStart: '',
  dueEnd: '',
  owner: '',
};

export default function QualityTaskPage() {
  const records = useMemo(() => getMockQualityTaskRecords(), []);

  const summaryCards = useMemo(() => {
    const pendingAssign = records.filter((item) => item.taskStatus === '待分配').length;
    const inProgress = records.filter((item) => item.taskStatus === '检查中').length;
    const pendingAction = records.filter((item) => item.taskStatus === '待处理').length;
    const dueSoon = records.filter((item) => item.dueAt.startsWith('2026-04-02') || item.dueAt.startsWith('2026-04-03')).length;

    return [
      {
        label: '待分配任务',
        value: `${pendingAssign} 单`,
        helper: '尚未指派负责人，需尽快落人',
        icon: ClipboardList,
        iconClassName: 'bg-warning-50 text-warning-700',
      },
      {
        label: '检查中任务',
        value: `${inProgress} 单`,
        helper: '现场正在执行抽检或全检',
        icon: PackageCheck,
        iconClassName: 'bg-brand-50 text-brand-700',
      },
      {
        label: '待处理异常',
        value: `${pendingAction} 单`,
        helper: '已发现问题，待确认处置建议',
        icon: ShieldAlert,
        iconClassName: 'bg-danger-50 text-danger-700',
      },
      {
        label: '近 48 小时到期',
        value: `${dueSoon} 单`,
        helper: '需要关注 SLA 与任务收尾节奏',
        icon: Clock3,
        iconClassName: 'bg-success-50 text-success-700',
      },
    ];
  }, [records]);

  const columns = useMemo(
    () => [
      {
        key: 'taskNo',
        title: '质量任务单号',
        width: 170,
        render: (record) => <span className="font-medium text-text">{record.taskNo}</span>,
      },
      {
        key: 'taskType',
        title: '任务类型',
        width: 90,
        render: (record) => <StatusTag tone={taskTypeToneMap[record.taskType]}>{record.taskType}</StatusTag>,
      },
      { key: 'taskTitle', title: '任务标题', width: 220 },
      {
        key: 'taskStatus',
        title: '任务状态',
        width: 100,
        render: (record) => <StatusTag tone={taskStatusToneMap[record.taskStatus]}>{record.taskStatus}</StatusTag>,
      },
      { key: 'sku', title: 'SKU', width: 150, cellClassName: 'font-mono text-xs text-text' },
      { key: 'productName', title: '产品名称', width: 180 },
      { key: 'batchNo', title: '批次号', width: 120 },
      { key: 'supplierName', title: '供应商', width: 190 },
      { key: 'locationCode', title: '仓位', width: 100 },
      { key: 'purchaseOrderNo', title: '采购单号', width: 150 },
      {
        key: 'inspectionQty',
        title: '检查数量',
        width: 100,
        render: (record) => `${record.inspectionQty.toLocaleString()} 件`,
      },
      {
        key: 'owner',
        title: '负责人',
        width: 100,
        render: (record) => record.owner || <span className="text-text-subtle">待分配</span>,
      },
      { key: 'dueAt', title: '截止时间', width: 150 },
      { key: 'creator', title: '创建人', width: 100 },
      { key: 'createdAt', title: '创建时间', width: 150 },
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
      title="质量检查任务"
      description="面向手动创建的抽检 / 全检任务台账，聚焦任务编号、负责人、截止时间以及关联 SKU、批次、供应商与仓位信息。"
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

        return (
          includes('taskNo', filters.taskNo) &&
          (!filters.taskType || record.taskType === filters.taskType) &&
          (!filters.taskStatus || record.taskStatus === filters.taskStatus) &&
          includes('sku', filters.sku) &&
          includes('batchNo', filters.batchNo) &&
          includes('supplierName', filters.supplierName) &&
          includes('locationCode', filters.locationCode) &&
          includes('purchaseOrderNo', filters.purchaseOrderNo) &&
          helpers.inDateRange(record.createdAt, filters.createdStart, filters.createdEnd) &&
          helpers.inDateRange(record.dueAt, filters.dueStart, filters.dueEnd) &&
          includes('owner', filters.owner)
        );
      }}
      drawerTitle={(record) => `质量任务详情 · ${record.taskNo}`}
      drawerSubtitle={(record) =>
        `${record.taskType} · ${record.productName} · ${record.owner || '待分配负责人'}`
      }
      drawerSections={[
        {
          title: '任务信息',
          description: '聚焦任务基本属性、负责人和截止时间，突出任务台账语义。',
          fields: [
            { label: '质量任务单号', key: 'taskNo' },
            { label: '任务标题', key: 'taskTitle' },
            {
              label: '任务类型',
              render: (record) => <StatusTag tone={taskTypeToneMap[record.taskType]}>{record.taskType}</StatusTag>,
            },
            {
              label: '任务状态',
              render: (record) => <StatusTag tone={taskStatusToneMap[record.taskStatus]}>{record.taskStatus}</StatusTag>,
            },
            { label: '截止时间', key: 'dueAt' },
            { label: '创建人', key: 'creator' },
            { label: '创建时间', key: 'createdAt' },
            { label: '负责人', value: (record) => record.owner || '待分配' },
          ],
        },
        {
          title: '关联业务信息',
          description: '展示本次任务关联的 SKU、批次、供应商、仓位与采购单。',
          fields: [
            { label: 'SKU', key: 'sku' },
            { label: '产品名称', key: 'productName' },
            { label: '批次号', key: 'batchNo' },
            { label: '供应商', key: 'supplierName' },
            { label: '仓位', key: 'locationCode' },
            { label: '采购单号', key: 'purchaseOrderNo' },
          ],
        },
        {
          title: '检查信息',
          description: '保留任务范围、要求、问题描述与处理建议，体现任务管理语义。',
          fields: [
            { label: '检查范围说明', key: 'scopeDescription', span: 2 },
            { label: '检查数量', value: (record) => `${record.inspectionQty.toLocaleString()} 件` },
            { label: '检查要求', key: 'inspectionRequirement' },
            { label: '问题描述', key: 'issueDescription', span: 2 },
            { label: '处理建议', key: 'actionSuggestion', span: 2 },
            { label: '备注', key: 'remark', span: 2 },
          ],
        },
      ]}
      tableMinWidth={2280}
      emptyText="暂无符合条件的质量检查任务"
    />
  );
}
