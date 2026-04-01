// src/pages/ProductStructurePage.js
import React, { useState } from 'react';
import { ChevronRight, X } from 'lucide-react';

const ProductStructurePage = () => {
  const [filters, setFilters] = useState({
    brand: '',
    category1: '',
    hasTemplate: '',
    templateStatus: '',
    keyword: ''
  });
  const [expandedRows, setExpandedRows] = useState(['brand-1', 'cat1-1', 'cat2-1']);
  const [showBindModal, setShowBindModal] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);

  const structureData = [
    {
      id: 'brand-1',
      type: '品牌',
      name: 'KastKing',
      code: 'KK',
      parentPath: '-',
      template: null,
      inheritFrom: null,
      status: '启用',
      updateBy: '李明',
      updateTime: '2024-01-15',
      children: [
        {
          id: 'cat1-1',
          type: '一级类目',
          name: '钓鱼竿',
          code: 'KK-ROD',
          parentPath: 'KastKing',
          template: null,
          inheritFrom: null,
          status: '启用',
          updateBy: '李明',
          updateTime: '2024-02-10',
          children: [
            {
              id: 'cat2-1',
              type: '二级类目',
              name: '路亚竿',
              code: 'KK-ROD-CAST',
              parentPath: 'KastKing / 钓鱼竿',
              template: null,
              inheritFrom: null,
              status: '启用',
              updateBy: '李明',
              updateTime: '2024-02-15',
              children: [
                {
                  id: 'series-1',
                  type: '系列',
                  name: 'Royale Legend系列',
                  code: 'KK-ROD-CAST-RL',
                  parentPath: 'KastKing / 钓鱼竿 / 路亚竿',
                  template: { name: 'Royale Legend系列属性模板', version: 'V2', status: '已发布' },
                  inheritFrom: null,
                  status: '启用',
                  updateBy: '李明',
                  updateTime: '2024-06-15',
                  children: []
                },
                {
                  id: 'series-2',
                  type: '系列',
                  name: 'Speed Demon系列',
                  code: 'KK-ROD-CAST-SD',
                  parentPath: 'KastKing / 钓鱼竿 / 路亚竿',
                  template: null,
                  inheritFrom: 'Royale Legend系列属性模板',
                  status: '启用',
                  updateBy: '张三',
                  updateTime: '2024-07-20',
                  children: []
                }
              ]
            }
          ]
        }
      ]
    }
  ];

  const toggleRow = (id) => {
    setExpandedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const getTypeColor = (type) => {
    const colors = {
      '品牌': 'bg-red-100 text-red-700',
      '一级类目': 'bg-blue-100 text-blue-700',
      '二级类目': 'bg-green-100 text-green-700',
      '系列': 'bg-purple-100 text-purple-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const renderTreeRow = (node, level = 0) => {
    const isExpanded = expandedRows.includes(node.id);
    const hasChildren = node.children && node.children.length > 0;

    return (
      <React.Fragment key={node.id}>
        <tr className="border-b hover:bg-gray-50">
          <td className="px-4 py-3" style={{ paddingLeft: `${level * 24 + 16}px` }}>
            <div className="flex items-center gap-2">
              {hasChildren ? (
                <button onClick={() => toggleRow(node.id)} className="p-1 hover:bg-gray-200 rounded">
                  <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </button>
              ) : (
                <span className="w-6" />
              )}
              <span className={`px-2 py-1 rounded text-xs ${getTypeColor(node.type)}`}>
                {node.type}
              </span>
            </div>
          </td>
          <td className="px-4 py-3 font-medium">{node.name}</td>
          <td className="px-4 py-3 font-mono text-xs">{node.code}</td>
          <td className="px-4 py-3 text-xs text-gray-600">{node.parentPath}</td>
          <td className="px-4 py-3">
            {node.template ? (
              <div className="text-xs">
                <div className="font-medium">{node.template.name}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded">{node.template.version}</span>
                  <span className={`px-2 py-1 rounded ${node.template.status === '已发布' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {node.template.status}
                  </span>
                </div>
              </div>
            ) : (
              <span className="text-gray-400 text-xs">未绑定</span>
            )}
          </td>
          <td className="px-4 py-3 text-xs text-gray-500">
            {node.inheritFrom ? <div>继承自上级：{node.inheritFrom}</div> : <span className="text-gray-400">-</span>}
          </td>
          <td className="px-4 py-3">
            <span className={`px-2 py-1 rounded text-xs ${node.status === '启用' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
              {node.status}
            </span>
          </td>
          <td className="px-4 py-3 text-xs text-gray-500">
            <div>{node.updateTime}</div>
            <div>{node.updateBy}</div>
          </td>
          <td className="px-4 py-3">
            <div className="flex gap-2">
              <button className="text-blue-600 hover:text-blue-700 text-xs">编辑</button>
              {node.type === '系列' && (
                <button
                  onClick={() => {
                    setSelectedNode(node);
                    setShowBindModal(true);
                  }}
                  className="text-purple-600 hover:text-purple-700 text-xs"
                >
                  绑定模板
                </button>
              )}
            </div>
          </td>
        </tr>
        {hasChildren && isExpanded && node.children.map(child => renderTreeRow(child, level + 1))}
      </React.Fragment>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">产品结构分类</h3>
          <div className="flex gap-2">
            <button className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100">+ 新建节点</button>
            <button className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100">导出</button>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-3">
          <select value={filters.brand} onChange={(e) => setFilters({ ...filters, brand: e.target.value })} className="px-3 py-2 border rounded-lg text-sm">
            <option value="">全部品牌</option>
            <option value="KastKing">KastKing</option>
          </select>
          <select value={filters.category1} onChange={(e) => setFilters({ ...filters, category1: e.target.value })} className="px-3 py-2 border rounded-lg text-sm">
            <option value="">一级类目</option>
            <option value="钓鱼竿">钓鱼竿</option>
          </select>
          <select value={filters.hasTemplate} onChange={(e) => setFilters({ ...filters, hasTemplate: e.target.value })} className="px-3 py-2 border rounded-lg text-sm">
            <option value="">模板绑定状态</option>
            <option value="已绑定">已绑定</option>
            <option value="未绑定">未绑定</option>
          </select>
          <select value={filters.templateStatus} onChange={(e) => setFilters({ ...filters, templateStatus: e.target.value })} className="px-3 py-2 border rounded-lg text-sm">
            <option value="">模板状态</option>
            <option value="已发布">已发布</option>
            <option value="草稿">草稿</option>
          </select>
          <input type="text" placeholder="节点名称/编码" value={filters.keyword} onChange={(e) => setFilters({ ...filters, keyword: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" />
        </div>
      </div>

      <div className="flex-1 bg-white rounded-lg shadow-sm flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0">
              <tr className="border-b">
                <th className="px-4 py-3 text-left font-medium text-gray-600">层级类型</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">名称</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">编码</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">上级路径</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">关联模板</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">继承来源</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">状态</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">更新信息</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody>
              {structureData.map(node => renderTreeRow(node))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            共 <span className="font-semibold text-gray-800">1</span> 个品牌，
            <span className="font-semibold text-gray-800">1</span> 个一级类目，
            <span className="font-semibold text-gray-800">2</span> 个系列
          </div>
          <div className="text-sm">
            <span className="text-amber-600">⚠️ 1个系列未绑定模板</span>
          </div>
        </div>
      </div>

      {showBindModal && selectedNode && (
        <div className="fixed inset-0 z-50 flex items中心 justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-30" onClick={() => setShowBindModal(false)} />
          <div className="relative bg-white rounded-lg shadow-xl w-1/2 max-w-2xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold">绑定属性模板</h3>
              <button onClick={() => setShowBindModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">目标节点</label>
                <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm">
                  {selectedNode.parentPath} / {selectedNode.name}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  选择模板 <span className="text-red-500">*</span>
                </label>
                <select className="w-full px-3 py-2 border rounded-lg">
                  <option value="">请选择已发布的模板</option>
                  <option value="tpl-1">Royale Legend系列属性模板 (V2)</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t bg-gray-50">
              <button onClick={() => setShowBindModal(false)} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100">
                取消
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                确认绑定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductStructurePage;
