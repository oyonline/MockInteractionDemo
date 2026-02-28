/** 物流与报关 service：基础资料 list/get/create/update/remove + 审批流，内部 mock + localStorage。 */

import * as storage from '../utils/storage';
import {
  LOGISTICS_VENDORS,
  LOGISTICS_CHANNELS,
  LOGISTICS_ADDRESSES,
  LOGISTICS_HS_CODES,
  LOGISTICS_DECLARATIONS,
  LOGISTICS_APPROVAL_RECORDS,
} from '../utils/storageKeys';
import {
  getMockVendorList,
  getMockChannelList,
  getMockAddressList,
  getMockHsCodeList,
  getMockDeclarationList,
} from '../mock/logistics';

const DEMO_OPERATOR = 'DemoUser';

function now() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

function applyListQuery(data, query, searchFields) {
  const { keyword = '', status = '', approvalStatus = '', page = 1, pageSize = 10 } = query;
  let filtered = data.slice();
  const kw = String(keyword).trim().toLowerCase();
  if (kw) {
    filtered = filtered.filter((item) =>
      searchFields.some((f) => {
        const v = item[f];
        return v != null && String(v).toLowerCase().includes(kw);
      })
    );
  }
  if (status) filtered = filtered.filter((item) => item.status === status);
  if (approvalStatus) filtered = filtered.filter((item) => item.approvalStatus === approvalStatus);
  const total = filtered.length;
  const start = (Math.max(1, page) - 1) * Math.max(1, pageSize);
  const list = filtered.slice(start, start + Math.max(1, pageSize));
  return { list, total };
}

function addApprovalRecord(entityType, entityId, action, remark) {
  const records = getApprovalData();
  const recordId = 'rec_' + Date.now();
  records.push({
    recordId,
    entityType,
    entityId,
    action,
    remark: remark || '',
    operator: DEMO_OPERATOR,
    createdAt: now(),
  });
  setApprovalData(records);
}

// ---------- Vendors ----------
function getVendorData() {
  let list = storage.get(LOGISTICS_VENDORS);
  if (list == null || !Array.isArray(list)) {
    const mock = getMockVendorList();
    storage.set(LOGISTICS_VENDORS, mock);
    return mock;
  }
  return list;
}

function setVendorData(list) {
  storage.set(LOGISTICS_VENDORS, list);
}

// ---------- Channels ----------
function getChannelData() {
  let list = storage.get(LOGISTICS_CHANNELS);
  if (list == null || !Array.isArray(list)) {
    const vendors = getVendorData();
    list = getMockChannelList(vendors);
    storage.set(LOGISTICS_CHANNELS, list);
  }
  return list;
}

function setChannelData(list) {
  storage.set(LOGISTICS_CHANNELS, list);
}

// ---------- Addresses ----------
function getAddressData() {
  let list = storage.get(LOGISTICS_ADDRESSES);
  if (list == null || !Array.isArray(list)) {
    list = getMockAddressList();
    storage.set(LOGISTICS_ADDRESSES, list);
  }
  return list;
}

function setAddressData(list) {
  storage.set(LOGISTICS_ADDRESSES, list);
}

// ---------- HS Codes ----------
function getHsCodeData() {
  let list = storage.get(LOGISTICS_HS_CODES);
  if (list == null || !Array.isArray(list)) {
    list = getMockHsCodeList();
    storage.set(LOGISTICS_HS_CODES, list);
  }
  return list;
}

function setHsCodeData(list) {
  storage.set(LOGISTICS_HS_CODES, list);
}

// ---------- Declarations ----------
function getDeclarationData() {
  let list = storage.get(LOGISTICS_DECLARATIONS);
  if (list == null || !Array.isArray(list)) {
    const hsCodes = getHsCodeData();
    list = getMockDeclarationList(hsCodes);
    storage.set(LOGISTICS_DECLARATIONS, list);
  }
  return list;
}

function setDeclarationData(list) {
  storage.set(LOGISTICS_DECLARATIONS, list);
}

// ---------- Approval records ----------
function getApprovalData() {
  let list = storage.get(LOGISTICS_APPROVAL_RECORDS);
  if (list == null || !Array.isArray(list)) {
    list = [];
    storage.set(LOGISTICS_APPROVAL_RECORDS, list);
  }
  return list;
}

function setApprovalData(list) {
  storage.set(LOGISTICS_APPROVAL_RECORDS, list);
}

// ---------- Generic entity helpers ----------
function findIndexById(data, idField, idValue) {
  return data.findIndex((item) => item[idField] === idValue);
}

function makeEntityApi(entityType, getData, setData, idField, searchFields, createId) {
  return {
    list(query = {}) {
      return applyListQuery(getData(), query, searchFields);
    },
    get(id) {
      const data = getData();
      const idx = findIndexById(data, idField, id);
      return idx === -1 ? null : { ...data[idx] };
    },
    create(payload) {
      const data = getData().slice();
      const id = createId ? createId(payload) : (payload[idField] || idField + '_' + Date.now());
      const updatedAt = now();
      const item = { ...payload, [idField]: id, updatedAt };
      if (!item.createdAt) item.createdAt = updatedAt;
      if (item.approvalStatus == null) item.approvalStatus = 'draft';
      if (item.status == null) item.status = 'enabled';
      data.push(item);
      setData(data);
      return item;
    },
    update(id, patch) {
      const data = getData().slice();
      const idx = findIndexById(data, idField, id);
      if (idx === -1) return null;
      const updated = { ...data[idx], ...patch, updatedAt: now() };
      data[idx] = updated;
      setData(data);
      return updated;
    },
    remove(id) {
      const data = getData().filter((item) => item[idField] !== id);
      setData(data);
    },
    submit(id) {
      const data = getData().slice();
      const idx = findIndexById(data, idField, id);
      if (idx === -1) return { ok: false, message: '未找到' };
      const item = data[idx];
      if (item.approvalStatus !== 'draft' && item.approvalStatus !== 'rejected') {
        return { ok: false, message: '当前状态不可提交' };
      }
      data[idx] = { ...item, approvalStatus: 'pending', updatedAt: now() };
      setData(data);
      addApprovalRecord(entityType, id, 'submit', '');
      return { ok: true };
    },
    withdraw(id) {
      const data = getData().slice();
      const idx = findIndexById(data, idField, id);
      if (idx === -1) return { ok: false, message: '未找到' };
      const item = data[idx];
      if (item.approvalStatus !== 'pending') return { ok: false, message: '当前状态不可撤回' };
      data[idx] = { ...item, approvalStatus: 'draft', updatedAt: now() };
      setData(data);
      addApprovalRecord(entityType, id, 'withdraw', '');
      return { ok: true };
    },
    approve(id, remark) {
      const data = getData().slice();
      const idx = findIndexById(data, idField, id);
      if (idx === -1) return { ok: false, message: '未找到' };
      const item = data[idx];
      if (item.approvalStatus !== 'pending') return { ok: false, message: '当前状态不可审批' };
      data[idx] = { ...item, approvalStatus: 'approved', updatedAt: now() };
      setData(data);
      addApprovalRecord(entityType, id, 'approve', remark || '');
      return { ok: true };
    },
    reject(id, remark) {
      const data = getData().slice();
      const idx = findIndexById(data, idField, id);
      if (idx === -1) return { ok: false, message: '未找到' };
      const item = data[idx];
      if (item.approvalStatus !== 'pending') return { ok: false, message: '当前状态不可驳回' };
      data[idx] = { ...item, approvalStatus: 'rejected', updatedAt: now() };
      setData(data);
      addApprovalRecord(entityType, id, 'reject', remark || '');
      return { ok: true };
    },
  };
}

export const logisticsService = {
  vendors: (() => {
    const api = makeEntityApi(
      'vendor',
      getVendorData,
      setVendorData,
      'id',
      ['code', 'name', 'shortName'],
      () => 'vendor_' + Date.now()
    );
    const origRemove = api.remove;
    api.remove = (id) => {
      const channels = getChannelData().filter((c) => c.vendorId === id);
      if (channels.length > 0) {
        return { ok: false, message: '存在关联渠道' };
      }
      origRemove(id);
      return { ok: true };
    };
    return api;
  })(),

  channels: makeEntityApi(
    'channel',
    getChannelData,
    setChannelData,
    'id',
    ['code', 'name', 'vendorId'],
    () => 'channel_' + Date.now()
  ),

  addresses: makeEntityApi(
    'address',
    getAddressData,
    setAddressData,
    'id',
    ['name', 'receiver', 'city', 'country', 'address'],
    () => 'addr_' + Date.now()
  ),

  hsCodes: (() => {
    const api = makeEntityApi(
      'hsCode',
      getHsCodeData,
      setHsCodeData,
      'hsCode',
      ['hsCode', 'nameCn', 'nameEn'],
      (p) => p.hsCode || 'hs_' + Date.now()
    );
    const origRemove = api.remove;
    api.remove = (id) => {
      const decls = getDeclarationData().filter((d) => d.hsCode === id);
      if (decls.length > 0) {
        return { ok: false, message: '存在关联SKU申报档案' };
      }
      origRemove(id);
      return { ok: true };
    };
    return api;
  })(),

  declarations: makeEntityApi(
    'declaration',
    getDeclarationData,
    setDeclarationData,
    'skuId',
    ['skuCode', 'skuName', 'hsCode'],
    (p) => p.skuId || 'sku_' + Date.now()
  ),

  approvals: {
    listByEntity(entityType, entityId) {
      const records = getApprovalData();
      return records
        .filter((r) => r.entityType === entityType && r.entityId === entityId)
        .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    },
  },
};

/*
 * 自测用例（浏览器 console）：
 * 1) 先在任意页或 App 里临时挂到 window 以便 console 调用，例如在控制台执行：
 *    require 不可用时可在一页组件内：import { logisticsService } from '../services'; window.logisticsService = logisticsService;
 *
 * 2) vendors.list / get / create / submit / approve：
 *    logisticsService.vendors.list({ page: 1, pageSize: 5 })   // => { list, total }
 *    logisticsService.vendors.get('vendor_001')                 // => 单条或 null
 *    const v = logisticsService.vendors.create({ code: 'VNEW', name: '新物流商', status: 'enabled' })
 *    logisticsService.vendors.submit(v.id)                     // => { ok: true }
 *    logisticsService.vendors.approve(v.id, '通过')             // => { ok: true }
 *
 * 3) approvals.listByEntity：
 *    logisticsService.approvals.listByEntity('vendor', v.id)    // => 审批记录数组，按时间倒序
 *
 * 4) 删除一致性校验：
 *    logisticsService.vendors.remove('vendor_001')   // 若有关联渠道 => { ok: false, message: '存在关联渠道' }
 *    logisticsService.hsCodes.remove('01012100')     // 若有关联申报 => { ok: false, message: '存在关联SKU申报档案' }
 */
