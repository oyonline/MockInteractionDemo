// src/pages/project/ProjectListPage.js
// 项目管理 - 项目列表页
import React, { useState, useMemo } from 'react';
import {
    Search,
    Filter,
    Plus,
    ChevronRight,
    Calendar,
    User,
    Package,
    MoreHorizontal,
    ArrowRight,
    CheckCircle2,
    XCircle,
    Clock,
    AlertCircle,
    Play,
    Pause,
    Flag
} from 'lucide-react';

const cn = (...args) => args.filter(Boolean).join(' ');

// --------------- 阶段配置 ---------------
const stageConfig = {
    '01': { name: '需求调研', color: 'bg-blue-500', lightColor: 'bg-blue-50', textColor: 'text-blue-700' },
    '02': { name: '立项初评', color: 'bg-indigo-500', lightColor: 'bg-indigo-50', textColor: 'text-indigo-700' },
    '03': { name: '产品初评', color: 'bg-purple-500', lightColor: 'bg-purple-50', textColor: 'text-purple-700' },
    '04': { name: '打样测试', color: 'bg-amber-500', lightColor: 'bg-amber-50', textColor: 'text-amber-700' },
    '05': { name: '产品终评', color: 'bg-pink-500', lightColor: 'bg-pink-50', textColor: 'text-pink-700' },
    '06': { name: '首单开售', color: 'bg-emerald-500', lightColor: 'bg-emerald-50', textColor: 'text-emerald-700' },
    '07': { name: '上市复盘', color: 'bg-cyan-500', lightColor: 'bg-cyan-50', textColor: 'text-cyan-700' },
};

// --------------- 状态配置 ---------------
const statusConfig = {
    'ongoing': { label: '进行中', color: 'bg-green-100 text-green-700 border-green-200', icon: Play },
    'paused': { label: '已暂停', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Pause },
    'cancelled': { label: '已取消', color: 'bg-gray-100 text-gray-700 border-gray-200', icon: XCircle },
    'completed': { label: '已完成', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: CheckCircle2 },
    'rejected': { label: '已驳回', color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
    'stopped': { label: '已叫停', color: 'bg-orange-100 text-orange-700 border-orange-200', icon: Flag },
};

// --------------- Mock 项目数据 ---------------
const mockProjects = [
    {
        id: 'PM202403001',
        name: '智能保温杯-美',
        stage: '04',
        status: 'ongoing',
        dept: '美国事业部',
        brand: 'HomePlus',
        creator: '张三',
        pm: '李四',
        createTime: '2024-03-01',
        skuCount: 3,
        progress: 45,
    },
    {
        id: 'PM202403002',
        name: '便携榨汁机-东南亚',
        stage: '02',
        status: 'ongoing',
        dept: '东南亚事业部',
        brand: 'KitchenPro',
        creator: '王五',
        pm: '赵六',
        createTime: '2024-03-05',
        skuCount: 2,
        progress: 25,
    },
    {
        id: 'PM202402015',
        name: '无线充电器-欧洲',
        stage: '06',
        status: 'ongoing',
        dept: '欧洲事业部',
        brand: 'TechLife',
        creator: '孙七',
        pm: '周八',
        createTime: '2024-02-20',
        skuCount: 5,
        progress: 75,
    },
    {
        id: 'PM202402018',
        name: '折叠收纳箱-国内',
        stage: '04',
        status: 'ongoing',
        dept: '中国事业部',
        brand: 'HomePlus',
        creator: '吴九',
        pm: '郑十',
        createTime: '2024-02-25',
        skuCount: 4,
        progress: 60,
    },
    {
        id: 'PM202403008',
        name: '智能门锁-美',
        stage: '01',
        status: 'ongoing',
        dept: '美国事业部',
        brand: 'SecureHome',
        creator: '钱十一',
        pm: '李十二',
        createTime: '2024-03-10',
        skuCount: 1,
        progress: 15,
    },
    {
        id: 'PM202403012',
        name: '空气炸锅-东南亚',
        stage: '07',
        status: 'completed',
        dept: '东南亚事业部',
        brand: 'KitchenPro',
        creator: '王十三',
        pm: '张十四',
        createTime: '2024-03-15',
        skuCount: 2,
        progress: 100,
    },
    {
        id: 'PM202401005',
        name: '电动牙刷-欧洲',
        stage: '07',
        status: 'completed',
        dept: '欧洲事业部',
        brand: 'HealthCare',
        creator: '赵十五',
        pm: '孙十六',
        createTime: '2024-01-20',
        skuCount: 3,
        progress: 100,
    },
    {
        id: 'PM202403020',
        name: '蓝牙音箱-美',
        stage: '03',
        status: 'stopped',
        dept: '美国事业部',
        brand: 'SoundMax',
        creator: '周十七',
        pm: '吴十八',
        createTime: '2024-03-18',
        skuCount: 2,
        progress: 35,
    },
    {
        id: 'PM202402028',
        name: '护眼台灯-国内',
        stage: '04',
        status: 'stopped',
        dept: '中国事业部',
        brand: 'LightPro',
        creator: '郑十九',
        pm: '钱二十',
        createTime: '2024-02-28',
        skuCount: 3,
        progress: 55,
    },
    {
        id: 'PM202403025',
        name: '扫地机器人-美',
        stage: '02',
        status: 'rejected',
        dept: '美国事业部',
        brand: 'CleanBot',
        creator: '李二十一',
        pm: '王二十二',
        createTime: '2024-03-22',
        skuCount: 1,
        progress: 20,
    },
    {
        id: 'PM202403030',
        name: '智能手表-欧洲',
        stage: '02',
        status: 'rejected',
        dept: '欧洲事业部',
        brand: 'TechLife',
        creator: '张二十三',
        pm: '赵二十四',
        createTime: '2024-03-25',
        skuCount: 4,
        progress: 18,
    },
    {
        id: 'PM202402035',
        name: '加湿器-东南亚',
        stage: '05',
        status: 'ongoing',
        dept: '东南亚事业部',
        brand: 'HomePlus',
        creator: '孙二十五',
        pm: '周二十六',
        createTime: '2024-02-15',
        skuCount: 2,
        progress: 68,
    },
];

// --------------- 筛选选项 ---------------
const stageOptions = [
    { value: '', label: '全部阶段' },
    { value: '01', label: '需求调研' },
    { value: '02', label: '立项初评' },
    { value: '03', label: '产品初评' },
    { value: '04', label: '打样测试' },
    { value: '05', label: '产品终评' },
    { value: '06', label: '首单开售' },
    { value: '07', label: '上市复盘' },
];

const statusOptions = [
    { value: '', label: '全部状态' },
    { value: 'ongoing', label: '进行中' },
    { value: 'paused', label: '已暂停' },
    { value: 'completed', label: '已完成' },
    { value: 'stopped', label: '已叫停' },
    { value: 'rejected', label: '已驳回' },
];

const deptOptions = [
    { value: '', label: '全部事业部' },
    { value: '美国事业部', label: '美国事业部' },
    { value: '中国事业部', label: '中国事业部' },
    { value: '东南亚事业部', label: '东南亚事业部' },
    { value: '欧洲事业部', label: '欧洲事业部' },
];

export default function ProjectListPage({ onNavigate, onOpenDetail }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStage, setFilterStage] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterDept, setFilterDept] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    // 筛选逻辑
    const filteredData = useMemo(() => {
        return mockProjects.filter(item => {
            if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
                !item.id.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }
            if (filterStage && item.stage !== filterStage) return false;
            if (filterStatus && item.status !== filterStatus) return false;
            if (filterDept && item.dept !== filterDept) return false;
            return true;
        });
    }, [searchQuery, filterStage, filterStatus, filterDept]);

    // 分页
    const totalPages = Math.ceil(filteredData.length / pageSize);
    const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const handleViewDetail = (project) => {
        if (onOpenDetail) {
            onOpenDetail(project);
        }
    };

    const handleCreate = () => {
        if (onNavigate) {
            onNavigate('/project/create', '新建项目');
        }
    };

    return (
        <div className="h-full flex flex-col bg-gray-50">
            {/* 页面标题 */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">新品开发项目</h1>
                        <p className="text-sm text-gray-500 mt-1">管理从需求调研到上市复盘的全生命周期</p>
                    </div>
                    <button
                        onClick={handleCreate}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        新建项目
                    </button>
                </div>
            </div>

            {/* 筛选栏 */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="搜索项目编号或名称..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <select
                        value={filterStage}
                        onChange={(e) => setFilterStage(e.target.value)}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        {stageOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                    <select
                        value={filterDept}
                        onChange={(e) => setFilterDept(e.target.value)}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        {deptOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                    <button
                        onClick={() => {
                            setSearchQuery('');
                            setFilterStage('');
                            setFilterStatus('');
                            setFilterDept('');
                        }}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        重置
                    </button>
                </div>
            </div>

            {/* 表格 */}
            <div className="flex-1 overflow-auto p-6">
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">项目编号</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">项目名称</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">当前阶段</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">状态</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">事业部</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">发起人</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">创建时间</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">SKU数</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {paginatedData.map(project => {
                                const stageInfo = stageConfig[project.stage];
                                const statusInfo = statusConfig[project.status];
                                const StatusIcon = statusInfo.icon;
                                return (
                                    <tr key={project.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm font-mono text-gray-600">{project.id}</td>
                                        <td className="px-4 py-3">
                                            <div className="text-sm font-medium text-gray-900">{project.name}</div>
                                            <div className="text-xs text-gray-500">{project.brand}</div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={cn(
                                                'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border',
                                                stageInfo.lightColor,
                                                stageInfo.textColor,
                                                'border-current'
                                            )}>
                                                {stageInfo.name}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={cn(
                                                'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border',
                                                statusInfo.color
                                            )}>
                                                <StatusIcon className="w-3 h-3" />
                                                {statusInfo.label}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{project.dept}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{project.creator}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500">{project.createTime}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            <span className="inline-flex items-center gap-1">
                                                <Package className="w-3.5 h-3.5 text-gray-400" />
                                                {project.skuCount}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => handleViewDetail(project)}
                                                className="flex items-center gap-1 px-3 py-1.5 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                            >
                                                查看
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {/* 分页 */}
                    <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                            共 {filteredData.length} 个项目
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                上一页
                            </button>
                            <span className="text-sm text-gray-700">
                                第 {currentPage} / {totalPages} 页
                            </span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                下一页
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
