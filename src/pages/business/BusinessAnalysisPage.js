// src/pages/business/BusinessAnalysisPage.js
import React from 'react';
import { TrendingUp, DollarSign, Target, BarChart3, PieChart, Activity, Calendar } from 'lucide-react';

const BusinessAnalysisPage = () => {
    return (
        <div className="h-full flex flex-col bg-gray-50">
            {/* 页面标题 */}
            <div className="bg-white border-b px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-800">经营分析</h1>
                        <p className="text-sm text-gray-500 mt-1">企业经营数据分析与决策支持</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">2026年Q1</span>
                    </div>
                </div>
            </div>

            {/* 核心指标 */}
            <div className="grid grid-cols-4 gap-4 p-6">
                <div className="bg-white rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">总营收</p>
                            <p className="text-2xl font-semibold text-gray-800 mt-1">$8.5M</p>
                        </div>
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-blue-500" />
                        </div>
                    </div>
                    <div className="mt-2 flex items-center text-sm">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-green-600">+15.3%</span>
                        <span className="text-gray-400 ml-1">同比</span>
                    </div>
                </div>
                <div className="bg-white rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">毛利率</p>
                            <p className="text-2xl font-semibold text-gray-800 mt-1">42.8%</p>
                        </div>
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                            <PieChart className="w-5 h-5 text-green-500" />
                        </div>
                    </div>
                    <div className="mt-2 flex items-center text-sm">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-green-600">+2.1%</span>
                        <span className="text-gray-400 ml-1">同比</span>
                    </div>
                </div>
                <div className="bg-white rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">净利润</p>
                            <p className="text-2xl font-semibold text-gray-800 mt-1">$1.2M</p>
                        </div>
                        <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                            <Target className="w-5 h-5 text-purple-500" />
                        </div>
                    </div>
                    <div className="mt-2 flex items-center text-sm">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-green-600">+8.7%</span>
                        <span className="text-gray-400 ml-1">同比</span>
                    </div>
                </div>
                <div className="bg-white rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">经营效率</p>
                            <p className="text-2xl font-semibold text-gray-800 mt-1">87.5%</p>
                        </div>
                        <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                            <Activity className="w-5 h-5 text-orange-500" />
                        </div>
                    </div>
                </div>
            </div>

            {/* 图表区域 */}
            <div className="flex-1 px-6 pb-6">
                <div className="grid grid-cols-2 gap-6 h-full">
                    <div className="bg-white rounded-lg border p-4">
                        <h3 className="font-medium text-gray-800 mb-4">营收趋势分析</h3>
                        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                            <span className="text-gray-400">营收趋势图表</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border p-4">
                        <h3 className="font-medium text-gray-800 mb-4">事业部贡献占比</h3>
                        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                            <span className="text-gray-400">事业部占比图表</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border p-4">
                        <h3 className="font-medium text-gray-800 mb-4">成本结构分析</h3>
                        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                            <span className="text-gray-400">成本结构图表</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border p-4">
                        <h3 className="font-medium text-gray-800 mb-4">关键指标雷达图</h3>
                        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                            <span className="text-gray-400">雷达图</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessAnalysisPage;
