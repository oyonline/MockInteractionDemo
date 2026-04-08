// src/pages/process/ProcessTemplateVersionPage.js
// 流程管理 / SOP 规范中心 - 流程模板版本记录页（Mock 数据）
import React, { useMemo, useState } from 'react';
import {
  ArrowLeft, FileEdit, Plus, RotateCcw, Search, Eye, GitCompare, Undo2,
  MoreHorizontal, Clock, CheckCircle2, Archive, AlertCircle, FileText,
  ChevronRight, History, Info, Sparkles, BarChart3, BookOpen, X,
  ArrowRight
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import cn from '../../utils/cn';

// -------------------- Mock 数据 --------------------
const templateInfo = {
  id: 't1',
  code: 'SOP-CG-001',
  name: '采购下单标准流程',
  category: '采购管理',
  currentVersion: 'V3.2',
  status: 'published',
  summary: '覆盖从需求提出到订单确认的全链路，含紧急采购绿色通道说明。',
  updateTime: '2024-03-22 10:30',
  updater: '张伟',
};

const versionList = [
  {
    id: 'v5',
    templateId: 't1',
    version: 'V3.2',
    status: 'current',
    publishTime: '2024-03-22 10:30',
    updater: '张伟',
    summary: '增加小额采购直批路径，缩短审批层级；优化审批时效要求说明。',
    highlights: ['新增小额采购直批路径（≤ 5000 元）', '审批层级由 4 级缩减为 3 级', '补充电子签章适用范围'],
    changedSections: ['执行步骤', '流程概述'],
    isMajorUpdate: false,
    note: '本次更新主要针对小额高频采购场景进行效率优化，不影响大额采购审批逻辑。',
  },
  {
    id: 'v4',
    templateId: 't1',
    version: 'V3.1',
    status: 'history',
    publishTime: '2024-02-10 14:00',
    updater: '李婷',
    summary: '优化紧急采购特批说明，补充口头订单事后补录规则。',
    highlights: ['细化紧急采购 48h 补单规则', '新增口头订单风险告知条款'],
    changedSections: ['异常处理', '准备事项'],
    isMajorUpdate: false,
    note: '',
  },
  {
    id: 'v3',
    templateId: 't1',
    version: 'V3.0',
    status: 'history',
    publishTime: '2023-11-05 09:00',
    updater: '王强',
    summary: '新增供应商门户回签要求，明确书面确认作为交期有效依据。',
    highlights: ['新增供应商门户回签步骤', '取消邮件确认作为唯一依据', '补充逾期未回签催办机制'],
    changedSections: ['执行步骤', '输出结果', '检查点'],
    isMajorUpdate: true,
    note: '属于重大更新，涉及第 5 步执行内容变更，已组织采购部全员培训。',
  },
  {
    id: 'v2',
    templateId: 't1',
    version: 'V2.5',
    status: 'history',
    publishTime: '2023-06-20 16:30',
    updater: '刘洋',
    summary: '调整审批阈值，新增预算科目余额检查前置条件。',
    highlights: ['审批阈值由 3万/10万 调整为 5万/20万', '新增 PR 阶段预算余额校验'],
    changedSections: ['执行步骤', '准备事项'],
    isMajorUpdate: false,
    note: '',
  },
  {
    id: 'v1',
    templateId: 't1',
    version: 'V2.0',
    status: 'history',
    publishTime: '2023-01-10 10:00',
    updater: '陈晨',
    summary: '重构执行步骤，将原 5 步扩展为 7 步，新增交期跟踪与单据归档环节。',
    highlights: ['执行步骤由 5 步扩展为 7 步', '新增第 6 步交期跟踪', '新增第 7 步单据归档与闭环'],
    changedSections: ['执行步骤', '输出结果', '关联资料'],
    isMajorUpdate: true,
    note: '属于结构性重大更新，建议相关岗位重新学习。',
  },
  {
    id: 'v0',
    templateId: 't1',
    version: 'V1.0',
    status: 'history',
    publishTime: '2022-08-15 09:00',
    updater: '赵敏',
    summary: '初始发布，建立采购下单标准流程基线版本。',
    highlights: ['建立采购下单基线流程', '明确审批层级与权限要求'],
    changedSections: ['全部'],
    isMajorUpdate: true,
    note: '',
  },
];

const statsData = {
  totalVersions: 6,
  publishedVersions: 5,
  draftVersions: 0,
  majorUpdates: 3,
  recentUpdates: 2,
};

// -------------------- 辅助组件 --------------------
const StatusBadge = ({ status }) => {
  if (status === 'published' || status === 'current') return <Badge tone="success">已发布</Badge>;
  if (status === 'draft') return <Badge tone="warning">草稿</Badge>;
  if (status === 'disabled') return <Badge tone="danger">已停用</Badge>;
  return <Badge tone="neutral">历史版本</Badge>;
};

const VersionDot = ({ status }) => {
  if (status === 'current') {
    return (
      <div className="relative z-10 w-4 h-4 rounded-full bg-brand-600 ring-4 ring-brand-100 flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-white" />
      </div>
    );
  }
  return (
    <div className="relative z-10 w-3 h-3 rounded-full bg-border-strong ring-4 ring-white" />
  );
};

// -------------------- 主页面 --------------------
export default function ProcessTemplateVersionPage({ onNavigate }) {
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('time-desc');
  const [selectedVersions, setSelectedVersions] = useState([]);

  const handleNav = (path, name) => {
    if (onNavigate) onNavigate(path, name || '流程管理');
  };

  // 筛选逻辑
  const filteredVersions = useMemo(() => {
    let data = versionList.filter((v) => {
      const matchSearch = !searchValue.trim() ||
        [v.version, v.summary, v.updater, ...(v.highlights || [])].some((t) =>
          t.toLowerCase().includes(searchValue.trim().toLowerCase())
        );
      const matchStatus = statusFilter === 'all'
        || (statusFilter === 'current' && v.status === 'current')
        || (statusFilter === 'history' && v.status === 'history')
        || (statusFilter === 'draft' && v.status === 'draft');
      return matchSearch && matchStatus;
    });

    if (sortBy === 'time-desc') {
      data = [...data].sort((a, b) => new Date(b.publishTime) - new Date(a.publishTime));
    } else if (sortBy === 'time-asc') {
      data = [...data].sort((a, b) => new Date(a.publishTime) - new Date(b.publishTime));
    } else if (sortBy === 'version-desc') {
      data = [...data].sort((a, b) => b.version.localeCompare(a.version));
    }
    return data;
  }, [searchValue, statusFilter, sortBy]);

  const toggleVersionSelect = (versionId) => {
    setSelectedVersions((prev) => {
      if (prev.includes(versionId)) {
        return prev.filter((id) => id !== versionId);
      }
      if (prev.length >= 2) {
        return [prev[1], versionId];
      }
      return [...prev, versionId];
    });
  };

  const resetFilters = () => {
    setSearchValue('');
    setStatusFilter('all');
    setSortBy('time-desc');
    setSelectedVersions([]);
  };

  const selectedVersionDetails = selectedVersions
    .map((id) => versionList.find((v) => v.id === id))
    .filter(Boolean);

  return (
    <div className="min-h-full pb-10">
      <div className="max-w-[1600px] mx-auto">
        {/* 1. 顶部模板基础信息区 */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-sm text-text-subtle mb-1">
                <span className="cursor-pointer hover:text-brand-700" onClick={() => handleNav('/process/overview', '流程概览')}>流程管理中心</span>
                <ChevronRight className="w-4 h-4" />
                <span className="cursor-pointer hover:text-brand-700" onClick={() => handleNav('/process/templates', '流程模板列表')}>流程模板列表</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-text">版本记录</span>
              </div>
              <h1 className="ui-page-title mb-1">{templateInfo.name}</h1>
              <p className="text-sm text-text-muted mb-2">
                {templateInfo.code} · {templateInfo.category} · 当前生效版本 <span className="font-semibold text-brand-700">{templateInfo.currentVersion}</span>
              </p>
              <p className="text-sm text-text-muted max-w-3xl">{templateInfo.summary}</p>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-text-subtle">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 最近更新：{templateInfo.updateTime}</span>
                <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> 更新人：{templateInfo.updater}</span>
                <span><StatusBadge status={templateInfo.status} /></span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 md:flex-col md:items-end">
              <div className="flex gap-2">
                <Button variant="secondary" size="md" icon={ArrowLeft} onClick={() => handleNav(`/process/detail/${templateInfo.id}`, templateInfo.name)}>
                  返回详情
                </Button>
                <Button size="md" icon={FileEdit} onClick={() => handleNav(`/process/edit/${templateInfo.id}`, `编辑：${templateInfo.name}`)}>
                  编辑当前模板
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" icon={Plus} onClick={() => handleNav(`/process/edit/${templateInfo.id}`, `新建版本：${templateInfo.name}`)}>
                  新建新版本
                </Button>
                <Button variant="ghost" size="sm" icon={MoreHorizontal}>
                  更多
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 5. 版本变更统计区（轻量） */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-6">
          <Card padding="md" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center"><History className="w-5 h-5 text-brand-600" /></div>
            <div>
              <p className="text-xs text-text-subtle">总版本数</p>
              <p className="text-xl font-bold text-text">{statsData.totalVersions}</p>
            </div>
          </Card>
          <Card padding="md" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success-50 flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-success-600" /></div>
            <div>
              <p className="text-xs text-text-subtle">已发布版本</p>
              <p className="text-xl font-bold text-text">{statsData.publishedVersions}</p>
            </div>
          </Card>
          <Card padding="md" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-warning-50 flex items-center justify-center"><FileText className="w-5 h-5 text-warning-600" /></div>
            <div>
              <p className="text-xs text-text-subtle">草稿版本</p>
              <p className="text-xl font-bold text-text">{statsData.draftVersions}</p>
            </div>
          </Card>
          <Card padding="md" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center"><Sparkles className="w-5 h-5 text-rose-600" /></div>
            <div>
              <p className="text-xs text-text-subtle">重大更新次数</p>
              <p className="text-xl font-bold text-text">{statsData.majorUpdates}</p>
            </div>
          </Card>
          <Card padding="md" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center"><BarChart3 className="w-5 h-5 text-sky-600" /></div>
            <div>
              <p className="text-xs text-text-subtle">近 30 天更新</p>
              <p className="text-xl font-bold text-text">{statsData.recentUpdates}</p>
            </div>
          </Card>
        </div>

        {/* 2. 版本筛选与工具区 */}
        <Card padding="md" className="mb-5">
          <div className="flex flex-col md:flex-row md:items-end gap-3">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs text-text-subtle mb-1.5">关键词</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-subtle" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="版本号 / 更新说明 / 更新人"
                  className="ui-input pl-9 w-full"
                />
              </div>
            </div>
            <div className="w-full md:w-40">
              <label className="block text-xs text-text-subtle mb-1.5">版本状态</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="ui-select">
                <option value="all">全部状态</option>
                <option value="current">当前生效</option>
                <option value="history">历史版本</option>
                <option value="draft">草稿版本</option>
              </select>
            </div>
            <div className="w-full md:w-40">
              <label className="block text-xs text-text-subtle mb-1.5">排序方式</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="ui-select">
                <option value="time-desc">时间倒序</option>
                <option value="time-asc">时间正序</option>
                <option value="version-desc">版本号倒序</option>
              </select>
            </div>
            <div className="flex gap-2 md:ml-auto">
              <Button variant="ghost" size="sm" icon={RotateCcw} onClick={resetFilters}>重置</Button>
            </div>
          </div>
        </Card>

        {/* 版本对比摘要区（当选择两个版本时显示） */}
        {selectedVersionDetails.length > 0 && (
          <Card padding="md" className="mb-5 bg-brand-50/40 border-brand-100">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-text mb-2 flex items-center gap-2">
                  <GitCompare className="w-4 h-4 text-brand-600" />
                  版本对比摘要
                </h3>
                {selectedVersionDetails.length < 2 ? (
                  <p className="text-sm text-text-muted">已选择 <span className="font-medium text-brand-700">{selectedVersionDetails[0].version}</span>，请再选择一个版本进行对比。</p>
                ) : (
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-3 rounded-xl bg-white border border-brand-100">
                      <p className="text-xs text-text-subtle mb-1">对比版本</p>
                      <p className="text-sm font-medium text-text">{selectedVersionDetails[0].version} vs {selectedVersionDetails[1].version}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-brand-100">
                      <p className="text-xs text-text-subtle mb-1">变更章节</p>
                      <p className="text-sm font-medium text-text">
                        {Array.from(new Set([...selectedVersionDetails[0].changedSections, ...selectedVersionDetails[1].changedSections])).length} 个
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-brand-100">
                      <p className="text-xs text-text-subtle mb-1">重点变化</p>
                      <p className="text-sm font-medium text-text">
                        {(selectedVersionDetails[0].highlights?.length || 0) + (selectedVersionDetails[1].highlights?.length || 0)} 条
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-brand-100">
                      <p className="text-xs text-text-subtle mb-1">是否影响执行步骤</p>
                      <p className="text-sm font-medium text-text">
                        {[selectedVersionDetails[0], selectedVersionDetails[1]].some((v) => v.changedSections.includes('执行步骤')) ? '是' : '否'}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-brand-100">
                      <p className="text-xs text-text-subtle mb-1">是否影响检查标准</p>
                      <p className="text-sm font-medium text-text">
                        {[selectedVersionDetails[0], selectedVersionDetails[1]].some((v) => v.changedSections.includes('检查点')) ? '是' : '否'}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Button size="sm" icon={Eye} onClick={() => { /* 查看详细对比占位 */ }}>
                        查看详细对比
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <button onClick={() => setSelectedVersions([])} className="p-2 rounded-lg hover:bg-brand-100 text-text-subtle">
                <X className="w-4 h-4" />
              </button>
            </div>
          </Card>
        )}

        {/* 主体：左侧版本时间轴 + 右侧辅助说明 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 3. 版本记录主展示区 */}
          <div className="lg:col-span-8">
            {filteredVersions.length === 0 ? (
              <Card padding="lg" className="text-center text-text-muted">
                <Archive className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">未找到符合条件的版本记录</p>
                <Button variant="ghost" size="sm" className="mt-3" onClick={resetFilters}>重置筛选</Button>
              </Card>
            ) : (
              <div className="relative pl-4">
                <div className="absolute left-[21px] top-2 bottom-2 w-px bg-border" />
                <div className="space-y-6">
                  {filteredVersions.map((v) => {
                    const isSelected = selectedVersions.includes(v.id);
                    const isCurrent = v.status === 'current';
                    return (
                      <div key={v.id} className="relative flex gap-4 group">
                        <div className="relative z-10 flex flex-col items-center pt-1">
                          <VersionDot status={v.status} />
                        </div>
                        <Card
                          padding="md"
                          className={cn(
                            'flex-1 transition-all',
                            isCurrent ? 'border-brand-200 bg-brand-50/30' : 'hover:border-border-strong hover:shadow-sm',
                            isSelected && 'ring-1 ring-brand-300'
                          )}
                        >
                          <div className="flex flex-col md:flex-row md:items-start gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                {isCurrent ? (
                                  <Badge tone="success">当前生效</Badge>
                                ) : (
                                  <Badge tone="neutral">历史版本</Badge>
                                )}
                                {v.isMajorUpdate && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full border bg-rose-50 border-rose-100 text-rose-700 font-medium">
                                    重大更新
                                  </span>
                                )}
                                <span className="text-xs text-text-subtle">{v.publishTime}</span>
                                <span className="text-xs text-text-subtle">· {v.updater}</span>
                              </div>
                              <h3 className="text-base font-bold text-text mb-1">{v.version}</h3>
                              <p className="text-sm text-text-muted mb-3">{v.summary}</p>

                              {v.highlights && v.highlights.length > 0 && (
                                <div className="mb-3">
                                  <p className="text-xs text-text-subtle mb-1.5">本次变更重点</p>
                                  <ul className="space-y-1">
                                    {v.highlights.map((h, idx) => (
                                      <li key={idx} className="flex items-start gap-2 text-sm text-text-muted">
                                        <span className="w-1 h-1 rounded-full bg-brand-400 mt-2 flex-shrink-0" />
                                        <span>{h}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              <div className="flex flex-wrap items-center gap-2 text-xs">
                                <span className="text-text-subtle">影响章节：</span>
                                {v.changedSections.map((sec) => (
                                  <span key={sec} className="px-2 py-0.5 rounded-full bg-surface-subtle text-text-muted border border-border">
                                    {sec}
                                  </span>
                                ))}
                              </div>

                              {v.note && (
                                <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-100 text-xs text-amber-700">
                                  <Info className="w-3.5 h-3.5 inline-block mr-1" />
                                  {v.note}
                                </div>
                              )}
                            </div>

                            <div className="flex md:flex-col items-center md:items-end gap-2 min-w-[120px]">
                              <Button variant="secondary" size="sm" fullWidth icon={Eye} onClick={() => handleNav(`/process/detail/${templateInfo.id}`, `${templateInfo.name} ${v.version}`)}>
                                查看该版本
                              </Button>
                              <Button variant="ghost" size="sm" fullWidth icon={GitCompare} onClick={() => toggleVersionSelect(v.id)}>
                                {isSelected ? '取消对比' : '加入对比'}
                              </Button>
                              <Button variant="ghost" size="sm" fullWidth icon={Undo2} onClick={() => { /* 回滚占位 */ }}>
                                回滚到此版本
                              </Button>
                            </div>
                          </div>
                        </Card>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 右侧辅助说明 / 对比提示区 */}
          <div className="lg:col-span-4">
            <div className="sticky top-6 space-y-4">
              <Card padding="md">
                <h3 className="text-sm font-semibold text-text mb-3">版本对比提示</h3>
                <p className="text-sm text-text-muted mb-3">
                  选择任意两个历史版本，可快速查看它们之间的变更摘要。详细逐条对比功能将在后续版本上线。
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-text-subtle">已选择：</span>
                  <span className="font-medium text-brand-700">{selectedVersions.length}</span>
                  <span className="text-text-subtle">/ 2 个版本</span>
                </div>
                {selectedVersions.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedVersionDetails.map((v) => (
                      <span key={v.id} className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-brand-50 text-brand-700 text-xs border border-brand-100">
                        {v.version}
                        <button onClick={() => toggleVersionSelect(v.id)} className="hover:text-brand-900"><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                )}
              </Card>

              <Card padding="md">
                <h3 className="text-sm font-semibold text-text mb-3">版本演进概览</h3>
                <div className="space-y-3">
                  {versionList.slice(0, 4).map((v, idx, arr) => (
                    <div key={v.id} className="flex items-center gap-3">
                      <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold', v.status === 'current' ? 'bg-brand-600 text-white' : 'bg-surface-subtle text-text-subtle')}>
                        {v.version}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-text truncate">{v.summary}</p>
                        <p className="text-xs text-text-subtle">{v.publishTime}</p>
                      </div>
                      {idx < arr.length - 1 && (
                        <ArrowRight className="w-4 h-4 text-border flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
                <Button variant="ghost" size="sm" fullWidth className="mt-3" onClick={() => handleNav(`/process/detail/${templateInfo.id}`, templateInfo.name)}>
                  查看最新版本详情
                </Button>
              </Card>
            </div>
          </div>
        </div>

        {/* 6. 底部说明 / 风险提示区 */}
        <Card padding="md" className="mt-6 bg-surface-subtle border-border">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-text mb-2">版本管理说明</h4>
              <ul className="list-disc list-inside text-sm text-text-muted space-y-1">
                <li>已发布版本不可直接覆盖编辑，修改发布内容时建议生成新版本。</li>
                <li>历史版本仅供追溯和参考，不建议直接复用于当前业务执行。</li>
                <li>回滚操作需谨慎，回滚后原当前生效版本将自动归档为历史版本。</li>
                <li>重大更新建议在发布前组织相关岗位培训，确保制度执行一致。</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
