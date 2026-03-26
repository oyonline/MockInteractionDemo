// src/pages/SupplierDetailPage.js
// 供应商详情页（融合基本信息 + 绩效评估）
import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, Edit2, Phone, Mail, MapPin, Star, Award, 
  TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp,
  Save, X, CheckCircle, Building2, Package, FileText,
  Calendar, User, AlertCircle
} from 'lucide-react';

const cn = (...args) => args.filter(Boolean).join(' ');

// -------------- 模拟绩效评估数据 --------------
const defaultPerformanceHistory = [
  { 
    id: 'perf-1', period: '2024-Q1', score: 92.5, grade: 'A', 
    evaluator: '张三', date: '2024-04-15', status: 'confirmed',
    qcds: { quality: 95, cost: 88, delivery: 90, service: 85 },
    indicators: {
      Q1: 0.95, Q2: 0.92, Q3: 0.88, Q4: 0.90, Q5: 0.93,
      C1: 0.88, C2: 0.85, C3: 0.90, C4: 0.87,
      D1: 0.92, D2: 0.88, D3: 0.90,
      S1: 0.85, S2: 0.88, S3: 0.82, S4: 0
    }
  },
  { 
    id: 'perf-2', period: '2023-Q4', score: 89.0, grade: 'B', 
    evaluator: '张三', date: '2024-01-15', status: 'confirmed',
    qcds: { quality: 90, cost: 85, delivery: 88, service: 82 },
    indicators: {
      Q1: 0.92, Q2: 0.88, Q3: 0.85, Q4: 0.87, Q5: 0.90,
      C1: 0.85, C2: 0.82, C3: 0.87, C4: 0.84,
      D1: 0.88, D2: 0.85, D3: 0.87,
      S1: 0.82, S2: 0.85, S3: 0.80, S4: 0
    }
  }
];

// -------------- 评估指标配置 --------------
const evaluationConfig = {
  quality: {
    name: '质量(Q) - 权重30%',
    items: [
      { id: 'Q1', name: '来料合格率', weight: 0.06 },
      { id: 'Q2', name: '制程合格率', weight: 0.05 },
      { id: 'Q3', name: '出货合格率', weight: 0.05 },
      { id: 'Q4', name: '变更/特采控制', weight: 0.08 },
      { id: 'Q5', name: '质量事故', weight: 0.06 },
    ]
  },
  cost: {
    name: '成本(C) - 权重25%',
    items: [
      { id: 'C1', name: '价格竞争力', weight: 0.08 },
      { id: 'C2', name: '降价配合度', weight: 0.06 },
      { id: 'C3', name: '付款条件', weight: 0.06 },
      { id: 'C4', name: '汇率吸收能力', weight: 0.05 },
    ]
  },
  delivery: {
    name: '交付(D) - 权重25%',
    items: [
      { id: 'D1', name: '准时交付率', weight: 0.10 },
      { id: 'D2', name: '交付柔性', weight: 0.08 },
      { id: 'D3', name: '物流跟踪', weight: 0.07 },
    ]
  },
  service: {
    name: '服务(S) - 权重20%',
    items: [
      { id: 'S1', name: '响应速度', weight: 0.06 },
      { id: 'S2', name: '售后支持', weight: 0.07 },
      { id: 'S3', name: '技术配合', weight: 0.05 },
      { id: 'S4', name: '供应链风险合规', weight: 0.02 },
    ]
  }
};

// -------------- 组件 --------------
const Card = ({ children, className }) => (
  <div className={cn('bg-white rounded-xl border border-gray-200 shadow-sm', className)}>{children}</div>
);

const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
  };
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', variants[variant])}>
      {children}
    </span>
  );
};

const GradeBadge = ({ grade, size = 'md' }) => {
  const config = {
    'A': { color: 'bg-green-100 text-green-700 border-green-200', label: 'A级-优秀' },
    'B': { color: 'bg-blue-100 text-blue-700 border-blue-200', label: 'B级-良好' },
    'C': { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', label: 'C级-需改善' },
    'D': { color: 'bg-red-100 text-red-700 border-red-200', label: 'D级-高风险' },
  };
  const cfg = config[grade] || config['D'];
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded border font-medium',
      cfg.color,
      size === 'lg' ? 'text-sm px-3 py-1' : 'text-xs'
    )}>
      {grade}
    </span>
  );
};

// -------------- 绩效评估表单组件 --------------
const PerformanceEvaluationForm = ({ supplier, onSave, onCancel }) => {
  const [period, setPeriod] = useState('2024-Q2');
  const [evaluator, setEvaluator] = useState('');
  const [scores, setScores] = useState({
    Q1: 0.90, Q2: 0.88, Q3: 0.85, Q4: 0.87, Q5: 0.88,
    C1: 0.85, C2: 0.82, C3: 0.85, C4: 0.80,
    D1: 0.88, D2: 0.85, D3: 0.87,
    S1: 0.85, S2: 0.87, S3: 0.83, S4: 0
  });

  const calculateScore = () => {
    let total = 0;
    Object.entries(evaluationConfig).forEach(([key, section]) => {
      section.items.forEach(item => {
        const score = scores[item.id] || 0;
        let itemScore = 0;
        if (score >= 0.95) itemScore = item.weight * 100;
        else if (score >= 0.90) itemScore = item.weight * 90;
        else if (score >= 0.85) itemScore = item.weight * 80;
        else if (score >= 0.80) itemScore = item.weight * 70;
        else itemScore = item.weight * 60;
        total += itemScore;
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

  const totalScore = calculateScore();
  const grade = getGrade(totalScore);

  const handleScoreChange = (id, value) => {
    setScores(prev => ({ ...prev, [id]: parseFloat(value) }));
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-lg font-semibold text-gray-800">发起新绩效评估</h4>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-gray-500">预估总分</div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-indigo-600">{totalScore}</span>
              <GradeBadge grade={grade} size="lg" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">评估周期</label>
          <select value={period} onChange={(e) => setPeriod(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500">
            <option value="2024-Q2">2024年第二季度</option>
            <option value="2024-Q1">2024年第一季度</option>
            <option value="2023-Q4">2023年第四季度</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">评估人</label>
          <input type="text" value={evaluator} onChange={(e) => setEvaluator(e.target.value)}
            placeholder="请输入评估人姓名" className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" />
        </div>
      </div>

      {/* 16项指标 - 紧凑4列布局 */}
      <div className="grid grid-cols-4 gap-3">
        {Object.entries(evaluationConfig).map(([key, section]) => (
          <div key={key} className="bg-white rounded-lg p-3 border">
            <h5 className="text-sm font-medium text-gray-800 mb-2 pb-2 border-b">{section.name}</h5>
            <div className="space-y-2">
              {section.items.map(item => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 truncate" title={item.name}>{item.name}</span>
                  <input type="number" min="0" max="1" step="0.01"
                    value={scores[item.id]}
                    onChange={(e) => handleScoreChange(item.id, e.target.value)}
                    className="w-14 px-1 py-0.5 border rounded text-right text-sm" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button onClick={onCancel} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">取消</button>
        <button onClick={() => onSave({ period, evaluator, scores, totalScore, grade })}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 flex items-center gap-2">
          <Save className="w-4 h-4" />保存评估
        </button>
      </div>
    </div>
  );
};

// -------------- 主组件 --------------
const SupplierDetailPage = ({ data, onClose }) => {
  const supplier = data || {};
  const [activeTab, setActiveTab] = useState(data?.activeTab || 'basic');
  const [isEditing, setIsEditing] = useState(false);
  const [showEvalForm, setShowEvalForm] = useState(false);
  const [expandedPerf, setExpandedPerf] = useState(null);
  const [performanceHistory, setPerformanceHistory] = useState(defaultPerformanceHistory);

  const tabs = [
    { id: 'basic', name: '基本信息' },
    { id: 'contact', name: '联系人' },
    { id: 'qualification', name: '资质证书' },
    { id: 'performance', name: '绩效评估' },
  ];

  const latestPerformance = performanceHistory[0];

  const handleSaveEvaluation = (evaluation) => {
    const newPerf = {
      id: `perf-${Date.now()}`,
      ...evaluation,
      date: new Date().toISOString().split('T')[0],
      status: 'confirmed',
      qcds: {
        quality: Math.round((evaluation.scores.Q1 + evaluation.scores.Q2 + evaluation.scores.Q3 + evaluation.scores.Q4 + evaluation.scores.Q5) / 5 * 100),
        cost: Math.round((evaluation.scores.C1 + evaluation.scores.C2 + evaluation.scores.C3 + evaluation.scores.C4) / 4 * 100),
        delivery: Math.round((evaluation.scores.D1 + evaluation.scores.D2 + evaluation.scores.D3) / 3 * 100),
        service: Math.round((evaluation.scores.S1 + evaluation.scores.S2 + evaluation.scores.S3 + evaluation.scores.S4) / 4 * 100),
      }
    };
    setPerformanceHistory([newPerf, ...performanceHistory]);
    setShowEvalForm(false);
  };

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{supplier.name}</h3>
            <p className="text-gray-500 mt-1">{supplier.code}</p>
          </div>
          <div className="flex gap-2">
            <Badge variant={supplier.status === '启用' ? 'success' : supplier.status === '停用' ? 'danger' : 'warning'}>
              {supplier.status}
            </Badge>
            {supplier.rating && supplier.rating !== '-' && (
              <GradeBadge grade={supplier.rating} />
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="text-sm text-gray-500">供应商简称</label>
            <p className="font-medium text-gray-800">{supplier.shortName}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">供应商类型</label>
            <p className="font-medium text-gray-800">{supplier.type}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">主营品类</label>
            <p className="font-medium text-gray-800">{supplier.category}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">合作起始日期</label>
            <p className="font-medium text-gray-800">{supplier.cooperationDate}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">结算方式</label>
            <p className="font-medium text-gray-800">{supplier.paymentTerms}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">税率</label>
            <p className="font-medium text-gray-800">{supplier.taxRate}%</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <h4 className="font-medium text-gray-800 mb-4 flex items-center gap-2">
            <Phone className="w-4 h-4 text-blue-600" />联系信息
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">联系人</span>
              <span className="text-sm font-medium">{supplier.contact}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">联系电话</span>
              <span className="text-sm font-medium">{supplier.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">邮箱</span>
              <span className="text-sm font-medium">{supplier.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">地址</span>
              <span className="text-sm font-medium text-right max-w-[200px]">{supplier.address}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="font-medium text-gray-800 mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-600" />业务信息
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">关联SKU</span>
              <span className="text-sm font-medium text-purple-600">{supplier.relatedSKU} 个</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">近期采购额</span>
              <span className="text-sm font-medium text-orange-600">
                {supplier.recentOrderAmount > 0 ? `¥${(supplier.recentOrderAmount / 10000).toFixed(2)}万` : '-'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">营业执照</span>
              <span className="text-sm font-medium">{supplier.businessLicense}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">银行账户</span>
              <span className="text-sm font-medium text-right max-w-[200px]">{supplier.bankAccount}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderPerformance = () => (
    <div className="space-y-6">
      {/* 最新评分卡片 */}
      {latestPerformance ? (
        <Card className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-800">最新绩效评分</h4>
              <p className="text-sm text-gray-500 mt-1">{latestPerformance.period} · 评估人：{latestPerformance.evaluator}</p>
            </div>
            <div className="text-right">
              <div className="flex items-baseline gap-3 justify-end">
                <span className="text-4xl font-bold text-indigo-600">{latestPerformance.score}</span>
                <GradeBadge grade={latestPerformance.grade} size="lg" />
              </div>
              <p className="text-sm text-gray-400 mt-1">评估日期：{latestPerformance.date}</p>
            </div>
          </div>
          
          {/* QCDS四维度 */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-green-600">{latestPerformance.qcds.quality}</div>
              <div className="text-xs text-gray-500 mt-1">质量(Q) 30%</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-blue-600">{latestPerformance.qcds.cost}</div>
              <div className="text-xs text-gray-500 mt-1">成本(C) 25%</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-purple-600">{latestPerformance.qcds.delivery}</div>
              <div className="text-xs text-gray-500 mt-1">交付(D) 25%</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-orange-600">{latestPerformance.qcds.service}</div>
              <div className="text-xs text-gray-500 mt-1">服务(S) 20%</div>
            </div>
          </div>
          
          {/* 16项细分指标 */}
          <div className="border-t pt-4">
            <div className="grid grid-cols-4 gap-x-4 gap-y-2 text-xs">
              {Object.entries(evaluationConfig).map(([key, section]) => (
                section.items.map(item => (
                  <div key={item.id} className="flex justify-between py-1">
                    <span className="text-gray-600 truncate" title={item.name}>{item.name}</span>
                    <span className="font-medium text-gray-800 ml-2">
                      {Math.round((latestPerformance.indicators[item.id] || 0) * 100)}%
                    </span>
                  </div>
                ))
              ))}
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">暂无绩效评估记录</p>
          <p className="text-sm text-gray-400 mt-1">点击上方"发起新评估"按钮开始评估</p>
        </Card>
      )}

      {/* 发起评估按钮 */}
      {!showEvalForm && (
        <div className="flex justify-end">
          <button onClick={() => setShowEvalForm(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 flex items-center gap-2">
            <Award className="w-4 h-4" />发起新评估
          </button>
        </div>
      )}

      {/* 评估表单 */}
      {showEvalForm && (
        <PerformanceEvaluationForm 
          supplier={supplier} 
          onSave={handleSaveEvaluation}
          onCancel={() => setShowEvalForm(false)}
        />
      )}

      {/* 历史评估记录 */}
      <Card className="p-6">
        <h4 className="font-semibold text-gray-800 mb-4">历史评估记录</h4>
        <div className="space-y-3">
          {performanceHistory.map((perf) => (
            <div key={perf.id} className="border rounded-lg overflow-hidden">
              <div 
                className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100"
                onClick={() => setExpandedPerf(expandedPerf === perf.id ? null : perf.id)}
              >
                <div className="flex items-center gap-4">
                  <span className="font-medium text-gray-800">{perf.period}</span>
                  <GradeBadge grade={perf.grade} />
                  <span className="text-lg font-bold text-indigo-600">{perf.score}分</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>评估人：{perf.evaluator}</span>
                  <span>{perf.date}</span>
                  {expandedPerf === perf.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>
              
              {expandedPerf === perf.id && (
                <div className="p-3 border-t bg-gray-50">
                  {/* QCDS四维度 */}
                  <div className="flex gap-4 mb-3 pb-3 border-b">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">质量(Q)</span>
                      <span className="text-lg font-bold text-green-600">{perf.qcds.quality}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">成本(C)</span>
                      <span className="text-lg font-bold text-blue-600">{perf.qcds.cost}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">交付(D)</span>
                      <span className="text-lg font-bold text-purple-600">{perf.qcds.delivery}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">服务(S)</span>
                      <span className="text-lg font-bold text-orange-600">{perf.qcds.service}</span>
                    </div>
                  </div>
                  
                  {/* 16项指标 - 紧凑4列 */}
                  <div className="grid grid-cols-4 gap-x-4 gap-y-1 text-xs">
                    {Object.entries(evaluationConfig).map(([key, section]) => (
                      section.items.map(item => (
                        <div key={item.id} className="flex justify-between py-1">
                          <span className="text-gray-600 truncate" title={item.name}>{item.name}</span>
                          <span className="font-medium ml-2">{Math.round((perf.indicators[item.id] || 0) * 100)}%</span>
                        </div>
                      ))
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* 头部 */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onClose && (
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{supplier.shortName || supplier.name}</h2>
              <p className="text-sm text-gray-500">{supplier.code}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2">
                <Edit2 className="w-4 h-4" />编辑
              </button>
            ) : (
              <>
                <button onClick={() => setIsEditing(false)} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">取消</button>
                <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center gap-2">
                  <Save className="w-4 h-4" />保存
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tab导航 */}
      <div className="bg-white border-b px-6">
        <div className="flex gap-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "py-3 text-sm font-medium border-b-2 transition-colors",
                activeTab === tab.id
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              )}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* 内容区 */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'basic' && renderBasicInfo()}
        {activeTab === 'contact' && (
          <Card className="p-8 text-center text-gray-500">
            <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>联系人信息模块开发中...</p>
          </Card>
        )}
        {activeTab === 'qualification' && (
          <Card className="p-8 text-center text-gray-500">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>资质证书模块开发中...</p>
          </Card>
        )}
        {activeTab === 'performance' && renderPerformance()}
      </div>
    </div>
  );
};

export default SupplierDetailPage;
