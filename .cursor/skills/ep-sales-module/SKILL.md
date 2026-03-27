---
name: ep-sales-module
description: Develop sales and planning module for EPoseidon2.0 with multi-region support. Use when creating or modifying sales overview pages, sales data pages, target management, forecast pages, data aggregation, slow-moving analysis, and planning dashboard for US, China, SEA, and EU regions.
---

# EPoseidon2.0 销售与计划模块（多事业部）

## 事业部架构

| 事业部 | Path | 主题色 | 状态 |
|--------|------|--------|------|
| 美国事业部 | `/sales/us/*` | rose | 完整 |
| 中国事业部 | `/sales/cn/*` | violet | 概览+占位 |
| 东南亚事业部 | `/sales/sea/*` | orange | 概览+占位 |
| 欧洲事业部 | `/sales/eu/*` | blue | 概览+占位 |

## 每个事业部页面清单

| 页面 | Path | 类型 |
|------|------|------|
| 事业部概览 | `/sales/{region}/overview` | 概览页 |
| 销售主数据 | `/sales/{region}/product` | 列表页 |
| 销售目标 | `/sales/{region}/target` | 列表页 |
| 销量预测 | `/sales/{region}/forecast` | 复杂页 |
| 数据聚合 | `/sales/{region}/data-aggregation` | 分析页 |
| 滞销分析 | `/sales/{region}/slow-moving` | 分析页 |
| 计划看板 | `/sales/{region}/plan-dashboard` | 看板页 |

## 开发优先级

1. **美国事业部** - 完整实现，作为模板
2. **其他事业部** - 先实现概览页，其他页面占位

## 美国事业部参考

参考页面：
- 概览：`UsSalesOverviewPage.js`
- 销售主数据：`SalesProductPage.js`
- 销售目标：`SalesTargetPage.js`
- 销量预测：`SalesForecastPage.js`
- 数据聚合：`SalesDataAggregationPage.js`
- 滞销分析：`SlowMovingAnalysisPage.js`
- 计划看板：`SalesPlanDashboardPage.js`

## 创建新事业部

```
创建 {region} 事业部的销售模块页面，使用 {color} 主题色
```

### 自动生成文件结构

```
src/pages/sales/
├── {Region}OverviewPage.js          # 概览页（必须）
├── Sales{Region}Page.js               # 销售主数据（可选）
├── Sales{Region}TargetPage.js         # 销售目标（可选）
├── Sales{Region}ForecastPage.js       # 销量预测（可选）
├── Sales{Region}DataAggregationPage.js # 数据聚合（可选）
└── Sales{Region}SlowMovingPage.js     # 滞销分析（可选）
```

### App.js 注册

```javascript
// 概览页
case '/sales/{region}/overview':
    return (
        <ModuleLayout>
            <RegionOverviewPage />
        </ModuleLayout>
    );

// 其他页面
case '/sales/{region}/product':
    return (
        <ModuleLayout>
            <SalesRegionPage />
        </ModuleLayout>
    );
// ... 其他 case
```

### DynamicSidebar 注册

```javascript
'sales-{region}': {
    title: '{RegionName}事业部',
    parent: '/home',
    items: [
        { name: '事业部概览', path: '/sales/{region}/overview' },
        { name: '销售主数据', path: '/sales/{region}/product' },
        { name: '销售目标', path: '/sales/{region}/target' },
        { name: '销量预测', path: '/sales/{region}/forecast' },
        { name: '数据聚合', path: '/sales/{region}/data-aggregation' },
        { name: '滞销分析', path: '/sales/{region}/slow-moving' },
        { name: '计划看板', path: '/sales/{region}/plan-dashboard' },
    ]
}
```

## 销量预测页面说明

最复杂的页面，支持版本管理：
- 草稿 → 已推送计划 → 最终版
- 事业部 + 月份维度
- 历史版本新开标签页查看

参考：`SalesForecastPage.js`

## Mock Key

```
ecommerce:sales:{region}:overview
ecommerce:sales:{region}:products
ecommerce:sales:{region}:targets
ecommerce:sales:{region}:forecasts
ecommerce:sales:{region}:slow-moving
```
