// src/pages/sales/SalesDataAggregationPage.js
import React from 'react';
import { Search, Filter, Download, BarChart3, TrendingUp, Calendar, Globe } from 'lucide-react';

const SalesDataAggregationPage = () => {
    return (
        <div className="h-full flex flex-col bg-gray-50">
            {/* 页面标题 */}
            <div className="bg-white border-b px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-800">数据聚合分析</h1>
                        <p className="text-sm text-gray-500 mt-1">多维度销售数据聚合与分析</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                            <Download className="w-4 h-4" />
                            导出报表
                        </button>
                    </div>
                </div>
            </div>

            {/* 筛选栏 */}
            <div className="bg-white border-b px-6 py-3">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">2026年3月</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                        <Globe className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">全部事业部</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                        <Filter className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">全部渠道</span>
                    </div>
                    <div className="relative flex-1 max-w-xs">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="搜索产品/SKU..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* 统计卡片 */}
            <div className="grid grid-cols-4 gap-4 p-6">
                <div className="bg-white rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">总销售额</p>
                            <p className="text-2xl font-semibold text-gray-800 mt-1">$2.4M</p>
                        </div>
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-blue-500" />
                        </div>
                    </div>
                    <div className="mt-2 flex items-center text-sm">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-green-600">+12.5%</span>
                        <span className="text-gray-400 ml-1">vs 上月</span>
                    </div>
                </div>
                <div className="bg-white rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">总订单量</p>
                            <p className="text-2xl font-semibold text-gray-800 mt-1">15,234</p>
                        </div>
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-green-500" />
                        </div>
                    </div>
                    <div className="mt-2 flex items-center text-sm">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-green-600">+8.3%</span>
                        <span className="text-gray-400 ml-1">vs 上月</span>
                    </div>
                </div>
                <div className="bg-white rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">平均客单价</p>
                            <p className="text-2xl font-semibold text-gray-800 mt-1">$157</p>
                        </div>
                        <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-yellow-500" />
                        </div>
                    </div>
                    <div className="mt-2 flex items-center text-sm">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-green-600">+3.2%</span>
                        <span className="text-gray-400 ml-1">vs 上月</span>
                    </div>
                </div>
                <div className="bg-white rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">退货率</p>
                            <p className="text-2xl font-semibold text-gray-800 mt-1">2.1%</p>
                        </div>
                        <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-red-500" />
                        </div>
                    </div>
                    <div className="mt-2 flex items-center text-sm">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-green-600">-0.5%</span>
                        <span className="text-gray-400 ml-1">vs 上月</span>
                    </div>
                </div>
            </div>

            {/* 图表区域 */}
            <div className="flex-1 px-6 pb-6">
                <div className="grid grid-cols-2 gap-6 h-full">
                    <div className="bg-white rounded-lg border p-4">
                        <h3 className="font-medium text-gray-800 mb-4">销售额趋势</h3>
                        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                            <span className="text-gray-400">销售额趋势图表</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border p-4">
                        <h3 className="font-medium text-gray-800 mb-4">渠道分布</h3>
                        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                            <span className="text-gray-400">渠道分布图表</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border p-4">
                        <h3 className="font-medium text-gray-800 mb-4">品类销售占比</h3>
                        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                            <span className="text-gray-400">品类占比图表</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border p-4">
                        <h3 className="font-medium text-gray-800 mb-4">区域销售分布</h3>
                        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                            <span className="text-gray-400">区域分布图表</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesDataAggregationPage;
