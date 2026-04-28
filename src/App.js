// src/App.js
import React, {useState, useCallback} from 'react';
import {
    X,
    Search,
    Bell,
    Settings,
    LogOut,
    User
} from 'lucide-react';
import HomePage from './pages/HomePage';
import ProcessManagementPage from './pages/process/ProcessManagementPage';
import BusinessAnalysisPage from './pages/business/BusinessAnalysisPage';
import ProcessTemplateListPage from './pages/process/ProcessTemplateListPage';
import ProcessTemplateDetailPage from './pages/process/ProcessTemplateDetailPage';
import ProcessTemplateEditPage from './pages/process/ProcessTemplateEditPage';
import ProcessTemplateVersionPage from './pages/process/ProcessTemplateVersionPage';
import ProcessCategoryPage from './pages/process/ProcessCategoryPage';
import ProductMasterPage from './pages/product/ProductMasterPage';
import BOMManagementPage from './pages/product/BOMManagementPage';
import BrandManagementPage from './pages/product/BrandManagementPage';
import ProductStructurePage from './pages/product/ProductStructurePage';
import CategoryTemplatePage from './pages/product/CategoryTemplatePage';
import StoreDeptMappingPage from './pages/finance/StoreDeptMappingPage';
import CostCenterPage from './pages/finance/CostCenterPage';
import AllocationRulePage from './pages/finance/AllocationRulePage';

import ApprovalCenterPage from './pages/workbench/ApprovalCenterPage';
import ApprovalDetailPage from './pages/workbench/ApprovalDetailPage';
import ExpenseFactPage from './pages/finance/ExpenseFactPage';
import ExpenseFactDetailPage from './pages/finance/ExpenseFactDetailPage';
import ExpenseCategoryPage from './pages/finance/ExpenseCategoryPage';
import OrganizationManagementPage from './pages/organization/OrganizationManagementPage';
import UserManagementPage from './pages/organization/UserManagementPage';
import RolePermissionPage from './pages/organization/RolePermissionPage';
import OrganizationOverviewPage from './pages/overview/OrganizationOverviewPage';
import PlaceholderPage from './pages/PlaceholderPage';
import SlowMovingAnalysisPage from './pages/sales/SlowMovingAnalysisPage';
import SkuDetailPage from './pages/product/SkuDetailPage.simple';
import SalesTargetPage from './pages/sales/SalesTargetPage';
import ProductTagPage from './pages/product/ProductTagPage';
import CodingRulePage from './pages/product/CodingRulePage';
import ProductAttributePage from './pages/product/ProductAttributePage';
import BudgetVersionPage from './pages/finance/BudgetVersionPage';
import BudgetVersionDetailPage from './pages/finance/BudgetVersionDetailPage';
import SupplierListPage from './pages/procurement/SupplierListPage';
import SupplierDetailPage from './pages/procurement/SupplierDetailPage';
import SkuIterationPage from './pages/product/SkuIterationPage';
import SalesForecastPage from './pages/sales/SalesForecastPage';
import VirtualComboPage from './pages/product/VirtualComboPage';
import SalesProductPage from './pages/sales/SalesProductPage';
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
import OpeningItoDashboardPage from './pages/supply-chain/OpeningItoDashboardPage';
import ExcessDashboardPage from './pages/supply-chain/ExcessDashboardPage';
import QualityInboundPage from './pages/quality/QualityInboundPage';
import QualityComplaintPage from './pages/quality/QualityComplaintPage';
import QualityTaskPage from './pages/quality/QualityTaskPage';
import SalesDataAggregationPage from './pages/sales/SalesDataAggregationPage';
import SalesPlanDashboardPage from './pages/sales/SalesPlanDashboardPage';
import SalesChinaPage from './pages/sales/cn/SalesChinaPage';
import SalesSeaPage from './pages/sales/sea/SalesSeaPage';
import SalesEuropePage from './pages/sales/eu/SalesEuropePage';
import ProcurementPlanTrackingPage from './pages/procurement/ProcurementPlanTrackingPage';
import PMOverviewPage from './pages/project/ProjectOverviewPage';
import ProjectWorkspacePage from './pages/project/ProjectWorkspacePage';
import ProjectCreatePage from './pages/project/ProjectCreatePage';
import UsSalesOverviewPage from './pages/overview/UsSalesOverviewPage';
import UsPrivateDomainPage from './pages/sales/us/UsPrivateDomainPage';
import CnSalesOverviewPage from './pages/overview/CnSalesOverviewPage';
import SeaSalesOverviewPage from './pages/overview/SeaSalesOverviewPage';
import EuSalesOverviewPage from './pages/overview/EuSalesOverviewPage';
import ProductOverviewPage from './pages/overview/ProductOverviewPage';
import ProcurementOverviewPage from './pages/overview/ProcurementOverviewPage';
import SupplyChainOverviewPage from './pages/overview/SupplyChainOverviewPage';
import LogisticsOverviewPage from './pages/overview/LogisticsOverviewPage';
import FinanceOverviewPage from './pages/overview/FinanceOverviewPage';
import QualityOverviewPage from './pages/overview/QualityOverviewPage';
import HrOverviewPage from './pages/overview/HrOverviewPage';
import CostAnalysisPage from './pages/finance/CostAnalysisPage';
import CostAnalysisDetailPage from './pages/finance/CostAnalysisDetailPage';
import RevenueAnalysisPage from './pages/finance/RevenueAnalysisPage';
import ProfitAnalysisPage from './pages/finance/ProfitAnalysisPage';
import AnnouncementsPage from './pages/announcement/AnnouncementsPage';
import EmployeeManagementPage from './pages/hr/EmployeeManagementPage';
import ActiveEmployeeListPage from './pages/hr/ActiveEmployeeListPage';
import FormerEmployeeListPage from './pages/hr/FormerEmployeeListPage';
import HrOrganizationPage from './pages/hr/HrOrganizationPage';
import PerformanceManagementPage from './pages/hr/PerformanceManagementPage';
import RecruitmentManagementPage from './pages/hr/RecruitmentManagementPage';
import AnnouncementDetailPage from './pages/announcement/AnnouncementDetailPage';
import ModuleLayout from './layouts/ModuleLayout';
import DynamicSidebar, { navConfig } from './layouts/DynamicSidebar';
import { ToastContainer } from './components/ui/Toast';
import { ConfirmDialogHost } from './components/ui/ConfirmDialog';

// 导航配置已移至 DynamicSidebar.js

// --------------- 顶部导航栏（标题 + 标签 + 功能）---------------
const Header = ({ tabs, activeTabId, onTabClick, onTabClose, currentPath, onNavigate }) => {
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    
    const isHome = currentPath === '/home' || currentPath === '/';
    return (
        <header className="flex h-14 flex-shrink-0 items-center border-b border-border bg-surface px-4">
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
            
            {/* 中间：标签栏（横向滚动） */}
            <div className="flex-1 min-w-0 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                <div className="flex items-center gap-1" style={{ width: 'max-content' }}>
                    {tabs.map(tab => (
                        <div
                            key={tab.id}
                            className={`group flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition-colors flex-shrink-0 max-w-[160px] ${
                                activeTabId === tab.id
                                    ? 'bg-brand-50 text-brand-700 font-medium'
                                    : 'text-text-muted hover:bg-surface-subtle'
                            }`}
                            onClick={() => onTabClick(tab.id)}
                        >
                            <span className="text-sm truncate flex-1 min-w-0">{tab.name}</span>
                            {tab.id !== '/home' && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onTabClose(tab.id);
                                    }}
                                    className="p-0.5 rounded hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            
            {/* 右侧：功能按钮 */}
            <div className="ml-4 flex flex-shrink-0 items-center gap-1 border-l border-border pl-4">
                {/* 搜索 */}
                <button className="rounded-xl p-2 text-text-subtle transition-colors hover:bg-surface-subtle" title="搜索">
                    <Search className="w-4 h-4" />
                </button>
                
                {/* 通知 */}
                <button className="relative rounded-xl p-2 text-text-subtle transition-colors hover:bg-surface-subtle" title="消息通知">
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
                </button>
                
                {/* 用户菜单 */}
                <div className="relative">
                    <button 
                        className="ml-1 flex items-center gap-2 rounded-xl p-1.5 transition-colors hover:bg-surface-subtle"
                        onClick={() => setUserMenuOpen(prev => !prev)}
                    >
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-sm font-medium text-brand-700">
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
                            <div className="absolute right-0 top-full z-[101] mt-1 min-w-[160px] rounded-2xl border border-border bg-surface py-1 shadow-elevated">
                                <div className="border-b border-border-subtle px-3 py-2">
                                    <p className="text-sm font-medium text-text">张三</p>
                                    <p className="text-xs text-text-subtle">系统管理员</p>
                                </div>
                                <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-text-muted hover:bg-surface-subtle">
                                    <User className="w-4 h-4" />
                                    <span>个人中心</span>
                                </button>
                                <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-text-muted hover:bg-surface-subtle">
                                    <Settings className="w-4 h-4" />
                                    <span>账号设置</span>
                                </button>
                                <div className="mt-1 border-t border-border-subtle pt-1">
                                    <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-danger-600 hover:bg-danger-50">
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

    // 关闭标签后若当前激活的 tab 已被移除，则激活最后一个并同步 URL
    React.useEffect(() => {
        if (tabs.length > 0 && !tabs.some(t => t.id === activeTabId)) {
            const nextTab = tabs[tabs.length - 1];
            setActiveTabId(nextTab.id);
            updateUrl(nextTab.path);
        }
    }, [tabs, activeTabId, updateUrl]);

    const switchTab = useCallback((tabId) => {
        setActiveTabId(tabId);
        // 切换标签时同步更新 URL
        const tab = tabs.find(t => t.id === tabId);
        if (tab) {
            updateUrl(tab.path);
        }
    }, [tabs, updateUrl]);

    // 根据 URL 路径获取页面名称（从 navConfig 自动派生，保证与侧栏完全一致）
    const getPageNameFromPath = useCallback((path) => {
        // 从 navConfig 所有模块的 items 中收集 path -> name 映射
        const pathMap = { '/home': '首页' };
        Object.values(navConfig).forEach(module => {
            (module.items || []).forEach(item => {
                if (item.path && item.name) {
                    pathMap[item.path] = item.name;
                }
            });
        });
        if (pathMap[path]) return pathMap[path];
        // 前缀匹配（处理详情页等动态路径）
        let bestMatch = '';
        let bestName = '页面';
        for (const [key, value] of Object.entries(pathMap)) {
            if (path.startsWith(key) && key.length > bestMatch.length) {
                bestMatch = key;
                bestName = value;
            }
        }
        return bestName;
    }, []);

    // 首次加载：根据 URL 打开对应页面（首页 tab 始终保留在第一位）
    React.useEffect(() => {
        const currentPath = window.location.pathname;
        if (currentPath && currentPath !== '/' && currentPath !== '/home') {
            const pageName = getPageNameFromPath(currentPath);
            const homeTab = { id: '/home', name: '首页', path: '/home' };
            setTabs([homeTab, { id: currentPath, name: pageName, path: currentPath }]);
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
        console.log('渲染 Tab 内容:', tab);
        if (!tab) return <HomePage />;
        // ---------- 流程模板详情页（path 前缀判断） ----------
        if (tab.path && tab.path.startsWith('/process/detail/')) {
            return (
                <ModuleLayout>
                    <ProcessTemplateDetailPage onNavigate={handleNavigate} />
                </ModuleLayout>
            );
        }
        // ---------- 流程模板编辑页（path 前缀判断） ----------
        if (tab.path && tab.path.startsWith('/process/edit/')) {
            return (
                <ModuleLayout>
                    <ProcessTemplateEditPage isEdit={true} onNavigate={handleNavigate} />
                </ModuleLayout>
            );
        }
        // ---------- 流程模板版本记录页（path 前缀判断） ----------
        if (tab.path && tab.path.startsWith('/process/versions/')) {
            return (
                <ModuleLayout>
                    <ProcessTemplateVersionPage onNavigate={handleNavigate} />
                </ModuleLayout>
            );
        }
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
        const staticProjectPaths = [
            '/project/overview',
            '/project/new-product',
            '/project/kanban',
            '/project/tasks',
            '/project/create',
        ];
        if (tab.path && tab.path.startsWith('/project/') && !staticProjectPaths.includes(tab.path)) {
            const projectId = tab.data?.id || tab.path.split('/').filter(Boolean).pop();
            return (
                <div className="h-full min-h-0 overflow-auto">
                    <ProjectWorkspacePage
                        record={tab.data || { id: projectId }}
                        onClose={() => closeTab(tab.id)}
                    />
                </div>
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
                        <QualityOverviewPage onNavigate={handleNavigate} />
                    </ModuleLayout>
                );
            case '/quality/inbound':
                return (
                    <ModuleLayout>
                        <QualityInboundPage />
                    </ModuleLayout>
                );
            case '/quality/complaint':
                return (
                    <ModuleLayout>
                        <QualityComplaintPage />
                    </ModuleLayout>
                );
            case '/quality/tasks':
                return (
                    <ModuleLayout>
                        <QualityTaskPage />
                    </ModuleLayout>
                );
            case '/organization/overview':
                return (
                    <ModuleLayout>
                        <OrganizationOverviewPage onNavigate={handleNavigate} />
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
                    <div className="h-full">
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
            case '/workbench/approvals':
                return (
                    <ApprovalCenterPage
                        onOpenDetail={(rec) => {
                            openTab({
                                id: `workbench/approvals/detail-${rec?.id ?? Date.now()}`,
                                name: '审批单详情',
                                path: '/workbench/approvals/detail',
                                data: rec
                            });
                        }}
                    />
                );
            case '/workbench/approvals/detail':
                return (
                    <ApprovalDetailPage
                        record={tab.data}
                        onBack={() => closeTab(tab.id)}
                    />
                );
            case '/finance/approval/list':
                return (
                    <ApprovalCenterPage
                        onOpenDetail={(rec) => {
                            openTab({
                                id: `workbench/approvals/detail-${rec?.id ?? Date.now()}`,
                                name: '审批单详情',
                                path: '/workbench/approvals/detail',
                                data: rec
                            });
                        }}
                    />
                );
            case '/finance/approval/detail':
                return (
                    <ApprovalDetailPage
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
            case '/sales/cn/maindata':
                return (
                    <ModuleLayout>
                        <SalesChinaPage />
                    </ModuleLayout>
                );
            case '/sales/cn/target':
                return (
                    <ModuleLayout>
                        <PlaceholderPage pageName="销售目标" path={tab.path} />
                    </ModuleLayout>
                );
            case '/sales/cn/forecast':
                return (
                    <ModuleLayout>
                        <PlaceholderPage pageName="销量预测" path={tab.path} />
                    </ModuleLayout>
                );
            case '/sales/sea/overview':
                return (
                    <ModuleLayout>
                        <SeaSalesOverviewPage />
                    </ModuleLayout>
                );
            case '/sales/sea/maindata':
                return (
                    <ModuleLayout>
                        <SalesSeaPage />
                    </ModuleLayout>
                );
            case '/sales/sea/target':
                return (
                    <ModuleLayout>
                        <PlaceholderPage pageName="销售目标" path={tab.path} />
                    </ModuleLayout>
                );
            case '/sales/sea/forecast':
                return (
                    <ModuleLayout>
                        <PlaceholderPage pageName="销量预测" path={tab.path} />
                    </ModuleLayout>
                );
            case '/sales/eu/overview':
                return (
                    <ModuleLayout>
                        <EuSalesOverviewPage />
                    </ModuleLayout>
                );
            case '/sales/eu/maindata':
                return (
                    <ModuleLayout>
                        <SalesEuropePage />
                    </ModuleLayout>
                );
            case '/sales/eu/target':
                return (
                    <ModuleLayout>
                        <PlaceholderPage pageName="销售目标" path={tab.path} />
                    </ModuleLayout>
                );
            case '/sales/eu/forecast':
                return (
                    <ModuleLayout>
                        <PlaceholderPage pageName="销量预测" path={tab.path} />
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
                        <PMOverviewPage
                            onOpenProject={(project) => openTab({
                                id: `project-${project.id}`,
                                name: project.projectName || project.name,
                                path: `/project/${project.id}`,
                                data: project
                            })}
                            onCreateProject={() => handleNavigate('/project/create', '新建项目')}
                        />
                    </ModuleLayout>
                );
            // 经营分析
            case '/business-analysis/overview':
                return (
                    <ModuleLayout>
                        <BusinessAnalysisPage />
                    </ModuleLayout>
                );
            // 流程管理
            case '/process/overview':
                return (
                    <ModuleLayout>
                        <ProcessManagementPage onNavigate={handleNavigate} />
                    </ModuleLayout>
                );
            case '/process/templates':
                return (
                    <ModuleLayout>
                        <ProcessTemplateListPage onNavigate={handleNavigate} />
                    </ModuleLayout>
                );
            case '/process/create':
                return (
                    <ModuleLayout>
                        <ProcessTemplateEditPage isEdit={false} onNavigate={handleNavigate} />
                    </ModuleLayout>
                );
            case '/process/categories':
                return (
                    <ModuleLayout>
                        <ProcessCategoryPage onNavigate={handleNavigate} />
                    </ModuleLayout>
                );
            case '/process/versions':
            case '/process/drafts':
            case '/process/documents':
                return (
                    <ModuleLayout>
                        <PlaceholderPage pageName={tab.name} path={tab.path} />
                    </ModuleLayout>
                );
            case '/business-analysis/metrics':
                return (
                    <ModuleLayout>
                        <PlaceholderPage pageName="经营指标" path={tab.path} />
                    </ModuleLayout>
                );
            case '/business-analysis/data':
                return (
                    <ModuleLayout>
                        <PlaceholderPage pageName="数据分析" path={tab.path} />
                    </ModuleLayout>
                );
            case '/business-analysis/decision':
                return (
                    <ModuleLayout>
                        <PlaceholderPage pageName="决策支持" path={tab.path} />
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
            case '/hr/performance':
                return (
                    <ModuleLayout>
                        <PerformanceManagementPage />
                    </ModuleLayout>
                );
            case '/hr/recruitment':
                return (
                    <ModuleLayout>
                        <RecruitmentManagementPage />
                    </ModuleLayout>
                );
            case '/hr/salary':
                return (
                    <ModuleLayout>
                        <PlaceholderPage pageName="薪酬管理" path={tab.path} />
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

            case '/supply-chain/excess-dashboard':
                return (
                    <ModuleLayout>
                        <ExcessDashboardPage />
                    </ModuleLayout>
                );

            case '/supply-chain/opening-ito-dashboard':
                return (
                    <ModuleLayout>
                        <OpeningItoDashboardPage />
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
            case '/settings':
                return (
                    <ModuleLayout>
                        <SettingsBasicPage />
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
                    <ModuleLayout>
                        <PMOverviewPage
                            onOpenProject={(project) => openTab({
                                id: `project-${project.id}`,
                                name: project.projectName || project.name,
                                path: `/project/${project.id}`,
                                data: project
                            })}
                            onCreateProject={() => handleNavigate('/project/create', '新建项目')}
                        />
                    </ModuleLayout>
                );
            case '/project/new-product':
                return (
                    <ModuleLayout>
                        <PMOverviewPage
                            onOpenProject={(project) => openTab({
                                id: `project-${project.id}`,
                                name: project.projectName || project.name,
                                path: `/project/${project.id}`,
                                data: project
                            })}
                            onCreateProject={() => handleNavigate('/project/create', '新建项目')}
                        />
                    </ModuleLayout>
                );
            case '/project/kanban':
                return (
                    <ModuleLayout>
                        <PlaceholderPage pageName="项目看板" path={tab.path} />
                    </ModuleLayout>
                );
            case '/project/tasks':
                return (
                    <ModuleLayout>
                        <PlaceholderPage pageName="任务管理" path={tab.path} />
                    </ModuleLayout>
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
        <div className="flex h-screen bg-surface-muted">
            {/* 动态左侧导航 */}
            <DynamicSidebar 
                currentPath={activeTab?.path ?? '/home'} 
                onNavigate={handleNavigate} 
            />

            {/* 主内容区 */}
            <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
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
                <main className="flex-1 min-h-0 min-w-0 overflow-hidden bg-surface-muted">
                    {renderTabContent(activeTab)}
                </main>
            </div>

            {/* 全局通用容器：Toast 反馈 + 确认弹窗。挂在根节点，所有页面都可调用。 */}
            <ToastContainer />
            <ConfirmDialogHost />
        </div>
    );
}

export default App;
