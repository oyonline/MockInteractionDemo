/**
 * 集货规则详情页：表单保存、审批操作、审批记录。entityType 'consolidationRule'。
 */

import React, { useState, useEffect } from 'react';
import { logisticsService } from '../../services';

const APPROVAL_LABEL = { draft: '草稿', pending: '待审批', approved: '已通过', rejected: '已驳回' };

function LogisticsConsolidationRuleDetailPage({ tab }) {
  const id = tab?.data?.id ?? (tab?.path || '').split('/').pop();
  const [record, setRecord] = useState(null);
  const [form, setForm] = useState({ name: '', country: '', weight: 0, status: 'enabled', platform: '', vendorId: '', channelId: '', taxIncluded: '', maxOrdersPerBatch: 50, cutoffHourLocal: '', updatedAt: '' });
  const [approvalRecords, setApprovalRecords] = useState([]);
  const [showRemarkModal, setShowRemarkModal] = useState(false);
  const [remarkAction, setRemarkAction] = useState(null);
  const [remarkText, setRemarkText] = useState('');
  const vendorList = logisticsService.vendors.list({ page: 1, pageSize: 99999 }).list;
  const channelList = logisticsService.channels.list({ page: 1, pageSize: 99999 }).list;

  useEffect(() => {
    if (!id) return;
    const r = logisticsService.consolidationRules.get(id);
    setRecord(r);
    if (r) {
      const b = r.boundaries || {};
      const s = r.strategy || {};
      setForm({
        name: r.name || '',
        country: b.country || '',
        weight: r.weight ?? 0,
        status: r.status || 'enabled',
        platform: b.platform || '',
        vendorId: b.vendorId || '',
        channelId: b.channelId || '',
        taxIncluded: b.taxIncluded || '',
        maxOrdersPerBatch: s.maxOrdersPerBatch ?? 50,
        cutoffHourLocal: s.cutoffHourLocal != null ? s.cutoffHourLocal : '',
        updatedAt: r.updatedAt || '',
      });
      setApprovalRecords(logisticsService.approvals.listByEntity('consolidationRule', id));
    }
  }, [id]);

  const refresh = () => {
    const r = logisticsService.consolidationRules.get(id);
    setRecord(r);
    if (r) {
      const b = r.boundaries || {};
      const s = r.strategy || {};
      setForm((prev) => ({
        ...prev,
        name: r.name || '',
        country: b.country || '',
        weight: r.weight ?? 0,
        status: r.status || 'enabled',
        platform: b.platform || '',
        vendorId: b.vendorId || '',
        channelId: b.channelId || '',
        taxIncluded: b.taxIncluded || '',
        maxOrdersPerBatch: s.maxOrdersPerBatch ?? 50,
        cutoffHourLocal: s.cutoffHourLocal != null ? s.cutoffHourLocal : '',
        updatedAt: r.updatedAt || '',
      }));
      setApprovalRecords(logisticsService.approvals.listByEntity('consolidationRule', id));
    }
  };

  const saveForm = () => {
    if (!id) return;
    if (!form.country?.trim()) { window.alert('国家必填'); return; }
    const boundaries = { country: form.country.trim(), platform: form.platform?.trim() || undefined, vendorId: form.vendorId || undefined, channelId: form.channelId || undefined, taxIncluded: form.taxIncluded || undefined };
    const strategy = { maxOrdersPerBatch: Number(form.maxOrdersPerBatch) || 50, cutoffHourLocal: form.cutoffHourLocal === '' ? undefined : Number(form.cutoffHourLocal) };
    const res = logisticsService.consolidationRules.update(id, { name: form.name.trim(), boundaries, strategy, weight: Number(form.weight) || 0, status: form.status });
    if (res && res.ok === false) { window.alert(res.message || '保存失败'); return; }
    window.alert('已保存');
    refresh();
  };

  const handleSubmit = () => {
    const res = logisticsService.consolidationRules.submit(id);
    if (res && res.ok === false) window.alert(res.message || '提交失败');
    else refresh();
  };

  const handleWithdraw = () => {
    const res = logisticsService.consolidationRules.withdraw(id);
    if (res && res.ok === false) window.alert(res.message || '撤回失败');
    else refresh();
  };

  const openRemark = (action) => { setRemarkAction(action); setRemarkText(''); setShowRemarkModal(true); };

  const submitRemark = () => {
    if (remarkAction === 'approve') { const res = logisticsService.consolidationRules.approve(id, remarkText); if (res && res.ok === false) window.alert(res.message); }
    else if (remarkAction === 'reject') { const res = logisticsService.consolidationRules.reject(id, remarkText); if (res && res.ok === false) window.alert(res.message); }
    setShowRemarkModal(false);
    refresh();
  };

  if (!id) return <div className="p-6 text-gray-500">缺少 id</div>;
  if (record === null) return <div className="p-6"><p className="text-gray-500 mb-4">未找到该规则</p><p className="text-sm text-gray-400">请从列表页重新打开或切换其他 Tab。</p></div>;

  const canSubmit = record.approvalStatus === 'draft' || record.approvalStatus === 'rejected';
  const canWithdraw = record.approvalStatus === 'pending';
  const canApproveReject = record.approvalStatus === 'pending';

  return (
    <div className="flex flex-col h-full min-h-0 overflow-auto p-6">
      <h1 className="text-lg font-semibold text-gray-800 mb-4">集货规则详情</h1>
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-base font-medium text-gray-800 mb-4 border-l-4 border-blue-600 pl-2">基础信息</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div><label className="block text-sm text-gray-600 mb-1">ID</label><input type="text" value={record.id} readOnly className="w-full border border-gray-200 rounded px-3 py-2 text-sm bg-gray-50" /></div>
          <div><label className="block text-sm text-gray-600 mb-1">名称</label><input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" /></div>
          <div><label className="block text-sm text-gray-600 mb-1">国家 *</label><input type="text" value={form.country} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" /></div>
          <div><label className="block text-sm text-gray-600 mb-1">权重</label><input type="number" value={form.weight} onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" /></div>
          <div><label className="block text-sm text-gray-600 mb-1">状态</label><select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm"><option value="enabled">启用</option><option value="disabled">禁用</option></select></div>
          <div><label className="block text-sm text-gray-600 mb-1">更新时间</label><input type="text" value={form.updatedAt} readOnly className="w-full border border-gray-200 rounded px-3 py-2 text-sm bg-gray-50" /></div>
          <div><label className="block text-sm text-gray-600 mb-1">平台（可选）</label><input type="text" value={form.platform} onChange={(e) => setForm((f) => ({ ...f, platform: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" /></div>
          <div><label className="block text-sm text-gray-600 mb-1">物流商（可选）</label><select value={form.vendorId} onChange={(e) => setForm((f) => ({ ...f, vendorId: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm"><option value="">不限</option>{vendorList.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}</select></div>
          <div><label className="block text-sm text-gray-600 mb-1">渠道（可选）</label><select value={form.channelId} onChange={(e) => setForm((f) => ({ ...f, channelId: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm"><option value="">不限</option>{channelList.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
          <div><label className="block text-sm text-gray-600 mb-1">含税（可选）</label><select value={form.taxIncluded} onChange={(e) => setForm((f) => ({ ...f, taxIncluded: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm"><option value="">不限</option><option value="true">是</option><option value="false">否</option></select></div>
          <div><label className="block text-sm text-gray-600 mb-1">每批最大单数</label><input type="number" value={form.maxOrdersPerBatch} onChange={(e) => setForm((f) => ({ ...f, maxOrdersPerBatch: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" /></div>
          <div><label className="block text-sm text-gray-600 mb-1">截单小时 0-23（可选）</label><input type="number" min={0} max={23} value={form.cutoffHourLocal} onChange={(e) => setForm((f) => ({ ...f, cutoffHourLocal: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" /></div>
        </div>
        <button type="button" onClick={saveForm} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">保存</button>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-base font-medium text-gray-800 mb-4 border-l-4 border-amber-500 pl-2">审批</h2>
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

export default LogisticsConsolidationRuleDetailPage;
