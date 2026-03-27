// src/pages/sales/UsPrivateDomainPage.js
// 美国事业部私域管理 - 占位页面
import React from 'react';
import { Users, Globe, TrendingUp, Mail, MessageCircle, Target } from 'lucide-react';

const cn = (...args) => args.filter(Boolean).join(' ');

// 统计卡片数据
const statCards = [
    { name: '私域客户数', value: '12,580', icon: Users, color: 'bg-blue-500', trend: '+12.5%' },
    { name: '活跃客户数', value: '8,230', icon: Globe, color: 'bg-green-500', trend: '+8.3%' },
    { name: '邮件订阅数', value: '9,845', icon: Mail, color: 'bg-purple-500', trend: '+15.2%' },
    { name: '社群成员数', value: '3,420', icon: MessageCircle, color: 'bg-orange-500', trend: '+22.1%' },
];

// 功能模块
const featureModules = [
    { id: 'customer', name: '客户管理', desc: '客户档案 · 分层运营', icon: Users },
    { id: 'marketing', name: '营销工具', desc: '邮件营销 · 活动管理', icon: Mail },
    { id: 'community', name: '社群运营', desc: '社群管理 · 互动分析', icon: MessageCircle },
    { id: 'analysis', name: '数据分析', desc: '转化分析 · ROI追踪', icon: TrendingUp },
    { id: 'target', name: '目标管理', desc: 'KPI设定 · 业绩追踪', icon: Target },
];

const Card = ({ children, className }) => (
    <div className={cn('bg-white rounded-xl border border-gray-200 shadow-sm', className)}>
        {children}
    </div>
);

export default function UsPrivateDomainPage() {
    return (
        <div className="p-6">
            {/* 页面标题 */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">美国事业部私域管理</h1>
                <p className="text-gray-500 mt-1">私域客户运营 · 营销自动化 · 数据驱动增长</p>
            </div>

            {/* 统计卡片 */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                {statCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <Card key={card.name} className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">{card.name}</p>
                                    <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                                    <p className="text-xs text-green-600 mt-1 font-medium">{card.trend} 较上月</p>
                                </div>
                                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", card.color)}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* 功能模块入口 */}
            <Card className="p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">功能模块</h3>
                <div className="grid grid-cols-5 gap-4">
                    {featureModules.map((module) => {
                        const Icon = module.icon;
                        return (
                            <div 
                                key={module.id}
                                className="p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors group"
                            >
                                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center mb-3 shadow-sm group-hover:shadow transition-shadow">
                                    <Icon className="w-5 h-5 text-indigo-600" />
                                </div>
                                <h4 className="font-medium text-gray-900 mb-1">{module.name}</h4>
                                <p className="text-xs text-gray-500">{module.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </Card>

            {/* 占位提示 */}
            <Card className="p-8">
                <div className="text-center py-8">
                    <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-10 h-10 text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">模块开发中</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                        美国事业部私域管理模块正在建设中，将提供私域客户管理、营销自动化、社群运营等功能。
                    </p>
                    <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400">
                        <span>预计上线时间：</span>
                        <span className="font-medium text-gray-600">2024年Q2</span>
                    </div>
                </div>
            </Card>
        </div>
    );
}
