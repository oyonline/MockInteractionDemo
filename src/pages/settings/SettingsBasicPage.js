/** 基础配置页：按分组展示 configItem，编辑/保存/恢复默认，数据走 settingsBasic，写系统日志。 */

import React, { useState, useCallback, useEffect } from 'react';
import { RotateCcw, Save } from 'lucide-react';
import { settingsBasic } from '../../services/settings';

const GROUP_ORDER = ['通用', '物流', '销售', '财务'];

const SettingsBasicPage = () => {
  const [list, setList] = useState([]);
  const [initialSnapshot, setInitialSnapshot] = useState('');

  const load = useCallback(() => {
    const data = settingsBasic.get();
    setList(data);
    setInitialSnapshot(JSON.stringify(data.map(({ key, value }) => ({ key, value }))));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const dirty = list.length > 0 && initialSnapshot !== JSON.stringify(list.map(({ key, value }) => ({ key, value })));

  const updateValue = (key, value) => {
    setList((prev) => prev.map((item) => (item.key === key ? { ...item, value } : item)));
  };

  const handleSave = () => {
    settingsBasic.save(list);
    setInitialSnapshot(JSON.stringify(list.map(({ key, value }) => ({ key, value }))));
    window.alert('保存成功');
  };

  const handleReset = () => {
    if (!window.confirm('确定恢复为默认配置？当前修改将丢失。')) return;
    settingsBasic.reset();
    load();
    window.alert('已恢复默认');
  };

  const byGroup = list.reduce((acc, item) => {
    const g = item.group || '通用';
    if (!acc[g]) acc[g] = [];
    acc[g].push(item);
    return acc;
  }, {});

  return (
    <div className="flex flex-col h-full">
      {/* 顶部标题卡片 */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">基础配置</h1>
            <p className="text-sm text-gray-500 mt-1">站点、时区、币种、物流与财务等全局配置，修改后需保存生效。</p>
            {dirty && (
              <p className="text-amber-600 text-sm mt-2">有未保存的更改</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50"
            >
              <RotateCcw className="w-4 h-4" />
              恢复默认
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!dirty}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              保存
            </button>
          </div>
        </div>
      </div>

      {/* 按分组卡片 */}
      <div className="space-y-4 flex-1 min-h-0 overflow-auto">
        {GROUP_ORDER.filter((g) => byGroup[g]?.length).map((group) => (
          <div key={group} className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-800 border-b border-gray-100 pb-2 mb-4">{group}</h2>
            <div className="space-y-4">
              {byGroup[group].map((item) => (
                <div key={item.key} className="flex flex-wrap items-start gap-4">
                  <div className="min-w-[200px] flex-shrink-0">
                    <div className="font-medium text-gray-800">{item.label}</div>
                    {item.desc && <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    {item.type === 'text' && (
                      <input
                        type="text"
                        value={item.value ?? ''}
                        onChange={(e) => updateValue(item.key, e.target.value)}
                        className="w-full max-w-md border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    )}
                    {item.type === 'number' && (
                      <input
                        type="number"
                        value={item.value ?? 0}
                        onChange={(e) => updateValue(item.key, Number(e.target.value) || 0)}
                        className="w-full max-w-[160px] border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    )}
                    {item.type === 'select' && (
                      <select
                        value={item.value ?? ''}
                        onChange={(e) => updateValue(item.key, e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 min-w-[180px]"
                      >
                        {(item.options || []).map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    )}
                    {item.type === 'switch' && (
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!item.value}
                          onChange={(e) => updateValue(item.key, e.target.checked)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{item.value ? '开启' : '关闭'}</span>
                      </label>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsBasicPage;
