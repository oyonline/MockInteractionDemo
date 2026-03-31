import React, { useEffect, useMemo, useState } from 'react';
import {
  Briefcase,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  Eye,
  Filter,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  Sparkles,
  Target,
  Users,
} from 'lucide-react';
import TablePagination from '../../components/TablePagination';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import DrawerShell from '../../components/ui/DrawerShell';
import ModalShell from '../../components/ui/ModalShell';
import RichTextContent from '../../components/ui/RichTextContent';
import TableShell from '../../components/ui/TableShell';
import {
  recruitmentCandidates,
  recruitmentPositions,
  recruitmentSourceOptions,
  recruitmentStageFlow,
  recruitmentStageOptions,
} from '../../mock/hr/recruitment';
import cn from '../../utils/cn';

const PAGE_SIZE = 6;

const EMPTY_POSITION_DRAFT = {
  title: '招聘运营主管',
  department: '人力资源',
  headcount: '1',
  priority: 'medium',
  owner: '周雪',
  city: '深圳',
  salaryRange: '18k-24k',
  summary: '负责招聘流程运营与周报机制搭建，帮助提升 pipeline 可视化与协同效率。',
};

const DEFAULT_INTERVIEW_DRAFT = {
  candidateId: '',
  slot: '2026-04-02 14:00',
  panel: '周雪 / 业务负责人 / HRBP',
  mode: '现场面试',
};

const stageMeta = {
  screening: { label: '初筛中', tone: 'warning' },
  shortlist: { label: '待业务面', tone: 'primary' },
  interview: { label: '面试中', tone: 'primary' },
  offer: { label: 'Offer 中', tone: 'success' },
  talent_pool: { label: '人才库', tone: 'neutral' },
  rejected: { label: '已淘汰', tone: 'danger' },
  hired: { label: '已录用', tone: 'success' },
};

const priorityMeta = {
  high: { label: '急招', tone: 'danger' },
  medium: { label: '正常', tone: 'warning' },
  low: { label: '储备', tone: 'neutral' },
};

const riskToneMap = {
  low: 'success',
  medium: 'warning',
  high: 'danger',
};

function getNextStage(stage) {
  const index = recruitmentStageFlow.indexOf(stage);
  if (index === -1) return 'shortlist';
  return recruitmentStageFlow[Math.min(index + 1, recruitmentStageFlow.length - 1)];
}

function getStageLabel(stage) {
  return stageMeta[stage]?.label || '未定义';
}

function getStageTone(stage) {
  return stageMeta[stage]?.tone || 'neutral';
}

export default function RecruitmentManagementPage() {
  const [positions, setPositions] = useState(recruitmentPositions);
  const [candidates, setCandidates] = useState(recruitmentCandidates);
  const [filters, setFilters] = useState({
    keyword: '',
    department: '',
    stage: '',
    source: '',
    urgentOnly: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [detailCandidateId, setDetailCandidateId] = useState('');
  const [banner, setBanner] = useState({
    tone: 'primary',
    text: '当前为纯前端原型，职位与候选人数据均为 mock，可直接体验筛选、详情与流程推进。',
  });
  const [positionModalOpen, setPositionModalOpen] = useState(false);
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [positionDraft, setPositionDraft] = useState(EMPTY_POSITION_DRAFT);
  const [interviewDraft, setInterviewDraft] = useState(DEFAULT_INTERVIEW_DRAFT);

  const positionMap = useMemo(
    () => positions.reduce((acc, item) => ({ ...acc, [item.id]: item }), {}),
    [positions]
  );

  const departmentOptions = useMemo(
    () => [...new Set(positions.map((item) => item.department))],
    [positions]
  );

  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      const linkedPosition = positionMap[candidate.positionId];
      const keyword = filters.keyword.trim().toLowerCase();
      const matchesKeyword =
        !keyword ||
        candidate.name.toLowerCase().includes(keyword) ||
        candidate.positionTitle.toLowerCase().includes(keyword) ||
        candidate.owner.toLowerCase().includes(keyword) ||
        candidate.tags.some((tag) => tag.toLowerCase().includes(keyword));
      const matchesDepartment =
        !filters.department || candidate.department === filters.department;
      const matchesStage = !filters.stage || candidate.stage === filters.stage;
      const matchesSource = !filters.source || candidate.source === filters.source;
      const matchesUrgent =
        !filters.urgentOnly || linkedPosition?.priority === 'high';

      return (
        matchesKeyword &&
        matchesDepartment &&
        matchesStage &&
        matchesSource &&
        matchesUrgent
      );
    });
  }, [candidates, filters, positionMap]);

  const totalPages = Math.max(1, Math.ceil(filteredCandidates.length / PAGE_SIZE));

  const paginatedCandidates = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredCandidates.slice(start, start + PAGE_SIZE);
  }, [currentPage, filteredCandidates]);

  const selectedCandidate = useMemo(
    () => candidates.find((candidate) => candidate.id === detailCandidateId) || null,
    [candidates, detailCandidateId]
  );

  const overview = useMemo(() => {
    const openPositions = positions.filter((item) => item.status === 'open').length;
    const activePipeline = candidates.filter(
      (item) => !['rejected', 'hired'].includes(item.stage)
    ).length;
    const interviewsThisWeek = candidates.filter(
      (item) => item.interviewAt && ['shortlist', 'interview', 'offer'].includes(item.stage)
    ).length;
    const offerCount = candidates.filter((item) => item.stage === 'offer').length;

    return [
      {
        label: '开放职位',
        value: `${openPositions}`,
        hint: `${positions.filter((item) => item.priority === 'high').length} 个岗位为急招`,
        icon: Briefcase,
        iconClassName: 'bg-brand-100 text-brand-700',
      },
      {
        label: '活跃候选人',
        value: `${activePipeline}`,
        hint: `本周新增 ${candidates.filter((item) => item.appliedAt >= '2026-03-24').length} 人`,
        icon: Users,
        iconClassName: 'bg-success-100 text-success-700',
      },
      {
        label: '待安排/已预约面试',
        value: `${interviewsThisWeek}`,
        hint: '优先关注业务面与复试排期',
        icon: CalendarDays,
        iconClassName: 'bg-warning-100 text-warning-700',
      },
      {
        label: 'Offer 推进中',
        value: `${offerCount}`,
        hint: '建议 48 小时内完成审批闭环',
        icon: Target,
        iconClassName: 'bg-danger-100 text-danger-700',
      },
    ];
  }, [candidates, positions]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (!interviewDraft.candidateId && filteredCandidates[0]) {
      setInterviewDraft((prev) => ({ ...prev, candidateId: filteredCandidates[0].id }));
    }
  }, [filteredCandidates, interviewDraft.candidateId]);

  const resetFilters = () => {
    setFilters({
      keyword: '',
      department: '',
      stage: '',
      source: '',
      urgentOnly: false,
    });
    setCurrentPage(1);
  };

  const handleOpenCandidate = (candidateId) => {
    setDetailCandidateId(candidateId);
  };

  const handleCreatePosition = () => {
    const newId = `pos-${positions.length + 1}`;
    const nextPosition = {
      id: newId,
      title: positionDraft.title,
      department: positionDraft.department,
      headcount: Number(positionDraft.headcount) || 1,
      priority: positionDraft.priority,
      owner: positionDraft.owner,
      status: 'open',
      city: positionDraft.city,
      channelMix: ['BOSS直聘', '内推'],
      salaryRange: positionDraft.salaryRange,
      summary: positionDraft.summary,
      jdHtml: `
        <h3>岗位重点</h3>
        <p>${positionDraft.summary}</p>
        <p><strong>招聘负责人：</strong>${positionDraft.owner}，工作地点：${positionDraft.city}，需求人数：${positionDraft.headcount} 人。</p>
      `,
    };

    setPositions((prev) => [nextPosition, ...prev]);
    setPositionModalOpen(false);
    setPositionDraft(EMPTY_POSITION_DRAFT);
    setBanner({
      tone: 'success',
      text: `已创建 mock 职位“${nextPosition.title}”，左侧导航入口保持不变，可继续在当前页查看概览变化。`,
    });
  };

  const handleOpenInterviewModal = (candidateId) => {
    const targetCandidateId =
      candidateId || selectedCandidate?.id || filteredCandidates[0]?.id || '';
    setInterviewDraft((prev) => ({ ...prev, candidateId: targetCandidateId }));
    setInterviewModalOpen(true);
  };

  const handleScheduleInterview = () => {
    if (!interviewDraft.candidateId) return;

    const targetCandidate = candidates.find(
      (candidate) => candidate.id === interviewDraft.candidateId
    );

    if (!targetCandidate) return;

    const nextStage =
      targetCandidate.stage === 'screening' ? 'shortlist' : getNextStage(targetCandidate.stage);

    setCandidates((prev) =>
      prev.map((candidate) =>
        candidate.id === interviewDraft.candidateId
          ? {
              ...candidate,
              stage: nextStage === 'offer' ? 'interview' : nextStage,
              interviewAt: interviewDraft.slot,
              lastActivity: '刚刚',
              timeline: [
                ...candidate.timeline,
                {
                  label: '新增面试安排',
                  date: interviewDraft.slot,
                  detail: `${interviewDraft.mode} / 面试官：${interviewDraft.panel}`,
                  done: false,
                },
              ],
            }
          : candidate
      )
    );
    setInterviewModalOpen(false);
    setBanner({
      tone: 'success',
      text: `已为 ${targetCandidate.name} 安排 ${interviewDraft.slot} 的 ${interviewDraft.mode}。`,
    });
  };

  const handleAdvanceCandidate = (candidateId) => {
    const targetCandidate = candidates.find((candidate) => candidate.id === candidateId);
    if (!targetCandidate) return;

    const nextStage = getNextStage(targetCandidate.stage);
    setCandidates((prev) =>
      prev.map((candidate) =>
        candidate.id === candidateId
          ? {
              ...candidate,
              stage: nextStage,
              lastActivity: '刚刚',
              timeline: [
                ...candidate.timeline,
                {
                  label: '流程推进',
                  date: '2026-03-31 16:20',
                  detail: `状态已推进至 ${getStageLabel(nextStage)}。`,
                  done: false,
                },
              ],
            }
          : candidate
      )
    );
    setBanner({
      tone: 'primary',
      text: `${targetCandidate.name} 已推进到“${getStageLabel(nextStage)}”阶段。`,
    });
  };

  const handleMarkOffer = (candidateId) => {
    const targetCandidate = candidates.find((candidate) => candidate.id === candidateId);
    if (!targetCandidate) return;

    setCandidates((prev) =>
      prev.map((candidate) =>
        candidate.id === candidateId
          ? {
              ...candidate,
              stage: 'offer',
              lastActivity: '刚刚',
              timeline: [
                ...candidate.timeline,
                {
                  label: '进入 Offer 阶段',
                  date: '2026-03-31 16:40',
                  detail: '已进入薪酬审批与 offer 准备阶段。',
                  done: false,
                },
              ],
            }
          : candidate
      )
    );
    setBanner({
      tone: 'success',
      text: `${targetCandidate.name} 已标记为 Offer 推进中。`,
    });
  };

  const handleExportBoard = () => {
    setBanner({
      tone: 'primary',
      text: `已生成 mock 导出任务，共包含 ${filteredCandidates.length} 位候选人和 ${positions.length} 个职位摘要。`,
    });
  };

  return (
    <div className="flex min-h-0 flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="ui-page-title">招聘管理</h1>
          <p className="mt-1 text-sm text-text-muted">
            聚合职位需求、候选人 pipeline 与面试安排，当前为纯前端 mock 原型。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="secondary" icon={Download} onClick={handleExportBoard}>
            导出看板
          </Button>
          <Button
            variant="secondary"
            icon={CalendarDays}
            onClick={() => handleOpenInterviewModal('')}
          >
            安排面试
          </Button>
          <Button icon={Plus} onClick={() => setPositionModalOpen(true)}>
            新建职位
          </Button>
        </div>
      </div>

      <Card padding="sm" className="animate-fade-in-up">
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone={banner.tone}>{banner.tone === 'success' ? '已更新' : 'Mock 提示'}</Badge>
          <p className="text-sm text-text-muted">{banner.text}</p>
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-4 md:grid-cols-2">
        {overview.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label} padding="sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-text-muted">{item.label}</p>
                  <p className="mt-2 text-2xl font-bold text-text">{item.value}</p>
                  <p className="mt-2 text-xs text-text-subtle">{item.hint}</p>
                </div>
                <div
                  className={cn(
                    'flex h-11 w-11 items-center justify-center rounded-2xl',
                    item.iconClassName
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card padding="sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle" />
            <input
              type="text"
              value={filters.keyword}
              onChange={(event) => {
                setFilters((prev) => ({ ...prev, keyword: event.target.value }));
                setCurrentPage(1);
              }}
              placeholder="搜索候选人 / 职位 / 招聘负责人"
              className="ui-input pl-10"
            />
          </div>
          <select
            value={filters.department}
            onChange={(event) => {
              setFilters((prev) => ({ ...prev, department: event.target.value }));
              setCurrentPage(1);
            }}
            className="ui-select max-w-[180px]"
          >
            <option value="">全部部门</option>
            {departmentOptions.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
          <select
            value={filters.stage}
            onChange={(event) => {
              setFilters((prev) => ({ ...prev, stage: event.target.value }));
              setCurrentPage(1);
            }}
            className="ui-select max-w-[180px]"
          >
            {recruitmentStageOptions.map((option) => (
              <option key={option.label} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            value={filters.source}
            onChange={(event) => {
              setFilters((prev) => ({ ...prev, source: event.target.value }));
              setCurrentPage(1);
            }}
            className="ui-select max-w-[180px]"
          >
            {recruitmentSourceOptions.map((option) => (
              <option key={option.label} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <Button
            variant="secondary"
            size="sm"
            icon={Filter}
            className={cn(filters.urgentOnly && 'border-brand-100 bg-brand-50 text-brand-700')}
            onClick={() => {
              setFilters((prev) => ({ ...prev, urgentOnly: !prev.urgentOnly }));
              setCurrentPage(1);
            }}
          >
            仅看急招
          </Button>
          <Button variant="secondary" size="sm" onClick={resetFilters}>
            重置
          </Button>
        </div>
      </Card>

      <TableShell
        className="flex-1"
        minWidth="1180px"
        toolbar={
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="ui-section-title">候选人列表</h2>
              <p className="mt-1 text-sm text-text-muted">
                按阶段跟进候选人，支持查看详情、推进流程和安排面试。
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="primary">
                <Sparkles className="mr-1 h-3.5 w-3.5" />
                优先处理 {filteredCandidates.filter((item) => item.matchScore >= 88).length} 人
              </Badge>
              <Badge tone="warning">
                <Clock3 className="mr-1 h-3.5 w-3.5" />
                面试待排期 {filteredCandidates.filter((item) => item.stage === 'shortlist').length} 人
              </Badge>
            </div>
          </div>
        }
        pagination={
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            total={filteredCandidates.length}
            itemName="位候选人"
            onPageChange={setCurrentPage}
          />
        }
        emptyState={
          paginatedCandidates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-text-subtle">
              <Search className="mb-4 h-10 w-10" />
              <p>没有符合当前筛选条件的候选人</p>
              <p className="mt-1 text-xs">可以尝试清空筛选，或直接新建职位并继续补充 mock 数据。</p>
            </div>
          ) : null
        }
      >
        <table className="min-w-[1180px] w-full text-sm">
          <thead className="sticky top-0 bg-surface-subtle">
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left font-medium text-text-muted">候选人</th>
              <th className="px-4 py-3 text-left font-medium text-text-muted">应聘职位</th>
              <th className="px-4 py-3 text-left font-medium text-text-muted">当前阶段</th>
              <th className="px-4 py-3 text-left font-medium text-text-muted">渠道来源</th>
              <th className="px-4 py-3 text-left font-medium text-text-muted">匹配度</th>
              <th className="px-4 py-3 text-left font-medium text-text-muted">面试安排</th>
              <th className="px-4 py-3 text-left font-medium text-text-muted">招聘负责人</th>
              <th className="px-4 py-3 text-left font-medium text-text-muted">最近动态</th>
              <th className="px-4 py-3 text-left font-medium text-text-muted">操作</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCandidates.map((candidate, index) => {
              const linkedPosition = positionMap[candidate.positionId];
              return (
                <tr
                  key={candidate.id}
                  className={cn(
                    'border-b border-border-subtle transition-colors hover:bg-surface-subtle/70',
                    index % 2 === 1 && 'bg-surface-muted/40'
                  )}
                >
                  <td className="px-4 py-4 align-top">
                    <button
                      type="button"
                      onClick={() => handleOpenCandidate(candidate.id)}
                      className="text-left"
                    >
                      <div className="font-medium text-text">{candidate.name}</div>
                      <div className="mt-1 flex items-center gap-3 text-xs text-text-subtle">
                        <span>{candidate.experience}</span>
                        <span>{candidate.city}</span>
                      </div>
                    </button>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {candidate.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} tone="neutral" className="px-2 py-0.5">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="flex flex-col gap-2">
                      <div className="font-medium text-text">{candidate.positionTitle}</div>
                      <div className="flex items-center gap-2 text-xs text-text-subtle">
                        <span>{candidate.department}</span>
                        {linkedPosition && (
                          <Badge tone={priorityMeta[linkedPosition.priority]?.tone || 'neutral'}>
                            {priorityMeta[linkedPosition.priority]?.label || '普通'}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <Badge tone={getStageTone(candidate.stage)}>{getStageLabel(candidate.stage)}</Badge>
                  </td>
                  <td className="px-4 py-4 align-top text-text-muted">{candidate.source}</td>
                  <td className="px-4 py-4 align-top">
                    <div className="min-w-[120px]">
                      <div className="flex items-center justify-between text-xs text-text-subtle">
                        <span>{candidate.matchScore} 分</span>
                        <span>{candidate.matchScore >= 85 ? '强匹配' : '可跟进'}</span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-surface-subtle">
                        <div
                          className={cn(
                            'h-2 rounded-full',
                            candidate.matchScore >= 88
                              ? 'bg-success-600'
                              : candidate.matchScore >= 75
                                ? 'bg-brand-600'
                                : 'bg-warning-600'
                          )}
                          style={{ width: `${candidate.matchScore}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    {candidate.interviewAt ? (
                      <div>
                        <div className="font-medium text-text">{candidate.interviewAt}</div>
                        <div className="mt-1 text-xs text-text-subtle">已锁定日程</div>
                      </div>
                    ) : (
                      <span className="text-text-subtle">待安排</span>
                    )}
                  </td>
                  <td className="px-4 py-4 align-top text-text-muted">{candidate.owner}</td>
                  <td className="px-4 py-4 align-top">
                    <div className="font-medium text-text">{candidate.lastActivity}</div>
                    <div className="mt-1 text-xs text-text-subtle">{candidate.appliedAt} 入库</div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={Eye}
                        onClick={() => handleOpenCandidate(candidate.id)}
                      >
                        查看
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={CalendarDays}
                        onClick={() => handleOpenInterviewModal(candidate.id)}
                        disabled={candidate.stage === 'rejected'}
                      >
                        安排面试
                      </Button>
                      <Button
                        size="sm"
                        icon={CheckCircle2}
                        onClick={() =>
                          candidate.stage === 'offer'
                            ? handleMarkOffer(candidate.id)
                            : handleAdvanceCandidate(candidate.id)
                        }
                        disabled={['offer', 'rejected', 'hired'].includes(candidate.stage)}
                      >
                        推进
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </TableShell>

      <DrawerShell
        open={Boolean(selectedCandidate)}
        onClose={() => setDetailCandidateId('')}
        width="xl"
        title={selectedCandidate ? `${selectedCandidate.name} 候选人详情` : '候选人详情'}
        subtitle={selectedCandidate ? `${selectedCandidate.positionTitle} · ${selectedCandidate.department}` : ''}
        headerActions={
          selectedCandidate ? (
            <Badge tone={getStageTone(selectedCandidate.stage)}>
              {getStageLabel(selectedCandidate.stage)}
            </Badge>
          ) : null
        }
        footer={
          selectedCandidate ? (
            <div className="flex flex-wrap items-center justify-end gap-3">
              <Button variant="secondary" onClick={() => setDetailCandidateId('')}>
                关闭
              </Button>
              <Button
                variant="secondary"
                icon={CalendarDays}
                onClick={() => handleOpenInterviewModal(selectedCandidate.id)}
              >
                安排面试
              </Button>
              <Button
                icon={CheckCircle2}
                onClick={() => handleMarkOffer(selectedCandidate.id)}
                disabled={selectedCandidate.stage === 'offer'}
              >
                标记 Offer
              </Button>
            </div>
          ) : null
        }
      >
        {selectedCandidate && (
          <div className="flex flex-col gap-4">
            <Card padding="md">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-semibold text-text">{selectedCandidate.name}</h3>
                    <Badge tone={riskToneMap[selectedCandidate.riskLevel]}>
                      风险{selectedCandidate.riskLevel === 'low' ? '低' : selectedCandidate.riskLevel === 'medium' ? '中' : '高'}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-text-muted">{selectedCandidate.summary}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedCandidate.tags.map((tag) => (
                    <Badge key={tag} tone="neutral">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card padding="sm">
                <h3 className="ui-section-title">基本信息</h3>
                <div className="mt-4 space-y-3 text-sm text-text-muted">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-text-subtle" />
                    <span>{selectedCandidate.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-text-subtle" />
                    <span>{selectedCandidate.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-text-subtle" />
                    <span>{selectedCandidate.city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-text-subtle" />
                    <span>{selectedCandidate.experience}</span>
                  </div>
                </div>
              </Card>
              <Card padding="sm">
                <h3 className="ui-section-title">招聘判断</h3>
                <div className="mt-4 space-y-3 text-sm text-text-muted">
                  <div className="flex items-center justify-between">
                    <span>匹配度</span>
                    <span className="font-medium text-text">{selectedCandidate.matchScore} / 100</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>期望薪资</span>
                    <span className="font-medium text-text">{selectedCandidate.expectedSalary}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>学历背景</span>
                    <span className="font-medium text-text">{selectedCandidate.education}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>最近动态</span>
                    <span className="font-medium text-text">{selectedCandidate.lastActivity}</span>
                  </div>
                </div>
              </Card>
            </div>

            <Card padding="md">
              <h3 className="ui-section-title">简历亮点</h3>
              <RichTextContent html={selectedCandidate.resumeHtml} className="mt-0" />
            </Card>

            <Card padding="md">
              <div className="flex items-center justify-between gap-3">
                <h3 className="ui-section-title">岗位需求摘要</h3>
                {positionMap[selectedCandidate.positionId] && (
                  <Badge tone={priorityMeta[positionMap[selectedCandidate.positionId].priority]?.tone || 'neutral'}>
                    {priorityMeta[positionMap[selectedCandidate.positionId].priority]?.label || '普通'}
                  </Badge>
                )}
              </div>
              <RichTextContent
                html={positionMap[selectedCandidate.positionId]?.jdHtml || '<p>暂无岗位说明</p>'}
                className="mt-0"
              />
            </Card>

            <Card padding="md">
              <h3 className="ui-section-title">跟进纪要</h3>
              <RichTextContent html={selectedCandidate.notesHtml} className="mt-0" />
            </Card>

            <Card padding="md">
              <h3 className="ui-section-title">流程时间线</h3>
              <div className="mt-4 space-y-4">
                {selectedCandidate.timeline.map((item) => (
                  <div key={`${item.label}-${item.date}`} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span
                        className={cn(
                          'mt-1 h-2.5 w-2.5 rounded-full',
                          item.done ? 'bg-success-600' : 'bg-brand-600'
                        )}
                      />
                      <span className="mt-1 min-h-[24px] w-px bg-border" />
                    </div>
                    <div className="pb-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-text">{item.label}</span>
                        <span className="text-xs text-text-subtle">{item.date}</span>
                      </div>
                      <p className="mt-1 text-sm text-text-muted">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </DrawerShell>

      <ModalShell
        open={positionModalOpen}
        onClose={() => setPositionModalOpen(false)}
        title="新建职位需求"
        subtitle="纯前端原型：保存后会即时刷新顶部概览与职位池。"
        width="lg"
        footer={
          <div className="flex items-center justify-end gap-3">
            <Button variant="secondary" onClick={() => setPositionModalOpen(false)}>
              取消
            </Button>
            <Button icon={Plus} onClick={handleCreatePosition}>
              创建职位
            </Button>
          </div>
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-text">职位名称</label>
              <input
                className="ui-input"
                value={positionDraft.title}
                onChange={(event) =>
                  setPositionDraft((prev) => ({ ...prev, title: event.target.value }))
                }
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-text">归属部门</label>
              <input
                className="ui-input"
                value={positionDraft.department}
                onChange={(event) =>
                  setPositionDraft((prev) => ({ ...prev, department: event.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-text">需求人数</label>
                <input
                  className="ui-input"
                  value={positionDraft.headcount}
                  onChange={(event) =>
                    setPositionDraft((prev) => ({ ...prev, headcount: event.target.value }))
                  }
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-text">优先级</label>
                <select
                  className="ui-select"
                  value={positionDraft.priority}
                  onChange={(event) =>
                    setPositionDraft((prev) => ({ ...prev, priority: event.target.value }))
                  }
                >
                  <option value="high">急招</option>
                  <option value="medium">正常</option>
                  <option value="low">储备</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-text">招聘负责人</label>
                <input
                  className="ui-input"
                  value={positionDraft.owner}
                  onChange={(event) =>
                    setPositionDraft((prev) => ({ ...prev, owner: event.target.value }))
                  }
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-text">工作地点</label>
                <input
                  className="ui-input"
                  value={positionDraft.city}
                  onChange={(event) =>
                    setPositionDraft((prev) => ({ ...prev, city: event.target.value }))
                  }
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-text">薪资范围</label>
              <input
                className="ui-input"
                value={positionDraft.salaryRange}
                onChange={(event) =>
                  setPositionDraft((prev) => ({ ...prev, salaryRange: event.target.value }))
                }
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-text">岗位摘要</label>
              <textarea
                className="ui-textarea min-h-[156px] resize-none"
                value={positionDraft.summary}
                onChange={(event) =>
                  setPositionDraft((prev) => ({ ...prev, summary: event.target.value }))
                }
              />
            </div>
            <Card padding="sm" className="bg-surface-muted">
              <div className="flex items-center justify-between gap-2">
                <h3 className="ui-section-title">职位预览</h3>
                <Badge tone={priorityMeta[positionDraft.priority]?.tone || 'neutral'}>
                  {priorityMeta[positionDraft.priority]?.label || '普通'}
                </Badge>
              </div>
              <RichTextContent
                className="mt-0"
                html={`
                  <h3>${positionDraft.title}</h3>
                  <p>${positionDraft.summary}</p>
                  <p><strong>部门：</strong>${positionDraft.department}，<strong>地点：</strong>${positionDraft.city}</p>
                  <p><strong>负责人：</strong>${positionDraft.owner}，<strong>薪资范围：</strong>${positionDraft.salaryRange}</p>
                `}
              />
            </Card>
          </div>
        </div>
      </ModalShell>

      <ModalShell
        open={interviewModalOpen}
        onClose={() => setInterviewModalOpen(false)}
        title="安排面试"
        subtitle="选择候选人与时段后，会同步更新列表中的阶段与最近动态。"
        width="md"
        footer={
          <div className="flex items-center justify-end gap-3">
            <Button variant="secondary" onClick={() => setInterviewModalOpen(false)}>
              取消
            </Button>
            <Button icon={CalendarDays} onClick={handleScheduleInterview}>
              确认安排
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-text">候选人</label>
            <select
              className="ui-select"
              value={interviewDraft.candidateId}
              onChange={(event) =>
                setInterviewDraft((prev) => ({ ...prev, candidateId: event.target.value }))
              }
            >
              <option value="">请选择候选人</option>
              {candidates
                .filter((candidate) => candidate.stage !== 'rejected')
                .map((candidate) => (
                  <option key={candidate.id} value={candidate.id}>
                    {candidate.name} · {candidate.positionTitle}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-text">面试时段</label>
            <select
              className="ui-select"
              value={interviewDraft.slot}
              onChange={(event) =>
                setInterviewDraft((prev) => ({ ...prev, slot: event.target.value }))
              }
            >
              <option value="2026-04-01 15:30">2026-04-01 15:30</option>
              <option value="2026-04-02 14:00">2026-04-02 14:00</option>
              <option value="2026-04-03 10:00">2026-04-03 10:00</option>
              <option value="2026-04-03 16:00">2026-04-03 16:00</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-text">面试官阵容</label>
            <input
              className="ui-input"
              value={interviewDraft.panel}
              onChange={(event) =>
                setInterviewDraft((prev) => ({ ...prev, panel: event.target.value }))
              }
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-text">面试形式</label>
            <select
              className="ui-select"
              value={interviewDraft.mode}
              onChange={(event) =>
                setInterviewDraft((prev) => ({ ...prev, mode: event.target.value }))
              }
            >
              <option value="现场面试">现场面试</option>
              <option value="视频面试">视频面试</option>
              <option value="电话沟通">电话沟通</option>
            </select>
          </div>
        </div>
      </ModalShell>
    </div>
  );
}
