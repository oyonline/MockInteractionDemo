// src/pages/sales/SalesPlanDashboardPage.js
import React from 'react';
import { Search, Filter, Download, Calendar, Target, TrendingUp, PieChart, AlertCircle } from 'lucide-react';

const SalesPlanDashboardPage = () => {
    return (
        <div className="h-full flex flex-col bg-gray-50">
            {/* 页面标题 */}
            <div className="bg-white border-b px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-800">计划测算看板</h1>
                        <p className="text-sm text-gray-500 mt-1">销售计划执行监控与测算分析</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                            <Download className="w-4 h-4" />
                            导出报告
                        </button>
                    </div>
                </div>
            </div>

            {/* 筛选栏 */}
            <div className="bg-white border-b px-6 py-3">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">2026年Q1</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                        <Filter className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">美国事业部</span>
                    </div>
                    <div className="relative flex-1 max-w-xs">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="搜索产品线..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* 核心指标 */}
            <div className="grid grid-cols-4 gap-4 p-6">
                <div className="bg-white rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Target className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">计划达成率</p>
                            <p className="text-2xl font-semibold text-gray-800">87.3%</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">同比增长</p>
                            <p className="text-2xl font-semibold text-gray-800">+15.2%</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                            <PieChart className="w-5 h-5 text-yellow-500" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">预测准确率</p>
                            <p className="text-2xl font-semibold text-gray-800">92.5%</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                            <AlertCircle className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">风险预警</p>
                            <p className="text-2xl font-semibold text-red-600">3</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 主内容区 */}
            <div className="flex-1 px-6 pb-6">
                <div className="grid grid-cols-3 gap-6 h-full">
                    {/* 左侧：计划执行概览 */}
                    <div className="col-span-2 bg-white rounded-lg border p-4">
                        <h3 className="font-medium text-gray-800 mb-4">计划执行概览</h3>
                        <div className="space-y-4">
                            {['路亚竿系列', '渔轮系列', '钓线系列'].map((product, idx) => (
                                <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium text-gray-800">{product}</span>
                                        <span className="text-sm text-gray-500">目标：$500K | 实际：${(420 + idx * 50)}K</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className={`h-2 rounded-full ${idx === 0 ? 'bg-green-500' : idx === 1 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                            style={{ width: `${[92, 85, 78][idx]}%` }}
                                        />
                                    </div>
                                    <div className="mt-2 flex items-center justify-between text-sm">
                                        <span className={idx === 0 ? 'text-green-600' : idx === 1 ? 'text-yellow-600' : 'text-red-600'}>
                                            达成率：{[92, 85, 78][idx]}%
                                        </span>
                                        <span className="text-gray-400">
                                            {idx === 2 ? '低于预期，需关注' : '进度正常'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 右侧：预警信息 */}
                    <div className="bg-white rounded-lg border p-4">
                        <h3 className="font-medium text-gray-800 mb-4">风险预警</h3>
                        <div className="space-y-3">
                            <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-red-700">钓线系列库存偏低</p>
                                        <p className="text-xs text-red-600 mt-1">预计3周后缺货，建议补货</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-yellow-700">渔轮系列增速放缓</p>
                                        <p className="text-xs text-yellow-600 mt-1">本月增速环比下降5%</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-blue-700">新品上市计划延期</p>
                                        <p className="text-xs text-blue-600 mt-1">预计延期2周，需调整营销计划</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <h3 className="font-medium text-gray-800 mt-6 mb-4">近期测算</h3>
                        <div className="space-y-3">
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-700">3月销量预测调整</p>
                                <p className="text-xs text-gray-500 mt-1">基于实际销售上调 8%</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-700">Q2库存规划建议</p>
                                <p className="text-xs text-gray-500 mt-1">建议增加钓线系列备货</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesPlanDashboardPage;
