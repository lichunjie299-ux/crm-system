/* ============================================
   CRM 系统 - 线索公海模块
   ============================================ */
const LeadPool = {
  COLLECTION: 'leads',

  REASON_MAP: {
    '超21天未转客户': 'warning',
    '手动放入公海': 'info',
  },

  // 获取公海中的线索
  getPoolLeads() {
    return Store.query(this.COLLECTION, l => l.poolStatus === 'in_pool');
  },

  // 渲染内容到容器（供线索管理Tab内嵌使用）
  renderListContent(containerEl) {
    const data = this.getPoolLeads();
    const el = containerEl || document.createElement('div');

    el.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <h2 class="page-title">线索公海</h2>
          <p class="page-subtitle">公海中共 ${data.length} 条线索，21天未转客户的线索将自动掉入公海</p>
        </div>
        <div class="page-header-right">
          <button class="btn btn-secondary" id="btn-check-pool"><svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg> 立即检查掉保</button>
        </div>
      </div>
      <div id="pool-table-container"></div>
    `;

    const table = Components.DataTable({
      columns: [
        { key: 'customerName', label: '客户名称', sortable: true, render: (v, item) => `<span class="cell-link" data-id="${item.id}">${Helpers.escapeHtml(v || '(未填写)')}</span>` },
        { key: 'contactInfo', label: '联系人及方式', width: '150px' },
        { key: 'region', label: '地区', width: '80px' },
        { key: 'bizLine', label: '业务线', width: '90px', render: v => v ? Components.Badge(v, Leads.BIZ_LINE_MAP[v] || 'gray') : '-' },
        { key: 'source', label: '线索来源', width: '90px', render: v => v ? Components.Badge(v, 'info') : '-' },
        { key: 'poolReason', label: '掉保原因', width: '140px', render: v => Components.Badge(v || '超21天未转客户', this.REASON_MAP[v] || 'warning') },
        { key: 'poolDate', label: '掉保时间', width: '110px', sortable: true, render: v => Helpers.formatDate(v) },
        { key: 'originalAssignee', label: '原负责人', width: '90px', render: v => v ? Helpers.escapeHtml(v) : '-' },
      ],
      data,
      searchKeys: ['customerName', 'contactInfo', 'region'],
      searchPlaceholder: '搜索客户名称、联系人、地区...',
      emptyText: '公海暂无线索',
      actions: {
        onEdit: null,
        onView: (id) => this._showClaimConfirm(id),
        onMore: (id) => this._showClaimConfirm(id),
      },
      onRowClick: (id) => this._showClaimConfirm(id),
      sortKey: 'poolDate',
      sortOrder: 'desc',
    });

    el.querySelector('#pool-table-container').appendChild(table);
    el.querySelector('#btn-check-pool')?.addEventListener('click', () => {
      const count = App.checkPoolRules();
      UI.toast(`检查完成，新增 ${count} 条掉保记录`);
      Leads.renderPage('pool');
    });
    el.addEventListener('click', (e) => {
      const link = e.target.closest('.cell-link[data-id]');
      if (link) { e.stopPropagation(); this._showClaimConfirm(link.dataset.id); }
    });

    if (!containerEl) UI.render(el);
  },

  renderList() {
    UI.setPageTitle('线索公海');
    const data = this.getPoolLeads();

    const el = document.createElement('div');
    el.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <h2 class="page-title">线索公海</h2>
          <p class="page-subtitle">公海中共 ${data.length} 条线索，21天未转客户的线索将自动掉入公海</p>
        </div>
        <div class="page-header-right">
          <button class="btn btn-secondary" id="btn-check-pool"><svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg> 立即检查掉保</button>
        </div>
      </div>
      <div id="table-container"></div>
    `;

    const table = Components.DataTable({
      columns: [
        { key: 'customerName', label: '客户名称', sortable: true, render: (v, item) => `<span class="cell-link" data-id="${item.id}">${Helpers.escapeHtml(v || '(未填写)')}</span>` },
        { key: 'contactInfo', label: '联系人及方式', width: '150px' },
        { key: 'region', label: '地区', width: '80px' },
        { key: 'bizLine', label: '业务线', width: '90px', render: v => v ? Components.Badge(v, Leads.BIZ_LINE_MAP[v] || 'gray') : '-' },
        { key: 'source', label: '线索来源', width: '90px', render: v => v ? Components.Badge(v, 'info') : '-' },
        { key: 'poolReason', label: '掉保原因', width: '140px', render: v => Components.Badge(v || '超21天未转客户', this.REASON_MAP[v] || 'warning') },
        { key: 'poolDate', label: '掉保时间', width: '110px', sortable: true, render: v => Helpers.formatDate(v) },
        { key: 'originalAssignee', label: '原负责人', width: '90px', render: v => v ? Helpers.escapeHtml(v) : '-' },
      ],
      data,
      searchKeys: ['customerName', 'contactInfo', 'region'],
      searchPlaceholder: '搜索客户名称、联系人、地区...',
      emptyText: '公海暂无线索',
      actions: {
        onEdit: null,
        onView: (id) => this._showClaimConfirm(id),
        onMore: (id) => this._showClaimConfirm(id),
      },
      onRowClick: (id) => this._showClaimConfirm(id),
      sortKey: 'poolDate',
      sortOrder: 'desc',
    });

    el.querySelector('#table-container').appendChild(table);

    el.querySelector('#btn-check-pool')?.addEventListener('click', () => {
      const count = App.checkPoolRules();
      UI.toast(`检查完成，新增 ${count} 条掉保记录`);
      this.renderList();
    });

    el.addEventListener('click', (e) => {
      const link = e.target.closest('.cell-link[data-id]');
      if (link) { e.stopPropagation(); this._showClaimConfirm(link.dataset.id); }
    });

    UI.render(el);
  },

  _showClaimConfirm(id) {
    const lead = Store.getById(this.COLLECTION, id);
    if (!lead || lead.poolStatus !== 'in_pool') {
      UI.toast('该线索不在公海中', 'error');
      this.renderList();
      return;
    }

    UI.confirm({
      title: '认领线索',
      message: `确定要从公海认领线索「${lead.customerName || lead.contactInfo}」吗？认领后线索将变为"跟进中"状态，您将成为新的负责人。`,
      type: 'warning',
      confirmText: '确认认领',
      onConfirm: () => this.handleClaim(id),
    });
  },

  handleClaim(id) {
    const lead = Store.getById(this.COLLECTION, id);
    if (!lead) return;

    Store.update(this.COLLECTION, id, {
      poolStatus: '',
      poolDate: null,
      poolReason: '',
      originalAssignee: '',
      status: '跟进中',
    });

    Store.create('followups', {
      relatedType: 'lead',
      relatedId: id,
      type: '其他',
      content: `线索从公海中被认领`,
    });

    UI.toast('线索认领成功');
    this.renderList();
  },

  // 将线索手动放入公海
  moveToPool(id, reason) {
    const lead = Store.getById(this.COLLECTION, id);
    if (!lead) return;

    Store.update(this.COLLECTION, id, {
      poolStatus: 'in_pool',
      poolDate: Helpers.now(),
      poolReason: reason || '手动放入公海',
      originalAssignee: lead.assignee || '',
    });

    Store.create('followups', {
      relatedType: 'lead',
      relatedId: id,
      type: '其他',
      content: `线索被放入公海，原因：${reason || '手动放入公海'}`,
    });
  },

  init() {
    Router.register('#/lead-pool', () => this.renderList());
  }
};
