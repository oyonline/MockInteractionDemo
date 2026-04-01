// src/pages/SupplierPerformanceListPage.js
// 供应商绩效列表页面
import React, { useState } from 'react';
import {
    Search, Plus, Edit2, Eye, Download, Filter,
    Award, TrendingUp, TrendingDown, Minus,
    Building2, Calendar, Star, ChevronRight,
    CheckCircle, Clock, AlertCircle
} from 'lucide-react';

const cn = (...args) => args.filter(Boolean).join(' ');

// --------------- 供应商绩效Mock数据 ---------------
const initialPerformanceList = [
    { id: '1', supplierId: 'SUP001', supplierName: '深圳市鑫源电子有限公司', category: '电子元器件', cooperationYear: 3, type: '战略供应商', period: '2024-Q1', score: 92.5, grade: 'A', status: 'confirmed', evaluator: '张三', evaluationDate: '2024-04-15', trend: 'up', trendValue: 3.5 },
    { id: '2', supplierId: 'SUP002', supplierName: '东莞华通五金制品厂', category: '五金件', cooperationYear: 5, type: '常规供应商', period: '2024-Q1', score: 85.0, grade: 'B', status: 'confirmed', evaluator: '李四', evaluationDate: '2024-04-14', trend: 'down', trendValue: 2.0 },
    { id: '3', supplierId: 'SUP003', supplierName: '苏州美达包装材料有限公司', category: '包装材料', cooperationYear: 2, type: '常规供应商', period: '2024-Q1', score: 78.5, grade: 'C', status: 'confirmed', evaluator: '王五', evaluationDate: '2024-04-13', trend: 'up', trendValue: 5.5 },
    { id: '4', supplierId: 'SUP004', supplierName: '上海精密模具制造有限公司', category: '模具', cooperationYear: 4, type: '战略供应商', period: '2024-Q1', score: 88.0, grade: 'B', status: 'pending', evaluator: '张三', evaluationDate: '2024-04-12', trend: 'flat', trendValue: 0 },
    { id: '5', supplierId: 'SUP005', supplierName: '广州塑胶科技有限公司', category: '塑胶件', cooperationYear: 1, type: '临时供应商', period: null, score: null, grade: null, status: 'none', evaluator: null, evaluationDate: null, trend: null, trendValue: null },
    { id: '6', supplierId: 'SUP001', supplierName: '深圳市鑫源电子有限公司', category: '电子元器件', cooperationYear: 3, type: '战略供应商', period: '2023-Q4', score: 89.0, grade: 'B', status: 'confirmed', evaluator: '张三', evaluationDate: '2024-01-15', trend: 'up', trendValue: 4.0 },
    { id: '7', supplierId: 'SUP002', supplierName: '东莞华通五金制品厂', category: '五金件', cooperationYear: 5, type: '常规供应商', period: '2023-Q4', score: 87.0, grade: 'B', status: 'confirmed', evaluator: '李四', evaluationDate: '2024-01-14', trend: 'up', trendValue: 2.5 },
];

// --------------- UI组件 ---------------
const Card = ({ children, className }) => (
    <div className={cn('bg-white rounded-xl border border-gray-200 shadow-sm', className)}>
        {children}
    </div>
);

const Badge = ({ children, variant = 'default', className }) => {
    const variants = {
        default: 'bg-gray-100 text-gray-700',
        success: 'bg-green-100 text-green-700',
        warning: 'bg-yellow-100 text-yellow-700',
        danger: 'bg-red-100 text-red-700',
        info: 'bg-blue-100 text-blue-700',
    };
    return (
        <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', variants[variant], className)}>
            {children}
        </span>
    );
};

const PrimaryButton = ({ children, onClick, icon: Icon, className, size = 'md' }) => (
    <button
        onClick={onClick}
        className={cn(
            'inline-flex items-center gap-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors',
            size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm',
            className
        )}
    >
        {Icon && <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />}
        {children}
    </button>
);

const SecondaryButton = ({ children, onClick, icon: Icon, className, size = 'md' }) => (
    <button
        onClick={onClick}
        className={cn(
            'inline-flex items-center gap-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors',
            size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm',
            className
        )}
    >
        {Icon && <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />}
        {children}
    </button>
);

// --------------- 评级徽章 ---------------
const GradeBadge = ({ grade }) => {
    const config = {
        'A': { color: 'bg-green-100 text-green-700 border-green-200', label: 'A级-优秀' },
        'B': { color: 'bg-blue-100 text-blue-700 border-blue-200', label: 'B级-良好' },
        'C': { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', label: 'C级-需改善' },
        'D': { color: 'bg-red-100 text-red-700 border-red-200', label: 'D级-高风险' },
    };
    const cfg = config[grade] || { color: 'bg-gray-100 text-gray-600', label: '-' };
    return (
        <span className={cn('px-2.5 py-1 rounded-lg text-xs font-medium border', cfg.color)}>
            {cfg.label}
        </span>
    );
};

// --------------- 趋势指示器 ---------------
const TrendIndicator = ({ trend, value }) => {
    if (!trend) return <span className="text-gray-400">-</span>;
    return (
        <div className={cn(
            'flex items-center gap-1 text-xs font-medium',
            trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500'
        )}>
            {trend === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> : 
             trend === 'down' ? <TrendingDown className="w-3.5 h-3.5" /> : 
             <Minus className="w-3.5 h-3.5" />}
            {trend === 'up' ? '+' : ''}{value?.toFixed(1) || 0}
        </div>
    );
};

// --------------- 主组件 ---------------
export default function SupplierPerformanceListPage({ onOpenDetail }) {
    const [data] = useState(initialPerformanceList);
    const [searchText, setSearchText] = useState('');
    const [filterGrade, setFilterGrade] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterType, setFilterType] = useState('');

    // 过滤数据 - 只显示每个供应商最新的评估
    const latestEvaluations = React.useMemo(() => {
        const map = new Map();
        data.forEach(item => {
            const existing = map.get(item.supplierId);
            if (!existing || (item.period && (!existing.period || item.period > existing.period))) {
                map.set(item.supplierId, item);
            }
        });
        return Array.from(map.values());
    }, [data]);

    const filteredData = latestEvaluations.filter(item => {
        const matchesSearch = !searchText ||
            item.supplierName.toLowerCase().includes(searchText.toLowerCase()) ||
            item.supplierId.toLowerCase().includes(searchText.toLowerCase());
        const matchesGrade = !filterGrade || item.grade === filterGrade;
        const matchesStatus = !filterStatus || item.status === filterStatus;
        const matchesType = !filterType || item.type === filterType;
        return matchesSearch && matchesGrade && matchesStatus && matchesType;
    });

    // 统计
    const stats = {
        total: latestEvaluations.length,
        rated: latestEvaluations.filter(i => i.status !== 'none').length,
        unrated: latestEvaluations.filter(i => i.status === 'none').length,
        gradeA: latestEvaluations.filter(i => i.grade === 'A').length,
        gradeB: latestEvaluations.filter(i => i.grade === 'B').length,
        gradeC: latestEvaluations.filter(i => i.grade === 'C').length,
        gradeD: latestEvaluations.filter(i => i.grade === 'D').length,
    };

    const handleViewDetail = (record) => {
        if (onOpenDetail) {
            onOpenDetail({
                id: `supplier-perf-${record.supplierId}`,
                name: `供应商绩效: ${record.supplierName}`,
                path: '/procurement/supplier-performance/detail',
                data: record,
            });
        }
    };

    const handleNewEvaluation = (supplier) => {
        if (onOpenDetail) {
            onOpenDetail({
                id: `supplier-perf-new-${supplier.supplierId}`,
                name: `新建评估: ${supplier.supplierName}`,
                path: '/procurement/supplier-performance/detail',
                data: { ...supplier, isNew: true },
            });
        }
    };

    const statusConfig = {
        confirmed: { label: '已确认', variant: 'success', icon: CheckCircle },
        pending: { label: '待审核', variant: 'warning', icon: AlertCircle },
        draft: { label: '草稿', variant: 'default', icon: Clock },
        none: { label: '未评估', variant: 'default', icon: null },
    };

    return (
        <div className="space-y-6">
            {/* 头部 */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">供应商绩效</h1>
                    <p className="text-sm text-gray-500 mt-1">管理供应商绩效评估，跟踪供应商表现</p>
                </div>
                <SecondaryButton icon={Download}>导出报表</SecondaryButton>
            </div>

            {/* 统计卡片 */}
            <div className="grid grid-cols-6 gap-4">
                <Card className="p-4">
                    <p className="text-sm text-gray-500">供应商总数</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </Card>
                <Card className="p-4">
                    <p className="text-sm text-gray-500">已评估</p>
                    <p className="text-2xl font-bold text-green-600">{stats.rated}</p>
                </Card>
                <Card className="p-4 border-l-4 border-l-green-500">
                    <p className="text-sm text-gray-500">A级优秀</p>
                    <p className="text-2xl font-bold text-green-600">{stats.gradeA}</p>
                </Card>
                <Card className="p-4 border-l-4 border-l-blue-500">
                    <p className="text-sm text-gray-500">B级良好</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.gradeB}</p>
                </Card>
                <Card className="p-4 border-l-4 border-l-yellow-500">
                    <p className="text-sm text-gray-500">C级需改善</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.gradeC}</p>
                </Card>
                <Card className="p-4 border-l-4 border-l-red-500">
                    <p className="text-sm text-gray-500">D级高风险</p>
                    <p className="text-2xl font-bold text-red-600">{stats.gradeD}</p>
                </Card>
            </div>

            {/* 筛选 */}
            <Card className="p-4">
                <div className="flex items-center gap-4 flex-wrap">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            placeholder="搜索供应商名称、编码..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <select
                        value={filterGrade}
                        onChange={(e) => setFilterGrade(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    >
                        <option value="">全部评级</option>
                        <option value="A">A级-优秀</option>
                        <option value="B">B级-良好</option>
                        <option value="C">C级-需改善</option>
                        <option value="D">D级-高风险</option>
                        <option value="none">未评估</option>
                    </select>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    >
                        <option value="">全部状态</option>
                        <option value="confirmed">已确认</option>
                        <option value="pending">待审核</option>
                        <option value="draft">草稿</option>
                    </select>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    >
                        <option value="">全部类型</option>
                        <option value="战略供应商">战略供应商</option>
                        <option value="常规供应商">常规供应商</option>
                        <option value="临时供应商">临时供应商</option>
                    </select>
                    {(filterGrade || filterStatus || filterType) && (
                        <button
                            onClick={() => { setFilterGrade(''); setFilterStatus(''); setFilterType(''); }}
                            className="text-sm text-blue-600 hover:underline"
                        >
                            清除筛选
                        </button>
                    )}
                </div>
            </Card>

            {/* 表格 */}
            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">供应商</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">类型</th>
                                <th className="px-4 py-3 text-center font-medium text-gray-600">最新评级</th>
                                <th className="px-4 py-3 text-center font-medium text-gray-600">分数</th>
                                <th className="px-4 py-3 text-center font-medium text-gray-600">较上期</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">评估周期</th>
                                <th className="px-4 py-3 text-center font-medium text-gray-600">状态</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">评估人</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredData.map(item => {
                                const StatusIcon = statusConfig[item.status]?.icon;
                                return (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <div>
                                                <div className="font-medium text-gray-900">{item.supplierName}</div>
                                                <div className="text-xs text-gray-500">{item.supplierId} · {item.category}</div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge variant={item.type === '战略供应商' ? 'success' : item.type === '常规供应商' ? 'info' : 'default'}>
                                                {item.type}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {item.grade ? <GradeBadge grade={item.grade} /> : <span className="text-gray-400">-</span>}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {item.score !== null ? (
                                                <span className={cn(
                                                    'font-bold',
                                                    item.score >= 90 ? 'text-green-600' :
                                                    item.score >= 80 ? 'text-blue-600' :
                                                    item.score >= 70 ? 'text-yellow-600' : 'text-red-600'
                                                )}>
                                                    {item.score.toFixed(1)}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <TrendIndicator trend={item.trend} value={item.trendValue} />
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">
                                            {item.period || <span className="text-gray-400">-</span>}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {StatusIcon ? (
                                                <Badge variant={statusConfig[item.status].variant}>
                                                    <StatusIcon className="w-3 h-3 mr-1" />
                                                    {statusConfig[item.status].label}
                                                </Badge>
                                            ) : (
                                                <Badge>未评估</Badge>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">
                                            {item.evaluator || '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                {item.status !== 'none' ? (
                                                    <button
                                                        onClick={() => handleViewDetail(item)}
                                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                    >
                                                        查看详情
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleNewEvaluation(item)}
                                                        className="text-green-600 hover:text-green-800 text-sm font-medium"
                                                    >
                                                        新建评估
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {filteredData.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            <Award className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p>暂无供应商绩效数据</p>
                        </div>
                    )}
                </div>

                {filteredData.length > 0 && (
                    <div className="px-4 py-3 border-t bg-gray-50 flex items-center justify-between">
                        <p className="text-sm text-gray-500">共 {filteredData.length} 条记录</p>
                    </div>
                )}
            </Card>
        </div>
    );
}
