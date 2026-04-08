// src/pages/process/ProcessCategoryPage.js
// 流程管理 / SOP 规范中心 - 流程分类管理页（Mock 数据）
import React, { useMemo, useState } from 'react';
import {
  ArrowLeft, Plus, Search, RotateCcw, LayoutGrid, List, Eye, FileEdit,
  Power, PowerOff, MoreHorizontal, CheckCircle2, X, AlertCircle,
  Archive, Sparkles, Clock, Layers, FolderOpen, ChevronRight, Info,
  ShoppingCart, Warehouse, TestTube, PenTool, MessageSquareWarning,
  DollarSign, Users, FileCheck, GripVertical
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import TableShell from '../../components/ui/TableShell';
import cn from '../../utils/cn';

// -------------------- Mock 数据 --------------------
const summaryStats = {
  totalCategories: 8,
  activeCategories: 8,
  disabledCategories: 0,
  coveredBusinessUnits: 8,
  totalTemplates: 186,
  newThisMonth: 1,
};

const categoryIcons = {
  procurement: ShoppingCart,
  warehouse: Warehouse,
  quality: TestTube,
  design: PenTool,
  complaint: MessageSquareWarning,
  finance: DollarSign,
  hr: Users,
  general: FileCheck,
};

const categoryColors = {
  procurement: { bg: 'bg-amber-500', light: 'bg-amber-50', text: 'text-amber-600' },
  warehouse: { bg: 'bg-sky-500', light: 'bg-sky-50', text: 'text-sky-600' },
  quality: { bg: 'bg-cyan-500', light: 'bg-cyan-50', text: 'text-cyan-600' },
  design: { bg: 'bg-violet-500', light: 'bg-violet-50', text: 'text-violet-600' },
  complaint: { bg: 'bg-rose-500', light: 'bg-rose-50', text: 'text-rose-600' },
  finance: { bg: 'bg-emerald-500', light: 'bg-emerald-50', text: 'text-emerald-600' },
  hr: { bg: 'bg-pink-500', light: 'bg-pink-50', text: 'text-pink-600' },
  general: { bg: 'bg-slate-500', light: 'bg-slate-100', text: 'text-slate-600' },
};

const mockCategories = [
  {
    id: 'c1', code: 'CAT-CG', name: '采购管理', description: '供应商准入、采购下单、询比价、核价与供应商管理相关流程。',
    iconKey: 'procurement', status: 'active', isRecommended: true, sort: 1,
    templateCount: 24, updateTime: '2024-03-22 10:30', updater: '张伟',
    recentTemplateName: '采购下单标准流程', remark: '核心业务流程分类',
  },
  {
    id: 'c2', code: 'CAT-CC', name: '仓储管理', description: '出入库、盘点、库内作业、移库调拨及异常处理相关流程。',
    iconKey: 'warehouse', status: 'active', isRecommended: true, sort: 2,
    templateCount: 21, updateTime: '2024-03-20 17:10', updater: '刘洋',
    recentTemplateName: '仓库异常出入库处理流程', remark: '',
  },
  {
    id: 'c3', code: 'CAT-QC', name: '质量管理', description: '来料质检、成品出货检、客诉处理、质量异常停线及改善闭环流程。',
    iconKey: 'quality', status: 'active', isRecommended: true, sort: 3,
    templateCount: 19, updateTime: '2024-03-21 16:00', updater: '王芳',
    recentTemplateName: '来料质检处理规范', remark: '',
  },
  {
    id: 'c4', code: 'CAT-SJ', name: '设计管理', description: '设计需求提交、评审、变更、版本归档及交付确认相关流程。',
    iconKey: 'design', status: 'active', isRecommended: false, sort: 4,
    templateCount: 16, updateTime: '2024-03-18 09:40', updater: '孙丽',
    recentTemplateName: '设计需求评审与提交流程', remark: '',
  },
  {
    id: 'c5', code: 'CAT-KS', name: '客诉处理', description: '客诉受理、问题升级、退货质检、退款及回访闭环流程。',
    iconKey: 'complaint', status: 'active', isRecommended: false, sort: 5,
    templateCount: 14, updateTime: '2024-03-19 09:15', updater: '陈晨',
    recentTemplateName: '客诉问题升级与闭环流程', remark: '',
  },
  {
    id: 'c6', code: 'CAT-CW', name: '财务管理', description: '费用报销、预算编制、付款审批、资金计划及对账相关流程。',
    iconKey: 'finance', status: 'active', isRecommended: true, sort: 6,
    templateCount: 28, updateTime: '2024-03-23 14:20', updater: '李婷',
    recentTemplateName: '费用报销资料提报规范', remark: '高频使用分类',
  },
  {
    id: 'c7', code: 'CAT-RS', name: '人事行政', description: '新员工入职、考勤申诉、绩效面谈、行政事务及员工关怀流程。',
    iconKey: 'hr', status: 'active', isRecommended: false, sort: 7,
    templateCount: 35, updateTime: '2024-03-24 11:00', updater: '王敏',
    recentTemplateName: '新员工入职办理流程', remark: '',
  },
  {
    id: 'c8', code: 'CAT-TY', name: '通用规范', description: '跨部门协作、信息安全、会议管理、文档规范等通用流程与制度。',
    iconKey: 'general', status: 'active', isRecommended: false, sort: 8,
    templateCount: 29, updateTime: '2024-03-17 15:45', updater: '吴磊',
    recentTemplateName: '跨部门协作沟通规范', remark: '',
  },
];

// -------------------- 辅助组件 --------------------
const StatusBadge = ({ status }) => {
  if (status === 'active') return <Badge tone="success">启用</Badge>;
  return <Badge tone="danger">停用</Badge>;
};

const RecommendBadge = ({ isRecommended }) => {
  if (!isRecommended) return null;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border bg-amber-50 border-amber-100 text-amber-700 text-[10px] font-medium">
      <Sparkles className="w-3 h-3" /> 推荐
    </span>
  );
};

// -------------------- 主页面 --------------------
export default function ProcessCategoryPage({ onNavigate }) {
  const [categories, setCategories] = useState(mockCategories);
  const [viewMode, setViewMode] = useState('card'); // 'card' | 'table'

  // 筛选状态
  const [keywords, setKeywords] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [recommendFilter, setRecommendFilter] = useState('all');
  const [sortBy, setSortBy] = useState('sort');

  // 抽屉状态
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // 表单状态
  const [formData, setFormData] = useState({
    name: '', code: '', description: '', iconKey: 'procurement',
    sort: 1, status: 'active', isRecommended: false, remark: ''
  });
  const [formErrors, setFormErrors] = useState({});

  const handleNav = (path, name) => {
    if (onNavigate) onNavigate(path, name || '流程管理');
  };

  // 筛选逻辑
  const filteredCategories = useMemo(() => {
    let data = categories.filter((c) => {
      const matchKeywords = !keywords.trim() ||
        [c.name, c.code, c.description].some((t) =>
          t.toLowerCase().includes(keywords.trim().toLowerCase())
        );
      const matchStatus = statusFilter === 'all' || c.status === statusFilter;
      const matchRecommend = recommendFilter === 'all'
        || (recommendFilter === 'recommended' && c.isRecommended)
        || (recommendFilter === 'normal' && !c.isRecommended);
      return matchKeywords && matchStatus && matchRecommend;
    });

    if (sortBy === 'sort') {
      data = [...data].sort((a, b) => a.sort - b.sort);
    } else if (sortBy === 'count-desc') {
      data = [...data].sort((a, b) => b.templateCount - a.templateCount);
    } else if (sortBy === 'time-desc') {
      data = [...data].sort((a, b) => new Date(b.updateTime) - new Date(a.updateTime));
    }
    return data;
  }, [categories, keywords, statusFilter, recommendFilter, sortBy]);

  const resetFilters = () => {
    setKeywords('');
    setStatusFilter('all');
    setRecommendFilter('all');
    setSortBy('sort');
  };

  const openCreate = () => {
    setEditingCategory(null);
    setFormData({
      name: '', code: '', description: '', iconKey: 'procurement',
      sort: categories.length + 1, status: 'active', isRecommended: false, remark: ''
    });
    setFormErrors({});
    setDrawerOpen(true);
  };

  const openEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name, code: cat.code, description: cat.description,
      iconKey: cat.iconKey, sort: cat.sort, status: cat.status,
      isRecommended: cat.isRecommended, remark: cat.remark || ''
    });
    setFormErrors({});
    setDrawerOpen(true);
  };

  const closeDrawer = () => setDrawerOpen(false);

  const handleSave = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = '请输入分类名称';
    if (!formData.code.trim()) errors.code = '请输入分类编码';
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    if (editingCategory) {
      setCategories((prev) => prev.map((c) => c.id === editingCategory.id ? {
        ...c, ...formData, updateTime: new Date().toLocaleString(), updater: '当前用户'
      } : c));
    } else {
      const newCat = {
        id: `c${Date.now()}`,
        ...formData,
        templateCount: 0,
        updateTime: new Date().toLocaleString(),
        updater: '当前用户',
        recentTemplateName: '-',
      };
      setCategories((prev) => [...prev, newCat]);
    }
    closeDrawer();
  };

  const toggleStatus = (cat) => {
    setCategories((prev) => prev.map((c) => c.id === cat.id ? {
      ...c, status: c.status === 'active' ? 'disabled' : 'active'
    } : c));
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 text-text-muted">
      <Archive className="w-12 h-12 mb-3 opacity-30" />
      <p className="text-sm">暂无符合条件的分类</p>
      <Button variant="ghost" size="sm" className="mt-3" onClick={resetFilters}>重置筛选</Button>
    </div>
  );

  return (
    <div className="min-h-full pb-10">
      <div className="max-w-[1600px] mx-auto">
        {/* 1. 顶部页面信息区 */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-sm text-text-subtle mb-1">
              <span className="cursor-pointer hover:text-brand-700" onClick={() => handleNav('/process/overview', '流程概览')}>流程管理中心</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-text">流程分类管理</span>
            </div>
            <h1 className="ui-page-title">流程分类管理</h1>
            <p className="mt-1 text-sm text-text-muted">
              统一维护 SOP 流程模板所属分类与业务归档结构
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" size="md" icon={ArrowLeft} onClick={() => handleNav('/process/overview', '流程概览')}>
              返回流程概览
            </Button>
            <Button variant="secondary" size="md" onClick={() => handleNav('/process/templates', '流程模板列表')}>
              查看全部模板
            </Button>
            <Button size="md" icon={Plus} onClick={openCreate}>
              新建分类
            </Button>
          </div>
        </div>

        <p className="text-sm text-text-muted mb-6">
          分类用于组织企业内部 SOP 模板，便于查询、归档与统一管理。
        </p>

        {/* 2. 统计概览区 */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-6">
          <Card padding="md" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center"><Layers className="w-5 h-5 text-brand-600" /></div>
            <div><p className="text-xs text-text-subtle">分类总数</p><p className="text-2xl font-bold text-text">{summaryStats.totalCategories}</p></div>
          </Card>
          <Card padding="md" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success-50 flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-success-600" /></div>
            <div><p className="text-xs text-text-subtle">启用中</p><p className="text-2xl font-bold text-text">{summaryStats.activeCategories}</p></div>
          </Card>
          <Card padding="md" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-danger-50 flex items-center justify-center"><PowerOff className="w-5 h-5 text-danger-600" /></div>
            <div><p className="text-xs text-text-subtle">已停用</p><p className="text-2xl font-bold text-text">{summaryStats.disabledCategories}</p></div>
          </Card>
          <Card padding="md" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center"><FolderOpen className="w-5 h-5 text-sky-600" /></div>
            <div><p className="text-xs text-text-subtle">覆盖业务口</p><p className="text-2xl font-bold text-text">{summaryStats.coveredBusinessUnits}</p></div>
          </Card>
          <Card padding="md" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center"><FileEdit className="w-5 h-5 text-violet-600" /></div>
            <div><p className="text-xs text-text-subtle">模板总数</p><p className="text-2xl font-bold text-text">{summaryStats.totalTemplates}</p></div>
          </Card>
          <Card padding="md" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center"><Clock className="w-5 h-5 text-amber-600" /></div>
            <div><p className="text-xs text-text-subtle">本月新增</p><p className="text-2xl font-bold text-text">{summaryStats.newThisMonth}</p></div>
          </Card>
        </div>

        {/* 3. 筛选与搜索区 */}
        <Card padding="md" className="mb-5">
          <div className="flex flex-col md:flex-row md:items-end gap-3">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs text-text-subtle mb-1.5">关键词</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-subtle" />
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="分类名称 / 编码 / 描述"
                  className="ui-input pl-9 w-full"
                />
              </div>
            </div>
            <div className="w-full md:w-36">
              <label className="block text-xs text-text-subtle mb-1.5">状态</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="ui-select">
                <option value="all">全部</option>
                <option value="active">启用</option>
                <option value="disabled">停用</option>
              </select>
            </div>
            <div className="w-full md:w-36">
              <label className="block text-xs text-text-subtle mb-1.5">推荐状态</label>
              <select value={recommendFilter} onChange={(e) => setRecommendFilter(e.target.value)} className="ui-select">
                <option value="all">全部</option>
                <option value="recommended">推荐分类</option>
                <option value="normal">普通分类</option>
              </select>
            </div>
            <div className="w-full md:w-40">
              <label className="block text-xs text-text-subtle mb-1.5">排序方式</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="ui-select">
                <option value="sort">按展示顺序</option>
                <option value="count-desc">按模板数量</option>
                <option value="time-desc">按更新时间</option>
              </select>
            </div>
            <div className="flex gap-2 md:ml-auto">
              <Button variant="ghost" size="sm" icon={RotateCcw} onClick={resetFilters}>重置</Button>
            </div>
          </div>
        </Card>

        {/* 展示模式切换 + 数量 */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-text-muted">
            共 <span className="font-semibold text-text">{filteredCategories.length}</span> 个分类
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

        {/* 4. 分类主展示区 */}
        {viewMode === 'card' && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCategories.length === 0 && <div className="sm:col-span-2 lg:col-span-3 xl:col-span-4"><EmptyState /></div>}
            {filteredCategories.map((cat) => {
              const Icon = categoryIcons[cat.iconKey] || FolderOpen;
              const colors = categoryColors[cat.iconKey] || categoryColors.general;
              return (
                <Card
                  key={cat.id}
                  padding="md"
                  className={cn(
                    'group transition-all hover:border-border-strong hover:shadow-sm',
                    cat.status === 'disabled' && 'opacity-70 bg-surface-subtle'
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', colors.light)}>
                      <Icon className={cn('w-6 h-6', colors.text)} />
                    </div>
                    <div className="flex items-center gap-1">
                      {cat.isRecommended && <RecommendBadge isRecommended={cat.isRecommended} />}
                      <StatusBadge status={cat.status} />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-text mb-1">{cat.name}</h3>
                  <p className="text-xs text-text-subtle mb-2">{cat.code} · 顺序 {cat.sort}</p>
                  <p className="text-sm text-text-muted mb-4 line-clamp-2">{cat.description}</p>

                  <div className="flex items-center justify-between text-xs text-text-subtle mb-3">
                    <span>模板 <span className="font-semibold text-text">{cat.templateCount}</span> 个</span>
                    <span>{cat.updateTime}</span>
                  </div>

                  {cat.recentTemplateName && cat.recentTemplateName !== '-' && (
                    <div className="mb-3 p-2.5 rounded-lg bg-surface-subtle text-xs">
                      <span className="text-text-subtle">最近更新：</span>
                      <span className="text-text font-medium">{cat.recentTemplateName}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm" className="flex-1" onClick={() => handleNav('/process/templates', `${cat.name}模板列表`)} icon={Eye}>查看模板</Button>
                    <Button variant="ghost" size="sm" onClick={() => openEdit(cat)} icon={FileEdit}>编辑</Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleStatus(cat)}
                      icon={cat.status === 'active' ? PowerOff : Power}
                    >
                      {cat.status === 'active' ? '停用' : '启用'}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {viewMode === 'table' && (
          <TableShell className="mb-0" bodyClassName="overflow-x-auto" emptyState={filteredCategories.length === 0 ? <EmptyState /> : null} pagination={null}>
            <table className="w-full text-sm">
              <thead className="bg-surface-subtle">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-text-subtle">分类编码</th>
                  <th className="px-4 py-3 text-left font-medium text-text-subtle">分类名称</th>
                  <th className="px-4 py-3 text-left font-medium text-text-subtle">描述</th>
                  <th className="px-4 py-3 text-left font-medium text-text-subtle">模板数</th>
                  <th className="px-4 py-3 text-left font-medium text-text-subtle">状态</th>
                  <th className="px-4 py-3 text-left font-medium text-text-subtle">推荐</th>
                  <th className="px-4 py-3 text-left font-medium text-text-subtle">顺序</th>
                  <th className="px-4 py-3 text-left font-medium text-text-subtle">更新时间</th>
                  <th className="px-4 py-3 text-right font-medium text-text-subtle">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredCategories.map((cat) => (
                  <tr key={cat.id} className={cn('hover:bg-surface-subtle/50 transition-colors', cat.status === 'disabled' && 'opacity-60')}>
                    <td className="px-4 py-3 text-text-subtle">{cat.code}</td>
                    <td className="px-4 py-3 font-medium text-text">{cat.name}</td>
                    <td className="px-4 py-3 text-text-muted max-w-xs truncate">{cat.description}</td>
                    <td className="px-4 py-3 text-text-muted">{cat.templateCount}</td>
                    <td className="px-4 py-3"><StatusBadge status={cat.status} /></td>
                    <td className="px-4 py-3">{cat.isRecommended ? <RecommendBadge isRecommended /> : <span className="text-text-subtle">-</span>}</td>
                    <td className="px-4 py-3 text-text-muted">{cat.sort}</td>
                    <td className="px-4 py-3 text-text-muted whitespace-nowrap">{cat.updateTime}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleNav('/process/templates', `${cat.name}模板列表`)} className="p-1.5 rounded-lg hover:bg-surface-subtle text-text-subtle hover:text-text" title="查看模板"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => openEdit(cat)} className="p-1.5 rounded-lg hover:bg-surface-subtle text-text-subtle hover:text-text" title="编辑"><FileEdit className="w-4 h-4" /></button>
                        <button onClick={() => toggleStatus(cat)} className="p-1.5 rounded-lg hover:bg-surface-subtle text-text-subtle hover:text-text" title={cat.status === 'active' ? '停用' : '启用'}>
                          {cat.status === 'active' ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableShell>
        )}

        {/* 8. 底部说明 / 风险提示区 */}
        <Card padding="md" className="mt-6 bg-surface-subtle border-border">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-text mb-2">分类管理说明</h4>
              <ul className="list-disc list-inside text-sm text-text-muted space-y-1">
                <li>分类主要用于组织流程模板，不涉及权限隔离或数据隔离。</li>
                <li>停用分类后，已有模板可保留历史归属，但不建议继续将新模板归入该分类。</li>
                <li>建议分类名称清晰、业务归属明确，避免频繁调整导致用户查找困难。</li>
                <li>推荐分类将在流程概览页优先展示，建议仅对高频、重点业务口启用推荐。</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>

      {/* 6. 分类编辑抽屉 */}
      {drawerOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={closeDrawer} />
          <div className="fixed right-0 top-0 h-full w-full md:w-[480px] bg-surface shadow-2xl z-50 flex flex-col animate-drawer-in">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-base font-bold text-text">{editingCategory ? '编辑分类' : '新建分类'}</h2>
              <button onClick={closeDrawer} className="p-2 rounded-lg hover:bg-surface-subtle text-text-subtle">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div>
                <Label required>分类名称</Label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={cn('ui-input', formErrors.name && 'border-danger-500')}
                  placeholder="如：采购管理"
                />
                {formErrors.name && <p className="text-xs text-danger-600 mt-1">{formErrors.name}</p>}
              </div>
              <div>
                <Label required>分类编码</Label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className={cn('ui-input', formErrors.code && 'border-danger-500')}
                  placeholder="如：CAT-CG"
                />
                {formErrors.code && <p className="text-xs text-danger-600 mt-1">{formErrors.code}</p>}
              </div>
              <div>
                <Label>分类描述</Label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="ui-textarea"
                  placeholder="简述该分类的业务范围与用途"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>分类图标</Label>
                  <select
                    value={formData.iconKey}
                    onChange={(e) => setFormData({ ...formData, iconKey: e.target.value })}
                    className="ui-select"
                  >
                    {Object.keys(categoryIcons).map((key) => (
                      <option key={key} value={key}>{key}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>展示顺序</Label>
                  <input
                    type="number"
                    value={formData.sort}
                    onChange={(e) => setFormData({ ...formData, sort: parseInt(e.target.value || 0, 10) })}
                    className="ui-input"
                    placeholder="数字越小越靠前"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>状态</Label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="ui-select"
                  >
                    <option value="active">启用</option>
                    <option value="disabled">停用</option>
                  </select>
                </div>
                <div>
                  <Label>是否推荐</Label>
                  <div className="flex items-center gap-3 h-10">
                    <label className="flex items-center gap-2 text-sm text-text cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isRecommended}
                        onChange={(e) => setFormData({ ...formData, isRecommended: e.target.checked })}
                        className="w-4 h-4 rounded border-border text-brand-600 focus:ring-brand-100"
                      />
                      设为推荐分类
                    </label>
                  </div>
                </div>
              </div>
              <div>
                <Label>备注</Label>
                <textarea
                  value={formData.remark}
                  onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                  rows={2}
                  className="ui-textarea"
                  placeholder="补充备注信息"
                />
              </div>
            </div>
            <div className="p-5 border-t border-border flex items-center justify-end gap-2">
              <Button variant="secondary" onClick={closeDrawer}>取消</Button>
              <Button onClick={handleSave}>保存</Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const Label = ({ children, required }) => (
  <label className="block text-sm font-medium text-text mb-1.5">
    {children}
    {required && <span className="text-danger-500 ml-0.5">*</span>}
  </label>
);
