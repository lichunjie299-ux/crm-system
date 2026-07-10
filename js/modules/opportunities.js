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

  // 产品版本映射：每个解决方案对应的可选版本
  PRODUCT_EDITIONS: {
    '微商城': ['基础版', '标准版', '专业版', '豪华版', '旗舰版'],
    '智慧零售': ['基础版', '标准版', '专业版', '旗舰版'],
    '智慧购百': ['标准版', '专业版', '旗舰版'],
    '智慧商超': ['标准版', '专业版', '旗舰版'],
    '智慧生鲜': ['标准版', '专业版'],
    '批发商城': ['标准版', '专业版', '豪华版'],
    '本地生活': ['标准版', '专业版', '旗舰版'],
    '视频号营销助手': ['基础版', '专业版'],
    '智慧零售宠物行业': ['标准版', '专业版'],
    '智慧门店': ['标准版', '专业版', '旗舰版'],
    '微盟星启': ['标准版', '专业版', '旗舰版'],
    '智慧美业': ['标准版', '专业版', '豪华版'],
    '智慧服务': ['标准版', '专业版', '企业版'],
    '企微助手': ['基础版', '标准版', '专业版'],
    '企微小助手': ['标准版', '专业版'],
  },

  // 获取产品展示名（含版本）
  _getProductDisplayName(p) {
    return p.edition ? p.product + '-' + p.edition : p.product;
  },

  // 智能推荐底座缓存（按商机ID存储，不修改商机字段）
  _smartRecCache: new Map(),

  // 获取智能推荐产品列表（优先从缓存读取）
  _getSmartRecProducts(item) {
    if (this._smartRecCache.has(item.id)) {
      return this._smartRecCache.get(item.id);
    }
    // 首次打开侧边栏时，从商机意向产品初始化缓存
    const products = Array.isArray(item.intendedProducts) ? item.intendedProducts : (item.intendedProduct ? [{ product: item.intendedProduct, amount: item.amount }] : []);
    this._smartRecCache.set(item.id, products);
    return products;
  },

  // 获取完整的智能推荐数据（含底座、理由、话术、竞对策略、案例）
  _getSmartRecData(item) {
    const cacheKey = 'smartRecFull_' + item.id;
    if (this._smartRecCache.has(cacheKey)) {
      return this._smartRecCache.get(cacheKey);
    }
    const products = this._getSmartRecProducts(item);
    const productNames = products.map(p => p.product).filter(Boolean);

    // 生成推荐理由
    const reasons = {
      '微商城': '该客户有线上商城需求，微商城可快速搭建品牌独立商城，支持多端覆盖',
      '智慧零售': '客户存在全渠道零售场景，智慧零售提供线上线下融合解决方案',
      '智慧购百': '客户业态为购物百货，智慧购百可提升坪效及会员粘性',
      '智慧商超': '客户经营商超业态，智慧商超覆盖进销存全链路管理',
      '智慧生鲜': '生鲜品类需精准库存管理，智慧生鲜支持批次追踪和效期预警',
      '批发商城': '客户有B2B批发业务需求，批发商城支持多级经销商管理',
      '本地生活': '客户需要本地化运营能力，本地生活覆盖社区周边商圈',
      '视频号营销助手': '客户寻求视频号流量变现，视频号营销助手打通直播带货闭环',
      '智慧零售宠物行业': '宠物行业垂直解决方案，覆盖活体销售到洗护服务的全流程',
      '智慧门店': '门店数字化升级需求，智慧门店提供智能收银与会员营销',
      '微盟星启': '初创及成长型企业首选，微盟星启提供轻量级数字化工具',
      '智慧美业': '美业垂直场景，智慧美业支持预约管理及会员精细化运营',
      '智慧服务': '服务型行业需求，智慧服务覆盖工单管理与服务履约',
      '企微助手': '客户使用企微进行客户运营，企微助手增强SCRM能力',
      '企微小助手': '中小型企业企微运营轻量方案，低成本快速上手',
    };

    const baseInfo = products.map(p => ({
      name: this._getProductDisplayName(p),
      reason: reasons[p.product] || '该产品可满足客户当前业务场景需求',
    }));

    // 生成销售话术和竞对策略（基于客户行业和产品）
    const customer = Store.getById('customers', item.customerId);
    const industry = customer ? (customer.industry || '未知行业') : '未知行业';
    const primaryProduct = productNames[0] || '智慧零售';

    const salesScripts = [
      '核心价值：' + (reasons[primaryProduct] || '为客户提供行业领先的数字化解决方案') + '，帮助客户实现业绩增长',
      '痛点切入：针对' + industry + '行业普遍存在的获客难、转化低、复购弱等问题，提供端到端的解决方案',
      '差异化：我司产品在数据打通、多端协同方面具有明显优势，支持私有化部署保障数据安全',
    ];

    const competitorStrategies = [
      { competitor: '有赞', strategy: '强调微盟在智慧零售全链路能力上的覆盖优势，特别是线上线下打通能力' },
      { competitor: '微店', strategy: '突出企业级服务能力，微盟提供更完善的售后支持和定制化服务' },
      { competitor: '有竞品-凡科', strategy: '对比功能完整度和行业解决方案深度，微盟更专注零售行业' },
      { competitor: '小鹅通', strategy: '强调CRM+商城一体化的优势，不仅仅是知识付费工具' },
    ];

    // 生成优秀案例
    const caseStudies = [
      {
        title: '林清轩·智慧零售转型',
        desc: '借助智慧零售+微商城组合，实现线上线下一体化运营，会员复购率提升45%',
        result: '年GMV增长300%',
      },
      {
        title: '联想来酷·全渠道数字化',
        desc: '通过智慧门店+企微助手，实现门店智能化和会员精细化管理',
        result: '客户留存率提升35%',
      },
      {
        title: '来伊份·私域生态建设',
        desc: '微商城+企微助手组合方案，打通小程序、社群、直播多渠道',
        result: '私域GMV占比达28%',
      },
    ];

    const data = { baseInfo, salesScripts, competitorStrategies, caseStudies };
    this._smartRecCache.set(cacheKey, data);
    return data;
  },

  // 构建智能推荐模块 HTML - 紧凑型子标签切换
  _buildSmartRecSection(item) {
    const data = this._getSmartRecData(item);
    const { baseInfo, salesScripts, competitorStrategies, caseStudies } = data;
    const customer = Store.getById('customers', item.customerId);
    const industry = customer ? (customer.industry || '未知行业') : '未知行业';

    const baseHtml = baseInfo.map(b => `
      <div style="padding:6px 0;border-bottom:1px solid var(--border-light)">
        <div style="font-weight:600;font-size:12px;color:var(--primary)">${Helpers.escapeHtml(b.name)}</div>
        <div style="font-size:11px;color:var(--text-secondary);margin-top:2px;line-height:1.4">${Helpers.escapeHtml(b.reason)}</div>
      </div>
    `).join('') || '<div style="font-size:11px;color:var(--text-muted);padding:8px 0">暂无推荐底座</div>';

    const scriptHtml = salesScripts.map(s => `
      <div style="padding:5px 0;font-size:11px;color:var(--text-secondary);line-height:1.4;border-bottom:1px solid var(--border-light)">${Helpers.escapeHtml(s)}</div>
    `).join('');

    const competitorHtml = competitorStrategies.map(c => `
      <div style="display:flex;gap:6px;padding:6px 0;border-bottom:1px solid var(--border-light)">
        <span style="flex-shrink:0;padding:1px 6px;background:var(--gray-100);border-radius:3px;font-size:10px;font-weight:600;color:var(--text-primary);height:fit-content">${Helpers.escapeHtml(c.competitor)}</span>
        <span style="font-size:11px;color:var(--text-secondary);line-height:1.4">${Helpers.escapeHtml(c.strategy)}</span>
      </div>
    `).join('') || '<div style="font-size:11px;color:var(--text-muted);padding:8px 0">暂无竞对策略</div>';

    const caseHtml = caseStudies.map(cs => `
      <div style="padding:6px 0;border-bottom:1px solid var(--border-light)">
        <div style="display:flex;align-items:center;justify-content:space-between">
          <span style="font-weight:600;font-size:12px;color:var(--text)">${Helpers.escapeHtml(cs.title)}</span>
          <span style="padding:1px 6px;background:var(--success-light,#d1fae5);border-radius:3px;font-size:10px;color:var(--success,#065f46);font-weight:600;flex-shrink:0">${Helpers.escapeHtml(cs.result)}</span>
        </div>
        <div style="font-size:11px;color:var(--text-secondary);margin-top:2px;line-height:1.4">${Helpers.escapeHtml(cs.desc)}</div>
      </div>
    `).join('') || '<div style="font-size:11px;color:var(--text-muted);padding:8px 0">暂无案例</div>';

    const oppId = item.id;

    return `
      <div class="opp-sidebar-section">
        <div class="opp-sidebar-section-title" style="display:flex;align-items:center">
          <span style="display:flex;align-items:center">
          <svg viewBox="0 0 24 24" style="stroke:currentColor;fill:none;stroke-width:2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          智能推荐
          <span style="display:inline-flex;align-items:center;margin-left:4px;font-size:9px;color:#fff;background:var(--primary);padding:0 5px;border-radius:8px;font-weight:400;cursor:pointer;position:relative;line-height:16px"
                onclick="this.querySelector('.tianshu-tip').style.display=this.querySelector('.tianshu-tip').style.display==='block'?'none':'block';event.stopPropagation()">
            天枢
            <div class="tianshu-tip" style="display:none;position:absolute;top:calc(100% + 6px);left:0;background:#1f2937;color:#fff;font-size:11px;padding:10px 14px;border-radius:6px;max-width:320px;z-index:10;box-shadow:0 2px 8px rgba(0,0,0,0.15);line-height:1.7;pointer-events:none;white-space:normal;text-align:left">
              根据客户需求${Helpers.escapeHtml(item.customerNeed || '-')}、行业${Helpers.escapeHtml(industry)}匹配天枢内的推荐底座、销售话术、竞对策略、优秀案例
            </div>
          </span>
          </span>
          <button class="btn btn-text btn-sm rematch-btn" data-opp-id="${oppId}" style="margin-left:auto;font-size:11px;padding:2px 8px;height:auto;line-height:1.5;color:var(--primary);flex-shrink:0" title="重新匹配推荐内容">
            <svg viewBox="0 0 24 24" style="width:12px;height:12px;stroke:currentColor;fill:none;stroke-width:2;vertical-align:-2px;margin-right:3px"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>重新匹配
          </button>
        </div>

        <!-- 子标签栏 -->
        <div style="display:flex;gap:2px;background:var(--gray-100,#f3f4f6);border-radius:6px;padding:2px;margin-bottom:8px">
          <span class="smart-rec-tab" data-opp="${oppId}" data-tab="base" style="flex:1;text-align:center;padding:4px 0;font-size:11px;font-weight:500;border-radius:5px;cursor:pointer;background:#fff;color:var(--primary);box-shadow:0 1px 2px rgba(0,0,0,0.06)">推荐底座</span>
          <span class="smart-rec-tab" data-opp="${oppId}" data-tab="script" style="flex:1;text-align:center;padding:4px 0;font-size:11px;font-weight:500;border-radius:5px;cursor:pointer;color:var(--text-secondary)">销售话术</span>
          <span class="smart-rec-tab" data-opp="${oppId}" data-tab="competitor" style="flex:1;text-align:center;padding:4px 0;font-size:11px;font-weight:500;border-radius:5px;cursor:pointer;color:var(--text-secondary)">竞对策略</span>
          <span class="smart-rec-tab" data-opp="${oppId}" data-tab="case" style="flex:1;text-align:center;padding:4px 0;font-size:11px;font-weight:500;border-radius:5px;cursor:pointer;color:var(--text-secondary)">优秀案例</span>
        </div>

        <!-- Tab 内容 -->
        <div class="smart-rec-content" data-opp="${oppId}" data-tab="base">
          ${baseHtml}
        </div>
        <div class="smart-rec-content" data-opp="${oppId}" data-tab="script" style="display:none">
          ${scriptHtml}
        </div>
        <div class="smart-rec-content" data-opp="${oppId}" data-tab="competitor" style="display:none">
          ${competitorHtml}
        </div>
        <div class="smart-rec-content" data-opp="${oppId}" data-tab="case" style="display:none">
          ${caseHtml}
        </div>
      </div>
    `;
  },

  FIELDS: [
    { key: 'name', label: '商机名称', type: 'text', required: true, placeholder: '如：XX公司ERP项目' },
    { key: 'customerId', label: '客户名称', type: 'select', required: true, options: [] },
    { key: 'brandName', label: '品牌名', type: 'text', required: true, placeholder: '品牌名称' },
    { key: 'source', label: '商机来源', type: 'select', required: true, options: ['推广', '自拓'], default: '自拓' },
    { key: 'purchaseType', label: '采购类型', type: 'select', required: true, options: ['新开', '续约', '增购', '增值'], default: '新开' },
    { key: 'customerNeed', label: '客户需求', type: 'textarea', required: true, fullWidth: true, placeholder: '详细描述客户的核心诉求、痛点或采购目标', rows: 3 },
    { key: 'stage', label: '商机阶段', type: 'select', required: true, options: ['需求待确认', '需求确认', '方案认可', '确定合作', '合同签约', '赢单', '输单'], default: '需求待确认' },
    { key: 'expectedCloseDate', label: '预计成交时间', type: 'date', required: true },
    { key: 'intendedProducts', label: '意向产品及金额', type: 'productAmountList', required: true, options: ['微商城', '智慧零售', '智慧购百', '智慧商超', '智慧生鲜', '批发商城', '本地生活', '视频号营销助手', '智慧零售宠物行业', '智慧门店', '微盟星启', '智慧美业', '智慧服务', '企微助手', '企微小助手'] },
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
        const primaryBadge = c.isPrimary === true || c.isPrimary === 'true' ? '<span class="badge badge-primary" style="margin-left:4px;font-size:10px">决策人</span>' : '';
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
    } else {
      const loseReason = item.loseReason || item.lostReason || '';
      stageBarHtml = `<div class="opp-sidebar-section">
        <div class="opp-sidebar-section-title"><svg viewBox="0 0 24 24" style="stroke:currentColor;fill:none;stroke-width:2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> 商机阶段</div>
        <div style="display:flex;align-items:center;gap:8px">
          <span class="badge badge-danger" style="font-size:12px;padding:4px 10px;flex-shrink:0">输单</span>
          <span style="font-size:13px;color:#cf1322;line-height:1.5"><strong>输单原因：</strong>${loseReason ? Helpers.escapeHtml(loseReason) : '未填写'}</span>
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
            <span style="margin-left:8px;font-weight:700;color:var(--primary)">${Helpers.formatMoney(item.amount)}</span>
          </div>
        </div>
        <button class="opp-sidebar-close" id="opp-sidebar-close" title="关闭">
          <svg viewBox="0 0 24 24" style="stroke:currentColor;fill:none;stroke-width:2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <div class="opp-sidebar-actions">
        <button class="btn btn-outline-primary btn-sm" id="sidebar-btn-followup" title="写跟进"><svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> 写跟进</button>
        <button class="btn btn-secondary btn-sm" id="sidebar-btn-edit" title="编辑"><svg viewBox="0 0 24 24" style="width:14px;height:14px">${UI.icons.edit}</svg> 编辑</button>
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
              <span class="opp-info-value">${(() => {
                const products = Array.isArray(item.intendedProducts) ? item.intendedProducts : (item.intendedProduct ? [{ product: item.intendedProduct, amount: item.amount }] : []);
                return products.length > 0 ? products.map(p => `<span style="display:block;line-height:1.6">${Helpers.escapeHtml(Opportunities._getProductDisplayName(p))} <span style="color:var(--text-secondary);font-weight:400">${Helpers.formatMoney(p.amount)}</span></span>`).join('') : '-';
              })()}</span>
            </div>
            <div class="opp-info-item">
              <span class="opp-info-label">预计总额</span>
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

        <!-- 智能推荐 -->
        ${Opportunities._buildSmartRecSection(item)}
      </div>

      <div class="opp-sidebar-footer">
        <button class="btn btn-danger btn-sm" id="sidebar-btn-delete"><svg viewBox="0 0 24 24" style="width:14px;height:14px">${UI.icons.trash}</svg> 作废</button>
      </div>
    `;

    // 已作废的商机隐藏作废按钮
    if (item.dataValidity === '已作废') {
      const delBtn = this._sidebarEl.querySelector('#sidebar-btn-delete');
      if (delBtn) delBtn.style.display = 'none';
    }

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
    this._sidebarEl.querySelector('#sidebar-btn-detail')?.addEventListener('click', () => {
      this.closeSidebar();
      Router.navigate(`#/opportunities/view/${id}`);
    });
    this._sidebarEl.querySelector('#sidebar-btn-delete')?.addEventListener('click', () => {
      this.closeSidebar();
      this.handleDelete(id);
    });

    // 智能推荐子标签切换
    this._sidebarEl.querySelectorAll('.smart-rec-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.stopPropagation();
        const targetTab = tab.dataset.tab;
        tab.parentElement.querySelectorAll('.smart-rec-tab').forEach(t => {
          t.style.background = '';
          t.style.color = 'var(--text-secondary)';
          t.style.boxShadow = 'none';
        });
        tab.style.background = '#fff';
        tab.style.color = 'var(--primary)';
        tab.style.boxShadow = '0 1px 2px rgba(0,0,0,0.06)';
        tab.closest('.opp-sidebar-section')?.querySelectorAll('.smart-rec-content').forEach(c => {
          c.style.display = c.dataset.tab === targetTab ? '' : 'none';
        });
      });
    });

    // 重新匹配按钮
    const rematchBtn = this._sidebarEl.querySelector('.rematch-btn');
    if (rematchBtn) {
      rematchBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const oppId = e.currentTarget.dataset.oppId;
        const item = Store.getById(this.COLLECTION, oppId);
        if (!item) return;
        this._smartRecCache.delete(oppId);
        this._smartRecCache.delete('smartRecFull_' + oppId);
        const section = e.currentTarget.closest('.opp-sidebar-section');
        if (section) {
          section.outerHTML = Opportunities._buildSmartRecSection(item);
        }
      });
    }

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

      // 口径说明
      const tooltipDefs = {
        '整体': '你及下属名下客户的有效商机总量（数量+金额）',
        '需求待确认': '上述商机中，阶段为「需求待确认」的',
        '需求确认': '上述商机中，阶段为「需求确认」的',
        '方案认可': '上述商机中，阶段为「方案认可」的',
        '确定合作': '上述商机中，阶段为「确定合作」的',
        '合同签约': '上述商机中，阶段为「合同签约」的',
        '赢单': '上述商机中，阶段为「赢单」的',
        '输单': '上述商机中，阶段为「输单」的',
      };

      const globalTip = '统计口径说明：\n\n1. 只看「本人及下属名下客户」的商机。客户不在本人团队手里的，不统计。\n\n2. 自建商机：仅统计创建人是你或下属的。\n   派单商机：同一客户多条派单，仅统计最新一条。\n\n━━━━━━━━━━━━━━━━';

      const buildTip = (label) => {
        const def = tooltipDefs[label] || '';
        return Helpers.escapeHtml(globalTip + '\n\n' + def);
      };

      const cardColors = {
        '整体':      { bg: '#f0f5ff', border: '#adc6ff', color: '#1d39c4' },
        '需求待确认': { bg: '#e6f4ff', border: '#91caff', color: '#1677ff' },
        '需求确认':   { bg: '#e6f4ff', border: '#91caff', color: '#1677ff' },
        '方案认可':   { bg: '#e6f4ff', border: '#91caff', color: '#1677ff' },
        '确定合作':   { bg: '#e6f4ff', border: '#91caff', color: '#1677ff' },
        '合同签约':   { bg: '#e6f4ff', border: '#91caff', color: '#1677ff' },
        '赢单':      { bg: '#f6ffed', border: '#b7eb8f', color: '#389e0d' },
        '输单':      { bg: '#fff2f0', border: '#ffccc7', color: '#cf1322' },
      };

      const buildCard = (label, count, amount) => {
        const c = cardColors[label] || { bg: '#fafafa', border: '#d9d9d9', color: '#666' };
        return `<div style="flex:1;min-width:68px;background:${c.bg};border:1px solid ${c.border};border-radius:5px;padding:5px 6px;text-align:center;cursor:help" title="${buildTip(label)}">
          <div style="font-size:11px;color:var(--text-secondary);margin-bottom:1px;line-height:1.3">${label}</div>
          <div style="font-size:14px;font-weight:700;color:var(--text-primary);line-height:1.2;margin-bottom:1px">${count}</div>
          <div style="font-size:11px;color:var(--text-primary);line-height:1.2">${fmtAmt(amount)}</div>
        </div>`;
      };

      let html = buildCard('整体', stats.total.count, stats.total.amount);
      this.STAGES.forEach(stage => {
        const s = stats[stage];
        html += buildCard(stage, s.count, s.amount);
      });

      return `<div style="display:flex;gap:6px;flex-wrap:wrap">${html}</div>`;
    };

    // 构建工具栏按钮（无）

    // 筛选字段（默认展示4项，其余折叠）
    const filterFields = [
      // --- 默认展示 ---
      { key: 'keyword', label: '商机/客户名称', type: 'text', placeholder: '请输入商机名称或客户名称', customFilter: (item, val) => {
        if (!val) return true;
        const term = val.toLowerCase();
        // 匹配商机名称
        if (item.name && item.name.toLowerCase().includes(term)) return true;
        // 匹配客户名称
        const customer = Store.getById('customers', item.customerId);
        if (customer && customer.name && customer.name.toLowerCase().includes(term)) return true;
        return false;
      }},
      { key: 'salesOwner', label: '销售归属人', type: 'text', placeholder: '请输入销售姓名', customFilter: (item, val) => {
        if (!val) return true;
        const customer = Store.getById('customers', item.customerId);
        return customer && customer.assignee && customer.assignee.toLowerCase().includes(val.toLowerCase());
      }},
      { key: 'stage', label: '商机阶段', type: 'select', placeholder: '请选择', options: ['需求待确认', '需求确认', '方案认可', '确定合作', '合同签约', '赢单', '输单'] },
      { key: 'intendedProduct', label: '意向产品', type: 'text', placeholder: '请输入产品名称', customFilter: (item, val) => {
        if (!val) return true;
        const products = Array.isArray(item.intendedProducts) ? item.intendedProducts : [];
        return products.some(p => p.product && p.product.toLowerCase().includes(val.toLowerCase()));
      }},
      // 时间维度（合并为一个筛选项）
      { key: 'timeRange', label: '时间范围', type: 'timeDimension',
        dimOptions: [
          { key: 'expectedCloseDate', label: '预计成交时间' },
          { key: 'stageChangedAt', label: '阶段变更时间' },
          { key: 'createdAt', label: '创建时间' },
          { key: 'lastFollowupAt', label: '最近跟进时间' },
          { key: 'nextFollowupAt', label: '下次跟进时间' },
        ],
        periodOptions: ['本月', '下月'],
        placeholder: '全部'
      },
      // --- 更多筛选 ---
      { key: 'assignee', label: 'IS归属人', type: 'text', placeholder: '请输入归属人' },
      { key: 'source', label: '商机来源', type: 'select', placeholder: '请选择', options: ['推广', '自拓', '展会', '转介绍', '网站表单', '电话咨询'] },
      { key: 'purchaseType', label: '采购类型', type: 'select', placeholder: '请选择', options: ['新开', '续约', '增购', '增值'] },
      { key: 'lostReason', label: '输单原因', type: 'text', placeholder: '请输入输单原因' },
      { key: 'amount', label: '预计成交金额', type: 'text', placeholder: '最低金额', customFilter: (item, val) => {
        if (!val) return true;
        const minAmount = parseFloat(val);
        if (isNaN(minAmount)) return true;
        return item.amount >= minAmount;
      }},
      { key: 'oppSource', label: '商机类型', type: 'select', placeholder: '请选择', options: ['派单商机', '自建商机'] },
      { key: 'prevStage', label: '上一阶段', type: 'text', placeholder: '请输入阶段名称' },
      { key: 'stageStayDays', label: '阶段停留时间', type: 'text', placeholder: '最低天数', customFilter: (item, val) => {
        if (!val) return true;
        const minDays = parseInt(val, 10);
        if (isNaN(minDays)) return true;
        let stageChangedAt;
        if (item.stageChangedAt) { stageChangedAt = new Date(item.stageChangedAt); }
        else { stageChangedAt = new Date(item.createdAt); }
        const days = Math.floor((Date.now() - stageChangedAt.getTime()) / (1000 * 60 * 60 * 24));
        return days >= minDays;
      }},
      { key: 'stageOverdue', label: '阶段停留是否超期', type: 'select', placeholder: '请选择', options: ['正常', '超期'], customFilter: (item, val) => {
        if (!val) return true;
        if (item.stage === '赢单' || item.stage === '输单') return val === '正常';
        let stageChangedAt;
        if (item.stageChangedAt) { stageChangedAt = new Date(item.stageChangedAt); }
        else { stageChangedAt = new Date(item.createdAt); }
        const days = Math.floor((Date.now() - stageChangedAt.getTime()) / (1000 * 60 * 60 * 24));
        const expectedDuration = Opportunities.STAGE_DURATION[item.stage] || 7;
        const isOverdue = days > expectedDuration;
        return val === '超期' ? isOverdue : !isOverdue;
      }},
    ];

    // 初始数据
    const initialStats = computeBriefStats(data);

    // 商机简报 HTML（作为 DataTable 的 toolbarSlot）
    const briefSlot = `<div id="brief-stats">${renderBriefStatsHtml(initialStats)}</div>`;

    const table = Components.DataTable({
      columns: [
        { key: 'name', label: '商机名称', sortable: true, render: (v, item) => `<span class="cell-link" data-id="${item.id}">${Helpers.escapeHtml(v || '')}</span>` },
        { key: 'customerId', label: '客户名称', render: v => { const c = Store.getById('customers', v); return c ? `<span class="cell-link" data-customer="${v}">${Helpers.escapeHtml(c.name)}</span>` : '-'; }},
        { key: 'brandName', label: '品牌名', width: '90px', render: v => v ? `<span class="cell-brand">${Helpers.escapeHtml(v)}</span>` : '-' },
        { key: 'intendedProducts', label: '意向产品', width: '120px', render: (v, item) => {
          const products = Array.isArray(v) ? v : (item.intendedProduct ? [{ product: item.intendedProduct, amount: item.amount }] : []);
          return products.length > 0 ? products.map(p => `<span style="display:inline-block;margin:1px 2px;padding:0 6px;background:var(--gray-100);border-radius:3px;font-size:12px">${Helpers.escapeHtml(p.product)}</span>`).join('') : '-';
        }},
        { key: 'purchaseType', label: '采购类型', width: '80px', render: v => v ? Components.Badge(v, v === '新开' ? 'primary' : v === '续约' ? 'info' : v === '增购' ? 'warning' : 'success') : '-' },
        { key: 'dataValidity', label: '数据有效性', width: '100px', render: v => Components.Badge(v || '未生效', Opportunities.DATA_VALIDITY_TYPE[v || '未生效'] || 'gray') },
        { key: 'stage', label: '商机阶段', width: '110px', render: v => {
          const prob = Opportunities.STAGE_PROB[v];
          const badge = Components.Badge(v, Opportunities.STAGE_TYPE[v] || 'gray');
          return prob != null ? `${badge}<span style="font-size:var(--text-xs);color:var(--text-muted);margin-left:4px">${prob}%</span>` : badge;
        }},
        { key: 'amount', label: '预计总额', width: '120px', sortable: true, render: v => `<strong>${Helpers.formatMoney(v)}</strong>` },
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
      defaultVisibleFilters: 5,
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
          <div class="page-title-wrap">
            <h2 class="page-title">商机管理</h2>
          </div>
        </div>
        <div class="page-header-right">
          <button class="btn btn-primary" id="btn-add"><svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> 新建商机</button>
          <button class="btn btn-secondary" id="btn-export"><svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> 导出</button>
        </div>
      </div>
      <div class="stats-card" id="opp-rules-trigger" style="cursor:pointer;position:relative;-webkit-user-select:none;user-select:none">
        <svg class="stats-card-icon" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        <span>商机规则 <strong style="color:#1890FF">点击此处查看</strong></span>
        <div id="opp-rules-popup" style="display:none;position:absolute;top:100%;left:0;right:0;z-index:100;background:#fff;border:1px solid #d9d9d9;border-radius:4px;box-shadow:0 4px 12px rgba(0,0,0,0.15);padding:12px 16px;margin-top:4px;font-size:13px;color:#333;line-height:1.8">
          <div>10%、30%阶段：每7天跟进一次，否则客户和商机同时掉保</div>
          <div>50%阶段：至少有一次拜访记录，且每7天跟进一次，否则客户和商机同时掉保</div>
          <div>70%、90%、100%阶段：至少有一次拜访记录，且管理层审核后不掉保</div>
        </div>
      </div>
      <div id="table-container"></div>`;

    el.querySelector('#table-container').appendChild(table);

    // 商机简报已通过 toolbarSlot 插入，无需手动插入

    el.querySelector('#btn-add')?.addEventListener('click', () => this.showForm());
    el.querySelector('#btn-export')?.addEventListener('click', () => {
      UI.toast('导出功能开发中', 'info');
    });

    // 商机规则提示弹窗
    const ruleTrigger = el.querySelector('#opp-rules-trigger');
    const rulePopover = el.querySelector('#opp-rules-popup');
    if (ruleTrigger && rulePopover) {
      ruleTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isVisible = rulePopover.style.display === 'block';
        rulePopover.style.display = isVisible ? 'none' : 'block';
      });
      document.addEventListener('click', (e) => {
        if (!ruleTrigger.contains(e.target) && !rulePopover.contains(e.target)) {
          rulePopover.style.display = 'none';
        }
      }, { once: false });
    }

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
          { key: 'intendedProducts', label: '意向产品', render: (v, item) => {
            const products = Array.isArray(v) ? v : (item.intendedProduct ? [{ product: item.intendedProduct, amount: item.amount }] : []);
            return products.length > 0 ? products.map(p => `${Helpers.escapeHtml(Opportunities._getProductDisplayName(p))}（${Helpers.formatMoney(p.amount)}）`).join('<br>') : '-';
          }},
          { key: 'amount', label: '预估总额', render: v => Helpers.formatMoney(v) },
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
      title: '作废商机',
      message: `确定要将商机「${item.name}」作废吗？作废后商机数据仍保留，但标记为已作废状态。`,
      type: 'danger',
      confirmText: '确认作废',
      onConfirm: () => {
        Store.update(this.COLLECTION, id, { dataValidity: '已作废' });
        UI.toast('商机已作废');
        this.closeSidebar();
        this.renderList();
      }
    });
  },

  _handleSmartRematch(id) {
    const item = Store.getById(this.COLLECTION, id);
    if (!item) return;

    const allProducts = ['微商城', '智慧零售', '智慧购百', '智慧商超', '智慧生鲜', '批发商城', '本地生活', '视频号营销助手', '智慧零售宠物行业', '智慧门店', '微盟星启', '智慧美业', '智慧服务', '企微助手', '企微小助手'];

    // 基于当前商机的已有产品，智能推荐互补产品组合
    const currentProductNames = (item.intendedProducts || []).map(p => p.product);
    const available = allProducts.filter(p => !currentProductNames.includes(p));
    if (available.length < 2) {
      UI.toast('已覆盖全部可推荐产品，无需重新匹配', 'info');
      return;
    }

    // 随机选择 1-2 个互补产品，并带上随机版本
    const getRandomEdition = (productName) => {
      const editions = Opportunities.PRODUCT_EDITIONS[productName];
      return editions ? editions[Math.floor(Math.random() * editions.length)] : '';
    };

    const shuffled = available.sort(() => Math.random() - 0.5);
    const newProductNames = shuffled.slice(0, 1 + Math.floor(Math.random() * Math.min(2, shuffled.length)));

    const newProducts = newProductNames.map(p => ({ product: p, edition: getRandomEdition(p), amount: 0 }));
    const displayNames = newProducts.map(p => p.product + '-' + p.edition);

    // 合并到缓存（不修改商机 intendedProducts 字段）
    const currentRecProducts = Opportunities._getSmartRecProducts(item);
    const updatedRecProducts = [...currentRecProducts, ...newProducts];
    Opportunities._smartRecCache.set(id, updatedRecProducts);

    UI.toast('智能推荐底座已更新，新增 ' + displayNames.join('、'), 'success', 3000);
    this.openSidebar(id);
  },

  init() {
    Router.register('#/opportunities', () => this.renderList());
    Router.register('#/opportunities/view/:id', ({ id }) => this.renderDetail(id));
  }
};
