// src/pages/ExpenseCategoryPage.js
import React from 'react';
import {
    Search, Plus, Download, Upload, Tag, FileText,
    MoreHorizontal, Database, User, Folder, FolderOpen,
    ChevronRight, ChevronDown, Layers, Calculator
} from 'lucide-react';

// 轻量工具：className 拼接
const cn = (...args) => args.filter(Boolean).join(' ');

// --------------- Mock 数据 ---------------
const initialExpenseCategories = [
    { id: '1', code: 'A_TO_Z_GUARANTEE_CLAIMS', name: '收入-其他收入-买家交易保障索赔额', dataSource: { type: 'system_linkstar', label: '系统拉取 (领星)' }, dataStatus: { isSubjectAssociated: true, isDimensionAssociated: true }, description: '亚马逊买家交易保障索赔', updatedDate: '2024-03-15' },
    { id: '2', code: 'ADJUSTMENTS', name: '支出-调整费用', dataSource: { type: 'system_linkstar', label: '系统拉取 (领星)' }, dataStatus: { isSubjectAssociated: true, isDimensionAssociated: false }, description: '账户调整费用', updatedDate: '2024-03-15' },
    { id: '3', code: 'ADVERTISEMENT_FEE_TOTAL', name: '平台支出-广告费', dataSource: { type: 'system_linkstar', label: '系统拉取 (领星)' }, dataStatus: { isSubjectAssociated: true, isDimensionAssociated: true }, description: '平台广告投放总费用', updatedDate: '2024-03-15' },
    { id: '4', code: 'FBA_STORAGE_FEE', name: '支出-仓储费-FBA仓储', dataSource: { type: 'system_linkstar', label: '系统拉取 (领星)' }, dataStatus: { isSubjectAssociated: true, isDimensionAssociated: true }, description: 'FBA仓储费用', updatedDate: '2024-03-15' },
    { id: '5', code: 'FBA_LONG_TERM_STORAGE', name: '支出-仓储费-长期仓储', dataSource: { type: 'system_linkstar', label: '系统拉取 (领星)' }, dataStatus: { isSubjectAssociated: true, isDimensionAssociated: true }, description: 'FBA长期仓储费用', updatedDate: '2024-03-15' },
    { id: '6', code: 'FBA_REMOVAL_ORDER', name: '支出-仓储费-移除订单', dataSource: { type: 'system_linkstar', label: '系统拉取 (领星)' }, dataStatus: { isSubjectAssociated: true, isDimensionAssociated: false }, description: 'FBA移除订单费用', updatedDate: '2024-03-15' },
    { id: '7', code: 'FBA_DISPOSAL_ORDER', name: '支出-仓储费-弃置订单', dataSource: { type: 'system_linkstar', label: '系统拉取 (领星)' }, dataStatus: { isSubjectAssociated: true, isDimensionAssociated: false }, description: 'FBA弃置订单费用', updatedDate: '2024-03-15' },
    { id: '8', code: 'FBA_TRANSFERS', name: '支出-物流费-库存转移', dataSource: { type: 'system_linkstar', label: '系统拉取 (领星)' }, dataStatus: { isSubjectAssociated: true, isDimensionAssociated: true }, description: 'FBA库存转移费用', updatedDate: '2024-03-15' },
    { id: '9', code: 'FBA_CUSTOMER_RETURN', name: '支出-退货费-客户退货', dataSource: { type: 'system_linkstar', label: '系统拉取 (领星)' }, dataStatus: { isSubjectAssociated: true, isDimensionAssociated: true }, description: 'FBA客户退货处理费', updatedDate: '2024-03-15' },
    { id: '10', code: 'REFERRAL_FEE', name: '支出-平台佣金-推荐费', dataSource: { type: 'system_linkstar', label: '系统拉取 (领星)' }, dataStatus: { isSubjectAssociated: true, isDimensionAssociated: true }, description: '平台推荐佣金', updatedDate: '2024-03-15' },
    { id: '11', code: 'TOTAL_SALES_AMOUNT', name: '收入-商品销售收入', dataSource: { type: 'system_linkstar', label: '系统拉取 (领星)' }, dataStatus: { isSubjectAssociated: true, isDimensionAssociated: true }, description: '商品销售总收入', updatedDate: '2024-03-15' },
    { id: '12', code: 'CHARGEBACK', name: '支出-坏账-拒付费用', dataSource: { type: 'system_linkstar', label: '系统拉取 (领星)' }, dataStatus: { isSubjectAssociated: true, isDimensionAssociated: false }, description: '买家拒付费用', updatedDate: '2024-03-15' },
    { id: '13', code: 'SUBSCRIPTION_FEE', name: '支出-平台费-订阅费', dataSource: { type: 'system_linkstar', label: '系统拉取 (领星)' }, dataStatus: { isSubjectAssociated: true, isDimensionAssociated: true }, description: '平台订阅费用', updatedDate: '2024-03-15' },
    { id: '14', code: 'SPONSORED_PRODUCTS', name: '支出-广告费-商品推广', dataSource: { type: 'system_linkstar', label: '系统拉取 (领星)' }, dataStatus: { isSubjectAssociated: true, isDimensionAssociated: true }, description: '商品推广广告费', updatedDate: '2024-03-15' },
    { id: '15', code: 'EXHIBITION_FEE', name: '支出-营销费-参展费', dataSource: { type: 'manual', label: '人工维护 (Lyn)' }, dataStatus: { isSubjectAssociated: true, isDimensionAssociated: false }, description: '贸易展会参展费用', updatedDate: '2024-03-15' },
    { id: '16', code: 'FBA_FULFILLMENT_FEE', name: '支出-物流费-FBA履约', dataSource: { type: 'system_linkstar', label: '系统拉取 (领星)' }, dataStatus: { isSubjectAssociated: true, isDimensionAssociated: true }, description: 'FBA履约配送费', updatedDate: '2024-03-15' },
    { id: '17', code: 'FBA_INBOUND_TRANSPORT', name: '支出-物流费-入库运输', dataSource: { type: 'system_linkstar', label: '系统拉取 (领星)' }, dataStatus: { isSubjectAssociated: true, isDimensionAssociated: true }, description: 'FBA入库运输费', updatedDate: '2024-03-15' },
    { id: '18', code: 'SPONSORED_BRANDS', name: '支出-广告费-品牌推广', dataSource: { type: 'system_linkstar', label: '系统拉取 (领星)' }, dataStatus: { isSubjectAssociated: true, isDimensionAssociated: true }, description: '品牌推广广告费', updatedDate: '2024-03-15' },
    { id: '19', code: 'SPONSORED_DISPLAY', name: '支出-广告费-展示广告', dataSource: { type: 'system_linkstar', label: '系统拉取 (领星)' }, dataStatus: { isSubjectAssociated: true, isDimensionAssociated: true }, description: '展示广告费用', updatedDate: '2024-03-15' },
    { id: '20', code: 'PROMOTION_DISCOUNT', name: '支出-促销费-折扣', dataSource: { type: 'system_linkstar', label: '系统拉取 (领星)' }, dataStatus: { isSubjectAssociated: true, isDimensionAssociated: true }, description: '促销折扣费用', updatedDate: '2024-03-15' },
    { id: '21', code: 'AMAZON_DISCOUNT', name: '支出-促销费-亚马逊折扣', dataSource: { type: 'system_linkstar', label: '系统拉取 (领星)' }, dataStatus: { isSubjectAssociated: true, isDimensionAssociated: true }, description: '亚马逊平台折扣', updatedDate: '2024-03-15' },
    { id: '22', code: 'OTHER_FEE', name: '支出-其他费用', dataSource: { type: 'system_linkstar', label: '系统拉取 (领星)' }, dataStatus: { isSubjectAssociated: false, isDimensionAssociated: false }, description: '平台其他杂项费用', updatedDate: '2024-03-15' },
    { id: '23', code: 'OFF_SITE_ADS', name: '支出-广告费-站外广告', dataSource: { type: 'system_linkstar', label: '系统拉取 (领星)' }, dataStatus: { isSubjectAssociated: true, isDimensionAssociated: true }, description: '站外广告投流费用', updatedDate: '2024-03-15' },
    { id: '24', code: 'OFF_SITE_ADS_TRAFFIC', name: '支出-广告费-站外流量', dataSource: { type: 'system_linkstar', label: '系统拉取 (领星)' }, dataStatus: { isSubjectAssociated: true, isDimensionAssociated: true }, description: '站外广告投流费用', updatedDate: '2024-03-15' },
    { id: '25', code: 'OTHER_MARKETING', name: '支出-营销费-其他营销', dataSource: { type: 'manual', label: '人工维护 (Lyn)' }, dataStatus: { isSubjectAssociated: true, isDimensionAssociated: false }, description: '其他营销活动费用', updatedDate: '2024-03-15' },
    { id: '26', code: 'BRAND_ACTIVITY', name: '支出-营销费-品牌活动', dataSource: { type: 'manual', label: '人工维护 (Lyn)' }, dataStatus: { isSubjectAssociated: true, isDimensionAssociated: false }, description: '品牌活动费用', updatedDate: '2024-03-15' },
    { id: '27', code: 'BRAND_MARKETING', name: '支出-营销费-品牌营销', dataSource: { type: 'manual', label: '人工维护 (Lyn)' }, dataStatus: { isSubjectAssociated: true, isDimensionAssociated: false }, description: '品牌营销费用', updatedDate: '2024-03-15' },
    { id: '28', code: 'REVIEW_FEE', name: '支出-推广费-测评费', dataSource: { type: 'manual', label: '人工维护 (Lyn)' }, dataStatus: { isSubjectAssociated: true, isDimensionAssociated: false }, description: '站内测评费用', updatedDate: '2024-03-15' },
    { id: '29', code: 'OFF_SITE_REVIEW', name: '支出-推广费-站外测评', dataSource: { type: 'manual', label: '人工维护 (Lyn)' }, dataStatus: { isSubjectAssociated: true, isDimensionAssociated: false }, description: '站外测评费用', updatedDate: '2024-03-15' },
    { id: '30', code: 'VINE_FEE', name: '支出-推广费-绿标计划', dataSource: { type: 'system_linkstar', label: '系统拉取 (领星)' }, dataStatus: { isSubjectAssociated: true, isDimensionAssociated: true }, description: 'Vine Voice 绿标计划费', updatedDate: '2024-03-15' },
];

// --------------- 左侧树数据 ---------------
const kingdeeTreeData = [
    { id: 'K-6001', label: '6001 主营业务收入', type: 'folder', children: [
            { id: 'K-6001.01', label: '6001.01 商品销售收入', type: 'file', mappedCategoryIds: ['54', '35', '11'] },
            { id: 'K-6001.02', label: '6001.02 其他业务收入', type: 'file', mappedCategoryIds: ['1', '5', '50'] },
        ]},
    { id: 'K-6401', label: '6401 主营业务成本', type: 'folder', children: [
            { id: 'K-6401.01', label: '6401.01 采购成本', type: 'file', mappedCategoryIds: [] },
            { id: 'K-6401.02', label: '6401.02 头程运费', type: 'file', mappedCategoryIds: [] },
        ]},
    { id: 'K-6601', label: '6601 销售费用', type: 'folder', children: [
            { id: 'K-6601.01', label: '6601.01 平台佣金', type: 'file', mappedCategoryIds: ['32', '33'] },
            { id: 'K-6601.02', label: '6601.02 广告宣传费', type: 'file', mappedCategoryIds: ['3', '14', '18', '24', '58'] },
            { id: 'K-6601.03', label: '6601.03 仓储物流费', type: 'file', mappedCategoryIds: ['4', '6', '7', '8', '9', '38', '39', '41', '57'] },
            { id: 'K-6601.04', label: '6601.04 运营杂项', type: 'file', mappedCategoryIds: ['2', '10', '13', '22', '36', '40', '53'] },
        ]},
    { id: 'K-2221', label: '2221 应交税费', type: 'folder', children: [
            { id: 'K-2221.01', label: '2221.01 增值税', type: 'file', mappedCategoryIds: ['30', '31', '42', '43', '56'] },
            { id: 'K-2221.02', label: '2221.02 国际税费', type: 'file', mappedCategoryIds: ['44', '45', '46', '47', '48', '49', '51'] },
        ]},
];

// 用经营口径重排的经营管理视图树（operationTreeData）
const operationTreeData = [
    {
        id: 'COGS',
        label: '主营业务成本',
        type: 'folder',
        children: [
            { id: 'COGS-GOODS', label: '商品销售成本', type: 'file', mappedCategoryIds: [] }, // 暂无（来自进销存/成本核算）
            { id: 'COGS-REVERSAL', label: '销售成本退回', type: 'file', mappedCategoryIds: [] }, // 暂无
            { id: 'COGS-HEADFREIGHT', label: '头程成本', type: 'file', mappedCategoryIds: [] }, // 暂无（跨境头程一般不在平台账单）
        ]
    },


            // 销售费用
            {
                id: 'SE',
                label: '销售费用',
                type: 'folder',
                children: [
                    {
                        id: 'SE-BRAND-PRODUCT',
                        label: '品牌及产品营销费',
                        type: 'folder',
                        children: [
                            { id: 'SE-BRAND', label: '品牌营销费用', type: 'file', mappedCategoryIds: ['27'] }, // 品牌活动费用
                            { id: 'SE-PR', label: '公共关系费用', type: 'file', mappedCategoryIds: [] }, // 暂无
                            { id: 'SE-FAIR', label: '贸易展会费用', type: 'file', mappedCategoryIds: ['15'] }, // 参展会费
                            { id: 'SE-OTHER-MKT', label: '其他营销费用', type: 'file', mappedCategoryIds: ['25'] }, // 其他
                            { id: 'SE-RETAIL-AD', label: '零售广告费用', type: 'file', mappedCategoryIds: ['24'] }, // 站外广告投流费用
                            { id: 'SE-PRODUCT-MKT', label: '产品营销费用', type: 'file', mappedCategoryIds: ['14','18','19','23','58'] },
                            // 站内广告费 / 平台促销活动费 / 站内测评费 / 站外测评费 / Vine
                        ]
                    },
                    {
                        id: 'SE-CHANNEL',
                        label: '商品销售费',
                        type: 'folder',
                        children: [
                            { id: 'SE-RETAIL-CHANNEL', label: '零售渠道费用', type: 'file', mappedCategoryIds: ['32','36','40','10','13','53'] },
                            // FBM平台费 / 运输标签费 / 订阅费 / 承运人装运标签调整费 / 信用卡扣款 / 平台其他费(汇总)
                            { id: 'SE-OTHER-SELL', label: '其他销售费用', type: 'file', mappedCategoryIds: ['2'] }, // Adjustments 调整
                            { id: 'SE-BADDEBT', label: '坏账冲销费用', type: 'file', mappedCategoryIds: ['12'] }, // 买家拒付 Chargebacks（近似）
                            { id: 'SE-DIGITAL', label: '数字营销费用', type: 'file', mappedCategoryIds: ['24'] }, // 站外广告投流费用
                            { id: 'SE-DISTRIBUTOR-FAIR', label: '经销商展会', type: 'file', mappedCategoryIds: [] }, // 暂无
                            { id: 'SE-SAMPLES', label: '销售样品费用', type: 'file', mappedCategoryIds: [] }, // 暂无
                            { id: 'SE-ONPLATFORM', label: '站内营销费用', type: 'file', mappedCategoryIds: ['3','14','19','58'] }, // 平台广告+站内
                            { id: 'SE-PLATFORM-FEE', label: '平台交易费', type: 'file', mappedCategoryIds: ['32','10','36','40','53'] }, // 佣金/标签/订阅/其他
                            { id: 'SE-TRAVEL', label: '差旅住宿费用', type: 'file', mappedCategoryIds: [] }, // 暂无
                            { id: 'SE-ENT', label: '业务招待费', type: 'file', mappedCategoryIds: [] }, // 暂无
                        ]
                    },
                    {
                        id: 'SE-LOGISTICS',
                        label: '物流及仓储费',
                        type: 'folder',
                        children: [
                            { id: 'SE-LOG', label: '物流费用', type: 'file', mappedCategoryIds: ['4','6','8','36'] },
                            // 合作承运费 / AWD处理费?（更接近仓储）/ AWD运输费 / 运输标签费（近似运营运费）
                            { id: 'SE-STORAGE', label: '仓储费', type: 'file', mappedCategoryIds: ['7','38','39','41','57','9'] },
                            // AWD仓储费 / STAR仓储费 / 库存续订 / 胶带费 / FBA仓储费(汇总) / 泡沫包装费
                            { id: 'SE-INS', label: '产品及货物保险费', type: 'file', mappedCategoryIds: [] }, // 暂无
                            { id: 'SE-AFTERSALE', label: '售后服务费', type: 'file', mappedCategoryIds: [] }, // 暂无
                            { id: 'SE-INVENTORY-PNL', label: '库存损益', type: 'file', mappedCategoryIds: [] }, // 暂无
                        ]
                    }
                ]
            },



            // 人力相关
            {
                id: 'DL',
                label: '直接人力成本',
                type: 'file',
                mappedCategoryIds: [] // 来自薪资系统/工时，不在平台账单
            },
            {
                id: 'DL-ALLOC',
                label: '事业部分人力分摊',
                type: 'file',
                mappedCategoryIds: []
            },



            // 待摊费用（期间费用）
            {
                id: 'OPEX',
                label: '待摊费用',
                type: 'folder',
                children: [
                    { id: 'RND', label: '研发费用', type: 'file', mappedCategoryIds: [] },
                    { id: 'GNA', label: '管理费用', type: 'folder', children: [
                            { id: 'GNA-INDIRECT-LABOR', label: '间接人力成本', type: 'file', mappedCategoryIds: [] },
                            { id: 'GNA-RENT', label: '租金和公用事业', type: 'file', mappedCategoryIds: [] },
                            { id: 'GNA-OFFICE', label: '办公用品费用', type: 'file', mappedCategoryIds: [] },
                            { id: 'GNA-DEP', label: '折旧与摊销', type: 'file', mappedCategoryIds: [] },
                            { id: 'GNA-OTHER', label: '其他行政费用', type: 'file', mappedCategoryIds: [] },
                            { id: 'GNA-TAX-SURCHARGE', label: '营业税金及附加', type: 'file', mappedCategoryIds: ['56','30','31'] },
                            // 销售税/市场税（暂归口到“税金及附加”口径）
                            { id: 'GNA-BENEFIT', label: '福利费', type: 'file', mappedCategoryIds: [] },
                            { id: 'GNA-OUTSOURCING', label: '行政支持劳务', type: 'file', mappedCategoryIds: [] },
                            { id: 'GNA-ASSET-INS', label: '财产保险费', type: 'file', mappedCategoryIds: [] },
                            { id: 'GNA-KEYMAN-INS', label: '关键人员保险', type: 'file', mappedCategoryIds: [] },
                            { id: 'GNA-HIRING', label: '招聘费用', type: 'file', mappedCategoryIds: [] },
                            { id: 'GNA-TRAINING', label: '培训费用', type: 'file', mappedCategoryIds: [] },
                            { id: 'GNA-LEGAL', label: '法务及咨询', type: 'file', mappedCategoryIds: [] },
                            { id: 'GNA-TRAVEL', label: '差旅住宿费用', type: 'file', mappedCategoryIds: [] },
                            { id: 'GNA-ENT', label: '业务招待费', type: 'file', mappedCategoryIds: [] },
                        ]},
                ]
            },

            // 财务费用
            { id: 'FIN', label: '财务费用', type: 'file', mappedCategoryIds: [] },


];

// --------------- 工具函数 ---------------
const getAllMappedIds = (node) => {
    let ids = node.mappedCategoryIds || [];
    if (node.children) node.children.forEach(c => { ids = ids.concat(getAllMappedIds(c)); });
    return ids;
};

// --------------- 轻量组件（避免依赖） ---------------
const IconButton = ({ children, onClick, className }) => (
    <button
        onClick={onClick}
        className={cn(
            'inline-flex items-center justify-center h-9 px-3 rounded-md border border-gray-200 text-sm text-gray-700 bg-white hover:bg-gray-50',
            className
        )}
        type="button"
    >
        {children}
    </button>
);

const PrimaryButton = ({ children, onClick, className }) => (
    <button
        onClick={onClick}
        className={cn(
            'inline-flex items-center justify-center h-9 px-3 rounded-md text-sm text-white bg-blue-600 hover:bg-blue-700',
            className
        )}
        type="button"
    >
        {children}
    </button>
);

const Input = (props) => (
    <input
        {...props}
        className={cn(
            'h-9 px-3 rounded-md border border-gray-200 outline-none focus:ring-2 focus:ring-blue-100',
            props.className
        )}
    />
);

const Select = ({ value, onChange, children, className }) => (
    <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
            'h-9 px-3 rounded-md border border-gray-200 bg-white text-sm',
            className
        )}
    >
        {children}
    </select>
);

const Checkbox = ({ checked, onChange }) => (
    <input
        type="checkbox"
        checked={!!checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-gray-300"
    />
);

// 简易分页
const TablePagination = ({
                             currentPage, totalPages, pageSize, totalItems, onPageChange, onPageSizeChange
                         }) => (
    <div className="flex items-center justify-between text-sm text-gray-600">
        <div>共 {totalItems} 条 · 第 {currentPage}/{totalPages || 1} 页</div>
        <div className="flex items-center gap-2">
            <span>每页</span>
            <Select value={String(pageSize)} onChange={(v) => onPageSizeChange(Number(v))}>
                {[10, 20, 50].map(s => <option key={s} value={s}>{s}</option>)}
            </Select>
            <IconButton onClick={() => onPageChange(Math.max(1, currentPage - 1))}>上一页</IconButton>
            <IconButton onClick={() => onPageChange(Math.min(totalPages || 1, currentPage + 1))}>下一页</IconButton>
        </div>
    </div>
);

// 左侧树
const TreeView = ({ data, selectedId, onSelect, level = 0 }) => {
    const [expandedIds, setExpandedIds] = React.useState([]);

    const toggleExpand = (e, id) => {
        e.stopPropagation();
        setExpandedIds((prev) => prev.includes(id) ? prev.filter(i => i !== id) : prev.concat(id));
    };

    return (
        <div className="flex flex-col select-none">
            {data.map(node => {
                const isExpanded = expandedIds.includes(node.id);
                const hasChildren = node.children && node.children.length > 0;
                const isSelected = selectedId === node.id;

                return (
                    <div key={node.id}>
                        <div
                            className={cn(
                                "flex items-center py-1.5 px-2 cursor-pointer hover:bg-gray-100 rounded-sm transition-colors text-sm",
                                isSelected && "bg-blue-50 text-blue-700 font-medium hover:bg-blue-50",
                                level > 0 && "ml-4"
                            )}
                            onClick={() => onSelect(node)}
                        >
                            <div
                                className={cn(
                                    "mr-1.5 p-0.5 rounded-sm hover:bg-gray-200 text-gray-400",
                                    !hasChildren && "opacity-0 pointer-events-none"
                                )}
                                onClick={(e) => hasChildren && toggleExpand(e, node.id)}
                            >
                                {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                            </div>

                            {node.type === 'folder'
                                ? (isExpanded ? <FolderOpen className="w-4 h-4 text-yellow-500 mr-2" /> : <Folder className="w-4 h-4 text-yellow-500 mr-2" />)
                                : <FileText className="w-4 h-4 text-gray-400 mr-2" />
                            }

                            <span className="truncate">{node.label}</span>
                        </div>

                        {hasChildren && isExpanded && (
                            <TreeView
                                data={node.children}
                                selectedId={selectedId}
                                onSelect={onSelect}
                                level={level + 1}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

// --------------- 页面主体 ---------------
function ExpenseCategoryManagement() {
    const [expenseCategories] = React.useState(initialExpenseCategories);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [selectedRows, setSelectedRows] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);
    const [sourceFilter, setSourceFilter] = React.useState('all');

    // “Tab” 用原生按钮模拟
    const [activeTab, setActiveTab] = React.useState('kingdee');
    const [selectedTreeNode, setSelectedTreeNode] = React.useState(null);

    const filteredData = React.useMemo(() => {
        return expenseCategories.filter((item) => {
            const q = searchQuery.toLowerCase();
            const matchesSearch =
                item.code.toLowerCase().includes(q) ||
                item.name.toLowerCase().includes(q) ||
                item.description.toLowerCase().includes(q);

            const matchesSource = sourceFilter === 'all' || item.dataSource.type === sourceFilter;

            let matchesTree = true;
            if (selectedTreeNode) {
                const allowed = getAllMappedIds(selectedTreeNode);
                matchesTree = allowed.length > 0 ? allowed.includes(item.id) : false;
            }

            return matchesSearch && matchesSource && matchesTree;
        });
    }, [expenseCategories, searchQuery, sourceFilter, selectedTreeNode]);

    const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
    const startIndex = (currentPage - 1) * pageSize;
    const currentData = filteredData.slice(startIndex, startIndex + pageSize);

    const handleSelectAll = (checked) => {
        if (checked) setSelectedRows(currentData.map(i => i.id));
        else setSelectedRows([]);
    };

    const handleSelectRow = (id, checked) => {
        if (checked) setSelectedRows((prev) => prev.concat(id));
        else setSelectedRows((prev) => prev.filter(v => v !== id));
    };

    const handlePageChange = (p) => {
        setCurrentPage(p);
        setSelectedRows([]);
    };

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-gray-50/50">
            {/* 顶部标题 */}
            <div className="bg-white border-b border-gray-200 px-8 py-6 pb-0">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">预算费用类别管理</h1>
                        <p className="text-gray-500 mt-1">管理预算系统中的费用类别、编码及数据来源映射关系</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <IconButton><Upload className="w-4 h-4 mr-2" />导入</IconButton>
                        <IconButton><Download className="w-4 h-4 mr-2" />导出</IconButton>
                        <PrimaryButton><Plus className="w-4 h-4 mr-2" />新增类别</PrimaryButton>
                    </div>
                </div>

                {/* 伪 Tabs */}
                <div className="flex items-center mb-4">
                    <div className="inline-flex border border-gray-200 rounded-lg p-1 bg-white">
                        <button
                            className={cn(
                                'px-4 py-2 text-sm rounded-md',
                                activeTab === 'kingdee' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'
                            )}
                            onClick={() => { setActiveTab('kingdee'); setSelectedTreeNode(null); setCurrentPage(1); }}
                            type="button"
                        >
              <span className="inline-flex items-center gap-2">
                <Layers className="w-4 h-4" /> 金蝶科目视图
              </span>
                        </button>
                        <button
                            className={cn(
                                'px-4 py-2 text-sm rounded-md',
                                activeTab === 'operation' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'
                            )}
                            onClick={() => { setActiveTab('operation'); setSelectedTreeNode(null); setCurrentPage(1); }}
                            type="button"
                        >
              <span className="inline-flex items-center gap-2">
                <Calculator className="w-4 h-4" /> 经营管理视图
              </span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-hidden flex">
                {/* 左侧树 */}
                <div className="w-[280px] flex-shrink-0 bg-white border-r border-gray-200 flex flex-col">
                    <div className="p-4 border-b border-gray-100">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                            <Input placeholder="搜索节点..." className="pl-8 h-9 text-sm bg-gray-50 border-gray-200" />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2">
                        {activeTab === 'kingdee' && (
                            <TreeView
                                data={kingdeeTreeData}
                                selectedId={selectedTreeNode?.id || null}
                                onSelect={setSelectedTreeNode}
                            />
                        )}
                        {activeTab === 'operation' && (
                            <TreeView
                                data={operationTreeData}
                                selectedId={selectedTreeNode?.id || null}
                                onSelect={setSelectedTreeNode}
                            />
                        )}
                    </div>
                    <div className="p-3 bg-gray-50 text-xs text-gray-400 text-center border-t border-gray-100">
                        {activeTab === 'kingdee' ? '已同步金蝶会计科目表 2024-Q1' : '经营管理维度标准 v2.0'}
                    </div>
                </div>

                {/* 右侧表格区 */}
                <div className="flex-1 flex flex-col overflow-hidden bg-gray-50/50">
                    {/* 筛选栏 */}
                    <div className="px-8 py-4 bg-white border-b border-gray-200 flex items-center gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="在此节点下搜索类别编码、名称..."
                                className="pl-10 bg-gray-50 border-gray-200"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <Select value={sourceFilter} onChange={setSourceFilter} className="w-[200px]">
                            <option value="all">全部来源</option>
                            <option value="manual">人工维护 (Lyn)</option>
                            <option value="system_linkstar">系统拉取 (领星)</option>
                            <option value="system_kingdee">系统拉取 (金蝶)</option>
                        </Select>

                        <div className="ml-auto text-sm text-gray-500">
                            已显示 <span className="font-medium text-gray-900">{filteredData.length}</span> 条数据
                            {selectedTreeNode && (
                                <span className="ml-2 px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs">
                  当前节点: {selectedTreeNode.label}
                </span>
                            )}
                        </div>
                    </div>

                    {/* 表格 */}
                    <div className="flex-1 overflow-auto p-8">
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                            <table className="w-full text-sm min-w-[1200px]">
                                <thead className="bg-gray-50">
                                <tr className="text-left">
                                    <th className="w-12 px-3 py-2"><Checkbox
                                        checked={currentData.length > 0 && selectedRows.length === currentData.length}
                                        onChange={handleSelectAll}
                                    /></th>
                                    <th className="min-w-[180px] px-3 py-2 whitespace-nowrap">预算类别编码</th>
                                    <th className="min-w-[240px] px-3 py-2 whitespace-nowrap">预算类别名称</th>
                                    <th className="w-[180px] px-3 py-2 whitespace-nowrap">数据来源</th>
                                    <th className="w-[200px] px-3 py-2 whitespace-nowrap">数据状态</th>
                                    <th className="min-w-[200px] px-3 py-2 whitespace-nowrap">描述</th>
                                    <th className="w-[140px] px-3 py-2 whitespace-nowrap">更新日期</th>
                                    <th className="w-[50px] px-3 py-2"></th>
                                </tr>
                                </thead>
                                <tbody>
                                {currentData.length > 0 ? currentData.map((category) => (
                                    <tr key={category.id} className="border-t hover:bg-gray-50">
                                        <td className="px-3 py-2">
                                            <Checkbox
                                                checked={selectedRows.includes(category.id)}
                                                onChange={(checked) => handleSelectRow(category.id, checked)}
                                            />
                                        </td>
                                        <td className="px-3 py-2">
                                            <div className="flex items-center gap-2">
                                                <Tag className="w-4 h-4 text-gray-400" />
                                                <span className="font-medium text-gray-900 font-mono text-sm">{category.code}</span>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 text-gray-900">{category.name}</td>
                                        <td className="px-3 py-2">
                        <span className={cn(
                            'inline-flex items-center rounded border px-2 py-0.5',
                            category.dataSource.type === 'manual'
                                ? 'bg-orange-50 text-orange-700 border-orange-200'
                                : 'bg-blue-50 text-blue-700 border-blue-200'
                        )}>
                          {category.dataSource.type === 'manual'
                              ? <User className="w-3 h-3 mr-1" />
                              : <Database className="w-3 h-3 mr-1" />
                          }
                            {category.dataSource.label}
                        </span>
                                        </td>
                                        <td className="px-3 py-2">
                                            <div className="flex flex-wrap gap-2">
                          <span className={cn(
                              'inline-flex items-center rounded border px-2 py-0.5 text-xs',
                              category.dataStatus.isSubjectAssociated
                                  ? 'bg-green-50 text-green-700 border-green-200'
                                  : 'bg-gray-50 text-gray-400 border-gray-200 border-dashed'
                          )}>
                            {category.dataStatus.isSubjectAssociated ? '已关联科目' : '未关联科目'}
                          </span>
                                                <span className={cn(
                                                    'inline-flex items-center rounded border px-2 py-0.5 text-xs',
                                                    category.dataStatus.isDimensionAssociated
                                                        ? 'bg-purple-50 text-purple-700 border-purple-200'
                                                        : 'bg-gray-50 text-gray-400 border-gray-200 border-dashed'
                                                )}>
                            {category.dataStatus.isDimensionAssociated ? '已关联维度' : '未关联维度'}
                          </span>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2">
                        <span className="text-gray-500 text-sm truncate max-w-[260px] block" title={category.description}>
                          {category.description || '-'}
                        </span>
                                        </td>
                                        <td className="px-3 py-2 text-gray-500 text-sm">{category.updatedDate}</td>
                                        <td className="px-3 py-2">
                                            <IconButton className="h-8 px-2 text-gray-400 hover:text-gray-600">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </IconButton>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={8} className="h-24 text-center text-gray-500">
                                            {selectedTreeNode ? '该节点下暂无关联的费用类别' : '没有找到匹配的费用类别'}
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4">
                            <TablePagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                pageSize={pageSize}
                                totalItems={filteredData.length}
                                onPageChange={handlePageChange}
                                onPageSizeChange={setPageSize}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// 默认导出
export default function ExpenseCategoryPage() {
    return <ExpenseCategoryManagement />;
}
