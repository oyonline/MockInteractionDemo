// src/pages/product/ProductAttributePage.js
// 属性管理页面 - 产品中心基础配置核心功能
import React, { useMemo, useState } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  Download,
  Upload,
  Tag,
  List,
  Hash,
  Type,
  Calendar,
  ToggleLeft,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  Copy,
  AlertCircle,
  Check,
  Database,
  Layers3,
  Eye,
  Package2,
  Clock3,
} from 'lucide-react';
import cn from '../../utils/cn';

const TODAY = new Date().toISOString().split('T')[0];

// --------------- 属性类型配置 ---------------
const ATTRIBUTE_TYPES = [
  { id: 'text', name: '文本', icon: Type, description: '单行文本输入', hasOptions: false },
  { id: 'textarea', name: '多行文本', icon: List, description: '多行文本输入', hasOptions: false },
  { id: 'number', name: '数字', icon: Hash, description: '数值输入，支持单位', hasOptions: false },
  { id: 'single_select', name: '单选', icon: CheckSquare, description: '单选下拉列表', hasOptions: true },
  { id: 'multi_select', name: '多选', icon: CheckSquare, description: '多选复选框', hasOptions: true },
  { id: 'date', name: '日期', icon: Calendar, description: '日期选择器', hasOptions: false },
  { id: 'boolean', name: '是/否', icon: ToggleLeft, description: '布尔值开关', hasOptions: false },
];

// --------------- 属性分组配置 ---------------
const ATTRIBUTE_GROUPS = [
  { id: 'basic', name: '基础属性', description: '品牌、材质、产地与市场范围等基础建档字段', color: 'blue' },
  { id: 'spec', name: '规格属性', description: '尺寸、重量、电压等产品规格参数', color: 'green' },
  { id: 'sales', name: '销售属性', description: '直接影响 SKU 组合与前台售卖表达', color: 'purple' },
  { id: 'logistics', name: '物流属性', description: '运输、清关与危险品识别所需字段', color: 'orange' },
  { id: 'quality', name: '质量属性', description: '质保与质检过程使用的质量字段', color: 'red' },
];

const GROUP_COLOR_STYLES = {
  blue: {
    bar: 'bg-brand-500',
    badge: 'bg-brand-50 text-brand-700 border-brand-100',
  },
  green: {
    bar: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  },
  purple: {
    bar: 'bg-violet-500',
    badge: 'bg-violet-50 text-violet-700 border-violet-100',
  },
  orange: {
    bar: 'bg-amber-500',
    badge: 'bg-amber-50 text-amber-700 border-amber-100',
  },
  red: {
    bar: 'bg-rose-500',
    badge: 'bg-rose-50 text-rose-700 border-rose-100',
  },
};

// --------------- 属性数据（包含选项的简写编码） ---------------
const initialAttributes = [
  {
    id: '1',
    code: 'BRAND',
    name: '品牌',
    shortCode: 'BR',
    groupId: 'basic',
    type: 'single_select',
    required: true,
    isActive: true,
    unit: '',
    refCount: 1482,
    description: '产品所属品牌，影响主数据归属与 SKU 编码拼接。',
    options: [
      { id: '1-opt-1', value: 'KastKing', code: 'KK', isActive: true, sort: 1 },
      { id: '1-opt-2', value: 'Piscifun', code: 'PF', isActive: true, sort: 2 },
      { id: '1-opt-3', value: 'iRUNCL', code: 'IR', isActive: true, sort: 3 },
      { id: '1-opt-4', value: '自有品牌', code: 'OWN', isActive: true, sort: 4 },
    ],
    createdAt: '2024-01-10',
    updatedAt: '2025-03-28',
  },
  {
    id: '2',
    code: 'MATERIAL',
    name: '材质',
    shortCode: 'MT',
    groupId: 'basic',
    type: 'multi_select',
    required: false,
    isActive: true,
    unit: '',
    refCount: 936,
    description: '记录主材与辅材组合，用于详情页卖点表达与供应链识别。',
    options: [
      { id: '2-opt-1', value: '碳纤维', code: 'CF', isActive: true, sort: 1 },
      { id: '2-opt-2', value: '石墨复合', code: 'GC', isActive: true, sort: 2 },
      { id: '2-opt-3', value: '铝合金', code: 'AL', isActive: true, sort: 3 },
      { id: '2-opt-4', value: 'EVA', code: 'EVA', isActive: true, sort: 4 },
      { id: '2-opt-5', value: '尼龙', code: 'NY', isActive: true, sort: 5 },
      { id: '2-opt-6', value: 'PE 编织', code: 'PE', isActive: true, sort: 6 },
      { id: '2-opt-7', value: 'ABS 塑料', code: 'ABS', isActive: false, sort: 7 },
    ],
    createdAt: '2024-01-12',
    updatedAt: '2025-02-11',
  },
  {
    id: '3',
    code: 'ORIGIN_COUNTRY',
    name: '产地',
    shortCode: 'OC',
    groupId: 'basic',
    type: 'single_select',
    required: false,
    isActive: true,
    unit: '',
    refCount: 684,
    description: '供应链归属产地，用于报关、标签和供应商协同。',
    options: [
      { id: '3-opt-1', value: '中国', code: 'CN', isActive: true, sort: 1 },
      { id: '3-opt-2', value: '越南', code: 'VN', isActive: true, sort: 2 },
      { id: '3-opt-3', value: '泰国', code: 'TH', isActive: true, sort: 3 },
      { id: '3-opt-4', value: '马来西亚', code: 'MY', isActive: true, sort: 4 },
    ],
    createdAt: '2024-01-20',
    updatedAt: '2024-12-09',
  },
  {
    id: '4',
    code: 'MARKET_REGION',
    name: '销售区域',
    shortCode: 'MR',
    groupId: 'basic',
    type: 'single_select',
    required: true,
    isActive: true,
    unit: '',
    refCount: 1264,
    description: '定义当前属性适用的销售市场，用于渠道建档与 listing 初始化。',
    options: [
      { id: '4-opt-1', value: '北美', code: 'US', isActive: true, sort: 1 },
      { id: '4-opt-2', value: '欧洲', code: 'EU', isActive: true, sort: 2 },
      { id: '4-opt-3', value: '日本', code: 'JP', isActive: true, sort: 3 },
      { id: '4-opt-4', value: '东南亚', code: 'SEA', isActive: true, sort: 4 },
      { id: '4-opt-5', value: '中国', code: 'CN', isActive: true, sort: 5 },
      { id: '4-opt-6', value: '拉美', code: 'LATAM', isActive: false, sort: 6 },
    ],
    createdAt: '2024-03-04',
    updatedAt: '2025-03-14',
  },
  {
    id: '5',
    code: 'WEIGHT',
    name: '重量',
    shortCode: 'WT',
    groupId: 'spec',
    type: 'number',
    required: true,
    isActive: true,
    unit: 'g',
    refCount: 1530,
    description: '产品净重，常用于包装测算与物流试算。',
    options: [],
    createdAt: '2024-01-10',
    updatedAt: '2025-01-21',
  },
  {
    id: '6',
    code: 'VOLTAGE',
    name: '电压',
    shortCode: 'VLT',
    groupId: 'spec',
    type: 'single_select',
    required: false,
    isActive: true,
    unit: '',
    refCount: 238,
    description: '适用于带电机或电子功能产品的工作电压配置。',
    options: [
      { id: '6-opt-1', value: '110V', code: '110', isActive: true, sort: 1 },
      { id: '6-opt-2', value: '220V', code: '220', isActive: true, sort: 2 },
      { id: '6-opt-3', value: '110V-220V', code: 'UNI', isActive: true, sort: 3 },
      { id: '6-opt-4', value: '12V', code: '12', isActive: true, sort: 4 },
    ],
    createdAt: '2024-02-05',
    updatedAt: '2024-10-16',
  },
  {
    id: '7',
    code: 'COLOR',
    name: '颜色',
    shortCode: 'CLR',
    groupId: 'sales',
    type: 'multi_select',
    required: true,
    isActive: true,
    unit: '',
    refCount: 1310,
    description: '销售端展示颜色，直接参与 SKU 拆分。',
    options: [
      { id: '7-opt-1', value: '黑色', code: 'BK', isActive: true, sort: 1 },
      { id: '7-opt-2', value: '白色', code: 'WH', isActive: true, sort: 2 },
      { id: '7-opt-3', value: '蓝色', code: 'BL', isActive: true, sort: 3 },
      { id: '7-opt-4', value: '红色', code: 'RD', isActive: true, sort: 4 },
      { id: '7-opt-5', value: '军绿色', code: 'AG', isActive: true, sort: 5 },
      { id: '7-opt-6', value: '沙漠卡其', code: 'KH', isActive: true, sort: 6 },
      { id: '7-opt-7', value: '透明', code: 'CL', isActive: false, sort: 7 },
    ],
    createdAt: '2024-01-10',
    updatedAt: '2025-03-10',
  },
  {
    id: '8',
    code: 'MODEL_SIZE',
    name: '型号规格',
    shortCode: 'MS',
    groupId: 'sales',
    type: 'multi_select',
    required: true,
    isActive: true,
    unit: '',
    refCount: 872,
    description: '适用于渔线轮、钓箱等产品的型号档位配置。',
    options: [
      { id: '8-opt-1', value: '1000型', code: '10', isActive: true, sort: 1 },
      { id: '8-opt-2', value: '2000型', code: '20', isActive: true, sort: 2 },
      { id: '8-opt-3', value: '3000型', code: '30', isActive: true, sort: 3 },
      { id: '8-opt-4', value: '4000型', code: '40', isActive: true, sort: 4 },
      { id: '8-opt-5', value: '5000型', code: '50', isActive: true, sort: 5 },
      { id: '8-opt-6', value: '6000型', code: '60', isActive: false, sort: 6 },
    ],
    createdAt: '2024-04-18',
    updatedAt: '2025-03-01',
  },
  {
    id: '9',
    code: 'STYLE',
    name: '款式',
    shortCode: 'STY',
    groupId: 'sales',
    type: 'single_select',
    required: false,
    isActive: true,
    unit: '',
    refCount: 612,
    description: '用于标识基础款、升级款和套装版等售卖版本。',
    options: [
      { id: '9-opt-1', value: '基础款', code: 'BS', isActive: true, sort: 1 },
      { id: '9-opt-2', value: '升级款', code: 'UP', isActive: true, sort: 2 },
      { id: '9-opt-3', value: '礼盒装', code: 'GF', isActive: true, sort: 3 },
      { id: '9-opt-4', value: '限定配色', code: 'LE', isActive: true, sort: 4 },
    ],
    createdAt: '2024-05-06',
    updatedAt: '2025-01-06',
  },
  {
    id: '10',
    code: 'PACKAGE_QTY',
    name: '包装数量',
    shortCode: 'PKQ',
    groupId: 'sales',
    type: 'single_select',
    required: false,
    isActive: false,
    unit: '',
    refCount: 134,
    description: '用于配件类商品的一件装、多件装销售组合配置，当前已逐步停用。',
    options: [
      { id: '10-opt-1', value: '单只装', code: '1P', isActive: true, sort: 1 },
      { id: '10-opt-2', value: '双只装', code: '2P', isActive: true, sort: 2 },
      { id: '10-opt-3', value: '三只装', code: '3P', isActive: true, sort: 3 },
      { id: '10-opt-4', value: '五只装', code: '5P', isActive: false, sort: 4 },
    ],
    createdAt: '2024-02-12',
    updatedAt: '2024-11-30',
  },
  {
    id: '11',
    code: 'BATTERY_INCLUDED',
    name: '含电池',
    shortCode: 'BAT',
    groupId: 'logistics',
    type: 'boolean',
    required: true,
    isActive: true,
    unit: '',
    refCount: 1186,
    description: '判断是否涉及带电运输、仓储与清关额外要求。',
    options: [],
    createdAt: '2024-01-10',
    updatedAt: '2025-02-18',
  },
  {
    id: '12',
    code: 'BATTERY_TYPE',
    name: '电池类型',
    shortCode: 'BTY',
    groupId: 'logistics',
    type: 'single_select',
    required: false,
    isActive: true,
    unit: '',
    refCount: 264,
    description: '仅在带电产品中启用，用于物流线路与申报模板匹配。',
    options: [
      { id: '12-opt-1', value: '无电池', code: 'NO', isActive: true, sort: 1 },
      { id: '12-opt-2', value: '干电池', code: 'DRY', isActive: true, sort: 2 },
      { id: '12-opt-3', value: '锂电池', code: 'LI', isActive: true, sort: 3 },
      { id: '12-opt-4', value: '内置锂电池', code: 'BLI', isActive: true, sort: 4 },
      { id: '12-opt-5', value: '镍氢电池', code: 'NIMH', isActive: false, sort: 5 },
    ],
    createdAt: '2024-02-01',
    updatedAt: '2025-03-18',
  },
  {
    id: '13',
    code: 'WARRANTY_PERIOD',
    name: '质保期',
    shortCode: 'WRY',
    groupId: 'quality',
    type: 'single_select',
    required: false,
    isActive: true,
    unit: '',
    refCount: 907,
    description: '售后服务与详情页说明使用的质保期限配置。',
    options: [
      { id: '13-opt-1', value: '无质保', code: 'NO', isActive: true, sort: 1 },
      { id: '13-opt-2', value: '3个月', code: '3M', isActive: true, sort: 2 },
      { id: '13-opt-3', value: '6个月', code: '6M', isActive: true, sort: 3 },
      { id: '13-opt-4', value: '1年', code: '1Y', isActive: true, sort: 4 },
      { id: '13-opt-5', value: '2年', code: '2Y', isActive: true, sort: 5 },
    ],
    createdAt: '2024-01-20',
    updatedAt: '2025-01-28',
  },
];

// --------------- 轻量级 UI 组件 ---------------
const IconButton = ({ icon: Icon, onClick, className, title, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={cn(
      'inline-flex h-9 w-9 items-center justify-center rounded-xl border border-transparent text-text-subtle transition-colors',
      disabled
        ? 'cursor-not-allowed opacity-40'
        : 'hover:border-border hover:bg-surface-subtle hover:text-text',
      className
    )}
  >
    <Icon className="h-4 w-4" />
  </button>
);

const PrimaryButton = ({ children, onClick, icon: Icon, className, disabled, size = 'md' }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={cn(
      'inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 font-medium text-white shadow-sm transition-colors',
      disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-brand-700',
      size === 'sm' ? 'h-9 px-3 text-xs' : 'h-10 px-4 text-sm',
      className
    )}
  >
    {Icon && <Icon className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} />}
    {children}
  </button>
);

const SecondaryButton = ({ children, onClick, icon: Icon, className, size = 'md' }) => (
  <button
    onClick={onClick}
    className={cn(
      'inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface font-medium text-text transition-colors hover:border-border-strong hover:bg-surface-subtle',
      size === 'sm' ? 'h-9 px-3 text-xs' : 'h-10 px-4 text-sm',
      className
    )}
  >
    {Icon && <Icon className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} />}
    {children}
  </button>
);

const Input = ({ value, onChange, placeholder, className, icon: Icon, disabled }) => (
  <div className="relative">
    {Icon && (
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Icon className="h-4 w-4 text-text-subtle" />
      </div>
    )}
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={cn('ui-input', Icon ? 'pl-10 pr-3' : 'px-3', className)}
    />
  </div>
);

const Select = ({ value, onChange, options, className, placeholder, disabled }) => (
  <select
    value={value}
    onChange={onChange}
    disabled={disabled}
    className={cn('ui-select', className)}
  >
    {placeholder && <option value="">{placeholder}</option>}
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
);

const Badge = ({ children, variant = 'default', className }) => {
  const variants = {
    default: 'border-border bg-surface-subtle text-text-muted',
    success: 'border-success-100 bg-success-50 text-success-700',
    warning: 'border-warning-100 bg-warning-50 text-warning-700',
    danger: 'border-danger-100 bg-danger-50 text-danger-700',
    info: 'border-brand-100 bg-brand-50 text-brand-700',
    purple: 'border-violet-100 bg-violet-50 text-violet-700',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

const Card = ({ children, className }) => (
  <div className={cn('rounded-2xl border border-border bg-surface shadow-panel', className)}>
    {children}
  </div>
);

const Toggle = ({ checked, onChange, disabled }) => (
  <button
    onClick={() => !disabled && onChange(!checked)}
    disabled={disabled}
    className={cn(
      'relative inline-flex h-5 w-9 items-center rounded-full transition-colors',
      checked ? 'bg-brand-600' : 'bg-slate-300',
      disabled && 'cursor-not-allowed opacity-50'
    )}
  >
    <span
      className={cn(
        'inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform',
        checked ? 'translate-x-5' : 'translate-x-1'
      )}
    />
  </button>
);

// --------------- 属性类型徽章 ---------------
const TypeBadge = ({ type }) => {
  const typeConfig = ATTRIBUTE_TYPES.find((item) => item.id === type);
  const Icon = typeConfig?.icon || Type;

  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-subtle px-2.5 py-1 text-xs font-medium text-text-muted">
      <Icon className="h-3 w-3" />
      {typeConfig?.name || type}
    </span>
  );
};

const CodeBadge = ({ children, tone = 'default' }) => (
  <code
    className={cn(
      'inline-flex items-center rounded-lg px-2 py-1 text-xs font-semibold',
      tone === 'accent'
        ? 'bg-brand-50 text-brand-700 ring-1 ring-brand-100'
        : 'bg-slate-100 text-slate-700 ring-1 ring-slate-200'
    )}
  >
    {children}
  </code>
);

const getSortedOptions = (options = []) => [...options].sort((a, b) => a.sort - b.sort);
const isSelectType = (type) => ATTRIBUTE_TYPES.some((item) => item.id === type && item.hasOptions);

// --------------- 选项值编辑组件 ---------------
const OptionEditor = ({ options, onChange }) => {
  const [, setEditingId] = useState(null);
  const sortedOptions = getSortedOptions(options);

  const handleAddOption = () => {
    const newOption = {
      id: `opt_${Date.now()}`,
      value: '',
      code: '',
      isActive: true,
      sort: options.length + 1,
    };
    onChange([...options, newOption]);
    setEditingId(newOption.id);
  };

  const handleUpdateOption = (optionId, field, value) => {
    onChange(options.map((opt) => (opt.id === optionId ? { ...opt, [field]: value } : opt)));
  };

  const handleDeleteOption = (optionId) => {
    onChange(options.filter((opt) => opt.id !== optionId).map((opt, idx) => ({ ...opt, sort: idx + 1 })));
  };

  const handleMoveOption = (index, direction) => {
    const newOptions = [...sortedOptions];
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= newOptions.length) return;
    [newOptions[index], newOptions[newIndex]] = [newOptions[newIndex], newOptions[index]];
    onChange(newOptions.map((opt, idx) => ({ ...opt, sort: idx + 1 })));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <label className="ui-section-title">属性值配置</label>
          <p className="mt-1 text-xs text-text-subtle">用于 SKU 组合和编码映射，支持排序与停用。</p>
        </div>
        <SecondaryButton icon={Plus} size="sm" onClick={handleAddOption}>
          添加选项
        </SecondaryButton>
      </div>

      {sortedOptions.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-surface-subtle">
              <tr className="border-b border-border">
                <th className="w-8 px-3 py-2 text-left font-medium text-text-muted" />
                <th className="px-3 py-2 text-left font-medium text-text-muted">显示名称</th>
                <th className="w-32 px-3 py-2 text-left font-medium text-text-muted">简写编码</th>
                <th className="w-20 px-3 py-2 text-left font-medium text-text-muted">启用</th>
                <th className="w-20 px-3 py-2 text-left font-medium text-text-muted">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle bg-white">
              {sortedOptions.map((option, index) => (
                <tr key={option.id} className="hover:bg-surface-muted">
                  <td className="px-3 py-2">
                    <div className="flex flex-col gap-0.5">
                      <button
                        onClick={() => handleMoveOption(index, -1)}
                        disabled={index === 0}
                        className={cn(
                          'flex h-4 w-4 items-center justify-center rounded text-[10px]',
                          index === 0
                            ? 'text-slate-300'
                            : 'text-text-subtle hover:bg-surface-subtle hover:text-text'
                        )}
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => handleMoveOption(index, 1)}
                        disabled={index === sortedOptions.length - 1}
                        className={cn(
                          'flex h-4 w-4 items-center justify-center rounded text-[10px]',
                          index === sortedOptions.length - 1
                            ? 'text-slate-300'
                            : 'text-text-subtle hover:bg-surface-subtle hover:text-text'
                        )}
                      >
                        ▼
                      </button>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={option.value}
                      onChange={(e) => handleUpdateOption(option.id, 'value', e.target.value)}
                      placeholder="选项名称"
                      className="ui-input h-9"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={option.code}
                      onChange={(e) =>
                        handleUpdateOption(option.id, 'code', e.target.value.toUpperCase())
                      }
                      placeholder="编码"
                      className="ui-input h-9 font-mono"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Toggle
                      checked={option.isActive}
                      onChange={(value) => handleUpdateOption(option.id, 'isActive', value)}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <IconButton icon={Trash2} onClick={() => handleDeleteOption(option.id)} title="删除" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border-strong bg-surface-muted py-8 text-center text-text-subtle">
          <p className="text-sm">暂无选项，点击“添加选项”创建</p>
        </div>
      )}

      {sortedOptions.length > 0 && (
        <div className="rounded-2xl border border-brand-100 bg-brand-50 p-3">
          <p className="mb-2 text-xs font-medium text-brand-700">编码预览</p>
          <div className="flex flex-wrap gap-2">
            {sortedOptions
              .filter((item) => item.isActive && item.value && item.code)
              .map((item) => (
                <span
                  key={item.id}
                  className="inline-flex items-center gap-1 rounded-xl border border-brand-100 bg-white px-2 py-1 text-xs text-text-muted"
                >
                  <span>{item.value}</span>
                  <span className="text-text-subtle">→</span>
                  <code className="font-mono font-semibold text-brand-700">{item.code}</code>
                </span>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --------------- 属性编辑抽屉 ---------------
const AttributeEditDrawer = ({ isOpen, onClose, attribute, onSave }) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    shortCode: '',
    groupId: 'basic',
    type: 'text',
    required: false,
    isActive: true,
    unit: '',
    description: '',
    options: [],
  });

  React.useEffect(() => {
    if (attribute) {
      setFormData({
        code: attribute.code,
        name: attribute.name,
        shortCode: attribute.shortCode,
        groupId: attribute.groupId,
        type: attribute.type,
        required: attribute.required,
        isActive: attribute.isActive,
        unit: attribute.unit || '',
        description: attribute.description || '',
        options: attribute.options ? attribute.options.map((item) => ({ ...item })) : [],
      });
      return;
    }

    setFormData({
      code: '',
      name: '',
      shortCode: '',
      groupId: 'basic',
      type: 'text',
      required: false,
      isActive: true,
      unit: '',
      description: '',
      options: [],
    });
  }, [attribute]);

  const handleSave = () => {
    const savedAttr = {
      ...attribute,
      ...formData,
      id: attribute?.id || `${Date.now()}`,
      refCount: attribute?.refCount || 0,
      createdAt: attribute?.createdAt || TODAY,
      updatedAt: TODAY,
    };
    onSave(savedAttr);
    onClose();
  };

  const typeConfig = ATTRIBUTE_TYPES.find((item) => item.id === formData.type);
  const needsOptions = typeConfig?.hasOptions;
  const needsUnit = formData.type === 'number';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-modal flex justify-end">
      <div className="absolute inset-0 bg-slate-950/35" onClick={onClose} />
      <div className="animate-drawer-in relative flex h-full min-w-[640px] w-[52vw] flex-col bg-surface shadow-elevated">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-text">{attribute ? '编辑属性' : '新建属性'}</h2>
            <p className="mt-1 text-sm text-text-subtle">维护属性编码、展示文案与选项映射。</p>
          </div>
          <IconButton icon={X} onClick={onClose} />
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-text">属性编码 *</label>
              <Input
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="如 COLOR"
              />
              <p className="mt-1 text-xs text-text-subtle">系统内部唯一标识，建议全大写下划线风格。</p>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-text">简写编码 *</label>
              <Input
                value={formData.shortCode}
                onChange={(e) =>
                  setFormData({ ...formData, shortCode: e.target.value.toUpperCase() })
                }
                placeholder="如 CLR"
              />
              <p className="mt-1 text-xs text-text-subtle">用于 SKU 或规则编码拼接，建议 2 到 4 位。</p>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-text">属性名称 *</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="如 颜色"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-text">所属分组 *</label>
              <Select
                value={formData.groupId}
                onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
                options={ATTRIBUTE_GROUPS.map((group) => ({ value: group.id, label: group.name }))}
                className="w-full"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-text">属性类型 *</label>
              <Select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value, options: [] })}
                options={ATTRIBUTE_TYPES.map((type) => ({ value: type.id, label: type.name }))}
                className="w-full"
              />
            </div>
          </div>

          {needsUnit && (
            <div>
              <label className="mb-1 block text-sm font-medium text-text">单位</label>
              <Input
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="如 cm, g, kg"
              />
            </div>
          )}

          {needsOptions && (
            <OptionEditor
              options={formData.options}
              onChange={(newOptions) => setFormData({ ...formData, options: newOptions })}
            />
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-text">描述</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="属性用途说明"
              rows={3}
              className="ui-textarea"
            />
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-sm text-text">
              <input
                type="checkbox"
                checked={formData.required}
                onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
                className="rounded border-border text-brand-600 focus:ring-brand-100"
              />
              必填属性
            </label>
            <label className="flex items-center gap-2 text-sm text-text">
              <Toggle
                checked={formData.isActive}
                onChange={(value) => setFormData({ ...formData, isActive: value })}
              />
              启用
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border bg-surface-muted px-6 py-4">
          <SecondaryButton onClick={onClose}>取消</SecondaryButton>
          <PrimaryButton
            icon={Save}
            onClick={handleSave}
            disabled={!formData.code || !formData.name || !formData.shortCode}
          >
            保存
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

// --------------- 属性详情展示 ---------------
const AttributeDetail = ({ attribute, onEdit, onClose }) => {
  if (!attribute) return null;

  const groupConfig = ATTRIBUTE_GROUPS.find((group) => group.id === attribute.groupId);
  const groupStyle = GROUP_COLOR_STYLES[groupConfig?.color] || GROUP_COLOR_STYLES.blue;
  const sortedOptions = getSortedOptions(attribute.options);

  return (
    <div className="fixed inset-0 z-modal flex justify-end">
      <div className="absolute inset-0 bg-slate-950/35" onClick={onClose} />
      <div className="animate-drawer-in relative flex h-full min-w-[640px] w-[52vw] flex-col bg-surface shadow-elevated">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-text">{attribute.name}</h2>
              <Badge variant={attribute.isActive ? 'success' : 'default'}>
                {attribute.isActive ? '启用中' : '已停用'}
              </Badge>
              <span className={cn('rounded-full border px-2.5 py-1 text-xs font-medium', groupStyle.badge)}>
                {groupConfig?.name}
              </span>
            </div>
            <p className="text-sm text-text-subtle">{attribute.description || '暂无属性说明。'}</p>
          </div>
          <div className="flex items-center gap-2">
            <SecondaryButton icon={Edit2} size="sm" onClick={() => onEdit(attribute)}>
              编辑
            </SecondaryButton>
            <IconButton icon={X} onClick={onClose} />
          </div>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4">
              <p className="text-xs text-text-subtle">属性编码</p>
              <div className="mt-2">
                <CodeBadge>{attribute.code}</CodeBadge>
              </div>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-text-subtle">简写编码</p>
              <div className="mt-2">
                <CodeBadge tone="accent">{attribute.shortCode}</CodeBadge>
              </div>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-text-subtle">引用次数</p>
              <p className="mt-2 text-xl font-semibold text-text">{attribute.refCount.toLocaleString()}</p>
            </Card>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <p className="text-xs text-text-subtle">属性类型</p>
              <div className="mt-2">
                <TypeBadge type={attribute.type} />
              </div>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-text-subtle">是否必填</p>
              <p className="mt-2 text-sm font-medium text-text">{attribute.required ? '是' : '否'}</p>
            </Card>
            {attribute.unit && (
              <Card className="p-4">
                <p className="text-xs text-text-subtle">单位</p>
                <p className="mt-2 text-sm font-medium text-text">{attribute.unit}</p>
              </Card>
            )}
            <Card className="p-4">
              <p className="text-xs text-text-subtle">更新时间</p>
              <p className="mt-2 text-sm font-medium text-text">{attribute.updatedAt}</p>
            </Card>
          </div>

          {sortedOptions.length > 0 && (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-text">属性值列表</p>
                  <p className="mt-1 text-xs text-text-subtle">
                    共 {sortedOptions.length} 个选项，停用项仍保留用于历史数据回显。
                  </p>
                </div>
              </div>
              <div className="overflow-hidden rounded-2xl border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-surface-subtle">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium text-text-muted">序号</th>
                      <th className="px-3 py-2 text-left font-medium text-text-muted">显示名称</th>
                      <th className="px-3 py-2 text-left font-medium text-text-muted">简写编码</th>
                      <th className="px-3 py-2 text-left font-medium text-text-muted">状态</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle bg-white">
                    {sortedOptions.map((opt, idx) => (
                      <tr key={opt.id} className={!opt.isActive ? 'bg-surface-muted text-text-subtle' : ''}>
                        <td className="px-3 py-2 text-text-subtle">{idx + 1}</td>
                        <td className="px-3 py-2 font-medium">{opt.value}</td>
                        <td className="px-3 py-2">
                          <CodeBadge tone="accent">{opt.code}</CodeBadge>
                        </td>
                        <td className="px-3 py-2">
                          <Badge variant={opt.isActive ? 'success' : 'default'}>
                            {opt.isActive ? '启用' : '停用'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-border bg-surface-muted p-4 text-xs text-text-subtle">
            <p>创建时间：{attribute.createdAt}</p>
            <p className="mt-1">更新时间：{attribute.updatedAt}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, tone = 'brand' }) => {
  const toneClasses = {
    brand: 'bg-brand-50 text-brand-700 border-brand-100',
    success: 'bg-success-50 text-success-700 border-success-100',
    warning: 'bg-warning-50 text-warning-700 border-warning-100',
    purple: 'bg-violet-50 text-violet-700 border-violet-100',
  };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-2xl border',
            toneClasses[tone] || toneClasses.brand
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-text-subtle">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-text">{value}</p>
        </div>
      </div>
    </Card>
  );
};

// --------------- 主组件 ---------------
export default function ProductAttributePage() {
  const [attributes, setAttributes] = useState(initialAttributes);
  const [searchText, setSearchText] = useState('');
  const [filterGroup, setFilterGroup] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [editingAttr, setEditingAttr] = useState(null);
  const [viewingAttr, setViewingAttr] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState(ATTRIBUTE_GROUPS.map((group) => group.id));

  const filteredAttributes = useMemo(
    () =>
      attributes.filter((attr) => {
        const keyword = searchText.trim().toLowerCase();
        const matchesSearch =
          !keyword ||
          attr.name.toLowerCase().includes(keyword) ||
          attr.code.toLowerCase().includes(keyword) ||
          attr.shortCode.toLowerCase().includes(keyword);
        const matchesGroup = !filterGroup || attr.groupId === filterGroup;
        const matchesType = !filterType || attr.type === filterType;
        const matchesStatus =
          !filterStatus ||
          (filterStatus === 'active' && attr.isActive) ||
          (filterStatus === 'inactive' && !attr.isActive);

        return matchesSearch && matchesGroup && matchesType && matchesStatus;
      }),
    [attributes, searchText, filterGroup, filterType, filterStatus]
  );

  const groupedAttributes = useMemo(
    () =>
      ATTRIBUTE_GROUPS.map((group) => ({
        ...group,
        attributes: filteredAttributes.filter((attr) => attr.groupId === group.id),
      })).filter((group) => group.attributes.length > 0),
    [filteredAttributes]
  );

  const stats = useMemo(
    () => ({
      total: attributes.length,
      active: attributes.filter((attr) => attr.isActive).length,
      required: attributes.filter((attr) => attr.required).length,
      optionsCount: attributes.reduce((sum, attr) => sum + (attr.options?.length || 0), 0),
    }),
    [attributes]
  );

  const hasActiveFilters = Boolean(searchText || filterGroup || filterType || filterStatus);

  const handleAddAttr = () => {
    setEditingAttr(null);
    setIsDrawerOpen(true);
  };

  const handleEditAttr = (attr) => {
    setEditingAttr(attr);
    setViewingAttr(null);
    setIsDrawerOpen(true);
  };

  const handleViewAttr = (attr) => {
    setViewingAttr(attr);
  };

  const handleToggleAttr = (attrId) => {
    setAttributes((prev) =>
      prev.map((attr) =>
        attr.id === attrId ? { ...attr, isActive: !attr.isActive, updatedAt: TODAY } : attr
      )
    );
  };

  const handleSaveAttr = (savedAttr) => {
    setAttributes((prev) => {
      const exists = prev.find((attr) => attr.id === savedAttr.id);
      if (exists) {
        return prev.map((attr) => (attr.id === savedAttr.id ? savedAttr : attr));
      }
      return [...prev, savedAttr];
    });
  };

  const toggleGroup = (groupId) => {
    setExpandedGroups((prev) =>
      prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]
    );
  };

  const resetFilters = () => {
    setSearchText('');
    setFilterGroup('');
    setFilterType('');
    setFilterStatus('');
  };

  return (
    <div className="space-y-5">
      <Card className="overflow-hidden">
        <div className="border-b border-border px-6 py-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
                <Package2 className="h-3.5 w-3.5" />
                产品中心 / 基础配置
              </div>
              <div>
                <h1 className="ui-page-title">属性管理</h1>
                <p className="mt-1 text-sm text-text-subtle">
                  维护产品属性、选项编码与分组配置，支撑 SKU 生成、详情展示和物流识别。
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <SecondaryButton icon={Upload}>导入</SecondaryButton>
              <SecondaryButton icon={Download}>导出</SecondaryButton>
              <PrimaryButton icon={Plus} onClick={handleAddAttr}>
                新建属性
              </PrimaryButton>
            </div>
          </div>
        </div>

        <div className="grid gap-4 border-b border-border px-6 py-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="属性总数" value={stats.total} icon={Database} tone="brand" />
          <StatCard title="已启用" value={stats.active} icon={Check} tone="success" />
          <StatCard title="必填属性" value={stats.required} icon={AlertCircle} tone="warning" />
          <StatCard title="选项值总数" value={stats.optionsCount} icon={Tag} tone="purple" />
        </div>

        <div className="px-6 py-5">
          <div className="flex flex-wrap items-center gap-3">
            <Input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="搜索属性名称、编码、简写..."
              icon={Search}
              className="w-full md:w-72"
            />
            <Select
              value={filterGroup}
              onChange={(e) => setFilterGroup(e.target.value)}
              options={ATTRIBUTE_GROUPS.map((group) => ({ value: group.id, label: group.name }))}
              placeholder="全部分组"
              className="w-full md:w-40"
            />
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              options={ATTRIBUTE_TYPES.map((type) => ({ value: type.id, label: type.name }))}
              placeholder="全部类型"
              className="w-full md:w-36"
            />
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              options={[
                { value: 'active', label: '已启用' },
                { value: 'inactive', label: '已停用' },
              ]}
              placeholder="全部状态"
              className="w-full md:w-36"
            />
            {hasActiveFilters && (
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
              <Layers3 className="h-4 w-4" />
              当前分组 {groupedAttributes.length}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-surface-subtle px-3 py-1">
              <Database className="h-4 w-4" />
              当前结果 {filteredAttributes.length}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-surface-subtle px-3 py-1">
              <Clock3 className="h-4 w-4" />
              最近更新时间按属性记录展示
            </span>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {groupedAttributes.map((group) => {
          const groupStyle = GROUP_COLOR_STYLES[group.color] || GROUP_COLOR_STYLES.blue;
          const isExpanded = expandedGroups.includes(group.id);

          return (
            <Card key={group.id} className="overflow-hidden">
              <div
                className="flex cursor-pointer items-center gap-3 px-5 py-4 transition-colors hover:bg-surface-muted"
                onClick={() => toggleGroup(group.id)}
              >
                <div className={cn('h-10 w-1 rounded-full', groupStyle.bar)} />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold text-text">{group.name}</h3>
                    <span className={cn('rounded-full border px-2.5 py-1 text-xs font-medium', groupStyle.badge)}>
                      {group.attributes.length} 个属性
                    </span>
                    <span className="text-xs text-text-subtle">{isExpanded ? '已展开' : '已收起'}</span>
                  </div>
                  <p className="mt-1 text-sm text-text-subtle">{group.description}</p>
                </div>
                {isExpanded ? (
                  <ChevronDown className="h-5 w-5 text-text-subtle" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-text-subtle" />
                )}
              </div>

              {isExpanded && (
                <div className="overflow-x-auto border-t border-border">
                  <table className="min-w-[1080px] w-full text-sm">
                    <thead className="bg-surface-subtle">
                      <tr className="border-b border-border">
                        <th className="px-4 py-3 text-left font-medium text-text-muted whitespace-nowrap">状态</th>
                        <th className="px-4 py-3 text-left font-medium text-text-muted whitespace-nowrap">属性名称</th>
                        <th className="px-4 py-3 text-left font-medium text-text-muted whitespace-nowrap">编码信息</th>
                        <th className="px-4 py-3 text-left font-medium text-text-muted whitespace-nowrap">类型</th>
                        <th className="px-4 py-3 text-left font-medium text-text-muted whitespace-nowrap">必填</th>
                        <th className="px-4 py-3 text-left font-medium text-text-muted whitespace-nowrap">选项数 / 单位</th>
                        <th className="px-4 py-3 text-left font-medium text-text-muted whitespace-nowrap">选项值示例</th>
                        <th className="px-4 py-3 text-left font-medium text-text-muted whitespace-nowrap">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle bg-white">
                      {group.attributes.map((attr) => {
                        const previewOptions = getSortedOptions(attr.options).slice(0, 3);

                        return (
                          <tr key={attr.id} className="hover:bg-surface-muted">
                            <td className="px-4 py-4 align-top">
                              <div className="flex items-center gap-3">
                                <Toggle
                                  checked={attr.isActive}
                                  onChange={() => handleToggleAttr(attr.id)}
                                />
                                <Badge variant={attr.isActive ? 'success' : 'default'}>
                                  {attr.isActive ? '启用' : '停用'}
                                </Badge>
                              </div>
                            </td>
                            <td className="px-4 py-4 align-top">
                              <button
                                onClick={() => handleViewAttr(attr)}
                                className="text-left transition-colors hover:text-brand-700"
                              >
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold text-text">{attr.name}</p>
                                  <Eye className="h-3.5 w-3.5 text-text-subtle" />
                                </div>
                                <p className="mt-1 max-w-sm text-xs leading-5 text-text-subtle">
                                  {attr.description || '暂无说明'}
                                </p>
                                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-text-subtle">
                                  <span className="rounded-full bg-surface-subtle px-2.5 py-1">
                                    引用 {attr.refCount.toLocaleString()}
                                  </span>
                                  <span className="rounded-full bg-surface-subtle px-2.5 py-1">
                                    更新于 {attr.updatedAt}
                                  </span>
                                </div>
                              </button>
                            </td>
                            <td className="px-4 py-4 align-top">
                              <div className="flex flex-wrap gap-2">
                                <CodeBadge>{attr.code}</CodeBadge>
                                <CodeBadge tone="accent">{attr.shortCode}</CodeBadge>
                              </div>
                            </td>
                            <td className="px-4 py-4 align-top">
                              <TypeBadge type={attr.type} />
                            </td>
                            <td className="px-4 py-4 align-top">
                              {attr.required ? <Badge variant="danger">必填</Badge> : <Badge>选填</Badge>}
                            </td>
                            <td className="px-4 py-4 align-top">
                              {attr.unit ? (
                                <div className="space-y-1">
                                  <p className="font-medium text-text">{attr.unit}</p>
                                  <p className="text-xs text-text-subtle">数字属性单位</p>
                                </div>
                              ) : isSelectType(attr.type) ? (
                                <div className="space-y-1">
                                  <p className="font-medium text-text">{attr.options?.length || 0} 个选项</p>
                                  <p className="text-xs text-text-subtle">含停用项统计</p>
                                </div>
                              ) : (
                                <span className="text-text-subtle">无额外配置</span>
                              )}
                            </td>
                            <td className="px-4 py-4 align-top">
                              {previewOptions.length > 0 ? (
                                <div className="flex max-w-xs flex-wrap gap-2">
                                  {previewOptions.map((opt) => (
                                    <span
                                      key={opt.id}
                                      className={cn(
                                        'inline-flex items-center gap-1 rounded-xl border px-2 py-1 text-xs',
                                        opt.isActive
                                          ? 'border-border bg-surface-subtle text-text-muted'
                                          : 'border-border bg-slate-100 text-text-subtle'
                                      )}
                                    >
                                      <span>{opt.value}</span>
                                      <code className="font-semibold text-brand-700">{opt.code}</code>
                                    </span>
                                  ))}
                                  {(attr.options?.length || 0) > 3 && (
                                    <span className="inline-flex items-center rounded-xl bg-surface-subtle px-2 py-1 text-xs text-text-subtle">
                                      +{attr.options.length - 3}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-text-subtle">无示例</span>
                              )}
                            </td>
                            <td className="px-4 py-4 align-top">
                              <div className="flex items-center gap-1">
                                <IconButton
                                  icon={Edit2}
                                  onClick={() => handleEditAttr(attr)}
                                  title="编辑"
                                />
                                <IconButton
                                  icon={Copy}
                                  onClick={() => {
                                    const newAttr = {
                                      ...attr,
                                      id: `${Date.now()}`,
                                      code: `${attr.code}_COPY`,
                                      shortCode: `${attr.shortCode}2`,
                                      name: `${attr.name} (副本)`,
                                      refCount: 0,
                                      createdAt: TODAY,
                                      updatedAt: TODAY,
                                      options:
                                        attr.options?.map((opt, idx) => ({
                                          ...opt,
                                          id: `${Date.now()}_${idx}`,
                                        })) || [],
                                    };
                                    setAttributes((prev) => [...prev, newAttr]);
                                  }}
                                  title="复制"
                                />
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          );
        })}

        {groupedAttributes.length === 0 && (
          <Card className="px-6 py-12">
            <div className="text-center text-text-subtle">
              <Database className="mx-auto mb-4 h-12 w-12 text-slate-300" />
              <p className="text-base font-medium text-text">
                {hasActiveFilters ? '当前筛选条件下没有匹配的属性' : '暂无属性数据'}
              </p>
              <p className="mt-2 text-sm">
                {hasActiveFilters
                  ? '可以尝试清除筛选或调整关键字、分组和状态条件。'
                  : '创建第一个属性后，这里会显示按分组整理的属性列表。'}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="mt-4 text-sm font-medium text-brand-600 transition-colors hover:text-brand-700"
                >
                  清除筛选
                </button>
              )}
            </div>
          </Card>
        )}
      </div>

      <AttributeEditDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        attribute={editingAttr}
        onSave={handleSaveAttr}
      />

      {viewingAttr && (
        <AttributeDetail
          attribute={viewingAttr}
          onEdit={handleEditAttr}
          onClose={() => setViewingAttr(null)}
        />
      )}
    </div>
  );
}
