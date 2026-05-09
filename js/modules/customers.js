/* ============================================
   CRM 系统 - 客户管理模块
   ============================================ */
const Customers = {
  COLLECTION: 'customers',

  FIELDS: [
    { key: 'name', label: '客户名称', type: 'text', required: true, placeholder: '公司或个人名称' },
    { key: 'type', label: '客户类型', type: 'select', required: true, options: ['企业客户', '个人客户'] },
    { key: 'industry', label: '行业', type: 'select', options: ['互联网/IT', '金融', '制造业', '教育', '医疗', '房地产', '零售', '其他'] },
    { key: 'scale', label: '规模', type: 'select', options: ['1-50人', '50-200人', '200-1000人', '1000人以上'] },
    { key: 'status', label: '状态', type: 'select', required: true, options: ['活跃', '沉默', '流失'], default: '活跃' },
    { key: 'customerSource', label: '客户来源', type: 'select', required: true, options: ['派单客户', '自建客户'], default: '自建客户' },
    { key: 'phone', label: '电话', type: 'text', placeholder: '联系电话' },
    { key: 'email', label: '邮箱', type: 'email', placeholder: 'example@email.com' },
    { key: 'address', label: '地址', type: 'text', placeholder: '公司地址', fullWidth: true },
    { key: 'website', label: '网站', type: 'text', placeholder: 'https://' },
    { key: 'tags', label: '标签', type: 'tags', fullWidth: true },
    { key: 'remark', label: '备注', type: 'textarea', fullWidth: true, placeholder: '备注信息...' },
  ],

  STATUS_MAP: { '活跃': 'success', '沉默': 'warning', '流失': 'danger', '公海': 'gray' },

  renderList(statusFilter) {
    UI.setPageTitle('客户管理');
    const allData = Store.getAll(this.COLLECTION).filter(c => c.poolStatus !== 'in_pool' && c.poolStatus !== 'pending_review');
    const data = statusFilter ? allData.filter(d => d.status === statusFilter) : allData;

    const el = document.createElement('div');
    el.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <h2 class="page-title">客户管理</h2>
          <p class="page-subtitle">管理客户信息和关系：客户管理容量45个，3天无拜访/90天未成单掉保至客户公海</p>
        </div>
        <div class="page-header-right">
          <button class="btn btn-primary" id="btn-add"><svg viewBox="0 0 24 24">${UI.icons.plus}</svg> 新建客户</button>
        </div>
      </div>
      <div id="table-container"></div>
    `;

    const statusCounts = {};
    allData.forEach(d => { statusCounts[d.status] = (statusCounts[d.status] || 0) + 1; });

    const table = Components.DataTable({
      columns: [
        { key: 'name', label: '客户名称', sortable: true, render: (v, item) => {
          const tags = (item.tags || []).slice(0, 2).map(t => `<span class="tag" style="margin-left:6px">${Helpers.escapeHtml(t)}</span>`).join('');
          return `<span class="cell-link" data-id="${item.id}">${Helpers.escapeHtml(v || '')}</span>${tags}`;
        }},
        { key: 'type', label: '类型', width: '90px' },
        { key: 'industry', label: '行业', width: '100px' },
        { key: 'status', label: '状态', width: '80px', render: v => Components.Badge(v, Customers.STATUS_MAP[v] || 'gray') },
        { key: 'customerSource', label: '客户来源', width: '90px', render: v => v ? Components.Badge(v, v === '派单客户' ? 'primary' : 'info') : '-' },
        { key: '_opps', label: '商机数', width: '70px', sortable: true, render: (_, item) => {
          const count = Store.count('opportunities', o => o.customerId === item.id);
          return count > 0 ? `<span class="text-primary" style="font-weight:600">${count}</span>` : '0';
        }},
        { key: '_orders', label: '订单数', width: '70px', render: (_, item) => {
          const count = Store.count('orders', o => o.customerId === item.id);
          return count > 0 ? `<span style="font-weight:600">${count}</span>` : '0';
        }},
        { key: 'createdAt', label: '创建时间', width: '110px', sortable: true, render: v => Helpers.formatDate(v) },
      ],
      data,
      searchKeys: ['name', 'industry', 'phone', 'email'],
      searchPlaceholder: '搜索客户名称、行业...',
      filters: [
        { label: `全部 (${allData.length})`, value: 'all' },
        { label: `活跃 (${statusCounts['活跃'] || 0})`, value: '活跃' },
        { label: `沉默 (${statusCounts['沉默'] || 0})`, value: '沉默' },
        { label: `流失 (${statusCounts['流失'] || 0})`, value: '流失' },
      ],
      activeFilter: statusFilter || 'all',
      onFilterChange: (filter) => this.renderList(filter === 'all' ? null : filter),
      actions: {
        onView: (id) => Router.navigate(`#/customers/view/${id}`),
        onEdit: (id) => this.showForm(id),
        onDelete: (id) => this.handleDelete(id),
      },
      onRowClick: (id) => Router.navigate(`#/customers/view/${id}`),
      sortKey: 'createdAt',
    });

    el.querySelector('#table-container').appendChild(table);
    el.querySelector('#btn-add').addEventListener('click', () => this.showForm());
    el.addEventListener('click', (e) => {
      const link = e.target.closest('.cell-link');
      if (link) { e.stopPropagation(); Router.navigate(`#/customers/view/${link.dataset.id}`); }
    });

    UI.render(el);
  },

  renderDetail(id) {
    const item = Store.getById(this.COLLECTION, id);
    if (!item) { UI.toast('客户不存在', 'error'); Router.navigate('#/customers'); return; }

    UI.setPageTitle(item.name, [{ label: '客户管理', hash: '#/customers' }, { label: item.name }]);

    const el = document.createElement('div');
    const tagsHtml = (item.tags || []).map(t => `<span class="tag">${Helpers.escapeHtml(t)}</span>`).join(' ');
    const isInPool = item.poolStatus === 'in_pool';

    el.innerHTML = `
      <div class="detail-header">
        <div class="detail-header-left">
          <div class="detail-avatar" style="background:${item.status === '活跃' ? 'var(--success-light)' : 'var(--gray-100)'};color:${item.status === '活跃' ? 'var(--success)' : 'var(--gray-500)'}">${Helpers.getInitials(item.name)}</div>
          <div>
            <h2 class="detail-name">${Helpers.escapeHtml(item.name)}</h2>
            <div class="detail-meta">
              ${Components.Badge(item.status, this.STATUS_MAP[item.status] || 'gray')}
              <span>${Helpers.escapeHtml(item.type || '')}</span>
              <span>${Helpers.escapeHtml(item.industry || '')}</span>
              ${tagsHtml}
            </div>
          </div>
        </div>
        <div class="detail-actions">
          ${!isInPool ? `<button class="btn btn-primary" id="btn-new-opp"><svg viewBox="0 0 24 24">${UI.icons.opportunities}</svg> 新建商机</button>` : ''}
          ${!isInPool ? `<button class="btn btn-secondary" id="btn-to-pool" style="color:var(--warning)"><svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2"><path d="M2 20h20"/><path d="M5 20V10l7-7 7 7v10"/><path d="M9 20v-6h6v6"/></svg> 放入公海</button>` : ''}
          <button class="btn btn-secondary" id="btn-edit"><svg viewBox="0 0 24 24">${UI.icons.edit}</svg> 编辑</button>
          <button class="btn btn-secondary" id="btn-delete" style="color:var(--danger)"><svg viewBox="0 0 24 24">${UI.icons.trash}</svg></button>
        </div>
      </div>
    `;

    const tabContainer = document.createElement('div');
    el.appendChild(tabContainer);

    Components.Tabs([
      {
        label: '基本信息',
        render: () => `<div class="card">${Components.DetailCard([
          { key: 'name', label: '客户名称' },
          { key: 'type', label: '客户类型' },
          { key: 'industry', label: '行业' },
          { key: 'scale', label: '规模' },
          { key: 'status', label: '状态', render: v => Components.Badge(v, Customers.STATUS_MAP[v] || 'gray') },
          { key: 'phone', label: '电话', render: v => v ? `<a href="tel:${v}">${Helpers.escapeHtml(v)}</a>` : '-' },
          { key: 'email', label: '邮箱', render: v => v ? `<a href="mailto:${v}">${Helpers.escapeHtml(v)}</a>` : '-' },
          { key: 'address', label: '地址' },
          { key: 'website', label: '网站', render: v => v ? `<a href="${v}" target="_blank">${Helpers.escapeHtml(v)}</a>` : '-' },
          { key: 'remark', label: '备注' },
          { key: 'createdAt', label: '创建时间', render: v => Helpers.formatDateTime(v) },
        ], item)}</div>`
      },
      {
        label: '联系人',
        render: () => {
          const contacts = Store.query('contacts', c => c.customerId === id);
          return Contacts.renderSubList(contacts, id);
        }
      },
      {
        label: '商机',
        render: () => {
          const opps = Store.query('opportunities', o => o.customerId === id);
          return Opportunities.renderSubList(opps, id);
        }
      },
      {
        label: '订单',
        render: () => {
          const orders = Store.query('orders', o => o.customerId === id);
          return Orders.renderSubList(orders, id);
        }
      },
      {
        label: '跟进记录',
        render: () => {
          const followups = Store.query('followups', f => f.relatedType === 'customer' && f.relatedId === id);
          return FollowUps.renderTimeline(followups, 'customer', id);
        }
      }
    ], tabContainer);

    el.querySelector('#btn-edit').addEventListener('click', () => this.showForm(id));
    el.querySelector('#btn-delete').addEventListener('click', () => this.handleDelete(id));
    el.querySelector('#btn-new-opp')?.addEventListener('click', () => {
      Opportunities.showForm(null, id);
    });
    el.querySelector('#btn-to-pool')?.addEventListener('click', () => {
      UI.confirm({
        title: '放入公海',
        message: `确定将客户「${item.name}」放入公海吗？其关联的活跃商机将一并放入公海。`,
        type: 'warning',
        confirmText: '确认放入',
        onConfirm: () => {
          const oppCount = CustomerPool.moveToPool(id, '手动放入公海');
          UI.toast(`客户已放入公海，${oppCount} 个关联商机一并掉入公海`);
          Router.navigate('#/customers');
        }
      });
    });

    UI.render(el);
  },

  showForm(id) {
    const isEdit = !!id;
    const data = isEdit ? Store.getById(this.COLLECTION, id) : {};

    UI.formModal({
      title: isEdit ? '编辑客户' : '新建客户',
      fields: this.FIELDS,
      data,
      size: 'lg',
      onSubmit: (formData) => {
        if (isEdit) {
          Store.update(this.COLLECTION, id, formData);
          UI.toast('客户已更新');
        } else {
          Store.create(this.COLLECTION, formData);
          UI.toast('客户已创建');
        }
        const route = Router.current();
        if (route && route.hash.includes('/view/')) this.renderDetail(id);
        else this.renderList();
      }
    });
  },

  handleDelete(id) {
    const item = Store.getById(this.COLLECTION, id);
    if (!item) return;
    UI.confirm({
      title: '删除客户',
      message: `确定要删除客户「${item.name}」吗？关联的联系人、商机等数据不会被删除。`,
      type: 'danger',
      confirmText: '确认删除',
      onConfirm: () => {
        Store.delete(this.COLLECTION, id);
        UI.toast('客户已删除');
        Router.navigate('#/customers');
      }
    });
  },

  init() {
    Router.register('#/customers', () => this.renderList());
    Router.register('#/customers/view/:id', ({ id }) => this.renderDetail(id));
  }
};
