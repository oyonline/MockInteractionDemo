import React, { useState } from 'react';
import {
  Search, Filter, Star,
  Package, DollarSign, BarChart2, ShoppingCart, Globe, Edit2, Eye,
  ArrowUpRight, ArrowDownRight, Minus, X
} from 'lucide-react';

const SalesProductPage = () => {
  const [filters, setFilters] = useState({
    keyword: '',
    salesGrade: '',
    salesStatus: '',
    channel: '',
    category: '',
    inventoryStatus: ''
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars -- 预留 table/card 切换
  const [viewMode, setViewMode] = useState('table');

  // 销售产品数据
  const salesProductData = [
    {
      id: 'SP-001',
      sku: 'KK-RL-2024-7FT-M',
      spu: 'KK-RL-2024',
      productName: 'Royale Legend 7尺路亚竿 中调',
      productNameEN: 'Royale Legend 7ft Casting Rod Medium',
      brand: 'KastKing',
      category: '钓鱼竿 / 路亚竿',
      series: 'Royale Legend系列',
      salesGrade: 'A',
      salesStatus: '主推款',
      channels: ['Amazon US', 'Amazon EU', 'eBay', '独立站'],
      msrp: 189.99,
      costPrice: 45.00,
      grossMargin: 76.3,
      currentPrice: 169.99,
      priceStatus: '促销中',
      sales30d: 1256,
      salesAmount30d: 213294.44,
      sales7d: 312,
      salesTrend: 'up', // up, down, stable
      trendPercent: 15.2,
      inventoryTotal: 5680,
      inventoryFBA: 3200,
      inventoryDays: 45,
      inventoryStatus: '充足',
      salesRank: 1,
      categoryRank: 1,
      reviewScore: 4.7,
      reviewCount: 2845,
      listingStatus: '已上架',
      listingQuality: 'A',
      lastPriceUpdate: '2025-01-15',
      salesManager: '王芳',
      updateTime: '2025-02-08 10:30'
    },
    {
      id: 'SP-002',
      sku: 'KK-MG-2024-3000',
      spu: 'KK-MG-2024',
      productName: 'Megatron 3000纺车轮',
      productNameEN: 'Megatron 3000 Spinning Reel',
      brand: 'KastKing',
      category: '渔线轮 / 纺车轮',
      series: 'Megatron系列',
      salesGrade: 'A',
      salesStatus: '主推款',
      channels: ['Amazon US', 'Amazon EU', '独立站'],
      msrp: 109.99,
      costPrice: 28.50,
      grossMargin: 74.1,
      currentPrice: 99.99,
      priceStatus: '正常',
      sales30d: 892,
      salesAmount30d: 89191.08,
      sales7d: 198,
      salesTrend: 'up',
      trendPercent: 8.5,
      inventoryTotal: 4200,
      inventoryFBA: 2800,
      inventoryDays: 47,
      inventoryStatus: '充足',
      salesRank: 2,
      categoryRank: 1,
      reviewScore: 4.6,
      reviewCount: 1892,
      listingStatus: '已上架',
      listingQuality: 'A',
      lastPriceUpdate: '2025-01-20',
      salesManager: '王芳',
      updateTime: '2025-02-08 09:15'
    },
    {
      id: 'SP-003',
      sku: 'KK-SD-2024-7FT-XF',
      spu: 'KK-SD-2024',
      productName: 'Speed Demon 7尺竞技竿 超快调',
      productNameEN: 'Speed Demon 7ft Competition Rod Extra Fast',
      brand: 'KastKing',
      category: '钓鱼竿 / 路亚竿',
      series: 'Speed Demon系列',
      salesGrade: 'B',
      salesStatus: '常规款',
      channels: ['Amazon US', '独立站'],
      msrp: 259.99,
      costPrice: 72.00,
      grossMargin: 72.3,
      currentPrice: 259.99,
      priceStatus: '正常',
      sales30d: 456,
      salesAmount30d: 118555.44,
      sales7d: 102,
      salesTrend: 'stable',
      trendPercent: 0.5,
      inventoryTotal: 1850,
      inventoryFBA: 1200,
      inventoryDays: 40,
      inventoryStatus: '充足',
      salesRank: 3,
      categoryRank: 2,
      reviewScore: 4.8,
      reviewCount: 567,
      listingStatus: '已上架',
      listingQuality: 'A',
      lastPriceUpdate: '2025-01-10',
      salesManager: '李明',
      updateTime: '2025-02-07 16:45'
    },
    {
      id: 'SP-004',
      sku: 'KK-SK3-2024-12FT-H',
      spu: 'KK-SK3-2024',
      productName: 'Sharky III 12尺海竿 硬调',
      productNameEN: 'Sharky III 12ft Surf Rod Heavy',
      brand: 'KastKing',
      category: '钓鱼竿 / 海竿',
      series: 'Sharky III系列',
      salesGrade: 'B',
      salesStatus: '常规款',
      channels: ['Amazon US', 'eBay'],
      msrp: 249.99,
      costPrice: 68.00,
      grossMargin: 72.8,
      currentPrice: 229.99,
      priceStatus: '促销中',
      sales30d: 234,
      salesAmount30d: 53817.66,
      sales7d: 48,
      salesTrend: 'down',
      trendPercent: -5.2,
      inventoryTotal: 980,
      inventoryFBA: 650,
      inventoryDays: 42,
      inventoryStatus: '充足',
      salesRank: 5,
      categoryRank: 1,
      reviewScore: 4.5,
      reviewCount: 423,
      listingStatus: '已上架',
      listingQuality: 'B',
      lastPriceUpdate: '2025-02-01',
      salesManager: '李明',
      updateTime: '2025-02-08 11:20'
    },
    {
      id: 'SP-005',
      sku: 'PF-TAC-2024-L-BK',
      spu: 'PF-TAC-2024',
      productName: '战术路亚包 L号 黑色',
      productNameEN: 'Tactical Tackle Bag Large Black',
      brand: 'Piscifun',
      category: '钓鱼包 / 路亚包',
      series: '战术系列',
      salesGrade: 'B',
      salesStatus: '常规款',
      channels: ['Amazon US', '独立站'],
      msrp: 89.99,
      costPrice: 22.00,
      grossMargin: 75.5,
      currentPrice: 79.99,
      priceStatus: '促销中',
      sales30d: 567,
      salesAmount30d: 45354.33,
      sales7d: 145,
      salesTrend: 'up',
      trendPercent: 12.3,
      inventoryTotal: 2100,
      inventoryFBA: 1500,
      inventoryDays: 37,
      inventoryStatus: '充足',
      salesRank: 4,
      categoryRank: 1,
      reviewScore: 4.4,
      reviewCount: 892,
      listingStatus: '已上架',
      listingQuality: 'A',
      lastPriceUpdate: '2025-01-25',
      salesManager: '赵敏',
      updateTime: '2025-02-08 08:45'
    },
    {
      id: 'SP-006',
      sku: 'PF-CARB-2024-20LB-150M',
      spu: 'PF-CARB-2024',
      productName: '碳素编织线 20磅 150米',
      productNameEN: 'Carbon Braided Line 20LB 150M',
      brand: 'Piscifun',
      category: '钓鱼配件 / 钓鱼线',
      series: '碳素系列',
      salesGrade: 'C',
      salesStatus: '长尾款',
      channels: ['Amazon US'],
      msrp: 29.99,
      costPrice: 6.50,
      grossMargin: 78.3,
      currentPrice: 24.99,
      priceStatus: '促销中',
      sales30d: 1890,
      salesAmount30d: 47231.10,
      sales7d: 423,
      salesTrend: 'up',
      trendPercent: 5.8,
      inventoryTotal: 12500,
      inventoryFBA: 8000,
      inventoryDays: 66,
      inventoryStatus: '充足',
      salesRank: 6,
      categoryRank: 2,
      reviewScore: 4.3,
      reviewCount: 3456,
      listingStatus: '已上架',
      listingQuality: 'B',
      lastPriceUpdate: '2025-02-05',
      salesManager: '赵敏',
      updateTime: '2025-02-08 14:10'
    },
    {
      id: 'SP-007',
      sku: 'KK-IC-2024-25L-WH',
      spu: 'KK-IC-2024',
      productName: 'iCool 智能钓箱 25L 白色',
      productNameEN: 'iCool Smart Cooler 25L White',
      brand: 'KastKing',
      category: '钓鱼配件 / 钓鱼箱',
      series: 'iCool系列',
      salesGrade: 'C',
      salesStatus: '新品',
      channels: ['独立站'],
      msrp: 299.99,
      costPrice: 95.00,
      grossMargin: 68.3,
      currentPrice: 279.99,
      priceStatus: '新品价',
      sales30d: 89,
      salesAmount30d: 24919.11,
      sales7d: 28,
      salesTrend: 'up',
      trendPercent: 45.0,
      inventoryTotal: 500,
      inventoryFBA: 0,
      inventoryDays: 56,
      inventoryStatus: '充足',
      salesRank: 8,
      categoryRank: 1,
      reviewScore: 4.9,
      reviewCount: 23,
      listingStatus: '已上架',
      listingQuality: 'A',
      lastPriceUpdate: '2025-01-28',
      salesManager: '李明',
      updateTime: '2025-02-08 09:00'
    },
    {
      id: 'SP-008',
      sku: 'KK-RL-2023-6FT-ML',
      spu: 'KK-RL-2023',
      productName: 'Royale Legend 6尺路亚竿 中轻调 (旧款)',
      productNameEN: 'Royale Legend 6ft Casting Rod Medium Light (Legacy)',
      brand: 'KastKing',
      category: '钓鱼竿 / 路亚竿',
      series: 'Royale Legend系列',
      salesGrade: 'D',
      salesStatus: '淘汰款',
      channels: ['Amazon US'],
      msrp: 149.99,
      costPrice: 38.00,
      grossMargin: 74.7,
      currentPrice: 99.99,
      priceStatus: '清仓',
      sales30d: 45,
      salesAmount30d: 4499.55,
      sales7d: 8,
      salesTrend: 'down',
      trendPercent: -25.0,
      inventoryTotal: 320,
      inventoryFBA: 280,
      inventoryDays: 71,
      inventoryStatus: '需清理',
      salesRank: 12,
      categoryRank: 8,
      reviewScore: 4.2,
      reviewCount: 1245,
      listingStatus: '已上架',
      listingQuality: 'C',
      lastPriceUpdate: '2025-02-01',
      salesManager: '王芳',
      updateTime: '2025-02-07 15:30'
    },
    {
      id: 'SP-009',
      sku: 'KK-SK3R-2024-5000',
      spu: 'KK-SK3R-2024',
      productName: 'Sharky III 5000海钓轮',
      productNameEN: 'Sharky III 5000 Saltwater Reel',
      brand: 'KastKing',
      category: '渔线轮 / 纺车轮',
      series: 'Sharky III系列',
      salesGrade: 'B',
      salesStatus: '常规款',
      channels: ['Amazon US', 'eBay', '独立站'],
      msrp: 199.99,
      costPrice: 52.00,
      grossMargin: 74.0,
      currentPrice: 179.99,
      priceStatus: '促销中',
      sales30d: 312,
      salesAmount30d: 56156.88,
      sales7d: 78,
      salesTrend: 'stable',
      trendPercent: 1.2,
      inventoryTotal: 1450,
      inventoryFBA: 980,
      inventoryDays: 46,
      inventoryStatus: '充足',
      salesRank: 7,
      categoryRank: 2,
      reviewScore: 4.6,
      reviewCount: 678,
      listingStatus: '已上架',
      listingQuality: 'A',
      lastPriceUpdate: '2025-01-18',
      salesManager: '李明',
      updateTime: '2025-02-08 13:25'
    },
    {
      id: 'SP-010',
      sku: 'PF-TAC-2024-M-GN',
      spu: 'PF-TAC-2024',
      productName: '战术路亚包 M号 军绿',
      productNameEN: 'Tactical Tackle Bag Medium Army Green',
      brand: 'Piscifun',
      category: '钓鱼包 / 路亚包',
      series: '战术系列',
      salesGrade: 'C',
      salesStatus: '长尾款',
      channels: ['Amazon US'],
      msrp: 69.99,
      costPrice: 18.00,
      grossMargin: 74.3,
      currentPrice: 59.99,
      priceStatus: '正常',
      sales30d: 234,
      salesAmount30d: 14037.66,
      sales7d: 52,
      salesTrend: 'down',
      trendPercent: -8.5,
      inventoryTotal: 1800,
      inventoryFBA: 1200,
      inventoryDays: 77,
      inventoryStatus: '偏高',
      salesRank: 9,
      categoryRank: 3,
      reviewScore: 4.3,
      reviewCount: 456,
      listingStatus: '已上架',
      listingQuality: 'B',
      lastPriceUpdate: '2025-01-12',
      salesManager: '赵敏',
      updateTime: '2025-02-08 10:50'
    }
  ];

  // 获取销售等级样式
  const getSalesGradeStyle = (grade) => {
    const styles = {
      'A': 'bg-green-100 text-green-700 border-green-200',
      'B': 'bg-blue-100 text-blue-700 border-blue-200',
      'C': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'D': 'bg-red-100 text-red-700 border-red-200'
    };
    return styles[grade] || 'bg-gray-100 text-gray-700';
  };

  // 获取销售状态样式
  const getSalesStatusStyle = (status) => {
    const styles = {
      '主推款': 'bg-purple-100 text-purple-700',
      '常规款': 'bg-blue-100 text-blue-700',
      '长尾款': 'bg-gray-100 text-gray-700',
      '新品': 'bg-green-100 text-green-700',
      '淘汰款': 'bg-red-100 text-red-700'
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  // 获取库存状态样式
  const getInventoryStatusStyle = (status) => {
    const styles = {
      '充足': 'text-green-600',
      '偏高': 'text-yellow-600',
      '偏低': 'text-orange-600',
      '缺货': 'text-red-600',
      '需清理': 'text-red-600'
    };
    return styles[status] || 'text-gray-600';
  };

  // 获取趋势图标
  const getTrendIcon = (trend, percent) => {
    if (trend === 'up') {
      return <span className="inline-flex items-center text-green-600 text-xs"><ArrowUpRight className="w-3 h-3" />+{percent}%</span>;
    } else if (trend === 'down') {
      return <span className="inline-flex items-center text-red-600 text-xs"><ArrowDownRight className="w-3 h-3" />{percent}%</span>;
    }
    return <span className="inline-flex items-center text-gray-500 text-xs"><Minus className="w-3 h-3" />{percent}%</span>;
  };

  // 筛选数据
  const filteredData = salesProductData.filter(product => {
    if (filters.keyword && !product.sku.toLowerCase().includes(filters.keyword.toLowerCase()) &&
        !product.productName.toLowerCase().includes(filters.keyword.toLowerCase())) return false;
    if (filters.salesGrade && product.salesGrade !== filters.salesGrade) return false;
    if (filters.salesStatus && product.salesStatus !== filters.salesStatus) return false;
    if (filters.channel && !product.channels.includes(filters.channel)) return false;
    if (filters.inventoryStatus && product.inventoryStatus !== filters.inventoryStatus) return false;
    return true;
  });

  // 统计数据
  const stats = {
    totalProducts: salesProductData.length,
    gradeA: salesProductData.filter(p => p.salesGrade === 'A').length,
    gradeB: salesProductData.filter(p => p.salesGrade === 'B').length,
    gradeC: salesProductData.filter(p => p.salesGrade === 'C').length,
    gradeD: salesProductData.filter(p => p.salesGrade === 'D').length,
    totalSales30d: salesProductData.reduce((sum, p) => sum + p.salesAmount30d, 0),
    avgMargin: (salesProductData.reduce((sum, p) => sum + p.grossMargin, 0) / salesProductData.length).toFixed(1)
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setDrawerOpen(true);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* 顶部区域 */}
      <div className="bg-white shadow-sm p-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 className="text-xl font-bold whitespace-nowrap">销售主数据管理</h2>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              高级筛选
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
              导出报表
            </button>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-4">
          <div className="bg-gray-50 rounded-lg p-3 border">
            <div className="text-2xl font-bold text-gray-800">{stats.totalProducts}</div>
            <div className="text-xs text-gray-500">全部产品</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 border border-green-200">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-green-600 fill-green-600" />
              <span className="text-2xl font-bold text-green-600">{stats.gradeA}</span>
            </div>
            <div className="text-xs text-green-600">A级产品</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">{stats.gradeB}</div>
            <div className="text-xs text-blue-600">B级产品</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-600">{stats.gradeC}</div>
            <div className="text-xs text-yellow-600">C级产品</div>
          </div>
          <div className="bg-red-50 rounded-lg p-3 border border-red-200">
            <div className="text-2xl font-bold text-red-600">{stats.gradeD}</div>
            <div className="text-xs text-red-600">D级产品</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
            <div className="text-lg font-bold text-purple-600">${(stats.totalSales30d / 1000).toFixed(1)}K</div>
            <div className="text-xs text-purple-600">30天销售额</div>
          </div>
          <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
            <div className="text-2xl font-bold text-indigo-600">{stats.avgMargin}%</div>
            <div className="text-xs text-indigo-600">平均毛利率</div>
          </div>
        </div>

        {/* 筛选条件 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="SKU / 产品名称"
              value={filters.keyword}
              onChange={(e) => setFilters({...filters, keyword: e.target.value})}
              className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm"
            />
          </div>
          <select
            value={filters.salesGrade}
            onChange={(e) => setFilters({...filters, salesGrade: e.target.value})}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">销售等级</option>
            <option value="A">A级 - 核心产品</option>
            <option value="B">B级 - 重要产品</option>
            <option value="C">C级 - 一般产品</option>
            <option value="D">D级 - 淘汰产品</option>
          </select>
          <select
            value={filters.salesStatus}
            onChange={(e) => setFilters({...filters, salesStatus: e.target.value})}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">销售状态</option>
            <option value="主推款">主推款</option>
            <option value="常规款">常规款</option>
            <option value="长尾款">长尾款</option>
            <option value="新品">新品</option>
            <option value="淘汰款">淘汰款</option>
          </select>
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
            value={filters.inventoryStatus}
            onChange={(e) => setFilters({...filters, inventoryStatus: e.target.value})}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">库存状态</option>
            <option value="充足">充足</option>
            <option value="偏高">偏高</option>
            <option value="偏低">偏低</option>
            <option value="缺货">缺货</option>
            <option value="需清理">需清理</option>
          </select>
          <button
            onClick={() => setFilters({ keyword: '', salesGrade: '', salesStatus: '', channel: '', category: '', inventoryStatus: '' })}
            className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-50"
          >
            重置筛选
          </button>
        </div>
      </div>

      {/* 产品列表 */}
      <div className="flex-1 overflow-hidden p-4">
        <div className="bg-white rounded-lg shadow-sm h-full flex flex-col">
          <div className="flex-1 overflow-auto">
            <table className="w-full text-sm min-w-[1600px]">
              <thead className="bg-gray-50 sticky top-0">
                <tr className="border-b">
                  <th className="px-3 py-3 text-left font-medium text-gray-600 whitespace-nowrap">排名</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 whitespace-nowrap">SKU / 产品信息</th>
                  <th className="px-3 py-3 text-center font-medium text-gray-600 whitespace-nowrap">销售等级</th>
                  <th className="px-3 py-3 text-center font-medium text-gray-600 whitespace-nowrap">销售状态</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 whitespace-nowrap">销售渠道</th>
                  <th className="px-3 py-3 text-right font-medium text-gray-600 whitespace-nowrap">售价/成本</th>
                  <th className="px-3 py-3 text-right font-medium text-gray-600 whitespace-nowrap">毛利率</th>
                  <th className="px-3 py-3 text-right font-medium text-gray-600 whitespace-nowrap">30天销量</th>
                  <th className="px-3 py-3 text-right font-medium text-gray-600 whitespace-nowrap">30天销售额</th>
                  <th className="px-3 py-3 text-center font-medium text-gray-600 whitespace-nowrap">趋势</th>
                  <th className="px-3 py-3 text-right font-medium text-gray-600 whitespace-nowrap">库存/天数</th>
                  <th className="px-3 py-3 text-center font-medium text-gray-600 whitespace-nowrap">评分</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 whitespace-nowrap">销售负责人</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 whitespace-nowrap">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="px-3 py-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        product.salesRank <= 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {product.salesRank}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="max-w-[280px]">
                        <div className="font-mono text-xs text-blue-600 mb-1">{product.sku}</div>
                        <div className="font-medium text-gray-900 truncate">{product.productName}</div>
                        <div className="text-xs text-gray-500">{product.brand} · {product.category}</div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold border ${getSalesGradeStyle(product.salesGrade)}`}>
                        {product.salesGrade}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className={`px-2 py-1 rounded text-xs ${getSalesStatusStyle(product.salesStatus)}`}>
                        {product.salesStatus}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-1 max-w-[140px]">
                        {product.channels.slice(0, 2).map((channel, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs whitespace-nowrap">
                            {channel.replace('Amazon ', 'AMZ ')}
                          </span>
                        ))}
                        {product.channels.length > 2 && (
                          <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                            +{product.channels.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <div className="font-semibold text-gray-900">${product.currentPrice}</div>
                      <div className="text-xs text-gray-500">${product.costPrice}</div>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <span className={`font-semibold ${product.grossMargin >= 75 ? 'text-green-600' : product.grossMargin >= 70 ? 'text-blue-600' : 'text-orange-600'}`}>
                        {product.grossMargin}%
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right font-medium">{product.sales30d.toLocaleString()}</td>
                    <td className="px-3 py-3 text-right">
                      <span className="font-semibold">${(product.salesAmount30d / 1000).toFixed(1)}K</span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      {getTrendIcon(product.salesTrend, product.trendPercent)}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <div className="font-medium">{product.inventoryTotal.toLocaleString()}</div>
                      <div className={`text-xs ${getInventoryStatusStyle(product.inventoryStatus)}`}>
                        {product.inventoryDays}天 · {product.inventoryStatus}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="font-medium">{product.reviewScore}</span>
                      </div>
                      <div className="text-xs text-gray-500">{product.reviewCount}</div>
                    </td>
                    <td className="px-3 py-3 text-xs whitespace-nowrap">{product.salesManager}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleViewProduct(product)}
                          className="p-1.5 bg-blue-600 text-white rounded hover:bg-blue-700"
                          title="查看详情"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 border rounded hover:bg-gray-50" title="编辑">
                          <Edit2 className="w-4 h-4 text-gray-600" />
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
              共 <span className="font-semibold text-gray-800">{filteredData.length}</span> 个产品
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 border rounded hover:bg-gray-100 text-sm">上一页</button>
              <span className="text-sm text-gray-600">1 / 1</span>
              <button className="px-3 py-1 border rounded hover:bg-gray-100 text-sm">下一页</button>
            </div>
          </div>
        </div>
      </div>

      {/* 产品详情抽屉 */}
      {drawerOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
          <div
            className="absolute inset-0 bg-black bg-opacity-30"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="relative bg-white w-full max-w-4xl h-full shadow-2xl flex flex-col overflow-hidden">
            {/* 抽屉头部 */}
            <div className="flex items-center justify-between p-6 border-b flex-shrink-0 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-lg font-bold border-2 ${getSalesGradeStyle(selectedProduct.salesGrade)}`}>
                    {selectedProduct.salesGrade}
                  </span>
                  <div>
                    <h2 className="text-xl font-bold truncate">{selectedProduct.productName}</h2>
                    <p className="text-sm text-gray-500 font-mono">{selectedProduct.sku}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-1 rounded text-xs ${getSalesStatusStyle(selectedProduct.salesStatus)}`}>
                    {selectedProduct.salesStatus}
                  </span>
                  <span className="text-xs text-gray-500">{selectedProduct.brand} · {selectedProduct.category}</span>
                </div>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-2 hover:bg-white rounded-lg flex-shrink-0 ml-4"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 抽屉内容 */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* 核心指标卡片 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center gap-2 text-green-600 mb-2">
                    <DollarSign className="w-5 h-5" />
                    <span className="text-sm font-medium">30天销售额</span>
                  </div>
                  <div className="text-2xl font-bold text-green-700">${selectedProduct.salesAmount30d.toLocaleString()}</div>
                  <div className="flex items-center gap-1 mt-1">
                    {getTrendIcon(selectedProduct.salesTrend, selectedProduct.trendPercent)}
                    <span className="text-xs text-gray-500">vs 上月</span>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center gap-2 text-blue-600 mb-2">
                    <ShoppingCart className="w-5 h-5" />
                    <span className="text-sm font-medium">30天销量</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-700">{selectedProduct.sales30d.toLocaleString()}</div>
                  <div className="text-xs text-gray-500 mt-1">7天销量: {selectedProduct.sales7d}</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center gap-2 text-purple-600 mb-2">
                    <BarChart2 className="w-5 h-5" />
                    <span className="text-sm font-medium">毛利率</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-700">{selectedProduct.grossMargin}%</div>
                  <div className="text-xs text-gray-500 mt-1">成本 ${selectedProduct.costPrice}</div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                  <div className="flex items-center gap-2 text-orange-600 mb-2">
                    <Package className="w-5 h-5" />
                    <span className="text-sm font-medium">库存天数</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-700">{selectedProduct.inventoryDays}天</div>
                  <div className={`text-xs mt-1 ${getInventoryStatusStyle(selectedProduct.inventoryStatus)}`}>
                    {selectedProduct.inventoryStatus}
                  </div>
                </div>
              </div>

              {/* 销售等级说明 */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  销售等级定义
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className={`p-3 rounded-lg border ${selectedProduct.salesGrade === 'A' ? 'ring-2 ring-green-500' : ''} bg-white`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold">A</span>
                      <span className="font-medium">核心产品</span>
                    </div>
                    <p className="text-xs text-gray-500">高销量、高利润、战略产品</p>
                  </div>
                  <div className={`p-3 rounded-lg border ${selectedProduct.salesGrade === 'B' ? 'ring-2 ring-blue-500' : ''} bg-white`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">B</span>
                      <span className="font-medium">重要产品</span>
                    </div>
                    <p className="text-xs text-gray-500">稳定销量、良好利润</p>
                  </div>
                  <div className={`p-3 rounded-lg border ${selectedProduct.salesGrade === 'C' ? 'ring-2 ring-yellow-500' : ''} bg-white`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-6 h-6 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center text-xs font-bold">C</span>
                      <span className="font-medium">一般产品</span>
                    </div>
                    <p className="text-xs text-gray-500">销量一般、需优化</p>
                  </div>
                  <div className={`p-3 rounded-lg border ${selectedProduct.salesGrade === 'D' ? 'ring-2 ring-red-500' : ''} bg-white`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-xs font-bold">D</span>
                      <span className="font-medium">淘汰产品</span>
                    </div>
                    <p className="text-xs text-gray-500">低销量、需清理</p>
                  </div>
                </div>
              </div>

              {/* 价格信息 */}
              <div className="bg-white border rounded-lg p-4 mb-6">
                <h3 className="font-semibold mb-4">价格信息</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500 mb-1">建议零售价 (MSRP)</div>
                    <div className="text-lg font-semibold">${selectedProduct.msrp}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">当前售价</div>
                    <div className="text-lg font-semibold text-blue-600">${selectedProduct.currentPrice}</div>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      selectedProduct.priceStatus === '促销中' ? 'bg-red-100 text-red-700' :
                      selectedProduct.priceStatus === '清仓' ? 'bg-orange-100 text-orange-700' :
                      selectedProduct.priceStatus === '新品价' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {selectedProduct.priceStatus}
                    </span>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">成本价</div>
                    <div className="text-lg font-semibold">${selectedProduct.costPrice}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">毛利率</div>
                    <div className={`text-lg font-semibold ${selectedProduct.grossMargin >= 75 ? 'text-green-600' : 'text-blue-600'}`}>
                      {selectedProduct.grossMargin}%
                    </div>
                  </div>
                </div>
              </div>

              {/* 渠道与库存 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white border rounded-lg p-4">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-600" />
                    销售渠道
                  </h3>
                  <div className="space-y-2">
                    {selectedProduct.channels.map((channel, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">{channel}</span>
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">已上架</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white border rounded-lg p-4">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-orange-600" />
                    库存信息
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">总库存</span>
                      <span className="font-semibold">{selectedProduct.inventoryTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">FBA库存</span>
                      <span className="font-semibold">{selectedProduct.inventoryFBA.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">库存天数</span>
                      <span className={`font-semibold ${getInventoryStatusStyle(selectedProduct.inventoryStatus)}`}>
                        {selectedProduct.inventoryDays}天
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">库存状态</span>
                      <span className={`font-semibold ${getInventoryStatusStyle(selectedProduct.inventoryStatus)}`}>
                        {selectedProduct.inventoryStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 评价与排名 */}
              <div className="bg-white border rounded-lg p-4">
                <h3 className="font-semibold mb-4">评价与排名</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      <span className="text-2xl font-bold text-yellow-700">{selectedProduct.reviewScore}</span>
                    </div>
                    <div className="text-xs text-gray-600">{selectedProduct.reviewCount} 评价</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-700">#{selectedProduct.salesRank}</div>
                    <div className="text-xs text-gray-600">总销售排名</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-700">#{selectedProduct.categoryRank}</div>
                    <div className="text-xs text-gray-600">类目排名</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-700">{selectedProduct.listingQuality}</div>
                    <div className="text-xs text-gray-600">Listing质量</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 抽屉底部操作 */}
            <div className="p-6 border-t bg-gray-50 flex gap-3 flex-wrap flex-shrink-0">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center gap-2">
                <Edit2 className="w-4 h-4" />
                编辑销售属性
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">
                调整销售等级
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
                调整价格
              </button>
              <button className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100">
                查看销售趋势
              </button>
              <button className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100">
                导出报表
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesProductPage;
