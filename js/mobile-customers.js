/* ============================================
   CRM 移动端 - 客户管理
   ============================================ */
const MobileCustomers = {
  COLLECTION: 'customers',
  _currentSea: 'os',
  _allData: [],
  _filteredData: [],
  _searchTerm: '',

  STATUS_MAP: { '活跃': 'success', '沉默': 'warning', '流失': 'danger', '公海': 'gray' },

  FIELD_LABELS: {
    name: '客户名称', type: '客户类型', businessLine: '业务线', productLine: '产品线',
    industry: '行业', region: '地区', address: '地址', storeCount: '线下门店数',
    isBrandCustomer: '是否品牌客户', brandName: '品牌名', customerSource: '线索来源',
    status: '状态', assignee: '负责人', phone: '电话', email: '邮箱'
  },

  renderList(sea) {
    this._currentSea = sea || 'os';
    MobileApp.showTabBar();
    MobileApp.setNav('客户管理', '', '<button class="nav-btn nav-btn-bold" id="nav-add-customer">新建客户</button>');

    const container = MobileApp.getContainer();
    container.innerHTML = '';

    // Segmented control
    const segItems = [
      { label: 'OS-私海', value: 'os' },
      { label: 'IS-私海', value: 'is' },
      { label: '零售私海', value: 'ls' },
    ];
    const seaIndex = segItems.findIndex(s => s.value === this._currentSea);
    const seg = MobileApp.createSegmented(segItems, seaIndex >= 0 ? seaIndex : 0, (value) => {
      this._currentSea = value;
      this._loadData();
      this._renderListContent(container);
    });
    container.appendChild(seg);

    // Search bar
    container.appendChild(MobileApp.createSearchBar('搜索客户名称、行业...', (term) => {
      this._searchTerm = term;
      this._filterData();
      this._renderListContent(container);
    }));

    const listContainer = document.createElement('div');
    listContainer.id = 'list-container';
    container.appendChild(listContainer);

    this._loadData();
    this._renderListContent(container);

    document.getElementById('nav-add-customer')?.addEventListener('click', () => this._showForm());
  },

  _loadData() {
    const sea = this._currentSea;
    let all = Store.getAll(this.COLLECTION);
    if (sea === 'os') {
      all = all.filter(c => (!c.privateSea || c.privateSea === 'os') && c.poolStatus !== 'in_pool' && c.poolStatus !== 'pending_review');
    } else {
      all = all.filter(c => c.privateSea === sea);
    }
    this._allData = all.filter(c => c.poolStatus !== 'in_pool');
    this._filterData();
  },

  _filterData() {
    if (!this._searchTerm) {
      this._filteredData = [...this._allData];
    } else {
      const t = this._searchTerm.toLowerCase();
      this._filteredData = this._allData.filter(c =>
        (c.name && c.name.toLowerCase().includes(t)) ||
        (c.industry && c.industry.toLowerCase().includes(t))
      );
    }
  },

  _renderListContent(container) {
    const listContainer = container.querySelector('#list-container') || container;
    const data = this._filteredData;

    if (data.length === 0) {
      listContainer.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
          <div class="empty-state-text">${this._searchTerm ? '未找到匹配的客户' : '暂未客户数据'}</div>
        </div>`;
      return;
    }

    const group = document.createElement('div');
    group.className = 'list-group';

    data.forEach(item => {
      const statusBadge = MobileApp.badge(item.status || '活跃', this.STATUS_MAP[item.status] || 'success');
      const brandTag = item.isBrandCustomer === '是' ? MobileApp.badge('品牌', 'warning') : '';
      const storeCount = item.storeCount ? item.storeCount : '';
      const industry = item.industry || '';

      const subtitle = [item.type, industry, storeCount].filter(Boolean).join(' | ');
      const right = statusBadge + (brandTag ? ' ' + brandTag : '');

      const cell = MobileApp.createListCell(
        item.name || '(未填写)',
        subtitle,
        right,
        () => location.hash = `#/mobile/customers/view/${item.id}`
      );
      group.appendChild(cell);
    });

    listContainer.innerHTML = '';
    listContainer.appendChild(group);
  },

  renderDetail(id) {
    const item = Store.getById(this.COLLECTION, id);
    if (!item) { MobileApp.toast('客户不存在', 'error'); location.hash = '#/mobile/customers'; return; }

    MobileApp.hideTabBar();
    MobileApp.setNav(item.name || '客户详情', '');
    MobileApp.setNavBack(() => location.hash = `#/mobile/customers`);

    // Get contact info
    const contact = item.primaryContactId ? Store.getById('contacts', item.primaryContactId) : null;
    // Get opportunity count
    const oppCount = Store.count('opportunities', o => o.customerId === id);

    const container = MobileApp.getContainer();

    let html = `
      <!-- Header -->
      <div style="background:#fff;margin:0 0 16px;padding:20px 16px;border-bottom:0.5px solid var(--ios-separator-light)">
        <div style="font-size:22px;font-weight:600;margin-bottom:4px">${Helpers.escapeHtml(item.name || '(未填写)')}</div>
        <div style="font-size:14px;color:var(--ios-text-tertiary);display:flex;gap:8px;flex-wrap:wrap;align-items:center">
          ${MobileApp.badge(item.status || '活跃', this.STATUS_MAP[item.status] || 'success')}
          ${MobileApp.badge(item.type || '企业客户', 'info')}
          ${item.industry ? `<span>${Helpers.escapeHtml(item.industry)}</span>` : ''}
          ${item.region ? `<span>${Helpers.escapeHtml(item.region)}</span>` : ''}
        </div>
      </div>

      <!-- Business Info -->
      <div class="detail-card">
        <div class="detail-card-header">
          <svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
          业务信息
        </div>
        ${MobileApp.detailRow('客户名称', item.name)}
        ${MobileApp.detailRow('客户类型', item.type)}
        ${MobileApp.detailRow('业务线', item.businessLine)}
        ${MobileApp.detailRow('产品线', item.productLine)}
        ${MobileApp.detailRow('行业', item.industry)}
        ${MobileApp.detailRow('地区', item.region)}
        ${MobileApp.detailRow('地址', item.address)}
        ${MobileApp.detailRow('线索来源', item.customerSource || '-')}
      </div>

      <!-- Store Info -->
      <div class="detail-card">
        <div class="detail-card-header">
          <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          门店信息
        </div>
        ${MobileApp.detailRow('线下门店数', item.storeCount || '-')}
        ${MobileApp.detailRow('是否品牌客户', item.isBrandCustomer || '否')}
        ${MobileApp.detailRow('品牌名', item.brandName || '-')}
      </div>

      <!-- Contact Info -->
      <div class="detail-card">
        <div class="detail-card-header">
          <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
          联系人信息
        </div>
        ${MobileApp.detailRow('联系人', contact ? contact.name : '-')}
        ${MobileApp.detailRow('电话', item.phone || (contact ? contact.phone : '-'))}
        ${MobileApp.detailRow('邮箱', item.email || '-')}
      </div>

      <!-- System Info -->
      <div class="detail-card" style="margin-bottom:80px">
        <div class="detail-card-header">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          系统信息
        </div>
        ${MobileApp.detailRow('状态', MobileApp.badge(item.status || '活跃', this.STATUS_MAP[item.status] || 'success'))}
        ${MobileApp.detailRow('负责人', item.assignee || '-')}
        ${MobileApp.detailRow('商机数', String(oppCount))}
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
      <button class="bottom-btn bottom-btn-primary" id="btn-new-opp">新建商机</button>
      <button class="bottom-btn bottom-btn-danger" id="btn-abandon">放弃</button>
    `;
    container.appendChild(bottomBar);

    bottomBar.querySelector('#btn-edit')?.addEventListener('click', () => this._showForm(item));
    bottomBar.querySelector('#btn-followup')?.addEventListener('click', () => this._writeFollowUp(item));
    bottomBar.querySelector('#btn-new-opp')?.addEventListener('click', () => this._createOpportunity(item));
    bottomBar.querySelector('#btn-abandon')?.addEventListener('click', () => this._handleAbandon(item));
  },

  _showForm(item) {
    const isEdit = !!item;
    const fields = [
      { key: 'name', label: '客户名称', type: 'text', required: true, placeholder: '请输入公司全称' },
      { key: 'type', label: '客户类型', type: 'select', required: true, options: ['企业客户', '个人客户'] },
      { key: 'businessLine', label: '业务线', type: 'select', required: true, options: ['上海营销中心', '北京营销中心', '深圳营销中心', '广州营销中心', '杭州营销中心'] },
      { key: 'productLine', label: '产品线', type: 'select', required: true, options: ['新零售', '零售SaaS', '智慧商超', '到店', '视频号', '定制开发', '企微小助手', '智慧服务'] },
      { key: 'customerSource', label: '线索来源', type: 'select', required: true, options: ['自拓线索'] },
      { key: 'industry', label: '行业', type: 'select', required: true, options: ['互联网/IT', '金融', '制造业', '教育', '医疗', '房地产', '零售', '其他'] },
      { key: 'region', label: '地区', type: 'select', required: true, options: ['上海', '北京', '深圳', '广州', '成都', '杭州', '南京', '武汉', '重庆', '西安', '天津', '长沙', '其他'] },
      { key: 'storeCount', label: '线下门店数', type: 'select', required: true, options: ['无门店', '1-10家', '11-30家', '31-50家', '51-100家', '101-500家', '500家以上'] },
      { key: 'isBrandCustomer', label: '是否品牌客户', type: 'select', required: true, options: ['是', '否'] },
      { key: 'brandName', label: '品牌名', type: 'text', placeholder: '请输入品牌名称' },
      { key: 'address', label: '地址', type: 'text' },
      { key: 'phone', label: '电话', type: 'text' },
      { key: 'email', label: '邮箱', type: 'email' },
    ];

    MobileApp.showForm({
      title: isEdit ? '编辑客户' : '新建客户',
      fields,
      data: item || { type: '企业客户', customerSource: '自拓线索', isBrandCustomer: '否' },
      onSubmit: (formData) => {
        if (isEdit) {
          Store.update(this.COLLECTION, item.id, formData);
          MobileApp.toast('客户已更新');
        } else {
          const record = Store.create(this.COLLECTION, { ...formData, status: '活跃', tags: [] });
          MobileApp.toast('客户已创建');
        }
        location.hash = `#/mobile/customers/${this._currentSea}`;
      }
    });
  },

  _writeFollowUp(item) {
    MobileApp.showFollowUpForm('customer', item.id, () => {
      this.renderDetail(item.id);
    });
  },

  _createOpportunity(item) {
    // Navigate to opportunity creation with pre-selected customer
    MobileOpportunities._prefillCustomerId = item.id;
    MobileOpportunities._prefillBrandName = item.brandName || '';
    location.hash = '#/mobile/opportunities';
    // After navigation, trigger create form
    setTimeout(() => {
      if (typeof MobileOpportunities.showForm === 'function') {
        MobileOpportunities.showForm(null, item.id);
      }
    }, 100);
  },

  _handleAbandon(item) {
    MobileApp.confirm({
      title: '放弃客户',
      message: `确定放弃客户「${item.name}」吗？放弃后将进入公海。`,
      destructive: true,
      confirmText: '确认放弃',
      onConfirm: () => {
        Store.update(this.COLLECTION, item.id, {
          status: '流失',
          poolStatus: 'in_pool',
          poolDate: new Date().toISOString(),
          poolReason: '手动放弃'
        });
        MobileApp.toast('客户已放弃');
        location.hash = `#/mobile/customers/${this._currentSea}`;
      }
    });
  }
};
