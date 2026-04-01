// src/pages/AnnouncementsPage.js
// 公告列表页
import React, { useState, useMemo } from 'react';
import {
    Search,
    Filter,
    Calendar,
    User,
    Tag,
    ChevronLeft,
    ChevronRight,
    FileText,
    Megaphone,
    AlertCircle,
    Bell,
    Eye
} from 'lucide-react';

const cn = (...args) => args.filter(Boolean).join(' ');

// --------------- Mock 公告数据（扩展版）---------------
const mockAnnouncements = [
    {
        id: 1,
        title: '关于2024年度预算调整的通知',
        type: 'urgent',
        date: '2024-03-20',
        author: '财务部',
        department: '财务部',
        content: `
            <h3>一、调整背景</h3>
            <p>根据公司2024年第一季度经营情况分析，为适应市场变化，优化资源配置，经管理层研究决定，对2024年度预算进行部分调整。</p>
            
            <h3>二、调整内容</h3>
            <p>1. 营销费用预算增加15%，主要用于Q2季度品牌推广活动；</p>
            <p>2. 研发费用预算增加10%，加大新产品研发投入；</p>
            <p>3. 行政费用预算压缩8%，提倡节约办公；</p>
            <p>4. 各部门请于3月25日前提交调整后的预算方案。</p>
            
            <h3>三、执行要求</h3>
            <p>各部门要高度重视预算调整工作，严格按照公司预算管理制度执行，确保预算调整科学合理、操作规范有序。</p>
            
            <p>特此通知。</p>
        `,
        coverImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=400&fit=crop',
        attachments: [
            { name: '2024年度预算调整方案.pdf', size: '2.3 MB' },
            { name: '预算调整申请表.docx', size: '156 KB' }
        ],
        views: 328,
        readCount: 245,
        isRead: false
    },
    {
        id: 2,
        title: '新供应商准入流程上线说明',
        type: 'normal',
        date: '2024-03-18',
        author: '采购部',
        department: '采购部',
        content: `
            <h3>一、上线背景</h3>
            <p>为进一步规范供应商管理，提升采购效率，公司自研的供应商准入流程已于今日正式上线运行。</p>
            
            <h3>二、新流程亮点</h3>
            <p>1. <strong>在线申请</strong>：供应商可通过系统提交准入申请，无需线下提交纸质材料；</p>
            <p>2. <strong>智能审核</strong>：系统自动校验资质文件，减少人工审核工作量；</p>
            <p>3. <strong>进度透明</strong>：申请方可实时查看审核进度，及时补充材料；</p>
            <p>4. <strong>数据沉淀</strong>：所有供应商信息自动归档，便于后续管理分析。</p>
            
            <h3>三、操作指南</h3>
            <p>详细的操作说明请参考附件《供应商准入系统操作手册》。</p>
            
            <h3>四、培训安排</h3>
            <p>本周五下午14:00将进行系统操作培训，请各相关部门派人参训。</p>
        `,
        coverImage: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=400&fit=crop',
        attachments: [
            { name: '供应商准入系统操作手册.pdf', size: '5.8 MB' }
        ],
        views: 256,
        readCount: 198,
        isRead: true
    },
    {
        id: 3,
        title: 'Q1季度经营分析报告发布',
        type: 'normal',
        date: '2024-03-15',
        author: '经管部',
        department: '经管部',
        content: `
            <h3>一、总体经营情况</h3>
            <p>2024年第一季度，公司整体经营稳中向好，主要指标完成情况如下：</p>
            <p>• 营业收入：完成年度目标的28.5%，同比增长15.2%</p>
            <p>• 净利润：完成年度目标的31.0%，同比增长22.8%</p>
            <p>• 回款率：95.3%，较去年同期提升3.2个百分点</p>
            
            <h3>二、各事业部业绩</h3>
            <p>美国事业部：超额完成季度目标，销售额同比增长18%；</p>
            <p>中国事业部：达成率98%，新品上市表现亮眼；</p>
            <p>东南亚事业部：快速增长期，销售额同比增长35%。</p>
            
            <h3>三、下季度重点工作</h3>
            <p>1. 继续深化海外市场拓展；</p>
            <p>2. 推进供应链数字化转型；</p>
            <p>3. 加强成本管控，提升盈利能力。</p>
        `,
        coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
        attachments: [
            { name: 'Q1经营分析报告.pdf', size: '8.2 MB' },
            { name: '事业部业绩明细.xlsx', size: '1.5 MB' }
        ],
        views: 412,
        readCount: 380,
        isRead: false
    },
    {
        id: 4,
        title: '系统升级维护通知（3月25日）',
        type: 'warning',
        date: '2024-03-12',
        author: 'IT部',
        department: 'IT部',
        content: `
            <h3>一、维护时间</h3>
            <p>2024年3月25日（周一）凌晨 00:00 - 06:00</p>
            
            <h3>二、维护内容</h3>
            <p>1. 服务器安全补丁更新；</p>
            <p>2. 数据库性能优化；</p>
            <p>3. 系统功能模块升级；</p>
            <p>4. 数据备份与清理。</p>
            
            <h3>三、影响范围</h3>
            <p>维护期间，以下系统将暂停服务：</p>
            <p>• EPoseidon 2.0 主系统</p>
            <p>• 供应商门户</p>
            <p>• 数据报表平台</p>
            
            <h3>四、注意事项</h3>
            <p>1. 请提前做好数据保存工作；</p>
            <p>2. 维护期间请勿进行重要操作；</p>
            <p>3. 如有紧急情况，请联系IT值班人员。</p>
        `,
        coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop',
        attachments: [],
        views: 567,
        readCount: 523,
        isRead: true
    },
    {
        id: 5,
        title: '关于启用新的费用报销标准的通知',
        type: 'normal',
        date: '2024-03-10',
        author: '财务部',
        department: '财务部',
        content: `
            <h3>一、调整说明</h3>
            <p>为进一步规范公司费用管理，结合市场行情及公司实际情况，经研究决定，自2024年4月1日起启用新的费用报销标准。</p>
            
            <h3>二、主要调整内容</h3>
            <p><strong>差旅费：</strong></p>
            <p>• 一线城市住宿标准：由500元/晚调整至550元/晚</p>
            <p>• 二线城市住宿标准：由350元/晚调整至400元/晚</p>
            <p>• 飞机票：经济舱标准不变，增加高铁一等座报销选项</p>
            
            <p><strong>餐费补贴：</strong></p>
            <p>• 一线城市：由150元/天调整至180元/天</p>
            <p>• 其他城市：由120元/天调整至150元/天</p>
            
            <h3>三、执行时间</h3>
            <p>2024年4月1日起执行，4月1日前发生的费用按原标准执行。</p>
        `,
        coverImage: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&h=400&fit=crop',
        attachments: [
            { name: '2024费用报销标准.pdf', size: '1.2 MB' }
        ],
        views: 298,
        readCount: 267,
        isRead: false
    },
    {
        id: 6,
        title: '2024年供应商绩效评估启动',
        type: 'normal',
        date: '2024-03-08',
        author: '采购部',
        department: '采购部',
        content: `
            <h3>一、评估目的</h3>
            <p>客观评价供应商合作表现，优化供应商结构，建立长期稳定的战略合作关系。</p>
            
            <h3>二、评估范围</h3>
            <p>2023年1月1日至2023年12月31日期间有业务往来的所有合作供应商。</p>
            
            <h3>三、评估维度</h3>
            <p>1. <strong>质量表现</strong>（30%）：产品合格率、退货率、质量事故</p>
            <p>2. <strong>交付表现</strong>（25%）：准时交付率、交付柔性</p>
            <p>3. <strong>成本竞争力</strong>（20%）：价格水平、降价配合度</p>
            <p>4. <strong>服务配合</strong>（15%）：响应速度、问题解决能力</p>
            <p>5. <strong>合规经营</strong>（10%）：资质完备性、合同履约</p>
            
            <h3>四、时间安排</h3>
            <p>• 3月8日-3月22日：数据收集与初评</p>
            <p>• 3月23日-3月31日：部门复评</p>
            <p>• 4月1日-4月10日：结果公示与申诉</p>
            <p>• 4月15日：最终结果发布</p>
        `,
        coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop',
        attachments: [
            { name: '供应商绩效评估表.xlsx', size: '89 KB' },
            { name: '评分细则说明.pdf', size: '456 KB' }
        ],
        views: 189,
        readCount: 156,
        isRead: true
    },
    {
        id: 7,
        title: '清明节放假通知',
        type: 'normal',
        date: '2024-03-25',
        author: '人力资源部',
        department: '人力资源部',
        content: `
            <h3>一、放假安排</h3>
            <p>根据国家法定节假日安排，2024年清明节放假时间为：</p>
            <p><strong>4月4日（周四）至4月6日（周六）放假，共3天</strong></p>
            <p>4月7日（周日）正常上班。</p>
            
            <h3>二、注意事项</h3>
            <p>1. 请各部门做好节前安全检查，关闭电源、门窗；</p>
            <p>2. 值班人员请按时到岗，保持通讯畅通；</p>
            <p>3. 节日期间注意安全，文明祭扫，绿色出行。</p>
            
            <p>祝大家节日愉快！</p>
        `,
        coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=400&fit=crop',
        attachments: [],
        views: 456,
        readCount: 412,
        isRead: false
    },
    {
        id: 8,
        title: '新产品发布会邀请函',
        type: 'urgent',
        date: '2024-03-22',
        author: '市场部',
        department: '市场部',
        content: `
            <h3>尊敬的各位同事：</h3>
            <p>公司将于近期举办2024春季新品发布会，诚挚邀请您参加！</p>
            
            <h3>活动信息</h3>
            <p><strong>时间：</strong>2024年4月2日 14:00-17:00</p>
            <p><strong>地点：</strong>公司总部3楼大会议室</p>
            <p><strong>参会人员：</strong>各部门负责人、产品经理、销售人员</p>
            
            <h3>议程安排</h3>
            <p>14:00-14:30  签到入场</p>
            <p>14:30-15:00  公司战略及产品规划分享</p>
            <p>15:00-16:30  新品展示与体验</p>
            <p>16:30-17:00  答疑与交流</p>
            
            <h3>温馨提示</h3>
            <p>请提前10分钟到场，如有特殊情况不能参加，请提前告知市场部。</p>
        `,
        coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
        attachments: [
            { name: '发布会邀请函.pdf', size: '3.5 MB' },
            { name: '新品资料预览.pptx', size: '12.8 MB' }
        ],
        views: 234,
        readCount: 189,
        isRead: false
    }
];

// --------------- 类型配置 ---------------
const typeConfig = {
    urgent: { label: '紧急', color: 'bg-red-100 text-red-700 border-red-200', icon: AlertCircle },
    warning: { label: '通知', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Bell },
    normal: { label: '公告', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Megaphone }
};

// --------------- 部门选项 ---------------
const departments = ['全部部门', '财务部', '采购部', '经管部', 'IT部', '人力资源部', '市场部'];

// --------------- UI 组件 ---------------
const Badge = ({ type }) => {
    const config = typeConfig[type] || typeConfig.normal;
    const Icon = config.icon;
    return (
        <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border', config.color)}>
            <Icon className="w-3 h-3" />
            {config.label}
        </span>
    );
};

export default function AnnouncementsPage({ onOpenDetail }) {
    // 搜索和筛选状态
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('all');
    const [selectedDept, setSelectedDept] = useState('全部部门');
    const [dateRange, setDateRange] = useState('all');
    
    // 分页状态
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    // 筛选逻辑
    const filteredData = useMemo(() => {
        return mockAnnouncements.filter(item => {
            // 搜索筛选
            if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }
            // 类型筛选
            if (selectedType !== 'all' && item.type !== selectedType) {
                return false;
            }
            // 部门筛选
            if (selectedDept !== '全部部门' && item.department !== selectedDept) {
                return false;
            }
            // 日期筛选
            if (dateRange !== 'all') {
                const itemDate = new Date(item.date);
                const now = new Date();
                if (dateRange === 'week') {
                    const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
                    if (itemDate < weekAgo) return false;
                } else if (dateRange === 'month') {
                    const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
                    if (itemDate < monthAgo) return false;
                }
            }
            return true;
        }).sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [searchQuery, selectedType, selectedDept, dateRange]);

    // 分页数据
    const totalPages = Math.ceil(filteredData.length / pageSize);
    const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    // 处理查看详情
    const handleViewDetail = (item) => {
        if (onOpenDetail) {
            onOpenDetail(item);
        }
    };

    // 重置筛选
    const handleReset = () => {
        setSearchQuery('');
        setSelectedType('all');
        setSelectedDept('全部部门');
        setDateRange('all');
        setCurrentPage(1);
    };

    return (
        <div className="h-full flex flex-col">
            {/* 页面标题 */}
            <div className="mb-6">
                <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Megaphone className="w-6 h-6 text-indigo-600" />
                    公司公告
                </h1>
                <p className="text-sm text-gray-500 mt-1">查看公司最新通知、政策及重要事项</p>
            </div>

            {/* 筛选区域 */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
                <div className="flex flex-wrap items-center gap-4">
                    {/* 搜索框 */}
                    <div className="flex-1 min-w-[240px] relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="搜索公告标题..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    {/* 类型筛选 */}
                    <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-gray-400" />
                        <select
                            value={selectedType}
                            onChange={(e) => {
                                setSelectedType(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="all">全部类型</option>
                            <option value="urgent">紧急</option>
                            <option value="warning">通知</option>
                            <option value="normal">公告</option>
                        </select>
                    </div>

                    {/* 部门筛选 */}
                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <select
                            value={selectedDept}
                            onChange={(e) => {
                                setSelectedDept(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            {departments.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>

                    {/* 日期筛选 */}
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <select
                            value={dateRange}
                            onChange={(e) => {
                                setDateRange(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="all">全部时间</option>
                            <option value="week">近一周</option>
                            <option value="month">近一月</option>
                        </select>
                    </div>

                    {/* 重置按钮 */}
                    <button
                        onClick={handleReset}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        重置
                    </button>
                </div>
            </div>

            {/* 列表区域 */}
            <div className="flex-1 bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col">
                {/* 表头 */}
                <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 grid grid-cols-12 gap-4 text-xs font-medium text-gray-500">
                    <div className="col-span-5">公告标题</div>
                    <div className="col-span-2">类型</div>
                    <div className="col-span-2">发布部门</div>
                    <div className="col-span-2">发布时间</div>
                    <div className="col-span-1 text-center">阅读</div>
                </div>

                {/* 列表内容 */}
                <div className="flex-1 overflow-y-auto">
                    {paginatedData.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                            <FileText className="w-12 h-12 mb-3 opacity-30" />
                            <p className="text-sm">暂无公告</p>
                        </div>
                    ) : (
                        paginatedData.map(item => (
                            <div
                                key={item.id}
                                onClick={() => handleViewDetail(item)}
                                className="px-6 py-4 border-b border-gray-100 grid grid-cols-12 gap-4 items-center hover:bg-gray-50 cursor-pointer transition-colors group"
                            >
                                <div className="col-span-5">
                                    <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                                        {item.title}
                                    </p>
                                    {item.attachments.length > 0 && (
                                        <p className="text-xs text-gray-400 mt-1">
                                            附件: {item.attachments.length} 个文件
                                        </p>
                                    )}
                                </div>
                                <div className="col-span-2">
                                    <Badge type={item.type} />
                                </div>
                                <div className="col-span-2 text-sm text-gray-600">
                                    {item.department}
                                </div>
                                <div className="col-span-2 text-sm text-gray-500">
                                    {item.date}
                                </div>
                                <div className="col-span-1 flex items-center justify-center gap-1 text-xs text-gray-400">
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>{item.views}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* 分页 */}
                {totalPages > 1 && (
                    <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            共 {filteredData.length} 条公告，第 {currentPage} / {totalPages} 页
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={cn(
                                        'min-w-[32px] h-8 px-2 rounded-lg text-sm font-medium transition-colors',
                                        currentPage === page
                                            ? 'bg-indigo-600 text-white'
                                            : 'border border-gray-200 hover:bg-gray-50 text-gray-700'
                                    )}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
