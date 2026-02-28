import React, { useState } from 'react';
import { X } from 'lucide-react';

const BOMManagement = () => {
  const [filters, setFilters] = useState({
    bomCode: '',
    bomType: '',
    sku: '',
    status: '',
    owner: ''
  });
  const [selectedBOM, setSelectedBOM] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // 完整的 BOM 数据
  const bomData = [
    {
      bomId: 'BOM-001',
      bomCode: 'BOM-KK-RL-2024-7FT-M-V1',
      bomType: '销售BOM',
      applicableObject: 'KK-RL-2024-7FT-M',
      currentVersion: 'V1',
      status: '生效',
      effectiveDate: '2024-03-15',
      expiryDate: '2025-12-31',
      componentCount: 8,
      owner: '李明',
      lastUpdatedBy: '张三',
      updateTime: '2024-03-15 10:30',
      assemblySupplier: '深圳威尔科技有限公司',
      category: '钓鱼竿 / 路亚竿',
      series: 'Royale Legend系列',
      components: [
        { componentSKU: 'KK-RL-ROD-BLANK', componentName: '竿身碳纤维管', quantity: 1, unit: '支', alternateGroup: '', note: '高模量碳纤维' },
        { componentSKU: 'KK-RL-HANDLE', componentName: 'EVA握把', quantity: 1, unit: '个', alternateGroup: '', note: '防滑设计' },
        { componentSKU: 'KK-RL-GUIDE-1', componentName: '导眼（顶部）', quantity: 1, unit: '个', alternateGroup: 'A', note: 'SIC材质' },
        { componentSKU: 'KK-RL-GUIDE-2', componentName: '导眼（中段）', quantity: 5, unit: '个', alternateGroup: 'A', note: 'SIC材质' },
        { componentSKU: 'KK-RL-REEL-SEAT', componentName: '轮座', quantity: 1, unit: '个', alternateGroup: '', note: '金属材质' },
        { componentSKU: 'KK-RL-END-CAP', componentName: '尾塞', quantity: 1, unit: '个', alternateGroup: '', note: '品牌LOGO' },
        { componentSKU: 'PKG-ROD-TUBE', componentName: '竿筒', quantity: 1, unit: '个', alternateGroup: '', note: '硬质塑料' },
        { componentSKU: 'PKG-MANUAL', componentName: '说明书', quantity: 1, unit: '份', alternateGroup: '', note: '中英文版' }
      ],
      changeHistory: [
        { version: 'V1', changeDate: '2024-03-15', changeBy: '李明', changeReason: '初始创建', approver: '王总', approvalDate: '2024-03-15' }
      ]
    },
    {
      bomId: 'BOM-002',
      bomCode: 'BOM-KK-MG-2024-3000-V2',
      bomType: '包装BOM',
      applicableObject: 'KK-MG-2024-3000',
      currentVersion: 'V2',
      status: '待审批',
      effectiveDate: '2025-02-01',
      expiryDate: '-',
      componentCount: 5,
      owner: '王芳',
      lastUpdatedBy: '李四',
      updateTime: '2025-01-10 14:20',
      assemblySupplier: '东莞精密制造有限公司',
      category: '渔线轮 / 纺车轮',
      series: 'Megatron系列',
      components: [
        { componentSKU: 'KK-MG-BODY', componentName: '轮体', quantity: 1, unit: '个', alternateGroup: '', note: '全金属机身' },
        { componentSKU: 'KK-MG-ROTOR', componentName: '转子', quantity: 1, unit: '个', alternateGroup: '', note: '铝合金' },
        { componentSKU: 'KK-MG-SPOOL', componentName: '线杯', quantity: 1, unit: '个', alternateGroup: '', note: '铝合金' },
        { componentSKU: 'PKG-BOX-MG', componentName: '包装盒', quantity: 1, unit: '个', alternateGroup: '', note: '彩印纸盒' },
        { componentSKU: 'PKG-FOAM', componentName: '内衬泡棉', quantity: 1, unit: '个', alternateGroup: '', note: 'EVA材质' }
      ],
      changeHistory: [
        { version: 'V1', changeDate: '2024-05-20', changeBy: '王芳', changeReason: '初始创建', approver: '王总', approvalDate: '2024-05-20' },
        { version: 'V2', changeDate: '2025-01-10', changeBy: '李四', changeReason: '优化包装结构，增加防震泡棉', approver: '待审批', approvalDate: '-' }
      ]
    },
    {
      bomId: 'BOM-003',
      bomCode: 'BOM-KK-RL-2024-8FT-M-V1',
      bomType: '生产BOM',
      applicableObject: 'KK-RL-2024-8FT-M',
      currentVersion: 'V1',
      status: '生效',
      effectiveDate: '2024-06-20',
      expiryDate: '-',
      componentCount: 5,
      owner: '李明',
      lastUpdatedBy: '张三',
      updateTime: '2024-06-20 09:45',
      assemblySupplier: '深圳威尔科技有限公司',
      category: '钓鱼竿 / 路亚竿',
      series: 'Royale Legend系列',
      components: [
        { componentSKU: 'KK-RL-ROD-BLANK-8', componentName: '竿身碳纤维管（8尺）', quantity: 1, unit: '支', alternateGroup: '', note: '高模量碳纤维' },
        { componentSKU: 'KK-RL-HANDLE', componentName: 'EVA握把', quantity: 1, unit: '个', alternateGroup: '', note: '防滑设计' },
        { componentSKU: 'KK-RL-GUIDE-1', componentName: '导眼（顶部）', quantity: 1, unit: '个', alternateGroup: 'A', note: 'SIC材质' },
        { componentSKU: 'KK-RL-GUIDE-2', componentName: '导眼（中段）', quantity: 6, unit: '个', alternateGroup: 'A', note: 'SIC材质' },
        { componentSKU: 'KK-RL-REEL-SEAT', componentName: '轮座', quantity: 1, unit: '个', alternateGroup: '', note: '金属材质' }
      ],
      changeHistory: [
        { version: 'V1', changeDate: '2024-06-20', changeBy: '李明', changeReason: '新增8尺规格生产BOM', approver: '王总', approvalDate: '2024-06-20' }
      ]
    },
    {
      bomId: 'BOM-004',
      bomCode: 'BOM-KK-SD-2024-7FT-XF-V1',
      bomType: '销售BOM',
      applicableObject: 'KK-SD-2024-7FT-XF',
      currentVersion: 'V1',
      status: '生效',
      effectiveDate: '2024-07-20',
      expiryDate: '-',
      componentCount: 4,
      owner: '李明',
      lastUpdatedBy: '张三',
      updateTime: '2024-07-20 15:30',
      assemblySupplier: '深圳威尔科技有限公司',
      category: '钓鱼竿 / 路亚竿',
      series: 'Speed Demon系列',
      components: [
        { componentSKU: 'KK-SD-ROD-BLANK', componentName: '竞技竿身', quantity: 1, unit: '支', alternateGroup: '', note: '超高模碳纤维' },
        { componentSKU: 'KK-SD-HANDLE', componentName: '竞技握把', quantity: 1, unit: '个', alternateGroup: '', note: '轻量化设计' },
        { componentSKU: 'KK-SD-GUIDE-T', componentName: '钛合金导眼', quantity: 7, unit: '个', alternateGroup: '', note: '低摩擦系数' },
        { componentSKU: 'PKG-SD-TUBE', componentName: '竞技竿筒', quantity: 1, unit: '个', alternateGroup: '', note: '碳纤维材质' }
      ],
      changeHistory: [
        { version: 'V1', changeDate: '2024-07-20', changeBy: '李明', changeReason: '竞技系列新品上市', approver: '王总', approvalDate: '2024-07-20' }
      ]
    },
    {
      bomId: 'BOM-005',
      bomCode: 'BOM-KK-SK3-2024-12FT-H-V1',
      bomType: '销售BOM',
      applicableObject: 'KK-SK3-2024-12FT-H',
      currentVersion: 'V1',
      status: '生效',
      effectiveDate: '2024-04-10',
      expiryDate: '-',
      componentCount: 4,
      owner: '王芳',
      lastUpdatedBy: '李四',
      updateTime: '2024-04-10 10:20',
      assemblySupplier: '青岛海钓装备有限公司',
      category: '钓鱼竿 / 海竿',
      series: 'Sharky III系列',
      components: [
        { componentSKU: 'KK-SK3-ROD-12', componentName: '海竿竿身（12尺）', quantity: 1, unit: '支', alternateGroup: '', note: '抗腐蚀涂层' },
        { componentSKU: 'KK-SK3-HANDLE-H', componentName: '重型握把', quantity: 1, unit: '个', alternateGroup: '', note: 'EVA+碳纤维' },
        { componentSKU: 'KK-SK3-GUIDE-SEA', componentName: '海钓导眼', quantity: 8, unit: '个', alternateGroup: '', note: '不锈钢材质' },
        { componentSKU: 'PKG-SK3-CASE', componentName: '海钓竿保护套', quantity: 1, unit: '个', alternateGroup: '', note: '加厚防护' }
      ],
      changeHistory: [
        { version: 'V1', changeDate: '2024-04-10', changeBy: '王芳', changeReason: '海钓系列首发', approver: '王总', approvalDate: '2024-04-10' }
      ]
    },
    {
      bomId: 'BOM-006',
      bomCode: 'BOM-KK-SK3R-2024-5000-V1',
      bomType: '生产BOM',
      applicableObject: 'KK-SK3R-2024-5000',
      currentVersion: 'V1',
      status: '草稿',
      effectiveDate: '-',
      expiryDate: '-',
      componentCount: 4,
      owner: '王芳',
      lastUpdatedBy: '王芳',
      updateTime: '2025-01-11 16:30',
      assemblySupplier: '东莞精密制造有限公司',
      category: '渔线轮 / 纺车轮',
      series: 'Sharky III系列',
      components: [
        { componentSKU: 'KK-SK3R-BODY', componentName: '轮体（海钓版）', quantity: 1, unit: '个', alternateGroup: '', note: '全密封设计' },
        { componentSKU: 'KK-SK3R-ROTOR', componentName: '转子（防腐）', quantity: 1, unit: '个', alternateGroup: '', note: '阳极氧化处理' },
        { componentSKU: 'KK-SK3R-SPOOL', componentName: '线杯（大容量）', quantity: 1, unit: '个', alternateGroup: '', note: '铝合金' },
        { componentSKU: 'KK-SK3R-BEARING', componentName: '防腐轴承', quantity: 14, unit: '个', alternateGroup: '', note: '不锈钢材质' }
      ],
      changeHistory: []
    },
    {
      bomId: 'BOM-007',
      bomCode: 'BOM-PF-TAC-2024-L-BK-V1',
      bomType: '包装BOM',
      applicableObject: 'PF-TAC-2024-L-BK',
      currentVersion: 'V1',
      status: '生效',
      effectiveDate: '2024-06-01',
      expiryDate: '-',
      componentCount: 4,
      owner: '赵敏',
      lastUpdatedBy: '王五',
      updateTime: '2024-06-01 11:15',
      assemblySupplier: '广州户外装备厂',
      category: '钓鱼包 / 路亚包',
      series: '战术系列',
      components: [
        { componentSKU: 'PF-TAC-BAG-L', componentName: '战术包主体（L号）', quantity: 1, unit: '个', alternateGroup: '', note: '1000D尼龙' },
        { componentSKU: 'PF-TAC-DIVIDER', componentName: '内部隔板', quantity: 3, unit: '个', alternateGroup: '', note: '可调节' },
        { componentSKU: 'PF-TAC-STRAP', componentName: '肩带组件', quantity: 1, unit: '套', alternateGroup: '', note: '加宽加厚' },
        { componentSKU: 'PKG-PF-BOX', componentName: '包装盒', quantity: 1, unit: '个', alternateGroup: '', note: '彩盒' }
      ],
      changeHistory: [
        { version: 'V1', changeDate: '2024-06-01', changeBy: '赵敏', changeReason: '战术包系列上市', approver: '刘总', approvalDate: '2024-06-01' }
      ]
    },
    {
      bomId: 'BOM-008',
      bomCode: 'BOM-PF-CARB-2024-20LB-150M-V1',
      bomType: '包装BOM',
      applicableObject: 'PF-CARB-2024-20LB-150M',
      currentVersion: 'V1',
      status: '生效',
      effectiveDate: '2024-08-05',
      expiryDate: '-',
      componentCount: 3,
      owner: '赵敏',
      lastUpdatedBy: '王五',
      updateTime: '2024-08-05 14:00',
      assemblySupplier: '苏州渔线生产基地',
      category: '钓鱼配件 / 钓鱼线',
      series: '碳素系列',
      components: [
        { componentSKU: 'PF-CARB-LINE-20', componentName: '碳素编织线（20磅）', quantity: 150, unit: '米', alternateGroup: '', note: '8编工艺' },
        { componentSKU: 'PF-CARB-SPOOL', componentName: '线轴', quantity: 1, unit: '个', alternateGroup: '', note: 'ABS材质' },
        { componentSKU: 'PKG-PF-BLISTER', componentName: '吸塑包装', quantity: 1, unit: '个', alternateGroup: '', note: '透明PVC' }
      ],
      changeHistory: [
        { version: 'V1', changeDate: '2024-08-05', changeBy: '赵敏', changeReason: '碳素线系列投产', approver: '刘总', approvalDate: '2024-08-05' }
      ]
    },
    {
      bomId: 'BOM-009',
      bomCode: 'BOM-KK-IC-2024-25L-WH-V2',
      bomType: '生产BOM',
      applicableObject: 'KK-IC-2024-25L-WH',
      currentVersion: 'V2',
      status: '待审批',
      effectiveDate: '2025-02-15',
      expiryDate: '-',
      componentCount: 5,
      owner: '李明',
      lastUpdatedBy: '张三',
      updateTime: '2025-01-12 09:30',
      assemblySupplier: '珠海智能家电厂',
      category: '钓鱼配件 / 钓鱼箱',
      series: 'iCool系列',
      components: [
        { componentSKU: 'KK-IC-BOX-25', componentName: '保温箱体（25L）', quantity: 1, unit: '个', alternateGroup: '', note: 'PE材质' },
        { componentSKU: 'KK-IC-TEMP-MODULE', componentName: '智能温控模块', quantity: 1, unit: '个', alternateGroup: '', note: '蓝牙连接' },
        { componentSKU: 'KK-IC-BATTERY', componentName: '锂电池组', quantity: 1, unit: '个', alternateGroup: '', note: '10000mAh' },
        { componentSKU: 'KK-IC-LID', componentName: '密封盖板', quantity: 1, unit: '个', alternateGroup: '', note: '带坐垫功能' },
        { componentSKU: 'PKG-IC-CARTON', componentName: '外箱', quantity: 1, unit: '个', alternateGroup: '', note: '五层瓦楞纸' }
      ],
      changeHistory: [
        { version: 'V1', changeDate: '2024-05-15', changeBy: '李明', changeReason: 'iCool产品首发', approver: '王总', approvalDate: '2024-05-15' },
        { version: 'V2', changeDate: '2025-01-12', changeBy: '张三', changeReason: '升级温控模块，增加蓝牙功能', approver: '待审批', approvalDate: '-' }
      ]
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      '草稿': 'bg-gray-100 text-gray-700',
      '待审批': 'bg-yellow-100 text-yellow-700',
      '生效': 'bg-green-100 text-green-700',
      '停用': 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getBOMTypeColor = (type) => {
    const colors = {
      '销售BOM': 'bg-blue-100 text-blue-700',
      '包装BOM': 'bg-purple-100 text-purple-700',
      '生产BOM': 'bg-orange-100 text-orange-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const handleViewBOM = (bom) => {
    setSelectedBOM(bom);
    setDrawerOpen(true);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* 顶部筛选区 */}
      <div className="bg-white shadow-sm p-4">
        <h2 className="text-xl font-bold mb-4">BOM 管理</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <input
            type="text"
            placeholder="BOM 编码"
            value={filters.bomCode}
            onChange={(e) => setFilters({...filters, bomCode: e.target.value})}
            className="px-3 py-2 border rounded-lg text-sm"
          />
          <select
            value={filters.bomType}
            onChange={(e) => setFilters({...filters, bomType: e.target.value})}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">BOM 类型</option>
            <option value="销售BOM">销售BOM</option>
            <option value="包装BOM">包装BOM</option>
            <option value="生产BOM">生产BOM</option>
          </select>
          <input
            type="text"
            placeholder="适用 SKU"
            value={filters.sku}
            onChange={(e) => setFilters({...filters, sku: e.target.value})}
            className="px-3 py-2 border rounded-lg text-sm"
          />
          <select
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">全部状态</option>
            <option value="草稿">草稿</option>
            <option value="待审批">待审批</option>
            <option value="生效">生效</option>
            <option value="停用">停用</option>
          </select>
          <input
            type="text"
            placeholder="责任人"
            value={filters.owner}
            onChange={(e) => setFilters({...filters, owner: e.target.value})}
            className="px-3 py-2 border rounded-lg text-sm"
          />
        </div>
      </div>

      {/* BOM 列表 */}
      <div className="flex-1 overflow-hidden p-4">
        <div className="bg-white rounded-lg shadow-sm h-full flex flex-col">
          <div className="flex-1 overflow-auto">
            <table className="w-full text-sm min-w-[1200px]">
              <thead className="bg-gray-50 sticky top-0">
                <tr className="border-b">
                  <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">BOM 编码</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">BOM 类型</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">适用对象</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">当前版本</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">状态</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">生效日期</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">组件数</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">责任人</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">组装供应商</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">操作</th>
                </tr>
              </thead>
              <tbody>
                {bomData.map((bom) => (
                  <tr key={bom.bomId} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs">{bom.bomCode}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs ${getBOMTypeColor(bom.bomType)}`}>
                        {bom.bomType}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">{bom.applicableObject}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs">
                        {bom.currentVersion}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(bom.status)}`}>
                        {bom.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs">{bom.effectiveDate}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                        {bom.componentCount}
                      </span>
                    </td>
                    <td className="px-4 py-3">{bom.owner}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{bom.assemblySupplier}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleViewBOM(bom)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                      >
                        查看
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 底部统计 */}
          <div className="p-4 border-t bg-gray-50 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              共 <span className="font-semibold text-gray-800">{bomData.length}</span> 个 BOM
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 border rounded hover:bg-gray-100 text-sm">上一页</button>
              <span className="text-sm text-gray-600">1 / 1</span>
              <button className="px-3 py-1 border rounded hover:bg-gray-100 text-sm">下一页</button>
            </div>
          </div>
        </div>
      </div>

      {/* BOM 详情抽屉 */}
      {drawerOpen && selectedBOM && (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
          <div 
            className="absolute inset-0 bg-black bg-opacity-30"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="relative bg-white w-2/3 h-full shadow-2xl flex flex-col">
            {/* 抽屉头部 */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-bold">{selectedBOM.bomCode}</h2>
                <p className="text-sm text-gray-500 mt-1">BOM 详情</p>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 抽屉内容 */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* 基本信息 */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold mb-4">基本信息</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">BOM 类型：</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${getBOMTypeColor(selectedBOM.bomType)}`}>
                      {selectedBOM.bomType}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">当前版本：</span>
                    <span className="ml-2 font-mono">{selectedBOM.currentVersion}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">状态：</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${getStatusColor(selectedBOM.status)}`}>
                      {selectedBOM.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">适用对象：</span>
                    <span className="ml-2 font-mono">{selectedBOM.applicableObject}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">生效日期：</span>
                    <span className="ml-2">{selectedBOM.effectiveDate}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">失效日期：</span>
                    <span className="ml-2">{selectedBOM.expiryDate}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">责任人：</span>
                    <span className="ml-2">{selectedBOM.owner}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">组装供应商：</span>
                    <span className="ml-2">{selectedBOM.assemblySupplier}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">类目/系列：</span>
                    <span className="ml-2">{selectedBOM.category}</span>
                  </div>
                </div>
              </div>

              {/* 组件明细 */}
              <div className="mb-6">
                <h3 className="font-semibold mb-4">组件明细</h3>
                {selectedBOM.components.length > 0 ? (
                  <table className="w-full text-sm border">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left border-b">序号</th>
                        <th className="px-3 py-2 text-left border-b">组件 SKU</th>
                        <th className="px-3 py-2 text-left border-b">组件名称</th>
                        <th className="px-3 py-2 text-left border-b">数量</th>
                        <th className="px-3 py-2 text-left border-b">单位</th>
                        <th className="px-3 py-2 text-left border-b">替代组</th>
                        <th className="px-3 py-2 text-left border-b">备注</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedBOM.components.map((comp, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="px-3 py-2">{index + 1}</td>
                          <td className="px-3 py-2 font-mono text-xs">{comp.componentSKU}</td>
                          <td className="px-3 py-2">{comp.componentName}</td>
                          <td className="px-3 py-2">{comp.quantity}</td>
                          <td className="px-3 py-2">{comp.unit}</td>
                          <td className="px-3 py-2">
                            {comp.alternateGroup && (
                              <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs">
                                组{comp.alternateGroup}
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-gray-600">{comp.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    暂无组件明细
                  </div>
                )}
              </div>

              {/* 变更记录 */}
              <div>
                <h3 className="font-semibold mb-4">变更记录 & 审批轨迹</h3>
                {selectedBOM.changeHistory.length > 0 ? (
                  <div className="space-y-3">
                    {selectedBOM.changeHistory.map((record, index) => (
                      <div key={index} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-start justify-between mb-2">
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
            <div className="p-6 border-t bg-gray-50 flex gap-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                编辑
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
                发起审批
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">
                复制为新版本
              </button>
              <button className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100">
                导出
              </button>
              <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm hover:bg-red-50">
                停用
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BOMManagement;