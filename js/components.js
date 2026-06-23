/* ============================================
   CRM 系统 - 通用组件
   ============================================ */
const Components = {

  // === DataTable 数据表格组件 ===
  DataTable({
    columns,        // [{ key, label, width, sortable, render }]
    data,           // 数据数组
    pageSize = 10,
    currentPage = 1,
    searchKeys,     // 搜索字段数组
    searchPlaceholder = '搜索...',
    filters,        // [{ key, label, value }] 快捷筛选标签
    activeFilter,   // 当前激活筛选值
    onFilterChange, // 筛选切换回调
    filterFields,   // [{ key, label, type, placeholder, options }] 筛选下拉字段
    defaultVisibleFilters = 0, // 默认展示的筛选项数量，其余折叠（0 表示全部展开）
    filterValues,   // { key: value } 当前筛选值
    onFilterSearch, // 筛选查询回调
    onFilterReset,  // 筛选重置回调
    actions,        // { onFollowUp, onEdit, onMore } 或自定义 render
    toolbarExtra,   // 工具栏额外内容 HTML
    toolbarSlot,    // 工具栏与表格之间的插槽 HTML
    emptyText = '暂无数据',
    onRowClick,     // 行点击回调
    sortKey,
    sortOrder,      // 'asc' | 'desc'
    onSort,
    showPagination = true, // 始终显示分页
  }) {
    const container = document.createElement('div');
    container.className = 'data-table-container animate-fade-in';

    let filteredData = [...data];
    let searchTerm = '';
    let page = currentPage;
    let currentSortKey = sortKey || null;
    let currentSortOrder = sortOrder || 'desc';
    let currentFilterValues = filterValues ? { ...filterValues } : {};

    function applySearch(items) {
      if (!searchTerm || !searchKeys) return items;
      const term = searchTerm.toLowerCase();
      return items.filter(item =>
        searchKeys.some(key => {
          const val = item[key];
          return val && String(val).toLowerCase().includes(term);
        })
      );
    }

    function _checkDateRange(itemVal, period, start, end) {
      if (!itemVal) return false;
      const itemDate = new Date(itemVal);
      if (period === 'custom') {
        if (start && itemDate < new Date(start)) return false;
        if (end) { const endDate = new Date(end); endDate.setHours(23,59,59); if (itemDate > endDate) return false; }
        return true;
      }
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();
      let rangeStart, rangeEnd;
      if (period === '本月') {
        rangeStart = new Date(year, month, 1);
        rangeEnd = new Date(year, month + 1, 0, 23, 59, 59);
      } else if (period === '下月') {
        rangeStart = new Date(year, month + 1, 1);
        rangeEnd = new Date(year, month + 2, 0, 23, 59, 59);
      } else {
        return true;
      }
      return itemDate >= rangeStart && itemDate <= rangeEnd;
    }

    function applyFilterFields(items) {
      if (!currentFilterValues || !filterFields) return items;
      return items.filter(item => {
        return filterFields.every(f => {
          if (f.type === 'dateRange') {
            const period = currentFilterValues[f.key + '_period'];
            if (!period) return true;
            return _checkDateRange(item[f.key], period, currentFilterValues[f.key + '_start'], currentFilterValues[f.key + '_end']);
          }
          if (f.type === 'timeDimension') {
            const dim = currentFilterValues[f.key + '_dim'];
            const period = currentFilterValues[f.key + '_period'];
            if (!dim || !period) return true;
            const targetField = dim;
            const itemVal = item[targetField];
            // 对于无此字段的记录，尝试从关联数据获取
            if (!itemVal) {
              // 如果是最近跟进时间，尝试从跟进记录中获取
              if (targetField === 'lastFollowupAt') {
                const followups = (window.Store ? Store.query('followups', fu => fu.relatedType === 'opportunity' && fu.relatedId === item.id) : []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                if (followups.length === 0) return false;
                return _checkDateRange(followups[0].createdAt, period, currentFilterValues[f.key + '_start'], currentFilterValues[f.key + '_end']);
              }
              if (targetField === 'nextFollowupAt') {
                const followups = (window.Store ? Store.query('followups', fu => fu.relatedType === 'opportunity' && fu.relatedId === item.id) : []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                if (followups.length === 0) return false;
                // 下次跟进时间 = 最近跟进 + 7天（模拟）
                const lastDate = new Date(followups[0].createdAt);
                lastDate.setDate(lastDate.getDate() + 7);
                return _checkDateRange(lastDate.toISOString(), period, currentFilterValues[f.key + '_start'], currentFilterValues[f.key + '_end']);
              }
              return false;
            }
            return _checkDateRange(itemVal, period, currentFilterValues[f.key + '_start'], currentFilterValues[f.key + '_end']);
          }
          if (f.customFilter) {
            return f.customFilter(item, currentFilterValues[f.key]);
          }
          const val = currentFilterValues[f.key];
          if (!val) return true;
          const itemVal = item[f.key];
          if (!itemVal) return false;
          return String(itemVal).toLowerCase().includes(String(val).toLowerCase());
        });
      });
    }

    function applySort(items) {
      if (!currentSortKey) return items;
      return [...items].sort((a, b) => {
        let va = a[currentSortKey], vb = b[currentSortKey];
        if (va == null) return 1;
        if (vb == null) return -1;
        if (typeof va === 'number') return currentSortOrder === 'asc' ? va - vb : vb - va;
        va = String(va).toLowerCase();
        vb = String(vb).toLowerCase();
        return currentSortOrder === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
      });
    }

    function render() {
      let items = filteredData;
      items = applyFilterFields(items);
      items = applySearch(items);
      items = applySort(items);

      const totalItems = items.length;
      const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
      if (page > totalPages) page = totalPages;
      const startIdx = (page - 1) * pageSize;
      const pageItems = items.slice(startIdx, startIdx + pageSize);

      // 筛选下拉区
      let filterAreaHtml = '';
      if (filterFields && filterFields.length) {
        const visibleCount = defaultVisibleFilters > 0 ? Math.min(defaultVisibleFilters, filterFields.length) : filterFields.length;
        const hasMore = defaultVisibleFilters > 0 && filterFields.length > defaultVisibleFilters;

        const fieldsHtml = filterFields.map((f, idx) => {
          const isHidden = hasMore && idx >= visibleCount;
          const val = currentFilterValues[f.key] || '';
          let fieldHtml = '';
          if (f.type === 'select' && f.options) {
            const optsHtml = `<option value="">${Helpers.escapeHtml(f.label)}</option>` +
              f.options.map(o => `<option value="${Helpers.escapeHtml(o)}" ${val === o ? 'selected' : ''}>${Helpers.escapeHtml(o)}</option>`).join('');
            fieldHtml = `<div class="filter-field"><select class="form-select filter-select" data-filter-key="${f.key}">${optsHtml}</select></div>`;
          } else if (f.type === 'dateRange') {
            const valStart = currentFilterValues[f.key + '_start'] || '';
            const valEnd = currentFilterValues[f.key + '_end'] || '';
            const periodVal = currentFilterValues[f.key + '_period'] || '';
            const periodOpts = (f.periodOptions || ['本月', '下月']).map(o => `<option value="${Helpers.escapeHtml(o)}" ${periodVal === o ? 'selected' : ''}>${Helpers.escapeHtml(o)}</option>`).join('');
            fieldHtml = `<div class="filter-field filter-field-daterange"><select class="form-select filter-select filter-period" data-filter-key="${f.key}_period"><option value="">${Helpers.escapeHtml(f.label)}</option>${periodOpts}<option value="custom" ${periodVal === 'custom' ? 'selected' : ''}>自定义</option></select><div class="filter-daterange-inputs" style="display:${periodVal === 'custom' ? 'flex' : 'none'};gap:4px;align-items:center"><input type="date" class="form-input filter-date" data-filter-key="${f.key}_start" value="${Helpers.escapeHtml(String(valStart))}"><span style="color:var(--text-muted)">~</span><input type="date" class="form-input filter-date" data-filter-key="${f.key}_end" value="${Helpers.escapeHtml(String(valEnd))}"></div></div>`;
          } else if (f.type === 'timeDimension') {
            const dimVal = currentFilterValues[f.key + '_dim'] || '';
            const periodVal = currentFilterValues[f.key + '_period'] || '';
            const valStart = currentFilterValues[f.key + '_start'] || '';
            const valEnd = currentFilterValues[f.key + '_end'] || '';
            const dimOpts = (f.dimOptions || []).map(o => `<option value="${Helpers.escapeHtml(o.key)}" ${dimVal === o.key ? 'selected' : ''}>${Helpers.escapeHtml(o.label)}</option>`).join('');
            const periodOpts = (f.periodOptions || ['本月', '下月']).map(o => `<option value="${Helpers.escapeHtml(o)}" ${periodVal === o ? 'selected' : ''}>${Helpers.escapeHtml(o)}</option>`).join('');
            fieldHtml = `<div class="filter-field filter-field-daterange">
              <div style="display:flex;gap:4px;align-items:center;flex-wrap:wrap">
                <select class="form-select filter-select" data-filter-key="${f.key}_dim" style="min-width:120px"><option value="">${Helpers.escapeHtml(f.label)}</option>${dimOpts}</select>
                <select class="form-select filter-select filter-period" data-filter-key="${f.key}_period" style="min-width:100px"><option value="">全部</option>${periodOpts}<option value="custom" ${periodVal === 'custom' ? 'selected' : ''}>自定义</option></select>
                <div class="filter-daterange-inputs" style="display:${periodVal === 'custom' ? 'flex' : 'none'};gap:4px;align-items:center"><input type="date" class="form-input filter-date" data-filter-key="${f.key}_start" value="${Helpers.escapeHtml(String(valStart))}"><span style="color:var(--text-muted)">~</span><input type="date" class="form-input filter-date" data-filter-key="${f.key}_end" value="${Helpers.escapeHtml(String(valEnd))}"></div>
              </div></div>`;
          } else {
            fieldHtml = `<div class="filter-field"><input type="text" class="form-input filter-input" placeholder="${Helpers.escapeHtml(f.label)}" value="${Helpers.escapeHtml(val)}" data-filter-key="${f.key}"></div>`;
          }
          if (isHidden) {
            return `<div class="filter-field-more" style="display:none">${fieldHtml}</div>`;
          }
          return fieldHtml;
        }).join('');

        const moreBtnHtml = hasMore ? `<button class="btn btn-text btn-sm" id="filter-more-btn" style="align-self:flex-end;white-space:nowrap;color:var(--primary);font-size:12px">更多筛选 <svg viewBox="0 0 24 24" style="width:12px;height:12px;stroke:currentColor;fill:none;stroke-width:2"><polyline points="6 9 12 15 18 9"/></svg></button>` : '';

        filterAreaHtml = `<div class="table-filter-area">
          <div class="filter-fields-row">${fieldsHtml}
            ${moreBtnHtml}
            <div class="filter-actions-inline">
              <button class="btn btn-primary btn-sm" id="filter-search-btn"><svg viewBox="0 0 24 24" style="width:14px;height:14px"><circle cx="11" cy="11" r="8" fill="none" stroke="currentColor" stroke-width="2"/><line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" stroke-width="2"/></svg> 查询</button>
              <button class="btn btn-secondary btn-sm" id="filter-reset-btn"><svg viewBox="0 0 24 24" style="width:14px;height:14px"><path d="M1 4v6h6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" fill="none" stroke="currentColor" stroke-width="2"/></svg> 重置</button>
            </div>
          </div>
        </div>`;
      }

      // 工具栏（仅当有内容时渲染）
      let toolbarHtml = '';
      if (toolbarExtra) {
        toolbarHtml = `<div class="table-toolbar">
          <div class="table-toolbar-left">
            ${toolbarExtra}
          </div>
          <div class="table-toolbar-right">
          </div>
        </div>`;
      }

      // 筛选标签（保留兼容）
      let filterHtml = '';
      if (filters && filters.length && !filterFields) {
        filterHtml = `<div class="table-filters">${filters.map(f =>
          `<span class="filter-tag ${activeFilter === f.value ? 'active' : ''}" data-filter="${Helpers.escapeHtml(String(f.value))}">${Helpers.escapeHtml(f.label)}</span>`
        ).join('')}</div>`;
      }

      // 表头
      const theadHtml = columns.map(col => {
        const sortable = col.sortable ? ' sortable' : '';
        const sorted = currentSortKey === col.key ? ' sorted' : '';
        const sortIcon = col.sortable ? `<span class="sort-icon">${currentSortKey === col.key ? (currentSortOrder === 'asc' ? '↑' : '↓') : '↕'}</span>` : '';
        const width = col.width ? ` style="width:${col.width}"` : '';
        return `<th class="${sortable}${sorted}" data-sort-key="${col.key}"${width}>${Helpers.escapeHtml(col.label)}${sortIcon}</th>`;
      }).join('') + (actions ? '<th style="width:140px">操作</th>' : '');

      // 表体
      let tbodyHtml = '';
      if (pageItems.length === 0) {
        const colSpan = columns.length + (actions ? 1 : 0);
        tbodyHtml = `<tr><td colspan="${colSpan}"><div class="table-empty"><div class="empty-icon">📭</div><div class="empty-text">${Helpers.escapeHtml(emptyText)}</div></div></td></tr>`;
      } else {
        tbodyHtml = pageItems.map((item, rowIdx) => {
          const cells = columns.map(col => {
            const val = col.render ? col.render(item[col.key], item) : Helpers.escapeHtml(String(item[col.key] != null ? item[col.key] : '-'));
            return `<td>${val}</td>`;
          }).join('');

          let actionHtml = '';
          if (actions) {
            actionHtml = '<td><div class="cell-actions">';
            if (actions.onFollowUp) actionHtml += `<button class="action-btn outlined" data-action="followup" data-id="${item.id}" title="写跟进">写跟进</button>`;
            if (actions.onEdit) actionHtml += `<button class="action-btn outlined" data-action="edit" data-id="${item.id}" title="编辑">编辑</button>`;
            if (actions.onMore) actionHtml += `<button class="action-btn more-btn" data-action="more" data-id="${item.id}" title="更多">···</button>`;
            if (actions.onView) actionHtml += `<button class="action-btn outlined" data-action="view" data-id="${item.id}" title="查看">查看</button>`;
            if (actions.onDelete) actionHtml += `<button class="action-btn danger icon-only" data-action="delete" data-id="${item.id}" title="删除"><svg viewBox="0 0 24 24">${UI.icons.trash}</svg></button>`;
            if (actions.extra) actionHtml += actions.extra(item);
            actionHtml += '</div></td>';
          }

          const clickable = onRowClick ? ' style="cursor:pointer"' : '';
          const staggerDelay = rowIdx * 30;
          return `<tr data-row-id="${item.id}" style="animation: tableRowIn 0.3s ease ${staggerDelay}ms both"${clickable}>${cells}${actionHtml}</tr>`;
        }).join('');
      }

      // 分页 - 始终显示
      let paginationHtml = '';
      if (showPagination) {
        let pages = '';
        pages += `<button class="page-btn" data-page="${page - 1}" ${page <= 1 ? 'disabled' : ''}><svg viewBox="0 0 24 24">${UI.icons.chevronLeft}</svg></button>`;
        const range = getPageRange(page, totalPages);
        range.forEach(p => {
          if (p === '...') {
            pages += '<span class="page-btn" style="cursor:default">...</span>';
          } else {
            pages += `<button class="page-btn ${p === page ? 'active' : ''}" data-page="${p}">${p}</button>`;
          }
        });
        pages += `<button class="page-btn" data-page="${page + 1}" ${page >= totalPages ? 'disabled' : ''}><svg viewBox="0 0 24 24">${UI.icons.chevronRight}</svg></button>`;
        paginationHtml = `<div class="table-footer">
          <div class="table-footer-left">
            <span class="table-total">共 ${totalItems} 条</span>
          </div>
          <div class="table-footer-right">
            <div class="pagination">${pages}</div>
            <div class="page-size-select">
              <select class="form-select page-size-dropdown" id="page-size-select">
                <option value="10" ${pageSize === 10 ? 'selected' : ''}>10条/页</option>
                <option value="15" ${pageSize === 15 ? 'selected' : ''}>15条/页</option>
                <option value="20" ${pageSize === 20 ? 'selected' : ''}>20条/页</option>
                <option value="50" ${pageSize === 50 ? 'selected' : ''}>50条/页</option>
              </select>
            </div>
          </div>
        </div>`;
      }

      container.innerHTML = `
        ${filterAreaHtml}
        ${toolbarHtml}
        ${filterHtml}
        ${toolbarSlot || ''}
        <div class="table-wrapper">
          <table class="data-table">
            <thead><tr>${theadHtml}</tr></thead>
            <tbody>${tbodyHtml}</tbody>
          </table>
        </div>
        ${paginationHtml}
      `;

      // 事件绑定
      bindEvents();
    }

    function getPageRange(current, total) {
      if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
      const pages = [];
      if (current <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(total);
      } else if (current >= total - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = total - 4; i <= total; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = current - 1; i <= current + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(total);
      }
      return pages;
    }

    function bindEvents() {
      // 筛选区 - 输入变化（包括日期和周期选择器）
      container.querySelectorAll('.filter-input, .filter-select, .filter-date, .filter-period').forEach(el => {
        el.addEventListener('change', (e) => {
          const key = e.target.dataset.filterKey;
          currentFilterValues[key] = e.target.value;
          // 周期选择器切换时控制日期输入框显隐
          if (e.target.classList.contains('filter-period')) {
            const daterangeInputs = e.target.parentElement.querySelector('.filter-daterange-inputs');
            if (daterangeInputs) {
              daterangeInputs.style.display = e.target.value === 'custom' ? 'flex' : 'none';
            }
          }
        });
        el.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            page = 1;
            if (onFilterSearch) onFilterSearch(currentFilterValues);
            else render();
          }
        });
      });

      // 筛选查询按钮
      const searchBtn = container.querySelector('#filter-search-btn');
      if (searchBtn) {
        searchBtn.addEventListener('click', () => {
          // 收集最新筛选值（包括日期和周期选择器）
          container.querySelectorAll('.filter-input, .filter-select, .filter-date, .filter-period').forEach(el => {
            currentFilterValues[el.dataset.filterKey] = el.value;
          });
          page = 1;
          if (onFilterSearch) onFilterSearch(currentFilterValues);
          else render();
        });
      }

      // 筛选重置按钮
      const resetBtn = container.querySelector('#filter-reset-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          currentFilterValues = {};
          container.querySelectorAll('.filter-input').forEach(el => el.value = '');
          container.querySelectorAll('.filter-select').forEach(el => el.selectedIndex = 0);
          container.querySelectorAll('.filter-date').forEach(el => el.value = '');
          container.querySelectorAll('.filter-period').forEach(el => el.selectedIndex = 0);
          container.querySelectorAll('.filter-daterange-inputs').forEach(el => el.style.display = 'none');
          page = 1;
          if (onFilterReset) onFilterReset();
          else render();
        });
      }

      // 更多筛选 折叠/展开 按钮
      const moreBtn = container.querySelector('#filter-more-btn');
      if (moreBtn) {
        let moreExpanded = false;
        moreBtn.addEventListener('click', () => {
          moreExpanded = !moreExpanded;
          const hiddenFields = container.querySelectorAll('.filter-field-more');
          hiddenFields.forEach(el => { el.style.display = moreExpanded ? '' : 'none'; });
          moreBtn.innerHTML = moreExpanded
            ? '收起筛选 <svg viewBox="0 0 24 24" style="width:12px;height:12px;stroke:currentColor;fill:none;stroke-width:2"><polyline points="18 15 12 9 6 15"/></svg>'
            : '更多筛选 <svg viewBox="0 0 24 24" style="width:12px;height:12px;stroke:currentColor;fill:none;stroke-width:2"><polyline points="6 9 12 15 18 9"/></svg>';
        });
      }

      // 筛选标签（保留兼容）
      container.querySelectorAll('.filter-tag').forEach(tag => {
        tag.addEventListener('click', () => {
          const val = tag.dataset.filter;
          activeFilter = activeFilter === val ? null : val;
          page = 1;
          if (onFilterChange) onFilterChange(activeFilter);
        });
      });

      // 排序
      container.querySelectorAll('th.sortable').forEach(th => {
        th.addEventListener('click', () => {
          const key = th.dataset.sortKey;
          if (currentSortKey === key) {
            currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
          } else {
            currentSortKey = key;
            currentSortOrder = 'desc';
          }
          if (onSort) onSort(currentSortKey, currentSortOrder);
          render();
        });
      });

      // 分页
      container.querySelectorAll('.page-btn[data-page]').forEach(btn => {
        btn.addEventListener('click', () => {
          const p = parseInt(btn.dataset.page);
          if (p >= 1 && p !== page) {
            page = p;
            render();
          }
        });
      });

      // 每页条数
      const pageSizeSelect = container.querySelector('#page-size-select');
      if (pageSizeSelect) {
        pageSizeSelect.addEventListener('change', (e) => {
          pageSize = parseInt(e.target.value);
          page = 1;
          render();
        });
      }

      // 操作按钮
      if (actions) {
        container.querySelectorAll('.action-btn[data-action]').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = btn.dataset.action;
            const id = btn.dataset.id;
            if (action === 'view' && actions.onView) actions.onView(id);
            else if (action === 'edit' && actions.onEdit) actions.onEdit(id);
            else if (action === 'delete' && actions.onDelete) actions.onDelete(id);
            else if (action === 'followup' && actions.onFollowUp) actions.onFollowUp(id);
            else if (action === 'more' && actions.onMore) actions.onMore(id);
            else if (actions.onAction) actions.onAction(action, id);
          });
        });
      }

      // 行点击
      if (onRowClick) {
        container.querySelectorAll('tr[data-row-id]').forEach(tr => {
          tr.addEventListener('click', () => {
            onRowClick(tr.dataset.rowId);
          });
        });
      }
    }

    render();

    // 返回容器和刷新方法
    container.refresh = (newData) => {
      filteredData = [...newData];
      render();
    };

    return container;
  },

  // === 状态标签 ===
  Badge(text, type = 'gray') {
    return `<span class="badge badge-${type}"><span class="badge-dot"></span>${Helpers.escapeHtml(text)}</span>`;
  },

  // === 详情卡片 ===
  DetailCard(fields, data) {
    return `<div class="detail-card">${fields.map(f => {
      let value = data[f.key];
      if (f.render) value = f.render(value, data);
      else if (value == null) value = '-';
      else value = Helpers.escapeHtml(String(value));
      return `<div class="detail-field"><div class="field-label">${Helpers.escapeHtml(f.label)}</div><div class="field-value">${value}</div></div>`;
    }).join('')}</div>`;
  },

  // === 标签页 ===
  Tabs(tabs, container) {
    let activeIdx = 0;

    function render() {
      const tabBar = tabs.map((t, i) =>
        `<div class="tab-item ${i === activeIdx ? 'active' : ''}" data-tab="${i}">${Helpers.escapeHtml(t.label)}</div>`
      ).join('');

      container.innerHTML = `
        <div class="tabs">${tabBar}</div>
        <div id="tab-panel" style="padding: var(--space-4) 0;"></div>
      `;

      // 渲染当前 tab 内容
      const panel = container.querySelector('#tab-panel');
      if (tabs[activeIdx].render) {
        const content = tabs[activeIdx].render();
        if (typeof content === 'string') panel.innerHTML = content;
        else if (content instanceof HTMLElement) { panel.innerHTML = ''; panel.appendChild(content); }
      }

      // Tab 切换事件
      container.querySelectorAll('.tab-item').forEach(item => {
        item.addEventListener('click', () => {
          activeIdx = parseInt(item.dataset.tab);
          render();
        });
      });
    }

    render();
    return { switchTo: (idx) => { activeIdx = idx; render(); } };
  }
};
