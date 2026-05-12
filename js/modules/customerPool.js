/* ============================================
   CRM 系统 - 客户公海模块
   ============================================ */
const CustomerPool = {
  COLLECTION: 'customers',

  REASON_MAP: {
    '超90天未成单': 'warning',
    '超3天无拜访': 'danger',
    '手动放入公海': 'info',
    '超90天未成单（待审核）': 'purple',
  },

  // 获取公海中的客户
  getPoolCustomers() {
    return Store.query(this.COLLECTION, c => c.poolStatus === 'in_pool');
  },

  // 获取待审核的客户
  getPendingReviewCustomers() {
    return Store.query(this.COLLECTION, c => c.poolStatus === 'pending_review');
  },

  renderList(activeTab) {
    UI.setPageTitle('客户公海');
    const poolData = this.getPoolCustomers();
    const pendingData = this.getPendingReviewCustomers();
    const currentTab = activeTab || 'pool';

    const el = document.createElement('div');
    el.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <h2 class="page-title">客户公海</h2>
          <p class="page-subtitle">公海 ${poolData.length} 个客户 · 待审核 ${pendingData.length} 个客户 · 90天未成单或3天未拜访的客户将自动掉入公海，高阶段商机需上级审核</p>
        </div>
        <div class="page-header-right">
          <button class="btn btn-secondary" id="btn-check-pool"><svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg> 立即检查掉保</button>
        </div>
      </div>

      <div class="pool-tabs">
        <button class="pool-tab ${currentTab === 'pool' ? 'active' : ''}" data-tab="pool">
          客户公海 <span class="pool-tab-count">${poolData.length}</span>
        </button>
        <button class="pool-tab ${currentTab === 'pending' ? 'active' : ''}" data-tab="pending">
          待审核 <span class="pool-tab-count pending">${pendingData.length}</span>
        </button>
      </div>

      <div id="table-container"></div>
    `;

    // 根据Tab渲染不同表格
    if (currentTab === 'pool') {
      this._renderPoolTable(el, poolData);
    } else {
      this._renderPendingTable(el, pendingData);
    }

    // Tab切换
    el.querySelectorAll('.pool-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.renderList(tab.dataset.tab);
      });
    });

    el.querySelector('#btn-check-pool')?.addEventListener('click', () => {
      const count = App.checkPoolRules();
      UI.toast(`检查完成，新增 ${count} 条掉保/审核记录`);
      this.renderList(currentTab);
    });

    UI.render(el);
  },

  // 渲染公海客户表格
  _renderPoolTable(el, data) {
    const table = Components.DataTable({
      columns: [
        { key: 'name', label: '客户名称', sortable: true, render: (v, item) => {
          const brandTag = item.isBrandCustomer === '是' && item.brandName ? ` <span class="badge badge-warning" style="font-size:10px">品牌</span>` : '';
          return `<span class="cell-link" data-id="${item.id}">${Helpers.escapeHtml(v || '')}</span>${brandTag}`;
        }},
        { key: 'type', label: '类型', width: '70px' },
        { key: 'businessLine', label: '业务线', width: '100px' },
        { key: 'productLine', label: '产品线', width: '90px' },
        { key: 'industry', label: '行业', width: '90px' },
        { key: 'storeCount', label: '线下门店数', width: '80px' },
        { key: 'isBrandCustomer', label: '品牌客户', width: '65px', render: v => v === '是' ? `<span style="color:var(--warning)">✓ 是</span>` : '否' },
        { key: 'poolReason', label: '掉保原因', width: '130px', render: v => Components.Badge(v || '超90天未成单', this.REASON_MAP[v] || 'warning') },
        { key: 'poolDate', label: '掉保时间', width: '100px', sortable: true, render: v => Helpers.formatDate(v) },
        { key: 'originalAssignee', label: '原负责人', width: '80px', render: v => v ? Helpers.escapeHtml(v) : '-' },
        { key: '_poolOpps', label: '掉保商机数', width: '85px', render: (_, item) => {
          const count = Store.count('opportunities', o => o.customerId === item.id && o.poolStatus === 'in_pool');
          return count > 0 ? `<span class="text-primary" style="font-weight:600">${count}</span>` : '0';
        }},
        { key: 'createdAt', label: '创建时间', width: '100px', sortable: true, render: v => Helpers.formatDate(v) },
      ],
      data,
      searchKeys: ['name', 'industry', 'phone'],
      searchPlaceholder: '搜索客户名称、行业...',
      emptyText: '公海暂无客户',
      actions: {
        onEdit: null,
        onView: (id) => this._showClaimConfirm(id),
        onMore: (id) => this._showClaimConfirm(id),
      },
      onRowClick: (id) => this._showClaimConfirm(id),
      sortKey: 'poolDate',
      sortOrder: 'desc',
    });

    const container = el.querySelector('#table-container');
    container.innerHTML = '';
    container.appendChild(table);

    el.addEventListener('click', (e) => {
      const link = e.target.closest('.cell-link[data-id]');
      if (link) { e.stopPropagation(); this._showClaimConfirm(link.dataset.id); }
    });
  },

  // 渲染待审核客户表格
  _renderPendingTable(el, data) {
    const table = Components.DataTable({
      columns: [
        { key: 'name', label: '客户名称', sortable: true, render: (v, item) => {
          const brandTag = item.isBrandCustomer === '是' && item.brandName ? ` <span class="badge badge-warning" style="font-size:10px">品牌</span>` : '';
          return `<span class="cell-link" data-id="${item.id}">${Helpers.escapeHtml(v || '')}</span>${brandTag}`;
        }},
        { key: 'type', label: '类型', width: '70px' },
        { key: 'businessLine', label: '业务线', width: '100px' },
        { key: 'productLine', label: '产品线', width: '90px' },
        { key: 'industry', label: '行业', width: '90px' },
        { key: 'storeCount', label: '线下门店数', width: '80px' },
        { key: 'isBrandCustomer', label: '品牌客户', width: '65px', render: v => v === '是' ? `<span style="color:var(--warning)">✓ 是</span>` : '否' },
        { key: 'poolReason', label: '触发原因', width: '150px', render: v => Components.Badge(v || '超90天未成单（待审核）', this.REASON_MAP[v] || 'purple') },
        { key: 'poolDate', label: '触发时间', width: '100px', sortable: true, render: v => Helpers.formatDate(v) },
        { key: 'originalAssignee', label: '原负责人', width: '80px', render: v => v ? Helpers.escapeHtml(v) : '-' },
        { key: '_highStageOpps', label: '高阶段商机', width: '110px', render: (_, item) => {
          const HIGH_STAGES = ['方案认可', '确定合作', '合同签约', '赢单'];
          const opps = Store.query('opportunities', o => o.customerId === item.id && HIGH_STAGES.includes(o.stage) && o.poolStatus !== 'in_pool');
          if (opps.length === 0) return '-';
          return opps.map(o => {
            const type = Opportunities.STAGE_TYPE[o.stage] || 'gray';
            return Components.Badge(o.stage, type);
          }).join(' ');
        }},
        { key: 'createdAt', label: '创建时间', width: '110px', sortable: true, render: v => Helpers.formatDate(v) },
      ],
      data,
      searchKeys: ['name', 'industry', 'phone'],
      searchPlaceholder: '搜索客户名称、行业...',
      emptyText: '暂无待审核客户',
      actions: {
        onEdit: null,
        onView: (id) => this._showReviewActions(id),
        onMore: (id) => this._showReviewActions(id),
      },
      onRowClick: (id) => this._showReviewActions(id),
      sortKey: 'poolDate',
      sortOrder: 'desc',
    });

    const container = el.querySelector('#table-container');
    container.innerHTML = '';
    container.appendChild(table);

    el.addEventListener('click', (e) => {
      const link = e.target.closest('.cell-link[data-id]');
      if (link) { e.stopPropagation(); this._showReviewActions(link.dataset.id); }
    });
  },

  _showClaimConfirm(id) {
    const customer = Store.getById(this.COLLECTION, id);
    if (!customer || customer.poolStatus !== 'in_pool') {
      UI.toast('该客户不在公海中', 'error');
      this.renderList('pool');
      return;
    }

    const poolOpps = Store.query('opportunities', o => o.customerId === id && o.poolStatus === 'in_pool');
    const oppInfo = poolOpps.length > 0 ? `\n同时将认领 ${poolOpps.length} 个关联商机。` : '';

    UI.confirm({
      title: '认领客户',
      message: `确定要从公海认领客户「${customer.name}」吗？认领后客户将变为"活跃"状态。${oppInfo}`,
      type: 'warning',
      confirmText: '确认认领',
      onConfirm: () => this.handleClaim(id),
    });
  },

  _showReviewActions(id) {
    const customer = Store.getById(this.COLLECTION, id);
    if (!customer || customer.poolStatus !== 'pending_review') {
      UI.toast('该客户不在待审核列表中', 'error');
      this.renderList('pending');
      return;
    }

    const HIGH_STAGES = ['方案认可', '确定合作', '合同签约', '赢单'];
    const highOpps = Store.query('opportunities', o => o.customerId === id && HIGH_STAGES.includes(o.stage) && o.poolStatus !== 'in_pool');
    const oppInfo = highOpps.map(o => `${o.name}（${o.stage}）`).join('、');

    const contentEl = document.createElement('div');
    contentEl.innerHTML = `
      <div class="convert-preview">
        <h4>审核信息</h4>
        <div class="convert-field"><span class="label">客户</span><span class="value">${Helpers.escapeHtml(customer.name)}</span></div>
        <div class="convert-field"><span class="label">触发原因</span><span class="value">${Helpers.escapeHtml(customer.poolReason || '超90天未成单')}</span></div>
        <div class="convert-field"><span class="label">原负责人</span><span class="value">${customer.originalAssignee ? Helpers.escapeHtml(customer.originalAssignee) : '-'}</span></div>
        <div class="convert-field"><span class="label">高阶段商机</span><span class="value">${oppInfo || '无'}</span></div>
      </div>
      <p style="font-size:var(--text-sm);color:var(--text-secondary);margin-bottom:var(--space-4)">
        审核通过：客户保留，不掉入公海<br>
        审核驳回：客户及关联商机掉入公海
      </p>
    `;

    const footer = `
      <button class="btn btn-danger" id="review-reject">审核驳回（掉保）</button>
      <button class="btn btn-success" id="review-approve">审核通过（保留）</button>
    `;

    const { overlay, close } = UI.modal({ title: '客户掉保审核', content: contentEl, footer, size: 'default' });

    overlay.querySelector('#review-approve').addEventListener('click', () => {
      this.handleReviewApprove(id);
      close();
    });

    overlay.querySelector('#review-reject').addEventListener('click', () => {
      this.handleReviewReject(id);
      close();
    });
  },

  // 审核通过 - 客户保留，不掉入公海
  handleReviewApprove(id) {
    const customer = Store.getById(this.COLLECTION, id);
    if (!customer) return;

    Store.update(this.COLLECTION, id, {
      poolStatus: '',
      poolDate: null,
      poolReason: '',
      originalAssignee: '',
      status: '活跃',
      reviewApprovedAt: Helpers.now(),
    });

    Store.create('followups', {
      relatedType: 'customer',
      relatedId: id,
      type: '其他',
      content: '客户掉保审核通过，客户保留，不掉入公海',
    });

    UI.toast('审核通过，客户已保留');
    this.renderList('pending');
  },

  // 审核驳回 - 客户及关联商机掉入公海
  handleReviewReject(id) {
    const customer = Store.getById(this.COLLECTION, id);
    if (!customer) return;

    const reason = '超90天未成单';

    Store.update(this.COLLECTION, id, {
      poolStatus: 'in_pool',
      poolDate: Helpers.now(),
      poolReason: reason,
      originalAssignee: customer.originalAssignee || customer.assignee || '',
      status: '公海',
    });

    // 关联的活跃商机一起掉入公海
    const activeOpps = Store.query('opportunities', o => o.customerId === id && o.stage !== '赢单' && o.stage !== '输单' && o.poolStatus !== 'in_pool');
    activeOpps.forEach(opp => {
      Store.update('opportunities', opp.id, {
        poolStatus: 'in_pool',
        poolDate: Helpers.now(),
        poolReason: `客户掉保（${reason}，审核驳回）`,
        originalAssignee: opp.assignee || '',
      });
    });

    Store.create('followups', {
      relatedType: 'customer',
      relatedId: id,
      type: '其他',
      content: `客户掉保审核驳回，客户及 ${activeOpps.length} 个关联商机掉入公海`,
    });

    UI.toast('审核驳回，客户已掉入公海');
    this.renderList('pending');
  },

  handleClaim(id) {
    const customer = Store.getById(this.COLLECTION, id);
    if (!customer) return;

    Store.update(this.COLLECTION, id, {
      poolStatus: '',
      poolDate: null,
      poolReason: '',
      originalAssignee: '',
      status: '活跃',
    });

    const poolOpps = Store.query('opportunities', o => o.customerId === id && o.poolStatus === 'in_pool');
    poolOpps.forEach(opp => {
      Store.update('opportunities', opp.id, {
        poolStatus: '',
        poolDate: null,
        poolReason: '',
        originalAssignee: '',
      });
    });

    Store.create('followups', {
      relatedType: 'customer',
      relatedId: id,
      type: '其他',
      content: `客户从公海中被认领${poolOpps.length > 0 ? `，同时认领 ${poolOpps.length} 个商机` : ''}`,
    });

    UI.toast('客户认领成功');
    this.renderList('pool');
  },

  // 将客户手动放入公海（同时带入关联商机）
  moveToPool(id, reason) {
    const customer = Store.getById(this.COLLECTION, id);
    if (!customer) return;

    Store.update(this.COLLECTION, id, {
      poolStatus: 'in_pool',
      poolDate: Helpers.now(),
      poolReason: reason || '手动放入公海',
      originalAssignee: customer.assignee || '',
      status: '公海',
    });

    const activeOpps = Store.query('opportunities', o => o.customerId === id && o.stage !== '赢单' && o.stage !== '输单' && o.poolStatus !== 'in_pool');
    activeOpps.forEach(opp => {
      Store.update('opportunities', opp.id, {
        poolStatus: 'in_pool',
        poolDate: Helpers.now(),
        poolReason: `客户掉保（${reason || '手动放入公海'}）`,
        originalAssignee: opp.assignee || '',
      });
    });

    Store.create('followups', {
      relatedType: 'customer',
      relatedId: id,
      type: '其他',
      content: `客户被放入公海，原因：${reason || '手动放入公海'}，${activeOpps.length} 个关联商机一并掉入公海`,
    });

    return activeOpps.length;
  },

  init() {
    Router.register('#/customer-pool', () => this.renderList());
  }
};
