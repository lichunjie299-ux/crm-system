/* ============================================
   CRM 系统 - 售前项目模块
   ============================================ */
const PreSales = {
  COLLECTION: 'preSales',
  _currentUser: '李春洁',
  _mergeMode: false,

  STATUS_MAP: { '待提交': 'gray', '审批中': 'warning', '已通过': 'success', '已驳回': 'danger' },

  FOLLOW_UP_STAGE_MAP: { '跟进中': 'warning', '已签约': 'success', '已暂停': 'default', '已丢单': 'danger', '已拒单': 'danger' },

  renderList(tab) {
    this._currentTab = tab || 'application';

    UI.setPageTitle('售前项目', [{ label: '协同办公', hash: '#/pre-sales' }, { label: '售前项目' }]);

    const el = document.createElement('div');

    // 页头：根据当前tab显示不同操作按钮
    let headerRight = '';
    if (this._currentTab === 'application') {
      headerRight = '<button class="btn btn-primary btn-sm" id="btn-create" style="margin-right:8px"><svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2;vertical-align:middle;margin-right:4px"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>新建售前项目申请</button>' +
        '<button class="btn btn-secondary btn-sm" id="btn-export"><svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2;vertical-align:middle;margin-right:4px"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>导出</button>';
    } else if (this._currentTab === 'opportunity') {
      headerRight = '<button class="btn btn-secondary btn-sm" id="btn-merge-opp" style="margin-right:8px"><svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2;vertical-align:middle;margin-right:4px"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>合并</button>' +
        '<button class="btn btn-secondary btn-sm" id="btn-export-opp"><svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2;vertical-align:middle;margin-right:4px"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>导出</button>';
    }

    el.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-3)">
        <div class="h-scroll-tabs" style="margin-bottom:0">
          <div class="h-scroll-tab ${this._currentTab === 'application' ? 'active' : ''}" data-tab="application">售前申请</div>
          <div class="h-scroll-tab ${this._currentTab === 'opportunity' ? 'active' : ''}" data-tab="opportunity">售前商机</div>
        </div>
        <div style="display:flex;gap:6px">${headerRight}</div>
      </div>
      <div id="tab-content"></div>
    `;

    // Tab 切换
    el.querySelectorAll('.h-scroll-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const newTab = tab.dataset.tab;
        if (newTab !== this._currentTab) {
          this.renderList(newTab);
        }
      });
    });

    // 渲染当前tab内容
    const contentContainer = el.querySelector('#tab-content');
    if (this._currentTab === 'application') {
      this._renderAppList(contentContainer);
    } else {
      this._renderOppList(contentContainer);
    }

    // 绑定新建按钮事件
    const createBtn = el.querySelector('#btn-create');
    if (createBtn) {
      createBtn.addEventListener('click', () => this._handleCreate());
    }

    // 绑定导出按钮事件（售前申请tab）
    const exportBtn = el.querySelector('#btn-export');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this._handleExport());
    }

    // 绑定商机tab操作按钮事件
    const exportOppBtn = el.querySelector('#btn-export-opp');
    if (exportOppBtn) {
      exportOppBtn.addEventListener('click', () => this._handleOppExport());
    }
    const mergeOppBtn = el.querySelector('#btn-merge-opp');
    if (mergeOppBtn) {
      mergeOppBtn.addEventListener('click', () => this._handleOppMerge());
    }

    UI.render(el);
  },

  _renderAppList(container) {
    const allData = Store.getAll(this.COLLECTION);

    // 筛选选项去重
    const initiators = [...new Set(allData.map(d => d.initiator).filter(Boolean))];
    const collaborators = [...new Set(allData.map(d => d.collaborator).filter(Boolean))];
    const departments = [...new Set(allData.map(d => d.department).filter(Boolean))];

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `<div id="table-container"></div>`;
    const tableContainer = wrapper.querySelector('#table-container');

    const table = Components.DataTable({
      columns: [
        { key: 'preSaleNo', label: '申请编号', width: '120px', render: v => v || '-' },
        { key: 'initiator', label: '发起人', width: '70px', render: v => v || '-' },
        { key: 'customerName', label: '客户名称', width: '120px', render: v => v || '-' },
        { key: 'status', label: '审批状态', width: '70px', render: v => Components.Badge(v || '-', PreSales.STATUS_MAP[v] || 'gray') },
        { key: 'projectStage', label: '项目阶段', width: '110px', render: v => Helpers.escapeHtml(Helpers.truncate(v, 12)) || '-' },
        { key: 'totalAmount', label: '预算', width: '80px', render: v => v ? Helpers.formatMoney(v) : '-' },
        { key: 'expectedLaunchDate', label: '预期上线时间', width: '90px', render: v => v || '-' },
        { key: 'collaborator', label: '售前人员', width: '70px', render: v => v || '-' },
        { key: '_actions', label: '操作', width: '170px', render: (v, item) => {
          if (item.status === '待提交') {
            return (
              '<button class="btn btn-secondary btn-sm action-view" data-id="' + item.id + '">详情</button>' +
              '<button class="btn btn-secondary btn-sm action-edit" data-id="' + item.id + '" style="margin-left:4px">编辑</button>' +
              '<button class="btn btn-primary btn-sm action-submit" data-id="' + item.id + '" style="margin-left:4px">提交</button>'
            );
          } else if (item.status === '审批中') {
            return (
              '<button class="btn btn-secondary btn-sm action-view" data-id="' + item.id + '">详情</button>' +
              '<button class="btn btn-secondary btn-sm action-withdraw" data-id="' + item.id + '" style="margin-left:4px">撤回</button>'
            );
          } else {
            return '<button class="btn btn-secondary btn-sm action-view" data-id="' + item.id + '">详情</button>';
          }
        }},
      ],
      data: allData,
      pageSize: 15,
      searchKeys: ['preSaleNo', 'initiator', 'customerName', 'projectStage', 'collaborator'],
      searchPlaceholder: '搜索编号、发起人、客户、阶段...',
      emptyText: '暂无售前项目记录',
      sortKey: 'appliedAt',
      filterFields: [
        { key: 'preSaleNo', label: '售前申请编号', type: 'text', placeholder: '搜索编号' },
        { key: 'initiator', label: '发起人', type: 'select', placeholder: '全部发起人', options: initiators },
        { key: 'department', label: '发起人部门', type: 'select', placeholder: '全部部门', options: departments },
        { key: 'status', label: '审批状态', type: 'select', placeholder: '全部状态', options: ['待提交', '审批中', '已通过', '已驳回'] },
        { key: 'collaborator', label: '售前人员', type: 'text', placeholder: '搜索售前人员' },
        { key: 'appliedAt', label: '申请时间', type: 'dateRange' },
        { key: 'assignedAt', label: '分配售前时间', type: 'dateRange' },
        { key: 'preSaleStage', label: '售前跟进阶段', type: 'select', placeholder: '全部阶段', options: ['需求分析', '方案设计', '技术交流', 'POC测试', '报价'] },
      ],
    });

    tableContainer.appendChild(table);

    // 事件委托
    wrapper.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-id]');
      if (!btn) return;
      const id = btn.dataset.id;

      if (btn.classList.contains('action-view')) {
        Router.navigate('#/pre-sales/view/' + id);
      } else if (btn.classList.contains('action-edit')) {
        Router.navigate('#/pre-sales/edit/' + id);
      } else if (btn.classList.contains('action-submit')) {
        this._handleSubmit(id);
      } else if (btn.classList.contains('action-withdraw')) {
        this._handleWithdraw(id);
      }
    });

    container.appendChild(wrapper);
  },

  // 查找关联的售前申请
  _getRelatedApp(oppId) {
    const apps = Store.getAll('preSales').filter(p => p.opportunityIds && p.opportunityIds.includes(oppId));
    return apps.length > 0 ? apps[0] : null;
  },

  _renderOppList(container) {
    const opportunities = Store.getAll('opportunities')
      .filter(o => o.status !== '赢单' && o.status !== '输单');

    // ==== 商机简报统计 ====
    const allFollowups = Store.getAll('followups');
    const stats = {
      newAssigned: 0,
      followingUp: 0,
      signed: 0,
      paused: 0,
      lost: 0,
      rejected: 0,
    };

    opportunities.forEach(o => {
      const stage = o.followUpStage;
      if (stage === '跟进中') stats.followingUp++;
      else if (stage === '已签约') stats.signed++;
      else if (stage === '已暂停') stats.paused++;
      else if (stage === '已丢单') stats.lost++;
      else if (stage === '已拒单') stats.rejected++;

      const hasFollowup = allFollowups.some(f => f.relatedType === 'opportunity' && f.relatedId === o.id);
      if (!hasFollowup) stats.newAssigned++;
    });

    const statItems = [
      { key: 'newAssigned', label: '新分配', count: stats.newAssigned, color: '#667eea', tip: '审批通过后分配至该员工名下的售前商机数、管理层操作再次分配的售前商机数，若当前归属人未操作过写跟进，则统计在内，已跟进的不做统计' },
      { key: 'followingUp', label: '跟进中', count: stats.followingUp, color: '#f59e0b', tip: '跟进阶段为跟进中的售前商机数' },
      { key: 'signed', label: '已签约', count: stats.signed, color: '#10b981', tip: '跟进阶段为已签约的售前商机数' },
      { key: 'paused', label: '已暂停', count: stats.paused, color: '#6b7280', tip: '跟进阶段为已暂停的售前商机数' },
      { key: 'lost', label: '已丢单', count: stats.lost, color: '#ef4444', tip: '跟进阶段为已丢单的售前商机数' },
      { key: 'rejected', label: '已拒单', count: stats.rejected, color: '#dc2626', tip: '跟进阶段为已拒单的售前商机数' },
    ];

    const statCards = statItems.map(s => `
      <div style="display:flex;align-items:center;gap:6px;background:#f8f9fa;border-radius:6px;padding:5px 10px;position:relative;cursor:default;flex-shrink:0"
           onmouseenter="this.querySelector('.stat-tip').style.display='block'"
           onmouseleave="this.querySelector('.stat-tip').style.display='none'">
        <span style="font-size:var(--text-xs);color:var(--text-muted);white-space:nowrap">${s.label}</span>
        <span style="font-size:15px;font-weight:700;color:${s.color};line-height:1">${s.count}</span>
        <div class="stat-tip" style="display:none;position:absolute;bottom:calc(100% + 6px);left:50%;transform:translateX(-50%);background:#1f2937;color:#fff;font-size:11px;padding:8px 12px;border-radius:6px;max-width:320px;width:max-content;z-index:10;box-shadow:0 2px 8px rgba(0,0,0,0.15);line-height:1.5;pointer-events:none;text-align:left">
          ${s.tip}
          <div style="position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#1f2937"></div>
        </div>
      </div>
    `).join('');

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <div style="display:flex;gap:6px;margin-bottom:var(--space-2);flex-wrap:wrap" id="opp-stats-bar">
        ${statCards}
      </div>
      <div id="merge-bar" style="display:none;align-items:center;justify-content:space-between;padding:8px 12px;margin-bottom:var(--space-2);background:var(--primary-light);border-radius:var(--radius-md);font-size:var(--text-sm)">
        <span id="merge-bar-info" style="color:var(--primary)">请勾选需要合并的商机（至少选择2个）</span>
        <div>
          <button class="btn btn-secondary btn-sm" id="btn-cancel-merge" style="margin-right:8px">取消合并</button>
          <button class="btn btn-primary btn-sm" id="btn-confirm-merge" disabled>确认合并</button>
        </div>
      </div>
      <div id="opp-table-container"></div>
    `;

    // 选中的合并ID集合
    this._mergeSelection = new Set();

    const RISK_MAP = { '高风险': 'danger', '有风险': 'warning', '无风险': 'success' };

    const table = Components.DataTable({
      columns: [
        { key: '_checkbox', label: '', width: '36px', render: (v, item) => {
          return '<input type="checkbox" class="opp-merge-cb" data-id="' + item.id + '" style="display:' + (this._mergeMode ? 'inline-block' : 'none') + '">';
        }},
        { key: 'preSaleNo', label: '售前申请编号', width: '115px', render: (v, item) => {
          const app = this._getRelatedApp(item.id);
          return app ? (app.preSaleNo || '-') : '-';
        }},
        { key: 'name', label: '项目名称', width: '150px', render: (v, item) => {
          return '<span class="cell-link opp-name-link" data-opp-id="' + item.id + '">' + Helpers.escapeHtml(v || '-') + '</span>';
        }},
        { key: 'customerName', label: '客户名称', width: '120px', render: (v, item) => {
          const app = this._getRelatedApp(item.id);
          return Helpers.escapeHtml(app ? (app.customerName || '-') : '-');
        }},
        { key: 'followUpStage', label: '跟进阶段', width: '80px', render: v => {
          const stageType = PreSales.FOLLOW_UP_STAGE_MAP[v] || 'default';
          return Components.Badge(v || '-', stageType);
        }},
        { key: 'riskLevel', label: '风险项目', width: '75px', render: v => {
          return v ? Components.Badge(v, RISK_MAP[v] || 'gray') : '-';
        }},
        { key: 'amount', label: '预计成交金额', width: '95px', render: v => v ? Helpers.formatMoney(v) : '-' },
        { key: 'collaborator', label: '售前协作人', width: '80px', render: (v, item) => {
          if (v) return Helpers.escapeHtml(v);
          const app = this._getRelatedApp(item.id);
          return Helpers.escapeHtml(app ? (app.collaborator || '-') : '-');
        }},
        { key: 'initiator', label: '售前发起人', width: '80px', render: (v, item) => {
          if (v) return Helpers.escapeHtml(v);
          const app = this._getRelatedApp(item.id);
          return Helpers.escapeHtml(app ? (app.initiator || '-') : '-');
        }},
        { key: '_actions', label: '操作', width: '180px', render: (v, item) => {
          return (
            '<button class="btn btn-text btn-sm action-opp-followup" data-id="' + item.id + '" style="margin-right:2px">写跟进</button>' +
            '<button class="btn btn-text btn-sm action-opp-edit" data-id="' + item.id + '" style="margin-right:2px">编辑</button>' +
            '<button class="btn btn-text btn-sm action-opp-detail" data-id="' + item.id + '" style="margin-right:2px">详情页</button>' +
            '<button class="btn btn-text btn-sm action-opp-delete" data-id="' + item.id + '" style="color:var(--danger)">删除</button>'
          );
        }},
      ],
      data: opportunities,
      pageSize: 15,
      searchKeys: ['name', 'followUpStage', 'riskLevel'],
      searchPlaceholder: '搜索项目名称...',
      emptyText: '暂无售前商机',
      sortKey: 'name',
      defaultVisibleFilters: 4,
      filterFields: [
        { key: 'preSaleNo', label: '售前申请编号', type: 'text', placeholder: '搜索编号',
          customFilter: (item, val) => {
            if (!val) return true;
            const app = PreSales._getRelatedApp(item.id);
            const fv = app ? (app.preSaleNo || '') : '';
            return String(fv).toLowerCase().includes(String(val).toLowerCase());
          }
        },
        { key: 'customerName', label: '客户名称', type: 'text', placeholder: '搜索客户',
          customFilter: (item, val) => {
            if (!val) return true;
            const app = PreSales._getRelatedApp(item.id);
            const fv = app ? (app.customerName || '') : '';
            return String(fv).toLowerCase().includes(String(val).toLowerCase());
          }
        },
        { key: 'followUpStage', label: '跟进阶段', type: 'select', placeholder: '全部阶段',
          options: ['跟进中', '已签约', '已暂停', '已丢单', '已拒单']
        },
        { key: 'riskLevel', label: '风险项目', type: 'select', placeholder: '全部风险',
          options: ['高风险', '有风险', '无风险']
        },
        { key: 'collaborator', label: '售前协作人', type: 'text', placeholder: '搜索协作人' },
        { key: 'initiator', label: '售前发起人', type: 'text', placeholder: '搜索发起人' },
      ],
    });

    wrapper.querySelector('#opp-table-container').appendChild(table);

    // 事件委托：商机操作按钮
    wrapper.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-id]');
      if (!btn) return;
      const id = btn.dataset.id;

      if (btn.classList.contains('action-opp-followup')) {
        this._handleOppFollowUp(id);
      } else if (btn.classList.contains('action-opp-edit')) {
        this._handleOppEdit(id);
      } else if (btn.classList.contains('action-opp-detail')) {
        this._handleOppDetail(id);
      } else if (btn.classList.contains('action-opp-delete')) {
        this._handleOppDelete(id);
      }
    });

    // 客户名称链接跳转
    wrapper.addEventListener('click', (e) => {
      const link = e.target.closest('[data-href]');
      if (link) { e.stopPropagation(); Router.navigate(link.dataset.href); }
    });

    // 项目名称点击弹出侧边栏
    wrapper.addEventListener('click', (e) => {
      const nameLink = e.target.closest('.opp-name-link');
      if (nameLink) {
        e.stopPropagation();
        const oppId = nameLink.dataset.oppId;
        this._showOppSidebar(oppId);
      }
    });

    // 合并模式下复选框变更监听
    wrapper.addEventListener('change', (e) => {
      if (e.target.classList.contains('opp-merge-cb')) {
        const id = e.target.dataset.id;
        if (e.target.checked) {
          this._mergeSelection.add(id);
        } else {
          this._mergeSelection.delete(id);
        }
        this._updateMergeBar();
      }
    });

    container.appendChild(wrapper);
  },

  _updateMergeBar() {
    const bar = document.querySelector('#merge-bar');
    if (!bar) return;
    const info = bar.querySelector('#merge-bar-info');
    const confirmBtn = bar.querySelector('#btn-confirm-merge');
    const count = this._mergeSelection.size;
    if (count < 2) {
      info.textContent = count === 0 ? '请勾选需要合并的商机（至少选择2个）' : '已选择 ' + count + ' 个，请继续选择（至少2个）';
      confirmBtn.disabled = true;
    } else {
      info.textContent = '已选择 ' + count + ' 个商机，可以合并';
      confirmBtn.disabled = false;
    }
  },

  // ==========================================
  // 售前商机操作
  // ==========================================

  _handleOppFollowUp(id) {
    const opp = Store.getById('opportunities', id);
    if (!opp) return;

    UI.formModal({
      title: '写跟进 - ' + Helpers.escapeHtml(opp.name),
      size: 'default',
      fields: [
        { key: 'followUpDate', label: '跟进时间', type: 'date', required: true, default: Helpers.today() },
        { key: 'durationHours', label: '跟进时长（小时）', type: 'number', placeholder: '如：1.5', step: '0.5', min: 0 },
        { key: 'content', label: '跟进内容', type: 'textarea', required: true, fullWidth: true, placeholder: '记录跟进详情...', rows: 4 },
        { key: 'attachment', label: '附件', type: 'file', fullWidth: true },
      ],
      onSubmit: (formData) => {
        formData.type = '跟进';
        formData.relatedType = 'opportunity';
        formData.relatedId = id;
        Store.create('followups', formData);
        UI.toast('跟进记录已添加', 'success');

        // 刷新当前列表
        this.renderList();
      },
    });
  },

  _handleOppEdit(id) {
    // 跳转到商机详情页，该页面有编辑能力
    Router.navigate('#/opportunities/view/' + id);
  },

  _handleOppDetail(id) {
    // 跳转到售前商机详情页
    Router.navigate('#/pre-sales/view/' + id);
  },

  _handleOppDelete(id) {
    const opp = Store.getById('opportunities', id);
    if (!opp) return;
    UI.confirm({
      title: '删除商机',
      message: '确定要删除商机「' + Helpers.escapeHtml(opp.name) + '」吗？删除后不可恢复。',
      type: 'danger',
      confirmText: '确认删除',
      onConfirm: () => {
        Store.delete('opportunities', id);
        UI.toast('商机已删除', 'info');
        this.renderList();
      },
    });
  },

  _handleOppExport() {
    const opportunities = Store.getAll('opportunities')
      .filter(o => o.status !== '赢单' && o.status !== '输单');

    if (opportunities.length === 0) {
      UI.toast('暂无数据可导出', 'warning');
      return;
    }

    const headers = ['售前申请编号', '商机渠道', '客户名称', '品牌名', '项目名称', '跟进阶段', '风险项目', '预计成交金额', '售前协作人', '采购类型', '业务类型', '业务场景', '客户分类', '新老客类型', '行业', '系统底座', '其他底座', '项目背景', '成单预测'];
    const keys = ['_preSaleNo', 'channel', '_customerName', '_brandName', 'name', 'followUpStage', 'riskLevel', 'amount', '_collaborator', 'purchaseType', 'bizType', 'bizScenario', 'customerCategory', '_isNewCustomer', '_industry', 'systemBase', 'otherBase', '_projectBg', 'winPrediction'];

    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '';
      const str = String(val);
      if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return '"' + str.replace(/"/g, '""') + '"';
      }
      return str;
    };

    const rows = opportunities.map(item => {
      const app = this._getRelatedApp(item.id);
      return keys.map(key => {
        let val;
        if (key === '_preSaleNo') val = app ? (app.preSaleNo || '') : '';
        else if (key === '_customerName') val = app ? (app.customerName || '') : '';
        else if (key === '_brandName') val = app ? (app.brandName || '') : '';
        else if (key === '_collaborator') val = app ? (app.collaborator || '') : '';
        else if (key === '_isNewCustomer') val = app ? (app.isNewCustomer || '') : '';
        else if (key === '_industry') val = app ? (app.industry || '') : '';
        else if (key === '_projectBg') val = app ? (app.projectBackground || '') : '';
        else if (key === 'amount') val = item.amount ? Helpers.formatMoney(item.amount) : '';
        else val = item[key] || '';
        return escapeCsv(val);
      }).join(',');
    });

    const csvContent = '﻿' + headers.join(',') + '\n' + rows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = '售前商机_' + Helpers.today() + '.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    UI.toast('导出成功，共 ' + opportunities.length + ' 条记录', 'success');
  },

  _handleOppMerge() {
    if (this._mergeMode) {
      // 退出合并模式
      this._exitMergeMode();
    } else {
      // 进入合并模式
      this._mergeMode = true;
      this._mergeSelection = new Set();

      // 显示复选框和合并栏
      document.querySelectorAll('.opp-merge-cb').forEach(cb => { cb.style.display = 'inline-block'; });
      const mergeBar = document.querySelector('#merge-bar');
      if (mergeBar) mergeBar.style.display = 'flex';

      // 更新合并按钮文字
      const mergeBtn = document.querySelector('#btn-merge-opp');
      if (mergeBtn) mergeBtn.textContent = '取消合并';

      // 绑定确认合并按钮
      const confirmBtn = document.querySelector('#btn-confirm-merge');
      if (confirmBtn) {
        confirmBtn.onclick = () => this._executeMerge();
      }
      const cancelBtn = document.querySelector('#btn-cancel-merge');
      if (cancelBtn) {
        cancelBtn.onclick = () => this._exitMergeMode();
      }
    }
  },

  _exitMergeMode() {
    this._mergeMode = false;
    this._mergeSelection = new Set();

    document.querySelectorAll('.opp-merge-cb').forEach(cb => {
      cb.style.display = 'none';
      cb.checked = false;
    });
    const mergeBar = document.querySelector('#merge-bar');
    if (mergeBar) mergeBar.style.display = 'none';

    const mergeBtn = document.querySelector('#btn-merge-opp');
    if (mergeBtn) mergeBtn.textContent = '合并';
  },

  _showOppSidebar(oppId) {
    const opp = Store.getById('opportunities', oppId);
    if (!opp) return;

    const customer = Store.getById('customers', opp.customerId);
    const cName = customer ? customer.name : '-';
    const products = (opp.intendedProducts || []).map(p => p.product + (p.edition ? '-' + p.edition : '')).join('、') || '-';

    // 关联的售前申请
    const relatedApps = Store.getAll('preSales').filter(p => p.opportunityIds && p.opportunityIds.includes(oppId));

    // 关联的跟进记录
    const followups = Store.getAll('followups')
      .filter(f => f.relatedType === 'opportunity' && f.relatedId === oppId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // 移除已存在的侧边栏
    document.querySelector('.drawer-overlay')?.remove();
    document.querySelector('.drawer-panel')?.remove();

    // 遮罩层
    const overlay = document.createElement('div');
    overlay.className = 'drawer-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.3);z-index:999;animation:fadeIn 0.2s';

    // 抽屉面板
    const panel = document.createElement('div');
    panel.className = 'drawer-panel';
    panel.style.cssText = 'position:fixed;top:56px;right:-480px;bottom:0;width:480px;background:var(--bg-body,#f0f2f5);z-index:1000;box-shadow:-4px 0 16px rgba(0,0,0,0.12);display:flex;flex-direction:column;overflow:hidden;transition:right 0.25s ease';

    const e = (v, def) => v ? Helpers.escapeHtml(String(v)) : (def || '-');
    const fmt = (v) => v ? Helpers.formatMoney(v) : '-';
    const badge = (v, map) => Components.Badge(v || '-', (map || {})[v] || 'gray');

    // 发起人：取客户销售归属人
    const initiatorName = customer ? customer.assignee || customer.salesOwner || '-' : '-';
    // 售前协作人：从关联售前申请中取
    const collaboratorNames = [...new Set(relatedApps.map(a => a.collaborator).filter(Boolean))];
    const collaboratorName = collaboratorNames.length > 0 ? collaboratorNames.join('、') : '-';
    // 预期上线时间：从关联售前申请中取
    const launchDates = relatedApps.map(a => a.expectedLaunchDate).filter(Boolean).sort();
    const expectedLaunchDate = launchDates.length > 0 ? launchDates[launchDates.length - 1] : '-';

    const app = relatedApps.length > 0 ? relatedApps[0] : null;

    // 预先获取所有关联数据
    const appPreSaleNo = app ? e(app.preSaleNo) : '-';
    const appCustomerName = app ? e(app.customerName) : '-';
    const appBrandName = app ? e(app.brandName) : '-';
    const appIndustry = app ? e(app.industry) : '-';
    const appIsNew = app ? e(app.isNewCustomer) : '-';
    const appCollaborator = app ? e(app.collaborator) : '-';
    const appInitiator = app ? e(app.initiator) : '-';
    const appDepartment = app ? e(app.department) : '-';
    const appAssignedAt = app && app.assignedAt ? Helpers.formatDate(app.assignedAt) : '-';
    const appProjectBg = app ? e(Helpers.truncate(app.projectBackground, 60)) : '-';

    // 跟进记录
    let followupHtml = '';
    if (followups.length === 0) {
      followupHtml = '<div style="padding:16px 0;text-align:center;color:var(--text-muted);font-size:var(--text-sm)">暂无跟进记录</div>';
    } else {
      followupHtml = followups.slice(0, 10).map(f => {
        const typeColor = { '电话': 'primary', '拜访': 'success', '邮件': 'info', '微信': 'success', '会议': 'warning', '其他': 'gray' };
        const meta = [];
        if (f.followUpDate) meta.push('跟进时间：' + Helpers.formatDate(f.followUpDate));
        if (f.durationHours) meta.push('时长：' + f.durationHours + '小时');
        return '<div style="padding:8px 0;border-bottom:1px solid var(--border-light)">' +
          '<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">' +
          Components.Badge(e(f.type), typeColor[f.type] || 'gray') +
          '<span style="font-size:11px;color:var(--text-muted)">' + Helpers.formatRelativeTime(f.createdAt) + '</span>' +
          '</div>' +
          '<div style="font-size:var(--text-sm);color:var(--text);line-height:1.5">' + Helpers.escapeHtml(Helpers.truncate(f.content, 120)) + '</div>' +
          (meta.length > 0 ? '<div style="font-size:11px;color:var(--text-muted);margin-top:2px">' + meta.join(' · ') + '</div>' : '') +
          (f.attachment ? '<div style="font-size:11px;color:var(--primary);margin-top:2px">📎 ' + Helpers.escapeHtml(f.attachment) + '</div>' : '') +
          '</div>';
      }).join('');
      if (followups.length > 10) {
        followupHtml += '<div style="padding:8px 0;text-align:center;color:var(--text-muted);font-size:var(--text-xs)">仅显示最近 10 条，共 ' + followups.length + ' 条</div>';
      }
    }

    // 售前申请
    let appHtml = '';
    if (relatedApps.length === 0) {
      appHtml = '<div style="padding:16px 0;text-align:center;color:var(--text-muted);font-size:var(--text-sm)">暂无关联售前申请</div>';
    } else {
      appHtml = relatedApps.map(a => {
        return '<div style="padding:8px 0;border-bottom:1px solid var(--border-light);font-size:var(--text-sm)">' +
          '<div style="display:flex;align-items:center;gap:6px;margin-bottom:2px">' +
          '<span class="cell-link" data-href="#/pre-sales/view/' + a.id + '" style="font-weight:500">' + e(a.preSaleNo) + '</span>' +
          badge(a.status, PreSales.STATUS_MAP) +
          '</div>' +
          '<div style="color:var(--text-secondary)">' + e(a.customerName) + (a.brandName ? ' · ' + e(a.brandName) : '') + '</div>' +
          '<div style="color:var(--text-muted);font-size:11px;margin-top:2px">申请时间：' + (a.appliedAt ? Helpers.formatDate(a.appliedAt) : '-') + '</div>' +
          '</div>';
      }).join('');
    }

    // 基础字段渲染函数
    const ff = (label, val) => `<div class="detail-field" style="display:flex;padding:3px 0;font-size:var(--text-sm);min-width:0">
      <span style="width:76px;color:var(--text-muted);flex-shrink:0">${label}</span>
      <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${val}</span>
    </div>`;

    const RISK_MAP = { '高风险': 'danger', '有风险': 'warning', '无风险': 'success' };

    panel.innerHTML = `
      <div style="padding:14px 20px 10px;border-bottom:1px solid var(--border-light);background:#fff;flex-shrink:0">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
          <div style="display:flex;align-items:center;gap:8px;min-width:0">
            <h3 style="font-size:var(--text-base);font-weight:600;margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${e(opp.name)}</h3>
            ${badge(opp.followUpStage, PreSales.FOLLOW_UP_STAGE_MAP)}
          </div>
          <button class="btn btn-text" id="btn-close-drawer" style="font-size:18px;padding:4px 8px;flex-shrink:0">✕</button>
        </div>
        <div style="display:flex;gap:6px">
          <button class="btn btn-primary btn-sm action-opp-followup" data-id="${opp.id}" style="font-size:12px;height:28px;padding:0 12px"><svg viewBox="0 0 24 24" style="width:12px;height:12px;stroke:currentColor;fill:none;stroke-width:2;vertical-align:middle;margin-right:3px"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>写跟进</button>
          <button class="btn btn-secondary btn-sm action-opp-edit" data-id="${opp.id}" style="font-size:12px;height:28px;padding:0 12px"><svg viewBox="0 0 24 24" style="width:12px;height:12px;stroke:currentColor;fill:none;stroke-width:2;vertical-align:middle;margin-right:3px"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>编辑</button>
          <button class="btn btn-secondary btn-sm action-opp-detail" data-id="${opp.id}" style="font-size:12px;height:28px;padding:0 12px"><svg viewBox="0 0 24 24" style="width:12px;height:12px;stroke:currentColor;fill:none;stroke-width:2;vertical-align:middle;margin-right:3px"><polyline points="9 18 15 12 9 6"/></svg>详情页</button>
        </div>
      </div>

      <div style="flex:1;overflow-y:auto;padding:12px 16px">

        <!-- 项目信息 -->
        <div class="card" style="margin-bottom:10px">
          <div class="card-header" style="padding:8px 14px"><h4 style="font-size:var(--text-xs);margin:0;color:var(--primary)">项目信息</h4></div>
          <div class="card-body" style="padding:8px 14px">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0 8px">
              ${ff('项目名称', '<span style="font-weight:500">' + e(opp.name) + '</span>')}
              ${ff('商机渠道', opp.channel ? '<span style="color:var(--primary)">' + e(opp.channel) + '</span>' : '-')}
              ${ff('客户名称', appCustomerName)}
              ${ff('品牌名', appBrandName)}
              ${ff('客户分类', e(opp.customerCategory))}
              ${ff('行业', appIndustry)}
              ${ff('新老客类型', appIsNew)}
              ${ff('采购类型', e(opp.purchaseType))}
              ${ff('业务类型', e(opp.bizType))}
              ${ff('业务场景', e(opp.bizScenario))}
              ${ff('跟进阶段', badge(opp.followUpStage, PreSales.FOLLOW_UP_STAGE_MAP))}
              ${ff('风险项目', opp.riskLevel ? badge(opp.riskLevel, RISK_MAP) : '-')}
              ${ff('预计成交金额', opp.amount ? '<strong style="color:var(--primary)">' + fmt(opp.amount) + '</strong>' : '-')}
              ${ff('售前申请编号', appPreSaleNo)}
              ${ff('售前协作人', appCollaborator)}
              ${ff('售前发起人', appInitiator)}
              ${ff('发起人部门', appDepartment)}
              ${ff('首次接触时间', appAssignedAt)}
              ${ff('系统底座', e(opp.systemBase))}
              ${ff('其他底座', e(opp.otherBase))}
              ${ff('项目背景', appProjectBg)}
              ${ff('成单预测', e(opp.winPrediction))}
            </div>
          </div>
        </div>

        <!-- 售前申请信息 -->
        <div class="card" style="margin-bottom:10px">
          <div class="card-header" style="padding:8px 14px;display:flex;align-items:center;justify-content:space-between">
            <h4 style="font-size:var(--text-xs);margin:0;color:var(--primary)">售前申请信息</h4>
            <span style="font-size:11px;color:var(--text-muted)">${relatedApps.length} 条</span>
          </div>
          <div class="card-body" style="padding:4px 14px 8px">
            ${appHtml}
          </div>
        </div>

        <!-- 跟进记录 -->
        <div class="card" style="margin-bottom:10px">
          <div class="card-header" style="padding:8px 14px;display:flex;align-items:center;justify-content:space-between">
            <h4 style="font-size:var(--text-xs);margin:0;color:var(--primary)">跟进记录</h4>
            <span style="font-size:11px;color:var(--text-muted)">${followups.length} 条</span>
          </div>
          <div class="card-body" style="padding:4px 14px 8px">
            ${followupHtml}
          </div>
        </div>

      </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(panel);

    // 动画：滑入
    requestAnimationFrame(() => { panel.style.right = '0'; });

    // 遮罩点击关闭
    overlay.addEventListener('click', () => this._closeOppSidebar(overlay, panel));
    panel.querySelector('#btn-close-drawer').addEventListener('click', () => this._closeOppSidebar(overlay, panel));

    // 侧边栏内的链接跳转和快捷操作
    panel.addEventListener('click', (e) => {
      const link = e.target.closest('[data-href]');
      if (link) {
        e.stopPropagation();
        this._closeOppSidebar(overlay, panel);
        Router.navigate(link.dataset.href);
        return;
      }
      const btn = e.target.closest('button[data-id]');
      if (btn) {
        e.stopPropagation();
        const id = btn.dataset.id;
        this._closeOppSidebar(overlay, panel);
        if (btn.classList.contains('action-opp-followup')) {
          this._handleOppFollowUp(id);
        } else if (btn.classList.contains('action-opp-edit')) {
          this._handleOppEdit(id);
        } else if (btn.classList.contains('action-opp-detail')) {
          this._handleOppDetail(id);
        }
      }
    });
  },

  _closeOppSidebar(overlay, panel) {
    panel.style.right = '-480px';
    setTimeout(() => {
      overlay.remove();
      panel.remove();
    }, 250);
  },

  _executeMerge() {
    const selectedIds = [...this._mergeSelection];
    if (selectedIds.length < 2) {
      UI.toast('请至少选择2个商机进行合并', 'warning');
      return;
    }

    const selectedOpps = selectedIds.map(id => Store.getById('opportunities', id)).filter(Boolean);

    // 构建选择主商机的对话框
    let optionsHtml = selectedOpps.map((o, i) => {
      const customer = Store.getById('customers', o.customerId);
      const cname = customer ? customer.name : '未知客户';
      return '<label style="display:flex;align-items:center;gap:8px;padding:8px 12px;border:1px solid var(--border-light);border-radius:var(--radius-md);margin-bottom:6px;cursor:pointer;font-size:var(--text-sm)">' +
        '<input type="radio" name="master-opp" value="' + i + '" ' + (i === 0 ? 'checked' : '') + '>' +
        '<strong>' + Helpers.escapeHtml(o.name) + '</strong> — ' + Helpers.escapeHtml(cname) + '，金额：' + Helpers.formatMoney(o.amount) +
        '</label>';
    }).join('');

    const content = document.createElement('div');
    content.innerHTML = `
      <p style="font-size:var(--text-sm);color:var(--text-secondary);margin-bottom:var(--space-3)">选择了 ${selectedIds.length} 个商机，请选择保留下来的主商机：</p>
      ${optionsHtml}
    `;

    const footer = '<button class="btn btn-secondary" data-close-modal>取消</button><button class="btn btn-primary" id="btn-do-merge">确认合并</button>';

    const { overlay, close } = UI.modal({ title: '合并商机', content, footer, size: 'sm' });

    overlay.querySelector('#btn-do-merge').addEventListener('click', () => {
      const selected = overlay.querySelector('input[name="master-opp"]:checked');
      if (!selected) { UI.toast('请选择主商机', 'warning'); return; }

      const masterIdx = parseInt(selected.value);
      const master = selectedOpps[masterIdx];
      const slaves = selectedOpps.filter((_, i) => i !== masterIdx);

      // 合并数据：将 slave 的名称追加到 master 的备注中
      const slaveNames = slaves.map(s => s.name).join('、');
      const mergedNotes = [
        master.notes || '',
        '【合并来源】合并了以下商机：' + slaveNames,
        ...slaves.map(s => s.notes || '').filter(Boolean),
      ].filter(Boolean).join('\n');

      // 更新主商机（合并金额和备注）
      const totalAmount = selectedOpps.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
      Store.update('opportunities', master.id, {
        amount: totalAmount,
        notes: mergedNotes,
      });

      // 删除被合并的商机
      slaves.forEach(s => {
        Store.delete('opportunities', s.id);
      });

      close();
      this._exitMergeMode();
      UI.toast('合并成功，主商机：' + Helpers.escapeHtml(master.name) + '，合并了 ' + slaves.length + ' 个商机', 'success');
      this.renderList();
    });
  },

  // ==========================================
  // 模态框表单（替代原来的全页表单）
  // ==========================================

  _openFormModal(id) {
    const isEdit = !!id;
    const existing = isEdit ? Store.getById(this.COLLECTION, id) : null;
    const title = isEdit ? '编辑售前项目申请' : '新建售前项目申请';

    const content = document.createElement('div');
    content.style.cssText = 'overflow-y:auto;';
    const e = (v, def) => existing && existing[v] ? Helpers.escapeHtml(existing[v]) : (def || '');
    const checked = (field, val) => existing && existing[field] === val ? 'checked' : '';
    const selected = (field, val) => existing && existing[field] === val ? 'selected' : '';

    content.innerHTML = `
      <!-- ======== 1. 申请人信息 ======== -->
      <div class="card" style="margin-bottom:var(--space-2)">
        <div class="card-header" style="padding:var(--space-2) var(--space-3)"><h3 class="card-title" style="font-size:var(--text-sm)">申请人信息</h3></div>
        <div class="card-body" style="padding:var(--space-2) var(--space-3)">
          <div class="form-grid" style="grid-template-columns:1fr 1fr;gap:var(--space-2)">
            <div class="form-group">
              <label class="form-label" style="font-size:var(--text-xs)">发起人</label>
              <input type="text" class="form-input" value="李春洁" readonly style="background:var(--gray-50);color:var(--text-secondary);font-size:var(--text-sm);padding:6px 10px">
            </div>
            <div class="form-group">
              <label class="form-label" style="font-size:var(--text-xs)">发起人部门</label>
              <input type="text" class="form-input" value="销售部" readonly style="background:var(--gray-50);color:var(--text-secondary);font-size:var(--text-sm);padding:6px 10px">
            </div>
          </div>
        </div>
      </div>

      <!-- ======== 2. 客户信息 ======== -->
      <div class="card" style="margin-bottom:var(--space-2)">
        <div class="card-header" style="padding:var(--space-2) var(--space-3)"><h3 class="card-title" style="font-size:var(--text-sm)">客户信息</h3></div>
        <div class="card-body" style="padding:var(--space-2) var(--space-3)">
          <!-- 第1行：客户名称 + 是否新客 -->
          <div class="form-grid" style="grid-template-columns:1fr 1fr;gap:var(--space-2);margin-bottom:var(--space-2)">
            <div class="form-group">
              <label class="form-label" style="font-size:var(--text-xs)">客户名称 <span class="required-asterisk">*</span></label>
              <div style="display:flex;gap:6px;align-items:center">
                <input type="text" id="selected-customer-name" class="form-input" readonly placeholder="点击选择客户" style="flex:1;cursor:pointer;background:var(--gray-50);font-size:var(--text-sm);padding:6px 10px" value="${e('customerName')}">
                <button class="btn btn-text" id="btn-clear-customer" style="font-size:var(--text-sm);padding:4px;${existing && existing.customerId ? '' : 'display:none'}">清除</button>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label" style="font-size:var(--text-xs)">是否新客 <span class="required-asterisk">*</span></label>
              <div class="horizontal-radio-group" style="gap:8px">
                <label style="font-size:var(--text-sm)"><input type="radio" name="isNewCustomer" value="新客" ${checked('isNewCustomer', '新客')}> 新客</label>
                <label style="font-size:var(--text-sm)"><input type="radio" name="isNewCustomer" value="老客" ${checked('isNewCustomer', '老客')}> 老客</label>
              </div>
            </div>
          </div>

          <!-- 第2行：品牌名 + 所属行业 -->
          <div class="form-grid" style="grid-template-columns:1fr 1fr;gap:var(--space-2);margin-bottom:var(--space-2)">
            <div class="form-group">
              <label class="form-label" style="font-size:var(--text-xs)">品牌名 <span class="required-asterisk">*</span></label>
              <input type="text" id="form-brand" class="form-input" placeholder="选择客户后自动带出或手动填写" style="font-size:var(--text-sm);padding:6px 10px" value="${e('brandName')}">
            </div>
            <div class="form-group">
              <label class="form-label" style="font-size:var(--text-xs)">所属行业 <span class="required-asterisk">*</span></label>
              <input type="text" id="form-industry" class="form-input" readonly placeholder="选择客户后自动带出" style="background:var(--gray-50);font-size:var(--text-sm);padding:6px 10px" value="${e('industry')}">
            </div>
          </div>

          <!-- 第3行：当前小程序服务商 + 当前CRM服务商 -->
          <div class="form-grid" style="grid-template-columns:1fr 1fr;gap:var(--space-2);margin-bottom:var(--space-2)">
            <div class="form-group">
              <label class="form-label" style="font-size:var(--text-xs)">当前小程序服务商 <span class="required-asterisk">*</span></label>
              <input type="text" id="form-miniapp-provider" class="form-input" placeholder="手动填写" style="font-size:var(--text-sm);padding:6px 10px" value="${e('currentMiniProgramProvider')}">
            </div>
            <div class="form-group">
              <label class="form-label" style="font-size:var(--text-xs)">当前CRM服务商 <span class="required-asterisk">*</span></label>
              <input type="text" id="form-crm-provider" class="form-input" placeholder="手动填写" style="font-size:var(--text-sm);padding:6px 10px" value="${e('currentCRMProvider')}">
            </div>
          </div>

          <!-- 第4行：当前企微助手服务商 + 在项目中存在竞品 -->
          <div class="form-grid" style="grid-template-columns:1fr 1fr;gap:var(--space-2);margin-bottom:var(--space-2)">
            <div class="form-group">
              <label class="form-label" style="font-size:var(--text-xs)">当前企微助手服务商 <span class="required-asterisk">*</span></label>
              <input type="text" id="form-wecom-provider" class="form-input" placeholder="手动填写" style="font-size:var(--text-sm);padding:6px 10px" value="${e('currentWecomProvider')}">
            </div>
            <div class="form-group">
              <label class="form-label" style="font-size:var(--text-xs)">在项目中存在竞品 <span class="required-asterisk">*</span></label>
              <input type="text" id="form-competitor" class="form-input" placeholder="如有请填写竞品名称" style="font-size:var(--text-sm);padding:6px 10px" value="${e('competitor')}">
            </div>
          </div>

          <!-- 第5行：更换服务商核心原因（跨两列） -->
          <div class="form-grid" style="grid-template-columns:1fr 1fr;gap:var(--space-2)">
            <div class="form-group" style="grid-column:1 / -1">
              <label class="form-label" style="font-size:var(--text-xs)">更换服务商核心原因 <span class="required-asterisk">*</span></label>
              <input type="text" id="form-switch-reason" class="form-input" placeholder="当前无对应服务商可填写无" style="font-size:var(--text-sm);padding:6px 10px" value="${e('switchReason')}">
            </div>
          </div>

          <input type="hidden" id="form-customer-id" value="${existing && existing.customerId ? Helpers.escapeHtml(existing.customerId) : ''}">
          <input type="hidden" id="form-customer-region" value="${e('region')}">
        </div>
      </div>

      <!-- ======== 3. 决策信息 ======== -->
      <div class="card" style="margin-bottom:var(--space-2)">
        <div class="card-header" style="padding:var(--space-2) var(--space-3)"><h3 class="card-title" style="font-size:var(--text-sm)">决策信息</h3></div>
        <div class="card-body" style="padding:var(--space-2) var(--space-3)">
          <div class="form-grid" style="grid-template-columns:1fr 1fr;gap:var(--space-2)">
            <div class="form-group">
              <label class="form-label" style="font-size:var(--text-xs)">项目决策流程 <span class="required-asterisk">*</span></label>
              <input type="text" id="form-decision-process" class="form-input" placeholder="如：技术评估→采购审批→高层决策" style="font-size:var(--text-sm);padding:6px 10px" value="${e('decisionProcess')}">
            </div>
            <div class="form-group">
              <label class="form-label" style="font-size:var(--text-xs)">联系人 <span class="required-asterisk">*</span></label>
              <div style="display:flex;gap:6px;align-items:center">
                <input type="text" id="selected-contact-name" class="form-input" readonly placeholder="请先选择客户" style="flex:1;cursor:pointer;background:var(--gray-50);font-size:var(--text-sm);padding:6px 10px" value="${e('contactName')}">
                <button class="btn btn-text" id="btn-clear-contact" style="font-size:var(--text-sm);padding:4px;${existing && existing.contactName ? '' : 'display:none'}">清除</button>
              </div>
            </div>
          </div>

          <!-- 联系人详情 -->
          <div id="contact-detail" class="detail-card" style="margin-top:var(--space-1);${existing && existing.contactId ? '' : 'display:none'}">
            <div class="detail-field" style="padding:2px 0"><span class="field-label" style="font-size:var(--text-xs)">联系人姓名</span><span class="field-value" id="display-contact-name" style="font-size:var(--text-sm)">${e('contactName', '-')}</span></div>
            <div class="detail-field" style="padding:2px 0"><span class="field-label" style="font-size:var(--text-xs)">联系人职务</span><span class="field-value" id="display-contact-title" style="font-size:var(--text-sm)">${e('contactTitle', '-')}</span></div>
            <div class="detail-field" style="padding:2px 0"><span class="field-label" style="font-size:var(--text-xs)">联系方式</span><span class="field-value" id="display-contact-phone" style="font-size:var(--text-sm)">${e('contactPhone', '-')}</span></div>
          </div>

          <input type="hidden" id="form-contact-id" value="${existing && existing.contactId ? Helpers.escapeHtml(existing.contactId) : ''}">
          <input type="hidden" id="form-contact-title" value="${e('contactTitle')}">
          <input type="hidden" id="form-contact-phone" value="${e('contactPhone')}">
        </div>
      </div>

      <!-- ======== 4. 项目信息 ======== -->
      <div class="card" style="margin-bottom:var(--space-2)">
        <div class="card-header" style="padding:var(--space-2) var(--space-3)"><h3 class="card-title" style="font-size:var(--text-sm)">项目信息</h3></div>
        <div class="card-body" style="padding:var(--space-2) var(--space-3)">
          <!-- 项目背景 -->
          <div class="form-group" style="margin-bottom:var(--space-2)">
            <label class="form-label" style="font-size:var(--text-xs)">项目背景 <span class="required-asterisk">*</span></label>
            <textarea id="form-project-background" class="form-textarea" placeholder="请描述项目背景（500字符以内）" rows="2" maxlength="500" style="font-size:var(--text-sm);padding:6px 10px">${e('projectBackground')}</textarea>
            <div style="text-align:right;font-size:11px;color:var(--text-muted);margin-top:1px"><span id="bg-char-count">${(existing && existing.projectBackground ? existing.projectBackground.length : 0)}</span>/500</div>
          </div>

          <!-- 项目阶段 + 线下门店数：一行 -->
          <div class="form-grid" style="grid-template-columns:1fr 1fr;gap:var(--space-2);margin-bottom:var(--space-2)">
            <div class="form-group" style="text-align:center">
              <label class="form-label" style="font-size:var(--text-xs);display:block">项目阶段 <span class="required-asterisk">*</span></label>
              <select id="form-project-stage" class="form-input" style="font-size:var(--text-sm);padding:6px 10px;width:100%;max-width:280px">
                <option value="">请选择项目阶段</option>
                <option value="需求阶段/未立项/立项中（预算需申请）" ${selected('projectStage', '需求阶段/未立项/立项中（预算需申请）')}>需求阶段/未立项/立项中（预算需申请）</option>
                <option value="完成立项阶段（预算已确定）" ${selected('projectStage', '完成立项阶段（预算已确定）')}>完成立项阶段（预算已确定）</option>
                <option value="选型阶段（招标采购/方案选型）" ${selected('projectStage', '选型阶段（招标采购/方案选型）')}>选型阶段（招标采购/方案选型）</option>
              </select>
            </div>
            <div class="form-group" style="text-align:center">
              <label class="form-label" style="font-size:var(--text-xs);display:block">线下门店数 <span class="required-asterisk">*</span></label>
              <input type="text" id="form-store-count" class="form-input" readonly placeholder="自动带出" style="background:var(--gray-50);font-size:var(--text-sm);padding:6px 10px;width:100%;max-width:280px;text-align:center" value="${e('offlineStoreCount')}">
            </div>
          </div>

          <!-- 业务核心需求 + 前期沟通情况：两列文本域 -->
          <div class="form-grid" style="grid-template-columns:1fr 1fr;gap:var(--space-2);margin-bottom:var(--space-2)">
            <div class="form-group">
              <label class="form-label" style="font-size:var(--text-xs)">业务核心需求 <span class="required-asterisk">*</span></label>
              <textarea id="form-core-needs" class="form-textarea" placeholder="客户业务核心需求（500字符以内）" rows="2" maxlength="500" style="font-size:var(--text-sm);padding:6px 10px">${e('coreNeeds')}</textarea>
              <div style="text-align:right;font-size:11px;color:var(--text-muted);margin-top:1px"><span id="needs-char-count">${(existing && existing.coreNeeds ? existing.coreNeeds.length : 0)}</span>/500</div>
            </div>
            <div class="form-group">
              <label class="form-label" style="font-size:var(--text-xs)">前期沟通情况 <span class="required-asterisk">*</span></label>
              <textarea id="form-prior-communication" class="form-textarea" placeholder="前期沟通情况（500字符以内）" rows="2" maxlength="500" style="font-size:var(--text-sm);padding:6px 10px">${e('priorCommunication')}</textarea>
              <div style="text-align:right;font-size:11px;color:var(--text-muted);margin-top:1px"><span id="comm-char-count">${(existing && existing.priorCommunication ? existing.priorCommunication.length : 0)}</span>/500</div>
            </div>
          </div>

          <!-- 意向产品 -->
          <div class="form-group" style="margin-bottom:var(--space-2)">
            <label class="form-label" style="font-size:var(--text-xs)">意向产品 <span class="required-asterisk">*</span></label>
            <div style="display:flex;gap:6px;align-items:center">
              <input type="text" id="selected-opp-info" class="form-input" readonly placeholder="请先选择客户" style="flex:1;cursor:pointer;background:var(--gray-50);font-size:var(--text-sm);padding:6px 10px" value="${existing && existing.oppNames ? Helpers.escapeHtml(existing.oppNames) : ''}">
              <button class="btn btn-text" id="btn-clear-opportunity" style="font-size:var(--text-sm);padding:4px;${existing && existing.opportunityIds && existing.opportunityIds.length ? '' : 'display:none'}">清除</button>
            </div>
          </div>
          <div id="opportunity-detail" class="detail-card" style="margin-bottom:var(--space-2);${existing && existing.opportunityIds && existing.opportunityIds.length ? '' : 'display:none'}">
            <div class="detail-field" style="padding:2px 0"><span class="field-label" style="font-size:var(--text-xs)">意向产品</span><span class="field-value" id="display-products" style="font-size:var(--text-sm)">${existing && existing.productNames ? Helpers.escapeHtml(existing.productNames) : '-'}</span></div>
            <div class="detail-field" style="padding:2px 0"><span class="field-label" style="font-size:var(--text-xs)">预计成交金额</span><span class="field-value" id="display-amount" style="font-size:var(--text-sm)">${existing && existing.totalAmount ? '<strong style="color:var(--primary)">' + Helpers.formatMoney(existing.totalAmount) + '</strong>' : '-'}</span></div>
          </div>

          <!-- 预期上线时间 + 项目预算 -->
          <div class="form-grid" style="grid-template-columns:1fr 1fr;gap:var(--space-2)">
            <div class="form-group">
              <label class="form-label" style="font-size:var(--text-xs)">预期上线时间 <span class="required-asterisk">*</span></label>
              <input type="month" id="form-launch-date" class="form-input" style="font-size:var(--text-sm);padding:6px 10px" value="${e('expectedLaunchDate')}">
            </div>
            <div class="form-group">
              <label class="form-label" style="font-size:var(--text-xs)">项目预算 <span class="required-asterisk">*</span></label>
              <select id="form-budget" class="form-input" style="font-size:var(--text-sm);padding:6px 10px">
                <option value="">请选择预算范围</option>
                <option value="小于5万元" ${selected('projectBudget', '小于5万元')}>小于5万元</option>
                <option value="5～10万元" ${selected('projectBudget', '5～10万元')}>5～10万元</option>
                <option value="10～20万元" ${selected('projectBudget', '10～20万元')}>10～20万元</option>
                <option value="20～50万元" ${selected('projectBudget', '20～50万元')}>20～50万元</option>
                <option value="50～100万元" ${selected('projectBudget', '50～100万元')}>50～100万元</option>
                <option value="大于100万元" ${selected('projectBudget', '大于100万元')}>大于100万元</option>
              </select>
            </div>
          </div>

          <input type="hidden" id="form-opp-ids" value='${existing && existing.opportunityIds ? JSON.stringify(existing.opportunityIds) : "[]"}'>
          <input type="hidden" id="form-opp-names" value="${e('oppNames')}">
          <input type="hidden" id="form-product-names" value="${e('productNames')}">
          <input type="hidden" id="form-total-amount" value="${existing && existing.totalAmount ? existing.totalAmount : '0'}">
        </div>
      </div>

      <!-- ======== 5. 所需支持 ======== -->
      <div class="card" style="margin-bottom:0">
        <div class="card-header" style="padding:var(--space-2) var(--space-3)"><h3 class="card-title" style="font-size:var(--text-sm)">所需支持</h3></div>
        <div class="card-body" style="padding:var(--space-2) var(--space-3)">
          <div class="form-group" style="margin-bottom:var(--space-2)">
            <label class="form-label" style="font-size:var(--text-xs)">支持分类 <span class="required-asterisk">*</span></label>
            <div class="horizontal-radio-group" style="gap:8px;flex-wrap:wrap">
              <label style="font-size:var(--text-sm)"><input type="radio" name="supportCategory" value="系统演示" ${checked('supportCategory', '系统演示')}> 系统演示</label>
              <label style="font-size:var(--text-sm)"><input type="radio" name="supportCategory" value="功能定制" ${checked('supportCategory', '功能定制')}> 功能定制</label>
              <label style="font-size:var(--text-sm)"><input type="radio" name="supportCategory" value="系统对接" ${checked('supportCategory', '系统对接')}> 系统对接</label>
              <label style="font-size:var(--text-sm)"><input type="radio" name="supportCategory" value="方案设计" ${checked('supportCategory', '方案设计')}> 方案设计</label>
              <label style="font-size:var(--text-sm)"><input type="radio" name="supportCategory" value="招/投标支持" ${checked('supportCategory', '招/投标支持')}> 招/投标支持</label>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label" style="font-size:var(--text-xs)">注意事项 <span class="required-asterisk">*</span></label>
            <textarea id="form-notes" class="form-textarea" placeholder="请描述注意事项或特殊要求（500字符以内）" rows="2" maxlength="500" style="font-size:var(--text-sm);padding:6px 10px">${e('notes')}</textarea>
            <div style="text-align:right;font-size:11px;color:var(--text-muted);margin-top:1px"><span id="notes-char-count">${(existing && existing.notes ? existing.notes.length : 0)}</span>/500</div>
          </div>
        </div>
      </div>
    `;

    // 模态框底部按钮
    const footer = `
      <div style="display:flex;justify-content:center;gap:12px">
        <button class="btn btn-secondary" data-close-modal>取消</button>
        <button class="btn btn-secondary" id="btn-save-draft" style="min-width:120px">保存草稿</button>
        <button class="btn btn-primary" id="btn-submit-apply" style="min-width:120px">提交申请</button>
      </div>
    `;

    const { overlay, close } = UI.modal({ title, content, footer, size: 'lg' });

    // ===== 事件绑定 =====

    // 字符计数
    const bindCharCount = (id, counterId) => {
      const ta = content.querySelector('#' + id);
      const ct = content.querySelector('#' + counterId);
      if (ta && ct) ta.addEventListener('input', () => { ct.textContent = ta.value.length; });
    };
    bindCharCount('form-project-background', 'bg-char-count');
    bindCharCount('form-core-needs', 'needs-char-count');
    bindCharCount('form-prior-communication', 'comm-char-count');
    bindCharCount('form-notes', 'notes-char-count');

    // 客户选择
    content.querySelector('#selected-customer-name').addEventListener('click', () => this._showCustomerSelector(content));
    content.querySelector('#btn-clear-customer').addEventListener('click', () => this._clearCustomer(content));

    // 联系人选择（选择客户后才可点击）
    content.querySelector('#selected-contact-name').addEventListener('click', () => {
      if (content.querySelector('#form-customer-id').value) this._showContactSelector(content);
    });
    content.querySelector('#btn-clear-contact').addEventListener('click', () => this._clearContact(content));

    // 商机选择
    content.querySelector('#selected-opp-info').addEventListener('click', () => {
      if (content.querySelector('#form-customer-id').value) this._showOpportunitySelector(content);
    });
    content.querySelector('#btn-clear-opportunity').addEventListener('click', () => this._clearOpportunity(content));

    // 保存/提交
    const doSave = (status) => {
      this._saveForm(content, status, id, () => {
        close();
        this.renderList();
      });
    };
    overlay.querySelector('#btn-save-draft').addEventListener('click', () => doSave('待提交'));
    overlay.querySelector('#btn-submit-apply').addEventListener('click', () => doSave('审批中'));
  },

  // 在模态框内创建浮动选择面板
  _showInlinePanel(title, htmlContent, modalBody) {
    // 移除已存在的浮动面板
    const existing = modalBody.querySelector('.inline-select-panel');
    if (existing) existing.remove();

    const panel = document.createElement('div');
    panel.className = 'inline-select-panel';
    panel.style.cssText = 'position:absolute;inset:0;background:var(--bg-card);z-index:10;display:flex;flex-direction:column;overflow:hidden;border-radius:var(--radius-lg);';
    panel.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;padding:var(--space-3) var(--space-4);border-bottom:1px solid var(--border-light)">
        <h3 style="font-size:var(--text-sm);font-weight:600;margin:0">${Helpers.escapeHtml(title)}</h3>
        <button class="btn btn-text" id="close-inline-panel" style="font-size:var(--text-sm);padding:4px 8px">✕ 关闭</button>
      </div>
      <div style="flex:1;overflow-y:auto;padding:var(--space-2) var(--space-3)">
        ${htmlContent}
      </div>
    `;

    // 将面板插入到 modal-body 中（覆盖在表单之上）
    modalBody.style.position = 'relative';
    modalBody.appendChild(panel);

    panel.querySelector('#close-inline-panel').addEventListener('click', () => panel.remove());

    return panel;
  },

  _showCustomerSelector(el) {
    const customers = Store.getAll('customers')
      .filter(c => c.assignee === this._currentUser);

    if (customers.length === 0) {
      UI.toast('您名下暂无客户，请先创建客户', 'warning');
      return;
    }

    // 获取 modal-body 作为面板容器
    const modalBody = el.closest('.modal-body');
    if (!modalBody) return;

    let html = '<table class="data-table"><thead><tr><th>客户名称</th><th>客户行业</th><th>所在地区</th></tr></thead><tbody>';
    customers.forEach(c => {
      html += '<tr class="customer-select-row" data-id="' + c.id + '" data-name="' + Helpers.escapeHtml(c.name) + '" data-industry="' + Helpers.escapeHtml(c.industry || '') + '" data-region="' + Helpers.escapeHtml(c.region || '') + '" style="cursor:pointer">';
      html += '<td>' + Helpers.escapeHtml(c.name) + '</td>';
      html += '<td>' + Helpers.escapeHtml(c.industry || '-') + '</td>';
      html += '<td>' + Helpers.escapeHtml(c.region || '-') + '</td>';
      html += '</tr>';
    });
    html += '</tbody></table>';

    const panel = this._showInlinePanel('选择客户', html, modalBody);

    panel.querySelectorAll('.customer-select-row').forEach(row => {
      row.addEventListener('click', () => {
        const id = row.dataset.id;
        const name = row.dataset.name;
        const industry = row.dataset.industry;
        const region = row.dataset.region;

        // 更新隐藏字段
        el.querySelector('#form-customer-id').value = id;
        el.querySelector('#form-customer-region').value = region;

        // 更新展示
        el.querySelector('#selected-customer-name').value = name;
        el.querySelector('#form-industry').value = industry || '';

        // 填充品牌名：从该客户的商机中获取第一个品牌名
        const brandInput = el.querySelector('#form-brand');
        const customerOpps = Store.getAll('opportunities').filter(o => o.customerId === id);
        const brands = [...new Set(customerOpps.map(o => o.brandName).filter(Boolean))];
        if (brands.length > 0) {
          brandInput.value = brands[0];
          brandInput.placeholder = brands.join('、') + '（可手动修改）';
        } else {
          brandInput.value = '';
          brandInput.placeholder = '手动填写品牌名';
        }

        // 填充门店数
        const customer = Store.getById('customers', id);
        el.querySelector('#form-store-count').value = (customer && customer.storeCount) ? customer.storeCount : '';

        // 显示清除按钮
        el.querySelector('#btn-clear-customer').style.display = '';

        el.querySelector('#selected-contact-name').placeholder = '点击选择联系人';
        el.querySelector('#selected-opp-info').placeholder = '点击选择商机';

        // 清除之前选择的联系人和商机
        this._clearContact(el);
        this._clearOpportunity(el);

        panel.remove();
      });
    });
  },

  _clearCustomer(el) {
    el.querySelector('#form-customer-id').value = '';
    el.querySelector('#form-customer-region').value = '';
    el.querySelector('#selected-customer-name').value = '';
    el.querySelector('#form-industry').value = '';
    el.querySelector('#form-store-count').value = '';
    el.querySelector('#btn-clear-customer').style.display = 'none';
    // 清空品牌输入
    el.querySelector('#form-brand').value = '';
    el.querySelector('#form-brand').placeholder = '请先选择客户';
    el.querySelector('#selected-contact-name').placeholder = '请先选择客户';
    el.querySelector('#selected-opp-info').placeholder = '请先选择客户';
    this._clearContact(el);
    this._clearOpportunity(el);
  },

  _showContactSelector(el) {
    const customerId = el.querySelector('#form-customer-id').value;
    if (!customerId) return;

    const contacts = Store.getAll('contacts').filter(c => c.customerId === customerId);

    if (contacts.length === 0) {
      UI.toast('该客户暂无联系人，请先创建联系人', 'warning');
      return;
    }

    const modalBody = el.closest('.modal-body');
    if (!modalBody) return;

    let html = '<table class="data-table"><thead><tr><th>姓名</th><th>职务</th><th>联系方式</th></tr></thead><tbody>';
    contacts.forEach(c => {
      html += '<tr class="contact-select-row" style="cursor:pointer" data-id="' + c.id + '" data-name="' + Helpers.escapeHtml(c.name) + '" data-title="' + Helpers.escapeHtml(c.title || '') + '" data-phone="' + Helpers.escapeHtml(c.phone || '') + '">';
      html += '<td>' + Helpers.escapeHtml(c.name) + '</td>';
      html += '<td>' + Helpers.escapeHtml(c.title || '-') + '</td>';
      html += '<td>' + Helpers.escapeHtml(c.phone || '-') + '</td>';
      html += '</tr>';
    });
    html += '</tbody></table>';

    const panel = this._showInlinePanel('选择联系人', html, modalBody);

    panel.querySelectorAll('.contact-select-row').forEach(row => {
      row.addEventListener('click', () => {
        const id = row.dataset.id;
        const name = row.dataset.name;
        const title = row.dataset.title;
        const phone = row.dataset.phone;

        el.querySelector('#form-contact-id').value = id;
        el.querySelector('#form-contact-title').value = title;
        el.querySelector('#form-contact-phone').value = phone;

        el.querySelector('#selected-contact-name').value = name;
        el.querySelector('#display-contact-name').textContent = name;
        el.querySelector('#display-contact-title').textContent = title || '-';
        el.querySelector('#display-contact-phone').textContent = phone || '-';
        el.querySelector('#contact-detail').style.display = '';
        el.querySelector('#btn-clear-contact').style.display = '';

        panel.remove();
      });
    });
  },

  _clearContact(el) {
    el.querySelector('#form-contact-id').value = '';
    el.querySelector('#form-contact-title').value = '';
    el.querySelector('#form-contact-phone').value = '';
    el.querySelector('#selected-contact-name').value = '';
    el.querySelector('#contact-detail').style.display = 'none';
    el.querySelector('#btn-clear-contact').style.display = 'none';
  },

  _showOpportunitySelector(el) {
    const customerId = el.querySelector('#form-customer-id').value;
    if (!customerId) return;

    const opportunities = Store.getAll('opportunities').filter(o => o.customerId === customerId);
    if (opportunities.length === 0) {
      UI.toast('该客户暂无商机，请先创建商机', 'warning');
      return;
    }

    const modalBody = el.closest('.modal-body');
    if (!modalBody) return;

    // 获取已选择的商机ID列表
    const existingOppIds = JSON.parse(el.querySelector('#form-opp-ids').value || '[]');

    let html = '<table class="data-table"><thead><tr><th style="width:40px">选择</th><th>商机名称</th><th>意向产品</th><th>预计金额</th></tr></thead><tbody>';
    opportunities.forEach(o => {
      const checked = existingOppIds.includes(o.id) ? 'checked' : '';
      const productStr = (o.intendedProducts || []).map(p => p.product).join('、');
      html += '<tr class="opportunity-row" data-id="' + o.id + '" data-products=\'' + Helpers.escapeHtml(JSON.stringify(o.intendedProducts || [])) + '\' data-amount="' + (o.amount || 0) + '">';
      html += '<td><input type="checkbox" class="opp-checkbox" ' + checked + '></td>';
      html += '<td>' + Helpers.escapeHtml(o.name) + '</td>';
      html += '<td>' + Helpers.escapeHtml(productStr || '-') + '</td>';
      html += '<td>' + Helpers.formatMoney(o.amount || 0) + '</td>';
      html += '</tr>';
    });
    html += '</tbody></table>';
    html += '<div style="text-align:right;margin-top:var(--space-2)"><button class="btn btn-primary" id="btn-confirm-opp-inline">确认选择</button></div>';

    const panel = this._showInlinePanel('选择商机（可多选）', html, modalBody);

    // 行点击切换 checkbox
    panel.querySelectorAll('.opportunity-row').forEach(row => {
      row.addEventListener('click', (e) => {
        if (e.target.type === 'checkbox') return;
        const cb = row.querySelector('.opp-checkbox');
        cb.checked = !cb.checked;
      });
    });

    panel.querySelector('#btn-confirm-opp-inline').addEventListener('click', () => {
      const selectedIds = [];
      const selectedNames = [];
      const allProducts = [];
      let totalAmount = 0;

      panel.querySelectorAll('.opportunity-row').forEach(row => {
        const cb = row.querySelector('.opp-checkbox');
        if (cb.checked) {
          selectedIds.push(row.dataset.id);
          selectedNames.push(row.querySelector('td:nth-child(2)').textContent.trim());
          try {
            const products = JSON.parse(row.dataset.products);
            products.forEach(p => {
              if (p.product && !allProducts.includes(p.product)) {
                allProducts.push(p.product);
              }
            });
          } catch(e) {}
          totalAmount += parseFloat(row.dataset.amount) || 0;
        }
      });

      if (selectedIds.length === 0) {
        UI.toast('请至少选择一个商机', 'warning');
        return;
      }

      // 更新隐藏字段
      el.querySelector('#form-opp-ids').value = JSON.stringify(selectedIds);
      el.querySelector('#form-opp-names').value = selectedNames.join('、');
      el.querySelector('#form-product-names').value = allProducts.join('、');
      el.querySelector('#form-total-amount').value = totalAmount;

      // 更新展示
      el.querySelector('#selected-opp-info').value = '已选择 ' + selectedIds.length + ' 个商机';
      el.querySelector('#display-products').textContent = allProducts.join('、') || '-';
      el.querySelector('#display-amount').innerHTML = '<strong style="color:var(--primary)">' + Helpers.formatMoney(totalAmount) + '</strong>';
      el.querySelector('#opportunity-detail').style.display = '';
      el.querySelector('#btn-clear-opportunity').style.display = '';

      panel.remove();
    });
  },

  _clearOpportunity(el) {
    el.querySelector('#form-opp-ids').value = '[]';
    el.querySelector('#form-opp-names').value = '';
    el.querySelector('#form-product-names').value = '';
    el.querySelector('#form-total-amount').value = '0';
    el.querySelector('#selected-opp-info').value = '';
    el.querySelector('#opportunity-detail').style.display = 'none';
    el.querySelector('#btn-clear-opportunity').style.display = 'none';
  },

  _saveForm(el, status, editId, onSuccess) {
    // === 获取所有字段值 ===
    const customerId = el.querySelector('#form-customer-id').value;
    const customerName = el.querySelector('#selected-customer-name').value;
    const region = el.querySelector('#form-customer-region').value;

    // 客户信息
    const isNewCustomer = el.querySelector('input[name="isNewCustomer"]:checked');
    const brandName = el.querySelector('#form-brand').value;
    const industry = el.querySelector('#form-industry').value;
    const currentMiniProgramProvider = el.querySelector('#form-miniapp-provider').value;
    const currentCRMProvider = el.querySelector('#form-crm-provider').value;
    const currentWecomProvider = el.querySelector('#form-wecom-provider').value;
    const competitor = el.querySelector('#form-competitor').value;
    const switchReason = el.querySelector('#form-switch-reason').value;

    // 决策信息
    const decisionProcess = el.querySelector('#form-decision-process').value;
    const contactId = el.querySelector('#form-contact-id').value;
    const contactName = el.querySelector('#selected-contact-name').value;
    const contactTitle = el.querySelector('#form-contact-title').value;
    const contactPhone = el.querySelector('#form-contact-phone').value;

    // 项目信息
    const projectBackground = el.querySelector('#form-project-background').value;
    const projectStage = el.querySelector('#form-project-stage').value;
    const offlineStoreCount = el.querySelector('#form-store-count').value;
    const coreNeeds = el.querySelector('#form-core-needs').value;
    const priorCommunication = el.querySelector('#form-prior-communication').value;
    const opportunityIds = JSON.parse(el.querySelector('#form-opp-ids').value || '[]');
    const oppNames = el.querySelector('#form-opp-names').value;
    const productNames = el.querySelector('#form-product-names').value;
    const totalAmount = parseFloat(el.querySelector('#form-total-amount').value) || 0;
    const expectedLaunchDate = el.querySelector('#form-launch-date').value;
    const projectBudget = el.querySelector('#form-budget').value;

    // 所需支持
    const supportCategory = el.querySelector('input[name="supportCategory"]:checked');
    const notes = el.querySelector('#form-notes').value;

    // === 验证必填字段 ===
    if (!customerId || !customerName) { UI.toast('请选择关联客户', 'warning'); return; }
    if (!isNewCustomer) { UI.toast('请选择是否新客', 'warning'); return; }
    if (!brandName) { UI.toast('请选择品牌名', 'warning'); return; }
    if (!currentMiniProgramProvider) { UI.toast('请填写当前小程序服务商', 'warning'); return; }
    if (!currentCRMProvider) { UI.toast('请填写当前CRM服务商名称', 'warning'); return; }
    if (!currentWecomProvider) { UI.toast('请填写当前企微助手服务商名称', 'warning'); return; }
    if (!competitor) { UI.toast('请填写项目中存在的竞品信息', 'warning'); return; }
    if (!switchReason) { UI.toast('请填写更换服务商核心原因', 'warning'); return; }
    if (!contactId || !contactName) { UI.toast('请选择联系人', 'warning'); return; }
    if (!decisionProcess) { UI.toast('请填写项目决策流程', 'warning'); return; }
    if (!projectBackground) { UI.toast('请填写项目背景', 'warning'); return; }
    if (!projectStage) { UI.toast('请选择项目阶段', 'warning'); return; }
    if (!coreNeeds) { UI.toast('请填写业务核心需求', 'warning'); return; }
    if (!priorCommunication) { UI.toast('请填写前期沟通情况', 'warning'); return; }
    if (opportunityIds.length === 0) { UI.toast('请至少选择一个关联商机', 'warning'); return; }
    if (!expectedLaunchDate) { UI.toast('请选择预期上线时间', 'warning'); return; }
    if (!projectBudget) { UI.toast('请选择项目预算', 'warning'); return; }
    if (!supportCategory) { UI.toast('请选择支持分类', 'warning'); return; }
    if (!notes) { UI.toast('请填写注意事项', 'warning'); return; }

    const data = {
      // 申请人信息
      initiator: this._currentUser,
      department: '销售部',

      // 客户信息
      customerId, customerName, industry, region,
      isNewCustomer: isNewCustomer.value,
      brandName,
      currentMiniProgramProvider,
      currentCRMProvider,
      currentWecomProvider,
      competitor,
      switchReason,

      // 决策信息
      decisionProcess,
      contactId, contactName, contactTitle, contactPhone,

      // 项目信息
      projectBackground,
      projectStage,
      offlineStoreCount,
      coreNeeds,
      priorCommunication,
      opportunityIds, oppNames, productNames, totalAmount,
      expectedLaunchDate,
      projectBudget,

      // 所需支持
      supportCategory: supportCategory.value,
      notes,

      // 系统字段
      appliedAt: Helpers.today(),
      status,
    };

    if (editId) {
      Store.update(this.COLLECTION, editId, data);
      UI.toast('申请已更新', 'success');
    } else {
      // 自动生成售前申请编号：SQ-YYYYMMDD-XX
      const todayStr = Helpers.today().replace(/-/g, '');
      const count = Store.getAll(this.COLLECTION).length + 1;
      data.preSaleNo = 'SQ-' + todayStr + '-' + String(count).padStart(2, '0');
      Store.create(this.COLLECTION, data);
      UI.toast(status === '待提交' ? '申请已保存' : '申请已提交，等待审批', 'success');
    }

    if (onSuccess) {
      onSuccess();
    } else {
      Router.navigate('#/pre-sales');
    }
  },

  _handleExport() {
    const allData = Store.getAll(this.COLLECTION);
    if (allData.length === 0) {
      UI.toast('暂无数据可导出', 'warning');
      return;
    }

    // CSV 表头
    const headers = ['申请编号', '客户名称', '品牌', '审批状态', '支持分类', '项目阶段', '发起人', '发起人部门', '售前人员', '申请时间', '分配售前时间', '售前跟进阶段', '预期上线', '项目预算', '意向产品', '预计成交金额', '注意事项', '驳回原因'];
    const keys = ['preSaleNo', 'customerName', 'brandName', 'status', 'supportCategory', 'projectStage', 'initiator', 'department', 'collaborator', 'appliedAt', 'assignedAt', 'preSaleStage', 'expectedLaunchDate', 'projectBudget', 'productNames', 'totalAmount', 'notes', 'rejectReason'];

    // 转义 CSV 字段（处理逗号、引号、换行）
    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '';
      const str = String(val);
      if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return '"' + str.replace(/"/g, '""') + '"';
      }
      return str;
    };

    const rows = allData.map(item => {
      return keys.map(key => {
        let val = item[key];
        if (key === 'status') {
          val = val || '';
        } else if (key === 'totalAmount') {
          val = val ? Helpers.formatMoney(val) : '';
        }
        return escapeCsv(val);
      }).join(',');
    });

    const csvContent = '﻿' + headers.join(',') + '\n' + rows.join('\n');

    // 触发下载
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = '售前项目申请_' + Helpers.today() + '.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    UI.toast('导出成功，共 ' + allData.length + ' 条记录', 'success');
  },

  _handleCreate() {
    this._openFormModal(null);
  },

  _handleEdit(id) {
    const item = Store.getById(this.COLLECTION, id);
    if (!item) return;
    if (item.status !== '待提交') {
      UI.toast('仅待提交状态的申请可编辑', 'warning');
      return;
    }
    this._openFormModal(id);
  },

  // ==========================================
  // 详情页
  // ==========================================

  viewDetail(id) {
    const item = Store.getById(this.COLLECTION, id);
    if (!item) { Router.navigate('#/pre-sales'); return; }

    UI.setPageTitle('售前项目详情', [
      { label: '协同办公', hash: '#/pre-sales' },
      { label: '售前项目', hash: '#/pre-sales' },
      { label: '售前项目详情' },
    ]);

    const el = document.createElement('div');

    // 根据状态显示操作按钮
    let headerActions = '';
    if (item.status === '待提交') {
      headerActions =
        '<button class="btn btn-primary btn-sm" id="btn-submit" style="margin-right:8px">提交</button>' +
        '<button class="btn btn-secondary btn-sm" id="btn-edit" style="margin-right:8px">编辑</button>';
    } else if (item.status === '审批中') {
      headerActions =
        '<button class="btn btn-danger btn-sm" id="btn-reject" style="margin-right:8px">驳回</button>' +
        '<button class="btn btn-primary btn-sm" id="btn-approve" style="margin-right:8px">通过</button>' +
        '<button class="btn btn-secondary btn-sm" id="btn-withdraw" style="margin-right:8px">撤回</button>';
    }

    const e = (v, def) => v ? Helpers.escapeHtml(v) : (def || '-');
    const badge = (v) => Components.Badge(e(v), this.STATUS_MAP[v] || 'gray');

    // ====== Tab2: 售前商机详情 ======
    let oppTabHtml = '';
    if (item.opportunityIds && item.opportunityIds.length > 0) {
      const opps = item.opportunityIds.map(oid => Store.getById('opportunities', oid)).filter(Boolean);
      oppTabHtml = opps.map(o => {
        const customer = Store.getById('customers', o.customerId);
        const cName = customer ? customer.name : '-';
        const products = (o.intendedProducts || []).map(p => p.product + (p.edition ? '-' + p.edition : '')).join('、') || '-';
        return `
          <div class="card" style="margin-bottom:var(--space-4)">
            <div class="card-header"><h3 class="card-title">${e(o.name)}</h3></div>
            <div class="card-body">
              <div class="detail-card" style="grid-template-columns:1fr 1fr 1fr">
                <div class="detail-field"><div class="field-label">项目名称</div><div class="field-value">${e(o.name)}</div></div>
                <div class="detail-field"><div class="field-label">关联客户</div><div class="field-value"><span class="cell-link" data-href="#/customers/view/${o.customerId}">${e(cName)}</span></div></div>
                <div class="detail-field"><div class="field-label">品牌</div><div class="field-value">${e(o.brandName)}</div></div>
                <div class="detail-field"><div class="field-label">跟进阶段</div><div class="field-value">${badge(o.followUpStage)}</div></div>
                <div class="detail-field"><div class="field-label">预计金额</div><div class="field-value"><strong style="color:var(--primary)">${o.amount ? Helpers.formatMoney(o.amount) : '-'}</strong></div></div>
                <div class="detail-field"><div class="field-label">预计成交</div><div class="field-value">${e(o.expectedCloseDate)}</div></div>
              </div>
              <div style="margin-top:var(--space-3);padding-top:var(--space-3);border-top:1px solid var(--border-light)">
                <div class="detail-card" style="grid-template-columns:1fr 1fr">
                  <div class="detail-field"><div class="field-label">意向产品</div><div class="field-value">${e(products)}</div></div>
                  <div class="detail-field"><div class="field-label">商机来源</div><div class="field-value">${e(o.source)}</div></div>
                </div>
              </div>
              <div style="margin-top:var(--space-3);padding-top:var(--space-3);border-top:1px solid var(--border-light)">
                <div class="detail-card" style="grid-template-columns:1fr 1fr">
                  <div class="detail-field"><div class="field-label">采购类型</div><div class="field-value">${e(o.purchaseType)}</div></div>
                  <div class="detail-field"><div class="field-label">客户需求</div><div class="field-value">${e(o.customerNeed)}</div></div>
                </div>
              </div>
              <div style="margin-top:var(--space-3);padding-top:var(--space-3);border-top:1px solid var(--border-light)">
                <div class="detail-card" style="grid-template-columns:1fr 1fr">
                  <div class="detail-field"><div class="field-label">创建时间</div><div class="field-value">${Helpers.formatDateTime(o.createdAt)}</div></div>
                  <div class="detail-field"><div class="field-label">更新时间</div><div class="field-value">${Helpers.formatDateTime(o.updatedAt)}</div></div>
                </div>
              </div>
            </div>
          </div>
        `;
      }).join('');
    } else {
      oppTabHtml = '<div class="table-empty" style="padding:var(--space-8)"><div class="empty-icon">📋</div><div class="empty-text">未关联售前商机</div></div>';
    }

    el.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <h2 class="page-title">售前项目详情</h2>
          <p class="page-subtitle">${e(item.preSaleNo)} ${badge(item.status)}</p>
        </div>
        <div class="page-header-right">
          ${headerActions}
          <button class="btn btn-secondary btn-sm" id="btn-back">返回列表</button>
        </div>
      </div>

      <div class="h-scroll-tabs" style="margin-bottom:var(--space-4)">
        <div class="h-scroll-tab active" data-detail-tab="application">售前申请</div>
        <div class="h-scroll-tab" data-detail-tab="opportunity">售前商机</div>
      </div>

      <!-- Tab 1: 售前申请详情 -->
      <div id="detail-tab-app">
        <!-- 1. 申请人信息 -->
        <div class="card" style="margin-bottom:var(--space-4)">
          <div class="card-header"><h3 class="card-title">申请人信息</h3></div>
          <div class="card-body">
            <div class="detail-card" style="grid-template-columns:1fr 1fr">
              <div class="detail-field"><div class="field-label">发起人</div><div class="field-value">${e(item.initiator)}</div></div>
              <div class="detail-field"><div class="field-label">发起人部门</div><div class="field-value">${e(item.department)}</div></div>
            </div>
          </div>
        </div>

        <!-- 2. 客户信息 -->
        <div class="card" style="margin-bottom:var(--space-4)">
          <div class="card-header"><h3 class="card-title">客户信息</h3></div>
          <div class="card-body">
            <div class="detail-card" style="grid-template-columns:1fr 1fr 1fr">
              <div class="detail-field"><div class="field-label">客户名称</div><div class="field-value">${e(item.customerName)}</div></div>
              <div class="detail-field"><div class="field-label">是否新客</div><div class="field-value">${e(item.isNewCustomer)}</div></div>
              <div class="detail-field"><div class="field-label">品牌名</div><div class="field-value">${e(item.brandName)}</div></div>
              <div class="detail-field"><div class="field-label">所属行业</div><div class="field-value">${e(item.industry)}</div></div>
              <div class="detail-field"><div class="field-label">所在地区</div><div class="field-value">${e(item.region)}</div></div>
              <div class="detail-field"><div class="field-label">线下门店数</div><div class="field-value">${e(item.offlineStoreCount)}</div></div>
            </div>
            <div style="margin-top:var(--space-3);padding-top:var(--space-3);border-top:1px solid var(--border-light)">
              <div class="detail-card" style="grid-template-columns:1fr 1fr 1fr">
                <div class="detail-field"><div class="field-label">当前小程序服务商</div><div class="field-value">${e(item.currentMiniProgramProvider)}</div></div>
                <div class="detail-field"><div class="field-label">当前CRM服务商</div><div class="field-value">${e(item.currentCRMProvider)}</div></div>
                <div class="detail-field"><div class="field-label">当前企微助手服务商</div><div class="field-value">${e(item.currentWecomProvider)}</div></div>
              </div>
            </div>
            <div style="margin-top:var(--space-3);padding-top:var(--space-3);border-top:1px solid var(--border-light)">
              <div class="detail-card" style="grid-template-columns:1fr 1fr">
                <div class="detail-field"><div class="field-label">在项目中存在竞品</div><div class="field-value">${e(item.competitor)}</div></div>
                <div class="detail-field"><div class="field-label">更换服务商核心原因</div><div class="field-value">${e(item.switchReason)}</div></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. 决策信息 -->
        <div class="card" style="margin-bottom:var(--space-4)">
          <div class="card-header"><h3 class="card-title">决策信息</h3></div>
          <div class="card-body">
            <div class="detail-card" style="grid-template-columns:1fr 1fr 1fr">
              <div class="detail-field"><div class="field-label">项目决策流程</div><div class="field-value">${e(item.decisionProcess)}</div></div>
              <div class="detail-field" style="grid-column:span 2">
                <div class="field-label">联系人</div>
                <div class="field-value">${e(item.contactName)} ${item.contactTitle ? '（' + Helpers.escapeHtml(item.contactTitle) + '）' : ''} ${item.contactPhone ? Helpers.escapeHtml(item.contactPhone) : ''}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 4. 项目信息 -->
        <div class="card" style="margin-bottom:var(--space-4)">
          <div class="card-header"><h3 class="card-title">项目信息</h3></div>
          <div class="card-body">
            <div class="detail-card" style="grid-template-columns:1fr 1fr">
              <div class="detail-field" style="grid-column:span 2"><div class="field-label">项目背景</div><div class="field-value" style="white-space:pre-wrap">${e(item.projectBackground)}</div></div>
            </div>
            <div class="detail-card" style="grid-template-columns:1fr 1fr 1fr;margin-top:var(--space-3);padding-top:var(--space-3);border-top:1px solid var(--border-light)">
              <div class="detail-field"><div class="field-label">项目阶段</div><div class="field-value">${e(item.projectStage)}</div></div>
              <div class="detail-field"><div class="field-label">预期上线时间</div><div class="field-value">${e(item.expectedLaunchDate)}</div></div>
              <div class="detail-field"><div class="field-label">项目预算</div><div class="field-value">${e(item.projectBudget)}</div></div>
            </div>
            <div style="margin-top:var(--space-3);padding-top:var(--space-3);border-top:1px solid var(--border-light)">
              <div class="detail-card" style="grid-template-columns:1fr 1fr">
                <div class="detail-field"><div class="field-label">业务核心需求</div><div class="field-value" style="white-space:pre-wrap">${e(item.coreNeeds)}</div></div>
                <div class="detail-field"><div class="field-label">前期沟通情况</div><div class="field-value" style="white-space:pre-wrap">${e(item.priorCommunication)}</div></div>
              </div>
            </div>
            <div style="margin-top:var(--space-3);padding-top:var(--space-3);border-top:1px solid var(--border-light)">
              <div class="detail-field" style="margin-bottom:var(--space-2)"><div class="field-label">关联商机</div></div>
              <div class="detail-card" style="grid-template-columns:1fr;margin-bottom:var(--space-2)">
                ${item.opportunityIds && item.opportunityIds.length > 0
                  ? item.opportunityIds.map(oid => {
                      const oo = Store.getById('opportunities', oid);
                      return oo ? '<div class="detail-field"><div class="field-value"><span class="cell-link" data-href="#/opportunities/view/' + oo.id + '">' + e(oo.name) + '</span></div></div>' : '';
                    }).join('')
                  : '<div class="detail-field"><div class="field-value" style="color:var(--text-muted)">未关联商机</div></div>'
                }
              </div>
              <div class="detail-card" style="grid-template-columns:1fr 1fr">
                <div class="detail-field"><div class="field-label">意向产品</div><div class="field-value">${e(item.productNames)}</div></div>
                <div class="detail-field"><div class="field-label">预计成交金额</div><div class="field-value"><strong style="color:var(--primary)">${item.totalAmount ? Helpers.formatMoney(item.totalAmount) : '-'}</strong></div></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 5. 所需支持 -->
        <div class="card" style="margin-bottom:var(--space-4)">
          <div class="card-header"><h3 class="card-title">所需支持</h3></div>
          <div class="card-body">
            <div class="detail-card" style="grid-template-columns:1fr 1fr">
              <div class="detail-field"><div class="field-label">支持分类</div><div class="field-value">${item.supportCategory ? badge(item.supportCategory) : '-'}</div></div>
              <div class="detail-field"><div class="field-label">注意事项</div><div class="field-value" style="white-space:pre-wrap">${e(item.notes)}</div></div>
            </div>
          </div>
        </div>

        <!-- 系统信息 -->
        <div class="card" style="margin-bottom:var(--space-4)">
          <div class="card-header"><h3 class="card-title">系统信息</h3></div>
          <div class="card-body">
            <div class="detail-card" style="grid-template-columns:1fr 1fr 1fr">
              <div class="detail-field"><div class="field-label">申请时间</div><div class="field-value">${item.appliedAt ? Helpers.formatDate(item.appliedAt) : '-'}</div></div>
              <div class="detail-field"><div class="field-label">创建时间</div><div class="field-value">${Helpers.formatDateTime(item.createdAt)}</div></div>
              <div class="detail-field"><div class="field-label">更新时间</div><div class="field-value">${Helpers.formatDateTime(item.updatedAt)}</div></div>
            </div>
          </div>
        </div>

        ${item.rejectReason ? `
        <div class="card" style="margin-bottom:var(--space-4);border-color:var(--danger-light)">
          <div class="card-header"><h3 class="card-title" style="color:var(--danger)">驳回原因</h3></div>
          <div class="card-body">
            <p style="font-size:var(--text-sm);color:var(--danger);margin:0;white-space:pre-wrap">${Helpers.escapeHtml(item.rejectReason)}</p>
          </div>
        </div>` : ''}
      </div>

      <!-- Tab 2: 售前商机详情 -->
      <div id="detail-tab-opp" style="display:none">
        ${oppTabHtml}
      </div>
    `;

    UI.render(el);

    // Tab 切换
    el.querySelectorAll('[data-detail-tab]').forEach(tab => {
      tab.addEventListener('click', () => {
        el.querySelectorAll('[data-detail-tab]').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const isApp = tab.dataset.detailTab === 'application';
        el.querySelector('#detail-tab-app').style.display = isApp ? '' : 'none';
        el.querySelector('#detail-tab-opp').style.display = isApp ? 'none' : '';
      });
    });

    // 事件绑定
    el.querySelector('#btn-back').addEventListener('click', () => { Router.navigate('#/pre-sales'); });
    el.addEventListener('click', (e) => {
      const link = e.target.closest('[data-href]');
      if (link) { e.preventDefault(); Router.navigate(link.dataset.href); }
    });

    if (item.status === '待提交') {
      el.querySelector('#btn-edit').addEventListener('click', () => { Router.navigate('#/pre-sales/edit/' + id); });
      el.querySelector('#btn-submit').addEventListener('click', () => { this._handleSubmit(id); });
    } else if (item.status === '审批中') {
      el.querySelector('#btn-approve').addEventListener('click', () => { this._handleApprove(id); });
      el.querySelector('#btn-reject').addEventListener('click', () => { this._showRejectModal(id); });
      el.querySelector('#btn-withdraw').addEventListener('click', () => { this._handleWithdraw(id); });
    }
  },

  // ==========================================
  // 状态操作
  // ==========================================

  _handleSubmit(id) {
    UI.confirm({
      title: '提交审批',
      message: '确认提交售前项目申请？提交后将进入审批流程。',
      type: 'info',
      confirmText: '确认提交',
      onConfirm: () => {
        Store.update(this.COLLECTION, id, { status: '审批中', appliedAt: Helpers.today() });
        UI.toast('已提交审批', 'success');
        this.renderList();
      },
    });
  },

  _handleWithdraw(id) {
    UI.confirm({
      title: '撤回申请',
      message: '确认撤回该申请？撤回后状态将变为待提交。',
      type: 'warning',
      confirmText: '确认撤回',
      onConfirm: () => {
        Store.update(this.COLLECTION, id, { status: '待提交' });
        UI.toast('已撤回申请', 'info');
        this.renderList();
      },
    });
  },

  _handleApprove(id) {
    UI.confirm({
      title: '审批通过',
      message: '确认通过该售前项目申请？',
      type: 'info',
      confirmText: '确认通过',
      onConfirm: () => {
        Store.update(this.COLLECTION, id, { status: '已通过' });
        UI.toast('已审批通过', 'success');
        this.renderList();
      },
    });
  },

  _showRejectModal(id) {
    const content = document.createElement('div');
    content.style.cssText = 'padding:var(--space-2) 0';
    content.innerHTML = `
      <p style="font-size:var(--text-sm);color:var(--text-secondary);margin-bottom:var(--space-3)">请填写驳回原因：</p>
      <textarea id="reject-reason" class="form-textarea" placeholder="请填写驳回原因..." rows="3" style="width:100%"></textarea>
    `;

    const footer = `
      <button class="btn btn-secondary" data-close-modal>取消</button>
      <button class="btn btn-danger" id="confirm-reject">确认驳回</button>
    `;

    const { overlay, close } = UI.modal({ title: '驳回申请', content, footer, size: 'sm' });

    overlay.querySelector('#confirm-reject').addEventListener('click', () => {
      const reason = overlay.querySelector('#reject-reason').value;
      if (!reason || !reason.trim()) {
        UI.toast('请填写驳回原因', 'warning');
        return;
      }
      Store.update(this.COLLECTION, id, {
        status: '已驳回',
        rejectReason: reason.trim(),
      });
      close();
      UI.toast('已驳回', 'info');
      this.renderList();
    });
  },

  // ==========================================
  // 路由注册
  // ==========================================

  init() {
    Router.register('#/pre-sales', () => this.renderList());
    Router.register('#/pre-sales/create', () => { this._openFormModal(null); });
    Router.register('#/pre-sales/edit/:id', ({ id }) => { this._openFormModal(id); });
    Router.register('#/pre-sales/view/:id', ({ id }) => this.viewDetail(id));
  },
};
