#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import re

file_path = 'src/pages/supply-chain/OpeningItoDashboardPage.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix 1: Add onBuChange prop
content = content.replace(
    '  monthlyTrendData,\n}) => {',
    '  monthlyTrendData,\n  onBuChange,\n}) => {'
)

# Fix 2: Add variable definitions before "if (!isOpen) return null;"
new_code = '''  // BU 列表
  const allBus = [
    'Total',
    'KK Amazon',
    'KK Shopify',
    'Tik Tok ACCU',
    'China',
    'EMEA',
    'Outdoor Amazon',
    'Walmart线上',
    'Ebay',
    'Retail',
    '推广&福利',
    'Amazon',
    'Other',
  ];

  // 根据是否含商超过滤BU选项
  const availableBus = includeRetail
    ? allBus
    : allBus.filter((bu) => bu !== 'Retail');

  const [selectedBus, setSelectedBus] = useState(['Total']);

  // 当 availableBus 变化时（比如切换是否含商超），重置选中状态
  useEffect(() => {
    if (!includeRetail && selectedBus.includes('Retail')) {
      setSelectedBus(['Total']);
    }
  }, [includeRetail, selectedBus]);

  // 处理BU选择变化
  const handleBuChange = (bu) => {
    let newSelection;
    if (bu === 'Total') {
      newSelection = selectedBus.includes('Total') ? [] : ['Total'];
    } else {
      if (selectedBus.includes(bu)) {
        newSelection = selectedBus.filter((b) => b !== bu);
        if (newSelection.length === 0) {
          newSelection = ['Total'];
        }
      } else {
        if (selectedBus.includes('Total')) {
          newSelection = [bu];
        } else {
          newSelection = [...selectedBus, bu];
        }
      }
    }
    setSelectedBus(newSelection);
    if (onBuChange) {
      onBuChange(newSelection);
    }
  };

  if (!isOpen) return null;'''

content = content.replace(
    '  if (!isOpen) return null;',
    new_code
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('File fixed successfully!')
