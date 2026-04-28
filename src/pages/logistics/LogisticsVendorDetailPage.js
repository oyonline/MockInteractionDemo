/**
 * 物流商详情页：业务 Tabs（资质/联系/银行/审批），保存走 vendors.update(id, patch)。
 */

import React, { useState, useEffect } from 'react';
import { logisticsService } from '../../services';
import { toast } from '../../components/ui/Toast';

const APPROVAL_LABEL = { draft: '草稿', pending: '待审批', approved: '已通过', rejected: '已驳回' };
const VENDOR_TABS = [
  { key: 'qualification', label: '资质信息' },
  { key: 'contact', label: '联系信息' },
  { key: 'bank', label: '银行账号' },
  { key: 'approval', label: '审批信息' },
];

function parseBankInfo(v) {
  if (v == null) return { bankName: '', bankAccountName: '', bankAccountNo: '' };
  if (typeof v === 'string') {
    try {
      const o = JSON.parse(v);
      return { bankName: o.bankName ?? '', bankAccountName: o.bankAccountName ?? o.accountName ?? '', bankAccountNo: o.bankAccountNo ?? o.account ?? '' };
    } catch {
      return { bankName: '', bankAccountName: '', bankAccountNo: '', note: v };
    }
  }
  return {
    bankName: v.bankName ?? '',
    bankAccountName: v.bankAccountName ?? v.accountName ?? '',
    bankAccountNo: v.bankAccountNo ?? v.account ?? '',
  };
}

function LogisticsVendorDetailPage({ tab }) {
  const id = tab?.data?.id ?? (tab?.path || '').split('/').pop();
  const [vendor, setVendor] = useState(null);
  const [activeTab, setActiveTab] = useState('qualification');
  const [form, setForm] = useState({
    code: '', name: '', shortName: '', status: 'enabled', updatedAt: '',
    contractEntity: '', settlementType: '月结', accountPeriodDays: '', contractStart: '', contractEnd: '', qualificationFiles: '',
    contact: { name: '', phone: '', email: '' }, remark: '',
    bankName: '', bankAccountName: '', bankAccountNo: '',
  });
  const [approvalRecords, setApprovalRecords] = useState([]);
  const [showRemarkModal, setShowRemarkModal] = useState(false);
  const [remarkAction, setRemarkAction] = useState(null);
  const [remarkText, setRemarkText] = useState('');

  useEffect(() => {
    if (!id) return;
    const v = logisticsService.vendors.get(id);
    setVendor(v);
    if (v) {
      const bank = parseBankInfo(v.bankInfo);
      setForm({
        code: v.code || '',
        name: v.name || '',
        shortName: v.shortName || '',
        status: v.status || 'enabled',
        updatedAt: v.updatedAt || '',
        contractEntity: v.contractEntity ?? '',
        settlementType: v.settlementType ?? '月结',
        accountPeriodDays: v.accountPeriodDays ?? '',
        contractStart: v.contractStart ?? '',
        contractEnd: v.contractEnd ?? '',
        qualificationFiles: v.qualificationFiles ?? '',
        contact: v.contact && typeof v.contact === 'object' ? { name: v.contact.name ?? '', phone: v.contact.phone ?? '', email: v.contact.email ?? '' } : { name: '', phone: '', email: '' },
        remark: v.remark ?? '',
        bankName: bank.bankName,
        bankAccountName: bank.bankAccountName,
        bankAccountNo: bank.bankAccountNo,
      });
      setApprovalRecords(logisticsService.approvals.listByEntity('vendor', id));
    }
  }, [id]);

  const refresh = () => {
    const v = logisticsService.vendors.get(id);
    setVendor(v);
    if (v) {
      const bank = parseBankInfo(v.bankInfo);
      setForm((prev) => ({
        ...prev,
        name: v.name || '',
        shortName: v.shortName || '',
        status: v.status || 'enabled',
        updatedAt: v.updatedAt || '',
        contractEntity: v.contractEntity ?? '',
        settlementType: v.settlementType ?? '月结',
        accountPeriodDays: v.accountPeriodDays ?? '',
        contractStart: v.contractStart ?? '',
        contractEnd: v.contractEnd ?? '',
        qualificationFiles: v.qualificationFiles ?? '',
        contact: v.contact && typeof v.contact === 'object' ? { name: v.contact.name ?? '', phone: v.contact.phone ?? '', email: v.contact.email ?? '' } : prev.contact,
        remark: v.remark ?? '',
        bankName: bank.bankName,
        bankAccountName: bank.bankAccountName,
        bankAccountNo: bank.bankAccountNo,
      }));
      setApprovalRecords(logisticsService.approvals.listByEntity('vendor', id));
    }
  };

  const saveForm = () => {
    if (!id) return;
    const contact = (form.contact?.name || form.contact?.phone || form.contact?.email) ? form.contact : null;
    const bankInfo = (form.bankName || form.bankAccountName || form.bankAccountNo)
      ? { bankName: form.bankName, bankAccountName: form.bankAccountName, bankAccountNo: form.bankAccountNo }
      : null;
    logisticsService.vendors.update(id, {
      name: form.name,
      shortName: form.shortName,
      status: form.status,
      contractEntity: form.contractEntity || undefined,
      settlementType: form.settlementType,
      accountPeriodDays: form.accountPeriodDays === '' ? undefined : Number(form.accountPeriodDays),
      contractStart: form.contractStart || undefined,
      contractEnd: form.contractEnd || undefined,
      qualificationFiles: form.qualificationFiles || undefined,
      contact,
      remark: form.remark || undefined,
      bankInfo,
    });
    toast.success('已保存');
    refresh();
  };

  const handleSubmit = () => {
    const res = logisticsService.vendors.submit(id);
    if (res && res.ok === false) toast.error(res.message || '提交失败');
    else refresh();
  };

  const handleWithdraw = () => {
    const res = logisticsService.vendors.withdraw(id);
    if (res && res.ok === false) toast.error(res.message || '撤回失败');
    else refresh();
  };

  const openRemark = (action) => { setRemarkAction(action); setRemarkText(''); setShowRemarkModal(true); };

  const submitRemark = () => {
    if (remarkAction === 'approve') { const res = logisticsService.vendors.approve(id, remarkText); if (res && res.ok === false) toast.error(res.message); }
    else if (remarkAction === 'reject') { const res = logisticsService.vendors.reject(id, remarkText); if (res && res.ok === false) toast.error(res.message); }
    setShowRemarkModal(false);
    refresh();
  };

  if (!id) return <div className="p-6 text-gray-500">缺少 id</div>;
  if (vendor === null) return <div className="p-6"><p className="text-gray-500 mb-4">未找到该物流商</p><p className="text-sm text-gray-400">请从列表页重新打开或切换其他 Tab。</p></div>;

  const canSubmit = vendor.approvalStatus === 'draft' || vendor.approvalStatus === 'rejected';
  const canWithdraw = vendor.approvalStatus === 'pending';
  const canApproveReject = vendor.approvalStatus === 'pending';

  return (
    <div className="flex flex-col h-full min-h-0 p-6">
      {/* 头部：固定 */}
      <div className="flex-shrink-0 flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-800">物流商详情</h1>
          <p className="text-sm text-gray-500 mt-0.5">{[form.code, form.name].filter(Boolean).join(' / ') || '-'}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-2 py-0.5 rounded text-xs ${form.status === 'enabled' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{form.status === 'enabled' ? '启用' : '禁用'}</span>
          <span className={`px-2 py-0.5 rounded text-xs ${vendor.approvalStatus === 'approved' ? 'bg-green-100 text-green-700' : vendor.approvalStatus === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>{APPROVAL_LABEL[vendor.approvalStatus] || vendor.approvalStatus}</span>
          <button type="button" onClick={saveForm} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">保存</button>
        </div>
      </div>

      {/* Tab 按钮 */}
      <div className="flex-shrink-0 flex gap-1 border-b border-gray-200 mb-4">
        {VENDOR_TABS.map((t) => (
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

      {/* 内容区：可滚动 */}
      <div className="flex-1 min-h-0 overflow-auto">
        {activeTab === 'qualification' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-base font-medium text-gray-800 mb-4 border-l-4 border-blue-600 pl-2">资质信息</h2>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm text-gray-600 mb-1">合同主体</label><input type="text" value={form.contractEntity} onChange={(e) => setForm((f) => ({ ...f, contractEntity: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" placeholder="可选" /></div>
              <div><label className="block text-sm text-gray-600 mb-1">结款方式</label><select value={form.settlementType} onChange={(e) => setForm((f) => ({ ...f, settlementType: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm"><option value="月结">月结</option><option value="现结">现结</option><option value="周结">周结</option><option value="其他">其他</option></select></div>
              <div><label className="block text-sm text-gray-600 mb-1">账期（天）</label><input type="number" value={form.accountPeriodDays} onChange={(e) => setForm((f) => ({ ...f, accountPeriodDays: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" placeholder="可选" /></div>
              <div><label className="block text-sm text-gray-600 mb-1">合同开始</label><input type="date" value={form.contractStart} onChange={(e) => setForm((f) => ({ ...f, contractStart: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" /></div>
              <div><label className="block text-sm text-gray-600 mb-1">合同结束</label><input type="date" value={form.contractEnd} onChange={(e) => setForm((f) => ({ ...f, contractEnd: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" /></div>
              <div className="col-span-2"><label className="block text-sm text-gray-600 mb-1">资质附件</label><button type="button" className="px-3 py-2 border border-gray-300 rounded text-sm text-gray-500 bg-gray-50 cursor-not-allowed">上传/选择文件（占位）</button></div>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-base font-medium text-gray-800 mb-4 border-l-4 border-blue-600 pl-2">联系信息</h2>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm text-gray-600 mb-1">联系人姓名</label><input type="text" value={form.contact?.name ?? ''} onChange={(e) => setForm((f) => ({ ...f, contact: { ...(f.contact || {}), name: e.target.value } }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" /></div>
              <div><label className="block text-sm text-gray-600 mb-1">电话</label><input type="text" value={form.contact?.phone ?? ''} onChange={(e) => setForm((f) => ({ ...f, contact: { ...(f.contact || {}), phone: e.target.value } }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" /></div>
              <div className="col-span-2"><label className="block text-sm text-gray-600 mb-1">邮箱</label><input type="text" value={form.contact?.email ?? ''} onChange={(e) => setForm((f) => ({ ...f, contact: { ...(f.contact || {}), email: e.target.value } }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" /></div>
              <div className="col-span-2"><label className="block text-sm text-gray-600 mb-1">备注</label><textarea value={form.remark} onChange={(e) => setForm((f) => ({ ...f, remark: e.target.value }))} rows={2} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" placeholder="可选" /></div>
            </div>
          </div>
        )}

        {activeTab === 'bank' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-base font-medium text-gray-800 mb-4 border-l-4 border-blue-600 pl-2">银行账号</h2>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm text-gray-600 mb-1">开户行</label><input type="text" value={form.bankName} onChange={(e) => setForm((f) => ({ ...f, bankName: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" /></div>
              <div><label className="block text-sm text-gray-600 mb-1">户名</label><input type="text" value={form.bankAccountName} onChange={(e) => setForm((f) => ({ ...f, bankAccountName: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" /></div>
              <div className="col-span-2"><label className="block text-sm text-gray-600 mb-1">账号</label><input type="text" value={form.bankAccountNo} onChange={(e) => setForm((f) => ({ ...f, bankAccountNo: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" /></div>
            </div>
          </div>
        )}

        {activeTab === 'approval' && (
          <>
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h2 className="text-base font-medium text-gray-800 mb-4 border-l-4 border-amber-500 pl-2">审批操作</h2>
              <p className="text-sm text-gray-600 mb-3">当前状态：<span className="font-medium">{APPROVAL_LABEL[vendor.approvalStatus] || vendor.approvalStatus}</span></p>
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

export default LogisticsVendorDetailPage;
