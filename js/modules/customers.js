/* ============================================
   CRM 系统 - 客户管理模块
   ============================================ */
const Customers = {
  COLLECTION: 'customers',

  FIELDS: [
    { key: 'businessLine', label: '业务线', type: 'select', required: true, options: ['上海营销中心', '北京营销中心', '深圳营销中心', '广州营销中心', '杭州营销中心'] },
    { key: 'productLine', label: '产品线', type: 'select', required: true, options: ['新零售', '零售SaaS', '智慧商超', '到店', '视频号', '定制开发', '企微小助手', '智慧服务'] },
    { key: 'customerSource', label: '线索来源', type: 'select', required: true, options: ['自拓线索'], default: '自拓线索' },
    { key: 'type', label: '客户类型', type: 'select', required: true, options: ['企业客户', '个人客户'], default: '企业客户' },
    { key: 'name', label: '客户名称', type: 'text', required: true, placeholder: '请输入公司全称' },
    { key: 'isBrandCustomer', label: '是否品牌客户', type: 'select', required: true, options: ['是', '否'], default: '否' },
    { key: 'brandName', label: '品牌名', type: 'text', placeholder: '请输入品牌名称' },
    { key: 'storeCount', label: '线下门店数', type: 'select', required: true, options: ['无门店', '1-10家', '11-30家', '31-50家', '51-100家', '101-500家', '500家以上'] },
    { key: 'primaryContactId', label: '联系人姓名', type: 'select', required: true, options: [] },
    { key: 'industry', label: '行业', type: 'select', required: true, options: ['互联网/IT', '金融', '制造业', '教育', '医疗', '房地产', '零售', '其他'] },
    { key: 'region', label: '地区', type: 'select', required: true, options: ['上海', '北京', '深圳', '广州', '成都', '杭州', '南京', '武汉', '重庆', '西安', '天津', '长沙', '其他'] },
    { key: 'address', label: '地址', type: 'text', fullWidth: true },
  ],

  STATUS_MAP: { '活跃': 'success', '沉默': 'warning', '流失': 'danger', '公海': 'gray' },

  renderList(statusFilter) {
    UI.setPageTitle('客户管理');
    const allData = Store.getAll(this.COLLECTION).filter(c => c.poolStatus !== 'in_pool' && c.poolStatus !== 'pending_review');
    const data = statusFilter ? allData.filter(d => d.status === statusFilter) : allData;

    const el = document.createElement('div');
    el.innerHTML = `
      <div class="page-header">
        <div class="page-header-left" style="position:relative">
          <h2 class="page-title">客户管理<span class="rules-badge" id="customer-rules-badge" title="查看客户规则">ⓘ</span></h2>
          <p class="page-subtitle">管理客户信息和关系：客户管理容量45个，3天无拜访/90天未成单掉保至客户公海</p>
          <div class="rules-popup" id="customer-rules-popup">
            <div class="rules-popup-arrow"></div>
            <div class="rules-popup-title">客户规则</div>
            <div class="rules-popup-section">
              <div class="rules-popup-subtitle">容量规则</div>
              <div class="rules-popup-text">45个，超出容量无法申领、分配、录入</div>
            </div>
            <div class="rules-popup-section">
              <div class="rules-popup-subtitle">掉保规则</div>
              <div class="rules-popup-text">SDR派单客户：90天未成单或3天未拜访掉保回SDR私海</div>
              <div class="rules-popup-text">区域自拓客户：90天未成单或30天未创建商机掉保回客户公海</div>
            </div>
          </div>
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
          const brandTag = item.isBrandCustomer === '是' && item.brandName ? ` <span class="badge badge-warning" style="font-size:10px">品牌</span>` : '';
          return `<span class="cell-link" data-id="${item.id}">${Helpers.escapeHtml(v || '')}</span>${brandTag}`;
        }},
        { key: 'type', label: '类型', width: '80px' },
        { key: 'businessLine', label: '业务线', width: '100px' },
        { key: 'productLine', label: '产品线', width: '90px' },
        { key: 'industry', label: '行业', width: '90px' },
        { key: 'storeCount', label: '线下门店数', width: '90px' },
        { key: 'isBrandCustomer', label: '品牌客户', width: '70px', render: v => v === '是' ? `<span style="color:var(--warning)">✓ 是</span>` : '否' },
        { key: 'status', label: '状态', width: '70px', render: v => Components.Badge(v, Customers.STATUS_MAP[v] || 'gray') },
        { key: 'customerSource', label: '线索来源', width: '80px', render: v => v ? Components.Badge(v, 'info') : '-' },
        { key: '_opps', label: '商机数', width: '65px', sortable: true, render: (_, item) => {
          const count = Store.count('opportunities', o => o.customerId === item.id);
          return count > 0 ? `<span class="text-primary" style="font-weight:600">${count}</span>` : '0';
        }},
        { key: '_orders', label: '订单数', width: '65px', render: (_, item) => {
          const count = Store.count('orders', o => o.customerId === item.id);
          return count > 0 ? `<span style="font-weight:600">${count}</span>` : '0';
        }},
        { key: 'createdAt', label: '创建时间', width: '100px', sortable: true, render: v => Helpers.formatDate(v) },
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

    this._bindRulesBadge(el);

    UI.render(el);
  },

  _bindRulesBadge(container) {
    const badge = container.querySelector('#customer-rules-badge');
    const popup = container.querySelector('#customer-rules-popup');
    if (!badge || !popup) return;

    badge.addEventListener('click', (e) => {
      e.stopPropagation();
      const isVisible = popup.classList.contains('visible');
      document.querySelectorAll('.rules-popup.visible').forEach(p => p.classList.remove('visible'));
      if (!isVisible) {
        popup.classList.add('visible');
      }
    });

    document.addEventListener('click', (e) => {
      if (!popup.contains(e.target) && e.target !== badge) {
        popup.classList.remove('visible');
      }
    });
  },

  renderDetail(id) {
    const item = Store.getById(this.COLLECTION, id);
    if (!item) { UI.toast('客户不存在', 'error'); Router.navigate('#/customers'); return; }

    UI.setPageTitle(item.name, [{ label: '客户管理', hash: '#/customers' }, { label: item.name }]);

    const el = document.createElement('div');
    const tagsHtml = (item.tags || []).map(t => `<span class="tag">${Helpers.escapeHtml(t)}</span>`).join(' ');
    const isInPool = item.poolStatus === 'in_pool';
    const primaryContact = item.primaryContactId ? Store.getById('contacts', item.primaryContactId) : null;

    el.innerHTML = `
      <div class="detail-header">
        <div class="detail-header-left">
          <div class="detail-avatar" style="background:${item.status === '活跃' ? 'var(--success-light)' : 'var(--gray-100)'};color:${item.status === '活跃' ? 'var(--success)' : 'var(--gray-500)'}">${Helpers.getInitials(item.name)}</div>
          <div>
            <h2 class="detail-name">${Helpers.escapeHtml(item.name)}</h2>
            <div class="detail-meta">
              ${Components.Badge(item.status, this.STATUS_MAP[item.status] || 'gray')}
              <span>${Helpers.escapeHtml(item.businessLine || '')}</span>
              <span>${Helpers.escapeHtml(item.productLine || '')}</span>
              <span>${Helpers.escapeHtml(item.industry || '')}</span>
              ${item.isBrandCustomer === '是' ? `<span class="badge badge-warning">品牌客户</span>` : ''}
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
        render: () => {
          const container = document.createElement('div');
          // 模块一：客户基本信息
          const infoCard = document.createElement('div');
          infoCard.innerHTML = `<h3 class="section-title" style="font-size:var(--text-sm);font-weight:600;color:var(--text-secondary);margin-bottom:var(--space-3);padding:0 var(--space-1)">基本信息</h3>
            <div class="card">${Components.DetailCard([
              { key: 'name', label: '客户名称' },
              { key: 'type', label: '客户类型' },
              { key: 'businessLine', label: '业务线' },
              { key: 'productLine', label: '产品线' },
              { key: 'industry', label: '行业' },
              { key: 'region', label: '地区' },
              { key: 'storeCount', label: '线下门店数' },
              { key: 'isBrandCustomer', label: '是否品牌客户', render: v => v === '是' ? '<span style="color:var(--warning);font-weight:600">✓ 是</span>' : '否' },
              { key: 'brandName', label: '品牌名', render: v => v ? Helpers.escapeHtml(v) : '-' },
              { key: 'customerSource', label: '线索来源' },
              { key: 'status', label: '状态', render: v => Components.Badge(v, Customers.STATUS_MAP[v] || 'gray') },
              { key: 'address', label: '地址' },
              { key: 'createdAt', label: '创建时间', render: v => Helpers.formatDateTime(v) },
            ], item)}</div>`;
          container.appendChild(infoCard);
          // 模块二：联系人信息
          const contactCard = document.createElement('div');
          contactCard.style.marginTop = 'var(--space-4)';
          const contacts = Store.query('contacts', c => c.customerId === id);
          const contactTitle = document.createElement('h3');
          contactTitle.className = 'section-title';
          contactTitle.style.cssText = 'font-size:var(--text-sm);font-weight:600;color:var(--text-secondary);margin-bottom:var(--space-3);padding:0 var(--space-1)';
          contactTitle.textContent = '联系人信息';
          contactCard.appendChild(contactTitle);
          contactCard.appendChild(Contacts.renderSubList(contacts, id));
          container.appendChild(contactCard);
          return container;
        }
      },
      {
        label: '商机信息',
        render: () => {
          const opps = Store.query('opportunities', o => o.customerId === id);
          return Opportunities.renderSubList(opps, id);
        }
      },
      {
        label: '商户管理',
        render: () => {
          const container = document.createElement('div');
          // 获取该客户下的商户
          const merchants = Store.query('merchants', m => m.customerId === id);
          // 商户列表卡片
          const card = document.createElement('div');
          card.className = 'card';
          card.innerHTML = `
            <div class="card-header">
              <h3 class="card-title">商户列表</h3>
              <button class="btn btn-primary btn-sm" id="btn-bind-merchant"><svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> 绑定账号</button>
            </div>
            <div class="table-wrapper">
              <table class="data-table">
                <thead><tr><th>商户名称</th><th>平台</th><th>绑定账号</th><th>状态</th><th>绑定时间</th></tr></thead>
                <tbody>${merchants.length === 0 ? '<tr><td colspan="5" style="text-align:center;padding:var(--space-6);color:var(--text-muted)">暂无绑定商户</td></tr>' : merchants.map(m => `<tr>
                  <td><strong>${Helpers.escapeHtml(m.merchantName)}</strong></td>
                  <td>${Helpers.escapeHtml(m.platform || '-')}</td>
                  <td>${Helpers.escapeHtml(m.account || '-')}</td>
                  <td>${Components.Badge(m.status || '已绑定', m.status === '已绑定' ? 'success' : 'gray')}</td>
                  <td>${Helpers.formatDate(m.createdAt)}</td>
                </tr>`).join('')}</tbody>
              </table>
            </div>
          `;
          container.appendChild(card);

          // 绑定账号弹窗
          container.addEventListener('click', (e) => {
            const btn = e.target.closest('#btn-bind-merchant');
            if (!btn) return;
            const platforms = ['微信小程序', '支付宝', '抖音', '快手', '美团', '饿了么'];
            const fields = [
              { key: 'merchantName', label: '商户名称', type: 'text', required: true, placeholder: '请输入商户名称' },
              { key: 'platform', label: '平台', type: 'select', required: true, options: platforms },
              { key: 'account', label: '绑定账号', type: 'text', required: true, placeholder: '请输入平台账号' },
              { key: 'remark', label: '备注', type: 'text', fullWidth: true },
            ];
            UI.formModal({
              title: '绑定商户账号',
              fields,
              size: 'default',
              onSubmit: (formData) => {
                formData.customerId = id;
                formData.status = '已绑定';
                Store.create('merchants', formData);
                UI.toast('商户账号绑定成功');
                Customers.renderDetail(id);
              }
            });
          });
          return container;
        }
      },
      {
        label: '订单管理',
        render: () => {
          const orders = Store.query('orders', o => o.customerId === id);
          return Orders.renderSubList(orders, id);
        }
      },
      {
        label: '售后管理',
        render: () => {
          const container = document.createElement('div');
          const services = Store.query('afterSales', s => s.customerId === id);
          // 新建实施服务申请按钮
          const headerRow = document.createElement('div');
          headerRow.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-3)';
          headerRow.innerHTML = `<h3 style="font-size:var(--text-sm);font-weight:600;color:var(--text-secondary);margin:0">实施服务申请</h3>
            <button class="btn btn-primary btn-sm" id="btn-new-service"><svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> 新建实施服务申请</button>`;
          container.appendChild(headerRow);
          // 服务列表
          const card = document.createElement('div');
          card.className = 'card';
          if (services.length === 0) {
            card.innerHTML = `<div class="table-empty" style="padding:var(--space-8)">
              <div class="empty-icon">🔧</div>
              <div class="empty-text">暂无实施服务申请</div>
            </div>`;
          } else {
            card.innerHTML = `<div class="table-wrapper"><table class="data-table">
              <thead><tr><th>申请编号</th><th>服务类型</th><th>关联订单</th><th>状态</th><th>创建时间</th></tr></thead>
              <tbody>${services.map(s => `<tr>
                <td><span class="font-mono">${Helpers.escapeHtml(s.serviceNo || '-')}</span></td>
                <td>${Helpers.escapeHtml(s.serviceType || '-')}</td>
                <td>${s.orderId ? Helpers.escapeHtml(s.orderId) : '-'}</td>
                <td>${Components.Badge(s.status || '待处理', 'warning')}</td>
                <td>${Helpers.formatDate(s.createdAt)}</td>
              </tr>`).join('')}</tbody>
            </table></div>`;
          }
          container.appendChild(card);

          // 新建实施服务申请弹窗
          container.addEventListener('click', (e) => {
            const btn = e.target.closest('#btn-new-service');
            if (!btn) return;
            const customerOrders = Store.query('orders', o => o.customerId === id);
            const fields = [
              { key: 'serviceType', label: '服务类型', type: 'select', required: true, options: ['实施部署', '系统对接', '数据迁移', '功能配置', '技术培训'] },
              { key: 'orderId', label: '关联订单', type: 'select', options: customerOrders.map(o => ({ value: o.id, label: o.orderNo })) },
              { key: 'description', label: '需求描述', type: 'textarea', required: true, fullWidth: true, placeholder: '请描述实施服务需求...' },
              { key: 'contactPerson', label: '联系人', type: 'text', required: true, placeholder: '联系人姓名' },
              { key: 'contactPhone', label: '联系电话', type: 'text', required: true, placeholder: '手机号码' },
            ];
            UI.formModal({
              title: '新建实施服务申请',
              fields,
              size: 'lg',
              onSubmit: (formData) => {
                formData.customerId = id;
                formData.serviceNo = 'SVR-' + Date.now().toString(36).toUpperCase();
                formData.status = '待处理';
                Store.create('afterSales', formData);
                UI.toast('实施服务申请已提交');
                Customers.renderDetail(id);
              }
            });
          });
          return container;
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

    // 动态填充联系人选项
    const fields = this.FIELDS.map(f => ({ ...f }));
    const contactField = fields.find(f => f.key === 'primaryContactId');
    if (contactField) {
      const contacts = Store.getAll('contacts').map(c => ({ value: c.id, label: c.name }));
      contactField.options = [{ value: '', label: '请选择联系人' }, ...contacts];
    }

    const { overlay, close } = UI.formModal({
      title: isEdit ? '编辑客户' : '新建客户',
      fields,
      data,
      size: 'lg',
      onSubmit: () => {} // 占位，实际逻辑在下方自定义处理器中
    });

    // 条件显示品牌名字段
    const brandGroup = overlay.querySelector('[name="brandName"]')?.closest('.form-group');
    const isBrandSelect = overlay.querySelector('[name="isBrandCustomer"]');

    if (isBrandSelect && brandGroup) {
      function toggleBrandField() {
        const show = isBrandSelect.value === '是';
        brandGroup.style.display = show ? '' : 'none';
      }
      isBrandSelect.addEventListener('change', toggleBrandField);
      toggleBrandField();
    }

    // 替换提交按钮处理器，支持条件验证
    const origSubmitBtn = overlay.querySelector('#form-submit');
    const newSubmitBtn = origSubmitBtn.cloneNode(true);
    origSubmitBtn.parentNode.replaceChild(newSubmitBtn, origSubmitBtn);

    newSubmitBtn.addEventListener('click', () => {
      // 动态设置品牌名是否必填
      const brandFieldDef = fields.find(f => f.key === 'brandName');
      if (brandFieldDef && isBrandSelect) {
        brandFieldDef.required = isBrandSelect.value === '是';
      }

      const formData = UI.getFormData(overlay, fields);
      if (!formData) return;

      // 清理条件字段
      if (formData.isBrandCustomer !== '是') {
        delete formData.brandName;
      }

      close();

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
