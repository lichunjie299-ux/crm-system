/* ============================================
   CRM 系统 - 客户管理模块
   ============================================ */
const Customers = {
  COLLECTION: 'customers',
  _documentClickHandler: null,
  _currentSea: 'os',

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
    const sea = this._currentSea || 'os';

    UI.setPageTitle('客户管理');

    let allData;
    if (sea === 'os') {
      allData = Store.getAll(this.COLLECTION).filter(c =>
        (!c.privateSea || c.privateSea === 'os') &&
        c.poolStatus !== 'in_pool' && c.poolStatus !== 'pending_review'
      );
    } else {
      allData = Store.getAll(this.COLLECTION).filter(c => c.privateSea === sea);
    }
    let data = statusFilter ? allData.filter(d => d.status === statusFilter) : allData;

    const el = document.createElement('div');
    el.innerHTML = `
      <div class="h-scroll-tabs">
        <div class="h-scroll-tab ${sea === 'is' ? 'active' : ''}" data-sea="is">IS-私海</div>
        <div class="h-scroll-tab ${sea === 'os' ? 'active' : ''}" data-sea="os">OS-私海</div>
        <div class="h-scroll-tab ${sea === 'ls' ? 'active' : ''}" data-sea="ls">零售私海</div>
      </div>

      <div class="filter-bar">
        <select class="filter-select" id="filter-status">
          <option value="all" ${!statusFilter ? 'selected' : ''}>全部状态</option>
          <option value="活跃" ${statusFilter === '活跃' ? 'selected' : ''}>活跃</option>
          <option value="沉默" ${statusFilter === '沉默' ? 'selected' : ''}>沉默</option>
          <option value="流失" ${statusFilter === '流失' ? 'selected' : ''}>流失</option>
        </select>
        <input type="text" class="filter-input" id="filter-search" placeholder="搜索客户名称、行业..." value="">
        <button class="btn btn-primary btn-sm" id="btn-query">查询</button>
        <button class="btn btn-secondary btn-sm" id="btn-reset">重置</button>
        <button class="btn btn-primary btn-sm" id="btn-add" style="margin-left:auto"><svg viewBox="0 0 24 24" style="width:14px;height:14px;vertical-align:-2px">${UI.icons.plus}</svg> 新建客户</button>
      </div>

      ${sea === 'os' ? `
      <div class="stats-card" id="os-rules-trigger" style="cursor:pointer;position:relative;-webkit-user-select:none;user-select:none">
        <svg class="stats-card-icon" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        <span>客户规则 <strong style="color:#1890FF">点击此处查看</strong></span>
        <div id="os-rules-popup" style="display:none;position:absolute;top:100%;left:0;right:0;z-index:100;background:#fff;border:1px solid #d9d9d9;border-radius:4px;box-shadow:0 4px 12px rgba(0,0,0,0.15);padding:12px 16px;margin-top:4px;font-size:13px;color:#333;line-height:1.8">
          <div>容量规则：私海（未成单）客户数量限制：<strong>${allData.length}</strong>/45，超出无法申领、录入、分配</div>
          <div>派单客户掉保规则：90天未成单 或 3天未拜访掉保回IS私海</div>
          <div>自拓客户掉保规则：90天未成单 或 30天未创建商机掉保至客户公海</div>
        </div>
      </div>
      ` : `
      <div class="stats-card">
        <svg class="stats-card-icon" viewBox="0 0 24 24" style="width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        <span>私海（未成单）客户数量限制：<strong>${allData.length}</strong>/200</span>
      </div>
      `}

      <div id="table-container"></div>
    `;

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
      actions: {
        onView: (id) => Router.navigate(`#/customers/view/${id}`),
        onEdit: (id) => this.showForm(id),
        onDelete: (id) => this.handleDelete(id),
        extra: (item) => this._currentSea === 'is'
          ? `<button class="action-btn outlined" data-action="dispatch" data-id="${item.id}">派单</button>`
          : '',
        onAction: (action, id) => {
          if (action === 'dispatch') this._showDispatchForm(id);
        },
      },
      onRowClick: (id) => Router.navigate(`#/customers/view/${id}`),
      sortKey: 'createdAt',
    });

    el.querySelector('#table-container').appendChild(table);
    el.querySelector('#btn-add').addEventListener('click', () => this.showForm());

    // 标签页切换
    el.querySelectorAll('.h-scroll-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const newSea = tab.dataset.sea;
        if (newSea !== this._currentSea) {
          this._currentSea = newSea;
          this.renderList();
        }
      });
    });

    // 查询按钮
    el.querySelector('#btn-query').addEventListener('click', () => {
      const status = el.querySelector('#filter-status').value;
      const searchText = el.querySelector('#filter-search').value.trim().toLowerCase();
      let filtered = allData;
      if (status !== 'all') {
        filtered = filtered.filter(d => d.status === status);
      }
      if (searchText) {
        filtered = filtered.filter(d =>
          (d.name && d.name.toLowerCase().includes(searchText)) ||
          (d.industry && d.industry.toLowerCase().includes(searchText))
        );
      }
      this._renderTableWithData(el, filtered);
    });

    // 重置按钮
    el.querySelector('#btn-reset').addEventListener('click', () => {
      el.querySelector('#filter-status').value = 'all';
      el.querySelector('#filter-search').value = '';
      this.renderList();
    });

    el.addEventListener('click', (e) => {
      const link = e.target.closest('.cell-link');
      if (link) { e.stopPropagation(); Router.navigate(`#/customers/view/${link.dataset.id}`); }
    });

    // OS私海规则弹窗切换
    if (sea === 'os') {
      const badge = el.querySelector('#os-rules-trigger');
      const popup = el.querySelector('#os-rules-popup');
      if (badge && popup) {
        badge.addEventListener('click', (e) => {
          e.stopPropagation();
          const isVisible = popup.style.display === 'block';
          // 关闭其他已打开的 popup
          document.querySelectorAll('#os-rules-popup').forEach(p => p.style.display = 'none');
          popup.style.display = isVisible ? 'none' : 'block';
        });
        // 点击外部关闭
        const closeHandler = (e) => {
          if (!badge.contains(e.target) && popup.style.display === 'block') {
            popup.style.display = 'none';
          }
        };
        document.addEventListener('click', closeHandler);
        // 在 el 被销毁时移除监听（弱引用，但尽量清理）
        this._osRulesDocHandler = closeHandler;
      }
    } else {
      // 清理之前绑定的文档级监听
      if (this._osRulesDocHandler) {
        document.removeEventListener('click', this._osRulesDocHandler);
        this._osRulesDocHandler = null;
      }
    }

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

    // 移除旧的 document 监听器防止重复绑定
    if (this._documentClickHandler) {
      document.removeEventListener('click', this._documentClickHandler);
    }

    this._documentClickHandler = (e) => {
      if (!popup.contains(e.target) && e.target !== badge) {
        popup.classList.remove('visible');
      }
    };
    document.addEventListener('click', this._documentClickHandler);
  },

  // 用过滤后的数据重新渲染表格区域（不重建整个页面）
  _renderTableWithData(container, data) {
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
      actions: {
        onView: (id) => Router.navigate(`#/customers/view/${id}`),
        onEdit: (id) => this.showForm(id),
        onDelete: (id) => this.handleDelete(id),
        extra: (item) => this._currentSea === 'is'
          ? `<button class="action-btn outlined" data-action="dispatch" data-id="${item.id}">派单</button>`
          : '',
        onAction: (action, id) => {
          if (action === 'dispatch') this._showDispatchForm(id);
        },
      },
      onRowClick: (id) => Router.navigate(`#/customers/view/${id}`),
      sortKey: 'createdAt',
    });

    const containerEl = container.querySelector('#table-container');
    if (containerEl) {
      containerEl.innerHTML = '';
      containerEl.appendChild(table);
    }
  },

  renderDetail(id) {
    const item = Store.getById(this.COLLECTION, id);
    if (!item) { UI.toast('客户不存在', 'error'); Router.navigate('#/customers'); return; }

    const sea = item.privateSea || 'os';
    UI.setPageTitle(item.name, [
      { label: '客户管理', hash: '#/customers/os' },
      { label: item.name }
    ]);

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

    const tabsApi = Components.Tabs([
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
        label: '跟进记录',
        render: () => {
          const followups = Store.query('followups', f => f.relatedType === 'customer' && f.relatedId === id);
          return FollowUps.renderTimeline(followups, 'customer', id);
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
        label: '购物车',
        render: () => {
          const container = document.createElement('div');
          const cartItems = Store.query('cartItems', c => c.customerId === id);

          function renderCart() {
            const totalCount = cartItems.length;
            const selectedCount = cartItems.filter(ci => ci._checked).length;
            const totalAmt = cartItems.reduce((s, c) => s + (c.payable || c.price || 0) * (c.quantity || 1), 0);
            const hasDiscount = cartItems.some(c => parseFloat(c.discountRate || '0') < 100);
            const discountText = hasDiscount ? '' : '--';

            // 生成表格行
            function renderRow(ci, idx) {
              const activityHtml = ci.activityTag ? `<span class="cart-activity-tag">${Helpers.escapeHtml(ci.activityTag)}</span>` : '';
              const nameHtml = `<span class="cart-product-name">${Helpers.escapeHtml(ci.productName)}</span>`;
              const productTypeHtml = ci.productType ? `<span>商品类型: ${Helpers.escapeHtml(ci.productType)}</span>` : '';
              const periodHtml = ci.period ? `<span>期限: ${Helpers.escapeHtml(ci.period)}</span>` : '';
              const salesMethodHtml = ci.salesMethod ? `<span>售卖方式: ${Helpers.escapeHtml(ci.salesMethod)}</span>` : '';
              const versionHtml = ci.version ? `版本: ${Helpers.escapeHtml(ci.version)}` : '-';
              const listPriceHtml = ci.originalPrice ? `刊例价: ${Helpers.formatMoney(ci.originalPrice)}` : '';
              const discountHtml = ci.discountRate ? `<span class="cart-discount-rate">折扣率: ${Helpers.escapeHtml(ci.discountRate)}</span>` : '';
              const payable = (ci.payable || ci.price || 0) * (ci.quantity || 1);
              const currency = '人民币';

              return `
                <tr data-cart-id="${ci.id}">
                  <td class="cart-col-checkbox">
                    <label class="cart-checkbox">
                      <input type="checkbox" class="cart-item-checkbox" data-idx="${idx}" ${ci._checked ? 'checked' : ''}>
                      <span class="cart-checkbox-visual"></span>
                    </label>
                  </td>
                  <td class="cart-col-info">
                    <div class="cart-product-info">
                      ${activityHtml}
                      ${nameHtml}
                      <div class="cart-product-aux">
                        ${[productTypeHtml, periodHtml, salesMethodHtml].filter(Boolean).join('<br>')}
                      </div>
                    </div>
                  </td>
                  <td class="cart-col-spec">${versionHtml}</td>
                  <td class="cart-col-discount">
                    <div class="cart-list-price">${listPriceHtml}</div>
                    ${discountHtml}
                  </td>
                  <td class="cart-col-qty">${ci.quantity || 1}</td>
                  <td class="cart-col-payable">
                    <div class="cart-payable-amount">${Helpers.formatMoney(payable)}</div>
                    <div class="cart-currency">(${currency})</div>
                  </td>
                  <td class="cart-col-term">${ci.paymentTerm || '-'}</td>
                  <td class="cart-col-action">
                    <button class="cart-delete-btn cart-remove" data-cart-id="${ci.id}">删除</button>
                  </td>
                </tr>`;
            }

            const tableRows = cartItems.map((ci, idx) => renderRow(ci, idx)).join('');

            container.innerHTML = `
              <div class="cart-toolbar">
                <button class="btn btn-primary" id="btn-add-cart-product"><svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> 添加商品</button>
                <button class="btn btn-secondary" id="btn-quick-order"><svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> 快捷下单</button>
              </div>
              ${cartItems.length === 0 ? `
                <div class="cart-table-wrapper">
                  <div class="cart-empty">
                    <svg viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                    <p>购物车为空，点击「添加商品」选择产品</p>
                  </div>
                </div>
              ` : `
                <div class="cart-table-wrapper">
                  <table class="cart-table">
                    <thead>
                      <tr>
                        <th class="cart-col-checkbox"><label class="cart-checkbox"><input type="checkbox" id="cart-select-all" ${selectedCount === totalCount && totalCount > 0 ? 'checked' : ''}><span class="cart-checkbox-visual"></span></label></th>
                        <th class="cart-col-info">商品信息</th>
                        <th class="cart-col-spec">规格</th>
                        <th class="cart-col-discount">优惠信息</th>
                        <th class="cart-col-qty">数量</th>
                        <th class="cart-col-payable">应付</th>
                        <th class="cart-col-term">账期</th>
                        <th class="cart-col-action">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${tableRows}
                    </tbody>
                  </table>
                </div>
              `}
              <div class="cart-settlement">
                <div class="cart-settlement-left">
                  全部 <strong>${totalCount}</strong> 个商品，已选 <strong>${selectedCount}</strong>
                </div>
                <div class="cart-settlement-right">
                  <div class="cart-settlement-summary">
                    <span class="cart-summary-item"><span class="label">总金额</span><span class="value ${selectedCount === 0 ? 'dash' : ''}">${selectedCount > 0 ? Helpers.formatMoney(totalAmt) : '--'}</span></span>
                    <span class="cart-summary-item"><span class="label">折扣率</span><span class="value ${selectedCount === 0 ? 'dash' : ''}">${selectedCount > 0 ? discountText : '--'}</span></span>
                  </div>
                  <div class="cart-settlement-actions">
                    <button class="cart-btn-submit ${selectedCount > 0 ? 'active' : ''}" id="cart-btn-order">提单</button>
                    <button class="cart-btn-submit ${selectedCount > 0 ? 'active' : ''}" id="cart-btn-quote">申请报价单</button>
                  </div>
                </div>
              </div>
            `;

            // 绑定事件
            bindEvents();
          }

          function bindEvents() {
            // 添加商品
            container.querySelector('#btn-add-cart-product')?.addEventListener('click', () => {
              Customers._restoreTabIdx = 4;
              Customers._showProductSelector(id, () => Customers.renderDetail(id));
            });

            // 快捷下单
            container.querySelector('#btn-quick-order')?.addEventListener('click', () => {
              UI.toast('快捷下单功能开发中', 'info');
            });

            // 全选
            const selectAll = container.querySelector('#cart-select-all');
            if (selectAll) {
              selectAll.addEventListener('change', (e) => {
                cartItems.forEach(ci => ci._checked = e.target.checked);
                renderCart();
              });
            }

            // 单项复选框（委托）
            container.addEventListener('change', (e) => {
              const cb = e.target.closest('.cart-item-checkbox');
              if (cb) {
                const idx = parseInt(cb.dataset.idx);
                cartItems[idx]._checked = cb.checked;
                renderCart();
              }
            });

            // 删除商品
            container.addEventListener('click', (e) => {
              const btn = e.target.closest('.cart-remove');
              if (btn) {
                const cartId = btn.dataset.cartId;
                Store.delete('cartItems', cartId);
                UI.toast('已移除');
                Customers._restoreTabIdx = 4;
                Customers.renderDetail(id);
              }
            });

            // 商品名称点击
            container.addEventListener('click', (e) => {
              const nameEl = e.target.closest('.cart-product-name');
              if (nameEl) {
                // 跳转商品详情（当前无商品详情页，显示提示）
                UI.toast('商品详情功能开发中', 'info');
              }
            });

            // 提单
            container.querySelector('#cart-btn-order')?.addEventListener('click', () => {
              const selected = cartItems.filter(ci => ci._checked);
              if (selected.length === 0) {
                UI.toast('请至少选择一个商品', 'warning');
                return;
              }
              Customers._orderItems = selected;
              Router.navigate('#/customers/order/' + id);
            });

            // 申请报价单
            container.querySelector('#cart-btn-quote')?.addEventListener('click', () => {
              const selected = cartItems.filter(ci => ci._checked);
              if (selected.length === 0) {
                UI.toast('请至少选择一个商品', 'warning');
                return;
              }
              UI.toast('报价单已生成');
            });
          }

          renderCart();
          return container;
        }
      },
      {
        label: '合同管理',
        render: () => {
          const container = document.createElement('div');
          const contracts = Store.query('contracts', c => c.customerId === id);

          if (contracts.length === 0) {
            container.innerHTML = `
              <div class="table-empty" style="padding:var(--space-8)">
                <div class="empty-icon">📄</div>
                <div class="empty-text">暂无合同</div>
              </div>`;
          } else {
            container.innerHTML = `
              <div class="card">
                <div class="table-wrapper">
                  <table class="data-table">
                    <thead><tr><th>合同编号</th><th>合同类型</th><th>金额</th><th>签约人</th><th>签约时间</th><th>状态</th><th>盖章状态</th></tr></thead>
                    <tbody>${contracts.map(c => `<tr style="cursor:pointer" data-contract-id="${c.id}">
                      <td><span class="font-mono">${Helpers.escapeHtml(c.contractNo || '-')}</span></td>
                      <td>${Helpers.escapeHtml(c.contractType || '-')}</td>
                      <td><strong style="color:var(--primary)">${Helpers.formatMoney(c.amount)}</strong></td>
                      <td>${Helpers.escapeHtml(c.signer || '-')}</td>
                      <td>${Helpers.formatDate(c.signDate)}</td>
                      <td>${Components.Badge(c.status, Contracts.STATUS_MAP[c.status] || 'gray')}</td>
                      <td>${Components.Badge(c.isSealed === '是' ? '已盖章' : '未盖章', Contracts.SEAL_MAP[c.isSealed === '是' ? '已盖章' : '未盖章'] || 'gray')}</td>
                    </tr>`).join('')}</tbody>
                  </table>
                </div>
              </div>`;
            container.addEventListener('click', (e) => {
              const row = e.target.closest('[data-contract-id]');
              if (row) Router.navigate(`#/contracts/view/${row.dataset.contractId}`);
            });
          }
          return container;
        }
      },
      {
        label: '订单管理',
        render: () => {
          const orders = Store.query('orders', o => o.customerId === id);
          const container = document.createElement('div');
          const header = document.createElement('div');
          header.style.cssText = 'display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-3)';
          header.innerHTML = '<button class="btn btn-primary btn-sm" id="btn-add-order-from-orders"><svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> 新建订单</button>';
          container.appendChild(header);
          container.appendChild(Orders.renderSubList(orders, id));
          // 点击 + 切换到购物车 tab
          header.querySelector('#btn-add-order-from-orders').addEventListener('click', () => {
            tabsApi.switchTo(4);
          });
          return container;
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
        label: '权益管理',
        render: () => {
          const container = document.createElement('div');
          const rights = Store.query('rights', r => r.customerId === id);

          container.innerHTML = `
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">客户权益</h3>
                <button class="btn btn-primary btn-sm" id="btn-add-right"><svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> 新建权益</button>
              </div>
              ${rights.length === 0 ? '<div class="table-empty" style="padding:var(--space-8)"><div class="empty-icon">🎁</div><div class="empty-text">暂无权益记录</div></div>' : `
              <div class="table-wrapper">
                <table class="data-table">
                  <thead><tr><th>权益名称</th><th>类型</th><th>有效期</th><th>状态</th><th>说明</th><th style="width:50px"></th></tr></thead>
                  <tbody>${rights.map(r => `
                    <tr>
                      <td><strong>${Helpers.escapeHtml(r.name)}</strong></td>
                      <td>${Helpers.escapeHtml(r.type || '-')}</td>
                      <td>${r.validFrom ? Helpers.formatDate(r.validFrom) : '-'} ~ ${r.validTo ? Helpers.formatDate(r.validTo) : '-'}</td>
                      <td>${Components.Badge(r.status || '有效', r.status === '有效' ? 'success' : r.status === '即将过期' ? 'warning' : 'gray')}</td>
                      <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${Helpers.escapeHtml(r.description || '-')}</td>
                      <td><button class="action-btn danger icon-only right-remove" data-right-id="${r.id}" title="删除"><svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></td>
                    </tr>`).join('')}</tbody>
                </table>
              </div>`}
            </div>`;

          // 新建权益
          container.querySelector('#btn-add-right')?.addEventListener('click', () => {
            const fields = [
              { key: 'name', label: '权益名称', type: 'text', required: true, placeholder: '如：VIP专属客服、优先发货' },
              { key: 'type', label: '权益类型', type: 'select', required: true, options: ['服务权益', '产品权益', '售后权益', '会员权益', '其他'] },
              { key: 'status', label: '状态', type: 'select', required: true, options: [{ value: '有效', label: '有效' }, { value: '即将过期', label: '即将过期' }, { value: '已过期', label: '已过期' }], default: '有效' },
              { key: 'validFrom', label: '有效期开始', type: 'date' },
              { key: 'validTo', label: '有效期结束', type: 'date' },
              { key: 'description', label: '权益说明', type: 'textarea', fullWidth: true, placeholder: '详细描述权益内容...' },
            ];
            UI.formModal({
              title: '新建权益',
              fields,
              onSubmit: (formData) => {
                formData.customerId = id;
                Store.create('rights', formData);
                UI.toast('权益已创建');
                Customers.renderDetail(id);
              }
            });
          });

          // 删除权益
          container.addEventListener('click', (e) => {
            const btn = e.target.closest('.right-remove');
            if (btn) {
              const rightId = btn.dataset.rightId;
              UI.confirm({
                title: '删除权益',
                message: '确定要删除此权益记录吗？',
                type: 'danger',
                confirmText: '确认删除',
                onConfirm: () => {
                  Store.delete('rights', rightId);
                  UI.toast('权益已删除');
                  Customers.renderDetail(id);
                }
              });
            }
          });

          return container;
        }
      },
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

    // 恢复 tab 选中状态（用于操作后停留在当前 tab）
    if (this._restoreTabIdx > 0) {
      setTimeout(() => { tabsApi.switchTo(this._restoreTabIdx); this._restoreTabIdx = 0; }, 0);
    }

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
        const record = Store.create(this.COLLECTION, formData);
        UI.toast('客户已创建');
        formData.id = record.id; // 用于下方路由判断
      }
      const route = Router.current();
      if (route && route.hash.includes('/view/')) {
        this.renderDetail(id);
      } else {
        const customer = Store.getById(this.COLLECTION, formData.id || id);
        this._currentSea = (customer && customer.privateSea) || 'os';
        this.renderList();
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

  // 购物车 - 商品选择器弹窗
  _showProductSelector(customerId, onDone) {
    const products = Store.getAll('products').filter(p => p.status === '在售');
    const allCats = [...new Set(products.map(p => p.category))];
    const categories = ['全部', ...allCats];

    // 按分类统计商品数
    const catCount = {};
    products.forEach(p => { catCount[p.category] = (catCount[p.category] || 0) + 1; });

    const content = document.createElement('div');
    content.innerHTML = `
      <div class="product-selector-layout">
        <div class="product-selector-sidebar">
          <div class="product-selector-sidebar-title">商品分类</div>
          <div class="product-selector-categories">
            ${categories.map(c => {
              const count = c === '全部' ? products.length : (catCount[c] || 0);
              return `<div class="product-selector-category ${c === '全部' ? 'active' : ''}" data-cat="${c}">
                <span>${Helpers.escapeHtml(c)}</span>
                <span class="product-selector-cat-count">${count}</span>
              </div>`;
            }).join('')}
          </div>
        </div>
        <div class="product-selector-main">
          <div class="product-selector-toolbar">
            <div class="product-selector-search">
              <svg viewBox="0 0 24 24" class="product-selector-search-icon"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" class="product-selector-search-input" placeholder="搜索商品名称..." id="product-search-input">
              <button class="product-selector-search-clear" id="product-search-clear" style="display:none">
                <svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <label class="product-selector-selectall">
              <input type="checkbox" id="product-select-all">
              <span class="product-selector-selectall-label">全选</span>
              <span class="product-selector-selectall-hint" id="select-all-hint">已选 <strong id="selected-count">0</strong> 项</span>
            </label>
          </div>
          <div class="product-selector-grid" id="product-selector-grid">
            ${products.map(p => `
              <label class="product-selector-item" data-name="${Helpers.escapeHtml(p.name)}">
                <input type="checkbox" class="product-selector-checkbox" value="${p.id}" data-name="${Helpers.escapeHtml(p.name)}" data-category="${Helpers.escapeHtml(p.category)}" data-price="${p.price}">
                <span class="product-selector-checkmark"></span>
                <div class="product-selector-info">
                  <span class="product-selector-name">${Helpers.escapeHtml(p.name)}</span>
                  <span class="product-selector-code">${Helpers.escapeHtml(p.productId || '')}</span>
                </div>
                <span class="product-selector-price">${Helpers.formatMoney(p.price)}</span>
              </label>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    const footer = `
      <button class="btn btn-secondary" data-close-modal>取消</button>
      <button class="btn btn-primary" id="product-selector-confirm">确认添加</button>
    `;

    const { overlay, close } = UI.modal({
      title: '添加商品',
      content,
      footer,
      size: 'lg',
    });

    const searchInput = content.querySelector('#product-search-input');
    const searchClear = content.querySelector('#product-search-clear');
    const grid = content.querySelector('#product-selector-grid');
    const selectAll = content.querySelector('#product-select-all');
    const selectedCount = content.querySelector('#selected-count');

    function updateSelectedCount() {
      const checked = grid.querySelectorAll('.product-selector-checkbox:checked').length;
      selectedCount.textContent = checked;
      // 更新全选状态
      const total = grid.querySelectorAll('.product-selector-checkbox').length;
      if (selectAll) selectAll.checked = checked > 0 && checked === total;
    }

    function renderGrid() {
      const activeCat = content.querySelector('.product-selector-category.active')?.dataset.cat || '全部';
      const term = searchInput.value.trim().toLowerCase();
      searchClear.style.display = term ? '' : 'none';

      const filtered = products.filter(p => {
        if (activeCat !== '全部' && p.category !== activeCat) return false;
        if (term && !p.name.toLowerCase().includes(term)) return false;
        return true;
      });

      grid.innerHTML = filtered.map(p => `
        <label class="product-selector-item" data-name="${Helpers.escapeHtml(p.name)}">
          <input type="checkbox" class="product-selector-checkbox" value="${p.id}" data-name="${Helpers.escapeHtml(p.name)}" data-category="${Helpers.escapeHtml(p.category)}" data-price="${p.price}">
          <span class="product-selector-checkmark"></span>
          <div class="product-selector-info">
            <span class="product-selector-name">${Helpers.escapeHtml(p.name)}</span>
            <span class="product-selector-code">${Helpers.escapeHtml(p.code || '')}</span>
          </div>
          <span class="product-selector-price">${Helpers.formatMoney(p.price)}</span>
        </label>
      `).join('');

      updateSelectedCount();
    }

    // 分类切换
    content.querySelectorAll('.product-selector-category').forEach(el => {
      el.addEventListener('click', () => {
        content.querySelectorAll('.product-selector-category').forEach(c => c.classList.remove('active'));
        el.classList.add('active');
        renderGrid();
      });
    });

    // 搜索
    searchInput.addEventListener('input', () => renderGrid());

    // 清除搜索
    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      renderGrid();
      searchInput.focus();
    });

    // 全选
    selectAll.addEventListener('change', (e) => {
      grid.querySelectorAll('.product-selector-checkbox').forEach(cb => cb.checked = e.target.checked);
      updateSelectedCount();
    });

    // 监听勾选变化（委托）
    grid.addEventListener('change', (e) => {
      if (e.target.classList.contains('product-selector-checkbox')) {
        updateSelectedCount();
      }
    });

    // 确认添加
    overlay.querySelector('#product-selector-confirm').addEventListener('click', () => {
      const checked = grid.querySelectorAll('.product-selector-checkbox:checked');
      let added = 0;
      checked.forEach(cb => {
        const price = parseFloat(cb.dataset.price) || 0;
        Store.create('cartItems', {
          customerId,
          productId: cb.value,
          productName: cb.dataset.name,
          category: cb.dataset.category,
          price,
          quantity: 1,
          // 丰富字段（添加时使用默认值，用户后续可编辑）
          productType: '解决方案商品',
          period: '1年',
          salesMethod: '固定期限',
          version: '标准版',
          originalPrice: price,
          discountRate: '100.00%',
          payable: price,
          paymentTerm: '1年',
        });
        added++;
      });
      close();
      if (added > 0) {
        UI.toast(`已添加 ${added} 个商品到购物车`);
        if (onDone) onDone();
      } else {
        UI.toast('请至少选择一个商品', 'warning');
      }
    });

    return { overlay, close };
  },

  // 提单弹窗 - 多合同分组提交
  _showOrderModal(selectedItems, customerId, onDone) {
    const customer = Store.getById('customers', customerId);
    if (!customer) return;

    // 内部状态：合同分组
    const groups = [{
      id: 'group_1',
      items: selectedItems.map(item => ({ ...item })),
      contractType: '标准合同',
      signer: '',
      signDate: Helpers.today(),
      isSealed: '否',
      remark: ''
    }];
    let nextGroupId = 2;

    function calcGroupAmount(group) {
      return group.items.reduce((sum, item) => sum + (parseFloat(item.payable) || 0), 0);
    }
    function calcTotalAmount() {
      return groups.reduce((sum, g) => sum + calcGroupAmount(g), 0);
    }
    function totalItemCount() {
      return groups.reduce((sum, g) => sum + g.items.length, 0);
    }
    function readFields() {
      groups.forEach(g => {
        const sel = `[data-group-id="${g.id}"]`;
        const q = (field) => container.querySelector(`${sel}[data-field="${field}"]`);
        const qr = (field) => container.querySelector(`${sel}[data-field="${field}"]:checked`);
        const typeEl = qr('contractType') || q('contractType');
        const signerEl = q('signer');
        const dateEl = q('signDate');
        const sealedEl = qr('isSealed') || q('isSealed');
        const remarkEl = q('remark');
        if (typeEl) g.contractType = typeEl.value;
        if (signerEl) g.signer = signerEl.value;
        if (dateEl) g.signDate = dateEl.value;
        if (sealedEl) g.isSealed = sealedEl.value;
        if (remarkEl) g.remark = remarkEl.value;
      });
    }

    // 渲染函数
    const container = document.createElement('div');
    container.className = 'order-modal-layout';

    function render() {
      readFields();
      container.innerHTML = '';

      groups.forEach((group, gi) => {
        const groupEl = document.createElement('div');
        groupEl.className = 'order-group';
        groupEl.dataset.groupId = group.id;

        // 组头部
        const header = document.createElement('div');
        header.className = 'order-group-header';
        header.innerHTML = `
          <span class="order-group-title">合同 ${gi + 1}</span>
          ${groups.length > 1 ? '<button class="order-group-remove" data-action="remove-group">删除分组</button>' : ''}
        `;
        groupEl.appendChild(header);

        // 组内容
        const body = document.createElement('div');
        body.className = 'order-group-body';

        // 商品列表
        if (group.items.length > 0) {
          const itemsList = document.createElement('div');
          itemsList.className = 'order-group-items';
          group.items.forEach((item, ii) => {
            const itemEl = document.createElement('div');
            itemEl.className = 'order-group-item';
            const specParts = [];
            if (item.version) specParts.push('版本: ' + Helpers.escapeHtml(item.version));
            if (item.period) specParts.push(Helpers.escapeHtml(item.period));
            itemEl.innerHTML = `
              <div class="order-item-info">
                <span class="order-item-name">${Helpers.escapeHtml(item.productName || item.name || '')}</span>
                <span class="order-item-spec">${specParts.join(' / ')}</span>
              </div>
              <span class="order-item-amount">${Helpers.formatMoney(item.payable)}</span>
              <button class="order-split-btn" data-action="split-item" data-item-idx="${ii}">移出</button>
            `;
            itemsList.appendChild(itemEl);
          });
          body.appendChild(itemsList);
        }

        // 合同字段
        const fields = document.createElement('div');
        fields.className = 'order-group-fields';
        fields.innerHTML = `
          <div class="form-group">
            <label>合同类型</label>
            <div class="horizontal-radio-group">
              <label>
                <input type="radio" name="g_contractType_${group.id}" value="标准合同" data-field="contractType" data-group-id="${group.id}" ${group.contractType === '标准合同' ? 'checked' : ''}>
                <span>标准合同</span>
              </label>
              <label>
                <input type="radio" name="g_contractType_${group.id}" value="非标合同" data-field="contractType" data-group-id="${group.id}" ${group.contractType === '非标合同' ? 'checked' : ''}>
                <span>非标合同</span>
              </label>
            </div>
          </div>
          <div class="form-group">
            <label>签约人 <span style="color:var(--danger)">*</span></label>
            <input type="text" data-field="signer" data-group-id="${group.id}" value="${Helpers.escapeHtml(group.signer || '')}" placeholder="签约人姓名">
          </div>
          <div class="form-group">
            <label>签约时间 <span style="color:var(--danger)">*</span></label>
            <input type="date" data-field="signDate" data-group-id="${group.id}" value="${group.signDate || ''}">
          </div>
          <div class="form-group">
            <label>是否盖章</label>
            <div class="horizontal-radio-group">
              <label>
                <input type="radio" name="g_isSealed_${group.id}" value="否" data-field="isSealed" data-group-id="${group.id}" ${group.isSealed === '否' ? 'checked' : ''}>
                <span>未盖章</span>
              </label>
              <label>
                <input type="radio" name="g_isSealed_${group.id}" value="是" data-field="isSealed" data-group-id="${group.id}" ${group.isSealed === '是' ? 'checked' : ''}>
                <span>已盖章</span>
              </label>
            </div>
          </div>
          <div class="form-group full-width">
            <label>备注</label>
            <textarea data-field="remark" data-group-id="${group.id}" placeholder="合同备注...">${Helpers.escapeHtml(group.remark || '')}</textarea>
          </div>
        `;
        body.appendChild(fields);

        // 组小计
        const gAmt = calcGroupAmount(group);
        const summary = document.createElement('div');
        summary.className = 'order-group-summary';
        summary.innerHTML = `
          <span class="order-group-summary-text">本合同应付金额小计：</span>
          <span class="order-group-summary-amount">${Helpers.formatMoney(gAmt)}</span>
        `;
        body.appendChild(summary);

        groupEl.appendChild(body);
        container.appendChild(groupEl);
      });

      // 添加合同组按钮
      const addArea = document.createElement('div');
      addArea.className = 'order-add-group';
      addArea.innerHTML = '<button class="order-add-group-btn" id="order-add-group"><svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> 添加合同组</button>';
      container.appendChild(addArea);

      // 底部总计
      const totalAmt = calcTotalAmount();
      const totalEl = document.createElement('div');
      totalEl.className = 'order-total-summary';
      totalEl.innerHTML = `
        <div class="order-total-summary-left">
          共 <strong>${groups.length}</strong> 份合同，<strong>${totalItemCount()}</strong> 个商品
        </div>
        <div class="order-total-summary-right">
          <span class="order-total-label">总金额：</span>
          <span class="order-total-amount">${Helpers.formatMoney(totalAmt)}</span>
        </div>
      `;
      container.appendChild(totalEl);
    }

    // 创建弹窗
    const footer = `
      <button class="btn btn-secondary" data-close-modal>取消</button>
      <button class="btn btn-primary" id="order-confirm">确认提单</button>
    `;
    const { overlay, close } = UI.modal({
      title: '提单',
      content: container,
      footer,
      size: 'lg',
    });

    render();

    // 事件委派：移出/删除分组/添加分组
    container.addEventListener('click', (e) => {
      // 移出商品到其他分组
      const splitBtn = e.target.closest('[data-action="split-item"]');
      if (splitBtn) {
        const groupEl = splitBtn.closest('.order-group');
        const gid = groupEl.dataset.groupId;
        const idx = parseInt(splitBtn.dataset.itemIdx, 10);
        const group = groups.find(g => g.id === gid);
        if (!group || idx < 0 || idx >= group.items.length) return;

        const item = group.items.splice(idx, 1)[0];
        if (groups.length === 1) {
          // 仅一个组时，创建新组再移入
          groups.push({
            id: 'group_' + (nextGroupId++),
            items: [item],
            contractType: '标准合同',
            signer: '',
            signDate: Helpers.today(),
            isSealed: '否',
            remark: ''
          });
        } else {
          // 多个组时，移入最末组
          groups[groups.length - 1].items.push(item);
        }

        // 移除空组
        for (let i = groups.length - 1; i >= 0; i--) {
          if (groups[i].items.length === 0) groups.splice(i, 1);
        }
        render();
        return;
      }

      // 删除分组
      const rmBtn = e.target.closest('.order-group-remove');
      if (rmBtn) {
        const groupEl = rmBtn.closest('.order-group');
        const gid = groupEl.dataset.groupId;
        const idx = groups.findIndex(g => g.id === gid);
        if (idx > -1 && groups.length > 1) {
          groups.splice(idx, 1);
          render();
        }
        return;
      }

      // 添加合同组
      const addBtn = e.target.closest('#order-add-group');
      if (addBtn) {
        groups.push({
          id: 'group_' + (nextGroupId++),
          items: [],
          contractType: '标准合同',
          signer: '',
          signDate: Helpers.today(),
          isSealed: '否',
          remark: ''
        });
        render();
        // 滚动到底部
        setTimeout(() => { container.scrollTop = container.scrollHeight; }, 50);
        return;
      }
    });

    // 字段输入同步
    container.addEventListener('change', (e) => {
      const field = e.target.dataset.field;
      const gid = e.target.dataset.groupId;
      if (field && gid) {
        const group = groups.find(g => g.id === gid);
        if (group) group[field] = e.target.value;
      }
    });

    // 确认提单
    overlay.querySelector('#order-confirm').addEventListener('click', () => {
      readFields();

      // 验证
      let errorMsg = '';
      for (let i = 0; i < groups.length; i++) {
        const g = groups[i];
        if (g.items.length === 0) {
          errorMsg = `合同 ${i + 1} 没有商品，请添加商品或删除该合同`;
          break;
        }
        if (!g.signer || !g.signer.trim()) {
          errorMsg = `请填写合同 ${i + 1} 的签约人`;
          break;
        }
        if (!g.signDate) {
          errorMsg = `请选择合同 ${i + 1} 的签约时间`;
          break;
        }
      }
      if (errorMsg) {
        UI.toast(errorMsg, 'warning');
        return;
      }

      // 生成递增合同编号
      const all = Store.getAll('contracts');
      let maxNum = 0;
      all.forEach(c => {
        const m = c.contractNo && c.contractNo.match(/HT-(\d{4})-(\d+)/);
        if (m) { const n = parseInt(m[2], 10); if (n > maxNum) maxNum = n; }
      });
      let nextNum = maxNum;
      const year = new Date().getFullYear();

      // 创建合同
      let createdCount = 0;
      groups.forEach(g => {
        nextNum++;
        const contractNo = `HT-${year}-${String(nextNum).padStart(3, '0')}`;
        const itemsSummary = g.items.map(item =>
          `${item.productName || item.name}(${Helpers.formatMoney(item.payable)})`
        ).join('、');

        Store.create('contracts', {
          contractNo,
          contractType: g.contractType,
          customerId,
          isSealed: g.isSealed,
          amount: calcGroupAmount(g),
          status: '待归档',
          signer: g.signer,
          signDate: g.signDate,
          relatedOrderNo: '',
          remark: g.remark || `包含商品: ${itemsSummary}`
        });
        createdCount++;
      });

      // 从购物车删除已提单商品
      selectedItems.forEach(ci => Store.delete('cartItems', ci.id));

      close();
      UI.toast(`成功创建 ${createdCount} 份合同`);
      if (onDone) onDone();
    });
  },

  // 全页提单 - 多合同标签页
  _renderOrderPage(customerId) {
    const customer = Store.getById('customers', customerId);
    if (!customer) { Router.navigate('#/customers'); return; }

    const cartItems = Customers._orderItems || [];
    if (cartItems.length === 0) {
      UI.toast('请先从购物车选择商品', 'warning');
      Router.navigate('#/customers/view/' + customerId);
      return;
    }

    // 乙方合同主体选项
    const PARTY_B_OPTIONS = [
      '上海微盟企业发展有限公司',
      '北京微盟企业发展有限公司',
      '深圳微盟企业发展有限公司',
      '广州微盟企业发展有限公司',
      '成都微盟企业发展有限公司',
    ];

    // OA 签约人选项
    const SIGNER_OPTIONS = [
      '李春洁', '张三', '李四', '王五', '赵六',
      '陈七', '刘八', '周九', '吴十', '郑十一',
    ];

    // 状态
    const contracts = [{
      id: 'contract_1',
      items: cartItems.map(item => ({ ...item, _contractId: 'contract_1' })),
      tabType: '主合同',
      contractType: '标准合同',
      partyB: PARTY_B_OPTIONS[0],
      isSealed: '否',
      signer: '李春洁',
      estimatedSealDate: '',
      contractNo: '',
      signDate: Helpers.today(),
      remark: '',
      supplementNos: [],
    }];
    let activeTabIndex = 0;
    let nextContractIdx = 2;

    const calcContractAmount = (c) => c.items.reduce((sum, item) => sum + (parseFloat(item.payable) || 0), 0);
    const calcTotalAmount = () => contracts.reduce((sum, c) => sum + calcContractAmount(c), 0);
    const totalItemCount = () => contracts.reduce((sum, c) => sum + c.items.length, 0);
    const getTabLabel = (c, i) => `合同${i + 1}`;

    function generateContractNos() {
      const all = Store.getAll('contracts');
      let maxNum = 0;
      all.forEach(c => {
        const m = c.contractNo && c.contractNo.match(/HT-(\d{4})-(\d+)/);
        if (m) { const n = parseInt(m[2], 10); if (n > maxNum) maxNum = n; }
      });
      let nextNum = maxNum;
      const year = new Date().getFullYear();
      return contracts.map(c => {
        nextNum++;
        return `HT-${year}-${String(nextNum).padStart(3, '0')}`;
      });
    }

    function readFields() {
      contracts.forEach((c, i) => {
        const panel = document.querySelector(`[data-contract-id="${c.id}"]`);
        if (!panel) return;
        const q = (name) => panel.querySelector(`[name="contract_${name}"]`);
        const qr = (name) => panel.querySelector(`[name="contract_${name}"]:checked`);
        const typeEl = qr('contractType') || q('contractType');
        const partyBEl = q('partyB');
        const isSealedEl = qr('isSealed') || q('isSealed');
        const signerEl = q('signer');
        const sealDateEl = q('estimatedSealDate');
        const contractNoEl = q('contractNo');
        const signDateEl = q('signDate');
        const remarkEl = q('remark');
        if (typeEl) c.contractType = typeEl.value;
        if (partyBEl) c.partyB = partyBEl.value;
        if (isSealedEl) c.isSealed = isSealedEl.value;
        if (signerEl) c.signer = signerEl.value;
        if (sealDateEl) c.estimatedSealDate = sealDateEl.value;
        if (contractNoEl) c.contractNo = contractNoEl.value;
        if (signDateEl) c.signDate = signDateEl.value;
        if (remarkEl) c.remark = remarkEl.value;
        // 读取补充协议编号（从隐藏字段）
        const supplInput = panel.querySelector('[name="contract_supplementNos"]');
        if (supplInput) {
          try { c.supplementNos = JSON.parse(supplInput.value) || []; } catch(e) { c.supplementNos = []; }
        }
      });
    }

    function getFirstUnallocatedContractIdx() {
      for (let i = 0; i < contracts.length; i++) {
        if (contracts[i].items.length === 0) return i;
      }
      return -1;
    }

    const render = () => {
      const totalAmt = calcTotalAmount();
      const totalItems = totalItemCount();

      // 读取当前表单数据
      readFields();

      const el = document.createElement('div');
      el.className = 'order-page';

      // 面包屑 + 页面标题
      UI.setPageTitle(customer.name + ' · 提单', [
        { label: '客户管理', route: '#/customers' },
        { label: customer.name, route: '#/customers/view/' + customerId },
        { label: '提单' }
      ]);

      // 步骤条
      const steps = [
        { label: '添加合同', active: true },
        { label: '关联商品', active: false },
        { label: '关联商机', active: false },
        { label: '填写支付信息', active: false },
        { label: '提交审批', active: false },
      ];
      const stepHtml = steps.map((s, i) => `
        <div class="order-step ${s.done ? 'done' : ''} ${s.active ? 'active' : ''}">
          <div class="order-step-circle">${s.done ? '✓' : i + 1}</div>
          <div class="order-step-label">${Helpers.escapeHtml(s.label)}</div>
        </div>
      `).join('');
      const stepsBar = `<div class="order-step-bar">${stepHtml}</div>`;

      // 提示条
      const hintBar = `
        <div class="order-hint-bar">
          <svg class="hint-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          <span>支持在一次提单中填写多份合同信息，可在下方点击「+ 添加合同」增加合同（最多支持5 份）。</span>
        </div>
      `;

      // 合同标签栏
      const tabHtml = contracts.map((c, i) => `
        <button class="order-contract-tab ${i === activeTabIndex ? 'active' : ''}" data-index="${i}">
          ${getTabLabel(c, i)}
          ${contracts.length > 1 ? `<span class="order-contract-tab-remove" data-action="remove-contract" data-index="${i}">✕</span>` : ''}
        </button>
      `).join('');
      const addBtnHtml = contracts.length < 5
        ? `<button class="order-contract-tab-add" id="btn-add-contract"><svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> 添加合同</button>`
        : '';
      const tabsBar = `
        <div class="order-section-title">
          <span>合同信息（共 ${contracts.length} 份合同）</span>
          <span style="font-size:var(--text-sm);font-weight:400;color:var(--text-secondary)">合同总金额 ${Helpers.formatMoney(totalAmt)}</span>
        </div>
        <div class="order-contract-tabs">${tabHtml}${addBtnHtml}</div>
      `;

      // 当前合同表单面板
      const activeContract = contracts[activeTabIndex];
      const contractAmt = calcContractAmount(activeContract);
      const formPanel = `
        <div class="order-contract-panel" data-contract-id="${activeContract.id}">
          <div class="order-contract-fields">
            <div class="form-group">
              <label>合同模板 <span class="required">*</span></label>
              <div class="horizontal-radio-group">
                <label>
                  <input type="radio" name="contract_contractType" value="标准合同" ${activeContract.contractType === '标准合同' ? 'checked' : ''}>
                  <span>标准合同</span>
                </label>
                <label>
                  <input type="radio" name="contract_contractType" value="非标合同" ${activeContract.contractType === '非标合同' ? 'checked' : ''}>
                  <span>非标合同</span>
                </label>
              </div>
            </div>
            <div class="form-group">
              <label>乙方合同主体 <span class="required">*</span></label>
              <select name="contract_partyB">
                ${PARTY_B_OPTIONS.map(opt => `<option value="${opt}" ${activeContract.partyB === opt ? 'selected' : ''}>${opt}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label>合同是否盖章 <span class="required">*</span></label>
              <div class="horizontal-radio-group">
                <label>
                  <input type="radio" name="contract_isSealed" value="否" ${activeContract.isSealed === '否' ? 'checked' : ''}>
                  <span>未盖章</span>
                </label>
                <label>
                  <input type="radio" name="contract_isSealed" value="是" ${activeContract.isSealed === '是' ? 'checked' : ''}>
                  <span>已盖章</span>
                </label>
              </div>
            </div>
            <div class="form-group">
              <label>我方签约人 <span class="required">*</span></label>
              <select name="contract_signer">
                ${SIGNER_OPTIONS.map(opt => `<option value="${opt}" ${activeContract.signer === opt ? 'selected' : ''}>${opt}</option>`).join('')}
              </select>
            </div>
            <div class="form-group" id="field-estimated-seal-date" style="${activeContract.isSealed === '是' ? 'display:none' : ''}">
              <label>预计盖章日期 <span class="required">*</span></label>
              <input type="date" name="contract_estimatedSealDate" value="${activeContract.estimatedSealDate || ''}">
            </div>
            <div class="form-group">
              <label>合同编号 <span class="required">*</span></label>
              <input type="text" name="contract_contractNo" value="${Helpers.escapeHtml(activeContract.contractNo || '')}" placeholder="请填写合同编号">
            </div>
            <div class="form-group">
              <label>合同签订日期 <span class="required">*</span></label>
              <input type="date" name="contract_signDate" value="${activeContract.signDate || Helpers.today()}">
            </div>
            <div class="form-group" id="field-supplement-nos" style="${activeContract.contractType === '标准合同' ? 'display:none' : ''}">
              <label>补充协议编号</label>
              <input type="hidden" name="contract_supplementNos" value='${JSON.stringify(activeContract.supplementNos || [])}'>
              <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:6px" id="supplement-tags-container">
                ${(activeContract.supplementNos || []).map((no, ni) => `
                  <span style="display:inline-flex;align-items:center;gap:4px;padding:2px 8px;background:var(--primary-light);border-radius:4px;font-size:var(--text-sm)">
                    ${Helpers.escapeHtml(no)}
                    <span style="cursor:pointer;color:var(--text-muted);font-size:14px;line-height:1" onclick="
                      (function(){
                        var panel = this.closest('[data-contract-id]');
                        if(!panel)return;
                        var input = panel.querySelector('[name=\\'contract_supplementNos\\']');
                        if(!input)return;
                        var arr = JSON.parse(input.value || '[]');
                        arr.splice(${ni},1);
                        input.value = JSON.stringify(arr);
                        var evt = document.createEvent('HTMLEvents');
                        evt.initEvent('change',true,false);
                        input.dispatchEvent(evt);
                      }).call(this)
                    ">×</span>
                  </span>
                `).join('')}
              </div>
              <div style="display:flex;gap:6px">
                <input type="text" placeholder="输入补充协议编号" style="flex:1;font-size:var(--text-sm);padding:6px 10px;border:1px solid var(--border-light);border-radius:var(--radius-md)" id="input-supplement-no">
                <button class="btn btn-secondary btn-sm" id="btn-add-supplement">添加</button>
              </div>
            </div>
            <div class="form-group">
              <label>合同附件</label>
              <input type="file" name="contract_attachment" class="form-file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx">
              <div class="field-hint">需上传合同+营业执照（个人客户需身份证复印件）</div>
            </div>
            <div class="form-group">
              <label>合同备注</label>
              <textarea name="contract_remark" placeholder="合同备注...">${Helpers.escapeHtml(activeContract.remark || '')}</textarea>
            </div>
          </div>
          <div class="order-contract-summary">
            <span class="order-contract-summary-label">本合同应付金额小计：</span>
            <span class="order-contract-summary-amount">${Helpers.formatMoney(contractAmt)}</span>
          </div>
        </div>
      `;

      // 商品归属表 - 构建扁平商品列表
      const flatItems = [];
      contracts.forEach((c, ci) => {
        c.items.forEach((item, ii) => {
          flatItems.push({ item, contractIdx: ci, uid: 'item_' + ci + '_' + ii });
        });
      });

      const productRows = flatItems.length === 0
        ? '<tr><td colspan="5" style="text-align:center;padding:var(--space-6);color:var(--text-muted)">暂无商品，请添加商品到购物车</td></tr>'
        : flatItems.map(({ item, contractIdx, uid }) => {
            const specParts = [];
            if (item.version) specParts.push('版本: ' + Helpers.escapeHtml(item.version));
            if (item.period) specParts.push(Helpers.escapeHtml(item.period));
            if (item.spec) specParts.push(Helpers.escapeHtml(item.spec));
            if (item.productType) specParts.push(Helpers.escapeHtml(item.productType));
            const specHtml = specParts.length > 0 ? `<span class="product-spec">${specParts.join(' / ')}</span>` : '';
            const contractOpts = contracts.map((c, i) => {
              const label = getTabLabel(c, i);
              const no = c.contractNo && c.contractNo.trim() ? c.contractNo.trim() : '合同编号';
              return `<option value="${i}" ${i === contractIdx ? 'selected' : ''}>${label}+${Helpers.escapeHtml(no)}</option>`;
            }).join('');
            const orphanHint = item._orphaned ? '<div style="color:var(--danger);font-size:11px;margin-top:2px">请重新选择归属合同</div>' : '';
            return `<tr>
              <td>
                <span class="product-name">${Helpers.escapeHtml(item.productName || item.name || '')}</span>
                ${specHtml}
              </td>
              <td style="white-space:nowrap">${Helpers.escapeHtml(item.period || '-')}</td>
              <td style="white-space:nowrap">${item.salesMethod ? Helpers.escapeHtml(item.salesMethod) : '-'}</td>
              <td class="product-price">${Helpers.formatMoney(item.payable)}</td>
              <td class="product-assign">
                ${orphanHint}
                <select data-action="assign-contract" data-uid="${uid}">
                  ${contractOpts}
                </select>
              </td>
            </tr>`;
          }).join('');

      const productSection = `
        <div class="order-section-title">
          <span>商品信息（共 ${flatItems.length} 件）</span>
          <span style="font-size:var(--text-xs);font-weight:400;color:var(--text-muted);margin-left:var(--space-2)">每件商品必须关联1份所属合同</span>
          <span style="font-size:var(--text-sm);font-weight:400;color:var(--text-secondary);margin-left:auto">应付金额 ${Helpers.formatMoney(totalAmt)}</span>
        </div>
        <div class="order-product-card">
          <table class="order-product-table">
            <thead>
              <tr>
                <th style="min-width:160px">商品信息</th>
                <th>期限</th>
                <th>售卖方式</th>
                <th>价格</th>
                <th>归属合同</th>
              </tr>
            </thead>
            <tbody>${productRows}</tbody>
          </table>
        </div>
      `;

      // 商机信息
      const opportunities = Store.query('opportunities', o => o.customerId === customerId);

      // 构建商机选择列表 HTML（不含嵌套模板字面量）
      let oppListHtml = '';
      if (opportunities.length === 0) {
        oppListHtml = '<div style="padding:var(--space-3) 0;color:var(--text-muted);font-size:13px">该客户暂无商机记录</div>';
      } else {
        oppListHtml = '<div class="order-opportunity-list">';
        opportunities.forEach((opp, idx) => {
          var stageType = (Opportunities && Opportunities.STAGE_TYPE) ? Opportunities.STAGE_TYPE[opp.stage] || 'gray' : 'gray';
          var stageBadge = Components.Badge(opp.stage, stageType);
          oppListHtml += '<label class="order-opportunity-item' + (idx === 0 ? ' selected' : '') + '">' +
            '<input type="radio" name="selected-opportunity" value="' + opp.id + '"' + (idx === 0 ? ' checked' : '') + '>' +
            '<div class="order-opportunity-item-info">' +
              '<div class="order-opportunity-item-name">' + Helpers.escapeHtml(opp.name) + '</div>' +
              '<div class="order-opportunity-item-meta">' +
                '<span>' + stageBadge + '</span>' +
                '<span style="color:var(--primary);font-weight:500;margin-left:var(--space-2)">' + Helpers.formatMoney(opp.amount) + '</span>' +
              '</div>' +
            '</div>' +
          '</label>';
        });
        oppListHtml += '</div>';
      }

      const oppSection = `
        <div class="order-section-title">
          <span>商机信息</span>
          <span style="font-size:var(--text-sm);font-weight:400;color:var(--text-muted)">选择关联商机（可选）</span>
        </div>
        <div class="order-opportunity-section">
          ${oppListHtml}
          <div class="order-opportunity-hint" style="margin-top:${opportunities.length > 0 ? 'var(--space-3)' : '0'}">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            <span>多合同提单场景下，多份合同共享同一条商机记录，无需重复创建。</span>
          </div>
        </div>
      `;

      // 组装页面
      el.innerHTML = stepsBar + hintBar + tabsBar + formPanel + productSection + oppSection;

      // 底部固定操作栏（在页面内）
      const bottomBar = document.createElement('div');
      bottomBar.className = 'order-fixed-bottom';
      bottomBar.innerHTML = `
        <div class="order-fixed-bottom-left">
          <span class="total-label">总金额</span>
          <span class="total-amount">${Helpers.formatMoney(totalAmt)}</span>
          <span class="total-count">（含 ${contracts.length} 份合同）</span>
        </div>
        <div class="order-fixed-bottom-right">
          <button class="btn btn-secondary" id="btn-order-draft">保存草稿</button>
          <button class="btn btn-secondary" id="btn-order-back">返回</button>
          <button class="order-btn-submit" id="btn-order-submit">提交审批</button>
        </div>
      `;
      document.body.appendChild(bottomBar);

      UI.render(el);

      // 事件绑定
      bindEvents(bottomBar);
    };

    // 事件绑定
    function bindEvents(bottomBar) {
      document.querySelector('.order-page')?.addEventListener('click', (e) => {
        // 优先检查删除合同（在标签内部，需先于标签切换检查）
        const rmBtn = e.target.closest('[data-action="remove-contract"]');
        if (rmBtn) {
          const idx = parseInt(rmBtn.dataset.index);
          if (contracts.length > 1 && idx >= 0 && idx < contracts.length) {
            UI.confirm({
              title: '删除合同',
              message: `删除后再次添加需重新填写，确认删除该合同信息？若已有商品关联该合同，需重新选择归属合同。`,
              type: 'danger',
              confirmText: '确认删除',
              onConfirm: () => {
                const removed = contracts.splice(idx, 1)[0];
                if (removed.items.length > 0 && contracts.length > 0) {
                  removed.items.forEach(item => { item._orphaned = true; });
                  contracts[0].items.push(...removed.items);
                }
                if (activeTabIndex >= contracts.length) {
                  activeTabIndex = contracts.length - 1;
                }
                cleanup();
                render();
              }
            });
          }
          return;
        }

        // 标签切换
        const tab = e.target.closest('.order-contract-tab');
        if (tab && tab.dataset.index !== undefined) {
          activeTabIndex = parseInt(tab.dataset.index);
          cleanup();
          render();
          return;
        }

        // 补充协议编号 - 添加
        const addSupplBtn = e.target.closest('#btn-add-supplement');
        if (addSupplBtn) {
          e.stopPropagation();
          const panel = addSupplBtn.closest('[data-contract-id]');
          if (!panel) return;
          const input = panel.querySelector('#input-supplement-no');
          const val = input.value.trim();
          if (!val) { UI.toast('请输入补充协议编号', 'warning'); return; }
          const hiddenInput = panel.querySelector('[name="contract_supplementNos"]');
          if (!hiddenInput) return;
          const arr = JSON.parse(hiddenInput.value || '[]');
          arr.push(val);
          hiddenInput.value = JSON.stringify(arr);
          input.value = '';
          cleanup();
          render();
          return;
        }

        // 添加合同 — 直接添加，无需选择类型
        const addBtn = e.target.closest('#btn-add-contract');
        if (addBtn && contracts.length < 5) {
          e.stopPropagation();
          contracts.push({
            id: 'contract_' + (nextContractIdx++),
            items: [],
            tabType: '主合同',
            contractType: '标准合同',
            partyB: PARTY_B_OPTIONS[0],
            isSealed: '否',
            signer: SIGNER_OPTIONS[0],
            estimatedSealDate: '',
            contractNo: '',
            signDate: Helpers.today(),
            remark: '',
            supplementNos: [],
          });
          activeTabIndex = contracts.length - 1;
          cleanup();
          render();
          return;
        }
      });

      // 商品归属变更 + 合同模板/盖章状态联动
      document.querySelector('.order-page')?.addEventListener('change', (e) => {
        // 商品归属变更
        const sel = e.target.closest('[data-action="assign-contract"]');
        if (sel) {
          const uid = sel.dataset.uid;
          const newContractIdx = parseInt(sel.value);
          if (isNaN(newContractIdx)) return;

          // uid 格式: 'item_{ci}_{ii}'
          const parts = uid.split('_');
          const ci = parseInt(parts[1]);
          const ii = parseInt(parts[2]);
          if (isNaN(ci) || isNaN(ii) || ci >= contracts.length || ii >= contracts[ci].items.length) return;

          const item = contracts[ci].items[ii];
          if (ci === newContractIdx) return;

          // 从旧合同移除，加入新合同
          delete item._orphaned;
          contracts[ci].items.splice(ii, 1);
          contracts[newContractIdx].items.push(item);

          cleanup();
          render();
          return;
        }

        // 合同模板切换 → 显示/隐藏补充协议编号
        if (e.target.closest('[name="contract_contractType"]')) {
          cleanup();
          render();
          return;
        }

        // 盖章状态切换 → 显示/隐藏预计盖章日期
        if (e.target.closest('[name="contract_isSealed"]')) {
          cleanup();
          render();
          return;
        }
      });

      // 底部操作栏按钮
      bottomBar.querySelector('#btn-order-back')?.addEventListener('click', () => {
        cleanup();
        Router.navigate('#/customers/view/' + customerId);
      });

      bottomBar.querySelector('#btn-order-draft')?.addEventListener('click', () => {
        UI.toast('草稿已保存');
      });

      bottomBar.querySelector('#btn-order-submit')?.addEventListener('click', () => {
        // 确保 readFields 已读取最新数据
        readFields();

        // 验证
        let errorMsg = '';
        for (let i = 0; i < contracts.length; i++) {
          const c = contracts[i];
          const label = getTabLabel(c, i);
          if (c.items.length === 0) {
            errorMsg = `${label} 没有商品，请分配商品或删除该合同`;
            break;
          }
          if (!c.signDate) {
            errorMsg = `请选择 ${label} 的签订日期`;
            break;
          }
          if (!c.contractNo || !c.contractNo.trim()) {
            errorMsg = `请填写 ${label} 的合同编号`;
            break;
          }
          if (c.isSealed === '否' && !c.estimatedSealDate) {
            errorMsg = `请填写 ${label} 的预计盖章日期`;
            break;
          }
          if (!c.signer || !c.signer.trim()) {
            errorMsg = `请填写 ${label} 的签约人`;
            break;
          }
          if (!c.partyB || !c.partyB.trim()) {
            errorMsg = `请填写 ${label} 的乙方合同主体`;
            break;
          }
        }
        if (errorMsg) {
          UI.toast(errorMsg, 'warning');
          return;
        }

        // 生成合同编号
        const nos = generateContractNos();

        // 获取选中的商机
        const selectedOppRadio = document.querySelector('input[name="selected-opportunity"]:checked');
        const selectedOppId = selectedOppRadio ? selectedOppRadio.value : '';

        // 生成主订单编号
        var MAX_ORDER = 0;
        Store.getAll('orders').forEach(function(o) {
          var m = o.orderNo && o.orderNo.match(/ORD-(\d{4})-(\d+)/);
          if (m) { var n = parseInt(m[2], 10); if (n > MAX_ORDER) MAX_ORDER = n; }
        });
        var masterOrderNo = 'ORD-' + new Date().getFullYear() + '-' + String(MAX_ORDER + 1).padStart(3, '0');

        // 创建合同（relatedOrderNo 指向主订单号）
        var createdCount = 0;
        contracts.forEach(function(c, i) {
          var contractNo = c.contractNo && c.contractNo.trim() ? c.contractNo.trim() : nos[i];
          var itemsSummary = c.items.map(function(item) {
            return (item.productName || item.name) + '(' + Helpers.formatMoney(item.payable) + ')';
          }).join('、');

          Store.create('contracts', {
            contractNo: contractNo,
            tabType: c.tabType,
            contractType: c.contractType,
            customerId: customerId,
            opportunityId: selectedOppId,
            partyB: c.partyB,
            isSealed: c.isSealed,
            amount: calcContractAmount(c),
            status: '待归档',
            signer: c.signer,
            signDate: c.signDate,
            estimatedSealDate: c.estimatedSealDate || '',
            relatedOrderNo: masterOrderNo,
            supplementNos: c.supplementNos || [],
            remark: c.remark || '包含商品: ' + itemsSummary,
          });
          createdCount++;
        });

        // 收集所有商品的扁平列表（含归属合同信息）
        var allOrderItems = [];
        contracts.forEach(function(c, i) {
          c.items.forEach(function(item) {
            var payable = item.payable;
            allOrderItems.push({
              productName: item.productName || item.name || '',
              category: item.category || '',
              version: item.version || '',
              period: item.period || '',
              salesMethod: item.salesMethod || '',
              quantity: item.quantity || 1,
              unitPrice: payable / (item.quantity || 1),
              subtotal: payable,
              contractLabel: getTabLabel(c, i),
              contractNo: c.contractNo && c.contractNo.trim() ? c.contractNo.trim() : nos[i],
              contractType: c.contractType,
              supplementNos: c.supplementNos || [],
            });
          });
        });

        // 创建主订单（含合同数据）
        var totalAmt = calcTotalAmount();
        var masterOrderId = Store.create('orders', {
          orderNo: masterOrderNo,
          customerId: customerId,
          opportunityId: selectedOppId,
          orderType: '标准订单',
          orderSource: '涅槃',
          currency: 'CNY',
          listPrice: totalAmt,
          originalPrice: totalAmt,
          discount: 0,
          payableAmount: totalAmt,
          totalAmount: totalAmt,
          paymentMethod: '',
          submitter: '李春洁',
          status: '待付款',
          approvalStatus: '待审批',
          items: allOrderItems,
          contractsData: contracts.map(function(c, i) {
            return {
              label: getTabLabel(c, i),
              contractNo: c.contractNo && c.contractNo.trim() ? c.contractNo.trim() : nos[i],
              tabType: c.tabType,
              contractType: c.contractType,
              partyB: c.partyB,
              isSealed: c.isSealed,
              signer: c.signer,
              signDate: c.signDate,
              amount: calcContractAmount(c),
              remark: c.remark || '',
              items: c.items.map(function(item) {
                return {
                  productName: item.productName || item.name || '',
                  payable: item.payable,
                };
              }),
            };
          }),
        });

        // 创建子订单（按商品）
        allOrderItems.forEach(function(item, idx) {
          Store.create('orders', {
            orderNo: masterOrderNo + '-' + String(idx + 1).padStart(2, '0'),
            parentOrderNo: masterOrderNo,
            customerId: customerId,
            orderType: '软件产品',
            orderSource: '涅槃',
            currency: 'CNY',
            listPrice: item.subtotal,
            originalPrice: item.subtotal,
            discount: 0,
            payableAmount: item.subtotal,
            totalAmount: item.subtotal,
            paymentMethod: '',
            submitter: '李春洁',
            items: [item],
            status: '待付款',
            approvalStatus: '待审批',
          });
        });

        // 创建审批记录（关联主订单）
        (function(approvalCustomerName, approvalCustomerId, approvalBusinessLine, approvalContracts, aMasterOrderNo, aMasterOrderId) {
          var aTotalAmt = 0;
          approvalContracts.forEach(function(c) { aTotalAmt += calcContractAmount(c); });
          Store.create('approvals', {
            title: '合同审批-' + approvalCustomerName,
            description: approvalCustomerName + ' 共 ' + approvalContracts.length + ' 份合同，总金额 ' + Helpers.formatMoney(aTotalAmt) + '，关联订单：' + aMasterOrderNo,
            type: 'contract',
            applicant: '李春洁',
            status: 'pending',
            relatedType: 'contract',
            customerId: approvalCustomerId,
            customerName: approvalCustomerName,
            businessLine: approvalBusinessLine,
            amount: aTotalAmt,
            approver: '李明',
            rejectReason: '',
            approvedAt: '',
            relatedOrderId: aMasterOrderId,
          });
        })(customer.name, customerId, customer.businessLine || '', contracts, masterOrderNo, masterOrderId);

        // 从购物车删除已提单商品
        cartItems.forEach(function(ci) { Store.delete('cartItems', ci.id); });

        cleanup();
        UI.toast('成功创建 ' + createdCount + ' 份合同，订单号：' + masterOrderNo);
        Router.navigate('#/customers/view/' + customerId);
      });
    }

    // 清理底部操作栏
    function cleanup() {
      const existing = document.querySelector('.order-fixed-bottom');
      if (existing) existing.remove();
    }

    render();
  },

  // 派单弹窗
  _showDispatchForm(customerId) {
    const customer = Store.getById(this.COLLECTION, customerId);
    if (!customer) { UI.toast('客户不存在', 'error'); return; }

    const contacts = Store.query('contacts', c => c.customerId === customerId);

    // ============ 枚举常量 ============
    const INDUSTRY_OPTIONS = [
      '互联网/IT', '金融', '制造业', '教育', '医疗', '房地产', '零售',
      '批发/零售', '餐饮/食品', '酒店/旅游', '物流/运输', '文化/传媒',
      '能源/环保', '建筑/工程', '农林牧渔', '政府/公共事业', '其他'
    ];

    const INTENDED_PRODUCT_OPTIONS = [
      '微商城', '智慧零售', '智慧购百', '智慧商超', '智慧生鲜',
      '批发商城', '本地生活', '视频号营销助手', '智慧零售宠物行业',
      '智慧门店', '微盟星启', '智慧美业', '智慧服务', '企微助手', '企微小助手'
    ];

    const COMPETITOR_OPTIONS = [
      '有竞品-有赞', '有竞品-凡科', '有竞品-启博', '有竞品-点点客',
      '有竞品-微店', '有竞品-小鹅通', '有竞品-其他', '无竞品-暂无'
    ];

    const DEPT_OPTIONS = ['个体老板/合伙人', '市场部', '业务部', '数字化部门', '会员部', '总经办', 'IT部', '品牌部'];
    const STORE_COUNT_OPTIONS = ['无门店', '单门店', '2-4家', '5-9家', '10-29家', '30家及以上'];
    const NEED_MATCH_OPTIONS = ['需求都可满足', '有一项需求无法满足', '有两项需求无法满足', '有两项以上需求无法满足'];
    const ONLINE_TIME_OPTIONS = ['1个月内', '近3个月以上', '3个月以上', '询问未告知'];
    const BUDGET_OPTIONS = ['1w以内', '1-3w', '3-5w', '5w以上', '询问未告知'];
    const KP_OPTIONS = ['决策者', '影响者', '执行者'];
    const SALES_CHANNEL_OPTIONS = ['无', '抖音', '快手', '小红书', '京东', '淘宝', '拼多多', '1688', '视频号小店', '外卖平台', '微商', '本地生活平台', '其他'];
    const STORE_PROPERTY_OPTIONS = ['无', '直营', '加盟', '直营&加盟', '商圈'];
    const PURCHASE_TYPE_OPTIONS = ['新购系统', '系统替换'];
    const FLOW_TYPE_OPTIONS = ['已约面访', '有效线索'];
    const VALID_REASON_OPTIONS = ['外地客户', '远距离客户', '客户出差', '近期无时间', '竞品对比，着急沟通', '邀约3次，无法约见', '客户先调研，再约见', '客户已了解，价格商议'];
    const BIZ_LINE_OPTIONS = ['上海营销中心', '北京营销中心', '深圳营销中心', '广州营销中心', '杭州营销中心'];

    // Multi-select helper
    const multiSelectHtml = (name, options) => {
      return `<div class="multi-select-compact" data-name="${name}">${options.map(o =>
        `<label class="multi-select-item"><input type="checkbox" name="${name}" value="${Helpers.escapeHtml(o)}"><span>${Helpers.escapeHtml(o)}</span></label>`
      ).join('')}</div>`;
    };

    const content = document.createElement('div');
    content.innerHTML = `
      <style>
        .dispatch-form-section { margin-bottom: var(--space-4); }
        .dispatch-form-section + .dispatch-form-section { border-top: 1px solid var(--border); padding-top: var(--space-4); }
        .dispatch-form-section .form-label { display:block; font-size:var(--text-xs); color:var(--text-secondary); margin-bottom:4px; }
        .dispatch-form-section .form-label .required { color:var(--danger); }
        .dispatch-form-section .form-control-static { padding:6px 12px; background:var(--gray-50); border:1px solid var(--border); border-radius:4px; color:var(--text-secondary); font-size:var(--text-sm); }
        .dispatch-form-section .multi-select-compact { max-height:130px; overflow-y:auto; border:1px solid var(--border); border-radius:4px; padding:var(--space-2); background:#fff; }
        .dispatch-form-section .multi-select-compact .multi-select-item { display:flex; align-items:center; gap:6px; padding:2px 0; font-size:var(--text-sm); cursor:pointer; }
        .dispatch-form-section .multi-select-compact .multi-select-item input[type="checkbox"] { width:auto; margin:0; }
        .dispatch-modal-scroll { max-height:55vh; overflow-y:auto; padding:var(--space-1) 0; }
      </style>
      <div class="dispatch-modal-scroll">
        <!-- ====== 基本信息 ====== -->
        <div class="dispatch-form-section">
          <h4 style="font-size:var(--text-sm);font-weight:600;color:var(--text-secondary);margin:0 0 var(--space-3)">基本信息</h4>
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">客户名称</label>
              <div class="form-control-static">${Helpers.escapeHtml(customer.name)}</div>
            </div>
            <div class="form-group">
              <label class="form-label">行业 <span class="required">*</span></label>
              <select class="form-select" id="dispatch-industry">
                ${INDUSTRY_OPTIONS.map(o => `<option value="${o}" ${customer.industry === o ? 'selected' : ''}>${o}</option>`).join('')}
              </select>
            </div>
          </div>
        </div>

        <!-- ====== 购买意向 ====== -->
        <div class="dispatch-form-section">
          <h4 style="font-size:var(--text-sm);font-weight:600;color:var(--text-secondary);margin:0 0 var(--space-3)">购买意向</h4>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">意向产品 <span class="required">*</span></label>
              ${multiSelectHtml('intendedProducts', INTENDED_PRODUCT_OPTIONS)}
            </div>
            <div class="form-group">
              <label class="form-label">已接触竞品 <span class="required">*</span></label>
              ${multiSelectHtml('competitors', COMPETITOR_OPTIONS)}
            </div>
          </div>

          <div class="grid-2" style="margin-top:var(--space-3)">
            <div class="form-group">
              <label class="form-label">项目主导部门 <span class="required">*</span></label>
              <select class="form-select" id="dispatch-dept">
                <option value="">请选择</option>
                ${DEPT_OPTIONS.map(o => `<option value="${o}">${o}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">门店数 <span class="required">*</span></label>
              <select class="form-select" id="dispatch-storeCount">
                <option value="">请选择</option>
                ${STORE_COUNT_OPTIONS.map(o => `<option value="${o}">${o}</option>`).join('')}
              </select>
            </div>
          </div>

          <div class="form-group" style="margin-top:var(--space-3)">
            <label class="form-label">客户需求 <span class="required">*</span></label>
            <textarea class="form-textarea" id="dispatch-need" rows="2" placeholder="请输入客户需求"></textarea>
          </div>

          <div class="grid-2" style="margin-top:var(--space-3)">
            <div class="form-group">
              <label class="form-label">需求匹配（标品）<span class="required">*</span></label>
              <select class="form-select" id="dispatch-needMatch">
                <option value="">请选择</option>
                ${NEED_MATCH_OPTIONS.map(o => `<option value="${o}">${o}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">上线时间 <span class="required">*</span></label>
              <select class="form-select" id="dispatch-onlineTime">
                <option value="">请选择</option>
                ${ONLINE_TIME_OPTIONS.map(o => `<option value="${o}">${o}</option>`).join('')}
              </select>
            </div>
          </div>

          <div class="grid-2" style="margin-top:var(--space-3)">
            <div class="form-group">
              <label class="form-label">预算 <span class="required">*</span></label>
              <select class="form-select" id="dispatch-budget">
                <option value="">请选择</option>
                ${BUDGET_OPTIONS.map(o => `<option value="${o}">${o}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">KP（联系人类型）<span class="required">*</span></label>
              <select class="form-select" id="dispatch-kp">
                <option value="">请选择</option>
                ${KP_OPTIONS.map(o => `<option value="${o}">${o}</option>`).join('')}
              </select>
            </div>
          </div>

          <div class="grid-2" style="margin-top:var(--space-3)">
            <div class="form-group">
              <label class="form-label">线上销售渠道 <span class="required">*</span></label>
              ${multiSelectHtml('salesChannels', SALES_CHANNEL_OPTIONS)}
            </div>
            <div class="form-group">
              <label class="form-label">线下门店属性 <span class="required">*</span></label>
              ${multiSelectHtml('storeProperties', STORE_PROPERTY_OPTIONS)}
            </div>
          </div>

          <div class="form-group" style="margin-top:var(--space-3)">
            <label class="form-label">购买类型 <span class="required">*</span></label>
            ${multiSelectHtml('purchaseTypes', PURCHASE_TYPE_OPTIONS)}
          </div>
        </div>

        <!-- ====== 派单信息 ====== -->
        <div class="dispatch-form-section">
          <h4 style="font-size:var(--text-sm);font-weight:600;color:var(--text-secondary);margin:0 0 var(--space-3)">派单信息</h4>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">流转类型 <span class="required">*</span></label>
              <select class="form-select" id="dispatch-flowType">
                <option value="">请选择</option>
                ${FLOW_TYPE_OPTIONS.map(o => `<option value="${o}">${o}</option>`).join('')}
              </select>
            </div>
            <div class="form-group" id="dispatch-reason-group" style="display:none">
              <label class="form-label">有效线索原因 <span class="required">*</span></label>
              <select class="form-select" id="dispatch-validReason">
                <option value="">请选择</option>
                ${VALID_REASON_OPTIONS.map(o => `<option value="${o}">${o}</option>`).join('')}
              </select>
            </div>
          </div>

          <div class="grid-2" style="margin-top:var(--space-3)">
            <div class="form-group">
              <label class="form-label">联系人 <span class="required">*</span></label>
              <select class="form-select" id="dispatch-contact">
                <option value="">请选择联系人</option>
                ${contacts.map(c => `<option value="${c.id}" data-phone="${Helpers.escapeHtml(c.phone || '')}">${Helpers.escapeHtml(c.name)}${c.position ? ` (${Helpers.escapeHtml(c.position)})` : ''}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">业务线修改 <span class="required">*</span></label>
              <select class="form-select" id="dispatch-bizLine">
                <option value="">请选择</option>
                ${BIZ_LINE_OPTIONS.map(o => `<option value="${o}">${o}</option>`).join('')}
              </select>
            </div>
          </div>

          <div class="grid-2" style="margin-top:var(--space-3)">
            <div class="form-group">
              <label class="form-label">联系人电话</label>
              <input type="text" class="form-input" id="dispatch-contactPhone" readonly placeholder="选择联系人后自动带出">
            </div>
            <div class="form-group">
              <label class="form-label">拜访时间 <span class="required">*</span></label>
              <input type="datetime-local" class="form-input" id="dispatch-visitTime">
            </div>
          </div>

          <div class="grid-2" style="margin-top:var(--space-3)">
            <div class="form-group">
              <label class="form-label">拜访地址 <span class="required">*</span></label>
              <input type="text" class="form-input" id="dispatch-address" placeholder="请输入拜访地址">
            </div>
            <div class="form-group">
              <label class="form-label">派单附件 <span class="required">*</span></label>
              <input type="file" class="form-file" id="dispatch-attachment" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx">
            </div>
          </div>

          <div class="form-group" style="margin-top:var(--space-3)">
            <label class="form-label">备注 <span class="required">*</span></label>
            <textarea class="form-textarea" id="dispatch-remark" rows="2" placeholder="备注信息"></textarea>
          </div>
        </div>
      </div>
    `;

    const footer = `
      <button class="btn btn-secondary" data-close-modal>取消</button>
      <button class="btn btn-primary" id="dispatch-submit"><svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg> 提交派单</button>
    `;

    const { overlay, close } = UI.modal({
      title: '派单信息',
      content,
      footer,
      size: 'lg',
    });

    // 流转类型切换 → 显示/隐藏 有效线索原因
    content.querySelector('#dispatch-flowType').addEventListener('change', (e) => {
      const reasonGroup = content.querySelector('#dispatch-reason-group');
      reasonGroup.style.display = e.target.value === '有效线索' ? '' : 'none';
    });

    // 联系人选择 → 自动带出电话
    content.querySelector('#dispatch-contact').addEventListener('change', (e) => {
      const sel = e.target;
      const phoneEl = content.querySelector('#dispatch-contactPhone');
      const selectedOpt = sel.options[sel.selectedIndex];
      phoneEl.value = selectedOpt ? (selectedOpt.dataset.phone || '') : '';
    });

    // 提交
    overlay.querySelector('#dispatch-submit').addEventListener('click', () => {
      // 收集多选值
      const getMulti = (name) => Array.from(content.querySelectorAll(`input[type="checkbox"][name="${name}"]:checked`)).map(cb => cb.value);

      const industry = content.querySelector('#dispatch-industry').value;
      const intendedProducts = getMulti('intendedProducts');
      const competitors = getMulti('competitors');
      const dept = content.querySelector('#dispatch-dept').value;
      const storeCount = content.querySelector('#dispatch-storeCount').value;
      const need = content.querySelector('#dispatch-need').value.trim();
      const needMatch = content.querySelector('#dispatch-needMatch').value;
      const onlineTime = content.querySelector('#dispatch-onlineTime').value;
      const budget = content.querySelector('#dispatch-budget').value;
      const kp = content.querySelector('#dispatch-kp').value;
      const salesChannels = getMulti('salesChannels');
      const storeProperties = getMulti('storeProperties');
      const purchaseTypes = getMulti('purchaseTypes');
      const flowType = content.querySelector('#dispatch-flowType').value;
      const validReason = content.querySelector('#dispatch-validReason').value;
      const contactId = content.querySelector('#dispatch-contact').value;
      const bizLine = content.querySelector('#dispatch-bizLine').value;
      const visitTime = content.querySelector('#dispatch-visitTime').value;
      const address = content.querySelector('#dispatch-address').value.trim();
      const remark = content.querySelector('#dispatch-remark').value.trim();
      const attachmentFile = content.querySelector('#dispatch-attachment').files[0];

      // 必填验证
      const errors = [];
      if (!industry) errors.push('请选择行业');
      if (intendedProducts.length === 0) errors.push('请选择意向产品');
      if (competitors.length === 0) errors.push('请选择已接触竞品');
      if (!dept) errors.push('请选择项目主导部门');
      if (!storeCount) errors.push('请选择门店数');
      if (!need) errors.push('请输入客户需求');
      if (!needMatch) errors.push('请选择需求匹配');
      if (!onlineTime) errors.push('请选择上线时间');
      if (!budget) errors.push('请选择预算');
      if (!kp) errors.push('请选择KP联系人类型');
      if (salesChannels.length === 0) errors.push('请选择线上销售渠道');
      if (storeProperties.length === 0) errors.push('请选择线下门店属性');
      if (purchaseTypes.length === 0) errors.push('请选择购买类型');
      if (!flowType) errors.push('请选择流转类型');
      if (flowType === '有效线索' && !validReason) errors.push('请选择有效线索原因');
      if (!contactId) errors.push('请选择联系人');
      if (!bizLine) errors.push('请选择业务线');
      if (!visitTime) errors.push('请选择拜访时间');
      if (!address) errors.push('请输入拜访地址');
      if (!remark) errors.push('请输入备注');
      if (!attachmentFile) errors.push('请上传派单附件');

      if (errors.length > 0) {
        UI.toast(errors[0], 'warning');
        return;
      }

      // 如果行业有变化，更新客户信息
      if (industry !== customer.industry) {
        Store.update(this.COLLECTION, customerId, { industry });
      }

      // 存储派单记录
      Store.create('dispatches', {
        customerId,
        customerName: customer.name,
        industry,
        intendedProducts: intendedProducts.join(','),
        competitors: competitors.join(','),
        department: dept,
        storeCount,
        customerNeed: need,
        needMatch,
        onlineTime,
        budget,
        kp,
        salesChannels: salesChannels.join(','),
        storeProperties: storeProperties.join(','),
        purchaseTypes: purchaseTypes.join(','),
        flowType,
        validReason: flowType === '有效线索' ? validReason : '',
        contactId,
        bizLine,
        contactPhone: content.querySelector('#dispatch-contactPhone').value,
        visitTime,
        address,
        remark,
        attachmentName: attachmentFile ? attachmentFile.name : '',
      });

      UI.toast('派单成功');
      close();
    });
  },

  init() {
    Router.register('#/customers', () => { this._currentSea = 'os'; this.renderList(); });
    Router.register('#/customers/os', () => { this._currentSea = 'os'; this.renderList(); });
    Router.register('#/customers/is', () => { this._currentSea = 'is'; this.renderList(); });
    Router.register('#/customers/ls', () => { this._currentSea = 'ls'; this.renderList(); });
    Router.register('#/customers/view/:id', ({ id }) => this.renderDetail(id));
    Router.register('#/customers/order/:id', ({ id }) => this._renderOrderPage(id));
  }
};
