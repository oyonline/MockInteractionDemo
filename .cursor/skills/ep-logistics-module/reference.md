# 物流模块字段参考

## 物流商档案 (Vendor)
- code, name, type(空运/海运/快递), country, contact, phone, email, address, status

## 物流商渠道 (Channel)
- code, name, vendorId, vendorName, destination, transitTime, price, status

## 仓库地址 (Address)
- code, name, type(发货仓/退货仓), country, province, city, address, contact, phone, status

## HSCode
- code, name, category, dutyRate, description, status

## 申报资料 (Declaration)
- code, productName, hsCode, material, usage, declaredValue, status

## 物流类型规则 (Routing Rule)
- code, name, fromCountry, toCountry, weightRange, priority, channelIds, status

## 集货规则 (Consolidation Rule)
- code, name, warehouseId, destination, maxWeight, channels, status
