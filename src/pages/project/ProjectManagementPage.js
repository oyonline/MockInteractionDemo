// src/pages/project/ProjectManagementPage.js
import React, { useState } from 'react';
import { Search, Filter, Plus, FolderKanban, Clock, CheckCircle, AlertCircle, Users } from 'lucide-react';

const ProjectManagementPage = () => {
    const [activeTab, setActiveTab] = useState('all');

    return (
        <div className="h-full flex flex-col bg-gray-50">
            {/* 页面标题 */}
            <div className="bg-white border-b px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-800">项目管理</h1>
                        <p className="text-sm text-gray-500 mt-1">项目规划、执行与跟踪</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            <Plus className="w-4 h-4" />
                            新建项目
                        </button>
                    </div>
                </div>
            </div>

            {/* 统计卡片 */}
            <div className="grid grid-cols-5 gap-4 p-6">
                <div className="bg-white rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">全部项目</p>
                            <p className="text-2xl font-semibold text-gray-800 mt-1">24</p>
                        </div>
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <FolderKanban className="w-5 h-5 text-gray-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">进行中</p>
                            <p className="text-2xl font-semibold text-blue-600 mt-1">12</p>
                        </div>
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Clock className="w-5 h-5 text-blue-500" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">已完成</p>
                            <p className="text-2xl font-semibold text-green-600 mt-1">8</p>
                        </div>
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">延期风险</p>
                            <p className="text-2xl font-semibold text-red-600 mt-1">3</p>
                        </div>
                        <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                            <AlertCircle className="w-5 h-5 text-red-500" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">项目成员</p>
                            <p className="text-2xl font-semibold text-gray-800 mt-1">45</p>
                        </div>
                        <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                            <Users className="w-5 h-5 text-purple-500" />
                        </div>
                    </div>
                </div>
            </div>

            {/* 筛选栏 */}
            <div className="bg-white border-b px-6 py-3">
                <div className="flex items-center gap-4">
                    <div className="flex items-center bg-gray-100 rounded-lg p-1">
                        {['all', 'active', 'completed', 'delayed'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-1.5 rounded-md text-sm transition-colors ${
                                    activeTab === tab
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                            >
                                {tab === 'all' && '全部'}
                                {tab === 'active' && '进行中'}
                                {tab === 'completed' && '已完成'}
                                {tab === 'delayed' && '延期'}
                            </button>
                        ))}
                    </div>
                    <div className="h-6 w-px bg-gray-300" />
                    <div className="relative flex-1 max-w-xs">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="搜索项目名称..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                        <Filter className="w-4 h-4" />
                        筛选
                    </button>
                </div>
            </div>

            {/* 项目列表 */}
            <div className="flex-1 p-6">
                <div className="bg-white rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">项目名称</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">负责人</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">进度</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">状态</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">截止日期</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { name: 'Q2新品上市', owner: '张三', progress: 75, status: 'active', date: '2026-04-30' },
                                { name: '仓储系统升级', owner: '李四', progress: 45, status: 'active', date: '2026-05-15' },
                                { name: '供应商管理系统', owner: '王五', progress: 90, status: 'completed', date: '2026-03-20' },
                                { name: '欧洲市场拓展', owner: '赵六', progress: 30, status: 'delayed', date: '2026-06-01' },
                            ].map((project, idx) => (
                                <tr key={idx} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-gray-800">{project.name}</div>
                                    </td>
                                    <td className="px-4 py-3">{project.owner}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className={`h-2 rounded-full ${
                                                        project.status === 'completed' ? 'bg-green-500' :
                                                        project.status === 'delayed' ? 'bg-red-500' : 'bg-blue-500'
                                                    }`}
                                                    style={{ width: `${project.progress}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-gray-500">{project.progress}%</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded text-xs ${
                                            project.status === 'completed' ? 'bg-green-100 text-green-700' :
                                            project.status === 'delayed' ? 'bg-red-100 text-red-700' :
                                            'bg-blue-100 text-blue-700'
                                        }`}>
                                            {project.status === 'completed' ? '已完成' :
                                             project.status === 'delayed' ? '延期' : '进行中'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-500">{project.date}</td>
                                    <td className="px-4 py-3">
                                        <button className="text-blue-600 hover:text-blue-700 text-sm">查看详情</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProjectManagementPage;
