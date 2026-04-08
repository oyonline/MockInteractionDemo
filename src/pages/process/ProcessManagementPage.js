// src/pages/process/ProcessManagementPage.js
// 流程管理 / SOP 规范中心 - 流程概览页（Mock 数据）
import React, { useState } from 'react';
import {
  GitBranch, Search, Plus, LayoutGrid, FileText, CheckCircle, FileEdit,
  AlertCircle, TrendingUp, Layers, ShoppingCart, Warehouse, TestTube,
  PenTool, MessageSquareWarning, DollarSign, Users, FileCheck, Clock,
  Eye, ArrowRight, ChevronRight, Sparkles, History, FolderOpen,
  Tags, Box
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import cn from '../../utils/cn';

// -------------------- Mock 数据 --------------------

// 核心统计数据
const statsData = [
  { id: 'total', label: '流程模板总数', value: 186, desc: '全部业务口流程模板', icon: FileText, tone: 'primary' },
  { id: 'published', label: '已发布流程', value: 142, desc: '当前生效可用', icon: CheckCircle, tone: 'success' },
  { id: 'draft', label: '草稿数', value: 32, desc: '待完善或待审批', icon: FileEdit, tone: 'warning' },
  { id: 'disabled', label: '已停用', value: 12, desc: '已下线或已替代', icon: AlertCircle, tone: 'danger' },
  { id: 'monthly', label: '本月更新', value: 18, desc: '近30天新增或修订', icon: TrendingUp, tone: 'primary' },
  { id: 'coverage', label: '覆盖业务口', value: 8, desc: '全业务领域', icon: Layers, tone: 'neutral' },
];

// 业务口分类
const categories = [
  {
    id: 'procurement',
    name: '采购管理',
    desc: '供应商准入、采购下单、询比价',
    count: 24,
    updatedAt: '2024-03-22',
    icon: ShoppingCart,
    color: 'bg-amber-500',
    lightColor: 'bg-amber-50',
    textColor: 'text-amber-600',
  },
  {
    id: 'warehouse',
    name: '仓储管理',
    desc: '出入库、盘点、库内作业',
    count: 21,
    updatedAt: '2024-03-20',
    icon: Warehouse,
    color: 'bg-sky-500',
    lightColor: 'bg-sky-50',
    textColor: 'text-sky-600',
  },
  {
    id: 'quality',
    name: '质量管理',
    desc: '来料质检、客诉处理、改善闭环',
    count: 19,
    updatedAt: '2024-03-21',
    icon: TestTube,
    color: 'bg-cyan-500',
    lightColor: 'bg-cyan-50',
    textColor: 'text-cyan-600',
  },
  {
    id: 'design',
    name: '设计管理',
    desc: '需求提交、评审、交付归档',
    count: 16,
    updatedAt: '2024-03-18',
    icon: PenTool,
    color: 'bg-violet-500',
    lightColor: 'bg-violet-50',
    textColor: 'text-violet-600',
  },
  {
    id: 'complaint',
    name: '客诉处理',
    desc: '问题受理、升级、回访闭环',
    count: 14,
    updatedAt: '2024-03-19',
    icon: MessageSquareWarning,
    color: 'bg-rose-500',
    lightColor: 'bg-rose-50',
    textColor: 'text-rose-600',
  },
  {
    id: 'finance',
    name: '财务管理',
    desc: '报销、预算、付款、对账',
    count: 28,
    updatedAt: '2024-03-23',
    icon: DollarSign,
    color: 'bg-emerald-500',
    lightColor: 'bg-emerald-50',
    textColor: 'text-emerald-600',
  },
  {
    id: 'hr',
    name: '人事行政',
    desc: '入职、考勤、行政事务',
    count: 35,
    updatedAt: '2024-03-24',
    icon: Users,
    color: 'bg-pink-500',
    lightColor: 'bg-pink-50',
    textColor: 'text-pink-600',
  },
  {
    id: 'general',
    name: '通用规范',
    desc: '跨部门协作、信息安全、会议',
    count: 29,
    updatedAt: '2024-03-17',
    icon: FileCheck,
    color: 'bg-slate-500',
    lightColor: 'bg-slate-100',
    textColor: 'text-slate-600',
  },
];

// 推荐 / 热门流程
const featuredProcesses = [
  {
    id: 'p1',
    code: 'SOP-CG-001',
    name: '采购下单标准流程',
    category: '采购管理',
    version: 'V3.2',
    status: 'published',
    summary: '覆盖从需求提出到订单确认的全链路，含紧急采购绿色通道说明。',
    tags: ['高频', '入门必读'],
    updateTime: '2024-03-22 10:30',
    viewCount: 1240,
  },
  {
    id: 'p2',
    code: 'SOP-QC-003',
    name: '来料质检处理规范',
    category: '质量管理',
    version: 'V2.1',
    status: 'published',
    summary: '明确来料抽检比例、不合格品处置及供应商反馈机制。',
    tags: ['重点', '新版'],
    updateTime: '2024-03-21 16:00',
    viewCount: 856,
  },
  {
    id: 'p3',
    code: 'SOP-CS-005',
    name: '客诉问题升级与闭环流程',
    category: '客诉处理',
    version: 'V4.0',
    status: 'published',
    summary: '定义客诉分级标准、升级路径及48小时响应要求。',
    tags: ['高频', '重点'],
    updateTime: '2024-03-19 09:15',
    viewCount: 2103,
  },
  {
    id: 'p4',
    code: 'SOP-FI-002',
    name: '费用报销资料提报规范',
    category: '财务管理',
    version: 'V5.1',
    status: 'published',
    summary: '最新差旅、招待、日常费用报销标准及附件要求一览。',
    tags: ['入门必读', '高频'],
    updateTime: '2024-03-23 14:20',
    viewCount: 3420,
  },
  {
    id: 'p5',
    code: 'SOP-HR-007',
    name: '新员工入职办理流程',
    category: '人事行政',
    version: 'V2.5',
    status: 'published',
    summary: '从offer确认到试用期转正的全流程指引，含各部门协作节点。',
    tags: ['入门必读'],
    updateTime: '2024-03-24 11:00',
    viewCount: 1890,
  },
  {
    id: 'p6',
    code: 'SOP-GN-004',
    name: '跨部门协作沟通规范',
    category: '通用规范',
    version: 'V1.3',
    status: 'published',
    summary: '明确项目协作中的沟通渠道、会议纪要模板及信息同步机制。',
    tags: ['新版'],
    updateTime: '2024-03-17 15:45',
    viewCount: 620,
  },
];

// 最近更新
const recentUpdates = [
  {
    id: 'u1',
    processName: '费用报销资料提报规范',
    code: 'SOP-FI-002',
    category: '财务管理',
    changeSummary: '更新一线城市住宿标准，新增高铁一等座报销说明',
    version: 'V5.1',
    updateTime: '2024-03-23 14:20',
    updater: '财务部 · 李婷',
  },
  {
    id: 'u2',
    processName: '新员工入职办理流程',
    code: 'SOP-HR-007',
    category: '人事行政',
    changeSummary: '补充远程入职场景，优化IT账号开通节点',
    version: 'V2.5',
    updateTime: '2024-03-24 11:00',
    updater: 'HR · 王敏',
  },
  {
    id: 'u3',
    processName: '采购下单标准流程',
    code: 'SOP-CG-001',
    category: '采购管理',
    changeSummary: '增加小额采购直批路径，缩短审批层级',
    version: 'V3.2',
    updateTime: '2024-03-22 10:30',
    updater: '采购部 · 张伟',
  },
  {
    id: 'u4',
    processName: '仓库异常出入库处理流程',
    code: 'SOP-WH-006',
    category: '仓储管理',
    changeSummary: '细化系统异常回传时的补录规则',
    version: 'V2.0',
    updateTime: '2024-03-20 17:10',
    updater: '仓储部 · 刘洋',
  },
  {
    id: 'u5',
    processName: '设计需求提交流程',
    code: 'SOP-DS-008',
    category: '设计管理',
    changeSummary: '新增AIGC素材使用声明附件要求',
    version: 'V1.4',
    updateTime: '2024-03-18 09:40',
    updater: '设计部 · 陈晨',
  },
];

// 底部快捷入口
const quickLinks = [
  { id: 'ql1', name: '流程分类管理', desc: '维护业务口与标签', icon: Tags, path: '/process/categories' },
  { id: 'ql2', name: '流程模板列表', desc: '全部模板一览', icon: LayoutGrid, path: '/process/templates' },
  { id: 'ql3', name: '版本记录', desc: '历史版本追溯', icon: History, path: '/process/versions' },
  { id: 'ql4', name: '草稿箱', desc: '待发布内容', icon: FileEdit, path: '/process/drafts' },
  { id: 'ql5', name: '规范文档中心', desc: '附件与手册下载', icon: FolderOpen, path: '/process/documents' },
];

// -------------------- 辅助组件 --------------------

const ToneIcon = ({ tone, icon: Icon }) => {
  const map = {
    primary: { bg: 'bg-brand-50', text: 'text-brand-600' },
    success: { bg: 'bg-success-50', text: 'text-success-600' },
    warning: { bg: 'bg-warning-50', text: 'text-warning-600' },
    danger: { bg: 'bg-danger-50', text: 'text-danger-600' },
    neutral: { bg: 'bg-surface-subtle', text: 'text-text-muted' },
  };
  const style = map[tone] || map.neutral;
  return (
    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', style.bg)}>
      <Icon className={cn('w-5 h-5', style.text)} />
    </div>
  );
};

const StatusBadge = ({ status }) => {
  if (status === 'published') return <Badge tone="success">已发布</Badge>;
  if (status === 'draft') return <Badge tone="warning">草稿</Badge>;
  if (status === 'disabled') return <Badge tone="danger">已停用</Badge>;
  return <Badge tone="neutral">未知</Badge>;
};

// -------------------- 主页面 --------------------

export default function ProcessManagementPage({ onNavigate }) {
  const [searchValue, setSearchValue] = useState('');
  const [loading] = useState(false);

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
    // mock：可在此接入搜索接口
  };

  const handleNav = (path, name) => {
    if (onNavigate) {
      onNavigate(path, name);
    } else {
      // eslint-disable-next-line no-console
      console.log('Navigate to:', path, name);
    }
  };

  const handleCreateTemplate = () => {
    // eslint-disable-next-line no-console
    console.log('新建流程模板');
  };

  const filteredCategories = categories.filter((c) =>
    [c.name, c.desc].some((text) => text.toLowerCase().includes(searchValue.toLowerCase()))
  );

  return (
    <div className="min-h-full pb-10">
      <div className="max-w-[1600px] mx-auto">
        {/* 1. 页面顶部欢迎区 / Hero */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-white p-6 md:p-8 mb-6">
          <div className="absolute right-0 top-0 h-full w-1/2 opacity-40 pointer-events-none">
            <div className="absolute right-6 top-6 w-32 h-32 rounded-full bg-indigo-100 blur-2xl" />
            <div className="absolute right-24 bottom-6 w-40 h-40 rounded-full bg-blue-100 blur-3xl" />
          </div>

          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
                  <GitBranch className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-text tracking-tight">流程管理中心</h1>
              </div>
              <p className="text-sm text-text-muted max-w-xl">
                统一沉淀企业内部 SOP 规范、操作流程与标准手册，让员工快速找到所需流程模板。
              </p>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-subtle" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={handleSearch}
                  placeholder="按流程名称 / 关键词 / 业务口搜索"
                  className="ui-input pl-9 w-full md:w-80"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateTemplate} icon={Plus}>新建流程模板</Button>
                <Button variant="secondary" onClick={() => handleNav('/process/templates', '流程模板列表')}>
                  查看全部流程
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 2. 核心数据概览卡片区 */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-6">
          {statsData.map((stat) => (
            <Card key={stat.id} padding="md" className="flex items-start gap-4">
              <ToneIcon tone={stat.tone} icon={stat.icon} />
              <div>
                <p className="text-xs text-text-subtle">{stat.label}</p>
                <p className="text-2xl font-bold text-text mt-0.5">{stat.value}</p>
                <p className="text-xs text-text-muted mt-1">{stat.desc}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* 3. 业务口分类入口区 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="ui-section-title text-base">业务口分类</h2>
            <button
              onClick={() => handleNav('/process/categories', '流程分类管理')}
              className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1"
            >
              管理分类 <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {filteredCategories.length === 0 ? (
            <Card padding="lg" className="text-center text-text-muted">
              <Box className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">未找到匹配的分类</p>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {filteredCategories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Card
                    key={cat.id}
                    interactive
                    onClick={() => handleNav(`/process/category/${cat.id}`, cat.name)}
                    className="group p-5"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', cat.lightColor)}>
                        <Icon className={cn('w-6 h-6', cat.textColor)} />
                      </div>
                      <span className="text-xs text-text-subtle bg-surface-subtle px-2 py-1 rounded-full">
                        {cat.count} 个流程
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-text mb-1">{cat.name}</h3>
                    <p className="text-sm text-text-muted mb-4 line-clamp-2">{cat.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-subtle">最近更新：{cat.updatedAt}</span>
                      <span className="text-xs font-medium text-brand-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        查看流程
                      </span>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* 中部：推荐流程 + 最近更新 */}
        <div className="grid gap-6 lg:grid-cols-3 mb-6">
          {/* 4. 推荐流程 / 热门流程区 */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h2 className="ui-section-title text-base">推荐流程</h2>
              </div>
              <button
                onClick={() => handleNav('/process/templates', '流程模板列表')}
                className="text-sm text-text-subtle hover:text-text flex items-center gap-1"
              >
                查看更多 <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {featuredProcesses.map((proc) => (
                <Card
                  key={proc.id}
                  interactive
                  onClick={() => handleNav(`/process/detail/${proc.id}`, proc.name)}
                  className="group p-5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <StatusBadge status={proc.status} />
                    <span className="text-xs text-text-subtle flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {proc.viewCount}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-text mb-1 group-hover:text-brand-700 transition-colors">
                    {proc.name}
                  </h3>
                  <p className="text-xs text-text-subtle mb-2">
                    {proc.code} · {proc.category} · {proc.version}
                  </p>
                  <p className="text-sm text-text-muted mb-4 line-clamp-2">{proc.summary}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {proc.tags.map((tag) => (
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
                  <div className="mt-4 pt-3 border-t border-border flex items-center gap-1 text-xs text-text-subtle">
                    <Clock className="w-3.5 h-3.5" />
                    更新于 {proc.updateTime}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* 5. 最近更新区 */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-text-subtle" />
                <h2 className="ui-section-title text-base">最近更新</h2>
              </div>
              <span className="text-xs text-text-subtle">近 7 天</span>
            </div>

            <Card padding="md" className="h-full">
              <div className="relative pl-3">
                <div className="absolute left-[19px] top-2 bottom-2 w-px bg-border" />
                <div className="space-y-4">
                  {recentUpdates.map((item, idx) => (
                    <div
                      key={item.id}
                      onClick={() => handleNav(`/process/detail/${item.code}`, item.processName)}
                      className="relative cursor-pointer group"
                    >
                      <span
                        className={cn(
                          'absolute left-0 top-1.5 w-2 h-2 rounded-full border-2 bg-white z-10',
                          idx === 0 ? 'border-brand-500' : 'border-border group-hover:border-brand-300'
                        )}
                        style={{ transform: 'translateX(-3px)' }}
                      />
                      <div className="pl-5">
                        <p className="text-sm font-medium text-text group-hover:text-brand-700 transition-colors">
                          {item.processName}
                        </p>
                        <p className="text-xs text-text-subtle mt-0.5">
                          {item.category} · {item.version}
                        </p>
                        <p className="text-xs text-text-muted mt-1 line-clamp-2">
                          {item.changeSummary}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-text-subtle">
                          <Clock className="w-3 h-3" />
                          <span>{item.updateTime}</span>
                          <span>·</span>
                          <span>{item.updater}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* 6. 底部快捷入口区 */}
        <div>
          <h2 className="ui-section-title text-base mb-4">快捷入口</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Card
                  key={link.id}
                  interactive
                  onClick={() => handleNav(link.path, link.name)}
                  className="group flex items-center gap-3 p-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-surface-subtle flex items-center justify-center group-hover:bg-brand-50 transition-colors">
                    <Icon className="w-5 h-5 text-text-muted group-hover:text-brand-600 transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text">{link.name}</p>
                    <p className="text-xs text-text-muted">{link.desc}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Loading / 空状态预留演示 */}
        {loading && (
          <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="flex items-center gap-2 text-text-muted">
              <div className="w-5 h-5 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
              <span className="text-sm">加载中…</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
