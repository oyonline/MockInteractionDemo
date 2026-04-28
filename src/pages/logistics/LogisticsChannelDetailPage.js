/**
 * 渠道详情页（SaaS 业务编辑）：draft 编辑 + 整页 Save/Cancel，7 个业务 Tab，内联表格编辑。
 * 不修改 services/mock/storageKeys；仅 channels.get/update 写入 channel 对象。
 */

import React, { useState, useEffect, useCallback } from 'react';
import { logisticsService } from '../../services';
import { toast } from '../../components/ui/Toast';

const APPROVAL_LABEL = { draft: '草稿', pending: '待审批', approved: '已通过', rejected: '已驳回' };

const CHANNEL_TABS = [
  { key: 'rateRules', label: '运费规则' },
  { key: 'customs', label: '清关资料倍数' },
  { key: 'productSurcharges', label: '产品附加费' },
  { key: 'attributes', label: '物流属性信息' },
  { key: 'packagingLimit', label: '包装限制附加费' },
  { key: 'otherFees', label: '其他费用' },
  { key: 'approval', label: '审批信息' },
];

const DEFAULT_TIER_WEIGHTS = [12, 45, 71, 101];
const OTHER_FEE_TYPES = ['报关费', '清关费', '操作费', '其他'];

const ATTRIBUTE_GROUPS = [
  { group: '产品基础属性', items: [
    { key: 'general', label: '普货类' },
    { key: 'textile', label: '纺织品' },
    { key: 'specified_with_battery', label: '指定属性产品含电池以及马达' },
    { key: 'glasses', label: '眼镜产品' },
  ]},
  { group: '眼镜子项', items: [
    { key: 'glasses_prescription', label: '带度数眼镜' },
    { key: 'glasses_photochromic', label: '是否变色' },
  ]},
  { group: '产品电池属性', items: [
    { key: 'no_battery', label: '无电池' },
    { key: 'built_in_battery', label: '内置电池' },
    { key: 'external_battery', label: '配套电池' },
    { key: 'button_battery', label: '纽扣电池' },
  ]},
  { group: '产品违禁属性', items: [
    { key: 'controlled_knife', label: '管制刀具' },
  ]},
  { group: '产品形态属性', items: [
    { key: 'liquid', label: '液体产品' },
    { key: 'powder', label: '粉末产品' },
    { key: 'magnetic', label: '磁性产品' },
    { key: 'fragile', label: '易碎品' },
  ]},
];

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function deepClone(obj) {
  if (obj == null) return obj;
  return JSON.parse(JSON.stringify(obj));
}

function buildDefaultDraft(record) {
  if (!record) return null;
  const r = deepClone(record);
  r.rateRules = Array.isArray(r.rateRules) ? r.rateRules : [];
  r.rateRules.forEach((rr) => {
    rr.tiers = Array.isArray(rr.tiers) ? rr.tiers : [{ id: 't_' + Date.now(), weightGeKg: 12, unit: 'KG', price: '', currency: 'CNY' }];
    rr.tiers.forEach((t) => { t.unit = t.unit || 'KG'; t.currency = t.currency || 'CNY'; });
  });
  r.customsMultiplier = r.customsMultiplier && typeof r.customsMultiplier === 'object'
    ? r.customsMultiplier
    : { multiplier: 1.0, effectiveDate: todayStr() };
  if (r.customsMultiplier.multiplier == null) r.customsMultiplier.multiplier = 1.0;
  if (!r.customsMultiplier.effectiveDate) r.customsMultiplier.effectiveDate = todayStr();

  r.productSurcharges = Array.isArray(r.productSurcharges) ? r.productSurcharges : [];
  r.skuConstraints = r.skuConstraints && typeof r.skuConstraints === 'object'
    ? r.skuConstraints
    : { includeSkuIds: [], excludeSkuIds: [] };
  if (!Array.isArray(r.skuConstraints.includeSkuIds)) r.skuConstraints.includeSkuIds = [];
  if (!Array.isArray(r.skuConstraints.excludeSkuIds)) r.skuConstraints.excludeSkuIds = [];

  r.attributesSelected = r.attributesSelected && typeof r.attributesSelected === 'object' ? r.attributesSelected : {};
  r.packagingLimitFees = r.packagingLimitFees && typeof r.packagingLimitFees === 'object' ? r.packagingLimitFees : {};
  ['weight', 'longestSide', 'secondLongestSide', 'girth'].forEach((k) => {
    r.packagingLimitFees[k] = Array.isArray(r.packagingLimitFees[k]) ? r.packagingLimitFees[k] : [];
  });
  r.otherFees = Array.isArray(r.otherFees) ? r.otherFees : [];

  r.name = r.name ?? '';
  if (typeof r.countries === 'string') r.countries = r.countries.split(/[,，\s]+/).map((s) => s.trim()).filter(Boolean);
  else r.countries = Array.isArray(r.countries) ? r.countries : [];
  r.platforms = Array.isArray(r.platforms) ? r.platforms : (typeof r.platforms === 'string' ? r.platforms.split(/[,，\s]+/).map((s) => s.trim()).filter(Boolean) : []);
  r.orderTypes = Array.isArray(r.orderTypes) ? r.orderTypes : (typeof r.orderTypes === 'string' ? r.orderTypes.split(/[,，\s]+/).map((s) => s.trim()).filter(Boolean) : []);
  return r;
}

function LogisticsChannelDetailPage({ tab }) {
  const pathPart = (tab?.path || '').split('/').pop();
  const id = tab?.data?.id ?? (pathPart ? decodeURIComponent(pathPart) : '');
  const [record, setRecord] = useState(null);
  const [draft, setDraft] = useState(null);
  const [activeTab, setActiveTab] = useState('rateRules');
  const [approvalRecords, setApprovalRecords] = useState([]);
  const [showRemarkModal, setShowRemarkModal] = useState(false);
  const [remarkAction, setRemarkAction] = useState(null);
  const [remarkText, setRemarkText] = useState('');
  const [declarationList, setDeclarationList] = useState([]);

  const loadRecord = useCallback(() => {
    if (!id) return;
    const r = logisticsService.channels.get(id);
    setRecord(r);
    setDraft(r ? buildDefaultDraft(r) : null);
    if (r) setApprovalRecords(logisticsService.approvals.listByEntity('channel', id));
    const decl = logisticsService.declarations.list({ page: 1, pageSize: 999 });
    setDeclarationList(decl.list || []);
  }, [id]);

  useEffect(() => {
    loadRecord();
  }, [loadRecord]);

  const handleSave = () => {
    if (!id || !draft) return;
    if (!draft.name || !String(draft.name).trim()) { toast.warning('渠道名称不能为空'); return; }
    const countries = Array.isArray(draft.countries) ? draft.countries : [];
    if (countries.length === 0) { toast.warning('支持国家至少填 1 个'); return; }
    const rateRules = draft.rateRules || [];
    for (let i = 0; i < rateRules.length; i++) {
      if (!rateRules[i].effectiveDate) { toast.warning(`运费规则第 ${i + 1} 条生效日期必填`); return; }
    }
    const patch = deepClone(draft);
    delete patch.id;
    delete patch.code;
    delete patch.vendorId;
    delete patch.updatedAt;
    delete patch.approvalStatus;
    logisticsService.channels.update(id, patch);
    toast.success('保存成功');
    loadRecord();
  };

  const handleCancel = () => {
    if (!record) return;
    setDraft(buildDefaultDraft(record));
    toast.info('已撤销修改');
  };

  const handleSubmit = () => {
    const res = logisticsService.channels.submit(id);
    if (res && res.ok === false) toast.error(res.message || '提交失败');
    else loadRecord();
  };

  const handleWithdraw = () => {
    const res = logisticsService.channels.withdraw(id);
    if (res && res.ok === false) toast.error(res.message || '撤回失败');
    else loadRecord();
  };

  const openRemark = (action) => { setRemarkAction(action); setRemarkText(''); setShowRemarkModal(true); };

  const submitRemark = () => {
    if (remarkAction === 'approve') { const res = logisticsService.channels.approve(id, remarkText); if (res && res.ok === false) toast.error(res.message); }
    else if (remarkAction === 'reject') { const res = logisticsService.channels.reject(id, remarkText); if (res && res.ok === false) toast.error(res.message); }
    setShowRemarkModal(false);
    loadRecord();
  };

  if (!id) return <div className="p-6 text-gray-500">缺少 id</div>;
  if (record === null || draft === null) return <div className="p-6"><p className="text-gray-500 mb-4">未找到该渠道</p><p className="text-sm text-gray-400">请从列表页重新打开或切换其他 Tab。</p></div>;

  const canSubmit = record.approvalStatus === 'draft' || record.approvalStatus === 'rejected';
  const canWithdraw = record.approvalStatus === 'pending';
  const canApproveReject = record.approvalStatus === 'pending';
  const vendorName = record.vendorId ? (logisticsService.vendors.get(record.vendorId)?.name || '-') : '-';

  const setDraftBase = (key, value) => setDraft((d) => ({ ...d, [key]: value }));

  return (
    <div className="flex flex-col h-full min-h-0 p-6">
      {/* 顶部固定：标题 + badge + 保存/取消 */}
      <div className="flex-shrink-0 flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-800">渠道详情</h1>
          <p className="text-sm text-gray-500 mt-0.5">{[draft.code, draft.name].filter(Boolean).join(' / ') || '-'}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-2 py-0.5 rounded text-xs ${draft.status === 'enabled' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{draft.status === 'enabled' ? '启用' : '禁用'}</span>
          <span className={`px-2 py-0.5 rounded text-xs ${record.approvalStatus === 'approved' ? 'bg-green-100 text-green-700' : record.approvalStatus === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>{APPROVAL_LABEL[record.approvalStatus] || record.approvalStatus}</span>
          <button type="button" onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">保存</button>
          <button type="button" onClick={handleCancel} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">取消</button>
        </div>
      </div>

      {/* 基本信息区（Tabs 之上） */}
      <div className="flex-shrink-0 bg-white rounded-lg border border-gray-200 p-6 mb-4">
        <h2 className="text-base font-medium text-gray-800 mb-4 border-l-4 border-blue-600 pl-2">基本信息</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div><label className="block text-gray-600 mb-1">物流商</label><input type="text" value={`${vendorName} (${draft.vendorId || '-'})`} readOnly className="w-full border border-gray-200 rounded px-3 py-2 bg-gray-50" /></div>
          <div><label className="block text-gray-600 mb-1">渠道名称 *</label><input type="text" value={draft.name || ''} onChange={(e) => setDraftBase('name', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2" /></div>
          <div><label className="block text-gray-600 mb-1">产品名称</label><input type="text" value={draft.productName || ''} onChange={(e) => setDraftBase('productName', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2" /></div>
          <div><label className="block text-gray-600 mb-1">物流方式</label><input type="text" value={draft.logisticsMethod || ''} onChange={(e) => setDraftBase('logisticsMethod', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2" /></div>
          <div><label className="block text-gray-600 mb-1">尾程运输方式</label><input type="text" value={draft.lastMileMethod || ''} onChange={(e) => setDraftBase('lastMileMethod', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2" /></div>
          <div><label className="block text-gray-600 mb-1">计费类型</label><input type="text" value={draft.billingType || ''} onChange={(e) => setDraftBase('billingType', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2" placeholder="如 KG6" /></div>
          <div><label className="block text-gray-600 mb-1">计费方式</label><input type="text" value={draft.pricingMethod || ''} onChange={(e) => setDraftBase('pricingMethod', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2" /></div>
          <div className="col-span-2"><label className="block text-gray-600 mb-1">支持国家 *（逗号分隔）</label><textarea value={(draft.countries || []).join(', ')} onChange={(e) => setDraftBase('countries', e.target.value.split(/[,，\s]+/).map((s) => s.trim()).filter(Boolean))} rows={2} className="w-full border border-gray-300 rounded px-3 py-2" placeholder="US, DE, GB" /></div>
          <div><label className="block text-gray-600 mb-1">支持平台（逗号分隔）</label><textarea value={(draft.platforms || []).join(', ')} onChange={(e) => setDraftBase('platforms', e.target.value.split(/[,，\s]+/).map((s) => s.trim()).filter(Boolean))} rows={1} className="w-full border border-gray-300 rounded px-3 py-2" /></div>
          <div><label className="block text-gray-600 mb-1">订单类型（逗号分隔）</label><input type="text" value={(draft.orderTypes || []).join(', ')} onChange={(e) => setDraftBase('orderTypes', e.target.value.split(/[,，\s]+/).map((s) => s.trim()).filter(Boolean))} className="w-full border border-gray-300 rounded px-3 py-2" /></div>
          <div><label className="block text-gray-600 mb-1">是否包税</label><select value={draft.isTaxIncluded === true ? 'true' : draft.isTaxIncluded === false ? 'false' : 'any'} onChange={(e) => setDraftBase('isTaxIncluded', e.target.value === 'any' ? undefined : e.target.value === 'true')} className="w-full border border-gray-300 rounded px-3 py-2"><option value="any">任意</option><option value="true">是</option><option value="false">否</option></select></div>
          <div><label className="block text-gray-600 mb-1">物流类型</label><input type="text" value={draft.logisticsType || ''} onChange={(e) => setDraftBase('logisticsType', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2" placeholder="如 普货订单" /></div>
          <div><label className="block text-gray-600 mb-1">是否平台渠道</label><select value={draft.isPlatformChannel ? 'true' : 'false'} onChange={(e) => setDraftBase('isPlatformChannel', e.target.value === 'true')} className="w-full border border-gray-300 rounded px-3 py-2"><option value="false">否</option><option value="true">是</option></select></div>
          <div><label className="block text-gray-600 mb-1">物流时效(天)</label><input type="number" value={draft.timeLimitDays ?? ''} onChange={(e) => setDraftBase('timeLimitDays', e.target.value === '' ? undefined : Number(e.target.value))} className="w-full border border-gray-300 rounded px-3 py-2" /></div>
          <div><label className="block text-gray-600 mb-1">单票最低计费重(kg)</label><input type="number" value={draft.minChargeableWeightPerOrder ?? ''} onChange={(e) => setDraftBase('minChargeableWeightPerOrder', e.target.value === '' ? undefined : Number(e.target.value))} className="w-full border border-gray-300 rounded px-3 py-2" /></div>
          <div><label className="block text-gray-600 mb-1">单箱最低计费重(kg)</label><input type="number" value={draft.minChargeableWeightPerBox ?? ''} onChange={(e) => setDraftBase('minChargeableWeightPerBox', e.target.value === '' ? undefined : Number(e.target.value))} className="w-full border border-gray-300 rounded px-3 py-2" /></div>
          <div><label className="block text-gray-600 mb-1">第三方渠道CODE</label><input type="text" value={draft.thirdPartyChannelCode || ''} onChange={(e) => setDraftBase('thirdPartyChannelCode', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2" /></div>
          <div><label className="block text-gray-600 mb-1">是否参与推荐</label><select value={draft.isRecommended ? 'true' : 'false'} onChange={(e) => setDraftBase('isRecommended', e.target.value === 'true')} className="w-full border border-gray-300 rounded px-3 py-2"><option value="false">否</option><option value="true">是</option></select></div>
          <div className="col-span-2"><label className="block text-gray-600 mb-1">备注</label><textarea value={draft.remark || ''} onChange={(e) => setDraftBase('remark', e.target.value)} rows={2} className="w-full border border-gray-300 rounded px-3 py-2" /></div>
          <div><label className="block text-gray-600 mb-1">状态</label><select value={draft.status || 'enabled'} onChange={(e) => setDraftBase('status', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2"><option value="enabled">启用</option><option value="disabled">禁用</option></select></div>
        </div>
      </div>

      {/* Tab 按钮 */}
      <div className="flex-shrink-0 flex gap-1 border-b border-gray-200 mb-4 overflow-x-auto">
        {CHANNEL_TABS.map((t) => (
          <button key={t.key} type="button" onClick={() => setActiveTab(t.key)} className={`px-4 py-2 text-sm font-medium rounded-t-lg border border-b-0 -mb-px flex-shrink-0 ${activeTab === t.key ? 'bg-white border-gray-200 text-blue-600' : 'border-transparent text-gray-600 hover:bg-gray-50'}`}>{t.label}</button>
        ))}
      </div>

      {/* Tab 内容区（可滚动） */}
      <div className="flex-1 min-h-0 overflow-auto">
        {activeTab === 'rateRules' && renderRateRulesTab(draft, setDraft)}
        {activeTab === 'customs' && renderCustomsTab(draft, setDraft)}
        {activeTab === 'productSurcharges' && renderProductSurchargesTab(draft, setDraft)}
        {activeTab === 'attributes' && renderAttributesTab(draft, setDraft, declarationList)}
        {activeTab === 'packagingLimit' && renderPackagingLimitTab(draft, setDraft)}
        {activeTab === 'otherFees' && renderOtherFeesTab(draft, setDraft)}
        {activeTab === 'approval' && (
          <>
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h2 className="text-base font-medium text-gray-800 mb-4 border-l-4 border-amber-500 pl-2">审批操作</h2>
              <p className="text-sm text-gray-600 mb-3">当前状态：<span className="font-medium">{APPROVAL_LABEL[record.approvalStatus] || record.approvalStatus}</span></p>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={handleSubmit} disabled={!canSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">提交审批</button>
                <button type="button" onClick={handleWithdraw} disabled={!canWithdraw} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50">撤回</button>
                <button type="button" onClick={() => openRemark('approve')} disabled={!canApproveReject} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-50">审核通过</button>
                <button type="button" onClick={() => openRemark('reject')} disabled={!canApproveReject} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:opacity-50">驳回</button>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-base font-medium text-gray-800 mb-4 border-l-4 border-gray-400 pl-2">审批记录</h2>
              <table className="w-full text-sm min-w-[600px]">
                <thead><tr className="border-b bg-gray-50"><th className="px-3 py-2 text-left font-medium text-gray-600">时间</th><th className="px-3 py-2 text-left font-medium text-gray-600">动作</th><th className="px-3 py-2 text-left font-medium text-gray-600">操作人</th><th className="px-3 py-2 text-left font-medium text-gray-600">备注</th></tr></thead>
                <tbody>
                  {approvalRecords.length === 0 ? <tr><td colSpan={4} className="px-3 py-4 text-gray-500 text-center">暂无审批记录</td></tr> : approvalRecords.map((r, idx) => (
                    <tr key={r.recordId || idx} className="border-b">
                      <td className="px-3 py-2">{r.createdAt || '-'}</td>
                      <td className="px-3 py-2">{r.action === 'submit' ? '提交' : r.action === 'withdraw' ? '撤回' : r.action === 'approve' ? '通过' : r.action === 'reject' ? '驳回' : r.action}</td>
                      <td className="px-3 py-2">{r.operator || '-'}</td>
                      <td className="px-3 py-2">{r.remark || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {showRemarkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowRemarkModal(false)} aria-hidden />
          <div className="relative bg-white rounded-lg shadow-xl w-[400px] p-6">
            <h2 className="text-lg font-semibold mb-3">{remarkAction === 'approve' ? '审核通过' : '驳回'} - 备注</h2>
            <textarea value={remarkText} onChange={(e) => setRemarkText(e.target.value)} rows={3} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" placeholder="选填" />
            <div className="flex justify-end gap-2 mt-4">
              <button type="button" onClick={() => setShowRemarkModal(false)} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">取消</button>
              <button type="button" onClick={submitRemark} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">确定</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Tab 渲染：运费规则（内联表格 + tiers） ----------
function renderRateRulesTab(draft, setDraft) {
  const rateRules = draft.rateRules || [];

  const addRow = () => {
    const tiers = DEFAULT_TIER_WEIGHTS.map((w, i) => ({ id: 't_' + Date.now() + '_' + i, weightGeKg: w, unit: 'KG', price: '', currency: 'CNY' }));
    setDraft((d) => ({ ...d, rateRules: [...(d.rateRules || []), { id: 'rr_' + Date.now(), serviceRegion: '', servicePostcode: '', effectiveDate: todayStr(), tiers }] }));
  };

  const removeRow = (idx) => {
    setDraft((d) => ({ ...d, rateRules: d.rateRules.filter((_, i) => i !== idx) }));
  };

  const updateRow = (idx, field, value) => {
    setDraft((d) => {
      const next = JSON.parse(JSON.stringify(d));
      next.rateRules[idx] = { ...next.rateRules[idx], [field]: value };
      return next;
    });
  };

  const updateTier = (rrIdx, tierIdx, field, value) => {
    setDraft((d) => {
      const next = JSON.parse(JSON.stringify(d));
      next.rateRules[rrIdx].tiers[tierIdx] = { ...next.rateRules[rrIdx].tiers[tierIdx], [field]: value };
      return next;
    });
  };

  const addTier = (rrIdx) => {
    setDraft((d) => {
      const next = JSON.parse(JSON.stringify(d));
      const tiers = next.rateRules[rrIdx].tiers || [];
      const lastW = tiers.length ? (tiers[tiers.length - 1].weightGeKg ?? 0) : 101;
      tiers.push({ id: 't_' + Date.now(), weightGeKg: lastW + 30, unit: 'KG', price: '', currency: 'CNY' });
      next.rateRules[rrIdx].tiers = tiers;
      return next;
    });
  };

  const removeTier = (rrIdx, tierIdx) => {
    setDraft((d) => {
      const next = JSON.parse(JSON.stringify(d));
      const tiers = next.rateRules[rrIdx].tiers.filter((_, i) => i !== tierIdx);
      next.rateRules[rrIdx].tiers = tiers.length ? tiers : [{ id: 't_' + Date.now(), weightGeKg: 12, unit: 'KG', price: '', currency: 'CNY' }];
      return next;
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-medium text-gray-800 border-l-4 border-blue-600 pl-2">运费规则</h2>
        <button type="button" onClick={addRow} className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">新增行</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead className="bg-gray-50 sticky top-0">
            <tr className="border-b">
              <th className="px-3 py-2 text-left font-medium text-gray-600">服务地区 *</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600">服务邮编 *</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600">重量范围 / 费用</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600">生效日期 *</th>
              <th className="px-3 py-2 text-right font-medium text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody>
            {rateRules.length === 0 ? (
              <tr><td colSpan={5} className="px-3 py-4 text-gray-500 text-center">暂无规则，点击「新增行」添加</td></tr>
            ) : (
              rateRules.map((rr, rrIdx) => (
                <tr key={rr.id} className="border-b align-top">
                  <td className="px-3 py-2"><input type="text" value={rr.serviceRegion || ''} onChange={(e) => updateRow(rrIdx, 'serviceRegion', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1 text-sm" placeholder="服务地区" /></td>
                  <td className="px-3 py-2"><input type="text" value={rr.servicePostcode || ''} onChange={(e) => updateRow(rrIdx, 'servicePostcode', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1 text-sm" placeholder="如 8.9 / 0.1.2.3" /></td>
                  <td className="px-3 py-2">
                    <div className="space-y-1">
                      {(rr.tiers || []).map((t, ti) => (
                        <div key={t.id} className="flex items-center gap-2 flex-wrap">
                          <span className="text-gray-500">≥</span>
                          <input type="number" value={t.weightGeKg ?? ''} onChange={(e) => updateTier(rrIdx, ti, 'weightGeKg', e.target.value === '' ? '' : Number(e.target.value))} className="w-16 border border-gray-300 rounded px-2 py-1 text-sm" />
                          <span className="text-gray-500">KG</span>
                          <input type="number" value={t.price ?? ''} onChange={(e) => updateTier(rrIdx, ti, 'price', e.target.value === '' ? '' : Number(e.target.value))} className="w-20 border border-gray-300 rounded px-2 py-1 text-sm" placeholder="价格" />
                          <span className="text-gray-500">CNY</span>
                          <button type="button" onClick={() => removeTier(rrIdx, ti)} className="text-red-600 hover:underline text-xs">-</button>
                        </div>
                      ))}
                      <button type="button" onClick={() => addTier(rrIdx)} className="text-blue-600 text-xs">+ 增加档位</button>
                    </div>
                  </td>
                  <td className="px-3 py-2"><input type="date" value={rr.effectiveDate || ''} onChange={(e) => updateRow(rrIdx, 'effectiveDate', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1 text-sm" /></td>
                  <td className="px-3 py-2 text-right"><button type="button" onClick={() => removeRow(rrIdx)} className="text-red-600 text-sm">移除</button></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------- 清关资料倍数 ----------
function renderCustomsTab(draft, setDraft) {
  const cm = draft.customsMultiplier || { multiplier: 1.0, effectiveDate: todayStr() };
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-base font-medium text-gray-800 mb-4 border-l-4 border-blue-600 pl-2">清关资料倍数</h2>
      <div className="grid grid-cols-2 gap-4 max-w-md">
        <div><label className="block text-sm text-gray-600 mb-1">倍数</label><input type="number" step="0.1" value={cm.multiplier ?? 1} onChange={(e) => setDraft((d) => ({ ...d, customsMultiplier: { ...(d.customsMultiplier || {}), multiplier: Number(e.target.value) || 0 } }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" /></div>
        <div><label className="block text-sm text-gray-600 mb-1">生效日期</label><input type="date" value={cm.effectiveDate || ''} onChange={(e) => setDraft((d) => ({ ...d, customsMultiplier: { ...(d.customsMultiplier || {}), effectiveDate: e.target.value } }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" /></div>
      </div>
    </div>
  );
}

// ---------- 产品附加费 ----------
function renderProductSurchargesTab(draft, setDraft) {
  const list = draft.productSurcharges || [];

  const addRow = () => setDraft((d) => ({ ...d, productSurcharges: [...(d.productSurcharges || []), { id: 'ps_' + Date.now(), secondLevelAttr: '', fee: '', currency: 'CNY', unit: 'KG', effectiveDate: todayStr() }] }));
  const removeRow = (idx) => setDraft((d) => ({ ...d, productSurcharges: d.productSurcharges.filter((_, i) => i !== idx) }));
  const updateRow = (idx, field, value) => {
    setDraft((d) => {
      const next = JSON.parse(JSON.stringify(d));
      next.productSurcharges[idx][field] = value;
      return next;
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-medium text-gray-800 border-l-4 border-blue-600 pl-2">产品附加费</h2>
        <div className="flex gap-2">
          <button type="button" onClick={addRow} className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">新增行</button>
          <button type="button" onClick={() => toast.info('演示功能：批量导入将在 V2 支持')} className="px-3 py-1.5 border border-gray-300 rounded text-sm hover:bg-gray-50">批量导入</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-gray-50"><tr className="border-b"><th className="px-3 py-2 text-left font-medium text-gray-600">物流二级属性 *</th><th className="px-3 py-2 text-left font-medium text-gray-600">费用 *</th><th className="px-3 py-2 text-left font-medium text-gray-600">货币</th><th className="px-3 py-2 text-left font-medium text-gray-600">计费单位</th><th className="px-3 py-2 text-left font-medium text-gray-600">生效日期 *</th><th className="px-3 py-2 text-right font-medium text-gray-600">操作</th></tr></thead>
          <tbody>
            {list.length === 0 ? <tr><td colSpan={6} className="px-3 py-4 text-gray-500 text-center">暂无，点击「新增行」</td></tr> : list.map((row, idx) => (
              <tr key={row.id} className="border-b">
                <td className="px-3 py-2"><input type="text" value={row.secondLevelAttr || ''} onChange={(e) => updateRow(idx, 'secondLevelAttr', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1 text-sm" /></td>
                <td className="px-3 py-2"><input type="number" value={row.fee ?? ''} onChange={(e) => updateRow(idx, 'fee', e.target.value === '' ? '' : Number(e.target.value))} className="w-24 border border-gray-300 rounded px-2 py-1 text-sm" /></td>
                <td className="px-3 py-2"><select value={row.currency || 'CNY'} onChange={(e) => updateRow(idx, 'currency', e.target.value)} className="border border-gray-300 rounded px-2 py-1 text-sm"><option value="CNY">CNY</option></select></td>
                <td className="px-3 py-2"><select value={row.unit || 'KG'} onChange={(e) => updateRow(idx, 'unit', e.target.value)} className="border border-gray-300 rounded px-2 py-1 text-sm"><option value="KG">KG</option></select></td>
                <td className="px-3 py-2"><input type="date" value={row.effectiveDate || ''} onChange={(e) => updateRow(idx, 'effectiveDate', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1 text-sm" /></td>
                <td className="px-3 py-2 text-right"><button type="button" onClick={() => removeRow(idx)} className="text-red-600 text-sm">移除</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------- 物流属性信息（SKU 约束 + 属性矩阵） ----------
function renderAttributesTab(draft, setDraft, declarationList) {
  const sc = draft.skuConstraints || { includeSkuIds: [], excludeSkuIds: [] };
  const selected = draft.attributesSelected || {};

  const addInclude = (skuId) => { if (!skuId || sc.includeSkuIds.includes(skuId)) return; setDraft((d) => ({ ...d, skuConstraints: { ...d.skuConstraints, includeSkuIds: [...(d.skuConstraints.includeSkuIds || []), skuId] } })); };
  const removeInclude = (skuId) => setDraft((d) => ({ ...d, skuConstraints: { ...d.skuConstraints, includeSkuIds: (d.skuConstraints.includeSkuIds || []).filter((id) => id !== skuId) } }));
  const addExclude = (skuId) => { if (!skuId || sc.excludeSkuIds.includes(skuId)) return; setDraft((d) => ({ ...d, skuConstraints: { ...d.skuConstraints, excludeSkuIds: [...(d.skuConstraints.excludeSkuIds || []), skuId] } })); };
  const removeExclude = (skuId) => setDraft((d) => ({ ...d, skuConstraints: { ...d.skuConstraints, excludeSkuIds: (d.skuConstraints.excludeSkuIds || []).filter((id) => id !== skuId) } }));

  const toggleAttr = (key, checked) => setDraft((d) => ({ ...d, attributesSelected: { ...(d.attributesSelected || {}), [key]: checked } }));

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-base font-medium text-gray-800 mb-4 border-l-4 border-blue-600 pl-2">物流属性信息</h2>

      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">特殊SKU - 包含</h3>
        <div className="flex gap-2 flex-wrap items-center">
          <select className="border border-gray-300 rounded px-3 py-2 text-sm" value="" onChange={(e) => { const v = e.target.value; if (v) addInclude(v); e.target.value = ''; }}>
            <option value="">选择 SKU...</option>
            {declarationList.filter((d) => !sc.includeSkuIds.includes(d.skuId)).map((d) => <option key={d.skuId} value={d.skuId}>{d.skuId} / {d.skuName}</option>)}
          </select>
          <span className="text-gray-500 text-sm">已添加：</span>
          {(sc.includeSkuIds || []).map((skuId) => (
            <span key={skuId} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm">
              {skuId}
              <button type="button" onClick={() => removeInclude(skuId)} className="text-red-600 hover:underline">×</button>
            </span>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">特殊SKU - 排除</h3>
        <div className="flex gap-2 flex-wrap items-center">
          <select className="border border-gray-300 rounded px-3 py-2 text-sm" value="" onChange={(e) => { const v = e.target.value; if (v) addExclude(v); e.target.value = ''; }}>
            <option value="">选择 SKU...</option>
            {declarationList.filter((d) => !sc.excludeSkuIds.includes(d.skuId)).map((d) => <option key={d.skuId} value={d.skuId}>{d.skuId} / {d.skuName}</option>)}
          </select>
          <span className="text-gray-500 text-sm">已添加：</span>
          {(sc.excludeSkuIds || []).map((skuId) => (
            <span key={skuId} className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 rounded text-sm">
              {skuId}
              <button type="button" onClick={() => removeExclude(skuId)} className="text-red-600 hover:underline">×</button>
            </span>
          ))}
        </div>
      </div>

      <h3 className="text-sm font-medium text-gray-700 mb-2">物流属性</h3>
      <div className="space-y-4">
        {ATTRIBUTE_GROUPS.map((g) => (
          <div key={g.group}>
            <p className="text-sm font-medium text-gray-600 mb-2">{g.group}</p>
            <div className="flex flex-wrap gap-4">
              {g.items.map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={!!selected[key]} onChange={(e) => toggleAttr(key, e.target.checked)} className="rounded border-gray-300" />
                  <span className="text-sm">{label}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- 包装限制附加费（4 区块） ----------
function renderPackagingLimitTab(draft, setDraft) {
  const plf = draft.packagingLimitFees || {};
  const keys = [
    { key: 'weight', label: '重量限制', unit: 'KG' },
    { key: 'longestSide', label: '最长边限制', unit: 'CM' },
    { key: 'secondLongestSide', label: '第二长边限制', unit: 'CM' },
    { key: 'girth', label: '周长限制', unit: 'CM' },
  ];

  const addRow = (k) => {
    setDraft((d) => {
      const next = JSON.parse(JSON.stringify(d));
      next.packagingLimitFees[k] = [...(next.packagingLimitFees[k] || []), { id: 'pl_' + Date.now(), min: '', max: '', fee: '', currency: 'CNY', effectiveDate: todayStr() }];
      return next;
    });
  };

  const removeRow = (k, idx) => {
    setDraft((d) => {
      const next = JSON.parse(JSON.stringify(d));
      next.packagingLimitFees[k] = (next.packagingLimitFees[k] || []).filter((_, i) => i !== idx);
      return next;
    });
  };

  const updateCell = (k, idx, field, value) => {
    setDraft((d) => {
      const next = JSON.parse(JSON.stringify(d));
      next.packagingLimitFees[k][idx][field] = value;
      return next;
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-base font-medium text-gray-800 mb-4 border-l-4 border-blue-600 pl-2">包装限制附加费</h2>
      {keys.map(({ key: k, label, unit }) => {
        const rows = plf[k] || [];
        return (
          <div key={k} className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">{label}</h3>
              <button type="button" onClick={() => addRow(k)} className="px-2 py-1 text-blue-600 text-sm hover:underline">新增行</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead className="bg-gray-50"><tr className="border-b"><th className="px-3 py-2 text-left font-medium text-gray-600">最小值</th><th className="px-3 py-2 text-left font-medium text-gray-600">最大值</th><th className="px-3 py-2 text-left font-medium text-gray-600">费用</th><th className="px-3 py-2 text-left font-medium text-gray-600">预览</th><th className="px-3 py-2 text-left font-medium text-gray-600">生效日期</th><th className="px-3 py-2 text-right font-medium text-gray-600">操作</th></tr></thead>
                <tbody>
                  {rows.length === 0 ? <tr><td colSpan={6} className="px-3 py-2 text-gray-500 text-sm">暂无</td></tr> : rows.map((row, idx) => (
                    <tr key={row.id} className="border-b">
                      <td className="px-3 py-2"><input type="number" value={row.min ?? ''} onChange={(e) => updateCell(k, idx, 'min', e.target.value === '' ? '' : Number(e.target.value))} className="w-20 border border-gray-300 rounded px-2 py-1 text-sm" /></td>
                      <td className="px-3 py-2"><input type="number" value={row.max ?? ''} onChange={(e) => updateCell(k, idx, 'max', e.target.value === '' ? '' : Number(e.target.value))} className="w-20 border border-gray-300 rounded px-2 py-1 text-sm" /></td>
                      <td className="px-3 py-2"><input type="number" value={row.fee ?? ''} onChange={(e) => updateCell(k, idx, 'fee', e.target.value === '' ? '' : Number(e.target.value))} className="w-20 border border-gray-300 rounded px-2 py-1 text-sm" /></td>
                      <td className="px-3 py-2 text-gray-500 text-sm">{row.min != null && row.max != null ? `${row.min}${unit} < x ≤ ${row.max}${unit}` : '-'}</td>
                      <td className="px-3 py-2"><input type="date" value={row.effectiveDate || ''} onChange={(e) => updateCell(k, idx, 'effectiveDate', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1 text-sm" /></td>
                      <td className="px-3 py-2 text-right"><button type="button" onClick={() => removeRow(k, idx)} className="text-red-600 text-sm">移除</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---------- 其他费用 ----------
function renderOtherFeesTab(draft, setDraft) {
  const list = draft.otherFees || [];

  const addRow = () => setDraft((d) => ({ ...d, otherFees: [...(d.otherFees || []), { id: 'of_' + Date.now(), feeType: '报关费', amount: '', currency: 'CNY', unit: '票', effectiveDate: todayStr(), waiverCountNote: '' }] }));
  const removeRow = (idx) => setDraft((d) => ({ ...d, otherFees: d.otherFees.filter((_, i) => i !== idx) }));
  const updateRow = (idx, field, value) => {
    setDraft((d) => {
      const next = JSON.parse(JSON.stringify(d));
      next.otherFees[idx][field] = value;
      return next;
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-medium text-gray-800 border-l-4 border-blue-600 pl-2">其他费用</h2>
        <button type="button" onClick={addRow} className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">新增行</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-gray-50"><tr className="border-b"><th className="px-3 py-2 text-left font-medium text-gray-600">费用类型</th><th className="px-3 py-2 text-left font-medium text-gray-600">费用</th><th className="px-3 py-2 text-left font-medium text-gray-600">计费单位</th><th className="px-3 py-2 text-left font-medium text-gray-600">生效日期</th><th className="px-3 py-2 text-left font-medium text-gray-600">减免个数/备注</th><th className="px-3 py-2 text-right font-medium text-gray-600">操作</th></tr></thead>
          <tbody>
            {list.length === 0 ? <tr><td colSpan={6} className="px-3 py-4 text-gray-500 text-center">暂无，点击「新增行」</td></tr> : list.map((row, idx) => (
              <tr key={row.id} className="border-b">
                <td className="px-3 py-2">
                  <select value={row.feeType || '报关费'} onChange={(e) => updateRow(idx, 'feeType', e.target.value)} className="border border-gray-300 rounded px-2 py-1 text-sm">{OTHER_FEE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}</select>
                </td>
                <td className="px-3 py-2"><input type="number" value={row.amount ?? ''} onChange={(e) => updateRow(idx, 'amount', e.target.value === '' ? '' : Number(e.target.value))} className="w-24 border border-gray-300 rounded px-2 py-1 text-sm" /></td>
                <td className="px-3 py-2"><select value={row.unit || '票'} onChange={(e) => updateRow(idx, 'unit', e.target.value)} className="border border-gray-300 rounded px-2 py-1 text-sm"><option value="票">票</option></select></td>
                <td className="px-3 py-2"><input type="date" value={row.effectiveDate || ''} onChange={(e) => updateRow(idx, 'effectiveDate', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1 text-sm" /></td>
                <td className="px-3 py-2"><input type="text" value={row.waiverCountNote || ''} onChange={(e) => updateRow(idx, 'waiverCountNote', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1 text-sm" placeholder="备注" /></td>
                <td className="px-3 py-2 text-right"><button type="button" onClick={() => removeRow(idx)} className="text-red-600 text-sm">移除</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LogisticsChannelDetailPage;
