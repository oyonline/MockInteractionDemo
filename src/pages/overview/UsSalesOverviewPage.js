// src/pages/overview/UsSalesOverviewPage.js
import React from 'react';
import { Globe, TrendingUp, DollarSign, Package } from 'lucide-react';

const UsSalesOverviewPage = () => {
    return (
        <div className="h-full flex flex-col bg-gray-50">
            <div className="bg-white border-b px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Globe className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold text-gray-800">美国事业部概览</h1>
                        <p className="text-sm text-gray-500">美国市场销售总览</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 p-6">
                <div className="bg-white rounded-lg border border-dashed border-gray-300 p-12">
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                            <TrendingUp className="w-8 h-8 text-blue-500" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">美国事业部概览</h3>
                        <p className="text-sm text-gray-500 max-w-md">
                            此页面用于展示美国事业部的整体销售概况，包括各渠道业绩、目标达成情况等关键指标。
                        </p>
                        <div className="mt-6 flex gap-3">
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm">销售趋势</span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm">渠道分析</span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm">目标达成</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UsSalesOverviewPage;
