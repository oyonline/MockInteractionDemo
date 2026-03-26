// src/pages/quality/QualityInboundPage.js
import React, { useState } from 'react';
import { Search, Filter, Plus, Download, ClipboardCheck, CheckCircle, XCircle } from 'lucide-react';

const QualityInboundPage = () => {
    const [activeTab, setActiveTab] = useState('pending');

    return (
        <div className="h-full flex flex-col bg-gray-50">
            {/* 页面标题 */}
            <div className="bg-white border-b px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-800">入库质检</h1>
                        <p className="text-sm text-gray-500 mt-1">采购入库质量检验与管理</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            <Plus className="w-4 h-4" />
                            新建质检单
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
                            <p className="text-sm text-gray-500">待质检</p>
                            <p className="text-2xl font-semibold text-blue-600 mt-1">12</p>
                        </div>
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <ClipboardCheck className="w-5 h-5 text-blue-500" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">质检通过</p>
                            <p className="text-2xl font-semibold text-green-600 mt-1">86</p>
                        </div>
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">质检异常</p>
                            <p className="text-2xl font-semibold text-red-600 mt-1">5</p>
                        </div>
                        <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                            <XCircle className="w-5 h-5 text-red-500" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">本月质检完成率</p>
                            <p className="text-2xl font-semibold text-gray-800 mt-1">94.5%</p>
                        </div>
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <ClipboardCheck className="w-5 h-5 text-gray-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* 筛选栏 */}
            <div className="bg-white border-b px-6 py-3">
                <div className="flex items-center gap-4">
                    <div className="flex items-center bg-gray-100 rounded-lg p-1">
                        {['pending', 'completed', 'exception'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-1.5 rounded-md text-sm transition-colors ${
                                    activeTab === tab
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                            >
                                {tab === 'pending' && '待质检'}
                                {tab === 'completed' && '已完成'}
                                {tab === 'exception' && '异常'}
                            </button>
                        ))}
                    </div>
                    <div className="h-6 w-px bg-gray-300" />
                    <div className="relative flex-1 max-w-xs">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="搜索质检单号/SKU..."
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
                                <th className="px-4 py-3 text-left font-medium text-gray-700">质检单号</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">入库单号</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">供应商</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">SKU数量</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">质检状态</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">质检员</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">创建时间</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b hover:bg-gray-50">
                                <td className="px-4 py-3 text-blue-600">QC202603001</td>
                                <td className="px-4 py-3">RK202603001</td>
                                <td className="px-4 py-3">某某供应商</td>
                                <td className="px-4 py-3">50</td>
                                <td className="px-4 py-3">
                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">待质检</span>
                                </td>
                                <td className="px-4 py-3">-</td>
                                <td className="px-4 py-3 text-gray-500">2026-03-15 10:30</td>
                                <td className="px-4 py-3">
                                    <button className="text-blue-600 hover:text-blue-700 text-sm">开始质检</button>
                                </td>
                            </tr>
                            <tr className="border-b hover:bg-gray-50">
                                <td className="px-4 py-3 text-blue-600">QC202603002</td>
                                <td className="px-4 py-3">RK202603002</td>
                                <td className="px-4 py-3">某某供应商</td>
                                <td className="px-4 py-3">100</td>
                                <td className="px-4 py-3">
                                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">已通过</span>
                                </td>
                                <td className="px-4 py-3">张三</td>
                                <td className="px-4 py-3 text-gray-500">2026-03-14 14:20</td>
                                <td className="px-4 py-3">
                                    <button className="text-blue-600 hover:text-blue-700 text-sm">查看详情</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default QualityInboundPage;
