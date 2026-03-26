// src/pages/overview/HrOverviewPage.js
import React from 'react';
import { Briefcase, Users, UserPlus, Award } from 'lucide-react';

const HrOverviewPage = () => {
    return (
        <div className="h-full flex flex-col bg-gray-50">
            <div className="bg-white border-b px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-rose-50 rounded-lg flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-rose-600" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold text-gray-800">人力资源概览</h1>
                        <p className="text-sm text-gray-500">人事业务总览与管理入口</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 p-6">
                <div className="bg-white rounded-lg border border-dashed border-gray-300 p-12">
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-4">
                            <Users className="w-8 h-8 text-rose-500" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">人力资源概览</h3>
                        <p className="text-sm text-gray-500 max-w-md">
                            此页面用于展示人力资源的整体概况，包括员工统计、招聘进度、绩效情况等。
                        </p>
                        <div className="mt-6 flex gap-3">
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm">员工统计</span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm">招聘管理</span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm">绩效管理</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HrOverviewPage;
