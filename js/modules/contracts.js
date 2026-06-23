/* ============================================
   CRM 系统 - 合同管理模块
   ============================================ */
const Contracts = {
  COLLECTION: 'contracts',

  STATUS_MAP: { '待归档': 'warning', '已归档': 'success', '已作废': 'danger' },
  SEAL_MAP: { '未盖章': 'warning', '已盖章': 'success' },

  FIELDS: [
    { key: 'contractNo', label: '合同编号', type: 'text', required: true, placeholder: '如：HT-2026-001' },
    { key: 'tabType', label: '合同分类', type: 'select', required: true, options: ['主合同', '补充协议'], default: '主合同' },
    { key: 'contractType', label: '合同类型', type: 'select', required: true, options: ['标准合同', '非标合同'], default: '标准合同' },
    { key: 'customerId', label: '客户名称', type: 'select', required: true, options: [] },
    { key: 'isSealed', label: '是否盖章', type: 'select', required: true, options: ['是', '否'], default: '否' },
    { key: 'amount', label: '合同金额（元）', type: 'number', required: true, step: '0.01', min: 0, placeholder: '0.00' },
    { key: 'status', label: '合同状态', type: 'select', required: true, options: ['待归档', '已归档', '已作废'], default: '待归档' },
    { key: 'signer', label: '签约人', type: 'text', required: true, placeholder: '签约人姓名' },
    { key: 'signDate', label: '签约时间', type: 'date', required: true },
    { key: 'relatedOrderNo', label: '关联订单编号', type: 'text', placeholder: '关联的订单编号' },
    { key: 'remark', label: '备注', type: 'textarea', fullWidth: true, placeholder: '合同备注...' },
  ],

  renderList() {
    UI.setPageTitle('合同管理');
    const data = Store.getAll(this.COLLECTION);

    const el = document.createElement('div');
    el.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <h2 class="page-title">合同管理</h2>
          <p class="page-subtitle">共 ${data.length} 份合同</p>
        </div>
        <div class="page-header-right">
          <button class="btn btn-primary" id="btn-add-contract"><svg viewBox="0 0 24 24">${UI.icons.plus}</svg> 新建合同</button>
        </div>
      </div>
      <div id="table-container"></div>
    `;

    const filterFields = [
      { key: 'contractNo', label: '合同编号', type: 'text', placeholder: '请输入合同编号' },
      { key: 'tabType', label: '合同分类', type: 'select', placeholder: '请选择', options: ['主合同', '补充协议'] },
      { key: 'contractType', label: '合同类型', type: 'select', placeholder: '请选择', options: ['标准合同', '非标合同'] },
      { key: 'status', label: '合同状态', type: 'select', placeholder: '请选择', options: ['待归档', '已归档', '已作废'] },
      { key: 'isSealed', label: '盖章状态', type: 'select', placeholder: '请选择', options: ['是', '否'] },
    ];

    const table = Components.DataTable({
      columns: [
        { key: 'contractNo', label: '合同编号', sortable: true, render: (v, item) => `<span class="cell-link" data-id="${item.id}">${Helpers.escapeHtml(v || '')}</span>` },
        { key: 'contractType', label: '合同类型', width: '100px', render: (v, item) => {
          return Helpers.escapeHtml(v || '-');
        } },
        { key: 'customerId', label: '客户名称', render: v => { const c = Store.getById('customers', v); return c ? Helpers.escapeHtml(c.name) : '-'; } },
        { key: 'amount', label: '合同金额', width: '130px', sortable: true, render: v => `<strong style="color:var(--primary)">${Helpers.formatMoney(v)}</strong>` },
        { key: 'status', label: '合同状态', width: '90px', render: v => Components.Badge(v, this.STATUS_MAP[v] || 'gray') },
        { key: 'isSealed', label: '盖章状态', width: '90px', render: v => Components.Badge(v === '是' ? '已盖章' : '未盖章', this.SEAL_MAP[v === '是' ? '已盖章' : '未盖章'] || 'gray') },
        { key: 'signer', label: '签约人', width: '90px' },
        { key: 'signDate', label: '签约时间', width: '110px', sortable: true, render: v => Helpers.formatDate(v) },
        { key: 'relatedOrderNo', label: '关联订单', width: '130px', render: v => v ? `<span class="font-mono">${Helpers.escapeHtml(v)}</span>` : '-' },
      ],
      data,
      filterFields,
      searchKeys: ['contractNo', 'signer', 'relatedOrderNo'],
      searchPlaceholder: '搜索合同编号、签约人...',
      actions: {
        onView: (id) => this.viewContract(id),
        onAction: (action, id) => {
          if (action === 'archive') this.handleArchive(id);
          if (action === 'void') this.handleVoid(id);
        },
        extra: (item) => {
          let html = '';
          if (item.status === '待归档') {
            html += `<button class="action-btn outlined" data-action="archive" data-id="${item.id}" title="归档">归档</button>`;
          }
          if (item.status !== '已作废') {
            html += `<button class="action-btn danger" data-action="void" data-id="${item.id}" title="作废">作废</button>`;
          }
          return html;
        }
      },
      sortKey: 'createdAt',
      sortDir: 'desc',
    });

    el.querySelector('#table-container').appendChild(table);
    el.querySelector('#btn-add-contract').addEventListener('click', () => this.showForm());
    el.addEventListener('click', (e) => {
      const link = e.target.closest('.cell-link[data-id]');
      if (link) { e.stopPropagation(); this.viewContract(link.dataset.id); }
    });

    UI.render(el);
  },

  _getFields() {
    const customers = Store.getAll('customers').filter(c => c.poolStatus !== 'in_pool' && c.poolStatus !== 'pending_review').map(c => ({ value: c.id, label: c.name }));
    return this.FIELDS.map(f => {
      if (f.key === 'customerId') {
        return { ...f, options: customers };
      }
      return f;
    });
  },

  showForm(id) {
    const isEdit = !!id;
    const data = isEdit ? Store.getById(this.COLLECTION, id) : {};
    const fields = this._getFields();

    const { overlay, close } = UI.formModal({
      title: isEdit ? '编辑合同' : '新建合同',
      fields,
      data,
      onSubmit: (formData) => {
        if (isEdit) {
          Store.update(this.COLLECTION, id, formData);
          UI.toast('合同已更新');
        } else {
          Store.create(this.COLLECTION, formData);
          UI.toast('合同已创建');
        }
        this.renderList();
      }
    });
  },

  viewContract(id) {
    const item = Store.getById(this.COLLECTION, id);
    if (!item) return;

    const customer = Store.getById('customers', item.customerId);
    const statusType = this.STATUS_MAP[item.status] || 'gray';
    const sealLabel = item.isSealed === '是' ? '已盖章' : '未盖章';
    const sealType = this.SEAL_MAP[sealLabel] || 'gray';

    // 查询关联子订单
    var subOrders = Store.query('orders', function(o) { return o.parentOrderNo === item.relatedOrderNo; });
    var subOrderHtml = subOrders.length > 0
      ? subOrders.map(function(s) { return '<span class="font-mono" style="margin-right:var(--space-2);display:inline-block">' + Helpers.escapeHtml(s.orderNo) + '</span>'; }).join('')
      : '-';

    const el = document.createElement('div');
    el.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <h2 class="page-title">合同详情</h2>
        </div>
        <div class="page-header-right">
          ${item.status !== '已作废' ? `<button class="btn btn-danger btn-sm" id="btn-void"><svg viewBox="0 0 24 24" style="width:14px;height:14px">${UI.icons.trash}</svg> 作废</button>` : ''}
          ${item.status === '待归档' ? `<button class="btn btn-success btn-sm" id="btn-archive" style="margin-left:8px"><svg viewBox="0 0 24 24" style="width:14px;height:14px">${UI.icons.check}</svg> 归档</button>` : ''}
          <button class="btn btn-secondary btn-sm" id="btn-edit" style="margin-left:8px"><svg viewBox="0 0 24 24" style="width:14px;height:14px">${UI.icons.edit}</svg> 编辑</button>
          <button class="btn btn-secondary btn-sm" id="btn-back" style="margin-left:8px">返回列表</button>
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <div class="detail-card">
            <div class="detail-field"><div class="field-label">合同编号</div><div class="field-value font-mono">${Helpers.escapeHtml(item.contractNo || '')}</div></div>
            <div class="detail-field"><div class="field-label">合同分类</div><div class="field-value">${Helpers.escapeHtml(item.tabType || '主合同')}</div></div>
            <div class="detail-field"><div class="field-label">合同类型</div><div class="field-value">${Helpers.escapeHtml(item.contractType || '')}</div></div>
            <div class="detail-field"><div class="field-label">客户名称</div><div class="field-value">${customer ? Helpers.escapeHtml(customer.name) : '-'}</div></div>
            <div class="detail-field"><div class="field-label">合同金额</div><div class="field-value"><strong style="color:var(--primary)">${Helpers.formatMoney(item.amount)}</strong></div></div>
            <div class="detail-field"><div class="field-label">合同状态</div><div class="field-value">${Components.Badge(item.status, statusType)}</div></div>
            <div class="detail-field"><div class="field-label">盖章状态</div><div class="field-value">${Components.Badge(sealLabel, sealType)}</div></div>
            <div class="detail-field"><div class="field-label">签约人</div><div class="field-value">${Helpers.escapeHtml(item.signer || '')}</div></div>
            <div class="detail-field"><div class="field-label">签约时间</div><div class="field-value">${Helpers.formatDate(item.signDate) || '-'}</div></div>
            <div class="detail-field"><div class="field-label">关联订单编号</div><div class="field-value font-mono">${item.relatedOrderNo ? Helpers.escapeHtml(item.relatedOrderNo) : '-'}</div></div>
            <div class="detail-field"><div class="field-label">关联子订单编号</div><div class="field-value font-mono" style="font-size:var(--text-xs)">${subOrderHtml}</div></div>
            <div class="detail-field full-width"><div class="field-label">备注</div><div class="field-value">${Helpers.escapeHtml(item.remark || '无')}</div></div>
          </div>
        </div>
      </div>
    `;

    el.querySelector('#btn-back')?.addEventListener('click', () => Router.navigate('#/contracts'));
    el.querySelector('#btn-edit')?.addEventListener('click', () => this.showForm(id));
    el.querySelector('#btn-void')?.addEventListener('click', () => this.handleVoid(id));
    el.querySelector('#btn-archive')?.addEventListener('click', () => this.handleArchive(id));

    UI.render(el);
  },

  handleArchive(id) {
    const item = Store.getById(this.COLLECTION, id);
    if (!item) return;
    UI.confirm({
      title: '归档合同',
      message: `确定要将合同「${item.contractNo}」归档吗？`,
      type: 'info',
      confirmText: '确认归档',
      onConfirm: () => {
        Store.update(this.COLLECTION, id, { status: '已归档' });
        UI.toast('合同已归档');
        this.renderList();
      }
    });
  },

  handleVoid(id) {
    const item = Store.getById(this.COLLECTION, id);
    if (!item) return;
    UI.confirm({
      title: '作废合同',
      message: `确定要将合同「${item.contractNo}」作废吗？作废后合同状态将标记为已作废。`,
      type: 'danger',
      confirmText: '确认作废',
      onConfirm: () => {
        Store.update(this.COLLECTION, id, { status: '已作废' });
        UI.toast('合同已作废');
        this.renderList();
      }
    });
  },

  init() {
    Router.register('#/contracts', () => this.renderList());
    Router.register('#/contracts/view/:id', ({ id }) => this.viewContract(id));
  }
};
