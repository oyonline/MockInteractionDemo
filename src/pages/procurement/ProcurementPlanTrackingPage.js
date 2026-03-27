// src/pages/procurement/ProcurementPlanTrackingPage.js
import React, { useState } from 'react';
import { Search, Filter, Plus, Download, ClipboardList, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const ProcurementPlanTrackingPage = () => {
    const [activeTab, setActiveTab] = useState('pending');

    return (
        <div className="h-full flex flex-col bg-gray-50">
            {/* 页面标题 */}
            <div className="bg-white border-b px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-800">采购计划执行跟进</h1>
                        <p className="text-sm text-gray-500 mt-1">采购计划制定、执行与跟踪管理</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            <Plus className="w-4 h-4" />
                            新建采购计划
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                            <Download className="w-4 h-4" />
                            导出
                        </button>
                    </div>
                </div>
            </div>

            {/* 统计卡片 */}
            <div className="grid grid-cols-4 gap-4 p-6">
                <div className="bg-white rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">待下单</p>
                            <p className="text-2xl font-semibold text-yellow-600 mt-1">12</p>
                        </div>
                        <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                            <ClipboardList className="w-5 h-5 text-yellow-500" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">采购中</p>
                            <p className="text-2xl font-semibold text-blue-600 mt-1">28</p>
                        </div>
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Clock className="w-5 h-5 text-blue-500" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">已到货</p>
                            <p className="text-2xl font-semibold text-green-600 mt-1">156</p>
                        </div>
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">异常预警</p>
                            <p className="text-2xl font-semibold text-red-600 mt-1">3</p>
                        </div>
                        <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                            <AlertCircle className="w-5 h-5 text-red-500" />
                        </div>
                    </div>
                </div>
            </div>

            {/* 筛选栏 */}
            <div className="bg-white border-b px-6 py-3">
                <div className="flex items-center gap-4">
                    <div className="flex items-center bg-gray-100 rounded-lg p-1">
                        {['pending', 'processing', 'completed', 'abnormal'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-1.5 rounded-md text-sm transition-colors ${
                                    activeTab === tab
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                            >
                                {tab === 'pending' && '待下单'}
                                {tab === 'processing' && '采购中'}
                                {tab === 'completed' && '已完成'}
                                {tab === 'abnormal' && '异常'}
                            </button>
                        ))}
                    </div>
                    <div className="h-6 w-px bg-gray-300" />
                    <div className="relative flex-1 max-w-xs">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="搜索计划号/SKU/供应商..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                        <Filter className="w-4 h-4" />
                        筛选
                    </button>
                </div>
            </div>

            {/* 表格区域 */}
            <div className="flex-1 p-6">
                <div className="bg-white rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">计划号</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">SKU</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">供应商</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">计划数量</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">状态</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">预计交期</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">实际进度</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b hover:bg-gray-50">
                                <td className="px-4 py-3 text-blue-600">PO202603001</td>
                                <td className="px-4 py-3">SKU-001-A</td>
                                <td className="px-4 py-3">供应商A</td>
                                <td className="px-4 py-3">1,000</td>
                                <td className="px-4 py-3">
                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">待下单</span>
                                </td>
                                <td className="px-4 py-3 text-gray-500">2026-04-15</td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-20 bg-gray-200 rounded-full h-1.5">
                                            <div className="w-0 bg-blue-500 h-1.5 rounded-full" />
                                        </div>
                                        <span className="text-xs text-gray-500">0%</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <button className="text-blue-600 hover:text-blue-700 text-sm">下单</button>
                                </td>
                            </tr>
                            <tr className="border-b hover:bg-gray-50">
                                <td className="px-4 py-3 text-blue-600">PO202603002</td>
                                <td className="px-4 py-3">SKU-002-B</td>
                                <td className="px-4 py-3">供应商B</td>
                                <td className="px-4 py-3">2,500</td>
                                <td className="px-4 py-3">
                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">生产中</span>
                                </td>
                                <td className="px-4 py-3 text-gray-500">2026-04-10</td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-20 bg-gray-200 rounded-full h-1.5">
                                            <div className="w-3/5 bg-blue-500 h-1.5 rounded-full" />
                                        </div>
                                        <span className="text-xs text-gray-500">60%</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <button className="text-blue-600 hover:text-blue-700 text-sm">跟进</button>
                                </td>
                            </tr>
                            <tr className="border-b hover:bg-gray-50">
                                <td className="px-4 py-3 text-blue-600">PO202603003</td>
                                <td className="px-4 py-3">SKU-003-C</td>
                                <td className="px-4 py-3">供应商C</td>
                                <td className="px-4 py-3">500</td>
                                <td className="px-4 py-3">
                                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">运输中</span>
                                </td>
                                <td className="px-4 py-3 text-gray-500">2026-03-20</td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-20 bg-gray-200 rounded-full h-1.5">
                                            <div className="w-4/5 bg-purple-500 h-1.5 rounded-full" />
                                        </div>
                                        <span className="text-xs text-gray-500">80%</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <button className="text-blue-600 hover:text-blue-700 text-sm">查看物流</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProcurementPlanTrackingPage;
