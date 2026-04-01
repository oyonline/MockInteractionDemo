import React, { useMemo } from 'react';
import { CalendarClock, PackageSearch, ShieldCheck, UserRoundSearch } from 'lucide-react';
import { getMockInboundInspectionRecords } from '../../mock/quality';
import QualityWorkbenchPage, { StatusTag } from './QualityWorkbenchPage';

const scheduleToneMap = {
  未排期: 'warning',
  已排期: 'primary',
  已完成: 'success',
  已取消: 'danger',
};

const urgencyToneMap = {
  常规: 'neutral',
  紧急: 'warning',
  加急: 'danger',
};

const inspectionToneMap = {
  免检: 'neutral',
  抽检: 'primary',
  全检: 'warning',
};

const inboundToneMap = {
  待到货: 'warning',
  部分到货: 'primary',
  已到货: 'success',
};

const SEARCH_FIELDS = [
  { key: 'inboundNo', label: '采购入库单号', placeholder: '请输入采购入库单号' },
  { key: 'purchaseOrderNo', label: '采购单号', placeholder: '请输入采购单号' },
  { key: 'supplierName', label: '供应商名称', placeholder: '请输入供应商名称' },
  {
    key: 'warehouseName',
    label: '仓库',
    type: 'select',
    placeholder: '全部仓库',
    options: [
      { value: '深圳龙华成品仓', label: '深圳龙华成品仓' },
      { value: '东莞凤岗中转仓', label: '东莞凤岗中转仓' },
      { value: '义乌辅料仓', label: '义乌辅料仓' },
      { value: '深圳龙岗退换货仓', label: '深圳龙岗退换货仓' },
      { value: '惠州五金仓', label: '惠州五金仓' },
      { value: '青岛北方仓', label: '青岛北方仓' },
    ],
  },
  {
    id: 'arrivalRange',
    label: '预计到货日期',
    type: 'dateRange',
    startKey: 'arrivalStart',
    endKey: 'arrivalEnd',
  },
  {
    key: 'inboundStatus',
    label: '入库状态',
    type: 'select',
    placeholder: '全部入库状态',
    options: [
      { value: '待到货', label: '待到货' },
      { value: '部分到货', label: '部分到货' },
      { value: '已到货', label: '已到货' },
    ],
  },
  {
    key: 'scheduleStatus',
    label: '排期状态',
    type: 'select',
    placeholder: '全部排期状态',
    options: [
      { value: '未排期', label: '未排期' },
      { value: '已排期', label: '已排期' },
      { value: '已完成', label: '已完成' },
      { value: '已取消', label: '已取消' },
    ],
  },
  {
    key: 'urgencyLevel',
    label: '紧急程度',
    type: 'select',
    placeholder: '全部紧急程度',
    options: [
      { value: '常规', label: '常规' },
      { value: '紧急', label: '紧急' },
      { value: '加急', label: '加急' },
    ],
  },
];

const INITIAL_FILTERS = {
  inboundNo: '',
  purchaseOrderNo: '',
  supplierName: '',
  warehouseName: '',
  arrivalStart: '',
  arrivalEnd: '',
  inboundStatus: '',
  scheduleStatus: '',
  urgencyLevel: '',
};

export default function QualityInboundPage() {
  const records = useMemo(() => getMockInboundInspectionRecords(), []);

  const summaryCards = useMemo(() => {
    const pendingSchedule = records.filter((item) => item.scheduleStatus === '未排期').length;
    const scheduled = records.filter((item) => item.scheduleStatus === '已排期').length;
    const expedited = records.filter((item) => item.urgencyLevel === '加急').length;
    const upcomingQty = records.reduce((total, item) => total + item.expectedQuantity, 0);

    return [
      {
        label: '待排期入库单',
        value: `${pendingSchedule} 单`,
        helper: '优先关注预计 48 小时内到货批次',
        icon: CalendarClock,
        iconClassName: 'bg-warning-50 text-warning-700',
      },
      {
        label: '已排期批次',
        value: `${scheduled} 单`,
        helper: '已安排具体质检时间与人员',
        icon: UserRoundSearch,
        iconClassName: 'bg-brand-50 text-brand-700',
      },
      {
        label: '预计到货总数量',
        value: `${upcomingQty.toLocaleString()} 件`,
        helper: '用于估算本周仓库质检负荷',
        icon: PackageSearch,
        iconClassName: 'bg-success-50 text-success-700',
      },
      {
        label: '加急批次',
        value: `${expedited} 单`,
        helper: '需要优先协调质检与卸货窗口',
        icon: ShieldCheck,
        iconClassName: 'bg-danger-50 text-danger-700',
      },
    ];
  }, [records]);

  const columns = useMemo(
    () => [
      {
        key: 'inboundNo',
        title: '采购入库单号',
        width: 180,
        render: (record) => <span className="font-medium text-text">{record.inboundNo}</span>,
      },
      { key: 'purchaseOrderNo', title: '采购单号', width: 160 },
      { key: 'supplierName', title: '供应商', width: 220 },
      { key: 'warehouseName', title: '仓库', width: 180 },
      { key: 'expectedArrivalDate', title: '预计到货日期', width: 130 },
      { key: 'expectedSkuCount', title: '预计到货SKU数', width: 120 },
      {
        key: 'expectedQuantity',
        title: '预计到货总数量',
        width: 130,
        render: (record) => `${record.expectedQuantity.toLocaleString()} 件`,
      },
      {
        key: 'inspectionMode',
        title: '质检方式',
        width: 110,
        render: (record) => <StatusTag tone={inspectionToneMap[record.inspectionMode]}>{record.inspectionMode}</StatusTag>,
      },
      {
        key: 'urgencyLevel',
        title: '优先级/紧急程度',
        width: 130,
        render: (record) => <StatusTag tone={urgencyToneMap[record.urgencyLevel]}>{record.urgencyLevel}</StatusTag>,
      },
      {
        key: 'scheduleStatus',
        title: '排期状态',
        width: 110,
        render: (record) => <StatusTag tone={scheduleToneMap[record.scheduleStatus]}>{record.scheduleStatus}</StatusTag>,
      },
      {
        key: 'plannedInspectionTime',
        title: '计划质检时间',
        width: 160,
        render: (record) => record.plannedInspectionTime || <span className="text-text-subtle">待安排</span>,
      },
      {
        key: 'plannedInspector',
        title: '计划质检人员',
        width: 140,
        render: (record) => record.plannedInspector || <span className="text-text-subtle">待指派</span>,
      },
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
      title="入库质检"
      description="面向采购入库单查看预计到货、SKU 数量与排期状态，便于仓库提前安排质检人力与时间窗口。"
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
          includes('inboundNo', filters.inboundNo) &&
          includes('purchaseOrderNo', filters.purchaseOrderNo) &&
          includes('supplierName', filters.supplierName) &&
          (!filters.warehouseName || record.warehouseName === filters.warehouseName) &&
          helpers.inDateRange(record.expectedArrivalDate, filters.arrivalStart, filters.arrivalEnd) &&
          (!filters.inboundStatus || record.inboundStatus === filters.inboundStatus) &&
          (!filters.scheduleStatus || record.scheduleStatus === filters.scheduleStatus) &&
          (!filters.urgencyLevel || record.urgencyLevel === filters.urgencyLevel)
        );
      }}
      drawerTitle={(record) => `入库质检详情 · ${record.inboundNo}`}
      drawerSubtitle={(record) =>
        `${record.supplierName} · ${record.warehouseName} · 入库状态 ${record.inboundStatus}`
      }
      drawerSections={[
        {
          title: '基础信息',
          description: '用于确认本次采购入库的来源、到仓信息与联系人。',
          fields: [
            { label: '采购入库单号', key: 'inboundNo' },
            { label: '采购单号', key: 'purchaseOrderNo' },
            { label: '供应商', key: 'supplierName' },
            { label: '仓库', key: 'warehouseName' },
            { label: '预计到货日期', key: 'expectedArrivalDate' },
            { label: '运输方式', key: 'transportationMethod' },
            { label: '联系人', value: (record) => `${record.contactName} / ${record.contactPhone}` },
            {
              label: '入库状态',
              render: (record) => <StatusTag tone={inboundToneMap[record.inboundStatus]}>{record.inboundStatus}</StatusTag>,
            },
          ],
        },
        {
          title: '到货预估',
          description: '帮助质检排班时预估工作量与特殊处理要求。',
          fields: [
            { label: '预计SKU数', value: (record) => `${record.expectedSkuCount} 个` },
            { label: '预计件数', value: (record) => `${record.expectedQuantity.toLocaleString()} 件` },
            { label: '是否加急', key: 'isExpedited' },
            { label: '特殊要求', key: 'specialRequirements', span: 2 },
          ],
        },
        {
          title: '排期信息',
          description: '仅聚焦排期状态、计划时间与计划质检人员，不进入任务流转语义。',
          fields: [
            {
              label: '质检方式',
              render: (record) => <StatusTag tone={inspectionToneMap[record.inspectionMode]}>{record.inspectionMode}</StatusTag>,
            },
            { label: '计划质检时间', value: (record) => record.plannedInspectionTime || '待安排' },
            { label: '计划质检人员', value: (record) => record.plannedInspector || '待指派' },
            {
              label: '排期状态',
              render: (record) => <StatusTag tone={scheduleToneMap[record.scheduleStatus]}>{record.scheduleStatus}</StatusTag>,
            },
            { label: '排期备注', key: 'scheduleRemark', span: 2 },
          ],
        },
      ]}
      tableMinWidth={1950}
      emptyText="暂无符合条件的入库质检排期数据"
    />
  );
}

