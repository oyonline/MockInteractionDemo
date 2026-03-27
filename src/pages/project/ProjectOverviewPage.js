// src/pages/project/ProjectOverviewPage.js
// 项目管理 - 概览页（飞书项目风格）
import React, { useState } from 'react';
import {
    Plus,
    Search,
    Filter,
    Grid3X3,
    List,
    MoreHorizontal,
    Clock,
    CheckCircle2,
    AlertCircle,
    TrendingUp,
    Calendar,
    Users,
    ArrowRight,
    Kanban
} from 'lucide-react';

const cn = (...args) => args.filter(Boolean).join(' ');

// 统计卡片数据
const statsData = [
    { label: '进行中', value: 8, icon: Clock, color: 'bg-blue-500', trend: '+2 本月新增' },
    { label: '已完成', value: 24, icon: CheckCircle2, color: 'bg-green-500', trend: '本年度' },
    { label: '延期风险', value: 3, icon: AlertCircle, color: 'bg-orange-500', trend: '需关注' },
    { label: '已延期', value: 2, icon: AlertCircle, color: 'bg-red-500', trend: '紧急处理' },
];

// 分类统计
const categoryStats = [
    { name: '美国事业部', count: 12, color: 'bg-blue-100 text-blue-700' },
    { name: '欧洲事业部', count: 8, color: 'bg-purple-100 text-purple-700' },
    { name: '东南亚事业部', count: 6, color: 'bg-orange-100 text-orange-700' },
    { name: '中国事业部', count: 10, color: 'bg-green-100 text-green-700' },
];

// 阶段配置
const stageConfig = {
    '01': { name: '需求调研', color: 'bg-blue-500' },
    '02': { name: '立项初评', color: 'bg-indigo-500' },
    '03': { name: '产品初评', color: 'bg-purple-500' },
    '04': { name: '打样测试', color: 'bg-amber-500' },
    '05': { name: '产品终评', color: 'bg-pink-500' },
    '06': { name: '首单开售', color: 'bg-emerald-500' },
    '07': { name: '上市复盘', color: 'bg-cyan-500' },
};

// Mock 项目数据
const projects = [
    {
        id: 'PM202403001',
        name: '智能保温杯-美',
        stage: '04',
        status: 'ongoing',
        dept: '美国事业部',
        pm: '李四',
        members: ['张三', '王五', '赵六'],
        progress: 45,
        endDate: '2024-06-30',
        risk: 'normal',
    },
    {
        id: 'PM202403002',
        name: '便携榨汁机-东南亚',
        stage: '02',
        status: 'ongoing',
        dept: '东南亚事业部',
        pm: '赵六',
        members: ['钱七', '孙八'],
        progress: 25,
        endDate: '2024-05-15',
        risk: 'high',
    },
    {
        id: 'PM202402015',
        name: '无线充电器-欧洲',
        stage: '06',
        status: 'ongoing',
        dept: '欧洲事业部',
        pm: '周八',
        members: ['吴九', '郑十', '钱十一'],
        progress: 75,
        endDate: '2024-04-20',
        risk: 'normal',
    },
    {
        id: 'PM202403008',
        name: '智能门锁-美',
        stage: '01',
        status: 'ongoing',
        dept: '美国事业部',
        pm: '李十二',
        members: ['张三'],
        progress: 15,
        endDate: '2024-08-30',
        risk: 'normal',
    },
    {
        id: 'PM202403012',
        name: '空气炸锅-东南亚',
        stage: '07',
        status: 'completed',
        dept: '东南亚事业部',
        pm: '张十四',
        members: ['王十三', '赵十五'],
        progress: 100,
        endDate: '2024-03-15',
        risk: 'normal',
    },
    {
        id: 'PM202402035',
        name: '加湿器-东南亚',
        stage: '05',
        status: 'ongoing',
        dept: '东南亚事业部',
        pm: '周二十六',
        members: ['孙二十五', '吴二十七'],
        progress: 68,
        endDate: '2024-05-01',
        risk: 'normal',
    },
];

export default function ProjectOverviewPage({ onOpenProject, onCreateProject }) {
    const [viewMode, setViewMode] = useState('card'); // 'card' | 'list'
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="h-full flex flex-col bg-gray-50">
            {/* 页面标题 */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">新品开发项目</h1>
                        <p className="text-sm text-gray-500 mt-1">管理从需求到上市的全生命周期</p>
                    </div>
                    <button
                        onClick={onCreateProject}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        新建项目
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-6">
                {/* 统计卡片区域 */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    {statsData.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div key={index} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">{stat.label}</p>
                                        <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                                        <p className="text-xs text-gray-400 mt-2">{stat.trend}</p>
                                    </div>
                                    <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', stat.color)}>
                                        <Icon className="w-5 h-5 text-white" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* 分类统计 + 筛选栏 */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700">本年度项目分布：</span>
                            <div className="flex items-center gap-2">
                                {categoryStats.map((cat, index) => (
                                    <span key={index} className={cn(
                                        'px-3 py-1 rounded-full text-xs font-medium',
                                        cat.color
                                    )}>
                                        {cat.name} {cat.count}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="搜索项目..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
                                />
                            </div>
                            <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
                                <Filter className="w-4 h-4" />
                                筛选
                            </button>
                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => setViewMode('card')}
                                    className={cn(
                                        'px-3 py-2 text-sm',
                                        viewMode === 'card' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50'
                                    )}
                                >
                                    <Kanban className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={cn(
                                        'px-3 py-2 text-sm',
                                        viewMode === 'list' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50'
                                    )}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 项目卡片列表 */}
                <div className="grid grid-cols-3 gap-4">
                    {projects.map((project) => {
                        const stageInfo = stageConfig[project.stage];
                        return (
                            <div
                                key={project.id}
                                onClick={() => onOpenProject && onOpenProject(project)}
                                className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-indigo-300 cursor-pointer transition-all group"
                            >
                                {/* 项目头部 */}
                                <div className="flex items-start justify-between mb-3">
                                    <div className={cn(
                                        'px-2 py-1 rounded text-xs font-medium',
                                        stageInfo.color,
                                        'text-white'
                                    )}>
                                        {stageInfo.name}
                                    </div>
                                    <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-opacity">
                                        <MoreHorizontal className="w-4 h-4 text-gray-400" />
                                    </button>
                                </div>

                                {/* 项目名称 */}
                                <h3 className="font-semibold text-gray-900 mb-1">{project.name}</h3>
                                <p className="text-xs text-gray-500 mb-4">{project.id}</p>

                                {/* 进度条 */}
                                <div className="mb-4">
                                    <div className="flex items-center justify-between text-xs mb-1">
                                        <span className="text-gray-500">项目进度</span>
                                        <span className="font-medium text-gray-900">{project.progress}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={cn(
                                                'h-full rounded-full transition-all',
                                                project.progress === 100 ? 'bg-green-500' : 'bg-indigo-500'
                                            )}
                                            style={{ width: `${project.progress}%` }}
                                        />
                                    </div>
                                </div>

                                {/* 成员头像 */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="flex -space-x-2">
                                            {project.members.slice(0, 3).map((member, idx) => (
                                                <div
                                                    key={idx}
                                                    className="w-7 h-7 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-xs font-medium text-indigo-600"
                                                >
                                                    {member[0]}
                                                </div>
                                            ))}
                                            {project.members.length > 3 && (
                                                <div className="w-7 h-7 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs text-gray-600">
                                                    +{project.members.length - 3}
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-500 ml-2">PM: {project.pm}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {project.endDate}
                                        </span>
                                    </div>
                                </div>

                                {/* 风险提示 */}
                                {project.risk === 'high' && (
                                    <div className="mt-3 flex items-center gap-1 text-xs text-orange-600 bg-orange-50 rounded-lg px-2 py-1">
                                        <AlertCircle className="w-3.5 h-3.5" />
                                        存在延期风险
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
