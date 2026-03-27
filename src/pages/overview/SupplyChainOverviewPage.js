// src/pages/overview/SupplyChainOverviewPage.js
import React from 'react';
import { CalendarDays, BarChart3, TrendingUp, Target } from 'lucide-react';

const SupplyChainOverviewPage = () => {
    return (
        <div className="h-full flex flex-col bg-gray-50">
            <div className="bg-white border-b px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-cyan-50 rounded-lg flex items-center justify-center">
                        <CalendarDays className="w-5 h-5 text-cyan-600" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold text-gray-800">供应链计划概览</h1>
                        <p className="text-sm text-gray-500">预测与计划管理总览</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 p-6">
                <div className="bg-white rounded-lg border border-dashed border-gray-300 p-12">
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-cyan-50 rounded-full flex items-center justify-center mb-4">
                            <BarChart3 className="w-8 h-8 text-cyan-500" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">供应链计划概览</h3>
                        <p className="text-sm text-gray-500 max-w-md">
                            此页面用于展示供应链计划的整体概况，包括Forecast Tracking汇总、供应计划执行状态等。
                        </p>
                        <div className="mt-6 flex gap-3">
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm">预测跟踪</span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm">供应计划</span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm">库存规划</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupplyChainOverviewPage;
