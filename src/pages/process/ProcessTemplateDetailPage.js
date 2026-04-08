// src/pages/process/ProcessTemplateDetailPage.js
// 流程管理 / SOP 规范中心 - 流程模板详情页（Mock 数据）
import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft, FileEdit, History, MoreHorizontal, AlertCircle,
  FileText, Clock, Eye, Download, ChevronRight, Link2, Layers, User,
  Bookmark, CheckSquare, HelpCircle, Package, AlertTriangle, FileCheck,
  FolderOpen, Info
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import cn from '../../utils/cn';

// -------------------- Mock 数据：采购下单标准流程 --------------------
const templateData = {
  id: 't1',
  code: 'SOP-CG-001',
  name: '采购下单标准流程',
  category: '采购管理',
  categoryKey: 'procurement',
  version: 'V3.2',
  status: 'published',
  tags: ['高频', '入门必读'],
  summary: '覆盖从需求提出到订单确认的全链路，含紧急采购绿色通道说明。适用于所有生产物料、辅料及办公用品的常规采购场景。',
  updateTime: '2024-03-22 10:30',
  updater: '张伟',
  viewCount: 1240,
  usageCount: 856,
  overview: {
    goal: '规范采购下单行为，确保需求准确传递、价格受控、交付可追踪，降低采购风险。',
    scope: '适用于所有生产物料、辅料、办公用品及固定资产的采购下单。',
    trigger: '库存低于安全库存、MRP 运算产生需求、部门零星采购申请、紧急生产补料。',
    audience: '采购专员、采购主管、需求部门负责人、财务对账人员。',
    systems: 'ERP 采购模块、OA 审批系统、供应商门户、企业微信。',
  },
  preparationItems: {
    materials: ['采购申请单（PR）', '供应商报价单', '年度框架协议', '物料编码清单', '预算科目余额确认'],
    prerequisites: ['供应商已准入并完成年度评审', '物料编码已在 ERP 生效', '预算余额充足'],
    permissions: ['ERP 采购模块下单权限', '供应商门户账号', 'OA 审批流发起权限'],
    roles: ['采购专员（执行下单）', '采购主管（审核超阈值订单）', '需求部门（确认规格与交期）'],
    notes: '紧急采购需提前在 OA 中走《紧急采购特批单》，否则财务有权拒绝对账。',
  },
  steps: [
    {
      stepNo: 1,
      title: '接收并审核采购申请（PR）',
      content: '采购专员每日定时查收 ERP 中自动抛转的 PR 单，核对物料编码、数量、需求日期及预算科目。',
      role: '采购专员',
      input: 'ERP 采购申请单',
      output: '已确认 PR 清单',
      keyPoints: ['检查物料编码是否有效', '确认需求日期是否合理（一般需 ≥ 7 天）', '核对预算余额'],
      riskHint: '若 PR 信息不完整，需当日退回需求部门补充，避免影响 MRP 运算。',
    },
    {
      stepNo: 2,
      title: '询比价与供应商选择',
      content: '根据物料类别，优先在年度框架协议供应商中询比价；无协议物料需至少邀请 3 家供应商报价。',
      role: '采购专员 / 采购主管',
      input: '供应商报价单、年度协议价目表',
      output: '比价记录表、选定供应商',
      keyPoints: ['优先使用年度协议价', '新供应商需完成准入评估', '大额采购需采购主管复核签字'],
      riskHint: '禁止未经审批私自切换核心供应商，违者按《采购廉洁制度》处理。',
    },
    {
      stepNo: 3,
      title: '生成采购订单（PO）',
      content: '在 ERP 中依据确认后的 PR 生成正式 PO，填写单价、税率、交货日期、付款条款及收货地址。',
      role: '采购专员',
      input: '已确认 PR + 选定供应商',
      output: 'ERP 正式采购订单',
      keyPoints: ['单价须与报价/协议价一致', '交货日期须满足需求日期', '付款条款须符合财务政策'],
      riskHint: 'PO 一经发送供应商即视为要约，发送前务必复核金额与条款。',
    },
    {
      stepNo: 4,
      title: '订单审批',
      content: '系统根据订单金额自动匹配审批流：单笔 ≤ 5 万由采购主管审批；5~20 万需财务经理会签；≥ 20 万需总经理审批。',
      role: '采购主管 / 财务经理 / 总经理',
      input: 'ERP 采购订单',
      output: '已审批 PO',
      keyPoints: ['审批时效要求：采购主管 ≤ 4h，财务经理 ≤ 8h，总经理 ≤ 24h', '超预算订单须附预算调整说明'],
      riskHint: '审批超时将触发系统自动催办，连续 2 次超时纳入部门考核。',
    },
    {
      stepNo: 5,
      title: '发送订单并确认回签',
      content: '审批通过后，采购专员通过供应商门户或邮件发送正式 PO，并要求供应商在 24h 内书面确认交期。',
      role: '采购专员',
      input: '已审批 PO',
      output: '供应商签回 PO / 邮件确认函',
      keyPoints: ['发送后需在 ERP 中记录发送时间', '供应商逾期未回签需电话催促并记录', '交期变更须重新审批'],
      riskHint: '口头确认无效，必须以书面（邮件/系统回签）为准，避免交付纠纷。',
    },
    {
      stepNo: 6,
      title: '交期跟踪与到货协调',
      content: '采购专员每周更新《采购跟踪表》，对临近交期 3 天未发货的订单进行预警，并协调仓储做好收货准备。',
      role: '采购专员 / 仓储收货员',
      input: '签回 PO',
      output: '到货通知 / 采购跟踪表',
      keyPoints: ['每周一更新跟踪表', '提前 3 天通知仓储预计到货时间', '异常交期当日升级至采购主管'],
      riskHint: '未及时跟踪导致缺料停线的，按《供应链绩效考核办法》追责。',
    },
    {
      stepNo: 7,
      title: '单据归档与闭环',
      content: '订单完成收货及对账后，采购专员将 PO、签回单、入库单、对账单按月整理归档，并在系统中关闭订单。',
      role: '采购专员 / 财务对账员',
      input: '入库单、对账单',
      output: '归档文件夹、已关闭 PO',
      keyPoints: ['归档时效：每月 10 日前完成上月归档', '系统关闭前须确认无未处理退货', '档案保存期限 ≥ 3 年'],
      riskHint: '未按时归档将影响月度审计及供应商年度评价数据提取。',
    },
  ],
  checkpoints: [
    { name: 'PR 信息完整性校验', desc: '物料编码、数量、需求日期、预算科目缺一不可。', standard: 'ERP 系统校验 + 人工复核', action: '退回需求部门补充。' },
    { name: '供应商资质有效性检查', desc: '下单前确认供应商处于"合格"状态且未过协议有效期。', standard: '供应商门户状态为"已准入"', action: '暂停下单，启动供应商年度复评。' },
    { name: '价格合规性检查', desc: '下单单价不得高于年度协议价或最新有效报价。', standard: '系统价目表比对', action: '重新询比价或走价格特批。' },
    { name: '订单审批完整性检查', desc: '超阈值订单须完成对应层级审批。', standard: 'ERP 审批流状态为"已通过"', action: '禁止发送供应商，补全审批。' },
  ],
  exceptions: [
    { scene: '供应商报价显著高于市场价', handle: '扩大询价范围至 5 家，并邀请成本部参与核价。', escalation: '报价差异 > 20% 时，报采购总监审批。', contact: '成本部 / 采购总监' },
    { scene: '紧急采购需求（交期 < 3 天）', handle: '走《紧急采购特批单》，可先发口头订单，48h 内补全正式 PO。', escalation: '金额 > 5 万须总经理特批。', contact: '需求部门负责人 / 总经理' },
    { scene: '供应商回签交期无法满足需求日期', handle: '协调替代供应商或调整生产计划，并评估缺料风险。', escalation: '可能影响生产排程时，升级至供应链 VP。', contact: '计划部 / 供应链 VP' },
  ],
  outputs: [
    { name: '正式采购订单（PO）', desc: '经审批并发送供应商的正式订单。' },
    { name: '供应商签回确认函', desc: '供应商对交期、价格、数量的书面确认。' },
    { name: '采购跟踪表', desc: '记录订单状态、到货情况、异常处理过程的动态表格。' },
    { name: '月度采购归档资料', desc: '包含 PO、入库单、对账单、发票的完整档案袋。' },
  ],
  attachments: [
    { id: 'a1', name: '采购下单操作手册（PDF）', type: 'pdf', size: '2.4 MB', updateTime: '2024-03-20', url: '#' },
    { id: 'a2', name: '采购申请单（PR）模板', type: 'form', size: '156 KB', updateTime: '2024-03-15', url: '#' },
    { id: 'a3', name: '年度供应商名录（Q1）', type: 'xlsx', size: '890 KB', updateTime: '2024-03-10', url: '#' },
    { id: 'a4', name: '紧急采购特批单模板', type: 'form', size: '120 KB', updateTime: '2024-03-18', url: '#' },
  ],
  relatedTemplates: [
    { id: 't2', name: '供应商准入评估流程', category: '采购管理' },
    { id: 't14', name: '询比价与核价管理流程', category: '采购管理' },
    { id: 't4', name: '仓库异常出入库处理流程', category: '仓储管理' },
    { id: 't8', name: '费用报销资料提报规范', category: '财务管理' },
  ],
  versionHistory: [
    { version: 'V3.2', date: '2024-03-22', note: '增加小额采购直批路径，缩短审批层级' },
    { version: 'V3.1', date: '2024-02-10', note: '优化紧急采购特批说明' },
    { version: 'V3.0', date: '2023-11-05', note: '新增供应商门户回签要求' },
    { version: 'V2.5', date: '2023-06-20', note: '调整审批阈值（5万/20万）' },
  ],
};

// -------------------- 辅助组件 --------------------
const StatusBadge = ({ status }) => {
  if (status === 'published') return <Badge tone="success">已发布</Badge>;
  if (status === 'draft') return <Badge tone="warning">草稿</Badge>;
  if (status === 'disabled') return <Badge tone="danger">已停用</Badge>;
  return <Badge tone="neutral">未知</Badge>;
};

const SectionTitle = ({ icon: Icon, children }) => (
  <div className="flex items-center gap-2 mb-4">
    {Icon && <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center">
      <Icon className="w-4 h-4 text-brand-600" />
    </div>}
    <h2 className="text-lg font-bold text-text">{children}</h2>
  </div>
);

const FileIcon = ({ type }) => {
  if (type === 'pdf') return <FileText className="w-5 h-5 text-red-500" />;
  if (type === 'xlsx') return <FileText className="w-5 h-5 text-emerald-500" />;
  if (type === 'form') return <FileCheck className="w-5 h-5 text-sky-500" />;
  return <FileText className="w-5 h-5 text-text-muted" />;
};

// -------------------- 目录配置 --------------------
const sections = [
  { id: 'overview', label: '流程概述', icon: Info },
  { id: 'preparation', label: '准备事项', icon: Bookmark },
  { id: 'steps', label: '执行步骤', icon: Layers },
  { id: 'checkpoints', label: '检查点', icon: CheckSquare },
  { id: 'exceptions', label: '异常处理', icon: HelpCircle },
  { id: 'outputs', label: '输出结果', icon: Package },
  { id: 'attachments', label: '关联资料', icon: FolderOpen },
];

// -------------------- 主页面 --------------------
export default function ProcessTemplateDetailPage({ onNavigate }) {
  const [activeSection, setActiveSection] = useState('overview');
  const contentRef = useRef(null);
  const sectionRefs = useRef({});

  const handleNav = (path, name) => {
    if (onNavigate) onNavigate(path, name || '流程管理');
  };

  // 滚动监听高亮当前章节
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0,
      }
    );

    sections.forEach((sec) => {
      const el = sectionRefs.current[sec.id];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id) => {
    const el = sectionRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const data = templateData;

  return (
    <div className="min-h-full pb-10">
      <div className="max-w-[1600px] mx-auto">
        {/* 1. 顶部基础信息区 */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <StatusBadge status={data.status} />
                {data.tags.map((tag) => (
                  <span
                    key={tag}
                    className={cn(
                      'text-[10px] px-2 py-0.5 rounded-full border',
                      tag === '高频'
                        ? 'bg-amber-50 border-amber-100 text-amber-700'
                        : tag === '重点'
                        ? 'bg-rose-50 border-rose-100 text-rose-700'
                        : tag === '新版'
                        ? 'bg-brand-50 border-brand-100 text-brand-700'
                        : 'bg-slate-50 border-slate-100 text-slate-600'
                    )}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-2xl font-bold text-text tracking-tight mb-2">{data.name}</h1>
              <p className="text-sm text-text-muted mb-3">
                {data.code} · {data.category} · 当前版本 {data.version}
              </p>
              <p className="text-sm text-text-muted max-w-3xl">{data.summary}</p>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-text-subtle">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 更新于 {data.updateTime}</span>
                <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {data.updater}</span>
                <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {data.viewCount} 次浏览</span>
                <span>引用 {data.usageCount} 次</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 md:flex-col md:items-end">
              <div className="flex gap-2">
                <Button variant="secondary" size="md" icon={ArrowLeft} onClick={() => handleNav('/process/templates', '流程模板列表')}>
                  返回列表
                </Button>
                <Button size="md" icon={FileEdit} onClick={() => handleNav(`/process/edit/${data.id}`, `编辑：${data.name}`)}>
                  编辑模板
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" icon={History} onClick={() => handleNav(`/process/versions/${data.id}`, `版本：${data.name}`)}>
                  版本记录
                </Button>
                <Button variant="ghost" size="sm" icon={MoreHorizontal}>
                  更多
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 主体：左侧目录 + 中间正文 + 右侧辅助信息 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 左侧目录 */}
          <div className="hidden lg:block lg:col-span-2">
            <div className="sticky top-6">
              <Card padding="md">
                <h3 className="text-xs font-semibold text-text-subtle uppercase tracking-wider mb-3">目录</h3>
                <nav className="space-y-1">
                  {sections.map((sec) => {
                    const Icon = sec.icon;
                    const active = activeSection === sec.id;
                    return (
                      <button
                        key={sec.id}
                        onClick={() => scrollToSection(sec.id)}
                        className={cn(
                          'w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors text-left',
                          active
                            ? 'bg-brand-50 text-brand-700 font-medium'
                            : 'text-text-muted hover:bg-surface-subtle'
                        )}
                      >
                        <Icon className={cn('w-4 h-4', active ? 'text-brand-600' : 'text-text-subtle')} />
                        {sec.label}
                      </button>
                    );
                  })}
                </nav>
              </Card>
            </div>
          </div>

          {/* 中间正文 */}
          <div className="lg:col-span-7 space-y-6" ref={contentRef}>
            {/* 流程概述 */}
            <section
              id="overview"
              ref={(el) => (sectionRefs.current.overview = el)}
              className="scroll-mt-6"
            >
              <Card padding="lg">
                <SectionTitle icon={Info}>流程概述</SectionTitle>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div className="p-4 rounded-xl bg-surface-subtle">
                    <p className="text-xs text-text-subtle mb-1">流程目标</p>
                    <p className="text-text">{data.overview.goal}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-subtle">
                    <p className="text-xs text-text-subtle mb-1">适用范围</p>
                    <p className="text-text">{data.overview.scope}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-subtle">
                    <p className="text-xs text-text-subtle mb-1">触发条件</p>
                    <p className="text-text">{data.overview.trigger}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-subtle">
                    <p className="text-xs text-text-subtle mb-1">适用对象</p>
                    <p className="text-text">{data.overview.audience}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-subtle">
                    <p className="text-xs text-text-subtle mb-1">适用系统 / 工具</p>
                    <p className="text-text">{data.overview.systems}</p>
                  </div>
                </div>
              </Card>
            </section>

            {/* 准备事项 */}
            <section
              id="preparation"
              ref={(el) => (sectionRefs.current.preparation = el)}
              className="scroll-mt-6"
            >
              <Card padding="lg">
                <SectionTitle icon={Bookmark}>准备事项</SectionTitle>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-text mb-2">所需资料</h4>
                    <ul className="list-disc list-inside text-sm text-text-muted space-y-1">
                      {data.preparationItems.materials.map((m, i) => <li key={i}>{m}</li>)}
                    </ul>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-border">
                      <h4 className="text-sm font-semibold text-text mb-2">前置条件</h4>
                      <ul className="list-disc list-inside text-sm text-text-muted space-y-1">
                        {data.preparationItems.prerequisites.map((m, i) => <li key={i}>{m}</li>)}
                      </ul>
                    </div>
                    <div className="p-4 rounded-xl border border-border">
                      <h4 className="text-sm font-semibold text-text mb-2">权限要求</h4>
                      <ul className="list-disc list-inside text-sm text-text-muted space-y-1">
                        {data.preparationItems.permissions.map((m, i) => <li key={i}>{m}</li>)}
                      </ul>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                    <h4 className="text-sm font-semibold text-amber-800 mb-1">注意事项</h4>
                    <p className="text-sm text-amber-700">{data.preparationItems.notes}</p>
                  </div>
                </div>
              </Card>
            </section>

            {/* 执行步骤 */}
            <section
              id="steps"
              ref={(el) => (sectionRefs.current.steps = el)}
              className="scroll-mt-6"
            >
              <Card padding="lg">
                <SectionTitle icon={Layers}>执行步骤</SectionTitle>
                <div className="relative pl-4">
                  {/* 时间线/步骤线 */}
                  <div className="absolute left-[27px] top-3 bottom-3 w-px bg-border" />
                  <div className="space-y-6">
                    {data.steps.map((step) => (
                      <div key={step.stepNo} className="relative flex gap-4 group">
                        <div className="relative z-10 flex-shrink-0 w-7 h-7 rounded-full bg-brand-600 text-white text-sm font-bold flex items-center justify-center ring-4 ring-white">
                          {step.stepNo}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="p-4 rounded-xl border border-border bg-surface hover:border-brand-200 transition-colors">
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                              <h3 className="text-sm font-bold text-text">{step.title}</h3>
                              <span className="text-xs text-text-subtle bg-surface-subtle px-2 py-0.5 rounded-full">{step.role}</span>
                            </div>
                            <p className="text-sm text-text-muted mb-3">{step.content}</p>
                            <div className="grid sm:grid-cols-2 gap-3 text-xs mb-3">
                              <div className="p-2.5 rounded-lg bg-surface-subtle">
                                <span className="text-text-subtle">输入：</span>
                                <span className="text-text">{step.input}</span>
                              </div>
                              <div className="p-2.5 rounded-lg bg-surface-subtle">
                                <span className="text-text-subtle">输出：</span>
                                <span className="text-text">{step.output}</span>
                              </div>
                            </div>
                            <div className="mb-2">
                              <p className="text-xs text-text-subtle mb-1">操作要点</p>
                              <ul className="list-disc list-inside text-xs text-text-muted space-y-0.5">
                                {step.keyPoints.map((p, i) => <li key={i}>{p}</li>)}
                              </ul>
                            </div>
                            {step.riskHint && (
                              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-rose-50 border border-rose-100 text-rose-700 text-xs">
                                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <span>{step.riskHint}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </section>

            {/* 检查点 */}
            <section
              id="checkpoints"
              ref={(el) => (sectionRefs.current.checkpoints = el)}
              className="scroll-mt-6"
            >
              <Card padding="lg">
                <SectionTitle icon={CheckSquare}>检查点</SectionTitle>
                <div className="space-y-3">
                  {data.checkpoints.map((cp, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-border hover:border-brand-200 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded border-2 border-brand-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckSquare className="w-3 h-3 text-brand-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-text mb-1">{cp.name}</h4>
                          <p className="text-sm text-text-muted mb-2">{cp.desc}</p>
                          <div className="flex flex-wrap gap-2 text-xs">
                            <span className="px-2 py-1 rounded-full bg-success-50 text-success-700 border border-success-100">标准：{cp.standard}</span>
                            <span className="px-2 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-100">不通过：{cp.action}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </section>

            {/* 异常处理 */}
            <section
              id="exceptions"
              ref={(el) => (sectionRefs.current.exceptions = el)}
              className="scroll-mt-6"
            >
              <Card padding="lg">
                <SectionTitle icon={HelpCircle}>异常处理</SectionTitle>
                <div className="space-y-4">
                  {data.exceptions.map((ex, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-surface-subtle">
                      <div className="flex items-start gap-2 mb-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <h4 className="text-sm font-bold text-text">异常场景：{ex.scene}</h4>
                      </div>
                      <div className="pl-6 space-y-2 text-sm">
                        <p className="text-text-muted"><span className="text-text font-medium">处理方式：</span>{ex.handle}</p>
                        <p className="text-text-muted"><span className="text-text font-medium">升级路径：</span>{ex.escalation}</p>
                        <p className="text-text-muted"><span className="text-text font-medium">联系对象：</span>{ex.contact}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </section>

            {/* 输出结果 */}
            <section
              id="outputs"
              ref={(el) => (sectionRefs.current.outputs = el)}
              className="scroll-mt-6"
            >
              <Card padding="lg">
                <SectionTitle icon={Package}>输出结果</SectionTitle>
                <div className="grid sm:grid-cols-2 gap-3">
                  {data.outputs.map((out, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 rounded-xl border border-border hover:border-brand-200 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center flex-shrink-0">
                        <FileCheck className="w-4 h-4 text-brand-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-text">{out.name}</h4>
                        <p className="text-xs text-text-muted mt-1">{out.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </section>

            {/* 关联资料 */}
            <section
              id="attachments"
              ref={(el) => (sectionRefs.current.attachments = el)}
              className="scroll-mt-6"
            >
              <Card padding="lg">
                <SectionTitle icon={FolderOpen}>关联资料</SectionTitle>
                <div className="grid sm:grid-cols-2 gap-3">
                  {data.attachments.map((att) => (
                    <Card
                      key={att.id}
                      padding="md"
                      interactive
                      className="flex items-start gap-3 group"
                      onClick={() => { /* 下载占位 */ }}
                    >
                      <div className="w-10 h-10 rounded-xl bg-surface-subtle flex items-center justify-center flex-shrink-0">
                        <FileIcon type={att.type} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-text truncate group-hover:text-brand-700 transition-colors">
                          {att.name}
                        </h4>
                        <p className="text-xs text-text-subtle mt-1">
                          {att.type.toUpperCase()} · {att.size} · 更新于 {att.updateTime}
                        </p>
                      </div>
                      <Download className="w-4 h-4 text-text-subtle group-hover:text-brand-600" />
                    </Card>
                  ))}
                </div>
              </Card>
            </section>
          </div>

          {/* 右侧辅助信息区 */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-6 space-y-4">
              {/* 版本信息 */}
              <Card padding="md">
                <h3 className="text-sm font-semibold text-text mb-3">版本信息</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-subtle">当前版本</span>
                    <span className="font-medium text-text">{data.version}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-subtle">发布状态</span>
                    <StatusBadge status={data.status} />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-subtle">更新时间</span>
                    <span className="text-text">{data.updateTime}</span>
                  </div>
                  <div className="pt-3 border-t border-border">
                    <p className="text-xs text-text-subtle mb-1">本次更新摘要</p>
                    <p className="text-sm text-text">{data.versionHistory[0].note}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    fullWidth
                    icon={History}
                    onClick={() => handleNav(`/process/versions/${data.id}`, `版本：${data.name}`)}
                  >
                    查看全部版本记录
                  </Button>
                </div>
              </Card>

              {/* 统计数据 */}
              <Card padding="md">
                <h3 className="text-sm font-semibold text-text mb-3">数据统计</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-surface-subtle text-center">
                    <p className="text-lg font-bold text-text">{data.viewCount}</p>
                    <p className="text-xs text-text-subtle">浏览量</p>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-subtle text-center">
                    <p className="text-lg font-bold text-text">{data.usageCount}</p>
                    <p className="text-xs text-text-subtle">引用次数</p>
                  </div>
                </div>
              </Card>

              {/* 相关流程推荐 */}
              <Card padding="md">
                <h3 className="text-sm font-semibold text-text mb-3">相关流程推荐</h3>
                <div className="space-y-2">
                  {data.relatedTemplates.map((rt) => (
                    <button
                      key={rt.id}
                      onClick={() => handleNav(`/process/detail/${rt.id}`, rt.name)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-subtle transition-colors text-left"
                    >
                      <div className="min-w-0">
                        <p className="text-sm text-text truncate">{rt.name}</p>
                        <p className="text-xs text-text-subtle">{rt.category}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-text-subtle flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </Card>

              {/* 关联制度文件 */}
              <Card padding="md">
                <h3 className="text-sm font-semibold text-text mb-3">关联制度</h3>
                <div className="space-y-2 text-sm">
                  <button className="w-full flex items-center gap-2 text-text-muted hover:text-brand-700 transition-colors text-left">
                    <Link2 className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">采购廉洁制度 V2.1</span>
                  </button>
                  <button className="w-full flex items-center gap-2 text-text-muted hover:text-brand-700 transition-colors text-left">
                    <Link2 className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">供应链绩效考核办法</span>
                  </button>
                  <button className="w-full flex items-center gap-2 text-text-muted hover:text-brand-700 transition-colors text-left">
                    <Link2 className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">供应商管理规范 V4.0</span>
                  </button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
