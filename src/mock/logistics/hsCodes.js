/** HS 编码 mock：30~50 条，hsCode 为主键字符串。 */

function ts(dayOffset) {
  const d = new Date();
  d.setDate(d.getDate() - dayOffset);
  return d.toISOString().slice(0, 19).replace('T', ' ');
}

const HS_ENTRIES = [
  { hsCode: '01012100', nameCn: '马', nameEn: 'Horses', importRate: 0, exportRate: 0, vatRate: 9 },
  { hsCode: '01012900', nameCn: '其他马科动物', nameEn: 'Other equine', importRate: 0, exportRate: 0, vatRate: 9 },
  { hsCode: '03011100', nameCn: '观赏鱼', nameEn: 'Ornamental fish', importRate: 10, exportRate: 0, vatRate: 9 },
  { hsCode: '03011900', nameCn: '其他活鱼', nameEn: 'Other live fish', importRate: 10, exportRate: 0, vatRate: 9 },
  { hsCode: '04011000', nameCn: '脂肪含量≤1%未浓缩乳', nameEn: 'Milk, not concentrated', importRate: 15, exportRate: 0, vatRate: 9 },
  { hsCode: '04012000', nameCn: '脂肪含量1%~6%未浓缩乳', nameEn: 'Milk 1-6% fat', importRate: 15, exportRate: 0, vatRate: 9 },
  { hsCode: '07019000', nameCn: '其他鲜或冷藏马铃薯', nameEn: 'Other potatoes fresh', importRate: 13, exportRate: 0, vatRate: 9 },
  { hsCode: '08051000', nameCn: '橙', nameEn: 'Oranges', importRate: 11, exportRate: 0, vatRate: 9 },
  { hsCode: '08052000', nameCn: '柑桔及杂交柑桔', nameEn: 'Mandarins', importRate: 11, exportRate: 0, vatRate: 9 },
  { hsCode: '08105000', nameCn: '猕猴桃', nameEn: 'Kiwi fruit', importRate: 12, exportRate: 0, vatRate: 9 },
  { hsCode: '09012100', nameCn: '未焙炒咖啡', nameEn: 'Coffee not roasted', importRate: 8, exportRate: 0, vatRate: 9 },
  { hsCode: '09012200', nameCn: '已焙炒咖啡', nameEn: 'Coffee roasted', importRate: 15, exportRate: 0, vatRate: 9 },
  { hsCode: '10063021', nameCn: '籼米', nameEn: 'Rice indica', importRate: 65, exportRate: 0, vatRate: 9 },
  { hsCode: '10063029', nameCn: '其他籼米', nameEn: 'Other rice', importRate: 65, exportRate: 0, vatRate: 9 },
  { hsCode: '16010000', nameCn: '肉、杂碎制香肠', nameEn: 'Sausages', importRate: 15, exportRate: 0, vatRate: 9 },
  { hsCode: '17049000', nameCn: '其他糖及糖浆', nameEn: 'Other sugar', importRate: 30, exportRate: 0, vatRate: 9 },
  { hsCode: '18063200', nameCn: '夹心巧克力', nameEn: 'Chocolate filled', importRate: 8, exportRate: 0, vatRate: 9 },
  { hsCode: '19053100', nameCn: '甜饼干', nameEn: 'Sweet biscuits', importRate: 8, exportRate: 0, vatRate: 9 },
  { hsCode: '20079910', nameCn: '烹煮的果酱', nameEn: 'Cooked fruit jam', importRate: 15, exportRate: 0, vatRate: 9 },
  { hsCode: '21069090', nameCn: '其他未列名食品', nameEn: 'Other food preparations', importRate: 15, exportRate: 0, vatRate: 9 },
  { hsCode: '22021000', nameCn: '加味加糖等碳酸饮料', nameEn: 'Carbonated soft drinks', importRate: 30, exportRate: 0, vatRate: 9 },
  { hsCode: '25232100', nameCn: '白水泥', nameEn: 'White cement', importRate: 6, exportRate: 0, vatRate: 13 },
  { hsCode: '27100019', nameCn: '其他车用汽油', nameEn: 'Other motor spirit', importRate: 5, exportRate: 0, vatRate: 13 },
  { hsCode: '27101922', nameCn: '5-7号燃料油', nameEn: 'Fuel oil 5-7', importRate: 6, exportRate: 0, vatRate: 13 },
  { hsCode: '39269099', nameCn: '其他塑料制品', nameEn: 'Other articles of plastic', importRate: 6.5, exportRate: 0, vatRate: 13 },
  { hsCode: '61091000', nameCn: '棉制T恤衫', nameEn: 'Cotton T-shirts', importRate: 16, exportRate: 0, vatRate: 13 },
  { hsCode: '62034200', nameCn: '棉制男裤', nameEn: 'Cotton men trousers', importRate: 16, exportRate: 0, vatRate: 13 },
  { hsCode: '64039900', nameCn: '其他鞋靴', nameEn: 'Other footwear', importRate: 8, exportRate: 0, vatRate: 13 },
  { hsCode: '84713000', nameCn: '便携式计算机', nameEn: 'Portable computers', importRate: 0, exportRate: 0, vatRate: 13 },
  { hsCode: '85171200', nameCn: '带蜂窝网络手机', nameEn: 'Phones with cellular', importRate: 0, exportRate: 0, vatRate: 13 },
  { hsCode: '85176200', nameCn: '接收装置', nameEn: 'Receiving apparatus', importRate: 0, exportRate: 0, vatRate: 13 },
  { hsCode: '85287200', nameCn: '其他彩电', nameEn: 'Other colour TV', importRate: 0, exportRate: 0, vatRate: 13 },
  { hsCode: '85366900', nameCn: '其他电气 plugs', nameEn: 'Other electrical plugs', importRate: 8, exportRate: 0, vatRate: 13 },
  { hsCode: '84717000', nameCn: '硬盘驱动器', nameEn: 'Storage units', importRate: 0, exportRate: 0, vatRate: 13 },
  { hsCode: '84733000', nameCn: '零配件', nameEn: 'Parts of machines', importRate: 0, exportRate: 0, vatRate: 13 },
  { hsCode: '94036099', nameCn: '其他木家具', nameEn: 'Other wooden furniture', importRate: 0, exportRate: 0, vatRate: 13 },
  { hsCode: '95066200', nameCn: '足球', nameEn: 'Football', importRate: 4, exportRate: 0, vatRate: 13 },
  { hsCode: '96081000', nameCn: '圆珠笔', nameEn: 'Ball point pens', importRate: 8, exportRate: 0, vatRate: 13 },
  { hsCode: '96170000', nameCn: '带壳保温瓶', nameEn: 'Vacuum vessels', importRate: 12, exportRate: 0, vatRate: 13 },
  { hsCode: '97011000', nameCn: '油画', nameEn: 'Paintings', importRate: 0, exportRate: 0, vatRate: 13 },
  { hsCode: '99999999', nameCn: '其他未分类', nameEn: 'Other', importRate: 0, exportRate: 0, vatRate: 13 },
];

function getMockHsCodeList() {
  const list = HS_ENTRIES.map((e, i) => {
    const updatedAt = ts(i);
    return {
      ...e,
      notes: i % 4 === 0 ? '需提供产地证' : null,
      status: 'enabled',
      approvalStatus: i % 5 === 0 ? 'draft' : 'approved',
      updatedAt,
    };
  });
  return list;
}

export default getMockHsCodeList;
export { getMockHsCodeList };
