/* ============================================
   CRM 系统 - 跟进记录模块
   ============================================ */
const FollowUps = {
  COLLECTION: 'followups',

  TYPE_MAP: { '电话': 'primary', '拜访': 'success', '邮件': 'info', '微信': 'success', '会议': 'warning', '其他': 'gray' },

  FIELDS: [
    { key: 'type', label: '跟进方式', type: 'select', required: true, options: ['电话', '拜访', '邮件', '微信', '会议', '其他'], default: '电话' },
    { key: 'content', label: '跟进内容', type: 'textarea', required: true, fullWidth: true, placeholder: '记录跟进详情...', rows: 4 },
    { key: 'nextFollowDate', label: '下次跟进日期', type: 'date' },
  ],

  renderList() {
    UI.setPageTitle('跟进记录');
    const data = Store.getAll(this.COLLECTION);

    const el = document.createElement('div');
    el.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <h2 class="page-title">跟进记录</h2>
          <p class="page-subtitle">查看所有跟进活动</p>
        </div>
      </div>
      <div id="table-container"></div>
    `;

    const table = Components.DataTable({
      columns: [
        { key: 'type', label: '联系类型', width: '90px', render: v => Components.Badge(v, FollowUps.TYPE_MAP[v] || 'gray') },
        { key: 'content', label: '跟进内容', render: v => Helpers.escapeHtml(Helpers.truncate(v, 60)) },
        { key: '_contactInfo', label: '联系人/职务', width: '140px', render: (v, item) => {
          let contact = null;
          if (item.relatedType === 'customer' && item.relatedId) {
            contact = Store.query('contacts', c => c.customerId === item.relatedId && (c.isPrimary === true || c.isPrimary === 'true'));
            if (contact.length === 0) {
              contact = Store.query('contacts', c => c.customerId === item.relatedId);
            }
            contact = contact.length > 0 ? contact[0] : null;
          } else if (item.relatedType === 'opportunity' && item.relatedId) {
            const opp = Store.getById('opportunities', item.relatedId);
            if (opp && opp.contactId) {
              contact = Store.getById('contacts', opp.contactId);
            }
          }
          if (!contact) {
            const customer = item.relatedType ? Store.getById('customers', item.relatedId) : null;
            if (customer) {
              const contacts = Store.query('contacts', c => c.customerId === item.relatedId);
              contact = contacts.length > 0 ? contacts[0] : null;
            }
          }
          if (contact) {
            return `<span>${Helpers.escapeHtml(contact.name)} / ${Helpers.escapeHtml(contact.title || '-')}</span>`;
          }
          return '-';
        }},
        { key: 'relatedType', label: '关联对象', width: '80px', render: v => {
          const map = { lead: '线索', customer: '客户', opportunity: '商机' };
          return map[v] || v;
        }},
        { key: 'relatedId', label: '关联名称', render: (v, item) => {
          const collMap = { lead: 'leads', customer: 'customers', opportunity: 'opportunities' };
          const coll = collMap[item.relatedType];
          if (!coll) return '-';
          const obj = Store.getById(coll, v);
          if (!obj) return '-';
          const hashMap = { lead: '#/leads/view/', customer: '#/customers/view/', opportunity: '#/opportunities/view/' };
          return `<span class="cell-link" data-href="${hashMap[item.relatedType]}${v}">${Helpers.escapeHtml(obj.name)}</span>`;
        }},
        { key: 'creator', label: '创建人', width: '80px', render: (v, item) => {
          return v || item.author || '-';
        }},
        { key: 'createdAt', label: '创建时间', width: '150px', sortable: true, render: v => Helpers.formatDateTime(v) },
        { key: 'nextFollowDate', label: '下次跟进', width: '110px', render: v => {
          if (!v) return '-';
          const d = new Date(v);
          const today = new Date();
          today.setHours(0,0,0,0);
          const isOverdue = d < today;
          return `<span style="color:${isOverdue ? 'var(--danger)' : 'inherit'};font-weight:${isOverdue ? '600' : 'normal'}">${Helpers.formatDate(v)}</span>`;
        }},
      ],
      data,
      searchKeys: ['content', 'creator'],
      searchPlaceholder: '搜索跟进内容...',
      sortKey: 'createdAt',
      filterFields: [
        { key: 'department', label: '销售部门', type: 'select', placeholder: '请选择', options: ['销售一部', '销售二部'], customFilter: (item, val) => {
          if (!val) return true;
          const customer = Store.getById('customers', item.relatedId);
          if (!customer) return false;
          return customer.department === val;
        }},
        { key: 'sales', label: '销售', type: 'text', placeholder: '请输入销售姓名', customFilter: (item, val) => {
          if (!val) return true;
          const customer = Store.getById('customers', item.relatedId);
          if (!customer) return false;
          return customer.assignee && customer.assignee.toLowerCase().includes(val.toLowerCase());
        }},
        { key: 'createdAt', label: '创建时间', type: 'dateRange', placeholder: '选择日期范围' },
        { key: 'type', label: '联系类型', type: 'select', placeholder: '请选择', options: ['电话', '拜访', '邮件', '微信', '会议', '其他'] },
        { key: 'relatedType', label: '关联对象', type: 'select', placeholder: '请选择', options: ['线索', '客户', '商机'], customFilter: (item, val) => {
          if (!val) return true;
          const map = { '线索': 'lead', '客户': 'customer', '商机': 'opportunity' };
          return item.relatedType === (map[val] || val);
        }},
      ],
    });

    el.querySelector('#table-container').appendChild(table);
    el.querySelector('#btn-add').addEventListener('click', () => this.showForm());
    el.addEventListener('click', (e) => {
      const link = e.target.closest('[data-href]');
      if (link) { e.stopPropagation(); Router.navigate(link.dataset.href); }
    });

    UI.render(el);
  },

  // 时间线渲染（用于详情页内嵌）
  renderTimeline(followups, relatedType, relatedId) {
    const el = document.createElement('div');

    const addBtn = `<div style="display:flex;justify-content:flex-end;margin-bottom:var(--space-3)">
      <button class="btn btn-primary btn-sm" id="btn-add-followup"><svg viewBox="0 0 24 24">${UI.icons.plus}</svg> 添加跟进</button>
    </div>`;

    if (followups.length === 0) {
      el.innerHTML = `${addBtn}
        <div class="table-empty" style="padding:var(--space-6)">
          <div class="empty-icon">📝</div>
          <div class="empty-text">暂无跟进记录</div>
        </div>
      `;
    } else {
      const sorted = [...followups].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const timelineHtml = sorted.map(f => `
        <div class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-time">${Helpers.formatDateTime(f.createdAt)}</div>
          <div class="timeline-content">
            <span class="timeline-type">${Helpers.escapeHtml(f.type)}</span>
            ${Helpers.escapeHtml(f.content)}
            ${f.nextFollowDate ? `<div style="margin-top:var(--space-1);font-size:var(--text-xs);color:var(--text-muted)">下次跟进：${Helpers.formatDate(f.nextFollowDate)}</div>` : ''}
          </div>
        </div>
      `).join('');

      el.innerHTML = `${addBtn}<div class="card" style="padding:var(--space-5)"><div class="timeline">${timelineHtml}</div></div>`;
    }

    el.querySelector('#btn-add-followup')?.addEventListener('click', () => {
      this.showForm(null, relatedType, relatedId);
    });

    return el;
  },

  showForm(id, relatedType, relatedId) {
    const fields = [...this.FIELDS];

    // 如果没有提供关联信息，需要选择
    if (!relatedType) {
      fields.unshift(
        { key: 'relatedType', label: '关联类型', type: 'select', required: true, options: [
          { value: 'lead', label: '线索' },
          { value: 'customer', label: '客户' },
          { value: 'opportunity', label: '商机' },
        ]},
        { key: 'relatedId', label: '关联对象', type: 'select', required: true, options: [] }
      );
    }

    const { overlay } = UI.formModal({
      title: '新建跟进记录',
      fields,
      data: { relatedType, relatedId },
      onSubmit: (formData) => {
        if (relatedType) {
          formData.relatedType = relatedType;
          formData.relatedId = relatedId;
        }
        Store.create(this.COLLECTION, formData);
        UI.toast('跟进记录已添加');

        // 刷新当前页面
        const route = Router.current();
        if (route) {
          if (route.hash.includes('/leads/view/')) Leads.renderDetail(relatedId);
          else if (route.hash.includes('/customers/view/')) Customers.renderDetail(relatedId);
          else if (route.hash.includes('/opportunities/view/')) Opportunities.renderDetail(relatedId);
          else this.renderList();
        }
      }
    });

    // 动态更新关联对象选项
    if (!relatedType) {
      const typeSelect = overlay.querySelector('[name="relatedType"]');
      const idSelect = overlay.querySelector('[name="relatedId"]');
      if (typeSelect && idSelect) {
        typeSelect.addEventListener('change', () => {
          const type = typeSelect.value;
          const collMap = { lead: 'leads', customer: 'customers', opportunity: 'opportunities' };
          const items = Store.getAll(collMap[type] || '');
          idSelect.innerHTML = '<option value="">请选择</option>' + items.map(i => `<option value="${i.id}">${Helpers.escapeHtml(i.name)}</option>`).join('');
        });
      }
    }
  },

  handleDelete(id) {
    UI.confirm({
      title: '删除跟进记录',
      message: '确定要删除此跟进记录吗？',
      type: 'danger',
      confirmText: '确认删除',
      onConfirm: () => {
        Store.delete(this.COLLECTION, id);
        UI.toast('跟进记录已删除');
        this.renderList();
      }
    });
  },

  init() {
    Router.register('#/followups', () => this.renderList());
  }
};
