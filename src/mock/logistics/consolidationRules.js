/** 集货规则 mock：20~30 条，可引用 vendorId/channelId（可为空）。 */

function ts(dayOffset) {
  const d = new Date();
  d.setDate(d.getDate() - dayOffset);
  return d.toISOString().slice(0, 19).replace('T', ' ');
}

const COUNTRIES = ['US', 'DE', 'GB', 'JP', 'AU', 'SG', 'FR', 'CN'];
const PLATFORMS = ['Amazon', 'eBay', 'Shopee', 'FBA', 'FBM'];

function getMockConsolidationRuleList(vendorList, channelList) {
  const vendorIds = (vendorList || []).map((v) => v.id).filter(Boolean);
  const channelIds = (channelList || []).map((c) => c.id).filter(Boolean);
  const list = [];
  for (let i = 1; i <= 28; i++) {
    const id = 'consol_' + String(i).padStart(3, '0');
    const now = ts(i);
    const country = COUNTRIES[i % COUNTRIES.length];
    list.push({
      id,
      name: `集货规则-${country}-${i}`,
      status: i % 7 === 0 ? 'disabled' : 'enabled',
      approvalStatus: i % 4 === 0 ? 'draft' : i % 4 === 1 ? 'pending' : 'approved',
      weight: 50 - i,
      boundaries: {
        country,
        platform: i % 3 === 0 ? PLATFORMS[i % PLATFORMS.length] : undefined,
        vendorId: vendorIds.length && i % 4 === 0 ? vendorIds[i % vendorIds.length] : undefined,
        channelId: channelIds.length && i % 5 === 0 ? channelIds[i % channelIds.length] : undefined,
        taxIncluded: i % 3 === 0 ? 'true' : i % 3 === 1 ? 'false' : undefined,
      },
      strategy: {
        maxOrdersPerBatch: 30 + (i % 21),
        maxChargeableWeight: i % 4 === 0 ? 500 : undefined,
        cutoffHourLocal: i % 5 === 0 ? 14 : undefined,
      },
      note: i % 6 === 0 ? `备注${i}` : undefined,
      updatedAt: now,
      createdAt: now,
    });
  }
  return list;
}

export default getMockConsolidationRuleList;
export { getMockConsolidationRuleList };
