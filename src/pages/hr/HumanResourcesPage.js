// src/pages/hr/HumanResourcesPage.js
import React from 'react';
import { Users, UserPlus, Briefcase, Calendar, TrendingUp, Award, Search, Filter } from 'lucide-react';

const HumanResourcesPage = () => {
    return (
        <div className="h-full flex flex-col bg-gray-50">
            {/* 页面标题 */}
            <div className="bg-white border-b px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-800">人力资源</h1>
                        <p className="text-sm text-gray-500 mt-1">员工管理、招聘与绩效</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            <UserPlus className="w-4 h-4" />
                            添加员工
                        </button>
                    </div>
                </div>
            </div>

            {/* 统计卡片 */}
            <div className="grid grid-cols-4 gap-4 p-6">
                <div className="bg-white rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">在职员工</p>
                            <p className="text-2xl font-semibold text-gray-800 mt-1">186</p>
                        </div>
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Users className="w-5 h-5 text-blue-500" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">本月入职</p>
                            <p className="text-2xl font-semibold text-green-600 mt-1">8</p>
                        </div>
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                            <UserPlus className="w-5 h-5 text-green-500" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">开放职位</p>
                            <p className="text-2xl font-semibold text-purple-600 mt-1">12</p>
                        </div>
                        <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                            <Briefcase className="w-5 h-5 text-purple-500" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">本月离职</p>
                            <p className="text-2xl font-semibold text-red-600 mt-1">2</p>
                        </div>
                        <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-red-500" />
                        </div>
                    </div>
                </div>
            </div>

            {/* 功能模块 */}
            <div className="flex-1 px-6 pb-6">
                <div className="grid grid-cols-3 gap-6 mb-6">
                    <div className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                <Users className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-800">员工信息管理</h3>
                                <p className="text-sm text-gray-500 mt-1">员工档案、合同管理</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                                <Briefcase className="w-6 h-6 text-green-500" />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-800">招聘管理</h3>
                                <p className="text-sm text-gray-500 mt-1">职位发布、简历筛选</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                                <Award className="w-6 h-6 text-purple-500" />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-800">绩效管理</h3>
                                <p className="text-sm text-gray-500 mt-1">绩效考核、目标设定</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 员工列表 */}
                <div className="bg-white rounded-lg border">
                    <div className="px-6 py-4 border-b flex items-center justify-between">
                        <h3 className="font-medium text-gray-800">员工列表</h3>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="搜索员工姓名..."
                                    className="pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                                <Filter className="w-4 h-4" />
                                筛选
                            </button>
                        </div>
                    </div>
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">姓名</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">部门</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">职位</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">入职日期</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">状态</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { name: '张三', dept: '销售部', position: '销售经理', date: '2023-06-01', status: 'active' },
                                { name: '李四', dept: '采购部', position: '采购专员', date: '2024-01-15', status: 'active' },
                                { name: '王五', dept: '财务部', position: '财务主管', date: '2022-09-20', status: 'active' },
                                { name: '赵六', dept: '技术部', position: '产品经理', date: '2024-03-01', status: 'active' },
                            ].map((employee, idx) => (
                                <tr key={idx} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                                                {employee.name[0]}
                                            </div>
                                            <span className="font-medium text-gray-800">{employee.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">{employee.dept}</td>
                                    <td className="px-4 py-3">{employee.position}</td>
                                    <td className="px-4 py-3 text-gray-500">{employee.date}</td>
                                    <td className="px-4 py-3">
                                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">在职</span>
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

export default HumanResourcesPage;
