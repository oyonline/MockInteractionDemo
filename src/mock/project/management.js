const statusMeta = {
  in_progress: {
    label: '进行中',
    tone: 'success',
    dotClassName: 'bg-emerald-500',
    className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  },
  completed: {
    label: '已完成',
    tone: 'primary',
    dotClassName: 'bg-sky-500',
    className: 'border-sky-200 bg-sky-50 text-sky-700',
  },
  pending: {
    label: '待启动',
    tone: 'neutral',
    dotClassName: 'bg-slate-400',
    className: 'border-slate-200 bg-slate-100 text-slate-600',
  },
  paused: {
    label: '已暂停',
    tone: 'warning',
    dotClassName: 'bg-amber-500',
    className: 'border-amber-200 bg-amber-50 text-amber-700',
  },
  delayed: {
    label: '已延期',
    tone: 'danger',
    dotClassName: 'bg-rose-500',
    className: 'border-rose-200 bg-rose-50 text-rose-700',
  },
};

const priorityMeta = {
  P0: { label: 'P0 高优', className: 'border-rose-200 bg-rose-50 text-rose-700' },
  P1: { label: 'P1 重点', className: 'border-orange-200 bg-orange-50 text-orange-700' },
  P2: { label: 'P2 常规', className: 'border-slate-200 bg-slate-100 text-slate-700' },
};

const categoryMeta = {
  饮水器具: { label: '饮水器具', className: 'border-cyan-200 bg-cyan-50 text-cyan-700' },
  厨房电器: { label: '厨房电器', className: 'border-orange-200 bg-orange-50 text-orange-700' },
  个护健康: { label: '个护健康', className: 'border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700' },
  家居收纳: { label: '家居收纳', className: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
  智能家居: { label: '智能家居', className: 'border-violet-200 bg-violet-50 text-violet-700' },
  宠物用品: { label: '宠物用品', className: 'border-lime-200 bg-lime-50 text-lime-700' },
};

const projectTypeMeta = {
  open_mold: {
    label: '开模项目流程',
    className: 'border-indigo-200 bg-indigo-50 text-indigo-700',
  },
  fast_track: {
    label: '非开模项目流程',
    className: 'border-slate-200 bg-slate-100 text-slate-700',
  },
};

const toolbarOptions = {
  categories: ['全部类目', '饮水器具', '厨房电器', '个护健康', '家居收纳', '智能家居', '宠物用品'],
  groups: ['项目状态', '类目 Category', '主营市场'],
  sorts: ['最近创建', '最早上市', '优先级', '项目名称'],
};

const workflowBlueprint = [
  {
    id: 'packaging-request',
    name: '提请包装需求',
    owner: '包装设计',
    description: '确认包装规格、认证要求和货架陈列方向，作为后续包装设计输入。',
    taskTotal: 3,
  },
  {
    id: 'packaging-design',
    name: '包装设计完成',
    owner: '包装设计',
    description: '输出刀模、结构图和印刷稿，完成包装视觉与结构对齐。',
    taskTotal: 4,
  },
  {
    id: 'mold-open',
    name: '磨具开模',
    owner: '结构工程',
    description: '开模项目进入模具设计与样件排期，非开模项目会在此节点做快速确认。',
    taskTotal: 2,
  },
  {
    id: 'first-sample',
    name: '产品开发首样',
    owner: '研发工程',
    description: '输出开发首样，验证结构、功能和核心成本。',
    taskTotal: 3,
  },
  {
    id: 'final-sample',
    name: '产品开发终样',
    owner: '产品经理',
    description: '整合包装设计完成与开发首样结论，锁定终样版本。',
    taskTotal: 4,
  },
  {
    id: 'trial-assembly',
    name: '产品试装',
    owner: '工厂工程',
    description: '验证装配动作、工装治具和包装入箱效率。',
    taskTotal: 3,
  },
  {
    id: 'final-test',
    name: '终样测试',
    owner: '测试工程',
    description: '完成终样可靠性、法规和运输测试。',
    taskTotal: 5,
  },
  {
    id: 'packaging-confirm',
    name: '包装确认',
    owner: '包装设计',
    description: '依赖产品试装与终样测试结果，完成包装版本最终确认。',
    taskTotal: 2,
  },
  {
    id: 'np-demo',
    name: 'NP Demo',
    owner: '产品经理',
    description: '组织新品 Demo，对齐卖点、测试结论和营销节奏。',
    taskTotal: 2,
  },
  {
    id: 'pre-production-sample',
    name: '产前样确认',
    owner: '供应链',
    description: '确认可量产样机、量产物料和最终版本清单。',
    taskTotal: 3,
  },
  {
    id: 'roi-mail',
    name: '发ROI邮件',
    owner: '业务分析',
    description: '开发完成后输出 ROI 说明邮件，供业务和管理层判断节奏。',
    taskTotal: 1,
  },
  {
    id: 'sales-forecast',
    name: '销量预计',
    owner: '销售计划',
    description: '结合渠道、定价与推广节奏，形成首批销量预测。',
    taskTotal: 2,
  },
  {
    id: 'analysis-plan',
    name: '计划整体分析',
    owner: '销售计划',
    description: '梳理备货、广告、视频和图片交付节奏的综合计划。',
    taskTotal: 2,
  },
  {
    id: 'bulk-order',
    name: '大货下单',
    owner: '采购',
    description: '按量产计划发出大货订单，锁定供应商交付窗口。',
    taskTotal: 2,
  },
  {
    id: 'supplier-delivery',
    name: '供应商交货',
    owner: '供应链',
    description: '跟踪供应商齐套交付、抽检和出运前准备。',
    taskTotal: 4,
  },
  {
    id: 'ship-to-us',
    name: '发往美国',
    owner: '物流',
    description: '安排订舱、提柜和头程运输，保障开售窗口。',
    taskTotal: 2,
  },
  {
    id: 'arrival',
    name: '到货',
    owner: '物流',
    description: '仓库签收入库并完成首批可售库存确认。',
    taskTotal: 1,
  },
  {
    id: 'npi',
    name: 'NPI',
    owner: 'NPI',
    description: '同步上市前跨部门协同事项，承接素材与内容生产。',
    taskTotal: 2,
  },
  {
    id: 'photo-sample',
    name: '提供拍摄样',
    owner: '产品经理',
    description: '准备拍摄样机、卖点说明和禁用话术。',
    taskTotal: 2,
  },
  {
    id: 'video-framework',
    name: '视频展示框架',
    owner: '内容策划',
    description: '搭建视频脚本结构和重点镜头说明。',
    taskTotal: 2,
  },
  {
    id: 'video-demo',
    name: '视频展示设计Demo',
    owner: '视觉设计',
    description: '产出视频风格 Demo，用于确定镜头调性与字幕版式。',
    taskTotal: 2,
  },
  {
    id: 'video-shoot',
    name: '视频拍摄',
    owner: '内容制作',
    description: '按脚本完成拍摄与粗剪，确认核心功能镜头。',
    taskTotal: 3,
  },
  {
    id: 'video-delivery',
    name: '视频交付',
    owner: '内容制作',
    description: '完成成片交付并同步上架素材库。',
    taskTotal: 1,
  },
  {
    id: 'visual-needs',
    name: '视觉需求',
    owner: '视觉设计',
    description: '确认图片张数、主图风格和卖点拆解。',
    taskTotal: 2,
  },
  {
    id: 'image-framework',
    name: '图片展示框架',
    owner: '视觉设计',
    description: '搭建主图、A+ 与详情页信息层级。',
    taskTotal: 2,
  },
  {
    id: 'image-demo',
    name: '图片展示设计Demo',
    owner: '视觉设计',
    description: '输出图片设计 Demo，确定风格和信息优先级。',
    taskTotal: 2,
  },
  {
    id: 'image-shoot',
    name: '图片拍摄/选图',
    owner: '摄影',
    description: '完成静物拍摄并筛选最终图组。',
    taskTotal: 3,
  },
  {
    id: 'image-delivery',
    name: '图片交付',
    owner: '视觉设计',
    description: '完成图片素材交付和上架适配尺寸输出。',
    taskTotal: 1,
  },
  {
    id: 'listing',
    name: '上架',
    owner: '运营',
    description: '依赖到货、视频交付与图片交付完成后执行正式上架。',
    taskTotal: 2,
  },
];

const completedAtMap = {
  'packaging-request': '2026-03-02 10:00',
  'packaging-design': '2026-03-04 18:20',
  'mold-open': '2026-03-07 14:30',
  'first-sample': '2026-03-12 20:10',
  'final-sample': '2026-03-17 11:40',
  'trial-assembly': '2026-03-19 09:30',
  'final-test': '2026-03-22 19:15',
  'packaging-confirm': '2026-03-24 17:20',
  'np-demo': '2026-03-25 15:00',
  'pre-production-sample': '2026-03-27 16:35',
  'roi-mail': '2026-03-28 09:15',
  'sales-forecast': '2026-03-28 14:40',
  'analysis-plan': '2026-03-29 12:00',
  'bulk-order': '2026-03-30 18:00',
  'supplier-delivery': '2026-04-06 11:00',
  'ship-to-us': '2026-04-14 09:30',
  arrival: '2026-04-25 10:20',
  npi: '2026-03-29 18:10',
  'photo-sample': '2026-03-30 11:10',
  'video-framework': '2026-03-31 16:40',
  'video-demo': '2026-04-01 20:10',
  'video-shoot': '2026-04-04 18:30',
  'video-delivery': '2026-04-06 15:00',
  'visual-needs': '2026-03-30 13:40',
  'image-framework': '2026-03-31 10:20',
  'image-demo': '2026-04-02 17:20',
  'image-shoot': '2026-04-04 19:30',
  'image-delivery': '2026-04-05 21:10',
  listing: '2026-04-26 09:00',
};

function buildWorkflow(currentNodeId, options = {}) {
  const currentIndex = workflowBlueprint.findIndex((item) => item.id === currentNodeId);
  const {
    forcedStatuses = {},
    ownerOverrides = {},
    startedAtOverrides = {},
    completedOverrides = {},
    noteOverrides = {},
  } = options;

  return workflowBlueprint.map((item, index) => {
    const status =
      forcedStatuses[item.id] ||
      (currentIndex === -1
        ? 'not_started'
        : index < currentIndex
          ? 'completed'
          : index === currentIndex
            ? 'in_progress'
            : 'not_started');
    const completedTasks =
      status === 'completed' ? item.taskTotal : status === 'in_progress' ? Math.max(item.taskTotal - 1, 0) : 0;

    return {
      ...item,
      owner: ownerOverrides[item.id] || item.owner,
      status,
      startedAt:
        startedAtOverrides[item.id] ||
        (index <= currentIndex || status === 'completed' ? `2026-03-${String(2 + index).padStart(2, '0')} 10:00` : ''),
      completedAt:
        status === 'completed'
          ? completedOverrides[item.id] || completedAtMap[item.id] || `2026-03-${String(3 + index).padStart(2, '0')} 18:00`
          : '',
      taskStats: {
        done: completedTasks,
        total: item.taskTotal,
      },
      remark:
        noteOverrides[item.id] ||
        (status === 'completed'
          ? '节点已流转完成，相关附件与结论已归档。'
          : status === 'in_progress'
            ? '节点正在推进，当前卡片数据为 mock 演示状态。'
            : '节点尚未开始，等待前置流程满足。'),
      relatedTasks: [
        `${item.name}事项对齐`,
        `${item.owner}确认`,
        `${item.name}结果回传`,
      ],
    };
  });
}

function buildComments(projectName, participants) {
  return [
    {
      id: `${projectName}-comment-1`,
      author: participants[0],
      time: '2026-04-01 09:20',
      content: `已同步 ${projectName} 本周推进节奏，包装、视频和图片素材都按上架窗口倒排。`,
    },
    {
      id: `${projectName}-comment-2`,
      author: participants[1],
      time: '2026-03-31 18:45',
      content: '工厂反馈首批交期可控，但终样锁版后不要再改尺寸，避免重开包材刀模。',
    },
    {
      id: `${projectName}-comment-3`,
      author: participants[2],
      time: '2026-03-30 14:10',
      content: '销售侧已补充核心卖点建议，详情页第一屏需要强化差异化场景。',
    },
  ];
}

function buildActivities(projectName, owner) {
  return [
    {
      id: `${projectName}-activity-1`,
      time: '2026-03-01 10:12',
      title: '创建项目',
      description: `${owner} 创建项目并补充基础信息。`,
    },
    {
      id: `${projectName}-activity-2`,
      time: '2026-03-03 15:50',
      title: '分配负责人',
      description: '已同步产品、供应链、视觉设计与 NPI 负责人。',
    },
    {
      id: `${projectName}-activity-3`,
      time: '2026-03-18 11:40',
      title: '节点完成',
      description: '产品开发终样已确认，流程推进到后续协同节点。',
    },
    {
      id: `${projectName}-activity-4`,
      time: '2026-03-27 18:05',
      title: '修改上市时间',
      description: '根据头程排期，将计划上市时间更新为最新版本。',
    },
    {
      id: `${projectName}-activity-5`,
      time: '2026-03-31 09:15',
      title: '补充备注',
      description: '补充 SKU 与白皮书说明，作为销售与设计同步依据。',
    },
  ];
}

function person(name, role, accent) {
  return { name, role, accent };
}

export const projectManagementProjects = [
  {
    id: 'PRJ-2026-041',
    category: '饮水器具',
    plannedLaunchDate: '2026-06-18',
    projectName: 'HydraGo 冷感吨吨杯 USA DTC 首发项目',
    latestComment: '包装刀模已回传，终样测试结论待销售确认。',
    status: 'in_progress',
    productManager: person('陈沐', 'Product Manager', 'bg-cyan-100 text-cyan-700'),
    currentOwners: [
      person('林栩', '供应链', 'bg-emerald-100 text-emerald-700'),
      person('周芷', '包装设计', 'bg-orange-100 text-orange-700'),
      person('姚霁', 'NPI', 'bg-indigo-100 text-indigo-700'),
    ],
    mainMarkets: ['USA ONLINE', 'USA DTC'],
    factoryLeadTimeFeedback: '模具厂反馈 18 天可交首批',
    pmSampleProvided: '4月3日提供终样',
    priority: 'P0',
    businessLine: '生活方式',
    projectType: 'open_mold',
    createdAt: '2026-03-01 10:12',
    creator: person('梁蕙', '创建者', 'bg-slate-100 text-slate-700'),
    brand: 'HydraGo',
    newOrOld: '新品',
    year: '2026',
    picture: '主图方案待定，已上传拍摄参考板。',
    sku: 'HG-BTL-24OZ-BL, HG-BTL-24OZ-MI, HG-BTL-32OZ-SA',
    whitePaperPath: '/white-paper/hydrago-cooling-bottle-v3',
    projectRemark: '目标为美国 DTC 夏季站点首发，主打户外通勤与健身场景。',
    durationLabel: '已进行 17 天',
    currentNodeId: 'video-demo',
    workflow: buildWorkflow('video-demo', {
      ownerOverrides: {
        'video-demo': '周芷',
        'video-shoot': '蒋澄',
        'image-demo': '顾音',
      },
    }),
    comments: buildComments('HydraGo 冷感吨吨杯 USA DTC 首发项目', ['陈沐', '林栩', '庄晴']),
    activities: buildActivities('HydraGo 冷感吨吨杯 USA DTC 首发项目', '梁蕙'),
  },
  {
    id: 'PRJ-2026-028',
    category: '厨房电器',
    plannedLaunchDate: '2026-05-28',
    projectName: 'AeroBake 6QT 空气炸锅 Costco 特规项目',
    latestComment: '量产复盘已完成，门店装箱要求归档。',
    status: 'completed',
    productManager: person('宋柠', 'Product Manager', 'bg-orange-100 text-orange-700'),
    currentOwners: [
      person('谢欢', '供应链', 'bg-emerald-100 text-emerald-700'),
      person('曾宁', '运营', 'bg-sky-100 text-sky-700'),
    ],
    mainMarkets: ['USA RETAIL', 'USA COSTCO'],
    factoryLeadTimeFeedback: '整柜交付已完成',
    pmSampleProvided: '已归档',
    priority: 'P1',
    businessLine: '厨房家电',
    projectType: 'open_mold',
    createdAt: '2026-01-12 09:06',
    creator: person('陶序', '创建者', 'bg-slate-100 text-slate-700'),
    brand: 'AeroBake',
    newOrOld: '新品',
    year: '2026',
    picture: '门店端陈列图与包装图已归档。',
    sku: 'AB-AF-6QT-BK, AB-AF-6QT-CR',
    whitePaperPath: '/white-paper/aerobake-airfryer-launch-v5',
    projectRemark: 'Costco 渠道规格，重点关注外箱尺寸与门店促销档期。',
    durationLabel: '已完成',
    currentNodeId: 'listing',
    workflow: buildWorkflow('listing', {
      forcedStatuses: {
        listing: 'completed',
      },
    }),
    comments: buildComments('AeroBake 6QT 空气炸锅 Costco 特规项目', ['宋柠', '谢欢', '曾宁']),
    activities: buildActivities('AeroBake 6QT 空气炸锅 Costco 特规项目', '陶序'),
  },
  {
    id: 'PRJ-2026-053',
    category: '智能家居',
    plannedLaunchDate: '2026-08-12',
    projectName: 'NestPure 桌面净饮机 USA Online 增量项目',
    latestComment: '',
    status: 'pending',
    productManager: person('顾清', 'Product Manager', 'bg-violet-100 text-violet-700'),
    currentOwners: [
      person('顾清', '产品经理', 'bg-violet-100 text-violet-700'),
      person('姚霁', 'NPI', 'bg-indigo-100 text-indigo-700'),
    ],
    mainMarkets: ['USA ONLINE'],
    factoryLeadTimeFeedback: '等待立项后评估',
    pmSampleProvided: '待排期',
    priority: 'P2',
    businessLine: '智能家电',
    projectType: 'open_mold',
    createdAt: '2026-03-22 16:20',
    creator: person('林霏', '创建者', 'bg-slate-100 text-slate-700'),
    brand: 'NestPure',
    newOrOld: '老品迭代',
    year: '2026',
    picture: '',
    sku: 'NP-WATER-01',
    whitePaperPath: '',
    projectRemark: '等待美国站点确认净水滤芯认证方案后正式推进。',
    durationLabel: '待启动',
    currentNodeId: 'packaging-request',
    workflow: buildWorkflow('packaging-request', {
      noteOverrides: {
        'packaging-request': '项目待立项通过后启动，此处仅做前置资料准备。',
      },
    }),
    comments: [],
    activities: buildActivities('NestPure 桌面净饮机 USA Online 增量项目', '林霏'),
  },
  {
    id: 'PRJ-2026-035',
    category: '个护健康',
    plannedLaunchDate: '2026-07-03',
    projectName: 'ClearPulse 蓝牙体脂秤 Walmart DSV 项目',
    latestComment: '供应商齐套慢于预期，建议同步备选工厂。',
    status: 'delayed',
    productManager: person('陆闻', 'Product Manager', 'bg-fuchsia-100 text-fuchsia-700'),
    currentOwners: [
      person('谢欢', '供应链', 'bg-emerald-100 text-emerald-700'),
      person('蒋澄', '内容制作', 'bg-sky-100 text-sky-700'),
      person('顾音', '视觉设计', 'bg-rose-100 text-rose-700'),
    ],
    mainMarkets: ['USA WALMART', 'USA ONLINE'],
    factoryLeadTimeFeedback: '主工厂交期推迟 9 天',
    pmSampleProvided: '已提供拍摄样',
    priority: 'P0',
    businessLine: '健康设备',
    projectType: 'fast_track',
    createdAt: '2026-02-18 14:08',
    creator: person('齐越', '创建者', 'bg-slate-100 text-slate-700'),
    brand: 'ClearPulse',
    newOrOld: '新品',
    year: '2026',
    picture: '首版主图可用，详情页文案待更新。',
    sku: 'CP-SCALE-BK, CP-SCALE-WH',
    whitePaperPath: '/white-paper/clearpulse-scale-walmart-v2',
    projectRemark: 'Walmart DSV 需要兼顾低价心智与蓝牙功能展示，当前交期存在风险。',
    durationLabel: '已进行 41 天',
    currentNodeId: 'supplier-delivery',
    workflow: buildWorkflow('supplier-delivery', {
      ownerOverrides: {
        'supplier-delivery': '谢欢',
      },
      noteOverrides: {
        'supplier-delivery': '供应商交货延迟，当前节点用于模拟延期项目的高亮状态。',
      },
    }),
    comments: buildComments('ClearPulse 蓝牙体脂秤 Walmart DSV 项目', ['陆闻', '谢欢', '顾音']),
    activities: buildActivities('ClearPulse 蓝牙体脂秤 Walmart DSV 项目', '齐越'),
  },
  {
    id: 'PRJ-2026-047',
    category: '家居收纳',
    plannedLaunchDate: '2026-06-02',
    projectName: 'FoldMate 后备箱收纳箱 非开模快反项目',
    latestComment: '图片选图已过，正在等视频字幕版本。',
    status: 'in_progress',
    productManager: person('韩汀', 'Product Manager', 'bg-emerald-100 text-emerald-700'),
    currentOwners: [
      person('黎舟', '运营', 'bg-sky-100 text-sky-700'),
      person('顾音', '视觉设计', 'bg-rose-100 text-rose-700'),
    ],
    mainMarkets: ['USA DTC', 'USA ONLINE'],
    factoryLeadTimeFeedback: '快反布料已锁，7 天可交',
    pmSampleProvided: '3月30日已寄拍摄样',
    priority: 'P1',
    businessLine: '家居用品',
    projectType: 'fast_track',
    createdAt: '2026-03-06 11:42',
    creator: person('韩汀', '创建者', 'bg-slate-100 text-slate-700'),
    brand: 'FoldMate',
    newOrOld: '老品迭代',
    year: '2026',
    picture: '详情页第一屏已确认，主图文字待美化。',
    sku: 'FM-TRUNK-L, FM-TRUNK-M, FM-TRUNK-S',
    whitePaperPath: '/white-paper/foldmate-fast-track-v1',
    projectRemark: '非开模快反项目，目标抢 618 前两周流量窗口。',
    durationLabel: '已进行 24 天',
    currentNodeId: 'video-delivery',
    workflow: buildWorkflow('video-delivery'),
    comments: buildComments('FoldMate 后备箱收纳箱 非开模快反项目', ['韩汀', '顾音', '黎舟']),
    activities: buildActivities('FoldMate 后备箱收纳箱 非开模快反项目', '韩汀'),
  },
  {
    id: 'PRJ-2026-014',
    category: '宠物用品',
    plannedLaunchDate: '2026-04-15',
    projectName: 'PetHalo 宠物饮水机 欧洲站点切换项目',
    latestComment: '欧洲站点链接已切换，历史评价承接完成。',
    status: 'completed',
    productManager: person('温禾', 'Product Manager', 'bg-lime-100 text-lime-700'),
    currentOwners: [
      person('许衡', '运营', 'bg-sky-100 text-sky-700'),
      person('陈沐', '产品经理', 'bg-cyan-100 text-cyan-700'),
    ],
    mainMarkets: ['EU ONLINE', 'DE AMAZON'],
    factoryLeadTimeFeedback: '到货结案',
    pmSampleProvided: '已归档',
    priority: 'P2',
    businessLine: '宠物用品',
    projectType: 'fast_track',
    createdAt: '2026-01-03 13:35',
    creator: person('严禾', '创建者', 'bg-slate-100 text-slate-700'),
    brand: 'PetHalo',
    newOrOld: '老品切换',
    year: '2026',
    picture: '站点图已归档。',
    sku: 'PH-WATER-EU-01, PH-WATER-EU-02',
    whitePaperPath: '/white-paper/pethalo-eu-switch-v2',
    projectRemark: '项目以站点迁移和素材替换为主，流程采用非开模快反路径。',
    durationLabel: '已完成',
    currentNodeId: 'listing',
    workflow: buildWorkflow('listing', {
      forcedStatuses: {
        listing: 'completed',
      },
    }),
    comments: buildComments('PetHalo 宠物饮水机 欧洲站点切换项目', ['温禾', '许衡', '陈沐']),
    activities: buildActivities('PetHalo 宠物饮水机 欧洲站点切换项目', '严禾'),
  },
  {
    id: 'PRJ-2026-044',
    category: '智能家居',
    plannedLaunchDate: '2026-07-21',
    projectName: 'GlowNest 香薰夜灯 TikTok Shop 联名项目',
    latestComment: '联名方视觉规范变更，先暂停视频拍摄。',
    status: 'paused',
    productManager: person('乔溪', 'Product Manager', 'bg-violet-100 text-violet-700'),
    currentOwners: [
      person('周芷', '包装设计', 'bg-orange-100 text-orange-700'),
      person('顾音', '视觉设计', 'bg-rose-100 text-rose-700'),
    ],
    mainMarkets: ['USA TIKTOK', 'USA DTC'],
    factoryLeadTimeFeedback: '联名包装待重新确认',
    pmSampleProvided: '样机在联名方评审',
    priority: 'P1',
    businessLine: '氛围家居',
    projectType: 'open_mold',
    createdAt: '2026-03-09 18:22',
    creator: person('乔溪', '创建者', 'bg-slate-100 text-slate-700'),
    brand: 'GlowNest',
    newOrOld: '新品',
    year: '2026',
    picture: '',
    sku: 'GN-LAMP-LM01',
    whitePaperPath: '/white-paper/glownest-collab-v1',
    projectRemark: '联名项目，品牌视觉审批权较高，当前暂停等待联名方二次确认。',
    durationLabel: '已暂停 6 天',
    currentNodeId: 'visual-needs',
    workflow: buildWorkflow('visual-needs'),
    comments: buildComments('GlowNest 香薰夜灯 TikTok Shop 联名项目', ['乔溪', '周芷', '顾音']),
    activities: buildActivities('GlowNest 香薰夜灯 TikTok Shop 联名项目', '乔溪'),
  },
];

export function getProjectById(projectId) {
  return projectManagementProjects.find((item) => item.id === projectId) || null;
}

export function getProjectStatusMeta(status) {
  return statusMeta[status] || statusMeta.pending;
}

export function getPriorityMeta(priority) {
  return priorityMeta[priority] || priorityMeta.P2;
}

export function getCategoryMeta(category) {
  return categoryMeta[category] || categoryMeta['家居收纳'];
}

export function getProjectTypeMeta(type) {
  return projectTypeMeta[type] || projectTypeMeta.fast_track;
}

export const projectManagementMeta = {
  statusMeta,
  priorityMeta,
  categoryMeta,
  projectTypeMeta,
  toolbarOptions,
  workflowBlueprint,
};
