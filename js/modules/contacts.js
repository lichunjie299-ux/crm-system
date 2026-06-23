/* ============================================
   CRM 系统 - 联系人管理模块
   ============================================ */
const Contacts = {
  COLLECTION: 'contacts',

  FIELDS: [
    { key: 'name', label: '姓名', type: 'text', required: true, placeholder: '联系人姓名' },
    { key: 'title', label: '职位', type: 'text', placeholder: '如：销售经理' },
    { key: 'phone', label: '电话', type: 'text', placeholder: '手机号码' },
    { key: 'email', label: '邮箱', type: 'email', placeholder: 'example@email.com' },
    { key: 'isPrimary', label: '主要联系人', type: 'select', options: [{ value: 'true', label: '是' }, { value: 'false', label: '否' }], default: 'false' },
    { key: 'remark', label: '备注', type: 'textarea', fullWidth: true, placeholder: '备注...' },
  ],

  renderList() {
    UI.setPageTitle('联系人管理');
    const data = Store.getAll(this.COLLECTION);

    const el = document.createElement('div');
    el.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <h2 class="page-title">联系人管理</h2>
          <p class="page-subtitle">管理所有客户联系人</p>
        </div>
        <div class="page-header-right">
          <button class="btn btn-primary" id="btn-add"><svg viewBox="0 0 24 24">${UI.icons.plus}</svg> 新建联系人</button>
        </div>
      </div>
      <div id="table-container"></div>
    `;

    const table = Components.DataTable({
      columns: [
        { key: 'name', label: '姓名', sortable: true, render: (v, item) => {
          const primary = item.isPrimary === true || item.isPrimary === 'true' ? ' <span class="badge badge-primary" style="margin-left:4px">决策人</span>' : '';
          return `<strong>${Helpers.escapeHtml(v || '')}</strong>${primary}`;
        }},
        { key: 'title', label: '职位', width: '120px' },
        { key: 'customerId', label: '所属客户', render: (v) => {
          const cust = Store.getById('customers', v);
          return cust ? `<span class="cell-link" data-customer="${v}">${Helpers.escapeHtml(cust.name)}</span>` : '-';
        }},
        { key: 'phone', label: '电话', width: '130px', render: v => v ? `<a href="tel:${v}">${Helpers.escapeHtml(v)}</a>` : '-' },
        { key: 'email', label: '邮箱', width: '180px', render: v => v ? `<a href="mailto:${v}">${Helpers.escapeHtml(v)}</a>` : '-' },
        { key: 'createdAt', label: '创建时间', width: '110px', sortable: true, render: v => Helpers.formatDate(v) },
      ],
      data,
      searchKeys: ['name', 'title', 'phone', 'email'],
      searchPlaceholder: '搜索姓名、职位、电话...',
      actions: {
        onEdit: (id) => this.showForm(id),
        onDelete: (id) => this.handleDelete(id),
      },
    });

    el.querySelector('#table-container').appendChild(table);
    el.querySelector('#btn-add').addEventListener('click', () => this.showForm());
    el.addEventListener('click', (e) => {
      const link = e.target.closest('[data-customer]');
      if (link) { e.stopPropagation(); Router.navigate(`#/customers/view/${link.dataset.customer}`); }
    });

    UI.render(el);
  },

  // 嵌入客户详情页的子列表
  renderSubList(contacts, customerId) {
    const el = document.createElement('div');

    if (contacts.length === 0) {
      el.innerHTML = `
        <div class="table-empty" style="padding:var(--space-8)">
          <div class="empty-icon">👥</div>
          <div class="empty-text">暂无联系人</div>
          <button class="btn btn-primary btn-sm" id="btn-add-contact"><svg viewBox="0 0 24 24">${UI.icons.plus}</svg> 添加联系人</button>
        </div>
      `;
    } else {
      const rows = contacts.map(c => {
        const primary = c.isPrimary === true || c.isPrimary === 'true' ? '<span class="badge badge-primary" style="margin-left:4px">决策人</span>' : '';
        return `<tr>
          <td><strong>${Helpers.escapeHtml(c.name)}</strong>${primary}</td>
          <td>${Helpers.escapeHtml(c.title || '-')}</td>
          <td>${c.phone ? `<a href="tel:${c.phone}">${Helpers.escapeHtml(c.phone)}</a>` : '-'}</td>
          <td>${c.email ? `<a href="mailto:${c.email}">${Helpers.escapeHtml(c.email)}</a>` : '-'}</td>
          <td>
            <div class="cell-actions">
              <button class="action-btn" data-edit-contact="${c.id}" title="编辑"><svg viewBox="0 0 24 24">${UI.icons.edit}</svg></button>
              <button class="action-btn danger" data-delete-contact="${c.id}" title="删除"><svg viewBox="0 0 24 24">${UI.icons.trash}</svg></button>
            </div>
          </td>
        </tr>`;
      }).join('');

      el.innerHTML = `
        <div style="display:flex;justify-content:flex-end;margin-bottom:var(--space-3)">
          <button class="btn btn-primary btn-sm" id="btn-add-contact"><svg viewBox="0 0 24 24">${UI.icons.plus}</svg> 添加联系人</button>
        </div>
        <div class="card">
          <div class="table-wrapper">
            <table class="data-table">
              <thead><tr><th>姓名</th><th>职位</th><th>电话</th><th>邮箱</th><th style="width:80px">操作</th></tr></thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        </div>
      `;
    }

    // 事件
    el.querySelector('#btn-add-contact')?.addEventListener('click', () => {
      this.showForm(null, customerId);
    });
    el.querySelectorAll('[data-edit-contact]').forEach(btn => {
      btn.addEventListener('click', () => this.showForm(btn.dataset.editContact, customerId));
    });
    el.querySelectorAll('[data-delete-contact]').forEach(btn => {
      btn.addEventListener('click', () => this.handleDelete(btn.dataset.deleteContact, customerId));
    });

    return el;
  },

  showForm(id, customerId) {
    const isEdit = !!id;
    const data = isEdit ? Store.getById(this.COLLECTION, id) : {};

    // 如果不在客户详情页中，需要选择客户
    const fields = [...this.FIELDS];
    if (!customerId && !isEdit) {
      const customers = Store.getAll('customers').map(c => ({ value: c.id, label: c.name }));
      fields.unshift({ key: 'customerId', label: '所属客户', type: 'select', required: true, options: customers });
    }

    UI.formModal({
      title: isEdit ? '编辑联系人' : '添加联系人',
      fields,
      data,
      onSubmit: (formData) => {
        if (!formData.customerId && customerId) formData.customerId = customerId;
        if (formData.isPrimary === 'true') formData.isPrimary = true;
        else formData.isPrimary = false;

        if (isEdit) {
          Store.update(this.COLLECTION, id, formData);
          UI.toast('联系人已更新');
        } else {
          Store.create(this.COLLECTION, formData);
          UI.toast('联系人已添加');
        }

        // 刷新客户详情
        if (customerId) {
          Customers.renderDetail(customerId);
        } else {
          this.renderList();
        }
      }
    });
  },

  handleDelete(id, customerId) {
    const item = Store.getById(this.COLLECTION, id);
    if (!item) return;
    UI.confirm({
      title: '删除联系人',
      message: `确定要删除联系人「${item.name}」吗？`,
      type: 'danger',
      confirmText: '确认删除',
      onConfirm: () => {
        Store.delete(this.COLLECTION, id);
        UI.toast('联系人已删除');
        if (customerId) Customers.renderDetail(customerId);
        else this.renderList();
      }
    });
  },

  init() {
    Router.register('#/contacts', () => this.renderList());
  }
};
