/** 渠道 mock：依赖 vendors，每个 vendor 1~4 条，总量 20~50，channels.vendorId ∈ vendors.id。 */

function ts(dayOffset, h, m) {
  const d = new Date();
  d.setDate(d.getDate() - dayOffset);
  d.setHours(h, m, 0, 0);
  return d.toISOString().slice(0, 19).replace('T', ' ');
}

const COUNTRY_POOL = ['US', 'DE', 'GB', 'JP', 'AU', 'SG', 'FR', 'IT', 'ES', 'NL'];
const PLATFORMS = ['Amazon', 'eBay', 'Shopee', 'Wish', 'AliExpress', 'Lazada', 'FBA', 'FBM'];
const LAST_MILE = ['DDP', 'DDU', 'DPD', 'self'];

function getMockChannelList(vendorList) {
  if (!vendorList || vendorList.length === 0) return [];
  const list = [];
  let seq = 1;
  vendorList.forEach((v, vi) => {
    const n = 1 + (vi % 4);
    for (let j = 0; j < n; j++) {
      const id = 'channel_' + String(seq).padStart(3, '0');
      const now = ts(seq + 10, 9, seq % 60);
      list.push({
        id,
        vendorId: v.id,
        code: 'CH' + String(seq).padStart(4, '0'),
        name: `${v.shortName || v.name}-渠道${j + 1}`,
        countries: COUNTRY_POOL.slice(0, 2 + (seq % 4)),
        platforms: PLATFORMS.slice(0, 1 + (seq % 3)),
        isTaxIncluded: seq % 2 === 0,
        lastMileType: LAST_MILE[seq % LAST_MILE.length],
        status: seq % 5 === 0 ? 'disabled' : 'enabled',
        approvalStatus: seq % 4 === 0 ? 'draft' : seq % 4 === 1 ? 'pending' : 'approved',
        createdAt: now,
        updatedAt: now,
      });
      seq++;
    }
  });
  return list;
}

export default getMockChannelList;
export { getMockChannelList };
