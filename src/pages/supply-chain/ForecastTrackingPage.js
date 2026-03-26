// src/pages/supply-chain/ForecastTrackingPage.js
import React from 'react';
import { BarChart3, Calendar, Filter, Download, Search } from 'lucide-react';

const ForecastTrackingPage = () => {
    return (
        <div className="h-full flex flex-col bg-gray-50">
            {/* 页面标题 */}
            <div className="bg-white border-b px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-800">Forecast Tracking</h1>
                        <p className="text-sm text-gray-500 mt-1">预测跟踪与执行监控</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
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
                        <span className="text-sm text-gray-700">2026年</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                        <Filter className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">全部事业部</span>
                    </div>
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="搜索SKU/产品名称..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* 内容区域 - 占位 */}
            <div className="flex-1 p-6">
                <div className="bg-white rounded-lg border border-dashed border-gray-300 p-12">
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                            <BarChart3 className="w-8 h-8 text-blue-500" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Forecast Tracking</h3>
                        <p className="text-sm text-gray-500 max-w-md">
                            此页面用于跟踪销量预测的执行情况，对比预测值与实际销售数据，
                            分析偏差原因并支持调整决策。
                        </p>
                        <div className="mt-6 flex gap-3">
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm">预测准确率</span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm">偏差分析</span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm">趋势监控</span>
                        </div>
                    </div>
                </div>

                {/* 占位数据表格 */}
                <div className="mt-6 bg-white rounded-lg border">
                    <div className="px-6 py-4 border-b">
                        <h3 className="font-medium text-gray-800">预测执行概览</h3>
                    </div>
                    <div className="p-8 text-center text-gray-400">
                        <p>数据加载中...</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForecastTrackingPage;
