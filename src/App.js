// src/App.js
import React, {useState, useCallback, useMemo} from 'react';
import {
    ChevronDown,
    X,
    Search,
    Bell,
    Settings,
    LogOut,
    User
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
import SlowMovingAnalysisPage from './pages/SlowMovingAnalysisPage';
import SkuDetailPage from './pages/SkuDetailPage.simple';
import SalesTargetPage from './pages/SalesTargetPage';
import ProductTagPage from './pages/ProductTagPage';
import CodingRulePage from './pages/CodingRulePage';
import ProductAttributePage from './pages/ProductAttributePage';
import BudgetVersionPage from './pages/BudgetVersionPage';
import BudgetVersionDetailPage from './pages/BudgetVersionDetailPage';
import SupplierListPage from './pages/SupplierListPage';
import SupplierDetailPage from './pages/SupplierDetailPage';
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
import LogisticsTrialCalcPage from './pages/logistics/LogisticsTrialCalcPage';
import ForecastTrackingPage from './pages/supply-chain/ForecastTrackingPage';
import SupplyPlanPage from './pages/supply-chain/SupplyPlanPage';
import QualityInboundPage from './pages/quality/QualityInboundPage';
import QualityComplaintPage from './pages/quality/QualityComplaintPage';
import SalesDataAggregationPage from './pages/sales/SalesDataAggregationPage';
import SalesPlanDashboardPage from './pages/sales/SalesPlanDashboardPage';
import SalesChinaPage from './pages/sales/SalesChinaPage';
import SalesSeaPage from './pages/sales/SalesSeaPage';
import SalesEuropePage from './pages/sales/SalesEuropePage';
import ProcurementPlanTrackingPage from './pages/procurement/ProcurementPlanTrackingPage';
import ProjectManagementPage from './pages/project/ProjectManagementPage';
import PMOverviewPage from './pages/project/ProjectOverviewPage';
import ProjectWorkspacePage from './pages/project/ProjectWorkspacePage';
import ProjectCreatePage from './pages/project/ProjectCreatePage';
import BusinessAnalysisPage from './pages/business/BusinessAnalysisPage';
import HumanResourcesPage from './pages/hr/HumanResourcesPage';
import UsSalesOverviewPage from './pages/overview/UsSalesOverviewPage';
import UsPrivateDomainPage from './pages/sales/UsPrivateDomainPage';
import CnSalesOverviewPage from './pages/overview/CnSalesOverviewPage';
import SeaSalesOverviewPage from './pages/overview/SeaSalesOverviewPage';
import EuSalesOverviewPage from './pages/overview/EuSalesOverviewPage';
import ProductOverviewPage from './pages/overview/ProductOverviewPage';
import ProcurementOverviewPage from './pages/overview/ProcurementOverviewPage';
import SupplyChainOverviewPage from './pages/overview/SupplyChainOverviewPage';
import LogisticsOverviewPage from './pages/overview/LogisticsOverviewPage';
import FinanceOverviewPage from './pages/overview/FinanceOverviewPage';
import QualityOverviewPage from './pages/overview/QualityOverviewPage';
import ProjectOverviewPage from './pages/overview/ProjectOverviewPage';
import HrOverviewPage from './pages/overview/HrOverviewPage';
import CostAnalysisPage from './pages/CostAnalysisPage';
import CostAnalysisDetailPage from './pages/CostAnalysisDetailPage';
import RevenueAnalysisPage from './pages/RevenueAnalysisPage';
import ProfitAnalysisPage from './pages/ProfitAnalysisPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import EmployeeManagementPage from './pages/EmployeeManagementPage';
import ActiveEmployeeListPage from './pages/hr/ActiveEmployeeListPage';
import FormerEmployeeListPage from './pages/hr/FormerEmployeeListPage';
import HrOrganizationPage from './pages/hr/HrOrganizationPage';
import AnnouncementDetailPage from './pages/AnnouncementDetailPage';
import ModuleLayout from './layouts/ModuleLayout';
import DynamicSidebar from './layouts/DynamicSidebar';

// 导航配置已移至 DynamicSidebar.js

// 标签栏最多直接展示的个数，超出部分放入「更多」下拉
const MAX_VISIBLE_TABS = 8;

// --------------- 顶部导航栏（标题 + 标签 + 功能）---------------
const Header = ({ tabs, activeTabId, onTabClick, onTabClose, currentPath, onNavigate }) => {
    const [moreOpen, setMoreOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    // 记录标签访问顺序（最近访问的在前面）
    const [accessOrder, setAccessOrder] = useState([]);
    
    const isHome = currentPath === '/home' || currentPath === '/';
    const currentModule = isHome ? '工作台' : (tabs.find(t => t.id === activeTabId)?.name ?? '首页');
    
    // 当激活标签变化时，更新访问顺序
    React.useEffect(() => {
        if (activeTabId) {
            setAccessOrder(prev => {
                // 移除当前标签（如果存在）
                const filtered = prev.filter(id => id !== activeTabId);
                // 添加到最前面
                return [activeTabId, ...filtered];
            });
        }
    }, [activeTabId]);
    
    // 智能排序：按最近访问顺序排列标签
    const sortedTabs = useMemo(() => {
        if (tabs.length <= MAX_VISIBLE_TABS) return tabs;
        
        // 按访问顺序排序
        const ordered = [...tabs].sort((a, b) => {
            const indexA = accessOrder.indexOf(a.id);
            const indexB = accessOrder.indexOf(b.id);
            // 都没访问过的按原顺序（新标签在后面）
            if (indexA === -1 && indexB === -1) return 0;
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;
            return indexA - indexB;
        });
        
        return ordered;
    }, [tabs, accessOrder]);
    
    const showOverflow = tabs.length > MAX_VISIBLE_TABS;
    const visibleTabs = showOverflow ? sortedTabs.slice(0, MAX_VISIBLE_TABS - 1) : sortedTabs;
    const overflowTabs = showOverflow ? sortedTabs.slice(MAX_VISIBLE_TABS - 1) : [];

    return (
        <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4 flex-shrink-0">
            {/* 左侧：Logo/标题（首页显示，子模块隐藏） */}
            {isHome && (
                <div className="flex items-center gap-3 flex-shrink-0 mr-6">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">E</span>
                    </div>
                    <div className="hidden sm:block">
                        <h1 className="text-sm font-bold text-gray-800">EPoseidon2.0</h1>
                        <p className="text-[10px] text-gray-500">企业自研管理系统</p>
                    </div>
                </div>
            )}
            
            {/* 中间：标签栏 */}
            <div className="flex-1 min-w-0 flex items-center">
                <div className="flex-1 min-w-0 overflow-x-auto">
                    <div className="flex items-center gap-1 min-w-0">
                        {visibleTabs.map(tab => (
                            <div
                                key={tab.id}
                                className={`group flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition-colors min-w-0 max-w-[160px] flex-shrink-0 ${
                                    activeTabId === tab.id
                                        ? 'bg-indigo-50 text-indigo-600 font-medium'
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
                
                {/* 更多标签 */}
                {showOverflow && (
                    <div className="relative flex-shrink-0 ml-1">
                        <button
                            type="button"
                            onClick={() => setMoreOpen(prev => !prev)}
                            className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-sm transition-colors ${
                                overflowTabs.some(t => t.id === activeTabId)
                                    ? 'bg-indigo-50 text-indigo-600 font-medium'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <span>更多</span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {moreOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-[100]"
                                    onClick={() => setMoreOpen(false)}
                                    aria-hidden="true"
                                />
                                <div className="absolute right-0 top-full mt-1 py-1 bg-white border border-gray-200 rounded-lg shadow-xl z-[101] min-w-[200px] max-h-72 overflow-y-auto">
                                    {overflowTabs.map(tab => (
                                        <div
                                            key={tab.id}
                                            role="button"
                                            tabIndex={0}
                                            className={`flex items-center justify-between gap-2 px-3 py-2 cursor-pointer text-sm hover:bg-gray-50 ${
                                                activeTabId === tab.id ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700'
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
            
            {/* 右侧：功能按钮 */}
            <div className="flex items-center gap-1 flex-shrink-0 ml-4 pl-4 border-l border-gray-200">
                {/* 搜索 */}
                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="搜索">
                    <Search className="w-4 h-4" />
                </button>
                
                {/* 通知 */}
                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors relative" title="消息通知">
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
                </button>
                
                {/* 用户菜单 */}
                <div className="relative">
                    <button 
                        className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors ml-1"
                        onClick={() => setUserMenuOpen(prev => !prev)}
                    >
                        <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-medium text-sm">
                            张
                        </div>
                    </button>
                    
                    {userMenuOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-[100]"
                                onClick={() => setUserMenuOpen(false)}
                                aria-hidden="true"
                            />
                            <div className="absolute right-0 top-full mt-1 py-1 bg-white border border-gray-200 rounded-lg shadow-xl z-[101] min-w-[160px]">
                                <div className="px-3 py-2 border-b border-gray-100">
                                    <p className="text-sm font-medium text-gray-800">张三</p>
                                    <p className="text-xs text-gray-500">系统管理员</p>
                                </div>
                                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                    <User className="w-4 h-4" />
                                    <span>个人中心</span>
                                </button>
                                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                    <Settings className="w-4 h-4" />
                                    <span>账号设置</span>
                                </button>
                                <div className="border-t border-gray-100 mt-1 pt-1">
                                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                                        <LogOut className="w-4 h-4" />
                                        <span>退出登录</span>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

function App() {
    // 标签页状态：开一个就新增一个标签，始终至少保留一个（首页）
    const [tabs, setTabs] = useState([{ id: '/home', name: '首页', path: '/home' }]);
    const [activeTabId, setActiveTabId] = useState('/home');

    // 更新浏览器 URL（不改变页面状态）
    const updateUrl = useCallback((path) => {
        if (path && window.location.pathname !== path) {
            window.history.pushState({ path }, '', path);
        }
    }, []);

    // 打开新标签页（内部打开详情等用）
    const openTab = useCallback((tabInfo) => {
        const { id, name, path, data } = tabInfo;
        const existingTab = tabs.find(t => t.id === id);
        if (existingTab) {
            setActiveTabId(id);
            updateUrl(existingTab.path);
            return;
        }
        setTabs(prev => [...prev, { id, name, path, data }]);
        setActiveTabId(id);
        updateUrl(path);
    }, [tabs, updateUrl]);

    // 从侧栏导航：有同 path 的标签则激活，否则新增一个标签
    const handleNavigate = (path, name) => {
        const existing = tabs.find(t => t.path === path);
        if (existing) {
            setActiveTabId(existing.id);
            updateUrl(path);
            return;
        }
        setTabs(prev => [...prev, { id: path, name, path }]);
        setActiveTabId(path);
        updateUrl(path);
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
        // 切换标签时同步更新 URL
        const tab = tabs.find(t => t.id === tabId);
        if (tab) {
            updateUrl(tab.path);
        }
    }, [tabs, updateUrl]);

    // 根据 URL 路径获取页面名称
    const getPageNameFromPath = useCallback((path) => {
        const pathMap = {
            '/home': '首页',
            '/product': '产品中心',
            '/product/master': '产品主数据',
            '/hr/employees': '企业人才库',
            '/hr/active-employees': '在职员工列表',
            '/hr/former-employees': '离职员工列表',
            '/hr/organization': '组织架构管理',
            '/procurement/supplier': '供应商管理',
            '/logistics': '物流与报关',
            '/finance/expense-fact': '费用事实',
            '/announcements': '公司公告',
            '/supply-chain-plan': '供应链计划',
            '/project': '新品开发项目',
        };
        // 尝试直接匹配
        if (pathMap[path]) return pathMap[path];
        // 尝试前缀匹配
        for (const [key, value] of Object.entries(pathMap)) {
            if (path.startsWith(key)) return value;
        }
        return '页面';
    }, []);

    // 首次加载：根据 URL 打开对应页面
    React.useEffect(() => {
        const currentPath = window.location.pathname;
        if (currentPath && currentPath !== '/' && currentPath !== '/home') {
            const pageName = getPageNameFromPath(currentPath);
            // 清空默认标签页，直接打开 URL 对应的页面
            setTabs([{ id: currentPath, name: pageName, path: currentPath }]);
            setActiveTabId(currentPath);
        }
    }, [getPageNameFromPath]);

    // 监听浏览器前进/后退
    React.useEffect(() => {
        const handlePopState = (event) => {
            const path = event.state?.path || window.location.pathname;
            if (path) {
                // 查找是否已有对应标签页
                const existingTab = tabs.find(t => t.path === path);
                if (existingTab) {
                    setActiveTabId(existingTab.id);
                } else {
                    // 没有则新建标签页
                    const pageName = getPageNameFromPath(path);
                    setTabs(prev => [...prev, { id: path, name: pageName, path }]);
                    setActiveTabId(path);
                }
            }
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [tabs, getPageNameFromPath]);

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
        // ---------- 项目工作台（动态路由）----------
        if (tab.path && tab.path.startsWith('/project/') && tab.path !== '/project/create') {
            return (
                <ProjectWorkspacePage
                    record={tab.data}
                    onClose={() => closeTab(tab.id)}
                />
            );
        }
        switch (tab.path) {
            case '/home':
                return (
                    <HomePage 
                        onNavigate={(path, name) => handleNavigate(path, name)}
                        onOpenAnnouncement={(item) => openTab({
                            id: `announcement-${item.id}`,
                            name: '公告详情',
                            path: '/announcements/detail',
                            data: item
                        })}
                        onOpenAnnouncementsList={() => handleNavigate('/announcements', '公司公告')}
                    />
                );
            case '/announcements':
                return (
                    <AnnouncementsPage 
                        onOpenDetail={(item) => openTab({
                            id: `announcement-${item.id}`,
                            name: '公告详情',
                            path: '/announcements/detail',
                            data: item
                        })}
                    />
                );
            case '/announcements/detail':
                return (
                    <AnnouncementDetailPage 
                        record={tab.data}
                        onClose={() => closeTab(tab.id)}
                    />
                );
            
            // ---------- 一级入口默认跳转 ----------
            case '/product/overview':
                return (
                    <ModuleLayout>
                        <ProductOverviewPage />
                    </ModuleLayout>
                );
            case '/sales':
                return (
                    <ModuleLayout>
                        <SalesProductPage />
                    </ModuleLayout>
                );
            case '/procurement/overview':
                return (
                    <ModuleLayout>
                        <ProcurementOverviewPage />
                    </ModuleLayout>
                );
            case '/logistics/overview':
                return (
                    <ModuleLayout>
                        <LogisticsOverviewPage />
                    </ModuleLayout>
                );
            case '/finance/overview':
                return (
                    <ModuleLayout>
                        <FinanceOverviewPage />
                    </ModuleLayout>
                );
            case '/quality/overview':
                return (
                    <ModuleLayout>
                        <QualityOverviewPage />
                    </ModuleLayout>
                );
            case '/organization/overview':
                return (
                    <ModuleLayout>
                        <PlaceholderPage pageName="组织概览" path={tab.path} />
                    </ModuleLayout>
                );
            
            // ---------- 一级入口模块（带顶部子导航） ----------
            case '/product/master':
                return (
                    <ModuleLayout>
                        <ProductMasterPage onOpenSkuDetail={openSkuDetail} />
                    </ModuleLayout>
                );
            case '/product/bom':
                return (
                    <ModuleLayout>
                        <BOMManagementPage />
                    </ModuleLayout>
                );
            case '/product/virtual-combo':
                return (
                    <ModuleLayout>
                        <VirtualComboPage />
                    </ModuleLayout>
                );
            case '/product/brand':
                return (
                    <ModuleLayout>
                        <BrandManagementPage />
                    </ModuleLayout>
                );
            case '/product/structure':
                return (
                    <ModuleLayout>
                        <ProductStructurePage />
                    </ModuleLayout>
                );
            case '/product/template':
                return (
                    <ModuleLayout>
                        <CategoryTemplatePage />
                    </ModuleLayout>
                );
            case '/product/tag':
                return (
                    <ModuleLayout>
                        <ProductTagPage />
                    </ModuleLayout>
                );
            case '/product/coding-rule':
                return (
                    <ModuleLayout>
                        <CodingRulePage />
                    </ModuleLayout>
                );
            case '/product/attribute':
                return (
                    <ModuleLayout>
                        <ProductAttributePage />
                    </ModuleLayout>
                );
            // 产品相关详情页
            case '/product/sku-detail':
                return (
                    <div className="flex-1 min-h-0 overflow-auto">
                        <SkuDetailPage record={tab.data} />
                    </div>
                );
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
            // 财务中心模块（财务治理 + 财务分析）
            case '/finance/cost-center':
                return (
                    <ModuleLayout>
                        <CostCenterPage />
                    </ModuleLayout>
                );
            case '/finance/budget-version':
                return (
                    <ModuleLayout>
                        <BudgetVersionPage onOpenDetail={openTab} />
                    </ModuleLayout>
                );
            case '/finance/expense-category':
                return (
                    <ModuleLayout>
                        <ExpenseCategoryPage />
                    </ModuleLayout>
                );
            case '/finance/expense-fact':
                return (
                    <ModuleLayout>
                        <ExpenseFactPage onOpenDetail={(rec) => openTab({
                            id: `expense-fact-detail-${rec?.id ?? Date.now()}`,
                            name: `费用事实详情: ${rec?.approvalNo ?? '详情'}`,
                            path: '/finance/expense-fact/detail',
                            data: rec,
                        })} />
                    </ModuleLayout>
                );
            case '/finance/allocation-rule':
                return (
                    <ModuleLayout>
                        <AllocationRulePage />
                    </ModuleLayout>
                );
            case '/finance/mapping':
                return (
                    <ModuleLayout>
                        <StoreDeptMappingPage />
                    </ModuleLayout>
                );
            // 财务分析
            case '/finance/revenue-analysis':
                return (
                    <ModuleLayout>
                        <RevenueAnalysisPage onOpenDetail={openTab} />
                    </ModuleLayout>
                );
            case '/finance/cost-analysis':
                return (
                    <ModuleLayout>
                        <CostAnalysisPage onOpenDetail={openTab} />
                    </ModuleLayout>
                );
            case '/finance/profit-analysis':
                return (
                    <ModuleLayout>
                        <ProfitAnalysisPage onOpenDetail={openTab} />
                    </ModuleLayout>
                );
            case '/finance/expense-fact/detail':
                return (
                    <ExpenseFactDetailPage
                        record={tab.data}
                        onClose={() => closeTab(tab.id)}
                    />
                );
            
            // 旧财务路由兼容（重定向到新路由）
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
            // 组织权限模块
            case '/organization/structure':
                return (
                    <ModuleLayout>
                        <OrganizationManagementPage />
                    </ModuleLayout>
                );
            case '/organization/users':
                return (
                    <ModuleLayout>
                        <UserManagementPage />
                    </ModuleLayout>
                );
            case '/organization/roles':
                return (
                    <ModuleLayout>
                        <RolePermissionPage />
                    </ModuleLayout>
                );
            // 销售与计划模块 - 美国事业部（继承现有全部页面）
            case '/sales/us/overview':
                return (
                    <ModuleLayout>
                        <UsSalesOverviewPage />
                    </ModuleLayout>
                );
            case '/sales/us/product':
                return (
                    <ModuleLayout>
                        <SalesProductPage />
                    </ModuleLayout>
                );
            case '/sales/us/target':
                return (
                    <ModuleLayout>
                        <SalesTargetPage />
                    </ModuleLayout>
                );
            case '/sales/us/forecast':
                return (
                    <ModuleLayout>
                        <SalesForecastPage />
                    </ModuleLayout>
                );
            case '/sales/us/data-aggregation':
                return (
                    <ModuleLayout>
                        <SalesDataAggregationPage />
                    </ModuleLayout>
                );
            case '/sales/us/slow-moving':
                return (
                    <ModuleLayout>
                        <SlowMovingAnalysisPage />
                    </ModuleLayout>
                );
            case '/sales/us/plan-dashboard':
                return (
                    <ModuleLayout>
                        <SalesPlanDashboardPage />
                    </ModuleLayout>
                );
            case '/us-private-domain':
            case '/us-private-domain/customers':
            case '/us-private-domain/marketing':
            case '/us-private-domain/community':
            case '/us-private-domain/analysis':
            case '/us-private-domain/targets':
                return (
                    <ModuleLayout>
                        <UsPrivateDomainPage />
                    </ModuleLayout>
                );
            // 其他事业部（占位）
            case '/sales/cn/overview':
                return (
                    <ModuleLayout>
                        <CnSalesOverviewPage />
                    </ModuleLayout>
                );
            case '/sales/sea/overview':
                return (
                    <ModuleLayout>
                        <SeaSalesOverviewPage />
                    </ModuleLayout>
                );
            case '/sales/eu/overview':
                return (
                    <ModuleLayout>
                        <EuSalesOverviewPage />
                    </ModuleLayout>
                );
            // 旧销售路由兼容（重定向到美国事业部对应页面）
            case '/sales':
            case '/sales/product':
                return (
                    <ModuleLayout>
                        <SalesProductPage />
                    </ModuleLayout>
                );
            case '/sales/target':
                return (
                    <ModuleLayout>
                        <SalesTargetPage />
                    </ModuleLayout>
                );
            case '/sales/forecast':
                return (
                    <ModuleLayout>
                        <SalesForecastPage 
                            data={tab.data}
                            openTab={(tabInfo) => openTab({ ...tabInfo, path: '/sales/forecast' })}
                        />
                    </ModuleLayout>
                );
            case '/sales/data-aggregation':
                return (
                    <ModuleLayout>
                        <SalesDataAggregationPage />
                    </ModuleLayout>
                );
            case '/sales/plan-dashboard':
                return (
                    <ModuleLayout>
                        <SalesPlanDashboardPage />
                    </ModuleLayout>
                );
            case '/sales/slow-moving':
                return (
                    <ModuleLayout>
                        <SlowMovingAnalysisPage />
                    </ModuleLayout>
                );
            // 项目管理
            case '/project/overview':
                return (
                    <ModuleLayout>
                        <ProjectOverviewPage />
                    </ModuleLayout>
                );
            // 经营分析
            case '/business-analysis/overview':
                return (
                    <ModuleLayout>
                        <PlaceholderPage pageName="经营概览" path={tab.path} />
                    </ModuleLayout>
                );
            // 人力资源
            case '/hr/overview':
                return (
                    <ModuleLayout>
                        <HrOverviewPage />
                    </ModuleLayout>
                );
            case '/hr/employees':
                return (
                    <ModuleLayout>
                        <EmployeeManagementPage />
                    </ModuleLayout>
                );
            case '/hr/active-employees':
                return (
                    <ModuleLayout>
                        <ActiveEmployeeListPage />
                    </ModuleLayout>
                );
            case '/hr/former-employees':
                return (
                    <ModuleLayout>
                        <FormerEmployeeListPage />
                    </ModuleLayout>
                );
            case '/hr/organization':
                return (
                    <ModuleLayout>
                        <HrOrganizationPage />
                    </ModuleLayout>
                );
            // 供应链采购模块
            case '/procurement/supplier':
                return (
                    <ModuleLayout>
                        <SupplierListPage onOpenDetail={openTab} onOpenPerformance={openTab} />
                    </ModuleLayout>
                );
            case '/procurement/supplier/detail':
                return (
                    <SupplierDetailPage 
                        data={tab.data} 
                        onClose={() => closeTab(tab.id)}
                    />
                );
            case '/procurement/sku-iteration':
                return (
                    <ModuleLayout>
                        <SkuIterationPage />
                    </ModuleLayout>
                );
            case '/procurement/plan-tracking':
                return (
                    <ModuleLayout>
                        <ProcurementPlanTrackingPage />
                    </ModuleLayout>
                );
            // 供应链计划模块
            case '/supply-chain/overview':
                return (
                    <ModuleLayout>
                        <SupplyChainOverviewPage />
                    </ModuleLayout>
                );
            case '/supply-chain/forecast-tracking':
                return (
                    <ModuleLayout>
                        <ForecastTrackingPage />
                    </ModuleLayout>
                );
            case '/supply-chain/supply-plan':
                return (
                    <ModuleLayout>
                        <SupplyPlanPage />
                    </ModuleLayout>
                );
            
            // 物流与报关模块
            case '/logistics/vendors':
                return (
                    <ModuleLayout>
                        <LogisticsVendorListPage onOpenDetail={openTab} />
                    </ModuleLayout>
                );
            case '/logistics/channels':
                return (
                    <ModuleLayout>
                        <LogisticsChannelListPage onOpenDetail={openTab} />
                    </ModuleLayout>
                );
            case '/logistics/addresses':
                return (
                    <ModuleLayout>
                        <LogisticsAddressListPage onOpenDetail={openTab} />
                    </ModuleLayout>
                );
            case '/logistics/hs-codes':
                return (
                    <ModuleLayout>
                        <LogisticsHsCodeListPage onOpenDetail={openTab} />
                    </ModuleLayout>
                );
            case '/logistics/declarations':
                return (
                    <ModuleLayout>
                        <LogisticsDeclarationListPage onOpenDetail={openTab} />
                    </ModuleLayout>
                );
            case '/logistics/rules/routing':
                return (
                    <ModuleLayout>
                        <LogisticsRoutingRuleListPage onOpenDetail={openTab} />
                    </ModuleLayout>
                );
            case '/logistics/rules/consolidation':
                return (
                    <ModuleLayout>
                        <LogisticsConsolidationRuleListPage onOpenDetail={openTab} />
                    </ModuleLayout>
                );
            case '/logistics/trial-calc':
                return (
                    <ModuleLayout>
                        <LogisticsTrialCalcPage />
                    </ModuleLayout>
                );
            // ---------- 系统设置（逐步上线：未做的继续走 default 占位） ----------
            // 质量管理模块（已在上面定义）
            
            // 系统设置模块（保留左侧导航，但也可以用ModuleLayout统一）
            case '/settings/params':
                return (
                    <ModuleLayout>
                        <SettingsParamsPage />
                    </ModuleLayout>
                );
            case '/settings/log':
                return (
                    <ModuleLayout>
                        <SettingsLogPage />
                    </ModuleLayout>
                );
            case '/settings/sync':
                return (
                    <ModuleLayout>
                        <SettingsApiSyncPage onOpenTab={openTab} />
                    </ModuleLayout>
                );
            case '/settings/scheduler':
                return (
                    <ModuleLayout>
                        <SettingsSchedulerPage onOpenTab={openTab} />
                    </ModuleLayout>
                );
            case '/settings/dict':
                return (
                    <ModuleLayout>
                        <SettingsDictPage />
                    </ModuleLayout>
                );
            case '/settings/basic':
                return (
                    <ModuleLayout>
                        <SettingsBasicPage />
                    </ModuleLayout>
                );
            case '/settings/enum':
                return (
                    <ModuleLayout>
                        <SettingsEnumRulePage />
                    </ModuleLayout>
                );
            // 财务分析详情页（不需要ModuleLayout，因为是详情页）
            case '/finance-analysis/cost/detail':
                return (
                    <CostAnalysisDetailPage
                        data={tab.data}
                        onClose={() => closeTab(tab.id)}
                    />
                );
            
            // 项目管理 - 新品开发PM模块
            case '/project':
                return (
                    <PMOverviewPage
                        onOpenProject={(project) => openTab({
                            id: `project-${project.id}`,
                            name: project.name,
                            path: `/project/${project.id}`,
                            data: project
                        })}
                        onCreateProject={() => handleNavigate('/project/create', '新建项目')}
                    />
                );
            case '/project/create':
                return (
                    <ProjectCreatePage
                        onClose={() => closeTab(tab.id)}
                        onSave={(data) => {
                            console.log('创建项目:', data);
                            closeTab(tab.id);
                        }}
                    />
                );
            
            // 旧路由兼容
            case '/system/users':
                return <UserManagementPage />;
            case '/system/roles':
                return <RolePermissionPage />;
            default:
                return (
                    <ModuleLayout>
                        <PlaceholderPage pageName={tab.name} path={tab.path} />
                    </ModuleLayout>
                );
        }
    };

    const activeTab = tabs.find(t => t.id === activeTabId);

    return (
        <div className="flex h-screen bg-gray-100">
            {/* 动态左侧导航 */}
            <DynamicSidebar 
                currentPath={activeTab?.path ?? '/home'} 
                onNavigate={handleNavigate} 
            />

            {/* 主内容区 */}
            <div className="flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden">
                {/* 顶部导航栏（Logo + 标签 + 功能） */}
                <Header
                    tabs={tabs}
                    activeTabId={activeTabId}
                    onTabClick={switchTab}
                    onTabClose={closeTab}
                    currentPath={activeTab?.path ?? '/home'}
                    onNavigate={handleNavigate}
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
