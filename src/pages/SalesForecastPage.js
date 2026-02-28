// src/pages/SalesForecastPage.js
import React, { useState, useMemo, useCallback } from 'react';
import {
  Search, ChevronRight, ChevronDown, Lock, Check,
  Package, Layers, BarChart3,
  Calendar, Eye, EyeOff
} from 'lucide-react';

const SalesForecastPage = () => {
  // 当前日期（模拟为2024年1月）
  const currentYear = 2024;
  const currentMonth = 1; // 1月

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
        isFrozen: i <= 2, // 前2个月为冻结期
        isCurrentYear: year === currentYear
      });
    }
    return months;
  }, [currentMonth, currentYear]);

  // 视图模式：sku / spu / productLine
  const [viewMode, setViewMode] = useState('sku');
  // 展开状态
  const [expandedProductLines, setExpandedProductLines] = useState(['PL-001', 'PL-002']);
  const [expandedSpus, setExpandedSpus] = useState(['SPU-001', 'SPU-003']);
  // 筛选
  const [filters, setFilters] = useState({ keyword: '', productLine: '', status: '' });
  // 显示对比数据
  const [showLastYear, setShowLastYear] = useState(true);
  const [showLastForecast, setShowLastForecast] = useState(true);
  // 编辑状态
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');
  // 已确认的SKU
  const [confirmedSkus, setConfirmedSkus] = useState(new Set());

  // Mock数据 - 产品系列 > SPU > SKU 层级结构
  const [forecastData, setForecastData] = useState(() => generateMockData());

  function generateMockData() {
    const productLines = [
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

    // 为每个SKU生成12个月的预测数据
    const generateSkuForecast = (skuId, isNew) => {
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
    };

    // 递归添加预测数据
    return productLines.map(pl => ({
      ...pl,
      spus: pl.spus.map(spu => ({
        ...spu,
        skus: spu.skus.map(sku => ({
          ...sku,
          monthlyData: generateSkuForecast(sku.id, sku.isNew)
        }))
      }))
    }));
  }

  // 计算SPU汇总数据
  const calculateSpuTotal = useCallback((spu, monthIndex) => {
    return spu.skus.reduce((sum, sku) => sum + (sku.monthlyData[monthIndex]?.forecast || 0), 0);
  }, []);

  // 计算产品系列汇总数据
  const calculateProductLineTotal = useCallback((pl, monthIndex) => {
    return pl.spus.reduce((sum, spu) => sum + calculateSpuTotal(spu, monthIndex), 0);
  }, [calculateSpuTotal]);

  // 计算总计
  const calculateGrandTotal = useCallback((monthIndex) => {
    return forecastData.reduce((sum, pl) => sum + calculateProductLineTotal(pl, monthIndex), 0);
  }, [forecastData, calculateProductLineTotal]);

  // 切换展开状态
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

  // 开始编辑单元格
  const startEdit = (skuId, monthIndex, currentValue) => {
    if (forecastMonths[monthIndex - 1].isFrozen) return;
    setEditingCell({ skuId, monthIndex });
    setEditValue(currentValue.toString());
  };

  // 保存编辑
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

    setEditingCell(null);
    setEditValue('');
  };

  // 确认SKU预测
  const confirmSku = (skuId) => {
    setConfirmedSkus(prev => new Set([...prev, skuId]));
  };

  // 批量确认
  const confirmAll = () => {
    const allSkuIds = forecastData.flatMap(pl =>
      pl.spus.flatMap(spu => spu.skus.map(sku => sku.id))
    );
    setConfirmedSkus(new Set(allSkuIds));
  };

  // 获取变化趋势图标
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

  // 统计数据
  const stats = useMemo(() => {
    const totalSkus = forecastData.flatMap(pl => pl.spus.flatMap(spu => spu.skus)).length;
    const confirmedCount = confirmedSkus.size;
    const totalForecast = forecastMonths.reduce((sum, m) => sum + calculateGrandTotal(m.index), 0);
    return { totalSkus, confirmedCount, totalForecast };
  }, [forecastData, confirmedSkus, forecastMonths, calculateGrandTotal]);

  // 产品系列选项
  const productLineOptions = forecastData.map(pl => ({ id: pl.id, name: pl.name }));

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* 顶部信息栏 */}
      <div className="bg-white border-b px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4 flex-wrap">
            <h2 className="text-lg font-semibold text-gray-800 whitespace-nowrap">销量预测</h2>
            <div className="flex items-center gap-2 text-sm text-gray-500 whitespace-nowrap">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span>预测周期：{forecastMonths[0].label} - {forecastMonths[11].label}</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs whitespace-nowrap">
              <Lock className="w-3 h-3 flex-shrink-0" />
              <span>冻结期：{forecastMonths[0].shortLabel} - {forecastMonths[1].shortLabel}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-sm text-gray-500 whitespace-nowrap">
              已确认: <span className="font-medium text-green-600">{stats.confirmedCount}</span> / {stats.totalSkus} SKU
            </div>
            <button
              onClick={confirmAll}
              className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700 whitespace-nowrap"
            >
              <Check className="w-4 h-4" />
              全部确认
            </button>
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

      {/* 数据表格 */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm border-collapse min-w-[1500px]">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-gray-600 border-b border-r bg-gray-100 sticky left-0 z-20 min-w-[280px]">
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
              <td className="px-3 py-2 border-b border-r bg-blue-50 sticky left-0">
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
                  <td className="px-3 py-2 border-b border-r bg-gray-50 sticky left-0">
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
                      <td className="px-3 py-2 border-b border-r bg-white sticky left-0">
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
                      const isConfirmed = confirmedSkus.has(sku.id);
                      const skuTotal = forecastMonths.reduce((sum, m) => sum + (sku.monthlyData[m.index]?.forecast || 0), 0);

                      return (
                        <tr key={sku.id} className={`hover:bg-blue-50 ${isConfirmed ? 'bg-green-50' : 'bg-white'}`}>
                          <td className={`px-3 py-2 border-b border-r sticky left-0 ${isConfirmed ? 'bg-green-50' : 'bg-white'}`}>
                            <div className="flex items-center gap-2 pl-12">
                              <span className="font-mono text-xs text-blue-600">{sku.id}</span>
                              <span className="text-gray-600">{sku.name}</span>
                              {sku.isNew && (
                                <span className="px-1.5 py-0.5 bg-orange-100 text-orange-600 rounded text-xs">新品</span>
                              )}
                              {isConfirmed && (
                                <span className="px-1.5 py-0.5 bg-green-100 text-green-600 rounded text-xs flex items-center gap-0.5">
                                  <Check className="w-3 h-3" />
                                  已确认
                                </span>
                              )}
                            </div>
                          </td>
                          {forecastMonths.map((m) => {
                            const data = sku.monthlyData[m.index];
                            const isEditing = editingCell?.skuId === sku.id && editingCell?.monthIndex === m.index;

                            return (
                              <td
                                key={m.index}
                                className={`px-1 py-1 text-center border-b ${
                                  m.isFrozen ? 'bg-orange-50' : 'cursor-pointer hover:bg-blue-100'
                                } ${data?.adjusted ? 'bg-yellow-50' : ''}`}
                                onClick={() => !m.isFrozen && !isConfirmed && startEdit(sku.id, m.index, data?.forecast || 0)}
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
                          <td className="px-3 py-2 text-center border-b">
                            {!isConfirmed ? (
                              <button
                                onClick={() => confirmSku(sku.id)}
                                className="text-green-600 hover:text-green-700 text-xs flex items-center gap-0.5 mx-auto"
                              >
                                <Check className="w-3.5 h-3.5" />
                                确认
                              </button>
                            ) : (
                              <span className="text-gray-400 text-xs">-</span>
                            )}
                          </td>
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
          {showLastYear && <span className="text-gray-400">灰色小字 = 去年同期</span>}
          {showLastForecast && <span className="text-purple-400">紫色小字 = 上期预测</span>}
        </div>
        <div>
          点击单元格编辑预测值 | 新品无去年同期数据
        </div>
      </div>
    </div>
  );
};

export default SalesForecastPage;
