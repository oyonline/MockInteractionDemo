import React, { useState } from 'react';
import {
  Search, Filter, Star,
  Globe, Edit2, Eye, X
} from 'lucide-react';

const SalesProductPage = () => {
  const [filters, setFilters] = useState({
    keyword: '',
    salesGrade: '',
    salesStatus: '',
    channel: '',
    salesTeam: '',
    amazonCategory: '',
    salesCategoryL1: '',
    site: '',
    planType: '',
    isNew: ''
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars -- 预留 table/card 切换
  const [viewMode, setViewMode] = useState('table');

  // 销售产品基础数据
  const salesProductData = [
    {
      id: 'SP-001',
      sku: 'KK-RL-2024-7FT-M',
      productName: 'Royale Legend 7尺路亚竿 中调',
      productNameEN: 'Royale Legend 7ft Casting Rod Medium',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100&h=100&fit=crop',
      brand: 'KastKing',
      amazonCategory: 'Sports & Outdoors > Fishing > Rods',
      salesCategoryL1: '渔具',
      salesCategoryL2: '钓鱼竿',
      series: 'Royale Legend系列',
      salesGrade: 'A',
      salesStatus: '主推款',
      channels: ['Amazon US', 'Amazon EU', 'eBay', '独立站'],
      salesManager: '王芳',
      salesTeam: '渔具组',
      isNew: false,
      launchDate: '2024-03-15',
      planType: '精铺',
      sites: ['US', 'CA', 'UK'],
      asins: [
        { site: 'US', asin: 'B08N5WRWNW' },
        { site: 'CA', asin: 'B08N5WRWNW' },
        { site: 'UK', asin: 'B08N5WRWNX' }
      ],
      updateTime: '2025-02-08 10:30'
    },
    {
      id: 'SP-002',
      sku: 'KK-MG-2024-3000',
      productName: 'Megatron 3000纺车轮',
      productNameEN: 'Megatron 3000 Spinning Reel',
      image: 'https://images.unsplash.com/photo-1516967124798-10656f7dca28?w=100&h=100&fit=crop',
      brand: 'KastKing',
      amazonCategory: 'Sports & Outdoors > Fishing > Reels',
      salesCategoryL1: '渔具',
      salesCategoryL2: '渔线轮',
      series: 'Megatron系列',
      salesGrade: 'A',
      salesStatus: '主推款',
      channels: ['Amazon US', 'Amazon EU', '独立站'],
      salesManager: '王芳',
      salesTeam: '渔具组',
      isNew: false,
      launchDate: '2024-01-20',
      planType: '精做',
      sites: ['US', 'EU'],
      asins: [
        { site: 'US', asin: 'B08Q4KMBGK' },
        { site: 'EU', asin: 'B08Q4KMBGL' }
      ],
      updateTime: '2025-02-08 09:15'
    },
    {
      id: 'SP-003',
      sku: 'KK-SD-2024-7FT-XF',
      productName: 'Speed Demon 7尺竞技竿 超快调',
      productNameEN: 'Speed Demon 7ft Competition Rod Extra Fast',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100&h=100&fit=crop',
      brand: 'KastKing',
      amazonCategory: 'Sports & Outdoors > Fishing > Rods',
      salesCategoryL1: '渔具',
      salesCategoryL2: '钓鱼竿',
      series: 'Speed Demon系列',
      salesGrade: 'B',
      salesStatus: '常规款',
      channels: ['Amazon US', '独立站'],
      salesManager: '李明',
      salesTeam: '渔具组',
      isNew: false,
      launchDate: '2023-11-10',
      planType: '精铺',
      sites: ['US', 'JP'],
      asins: [
        { site: 'US', asin: 'B08Q4KMBGM' },
        { site: 'JP', asin: 'B08Q4KMBGN' }
      ],
      updateTime: '2025-02-07 16:45'
    },
    {
      id: 'SP-004',
      sku: 'KK-SK3-2024-12FT-H',
      productName: 'Sharky III 12尺海竿 硬调',
      productNameEN: 'Sharky III 12ft Surf Rod Heavy',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100&h=100&fit=crop',
      brand: 'KastKing',
      amazonCategory: 'Sports & Outdoors > Fishing > Rods',
      salesCategoryL1: '渔具',
      salesCategoryL2: '钓鱼竿',
      series: 'Sharky III系列',
      salesGrade: 'B',
      salesStatus: '常规款',
      channels: ['Amazon US', 'eBay'],
      salesManager: '李明',
      salesTeam: '渔具组',
      isNew: true,
      launchDate: '2025-01-05',
      planType: '精做',
      sites: ['US'],
      asins: [
        { site: 'US', asin: 'B0DXXXXXXX' }
      ],
      updateTime: '2025-02-08 11:20'
    },
    {
      id: 'SP-005',
      sku: 'PF-TAC-2024-L-BK',
      productName: '战术路亚包 L号 黑色',
      productNameEN: 'Tactical Tackle Bag Large Black',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop',
      brand: 'Piscifun',
      amazonCategory: 'Sports & Outdoors > Fishing > Tackle Bags',
      salesCategoryL1: '服饰箱包',
      salesCategoryL2: '路亚包',
      series: '战术系列',
      salesGrade: 'B',
      salesStatus: '常规款',
      channels: ['Amazon US', '独立站'],
      salesManager: '赵敏',
      salesTeam: '服饰箱包组',
      isNew: true,
      launchDate: '2024-12-20',
      planType: '铺货',
      sites: ['US', 'CA', 'MX'],
      asins: [
        { site: 'US', asin: 'B08ABC1234' },
        { site: 'CA', asin: 'B08ABC1235' },
        { site: 'MX', asin: 'B08ABC1236' }
      ],
      updateTime: '2025-02-08 08:45'
    },
    {
      id: 'SP-006',
      sku: 'PF-CARB-2024-20LB-150M',
      productName: '碳素编织线 20磅 150米',
      productNameEN: 'Carbon Braided Line 20LB 150M',
      image: 'https://images.unsplash.com/photo-1516967124798-10656f7dca28?w=100&h=100&fit=crop',
      brand: 'Piscifun',
      amazonCategory: 'Sports & Outdoors > Fishing > Line',
      salesCategoryL1: '渔具',
      salesCategoryL2: '钓鱼线',
      series: '碳素系列',
      salesGrade: 'C',
      salesStatus: '长尾款',
      channels: ['Amazon US'],
      salesManager: '赵敏',
      salesTeam: '渔线组',
      isNew: false,
      launchDate: '2024-06-15',
      planType: '精铺',
      sites: ['US'],
      asins: [
        { site: 'US', asin: 'B08DEF5678' }
      ],
      updateTime: '2025-02-08 14:10'
    },
    {
      id: 'SP-007',
      sku: 'KK-IC-2024-25L-WH',
      productName: 'iCool 智能钓箱 25L 白色',
      productNameEN: 'iCool Smart Cooler 25L White',
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=100&h=100&fit=crop',
      brand: 'KastKing',
      amazonCategory: 'Sports & Outdoors > Fishing > Coolers',
      salesCategoryL1: '工具',
      salesCategoryL2: '钓箱',
      series: 'iCool系列',
      salesGrade: 'C',
      salesStatus: '新品',
      channels: ['独立站'],
      salesManager: '李明',
      salesTeam: '工具组',
      isNew: true,
      launchDate: '2025-01-25',
      planType: '精做',
      sites: ['US', 'EU', 'JP'],
      asins: [
        { site: 'US', asin: 'B0DYYYYYYY' },
        { site: 'EU', asin: 'B0DYYYYYYZ' },
        { site: 'JP', asin: 'B0DYYYYYYW' }
      ],
      updateTime: '2025-02-08 09:00'
    },
    {
      id: 'SP-008',
      sku: 'KK-RL-2023-6FT-ML',
      productName: 'Royale Legend 6尺路亚竿 中轻调 (旧款)',
      productNameEN: 'Royale Legend 6ft Casting Rod Medium Light (Legacy)',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100&h=100&fit=crop',
      brand: 'KastKing',
      amazonCategory: 'Sports & Outdoors > Fishing > Rods',
      salesCategoryL1: '渔具',
      salesCategoryL2: '钓鱼竿',
      series: 'Royale Legend系列',
      salesGrade: 'D',
      salesStatus: '淘汰款',
      channels: ['Amazon US'],
      salesManager: '王芳',
      salesTeam: '渔具组',
      isNew: false,
      launchDate: '2023-08-10',
      planType: '精铺',
      sites: ['US', 'CA'],
      asins: [
        { site: 'US', asin: 'B08GHI9999' },
        { site: 'CA', asin: 'B08GHI9998' }
      ],
      updateTime: '2025-02-07 15:30'
    },
    {
      id: 'SP-009',
      sku: 'KK-SK3R-2024-5000',
      productName: 'Sharky III 5000海钓轮',
      productNameEN: 'Sharky III 5000 Saltwater Reel',
      image: 'https://images.unsplash.com/photo-1516967124798-10656f7dca28?w=100&h=100&fit=crop',
      brand: 'KastKing',
      amazonCategory: 'Sports & Outdoors > Fishing > Reels',
      salesCategoryL1: '渔具',
      salesCategoryL2: '渔线轮',
      series: 'Sharky III系列',
      salesGrade: 'B',
      salesStatus: '常规款',
      channels: ['Amazon US', 'eBay', '独立站'],
      salesManager: '李明',
      salesTeam: '渔具组',
      isNew: false,
      launchDate: '2024-04-20',
      planType: '精做',
      sites: ['US', 'UK', 'DE', 'FR'],
      asins: [
        { site: 'US', asin: 'B08JKL0000' },
        { site: 'UK', asin: 'B08JKL0001' },
        { site: 'DE', asin: 'B08JKL0002' },
        { site: 'FR', asin: 'B08JKL0003' }
      ],
      updateTime: '2025-02-08 13:25'
    },
    {
      id: 'SP-010',
      sku: 'PF-TAC-2024-M-GN',
      productName: '战术路亚包 M号 军绿',
      productNameEN: 'Tactical Tackle Bag Medium Army Green',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop',
      brand: 'Piscifun',
      amazonCategory: 'Sports & Outdoors > Fishing > Tackle Bags',
      salesCategoryL1: '服饰箱包',
      salesCategoryL2: '路亚包',
      series: '战术系列',
      salesGrade: 'C',
      salesStatus: '长尾款',
      channels: ['Amazon US'],
      salesManager: '赵敏',
      salesTeam: '服饰箱包组',
      isNew: false,
      launchDate: '2024-09-01',
      planType: '铺货',
      sites: ['US'],
      asins: [
        { site: 'US', asin: 'B08MNO1111' }
      ],
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

  // 获取销售小组样式
  const getSalesTeamStyle = (team) => {
    const styles = {
      '渔具组': 'bg-blue-100 text-blue-700',
      '渔线组': 'bg-cyan-100 text-cyan-700',
      '工具组': 'bg-orange-100 text-orange-700',
      '服饰箱包组': 'bg-pink-100 text-pink-700'
    };
    return styles[team] || 'bg-gray-100 text-gray-700';
  };

  // 获取销售一级类目样式
  const getSalesCategoryL1Style = (category) => {
    const styles = {
      '渔具': 'bg-emerald-100 text-emerald-700',
      '服饰箱包': 'bg-purple-100 text-purple-700',
      '工具': 'bg-amber-100 text-amber-700'
    };
    return styles[category] || 'bg-gray-100 text-gray-700';
  };

  // 获取方案类型样式
  const getPlanTypeStyle = (type) => {
    const styles = {
      '精做': 'bg-red-100 text-red-700 border-red-200',
      '精铺': 'bg-blue-100 text-blue-700 border-blue-200',
      '铺货': 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return styles[type] || 'bg-gray-100 text-gray-700';
  };

  // 获取站点flag
  const getSiteFlag = (site) => {
    const flags = {
      'US': '🇺🇸',
      'CA': '🇨🇦',
      'MX': '🇲🇽',
      'UK': '🇬🇧',
      'DE': '🇩🇪',
      'FR': '🇫🇷',
      'IT': '🇮🇹',
      'ES': '🇪🇸',
      'JP': '🇯🇵',
      'AU': '🇦🇺',
      'EU': '🇪🇺'
    };
    return flags[site] || '🌐';
  };



  // 筛选数据
  const filteredData = salesProductData.filter(product => {
    if (filters.keyword && !product.sku.toLowerCase().includes(filters.keyword.toLowerCase()) &&
        !product.productName.toLowerCase().includes(filters.keyword.toLowerCase())) return false;
    if (filters.salesGrade && product.salesGrade !== filters.salesGrade) return false;
    if (filters.salesStatus && product.salesStatus !== filters.salesStatus) return false;
    if (filters.channel && !product.channels.includes(filters.channel)) return false;
    if (filters.salesTeam && product.salesTeam !== filters.salesTeam) return false;
    if (filters.amazonCategory && !product.amazonCategory.includes(filters.amazonCategory)) return false;
    if (filters.salesCategoryL1 && product.salesCategoryL1 !== filters.salesCategoryL1) return false;
    if (filters.site && !product.sites.includes(filters.site)) return false;
    if (filters.planType && product.planType !== filters.planType) return false;
    if (filters.isNew !== '' && product.isNew !== (filters.isNew === 'true')) return false;
    return true;
  });

  // 统计数据 - 按产品和状态分布
  const stats = {
    totalProducts: salesProductData.length,
    // 各销售小组产品数
    teamYuju: salesProductData.filter(p => p.salesTeam === '渔具组').length,
    teamYuxian: salesProductData.filter(p => p.salesTeam === '渔线组').length,
    teamGongju: salesProductData.filter(p => p.salesTeam === '工具组').length,
    teamFushi: salesProductData.filter(p => p.salesTeam === '服饰箱包组').length,
    // 各销售状态产品数
    statusMain: salesProductData.filter(p => p.salesStatus === '主推款').length,
    statusNormal: salesProductData.filter(p => p.salesStatus === '常规款').length,
    statusLong: salesProductData.filter(p => p.salesStatus === '长尾款').length,
    statusNew: salesProductData.filter(p => p.salesStatus === '新品').length,
    statusDel: salesProductData.filter(p => p.salesStatus === '淘汰款').length,
    // 新旧产品数
    isNewCount: salesProductData.filter(p => p.isNew).length,
    isOldCount: salesProductData.filter(p => !p.isNew).length,
    // 方案类型
    planJingzuo: salesProductData.filter(p => p.planType === '精做').length,
    planJingpu: salesProductData.filter(p => p.planType === '精铺').length,
    planPuhuo: salesProductData.filter(p => p.planType === '铺货').length
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

        {/* 统计卡片 - 产品分布 */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-3 mb-4">
          <div className="bg-gray-50 rounded-lg p-3 border">
            <div className="text-2xl font-bold text-gray-800">{stats.totalProducts}</div>
            <div className="text-xs text-gray-500">全部产品</div>
          </div>
          {/* 新旧分布 */}
          <div className="bg-green-50 rounded-lg p-3 border border-green-200">
            <div className="text-2xl font-bold text-green-600">{stats.isNewCount}</div>
            <div className="text-xs text-green-600">新品</div>
          </div>
          <div className="bg-gray-100 rounded-lg p-3 border border-gray-200">
            <div className="text-2xl font-bold text-gray-600">{stats.isOldCount}</div>
            <div className="text-xs text-gray-600">老品</div>
          </div>
          {/* 方案类型分布 */}
          <div className="bg-red-50 rounded-lg p-3 border border-red-200">
            <div className="text-2xl font-bold text-red-600">{stats.planJingzuo}</div>
            <div className="text-xs text-red-600">精做</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">{stats.planJingpu}</div>
            <div className="text-xs text-blue-600">精铺</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="text-2xl font-bold text-gray-600">{stats.planPuhuo}</div>
            <div className="text-xs text-gray-600">铺货</div>
          </div>
          {/* 销售小组分布 */}
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">{stats.teamYuju}</div>
            <div className="text-xs text-blue-600">渔具组</div>
          </div>
          <div className="bg-cyan-50 rounded-lg p-3 border border-cyan-200">
            <div className="text-2xl font-bold text-cyan-600">{stats.teamYuxian}</div>
            <div className="text-xs text-cyan-600">渔线组</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
            <div className="text-2xl font-bold text-orange-600">{stats.teamGongju}</div>
            <div className="text-xs text-orange-600">工具组</div>
          </div>
          <div className="bg-pink-50 rounded-lg p-3 border border-pink-200">
            <div className="text-2xl font-bold text-pink-600">{stats.teamFushi}</div>
            <div className="text-xs text-pink-600">服饰箱包组</div>
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
            value={filters.salesCategoryL1}
            onChange={(e) => setFilters({...filters, salesCategoryL1: e.target.value})}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">销售一级类目</option>
            <option value="渔具">渔具</option>
            <option value="服饰箱包">服饰箱包</option>
            <option value="工具">工具</option>
          </select>
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
            value={filters.site}
            onChange={(e) => setFilters({...filters, site: e.target.value})}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">站点</option>
            <option value="US">🇺🇸 美国</option>
            <option value="CA">🇨🇦 加拿大</option>
            <option value="MX">🇲🇽 墨西哥</option>
            <option value="UK">🇬🇧 英国</option>
            <option value="DE">🇩🇪 德国</option>
            <option value="FR">🇫🇷 法国</option>
            <option value="JP">🇯🇵 日本</option>
            <option value="AU">🇦🇺 澳洲</option>
          </select>
          <select
            value={filters.planType}
            onChange={(e) => setFilters({...filters, planType: e.target.value})}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">方案类型</option>
            <option value="精做">精做</option>
            <option value="精铺">精铺</option>
            <option value="铺货">铺货</option>
          </select>
          <select
            value={filters.isNew}
            onChange={(e) => setFilters({...filters, isNew: e.target.value})}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">新旧标签</option>
            <option value="true">新品</option>
            <option value="false">老品</option>
          </select>
          <button
            onClick={() => setFilters({ keyword: '', salesGrade: '', salesStatus: '', channel: '', salesTeam: '', amazonCategory: '', salesCategoryL1: '', site: '', planType: '', isNew: '' })}
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
                  <th className="px-3 py-3 text-left font-medium text-gray-600 whitespace-nowrap">产品图片</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 whitespace-nowrap">SKU / 产品名称</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 whitespace-nowrap">品牌</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 whitespace-nowrap">亚马逊类目</th>
                  <th className="px-3 py-3 text-center font-medium text-gray-600 whitespace-nowrap">销售一级类目</th>
                  <th className="px-3 py-3 text-center font-medium text-gray-600 whitespace-nowrap">销售二级类目</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 whitespace-nowrap">销售系列</th>
                  <th className="px-3 py-3 text-center font-medium text-gray-600 whitespace-nowrap">销售小组</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 whitespace-nowrap">销售负责人</th>
                  <th className="px-3 py-3 text-center font-medium text-gray-600 whitespace-nowrap">销售等级</th>
                  <th className="px-3 py-3 text-center font-medium text-gray-600 whitespace-nowrap">销售状态</th>
                  <th className="px-3 py-3 text-center font-medium text-gray-600 whitespace-nowrap">站点</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 whitespace-nowrap">ASIN</th>
                  <th className="px-3 py-3 text-center font-medium text-gray-600 whitespace-nowrap">新旧</th>
                  <th className="px-3 py-3 text-center font-medium text-gray-600 whitespace-nowrap">方案</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 whitespace-nowrap">销售渠道</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 whitespace-nowrap">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
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
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sm font-medium">{product.brand}</td>
                    <td className="px-3 py-3 text-xs text-gray-600 max-w-[180px] truncate">{product.amazonCategory}</td>
                    <td className="px-3 py-3 text-center">
                      <span className={`px-2 py-1 rounded text-xs ${getSalesCategoryL1Style(product.salesCategoryL1)}`}>
                        {product.salesCategoryL1}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center text-xs">{product.salesCategoryL2}</td>
                    <td className="px-3 py-3 text-xs text-gray-600">{product.series}</td>
                    <td className="px-3 py-3 text-center">
                      <span className={`px-2 py-1 rounded text-xs ${getSalesTeamStyle(product.salesTeam)}`}>
                        {product.salesTeam}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-xs whitespace-nowrap">{product.salesManager}</td>
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
                    {/* 站点 */}
                    <td className="px-3 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {product.sites.slice(0, 3).map((site, idx) => (
                          <span key={idx} className="text-base" title={site}>{getSiteFlag(site)}</span>
                        ))}
                        {product.sites.length > 3 && (
                          <span className="text-xs text-gray-400">+{product.sites.length - 3}</span>
                        )}
                      </div>
                    </td>
                    {/* ASIN */}
                    <td className="px-3 py-3">
                      <div className="flex flex-col gap-0.5">
                        {product.asins.slice(0, 2).map((item, idx) => (
                          <div key={idx} className="flex items-center gap-1 text-xs">
                            <span className="text-gray-400">{getSiteFlag(item.site)}</span>
                            <span className="font-mono text-gray-600 truncate max-w-[80px]">{item.asin}</span>
                          </div>
                        ))}
                        {product.asins.length > 2 && (
                          <span className="text-xs text-gray-400">+{product.asins.length - 2} 个</span>
                        )}
                      </div>
                    </td>
                    {/* 新旧标签 */}
                    <td className="px-3 py-3 text-center">
                      {product.isNew ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">新品</span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">老品</span>
                      )}
                    </td>
                    {/* 方案类型 */}
                    <td className="px-3 py-3 text-center">
                      <span className={`px-2 py-1 rounded text-xs border ${getPlanTypeStyle(product.planType)}`}>
                        {product.planType}
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
          <div className="relative bg-white w-[50vw] min-w-[600px] h-full shadow-2xl flex flex-col overflow-hidden">
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
                  <span className="text-xs text-gray-500">{selectedProduct.brand}</span>
                  {selectedProduct.isNew && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">新品</span>
                  )}
                  <span className={`px-2 py-0.5 rounded text-xs border ${getPlanTypeStyle(selectedProduct.planType)}`}>
                    {selectedProduct.planType}
                  </span>
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
              {/* 产品基本信息 */}
              <div className="bg-white border rounded-lg p-4 mb-6">
                <h3 className="font-semibold mb-4">产品基本信息</h3>
                <div className="flex gap-4 mb-4">
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.productName}
                    className="w-24 h-24 rounded-lg object-cover border"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 mb-1">{selectedProduct.productName}</div>
                    <div className="text-sm text-gray-500 mb-1">{selectedProduct.productNameEN}</div>
                    <div className="font-mono text-xs text-blue-600">{selectedProduct.sku}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500 mb-1">品牌</div>
                    <div className="font-semibold">{selectedProduct.brand}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">销售系列</div>
                    <div className="font-semibold">{selectedProduct.series}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">销售小组</div>
                    <span className={`px-2 py-0.5 rounded text-xs ${getSalesTeamStyle(selectedProduct.salesTeam)}`}>
                      {selectedProduct.salesTeam}
                    </span>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">销售负责人</div>
                    <div className="font-semibold">{selectedProduct.salesManager}</div>
                  </div>
                </div>
              </div>

              {/* 类目信息 */}
              <div className="bg-white border rounded-lg p-4 mb-6">
                <h3 className="font-semibold mb-4">类目信息</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500 mb-1">亚马逊类目</div>
                    <div className="font-semibold text-xs">{selectedProduct.amazonCategory}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">销售一级类目</div>
                    <span className={`px-2 py-0.5 rounded text-xs ${getSalesCategoryL1Style(selectedProduct.salesCategoryL1)}`}>
                      {selectedProduct.salesCategoryL1}
                    </span>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">销售二级类目</div>
                    <div className="font-semibold">{selectedProduct.salesCategoryL2}</div>
                  </div>
                </div>
              </div>

              {/* 销售属性 */}
              <div className="bg-white border rounded-lg p-4 mb-6">
                <h3 className="font-semibold mb-4">销售属性</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500 mb-1">销售等级</div>
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold border ${getSalesGradeStyle(selectedProduct.salesGrade)}`}>
                      {selectedProduct.salesGrade}
                    </span>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">销售状态</div>
                    <span className={`px-2 py-1 rounded text-xs ${getSalesStatusStyle(selectedProduct.salesStatus)}`}>
                      {selectedProduct.salesStatus}
                    </span>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">新旧标签</div>
                    {selectedProduct.isNew ? (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">新品</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">老品</span>
                    )}
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">方案类型</div>
                    <span className={`px-2 py-0.5 rounded text-xs border ${getPlanTypeStyle(selectedProduct.planType)}`}>
                      {selectedProduct.planType}
                    </span>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">上架日期</div>
                    <div className="font-semibold text-xs">{selectedProduct.launchDate}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">销售渠道数</div>
                    <div className="font-semibold">{selectedProduct.channels.length} 个</div>
                  </div>
                </div>
              </div>

              {/* ASIN列表 */}
              <div className="bg-white border rounded-lg p-4 mb-6">
                <h3 className="font-semibold mb-4">ASIN 站点映射</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {selectedProduct.asins.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <span className="text-2xl">{getSiteFlag(item.site)}</span>
                      <div>
                        <div className="text-xs text-gray-500">{item.site}</div>
                        <div className="font-mono text-sm font-medium text-gray-800">{item.asin}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 人员映射 */}
              <div className="bg-white border rounded-lg p-4 mb-6">
                <h3 className="font-semibold mb-4">人员映射</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-xs text-blue-600 mb-1">销售负责人</div>
                    <div className="font-semibold text-gray-800">{selectedProduct.salesManager}</div>
                    <div className="text-xs text-gray-500">{selectedProduct.salesTeam}</div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="text-xs text-purple-600 mb-1">产品经理</div>
                    <div className="font-semibold text-gray-800">-</div>
                    <div className="text-xs text-gray-500">待分配</div>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <div className="text-xs text-orange-600 mb-1">运营负责人</div>
                    <div className="font-semibold text-gray-800">-</div>
                    <div className="text-xs text-gray-500">待分配</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-xs text-green-600 mb-1">采购负责人</div>
                    <div className="font-semibold text-gray-800">-</div>
                    <div className="text-xs text-gray-500">待分配</div>
                  </div>
                </div>
              </div>

              {/* 销售渠道 */}
              <div className="bg-white border rounded-lg p-4 mb-6">
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

              {/* 销售等级说明 */}
              <div className="bg-gray-50 rounded-lg p-4">
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
            </div>

            {/* 抽屉底部操作 */}
            <div className="p-6 border-t bg-gray-50 flex gap-3 flex-wrap flex-shrink-0">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center gap-2">
                <Edit2 className="w-4 h-4" />
                编辑产品信息
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">
                调整销售等级
              </button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">
                调整类目归属
              </button>
              <button className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100">
                复制产品信息
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesProductPage;
