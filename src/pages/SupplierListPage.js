// src/pages/SupplierListPage.js
import React, { useState, useMemo } from 'react';
import { X, Search, Plus, Edit2, Eye, Phone, Mail, MapPin, Star, TrendingUp } from 'lucide-react';

const SupplierListPage = ({ data: externalData, onOpenDetail }) => {
  const [filters, setFilters] = useState({
    keyword: '',
    type: '',
    status: '',
    rating: '',
    category: ''
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Mock数据
  const defaultSupplierData = useMemo(() => [
    {
      id: 'supplier-1',
      code: 'SUP-001',
      name: '深圳市渔具制造有限公司',
      shortName: '深圳渔具',
      type: '生产商',
      category: '渔具配件',
      contact: '张经理',
      phone: '13800138001',
      email: 'zhangmgr@fishing.com',
      address: '深圳市宝安区沙井街道新和大道100号',
      status: '启用',
      rating: 'A',
      cooperationDate: '2022-03-15',
      relatedSKU: 156,
      recentOrderAmount: 125600,
      paymentTerms: '月结30天',
      taxRate: 13,
      bankAccount: '招商银行深圳分行 6226****8899',
      businessLicense: '91440300MA5F****XY',
      qualifications: ['ISO9001', 'ISO14001'],
      updateTime: '2024-01-20 15:30',
      createTime: '2022-03-10 09:00'
    },
    {
      id: 'supplier-2',
      code: 'SUP-002',
      name: '东莞市户外用品贸易有限公司',
      shortName: '东莞户外',
      type: '贸易商',
      category: '户外装备',
      contact: '李总',
      phone: '13900139002',
      email: 'li@outdoor-trade.com',
      address: '东莞市虎门镇太平路88号',
      status: '启用',
      rating: 'B',
      cooperationDate: '2023-01-20',
      relatedSKU: 89,
      recentOrderAmount: 78900,
      paymentTerms: '预付50%',
      taxRate: 13,
      bankAccount: '中国银行东莞分行 6217****5566',
      businessLicense: '91441900MA5G****AB',
      qualifications: ['ISO9001'],
      updateTime: '2024-02-15 10:20',
      createTime: '2023-01-15 14:30'
    },
    {
      id: 'supplier-3',
      code: 'SUP-003',
      name: '宁波精密零件加工厂',
      shortName: '宁波精密',
      type: 'OEM',
      category: '精密配件',
      contact: '王工',
      phone: '13700137003',
      email: 'wang@precision-parts.com',
      address: '宁波市北仑区小港工业园区',
      status: '启用',
      rating: 'A',
      cooperationDate: '2021-06-01',
      relatedSKU: 234,
      recentOrderAmount: 256000,
      paymentTerms: '月结45天',
      taxRate: 13,
      bankAccount: '工商银行宁波分行 6222****7788',
      businessLicense: '91330206MA5H****CD',
      qualifications: ['ISO9001', 'IATF16949'],
      updateTime: '2024-03-01 09:15',
      createTime: '2021-05-25 11:00'
    },
    {
      id: 'supplier-4',
      code: 'SUP-004',
      name: '广州包装材料有限公司',
      shortName: '广州包装',
      type: '生产商',
      category: '包装材料',
      contact: '陈经理',
      phone: '13600136004',
      email: 'chen@gz-package.com',
      address: '广州市白云区太和镇大源中路',
      status: '停用',
      rating: 'C',
      cooperationDate: '2022-08-10',
      relatedSKU: 45,
      recentOrderAmount: 32000,
      paymentTerms: '现结',
      taxRate: 13,
      bankAccount: '建设银行广州分行 6227****4455',
      businessLicense: '91440111MA5J****EF',
      qualifications: ['FSC'],
      updateTime: '2023-12-20 16:40',
      createTime: '2022-08-05 10:30'
    },
    {
      id: 'supplier-5',
      code: 'SUP-005',
      name: '义乌小商品批发中心',
      shortName: '义乌批发',
      type: '贸易商',
      category: '五金配件',
      contact: '周老板',
      phone: '13500135005',
      email: 'zhou@yiwu-wholesale.com',
      address: '浙江省义乌市国际商贸城A区',
      status: '启用',
      rating: 'B',
      cooperationDate: '2023-05-15',
      relatedSKU: 312,
      recentOrderAmount: 89500,
      paymentTerms: '预付全款',
      taxRate: 3,
      bankAccount: '农业银行义乌分行 6228****1122',
      businessLicense: '91330782MA5K****GH',
      qualifications: [],
      updateTime: '2024-02-28 11:25',
      createTime: '2023-05-10 15:00'
    },
    {
      id: 'supplier-6',
      code: 'SUP-006',
      name: '佛山市金属制品有限公司',
      shortName: '佛山金属',
      type: '生产商',
      category: '金属配件',
      contact: '黄厂长',
      phone: '13400134006',
      email: 'huang@fs-metal.com',
      address: '佛山市南海区狮山镇科技工业园',
      status: '启用',
      rating: 'A',
      cooperationDate: '2020-11-20',
      relatedSKU: 178,
      recentOrderAmount: 198000,
      paymentTerms: '月结30天',
      taxRate: 13,
      bankAccount: '交通银行佛山分行 6222****3344',
      businessLicense: '91440605MA5L****IJ',
      qualifications: ['ISO9001', 'ISO14001', 'OHSAS18001'],
      updateTime: '2024-03-05 14:50',
      createTime: '2020-11-15 09:30'
    },
    {
      id: 'supplier-7',
      code: 'SUP-007',
      name: '苏州电子元器件有限公司',
      shortName: '苏州电子',
      type: 'OEM',
      category: '电子元件',
      contact: '吴经理',
      phone: '13300133007',
      email: 'wu@sz-electronics.com',
      address: '苏州市工业园区星湖街328号',
      status: '启用',
      rating: 'A',
      cooperationDate: '2021-09-01',
      relatedSKU: 95,
      recentOrderAmount: 145000,
      paymentTerms: '月结60天',
      taxRate: 13,
      bankAccount: '浦发银行苏州分行 6225****5566',
      businessLicense: '91320594MA5M****KL',
      qualifications: ['ISO9001', 'ISO14001', 'IATF16949'],
      updateTime: '2024-01-10 08:45',
      createTime: '2021-08-28 16:20'
    },
    {
      id: 'supplier-8',
      code: 'SUP-008',
      name: '温州塑料制品厂',
      shortName: '温州塑料',
      type: '生产商',
      category: '塑料配件',
      contact: '郑老板',
      phone: '13200132008',
      email: 'zheng@wz-plastic.com',
      address: '温州市龙湾区永中街道工业区',
      status: '待审核',
      rating: '-',
      cooperationDate: '-',
      relatedSKU: 0,
      recentOrderAmount: 0,
      paymentTerms: '-',
      taxRate: 13,
      bankAccount: '民生银行温州分行 6226****7788',
      businessLicense: '91330303MA5N****MN',
      qualifications: ['ISO9001'],
      updateTime: '2024-03-08 10:00',
      createTime: '2024-03-08 10:00'
    }
  ], []);
  const supplierData = externalData ?? defaultSupplierData;

  // 类型和评级选项
  const typeOptions = ['生产商', '贸易商', 'OEM'];
  const statusOptions = ['启用', '停用', '待审核'];
  const ratingOptions = ['A', 'B', 'C', 'D'];
  const categoryOptions = [...new Set(supplierData.map(s => s.category))];

  // 筛选数据
  const filteredData = useMemo(() => {
    return supplierData.filter(item => {
      const matchKeyword = !filters.keyword ||
        item.name.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        item.code.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        item.shortName.toLowerCase().includes(filters.keyword.toLowerCase());
      const matchType = !filters.type || item.type === filters.type;
      const matchStatus = !filters.status || item.status === filters.status;
      const matchRating = !filters.rating || item.rating === filters.rating;
      const matchCategory = !filters.category || item.category === filters.category;
      return matchKeyword && matchType && matchStatus && matchRating && matchCategory;
    });
  }, [supplierData, filters]);

  // 分页数据
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  // 重置筛选
  const resetFilters = () => {
    setFilters({ keyword: '', type: '', status: '', rating: '', category: '' });
    setCurrentPage(1);
  };

  // 获取评级颜色
  const getRatingColor = (rating) => {
    const colors = {
      'A': 'bg-green-100 text-green-700',
      'B': 'bg-blue-100 text-blue-700',
      'C': 'bg-yellow-100 text-yellow-700',
      'D': 'bg-red-100 text-red-700',
      '-': 'bg-gray-100 text-gray-500'
    };
    return colors[rating] || 'bg-gray-100 text-gray-500';
  };

  // 获取状态颜色
  const getStatusColor = (status) => {
    const colors = {
      '启用': 'bg-green-100 text-green-700',
      '停用': 'bg-gray-100 text-gray-500',
      '待审核': 'bg-orange-100 text-orange-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-500';
  };

  // 格式化金额
  const formatAmount = (amount) => {
    if (amount >= 10000) {
      return `¥${(amount / 10000).toFixed(2)}万`;
    }
    return `¥${amount.toLocaleString()}`;
  };

  // 打开编辑模态框
  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setShowCreateModal(true);
  };

  // 打开详情
  const handleViewDetail = (supplier) => {
    if (onOpenDetail) {
      onOpenDetail({
        id: `supplier-detail-${supplier.id}`,
        name: `供应商详情: ${supplier.shortName}`,
        path: '/procurement/supplier/detail',
        data: supplier
      });
    }
  };

  // 关闭模态框
  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingSupplier(null);
  };

  // 统计数据
  const stats = useMemo(() => {
    const activeCount = supplierData.filter(s => s.status === '启用').length;
    const totalSKU = supplierData.reduce((sum, s) => sum + s.relatedSKU, 0);
    const totalAmount = supplierData.reduce((sum, s) => sum + s.recentOrderAmount, 0);
    const aRatingCount = supplierData.filter(s => s.rating === 'A').length;
    return { activeCount, totalSKU, totalAmount, aRatingCount };
  }, [supplierData]);

  return (
    <div className="flex flex-col h-full">
      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">供应商总数</p>
              <p className="text-2xl font-bold text-gray-800">{supplierData.length}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">启用: {stats.activeCount} 家</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">A级供应商</p>
              <p className="text-2xl font-bold text-green-600">{stats.aRatingCount}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">占比: {((stats.aRatingCount / supplierData.length) * 100).toFixed(1)}%</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">关联SKU</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalSKU}</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">平均: {Math.round(stats.totalSKU / supplierData.length)} SKU/供应商</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">近期采购额</p>
              <p className="text-2xl font-bold text-orange-600">{formatAmount(stats.totalAmount)}</p>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Phone className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">本季度累计</p>
        </div>
      </div>

      {/* 筛选区域 */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">供应商管理</h3>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            新增供应商
          </button>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="供应商名称/编码/简称"
              value={filters.keyword}
              onChange={(e) => {
                setFilters({ ...filters, keyword: e.target.value });
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filters.type}
            onChange={(e) => {
              setFilters({ ...filters, type: e.target.value });
              setCurrentPage(1);
            }}
            className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部类型</option>
            {typeOptions.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <select
            value={filters.category}
            onChange={(e) => {
              setFilters({ ...filters, category: e.target.value });
              setCurrentPage(1);
            }}
            className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部品类</option>
            {categoryOptions.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={filters.status}
            onChange={(e) => {
              setFilters({ ...filters, status: e.target.value });
              setCurrentPage(1);
            }}
            className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部状态</option>
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <select
            value={filters.rating}
            onChange={(e) => {
              setFilters({ ...filters, rating: e.target.value });
              setCurrentPage(1);
            }}
            className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部评级</option>
            {ratingOptions.map(rating => (
              <option key={rating} value={rating}>{rating}级</option>
            ))}
          </select>
          <button
            onClick={resetFilters}
            className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            重置
          </button>
        </div>
      </div>

      {/* 表格区域 */}
      <div className="flex-1 bg-white rounded-lg shadow-sm flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm min-w-[1300px]">
            <thead className="bg-gray-50 sticky top-0">
              <tr className="border-b">
                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">供应商编码</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">供应商名称</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">类型</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">品类</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">联系人</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">联系方式</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">状态</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">评级</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">关联SKU</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">近期采购额</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">合作日期</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((supplier) => (
                <tr key={supplier.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-blue-600">{supplier.code}</td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium text-gray-800">{supplier.shortName}</div>
                      <div className="text-xs text-gray-400 truncate max-w-[200px]" title={supplier.name}>
                        {supplier.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs">
                      {supplier.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{supplier.category}</td>
                  <td className="px-4 py-3">{supplier.contact}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1 text-xs text-gray-600 whitespace-nowrap">
                        <Phone className="w-3 h-3 flex-shrink-0" />
                        {supplier.phone}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400 whitespace-nowrap">
                        <Mail className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate max-w-[120px]" title={supplier.email}>{supplier.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(supplier.status)}`}>
                      {supplier.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getRatingColor(supplier.rating)}`}>
                      {supplier.rating}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-purple-600 font-medium">{supplier.relatedSKU}</span>
                  </td>
                  <td className="px-4 py-3 text-orange-600 font-medium">
                    {supplier.recentOrderAmount > 0 ? formatAmount(supplier.recentOrderAmount) : '-'}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{supplier.cooperationDate}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDetail(supplier)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-xs"
                        title="查看详情"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        详情
                      </button>
                      <button
                        onClick={() => handleEdit(supplier)}
                        className="flex items-center gap-1 text-green-600 hover:text-green-700 text-xs"
                        title="编辑"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        编辑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {paginatedData.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Search className="w-12 h-12 mb-4" />
              <p>暂无符合条件的供应商</p>
            </div>
          )}
        </div>

        {/* 底部分页 */}
        <div className="p-4 border-t bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            共 <span className="font-semibold text-gray-800">{filteredData.length}</span> 家供应商
            {filteredData.length !== supplierData.length && (
              <span className="text-gray-400 ml-2">(已筛选，总计 {supplierData.length} 家)</span>
            )}
          </div>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                上一页
              </button>
              <span className="text-sm text-gray-600">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                下一页
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 新增/编辑模态框 */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-30"
            onClick={handleCloseModal}
          />
          <div className="relative bg-white rounded-lg shadow-xl w-[800px] max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold">
                {editingSupplier ? '编辑供应商' : '新增供应商'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    供应商编码 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    defaultValue={editingSupplier?.code || ''}
                    disabled={!!editingSupplier}
                    className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 disabled:text-gray-500"
                    placeholder="系统自动生成"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    供应商简称 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    defaultValue={editingSupplier?.shortName || ''}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="请输入简称（10字以内）"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    供应商全称 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    defaultValue={editingSupplier?.name || ''}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="请输入完整公司名称"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    供应商类型 <span className="text-red-500">*</span>
                  </label>
                  <select
                    defaultValue={editingSupplier?.type || ''}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">请选择类型</option>
                    {typeOptions.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    主营品类 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    defaultValue={editingSupplier?.category || ''}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="请输入主营品类"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    联系人 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    defaultValue={editingSupplier?.contact || ''}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="请输入联系人姓名"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    联系电话 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    defaultValue={editingSupplier?.phone || ''}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="请输入联系电话"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    邮箱
                  </label>
                  <input
                    type="email"
                    defaultValue={editingSupplier?.email || ''}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="请输入邮箱地址"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    结算方式
                  </label>
                  <select
                    defaultValue={editingSupplier?.paymentTerms || ''}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">请选择结算方式</option>
                    <option value="现结">现结</option>
                    <option value="预付50%">预付50%</option>
                    <option value="预付全款">预付全款</option>
                    <option value="月结30天">月结30天</option>
                    <option value="月结45天">月结45天</option>
                    <option value="月结60天">月结60天</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    详细地址
                  </label>
                  <input
                    type="text"
                    defaultValue={editingSupplier?.address || ''}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="请输入详细地址"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    营业执照号
                  </label>
                  <input
                    type="text"
                    defaultValue={editingSupplier?.businessLicense || ''}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="请输入统一社会信用代码"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    税率 (%)
                  </label>
                  <select
                    defaultValue={editingSupplier?.taxRate || 13}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value={0}>0%（免税）</option>
                    <option value={1}>1%</option>
                    <option value={3}>3%</option>
                    <option value={6}>6%</option>
                    <option value={9}>9%</option>
                    <option value={13}>13%</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    银行账户
                  </label>
                  <input
                    type="text"
                    defaultValue={editingSupplier?.bankAccount || ''}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="请输入开户行及账号"
                  />
                </div>
                {editingSupplier && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        状态
                      </label>
                      <select
                        defaultValue={editingSupplier?.status || '启用'}
                        className="w-full px-3 py-2 border rounded-lg"
                      >
                        {statusOptions.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        评级
                      </label>
                      <select
                        defaultValue={editingSupplier?.rating || 'B'}
                        className="w-full px-3 py-2 border rounded-lg"
                      >
                        <option value="-">待评定</option>
                        {ratingOptions.map(rating => (
                          <option key={rating} value={rating}>{rating}级</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t bg-gray-50">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100 transition-colors"
              >
                取消
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                {editingSupplier ? '保存修改' : '确认新增'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierListPage;
