/**
 * 物流商详情页：基础信息表单、审批操作、审批记录。数据 logisticsService.vendors.get(id) + approvals.listByEntity。
 */

import React, { useState, useEffect } from 'react';
import { logisticsService } from '../../services';

const APPROVAL_LABEL = { draft: '草稿', pending: '待审批', approved: '已通过', rejected: '已驳回' };

function LogisticsVendorDetailPage({ tab }) {
  const id = tab?.data?.id ?? (tab?.path || '').split('/').pop();
  const [vendor, setVendor] = useState(null);
  const [form, setForm] = useState({ code: '', name: '', shortName: '', status: 'enabled', contact: {}, bankInfo: null, updatedAt: '' });
  const [approvalRecords, setApprovalRecords] = useState([]);
  const [showRemarkModal, setShowRemarkModal] = useState(false);
  const [remarkAction, setRemarkAction] = useState(null);
  const [remarkText, setRemarkText] = useState('');

  useEffect(() => {
    if (!id) return;
    const v = logisticsService.vendors.get(id);
    setVendor(v);
    if (v) {
      setForm({
        code: v.code || '',
        name: v.name || '',
        shortName: v.shortName || '',
        status: v.status || 'enabled',
        contact: v.contact && typeof v.contact === 'object' ? { ...v.contact } : { name: '', phone: '', email: '' },
        bankInfo: v.bankInfo != null ? (typeof v.bankInfo === 'string' ? v.bankInfo : JSON.stringify(v.bankInfo, null, 2)) : '',
        updatedAt: v.updatedAt || '',
      });
      setApprovalRecords(logisticsService.approvals.listByEntity('vendor', id));
    }
  }, [id]);

  const refresh = () => {
    const v = logisticsService.vendors.get(id);
    setVendor(v);
    if (v) {
      setForm((prev) => ({
        ...prev,
        code: v.code || '',
        name: v.name || '',
        shortName: v.shortName || '',
        status: v.status || 'enabled',
        contact: v.contact && typeof v.contact === 'object' ? { ...v.contact } : { name: '', phone: '', email: '' },
        bankInfo: v.bankInfo != null ? (typeof v.bankInfo === 'string' ? v.bankInfo : JSON.stringify(v.bankInfo, null, 2)) : '',
        updatedAt: v.updatedAt || '',
      }));
      setApprovalRecords(logisticsService.approvals.listByEntity('vendor', id));
    }
  };

  const saveForm = () => {
    if (!id) return;
    const contact = form.contact && (form.contact.name || form.contact.phone || form.contact.email)
      ? form.contact
      : null;
    let bankInfo = form.bankInfo;
    if (typeof bankInfo === 'string' && bankInfo.trim()) {
      try {
        bankInfo = JSON.parse(bankInfo);
      } catch {
        bankInfo = { note: form.bankInfo };
      }
    }
    logisticsService.vendors.update(id, {
      name: form.name,
      shortName: form.shortName,
      status: form.status,
      contact,
      bankInfo: bankInfo || null,
    });
    window.alert('已保存');
    refresh();
  };

  const handleSubmit = () => {
    const res = logisticsService.vendors.submit(id);
    if (res && res.ok === false) window.alert(res.message || '提交失败');
    else refresh();
  };

  const handleWithdraw = () => {
    const res = logisticsService.vendors.withdraw(id);
    if (res && res.ok === false) window.alert(res.message || '撤回失败');
    else refresh();
  };

  const openRemark = (action) => {
    setRemarkAction(action);
    setRemarkText('');
    setShowRemarkModal(true);
  };

  const submitRemark = () => {
    if (remarkAction === 'approve') {
      const res = logisticsService.vendors.approve(id, remarkText);
      if (res && res.ok === false) window.alert(res.message || '操作失败');
    } else if (remarkAction === 'reject') {
      const res = logisticsService.vendors.reject(id, remarkText);
      if (res && res.ok === false) window.alert(res.message || '操作失败');
    }
    setShowRemarkModal(false);
    refresh();
  };

  if (!id) {
    return (
      <div className="p-6 text-gray-500">
        缺少 id
      </div>
    );
  }

  if (vendor === null) {
    return (
      <div className="p-6">
        <p className="text-gray-500 mb-4">未找到该物流商</p>
        <p className="text-sm text-gray-400">请从列表页重新打开或切换其他 Tab。</p>
      </div>
    );
  }

  const canSubmit = vendor.approvalStatus === 'draft' || vendor.approvalStatus === 'rejected';
  const canWithdraw = vendor.approvalStatus === 'pending';
  const canApproveReject = vendor.approvalStatus === 'pending';

  return (
    <div className="flex flex-col h-full min-h-0 overflow-auto p-6">
      <h1 className="text-lg font-semibold text-gray-800 mb-4">物流商详情</h1>

      {/* 基础信息 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-base font-medium text-gray-800 mb-4 border-l-4 border-blue-600 pl-2">基础信息</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">编码</label>
            <input
              type="text"
              value={form.code}
              readOnly
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">名称</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">简称</label>
            <input
              type="text"
              value={form.shortName}
              onChange={(e) => setForm((f) => ({ ...f, shortName: e.target.value }))}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">状态</label>
            <select
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="enabled">启用</option>
              <option value="disabled">禁用</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm text-gray-600 mb-1">联系人（名/电话/邮箱）</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={form.contact?.name ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, contact: { ...(f.contact || {}), name: e.target.value } }))}
                placeholder="姓名"
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
              />
              <input
                type="text"
                value={form.contact?.phone ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, contact: { ...(f.contact || {}), phone: e.target.value } }))}
                placeholder="电话"
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
              />
              <input
                type="text"
                value={form.contact?.email ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, contact: { ...(f.contact || {}), email: e.target.value } }))}
                placeholder="邮箱"
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="col-span-2">
            <label className="block text-sm text-gray-600 mb-1">银行信息（JSON 或文本）</label>
            <textarea
              value={form.bankInfo}
              onChange={(e) => setForm((f) => ({ ...f, bankInfo: e.target.value }))}
              rows={2}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm font-mono"
              placeholder='{"bankName":"","account":"","accountName":""}'
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">更新时间</label>
            <input type="text" value={form.updatedAt} readOnly className="w-full border border-gray-200 rounded px-3 py-2 text-sm bg-gray-50" />
          </div>
        </div>
        <button type="button" onClick={saveForm} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
          保存
        </button>
      </div>

      {/* 审批状态与操作 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-base font-medium text-gray-800 mb-4 border-l-4 border-amber-500 pl-2">审批</h2>
        <p className="text-sm text-gray-600 mb-3">
          当前状态：<span className="font-medium">{APPROVAL_LABEL[vendor.approvalStatus] || vendor.approvalStatus}</span>
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            提交审批
          </button>
          <button
            type="button"
            onClick={handleWithdraw}
            disabled={!canWithdraw}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            撤回
          </button>
          <button
            type="button"
            onClick={() => openRemark('approve')}
            disabled={!canApproveReject}
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            审核通过
          </button>
          <button
            type="button"
            onClick={() => openRemark('reject')}
            disabled={!canApproveReject}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            驳回
          </button>
        </div>
      </div>

      {/* 审批记录 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-base font-medium text-gray-800 mb-4 border-l-4 border-gray-400 pl-2">审批记录</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-3 py-2 text-left font-medium text-gray-600">时间</th>
                <th className="px-3 py-2 text-left font-medium text-gray-600">动作</th>
                <th className="px-3 py-2 text-left font-medium text-gray-600">操作人</th>
                <th className="px-3 py-2 text-left font-medium text-gray-600">备注</th>
              </tr>
            </thead>
            <tbody>
              {approvalRecords.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-3 py-4 text-gray-500 text-center">
                    暂无审批记录
                  </td>
                </tr>
              ) : (
                approvalRecords.map((r, idx) => (
                  <tr key={r.recordId || idx} className="border-b">
                    <td className="px-3 py-2 text-gray-700">{r.createdAt || '-'}</td>
                    <td className="px-3 py-2">{r.action === 'submit' ? '提交' : r.action === 'withdraw' ? '撤回' : r.action === 'approve' ? '通过' : r.action === 'reject' ? '驳回' : r.action}</td>
                    <td className="px-3 py-2">{r.operator || '-'}</td>
                    <td className="px-3 py-2">{r.remark || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 备注 Modal（审核通过/驳回） */}
      {showRemarkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowRemarkModal(false)} aria-hidden />
          <div className="relative bg-white rounded-lg shadow-xl w-[400px] p-6">
            <h2 className="text-lg font-semibold mb-3">{remarkAction === 'approve' ? '审核通过' : '驳回'} - 备注</h2>
            <textarea
              value={remarkText}
              onChange={(e) => setRemarkText(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              placeholder="选填"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button type="button" onClick={() => setShowRemarkModal(false)} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">
                取消
              </button>
              <button type="button" onClick={submitRemark} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LogisticsVendorDetailPage;
