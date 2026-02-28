/** SKU 申报档案 mock：30~50 条，skuId 主键，hsCode 必须存在于 hsCodes。 */

function ts(dayOffset) {
  const d = new Date();
  d.setDate(d.getDate() - dayOffset);
  return d.toISOString().slice(0, 19).replace('T', ' ');
}

function getMockDeclarationList(hsCodeList) {
  const hsCodes = (hsCodeList || []).map((h) => h.hsCode);
  if (hsCodes.length === 0) return [];
  const list = [];
  const skuNames = [
    '蓝牙耳机', '手机壳', '数据线', '充电宝', '键盘', '鼠标', 'U盘', '移动硬盘',
    '台灯', '加湿器', '电风扇', '保温杯', '收纳盒', '瑜伽垫', '哑铃', '跳绳',
    'T恤', '牛仔裤', '连衣裙', '运动鞋', '背包', '钱包', '手表', '太阳镜',
    '面膜', '洗面奶', '口红', '粉底', '香水', '护手霜', '儿童水杯', '婴儿奶瓶',
    '猫粮', '狗粮', '猫砂', '宠物玩具', '鱼缸', '花盆', '种子', '肥料',
    '螺丝刀', '扳手', '电钻', '胶带', '剪刀', '尺子', '笔记本', '钢笔',
  ];
  const count = Math.min(50, Math.max(30, hsCodes.length * 2));
  for (let i = 1; i <= count; i++) {
    const skuId = 'sku_' + String(i).padStart(3, '0');
    const hsCode = hsCodes[(i - 1) % hsCodes.length];
    const updatedAt = ts(i);
    list.push({
      skuId,
      skuCode: 'SKU' + String(i).padStart(5, '0'),
      skuName: skuNames[(i - 1) % skuNames.length] || `SKU商品${i}`,
      hsCode,
      model: i % 3 === 0 ? `Model-${i}` : null,
      material: i % 2 === 0 ? '塑料' : '金属',
      usage: '民用',
      brand: i % 4 === 0 ? '品牌A' : '品牌B',
      brandType: i % 2 === 0 ? '自有' : '授权',
      gtin: i % 5 === 0 ? '6901234567890' : null,
      cas: null,
      status: i % 7 === 0 ? 'disabled' : 'enabled',
      approvalStatus: i % 4 === 0 ? 'draft' : 'approved',
      updatedAt,
    });
  }
  return list;
}

export default getMockDeclarationList;
export { getMockDeclarationList };
