// src/pages/CostAnalysisPage.js
// 成本分析列表页面
import React, { useState } from 'react';
import {
    Search, Download, Filter, ChevronRight, TrendingUp, TrendingDown,
    DollarSign, PieChart, AlertTriangle, CheckCircle, Building2,
    Calendar, BarChart3, Eye, FileText
} from 'lucide-react';

// 轻量工具：className 拼接
const cn = (...args) => args.filter(Boolean).join(' ');

// --------------- 成本中心数据 ---------------
const costCenters = [
    { code: 'Amazon001', name: 'Amazon' },
    { code: 'Walmart001', name: '沃尔玛' },
    { code: 'eBay001', name: 'eBay' },
    { code: 'USOffline001', name: '美国线下零售' },
    { code: 'China001', name: '中国' },
    { code: 'EMEA001', name: 'EMEA' },
    { code: 'TKUS001', name: '美国TK' },
    { code: 'SupplyChainTravel001', name: '供应链-差旅支出' },
    { code: 'HR001', name: 'HR' },
    { code: 'IT001', name: 'IT' },
    { code: 'Finance001', name: '财务' },
    { code: 'CEOOffice001', name: '总裁办' },
    { code: 'ProductDev001', name: '产品开发部' },
    { code: 'ProductRD001', name: '产品研发部' },
];

// --------------- 费用类别数据 ---------------
const expenseCategories = [
    { code: 'SALES', name: '销售费用', parent: null },
    { code: 'SALES_MARKETING', name: '站内营销费用', parent: 'SALES' },
    { code: 'SALES_DIGITAL', name: '数字营销费用', parent: 'SALES' },
    { code: 'SALES_PLATFORM', name: '平台交易费', parent: 'SALES' },
    { code: 'SALES_LOGISTICS', name: '物流及仓储费', parent: 'SALES' },
    { code: 'ADMIN', name: '管理费用', parent: null },
    { code: 'ADMIN_HR', name: '人力成本', parent: 'ADMIN' },
    { code: 'ADMIN_RENT', name: '租金和公用事业', parent: 'ADMIN' },
    { code: 'ADMIN_OFFICE', name: '办公用品费用', parent: 'ADMIN' },
    { code: 'ADMIN_DEPREC', name: '折旧与摊销', parent: 'ADMIN' },
    { code: 'ADMIN_TRAVEL', name: '差旅住宿费用', parent: 'ADMIN' },
    { code: 'RD', name: '研发费用', parent: null },
    { code: 'RD_MATERIAL', name: '研发材料费', parent: 'RD' },
    { code: 'RD_LABOR', name: '研发人工费', parent: 'RD' },
];

// --------------- 成本分析mock数据 ---------------
const initialCostAnalysisData = [
    // Amazon成本中心
    { id: '1', costCenterCode: 'Amazon001', categoryCode: 'SALES_MARKETING', period: '2024-01', actualCost: 520000, budgetCost: 500000, variance: 20000, varianceRate: 4.0, status: 'warning', createdAt: '2024-01-31' },
    { id: '2', costCenterCode: 'Amazon001', categoryCode: 'SALES_LOGISTICS', period: '2024-01', actualCost: 380000, budgetCost: 400000, variance: -20000, varianceRate: -5.0, status: 'normal', createdAt: '2024-01-31' },
    { id: '3', costCenterCode: 'Amazon001', categoryCode: 'SALES_PLATFORM', period: '2024-01', actualCost: 210000, budgetCost: 200000, variance: 10000, varianceRate: 5.0, status: 'warning', createdAt: '2024-01-31' },
    { id: '4', costCenterCode: 'Amazon001', categoryCode: 'ADMIN_OFFICE', period: '2024-01', actualCost: 45000, budgetCost: 50000, variance: -5000, varianceRate: -10.0, status: 'normal', createdAt: '2024-01-31' },
    { id: '5', costCenterCode: 'Amazon001', categoryCode: 'SALES_MARKETING', period: '2024-02', actualCost: 580000, budgetCost: 500000, variance: 80000, varianceRate: 16.0, status: 'overrun', createdAt: '2024-02-29' },
    { id: '6', costCenterCode: 'Amazon001', categoryCode: 'SALES_LOGISTICS', period: '2024-02', actualCost: 395000, budgetCost: 400000, variance: -5000, varianceRate: -1.25, status: 'normal', createdAt: '2024-02-29' },
    
    // 沃尔玛成本中心
    { id: '7', costCenterCode: 'Walmart001', categoryCode: 'SALES_MARKETING', period: '2024-01', actualCost: 320000, budgetCost: 350000, variance: -30000, varianceRate: -8.57, status: 'normal', createdAt: '2024-01-31' },
    { id: '8', costCenterCode: 'Walmart001', categoryCode: 'SALES_LOGISTICS', period: '2024-01', actualCost: 280000, budgetCost: 300000, variance: -20000, varianceRate: -6.67, status: 'normal', createdAt: '2024-01-31' },
    { id: '9', costCenterCode: 'Walmart001', categoryCode: 'SALES_MARKETING', period: '2024-02', actualCost: 365000, budgetCost: 350000, variance: 15000, varianceRate: 4.29, status: 'warning', createdAt: '2024-02-29' },
    { id: '10', costCenterCode: 'Walmart001', categoryCode: 'ADMIN_HR', period: '2024-01', actualCost: 120000, budgetCost: 120000, variance: 0, varianceRate: 0, status: 'normal', createdAt: '2024-01-31' },
    
    // eBay成本中心
    { id: '11', costCenterCode: 'eBay001', categoryCode: 'SALES_MARKETING', period: '2024-01', actualCost: 185000, budgetCost: 200000, variance: -15000, varianceRate: -7.5, status: 'normal', createdAt: '2024-01-31' },
    { id: '12', costCenterCode: 'eBay001', categoryCode: 'SALES_PLATFORM', period: '2024-01', actualCost: 95000, budgetCost: 100000, variance: -5000, varianceRate: -5.0, status: 'normal', createdAt: '2024-01-31' },
    { id: '13', costCenterCode: 'eBay001', categoryCode: 'SALES_MARKETING', period: '2024-02', actualCost: 225000, budgetCost: 200000, variance: 25000, varianceRate: 12.5, status: 'overrun', createdAt: '2024-02-29' },
    
    // 中国成本中心
    { id: '14', costCenterCode: 'China001', categoryCode: 'SALES_MARKETING', period: '2024-01', actualCost: 420000, budgetCost: 400000, variance: 20000, varianceRate: 5.0, status: 'warning', createdAt: '2024-01-31' },
    { id: '15', costCenterCode: 'China001', categoryCode: 'SALES_LOGISTICS', period: '2024-01', actualCost: 310000, budgetCost: 320000, variance: -10000, varianceRate: -3.13, status: 'normal', createdAt: '2024-01-31' },
    { id: '16', costCenterCode: 'China001', categoryCode: 'ADMIN_TRAVEL', period: '2024-01', actualCost: 85000, budgetCost: 80000, variance: 5000, varianceRate: 6.25, status: 'warning', createdAt: '2024-01-31' },
    { id: '17', costCenterCode: 'China001', categoryCode: 'SALES_MARKETING', period: '2024-02', actualCost: 445000, budgetCost: 400000, variance: 45000, varianceRate: 11.25, status: 'overrun', createdAt: '2024-02-29' },
    
    // IT部成本中心
    { id: '18', costCenterCode: 'IT001', categoryCode: 'ADMIN_DEPREC', period: '2024-01', actualCost: 280000, budgetCost: 280000, variance: 0, varianceRate: 0, status: 'normal', createdAt: '2024-01-31' },
    { id: '19', costCenterCode: 'IT001', categoryCode: 'ADMIN_OFFICE', period: '2024-01', actualCost: 65000, budgetCost: 60000, variance: 5000, varianceRate: 8.33, status: 'warning', createdAt: '2024-01-31' },
    { id: '20', costCenterCode: 'IT001', categoryCode: 'RD_MATERIAL', period: '2024-01', actualCost: 150000, budgetCost: 140000, variance: 10000, varianceRate: 7.14, status: 'warning', createdAt: '2024-01-31' },
    { id: '21', costCenterCode: 'IT001', categoryCode: 'RD_LABOR', period: '2024-01', actualCost: 320000, budgetCost: 300000, variance: 20000, varianceRate: 6.67, status: 'warning', createdAt: '2024-01-31' },
    
    // HR部成本中心
    { id: '22', costCenterCode: 'HR001', categoryCode: 'ADMIN_HR', period: '2024-01', actualCost: 145000, budgetCost: 150000, variance: -5000, varianceRate: -3.33, status: 'normal', createdAt: '2024-01-31' },
    { id: '23', costCenterCode: 'HR001', categoryCode: 'ADMIN_RENT', period: '2024-01', actualCost: 220000, budgetCost: 220000, variance: 0, varianceRate: 0, status: 'normal', createdAt: '2024-01-31' },
    { id: '24', costCenterCode: 'HR001', categoryCode: 'ADMIN_TRAVEL', period: '2024-01', actualCost: 35000, budgetCost: 40000, variance: -5000, varianceRate: -12.5, status: 'normal', createdAt: '2024-01-31' },
    
    // 产品研发部成本中心
    { id: '25', costCenterCode: 'ProductRD001', categoryCode: 'RD_MATERIAL', period: '2024-01', actualCost: 380000, budgetCost: 350000, variance: 30000, varianceRate: 8.57, status: 'warning', createdAt: '2024-01-31' },
    { id: '26', costCenterCode: 'ProductRD001', categoryCode: 'RD_LABOR', period: '2024-01', actualCost: 520000, budgetCost: 500000, variance: 20000, varianceRate: 4.0, status: 'warning', createdAt: '2024-01-31' },
    { id: '27', costCenterCode: 'ProductRD001', categoryCode: 'ADMIN_OFFICE', period: '2024-01', actualCost: 42000, budgetCost: 45000, variance: -3000, varianceRate: -6.67, status: 'normal', createdAt: '2024-01-31' },
    
    // 2024-03 新增数据
    { id: '28', costCenterCode: 'Amazon001', categoryCode: 'SALES_MARKETING', period: '2024-03', actualCost: 495000, budgetCost: 500000, variance: -5000, varianceRate: -1.0, status: 'normal', createdAt: '2024-03-31' },
    { id: '29', costCenterCode: 'Walmart001', categoryCode: 'SALES_MARKETING', period: '2024-03', actualCost: 340000, budgetCost: 350000, variance: -10000, varianceRate: -2.86, status: 'normal', createdAt: '2024-03-31' },
    { id: '30', costCenterCode: 'China001', categoryCode: 'SALES_MARKETING', period: '2024-03', actualCost: 385000, budgetCost: 400000, variance: -15000, varianceRate: -3.75, status: 'normal', createdAt: '2024-03-31' },
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
    normal: { label: '正常', variant: 'success', icon: CheckCircle },
    warning: { label: '预警', variant: 'warning', icon: AlertTriangle },
    overrun: { label: '超标', variant: 'danger', icon: TrendingUp },
};

// --------------- 成本趋势指示组件 ---------------
const VarianceIndicator = ({ variance, varianceRate }) => {
    const isPositive = variance > 0;
    const isSignificant = Math.abs(varianceRate) > 10;
    
    return (
        <div className="flex flex-col items-end">
            <span className={cn(
                'text-sm font-medium',
                isPositive ? 'text-red-600' : 'text-green-600'
            )}>
                {isPositive ? '+' : ''}{variance.toLocaleString()}
            </span>
            <span className={cn(
                'text-xs',
                isSignificant ? 'text-red-500 font-medium' : 'text-gray-500'
            )}>
                {isPositive ? '+' : ''}{varianceRate.toFixed(2)}%
            </span>
        </div>
    );
};

// --------------- 成本分析详情抽屉 ---------------
const CostAnalysisDetailDrawer = ({ isOpen, onClose, data }) => {
    if (!isOpen || !data) return null;

    const costCenter = costCenters.find(c => c.code === data.costCenterCode);
    const category = expenseCategories.find(c => c.code === data.categoryCode);
    const statusConfig = STATUS_CONFIG[data.status] || STATUS_CONFIG.normal;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/30" onClick={onClose} />
            <div className="relative w-[560px] bg-white h-full shadow-xl flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg font-semibold">成本分析详情</h2>
                        <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                    </div>
                    <IconButton icon={ChevronRight} onClick={onClose} className="rotate-180" />
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* 基本信息 */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">成本中心</p>
                            <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-gray-400" />
                                <span className="font-medium">{costCenter?.name || data.costCenterCode}</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">费用类别</p>
                            <span className="font-medium">{category?.name || data.categoryCode}</span>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">分析周期</p>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span>{data.period}</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">记录日期</p>
                            <span>{data.createdAt}</span>
                        </div>
                    </div>

                    {/* 成本对比卡片 */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <p className="text-xs text-blue-600 mb-1">实际成本</p>
                            <p className="text-2xl font-bold text-blue-700">
                                ¥{data.actualCost.toLocaleString()}
                            </p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500 mb-1">预算成本</p>
                            <p className="text-2xl font-bold text-gray-700">
                                ¥{data.budgetCost.toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {/* 差异分析 */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 mb-3">差异分析</p>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">成本差异</span>
                                <span className={cn(
                                    'text-sm font-medium',
                                    data.variance > 0 ? 'text-red-600' : 'text-green-600'
                                )}>
                                    {data.variance > 0 ? '+' : ''}{data.variance.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">差异率</span>
                                <span className={cn(
                                    'text-sm font-medium',
                                    data.varianceRate > 0 ? 'text-red-600' : 'text-green-600'
                                )}>
                                    {data.varianceRate > 0 ? '+' : ''}{data.varianceRate.toFixed(2)}%
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">执行率</span>
                                <span className="text-sm font-medium text-blue-600">
                                    {((data.actualCost / data.budgetCost) * 100).toFixed(2)}%
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 状态说明 */}
                    <div className={cn(
                        'p-4 rounded-lg',
                        data.status === 'normal' ? 'bg-green-50' :
                        data.status === 'warning' ? 'bg-yellow-50' : 'bg-red-50'
                    )}>
                        <div className="flex items-center gap-2 mb-2">
                            {data.status === 'normal' ? <CheckCircle className="w-5 h-5 text-green-600" /> :
                             data.status === 'warning' ? <AlertTriangle className="w-5 h-5 text-yellow-600" /> :
                             <TrendingUp className="w-5 h-5 text-red-600" />}
                            <span className={cn(
                                'font-medium',
                                data.status === 'normal' ? 'text-green-700' :
                                data.status === 'warning' ? 'text-yellow-700' : 'text-red-700'
                            )}>
                                {statusConfig.label}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600">
                            {data.status === 'normal' ? '成本控制在预算范围内，执行情况良好。' :
                             data.status === 'warning' ? '成本超出预算，需要关注并适当控制。' :
                             '成本严重超出预算，需要立即采取控制措施。'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --------------- 主组件 ---------------
export default function CostAnalysisPage({ onOpenDetail }) {
    const [analysisData] = useState(initialCostAnalysisData);
    const [searchText, setSearchText] = useState('');
    const [filterCostCenter, setFilterCostCenter] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterPeriod, setFilterPeriod] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // 过滤数据
    const filteredData = analysisData.filter(item => {
        const costCenter = costCenters.find(c => c.code === item.costCenterCode);
        const category = expenseCategories.find(c => c.code === item.categoryCode);
        
        const matchesSearch = !searchText ||
            costCenter?.name.toLowerCase().includes(searchText.toLowerCase()) ||
            category?.name.toLowerCase().includes(searchText.toLowerCase()) ||
            item.period.includes(searchText);
        const matchesCostCenter = !filterCostCenter || item.costCenterCode === filterCostCenter;
        const matchesCategory = !filterCategory || item.categoryCode === filterCategory ||
            (category?.parent === filterCategory);
        const matchesStatus = !filterStatus || item.status === filterStatus;
        const matchesPeriod = !filterPeriod || item.period === filterPeriod;
        
        return matchesSearch && matchesCostCenter && matchesCategory && matchesStatus && matchesPeriod;
    });

    // 统计
    const stats = {
        totalActual: filteredData.reduce((sum, item) => sum + item.actualCost, 0),
        totalBudget: filteredData.reduce((sum, item) => sum + item.budgetCost, 0),
        totalVariance: filteredData.reduce((sum, item) => sum + item.variance, 0),
        normalCount: filteredData.filter(item => item.status === 'normal').length,
        warningCount: filteredData.filter(item => item.status === 'warning').length,
        overrunCount: filteredData.filter(item => item.status === 'overrun').length,
    };

    const handleViewDetail = (item) => {
        if (onOpenDetail) {
            onOpenDetail({
                id: `cost-analysis-${item.id}`,
                name: `成本分析: ${costCenters.find(c => c.code === item.costCenterCode)?.name || item.costCenterCode}`,
                path: '/finance-analysis/cost/detail',
                data: item,
            });
        }
    };

    // 获取唯一的周期列表
    const periods = [...new Set(analysisData.map(item => item.period))].sort().reverse();

    // 获取一级费用类别
    const rootCategories = expenseCategories.filter(c => !c.parent);

    return (
        <div className="space-y-6">
            {/* 页面头部 */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">成本分析</h1>
                    <p className="text-sm text-gray-500 mt-1">分析实际成本与预算的差异，监控成本执行情况</p>
                </div>
                <div className="flex items-center gap-3">
                    <SecondaryButton icon={Download}>导出报表</SecondaryButton>
                    <PrimaryButton icon={BarChart3}>生成分析报告</PrimaryButton>
                </div>
            </div>

            {/* 统计卡片 */}
            <div className="grid grid-cols-4 gap-4">
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">实际成本总计</p>
                            <p className="text-xl font-bold text-gray-900">¥{(stats.totalActual / 10000).toFixed(2)}万</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">预算总计</p>
                            <p className="text-xl font-bold text-gray-900">¥{(stats.totalBudget / 10000).toFixed(2)}万</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            'w-10 h-10 rounded-lg flex items-center justify-center',
                            stats.totalVariance > 0 ? 'bg-red-100' : 'bg-green-100'
                        )}>
                            {stats.totalVariance > 0 ? 
                                <TrendingUp className="w-5 h-5 text-red-600" /> : 
                                <TrendingDown className="w-5 h-5 text-green-600" />
                            }
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">成本差异</p>
                            <p className={cn(
                                'text-xl font-bold',
                                stats.totalVariance > 0 ? 'text-red-600' : 'text-green-600'
                            )}>
                                {stats.totalVariance > 0 ? '+' : ''}¥{(stats.totalVariance / 10000).toFixed(2)}万
                            </p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                            <PieChart className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">预算执行率</p>
                            <p className="text-xl font-bold text-gray-900">
                                {((stats.totalActual / stats.totalBudget) * 100).toFixed(1)}%
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* 状态统计 */}
            <div className="grid grid-cols-3 gap-4">
                <Card className="p-4 border-l-4 border-l-green-500">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="text-sm text-gray-600">正常</span>
                        </div>
                        <span className="text-2xl font-bold text-green-600">{stats.normalCount}</span>
                    </div>
                </Card>
                <Card className="p-4 border-l-4 border-l-yellow-500">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5 text-yellow-600" />
                            <span className="text-sm text-gray-600">预警</span>
                        </div>
                        <span className="text-2xl font-bold text-yellow-600">{stats.warningCount}</span>
                    </div>
                </Card>
                <Card className="p-4 border-l-4 border-l-red-500">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <TrendingUp className="w-5 h-5 text-red-600" />
                            <span className="text-sm text-gray-600">超标</span>
                        </div>
                        <span className="text-2xl font-bold text-red-600">{stats.overrunCount}</span>
                    </div>
                </Card>
            </div>

            {/* 搜索和筛选 */}
            <Card className="p-4">
                <div className="flex items-center gap-4 flex-wrap">
                    <Input
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="搜索成本中心、费用类别..."
                        icon={Search}
                        className="w-64"
                    />
                    <Select
                        value={filterCostCenter}
                        onChange={(e) => setFilterCostCenter(e.target.value)}
                        options={costCenters.map(c => ({ value: c.code, label: c.name }))}
                        placeholder="全部成本中心"
                        className="w-40"
                    />
                    <Select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        options={rootCategories.map(c => ({ value: c.code, label: c.name }))}
                        placeholder="全部费用类别"
                        className="w-40"
                    />
                    <Select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        options={[
                            { value: 'normal', label: '正常' },
                            { value: 'warning', label: '预警' },
                            { value: 'overrun', label: '超标' },
                        ]}
                        placeholder="全部状态"
                        className="w-32"
                    />
                    <Select
                        value={filterPeriod}
                        onChange={(e) => setFilterPeriod(e.target.value)}
                        options={periods.map(p => ({ value: p, label: p }))}
                        placeholder="全部周期"
                        className="w-32"
                    />
                    {(filterCostCenter || filterCategory || filterStatus || filterPeriod) && (
                        <button
                            onClick={() => { 
                                setFilterCostCenter(''); 
                                setFilterCategory(''); 
                                setFilterStatus(''); 
                                setFilterPeriod(''); 
                            }}
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
                                <th className="px-4 py-3 text-left font-medium text-gray-600">成本中心</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">费用类别</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">周期</th>
                                <th className="px-4 py-3 text-right font-medium text-gray-600">实际成本</th>
                                <th className="px-4 py-3 text-right font-medium text-gray-600">预算成本</th>
                                <th className="px-4 py-3 text-right font-medium text-gray-600">差异</th>
                                <th className="px-4 py-3 text-center font-medium text-gray-600">状态</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredData.map(item => {
                                const costCenter = costCenters.find(c => c.code === item.costCenterCode);
                                const category = expenseCategories.find(c => c.code === item.categoryCode);
                                const statusConfig = STATUS_CONFIG[item.status] || STATUS_CONFIG.normal;
                                
                                return (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <Building2 className="w-4 h-4 text-gray-400" />
                                                <span className="font-medium text-gray-900">{costCenter?.name || item.costCenterCode}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-gray-700">{category?.name || item.categoryCode}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                <span className="text-gray-600">{item.period}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <span className="font-medium text-gray-900">¥{item.actualCost.toLocaleString()}</span>
                                        </td>
                                        <td className="px-4 py-3 text-right text-gray-600">
                                            ¥{item.budgetCost.toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3">
                                            <VarianceIndicator variance={item.variance} varianceRate={item.varianceRate} />
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => {
                                                    if (onOpenDetail) {
                                                        onOpenDetail({
                                                            id: `cost-analysis-${item.id}`,
                                                            name: `成本分析: ${costCenter?.name || item.costCenterCode}`,
                                                            path: '/finance-analysis/cost/detail',
                                                            data: item,
                                                        });
                                                    }
                                                }}
                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                            >
                                                查看详情
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {filteredData.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p>暂无成本分析数据</p>
                        </div>
                    )}
                </div>

                {/* 分页信息 */}
                {filteredData.length > 0 && (
                    <div className="px-4 py-3 border-t bg-gray-50 flex items-center justify-between">
                        <p className="text-sm text-gray-500">共 {filteredData.length} 条记录</p>
                        <div className="text-sm text-gray-500">
                            显示 1 - {filteredData.length} 条
                        </div>
                    </div>
                )}
            </Card>

            {/* 详情抽屉 */}
            <CostAnalysisDetailDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                data={selectedItem}
            />
        </div>
    );
}
