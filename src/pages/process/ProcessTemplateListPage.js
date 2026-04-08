// src/pages/process/ProcessTemplateListPage.js
// 流程管理 / SOP 规范中心 - 流程模板列表页（Mock 数据）
import React, { useMemo, useState } from 'react';
import {
  Plus, Search, RotateCcw, LayoutGrid, List, Eye, FileEdit, History,
  FileText, Clock, ArrowLeft
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import TableShell from '../../components/ui/TableShell';
import TablePagination from '../../components/TablePagination';
import cn from '../../utils/cn';

// -------------------- Mock 数据 --------------------
const mockTemplates = [
  {
    id: 't1', code: 'SOP-CG-001', name: '采购下单标准流程', category: '采购管理', categoryKey: 'procurement',
    version: 'V3.2', status: 'published', summary: '覆盖从需求提出到订单确认的全链路，含紧急采购绿色通道说明。',
    tags: ['高频', '入门必读'], updateTime: '2024-03-22 10:30', updater: '张伟', viewCount: 1240, usageCount: 856, isLatest: true,
    keywordList: ['采购', '下单', '订单']
  },
  {
    id: 't2', code: 'SOP-CG-002', name: '供应商准入评估流程', category: '采购管理', categoryKey: 'procurement',
    version: 'V2.0', status: 'published', summary: '供应商资质审核、样品测试、现场评审及准入决策标准流程。',
    tags: ['重点'], updateTime: '2024-03-20 14:00', updater: '李强', viewCount: 980, usageCount: 620, isLatest: true,
    keywordList: ['供应商', '准入', '评估']
  },
  {
    id: 't3', code: 'SOP-QC-003', name: '来料质检处理规范', category: '质量管理', categoryKey: 'quality',
    version: 'V2.1', status: 'published', summary: '明确来料抽检比例、不合格品处置及供应商反馈机制。',
    tags: ['重点', '新版'], updateTime: '2024-03-21 16:00', updater: '王芳', viewCount: 856, usageCount: 430, isLatest: true,
    keywordList: ['质检', '来料', '不合格']
  },
  {
    id: 't4', code: 'SOP-WH-004', name: '仓库异常出入库处理流程', category: '仓储管理', categoryKey: 'warehouse',
    version: 'V2.0', status: 'published', summary: '系统异常、实物差异、超期未入库等异常场景的处理与追责机制。',
    tags: ['高频'], updateTime: '2024-03-20 17:10', updater: '刘洋', viewCount: 760, usageCount: 510, isLatest: true,
    keywordList: ['仓库', '异常', '出入库']
  },
  {
    id: 't5', code: 'SOP-WH-005', name: '月度盘点标准操作流程', category: '仓储管理', categoryKey: 'warehouse',
    version: 'V1.5', status: 'published', summary: '月度循环盘点计划制定、执行、差异分析及系统调整规范。',
    tags: ['入门必读'], updateTime: '2024-03-15 09:30', updater: '赵敏', viewCount: 540, usageCount: 320, isLatest: true,
    keywordList: ['盘点', '仓库', '月度']
  },
  {
    id: 't6', code: 'SOP-CS-006', name: '客诉问题升级与闭环流程', category: '客诉处理', categoryKey: 'complaint',
    version: 'V4.0', status: 'published', summary: '定义客诉分级标准、升级路径及48小时响应要求。',
    tags: ['高频', '重点'], updateTime: '2024-03-19 09:15', updater: '陈晨', viewCount: 2103, usageCount: 1200, isLatest: true,
    keywordList: ['客诉', '升级', '闭环']
  },
  {
    id: 't7', code: 'SOP-DS-007', name: '设计需求评审与提交流程', category: '设计管理', categoryKey: 'design',
    version: 'V1.4', status: 'published', summary: '设计需求从提交、评审、排期到交付确认的全流程管理。',
    tags: ['新版'], updateTime: '2024-03-18 09:40', updater: '孙丽', viewCount: 620, usageCount: 280, isLatest: true,
    keywordList: ['设计', '需求', '评审']
  },
  {
    id: 't8', code: 'SOP-FI-008', name: '费用报销资料提报规范', category: '财务管理', categoryKey: 'finance',
    version: 'V5.1', status: 'published', summary: '最新差旅、招待、日常费用报销标准及附件要求一览。',
    tags: ['入门必读', '高频'], updateTime: '2024-03-23 14:20', updater: '李婷', viewCount: 3420, usageCount: 2100, isLatest: true,
    keywordList: ['报销', '费用', '财务']
  },
  {
    id: 't9', code: 'SOP-FI-009', name: '预算编制与调整流程', category: '财务管理', categoryKey: 'finance',
    version: 'V3.0', status: 'draft', summary: '年度预算编制、季度滚动预测及预算调整审批流程。',
    tags: ['重点'], updateTime: '2024-03-24 11:00', updater: '周杰', viewCount: 120, usageCount: 0, isLatest: true,
    keywordList: ['预算', '财务', '编制']
  },
  {
    id: 't10', code: 'SOP-HR-010', name: '新员工入职办理流程', category: '人事行政', categoryKey: 'hr',
    version: 'V2.5', status: 'published', summary: '从offer确认到试用期转正的全流程指引，含各部门协作节点。',
    tags: ['入门必读'], updateTime: '2024-03-24 11:00', updater: '王敏', viewCount: 1890, usageCount: 980, isLatest: true,
    keywordList: ['入职', '新员工', 'HR']
  },
  {
    id: 't11', code: 'SOP-HR-011', name: '员工考勤异常申诉流程', category: '人事行政', categoryKey: 'hr',
    version: 'V1.2', status: 'published', summary: '考勤异常发起申诉、审批、复核及结果通知标准流程。',
    tags: ['高频'], updateTime: '2024-03-12 15:00', updater: '赵静', viewCount: 780, usageCount: 450, isLatest: true,
    keywordList: ['考勤', '申诉', 'HR']
  },
  {
    id: 't12', code: 'SOP-GN-012', name: '跨部门协作沟通规范', category: '通用规范', categoryKey: 'general',
    version: 'V1.3', status: 'published', summary: '明确项目协作中的沟通渠道、会议纪要模板及信息同步机制。',
    tags: ['新版'], updateTime: '2024-03-17 15:45', updater: '吴磊', viewCount: 620, usageCount: 310, isLatest: true,
    keywordList: ['协作', '沟通', '跨部门']
  },
  {
    id: 't13', code: 'SOP-GN-013', name: '信息安全与数据保密规范', category: '通用规范', categoryKey: 'general',
    version: 'V2.0', status: 'disabled', summary: '企业信息安全等级划分、数据访问权限及保密义务说明。',
    tags: ['重点'], updateTime: '2024-02-28 10:00', updater: '郑和', viewCount: 430, usageCount: 120, isLatest: true,
    keywordList: ['信息安全', '保密', '数据']
  },
  {
    id: 't14', code: 'SOP-CG-014', name: '询比价与核价管理流程', category: '采购管理', categoryKey: 'procurement',
    version: 'V1.8', status: 'published', summary: '新物料核价、年度降价、询比价记录及审批要求。',
    tags: ['高频'], updateTime: '2024-03-10 16:30', updater: '钱进', viewCount: 670, usageCount: 380, isLatest: true,
    keywordList: ['核价', '采购', '比价']
  },
  {
    id: 't15', code: 'SOP-QC-015', name: '成品出货检验规范', category: '质量管理', categoryKey: 'quality',
    version: 'V2.3', status: 'published', summary: '成品出货前的AQL抽检标准、不合格处置及放行规则。',
    tags: ['重点'], updateTime: '2024-03-14 09:00', updater: '林峰', viewCount: 720, usageCount: 290, isLatest: true,
    keywordList: ['出货', '质检', '检验']
  },
  {
    id: 't16', code: 'SOP-WH-016', name: '库内移库与调拨流程', category: '仓储管理', categoryKey: 'warehouse',
    version: 'V1.1', status: 'draft', summary: '仓库内部移库、跨仓调拨的系统操作与实物交接要求。',
    tags: [], updateTime: '2024-03-25 10:00', updater: '黄磊', viewCount: 45, usageCount: 0, isLatest: true,
    keywordList: ['移库', '调拨', '仓库']
  },
  {
    id: 't17', code: 'SOP-CS-017', name: '客户退货质检与退款流程', category: '客诉处理', categoryKey: 'complaint',
    version: 'V3.1', status: 'published', summary: '退货原因判定、质检复测、退款审批及责任追溯机制。',
    tags: ['高频'], updateTime: '2024-03-16 14:20', updater: '杨梅', viewCount: 890, usageCount: 560, isLatest: true,
    keywordList: ['退货', '客诉', '退款']
  },
  {
    id: 't18', code: 'SOP-DS-018', name: '设计变更与版本管理流程', category: '设计管理', categoryKey: 'design',
    version: 'V1.0', status: 'draft', summary: '设计变更申请、影响评估、版本归档及通知发放规范。',
    tags: ['新版'], updateTime: '2024-03-24 17:00', updater: '徐明', viewCount: 30, usageCount: 0, isLatest: true,
    keywordList: ['设计变更', '版本', '设计']
  },
  {
    id: 't19', code: 'SOP-FI-019', name: '付款审批与资金计划流程', category: '财务管理', categoryKey: 'finance',
    version: 'V4.2', status: 'published', summary: '供应商付款、内部借款、资金计划编制及审批层级。',
    tags: ['重点'], updateTime: '2024-03-11 11:30', updater: '马云', viewCount: 560, usageCount: 210, isLatest: true,
    keywordList: ['付款', '资金', '审批']
  },
  {
    id: 't20', code: 'SOP-HR-020', name: '绩效考核与面谈流程', category: '人事行政', categoryKey: 'hr',
    version: 'V2.1', status: 'disabled', summary: '季度绩效考核目标设定、评分、面谈及结果申诉流程。',
    tags: [], updateTime: '2024-02-10 09:00', updater: '邓超', viewCount: 340, usageCount: 80, isLatest: true,
    keywordList: ['绩效', '考核', 'HR']
  },
  {
    id: 't21', code: 'SOP-GN-021', name: '会议室预约与使用规范', category: '通用规范', categoryKey: 'general',
    version: 'V1.0', status: 'published', summary: '会议室预约规则、设备使用及会后整理要求。',
    tags: ['入门必读'], updateTime: '2024-03-08 10:00', updater: '韩雪', viewCount: 1200, usageCount: 600, isLatest: true,
    keywordList: ['会议室', '行政', '预约']
  },
  {
    id: 't22', code: 'SOP-QC-022', name: '质量异常停线处理规范', category: '质量管理', categoryKey: 'quality',
    version: 'V1.5', status: 'published', summary: '产线质量异常触发停线的判定标准、响应时效及复线条件。',
    tags: ['重点', '高频'], updateTime: '2024-03-18 13:00', updater: '冯巩', viewCount: 670, usageCount: 340, isLatest: true,
    keywordList: ['停线', '质量异常', '质检']
  },
];

// -------------------- 常量配置 --------------------
const categoryOptions = [
  { key: 'all', label: '全部流程' },
  { key: 'procurement', label: '采购管理' },
  { key: 'warehouse', label: '仓储管理' },
  { key: 'quality', label: '质量管理' },
  { key: 'design', label: '设计管理' },
  { key: 'complaint', label: '客诉处理' },
  { key: 'finance', label: '财务管理' },
  { key: 'hr', label: '人事行政' },
  { key: 'general', label: '通用规范' },
];

const statusOptions = [
  { key: 'all', label: '全部状态' },
  { key: 'published', label: '已发布' },
  { key: 'draft', label: '草稿' },
  { key: 'disabled', label: '已停用' },
];

const versionOptions = [
  { key: 'all', label: '全部版本' },
  { key: 'latest', label: '当前生效版' },
  { key: 'history', label: '历史版本' },
];

const tagOptions = [
  { key: '高频', label: '高频', color: 'bg-amber-50 text-amber-700 border-amber-100' },
  { key: '新版', label: '新版', color: 'bg-brand-50 text-brand-700 border-brand-100' },
  { key: '重点', label: '重点', color: 'bg-rose-50 text-rose-700 border-rose-100' },
  { key: '入门必读', label: '入门必读', color: 'bg-slate-50 text-slate-600 border-slate-100' },
];

// -------------------- 辅助组件 --------------------
const StatusBadge = ({ status }) => {
  if (status === 'published') return <Badge tone="success">已发布</Badge>;
  if (status === 'draft') return <Badge tone="warning">草稿</Badge>;
  if (status === 'disabled') return <Badge tone="danger">已停用</Badge>;
  return <Badge tone="neutral">未知</Badge>;
};

const TagPill = ({ children, className }) => (
  <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium', className)}>
    {children}
  </span>
);

// -------------------- 主页面 --------------------
export default function ProcessTemplateListPage({ onNavigate }) {
  // 视图状态
  const [viewMode, setViewMode] = useState('card'); // 'card' | 'table'

  // 筛选状态
  const [keywords, setKeywords] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [versionStatus, setVersionStatus] = useState('all');
  const [selectedTags, setSelectedTags] = useState([]);
  const [dateRange, setDateRange] = useState(''); // 简化为字符串占位，后续可扩展为日期组件

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // 导航处理
  const handleNav = (path, name) => {
    if (onNavigate) onNavigate(path, name || '流程管理');
  };

  // 筛选逻辑
  const filteredData = useMemo(() => {
    let data = mockTemplates.filter((item) => {
      const matchKeywords = !keywords.trim() ||
        [item.name, item.code, item.summary, ...(item.keywordList || [])].some((t) =>
          t.toLowerCase().includes(keywords.trim().toLowerCase())
        );
      const matchCategory = category === 'all' || item.categoryKey === category;
      const matchStatus = status === 'all' || item.status === status;
      const matchVersion = versionStatus === 'all'
        || (versionStatus === 'latest' && item.isLatest)
        || (versionStatus === 'history' && !item.isLatest);
      const matchTags = selectedTags.length === 0 || selectedTags.every((t) => item.tags.includes(t));
      return matchKeywords && matchCategory && matchStatus && matchVersion && matchTags;
    });

    // 按更新时间倒序
    data = [...data].sort((a, b) => new Date(b.updateTime) - new Date(a.updateTime));
    return data;
  }, [keywords, category, status, versionStatus, selectedTags]);

  // 分页数据
  const total = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pagedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // 重置筛选
  const handleReset = () => {
    setKeywords('');
    setCategory('all');
    setStatus('all');
    setVersionStatus('all');
    setSelectedTags([]);
    setDateRange('');
    setCurrentPage(1);
  };

  // 切换分类
  const handleCategoryChange = (key) => {
    setCategory(key);
    setCurrentPage(1);
  };

  // 标签切换
  const toggleTag = (key) => {
    setSelectedTags((prev) =>
      prev.includes(key) ? prev.filter((t) => t !== key) : [...prev, key]
    );
    setCurrentPage(1);
  };

  // 操作占位
  const handleViewDetail = (item) => handleNav(`/process/detail/${item.id}`, item.name);
  const handleEdit = (item) => handleNav(`/process/edit/${item.id}`, `编辑：${item.name}`);
  const handleVersions = (item) => handleNav(`/process/versions/${item.id}`, `版本：${item.name}`);

  // 空状态
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 text-text-muted">
      <FileText className="w-12 h-12 mb-3 opacity-30" />
      <p className="text-sm">暂无符合条件的流程模板</p>
      <Button variant="ghost" size="sm" className="mt-3" onClick={handleReset}>重置筛选</Button>
    </div>
  );

  return (
    <div className="min-h-full pb-10">
      <div className="max-w-[1600px] mx-auto">
        {/* 1. 页面顶部标题区 */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="ui-page-title">流程模板列表</h1>
            <p className="mt-1 text-sm text-text-muted">
              集中管理企业内部 SOP 流程模板与规范手册
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="md" icon={ArrowLeft} onClick={() => handleNav('/process/overview', '流程概览')}>
              返回流程概览
            </Button>
            <Button size="md" icon={Plus} onClick={() => handleNav('/process/create', '新建流程模板')}>
              新建流程模板
            </Button>
          </div>
        </div>

        {/* 2. 筛选搜索区 */}
        <Card padding="md" className="mb-5">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-end gap-3">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs text-text-subtle mb-1.5">关键词</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-subtle" />
                  <input
                    type="text"
                    value={keywords}
                    onChange={(e) => { setKeywords(e.target.value); setCurrentPage(1); }}
                    placeholder="流程名称 / 编号 / 关键词"
                    className="ui-input pl-9 w-full"
                  />
                </div>
              </div>
              <div className="w-full sm:w-40">
                <label className="block text-xs text-text-subtle mb-1.5">业务口</label>
                <select
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="ui-select"
                >
                  {categoryOptions.map((c) => (
                    <option key={c.key} value={c.key}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div className="w-full sm:w-36">
                <label className="block text-xs text-text-subtle mb-1.5">状态</label>
                <select
                  value={status}
                  onChange={(e) => { setStatus(e.target.value); setCurrentPage(1); }}
                  className="ui-select"
                >
                  {statusOptions.map((s) => (
                    <option key={s.key} value={s.key}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div className="w-full sm:w-36">
                <label className="block text-xs text-text-subtle mb-1.5">版本状态</label>
                <select
                  value={versionStatus}
                  onChange={(e) => { setVersionStatus(e.target.value); setCurrentPage(1); }}
                  className="ui-select"
                >
                  {versionOptions.map((v) => (
                    <option key={v.key} value={v.key}>{v.label}</option>
                  ))}
                </select>
              </div>
              <div className="w-full sm:w-40">
                <label className="block text-xs text-text-subtle mb-1.5">更新时间</label>
                <select
                  value={dateRange}
                  onChange={(e) => { setDateRange(e.target.value); setCurrentPage(1); }}
                  className="ui-select"
                >
                  <option value="">全部时间</option>
                  <option value="7">近 7 天</option>
                  <option value="30">近 30 天</option>
                  <option value="90">近 3 个月</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-text-subtle mr-1">标签：</span>
              {tagOptions.map((t) => {
                const active = selectedTags.includes(t.key);
                return (
                  <button
                    key={t.key}
                    onClick={() => toggleTag(t.key)}
                    className={cn(
                      'px-2.5 py-1 rounded-full border text-xs font-medium transition-colors',
                      active ? t.color : 'bg-white border-border text-text-muted hover:border-border-strong'
                    )}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button variant="secondary" size="sm" icon={RotateCcw} onClick={handleReset}>重置</Button>
            </div>
          </div>
        </Card>

        {/* 主体：左侧分类 + 右侧列表 */}
        <div className="flex flex-col lg:flex-row gap-5">
          {/* 4. 左侧分类辅助导航 */}
          <div className="w-full lg:w-56 flex-shrink-0">
            <Card padding="none" className="overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-surface-subtle">
                <h3 className="text-sm font-semibold text-text">业务口分类</h3>
              </div>
              <div className="py-2">
                {categoryOptions.map((c) => {
                  const count = c.key === 'all'
                    ? mockTemplates.length
                    : mockTemplates.filter((t) => t.categoryKey === c.key).length;
                  const active = category === c.key;
                  return (
                    <button
                      key={c.key}
                      onClick={() => handleCategoryChange(c.key)}
                      className={cn(
                        'w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors',
                        active ? 'bg-brand-50 text-brand-700 font-medium' : 'text-text-muted hover:bg-surface-subtle'
                      )}
                    >
                      <span>{c.label}</span>
                      <span className={cn('text-xs px-2 py-0.5 rounded-full', active ? 'bg-brand-100 text-brand-700' : 'bg-surface-subtle text-text-subtle')}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* 右侧列表区 */}
          <div className="flex-1 min-w-0">
            {/* 工具栏 */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-text-muted">
                共 <span className="font-semibold text-text">{total}</span> 个流程模板
              </div>
              <div className="flex items-center gap-1 bg-surface-subtle rounded-lg p-1">
                <button
                  onClick={() => setViewMode('card')}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
                    viewMode === 'card' ? 'bg-white text-text shadow-sm' : 'text-text-muted hover:text-text'
                  )}
                >
                  <LayoutGrid className="w-3.5 h-3.5" /> 卡片
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
                    viewMode === 'table' ? 'bg-white text-text shadow-sm' : 'text-text-muted hover:text-text'
                  )}
                >
                  <List className="w-3.5 h-3.5" /> 表格
                </button>
              </div>
            </div>

            {/* 3. 列表展示区 - 卡片模式 */}
            {viewMode === 'card' && (
              <div className="space-y-3">
                {pagedData.length === 0 && <EmptyState />}
                {pagedData.map((item) => (
                  <Card
                    key={item.id}
                    padding="md"
                    className="group transition-all hover:border-border-strong hover:shadow-sm"
                  >
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      {/* 左侧信息 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <StatusBadge status={item.status} />
                          {item.tags.map((t) => {
                            const cfg = tagOptions.find((x) => x.key === t);
                            return (
                              <TagPill key={t} className={cfg ? cfg.color : 'bg-surface-subtle text-text-muted border-border'}>
                                {t}
                              </TagPill>
                            );
                          })}
                        </div>
                        <h3 className="text-base font-bold text-text mb-1 group-hover:text-brand-700 transition-colors cursor-pointer"
                            onClick={() => handleViewDetail(item)}>
                          {item.name}
                        </h3>
                        <p className="text-xs text-text-subtle mb-2">
                          {item.code} · {item.category} · 当前版本 {item.version}
                        </p>
                        <p className="text-sm text-text-muted line-clamp-2 mb-3">{item.summary}</p>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-text-subtle">
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {item.updateTime}</span>
                          <span>更新人：{item.updater}</span>
                          <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {item.viewCount}</span>
                          <span>引用 {item.usageCount} 次</span>
                        </div>
                      </div>

                      {/* 右侧操作 */}
                      <div className="flex md:flex-col items-center md:items-end gap-2 md:min-w-[120px]">
                        <Button variant="secondary" size="sm" className="w-full" onClick={() => handleViewDetail(item)} icon={Eye}>查看详情</Button>
                        <div className="flex gap-2 w-full">
                          <Button variant="ghost" size="sm" className="flex-1" onClick={() => handleEdit(item)} icon={FileEdit}>编辑</Button>
                          <Button variant="ghost" size="sm" className="flex-1" onClick={() => handleVersions(item)} icon={History}>版本</Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* 3. 列表展示区 - 表格模式 */}
            {viewMode === 'table' && (
              <TableShell
                className="mb-0"
                bodyClassName="overflow-x-auto"
                emptyState={pagedData.length === 0 ? <EmptyState /> : null}
                pagination={null}
              >
                <table className="w-full text-sm">
                  <thead className="bg-surface-subtle">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-text-subtle">流程编号</th>
                      <th className="px-4 py-3 text-left font-medium text-text-subtle">流程名称</th>
                      <th className="px-4 py-3 text-left font-medium text-text-subtle">业务口</th>
                      <th className="px-4 py-3 text-left font-medium text-text-subtle">版本</th>
                      <th className="px-4 py-3 text-left font-medium text-text-subtle">状态</th>
                      <th className="px-4 py-3 text-left font-medium text-text-subtle">标签</th>
                      <th className="px-4 py-3 text-left font-medium text-text-subtle">更新时间</th>
                      <th className="px-4 py-3 text-left font-medium text-text-subtle">更新人</th>
                      <th className="px-4 py-3 text-right font-medium text-text-subtle">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {pagedData.map((item) => (
                      <tr key={item.id} className="hover:bg-surface-subtle/50 transition-colors">
                        <td className="px-4 py-3 text-text-subtle">{item.code}</td>
                        <td className="px-4 py-3 font-medium text-text">{item.name}</td>
                        <td className="px-4 py-3 text-text-muted">{item.category}</td>
                        <td className="px-4 py-3 text-text-muted">{item.version}</td>
                        <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {item.tags.slice(0, 2).map((t) => {
                              const cfg = tagOptions.find((x) => x.key === t);
                              return (
                                <TagPill key={t} className={cfg ? cfg.color : 'bg-surface-subtle text-text-muted border-border'}>
                                  {t}
                                </TagPill>
                              );
                            })}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-text-muted whitespace-nowrap">{item.updateTime}</td>
                        <td className="px-4 py-3 text-text-muted">{item.updater}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleViewDetail(item)} className="p-1.5 rounded-lg hover:bg-surface-subtle text-text-subtle hover:text-text" title="查看详情">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleEdit(item)} className="p-1.5 rounded-lg hover:bg-surface-subtle text-text-subtle hover:text-text" title="编辑">
                              <FileEdit className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleVersions(item)} className="p-1.5 rounded-lg hover:bg-surface-subtle text-text-subtle hover:text-text" title="版本记录">
                              <History className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableShell>
            )}

            {/* 5. 分页区 */}
            {total > 0 && (
              <div className="mt-4">
                <TablePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  total={total}
                  onPageChange={(page) => setCurrentPage(page)}
                  itemName="个模板"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
