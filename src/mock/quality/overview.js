import {
  getMockInboundInspectionRecords,
  getMockQualityTaskRecords,
  getMockQualityComplaintRecords,
} from './index';

const REFERENCE_NOW = new Date('2026-04-02T10:00:00');
const DAY_MS = 24 * 60 * 60 * 1000;

const RANGE_OPTIONS = [
  { value: '7d', label: '近7天' },
  { value: '30d', label: '近30天' },
  { value: 'month', label: '本月' },
];

const TREND_FIXTURES = {
  '7d': [
    { label: '03-27', inboundCount: 3, taskCount: 2, complaintCount: 1 },
    { label: '03-28', inboundCount: 4, taskCount: 3, complaintCount: 2 },
    { label: '03-29', inboundCount: 3, taskCount: 4, complaintCount: 2 },
    { label: '03-30', inboundCount: 5, taskCount: 3, complaintCount: 1 },
    { label: '03-31', inboundCount: 6, taskCount: 5, complaintCount: 2 },
    { label: '04-01', inboundCount: 4, taskCount: 4, complaintCount: 3 },
    { label: '04-02', inboundCount: 5, taskCount: 3, complaintCount: 2 },
  ],
  '30d': [
    { label: '03-1周', inboundCount: 18, taskCount: 11, complaintCount: 6 },
    { label: '03-2周', inboundCount: 22, taskCount: 13, complaintCount: 7 },
    { label: '03-3周', inboundCount: 20, taskCount: 15, complaintCount: 8 },
    { label: '03-4周', inboundCount: 24, taskCount: 16, complaintCount: 9 },
    { label: '04-1周', inboundCount: 17, taskCount: 12, complaintCount: 6 },
    { label: '04-2周', inboundCount: 15, taskCount: 10, complaintCount: 5 },
  ],
  month: [
    { label: '第1周', inboundCount: 15, taskCount: 10, complaintCount: 5 },
    { label: '第2周', inboundCount: 18, taskCount: 11, complaintCount: 6 },
    { label: '第3周', inboundCount: 16, taskCount: 13, complaintCount: 7 },
    { label: '第4周', inboundCount: 14, taskCount: 9, complaintCount: 4 },
  ],
};

const SEVERITY_WEIGHT = {
  轻微: 1,
  一般: 2,
  严重: 3,
  紧急: 4,
};

const URGENCY_WEIGHT = {
  常规: 1,
  紧急: 2,
  加急: 3,
};

const OPEN_TASK_STATUSES = ['待分配', '待检查', '检查中', '待处理'];
const IN_PROGRESS_TASK_STATUSES = ['待检查', '检查中', '待处理'];
const OPEN_COMPLAINT_STATUSES = ['待受理', '待分析', '追溯中', '待整改'];

function parseDate(value) {
  if (!value) return null;
  const normalized = String(value).includes('T') ? String(value) : String(value).replace(' ', 'T');
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatRate(value) {
  return `${Math.round(value * 10) / 10}%`;
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isWithinRange(date, range) {
  if (!date) return false;
  const diff = startOfDay(REFERENCE_NOW).getTime() - startOfDay(date).getTime();
  if (range === '7d') return diff >= 0 && diff <= 6 * DAY_MS;
  if (range === '30d') return diff >= 0 && diff <= 29 * DAY_MS;
  return date.getFullYear() === REFERENCE_NOW.getFullYear() && date.getMonth() === REFERENCE_NOW.getMonth();
}

function clampCount(value) {
  if (value <= 0) return 0;
  return Math.max(1, Math.round(value));
}

function getComplaintProblemCategory(record) {
  const text = `${record.issuePhenomenon} ${record.complaintType}`.toLowerCase();
  if (text.includes('破损') || text.includes('断裂')) return '破损';
  if (text.includes('外观') || text.includes('偏色') || text.includes('瑕疵')) return '外观瑕疵';
  if (text.includes('功能') || text.includes('性能') || text.includes('松动') || text.includes('断线')) return '功能异常';
  if (text.includes('少件') || text.includes('漏件')) return '少件漏件';
  if (text.includes('包装')) return '包装问题';
  return '其他';
}

function sortByRisk(items) {
  return [...items].sort((a, b) => b.score - a.score || b.issueCount - a.issueCount || a.supplierName.localeCompare(b.supplierName));
}

function buildRiskRanking(inboundRecords, taskRecords, complaintRecords) {
  const supplierMap = new Map();

  const ensureSupplier = (supplierName) => {
    if (!supplierMap.has(supplierName)) {
      supplierMap.set(supplierName, {
        supplierName,
        score: 0,
        issueCount: 0,
        inboundPressure: 0,
        taskPressure: 0,
        complaintPressure: 0,
      });
    }
    return supplierMap.get(supplierName);
  };

  inboundRecords.forEach((record) => {
    const supplier = ensureSupplier(record.supplierName);
    let score = 0;
    if (record.scheduleStatus === '未排期') score += 15;
    if (record.scheduleStatus === '已取消') score += 20;
    if (record.urgencyLevel === '紧急') score += 12;
    if (record.urgencyLevel === '加急') score += 18;
    supplier.score += score;
    supplier.issueCount += score > 0 ? 1 : 0;
    supplier.inboundPressure += score;
  });

  taskRecords.forEach((record) => {
    const supplier = ensureSupplier(record.supplierName);
    let score = 0;
    if (OPEN_TASK_STATUSES.includes(record.taskStatus)) score += 10;
    if (record.taskStatus === '检查中') score += 6;
    if (record.taskStatus === '待处理') score += 16;
    const dueDate = parseDate(record.dueAt);
    if (dueDate && dueDate.getTime() < REFERENCE_NOW.getTime() && record.taskStatus !== '已完成' && record.taskStatus !== '已关闭') {
      score += 18;
    }
    supplier.score += score;
    supplier.issueCount += score > 0 ? 1 : 0;
    supplier.taskPressure += score;
  });

  complaintRecords.forEach((record) => {
    const supplier = ensureSupplier(record.supplierName);
    let score = 0;
    if (OPEN_COMPLAINT_STATUSES.includes(record.complaintStatus)) score += 14;
    score += SEVERITY_WEIGHT[record.severityLevel] * 6;
    if (record.traceableToSupplier === '是') score += 18;
    if (record.responsibilityJudgement === '供应商责任') score += 22;
    if (record.repeatedSameBatch === '是') score += 10;
    supplier.score += score;
    supplier.issueCount += 1;
    supplier.complaintPressure += score;
  });

  return sortByRisk(Array.from(supplierMap.values())).slice(0, 5).map((item) => ({
    ...item,
    riskLevel: item.score >= 70 ? '高风险' : item.score >= 40 ? '中风险' : '关注',
    summary: `入库 ${item.inboundPressure} / 任务 ${item.taskPressure} / 客诉 ${item.complaintPressure}`,
  }));
}

function buildSkuBatchRanking(taskRecords, complaintRecords) {
  const batchMap = new Map();

  const pushItem = ({ supplierName, sku, productName, batchNo, score, source }) => {
    const key = `${sku}-${batchNo}`;
    if (!batchMap.has(key)) {
      batchMap.set(key, {
        sku,
        productName,
        batchNo,
        supplierName,
        score: 0,
        occurrences: 0,
        sources: new Set(),
      });
    }
    const item = batchMap.get(key);
    item.score += score;
    item.occurrences += 1;
    item.sources.add(source);
  };

  taskRecords.forEach((record) => {
    const score = record.taskStatus === '待处理' ? 22 : record.taskStatus === '检查中' ? 16 : 12;
    pushItem({
      supplierName: record.supplierName,
      sku: record.sku,
      productName: record.productName,
      batchNo: record.batchNo,
      score,
      source: '质量任务',
    });
  });

  complaintRecords.forEach((record) => {
    const score =
      SEVERITY_WEIGHT[record.severityLevel] * 8 +
      (record.repeatedSameBatch === '是' ? 12 : 4) +
      (record.traceableToSupplier === '是' ? 8 : 0);
    pushItem({
      supplierName: record.supplierName,
      sku: record.sku,
      productName: record.productName,
      batchNo: record.productionBatchNo,
      score,
      source: '客诉追溯',
    });
  });

  return Array.from(batchMap.values())
    .sort((a, b) => b.score - a.score || b.occurrences - a.occurrences)
    .slice(0, 5)
    .map((item) => ({
      ...item,
      sources: Array.from(item.sources),
      riskLevel: item.score >= 40 ? '高发' : item.score >= 25 ? '重复发生' : '关注',
    }));
}

function buildTrendSeries(range, inboundFactor, taskFactor, complaintFactor) {
  return TREND_FIXTURES[range].map((item) => ({
    label: item.label,
    inboundCount: clampCount(item.inboundCount * inboundFactor),
    taskCount: clampCount(item.taskCount * taskFactor),
    complaintCount: clampCount(item.complaintCount * complaintFactor),
  }));
}

function buildComplaintTypeDistribution(complaintRecords) {
  const categoryOrder = ['破损', '外观瑕疵', '功能异常', '少件漏件', '包装问题', '其他'];
  const counts = Object.fromEntries(categoryOrder.map((item) => [item, 0]));

  complaintRecords.forEach((record) => {
    const category = getComplaintProblemCategory(record);
    counts[category] += 1;
  });

  return categoryOrder.map((name) => ({ name, value: counts[name] }));
}

function getRangeComparisonLabel(range) {
  if (range === '7d') return '较前7天';
  if (range === '30d') return '较前30天';
  return '较上月同期';
}

function buildMetrics({ inboundRecords, taskRecords, complaintRecords, riskRanking, repeatProblemCount, range }) {
  const comparisonLabel = getRangeComparisonLabel(range);
  const pendingInboundCount = inboundRecords.filter((item) => item.scheduleStatus === '未排期').length;
  const todayInboundQty = inboundRecords
    .filter((item) => item.expectedArrivalDate === '2026-04-02')
    .reduce((total, item) => total + item.expectedQuantity, 0);
  const activeTaskCount = taskRecords.filter((item) => IN_PROGRESS_TASK_STATUSES.includes(item.taskStatus)).length;
  const overdueTaskCount = taskRecords.filter((item) => {
    if (!OPEN_TASK_STATUSES.includes(item.taskStatus)) return false;
    const dueDate = parseDate(item.dueAt);
    return dueDate && dueDate.getTime() < REFERENCE_NOW.getTime();
  }).length;
  const weeklyComplaintCount = complaintRecords.filter((item) => {
    const feedbackAt = parseDate(item.feedbackAt);
    return feedbackAt && isWithinRange(feedbackAt, '7d');
  }).length;
  const monthlyClosedComplaints = complaintRecords.filter((item) => item.complaintStatus === '已完成' || item.complaintStatus === '已关闭').length;
  const monthlyClosureRate = complaintRecords.length === 0 ? 0 : (monthlyClosedComplaints / complaintRecords.length) * 100;
  const highRiskSupplierCount = riskRanking.filter((item) => item.score >= 70).length;

  return [
    {
      id: 'pendingInbound',
      label: '待排期入库质检单数',
      value: `${pendingInboundCount} 单`,
      trend: `${comparisonLabel} ${pendingInboundCount >= 2 ? '+2 单' : '+1 单'}`,
      helper: pendingInboundCount >= 2 ? '主要集中在高优先级到货批次' : '当前排期压力可控',
      tone: pendingInboundCount >= 2 ? 'warning' : 'primary',
    },
    {
      id: 'todayInboundQty',
      label: '今日预计入库数量',
      value: `${todayInboundQty.toLocaleString()} 件`,
      trend: `${comparisonLabel} +18%`,
      helper: '用于估算今日仓库质检负荷',
      tone: 'primary',
    },
    {
      id: 'activeTasks',
      label: '进行中的质量检查任务数',
      value: `${activeTaskCount} 单`,
      trend: `${comparisonLabel} ${activeTaskCount >= 3 ? '+1 单' : '持平'}`,
      helper: '含待检查、检查中、待处理任务',
      tone: 'primary',
    },
    {
      id: 'overdueTasks',
      label: '超期未完成任务数',
      value: `${overdueTaskCount} 单`,
      trend: `${comparisonLabel} ${overdueTaskCount > 0 ? '+1 单' : '持平'}`,
      helper: overdueTaskCount > 0 ? '建议优先推动异常处理' : '当前无超期压力',
      tone: overdueTaskCount > 0 ? 'danger' : 'success',
    },
    {
      id: 'weeklyComplaints',
      label: '本周客诉质量单数',
      value: `${weeklyComplaintCount} 单`,
      trend: `${comparisonLabel} +2 单`,
      helper: '客户反馈正持续转化为质量追溯线索',
      tone: weeklyComplaintCount >= 3 ? 'warning' : 'primary',
    },
    {
      id: 'closureRate',
      label: '本月客诉闭环率',
      value: formatRate(monthlyClosureRate),
      trend: `${comparisonLabel} ${monthlyClosureRate >= 30 ? '+6.5%' : '-4.2%'}`,
      helper: monthlyClosureRate >= 30 ? '闭环节奏稳定' : '需关注整改验证效率',
      tone: monthlyClosureRate >= 30 ? 'success' : 'warning',
    },
    {
      id: 'highRiskSuppliers',
      label: '高风险供应商数',
      value: `${highRiskSupplierCount} 家`,
      trend: `${comparisonLabel} ${highRiskSupplierCount > 0 ? '+1 家' : '持平'}`,
      helper: '综合入库、任务、客诉三类压力得出',
      tone: highRiskSupplierCount > 0 ? 'danger' : 'success',
    },
    {
      id: 'repeatProblemBatch',
      label: '重复发生问题批次数',
      value: `${repeatProblemCount} 批`,
      trend: `${comparisonLabel} +1 批`,
      helper: '建议优先联动采购与供应商复盘',
      tone: repeatProblemCount >= 2 ? 'danger' : 'warning',
    },
  ];
}

function buildTodoPanels({ inboundRecords, taskRecords, complaintRecords, riskRanking }) {
  const pendingInboundItems = [...inboundRecords]
    .filter((item) => item.scheduleStatus === '未排期')
    .sort((a, b) => {
      const urgencyDiff = URGENCY_WEIGHT[b.urgencyLevel] - URGENCY_WEIGHT[a.urgencyLevel];
      if (urgencyDiff !== 0) return urgencyDiff;
      return String(a.expectedArrivalDate).localeCompare(String(b.expectedArrivalDate));
    })
    .slice(0, 4)
    .map((item) => ({
      id: item.id,
      title: `${item.inboundNo} · ${item.supplierName}`,
      meta: `${item.expectedArrivalDate} 到货 · ${item.expectedQuantity.toLocaleString()} 件 · ${item.warehouseName}`,
      status: item.scheduleStatus,
      tone: item.urgencyLevel === '加急' ? 'danger' : item.urgencyLevel === '紧急' ? 'warning' : 'primary',
      tag: item.urgencyLevel,
      path: '/quality/inbound',
      pathName: '入库质检',
    }));

  const expiringTaskItems = [...taskRecords]
    .filter((item) => OPEN_TASK_STATUSES.includes(item.taskStatus))
    .sort((a, b) => {
      const aDate = parseDate(a.dueAt);
      const bDate = parseDate(b.dueAt);
      return (aDate?.getTime() || 0) - (bDate?.getTime() || 0);
    })
    .slice(0, 4)
    .map((item) => {
      const dueDate = parseDate(item.dueAt);
      const isOverdue = dueDate && dueDate.getTime() < REFERENCE_NOW.getTime();
      return {
        id: item.id,
        title: `${item.taskNo} · ${item.taskTitle}`,
        meta: `${item.owner || '待分配'} · 截止 ${item.dueAt} · ${item.supplierName}`,
        status: item.taskStatus,
        tone: isOverdue ? 'danger' : 'warning',
        tag: isOverdue ? '已超期' : '临近截止',
        path: '/quality/tasks',
        pathName: '质量检查任务',
      };
    });

  const tracingComplaintItems = [...complaintRecords]
    .filter((item) => OPEN_COMPLAINT_STATUSES.includes(item.complaintStatus))
    .sort((a, b) => SEVERITY_WEIGHT[b.severityLevel] - SEVERITY_WEIGHT[a.severityLevel])
    .slice(0, 4)
    .map((item) => ({
      id: item.id,
      title: `${item.complaintNo} · ${item.complaintTitle}`,
      meta: `${item.customerName} · ${item.supplierName} · ${item.productionBatchNo}`,
      status: item.complaintStatus,
      tone: item.responsibilityJudgement === '供应商责任' ? 'danger' : 'warning',
      tag: item.severityLevel,
      path: '/quality/complaint',
      pathName: '客诉质量',
    }));

  const highRiskItems = riskRanking.slice(0, 4).map((item, index) => ({
    id: `${item.supplierName}-${index}`,
    title: `${item.supplierName} 风险得分 ${item.score}`,
    meta: `${item.summary} · ${item.issueCount} 个关联问题`,
    status: item.riskLevel,
    tone: item.riskLevel === '高风险' ? 'danger' : item.riskLevel === '中风险' ? 'warning' : 'primary',
    tag: item.riskLevel,
    path: '/quality/complaint',
    pathName: '客诉质量',
  }));

  return [
    {
      id: 'inbound',
      title: '待处理入库质检排期',
      subtitle: '前置发现与排期，确保预计到货波次有人有时间。',
      actionLabel: '前往入库质检',
      actionPath: '/quality/inbound',
      actionName: '入库质检',
      items: pendingInboundItems,
    },
    {
      id: 'tasks',
      title: '即将超期的质量检查任务',
      subtitle: '聚焦临近截止或已超期的抽检 / 全检任务。',
      actionLabel: '前往质量任务',
      actionPath: '/quality/tasks',
      actionName: '质量检查任务',
      items: expiringTaskItems,
    },
    {
      id: 'complaints',
      title: '待分析 / 追溯中的客诉质量单',
      subtitle: '客户反馈正推动订单、批次与供应商追溯。',
      actionLabel: '前往客诉质量',
      actionPath: '/quality/complaint',
      actionName: '客诉质量',
      items: tracingComplaintItems,
    },
    {
      id: 'risks',
      title: '最近新增高风险问题',
      subtitle: '综合三类质量事件识别当前最需要升级处理的风险。',
      actionLabel: '前往客诉质量',
      actionPath: '/quality/complaint',
      actionName: '客诉质量',
      items: highRiskItems,
    },
  ];
}

function buildModuleEntrances({ pendingInboundCount, activeTaskCount, activeComplaintCount }) {
  return [
    {
      id: 'inbound',
      title: '入库质检',
      description: '采购入库前置发现与排期中心，聚焦预计到货、计划时间和人员安排。',
      stat: `${pendingInboundCount} 单待排期`,
      helper: '先把来料风险挡在入库前',
      path: '/quality/inbound',
      pathName: '入库质检',
      tone: 'primary',
    },
    {
      id: 'tasks',
      title: '质量检查任务',
      description: '承接非入库场景的抽检 / 全检任务，关注负责人、进度和截止时间。',
      stat: `${activeTaskCount} 单处理中`,
      helper: '把问题推进到明确的执行动作',
      path: '/quality/tasks',
      pathName: '质量检查任务',
      tone: 'warning',
    },
    {
      id: 'complaint',
      title: '客诉质量',
      description: '从客户反馈倒查订单、批次和供应商，沉淀责任判定与整改闭环。',
      stat: `${activeComplaintCount} 单未闭环`,
      helper: '让客户反馈反推质量优化',
      path: '/quality/complaint',
      pathName: '客诉质量',
      tone: 'danger',
    },
  ];
}

export function getMockQualityOverviewData({ range = '30d', warehouse = '', supplier = '' } = {}) {
  const allInboundRecords = getMockInboundInspectionRecords();
  const allTaskRecords = getMockQualityTaskRecords();
  const allComplaintRecords = getMockQualityComplaintRecords();

  const inboundRecords = allInboundRecords.filter((item) => {
    if (supplier && item.supplierName !== supplier) return false;
    if (warehouse && item.warehouseName !== warehouse) return false;
    return true;
  });

  const taskRecords = allTaskRecords.filter((item) => {
    if (supplier && item.supplierName !== supplier) return false;
    return true;
  });

  const complaintRecords = allComplaintRecords.filter((item) => {
    if (supplier && item.supplierName !== supplier) return false;
    if (warehouse && item.shipWarehouse !== warehouse) return false;
    return true;
  });

  const riskRanking = buildRiskRanking(inboundRecords, taskRecords, complaintRecords);
  const skuBatchRiskRanking = buildSkuBatchRanking(taskRecords, complaintRecords);
  const repeatProblemCount = new Set(
    complaintRecords
      .filter((item) => item.repeatedSameBatch === '是')
      .map((item) => item.productionBatchNo)
  ).size;

  const metrics = buildMetrics({
    inboundRecords,
    taskRecords,
    complaintRecords,
    riskRanking,
    repeatProblemCount,
    range,
  });

  const inboundFactor = allInboundRecords.length === 0 ? 0 : inboundRecords.length / allInboundRecords.length;
  const taskFactor = allTaskRecords.length === 0 ? 0 : taskRecords.length / allTaskRecords.length;
  const complaintFactor = allComplaintRecords.length === 0 ? 0 : complaintRecords.length / allComplaintRecords.length;

  const sourceDistribution = [
    {
      name: '入库异常',
      value: inboundRecords.filter((item) => item.scheduleStatus === '未排期' || item.scheduleStatus === '已取消').length,
    },
    {
      name: '非入库检查',
      value: taskRecords.filter((item) => OPEN_TASK_STATUSES.includes(item.taskStatus)).length,
    },
    {
      name: '客诉反馈',
      value: complaintRecords.filter((item) => OPEN_COMPLAINT_STATUSES.includes(item.complaintStatus)).length,
    },
  ];

  const todoPanels = buildTodoPanels({
    inboundRecords,
    taskRecords,
    complaintRecords,
    riskRanking,
  });

  const activeTaskCount = taskRecords.filter((item) => IN_PROGRESS_TASK_STATUSES.includes(item.taskStatus)).length;
  const activeComplaintCount = complaintRecords.filter((item) => OPEN_COMPLAINT_STATUSES.includes(item.complaintStatus)).length;
  const pendingInboundCount = inboundRecords.filter((item) => item.scheduleStatus === '未排期').length;

  return {
    metrics,
    trendSeries: buildTrendSeries(range, inboundFactor || 1, taskFactor || 1, complaintFactor || 1),
    sourceDistribution,
    supplierRiskRanking: riskRanking,
    skuBatchRiskRanking,
    complaintTypeDistribution: buildComplaintTypeDistribution(complaintRecords),
    todoPanels,
    moduleEntrances: buildModuleEntrances({
      pendingInboundCount,
      activeTaskCount,
      activeComplaintCount,
    }),
    filterOptions: {
      ranges: RANGE_OPTIONS,
      warehouses: Array.from(
        new Set([...allInboundRecords.map((item) => item.warehouseName), ...allComplaintRecords.map((item) => item.shipWarehouse)])
      )
        .filter(Boolean)
        .sort(),
      suppliers: Array.from(
        new Set([...allInboundRecords, ...allTaskRecords, ...allComplaintRecords].map((item) => item.supplierName))
      )
        .filter(Boolean)
        .sort(),
    },
    summary: {
      inboundCount: inboundRecords.length,
      taskCount: taskRecords.length,
      complaintCount: complaintRecords.length,
      riskSupplierCount: riskRanking.filter((item) => item.score >= 70).length,
    },
  };
}
