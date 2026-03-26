/**
 * 备货试算页：样式与基础交互对齐 SaaS，平台备货试算 + 输入表 + 试算结果 mock。
 * 规则/选渠/真实计价不做；选择 SKU 后自动带出部分基础信息；开始试算生成 mock 结果表。
 */

import React, { useState, useEffect, useRef } from 'react';
import { logisticsService } from '../../services';

const MAIN_TABS = [{ key: 'platform', label: '平台备货试算' }, { key: 'overseas', label: '海外仓备货试算' }];
const RESULT_TABS = [{ key: 'order', label: '订单' }, { key: 'sku', label: 'sku' }];

const PLATFORM_OPTIONS = ['Amazon', 'eBay', 'Wish', '其他'];
const COUNTRY_OPTIONS = ['US', 'DE', 'GB', 'JP', 'FR', 'IT', 'ES', 'CA', 'AU'];
const STORE_OPTIONS = ['KK—US', 'KK—DE', 'KK—UK', 'KK—JP', '其他'];
const STORAGE_TYPE_OPTIONS = ['标准', '大件', '服装', '其他'];
const SHIP_METHOD_OPTIONS = ['海运普船', '海运快船', '空运', '铁路', '卡航', '其他'];

const MOCK_RATE = 7.25;

function planDateDefault() {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().slice(0, 10);
}

function createEmptyRow() {
  return {
    id: 'row_' + Date.now(),
    warehouseId: '',
    platform: '',
    country: '',
    store: '',
    storageType: '',
    skuId: '',
    skuName: '',
    qty: '',
    shipMethod: '',
    planDate: '',
  };
}

function LogisticsTrialCalcPage() {
  const [mainTab, setMainTab] = useState('platform');
  const [resultTab, setResultTab] = useState('order');
  const [rows, setRows] = useState([createEmptyRow()]);
  const [resultList, setResultList] = useState([]);
  const [declarationList, setDeclarationList] = useState([]);
  const [addressList, setAddressList] = useState([]);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');
  const tableWrapRef = useRef(null);

  useEffect(() => {
    const decl = logisticsService.declarations.list({ page: 1, pageSize: 999 });
    const addr = logisticsService.addresses.list({ page: 1, pageSize: 999 });
    setDeclarationList(decl.list || []);
    setAddressList(addr.list || []);
  }, []);

  const getWarehouseLabel = (addr) => {
    if (!addr) return '';
    if (addr.name) return addr.type ? `${addr.name} (${addr.type})` : addr.name;
    return addr.id || '';
  };

  const updateRow = (rowId, updates) => {
    setRows((prev) => prev.map((r) => (r.id === rowId ? { ...r, ...updates } : r)));
  };

  const onSkuChange = (rowId, skuId) => {
    const decl = declarationList.find((d) => d.skuId === skuId);
    const skuName = decl ? (decl.skuName || decl.skuCode || skuId) : '';
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== rowId) return r;
        const next = { ...r, skuId, skuName };
        if (skuId) {
          if (!r.country) next.country = 'US';
          if (!r.platform) next.platform = 'Amazon';
          if (!r.store) next.store = 'KK—US';
          if (!r.storageType) next.storageType = '标准';
          if (!r.shipMethod) next.shipMethod = '海运普船';
          if (!r.planDate) next.planDate = planDateDefault();
          if (r.qty === '' || r.qty == null) next.qty = 1;
        }
        return next;
      })
    );
  };

  const addRow = () => {
    setRows((prev) => [...prev, createEmptyRow()]);
    setTimeout(() => {
      if (tableWrapRef.current) tableWrapRef.current.scrollTop = tableWrapRef.current.scrollHeight;
    }, 50);
  };

  const removeRow = (rowId) => {
    setRows((prev) => {
      const next = prev.filter((r) => r.id !== rowId);
      return next.length ? next : [createEmptyRow()];
    });
  };

  const handleClear = () => {
    setRows([createEmptyRow()]);
    setResultList([]);
  };

  const handleStartCalc = () => {
    const hasEmptySku = rows.some((r) => !r.skuId || !String(r.skuId).trim());
    if (hasEmptySku) {
      window.alert('请先选择SKU');
      return;
    }
    const list = [];
    let batchNo = 1;
    rows.forEach((r) => {
      const qty = Number(r.qty) || 1;
      const count = Math.min(2, Math.max(1, Math.floor(Math.random() * 2) + 1));
      for (let i = 0; i < count; i++) {
        const freight = Math.round(qty * 10 + Math.random() * 50);
        const surcharge = Math.round(qty * 1 + Math.random() * 20);
        list.push({
          id: 'res_' + Date.now() + '_' + batchNo,
          batchNo: 'BATCH-1-' + String(batchNo).padStart(4, '0'),
          warehouse: getWarehouseLabel(addressList.find((a) => a.id === r.warehouseId)) || r.warehouseId || '-',
          platform: r.platform || '-',
          country: r.country || '-',
          store: r.store || '-',
          storageType: r.storageType || '-',
          skuId: r.skuId,
          skuName: r.skuName || '-',
          qty: qty,
          shipMethod: r.shipMethod || '-',
          planDate: r.planDate || '-',
          estimatedFreight: freight,
          otherSurcharge: surcharge,
          totalFreight: freight + surcharge,
          inboundFee: '-',
          miscFee: '-',
        });
        batchNo++;
      }
    });
    setResultList(list);
  };

  const handleImport = () => {
    let arr;
    try {
      arr = JSON.parse(importText || '[]');
      if (!Array.isArray(arr)) throw new Error();
    } catch (e) {
      window.alert('请输入合法 JSON 数组');
      return;
    }
    const next = arr.length
      ? arr.map((item, i) => ({
          id: item.id || 'row_imp_' + Date.now() + '_' + i,
          warehouseId: item.warehouseId ?? '',
          platform: item.platform ?? '',
          country: item.country ?? '',
          store: item.store ?? '',
          storageType: item.storageType ?? '',
          skuId: item.skuId ?? '',
          skuName: item.skuName ?? '',
          qty: item.qty ?? '',
          shipMethod: item.shipMethod ?? '',
          planDate: item.planDate ?? '',
        }))
      : [createEmptyRow()];
    setRows(next);
    setShowImportModal(false);
    setImportText('');
  };

  return (
    <div className="flex flex-col h-full min-h-0 p-6">
      <h1 className="text-lg font-semibold text-gray-800 mb-4">备货试算</h1>

      {/* 顶部 Tab：平台备货试算 / 海外仓备货试算 */}
      <div className="flex gap-1 border-b border-gray-200 mb-4">
        {MAIN_TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setMainTab(t.key)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg border border-b-0 -mb-px ${mainTab === t.key ? 'bg-white border-gray-200 text-blue-600' : 'border-transparent text-gray-600 hover:bg-gray-50'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {mainTab === 'overseas' && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 text-sm text-amber-800">海外仓备货试算为占位，敬请期待。</div>
      )}

      {/* 顶部一行：订单参数配置 / 当前汇率 + 更多 */}
      <div className="flex-shrink-0 flex items-center justify-between mb-4 bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-6">
          <span className="text-sm text-gray-600">订单参数配置</span>
          <span className="text-sm text-gray-600">当前汇率：<span className="font-medium text-gray-800">{MOCK_RATE}</span></span>
        </div>
        <button type="button" className="text-sm text-blue-600 hover:underline">更多</button>
      </div>

      {/* 左侧 / 右侧按钮组 */}
      <div className="flex-shrink-0 flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button type="button" onClick={addRow} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">添加SKU</button>
          <button type="button" onClick={() => setShowImportModal(true)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">导入</button>
          <button type="button" onClick={() => window.alert('原型占位：设置费用')} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">设置费用</button>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={handleStartCalc} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">开始试算</button>
          <button type="button" onClick={handleClear} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">清空</button>
        </div>
      </div>

      {/* 输入表格 */}
      <div className="flex-shrink-0 mb-4">
        <h2 className="text-base font-medium text-gray-800 mb-2 border-l-4 border-blue-600 pl-2">试算输入</h2>
        <div ref={tableWrapRef} className="bg-white rounded-lg border border-gray-200 overflow-auto max-h-[320px]">
          <table className="w-full text-sm min-w-[1100px]">
            <thead className="bg-gray-50 sticky top-0 z-[1]">
              <tr className="border-b">
                <th className="px-3 py-2 text-left font-medium text-gray-600 whitespace-nowrap">发货仓 <span className="text-red-500">*</span></th>
                <th className="px-3 py-2 text-left font-medium text-gray-600 whitespace-nowrap">平台 <span className="text-red-500">*</span></th>
                <th className="px-3 py-2 text-left font-medium text-gray-600 whitespace-nowrap">国家 <span className="text-red-500">*</span></th>
                <th className="px-3 py-2 text-left font-medium text-gray-600 whitespace-nowrap">销售店铺</th>
                <th className="px-3 py-2 text-left font-medium text-gray-600 whitespace-nowrap">亚马逊仓储类型</th>
                <th className="px-3 py-2 text-left font-medium text-gray-600 whitespace-nowrap">SKU</th>
                <th className="px-3 py-2 text-left font-medium text-gray-600 whitespace-nowrap">数量 <span className="text-red-500">*</span></th>
                <th className="px-3 py-2 text-left font-medium text-gray-600 whitespace-nowrap">物流方式</th>
                <th className="px-3 py-2 text-left font-medium text-gray-600 whitespace-nowrap">计划到港/到仓日期</th>
                <th className="px-3 py-2 text-right font-medium text-gray-600 whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <select
                      value={row.warehouseId || ''}
                      onChange={(e) => updateRow(row.id, { warehouseId: e.target.value })}
                      className="w-full min-w-[120px] border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      <option value="">请选择</option>
                      {addressList.map((a) => (
                        <option key={a.id} value={a.id}>{getWarehouseLabel(a)}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <select value={row.platform || ''} onChange={(e) => updateRow(row.id, { platform: e.target.value })} className="w-full min-w-[100px] border border-gray-300 rounded px-2 py-1 text-sm">
                      <option value="">请选择</option>
                      {PLATFORM_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <select value={row.country || ''} onChange={(e) => updateRow(row.id, { country: e.target.value })} className="w-full min-w-[80px] border border-gray-300 rounded px-2 py-1 text-sm">
                      <option value="">请选择</option>
                      {COUNTRY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <select value={row.store || ''} onChange={(e) => updateRow(row.id, { store: e.target.value })} className="w-full min-w-[90px] border border-gray-300 rounded px-2 py-1 text-sm">
                      <option value="">请选择</option>
                      {STORE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <select value={row.storageType || ''} onChange={(e) => updateRow(row.id, { storageType: e.target.value })} className="w-full min-w-[80px] border border-gray-300 rounded px-2 py-1 text-sm">
                      <option value="">请选择</option>
                      {STORAGE_TYPE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <select
                      value={row.skuId || ''}
                      onChange={(e) => onSkuChange(row.id, e.target.value)}
                      className="w-full min-w-[140px] border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      <option value="">请选择</option>
                      {declarationList.map((d) => (
                        <option key={d.skuId} value={d.skuId}>{d.skuId} / {d.skuName}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <input type="number" min={1} value={row.qty ?? ''} onChange={(e) => updateRow(row.id, { qty: e.target.value === '' ? '' : Number(e.target.value) })} className="w-16 border border-gray-300 rounded px-2 py-1 text-sm" placeholder="1" />
                  </td>
                  <td className="px-3 py-2">
                    <select value={row.shipMethod || ''} onChange={(e) => updateRow(row.id, { shipMethod: e.target.value })} className="w-full min-w-[100px] border border-gray-300 rounded px-2 py-1 text-sm">
                      <option value="">请选择</option>
                      {SHIP_METHOD_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <input type="date" value={row.planDate || ''} onChange={(e) => updateRow(row.id, { planDate: e.target.value })} className="w-full min-w-[120px] border border-gray-300 rounded px-2 py-1 text-sm" />
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button type="button" onClick={() => removeRow(row.id)} className="text-red-600 hover:underline text-sm">移除</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 试算结果区 */}
      <div className="flex-1 min-h-0 flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="flex items-center border-b border-gray-200">
          {RESULT_TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => { if (t.key === 'sku') window.alert('原型占位'); setResultTab(t.key); }}
              className={`px-4 py-2 text-sm font-medium border-b-2 ${resultTab === t.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-800'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex-1 min-h-0 overflow-auto p-4">
          {resultTab === 'sku' && (
            <div className="p-6 text-center text-gray-500">原型占位：SKU 维度结果后续开放</div>
          )}
          {resultTab === 'order' && (
            <table className="w-full text-sm min-w-[1000px]">
              <thead className="bg-gray-50 sticky top-0">
                <tr className="border-b">
                  <th className="px-3 py-2 text-left font-medium text-gray-600">批次号</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-600">发货仓</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-600">平台</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-600">国家</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-600">销售店铺</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-600">仓储类型</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-600">SKU</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-600">数量</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-600">物流方式</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-600">计划日期</th>
                  <th className="px-3 py-2 text-right font-medium text-gray-600">预估运费</th>
                  <th className="px-3 py-2 text-right font-medium text-gray-600">其他附加费</th>
                  <th className="px-3 py-2 text-right font-medium text-gray-600">预估总运费</th>
                  <th className="px-3 py-2 text-right font-medium text-gray-600">入库费</th>
                  <th className="px-3 py-2 text-right font-medium text-gray-600">杂费</th>
                </tr>
              </thead>
              <tbody>
                {resultList.length === 0 ? (
                  <tr><td colSpan={15} className="px-3 py-6 text-center text-gray-500">请填写上方试算输入后点击「开始试算」</td></tr>
                ) : (
                  resultList.map((r) => (
                    <tr key={r.id} className="border-b hover:bg-gray-50">
                      <td className="px-3 py-2 font-mono text-gray-800">{r.batchNo}</td>
                      <td className="px-3 py-2">{r.warehouse}</td>
                      <td className="px-3 py-2">{r.platform}</td>
                      <td className="px-3 py-2">{r.country}</td>
                      <td className="px-3 py-2">{r.store}</td>
                      <td className="px-3 py-2">{r.storageType}</td>
                      <td className="px-3 py-2">{r.skuId} / {r.skuName}</td>
                      <td className="px-3 py-2">{r.qty}</td>
                      <td className="px-3 py-2">{r.shipMethod}</td>
                      <td className="px-3 py-2">{r.planDate}</td>
                      <td className="px-3 py-2 text-right">{r.estimatedFreight}</td>
                      <td className="px-3 py-2 text-right">{r.otherSurcharge}</td>
                      <td className="px-3 py-2 text-right font-medium">{r.totalFreight}</td>
                      <td className="px-3 py-2 text-right">{r.inboundFee}</td>
                      <td className="px-3 py-2 text-right">{r.miscFee}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* 导入弹窗 */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowImportModal(false)} aria-hidden />
          <div className="relative bg-white rounded-lg shadow-xl w-[560px] p-6 max-h-[90vh] flex flex-col">
            <h2 className="text-lg font-semibold mb-2">导入试算行</h2>
            <p className="text-sm text-gray-500 mb-3">粘贴 JSON 数组，每项含 warehouseId、platform、country、store、storageType、skuId、skuName、qty、shipMethod、planDate 等。</p>
            <textarea value={importText} onChange={(e) => setImportText(e.target.value)} rows={12} className="w-full border border-gray-300 rounded px-3 py-2 text-sm font-mono overflow-auto" placeholder='[{ "warehouseId": "addr_001", "platform": "Amazon", "country": "US", "skuId": "sku_001", "qty": 10, ... }]' />
            <div className="flex justify-end gap-2 mt-4">
              <button type="button" onClick={() => setShowImportModal(false)} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">取消</button>
              <button type="button" onClick={handleImport} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">导入</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LogisticsTrialCalcPage;
