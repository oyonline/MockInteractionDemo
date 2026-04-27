#!/bin/bash

# 修复 OpeningItoDashboardPage.js 中的 ESLint 错误

FILE="src/pages/supply-chain/OpeningItoDashboardPage.js"

# 备份原文件
cp "$FILE" "${FILE}.backup.$(date +%Y%m%d%H%M%S)"

# 使用 sed 进行修复

# Fix 1: 添加 onBuChange 参数 (在第1035行 monthlyTrendData, 后面添加 onBuChange,)
sed -i '' 's/  monthlyTrendData,$/  monthlyTrendData,\n  onBuChange,/' "$FILE"

# Fix 2: 在 "if (!isOpen) return null;" 之前插入变量定义
cat > /tmp/new_code.txt << 'EOF'
  // BU 列表
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

EOF

# 读取新代码内容
NEW_CODE=$(cat /tmp/new_code.txt)

# 使用 awk 插入新代码
awk -v newcode="$NEW_CODE" '
/if \(!isOpen\) return null;/ && !found {
    print newcode
    found = 1
}
{ print }
' "$FILE" > /tmp/fixed_file.js

# 替换原文件
mv /tmp/fixed_file.js "$FILE"

echo "修复完成！"
echo ""
echo "请运行以下命令验证："
echo "  npm start"
