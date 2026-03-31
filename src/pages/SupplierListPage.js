// src/pages/SupplierListPage.js
import React, { useState, useMemo } from 'react';
import { Search, Plus, Edit2, Eye, Phone, Mail, MapPin, Star, TrendingUp, Award, ArrowRight } from 'lucide-react';
import TablePagination from '../components/TablePagination';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ModalShell from '../components/ui/ModalShell';
import TableShell from '../components/ui/TableShell';

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
  const [hoveredRating, setHoveredRating] = useState(null);
  const pageSize = 10;

  // Mock绩效数据
  const performanceData = useMemo(() => ({
    'SUP-001': {
      latest: { period: '2024-Q1', score: 92.5, grade: 'A', evaluator: '张三', date: '2024-04-15' },
      qcds: { quality: 95, cost: 88, delivery: 90, service: 85 },
      history: [
        { period: '2024-Q1', score: 92.5, grade: 'A' },
        { period: '2023-Q4', score: 89.0, grade: 'B' },
        { period: '2023-Q3', score: 87.5, grade: 'B' },
      ]
    },
    'SUP-002': {
      latest: { period: '2024-Q1', score: 85.0, grade: 'B', evaluator: '李四', date: '2024-04-14' },
      qcds: { quality: 82, cost: 88, delivery: 85, service: 80 },
      history: [
        { period: '2024-Q1', score: 85.0, grade: 'B' },
        { period: '2023-Q4', score: 87.0, grade: 'B' },
      ]
    },
    'SUP-003': {
      latest: { period: '2024-Q1', score: 88.5, grade: 'A', evaluator: '王五', date: '2024-04-13' },
      qcds: { quality: 90, cost: 85, delivery: 88, service: 87 },
      history: [
        { period: '2024-Q1', score: 88.5, grade: 'A' },
      ]
    },
    'SUP-004': {
      latest: { period: '2023-Q4', score: 72.0, grade: 'C', evaluator: '张三', date: '2024-01-10' },
      qcds: { quality: 70, cost: 75, delivery: 68, service: 72 },
      history: [
        { period: '2023-Q4', score: 72.0, grade: 'C' },
      ]
    },
    'SUP-005': null,
    'SUP-006': {
      latest: { period: '2024-Q1', score: 94.0, grade: 'A', evaluator: '李四', date: '2024-04-12' },
      qcds: { quality: 96, cost: 92, delivery: 94, service: 90 },
      history: [
        { period: '2024-Q1', score: 94.0, grade: 'A' },
        { period: '2023-Q4', score: 91.5, grade: 'A' },
      ]
    },
    'SUP-007': {
      latest: { period: '2024-Q1', score: 90.5, grade: 'A', evaluator: '王五', date: '2024-04-11' },
      qcds: { quality: 92, cost: 88, delivery: 90, service: 89 },
      history: [
        { period: '2024-Q1', score: 90.5, grade: 'A' },
      ]
    },
    'SUP-008': null,
  }), []);

  // Mock供应商数据（保持原有数据）
  const defaultSupplierData = useMemo(() => [
    {
      id: 'supplier-1', code: 'SUP-001', name: '深圳市渔具制造有限公司', shortName: '深圳渔具',
      type: '生产商', category: '渔具配件', contact: '张经理', phone: '13800138001',
      email: 'zhangmgr@fishing.com', address: '深圳市宝安区沙井街道新和大道100号',
      status: '启用', rating: 'A', cooperationDate: '2022-03-15', relatedSKU: 156,
      recentOrderAmount: 125600, paymentTerms: '月结30天', taxRate: 13,
      bankAccount: '招商银行深圳分行 6226****8899', businessLicense: '91440300MA5F****XY',
      qualifications: ['ISO9001', 'ISO14001'], updateTime: '2024-01-20 15:30', createTime: '2022-03-10 09:00'
    },
    {
      id: 'supplier-2', code: 'SUP-002', name: '东莞市户外用品贸易有限公司', shortName: '东莞户外',
      type: '贸易商', category: '户外装备', contact: '李总', phone: '13900139002',
      email: 'li@outdoor-trade.com', address: '东莞市虎门镇太平路88号',
      status: '启用', rating: 'B', cooperationDate: '2023-01-20', relatedSKU: 89,
      recentOrderAmount: 78900, paymentTerms: '预付50%', taxRate: 13,
      bankAccount: '中国银行东莞分行 6217****5566', businessLicense: '91441900MA5G****AB',
      qualifications: ['ISO9001'], updateTime: '2024-02-15 10:20', createTime: '2023-01-15 14:30'
    },
    {
      id: 'supplier-3', code: 'SUP-003', name: '宁波精密零件加工厂', shortName: '宁波精密',
      type: 'OEM', category: '精密配件', contact: '王工', phone: '13700137003',
      email: 'wang@precision-parts.com', address: '宁波市北仑区小港工业园区',
      status: '启用', rating: 'A', cooperationDate: '2021-06-01', relatedSKU: 234,
      recentOrderAmount: 256000, paymentTerms: '月结45天', taxRate: 13,
      bankAccount: '工商银行宁波分行 6222****7788', businessLicense: '91330206MA5H****CD',
      qualifications: ['ISO9001', 'IATF16949'], updateTime: '2024-03-01 09:15', createTime: '2021-05-25 11:00'
    },
    {
      id: 'supplier-4', code: 'SUP-004', name: '广州包装材料有限公司', shortName: '广州包装',
      type: '生产商', category: '包装材料', contact: '陈经理', phone: '13600136004',
      email: 'chen@gz-package.com', address: '广州市白云区太和镇大源中路',
      status: '停用', rating: 'C', cooperationDate: '2022-08-10', relatedSKU: 45,
      recentOrderAmount: 32000, paymentTerms: '现结', taxRate: 13,
      bankAccount: '建设银行广州分行 6227****4455', businessLicense: '91440111MA5J****EF',
      qualifications: ['FSC'], updateTime: '2023-12-20 16:40', createTime: '2022-08-05 10:30'
    },
    {
      id: 'supplier-5', code: 'SUP-005', name: '义乌小商品批发中心', shortName: '义乌批发',
      type: '贸易商', category: '五金配件', contact: '周老板', phone: '13500135005',
      email: 'zhou@yiwu-wholesale.com', address: '浙江省义乌市国际商贸城A区',
      status: '启用', rating: '-', cooperationDate: '2023-05-15', relatedSKU: 312,
      recentOrderAmount: 89500, paymentTerms: '预付全款', taxRate: 3,
      bankAccount: '农业银行义乌分行 6228****1122', businessLicense: '91330782MA5K****GH',
      qualifications: [], updateTime: '2024-02-28 11:25', createTime: '2023-05-10 15:00'
    },
    {
      id: 'supplier-6', code: 'SUP-006', name: '佛山市金属制品有限公司', shortName: '佛山金属',
      type: '生产商', category: '金属配件', contact: '黄厂长', phone: '13400134006',
      email: 'huang@fs-metal.com', address: '佛山市南海区狮山镇科技工业园',
      status: '启用', rating: 'A', cooperationDate: '2020-11-20', relatedSKU: 178,
      recentOrderAmount: 198000, paymentTerms: '月结30天', taxRate: 13,
      bankAccount: '交通银行佛山分行 6222****3344', businessLicense: '91440605MA5L****IJ',
      qualifications: ['ISO9001', 'ISO14001', 'OHSAS18001'], updateTime: '2024-03-05 14:50', createTime: '2020-11-15 09:30'
    },
    {
      id: 'supplier-7', code: 'SUP-007', name: '苏州电子元器件有限公司', shortName: '苏州电子',
      type: 'OEM', category: '电子元件', contact: '吴经理', phone: '13300133007',
      email: 'wu@sz-electronics.com', address: '苏州市工业园区星湖街328号',
      status: '启用', rating: 'A', cooperationDate: '2021-09-01', relatedSKU: 95,
      recentOrderAmount: 145000, paymentTerms: '月结60天', taxRate: 13,
      bankAccount: '浦发银行苏州分行 6225****5566', businessLicense: '91320594MA5M****KL',
      qualifications: ['ISO9001', 'ISO14001', 'IATF16949'], updateTime: '2024-01-10 08:45', createTime: '2021-08-28 16:20'
    },
    {
      id: 'supplier-8', code: 'SUP-008', name: '温州塑料制品厂', shortName: '温州塑料',
      type: '生产商', category: '塑料配件', contact: '郑老板', phone: '13200132008',
      email: 'zheng@wz-plastic.com', address: '温州市龙湾区永中街道工业区',
      status: '待审核', rating: '-', cooperationDate: '-', relatedSKU: 0,
      recentOrderAmount: 0, paymentTerms: '-', taxRate: 13,
      bankAccount: '民生银行温州分行 6226****7788', businessLicense: '91330303MA5N****MN',
      qualifications: ['ISO9001'], updateTime: '2024-03-08 10:00', createTime: '2024-03-08 10:00'
    }
  ], []);
  const supplierData = externalData ?? defaultSupplierData;

  const typeOptions = ['生产商', '贸易商', 'OEM'];
  const statusOptions = ['启用', '停用', '待审核'];
  const ratingOptions = ['A', 'B', 'C', 'D'];
  const categoryOptions = [...new Set(supplierData.map(s => s.category))];

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

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const resetFilters = () => {
    setFilters({ keyword: '', type: '', status: '', rating: '', category: '' });
    setCurrentPage(1);
  };

  const getRatingColor = (rating) => {
    const colors = {
      'A': 'bg-green-100 text-green-700 hover:bg-green-200',
      'B': 'bg-blue-100 text-blue-700 hover:bg-blue-200',
      'C': 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
      'D': 'bg-red-100 text-red-700 hover:bg-red-200',
      '-': 'bg-gray-100 text-gray-500'
    };
    return colors[rating] || 'bg-gray-100 text-gray-500';
  };

  const getStatusTone = (status) => {
    if (status === '启用') return 'success';
    if (status === '待审核') return 'warning';
    return 'neutral';
  };

  const getTypeTone = () => 'primary';

  const formatAmount = (amount) => {
    if (amount >= 10000) return `¥${(amount / 10000).toFixed(2)}万`;
    return `¥${amount.toLocaleString()}`;
  };

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setShowCreateModal(true);
  };

  // 打开详情，可指定默认Tab
  const handleViewDetail = (supplier, activeTab = 'basic') => {
    if (onOpenDetail) {
      onOpenDetail({
        id: `supplier-detail-${supplier.id}`,
        name: `供应商: ${supplier.shortName}`,
        path: '/procurement/supplier/detail',
        data: { ...supplier, performance: performanceData[supplier.code], activeTab }
      });
    }
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingSupplier(null);
  };

  const stats = useMemo(() => {
    const activeCount = supplierData.filter(s => s.status === '启用').length;
    const totalSKU = supplierData.reduce((sum, s) => sum + s.relatedSKU, 0);
    const totalAmount = supplierData.reduce((sum, s) => sum + s.recentOrderAmount, 0);
    const aRatingCount = supplierData.filter(s => s.rating === 'A').length;
    return { activeCount, totalSKU, totalAmount, aRatingCount };
  }, [supplierData]);

  return (
    <div className="flex min-h-0 flex-col gap-4">
      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <Card padding="sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted">供应商总数</p>
              <p className="text-2xl font-bold text-text">{supplierData.length}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100">
              <Star className="w-5 h-5 text-brand-700" />
            </div>
          </div>
          <p className="mt-2 text-xs text-text-subtle">启用: {stats.activeCount} 家</p>
        </Card>
        <Card padding="sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted">A级供应商</p>
              <p className="text-2xl font-bold text-green-600">{stats.aRatingCount}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="mt-2 text-xs text-text-subtle">占比: {((stats.aRatingCount / supplierData.length) * 100).toFixed(1)}%</p>
        </Card>
        <Card padding="sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted">关联SKU</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalSKU}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
              <MapPin className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="mt-2 text-xs text-text-subtle">平均: {Math.round(stats.totalSKU / supplierData.length)} SKU/供应商</p>
        </Card>
        <Card padding="sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted">近期采购额</p>
              <p className="text-2xl font-bold text-orange-600">{formatAmount(stats.totalAmount)}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100">
              <Phone className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <p className="mt-2 text-xs text-text-subtle">本季度累计</p>
        </Card>
      </div>

      {/* 筛选区域 */}
      <Card padding="sm" className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text">供应商管理</h3>
          <div className="flex gap-2">
            <Button onClick={() => {}} variant="secondary" icon={Award}>
              发起评估
            </Button>
            <Button onClick={() => setShowCreateModal(true)} icon={Plus}>
              新增供应商
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="供应商名称/编码/简称"
              value={filters.keyword}
              onChange={(e) => { setFilters({ ...filters, keyword: e.target.value }); setCurrentPage(1); }}
              className="ui-input pl-10"
            />
          </div>
          <select value={filters.type} onChange={(e) => { setFilters({ ...filters, type: e.target.value }); setCurrentPage(1); }}
            className="ui-select max-w-[160px]">
            <option value="">全部类型</option>
            {typeOptions.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
          <select value={filters.category} onChange={(e) => { setFilters({ ...filters, category: e.target.value }); setCurrentPage(1); }}
            className="ui-select max-w-[160px]">
            <option value="">全部品类</option>
            {categoryOptions.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <select value={filters.status} onChange={(e) => { setFilters({ ...filters, status: e.target.value }); setCurrentPage(1); }}
            className="ui-select max-w-[160px]">
            <option value="">全部状态</option>
            {statusOptions.map(status => <option key={status} value={status}>{status}</option>)}
          </select>
          <select value={filters.rating} onChange={(e) => { setFilters({ ...filters, rating: e.target.value }); setCurrentPage(1); }}
            className="ui-select max-w-[160px]">
            <option value="">全部评级</option>
            {ratingOptions.map(rating => <option key={rating} value={rating}>{rating}级</option>)}
          </select>
          <Button onClick={resetFilters} variant="secondary">重置</Button>
        </div>
      </Card>

      {/* 表格区域 */}
      <TableShell
        className="flex-1"
        minWidth="1300px"
        pagination={
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            total={filteredData.length}
            itemName="家供应商"
            onPageChange={setCurrentPage}
          />
        }
        emptyState={
          paginatedData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-text-subtle">
              <Search className="mb-4 h-12 w-12" />
              <p>暂无符合条件的供应商</p>
            </div>
          ) : null
        }
      >
          <table className="w-full text-sm min-w-[1300px]">
            <thead className="sticky top-0 bg-surface-subtle">
              <tr className="border-b">
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-text-muted">供应商编码</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-text-muted">供应商名称</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-text-muted">类型</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-text-muted">品类</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-text-muted">联系人</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-text-muted">联系方式</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-text-muted">状态</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-text-muted">评级</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-text-muted">关联SKU</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-text-muted">近期采购额</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-text-muted">合作日期</th>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-text-muted">操作</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((supplier) => (
                <tr key={supplier.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-blue-600">{supplier.code}</td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium text-text">{supplier.shortName}</div>
                      <div className="text-xs text-gray-400 truncate max-w-[200px]" title={supplier.name}>{supplier.name}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={getTypeTone(supplier.type)}>{supplier.type}</Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{supplier.category}</td>
                  <td className="px-4 py-3">{supplier.contact}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1 text-xs text-gray-600 whitespace-nowrap">
                        <Phone className="w-3 h-3 flex-shrink-0" />{supplier.phone}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400 whitespace-nowrap">
                        <Mail className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate max-w-[120px]" title={supplier.email}>{supplier.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={getStatusTone(supplier.status)}>{supplier.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative inline-block"
                         onMouseEnter={() => setHoveredRating(supplier.code)}
                         onMouseLeave={() => setHoveredRating(null)}>
                      <button
                        onClick={() => handleViewDetail(supplier, 'performance')}
                        className={`px-2 py-1 rounded text-xs font-medium transition-colors ${getRatingColor(supplier.rating)}`}
                      >
                        {supplier.rating === '-' ? '未评估' : supplier.rating}
                      </button>
                      {/* Hover弹窗 */}
                      {hoveredRating === supplier.code && performanceData[supplier.code] && (
                        <div className="absolute z-50 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 py-3 px-4 left-1/2 -translate-x-1/2">
                          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-gray-200 rotate-45" />
                          {(() => {
                            const perf = performanceData[supplier.code];
                            return (
                              <>
                                <div className="flex items-center justify-between mb-3 relative z-10">
                                  <span className="text-sm font-medium text-gray-800">{supplier.shortName}</span>
                                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${getRatingColor(perf.latest.grade)}`}>
                                    {perf.latest.grade}级
                                  </span>
                                </div>
                                <div className="relative z-10 mb-3 rounded-lg bg-brand-50 p-3">
                                  <div className="flex items-baseline gap-1 mb-2">
                                    <span className="text-2xl font-bold text-brand-700">{perf.latest.score}</span>
                                    <span className="text-sm text-gray-500">分</span>
                                  </div>
                                  <div className="text-xs text-gray-500 mb-2">{perf.latest.period} · {perf.latest.evaluator}评估</div>
                                  <div className="grid grid-cols-4 gap-2 text-center">
                                    <div className="bg-white rounded p-1"><div className="text-xs text-gray-400">质量</div><div className="text-sm font-semibold text-green-600">{perf.qcds.quality}</div></div>
                                    <div className="bg-white rounded p-1"><div className="text-xs text-gray-400">成本</div><div className="text-sm font-semibold text-blue-600">{perf.qcds.cost}</div></div>
                                    <div className="bg-white rounded p-1"><div className="text-xs text-gray-400">交付</div><div className="text-sm font-semibold text-purple-600">{perf.qcds.delivery}</div></div>
                                    <div className="bg-white rounded p-1"><div className="text-xs text-gray-400">服务</div><div className="text-sm font-semibold text-orange-600">{perf.qcds.service}</div></div>
                                  </div>
                                </div>
                                <div className="border-t pt-2 relative z-10">
                                  <div className="text-xs text-gray-500 mb-2">历史评估</div>
                                  {perf.history.slice(0, 3).map((h, idx) => (
                                    <div key={idx} className="flex items-center justify-between text-sm py-1">
                                      <span className="text-gray-600">{h.period}</span>
                                      <div className="flex items-center gap-2">
                                        <span className={`px-1.5 py-0.5 rounded text-xs ${getRatingColor(h.grade)}`}>{h.grade}</span>
                                        <span className="text-gray-800 font-medium">{h.score}分</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <div className="mt-3 pt-2 border-t flex items-center justify-between text-xs text-gray-500 relative z-10">
                                  <span>点击查看完整绩效</span>
                                  <ArrowRight className="w-3 h-3" />
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-purple-600 font-medium">{supplier.relatedSKU}</span>
                  </td>
                  <td className="px-4 py-3 text-orange-600 font-medium">
                    {supplier.recentOrderAmount > 0 ? formatAmount(supplier.recentOrderAmount) : '-'}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{supplier.cooperationDate}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleViewDetail(supplier)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="查看详情">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleEdit(supplier)} className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors" title="编辑">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      </TableShell>

      {/* 新增/编辑模态框 - 简化版 */}
      <ModalShell
        open={showCreateModal}
        onClose={handleCloseModal}
        title={editingSupplier ? '编辑供应商' : '新增供应商'}
        width="xl"
        footer={
          <div className="flex justify-end gap-3">
            <Button onClick={handleCloseModal} variant="secondary">取消</Button>
            <Button>{editingSupplier ? '保存修改' : '确认新增'}</Button>
          </div>
        }
      >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">供应商编码 <span className="text-red-500">*</span></label>
                  <input type="text" defaultValue={editingSupplier?.code || ''} disabled={!!editingSupplier}
                    className="ui-input disabled:bg-surface-subtle disabled:text-text-subtle" placeholder="系统自动生成" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">供应商简称 <span className="text-red-500">*</span></label>
                  <input type="text" defaultValue={editingSupplier?.shortName || ''}
                    className="ui-input" placeholder="请输入简称（10字以内）" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">供应商全称 <span className="text-red-500">*</span></label>
                  <input type="text" defaultValue={editingSupplier?.name || ''}
                    className="ui-input" placeholder="请输入完整公司名称" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">供应商类型 <span className="text-red-500">*</span></label>
                  <select defaultValue={editingSupplier?.type || ''} className="ui-select">
                    <option value="">请选择类型</option>
                    {typeOptions.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">主营品类 <span className="text-red-500">*</span></label>
                  <input type="text" defaultValue={editingSupplier?.category || ''}
                    className="ui-input" placeholder="请输入主营品类" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">联系人 <span className="text-red-500">*</span></label>
                  <input type="text" defaultValue={editingSupplier?.contact || ''}
                    className="ui-input" placeholder="请输入联系人姓名" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">联系电话 <span className="text-red-500">*</span></label>
                  <input type="tel" defaultValue={editingSupplier?.phone || ''}
                    className="ui-input" placeholder="请输入联系电话" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
                  <input type="email" defaultValue={editingSupplier?.email || ''}
                    className="ui-input" placeholder="请输入邮箱地址" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">结算方式</label>
                  <select defaultValue={editingSupplier?.paymentTerms || ''} className="ui-select">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">详细地址</label>
                  <input type="text" defaultValue={editingSupplier?.address || ''}
                    className="ui-input" placeholder="请输入详细地址" />
                </div>
                {editingSupplier && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">状态</label>
                      <select defaultValue={editingSupplier?.status || '启用'} className="ui-select">
                        {statusOptions.map(status => <option key={status} value={status}>{status}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">评级</label>
                      <select defaultValue={editingSupplier?.rating || 'B'} className="ui-select">
                        <option value="-">待评定</option>
                        {ratingOptions.map(rating => <option key={rating} value={rating}>{rating}级</option>)}
                      </select>
                    </div>
                  </>
                )}
              </div>
      </ModalShell>
    </div>
  );
};

export default SupplierListPage;
