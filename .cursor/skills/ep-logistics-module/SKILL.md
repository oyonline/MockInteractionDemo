---
name: ep-logistics-module
description: Develop logistics and customs declaration module for EPoseidon2.0. Use when creating or modifying logistics vendors, channels, addresses, HS codes, declarations, routing rules, consolidation rules, trial calculation pages. Covers list pages with filter/table/pagination and detail pages with forms.
---

# EPoseidon2.0 物流与报关模块

## 模块页面清单

| 页面 | Path | 状态 |
|------|------|------|
| 物流概览 | `/logistics/overview` | 已存在 |
| 物流商档案 | `/logistics/vendors` | List + Detail |
| 物流商渠道 | `/logistics/channels` | List + Detail |
| 仓库地址 | `/logistics/addresses` | List + Detail |
| HSCode | `/logistics/hs-codes` | List + Detail |
| 申报资料 | `/logistics/declarations` | List + Detail |
| 物流类型规则 | `/logistics/rules/routing` | List + Detail |
| 集货规则 | `/logistics/rules/consolidation` | List + Detail |
| 备货试算 | `/logistics/trial-calc` | Form |

## 开发清单

```
- [ ] 1. 创建页面文件于 `src/pages/logistics/`
- [ ] 2. 创建 mock 数据于 `src/mock/logistics/`
- [ ] 3. 添加 service 方法于 `src/services/logistics.js`
- [ ] 4. App.js 中 import 并添加 case
- [ ] 5. 测试列表页（筛选+表格+分页）
- [ ] 6. 测试详情页（打开+编辑+保存）
```

## 参考页面

列表页参考：`LogisticsVendorListPage.js`
详情页参考：`LogisticsVendorDetailPage.js`

## Mock Key

```
ecommerce:logistics:vendors
ecommerce:logistics:channels
ecommerce:logistics:addresses
ecommerce:logistics:hscodes
ecommerce:logistics:declarations
ecommerce:logistics:routing-rules
ecommerce:logistics:consolidation-rules
```

## 字段参考

见 [reference.md](reference.md)
