import React, { useMemo, useState } from 'react';
import {
  Copy,
  MoreHorizontal,
  Plus,
  Star,
  Users,
  X,
} from 'lucide-react';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import cn from '../../utils/cn';
import {
  getCategoryMeta,
  getPriorityMeta,
  getProjectById,
  getProjectStatusMeta,
  getProjectTypeMeta,
} from '../../mock/project/management';

const TAB_OPTIONS = [
  { key: 'basic', label: '基本信息 Basic information' },
  { key: 'comments', label: '评论/备注' },
  { key: 'node', label: '节点详情' },
  { key: 'activity', label: '操作记录' },
];

const FLOW_NODE_WIDTH = 132;
const FLOW_NODE_HEIGHT = 56;
const FLOW_CANVAS_HEIGHT = 220;

const FLOW_NODE_LAYOUT = [
  { id: 'packaging-request', x: 24, y: 18 },
  { id: 'packaging-design', x: 184, y: 18 },
  { id: 'mold-open', x: 24, y: 134 },
  { id: 'first-sample', x: 184, y: 134 },
  { id: 'final-sample', x: 404, y: 76 },
  { id: 'packaging-confirm', x: 564, y: 76 },
  { id: 'np-demo', x: 724, y: 76 },
  { id: 'pre-production-sample', x: 884, y: 76 },
  { id: 'roi-mail', x: 1044, y: 76 },
  { id: 'sales-forecast', x: 1204, y: 76 },
  { id: 'analysis-plan', x: 1364, y: 76 },
  { id: 'bulk-order', x: 1524, y: 76 },
  { id: 'supplier-delivery', x: 1684, y: 76 },
  { id: 'ship-to-us', x: 1844, y: 76 },
  { id: 'arrival', x: 2004, y: 76 },
  { id: 'npi', x: 2164, y: 76 },
  { id: 'photo-sample', x: 2324, y: 18 },
  { id: 'video-framework', x: 2484, y: 18 },
  { id: 'video-demo', x: 2644, y: 18 },
  { id: 'video-shoot', x: 2804, y: 18 },
  { id: 'video-delivery', x: 2964, y: 18 },
  { id: 'visual-needs', x: 2324, y: 134 },
  { id: 'image-framework', x: 2484, y: 134 },
  { id: 'image-demo', x: 2644, y: 134 },
  { id: 'image-shoot', x: 2804, y: 134 },
  { id: 'image-delivery', x: 2964, y: 134 },
  { id: 'listing', x: 3164, y: 76 },
];

const FLOW_LABELS = [
  { text: '包装支线', x: 24, y: 0 },
  { text: '开发支线', x: 24, y: 116 },
  { text: '视频支线', x: 2324, y: 0 },
  { text: '图片支线', x: 2324, y: 116 },
];

const FLOW_LINE_LAYOUT = [
  { fromId: 'packaging-request', toId: 'packaging-design' },
  { fromId: 'mold-open', toId: 'first-sample' },
  { x: 336, y: 46, width: 20, direction: 'horizontal', fromId: 'packaging-design', toId: 'final-sample' },
  { x: 336, y: 162, width: 20, direction: 'horizontal', fromId: 'first-sample', toId: 'final-sample' },
  { x: 356, y: 46, height: 116, direction: 'vertical', fromId: 'packaging-design', toId: 'first-sample' },
  { fromId: 'final-sample', toId: 'packaging-confirm' },
  { fromId: 'packaging-confirm', toId: 'np-demo' },
  { fromId: 'np-demo', toId: 'pre-production-sample' },
  { fromId: 'pre-production-sample', toId: 'roi-mail' },
  { fromId: 'roi-mail', toId: 'sales-forecast' },
  { fromId: 'sales-forecast', toId: 'analysis-plan' },
  { fromId: 'analysis-plan', toId: 'bulk-order' },
  { fromId: 'bulk-order', toId: 'supplier-delivery' },
  { fromId: 'supplier-delivery', toId: 'ship-to-us' },
  { fromId: 'ship-to-us', toId: 'arrival' },
  { fromId: 'arrival', toId: 'npi' },
  { x: 2296, y: 104, width: 28, direction: 'horizontal', fromId: 'npi', toId: 'photo-sample' },
  { x: 2296, y: 104, width: 28, direction: 'horizontal', fromId: 'npi', toId: 'visual-needs' },
  { x: 2296, y: 46, height: 116, direction: 'vertical', fromId: 'npi', toId: 'visual-needs' },
  { fromId: 'photo-sample', toId: 'video-framework' },
  { fromId: 'video-framework', toId: 'video-demo' },
  { fromId: 'video-demo', toId: 'video-shoot' },
  { fromId: 'video-shoot', toId: 'video-delivery' },
  { fromId: 'visual-needs', toId: 'image-framework' },
  { fromId: 'image-framework', toId: 'image-demo' },
  { fromId: 'image-demo', toId: 'image-shoot' },
  { fromId: 'image-shoot', toId: 'image-delivery' },
  { x: 3096, y: 46, width: 36, direction: 'horizontal', fromId: 'video-delivery', toId: 'listing' },
  { x: 3096, y: 162, width: 36, direction: 'horizontal', fromId: 'image-delivery', toId: 'listing' },
  { x: 3132, y: 46, height: 116, direction: 'vertical', fromId: 'video-delivery', toId: 'image-delivery' },
];

function formatNodeStatus(status) {
  if (status === 'completed') return '已完成';
  if (status === 'in_progress') return '进行中';
  return '未开始';
}

function getNodeClasses(status, selected) {
  return cn(
    'group absolute rounded-xl border px-3 py-2.5 text-left transition-all',
    status === 'completed' && 'border-emerald-200 bg-emerald-50 text-emerald-700',
    status === 'in_progress' && 'border-brand-200 bg-brand-50 text-brand-700 shadow-md',
    status === 'not_started' && 'border-border bg-white text-text-muted',
    selected && 'ring-4 ring-brand-100'
  );
}

function getLineTone(fromStatus, toStatus) {
  if (fromStatus === 'completed' && toStatus === 'completed') return 'bg-emerald-300';
  if (fromStatus === 'in_progress' || toStatus === 'in_progress') return 'bg-brand-300';
  return 'bg-slate-200';
}

function FlowLine({ line, workflowMap, nodePositions }) {
  const fromNode = line.fromId ? workflowMap[line.fromId] : null;
  const toNode = line.toId ? workflowMap[line.toId] : null;
  const fromPos = line.fromId ? nodePositions[line.fromId] : null;
  const toPos = line.toId ? nodePositions[line.toId] : null;

  let style = {};
  if (line.direction === 'vertical') {
    style = {
      left: line.x,
      top: line.y,
      width: 2,
      height: line.height,
    };
  } else if (typeof line.x === 'number') {
    style = {
      left: line.x,
      top: line.y,
      width: line.width,
      height: 2,
    };
  } else if (fromPos && toPos) {
    style = {
      left: fromPos.x + FLOW_NODE_WIDTH,
      top: fromPos.y + FLOW_NODE_HEIGHT / 2,
      width: toPos.x - (fromPos.x + FLOW_NODE_WIDTH),
      height: 2,
    };
  }

  if (!style.width && !style.height) return null;

  return (
    <div
      className={cn(
        'absolute rounded-full',
        getLineTone(fromNode?.status, toNode?.status)
      )}
      style={style}
    />
  );
}

function WorkflowNodeButton({ node, position, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(node.id)}
      className={getNodeClasses(node.status, selected)}
      style={{
        left: position.x,
        top: position.y,
        width: FLOW_NODE_WIDTH,
        height: FLOW_NODE_HEIGHT,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'h-2.5 w-2.5 rounded-full',
                node.status === 'completed' && 'bg-emerald-500',
                node.status === 'in_progress' && 'bg-brand-500',
                node.status === 'not_started' && 'bg-slate-300'
              )}
            />
            <span className="block max-w-[74px] break-words text-sm font-semibold leading-4">{node.name}</span>
          </div>
          <div className="mt-1 text-[11px] opacity-80">{node.owner}</div>
        </div>
        <span
          className={cn(
            'rounded-full px-2 py-0.5 text-[10px] font-medium',
            node.status === 'completed' && 'bg-white/80 text-emerald-700',
            node.status === 'in_progress' && 'bg-white/80 text-brand-700',
            node.status === 'not_started' && 'bg-slate-100 text-slate-500'
          )}
        >
          {formatNodeStatus(node.status)}
        </span>
      </div>
    </button>
  );
}

function PeopleRow({ people }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex -space-x-2">
        {people.map((person) => (
          <div
            key={`${person.name}-${person.role}`}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-full border-2 border-white text-xs font-semibold shadow-sm',
              person.accent || 'bg-slate-100 text-slate-700'
            )}
            title={`${person.name} · ${person.role}`}
          >
            {person.name.slice(0, 1)}
          </div>
        ))}
      </div>
      <div className="text-sm text-text-subtle">{people.map((person) => person.name).join(' / ')}</div>
    </div>
  );
}

function InfoItem({ label, children, hint }) {
  return (
    <div className="rounded-2xl border border-border bg-white px-4 py-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-text-subtle">{label}</div>
      <div className="mt-2 text-sm text-text">{children}</div>
      {hint ? <div className="mt-2 text-xs text-text-subtle">{hint}</div> : null}
    </div>
  );
}

export default function ProjectWorkspacePage({ record, onClose }) {
  const project = useMemo(() => getProjectById(record?.id) || record || null, [record]);
  const [activeTab, setActiveTab] = useState('basic');
  const [copied, setCopied] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState(project?.currentNodeId || '');

  const selectedNode =
    project?.workflow.find((node) => node.id === selectedNodeId) ||
    project?.workflow.find((node) => node.id === project.currentNodeId) ||
    null;

  const statusMeta = project ? getProjectStatusMeta(project.status) : null;
  const categoryMeta = project ? getCategoryMeta(project.category) : null;
  const typeMeta = project ? getProjectTypeMeta(project.projectType) : null;
  const priorityMeta = project ? getPriorityMeta(project.priority) : null;
  const workflowMap = useMemo(() => Object.fromEntries((project?.workflow || []).map((node) => [node.id, node])), [project]);
  const nodePositions = useMemo(
    () => Object.fromEntries(FLOW_NODE_LAYOUT.map((item) => [item.id, item])),
    []
  );
  const flowNodes = useMemo(
    () => FLOW_NODE_LAYOUT.map((item) => workflowMap[item.id]).filter(Boolean),
    [workflowMap]
  );
  const flowWidth = FLOW_NODE_LAYOUT[FLOW_NODE_LAYOUT.length - 1].x + FLOW_NODE_WIDTH + 32;

  if (!project) {
    return (
      <div className="flex h-full items-center justify-center">
        <Card className="p-8 text-center">
          <div className="text-lg font-semibold text-text">项目不存在</div>
          <div className="mt-2 text-sm text-text-subtle">当前 tab 没有携带可展示的 mock 项目数据。</div>
        </Card>
      </div>
    );
  }

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(project.id);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch (error) {
      setCopied(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-2">
      <Card>
        <div className="flex flex-col gap-6 px-6 py-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight text-text">{project.projectName}</h1>
              <span
                className={cn(
                  'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium',
                  statusMeta.className
                )}
              >
                <span className={cn('h-2.5 w-2.5 rounded-full', statusMeta.dotClassName)} />
                {statusMeta.label}
              </span>
              <Badge tone="neutral">{project.durationLabel}</Badge>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm text-text-subtle">
              <span>{project.id}</span>
              <span>·</span>
              <span>{project.brand}</span>
              <span>·</span>
              <span>{project.mainMarkets.join(' / ')}</span>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-border bg-surface-subtle px-4 py-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-text-subtle">产品经理</div>
                <div className="mt-2 text-base font-semibold text-text">{project.productManager.name}</div>
                <div className="text-sm text-text-subtle">{project.productManager.role}</div>
              </div>
              <div className="rounded-2xl border border-border bg-surface-subtle px-4 py-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-text-subtle">当前负责人</div>
                <div className="mt-2 text-base font-semibold text-text">{project.currentOwners[0]?.name || '待分配'}</div>
                <div className="text-sm text-text-subtle">
                  {project.currentOwners.slice(1).map((owner) => owner.name).join(' / ') || '跨团队协同'}
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-surface-subtle px-4 py-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-text-subtle">当前节奏</div>
                <div className="mt-2 text-base font-semibold text-text">{selectedNode?.name || '未开始'}</div>
                <div className="text-sm text-text-subtle">{formatNodeStatus(selectedNode?.status || 'not_started')}</div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" icon={Users}>
              成员
            </Button>
            <Button variant="ghost" icon={Star}>
              标记/收藏
            </Button>
            <Button variant="ghost" icon={Copy} onClick={handleCopyId}>
              {copied ? '已复制' : '复制ID'}
            </Button>
            <Button variant="ghost" icon={MoreHorizontal}>
              更多
            </Button>
            <Button variant="ghost" icon={X} onClick={onClose}>
              关闭
            </Button>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="border-b border-border px-6 py-4">
          <div className="text-sm font-semibold text-text">项目流程推进</div>
          <div className="mt-1 text-xs text-text-subtle">
            紧凑横向流程带，支持左右滑动；局部分叉保留并行节点，主线节点保持连续连接。
          </div>
        </div>

        <div className="border-b border-border bg-surface-subtle/70 px-6 py-4">
          <div className="overflow-x-auto">
            <div
              className="relative"
              style={{
                width: flowWidth,
                minWidth: flowWidth,
                height: FLOW_CANVAS_HEIGHT,
              }}
            >
              {FLOW_LABELS.map((label) => (
                <div
                  key={`${label.text}-${label.x}-${label.y}`}
                  className="absolute text-[11px] font-semibold text-text-subtle"
                  style={{ left: label.x, top: label.y }}
                >
                  {label.text}
                </div>
              ))}

              {FLOW_LINE_LAYOUT.map((line, index) => (
                <FlowLine
                  key={`${line.fromId || 'line'}-${line.toId || 'none'}-${index}`}
                  line={line}
                  workflowMap={workflowMap}
                  nodePositions={nodePositions}
                />
              ))}

              {flowNodes.map((node) => (
                <WorkflowNodeButton
                  key={node.id}
                  node={node}
                  position={nodePositions[node.id]}
                  selected={selectedNode?.id === node.id}
                  onSelect={setSelectedNodeId}
                />
              ))}
            </div>
          </div>
        </div>

        {selectedNode && (
          <div className="border-t border-border bg-surface-subtle px-6 py-6">
            <Card className="border border-border bg-white">
              <div className="grid gap-6 px-5 py-5 lg:grid-cols-[1.4fr_0.9fr_0.7fr]">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-semibold text-text">{selectedNode.name}</h3>
                    <span
                      className={cn(
                        'inline-flex rounded-full border px-2.5 py-1 text-xs font-medium',
                        selectedNode.status === 'completed' && 'border-emerald-200 bg-emerald-50 text-emerald-700',
                        selectedNode.status === 'in_progress' && 'border-brand-200 bg-brand-50 text-brand-700',
                        selectedNode.status === 'not_started' && 'border-slate-200 bg-slate-100 text-slate-600'
                      )}
                    >
                      {formatNodeStatus(selectedNode.status)}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-text-muted">{selectedNode.description}</p>
                  <div className="mt-4 text-xs text-text-subtle">{selectedNode.remark}</div>
                </div>

                <div className="space-y-3">
                  <div className="rounded-2xl border border-border bg-surface-subtle px-4 py-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-text-subtle">负责人</div>
                    <div className="mt-2 text-sm font-semibold text-text">{selectedNode.owner}</div>
                  </div>
                  <div className="rounded-2xl border border-border bg-surface-subtle px-4 py-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-text-subtle">完成状态提示</div>
                    <div className="mt-2 text-sm text-text-muted">
                      {selectedNode.status === 'completed'
                        ? '节点已完成，可继续查看后续协同节点。'
                        : selectedNode.status === 'in_progress'
                          ? '节点正在推进，点击 Tabs 可查看节点详情与协作记录。'
                          : '当前节点尚未开始，等待前置节点满足。'}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="rounded-2xl border border-border bg-surface-subtle px-4 py-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-text-subtle">任务统计</div>
                    <div className="mt-2 text-lg font-semibold text-text">
                      全部任务（{selectedNode.taskStats.done}/{selectedNode.taskStats.total}）
                    </div>
                  </div>
                  <Button variant="secondary" icon={Plus} className="w-full justify-center">
                    新增任务
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </Card>

      <Card className="min-h-0 overflow-hidden">
        <div className="border-b border-border px-6">
          <div className="flex flex-wrap gap-2">
            {TAB_OPTIONS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'border-b-2 px-1 py-4 text-sm font-medium transition-colors',
                  activeTab === tab.key
                    ? 'border-brand-500 text-brand-700'
                    : 'border-transparent text-text-subtle hover:text-text'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-auto px-6 py-6">
          {activeTab === 'basic' && (
            <div className="grid gap-4 md:grid-cols-2">
              <InfoItem label="开模项目/非开模项目">
                <span className={cn('inline-flex rounded-full border px-2.5 py-1 text-xs font-medium', typeMeta.className)}>
                  {typeMeta.label}
                </span>
              </InfoItem>
              <InfoItem label="项目名称 ProjectName">{project.projectName}</InfoItem>
              <InfoItem label="计划上市时间">{project.plannedLaunchDate}</InfoItem>
              <InfoItem label="产品经理 Product Manager">{project.productManager.name}</InfoItem>
              <InfoItem label="品牌 Brand">{project.brand}</InfoItem>
              <InfoItem label="新品/老品 New/Old">{project.newOrOld}</InfoItem>
              <InfoItem label="主营市场 Main Market">
                <div className="flex flex-wrap gap-2">
                  {project.mainMarkets.map((market) => (
                    <span
                      key={market}
                      className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                    >
                      {market}
                    </span>
                  ))}
                </div>
              </InfoItem>
              <InfoItem label="类目 Category">
                <span className={cn('inline-flex rounded-full border px-2.5 py-1 text-xs font-medium', categoryMeta.className)}>
                  {categoryMeta.label}
                </span>
              </InfoItem>
              <InfoItem label="年度 Year">{project.year}</InfoItem>
              <InfoItem label="项目状态">
                <span className={cn('inline-flex rounded-full border px-2.5 py-1 text-xs font-medium', statusMeta.className)}>
                  {statusMeta.label}
                </span>
              </InfoItem>
              <InfoItem label="图片 Picture">{project.picture || '待填'}</InfoItem>
              <InfoItem
                label="SKU"
                hint="如超过 3 个 SKU，可只填写 3 个，备注详见白皮书。"
              >
                {project.sku || '待填'}
              </InfoItem>
              <InfoItem label="白皮书路径 White Paper">{project.whitePaperPath || '待填'}</InfoItem>
              <InfoItem label="项目备注">{project.projectRemark || '待填'}</InfoItem>
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="space-y-4">
              {project.comments.length > 0 ? (
                project.comments.map((comment) => (
                  <Card key={comment.id} className="border border-border bg-white p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-sm font-semibold text-text">{comment.author}</div>
                        <div className="mt-1 text-xs text-text-subtle">{comment.time}</div>
                      </div>
                      <Badge tone="neutral">评论</Badge>
                    </div>
                    <div className="mt-4 text-sm leading-6 text-text-muted">{comment.content}</div>
                  </Card>
                ))
              ) : (
                <Card className="border-dashed p-10 text-center">
                  <div className="text-base font-semibold text-text">暂无评论</div>
                  <div className="mt-2 text-sm text-text-subtle">这里保留评论/备注区位，后续可以接真实接口。</div>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'node' && selectedNode && (
            <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <Card className="border border-border bg-white p-5">
                <div className="text-lg font-semibold text-text">{selectedNode.name}</div>
                <div className="mt-3 text-sm leading-6 text-text-muted">{selectedNode.description}</div>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <InfoItem label="负责人">{selectedNode.owner}</InfoItem>
                  <InfoItem label="节点状态">{formatNodeStatus(selectedNode.status)}</InfoItem>
                  <InfoItem label="开始时间">{selectedNode.startedAt || '待填'}</InfoItem>
                  <InfoItem label="完成时间">{selectedNode.completedAt || '待填'}</InfoItem>
                </div>
              </Card>

              <div className="space-y-4">
                <Card className="border border-border bg-white p-5">
                  <div className="text-sm font-semibold text-text">关联任务</div>
                  <div className="mt-4 space-y-3">
                    {selectedNode.relatedTasks.map((task) => (
                      <div key={task} className="rounded-2xl border border-border bg-surface-subtle px-4 py-3 text-sm text-text-muted">
                        {task}
                      </div>
                    ))}
                  </div>
                </Card>
                <Card className="border border-border bg-white p-5">
                  <div className="text-sm font-semibold text-text">节点备注</div>
                  <div className="mt-3 text-sm leading-6 text-text-muted">{selectedNode.remark}</div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-4">
              {project.activities.map((activity) => (
                <div key={activity.id} className="flex gap-4">
                  <div className="flex w-20 flex-col items-center">
                    <div className="mt-1 h-3 w-3 rounded-full bg-brand-500" />
                    <div className="mt-2 h-full w-px bg-border" />
                  </div>
                  <Card className="flex-1 border border-border bg-white p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-sm font-semibold text-text">{activity.title}</div>
                        <div className="mt-1 text-xs text-text-subtle">{activity.time}</div>
                      </div>
                      <Badge tone="primary">操作记录</Badge>
                    </div>
                    <div className="mt-3 text-sm leading-6 text-text-muted">{activity.description}</div>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-sm font-semibold text-text">协同成员</div>
            <div className="mt-1 text-xs text-text-subtle">以 mock 方式展示项目里的跨角色协同关系。</div>
          </div>
          <PeopleRow people={[project.productManager, ...project.currentOwners.slice(0, 2), project.creator]} />
          <div className="flex items-center gap-2">
            <span className={cn('inline-flex rounded-full border px-2.5 py-1 text-xs font-medium', priorityMeta.className)}>
              {priorityMeta.label}
            </span>
            <span className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
              {project.businessLine}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
