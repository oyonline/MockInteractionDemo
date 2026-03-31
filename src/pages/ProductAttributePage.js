// src/pages/ProductAttributePage.js
// 属性管理页面 - 产品中心基础配置核心功能
import React, { useState } from 'react';
import {
    Search, Plus, Edit2, Trash2, X, Save, Download, Upload,
    Tag, List, Hash, Type, Calendar, ToggleLeft, CheckSquare,
    ChevronDown, ChevronRight, Copy,
    AlertCircle, Check, Database
} from 'lucide-react';

// 轻量工具：className 拼接
const cn = (...args) => args.filter(Boolean).join(' ');

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
    { id: 'basic', name: '基础属性', description: '产品基本信息属性', color: 'blue' },
    { id: 'spec', name: '规格属性', description: '产品规格参数', color: 'green' },
    { id: 'sales', name: '销售属性', description: '影响SKU生成的属性', color: 'purple' },
    { id: 'logistics', name: '物流属性', description: '物流相关属性', color: 'orange' },
    { id: 'quality', name: '质量属性', description: '质量检验相关属性', color: 'red' },
];

// --------------- 属性数据（包含选项的简写编码） ---------------
const initialAttributes = [
    // 基础属性
    {
        id: '1', code: 'BRAND', name: '品牌', shortCode: 'BR', groupId: 'basic', type: 'single_select',
        required: true, isActive: true, unit: '', refCount: 1256, description: '产品所属品牌',
        options: [
            { id: 'o1', value: '品牌A', code: 'A', isActive: true, sort: 1 },
            { id: 'o2', value: '品牌B', code: 'B', isActive: true, sort: 2 },
            { id: 'o3', value: '品牌C', code: 'C', isActive: true, sort: 3 },
            { id: 'o4', value: '自有品牌', code: 'OWN', isActive: true, sort: 4 },
        ],
        createdAt: '2024-01-10', updatedAt: '2024-03-15'
    },
    {
        id: '2', code: 'MATERIAL', name: '材质', shortCode: 'MT', groupId: 'basic', type: 'multi_select',
        required: false, isActive: true, unit: '', refCount: 890, description: '产品主要材质',
        options: [
            { id: 'o1', value: '塑料', code: 'PL', isActive: true, sort: 1 },
            { id: 'o2', value: '金属', code: 'MT', isActive: true, sort: 2 },
            { id: 'o3', value: '木材', code: 'WD', isActive: true, sort: 3 },
            { id: 'o4', value: '玻璃', code: 'GL', isActive: true, sort: 4 },
            { id: 'o5', value: '布料', code: 'FB', isActive: true, sort: 5 },
            { id: 'o6', value: '皮革', code: 'LT', isActive: true, sort: 6 },
            { id: 'o7', value: '硅胶', code: 'SI', isActive: true, sort: 7 },
            { id: 'o8', value: '陶瓷', code: 'CR', isActive: true, sort: 8 },
        ],
        createdAt: '2024-01-10', updatedAt: '2024-02-20'
    },
    {
        id: '3', code: 'ORIGIN', name: '产地', shortCode: 'OG', groupId: 'basic', type: 'single_select',
        required: false, isActive: true, unit: '', refCount: 756, description: '产品生产地',
        options: [
            { id: 'o1', value: '中国', code: 'CN', isActive: true, sort: 1 },
            { id: 'o2', value: '越南', code: 'VN', isActive: true, sort: 2 },
            { id: 'o3', value: '印度', code: 'IN', isActive: true, sort: 3 },
            { id: 'o4', value: '泰国', code: 'TH', isActive: true, sort: 4 },
            { id: 'o5', value: '马来西亚', code: 'MY', isActive: true, sort: 5 },
        ],
        createdAt: '2024-01-10', updatedAt: '2024-01-10'
    },
    {
        id: '4', code: 'ORIGIN', name: '销售区域', shortCode: 'OG', groupId: 'basic', type: 'single_select',
        required: false, isActive: true, unit: '', refCount: 756, description: '产品生产地',
        options: [
            { id: 'o1', value: '中国', code: 'CN', isActive: true, sort: 1 },
            { id: 'o2', value: '美国', code: 'VN', isActive: true, sort: 2 },
            { id: 'o3', value: '日韩', code: 'IN', isActive: true, sort: 3 },
            { id: 'o4', value: '东南亚', code: 'TH', isActive: true, sort: 4 },
            { id: 'o5', value: '欧洲', code: 'MY', isActive: true, sort: 5 },
        ],
        createdAt: '2024-01-10', updatedAt: '2024-01-10'
    },

    // 规格属性
    {
        id: '4', code: 'WEIGHT', name: '重量', shortCode: 'WT', groupId: 'spec', type: 'number',
        required: true, isActive: true, unit: 'g', refCount: 1256, description: '产品净重',
        options: [],
        createdAt: '2024-01-10', updatedAt: '2024-01-10'
    },
    {
        id: '5', code: 'VOLTAGE', name: '电压', shortCode: 'VLT', groupId: 'spec', type: 'single_select',
        required: false, isActive: true, unit: '', refCount: 234, description: '工作电压',
        options: [
            { id: 'o1', value: '110V', code: '110', isActive: true, sort: 1 },
            { id: 'o2', value: '220V', code: '220', isActive: true, sort: 2 },
            { id: 'o3', value: '110V-220V', code: 'UNI', isActive: true, sort: 3 },
            { id: 'o4', value: '12V', code: '12', isActive: true, sort: 4 },
            { id: 'o5', value: '24V', code: '24', isActive: true, sort: 5 },
        ],
        createdAt: '2024-01-15', updatedAt: '2024-01-15'
    },

    // 销售属性
    {
        id: '6', code: 'COLOR', name: '颜色', shortCode: 'CLR', groupId: 'sales', type: 'multi_select',
        required: true, isActive: true, unit: '', refCount: 1256, description: '产品颜色，影响SKU生成',
        options: [
            { id: 'o1', value: '黑色', code: 'BK', isActive: true, sort: 1 },
            { id: 'o2', value: '白色', code: 'WT', isActive: true, sort: 2 },
            { id: 'o3', value: '红色', code: 'RD', isActive: true, sort: 3 },
            { id: 'o4', value: '蓝色', code: 'BL', isActive: true, sort: 4 },
            { id: 'o5', value: '绿色', code: 'GN', isActive: true, sort: 5 },
            { id: 'o6', value: '黄色', code: 'YL', isActive: true, sort: 6 },
            { id: 'o7', value: '粉色', code: 'PK', isActive: true, sort: 7 },
            { id: 'o8', value: '灰色', code: 'GY', isActive: true, sort: 8 },
            { id: 'o9', value: '棕色', code: 'BN', isActive: true, sort: 9 },
            { id: 'o10', value: '紫色', code: 'PP', isActive: true, sort: 10 },
            { id: 'o11', value: '橙色', code: 'OG', isActive: true, sort: 11 },
            { id: 'o12', value: '米色', code: 'BG', isActive: true, sort: 12 },
            { id: 'o13', value: '藏青色', code: 'NV', isActive: true, sort: 13 },
            { id: 'o14', value: '卡其色', code: 'KH', isActive: true, sort: 14 },
            { id: 'o15', value: '透明', code: 'CL', isActive: true, sort: 15 },
        ],
        createdAt: '2024-01-10', updatedAt: '2024-03-01'
    },
    {
        id: '7', code: 'SIZE', name: '尺码', shortCode: 'SZ', groupId: 'sales', type: 'multi_select',
        required: false, isActive: true, unit: '', refCount: 456, description: '服装尺码，影响SKU生成',
        options: [
            { id: 'o1', value: 'XS', code: 'XS', isActive: true, sort: 1 },
            { id: 'o2', value: 'S', code: 'S', isActive: true, sort: 2 },
            { id: 'o3', value: 'M', code: 'M', isActive: true, sort: 3 },
            { id: 'o4', value: 'L', code: 'L', isActive: true, sort: 4 },
            { id: 'o5', value: 'XL', code: 'XL', isActive: true, sort: 5 },
            { id: 'o6', value: 'XXL', code: '2XL', isActive: true, sort: 6 },
            { id: 'o7', value: 'XXXL', code: '3XL', isActive: true, sort: 7 },
        ],
        createdAt: '2024-01-10', updatedAt: '2024-01-10'
    },
    {
        id: '8', code: 'STYLE', name: '款式', shortCode: 'STY', groupId: 'sales', type: 'single_select',
        required: false, isActive: true, unit: '', refCount: 678, description: '产品款式',
        options: [
            { id: 'o1', value: '基础款', code: 'BS', isActive: true, sort: 1 },
            { id: 'o2', value: '升级款', code: 'UP', isActive: true, sort: 2 },
            { id: 'o3', value: '豪华款', code: 'DX', isActive: true, sort: 3 },
            { id: 'o4', value: '限定款', code: 'LT', isActive: true, sort: 4 },
        ],
        createdAt: '2024-01-15', updatedAt: '2024-01-15'
    },
    {
        id: '9', code: 'PACKAGE_QTY', name: '包装数量', shortCode: 'PKQ', groupId: 'sales', type: 'single_select',
        required: false, isActive: true, unit: '', refCount: 890, description: '每包装数量',
        options: [
            { id: 'o1', value: '单个装', code: '1P', isActive: true, sort: 1 },
            { id: 'o2', value: '2个装', code: '2P', isActive: true, sort: 2 },
            { id: 'o3', value: '3个装', code: '3P', isActive: true, sort: 3 },
            { id: 'o4', value: '5个装', code: '5P', isActive: true, sort: 4 },
            { id: 'o5', value: '10个装', code: '10P', isActive: true, sort: 5 },
        ],
        createdAt: '2024-01-15', updatedAt: '2024-01-15'
    },

    // 物流属性
    {
        id: '10', code: 'BATTERY', name: '含电池', shortCode: 'BAT', groupId: 'logistics', type: 'boolean',
        required: true, isActive: true, unit: '', refCount: 1256, description: '是否含电池',
        options: [],
        createdAt: '2024-01-10', updatedAt: '2024-01-10'
    },
    {
        id: '11', code: 'BATTERY_TYPE', name: '电池类型', shortCode: 'BTY', groupId: 'logistics', type: 'single_select',
        required: false, isActive: true, unit: '', refCount: 456, description: '电池类型',
        options: [
            { id: 'o1', value: '无电池', code: 'NO', isActive: true, sort: 1 },
            { id: 'o2', value: '干电池', code: 'DRY', isActive: true, sort: 2 },
            { id: 'o3', value: '锂电池', code: 'LI', isActive: true, sort: 3 },
            { id: 'o4', value: '纽扣电池', code: 'BTN', isActive: true, sort: 4 },
            { id: 'o5', value: '内置锂电池', code: 'BLI', isActive: true, sort: 5 },
        ],
        createdAt: '2024-02-01', updatedAt: '2024-02-01'
    },

    // 质量属性
    {
        id: '12', code: 'WARRANTY', name: '质保期', shortCode: 'WRY', groupId: 'quality', type: 'single_select',
        required: false, isActive: true, unit: '', refCount: 890, description: '产品质保期限',
        options: [
            { id: 'o1', value: '无质保', code: 'NO', isActive: true, sort: 1 },
            { id: 'o2', value: '3个月', code: '3M', isActive: true, sort: 2 },
            { id: 'o3', value: '6个月', code: '6M', isActive: true, sort: 3 },
            { id: 'o4', value: '1年', code: '1Y', isActive: true, sort: 4 },
            { id: 'o5', value: '2年', code: '2Y', isActive: true, sort: 5 },
            { id: 'o6', value: '3年', code: '3Y', isActive: true, sort: 6 },
        ],
        createdAt: '2024-01-20', updatedAt: '2024-01-20'
    },
];

// --------------- 轻量级 UI 组件 ---------------
const IconButton = ({ icon: Icon, onClick, className, title, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={cn(
            'p-2 rounded-lg transition-colors',
            disabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
            className
        )}
    >
        <Icon className="w-4 h-4" />
    </button>
);

const PrimaryButton = ({ children, onClick, icon: Icon, className, disabled, size = 'md' }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={cn(
            'inline-flex items-center gap-2 bg-blue-600 text-white font-medium rounded-lg transition-colors',
            disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700',
            size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm',
            className
        )}
    >
        {Icon && <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />}
        {children}
    </button>
);

const SecondaryButton = ({ children, onClick, icon: Icon, className, size = 'md' }) => (
    <button
        onClick={onClick}
        className={cn(
            'inline-flex items-center gap-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors',
            size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm',
            className
        )}
    >
        {Icon && <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />}
        {children}
    </button>
);

const Input = ({ value, onChange, placeholder, className, icon: Icon, disabled }) => (
    <div className="relative">
        {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon className="w-4 h-4 text-gray-400" />
            </div>
        )}
        <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
                'w-full border border-gray-300 rounded-lg py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                Icon ? 'pl-10 pr-4' : 'px-4',
                disabled && 'bg-gray-50 text-gray-500',
                className
            )}
        />
    </div>
);

const Select = ({ value, onChange, options, className, placeholder }) => (
    <select
        value={value}
        onChange={onChange}
        className={cn(
            'border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white',
            className
        )}
    >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
    </select>
);

const Badge = ({ children, variant = 'default', className }) => {
    const variants = {
        default: 'bg-gray-100 text-gray-700',
        success: 'bg-green-100 text-green-700',
        warning: 'bg-yellow-100 text-yellow-700',
        danger: 'bg-red-100 text-red-700',
        info: 'bg-blue-100 text-blue-700',
        purple: 'bg-purple-100 text-purple-700',
    };
    return (
        <span className={cn(
            'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
            variants[variant],
            className
        )}>
            {children}
        </span>
    );
};

const Card = ({ children, className }) => (
    <div className={cn('bg-white rounded-xl border border-gray-200 shadow-sm', className)}>
        {children}
    </div>
);

const Toggle = ({ checked, onChange, disabled }) => (
    <button
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={cn(
            'relative inline-flex h-5 w-9 items-center rounded-full transition-colors',
            checked ? 'bg-blue-600' : 'bg-gray-200',
            disabled && 'opacity-50 cursor-not-allowed'
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
    const typeConfig = ATTRIBUTE_TYPES.find(t => t.id === type);
    const Icon = typeConfig?.icon || Type;
    return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
            <Icon className="w-3 h-3" />
            {typeConfig?.name || type}
        </span>
    );
};

// --------------- 选项值编辑组件 ---------------
const OptionEditor = ({ options, onChange }) => {
    const [, setEditingId] = useState(null);

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
        onChange(options.map(opt =>
            opt.id === optionId ? { ...opt, [field]: value } : opt
        ));
    };

    const handleDeleteOption = (optionId) => {
        onChange(options.filter(opt => opt.id !== optionId));
    };

    const handleMoveOption = (index, direction) => {
        const newOptions = [...options];
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= options.length) return;
        [newOptions[index], newOptions[newIndex]] = [newOptions[newIndex], newOptions[index]];
        newOptions.forEach((opt, idx) => opt.sort = idx + 1);
        onChange(newOptions);
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">属性值配置</label>
                <SecondaryButton icon={Plus} size="sm" onClick={handleAddOption}>添加选项</SecondaryButton>
            </div>

            {options.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b">
                                <th className="px-3 py-2 text-left font-medium text-gray-600 w-8"></th>
                                <th className="px-3 py-2 text-left font-medium text-gray-600">显示名称</th>
                                <th className="px-3 py-2 text-left font-medium text-gray-600 w-28">简写编码</th>
                                <th className="px-3 py-2 text-left font-medium text-gray-600 w-16">启用</th>
                                <th className="px-3 py-2 text-left font-medium text-gray-600 w-20">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {options.sort((a, b) => a.sort - b.sort).map((option, index) => (
                                <tr key={option.id} className="hover:bg-gray-50">
                                    <td className="px-3 py-2">
                                        <div className="flex flex-col gap-0.5">
                                            <button
                                                onClick={() => handleMoveOption(index, -1)}
                                                disabled={index === 0}
                                                className={cn(
                                                    'w-4 h-3 flex items-center justify-center rounded text-xs',
                                                    index === 0 ? 'text-gray-200' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                                                )}
                                            >
                                                ▲
                                            </button>
                                            <button
                                                onClick={() => handleMoveOption(index, 1)}
                                                disabled={index === options.length - 1}
                                                className={cn(
                                                    'w-4 h-3 flex items-center justify-center rounded text-xs',
                                                    index === options.length - 1 ? 'text-gray-200' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
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
                                            className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </td>
                                    <td className="px-3 py-2">
                                        <input
                                            type="text"
                                            value={option.code}
                                            onChange={(e) => handleUpdateOption(option.id, 'code', e.target.value.toUpperCase())}
                                            placeholder="编码"
                                            className="w-full border border-gray-200 rounded px-2 py-1 text-sm font-mono focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </td>
                                    <td className="px-3 py-2">
                                        <Toggle
                                            checked={option.isActive}
                                            onChange={(v) => handleUpdateOption(option.id, 'isActive', v)}
                                        />
                                    </td>
                                    <td className="px-3 py-2">
                                        <IconButton
                                            icon={Trash2}
                                            onClick={() => handleDeleteOption(option.id)}
                                            title="删除"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-6 text-gray-400 border-2 border-dashed rounded-lg">
                    <p className="text-sm">暂无选项，点击"添加选项"创建</p>
                </div>
            )}

            {/* 预览 */}
            {options.length > 0 && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-600 mb-2">编码预览（显示名称 → 简写编码）：</p>
                    <div className="flex flex-wrap gap-2">
                        {options.filter(o => o.isActive && o.value && o.code).map(opt => (
                            <span key={opt.id} className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded border text-xs">
                                <span>{opt.value}</span>
                                <span className="text-gray-400">→</span>
                                <code className="font-mono text-blue-600 font-bold">{opt.code}</code>
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
                options: attribute.options ? attribute.options.map(o => ({ ...o })) : [],
            });
        } else {
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
        }
    }, [attribute]);

    const handleSave = () => {
        const savedAttr = {
            ...attribute,
            ...formData,
            id: attribute?.id || `${Date.now()}`,
            refCount: attribute?.refCount || 0,
            createdAt: attribute?.createdAt || new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0],
        };
        onSave(savedAttr);
        onClose();
    };

    const typeConfig = ATTRIBUTE_TYPES.find(t => t.id === formData.type);
    const needsOptions = typeConfig?.hasOptions;
    const needsUnit = formData.type === 'number';

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/30" onClick={onClose} />
            <div className="relative w-[50vw] min-w-[600px] bg-white h-full shadow-xl flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h2 className="text-lg font-semibold">{attribute ? '编辑属性' : '新建属性'}</h2>
                    <IconButton icon={X} onClick={onClose} />
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    {/* 基本信息 */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">属性编码 *</label>
                            <Input
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                placeholder="如 COLOR"
                            />
                            <p className="text-xs text-gray-400 mt-1">系统内部使用的唯一标识</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">简写编码 *</label>
                            <Input
                                value={formData.shortCode}
                                onChange={(e) => setFormData({ ...formData, shortCode: e.target.value.toUpperCase() })}
                                placeholder="如 CLR"
                            />
                            <p className="text-xs text-gray-400 mt-1">用于生成产品SKU编码</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">属性名称 *</label>
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="如 颜色"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">所属分组 *</label>
                            <Select
                                value={formData.groupId}
                                onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
                                options={ATTRIBUTE_GROUPS.map(g => ({ value: g.id, label: g.name }))}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">属性类型 *</label>
                            <Select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value, options: [] })}
                                options={ATTRIBUTE_TYPES.map(t => ({ value: t.id, label: t.name }))}
                                className="w-full"
                            />
                        </div>
                    </div>

                    {/* 数字类型的单位 */}
                    {needsUnit && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">单位</label>
                            <Input
                                value={formData.unit}
                                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                placeholder="如 cm, g, kg"
                            />
                        </div>
                    )}

                    {/* 选择类型的选项配置 */}
                    {needsOptions && (
                        <OptionEditor
                            options={formData.options}
                            onChange={(newOptions) => setFormData({ ...formData, options: newOptions })}
                        />
                    )}

                    {/* 描述 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="属性用途说明"
                            rows={2}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* 开关选项 */}
                    <div className="flex items-center gap-6 pt-2">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.required}
                                onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
                                className="rounded border-gray-300 text-blue-600"
                            />
                            <span className="text-sm text-gray-700">必填属性</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <Toggle
                                checked={formData.isActive}
                                onChange={(v) => setFormData({ ...formData, isActive: v })}
                            />
                            <span className="text-sm text-gray-700">启用</span>
                        </label>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-gray-50">
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

    const groupConfig = ATTRIBUTE_GROUPS.find(g => g.id === attribute.groupId);

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/30" onClick={onClose} />
            <div className="relative w-[50vw] min-w-[600px] bg-white h-full shadow-xl flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg font-semibold">{attribute.name}</h2>
                        <Badge variant={attribute.isActive ? 'success' : 'default'}>
                            {attribute.isActive ? '启用' : '停用'}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                        <SecondaryButton icon={Edit2} size="sm" onClick={() => onEdit(attribute)}>编辑</SecondaryButton>
                        <IconButton icon={X} onClick={onClose} />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* 基本信息 */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">属性编码</p>
                            <code className="text-sm bg-gray-100 px-2 py-1 rounded">{attribute.code}</code>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">简写编码</p>
                            <code className="text-sm bg-blue-50 text-blue-600 px-2 py-1 rounded font-bold">{attribute.shortCode}</code>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">所属分组</p>
                            <span className="text-sm">{groupConfig?.name}</span>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">属性类型</p>
                            <TypeBadge type={attribute.type} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">是否必填</p>
                            <span className="text-sm">{attribute.required ? '是' : '否'}</span>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">引用次数</p>
                            <span className="text-sm">{attribute.refCount.toLocaleString()}</span>
                        </div>
                    </div>

                    {attribute.unit && (
                        <div>
                            <p className="text-xs text-gray-500 mb-1">单位</p>
                            <span className="text-sm">{attribute.unit}</span>
                        </div>
                    )}

                    {attribute.description && (
                        <div>
                            <p className="text-xs text-gray-500 mb-1">描述</p>
                            <p className="text-sm text-gray-700">{attribute.description}</p>
                        </div>
                    )}

                    {/* 选项列表 */}
                    {attribute.options && attribute.options.length > 0 && (
                        <div>
                            <p className="text-xs text-gray-500 mb-2">属性值列表（{attribute.options.length} 个选项）</p>
                            <div className="border rounded-lg overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="px-3 py-2 text-left font-medium text-gray-600">序号</th>
                                            <th className="px-3 py-2 text-left font-medium text-gray-600">显示名称</th>
                                            <th className="px-3 py-2 text-left font-medium text-gray-600">简写编码</th>
                                            <th className="px-3 py-2 text-left font-medium text-gray-600">状态</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {attribute.options.sort((a, b) => a.sort - b.sort).map((opt, idx) => (
                                            <tr key={opt.id} className={!opt.isActive ? 'bg-gray-50 text-gray-400' : ''}>
                                                <td className="px-3 py-2 text-gray-400">{idx + 1}</td>
                                                <td className="px-3 py-2 font-medium">{opt.value}</td>
                                                <td className="px-3 py-2">
                                                    <code className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded font-mono font-bold">{opt.code}</code>
                                                </td>
                                                <td className="px-3 py-2">
                                                    {opt.isActive ? (
                                                        <Badge variant="success">启用</Badge>
                                                    ) : (
                                                        <Badge variant="default">停用</Badge>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* 更新信息 */}
                    <div className="text-xs text-gray-400 pt-4 border-t">
                        <p>创建时间：{attribute.createdAt}</p>
                        <p>更新时间：{attribute.updatedAt}</p>
                    </div>
                </div>
            </div>
        </div>
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
    const [expandedGroups, setExpandedGroups] = useState(ATTRIBUTE_GROUPS.map(g => g.id));

    // 过滤属性
    const filteredAttributes = attributes.filter(attr => {
        const matchesSearch = !searchText ||
            attr.name.toLowerCase().includes(searchText.toLowerCase()) ||
            attr.code.toLowerCase().includes(searchText.toLowerCase()) ||
            attr.shortCode.toLowerCase().includes(searchText.toLowerCase());
        const matchesGroup = !filterGroup || attr.groupId === filterGroup;
        const matchesType = !filterType || attr.type === filterType;
        const matchesStatus = !filterStatus ||
            (filterStatus === 'active' && attr.isActive) ||
            (filterStatus === 'inactive' && !attr.isActive);
        return matchesSearch && matchesGroup && matchesType && matchesStatus;
    });

    // 按分组整理
    const groupedAttributes = ATTRIBUTE_GROUPS.map(group => ({
        ...group,
        attributes: filteredAttributes.filter(a => a.groupId === group.id)
    })).filter(g => g.attributes.length > 0);

    // 统计
    const stats = {
        total: attributes.length,
        active: attributes.filter(a => a.isActive).length,
        required: attributes.filter(a => a.required).length,
        optionsCount: attributes.reduce((sum, a) => sum + (a.options?.length || 0), 0),
    };

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
        setAttributes(prev => prev.map(a =>
            a.id === attrId ? { ...a, isActive: !a.isActive, updatedAt: new Date().toISOString().split('T')[0] } : a
        ));
    };

    const handleSaveAttr = (savedAttr) => {
        setAttributes(prev => {
            const exists = prev.find(a => a.id === savedAttr.id);
            if (exists) {
                return prev.map(a => a.id === savedAttr.id ? savedAttr : a);
            }
            return [...prev, savedAttr];
        });
    };

    const toggleGroup = (groupId) => {
        setExpandedGroups(prev =>
            prev.includes(groupId) ? prev.filter(id => id !== groupId) : [...prev, groupId]
        );
    };

    const getGroupColor = (colorName) => {
        const colors = {
            blue: 'bg-blue-500',
            green: 'bg-green-500',
            purple: 'bg-purple-500',
            orange: 'bg-orange-500',
            red: 'bg-red-500',
        };
        return colors[colorName] || 'bg-gray-500';
    };

    return (
        <div className="space-y-6">
            {/* 页面头部 */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">属性管理</h1>
                    <p className="text-sm text-gray-500 mt-1">管理产品属性及其选项值的编码配置</p>
                </div>
                <div className="flex items-center gap-3">
                    <SecondaryButton icon={Upload}>导入</SecondaryButton>
                    <SecondaryButton icon={Download}>导出</SecondaryButton>
                    <PrimaryButton icon={Plus} onClick={handleAddAttr}>新建属性</PrimaryButton>
                </div>
            </div>

            {/* 统计卡片 */}
            <div className="grid grid-cols-4 gap-4">
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Database className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">属性总数</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                            <Check className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">已启用</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">必填属性</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.required}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                            <Tag className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">选项值总数</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.optionsCount}</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* 搜索和筛选 */}
            <Card className="p-4">
                <div className="flex items-center gap-4">
                    <Input
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="搜索属性名称、编码..."
                        icon={Search}
                        className="w-64"
                    />
                    <Select
                        value={filterGroup}
                        onChange={(e) => setFilterGroup(e.target.value)}
                        options={ATTRIBUTE_GROUPS.map(g => ({ value: g.id, label: g.name }))}
                        placeholder="全部分组"
                        className="w-36"
                    />
                    <Select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        options={ATTRIBUTE_TYPES.map(t => ({ value: t.id, label: t.name }))}
                        placeholder="全部类型"
                        className="w-32"
                    />
                    <Select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        options={[
                            { value: 'active', label: '已启用' },
                            { value: 'inactive', label: '已停用' },
                        ]}
                        placeholder="全部状态"
                        className="w-32"
                    />
                    {(filterGroup || filterType || filterStatus) && (
                        <button
                            onClick={() => { setFilterGroup(''); setFilterType(''); setFilterStatus(''); }}
                            className="text-sm text-blue-600 hover:underline"
                        >
                            清除筛选
                        </button>
                    )}
                </div>
            </Card>

            {/* 属性列表 - 按分组展示 */}
            <div className="space-y-4">
                {groupedAttributes.map(group => (
                    <Card key={group.id} className="overflow-hidden">
                        {/* 分组头部 */}
                        <div
                            className="flex items-center gap-3 px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={() => toggleGroup(group.id)}
                        >
                            <div className={cn('w-1 h-8 rounded', getGroupColor(group.color))} />
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-gray-800">{group.name}</h3>
                                    <span className="text-xs text-gray-400">({group.attributes.length} 个属性)</span>
                                </div>
                                <p className="text-xs text-gray-500">{group.description}</p>
                            </div>
                            {expandedGroups.includes(group.id) ? (
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                            ) : (
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            )}
                        </div>

                        {/* 属性表格 */}
                        {expandedGroups.includes(group.id) && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm min-w-[1000px]">
                                    <thead>
                                        <tr className="border-b border-gray-100">
                                            <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">状态</th>
                                            <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">属性名称</th>
                                            <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">编码 / 简写</th>
                                            <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">类型</th>
                                            <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">必填</th>
                                            <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">选项数 / 单位</th>
                                            <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">选项值示例</th>
                                            <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">操作</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {group.attributes.map(attr => (
                                            <tr key={attr.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3">
                                                    <Toggle
                                                        checked={attr.isActive}
                                                        onChange={() => handleToggleAttr(attr.id)}
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <button
                                                        onClick={() => handleViewAttr(attr)}
                                                        className="text-left hover:text-blue-600"
                                                    >
                                                        <p className="font-medium text-gray-900">{attr.name}</p>
                                                        {attr.description && (
                                                            <p className="text-xs text-gray-400 truncate max-w-xs">{attr.description}</p>
                                                        )}
                                                    </button>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">{attr.code}</code>
                                                        <span className="text-gray-300">/</span>
                                                        <code className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold">{attr.shortCode}</code>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <TypeBadge type={attr.type} />
                                                </td>
                                                <td className="px-4 py-3">
                                                    {attr.required ? (
                                                        <Badge variant="danger">必填</Badge>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {attr.unit ? (
                                                        <span className="text-gray-600">{attr.unit}</span>
                                                    ) : attr.options?.length > 0 ? (
                                                        <span className="text-xs text-purple-600 font-medium">{attr.options.length} 个选项</span>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {attr.options?.length > 0 ? (
                                                        <div className="flex flex-wrap gap-1 max-w-xs">
                                                            {attr.options.slice(0, 3).map(opt => (
                                                                <span key={opt.id} className="inline-flex items-center gap-0.5 text-xs">
                                                                    <span className="text-gray-600">{opt.value}</span>
                                                                    <span className="text-gray-300">=</span>
                                                                    <code className="text-blue-600 font-mono">{opt.code}</code>
                                                                </span>
                                                            ))}
                                                            {attr.options.length > 3 && (
                                                                <span className="text-xs text-gray-400">+{attr.options.length - 3}...</span>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-1">
                                                        <IconButton icon={Edit2} onClick={() => handleEditAttr(attr)} title="编辑" />
                                                        <IconButton icon={Copy} onClick={() => {
                                                            const newAttr = {
                                                                ...attr,
                                                                id: `${Date.now()}`,
                                                                code: `${attr.code}_COPY`,
                                                                shortCode: `${attr.shortCode}2`,
                                                                name: `${attr.name} (副本)`,
                                                                refCount: 0,
                                                                options: attr.options?.map(o => ({ ...o, id: `${o.id}_copy` })) || [],
                                                            };
                                                            setAttributes(prev => [...prev, newAttr]);
                                                        }} title="复制" />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </Card>
                ))}

                {groupedAttributes.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <Database className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>暂无属性数据</p>
                    </div>
                )}
            </div>

            {/* 编辑抽屉 */}
            <AttributeEditDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                attribute={editingAttr}
                onSave={handleSaveAttr}
            />

            {/* 详情抽屉 */}
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
