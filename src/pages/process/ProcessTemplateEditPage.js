// src/pages/process/ProcessTemplateEditPage.js
// 流程管理 / SOP 规范中心 - 新建 / 编辑流程模板页（Mock 数据）
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft, Save, Send, Eye, Plus, Trash2, ArrowUp, ArrowDown, FileText,
  Clock, CheckCircle2, AlertCircle, Info, Layers, Bookmark, CheckSquare,
  HelpCircle, Package, FolderOpen, Upload, X, ChevronRight, GripVertical
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import cn from '../../utils/cn';

// -------------------- Mock 编辑数据（编辑态回显） --------------------
const editMockData = {
  id: 't1',
  code: 'SOP-CG-001',
  name: '采购下单标准流程',
  category: 'procurement',
  version: 'V3.2',
  status: 'published',
  tags: ['高频', '入门必读'],
  scope: '适用于所有生产物料、辅料、办公用品及固定资产的采购下单。',
  goal: '规范采购下单行为，确保需求准确传递、价格受控、交付可追踪，降低采购风险。',
  summary: '覆盖从需求提出到订单确认的全链路，含紧急采购绿色通道说明。',
  overview: {
    description: '本流程定义了企业内部采购需求从提出到订单确认的全链路操作规范，确保采购行为合规、价格受控、交付可追踪。',
    trigger: '库存低于安全库存、MRP 运算产生需求、部门零星采购申请、紧急生产补料。',
    audience: '采购专员、采购主管、需求部门负责人、财务对账人员。',
    systems: 'ERP 采购模块、OA 审批系统、供应商门户、企业微信。',
    note: '紧急采购需提前在 OA 中走《紧急采购特批单》，否则财务有权拒绝对账。',
  },
  preparation: {
    materials: ['采购申请单（PR）', '供应商报价单', '年度框架协议', '物料编码清单', '预算科目余额确认'],
    prerequisites: ['供应商已准入并完成年度评审', '物料编码已在 ERP 生效', '预算余额充足'],
    permissions: ['ERP 采购模块下单权限', '供应商门户账号', 'OA 审批流发起权限'],
    roles: ['采购专员（执行下单）', '采购主管（审核超阈值订单）', '需求部门（确认规格与交期）'],
    notes: '紧急采购需提前在 OA 中走《紧急采购特批单》，否则财务有权拒绝对账。',
  },
  steps: [
    {
      id: 's1', stepNo: 1, title: '接收并审核采购申请（PR）',
      content: '采购专员每日定时查收 ERP 中自动抛转的 PR 单，核对物料编码、数量、需求日期及预算科目。',
      role: '采购专员', input: 'ERP 采购申请单', output: '已确认 PR 清单',
      keyPoints: ['检查物料编码是否有效', '确认需求日期是否合理（一般需 ≥ 7 天）', '核对预算余额'],
      riskHint: '若 PR 信息不完整，需当日退回需求部门补充，避免影响 MRP 运算。',
    },
    {
      id: 's2', stepNo: 2, title: '询比价与供应商选择',
      content: '根据物料类别，优先在年度框架协议供应商中询比价；无协议物料需至少邀请 3 家供应商报价。',
      role: '采购专员 / 采购主管', input: '供应商报价单、年度协议价目表', output: '比价记录表、选定供应商',
      keyPoints: ['优先使用年度协议价', '新供应商需完成准入评估', '大额采购需采购主管复核签字'],
      riskHint: '禁止未经审批私自切换核心供应商，违者按《采购廉洁制度》处理。',
    },
    {
      id: 's3', stepNo: 3, title: '生成采购订单（PO）',
      content: '在 ERP 中依据确认后的 PR 生成正式 PO，填写单价、税率、交货日期、付款条款及收货地址。',
      role: '采购专员', input: '已确认 PR + 选定供应商', output: 'ERP 正式采购订单',
      keyPoints: ['单价须与报价/协议价一致', '交货日期须满足需求日期', '付款条款须符合财务政策'],
      riskHint: 'PO 一经发送供应商即视为要约，发送前务必复核金额与条款。',
    },
    {
      id: 's4', stepNo: 4, title: '订单审批',
      content: '系统根据订单金额自动匹配审批流。',
      role: '采购主管 / 财务经理 / 总经理', input: 'ERP 采购订单', output: '已审批 PO',
      keyPoints: ['审批时效要求：采购主管 ≤ 4h', '超预算订单须附预算调整说明'],
      riskHint: '审批超时将触发系统自动催办，连续 2 次超时纳入部门考核。',
    },
    {
      id: 's5', stepNo: 5, title: '发送订单并确认回签',
      content: '审批通过后，采购专员通过供应商门户或邮件发送正式 PO，并要求供应商在 24h 内书面确认交期。',
      role: '采购专员', input: '已审批 PO', output: '供应商签回 PO / 邮件确认函',
      keyPoints: ['发送后需在 ERP 中记录发送时间', '供应商逾期未回签需电话催促并记录'],
      riskHint: '口头确认无效，必须以书面（邮件/系统回签）为准，避免交付纠纷。',
    },
    {
      id: 's6', stepNo: 6, title: '交期跟踪与到货协调',
      content: '采购专员每周更新《采购跟踪表》，对临近交期 3 天未发货的订单进行预警，并协调仓储做好收货准备。',
      role: '采购专员 / 仓储收货员', input: '签回 PO', output: '到货通知 / 采购跟踪表',
      keyPoints: ['每周一更新跟踪表', '提前 3 天通知仓储预计到货时间'],
      riskHint: '未及时跟踪导致缺料停线的，按《供应链绩效考核办法》追责。',
    },
    {
      id: 's7', stepNo: 7, title: '单据归档与闭环',
      content: '订单完成收货及对账后，采购专员将 PO、签回单、入库单、对账单按月整理归档，并在系统中关闭订单。',
      role: '采购专员 / 财务对账员', input: '入库单、对账单', output: '归档文件夹、已关闭 PO',
      keyPoints: ['归档时效：每月 10 日前完成上月归档', '系统关闭前须确认无未处理退货'],
      riskHint: '未按时归档将影响月度审计及供应商年度评价数据提取。',
    },
  ],
  checkpoints: [
    { id: 'c1', name: 'PR 信息完整性校验', desc: '物料编码、数量、需求日期、预算科目缺一不可。', standard: 'ERP 系统校验 + 人工复核', action: '退回需求部门补充。' },
    { id: 'c2', name: '供应商资质有效性检查', desc: '下单前确认供应商处于"合格"状态且未过协议有效期。', standard: '供应商门户状态为"已准入"', action: '暂停下单，启动供应商年度复评。' },
    { id: 'c3', name: '价格合规性检查', desc: '下单单价不得高于年度协议价或最新有效报价。', standard: '系统价目表比对', action: '重新询比价或走价格特批。' },
  ],
  exceptions: [
    { id: 'e1', scene: '供应商报价显著高于市场价', handle: '扩大询价范围至 5 家，并邀请成本部参与核价。', escalation: '报价差异 > 20% 时，报采购总监审批。', contact: '成本部 / 采购总监' },
    { id: 'e2', scene: '紧急采购需求（交期 < 3 天）', handle: '走《紧急采购特批单》，可先发口头订单，48h 内补全正式 PO。', escalation: '金额 > 5 万须总经理特批。', contact: '需求部门负责人 / 总经理' },
    { id: 'e3', scene: '供应商回签交期无法满足需求日期', handle: '协调替代供应商或调整生产计划，并评估缺料风险。', escalation: '可能影响生产排程时，升级至供应链 VP。', contact: '计划部 / 供应链 VP' },
  ],
  outputs: [
    { id: 'o1', name: '正式采购订单（PO）', desc: '经审批并发送供应商的正式订单。', recordWay: 'ERP 系统自动生成', archive: '按月归档' },
    { id: 'o2', name: '供应商签回确认函', desc: '供应商对交期、价格、数量的书面确认。', recordWay: '邮件/系统回签', archive: '随 PO 归档' },
    { id: 'o3', name: '采购跟踪表', desc: '记录订单状态、到货情况、异常处理过程的动态表格。', recordWay: '在线表格维护', archive: '季度汇总' },
  ],
  attachments: [
    { id: 'a1', name: '采购下单操作手册（PDF）', type: 'pdf', size: '2.4 MB', url: '#' },
    { id: 'a2', name: '采购申请单（PR）模板', type: 'form', size: '156 KB', url: '#' },
    { id: 'a3', name: '紧急采购特批单模板', type: 'form', size: '120 KB', url: '#' },
  ],
};

// -------------------- 常量 --------------------
const categoryOptions = [
  { key: 'procurement', label: '采购管理' },
  { key: 'warehouse', label: '仓储管理' },
  { key: 'quality', label: '质量管理' },
  { key: 'design', label: '设计管理' },
  { key: 'complaint', label: '客诉处理' },
  { key: 'finance', label: '财务管理' },
  { key: 'hr', label: '人事行政' },
  { key: 'general', label: '通用规范' },
];

const tagOptions = ['高频', '新版', '重点', '入门必读'];

const attachmentTypeOptions = ['pdf', 'xlsx', 'form', 'docx', 'image', 'video'];

// -------------------- 辅助组件 --------------------
const SectionTitle = ({ icon: Icon, children, action }) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-2">
      {Icon && <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center">
        <Icon className="w-4 h-4 text-brand-600" />
      </div>}
      <h2 className="text-base font-bold text-text">{children}</h2>
    </div>
    {action}
  </div>
);

const StatusBadge = ({ status }) => {
  if (status === 'published') return <Badge tone="success">已发布</Badge>;
  if (status === 'draft') return <Badge tone="warning">草稿</Badge>;
  if (status === 'disabled') return <Badge tone="danger">已停用</Badge>;
  return <Badge tone="neutral">未知</Badge>;
};

const Label = ({ children, required }) => (
  <label className="block text-sm font-medium text-text mb-1.5">
    {children}
    {required && <span className="text-danger-500 ml-0.5">*</span>}
  </label>
);

// -------------------- 主页面 --------------------
export default function ProcessTemplateEditPage({ isEdit = true, onNavigate }) {
  // 编辑态初始化数据，新建态用空对象
  const initialData = isEdit ? editMockData : null;

  // 基础信息
  const [name, setName] = useState(initialData?.name || '');
  const [code, setCode] = useState(initialData?.code || '');
  const [category, setCategory] = useState(initialData?.category || 'procurement');
  const [tags, setTags] = useState(initialData?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [scope, setScope] = useState(initialData?.scope || '');
  const [goal, setGoal] = useState(initialData?.goal || '');
  const [summary, setSummary] = useState(initialData?.summary || '');
  const [status, setStatus] = useState(initialData?.status || 'draft');

  // 章节内容
  const [overview, setOverview] = useState(initialData?.overview || {
    description: '', trigger: '', audience: '', systems: '', note: ''
  });
  const [preparation, setPreparation] = useState(initialData?.preparation || {
    materials: [], prerequisites: [], permissions: [], roles: [], notes: ''
  });
  const [steps, setSteps] = useState(initialData?.steps || []);
  const [checkpoints, setCheckpoints] = useState(initialData?.checkpoints || []);
  const [exceptions, setExceptions] = useState(initialData?.exceptions || []);
  const [outputs, setOutputs] = useState(initialData?.outputs || []);
  const [attachments, setAttachments] = useState(initialData?.attachments || []);

  // UI 状态
  const [lastSaved, setLastSaved] = useState('尚未保存');
  const [errors, setErrors] = useState({});
  const [activeSection, setActiveSection] = useState('basic');
  const sectionRefs = useRef({});

  const handleNav = (path, nameLabel) => {
    if (onNavigate) onNavigate(path, nameLabel || '流程管理');
  };

  // 滚动监听高亮
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { root: null, rootMargin: '-15% 0px -55% 0px', threshold: 0 }
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id) => {
    const el = sectionRefs.current[id];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // 标签输入
  const addTag = (t) => {
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput('');
  };
  const removeTag = (t) => setTags(tags.filter((x) => x !== t));

  // 通用数组字段增删改
  const updateArrayItem = (list, setList, id, field, value) => {
    setList(list.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };
  const removeArrayItem = (list, setList, id) => setList(list.filter((item) => item.id !== id));
  const addArrayItem = (list, setList, emptyItem) => setList([...list, { ...emptyItem, id: Date.now().toString() }]);
  const moveArrayItem = (list, setList, index, direction) => {
    const newList = [...list];
    const target = index + direction;
    if (target < 0 || target >= newList.length) return;
    [newList[index], newList[target]] = [newList[target], newList[index]];
    setList(newList);
  };

  // 步骤重排序号
  const reorderSteps = (list) => list.map((s, idx) => ({ ...s, stepNo: idx + 1 }));

  const handleSaveDraft = () => {
    setErrors({});
    const newErrors = {};
    if (!name.trim()) newErrors.name = '请输入流程名称';
    if (!code.trim()) newErrors.code = '请输入流程编号';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLastSaved(new Date().toLocaleString());
    // eslint-disable-next-line no-console
    console.log('保存草稿', { name, code, category, tags, scope, goal, summary, status, overview, preparation, steps, checkpoints, exceptions, outputs, attachments });
  };

  const handlePublish = () => {
    handleSaveDraft();
    // eslint-disable-next-line no-console
    console.log('发布流程');
  };

  // 计算完成度
  const completion = useMemo(() => {
    const sections = [
      name && code && category,
      overview.description && overview.trigger,
      preparation.materials.length > 0,
      steps.length >= 1,
      checkpoints.length >= 1,
      exceptions.length >= 1,
      outputs.length >= 1,
    ];
    return Math.round((sections.filter(Boolean).length / sections.length) * 100);
  }, [name, code, category, overview, preparation, steps, checkpoints, exceptions, outputs]);

  // 准备事项 - 子列表增删
  const PrepSubList = ({ label, list, onChange }) => (
    <div className="mb-4">
      <p className="text-sm text-text-subtle mb-2">{label}</p>
      <div className="space-y-2">
        {list.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => {
                const newList = [...list];
                newList[idx] = e.target.value;
                onChange(newList);
              }}
              className="ui-input flex-1"
              placeholder={`请输入${label}`}
            />
            <button
              onClick={() => onChange(list.filter((_, i) => i !== idx))}
              className="p-2 rounded-lg text-text-subtle hover:text-danger-600 hover:bg-danger-50"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        <Button variant="ghost" size="sm" icon={Plus} onClick={() => onChange([...list, ''])}>
          添加条目
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-full pb-10">
      <div className="max-w-[1600px] mx-auto">
        {/* 1. 顶部操作区 */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-sm text-text-subtle mb-1">
              <span className="cursor-pointer hover:text-brand-700" onClick={() => handleNav('/process/overview', '流程概览')}>流程管理中心</span>
              <ChevronRight className="w-4 h-4" />
              <span className="cursor-pointer hover:text-brand-700" onClick={() => handleNav('/process/templates', '流程模板列表')}>流程模板列表</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-text">{isEdit ? '编辑流程模板' : '新建流程模板'}</span>
            </div>
            <h1 className="ui-page-title">{isEdit ? '编辑流程模板' : '新建流程模板'}</h1>
            <p className="mt-1 text-sm text-text-muted">维护企业内部 SOP 流程模板与规范手册内容</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" size="md" icon={ArrowLeft} onClick={() => handleNav('/process/templates', '流程模板列表')}>
              返回列表
            </Button>
            <Button variant="ghost" size="md" icon={Eye} onClick={() => { /* 预览占位 */ }}>
              预览
            </Button>
            <Button variant="secondary" size="md" icon={Save} onClick={handleSaveDraft}>
              保存草稿
            </Button>
            <Button size="md" icon={Send} onClick={handlePublish}>
              发布
            </Button>
          </div>
        </div>

        {/* 主体：左侧编辑 + 右侧辅助 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 左侧编辑主区域 */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-5">
            {/* 2. 基础信息编辑区 */}
            <section id="basic" ref={(el) => (sectionRefs.current.basic = el)} className="scroll-mt-6">
              <Card padding="lg">
                <SectionTitle icon={Info}>基础信息</SectionTitle>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-1">
                    <Label required>流程名称</Label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={cn('ui-input', errors.name && 'border-danger-500')} placeholder="请输入流程名称" />
                    {errors.name && <p className="text-xs text-danger-600 mt-1">{errors.name}</p>}
                  </div>
                  <div className="md:col-span-1">
                    <Label required>流程编号</Label>
                    <input type="text" value={code} onChange={(e) => setCode(e.target.value)} className={cn('ui-input', errors.code && 'border-danger-500')} placeholder="如：SOP-CG-001" />
                    {errors.code && <p className="text-xs text-danger-600 mt-1">{errors.code}</p>}
                  </div>
                  <div className="md:col-span-1">
                    <Label required>所属业务口</Label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="ui-select">
                      {categoryOptions.map((c) => (
                        <option key={c.key} value={c.key}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-1">
                    <Label>状态</Label>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} className="ui-select">
                      <option value="draft">草稿</option>
                      <option value="published">已发布</option>
                      <option value="disabled">已停用</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <Label>标签</Label>
                    <div className="flex flex-wrap items-center gap-2 p-2 rounded-xl border border-border bg-white min-h-[42px]">
                      {tags.map((t) => (
                        <span key={t} className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-brand-50 text-brand-700 text-xs border border-brand-100">
                          {t}
                          <button onClick={() => removeTag(t)} className="hover:text-brand-900"><X className="w-3 h-3" /></button>
                        </span>
                      ))}
                      <select
                        value={tagInput}
                        onChange={(e) => { addTag(e.target.value); }}
                        className="text-sm bg-transparent outline-none text-text-subtle"
                      >
                        <option value="">+ 添加标签</option>
                        {tagOptions.filter((t) => !tags.includes(t)).map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <Label>流程目标</Label>
                    <textarea value={goal} onChange={(e) => setGoal(e.target.value)} rows={2} className="ui-textarea" placeholder="简述本流程的核心目标与预期效果" />
                  </div>
                  <div className="md:col-span-2">
                    <Label>适用范围</Label>
                    <textarea value={scope} onChange={(e) => setScope(e.target.value)} rows={2} className="ui-textarea" placeholder="描述本流程适用的业务场景、部门或对象" />
                  </div>
                  <div className="md:col-span-2">
                    <Label>流程摘要</Label>
                    <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} className="ui-textarea" placeholder="用 1~3 句话概括本流程的主要内容与价值" />
                  </div>
                  <div className="md:col-span-1">
                    <Label>当前版本</Label>
                    <input type="text" value={isEdit ? initialData?.version : '系统发布时自动生成'} disabled className="ui-input disabled:bg-surface-subtle disabled:text-text-subtle" />
                  </div>
                </div>
              </Card>
            </section>

            {/* 3.1 流程概述 */}
            <section id="overview" ref={(el) => (sectionRefs.current.overview = el)} className="scroll-mt-6">
              <Card padding="lg">
                <SectionTitle icon={Info}>流程概述</SectionTitle>
                <div className="space-y-4">
                  <div>
                    <Label>流程说明</Label>
                    <textarea value={overview.description} onChange={(e) => setOverview({ ...overview, description: e.target.value })} rows={3} className="ui-textarea" placeholder="描述本流程的整体逻辑与价值" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>触发条件</Label>
                      <textarea value={overview.trigger} onChange={(e) => setOverview({ ...overview, trigger: e.target.value })} rows={2} className="ui-textarea" placeholder="什么情况下需要启动本流程" />
                    </div>
                    <div>
                      <Label>适用对象</Label>
                      <textarea value={overview.audience} onChange={(e) => setOverview({ ...overview, audience: e.target.value })} rows={2} className="ui-textarea" placeholder="本流程的主要执行者与协作方" />
                    </div>
                    <div>
                      <Label>涉及系统 / 工具</Label>
                      <textarea value={overview.systems} onChange={(e) => setOverview({ ...overview, systems: e.target.value })} rows={2} className="ui-textarea" placeholder="执行本流程需要用到的系统或工具" />
                    </div>
                    <div>
                      <Label>补充说明</Label>
                      <textarea value={overview.note} onChange={(e) => setOverview({ ...overview, note: e.target.value })} rows={2} className="ui-textarea" placeholder="补充注意事项或特殊说明" />
                    </div>
                  </div>
                </div>
              </Card>
            </section>

            {/* 3.2 准备事项 */}
            <section id="preparation" ref={(el) => (sectionRefs.current.preparation = el)} className="scroll-mt-6">
              <Card padding="lg">
                <SectionTitle icon={Bookmark}>准备事项</SectionTitle>
                <div className="grid md:grid-cols-2 gap-4">
                  <PrepSubList label="所需资料" list={preparation.materials} onChange={(v) => setPreparation({ ...preparation, materials: v })} />
                  <PrepSubList label="前置条件" list={preparation.prerequisites} onChange={(v) => setPreparation({ ...preparation, prerequisites: v })} />
                  <PrepSubList label="权限要求" list={preparation.permissions} onChange={(v) => setPreparation({ ...preparation, permissions: v })} />
                  <PrepSubList label="涉及岗位" list={preparation.roles} onChange={(v) => setPreparation({ ...preparation, roles: v })} />
                  <div className="md:col-span-2">
                    <Label>注意事项</Label>
                    <textarea value={preparation.notes} onChange={(e) => setPreparation({ ...preparation, notes: e.target.value })} rows={3} className="ui-textarea" placeholder="执行前需特别注意的事项" />
                  </div>
                </div>
              </Card>
            </section>

            {/* 3.3 执行步骤 */}
            <section id="steps" ref={(el) => (sectionRefs.current.steps = el)} className="scroll-mt-6">
              <Card padding="lg">
                <SectionTitle
                  icon={Layers}
                  action={
                    <Button size="sm" icon={Plus} onClick={() => {
                      const newStep = {
                        id: Date.now().toString(),
                        stepNo: steps.length + 1,
                        title: '',
                        content: '',
                        role: '',
                        input: '',
                        output: '',
                        keyPoints: [],
                        riskHint: '',
                      };
                      setSteps(reorderSteps([...steps, newStep]));
                    }}>
                      新增步骤
                    </Button>
                  }
                >
                  执行步骤
                </SectionTitle>
                <div className="space-y-4">
                  {steps.map((step, idx) => (
                    <div key={step.id} className="relative p-4 rounded-xl border border-border bg-surface hover:border-brand-200 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-brand-600 text-white text-sm font-bold flex items-center justify-center">
                          {step.stepNo}
                        </div>
                        <div className="flex-1 min-w-0 space-y-3">
                          <div className="grid md:grid-cols-2 gap-3">
                            <input
                              type="text"
                              value={step.title}
                              onChange={(e) => updateArrayItem(steps, (list) => setSteps(reorderSteps(list)), step.id, 'title', e.target.value)}
                              className="ui-input md:col-span-2"
                              placeholder="步骤标题"
                            />
                            <textarea
                              value={step.content}
                              onChange={(e) => updateArrayItem(steps, (list) => setSteps(reorderSteps(list)), step.id, 'content', e.target.value)}
                              rows={2}
                              className="ui-textarea md:col-span-2"
                              placeholder="步骤说明"
                            />
                            <input
                              type="text"
                              value={step.role}
                              onChange={(e) => updateArrayItem(steps, (list) => setSteps(reorderSteps(list)), step.id, 'role', e.target.value)}
                              className="ui-input"
                              placeholder="责任岗位 / 责任人"
                            />
                            <input
                              type="text"
                              value={step.input}
                              onChange={(e) => updateArrayItem(steps, (list) => setSteps(reorderSteps(list)), step.id, 'input', e.target.value)}
                              className="ui-input"
                              placeholder="输入内容"
                            />
                            <input
                              type="text"
                              value={step.output}
                              onChange={(e) => updateArrayItem(steps, (list) => setSteps(reorderSteps(list)), step.id, 'output', e.target.value)}
                              className="ui-input"
                              placeholder="输出结果"
                            />
                            <input
                              type="text"
                              value={step.riskHint}
                              onChange={(e) => updateArrayItem(steps, (list) => setSteps(reorderSteps(list)), step.id, 'riskHint', e.target.value)}
                              className="ui-input"
                              placeholder="风险提示"
                            />
                          </div>
                          <div>
                            <p className="text-xs text-text-subtle mb-2">操作要点</p>
                            <div className="space-y-2">
                              {step.keyPoints.map((kp, kidx) => (
                                <div key={kidx} className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={kp}
                                    onChange={(e) => {
                                      const newPoints = [...step.keyPoints];
                                      newPoints[kidx] = e.target.value;
                                      updateArrayItem(steps, (list) => setSteps(reorderSteps(list)), step.id, 'keyPoints', newPoints);
                                    }}
                                    className="ui-input flex-1"
                                    placeholder="操作要点"
                                  />
                                  <button
                                    onClick={() => {
                                      const newPoints = step.keyPoints.filter((_, i) => i !== kidx);
                                      updateArrayItem(steps, (list) => setSteps(reorderSteps(list)), step.id, 'keyPoints', newPoints);
                                    }}
                                    className="p-2 rounded-lg text-text-subtle hover:text-danger-600 hover:bg-danger-50"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                              <Button
                                variant="ghost"
                                size="sm"
                                icon={Plus}
                                onClick={() => updateArrayItem(steps, (list) => setSteps(reorderSteps(list)), step.id, 'keyPoints', [...step.keyPoints, ''])}
                              >
                                添加要点
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => moveArrayItem(steps, (list) => setSteps(reorderSteps(list)), idx, -1)}
                            disabled={idx === 0}
                            className="p-1.5 rounded-lg text-text-subtle hover:bg-surface-subtle disabled:opacity-30"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => moveArrayItem(steps, (list) => setSteps(reorderSteps(list)), idx, 1)}
                            disabled={idx === steps.length - 1}
                            className="p-1.5 rounded-lg text-text-subtle hover:bg-surface-subtle disabled:opacity-30"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setSteps(reorderSteps(steps.filter((s) => s.id !== step.id)))}
                            className="p-1.5 rounded-lg text-text-subtle hover:text-danger-600 hover:bg-danger-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {steps.length === 0 && (
                    <div className="text-center py-8 text-text-muted border border-dashed border-border rounded-xl">
                      <Layers className="w-10 h-10 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">暂无执行步骤，点击右上角添加</p>
                    </div>
                  )}
                </div>
              </Card>
            </section>

            {/* 3.4 检查点 */}
            <section id="checkpoints" ref={(el) => (sectionRefs.current.checkpoints = el)} className="scroll-mt-6">
              <Card padding="lg">
                <SectionTitle
                  icon={CheckSquare}
                  action={
                    <Button size="sm" icon={Plus} onClick={() => addArrayItem(checkpoints, setCheckpoints, { name: '', desc: '', standard: '', action: '' })}>
                      新增检查点
                    </Button>
                  }
                >
                  检查点
                </SectionTitle>
                <div className="space-y-3">
                  {checkpoints.map((cp) => (
                    <div key={cp.id} className="p-4 rounded-xl border border-border hover:border-brand-200 transition-colors">
                      <div className="grid md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={cp.name}
                          onChange={(e) => updateArrayItem(checkpoints, setCheckpoints, cp.id, 'name', e.target.value)}
                          className="ui-input md:col-span-2"
                          placeholder="检查项名称"
                        />
                        <textarea
                          value={cp.desc}
                          onChange={(e) => updateArrayItem(checkpoints, setCheckpoints, cp.id, 'desc', e.target.value)}
                          rows={2}
                          className="ui-textarea"
                          placeholder="检查说明"
                        />
                        <textarea
                          value={cp.standard}
                          onChange={(e) => updateArrayItem(checkpoints, setCheckpoints, cp.id, 'standard', e.target.value)}
                          rows={2}
                          className="ui-textarea"
                          placeholder="检查标准"
                        />
                        <textarea
                          value={cp.action}
                          onChange={(e) => updateArrayItem(checkpoints, setCheckpoints, cp.id, 'action', e.target.value)}
                          rows={2}
                          className="ui-textarea md:col-span-2"
                          placeholder="不通过处理建议"
                        />
                      </div>
                      <div className="flex justify-end mt-3">
                        <Button variant="ghost" size="sm" icon={Trash2} onClick={() => removeArrayItem(checkpoints, setCheckpoints, cp.id)}>
                          删除
                        </Button>
                      </div>
                    </div>
                  ))}
                  {checkpoints.length === 0 && (
                    <div className="text-center py-8 text-text-muted border border-dashed border-border rounded-xl">
                      <CheckSquare className="w-10 h-10 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">暂无检查点</p>
                    </div>
                  )}
                </div>
              </Card>
            </section>

            {/* 3.5 异常处理 */}
            <section id="exceptions" ref={(el) => (sectionRefs.current.exceptions = el)} className="scroll-mt-6">
              <Card padding="lg">
                <SectionTitle
                  icon={HelpCircle}
                  action={
                    <Button size="sm" icon={Plus} onClick={() => addArrayItem(exceptions, setExceptions, { scene: '', handle: '', escalation: '', contact: '' })}>
                      新增异常项
                    </Button>
                  }
                >
                  异常处理
                </SectionTitle>
                <div className="space-y-3">
                  {exceptions.map((ex) => (
                    <div key={ex.id} className="p-4 rounded-xl bg-surface-subtle">
                      <div className="grid md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={ex.scene}
                          onChange={(e) => updateArrayItem(exceptions, setExceptions, ex.id, 'scene', e.target.value)}
                          className="ui-input md:col-span-2"
                          placeholder="异常场景"
                        />
                        <textarea
                          value={ex.handle}
                          onChange={(e) => updateArrayItem(exceptions, setExceptions, ex.id, 'handle', e.target.value)}
                          rows={2}
                          className="ui-textarea"
                          placeholder="处理方式"
                        />
                        <textarea
                          value={ex.escalation}
                          onChange={(e) => updateArrayItem(exceptions, setExceptions, ex.id, 'escalation', e.target.value)}
                          rows={2}
                          className="ui-textarea"
                          placeholder="升级路径"
                        />
                        <input
                          type="text"
                          value={ex.contact}
                          onChange={(e) => updateArrayItem(exceptions, setExceptions, ex.id, 'contact', e.target.value)}
                          className="ui-input md:col-span-2"
                          placeholder="协作部门 / 联系对象"
                        />
                      </div>
                      <div className="flex justify-end mt-3">
                        <Button variant="ghost" size="sm" icon={Trash2} onClick={() => removeArrayItem(exceptions, setExceptions, ex.id)}>
                          删除
                        </Button>
                      </div>
                    </div>
                  ))}
                  {exceptions.length === 0 && (
                    <div className="text-center py-8 text-text-muted border border-dashed border-border rounded-xl">
                      <HelpCircle className="w-10 h-10 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">暂无异常处理项</p>
                    </div>
                  )}
                </div>
              </Card>
            </section>

            {/* 3.6 输出结果 */}
            <section id="outputs" ref={(el) => (sectionRefs.current.outputs = el)} className="scroll-mt-6">
              <Card padding="lg">
                <SectionTitle
                  icon={Package}
                  action={
                    <Button size="sm" icon={Plus} onClick={() => addArrayItem(outputs, setOutputs, { name: '', desc: '', recordWay: '', archive: '' })}>
                      新增输出结果
                    </Button>
                  }
                >
                  输出结果
                </SectionTitle>
                <div className="space-y-3">
                  {outputs.map((out) => (
                    <div key={out.id} className="p-4 rounded-xl border border-border hover:border-brand-200 transition-colors">
                      <div className="grid md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={out.name}
                          onChange={(e) => updateArrayItem(outputs, setOutputs, out.id, 'name', e.target.value)}
                          className="ui-input md:col-span-2"
                          placeholder="输出名称"
                        />
                        <textarea
                          value={out.desc}
                          onChange={(e) => updateArrayItem(outputs, setOutputs, out.id, 'desc', e.target.value)}
                          rows={2}
                          className="ui-textarea md:col-span-2"
                          placeholder="输出说明"
                        />
                        <input
                          type="text"
                          value={out.recordWay}
                          onChange={(e) => updateArrayItem(outputs, setOutputs, out.id, 'recordWay', e.target.value)}
                          className="ui-input"
                          placeholder="记录方式"
                        />
                        <input
                          type="text"
                          value={out.archive}
                          onChange={(e) => updateArrayItem(outputs, setOutputs, out.id, 'archive', e.target.value)}
                          className="ui-input"
                          placeholder="归档要求 / 通知对象"
                        />
                      </div>
                      <div className="flex justify-end mt-3">
                        <Button variant="ghost" size="sm" icon={Trash2} onClick={() => removeArrayItem(outputs, setOutputs, out.id)}>
                          删除
                        </Button>
                      </div>
                    </div>
                  ))}
                  {outputs.length === 0 && (
                    <div className="text-center py-8 text-text-muted border border-dashed border-border rounded-xl">
                      <Package className="w-10 h-10 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">暂无输出结果</p>
                    </div>
                  )}
                </div>
              </Card>
            </section>

            {/* 3.7 关联资料 */}
            <section id="attachments" ref={(el) => (sectionRefs.current.attachments = el)} className="scroll-mt-6">
              <Card padding="lg">
                <SectionTitle
                  icon={FolderOpen}
                  action={
                    <Button size="sm" icon={Plus} onClick={() => addArrayItem(attachments, setAttachments, { name: '', type: 'pdf', size: '', url: '' })}>
                      新增资料
                    </Button>
                  }
                >
                  关联资料
                </SectionTitle>
                <div className="space-y-3">
                  {attachments.map((att) => (
                    <div key={att.id} className="flex items-start gap-3 p-4 rounded-xl border border-border hover:border-brand-200 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-surface-subtle flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-text-subtle" />
                      </div>
                      <div className="flex-1 min-w-0 grid md:grid-cols-3 gap-3">
                        <input
                          type="text"
                          value={att.name}
                          onChange={(e) => updateArrayItem(attachments, setAttachments, att.id, 'name', e.target.value)}
                          className="ui-input md:col-span-1"
                          placeholder="资料名称"
                        />
                        <select
                          value={att.type}
                          onChange={(e) => updateArrayItem(attachments, setAttachments, att.id, 'type', e.target.value)}
                          className="ui-select md:col-span-1"
                        >
                          {attachmentTypeOptions.map((t) => (
                            <option key={t} value={t}>{t.toUpperCase()}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={att.size}
                          onChange={(e) => updateArrayItem(attachments, setAttachments, att.id, 'size', e.target.value)}
                          className="ui-input md:col-span-1"
                          placeholder="文件大小（如：2.4 MB）"
                        />
                      </div>
                      <button
                        onClick={() => removeArrayItem(attachments, setAttachments, att.id)}
                        className="p-2 rounded-lg text-text-subtle hover:text-danger-600 hover:bg-danger-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <Button variant="ghost" size="sm" icon={Upload} onClick={() => { /* 上传占位 */ }}>
                    上传附件（占位）
                  </Button>
                  {attachments.length === 0 && (
                    <div className="text-center py-6 text-text-muted border border-dashed border-border rounded-xl">
                      <FolderOpen className="w-10 h-10 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">暂无关联资料</p>
                    </div>
                  )}
                </div>
              </Card>
            </section>
          </div>

          {/* 右侧辅助区 */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="sticky top-6 space-y-4">
              <Card padding="md">
                <h3 className="text-sm font-semibold text-text mb-3">编辑导航</h3>
                <nav className="space-y-1">
                  {[
                    { id: 'basic', label: '基础信息' },
                    { id: 'overview', label: '流程概述' },
                    { id: 'preparation', label: '准备事项' },
                    { id: 'steps', label: '执行步骤' },
                    { id: 'checkpoints', label: '检查点' },
                    { id: 'exceptions', label: '异常处理' },
                    { id: 'outputs', label: '输出结果' },
                    { id: 'attachments', label: '关联资料' },
                  ].map((sec) => (
                    <button
                      key={sec.id}
                      onClick={() => scrollToSection(sec.id)}
                      className={cn(
                        'w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors text-left',
                        activeSection === sec.id
                          ? 'bg-brand-50 text-brand-700 font-medium'
                          : 'text-text-muted hover:bg-surface-subtle'
                      )}
                    >
                      <span>{sec.label}</span>
                      {activeSection === sec.id && <ChevronRight className="w-4 h-4" />}
                    </button>
                  ))}
                </nav>
              </Card>

              <Card padding="md">
                <h3 className="text-sm font-semibold text-text mb-3">模板摘要</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-text-subtle">流程编号</span>
                    <span className="text-text">{code || '-'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-subtle">业务口</span>
                    <span className="text-text">{categoryOptions.find((c) => c.key === category)?.label || '-'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-subtle">状态</span>
                    <StatusBadge status={status} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-subtle">执行步骤</span>
                    <span className="text-text">{steps.length} 步</span>
                  </div>
                </div>
              </Card>

              <Card padding="md">
                <h3 className="text-sm font-semibold text-text mb-3">内容完整度</h3>
                <div className="w-full h-2 bg-surface-subtle rounded-full overflow-hidden mb-2">
                  <div
                    className={cn('h-full rounded-full transition-all', completion >= 80 ? 'bg-success-500' : completion >= 50 ? 'bg-warning-500' : 'bg-brand-500')}
                    style={{ width: `${completion}%` }}
                  />
                </div>
                <p className="text-xs text-text-subtle">已完成 {completion}% · 建议补充剩余内容后再发布</p>
              </Card>

              <Card padding="md">
                <h3 className="text-sm font-semibold text-text mb-3">保存信息</h3>
                <div className="flex items-center gap-2 text-sm text-text-subtle mb-3">
                  <Clock className="w-4 h-4" />
                  <span>{lastSaved}</span>
                </div>
                <Button variant="secondary" size="sm" fullWidth icon={Save} onClick={handleSaveDraft}>
                  立即保存草稿
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
