/* ============================================
   CRM 系统 - 线索管理模块
   ============================================ */
const Leads = {
  COLLECTION: 'leads',

  FIELDS: [
    { key: 'bizLine', label: '业务线', type: 'select', required: true, options: ['上海营销中心', '北京营销中心', '广州营销中心', '杭州营销中心', '深圳营销中心'] },
    { key: 'productLine', label: '产品线', type: 'select', required: true, options: ['新零售', '零售SaaS', '到店', '智慧商超', '视频号', '定制开发'] },
    { key: 'contactInfo', label: '联系人及方式', type: 'text', required: true, placeholder: '如：张伟 13812345678' },
    { key: 'region', label: '地区', type: 'text', required: true, placeholder: '如：上海、北京' },
    { key: 'source', label: '线索来源', type: 'select', required: true, options: ['市场活动-展会'] },
    { key: 'cleanTag', label: '清洗标签', type: 'select', options: ['有效线索-转客户', '无效线索-放弃公海', '暂未接通-继续清洗'] },
    { key: 'cleanMemo', label: '清洗备忘录', type: 'text', placeholder: '清洗备注信息' },
    { key: 'customerName', label: '客户名称', type: 'text', placeholder: '请输入客户名称' },
    { key: 'customerType', label: '客户类型', type: 'select', options: ['企业客户', '个人客户'] },
    { key: 'industry', label: '行业', type: 'select', options: ['互联网/IT', '金融', '制造业', '教育', '医疗', '房地产', '零售', '其他'] },
    { key: 'status', label: '状态', type: 'select', required: true, options: ['新线索', '跟进中', '已转化', '已关闭'], default: '新线索' },
    { key: 'assignee', label: '负责人', type: 'text', placeholder: '负责人姓名' },
    { key: 'remark', label: '备注', type: 'textarea', fullWidth: true, placeholder: '备注信息...' },
  ],

  STATUS_MAP: { '新线索': 'primary', '跟进中': 'warning', '已转化': 'success', '已关闭': 'gray' },
  CLEAN_TAG_MAP: { '有效线索-转客户': 'success', '无效线索-放弃公海': 'danger', '暂未接通-继续清洗': 'warning' },
  BIZ_LINE_MAP: { '上海营销中心': 'primary', '北京营销中心': 'info', '广州营销中心': 'success', '杭州营销中心': 'warning', '深圳营销中心': 'danger' },

  renderList(statusFilter) {
    UI.setPageTitle('线索管理');
    const allData = Store.getAll(this.COLLECTION).filter(l => l.poolStatus !== 'in_pool');
    const data = statusFilter ? allData.filter(d => d.status === statusFilter) : allData;

    const el = document.createElement('div');
    el.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <h2 class="page-title">线索管理</h2>
          <p class="page-subtitle">管理和跟进销售线索，销售线索管理容量200个，21天未转客户掉保至线索公海</p>
        </div>
        <div class="page-header-right">
          <button class="btn btn-primary" id="btn-add"><svg viewBox="0 0 24 24">${UI.icons.plus}</svg> 新建线索</button>
        </div>
      </div>
      <div id="table-container"></div>
    `;

    const statusCounts = {};
    allData.forEach(d => { statusCounts[d.status] = (statusCounts[d.status] || 0) + 1; });

    const table = Components.DataTable({
      columns: [
        { key: 'customerName', label: '客户名称', sortable: true, render: (v, item) => `<span class="cell-link" data-id="${item.id}">${Helpers.escapeHtml(v || '(未填写)')}</span>` },
        { key: 'contactInfo', label: '联系人及方式', width: '150px' },
        { key: 'region', label: '地区', width: '80px' },
        { key: 'industry', label: '行业', width: '100px' },
        { key: 'bizLine', label: '业务线', width: '90px', render: v => v ? Components.Badge(v, Leads.BIZ_LINE_MAP[v] || 'gray') : '-' },
        { key: 'productLine', label: '产品线', width: '110px' },
        { key: 'source', label: '线索来源', width: '90px', render: v => v ? Components.Badge(v, 'info') : '-' },
        { key: 'cleanTag', label: '清洗标签', width: '90px', render: v => v ? Components.Badge(v, Leads.CLEAN_TAG_MAP[v] || 'gray') : '-' },
        { key: 'status', label: '状态', width: '80px', render: v => Components.Badge(v, Leads.STATUS_MAP[v] || 'gray') },
      ],
      data,
      searchKeys: ['customerName', 'contactInfo', 'region'],
      searchPlaceholder: '搜索客户名称、联系人、地区...',
      filters: [
        { label: `全部 (${allData.length})`, value: 'all' },
        { label: `新线索 (${statusCounts['新线索'] || 0})`, value: '新线索' },
        { label: `跟进中 (${statusCounts['跟进中'] || 0})`, value: '跟进中' },
        { label: `已转化 (${statusCounts['已转化'] || 0})`, value: '已转化' },
        { label: `已关闭 (${statusCounts['已关闭'] || 0})`, value: '已关闭' },
      ],
      activeFilter: statusFilter || 'all',
      onFilterChange: (filter) => {
        const f = filter === 'all' ? null : filter;
        this.renderList(f);
      },
      actions: {
        onView: (id) => Router.navigate(`#/leads/view/${id}`),
        onEdit: (id) => this.showForm(id),
        onDelete: (id) => this.handleDelete(id),
      },
      onRowClick: (id) => Router.navigate(`#/leads/view/${id}`),
      sortKey: 'createdAt',
      sortOrder: 'desc',
    });

    el.querySelector('#table-container').appendChild(table);
    el.querySelector('#btn-add').addEventListener('click', () => this.showForm());
    el.addEventListener('click', (e) => {
      const link = e.target.closest('.cell-link');
      if (link) { e.stopPropagation(); Router.navigate(`#/leads/view/${link.dataset.id}`); }
    });

    UI.render(el);
  },

  renderDetail(id) {
    const item = Store.getById(this.COLLECTION, id);
    if (!item) { UI.toast('线索不存在', 'error'); Router.navigate('#/leads'); return; }

    UI.setPageTitle(item.customerName || item.contactInfo, [{ label: '线索管理', hash: '#/leads' }, { label: item.customerName || item.contactInfo }]);

    const canConvert = item.status !== '已转化' && item.status !== '已关闭' && item.poolStatus !== 'in_pool';

    const el = document.createElement('div');
    el.innerHTML = `
      <div class="detail-header">
        <div class="detail-header-left">
          <div class="detail-avatar" style="background:var(--primary-lighter);color:var(--primary)">${Helpers.getInitials(item.customerName || item.contactInfo || '?')}</div>
          <div>
            <h2 class="detail-name">${Helpers.escapeHtml(item.customerName || '(未填写客户名称)')}</h2>
            <div class="detail-meta">
              ${item.contactInfo ? `<span>${Helpers.escapeHtml(item.contactInfo)}</span>` : ''}
              ${item.region ? `<span>${Helpers.escapeHtml(item.region)}</span>` : ''}
              ${Components.Badge(item.status, this.STATUS_MAP[item.status] || 'gray')}
              ${item.bizLine ? Components.Badge(item.bizLine, this.BIZ_LINE_MAP[item.bizLine] || 'info') : ''}
            </div>
          </div>
        </div>
        <div class="detail-actions">
          ${canConvert ? `<button class="btn btn-success" id="btn-convert"><svg viewBox="0 0 24 24">${UI.icons.convert}</svg> 转化为客户</button>` : ''}
          ${item.convertedCustomerId ? `<button class="btn btn-secondary" id="btn-view-customer"><svg viewBox="0 0 24 24">${UI.icons.arrowRight}</svg> 查看客户</button>` : ''}
          ${canConvert ? `<button class="btn btn-secondary" id="btn-to-pool" style="color:var(--warning)"><svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2"><path d="M2 20h20"/><path d="M5 20V10l7-7 7 7v10"/><path d="M9 20v-6h6v6"/></svg> 放入公海</button>` : ''}
          <button class="btn btn-secondary" id="btn-edit"><svg viewBox="0 0 24 24">${UI.icons.edit}</svg> 清洗线索</button>
          <button class="btn btn-secondary" id="btn-delete" style="color:var(--danger)"><svg viewBox="0 0 24 24">${UI.icons.trash}</svg></button>
        </div>
      </div>
    `;

    // Tab 内容
    const tabContainer = document.createElement('div');
    el.appendChild(tabContainer);

    Components.Tabs([
      {
        label: '基本信息',
        render: () => `<div class="card">${Components.DetailCard([
          { key: 'customerName', label: '客户名称' },
          { key: 'customerType', label: '客户类型' },
          { key: 'contactInfo', label: '联系人及方式' },
          { key: 'cleanTag', label: '清洗标签', render: v => v ? Components.Badge(v, Leads.CLEAN_TAG_MAP[v] || 'gray') : '-' },
          { key: 'cleanMemo', label: '清洗备忘录' },
          { key: 'region', label: '地区' },
          { key: 'industry', label: '行业' },
          { key: 'bizLine', label: '业务线', render: v => v ? Components.Badge(v, Leads.BIZ_LINE_MAP[v] || 'gray') : '-' },
          { key: 'productLine', label: '产品线' },
          { key: 'source', label: '线索来源', render: v => v ? Components.Badge(v, 'info') : '-' },
          { key: 'status', label: '状态', render: v => Components.Badge(v, Leads.STATUS_MAP[v] || 'gray') },
          { key: 'assignee', label: '负责人' },
          { key: 'remark', label: '备注' },
          { key: 'createdAt', label: '创建时间', render: v => Helpers.formatDateTime(v) },
          { key: 'updatedAt', label: '更新时间', render: v => Helpers.formatDateTime(v) },
        ], item)}</div>`
      },
      {
        label: '跟进记录',
        render: () => {
          const followups = Store.query('followups', f => f.relatedType === 'lead' && f.relatedId === id);
          return FollowUps.renderTimeline(followups, 'lead', id);
        }
      }
    ], tabContainer);

    // 事件
    el.querySelector('#btn-edit')?.addEventListener('click', () => this.showForm(id));
    el.querySelector('#btn-delete')?.addEventListener('click', () => this.handleDelete(id));
    el.querySelector('#btn-convert')?.addEventListener('click', () => this.convertToCustomer(id));
    el.querySelector('#btn-to-pool')?.addEventListener('click', () => {
      UI.confirm({
        title: '放入公海',
        message: `确定将线索「${item.customerName || item.contactInfo}」放入公海吗？放入后其他人员可认领该线索。`,
        type: 'warning',
        confirmText: '确认放入',
        onConfirm: () => {
          LeadPool.moveToPool(id, '手动放入公海');
          UI.toast('线索已放入公海');
          Router.navigate('#/leads');
        }
      });
    });
    el.querySelector('#btn-view-customer')?.addEventListener('click', () => {
      Router.navigate(`#/customers/view/${item.convertedCustomerId}`);
    });

    UI.render(el);
  },

  showForm(id) {
    const isEdit = !!id;
    const data = isEdit ? Store.getById(this.COLLECTION, id) : {};

    UI.formModal({
      title: isEdit ? '清洗线索' : '新建线索',
      fields: this.FIELDS,
      data,
      onSubmit: (formData) => {
        if (isEdit) {
          Store.update(this.COLLECTION, id, formData);
          UI.toast('线索已更新');
        } else {
          Store.create(this.COLLECTION, formData);
          UI.toast('线索已创建');
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
      title: '删除线索',
      message: `确定要删除线索「${item.customerName || item.contactInfo}」吗？`,
      type: 'danger',
      confirmText: '确认删除',
      onConfirm: () => {
        Store.delete(this.COLLECTION, id);
        UI.toast('线索已删除');
        Router.navigate('#/leads');
      }
    });
  },

  convertToCustomer(leadId) {
    const lead = Store.getById(this.COLLECTION, leadId);
    if (!lead) return;

    const fields = [
      { key: 'name', label: '客户名称', type: 'text', required: true },
      { key: 'type', label: '客户类型', type: 'select', required: true, options: ['企业客户', '个人客户'] },
      { key: 'industry', label: '行业', type: 'select', options: ['互联网/IT', '金融', '制造业', '教育', '医疗', '房地产', '零售', '其他'] },
      { key: 'scale', label: '规模', type: 'select', options: ['1-50人', '50-200人', '200-1000人', '1000人以上'] },
      { key: 'phone', label: '电话', type: 'text' },
      { key: 'email', label: '邮箱', type: 'email' },
    ];

    const preData = {
      name: lead.customerName || '',
      customerSource: '自建客户',
    };

    // 显示转化预览 + 表单
    const contentEl = document.createElement('div');
    contentEl.innerHTML = `
      <div class="convert-preview">
        <h4>线索信息</h4>
        <div class="convert-field"><span class="label">客户名称</span><span class="value">${Helpers.escapeHtml(lead.customerName || '-')}</span></div>
        <div class="convert-field"><span class="label">联系人</span><span class="value">${Helpers.escapeHtml(lead.contactInfo || '-')}</span></div>
        <div class="convert-field"><span class="label">地区</span><span class="value">${Helpers.escapeHtml(lead.region || '-')}</span></div>
        <div class="convert-field"><span class="label">业务线</span><span class="value">${Helpers.escapeHtml(lead.bizLine || '-')}</span></div>
        <div class="convert-field"><span class="label">产品线</span><span class="value">${Helpers.escapeHtml(lead.productLine || '-')}</span></div>
      </div>
      <h4 style="margin-bottom:var(--space-3);font-size:var(--text-sm);font-weight:600;color:var(--text-secondary)">客户信息</h4>
    `;
    const form = UI.buildForm(fields, preData);
    contentEl.appendChild(form);

    const footer = `
      <button class="btn btn-secondary" data-close-modal>取消</button>
      <button class="btn btn-success" id="confirm-convert"><svg viewBox="0 0 24 24">${UI.icons.convert}</svg> 确认转化</button>
    `;

    const { overlay, close } = UI.modal({ title: '转化为客户', content: contentEl, footer, size: 'lg' });

    overlay.querySelector('#confirm-convert').addEventListener('click', () => {
      const formData = UI.getFormData(overlay, fields);
      if (!formData) return;

      // 创建客户
      formData.sourceLeadId = leadId;
      formData.status = '活跃';
      formData.tags = [];
      const customer = Store.create('customers', formData);

      // 更新线索状态
      Store.update(this.COLLECTION, leadId, {
        status: '已转化',
        convertedCustomerId: customer.id
      });

      // 如果线索有联系人信息，创建联系人
      if (lead.contactInfo) {
        Store.create('contacts', {
          customerId: customer.id,
          name: lead.contactInfo,
          isPrimary: true,
        });
      }

      // 创建跟进记录
      Store.create('followups', {
        relatedType: 'lead',
        relatedId: leadId,
        type: '其他',
        content: `线索已转化为客户「${customer.name}」`,
      });

      close();
      UI.toast('线索已成功转化为客户');
      EventBus.emit('lead:converted', { leadId, customerId: customer.id });
      Router.navigate(`#/customers/view/${customer.id}`);
    });
  },

  init() {
    Router.register('#/leads', () => this.renderList());
    Router.register('#/leads/view/:id', ({ id }) => this.renderDetail(id));
  }
};
