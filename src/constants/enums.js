/**
 * 状态枚举集中定义（原型阶段）。
 * 覆盖：审批 / 项目 / 供应商 / 物流审批 / 质检任务 / 质检结果 / 通用启停。
 *
 * 提供：
 *   - 各业务状态常量（如 APPROVAL_STATUS.APPROVED）
 *   - getStatusLabel(type, value)    → 返回中文标签
 *   - getStatusVariant(type, value)  → 返回 Badge 的 tone（与 components/ui/Badge 对齐）
 *
 * Badge tone 取值范围：'neutral' | 'primary' | 'success' | 'warning' | 'danger'
 *
 * 注意：
 *   - 本文件不强行覆盖全仓所有状态，先覆盖最常用的几类，便于后续 Badge / 状态标签统一
 *   - 未匹配的 type / value 走兜底分支：label 返回原值，variant 返回 'neutral'
 */

/** 审批状态（通用审批流） */
export const APPROVAL_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  COMPLETED: 'completed',
  CANCELED: 'canceled',
};

/** 项目状态 */
export const PROJECT_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  PAUSED: 'paused',
  DELAYED: 'delayed',
  CANCELED: 'canceled',
};

/** 供应商状态 */
export const SUPPLIER_STATUS = {
  ENABLED: 'enabled',
  DISABLED: 'disabled',
  BLACKLIST: 'blacklist',
};

/** 物流业务对象审批状态（物流商 / 渠道 / 申报资料 等） */
export const LOGISTICS_APPROVAL_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

/** 入库质检排期状态 */
export const QUALITY_TASK_STATUS = {
  PENDING: 'pending',          // 未排期
  SCHEDULED: 'scheduled',      // 已排期
  IN_PROGRESS: 'in_progress',  // 检验中
  COMPLETED: 'completed',      // 已完成
  CANCELED: 'canceled',        // 已取消
};

/** 入库质检结果 */
export const QUALITY_RESULT = {
  PASS: 'pass',
  FAIL: 'fail',
  PARTIAL: 'partial',
};

/** 通用启停状态 */
export const COMMON_ENABLED = {
  ENABLED: 'enabled',
  DISABLED: 'disabled',
};

/* ----------------- 标签映射 ----------------- */

const LABEL_MAP = {
  approval: {
    pending: '待审批',
    in_progress: '审批中',
    approved: '已通过',
    rejected: '已驳回',
    completed: '已完成',
    canceled: '已取消',
  },
  project: {
    pending: '未开始',
    in_progress: '进行中',
    completed: '已完成',
    paused: '已暂停',
    delayed: '已延期',
    canceled: '已取消',
  },
  supplier: {
    enabled: '合作中',
    disabled: '已停用',
    blacklist: '黑名单',
  },
  logistics_approval: {
    draft: '草稿',
    pending: '待审批',
    approved: '已通过',
    rejected: '已驳回',
  },
  quality_task: {
    pending: '未排期',
    scheduled: '已排期',
    in_progress: '检验中',
    completed: '已完成',
    canceled: '已取消',
  },
  quality_result: {
    pass: '合格',
    fail: '不合格',
    partial: '部分合格',
  },
  common: {
    enabled: '启用',
    disabled: '停用',
  },
};

/* ----------------- 视觉映射（与 Badge tone 对齐） ----------------- */

const VARIANT_MAP = {
  approval: {
    pending: 'warning',
    in_progress: 'primary',
    approved: 'success',
    rejected: 'danger',
    completed: 'success',
    canceled: 'neutral',
  },
  project: {
    pending: 'neutral',
    in_progress: 'primary',
    completed: 'success',
    paused: 'warning',
    delayed: 'danger',
    canceled: 'neutral',
  },
  supplier: {
    enabled: 'success',
    disabled: 'neutral',
    blacklist: 'danger',
  },
  logistics_approval: {
    draft: 'neutral',
    pending: 'warning',
    approved: 'success',
    rejected: 'danger',
  },
  quality_task: {
    pending: 'neutral',
    scheduled: 'primary',
    in_progress: 'warning',
    completed: 'success',
    canceled: 'neutral',
  },
  quality_result: {
    pass: 'success',
    fail: 'danger',
    partial: 'warning',
  },
  common: {
    enabled: 'success',
    disabled: 'neutral',
  },
};

/** 类型别名：让调用方写 'approval_status' 也能命中 'approval' */
const ALIAS = {
  approval_status: 'approval',
  project_status: 'project',
  supplier_status: 'supplier',
  logistics_approval_status: 'logistics_approval',
  quality_task_status: 'quality_task',
  quality_result_status: 'quality_result',
  common_enabled: 'common',
  enabled: 'common',
};

const resolveType = (type) => (type && ALIAS[type]) || type;

/**
 * 取状态文案。
 * getStatusLabel('approval', 'approved') → '已通过'
 * getStatusLabel('approval', '未知值')   → '未知值'   // 不抛错，返回原值便于排查
 * getStatusLabel('未知 type', 'x')       → 'x'
 */
export function getStatusLabel(type, value) {
  if (value === null || value === undefined || value === '') return '-';
  const t = resolveType(type);
  const map = LABEL_MAP[t];
  if (!map) return String(value);
  return map[value] || String(value);
}

/**
 * 取状态视觉 tone（与 Badge tone 一致：neutral/primary/success/warning/danger）。
 * getStatusVariant('approval', 'approved') → 'success'
 * 未匹配返回 'neutral'。
 */
export function getStatusVariant(type, value) {
  if (value === null || value === undefined || value === '') return 'neutral';
  const t = resolveType(type);
  const map = VARIANT_MAP[t];
  if (!map) return 'neutral';
  return map[value] || 'neutral';
}

const enums = {
  APPROVAL_STATUS,
  PROJECT_STATUS,
  SUPPLIER_STATUS,
  LOGISTICS_APPROVAL_STATUS,
  QUALITY_TASK_STATUS,
  QUALITY_RESULT,
  COMMON_ENABLED,
  getStatusLabel,
  getStatusVariant,
};

export default enums;
