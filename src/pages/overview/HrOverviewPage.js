// src/pages/overview/HrOverviewPage.js
import React from 'react';
import {
    Users,
    UserCheck,
    Heart,
    Clock,
    TrendingUp,
    TrendingDown,
    UserPlus,
    Award,
    FileCheck,
    UserCircle,
    Briefcase,
    GraduationCap,
    Calendar,
    DollarSign
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';

// ============== Mock 数据 ==============

// 人才库岗位分布
const talentPositionData = [
    { name: '技术', value: 856 },
    { name: '产品', value: 423 },
    { name: '设计', value: 312 },
    { name: '市场', value: 398 },
    { name: '销售', value: 267 },
    { name: '运营', value: 289 },
    { name: '财务', value: 156 },
    { name: '人事', value: 155 }
];

// 人才库学历分布
const talentEducationData = [
    { name: '博士', value: 86 },
    { name: '研究生', value: 428 },
    { name: '本科', value: 1428 },
    { name: '大专', value: 685 },
    { name: '其他', value: 229 }
];

// 人才库年龄分布
const talentAgeData = [
    { name: '20-25岁', value: 856 },
    { name: '26-30岁', value: 1142 },
    { name: '31-35岁', value: 571 },
    { name: '36-40岁', value: 214 },
    { name: '40岁+', value: 73 }
];

// 人才库期望薪资分布
const talentSalaryData = [
    { name: '5K以下', value: 285 },
    { name: '5-10K', value: 571 },
    { name: '10-15K', value: 714 },
    { name: '15-20K', value: 571 },
    { name: '20-30K', value: 428 },
    { name: '30K+', value: 287 }
];

// 在职员工岗位分布
const activePositionData = [
    { name: '技术', value: 356 },
    { name: '产品', value: 168 },
    { name: '设计', value: 124 },
    { name: '市场', value: 156 },
    { name: '销售', value: 198 },
    { name: '运营', value: 89 },
    { name: '财务', value: 45 },
    { name: '人事', value: 38 },
    { name: '其他', value: 12 }
];

// 在职员工学历分布
const activeEducationData = [
    { name: '博士', value: 28 },
    { name: '研究生', value: 186 },
    { name: '本科', value: 628 },
    { name: '大专', value: 298 },
    { name: '其他', value: 46 }
];

// 在职员工年龄分布
const activeAgeData = [
    { name: '20-25岁', value: 256 },
    { name: '26-30岁', value: 486 },
    { name: '31-35岁', value: 298 },
    { name: '36-40岁', value: 112 },
    { name: '40岁+', value: 34 }
];

// 在职员工薪资分布
const activeSalaryData = [
    { name: '5K以下', value: 45 },
    { name: '5-10K', value: 186 },
    { name: '10-15K', value: 356 },
    { name: '15-20K', value: 312 },
    { name: '20-30K', value: 198 },
    { name: '30K+', value: 89 }
];

// 最新动态
const recentActivities = [
    { type: 'promotion', title: '张三 晋升为 高级产品经理', dept: '产品部', time: '2小时前', icon: Award, color: 'bg-purple-100 text-purple-600' },
    { type: 'entry', title: '李四 入职 技术部', dept: '技术部', time: '昨天', icon: UserPlus, color: 'bg-green-100 text-green-600' },
    { type: 'regular', title: '王五 转正通过', dept: '市场部', time: '2天前', icon: FileCheck, color: 'bg-blue-100 text-blue-600' },
    { type: 'candidate', title: '新增候选人 赵六', dept: '人才库', time: '3天前', icon: UserCircle, color: 'bg-orange-100 text-orange-600' },
    { type: 'promotion', title: '孙七 晋升为 技术专家', dept: '技术部', time: '3天前', icon: Award, color: 'bg-purple-100 text-purple-600' },
    { type: 'entry', title: '周八 入职 设计部', dept: '设计部', time: '4天前', icon: UserPlus, color: 'bg-green-100 text-green-600' },
    { type: 'candidate', title: '新增候选人 吴九', dept: '人才库', time: '5天前', icon: UserCircle, color: 'bg-orange-100 text-orange-600' },
    { type: 'regular', title: '郑十 转正通过', dept: '销售部', time: '1周前', icon: FileCheck, color: 'bg-blue-100 text-blue-600' }
];

// 颜色配置
const PIE_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

// ============== 组件 ==============

const StatCard = ({ icon: Icon, label, value, subValue, trend, trendUp, color }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm text-gray-500 mb-1">{label}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                {subValue && <p className="text-xs text-gray-400 mt-1">{subValue}</p>}
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
        {trend && (
            <div className="flex items-center gap-1 mt-3">
                {trendUp ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
                    {trend}
                </span>
                <span className="text-xs text-gray-400 ml-1">较上月</span>
            </div>
        )}
    </div>
);

const ChartCard = ({ title, icon: Icon, children, className = '' }) => (
    <div className={`bg-white rounded-xl border border-gray-200 p-4 ${className}`}>
        <div className="flex items-center gap-2 mb-4">
            <Icon className="w-4 h-4 text-gray-500" />
            <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        </div>
        {children}
    </div>
);

const SectionHeader = ({ title, subtitle, color = 'blue' }) => {
    const colorClasses = {
        blue: 'bg-blue-500',
        green: 'bg-green-500',
        purple: 'bg-purple-500'
    };
    return (
        <div className="flex items-center gap-3 mb-4">
            <div className={`w-1.5 h-6 rounded-full ${colorClasses[color]}`} />
            <div>
                <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
                {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
            </div>
        </div>
    );
};

const ActivityItem = ({ activity }) => {
    const Icon = activity.icon;
    return (
        <div className="flex items-start gap-3 pb-4 last:pb-0 border-l-2 border-gray-200 ml-2 pl-4 relative">
            <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full ${activity.color} flex items-center justify-center`}>
                <Icon className="w-2.5 h-2.5 text-white" />
            </div>
            <div className="flex-1 -mt-1">
                <p className="text-sm text-gray-800 font-medium">{activity.title}</p>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">{activity.dept}</span>
                    <span className="text-xs text-gray-400">·</span>
                    <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
            </div>
        </div>
    );
};

export default function HrOverviewPage() {
    return (
        <div className="h-full flex flex-col bg-gray-50 overflow-auto">
            {/* 标题区 */}
            <div className="bg-white border-b px-6 py-4 sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-rose-50 rounded-lg flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-rose-600" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold text-gray-800">人力资源概览</h1>
                        <p className="text-sm text-gray-500">人事业务总览与管理入口</p>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* 卡片区域 */}
                <div className="grid grid-cols-4 gap-4">
                    <StatCard
                        icon={Users}
                        label="人才库总数"
                        value="2,856"
                        subValue="活跃候选人"
                        trend="+12.5%"
                        trendUp={true}
                        color="bg-blue-50 text-blue-600"
                    />
                    <StatCard
                        icon={UserCheck}
                        label="在职员工数"
                        value="1,186"
                        subValue="正式员工 1,142 人"
                        trend="+3.2%"
                        trendUp={true}
                        color="bg-green-50 text-green-600"
                    />
                    <StatCard
                        icon={Heart}
                        label="员工满意度"
                        value="4.5"
                        subValue="满分 5.0"
                        trend="+0.3"
                        trendUp={true}
                        color="bg-rose-50 text-rose-600"
                    />
                    <StatCard
                        icon={Clock}
                        label="平均招聘时间"
                        value="18天"
                        subValue="目标 ≤ 21 天"
                        trend="-2天"
                        trendUp={true}
                        color="bg-amber-50 text-amber-600"
                    />
                </div>

                {/* 两栏：人才库概览 + 在职员工概览 */}
                <div className="grid grid-cols-2 gap-6">
                    {/* 人才库概览 */}
                    <div className="space-y-4">
                        <SectionHeader
                            title="人才库概览"
                            subtitle="本月新增 45 人 · 面试成功率 32%"
                            color="blue"
                        />

                        {/* 关键指标 */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-blue-50 rounded-lg p-3">
                                <div className="flex items-center gap-2 text-blue-700">
                                    <UserPlus className="w-4 h-4" />
                                    <span className="text-sm font-medium">本月新增</span>
                                </div>
                                <p className="text-2xl font-bold text-blue-900 mt-1">45人</p>
                                <p className="text-xs text-blue-600 mt-0.5">↑ 较上月 +8</p>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-3">
                                <div className="flex items-center gap-2 text-blue-700">
                                    <TrendingUp className="w-4 h-4" />
                                    <span className="text-sm font-medium">面试成功率</span>
                                </div>
                                <p className="text-2xl font-bold text-blue-900 mt-1">32%</p>
                                <p className="text-xs text-blue-600 mt-0.5">↑ 较上月 +5%</p>
                            </div>
                        </div>

                        {/* 图表区域 */}
                        <div className="grid grid-cols-2 gap-3">
                            {/* 岗位分布 */}
                            <ChartCard title="岗位分布" icon={Briefcase}>
                                <div className="h-32">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={talentPositionData} layout="vertical" margin={{ left: 0, right: 10, top: 0, bottom: 0 }}>
                                            <XAxis type="number" hide />
                                            <YAxis dataKey="name" type="category" width={40} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                                            <Tooltip contentStyle={{ fontSize: 12, padding: '4px 8px' }} />
                                            <Bar dataKey="value" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={12} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </ChartCard>

                            {/* 学历分布 */}
                            <ChartCard title="学历分布" icon={GraduationCap}>
                                <div className="h-32">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={talentEducationData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={25}
                                                outerRadius={45}
                                                paddingAngle={2}
                                                dataKey="value"
                                            >
                                                {talentEducationData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={{ fontSize: 12, padding: '4px 8px' }} />
                                            <Legend verticalAlign="bottom" height={20} iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </ChartCard>

                            {/* 年龄分布 */}
                            <ChartCard title="年龄分布" icon={Calendar}>
                                <div className="h-32">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={talentAgeData} margin={{ left: 0, right: 0, top: 5, bottom: 15 }}>
                                            <XAxis dataKey="name" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} interval={0} />
                                            <YAxis hide />
                                            <Tooltip contentStyle={{ fontSize: 12, padding: '4px 8px' }} />
                                            <Bar dataKey="value" fill="#F59E0B" radius={[4, 4, 0, 0]} barSize={20} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </ChartCard>

                            {/* 期望薪资 */}
                            <ChartCard title="期望薪资分布" icon={DollarSign}>
                                <div className="h-32">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={talentSalaryData} margin={{ left: 0, right: 0, top: 5, bottom: 15 }}>
                                            <XAxis dataKey="name" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} interval={0} />
                                            <YAxis hide />
                                            <Tooltip contentStyle={{ fontSize: 12, padding: '4px 8px' }} />
                                            <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} barSize={20} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </ChartCard>
                        </div>
                    </div>

                    {/* 在职员工概览 */}
                    <div className="space-y-4">
                        <SectionHeader
                            title="在职员工概览"
                            subtitle="本月新增 8 人 · 平均司龄 2.8 年"
                            color="green"
                        />

                        {/* 关键指标 */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-green-50 rounded-lg p-3">
                                <div className="flex items-center gap-2 text-green-700">
                                    <UserPlus className="w-4 h-4" />
                                    <span className="text-sm font-medium">本月新增</span>
                                </div>
                                <p className="text-2xl font-bold text-green-900 mt-1">8人</p>
                                <p className="text-xs text-green-600 mt-0.5">↑ 较上月 +3</p>
                            </div>
                            <div className="bg-green-50 rounded-lg p-3">
                                <div className="flex items-center gap-2 text-green-700">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-sm font-medium">平均司龄</span>
                                </div>
                                <p className="text-2xl font-bold text-green-900 mt-1">2.8年</p>
                                <p className="text-xs text-green-600 mt-0.5">↑ 较上月 +0.2</p>
                            </div>
                        </div>

                        {/* 图表区域 */}
                        <div className="grid grid-cols-2 gap-3">
                            {/* 岗位分布 */}
                            <ChartCard title="岗位分布" icon={Briefcase}>
                                <div className="h-32">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={activePositionData} layout="vertical" margin={{ left: 0, right: 10, top: 0, bottom: 0 }}>
                                            <XAxis type="number" hide />
                                            <YAxis dataKey="name" type="category" width={40} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                                            <Tooltip contentStyle={{ fontSize: 12, padding: '4px 8px' }} />
                                            <Bar dataKey="value" fill="#10B981" radius={[0, 4, 4, 0]} barSize={12} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </ChartCard>

                            {/* 学历分布 */}
                            <ChartCard title="学历分布" icon={GraduationCap}>
                                <div className="h-32">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={activeEducationData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={25}
                                                outerRadius={45}
                                                paddingAngle={2}
                                                dataKey="value"
                                            >
                                                {activeEducationData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={{ fontSize: 12, padding: '4px 8px' }} />
                                            <Legend verticalAlign="bottom" height={20} iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </ChartCard>

                            {/* 年龄分布 */}
                            <ChartCard title="年龄分布" icon={Calendar}>
                                <div className="h-32">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={activeAgeData} margin={{ left: 0, right: 0, top: 5, bottom: 15 }}>
                                            <XAxis dataKey="name" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} interval={0} />
                                            <YAxis hide />
                                            <Tooltip contentStyle={{ fontSize: 12, padding: '4px 8px' }} />
                                            <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} barSize={20} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </ChartCard>

                            {/* 薪资分布 */}
                            <ChartCard title="薪资分布" icon={DollarSign}>
                                <div className="h-32">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={activeSalaryData} margin={{ left: 0, right: 0, top: 5, bottom: 15 }}>
                                            <XAxis dataKey="name" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} interval={0} />
                                            <YAxis hide />
                                            <Tooltip contentStyle={{ fontSize: 12, padding: '4px 8px' }} />
                                            <Bar dataKey="value" fill="#EC4899" radius={[4, 4, 0, 0]} barSize={20} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </ChartCard>
                        </div>
                    </div>
                </div>

                {/* 最新动态 */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 rounded-full bg-purple-500" />
                            <h2 className="text-lg font-semibold text-gray-800">最新动态</h2>
                        </div>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                            查看全部
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-0">
                        {recentActivities.map((activity, index) => (
                            <ActivityItem key={index} activity={activity} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
