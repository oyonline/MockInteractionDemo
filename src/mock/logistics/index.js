/** 物流与报关 mock 聚合：vendors / channels / addresses / hsCodes / declarations / routingRules / consolidationRules。 */

import getMockVendorList from './vendors';
import getMockChannelList from './channels';
import getMockAddressList from './addresses';
import getMockHsCodeList from './hsCodes';
import getMockDeclarationList from './declarations';
import getMockRoutingRuleList from './routingRules';
import getMockConsolidationRuleList from './consolidationRules';

export { getMockVendorList, getMockChannelList, getMockAddressList, getMockHsCodeList, getMockDeclarationList, getMockRoutingRuleList, getMockConsolidationRuleList };

/**
 * 生成完整物流 mock 数据集，保证 channels.vendorId ∈ vendors.id、declarations.hsCode ∈ hsCodes.hsCode。
 * @param {{ vendorCount?: number, addressCount?: number }} opts
 */
export function generateLogisticsMock(opts = {}) {
  const vendorCount = opts.vendorCount ?? 25;
  const addressCount = opts.addressCount ?? 40;
  const vendors = getMockVendorList(vendorCount);
  const channels = getMockChannelList(vendors);
  const addresses = getMockAddressList(addressCount);
  const hsCodes = getMockHsCodeList();
  const declarations = getMockDeclarationList(hsCodes);
  const routingRules = getMockRoutingRuleList(channels);
  const consolidationRules = getMockConsolidationRuleList(vendors, channels);
  return {
    vendors,
    channels,
    addresses,
    hsCodes,
    declarations,
    routingRules,
    consolidationRules,
  };
}

/** 聚合对象，便于一次性引用。 */
export const logisticsMock = {
  getVendors: getMockVendorList,
  getChannels: getMockChannelList,
  getAddresses: getMockAddressList,
  getHsCodes: getMockHsCodeList,
  getDeclarations: getMockDeclarationList,
  getRoutingRules: getMockRoutingRuleList,
  getConsolidationRules: getMockConsolidationRuleList,
  generate: generateLogisticsMock,
};
