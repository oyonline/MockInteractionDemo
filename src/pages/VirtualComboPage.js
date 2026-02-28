import React, { useState } from 'react';
import { X, Plus, Package, Tag, ShoppingCart, Gift, Percent, Search, MoreVertical, Edit2, Copy, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const VirtualComboPage = () => {
  const [filters, setFilters] = useState({
    comboCode: '',
    comboType: '',
    virtualSku: '',
    channel: '',
    status: ''
  });
  const [selectedCombo, setSelectedCombo] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // 虚拟组合数据
  const comboData = [
    {
      comboId: 'VC-001',
      comboCode: 'COMBO-RL-SET-2024-001',
      comboName: 'Royale Legend 钓鱼套装（竿+轮）',
      comboType: '套装组合',
      virtualSku: 'VS-RL-SET-7FT-3000',
      channels: ['Amazon US', 'Amazon EU', '独立站'],
      status: '生效',
      effectiveDate: '2024-06-01',
      expiryDate: '2025-06-01',
      totalPrice: 299.99,
      discountPrice: 259.99,
      itemCount: 2,
      creator: '李明',
      updater: '张三',
      updateTime: '2024-05-28 14:30',
      description: '经典路亚竿+纺车轮组合，限时优惠套装',
      items: [
        { sku: 'KK-RL-2024-7FT-M', name: 'Royale Legend 7尺路亚竿', quantity: 1, isGift: false, originalPrice: 189.99, allocateRatio: 65, note: '主推款' },
        { sku: 'KK-MG-2024-3000', name: 'Megatron 3000纺车轮', quantity: 1, isGift: false, originalPrice: 109.99, allocateRatio: 35, note: '搭配款' }
      ],
      changeHistory: [
        { version: 'V1', changeDate: '2024-05-28', changeBy: '李明', changeReason: '创建夏季促销套装', approver: '王总', approvalDate: '2024-05-28' }
      ]
    },
    {
      comboId: 'VC-002',
      comboCode: 'COMBO-SK3-GIFT-2024-001',
      comboName: 'Sharky III 海钓竿买赠活动',
      comboType: '买赠组合',
      virtualSku: 'VS-SK3-GIFT-12FT',
      channels: ['Amazon US', 'eBay'],
      status: '生效',
      effectiveDate: '2024-07-01',
      expiryDate: '2024-12-31',
      totalPrice: 249.99,
      discountPrice: 249.99,
      itemCount: 3,
      creator: '王芳',
      updater: '王芳',
      updateTime: '2024-06-25 10:15',
      description: '购买海钓竿赠送钓鱼线和配件包',
      items: [
        { sku: 'KK-SK3-2024-12FT-H', name: 'Sharky III 12尺海竿', quantity: 1, isGift: false, originalPrice: 249.99, allocateRatio: 85, note: '主品' },
        { sku: 'PF-CARB-2024-20LB-150M', name: '碳素编织线 20磅 150米', quantity: 1, isGift: true, originalPrice: 29.99, allocateRatio: 10, note: '赠品' },
        { sku: 'PF-ACC-STARTER-KIT', name: '海钓入门配件包', quantity: 1, isGift: true, originalPrice: 19.99, allocateRatio: 5, note: '赠品' }
      ],
      changeHistory: [
        { version: 'V1', changeDate: '2024-06-25', changeBy: '王芳', changeReason: '夏季海钓促销活动', approver: '刘总', approvalDate: '2024-06-26' }
      ]
    },
    {
      comboId: 'VC-003',
      comboCode: 'COMBO-TAC-BUNDLE-2024-001',
      comboName: '战术钓鱼包超值捆绑',
      comboType: '捆绑销售',
      virtualSku: 'VS-TAC-BUNDLE-L',
      channels: ['Amazon US', '独立站'],
      status: '待审批',
      effectiveDate: '2025-02-15',
      expiryDate: '2025-08-15',
      totalPrice: 179.97,
      discountPrice: 149.99,
      itemCount: 3,
      creator: '赵敏',
      updater: '赵敏',
      updateTime: '2025-01-20 16:45',
      description: '战术包+配件收纳盒+防水袋捆绑销售',
      items: [
        { sku: 'PF-TAC-2024-L-BK', name: '战术路亚包 L号 黑色', quantity: 1, isGift: false, originalPrice: 89.99, allocateRatio: 60, note: '主品' },
        { sku: 'PF-TAC-ORGANIZER', name: '配件收纳盒套装', quantity: 1, isGift: false, originalPrice: 49.99, allocateRatio: 25, note: '' },
        { sku: 'PF-TAC-DRYBAG', name: '防水储物袋', quantity: 1, isGift: false, originalPrice: 39.99, allocateRatio: 15, note: '' }
      ],
      changeHistory: [
        { version: 'V1', changeDate: '2025-01-20', changeBy: '赵敏', changeReason: '2025春季促销准备', approver: '待审批', approvalDate: '-' }
      ]
    },
    {
      comboId: 'VC-004',
      comboCode: 'COMBO-IC-FULL-2024-001',
      comboName: 'iCool 智能钓箱完整套装',
      comboType: '套装组合',
      virtualSku: 'VS-IC-FULL-25L',
      channels: ['独立站'],
      status: '草稿',
      effectiveDate: '-',
      expiryDate: '-',
      totalPrice: 399.96,
      discountPrice: 349.99,
      itemCount: 4,
      creator: '李明',
      updater: '李明',
      updateTime: '2025-01-25 11:20',
      description: '智能钓箱+配件的完整解决方案',
      items: [
        { sku: 'KK-IC-2024-25L-WH', name: 'iCool 智能钓箱 25L 白色', quantity: 1, isGift: false, originalPrice: 299.99, allocateRatio: 70, note: '主品' },
        { sku: 'KK-IC-BATTERY-EXT', name: '扩展电池组', quantity: 1, isGift: false, originalPrice: 49.99, allocateRatio: 15, note: '' },
        { sku: 'KK-IC-DIVIDER-SET', name: '内部分隔板套装', quantity: 1, isGift: false, originalPrice: 29.99, allocateRatio: 10, note: '' },
        { sku: 'KK-IC-STRAP', name: '背带组件', quantity: 1, isGift: false, originalPrice: 19.99, allocateRatio: 5, note: '' }
      ],
      changeHistory: []
    },
    {
      comboId: 'VC-005',
      comboCode: 'COMBO-STARTER-2024-001',
      comboName: '新手入门钓鱼全套装',
      comboType: '套装组合',
      virtualSku: 'VS-STARTER-KIT-2024',
      channels: ['Amazon US', 'Amazon EU', 'eBay', '独立站'],
      status: '生效',
      effectiveDate: '2024-03-01',
      expiryDate: '2025-12-31',
      totalPrice: 459.95,
      discountPrice: 349.99,
      itemCount: 5,
      creator: '张三',
      updater: '李四',
      updateTime: '2024-02-25 09:00',
      description: '新手入门一站式解决方案，包含竿、轮、线、包、配件',
      items: [
        { sku: 'KK-RL-2024-7FT-M', name: 'Royale Legend 7尺路亚竿', quantity: 1, isGift: false, originalPrice: 189.99, allocateRatio: 40, note: '' },
        { sku: 'KK-MG-2024-3000', name: 'Megatron 3000纺车轮', quantity: 1, isGift: false, originalPrice: 109.99, allocateRatio: 25, note: '' },
        { sku: 'PF-CARB-2024-15LB-200M', name: '碳素编织线 15磅 200米', quantity: 1, isGift: false, originalPrice: 34.99, allocateRatio: 10, note: '' },
        { sku: 'PF-TAC-2024-M-GN', name: '战术路亚包 M号 军绿', quantity: 1, isGift: false, originalPrice: 69.99, allocateRatio: 15, note: '' },
        { sku: 'PF-ACC-STARTER-PRO', name: '新手配件进阶包', quantity: 1, isGift: false, originalPrice: 54.99, allocateRatio: 10, note: '' }
      ],
      changeHistory: [
        { version: 'V1', changeDate: '2024-02-25', changeBy: '张三', changeReason: '创建新手入门套装', approver: '王总', approvalDate: '2024-02-25' },
        { version: 'V2', changeDate: '2024-08-10', changeBy: '李四', changeReason: '调整价格分摊比例', approver: '王总', approvalDate: '2024-08-11' }
      ]
    },
    {
      comboId: 'VC-006',
      comboCode: 'COMBO-XMAS-2024-001',
      comboName: '圣诞限定礼盒套装',
      comboType: '满赠组合',
      virtualSku: 'VS-XMAS-GIFT-2024',
      channels: ['Amazon US', 'Amazon EU'],
      status: '已结束',
      effectiveDate: '2024-12-01',
      expiryDate: '2024-12-31',
      totalPrice: 329.97,
      discountPrice: 279.99,
      itemCount: 3,
      creator: '王芳',
      updater: '王芳',
      updateTime: '2024-11-15 14:00',
      description: '圣诞节限定礼盒，含精美包装',
      items: [
        { sku: 'KK-SD-2024-7FT-XF', name: 'Speed Demon 7尺竞技竿', quantity: 1, isGift: false, originalPrice: 259.99, allocateRatio: 75, note: '' },
        { sku: 'PF-CARB-2024-25LB-150M', name: '碳素编织线 25磅 150米', quantity: 1, isGift: false, originalPrice: 39.99, allocateRatio: 15, note: '' },
        { sku: 'PKG-XMAS-GIFTBOX', name: '圣诞礼盒包装', quantity: 1, isGift: true, originalPrice: 29.99, allocateRatio: 10, note: '限定包装' }
      ],
      changeHistory: [
        { version: 'V1', changeDate: '2024-11-15', changeBy: '王芳', changeReason: '圣诞促销活动', approver: '刘总', approvalDate: '2024-11-16' }
      ]
    },
    {
      comboId: 'VC-007',
      comboCode: 'COMBO-PRO-2025-001',
      comboName: '专业钓手进阶套装',
      comboType: '套装组合',
      virtualSku: 'VS-PRO-ADV-2025',
      channels: ['独立站'],
      status: '待审批',
      effectiveDate: '2025-03-01',
      expiryDate: '2025-12-31',
      totalPrice: 699.96,
      discountPrice: 599.99,
      itemCount: 4,
      creator: '李明',
      updater: '张三',
      updateTime: '2025-01-28 10:30',
      description: '面向专业钓手的高端组合套装',
      items: [
        { sku: 'KK-SD-2024-7FT-XF', name: 'Speed Demon 7尺竞技竿', quantity: 1, isGift: false, originalPrice: 259.99, allocateRatio: 40, note: '' },
        { sku: 'KK-SK3R-2024-5000', name: 'Sharky III 5000海钓轮', quantity: 1, isGift: false, originalPrice: 199.99, allocateRatio: 30, note: '' },
        { sku: 'PF-TAC-2024-XL-BK', name: '战术路亚包 XL号 黑色', quantity: 1, isGift: false, originalPrice: 129.99, allocateRatio: 20, note: '' },
        { sku: 'PF-ACC-PRO-KIT', name: '专业配件套装', quantity: 1, isGift: false, originalPrice: 109.99, allocateRatio: 10, note: '' }
      ],
      changeHistory: [
        { version: 'V1', changeDate: '2025-01-28', changeBy: '李明', changeReason: '2025专业系列上市', approver: '待审批', approvalDate: '-' }
      ]
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      '草稿': 'bg-gray-100 text-gray-700',
      '待审批': 'bg-yellow-100 text-yellow-700',
      '生效': 'bg-green-100 text-green-700',
      '已结束': 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status) => {
    const icons = {
      '草稿': <Clock className="w-3 h-3" />,
      '待审批': <AlertCircle className="w-3 h-3" />,
      '生效': <CheckCircle className="w-3 h-3" />,
      '已结束': <X className="w-3 h-3" />
    };
    return icons[status] || null;
  };

  const getComboTypeColor = (type) => {
    const colors = {
      '套装组合': 'bg-blue-100 text-blue-700',
      '买赠组合': 'bg-purple-100 text-purple-700',
      '捆绑销售': 'bg-orange-100 text-orange-700',
      '满赠组合': 'bg-pink-100 text-pink-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const getComboTypeIcon = (type) => {
    const icons = {
      '套装组合': <Package className="w-3 h-3" />,
      '买赠组合': <Gift className="w-3 h-3" />,
      '捆绑销售': <ShoppingCart className="w-3 h-3" />,
      '满赠组合': <Tag className="w-3 h-3" />
    };
    return icons[type] || null;
  };

  const handleViewCombo = (combo) => {
    setSelectedCombo(combo);
    setDrawerOpen(true);
  };

  const filteredData = comboData.filter(combo => {
    if (filters.comboCode && !combo.comboCode.toLowerCase().includes(filters.comboCode.toLowerCase())) return false;
    if (filters.comboType && combo.comboType !== filters.comboType) return false;
    if (filters.virtualSku && !combo.virtualSku.toLowerCase().includes(filters.virtualSku.toLowerCase())) return false;
    if (filters.channel && !combo.channels.some(c => c.includes(filters.channel))) return false;
    if (filters.status && combo.status !== filters.status) return false;
    return true;
  });

  // 统计数据
  const stats = {
    total: comboData.length,
    active: comboData.filter(c => c.status === '生效').length,
    pending: comboData.filter(c => c.status === '待审批').length,
    draft: comboData.filter(c => c.status === '草稿').length
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* 顶部筛选区 */}
      <div className="bg-white shadow-sm p-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 className="text-xl font-bold whitespace-nowrap">虚拟组合管理</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            新建组合
          </button>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="bg-gray-50 rounded-lg p-3 border">
            <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
            <div className="text-xs text-gray-500">全部组合</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 border border-green-200">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <div className="text-xs text-green-600">生效中</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-xs text-yellow-600">待审批</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 border">
            <div className="text-2xl font-bold text-gray-600">{stats.draft}</div>
            <div className="text-xs text-gray-500">草稿</div>
          </div>
        </div>

        {/* 筛选条件 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="组合编码"
              value={filters.comboCode}
              onChange={(e) => setFilters({...filters, comboCode: e.target.value})}
              className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm"
            />
          </div>
          <select
            value={filters.comboType}
            onChange={(e) => setFilters({...filters, comboType: e.target.value})}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">组合类型</option>
            <option value="套装组合">套装组合</option>
            <option value="买赠组合">买赠组合</option>
            <option value="捆绑销售">捆绑销售</option>
            <option value="满赠组合">满赠组合</option>
          </select>
          <input
            type="text"
            placeholder="虚拟SKU"
            value={filters.virtualSku}
            onChange={(e) => setFilters({...filters, virtualSku: e.target.value})}
            className="px-3 py-2 border rounded-lg text-sm"
          />
          <select
            value={filters.channel}
            onChange={(e) => setFilters({...filters, channel: e.target.value})}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">销售渠道</option>
            <option value="Amazon US">Amazon US</option>
            <option value="Amazon EU">Amazon EU</option>
            <option value="eBay">eBay</option>
            <option value="独立站">独立站</option>
          </select>
          <select
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">全部状态</option>
            <option value="草稿">草稿</option>
            <option value="待审批">待审批</option>
            <option value="生效">生效</option>
            <option value="已结束">已结束</option>
          </select>
        </div>
      </div>

      {/* 组合列表 */}
      <div className="flex-1 overflow-hidden p-4">
        <div className="bg-white rounded-lg shadow-sm h-full flex flex-col">
          <div className="flex-1 overflow-auto">
            <table className="w-full text-sm min-w-[1400px]">
              <thead className="bg-gray-50 sticky top-0">
                <tr className="border-b">
                  <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">组合编码</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">组合名称</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">类型</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">虚拟SKU</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">销售渠道</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">状态</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">有效期</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600 whitespace-nowrap">原价</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600 whitespace-nowrap">售价</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-600 whitespace-nowrap">商品数</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">创建人</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((combo) => (
                  <tr key={combo.comboId} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs whitespace-nowrap">{combo.comboCode}</td>
                    <td className="px-4 py-3">
                      <div className="max-w-[200px]">
                        <div className="font-medium text-gray-900 truncate">{combo.comboName}</div>
                        <div className="text-xs text-gray-500 truncate">{combo.description}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${getComboTypeColor(combo.comboType)}`}>
                        {getComboTypeIcon(combo.comboType)}
                        {combo.comboType}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs whitespace-nowrap">{combo.virtualSku}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1 max-w-[150px]">
                        {combo.channels.slice(0, 2).map((channel, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs whitespace-nowrap">
                            {channel}
                          </span>
                        ))}
                        {combo.channels.length > 2 && (
                          <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                            +{combo.channels.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${getStatusColor(combo.status)}`}>
                        {getStatusIcon(combo.status)}
                        {combo.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap">
                      <div>{combo.effectiveDate}</div>
                      <div className="text-gray-400">至 {combo.expiryDate}</div>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-500 line-through text-xs whitespace-nowrap">
                      ${combo.totalPrice.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-green-600 whitespace-nowrap">
                      ${combo.discountPrice.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                        {combo.itemCount}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap">{combo.creator}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewCombo(combo)}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs whitespace-nowrap"
                        >
                          查看
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 底部统计 */}
          <div className="p-4 border-t bg-gray-50 flex items-center justify-between flex-wrap gap-3">
            <div className="text-sm text-gray-600">
              共 <span className="font-semibold text-gray-800">{filteredData.length}</span> 个组合
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 border rounded hover:bg-gray-100 text-sm">上一页</button>
              <span className="text-sm text-gray-600">1 / 1</span>
              <button className="px-3 py-1 border rounded hover:bg-gray-100 text-sm">下一页</button>
            </div>
          </div>
        </div>
      </div>

      {/* 组合详情抽屉 */}
      {drawerOpen && selectedCombo && (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
          <div
            className="absolute inset-0 bg-black bg-opacity-30"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="relative bg-white w-full max-w-3xl h-full shadow-2xl flex flex-col overflow-hidden">
            {/* 抽屉头部 */}
            <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-bold truncate">{selectedCombo.comboName}</h2>
                <p className="text-sm text-gray-500 mt-1 font-mono">{selectedCombo.comboCode}</p>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg flex-shrink-0 ml-4"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 抽屉内容 */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* 基本信息 */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold mb-4">基本信息</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">组合类型：</span>
                    <span className={`ml-2 inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${getComboTypeColor(selectedCombo.comboType)}`}>
                      {getComboTypeIcon(selectedCombo.comboType)}
                      {selectedCombo.comboType}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">状态：</span>
                    <span className={`ml-2 inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${getStatusColor(selectedCombo.status)}`}>
                      {getStatusIcon(selectedCombo.status)}
                      {selectedCombo.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">虚拟SKU：</span>
                    <span className="ml-2 font-mono text-xs">{selectedCombo.virtualSku}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">生效日期：</span>
                    <span className="ml-2">{selectedCombo.effectiveDate}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">失效日期：</span>
                    <span className="ml-2">{selectedCombo.expiryDate}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">创建人：</span>
                    <span className="ml-2">{selectedCombo.creator}</span>
                  </div>
                  <div className="col-span-2 md:col-span-3">
                    <span className="text-gray-600">销售渠道：</span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedCombo.channels.map((channel, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                          {channel}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-2 md:col-span-3">
                    <span className="text-gray-600">组合说明：</span>
                    <p className="mt-1 text-gray-700">{selectedCombo.description}</p>
                  </div>
                </div>
              </div>

              {/* 价格信息 */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-6 border border-green-200">
                <h3 className="font-semibold mb-4">价格信息</h3>
                <div className="flex items-center gap-8 flex-wrap">
                  <div>
                    <div className="text-xs text-gray-500">原价合计</div>
                    <div className="text-lg text-gray-400 line-through">${selectedCombo.totalPrice.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">组合售价</div>
                    <div className="text-2xl font-bold text-green-600">${selectedCombo.discountPrice.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">优惠金额</div>
                    <div className="text-lg font-semibold text-orange-600">
                      -${(selectedCombo.totalPrice - selectedCombo.discountPrice).toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">折扣率</div>
                    <div className="text-lg font-semibold text-blue-600">
                      {((selectedCombo.discountPrice / selectedCombo.totalPrice) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* 组合明细 */}
              <div className="mb-6">
                <h3 className="font-semibold mb-4">组合明细</h3>
                <div className="overflow-auto">
                  <table className="w-full text-sm border min-w-[700px]">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left border-b whitespace-nowrap">序号</th>
                        <th className="px-3 py-2 text-left border-b whitespace-nowrap">SKU</th>
                        <th className="px-3 py-2 text-left border-b whitespace-nowrap">商品名称</th>
                        <th className="px-3 py-2 text-center border-b whitespace-nowrap">数量</th>
                        <th className="px-3 py-2 text-center border-b whitespace-nowrap">赠品</th>
                        <th className="px-3 py-2 text-right border-b whitespace-nowrap">原价</th>
                        <th className="px-3 py-2 text-right border-b whitespace-nowrap">分摊比例</th>
                        <th className="px-3 py-2 text-right border-b whitespace-nowrap">分摊金额</th>
                        <th className="px-3 py-2 text-left border-b whitespace-nowrap">备注</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCombo.items.map((item, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="px-3 py-2">{index + 1}</td>
                          <td className="px-3 py-2 font-mono text-xs">{item.sku}</td>
                          <td className="px-3 py-2">{item.name}</td>
                          <td className="px-3 py-2 text-center">{item.quantity}</td>
                          <td className="px-3 py-2 text-center">
                            {item.isGift ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-pink-100 text-pink-700 rounded text-xs">
                                <Gift className="w-3 h-3" />
                                赠品
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-right">${item.originalPrice.toFixed(2)}</td>
                          <td className="px-3 py-2 text-right">
                            <span className="inline-flex items-center gap-1 text-blue-600">
                              <Percent className="w-3 h-3" />
                              {item.allocateRatio}%
                            </span>
                          </td>
                          <td className="px-3 py-2 text-right font-semibold">
                            ${(selectedCombo.discountPrice * item.allocateRatio / 100).toFixed(2)}
                          </td>
                          <td className="px-3 py-2 text-gray-600">{item.note || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan="5" className="px-3 py-2 text-right font-semibold">合计</td>
                        <td className="px-3 py-2 text-right line-through text-gray-400">
                          ${selectedCombo.totalPrice.toFixed(2)}
                        </td>
                        <td className="px-3 py-2 text-right text-blue-600">100%</td>
                        <td className="px-3 py-2 text-right font-bold text-green-600">
                          ${selectedCombo.discountPrice.toFixed(2)}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* 变更记录 */}
              <div>
                <h3 className="font-semibold mb-4">变更记录</h3>
                {selectedCombo.changeHistory.length > 0 ? (
                  <div className="space-y-3">
                    {selectedCombo.changeHistory.map((record, index) => (
                      <div key={index} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-mono">
                              {record.version}
                            </span>
                            <span className="text-sm text-gray-600">{record.changeDate}</span>
                          </div>
                          <span className="text-xs text-gray-500">变更人: {record.changeBy}</span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{record.changeReason}</p>
                        <div className="text-xs text-gray-500">
                          审批人: {record.approver} {record.approvalDate !== '-' && `• 审批时间: ${record.approvalDate}`}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    暂无变更记录
                  </div>
                )}
              </div>
            </div>

            {/* 抽屉底部操作 */}
            <div className="p-6 border-t bg-gray-50 flex gap-3 flex-wrap flex-shrink-0">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center gap-2">
                <Edit2 className="w-4 h-4" />
                编辑
              </button>
              {selectedCombo.status === '草稿' && (
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
                  提交审批
                </button>
              )}
              {selectedCombo.status === '待审批' && (
                <>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
                    审批通过
                  </button>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
                    审批驳回
                  </button>
                </>
              )}
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 flex items-center gap-2">
                <Copy className="w-4 h-4" />
                复制
              </button>
              <button className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100">
                导出
              </button>
              {selectedCombo.status === '生效' && (
                <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm hover:bg-red-50">
                  结束组合
                </button>
              )}
              {selectedCombo.status === '草稿' && (
                <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm hover:bg-red-50 flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  删除
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 新建组合模态框 */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-30"
            onClick={() => setShowCreateModal(false)}
          />
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold">新建虚拟组合</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">组合名称 *</label>
                    <input type="text" className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="输入组合名称" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">组合类型 *</label>
                    <select className="w-full px-3 py-2 border rounded-lg text-sm">
                      <option value="">请选择</option>
                      <option value="套装组合">套装组合</option>
                      <option value="买赠组合">买赠组合</option>
                      <option value="捆绑销售">捆绑销售</option>
                      <option value="满赠组合">满赠组合</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">虚拟SKU *</label>
                    <input type="text" className="w-full px-3 py-2 border rounded-lg text-sm font-mono" placeholder="VS-XXX-XXX" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">组合售价 *</label>
                    <input type="number" className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="0.00" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">生效日期</label>
                    <input type="date" className="w-full px-3 py-2 border rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">失效日期</label>
                    <input type="date" className="w-full px-3 py-2 border rounded-lg text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">销售渠道</label>
                  <div className="flex flex-wrap gap-2">
                    {['Amazon US', 'Amazon EU', 'eBay', '独立站'].map(channel => (
                      <label key={channel} className="flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">{channel}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">组合说明</label>
                  <textarea className="w-full px-3 py-2 border rounded-lg text-sm" rows="3" placeholder="输入组合说明..."></textarea>
                </div>

                {/* 组合商品 */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">组合商品</label>
                    <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
                      <Plus className="w-4 h-4" />
                      添加商品
                    </button>
                  </div>
                  <div className="border rounded-lg p-4 bg-gray-50 text-center text-gray-400 text-sm">
                    点击上方"添加商品"按钮添加组合商品
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100"
              >
                取消
              </button>
              <button className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700">
                保存草稿
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                保存并提交审批
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VirtualComboPage;
