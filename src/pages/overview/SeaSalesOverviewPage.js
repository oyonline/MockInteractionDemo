// src/pages/overview/SeaSalesOverviewPage.js
import React from 'react';
import { Globe2, TrendingUp, DollarSign, Package } from 'lucide-react';

const SeaSalesOverviewPage = () => {
    return (
        <div className="h-full flex flex-col bg-gray-50">
            <div className="bg-white border-b px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                        <Globe2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold text-gray-800">东南亚事业部概览</h1>
                        <p className="text-sm text-gray-500">东南亚市场销售总览</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 p-6">
                <div className="bg-white rounded-lg border border-dashed border-gray-300 p-12">
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                            <TrendingUp className="w-8 h-8 text-green-500" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">东南亚事业部概览</h3>
                        <p className="text-sm text-gray-500 max-w-md">
                            此页面用于展示东南亚事业部的整体销售概况，包括新加坡、马来西亚、泰国等国家市场表现。
                        </p>
                        <div className="mt-6 flex gap-3">
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm">国家分布</span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm">平台分析</span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm">增长趋势</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeaSalesOverviewPage;
