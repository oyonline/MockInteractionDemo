// src/pages/RevenueAnalysisPage.js
// 收入分析列表页面
import React, { useState } from 'react';
import {
    Search, Download, Filter, TrendingUp, TrendingDown,
    DollarSign, PieChart, CheckCircle, Building2,
    Calendar, BarChart3, Eye, ShoppingCart, Target,
    ArrowUpRight, ArrowDownRight
} from 'lucide-react';

const cn = (...args) => args.filter(Boolean).join(' ');

// --------------- 成本中心/业务线数据 ---------------
const businessLines = [
    { code: 'Amazon001', name: 'Amazon' },
    { code: 'Walmart001', name: '沃尔玛' },
    { code: 'eBay001', name: 'eBay' },
    { code: 'China001', name: '中国' },
    { code: 'EMEA001', name: 'EMEA' },
    { code: 'TKUS001', name: '美国TK' },
];

// --------------- 收入类型 ---------------
const revenueTypes = [
    { code: 'PRODUCT', name: '商品销售收入' },
    { code: 'SERVICE', name: '服务收入' },
    { code: 'OTHER', name: '其他收入' },
];

// --------------- 收入分析mock数据 ---------------
const initialRevenueData = [
    // Amazon
    { id: '1', businessLineCode: 'Amazon001', revenueType: 'PRODUCT', period: '2024-01', targetRevenue: 8500000, actualRevenue: 9200000, lastYearRevenue: 7800000, orderCount: 12500, avgOrderValue: 736, status: 'exceed', createdAt: '2024-01-31' },
    { id: '2', businessLineCode: 'Amazon001', revenueType: 'PRODUCT', period: '2024-02', targetRevenue: 8000000, actualRevenue: 8100000, lastYearRevenue: 7200000, orderCount: 11200, avgOrderValue: 723, status: 'normal', createdAt: '2024-02-29' },
    { id: '3', businessLineCode: 'Amazon001', revenueType: 'PRODUCT', period: '2024-03', targetRevenue: 9000000, actualRevenue: 8850000, lastYearRevenue: 8200000, orderCount: 12800, avgOrderValue: 691, status: 'warning', createdAt: '2024-03-31' },
    
    // 沃尔玛
    { id: '4', businessLineCode: 'Walmart001', revenueType: 'PRODUCT', period: '2024-01', targetRevenue: 5500000, actualRevenue: 5800000, lastYearRevenue: 5000000, orderCount: 8900, avgOrderValue: 652, status: 'exceed', createdAt: '2024-01-31' },
    { id: '5', businessLineCode: 'Walmart001', revenueType: 'PRODUCT', period: '2024-02', targetRevenue: 5200000, actualRevenue: 4950000, lastYearRevenue: 4800000, orderCount: 7800, avgOrderValue: 635, status: 'warning', createdAt: '2024-02-29' },
    { id: '6', businessLineCode: 'Walmart001', revenueType: 'PRODUCT', period: '2024-03', targetRevenue: 5800000, actualRevenue: 6200000, lastYearRevenue: 5300000, orderCount: 9500, avgOrderValue: 653, status: 'exceed', createdAt: '2024-03-31' },
    
    // eBay
    { id: '7', businessLineCode: 'eBay001', revenueType: 'PRODUCT', period: '2024-01', targetRevenue: 3200000, actualRevenue: 3100000, lastYearRevenue: 2900000, orderCount: 5600, avgOrderValue: 554, status: 'warning', createdAt: '2024-01-31' },
    { id: '8', businessLineCode: 'eBay001', revenueType: 'PRODUCT', period: '2024-02', targetRevenue: 3000000, actualRevenue: 3250000, lastYearRevenue: 2700000, orderCount: 5900, avgOrderValue: 551, status: 'exceed', createdAt: '2024-02-29' },
    { id: '9', businessLineCode: 'eBay001', revenueType: 'PRODUCT', period: '2024-03', targetRevenue: 3400000, actualRevenue: 3350000, lastYearRevenue: 3000000, orderCount: 6100, avgOrderValue: 549, status: 'normal', createdAt: '2024-03-31' },
    
    // 中国
    { id: '10', businessLineCode: 'China001', revenueType: 'PRODUCT', period: '2024-01', targetRevenue: 6800000, actualRevenue: 7200000, lastYearRevenue: 6200000, orderCount: 15200, avgOrderValue: 474, status: 'exceed', createdAt: '2024-01-31' },
    { id: '11', businessLineCode: 'China001', revenueType: 'PRODUCT', period: '2024-02', targetRevenue: 6500000, actualRevenue: 6400000, lastYearRevenue: 5800000, orderCount: 13800, avgOrderValue: 464, status: 'warning', createdAt: '2024-02-29' },
    { id: '12', businessLineCode: 'China001', revenueType: 'PRODUCT', period: '2024-03', targetRevenue: 7000000, actualRevenue: 7450000, lastYearRevenue: 6500000, orderCount: 16200, avgOrderValue: 460, status: 'exceed', createdAt: '2024-03-31' },
    
    // EMEA
    { id: '13', businessLineCode: 'EMEA001', revenueType: 'PRODUCT', period: '2024-01', targetRevenue: 4500000, actualRevenue: 4650000, lastYearRevenue: 4100000, orderCount: 6200, avgOrderValue: 750, status: 'exceed', createdAt: '2024-01-31' },
    { id: '14', businessLineCode: 'EMEA001', revenueType: 'PRODUCT', period: '2024-02', targetRevenue: 4200000, actualRevenue: 4050000, lastYearRevenue: 3800000, orderCount: 5500, avgOrderValue: 736, status: 'warning', createdAt: '2024-02-29' },
    { id: '15', businessLineCode: 'EMEA001', revenueType: 'PRODUCT', period: '2024-03', targetRevenue: 4800000, actualRevenue: 5100000, lastYearRevenue: 4400000, orderCount: 6900, avgOrderValue: 739, status: 'exceed', createdAt: '2024-03-31' },
    
    // 美国TK
    { id: '16', businessLineCode: 'TKUS001', revenueType: 'PRODUCT', period: '2024-01', targetRevenue: 2800000, actualRevenue: 3200000, lastYearRevenue: 1500000, orderCount: 8900, avgOrderValue: 360, status: 'exceed', createdAt: '2024-01-31' },
    { id: '17', businessLineCode: 'TKUS001', revenueType: 'PRODUCT', period: '2024-02', targetRevenue: 3000000, actualRevenue: 3500000, lastYearRevenue: 1800000, orderCount: 10200, avgOrderValue: 343, status: 'exceed', createdAt: '2024-02-29' },
    { id: '18', businessLineCode: 'TKUS001', revenueType: 'PRODUCT', period: '2024-03', targetRevenue: 3500000, actualRevenue: 4100000, lastYearRevenue: 2200000, orderCount: 12500, avgOrderValue: 328, status: 'exceed', createdAt: '2024-03-31' },
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
            className={cn(
                'w-full border border-gray-300 rounded-lg py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                Icon ? 'pl-10 pr-4' : 'px-4',
                className
            )}
        />
    </div>
);

const Select = ({ value, onChange, options, className, placeholder }) => (
    <select
        value={value}
        onChange={onChange}
        className={cn('border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white', className)}
    >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
);

// --------------- 主组件 ---------------
export default function RevenueAnalysisPage({ onOpenDetail }) {
    const [revenueData] = useState(initialRevenueData);
    const [searchText, setSearchText] = useState('');
    const [filterBusinessLine, setFilterBusinessLine] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterPeriod, setFilterPeriod] = useState('');

    // 过滤数据
    const filteredData = revenueData.filter(item => {
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
        totalTarget: filteredData.reduce((sum, item) => sum + item.targetRevenue, 0),
        totalActual: filteredData.reduce((sum, item) => sum + item.actualRevenue, 0),
        totalLastYear: filteredData.reduce((sum, item) => sum + item.lastYearRevenue, 0),
        totalOrders: filteredData.reduce((sum, item) => sum + item.orderCount, 0),
        exceedCount: filteredData.filter(item => item.status === 'exceed').length,
        normalCount: filteredData.filter(item => item.status === 'normal').length,
        warningCount: filteredData.filter(item => item.status === 'warning').length,
    };

    const achievementRate = stats.totalTarget > 0 ? (stats.totalActual / stats.totalTarget) * 100 : 0;
    const yoyGrowth = stats.totalLastYear > 0 ? ((stats.totalActual - stats.totalLastYear) / stats.totalLastYear) * 100 : 0;

    // 获取唯一周期列表
    const periods = [...new Set(revenueData.map(item => item.period))].sort();

    const handleViewDetail = (item) => {
        if (onOpenDetail) {
            onOpenDetail({
                id: `revenue-analysis-${item.id}`,
                name: `收入分析: ${businessLines.find(b => b.code === item.businessLineCode)?.name || item.businessLineCode}`,
                path: '/finance-analysis/revenue/detail',
                data: item,
            });
        }
    };

    return (
        <div className="space-y-6">
            {/* 页面头部 */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">收入分析</h1>
                    <p className="text-sm text-gray-500 mt-1">分析销售收入达成情况，监控收入增长趋势</p>
                </div>
                <SecondaryButton icon={Download}>导出报表</SecondaryButton>
            </div>

            {/* 统计卡片 */}
            <div className="grid grid-cols-4 gap-4">
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Target className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">目标收入</p>
                            <p className="text-xl font-bold text-gray-900">¥{(stats.totalTarget / 10000).toFixed(2)}万</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">实际收入</p>
                            <p className="text-xl font-bold text-gray-900">¥{(stats.totalActual / 10000).toFixed(2)}万</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', achievementRate >= 100 ? 'bg-green-100' : 'bg-yellow-100')}>
                            {achievementRate >= 100 ? <ArrowUpRight className="w-5 h-5 text-green-600" /> : <TrendingUp className="w-5 h-5 text-yellow-600" />}
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">目标达成率</p>
                            <p className={cn('text-xl font-bold', achievementRate >= 100 ? 'text-green-600' : 'text-yellow-600')}>
                                {achievementRate.toFixed(1)}%
                            </p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', yoyGrowth >= 0 ? 'bg-green-100' : 'bg-red-100')}>
                            {yoyGrowth >= 0 ? <TrendingUp className="w-5 h-5 text-green-600" /> : <TrendingDown className="w-5 h-5 text-red-600" />}
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">同比增长</p>
                            <p className={cn('text-xl font-bold', yoyGrowth >= 0 ? 'text-green-600' : 'text-red-600')}>
                                {yoyGrowth >= 0 ? '+' : ''}{yoyGrowth.toFixed(1)}%
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
                                <th className="px-4 py-3 text-right font-medium text-gray-600">目标收入</th>
                                <th className="px-4 py-3 text-right font-medium text-gray-600">实际收入</th>
                                <th className="px-4 py-3 text-right font-medium text-gray-600">达成率</th>
                                <th className="px-4 py-3 text-right font-medium text-gray-600">同比增长</th>
                                <th className="px-4 py-3 text-right font-medium text-gray-600">订单数</th>
                                <th className="px-4 py-3 text-right font-medium text-gray-600">客单价</th>
                                <th className="px-4 py-3 text-center font-medium text-gray-600">状态</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredData.map(item => {
                                const businessLine = businessLines.find(b => b.code === item.businessLineCode);
                                const achievementRate = (item.actualRevenue / item.targetRevenue) * 100;
                                const yoyRate = ((item.actualRevenue - item.lastYearRevenue) / item.lastYearRevenue) * 100;
                                
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
                                        <td className="px-4 py-3 text-right text-gray-600">¥{item.targetRevenue.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-right">
                                            <span className={cn('font-medium', achievementRate >= 100 ? 'text-green-600' : 'text-gray-900')}>
                                                ¥{item.actualRevenue.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <span className={cn(
                                                'font-medium',
                                                achievementRate >= 100 ? 'text-green-600' : achievementRate >= 90 ? 'text-yellow-600' : 'text-red-600'
                                            )}>
                                                {achievementRate.toFixed(1)}%
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <span className={cn('text-sm', yoyRate >= 0 ? 'text-green-600' : 'text-red-600')}>
                                                {yoyRate >= 0 ? '+' : ''}{yoyRate.toFixed(1)}%
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right text-gray-600">{item.orderCount.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-right text-gray-600">¥{item.avgOrderValue}</td>
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
                            <p>暂无收入分析数据</p>
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
