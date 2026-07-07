/* ============================================
   CRM 系统 - 应用入口
   ============================================ */
const App = {

  init() {
    // 注入种子数据（首次运行）
    SeedData.seed();

    // 初始化所有模块
    Dashboard.init();
    OppBoard.init();
    Products.init();
    Leads.init();
    Customers.init();
    Contacts.init();
    Opportunities.init();
    LeadPool.init();
    CustomerPool.init();
    Orders.init();
    Contracts.init();
    Rules.init();
    FollowUps.init();
    Approvals.init();
    FieldVisits.init();
    PreSales.init();

    // 注册设置/导出路由
    Router.register('#/settings', () => this.renderSettings());

    // 绑定侧边栏导航
    this.bindNavigation();

    // 绑定侧边栏折叠分组
    this.bindNavGroups();

    // 绑定全局搜索
    this.bindGlobalSearch();

    // 绑定移动端侧边栏
    this.bindMobileSidebar();

    // 路由变化时更新导航高亮（需在 Router.start 之前注册）
    EventBus.on('route:changed', (route) => {
      this.updateActiveNav(route.hash);
    });

    // 启动路由
    Router.start();

    // 检查公海掉保规则
    this.checkPoolRules();

    console.log('CRM 系统已启动');
  },

  bindNavigation() {
    document.querySelectorAll('.nav-item[data-route], .nav-sub-item[data-route]').forEach(item => {
      item.addEventListener('click', () => {
        const route = item.dataset.route;
        Router.navigate(route);
        // 移动端关闭侧边栏
        document.querySelector('.sidebar')?.classList.remove('open');
      });
    });
  },

  updateActiveNav(hash) {
    document.querySelectorAll('.nav-item').forEach(item => {
      const route = item.dataset.route || '';
      const isActive = hash === route || hash.startsWith(route + '/') || hash.startsWith(route + '?');
      item.classList.toggle('active', isActive);
    });

    // 处理子菜单项高亮
    document.querySelectorAll('.nav-sub-item').forEach(item => {
      const route = item.dataset.route || '';
      const isActive = hash === route || hash.startsWith(route + '/') || hash.startsWith(route + '?');
      item.classList.toggle('active', isActive);
    });

    // 处理子菜单高亮：如有子项激活，展开父分组并高亮父 toggle
    document.querySelectorAll('.nav-group').forEach(group => {
      const hasActiveSub = group.querySelector('.nav-sub-item.active');
      const toggle = group.querySelector('.nav-group-toggle');
      if (hasActiveSub) {
        group.classList.add('expanded');
        if (toggle) toggle.classList.add('active');
      } else {
        if (toggle) toggle.classList.remove('active');
      }
    });
  },

  bindGlobalSearch() {
    const searchInput = document.getElementById('global-search');
    if (!searchInput) return;

    const container = searchInput.closest('.topbar-search');
    let resultsEl = null;

    const doSearch = Helpers.debounce((term) => {
      if (!term || term.length < 1) {
        if (resultsEl) { resultsEl.remove(); resultsEl = null; }
        return;
      }

      const results = [];
      const lowerTerm = term.toLowerCase();

      // 搜索各模块
      Store.getAll('leads').forEach(item => {
        if ((item.customerName && item.customerName.toLowerCase().includes(lowerTerm)) ||
            (item.contactInfo && item.contactInfo.toLowerCase().includes(lowerTerm)) ||
            (item.region && item.region.toLowerCase().includes(lowerTerm))) {
          results.push({ type: '线索', name: item.customerName || item.contactInfo, sub: item.contactInfo, hash: `#/leads/view/${item.id}` });
        }
      });

      Store.getAll('customers').forEach(item => {
        if (item.name && item.name.toLowerCase().includes(lowerTerm)) {
          results.push({ type: '客户', name: item.name, sub: item.industry, hash: `#/customers/view/${item.id}` });
        }
      });

      Store.getAll('opportunities').forEach(item => {
        if (item.name && item.name.toLowerCase().includes(lowerTerm)) {
          results.push({ type: '商机', name: item.name, sub: Helpers.formatMoney(item.amount), hash: `#/opportunities/view/${item.id}` });
        }
      });

      Store.getAll('orders').forEach(item => {
        if (item.orderNo && item.orderNo.toLowerCase().includes(lowerTerm)) {
          results.push({ type: '订单', name: item.orderNo, sub: Helpers.formatMoney(item.totalAmount), hash: `#/orders/view/${item.id}` });
        }
      });

      Store.getAll('contracts').forEach(item => {
        if ((item.contractNo && item.contractNo.toLowerCase().includes(lowerTerm)) ||
            (item.signer && item.signer.toLowerCase().includes(lowerTerm))) {
          results.push({ type: '合同', name: item.contractNo, sub: Helpers.formatMoney(item.amount), hash: `#/contracts` });
        }
      });

      Store.getAll('products').forEach(item => {
        if ((item.name && item.name.toLowerCase().includes(lowerTerm)) ||
            (item.code && item.code.toLowerCase().includes(lowerTerm))) {
          results.push({ type: '产品', name: item.name, sub: Helpers.formatMoney(item.price), hash: `#/products/view/${item.id}` });
        }
      });

      // 显示结果
      if (resultsEl) resultsEl.remove();

      if (results.length === 0) {
        resultsEl = document.createElement('div');
        resultsEl.className = 'search-results';
        resultsEl.innerHTML = '<div class="search-result-item" style="justify-content:center;color:var(--text-muted)">未找到结果</div>';
      } else {
        resultsEl = document.createElement('div');
        resultsEl.className = 'search-results';
        resultsEl.innerHTML = results.slice(0, 10).map(r => `
          <div class="search-result-item" data-href="${r.hash}">
            <span class="result-type">${Helpers.escapeHtml(r.type)}</span>
            <span>${Helpers.escapeHtml(r.name)}</span>
            ${r.sub ? `<span style="color:var(--text-muted);font-size:var(--text-xs);margin-left:auto">${Helpers.escapeHtml(r.sub)}</span>` : ''}
          </div>
        `).join('');

        resultsEl.querySelectorAll('[data-href]').forEach(item => {
          item.addEventListener('click', () => {
            Router.navigate(item.dataset.href);
            searchInput.value = '';
            if (resultsEl) { resultsEl.remove(); resultsEl = null; }
          });
        });
      }

      container.appendChild(resultsEl);
    }, 200);

    searchInput.addEventListener('input', (e) => doSearch(e.target.value.trim()));

    // 点击外部关闭
    document.addEventListener('click', (e) => {
      if (!container.contains(e.target) && resultsEl) {
        resultsEl.remove();
        resultsEl = null;
      }
    });

    // ESC 关闭
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchInput.value = '';
        if (resultsEl) { resultsEl.remove(); resultsEl = null; }
        searchInput.blur();
      }
    });
  },

  bindMobileSidebar() {
    // 侧边栏遮罩点击关闭
    const overlay = document.getElementById('sidebar-overlay');
    if (overlay) {
      overlay.addEventListener('click', () => {
        document.querySelector('.sidebar')?.classList.remove('open');
      });
    }
  },

  // 侧边栏折叠分组展开/收起
  bindNavGroups() {
    document.querySelectorAll('.nav-group-toggle').forEach(item => {
      item.addEventListener('click', () => {
        const group = item.closest('.nav-group');
        if (group) {
          group.classList.toggle('expanded');
        }
      });
    });
  },

  // 公海掉保规则检查，返回新增掉保数量
  checkPoolRules() {
    let count = 0;
    const now = Date.now();
    const DAY = 24 * 60 * 60 * 1000;

    // 线索掉保规则：21天未转客户
    const leads = Store.getAll('leads');
    leads.forEach(lead => {
      if (lead.poolStatus === 'in_pool') return; // 已在公海
      if (lead.status === '已转化' || lead.status === '已关闭') return; // 已转化/已关闭不掉保

      const created = new Date(lead.createdAt).getTime();
      const daysSinceCreation = Math.floor((now - created) / DAY);

      if (daysSinceCreation > 21) {
        Store.update('leads', lead.id, {
          poolStatus: 'in_pool',
          poolDate: Helpers.now(),
          poolReason: '超21天未转客户',
          originalAssignee: lead.assignee || '',
        });
        Store.create('followups', {
          relatedType: 'lead',
          relatedId: lead.id,
          type: '其他',
          content: '线索超21天未转客户，自动掉入公海',
        });
        count++;
      }
    });

    // 客户掉保规则：
    // 3天无拜访记录 → 直接掉保
    // 90天未成单 → 有高阶段商机需上级审核，无则直接掉保
    const HIGH_STAGES = ['方案认可', '确定合作', '合同签约', '赢单'];
    const customers = Store.getAll('customers');
    customers.forEach(customer => {
      if (customer.poolStatus === 'in_pool' || customer.poolStatus === 'pending_review') return; // 已在公海或待审核

      const created = new Date(customer.createdAt).getTime();
      const daysSinceCreation = Math.floor((now - created) / DAY);

      // 检查是否有赢单订单
      const hasWonOrder = Store.query('orders', o => o.customerId === customer.id).some(o => o.status === '已完成' || o.status === '已付款');

      // 检查最近7天是否有跟进（包含客户及商机的跟进记录）
      const sevenDaysAgo = now - 7 * DAY;
      const threeDaysAgo = now - 3 * DAY;
      const customerFollowups = Store.query('followups', f => f.relatedType === 'customer' && f.relatedId === customer.id);
      const oppFollowups = Store.query('opportunities', o => o.customerId === customer.id).flatMap(opp =>
        Store.query('followups', f => f.relatedType === 'opportunity' && f.relatedId === opp.id)
      );
      const allFollowups = [...customerFollowups, ...oppFollowups];
      const hasRecentFollowup = allFollowups.some(f => new Date(f.createdAt).getTime() > sevenDaysAgo);

      // 检查最近3天是否有拜访记录
      const hasRecentVisit = allFollowups.some(f => f.type === '拜访' && new Date(f.createdAt).getTime() > threeDaysAgo);

      // 3天无拜访记录 → 直接掉保
      if (!hasRecentVisit && daysSinceCreation > 3) {
        const reason = '超3天无拜访';
        Store.update('customers', customer.id, {
          poolStatus: 'in_pool',
          poolDate: Helpers.now(),
          poolReason: reason,
          originalAssignee: customer.assignee || '',
          status: '公海',
        });
        const activeOpps = Store.query('opportunities', o => o.customerId === customer.id && o.stage !== '赢单' && o.stage !== '输单' && o.poolStatus !== 'in_pool');
        activeOpps.forEach(opp => {
          Store.update('opportunities', opp.id, {
            poolStatus: 'in_pool',
            poolDate: Helpers.now(),
            poolReason: `客户掉保（${reason}）`,
            originalAssignee: opp.assignee || '',
          });
        });
        Store.create('followups', {
          relatedType: 'customer',
          relatedId: customer.id,
          type: '其他',
          content: `客户${reason}，自动掉入公海，${activeOpps.length} 个关联商机一并掉入`,
        });
        count++;
        return; // 已处理，跳过后续判断
      }

      // 90天未成单 → 检查是否有高阶段商机
      if (daysSinceCreation > 90 && !hasWonOrder) {
        const hasHighStageOpp = Store.query('opportunities', o =>
          o.customerId === customer.id && HIGH_STAGES.includes(o.stage) && o.poolStatus !== 'in_pool'
        ).length > 0;

        if (hasHighStageOpp) {
          // 有高阶段商机 → 标记为待审核（需上级审核后不掉保）
          Store.update('customers', customer.id, {
            poolStatus: 'pending_review',
            poolDate: Helpers.now(),
            poolReason: '超90天未成单（待审核）',
            originalAssignee: customer.assignee || '',
          });
          Store.create('followups', {
            relatedType: 'customer',
            relatedId: customer.id,
            type: '其他',
            content: '客户超90天未成单，存在高阶段商机，需上级审核决定是否掉保',
          });
          count++;
        } else {
          // 无高阶段商机 → 直接掉保
          const reason = '超90天未成单';
          Store.update('customers', customer.id, {
            poolStatus: 'in_pool',
            poolDate: Helpers.now(),
            poolReason: reason,
            originalAssignee: customer.assignee || '',
            status: '公海',
          });
          const activeOpps = Store.query('opportunities', o => o.customerId === customer.id && o.stage !== '赢单' && o.stage !== '输单' && o.poolStatus !== 'in_pool');
          activeOpps.forEach(opp => {
            Store.update('opportunities', opp.id, {
              poolStatus: 'in_pool',
              poolDate: Helpers.now(),
              poolReason: `客户掉保（${reason}）`,
              originalAssignee: opp.assignee || '',
            });
          });
          Store.create('followups', {
            relatedType: 'customer',
            relatedId: customer.id,
            type: '其他',
            content: `客户${reason}，自动掉入公海，${activeOpps.length} 个关联商机一并掉入`,
          });
          count++;
        }
      }
    });

    if (count > 0) {
      console.log(`公海掉保检查：新增 ${count} 条掉保记录`);
    }
    return count;
  },

  renderSettings() {
    UI.setPageTitle('系统设置');

    const el = document.createElement('div');
    el.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <h2 class="page-title">系统设置</h2>
          <p class="page-subtitle">数据管理与系统配置</p>
        </div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-header"><h3 class="card-title">数据导出</h3></div>
          <div class="card-body">
            <p style="font-size:var(--text-sm);color:var(--text-secondary);margin-bottom:var(--space-4)">将所有 CRM 数据导出为 JSON 文件，可用于备份或迁移。</p>
            <button class="btn btn-primary" id="btn-export"><svg viewBox="0 0 24 24">${UI.icons.download}</svg> 导出数据</button>
          </div>
        </div>

        <div class="card">
          <div class="card-header"><h3 class="card-title">数据导入</h3></div>
          <div class="card-body">
            <p style="font-size:var(--text-sm);color:var(--text-secondary);margin-bottom:var(--space-4)">从 JSON 文件导入数据。注意：导入会覆盖现有数据。</p>
            <input type="file" id="import-file" accept=".json" style="display:none">
            <button class="btn btn-secondary" id="btn-import"><svg viewBox="0 0 24 24">${UI.icons.upload}</svg> 导入数据</button>
          </div>
        </div>

        <div class="card">
          <div class="card-header"><h3 class="card-title">重置演示数据</h3></div>
          <div class="card-body">
            <p style="font-size:var(--text-sm);color:var(--text-secondary);margin-bottom:var(--space-4)">清空所有数据并重新注入演示数据。</p>
            <button class="btn btn-warning" id="btn-reseed"><svg viewBox="0 0 24 24">${UI.icons.refresh}</svg> 重置数据</button>
          </div>
        </div>

        <div class="card">
          <div class="card-header"><h3 class="card-title">清空所有数据</h3></div>
          <div class="card-body">
            <p style="font-size:var(--text-sm);color:var(--text-secondary);margin-bottom:var(--space-4)">删除所有 CRM 数据。此操作不可撤销。</p>
            <button class="btn btn-danger" id="btn-clear"><svg viewBox="0 0 24 24">${UI.icons.trash}</svg> 清空数据</button>
          </div>
        </div>
      </div>

      <div class="card mt-6">
        <div class="card-header"><h3 class="card-title">数据统计</h3></div>
        <div class="card-body">
          <div class="detail-card">
            <div class="detail-field"><div class="field-label">线索数</div><div class="field-value">${Store.count('leads')}</div></div>
            <div class="detail-field"><div class="field-label">客户数</div><div class="field-value">${Store.count('customers')}</div></div>
            <div class="detail-field"><div class="field-label">联系人数</div><div class="field-value">${Store.count('contacts')}</div></div>
            <div class="detail-field"><div class="field-label">商机数</div><div class="field-value">${Store.count('opportunities')}</div></div>
            <div class="detail-field"><div class="field-label">订单数</div><div class="field-value">${Store.count('orders')}</div></div>
            <div class="detail-field"><div class="field-label">合同数</div><div class="field-value">${Store.count('contracts')}</div></div>
            <div class="detail-field"><div class="field-label">跟进记录数</div><div class="field-value">${Store.count('followups')}</div></div>
            <div class="detail-field"><div class="field-label">产品数</div><div class="field-value">${Store.count('products')}</div></div>
          </div>
        </div>
      </div>
    `;

    // 导出
    el.querySelector('#btn-export').addEventListener('click', () => {
      const data = Store.exportAll();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `crm-data-${Helpers.today()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      UI.toast('数据已导出');
    });

    // 导入
    el.querySelector('#btn-import').addEventListener('click', () => {
      document.getElementById('import-file').click();
    });
    el.querySelector('#import-file').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const data = JSON.parse(evt.target.result);
          UI.confirm({
            title: '导入数据',
            message: '导入将覆盖所有现有数据，确定继续吗？',
            type: 'warning',
            confirmText: '确认导入',
            onConfirm: () => {
              Store.importAll(data);
              UI.toast('数据导入成功');
              this.renderSettings();
            }
          });
        } catch (err) {
          UI.toast('文件格式错误，请选择有效的 JSON 文件', 'error');
        }
      };
      reader.readAsText(file);
    });

    // 重置
    el.querySelector('#btn-reseed').addEventListener('click', () => {
      UI.confirm({
        title: '重置演示数据',
        message: '将清空所有数据并重新注入演示数据，确定继续吗？',
        type: 'warning',
        confirmText: '确认重置',
        onConfirm: () => {
          Store.clear();
          localStorage.removeItem('crm_settings');
          Store._cache = {};
          SeedData.seed();
          UI.toast('演示数据已重置');
          this.renderSettings();
        }
      });
    });

    // 清空
    el.querySelector('#btn-clear').addEventListener('click', () => {
      UI.confirm({
        title: '清空所有数据',
        message: '此操作将删除所有 CRM 数据且不可撤销，确定继续吗？',
        type: 'danger',
        confirmText: '确认清空',
        onConfirm: () => {
          Store.clear();
          UI.toast('所有数据已清空');
          this.renderSettings();
        }
      });
    });

    UI.render(el);
  }
};

// 启动
document.addEventListener('DOMContentLoaded', () => App.init());
