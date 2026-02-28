// src/App.js
import React, {useState, useCallback} from 'react';
import {
    Home,
    BarChart3,
    Package,
    TrendingUp,
    ShoppingCart,
    Truck,
    TestTube,
    DollarSign,
    PieChart,
    Users,
    CheckSquare,
    Settings,
    ChevronDown,
    ChevronRight,
    Menu,
    X
} from 'lucide-react';
import HomePage from './pages/HomePage';
import ProductMasterPage from './pages/ProductMasterPage';
import BOMManagementPage from './pages/BOMManagementPage';
import BrandManagementPage from './pages/BrandManagementPage';
import ProductStructurePage from './pages/ProductStructurePage';
import CategoryTemplatePage from './pages/CategoryTemplatePage';
import StoreDeptMappingPage from './pages/StoreDeptMappingPage';
import CostCenterPage from './pages/CostCenterPage';
import AllocationRulePage from './pages/AllocationRulePage';
import ExpenseApprovalListPageSimple from './pages/ExpenseApprovalListPage.simple';
import ExpenseApprovalDetailPageSimple from './pages/ExpenseApprovalDetailPage.simple';
import ExpenseFactPage from './pages/ExpenseFactPage';
import ExpenseFactDetailPage from './pages/ExpenseFactDetailPage';
import ExpenseCategoryPage from './pages/ExpenseCategoryPage';
import OrganizationManagementPage from './pages/OrganizationManagementPage';
import UserManagementPage from './pages/UserManagementPage';
import RolePermissionPage from './pages/RolePermissionPage';
import PlaceholderPage from './pages/PlaceholderPage';
import SkuDetailPage from './pages/SkuDetailPage.simple';
import SalesTargetPage from './pages/SalesTargetPage';
import ProductTagPage from './pages/ProductTagPage';
import CodingRulePage from './pages/CodingRulePage';
import ProductAttributePage from './pages/ProductAttributePage';
import BudgetVersionPage from './pages/BudgetVersionPage';
import BudgetVersionDetailPage from './pages/BudgetVersionDetailPage';
import SupplierListPage from './pages/SupplierListPage';
import SkuIterationPage from './pages/SkuIterationPage';
import SalesForecastPage from './pages/SalesForecastPage';
import VirtualComboPage from './pages/VirtualComboPage';
import SalesProductPage from './pages/SalesProductPage';
import SettingsParamsPage from './pages/settings/SettingsParamsPage';
import SettingsLogPage from './pages/settings/SettingsLogPage';
import SettingsDictPage from './pages/settings/SettingsDictPage';
import SettingsBasicPage from './pages/settings/SettingsBasicPage';
import SettingsEnumRulePage from './pages/settings/SettingsEnumRulePage';
import SettingsApiSyncPage from './pages/settings/SettingsApiSyncPage';
import SettingsSchedulerPage from './pages/settings/SettingsSchedulerPage';
import LogisticsVendorListPage from './pages/logistics/LogisticsVendorListPage';
import LogisticsVendorDetailPage from './pages/logistics/LogisticsVendorDetailPage';
import LogisticsChannelListPage from './pages/logistics/LogisticsChannelListPage';
import LogisticsChannelDetailPage from './pages/logistics/LogisticsChannelDetailPage';
import LogisticsAddressListPage from './pages/logistics/LogisticsAddressListPage';
import LogisticsAddressDetailPage from './pages/logistics/LogisticsAddressDetailPage';
import LogisticsHsCodeListPage from './pages/logistics/LogisticsHsCodeListPage';
import LogisticsHsCodeDetailPage from './pages/logistics/LogisticsHsCodeDetailPage';
import LogisticsDeclarationListPage from './pages/logistics/LogisticsDeclarationListPage';
import LogisticsDeclarationDetailPage from './pages/logistics/LogisticsDeclarationDetailPage';
import LogisticsRoutingRuleListPage from './pages/logistics/LogisticsRoutingRuleListPage';
import LogisticsRoutingRuleDetailPage from './pages/logistics/LogisticsRoutingRuleDetailPage';
import LogisticsConsolidationRuleListPage from './pages/logistics/LogisticsConsolidationRuleListPage';
import LogisticsConsolidationRuleDetailPage from './pages/logistics/LogisticsConsolidationRuleDetailPage';

// 导航配置
const navigationConfig = [
    {id: 'home', name: '首页', icon: Home, path: '/home'},
    {
        id: 'dashboard',
        name: '经营驾驶舱',
        icon: BarChart3,
        badge: '管理层',
        children: [
            {id: 'dashboard-overview', name: '经营概览', path: '/dashboard/overview'},
            {id: 'dashboard-sales', name: '销售达成分析', path: '/dashboard/sales'},
            {id: 'dashboard-procurement', name: '采购分析', path: '/dashboard/procurement'},
            {id: 'dashboard-logistics', name: '物流分析', path: '/dashboard/logistics'},
            {id: 'dashboard-quality', name: '质量分析', path: '/dashboard/quality'}
        ]
    },
    {
        id: 'product',
        name: '产品中心',
        icon: Package,
        children: [
            {id: 'product-master', name: '产品主数据', path: '/product/master'},
            {id: 'product-bom', name: 'BOM 管理', path: '/product/bom'},
            {id: 'product-virtual-combo', name: '虚拟组合管理', path: '/product/virtual-combo'},
            {id: 'product-brand', name: '品牌管理', path: '/product/brand'},
            {id: 'product-structure', name: '产品结构分类', path: '/product/structure'},
            {id: 'product-template', name: '类目属性模板管理', path: '/product/template'},
            {id: 'product-tag', name: '产品标签', path: '/product/tag'},
            {id: 'product-coding-rule', name: '编码规则', path: '/product/coding-rule'},
            {id: 'product-attribute', name: '属性管理', path: '/product/attribute'}
        ]
    },
    {
        id: 'sales',
        name: '销售与计划',
        icon: TrendingUp,
        children: [
            {id: 'sales-product', name: '销售主数据', path: '/sales/product'},
            {id: 'sales-target', name: '销售目标', path: '/sales/target'},
            {id: 'sales-data-aggregation', name: '数据聚合分析', path: '/sales/data-aggregation'},
            {id: 'sales-slow-moving', name: '滞销分析', path: '/sales/slow-moving'},
            {id: 'sales-forecast', name: '销量预测', path: '/sales/forecast'},
            {id: 'sales-plan-dashboard', name: '计划测算看板', path: '/sales/plan-dashboard'}
        ]
    },
    {
        id: 'procurement',
        name: '供应链采购管理',
        icon: ShoppingCart,
        children: [
            {id: 'supplier', name: '供应商管理', path: '/procurement/supplier'},
            {id: 'sku-iteration', name: 'SKU迭代管理', path: '/procurement/sku-iteration'},
            {id: 'purchase-plan-tracking', name: '采购计划执行跟进', path: '/procurement/plan-tracking'},
            {id: 'supplier-performance', name: '供应商绩效', path: '/procurement/supplier-performance'}
        ]
    },
    {
        id: 'logistics',
        name: '物流与报关',
        icon: Truck,
        children: [
            {id: 'logistics-plan', name: '物流计划执行', path: '/logistics/plan'},
            {id: 'logistics-stock-calc', name: '备货试算', path: '/logistics/stock-calc'},
            {id: 'logistics-cross-border', name: '物流单-跨境', path: '/logistics/cross-border'},
            {id: 'logistics-domestic', name: '物流单-国内', path: '/logistics/domestic'},
            {id: 'logistics-customs-export', name: '报关管理', path: '/logistics/customs-export'},
            {id: 'logistics-customs-import', name: '清关管理', path: '/logistics/customs-import'},
            {id: 'logistics-shelf-claim', name: '上架索赔', path: '/logistics/shelf-claim'},
            {id: 'logistics-reconciliation', name: '物流对账', path: '/logistics/reconciliation'},
            {id: 'logistics-provider-info', name: '物流商基础信息', path: '/logistics/provider-info'},
            // ---------- 物流与报关 > 基础资料（列表 + 详情新 Tab） ----------
            {id: 'logistics-vendors', name: '物流商档案', path: '/logistics/vendors'},
            {id: 'logistics-channels', name: '物流商渠道', path: '/logistics/channels'},
            {id: 'logistics-addresses', name: '仓库地址', path: '/logistics/addresses'},
            {id: 'logistics-hs-codes', name: 'HSCode', path: '/logistics/hs-codes'},
            {id: 'logistics-declarations', name: '申报资料', path: '/logistics/declarations'},
            // ---------- 物流与报关 > 核心功能（规则配置） ----------
            {id: 'logistics-rules-routing', name: '物流类型规则', path: '/logistics/rules/routing'},
            {id: 'logistics-rules-consolidation', name: '集货规则', path: '/logistics/rules/consolidation'}
        ]
    },
    {
        id: 'quality',
        name: '质量管理',
        icon: TestTube,
        children: [
            {id: 'quality-inbound', name: '入库质检', path: '/quality/inbound'},
            {id: 'quality-complaint', name: '客诉质量', path: '/quality/complaint'}
        ]
    },
    {
        id: 'finance-gov',
        name: '财务治理',
        icon: DollarSign,
        children: [
            {id: 'finance-mapping', name: '店铺与部门归属映射', path: '/finance-gov/mapping'},
            {id: 'cost-center', name: '成本中心', path: '/finance-gov/cost-center'},
            {id: 'allocation-rule', name: '分摊规则', path: '/finance-gov/allocation-rule'},
            {id: 'expense-category', name: '费用类别', path: '/finance-gov/expense-category'},
            {id: 'expense-fact', name: '费用事实', path: '/finance-gov/expense-fact'},
            {id: 'budget-version', name: '预算版本管理', path: '/finance-gov/budget-version'}
        ]
    },
    {
        id: 'finance-analysis',
        name: '财务与经营分析',
        icon: PieChart,
        badge: '只读',
        children: [
            {id: 'finance-revenue', name: '收入分析', path: '/finance-analysis/revenue'},
            {id: 'finance-cost', name: '成本分析', path: '/finance-analysis/cost'},
            {id: 'finance-profit', name: '利润分析', path: '/finance-analysis/profit'},
            {id: 'finance-achievement', name: '经营达成情况', path: '/finance-analysis/achievement'}
        ]
    },
    {
        id: 'organization',
        name: '组织与权限',
        icon: Users,
        children: [
            {id: 'org-structure', name: '组织架构管理', path: '/organization/structure'},
            {id: 'org-user', name: '用户管理', path: '/system/users'},
            {id: 'org-role', name: '角色与权限', path: '/system/roles'}
        ]
    },
    {id: 'approval', name: '审批与任务', icon: CheckSquare, path: '/approval'},
    {
        id: 'settings',
        name: '系统设置',
        icon: Settings,
        badge: 'IT专用',
        children: [
            {id: 'settings-basic', name: '基础配置', path: '/settings/basic'},
            {id: 'settings-dict', name: '数据字典', path: '/settings/dict'},
            {id: 'settings-enum', name: '枚举与规则', path: '/settings/enum'},
            {id: 'settings-sync', name: '接口同步', path: '/settings/sync'},
            {id: 'settings-params', name: '参数设置', path: '/settings/params'},
            {id: 'settings-scheduler', name: '定时任务', path: '/settings/scheduler'},
            {id: 'settings-log', name: '系统日志', path: '/settings/log'}
        ]
    }
];

const NavItem = ({item, level = 0, isActive, onNavigate, expandedItems, toggleExpand}) => {
    const Icon = item.icon;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);

    const handleClick = () => {
        if (hasChildren) {
            toggleExpand(item.id);
        } else {
            onNavigate(item.path, item.name);
        }
    };

    return (
        <div>
            <div
                className={`flex items-center justify-between px-4 py-2.5 cursor-pointer transition-colors ${
                    isActive === item.path ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-700 hover:bg-gray-50'
                } ${level > 0 ? 'pl-12' : ''}`}
                onClick={handleClick}
            >
                <div className="flex items-center gap-3 flex-1">
                    {Icon && <Icon className="w-5 h-5" />}
                    <span className="text-sm font-medium">{item.name}</span>
                    {item.badge && (
                        <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-600 rounded">{item.badge}</span>
                    )}
                </div>
                {hasChildren && (isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />)}
            </div>

            {hasChildren && isExpanded && (
                <div className="bg-gray-50">
                    {item.children.map(child => (
                        <div
                            key={child.id}
                            className={`flex items-center px-4 py-2 pl-14 cursor-pointer transition-colors ${
                                isActive === child.path ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-600 hover:bg-gray-100'
                            }`}
                            onClick={() => onNavigate(child.path, child.name)}
                        >
                            <span className="text-sm">{child.name}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// 标签栏最多直接展示的个数，超出部分放入「更多」下拉
const MAX_VISIBLE_TABS = 8;

// --------------- 标签页组件 ---------------
const TabBar = ({ tabs, activeTabId, onTabClick, onTabClose }) => {
    const [moreOpen, setMoreOpen] = useState(false);
    if (tabs.length === 0) return null;

    const showOverflow = tabs.length > MAX_VISIBLE_TABS;
    const visibleTabs = showOverflow ? tabs.slice(0, MAX_VISIBLE_TABS - 1) : tabs;
    const overflowTabs = showOverflow ? tabs.slice(MAX_VISIBLE_TABS - 1) : [];

    return (
        <div className="bg-white border-b border-gray-200 flex items-center min-h-0">
            {/* 仅标签列表横向滚动，「更多」与下拉不参与滚动，避免下拉被裁剪 */}
            <div className="flex-1 min-w-0 overflow-x-auto">
                <div className="flex items-center px-2 py-1 gap-1 min-w-0">
                    {visibleTabs.map(tab => (
                        <div
                            key={tab.id}
                            className={`group flex items-center gap-2 px-3 py-1.5 rounded-t-lg cursor-pointer transition-colors min-w-0 max-w-[200px] flex-shrink-0 ${
                                activeTabId === tab.id
                                    ? 'bg-blue-50 text-blue-600 border border-b-0 border-gray-200'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                            onClick={() => onTabClick(tab.id)}
                        >
                            <span className="text-sm truncate flex-1 min-w-0">{tab.name}</span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onTabClose(tab.id);
                                }}
                                className="p-0.5 rounded hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            {showOverflow && (
                <div className="relative flex-shrink-0 px-2 py-1">
                    <button
                        type="button"
                        onClick={() => setMoreOpen(prev => !prev)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-t-lg text-sm transition-colors ${
                            overflowTabs.some(t => t.id === activeTabId)
                                ? 'bg-blue-50 text-blue-600 border border-b-0 border-gray-200'
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        <span>更多</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
                        <span className="text-xs text-gray-400">({overflowTabs.length})</span>
                    </button>
                    {moreOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-[100]"
                                onClick={() => setMoreOpen(false)}
                                aria-hidden="true"
                            />
                            <div className="absolute right-0 top-full mt-0.5 py-1 bg-white border border-gray-200 rounded-lg shadow-xl z-[101] min-w-[220px] max-h-72 overflow-y-auto">
                                {overflowTabs.map(tab => (
                                    <div
                                        key={tab.id}
                                        role="button"
                                        tabIndex={0}
                                        className={`flex items-center justify-between gap-2 px-3 py-2 cursor-pointer text-sm hover:bg-gray-50 ${
                                            activeTabId === tab.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                                        }`}
                                        onClick={() => {
                                            onTabClick(tab.id);
                                            setMoreOpen(false);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                onTabClick(tab.id);
                                                setMoreOpen(false);
                                            }
                                        }}
                                    >
                                        <span className="truncate flex-1 min-w-0">{tab.name}</span>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onTabClose(tab.id);
                                                setMoreOpen(false);
                                            }}
                                            className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

function App() {
    const [expandedItems, setExpandedItems] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // 标签页状态：开一个就新增一个标签，始终至少保留一个（首页）
    const [tabs, setTabs] = useState([{ id: '/home', name: '首页', path: '/home' }]);
    const [activeTabId, setActiveTabId] = useState('/home');

    // 打开新标签页（内部打开详情等用）
    const openTab = useCallback((tabInfo) => {
        const { id, name, path, data } = tabInfo;
        const existingTab = tabs.find(t => t.id === id);
        if (existingTab) {
            setActiveTabId(id);
            return;
        }
        setTabs(prev => [...prev, { id, name, path, data }]);
        setActiveTabId(id);
    }, [tabs]);

    // 从侧栏导航：有同 path 的标签则激活，否则新增一个标签
    const handleNavigate = (path, name) => {
        const existing = tabs.find(t => t.path === path);
        if (existing) {
            setActiveTabId(existing.id);
            return;
        }
        setTabs(prev => [...prev, { id: path, name, path }]);
        setActiveTabId(path);
    };

    const openSkuDetail = (row) => {
        const id = `product/sku-detail-${row?.id ?? Date.now()}`;
        openTab({ id, name: 'SKU 详情', path: '/product/sku-detail', data: row });
    };

    // 关闭标签页；关到没有则保留首页；激活态由 useEffect 同步
    const closeTab = useCallback((tabId) => {
        setTabs(prev => {
            const newTabs = prev.filter(t => t.id !== tabId);
            return newTabs.length > 0 ? newTabs : [{ id: '/home', name: '首页', path: '/home' }];
        });
    }, []);

    // 关闭标签后若当前激活的 tab 已被移除，则激活最后一个
    React.useEffect(() => {
        if (tabs.length > 0 && !tabs.some(t => t.id === activeTabId)) {
            setActiveTabId(tabs[tabs.length - 1].id);
        }
    }, [tabs, activeTabId]);

    const switchTab = useCallback((tabId) => {
        setActiveTabId(tabId);
    }, []);

    const toggleExpand = (itemId) => {
        setExpandedItems(prev =>
            prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
        );
    };

    // 根据当前激活的标签渲染内容（所有页面统一走标签）
    const renderTabContent = (tab) => {
        if (!tab) return <HomePage />;
        // ---------- 物流基础资料详情 Tab（path 前缀判断，包一层 div 与物流商一致） ----------
        if (tab.path && tab.path.startsWith('/logistics/vendors/')) {
            return (
                <div className="flex-1 min-h-0 overflow-auto">
                    <LogisticsVendorDetailPage tab={tab} />
                </div>
            );
        }
        if (tab.path && tab.path.startsWith('/logistics/channels/')) {
            return (
                <div className="flex-1 min-h-0 overflow-auto">
                    <LogisticsChannelDetailPage tab={tab} />
                </div>
            );
        }
        if (tab.path && tab.path.startsWith('/logistics/addresses/')) {
            return (
                <div className="flex-1 min-h-0 overflow-auto">
                    <LogisticsAddressDetailPage tab={tab} />
                </div>
            );
        }
        if (tab.path && tab.path.startsWith('/logistics/hs-codes/')) {
            return (
                <div className="flex-1 min-h-0 overflow-auto">
                    <LogisticsHsCodeDetailPage tab={tab} />
                </div>
            );
        }
        if (tab.path && tab.path.startsWith('/logistics/declarations/')) {
            return (
                <div className="flex-1 min-h-0 overflow-auto">
                    <LogisticsDeclarationDetailPage tab={tab} />
                </div>
            );
        }
        // ---------- 物流规则详情 Tab（routing / consolidation） ----------
        if (tab.path && tab.path.startsWith('/logistics/rules/routing/')) {
            return (
                <div className="flex-1 min-h-0 overflow-auto">
                    <LogisticsRoutingRuleDetailPage tab={tab} />
                </div>
            );
        }
        if (tab.path && tab.path.startsWith('/logistics/rules/consolidation/')) {
            return (
                <div className="flex-1 min-h-0 overflow-auto">
                    <LogisticsConsolidationRuleDetailPage tab={tab} />
                </div>
            );
        }
        switch (tab.path) {
            case '/home':
                return <HomePage />;
            case '/product/master':
                return <ProductMasterPage onOpenSkuDetail={openSkuDetail} />;
            case '/product/sku-detail':
                return (
                    <div className="flex-1 min-h-0 overflow-auto">
                        <SkuDetailPage record={tab.data} />
                    </div>
                );
            case '/product/bom':
                return <BOMManagementPage />;
            case '/product/virtual-combo':
                return <VirtualComboPage />;
            case '/product/brand':
                return <BrandManagementPage />;
            case '/product/structure':
                return <ProductStructurePage />;
            case '/product/template':
                return <CategoryTemplatePage />;
            case '/product/tag':
                return <ProductTagPage />;
            case '/product/coding-rule':
                return <CodingRulePage />;
            case '/product/attribute':
                return <ProductAttributePage />;
            case '/finance-gov/mapping':
                return <StoreDeptMappingPage />;
            case '/finance-gov/cost-center':
                return <CostCenterPage />;
            case '/finance-gov/allocation-rule':
                return <AllocationRulePage />;
            case '/finance-gov/expense-fact':
                return (
                    <ExpenseFactPage
                        onOpenDetail={(rec) =>
                            openTab({
                                id: `expense-fact-detail-${rec?.id ?? Date.now()}`,
                                name: `费用事实详情: ${rec?.approvalNo ?? '详情'}`,
                                path: '/finance-gov/expense-fact/detail',
                                data: rec,
                            })
                        }
                    />
                );
            case '/finance/approval/list':
                return (
                    <ExpenseApprovalListPageSimple
                        onOpenDetail={(rec) => {
                            openTab({
                                id: `finance/approval/detail-${rec?.id ?? Date.now()}`,
                                name: '审批单详情',
                                path: '/finance/approval/detail',
                                data: rec
                            });
                        }}
                    />
                );
            case '/finance/approval/detail':
                return (
                    <ExpenseApprovalDetailPageSimple
                        record={tab.data}
                        onBack={() => closeTab(tab.id)}
                    />
                );
            case '/finance-gov/expense-category':
                return <ExpenseCategoryPage />;
            case '/finance-gov/budget-version':
                return <BudgetVersionPage onOpenDetail={openTab} />;
            case '/finance-gov/expense-fact/detail':
                return (
                    <ExpenseFactDetailPage
                        record={tab.data}
                        onClose={() => closeTab(tab.id)}
                    />
                );
            case '/finance-gov/budget-version/detail':
                return (
                    <BudgetVersionDetailPage
                        versionId={tab.data?.id}
                        versionData={tab.data}
                        onClose={() => closeTab(tab.id)}
                    />
                );
            case '/organization/structure':
                return <OrganizationManagementPage />;
            case '/sales/product':
                return <SalesProductPage />;
            case '/sales/target':
                return <SalesTargetPage />;
            case '/sales/forecast':
                return <SalesForecastPage />;
            case '/procurement/supplier':
                return <SupplierListPage onOpenDetail={openTab} />;
            case '/logistics/vendors':
                return <LogisticsVendorListPage onOpenDetail={openTab} />;
            case '/logistics/channels':
                return <LogisticsChannelListPage onOpenDetail={openTab} />;
            case '/logistics/addresses':
                return <LogisticsAddressListPage onOpenDetail={openTab} />;
            case '/logistics/hs-codes':
                return <LogisticsHsCodeListPage onOpenDetail={openTab} />;
            case '/logistics/declarations':
                return <LogisticsDeclarationListPage onOpenDetail={openTab} />;
            case '/logistics/rules/routing':
                return <LogisticsRoutingRuleListPage onOpenDetail={openTab} />;
            case '/logistics/rules/consolidation':
                return <LogisticsConsolidationRuleListPage onOpenDetail={openTab} />;
            case '/procurement/sku-iteration':
                return <SkuIterationPage />;
            // ---------- 系统设置（逐步上线：未做的继续走 default 占位） ----------
            case '/settings/params':
                return <SettingsParamsPage />;
            case '/settings/log':
                return <SettingsLogPage />;
            case '/settings/sync':
                return <SettingsApiSyncPage onOpenTab={openTab} />;
            case '/settings/scheduler':
                return <SettingsSchedulerPage onOpenTab={openTab} />;
            case '/settings/dict':
                return <SettingsDictPage />;
            case '/settings/basic':
                return <SettingsBasicPage />;
            case '/settings/enum':
                return <SettingsEnumRulePage />;
            case '/system/users':
                return <UserManagementPage />;
            case '/system/roles':
                return <RolePermissionPage />;
            default:
                return <PlaceholderPage pageName={tab.name} path={tab.path} />;
        }
    };

    const activeTab = tabs.find(t => t.id === activeTabId);

    return (
        <div className="flex h-screen bg-gray-100">
            {/* 左侧导航 */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 overflow-hidden`}>
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">跨</span>
                        </div>
                        <div>
                            <h1 className="text-sm font-bold text-gray-800">跨境电商系统</h1>
                            <p className="text-xs text-gray-500">Enterprise Platform</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto py-4">
                    {navigationConfig.map(item => (
                        <NavItem
                            key={item.id}
                            item={item}
                            isActive={activeTab?.path ?? '/home'}
                            onNavigate={handleNavigate}
                            expandedItems={expandedItems}
                            toggleExpand={toggleExpand}
                        />
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <div className="text-xs text-gray-500">
                        <p>当前用户: 张三</p>
                        <p>角色: 系统管理员</p>
                    </div>
                </div>
            </aside>

            {/* 主内容区 */}
            <div className="flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden">
                {/* 顶部头部 */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg">
                            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">{activeTab?.name ?? '首页'}</h2>
                            <p className="text-xs text-gray-500">{activeTab?.path ?? '/home'}</p>
                        </div>
                    </div>
                    <div className="text-sm text-gray-600">
                        {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </header>

                {/* 标签栏 */}
                <TabBar
                    tabs={tabs}
                    activeTabId={activeTabId}
                    onTabClick={switchTab}
                    onTabClose={closeTab}
                />

                {/* 主内容：始终按当前激活的标签渲染 */}
                <main className="flex-1 min-h-0 overflow-auto p-6">
                    {renderTabContent(activeTab)}
                </main>
            </div>
        </div>
    );
}

export default App;
