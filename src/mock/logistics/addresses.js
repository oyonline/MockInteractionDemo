/** 仓库地址 mock：20~50 条。 */

function ts(dayOffset, h, m) {
  const d = new Date();
  d.setDate(d.getDate() - dayOffset);
  d.setHours(h, m, 0, 0);
  return d.toISOString().slice(0, 19).replace('T', ' ');
}

const CITIES = [
  '上海', '深圳', '广州', '宁波', '杭州', '青岛', '天津', '厦门', '东莞', '苏州',
  'Los Angeles', 'New York', 'Hamburg', 'Tokyo', 'Singapore', 'Sydney', 'London',
];
const TYPES = ['warehouse', 'pickup', 'return'];
const BU = ['BU1', 'BU2', 'BU3'];

function getMockAddressList(count = 40) {
  const list = [];
  for (let i = 1; i <= count; i++) {
    const id = 'addr_' + String(i).padStart(3, '0');
    const now = ts(i, 8, i % 60);
    const city = CITIES[i % CITIES.length];
    list.push({
      id,
      type: TYPES[i % TYPES.length],
      platform: i % 3 === 0 ? 'FBA' : i % 3 === 1 ? 'FBM' : null,
      bu: BU[i % BU.length],
      name: `${city}仓-${i}`,
      receiver: `收货人${i}`,
      phone: '139' + String(10000000 + i).slice(-8),
      country: i <= 10 ? 'CN' : i <= 20 ? 'US' : 'DE',
      state: i <= 10 ? '广东' : 'California',
      city,
      postcode: String(100000 + i),
      address: `某某区某某路${i}号`,
      status: i % 7 === 0 ? 'disabled' : 'enabled',
      approvalStatus: i % 5 === 0 ? 'draft' : 'approved',
      createdAt: now,
      updatedAt: now,
    });
  }
  return list;
}

export default getMockAddressList;
export { getMockAddressList };
