// src/pages/CategoryTemplatePage.js
import React, { useState } from 'react';
import { X } from 'lucide-react';

const CategoryTemplatePage = () => {
  const [filters, setFilters] = useState({ keyword: '', status: '' });
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // mock 数据：后续可替换为接口返回
  const templateData = [
    {
      id: 'tpl-1',
      name: 'Royale Legend系列属性模板',
      bindingObject: 'KastKing / 钓鱼竿 / 路亚竿 / Royale Legend系列',
      currentVersion: 'V2',
      status: '已发布',
      effectiveDate: '2024-06-15',
      attributeCount: 18,
      lastUpdatedBy: '李明',
      updateTime: '2024-06-15 10:30',
      attributes: [
        { group: '基础参数', name: '长度', code: 'length', level: 'SPU', type: '枚举', required: true, impactFlag: '齿杆', enabled: true },
        { group: '基础参数', name: '调性', code: 'action', level: 'SPU', type: '枚举', required: true, impactFlag: '微调旋钮', enabled: true },
        { group: '基础参数', name: '颜色', code: 'color', level: 'SKU', type: '枚举', required: true, impactFlag: '', enabled: true },
        { group: '物理属性', name: '重量', code: 'weight', level: 'SKU', type: '数值', required: true, impactFlag: '收线速率', enabled: true }
      ]
    },
    {
      id: 'tpl-2',
      name: 'Megatron系列属性模板',
      bindingObject: 'KastKing / 渔线轮 / 纺车轮 / Megatron系列',
      currentVersion: 'V1',
      status: '已发布',
      effectiveDate: '2024-05-20',
      attributeCount: 15,
      lastUpdatedBy: '王芳',
      updateTime: '2024-05-20 14:20',
      attributes: [
        { group: '基础参数', name: '型号', code: 'model', level: 'SPU', type: '枚举', required: true, impactFlag: '泄力报警', enabled: true },
        { group: '基础参数', name: '手向', code: 'handedness', level: 'SKU', type: '枚举', required: true, impactFlag: '捏手', enabled: true }
      ]
    }
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">类目属性模板管理</h3>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
            + 新建模板
          </button>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="模板名称"
            value={filters.keyword}
            onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
            className="px-3 py-2 border rounded-lg text-sm"
          />
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">全部状态</option>
            <option value="已发布">已发布</option>
            <option value="草稿">草稿</option>
          </select>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-lg shadow-sm flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0">
              <tr className="border-b">
                <th className="px-4 py-3 text-left font-medium text-gray-600">模板名称</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">绑定对象</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">当前版本</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">状态</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">生效时间</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">属性项数</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">更新信息</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody>
              {templateData.map((tpl) => (
                <tr key={tpl.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{tpl.name}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{tpl.bindingObject}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs">
                      {tpl.currentVersion}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${tpl.status === '已发布' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {tpl.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs">{tpl.effectiveDate}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                      {tpl.attributeCount}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    <div>{tpl.updateTime}</div>
                    <div>{tpl.lastUpdatedBy}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setSelectedTemplate(tpl); setDrawerOpen(true); }}
                        className="text-blue-600 hover:text-blue-700 text-xs"
                      >
                        查看
                      </button>
                      <button className="text-green-600 hover:text-green-700 text-xs">编辑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            共 <span className="font-semibold text-gray-800">{templateData.length}</span> 个模板
          </div>
        </div>
      </div>

      {drawerOpen && selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
          <div
            className="absolute inset-0 bg-black bg-opacity-30"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="relative bg-white w-[50vw] min-w-[600px] h-full shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-bold">{selectedTemplate.name}</h2>
                <p className="text-sm text-gray-500 mt-1">{selectedTemplate.bindingObject}</p>
              </div>
              <button onClick={() => setDrawerOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold mb-4">基本信息</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">当前版本：</span>
                    <span className="ml-2 font-mono">{selectedTemplate.currentVersion}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">状态：</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${selectedTemplate.status === '已发布' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {selectedTemplate.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">生效时间：</span>
                    <span className="ml-2">{selectedTemplate.effectiveDate}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">属性项预览</h3>
                <table className="w-full text-sm border">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left border-b">分组</th>
                      <th className="px-3 py-2 text-left border-b">属性名</th>
                      <th className="px-3 py-2 text-left border-b">编码</th>
                      <th className="px-3 py-2 text-left border-b">层级</th>
                      <th className="px-3 py-2 text-left border-b">类型</th>
                      <th className="px-3 py-2 text-left border-b">必填</th>
                      <th className="px-3 py-2 text-left border-b">影响标记</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedTemplate.attributes.map((attr, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="px-3 py-2">{attr.group}</td>
                        <td className="px-3 py-2">{attr.name}</td>
                        <td className="px-3 py-2 font-mono text-xs">{attr.code}</td>
                        <td className="px-3 py-2">
                          <span className={`px-2 py-1 rounded text-xs ${attr.level === 'SPU' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                            {attr.level}
                          </span>
                        </td>
                        <td className="px-3 py-2">{attr.type}</td>
                        <td className="px-3 py-2">{attr.required ? <span className="text-red-600">是</span> : <span className="text-gray-400">否</span>}</td>
                        <td className="px-3 py-2">
                          {attr.impactFlag && (
                            <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs">
                              {attr.impactFlag}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex gap-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                编辑模板
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">
                复制新版本
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryTemplatePage;
