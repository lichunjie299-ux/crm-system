/* ============================================
   CRM 系统 - 订单管理模块
   ============================================ */
const Orders = {
  COLLECTION: 'orders',

  STATUS_MAP: { '待确认': 'warning', '已确认': 'primary', '执行中': 'info', '已完成': 'success', '已取消': 'gray' },

  FIELDS: [
    { key: 'customerId', label: '客户', type: 'select', required: true, options: [] },
    { key: 'status', label: '状态', type: 'select', required: true, options: ['待确认', '已确认', '执行中', '已完成', '已取消'], default: '待确认' },
    { key: 'remark', label: '备注', type: 'textarea', fullWidth: true, placeholder: '订单备注...' },
  ],

  renderList(statusFilter) {
    UI.setPageTitle('订单管理');
    const allData = Store.getAll(this.COLLECTION);
    const data = statusFilter ? allData.filter(d => d.status === statusFilter) : allData;

    const totalAmount = allData.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

    const el = document.createElement('div');
    el.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <h2 class="page-title">订单管理</h2>
          <p class="page-subtitle">共 ${allData.length} 个订单，总金额 ${Helpers.formatMoneyShort(totalAmount)}</p>
        </div>
        <div class="page-header-right">
          <button class="btn btn-primary" id="btn-add"><svg viewBox="0 0 24 24">${UI.icons.plus}</svg> 新建订单</button>
        </div>
      </div>
      <div id="table-container"></div>
    `;

    const statusCounts = {};
    allData.forEach(d => { statusCounts[d.status] = (statusCounts[d.status] || 0) + 1; });

    const filters = [{ label: `全部 (${allData.length})`, value: 'all' }];
    ['待确认', '已确认', '执行中', '已完成', '已取消'].forEach(s => {
      if (statusCounts[s]) filters.push({ label: `${s} (${statusCounts[s]})`, value: s });
    });

    const table = Components.DataTable({
      columns: [
        { key: 'orderNo', label: '订单编号', sortable: true, render: (v, item) => `<span class="cell-link font-mono" data-id="${item.id}">${Helpers.escapeHtml(v || '')}</span>` },
        { key: 'customerId', label: '客户', render: v => { const c = Store.getById('customers', v); return c ? `<span class="cell-link" data-customer="${v}">${Helpers.escapeHtml(c.name)}</span>` : '-'; }},
        { key: 'items', label: '产品数', width: '80px', render: v => Array.isArray(v) ? v.length + ' 项' : '0 项' },
        { key: 'totalAmount', label: '订单金额', width: '130px', sortable: true, render: v => `<strong style="color:var(--primary)">${Helpers.formatMoney(v)}</strong>` },
        { key: 'status', label: '状态', width: '90px', render: v => Components.Badge(v, Orders.STATUS_MAP[v] || 'gray') },
        { key: 'createdAt', label: '创建时间', width: '110px', sortable: true, render: v => Helpers.formatDate(v) },
      ],
      data,
      searchKeys: ['orderNo'],
      searchPlaceholder: '搜索订单编号...',
      filters,
      activeFilter: statusFilter || 'all',
      onFilterChange: (filter) => this.renderList(filter === 'all' ? null : filter),
      actions: {
        onView: (id) => Router.navigate(`#/orders/view/${id}`),
        onEdit: (id) => this.showForm(id),
        onDelete: (id) => this.handleDelete(id),
      },
      onRowClick: (id) => Router.navigate(`#/orders/view/${id}`),
      sortKey: 'createdAt',
    });

    el.querySelector('#table-container').appendChild(table);
    el.querySelector('#btn-add').addEventListener('click', () => this.showForm());
    el.addEventListener('click', (e) => {
      const link = e.target.closest('.cell-link[data-id]');
      if (link) { e.stopPropagation(); Router.navigate(`#/orders/view/${link.dataset.id}`); }
      const custLink = e.target.closest('[data-customer]');
      if (custLink) { e.stopPropagation(); Router.navigate(`#/customers/view/${custLink.dataset.customer}`); }
    });

    UI.render(el);
  },

  renderDetail(id) {
    const item = Store.getById(this.COLLECTION, id);
    if (!item) { UI.toast('订单不存在', 'error'); Router.navigate('#/orders'); return; }

    const customer = Store.getById('customers', item.customerId);
    const opp = item.opportunityId ? Store.getById('opportunities', item.opportunityId) : null;

    UI.setPageTitle(item.orderNo, [{ label: '订单管理', hash: '#/orders' }, { label: item.orderNo }]);

    const el = document.createElement('div');

    // 订单明细
    const itemsHtml = (item.items || []).map(i => `<tr>
      <td>${Helpers.escapeHtml(i.productName || '-')}</td>
      <td>${i.quantity}</td>
      <td>${Helpers.formatMoney(i.unitPrice)}</td>
      <td><strong>${Helpers.formatMoney(i.subtotal)}</strong></td>
    </tr>`).join('');

    el.innerHTML = `
      <div class="detail-header">
        <div class="detail-header-left">
          <div class="detail-avatar" style="background:${item.status === '已完成' ? 'var(--success-light)' : 'var(--primary-lighter)'};color:${item.status === '已完成' ? 'var(--success)' : 'var(--primary)'}"><svg viewBox="0 0 24 24" style="width:28px;height:28px">${UI.icons.orders}</svg></div>
          <div>
            <h2 class="detail-name" style="font-family:var(--font-mono)">${Helpers.escapeHtml(item.orderNo)}</h2>
            <div class="detail-meta">
              ${customer ? `<a href="#/customers/view/${customer.id}">${Helpers.escapeHtml(customer.name)}</a>` : ''}
              ${Components.Badge(item.status, this.STATUS_MAP[item.status] || 'gray')}
              <strong style="color:var(--primary);font-size:var(--text-lg)">${Helpers.formatMoney(item.totalAmount)}</strong>
            </div>
          </div>
        </div>
        <div class="detail-actions">
          <button class="btn btn-secondary" id="btn-edit"><svg viewBox="0 0 24 24">${UI.icons.edit}</svg> 编辑</button>
          <button class="btn btn-secondary" id="btn-delete" style="color:var(--danger)"><svg viewBox="0 0 24 24">${UI.icons.trash}</svg></button>
        </div>
      </div>

      <div class="card" style="margin-bottom:var(--space-4)">
        <div class="card-header"><h3 class="card-title">基本信息</h3></div>
        ${Components.DetailCard([
          { key: 'orderNo', label: '订单编号' },
          { key: 'customerId', label: '客户', render: v => { const c = Store.getById('customers', v); return c ? `<a href="#/customers/view/${c.id}">${Helpers.escapeHtml(c.name)}</a>` : '-'; }},
          { key: 'opportunityId', label: '来源商机', render: v => { if (!v) return '-'; const o = Store.getById('opportunities', v); return o ? `<a href="#/opportunities/view/${o.id}">${Helpers.escapeHtml(o.name)}</a>` : '-'; }},
          { key: 'status', label: '状态', render: v => Components.Badge(v, Orders.STATUS_MAP[v] || 'gray') },
          { key: 'totalAmount', label: '订单总额', render: v => `<strong style="color:var(--primary)">${Helpers.formatMoney(v)}</strong>` },
          { key: 'remark', label: '备注' },
          { key: 'createdAt', label: '创建时间', render: v => Helpers.formatDateTime(v) },
          { key: 'updatedAt', label: '更新时间', render: v => Helpers.formatDateTime(v) },
        ], item)}
      </div>

      <div class="card">
        <div class="card-header"><h3 class="card-title">订单明细</h3></div>
        <div class="table-wrapper">
          <table class="order-items-table" style="margin:0">
            <thead><tr><th>产品</th><th style="width:80px">数量</th><th style="width:120px">单价</th><th style="width:120px">小计</th></tr></thead>
            <tbody>${itemsHtml || '<tr><td colspan="4" style="text-align:center;color:var(--text-muted);padding:var(--space-4)">无明细</td></tr>'}</tbody>
          </table>
        </div>
        <div style="padding:var(--space-3) var(--space-5);text-align:right;border-top:1px solid var(--border-light)">
          <span style="font-size:var(--text-lg);font-weight:700;color:var(--primary)">合计：${Helpers.formatMoney(item.totalAmount)}</span>
        </div>
      </div>
    `;

    el.querySelector('#btn-edit').addEventListener('click', () => this.showForm(id));
    el.querySelector('#btn-delete').addEventListener('click', () => this.handleDelete(id));

    UI.render(el);
  },

  // 嵌入客户详情页的子列表（主订单+子订单结构）
  renderSubList(orders, customerId) {
    const el = document.createElement('div');
    if (orders.length === 0) {
      el.innerHTML = `
        <div class="table-empty" style="padding:var(--space-8)">
          <div class="empty-icon">📦</div>
          <div class="empty-text">暂无订单</div>
        </div>
      `;
      return el;
    }

    // 分离主订单和子订单
    const masterOrders = orders.filter(o => !o.parentOrderId);
    const subOrders = orders.filter(o => o.parentOrderId);

    const rows = masterOrders.map(o => {
      const subs = subOrders.filter(s => s.parentOrderId === o.id);
      const subsHtml = subs.length > 0 ? subs.map(s => `<tr class="sub-order-row" data-parent="${o.id}" style="display:none;background:var(--gray-50)">
        <td style="padding-left:var(--space-8)"><span class="font-mono" style="font-size:var(--text-xs)">${Helpers.escapeHtml(s.orderNo || '-')}</span></td>
        <td>${Helpers.escapeHtml(s.orderType || '-')}</td>
        <td>${Helpers.formatMoney(s.listPrice)}</td>
        <td>${Helpers.formatMoney(s.originalPrice)}</td>
        <td style="color:var(--danger)">${Helpers.formatMoney(s.discount)}</td>
        <td><strong style="color:var(--primary)">${Helpers.formatMoney(s.payableAmount)}</strong></td>
        <td>${Helpers.escapeHtml(s.submitter || '-')}</td>
        <td>${Helpers.formatDate(s.createdAt)}</td>
        <td>${Components.Badge(s.approvalStatus || '待审批', (s.approvalStatus === '已审批' ? 'success' : s.approvalStatus === '已驳回' ? 'danger' : 'warning'))}</td>
        <td>${Components.Badge(s.status || '待确认', Orders.STATUS_MAP[s.status] || 'gray')}</td>
      </tr>`).join('') : '';

      const hasSub = subs.length > 0;
      return `
        <tr class="master-order-row" data-order-id="${o.id}" style="cursor:pointer">
          <td><span class="font-mono">${Helpers.escapeHtml(o.orderNo || '-')}</span></td>
          <td>${Helpers.escapeHtml(o.orderType || '-')}</td>
          <td>${Helpers.formatMoney(o.listPrice)}</td>
          <td>${Helpers.formatMoney(o.originalPrice)}</td>
          <td style="color:var(--danger)">${Helpers.formatMoney(o.discount)}</td>
          <td><strong style="color:var(--primary)">${Helpers.formatMoney(o.payableAmount)}</strong></td>
          <td>${Helpers.escapeHtml(o.submitter || '-')}</td>
          <td>${Helpers.formatDate(o.createdAt)}</td>
          <td>${Components.Badge(o.approvalStatus || '待审批', (o.approvalStatus === '已审批' ? 'success' : o.approvalStatus === '已驳回' ? 'danger' : 'warning'))}</td>
          <td>${Components.Badge(o.status || '待确认', Orders.STATUS_MAP[o.status] || 'gray')}</td>
          <td style="width:40px;text-align:center">${hasSub ? '<span class="expand-icon" style="cursor:pointer;color:var(--primary);font-weight:700;font-size:16px">+</span>' : ''}</td>
        </tr>
        ${subsHtml}`;
    }).join('');

    el.innerHTML = `<div class="card"><div class="table-wrapper"><table class="data-table" style="font-size:var(--text-xs)">
      <thead><tr>
        <th>订单编号</th><th>订单类型</th><th>刊例价</th><th>商品原价</th><th>优惠金额</th><th>应付金额</th><th>提单人</th><th>创建时间</th><th>审批状态</th><th>订单状态</th><th style="width:40px"></th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table></div></div>`;

    // 展开/收起子订单
    el.addEventListener('click', (e) => {
      const expandBtn = e.target.closest('.expand-icon');
      if (expandBtn) {
        const row = expandBtn.closest('.master-order-row');
        const parentId = row?.dataset.orderId;
        if (!parentId) return;
        const subRows = el.querySelectorAll(`.sub-order-row[data-parent="${parentId}"]`);
        const isHidden = subRows[0]?.style.display === 'none';
        subRows.forEach(r => r.style.display = isHidden ? '' : 'none');
        expandBtn.textContent = isHidden ? '−' : '+';
        return;
      }
      // 点击主订单行跳转详情
      const masterRow = e.target.closest('.master-order-row');
      if (masterRow && !e.target.closest('.expand-icon')) {
        Router.navigate(`#/orders/view/${masterRow.dataset.orderId}`);
      }
    });

    return el;
  },

  showForm(id) {
    const isEdit = !!id;
    const data = isEdit ? Store.getById(this.COLLECTION, id) : {};

    const customers = Store.getAll('customers').map(c => ({ value: c.id, label: c.name }));
    const fields = this.FIELDS.map(f => f.key === 'customerId' ? { ...f, options: customers } : f);

    UI.formModal({
      title: isEdit ? '编辑订单' : '新建订单',
      fields: isEdit ? fields : fields,
      data,
      onSubmit: (formData) => {
        if (!isEdit) {
          formData.orderNo = Helpers.generateOrderNo();
          formData.items = [];
          formData.totalAmount = 0;
        }
        if (isEdit) {
          Store.update(this.COLLECTION, id, formData);
          UI.toast('订单已更新');
        } else {
          Store.create(this.COLLECTION, formData);
          UI.toast('订单已创建');
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
      title: '删除订单',
      message: `确定要删除订单「${item.orderNo}」吗？`,
      type: 'danger',
      confirmText: '确认删除',
      onConfirm: () => {
        Store.delete(this.COLLECTION, id);
        UI.toast('订单已删除');
        Router.navigate('#/orders');
      }
    });
  },

  init() {
    Router.register('#/orders', () => this.renderList());
    Router.register('#/orders/view/:id', ({ id }) => this.renderDetail(id));
  }
};
