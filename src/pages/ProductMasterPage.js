import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

export default function ProductMasterPage({ onOpenSkuDetail }) {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [expandedSPUs, setExpandedSPUs] = useState([]);
    const [treeExpanded, setTreeExpanded] = useState(['brand-1', 'cat1-1']);
    const [searchTree, setSearchTree] = useState('');
    const [filters, setFilters] = useState({
        sku: '',
        spu: '',
        manager: '',
        status: '',
        salesType: ''
    });

    // 分类树数据
    const categoryTree = [
        {
            id: 'brand-1',
            name: 'KastKing',
            type: 'brand',
            children: [
                {
                    id: 'cat1-1',
                    name: '钓鱼竿',
                    type: 'category1',
                    children: [
                        {
                            id: 'cat2-1',
                            name: '路亚竿',
                            type: 'category2',
                            children: [
                                { id: 'series-1', name: 'Royale Legend系列', type: 'series' },
                                { id: 'series-2', name: 'Speed Demon系列', type: 'series' }
                            ]
                        },
                        {
                            id: 'cat2-2',
                            name: '海竿',
                            type: 'category2',
                            children: [
                                { id: 'series-3', name: 'Sharky III系列', type: 'series' }
                            ]
                        }
                    ]
                },
                {
                    id: 'cat1-2',
                    name: '渔线轮',
                    type: 'category1',
                    children: [
                        {
                            id: 'cat2-3',
                            name: '纺车轮',
                            type: 'category2',
                            children: [
                                { id: 'series-4', name: 'Megatron系列', type: 'series' },
                                { id: 'series-5', name: 'Sharky III系列', type: 'series' }
                            ]
                        }
                    ]
                },
                {
                    id: 'cat1-3',
                    name: '钓鱼配件',
                    type: 'category1',
                    children: [
                        {
                            id: 'cat2-4',
                            name: '钓鱼箱',
                            type: 'category2',
                            children: [
                                { id: 'series-6', name: 'iCool系列', type: 'series' }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            id: 'brand-2',
            name: 'Piscifun',
            type: 'brand',
            children: [
                {
                    id: 'cat1-4',
                    name: '钓鱼包',
                    type: 'category1',
                    children: [
                        {
                            id: 'cat2-5',
                            name: '路亚包',
                            type: 'category2',
                            children: [
                                { id: 'series-7', name: '战术系列', type: 'series' }
                            ]
                        }
                    ]
                },
                {
                    id: 'cat1-5',
                    name: '钓鱼配件',
                    type: 'category1',
                    children: [
                        {
                            id: 'cat2-6',
                            name: '钓鱼线',
                            type: 'category2',
                            children: [
                                { id: 'series-8', name: '碳素系列', type: 'series' }
                            ]
                        }
                    ]
                }
            ]
        }
    ];

    // 产品数据（8个SPU）
    const productData = [
        {
            spuId: 'SPU-001',
            brand: 'KastKing',
            category1: '钓鱼竿',
            category2: '路亚竿',
            series: 'Royale Legend系列',
            spuCode: 'KRLCSTMJE-72LDX',
            nameCN: '皇家传奇碳素路亚竿',
            nameEN: 'Royale Legend Carbon Casting Rod',
            description: '高模量碳纤维制作，轻量化设计，适合淡水路亚钓鱼',
            launchDate: '2024-03-15',
            salesType: '主推款',
            representativeSKU: 'KRLCSTMJE-72LDX-D',
            productManager: '李明',
            skuCount: 3,
            status: '在售',
            updateTime: '2025-01-10 14:30',
            updatedBy: '张三',
            skus: [
                {
                    sku: 'KRLCSTMJE-72LDX',
                    specs: '7尺/中调/黑色',
                    barcode: 'UPC: 123456789012',
                    dimensions: '213×5×5 cm / 84×2×2 in',
                    weight: '185g / 6.5oz',
                    isDangerous: '否',
                    status: '停售',
                    iterationDate: '2024-03-15',
                    iterationReason: '首次上市'
                },
                {
                    sku: 'KRLCSTMJE-72LDX-C',
                    specs: '7尺/中硬调/黑色',
                    barcode: 'UPC: 123456789013',
                    dimensions: '213×5×5 cm / 84×2×2 in',
                    weight: '195g / 6.9oz',
                    isDangerous: '否',
                    status: '在售',
                    iterationDate: '2024-03-15',
                    iterationReason: '首次上市'
                },
                {
                    sku: 'KRLCSTMJE-72LDX-D',
                    specs: '8尺/中调/蓝色',
                    barcode: 'UPC: 123456789014',
                    dimensions: '244×5×5 cm / 96×2×2 in',
                    weight: '205g / 7.2oz',
                    isDangerous: '否',
                    status: '在售',
                    iterationDate: '2024-06-20',
                    iterationReason: '新增配色和长度规格'
                }
            ]
        },
        {
            spuId: 'SPU-002',
            brand: 'KastKing',
            category1: '渔线轮',
            category2: '纺车轮',
            series: 'Megatron系列',
            spuCode: 'KK-MG-2024',
            nameCN: '擎天柱全金属纺车轮',
            nameEN: 'Megatron All-Metal Spinning Reel',
            description: '全金属机身，13+1轴承系统，超强拖拽力',
            launchDate: '2024-05-20',
            salesType: '标准款',
            representativeSKU: 'KK-MG-2024-3000',
            productManager: '王芳',
            skuCount: 6,
            status: '在售',
            updateTime: '2025-01-08 09:15',
            updatedBy: '李四',
            skus: [
                {
                    sku: 'KK-MG-2024-3000',
                    specs: '3000型/左手/银色',
                    barcode: 'EAN: 9876543210123',
                    dimensions: '15×12×8 cm / 6×5×3 in',
                    weight: '285g / 10.1oz',
                    isDangerous: '否',
                    status: '在售',
                    iterationDate: '2024-05-20',
                    iterationReason: '首次上市'
                },
                {
                    sku: 'KK-MG-2024-4000',
                    specs: '4000型/左手/银色',
                    barcode: 'EAN: 9876543210124',
                    dimensions: '16×13×9 cm / 6.3×5.1×3.5 in',
                    weight: '315g / 11.1oz',
                    isDangerous: '否',
                    status: '在售',
                    iterationDate: '2024-05-20',
                    iterationReason: '首次上市'
                }
            ]
        },
        // ……（后面 003 - 008 同你现有数据，原样保留）
        {
            spuId: 'SPU-003',
            brand: 'KastKing',
            category1: '钓鱼竿',
            category2: '路亚竿',
            series: 'Speed Demon系列',
            spuCode: 'KK-SD-2024',
            nameCN: '速度恶魔竞技路亚竿',
            nameEN: 'Speed Demon Competition Casting Rod',
            description: '专为竞技设计，超快调性，精准抛投',
            launchDate: '2024-07-20',
            salesType: '主推款',
            representativeSKU: 'KK-SD-2024-6.6FT-XF',
            productManager: '李明',
            skuCount: 8,
            status: '在售',
            updateTime: '2025-01-09 16:20',
            updatedBy: '张三',
            skus: [
                {
                    sku: 'KK-SD-2024-6.6FT-XF',
                    specs: '6.6尺/超快调/红色',
                    barcode: 'UPC: 123456789015',
                    dimensions: '198×5×5 cm / 78×2×2 in',
                    weight: '165g / 5.8oz',
                    isDangerous: '否',
                    status: '在售',
                    iterationDate: '2024-07-20',
                    iterationReason: '首次上市'
                },
                {
                    sku: 'KK-SD-2024-7FT-XF',
                    specs: '7尺/超快调/红色',
                    barcode: 'UPC: 123456789016',
                    dimensions: '213×5×5 cm / 84×2×2 in',
                    weight: '175g / 6.2oz',
                    isDangerous: '否',
                    status: '在售',
                    iterationDate: '2024-07-20',
                    iterationReason: '首次上市'
                }
            ]
        },
        // ……省略 004 - 008，同你原数据
    ];

    // 递归树组件
    const TreeNode = ({ node, level = 0 }) => {
        const isExpanded = treeExpanded.includes(node.id);
        const isSelected = selectedCategory?.id === node.id;
        const hasChildren = node.children && node.children.length > 0;

        const getIcon = () => {
            switch (node.type) {
                case 'brand': return '🏢';
                case 'category1': return '📁';
                case 'category2': return '📂';
                case 'series': return '📋';
                default: return '•';
            }
        };

        const toggleNode = () => {
            if (hasChildren) {
                setTreeExpanded(prev =>
                    prev.includes(node.id)
                        ? prev.filter(id => id !== node.id)
                        : [...prev, node.id]
                );
            }
            setSelectedCategory(node);
        };

        return (
            <div>
                <div
                    className={`flex items-center gap-2 px-3 py-1.5 cursor-pointer hover:bg-gray-100 ${
                        isSelected ? 'bg-blue-50 text-blue-600' : ''
                    }`}
                    style={{ paddingLeft: `${level * 16 + 12}px` }}
                    onClick={toggleNode}
                >
                    {hasChildren && (
                        <ChevronRight
                            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                        />
                    )}
                    {!hasChildren && <span className="w-4" />}
                    <span className="text-sm">{getIcon()}</span>
                    <span className="text-sm flex-1">{node.name}</span>
                </div>
                {hasChildren && isExpanded && (
                    <div>
                        {node.children.map(child => (
                            <TreeNode key={child.id} node={child} level={level + 1} />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex gap-4 h-full">
            {/* 左侧分类树 (12%) */}
            <div className="w-[12%] bg-white rounded-lg shadow-sm flex flex-col">
                <div className="p-4 border-b">
                    <input
                        type="text"
                        placeholder="搜索分类..."
                        value={searchTree}
                        onChange={(e) => setSearchTree(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                </div>
                <div className="flex-1 overflow-y-auto py-2">
                    {categoryTree.map(node => (
                        <TreeNode key={node.id} node={node} />
                    ))}
                </div>
            </div>

            {/* 右侧主数据区 (88%) */}
            <div className="flex-1 bg-white rounded-lg shadow-sm flex flex-col min-h-0">
                {/* 顶部筛选区 */}
                <div className="p-4 border-b">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        <input
                            type="text"
                            placeholder="SKU"
                            value={filters.sku}
                            onChange={(e) => setFilters({...filters, sku: e.target.value})}
                            className="px-3 py-2 border rounded-lg text-sm"
                        />
                        <input
                            type="text"
                            placeholder="SPU"
                            value={filters.spu}
                            onChange={(e) => setFilters({...filters, spu: e.target.value})}
                            className="px-3 py-2 border rounded-lg text-sm"
                        />
                        <input
                            type="text"
                            placeholder="产品经理"
                            value={filters.manager}
                            onChange={(e) => setFilters({...filters, manager: e.target.value})}
                            className="px-3 py-2 border rounded-lg text-sm"
                        />
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters({...filters, status: e.target.value})}
                            className="px-3 py-2 border rounded-lg text-sm"
                        >
                            <option value="">全部状态</option>
                            <option value="在售">在售</option>
                            <option value="停售">停售</option>
                            <option value="开发中">开发中</option>
                            <option value="冻结">冻结</option>
                        </select>
                        <select
                            value={filters.salesType}
                            onChange={(e) => setFilters({...filters, salesType: e.target.value})}
                            className="px-3 py-2 border rounded-lg text-sm"
                        >
                            <option value="">销售类型</option>
                            <option value="主推款">主推款</option>
                            <option value="标准款">标准款</option>
                            <option value="清仓款">清仓款</option>
                        </select>
                    </div>
                </div>

                {/* 产品列表 */}
                <div className="flex-1 overflow-auto">
                    <table className="w-full text-sm min-w-[1100px]">
                        <thead className="bg-gray-50 sticky top-0">
                        <tr className="border-b">
                            <th className="px-4 py-3 text-left font-medium text-gray-600 w-8"></th>
                            <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">SPU</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">产品名称</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">品牌</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">类别</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">系列</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">销售类型</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">产品经理</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">SKU数</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">状态</th>
                        </tr>
                        </thead>
                        <tbody>
                        {productData.map((product) => (
                            <React.Fragment key={product.spuId}>
                                <tr className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => setExpandedSPUs(prev =>
                                                prev.includes(product.spuId) ? prev.filter(id => id !== product.spuId) : [...prev, product.spuId]
                                            )}
                                            className="p-1 hover:bg-gray-200 rounded"
                                        >
                                            <ChevronRight
                                                className={`w-4 h-4 transition-transform ${
                                                    expandedSPUs.includes(product.spuId) ? 'rotate-90' : ''
                                                }`}
                                            />
                                        </button>
                                    </td>
                                    <td className="px-4 py-3 font-mono text-xs">{product.spuCode}</td>
                                    <td className="px-4 py-3">
                                        <div>
                                            <div className="font-medium">{product.nameCN}</div>
                                            <div className="text-xs text-gray-500">{product.nameEN}</div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">{product.brand}</td>
                                    <td className="px-4 py-3">
                                        <div className="text-xs">
                                            <div>{product.category1}</div>
                                            <div className="text-gray-500">{product.category2}</div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">{product.series}</td>
                                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                        {product.salesType}
                      </span>
                                    </td>
                                    <td className="px-4 py-3">{product.productManager}</td>
                                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                        {product.skuCount}
                      </span>
                                    </td>
                                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                        {product.status}
                      </span>
                                    </td>
                                </tr>

                                {expandedSPUs.includes(product.spuId) && (
                                    <tr>
                                        <td colSpan={10} className="bg-gray-50 p-0">
                                            <div className="px-8 py-4">
                                                <table className="w-full text-sm">
                                                    <thead>
                                                    <tr className="border-b border-gray-300">
                                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">SKU</th>
                                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">规格</th>
                                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">条码</th>
                                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">包装尺寸</th>
                                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">重量</th>
                                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">状态</th>
                                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">操作</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {product.skus.map((sku, index) => (
                                                        <tr key={index} className="border-b border-gray-200">
                                                            <td className="px-3 py-2 font-mono text-xs">{sku.sku}</td>
                                                            <td className="px-3 py-2">{sku.specs}</td>
                                                            <td className="px-3 py-2 text-xs">{sku.barcode}</td>
                                                            <td className="px-3 py-2 text-xs">{sku.dimensions}</td>
                                                            <td className="px-3 py-2 text-xs">{sku.weight}</td>
                                                            <td className="px-3 py-2">
                                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                                      {sku.status}
                                    </span>
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                <button
                                                                    className="text-blue-600 hover:text-blue-700 text-xs"
                                                                    onClick={() =>
                                                                        onOpenSkuDetail?.({
                                                                            sku: sku.sku,
                                                                            spuId: product.spuId,
                                                                            spuCode: product.spuCode,
                                                                            productName: product.nameCN
                                                                        })
                                                                    }
                                                                >
                                                                    查看详情
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t flex items-center justify-between bg-gray-50">
                    <div className="text-sm text-gray-600">
                        共 <span className="font-semibold text-gray-800">{productData.length}</span> 个产品，
                        <span className="font-semibold text-gray-800">{productData.reduce((sum, p) => sum + p.skuCount, 0)}</span> 个 SKU
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1 border rounded hover:bg-gray-100 text-sm">上一页</button>
                        <span className="text-sm text-gray-600">1 / 1</span>
                        <button className="px-3 py-1 border rounded hover:bg-gray-100 text-sm">下一页</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
