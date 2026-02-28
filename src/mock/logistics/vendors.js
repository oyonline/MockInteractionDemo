/** 物流商 mock：20~30 条，id 可追溯。 */

function ts(dayOffset, h, m) {
  const d = new Date();
  d.setDate(d.getDate() - dayOffset);
  d.setHours(h, m, 0, 0);
  return d.toISOString().slice(0, 19).replace('T', ' ');
}

const NAMES = [
  '顺丰速运', '德邦物流', '京东物流', '中通国际', '圆通速递', '韵达跨境', '菜鸟网络', '递四方',
  '万邑通', '燕文物流', '飞特物流', '云途物流', '纵腾谷仓', '斑马物流', '佳成国际', '百世国际',
  '申通国际', '极兔国际', '递一物流', '华翰物流', '出口易', '跨境翼', '三态速递', '易可达',
  '皇家物流', '通邮科技', '大顺国际', '速达四方', '高翔物流', '飞帆达',
];

function getMockVendorList(vendorCount = 25) {
  const list = [];
  const statuses = ['enabled', 'enabled', 'enabled', 'disabled'];
  const approvalStatuses = ['draft', 'pending', 'approved', 'approved', 'approved', 'rejected'];
  for (let i = 1; i <= Math.min(vendorCount, NAMES.length); i++) {
    const id = 'vendor_' + String(i).padStart(3, '0');
    const name = NAMES[i - 1] || `物流商${i}`;
    const now = ts(i, 10, 0);
    list.push({
      id,
      code: 'V' + String(i).padStart(4, '0'),
      name,
      shortName: name.slice(0, 4),
      status: statuses[i % statuses.length],
      approvalStatus: approvalStatuses[i % approvalStatuses.length],
      contact: {
        name: `联系人${i}`,
        phone: '138' + String(10000000 + i).slice(-8),
        email: `vendor${i}@logistics.com`,
      },
      bankInfo: i % 3 === 0 ? { bankName: '中国银行', account: '62****' + i } : null,
      createdAt: now,
      updatedAt: now,
    });
  }
  return list;
}

export default getMockVendorList;
export { getMockVendorList };
