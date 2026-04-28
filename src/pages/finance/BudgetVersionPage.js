// src/pages/BudgetVersionPage.js
// 预算版本管理页面
import React, { useState } from 'react';
import {
    Search, Plus, Edit2, Trash2, X, Save, Download, Upload,
    FileText, DollarSign, Check,
    Building2, Eye, Lock, Paperclip
} from 'lucide-react';
import { confirm } from '../../components/ui/ConfirmDialog';

// 轻量工具：className 拼接
const cn = (...args) => args.filter(Boolean).join(' ');

// --------------- 成本中心数据（每个预算版本只关联一个成本中心，展示成本中心名称） ---------------
const costCenters = [
    // 欧美事业部
    { code: 'Amazon001', name: 'Amazon' },
    { code: 'Walmart001', name: '沃尔玛' },
    { code: 'eBay001', name: 'eBay' },
    { code: 'USOffline001', name: '美国线下零售' },
    // 亚太事业部
    { code: 'China001', name: '中国' },
    { code: 'EMEA001', name: 'EMEA' },
    { code: 'TKUS001', name: '美国TK' },
    // 全球共享中心
    { code: 'SupplyChainTravel001', name: '供应链-差旅支出' },
    { code: 'HR001', name: 'HR' },
    { code: 'IT001', name: 'IT' },
    { code: 'Finance001', name: '财务' },
    { code: 'CEOOffice001', name: '总裁办' },
    { code: 'ProductDev001', name: '产品开发部' },
    { code: 'ProductRD001', name: '产品研发部' },
];

// --------------- 预算版本数据（每个版本只关联一个成本中心，版本与成本中心名称对应） ---------------
const initialBudgetVersions = [
    // 欧美事业部 - Jason: Amazon / 沃尔玛 / eBay 各一表
    { id: '1', code: 'BV-2024-001', name: '2024 Amazon预算', budgetYear: '2024', effectiveDate: '2024-01-01', totalBudget: 5000000, status: 'active', costCenterCode: 'Amazon001', createdBy: 'Jason', createdAt: '2023-11-15', description: '欧美事业部-Amazon' },
    { id: '2', code: 'BV-2024-002', name: '2024 沃尔玛预算', budgetYear: '2024', effectiveDate: '2024-01-01', totalBudget: 4500000, status: 'active', costCenterCode: 'Walmart001', createdBy: 'Jason', createdAt: '2023-11-15', description: '欧美事业部-沃尔玛' },
    { id: '3', code: 'BV-2024-003', name: '2024 eBay预算', budgetYear: '2024', effectiveDate: '2024-01-01', totalBudget: 3000000, status: 'active', costCenterCode: 'eBay001', createdBy: 'Jason', createdAt: '2023-11-15', description: '欧美事业部-eBay' },
    { id: '4', code: 'BV-2024-004', name: '2024 美国线下零售预算', budgetYear: '2024', effectiveDate: '2024-01-01', totalBudget: 2500000, status: 'active', costCenterCode: 'USOffline001', createdBy: 'Jason', createdAt: '2023-11-16', description: '美国线下零售' },
    // 亚太事业部 - Effie: 中国 / EMEA / 美国TK 各一表
    { id: '5', code: 'BV-2024-005', name: '2024 中国预算', budgetYear: '2024', effectiveDate: '2024-01-01', totalBudget: 4000000, status: 'active', costCenterCode: 'China001', createdBy: 'Effie', createdAt: '2023-11-25', description: '亚太事业部-中国' },
    { id: '6', code: 'BV-2024-006', name: '2024 EMEA预算', budgetYear: '2024', effectiveDate: '2024-01-01', totalBudget: 3500000, status: 'active', costCenterCode: 'EMEA001', createdBy: 'Effie', createdAt: '2023-11-25', description: '亚太事业部-EMEA' },
    { id: '7', code: 'BV-2024-007', name: '2024 美国TK预算', budgetYear: '2024', effectiveDate: '2024-01-01', totalBudget: 2000000, status: 'active', costCenterCode: 'TKUS001', createdBy: 'Effie', createdAt: '2023-11-25', description: '亚太事业部-美国TK' },
    // 全球共享中心 - 供应链差旅 / HR / IT / 财务 / 总裁办 / 产品开发 / 产品研发 各一表
    { id: '8', code: 'BV-2024-SC', name: '2024 供应链差旅支出预算', budgetYear: '2024', effectiveDate: '2024-01-01', totalBudget: 800000, status: 'active', costCenterCode: 'SupplyChainTravel001', createdBy: 'Admin', createdAt: '2023-11-20', description: '供应链-差旅支出' },
    { id: '9', code: 'BV-2024-HR', name: '2024 HR预算', budgetYear: '2024', effectiveDate: '2024-01-01', totalBudget: 1800000, status: 'active', costCenterCode: 'HR001', createdBy: 'Admin', createdAt: '2023-11-18', description: '人力资源' },
    { id: '10', code: 'BV-2024-IT', name: '2024 IT预算', budgetYear: '2024', effectiveDate: '2024-01-01', totalBudget: 3500000, status: 'active', costCenterCode: 'IT001', createdBy: 'Admin', createdAt: '2023-11-20', description: 'IT' },
    { id: '11', code: 'BV-2024-FIN', name: '2024 财务预算', budgetYear: '2024', effectiveDate: '2024-01-01', totalBudget: 2000000, status: 'active', costCenterCode: 'Finance001', createdBy: 'Admin', createdAt: '2023-11-20', description: '财务' },
    { id: '12', code: 'BV-2024-CEO', name: '2024 总裁办预算', budgetYear: '2024', effectiveDate: '2024-01-01', totalBudget: 1200000, status: 'active', costCenterCode: 'CEOOffice001', createdBy: 'Admin', createdAt: '2023-11-20', description: '总裁办' },
    { id: '13', code: 'BV-2024-PD', name: '2024 产品开发部预算', budgetYear: '2024', effectiveDate: '2024-01-01', totalBudget: 2200000, status: 'active', costCenterCode: 'ProductDev001', createdBy: 'Admin', createdAt: '2023-11-20', description: '产品开发部' },
    { id: '14', code: 'BV-2024-RD', name: '2024 产品研发部预算', budgetYear: '2024', effectiveDate: '2024-01-01', totalBudget: 3800000, status: 'active', costCenterCode: 'ProductRD001', createdBy: 'Admin', createdAt: '2023-11-20', description: '产品研发部' },
    // 草稿状态数据
    { id: '15', code: 'BV-2025-001', name: '2025 Amazon预算V1', budgetYear: '2025', effectiveDate: '2025-01-01', totalBudget: 6000000, status: 'draft', costCenterCode: 'Amazon001', createdBy: 'Jason', createdAt: '2024-10-15', description: '2025年度Amazon预算草稿' },
    { id: '16', code: 'BV-2025-002', name: '2025 沃尔玛预算V1', budgetYear: '2025', effectiveDate: '2025-01-01', totalBudget: 5500000, status: 'draft', costCenterCode: 'Walmart001', createdBy: 'Jason', createdAt: '2024-10-15', description: '2025年度沃尔玛预算草稿' },
    { id: '17', code: 'BV-2025-003', name: '2025 中国预算V1', budgetYear: '2025', effectiveDate: '2025-01-01', totalBudget: 5000000, status: 'draft', costCenterCode: 'China001', createdBy: 'Effie', createdAt: '2024-10-20', description: '2025年度中国区域预算草稿' },
    { id: '18', code: 'BV-2025-IT', name: '2025 IT部预算V1', budgetYear: '2025', effectiveDate: '2025-01-01', totalBudget: 4000000, status: 'draft', costCenterCode: 'IT001', createdBy: 'Admin', createdAt: '2024-10-25', description: '2025年度IT部门预算草稿' },
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

const Input = ({ value, onChange, placeholder, className, icon: Icon, disabled, type = 'text' }) => (
    <div className="relative">
        {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon className="w-4 h-4 text-gray-400" />
            </div>
        )}
        <input
            type={type}
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
        purple: 'bg-purple-100 text-purple-700',
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

// --------------- 状态配置 ---------------
const STATUS_CONFIG = {
    draft: { label: '草稿', variant: 'default', icon: FileText },
    active: { label: '生效中', variant: 'success', icon: Check },
    archived: { label: '已归档', variant: 'warning', icon: Lock },
};

// --------------- 预算版本编辑抽屉 ---------------
const BudgetVersionEditDrawer = ({ isOpen, onClose, version, onSave }) => {
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        budgetYear: new Date().getFullYear().toString(),
        effectiveDate: '',
        totalBudget: '',
        status: 'draft',
        costCenterCode: '',
        description: '',
    });

    React.useEffect(() => {
        const cc = version?.costCenterCode ?? (version?.costCenterCodes?.[0] ?? '');
        if (version) {
            setFormData({
                code: version.code,
                name: version.name,
                budgetYear: version.budgetYear,
                effectiveDate: version.effectiveDate,
                totalBudget: String(version.totalBudget ?? ''),
                status: version.status,
                costCenterCode: cc,
                description: version.description || '',
            });
        } else {
            setFormData({
                code: '',
                name: '',
                budgetYear: new Date().getFullYear().toString(),
                effectiveDate: new Date().toISOString().split('T')[0],
                totalBudget: '',
                status: 'draft',
                costCenterCode: '',
                description: '',
            });
        }
    }, [version]);

    const handleSave = () => {
        const isNew = !version;
        const code = isNew
            ? `BV-${formData.budgetYear}-${Date.now().toString(36).slice(-5).toUpperCase()}`
            : formData.code;
        const totalBudget = isNew ? 0 : (parseFloat(formData.totalBudget) || 0);
        const savedData = {
            ...version,
            ...formData,
            id: version?.id || `${Date.now()}`,
            code,
            totalBudget,
            costCenterCode: formData.costCenterCode || undefined,
            createdBy: version?.createdBy || 'Admin',
            createdAt: version?.createdAt || new Date().toISOString().split('T')[0],
        };
        onSave(savedData);
        onClose();
    };

    if (!isOpen) return null;

    const years = ['2023', '2024', '2025', '2026'];

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/30" onClick={onClose} />
            <div className="relative w-[50vw] min-w-[600px] bg-white h-full shadow-xl flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h2 className="text-lg font-semibold">{version ? '编辑预算版本' : '新建预算版本'}</h2>
                    <IconButton icon={X} onClick={onClose} />
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">版本编码</label>
                            <div className="h-9 px-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-600 text-sm flex items-center">
                                {version ? (
                                    <code className="text-xs bg-gray-100 px-2 py-0.5 rounded">{formData.code}</code>
                                ) : (
                                    <span>系统生成（保存时自动生成）</span>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">预算年度 *</label>
                            <Select
                                value={formData.budgetYear}
                                onChange={(e) => setFormData({ ...formData, budgetYear: e.target.value })}
                                options={years.map(y => ({ value: y, label: `${y}年` }))}
                                className="w-full"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">版本名称 *</label>
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="如 2024年度预算V1"
                        />
                    </div>

                    <div className={cn('grid gap-4', version ? 'grid-cols-2' : 'grid-cols-1')}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">生效日期 *</label>
                            <Input
                                type="date"
                                value={formData.effectiveDate}
                                onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                            />
                        </div>
                        {version && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">总预算额 (元)</label>
                                <Input
                                    type="number"
                                    value={formData.totalBudget}
                                    onChange={(e) => setFormData({ ...formData, totalBudget: e.target.value })}
                                    placeholder="15000000"
                                />
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
                        <Select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            options={[
                                { value: 'draft', label: '草稿' },
                                { value: 'active', label: '生效中' },
                                { value: 'archived', label: '已归档' },
                            ]}
                            className="w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">关联成本中心（仅一个）</label>
                        <Select
                            value={formData.costCenterCode}
                            onChange={(e) => setFormData({ ...formData, costCenterCode: e.target.value })}
                            options={[
                                { value: '', label: '请选择成本中心' },
                                ...costCenters.map(cc => ({ value: cc.code, label: cc.name })),
                            ]}
                            className="w-full"
                        />
                        {formData.costCenterCode && (
                            <p className="text-xs text-gray-500 mt-1">
                                {costCenters.find(c => c.code === formData.costCenterCode)?.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="预算版本说明"
                            rows={3}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">附件</label>
                        <div
                            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-colors cursor-pointer"
                        >
                            <Paperclip className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600">点击或拖拽文件到此处上传</p>
                            <p className="text-xs text-gray-400 mt-1">支持 Excel、PDF 等，单文件不超过 10MB</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-gray-50">
                    <SecondaryButton onClick={onClose}>取消</SecondaryButton>
                    <PrimaryButton
                        icon={Save}
                        onClick={handleSave}
                        disabled={!formData.name || !formData.effectiveDate || !formData.costCenterCode}
                    >
                        保存
                    </PrimaryButton>
                </div>
            </div>
        </div>
    );
};

// --------------- 预算详情抽屉（预留，暂未挂载） ---------------
// eslint-disable-next-line no-unused-vars
const BudgetDetailDrawer = ({ isOpen, onClose, version }) => {
    if (!isOpen || !version) return null;

    const statusConfig = STATUS_CONFIG[version.status] || STATUS_CONFIG.draft;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/30" onClick={onClose} />
            <div className="relative w-[50vw] min-w-[600px] bg-white h-full shadow-xl flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg font-semibold">{version.name}</h2>
                        <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                    </div>
                    <IconButton icon={X} onClick={onClose} />
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* 基本信息 */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">版本编码</p>
                            <code className="text-sm bg-gray-100 px-2 py-1 rounded">{version.code}</code>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">预算年度</p>
                            <span className="text-sm font-medium">{version.budgetYear}年</span>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">生效日期</p>
                            <span className="text-sm">{version.effectiveDate}</span>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">创建人</p>
                            <span className="text-sm">{version.createdBy}</span>
                        </div>
                    </div>

                    {/* 总预算额 */}
                    <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-xs text-blue-600 mb-1">总预算额</p>
                        <p className="text-2xl font-bold text-blue-700">
                            ¥ {version.totalBudget.toLocaleString()}
                        </p>
                    </div>

                    {/* 关联成本中心（仅一个，展示名称） */}
                    <div>
                        <p className="text-xs text-gray-500 mb-2">成本中心</p>
                        {(version.costCenterCode || version.costCenterCodes?.[0]) ? (
                            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                <Building2 className="w-4 h-4 text-gray-400" />
                                <span className="text-sm font-medium">
                                    {costCenters.find(c => c.code === (version.costCenterCode || version.costCenterCodes?.[0]))?.name ||
                                        version.costCenterCode || version.costCenterCodes?.[0]}
                                </span>
                            </div>
                        ) : (
                            <span className="text-sm text-gray-400">未关联</span>
                        )}
                    </div>

                    {/* 描述 */}
                    {version.description && (
                        <div>
                            <p className="text-xs text-gray-500 mb-1">描述</p>
                            <p className="text-sm text-gray-700">{version.description}</p>
                        </div>
                    )}

                    {/* 创建信息 */}
                    <div className="text-xs text-gray-400 pt-4 border-t">
                        <p>创建时间：{version.createdAt}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --------------- 主组件 ---------------
export default function BudgetVersionPage({ onOpenDetail }) {
    const [versions, setVersions] = useState(initialBudgetVersions);
    const [searchText, setSearchText] = useState('');
    const [filterYear, setFilterYear] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [editingItem, setEditingItem] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // 过滤数据
    const filteredData = versions.filter(item => {
        const matchesSearch = !searchText ||
            item.name.toLowerCase().includes(searchText.toLowerCase()) ||
            item.code.toLowerCase().includes(searchText.toLowerCase());
        const matchesYear = !filterYear || item.budgetYear === filterYear;
        const matchesStatus = !filterStatus || item.status === filterStatus;
        return matchesSearch && matchesYear && matchesStatus;
    });

    // 统计
    const stats = {
        total: versions.length,
        active: versions.filter(v => v.status === 'active').length,
        draft: versions.filter(v => v.status === 'draft').length,
        totalBudget: versions.filter(v => v.status === 'active').reduce((sum, v) => sum + v.totalBudget, 0),
    };

    const handleAdd = () => {
        setEditingItem(null);
        setIsDrawerOpen(true);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setIsDrawerOpen(true);
    };

    const handleView = (item) => {
        if (onOpenDetail) {
            onOpenDetail({
                id: `budget-version-${item.id}`,
                name: `预算详情: ${item.name}`,
                path: '/finance-gov/budget-version/detail',
                data: item,
            });
        }
    };

    const handleDelete = async (itemId) => {
        const ok = await confirm({
            title: '确认删除',
            description: '确定要删除该预算版本吗？',
            confirmText: '删除',
            cancelText: '取消',
            danger: true,
        });
        if (!ok) return;
        setVersions(prev => prev.filter(item => item.id !== itemId));
    };

    const handleSave = (savedItem) => {
        setVersions(prev => {
            const exists = prev.find(item => item.id === savedItem.id);
            if (exists) {
                return prev.map(item => item.id === savedItem.id ? savedItem : item);
            }
            return [...prev, savedItem];
        });
    };

    const years = [...new Set(versions.map(v => v.budgetYear))].sort().reverse();

    return (
        <div className="space-y-6">
            {/* 页面头部 */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">预算版本管理</h1>
                    <p className="text-sm text-gray-500 mt-1">管理年度预算版本，关联成本中心</p>
                </div>
                <div className="flex items-center gap-3">
                    <PrimaryButton icon={Plus} onClick={handleAdd}>新建预算版本</PrimaryButton>
                </div>
            </div>

            {/* 统计卡片 */}
            <div className="grid grid-cols-4 gap-4">
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">版本总数</p>
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
                            <p className="text-sm text-gray-500">生效中</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-gray-500" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">草稿</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.draft}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">生效预算总额</p>
                            <p className="text-lg font-bold text-gray-900">¥{(stats.totalBudget / 10000).toFixed(0)}万</p>
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
                        placeholder="搜索版本名称、编码..."
                        icon={Search}
                        className="w-64"
                    />
                    <Select
                        value={filterYear}
                        onChange={(e) => setFilterYear(e.target.value)}
                        options={years.map(y => ({ value: y, label: `${y}年` }))}
                        placeholder="全部年度"
                        className="w-32"
                    />
                    <Select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        options={[
                            { value: 'draft', label: '草稿' },
                            { value: 'active', label: '生效中' },
                            { value: 'archived', label: '已归档' },
                        ]}
                        placeholder="全部状态"
                        className="w-32"
                    />
                    {(filterYear || filterStatus) && (
                        <button
                            onClick={() => { setFilterYear(''); setFilterStatus(''); }}
                            className="text-sm text-blue-600 hover:underline"
                        >
                            清除筛选
                        </button>
                    )}
                </div>
            </Card>

            {/* 数据表格 */}
            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b">
                                <th className="px-4 py-3 text-left font-medium text-gray-600">版本编码</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">版本名称</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">预算年度</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">生效日期</th>
                                <th className="px-4 py-3 text-right font-medium text-gray-600">总预算额</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">状态</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">成本中心</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">创建人</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredData.map(item => {
                                const statusConfig = STATUS_CONFIG[item.status] || STATUS_CONFIG.draft;
                                return (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <code className="text-xs bg-gray-100 px-2 py-0.5 rounded">{item.code}</code>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => handleView(item)}
                                                className="font-medium text-gray-900 hover:text-blue-600"
                                            >
                                                {item.name}
                                            </button>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">{item.budgetYear}年</td>
                                        <td className="px-4 py-3 text-gray-600">{item.effectiveDate}</td>
                                        <td className="px-4 py-3 text-right font-medium text-gray-900">
                                            ¥{item.totalBudget.toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm font-medium text-gray-900">
                                                {costCenters.find(c => c.code === (item.costCenterCode ?? item.costCenterCodes?.[0]))?.name ?? (item.costCenterCode || item.costCenterCodes?.[0] || '—')}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">{item.createdBy}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1">
                                                <IconButton icon={Eye} onClick={() => handleView(item)} title="查看" />
                                                <IconButton
                                                    icon={Edit2}
                                                    onClick={() => handleEdit(item)}
                                                    title="编辑"
                                                    disabled={item.status === 'active'}
                                                />
                                                <IconButton
                                                    icon={Trash2}
                                                    onClick={() => handleDelete(item.id)}
                                                    title="删除"
                                                    disabled={item.status === 'active'}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {filteredData.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p>暂无预算版本数据</p>
                        </div>
                    )}
                </div>

                {/* 分页信息 */}
                {filteredData.length > 0 && (
                    <div className="px-4 py-3 border-t bg-gray-50 flex items-center justify-between">
                        <p className="text-sm text-gray-500">共 {filteredData.length} 条记录</p>
                    </div>
                )}
            </Card>

            {/* 编辑抽屉 */}
            <BudgetVersionEditDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                version={editingItem}
                onSave={handleSave}
            />
        </div>
    );
}
