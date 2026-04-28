// src/pages/SalesForecastPage.js
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Search, ChevronRight, ChevronDown, Lock, Check,
  Package, Layers, BarChart3, AlertCircle,
  Calendar, Eye, EyeOff, TrendingUp, DollarSign, Boxes, Clock, Star, Tag, Info
} from 'lucide-react';
import { toast } from '../../components/ui/Toast';
import { mockStore } from '../../services/_mockStore';
import { SALES_FORECAST_PAGE_STATE } from '../../utils/storageKeys';

// ============================================
// Mock 数据生成 - 版本管理（2026年数据）
// ============================================

const DEPTS = [
  { id: 'US', name: '美国事业部' },
  { id: 'EU', name: '欧洲事业部' },
  { id: 'JP', name: '日本事业部' },
];

const PRODUCT_LINES = [
  {
    id: 'PL-001',
    name: '路亚竿系列',
    spus: [
      {
        id: 'SPU-001',
        name: '皇家传奇碳素路亚竿',
        skus: [
          { id: 'SKU-001-A', name: '1.8m ML调', isNew: false },
          { id: 'SKU-001-B', name: '2.1m M调', isNew: false },
          { id: 'SKU-001-C', name: '2.4m MH调', isNew: true },
        ]
      },
      {
        id: 'SPU-002',
        name: '速攻短节路亚竿',
        skus: [
          { id: 'SKU-002-A', name: '1.5m 5节', isNew: false },
          { id: 'SKU-002-B', name: '1.8m 6节', isNew: false },
        ]
      }
    ]
  },
  {
    id: 'PL-002',
    name: '渔轮系列',
    spus: [
      {
        id: 'SPU-003',
        name: '暴风纺车轮3000型',
        skus: [
          { id: 'SKU-003-A', name: '3000型 左手', isNew: false },
          { id: 'SKU-003-B', name: '3000型 右手', isNew: false },
        ]
      },
      {
        id: 'SPU-004',
        name: '鼓轮水滴轮',
        skus: [
          { id: 'SKU-004-A', name: '7.2:1 磁刹版', isNew: true },
        ]
      }
    ]
  },
  {
    id: 'PL-003',
    name: '钓线系列',
    spus: [
      {
        id: 'SPU-005',
        name: 'PE编织线500米',
        skus: [
          { id: 'SKU-005-A', name: '1.0号 黄色', isNew: false },
          { id: 'SKU-005-B', name: '1.5号 绿色', isNew: false },
          { id: 'SKU-005-C', name: '2.0号 灰色', isNew: false },
        ]
      }
    ]
  }
];

// 生成SKU预测数据
function generateSkuForecast(isNew) {
  const data = {};
  for (let i = 1; i <= 12; i++) {
    const baseValue = Math.floor(Math.random() * 500) + 100;
    data[i] = {
      forecast: baseValue,
      lastYear: isNew ? null : Math.floor(baseValue * (0.8 + Math.random() * 0.4)),
      lastForecast: Math.floor(baseValue * (0.9 + Math.random() * 0.2)),
      adjusted: false
    };
  }
  return data;
}

// 生成SKU占比
function generateRatios(skuCount) {
  if (skuCount === 1) return [100];
  const weights = Array.from({ length: skuCount }, () => Math.random());
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  let ratios = weights.map(w => (w / totalWeight) * 100);
  const sum = ratios.reduce((s, r) => s + r, 0);
  if (sum !== 100) ratios[0] += (100 - sum);
  return ratios.map(r => parseFloat(r.toFixed(2)));
}

// 生成参考数据
function generateReferenceData() {
  return {
    sales3d: Math.floor(Math.random() * 50) + 5,
    sales7d: Math.floor(Math.random() * 120) + 15,
    sales30d: Math.floor(Math.random() * 500) + 100,
    salesAmount30d: Math.floor(Math.random() * 50000) + 10000,
    inventory: Math.floor(Math.random() * 3000) + 200,
    inventoryDays: Math.floor(Math.random() * 60) + 10,
    grade: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
    status: ['主推款', '常规款', '长尾款', '新品', '淘汰款'][Math.floor(Math.random() * 5)]
  };
}

// 生成基础产品数据
function generateProductData() {
  return PRODUCT_LINES.map(pl => ({
    ...pl,
    spus: pl.spus.map(spu => {
      const ratios = generateRatios(spu.skus.length);
      return {
        ...spu,
        skus: spu.skus.map((sku, index) => ({
          ...sku,
          ratio: ratios[index],
          monthlyData: generateSkuForecast(sku.isNew),
          reference: generateReferenceData()
        }))
      };
    })
  }));
}

// 生成版本历史 Mock 数据（2026年）
function generateMockVersions() {
  const versions = {};
  
  DEPTS.forEach(dept => {
    // 2026-03月：草稿1 编辑中
    const keyMar = `${dept.id}_2026-03`;
    versions[keyMar] = {
      dept: dept.id,
      month: '2026-03',
      versions: [
        {
          id: `v-${dept.id}-202603-001`,
          dept: dept.id,
          month: '2026-03',
          type: 'draft',
          name: '草稿1',
          status: 'draft_editing',
          createdBy: '张三',
          createdAt: '2026-02-15 09:00',
          forecastData: generateProductData(),
          isLatest: true,
          isEditable: true
        }
      ]
    };

    // 2026-02月：草稿2 已推送计划，草稿1 历史
    const keyFeb = `${dept.id}_2026-02`;
    versions[keyFeb] = {
      dept: dept.id,
      month: '2026-02',
      versions: [
        {
          id: `v-${dept.id}-202602-002`,
          dept: dept.id,
          month: '2026-02',
          type: 'pending',
          name: '已推送计划',
          status: 'pending_plan',
          createdBy: '张三',
          createdAt: '2026-01-14 11:20',
          publishedAt: '2026-01-14 16:00',
          forecastData: generateProductData(),
          isLatest: true,
          isEditable: false
        },
        {
          id: `v-${dept.id}-202602-001`,
          dept: dept.id,
          month: '2026-02',
          type: 'draft',
          name: '草稿1',
          status: 'archived',
          createdBy: '张三',
          createdAt: '2026-01-13 09:15',
          forecastData: generateProductData(),
          isLatest: false,
          isEditable: false
        }
      ]
    };

    // 2026-01月：最终版（草稿2、草稿1是历史，但草稿2已变成最终版，所以显示最终版+历史草稿）
    const keyJan = `${dept.id}_2026-01`;
    versions[keyJan] = {
      dept: dept.id,
      month: '2026-01',
      versions: [
        {
          id: `v-${dept.id}-202601-final`,
          dept: dept.id,
          month: '2026-01',
          type: 'final',
          name: '最终版',
          status: 'final',
          createdBy: '张三',
          createdAt: '2025-12-15 10:00',
          publishedBy: '李四',
          publishedAt: '2025-12-16 14:00',
          forecastData: generateProductData(),
          isLatest: true,
          isEditable: false
        },
        {
          id: `v-${dept.id}-202601-001`,
          dept: dept.id,
          month: '2026-01',
          type: 'draft',
          name: '草稿1',
          status: 'archived',
          createdBy: '张三',
          createdAt: '2025-12-14 09:00',
          forecastData: generateProductData(),
          isLatest: false,
          isEditable: false
        }
      ]
    };
  });
  
  return versions;
}

// ============================================
// 主组件
// ============================================

const SalesForecastPage = ({ data, openTab }) => {
  // 当前日期（模拟为2026年1月）
  const currentYear = 2026;
  const currentMonth = 1;

  // 生成预测月份列表（从次月开始的12个月）
  const forecastMonths = useMemo(() => {
    const months = [];
    for (let i = 1; i <= 12; i++) {
      const month = ((currentMonth + i - 1) % 12) + 1;
      const year = currentYear + Math.floor((currentMonth + i - 1) / 12);
      months.push({
        index: i,
        month,
        year,
        label: `${year}年${month}月`,
        shortLabel: `${month}月`,
        isFrozen: i <= 2,
        isCurrentYear: year === currentYear
      });
    }
    return months;
  }, [currentMonth, currentYear]);

  // 版本管理 State
  // 原型级持久化：优先从 localStorage 读取上一次推送/编辑后的快照；
  // 没有则用 mock 初始数据（首帧后由下方 useEffect 自动写回 storage 固化）。
  const [allVersions, setAllVersions] = useState(() => mockStore.get(SALES_FORECAST_PAGE_STATE) ?? generateMockVersions());

  // allVersions 变动时同步到 localStorage，保证刷新后状态保留。
  // 含初始挂载时的一次写入：把首帧 mock 数据固化下来，避免 generateMockVersions 中的随机数据每次刷新都变动。
  useEffect(() => {
    mockStore.set(SALES_FORECAST_PAGE_STATE, allVersions);
  }, [allVersions]);
  
  // 从 props.data 获取初始值（新开标签时传入）
  const initialDept = data?.dept || 'US';
  const initialMonth = data?.month || '2026-02';
  const initialVersionId = data?.versionId || null;
  
  const [currentDept, setCurrentDept] = useState(initialDept);
  const [currentMonthPeriod, setCurrentMonthPeriod] = useState(initialMonth);
  const [currentVersionId, setCurrentVersionId] = useState(initialVersionId);
  
  // 计算当前版本
  const currentVersionData = useMemo(() => {
    const key = `${currentDept}_${currentMonthPeriod}`;
    const monthData = allVersions[key];
    if (!monthData) return null;
    
    // 如果有指定的版本ID，使用它
    if (currentVersionId) {
      return monthData.versions.find(v => v.id === currentVersionId) || monthData.versions[0];
    }
    
    // 默认返回最新的版本
    return monthData.versions[0];
  }, [allVersions, currentDept, currentMonthPeriod, currentVersionId]);
  
  // 当前预测数据
  const [forecastData, setForecastData] = useState(() => generateProductData());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // 当切换版本时，加载对应数据
  useEffect(() => {
    if (currentVersionData) {
      setForecastData(JSON.parse(JSON.stringify(currentVersionData.forecastData)));
      setHasUnsavedChanges(false);
    }
  }, [currentVersionData?.id]);

  // UI State
  const [viewMode, setViewMode] = useState('sku');
  const [expandedProductLines, setExpandedProductLines] = useState(['PL-001', 'PL-002', 'PL-003']);
  const [expandedSpus, setExpandedSpus] = useState(['SPU-001', 'SPU-002', 'SPU-003', 'SPU-004', 'SPU-005']);
  const [filters, setFilters] = useState({ keyword: '', productLine: '', status: '' });
  const [showLastYear, setShowLastYear] = useState(true);
  const [showLastForecast, setShowLastForecast] = useState(true);
  
  // 编辑 State
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [editingRatio, setEditingRatio] = useState(null);
  const [editRatioValue, setEditRatioValue] = useState('');
  
  // 弹窗 State
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
  const [pendingVersion, setPendingVersion] = useState(null);
  
  // Tooltip State
  const [hoveredSku, setHoveredSku] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // 是否可编辑（最新版本 + 状态为 draft_editing 或 plan_rejected）
  const isEditable = useMemo(() => {
    if (!currentVersionData) return false;
    const key = `${currentDept}_${currentMonthPeriod}`;
    const monthData = allVersions[key];
    if (!monthData) return false;
    
    // 检查是否是最新版本
    const isLatest = monthData.versions[0]?.id === currentVersionData.id;
    
    // 检查状态是否可编辑
    const editableStatus = ['draft_editing', 'plan_rejected'].includes(currentVersionData.status);
    
    return isLatest && editableStatus;
  }, [currentVersionData, allVersions, currentDept, currentMonthPeriod]);

  // ============================================
  // 计算函数
  // ============================================

  const calculateSpuTotal = useCallback((spu, monthIndex) => {
    return spu.skus.reduce((sum, sku) => sum + (sku.monthlyData[monthIndex]?.forecast || 0), 0);
  }, []);

  const calculateProductLineTotal = useCallback((pl, monthIndex) => {
    return pl.spus.reduce((sum, spu) => sum + calculateSpuTotal(spu, monthIndex), 0);
  }, [calculateSpuTotal]);

  const calculateGrandTotal = useCallback((monthIndex) => {
    return forecastData.reduce((sum, pl) => sum + calculateProductLineTotal(pl, monthIndex), 0);
  }, [forecastData, calculateProductLineTotal]);

  // ============================================
  // 版本管理函数
  // ============================================

  // 保存草稿（覆盖当前版本）
  const saveDraft = () => {
    if (!currentVersionData) {
      toast.warning('当前没有可保存的版本');
      return;
    }
    const key = `${currentDept}_${currentMonthPeriod}`;

    let didSave = false;
    setAllVersions(prev => {
      const monthData = prev[key];
      if (!monthData) return prev;

      didSave = true;
      return {
        ...prev,
        [key]: {
          ...monthData,
          versions: monthData.versions.map(v =>
            v.id === currentVersionData.id
              ? { ...v, forecastData: JSON.parse(JSON.stringify(forecastData)) }
              : v
          )
        }
      };
    });

    if (!didSave) {
      toast.error('保存失败：未找到对应月份的版本数据');
      return;
    }
    setHasUnsavedChanges(false);
    toast.success('保存成功');
  };

  // 确认发布（草稿 → 已推送计划）
  const publishToPlan = () => {
    if (!currentVersionData) {
      toast.warning('当前没有可推送的版本');
      return;
    }

    const key = `${currentDept}_${currentMonthPeriod}`;

    let didPublish = false;
    setAllVersions(prev => {
      const monthData = prev[key];
      if (!monthData) return prev;

      didPublish = true;
      return {
        ...prev,
        [key]: {
          ...monthData,
          versions: monthData.versions.map(v =>
            v.id === currentVersionData.id
              ? {
                  ...v,
                  type: 'pending',
                  name: '已推送计划',
                  status: 'pending_plan',
                  publishedAt: new Date().toLocaleString('zh-CN', { hour12: false }),
                  isEditable: false
                }
              : v
          )
        }
      };
    });

    setShowPublishModal(false);
    if (!didPublish) {
      toast.error('推送失败：未找到对应月份的版本数据');
      return;
    }
    toast.success('已推送至计划确认');
  };

  // 切换版本（新开标签页）
  const switchVersion = (version) => {
    if (hasUnsavedChanges) {
      setPendingVersion(version);
      setShowUnsavedWarning(true);
      return;
    }
    
    openNewVersionTab(version);
  };
  
  const openNewVersionTab = (version) => {
    const tabName = `销量预测-${version.month}-${version.name}`;
    const tabId = `sales-forecast-${version.dept}-${version.month}-${version.id}`;
    
    if (openTab) {
      openTab({
        id: tabId,
        name: tabName,
        path: '/sales/forecast',
        data: {
          dept: version.dept,
          month: version.month,
          versionId: version.id
        }
      });
    }
  };

  // ============================================
  // 表格编辑函数
  // ============================================

  const toggleProductLine = (plId) => {
    setExpandedProductLines(prev =>
      prev.includes(plId) ? prev.filter(id => id !== plId) : [...prev, plId]
    );
  };

  const toggleSpu = (spuId) => {
    setExpandedSpus(prev =>
      prev.includes(spuId) ? prev.filter(id => id !== spuId) : [...prev, spuId]
    );
  };

  const startEdit = (skuId, monthIndex, currentValue) => {
    if (!isEditable) return;
    if (forecastMonths[monthIndex - 1].isFrozen) return;
    setEditingCell({ skuId, monthIndex });
    setEditValue(currentValue.toString());
  };

  const saveEdit = () => {
    if (!editingCell) return;
    const newValue = parseInt(editValue) || 0;

    setForecastData(prev => prev.map(pl => ({
      ...pl,
      spus: pl.spus.map(spu => ({
        ...spu,
        skus: spu.skus.map(sku => {
          if (sku.id === editingCell.skuId) {
            return {
              ...sku,
              monthlyData: {
                ...sku.monthlyData,
                [editingCell.monthIndex]: {
                  ...sku.monthlyData[editingCell.monthIndex],
                  forecast: newValue,
                  adjusted: true
                }
              }
            };
          }
          return sku;
        })
      }))
    })));

    setHasUnsavedChanges(true);
    setEditingCell(null);
    setEditValue('');
  };

  const startEditRatio = (skuId, currentRatio) => {
    if (!isEditable) return;
    setEditingRatio(skuId);
    setEditRatioValue(currentRatio.toString());
  };

  const saveRatioEdit = (spuId) => {
    if (!editingRatio) return;
    const newRatio = parseFloat(editRatioValue) || 0;
    const clampedRatio = Math.max(0, Math.min(100, newRatio));

    setForecastData(prev => prev.map(pl => ({
      ...pl,
      spus: pl.spus.map(spu => {
        if (spu.id !== spuId) return spu;

        const skuCount = spu.skus.length;
        if (skuCount === 1) {
          return {
            ...spu,
            skus: spu.skus.map(sku => 
              sku.id === editingRatio ? { ...sku, ratio: 100 } : sku
            )
          };
        }

        const editingSkuIndex = spu.skus.findIndex(s => s.id === editingRatio);
        if (editingSkuIndex === -1) return spu;

        const otherSkus = spu.skus.filter((_, idx) => idx !== editingSkuIndex);
        const otherTotalRatio = otherSkus.reduce((sum, sku) => sum + sku.ratio, 0);

        if (clampedRatio >= 100) {
          return {
            ...spu,
            skus: spu.skus.map((sku, idx) => 
              idx === editingSkuIndex ? { ...sku, ratio: 100 } : { ...sku, ratio: 0 }
            )
          };
        }

        const remainingRatio = 100 - clampedRatio;
        const newRatios = spu.skus.map((sku, idx) => {
          if (idx === editingSkuIndex) return clampedRatio;
          if (otherTotalRatio === 0) {
            return parseFloat((remainingRatio / (skuCount - 1)).toFixed(2));
          }
          return parseFloat((remainingRatio * (sku.ratio / otherTotalRatio)).toFixed(2));
        });

        const currentSum = newRatios.reduce((s, r) => s + r, 0);
        if (currentSum !== 100) {
          const diff = 100 - currentSum;
          for (let i = 0; i < newRatios.length; i++) {
            if (i !== editingSkuIndex) {
              newRatios[i] = parseFloat((newRatios[i] + diff).toFixed(2));
              break;
            }
          }
        }

        return {
          ...spu,
          skus: spu.skus.map((sku, idx) => ({ ...sku, ratio: newRatios[idx] }))
        };
      })
    })));

    setHasUnsavedChanges(true);
    setEditingRatio(null);
    setEditRatioValue('');
  };

  // Tooltip 隐藏
  useEffect(() => {
    const handleScroll = () => setHoveredSku(null);
    const handleResize = () => setHoveredSku(null);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const getTrendIcon = (current, previous) => {
    if (!previous) return null;
    const diff = current - previous;
    const percent = ((diff / previous) * 100).toFixed(0);
    if (diff > 0) return <span className="text-green-500 text-xs">+{percent}%</span>;
    if (diff < 0) return <span className="text-red-500 text-xs">{percent}%</span>;
    return <span className="text-gray-400 text-xs">-</span>;
  };

  // 筛选数据
  const filteredData = useMemo(() => {
    if (!filters.keyword && !filters.productLine) return forecastData;

    return forecastData
      .filter(pl => !filters.productLine || pl.id === filters.productLine)
      .map(pl => ({
        ...pl,
        spus: pl.spus.map(spu => ({
          ...spu,
          skus: spu.skus.filter(sku =>
            !filters.keyword ||
            sku.id.toLowerCase().includes(filters.keyword.toLowerCase()) ||
            sku.name.toLowerCase().includes(filters.keyword.toLowerCase())
          )
        })).filter(spu => spu.skus.length > 0)
      }))
      .filter(pl => pl.spus.length > 0);
  }, [forecastData, filters]);

  const stats = useMemo(() => {
    const totalSkus = forecastData.flatMap(pl => pl.spus.flatMap(spu => spu.skus)).length;
    const totalForecast = forecastMonths.reduce((sum, m) => sum + calculateGrandTotal(m.index), 0);
    return { totalSkus, totalForecast };
  }, [forecastData, forecastMonths, calculateGrandTotal]);

  const productLineOptions = forecastData.map(pl => ({ id: pl.id, name: pl.name }));

  // 获取所有月份列表
  const monthOptions = ['2026-01', '2026-02', '2026-03'];

  // 按月份分组的所有版本（用于侧边栏）
  const versionsByMonth = useMemo(() => {
    const result = {};
    Object.values(allVersions)
      .filter(v => v.dept === currentDept)
      .forEach(v => {
        result[v.month] = v.versions;
      });
    return result;
  }, [allVersions, currentDept]);

  // 状态标签样式
  const getStatusStyle = (version) => {
    switch (version.status) {
      case 'draft_editing':
      case 'plan_rejected':
        return 'bg-blue-100 text-blue-700';
      case 'pending_plan':
        return 'bg-yellow-100 text-yellow-700';
      case 'final':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  // ============================================
  // Render
  // ============================================

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* 顶部工具栏 */}
      <div className="bg-white border-b px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4 flex-wrap">
            <h2 className="text-lg font-semibold text-gray-800 whitespace-nowrap">销量预测</h2>
            
            {/* 事业部选择 */}
            <select
              value={currentDept}
              onChange={(e) => {
                setCurrentDept(e.target.value);
                setCurrentVersionId(null);
              }}
              className="px-3 py-1.5 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {DEPTS.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>

            {/* 月份选择 */}
            <select
              value={currentMonthPeriod}
              onChange={(e) => {
                setCurrentMonthPeriod(e.target.value);
                setCurrentVersionId(null);
              }}
              className="px-3 py-1.5 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {monthOptions.map(m => (
                <option key={m} value={m}>{m.replace('-', '年')}月</option>
              ))}
            </select>

            {/* 版本信息 */}
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusStyle(currentVersionData)}`}>
                {currentVersionData?.name || '加载中...'}
              </span>
              {currentVersionData?.status === 'final' && (
                <Lock className="w-4 h-4 text-green-600" />
              )}
              {hasUnsavedChanges && (
                <span className="text-xs text-orange-600">● 未保存</span>
              )}
            </div>

            {/* 预测周期 */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>预测周期：{forecastMonths[0].label} - {forecastMonths[11].label}</span>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center gap-2">
            {isEditable ? (
              <>
                <button
                  onClick={saveDraft}
                  disabled={!hasUnsavedChanges}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm ${
                    hasUnsavedChanges 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  保存草稿
                </button>
                <button
                  onClick={() => setShowPublishModal(true)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
                >
                  确认发布
                </button>
              </>
            ) : (
              <span className="text-sm text-gray-500">
                {currentVersionData?.status === 'final' 
                  ? '已定版，不可编辑' 
                  : currentVersionData?.status === 'pending_plan'
                    ? '已推送计划，等待确认'
                    : '历史版本，只读'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 筛选和视图控制 */}
      <div className="bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="SKU编码/名称"
                value={filters.keyword}
                onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                className="pl-9 pr-3 py-1.5 border rounded text-sm w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filters.productLine}
              onChange={(e) => setFilters({ ...filters, productLine: e.target.value })}
              className="px-3 py-1.5 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">全部产品系列</option>
              {productLineOptions.map(pl => (
                <option key={pl.id} value={pl.id}>{pl.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4">
            {/* 视图切换 */}
            <div className="flex items-center gap-1 bg-gray-100 rounded p-0.5">
              <button
                onClick={() => setViewMode('sku')}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                  viewMode === 'sku' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                SKU
              </button>
              <button
                onClick={() => setViewMode('spu')}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                  viewMode === 'spu' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                SPU汇总
              </button>
              <button
                onClick={() => setViewMode('productLine')}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                  viewMode === 'productLine' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                系列汇总
              </button>
            </div>

            {/* 显示选项 */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowLastYear(!showLastYear)}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs border ${
                  showLastYear ? 'bg-blue-50 border-blue-200 text-blue-600' : 'border-gray-200 text-gray-500'
                }`}
              >
                {showLastYear ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                去年同期
              </button>
              <button
                onClick={() => setShowLastForecast(!showLastForecast)}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs border ${
                  showLastForecast ? 'bg-purple-50 border-purple-200 text-purple-600' : 'border-gray-200 text-gray-500'
                }`}
              >
                {showLastForecast ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                上期预测
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 主体区域：侧边栏 + 表格 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 左侧版本历史侧边栏 */}
        <div className="w-64 bg-white border-r flex-shrink-0 overflow-y-auto">
          <div className="p-3 border-b bg-gray-50">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <span>版本历史</span>
            </div>
          </div>
          
          {Object.entries(versionsByMonth).sort().reverse().map(([month, versions]) => {
            const isCurrentMonth = month === currentMonthPeriod;
            return (
              <div key={month} className="border-b">
                <div className={`px-3 py-2 text-sm font-medium ${
                  isCurrentMonth ? 'bg-blue-50 text-blue-700' : 'text-gray-600'
                }`}>
                  {month.replace('-', '年')}月
                  {isCurrentMonth && <span className="ml-2 text-xs">(当前)</span>}
                </div>
                <div className="px-2 pb-2">
                  {versions.map((version) => (
                    <div
                      key={version.id}
                      onClick={() => switchVersion(version)}
                      className={`group flex items-center justify-between px-2 py-2 rounded text-sm cursor-pointer hover:bg-gray-100 ${
                        version.id === currentVersionData?.id && isCurrentMonth ? 'bg-blue-50 border border-blue-200' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {version.status === 'final' ? (
                          <Check className="w-3.5 h-3.5 text-green-600" />
                        ) : version.status === 'pending_plan' ? (
                          <AlertCircle className="w-3.5 h-3.5 text-yellow-600" />
                        ) : version.isLatest ? (
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-gray-300" />
                        )}
                        <span className={`${
                          version.status === 'final' ? 'text-green-700 font-medium' : 
                          version.status === 'pending_plan' ? 'text-yellow-700' :
                          'text-gray-700'
                        }`}>
                          {version.name}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {version.createdAt.split(' ')[0].slice(5)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* 主表格区域 */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm border-collapse min-w-[1500px]">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-1 py-2 text-center font-medium text-gray-600 border-b border-r bg-gray-100 sticky left-0 z-20 w-[50px] text-xs">
                  占比
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-600 border-b border-r bg-gray-100 sticky left-[50px] z-20 min-w-[280px]">
                  产品 / SKU
                </th>
                {forecastMonths.map((m) => (
                  <th
                    key={m.index}
                    className={`px-2 py-2 text-center font-medium border-b min-w-[90px] ${
                      m.isFrozen ? 'bg-orange-50 text-orange-700' : 'text-gray-600'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <span className={m.isCurrentYear ? '' : 'text-blue-600'}>{m.shortLabel}</span>
                      {!m.isCurrentYear && <span className="text-xs text-gray-400">{m.year}</span>}
                      {m.isFrozen && <Lock className="w-3 h-3 mt-0.5" />}
                    </div>
                  </th>
                ))}
                <th className="px-3 py-2 text-center font-medium text-gray-600 border-b min-w-[80px]">
                  合计
                </th>
                <th className="px-3 py-2 text-center font-medium text-gray-600 border-b min-w-[70px]">
                  操作
                </th>
              </tr>
            </thead>
            <tbody>
              {/* 总计行 */}
              <tr className="bg-blue-50 font-medium">
                <td className="px-1 py-2 border-b border-r bg-blue-50 sticky left-0 w-[50px]">
                  <span className="text-blue-700">-</span>
                </td>
                <td className="px-3 py-2 border-b border-r bg-blue-50 sticky left-[50px]">
                  <span className="text-blue-700">总计</span>
                </td>
                {forecastMonths.map((m) => (
                  <td key={m.index} className={`px-2 py-2 text-center border-b ${m.isFrozen ? 'bg-orange-50' : ''}`}>
                    <span className="font-semibold text-blue-700">{calculateGrandTotal(m.index).toLocaleString()}</span>
                  </td>
                ))}
                <td className="px-3 py-2 text-center border-b font-semibold text-blue-700">
                  {stats.totalForecast.toLocaleString()}
                </td>
                <td className="px-3 py-2 text-center border-b">-</td>
              </tr>

              {filteredData.map((pl) => (
                <React.Fragment key={pl.id}>
                  {/* 产品系列行 */}
                  <tr className="bg-gray-50 hover:bg-gray-100">
                    <td className="px-1 py-2 border-b border-r bg-gray-50 sticky left-0 text-center">
                      <span className="text-gray-400">-</span>
                    </td>
                    <td className="px-3 py-2 border-b border-r bg-gray-50 sticky left-[50px]">
                      <button
                        onClick={() => toggleProductLine(pl.id)}
                        className="flex items-center gap-2 text-gray-800 font-medium"
                      >
                        {expandedProductLines.includes(pl.id) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                        <Layers className="w-4 h-4 text-purple-500" />
                        {pl.name}
                      </button>
                    </td>
                    {forecastMonths.map((m) => (
                      <td key={m.index} className={`px-2 py-2 text-center border-b ${m.isFrozen ? 'bg-orange-50' : ''}`}>
                        <span className="font-medium text-gray-700">{calculateProductLineTotal(pl, m.index).toLocaleString()}</span>
                      </td>
                    ))}
                    <td className="px-3 py-2 text-center border-b font-medium">
                      {forecastMonths.reduce((sum, m) => sum + calculateProductLineTotal(pl, m.index), 0).toLocaleString()}
                    </td>
                    <td className="px-3 py-2 text-center border-b">-</td>
                  </tr>

                  {/* SPU 和 SKU 行 */}
                  {expandedProductLines.includes(pl.id) && viewMode !== 'productLine' && pl.spus.map((spu) => (
                    <React.Fragment key={spu.id}>
                      {/* SPU行 */}
                      <tr className="bg-white hover:bg-gray-50">
                        <td className="px-1 py-2 border-b border-r bg-white sticky left-0 text-center">
                          <span className="text-gray-400">-</span>
                        </td>
                        <td className="px-3 py-2 border-b border-r bg-white sticky left-[50px]">
                          <button
                            onClick={() => toggleSpu(spu.id)}
                            className="flex items-center gap-2 pl-6 text-gray-700"
                          >
                            {viewMode === 'sku' && (
                              expandedSpus.includes(spu.id) ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )
                            )}
                            <Package className="w-4 h-4 text-blue-500" />
                            <span className="font-medium">{spu.name}</span>
                            <span className="text-xs text-gray-400">({spu.skus.length} SKU)</span>
                          </button>
                        </td>
                        {forecastMonths.map((m) => (
                          <td key={m.index} className={`px-2 py-2 text-center border-b ${m.isFrozen ? 'bg-orange-50' : ''}`}>
                            <span className="text-gray-600">{calculateSpuTotal(spu, m.index).toLocaleString()}</span>
                          </td>
                        ))}
                        <td className="px-3 py-2 text-center border-b text-gray-600">
                          {forecastMonths.reduce((sum, m) => sum + calculateSpuTotal(spu, m.index), 0).toLocaleString()}
                        </td>
                        <td className="px-3 py-2 text-center border-b">-</td>
                      </tr>

                      {/* SKU行 */}
                      {viewMode === 'sku' && expandedSpus.includes(spu.id) && spu.skus.map((sku) => {
                        const skuTotal = forecastMonths.reduce((sum, m) => sum + (sku.monthlyData[m.index]?.forecast || 0), 0);
                        const isEditingRatio = editingRatio === sku.id;

                        return (
                          <tr 
                            key={sku.id} 
                            className={`hover:bg-blue-50 ${!isEditable ? 'bg-gray-50' : 'bg-white'}`}
                          >
                            {/* 占比列 */}
                            <td className={`px-1 py-1.5 border-b border-r text-center sticky left-0 ${!isEditable ? 'bg-gray-50' : 'bg-white'}`}>
                              {isEditingRatio ? (
                                <input
                                  type="number"
                                  value={editRatioValue}
                                  onChange={(e) => setEditRatioValue(e.target.value)}
                                  onBlur={() => saveRatioEdit(spu.id)}
                                  onKeyDown={(e) => e.key === 'Enter' && saveRatioEdit(spu.id)}
                                  autoFocus
                                  min="0"
                                  max="100"
                                  step="0.01"
                                  className="w-12 px-0.5 py-0 text-center border border-blue-400 rounded text-xs focus:outline-none"
                                />
                              ) : (
                                <button
                                  onClick={() => isEditable && startEditRatio(sku.id, sku.ratio)}
                                  disabled={!isEditable}
                                  className={`text-xs ${!isEditable ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'} px-1 py-0.5 rounded`}
                                >
                                  {sku.ratio.toFixed(2)}%
                                </button>
                              )}
                            </td>
                            <td className={`px-3 py-2 border-b border-r sticky left-[50px] ${!isEditable ? 'bg-gray-50' : 'bg-white'}`}>
                              <div className="flex items-center gap-2 pl-12">
                                <span className="font-mono text-xs text-blue-600">{sku.id}</span>
                                <span className="text-gray-600">{sku.name}</span>
                                {sku.isNew && (
                                  <span className="px-1.5 py-0.5 bg-orange-100 text-orange-600 rounded text-xs">新品</span>
                                )}
                                {!isEditable && (
                                  <span className="px-1.5 py-0.5 bg-green-100 text-green-600 rounded text-xs flex items-center gap-0.5">
                                    <Check className="w-3 h-3" />
                                    已确认
                                  </span>
                                )}
                                <button
                                  className="ml-1 p-0.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"
                                  onMouseEnter={(e) => {
                                    setHoveredSku(sku);
                                    setTooltipPos({ x: e.clientX + 15, y: e.clientY - 10 });
                                  }}
                                  onMouseMove={(e) => setTooltipPos({ x: e.clientX + 15, y: e.clientY - 10 })}
                                  onMouseLeave={() => setHoveredSku(null)}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Info className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                            {forecastMonths.map((m) => {
                              const data = sku.monthlyData[m.index];
                              const isEditing = editingCell?.skuId === sku.id && editingCell?.monthIndex === m.index;

                              return (
                                <td
                                  key={m.index}
                                  className={`px-1 py-1 text-center border-b ${
                                    m.isFrozen ? 'bg-orange-50' : isEditable ? 'cursor-pointer hover:bg-blue-100' : ''
                                  } ${data?.adjusted ? 'bg-yellow-50' : ''}`}
                                  onClick={() => isEditable && !m.isFrozen && startEdit(sku.id, m.index, data?.forecast || 0)}
                                >
                                  {isEditing ? (
                                    <input
                                      type="number"
                                      value={editValue}
                                      onChange={(e) => setEditValue(e.target.value)}
                                      onBlur={saveEdit}
                                      onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                                      autoFocus
                                      className="w-full px-1 py-0.5 text-center border border-blue-400 rounded text-sm focus:outline-none"
                                    />
                                  ) : (
                                    <div className="flex flex-col items-center">
                                      <span className={`font-medium ${data?.adjusted ? 'text-yellow-700' : 'text-gray-800'}`}>
                                        {(data?.forecast || 0).toLocaleString()}
                                      </span>
                                      {showLastYear && (
                                        <span className="text-xs text-gray-400">
                                          {data?.lastYear !== null ? data.lastYear.toLocaleString() : '-'}
                                          {data?.lastYear !== null && getTrendIcon(data.forecast, data.lastYear)}
                                        </span>
                                      )}
                                      {showLastForecast && (
                                        <span className="text-xs text-purple-400">
                                          {data?.lastForecast?.toLocaleString()}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </td>
                              );
                            })}
                            <td className="px-3 py-2 text-center border-b font-medium">
                              {skuTotal.toLocaleString()}
                            </td>
                            <td className="px-3 py-2 text-center border-b">-</td>
                          </tr>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 底部说明 */}
      <div className="bg-white border-t px-4 py-2 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-orange-100 border border-orange-200 rounded"></div>
            冻结期（不可调整）
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-50 border border-yellow-200 rounded"></div>
            已调整
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-50 border border-green-200 rounded"></div>
            已确认
          </span>
        </div>
        <div>
          {isEditable ? '点击单元格编辑预测值 | 鼠标悬停查看参考数据' : '当前版本只读，不可编辑'}
        </div>
      </div>

      {/* 发布确认弹窗 */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-96">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
              <h3 className="text-lg font-semibold">确认推送至计划</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              推送后该版本将变为只读，等待计划部门确认。确定要推送吗？
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowPublishModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded text-sm"
              >
                取消
              </button>
              <button
                onClick={publishToPlan}
                className="px-4 py-2 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
              >
                确认推送
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 未保存提示弹窗 */}
      {showUnsavedWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-96">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-6 h-6 text-orange-600" />
              <h3 className="text-lg font-semibold">未保存的更改</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              当前版本有未保存的更改，切换版本前请先保存。或者放弃更改继续切换？
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowUnsavedWarning(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded text-sm"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setShowUnsavedWarning(false);
                  setHasUnsavedChanges(false);
                  openNewVersionTab(pendingVersion);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600"
              >
                放弃更改
              </button>
              <button
                onClick={() => {
                  saveDraft();
                  setShowUnsavedWarning(false);
                  openNewVersionTab(pendingVersion);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                保存并切换
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 悬停提示 */}
      {hoveredSku && hoveredSku.reference && (
        <div 
          className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-xl p-4 min-w-[280px] pointer-events-none"
          style={{ left: tooltipPos.x, top: tooltipPos.y }}
        >
          <div className="flex items-center justify-between mb-3 pb-2 border-b">
            <span className="font-mono text-sm text-blue-600">{hoveredSku.id}</span>
            <span className="text-gray-600 text-sm">{hoveredSku.name}</span>
          </div>
          
          <div className="mb-3">
            <div className="text-xs text-gray-500 mb-2 font-medium">近期销量</div>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-blue-50 rounded p-2 text-center">
                <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                  <TrendingUp className="w-3 h-3" />
                  <span className="text-xs">3天</span>
                </div>
                <div className="text-sm font-semibold text-blue-700">{hoveredSku.reference.sales3d}</div>
              </div>
              <div className="bg-blue-50 rounded p-2 text-center">
                <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                  <TrendingUp className="w-3 h-3" />
                  <span className="text-xs">7天</span>
                </div>
                <div className="text-sm font-semibold text-blue-700">{hoveredSku.reference.sales7d}</div>
              </div>
              <div className="bg-blue-50 rounded p-2 text-center">
                <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                  <TrendingUp className="w-3 h-3" />
                  <span className="text-xs">30天</span>
                </div>
                <div className="text-sm font-semibold text-blue-700">{hoveredSku.reference.sales30d}</div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-3 p-2 bg-green-50 rounded">
            <div className="flex items-center gap-1 text-green-600">
              <DollarSign className="w-3.5 h-3.5" />
              <span className="text-xs">30天销售额</span>
            </div>
            <span className="text-sm font-semibold text-green-700">${hoveredSku.reference.salesAmount30d.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between mb-3 p-2 bg-orange-50 rounded">
            <div className="flex items-center gap-1 text-orange-600">
              <Boxes className="w-3.5 h-3.5" />
              <span className="text-xs">当前库存</span>
            </div>
            <span className="text-sm font-semibold text-orange-700">{hoveredSku.reference.inventory.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between mb-3 p-2 bg-purple-50 rounded">
            <div className="flex items-center gap-1 text-purple-600">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-xs">可售天数</span>
            </div>
            <span className={`text-sm font-semibold ${hoveredSku.reference.inventoryDays < 20 ? 'text-red-600' : 'text-purple-700'}`}>
              {hoveredSku.reference.inventoryDays}天
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-yellow-500" />
              <span className="text-xs text-gray-500">销售评级</span>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                hoveredSku.reference.grade === 'A' ? 'bg-green-100 text-green-700' :
                hoveredSku.reference.grade === 'B' ? 'bg-blue-100 text-blue-700' :
                hoveredSku.reference.grade === 'C' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {hoveredSku.reference.grade}级
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-gray-400" />
              <span className={`px-2 py-0.5 rounded text-xs ${
                hoveredSku.reference.status === '主推款' ? 'bg-purple-100 text-purple-700' :
                hoveredSku.reference.status === '新品' ? 'bg-green-100 text-green-700' :
                hoveredSku.reference.status === '淘汰款' ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {hoveredSku.reference.status}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesForecastPage;
