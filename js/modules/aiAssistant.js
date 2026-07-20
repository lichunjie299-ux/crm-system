/* ============================================
   CRM 系统 - AI 助手模块
   涅槃 CRM - 右下角智能问答浮窗
   ============================================ */

const AIAssistant = {
  _messages: [],
  _isOpen: false,
  _panel: null,
  _btn: null,
  _input: null,
  _messagesEl: null,
  _API_KEY: null,

  /* ========== 入口 ========== */
  init() {
    this._loadAPIKey();
    this._buildDOM();
    this._bindEvents();
  },

  /* ========== 加载 API Key ========== */
  _loadAPIKey() {
    try {
      this._API_KEY = localStorage.getItem('crm_ai_apikey') || '';
    } catch (e) {
      this._API_KEY = '';
    }
  },

  _saveAPIKey(key) {
    this._API_KEY = key;
    try { localStorage.setItem('crm_ai_apikey', key); } catch (e) {}
  },

  /* ========== 构建 DOM ========== */
  _buildDOM() {
    // 浮动按钮
    this._btn = document.createElement('button');
    this._btn.className = 'ai-float-btn';
    this._btn.title = 'AI销售顾问';
    this._btn.innerHTML = `<svg viewBox="0 0 24 24">
      <path d="M12 2a4 4 0 0 1 4 4v1h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2V6a4 4 0 0 1 4-4z"/>
      <circle cx="9" cy="14" r="1"/><circle cx="15" cy="14" r="1"/>
      <path d="M9 17c.83.67 1.83 1 3 1s2.17-.33 3-1"/>
    </svg>`;
    document.body.appendChild(this._btn);

    // 聊天面板
    this._panel = document.createElement('div');
    this._panel.className = 'ai-chat-panel';
    this._panel.innerHTML = `
      <div class="ai-chat-header">
        <div class="ai-chat-header-left">
          <div class="ai-chat-header-icon">🤖</div>
          <div>
            <div class="ai-chat-header-title">AI销售顾问</div>
            <div class="ai-chat-header-subtitle">根据公司知识库+CRM当前客资数据实时回答</div>
          </div>
        </div>
        <div class="ai-chat-header-actions">
          <button class="ai-chat-header-btn js-ai-settings" title="设置 API Key">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          </button>
          <button class="ai-chat-header-btn js-ai-close" title="关闭">
            <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </div>
      <div class="ai-chat-messages" id="ai-messages">
        ${this._buildWelcome()}
      </div>
      <div class="ai-chat-input-area">
        <textarea class="ai-chat-input" id="ai-input" placeholder="输入你的问题，如：本月我的商机汇总" rows="1"></textarea>
        <button class="ai-chat-send-btn" id="ai-send-btn">
          <svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    `;
    document.body.appendChild(this._panel);

    this._messagesEl = this._panel.querySelector('#ai-messages');
    this._input = this._panel.querySelector('#ai-input');
  },

  /* ========== 欢迎界面 ========== */
  _buildWelcome() {
    return `
      <div class="ai-welcome">
        <div class="ai-welcome-avatar">🤖</div>
        <div class="ai-welcome-text">
          你好！我是「天枢」AI 销售顾问。<br>
          我可以帮你查询 CRM 数据、分析商机、追踪客户。<br>
          试试下面这些问题吧 👇
        </div>
        <div class="ai-welcome-chips">
          <span class="ai-welcome-chip js-ai-chip" data-q="本月我的商机汇总">本月我的商机汇总</span>
          <span class="ai-welcome-chip js-ai-chip" data-q="即将到期的商机有哪些">即将到期的商机有哪些</span>
          <span class="ai-welcome-chip js-ai-chip" data-q="海信智联的跟进情况">海信智联的跟进情况</span>
          <span class="ai-welcome-chip js-ai-chip" data-q="本月赢单情况">本月赢单情况</span>
          <span class="ai-welcome-chip js-ai-chip" data-q="最近有哪些新线索">最近有哪些新线索</span>
          <span class="ai-welcome-chip js-ai-chip" data-q="我的客户整体概览">我的客户整体概览</span>
        </div>
      </div>`;
  },

  /* ========== 事件绑定 ========== */
  _bindEvents() {
    // 浮动按钮点击
    this._btn.addEventListener('click', () => this.toggle());

    // 关闭按钮
    this._panel.querySelector('.js-ai-close').addEventListener('click', () => this.close());

    // 发送按钮
    this._panel.querySelector('#ai-send-btn').addEventListener('click', () => this._handleSend());

    // 回车发送 (Shift+Enter 换行)
    this._input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this._handleSend();
      }
    });

    // 自动调整输入框高度
    this._input.addEventListener('input', () => {
      this._input.style.height = 'auto';
      this._input.style.height = Math.min(this._input.scrollHeight, 100) + 'px';
    });

    // 建议问题点击（事件委托）
    this._panel.addEventListener('click', (e) => {
      const chip = e.target.closest('.js-ai-chip');
      if (chip) {
        const q = chip.dataset.q;
        this._handleSend(q);
      }
      const settingsBtn = e.target.closest('.js-ai-settings');
      if (settingsBtn) {
        this._showSettings();
      }
    });

    // ESC 关闭面板
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this._isOpen) {
        this.close();
      }
    });
  },

  /* ========== 面板控制 ========== */
  toggle() {
    this._isOpen ? this.close() : this.open();
  },

  open() {
    this._isOpen = true;
    this._panel.classList.add('open');
    this._btn.classList.add('hidden');
    setTimeout(() => {
      this._input.focus();
      this._scrollToBottom();
    }, 300);
  },

  close() {
    this._isOpen = false;
    this._panel.classList.remove('open');
    this._btn.classList.remove('hidden');
  },

  /* ========== 发送消息 ========== */
  _handleSend(text) {
    const inputText = text || this._input.value.trim();
    if (!inputText) return;

    // 清除 welcome 界面
    if (this._messagesEl.querySelector('.ai-welcome')) {
      this._messagesEl.innerHTML = '';
    }

    // 添加用户消息
    this._addMessage('user', inputText);
    this._input.value = '';
    this._input.style.height = 'auto';

    // 显示 loading
    const loadingId = this._addLoading();

    // 推理
    this.reason(inputText).then(result => {
      this._removeLoading(loadingId);
      this._addMessage('ai', result.text, result.data);
    }).catch(err => {
      this._removeLoading(loadingId);
      this._addMessage('ai', '抱歉，处理你的问题时出错了：' + (err.message || '未知错误') + '\n\n请稍后重试。');
    });
  },

  /* ========== 添加消息到聊天列表 ========== */
  _addMessage(role, text, data) {
    const msg = { role, text, data, time: new Date() };
    this._messages.push(msg);

    const el = document.createElement('div');
    el.className = `ai-message ${role}`;

    const avatar = role === 'ai' ? '🤖' : '👤';
    const timeStr = this._formatTime(msg.time);

    let bubbleHtml = `<div class="ai-message-bubble">${this._escapeHtml(text).replace(/\n/g, '<br>')}</div>`;

    el.innerHTML = `
      <div class="ai-message-avatar">${avatar}</div>
      <div>
        ${bubbleHtml}
        ${data ? this._renderDataCard(data) : ''}
        <div class="ai-message-time">${timeStr}</div>
      </div>
    `;

    this._messagesEl.appendChild(el);
    this._scrollToBottom();
  },

  _addLoading() {
    const id = 'ai-loading-' + Date.now();
    const el = document.createElement('div');
    el.className = 'ai-message ai';
    el.id = id;
    el.innerHTML = `
      <div class="ai-message-avatar">🤖</div>
      <div class="ai-message-bubble">
        <div class="ai-typing">
          <div class="ai-typing-dot"></div>
          <div class="ai-typing-dot"></div>
          <div class="ai-typing-dot"></div>
        </div>
      </div>
    `;
    this._messagesEl.appendChild(el);
    this._scrollToBottom();
    return id;
  },

  _removeLoading(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  },

  /* ========== 核心推理引擎 ========== */
  async reason(query) {
    const ctx = this._getCRMContext();

    // 如果配置了 API Key，优先使用 Anthropic API
    if (this._API_KEY) {
      try {
        return await this._callAPI(query, ctx);
      } catch (e) {
        console.warn('AI API 调用失败，降级为本地匹配:', e.message);
      }
    }

    // 本地关键词匹配
    return this._localMatch(query, ctx);
  },

  /* ========== 本地关键词匹配引擎 ========== */
  _localMatch(query, ctx) {
    const q = query.toLowerCase();
    const currentUser = '李春洁';

    // 1. 商机汇总 / 我的商机
    if (/商机|汇总|统计|概览|数据/.test(q) && !/客户|线索|联系人/.test(q)) {
      return this._answerOppSummary(ctx, currentUser);
    }

    // 2. 即将到期 / 超期
    if (/即将到期|超期|到期|即将|快到期/.test(q)) {
      return this._answerOverdue(ctx);
    }

    // 3. 特定客户查询（模糊匹配客户名）
    const customerMatch = this._matchCustomerName(q, ctx.customers);
    if (customerMatch) {
      return this._answerCustomerDetail(ctx, customerMatch);
    }

    // 4. 赢单 / 本月成交
    if (/赢单|成交|本月|签单|中标/.test(q)) {
      return this._answerWonDeals(ctx, currentUser);
    }

    // 5. 跟进 / 活动
    if (/跟进|活动|最近|动态/.test(q)) {
      return this._answerRecentActivity(ctx);
    }

    // 6. 线索
    if (/线索|新线索|最近.*线索/.test(q)) {
      return this._answerLeads(ctx);
    }

    // 7. 漏斗
    if (/漏斗|管道|pipeline/.test(q)) {
      return this._answerFunnel(ctx);
    }

    // 默认：返回概览
    return this._answerDefault(ctx, currentUser);
  },

  /* ========== 商机汇总 ========== */
  _answerOppSummary(ctx, currentUser) {
    const opps = ctx.opportunities;
    const total = opps.length;
    const byStage = {};
    let totalAmount = 0;
    opps.forEach(o => {
      const stage = o.stage || '未知';
      byStage[stage] = (byStage[stage] || 0) + 1;
      totalAmount += parseFloat(o.amount) || 0;
    });
    const stageStr = Object.entries(byStage)
      .map(([k, v]) => `${k}: ${v}个`)
      .join('，');

    return {
      text: `根据 CRM 数据，当前共有 **${total}** 个商机，总金额 **¥${totalAmount.toLocaleString()}**。\n\n各阶段分布：${stageStr}。\n\n建议关注「确定合作」和「合同签约」阶段的商机，推动尽快成交。`,
      data: {
        type: 'summary',
        title: '商机阶段分布',
        stats: Object.entries(byStage).map(([k, v]) => ({ label: k, value: v })),
      }
    };
  },

  /* ========== 超期提醒 ========== */
  _answerOverdue(ctx) {
    const now = Date.now();
    const overdue = [];

    ctx.opportunities.forEach(o => {
      if (o.stage === '赢单' || o.stage === '输单') return;
      let changedAt = o.stageChangedAt ? new Date(o.stageChangedAt) : new Date(o.createdAt);
      const days = Math.floor((now - changedAt.getTime()) / 86400000);
      const expectedDuration = AIAssistant._getStageDuration(o.stage);
      if (days > expectedDuration) {
        const customer = ctx.customers.find(c => c.id === o.customerId);
        overdue.push({
          name: o.name,
          customer: customer ? customer.name : '未知',
          stage: o.stage,
          days,
          overdue: days - expectedDuration,
          amount: o.amount,
        });
      }
    });

    overdue.sort((a, b) => b.overdue - a.overdue);

    if (overdue.length === 0) {
      return { text: '好消息！目前所有商机都在正常周期内，没有超期情况。🎉' };
    }

    const rows = overdue.slice(0, 8).map(o => ({
      cols: [o.name, o.customer, o.stage, `${o.days}天（超${o.overdue}天）`, `¥${parseFloat(o.amount || 0).toLocaleString()}`]
    }));

    return {
      text: `共发现 **${overdue.length}** 个超期商机，请及时跟进处理：`,
      data: {
        type: 'table',
        title: '超期商机列表',
        headers: ['商机名称', '客户', '当前阶段', '停留天数', '金额'],
        rows,
      }
    };
  },

  /* ========== 客户详情 ========== */
  _matchCustomerName(q, customers) {
    for (const c of customers) {
      if (c.name && q.includes(c.name.toLowerCase().substring(0, 2))) {
        return c;
      }
    }
    return null;
  },

  _answerCustomerDetail(ctx, customer) {
    const opps = ctx.opportunities.filter(o => o.customerId === customer.id);
    const contacts = ctx.contacts.filter(c => c.customerId === customer.id);
    const followups = ctx.followups.filter(f => f.customerId === customer.id);

    let text = `**${customer.name}**\n`;
    text += `行业：${customer.industry || '-'} | 规模：${customer.scale || '-'}\n`;
    text += `负责人：${customer.assignee || '-'} | 状态：${customer.status || '-'}\n\n`;
    text += `关联商机：${opps.length} 个\n`;
    opps.slice(0, 5).forEach(o => {
      text += `  • ${o.name} [${o.stage}] ¥${parseFloat(o.amount || 0).toLocaleString()}\n`;
    });
    if (opps.length > 5) text += `  ... 还有 ${opps.length - 5} 个商机\n`;

    if (contacts.length > 0) {
      text += `\n联系人：`;
      contacts.forEach(c => text += `${c.name}(${c.position || '-'}) `);
    }

    if (followups.length > 0) {
      const last = followups[followups.length - 1];
      text += `\n\n最近跟进：${last.content || '-'} (${Helpers.formatDate(last.createdAt)})`;
    }

    return { text };
  },

  /* ========== 赢单统计 ========== */
  _answerWonDeals(ctx, currentUser) {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const wonThisMonth = ctx.opportunities.filter(o => {
      if (o.stage !== '赢单') return false;
      const d = new Date(o.updatedAt || o.createdAt);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    });

    const totalAmount = wonThisMonth.reduce((s, o) => s + (parseFloat(o.amount) || 0), 0);

    if (wonThisMonth.length === 0) {
      return { text: '本月暂无赢单记录。加油冲刺！💪\n\n以下是当前接近成交的商机：' };
    }

    const rows = wonThisMonth.map(o => {
      const c = ctx.customers.find(cu => cu.id === o.customerId);
      return { cols: [o.name, c ? c.name : '-', `¥${parseFloat(o.amount || 0).toLocaleString()}`] };
    });

    return {
      text: `本月已赢单 **${wonThisMonth.length}** 个商机，总金额 **¥${totalAmount.toLocaleString()}** 🎉`,
      data: {
        type: 'table',
        title: '本月赢单明细',
        headers: ['商机名称', '客户', '金额'],
        rows,
      }
    };
  },

  /* ========== 最近活动 ========== */
  _answerRecentActivity(ctx) {
    const followups = [...ctx.followups].sort((a, b) =>
      new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    ).slice(0, 5);

    if (followups.length === 0) {
      return { text: '暂无最近跟进记录。' };
    }

    const rows = followups.map(f => {
      const c = ctx.customers.find(cu => cu.id === f.customerId);
      return { cols: [f.content || '-', c ? c.name : '-', Helpers.formatDate(f.createdAt)] };
    });

    return {
      text: '以下是最近 5 条跟进记录：',
      data: {
        type: 'table',
        title: '最近跟进记录',
        headers: ['跟进内容', '客户', '时间'],
        rows,
      }
    };
  },

  /* ========== 线索 ========== */
  _answerLeads(ctx) {
    const leads = [...ctx.leads].sort((a, b) =>
      new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    ).slice(0, 8);

    const rows = leads.map(l => ({
      cols: [l.name || '-', l.company || '-', l.source || '-', l.status || '-', Helpers.formatDate(l.createdAt)]
    }));

    return {
      text: `共有 **${ctx.leads.length}** 条线索，以下是最近的：`,
      data: {
        type: 'table',
        title: '最新线索',
        headers: ['线索名称', '公司', '来源', '状态', '创建时间'],
        rows,
      }
    };
  },

  /* ========== 漏斗 ========== */
  _answerFunnel(ctx) {
    const stages = ['需求待确认', '需求确认', '方案认可', '确定合作', '合同签约', '赢单'];
    const byStage = {};
    const byStageAmount = {};
    stages.forEach(s => { byStage[s] = 0; byStageAmount[s] = 0; });

    ctx.opportunities.forEach(o => {
      const s = o.stage;
      if (byStage[s] !== undefined) {
        byStage[s]++;
        byStageAmount[s] += parseFloat(o.amount) || 0;
      }
    });

    const rows = stages.map(s => ({
      cols: [s, `${byStage[s]}个`, `¥${byStageAmount[s].toLocaleString()}`]
    }));

    return {
      text: '当前销售漏斗概览，请关注各阶段转化率：',
      data: {
        type: 'table',
        title: '销售漏斗',
        headers: ['阶段', '商机数', '金额'],
        rows,
      }
    };
  },

  /* ========== 默认回答 ========== */
  _answerDefault(ctx, currentUser) {
    const oppCount = ctx.opportunities.length;
    const custCount = ctx.customers.filter(c => c.poolStatus !== 'in_pool').length;
    const leadCount = ctx.leads.length;
    const wonOpps = ctx.opportunities.filter(o => o.stage === '赢单');
    const wonAmount = wonOpps.reduce((s, o) => s + (parseFloat(o.amount) || 0), 0);

    return {
      text: `你好！我是「天枢」AI 销售顾问。以下是你的 CRM 数据概览：\n\n` +
        `📊 客户：${custCount} 个\n` +
        `🎯 商机：${oppCount} 个\n` +
        `💡 线索：${leadCount} 条\n` +
        `🏆 赢单：${wonOpps.length} 个（¥${wonAmount.toLocaleString()}）\n\n` +
        `你可以问我：\n` +
        `• "本月我的商机汇总"\n` +
        `• "即将到期的商机有哪些"\n` +
        `• "XX客户的跟进情况"\n` +
        `• "销售漏斗概览"`,
    };
  },

  /* ========== Anthropic API 调用 ========== */
  async _callAPI(query, ctx) {
    const systemPrompt = this._buildSystemPrompt(ctx);
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this._API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: 'user', content: query }],
      }),
    });

    if (!resp.ok) {
      const err = await resp.text();
      throw new Error(`API error ${resp.status}: ${err}`);
    }

    const data = await resp.json();
    const text = data.content?.[0]?.text || '（无回复）';
    return { text };
  },

  _buildSystemPrompt(ctx) {
    return `你是涅槃 CRM 系统的 AI 销售顾问「天枢」。你帮销售团队快速查询和分析 CRM 数据。
当前用户：${ctx.currentUser}
当前页面：${ctx.currentRoute}

以下是 CRM 系统当前的完整数据：

客户 (${ctx.customers.length} 条):
${JSON.stringify(ctx.customers.map(c => ({ id: c.id, name: c.name, industry: c.industry, scale: c.scale, assignee: c.assignee, status: c.status })))}

商机 (${ctx.opportunities.length} 条):
${JSON.stringify(ctx.opportunities.map(o => ({ id: o.id, name: o.name, customerId: o.customerId, stage: o.stage, amount: o.amount, expectedCloseDate: o.expectedCloseDate, oppSource: o.oppSource, purchaseType: o.purchaseType })))}

线索 (${ctx.leads.length} 条):
${JSON.stringify(ctx.leads.map(l => ({ name: l.name, company: l.company, source: l.source, status: l.status })))}

回复要求：
1. 用中文回答，语气亲切专业
2. 引用具体数据（金额、数量、日期），不要模糊回答
3. 如果数据不足以回答，诚实说明并给出建议
4. 回答简洁有力，多使用数字和要点列表`;
  },

  /* ========== CRM 数据上下文 ========== */
  _getCRMContext() {
    return {
      customers: Store.getAll('customers'),
      opportunities: Store.getAll('opportunities'),
      leads: Store.getAll('leads'),
      contacts: Store.getAll('contacts'),
      orders: Store.getAll('orders'),
      followups: Store.getAll('followups'),
      products: Store.getAll('products'),
      currentUser: '李春洁',
      currentRoute: window.location.hash,
    };
  },

  /* ========== 数据卡片渲染 ========== */
  _renderDataCard(data) {
    if (!data) return '';

    if (data.type === 'summary') {
      const stats = data.stats.map(s =>
        `<span class="ai-data-stat"><strong>${s.value}</strong><span class="ai-data-stat-label">${s.label}</span></span>`
      ).join('');
      return `<div class="ai-data-card">
        <div class="ai-data-card-header">${data.title}</div>
        <div class="ai-data-card-body">${stats}</div>
      </div>`;
    }

    if (data.type === 'table') {
      const thead = data.headers.map(h => `<th>${h}</th>`).join('');
      const tbody = (data.rows || []).slice(0, 5).map(row =>
        `<tr>${row.cols.map(c => `<td>${this._escapeHtml(c)}</td>`).join('')}</tr>`
      ).join('');
      const moreText = data.rows.length > 5 ? `<div style="padding:4px 8px;font-size:11px;color:var(--text-muted)">... 还有 ${data.rows.length - 5} 条</div>` : '';
      return `<div class="ai-data-card">
        <div class="ai-data-card-header">${data.title}</div>
        <div class="ai-data-card-body">
          <table class="ai-data-table">${thead}${tbody}</table>
          ${moreText}
        </div>
      </div>`;
    }

    return '';
  },

  /* ========== 设置弹窗 ========== */
  _showSettings() {
    const overlay = document.createElement('div');
    overlay.className = 'ai-settings-overlay';
    overlay.innerHTML = `
      <div class="ai-settings-dialog">
        <div class="ai-settings-dialog-header">
          <span>⚙️ AI销售顾问设置</span>
          <button class="ai-chat-header-btn js-ai-settings-close">
            <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="ai-settings-dialog-body">
          <label>Anthropic API Key（可选）</label>
          <input type="password" id="ai-apikey-input" value="${this._escapeHtml(this._API_KEY)}" placeholder="sk-ant-api...">
          <div class="ai-hint">
            💡 配置 API Key 后可获得更智能的 AI 回答。<br>
            不配置时使用本地关键词匹配引擎。<br>
            API Key 仅保存在你的浏览器本地存储中。
          </div>
        </div>
        <div class="ai-settings-dialog-footer">
          <button class="btn btn-secondary btn-sm js-ai-settings-close">取消</button>
          <button class="btn btn-primary btn-sm js-ai-settings-save">保存</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    const close = () => overlay.remove();
    overlay.querySelector('.js-ai-settings-close').addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

    overlay.querySelector('.js-ai-settings-save').addEventListener('click', () => {
      const key = overlay.querySelector('#ai-apikey-input').value.trim();
      this._saveAPIKey(key);
      UI.toast('API Key 已保存', 'success');
      close();
    });
  },

  /* ========== 工具函数 ========== */
  _scrollToBottom() {
    setTimeout(() => {
      if (this._messagesEl) {
        this._messagesEl.scrollTop = this._messagesEl.scrollHeight;
      }
    }, 50);
  },

  _formatTime(date) {
    const h = date.getHours().toString().padStart(2, '0');
    const m = date.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
  },

  _escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  },

  _getStageDuration(stage) {
    const map = {
      '需求待确认': 7, '需求确认': 7, '方案认可': 7,
      '确定合作': 14, '合同签约': 14, '赢单': Infinity, '输单': Infinity,
    };
    return map[stage] || 7;
  },
};
