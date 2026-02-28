/**
 * 物流类型规则详情页：表单保存、审批操作、审批记录。entityType 'routingRule'。
 */

import React, { useState, useEffect } from 'react';
import { logisticsService } from '../../services';

const APPROVAL_LABEL = { draft: '草稿', pending: '待审批', approved: '已通过', rejected: '已驳回' };

function LogisticsRoutingRuleDetailPage({ tab }) {
  const id = tab?.data?.id ?? (tab?.path || '').split('/').pop();
  const [record, setRecord] = useState(null);
  const [form, setForm] = useState({ name: '', countriesStr: '', weight: 0, status: 'enabled', taxIncluded: 'any', channelIds: [], updatedAt: '' });
  const [approvalRecords, setApprovalRecords] = useState([]);
  const [showRemarkModal, setShowRemarkModal] = useState(false);
  const [remarkAction, setRemarkAction] = useState(null);
  const [remarkText, setRemarkText] = useState('');
  const channelList = logisticsService.channels.list({ page: 1, pageSize: 99999 }).list;

  useEffect(() => {
    if (!id) return;
    const r = logisticsService.routingRules.get(id);
    setRecord(r);
    if (r) {
      const countries = r.conditions?.countries || r.countries || [];
      const channelIds = (r.channels || []).map((c) => (typeof c === 'object' ? c.channelId : c));
      setForm({
        name: r.name || '',
        countriesStr: Array.isArray(countries) ? countries.join(', ') : '',
        weight: r.weight ?? 0,
        status: r.status || 'enabled',
        taxIncluded: r.conditions?.taxIncluded || 'any',
        channelIds: channelIds.filter(Boolean),
        updatedAt: r.updatedAt || '',
      });
      setApprovalRecords(logisticsService.approvals.listByEntity('routingRule', id));
    }
  }, [id]);

  const refresh = () => {
    const r = logisticsService.routingRules.get(id);
    setRecord(r);
    if (r) {
      const countries = r.conditions?.countries || r.countries || [];
      const channelIds = (r.channels || []).map((c) => (typeof c === 'object' ? c.channelId : c));
      setForm((prev) => ({
        ...prev,
        name: r.name || '',
        countriesStr: Array.isArray(countries) ? countries.join(', ') : '',
        weight: r.weight ?? 0,
        status: r.status || 'enabled',
        taxIncluded: r.conditions?.taxIncluded || 'any',
        channelIds: channelIds.filter(Boolean),
        updatedAt: r.updatedAt || '',
      }));
      setApprovalRecords(logisticsService.approvals.listByEntity('routingRule', id));
    }
  };

  const saveForm = () => {
    if (!id) return;
    const countries = form.countriesStr.split(/[,，\s]+/).map((s) => s.trim()).filter(Boolean);
    if (countries.length === 0) { window.alert('国家至少填 1 个'); return; }
    const channels = form.channelIds.map((cid) => ({ channelId: cid, channelPriority: 0 }));
    const payload = {
      name: form.name.trim(),
      conditions: { countries, taxIncluded: form.taxIncluded },
      weight: Number(form.weight) || 0,
      status: form.status,
      channels,
    };
    const res = logisticsService.routingRules.update(id, payload);
    if (res && res.ok === false) { window.alert(res.message || '保存失败'); return; }
    window.alert('已保存');
    refresh();
  };

  const handleSubmit = () => {
    const res = logisticsService.routingRules.submit(id);
    if (res && res.ok === false) window.alert(res.message || '提交失败');
    else refresh();
  };

  const handleWithdraw = () => {
    const res = logisticsService.routingRules.withdraw(id);
    if (res && res.ok === false) window.alert(res.message || '撤回失败');
    else refresh();
  };

  const openRemark = (action) => { setRemarkAction(action); setRemarkText(''); setShowRemarkModal(true); };

  const submitRemark = () => {
    if (remarkAction === 'approve') { const res = logisticsService.routingRules.approve(id, remarkText); if (res && res.ok === false) window.alert(res.message); }
    else if (remarkAction === 'reject') { const res = logisticsService.routingRules.reject(id, remarkText); if (res && res.ok === false) window.alert(res.message); }
    setShowRemarkModal(false);
    refresh();
  };

  const toggleChannel = (channelId) => {
    setForm((f) => ({
      ...f,
      channelIds: f.channelIds.includes(channelId) ? f.channelIds.filter((x) => x !== channelId) : [...f.channelIds, channelId],
    }));
  };

  if (!id) return <div className="p-6 text-gray-500">缺少 id</div>;
  if (record === null) return <div className="p-6"><p className="text-gray-500 mb-4">未找到该规则</p><p className="text-sm text-gray-400">请从列表页重新打开或切换其他 Tab。</p></div>;

  const canSubmit = record.approvalStatus === 'draft' || record.approvalStatus === 'rejected';
  const canWithdraw = record.approvalStatus === 'pending';
  const canApproveReject = record.approvalStatus === 'pending';

  return (
    <div className="flex flex-col h-full min-h-0 overflow-auto p-6">
      <h1 className="text-lg font-semibold text-gray-800 mb-4">物流类型规则详情</h1>
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-base font-medium text-gray-800 mb-4 border-l-4 border-blue-600 pl-2">基础信息</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div><label className="block text-sm text-gray-600 mb-1">ID</label><input type="text" value={record.id} readOnly className="w-full border border-gray-200 rounded px-3 py-2 text-sm bg-gray-50" /></div>
          <div><label className="block text-sm text-gray-600 mb-1">名称</label><input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" /></div>
          <div className="col-span-2"><label className="block text-sm text-gray-600 mb-1">国家（逗号分隔）*</label><textarea value={form.countriesStr} onChange={(e) => setForm((f) => ({ ...f, countriesStr: e.target.value }))} rows={2} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" /></div>
          <div><label className="block text-sm text-gray-600 mb-1">权重</label><input type="number" value={form.weight} onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" /></div>
          <div><label className="block text-sm text-gray-600 mb-1">状态</label><select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm"><option value="enabled">启用</option><option value="disabled">禁用</option></select></div>
          <div><label className="block text-sm text-gray-600 mb-1">含税</label><select value={form.taxIncluded} onChange={(e) => setForm((f) => ({ ...f, taxIncluded: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm"><option value="any">任意</option><option value="true">是</option><option value="false">否</option></select></div>
          <div><label className="block text-sm text-gray-600 mb-1">更新时间</label><input type="text" value={form.updatedAt} readOnly className="w-full border border-gray-200 rounded px-3 py-2 text-sm bg-gray-50" /></div>
        </div>
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">输出渠道</label>
          <div className="border border-gray-200 rounded p-2 max-h-32 overflow-y-auto space-y-1">
            {channelList.map((ch) => (
              <label key={ch.id} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.channelIds.includes(ch.id)} onChange={() => toggleChannel(ch.id)} />
                <span className="text-sm">{ch.name} ({ch.code})</span>
              </label>
            ))}
          </div>
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

export default LogisticsRoutingRuleDetailPage;
