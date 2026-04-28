// src/pages/SupplierPerformancePage.js
// 供应商绩效评估页面 - 查看/编辑模式
import React, { useState } from 'react';
import {
    ChevronLeft, Save, Send, Download, History, ChevronDown, ChevronRight,
    Award, TrendingUp, TrendingDown, Minus, X, Paperclip, CheckCircle,
    Clock, AlertTriangle, Target, Shield, Truck, Users, Plus,
    Star, FileText, Edit3, Eye, RotateCcw
} from 'lucide-react';
import { toast } from '../../components/ui/Toast';

const cn = (...args) => args.filter(Boolean).join(' ');

// --------------- 供应商数据 ---------------
const suppliers = [
    { id: 'SUP001', name: '深圳市鑫源电子有限公司', category: '电子元器件', cooperationYear: 3, type: '战略供应商' },
];

// --------------- 评估维度配置 ---------------
const dimensions = [
    {
        key: 'quality', label: '质量', labelEn: 'Quality', weight: 30, color: '#3b82f6', bg: 'bg-blue-500', lightBg: 'bg-blue-50', border: 'border-blue-200',
        icon: Shield, desc: '来料质量与持续改善',
        items: [
            { id: 'Q1', name: '来料合格率', max: 10, weight: 10, hint: '批次合格率≥98%' },
            { id: 'Q2', name: '重大质量事故', max: 5, weight: 5, hint: '无重大事故满分' },
            { id: 'Q3', name: '整改及时性', max: 5, weight: 5, hint: '24小时内响应' },
            { id: 'Q4', name: '客退率控制', max: 5, weight: 5, hint: '≤0.5%得满分' },
            { id: 'Q5', name: '改善配合', max: 5, weight: 5, hint: '主动改善加分' },
        ]
    },
    {
        key: 'cost', label: '成本', labelEn: 'Cost', weight: 25, color: '#10b981', bg: 'bg-emerald-500', lightBg: 'bg-emerald-50', border: 'border-emerald-200',
        icon: Target, desc: '价格竞争力与降本',
        items: [
            { id: 'C1', name: '价格竞争力', max: 10, weight: 10, hint: '低于市场10%满分' },
            { id: 'C2', name: '降本达成', max: 5, weight: 5, hint: '目标达成率' },
            { id: 'C3', name: '账期配合', max: 10, weight: 10, hint: '配合度评估' },
        ]
    },
    {
        key: 'delivery', label: '交付', labelEn: 'Delivery', weight: 25, color: '#f59e0b', bg: 'bg-amber-500', lightBg: 'bg-amber-50', border: 'border-amber-200',
        icon: Truck, desc: '准时交付与响应速度',
        items: [
            { id: 'D1', name: '准时交付率', max: 10, weight: 10, hint: '≥95%得满分' },
            { id: 'D2', name: '柔性响应', max: 10, weight: 10, hint: '紧急订单完成率' },
            { id: 'D3', name: '交付周期', max: 5, weight: 5, hint: '短于行业平均' },
        ]
    },
    {
        key: 'service', label: '服务', labelEn: 'Service', weight: 20, color: '#8b5cf6', bg: 'bg-violet-500', lightBg: 'bg-violet-50', border: 'border-violet-200',
        icon: Users, desc: '沟通配合与风险管控',
        items: [
            { id: 'S1', name: '响应速度', max: 5, weight: 5, hint: '24小时内响应' },
            { id: 'S2', name: '支持配合', max: 10, weight: 10, hint: '审计验厂配合' },
            { id: 'S3', name: '渠道专一', max: 5, weight: 5, hint: '优先供应' },
        ]
    },
];

const gradeConfig = {
    A: { color: '#10b981', bg: 'bg-emerald-500', light: 'bg-emerald-50', label: '优秀', desc: '建议重点合作，扩大份额' },
    B: { color: '#3b82f6', bg: 'bg-blue-500', light: 'bg-blue-50', label: '良好', desc: '继续保持，定期跟进' },
    C: { color: '#f59e0b', bg: 'bg-amber-500', light: 'bg-amber-50', label: '待改善', desc: '限期整改，重点跟进' },
    D: { color: '#ef4444', bg: 'bg-red-500', light: 'bg-red-50', label: '高风险', desc: '建议评估替换' },
};

// --------------- Mock 评估数据 ---------------
const mockEvaluationData = {
    scores: {
        // Q质量
        Q1: 9.5,   // 来料合格率 - 实际批次合格率99.2%
        Q2: 5,     // 重大质量事故 - 无事故
        Q3: 4.5,   // 整改及时性 - 平均18小时响应
        Q4: 4,     // 客退率控制 - 实际0.3%
        Q5: 4,     // 改善配合 - 主动提出2项改善
        // C成本
        C1: 8,     // 价格竞争力 - 低于市场8%
        C2: 4,     // 降本达成 - 达成率95%
        C3: 9,     // 账期配合 - 配合调整账期
        // D交付
        D1: 9,     // 准时交付率 - 实际96.5%
        D2: 8,     // 柔性响应 - 紧急订单完成率88%
        D3: 4,     // 交付周期 - 略优于行业平均
        // S服务
        S1: 5,     // 响应速度 - 平均12小时响应
        S2: 9,     // 支持配合 - 积极配合审计验厂
        S3: 4,     // 渠道专一 - 优先供应
    },
    evaluator: '张三',
    evaluationDate: '2024-04-15',
    period: '2024-Q2',
    remarks: '该供应商整体表现良好，质量稳定，交付准时。建议在成本控制方面进一步加强，争取更大的降本空间。',
    attachments: [
        { name: 'Q2质量检测报告.pdf', size: '3.2MB' },
        { name: '供应商现场审核记录.pdf', size: '5.1MB' },
    ],
    status: 'confirmed', // confirmed | draft | pending
};

// --------------- 计算分数 ---------------
const calcScore = (scores) => {
    let total = 0;
    dimensions.forEach(d => {
        d.items.forEach(item => {
            const score = scores[item.id] || 0;
            total += (score / item.max) * item.weight;
        });
    });
    return Math.round(total * 10) / 10;
};

const getGrade = (score) => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    return 'D';
};

// --------------- 评分星星组件 ---------------
const StarRating = ({ score, max }) => {
    const filled = Math.round((score / max) * 5);
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
                <Star
                    key={i}
                    className={cn(
                        "w-3.5 h-3.5",
                        i <= filled ? "fill-amber-400 text-amber-400" : "fill-gray-100 text-gray-300"
                    )}
                />
            ))}
        </div>
    );
};

// --------------- 主组件 ---------------
export default function SupplierPerformancePage({ data, onClose }) {
    const supplier = data || suppliers[0];
    const isNew = data?.isNew || false;
    
    // 初始化数据
    const initialData = isNew ? {} : mockEvaluationData.scores;
    const [scores, setScores] = useState(initialData);
    const [isEditing, setIsEditing] = useState(isNew); // 新建默认可编辑，查看默认只读
    const [expanded, setExpanded] = useState(['quality', 'cost', 'delivery', 'service']);
    const [activeTab, setActiveTab] = useState('evaluate');
    
    // 表单数据
    const [evaluator, setEvaluator] = useState(isNew ? '' : mockEvaluationData.evaluator);
    const [evaluationDate, setEvaluationDate] = useState(isNew ? new Date().toISOString().split('T')[0] : mockEvaluationData.evaluationDate);
    const [period, setPeriod] = useState(isNew ? '2024-Q2' : mockEvaluationData.period);
    const [remarks, setRemarks] = useState(isNew ? '' : mockEvaluationData.remarks);
    const [attachments, setAttachments] = useState(isNew ? [] : mockEvaluationData.attachments);
    const [status, setStatus] = useState(isNew ? 'draft' : mockEvaluationData.status);

    const totalScore = calcScore(scores);
    const grade = getGrade(totalScore);
    const gradeCfg = gradeConfig[grade];
    const prevScore = 86.5;
    const diff = totalScore > 0 ? totalScore - prevScore : null;

    const toggleExpand = (key) => {
        setExpanded(p => p.includes(key) ? p.filter(k => k !== key) : [...p, key]);
    };

    const updateScore = (id, val) => {
        const num = Math.min(Math.max(parseFloat(val) || 0, 0), 10);
        setScores(s => ({ ...s, [id]: num }));
    };

    const dimScore = (dim) => {
        return dim.items.reduce((sum, item) => {
            return sum + ((scores[item.id] || 0) / item.max) * item.weight;
        }, 0);
    };

    const handleSave = () => {
        setIsEditing(false);
        toast.success('评估已保存');
    };

    const handleCancel = () => {
        if (isNew) {
            onClose?.();
        } else {
            // 恢复原始数据
            setScores(mockEvaluationData.scores);
            setEvaluator(mockEvaluationData.evaluator);
            setRemarks(mockEvaluationData.remarks);
            setIsEditing(false);
        }
    };

    const handleSubmit = () => {
        if (status === 'draft') {
            setStatus('pending');
            setIsEditing(false);
            toast.success('评估已提交审核');
        }
    };

    const handleApprove = () => {
        setStatus('confirmed');
        toast.success('审核已通过');
    };

    const handleReject = () => {
        setStatus('draft');
        toast.info('已退回修改');
    };

    const handleFileSelect = () => {
        setAttachments(p => [...p, { name: `文件_${Date.now()}.pdf`, size: '2.5MB' }]);
    };

    const statusCfg = {
        draft: { label: '草稿', color: 'text-gray-600', bg: 'bg-gray-100' },
        pending: { label: '待审核', color: 'text-amber-600', bg: 'bg-amber-100' },
        confirmed: { label: '已确认', color: 'text-emerald-600', bg: 'bg-emerald-100' },
    };

    return (
        <div className="min-h-full bg-gray-50/50">
            {/* 顶部导航栏 */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200/80 backdrop-blur-sm">
                <div className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-4">
                        <button onClick={onClose} className="flex items-center gap-2 text-gray-500 hover:text-gray-700">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                                <ChevronLeft className="w-5 h-5" />
                            </div>
                        </button>
                        <div className="h-8 w-px bg-gray-200" />
                        <div>
                            <h1 className="text-lg font-semibold text-gray-900">{supplier.name}</h1>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-xs font-medium">{supplier.type}</span>
                                <span>·</span>
                                <span>{supplier.category}</span>
                                <span>·</span>
                                <span>合作{supplier.cooperationYear}年</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* 状态标签 */}
                        <span className={cn("px-3 py-1.5 rounded-lg text-sm font-medium", statusCfg[status].bg, statusCfg[status].color)}>
                            {statusCfg[status].label}
                        </span>

                        <div className="h-6 w-px bg-gray-200" />

                        {/* 操作按钮 */}
                        {!isEditing ? (
                            <>
                                <button onClick={() => setActiveTab(activeTab === 'evaluate' ? 'history' : 'evaluate')} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                                    <History className="w-4 h-4" />
                                    {activeTab === 'evaluate' ? '历史记录' : '返回评估'}
                                </button>
                                {status !== 'confirmed' && (
                                    <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">
                                        <Edit3 className="w-4 h-4" />
                                        编辑
                                    </button>
                                )}
                                <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                                    <Download className="w-4 h-4" />
                                    导出
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={handleCancel} className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">
                                    <RotateCcw className="w-4 h-4" />
                                    取消
                                </button>
                                <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800">
                                    <Save className="w-4 h-4" />
                                    保存
                                </button>
                                {status === 'draft' && (
                                    <button onClick={handleSubmit} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">
                                        <Send className="w-4 h-4" />
                                        提交审核
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {activeTab === 'evaluate' ? (
                <div className="p-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-12 gap-6">
                            {/* 左侧：评分区域 */}
                            <div className="col-span-8 space-y-6">
                                {/* 评估信息 */}
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">评估周期</label>
                                                {isEditing ? (
                                                    <select 
                                                        value={period}
                                                        onChange={e => setPeriod(e.target.value)}
                                                        className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium"
                                                    >
                                                        <option>2024年第二季度</option>
                                                        <option>2024年第一季度</option>
                                                    </select>
                                                ) : (
                                                    <div className="px-3 py-2 text-sm font-medium text-gray-900">{period}</div>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">评估日期</label>
                                                {isEditing ? (
                                                    <input 
                                                        type="date" 
                                                        value={evaluationDate}
                                                        onChange={e => setEvaluationDate(e.target.value)}
                                                        className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                                                    />
                                                ) : (
                                                    <div className="px-3 py-2 text-sm font-medium text-gray-900">{evaluationDate}</div>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">评估人</label>
                                                {isEditing ? (
                                                    <input 
                                                        type="text" 
                                                        value={evaluator}
                                                        onChange={e => setEvaluator(e.target.value)}
                                                        placeholder="请输入姓名"
                                                        className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm w-32"
                                                    />
                                                ) : (
                                                    <div className="px-3 py-2 text-sm font-medium text-gray-900">{evaluator}</div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {status === 'pending' && !isEditing && (
                                            <div className="flex items-center gap-2">
                                                <button onClick={handleReject} className="px-4 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg font-medium">
                                                    退回修改
                                                </button>
                                                <button onClick={handleApprove} className="px-4 py-2 text-sm text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg font-medium">
                                                    审核通过
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* 维度评分 */}
                                <div className="grid grid-cols-2 gap-4">
                                    {dimensions.map((dim) => {
                                        const isExpanded = expanded.includes(dim.key);
                                        const score = dimScore(dim);
                                        const Icon = dim.icon;
                                        
                                        return (
                                            <div key={dim.key} className={cn("bg-white rounded-2xl border transition-all overflow-hidden", isExpanded ? dim.border : "border-gray-100")}>
                                                <div onClick={() => toggleExpand(dim.key)} className="p-4 cursor-pointer">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", dim.lightBg)}>
                                                                <Icon className="w-6 h-6" style={{ color: dim.color }} />
                                                            </div>
                                                            <div>
                                                                <div className="flex items-baseline gap-2">
                                                                    <span className="text-lg font-bold text-gray-900">{dim.label}</span>
                                                                    <span className="text-xs text-gray-400">{dim.labelEn}</span>
                                                                </div>
                                                                <p className="text-xs text-gray-500">{dim.desc}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <div className="text-right">
                                                                <div className={cn("text-2xl font-bold", score >= dim.weight * 0.8 ? "text-emerald-600" : score >= dim.weight * 0.6 ? "text-amber-600" : "text-red-500")}>
                                                                    {score.toFixed(1)}
                                                                </div>
                                                                <div className="text-xs text-gray-400">/ {dim.weight}分</div>
                                                            </div>
                                                            {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
                                                        </div>
                                                    </div>
                                                    <div className="mt-3">
                                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                            <div className={cn("h-full rounded-full transition-all", dim.bg)} style={{ width: `${Math.min((score / dim.weight) * 100, 100)}%` }} />
                                                        </div>
                                                    </div>
                                                </div>

                                                {isExpanded && (
                                                    <div className="border-t border-gray-100">
                                                        <div className="p-4 space-y-3">
                                                            {dim.items.map((item, i) => (
                                                                <div key={item.id} className="bg-gray-50/50 rounded-xl p-3">
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="flex-1">
                                                                            <div className="flex items-center gap-2">
                                                                                <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-600 text-xs flex items-center justify-center font-medium">{i + 1}</span>
                                                                                <span className="font-medium text-gray-700">{item.name}</span>
                                                                            </div>
                                                                            <div className="mt-1 text-xs text-gray-400">{item.hint}</div>
                                                                        </div>
                                                                        <div className="flex items-center gap-4">
                                                                            <span className="text-xs text-gray-400">权重 {item.weight}%</span>
                                                                            {isEditing ? (
                                                                                <div className="flex items-center gap-2">
                                                                                    <input
                                                                                        type="number"
                                                                                        min="0"
                                                                                        max={item.max}
                                                                                        step="0.5"
                                                                                        value={scores[item.id] || ''}
                                                                                        onChange={(e) => updateScore(item.id, e.target.value)}
                                                                                        className="w-16 h-9 text-center font-semibold rounded-lg border-2 border-gray-200 focus:border-indigo-500 outline-none"
                                                                                    />
                                                                                    <span className="text-xs text-gray-400">/{item.max}</span>
                                                                                </div>
                                                                            ) : (
                                                                                <div className="flex items-center gap-3">
                                                                                    <StarRating score={scores[item.id] || 0} max={item.max} />
                                                                                    <span className={cn(
                                                                                        "w-12 h-9 flex items-center justify-center rounded-lg font-bold text-sm",
                                                                                        (scores[item.id] || 0) >= item.max * 0.8 ? "bg-emerald-100 text-emerald-700" :
                                                                                        (scores[item.id] || 0) >= item.max * 0.6 ? "bg-amber-100 text-amber-700" :
                                                                                        "bg-gray-100 text-gray-600"
                                                                                    )}>
                                                                                        {scores[item.id] || 0}
                                                                                    </span>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* 附件和备注 */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Paperclip className="w-4 h-4 text-gray-400" />
                                            <h3 className="font-semibold text-gray-900">附件材料</h3>
                                            <span className="text-xs text-gray-400">({attachments.length})</span>
                                        </div>
                                        {isEditing && (
                                            <div onClick={handleFileSelect} className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all mb-3">
                                                <Plus className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                                                <p className="text-xs text-gray-500">点击上传附件</p>
                                            </div>
                                        )}
                                        {attachments.length > 0 ? (
                                            <div className="space-y-2">
                                                {attachments.map((f, i) => (
                                                    <div key={i} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg group">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                                                <FileText className="w-4 h-4 text-red-600" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-700">{f.name}</p>
                                                                <p className="text-xs text-gray-400">{f.size}</p>
                                                            </div>
                                                        </div>
                                                        {isEditing && (
                                                            <button onClick={() => setAttachments(attachments.filter((_, j) => j !== i))} className="p-1.5 text-gray-400 hover:text-red-500">
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-400 text-center py-4">暂无附件</p>
                                        )}
                                    </div>

                                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                                        <div className="flex items-center gap-2 mb-4">
                                            <FileText className="w-4 h-4 text-gray-400" />
                                            <h3 className="font-semibold text-gray-900">评估备注</h3>
                                        </div>
                                        {isEditing ? (
                                            <textarea
                                                value={remarks}
                                                onChange={e => setRemarks(e.target.value)}
                                                placeholder="请输入评估意见..."
                                                rows={6}
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm resize-none focus:ring-2 focus:ring-indigo-500 outline-none"
                                            />
                                        ) : (
                                            <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-700 min-h-[120px]">
                                                {remarks || <span className="text-gray-400">暂无备注</span>}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* 右侧：结果面板 */}
                            <div className="col-span-4 space-y-4">
                                {/* 总分卡片 */}
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
                                    <div className="p-6 text-center">
                                        <div className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mb-4", gradeCfg.light)} style={{ color: gradeCfg.color }}>
                                            <Award className="w-3.5 h-3.5" />
                                            综合评级
                                        </div>

                                        <div className={cn("w-24 h-24 mx-auto rounded-2xl flex flex-col items-center justify-center text-white shadow-lg mb-4", gradeCfg.bg)}>
                                            <span className="text-4xl font-bold">{grade}</span>
                                            <span className="text-xs opacity-90">{gradeCfg.label}</span>
                                        </div>

                                        <div className="flex items-baseline justify-center gap-1">
                                            <span className="text-5xl font-bold text-gray-900">{totalScore.toFixed(1)}</span>
                                            <span className="text-lg text-gray-400">/100</span>
                                        </div>

                                        {diff !== null && (
                                            <div className={cn("mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium", diff > 0 ? "bg-emerald-50 text-emerald-700" : diff < 0 ? "bg-red-50 text-red-700" : "bg-gray-100 text-gray-600")}>
                                                {diff > 0 ? <TrendingUp className="w-4 h-4" /> : diff < 0 ? <TrendingDown className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                                                较上期 {diff > 0 ? '+' : ''}{diff.toFixed(1)}
                                            </div>
                                        )}

                                        <p className="mt-4 text-sm text-gray-600">{gradeCfg.desc}</p>
                                    </div>

                                    <div className="border-t border-gray-100 p-5 bg-gray-50/30">
                                        <h4 className="text-sm font-semibold text-gray-900 mb-4">维度得分明细</h4>
                                        <div className="space-y-4">
                                            {dimensions.map(dim => {
                                                const score = dimScore(dim);
                                                const pct = (score / dim.weight) * 100;
                                                const Icon = dim.icon;
                                                return (
                                                    <div key={dim.key}>
                                                        <div className="flex items-center justify-between mb-1.5">
                                                            <div className="flex items-center gap-2">
                                                                <Icon className="w-4 h-4" style={{ color: dim.color }} />
                                                                <span className="text-sm font-medium text-gray-700">{dim.label}</span>
                                                            </div>
                                                            <span className={cn("text-sm font-bold", pct >= 80 ? "text-emerald-600" : pct >= 60 ? "text-amber-600" : "text-red-500")}>
                                                                {score.toFixed(1)}/{dim.weight}
                                                            </span>
                                                        </div>
                                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                            <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: dim.color }} />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* 评级标准 */}
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                                    <h4 className="text-sm font-semibold text-gray-900 mb-4">评级标准</h4>
                                    <div className="space-y-2">
                                        {Object.entries(gradeConfig).map(([g, cfg]) => (
                                            <div key={g} className={cn("flex items-center gap-3 p-2.5 rounded-xl", grade === g ? "bg-gray-50 ring-1 ring-gray-200" : "")}>
                                                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: cfg.color }}>
                                                    {g}
                                                </div>
                                                <div className="flex-1">
                                                    <span className="font-medium text-gray-900">{cfg.label}</span>
                                                </div>
                                                <span className="text-xs text-gray-400">{g === 'A' ? '90-100' : g === 'B' ? '80-89' : g === 'C' ? '70-79' : '<70'}分</span>
                                                {grade === g && <CheckCircle className="w-4 h-4" style={{ color: cfg.color }} />}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // 历史记录视图
                <div className="p-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">历史评估记录</h2>
                            <div className="space-y-4">
                                {[
                                    { period: '2024-Q1', score: 89.0, grade: 'B', date: '2024-04-15' },
                                    { period: '2023-Q4', score: 85.5, grade: 'B', date: '2024-01-15' },
                                    { period: '2023-Q3', score: 82.0, grade: 'B', date: '2023-10-15' },
                                    { period: '2023-Q2', score: 76.5, grade: 'C', date: '2023-07-15' },
                                ].map((h, i, arr) => (
                                    <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                        <div className="w-14 h-14 rounded-xl flex flex-col items-center justify-center text-white font-bold shadow-md" style={{ backgroundColor: gradeConfig[h.grade].color }}>
                                            <span className="text-lg">{h.grade}</span>
                                            <span className="text-[10px] opacity-90">{gradeConfig[h.grade].label}</span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-baseline gap-3">
                                                <span className="text-lg font-semibold text-gray-900">{h.period}</span>
                                                <span className="text-2xl font-bold text-gray-900">{h.score}分</span>
                                            </div>
                                            <p className="text-sm text-gray-500">评估日期: {h.date}</p>
                                        </div>
                                        {i < arr.length - 1 && (
                                            <div className={cn("flex items-center gap-1 text-sm font-medium px-3 py-1 rounded-full", h.score > arr[i + 1].score ? "bg-emerald-100 text-emerald-700" : h.score < arr[i + 1].score ? "bg-red-100 text-red-700" : "bg-gray-200 text-gray-600")}>
                                                {h.score > arr[i + 1].score ? <TrendingUp className="w-4 h-4" /> : h.score < arr[i + 1].score ? <TrendingDown className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                                                {h.score > arr[i + 1].score ? '+' : ''}{(h.score - arr[i + 1].score).toFixed(1)}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
