export const recruitmentPositions = [
  {
    id: 'pos-1',
    title: '跨境平台招商经理',
    department: '人力资源',
    headcount: 2,
    priority: 'high',
    owner: '周雪',
    status: 'open',
    city: '深圳',
    channelMix: ['BOSS直聘', '内推'],
    salaryRange: '25k-35k',
    summary: '负责平台招商团队搭建与候选人评估，优先推进有平台招商或平台招商运营经验的人选。',
    jdHtml: `
      <h3>岗位重点</h3>
      <p>负责平台招商关键岗位搜寻、初筛与业务面流程推动，建立高潜候选人池并优化 offer 转化效率。</p>
      <p><strong>核心要求：</strong>3 年以上招聘或业务型猎头经验，熟悉跨境电商/平台招商语境，能够独立完成用人校准。</p>
    `,
  },
  {
    id: 'pos-2',
    title: '高级供应链计划专员',
    department: '供应链计划',
    headcount: 1,
    priority: 'medium',
    owner: '林凡',
    status: 'open',
    city: '上海',
    channelMix: ['智联招聘', '猎头'],
    salaryRange: '18k-24k',
    summary: '补充供应计划团队关键骨干，偏重预测协同与多仓补货经验。',
    jdHtml: `
      <h3>岗位重点</h3>
      <p>负责多仓补货策略、Forecast 协同、跨部门产销节奏控制，并推进异常库存治理。</p>
      <p><strong>核心要求：</strong>有供应链计划、库存周转优化或 S&OP 实战经历，逻辑清晰，数据敏感度高。</p>
    `,
  },
  {
    id: 'pos-3',
    title: '海外投放经理',
    department: '销售与计划',
    headcount: 1,
    priority: 'high',
    owner: '陈妍',
    status: 'open',
    city: '杭州',
    channelMix: ['领英', '猎头'],
    salaryRange: '30k-45k',
    summary: '面向美国事业部增长团队，重点引入具备站外投放与归因分析能力的人选。',
    jdHtml: `
      <h3>岗位重点</h3>
      <p>负责 Meta、Google 等海外渠道投放策略，推动素材测试与归因复盘，支撑高增长市场拓展。</p>
      <p><strong>核心要求：</strong>熟悉海外广告平台、ROI 分析和数据看板搭建，有跨境消费品经验优先。</p>
    `,
  },
  {
    id: 'pos-4',
    title: 'HRBP',
    department: '人力资源',
    headcount: 1,
    priority: 'low',
    owner: '周雪',
    status: 'open',
    city: '武汉',
    channelMix: ['内推', 'BOSS直聘'],
    salaryRange: '16k-22k',
    summary: '支持事业部组织发展与关键人才运营，偏重业务协同与人才盘点经验。',
    jdHtml: `
      <h3>岗位重点</h3>
      <p>负责业务组织诊断、人才盘点、试用期跟进及关键岗位梯队建设，协同业务负责人落地团队规划。</p>
      <p><strong>核心要求：</strong>擅长业务沟通和人才项目落地，有电商或互联网业务支持背景优先。</p>
    `,
  },
];

export const recruitmentCandidates = [
  {
    id: 'cand-1001',
    name: '周岚',
    department: '人力资源',
    positionId: 'pos-1',
    positionTitle: '跨境平台招商经理',
    stage: 'shortlist',
    source: '内推',
    owner: '周雪',
    city: '深圳',
    phone: '13800138021',
    email: 'zhoulan@example.com',
    experience: '7 年招聘经验 / 招聘负责人',
    education: '华东师范大学 / 人力资源管理',
    expectedSalary: '30k',
    matchScore: 92,
    appliedAt: '2026-03-24',
    lastActivity: '今天 10:30',
    interviewAt: '2026-04-02 14:00',
    tags: ['平台招商', '团队搭建', '电商背景'],
    riskLevel: 'low',
    summary: '曾负责平台招商与运营团队招聘，offer 接受率稳定在 82% 以上。',
    resumeHtml: `
      <h3>亮点摘要</h3>
      <p>近 3 年服务跨境平台招商团队，累计交付中高级岗位 46 个，熟悉业务画像与面试校准流程。</p>
      <p><strong>补充判断：</strong>对跨境平台招商组织形态理解较深，适合作为本轮重点推进对象。</p>
    `,
    notesHtml: `
      <h3>沟通纪要</h3>
      <p>候选人对业务增长路径理解较完整，能从招聘运营视角给出 pipeline 建议。</p>
      <p><strong>待确认：</strong>到岗时间预计 3 周，需进一步确认当前年终奖发放节点。</p>
    `,
    timeline: [
      { label: '简历入库', date: '2026-03-24 09:10', detail: '内推渠道入库，匹配高优先级岗位。 ', done: true },
      { label: '初筛完成', date: '2026-03-25 16:40', detail: 'HR 初筛通过，推荐进入 shortlist。', done: true },
      { label: '业务面试待进行', date: '2026-04-02 14:00', detail: '已与业务负责人锁定面试时段。', done: false },
    ],
  },
  {
    id: 'cand-1002',
    name: '蒋晨',
    department: '销售与计划',
    positionId: 'pos-3',
    positionTitle: '海外投放经理',
    stage: 'interview',
    source: '猎头',
    owner: '陈妍',
    city: '杭州',
    phone: '13800138022',
    email: 'jiangchen@example.com',
    experience: '8 年海外投放 / 增长负责人',
    education: '浙江大学 / 市场营销',
    expectedSalary: '42k',
    matchScore: 88,
    appliedAt: '2026-03-18',
    lastActivity: '昨天 18:20',
    interviewAt: '2026-04-01 15:30',
    tags: ['Meta', 'Google', '归因分析'],
    riskLevel: 'medium',
    summary: '有 DTC 品牌海外投放负责人背景，数据模型和素材迭代体系成熟。',
    resumeHtml: `
      <h3>亮点摘要</h3>
      <p>负责北美市场年投放预算超 5000 万，具备完整获客链路与创意测试经验。</p>
      <p><strong>补充判断：</strong>业务理解强，但薪资预期接近上限，需要预留预算弹性。</p>
    `,
    notesHtml: `
      <h3>沟通纪要</h3>
      <p>候选人对出海品牌增长方法论非常熟悉，面试表现稳定。</p>
      <p><strong>风险提示：</strong>现公司存在留任谈判可能，建议本周内给出明确推进信号。</p>
    `,
    timeline: [
      { label: '简历入库', date: '2026-03-18 11:20', detail: '猎头推荐进入优先通道。', done: true },
      { label: '初筛完成', date: '2026-03-19 10:10', detail: 'HR 初筛通过。', done: true },
      { label: '业务一面', date: '2026-03-28 16:00', detail: '已完成，反馈正向。', done: true },
      { label: '复试安排', date: '2026-04-01 15:30', detail: '与美国事业部负责人复试。', done: false },
    ],
  },
  {
    id: 'cand-1003',
    name: '李沐',
    department: '供应链计划',
    positionId: 'pos-2',
    positionTitle: '高级供应链计划专员',
    stage: 'screening',
    source: '智联招聘',
    owner: '林凡',
    city: '上海',
    phone: '13800138023',
    email: 'limu@example.com',
    experience: '5 年供应链计划 / S&OP',
    education: '同济大学 / 物流管理',
    expectedSalary: '22k',
    matchScore: 81,
    appliedAt: '2026-03-29',
    lastActivity: '今天 09:45',
    interviewAt: '',
    tags: ['S&OP', '补货协同', '库存分析'],
    riskLevel: 'low',
    summary: '计划链路经验扎实，适合进一步评估跨团队协同和抗压能力。',
    resumeHtml: `
      <h3>亮点摘要</h3>
      <p>曾参与双 11 大促供应计划和预测协同，负责 2000+ SKU 的补货滚动模型。</p>
      <p><strong>补充判断：</strong>专业能力较稳，但业务视野还需要面试确认。</p>
    `,
    notesHtml: `
      <h3>沟通纪要</h3>
      <p>候选人沟通顺畅，能清楚描述库存周转优化项目。</p>
      <p><strong>待确认：</strong>当前离职动机为寻求更大业务复杂度，需确认是否接受快节奏环境。</p>
    `,
    timeline: [
      { label: '简历入库', date: '2026-03-29 13:50', detail: '智联招聘主动投递。', done: true },
      { label: '待完成电话初筛', date: '2026-03-31 16:30', detail: 'HR 已发送沟通邀请。', done: false },
    ],
  },
  {
    id: 'cand-1004',
    name: '唐悦',
    department: '人力资源',
    positionId: 'pos-4',
    positionTitle: 'HRBP',
    stage: 'offer',
    source: 'BOSS直聘',
    owner: '周雪',
    city: '武汉',
    phone: '13800138024',
    email: 'tangyue@example.com',
    experience: '6 年 HRBP / 组织发展',
    education: '武汉大学 / 心理学',
    expectedSalary: '20k',
    matchScore: 90,
    appliedAt: '2026-03-16',
    lastActivity: '今天 14:15',
    interviewAt: '2026-03-27 14:00',
    tags: ['组织发展', '人才盘点', '业务协同'],
    riskLevel: 'low',
    summary: '业务沟通成熟，组织诊断案例完整，已进入薪酬审批阶段。',
    resumeHtml: `
      <h3>亮点摘要</h3>
      <p>服务过电商与零售业务单元，擅长人才盘点、试用期管理和业务团队协同。</p>
      <p><strong>补充判断：</strong>文化匹配度高，建议保持本周内完成 offer 审批。</p>
    `,
    notesHtml: `
      <h3>沟通纪要</h3>
      <p>候选人对团队角色和业务支持边界理解较清晰，认可当前团队阶段目标。</p>
      <p><strong>下一步：</strong>等待薪酬带宽确认后发送 offer 草案。</p>
    `,
    timeline: [
      { label: '简历入库', date: '2026-03-16 10:30', detail: 'BOSS 渠道投递。', done: true },
      { label: '初筛完成', date: '2026-03-17 15:20', detail: '通过 HR 面。', done: true },
      { label: '业务复试完成', date: '2026-03-27 14:00', detail: '业务方反馈高度匹配。', done: true },
      { label: 'offer 审批中', date: '2026-03-31 11:00', detail: '等待薪资审批通过。', done: false },
    ],
  },
  {
    id: 'cand-1005',
    name: '顾言',
    department: '销售与计划',
    positionId: 'pos-3',
    positionTitle: '海外投放经理',
    stage: 'talent_pool',
    source: '领英',
    owner: '陈妍',
    city: '上海',
    phone: '13800138025',
    email: 'guyan@example.com',
    experience: '10 年品牌营销 / 海外站外增长',
    education: '复旦大学 / 新闻传播',
    expectedSalary: '48k',
    matchScore: 76,
    appliedAt: '2026-03-12',
    lastActivity: '3 天前',
    interviewAt: '',
    tags: ['品牌投放', '内容营销', '管理经验'],
    riskLevel: 'medium',
    summary: '能力较强但偏品牌侧，建议保留为人才库备选。',
    resumeHtml: `
      <h3>亮点摘要</h3>
      <p>品牌营销经验突出，适合营销拓展型岗位，对纯效果广告深度稍弱。</p>
      <p><strong>补充判断：</strong>可作为下一阶段品牌增长方向储备候选人。</p>
    `,
    notesHtml: `
      <h3>沟通纪要</h3>
      <p>候选人对岗位感兴趣，但当前对团队管理幅度和预算体量有更高预期。</p>
      <p><strong>建议：</strong>先入人才库，待岗位模型变化时再次激活。</p>
    `,
    timeline: [
      { label: '简历入库', date: '2026-03-12 08:20', detail: '领英主动搜寻。', done: true },
      { label: '人才库沉淀', date: '2026-03-20 18:00', detail: '定位偏中长期储备。', done: true },
    ],
  },
  {
    id: 'cand-1006',
    name: '程远',
    department: '供应链计划',
    positionId: 'pos-2',
    positionTitle: '高级供应链计划专员',
    stage: 'rejected',
    source: '猎头',
    owner: '林凡',
    city: '苏州',
    phone: '13800138026',
    email: 'chengyuan@example.com',
    experience: '4 年供应计划 / 采购协同',
    education: '南京大学 / 工业工程',
    expectedSalary: '24k',
    matchScore: 68,
    appliedAt: '2026-03-10',
    lastActivity: '5 天前',
    interviewAt: '2026-03-22 11:00',
    tags: ['采购协同', '库存分析'],
    riskLevel: 'high',
    summary: '专业背景相关，但跨部门推动能力和案例深度不足。',
    resumeHtml: `
      <h3>亮点摘要</h3>
      <p>有基础供应计划经验，能覆盖日常补货与采购沟通，但复杂项目经历较少。</p>
      <p><strong>补充判断：</strong>与当前岗位要求存在差距，已结束流程。</p>
    `,
    notesHtml: `
      <h3>沟通纪要</h3>
      <p>面试中对补货策略和库存异常处理案例回答较弱。</p>
      <p><strong>结果：</strong>已礼貌结束流程并保留后续基础岗位机会。</p>
    `,
    timeline: [
      { label: '简历入库', date: '2026-03-10 10:00', detail: '猎头推荐。', done: true },
      { label: '面试完成', date: '2026-03-22 11:00', detail: '业务反馈不匹配。', done: true },
      { label: '流程结束', date: '2026-03-26 17:30', detail: '已发送感谢信。', done: true },
    ],
  },
  {
    id: 'cand-1007',
    name: '许初',
    department: '人力资源',
    positionId: 'pos-1',
    positionTitle: '跨境平台招商经理',
    stage: 'screening',
    source: 'BOSS直聘',
    owner: '周雪',
    city: '广州',
    phone: '13800138027',
    email: 'xuchu@example.com',
    experience: '5 年招聘 / 猎头顾问',
    education: '中山大学 / 工商管理',
    expectedSalary: '27k',
    matchScore: 79,
    appliedAt: '2026-03-30',
    lastActivity: '今天 11:50',
    interviewAt: '',
    tags: ['猎头背景', '中高级岗位', '业务招聘'],
    riskLevel: 'medium',
    summary: '有中高级岗位交付经验，需确认跨境业务语境适配度。',
    resumeHtml: `
      <h3>亮点摘要</h3>
      <p>长期服务消费品与互联网客户，岗位交付速度较快，适合继续电话深聊。</p>
      <p><strong>补充判断：</strong>业务画像理解能力待确认。</p>
    `,
    notesHtml: `
      <h3>沟通纪要</h3>
      <p>候选人表达清晰，换工作核心诉求为靠近业务决策。</p>
      <p><strong>待确认：</strong>是否接受深圳办公和阶段性出差安排。</p>
    `,
    timeline: [
      { label: '简历入库', date: '2026-03-30 17:10', detail: 'BOSS 直聘主动投递。', done: true },
      { label: '待电话初筛', date: '2026-04-01 10:00', detail: '已加入今日待办。', done: false },
    ],
  },
];

export const recruitmentStageOptions = [
  { value: '', label: '全部阶段' },
  { value: 'screening', label: '初筛中' },
  { value: 'shortlist', label: '待业务面' },
  { value: 'interview', label: '面试中' },
  { value: 'offer', label: 'Offer 中' },
  { value: 'talent_pool', label: '人才库' },
  { value: 'rejected', label: '已淘汰' },
];

export const recruitmentSourceOptions = [
  { value: '', label: '全部渠道' },
  { value: '内推', label: '内推' },
  { value: 'BOSS直聘', label: 'BOSS直聘' },
  { value: '智联招聘', label: '智联招聘' },
  { value: '猎头', label: '猎头' },
  { value: '领英', label: '领英' },
];

export const recruitmentStageFlow = ['screening', 'shortlist', 'interview', 'offer'];
