import React, { useMemo, useState } from 'react';
import { Eye, RotateCcw, Search } from 'lucide-react';
import Card from '../../components/ui/Card';
import TableShell from '../../components/ui/TableShell';
import DrawerShell from '../../components/ui/DrawerShell';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import cn from '../../utils/cn';

const EMPTY_TEXT = '-';

function isBlank(value) {
  return value === undefined || value === null || value === '';
}

function normalizeText(value) {
  return isBlank(value) ? '' : String(value).trim().toLowerCase();
}

function toTimestamp(value) {
  if (isBlank(value)) return null;
  const normalized = String(value).includes('T') ? String(value) : String(value).replace(' ', 'T');
  const timestamp = new Date(normalized).getTime();
  return Number.isNaN(timestamp) ? null : timestamp;
}

function inDateRange(value, start, end) {
  if (!start && !end) return true;
  const current = toTimestamp(value);
  if (current === null) return false;
  if (start) {
    const startTime = toTimestamp(start);
    if (startTime !== null && current < startTime) return false;
  }
  if (end) {
    const endTime = toTimestamp(end);
    if (endTime !== null && current > endTime + 24 * 60 * 60 * 1000 - 1) return false;
  }
  return true;
}

function resolveValue(record, field) {
  if (typeof field.render === 'function') return field.render(record);
  if (typeof field.value === 'function') return field.value(record);
  return record[field.key];
}

function renderDisplayValue(value) {
  if (React.isValidElement(value)) return value;
  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-text-subtle">{EMPTY_TEXT}</span>;
    return (
      <div className="flex flex-wrap gap-2">
        {value.map((item) => (
          <span key={String(item)} className="rounded-lg bg-surface-subtle px-2.5 py-1 text-xs text-text-muted">
            {item}
          </span>
        ))}
      </div>
    );
  }
  if (isBlank(value)) return <span className="text-text-subtle">{EMPTY_TEXT}</span>;
  return <span className="text-text">{value}</span>;
}

function SearchField({ field, filters, onChange }) {
  if (field.type === 'dateRange') {
    return (
      <label className="block">
        <div className="mb-2 text-xs font-medium uppercase tracking-wide text-text-subtle">{field.label}</div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={filters[field.startKey] ?? ''}
            onChange={(event) => onChange(field.startKey, event.target.value)}
            className="ui-input min-w-0"
          />
          <span className="text-sm text-text-subtle">至</span>
          <input
            type="date"
            value={filters[field.endKey] ?? ''}
            onChange={(event) => onChange(field.endKey, event.target.value)}
            className="ui-input min-w-0"
          />
        </div>
      </label>
    );
  }

  if (field.type === 'select') {
    return (
      <label className="block">
        <div className="mb-2 text-xs font-medium uppercase tracking-wide text-text-subtle">{field.label}</div>
        <select
          value={filters[field.key] ?? ''}
          onChange={(event) => onChange(field.key, event.target.value)}
          className="ui-select"
        >
          <option value="">{field.placeholder || `全部${field.label}`}</option>
          {(field.options || []).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    );
  }

  return (
    <label className="block">
      <div className="mb-2 text-xs font-medium uppercase tracking-wide text-text-subtle">{field.label}</div>
      <input
        type="text"
        value={filters[field.key] ?? ''}
        onChange={(event) => onChange(field.key, event.target.value)}
        placeholder={field.placeholder || `请输入${field.label}`}
        className="ui-input"
      />
    </label>
  );
}

function SearchPanel({ fields, draftFilters, onChange, onSearch, onReset }) {
  return (
    <Card padding="lg">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="ui-section-title">筛选条件</h2>
          <p className="mt-1 text-sm text-text-muted">支持按单号、状态、时间范围快速缩小范围。</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" icon={RotateCcw} onClick={onReset}>
            重置
          </Button>
          <Button icon={Search} onClick={onSearch}>
            查询
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {fields.map((field) => (
          <SearchField key={field.id || field.key || `${field.startKey}-${field.endKey}`} field={field} filters={draftFilters} onChange={onChange} />
        ))}
      </div>
    </Card>
  );
}

function SummaryCard({ item }) {
  const Icon = item.icon;
  return (
    <Card padding="md" className="overflow-hidden">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm text-text-muted">{item.label}</div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-text">{item.value}</div>
          {item.helper && <div className="mt-2 text-xs text-text-subtle">{item.helper}</div>}
        </div>
        {Icon && (
          <div className={cn('rounded-2xl p-3', item.iconClassName || 'bg-brand-50 text-brand-600')}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </Card>
  );
}

function DrawerSection({ title, description, record, fields }) {
  return (
    <section className="space-y-4 rounded-2xl border border-border bg-surface-subtle/50 p-5">
      <div>
        <h3 className="text-sm font-semibold text-text">{title}</h3>
        {description && <p className="mt-1 text-sm text-text-muted">{description}</p>}
      </div>
      <dl className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
        {fields.map((field) => (
          <div key={field.label} className={cn(field.span === 2 && 'md:col-span-2')}>
            <dt className="text-xs font-medium uppercase tracking-wide text-text-subtle">{field.label}</dt>
            <dd className="mt-1 text-sm leading-6">{renderDisplayValue(resolveValue(record, field))}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function StatusTag({ children, tone = 'neutral' }) {
  return <Badge tone={tone}>{children}</Badge>;
}

export default function QualityWorkbenchPage({
  title,
  description,
  summaryCards,
  searchFields,
  initialFilters,
  records,
  columns,
  filterRecords,
  drawerTitle,
  drawerSubtitle,
  drawerSections,
  tableMinWidth = 1500,
  emptyText = '暂无符合条件的数据',
}) {
  const [draftFilters, setDraftFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);
  const [activeRecord, setActiveRecord] = useState(null);

  const filteredRecords = useMemo(
    () =>
      records.filter((record) => {
        if (typeof filterRecords === 'function') {
          return filterRecords(record, appliedFilters, { normalizeText, inDateRange });
        }
        return true;
      }),
    [records, appliedFilters, filterRecords]
  );

  const handleSearchChange = (key, value) => {
    setDraftFilters((current) => ({ ...current, [key]: value }));
  };

  const handleReset = () => {
    setDraftFilters(initialFilters);
    setAppliedFilters(initialFilters);
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="ui-page-title">{title}</h1>
          <p className="mt-2 text-sm text-text-muted">{description}</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-text-muted shadow-panel">
          当前列表 <span className="font-semibold text-text">{filteredRecords.length}</span> 条
        </div>
      </section>

      {summaryCards?.length > 0 && (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((item) => (
            <SummaryCard key={item.label} item={item} />
          ))}
        </section>
      )}

      <SearchPanel
        fields={searchFields}
        draftFilters={draftFilters}
        onChange={handleSearchChange}
        onSearch={() => setAppliedFilters({ ...draftFilters })}
        onReset={handleReset}
      />

      <TableShell
        minWidth={tableMinWidth}
        toolbar={
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="ui-section-title">列表台账</h2>
              <p className="mt-1 text-sm text-text-muted">点击“查看详情”可打开抽屉查看完整业务信息。</p>
            </div>
            <div className="text-sm text-text-subtle">已应用筛选结果 {filteredRecords.length} 条</div>
          </div>
        }
      >
        {filteredRecords.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-text-muted">{emptyText}</div>
        ) : (
          <table className="w-full table-fixed border-collapse text-sm">
            <thead className="bg-surface-subtle">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={cn(
                      'border-b border-border px-4 py-3 text-left font-semibold text-text',
                      column.headerClassName
                    )}
                    style={column.width ? { width: column.width } : undefined}
                  >
                    {column.title}
                  </th>
                ))}
                <th className="border-b border-border px-4 py-3 text-left font-semibold text-text" style={{ width: 110 }}>
                  操作
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id} className="border-b border-border last:border-b-0 hover:bg-surface-subtle/60">
                  {columns.map((column) => (
                    <td key={column.key} className={cn('px-4 py-3 align-top text-text-muted', column.cellClassName)}>
                      {column.render ? column.render(record) : renderDisplayValue(record[column.key])}
                    </td>
                  ))}
                  <td className="px-4 py-3 align-top">
                    <Button variant="ghost" size="sm" icon={Eye} onClick={() => setActiveRecord(record)}>
                      查看详情
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </TableShell>

      <DrawerShell
        open={Boolean(activeRecord)}
        width="xl"
        title={activeRecord ? drawerTitle(activeRecord) : ''}
        subtitle={activeRecord ? drawerSubtitle(activeRecord) : ''}
        onClose={() => setActiveRecord(null)}
      >
        {activeRecord && (
          <div className="space-y-5">
            {drawerSections.map((section) => (
              <DrawerSection
                key={section.title}
                title={section.title}
                description={section.description}
                record={activeRecord}
                fields={section.fields}
              />
            ))}
          </div>
        )}
      </DrawerShell>
    </div>
  );
}

