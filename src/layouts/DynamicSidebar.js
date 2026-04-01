// src/layouts/DynamicSidebar.js
// 动态左侧导航 - 根据当前模块显示不同导航
import React from 'react';
import { ChevronLeft, Package, TrendingUp, ShoppingCart, Truck, DollarSign, TestTube, Users, Settings, Briefcase, BarChart3, FolderKanban, CalendarDays } from 'lucide-react';
import cn from '../utils/cn';

// --------------- 导航配置 ---------------
export const navConfig = {
    // 首页导航 - 一级入口
    home: {
        title: '工作台',
        items: [
            { id: 'product', name: '产品中心', icon: Package, path: '/product/overview' },
            { id: 'sales', name: '销售与计划', icon: TrendingUp, path: '/sales/us/overview' },
            { id: 'procurement', name: '供应链采购', icon: ShoppingCart, path: '/procurement/overview' },
            { id: 'supply-chain', name: '供应链计划', icon: CalendarDays, path: '/supply-chain/overview' },
            { id: 'logistics', name: '物流与报关', icon: Truck, path: '/logistics/overview' },
            { id: 'finance', name: '财务中心', icon: DollarSign, path: '/finance/overview' },
            { id: 'quality', name: '质量管理', icon: TestTube, path: '/quality/overview' },
            { id: 'project', name: '项目管理', icon: FolderKanban, path: '/project/overview' },
            { id: 'business-analysis', name: '经营分析', icon: BarChart3, path: '/business-analysis/overview' },
            { id: 'organization', name: '组织权限', icon: Users, path: '/organization/overview' },
            { id: 'hr', name: '人力资源', icon: Briefcase, path: '/hr/overview' },
            { id: 'settings', name: '系统设置', icon: Settings, path: '/settings', badge: 'IT专用' },
        ]
    },
    
    // 产品中心子导航
    product: {
        title: '产品中心',
        parent: '/home',
        items: [
            { name: '产品概览', path: '/product/overview' },
            { name: '产品主数据', path: '/product/master' },
            { name: 'BOM管理', path: '/product/bom' },
            { name: '虚拟组合', path: '/product/virtual-combo' },
            { name: '品牌管理', path: '/product/brand' },
            { name: '产品结构', path: '/product/structure' },
            { name: '类目模板', path: '/product/template' },
            { name: '产品标签', path: '/product/tag' },
            { name: '编码规则', path: '/product/coding-rule' },
            { name: '属性管理', path: '/product/attribute' },
        ]
    },
    
    // 美国事业部子导航
    'sales-us': {
        title: '美国事业部',
        parent: '/home',
        items: [
            { name: '事业部概览', path: '/sales/us/overview' },
            { name: '销售主数据', path: '/sales/us/product' },
            { name: '销售目标', path: '/sales/us/target' },
            { name: '销量预测', path: '/sales/us/forecast' },
            { name: '数据聚合', path: '/sales/us/data-aggregation' },
            { name: '滞销分析', path: '/sales/us/slow-moving' },
            { name: '计划看板', path: '/sales/us/plan-dashboard' },
        ]
    },
    
    // 美国事业部私域管理 - 独立模块
    'us-private-domain': {
        title: '美国事业部私域管理',
        parent: '/home',
        items: [
            { name: '概览', path: '/us-private-domain' },
            { name: '客户管理', path: '/us-private-domain/customers' },
            { name: '营销工具', path: '/us-private-domain/marketing' },
            { name: '社群运营', path: '/us-private-domain/community' },
            { name: '数据分析', path: '/us-private-domain/analysis' },
            { name: '目标管理', path: '/us-private-domain/targets' },
        ]
    },
    
    // 中国事业部子导航
    'sales-cn': {
        title: '中国事业部',
        parent: '/home',
        items: [
            { name: '事业部概览', path: '/sales/cn/overview' },
            { name: '销售主数据', path: '/sales/cn/maindata' },
            { name: '销售目标', path: '/sales/cn/target' },
            { name: '销量预测', path: '/sales/cn/forecast' },
        ]
    },
    
    // 东南亚事业部子导航
    'sales-sea': {
        title: '东南亚事业部',
        parent: '/home',
        items: [
            { name: '事业部概览', path: '/sales/sea/overview' },
            { name: '销售主数据', path: '/sales/sea/maindata' },
            { name: '销售目标', path: '/sales/sea/target' },
            { name: '销量预测', path: '/sales/sea/forecast' },
        ]
    },
    
    // 欧洲事业部子导航
    'sales-eu': {
        title: '欧洲事业部',
        parent: '/home',
        items: [
            { name: '事业部概览', path: '/sales/eu/overview' },
            { name: '销售主数据', path: '/sales/eu/maindata' },
            { name: '销售目标', path: '/sales/eu/target' },
            { name: '销量预测', path: '/sales/eu/forecast' },
        ]
    },
    
    // 经营分析子导航
    'business-analysis': {
        title: '经营分析',
        parent: '/home',
        items: [
            { name: '经营概览', path: '/business-analysis/overview' },
            { name: '经营指标', path: '/business-analysis/metrics' },
            { name: '数据分析', path: '/business-analysis/data' },
            { name: '决策支持', path: '/business-analysis/decision' },
        ]
    },
    
    // 人力资源子导航
    'hr': {
        title: '人力资源',
        parent: '/home',
        items: [
            { name: '人力概览', path: '/hr/overview' },
            { name: '组织架构管理', path: '/hr/organization' },
            { name: '企业人才库', path: '/hr/employees' },
            { name: '在职员工列表', path: '/hr/active-employees' },
            { name: '离职员工列表', path: '/hr/former-employees' },
            { name: '招聘管理', path: '/hr/recruitment' },
            { name: '绩效管理', path: '/hr/performance' },
            { name: '薪酬管理', path: '/hr/salary' },
        ]
    },
    
    // 项目管理子导航
    'project': {
        title: '项目管理',
        parent: '/home',
        items: [
            { name: '项目概览', path: '/project/overview' },
            { name: '新品开发项目', path: '/project/new-product' },
            { name: '项目看板', path: '/project/kanban' },
            { name: '任务管理', path: '/project/tasks' },
        ]
    },
    
    // 供应链采购子导航
    procurement: {
        title: '供应链采购',
        parent: '/home',
        items: [
            { name: '采购概览', path: '/procurement/overview' },
            { name: '供应商管理', path: '/procurement/supplier' },
            { name: 'SKU迭代', path: '/procurement/sku-iteration' },
            { name: '采购计划', path: '/procurement/plan-tracking' },
        ]
    },
    
    // 供应链计划子导航
    'supply-chain-plan': {
        title: '供应链计划',
        parent: '/home',
        items: [
            { name: '计划概览', path: '/supply-chain/overview' },
            { name: 'Forecast Tracking', path: '/supply-chain/forecast-tracking' },
            { name: '供应计划管理', path: '/supply-chain/supply-plan' },
        ]
    },
    
    // 物流与报关子导航
    logistics: {
        title: '物流与报关',
        parent: '/home',
        items: [
            { name: '物流概览', path: '/logistics/overview' },
            { name: '物流商档案', path: '/logistics/vendors' },
            { name: '物流商渠道', path: '/logistics/channels' },
            { name: '仓库地址', path: '/logistics/addresses' },
            { name: 'HSCode', path: '/logistics/hs-codes' },
            { name: '申报资料', path: '/logistics/declarations' },
            { name: '物流类型规则', path: '/logistics/rules/routing' },
            { name: '集货规则', path: '/logistics/rules/consolidation' },
            { name: '备货试算', path: '/logistics/trial-calc' },
        ]
    },
    
    // 财务中心子导航
    finance: {
        title: '财务中心',
        parent: '/home',
        items: [
            { name: '财务概览', path: '/finance/overview' },
            { name: '成本中心', path: '/finance/cost-center' },
            { name: '预算版本', path: '/finance/budget-version' },
            { name: '费用类别', path: '/finance/expense-category' },
            { name: '费用事实', path: '/finance/expense-fact' },
            { name: '分摊规则', path: '/finance/allocation-rule' },
            { name: '店铺映射', path: '/finance/mapping' },
            { name: '收入分析', path: '/finance/revenue-analysis' },
            { name: '成本分析', path: '/finance/cost-analysis' },
            { name: '利润分析', path: '/finance/profit-analysis' },
        ]
    },
    
    // 质量管理中心子导航
    quality: {
        title: '质量管理',
        parent: '/home',
        items: [
            { name: '质量概览', path: '/quality/overview' },
            { name: '入库质检', path: '/quality/inbound' },
            { name: '客诉质量', path: '/quality/complaint' },
        ]
    },
    
    // 组织权限子导航
    organization: {
        title: '组织权限',
        parent: '/home',
        items: [
            { name: '组织概览', path: '/organization/overview' },
            { name: '组织架构', path: '/organization/structure' },
            { name: '用户管理', path: '/organization/users' },
            { name: '角色权限', path: '/organization/roles' },
        ]
    },
    
    // 系统设置子导航
    settings: {
        title: '系统设置',
        parent: '/home',
        badge: 'IT专用',
        items: [
            { name: '基础配置', path: '/settings/basic' },
            { name: '数据字典', path: '/settings/dict' },
            { name: '枚举与规则', path: '/settings/enum' },
            { name: '接口同步', path: '/settings/sync' },
            { name: '参数设置', path: '/settings/params' },
            { name: '定时任务', path: '/settings/scheduler' },
            { name: '系统日志', path: '/settings/log' },
        ]
    }
};

// --------------- 判断当前模块 ---------------
const getCurrentModule = (path) => {
    if (path === '/home' || path === '/') return 'home';
    if (path.startsWith('/product')) return 'product';
    if (path.startsWith('/sales/us')) return 'sales-us';
    if (path.startsWith('/us-private-domain')) return 'us-private-domain';
    if (path.startsWith('/sales/cn')) return 'sales-cn';
    if (path.startsWith('/sales/sea')) return 'sales-sea';
    if (path.startsWith('/sales/eu')) return 'sales-eu';
    if (path.startsWith('/procurement')) return 'procurement';
    if (path.startsWith('/supply-chain')) return 'supply-chain-plan';
    if (path.startsWith('/logistics')) return 'logistics';
    if (path.startsWith('/finance')) return 'finance';
    if (path.startsWith('/quality')) return 'quality';
    if (path.startsWith('/project')) return 'project';
    if (path.startsWith('/business-analysis')) return 'business-analysis';
    if (path.startsWith('/organization')) return 'organization';
    if (path.startsWith('/hr')) return 'hr';
    if (path.startsWith('/settings')) return 'settings';
    return 'home';
};

// --------------- 主组件 ---------------
export default function DynamicSidebar({ currentPath, onNavigate }) {
    const currentModule = getCurrentModule(currentPath);
    const config = navConfig[currentModule];
    
    // 首页不显示左侧导航
    if (currentModule === 'home') {
        return null;
    }
    
    const handleNavClick = (path, name) => {
        if (onNavigate) {
            onNavigate(path, name);
        }
    };
    
    return (
        <aside className="flex h-full w-64 flex-col border-r border-border bg-surface">
            {/* Logo区 */}
            <div className="flex h-16 items-center border-b border-border px-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">E</span>
                    </div>
                    <div>
                        <h1 className="text-sm font-bold text-text">EPoseidon2.0</h1>
                        <p className="text-[10px] text-text-subtle">企业自研管理系统</p>
                    </div>
                </div>
            </div>
            
            {/* 导航内容 */}
            <div className="flex-1 overflow-y-auto py-4">
                {/* 返回按钮 */}
                <div className="px-4 mb-4">
                    <button
                        onClick={() => handleNavClick(config.parent || '/home', '工作台')}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-text-muted transition-colors hover:bg-surface-subtle"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        <span>返回工作台</span>
                    </button>
                </div>
                
                {/* 导航标题 */}
                <div className="px-4 mb-3">
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-text-subtle">
                            {config.title}
                            {config.badge && (
                                <span className="ml-2 px-1.5 py-0.5 bg-orange-100 text-orange-600 rounded text-[10px]">
                                    {config.badge}
                                </span>
                            )}
                        </h2>
                    </div>
                
                {/* 导航项 - 统一使用朴素列表样式 */}
                <nav className="px-2 space-y-1">
                    {config.items.map((item) => {
                        const isActive = currentPath === item.path || currentPath.startsWith(item.path + '/');
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.path || item.id}
                                onClick={() => handleNavClick(item.path, item.name)}
                                className={cn(
                                    "flex w-full items-center rounded-xl px-3 py-2.5 text-sm transition-colors",
                                    isActive
                                        ? "bg-surface-subtle text-text font-medium"
                                        : "text-text-muted hover:bg-surface-subtle"
                                )}
                            >
                                {Icon && (
                                    <Icon className={cn(
                                        "w-4 h-4 mr-3",
                                        isActive ? "text-text" : "text-text-subtle"
                                    )} />
                                )}
                                <span className="flex-1 text-left">{item.name}</span>
                                {item.badge && (
                                    <span className="px-1.5 py-0.5 bg-orange-100 text-orange-600 rounded text-[10px]">
                                        {item.badge}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </nav>
            </div>
            
            {/* 底部用户信息 */}
            <div className="p-4 border-t border-gray-200">
                <div className="text-xs text-gray-500">
                    <p>当前用户: 张三</p>
                    <p>角色: 系统管理员</p>
                </div>
            </div>
        </aside>
    );
}
