// src/pages/overview/ProductOverviewPage.js
import React from 'react';
import {
    Package,
    Boxes,
    Layers,
    Award,
    Sparkles,
    TrendingUp,
    TrendingDown,
    Minus
} from 'lucide-react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip as RechartsTooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid
} from 'recharts';

// ============== Mock 数据 ==============

const categoryDistributionData = [
    { name: '钓鱼竿', value: 820 },
    { name: '渔线轮', value: 650 },
    { name: '钓线', value: 480 },
    { name: '鱼饵', value: 390 },
    { name: '配件', value: 507 }
];

const monthlyNewProductData = [
    { month: '2025-10', count: 42 },
    { month: '2025-11', count: 38 },
    { month: '2025-12', count: 55 },
    { month: '2026-01', count: 48 },
    { month: '2026-02', count: 63 },
    { month: '2026-03', count: 71 }
];

const brandTop5Data = [
    { name: 'KastKing', count: 1240 },
    { name: 'ProAngler', count: 520 },
    { name: 'ReelMaster', count: 380 },
    { name: 'AquaLine', count: 357 },
    { name: 'LureCraft', count: 350 }
];

const recentActivities = [
    { title: 'Royale Legend 碳素路亚竿 2.4m 新规格已上架', time: '2 小时前' },
    { title: '渔线轮系列 BOM 结构更新完成', time: '5 小时前' },
    { title: 'Speed Demon 系列新增 3 个 SKU', time: '1 天前' },
    { title: 'Q1 品类模板批量更新完成', time: '2 天前' },
    { title: '新品牌 AquaLine 准入审核通过', time: '3 天前' }
];

const PIE_COLORS = ['#6366F1', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];

// ============== 组件 ==============

const StatCard = ({ icon: Icon, label, value, trend, trendType, color }) => (
    <div className="bg-white rounded-lg border p-4">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
            </div>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" />
            </div>
        </div>
        <div className="mt-2 flex items-center text-sm">
            {trendType === 'up' && (
                <>
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-green-600">{trend}</span>
                </>
            )}
            {trendType === 'down' && (
                <>
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    <span className="text-red-600">{trend}</span>
                </>
            )}
            {trendType === 'flat' && (
                <>
                    <Minus className="w-4 h-4 text-gray-400 mr-1" />
                    <span className="text-gray-500">{trend}</span>
                </>
            )}
        </div>
    </div>
);

const ProductOverviewPage = () => {
    const maxBrandCount = brandTop5Data[0].count;

    return (
        <div className="h-full flex flex-col bg-gray-50">
            {/* 页面标题 */}
            <div className="bg-white border-b px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold text-gray-800">产品中心概览</h1>
                        <p className="text-sm text-gray-500">产品数据总览与管理入口</p>
                    </div>
                </div>
            </div>

            {/* 内容区 */}
            <div className="flex-1 overflow-auto p-6">
                <div className="space-y-6">
                    {/* 统计卡片区 */}
                    <div className="grid grid-cols-4 gap-4">
                        <StatCard
                            icon={Boxes}
                            label="SKU 总数"
                            value="2,847 个"
                            trend="环比 +126"
                            trendType="up"
                            color="bg-indigo-50 text-indigo-600"
                        />
                        <StatCard
                            icon={Layers}
                            label="在售 SPU"
                            value="486 个"
                            trend="环比 +18"
                            trendType="up"
                            color="bg-blue-50 text-blue-600"
                        />
                        <StatCard
                            icon={Award}
                            label="活跃品牌"
                            value="12 个"
                            trend="较上月持平"
                            trendType="flat"
                            color="bg-green-50 text-green-600"
                        />
                        <StatCard
                            icon={Sparkles}
                            label="新品占比"
                            value="18.5%"
                            trend="同比 +3.2%"
                            trendType="up"
                            color="bg-amber-50 text-amber-600"
                        />
                    </div>

                    {/* 中部图表区 */}
                    <div className="grid grid-cols-2 gap-6">
                        {/* 品类 SKU 分布 */}
                        <div className="bg-white rounded-lg border p-4">
                            <h3 className="font-medium text-gray-800 mb-4">品类 SKU 分布</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={categoryDistributionData}
                                            cx="50%"
                                            cy="45%"
                                            innerRadius={60}
                                            outerRadius={85}
                                            paddingAngle={2}
                                            dataKey="value"
                                        >
                                            {categoryDistributionData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip
                                            formatter={(value, name, props) => {
                                                const percent = props?.payload?.percent
                                                    ? (props.payload.percent * 100).toFixed(1)
                                                    : 0;
                                                return [`${value} (${percent}%)`, name];
                                            }}
                                            contentStyle={{ fontSize: 12, padding: '4px 8px' }}
                                        />
                                        <Legend
                                            verticalAlign="bottom"
                                            align="center"
                                            iconType="circle"
                                            wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* 月度新品上架趋势 */}
                        <div className="bg-white rounded-lg border p-4">
                            <h3 className="font-medium text-gray-800 mb-4">月度新品上架趋势</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={monthlyNewProductData} margin={{ top: 5, right: 16, bottom: 0, left: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                        <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                                        <RechartsTooltip contentStyle={{ fontSize: 12, padding: '4px 8px' }} />
                                        <Line
                                            type="monotone"
                                            dataKey="count"
                                            stroke="#3B82F6"
                                            strokeWidth={2}
                                            dot={{ r: 4, fill: '#3B82F6', strokeWidth: 2, stroke: '#fff' }}
                                            activeDot={{ r: 6 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* 底部区域 */}
                    <div className="grid grid-cols-2 gap-6">
                        {/* 品牌 SKU TOP5 */}
                        <div className="bg-white rounded-lg border p-4">
                            <h3 className="font-medium text-gray-800 mb-4">品牌 SKU TOP5</h3>
                            <div className="space-y-4">
                                {brandTop5Data.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-medium">
                                            {idx + 1}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm text-gray-700 font-medium truncate">{item.name}</span>
                                                <span className="text-sm text-gray-500 ml-2">{item.count} 个</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-1.5">
                                                <div
                                                    className="bg-indigo-500 h-1.5 rounded-full"
                                                    style={{ width: `${(item.count / maxBrandCount) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 最近产品动态 */}
                        <div className="bg-white rounded-lg border p-4">
                            <h3 className="font-medium text-gray-800 mb-4">最近产品动态</h3>
                            <div className="space-y-3">
                                {recentActivities.map((item, idx) => (
                                    <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-700">{item.title}</p>
                                        <p className="text-xs text-gray-400 mt-1">{item.time}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductOverviewPage;
