/* ============================================
   CRM 系统 - 数据看板模块
   ============================================ */
const Dashboard = {

  render() {
    UI.setPageTitle('数据看板');

    const leads = Store.getAll('leads');
    const customers = Store.getAll('customers');
    const opportunities = Store.getAll('opportunities');
    const orders = Store.getAll('orders');
    const followups = Store.getAll('followups');

    // 统计数据
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const monthLeads = leads.filter(l => new Date(l.createdAt) >= thisMonth).length;
    const activeCustomers = customers.filter(c => c.status === '活跃').length;
    const activeOpps = opportunities.filter(o => o.stage !== '赢单' && o.stage !== '输单');
    const activeOppAmount = activeOpps.reduce((s, o) => s + (Number(o.amount) || 0), 0);
    const monthOrders = orders.filter(o => new Date(o.createdAt) >= thisMonth);
    const monthOrderAmount = monthOrders.reduce((s, o) => s + (Number(o.totalAmount) || 0), 0);

    // 漏斗数据
    const funnelStages = ['需求待确认', '需求确认', '方案认可', '确定合作', '合同签约', '赢单'];
    const funnelData = funnelStages.map(stage => ({
      stage,
      count: opportunities.filter(o => o.stage === stage).length,
      amount: opportunities.filter(o => o.stage === stage).reduce((s, o) => s + (Number(o.amount) || 0), 0),
    }));
    const maxFunnelCount = Math.max(...funnelData.map(d => d.count), 1);

    // 待办提醒
    const today = Helpers.today();
    const todayFollows = followups.filter(f => f.nextFollowDate && f.nextFollowDate <= today);
    const expiringOpps = opportunities.filter(o => {
      if (o.stage === '赢单' || o.stage === '输单') return false;
      if (!o.expectedCloseDate) return false;
      const diff = (new Date(o.expectedCloseDate) - now) / (1000 * 60 * 60 * 24);
      return diff <= 7 && diff >= -3;
    });

    // 最近跟进
    const recentFollowups = [...followups].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8);

    // 来源分布
    const sourceCount = {};
    leads.forEach(l => { sourceCount[l.source] = (sourceCount[l.source] || 0) + 1; });
    const sourceEntries = Object.entries(sourceCount).sort((a, b) => b[1] - a[1]);
    const maxSourceCount = Math.max(...sourceEntries.map(e => e[1]), 1);

    const el = document.createElement('div');
    el.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <h2 class="page-title">数据看板</h2>
          <p class="page-subtitle">销售数据概览</p>
        </div>
        <div class="page-header-right">
          <button class="btn btn-secondary" id="btn-refresh"><svg viewBox="0 0 24 24">${UI.icons.refresh}</svg> 刷新</button>
        </div>
      </div>

      <!-- 统计卡片 -->
      <div class="stat-cards">
        <div class="stat-card" style="cursor:pointer" data-href="#/leads">
          <div class="stat-icon blue"><svg viewBox="0 0 24 24">${UI.icons.leads}</svg></div>
          <div class="stat-info">
            <div class="stat-label">本月新线索</div>
            <div class="stat-value">${monthLeads}</div>
            <div class="stat-change">共 ${leads.length} 条线索</div>
          </div>
        </div>
        <div class="stat-card" style="cursor:pointer" data-href="#/customers">
          <div class="stat-icon green"><svg viewBox="0 0 24 24">${UI.icons.customers}</svg></div>
          <div class="stat-info">
            <div class="stat-label">活跃客户</div>
            <div class="stat-value">${activeCustomers}</div>
            <div class="stat-change">共 ${customers.length} 个客户</div>
          </div>
        </div>
        <div class="stat-card" style="cursor:pointer" data-href="#/opportunities">
          <div class="stat-icon orange"><svg viewBox="0 0 24 24">${UI.icons.opportunities}</svg></div>
          <div class="stat-info">
            <div class="stat-label">进行中商机</div>
            <div class="stat-value">${activeOpps.length}</div>
            <div class="stat-change">总额 ${Helpers.formatMoneyShort(activeOppAmount)}</div>
          </div>
        </div>
        <div class="stat-card" style="cursor:pointer" data-href="#/orders">
          <div class="stat-icon red"><svg viewBox="0 0 24 24">${UI.icons.orders}</svg></div>
          <div class="stat-info">
            <div class="stat-label">本月成交</div>
            <div class="stat-value">${Helpers.formatMoneyShort(monthOrderAmount)}</div>
            <div class="stat-change">${monthOrders.length} 个订单</div>
          </div>
        </div>
      </div>

      <!-- 图表区 -->
      <div class="dashboard-grid">
        <!-- 销售漏斗 -->
        <div class="card">
          <div class="card-header"><h3 class="card-title">销售漏斗</h3></div>
          <div class="card-body">
            <div class="funnel-chart">
              ${funnelData.map((d, i) => {
                const width = maxFunnelCount > 0 ? Math.max(20, (d.count / maxFunnelCount) * 100) : 20;
                const opacity = 1 - (i * 0.12);
                const colors = ['var(--primary)', 'var(--primary-light)', 'var(--info)', 'var(--warning)', 'var(--success)'];
                return `<div class="funnel-step">
                  <div class="funnel-label">${d.stage}</div>
                  <div class="funnel-bar" style="width:${width}%;background:${colors[i]};opacity:${opacity}">${d.count}</div>
                  <div class="funnel-count">${Helpers.formatMoneyShort(d.amount)}</div>
                </div>`;
              }).join('')}
            </div>
            ${funnelData.length === 0 || funnelData.every(d => d.count === 0) ? '<div class="text-center text-muted" style="padding:var(--space-4)">暂无商机数据</div>' : ''}
          </div>
        </div>

        <!-- 线索来源分布 -->
        <div class="card">
          <div class="card-header"><h3 class="card-title">线索来源分布</h3></div>
          <div class="card-body">
            ${sourceEntries.length > 0 ? sourceEntries.map(([source, count]) => {
              const width = (count / maxSourceCount) * 100;
              return `<div style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-3)">
                <div style="min-width:70px;font-size:var(--text-sm);color:var(--text-secondary)">${Helpers.escapeHtml(source)}</div>
                <div style="flex:1;height:24px;background:var(--gray-100);border-radius:var(--radius-md);overflow:hidden">
                  <div style="height:100%;width:${width}%;background:var(--primary);border-radius:var(--radius-md);display:flex;align-items:center;padding-left:var(--space-2);color:#fff;font-size:var(--text-xs);font-weight:600;min-width:30px;transition:width 0.6s ease">${count}</div>
                </div>
              </div>`;
            }).join('') : '<div class="text-center text-muted" style="padding:var(--space-4)">暂无线索数据</div>'}
          </div>
        </div>

        <!-- 待办提醒 -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">待办提醒</h3>
            <span class="badge badge-danger">${todayFollows.length + expiringOpps.length}</span>
          </div>
          <div class="card-body">
            <ul class="todo-list">
              ${todayFollows.map(f => {
                const collMap = { lead: 'leads', customer: 'customers', opportunity: 'opportunities' };
                const obj = Store.getById(collMap[f.relatedType] || '', f.relatedId);
                const name = obj ? obj.name : '未知';
                const hashMap = { lead: '#/leads/view/', customer: '#/customers/view/', opportunity: '#/opportunities/view/' };
                return `<li class="todo-item">
                  <span class="todo-dot urgent"></span>
                  <span>需跟进：<a href="${hashMap[f.relatedType]}${f.relatedId}">${Helpers.escapeHtml(name)}</a></span>
                  <span class="todo-time">${Helpers.formatDate(f.nextFollowDate)}</span>
                </li>`;
              }).join('')}
              ${expiringOpps.map(o => {
                const days = Math.ceil((new Date(o.expectedCloseDate) - now) / (1000 * 60 * 60 * 24));
                const urgency = days < 0 ? 'urgent' : days <= 3 ? 'urgent' : 'normal';
                const text = days < 0 ? `已过期${Math.abs(days)}天` : days === 0 ? '今天到期' : `${days}天后到期`;
                return `<li class="todo-item">
                  <span class="todo-dot ${urgency}"></span>
                  <span>商机：<a href="#/opportunities/view/${o.id}">${Helpers.escapeHtml(o.name)}</a> ${text}</span>
                  <span class="todo-time">${Helpers.formatMoney(o.amount)}</span>
                </li>`;
              }).join('')}
              ${todayFollows.length + expiringOpps.length === 0 ? '<li class="todo-item" style="justify-content:center;color:var(--text-muted)">暂无待办事项</li>' : ''}
            </ul>
          </div>
        </div>

        <!-- 最近跟进 -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">最近活动</h3>
            <a href="#/followups" style="font-size:var(--text-sm)">查看全部</a>
          </div>
          <div class="card-body">
            ${recentFollowups.length > 0 ? recentFollowups.map(f => {
              const collMap = { lead: 'leads', customer: 'customers', opportunity: 'opportunities' };
              const typeMap = { lead: '线索', customer: '客户', opportunity: '商机' };
              const obj = Store.getById(collMap[f.relatedType] || '', f.relatedId);
              const name = obj ? obj.name : '未知';
              return `<div class="activity-item">
                <div class="activity-avatar">${Helpers.getInitials(name)}</div>
                <div class="activity-text">
                  <strong>${Helpers.escapeHtml(name)}</strong>
                  <span class="badge badge-${FollowUps.TYPE_MAP[f.type] || 'gray'}" style="margin:0 4px">${Helpers.escapeHtml(f.type)}</span>
                  ${Helpers.escapeHtml(Helpers.truncate(f.content, 40))}
                </div>
                <div class="activity-time">${Helpers.formatRelativeTime(f.createdAt)}</div>
              </div>`;
            }).join('') : '<div class="text-center text-muted" style="padding:var(--space-4)">暂无活动记录</div>'}
          </div>
        </div>
      </div>
    `;

    // 卡片点击跳转
    el.querySelectorAll('[data-href]').forEach(card => {
      card.addEventListener('click', () => Router.navigate(card.dataset.href));
    });

    el.querySelector('#btn-refresh')?.addEventListener('click', () => this.render());

    UI.render(el);
  },

  init() {
    Router.register('#/dashboard', () => this.render());
    // 监听数据变化自动刷新（如果当前在 dashboard）
    EventBus.on('data:changed:*', () => {
      const route = Router.current();
      if (route && route.hash === '#/dashboard') this.render();
    });
  }
};
