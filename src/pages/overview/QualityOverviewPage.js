// src/pages/overview/QualityOverviewPage.js
import React from 'react';
import { TestTube, CheckCircle, AlertTriangle, ClipboardCheck } from 'lucide-react';

const QualityOverviewPage = () => {
    return (
        <div className="h-full flex flex-col bg-gray-50">
            <div className="bg-white border-b px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
                        <TestTube className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold text-gray-800">质量管理概览</h1>
                        <p className="text-sm text-gray-500">质量业务总览与管理入口</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 p-6">
                <div className="bg-white rounded-lg border border-dashed border-gray-300 p-12">
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-4">
                            <ClipboardCheck className="w-8 h-8 text-teal-500" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">质量管理概览</h3>
                        <p className="text-sm text-gray-500 max-w-md">
                            此页面用于展示质量管理的整体概况，包括入库质检统计、客诉处理情况、质量指标等。
                        </p>
                        <div className="mt-6 flex gap-3">
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm">入库质检</span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm">客诉处理</span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm">质量指标</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QualityOverviewPage;
