/* ============================================
   CRM 系统 - 资源流转规则模块
   ============================================ */
const Rules = {
  COLLECTION: 'ruleConfigs',
  _activeTabIdx: 0,

  // 初始化种子数据
  _ensureSeedData() {
    if (Store.getAll(this.COLLECTION).length > 0) return;

    const seeds = [
      // ===== 线索 - 容量规则 =====
      { entityType: 'lead', ruleType: 'capacity', productLine: ['全部'], privateCapacity: 50, applicableBusinessLines: ['全部'], applicableTeam: ['市场部-SDR'], isActive: true },
      { entityType: 'lead', ruleType: 'capacity', productLine: ['零售SaaS'], privateCapacity: 40, applicableBusinessLines: ['上海营销中心'], applicableTeam: ['区域销售部'], isActive: true },
      { entityType: 'lead', ruleType: 'capacity', productLine: ['智慧零售'], privateCapacity: 30, applicableBusinessLines: ['深圳营销中心'], applicableTeam: ['区域销售部'], isActive: true },
      { entityType: 'lead', ruleType: 'capacity', productLine: ['新零售'], privateCapacity: 60, applicableBusinessLines: ['北京营销中心'], applicableTeam: ['区域销售部'], isActive: false },
      // ===== 线索 - 掉保规则 =====
      { entityType: 'lead', ruleType: 'drop', productLine: ['全部'], dropRule: '超21天未转客户自动掉保', applicableBusinessLines: ['全部'], applicableTeam: ['市场部-SDR'], isActive: true },
      { entityType: 'lead', ruleType: 'drop', productLine: ['零售SaaS'], dropRule: '超21天未转客户自动掉保', applicableBusinessLines: ['上海营销中心'], applicableTeam: ['区域销售部'], isActive: true },
      { entityType: 'lead', ruleType: 'drop', productLine: ['智慧零售'], dropRule: '超15天未跟进自动掉保', applicableBusinessLines: ['深圳营销中心'], applicableTeam: ['区域销售部'], isActive: false },
      // ===== 客户 - 容量规则 =====
      { entityType: 'customer', ruleType: 'capacity', applicableObject: ['全部'], productLine: ['全部'], privateCapacity: 100, applicableBusinessLines: ['全部'], applicableTeam: ['大客户部'], isActive: true },
      { entityType: 'customer', ruleType: 'capacity', applicableObject: ['IS私海', 'OS私海'], productLine: ['零售SaaS'], privateCapacity: 80, applicableBusinessLines: ['上海营销中心'], applicableTeam: ['区域销售部'], isActive: true },
      { entityType: 'customer', ruleType: 'capacity', applicableObject: ['IS私海', '零售私海'], productLine: ['智慧零售'], privateCapacity: 120, applicableBusinessLines: ['深圳营销中心'], applicableTeam: ['区域销售部'], isActive: true },
      { entityType: 'customer', ruleType: 'capacity', applicableObject: ['OS私海'], productLine: ['智慧商超'], privateCapacity: 60, applicableBusinessLines: ['杭州营销中心'], applicableTeam: ['区域销售部'], isActive: false },
      // ===== 客户 - 掉保规则 =====
      { entityType: 'customer', ruleType: 'drop', applicableObject: ['全部'], customerSource: ['派单客户', '自拓客户'], productLine: ['全部'], dropConditions: [{ type: 'noDeal', days: 90 }, { type: 'noOpportunity', days: 60 }], dropRule: '超90天未成单掉保 / 超60天未创建商机掉保', applicableBusinessLines: ['全部'], applicableTeam: ['大客户部'], isActive: true },
      { entityType: 'customer', ruleType: 'drop', applicableObject: ['IS私海', 'OS私海'], customerSource: ['派单客户'], productLine: ['零售SaaS'], dropConditions: [{ type: 'noDeal', days: 90 }], dropRule: '超90天未成单掉保', applicableBusinessLines: ['上海营销中心'], applicableTeam: ['区域销售部'], isActive: true },
      { entityType: 'customer', ruleType: 'drop', applicableObject: ['IS私海', '零售私海'], customerSource: ['自拓客户'], productLine: ['智慧零售'], dropConditions: [{ type: 'noVisit', days: 15 }, { type: 'noOpportunity', days: 60 }], dropRule: '超15天未拜访掉保 / 超60天未创建商机掉保', applicableBusinessLines: ['深圳营销中心'], applicableTeam: ['区域销售部'], isActive: true },
      { entityType: 'customer', ruleType: 'drop', applicableObject: ['OS私海'], customerSource: ['派单客户', '自拓客户'], productLine: ['新零售'], dropConditions: [{ type: 'noOpportunity', days: 45 }], dropRule: '超45天未创建商机掉保', applicableBusinessLines: ['北京营销中心'], applicableTeam: ['区域销售部'], isActive: false },
      // ===== 商机 - 跟进规则 =====
      { entityType: 'opportunity', ruleType: 'followup', opportunityStage: '需求待确认阶段', stageProbability: '10%', followupRule: '超7天未跟进自动掉保', applicableTeam: ['区域销售部'], isActive: true },
      { entityType: 'opportunity', ruleType: 'followup', opportunityStage: '方案认可阶段', stageProbability: '50%', followupRule: '超15天未跟进自动掉保', applicableTeam: ['区域销售部'], isActive: true },
      { entityType: 'opportunity', ruleType: 'followup', opportunityStage: '确定合作阶段', stageProbability: '70%', followupRule: '超30天未跟进自动掉保', applicableTeam: ['大客户部'], isActive: true },
      // ===== 商机 - 审批规则 =====
      { entityType: 'opportunity', ruleType: 'approval', opportunityStage: '合同签约阶段', stageProbability: '90%', requiresApproval: '是', applicableTeam: ['大客户部'], isActive: true },
      { entityType: 'opportunity', ruleType: 'approval', opportunityStage: '赢单阶段', stageProbability: '100%', requiresApproval: '是', applicableTeam: ['大客户部'], isActive: true },
      { entityType: 'opportunity', ruleType: 'approval', opportunityStage: '需求确认阶段', stageProbability: '30%', requiresApproval: '否', applicableTeam: ['区域销售部'], isActive: false },
      // ===== 商机 - 保护机制 =====
      { entityType: 'opportunity', ruleType: 'protection', opportunityStage: '方案认可阶段', stageProbability: '50%', protectionScope: '高阶段商机保护', applicableTeam: ['区域销售部'], isActive: true },
      { entityType: 'opportunity', ruleType: 'protection', opportunityStage: '确定合作阶段', stageProbability: '70%', protectionScope: '高阶段商机保护', applicableTeam: ['大客户部'], isActive: true },
    ];
    seeds.forEach(s => Store.create(this.COLLECTION, s));
  },

  renderList() {
    this._ensureSeedData();

    UI.setPageTitle('资源流转规则', [{ label: '规则管理', hash: '#/rules' }, { label: '资源流转规则' }]);

    const el = document.createElement('div');
    el.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <h2 class="page-title">资源流转规则</h2>
          <p class="page-subtitle">配置线索、客户在不同产品线下容量规则和掉保规则</p>
        </div>
      </div>
      <div id="rules-content"></div>
    `;

    const content = el.querySelector('#rules-content');
    const tabContainer = document.createElement('div');
    content.appendChild(tabContainer);

    // 记住之前激活的 tab 索引
    const prevIdx = this._activeTabIdx;

    const tabsInstance = Components.Tabs([
      {
        label: '线索规则',
        render: () => this._renderRulesTable('lead'),
      },
      {
        label: '客户规则',
        render: () => this._renderRulesTable('customer'),
      },
      {
        label: '商机规则',
        render: () => this._renderOpportunityRules(),
      },
    ], tabContainer);

    // 跟踪 tab 切换
    tabContainer.addEventListener('click', (e) => {
      const tabItem = e.target.closest('.tab-item');
      if (tabItem) {
        this._activeTabIdx = parseInt(tabItem.dataset.tab);
      }
    });

    // 重新切换到之前激活的 tab
    if (prevIdx > 0) {
      tabsInstance.switchTo(prevIdx);
    }

    UI.render(el);
  },

  _renderRulesTable(entityType) {
    const container = document.createElement('div');
    container.style.cssText = 'padding-top: var(--space-4); display: flex; flex-direction: column; gap: var(--space-4);';

    const capacityData = Store.query(this.COLLECTION, r => r.entityType === entityType && r.ruleType === 'capacity');
    const dropData = Store.query(this.COLLECTION, r => r.entityType === entityType && r.ruleType === 'drop');

    const entityLabel = entityType === 'lead' ? '线索' : '客户';

    // 容量规则表格
    const capacityColumns = [
      { key: 'productLine', label: '产品线', width: '120px', render: v => {
        if (Array.isArray(v)) { const t = Helpers.escapeHtml(v.join(', ')); const tt = Helpers.escapeHtml(v.join('、')); return `<span title="${tt}">${t}</span>`; }
        return Helpers.escapeHtml(v || '-');
      }},
      { key: 'privateCapacity', label: '私海容量', width: '100px', render: v => `<strong>${v}</strong>` },
      ...(entityType === 'customer' ? [{ key: 'applicableObject', label: '适用对象', width: '100px', render: v => {
        if (Array.isArray(v)) { const t = Helpers.escapeHtml(v.join(', ')); const tt = Helpers.escapeHtml(v.join('、')); return `<span title="${tt}">${t}</span>`; }
        return Helpers.escapeHtml(v || '-');
      }}] : []),
      { key: 'applicableBusinessLines', label: '适用业务线', render: v => {
        if (Array.isArray(v)) { const t = Helpers.escapeHtml(v.join(', ')); const tt = Helpers.escapeHtml(v.join('、')); return `<span title="${tt}">${t}</span>`; }
        return Helpers.escapeHtml(v || '-');
      }},
      { key: 'applicableTeam', label: '适用团队', width: '100px', render: v => {
        if (Array.isArray(v)) { const t = Helpers.escapeHtml(v.join(', ')); const tt = Helpers.escapeHtml(v.join('、')); return `<span title="${tt}">${t}</span>`; }
        return Helpers.escapeHtml(v || '-');
      }},
      { key: 'isActive', label: '是否生效', width: '90px', render: v => v ? '<span style="color:var(--success);font-weight:600">✓ 生效</span>' : '<span style="color:var(--text-muted)">✗ 未生效</span>' },
    ];
    const capacityTable = Components.DataTable({
      columns: capacityColumns,
      data: capacityData,
      emptyText: '暂无容量规则配置',
      showPagination: false,
      actions: {
        onEdit: (id) => this._showForm(entityType, 'capacity', id),
        onDelete: (id) => this._handleDelete(id, entityType),
      },
    });

    // 容量规则卡片包装
    const capacityCard = document.createElement('div');
    capacityCard.className = 'card';
    const capacityHeader = document.createElement('div');
    capacityHeader.className = 'card-header';
    capacityHeader.innerHTML = `<h3 class="card-title">容量规则</h3>
      <button class="btn btn-primary btn-sm" id="btn-add-capacity-${entityType}"><svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> 新建</button>`;
    capacityCard.appendChild(capacityHeader);
    capacityCard.appendChild(capacityTable);

    // 掉保规则表格
    const dropColumns = [
      { key: 'productLine', label: '产品线', width: '120px', render: v => {
        if (Array.isArray(v)) { const t = Helpers.escapeHtml(v.join(', ')); const tt = Helpers.escapeHtml(v.join('、')); return `<span title="${tt}">${t}</span>`; }
        return Helpers.escapeHtml(v || '-');
      }},
      { key: 'dropRule', label: '掉保规则', render: v => Helpers.escapeHtml(v || '-') },
      ...(entityType === 'customer' ? [{ key: 'applicableObject', label: '适用对象', width: '100px', render: v => {
        if (Array.isArray(v)) { const t = Helpers.escapeHtml(v.join(', ')); const tt = Helpers.escapeHtml(v.join('、')); return `<span title="${tt}">${t}</span>`; }
        return Helpers.escapeHtml(v || '-');
      }}] : []),
      ...(entityType === 'customer' ? [{ key: 'customerSource', label: '客户来源', width: '100px', render: v => {
        if (Array.isArray(v)) { const t = Helpers.escapeHtml(v.join(', ')); const tt = Helpers.escapeHtml(v.join('、')); return `<span title="${tt}">${t}</span>`; }
        return Helpers.escapeHtml(v || '-');
      }}] : []),
      { key: 'applicableBusinessLines', label: '适用业务线', render: v => {
        if (Array.isArray(v)) { const t = Helpers.escapeHtml(v.join(', ')); const tt = Helpers.escapeHtml(v.join('、')); return `<span title="${tt}">${t}</span>`; }
        return Helpers.escapeHtml(v || '-');
      }},
      { key: 'applicableTeam', label: '适用团队', width: '100px', render: v => {
        if (Array.isArray(v)) { const t = Helpers.escapeHtml(v.join(', ')); const tt = Helpers.escapeHtml(v.join('、')); return `<span title="${tt}">${t}</span>`; }
        return Helpers.escapeHtml(v || '-');
      }},
      { key: 'isActive', label: '是否生效', width: '90px', render: v => v ? '<span style="color:var(--success);font-weight:600">✓ 生效</span>' : '<span style="color:var(--text-muted)">✗ 未生效</span>' },
    ];
    const dropTable = Components.DataTable({
      columns: dropColumns,
      data: dropData,
      emptyText: '暂无掉保规则配置',
      showPagination: false,
      actions: {
        onEdit: (id) => this._showForm(entityType, 'drop', id),
        onDelete: (id) => this._handleDelete(id, entityType),
      },
    });

    const dropCard = document.createElement('div');
    dropCard.className = 'card';
    const dropHeader = document.createElement('div');
    dropHeader.className = 'card-header';
    dropHeader.innerHTML = `<h3 class="card-title">掉保规则</h3>
      <button class="btn btn-primary btn-sm" id="btn-add-drop-${entityType}"><svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> 新建</button>`;
    dropCard.appendChild(dropHeader);
    dropCard.appendChild(dropTable);

    container.appendChild(capacityCard);
    container.appendChild(dropCard);

    // 事件绑定
    container.querySelector(`#btn-add-capacity-${entityType}`).addEventListener('click', () => this._showForm(entityType, 'capacity'));
    container.querySelector(`#btn-add-drop-${entityType}`).addEventListener('click', () => this._showForm(entityType, 'drop'));

    return container;
  },

  _showForm(entityType, ruleType, id) {
    const isEdit = !!id;
    const data = isEdit ? Store.getById(this.COLLECTION, id) : { entityType, ruleType, isActive: true };

    const productLineOptions = ['全部', '零售SaaS', '智慧零售', '新零售', '智慧商超', '企微小助手', '到店', '视频号', '定制开发', '智慧服务'];
    const businessLineOptions = ['全部', '上海营销中心', '北京营销中心', '深圳营销中心', '广州营销中心', '杭州营销中心', '苏州营销中心', '长沙营销中心'];
    const teamOptions = ['市场部-SDR', '区域销售部', '大客户部'];

    const commonFields = [
      { key: 'productLine', label: '产品线', type: 'multiSelect', required: true, options: productLineOptions },
      { key: 'applicableBusinessLines', label: '适用业务线', type: 'multiSelect', required: true, options: businessLineOptions },
      { key: 'applicableTeam', label: '适用团队', type: 'multiSelect', required: true, options: teamOptions },
      { key: 'isActive', label: '是否生效', type: 'select', required: true, options: [
        { value: true, label: '生效' },
        { value: false, label: '未生效' },
      ]},
    ];

    let typeFields = [];
    if (ruleType === 'capacity') {
      typeFields = [
        { key: 'privateCapacity', label: '私海容量', type: 'number', required: true, placeholder: '例如：50' },
      ];
    } else if (entityType === 'customer') {
      typeFields = [
        { key: 'dropConditions', label: '掉保条件', type: 'dropConditionBuilder', required: true },
      ];
    } else {
      typeFields = [
        { key: 'dropRule', label: '掉保规则', type: 'text', required: true, placeholder: '例如：超21天未转客户自动掉保' },
      ];
    }

    // 客户规则额外字段（容量规则 + 掉保规则）
    const customerFields = entityType === 'customer'
      ? [{ key: 'applicableObject', label: '适用对象', type: 'multiSelect', required: true, options: ['全部', 'IS私海', 'OS私海', '零售私海'] }]
      : [];

    // 客户掉保规则额外字段
    const customerDropFields = entityType === 'customer' && ruleType === 'drop'
      ? [{ key: 'customerSource', label: '客户来源', type: 'multiSelect', required: true, options: ['派单客户', '自拓客户'] }]
      : [];

    // 编辑时回填 isActive 的 value 为 boolean
    if (isEdit && data) {
      data.isActive = !!data.isActive;
    }

    UI.formModal({
      title: isEdit ? '编辑规则' : '新建规则',
      fields: [...typeFields, ...customerFields, ...customerDropFields, ...commonFields],
      data,
      onSubmit: (formData) => {
        formData.isActive = formData.isActive === true || formData.isActive === 'true';
        formData.entityType = entityType;
        formData.ruleType = ruleType;
        if (isEdit) {
          Store.update(this.COLLECTION, id, formData);
          UI.toast('规则已更新');
        } else {
          Store.create(this.COLLECTION, formData);
          UI.toast('规则已创建');
        }
        this.renderList();
      },
    });
  },

  _showOpportunityForm(ruleType, id) {
    const isEdit = !!id;
    const data = isEdit ? Store.getById(this.COLLECTION, id) : { entityType: 'opportunity', ruleType, isActive: true };

    const stageOptions = ['需求待确认阶段', '需求确认阶段', '方案认可阶段', '确定合作阶段', '合同签约阶段', '赢单阶段', '输单阶段'];
    const probabilityOptions = ['10%', '30%', '50%', '70%', '90%', '100%', '0%'];
    const teamOptions = ['市场部-SDR', '区域销售部', '大客户部'];

    const commonFields = [
      { key: 'opportunityStage', label: '商机阶段', type: 'select', required: true, options: stageOptions },
      { key: 'stageProbability', label: '阶段概率', type: 'select', required: true, options: probabilityOptions },
      { key: 'applicableTeam', label: '适用团队', type: 'multiSelect', required: true, options: teamOptions },
      { key: 'isActive', label: '是否生效', type: 'select', required: true, options: [
        { value: true, label: '生效' },
        { value: false, label: '未生效' },
      ]},
    ];

    let typeFields = [];
    if (ruleType === 'followup') {
      typeFields = [
        { key: 'followupRule', label: '跟进规则', type: 'text', required: true, placeholder: '例如：超15天未跟进自动掉保' },
      ];
    } else if (ruleType === 'approval') {
      typeFields = [
        { key: 'requiresApproval', label: '触发审批', type: 'select', required: true, options: ['是', '否'] },
      ];
    } else if (ruleType === 'protection') {
      typeFields = [
        { key: 'protectionScope', label: '保护范围', type: 'select', required: true, options: ['高阶段商机保护', '低阶段商机保护'] },
      ];
    }

    if (isEdit && data) {
      data.isActive = !!data.isActive;
    }

    UI.formModal({
      title: isEdit ? '编辑规则' : '新建规则',
      fields: [...typeFields, ...commonFields],
      data,
      onSubmit: (formData) => {
        formData.isActive = formData.isActive === true || formData.isActive === 'true';
        formData.entityType = 'opportunity';
        formData.ruleType = ruleType;
        if (isEdit) {
          Store.update(this.COLLECTION, id, formData);
          UI.toast('规则已更新');
        } else {
          Store.create(this.COLLECTION, formData);
          UI.toast('规则已创建');
        }
        this.renderList();
      },
    });
  },

  _handleDelete(id, entityType) {
    const item = Store.getById(this.COLLECTION, id);
    if (!item) return;
    const label = item.opportunityStage || (Array.isArray(item.productLine) ? item.productLine.join(', ') : item.productLine) || '';
    UI.confirm({
      title: '删除规则',
      message: `确定要删除「${label}」的规则吗？`,
      type: 'danger',
      confirmText: '确认删除',
      onConfirm: () => {
        Store.delete(this.COLLECTION, id);
        UI.toast('规则已删除');
        this.renderList();
      },
    });
  },

  _renderOpportunityRules() {
    const container = document.createElement('div');
    container.style.cssText = 'padding-top: var(--space-4); display: flex; flex-direction: column; gap: var(--space-4);';

    // ===== 跟进规则 =====
    const followupData = Store.query(this.COLLECTION, r => r.entityType === 'opportunity' && r.ruleType === 'followup');
    const followupColumns = [
      { key: 'opportunityStage', label: '商机阶段', width: '120px', render: v => Helpers.escapeHtml(v || '-') },
      { key: 'stageProbability', label: '阶段概率', width: '100px', render: v => Helpers.escapeHtml(v || '-') },
      { key: 'followupRule', label: '跟进规则', render: v => Helpers.escapeHtml(v || '-') },
      { key: 'applicableTeam', label: '适用团队', width: '120px', render: v => {
        if (Array.isArray(v)) { const t = Helpers.escapeHtml(v.join(', ')); const tt = Helpers.escapeHtml(v.join('、')); return `<span title="${tt}">${t}</span>`; }
        return Helpers.escapeHtml(v || '-');
      }},
      { key: 'isActive', label: '是否生效', width: '90px', render: v => v ? '<span style="color:var(--success);font-weight:600">✓ 生效</span>' : '<span style="color:var(--text-muted)">✗ 未生效</span>' },
    ];
    const followupTable = Components.DataTable({
      columns: followupColumns,
      data: followupData,
      emptyText: '暂无跟进规则配置',
      showPagination: false,
      actions: {
        onEdit: (id) => this._showOpportunityForm('followup', id),
        onDelete: (id) => this._handleDelete(id, 'opportunity'),
      },
    });

    const followupCard = document.createElement('div');
    followupCard.className = 'card';
    const followupHeader = document.createElement('div');
    followupHeader.className = 'card-header';
    followupHeader.innerHTML = `<h3 class="card-title">跟进规则</h3>
      <button class="btn btn-primary btn-sm" id="btn-add-opp-followup"><svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> 新建</button>`;
    followupCard.appendChild(followupHeader);
    followupCard.appendChild(followupTable);

    // ===== 审批规则 =====
    const approvalData = Store.query(this.COLLECTION, r => r.entityType === 'opportunity' && r.ruleType === 'approval');
    const approvalColumns = [
      { key: 'opportunityStage', label: '商机阶段', width: '120px', render: v => Helpers.escapeHtml(v || '-') },
      { key: 'stageProbability', label: '阶段概率', width: '100px', render: v => Helpers.escapeHtml(v || '-') },
      { key: 'requiresApproval', label: '触发审批', width: '100px', render: v => v === '是' ? '<span style="color:var(--warning);font-weight:600">是</span>' : Helpers.escapeHtml(v || '-') },
      { key: 'applicableTeam', label: '适用团队', width: '120px', render: v => {
        if (Array.isArray(v)) { const t = Helpers.escapeHtml(v.join(', ')); const tt = Helpers.escapeHtml(v.join('、')); return `<span title="${tt}">${t}</span>`; }
        return Helpers.escapeHtml(v || '-');
      }},
      { key: 'isActive', label: '是否生效', width: '90px', render: v => v ? '<span style="color:var(--success);font-weight:600">✓ 生效</span>' : '<span style="color:var(--text-muted)">✗ 未生效</span>' },
    ];
    const approvalTable = Components.DataTable({
      columns: approvalColumns,
      data: approvalData,
      emptyText: '暂无审批规则配置',
      showPagination: false,
      actions: {
        onEdit: (id) => this._showOpportunityForm('approval', id),
        onDelete: (id) => this._handleDelete(id, 'opportunity'),
      },
    });

    const approvalCard = document.createElement('div');
    approvalCard.className = 'card';
    const approvalHeader = document.createElement('div');
    approvalHeader.className = 'card-header';
    approvalHeader.innerHTML = `<h3 class="card-title">审批规则</h3>
      <button class="btn btn-primary btn-sm" id="btn-add-opp-approval"><svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> 新建</button>`;
    approvalCard.appendChild(approvalHeader);
    approvalCard.appendChild(approvalTable);

    // ===== 保护机制 =====
    const protectionData = Store.query(this.COLLECTION, r => r.entityType === 'opportunity' && r.ruleType === 'protection');
    const protectionColumns = [
      { key: 'opportunityStage', label: '商机阶段', width: '120px', render: v => Helpers.escapeHtml(v || '-') },
      { key: 'stageProbability', label: '阶段概率', width: '100px', render: v => Helpers.escapeHtml(v || '-') },
      { key: 'protectionScope', label: '保护范围', render: v => Helpers.escapeHtml(v || '-') },
      { key: 'applicableTeam', label: '适用团队', width: '120px', render: v => {
        if (Array.isArray(v)) { const t = Helpers.escapeHtml(v.join(', ')); const tt = Helpers.escapeHtml(v.join('、')); return `<span title="${tt}">${t}</span>`; }
        return Helpers.escapeHtml(v || '-');
      }},
      { key: 'isActive', label: '是否生效', width: '90px', render: v => v ? '<span style="color:var(--success);font-weight:600">✓ 生效</span>' : '<span style="color:var(--text-muted)">✗ 未生效</span>' },
    ];
    const protectionTable = Components.DataTable({
      columns: protectionColumns,
      data: protectionData,
      emptyText: '暂无保护机制配置',
      showPagination: false,
      actions: {
        onEdit: (id) => this._showOpportunityForm('protection', id),
        onDelete: (id) => this._handleDelete(id, 'opportunity'),
      },
    });

    const protectionCard = document.createElement('div');
    protectionCard.className = 'card';
    const protectionHeader = document.createElement('div');
    protectionHeader.className = 'card-header';
    protectionHeader.innerHTML = `<h3 class="card-title">保护机制</h3>
      <button class="btn btn-primary btn-sm" id="btn-add-opp-protection"><svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> 新建</button>`;
    protectionCard.appendChild(protectionHeader);
    protectionCard.appendChild(protectionTable);

    container.appendChild(followupCard);
    container.appendChild(approvalCard);
    container.appendChild(protectionCard);

    // 事件绑定
    container.querySelector('#btn-add-opp-followup').addEventListener('click', () => this._showOpportunityForm('followup'));
    container.querySelector('#btn-add-opp-approval').addEventListener('click', () => this._showOpportunityForm('approval'));
    container.querySelector('#btn-add-opp-protection').addEventListener('click', () => this._showOpportunityForm('protection'));

    return container;
  },

  init() {
    Router.register('#/rules', () => this.renderList());
  }
};
