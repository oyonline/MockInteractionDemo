// src/pages/supply-chain/SafetyStockRuleModal.js
// 销量预计管理 - 安全库存逻辑设定弹窗

import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import * as supplyChainService from '../../services/supply-chain';

const DAY_OPTIONS = supplyChainService.SAFETY_STOCK_DAY_OPTIONS;
const LEVELS = supplyChainService.SAFETY_STOCK_LEVELS;
const MONTH_MODE = supplyChainService.SAFETY_STOCK_MONTH_MODES;
const ALL_MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

function makeEmptyGroup() {
  return { id: `g-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, months: [], skusText: '' };
}

function loadIntoFormState(rule) {
  return {
    hasSafetyStock: !!rule.hasSafetyStock,
    byLevel: !!rule.byLevel,
    daysByLevel: { A: null, B: null, C: null, D: null, E: null, F: null, ...(rule.daysByLevel || {}) },
    monthMode: rule.monthMode || MONTH_MODE.WHOLE_YEAR,
    singleMonths: Array.isArray(rule.singleMonths) ? [...rule.singleMonths] : [],
    multiGroups: Array.isArray(rule.multiGroups) && rule.multiGroups.length
      ? rule.multiGroups.map((g, i) => ({
          id: g.id || `g-${i}-${Math.random().toString(36).slice(2, 6)}`,
          months: Array.isArray(g.months) ? [...g.months] : [],
          skusText: Array.isArray(g.skus) ? g.skus.join('\n') : g.skusText || '',
        }))
      : [makeEmptyGroup()],
  };
}

function MonthCheckboxes({ selected, onChange, idPrefix }) {
  return (
    <div className="grid grid-cols-6 gap-1.5">
      {ALL_MONTHS.map((m) => {
        const checked = selected.includes(m);
        const id = `${idPrefix}-${m}`;
        return (
          <label
            key={m}
            htmlFor={id}
            className={`flex items-center justify-center gap-1 px-2 py-1 rounded border text-xs cursor-pointer ${
              checked
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <input
              id={id}
              type="checkbox"
              className="accent-blue-600"
              checked={checked}
              onChange={() => {
                onChange(
                  checked ? selected.filter((x) => x !== m) : [...selected, m].sort((a, b) => a - b),
                );
              }}
            />
            {m}月
          </label>
        );
      })}
    </div>
  );
}

const SafetyStockRuleModal = ({ open, periodId, periodYm, bu, onClose, onSaved }) => {
  const [form, setForm] = useState(() => loadIntoFormState(supplyChainService.getSalesForecastSafetyStockRule(periodId, bu)));
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (!open) return;
    setForm(loadIntoFormState(supplyChainService.getSalesForecastSafetyStockRule(periodId, bu)));
    setErrors([]);
  }, [open, periodId, bu]);

  const forecastMonths = useMemo(
    () => (open && periodId ? supplyChainService.getSafetyStockForecastMonths(periodId) : []),
    [open, periodId],
  );

  if (!open) return null;

  const setField = (key, val) => setForm((f) => ({ ...f, [key]: val }));
  const setLevelDays = (lv, val) =>
    setForm((f) => ({ ...f, daysByLevel: { ...f.daysByLevel, [lv]: val == null ? null : Number(val) } }));

  const handleSave = () => {
    const payload = {
      hasSafetyStock: form.hasSafetyStock,
      byLevel: form.byLevel,
      daysByLevel: form.daysByLevel,
      monthMode: form.monthMode,
      singleMonths: form.singleMonths,
      multiGroups: form.multiGroups
        .map((g) => ({ months: g.months, skus: supplyChainService.parsePastedSkus(g.skusText) }))
        .filter((g) => g.months.length || g.skus.length),
    };
    const r = supplyChainService.saveSalesForecastSafetyStockRule(periodId, bu, payload);
    if (!r.ok) {
      setErrors(r.errors || ['保存失败']);
      return;
    }
    onSaved?.();
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="px-5 py-3 border-b flex justify-between items-center shrink-0">
          <div>
            <h3 className="text-base font-semibold text-gray-900">安全库存逻辑设定</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              期数 {periodYm || '—'} · BU {bu || '—'}
              {forecastMonths.length === 12 && (
                <span className="ml-2">
                  （对应 {forecastMonths[0]} ~ {forecastMonths[forecastMonths.length - 1]}）
                </span>
              )}
            </p>
          </div>
          <button type="button" onClick={onClose} className="text-gray-500 text-sm hover:text-gray-700">
            关闭
          </button>
        </div>

        <div className="p-5 overflow-auto space-y-5 text-sm">
          {/* 区块 1 */}
          <section className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-gray-500 text-xs w-6">1</span>
              <span className="font-medium text-gray-900">该终版 forecast 是否有安全库存</span>
            </div>
            <div className="ml-9 flex gap-2">
              {[
                { val: true, label: '是' },
                { val: false, label: '否' },
              ].map((o) => (
                <label
                  key={String(o.val)}
                  className={`px-3 py-1.5 rounded border cursor-pointer text-sm ${
                    form.hasSafetyStock === o.val
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="hasSafetyStock"
                    className="mr-1 accent-blue-600"
                    checked={form.hasSafetyStock === o.val}
                    onChange={() => setField('hasSafetyStock', o.val)}
                  />
                  {o.label}
                </label>
              ))}
              <span className="text-xs text-gray-500 self-center ml-2">
                如「否」不展示第二点和第三点
              </span>
            </div>
          </section>

          {form.hasSafetyStock && (
            <>
              {/* 区块 2 */}
              <section className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-gray-500 text-xs w-6">2</span>
                  <span className="font-medium text-gray-900">是否按照层级区分</span>
                </div>
                <div className="ml-9 flex gap-2 mb-3">
                  {[
                    { val: true, label: '是' },
                    { val: false, label: '否' },
                  ].map((o) => (
                    <label
                      key={String(o.val)}
                      className={`px-3 py-1.5 rounded border cursor-pointer text-sm ${
                        form.byLevel === o.val
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="byLevel"
                        className="mr-1 accent-blue-600"
                        checked={form.byLevel === o.val}
                        onChange={() => setField('byLevel', o.val)}
                      />
                      {o.label}
                    </label>
                  ))}
                </div>

                {form.byLevel ? (
                  <>
                    <div className="ml-9 grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {LEVELS.map((lv) => (
                        <label key={lv} className="flex items-center gap-2 text-sm">
                          <span className="w-6 text-gray-700">{lv}</span>
                          <select
                            value={form.daysByLevel[lv] ?? ''}
                            onChange={(e) => setLevelDays(lv, e.target.value === '' ? null : e.target.value)}
                            className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                          >
                            <option value="">安全库存天数</option>
                            {DAY_OPTIONS.map((d) => (
                              <option key={d} value={d}>
                                {d}
                              </option>
                            ))}
                          </select>
                          <span className="text-gray-600">天</span>
                        </label>
                      ))}
                    </div>
                    <p className="ml-9 mt-2 text-[11px] text-gray-500">
                      说明：15 天 ≈ 0.5 个月需求量，以此类推（30 天 = 1 个月、60 天 = 2 个月、90 天 = 3 个月）。
                    </p>
                  </>
                ) : (
                  <p className="ml-9 text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded px-3 py-2">
                    选择「否」时不按 SKU 层级生成安全库存，无需填写安全库存天数。
                  </p>
                )}
              </section>

              {/* 区块 3 */}
              <section className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-gray-500 text-xs w-6">3</span>
                  <span className="font-medium text-gray-900">月份选择</span>
                  <span className="text-xs text-gray-500">（互斥：全年 / 单个特定月份 / 多个特定月份）</span>
                </div>
                <div className="ml-9 flex flex-wrap gap-2 mb-3">
                  {[
                    { val: MONTH_MODE.WHOLE_YEAR, label: '全年（全部）' },
                    { val: MONTH_MODE.SINGLE, label: '单个特定月份' },
                    { val: MONTH_MODE.MULTI, label: '多个特定月份' },
                  ].map((o) => (
                    <label
                      key={o.val}
                      className={`px-3 py-1.5 rounded border cursor-pointer text-sm ${
                        form.monthMode === o.val
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="monthMode"
                        className="mr-1 accent-blue-600"
                        checked={form.monthMode === o.val}
                        onChange={() => setField('monthMode', o.val)}
                      />
                      {o.label}
                    </label>
                  ))}
                </div>

                {form.monthMode === MONTH_MODE.WHOLE_YEAR && (
                  <p className="ml-9 text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded px-3 py-2">
                    自然月 1～12 全部适用；按当前 Forecast 期数对应的 12 个月窗口落地：
                    {forecastMonths.length === 12
                      ? ` ${forecastMonths.join(' / ')}`
                      : ' —'}
                  </p>
                )}

                {form.monthMode === MONTH_MODE.SINGLE && (
                  <div className="ml-9">
                    <div className="text-xs text-gray-600 mb-1">勾选模式（多选 1～12 月）</div>
                    <MonthCheckboxes
                      selected={form.singleMonths}
                      onChange={(v) => setField('singleMonths', v)}
                      idPrefix="single-month"
                    />
                  </div>
                )}

                {form.monthMode === MONTH_MODE.MULTI && (
                  <div className="ml-9 space-y-3">
                    {form.multiGroups.map((g, idx) => (
                      <div key={g.id} className="border border-gray-200 rounded-md p-3 bg-gray-50/40">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-800">第 {idx + 1} 组</span>
                          <button
                            type="button"
                            onClick={() =>
                              setForm((f) => ({
                                ...f,
                                multiGroups: f.multiGroups.filter((x) => x.id !== g.id),
                              }))
                            }
                            disabled={form.multiGroups.length <= 1}
                            className={`text-xs inline-flex items-center gap-1 ${
                              form.multiGroups.length <= 1
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-red-600 hover:text-red-700'
                            }`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            删除该组
                          </button>
                        </div>
                        <div className="mb-2">
                          <div className="text-xs text-gray-600 mb-1">请选择月份（勾选模式）</div>
                          <MonthCheckboxes
                            selected={g.months}
                            onChange={(v) =>
                              setForm((f) => ({
                                ...f,
                                multiGroups: f.multiGroups.map((x) =>
                                  x.id === g.id ? { ...x, months: v } : x,
                                ),
                              }))
                            }
                            idPrefix={`multi-${g.id}`}
                          />
                        </div>
                        <div>
                          <div className="text-xs text-gray-600 mb-1">粘贴汇总 SKU（换行 / 逗号 / 空格分隔）</div>
                          <textarea
                            value={g.skusText}
                            onChange={(e) =>
                              setForm((f) => ({
                                ...f,
                                multiGroups: f.multiGroups.map((x) =>
                                  x.id === g.id ? { ...x, skusText: e.target.value } : x,
                                ),
                              }))
                            }
                            rows={3}
                            placeholder={'例如：\nSKU-001\nSKU-002, SKU-003'}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-xs font-mono"
                          />
                          <div className="text-[11px] text-gray-500 mt-1">
                            已识别 SKU：{supplyChainService.parsePastedSkus(g.skusText).length} 个
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, multiGroups: [...f.multiGroups, makeEmptyGroup()] }))}
                      className="px-3 py-1.5 text-xs rounded border border-dashed border-blue-300 text-blue-700 hover:bg-blue-50 inline-flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      新增一组
                    </button>
                  </div>
                )}
              </section>
            </>
          )}

          {errors.length > 0 && (
            <div className="border border-red-200 bg-red-50 rounded p-3 text-xs text-red-700">
              <div className="font-medium mb-1">请修正以下问题：</div>
              <ul className="list-disc pl-5 space-y-0.5">
                {errors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="px-5 py-3 border-t flex justify-end gap-2 shrink-0 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-1.5 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
};

export default SafetyStockRuleModal;
