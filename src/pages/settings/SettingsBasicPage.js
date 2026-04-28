/** 基础配置页：按分组展示 configItem，编辑/保存/恢复默认，数据走 settingsBasic，写系统日志。 */

import React, { useState, useCallback, useEffect } from 'react';
import { RotateCcw, Save } from 'lucide-react';
import { settingsBasic } from '../../services/settings';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { toast } from '../../components/ui/Toast';
import { confirm } from '../../components/ui/ConfirmDialog';

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
    toast.success('保存成功');
  };

  const handleReset = async () => {
    const ok = await confirm({
      title: '恢复默认配置',
      description: '确定恢复为默认配置？当前修改将丢失。',
      confirmText: '恢复默认',
      cancelText: '取消',
      danger: true,
    });
    if (!ok) return;
    settingsBasic.reset();
    load();
    toast.success('已恢复默认');
  };

  const byGroup = list.reduce((acc, item) => {
    const g = item.group || '通用';
    if (!acc[g]) acc[g] = [];
    acc[g].push(item);
    return acc;
  }, {});

  return (
    <div className="flex min-h-0 flex-col gap-4">
      {/* 顶部标题卡片 */}
      <Card padding="lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ui-page-title text-xl">基础配置</h1>
            <p className="mt-1 text-sm text-text-muted">站点、时区、币种、物流与财务等全局配置，修改后需保存生效。</p>
            {dirty && (
              <p className="mt-2 text-sm text-warning-700">有未保存的更改</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="secondary" icon={RotateCcw} onClick={handleReset}>
              恢复默认
            </Button>
            <Button type="button" icon={Save} onClick={handleSave} disabled={!dirty}>
              保存
            </Button>
          </div>
        </div>
      </Card>

      {/* 按分组卡片 */}
      <div className="flex min-h-0 flex-1 flex-col gap-4">
        {GROUP_ORDER.filter((g) => byGroup[g]?.length).map((group) => (
          <Card key={group} padding="lg">
            <h2 className="ui-section-title mb-4 border-b border-border-subtle pb-2 text-base">{group}</h2>
            <div className="space-y-4">
              {byGroup[group].map((item) => (
                <div key={item.key} className="flex flex-wrap items-start gap-4">
                  <div className="min-w-[200px] flex-shrink-0">
                    <div className="font-medium text-text">{item.label}</div>
                    {item.desc && <div className="mt-0.5 text-xs text-text-subtle">{item.desc}</div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    {item.type === 'text' && (
                      <input
                        type="text"
                        value={item.value ?? ''}
                        onChange={(e) => updateValue(item.key, e.target.value)}
                        className="ui-input max-w-md"
                      />
                    )}
                    {item.type === 'number' && (
                      <input
                        type="number"
                        value={item.value ?? 0}
                        onChange={(e) => updateValue(item.key, Number(e.target.value) || 0)}
                        className="ui-input max-w-[160px]"
                      />
                    )}
                    {item.type === 'select' && (
                      <select
                        value={item.value ?? ''}
                        onChange={(e) => updateValue(item.key, e.target.value)}
                        className="ui-select min-w-[180px]"
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
                          className="h-4 w-4 rounded border-border text-brand-600 focus:ring-brand-500"
                        />
                        <span className="text-sm text-text-muted">{item.value ? '开启' : '关闭'}</span>
                      </label>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SettingsBasicPage;
