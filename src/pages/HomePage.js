// src/pages/HomePage.js
// 首页工作台
import React from 'react';
import {
    Package, Globe, ShoppingCart, Truck, DollarSign, 
    TestTube, Users, Settings, Bell, CheckSquare, ExternalLink,
    BookOpen, Gift, ChevronRight, Megaphone, AlertCircle, FolderKanban,
    BarChart3, Briefcase, ClipboardList
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import cn from '../utils/cn';

// --------------- 一级入口配置 ---------------
const mainEntries = [
    // 按指定顺序排列
    { id: 'business-analysis', name: '经营管理分析', routeName: '经营概览', icon: BarChart3, desc: '经营指标 · 数据分析 · 决策支持', color: 'bg-blue-700', lightColor: 'bg-blue-100', path: '/business-analysis/overview' },
    { id: 'sales-us-eu', name: '欧美事业部', routeName: '事业部概览', icon: Globe, desc: '美国 · 欧洲销售运营', color: 'bg-rose-500', lightColor: 'bg-rose-50', path: '/sales/us/overview' },
    { id: 'sales-cn-sea', name: '亚太事业部', routeName: '事业部概览', icon: Globe, desc: '中国 · 东南亚销售运营', color: 'bg-violet-500', lightColor: 'bg-violet-50', path: '/sales/cn/overview' },
    { id: 'product', name: '产品中心', routeName: '产品概览', icon: Package, desc: 'SKU管理 · BOM · 品牌', color: 'bg-sky-500', lightColor: 'bg-sky-50', path: '/product/overview' },
    { id: 'project', name: '项目管理', routeName: '项目概览', icon: FolderKanban, desc: '立项 · 执行 · 交付', color: 'bg-amber-700', lightColor: 'bg-amber-100', path: '/project/overview' },
    { id: 'us-private-domain', name: 'KK-US私域管理', routeName: '概览', icon: Globe, desc: '私域客户 · 运营分析', color: 'bg-rose-600', lightColor: 'bg-rose-100', path: '/us-private-domain' },
    { id: 'supply-chain', name: '供应链计划', routeName: '计划概览', icon: ClipboardList, desc: '需求计划 · 补货计划 · 库存策略', color: 'bg-teal-500', lightColor: 'bg-teal-50', path: '/supply-chain/overview' },
    { id: 'procurement', name: '供应链采购', routeName: '采购概览', icon: ShoppingCart, desc: '供应商 · 采购计划', color: 'bg-amber-500', lightColor: 'bg-amber-50', path: '/procurement/overview' },
    { id: 'logistics', name: '供应链物流', routeName: '物流概览', icon: Truck, desc: '物流商 · 渠道 · 报关', color: 'bg-purple-500', lightColor: 'bg-purple-50', path: '/logistics/overview' },
    { id: 'quality', name: '供应链质量', routeName: '质量概览', icon: TestTube, desc: '质检 · 客诉 · 改善', color: 'bg-cyan-500', lightColor: 'bg-cyan-50', path: '/quality/overview' },
    { id: 'finance', name: '财务中心', routeName: '财务概览', icon: DollarSign, desc: '成本中心 · 预算 · 分析', color: 'bg-emerald-500', lightColor: 'bg-emerald-50', path: '/finance/overview' },
    { id: 'hr', name: '人力资源', routeName: '人力概览', icon: Briefcase, desc: '招聘 · 绩效 · 薪酬管理', color: 'bg-pink-500', lightColor: 'bg-pink-50', path: '/hr/overview' },
    { id: 'organization', name: '权限设置', routeName: '组织概览', icon: Users, desc: '用户 · 角色 · 部门', color: 'bg-indigo-500', lightColor: 'bg-indigo-50', path: '/organization/overview' },
    { id: 'settings', name: '系统设置', routeName: '系统设置', icon: Settings, desc: 'IT专用 · 系统配置', color: 'bg-gray-500', lightColor: 'bg-gray-100', path: '/settings' },
];

// --------------- Mock 公告数据（与公告列表页一致）---------------
const announcements = [
    {
        id: 1,
        title: '关于2024年度预算调整的通知',
        type: 'urgent',
        date: '2024-03-20',
        author: '财务部',
        department: '财务部',
        content: `
            <h3>一、调整背景</h3>
            <p>根据公司2024年第一季度经营情况分析，为适应市场变化，优化资源配置，经管理层研究决定，对2024年度预算进行部分调整。</p>
            
            <h3>二、调整内容</h3>
            <p>1. 营销费用预算增加15%，主要用于Q2季度品牌推广活动；</p>
            <p>2. 研发费用预算增加10%，加大新产品研发投入；</p>
            <p>3. 行政费用预算压缩8%，提倡节约办公；</p>
            <p>4. 各部门请于3月25日前提交调整后的预算方案。</p>
            
            <h3>三、执行要求</h3>
            <p>各部门要高度重视预算调整工作，严格按照公司预算管理制度执行，确保预算调整科学合理、操作规范有序。</p>
            
            <p>特此通知。</p>
        `,
        coverImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=400&fit=crop',
        attachments: [
            { name: '2024年度预算调整方案.pdf', size: '2.3 MB' },
            { name: '预算调整申请表.docx', size: '156 KB' }
        ],
        views: 328,
        readCount: 245,
        isRead: false
    },
    {
        id: 2,
        title: '新供应商准入流程上线说明',
        type: 'normal',
        date: '2024-03-18',
        author: '采购部',
        department: '采购部',
        content: `
            <h3>一、上线背景</h3>
            <p>为进一步规范供应商管理，提升采购效率，公司自研的供应商准入流程已于今日正式上线运行。</p>
            
            <h3>二、新流程亮点</h3>
            <p>1. <strong>在线申请</strong>：供应商可通过系统提交准入申请，无需线下提交纸质材料；</p>
            <p>2. <strong>智能审核</strong>：系统自动校验资质文件，减少人工审核工作量；</p>
            <p>3. <strong>进度透明</strong>：申请方可实时查看审核进度，及时补充材料；</p>
            <p>4. <strong>数据沉淀</strong>：所有供应商信息自动归档，便于后续管理分析。</p>
            
            <h3>三、操作指南</h3>
            <p>详细的操作说明请参考附件《供应商准入系统操作手册》。</p>
            
            <h3>四、培训安排</h3>
            <p>本周五下午14:00将进行系统操作培训，请各相关部门派人参训。</p>
        `,
        coverImage: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=400&fit=crop',
        attachments: [
            { name: '供应商准入系统操作手册.pdf', size: '5.8 MB' }
        ],
        views: 256,
        readCount: 198,
        isRead: true
    },
    {
        id: 3,
        title: 'Q1季度经营分析报告发布',
        type: 'normal',
        date: '2024-03-15',
        author: '经管部',
        department: '经管部',
        content: `
            <h3>一、总体经营情况</h3>
            <p>2024年第一季度，公司整体经营稳中向好，主要指标完成情况如下：</p>
            <p>• 营业收入：完成年度目标的28.5%，同比增长15.2%</p>
            <p>• 净利润：完成年度目标的31.0%，同比增长22.8%</p>
            <p>• 回款率：95.3%，较去年同期提升3.2个百分点</p>
            
            <h3>二、各事业部业绩</h3>
            <p>美国事业部：超额完成季度目标，销售额同比增长18%；</p>
            <p>中国事业部：达成率98%，新品上市表现亮眼；</p>
            <p>东南亚事业部：快速增长期，销售额同比增长35%。</p>
            
            <h3>三、下季度重点工作</h3>
            <p>1. 继续深化海外市场拓展；</p>
            <p>2. 推进供应链数字化转型；</p>
            <p>3. 加强成本管控，提升盈利能力。</p>
        `,
        coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
        attachments: [
            { name: 'Q1经营分析报告.pdf', size: '8.2 MB' },
            { name: '事业部业绩明细.xlsx', size: '1.5 MB' }
        ],
        views: 412,
        readCount: 380,
        isRead: false
    },
    {
        id: 4,
        title: '系统升级维护通知（3月25日）',
        type: 'warning',
        date: '2024-03-12',
        author: 'IT部',
        department: 'IT部',
        content: `
            <h3>一、维护时间</h3>
            <p>2024年3月25日（周一）凌晨 00:00 - 06:00</p>
            
            <h3>二、维护内容</h3>
            <p>1. 服务器安全补丁更新；</p>
            <p>2. 数据库性能优化；</p>
            <p>3. 系统功能模块升级；</p>
            <p>4. 数据备份与清理。</p>
            
            <h3>三、影响范围</h3>
            <p>维护期间，以下系统将暂停服务：</p>
            <p>• EPoseidon 2.0 主系统</p>
            <p>• 供应商门户</p>
            <p>• 数据报表平台</p>
            
            <h3>四、注意事项</h3>
            <p>1. 请提前做好数据保存工作；</p>
            <p>2. 维护期间请勿进行重要操作；</p>
            <p>3. 如有紧急情况，请联系IT值班人员。</p>
        `,
        coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop',
        attachments: [],
        views: 567,
        readCount: 523,
        isRead: true
    },
    {
        id: 5,
        title: '关于启用新的费用报销标准的通知',
        type: 'normal',
        date: '2024-03-10',
        author: '财务部',
        department: '财务部',
        content: `
            <h3>一、调整说明</h3>
            <p>为进一步规范公司费用管理，结合市场行情及公司实际情况，经研究决定，自2024年4月1日起启用新的费用报销标准。</p>
            
            <h3>二、主要调整内容</h3>
            <p><strong>差旅费：</strong></p>
            <p>• 一线城市住宿标准：由500元/晚调整至550元/晚</p>
            <p>• 二线城市住宿标准：由350元/晚调整至400元/晚</p>
            <p>• 飞机票：经济舱标准不变，增加高铁一等座报销选项</p>
            
            <p><strong>餐费补贴：</strong></p>
            <p>• 一线城市：由150元/天调整至180元/天</p>
            <p>• 其他城市：由120元/天调整至150元/天</p>
            
            <h3>三、执行时间</h3>
            <p>2024年4月1日起执行，4月1日前发生的费用按原标准执行。</p>
        `,
        coverImage: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&h=400&fit=crop',
        attachments: [
            { name: '2024费用报销标准.pdf', size: '1.2 MB' }
        ],
        views: 298,
        readCount: 267,
        isRead: false
    },
    {
        id: 6,
        title: '2024年供应商绩效评估启动',
        type: 'normal',
        date: '2024-03-08',
        author: '采购部',
        department: '采购部',
        content: `
            <h3>一、评估目的</h3>
            <p>客观评价供应商合作表现，优化供应商结构，建立长期稳定的战略合作关系。</p>
            
            <h3>二、评估范围</h3>
            <p>2023年1月1日至2023年12月31日期间有业务往来的所有合作供应商。</p>
            
            <h3>三、评估维度</h3>
            <p>1. <strong>质量表现</strong>（30%）：产品合格率、退货率、质量事故</p>
            <p>2. <strong>交付表现</strong>（25%）：准时交付率、交付柔性</p>
            <p>3. <strong>成本竞争力</strong>（20%）：价格水平、降价配合度</p>
            <p>4. <strong>服务配合</strong>（15%）：响应速度、问题解决能力</p>
            <p>5. <strong>合规经营</strong>（10%）：资质完备性、合同履约</p>
            
            <h3>四、时间安排</h3>
            <p>• 3月8日-3月22日：数据收集与初评</p>
            <p>• 3月23日-3月31日：部门复评</p>
            <p>• 4月1日-4月10日：结果公示与申诉</p>
            <p>• 4月15日：最终结果发布</p>
        `,
        coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop',
        attachments: [
            { name: '供应商绩效评估表.xlsx', size: '89 KB' },
            { name: '评分细则说明.pdf', size: '456 KB' }
        ],
        views: 189,
        readCount: 156,
        isRead: true
    },
];

// --------------- 外部系统入口 ---------------
const externalSystems = [
    { name: '金蝶', url: '#', color: 'bg-red-500' },
    { name: '领星', url: '#', color: 'bg-brand-600' },
    { name: '速猫', url: '#', color: 'bg-orange-500' },
    { name: '旺店通', url: '#', color: 'bg-green-500' },
    { name: '菜鸟WMS', url: '#', color: 'bg-cyan-500' },
];

// --------------- 员工体验入口 ---------------
const employeeExperiences = [
    { name: '培训系统', icon: BookOpen, desc: '在线学习', color: 'bg-violet-500' },
    { name: '福利平台', icon: Gift, desc: '员工福利', color: 'bg-pink-500' },
];

// --------------- Mock 待办/审批 ---------------
const todos = [
    { id: 1, title: '深圳鑫源电子Q2绩效评估待审核', type: 'approval', from: '采购部 张三', time: '2小时前', path: '/workbench/approvals', routeName: '待办 & 审批' },
    { id: 2, title: '2024年度预算版本V3待确认', type: 'approval', from: '财务部 李四', time: '5小时前', path: '/workbench/approvals', routeName: '待办 & 审批' },
    { id: 3, title: '新员工入职权限申请', type: 'todo', from: 'HR 王五', time: '1天前', path: '/workbench/approvals', routeName: '待办 & 审批' },
    { id: 4, title: '物流商合同到期提醒', type: 'todo', from: '系统', time: '2天前', path: '/workbench/approvals', routeName: '待办 & 审批' },
];

// --------------- 主组件 ---------------
export default function HomePage({ onNavigate, onOpenAnnouncement, onOpenAnnouncementsList }) {
    const handleEntryClick = (entry) => {
        if (onNavigate) {
            onNavigate(entry.path, entry.routeName || entry.name);
        }
    };

    // 处理点击公告卡片 - 打开详情
    const handleAnnouncementClick = (item) => {
        if (onOpenAnnouncement) {
            onOpenAnnouncement(item);
        }
    };

    // 处理点击"查看更多" - 打开公告列表
    const handleViewMoreAnnouncements = () => {
        if (onOpenAnnouncementsList) {
            onOpenAnnouncementsList();
        }
    };

    const handleTodoClick = (item) => {
        if (onNavigate && item?.path) {
            onNavigate(item.path, item.routeName || '待办 & 审批');
        }
    };

    const handleViewAllTodos = () => {
        if (onNavigate) {
            onNavigate('/workbench/approvals', '待办 & 审批');
        }
    };

    return (
        <div className="min-h-full bg-surface-muted p-8">
            <div className="max-w-[1920px] mx-auto">
                {/* 欢迎语 */}
                <div className="mb-8">
                    <h1 className="ui-page-title">欢迎使用 EPoseidon2.0</h1>
                    <p className="mt-1 text-text-muted">企业自研管理系统 · 工作台</p>
                </div>

                {/* 一级入口网格 */}
                <div className="mb-8 grid gap-4 xl:grid-cols-6 2xl:grid-cols-7">
                    {mainEntries.map((entry) => {
                        const Icon = entry.icon;
                        return (
                            <Card 
                                key={entry.id}
                                interactive
                                onClick={() => handleEntryClick(entry)}
                                className="group p-4"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", entry.color)}>
                                        <Icon className="w-5 h-5 text-white" />
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                                </div>
                                <h3 className="mb-0.5 text-base font-bold text-text">{entry.name}</h3>
                                <p className="text-xs text-text-muted">{entry.desc}</p>
                            </Card>
                        );
                    })}
                </div>

                {/* 下方区域：三列布局 */}
                <div className="grid gap-6 xl:grid-cols-3">
                    {/* 左侧：公司公告 */}
                    <Card padding="md">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Megaphone className="w-5 h-5 text-text-subtle" />
                                <h3 className="font-bold text-text">公司公告</h3>
                            </div>
                            <span className="text-xs text-text-subtle">共 {announcements.length} 条</span>
                        </div>
                        <div className="space-y-3">
                            {announcements.map(item => (
                                <div 
                                    key={item.id} 
                                    onClick={() => handleAnnouncementClick(item)}
                                    className="group cursor-pointer rounded-xl bg-surface-subtle p-3 transition-colors hover:bg-slate-100"
                                >
                                    <div className="flex items-start gap-2">
                                        {item.type === 'urgent' && <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />}
                                        <div className="flex-1 min-w-0">
                                            <p className="truncate text-sm font-medium text-text transition-colors group-hover:text-brand-700">
                                                {item.title}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1.5">
                                                <Badge tone={item.type === 'urgent' ? 'danger' : item.type === 'warning' ? 'warning' : 'neutral'}>
                                                    {item.type === 'urgent' ? '紧急' : item.type === 'warning' ? '通知' : '公告'}
                                                </Badge>
                                                <span className="text-xs text-text-subtle">{item.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button variant="ghost" size="sm" onClick={handleViewMoreAnnouncements} fullWidth className="mt-4">
                            查看更多
                        </Button>
                    </Card>

                    {/* 中间：待办事项 & 审批提醒 */}
                    <Card padding="md">
                        <div className="flex items-center gap-2 mb-4">
                            <CheckSquare className="w-5 h-5 text-text-subtle" />
                            <h3 className="font-bold text-text">待办 & 审批</h3>
                            <span className="ml-auto rounded-full bg-danger-100 px-2 py-0.5 text-xs font-medium text-danger-600">
                                {todos.length}
                            </span>
                        </div>
                        <div className="space-y-3">
                            {todos.map(item => (
                                <div 
                                    key={item.id} 
                                    className="flex cursor-pointer items-start gap-3 rounded-xl bg-surface-subtle p-3 transition-colors hover:bg-slate-100"
                                    onClick={() => handleTodoClick(item)}
                                >
                                    <div className={cn(
                                        "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                                        item.type === 'approval' ? 'bg-amber-100' : 'bg-blue-100'
                                    )}>
                                        {item.type === 'approval' ? (
                                            <Bell className="w-4 h-4 text-amber-600" />
                                        ) : (
                                            <CheckSquare className="w-4 h-4 text-blue-600" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="line-clamp-2 text-sm font-medium text-text">{item.title}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-text-muted">{item.from}</span>
                                            <span className="text-xs text-text-subtle">·</span>
                                            <span className="text-xs text-text-subtle">{item.time}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {todos.length === 0 && (
                            <div className="py-8 text-center text-text-subtle">
                                <CheckSquare className="w-12 h-12 mx-auto mb-2 opacity-30" />
                                <p className="text-sm">暂无待办事项</p>
                            </div>
                        )}
                        <Button variant="ghost" size="sm" fullWidth className="mt-4" onClick={handleViewAllTodos}>
                            查看全部
                        </Button>
                    </Card>

                    {/* 右侧：外部系统 & 员工体验 */}
                    <div className="space-y-5">
                        {/* 外部系统 */}
                        <Card padding="md">
                            <div className="flex items-center gap-2 mb-4">
                                <ExternalLink className="w-5 h-5 text-text-subtle" />
                                <h3 className="font-bold text-text">外部系统</h3>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                {externalSystems.map(sys => (
                                    <a
                                        key={sys.name}
                                        href={sys.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex flex-col items-center gap-2 rounded-xl p-3 transition-colors hover:bg-surface-subtle"
                                    >
                                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold", sys.color)}>
                                            {sys.name.slice(0, 2)}
                                        </div>
                                        <span className="text-xs text-text-muted group-hover:text-text">{sys.name}</span>
                                    </a>
                                ))}
                            </div>
                        </Card>

                        {/* 员工体验 */}
                        <Card padding="md">
                            <div className="flex items-center gap-2 mb-4">
                                <Gift className="w-5 h-5 text-text-subtle" />
                                <h3 className="font-bold text-text">员工体验</h3>
                            </div>
                            <div className="space-y-3">
                                {employeeExperiences.map(exp => {
                                    const Icon = exp.icon;
                                    return (
                                        <div 
                                            key={exp.name}
                                            className="group flex cursor-pointer items-center gap-3 rounded-xl bg-surface-subtle p-3 transition-colors hover:bg-slate-100"
                                        >
                                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", exp.color)}>
                                                <Icon className="w-5 h-5 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-text">{exp.name}</p>
                                                <p className="text-xs text-text-muted">{exp.desc}</p>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500" />
                                        </div>
                                    );
                                })}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
