/* ============================================
   CRM 系统 - 商机管理模块
   ============================================ */
const Opportunities = {
  COLLECTION: 'opportunities',

  STAGES: ['需求待确认', '需求确认', '方案认可', '确定合作', '合同签约', '赢单', '输单'],
  STAGE_PROB: { '需求待确认': 10, '需求确认': 30, '方案认可': 50, '确定合作': 70, '合同签约': 90, '赢单': 100, '输单': 0 },
  STAGE_TYPE: { '需求待确认': 'primary', '需求确认': 'info', '方案认可': 'warning', '确定合作': 'warning', '合同签约': 'info', '赢单': 'success', '输单': 'danger' },
  DATA_VALIDITY_TYPE: { '有效': 'success', '未生效': 'warning', '已作废': 'danger' },
  STAGE_DURATION: { '需求待确认': 4, '需求确认': 7, '方案认可': 7, '确定合作': 5, '合同签约': 3, '赢单': 0, '输单': 0 },

  FIELDS: [
    { key: 'name', label: '商机名称', type: 'text', required: true, placeholder: '如：XX公司ERP项目' },
    { key: 'customerId', label: '客户名称', type: 'select', required: true, options: [] },
    { key: 'brandName', label: '品牌名', type: 'text', required: true, placeholder: '品牌名称' },
    { key: 'source', label: '商机来源', type: 'select', required: true, options: ['推广', '自拓'], default: '自拓' },
    { key: 'purchaseType', label: '采购类型', type: 'select', required: true, options: ['新开', '续约', '增购', '增值'], default: '新开' },
    { key: 'customerNeed', label: '客户需求', type: 'textarea', required: true, fullWidth: true, placeholder: '详细描述客户的核心诉求、痛点或采购目标', rows: 3 },
    { key: 'stage', label: '商机阶段', type: 'select', required: true, options: ['需求待确认', '需求确认', '方案认可', '确定合作', '合同签约', '赢单', '输单'], default: '需求待确认' },
    { key: 'intendedProduct', label: '意向产品', type: 'multiSelect', required: true, options: ['微商城', '智慧零售', '智慧购百', '智慧商超', '智慧生鲜', '批发商城', '本地生活', '视频号营销助手', '智慧零售宠物行业', '智慧门店', '微盟星启', '智慧美业', '智慧服务', '企微助手', '企微小助手'], placeholder: '请选择意向产品' },
    { key: 'expectedCloseDate', label: '预计成交时间', type: 'date', required: true },
    { key: 'amount', label: '预计成交金额（元）', type: 'number', required: true, step: '0.01', min: 0, placeholder: '0.00' },
    { key: 'keyAction', label: '本月关键动作', type: 'text', required: true, placeholder: '本月关键动作' },
    { key: 'keyActionDate', label: '关键动作日期', type: 'date', required: true },
    { key: 'remark', label: '备注', type: 'textarea', fullWidth: true, placeholder: '备注信息...' },
    { key: 'attachment', label: '附件', type: 'file', fullWidth: true, accept: '.pdf,.jpg,.jpeg,.png,.docx', maxSize: 10 },
    { key: 'contactId', label: '关联客户联系人', type: 'select', required: true, options: [], placeholder: '请选择联系人' },
  ],

  _getFields(customerId) {
    const customers = Store.getAll('customers').filter(c => c.poolStatus !== 'in_pool' && c.poolStatus !== 'pending_review').map(c => ({ value: c.id, label: c.name }));
    const fields = this.FIELDS.map(f => {
      if (f.key === 'customerId') {
        return { ...f, options: customers, default: customerId || '' };
      }
      if (f.key === 'contactId') {
        const contacts = customerId ? Store.query('contacts', c => c.customerId === customerId).map(c => ({ value: c.id, label: c.name + (c.position ? ` (${c.position})` : '') })) : [];
        return { ...f, options: contacts };
      }
      return f;
    });
    return fields;
  },

  _sidebarEl: null,
  _sidebarOverlay: null,
  _currentSidebarId: null,

  openSidebar(id) {
    const item = Store.getById(this.COLLECTION, id);
    if (!item) return;
    this._currentSidebarId = id;

    const customer = Store.getById('customers', item.customerId);
    const isActive = item.stage !== '赢单' && item.stage !== '输单';
    const followups = Store.query('followups', f => f.relatedType === 'opportunity' && f.relatedId === id);

    // 创建或复用侧边栏 DOM
    if (!this._sidebarEl) {
      this._sidebarOverlay = document.createElement('div');
      this._sidebarOverlay.className = 'opp-sidebar-overlay';
      this._sidebarEl = document.createElement('div');
      this._sidebarEl.className = 'opp-sidebar';
      document.body.appendChild(this._sidebarOverlay);
      document.body.appendChild(this._sidebarEl);

      // 点击遮罩关闭
      this._sidebarOverlay.addEventListener('click', () => this.closeSidebar());
    }

    // 计算商机停留超期标识
    let overdueHtml = '';
    if (item.stage !== '赢单' && item.stage !== '输单') {
      let stageChangedAt;
      if (item.stageChangedAt) {
        stageChangedAt = new Date(item.stageChangedAt);
      } else {
        // 从跟进记录中查找最近一次阶段变更
        const stageFollowups = followups.filter(f => f.content && f.content.includes('商机阶段推进至'));
        stageChangedAt = stageFollowups.length > 0 ? new Date(stageFollowups[0].createdAt) : new Date(item.createdAt);
      }
      const daysInStage = Math.floor((Date.now() - stageChangedAt.getTime()) / (1000 * 60 * 60 * 24));
      const expectedDuration = this.STAGE_DURATION[item.stage] || 14;
      if (daysInStage > expectedDuration) {
        overdueHtml = `<span class="opp-overdue-badge">⏱ 超期${daysInStage - expectedDuration}天</span>`;
      }
    }

    // 联系人信息
    const contacts = Store.query('contacts', c => c.customerId === item.customerId);
    let contactHtml = '';
    const contactIcon = '<svg viewBox="0 0 24 24" style="stroke:currentColor;fill:none;stroke-width:2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>';
    if (contacts.length > 0) {
      const contactListHtml = contacts.map(c => {
        const primaryBadge = c.isPrimary === true || c.isPrimary === 'true' ? '<span class="badge badge-primary" style="margin-left:4px;font-size:10px">主要</span>' : '';
        return `<div class="opp-contact-item">
          <div class="opp-contact-name">${Helpers.escapeHtml(c.name)}${primaryBadge}</div>
          <div class="opp-contact-detail">
            ${c.title ? `<span class="opp-contact-field"><span class="opp-info-label">职位</span> ${Helpers.escapeHtml(c.title)}</span>` : '<span class="opp-contact-field"><span class="opp-info-label">职位</span> -</span>'}
            ${c.phone ? `<span class="opp-contact-field"><span class="opp-info-label">电话</span> <a href="tel:${c.phone}">${Helpers.escapeHtml(c.phone)}</a></span>` : '<span class="opp-contact-field"><span class="opp-info-label">电话</span> -</span>'}
          </div>
        </div>`;
      }).join('');
      contactHtml = `<div class="opp-sidebar-section">
        <div class="opp-sidebar-section-title">${contactIcon} 联系人信息</div>
        <div class="opp-contact-list">${contactListHtml}</div>
      </div>`;
    } else {
      contactHtml = `<div class="opp-sidebar-section">
        <div class="opp-sidebar-section-title">${contactIcon} 联系人信息</div>
        <div class="opp-sidebar-empty">
          <div class="opp-sidebar-empty-icon">👤</div>
          <div class="opp-sidebar-empty-text">暂无联系人信息</div>
        </div>
      </div>`;
    }

    // 阶段进度条
    let stageBarHtml = '';
    if (item.stage !== '输单') {
      const stages = this.STAGES.filter(s => s !== '输单');
      const currentIdx = stages.indexOf(item.stage);
      stageBarHtml = `<div class="opp-sidebar-section">
        <div class="opp-sidebar-section-title"><svg viewBox="0 0 24 24" style="stroke:currentColor;fill:none;stroke-width:2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> 商机阶段</div>
        <div class="stage-pipeline">
          ${stages.map((s, i) => {
            let cls = '';
            if (s === '赢单' && item.stage === '赢单') cls = 'won';
            else if (i < currentIdx) cls = 'completed';
            else if (i === currentIdx) cls = 'current';
            return `<div class="stage-step ${cls}" data-sidebar-stage="${s}" title="${s} (${this.STAGE_PROB[s]}%)">${s}</div>`;
          }).join('')}
        </div>
      </div>`;
    }

    // 跟进记录
    let followupHtml = '';
    if (followups.length > 0) {
      const timelineHtml = followups.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(f => `
        <div class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-time">${Helpers.formatDateTime(f.createdAt)}</div>
          <div class="timeline-content">${f.type ? `<span class="timeline-type">${Helpers.escapeHtml(f.type)}</span>` : ''}${Helpers.escapeHtml(f.content)}</div>
        </div>
      `).join('');
      followupHtml = `<div class="opp-sidebar-section">
        <div class="opp-sidebar-section-title"><svg viewBox="0 0 24 24" style="stroke:currentColor;fill:none;stroke-width:2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> 跟进记录 (${followups.length})</div>
        <div class="timeline">${timelineHtml}</div>
      </div>`;
    } else {
      followupHtml = `<div class="opp-sidebar-section">
        <div class="opp-sidebar-section-title"><svg viewBox="0 0 24 24" style="stroke:currentColor;fill:none;stroke-width:2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> 跟进记录</div>
        <div class="opp-sidebar-empty">
          <div class="opp-sidebar-empty-icon">📝</div>
          <div class="opp-sidebar-empty-text">暂无跟进记录，点击"写跟进"添加</div>
        </div>
      </div>`;
    }

    // 填充侧边栏 HTML
    this._sidebarEl.innerHTML = `
      <div class="opp-sidebar-header">
        <div class="opp-sidebar-title-area">
          <div class="opp-sidebar-title">${Helpers.escapeHtml(item.name)}</div>
          <div class="opp-sidebar-subtitle">
            ${Components.Badge(item.stage, this.STAGE_TYPE[item.stage] || 'gray')}
            ${Components.Badge(item.dataValidity || '未生效', this.DATA_VALIDITY_TYPE[item.dataValidity || '未生效'] || 'gray')}
            ${overdueHtml}
            <span style="font-size:var(--text-lg);font-weight:700;color:var(--primary)">${Helpers.formatMoney(item.amount)}</span>
          </div>
        </div>
        <button class="opp-sidebar-close" id="opp-sidebar-close" title="关闭">
          <svg viewBox="0 0 24 24" style="stroke:currentColor;fill:none;stroke-width:2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <div class="opp-sidebar-actions">
        <button class="btn btn-outline-primary btn-sm" id="sidebar-btn-followup" title="写跟进"><svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> 写跟进</button>
        <button class="btn btn-secondary btn-sm" id="sidebar-btn-edit" title="编辑"><svg viewBox="0 0 24 24" style="width:14px;height:14px">${UI.icons.edit}</svg> 编辑</button>
        ${isActive ? `<button class="btn btn-success btn-sm" id="sidebar-btn-win" title="标记赢单"><svg viewBox="0 0 24 24" style="width:14px;height:14px">${UI.icons.check}</svg> 赢单</button>` : ''}
        <button class="btn btn-secondary btn-sm" id="sidebar-btn-detail" title="查看完整详情">详情页 <svg viewBox="0 0 24 24" style="width:12px;height:12px;stroke:currentColor;fill:none;stroke-width:2"><polyline points="9 18 15 12 9 6"/></svg></button>
      </div>

      <div class="opp-sidebar-body">
        <!-- 基本信息 -->
        <div class="opp-sidebar-section">
          <div class="opp-sidebar-section-title"><svg viewBox="0 0 24 24" style="stroke:currentColor;fill:none;stroke-width:2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg> 基本信息</div>
          <div class="opp-info-grid">
            <div class="opp-info-item">
              <span class="opp-info-label">客户名称</span>
              <span class="opp-info-value">${customer ? Helpers.escapeHtml(customer.name) : '-'}</span>
            </div>
            <div class="opp-info-item">
              <span class="opp-info-label">品牌名</span>
              <span class="opp-info-value">${item.brandName ? Helpers.escapeHtml(item.brandName) : '-'}</span>
            </div>
            <div class="opp-info-item">
              <span class="opp-info-label">意向产品</span>
              <span class="opp-info-value">${item.intendedProduct ? Helpers.escapeHtml(item.intendedProduct) : '-'}</span>
            </div>
            <div class="opp-info-item">
              <span class="opp-info-label">预计金额</span>
              <span class="opp-info-value" style="color:var(--primary);font-weight:700">${Helpers.formatMoney(item.amount)}</span>
            </div>
            <div class="opp-info-item">
              <span class="opp-info-label">预估成交时间</span>
              <span class="opp-info-value">${Helpers.formatDate(item.expectedCloseDate)}</span>
            </div>
            <div class="opp-info-item">
              <span class="opp-info-label">销售归属人</span>
              <span class="opp-info-value">${item.assignee ? Helpers.escapeHtml(item.assignee) : '-'}</span>
            </div>
            <div class="opp-info-item">
              <span class="opp-info-label">商机来源</span>
              <span class="opp-info-value">${item.source ? Helpers.escapeHtml(item.source) : '-'}</span>
            </div>
            <div class="opp-info-item">
              <span class="opp-info-label">创建时间</span>
              <span class="opp-info-value">${Helpers.formatDateTime(item.createdAt)}</span>
            </div>
          </div>
        </div>

        <!-- 联系人信息 -->
        ${contactHtml}

        <!-- 商机阶段 -->
        ${stageBarHtml}

        <!-- 跟进记录 -->
        ${followupHtml}
      </div>

      <div class="opp-sidebar-footer">
        <button class="btn btn-danger btn-sm" id="sidebar-btn-delete"><svg viewBox="0 0 24 24" style="width:14px;height:14px">${UI.icons.trash}</svg> 删除</button>
      </div>
    `;

    // 绑定事件
    this._sidebarEl.querySelector('#opp-sidebar-close').addEventListener('click', () => this.closeSidebar());
    this._sidebarEl.querySelector('#sidebar-btn-followup')?.addEventListener('click', () => {
      this.closeSidebar();
      this.handleFollowUp(id);
    });
    this._sidebarEl.querySelector('#sidebar-btn-edit')?.addEventListener('click', () => {
      this.closeSidebar();
      this.showForm(id);
    });
    this._sidebarEl.querySelector('#sidebar-btn-win')?.addEventListener('click', () => {
      this.closeSidebar();
      this.handleWin(id);
    });
    this._sidebarEl.querySelector('#sidebar-btn-detail')?.addEventListener('click', () => {
      this.closeSidebar();
      Router.navigate(`#/opportunities/view/${id}`);
    });
    this._sidebarEl.querySelector('#sidebar-btn-delete')?.addEventListener('click', () => {
      this.closeSidebar();
      this.handleDelete(id);
    });

    // 阶段步骤点击（仅活跃商机）
    if (isActive) {
      this._sidebarEl.querySelectorAll('[data-sidebar-stage]').forEach(step => {
        step.addEventListener('click', () => {
          const newStage = step.dataset.sidebarStage;
          if (newStage === item.stage) return;
          if (newStage === '赢单') {
            this.closeSidebar();
            this.handleWin(id);
          } else {
            Store.update(this.COLLECTION, id, {
              stage: newStage,
              probability: String(this.STAGE_PROB[newStage] || item.probability),
              stageChangedAt: Helpers.now()
            });
            Store.create('followups', {
              relatedType: 'opportunity',
              relatedId: id,
              type: '其他',
              content: `商机阶段推进至「${newStage}」`,
            });
            UI.toast(`阶段已更新为「${newStage}」`);
            // 刷新侧边栏
            this.openSidebar(id);
          }
        });
      });
    }

    // 展开动画
    requestAnimationFrame(() => {
      this._sidebarOverlay.classList.add('visible');
      this._sidebarEl.classList.add('open');
    });
  },

  closeSidebar() {
    if (!this._sidebarEl) return;
    this._sidebarOverlay?.classList.remove('visible');
    this._sidebarEl.classList.remove('open');
    this._currentSidebarId = null;
  },

  renderList(stageFilter) {
    UI.setPageTitle('商机管理');
    const allData = Store.getAll(this.COLLECTION).filter(o => o.poolStatus !== 'in_pool');
    const data = stageFilter ? allData.filter(d => d.stage === stageFilter) : allData;

    const el = document.createElement('div');

    // 计算汇总
    const activeOpps = allData.filter(o => o.stage !== '赢单' && o.stage !== '输单');
    const totalAmount = activeOpps.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
    const wonAmount = allData.filter(o => o.stage === '赢单').reduce((sum, o) => sum + (Number(o.amount) || 0), 0);

    // ===== 商机简报 =====
    const computeBriefStats = (items) => {
      const stats = { total: { count: items.length, amount: items.reduce((sum, o) => sum + (Number(o.amount) || 0), 0) } };
      this.STAGES.forEach(stage => {
        const stageItems = items.filter(o => o.stage === stage);
        stats[stage] = {
          count: stageItems.length,
          amount: stageItems.reduce((sum, o) => sum + (Number(o.amount) || 0), 0),
        };
      });
      return stats;
    };

    const renderBriefStatsHtml = (stats) => {
      const fmtAmt = (amt) => {
        if (amt == null || isNaN(amt)) return '¥0';
        if (amt >= 10000) return '¥' + (amt / 10000).toFixed(1) + 'W';
        return '¥' + Number(amt).toLocaleString('zh-CN', { maximumFractionDigits: 0 });
      };
      let html = `<span class="opp-brief-pill opp-brief-pill-total">总量（${stats.total.count}，${fmtAmt(stats.total.amount)}）</span>`;
      this.STAGES.forEach(stage => {
        const s = stats[stage];
        const type = this.STAGE_TYPE[stage] || 'gray';
        html += `<span class="opp-brief-pill opp-brief-pill-${type}">${stage}（${s.count}，${fmtAmt(s.amount)}）</span>`;
      });
      return html;
    };

    // 构建工具栏按钮（无）

    // 筛选字段
    const filterFields = [
      { key: 'name', label: '商机名称', type: 'text', placeholder: '请输入商机名称' },
      { key: 'salesOwner', label: '销售归属', type: 'text', placeholder: '请输入销售姓名', customFilter: (item, val) => {
        if (!val) return true;
        const customer = Store.getById('customers', item.customerId);
        return customer && customer.assignee && customer.assignee.toLowerCase().includes(val.toLowerCase());
      }},
      { key: 'purchaseType', label: '采购类型', type: 'select', placeholder: '请选择', options: ['新开', '续约', '增购', '增值'] },
      { key: 'stage', label: '商机阶段', type: 'select', placeholder: '请选择', options: ['需求待确认', '需求确认', '方案认可', '确定合作', '合同签约', '赢单', '输单'] },
      { key: 'expectedCloseDate', label: '预计时间', type: 'dateRange', periodOptions: ['本月', '下月'] },
      { key: 'createdAt', label: '创建时间', type: 'dateRange', periodOptions: ['本月', '下月'] },
    ];

    // 初始数据
    const initialStats = computeBriefStats(data);

    // 商机简报 HTML（作为 DataTable 的 toolbarSlot）
    const briefSlot = `<div class="opp-brief"><div class="opp-brief-stats" id="brief-stats">${renderBriefStatsHtml(initialStats)}</div></div>`;

    const table = Components.DataTable({
      columns: [
        { key: 'name', label: '商机名称', sortable: true, render: (v, item) => `<span class="cell-link" data-id="${item.id}">${Helpers.escapeHtml(v || '')}</span>` },
        { key: 'customerId', label: '客户名称', render: v => { const c = Store.getById('customers', v); return c ? `<span class="cell-link" data-customer="${v}">${Helpers.escapeHtml(c.name)}</span>` : '-'; }},
        { key: 'brandName', label: '品牌名', width: '90px', render: v => v ? `<span class="cell-brand">${Helpers.escapeHtml(v)}</span>` : '-' },
        { key: 'intendedProduct', label: '意向产品', width: '120px', render: v => v ? Helpers.escapeHtml(v) : '-' },
        { key: 'purchaseType', label: '采购类型', width: '80px', render: v => v ? Components.Badge(v, v === '新开' ? 'primary' : v === '续约' ? 'info' : v === '增购' ? 'warning' : 'success') : '-' },
        { key: 'dataValidity', label: '数据有效性', width: '100px', render: v => Components.Badge(v || '未生效', Opportunities.DATA_VALIDITY_TYPE[v || '未生效'] || 'gray') },
        { key: 'stage', label: '商机阶段', width: '110px', render: v => {
          const prob = Opportunities.STAGE_PROB[v];
          const badge = Components.Badge(v, Opportunities.STAGE_TYPE[v] || 'gray');
          return prob != null ? `${badge}<span style="font-size:var(--text-xs);color:var(--text-muted);margin-left:4px">${prob}%</span>` : badge;
        }},
        { key: 'amount', label: '预估金额', width: '120px', sortable: true, render: v => `<strong>${Helpers.formatMoney(v)}</strong>` },
        { key: 'oppSource', label: '商机类型', width: '90px', render: v => v ? Components.Badge(v, v === '派单商机' ? 'primary' : 'info') : '-' },
        { key: 'expectedCloseDate', label: '预计成交', width: '100px', sortable: true, render: v => Helpers.formatDate(v) },
        { key: 'stageStayDays', label: '停留天数', width: '80px', sortable: true, render: (v, item) => {
          let stageChangedAt;
          if (item.stageChangedAt) { stageChangedAt = new Date(item.stageChangedAt); }
          else { stageChangedAt = new Date(item.createdAt); }
          const days = Math.floor((Date.now() - stageChangedAt.getTime()) / (1000 * 60 * 60 * 24));
          return `${days}天`;
        }},
        { key: 'stageChangedAt', label: '阶段变更时间', width: '130px', sortable: true, render: (v, item) => {
          if (item.stageChangedAt) return Helpers.formatDateTime(item.stageChangedAt);
          return Helpers.formatDateTime(item.createdAt);
        }},
        { key: 'overdueStatus', label: '超期状态', width: '90px', render: (v, item) => {
          if (item.stage === '赢单' || item.stage === '输单') return '-';
          let stageChangedAt;
          if (item.stageChangedAt) { stageChangedAt = new Date(item.stageChangedAt); }
          else { stageChangedAt = new Date(item.createdAt); }
          const days = Math.floor((Date.now() - stageChangedAt.getTime()) / (1000 * 60 * 60 * 24));
          const expectedDuration = Opportunities.STAGE_DURATION[item.stage] || 7;
          if (days > expectedDuration) {
            return `<span class="pool-badge danger">超期${days - expectedDuration}天</span>`;
          }
          return '<span style="color:var(--success);font-size:var(--text-xs)">正常</span>';
        }},
        { key: 'salesOwner', label: '销售归属人', width: '90px', render: (v, item) => {
          const customer = Store.getById('customers', item.customerId);
          return customer && customer.assignee ? Helpers.escapeHtml(customer.assignee) : '-';
        }},
      ],
      data: data,
      filterFields,
      toolbarSlot: briefSlot,
      actions: {
        onFollowUp: (id) => this.handleFollowUp(id),
        onEdit: (id) => this.showForm(id),
        onMore: (id) => this.handleMore(id),
        onDelete: (id) => this.handleDelete(id),
      },
      onRowClick: null,
      sortKey: 'createdAt',
      showPagination: true,
    });

    el.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <h2 class="page-title">商机管理</h2>
          <p class="page-subtitle">进行中商机 ${activeOpps.length} 个，总金额 ${Helpers.formatMoneyShort(totalAmount)}，已赢单 ${Helpers.formatMoneyShort(wonAmount)} <span style="color:var(--warning);margin-left:8px">⚠ 商机阶段达70%、90%、100%时需直属上级审核，审核后客户和商机均不会再掉保</span></p>
        </div>
        <div class="page-header-right">
          <button class="btn btn-primary" id="btn-add"><svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> 新建商机</button>
          <button class="btn btn-secondary" id="btn-export"><svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> 导出</button>
        </div>
      </div>
      <div id="table-container"></div>`;

    el.querySelector('#table-container').appendChild(table);

    // 商机简报已通过 toolbarSlot 插入，无需手动插入

    el.querySelector('#btn-add')?.addEventListener('click', () => this.showForm());
    el.querySelector('#btn-export')?.addEventListener('click', () => {
      UI.toast('导出功能开发中', 'info');
    });
    el.addEventListener('click', (e) => {
      const link = e.target.closest('.cell-link[data-id]');
      if (link) { e.stopPropagation(); this.openSidebar(link.dataset.id); }
      const custLink = e.target.closest('[data-customer]');
      if (custLink) { e.stopPropagation(); Router.navigate(`#/customers/view/${custLink.dataset.customer}`); }
    });

    UI.render(el);
  },

  renderDetail(id) {
    const item = Store.getById(this.COLLECTION, id);
    if (!item) { UI.toast('商机不存在', 'error'); Router.navigate('#/opportunities'); return; }

    const customer = Store.getById('customers', item.customerId);
    const isActive = item.stage !== '赢单' && item.stage !== '输单';

    UI.setPageTitle(item.name, [{ label: '商机管理', hash: '#/opportunities' }, { label: item.name }]);

    const el = document.createElement('div');
    el.innerHTML = `
      <div class="detail-header">
        <div class="detail-header-left">
          <div class="detail-avatar" style="background:${item.stage === '赢单' ? 'var(--success-light)' : item.stage === '输单' ? 'var(--danger-light)' : 'var(--primary-lighter)'};color:${item.stage === '赢单' ? 'var(--success)' : item.stage === '输单' ? 'var(--danger)' : 'var(--primary)'}">${UI.icons.opportunities}</div>
          <div>
            <h2 class="detail-name">${Helpers.escapeHtml(item.name)}</h2>
            <div class="detail-meta">
              ${customer ? `<a href="#/customers/view/${customer.id}">${Helpers.escapeHtml(customer.name)}</a>` : ''}
              ${Components.Badge(item.stage, this.STAGE_TYPE[item.stage] || 'gray')}
              <strong style="color:var(--primary)">${Helpers.formatMoney(item.amount)}</strong>
            </div>
          </div>
        </div>
        <div class="detail-actions">
          ${isActive ? `<button class="btn btn-success" id="btn-win"><svg viewBox="0 0 24 24">${UI.icons.check}</svg> 标记赢单</button>` : ''}
          ${isActive ? `<button class="btn btn-secondary" id="btn-lose" style="color:var(--danger)">标记输单</button>` : ''}
          ${item.stage === '赢单' && item.convertedOrderId ? `<button class="btn btn-secondary" id="btn-view-order"><svg viewBox="0 0 24 24">${UI.icons.orders}</svg> 查看订单</button>` : ''}
          <button class="btn btn-secondary" id="btn-edit"><svg viewBox="0 0 24 24">${UI.icons.edit}</svg> 编辑</button>
          <button class="btn btn-secondary" id="btn-delete" style="color:var(--danger)"><svg viewBox="0 0 24 24">${UI.icons.trash}</svg></button>
        </div>
      </div>
    `;

    // 阶段进度条
    if (item.stage !== '输单') {
      const stageBar = document.createElement('div');
      stageBar.className = 'card';
      stageBar.style.padding = 'var(--space-4) var(--space-5)';
      stageBar.style.marginBottom = 'var(--space-4)';
      const stages = this.STAGES.filter(s => s !== '输单');
      const currentIdx = stages.indexOf(item.stage);

      stageBar.innerHTML = `
        <div style="font-size:var(--text-xs);color:var(--text-muted);margin-bottom:var(--space-2)">商机阶段</div>
        <div class="stage-pipeline">
          ${stages.map((s, i) => {
            let cls = '';
            if (s === '赢单' && item.stage === '赢单') cls = 'won';
            else if (i < currentIdx) cls = 'completed';
            else if (i === currentIdx) cls = 'current';
            return `<div class="stage-step ${cls}" data-stage="${s}" title="${s} (${this.STAGE_PROB[s]}%)">${s}</div>`;
          }).join('')}
        </div>
      `;

      // 点击阶段可切换（仅对未完成的商机）
      if (isActive) {
        stageBar.querySelectorAll('.stage-step').forEach(step => {
          step.addEventListener('click', () => {
            const newStage = step.dataset.stage;
            if (newStage === item.stage) return;
            if (newStage === '赢单') {
              this.handleWin(id);
            } else {
              Store.update(this.COLLECTION, id, {
                stage: newStage,
                probability: String(this.STAGE_PROB[newStage]),
                stageChangedAt: Helpers.now()
              });
              Store.create('followups', {
                relatedType: 'opportunity',
                relatedId: id,
                type: '其他',
                content: `商机阶段推进至「${newStage}」`,
              });
              UI.toast(`阶段已更新为「${newStage}」`);
              this.renderDetail(id);
            }
          });
        });
      }

      el.appendChild(stageBar);
    }

    // Tab 内容
    const tabContainer = document.createElement('div');
    el.appendChild(tabContainer);

    Components.Tabs([
      {
        label: '基本信息',
        render: () => `<div class="card">${Components.DetailCard([
          { key: 'name', label: '商机名称' },
          { key: 'customerId', label: '关联客户', render: v => { const c = Store.getById('customers', v); return c ? `<a href="#/customers/view/${c.id}">${Helpers.escapeHtml(c.name)}</a>` : '-'; }},
          { key: 'stage', label: '当前阶段', render: v => Components.Badge(v, Opportunities.STAGE_TYPE[v] || 'gray') },
          { key: 'amount', label: '预估金额', render: v => Helpers.formatMoney(v) },
          { key: 'probability', label: '成交概率', render: v => v ? `${v}%` : '-' },
          { key: 'expectedCloseDate', label: '预计成交日期', render: v => Helpers.formatDate(v) },
          { key: 'assignee', label: '负责人' },
          { key: 'remark', label: '备注' },
          { key: 'createdAt', label: '创建时间', render: v => Helpers.formatDateTime(v) },
        ], item)}</div>`
      },
      {
        label: '跟进记录',
        render: () => {
          const followups = Store.query('followups', f => f.relatedType === 'opportunity' && f.relatedId === id);
          return FollowUps.renderTimeline(followups, 'opportunity', id);
        }
      }
    ], tabContainer);

    // 事件
    el.querySelector('#btn-edit')?.addEventListener('click', () => this.showForm(id));
    el.querySelector('#btn-delete')?.addEventListener('click', () => this.handleDelete(id));
    el.querySelector('#btn-win')?.addEventListener('click', () => this.handleWin(id));
    el.querySelector('#btn-lose')?.addEventListener('click', () => {
      UI.confirm({
        title: '标记输单',
        message: '确认将此商机标记为输单？',
        type: 'warning',
        confirmText: '确认输单',
        onConfirm: () => {
          Store.update(this.COLLECTION, id, { stage: '输单', probability: '0', stageChangedAt: Helpers.now() });
          Store.create('followups', { relatedType: 'opportunity', relatedId: id, type: '其他', content: '商机标记为输单' });
          UI.toast('商机已标记为输单');
          this.renderDetail(id);
        }
      });
    });
    el.querySelector('#btn-view-order')?.addEventListener('click', () => {
      Router.navigate(`#/orders/view/${item.convertedOrderId}`);
    });

    UI.render(el);
  },

  // 嵌入客户详情的子列表
  renderSubList(opps, customerId) {
    const el = document.createElement('div');
    if (opps.length === 0) {
      el.innerHTML = `
        <div class="table-empty" style="padding:var(--space-8)">
          <div class="empty-icon">💰</div>
          <div class="empty-text">暂无商机</div>
          <button class="btn btn-primary btn-sm" id="btn-add-opp"><svg viewBox="0 0 24 24">${UI.icons.plus}</svg> 新建商机</button>
        </div>
      `;
    } else {
      const rows = opps.map(o => `<tr style="cursor:pointer" data-opp-id="${o.id}">
        <td><strong>${Helpers.escapeHtml(o.name)}</strong></td>
        <td>${Components.Badge(o.stage, Opportunities.STAGE_TYPE[o.stage] || 'gray')}</td>
        <td><strong>${Helpers.formatMoney(o.amount)}</strong></td>
        <td>${Helpers.formatDate(o.expectedCloseDate)}</td>
      </tr>`).join('');

      el.innerHTML = `
        <div style="display:flex;justify-content:flex-end;margin-bottom:var(--space-3)">
          <button class="btn btn-primary btn-sm" id="btn-add-opp"><svg viewBox="0 0 24 24">${UI.icons.plus}</svg> 新建商机</button>
        </div>
        <div class="card"><div class="table-wrapper"><table class="data-table">
          <thead><tr><th>商机名称</th><th>阶段</th><th>金额</th><th>预计成交</th></tr></thead>
          <tbody>${rows}</tbody>
        </table></div></div>
      `;
    }

    el.querySelector('#btn-add-opp')?.addEventListener('click', () => this.showForm(null, customerId));
    el.querySelectorAll('[data-opp-id]').forEach(tr => {
      tr.addEventListener('click', () => Router.navigate(`#/opportunities/view/${tr.dataset.oppId}`));
    });
    return el;
  },

  // 需要审批的高阶段
  _APPROVAL_STAGES: ['确定合作', '合同签约', '赢单'],

  showForm(id, customerId) {
    const isEdit = !!id;
    const data = isEdit ? Store.getById(this.COLLECTION, id) : (customerId ? { customerId } : {});
    const fields = this._getFields(customerId || (isEdit ? data.customerId : null));

    const { overlay, close } = UI.formModal({
      title: isEdit ? '编辑商机' : '新建商机',
      fields,
      data,
      size: 'lg',
      onSubmit: (formData) => {
        if (customerId) formData.customerId = customerId;
        // 根据阶段自动设置成交概率
        if (formData.stage && this.STAGE_PROB[formData.stage] != null) {
          formData.probability = String(this.STAGE_PROB[formData.stage]);
        }
        // 意向产品多选转逗号分隔存储
        if (Array.isArray(formData.intendedProduct)) {
          formData.intendedProduct = formData.intendedProduct.join(',');
        }
        // 阶段变更时记录时间
        if (isEdit) {
          const old = Store.getById(this.COLLECTION, id);
          if (old && old.stage !== formData.stage) {
            formData.stageChangedAt = Helpers.now();
          }
        }
        if (isEdit) {
          Store.update(this.COLLECTION, id, formData);
          UI.toast('商机已更新');
        } else {
          Store.create(this.COLLECTION, formData);
          UI.toast('商机已创建');
        }
        const route = Router.current();
        if (route && route.hash.includes('/customers/view/')) Customers.renderDetail(customerId || formData.customerId);
        else if (route && route.hash.includes('/opportunities/view/')) this.renderDetail(id);
        else this.renderList();
      }
    });

    // 客户名称变更时联动加载联系人
    const customerSelect = overlay.querySelector('[name="customerId"]');
    const contactSelect = overlay.querySelector('[name="contactId"]');
    if (customerSelect && contactSelect) {
      customerSelect.addEventListener('change', () => {
        const cId = customerSelect.value;
        const contacts = cId ? Store.query('contacts', c => c.customerId === cId) : [];
        const optsHtml = '<option value="">请选择联系人</option>' + contacts.map(c => `<option value="${c.id}">${Helpers.escapeHtml(c.name)}${c.position ? ` (${Helpers.escapeHtml(c.position)})` : ''}</option>`).join('');
        contactSelect.innerHTML = optsHtml;
      });
    }

    // 监听阶段选择，高阶段时弹出提示
    const stageSelect = overlay.querySelector('[name="stage"]');
    if (stageSelect) {
      stageSelect.addEventListener('change', () => {
        const selectedStage = stageSelect.value;
        if (this._APPROVAL_STAGES.includes(selectedStage)) {
          const prob = this.STAGE_PROB[selectedStage];
          UI.toast(`将进入商机审批流，由直属上级审批后，对应客户和商机将不会掉保（${selectedStage} ${prob}%）`, 'warning', 5000);
        }
      });
      // 编辑时如果已是高阶段，也提示
      if (data.stage && this._APPROVAL_STAGES.includes(data.stage)) {
        const prob = this.STAGE_PROB[data.stage];
        UI.toast(`当前商机阶段为「${data.stage}」(${prob}%)，已进入审批流，由直属上级审批后对应客户和商机将不会掉保`, 'warning', 5000);
      }
    }
  },

  handleWin(id) {
    const opp = Store.getById(this.COLLECTION, id);
    if (!opp) return;

    // 弹出订单创建表单
    const products = Store.getAll('products').filter(p => p.status === '在售');

    const contentEl = document.createElement('div');
    contentEl.innerHTML = `
      <div class="convert-preview">
        <h4>商机信息</h4>
        <div class="convert-field"><span class="label">商机</span><span class="value">${Helpers.escapeHtml(opp.name)}</span></div>
        <div class="convert-field"><span class="label">金额</span><span class="value" style="color:var(--primary);font-weight:700">${Helpers.formatMoney(opp.amount)}</span></div>
      </div>
      <h4 style="margin-bottom:var(--space-3);font-size:var(--text-sm);font-weight:600;color:var(--text-secondary)">订单明细</h4>
      <div id="order-items">
        <table class="order-items-table">
          <thead><tr><th>产品</th><th>数量</th><th>单价</th><th>小计</th><th class="item-row-actions"></th></tr></thead>
          <tbody id="order-items-body"></tbody>
        </table>
        <button class="btn btn-secondary btn-sm" id="btn-add-item" style="margin-top:var(--space-2)"><svg viewBox="0 0 24 24">${UI.icons.plus}</svg> 添加产品</button>
      </div>
      <div class="order-total" id="order-total">合计：¥0.00</div>
      <div class="form-grid" style="margin-top:var(--space-4)">
        <div class="form-group full-width">
          <label class="form-label">备注</label>
          <textarea class="form-textarea" id="order-remark" rows="2" placeholder="订单备注..."></textarea>
        </div>
      </div>
    `;

    const footer = `
      <button class="btn btn-secondary" data-close-modal>取消</button>
      <button class="btn btn-success" id="confirm-win"><svg viewBox="0 0 24 24">${UI.icons.check}</svg> 确认赢单并创建订单</button>
    `;

    const { overlay, close } = UI.modal({ title: '赢单 - 创建订单', content: contentEl, footer, size: 'lg' });

    const orderItems = [];

    function addItemRow() {
      const idx = orderItems.length;
      orderItems.push({ productId: '', productName: '', quantity: 1, unitPrice: 0, subtotal: 0 });

      const options = products.map(p => `<option value="${p.id}" data-price="${p.price}" data-name="${Helpers.escapeHtml(p.name)}">${Helpers.escapeHtml(p.name)} (${Helpers.formatMoney(p.price)}/${p.unit || '个'})</option>`).join('');

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><select class="form-select item-product" data-idx="${idx}"><option value="">选择产品</option>${options}</select></td>
        <td><input type="number" class="form-input item-qty" data-idx="${idx}" value="1" min="1" style="width:70px"></td>
        <td><input type="number" class="form-input item-price" data-idx="${idx}" value="0" step="0.01" style="width:100px"></td>
        <td class="item-subtotal" data-idx="${idx}">¥0.00</td>
        <td class="item-row-actions"><button class="action-btn danger item-remove" data-idx="${idx}"><svg viewBox="0 0 24 24">${UI.icons.close}</svg></button></td>
      `;
      overlay.querySelector('#order-items-body').appendChild(tr);
    }

    function updateTotal() {
      let total = 0;
      orderItems.forEach((item, i) => {
        item.subtotal = (item.quantity || 0) * (item.unitPrice || 0);
        total += item.subtotal;
        const cell = overlay.querySelector(`.item-subtotal[data-idx="${i}"]`);
        if (cell) cell.textContent = Helpers.formatMoney(item.subtotal);
      });
      overlay.querySelector('#order-total').textContent = `合计：${Helpers.formatMoney(total)}`;
    }

    // 事件代理
    overlay.querySelector('#order-items').addEventListener('change', (e) => {
      const idx = parseInt(e.target.dataset.idx);
      if (e.target.classList.contains('item-product')) {
        const opt = e.target.selectedOptions[0];
        orderItems[idx].productId = e.target.value;
        orderItems[idx].productName = opt?.dataset?.name || '';
        orderItems[idx].unitPrice = parseFloat(opt?.dataset?.price) || 0;
        const priceInput = overlay.querySelector(`.item-price[data-idx="${idx}"]`);
        if (priceInput) priceInput.value = orderItems[idx].unitPrice;
        updateTotal();
      }
    });

    overlay.querySelector('#order-items').addEventListener('input', (e) => {
      const idx = parseInt(e.target.dataset.idx);
      if (e.target.classList.contains('item-qty')) {
        orderItems[idx].quantity = parseInt(e.target.value) || 0;
        updateTotal();
      } else if (e.target.classList.contains('item-price')) {
        orderItems[idx].unitPrice = parseFloat(e.target.value) || 0;
        updateTotal();
      }
    });

    overlay.querySelector('#order-items').addEventListener('click', (e) => {
      const btn = e.target.closest('.item-remove');
      if (btn) {
        const idx = parseInt(btn.dataset.idx);
        orderItems.splice(idx, 1);
        // 重新渲染
        overlay.querySelector('#order-items-body').innerHTML = '';
        const saved = [...orderItems];
        orderItems.length = 0;
        saved.forEach(() => addItemRow());
        // 恢复数据
        saved.forEach((item, i) => {
          orderItems[i] = item;
          const prodSelect = overlay.querySelector(`.item-product[data-idx="${i}"]`);
          if (prodSelect) prodSelect.value = item.productId;
          const qtyInput = overlay.querySelector(`.item-qty[data-idx="${i}"]`);
          if (qtyInput) qtyInput.value = item.quantity;
          const priceInput = overlay.querySelector(`.item-price[data-idx="${i}"]`);
          if (priceInput) priceInput.value = item.unitPrice;
        });
        updateTotal();
      }
    });

    overlay.querySelector('#btn-add-item').addEventListener('click', addItemRow);

    // 默认添加一行
    addItemRow();

    // 确认
    overlay.querySelector('#confirm-win').addEventListener('click', () => {
      const validItems = orderItems.filter(i => i.productId && i.quantity > 0);
      const totalAmount = validItems.reduce((sum, i) => sum + i.subtotal, 0);
      const remark = overlay.querySelector('#order-remark').value.trim();

      // 创建订单
      const order = Store.create('orders', {
        orderNo: Helpers.generateOrderNo(),
        customerId: opp.customerId,
        opportunityId: id,
        items: validItems,
        totalAmount,
        status: '待确认',
        remark,
      });

      // 更新商机
      Store.update(this.COLLECTION, id, {
        stage: '赢单',
        probability: '100',
        convertedOrderId: order.id,
        stageChangedAt: Helpers.now()
      });

      // 跟进记录
      Store.create('followups', {
        relatedType: 'opportunity',
        relatedId: id,
        type: '其他',
        content: `商机赢单，创建订单 ${order.orderNo}，金额 ${Helpers.formatMoney(totalAmount)}`,
      });

      close();
      UI.toast('恭喜！商机已赢单，订单已创建');
      EventBus.emit('opportunity:won', { opportunityId: id, orderId: order.id });
      Router.navigate(`#/orders/view/${order.id}`);
    });
  },

  handleFollowUp(id) {
    const opp = Store.getById(this.COLLECTION, id);
    if (!opp) return;

    const followFields = [
      { key: 'type', label: '跟进方式', type: 'select', required: true, options: ['电话', '拜访', '邮件', '微信', '会议', '其他'], default: '电话' },
      { key: 'content', label: '跟进内容', type: 'textarea', required: true, fullWidth: true, placeholder: '记录跟进详情...', rows: 4 },
      { key: 'nextFollowDate', label: '下次跟进日期', type: 'date' },
    ];

    UI.formModal({
      title: `写跟进 - ${opp.name}`,
      fields: followFields,
      size: 'sm',
      onSubmit: (formData) => {
        formData.relatedType = 'opportunity';
        formData.relatedId = id;
        Store.create('followups', formData);
        UI.toast('跟进记录已添加');
      }
    });
  },

  handleMore(id) {
    this.openSidebar(id);
  },

  handleDelete(id) {
    const item = Store.getById(this.COLLECTION, id);
    if (!item) return;
    UI.confirm({
      title: '删除商机',
      message: `确定要删除商机「${item.name}」吗？`,
      type: 'danger',
      confirmText: '确认删除',
      onConfirm: () => {
        Store.delete(this.COLLECTION, id);
        UI.toast('商机已删除');
        Router.navigate('#/opportunities');
      }
    });
  },

  init() {
    Router.register('#/opportunities', () => this.renderList());
    Router.register('#/opportunities/view/:id', ({ id }) => this.renderDetail(id));
  }
};
