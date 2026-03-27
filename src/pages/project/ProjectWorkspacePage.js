// src/pages/project/ProjectWorkspacePage.js
// 项目管理 - 项目工作台（含并行流程图）
import React, { useState } from 'react';
import {
    ArrowLeft,
    ArrowRight,
    Edit2,
    Play,
    CheckCircle2,
    Circle,
    ChevronRight,
    Plus,
    MoreHorizontal,
    Calendar,
    User,
    FileText,
    Package,
    Box,
    Clock,
    AlertCircle,
    GitBranch,
    ArrowRightLeft,
    Users,
    MessageSquare,
    Paperclip
} from 'lucide-react';

const cn = (...args) => args.filter(Boolean).join(' ');

// 流程节点配置（含分叉）
const workflowNodes = [
    { id: '01', name: '需求调研', type: 'serial', next: ['02'] },
    { id: '02', name: '立项初评', type: 'serial', next: ['03'], skippable: true },
    { id: '03', name: '产品初评', type: 'serial', next: ['04'] },
    { id: '04', name: '打样测试', type: 'serial', next: ['05'] },
    { id: '05', name: '产品终评', type: 'fork', next: ['06a', '06b'], skippable: true },
    { id: '06a', name: '供应链执行', type: 'parallel', next: ['07'], branch: 'supply' },
    { id: '06b', name: '素材制作', type: 'parallel', next: ['07'], branch: 'material' },
    { id: '07', name: '首单开售', type: 'serial', next: ['08'] },
    { id: '08', name: '上市复盘', type: 'serial', next: [] },
];

// Mock 项目数据
const mockProject = {
    id: 'PM202403001',
    name: '智能保温杯-美',
    dept: '美国事业部',
    brand: 'HomePlus',
    creator: '张三',
    pm: '李四',
    createTime: '2024-03-01',
    currentStage: '05',
    status: 'ongoing',
    description: '针对美国市场开发的智能保温杯，具有温度显示、APP连接等功能',
    members: [
        { name: '张三', role: '产品经理', avatar: '张' },
        { name: '李四', role: '项目经理', avatar: '李' },
        { name: '王五', role: '设计师', avatar: '王' },
        { name: '赵六', role: '供应链', avatar: '赵' },
    ],
};

// 并行任务数据
const parallelTasks = {
    supply: [
        { id: 1, name: '采购订单确认', assignee: '赵六', progress: 80, status: 'ongoing' },
        { id: 2, name: '供应商排产', assignee: '钱七', progress: 60, status: 'ongoing' },
        { id: 3, name: '入国内仓', assignee: '孙八', progress: 0, status: 'pending' },
    ],
    material: [
        { id: 4, name: '文案策划', assignee: '张三', progress: 100, status: 'completed' },
        { id: 5, name: '产品拍摄', assignee: '王五', progress: 70, status: 'ongoing' },
        { id: 6, name: '详情页设计', assignee: '李四', progress: 30, status: 'ongoing' },
    ],
};

export default function ProjectWorkspacePage({ record, onClose }) {
    const [activeBranch, setActiveBranch] = useState('supply'); // 'supply' | 'material'
    const project = record || mockProject;

    const currentNode = workflowNodes.find(n => n.id === project.currentStage);

    const getNodeStatus = (nodeId) => {
        const nodeIndex = workflowNodes.findIndex(n => n.id === nodeId);
        const currentIndex = workflowNodes.findIndex(n => n.id === project.currentStage);
        
        if (nodeIndex < currentIndex) return 'completed';
        if (nodeId === project.currentStage) return 'ongoing';
        return 'pending';
    };

    return (
        <div className="h-full flex flex-col bg-gray-50">
            {/* 顶部导航 */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-xl font-bold text-gray-900">{project.name}</h1>
                                <span className="px-2 py-0.5 bg-pink-100 text-pink-700 text-xs rounded border border-pink-200">
                                    产品终评
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                                {project.id} · {project.dept} · {project.brand}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* 成员头像 */}
                        <div className="flex -space-x-2 mr-4">
                            {project.members.map((member, idx) => (
                                <div
                                    key={idx}
                                    title={`${member.name} (${member.role})`}
                                    className="w-8 h-8 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-xs font-medium text-indigo-600 cursor-pointer hover:z-10"
                                >
                                    {member.avatar}
                                </div>
                            ))}
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
                            <Users className="w-4 h-4" />
                            成员
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                            <Edit2 className="w-4 h-4" />
                            编辑
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-6">
                <div className="max-w-6xl mx-auto">
                    {/* 并行流程图 */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-6">项目流程</h3>
                        
                        {/* 串行节点 - 上半部分 */}
                        <div className="flex items-center justify-center gap-4 mb-8">
                            {workflowNodes.slice(0, 4).map((node, index) => {
                                const status = getNodeStatus(node.id);
                                return (
                                    <React.Fragment key={node.id}>
                                        <div className="flex flex-col items-center">
                                            <div className={cn(
                                                'w-24 h-14 rounded-lg flex items-center justify-center text-sm font-medium border-2 transition-all',
                                                status === 'completed' && 'bg-green-50 border-green-500 text-green-700',
                                                status === 'ongoing' && 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-4 ring-indigo-100',
                                                status === 'pending' && 'bg-white border-gray-200 text-gray-400'
                                            )}>
                                                {status === 'completed' ? (
                                                    <CheckCircle2 className="w-4 h-4 mr-1" />
                                                ) : status === 'ongoing' ? (
                                                    <Play className="w-4 h-4 mr-1" />
                                                ) : null}
                                                {node.name}
                                            </div>
                                            {node.skippable && status !== 'completed' && (
                                                <span className="text-[10px] text-gray-400 mt-1">可跳过</span>
                                            )}
                                        </div>
                                        {index < 3 && (
                                            <ArrowRight className="w-5 h-5 text-gray-300" />
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>

                        {/* 分叉点 */}
                        <div className="flex justify-center mb-6">
                            <div className="flex flex-col items-center">
                                <div className={cn(
                                    'w-28 h-14 rounded-lg flex items-center justify-center text-sm font-medium border-2',
                                    'bg-pink-50 border-pink-500 text-pink-700 ring-4 ring-pink-100'
                                )}>
                                    <GitBranch className="w-4 h-4 mr-1" />
                                    产品终评
                                </div>
                                <span className="text-xs text-pink-600 mt-1 font-medium">当前阶段</span>
                            </div>
                        </div>

                        {/* 分叉线 */}
                        <div className="flex justify-center mb-6">
                            <div className="relative w-96 h-8">
                                <div className="absolute left-1/2 top-0 w-0.5 h-4 bg-gray-300 -translate-x-1/2" />
                                <div className="absolute left-1/4 top-4 w-1/2 h-0.5 bg-gray-300" />
                                <div className="absolute left-1/4 top-4 w-0.5 h-4 bg-gray-300" />
                                <div className="absolute right-1/4 top-4 w-0.5 h-4 bg-gray-300" />
                            </div>
                        </div>

                        {/* 并行分支 */}
                        <div className="grid grid-cols-2 gap-8">
                            {/* 供应链线 */}
                            <div 
                                onClick={() => setActiveBranch('supply')}
                                className={cn(
                                    'border-2 rounded-xl p-4 cursor-pointer transition-all',
                                    activeBranch === 'supply' 
                                        ? 'border-indigo-500 bg-indigo-50' 
                                        : 'border-gray-200 hover:border-gray-300'
                                )}
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <Package className="w-5 h-5 text-indigo-600" />
                                    <h4 className="font-semibold text-gray-900">供应链线</h4>
                                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-600 text-xs rounded">
                                        3个任务
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        采购订单确认 (80%)
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Clock className="w-4 h-4 text-indigo-500" />
                                        供应商排产 (60%)
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <Circle className="w-4 h-4" />
                                        入国内仓 (待开始)
                                    </div>
                                </div>
                            </div>

                            {/* 素材线 */}
                            <div 
                                onClick={() => setActiveBranch('material')}
                                className={cn(
                                    'border-2 rounded-xl p-4 cursor-pointer transition-all',
                                    activeBranch === 'material' 
                                        ? 'border-amber-500 bg-amber-50' 
                                        : 'border-gray-200 hover:border-gray-300'
                                )}
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <FileText className="w-5 h-5 text-amber-600" />
                                    <h4 className="font-semibold text-gray-900">素材线</h4>
                                    <span className="px-2 py-0.5 bg-amber-100 text-amber-600 text-xs rounded">
                                        3个任务
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        文案策划 (100%)
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Clock className="w-4 h-4 text-amber-500" />
                                        产品拍摄 (70%)
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <Circle className="w-4 h-4" />
                                        详情页设计 (30%)
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 汇合线 */}
                        <div className="flex justify-center mt-6">
                            <div className="relative w-96 h-8">
                                <div className="absolute left-1/4 bottom-0 w-0.5 h-4 bg-gray-300" />
                                <div className="absolute right-1/4 bottom-0 w-0.5 h-4 bg-gray-300" />
                                <div className="absolute left-1/4 bottom-4 w-1/2 h-0.5 bg-gray-300" />
                                <div className="absolute left-1/2 bottom-4 w-0.5 h-4 bg-gray-300 -translate-x-1/2" />
                            </div>
                        </div>

                        {/* 汇合后节点 */}
                        <div className="flex justify-center gap-8">
                            <div className="flex flex-col items-center">
                                <div className="w-24 h-14 rounded-lg bg-white border-2 border-gray-200 text-gray-400 flex items-center justify-center text-sm">
                                    首单开售
                                </div>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-24 h-14 rounded-lg bg-white border-2 border-gray-200 text-gray-400 flex items-center justify-center text-sm">
                                    上市复盘
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 当前选中分支的任务详情 */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {activeBranch === 'supply' ? '供应链执行任务' : '素材制作任务'}
                            </h3>
                            <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg">
                                <Plus className="w-4 h-4" />
                                添加任务
                            </button>
                        </div>

                        <div className="space-y-3">
                            {parallelTasks[activeBranch].map((task) => (
                                <div key={task.id} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                'w-2 h-2 rounded-full',
                                                task.status === 'completed' ? 'bg-green-500' :
                                                task.status === 'ongoing' ? 'bg-indigo-500' : 'bg-gray-300'
                                            )} />
                                            <span className="font-medium text-gray-900">{task.name}</span>
                                            {task.status === 'ongoing' && (
                                                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs rounded">进行中</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm text-gray-500">负责人: {task.assignee}</span>
                                            <div className="w-32">
                                                <div className="flex items-center justify-between text-xs mb-1">
                                                    <span className="text-gray-500">进度</span>
                                                    <span className="font-medium">{task.progress}%</span>
                                                </div>
                                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={cn(
                                                            'h-full rounded-full',
                                                            task.progress === 100 ? 'bg-green-500' : 'bg-indigo-500'
                                                        )}
                                                        style={{ width: `${task.progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
