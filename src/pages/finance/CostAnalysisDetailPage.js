// src/pages/CostAnalysisDetailPage.js
// 成本分析详情页面 - 对比预算与实际花费（支持本月/累积/按月查看）
import React, { useState } from 'react';
import {
    Download, ChevronRight, ChevronDown, ArrowLeft,
    Building2, DollarSign, TrendingUp, TrendingDown,
    Calendar, PieChart, AlertTriangle, CheckCircle,
    BarChart3, Target, Percent, Layers, Clock,
    ChevronLeft, FileText
} from 'lucide-react';

// 轻量工具：className 拼接
const cn = (...args) => args.filter(Boolean).join(' ');

// --------------- 成本中心数据 ---------------
const costCenters = [
    { code: 'Amazon001', name: 'Amazon' },
    { code: 'Walmart001', name: '沃尔玛' },
    { code: 'eBay001', name: 'eBay' },
    { code: 'China001', name: '中国' },
    { code: 'IT001', name: 'IT' },
    { code: 'HR001', name: 'HR' },
    { code: 'ProductRD001', name: '产品研发部' },
];

// --------------- 费用科目结构 ---------------
const expenseCategories = [
    {
        id: '1', code: '1', name: '销售费用', level: 0,
        children: [
            { id: '1.1', code: '1.1', name: '站内营销费用', level: 1 },
            { id: '1.2', code: '1.2', name: '数字营销费用', level: 1 },
            { id: '1.3', code: '1.3', name: '平台交易费', level: 1 },
            { id: '1.4', code: '1.4', name: '物流及仓储费', level: 1 },
        ],
    },
    {
        id: '2', code: '2', name: '管理费用', level: 0,
        children: [
            { id: '2.1', code: '2.1', name: '人力成本', level: 1 },
            { id: '2.2', code: '2.2', name: '租金和公用事业', level: 1 },
            { id: '2.3', code: '2.3', name: '办公用品费用', level: 1 },
            { id: '2.4', code: '2.4', name: '差旅住宿费用', level: 1 },
            { id: '2.5', code: '2.5', name: '折旧与摊销', level: 1 },
        ],
    },
    {
        id: '3', code: '3', name: '研发费用', level: 0,
        children: [
            { id: '3.1', code: '3.1', name: '研发材料费', level: 1 },
            { id: '3.2', code: '3.2', name: '研发人工费', level: 1 },
        ],
    },
];

// --------------- 生成月度明细数据 ---------------
const generateMonthlyDetailData = () => {
    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    const data = {};
    
    months.forEach((month, index) => {
        data[month] = {};
        expenseCategories.forEach(cat => {
            if (cat.children) {
                data[month][cat.id] = {
                    budget: 0,
                    actual: 0,
                };
                cat.children.forEach(child => {
                    // 生成有规律的随机数据
                    const baseBudget = 30000 + Math.random() * 50000;
                    const variance = (Math.random() - 0.4) * 0.3; // -12% ~ +18%
                    data[month][child.id] = {
                        budget: Math.round(baseBudget),
                        actual: Math.round(baseBudget * (1 + variance)),
                    };
                    // 汇总到父级
                    data[month][cat.id].budget += data[month][child.id].budget;
                    data[month][cat.id].actual += data[month][child.id].actual;
                });
            }
        });
    });
    return data;
};

const monthlyDetailData = generateMonthlyDetailData();

// --------------- 计算本月和累积数据 ---------------
const calculatePeriodData = (endMonth) => {
    const months = Object.keys(monthlyDetailData);
    const endIndex = months.indexOf(endMonth);
    const periodMonths = months.slice(0, endIndex + 1);
    
    const result = {
        currentMonth: {},
        cumulative: {},
    };
    
    // 初始化所有科目
    expenseCategories.forEach(cat => {
        result.currentMonth[cat.id] = { budget: 0, actual: 0 };
        result.cumulative[cat.id] = { budget: 0, actual: 0 };
        if (cat.children) {
            cat.children.forEach(child => {
                result.currentMonth[child.id] = { budget: 0, actual: 0 };
                result.cumulative[child.id] = { budget: 0, actual: 0 };
            });
        }
    });
    
    // 本月数据
    const currentMonthData = monthlyDetailData[endMonth];
    Object.keys(currentMonthData).forEach(catId => {
        result.currentMonth[catId] = { ...currentMonthData[catId] };
    });
    
    // 累积数据
    periodMonths.forEach(month => {
        Object.keys(monthlyDetailData[month]).forEach(catId => {
            result.cumulative[catId].budget += monthlyDetailData[month][catId].budget;
            result.cumulative[catId].actual += monthlyDetailData[month][catId].actual;
        });
    });
    
    return result;
};

// --------------- 轻量级 UI 组件 ---------------
const SecondaryButton = ({ children, onClick, icon: Icon, className, size = 'md', active }) => (
    <button
        onClick={onClick}
        className={cn(
            'inline-flex items-center gap-2 font-medium rounded-lg transition-colors',
            size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm',
            active 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'border border-gray-300 text-gray-700 hover:bg-gray-50',
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

// --------------- 计算差异率 ---------------
const calculateVarianceRate = (actual, budget) => {
    if (budget === 0) return 0;
    return ((actual - budget) / budget) * 100;
};

// --------------- 成本对比表格行组件 ---------------
const CostComparisonRow = ({ category, data, expandedIds, onToggle, level = 0 }) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedIds.includes(category.id);
    
    const catData = data[category.id] || { budget: 0, actual: 0 };
    const variance = catData.actual - catData.budget;
    const varianceRate = calculateVarianceRate(catData.actual, catData.budget);
    const isOverBudget = variance > 0;

    const bgClass = level === 0 ? 'bg-blue-50' : level === 1 ? 'bg-gray-50' : 'bg-white';
    const fontClass = level === 0 ? 'font-semibold text-blue-900' : level === 1 ? 'font-medium text-gray-800' : 'text-gray-700';

    return (
        <>
            <tr className={cn('border-b border-gray-100 hover:bg-gray-50/50', bgClass)}>
                <td className="sticky left-0 z-10 px-4 py-3 whitespace-nowrap border-r border-gray-200" 
                    style={{ backgroundColor: level === 0 ? '#eff6ff' : level === 1 ? '#f9fafb' : '#fff' }}>
                    <div className="flex items-center" style={{ paddingLeft: `${level * 20}px` }}>
                        {hasChildren ? (
                            <button
                                onClick={() => onToggle(category.id)}
                                className="p-0.5 mr-1 rounded hover:bg-gray-200"
                            >
                                {isExpanded ? (
                                    <ChevronDown className="w-4 h-4 text-gray-500" />
                                ) : (
                                    <ChevronRight className="w-4 h-4 text-gray-500" />
                                )}
                            </button>
                        ) : (
                            <span className="w-5 mr-1" />
                        )}
                        <span className={cn('text-sm', fontClass)}>
                            {category.code && <span className="text-gray-400 mr-2">{category.code}</span>}
                            {category.name}
                        </span>
                    </div>
                </td>
                <td className="px-4 py-3 text-right">
                    <span className={cn('text-sm', fontClass)}>¥{catData.budget.toLocaleString()}</span>
                </td>
                <td className="px-4 py-3 text-right">
                    <span className={cn('text-sm', fontClass)}>¥{catData.actual.toLocaleString()}</span>
                </td>
                <td className="px-4 py-3 text-right">
                    <span className={cn('text-sm font-medium', isOverBudget ? 'text-red-600' : 'text-green-600')}>
                        {isOverBudget ? '+' : ''}{variance.toLocaleString()}
                    </span>
                </td>
                <td className="px-4 py-3 text-right">
                    <span className={cn(
                        'text-sm font-medium',
                        Math.abs(varianceRate) > 10 ? 'text-red-600' : 
                        Math.abs(varianceRate) > 5 ? 'text-yellow-600' : 'text-green-600'
                    )}>
                        {isOverBudget ? '+' : ''}{varianceRate.toFixed(2)}%
                    </span>
                </td>
                <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                                className={cn('h-full rounded-full', isOverBudget ? 'bg-red-500' : 'bg-green-500')}
                                style={{ width: `${Math.min((catData.actual / catData.budget) * 100, 100)}%` }}
                            />
                        </div>
                        <span className="text-sm text-gray-600 w-12 text-right">
                            {((catData.actual / catData.budget) * 100).toFixed(1)}%
                        </span>
                    </div>
                </td>
                <td className="px-4 py-3 text-center">
                    {Math.abs(varianceRate) > 10 ? <Badge variant="danger">超标</Badge> : 
                     Math.abs(varianceRate) > 5 ? <Badge variant="warning">预警</Badge> : 
                     <Badge variant="success">正常</Badge>}
                </td>
            </tr>
            {hasChildren && isExpanded && category.children.map(child => (
                <CostComparisonRow key={child.id} category={child} data={data} expandedIds={expandedIds} onToggle={onToggle} level={level + 1} />
            ))}
        </>
    );
};

// --------------- 月度明细表格组件 ---------------
const MonthlyDetailTable = ({ month, data, onBack }) => {
    const [expandedIds, setExpandedIds] = useState(['1', '2', '3']);
    
    const handleToggle = (id) => {
        setExpandedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };
    
    const monthData = data[month] || {};
    
    // 计算总计
    const totalBudget = expenseCategories.reduce((sum, cat) => sum + (monthData[cat.id]?.budget || 0), 0);
    const totalActual = expenseCategories.reduce((sum, cat) => sum + (monthData[cat.id]?.actual || 0), 0);
    const totalVariance = totalActual - totalBudget;
    const totalVarianceRate = calculateVarianceRate(totalActual, totalBudget);
    
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <IconButton icon={ArrowLeft} onClick={onBack} title="返回" />
                    <h3 className="text-lg font-semibold text-gray-900">{month} 成本明细</h3>
                </div>
                <SecondaryButton icon={Download} size="sm">导出</SecondaryButton>
            </div>
            
            <Card className="overflow-hidden">
                <table className="w-full text-sm" style={{ minWidth: '800px' }}>
                    <thead>
                        <tr className="bg-gray-100 border-b border-gray-200">
                            <th className="sticky left-0 z-20 px-4 py-3 text-left font-semibold text-gray-700 bg-gray-100 border-r border-gray-200" style={{ minWidth: '280px' }}>
                                费用科目
                            </th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-700">预算金额</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-700">实际金额</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-700">差异</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-700">差异率</th>
                            <th className="px-4 py-3 text-center font-semibold text-gray-700">状态</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenseCategories.map(category => (
                            <CostComparisonRow
                                key={category.id}
                                category={category}
                                data={monthData}
                                expandedIds={expandedIds}
                                onToggle={handleToggle}
                                level={0}
                            />
                        ))}
                        <tr className="bg-blue-100 border-t-2 border-blue-300">
                            <td className="sticky left-0 z-10 px-4 py-3 font-bold text-blue-900 border-r border-gray-200 bg-blue-100">合计</td>
                            <td className="px-4 py-3 text-right font-bold text-blue-900">¥{totalBudget.toLocaleString()}</td>
                            <td className="px-4 py-3 text-right font-bold text-blue-900">¥{totalActual.toLocaleString()}</td>
                            <td className={cn('px-4 py-3 text-right font-bold', totalVariance > 0 ? 'text-red-700' : 'text-green-700')}>
                                {totalVariance > 0 ? '+' : ''}{totalVariance.toLocaleString()}
                            </td>
                            <td className={cn('px-4 py-3 text-right font-bold', totalVariance > 0 ? 'text-red-700' : 'text-green-700')}>
                                {totalVariance > 0 ? '+' : ''}{totalVarianceRate.toFixed(2)}%
                            </td>
                            <td className="px-4 py-3 text-center">
                                {Math.abs(totalVarianceRate) > 10 ? <Badge variant="danger">超标</Badge> : 
                                 Math.abs(totalVarianceRate) > 5 ? <Badge variant="warning">预警</Badge> : 
                                 <Badge variant="success">正常</Badge>}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

// --------------- 主组件 ---------------
export default function CostAnalysisDetailPage({ data, onClose }) {
    const analysisData = data || {
        id: '1', costCenterCode: 'Amazon001', period: '2024', status: 'warning', createdAt: '2024-01-31',
    };
    
    const [viewMode, setViewMode] = useState('current'); // 'current' | 'cumulative'
    const [currentMonth, setCurrentMonth] = useState('3月');
    const [detailMonth, setDetailMonth] = useState(null); // 当前查看明细的月份
    const [expandedIds, setExpandedIds] = useState(['1', '2', '3']);
    
    const costCenter = costCenters.find(c => c.code === analysisData.costCenterCode);
    const periodData = calculatePeriodData(currentMonth);
    const displayData = viewMode === 'current' ? periodData.currentMonth : periodData.cumulative;
    
    // 获取所有月份
    const months = Object.keys(monthlyDetailData);
    const currentMonthIndex = months.indexOf(currentMonth);
    
    const handlePrevMonth = () => {
        if (currentMonthIndex > 0) {
            setCurrentMonth(months[currentMonthIndex - 1]);
        }
    };
    
    const handleNextMonth = () => {
        if (currentMonthIndex < months.length - 1) {
            setCurrentMonth(months[currentMonthIndex + 1]);
        }
    };
    
    const handleToggle = (id) => {
        setExpandedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };
    
    const handleExpandAll = () => {
        setExpandedIds(expenseCategories.map(c => c.id));
    };
    
    const handleCollapseAll = () => {
        setExpandedIds([]);
    };
    
    // 计算总计
    const totalBudget = expenseCategories.reduce((sum, cat) => sum + (displayData[cat.id]?.budget || 0), 0);
    const totalActual = expenseCategories.reduce((sum, cat) => sum + (displayData[cat.id]?.actual || 0), 0);
    const totalVariance = totalActual - totalBudget;
    const totalVarianceRate = calculateVarianceRate(totalActual, totalBudget);
    const isOverBudget = totalVariance > 0;
    
    // 生成月度汇总数据
    const monthlySummary = months.slice(0, currentMonthIndex + 1).map(month => {
        const monthData = monthlyDetailData[month];
        const mb = expenseCategories.reduce((sum, cat) => sum + (monthData[cat.id]?.budget || 0), 0);
        const ma = expenseCategories.reduce((sum, cat) => sum + (monthData[cat.id]?.actual || 0), 0);
        return {
            month,
            budget: mb,
            actual: ma,
            variance: ma - mb,
            varianceRate: calculateVarianceRate(ma, mb),
        };
    });
    
    // 如果正在查看某月明细
    if (detailMonth) {
        return (
            <div className="space-y-6">
                <MonthlyDetailTable 
                    month={detailMonth} 
                    data={monthlyDetailData} 
                    onBack={() => setDetailMonth(null)} 
                />
            </div>
        );
    }
    
    return (
        <div className="space-y-6">
            {/* 页面头部 */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <SecondaryButton icon={ArrowLeft} onClick={onClose} size="sm">返回</SecondaryButton>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-gray-900">
                                {costCenter?.name || analysisData.costCenterCode} - 成本分析详情
                            </h1>
                            <Badge variant={analysisData.status === 'overrun' ? 'danger' : analysisData.status === 'warning' ? 'warning' : 'success'}>
                                {analysisData.status === 'overrun' ? '超标' : analysisData.status === 'warning' ? '预警' : '正常'}
                            </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                            分析年度: {analysisData.period} | 分析日期: {analysisData.createdAt}
                        </p>
                    </div>
                </div>
                <SecondaryButton icon={Download}>导出报表</SecondaryButton>
            </div>
            
            {/* 视图切换和月份选择 */}
            <Card className="p-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    {/* 本月/累积切换 */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 mr-2">数据视图:</span>
                        <SecondaryButton 
                            icon={Clock} 
                            size="sm" 
                            active={viewMode === 'current'}
                            onClick={() => setViewMode('current')}
                        >
                            本月
                        </SecondaryButton>
                        <SecondaryButton 
                            icon={Layers} 
                            size="sm" 
                            active={viewMode === 'cumulative'}
                            onClick={() => setViewMode('cumulative')}
                        >
                            累积
                        </SecondaryButton>
                    </div>
                    
                    {/* 月份切换 */}
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">
                            {viewMode === 'current' ? '当前月份:' : '截至月份:'}
                        </span>
                        <div className="flex items-center gap-2">
                            <IconButton 
                                icon={ChevronLeft} 
                                onClick={handlePrevMonth} 
                                disabled={currentMonthIndex === 0}
                            />
                            <span className="text-lg font-semibold text-gray-900 w-16 text-center">
                                {currentMonth}
                            </span>
                            <IconButton 
                                icon={ChevronRight} 
                                onClick={handleNextMonth} 
                                disabled={currentMonthIndex === months.length - 1}
                            />
                        </div>
                    </div>
                </div>
                
                {/* 视图说明 */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500">
                        {viewMode === 'current' 
                            ? `显示${currentMonth}单月的成本数据，可对比当月预算与实际执行情况。`
                            : `显示从1月至${currentMonth}的累计成本数据，反映年度预算累计执行情况。`
                        }
                    </p>
                </div>
            </Card>

            {/* 关键指标卡片 */}
            <div className="grid grid-cols-4 gap-4">
                <Card className="p-5">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">
                                {viewMode === 'current' ? '本月预算' : '累积预算'}
                            </p>
                            <p className="text-2xl font-bold text-gray-900">¥{totalBudget.toLocaleString()}</p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Target className="w-5 h-5 text-blue-600" />
                        </div>
                    </div>
                </Card>
                <Card className="p-5">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">
                                {viewMode === 'current' ? '本月实际' : '累积实际'}
                            </p>
                            <p className={cn('text-2xl font-bold', isOverBudget ? 'text-red-600' : 'text-gray-900')}>
                                ¥{totalActual.toLocaleString()}
                            </p>
                        </div>
                        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', isOverBudget ? 'bg-red-100' : 'bg-green-100')}>
                            <DollarSign className={cn('w-5 h-5', isOverBudget ? 'text-red-600' : 'text-green-600')} />
                        </div>
                    </div>
                </Card>
                <Card className="p-5">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">成本差异</p>
                            <p className={cn('text-2xl font-bold', isOverBudget ? 'text-red-600' : 'text-green-600')}>
                                {isOverBudget ? '+' : ''}{totalVariance.toLocaleString()}
                            </p>
                            <p className={cn('text-xs mt-1', isOverBudget ? 'text-red-500' : 'text-green-500')}>
                                {isOverBudget ? '+' : ''}{totalVarianceRate.toFixed(2)}%
                            </p>
                        </div>
                        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', isOverBudget ? 'bg-red-100' : 'bg-green-100')}>
                            {isOverBudget ? <TrendingUp className="w-5 h-5 text-red-600" /> : <TrendingDown className="w-5 h-5 text-green-600" />}
                        </div>
                    </div>
                </Card>
                <Card className="p-5">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">预算执行率</p>
                            <p className="text-2xl font-bold text-gray-900">{((totalActual / totalBudget) * 100).toFixed(1)}%</p>
                            <div className="w-24 h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                                <div 
                                    className={cn('h-full rounded-full', isOverBudget ? 'bg-red-500' : 'bg-green-500')}
                                    style={{ width: `${Math.min((totalActual / totalBudget) * 100, 100)}%` }}
                                />
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                            <Percent className="w-5 h-5 text-purple-600" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* 成本对比表格 */}
            <Card className="overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <BarChart3 className="w-5 h-5 text-blue-600" />
                        <h3 className="font-semibold text-gray-900">
                            费用科目对比分析 ({viewMode === 'current' ? currentMonth : `1月-${currentMonth}累积`})
                        </h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={handleExpandAll} className="text-sm text-blue-600 hover:underline">全部展开</button>
                        <span className="text-gray-300">|</span>
                        <button onClick={handleCollapseAll} className="text-sm text-blue-600 hover:underline">全部收起</button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm" style={{ minWidth: '900px' }}>
                        <thead>
                            <tr className="bg-gray-100 border-b border-gray-200">
                                <th className="sticky left-0 z-20 px-4 py-3 text-left font-semibold text-gray-700 bg-gray-100 border-r border-gray-200" style={{ minWidth: '280px' }}>
                                    费用科目
                                </th>
                                <th className="px-4 py-3 text-right font-semibold text-gray-700">预算金额</th>
                                <th className="px-4 py-3 text-right font-semibold text-gray-700">实际金额</th>
                                <th className="px-4 py-3 text-right font-semibold text-gray-700">差异金额</th>
                                <th className="px-4 py-3 text-right font-semibold text-gray-700">差异率</th>
                                <th className="px-4 py-3 text-right font-semibold text-gray-700" style={{ minWidth: '150px' }}>执行率</th>
                                <th className="px-4 py-3 text-center font-semibold text-gray-700">状态</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenseCategories.map(category => (
                                <CostComparisonRow
                                    key={category.id}
                                    category={category}
                                    data={displayData}
                                    expandedIds={expandedIds}
                                    onToggle={handleToggle}
                                    level={0}
                                />
                            ))}
                            <tr className="bg-blue-100 border-t-2 border-blue-300">
                                <td className="sticky left-0 z-10 px-4 py-3 font-bold text-blue-900 border-r border-gray-200 bg-blue-100">总计</td>
                                <td className="px-4 py-3 text-right font-bold text-blue-900">¥{totalBudget.toLocaleString()}</td>
                                <td className="px-4 py-3 text-right font-bold text-blue-900">¥{totalActual.toLocaleString()}</td>
                                <td className={cn('px-4 py-3 text-right font-bold', isOverBudget ? 'text-red-700' : 'text-green-700')}>
                                    {isOverBudget ? '+' : ''}{totalVariance.toLocaleString()}
                                </td>
                                <td className={cn('px-4 py-3 text-right font-bold', isOverBudget ? 'text-red-700' : 'text-green-700')}>
                                    {isOverBudget ? '+' : ''}{totalVarianceRate.toFixed(2)}%
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center justify-end gap-2">
                                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div 
                                                className={cn('h-full rounded-full', isOverBudget ? 'bg-red-500' : 'bg-green-500')}
                                                style={{ width: `${Math.min((totalActual / totalBudget) * 100, 100)}%` }}
                                            />
                                        </div>
                                        <span className="text-sm font-bold text-blue-900 w-12 text-right">
                                            {((totalActual / totalBudget) * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    {Math.abs(totalVarianceRate) > 10 ? <Badge variant="danger">超标</Badge> : 
                                     Math.abs(totalVarianceRate) > 5 ? <Badge variant="warning">预警</Badge> : 
                                     <Badge variant="success">正常</Badge>}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* 月度汇总表格 */}
            <Card className="overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <h3 className="font-semibold text-gray-900">月度汇总</h3>
                        <span className="text-sm text-gray-500">（点击月份可查看明细）</span>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-4 py-3 text-left font-medium text-gray-600">月份</th>
                                <th className="px-4 py-3 text-right font-medium text-gray-600">预算金额</th>
                                <th className="px-4 py-3 text-right font-medium text-gray-600">实际金额</th>
                                <th className="px-4 py-3 text-right font-medium text-gray-600">差异</th>
                                <th className="px-4 py-3 text-right font-medium text-gray-600">差异率</th>
                                <th className="px-4 py-3 text-center font-medium text-gray-600">状态</th>
                                <th className="px-4 py-3 text-center font-medium text-gray-600">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {monthlySummary.map((item) => {
                                const isOver = item.variance > 0;
                                return (
                                    <tr key={item.month} className={cn(
                                        "hover:bg-gray-50",
                                        item.month === currentMonth && "bg-blue-50/50"
                                    )}>
                                        <td className="px-4 py-3">
                                            <span className={cn(
                                                "font-medium",
                                                item.month === currentMonth ? "text-blue-600" : "text-gray-900"
                                            )}>
                                                {item.month}
                                                {item.month === currentMonth && (
                                                    <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">当前</span>
                                                )}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right text-gray-600">¥{item.budget.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-right">
                                            <span className={cn('font-medium', isOver ? 'text-red-600' : 'text-gray-900')}>
                                                ¥{item.actual.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <span className={cn('font-medium', isOver ? 'text-red-600' : 'text-green-600')}>
                                                {isOver ? '+' : ''}{item.variance.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <span className={cn(
                                                'text-sm',
                                                Math.abs(item.varianceRate) > 10 ? 'text-red-600 font-medium' : 'text-gray-600'
                                            )}>
                                                {isOver ? '+' : ''}{item.varianceRate.toFixed(2)}%
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {Math.abs(item.varianceRate) > 10 ? <Badge variant="danger">超标</Badge> : 
                                             Math.abs(item.varianceRate) > 5 ? <Badge variant="warning">预警</Badge> : 
                                             <Badge variant="success">正常</Badge>}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                onClick={() => setDetailMonth(item.month)}
                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                            >
                                                查看明细
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* 差异分析 */}
            <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                    <PieChart className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">
                        差异分析 ({viewMode === 'current' ? currentMonth : `1月-${currentMonth}累积`})
                    </h3>
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div className={cn('p-4 rounded-lg', isOverBudget ? 'bg-red-50 border border-red-100' : 'bg-green-50 border border-green-100')}>
                        <div className="flex items-center gap-2 mb-2">
                            {isOverBudget ? (
                                <><AlertTriangle className="w-5 h-5 text-red-600" /><span className="font-medium text-red-700">超预算分析</span></>
                            ) : (
                                <><CheckCircle className="w-5 h-5 text-green-600" /><span className="font-medium text-green-700">预算控制良好</span></>
                            )}
                        </div>
                        <p className="text-sm text-gray-600">
                            {viewMode === 'current' 
                                ? (isOverBudget 
                                    ? `${currentMonth}实际成本超预算 ${totalVarianceRate.toFixed(2)}%，需要关注费用控制。`
                                    : `${currentMonth}实际成本控制在预算范围内，节约 ${Math.abs(totalVarianceRate).toFixed(2)}%。`)
                                : (isOverBudget 
                                    ? `截至${currentMonth}累计成本超预算 ${totalVarianceRate.toFixed(2)}%，需加强年度预算管控。`
                                    : `截至${currentMonth}累计成本控制在预算范围内，节约 ${Math.abs(totalVarianceRate).toFixed(2)}%。`)
                            }
                        </p>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-600">当前查看</span>
                            <span className="font-medium text-gray-900">
                                {viewMode === 'current' ? `${currentMonth}单月` : `1月-${currentMonth}累积`}
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-600">已包含月份</span>
                            <span className="font-medium text-gray-900">{currentMonthIndex + 1} 个月</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-600">平均月差异率</span>
                            <span className={cn('font-medium', isOverBudget ? 'text-red-600' : 'text-green-600')}>
                                {(monthlySummary.reduce((sum, m) => sum + m.varianceRate, 0) / monthlySummary.length).toFixed(2)}%
                            </span>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
