/** 物流类型规则（选渠规则）mock：20~30 条，channels 为已存在 channel.id 集合。 */

function ts(dayOffset) {
  const d = new Date();
  d.setDate(d.getDate() - dayOffset);
  return d.toISOString().slice(0, 19).replace('T', ' ');
}

const ORDER_TYPES = ['直发', '海外仓补货', '平台入仓', '集货转运'];
const LOGISTICS_MODES = ['跨境', '国内', '空运', '海运', '快递'];
const PLATFORMS = ['Amazon', 'eBay', 'Shopee', 'Wish', 'AliExpress'];

function getMockRoutingRuleList(channelList) {
  const channelIds = (channelList || []).map((c) => c.id).filter(Boolean);
  if (channelIds.length === 0) return [];
  const list = [];
  const countriesPool = [['US'], ['DE', 'AT'], ['GB'], ['JP'], ['AU', 'NZ'], ['CN'], ['FR', 'IT'], ['SG', 'MY']];
  for (let i = 1; i <= 25; i++) {
    const id = 'rule_' + String(i).padStart(3, '0');
    const now = ts(i);
    const nCountries = 1 + (i % 3);
    const countries = countriesPool[i % countriesPool.length].slice(0, nCountries);
    const nChannels = Math.min(1 + (i % 4), channelIds.length);
    const channels = channelIds.slice(0, nChannels).map((cid, idx) => ({ channelId: cid, channelPriority: idx }));
    list.push({
      id,
      name: `路由规则-${i}`,
      status: i % 6 === 0 ? 'disabled' : 'enabled',
      approvalStatus: i % 4 === 0 ? 'draft' : i % 4 === 1 ? 'pending' : 'approved',
      weight: 100 - i,
      conditions: {
        countries,
        orderTypes: i % 2 === 0 ? ORDER_TYPES.slice(0, 2) : [],
        logisticsModes: i % 3 === 0 ? LOGISTICS_MODES.slice(0, 2) : [],
        platforms: i % 4 === 0 ? PLATFORMS.slice(0, 1) : [],
        taxIncluded: i % 3 === 0 ? 'true' : i % 3 === 1 ? 'false' : 'any',
      },
      channels,
      updatedAt: now,
      createdAt: now,
    });
  }
  return list;
}

export default getMockRoutingRuleList;
export { getMockRoutingRuleList };
