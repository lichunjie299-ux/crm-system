/* ============================================
   CRM 移动端 - 商机管理
   ============================================ */
const MobileOpportunities = {
  COLLECTION: 'opportunities',
  _allData: [],
  _filteredData: [],
  _searchTerm: '',
  _currentStage: 'all',
  _prefillCustomerId: null,
  _prefillBrandName: '',

  STAGES: ['需求待确认', '需求确认', '方案认可', '确定合作', '合同签约', '赢单', '输单'],
  STAGE_PROB: { '需求待确认': 10, '需求确认': 30, '方案认可': 50, '确定合作': 70, '合同签约': 90, '赢单': 100, '输单': 0 },
  STAGE_MAP: { '需求待确认': 'primary', '需求确认': 'info', '方案认可': 'warning', '确定合作': 'warning', '合同签约': 'info', '赢单': 'success', '输单': 'danger' },
  DATA_VALIDITY_MAP: { '有效': 'success', '未生效': 'warning', '已作废': 'danger' },

  renderList() {
    MobileApp.showTabBar();
    MobileApp.setNav('企服商机', '', '<button class="nav-btn nav-btn-bold" id="nav-add-opp">新建商机</button>');

    const container = MobileApp.getContainer();
    container.innerHTML = '';

    // Stage segmented control
    const segItems = [
      { label: '全部', value: 'all' },
      ...this.STAGES.map(s => ({ label: s, value: s })),
    ];
    const seg = MobileApp.createSegmented(segItems, 0, (value) => {
      this._currentStage = value;
      this._filterData();
      this._renderListContent(container);
    });
    container.appendChild(seg);

    // Search
    container.appendChild(MobileApp.createSearchBar('搜索商机名称...', (term) => {
      this._searchTerm = term;
      this._filterData();
      this._renderListContent(container);
    }));

    const listContainer = document.createElement('div');
    listContainer.id = 'list-container';
    container.appendChild(listContainer);

    this._loadData();
    this._renderListContent(container);

    document.getElementById('nav-add-opp')?.addEventListener('click', () => this.showForm());
  },

  _loadData() {
    this._allData = Store.getAll(this.COLLECTION).filter(o => o.dataValidity !== '已作废');
    this._filterData();
  },

  _filterData() {
    let data = this._allData;
    if (this._currentStage !== 'all') {
      data = data.filter(o => o.stage === this._currentStage);
    }
    if (this._searchTerm) {
      const t = this._searchTerm.toLowerCase();
      data = data.filter(o => o.name && o.name.toLowerCase().includes(t));
    }
    this._filteredData = data;
  },

  _renderListContent(container) {
    const listContainer = container.querySelector('#list-container') || container;
    const data = this._filteredData;

    if (data.length === 0) {
      listContainer.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          <div class="empty-state-text">${this._searchTerm ? '未找到匹配的商机' : '暂未商机数据'}</div>
        </div>`;
      return;
    }

    const group = document.createElement('div');
    group.className = 'list-group';

    data.forEach(item => {
      const customer = Store.getById('customers', item.customerId);
      const stageBadge = MobileApp.stageBadge(item.stage);
      const amount = this._calcAmount(item);
      const closeDate = item.expectedCloseDate ? MobileApp.formatDate(item.expectedCloseDate) : '';
      const isOverdue = this._isOverdue(item);

      const subtitle = [
        customer ? customer.name : '(未知客户)',
        closeDate ? '预计: ' + closeDate : ''
      ].filter(Boolean).join(' | ');

      const right = stageBadge + '<br><span style="font-size:12px;color:var(--ios-text-secondary)">' + MobileApp.formatMoney(amount) + '</span>'
        + (isOverdue ? '<br><span style="font-size:11px;color:var(--ios-red)">⚠ 超期</span>' : '');

      const cell = MobileApp.createListCell(
        item.name || '(未填写)',
        subtitle,
        right,
        () => location.hash = `#/mobile/opportunities/view/${item.id}`
      );
      group.appendChild(cell);
    });

    listContainer.innerHTML = '';
    listContainer.appendChild(group);
  },

  renderDetail(id) {
    const item = Store.getById(this.COLLECTION, id);
    if (!item) { MobileApp.toast('商机不存在', 'error'); location.hash = '#/mobile/opportunities'; return; }

    MobileApp.hideTabBar();
    MobileApp.setNav(item.name || '商机详情', '');
    MobileApp.setNavBack(() => location.hash = '#/mobile/opportunities');

    const customer = Store.getById('customers', item.customerId);
    const amount = this._calcAmount(item);
    const contact = item.contactId ? Store.getById('contacts', item.contactId) : null;
    const stageIndex = this.STAGES.indexOf(item.stage);
    const isActive = item.stage !== '赢单' && item.stage !== '输单';
    const isOverdue = this._isOverdue(item);

    const container = MobileApp.getContainer();

    // Build stage progress bar
    let stageHtml = '<div class="stage-progress">';
    this.STAGES.forEach((s, i) => {
      let cls = 'pending';
      if (i < stageIndex) cls = 'completed';
      else if (i === stageIndex) cls = 'current';
      stageHtml += `<div class="stage-step">
        <div class="stage-dot ${cls}">${cls === 'completed' ? '✓' : i + 1}</div>
        <div class="stage-label">${s}</div>
      </div>`;
      if (i < this.STAGES.length - 1) {
        stageHtml += `<div class="stage-line ${i < stageIndex ? 'completed' : 'pending'}"></div>`;
      }
    });
    stageHtml += '</div>';

    // Products display
    let productsHtml = '-';
    if (item.intendedProducts && Array.isArray(item.intendedProducts) && item.intendedProducts.length > 0) {
      productsHtml = item.intendedProducts.map(p =>
        `<div style="padding:2px 0">${Helpers.escapeHtml(p.name || p.productName || '')}：${MobileApp.formatMoney(p.amount || 0)}</div>`
      ).join('');
    } else if (typeof item.intendedProducts === 'string' && item.intendedProducts) {
      productsHtml = Helpers.escapeHtml(item.intendedProducts);
    }

    let html = `
      <!-- Header -->
      <div style="background:#fff;margin:0 0 16px;padding:20px 16px;border-bottom:0.5px solid var(--ios-separator-light)">
        <div style="font-size:22px;font-weight:600;margin-bottom:4px">${Helpers.escapeHtml(item.name || '(未填写)')}
          ${isOverdue ? '<span style="font-size:14px;color:var(--ios-red);margin-left:8px">⚠ 超期</span>' : ''}
        </div>
        <div style="font-size:14px;color:var(--ios-text-tertiary);display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:8px">
          ${MobileApp.stageBadge(item.stage)}
          ${MobileApp.badge(item.dataValidity || '有效', this.DATA_VALIDITY_MAP[item.dataValidity] || 'success')}
          ${customer ? `<span>${Helpers.escapeHtml(customer.name)}</span>` : ''}
        </div>
        <div style="font-size:24px;font-weight:700;color:var(--ios-blue)">${MobileApp.formatMoney(amount)}</div>
      </div>

      <!-- Stage Progress -->
      <div class="detail-card">
        <div class="detail-card-header">
          <svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          商机阶段
        </div>
        ${stageHtml}
        ${MobileApp.detailRow('当前阶段', MobileApp.stageBadge(item.stage))}
        ${MobileApp.detailRow('预计成交时间', item.expectedCloseDate ? MobileApp.formatDate(item.expectedCloseDate) : '-')}
        ${MobileApp.detailRow('成交概率', this.STAGE_PROB[item.stage] + '%')}
      </div>
    `;

    // Basic info
    html += `
      <div class="detail-card">
        <div class="detail-card-header">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><circle cx="12" cy="8" r="1" fill="currentColor"/></svg>
          基本信息
        </div>
        ${MobileApp.detailRow('商机名称', item.name)}
        ${MobileApp.detailRow('客户名称', customer ? customer.name : '-')}
        ${MobileApp.detailRow('品牌名', item.brandName || '-')}
        ${MobileApp.detailRow('商机来源', item.source ? MobileApp.badge(item.source, 'info') : '-')}
        ${MobileApp.detailRow('采购类型', item.purchaseType || '-')}
        ${MobileApp.detailRow('客户需求', item.customerNeed || '-')}
      </div>

      <!-- Products -->
      <div class="detail-card">
        <div class="detail-card-header">
          <svg viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          意向产品及金额
        </div>
        <div class="detail-row"><span class="detail-label">产品及金额</span><span class="detail-value">${productsHtml}</span></div>
        ${MobileApp.detailRow('预计总额', MobileApp.formatMoney(amount))}
      </div>

      <!-- Key Actions -->
      <div class="detail-card">
        <div class="detail-card-header">
          <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          关键动作
        </div>
        ${MobileApp.detailRow('本月关键动作', item.keyAction || '-')}
        ${MobileApp.detailRow('关键动作日期', item.keyActionDate ? MobileApp.formatDate(item.keyActionDate) : '-')}
        ${MobileApp.detailRow('备注', item.remark || '-')}
      </div>

      <!-- Contact -->
      <div class="detail-card">
        <div class="detail-card-header">
          <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
          关联联系人
        </div>
        ${MobileApp.detailRow('联系人', contact ? contact.name : '-')}
        ${contact ? MobileApp.detailRow('联系方式', [contact.phone, contact.email].filter(Boolean).join(' / ') || '-') : ''}
      </div>

      <!-- System -->
      <div class="detail-card" style="margin-bottom:80px">
        <div class="detail-card-header">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          系统信息
        </div>
        ${MobileApp.detailRow('数据有效性', MobileApp.badge(item.dataValidity || '有效', this.DATA_VALIDITY_MAP[item.dataValidity] || 'success'))}
        ${MobileApp.detailRow('创建时间', MobileApp.formatDate(item.createdAt))}
        ${MobileApp.detailRow('更新时间', MobileApp.formatDate(item.updatedAt))}
      </div>
    `;

    container.innerHTML = html;

    // Bottom action bar
    const bottomBar = document.createElement('div');
    bottomBar.className = 'bottom-bar';
    bottomBar.innerHTML = `
      <button class="bottom-btn bottom-btn-secondary" id="btn-edit">编辑</button>
      <button class="bottom-btn bottom-btn-secondary" id="btn-followup">写跟进</button>
      <button class="bottom-btn bottom-btn-danger" id="btn-void">作废</button>
    `;
    container.appendChild(bottomBar);

    bottomBar.querySelector('#btn-edit')?.addEventListener('click', () => this.showForm(item));
    bottomBar.querySelector('#btn-followup')?.addEventListener('click', () => this._writeFollowUp(item));
    bottomBar.querySelector('#btn-void')?.addEventListener('click', () => this._handleVoid(item));
  },

  showForm(item, prefillCustomerId) {
    const isEdit = !!item;
    const customerId = prefillCustomerId || (item ? item.customerId : this._prefillCustomerId) || '';

    // Build customer options
    const customers = Store.getAll('customers')
      .filter(c => c.poolStatus !== 'in_pool' && c.poolStatus !== 'pending_review')
      .map(c => ({ value: c.id, label: c.name }));

    // Build contact options based on selected customer
    const contacts = customerId ? Store.query('contacts', c => c.customerId === customerId).map(c => ({ value: c.id, label: c.name })) : [];

    const fields = [
      { key: 'name', label: '商机名称', type: 'text', required: true, placeholder: '如：XX公司ERP项目' },
      { key: 'customerId', label: '客户名称', type: 'select', required: true, options: customers },
      { key: 'brandName', label: '品牌名', type: 'text', required: true, placeholder: '品牌名称' },
      { key: 'source', label: '商机来源', type: 'select', required: true, options: ['推广', '自拓'] },
      { key: 'purchaseType', label: '采购类型', type: 'select', required: true, options: ['新开', '续约', '增购', '增值'] },
      { key: 'stage', label: '商机阶段', type: 'select', required: true, options: this.STAGES },
      { key: 'expectedCloseDate', label: '预计成交时间', type: 'date', required: true },
      { key: 'customerNeed', label: '客户需求', type: 'textarea', required: true, placeholder: '详细描述客户的核心诉求、痛点或采购目标' },
      { key: 'keyAction', label: '本月关键动作', type: 'text', required: true, placeholder: '本月关键动作' },
      { key: 'keyActionDate', label: '关键动作日期', type: 'date', required: true },
      { key: 'contactId', label: '关联联系人', type: 'select', options: contacts },
      { key: 'remark', label: '备注', type: 'textarea', placeholder: '备注信息...' },
    ];

    const preData = item ? { ...item } : {
      customerId,
      brandName: this._prefillBrandName || '',
      source: '自拓',
      purchaseType: '新开',
      stage: '需求待确认',
    };

    // Also set intendedProducts since the existing desktop version expects it
    if (!preData.intendedProducts) {
      preData.intendedProducts = [];
    }

    MobileApp.showForm({
      title: isEdit ? '编辑商机' : '新建商机',
      fields,
      data: preData,
      onSubmit: (formData) => {
        // Handle intendedProducts as a simple text fallback since mobile doesn't have the complex product selector
        if (typeof formData.intendedProducts === 'string' || !formData.intendedProducts) {
          formData.intendedProducts = formData.intendedProducts ? [{ name: formData.intendedProducts, amount: 0 }] : [];
        }
        if (isEdit) {
          Store.update(this.COLLECTION, item.id, formData);
          MobileApp.toast('商机已更新');
        } else {
          Store.create(this.COLLECTION, formData);
          MobileApp.toast('商机已创建');
        }
        this._prefillCustomerId = null;
        this._prefillBrandName = '';
        location.hash = '#/mobile/opportunities';
      }
    });
  },

  _writeFollowUp(item) {
    MobileApp.showFollowUpForm('opportunity', item.id, () => {
      this.renderDetail(item.id);
    });
  },

  _handleVoid(item) {
    MobileApp.confirm({
      title: '作废商机',
      message: `确定作废商机「${item.name}」吗？`,
      destructive: true,
      confirmText: '确认作废',
      onConfirm: () => {
        Store.update(this.COLLECTION, item.id, { dataValidity: '已作废' });
        MobileApp.toast('商机已作废');
        location.hash = '#/mobile/opportunities';
      }
    });
  },

  _calcAmount(item) {
    if (!item || !item.intendedProducts) return 0;
    if (typeof item.intendedProducts === 'string') return 0;
    if (Array.isArray(item.intendedProducts)) {
      return item.intendedProducts.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    }
    return 0;
  },

  _isOverdue(item) {
    if (item.stage === '赢单' || item.stage === '输单') return false;
    if (!item.expectedCloseDate) return false;
    const expected = new Date(item.expectedCloseDate);
    const now = new Date();
    return now > expected;
  }
};
