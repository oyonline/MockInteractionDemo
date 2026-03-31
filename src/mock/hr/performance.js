export const performanceReviews = [
  {
    id: 'perf-1001',
    employeeName: '李娜',
    employeeNo: 'EP2020005',
    department: '产品部',
    position: '产品总监',
    cycle: '2026 Q1',
    score: 94,
    grade: 'A',
    completionRate: 108,
    status: 'in_review',
    calibrationStatus: 'pending',
    owner: '周雪',
    manager: '刘洋',
    lastUpdated: '今天 11:20',
    talentBox: '高绩效 / 高潜力',
    riskLevel: 'low',
    strengths: ['业务判断', '团队协同', '目标拆解'],
    concern: '需要提前规划下一层级管理授权，避免过度依赖个人推进。',
    summary: '负责北美新品项目节奏与季度产品路线图，目标达成和跨团队协调表现突出。',
    goalsHtml: `
      <h3>季度目标完成情况</h3>
      <p><strong>目标一：</strong>完成美国站新品路线图梳理并落地 3 个关键项目，完成率 110%。</p>
      <p><strong>目标二：</strong>推动供应链预测协同机制落地，异常库存周转天数下降 12%。</p>
    `,
    feedbackHtml: `
      <h3>直属上级评价</h3>
      <p>在复杂协同场景下判断稳定，能够提前识别风险并推动跨部门资源对齐，是本周期核心项目的关键 owner。</p>
      <p><strong>下一步建议：</strong>加强梯队培养和授权，扩大管理半径。</p>
    `,
    coachingHtml: `
      <h3>绩效面谈纪要</h3>
      <p>员工希望下一季度参与更多业务预算与优先级决策，希望在组织发展上承担更多职责。</p>
      <p><strong>行动项：</strong>4 月中旬前明确产品中台角色分工与备份机制。</p>
    `,
    timeline: [
      { label: '员工自评提交', date: '2026-03-22 18:30', done: true },
      { label: '直属上级评估完成', date: '2026-03-26 09:20', done: true },
      { label: '绩效校准待开始', date: '2026-04-01 14:00', done: false },
    ],
  },
  {
    id: 'perf-1002',
    employeeName: '周雪',
    employeeNo: 'EP2022022',
    department: '人力资源',
    position: 'HRBP',
    cycle: '2026 Q1',
    score: 89,
    grade: 'A-',
    completionRate: 101,
    status: 'completed',
    calibrationStatus: 'done',
    owner: '周雪',
    manager: '王敏',
    lastUpdated: '昨天 17:40',
    talentBox: '稳态骨干',
    riskLevel: 'low',
    strengths: ['招聘交付', '组织支持', '数据复盘'],
    concern: '组织诊断项目沉淀可以进一步模板化，提高跨事业部复用效率。',
    summary: '校招与关键岗位招聘交付稳定，组织支持反馈较好，绩效闭环完成度高。',
    goalsHtml: `
      <h3>季度目标完成情况</h3>
      <p><strong>目标一：</strong>关键岗位交付 9 人，实际完成 10 人，超额完成。</p>
      <p><strong>目标二：</strong>完善试用期回访机制，覆盖率达到 100%。</p>
    `,
    feedbackHtml: `
      <h3>直属上级评价</h3>
      <p>在业务支持和招聘推进上响应及时，对招聘 funnel 的数据敏感度较好，能够主动识别瓶颈。</p>
      <p><strong>下一步建议：</strong>继续提升组织发展项目的结构化输出能力。</p>
    `,
    coachingHtml: `
      <h3>绩效面谈纪要</h3>
      <p>员工希望提升 OD 项目深度，希望参与更多跨部门人才盘点会议。</p>
      <p><strong>行动项：</strong>下季度牵头一次事业部人才盘点试点。</p>
    `,
    timeline: [
      { label: '员工自评提交', date: '2026-03-20 20:10', done: true },
      { label: '直属上级评估完成', date: '2026-03-24 14:00', done: true },
      { label: '校准完成', date: '2026-03-28 16:20', done: true },
    ],
  },
  {
    id: 'perf-1003',
    employeeName: '孙涛',
    employeeNo: 'EP2020050',
    department: '供应链部',
    position: '供应链总监',
    cycle: '2026 Q1',
    score: 86,
    grade: 'B+',
    completionRate: 97,
    status: 'in_review',
    calibrationStatus: 'scheduled',
    owner: '林凡',
    manager: '陈妍',
    lastUpdated: '今天 09:10',
    talentBox: '高潜待观察',
    riskLevel: 'medium',
    strengths: ['计划协同', '异常响应', '数据治理'],
    concern: '组织协同效率稳定，但中长期流程优化项目节奏还可以再前置。',
    summary: '多仓补货和库存优化结果稳定，但供应链数字化项目推进略慢于预期。',
    goalsHtml: `
      <h3>季度目标完成情况</h3>
      <p><strong>目标一：</strong>异常库存周转天数下降 8%，实际完成 7%。</p>
      <p><strong>目标二：</strong>完成供应计划评审机制升级，已完成流程发布。</p>
    `,
    feedbackHtml: `
      <h3>直属上级评价</h3>
      <p>业务运营稳定性强，是关键协同节点，但对跨系统推动与项目里程碑节奏仍需更主动。</p>
      <p><strong>下一步建议：</strong>明确数字化项目 owner 机制，提升跨团队拉通力度。</p>
    `,
    coachingHtml: `
      <h3>绩效面谈纪要</h3>
      <p>员工认可当前评估结果，希望获得更清晰的组织资源支持。</p>
      <p><strong>行动项：</strong>在 4 月第一周补齐项目排期与负责人清单。</p>
    `,
    timeline: [
      { label: '员工自评提交', date: '2026-03-23 21:00', done: true },
      { label: '直属上级评估完成', date: '2026-03-27 10:30', done: true },
      { label: '校准会已预约', date: '2026-04-02 10:00', done: false },
    ],
  },
  {
    id: 'perf-1004',
    employeeName: '陈静',
    employeeNo: 'EP2021015',
    department: '财务部',
    position: '财务经理',
    cycle: '2026 Q1',
    score: 82,
    grade: 'B',
    completionRate: 93,
    status: 'draft',
    calibrationStatus: 'none',
    owner: '王敏',
    manager: '张瑞',
    lastUpdated: '2 天前',
    talentBox: '稳态执行',
    riskLevel: 'low',
    strengths: ['财务流程', '风险控制', '复盘意识'],
    concern: '跨部门业务支持略偏保守，建议提高前置沟通与业务理解深度。',
    summary: '财务流程和核算准确度较高，项目支持能力仍有提升空间。',
    goalsHtml: `
      <h3>季度目标完成情况</h3>
      <p><strong>目标一：</strong>预算执行偏差控制在 5% 内，实际完成 4.6%。</p>
      <p><strong>目标二：</strong>完成费用归类口径统一，仍有 1 项规则待发布。</p>
    `,
    feedbackHtml: `
      <h3>直属上级评价</h3>
      <p>专业性扎实，但对业务前置支持略显被动，建议增加与业务团队的周期性对齐。</p>
      <p><strong>下一步建议：</strong>加强费用规则宣导与预算沟通机制。</p>
    `,
    coachingHtml: `
      <h3>绩效面谈纪要</h3>
      <p>员工希望更清楚地了解业务团队预期，也愿意承担更多经营分析支持工作。</p>
      <p><strong>行动项：</strong>安排一次与财务 BP 的联合复盘。</p>
    `,
    timeline: [
      { label: '员工自评提交', date: '2026-03-25 19:10', done: true },
      { label: '直属上级待评估', date: '2026-04-01 18:00', done: false },
    ],
  },
  {
    id: 'perf-1005',
    employeeName: '赵敏',
    employeeNo: 'EP2023015',
    department: '客服部',
    position: '客服主管',
    cycle: '2026 Q1',
    score: 78,
    grade: 'C+',
    completionRate: 88,
    status: 'needs_attention',
    calibrationStatus: 'pending',
    owner: '王敏',
    manager: '刘婷',
    lastUpdated: '今天 13:05',
    talentBox: '重点辅导',
    riskLevel: 'high',
    strengths: ['团队带教', '客户响应'],
    concern: '团队排班和 SLA 管理波动较大，需尽快明确改进节奏。',
    summary: '服务质量总体可控，但团队排班与流程执行稳定性不足，需要重点辅导。',
    goalsHtml: `
      <h3>季度目标完成情况</h3>
      <p><strong>目标一：</strong>客户满意度保持 95% 以上，实际完成 92.8%。</p>
      <p><strong>目标二：</strong>新人带教周期缩短 10%，实际完成 5%。</p>
    `,
    feedbackHtml: `
      <h3>直属上级评价</h3>
      <p>责任心强，但在团队经营和数据化管理上还需提升，建议设定更明确的辅导计划。</p>
      <p><strong>下一步建议：</strong>安排月度辅导与明确的排班优化目标。</p>
    `,
    coachingHtml: `
      <h3>绩效面谈纪要</h3>
      <p>员工认可问题点，希望获得更清晰的改进模板与跨班组支持。</p>
      <p><strong>行动项：</strong>4 月内完成排班优化试运行，并追踪客服满意度。</p>
    `,
    timeline: [
      { label: '员工自评提交', date: '2026-03-21 18:40', done: true },
      { label: '直属上级评估完成', date: '2026-03-28 20:20', done: true },
      { label: '改进计划待确认', date: '2026-04-03 15:00', done: false },
    ],
  },
  {
    id: 'perf-1006',
    employeeName: '王强',
    employeeNo: 'EP2022008',
    department: '市场部',
    position: '市场经理',
    cycle: '2026 Q1',
    score: 91,
    grade: 'A',
    completionRate: 105,
    status: 'completed',
    calibrationStatus: 'done',
    owner: '陈妍',
    manager: '李娜',
    lastUpdated: '昨天 15:15',
    talentBox: '高绩效 / 稳定输出',
    riskLevel: 'low',
    strengths: ['项目执行', '营销策划', '新人带教'],
    concern: '可以逐步提升品牌策略与中长期项目规划能力。',
    summary: '本季度营销项目执行扎实，按期完成大促活动与复盘沉淀。',
    goalsHtml: `
      <h3>季度目标完成情况</h3>
      <p><strong>目标一：</strong>完成三场重点营销活动，实际全部按期交付。</p>
      <p><strong>目标二：</strong>建立活动复盘模板并推广，完成率 100%。</p>
    `,
    feedbackHtml: `
      <h3>直属上级评价</h3>
      <p>执行强、反馈快，是团队稳定输出的重要骨干，可以继续提升策略深度与经营视角。</p>
      <p><strong>下一步建议：</strong>牵头一次跨团队 campaign 方案。</p>
    `,
    coachingHtml: `
      <h3>绩效面谈纪要</h3>
      <p>员工希望未来承担更多跨部门项目，愿意尝试更复杂的 campaign 统筹。</p>
      <p><strong>行动项：</strong>下季度安排担任一次大型活动总负责人。</p>
    `,
    timeline: [
      { label: '员工自评提交', date: '2026-03-20 19:00', done: true },
      { label: '直属上级评估完成', date: '2026-03-25 13:40', done: true },
      { label: '校准完成', date: '2026-03-29 11:15', done: true },
    ],
  },
];

export const performanceCycleOptions = [
  { value: '', label: '全部周期' },
  { value: '2026 Q1', label: '2026 Q1' },
];

export const performanceStatusOptions = [
  { value: '', label: '全部状态' },
  { value: 'draft', label: '待上级评估' },
  { value: 'in_review', label: '评审中' },
  { value: 'completed', label: '已完成' },
  { value: 'needs_attention', label: '重点辅导' },
];
