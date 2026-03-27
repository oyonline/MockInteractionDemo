---
name: ep-new-module-creator
description: Quick scaffolding tool for creating new business modules in EPoseidon2.0. Use when adding entirely new modules (like CRM, WMS, etc.) with overview page, sidebar navigation, and App.js integration. Generates all boilerplate files following project conventions.
---

# EPoseidon2.0 新模块创建工具

## 使用场景

创建全新的业务模块（如 CRM、WMS、BI 等），包含：
- 模块概览页
- 侧边栏导航配置
- App.js 路由注册
- 目录结构初始化

## 创建命令

```
创建 {module-name} 模块，中文名 {module-cn-name}，使用 {color} 主题色，包含概览页和功能列表：{feature1}, {feature2}, {feature3}
```

示例：
```
创建 CRM 模块，中文名 客户关系管理，使用 purple 主题色，包含概览页和功能列表：客户列表, 商机管理, 合同管理, 售后服务
```

## 自动生成文件清单

### 1. 目录结构

```
src/pages/{module}/
├── {Module}OverviewPage.js     # 概览页
├── {Feature1}Page.js           # 功能1页面
└── {Feature2}Page.js           # 功能2页面

src/mock/{module}/
└── index.js                    # Mock数据入口

src/services/{module}.js        # Service层
```

### 2. 概览页面

`src/pages/{module}/{Module}OverviewPage.js`

```javascript
import React from 'react';
import { ModuleIcon, TrendingUp } from 'lucide-react';

const ModuleOverviewPage = () => {
    const stats = [
        { label: '统计1', value: '0', trend: '0%' },
        { label: '统计2', value: '0', trend: '0%' },
        { label: '统计3', value: '0', trend: '0%' },
        { label: '统计4', value: '0', trend: '0%' },
    ];

    return (
        <div className="h-full flex flex-col bg-gray-50">
            <div className="bg-white border-b px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-{color}-50 rounded-lg flex items-center justify-center">
                            <ModuleIcon className="w-5 h-5 text-{color}-600" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold text-gray-800">{module-cn-name}</h1>
                            <p className="text-sm text-gray-500">模块描述</p>
                        </div>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                        运营中
                    </span>
                </div>
            </div>

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
                    </div>
                ))}
            </div>

            <div className="flex-1 px-6 pb-6">
                <div className="bg-white rounded-lg border border-dashed border-gray-300 p-12 h-full flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-{color}-50 rounded-full flex items-center justify-center mb-4">
                        <ModuleIcon className="w-8 h-8 text-{color}-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{module-cn-name}概览</h3>
                    <p className="text-sm text-gray-500 max-w-md">
                        此页面用于展示{module-cn-name}的整体概况，包括关键指标、业务数据等。
                    </p>
                    <div className="mt-6 flex gap-3">
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm">功能1</span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm">功能2</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModuleOverviewPage;
```

### 3. App.js 修改

```javascript
// import
import ModuleOverviewPage from './pages/{module}/{Module}OverviewPage';

// case
case '/{module}/overview':
    return (
        <ModuleLayout>
            <ModuleOverviewPage />
        </ModuleLayout>
    );
case '/{module}/{feature1}':
    return (
        <ModuleLayout>
            <{Feature1}Page />
        </ModuleLayout>
    );
```

### 4. DynamicSidebar 配置

```javascript
// navConfig 添加
'{module}': {
    title: '{module-cn-name}',
    parent: '/home',
    items: [
        { name: '模块概览', path: '/{module}/overview' },
        { name: '功能1', path: '/{module}/{feature1}' },
        { name: '功能2', path: '/{module}/{feature2}' },
        // ...
    ]
},

// getCurrentModule 添加
if (path.startsWith('/{module}')) return '{module}';
```

### 5. 首页工作台卡片

```javascript
// HomePage.js mainEntries 添加
{ 
    id: '{module}', 
    name: '{module-cn-name}', 
    icon: ModuleIcon, 
    desc: '功能描述', 
    color: 'bg-{color}-500', 
    lightColor: 'bg-{color}-50', 
    path: '/{module}/overview' 
},
```

### 6. Mock 入口

```javascript
// src/mock/{module}/index.js
import { get, set } from '../../utils/storage';

const STORAGE_KEY = 'ecommerce:{module}:data';

const defaultData = [];

export function getMockData() {
    const stored = get(STORAGE_KEY);
    if (stored) return stored;
    set(STORAGE_KEY, defaultData);
    return defaultData;
}
```

## 快速检查清单

- [ ] 目录创建于 `src/pages/{module}/`
- [ ] 概览页使用正确的主题色
- [ ] App.js import + case 已添加
- [ ] DynamicSidebar navConfig 已添加
- [ ] getCurrentModule 已更新
- [ ] HomePage 工作台卡片已添加
- [ ] Mock 数据文件已创建
