import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Download,
  Eye,
  FileText,
  Filter,
  MessageSquareMore,
  Search,
  Sparkles,
  Target,
  TrendingUp,
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
  performanceCycleOptions,
  performanceReviews,
  performanceStatusOptions,
} from '../../mock/hr/performance';
import cn from '../../utils/cn';

const PAGE_SIZE = 6;

const statusMeta = {
  draft: { label: '待上级评估', tone: 'warning' },
  in_review: { label: '评审中', tone: 'primary' },
  completed: { label: '已完成', tone: 'success' },
  needs_attention: { label: '重点辅导', tone: 'danger' },
};

const riskMeta = {
  low: { label: '风险低', tone: 'success' },
  medium: { label: '风险中', tone: 'warning' },
  high: { label: '风险高', tone: 'danger' },
};

const calibrationMeta = {
  none: { label: '未发起', tone: 'neutral' },
  pending: { label: '待校准', tone: 'warning' },
  scheduled: { label: '已预约', tone: 'primary' },
  done: { label: '已完成', tone: 'success' },
};

const EMPTY_CALIBRATION_DRAFT = {
  reviewId: '',
  slot: '2026-04-02 15:00',
  participants: 'HRBP / 直属上级 / 事业部负责人',
  note: '围绕评级口径、潜力判断和后续发展动作进行校准。',
};

const EMPTY_COACHING_DRAFT = {
  reviewId: '',
  nextAction: '安排一次 1v1 面谈并明确下季度改进目标。',
  dueDate: '2026-04-08',
};

function getStatusMeta(status) {
  return statusMeta[status] || statusMeta.draft;
}

function getCalibrationMeta(status) {
  return calibrationMeta[status] || calibrationMeta.none;
}

function getRiskMeta(riskLevel) {
  return riskMeta[riskLevel] || riskMeta.low;
}

function getScoreBarClass(score) {
  if (score >= 90) return 'bg-success-600';
  if (score >= 80) return 'bg-brand-600';
  return 'bg-warning-600';
}

export default function PerformanceManagementPage() {
  const [reviews, setReviews] = useState(performanceReviews);
  const [filters, setFilters] = useState({
    keyword: '',
    department: '',
    cycle: '',
    status: '',
    highRiskOnly: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReviewId, setSelectedReviewId] = useState('');
  const [calibrationModalOpen, setCalibrationModalOpen] = useState(false);
  const [coachingModalOpen, setCoachingModalOpen] = useState(false);
  const [calibrationDraft, setCalibrationDraft] = useState(EMPTY_CALIBRATION_DRAFT);
  const [coachingDraft, setCoachingDraft] = useState(EMPTY_COACHING_DRAFT);
  const [banner, setBanner] = useState({
    tone: 'primary',
    text: '当前页面为纯前端 mock 原型，可体验筛选、绩效详情、绩效校准与辅导动作。',
  });

  const departmentOptions = useMemo(
    () => [...new Set(reviews.map((item) => item.department))],
    [reviews]
  );

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const keyword = filters.keyword.trim().toLowerCase();
      const matchesKeyword =
        !keyword ||
        review.employeeName.toLowerCase().includes(keyword) ||
        review.position.toLowerCase().includes(keyword) ||
        review.employeeNo.toLowerCase().includes(keyword) ||
        review.manager.toLowerCase().includes(keyword);
      const matchesDepartment =
        !filters.department || review.department === filters.department;
      const matchesCycle = !filters.cycle || review.cycle === filters.cycle;
      const matchesStatus = !filters.status || review.status === filters.status;
      const matchesHighRisk = !filters.highRiskOnly || review.riskLevel === 'high';

      return (
        matchesKeyword &&
        matchesDepartment &&
        matchesCycle &&
        matchesStatus &&
        matchesHighRisk
      );
    });
  }, [filters, reviews]);

  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / PAGE_SIZE));

  const paginatedReviews = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredReviews.slice(start, start + PAGE_SIZE);
  }, [currentPage, filteredReviews]);

  const selectedReview = useMemo(
    () => reviews.find((item) => item.id === selectedReviewId) || null,
    [reviews, selectedReviewId]
  );

  const overview = useMemo(() => {
    const pendingCalibration = reviews.filter((item) =>
      ['pending', 'scheduled'].includes(item.calibrationStatus)
    ).length;
    const highPerformers = reviews.filter((item) => item.score >= 90).length;
    const coachingNeeded = reviews.filter((item) => item.status === 'needs_attention').length;
    const completed = reviews.filter((item) => item.status === 'completed').length;

    return [
      {
        label: '绩效完成率',
        value: `${Math.round((completed / reviews.length) * 100)}%`,
        hint: `${completed}/${reviews.length} 份评估已完成`,
        icon: BarChart3,
        iconClassName: 'bg-brand-100 text-brand-700',
      },
      {
        label: '高绩效员工',
        value: `${highPerformers}`,
        hint: '分数 90 分及以上',
        icon: TrendingUp,
        iconClassName: 'bg-success-100 text-success-700',
      },
      {
        label: '待校准记录',
        value: `${pendingCalibration}`,
        hint: '建议优先安排跨部门校准会',
        icon: CalendarDays,
        iconClassName: 'bg-warning-100 text-warning-700',
      },
      {
        label: '重点辅导对象',
        value: `${coachingNeeded}`,
        hint: '建议跟进改进动作与 1v1',
        icon: AlertTriangle,
        iconClassName: 'bg-danger-100 text-danger-700',
      },
    ];
  }, [reviews]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (!calibrationDraft.reviewId && filteredReviews[0]) {
      setCalibrationDraft((prev) => ({ ...prev, reviewId: filteredReviews[0].id }));
    }
    if (!coachingDraft.reviewId && filteredReviews[0]) {
      setCoachingDraft((prev) => ({ ...prev, reviewId: filteredReviews[0].id }));
    }
  }, [filteredReviews, calibrationDraft.reviewId, coachingDraft.reviewId]);

  const resetFilters = () => {
    setFilters({
      keyword: '',
      department: '',
      cycle: '',
      status: '',
      highRiskOnly: false,
    });
    setCurrentPage(1);
  };

  const handleOpenDetail = (reviewId) => {
    setSelectedReviewId(reviewId);
  };

  const handleExportBoard = () => {
    setBanner({
      tone: 'primary',
      text: `已生成 mock 绩效看板导出，共包含 ${filteredReviews.length} 条评估记录。`,
    });
  };

  const handleOpenCalibration = (reviewId) => {
    const targetId = reviewId || selectedReview?.id || filteredReviews[0]?.id || '';
    setCalibrationDraft((prev) => ({ ...prev, reviewId: targetId }));
    setCalibrationModalOpen(true);
  };

  const handleOpenCoaching = (reviewId) => {
    const targetId = reviewId || selectedReview?.id || filteredReviews[0]?.id || '';
    setCoachingDraft((prev) => ({ ...prev, reviewId: targetId }));
    setCoachingModalOpen(true);
  };

  const handleLaunchCalibration = () => {
    if (!calibrationDraft.reviewId) return;

    const target = reviews.find((item) => item.id === calibrationDraft.reviewId);
    if (!target) return;

    setReviews((prev) =>
      prev.map((item) =>
        item.id === calibrationDraft.reviewId
          ? {
              ...item,
              status: item.status === 'draft' ? 'in_review' : item.status,
              calibrationStatus: 'scheduled',
              lastUpdated: '刚刚',
              timeline: [
                ...item.timeline,
                {
                  label: '绩效校准已发起',
                  date: calibrationDraft.slot,
                  done: false,
                },
              ],
            }
          : item
      )
    );

    setCalibrationModalOpen(false);
    setBanner({
      tone: 'success',
      text: `已为 ${target.employeeName} 发起绩效校准，时间：${calibrationDraft.slot}。`,
    });
  };

  const handleCreateCoaching = () => {
    if (!coachingDraft.reviewId) return;

    const target = reviews.find((item) => item.id === coachingDraft.reviewId);
    if (!target) return;

    setReviews((prev) =>
      prev.map((item) =>
        item.id === coachingDraft.reviewId
          ? {
              ...item,
              status: 'needs_attention',
              lastUpdated: '刚刚',
              coachingHtml: `
                <h3>绩效面谈纪要</h3>
                <p>${coachingDraft.nextAction}</p>
                <p><strong>跟进日期：</strong>${coachingDraft.dueDate}</p>
              `,
              timeline: [
                ...item.timeline,
                {
                  label: '新增辅导动作',
                  date: coachingDraft.dueDate,
                  done: false,
                },
              ],
            }
          : item
      )
    );

    setCoachingModalOpen(false);
    setBanner({
      tone: 'warning',
      text: `已为 ${target.employeeName} 创建辅导动作，并将记录标记为重点辅导。`,
    });
  };

  const handleMarkCompleted = (reviewId) => {
    const target = reviews.find((item) => item.id === reviewId);
    if (!target) return;

    setReviews((prev) =>
      prev.map((item) =>
        item.id === reviewId
          ? {
              ...item,
              status: 'completed',
              calibrationStatus: 'done',
              lastUpdated: '刚刚',
              timeline: [
                ...item.timeline,
                {
                  label: '绩效流程已完成',
                  date: '2026-03-31 18:00',
                  done: true,
                },
              ],
            }
          : item
      )
    );
    setBanner({
      tone: 'success',
      text: `${target.employeeName} 的绩效记录已标记完成。`,
    });
  };

  return (
    <div className="flex min-h-0 flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="ui-page-title">绩效管理</h1>
          <p className="mt-1 text-sm text-text-muted">
            管理季度评估、绩效校准与辅导动作，页面数据均为 mock，可直接点进查看。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="secondary" icon={Download} onClick={handleExportBoard}>
            导出绩效看板
          </Button>
          <Button
            variant="secondary"
            icon={CalendarDays}
            onClick={() => handleOpenCalibration('')}
          >
            发起绩效校准
          </Button>
          <Button icon={MessageSquareMore} onClick={() => handleOpenCoaching('')}>
            新建辅导动作
          </Button>
        </div>
      </div>

      <Card padding="sm">
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone={banner.tone}>{banner.tone === 'success' ? '已更新' : banner.tone === 'warning' ? '待跟进' : 'Mock 提示'}</Badge>
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
                <div className={cn('flex h-11 w-11 items-center justify-center rounded-2xl', item.iconClassName)}>
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
              className="ui-input pl-10"
              placeholder="搜索员工 / 工号 / 上级"
              value={filters.keyword}
              onChange={(event) => {
                setFilters((prev) => ({ ...prev, keyword: event.target.value }));
                setCurrentPage(1);
              }}
            />
          </div>
          <select
            className="ui-select max-w-[180px]"
            value={filters.department}
            onChange={(event) => {
              setFilters((prev) => ({ ...prev, department: event.target.value }));
              setCurrentPage(1);
            }}
          >
            <option value="">全部部门</option>
            {departmentOptions.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
          <select
            className="ui-select max-w-[160px]"
            value={filters.cycle}
            onChange={(event) => {
              setFilters((prev) => ({ ...prev, cycle: event.target.value }));
              setCurrentPage(1);
            }}
          >
            {performanceCycleOptions.map((option) => (
              <option key={option.label} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            className="ui-select max-w-[180px]"
            value={filters.status}
            onChange={(event) => {
              setFilters((prev) => ({ ...prev, status: event.target.value }));
              setCurrentPage(1);
            }}
          >
            {performanceStatusOptions.map((option) => (
              <option key={option.label} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <Button
            variant="secondary"
            size="sm"
            icon={Filter}
            className={cn(filters.highRiskOnly && 'border-danger-100 bg-danger-50 text-danger-700')}
            onClick={() => {
              setFilters((prev) => ({ ...prev, highRiskOnly: !prev.highRiskOnly }));
              setCurrentPage(1);
            }}
          >
            仅看高风险
          </Button>
          <Button variant="secondary" size="sm" onClick={resetFilters}>
            重置
          </Button>
        </div>
      </Card>

      <TableShell
        className="flex-1"
        minWidth="1250px"
        toolbar={
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="ui-section-title">绩效评估列表</h2>
              <p className="mt-1 text-sm text-text-muted">
                支持查看详情、发起校准、创建辅导动作和完成绩效确认。
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="primary">
                <Sparkles className="mr-1 h-3.5 w-3.5" />
                A 档及以上 {reviews.filter((item) => item.score >= 89).length} 人
              </Badge>
              <Badge tone="danger">
                <AlertTriangle className="mr-1 h-3.5 w-3.5" />
                重点辅导 {reviews.filter((item) => item.status === 'needs_attention').length} 人
              </Badge>
            </div>
          </div>
        }
        pagination={
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            total={filteredReviews.length}
            itemName="条绩效记录"
            onPageChange={setCurrentPage}
          />
        }
        emptyState={
          paginatedReviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-text-subtle">
              <Search className="mb-4 h-10 w-10" />
              <p>没有符合当前条件的绩效记录</p>
              <p className="mt-1 text-xs">可以切换筛选条件，或重置后查看完整 mock 数据。</p>
            </div>
          ) : null
        }
      >
        <table className="w-full min-w-[1250px] text-sm">
          <thead className="sticky top-0 bg-surface-subtle">
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left font-medium text-text-muted">员工</th>
              <th className="px-4 py-3 text-left font-medium text-text-muted">部门 / 岗位</th>
              <th className="px-4 py-3 text-left font-medium text-text-muted">绩效结果</th>
              <th className="px-4 py-3 text-left font-medium text-text-muted">目标完成</th>
              <th className="px-4 py-3 text-left font-medium text-text-muted">评估状态</th>
              <th className="px-4 py-3 text-left font-medium text-text-muted">校准状态</th>
              <th className="px-4 py-3 text-left font-medium text-text-muted">风险 / 九宫格</th>
              <th className="px-4 py-3 text-left font-medium text-text-muted">最近更新</th>
              <th className="px-4 py-3 text-left font-medium text-text-muted">操作</th>
            </tr>
          </thead>
          <tbody>
            {paginatedReviews.map((review, index) => {
              const status = getStatusMeta(review.status);
              const calibration = getCalibrationMeta(review.calibrationStatus);
              const risk = getRiskMeta(review.riskLevel);

              return (
                <tr
                  key={review.id}
                  className={cn(
                    'border-b border-border-subtle transition-colors hover:bg-surface-subtle/70',
                    index % 2 === 1 && 'bg-surface-muted/40'
                  )}
                >
                  <td className="px-4 py-4 align-top">
                    <button type="button" className="text-left" onClick={() => handleOpenDetail(review.id)}>
                      <div className="font-medium text-text">{review.employeeName}</div>
                      <div className="mt-1 text-xs text-text-subtle">{review.employeeNo}</div>
                    </button>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="font-medium text-text">{review.department}</div>
                    <div className="mt-1 text-xs text-text-subtle">{review.position}</div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-text">{review.score}</span>
                      <Badge tone={review.score >= 90 ? 'success' : review.score >= 80 ? 'primary' : 'warning'}>
                        {review.grade}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="min-w-[130px]">
                      <div className="flex items-center justify-between text-xs text-text-subtle">
                        <span>{review.completionRate}%</span>
                        <span>{review.cycle}</span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-surface-subtle">
                        <div
                          className={cn('h-2 rounded-full', getScoreBarClass(review.score))}
                          style={{ width: `${Math.min(review.completionRate, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <Badge tone={status.tone}>{status.label}</Badge>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <Badge tone={calibration.tone}>{calibration.label}</Badge>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="space-y-2">
                      <Badge tone={risk.tone}>{risk.label}</Badge>
                      <div className="text-xs text-text-subtle">{review.talentBox}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="font-medium text-text">{review.lastUpdated}</div>
                    <div className="mt-1 text-xs text-text-subtle">负责人：{review.owner}</div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={Eye}
                        onClick={() => handleOpenDetail(review.id)}
                      >
                        查看
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={CalendarDays}
                        onClick={() => handleOpenCalibration(review.id)}
                      >
                        校准
                      </Button>
                      <Button
                        size="sm"
                        icon={CheckCircle2}
                        onClick={() => handleMarkCompleted(review.id)}
                        disabled={review.status === 'completed'}
                      >
                        完成
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
        open={Boolean(selectedReview)}
        onClose={() => setSelectedReviewId('')}
        width="xl"
        title={selectedReview ? `${selectedReview.employeeName} 绩效详情` : '绩效详情'}
        subtitle={selectedReview ? `${selectedReview.department} · ${selectedReview.position}` : ''}
        headerActions={
          selectedReview ? (
            <Badge tone={getStatusMeta(selectedReview.status).tone}>
              {selectedReview.grade} / {getStatusMeta(selectedReview.status).label}
            </Badge>
          ) : null
        }
        footer={
          selectedReview ? (
            <div className="flex flex-wrap items-center justify-end gap-3">
              <Button variant="secondary" onClick={() => setSelectedReviewId('')}>
                关闭
              </Button>
              <Button
                variant="secondary"
                icon={CalendarDays}
                onClick={() => handleOpenCalibration(selectedReview.id)}
              >
                发起校准
              </Button>
              <Button icon={FileText} onClick={() => handleOpenCoaching(selectedReview.id)}>
                新建辅导动作
              </Button>
            </div>
          ) : null
        }
      >
        {selectedReview && (
          <div className="flex flex-col gap-4">
            <Card padding="md">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-semibold text-text">{selectedReview.employeeName}</h3>
                    <Badge tone={getRiskMeta(selectedReview.riskLevel).tone}>
                      {getRiskMeta(selectedReview.riskLevel).label}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-text-muted">{selectedReview.summary}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedReview.strengths.map((tag) => (
                    <Badge key={tag} tone="neutral">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card padding="sm">
                <h3 className="ui-section-title">结果概览</h3>
                <div className="mt-4 space-y-3 text-sm text-text-muted">
                  <div className="flex items-center justify-between">
                    <span>绩效分数</span>
                    <span className="font-medium text-text">{selectedReview.score}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>评级</span>
                    <span className="font-medium text-text">{selectedReview.grade}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>目标完成率</span>
                    <span className="font-medium text-text">{selectedReview.completionRate}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>九宫格定位</span>
                    <span className="font-medium text-text">{selectedReview.talentBox}</span>
                  </div>
                </div>
              </Card>
              <Card padding="sm">
                <h3 className="ui-section-title">流程状态</h3>
                <div className="mt-4 space-y-3 text-sm text-text-muted">
                  <div className="flex items-center justify-between">
                    <span>评估状态</span>
                    <Badge tone={getStatusMeta(selectedReview.status).tone}>
                      {getStatusMeta(selectedReview.status).label}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>校准状态</span>
                    <Badge tone={getCalibrationMeta(selectedReview.calibrationStatus).tone}>
                      {getCalibrationMeta(selectedReview.calibrationStatus).label}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>直属上级</span>
                    <span className="font-medium text-text">{selectedReview.manager}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>流程 owner</span>
                    <span className="font-medium text-text">{selectedReview.owner}</span>
                  </div>
                </div>
              </Card>
            </div>

            <Card padding="md">
              <h3 className="ui-section-title">目标完成情况</h3>
              <RichTextContent html={selectedReview.goalsHtml} className="mt-0" />
            </Card>

            <Card padding="md">
              <h3 className="ui-section-title">直属上级反馈</h3>
              <RichTextContent html={selectedReview.feedbackHtml} className="mt-0" />
            </Card>

            <Card padding="md">
              <h3 className="ui-section-title">面谈与辅导</h3>
              <RichTextContent html={selectedReview.coachingHtml} className="mt-0" />
              <div className="mt-4 rounded-2xl border border-border bg-surface-muted p-4">
                <p className="text-sm font-medium text-text">当前关注点</p>
                <p className="mt-2 text-sm text-text-muted">{selectedReview.concern}</p>
              </div>
            </Card>

            <Card padding="md">
              <h3 className="ui-section-title">流程时间线</h3>
              <div className="mt-4 space-y-4">
                {selectedReview.timeline.map((item) => (
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
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </DrawerShell>

      <ModalShell
        open={calibrationModalOpen}
        onClose={() => setCalibrationModalOpen(false)}
        title="发起绩效校准"
        subtitle="会后可在列表中继续推进到完成状态。"
        width="md"
        footer={
          <div className="flex items-center justify-end gap-3">
            <Button variant="secondary" onClick={() => setCalibrationModalOpen(false)}>
              取消
            </Button>
            <Button icon={CalendarDays} onClick={handleLaunchCalibration}>
              确认发起
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-text">绩效记录</label>
            <select
              className="ui-select"
              value={calibrationDraft.reviewId}
              onChange={(event) =>
                setCalibrationDraft((prev) => ({ ...prev, reviewId: event.target.value }))
              }
            >
              <option value="">请选择记录</option>
              {reviews.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.employeeName} · {item.department} · {item.cycle}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-text">校准时间</label>
            <select
              className="ui-select"
              value={calibrationDraft.slot}
              onChange={(event) =>
                setCalibrationDraft((prev) => ({ ...prev, slot: event.target.value }))
              }
            >
              <option value="2026-04-01 14:00">2026-04-01 14:00</option>
              <option value="2026-04-02 15:00">2026-04-02 15:00</option>
              <option value="2026-04-03 10:30">2026-04-03 10:30</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-text">参会人</label>
            <input
              className="ui-input"
              value={calibrationDraft.participants}
              onChange={(event) =>
                setCalibrationDraft((prev) => ({ ...prev, participants: event.target.value }))
              }
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-text">校准说明</label>
            <textarea
              className="ui-textarea min-h-[120px] resize-none"
              value={calibrationDraft.note}
              onChange={(event) =>
                setCalibrationDraft((prev) => ({ ...prev, note: event.target.value }))
              }
            />
          </div>
        </div>
      </ModalShell>

      <ModalShell
        open={coachingModalOpen}
        onClose={() => setCoachingModalOpen(false)}
        title="新建辅导动作"
        subtitle="用于记录 1v1、改进计划或发展动作。"
        width="md"
        footer={
          <div className="flex items-center justify-end gap-3">
            <Button variant="secondary" onClick={() => setCoachingModalOpen(false)}>
              取消
            </Button>
            <Button icon={Target} onClick={handleCreateCoaching}>
              保存动作
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-text">员工记录</label>
            <select
              className="ui-select"
              value={coachingDraft.reviewId}
              onChange={(event) =>
                setCoachingDraft((prev) => ({ ...prev, reviewId: event.target.value }))
              }
            >
              <option value="">请选择记录</option>
              {reviews.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.employeeName} · {item.department}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-text">辅导动作</label>
            <textarea
              className="ui-textarea min-h-[120px] resize-none"
              value={coachingDraft.nextAction}
              onChange={(event) =>
                setCoachingDraft((prev) => ({ ...prev, nextAction: event.target.value }))
              }
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-text">跟进日期</label>
            <input
              className="ui-input"
              value={coachingDraft.dueDate}
              onChange={(event) =>
                setCoachingDraft((prev) => ({ ...prev, dueDate: event.target.value }))
              }
            />
          </div>
        </div>
      </ModalShell>
    </div>
  );
}
