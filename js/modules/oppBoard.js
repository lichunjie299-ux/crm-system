/* ============================================
   CRM 系统 - 企服商机看板模块
   ============================================ */
const OppBoard = {

  render() {
    UI.setPageTitle('企服商机看板', [{ label: '工作台', hash: '#/dashboard' }, { label: '企服商机看板' }]);

    const opportunities = Store.getAll('opportunities');
    const totalCount = opportunities.length;
    const totalAmount = opportunities.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);

    // 各阶段统计
    const stages = ['需求待确认', '需求确认', '方案认可', '确定合作', '合同签约', '赢单', '输单'];
    const stageStats = {};
    stages.forEach(stage => {
      const items = opportunities.filter(o => o.stage === stage);
      stageStats[stage] = {
        count: items.length,
        amount: items.reduce((sum, o) => sum + (Number(o.amount) || 0), 0),
      };
    });

    const fmtAmt = (amt) => {
      if (amt == null || isNaN(amt)) return '¥0';
      if (amt >= 10000) return '¥' + (amt / 10000).toFixed(1) + 'W';
      return '¥' + Number(amt).toLocaleString('zh-CN', { maximumFractionDigits: 0 });
    };

    const stageColors = {
      '需求待确认': { bg: '#e6f4ff', color: '#1677ff' },
      '需求确认': { bg: '#edf2ff', color: '#5b8def' },
      '方案认可': { bg: '#fffbe6', color: '#faad14' },
      '确定合作': { bg: '#fff7e6', color: '#fa8c16' },
      '合同签约': { bg: '#e6f7ff', color: '#1890ff' },
      '赢单': { bg: '#f6ffed', color: '#52c41a' },
      '输单': { bg: '#fff2f0', color: '#ff4d4f' },
    };

    // 按销售归属人统计
    const salesMap = {};
    opportunities.forEach(o => {
      const customer = Store.getById('customers', o.customerId);
      const sales = customer ? (customer.assignee || '未分配') : '未分配';
      if (!salesMap[sales]) salesMap[sales] = { name: sales, count: 0, amount: 0, wonCount: 0, wonAmount: 0 };
      salesMap[sales].count++;
      salesMap[sales].amount += (Number(o.amount) || 0);
      if (o.stage === '赢单') {
        salesMap[sales].wonCount++;
        salesMap[sales].wonAmount += (Number(o.amount) || 0);
      }
    });

    const salesList = Object.values(salesMap).sort((a, b) => b.amount - a.amount);

    // 按部门统计
    const deptMap = {};
    opportunities.forEach(o => {
      const customer = Store.getById('customers', o.customerId);
      const dept = customer ? (customer.department || customer.businessLine || '未归类') : '未归类';
      if (!deptMap[dept]) deptMap[dept] = { name: dept, count: 0, amount: 0, wonCount: 0, wonAmount: 0 };
      deptMap[dept].count++;
      deptMap[dept].amount += (Number(o.amount) || 0);
      if (o.stage === '赢单') {
        deptMap[dept].wonCount++;
        deptMap[dept].wonAmount += (Number(o.amount) || 0);
      }
    });

    const deptList = Object.values(deptMap).sort((a, b) => b.amount - a.amount);

    const el = document.createElement('div');
    el.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <h2 class="page-title">企服商机看板</h2>
          <p class="page-subtitle">企服商机整体数据概览</p>
        </div>
      </div>

      <!-- 总览卡片 -->
      <div class="stat-cards" style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:var(--space-4)">
        <div class="stat-card">
          <div class="stat-label">商机总数</div>
          <div class="stat-value" style="font-size:28px;color:var(--primary)">${totalCount}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">商机总金额</div>
          <div class="stat-value" style="font-size:24px;color:#cf1322">${fmtAmt(totalAmount)}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">赢单数</div>
          <div class="stat-value" style="font-size:28px;color:#52c41a">${stageStats['赢单'].count}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">赢单金额</div>
          <div class="stat-value" style="font-size:24px;color:#52c41a">${fmtAmt(stageStats['赢单'].amount)}</div>
        </div>
      </div>

      <!-- 阶段分布 -->
      <div class="card" style="margin-bottom:var(--space-4)">
        <div class="card-header"><h3 style="font-size:var(--text-base);margin:0">商机阶段分布</h3></div>
        <div class="card-body" style="display:flex;gap:8px;flex-wrap:wrap">
          ${stages.map(stage => {
            const s = stageStats[stage];
            const c = stageColors[stage];
            const pct = totalCount > 0 ? (s.count / totalCount * 100).toFixed(1) : '0';
            return `<div style="flex:1;min-width:100px;background:${c.bg};border-radius:8px;padding:12px;text-align:center">
              <div style="font-size:12px;color:${c.color};margin-bottom:4px">${stage}</div>
              <div style="font-size:20px;font-weight:700;color:${c.color};margin-bottom:2px">${s.count}</div>
              <div style="font-size:12px;color:var(--text-secondary)">${fmtAmt(s.amount)}</div>
              <div style="font-size:11px;color:var(--text-muted)">${pct}%</div>
            </div>`;
          }).join('')}
        </div>
      </div>

      <!-- 底部两列 -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">

        <!-- 按部门 -->
        <div class="card">
          <div class="card-header"><h3 style="font-size:var(--text-base);margin:0">按部门统计</h3></div>
          <div class="card-body" style="overflow-x:auto">
            <table class="data-table" style="font-size:12px">
              <thead><tr><th>部门</th><th>商机数</th><th>总金额</th><th>赢单数</th><th>赢单金额</th></tr></thead>
              <tbody>
                ${deptList.map(d => `
                  <tr>
                    <td><strong>${Helpers.escapeHtml(d.name)}</strong></td>
                    <td>${d.count}</td>
                    <td>${fmtAmt(d.amount)}</td>
                    <td style="color:#52c41a">${d.wonCount}</td>
                    <td style="color:#52c41a">${fmtAmt(d.wonAmount)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- 按销售 -->
        <div class="card">
          <div class="card-header"><h3 style="font-size:var(--text-base);margin:0">按销售统计</h3></div>
          <div class="card-body" style="overflow-x:auto">
            <table class="data-table" style="font-size:12px">
              <thead><tr><th>销售</th><th>商机数</th><th>总金额</th><th>赢单数</th><th>赢单金额</th></tr></thead>
              <tbody>
                ${salesList.map(s => `
                  <tr>
                    <td><strong>${Helpers.escapeHtml(s.name)}</strong></td>
                    <td>${s.count}</td>
                    <td>${fmtAmt(s.amount)}</td>
                    <td style="color:#52c41a">${s.wonCount}</td>
                    <td style="color:#52c41a">${fmtAmt(s.wonAmount)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;

    UI.render(el);
  },

  init() {
    Router.register('#/opp-board', () => this.render());
  }
};
