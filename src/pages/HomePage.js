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

// --------------- Mock 公告数据 ---------------
const announcements = [
    { id: 1, title: '关于2024年度预算调整的通知', type: 'urgent', date: '2024-03-20', author: '财务部', department: '财务部' },
    { id: 2, title: '新供应商准入流程上线说明', type: 'normal', date: '2024-03-18', author: '采购部', department: '采购部' },
    { id: 3, title: 'Q1季度经营分析报告发布', type: 'normal', date: '2024-03-15', author: '经管部', department: '经管部' },
    { id: 4, title: '系统升级维护通知（3月25日）', type: 'warning', date: '2024-03-12', author: 'IT部', department: 'IT部' },
    { id: 5, title: '关于启用新的费用报销标准的通知', type: 'normal', date: '2024-03-10', author: '财务部', department: '财务部' },
    { id: 6, title: '2024年供应商绩效评估启动', type: 'normal', date: '2024-03-08', author: '采购部', department: '采购部' },
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
    { id: 1, title: '深圳鑫源电子Q2绩效评估待审核', type: 'approval', from: '采购部 张三', time: '2小时前' },
    { id: 2, title: '2024年度预算版本V3待确认', type: 'approval', from: '财务部 李四', time: '5小时前' },
    { id: 3, title: '新员工入职权限申请', type: 'todo', from: 'HR 王五', time: '1天前' },
    { id: 4, title: '物流商合同到期提醒', type: 'todo', from: '系统', time: '2天前' },
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
                        <Button variant="ghost" size="sm" fullWidth className="mt-4">
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
