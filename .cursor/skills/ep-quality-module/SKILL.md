---
name: ep-quality-module
description: Develop quality management module for EPoseidon2.0. Use when creating or modifying quality inbound inspection, customer complaint, quality standards, and QC workflow pages. Covers quality control processes with inspection forms and complaint tracking.
---

# EPoseidon2.0 质量管理模块

## 模块页面清单

| 页面 | Path | 类型 |
|------|------|------|
| 质量概览 | `/quality/overview` | 概览页 |
| 入库质检 | `/quality/inbound` | 工作流 |
| 客诉质量 | `/quality/complaint` | 工作流 |

## 页面类型说明

### 入库质检 (QualityInboundPage)
- 工作流型页面：待质检 → 质检中 → 已完成
- 包含：统计卡片 + Tab切换 + 质检单列表
- 操作：新建质检单、质检通过/驳回

### 客诉质量 (QualityComplaintPage)
- 工作流型页面：待处理 → 处理中 → 已关闭
- 包含：统计卡片 + Tab切换 + 客诉单列表
- 操作：新建客诉、分配处理人、关闭客诉

## 开发清单

```
- [ ] 1. 概览页（统计卡片 + 快捷入口）
- [ ] 2. 入库质检（Tab: pending/in_progress/completed）
- [ ] 3. 客诉质量（Tab: pending/processing/closed）
- [ ] 4. Mock 数据（质检单、客诉单）
- [ ] 5. Service 方法（CRUD + 状态流转）
- [ ] 6. App.js 注册
```

## Mock Key

```
ecommerce:quality:overview       # 统计数据
ecommerce:quality:inbound        # 质检单
ecommerce:quality:complaint      # 客诉单
```

## 质检单字段

```javascript
{
    id,                    // 质检单号
    poId,                  // 采购订单ID
    supplierId,            // 供应商ID
    supplierName,          // 供应商名称
    skuList: [{            // SKU列表
        skuId, skuName, qty, sampleQty, 
        passQty, failQty, result
    }],
    inspectionType,        // 检验类型：全检/抽检/免检
    inspector,             // 质检员
    status,                // pending/in_progress/completed/rejected
    result,                // pass/fail/partial
    createdAt, 
    completedAt,
    remarks
}
```

## 客诉单字段

```javascript
{
    id,                    // 客诉单号
    type,                  // 类型：质量/物流/包装/其他
    source,                // 来源：Amazon/eBay/客服/其他
    orderId,               // 订单号
    skuId,                 // SKU
    customerId,            // 客户ID
    description,           // 问题描述
    priority,              // 紧急程度：high/medium/low
    handler,               // 处理人
    status,                // pending/processing/closed
    solution,              // 解决方案
    createdAt,
    closedAt
}
```

## UI 模式

### Tab 切换

```javascript
const [activeTab, setActiveTab] = useState('pending');

<div className="flex border-b border-gray-200 mb-4">
    {['pending', 'in_progress', 'completed'].map(tab => (
        <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === tab 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
        >
            {tabLabels[tab]}
        </button>
    ))}
</div>
```

### 统计卡片（4列）

```javascript
<div className="grid grid-cols-4 gap-4 p-6">
    <div className="bg-white rounded-lg border p-4">
        <p className="text-sm text-gray-500">待质检</p>
        <p className="text-2xl font-semibold text-blue-600 mt-1">12</p>
    </div>
    {/* ... */}
</div>
```
