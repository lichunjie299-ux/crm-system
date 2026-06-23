/* ============================================
   CRM 移动端 - 线索管理
   ============================================ */
const MobileLeads = {
  COLLECTION: 'leads',
  _allData: [],
  _filteredData: [],
  _searchTerm: '',

  // Field labels for display
  FIELD_LABELS: {
    customerName: '客户名称', contactInfo: '联系人及方式', source: '线索来源',
    bizLine: '业务线', productLine: '产品线', region: '地区',
    industry: '行业', customerType: '客户类型',
    cleanTag: '清洗标签', cleanMemo: '清洗备忘录',
    status: '状态', assignee: '负责人', remark: '备注',
    createdAt: '创建时间', updatedAt: '更新时间'
  },

  STATUS_MAP: { '新线索': 'primary', '跟进中': 'warning', '已转化': 'success', '已关闭': 'gray' },
  CLEAN_TAG_MAP: { '有效线索-转客户': 'success', '无效线索-放弃公海': 'danger', '暂未接通-继续清洗': 'warning' },

  _seeded: false,

  _ensureDemoData() {
    const leads = Store.getAll(this.COLLECTION);
    const active = leads.filter(l => l.poolStatus !== 'in_pool');
    if (active.length >= 12) return;

    const demoData = [
      { customerName: '苏州工业园区智慧科技', customerType: '企业客户', contactInfo: '周明 13911112222', region: '苏州', source: '市场活动-展会', bizLine: '上海营销中心', productLine: '智慧商超', industry: '互联网/IT', status: '新线索', assignee: '李明', cleanTag: '暂未接通-继续清洗', cleanMemo: '展会扫码留资，待回访' },
      { customerName: '合肥科大智能', customerType: '企业客户', contactInfo: '吴佳 13822223333', region: '合肥', source: '市场活动-展会', bizLine: '杭州营销中心', productLine: '零售SaaS', industry: '教育', status: '跟进中', assignee: '王丽', cleanTag: '有效线索-转客户', cleanMemo: '电话沟通确认有采购意向' },
      { customerName: '厦门海西数据', customerType: '企业客户', contactInfo: '林海 13733334444', region: '厦门', source: '市场活动-展会', bizLine: '深圳营销中心', productLine: '新零售', industry: '零售', status: '新线索', assignee: '张华', cleanTag: '', cleanMemo: '' },
      { customerName: '大连北方软件', customerType: '企业客户', contactInfo: '刘洋 13644445555', region: '大连', source: '市场活动-展会', bizLine: '北京营销中心', productLine: '定制开发', industry: '制造业', status: '跟进中', assignee: '李明', cleanTag: '暂未接通-继续清洗', cleanMemo: '技术方案已发，等待反馈' },
      { customerName: '青岛海创科技', customerType: '企业客户', contactInfo: '孙浩 13555556666', region: '青岛', source: '市场活动-展会', bizLine: '上海营销中心', productLine: '智慧商超', industry: '医疗', status: '新线索', assignee: '王丽', cleanTag: '', cleanMemo: '' },
    ];

    demoData.forEach(d => {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 15));
      d.createdAt = date.toISOString();
      d.updatedAt = date.toISOString();
      Store.create(this.COLLECTION, d);
    });
  },

  renderList() {
    MobileApp.showTabBar();

    if (!this._seeded) {
      this._ensureDemoData();
      this._seeded = true;
    }

    MobileApp.setNav('线索管理', '', '<button class="nav-btn nav-btn-bold" id="nav-add-lead">新建线索</button>');

    const container = MobileApp.getContainer();
    container.innerHTML = '';

    this._allData = Store.getAll(this.COLLECTION).filter(l => l.poolStatus !== 'in_pool');
    this._filterData();

    container.appendChild(MobileApp.createSearchBar('搜索客户名称、联系人...', (term) => {
      this._searchTerm = term;
      this._filterData();
      this._renderListContent(container);
    }));

    const listContainer = document.createElement('div');
    listContainer.id = 'list-container';
    container.appendChild(listContainer);

    this._renderListContent(container);

    document.getElementById('nav-add-lead')?.addEventListener('click', () => {
      this.showForm();
    });
  },

  _filterData() {
    if (!this._searchTerm) {
      this._filteredData = [...this._allData];
    } else {
      const t = this._searchTerm.toLowerCase();
      this._filteredData = this._allData.filter(l =>
        (l.customerName && l.customerName.toLowerCase().includes(t)) ||
        (l.contactInfo && l.contactInfo.toLowerCase().includes(t)) ||
        (l.region && l.region.toLowerCase().includes(t))
      );
    }
    this._filteredData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  _renderListContent(container) {
    const listContainer = container.querySelector('#list-container') || container;
    const data = this._filteredData;

    if (data.length === 0) {
      listContainer.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          <div class="empty-state-text">${this._searchTerm ? '未找到匹配的线索' : '暂无线索数据'}</div>
        </div>`;
      return;
    }

    const group = document.createElement('div');
    group.className = 'list-group';

    data.forEach(item => {
      const statusBadge = MobileApp.badge(item.status || '新线索', this.STATUS_MAP[item.status] || 'gray');
      const cleanBadge = item.cleanTag ? MobileApp.badge(item.cleanTag, this.CLEAN_TAG_MAP[item.cleanTag] || 'gray') : '';
      const contactDisplay = item.contactInfo ? item.contactInfo : '';
      const sourceDisplay = item.source || '';

      const cell = MobileApp.createListCell(
        item.customerName || '(未填写)',
        [contactDisplay, sourceDisplay].filter(Boolean).join(' | '),
        statusBadge + (cleanBadge ? ' ' + cleanBadge : ''),
        () => location.hash = `#/mobile/leads/view/${item.id}`
      );

      // Swipe actions: add hidden buttons
      this._addSwipeActions(cell, item);
      group.appendChild(cell);
    });

    listContainer.innerHTML = '';
    listContainer.appendChild(group);
  },

  _addSwipeActions(cell, item) {
    // On long press or we use the detail page for actions instead
    // Just mark the cell for navigation, actions are in detail
  },

  renderDetail(id) {
    const item = Store.getById(this.COLLECTION, id);
    if (!item) { MobileApp.toast('线索不存在', 'error'); location.hash = '#/mobile/leads'; return; }

    MobileApp.hideTabBar();
    MobileApp.setNav(item.customerName || '线索详情', '');
    MobileApp.setNavBack(() => location.hash = '#/mobile/leads');

    const container = MobileApp.getContainer();
    const displayName = item.customerName || '(未填写)';

    let html = `
      <!-- Header -->
      <div style="background:#fff;margin:0 0 16px;padding:20px 16px;border-bottom:0.5px solid var(--ios-separator-light)">
        <div style="font-size:22px;font-weight:600;margin-bottom:4px">${Helpers.escapeHtml(displayName)}</div>
        <div style="font-size:14px;color:var(--ios-text-tertiary);display:flex;gap:8px;flex-wrap:wrap;align-items:center">
          ${item.contactInfo ? `<span>${Helpers.escapeHtml(item.contactInfo)}</span>` : ''}
          ${item.region ? `<span>${Helpers.escapeHtml(item.region)}</span>` : ''}
          ${MobileApp.badge(item.status, this.STATUS_MAP[item.status] || 'gray')}
        </div>
      </div>

      <!-- Basic Info Card -->
      <div class="detail-card">
        <div class="detail-card-header">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><circle cx="12" cy="8" r="1" fill="currentColor"/></svg>
          基本信息
        </div>
        ${MobileApp.detailRow('客户名称', item.customerName)}
        ${MobileApp.detailRow('客户类型', item.customerType)}
        ${MobileApp.detailRow('业务线', item.bizLine)}
        ${MobileApp.detailRow('产品线', item.productLine)}
        ${MobileApp.detailRow('地区', item.region)}
        ${MobileApp.detailRow('行业', item.industry)}
        ${MobileApp.detailRow('线索来源', item.source ? MobileApp.badge(item.source, 'info') : '-')}
        ${MobileApp.detailRow('清洗标签', item.cleanTag ? MobileApp.badge(item.cleanTag, this.CLEAN_TAG_MAP[item.cleanTag] || 'gray') : '-')}
        ${MobileApp.detailRow('清洗备忘录', item.cleanMemo)}
        ${MobileApp.detailRow('备注', item.remark)}
      </div>

      <!-- Contact Card -->
      <div class="detail-card">
        <div class="detail-card-header">
          <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
          联系方式
        </div>
        ${MobileApp.detailRow('联系人及方式', item.contactInfo)}
        ${MobileApp.detailRow('负责人', item.assignee || '-')}
      </div>

      <!-- System Info Card -->
      <div class="detail-card" style="margin-bottom:80px">
        <div class="detail-card-header">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          系统信息
        </div>
        ${MobileApp.detailRow('状态', MobileApp.badge(item.status, this.STATUS_MAP[item.status] || 'gray'))}
        ${MobileApp.detailRow('创建时间', MobileApp.formatDate(item.createdAt))}
        ${MobileApp.detailRow('更新时间', MobileApp.formatDate(item.updatedAt))}
      </div>
    `;

    container.innerHTML = html;

    // Bottom action bar
    const canClean = item.status !== '已转化' && item.status !== '已关闭';
    const bottomBar = document.createElement('div');
    bottomBar.className = 'bottom-bar';
    bottomBar.innerHTML = `
      ${canClean ? `<button class="bottom-btn bottom-btn-primary" id="btn-clean">清洗</button>` : ''}
      <button class="bottom-btn bottom-btn-danger" id="btn-abandon">放弃</button>
    `;
    container.appendChild(bottomBar);

    bottomBar.querySelector('#btn-clean')?.addEventListener('click', () => this._showCleanAction(item));
    bottomBar.querySelector('#btn-abandon')?.addEventListener('click', () => this._handleAbandon(item));
  },

  _showCleanAction(item) {
    const buttons = [
      { label: '有效线索-转客户', onClick: () => {
        if (item) this._handleClean(item, '有效线索-转客户');
        else MobileApp.toast('请先选择一条线索', 'error');
      }},
      { label: '无效线索-放弃公海', onClick: () => {
        if (item) this._handleClean(item, '无效线索-放弃公海');
        else MobileApp.toast('请先选择一条线索', 'error');
      }},
      { label: '暂未接通-继续清洗', onClick: () => {
        if (item) this._handleClean(item, '暂未接通-继续清洗');
        else MobileApp.toast('请先选择一条线索', 'error');
      }},
    ];
    MobileApp.actionSheet({ title: '请选择清洗标签', buttons, cancelText: '取消' });
  },

  _handleClean(item, cleanTag) {
    Store.update(this.COLLECTION, item.id, { cleanTag, status: '跟进中' });

    if (cleanTag === '有效线索-转客户') {
      this._convertToCustomer(item);
    } else if (cleanTag === '无效线索-放弃公海') {
      MobileApp.toast('线索已标记为无效');
      location.hash = '#/mobile/leads';
    } else {
      MobileApp.toast('线索已更新');
      location.hash = '#/mobile/leads';
    }
  },

  _convertToCustomer(lead) {
    const fields = [
      { key: 'name', label: '客户名称', type: 'text', required: true },
      { key: 'type', label: '客户类型', type: 'select', required: true, options: ['企业客户', '个人客户'] },
      { key: 'businessLine', label: '业务线', type: 'select', options: ['上海营销中心', '北京营销中心', '深圳营销中心', '广州营销中心', '杭州营销中心'] },
      { key: 'productLine', label: '产品线', type: 'select', options: ['新零售', '零售SaaS', '智慧商超', '到店', '视频号', '定制开发', '企微小助手', '智慧服务'] },
      { key: 'region', label: '地区', type: 'select', options: ['上海', '北京', '深圳', '广州', '成都', '杭州', '南京', '武汉', '重庆', '西安', '天津', '长沙', '其他'] },
      { key: 'industry', label: '行业', type: 'select', options: ['互联网/IT', '金融', '制造业', '教育', '医疗', '房地产', '零售', '其他'] },
      { key: 'storeCount', label: '线下门店数', type: 'select', options: ['无门店', '1-10家', '11-30家', '31-50家', '51-100家', '101-500家', '500家以上'] },
      { key: 'isBrandCustomer', label: '是否品牌客户', type: 'select', options: ['是', '否'] },
      { key: 'brandName', label: '品牌名', type: 'text' },
      { key: 'phone', label: '电话', type: 'text' },
      { key: 'email', label: '邮箱', type: 'email' },
    ];

    const preData = {
      name: lead.customerName || '',
      businessLine: lead.bizLine || '',
      productLine: lead.productLine || '',
      region: lead.region || '',
    };

    MobileApp.showForm({
      title: '转化为客户',
      fields,
      data: preData,
      onSubmit: (formData) => {
        formData.sourceLeadId = lead.id;
        formData.status = '活跃';
        formData.tags = [];
        const customer = Store.create('customers', formData);

        Store.update(this.COLLECTION, lead.id, {
          status: '已转化',
          convertedCustomerId: customer.id
        });

        if (lead.contactInfo) {
          Store.create('contacts', {
            customerId: customer.id,
            name: lead.contactInfo,
            isPrimary: true,
          });
        }

        MobileApp.toast('线索已转化为客户');
        location.hash = '#/mobile/leads';
      }
    });
  },

  _handleAbandon(item) {
    MobileApp.confirm({
      title: '放弃线索',
      message: `确定放弃线索「${item.customerName || item.contactInfo}」吗？`,
      destructive: true,
      confirmText: '确认放弃',
      onConfirm: () => {
        Store.delete(this.COLLECTION, item.id);
        MobileApp.toast('线索已放弃');
        location.hash = '#/mobile/leads';
      }
    });
  },

  showForm(item) {
    const isEdit = !!item;
    const fields = [
      { key: 'bizLine', label: '业务线', type: 'select', required: true, options: ['上海营销中心', '北京营销中心', '广州营销中心', '杭州营销中心', '深圳营销中心'] },
      { key: 'productLine', label: '产品线', type: 'select', required: true, options: ['新零售', '零售SaaS', '到店', '智慧商超', '视频号', '定制开发'] },
      { key: 'contactInfo', label: '联系人及方式', type: 'text', required: true, placeholder: '如：张伟 13812345678' },
      { key: 'region', label: '地区', type: 'text', required: true, placeholder: '如：上海、北京' },
      { key: 'source', label: '线索来源', type: 'select', required: true, options: ['市场活动-展会'] },
      { key: 'customerName', label: '客户名称', type: 'text', placeholder: '请输入客户名称' },
      { key: 'customerType', label: '客户类型', type: 'select', options: ['企业客户', '个人客户'] },
      { key: 'industry', label: '行业', type: 'select', options: ['互联网/IT', '金融', '制造业', '教育', '医疗', '房地产', '零售', '其他'] },
      { key: 'assignee', label: '负责人', type: 'text', placeholder: '负责人姓名' },
      { key: 'remark', label: '备注', type: 'textarea', placeholder: '备注信息...' },
    ];

    MobileApp.showForm({
      title: isEdit ? '清洗线索' : '新建线索',
      fields,
      data: item || { customerType: '企业客户', source: '市场活动-展会', status: '新线索' },
      onSubmit: (formData) => {
        if (isEdit) {
          Store.update(this.COLLECTION, item.id, formData);
          MobileApp.toast('线索已更新');
        } else {
          formData.status = '新线索';
          Store.create(this.COLLECTION, formData);
          MobileApp.toast('线索已创建');
        }
        location.hash = '#/mobile/leads';
      }
    });
  }
};
