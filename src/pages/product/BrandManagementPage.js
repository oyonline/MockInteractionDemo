// src/pages/BrandManagementPage.js
import React, { useState } from 'react';
import { X } from 'lucide-react';

const BrandManagementPage = ({ data: externalData }) => {
  const [filters, setFilters] = useState({ keyword: '', status: '' });
  const [showCreateModal, setShowCreateModal] = useState(false);

  // 支持注入数据；不传则使用本地 mock
  const brandData = externalData ?? [
    {
      id: 'brand-1',
      name: 'KastKing',
      code: 'KK',
      aliasEN: 'KastKing Fishing',
      logo: '🎣',
      status: '启用',
      owner: '李明',
      updateTime: '2024-01-15 10:30',
      relatedSPU: 156,
      relatedSKU: 892
    },
    {
      id: 'brand-2',
      name: 'Piscifun',
      code: 'PF',
      aliasEN: 'Piscifun Outdoor',
      logo: '🐟',
      status: '启用',
      owner: '王芳',
      updateTime: '2024-02-20 14:20',
      relatedSPU: 89,
      relatedSKU: 445
    }
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">品牌管理</h3>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
          >
            + 新建品牌
          </button>
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="品牌名称/编码"
            value={filters.keyword}
            onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
            className="flex-1 px-3 py-2 border rounded-lg text-sm"
          />
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">全部状态</option>
            <option value="启用">启用</option>
            <option value="停用">停用</option>
          </select>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-lg shadow-sm flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead className="bg-gray-50 sticky top-0">
              <tr className="border-b">
                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">Logo</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">品牌名称</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">品牌编码</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">英文名/别名</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">状态</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">负责人</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">关联产品</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">更新时间</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody>
              {brandData.map((brand) => (
                <tr key={brand.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-2xl">{brand.logo}</td>
                  <td className="px-4 py-3 font-medium">{brand.name}</td>
                  <td className="px-4 py-3 font-mono text-xs">{brand.code}</td>
                  <td className="px-4 py-3 text-gray-600">{brand.aliasEN}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        brand.status === '启用'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {brand.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{brand.owner}</td>
                  <td className="px-4 py-3">
                    <div className="text-xs">
                      <span className="text-blue-600">{brand.relatedSPU} SPU</span>
                      <span className="text-gray-400 mx-1">/</span>
                      <span className="text-purple-600">{brand.relatedSKU} SKU</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{brand.updateTime}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-700 text-xs">编辑</button>
                      <button className="text-purple-600 hover:text-purple-700 text-xs">查看关联</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            共 <span className="font-semibold text-gray-800">{brandData.length}</span> 个品牌
          </div>
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-30"
            onClick={() => setShowCreateModal(false)}
          />
          <div className="relative bg-white rounded-lg shadow-xl w-1/2 max-w-2xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold">新建品牌</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  品牌名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="请输入品牌名称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  品牌编码 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="请输入品牌编码（唯一）"
                />
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t bg-gray-50">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100"
              >
                取消
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandManagementPage;
