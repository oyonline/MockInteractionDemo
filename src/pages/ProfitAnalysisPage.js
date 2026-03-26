// src/pages/ProfitAnalysisPage.js
// 利润分析列表页面
import React, { useState } from 'react';
import {
    Search, Download, TrendingUp, TrendingDown,
    DollarSign, PieChart, CheckCircle, Building2,
    Calendar, BarChart3, Eye, Percent, Target,
    ArrowUpRight, Wallet
} from 'lucide-react';

const cn = (...args) => args.filter(Boolean).join(' ');

// --------------- 业务线数据 ---------------
const businessLines = [
    { code: 'Amazon001', name: 'Amazon' },
    { code: 'Walmart001', name: '沃尔玛' },
    { code: 'eBay001', name: 'eBay' },
    { code: 'China001', name: '中国' },
    { code: 'EMEA001', name: 'EMEA' },
    { code: 'TKUS001', name: '美国TK' },
];

// --------------- 利润分析mock数据 ---------------
const initialProfitData = [
    // Amazon
    { id: '1', businessLineCode: 'Amazon001', period: '2024-01', revenue: 9200000, cost: 6850000, grossProfit: 2350000, operatingExpense: 1200000, netProfit: 1150000, targetProfit: 1000000, status: 'exceed', createdAt: '2024-01-31' },
    { id: '2', businessLineCode: 'Amazon001', period: '2024-02', revenue: 8100000, cost: 6200000, grossProfit: 1900000, operatingExpense: 1150000, netProfit: 750000, targetProfit: 900000, status: 'warning', createdAt: '2024-02-29' },
    { id: '3', businessLineCode: 'Amazon001', period: '2024-03', revenue: 8850000, cost: 6600000, grossProfit: 2250000, operatingExpense: 1180000, netProfit: 1070000, targetProfit: 950000, status: 'exceed', createdAt: '2024-03-31' },
    
    // 沃尔玛
    { id: '4', businessLineCode: 'Walmart001', period: '2024-01', revenue: 5800000, cost: 4350000, grossProfit: 1450000, operatingExpense: 650000, netProfit: 800000, targetProfit: 750000, status: 'exceed', createdAt: '2024-01-31' },
    { id: '5', businessLineCode: 'Walmart001', period: '2024-02', revenue: 4950000, cost: 3800000, grossProfit: 1150000, operatingExpense: 620000, netProfit: 530000, targetProfit: 650000, status: 'warning', createdAt: '2024-02-29' },
    { id: '6', businessLineCode: 'Walmart001', period: '2024-03', revenue: 6200000, cost: 4600000, grossProfit: 1600000, operatingExpense: 680000, netProfit: 920000, targetProfit: 800000, status: 'exceed', createdAt: '2024-03-31' },
    
    // eBay
    { id: '7', businessLineCode: 'eBay001', period: '2024-01', revenue: 3100000, cost: 2380000, grossProfit: 720000, operatingExpense: 380000, netProfit: 340000, targetProfit: 350000, status: 'warning', createdAt: '2024-01-31' },
    { id: '8', businessLineCode: 'eBay001', period: '2024-02', revenue: 3250000, cost: 2450000, grossProfit: 800000, operatingExpense: 390000, netProfit: 410000, targetProfit: 370000, status: 'exceed', createdAt: '2024-02-29' },
    { id: '9', businessLineCode: 'eBay001', period: '2024-03', revenue: 3350000, cost: 2580000, grossProfit: 770000, operatingExpense: 395000, netProfit: 375000, targetProfit: 380000, status: 'normal', createdAt: '2024-03-31' },
    
    // 中国
    { id: '10', businessLineCode: 'China001', period: '2024-01', revenue: 7200000, cost: 5400000, grossProfit: 1800000, operatingExpense: 950000, netProfit: 850000, targetProfit: 800000, status: 'exceed', createdAt: '2024-01-31' },
    { id: '11', businessLineCode: 'China001', period: '2024-02', revenue: 6400000, cost: 4900000, grossProfit: 1500000, operatingExpense: 920000, netProfit: 580000, targetProfit: 700000, status: 'warning', createdAt: '2024-02-29' },
    { id: '12', businessLineCode: 'China001', period: '2024-03', revenue: 7450000, cost: 5600000, grossProfit: 1850000, operatingExpense: 980000, netProfit: 870000, targetProfit: 820000, status: 'exceed', createdAt: '2024-03-31' },
    
    // EMEA
    { id: '13', businessLineCode: 'EMEA001', period: '2024-01', revenue: 4650000, cost: 3480000, grossProfit: 1170000, operatingExpense: 520000, netProfit: 650000, targetProfit: 600000, status: 'exceed', createdAt: '2024-01-31' },
    { id: '14', businessLineCode: 'EMEA001', period: '2024-02', revenue: 4050000, cost: 3120000, grossProfit: 930000, operatingExpense: 500000, netProfit: 430000, targetProfit: 520000, status: 'warning', createdAt: '2024-02-29' },
    { id: '15', businessLineCode: 'EMEA001', period: '2024-03', revenue: 5100000, cost: 3780000, grossProfit: 1320000, operatingExpense: 540000, netProfit: 780000, targetProfit: 680000, status: 'exceed', createdAt: '2024-03-31' },
    
    // 美国TK
    { id: '16', businessLineCode: 'TKUS001', period: '2024-01', revenue: 3200000, cost: 2560000, grossProfit: 640000, operatingExpense: 420000, netProfit: 220000, targetProfit: 200000, status: 'exceed', createdAt: '2024-01-31' },
    { id: '17', businessLineCode: 'TKUS001', period: '2024-02', revenue: 3500000, cost: 2730000, grossProfit: 770000, operatingExpense: 450000, netProfit: 320000, targetProfit: 280000, status: 'exceed', createdAt: '2024-02-29' },
    { id: '18', businessLineCode: 'TKUS001', period: '2024-03', revenue: 4100000, cost: 3120000, grossProfit: 980000, operatingExpense: 480000, netProfit: 500000, targetProfit: 400000, status: 'exceed', createdAt: '2024-03-31' },
];

// --------------- UI组件 ---------------
const SecondaryButton = ({ children, onClick, icon: Icon, className, size = 'md' }) => (
    <button onClick={onClick} className={cn(
        'inline-flex items-center gap-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors',
        size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm', className
    )}>
        {Icon && <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />}
        {children}
    </button>
);

const PrimaryButton = ({ children, onClick, icon: Icon, className, size = 'md' }) => (
    <button onClick={onClick} className={cn(
        'inline-flex items-center gap-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors',
        size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm', className
    )}>
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

const Input = ({ value, onChange, placeholder, className, icon: Icon }) => (
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
            className={cn('w-full border border-gray-300 rounded-lg py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500', Icon ? 'pl-10 pr-4' : 'px-4', className)}
        />
    </div>
);

const Select = ({ value, onChange, options, className, placeholder }) => (
    <select value={value} onChange={onChange} className={cn('border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white', className)}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
);

// --------------- 主组件 ---------------
export default function ProfitAnalysisPage({ onOpenDetail }) {
    const [profitData] = useState(initialProfitData);
    const [searchText, setSearchText] = useState('');
    const [filterBusinessLine, setFilterBusinessLine] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterPeriod, setFilterPeriod] = useState('');

    // 过滤数据
    const filteredData = profitData.filter(item => {
        const businessLine = businessLines.find(b => b.code === item.businessLineCode);
        const matchesSearch = !searchText ||
            businessLine?.name.toLowerCase().includes(searchText.toLowerCase()) ||
            item.period.includes(searchText);
        const matchesBusinessLine = !filterBusinessLine || item.businessLineCode === filterBusinessLine;
        const matchesStatus = !filterStatus || item.status === filterStatus;
        const matchesPeriod = !filterPeriod || item.period === filterPeriod;
        return matchesSearch && matchesBusinessLine && matchesStatus && matchesPeriod;
    });

    // 统计
    const stats = {
        totalRevenue: filteredData.reduce((sum, item) => sum + item.revenue, 0),
        totalCost: filteredData.reduce((sum, item) => sum + item.cost, 0),
        totalGrossProfit: filteredData.reduce((sum, item) => sum + item.grossProfit, 0),
        totalOperatingExpense: filteredData.reduce((sum, item) => sum + item.operatingExpense, 0),
        totalNetProfit: filteredData.reduce((sum, item) => sum + item.netProfit, 0),
        totalTargetProfit: filteredData.reduce((sum, item) => sum + item.targetProfit, 0),
        exceedCount: filteredData.filter(item => item.status === 'exceed').length,
        normalCount: filteredData.filter(item => item.status === 'normal').length,
        warningCount: filteredData.filter(item => item.status === 'warning').length,
    };

    const grossMargin = stats.totalRevenue > 0 ? (stats.totalGrossProfit / stats.totalRevenue) * 100 : 0;
    const netMargin = stats.totalRevenue > 0 ? (stats.totalNetProfit / stats.totalRevenue) * 100 : 0;
    const profitAchievement = stats.totalTargetProfit > 0 ? (stats.totalNetProfit / stats.totalTargetProfit) * 100 : 0;

    const periods = [...new Set(profitData.map(item => item.period))].sort();

    const handleViewDetail = (item) => {
        if (onOpenDetail) {
            onOpenDetail({
                id: `profit-analysis-${item.id}`,
                name: `利润分析: ${businessLines.find(b => b.code === item.businessLineCode)?.name || item.businessLineCode}`,
                path: '/finance-analysis/profit/detail',
                data: item,
            });
        }
    };

    return (
        <div className="space-y-6">
            {/* 页面头部 */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">利润分析</h1>
                    <p className="text-sm text-gray-500 mt-1">分析利润达成情况，监控毛利率和净利率</p>
                </div>
                <SecondaryButton icon={Download}>导出报表</SecondaryButton>
            </div>

            {/* 统计卡片 */}
            <div className="grid grid-cols-4 gap-4">
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">总收入</p>
                            <p className="text-xl font-bold text-gray-900">¥{(stats.totalRevenue / 10000).toFixed(2)}万</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                            <Wallet className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">净利润</p>
                            <p className="text-xl font-bold text-gray-900">¥{(stats.totalNetProfit / 10000).toFixed(2)}万</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', grossMargin >= 30 ? 'bg-green-100' : 'bg-yellow-100')}>
                            <Percent className={cn('w-5 h-5', grossMargin >= 30 ? 'text-green-600' : 'text-yellow-600')} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">毛利率</p>
                            <p className={cn('text-xl font-bold', grossMargin >= 30 ? 'text-green-600' : 'text-yellow-600')}>
                                {grossMargin.toFixed(1)}%
                            </p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', netMargin >= 15 ? 'bg-green-100' : 'bg-yellow-100')}>
                            <PieChart className={cn('w-5 h-5', netMargin >= 15 ? 'text-green-600' : 'text-yellow-600')} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">净利率</p>
                            <p className={cn('text-xl font-bold', netMargin >= 15 ? 'text-green-600' : 'text-yellow-600')}>
                                {netMargin.toFixed(1)}%
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
                            <span className="text-sm text-gray-600">超额完成</span>
                        </div>
                        <span className="text-2xl font-bold text-green-600">{stats.exceedCount}</span>
                    </div>
                </Card>
                <Card className="p-4 border-l-4 border-l-blue-500">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Target className="w-5 h-5 text-blue-600" />
                            <span className="text-sm text-gray-600">达成正常</span>
                        </div>
                        <span className="text-2xl font-bold text-blue-600">{stats.normalCount}</span>
                    </div>
                </Card>
                <Card className="p-4 border-l-4 border-l-yellow-500">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <TrendingDown className="w-5 h-5 text-yellow-600" />
                            <span className="text-sm text-gray-600">未达目标</span>
                        </div>
                        <span className="text-2xl font-bold text-yellow-600">{stats.warningCount}</span>
                    </div>
                </Card>
            </div>

            {/* 搜索和筛选 */}
            <Card className="p-4">
                <div className="flex items-center gap-4 flex-wrap">
                    <Input
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="搜索业务线、月份..."
                        icon={Search}
                        className="w-64"
                    />
                    <Select
                        value={filterBusinessLine}
                        onChange={(e) => setFilterBusinessLine(e.target.value)}
                        options={businessLines.map(b => ({ value: b.code, label: b.name }))}
                        placeholder="全部业务线"
                        className="w-40"
                    />
                    <Select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        options={[
                            { value: 'exceed', label: '超额完成' },
                            { value: 'normal', label: '达成正常' },
                            { value: 'warning', label: '未达目标' },
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
                    {(filterBusinessLine || filterStatus || filterPeriod) && (
                        <button
                            onClick={() => { setFilterBusinessLine(''); setFilterStatus(''); setFilterPeriod(''); }}
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
                                <th className="px-4 py-3 text-left font-medium text-gray-600">业务线</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">周期</th>
                                <th className="px-4 py-3 text-right font-medium text-gray-600">收入</th>
                                <th className="px-4 py-3 text-right font-medium text-gray-600">成本</th>
                                <th className="px-4 py-3 text-right font-medium text-gray-600">毛利</th>
                                <th className="px-4 py-3 text-right font-medium text-gray-600">毛利率</th>
                                <th className="px-4 py-3 text-right font-medium text-gray-600">净利润</th>
                                <th className="px-4 py-3 text-right font-medium text-gray-600">净利率</th>
                                <th className="px-4 py-3 text-center font-medium text-gray-600">状态</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredData.map(item => {
                                const businessLine = businessLines.find(b => b.code === item.businessLineCode);
                                const grossMargin = (item.grossProfit / item.revenue) * 100;
                                const netMargin = (item.netProfit / item.revenue) * 100;
                                const profitAchievement = (item.netProfit / item.targetProfit) * 100;
                                
                                return (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <Building2 className="w-4 h-4 text-gray-400" />
                                                <span className="font-medium text-gray-900">{businessLine?.name || item.businessLineCode}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                <span className="text-gray-600">{item.period}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right text-gray-600">¥{item.revenue.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-right text-gray-600">¥{item.cost.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-right font-medium text-gray-900">¥{item.grossProfit.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-right">
                                            <span className={cn('text-sm', grossMargin >= 30 ? 'text-green-600' : 'text-yellow-600')}>
                                                {grossMargin.toFixed(1)}%
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <span className={cn('font-medium', profitAchievement >= 100 ? 'text-green-600' : 'text-red-600')}>
                                                ¥{item.netProfit.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <span className={cn('text-sm', netMargin >= 15 ? 'text-green-600' : 'text-yellow-600')}>
                                                {netMargin.toFixed(1)}%
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {item.status === 'exceed' ? <Badge variant="success">超额</Badge> :
                                             item.status === 'normal' ? <Badge variant="info">正常</Badge> :
                                             <Badge variant="warning">未达标</Badge>}
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => handleViewDetail(item)}
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
                            <p>暂无利润分析数据</p>
                        </div>
                    )}
                </div>

                {filteredData.length > 0 && (
                    <div className="px-4 py-3 border-t bg-gray-50 flex items-center justify-between">
                        <p className="text-sm text-gray-500">共 {filteredData.length} 条记录</p>
                        <div className="text-sm text-gray-500">显示 1 - {filteredData.length} 条</div>
                    </div>
                )}
            </Card>
        </div>
    );
}
