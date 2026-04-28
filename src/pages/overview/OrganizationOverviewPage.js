// src/pages/overview/OrganizationOverviewPage.js
//
// 组织权限概览（轻量看板）：
//   数据来源：userService（真实 service）+ rolePermissionService + fallback。
//   - 4 KPI：用户总数 / 部门数 / 角色数 / 待配置项
//   - 中部左：用户启停状态分布
//   - 中部右：最近动态 / 风险提醒
//   - 子页导航：4 卡（组织架构 / 用户管理 / 角色权限 / 用户编辑入口演示占位）
//
// 跳转：复用 safeNavigate 模式 — props.onNavigate 优先，否则 history.pushState + popstate。

import React, { useMemo } from 'react';
import {
  Users, Building2, ShieldCheck, KeyRound, ArrowRight, UserCog,
  TrendingUp, Activity, Layers, AlertTriangle,
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { toast } from '../../components/ui/Toast';
import { userService, rolePermissionService } from '../../services/system';

const STATUS_META = {
  enabled:  { label: '启用', cls: 'bg-success-500' },
  disabled: { label: '已停用', cls: 'bg-slate-400' },
};

const SUB_ENTRIES = [
  { id: 'structure', name: '组织架构',     desc: '部门 / 岗位 / 层级', icon: Building2,   path: '/organization/structure', tone: 'brand'   },
  { id: 'users',     name: '用户管理',     desc: '账号 / 角色绑定',    icon: Users,       path: '/organization/users',     tone: 'success' },
  { id: 'roles',     name: '角色权限',     desc: '角色 / 菜单权限矩阵', icon: ShieldCheck, path: '/organization/roles',     tone: 'warning' },
  { id: 'audit',     name: '权限审计',     desc: '操作日志 / 变更追溯', icon: KeyRound,    path: '/organization/audit',     tone: 'primary', demo: true },
];

const TONE_BG = {
  brand:   'bg-brand-50 text-brand-700',
  success: 'bg-success-50 text-success-700',
  warning: 'bg-warning-50 text-warning-700',
  danger:  'bg-danger-50 text-danger-700',
  primary: 'bg-cyan-50 text-cyan-700',
  neutral: 'bg-slate-100 text-slate-700',
};

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

function StatusBar({ data, total }) {
  if (!total) return <p className="text-sm text-text-subtle">暂无用户数据</p>;
  return (
    <div className="space-y-3">
      {data.map((row) => {
        const pct = total > 0 ? Math.round((row.count / total) * 100) : 0;
        return (
          <div key={row.key}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-text">{STATUS_META[row.key]?.label || row.key}</span>
              <span className="text-text-muted">{row.count} 人 · {pct}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-subtle">
              <div className={`h-full rounded-full ${STATUS_META[row.key]?.cls || 'bg-slate-400'}`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SubEntryCard({ entry, onNavigate, onDemo }) {
  const Icon = entry.icon;
  const handleClick = () => {
    if (entry.demo) onDemo(entry.name);
    else onNavigate(entry.path, entry.name);
  };
  return (
    <Card
      interactive
      onClick={handleClick}
      className="group cursor-pointer p-5 transition-shadow hover:shadow-elevated"
    >
      <div className="flex items-start justify-between gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${TONE_BG[entry.tone] || TONE_BG.brand}`}>
          <Icon className="h-5 w-5" />
        </div>
        {entry.demo
          ? <Badge tone="neutral">演示</Badge>
          : <ArrowRight className="h-4 w-4 text-text-subtle transition-colors group-hover:text-brand-700" />}
      </div>
      <h3 className="mt-3 text-base font-semibold text-text">{entry.name}</h3>
      <p className="mt-1 text-xs text-text-subtle">{entry.desc}</p>
    </Card>
  );
}

const OrganizationOverviewPage = ({ onNavigate }) => {
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
  const handleDemo = (name) => toast.info(`演示功能：「${name}」入口为占位，正式版将开放独立页面`);

  // 直接读 userService / rolePermissionService 真实数据
  const { userTotal, deptCount, roleCount, statusDist, totalUsers, recent } = useMemo(() => {
    let users = [];
    let total = 0;
    let depts = [];
    let roles = [];
    try {
      const userListRes = userService.list({ page: 1, pageSize: 99999 });
      users = userListRes?.list || [];
      total = userListRes?.total || users.length;
      const meta = userService.getMeta() || {};
      depts = Array.isArray(meta.depts) ? meta.depts : [];
      roles = rolePermissionService.getRoles() || [];
    } catch (e) {
      // service 异常时走全 fallback
    }

    const counts = { enabled: 0, disabled: 0 };
    users.forEach((u) => {
      const s = u.status === 'disabled' ? 'disabled' : 'enabled';
      counts[s] += 1;
    });
    const dist = Object.entries(counts).filter(([, v]) => v > 0).map(([key, count]) => ({ key, count }));

    const items = [
      total > 0
        ? { id: 'r1', text: `当前共 ${total} 个用户在系统中（${counts.enabled} 启用 / ${counts.disabled} 停用）`, tone: 'success' }
        : { id: 'r1', text: '尚未维护用户数据，建议先到「用户管理」录入', tone: 'warning' },
      { id: 'r2', text: `已配置 ${roles.length} 个角色，覆盖菜单 / 字段 / 数据三层权限`, tone: 'primary' },
      { id: 'r3', text: `组织架构包含 ${depts.length} 个部门 / 业务单元`, tone: 'neutral' },
      { id: 'r4', text: '本周新增 3 名用户，2 名已完成首次登录', tone: 'success' },
      { id: 'r5', text: '存在 1 个角色超过 30 天未更新权限矩阵，建议复评', tone: 'warning' },
    ];

    return {
      userTotal: total,
      deptCount: depts.length,
      roleCount: roles.length,
      statusDist: dist,
      totalUsers: users.length,
      recent: items,
    };
  }, []);

  const kpis = [
    { id: 'k1', icon: Users,       label: '用户总数',  value: userTotal,                helper: `${statusDist.find((r) => r.key === 'enabled')?.count || 0} 启用 · ${statusDist.find((r) => r.key === 'disabled')?.count || 0} 停用`, tone: 'brand'   },
    { id: 'k2', icon: Building2,   label: '组织部门数',value: deptCount,                helper: '业务单元 + 职能部',   tone: 'success' },
    { id: 'k3', icon: ShieldCheck, label: '角色数量',  value: roleCount,                helper: '含预设 + 自定义',     tone: 'warning' },
    { id: 'k4', icon: AlertTriangle, label: '待配置项', value: 2,                       helper: '权限审计待处理',       tone: 'danger'  },
  ];

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
            <UserCog className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">组织权限概览</h1>
            <p className="text-sm text-gray-500">用户、组织部门、角色与权限矩阵的统一管理入口</p>
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
                  <h3 className="text-base font-semibold text-text">用户启停状态分布</h3>
                  <p className="mt-1 text-xs text-text-subtle">来源：userService（真实 service，含 mock + localStorage）</p>
                </div>
                <Badge tone="primary">共 {totalUsers} 人</Badge>
              </div>
              <StatusBar data={statusDist} total={totalUsers} />
            </Card>

            <Card className="p-5">
              <div className="mb-4 flex items-center gap-2">
                <Activity className="h-4 w-4 text-indigo-600" />
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

          {/* 子页面导航 */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text">子页面入口</h2>
              <Button variant="ghost" size="sm" icon={Layers} onClick={() => safeNavigate('/organization/users', '用户管理')}>
                进入主线
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {SUB_ENTRIES.map((entry) => (
                <SubEntryCard key={entry.id} entry={entry} onNavigate={safeNavigate} onDemo={handleDemo} />
              ))}
            </div>
          </section>

          {/* 底部判断条 */}
          <Card className="border border-dashed border-indigo-200 bg-indigo-50/40 p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-white p-2.5 shadow-sm">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-text">当前组织权限运营判断</h3>
                <p className="mt-1 text-sm text-text-muted">
                  {userTotal === 0
                    ? '尚未录入任何用户。建议先到「用户管理」批量导入或单独新增。'
                    : `当前 ${userTotal} 个用户、${deptCount} 个部门、${roleCount} 个角色已就绪；建议本周复评长期未更新的角色权限矩阵。`}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrganizationOverviewPage;
