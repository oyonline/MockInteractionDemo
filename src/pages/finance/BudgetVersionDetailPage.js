// src/pages/BudgetVersionDetailPage.js
// 预算版本详情页面 - 表头+表体（费用科目+12个月预算）
import React, { useState } from 'react';
import {
    Save, Download, Upload, ChevronRight, ChevronDown,
    Edit2, X, Calendar,
    Building2, DollarSign, TrendingUp
} from 'lucide-react';

// 轻量工具：className 拼接
const cn = (...args) => args.filter(Boolean).join(' ');

// --------------- 费用科目结构 ---------------
const expenseCategories = [
    {
        id: '1',
        code: '1',
        name: '销售费用',
        level: 0,
        children: [
            {
                id: '1.1',
                code: '1.1',
                name: '商品销售费',
                level: 1,
                children: [
                    { id: '1.1.1', code: '1.1.1', name: '站内营销费用', level: 2 },
                    { id: '1.1.2', code: '1.1.2', name: '数字营销费用', level: 2 },
                    { id: '1.1.3', code: '1.1.3', name: '平台交易费', level: 2 },
                    { id: '1.1.4', code: '1.1.4', name: '零售渠道费用', level: 2 },
                    { id: '1.1.5', code: '1.1.5', name: '经销商展会', level: 2 },
                    { id: '1.1.6', code: '1.1.6', name: '其他销售费用', level: 2 },
                ],
            },
            {
                id: '1.2',
                code: '1.2',
                name: '物流及仓储费',
                level: 1,
                children: [
                    { id: '1.2.1', code: '1.2.1', name: '物流费用', level: 2 },
                    { id: '1.2.2', code: '1.2.2', name: '仓储费', level: 2 },
                    { id: '1.2.3', code: '1.2.3', name: '售后服务费', level: 2 },
                    { id: '1.2.4', code: '1.2.4', name: '库存损益', level: 2 },
                ],
            },
        ],
    },
    {
        id: '2',
        code: '2',
        name: '管理费用',
        level: 0,
        children: [
            { id: '2.1', code: '2.1', name: '间接人力成本', level: 1 },
            { id: '2.2', code: '2.2', name: '租金和公用事业', level: 1 },
            { id: '2.3', code: '2.3', name: '办公用品费用', level: 1 },
            { id: '2.4', code: '2.4', name: '折旧与摊销', level: 1 },
            { id: '2.5', code: '2.5', name: '福利费', level: 1 },
            { id: '2.6', code: '2.6', name: '行政支持劳务', level: 1 },
            { id: '2.7', code: '2.7', name: '招聘费用', level: 1 },
            { id: '2.8', code: '2.8', name: '培训费用', level: 1 },
            { id: '2.9', code: '2.9', name: '法务及咨询', level: 1 },
            { id: '2.10', code: '2.10', name: '差旅住宿费用', level: 1 },
            { id: '2.11', code: '2.11', name: '业务招待费', level: 1 },
            { id: '2.12', code: '2.12', name: '其他管理费用', level: 1 },
        ],
    },
];

// 月份
const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

// 生成模拟预算数据
const generateBudgetData = (versionId) => {
    const data = {};
    const flatCategories = flattenCategories(expenseCategories);

    flatCategories.forEach(cat => {
        data[cat.id] = {};
        months.forEach((_, idx) => {
            // 根据类别生成不同范围的随机数据
            let base = 10000;
            if (cat.level === 0) base = 0; // 一级分类自动汇总
            else if (cat.level === 1 && cat.children) base = 0; // 有子项的二级分类自动汇总
            else if (cat.id.startsWith('1.1')) base = 50000 + Math.random() * 100000;
            else if (cat.id.startsWith('1.2')) base = 30000 + Math.random() * 50000;
            else if (cat.id.startsWith('2')) base = 10000 + Math.random() * 30000;

            data[cat.id][idx] = base > 0 ? Math.round(base) : 0;
        });
    });

    return data;
};

// 扁平化分类（用于遍历）
const flattenCategories = (categories, result = []) => {
    categories.forEach(cat => {
        result.push(cat);
        if (cat.children) {
            flattenCategories(cat.children, result);
        }
    });
    return result;
};


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
    draft: { label: '草稿', variant: 'default' },
    active: { label: '生效中', variant: 'success' },
    archived: { label: '已归档', variant: 'warning' },
};

const COST_CENTER_NAMES = {
    Amazon001: 'Amazon', Walmart001: '沃尔玛', eBay001: 'eBay', USOffline001: '美国线下零售',
    China001: '中国', EMEA001: 'EMEA', TKUS001: '美国TK',
    SupplyChainTravel001: '供应链-差旅支出', HR001: 'HR', IT001: 'IT', Finance001: '财务',
    CEOOffice001: '总裁办', ProductDev001: '产品开发部', ProductRD001: '产品研发部',
};

function getCostCenterName(version) {
    const code = version.costCenterCode ?? version.costCenterCodes?.[0];
    return code ? (COST_CENTER_NAMES[code] ?? code) : '—';
}

// --------------- 预算表格行组件 ---------------
const BudgetRow = ({ category, budgetData, expandedIds, onToggle, onCellChange, level = 0 }) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedIds.includes(category.id);
    const rowData = budgetData[category.id] || {};

    // 计算行合计
    const rowTotal = Object.values(rowData).reduce((sum, val) => sum + (val || 0), 0);

    // 计算汇总值（如果有子项）
    const calculateSummary = (catId, monthIdx) => {
        const cat = flattenCategories(expenseCategories).find(c => c.id === catId);
        if (!cat?.children) return budgetData[catId]?.[monthIdx] || 0;

        let sum = 0;
        const addChildValues = (children) => {
            children.forEach(child => {
                if (child.children) {
                    addChildValues(child.children);
                } else {
                    sum += budgetData[child.id]?.[monthIdx] || 0;
                }
            });
        };
        addChildValues(cat.children);
        return sum;
    };

    const isParentRow = hasChildren;
    const bgClass = level === 0 ? 'bg-blue-50' : level === 1 && hasChildren ? 'bg-gray-50' : 'bg-white';
    const fontClass = level === 0 ? 'font-semibold text-blue-900' : level === 1 ? 'font-medium text-gray-800' : 'text-gray-700';

    return (
        <>
            <tr className={cn('border-b border-gray-100 hover:bg-gray-50/50', bgClass)}>
                {/* 费用科目列 */}
                <td className="sticky left-0 z-10 px-4 py-2 whitespace-nowrap border-r border-gray-200" style={{ backgroundColor: level === 0 ? '#eff6ff' : level === 1 && hasChildren ? '#f9fafb' : '#fff' }}>
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

                {/* 12个月数据列 */}
                {months.map((_, monthIdx) => {
                    const value = isParentRow ? calculateSummary(category.id, monthIdx) : (rowData[monthIdx] || 0);
                    return (
                        <td key={monthIdx} className="px-2 py-2 text-right border-r border-gray-100">
                            {isParentRow ? (
                                <span className={cn('text-sm', fontClass)}>
                                    {value > 0 ? value.toLocaleString() : '-'}
                                </span>
                            ) : (
                                <input
                                    type="text"
                                    value={value > 0 ? value.toLocaleString() : ''}
                                    onChange={(e) => {
                                        const newValue = parseInt(e.target.value.replace(/,/g, '')) || 0;
                                        onCellChange(category.id, monthIdx, newValue);
                                    }}
                                    className="w-full px-2 py-1 text-sm text-right bg-transparent border border-transparent rounded hover:border-gray-300 focus:border-blue-500 focus:bg-white focus:outline-none"
                                    placeholder="-"
                                />
                            )}
                        </td>
                    );
                })}

                {/* 合计列 */}
                <td className="sticky right-0 z-10 px-3 py-2 text-right font-medium border-l border-gray-200 bg-gray-50">
                    <span className={cn('text-sm', level === 0 ? 'text-blue-700' : 'text-gray-900')}>
                        {(isParentRow ? months.reduce((sum, _, idx) => sum + calculateSummary(category.id, idx), 0) : rowTotal).toLocaleString()}
                    </span>
                </td>
            </tr>

            {/* 子行 */}
            {hasChildren && isExpanded && category.children.map(child => (
                <BudgetRow
                    key={child.id}
                    category={child}
                    budgetData={budgetData}
                    expandedIds={expandedIds}
                    onToggle={onToggle}
                    onCellChange={onCellChange}
                    level={level + 1}
                />
            ))}
        </>
    );
};

// --------------- 主组件 ---------------
export default function BudgetVersionDetailPage({ versionId, versionData, onClose }) {
    // 如果没有传入版本数据，使用默认数据
    const version = versionData || {
        id: versionId || '1',
        code: 'BV-2024-001',
        name: '2024年度预算V1',
        budgetYear: '2024',
        effectiveDate: '2024-01-01',
        totalBudget: 15000000,
        status: 'active',
        costCenterCode: 'Amazon001',
        createdBy: 'Lyn',
        createdAt: '2023-11-15',
        description: '2024年度主预算版本，覆盖欧美平台',
    };

    const [budgetData, setBudgetData] = useState(() => generateBudgetData(version.id));
    const [expandedIds, setExpandedIds] = useState(['1', '1.1', '1.2', '2']);
    const [isEditing, setIsEditing] = useState(false);

    const statusConfig = STATUS_CONFIG[version.status] || STATUS_CONFIG.draft;

    const handleToggle = (id) => {
        setExpandedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleCellChange = (categoryId, monthIdx, value) => {
        setBudgetData(prev => ({
            ...prev,
            [categoryId]: {
                ...prev[categoryId],
                [monthIdx]: value,
            },
        }));
    };

    const handleExpandAll = () => {
        const allIds = flattenCategories(expenseCategories)
            .filter(c => c.children)
            .map(c => c.id);
        setExpandedIds(allIds);
    };

    const handleCollapseAll = () => {
        setExpandedIds([]);
    };

    // 计算总预算
    const calculateTotalBudget = () => {
        let total = 0;
        flattenCategories(expenseCategories).forEach(cat => {
            if (!cat.children) {
                const rowData = budgetData[cat.id] || {};
                total += Object.values(rowData).reduce((sum, val) => sum + (val || 0), 0);
            }
        });
        return total;
    };

    return (
        <div className="space-y-6">
            {/* 页面头部 */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-gray-900">{version.name}</h1>
                            <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                            版本编码: {version.code} | 预算年度: {version.budgetYear}年
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <SecondaryButton icon={Download}>导出Excel</SecondaryButton>
                </div>
            </div>

            {/* 表头信息卡片 */}
            <Card className="p-6">
                <div className="grid grid-cols-6 gap-6">
                    <div>
                        <p className="text-xs text-gray-500 mb-1">版本编码</p>
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">{version.code}</code>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 mb-1">预算年度</p>
                        <span className="text-sm font-medium flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {version.budgetYear}年
                        </span>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 mb-1">生效日期</p>
                        <span className="text-sm">{version.effectiveDate}</span>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 mb-1">创建人</p>
                        <span className="text-sm">{version.createdBy}</span>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 mb-1">成本中心</p>
                        <span className="text-sm font-medium flex items-center gap-1">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            {getCostCenterName(version)}
                        </span>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 mb-1">预算总额</p>
                        <span className="text-lg font-bold text-blue-600 flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            ¥{calculateTotalBudget().toLocaleString()}
                        </span>
                    </div>
                </div>
                {version.description && (
                    <div className="mt-4 pt-4 border-t">
                        <p className="text-xs text-gray-500 mb-1">备注说明</p>
                        <p className="text-sm text-gray-700">{version.description}</p>
                    </div>
                )}
            </Card>

            {/* 工具栏 */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleExpandAll}
                        className="text-sm text-blue-600 hover:underline"
                    >
                        全部展开
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                        onClick={handleCollapseAll}
                        className="text-sm text-blue-600 hover:underline"
                    >
                        全部收起
                    </button>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <TrendingUp className="w-4 h-4" />
                    <span>单位：元</span>
                </div>
            </div>

            {/* 预算表体 */}
            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm" style={{ minWidth: '1400px' }}>
                        <thead>
                            <tr className="bg-gray-100 border-b border-gray-200">
                                <th className="sticky left-0 z-20 px-4 py-3 text-left font-semibold text-gray-700 bg-gray-100 border-r border-gray-200" style={{ minWidth: '280px' }}>
                                    费用科目
                                </th>
                                {months.map((month, idx) => (
                                    <th key={idx} className="px-2 py-3 text-center font-semibold text-gray-700 border-r border-gray-100" style={{ minWidth: '90px' }}>
                                        {month}
                                    </th>
                                ))}
                                <th className="sticky right-0 z-20 px-3 py-3 text-center font-semibold text-gray-700 bg-gray-100 border-l border-gray-200" style={{ minWidth: '100px' }}>
                                    合计
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenseCategories.map(category => (
                                <BudgetRow
                                    key={category.id}
                                    category={category}
                                    budgetData={budgetData}
                                    expandedIds={expandedIds}
                                    onToggle={handleToggle}
                                    onCellChange={handleCellChange}
                                    level={0}
                                />
                            ))}
                            {/* 总计行 */}
                            <tr className="bg-blue-100 border-t-2 border-blue-300">
                                <td className="sticky left-0 z-10 px-4 py-3 font-bold text-blue-900 border-r border-gray-200 bg-blue-100">
                                    总计
                                </td>
                                {months.map((_, monthIdx) => {
                                    let monthTotal = 0;
                                    flattenCategories(expenseCategories).forEach(cat => {
                                        if (!cat.children) {
                                            monthTotal += budgetData[cat.id]?.[monthIdx] || 0;
                                        }
                                    });
                                    return (
                                        <td key={monthIdx} className="px-2 py-3 text-right font-bold text-blue-900 border-r border-blue-200">
                                            {monthTotal.toLocaleString()}
                                        </td>
                                    );
                                })}
                                <td className="sticky right-0 z-10 px-3 py-3 text-right font-bold text-blue-900 border-l border-gray-200 bg-blue-100">
                                    {calculateTotalBudget().toLocaleString()}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
