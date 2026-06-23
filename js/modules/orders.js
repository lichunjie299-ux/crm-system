/* ============================================
   CRM 系统 - 订单管理模块
   ============================================ */
const Orders = {
  COLLECTION: 'orders',

  STATUS_MAP: { '待付款': 'warning', '部分付款': 'info', '已付款': 'primary', '已关闭': 'gray', '已完成': 'success' },

  FIELDS: [
    { key: 'customerId', label: '客户', type: 'select', required: true, options: [] },
    { key: 'status', label: '状态', type: 'select', required: true, options: ['待付款', '部分付款', '已付款', '已关闭', '已完成'], default: '待付款' },
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
        </div>
      </div>
      <div id="table-container"></div>
    `;

    const statusCounts = {};
    allData.forEach(d => { statusCounts[d.status] = (statusCounts[d.status] || 0) + 1; });

    const filters = [{ label: `全部 (${allData.length})`, value: 'all' }];
    ['待付款', '部分付款', '已付款', '已关闭', '已完成'].forEach(s => {
      if (statusCounts[s]) filters.push({ label: `${s} (${statusCounts[s]})`, value: s });
    });

    const table = Components.DataTable({
      columns: [
        { key: 'orderNo', label: '订单编号', width: '130px', sortable: true, render: (v, item) => `<span class="cell-link font-mono" data-id="${item.id}">${Helpers.escapeHtml(v || '')}</span>` },
        { key: 'customerId', label: '客户名称', width: '110px', render: v => { const c = Store.getById('customers', v); return c ? `<span class="cell-link" data-customer="${v}">${Helpers.escapeHtml(c.name)}</span>` : '-'; }},
        { key: 'orderSource', label: '订单来源', width: '80px', render: v => v || '-' },
        { key: 'currency', label: '币种', width: '50px', render: v => v || 'CNY' },
        { key: 'listPrice', label: '刊例价', width: '90px', sortable: true, render: v => v ? Helpers.formatMoney(v) : '-' },
        { key: 'originalPrice', label: '商品原价', width: '90px', sortable: true, render: v => v ? Helpers.formatMoney(v) : '-' },
        { key: 'discount', label: '优惠金额', width: '90px', sortable: true, render: v => v ? `<span style="color:var(--danger)">${Helpers.formatMoney(v)}</span>` : '-' },
        { key: 'payableAmount', label: '应付金额', width: '100px', sortable: true, render: v => { const amt = v || 0; return `<strong style="color:var(--primary)">${Helpers.formatMoney(amt)}</strong>`; }},
        { key: 'paymentMethod', label: '支付形式', width: '80px', render: v => v || '-' },
        { key: 'submitter', label: '提单人', width: '70px', render: v => v || '-' },
        { key: 'createdAt', label: '创建日期', width: '100px', sortable: true, render: v => Helpers.formatDate(v) },
        { key: 'approvalStatus', label: '审核状态', width: '80px', render: v => Components.Badge(v || '待审批', (v === '已审批' ? 'success' : v === '已驳回' ? 'danger' : 'warning')) },
        { key: 'status', label: '订单状态', width: '70px', render: v => Components.Badge(v, Orders.STATUS_MAP[v] || 'gray') },
      ],
      data,
      searchKeys: ['orderNo'],
      searchPlaceholder: '搜索订单编号...',
      filters,
      activeFilter: statusFilter || 'all',
      onFilterChange: (filter) => this.renderList(filter === 'all' ? null : filter),
      actions: {
        onView: (id) => Router.navigate(`#/orders/view/${id}`),
        onDelete: (id) => this.handleDelete(id),
      },
      onRowClick: (id) => Router.navigate(`#/orders/view/${id}`),
      sortKey: 'createdAt',
    });

    el.querySelector('#table-container').appendChild(table);
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
          <button class="btn btn-secondary" id="btn-delete" style="color:var(--danger)"><svg viewBox="0 0 24 24">${UI.icons.trash}</svg> 删除</button>
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

      ${(item.contractsData && item.contractsData.length > 0) ? `
      <div class="card" style="margin-bottom:var(--space-4)">
        <div class="card-header"><h3 class="card-title">合同信息</h3></div>
        <div class="card-body" style="padding:var(--space-3) var(--space-4)">
          <div class="order-contract-tabs" style="margin-bottom:var(--space-3)">
            ${item.contractsData.map(function(c, i) {
              var active = i === 0 ? 'order-contract-tab active' : 'order-contract-tab';
              return '<button class="' + active + '" data-oidx="' + i + '">' + Helpers.escapeHtml(c.label) + '</button>';
            }).join('')}
          </div>
          ${item.contractsData.map(function(c, i) {
            var display = i === 0 ? '' : 'display:none';
            return '<div class="order-contract-panel-body" data-opanel-idx="' + i + '" style="' + display + ';border:1px solid var(--border-light);border-radius:4px;padding:var(--space-3) var(--space-4)">' +
              '<div class="detail-card" style="grid-template-columns:1fr 1fr 1fr;margin-bottom:var(--space-3)">' +
                '<div class="detail-field"><div class="field-label">合同编号</div><div class="field-value font-mono">' + Helpers.escapeHtml(c.contractNo) + '</div></div>' +
                '<div class="detail-field"><div class="field-label">合同类型</div><div class="field-value">' + Helpers.escapeHtml(c.contractType) + '</div></div>' +
                '<div class="detail-field"><div class="field-label">乙方主体</div><div class="field-value">' + Helpers.escapeHtml(c.partyB || '-') + '</div></div>' +
                '<div class="detail-field"><div class="field-label">签约人</div><div class="field-value">' + Helpers.escapeHtml(c.signer || '-') + '</div></div>' +
                '<div class="detail-field"><div class="field-label">合同金额</div><div class="field-value"><strong style="color:var(--primary)">' + Helpers.formatMoney(c.amount) + '</strong></div></div>' +
                '<div class="detail-field"><div class="field-label">盖章状态</div><div class="field-value">' + (c.isSealed === '是' ? '已盖章' : '未盖章') + '</div></div>' +
              '</div>' +
              '<h4 style="font-size:var(--text-xs);font-weight:600;color:var(--text-secondary);margin-bottom:var(--space-2)">归属商品明细</h4>' +
              '<table class="data-table" style="font-size:var(--text-xs)">' +
                '<thead><tr><th>商品名称</th><th style="width:120px">金额</th></tr></thead>' +
                '<tbody>' + (c.items || []).map(function(item) {
                  return '<tr><td>' + Helpers.escapeHtml(item.productName) + '</td><td><strong style="color:var(--primary)">' + Helpers.formatMoney(item.payable) + '</strong></td></tr>';
                }).join('') + '</tbody>' +
              '</table>' +
            '</div>';
          }).join('')}
        </div>
      </div>
      ` : ''}

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

    // 合同信息 tab 切换
    el.addEventListener('click', function(e) {
      var tab = e.target.closest('.order-contract-tabs [data-oidx]');
      if (tab) {
        var idx = tab.dataset.oidx;
        tab.parentElement.querySelectorAll('[data-oidx]').forEach(function(t) { t.classList.remove('active'); });
        tab.classList.add('active');
        el.querySelectorAll('[data-opanel-idx]').forEach(function(p) {
          p.style.display = p.dataset.opanelIdx === idx ? '' : 'none';
        });
      }
    });

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
        <td>${Helpers.escapeHtml(s.orderSource || '-')}</td>
        <td>${s.currency || 'CNY'}</td>
        <td>${Helpers.formatMoney(s.listPrice)}</td>
        <td>${Helpers.formatMoney(s.originalPrice)}</td>
        <td style="color:var(--danger)">${Helpers.formatMoney(s.discount)}</td>
        <td><strong style="color:var(--primary)">${Helpers.formatMoney(s.payableAmount)}</strong></td>
        <td>${s.paymentMethod || '-'}</td>
        <td>${Helpers.escapeHtml(s.submitter || '-')}</td>
        <td>${Helpers.formatDate(s.createdAt)}</td>
        <td>${Components.Badge(s.approvalStatus || '待审批', (s.approvalStatus === '已审批' ? 'success' : s.approvalStatus === '已驳回' ? 'danger' : 'warning'))}</td>
        <td>${Components.Badge(s.status || '待付款', Orders.STATUS_MAP[s.status] || 'gray')}</td>
      </tr>`).join('') : '';

      const hasSub = subs.length > 0;
      return `
        <tr class="master-order-row" data-order-id="${o.id}" style="cursor:pointer">
          <td><span class="font-mono">${Helpers.escapeHtml(o.orderNo || '-')}</span></td>
          <td>${Helpers.escapeHtml(o.orderSource || '-')}</td>
          <td>${o.currency || 'CNY'}</td>
          <td>${Helpers.formatMoney(o.listPrice)}</td>
          <td>${Helpers.formatMoney(o.originalPrice)}</td>
          <td style="color:var(--danger)">${Helpers.formatMoney(o.discount)}</td>
          <td><strong style="color:var(--primary)">${Helpers.formatMoney(o.payableAmount)}</strong></td>
          <td>${o.paymentMethod || '-'}</td>
          <td>${Helpers.escapeHtml(o.submitter || '-')}</td>
          <td>${Helpers.formatDate(o.createdAt)}</td>
          <td>${Components.Badge(o.approvalStatus || '待审批', (o.approvalStatus === '已审批' ? 'success' : o.approvalStatus === '已驳回' ? 'danger' : 'warning'))}</td>
          <td>${Components.Badge(o.status || '待付款', Orders.STATUS_MAP[o.status] || 'gray')}</td>
          <td style="width:40px;text-align:center">${hasSub ? '<span class="expand-icon" style="cursor:pointer;color:var(--primary);font-weight:700;font-size:16px">+</span>' : ''}</td>
        </tr>
        ${subsHtml}`;
    }).join('');

    el.innerHTML = `<div class="card"><div class="table-wrapper"><table class="data-table" style="font-size:var(--text-xs)">
      <thead><tr>
        <th>订单编号</th><th>订单来源</th><th>币种</th><th>刊例价</th><th>商品原价</th><th>优惠金额</th><th>应付金额</th><th>支付形式</th><th>提单人</th><th>创建时间</th><th>审核状态</th><th>订单状态</th><th style="width:40px"></th>
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
    const customers = Store.getAll('customers').filter(c => c.poolStatus !== 'in_pool').map(c => ({ value: c.id, label: c.name }));

    const contentEl = document.createElement('div');

    // 客户选项
    const customerOptions = customers.map(c =>
      `<option value="${c.value}" ${data.customerId === c.value ? 'selected' : ''}>${Helpers.escapeHtml(c.label)}</option>`
    ).join('');

    if (!isEdit) {
      // 新建订单：增强表单，支持关联赢单商机
      contentEl.innerHTML = `
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">客户 <span class="required">*</span></label>
            <select class="form-select" id="order-customer-id">
              <option value="">请选择客户</option>
              ${customerOptions}
            </select>
          </div>
        </div>

        <div class="form-group" id="opp-select-group" style="display:none;margin-top:var(--space-4)">
          <label class="form-label">关联赢单商机 <span style="font-size:12px;color:var(--text-muted);font-weight:400">（选填，选择后自动填充订单明细）</span></label>
          <select class="form-select" id="order-opportunity-id">
            <option value="">请选择商机</option>
          </select>
        </div>

        <div id="opp-preview" style="display:none;margin-top:var(--space-3);padding:var(--space-3);background:#f6f8fa;border-radius:4px;border:1px solid var(--border-light)">
          <div style="font-weight:600;margin-bottom:var(--space-2);font-size:13px">📋 订单明细（来自商机）</div>
          <div id="opp-preview-items"></div>
          <div id="opp-preview-total" style="text-align:right;font-weight:700;color:var(--primary);margin-top:var(--space-2);padding-top:var(--space-2);border-top:1px solid var(--border-light)"></div>
        </div>

        <div class="form-grid" style="margin-top:var(--space-4)">
          <div class="form-group">
            <label class="form-label">状态</label>
            <select class="form-select" id="order-status">
              ${['待付款', '部分付款', '已付款', '已关闭', '已完成'].map(s =>
                `<option value="${s}" ${(data.status || '待付款') === s ? 'selected' : ''}>${s}</option>`
              ).join('')}
            </select>
          </div>
          <div class="form-group full-width">
            <label class="form-label">备注</label>
            <textarea class="form-textarea" id="order-remark" rows="3" placeholder="订单备注...">${Helpers.escapeHtml(data.remark || '')}</textarea>
          </div>
        </div>
      `;
    } else {
      // 编辑订单：保持简洁
      contentEl.innerHTML = `
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">客户 <span class="required">*</span></label>
            <select class="form-select" id="order-customer-id" disabled>
              ${customerOptions}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">状态</label>
            <select class="form-select" id="order-status">
              ${['待付款', '部分付款', '已付款', '已关闭', '已完成'].map(s =>
                `<option value="${s}" ${(data.status || '待付款') === s ? 'selected' : ''}>${s}</option>`
              ).join('')}
            </select>
          </div>
          <div class="form-group full-width">
            <label class="form-label">备注</label>
            <textarea class="form-textarea" id="order-remark" rows="3" placeholder="订单备注...">${Helpers.escapeHtml(data.remark || '')}</textarea>
          </div>
        </div>
      `;
    }

    // 选中商机的数据缓存
    let selectedOppData = null;

    if (!isEdit) {
      const customerSelect = contentEl.querySelector('#order-customer-id');
      const oppSelect = contentEl.querySelector('#order-opportunity-id');
      const oppSelectGroup = contentEl.querySelector('#opp-select-group');
      const oppPreview = contentEl.querySelector('#opp-preview');
      const oppPreviewItems = contentEl.querySelector('#opp-preview-items');
      const oppPreviewTotal = contentEl.querySelector('#opp-preview-total');

      customerSelect.addEventListener('change', () => {
        const cId = customerSelect.value;
        if (!cId) {
          oppSelectGroup.style.display = 'none';
          oppPreview.style.display = 'none';
          selectedOppData = null;
          return;
        }
        // 查找该客户下赢单阶段的商机
        const wonOpps = Store.query('opportunities', o => o.customerId === cId && o.stage === '赢单');
        if (wonOpps.length > 0) {
          oppSelectGroup.style.display = '';
          oppSelect.innerHTML = '<option value="">请选择商机</option>' +
            wonOpps.map(o =>
              `<option value="${o.id}">${Helpers.escapeHtml(o.name)}（${Helpers.formatMoney(o.amount)}）</option>`
            ).join('');
        } else {
          oppSelectGroup.style.display = 'none';
          oppPreview.style.display = 'none';
          selectedOppData = null;
        }
      });

      oppSelect.addEventListener('change', () => {
        const oppId = oppSelect.value;
        if (!oppId) {
          oppPreview.style.display = 'none';
          selectedOppData = null;
          return;
        }
        const opp = Store.getById('opportunities', oppId);
        if (!opp) return;

        const products = Array.isArray(opp.intendedProducts) && opp.intendedProducts.length > 0
          ? opp.intendedProducts
          : (opp.intendedProduct ? [{ product: opp.intendedProduct, amount: opp.amount }] : []);

        if (products.length === 0) {
          oppPreview.style.display = 'none';
          selectedOppData = null;
          return;
        }

        const itemsHtml = products.map(p => `
          <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border-light);font-size:13px">
            <span>${Helpers.escapeHtml(p.product)}</span>
            <span style="font-weight:500">${Helpers.formatMoney(p.amount)}</span>
          </div>
        `).join('');

        oppPreviewItems.innerHTML = itemsHtml;
        oppPreviewTotal.textContent = '合计：' + Helpers.formatMoney(opp.amount);
        oppPreview.style.display = '';

        selectedOppData = {
          opportunityId: opp.id,
          items: products.map(p => ({
            productId: '',
            productName: p.product,
            quantity: 1,
            unitPrice: p.amount,
            subtotal: p.amount
          })),
          totalAmount: opp.amount
        };
      });

      // 如果已经有预选客户（从客户详情子列表进入），自动触发
      if (data.customerId) {
        setTimeout(() => customerSelect.dispatchEvent(new Event('change')), 0);
      }
    }

    const footer = `
      <button class="btn btn-secondary" data-close-modal>取消</button>
      <button class="btn btn-primary" id="order-submit-btn">${isEdit ? '保存' : '创建订单'}</button>
    `;

    const { overlay, close } = UI.modal({
      title: isEdit ? '编辑订单' : '新建订单',
      content: contentEl,
      footer,
      size: isEdit ? 'sm' : 'md',
    });

    overlay.querySelector('#order-submit-btn').addEventListener('click', () => {
      const customerId = contentEl.querySelector('#order-customer-id')?.value;
      const status = contentEl.querySelector('#order-status')?.value || '待付款';
      const remark = contentEl.querySelector('#order-remark')?.value.trim() || '';

      if (!customerId) {
        UI.toast('请选择客户', 'error');
        return;
      }

      const formData = { customerId, status, remark };

      if (isEdit) {
        Store.update(this.COLLECTION, id, formData);
        UI.toast('订单已更新');
        close();
        const route = Router.current();
        if (route && route.hash.includes('/view/')) this.renderDetail(id);
        else this.renderList();
      } else {
        formData.orderNo = Helpers.generateOrderNo();

        if (selectedOppData) {
          formData.opportunityId = selectedOppData.opportunityId;
          formData.items = selectedOppData.items;
          formData.totalAmount = selectedOppData.totalAmount;
        } else {
          formData.items = [];
          formData.totalAmount = 0;
        }

        Store.create(this.COLLECTION, formData);
        UI.toast('订单已创建');
        close();
        this.renderList();
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
