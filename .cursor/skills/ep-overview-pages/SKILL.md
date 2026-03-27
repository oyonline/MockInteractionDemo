---
name: ep-overview-pages
description: Create module overview pages for EPoseidon2.0. Use when adding new business module entry points with statistics cards, KPI metrics, and placeholder content. Covers 12 modules: product, sales (4 regions), procurement, supply-chain, logistics, finance, quality, project, business-analysis, hr, organization.
---

# EPoseidon2.0 模块概览页创建工具

## 用途

为每个业务模块创建统一的概览入口页，包含：
- 模块标题和描述
- 关键统计指标（4卡片）
- 功能占位区或快捷入口

## 创建命令

```
创建 {module} 模块的概览页，使用 {color} 主题色
```

示例：
- 创建 procurement 模块的概览页，使用 amber 主题色
- 创建 project 模块的概览页，使用 amber-700 主题色

## 自动生成文件

### 1. 页面组件

`src/pages/overview/{Module}OverviewPage.js`

```javascript
import React from 'react';
import { ModuleIcon, TrendingUp } from 'lucide-react';

const ModuleOverviewPage = () => {
    // 统计数据
    const stats = [
        { label: '指标1', value: '123', trend: '+12%' },
        { label: '指标2', value: '456', trend: '+5%' },
        { label: '指标3', value: '789', trend: '-2%' },
        { label: '指标4', value: '100', trend: '+8%' },
    ];

    return (
        <div className="h-full flex flex-col bg-gray-50">
            {/* 标题区 */}
            <div className="bg-white border-b px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-{color}-50 rounded-lg flex items-center justify-center">
                            <ModuleIcon className="w-5 h-5 text-{color}-600" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold text-gray-800">模块名称</h1>
                            <p className="text-sm text-gray-500">模块描述</p>
                        </div>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                        运营中
                    </span>
                </div>
            </div>

            {/* 统计卡片 */}
            <div className="grid grid-cols-4 gap-4 p-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">{stat.label}</p>
                                <p className="text-2xl font-semibold text-gray-800 mt-1">{stat.value}</p>
                            </div>
                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-blue-500" />
                            </div>
                        </div>
                        <div className="mt-2 flex items-center text-sm">
                            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                            <span className="text-green-600">{stat.trend}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* 主内容占位 */}
            <div className="flex-1 px-6 pb-6">
                <div className="bg-white rounded-lg border border-dashed border-gray-300 p-12 h-full flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-{color}-50 rounded-full flex items-center justify-center mb-4">
                        <ModuleIcon className="w-8 h-8 text-{color}-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">模块名称概览</h3>
                    <p className="text-sm text-gray-500 max-w-md">
                        此页面用于展示模块的整体概况，包括关键指标、业务数据等。
                    </p>
                </div>
            </div>
        </div>
    );
};
```

### 2. App.js 注册

```javascript
import ModuleOverviewPage from './pages/overview/ModuleOverviewPage';

case '/{module}/overview':
    return (
        <ModuleLayout>
            <ModuleOverviewPage />
        </ModuleLayout>
    );
```

### 3. DynamicSidebar 更新

```javascript
// navConfig 中添加
'{module}': {
    title: '模块名称',
    parent: '/home',
    items: [
        { name: '模块概览', path: '/{module}/overview' },
        { name: '功能1', path: '/{module}/feature1' },
        // ...
    ]
}
```

## 配色参考

| 模块 | 主题色 | Icon |
|------|--------|------|
| 美国事业部 | rose | Globe |
| 中国事业部 | violet | Globe |
| 东南亚事业部 | orange | Globe |
| 欧洲事业部 | blue | Globe |
| 产品中心 | sky | Package |
| 供应链采购 | amber | ShoppingCart |
| 供应链计划 | teal | ClipboardList |
| 物流与报关 | purple | Truck |
| 财务中心 | emerald | DollarSign |
| 质量管理 | cyan | TestTube |
| 项目管理 | amber-700 | FolderKanban |
| 人力资源 | pink | Briefcase |
| 经营分析 | blue-700 | BarChart3 |
| 组织权限 | indigo | Users |

## 快速检查清单

- [ ] 页面文件创建于 `src/pages/overview/`
- [ ] 使用正确的主题色（背景50色，文字600色）
- [ ] 包含4个统计卡片
- [ ] 包含运营状态标签
- [ ] App.js 中 import 和 case 已添加
- [ ] DynamicSidebar navConfig 已更新
