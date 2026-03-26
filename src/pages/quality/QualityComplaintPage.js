// src/pages/quality/QualityComplaintPage.js
import React, { useState } from 'react';
import { Search, Filter, Plus, Download, MessageSquare, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const QualityComplaintPage = () => {
    const [activeTab, setActiveTab] = useState('pending');

    return (
        <div className="h-full flex flex-col bg-gray-50">
            {/* 页面标题 */}
            <div className="bg-white border-b px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-800">客诉质量</h1>
                        <p className="text-sm text-gray-500 mt-1">客户投诉处理与质量改进</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            <Plus className="w-4 h-4" />
                            登记客诉
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
                            <p className="text-sm text-gray-500">待处理</p>
                            <p className="text-2xl font-semibold text-red-600 mt-1">8</p>
                        </div>
                        <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">处理中</p>
                            <p className="text-2xl font-semibold text-yellow-600 mt-1">15</p>
                        </div>
                        <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                            <Clock className="w-5 h-5 text-yellow-500" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">已解决</p>
                            <p className="text-2xl font-semibold text-green-600 mt-1">42</p>
                        </div>
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">本月客诉率</p>
                            <p className="text-2xl font-semibold text-gray-800 mt-1">2.3%</p>
                        </div>
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <MessageSquare className="w-5 h-5 text-gray-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* 筛选栏 */}
            <div className="bg-white border-b px-6 py-3">
                <div className="flex items-center gap-4">
                    <div className="flex items-center bg-gray-100 rounded-lg p-1">
                        {['pending', 'processing', 'resolved'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-1.5 rounded-md text-sm transition-colors ${
                                    activeTab === tab
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                            >
                                {tab === 'pending' && '待处理'}
                                {tab === 'processing' && '处理中'}
                                {tab === 'resolved' && '已解决'}
                            </button>
                        ))}
                    </div>
                    <div className="h-6 w-px bg-gray-300" />
                    <div className="relative flex-1 max-w-xs">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="搜索客诉单号/SKU..."
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
                                <th className="px-4 py-3 text-left font-medium text-gray-700">客诉单号</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">SKU</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">客诉类型</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">客诉来源</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">状态</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">负责人</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">创建时间</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b hover:bg-gray-50">
                                <td className="px-4 py-3 text-blue-600">CS202603001</td>
                                <td className="px-4 py-3">SKU-001-A</td>
                                <td className="px-4 py-3">质量问题</td>
                                <td className="px-4 py-3">Amazon</td>
                                <td className="px-4 py-3">
                                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">待处理</span>
                                </td>
                                <td className="px-4 py-3">-</td>
                                <td className="px-4 py-3 text-gray-500">2026-03-15 09:30</td>
                                <td className="px-4 py-3">
                                    <button className="text-blue-600 hover:text-blue-700 text-sm">处理</button>
                                </td>
                            </tr>
                            <tr className="border-b hover:bg-gray-50">
                                <td className="px-4 py-3 text-blue-600">CS202603002</td>
                                <td className="px-4 py-3">SKU-002-B</td>
                                <td className="px-4 py-3">描述不符</td>
                                <td className="px-4 py-3">eBay</td>
                                <td className="px-4 py-3">
                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">处理中</span>
                                </td>
                                <td className="px-4 py-3">李四</td>
                                <td className="px-4 py-3 text-gray-500">2026-03-14 16:45</td>
                                <td className="px-4 py-3">
                                    <button className="text-blue-600 hover:text-blue-700 text-sm">跟进</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default QualityComplaintPage;
