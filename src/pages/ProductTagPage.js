// src/pages/ProductTagPage.js
// 产品标签管理页面
import React, { useState } from 'react';
import {
    Search, Plus, Download, Upload, Edit2, Trash2, X, Save,
    Tag, Folder, Package, TrendingUp, AlertCircle, Star, Zap, Clock, Check
} from 'lucide-react';

// 轻量工具：className 拼接
const cn = (...args) => args.filter(Boolean).join(' ');

// --------------- 标签颜色配置 ---------------
const TAG_COLORS = [
    { id: 'blue', name: '蓝色', bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
    { id: 'green', name: '绿色', bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
    { id: 'yellow', name: '黄色', bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' },
    { id: 'red', name: '红色', bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
    { id: 'purple', name: '紫色', bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
    { id: 'pink', name: '粉色', bg: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-200' },
    { id: 'indigo', name: '靛蓝', bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200' },
    { id: 'orange', name: '橙色', bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
    { id: 'teal', name: '青色', bg: 'bg-teal-100', text: 'text-teal-700', border: 'border-teal-200' },
    { id: 'gray', name: '灰色', bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' },
];

// --------------- 标签分类数据 ---------------
const initialCategories = [
    { id: 'product-attr', name: '产品属性', icon: Package, description: '描述产品本身特性的标签' },
    { id: 'sales-status', name: '销售状态', icon: TrendingUp, description: '标识产品销售阶段的标签' },
    { id: 'operation', name: '运营标签', icon: Zap, description: '运营人员使用的管理标签' },
    { id: 'priority', name: '优先级', icon: Star, description: '标识产品重要程度的标签' },
    { id: 'lifecycle', name: '生命周期', icon: Clock, description: '产品生命周期阶段标签' },
    { id: 'alert', name: '预警标签', icon: AlertCircle, description: '风险预警类标签' },
];

// --------------- 标签数据 ---------------
const initialTags = [
    // 产品属性
    { id: '1', code: 'NEW_PRODUCT', name: '新品', categoryId: 'product-attr', color: 'blue', productCount: 156, description: '新上架产品', createdBy: 'Admin', createdAt: '2024-01-15' },
    { id: '2', code: 'BEST_SELLER', name: '爆款', categoryId: 'product-attr', color: 'red', productCount: 42, description: '销量排名前列的热销产品', createdBy: 'Admin', createdAt: '2024-01-15' },
    { id: '3', code: 'SEASONAL', name: '季节性', categoryId: 'product-attr', color: 'orange', productCount: 89, description: '季节性销售产品', createdBy: 'Jason', createdAt: '2024-02-20' },
    { id: '4', code: 'EXCLUSIVE', name: '独家产品', categoryId: 'product-attr', color: 'purple', productCount: 23, description: '独家销售产品', createdBy: 'Admin', createdAt: '2024-01-15' },
    { id: '5', code: 'CUSTOMIZABLE', name: '可定制', categoryId: 'product-attr', color: 'teal', productCount: 34, description: '支持定制的产品', createdBy: 'Effie', createdAt: '2024-03-10' },

    // 销售状态
    { id: '6', code: 'ON_SALE', name: '在售', categoryId: 'sales-status', color: 'green', productCount: 1234, description: '正常在售中', createdBy: 'Admin', createdAt: '2024-01-15' },
    { id: '7', code: 'PRE_SALE', name: '预售', categoryId: 'sales-status', color: 'blue', productCount: 28, description: '预售阶段产品', createdBy: 'Admin', createdAt: '2024-01-15' },
    { id: '8', code: 'DISCONTINUED', name: '停售', categoryId: 'sales-status', color: 'gray', productCount: 567, description: '已停止销售', createdBy: 'Admin', createdAt: '2024-01-15' },
    { id: '9', code: 'CLEARANCE', name: '清仓', categoryId: 'sales-status', color: 'yellow', productCount: 45, description: '清仓处理中', createdBy: 'Tate', createdAt: '2024-04-01' },

    // 运营标签
    { id: '10', code: 'NEED_OPTIMIZE', name: '待优化', categoryId: 'operation', color: 'yellow', productCount: 78, description: 'Listing需要优化', createdBy: 'Jason', createdAt: '2024-02-15' },
    { id: '11', code: 'AD_FOCUS', name: '广告重点', categoryId: 'operation', color: 'indigo', productCount: 56, description: '广告投放重点产品', createdBy: 'Jason', createdAt: '2024-02-15' },
    { id: '12', code: 'PRICE_MONITOR', name: '价格监控', categoryId: 'operation', color: 'pink', productCount: 123, description: '需要关注价格变化', createdBy: 'Effie', createdAt: '2024-03-01' },
    { id: '13', code: 'REVIEW_NEEDED', name: '需要评价', categoryId: 'operation', color: 'orange', productCount: 89, description: '需要积累评价的产品', createdBy: 'Jason', createdAt: '2024-02-20' },

    // 优先级
    { id: '14', code: 'HIGH_PRIORITY', name: '高优先级', categoryId: 'priority', color: 'red', productCount: 34, description: '高优先级产品', createdBy: 'Admin', createdAt: '2024-01-15' },
    { id: '15', code: 'MEDIUM_PRIORITY', name: '中优先级', categoryId: 'priority', color: 'yellow', productCount: 156, description: '中等优先级产品', createdBy: 'Admin', createdAt: '2024-01-15' },
    { id: '16', code: 'LOW_PRIORITY', name: '低优先级', categoryId: 'priority', color: 'gray', productCount: 234, description: '低优先级产品', createdBy: 'Admin', createdAt: '2024-01-15' },

    // 生命周期
    { id: '17', code: 'INTRO_STAGE', name: '导入期', categoryId: 'lifecycle', color: 'blue', productCount: 67, description: '产品导入期', createdBy: 'Admin', createdAt: '2024-01-15' },
    { id: '18', code: 'GROWTH_STAGE', name: '成长期', categoryId: 'lifecycle', color: 'green', productCount: 189, description: '产品成长期', createdBy: 'Admin', createdAt: '2024-01-15' },
    { id: '19', code: 'MATURE_STAGE', name: '成熟期', categoryId: 'lifecycle', color: 'purple', productCount: 456, description: '产品成熟期', createdBy: 'Admin', createdAt: '2024-01-15' },
    { id: '20', code: 'DECLINE_STAGE', name: '衰退期', categoryId: 'lifecycle', color: 'gray', productCount: 123, description: '产品衰退期', createdBy: 'Admin', createdAt: '2024-01-15' },

    // 预警标签
    { id: '21', code: 'LOW_STOCK', name: '库存预警', categoryId: 'alert', color: 'red', productCount: 45, description: '库存不足预警', createdBy: 'Admin', createdAt: '2024-01-15' },
    { id: '22', code: 'SLOW_MOVING', name: '滞销预警', categoryId: 'alert', color: 'orange', productCount: 78, description: '销售缓慢预警', createdBy: 'Admin', createdAt: '2024-01-15' },
    { id: '23', code: 'PRICE_DROP', name: '价格下跌', categoryId: 'alert', color: 'yellow', productCount: 34, description: '价格下跌预警', createdBy: 'Effie', createdAt: '2024-03-15' },
    { id: '24', code: 'REVIEW_RISK', name: '评价风险', categoryId: 'alert', color: 'red', productCount: 12, description: '差评风险预警', createdBy: 'Jason', createdAt: '2024-02-28' },
];

// --------------- 轻量级 UI 组件 ---------------
const IconButton = ({ icon: Icon, onClick, className, title, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={cn(
            'p-2 rounded-lg transition-colors',
            disabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
            className
        )}
    >
        <Icon className="w-4 h-4" />
    </button>
);

const PrimaryButton = ({ children, onClick, icon: Icon, className, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={cn(
            'inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors',
            disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700',
            className
        )}
    >
        {Icon && <Icon className="w-4 h-4" />}
        {children}
    </button>
);

const SecondaryButton = ({ children, onClick, icon: Icon, className }) => (
    <button
        onClick={onClick}
        className={cn(
            'inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors',
            className
        )}
    >
        {Icon && <Icon className="w-4 h-4" />}
        {children}
    </button>
);

const Input = ({ value, onChange, placeholder, className, icon: Icon }) => (
    <div className="relative">
        {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon className="w-4 h-4 text-gray-400" />
            </div>
        )}
        <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={cn(
                'w-full border border-gray-300 rounded-lg py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                Icon ? 'pl-10 pr-4' : 'px-4',
                className
            )}
        />
    </div>
);

const Select = ({ value, onChange, options, className, placeholder }) => (
    <select
        value={value}
        onChange={onChange}
        className={cn(
            'border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white',
            className
        )}
    >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
    </select>
);

const Badge = ({ children, color = 'gray', className }) => {
    const colorConfig = TAG_COLORS.find(c => c.id === color) || TAG_COLORS[9];
    return (
        <span className={cn(
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
            colorConfig.bg, colorConfig.text, colorConfig.border,
            className
        )}>
            {children}
        </span>
    );
};

const Card = ({ children, className }) => (
    <div className={cn('bg-white rounded-xl border border-gray-200 shadow-sm', className)}>
        {children}
    </div>
);

// --------------- 左侧分类树 ---------------
const CategoryTree = ({ categories, selectedCategoryId, onSelectCategory, tagCounts }) => {
    // eslint-disable-next-line no-unused-vars -- 预留展开状态
    const [expandedIds, setExpandedIds] = useState(['all']);

    // eslint-disable-next-line no-unused-vars -- 预留展开/收起
    const toggleExpand = (id) => {
        setExpandedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const totalCount = Object.values(tagCounts).reduce((a, b) => a + b, 0);

    return (
        <div className="space-y-1">
            {/* 全部标签 */}
            <div
                className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors',
                    selectedCategoryId === 'all' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'
                )}
                onClick={() => onSelectCategory('all')}
            >
                <Tag className="w-4 h-4" />
                <span className="flex-1 text-sm font-medium">全部标签</span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{totalCount}</span>
            </div>

            {/* 分类列表 */}
            {categories.map(category => {
                const Icon = category.icon;
                const count = tagCounts[category.id] || 0;
                const isSelected = selectedCategoryId === category.id;

                return (
                    <div
                        key={category.id}
                        className={cn(
                            'flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors',
                            isSelected ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'
                        )}
                        onClick={() => onSelectCategory(category.id)}
                    >
                        <Icon className="w-4 h-4" />
                        <span className="flex-1 text-sm">{category.name}</span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{count}</span>
                    </div>
                );
            })}
        </div>
    );
};

// --------------- 标签编辑弹窗 ---------------
const TagEditDrawer = ({ isOpen, onClose, tag, categories, onSave }) => {
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        categoryId: '',
        color: 'blue',
        description: '',
    });

    React.useEffect(() => {
        if (tag) {
            setFormData({
                code: tag.code,
                name: tag.name,
                categoryId: tag.categoryId,
                color: tag.color,
                description: tag.description || '',
            });
        } else {
            setFormData({
                code: '',
                name: '',
                categoryId: categories[0]?.id || '',
                color: 'blue',
                description: '',
            });
        }
    }, [tag, categories]);

    const handleSave = () => {
        onSave({
            ...tag,
            ...formData,
            id: tag?.id || `${Date.now()}`,
            productCount: tag?.productCount || 0,
            createdBy: tag?.createdBy || 'Admin',
            createdAt: tag?.createdAt || new Date().toISOString().split('T')[0],
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/30" onClick={onClose} />
            <div className="relative w-[480px] bg-white h-full shadow-xl flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h2 className="text-lg font-semibold">{tag ? '编辑标签' : '新建标签'}</h2>
                    <IconButton icon={X} onClick={onClose} />
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* 标签编码 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">标签编码 *</label>
                        <Input
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                            placeholder="输入标签编码，如 NEW_PRODUCT"
                        />
                        <p className="mt-1 text-xs text-gray-500">建议使用大写字母和下划线</p>
                    </div>

                    {/* 标签名称 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">标签名称 *</label>
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="输入标签显示名称"
                        />
                    </div>

                    {/* 所属分类 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">所属分类 *</label>
                        <Select
                            value={formData.categoryId}
                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                            options={categories.map(c => ({ value: c.id, label: c.name }))}
                            className="w-full"
                        />
                    </div>

                    {/* 标签颜色 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">标签颜色</label>
                        <div className="grid grid-cols-5 gap-2">
                            {TAG_COLORS.map(color => (
                                <button
                                    key={color.id}
                                    onClick={() => setFormData({ ...formData, color: color.id })}
                                    className={cn(
                                        'flex items-center justify-center gap-1 px-3 py-2 rounded-lg border-2 transition-all',
                                        color.bg, color.text,
                                        formData.color === color.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent'
                                    )}
                                >
                                    {formData.color === color.id && <Check className="w-3 h-3" />}
                                    <span className="text-xs">{color.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 标签描述 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">描述</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="输入标签用途说明"
                            rows={3}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* 预览 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">预览效果</label>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <Badge color={formData.color}>{formData.name || '标签名称'}</Badge>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-gray-50">
                    <SecondaryButton onClick={onClose}>取消</SecondaryButton>
                    <PrimaryButton
                        icon={Save}
                        onClick={handleSave}
                        disabled={!formData.code || !formData.name || !formData.categoryId}
                    >
                        保存
                    </PrimaryButton>
                </div>
            </div>
        </div>
    );
};

// --------------- 主组件 ---------------
export default function ProductTagPage() {
    const [tags, setTags] = useState(initialTags);
    const [searchText, setSearchText] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState('all');
    const [editingTag, setEditingTag] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // 计算各分类的标签数量
    const tagCounts = initialCategories.reduce((acc, cat) => {
        acc[cat.id] = tags.filter(t => t.categoryId === cat.id).length;
        return acc;
    }, {});

    // 过滤标签
    const filteredTags = tags.filter(tag => {
        const matchesSearch = !searchText ||
            tag.name.toLowerCase().includes(searchText.toLowerCase()) ||
            tag.code.toLowerCase().includes(searchText.toLowerCase());
        const matchesCategory = selectedCategoryId === 'all' || tag.categoryId === selectedCategoryId;
        return matchesSearch && matchesCategory;
    });

    // 按分类分组
    const groupedTags = filteredTags.reduce((acc, tag) => {
        const categoryId = tag.categoryId;
        if (!acc[categoryId]) acc[categoryId] = [];
        acc[categoryId].push(tag);
        return acc;
    }, {});

    const handleAddTag = () => {
        setEditingTag(null);
        setIsDrawerOpen(true);
    };

    const handleEditTag = (tag) => {
        setEditingTag(tag);
        setIsDrawerOpen(true);
    };

    const handleDeleteTag = (tagId) => {
        if (window.confirm('确定要删除该标签吗？')) {
            setTags(prev => prev.filter(t => t.id !== tagId));
        }
    };

    const handleSaveTag = (savedTag) => {
        setTags(prev => {
            const exists = prev.find(t => t.id === savedTag.id);
            if (exists) {
                return prev.map(t => t.id === savedTag.id ? savedTag : t);
            }
            return [...prev, savedTag];
        });
    };

    // 统计数据
    const stats = {
        total: tags.length,
        totalProducts: tags.reduce((sum, t) => sum + t.productCount, 0),
        categories: initialCategories.length,
    };

    return (
        <div className="space-y-6">
            {/* 页面头部 */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">产品标签管理</h1>
                    <p className="text-sm text-gray-500 mt-1">管理产品标签分类和标签定义</p>
                </div>
                <div className="flex items-center gap-3">
                    <SecondaryButton icon={Upload}>导入</SecondaryButton>
                    <SecondaryButton icon={Download}>导出</SecondaryButton>
                    <PrimaryButton icon={Plus} onClick={handleAddTag}>新建标签</PrimaryButton>
                </div>
            </div>

            {/* 统计卡片 */}
            <div className="grid grid-cols-3 gap-4">
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Tag className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">标签总数</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                            <Package className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">关联产品</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalProducts.toLocaleString()}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                            <Folder className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">标签分类</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.categories}</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* 主体内容 */}
            <div className="flex gap-6">
                {/* 左侧分类树 */}
                <Card className="w-64 p-4 flex-shrink-0">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">标签分类</h3>
                    <CategoryTree
                        categories={initialCategories}
                        selectedCategoryId={selectedCategoryId}
                        onSelectCategory={setSelectedCategoryId}
                        tagCounts={tagCounts}
                    />
                </Card>

                {/* 右侧标签列表 */}
                <Card className="flex-1">
                    {/* 搜索栏 */}
                    <div className="p-4 border-b">
                        <Input
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            placeholder="搜索标签名称或编码..."
                            icon={Search}
                            className="max-w-md"
                        />
                    </div>

                    {/* 标签列表 */}
                    <div className="p-4">
                        {selectedCategoryId === 'all' ? (
                            // 按分类分组显示
                            <div className="space-y-6">
                                {initialCategories.map(category => {
                                    const categoryTags = groupedTags[category.id] || [];
                                    if (categoryTags.length === 0) return null;

                                    const Icon = category.icon;
                                    return (
                                        <div key={category.id}>
                                            <div className="flex items-center gap-2 mb-3">
                                                <Icon className="w-4 h-4 text-gray-500" />
                                                <h4 className="text-sm font-semibold text-gray-700">{category.name}</h4>
                                                <span className="text-xs text-gray-400">({categoryTags.length})</span>
                                            </div>
                                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                                {categoryTags.map(tag => (
                                                    <TagCard
                                                        key={tag.id}
                                                        tag={tag}
                                                        onEdit={handleEditTag}
                                                        onDelete={handleDeleteTag}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            // 单分类显示
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                {filteredTags.map(tag => (
                                    <TagCard
                                        key={tag.id}
                                        tag={tag}
                                        onEdit={handleEditTag}
                                        onDelete={handleDeleteTag}
                                    />
                                ))}
                            </div>
                        )}

                        {filteredTags.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                <Tag className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                <p>暂无标签数据</p>
                            </div>
                        )}
                    </div>
                </Card>
            </div>

            {/* 编辑抽屉 */}
            <TagEditDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                tag={editingTag}
                categories={initialCategories}
                onSave={handleSaveTag}
            />
        </div>
    );
}

// --------------- 标签卡片组件 ---------------
const TagCard = ({ tag, onEdit, onDelete }) => {
    const colorConfig = TAG_COLORS.find(c => c.id === tag.color) || TAG_COLORS[0];

    return (
        <div className={cn(
            'p-4 rounded-lg border-2 transition-all hover:shadow-md',
            colorConfig.border, 'bg-white'
        )}>
            <div className="flex items-start justify-between mb-2">
                <Badge color={tag.color}>{tag.name}</Badge>
                <div className="flex items-center gap-1">
                    <IconButton icon={Edit2} onClick={() => onEdit(tag)} title="编辑" />
                    <IconButton icon={Trash2} onClick={() => onDelete(tag.id)} title="删除" />
                </div>
            </div>
            <p className="text-xs text-gray-500 mb-2 font-mono">{tag.code}</p>
            <p className="text-xs text-gray-600 mb-3 line-clamp-2">{tag.description}</p>
            <div className="flex items-center justify-between text-xs text-gray-400">
                <span>关联产品: {tag.productCount}</span>
                <span>{tag.createdBy}</span>
            </div>
        </div>
    );
};
