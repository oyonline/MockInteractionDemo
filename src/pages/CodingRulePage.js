// src/pages/CodingRulePage.js
// 编码规则管理页面
import React, { useState } from 'react';
import {
    Search, Plus, Copy, Edit2, Trash2, X, Save,
    Hash, Settings, FileText, Clock, ChevronDown, ChevronRight,
    History, CheckCircle,
    Package, Layers, Box
} from 'lucide-react';

// 轻量工具：className 拼接
const cn = (...args) => args.filter(Boolean).join(' ');

// --------------- 字段类型配置 ---------------
const FIELD_TYPES = [
    { id: 'fixed', name: '固定值', description: '固定的字符串' },
    { id: 'category', name: '类别码', description: '产品分类编码' },
    { id: 'brand', name: '品牌码', description: '品牌简称编码' },
    { id: 'year', name: '年份', description: '2位/4位年份' },
    { id: 'month', name: '月份', description: '2位月份' },
    { id: 'sequence', name: '流水号', description: '自增序列号' },
    { id: 'random', name: '随机码', description: '随机字符' },
    { id: 'custom', name: '自定义', description: '用户输入' },
];

// --------------- 编码规则数据 ---------------
const initialRules = [
    {
        id: '1',
        code: 'RULE_PRODUCT_GENERAL',
        name: '通用产品编码规则',
        icon: Package,
        description: '适用于所有成品类产品的标准编码规则，包含品牌、类目、年份和流水号',
        isActive: true,
        codeLength: 12,
        applicableCategories: ['成品', '组合产品'],
        coverageRate: 78.5,
        usageCount: 15680,
        fields: [
            { id: 'f1', name: '品牌码', type: 'brand', length: 2, required: true, defaultValue: '', example: 'AB' },
            { id: 'f2', name: '类目码', type: 'category', length: 3, required: true, defaultValue: '', example: '001' },
            { id: 'f3', name: '年份', type: 'year', length: 2, required: true, defaultValue: '', example: '24' },
            { id: 'f4', name: '流水号', type: 'sequence', length: 5, required: true, defaultValue: '', example: '00001' },
        ],
        example: 'AB-001-24-00001',
        separator: '-',
        logs: [
            { id: 'l1', action: '创建规则', user: 'Admin', time: '2024-01-15 10:30', detail: '初始化通用产品编码规则' },
            { id: 'l2', action: '修改字段', user: 'Jason', time: '2024-02-20 14:15', detail: '流水号长度从4位调整为5位' },
            { id: 'l3', action: '启用规则', user: 'Admin', time: '2024-02-21 09:00', detail: '规则正式启用' },
        ],
        createdAt: '2024-01-15',
        updatedAt: '2024-02-21',
    },
    {
        id: '2',
        code: 'RULE_PART',
        name: '零件编码规则',
        icon: Settings,
        description: '适用于零部件、配件等物料的编码规则，包含物料类型、供应商和序号',
        isActive: true,
        codeLength: 10,
        applicableCategories: ['零件', '配件', '耗材'],
        coverageRate: 92.3,
        usageCount: 8920,
        fields: [
            { id: 'f1', name: '类型码', type: 'fixed', length: 1, required: true, defaultValue: 'P', example: 'P' },
            { id: 'f2', name: '物料分类', type: 'category', length: 2, required: true, defaultValue: '', example: '01' },
            { id: 'f3', name: '供应商码', type: 'custom', length: 3, required: false, defaultValue: '000', example: 'S01' },
            { id: 'f4', name: '流水号', type: 'sequence', length: 4, required: true, defaultValue: '', example: '0001' },
        ],
        example: 'P-01-S01-0001',
        separator: '-',
        logs: [
            { id: 'l1', action: '创建规则', user: 'Admin', time: '2024-01-15 11:00', detail: '初始化零件编码规则' },
            { id: 'l2', action: '修改字段', user: 'Effie', time: '2024-03-10 16:30', detail: '增加供应商码字段，设为非必填' },
        ],
        createdAt: '2024-01-15',
        updatedAt: '2024-03-10',
    },
    {
        id: '3',
        code: 'RULE_SEMI_PRODUCT',
        name: '半成品编码规则',
        icon: Layers,
        description: '适用于半成品、中间件的编码规则，包含工序、批次和序号',
        isActive: true,
        codeLength: 11,
        applicableCategories: ['半成品', '中间件'],
        coverageRate: 85.7,
        usageCount: 4560,
        fields: [
            { id: 'f1', name: '类型码', type: 'fixed', length: 2, required: true, defaultValue: 'SP', example: 'SP' },
            { id: 'f2', name: '产品线', type: 'category', length: 2, required: true, defaultValue: '', example: '01' },
            { id: 'f3', name: '工序码', type: 'custom', length: 2, required: true, defaultValue: '', example: 'A1' },
            { id: 'f4', name: '流水号', type: 'sequence', length: 5, required: true, defaultValue: '', example: '00001' },
        ],
        example: 'SP-01-A1-00001',
        separator: '-',
        logs: [
            { id: 'l1', action: '创建规则', user: 'Admin', time: '2024-01-16 09:00', detail: '初始化半成品编码规则' },
        ],
        createdAt: '2024-01-16',
        updatedAt: '2024-01-16',
    },
    {
        id: '4',
        code: 'RULE_PACKAGING',
        name: '包装材料编码规则',
        icon: Box,
        description: '适用于包装材料、辅料的编码规则',
        isActive: false,
        codeLength: 8,
        applicableCategories: ['包材', '辅料'],
        coverageRate: 45.2,
        usageCount: 1230,
        fields: [
            { id: 'f1', name: '类型码', type: 'fixed', length: 2, required: true, defaultValue: 'PK', example: 'PK' },
            { id: 'f2', name: '材质码', type: 'category', length: 2, required: true, defaultValue: '', example: '01' },
            { id: 'f3', name: '流水号', type: 'sequence', length: 4, required: true, defaultValue: '', example: '0001' },
        ],
        example: 'PK-01-0001',
        separator: '-',
        logs: [
            { id: 'l1', action: '创建规则', user: 'Admin', time: '2024-02-01 10:00', detail: '初始化包装材料编码规则' },
            { id: 'l2', action: '停用规则', user: 'Tate', time: '2024-03-15 11:00', detail: '暂停使用，待优化' },
        ],
        createdAt: '2024-02-01',
        updatedAt: '2024-03-15',
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

const Select = ({ value, onChange, options, className, placeholder, disabled }) => (
    <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={cn(
            'border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white',
            disabled && 'bg-gray-50 text-gray-500',
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
    };
    return (
        <span className={cn(
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
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
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
            checked ? 'bg-blue-600' : 'bg-gray-200',
            disabled && 'opacity-50 cursor-not-allowed'
        )}
    >
        <span
            className={cn(
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                checked ? 'translate-x-6' : 'translate-x-1'
            )}
        />
    </button>
);

// --------------- 规则卡片组件 ---------------
const RuleCard = ({ rule, onEdit, onCopy, onToggle, onViewLogs, isExpanded, onToggleExpand }) => {
    const Icon = rule.icon;

    return (
        <Card className="overflow-hidden">
            {/* 头部 */}
            <div
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={onToggleExpand}
            >
                <div className="flex items-start gap-4">
                    <div className={cn(
                        'w-12 h-12 rounded-lg flex items-center justify-center',
                        rule.isActive ? 'bg-blue-100' : 'bg-gray-100'
                    )}>
                        <Icon className={cn('w-6 h-6', rule.isActive ? 'text-blue-600' : 'text-gray-400')} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-base font-semibold text-gray-900">{rule.name}</h3>
                            <Badge variant={rule.isActive ? 'success' : 'default'}>
                                {rule.isActive ? '已启用' : '已停用'}
                            </Badge>
                        </div>
                        <p className="text-sm text-gray-500 truncate">{rule.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                            <span>编码长度: {rule.codeLength}位</span>
                            <span>|</span>
                            <span>覆盖率: {rule.coverageRate}%</span>
                            <span>|</span>
                            <span>使用次数: {rule.usageCount.toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Toggle checked={rule.isActive} onChange={() => onToggle(rule.id)} />
                        {isExpanded ? (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                        ) : (
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        )}
                    </div>
                </div>
            </div>

            {/* 展开内容 */}
            {isExpanded && (
                <div className="border-t border-gray-100">
                    {/* 编码示例 */}
                    <div className="p-4 bg-gray-50 border-b border-gray-100">
                        <div className="flex items-center gap-2 mb-2">
                            <Hash className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">编码结构示例</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <code className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-lg font-mono text-lg text-blue-600 tracking-wider">
                                {rule.example}
                            </code>
                            <IconButton icon={Copy} title="复制" onClick={() => navigator.clipboard.writeText(rule.example)} />
                        </div>
                    </div>

                    {/* 适用类别 */}
                    <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center gap-2 mb-2">
                            <Layers className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">适用类别</span>
                            <span className="text-xs text-gray-400">(覆盖率 {rule.coverageRate}%)</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {rule.applicableCategories.map((cat, idx) => (
                                <Badge key={idx} variant="info">{cat}</Badge>
                            ))}
                        </div>
                    </div>

                    {/* 字段配置 */}
                    <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center gap-2 mb-3">
                            <Settings className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">字段配置</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm min-w-[700px]">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="px-3 py-2 text-left font-medium text-gray-600 whitespace-nowrap">序号</th>
                                        <th className="px-3 py-2 text-left font-medium text-gray-600 whitespace-nowrap">字段名称</th>
                                        <th className="px-3 py-2 text-left font-medium text-gray-600 whitespace-nowrap">类型</th>
                                        <th className="px-3 py-2 text-left font-medium text-gray-600 whitespace-nowrap">长度</th>
                                        <th className="px-3 py-2 text-left font-medium text-gray-600 whitespace-nowrap">必填</th>
                                        <th className="px-3 py-2 text-left font-medium text-gray-600 whitespace-nowrap">默认值</th>
                                        <th className="px-3 py-2 text-left font-medium text-gray-600 whitespace-nowrap">示例</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {rule.fields.map((field, idx) => (
                                        <tr key={field.id} className="hover:bg-gray-50">
                                            <td className="px-3 py-2 text-gray-500">{idx + 1}</td>
                                            <td className="px-3 py-2 font-medium text-gray-900">{field.name}</td>
                                            <td className="px-3 py-2">
                                                <Badge variant="default">
                                                    {FIELD_TYPES.find(t => t.id === field.type)?.name || field.type}
                                                </Badge>
                                            </td>
                                            <td className="px-3 py-2 text-gray-600">{field.length}位</td>
                                            <td className="px-3 py-2">
                                                {field.required ? (
                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-3 py-2 text-gray-500 font-mono">
                                                {field.defaultValue || '-'}
                                            </td>
                                            <td className="px-3 py-2 text-blue-600 font-mono">{field.example}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="p-4 flex items-center justify-between bg-gray-50">
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Clock className="w-3 h-3" />
                            <span>创建: {rule.createdAt}</span>
                            <span>|</span>
                            <span>更新: {rule.updatedAt}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <SecondaryButton icon={History} size="sm" onClick={() => onViewLogs(rule)}>
                                修改日志
                            </SecondaryButton>
                            <SecondaryButton icon={Copy} size="sm" onClick={() => onCopy(rule)}>
                                复制规则
                            </SecondaryButton>
                            <PrimaryButton icon={Edit2} size="sm" onClick={() => onEdit(rule)}>
                                编辑
                            </PrimaryButton>
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
};

// --------------- 规则编辑抽屉 ---------------
const RuleEditDrawer = ({ isOpen, onClose, rule, onSave }) => {
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        description: '',
        isActive: true,
        separator: '-',
        applicableCategories: [],
        fields: [],
    });
    const [newCategory, setNewCategory] = useState('');

    React.useEffect(() => {
        if (rule) {
            setFormData({
                code: rule.code,
                name: rule.name,
                description: rule.description,
                isActive: rule.isActive,
                separator: rule.separator,
                applicableCategories: [...rule.applicableCategories],
                fields: rule.fields.map(f => ({ ...f })),
            });
        } else {
            setFormData({
                code: '',
                name: '',
                description: '',
                isActive: true,
                separator: '-',
                applicableCategories: [],
                fields: [{ id: `f_${Date.now()}`, name: '', type: 'fixed', length: 2, required: true, defaultValue: '', example: '' }],
            });
        }
    }, [rule]);

    const handleAddField = () => {
        setFormData(prev => ({
            ...prev,
            fields: [...prev.fields, { id: `f_${Date.now()}`, name: '', type: 'fixed', length: 2, required: true, defaultValue: '', example: '' }]
        }));
    };

    const handleRemoveField = (fieldId) => {
        setFormData(prev => ({
            ...prev,
            fields: prev.fields.filter(f => f.id !== fieldId)
        }));
    };

    const handleFieldChange = (fieldId, key, value) => {
        setFormData(prev => ({
            ...prev,
            fields: prev.fields.map(f => f.id === fieldId ? { ...f, [key]: value } : f)
        }));
    };

    const handleAddCategory = () => {
        if (newCategory && !formData.applicableCategories.includes(newCategory)) {
            setFormData(prev => ({
                ...prev,
                applicableCategories: [...prev.applicableCategories, newCategory]
            }));
            setNewCategory('');
        }
    };

    const handleRemoveCategory = (cat) => {
        setFormData(prev => ({
            ...prev,
            applicableCategories: prev.applicableCategories.filter(c => c !== cat)
        }));
    };

    const calculateCodeLength = () => {
        const fieldsLength = formData.fields.reduce((sum, f) => sum + (parseInt(f.length) || 0), 0);
        const separatorsLength = formData.separator ? (formData.fields.length - 1) * formData.separator.length : 0;
        return fieldsLength + separatorsLength;
    };

    const generateExample = () => {
        return formData.fields.map(f => f.example || 'X'.repeat(f.length)).join(formData.separator);
    };

    const handleSave = () => {
        const savedRule = {
            ...rule,
            ...formData,
            id: rule?.id || `${Date.now()}`,
            icon: rule?.icon || Package,
            codeLength: calculateCodeLength(),
            example: generateExample(),
            coverageRate: rule?.coverageRate || 0,
            usageCount: rule?.usageCount || 0,
            createdAt: rule?.createdAt || new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0],
            logs: rule?.logs || [],
        };
        onSave(savedRule);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/30" onClick={onClose} />
            <div className="relative w-[50vw] min-w-[600px] bg-white h-full shadow-xl flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h2 className="text-lg font-semibold">{rule ? '编辑编码规则' : '新建编码规则'}</h2>
                    <IconButton icon={X} onClick={onClose} />
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* 基本信息 */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-700">基本信息</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">规则编码 *</label>
                                <Input
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    placeholder="如 RULE_PRODUCT_GENERAL"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">规则名称 *</label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="如 通用产品编码规则"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">规则说明</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="描述该编码规则的用途和适用范围"
                                rows={2}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">分隔符</label>
                                <Input
                                    value={formData.separator}
                                    onChange={(e) => setFormData({ ...formData, separator: e.target.value })}
                                    placeholder="-"
                                    className="w-20"
                                />
                            </div>
                            <div className="flex items-center gap-2 pt-6">
                                <Toggle
                                    checked={formData.isActive}
                                    onChange={(v) => setFormData({ ...formData, isActive: v })}
                                />
                                <span className="text-sm text-gray-600">启用规则</span>
                            </div>
                        </div>
                    </div>

                    {/* 适用类别 */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-gray-700">适用类别</h3>
                        <div className="flex flex-wrap gap-2">
                            {formData.applicableCategories.map((cat, idx) => (
                                <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm">
                                    {cat}
                                    <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => handleRemoveCategory(cat)} />
                                </span>
                            ))}
                        </div>
                        <div className="flex items-center gap-2">
                            <Input
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                placeholder="输入类别名称"
                                className="flex-1"
                            />
                            <SecondaryButton icon={Plus} size="sm" onClick={handleAddCategory}>添加</SecondaryButton>
                        </div>
                    </div>

                    {/* 字段配置 */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-700">字段配置</h3>
                            <SecondaryButton icon={Plus} size="sm" onClick={handleAddField}>添加字段</SecondaryButton>
                        </div>
                        <div className="space-y-3">
                            {formData.fields.map((field, idx) => (
                                <div key={field.id} className="p-3 bg-gray-50 rounded-lg space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-medium text-gray-500">字段 {idx + 1}</span>
                                        {formData.fields.length > 1 && (
                                            <IconButton icon={Trash2} onClick={() => handleRemoveField(field.id)} title="删除" />
                                        )}
                                    </div>
                                    <div className="grid grid-cols-4 gap-3">
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">字段名称</label>
                                            <Input
                                                value={field.name}
                                                onChange={(e) => handleFieldChange(field.id, 'name', e.target.value)}
                                                placeholder="名称"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">类型</label>
                                            <Select
                                                value={field.type}
                                                onChange={(e) => handleFieldChange(field.id, 'type', e.target.value)}
                                                options={FIELD_TYPES.map(t => ({ value: t.id, label: t.name }))}
                                                className="w-full"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">长度</label>
                                            <Input
                                                value={field.length}
                                                onChange={(e) => handleFieldChange(field.id, 'length', parseInt(e.target.value) || 0)}
                                                placeholder="2"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">示例值</label>
                                            <Input
                                                value={field.example}
                                                onChange={(e) => handleFieldChange(field.id, 'example', e.target.value)}
                                                placeholder="示例"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <label className="flex items-center gap-2 text-sm text-gray-600">
                                            <input
                                                type="checkbox"
                                                checked={field.required}
                                                onChange={(e) => handleFieldChange(field.id, 'required', e.target.checked)}
                                                className="rounded border-gray-300"
                                            />
                                            必填
                                        </label>
                                        {!field.required && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-500">默认值:</span>
                                                <Input
                                                    value={field.defaultValue}
                                                    onChange={(e) => handleFieldChange(field.id, 'defaultValue', e.target.value)}
                                                    placeholder="默认值"
                                                    className="w-24"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 预览 */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-gray-700">编码预览</h3>
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-600">编码长度: {calculateCodeLength()} 位</span>
                            </div>
                            <code className="block text-lg font-mono text-blue-700 tracking-wider">
                                {generateExample()}
                            </code>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-gray-50">
                    <SecondaryButton onClick={onClose}>取消</SecondaryButton>
                    <PrimaryButton
                        icon={Save}
                        onClick={handleSave}
                        disabled={!formData.code || !formData.name || formData.fields.length === 0}
                    >
                        保存
                    </PrimaryButton>
                </div>
            </div>
        </div>
    );
};

// --------------- 修改日志弹窗 ---------------
const LogsModal = ({ isOpen, onClose, rule }) => {
    if (!isOpen || !rule) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/30" onClick={onClose} />
            <div className="relative w-[50vw] min-w-[600px] bg-white rounded-xl shadow-xl">
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h2 className="text-lg font-semibold">修改日志 - {rule.name}</h2>
                    <IconButton icon={X} onClick={onClose} />
                </div>
                <div className="p-6 max-h-96 overflow-y-auto">
                    {rule.logs.length > 0 ? (
                        <div className="space-y-4">
                            {rule.logs.map((log, idx) => (
                                <div key={log.id} className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className={cn(
                                            'w-8 h-8 rounded-full flex items-center justify-center',
                                            idx === 0 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                                        )}>
                                            <History className="w-4 h-4" />
                                        </div>
                                        {idx < rule.logs.length - 1 && (
                                            <div className="w-px h-full bg-gray-200 my-1" />
                                        )}
                                    </div>
                                    <div className="flex-1 pb-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-gray-900">{log.action}</span>
                                            <span className="text-xs text-gray-400">by {log.user}</span>
                                        </div>
                                        <p className="text-sm text-gray-600">{log.detail}</p>
                                        <p className="text-xs text-gray-400 mt-1">{log.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <History className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p>暂无修改记录</p>
                        </div>
                    )}
                </div>
                <div className="flex justify-end px-6 py-4 border-t bg-gray-50">
                    <SecondaryButton onClick={onClose}>关闭</SecondaryButton>
                </div>
            </div>
        </div>
    );
};

// --------------- 主组件 ---------------
export default function CodingRulePage() {
    const [rules, setRules] = useState(initialRules);
    const [searchText, setSearchText] = useState('');
    const [expandedRuleId, setExpandedRuleId] = useState(null);
    const [editingRule, setEditingRule] = useState(null);
    const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
    const [logsRule, setLogsRule] = useState(null);
    const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);

    // 过滤规则
    const filteredRules = rules.filter(rule =>
        !searchText ||
        rule.name.toLowerCase().includes(searchText.toLowerCase()) ||
        rule.code.toLowerCase().includes(searchText.toLowerCase())
    );

    // 统计
    const stats = {
        total: rules.length,
        active: rules.filter(r => r.isActive).length,
        totalUsage: rules.reduce((sum, r) => sum + r.usageCount, 0),
    };

    const handleAddRule = () => {
        setEditingRule(null);
        setIsEditDrawerOpen(true);
    };

    const handleEditRule = (rule) => {
        setEditingRule(rule);
        setIsEditDrawerOpen(true);
    };

    const handleCopyRule = (rule) => {
        const newRule = {
            ...rule,
            id: `${Date.now()}`,
            code: `${rule.code}_COPY`,
            name: `${rule.name} (副本)`,
            isActive: false,
            usageCount: 0,
            coverageRate: 0,
            createdAt: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0],
            logs: [{ id: `l_${Date.now()}`, action: '复制规则', user: 'Admin', time: new Date().toLocaleString(), detail: `从 ${rule.name} 复制` }],
        };
        setRules(prev => [...prev, newRule]);
    };

    const handleToggleRule = (ruleId) => {
        setRules(prev => prev.map(r => {
            if (r.id === ruleId) {
                const newStatus = !r.isActive;
                return {
                    ...r,
                    isActive: newStatus,
                    logs: [
                        { id: `l_${Date.now()}`, action: newStatus ? '启用规则' : '停用规则', user: 'Admin', time: new Date().toLocaleString(), detail: newStatus ? '规则已启用' : '规则已停用' },
                        ...r.logs,
                    ],
                    updatedAt: new Date().toISOString().split('T')[0],
                };
            }
            return r;
        }));
    };

    const handleViewLogs = (rule) => {
        setLogsRule(rule);
        setIsLogsModalOpen(true);
    };

    const handleSaveRule = (savedRule) => {
        setRules(prev => {
            const exists = prev.find(r => r.id === savedRule.id);
            if (exists) {
                return prev.map(r => r.id === savedRule.id ? {
                    ...savedRule,
                    logs: [
                        { id: `l_${Date.now()}`, action: '修改规则', user: 'Admin', time: new Date().toLocaleString(), detail: '规则配置已更新' },
                        ...(r.logs || []),
                    ],
                } : r);
            }
            return [...prev, {
                ...savedRule,
                logs: [{ id: `l_${Date.now()}`, action: '创建规则', user: 'Admin', time: new Date().toLocaleString(), detail: '新建编码规则' }],
            }];
        });
    };

    return (
        <div className="space-y-6">
            {/* 页面头部 */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">编码规则管理</h1>
                    <p className="text-sm text-gray-500 mt-1">配置产品、零件、半成品等编码生成规则</p>
                </div>
                <PrimaryButton icon={Plus} onClick={handleAddRule}>新建规则</PrimaryButton>
            </div>

            {/* 统计卡片 */}
            <div className="grid grid-cols-3 gap-4">
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">规则总数</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">启用中</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                            <Hash className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">累计生成</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalUsage.toLocaleString()}</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* 搜索栏 */}
            <div className="flex items-center gap-4">
                <Input
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="搜索规则名称或编码..."
                    icon={Search}
                    className="max-w-md"
                />
            </div>

            {/* 规则列表 */}
            <div className="space-y-4">
                {filteredRules.map(rule => (
                    <RuleCard
                        key={rule.id}
                        rule={rule}
                        isExpanded={expandedRuleId === rule.id}
                        onToggleExpand={() => setExpandedRuleId(expandedRuleId === rule.id ? null : rule.id)}
                        onEdit={handleEditRule}
                        onCopy={handleCopyRule}
                        onToggle={handleToggleRule}
                        onViewLogs={handleViewLogs}
                    />
                ))}

                {filteredRules.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <Hash className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>暂无编码规则</p>
                    </div>
                )}
            </div>

            {/* 编辑抽屉 */}
            <RuleEditDrawer
                isOpen={isEditDrawerOpen}
                onClose={() => setIsEditDrawerOpen(false)}
                rule={editingRule}
                onSave={handleSaveRule}
            />

            {/* 修改日志弹窗 */}
            <LogsModal
                isOpen={isLogsModalOpen}
                onClose={() => setIsLogsModalOpen(false)}
                rule={logsRule}
            />
        </div>
    );
}
