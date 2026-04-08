// src/pages/project/ProjectDetailPage.js
// 项目管理 - 项目详情页
import React, { useState } from 'react';
import {
    ArrowLeft,
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
    Flag
} from 'lucide-react';

const cn = (...args) => args.filter(Boolean).join(' ');

// --------------- 阶段配置 ---------------
const stages = [
    { code: '01', name: '需求调研', weight: 10 },
    { code: '02', name: '立项初评', weight: 10, skippable: true, stoppable: true },
    { code: '03', name: '产品初评', weight: 15, stoppable: true },
    { code: '04', name: '打样测试', weight: 20, stoppable: true },
    { code: '05', name: '产品终评', weight: 15, skippable: true },
    { code: '06', name: '首单开售', weight: 10 },
    { code: '07', name: '上市复盘', weight: 10 },
];

// --------------- Mock 项目数据 ---------------
const mockProject = {
    id: 'PM202403001',
    name: '智能保温杯-美',
    dept: '美国事业部',
    brand: 'HomePlus',
    creator: '张三',
    pm: '李四',
    createTime: '2024-03-01',
    currentStage: '04',
    status: 'ongoing',
    description: '针对美国市场开发的智能保温杯，具有温度显示、APP连接等功能',
};

// --------------- Mock 子任务 ---------------
const mockTasks = [
    {
        id: 1,
        name: '样品确认',
        assignee: '张三',
        deadline: '2025-03-30',
        progress: 70,
        status: 'ongoing',
        update: '已收到供应商样品，正在进行功能和外观测试，预计3月28日完成',
    },
    {
        id: 2,
        name: '测试报告',
        assignee: '李四',
        deadline: '2025-04-05',
        progress: 30,
        status: 'ongoing',
        update: '测试方案已制定，等待样品确认后开始正式测试',
    },
    {
        id: 3,
        name: '成本核算',
        assignee: '王五',
        deadline: '2025-04-02',
        progress: 0,
        status: 'pending',
        update: '',
    },
];

// --------------- Mock 会议记录 ---------------
const mockMeetings = [
    {
        id: 1,
        type: '立项初评会',
        time: '2024-03-10 14:00',
        attendees: '张三, 李四, 王五',
        decision: '通过',
        decisionBasis: '利润达标, 市场前景良好',
        minutes: '会议决议：项目立项通过，进入打样阶段。',
    },
    {
        id: 2,
        type: '周会',
        time: '2024-03-20 10:00',
        attendees: '张三, 李四',
        decision: '无决策',
        minutes: '汇报当前进度，样品预计下周到位。',
    },
];

// --------------- Mock SKU ---------------
const mockSkus = [
    { id: 1, code: 'SKU-US-001', name: '智能保温杯-黑色-500ml', market: '美国', lockedCost: 45.00 },
    { id: 2, code: 'SKU-US-002', name: '智能保温杯-白色-500ml', market: '美国', lockedCost: 45.00 },
    { id: 3, code: 'SKU-US-003', name: '智能保温杯-蓝色-350ml', market: '美国', lockedCost: 42.00 },
];

// --------------- Mock 样品 ---------------
const mockSamples = [
    { id: 1, type: '特殊样', description: '首版手板样-黑色', location: '样品室A-03', status: '借出', borrower: '张三', borrowTime: '2024-03-15' },
    { id: 2, type: '特殊样', description: '首版手板样-白色', location: '样品室A-04', status: '在库', borrower: '', borrowTime: '' },
];

// --------------- Tab 组件 ---------------
const TabButton = ({ active, onClick, icon: Icon, count, children }) => (
    <button
        onClick={onClick}
        className={cn(
            'flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
            active
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-text-subtle hover:text-text'
        )}
    >
        {Icon && <Icon className="w-4 h-4" />}
        {children}
        {count != null && (
            <span className={cn(
                'ml-1 rounded-full px-1.5 py-0.5 text-xs',
                active ? 'bg-brand-50 text-brand-600' : 'bg-surface-subtle text-text-subtle'
            )}>
                {count}
            </span>
        )}
    </button>
);

export default function ProjectDetailPage({ record, onClose }) {
    const [activeTab, setActiveTab] = useState('overview');
    const project = record || mockProject;

    const currentStageIndex = stages.findIndex(s => s.code === project.currentStage);

    const getStageStatus = (stageCode, index) => {
        if (index < currentStageIndex) return 'completed';
        if (stageCode === project.currentStage) return 'ongoing';
        return 'pending';
    };

    const handlePrevStage = () => {
        // 预留：阶段回退
    };

    const handleNextStage = () => {
        // 预留：推进到下一阶段
    };

    return (
        <div className="h-full flex flex-col bg-surface-muted">
            {/* 顶部导航 */}
            <div className="bg-surface border-b border-border px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-surface-subtle rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-text-muted" />
                        </button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-xl font-bold text-text">{project.name}</h1>
                                <span className="px-2 py-0.5 bg-surface-subtle text-text-muted text-xs rounded border border-border">
                                    {project.id}
                                </span>
                            </div>
                            <p className="text-sm text-text-subtle mt-1">
                                {project.dept} · {project.brand} · PM: {project.pm}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-sm hover:bg-surface-subtle transition-colors">
                            <Edit2 className="w-4 h-4" />
                            编辑
                        </button>
                        <button
                            onClick={handleNextStage}
                            className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors"
                        >
                            <Play className="w-4 h-4" />
                            推进阶段
                        </button>
                    </div>
                </div>
            </div>

            {/* 流程图 */}
            <div className="bg-surface-subtle border-b border-border px-6 py-6 overflow-x-auto">
                <div className="flex items-center justify-between min-w-[600px]">
                    {stages.map((stage, index) => {
                        const status = getStageStatus(stage.code, index);
                        const isLast = index === stages.length - 1;
                        
                        return (
                            <React.Fragment key={stage.code}>
                                <div className="flex flex-col items-center">
                                    <div className={cn(
                                        'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors',
                                        status === 'completed' && 'bg-green-500 border-green-500 text-white',
                                        status === 'ongoing' && 'bg-brand-600 border-brand-600 text-white ring-4 ring-brand-100',
                                        status === 'pending' && 'bg-surface border-border-strong text-text-subtle'
                                    )}>
                                        {status === 'completed' ? (
                                            <CheckCircle2 className="w-5 h-5" />
                                        ) : status === 'ongoing' ? (
                                            <Play className="w-5 h-5" />
                                        ) : (
                                            <Circle className="w-5 h-5" />
                                        )}
                                    </div>
                                    <span className={cn(
                                        'mt-2 text-xs font-medium',
                                        status === 'ongoing' ? 'text-brand-600' : 'text-text-muted'
                                    )}>
                                        {stage.name}
                                    </span>
                                    {status === 'ongoing' && (
                                        <span className="text-xs text-text-subtle mt-0.5">进行中</span>
                                    )}
                                    {stage.skippable && status !== 'completed' && (
                                        <span className="text-[10px] text-text-subtle mt-0.5">可跳过</span>
                                    )}
                                </div>
                                {!isLast && (
                                    <div className={cn(
                                        'flex-1 h-0.5 mx-2',
                                        status === 'completed' ? 'bg-green-500' : 'bg-border'
                                    )} />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>

            {/* 子任务面板 */}
            <div className="bg-surface border-b border-border px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-text">
                            {stages[currentStageIndex]?.name}阶段
                        </h3>
                        <span className="text-sm text-text-subtle">
                            {mockTasks.filter(t => t.status === 'completed').length}/{mockTasks.length} 任务完成
                        </span>
                    </div>
                    <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-brand-600 hover:bg-brand-50 rounded-lg transition-colors">
                        <Plus className="w-4 h-4" />
                        添加子任务
                    </button>
                </div>

                <div className="space-y-3">
                    {mockTasks.map(task => (
                        <div key={task.id} className="border border-border rounded-xl p-4 hover:border-border-strong transition-colors">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className={cn(
                                            'w-2 h-2 rounded-full',
                                            task.status === 'completed' ? 'bg-green-500' :
                                            task.status === 'ongoing' ? 'bg-brand-600' : 'bg-border-strong'
                                        )} />
                                        <span className="font-medium text-text">{task.name}</span>
                                        {task.status === 'ongoing' && (
                                            <span className="px-2 py-0.5 bg-brand-50 text-brand-600 text-xs rounded">进行中</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-text-subtle">
                                        <span className="flex items-center gap-1">
                                            <User className="w-3.5 h-3.5" />
                                            {task.assignee}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5" />
                                            截止: {task.deadline}
                                        </span>
                                    </div>
                                    {task.update && (
                                        <p className="mt-2 text-sm text-text-muted bg-surface-subtle rounded-lg px-3 py-2">
                                            最新进展: {task.update}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center gap-4 pl-4 border-l border-border">
                                    <div className="text-right">
                                        <span className="text-sm font-medium text-text">{task.progress}%</span>
                                        <div className="w-24 h-2 bg-border rounded-full mt-1 overflow-hidden">
                                            <div
                                                className={cn(
                                                    'h-full rounded-full',
                                                    task.progress === 100 ? 'bg-green-500' : 'bg-brand-600'
                                                )}
                                                style={{ width: `${task.progress}%` }}
                                            />
                                        </div>
                                    </div>
                                    <button className="p-1.5 hover:bg-surface-subtle rounded-lg">
                                        <MoreHorizontal className="w-4 h-4 text-text-subtle" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-border-subtle">
                    <button
                        onClick={handlePrevStage}
                        className="px-4 py-2 text-sm text-text-muted hover:text-text hover:bg-surface-subtle rounded-xl transition-colors"
                    >
                        ← 回退阶段
                    </button>
                    <button
                        onClick={handleNextStage}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white text-sm rounded-xl hover:bg-brand-700 transition-colors"
                    >
                        推进到下一阶段
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Tab 切换 */}
            <div className="bg-surface border-b border-border px-6">
                <div className="flex gap-6">
                    <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={FileText}>
                        项目概览
                    </TabButton>
                    <TabButton active={activeTab === 'meetings'} onClick={() => setActiveTab('meetings')} icon={Calendar} count={mockMeetings.length}>
                        会议记录
                    </TabButton>
                    <TabButton active={activeTab === 'skus'} onClick={() => setActiveTab('skus')} icon={Package} count={mockSkus.length}>
                        SKU列表
                    </TabButton>
                    <TabButton active={activeTab === 'samples'} onClick={() => setActiveTab('samples')} icon={Box} count={mockSamples.length}>
                        样品管理
                    </TabButton>
                </div>
            </div>

            {/* Tab 内容 */}
            <div className="flex-1 overflow-auto p-6">
                {activeTab === 'overview' && (
                    <div className="bg-surface rounded-xl border border-border p-6 space-y-5">
                        <h3 className="font-semibold text-text">项目信息</h3>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                            <div>
                                <p className="text-xs text-text-subtle mb-1">项目编号</p>
                                <p className="text-sm font-medium text-text">{project.id}</p>
                            </div>
                            <div>
                                <p className="text-xs text-text-subtle mb-1">所属部门</p>
                                <p className="text-sm font-medium text-text">{project.dept}</p>
                            </div>
                            <div>
                                <p className="text-xs text-text-subtle mb-1">品牌</p>
                                <p className="text-sm font-medium text-text">{project.brand}</p>
                            </div>
                            <div>
                                <p className="text-xs text-text-subtle mb-1">项目经理</p>
                                <p className="text-sm font-medium text-text">{project.pm}</p>
                            </div>
                            <div>
                                <p className="text-xs text-text-subtle mb-1">创建人</p>
                                <p className="text-sm font-medium text-text">{project.creator}</p>
                            </div>
                            <div>
                                <p className="text-xs text-text-subtle mb-1">创建时间</p>
                                <p className="text-sm font-medium text-text">{project.createTime}</p>
                            </div>
                            <div>
                                <p className="text-xs text-text-subtle mb-1">当前阶段</p>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-brand-50 text-brand-600 text-xs rounded font-medium">
                                    <Play className="w-3 h-3" />
                                    {stages[currentStageIndex]?.name}
                                </span>
                            </div>
                            <div>
                                <p className="text-xs text-text-subtle mb-1">项目状态</p>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded font-medium">
                                    进行中
                                </span>
                            </div>
                        </div>
                        {project.description && (
                            <div className="pt-4 border-t border-border-subtle">
                                <p className="text-xs text-text-subtle mb-1">项目描述</p>
                                <p className="text-sm text-text-muted leading-relaxed">{project.description}</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'meetings' && (
                    <div className="space-y-4">
                        {mockMeetings.map(meeting => (
                            <div key={meeting.id} className="bg-surface border border-border rounded-xl p-5">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-0.5 bg-brand-50 text-brand-600 text-xs rounded border border-brand-100">
                                                {meeting.type}
                                            </span>
                                            <span className={cn(
                                                'px-2 py-0.5 text-xs rounded border',
                                                meeting.decision === '通过' ? 'bg-green-50 text-green-600 border-green-100' :
                                                meeting.decision === '驳回' ? 'bg-red-50 text-red-600 border-red-100' :
                                                'bg-surface-subtle text-text-muted border-border'
                                            )}>
                                                决策: {meeting.decision}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-sm text-text-muted">{meeting.minutes}</p>
                                        <div className="flex items-center gap-4 mt-3 text-xs text-text-subtle">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3.5 h-3.5" />
                                                {meeting.time}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <User className="w-3.5 h-3.5" />
                                                参会: {meeting.attendees}
                                            </span>
                                        </div>
                                        {meeting.decisionBasis && (
                                            <p className="mt-2 text-xs text-text-subtle">
                                                决策依据: {meeting.decisionBasis}
                                            </p>
                                        )}
                                    </div>
                                    <button className="p-1.5 hover:bg-surface-subtle rounded-lg">
                                        <MoreHorizontal className="w-4 h-4 text-text-subtle" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'skus' && (
                    <div className="bg-surface rounded-xl border border-border overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-surface-subtle">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-text-subtle">SKU编码</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-text-subtle">产品名称</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-text-subtle">目标市场</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-text-subtle">锁定成本</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-subtle">
                                {mockSkus.map(sku => (
                                    <tr key={sku.id} className="hover:bg-surface-muted">
                                        <td className="px-4 py-3 text-sm font-mono text-text-muted">{sku.code}</td>
                                        <td className="px-4 py-3 text-sm font-medium text-text">{sku.name}</td>
                                        <td className="px-4 py-3 text-sm text-text-muted">{sku.market}</td>
                                        <td className="px-4 py-3 text-sm font-medium text-text">
                                            ¥{sku.lockedCost.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'samples' && (
                    <div className="space-y-4">
                        {mockSamples.map(sample => (
                            <div key={sample.id} className="bg-surface border border-border rounded-xl p-5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            'w-10 h-10 rounded-lg flex items-center justify-center',
                                            sample.status === '在库' ? 'bg-green-100' : 'bg-amber-100'
                                        )}>
                                            <Box className={cn(
                                                'w-5 h-5',
                                                sample.status === '在库' ? 'text-green-600' : 'text-amber-600'
                                            )} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-text">{sample.description}</span>
                                                <span className="px-2 py-0.5 bg-surface-subtle text-text-muted text-xs rounded">
                                                    {sample.type}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 mt-1 text-sm text-text-subtle">
                                                <span>存放: {sample.location}</span>
                                                <span className={cn(
                                                    'px-2 py-0.5 rounded text-xs',
                                                    sample.status === '在库' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                                                )}>
                                                    {sample.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {sample.status === '借出' && (
                                        <div className="text-right text-sm">
                                            <p className="text-text-muted">借用人: {sample.borrower}</p>
                                            <p className="text-text-subtle text-xs mt-1">借用时间: {sample.borrowTime}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
