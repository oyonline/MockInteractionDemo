// src/pages/SlowMovingAnalysisPage.js
// 滞销分析页面
import React, { useState, useMemo } from 'react';
import {
  Search, Filter, AlertTriangle, TrendingDown, Package,
  DollarSign, Calendar, Eye, ArrowRight, X, BarChart3
} from 'lucide-react';

const SlowMovingAnalysisPage = () => {
  const [filters, setFilters] = useState({
    keyword: '',
    salesTeam: '',
    salesManager: '',
    level: '',
    inventoryMin: '',
    inventoryMax: ''
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Mock数据 - 12个产品覆盖所有滞销等级
  const productsData = [
    // 严重滞销 (>80%)
    {
      id: 'SM-001',
      sku: 'KK-RL-2023-OLD',
      productName: '旧款路亚竿 6尺 停产型号',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100&h=100&fit=crop',
      brand: 'KastKing',
      salesTeam: '渔具组',
      salesManager: '王芳',
      salesStatus: '淘汰款',
      inventory: 5680,
      sales30d: 85,
      dailyAvgSales: 2.8,
      costPrice: 35,
      launchDate: '2023-01-15',
      lastInboundDate: '2023-08-20'
    },
    {
      id: 'SM-002',
      sku: 'KK-SK2-LEGACY',
      productName: 'Sharky II 旧款纺车轮',
      image: 'https://images.unsplash.com/photo-1516967124798-10656f7dca28?w=100&h=100&fit=crop',
      brand: 'KastKing',
      salesTeam: '渔具组',
      salesManager: '李明',
      salesStatus: '淘汰款',
      inventory: 4200,
      sales30d: 62,
      dailyAvgSales: 2.1,
      costPrice: 28,
      launchDate: '2023-03-10',
      lastInboundDate: '2023-09-15'
    },
    {
      id: 'SM-003',
      sku: 'PF-BAG-OLD-BK',
      productName: '旧款钓鱼包 黑色大号',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop',
      brand: 'Piscifun',
      salesTeam: '服饰箱包组',
      salesManager: '赵敏',
      salesStatus: '淘汰款',
      inventory: 3800,
      sales30d: 55,
      dailyAvgSales: 1.8,
      costPrice: 18,
      launchDate: '2023-05-20',
      lastInboundDate: '2023-10-10'
    },
    // 中度滞销 (50%-80%)
    {
      id: 'SM-004',
      sku: 'KK-RL-2024-8FT',
      productName: 'Royale Legend 8尺路亚竿 长尺',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100&h=100&fit=crop',
      brand: 'KastKing',
      salesTeam: '渔具组',
      salesManager: '王芳',
      salesStatus: '长尾款',
      inventory: 3200,
      sales30d: 186,
      dailyAvgSales: 6.2,
      costPrice: 42,
      launchDate: '2024-02-01',
      lastInboundDate: '2024-06-15'
    },
    {
      id: 'SM-005',
      sku: 'KK-MG-2000',
      productName: 'Megatron 2000小型纺车轮',
      image: 'https://images.unsplash.com/photo-1516967124798-10656f7dca28?w=100&h=100&fit=crop',
      brand: 'KastKing',
      salesTeam: '渔具组',
      salesManager: '李明',
      salesStatus: '长尾款',
      inventory: 2800,
      sales30d: 195,
      dailyAvgSales: 6.5,
      costPrice: 25,
      launchDate: '2024-03-15',
      lastInboundDate: '2024-07-20'
    },
    {
      id: 'SM-006',
      sku: 'PF-LINE-10LB',
      productName: '10磅编织线 细线径',
      image: 'https://images.unsplash.com/photo-1516967124798-10656f7dca28?w=100&h=100&fit=crop',
      brand: 'Piscifun',
      salesTeam: '渔线组',
      salesManager: '赵敏',
      salesStatus: '长尾款',
      inventory: 4500,
      sales30d: 325,
      dailyAvgSales: 10.8,
      costPrice: 5.5,
      launchDate: '2024-01-20',
      lastInboundDate: '2024-08-05'
    },
    // 轻度滞销 (20%-50%)
    {
      id: 'SM-007',
      sku: 'KK-IC-15L',
      productName: 'iCool 智能钓箱 15L 小号',
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=100&h=100&fit=crop',
      brand: 'KastKing',
      salesTeam: '工具组',
      salesManager: '李明',
      salesStatus: '常规款',
      inventory: 1800,
      sales30d: 210,
      dailyAvgSales: 7.0,
      costPrice: 65,
      launchDate: '2024-06-01',
      lastInboundDate: '2024-09-10'
    },
    {
      id: 'SM-008',
      sku: 'PF-TAC-S-GN',
      productName: '战术路亚包 S号 军绿',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop',
      brand: 'Piscifun',
      salesTeam: '服饰箱包组',
      salesManager: '赵敏',
      salesStatus: '常规款',
      inventory: 1500,
      sales30d: 198,
      dailyAvgSales: 6.6,
      costPrice: 15,
      launchDate: '2024-07-15',
      lastInboundDate: '2024-10-20'
    },
    {
      id: 'SM-009',
      sku: 'KK-SK3-4000',
      productName: 'Sharky III 4000中型轮',
      image: 'https://images.unsplash.com/photo-1516967124798-10656f7dca28?w=100&h=100&fit=crop',
      brand: 'KastKing',
      salesTeam: '渔具组',
      salesManager: '王芳',
      salesStatus: '常规款',
      inventory: 2200,
      sales30d: 336,
      dailyAvgSales: 11.2,
      costPrice: 38,
      launchDate: '2024-04-20',
      lastInboundDate: '2024-09-25'
    },
    // 正常 (<20%)
    {
      id: 'SM-010',
      sku: 'KK-RL-2024-7FT',
      productName: 'Royale Legend 7尺路亚竿 主推款',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100&h=100&fit=crop',
      brand: 'KastKing',
      salesTeam: '渔具组',
      salesManager: '王芳',
      salesStatus: '主推款',
      inventory: 1200,
      sales30d: 1256,
      dailyAvgSales: 41.9,
      costPrice: 45,
      launchDate: '2024-01-10',
      lastInboundDate: '2024-12-01'
    },
    {
      id: 'SM-011',
      sku: 'KK-MG-3000',
      productName: 'Megatron 3000纺车轮 主推款',
      image: 'https://images.unsplash.com/photo-1516967124798-10656f7dca28?w=100&h=100&fit=crop',
      brand: 'KastKing',
      salesTeam: '渔具组',
      salesManager: '李明',
      salesStatus: '主推款',
      inventory: 980,
      sales30d: 892,
      dailyAvgSales: 29.7,
      costPrice: 28,
      launchDate: '2024-02-20',
      lastInboundDate: '2024-11-15'
    },
    {
      id: 'SM-012',
      sku: 'PF-TAC-L-BK',
      productName: '战术路亚包 L号 黑色 主推款',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop',
      brand: 'Piscifun',
      salesTeam: '服饰箱包组',
      salesManager: '赵敏',
      salesStatus: '主推款',
      inventory: 850,
      sales30d: 756,
      dailyAvgSales: 25.2,
      costPrice: 20,
      launchDate: '2024-03-01',
      lastInboundDate: '2024-12-10'
    }
  ];

  // 计算滞销相关数据
  const DAYS_6_MONTHS = 180;

  const calculateSlowMoving = (product) => {
    const forecast6mSales = Math.round(product.dailyAvgSales * DAYS_6_MONTHS);
    const remainingInventory = Math.max(0, product.inventory - forecast6mSales);
    const slowMovingRate = (remainingInventory / product.inventory) * 100;
    const sellableDays = product.dailyAvgSales > 0 
      ? Math.round(product.inventory / product.dailyAvgSales) 
      : 999;
    
    let level, levelColor, suggestion;
    if (slowMovingRate > 80) {
      level = '严重滞销';
      levelColor = 'bg-red-100 text-red-700 border-red-200';
      suggestion = '立即清仓';
    } else if (slowMovingRate > 50) {
      level = '中度滞销';
      levelColor = 'bg-orange-100 text-orange-700 border-orange-200';
      suggestion = '促销降价';
    } else if (slowMovingRate > 20) {
      level = '轻度滞销';
      levelColor = 'bg-yellow-100 text-yellow-700 border-yellow-200';
      suggestion = '控制补货';
    } else {
      level = '正常';
      levelColor = 'bg-green-100 text-green-700 border-green-200';
      suggestion = '正常销售';
    }

    return {
      ...product,
      forecast6mSales,
      remainingInventory,
      slowMovingRate: slowMovingRate.toFixed(1),
      sellableDays,
      level,
      levelColor,
      suggestion,
      inventoryValue: product.inventory * product.costPrice
    };
  };

  // 处理数据并排序（滞销率从高到低）
  const processedData = useMemo(() => {
    return productsData.map(calculateSlowMoving).sort((a, b) => b.slowMovingRate - a.slowMovingRate);
  }, []);

  // 筛选数据
  const filteredData = useMemo(() => {
    return processedData.filter(product => {
      if (filters.keyword && !product.sku.toLowerCase().includes(filters.keyword.toLowerCase()) &&
          !product.productName.toLowerCase().includes(filters.keyword.toLowerCase())) return false;
      if (filters.salesTeam && product.salesTeam !== filters.salesTeam) return false;
      if (filters.salesManager && product.salesManager !== filters.salesManager) return false;
      if (filters.level && product.level !== filters.level) return false;
      if (filters.inventoryMin && product.inventory < parseInt(filters.inventoryMin)) return false;
      if (filters.inventoryMax && product.inventory > parseInt(filters.inventoryMax)) return false;
      return true;
    });
  }, [processedData, filters]);

  // 统计数据
  const stats = {
    totalProducts: processedData.length,
    totalInventoryValue: processedData.reduce((sum, p) => sum + p.inventoryValue, 0),
    severeCount: processedData.filter(p => p.level === '严重滞销').length,
    moderateCount: processedData.filter(p => p.level === '中度滞销').length,
    mildCount: processedData.filter(p => p.level === '轻度滞销').length,
    normalCount: processedData.filter(p => p.level === '正常').length,
    atRiskValue: processedData
      .filter(p => ['严重滞销', '中度滞销'].includes(p.level))
      .reduce((sum, p) => sum + p.remainingInventory * p.costPrice, 0)
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setDrawerOpen(true);
  };

  // 生成近6个月销量趋势数据（用于详情页图表）
  const generateSalesTrend = (baseSales) => {
    const trend = [];
    for (let i = 6; i >= 0; i--) {
      const month = new Date();
      month.setMonth(month.getMonth() - i);
      const variance = 0.7 + Math.random() * 0.6;
      trend.push({
        month: `${month.getMonth() + 1}月`,
        sales: Math.round(baseSales * variance)
      });
    }
    return trend;
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* 顶部区域 */}
      <div className="bg-white shadow-sm p-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-orange-500" />
            <h2 className="text-xl font-bold">滞销分析</h2>
            <span className="text-sm text-gray-500">基于6个月销量预测</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              高级筛选
            </button>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
              导出滞销清单
            </button>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-4">
          <div className="bg-gray-50 rounded-lg p-3 border">
            <div className="text-2xl font-bold text-gray-800">{stats.totalProducts}</div>
            <div className="text-xs text-gray-500">分析产品数</div>
          </div>
          <div className="bg-red-50 rounded-lg p-3 border border-red-200">
            <div className="text-2xl font-bold text-red-600">{stats.severeCount}</div>
            <div className="text-xs text-red-600">严重滞销</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
            <div className="text-2xl font-bold text-orange-600">{stats.moderateCount}</div>
            <div className="text-xs text-orange-600">中度滞销</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-600">{stats.mildCount}</div>
            <div className="text-xs text-yellow-600">轻度滞销</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 border border-green-200">
            <div className="text-2xl font-bold text-green-600">{stats.normalCount}</div>
            <div className="text-xs text-green-600">库存正常</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
            <div className="text-lg font-bold text-purple-600">${(stats.atRiskValue / 1000).toFixed(1)}K</div>
            <div className="text-xs text-purple-600">滞销库存风险金额</div>
          </div>
        </div>

        {/* 筛选条件 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
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
            value={filters.salesTeam}
            onChange={(e) => setFilters({...filters, salesTeam: e.target.value})}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">销售小组</option>
            <option value="渔具组">渔具组</option>
            <option value="渔线组">渔线组</option>
            <option value="工具组">工具组</option>
            <option value="服饰箱包组">服饰箱包组</option>
          </select>
          <select
            value={filters.salesManager}
            onChange={(e) => setFilters({...filters, salesManager: e.target.value})}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">销售负责人</option>
            <option value="王芳">王芳</option>
            <option value="李明">李明</option>
            <option value="赵敏">赵敏</option>
          </select>
          <select
            value={filters.level}
            onChange={(e) => setFilters({...filters, level: e.target.value})}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">滞销等级</option>
            <option value="严重滞销">严重滞销</option>
            <option value="中度滞销">中度滞销</option>
            <option value="轻度滞销">轻度滞销</option>
            <option value="正常">正常</option>
          </select>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="库存≥"
              value={filters.inventoryMin}
              onChange={(e) => setFilters({...filters, inventoryMin: e.target.value})}
              className="w-20 px-2 py-2 border rounded-lg text-sm"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              placeholder="库存≤"
              value={filters.inventoryMax}
              onChange={(e) => setFilters({...filters, inventoryMax: e.target.value})}
              className="w-20 px-2 py-2 border rounded-lg text-sm"
            />
          </div>
          <button
            onClick={() => setFilters({ keyword: '', salesTeam: '', salesManager: '', level: '', inventoryMin: '', inventoryMax: '' })}
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
            <table className="w-full text-sm min-w-[1500px]">
              <thead className="bg-gray-50 sticky top-0">
                <tr className="border-b">
                  <th className="px-3 py-3 text-left font-medium text-gray-600 whitespace-nowrap">排名</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 whitespace-nowrap">产品图片</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 whitespace-nowrap">SKU / 产品名称</th>
                  <th className="px-3 py-3 text-center font-medium text-gray-600 whitespace-nowrap">销售小组</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 whitespace-nowrap">销售负责人</th>
                  <th className="px-3 py-3 text-right font-medium text-gray-600 whitespace-nowrap">当前库存</th>
                  <th className="px-3 py-3 text-right font-medium text-gray-600 whitespace-nowrap">近30天销量</th>
                  <th className="px-3 py-3 text-right font-medium text-gray-600 whitespace-nowrap">日均销量</th>
                  <th className="px-3 py-3 text-right font-medium text-gray-600 whitespace-nowrap">预计可售天数</th>
                  <th className="px-3 py-3 text-right font-medium text-gray-600 whitespace-nowrap">6月后剩余库存</th>
                  <th className="px-3 py-3 text-right font-medium text-gray-600 whitespace-nowrap">滞销率</th>
                  <th className="px-3 py-3 text-center font-medium text-gray-600 whitespace-nowrap">滞销等级</th>
                  <th className="px-3 py-3 text-center font-medium text-gray-600 whitespace-nowrap">建议操作</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 whitespace-nowrap">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((product, index) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="px-3 py-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index < 3 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <img 
                        src={product.image} 
                        alt={product.productName}
                        className="w-12 h-12 rounded-lg object-cover border"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <div className="max-w-[200px]">
                        <div className="font-mono text-xs text-blue-600 mb-1">{product.sku}</div>
                        <div className="font-medium text-gray-900 truncate">{product.productName}</div>
                        <div className="text-xs text-gray-500">{product.brand}</div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                        {product.salesTeam}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-xs whitespace-nowrap">{product.salesManager}</td>
                    <td className="px-3 py-3 text-right">
                      <span className="font-semibold">{product.inventory.toLocaleString()}</span>
                    </td>
                    <td className="px-3 py-3 text-right">{product.sales30d.toLocaleString()}</td>
                    <td className="px-3 py-3 text-right text-gray-600">{product.dailyAvgSales}</td>
                    <td className="px-3 py-3 text-right">
                      <span className={product.sellableDays > 180 ? 'text-red-600 font-semibold' : 'text-gray-800'}>
                        {product.sellableDays}天
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <span className={product.remainingInventory > 0 ? 'text-red-600 font-semibold' : 'text-green-600'}>
                        {product.remainingInventory.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <span className={`font-bold ${
                        product.slowMovingRate > 80 ? 'text-red-600' :
                        product.slowMovingRate > 50 ? 'text-orange-600' :
                        product.slowMovingRate > 20 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {product.slowMovingRate}%
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className={`px-2 py-1 rounded text-xs border ${product.levelColor}`}>
                        {product.level}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className={`px-2 py-1 rounded text-xs ${
                        product.suggestion === '立即清仓' ? 'bg-red-100 text-red-700' :
                        product.suggestion === '促销降价' ? 'bg-orange-100 text-orange-700' :
                        product.suggestion === '控制补货' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {product.suggestion}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <button
                        onClick={() => handleViewProduct(product)}
                        className="p-1.5 bg-blue-600 text-white rounded hover:bg-blue-700"
                        title="查看详情"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
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
              {filteredData.length !== processedData.length && ` (筛选自 ${processedData.length} 个)`}
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 border rounded hover:bg-gray-100 text-sm">上一页</button>
              <span className="text-sm text-gray-600">1 / 1</span>
              <button className="px-3 py-1 border rounded hover:bg-gray-100 text-sm">下一页</button>
            </div>
          </div>
        </div>
      </div>

      {/* 详情抽屉 */}
      {drawerOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
          <div
            className="absolute inset-0 bg-black bg-opacity-30"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="relative bg-white w-full max-w-3xl h-full shadow-2xl flex flex-col overflow-hidden">
            {/* 抽屉头部 */}
            <div className="flex items-center justify-between p-6 border-b flex-shrink-0 bg-gradient-to-r from-orange-50 to-red-50">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.productName}
                    className="w-14 h-14 rounded-lg object-cover border"
                  />
                  <div>
                    <h2 className="text-xl font-bold truncate">{selectedProduct.productName}</h2>
                    <p className="text-sm text-gray-500 font-mono">{selectedProduct.sku}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-1 rounded text-xs border ${selectedProduct.levelColor}`}>
                    {selectedProduct.level}
                  </span>
                  <span className="text-xs text-gray-500">{selectedProduct.brand} · {selectedProduct.salesTeam}</span>
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
              {/* 滞销分析概览 */}
              <div className="bg-white border rounded-lg p-5 mb-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-red-500" />
                  滞销分析概览
                </h3>
                
                {/* 核心指标卡片 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                  <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                    <div className="text-xs text-red-600 mb-1">滞销率</div>
                    <div className="text-3xl font-bold text-red-700">{selectedProduct.slowMovingRate}%</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="text-xs text-blue-600 mb-1">当前库存</div>
                    <div className="text-2xl font-bold text-blue-700">{selectedProduct.inventory.toLocaleString()}</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                    <div className="text-xs text-orange-600 mb-1">6个月预计销量</div>
                    <div className="text-2xl font-bold text-orange-700">{selectedProduct.forecast6mSales.toLocaleString()}</div>
                  </div>
                  <div className={`rounded-lg p-4 border ${selectedProduct.remainingInventory > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                    <div className={`text-xs mb-1 ${selectedProduct.remainingInventory > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      6个月后剩余库存
                    </div>
                    <div className={`text-2xl font-bold ${selectedProduct.remainingInventory > 0 ? 'text-red-700' : 'text-green-700'}`}>
                      {selectedProduct.remainingInventory.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* 建议操作 */}
                <div className={`p-4 rounded-lg border ${
                  selectedProduct.level === '严重滞销' ? 'bg-red-50 border-red-200' :
                  selectedProduct.level === '中度滞销' ? 'bg-orange-50 border-orange-200' :
                  selectedProduct.level === '轻度滞销' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-green-50 border-green-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`text-sm font-medium mb-1 ${
                        selectedProduct.level === '严重滞销' ? 'text-red-700' :
                        selectedProduct.level === '中度滞销' ? 'text-orange-700' :
                        selectedProduct.level === '轻度滞销' ? 'text-yellow-700' :
                        'text-green-700'
                      }`}>
                        建议操作：{selectedProduct.suggestion}
                      </div>
                      <div className="text-xs text-gray-600">
                        {selectedProduct.level === '严重滞销' && '库存严重过剩，建议立即清仓处理，避免资金进一步积压'}
                        {selectedProduct.level === '中度滞销' && '库存偏多，建议通过促销活动提升销量，或调整采购计划'}
                        {selectedProduct.level === '轻度滞销' && '库存略多，建议暂停补货，观察销量变化'}
                        {selectedProduct.level === '正常' && '库存周转正常，维持现有销售策略'}
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
                      生成处理方案
                    </button>
                  </div>
                </div>
              </div>

              {/* 销量趋势 */}
              <div className="bg-white border rounded-lg p-5 mb-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  近6个月销量趋势
                </h3>
                <div className="h-48 flex items-end gap-3 px-4">
                  {generateSalesTrend(selectedProduct.sales30d).map((item, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-blue-200 rounded-t transition-all hover:bg-blue-300"
                        style={{ height: `${(item.sales / Math.max(...generateSalesTrend(selectedProduct.sales30d).map(i => i.sales))) * 150}px` }}
                      />
                      <div className="text-xs text-gray-500 mt-2">{item.month}</div>
                      <div className="text-xs text-gray-400">{item.sales}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 库存分析 */}
              <div className="bg-white border rounded-lg p-5 mb-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-orange-500" />
                  库存分析
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">库存成本价值</div>
                    <div className="text-xl font-bold text-gray-800">
                      ${(selectedProduct.inventoryValue).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      单价 ${selectedProduct.costPrice} × {selectedProduct.inventory}件
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">风险库存价值</div>
                    <div className="text-xl font-bold text-red-600">
                      ${(selectedProduct.remainingInventory * selectedProduct.costPrice).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      滞销部分可能损失
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-700 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>上次入库日期：{selectedProduct.lastInboundDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-700 text-sm mt-1">
                    <DollarSign className="w-4 h-4" />
                    <span>产品上架日期：{selectedProduct.launchDate}</span>
                  </div>
                </div>
              </div>

              {/* 滞销原因分析 */}
              <div className="bg-gray-50 rounded-lg p-5">
                <h3 className="font-semibold mb-4">滞销原因分析</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      selectedProduct.salesStatus === '淘汰款' ? 'bg-red-500' : 'bg-gray-300'
                    }`} />
                    <div className="flex-1">
                      <div className="text-sm font-medium">产品生命周期</div>
                      <div className="text-xs text-gray-500">
                        当前状态：{selectedProduct.salesStatus}
                        {selectedProduct.salesStatus === '淘汰款' && ' - 产品已停产，销量持续下滑'}
                        {selectedProduct.salesStatus === '长尾款' && ' - 非主推产品，自然流量销售'}
                        {selectedProduct.salesStatus === '常规款' && ' - 常规销售中，需关注库存周转'}
                        {selectedProduct.salesStatus === '主推款' && ' - 主力销售产品，库存周转正常'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      selectedProduct.sellableDays > 180 ? 'bg-red-500' : 'bg-gray-300'
                    }`} />
                    <div className="flex-1">
                      <div className="text-sm font-medium">库存周转</div>
                      <div className="text-xs text-gray-500">
                        预计可售{selectedProduct.sellableDays}天
                        {selectedProduct.sellableDays > 180 && ' - 库存过剩，超过6个月安全库存'}
                        {selectedProduct.sellableDays > 90 && selectedProduct.sellableDays <= 180 && ' - 库存偏高，需关注'}
                        {selectedProduct.sellableDays <= 90 && ' - 库存周转正常'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 抽屉底部操作 */}
            <div className="p-6 border-t bg-gray-50 flex gap-3 flex-wrap flex-shrink-0">
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 flex items-center gap-2">
                <TrendingDown className="w-4 h-4" />
                创建清仓方案
              </button>
              <button className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700">
                发起促销活动
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                调整采购计划
              </button>
              <button className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100">
                标记观察
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlowMovingAnalysisPage;
