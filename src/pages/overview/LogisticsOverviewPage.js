// src/pages/overview/LogisticsOverviewPage.js
//
// 物流与报关概览（轻量看板）：
//   数据来源优先级：logisticsService（真实 service）→ fallback。
//   - 4 KPI：物流商 / 渠道 / 申报资料 / HSCode 数量
//   - 中部左：渠道国家覆盖分布（基于真实 channels.list 数据，取 top 5 国家）
//   - 中部右：最近动态 / 风险提醒
//   - 子页导航：物流商 / 渠道 / 仓库地址 / HSCode / 申报资料 / 路由规则 / 集货规则 / 备货试算

import React, { useMemo } from 'react';
import {
  Truck, MapPin, Package, Route, FileText, Layers, Calculator,
  GitMerge, Boxes, ArrowRight, TrendingUp,
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { toast } from '../../components/ui/Toast';
import { logisticsService } from '../../services';

const SUB_ENTRIES = [
  { id: 'vendors',       name: '物流商管理', desc: '物流商档案、资质、审批', icon: Truck,      path: '/logistics/vendors',           tone: 'brand'   },
  { id: 'channels',      name: '物流渠道',   desc: '渠道资费、运力、覆盖范围', icon: Route,      path: '/logistics/channels',          tone: 'success' },
  { id: 'addresses',     name: '仓库地址',   desc: '收发货地址簿与启用状态',   icon: MapPin,     path: '/logistics/addresses',         tone: 'warning' },
  { id: 'hs-codes',      name: 'HSCode',     desc: '海关编码与商品名映射',     icon: FileText,   path: '/logistics/hs-codes',          tone: 'primary' },
  { id: 'declarations',  name: '申报资料',   desc: 'SKU 报关字段与审批',       icon: Layers,     path: '/logistics/declarations',      tone: 'brand'   },
  { id: 'routing',       name: '路由规则',   desc: '渠道选择策略与优先级',     icon: GitMerge,   path: '/logistics/rules/routing',     tone: 'success' },
  { id: 'consolidation', name: '集货规则',   desc: '集货批次与边界条件',       icon: Boxes,      path: '/logistics/rules/consolidation', tone: 'warning' },
  { id: 'trial-calc',    name: '备货试算',   desc: '海运 / 空运 / 海外仓试算',  icon: Calculator, path: '/logistics/trial-calc',        tone: 'danger'  },
];

const TONE_BG = {
  brand:   'bg-brand-50 text-brand-700',
  success: 'bg-success-50 text-success-700',
  warning: 'bg-warning-50 text-warning-700',
  danger:  'bg-danger-50 text-danger-700',
  primary: 'bg-cyan-50 text-cyan-700',
  neutral: 'bg-slate-100 text-slate-700',
};

const COUNTRY_NAME = {
  US: '美国', DE: '德国', GB: '英国', JP: '日本', FR: '法国',
  IT: '意大利', ES: '西班牙', CA: '加拿大', AU: '澳大利亚', SG: '新加坡',
};

const FALLBACK_COUNTRIES = [
  { code: 'US', count: 14 }, { code: 'DE', count: 9 }, { code: 'GB', count: 7 },
  { code: 'JP', count: 5 },  { code: 'FR', count: 4 },
];

function KpiCard({ icon: Icon, label, value, helper, tone = 'brand' }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-text-subtle">{label}</p>
          <p className="mt-2 text-2xl font-bold text-text">{value}</p>
          {helper && <p className="mt-1 text-xs text-text-subtle">{helper}</p>}
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${TONE_BG[tone] || TONE_BG.brand}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}

function CountryBar({ data, total }) {
  if (!total) return <p className="text-sm text-text-subtle">暂无渠道数据</p>;
  return (
    <div className="space-y-3">
      {data.map((row) => {
        const pct = total > 0 ? Math.round((row.count / total) * 100) : 0;
        return (
          <div key={row.code}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-text">{COUNTRY_NAME[row.code] || row.code} ({row.code})</span>
              <span className="text-text-muted">{row.count} 个渠道 · {pct}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-subtle">
              <div className="h-full rounded-full bg-purple-500" style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SubEntryCard({ entry, onNavigate }) {
  const Icon = entry.icon;
  return (
    <Card
      interactive
      onClick={() => onNavigate(entry.path, entry.name)}
      className="group cursor-pointer p-5 transition-shadow hover:shadow-elevated"
    >
      <div className="flex items-start justify-between gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${TONE_BG[entry.tone] || TONE_BG.brand}`}>
          <Icon className="h-5 w-5" />
        </div>
        <ArrowRight className="h-4 w-4 text-text-subtle transition-colors group-hover:text-brand-700" />
      </div>
      <h3 className="mt-3 text-base font-semibold text-text">{entry.name}</h3>
      <p className="mt-1 text-xs text-text-subtle">{entry.desc}</p>
    </Card>
  );
}

const LogisticsOverviewPage = ({ onNavigate }) => {
  const safeNavigate = (path, name) => {
    try {
      if (typeof onNavigate === 'function') {
        onNavigate(path, name);
        return;
      }
      window.history.pushState({ path }, '', path);
      window.dispatchEvent(new PopStateEvent('popstate', { state: { path } }));
    } catch (e) {
      toast.info(`演示功能：请从左侧菜单进入「${name}」`);
    }
  };

  // 直接读 logisticsService（真实 service，已 service 化的物流模块）
  const { vendorsCount, channelsCount, declarationsCount, hsCodesCount, addressesCount, pendingApprovalCount, countryDist, recent } = useMemo(() => {
    let vendorsTotal = 0, channelsTotal = 0, declarationsTotal = 0, hsTotal = 0, addressesTotal = 0;
    let pendingApproval = 0;
    let channelsList = [];

    try {
      vendorsTotal = (logisticsService?.vendors?.list?.({ page: 1, pageSize: 1 }) || {}).total || 0;
      channelsTotal = (logisticsService?.channels?.list?.({ page: 1, pageSize: 1 }) || {}).total || 0;
      declarationsTotal = (logisticsService?.declarations?.list?.({ page: 1, pageSize: 1 }) || {}).total || 0;
      hsTotal = (logisticsService?.hsCodes?.list?.({ page: 1, pageSize: 1 }) || {}).total || 0;
      addressesTotal = (logisticsService?.addresses?.list?.({ page: 1, pageSize: 1 }) || {}).total || 0;
      pendingApproval = (logisticsService?.vendors?.list?.({ approvalStatus: 'pending', page: 1, pageSize: 1 }) || {}).total || 0;
      channelsList = (logisticsService?.channels?.list?.({ page: 1, pageSize: 99999 }) || {}).list || [];
    } catch (e) {
      // logisticsService 异常时走全 fallback
    }

    // 国家分布（从 channels[].countries 数组聚合）
    const countryCount = {};
    (channelsList || []).forEach((ch) => {
      const arr = Array.isArray(ch?.countries) ? ch.countries : [];
      arr.forEach((c) => { countryCount[c] = (countryCount[c] || 0) + 1; });
    });
    const distRaw = Object.entries(countryCount)
      .map(([code, count]) => ({ code, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    const dist = distRaw.length > 0 ? distRaw : FALLBACK_COUNTRIES;

    const recentItems = [
      { id: 'r1', text: vendorsTotal > 0 ? `当前 ${vendorsTotal} 家物流商在合作中` : '暂未维护物流商档案，建议优先录入', tone: vendorsTotal > 0 ? 'success' : 'warning' },
      { id: 'r2', text: pendingApproval > 0 ? `${pendingApproval} 家物流商档案待审批` : '物流商档案审批均已完成', tone: pendingApproval > 0 ? 'warning' : 'success' },
      { id: 'r3', text: '主线 SKU FW-2026-001-C 已完成备货试算（演示）', tone: 'primary' },
      { id: 'r4', text: `HSCode 库已维护 ${hsTotal || '40+'} 条，覆盖路亚竿主品类`, tone: 'neutral' },
    ];

    return {
      vendorsCount: vendorsTotal,
      channelsCount: channelsTotal,
      declarationsCount: declarationsTotal,
      hsCodesCount: hsTotal,
      addressesCount: addressesTotal,
      pendingApprovalCount: pendingApproval,
      countryDist: dist,
      recent: recentItems,
    };
  }, []);

  const totalCountryHits = countryDist.reduce((s, r) => s + r.count, 0);

  const kpis = [
    { id: 'k1', icon: Truck,    label: '物流商数量', value: vendorsCount,      helper: `${pendingApprovalCount} 家待审批`, tone: 'brand'   },
    { id: 'k2', icon: Route,    label: '物流渠道',   value: channelsCount,     helper: '含 DDP / DDU / 自提',             tone: 'success' },
    { id: 'k3', icon: Layers,   label: '申报资料',   value: declarationsCount, helper: 'SKU 级报关字段',                  tone: 'warning' },
    { id: 'k4', icon: FileText, label: 'HSCode',     value: hsCodesCount,      helper: '海关编码 / 进出口税率',           tone: 'primary' },
  ];

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* 标题区 */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
            <Truck className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">物流与报关概览</h1>
            <p className="text-sm text-gray-500">物流商、渠道、仓库、HSCode、申报资料与备货试算的统一入口</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          {/* KPI */}
          <section>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {kpis.map((k) => <KpiCard key={k.id} {...k} />)}
            </div>
          </section>

          {/* 中部 2 栏 */}
          <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <Card className="p-5 xl:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-text">渠道国家覆盖（Top 5）</h3>
                  <p className="mt-1 text-xs text-text-subtle">来源：logisticsService.channels（按渠道支持国家聚合）</p>
                </div>
                <Badge tone="primary">仓库地址 {addressesCount} 个</Badge>
              </div>
              <CountryBar data={countryDist} total={totalCountryHits} />
            </Card>

            <Card className="p-5">
              <div className="mb-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-purple-600" />
                <h3 className="text-base font-semibold text-text">最近动态 / 风险提醒</h3>
              </div>
              <ul className="space-y-3">
                {recent.map((item) => (
                  <li key={item.id} className="flex items-start gap-2">
                    <span className={`mt-1.5 inline-block h-2 w-2 flex-shrink-0 rounded-full ${
                      item.tone === 'warning' ? 'bg-warning-500' :
                      item.tone === 'success' ? 'bg-success-500' :
                      item.tone === 'danger'  ? 'bg-danger-500'  :
                      item.tone === 'primary' ? 'bg-cyan-500'    : 'bg-slate-400'
                    }`} />
                    <p className="text-sm text-text">{item.text}</p>
                  </li>
                ))}
              </ul>
            </Card>
          </section>

          {/* 子页面导航（8 卡） */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text">子页面入口</h2>
              <Button variant="ghost" size="sm" icon={Calculator} onClick={() => safeNavigate('/logistics/trial-calc', '备货试算')}>
                进入主线
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {SUB_ENTRIES.map((entry) => (
                <SubEntryCard key={entry.id} entry={entry} onNavigate={safeNavigate} />
              ))}
            </div>
          </section>

          {/* 底部判断条 */}
          <Card className="border border-dashed border-purple-200 bg-purple-50/40 p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-white p-2.5 shadow-sm">
                <Package className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-text">当前物流运营判断</h3>
                <p className="mt-1 text-sm text-text-muted">
                  {vendorsCount === 0
                    ? '尚未维护物流商档案，建议优先录入合作物流商及其渠道，再配置备货试算。'
                    : `物流商 ${vendorsCount} 家、渠道 ${channelsCount} 条、HSCode ${hsCodesCount} 条已就绪${pendingApprovalCount > 0 ? `；${pendingApprovalCount} 家档案待审批，建议本周内完成` : '；可直接进行备货试算'}。`}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LogisticsOverviewPage;
