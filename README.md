# 跨境电商管理系统

一个企业级的跨境电商自研系统，整合了产品、供应链、预测、库存、采购、费用预算等核心业务能力。

## 📋 项目简介

本项目是一个基于 React 的现代化跨境电商管理平台，旨在为跨境电商企业提供全方位的业务管理解决方案。系统涵盖了从产品管理、供应链采购、物流报关到财务治理、组织权限等完整的业务流程。

## 🛠️ 技术栈

- **前端框架**: React 19.2.3
- **构建工具**: Create React App 5.0.1
- **样式方案**: Tailwind CSS 3.4.1
- **图标库**: Lucide React 0.562.0
- **CSS 处理**: PostCSS + Autoprefixer

## ✨ 核心功能模块

### 1. 产品中心
- **产品主数据管理**: SPU/SKU 管理、产品信息维护、规格管理、SKU 详情
- **BOM 管理**: 物料清单管理、成本核算
- **品牌管理**: 品牌信息维护、品牌关联产品管理
- **产品结构分类**: 品牌-类目-系列三级分类体系
- **类目属性模板管理**: 类目属性模板配置、版本管理
- **产品标签**: 产品标签管理
- **编码规则**: 编码规则配置
- **属性管理**: 产品属性管理

### 2. 销售与计划
- **销售目标**: 销售目标管理
- **销售达成分析**: 销售达成分析
- **数据聚合分析**: 销售数据聚合
- **滞销分析**: 滞销品分析
- **销量预测**: 销量预测（支持版本管理：草稿 → 已推送计划 → 最终版）
  - 版本历史管理（快照链模式）
  - 事业部 + 月份维度管理
  - 历史版本新开标签页查看
- **计划测算看板**: 计划测算看板

### 3. 供应链采购管理
- **供应商管理**: 供应商信息维护、绩效评估
- **SKU迭代管理**: SKU 迭代与版本管理
- **采购计划执行跟进**: 采购计划执行与跟进

### 4. 供应链计划
- **Forecast Tracking**: 预测跟踪与执行监控，对比预测值与实际销售数据
- **供应计划管理**: 采购计划、生产计划与库存规划

### 5. 物流与报关
- **物流商档案**: 物流商基础信息维护
- **物流商渠道**: 渠道管理
- **仓库地址**: 仓库地址管理
- **HSCode**: 海关编码管理
- **申报资料**: 报关申报资料管理
- **物流类型规则**: 物流路由规则配置
- **集货规则**: 集货规则配置
- **备货试算**: 备货试算工具

### 6. 质量管理
- **入库质检**: 入库质检流程
- **客诉质量**: 客诉质量处理

### 7. 财务治理
- **店铺与部门归属映射**: 电商店铺与组织部门、成本中心的对应关系维护
- **成本中心**: 成本中心配置与管理
- **分摊规则**: 费用分摊规则设置
- **费用类别**: 预算费用类别管理、金蝶科目映射、经营管理视图
- **费用事实**: 费用事实数据管理
- **预算版本管理**: 预算版本管理
- **费用审批**: 费用审批列表与审批单详情

### 8. 财务与经营分析（只读）
- **收入分析**: 收入分析
- **成本分析**: 成本分析
- **利润分析**: 利润分析

### 9. 组织与权限
- **组织架构管理**: 组织架构维护、部门管理
- **用户管理**: 用户管理
- **角色&权限**: 角色与权限配置

### 10. 系统设置（IT专用）
- **基础配置**: 基础配置
- **数据字典**: 数据字典
- **枚举与规则**: 枚举与规则
- **接口同步**: 接口同步
- **参数设置**: 参数设置
- **定时任务**: 定时任务
- **系统日志**: 系统日志

## 📁 项目结构

```
ecommerce-system/
├── src/
│   ├── components/          # 公共组件
│   │   ├── ActionBar.js
│   │   └── TablePagination.js
│   ├── hooks/               # 自定义 Hooks
│   │   └── useLocalStorage.js
│   ├── layouts/             # 布局组件
│   │   ├── DynamicSidebar.js    # 动态左侧导航
│   │   └── ModuleLayout.js      # 模块布局
│   ├── mock/                # Mock 数据
│   ├── pages/               # 页面组件
│   │   ├── logistics/       # 物流与报关
│   │   │   ├── LogisticsVendorListPage.js
│   │   │   ├── LogisticsVendorDetailPage.js
│   │   │   ├── LogisticsChannelListPage.js
│   │   │   ├── LogisticsAddressListPage.js
│   │   │   ├── LogisticsHsCodeListPage.js
│   │   │   ├── LogisticsDeclarationListPage.js
│   │   │   ├── LogisticsRoutingRuleListPage.js
│   │   │   ├── LogisticsConsolidationRuleListPage.js
│   │   │   └── LogisticsTrialCalcPage.js
│   │   ├── settings/        # 系统设置
│   │   │   ├── SettingsParamsPage.js
│   │   │   ├── SettingsLogPage.js
│   │   │   ├── SettingsDictPage.js
│   │   │   ├── SettingsBasicPage.js
│   │   │   ├── SettingsEnumRulePage.js
│   │   │   ├── SettingsApiSyncPage.js
│   │   │   └── SettingsSchedulerPage.js
│   │   ├── supply-chain/    # 供应链计划
│   │   │   ├── ForecastTrackingPage.js
│   │   │   └── SupplyPlanPage.js
│   │   ├── HomePage.js
│   │   ├── ProductMasterPage.js
│   │   ├── SalesForecastPage.js         # 销量预测（含版本管理）
│   │   ├── SupplierListPage.js
│   │   ├── CostCenterPage.js
│   │   └── ...
│   ├── App.js               # 主应用与路由
│   ├── index.js             # 入口文件
│   └── index.css            # 全局样式（含 Tailwind）
├── public/                  # 静态资源
├── docs/                    # 项目文档
├── tailwind.config.js       # Tailwind 配置
├── postcss.config.js        # PostCSS 配置
└── package.json             # 项目依赖
```

## 🚀 快速开始

### 环境要求

- Node.js >= 14.0.0
- npm >= 6.0.0 或 yarn >= 1.22.0

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm start
```

应用将在 [http://localhost:3000](http://localhost:3000) 启动。

### 构建生产版本

```bash
npm run build
```

构建产物将输出到 `build` 目录。

## 🔧 开发说明

### 样式开发

项目使用 Tailwind CSS 进行样式开发，所有 Tailwind 工具类都可以直接使用。配置文件位于 `tailwind.config.js`。

### 添加新页面

1. 在 `src/pages/` 目录下创建新的页面组件（按模块放入子目录）
2. 在 `src/App.js` 中导入新组件
3. 在 `src/layouts/DynamicSidebar.js` 的 `navConfig` 中添加导航项
4. 在 `App.js` 的 `renderTabContent()` 函数中添加路由处理

### 标签页系统

系统采用标签页导航模式：
- 从侧边栏点击导航项会打开新标签
- 同一页面支持打开多个版本（如销量预测的不同历史版本）
- 标签支持关闭和切换

### 代码规范

- 使用 ESLint 进行代码检查
- 遵循 React Hooks 最佳实践
- 组件命名使用 PascalCase
- 文件命名使用 PascalCase（页面组件）或 camelCase（工具函数）

## 📝 功能特性

- ✅ 响应式设计，支持多设备访问
- ✅ 模块化架构，易于扩展和维护
- ✅ 统一的 UI 设计语言
- ✅ 标签页导航系统
- ✅ 销量预测版本管理（草稿 → 已推送计划 → 最终版）
- ✅ 表单验证和错误处理

## 🔐 用户权限

系统支持多角色权限管理：
- **系统管理员**: 拥有所有功能权限
- **管理层**: 可访问经营驾驶舱等高级功能
- **IT专用**: 系统设置等 IT 管理功能

## 📄 许可证

本项目为私有项目，仅供内部使用。

## 👥 贡献

本项目为企业内部项目，如有问题或建议，请联系项目维护团队。

## 📞 联系方式

如有技术问题，请联系开发团队。

---

**最后更新**: 2026年3月
