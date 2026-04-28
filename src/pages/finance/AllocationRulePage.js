// src/pages/AllocationRulePage.js
// 分摊规则管理页面
import React, { useState } from 'react';
import {
    Search, Plus, Edit2, Trash2, X, Save, Download, Calculator,
    Check, AlertCircle, Building2, DollarSign, Percent, Calendar,
    TrendingUp, Divide, CheckCircle2, XCircle, Clock
} from 'lucide-react';
import { confirm } from '../../components/ui/ConfirmDialog';

const cn = (...args) => args.filter(Boolean).join(' ');

// --------------- 成本中心数据 ---------------
const costCenters = [
    { code: 'Amazon001', name: 'Amazon', department: '欧美事业部' },
    { code: 'Walmart001', name: '沃尔玛', department: '欧美事业部' },
    { code: 'eBay001', name: 'eBay', department: '欧美事业部' },
    { code: 'USOffline001', name: '美国线下零售', department: '欧美事业部' },
    { code: 'China001', name: '中国', department: '亚太事业部' },
    { code: 'EMEA001', name: 'EMEA', department: '亚太事业部' },
    { code: 'TKUS001', name: '美国TK', department: '亚太事业部' },
    { code: 'SupplyChainTravel001', name: '供应链-差旅支出', department: '全球共享中心' },
    { code: 'HR001', name: 'HR', department: '全球共享中心' },
    { code: 'IT001', name: 'IT', department: '全球共享中心' },
    { code: 'Finance001', name: '财务', department: '全球共享中心' },
    { code: 'CEOOffice001', name: '总裁办', department: '全球共享中心' },
    { code: 'ProductDev001', name: '产品开发部', department: '全球共享中心' },
    { code: 'ProductRD001', name: '产品研发部', department: '全球共享中心' },
];

// --------------- 费用科目数据 ---------------
const expenseCategories = [
    { code: 'WAREHOUSE', name: '仓储费', type: '供应链费用' },
    { code: 'LOGISTICS', name: '物流费', type: '供应链费用' },
    { code: 'TRANSPORT', name: '运输费', type: '供应链费用' },
    { code: 'IT_SYSTEM', name: '系统维护费', type: 'IT费用' },
    { code: 'IT_SOFTWARE', name: '软件许可费', type: 'IT费用' },
    { code: 'IT_CLOUD', name: '云服务费用', type: 'IT费用' },
    { code: 'FINANCE_AUDIT', name: '审计费', type: '财务费用' },
    { code: 'FINANCE_BANK', name: '银行手续费', type: '财务费用' },
    { code: 'FINANCE_SALARY', name: '财务人力成本', type: '财务费用' },
    { code: 'HR_SALARY', name: 'HR人力成本', type: '人力费用' },
    { code: 'ADMIN_OFFICE', name: '办公费用', type: '行政费用' },
];

// --------------- Mock销售额数据（自然年累积） ---------------
const salesData = {
    'Amazon001': 28500000,
    'Walmart001': 16800000,
    'eBay001': 9500000,
    'USOffline001': 5200000,
    'China001': 21000000,
    'EMEA001': 13800000,
    'TKUS001': 10800000,
};

// --------------- 初始分摊规则数据 ---------------
const initialAllocationRules = [
    {
        id: '1',
        ruleName: 'IT系统维护费用分摊',
        expenseCategories: ['IT_SYSTEM', 'IT_SOFTWARE'],
        allocationMethod: 'fixedRatio',
        fixedRatios: [
            { costCenterCode: 'Amazon001', ratio: 25 },
            { costCenterCode: 'Walmart001', ratio: 20 },
            { costCenterCode: 'China001', ratio: 25 },
            { costCenterCode: 'EMEA001', ratio: 15 },
            { costCenterCode: 'TKUS001', ratio: 15 },
        ],
        status: 'active',
        effectiveDate: '2024-01-01',
        expiryDate: '2024-12-31',
        createdBy: 'Admin',
        createdAt: '2023-12-15',
        description: 'IT系统维护费用按固定比例分摊到各业务线',
    },
    {
        id: '2',
        ruleName: '供应链仓储费用分摊',
        expenseCategories: ['WAREHOUSE', 'LOGISTICS', 'TRANSPORT'],
        allocationMethod: 'bySales',
        salesBasedConfig: {
            dataSource: '自然年累积销售额',
            excludeZeroSales: true,
        },
        status: 'active',
        effectiveDate: '2024-01-01',
        expiryDate: '2024-12-31',
        createdBy: 'Admin',
        createdAt: '2023-12-20',
        description: '仓储物流费用按销售额比例分摊',
    },
    {
        id: '3',
        ruleName: '财务审计费用分摊',
        expenseCategories: ['FINANCE_AUDIT'],
        allocationMethod: 'fixedRatio',
        fixedRatios: [
            { costCenterCode: 'Amazon001', ratio: 30 },
            { costCenterCode: 'Walmart001', ratio: 25 },
            { costCenterCode: 'China001', ratio: 25 },
            { costCenterCode: 'EMEA001', ratio: 20 },
        ],
        status: 'active',
        effectiveDate: '2024-01-01',
        expiryDate: '2024-12-31',
        createdBy: 'Admin',
        createdAt: '2023-12-25',
        description: '年度审计费用按固定比例分摊',
    },
    {
        id: '4',
        ruleName: 'HR人力成本分摊',
        expenseCategories: ['HR_SALARY'],
        allocationMethod: 'fixedRatio',
        fixedRatios: [
            { costCenterCode: 'Amazon001', ratio: 20 },
            { costCenterCode: 'Walmart001', ratio: 15 },
            { costCenterCode: 'eBay001', ratio: 10 },
            { costCenterCode: 'China001', ratio: 20 },
            { costCenterCode: 'EMEA001', ratio: 15 },
            { costCenterCode: 'TKUS001', ratio: 10 },
            { costCenterCode: 'ProductDev001', ratio: 10 },
        ],
        status: 'inactive',
        effectiveDate: '2024-06-01',
        expiryDate: '2024-12-31',
        createdBy: 'Admin',
        createdAt: '2024-01-10',
        description: 'HR部门人力成本分摊（待生效）',
    },
];

// --------------- UI组件 ---------------
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

const Badge = ({ children, variant = 'default', className }) => {
    const variants = {
        default: 'bg-gray-100 text-gray-700',
        success: 'bg-green-100 text-green-700',
        warning: 'bg-yellow-100 text-yellow-700',
        danger: 'bg-red-100 text-red-700',
        info: 'bg-blue-100 text-blue-700',
    };
    return (
        <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', variants[variant], className)}>
            {children}
        </span>
    );
};

const Card = ({ children, className }) => (
    <div className={cn('bg-white rounded-xl border border-gray-200 shadow-sm', className)}>
        {children}
    </div>
);

const Input = ({ value, onChange, placeholder, className, type = 'text' }) => (
    <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={cn(
            'w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            className
        )}
    />
);

const Select = ({ value, onChange, options, className, placeholder, multiple = false }) => {
    if (multiple) {
        return (
            <select
                multiple
                value={value}
                onChange={onChange}
                className={cn(
                    'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white',
                    className
                )}
                size={4}
            >
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        );
    }
    return (
        <select
            value={value}
            onChange={onChange}
            className={cn(
                'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white',
                className
            )}
        >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
    );
};

// --------------- 计算分摊比例（按销售额） ---------------
const calculateSalesBasedAllocation = (costCenterCodes) => {
    const validCenters = costCenterCodes.filter(code => salesData[code] && salesData[code] > 0);
    const totalSales = validCenters.reduce((sum, code) => sum + salesData[code], 0);
    
    if (totalSales === 0) return [];
    
    return validCenters.map(code => ({
        costCenterCode: code,
        ratio: parseFloat(((salesData[code] / totalSales) * 100).toFixed(2)),
        sales: salesData[code],
    }));
};

// --------------- 验证比例总和 ---------------
const validateRatioSum = (ratios) => {
    const sum = ratios.reduce((acc, r) => acc + (parseFloat(r.ratio) || 0), 0);
    return Math.abs(sum - 100) < 0.01;
};

// --------------- 分摊规则编辑抽屉 ---------------
const AllocationRuleDrawer = ({ isOpen, onClose, rule, onSave }) => {
    const [formData, setFormData] = useState({
        ruleName: '',
        expenseCategories: [],
        allocationMethod: 'fixedRatio',
        fixedRatios: [],
        salesBasedConfig: {
            dataSource: '自然年累积销售额',
            excludeZeroSales: true,
        },
        status: 'active',
        effectiveDate: '',
        expiryDate: '',
        description: '',
    });
    const [ratioError, setRatioError] = useState('');
    const [showSimulation, setShowSimulation] = useState(false);
    const [simulationAmount, setSimulationAmount] = useState(100000);

    React.useEffect(() => {
        if (rule) {
            setFormData({
                ruleName: rule.ruleName,
                expenseCategories: rule.expenseCategories || [],
                allocationMethod: rule.allocationMethod,
                fixedRatios: rule.fixedRatios || [],
                salesBasedConfig: rule.salesBasedConfig || {
                    dataSource: '自然年累积销售额',
                    excludeZeroSales: true,
                },
                status: rule.status,
                effectiveDate: rule.effectiveDate,
                expiryDate: rule.expiryDate,
                description: rule.description || '',
            });
        } else {
            setFormData({
                ruleName: '',
                expenseCategories: [],
                allocationMethod: 'fixedRatio',
                fixedRatios: [],
                salesBasedConfig: {
                    dataSource: '自然年累积销售额',
                    excludeZeroSales: true,
                },
                status: 'active',
                effectiveDate: new Date().toISOString().split('T')[0],
                expiryDate: new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0],
                description: '',
            });
        }
        setRatioError('');
        setShowSimulation(false);
    }, [rule, isOpen]);

    // 添加分摊对象
    const handleAddCostCenter = () => {
        const availableCenters = costCenters.filter(
            cc => !formData.fixedRatios.some(r => r.costCenterCode === cc.code)
        );
        if (availableCenters.length > 0) {
            const newRatios = [
                ...formData.fixedRatios,
                { costCenterCode: availableCenters[0].code, ratio: 0 }
            ];
            setFormData({ ...formData, fixedRatios: newRatios });
            validateRatios(newRatios);
        }
    };

    // 删除分摊对象
    const handleRemoveCostCenter = (index) => {
        const newRatios = formData.fixedRatios.filter((_, i) => i !== index);
        setFormData({ ...formData, fixedRatios: newRatios });
        validateRatios(newRatios);
    };

    // 修改比例
    const handleRatioChange = (index, value) => {
        const newRatios = [...formData.fixedRatios];
        newRatios[index].ratio = parseFloat(value) || 0;
        setFormData({ ...formData, fixedRatios: newRatios });
        validateRatios(newRatios);
    };

    // 修改成本中心
    const handleCostCenterChange = (index, code) => {
        const newRatios = [...formData.fixedRatios];
        newRatios[index].costCenterCode = code;
        setFormData({ ...formData, fixedRatios: newRatios });
    };

    // 验证比例
    const validateRatios = (ratios) => {
        if (formData.allocationMethod === 'fixedRatio') {
            const sum = ratios.reduce((acc, r) => acc + (parseFloat(r.ratio) || 0), 0);
            if (Math.abs(sum - 100) > 0.01) {
                setRatioError(`比例总和为 ${sum.toFixed(2)}%，必须为 100%`);
                return false;
            }
        }
        setRatioError('');
        return true;
    };

    // 自动计算销售额分摊比例
    const handleCalculateSalesRatio = () => {
        const allCenterCodes = costCenters.map(cc => cc.code);
        const calculated = calculateSalesBasedAllocation(allCenterCodes);
        setFormData({ ...formData, fixedRatios: calculated });
        setShowSimulation(true);
    };

    // 处理保存
    const handleSave = () => {
        if (formData.allocationMethod === 'fixedRatio' && !validateRatios(formData.fixedRatios)) {
            return;
        }
        
        const savedData = {
            ...formData,
            id: rule?.id || `${Date.now()}`,
            createdBy: rule?.createdBy || 'Admin',
            createdAt: rule?.createdAt || new Date().toISOString().split('T')[0],
        };
        onSave(savedData);
        onClose();
    };

    // 模拟分摊计算
    const getSimulationResult = () => {
        if (formData.allocationMethod === 'fixedRatio') {
            return formData.fixedRatios.map(r => ({
                ...r,
                amount: (simulationAmount * r.ratio) / 100,
            }));
        } else {
            const calculated = calculateSalesBasedAllocation(costCenters.map(cc => cc.code));
            return calculated.map(r => ({
                ...r,
                amount: (simulationAmount * r.ratio) / 100,
            }));
        }
    };

    if (!isOpen) return null;

    const ratioSum = formData.fixedRatios.reduce((acc, r) => acc + (parseFloat(r.ratio) || 0), 0);
    const isRatioValid = Math.abs(ratioSum - 100) < 0.01;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/30" onClick={onClose} />
            <div className="relative w-[50vw] min-w-[600px] bg-white h-full shadow-xl flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h2 className="text-lg font-semibold">{rule ? '编辑分摊规则' : '新建分摊规则'}</h2>
                    <IconButton icon={X} onClick={onClose} />
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    {/* 规则名称 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">规则名称 *</label>
                        <Input
                            value={formData.ruleName}
                            onChange={(e) => setFormData({ ...formData, ruleName: e.target.value })}
                            placeholder="如：IT系统维护费用分摊"
                        />
                    </div>

                    {/* 费用科目（多选） */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">分摊费用科目 *</label>
                        <div className="border border-gray-300 rounded-lg p-3 max-h-40 overflow-y-auto">
                            {expenseCategories.map(cat => (
                                <label key={cat.code} className="flex items-center gap-2 py-1.5 hover:bg-gray-50 rounded px-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.expenseCategories.includes(cat.code)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setFormData({ ...formData, expenseCategories: [...formData.expenseCategories, cat.code] });
                                            } else {
                                                setFormData({ ...formData, expenseCategories: formData.expenseCategories.filter(c => c !== cat.code) });
                                            }
                                        }}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">{cat.name}</span>
                                    <span className="text-xs text-gray-400">({cat.type})</span>
                                </label>
                            ))}
                        </div>
                        {formData.expenseCategories.length > 0 && (
                            <p className="text-xs text-gray-500 mt-1">
                                已选择 {formData.expenseCategories.length} 个费用科目
                            </p>
                        )}
                    </div>

                    {/* 分摊方式 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">分摊方式 *</label>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setFormData({ ...formData, allocationMethod: 'fixedRatio' })}
                                className={cn(
                                    'flex-1 flex items-center gap-3 p-4 rounded-lg border-2 transition-colors',
                                    formData.allocationMethod === 'fixedRatio'
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                )}
                            >
                                <Divide className="w-6 h-6 text-blue-600" />
                                <div className="text-left">
                                    <div className="font-medium text-gray-900">固定比例</div>
                                    <div className="text-xs text-gray-500">手动设置各成本中心分摊比例</div>
                                </div>
                            </button>
                            <button
                                onClick={() => setFormData({ ...formData, allocationMethod: 'bySales' })}
                                className={cn(
                                    'flex-1 flex items-center gap-3 p-4 rounded-lg border-2 transition-colors',
                                    formData.allocationMethod === 'bySales'
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                )}
                            >
                                <TrendingUp className="w-6 h-6 text-green-600" />
                                <div className="text-left">
                                    <div className="font-medium text-gray-900">按销售额分摊</div>
                                    <div className="text-xs text-gray-500">按自然年累积销售额比例自动分摊</div>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* 固定比例设置 */}
                    {formData.allocationMethod === 'fixedRatio' && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-medium text-gray-700">分摊比例设置 *</label>
                                <div className="flex items-center gap-2">
                                    <span className={cn('text-sm font-medium', isRatioValid ? 'text-green-600' : 'text-red-600')}>
                                        合计: {ratioSum.toFixed(2)}%
                                    </span>
                                    {isRatioValid ? <Check className="w-4 h-4 text-green-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
                                </div>
                            </div>
                            
                            {ratioError && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                                    {ratioError}
                                </div>
                            )}

                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                {formData.fixedRatios.map((ratio, index) => (
                                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                        <Select
                                            value={ratio.costCenterCode}
                                            onChange={(e) => handleCostCenterChange(index, e.target.value)}
                                            options={costCenters
                                                .filter(cc => cc.code === ratio.costCenterCode || !formData.fixedRatios.some(r => r.costCenterCode === cc.code))
                                                .map(cc => ({ value: cc.code, label: `${cc.name} (${cc.department})` }))}
                                            className="flex-1"
                                        />
                                        <div className="flex items-center gap-2 w-32">
                                            <Input
                                                type="number"
                                                value={ratio.ratio}
                                                onChange={(e) => handleRatioChange(index, e.target.value)}
                                                className="text-right"
                                                placeholder="0"
                                            />
                                            <span className="text-sm text-gray-500">%</span>
                                        </div>
                                        <IconButton
                                            icon={X}
                                            onClick={() => handleRemoveCostCenter(index)}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                        />
                                    </div>
                                ))}
                            </div>

                            <SecondaryButton
                                onClick={handleAddCostCenter}
                                icon={Plus}
                                size="sm"
                                className="w-full justify-center"
                            >
                                添加分摊对象
                            </SecondaryButton>
                        </div>
                    )}

                    {/* 按销售额分摊配置 */}
                    {formData.allocationMethod === 'bySales' && (
                        <div className="p-4 bg-green-50 rounded-lg space-y-3">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-green-600" />
                                <span className="font-medium text-gray-900">按销售额分摊配置</span>
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                                <p>• 数据来源：自然年累积销售额</p>
                                <p>• 销售额为0的成本中心：不参与分摊</p>
                                <p>• 分摊比例自动计算，无需手动设置</p>
                            </div>
                            <SecondaryButton
                                onClick={handleCalculateSalesRatio}
                                icon={Calculator}
                                size="sm"
                            >
                                预览分摊比例
                            </SecondaryButton>
                            
                            {formData.fixedRatios.length > 0 && formData.allocationMethod === 'bySales' && (
                                <div className="mt-3 p-3 bg-white rounded border">
                                    <p className="text-xs font-medium text-gray-500 mb-2">基于当前销售额的自动计算结果：</p>
                                    <div className="space-y-1">
                                        {formData.fixedRatios.map(r => {
                                            const cc = costCenters.find(c => c.code === r.costCenterCode);
                                            return (
                                                <div key={r.costCenterCode} className="flex justify-between text-sm">
                                                    <span>{cc?.name}</span>
                                                    <span className="font-medium">{r.ratio}% (¥{(r.sales / 10000).toFixed(0)}万)</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 生效时间 */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">生效日期 *</label>
                            <Input
                                type="date"
                                value={formData.effectiveDate}
                                onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">失效日期 *</label>
                            <Input
                                type="date"
                                value={formData.expiryDate}
                                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* 状态 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">规则状态</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    checked={formData.status === 'active'}
                                    onChange={() => setFormData({ ...formData, status: 'active' })}
                                    className="text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">启用</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    checked={formData.status === 'inactive'}
                                    onChange={() => setFormData({ ...formData, status: 'inactive' })}
                                    className="text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">停用</span>
                            </label>
                        </div>
                    </div>

                    {/* 描述 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">规则说明</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="输入规则说明..."
                            rows={3}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* 模拟分摊计算 */}
                    {formData.fixedRatios.length > 0 && (
                        <div className="border-t pt-5">
                            <div className="flex items-center justify-between mb-3">
                                <span className="font-medium text-gray-700">模拟分摊计算</span>
                                <button
                                    onClick={() => setShowSimulation(!showSimulation)}
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    {showSimulation ? '隐藏' : '展开'}
                                </button>
                            </div>
                            
                            {showSimulation && (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-gray-600">待分摊金额：</span>
                                        <Input
                                            type="number"
                                            value={simulationAmount}
                                            onChange={(e) => setSimulationAmount(parseFloat(e.target.value) || 0)}
                                            className="w-40"
                                        />
                                        <span className="text-sm text-gray-500">元</span>
                                    </div>
                                    
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="text-gray-500 border-b">
                                                    <th className="text-left py-2">成本中心</th>
                                                    <th className="text-right py-2">比例</th>
                                                    <th className="text-right py-2">分摊金额</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {getSimulationResult().map((r, idx) => {
                                                    const cc = costCenters.find(c => c.code === r.costCenterCode);
                                                    return (
                                                        <tr key={idx} className="border-b border-gray-200 last:border-0">
                                                            <td className="py-2">{cc?.name}</td>
                                                            <td className="text-right py-2">{r.ratio}%</td>
                                                            <td className="text-right py-2 font-medium">¥{r.amount.toLocaleString()}</td>
                                                        </tr>
                                                    );
                                                })}
                                                <tr className="font-medium text-gray-900">
                                                    <td className="py-2">合计</td>
                                                    <td className="text-right py-2">100%</td>
                                                    <td className="text-right py-2">¥{simulationAmount.toLocaleString()}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-gray-50">
                    <SecondaryButton onClick={onClose}>取消</SecondaryButton>
                    <PrimaryButton
                        icon={Save}
                        onClick={handleSave}
                        disabled={!formData.ruleName || formData.expenseCategories.length === 0 || 
                                 (formData.allocationMethod === 'fixedRatio' && !isRatioValid) ||
                                 (formData.allocationMethod === 'fixedRatio' && formData.fixedRatios.length === 0) ||
                                 !formData.effectiveDate || !formData.expiryDate}
                    >
                        保存
                    </PrimaryButton>
                </div>
            </div>
        </div>
    );
};

// --------------- 主组件 ---------------
export default function AllocationRulePage() {
    const [rules, setRules] = useState(initialAllocationRules);
    const [searchText, setSearchText] = useState('');
    const [filterMethod, setFilterMethod] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [editingRule, setEditingRule] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // 过滤数据
    const filteredData = rules.filter(item => {
        const matchesSearch = !searchText ||
            item.ruleName.toLowerCase().includes(searchText.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchText.toLowerCase());
        const matchesMethod = !filterMethod || item.allocationMethod === filterMethod;
        const matchesStatus = !filterStatus || item.status === filterStatus;
        return matchesSearch && matchesMethod && matchesStatus;
    });

    // 统计
    const stats = {
        total: rules.length,
        active: rules.filter(r => r.status === 'active').length,
        inactive: rules.filter(r => r.status === 'inactive').length,
        fixedRatio: rules.filter(r => r.allocationMethod === 'fixedRatio').length,
        bySales: rules.filter(r => r.allocationMethod === 'bySales').length,
    };

    const handleAdd = () => {
        setEditingRule(null);
        setIsDrawerOpen(true);
    };

    const handleEdit = (rule) => {
        setEditingRule(rule);
        setIsDrawerOpen(true);
    };

    const handleDelete = async (ruleId) => {
        const ok = await confirm({
            title: '确认删除',
            description: '确定要删除该分摊规则吗？',
            confirmText: '删除',
            cancelText: '取消',
            danger: true,
        });
        if (!ok) return;
        setRules(prev => prev.filter(r => r.id !== ruleId));
    };

    const handleSave = (savedRule) => {
        setRules(prev => {
            const exists = prev.find(r => r.id === savedRule.id);
            if (exists) {
                return prev.map(r => r.id === savedRule.id ? savedRule : r);
            }
            return [...prev, savedRule];
        });
    };

    const handleToggleStatus = (rule) => {
        const newStatus = rule.status === 'active' ? 'inactive' : 'active';
        setRules(prev => prev.map(r => r.id === rule.id ? { ...r, status: newStatus } : r));
    };

    // 获取费用科目名称
    const getExpenseCategoryNames = (codes) => {
        return codes.map(code => {
            const cat = expenseCategories.find(c => c.code === code);
            return cat?.name || code;
        }).join('、');
    };

    return (
        <div className="space-y-6">
            {/* 页面头部 */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">分摊规则管理</h1>
                    <p className="text-sm text-gray-500 mt-1">配置费用分摊规则，支持固定比例和按销售额分摊</p>
                </div>
                <PrimaryButton icon={Plus} onClick={handleAdd}>新建分摊规则</PrimaryButton>
            </div>

            {/* 统计卡片 */}
            <div className="grid grid-cols-4 gap-4">
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Divide className="w-5 h-5 text-blue-600" />
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
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">已启用</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                            <Percent className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">固定比例</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.fixedRatio}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">按销售额</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.bySales}</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* 搜索和筛选 */}
            <Card className="p-4">
                <div className="flex items-center gap-4 flex-wrap">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            placeholder="搜索规则名称..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <Select
                        value={filterMethod}
                        onChange={(e) => setFilterMethod(e.target.value)}
                        options={[
                            { value: 'fixedRatio', label: '固定比例' },
                            { value: 'bySales', label: '按销售额' },
                        ]}
                        placeholder="全部分摊方式"
                        className="w-40"
                    />
                    <Select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        options={[
                            { value: 'active', label: '启用' },
                            { value: 'inactive', label: '停用' },
                        ]}
                        placeholder="全部状态"
                        className="w-32"
                    />
                    {(filterMethod || filterStatus) && (
                        <button
                            onClick={() => { setFilterMethod(''); setFilterStatus(''); }}
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
                                <th className="px-4 py-3 text-left font-medium text-gray-600">规则名称</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">分摊费用</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">分摊方式</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">分摊对象数</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">生效时间</th>
                                <th className="px-4 py-3 text-center font-medium text-gray-600">状态</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredData.map(item => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div>
                                            <span className="font-medium text-gray-900">{item.ruleName}</span>
                                            {item.description && (
                                                <p className="text-xs text-gray-500 mt-0.5 truncate max-w-xs">{item.description}</p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-gray-700 truncate max-w-xs block" title={getExpenseCategoryNames(item.expenseCategories)}>
                                            {getExpenseCategoryNames(item.expenseCategories)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        {item.allocationMethod === 'fixedRatio' ? (
                                            <div className="flex items-center gap-2">
                                                <Divide className="w-4 h-4 text-purple-600" />
                                                <span className="text-gray-700">固定比例</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <TrendingUp className="w-4 h-4 text-orange-600" />
                                                <span className="text-gray-700">按销售额</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-gray-700">{item.fixedRatios?.length || 0} 个成本中心</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-gray-600">
                                            <div>{item.effectiveDate}</div>
                                            <div className="text-xs text-gray-400">至 {item.expiryDate}</div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={() => handleToggleStatus(item)}
                                            className={cn(
                                                'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors',
                                                item.status === 'active'
                                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            )}
                                        >
                                            {item.status === 'active' ? (
                                                <><Check className="w-3 h-3" /> 启用</>
                                            ) : (
                                                <><XCircle className="w-3 h-3" /> 停用</>
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1">
                                            <IconButton icon={Edit2} onClick={() => handleEdit(item)} title="编辑" />
                                            <IconButton icon={Trash2} onClick={() => handleDelete(item.id)} title="删除" />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredData.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            <Divide className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p>暂无分摊规则</p>
                        </div>
                    )}
                </div>

                {filteredData.length > 0 && (
                    <div className="px-4 py-3 border-t bg-gray-50 flex items-center justify-between">
                        <p className="text-sm text-gray-500">共 {filteredData.length} 条记录</p>
                    </div>
                )}
            </Card>

            {/* 编辑抽屉 */}
            <AllocationRuleDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                rule={editingRule}
                onSave={handleSave}
            />
        </div>
    );
}
