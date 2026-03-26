// src/pages/supply-chain/SupplyPlanPage.js
import React from 'react';
import { ClipboardList, Calendar, Filter, Plus, Search, Truck, Package, Clock } from 'lucide-react';

const SupplyPlanPage = () => {
    return (
        <div className="h-full flex flex-col bg-gray-50">
            {/* 页面标题 */}
            <div className="bg-white border-b px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-800">供应计划管理</h1>
                        <p className="text-sm text-gray-500 mt-1">采购计划、生产计划与库存规划</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            <Plus className="w-4 h-4" />
                            新建计划
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
                        <span className="text-sm text-gray-700">全部状态</span>
                    </div>
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="搜索计划编号/供应商..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* 内容区域 - 占位 */}
            <div className="flex-1 p-6">
                <div className="bg-white rounded-lg border border-dashed border-gray-300 p-12">
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                            <ClipboardList className="w-8 h-8 text-green-500" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">供应计划管理</h3>
                        <p className="text-sm text-gray-500 max-w-md">
                            此页面用于管理采购计划、生产计划和库存规划，
                            基于销量预测生成供应建议，并跟踪执行进度。
                        </p>
                        <div className="mt-6 flex gap-3">
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm">采购计划</span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm">生产计划</span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm">库存规划</span>
                        </div>
                    </div>
                </div>

                {/* 功能模块占位 */}
                <div className="mt-6 grid grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg border p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                <Truck className="w-5 h-5 text-blue-500" />
                            </div>
                            <h3 className="font-medium text-gray-800">采购计划</h3>
                        </div>
                        <p className="text-sm text-gray-500">基于预测生成采购建议，管理供应商交期</p>
                    </div>

                    <div className="bg-white rounded-lg border p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                                <Package className="w-5 h-5 text-purple-500" />
                            </div>
                            <h3 className="font-medium text-gray-800">生产计划</h3>
                        </div>
                        <p className="text-sm text-gray-500">协调生产排程，优化产能利用率</p>
                    </div>

                    <div className="bg-white rounded-lg border p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                                <Clock className="w-5 h-5 text-orange-500" />
                            </div>
                            <h3 className="font-medium text-gray-800">库存规划</h3>
                        </div>
                        <p className="text-sm text-gray-500">安全库存设置，补货策略管理</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupplyPlanPage;
