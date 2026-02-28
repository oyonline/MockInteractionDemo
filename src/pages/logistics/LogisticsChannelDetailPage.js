/**
 * 渠道详情页：业务 Tabs（基础信息/运费规则/附加费/物流属性/审批），rateRules/surcharges/attributes 写回 channel.update。
 */

import React, { useState, useEffect, useCallback } from 'react';
import { logisticsService } from '../../services';

const APPROVAL_LABEL = { draft: '草稿', pending: '待审批', approved: '已通过', rejected: '已驳回' };
const CHANNEL_TABS = [
  { key: 'basic', label: '基础信息' },
  { key: 'rateRules', label: '运费规则' },
  { key: 'surcharges', label: '附加费' },
  { key: 'attributes', label: '物流属性' },
  { key: 'approval', label: '审批信息' },
];
const SURCHARGE_TYPES = ['燃油', '偏远', '超长', '处理费', '其他'];
const ATTRIBUTE_KEYS = [
  { key: 'general', label: '普货' },
  { key: 'battery', label: '带电' },
  { key: 'liquid', label: '液体' },
  { key: 'powder', label: '粉末' },
  { key: 'magnetic', label: '磁性' },
  { key: 'fragile', label: '易碎' },
];

function LogisticsChannelDetailPage({ tab }) {
  const id = tab?.data?.id ?? (tab?.path || '').split('/').pop();
  const [record, setRecord] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [form, setForm] = useState({
    code: '', name: '', vendorId: '', status: 'enabled', updatedAt: '',
    countriesStr: '', platformsStr: '', isTaxIncluded: 'any', lastMileType: '',
  });
  const [approvalRecords, setApprovalRecords] = useState([]);
  const [showRemarkModal, setShowRemarkModal] = useState(false);
  const [remarkAction, setRemarkAction] = useState(null);
  const [remarkText, setRemarkText] = useState('');
  const [rateRuleModal, setRateRuleModal] = useState(null);
  const [surchargeModal, setSurchargeModal] = useState(null);

  const loadRecord = useCallback(() => {
    const r = logisticsService.channels.get(id);
    setRecord(r);
    if (r) {
      setForm({
        code: r.code || '',
        name: r.name || '',
        vendorId: r.vendorId || '',
        status: r.status || 'enabled',
        updatedAt: r.updatedAt || '',
        countriesStr: Array.isArray(r.countries) ? r.countries.join(', ') : '',
        platformsStr: Array.isArray(r.platforms) ? r.platforms.join(', ') : '',
        isTaxIncluded: r.isTaxIncluded === true ? 'true' : r.isTaxIncluded === false ? 'false' : 'any',
        lastMileType: r.lastMileType ?? '',
      });
      setApprovalRecords(logisticsService.approvals.listByEntity('channel', id));
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    loadRecord();
  }, [id, loadRecord]);

  const saveForm = () => {
    if (!id) return;
    const countries = form.countriesStr.split(/[,，\s]+/).map((s) => s.trim()).filter(Boolean);
    const platforms = form.platformsStr.split(/[,，\s]+/).map((s) => s.trim()).filter(Boolean);
    const isTaxIncluded = form.isTaxIncluded === 'any' ? undefined : form.isTaxIncluded === 'true';
    logisticsService.channels.update(id, {
      name: form.name,
      status: form.status,
      countries: countries.length ? countries : undefined,
      platforms: platforms.length ? platforms : undefined,
      isTaxIncluded,
      lastMileType: form.lastMileType || undefined,
    });
    window.alert('已保存');
    loadRecord();
  };

  const handleSubmit = () => {
    const res = logisticsService.channels.submit(id);
    if (res && res.ok === false) window.alert(res.message || '提交失败');
    else loadRecord();
  };

  const handleWithdraw = () => {
    const res = logisticsService.channels.withdraw(id);
    if (res && res.ok === false) window.alert(res.message || '撤回失败');
    else loadRecord();
  };

  const openRemark = (action) => { setRemarkAction(action); setRemarkText(''); setShowRemarkModal(true); };

  const submitRemark = () => {
    if (remarkAction === 'approve') { const res = logisticsService.channels.approve(id, remarkText); if (res && res.ok === false) window.alert(res.message); }
    else if (remarkAction === 'reject') { const res = logisticsService.channels.reject(id, remarkText); if (res && res.ok === false) window.alert(res.message); }
    setShowRemarkModal(false);
    loadRecord();
  };

  const rateRules = record?.rateRules ?? [];
  const surcharges = record?.surcharges ?? [];
  const attributes = record?.attributes ?? {};

  const saveRateRules = (newRules) => {
    logisticsService.channels.update(id, { rateRules: newRules });
    loadRecord();
  };

  const saveSurcharges = (newList) => {
    logisticsService.channels.update(id, { surcharges: newList });
    loadRecord();
  };

  const saveAttributes = (next) => {
    logisticsService.channels.update(id, { attributes: next });
    loadRecord();
  };

  if (!id) return <div className="p-6 text-gray-500">缺少 id</div>;
  if (record === null) return <div className="p-6"><p className="text-gray-500 mb-4">未找到该渠道</p><p className="text-sm text-gray-400">请从列表页重新打开或切换其他 Tab。</p></div>;

  const canSubmit = record.approvalStatus === 'draft' || record.approvalStatus === 'rejected';
  const canWithdraw = record.approvalStatus === 'pending';
  const canApproveReject = record.approvalStatus === 'pending';
  const vendorName = record.vendorId ? (logisticsService.vendors.get(record.vendorId)?.name || '-') : '-';

  return (
    <div className="flex flex-col h-full min-h-0 p-6">
      <div className="flex-shrink-0 flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-800">渠道详情</h1>
          <p className="text-sm text-gray-500 mt-0.5">{[form.code, form.name].filter(Boolean).join(' / ') || '-'}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-2 py-0.5 rounded text-xs ${form.status === 'enabled' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{form.status === 'enabled' ? '启用' : '禁用'}</span>
          <span className={`px-2 py-0.5 rounded text-xs ${record.approvalStatus === 'approved' ? 'bg-green-100 text-green-700' : record.approvalStatus === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>{APPROVAL_LABEL[record.approvalStatus] || record.approvalStatus}</span>
          <button type="button" onClick={saveForm} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">保存</button>
        </div>
      </div>

      <div className="flex-shrink-0 flex gap-1 border-b border-gray-200 mb-4">
        {CHANNEL_TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg border border-b-0 -mb-px ${activeTab === t.key ? 'bg-white border-gray-200 text-blue-600' : 'border-transparent text-gray-600 hover:bg-gray-50'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-0 overflow-auto">
        {activeTab === 'basic' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-base font-medium text-gray-800 mb-4 border-l-4 border-blue-600 pl-2">基础信息</h2>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm text-gray-600 mb-1">编码</label><input type="text" value={form.code} readOnly className="w-full border border-gray-200 rounded px-3 py-2 text-sm bg-gray-50" /></div>
              <div><label className="block text-sm text-gray-600 mb-1">名称</label><input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" /></div>
              <div className="col-span-2"><label className="block text-sm text-gray-600 mb-1">物流商</label><input type="text" value={`${vendorName} (${form.vendorId || '-'})`} readOnly className="w-full border border-gray-200 rounded px-3 py-2 text-sm bg-gray-50" /></div>
              <div className="col-span-2"><label className="block text-sm text-gray-600 mb-1">国家（逗号分隔）</label><textarea value={form.countriesStr} onChange={(e) => setForm((f) => ({ ...f, countriesStr: e.target.value }))} rows={2} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" placeholder="US, DE, GB" /></div>
              <div className="col-span-2"><label className="block text-sm text-gray-600 mb-1">平台（逗号分隔）</label><textarea value={form.platformsStr} onChange={(e) => setForm((f) => ({ ...f, platformsStr: e.target.value }))} rows={2} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" /></div>
              <div><label className="block text-sm text-gray-600 mb-1">含税</label><select value={form.isTaxIncluded} onChange={(e) => setForm((f) => ({ ...f, isTaxIncluded: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm"><option value="any">任意</option><option value="true">是</option><option value="false">否</option></select></div>
              <div><label className="block text-sm text-gray-600 mb-1">尾程类型</label><input type="text" value={form.lastMileType} onChange={(e) => setForm((f) => ({ ...f, lastMileType: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" placeholder="如 DDP, DDU" /></div>
              <div><label className="block text-sm text-gray-600 mb-1">状态</label><select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm"><option value="enabled">启用</option><option value="disabled">禁用</option></select></div>
              <div><label className="block text-sm text-gray-600 mb-1">更新时间</label><input type="text" value={form.updatedAt} readOnly className="w-full border border-gray-200 rounded px-3 py-2 text-sm bg-gray-50" /></div>
            </div>
          </div>
        )}

        {activeTab === 'rateRules' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-medium text-gray-800 border-l-4 border-blue-600 pl-2">运费规则</h2>
              <button type="button" onClick={() => setRateRuleModal({})} className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">新增规则</button>
            </div>
            <table className="w-full text-sm">
              <thead><tr className="border-b bg-gray-50"><th className="px-3 py-2 text-left font-medium text-gray-600">地区/邮编</th><th className="px-3 py-2 text-left font-medium text-gray-600">重量起(kg)</th><th className="px-3 py-2 text-left font-medium text-gray-600">价格</th><th className="px-3 py-2 text-left font-medium text-gray-600">币种</th><th className="px-3 py-2 text-left font-medium text-gray-600">生效日</th><th className="px-3 py-2 text-right font-medium text-gray-600">操作</th></tr></thead>
              <tbody>
                {rateRules.length === 0 ? <tr><td colSpan={6} className="px-3 py-4 text-gray-500 text-center">暂无规则</td></tr> : rateRules.map((r) => (
                  <tr key={r.id} className="border-b">
                    <td className="px-3 py-2">{r.regionOrPostcode || '-'}</td>
                    <td className="px-3 py-2">{r.weightFromKg ?? '-'}</td>
                    <td className="px-3 py-2">{r.price ?? '-'}</td>
                    <td className="px-3 py-2">{r.currency || 'USD'}</td>
                    <td className="px-3 py-2">{r.effectiveFrom || '-'}</td>
                    <td className="px-3 py-2 text-right">
                      <button type="button" onClick={() => setRateRuleModal(r)} className="text-blue-600 text-sm mr-2">编辑</button>
                      <button type="button" onClick={() => { if (window.confirm('确定删除？')) saveRateRules(rateRules.filter((x) => x.id !== r.id)); }} className="text-red-600 text-sm">删除</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'surcharges' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-medium text-gray-800 border-l-4 border-blue-600 pl-2">附加费</h2>
              <button type="button" onClick={() => setSurchargeModal({})} className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">新增附加费</button>
            </div>
            <table className="w-full text-sm">
              <thead><tr className="border-b bg-gray-50"><th className="px-3 py-2 text-left font-medium text-gray-600">类型</th><th className="px-3 py-2 text-left font-medium text-gray-600">金额</th><th className="px-3 py-2 text-left font-medium text-gray-600">币种</th><th className="px-3 py-2 text-left font-medium text-gray-600">触发条件</th><th className="px-3 py-2 text-left font-medium text-gray-600">生效日</th><th className="px-3 py-2 text-right font-medium text-gray-600">操作</th></tr></thead>
              <tbody>
                {surcharges.length === 0 ? <tr><td colSpan={6} className="px-3 py-4 text-gray-500 text-center">暂无附加费</td></tr> : surcharges.map((s) => (
                  <tr key={s.id} className="border-b">
                    <td className="px-3 py-2">{s.type || '-'}</td>
                    <td className="px-3 py-2">{s.amount ?? '-'}</td>
                    <td className="px-3 py-2">{s.currency || 'USD'}</td>
                    <td className="px-3 py-2">{s.condition || '-'}</td>
                    <td className="px-3 py-2">{s.effectiveFrom || '-'}</td>
                    <td className="px-3 py-2 text-right">
                      <button type="button" onClick={() => setSurchargeModal(s)} className="text-blue-600 text-sm mr-2">编辑</button>
                      <button type="button" onClick={() => { if (window.confirm('确定删除？')) saveSurcharges(surcharges.filter((x) => x.id !== s.id)); }} className="text-red-600 text-sm">删除</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'attributes' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-base font-medium text-gray-800 mb-4 border-l-4 border-blue-600 pl-2">物流属性</h2>
            <div className="space-y-2">
              {ATTRIBUTE_KEYS.map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!attributes[key]}
                    onChange={(e) => saveAttributes({ ...attributes, [key]: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'approval' && (
          <>
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h2 className="text-base font-medium text-gray-800 mb-4 border-l-4 border-amber-500 pl-2">审批操作</h2>
              <p className="text-sm text-gray-600 mb-3">当前状态：<span className="font-medium">{APPROVAL_LABEL[record.approvalStatus] || record.approvalStatus}</span></p>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={handleSubmit} disabled={!canSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">提交审批</button>
                <button type="button" onClick={handleWithdraw} disabled={!canWithdraw} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">撤回</button>
                <button type="button" onClick={() => openRemark('approve')} disabled={!canApproveReject} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">审核通过</button>
                <button type="button" onClick={() => openRemark('reject')} disabled={!canApproveReject} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed">驳回</button>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-base font-medium text-gray-800 mb-4 border-l-4 border-gray-400 pl-2">审批记录</h2>
              <table className="w-full text-sm">
                <thead><tr className="border-b bg-gray-50"><th className="px-3 py-2 text-left font-medium text-gray-600">时间</th><th className="px-3 py-2 text-left font-medium text-gray-600">动作</th><th className="px-3 py-2 text-left font-medium text-gray-600">操作人</th><th className="px-3 py-2 text-left font-medium text-gray-600">备注</th></tr></thead>
                <tbody>
                  {approvalRecords.length === 0 ? <tr><td colSpan={4} className="px-3 py-4 text-gray-500 text-center">暂无审批记录</td></tr> : approvalRecords.map((r, idx) => (
                    <tr key={r.recordId || idx} className="border-b">
                      <td className="px-3 py-2 text-gray-700">{r.createdAt || '-'}</td>
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

      {/* 运费规则 Modal */}
      {rateRuleModal !== null && (
        <RateRuleModal
          initial={rateRuleModal}
          onSave={(item) => {
            const next = item.id ? rateRules.map((r) => r.id === item.id ? item : r) : [...rateRules, { ...item, id: 'rate_' + Date.now() }];
            saveRateRules(next);
            setRateRuleModal(null);
          }}
          onClose={() => setRateRuleModal(null)}
        />
      )}

      {/* 附加费 Modal */}
      {surchargeModal !== null && (
        <SurchargeModal
          initial={surchargeModal}
          onSave={(item) => {
            const next = item.id ? surcharges.map((s) => s.id === item.id ? item : s) : [...surcharges, { ...item, id: 'fee_' + Date.now() }];
            saveSurcharges(next);
            setSurchargeModal(null);
          }}
          onClose={() => setSurchargeModal(null)}
        />
      )}

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

function RateRuleModal({ initial, onSave, onClose }) {
  const [regionOrPostcode, setRegionOrPostcode] = useState(initial.regionOrPostcode ?? '');
  const [weightFromKg, setWeightFromKg] = useState(initial.weightFromKg ?? '');
  const [price, setPrice] = useState(initial.price ?? '');
  const [currency, setCurrency] = useState(initial.currency ?? 'USD');
  const [effectiveFrom, setEffectiveFrom] = useState(initial.effectiveFrom ?? '');
  const handleSubmit = () => {
    onSave({
      ...initial,
      regionOrPostcode: regionOrPostcode.trim(),
      weightFromKg: weightFromKg === '' ? undefined : Number(weightFromKg),
      price: price === '' ? undefined : Number(price),
      currency: currency.trim() || 'USD',
      effectiveFrom: effectiveFrom.trim() || undefined,
    });
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} aria-hidden />
      <div className="relative bg-white rounded-lg shadow-xl w-[420px] p-6">
        <h2 className="text-lg font-semibold mb-4">{initial.id ? '编辑运费规则' : '新增运费规则'}</h2>
        <div className="space-y-3">
          <div><label className="block text-sm text-gray-700 mb-1">地区/邮编段</label><input type="text" value={regionOrPostcode} onChange={(e) => setRegionOrPostcode(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" /></div>
          <div><label className="block text-sm text-gray-700 mb-1">重量起(kg)</label><input type="number" value={weightFromKg} onChange={(e) => setWeightFromKg(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" /></div>
          <div><label className="block text-sm text-gray-700 mb-1">价格</label><input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" /></div>
          <div><label className="block text-sm text-gray-700 mb-1">币种</label><input type="text" value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" /></div>
          <div><label className="block text-sm text-gray-700 mb-1">生效日</label><input type="date" value={effectiveFrom} onChange={(e) => setEffectiveFrom(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" /></div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">取消</button>
          <button type="button" onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">保存</button>
        </div>
      </div>
    </div>
  );
}

function SurchargeModal({ initial, onSave, onClose }) {
  const [type, setType] = useState(initial.type ?? SURCHARGE_TYPES[0]);
  const [amount, setAmount] = useState(initial.amount ?? '');
  const [currency, setCurrency] = useState(initial.currency ?? 'USD');
  const [condition, setCondition] = useState(initial.condition ?? '');
  const [effectiveFrom, setEffectiveFrom] = useState(initial.effectiveFrom ?? '');
  const handleSubmit = () => {
    onSave({
      ...initial,
      type: type || SURCHARGE_TYPES[0],
      amount: amount === '' ? undefined : Number(amount),
      currency: currency.trim() || 'USD',
      condition: condition.trim() || undefined,
      effectiveFrom: effectiveFrom.trim() || undefined,
    });
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} aria-hidden />
      <div className="relative bg-white rounded-lg shadow-xl w-[420px] p-6">
        <h2 className="text-lg font-semibold mb-4">{initial.id ? '编辑附加费' : '新增附加费'}</h2>
        <div className="space-y-3">
          <div><label className="block text-sm text-gray-700 mb-1">类型</label><select value={type} onChange={(e) => setType(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm">{SURCHARGE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}</select></div>
          <div><label className="block text-sm text-gray-700 mb-1">金额</label><input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" /></div>
          <div><label className="block text-sm text-gray-700 mb-1">币种</label><input type="text" value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" /></div>
          <div><label className="block text-sm text-gray-700 mb-1">触发条件</label><input type="text" value={condition} onChange={(e) => setCondition(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" placeholder="如 邮编段、重量&gt;xx" /></div>
          <div><label className="block text-sm text-gray-700 mb-1">生效日</label><input type="date" value={effectiveFrom} onChange={(e) => setEffectiveFrom(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" /></div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">取消</button>
          <button type="button" onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">保存</button>
        </div>
      </div>
    </div>
  );
}

export default LogisticsChannelDetailPage;
