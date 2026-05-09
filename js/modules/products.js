/* ============================================
   CRM 系统 - 产品管理模块
   ============================================ */
const Products = {
  COLLECTION: 'products',

  FIELDS: [
    { key: 'name', label: '产品名称', type: 'text', required: true, showInTable: true, placeholder: '请输入产品名称' },
    { key: 'code', label: '产品编码', type: 'text', required: true, showInTable: true, placeholder: 'P001' },
    { key: 'category', label: '分类', type: 'select', showInTable: true, options: ['软件产品', '硬件设备', '技术服务', '咨询服务', '培训课程', '其他'] },
    { key: 'price', label: '标准单价（元）', type: 'number', required: true, showInTable: true, step: '0.01', min: 0, placeholder: '0.00' },
    { key: 'unit', label: '单位', type: 'select', showInTable: true, options: ['个', '套', '年', '月', '次', '人/天'] },
    { key: 'status', label: '状态', type: 'select', required: true, showInTable: true, options: ['在售', '停售'], default: '在售' },
    { key: 'description', label: '描述', type: 'textarea', fullWidth: true, placeholder: '产品描述...' },
  ],

  STATUS_MAP: {
    '在售': 'success',
    '停售': 'gray',
  },

  renderList() {
    UI.setPageTitle('产品管理');
    const data = Store.getAll(this.COLLECTION);

    const el = document.createElement('div');
    el.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <h2 class="page-title">产品管理</h2>
          <p class="page-subtitle">管理产品目录和价格</p>
        </div>
        <div class="page-header-right">
          <button class="btn btn-primary" id="btn-add"><svg viewBox="0 0 24 24">${UI.icons.plus}</svg> 新建产品</button>
        </div>
      </div>
      <div id="table-container"></div>
    `;

    const table = Components.DataTable({
      columns: [
        { key: 'name', label: '产品名称', sortable: true, render: (v, item) => `<span class="cell-link" data-id="${item.id}">${Helpers.escapeHtml(v || '')}</span>` },
        { key: 'code', label: '编码', width: '100px' },
        { key: 'category', label: '分类', width: '100px' },
        { key: 'price', label: '单价', width: '120px', sortable: true, render: v => `<strong>${Helpers.formatMoney(v)}</strong>` },
        { key: 'unit', label: '单位', width: '60px' },
        { key: 'status', label: '状态', width: '80px', render: v => Components.Badge(v, Products.STATUS_MAP[v] || 'gray') },
        { key: 'updatedAt', label: '更新时间', width: '120px', sortable: true, render: v => Helpers.formatDate(v) },
      ],
      data,
      searchKeys: ['name', 'code', 'category'],
      searchPlaceholder: '搜索产品名称、编码...',
      actions: {
        onView: (id) => Router.navigate(`#/products/view/${id}`),
        onEdit: (id) => this.showForm(id),
        onDelete: (id) => this.handleDelete(id),
      },
      onRowClick: (id) => Router.navigate(`#/products/view/${id}`),
    });

    el.querySelector('#table-container').appendChild(table);

    el.querySelector('#btn-add').addEventListener('click', () => this.showForm());

    // 点击产品名称
    el.addEventListener('click', (e) => {
      const link = e.target.closest('.cell-link');
      if (link) {
        e.stopPropagation();
        Router.navigate(`#/products/view/${link.dataset.id}`);
      }
    });

    UI.render(el);
  },

  renderDetail(id) {
    const item = Store.getById(this.COLLECTION, id);
    if (!item) { UI.toast('产品不存在', 'error'); Router.navigate('#/products'); return; }

    UI.setPageTitle(item.name, [
      { label: '产品管理', hash: '#/products' },
      { label: item.name }
    ]);

    const el = document.createElement('div');
    el.innerHTML = `
      <div class="detail-header">
        <div class="detail-header-left">
          <div class="detail-avatar" style="background:var(--primary-lighter);color:var(--primary)">${Helpers.getInitials(item.name)}</div>
          <div>
            <h2 class="detail-name">${Helpers.escapeHtml(item.name)}</h2>
            <div class="detail-meta">
              <span>${Helpers.escapeHtml(item.code || '')}</span>
              ${Components.Badge(item.status, this.STATUS_MAP[item.status] || 'gray')}
            </div>
          </div>
        </div>
        <div class="detail-actions">
          <button class="btn btn-secondary" id="btn-edit"><svg viewBox="0 0 24 24">${UI.icons.edit}</svg> 编辑</button>
          <button class="btn btn-secondary danger" id="btn-delete" style="color:var(--danger);border-color:var(--danger-light)"><svg viewBox="0 0 24 24">${UI.icons.trash}</svg> 删除</button>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><h3 class="card-title">基本信息</h3></div>
        ${Components.DetailCard([
          { key: 'name', label: '产品名称' },
          { key: 'code', label: '产品编码' },
          { key: 'category', label: '分类' },
          { key: 'price', label: '标准单价', render: v => Helpers.formatMoney(v) },
          { key: 'unit', label: '单位' },
          { key: 'status', label: '状态', render: v => Components.Badge(v, Products.STATUS_MAP[v] || 'gray') },
          { key: 'description', label: '描述' },
          { key: 'createdAt', label: '创建时间', render: v => Helpers.formatDateTime(v) },
          { key: 'updatedAt', label: '更新时间', render: v => Helpers.formatDateTime(v) },
        ], item)}
      </div>
    `;

    el.querySelector('#btn-edit').addEventListener('click', () => this.showForm(id));
    el.querySelector('#btn-delete').addEventListener('click', () => this.handleDelete(id));

    UI.render(el);
  },

  showForm(id) {
    const isEdit = !!id;
    const data = isEdit ? Store.getById(this.COLLECTION, id) : {};

    UI.formModal({
      title: isEdit ? '编辑产品' : '新建产品',
      fields: this.FIELDS,
      data,
      onSubmit: (formData) => {
        if (isEdit) {
          Store.update(this.COLLECTION, id, formData);
          UI.toast('产品已更新');
        } else {
          Store.create(this.COLLECTION, formData);
          UI.toast('产品已创建');
        }
        // 刷新当前页
        const route = Router.current();
        if (route && route.hash.includes('/view/')) {
          this.renderDetail(id);
        } else {
          this.renderList();
        }
      }
    });
  },

  handleDelete(id) {
    const item = Store.getById(this.COLLECTION, id);
    if (!item) return;

    UI.confirm({
      title: '删除产品',
      message: `确定要删除产品「${item.name}」吗？此操作不可撤销。`,
      type: 'danger',
      confirmText: '确认删除',
      onConfirm: () => {
        Store.delete(this.COLLECTION, id);
        UI.toast('产品已删除');
        Router.navigate('#/products');
      }
    });
  },

  init() {
    Router.register('#/products', () => this.renderList());
    Router.register('#/products/view/:id', ({ id }) => this.renderDetail(id));
  }
};
