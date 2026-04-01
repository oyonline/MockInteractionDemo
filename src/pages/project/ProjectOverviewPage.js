import React, { useMemo, useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  Filter,
  FolderKanban,
  Palette,
  Search,
  SlidersHorizontal,
  Tags,
  Users,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import TableShell from '../../components/ui/TableShell';
import cn from '../../utils/cn';
import {
  getCategoryMeta,
  getPriorityMeta,
  getProjectStatusMeta,
  getProjectTypeMeta,
  projectManagementMeta,
  projectManagementProjects,
} from '../../mock/project/management';

const GROUP_LABELS = {
  status: '项目状态',
  category: '类目 Category',
  market: '主营市场',
};

const STATUS_ORDER = ['in_progress', 'completed', 'pending', 'paused', 'delayed'];

const TOOLBAR_BUTTONS = [
  { key: 'filter', label: '筛选', icon: Filter },
  { key: 'sort', label: '排序', icon: ChevronsUpDown },
  { key: 'category', label: '类目 Category', icon: Tags },
  { key: 'group', label: '分组', icon: SlidersHorizontal },
  { key: 'color', label: '设置颜色', icon: Palette },
];

function PersonStack({ people, limit = 2 }) {
  if (!people || people.length === 0) {
    return <span className="text-sm text-text-subtle">待分配</span>;
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2">
        {people.slice(0, limit).map((person) => (
          <div
            key={`${person.name}-${person.role}`}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-xs font-semibold shadow-sm',
              person.accent || 'bg-slate-100 text-slate-700'
            )}
            title={`${person.name} · ${person.role}`}
          >
            {person.name.slice(0, 1)}
          </div>
        ))}
        {people.length > limit && (
          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-xs font-semibold text-slate-600 shadow-sm">
            +{people.length - limit}
          </div>
        )}
      </div>
      <div className="min-w-0">
        <div className="truncate text-sm font-medium text-text">{people[0].name}</div>
        <div className="truncate text-xs text-text-subtle">{people[0].role}</div>
      </div>
    </div>
  );
}

function ToolbarButton({ label, icon: Icon, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex h-9 items-center gap-2 rounded-xl border px-3 text-sm transition-colors',
        active
          ? 'border-brand-200 bg-brand-50 text-brand-700'
          : 'border-border bg-white text-text-muted hover:bg-surface-subtle'
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}

function GroupSection({
  colorMode,
  isCollapsed,
  label,
  onToggle,
  projects,
  onOpenProject,
}) {
  return (
    <Card className="overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between border-b border-border bg-white px-5 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 text-text-subtle" />
          ) : (
            <ChevronDown className="h-4 w-4 text-text-subtle" />
          )}
          <div>
            <div className="text-sm font-semibold text-text">{label}</div>
            <div className="text-xs text-text-subtle">共 {projects.length} 个项目</div>
          </div>
        </div>
        <Badge tone="neutral">{isCollapsed ? '已折叠' : '展开中'}</Badge>
      </button>

      {!isCollapsed && (
        <TableShell bodyClassName="overflow-x-auto" minWidth={1800}>
          <table className="w-full table-fixed border-collapse text-sm">
            <thead className="bg-slate-50/90">
              <tr className="border-b border-border">
                {[
                  '类目 Category',
                  '计划上市时间',
                  '项目名称 ProjectName',
                  '最新评论',
                  '项目状态',
                  '产品经理 Product Manager',
                  '当前负责人',
                  '主营市场 Main Market',
                  '工厂反馈交期',
                  'PM样品提供',
                  '产品优先级',
                  '业务线',
                  '开模项目/非开模项目',
                  '创建时间',
                  '创建者',
                ].map((column) => (
                  <th
                    key={column}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-subtle"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => {
                const categoryMeta = getCategoryMeta(project.category);
                const statusMeta = getProjectStatusMeta(project.status);
                const priorityMeta = getPriorityMeta(project.priority);
                const typeMeta = getProjectTypeMeta(project.projectType);

                return (
                  <tr
                    key={project.id}
                    onClick={() => onOpenProject && onOpenProject(project)}
                    className={cn(
                      'cursor-pointer border-b border-border/80 bg-white align-top transition-colors hover:bg-slate-50/70',
                      colorMode === 'accent' && 'hover:bg-brand-50/70'
                    )}
                  >
                    <td className="px-4 py-4">
                      <span
                        className={cn(
                          'inline-flex rounded-full border px-2.5 py-1 text-xs font-medium',
                          categoryMeta.className
                        )}
                      >
                        {project.category}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-text">{project.plannedLaunchDate}</td>
                    <td className="px-4 py-4">
                      <div className="max-w-[260px]">
                        <div className="truncate text-sm font-semibold text-text">{project.projectName}</div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-text-subtle">
                          <span>{project.id}</span>
                          <span>·</span>
                          <span>{project.brand}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                        <div className="max-w-[220px] text-sm text-text-muted">
                        {project.latestComment ? (
                          <span className="block max-w-[220px] overflow-hidden text-ellipsis whitespace-nowrap">
                            {project.latestComment}
                          </span>
                        ) : (
                          <span className="text-text-subtle">暂无</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={cn(
                          'inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium',
                          statusMeta.className
                        )}
                      >
                        <span className={cn('h-2 w-2 rounded-full', statusMeta.dotClassName)} />
                        {statusMeta.label}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <PersonStack people={[project.productManager]} limit={1} />
                    </td>
                    <td className="px-4 py-4">
                      <PersonStack people={project.currentOwners} />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex max-w-[220px] flex-wrap gap-2">
                        {project.mainMarkets.map((market) => (
                          <span
                            key={market}
                            className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                          >
                            {market}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-text-muted">{project.factoryLeadTimeFeedback}</td>
                    <td className="px-4 py-4 text-sm text-text-muted">{project.pmSampleProvided}</td>
                    <td className="px-4 py-4">
                      <span
                        className={cn(
                          'inline-flex rounded-full border px-2.5 py-1 text-xs font-medium',
                          priorityMeta.className
                        )}
                      >
                        {priorityMeta.label}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-text">{project.businessLine}</td>
                    <td className="px-4 py-4">
                      <span
                        className={cn(
                          'inline-flex rounded-full border px-2.5 py-1 text-xs font-medium',
                          typeMeta.className
                        )}
                      >
                        {typeMeta.label}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-text-muted">{project.createdAt}</td>
                    <td className="px-4 py-4">
                      <PersonStack people={[project.creator]} limit={1} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </TableShell>
      )}
    </Card>
  );
}

export default function ProjectOverviewPage({ onOpenProject, onCreateProject }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('全部类目');
  const [groupBy, setGroupBy] = useState('status');
  const [sortBy, setSortBy] = useState('最近创建');
  const [colorMode, setColorMode] = useState('soft');
  const [showFilters, setShowFilters] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState({});

  const filteredProjects = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const projects = projectManagementProjects.filter((project) => {
      const matchedQuery =
        !normalizedQuery ||
        [
          project.id,
          project.projectName,
          project.productManager.name,
          project.brand,
          project.businessLine,
        ]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery);

      const matchedCategory = categoryFilter === '全部类目' || project.category === categoryFilter;
      const matchedStatus = !statusFilter || project.status === statusFilter;

      return matchedQuery && matchedCategory && matchedStatus;
    });

    const sortedProjects = [...projects];
    sortedProjects.sort((left, right) => {
      if (sortBy === '最近创建') return right.createdAt.localeCompare(left.createdAt);
      if (sortBy === '最早上市') return left.plannedLaunchDate.localeCompare(right.plannedLaunchDate);
      if (sortBy === '优先级') return left.priority.localeCompare(right.priority);
      return left.projectName.localeCompare(right.projectName, 'zh-CN');
    });

    return sortedProjects;
  }, [categoryFilter, searchQuery, sortBy, statusFilter]);

  const groupedProjects = useMemo(() => {
    const buckets = filteredProjects.reduce((accumulator, project) => {
      let key = project.status;
      let label = getProjectStatusMeta(project.status).label;

      if (groupBy === 'category') {
        key = project.category;
        label = project.category;
      }

      if (groupBy === 'market') {
        key = project.mainMarkets[0];
        label = project.mainMarkets[0];
      }

      if (!accumulator[key]) {
        accumulator[key] = { key, label, items: [] };
      }

      accumulator[key].items.push(project);
      return accumulator;
    }, {});

    const groups = Object.values(buckets);
    if (groupBy === 'status') {
      groups.sort((left, right) => STATUS_ORDER.indexOf(left.key) - STATUS_ORDER.indexOf(right.key));
    } else {
      groups.sort((left, right) => left.label.localeCompare(right.label, 'zh-CN'));
    }
    return groups;
  }, [filteredProjects, groupBy]);

  const summary = useMemo(() => {
    return {
      total: projectManagementProjects.length,
      inProgress: projectManagementProjects.filter((item) => item.status === 'in_progress').length,
      delayed: projectManagementProjects.filter((item) => item.status === 'delayed').length,
      members: new Set(
        projectManagementProjects.flatMap((item) => [
          item.productManager.name,
          item.creator.name,
          ...item.currentOwners.map((owner) => owner.name),
        ])
      ).size,
    };
  }, []);

  const toggleGroup = (groupKey) => {
    setCollapsedGroups((current) => ({
      ...current,
      [groupKey]: !current[groupKey],
    }));
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-6">
      <Card className="overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-900 text-white">
        <div className="flex flex-col gap-6 px-6 py-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
              <FolderKanban className="h-3.5 w-3.5" />
              项目管理 / 项目列表
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">项目全生命周期协同台账</h1>
            <p className="mt-2 text-sm leading-6 text-white/70">
              先用 mock 数据把“多维表视图 + 流程推进详情”搭起来，当前版本强调可看、可演示、可切换。
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:min-w-[440px] lg:grid-cols-4">
            {[
              { label: '项目总数', value: summary.total, icon: FolderKanban },
              { label: '进行中', value: summary.inProgress, icon: SlidersHorizontal },
              { label: '延期关注', value: summary.delayed, icon: ChevronsUpDown },
              { label: '协同成员', value: summary.members, icon: Users },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 backdrop-blur-sm">
                  <div className="flex items-center justify-between text-white/70">
                    <span className="text-xs">{item.label}</span>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="mt-2 text-2xl font-semibold text-white">{item.value}</div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            {TOOLBAR_BUTTONS.map((button) => (
              <ToolbarButton
                key={button.key}
                label={button.key === 'group' ? `分组：${GROUP_LABELS[groupBy]}` : button.label}
                icon={button.icon}
                active={
                  (button.key === 'filter' && showFilters) ||
                  (button.key === 'color' && colorMode === 'accent')
                }
                onClick={() => {
                  if (button.key === 'filter') setShowFilters((value) => !value);
                  if (button.key === 'color') setColorMode((value) => (value === 'soft' ? 'accent' : 'soft'));
                }}
              />
            ))}
          </div>

          <div className="relative w-full xl:w-[320px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="ui-input pl-10"
              placeholder="查找项目名称 / ID / PM"
            />
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 grid gap-4 border-t border-border pt-4 md:grid-cols-2 xl:grid-cols-4">
            <label className="block">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-subtle">项目状态</div>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="ui-select"
              >
                <option value="">全部状态</option>
                {STATUS_ORDER.map((status) => (
                  <option key={status} value={status}>
                    {getProjectStatusMeta(status).label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-subtle">类目 Category</div>
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="ui-select"
              >
                {projectManagementMeta.toolbarOptions.categories.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-subtle">分组</div>
              <select
                value={groupBy}
                onChange={(event) => {
                  const nextGroup = event.target.value;
                  setGroupBy(nextGroup);
                  setCollapsedGroups({});
                }}
                className="ui-select"
              >
                <option value="status">项目状态</option>
                <option value="category">类目 Category</option>
                <option value="market">主营市场</option>
              </select>
            </label>
            <label className="block">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-subtle">排序</div>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="ui-select"
              >
                {projectManagementMeta.toolbarOptions.sorts.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
      </Card>

      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-text">
            当前分组：{GROUP_LABELS[groupBy]} / 共 {filteredProjects.length} 个项目
          </div>
          <div className="mt-1 text-xs text-text-subtle">
            搜索、筛选、分组、排序均为前端 mock 交互，行点击可进入项目详情。
          </div>
        </div>
        <Button variant="secondary" onClick={onCreateProject}>
          新建项目
        </Button>
      </div>

      <div className="flex flex-col gap-4 pb-2">
        {groupedProjects.length > 0 ? (
          groupedProjects.map((group) => (
            <GroupSection
              key={group.key}
              colorMode={colorMode}
              isCollapsed={Boolean(collapsedGroups[group.key])}
              label={group.label}
              onToggle={() => toggleGroup(group.key)}
              projects={group.items}
              onOpenProject={onOpenProject}
            />
          ))
        ) : (
          <Card className="border-dashed p-10 text-center">
            <div className="text-base font-semibold text-text">当前筛选条件下暂无项目</div>
            <div className="mt-2 text-sm text-text-subtle">可以试着清空搜索词或调整筛选条件。</div>
          </Card>
        )}
      </div>
    </div>
  );
}
