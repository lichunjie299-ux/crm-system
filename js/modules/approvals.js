/* ============================================
   CRM 系统 - 审批管理模块
   ============================================ */
const Approvals = {

  _activeTabIdx: 0,
  _currentUser: '李春洁',

  renderList() {
    UI.setPageTitle('审批管理', [{ label: '协同办公', hash: '#/approvals' }, { label: '审批管理' }]);

    const el = document.createElement('div');
    el.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <h2 class="page-title">审批管理</h2>
          <p class="page-subtitle">管理我的申请和待审批事项</p>
        </div>
      </div>
      <div id="approvals-content"></div>
    `;

    const content = el.querySelector('#approvals-content');
    const tabContainer = document.createElement('div');
    content.appendChild(tabContainer);

    const prevIdx = this._activeTabIdx;

    const tabsInstance = Components.Tabs([
      {
        label: '我的申请',
        render: () => this._renderMyApplications(),
      },
      {
        label: '我的审批',
        render: () => this._renderMyApprovals(),
      },
    ], tabContainer);

    tabContainer.addEventListener('click', (e) => {
      const tabItem = e.target.closest('.tab-item');
      if (tabItem) {
        this._activeTabIdx = parseInt(tabItem.dataset.tab);
      }
    });

    if (prevIdx > 0) {
      tabsInstance.switchTo(prevIdx);
    }

    UI.render(el);
  },

  _typeLabel(type) {
    const map = { contract: '合同审批', order: '订单审批' };
    return map[type] || type;
  },

  _getColumns(actionType) {
    // actionType: '' | 'view' | 'approve'
    var cols = [
      { key: 'id', label: '审批流ID', width: '80px', render: function(v) {
        return '<span style="color:var(--text-muted);font-size:var(--text-xs)">' + Helpers.escapeHtml(v || '') + '</span>';
      }},
      { key: 'type', label: '审批类型', width: '80px', render: function(v) {
        return this._typeLabel(v);
      }.bind(this)},
      { key: 'customerName', label: '客户名称', width: '130px' },
      { key: 'businessLine', label: '业务线名称', width: '100px', render: function(v) {
        return v || '-';
      }},
      { key: 'applicant', label: '申请人', width: '70px' },
      { key: 'createdAt', label: '申请时间', width: '100px', sortable: true, render: function(v) {
        return v ? Helpers.formatDate(v) : '-';
      }},
      { key: 'status', label: '状态', width: '70px', render: function(v) {
        var map = { pending: '待审批', approved: '已通过', rejected: '已驳回' };
        var typeMap = { pending: 'warning', approved: 'success', rejected: 'danger' };
        return Components.Badge(map[v] || v, typeMap[v] || 'gray');
      }},
      { key: 'approver', label: '当前处理人', width: '80px', render: function(v) {
        return v || '-';
      }},
    ];

    if (actionType === 'view') {
      cols.push({
        key: '_actions', label: '操作', width: '70px', render: function(v, item) {
          return '<button class="btn btn-secondary btn-sm action-view" data-id="' + item.id + '">查看</button>';
        },
      });
    } else if (actionType === 'approve') {
      cols.push({
        key: '_actions', label: '操作', width: '80px', render: function(v, item) {
          if (item.status !== 'pending') return '<span style="color:var(--text-muted);font-size:var(--text-xs)">已处理</span>';
          return '<button class="btn btn-primary btn-sm action-approve" data-id="' + item.id + '">审批</button>';
        },
      });
    }

    return cols;
  },

  _showApprovalDetail(approval, showActions) {
    var content = document.createElement('div');
    var statusMap = { pending: '待审批', approved: '已通过', rejected: '已驳回' };
    var badgeMap = { pending: 'warning', approved: 'success', rejected: 'danger' };

    var html = '<div class="detail-card" style="margin-bottom:var(--space-4)">';
    html += '<div class="detail-field"><div class="field-label">审批流ID</div><div class="field-value font-mono">' + Helpers.escapeHtml(approval.id || '') + '</div></div>';
    html += '<div class="detail-field"><div class="field-label">审批类型</div><div class="field-value">' + this._typeLabel(approval.type) + '</div></div>';
    html += '<div class="detail-field"><div class="field-label">客户名称</div><div class="field-value">' + Helpers.escapeHtml(approval.customerName || '') + '</div></div>';
    html += '<div class="detail-field"><div class="field-label">申请人</div><div class="field-value">' + Helpers.escapeHtml(approval.applicant || '') + '</div></div>';
    html += '<div class="detail-field"><div class="field-label">申请时间</div><div class="field-value">' + (approval.createdAt ? Helpers.formatDateTime(approval.createdAt) : '-') + '</div></div>';
    html += '<div class="detail-field"><div class="field-label">状态</div><div class="field-value">' + Components.Badge(statusMap[approval.status] || approval.status, badgeMap[approval.status] || 'gray') + '</div></div>';
    html += '<div class="detail-field"><div class="field-label">金额</div><div class="field-value"><strong style="color:var(--primary)">' + Helpers.formatMoney(approval.amount) + '</strong></div></div>';
    if (approval.rejectReason) {
      html += '<div class="detail-field full-width"><div class="field-label">驳回原因</div><div class="field-value" style="color:var(--danger)">' + Helpers.escapeHtml(approval.rejectReason) + '</div></div>';
    }
    html += '</div>';

    // 合同分组 _showApprovalDetail
    var contractsHtml = '';
    var masterOrder = null;
    if (approval.relatedOrderId) {
      masterOrder = Store.getById('orders', approval.relatedOrderId);
    }
    if (!masterOrder && approval.relatedId) {
      masterOrder = Store.getById('orders', approval.relatedId);
    }
    if (masterOrder && masterOrder.contractsData && masterOrder.contractsData.length > 0) {
      var tabLabels = masterOrder.contractsData.map(function(c, i) {
        var active = i === 0 ? 'order-contract-tab active' : 'order-contract-tab';
        return '<button class="' + active + '" data-cidx="' + i + '">' + Helpers.escapeHtml(c.label) + '+' + Helpers.escapeHtml(c.contractNo) + '</button>';
      }).join('');
      contractsHtml = '<div style="margin-bottom:var(--space-3)">' + '<div class="order-contract-tabs" style="margin-bottom:var(--space-3)">' + tabLabels + '</div>';
      masterOrder.contractsData.forEach(function(c, i) {
        var display = i === 0 ? '' : 'none';
        contractsHtml += '<div class="contract-tab-panel" data-panel-idx="' + i + '" style="display:' + display + ';border:1px solid var(--border-light);border-radius:4px;padding:var(--space-3) var(--space-4)">' +
          '<div class="detail-card" style="grid-template-columns:1fr 1fr;margin-bottom:var(--space-3)">' +
            '<div class="detail-field"><div class="field-label">合同编号</div><div class="field-value font-mono">' + Helpers.escapeHtml(c.contractNo) + '</div></div>' +
            '<div class="detail-field"><div class="field-label">合同类型</div><div class="field-value">' + Helpers.escapeHtml(c.contractType) + '</div></div>' +
            '<div class="detail-field"><div class="field-label">乙方主体</div><div class="field-value">' + Helpers.escapeHtml(c.partyB || '-') + '</div></div>' +
            '<div class="detail-field"><div class="field-label">签约人</div><div class="field-value">' + Helpers.escapeHtml(c.signer || '-') + '</div></div>' +
            '<div class="detail-field"><div class="field-label">合同金额</div><div class="field-value"><strong style="color:var(--primary)">' + Helpers.formatMoney(c.amount) + '</strong></div></div>' +
            (c.isSealed ? '<div class="detail-field"><div class="field-label">盖章状态</div><div class="field-value">' + (c.isSealed === '是' ? '已盖章' : '未盖章') + '</div></div>' : '') +
          '</div>' +
          '<h4 style="font-size:var(--text-xs);font-weight:600;color:var(--text-secondary);margin-bottom:var(--space-2)">关联商品明细</h4>' +
          '<table class="data-table" style="font-size:var(--text-xs)">' +
            '<thead><tr><th>商品名称</th><th style="width:100px">金额</th></tr></thead>' +
            '<tbody>' + (c.items || []).map(function(item) {
              return '<tr><td>' + Helpers.escapeHtml(item.productName) + '</td><td><strong style="color:var(--primary)">' + Helpers.formatMoney(item.payable) + '</strong></td></tr>';
            }).join('') + '</tbody>' +
          '</table>' +
        '</div>';
      });
      contractsHtml += '</div>';
    }

    if (!contractsHtml) {
      contractsHtml = '<div style="padding:var(--space-4);text-align:center;color:var(--text-muted)">' + Helpers.escapeHtml(approval.description || '无合同信息') + '</div>';
    }
    html += '<h3 style="font-size:var(--text-sm);font-weight:600;color:var(--text-secondary);margin-bottom:var(--space-3)">合同信息</h3>' + contractsHtml;

    content.innerHTML = html;

    // 合同标签切换 _showApprovalDetail
    (function() {
      var container = content.querySelector('.order-contract-tabs');
      if (container) {
        container.addEventListener('click', function(e) {
          var tab = e.target.closest('.order-contract-tab');
          if (!tab) return;
          var idx = tab.dataset.cidx;
          container.querySelectorAll('.order-contract-tab').forEach(function(t) { t.classList.remove('active'); });
          tab.classList.add('active');
          var panels = content.querySelectorAll('.contract-tab-panel');
          panels.forEach(function(p) {
            p.style.display = p.dataset.panelIdx === idx ? '' : 'none';
          });
        });
      }
    })();

    if (showActions && approval.status === 'pending') {
      var footer = document.createElement('div');
      footer.style.cssText = 'display:flex;justify-content:flex-end;align-items:center;gap:8px;width:100%';
      footer.innerHTML = '<button class="btn btn-danger" id="detail-reject-btn">驳回</button><button class="btn btn-primary" id="detail-approve-btn">通过</button>';

      var self = this;
      var modalResult = UI.modal({ title: '审批详情', content: content, footer: footer, size: 'large' });
      var overlay = modalResult.overlay;

      overlay.querySelector('#detail-approve-btn').addEventListener('click', function() {
        modalResult.close();
        self._handleApprove(approval.id);
      });
      overlay.querySelector('#detail-reject-btn').addEventListener('click', function() {
        modalResult.close();
        self._showRejectModal(approval.id);
      });
    } else {
      UI.modal({ title: '审批详情', content: content, size: 'large' });
    }
  },

  viewApproval(id) {
    const approval = Store.getById('approvals', id);
    if (!approval) { Router.navigate('#/approvals'); return; }

    UI.setPageTitle('审批详情', [
      { label: '协同办公', hash: '#/approvals' },
      { label: '审批管理', hash: '#/approvals' },
      { label: '审批详情' }
    ]);

    const el = document.createElement('div');
    const isPending = approval.status === 'pending';
    const showActions = isPending && approval.approver === this._currentUser;

    let headerActions = '';
    if (showActions) {
      headerActions = '<button class="btn btn-danger btn-sm" id="btn-detail-reject" style="margin-right:8px">驳回</button>' +
        '<button class="btn btn-primary btn-sm" id="btn-detail-approve">通过</button>';
    }

    el.innerHTML =
      '<div class="page-header">' +
        '<div class="page-header-left">' +
          '<h2 class="page-title">审批详情</h2>' +
        '</div>' +
        '<div class="page-header-right">' +
          headerActions +
          '<button class="btn btn-secondary btn-sm" id="btn-back">返回列表</button>' +
        '</div>' +
      '</div>' +
      '<div class="card">' +
        '<div class="card-body">' +
          '<div id="approval-detail-content"></div>' +
        '</div>' +
      '</div>';

    const content = el.querySelector('#approval-detail-content');
    var statusMap = { pending: '待审批', approved: '已通过', rejected: '已驳回' };
    var badgeMap = { pending: 'warning', approved: 'success', rejected: 'danger' };

    var html = '<div class="detail-card" style="margin-bottom:var(--space-4)">';
    html += '<div class="detail-field"><div class="field-label">审批流ID</div><div class="field-value font-mono">' + Helpers.escapeHtml(approval.id || '') + '</div></div>';
    html += '<div class="detail-field"><div class="field-label">审批类型</div><div class="field-value">' + this._typeLabel(approval.type) + '</div></div>';
    html += '<div class="detail-field"><div class="field-label">客户名称</div><div class="field-value">' + Helpers.escapeHtml(approval.customerName || '') + '</div></div>';
    html += '<div class="detail-field"><div class="field-label">申请人</div><div class="field-value">' + Helpers.escapeHtml(approval.applicant || '') + '</div></div>';
    html += '<div class="detail-field"><div class="field-label">申请时间</div><div class="field-value">' + (approval.createdAt ? Helpers.formatDateTime(approval.createdAt) : '-') + '</div></div>';
    html += '<div class="detail-field"><div class="field-label">状态</div><div class="field-value">' + Components.Badge(statusMap[approval.status] || approval.status, badgeMap[approval.status] || 'gray') + '</div></div>';
    html += '<div class="detail-field"><div class="field-label">金额</div><div class="field-value"><strong style="color:var(--primary)">' + Helpers.formatMoney(approval.amount) + '</strong></div></div>';
    if (approval.rejectReason) {
      html += '<div class="detail-field full-width"><div class="field-label">驳回原因</div><div class="field-value" style="color:var(--danger)">' + Helpers.escapeHtml(approval.rejectReason) + '</div></div>';
    }
    html += '</div>';

    // 合同分组 viewApproval
    var contractsHtml = '';
    var masterOrder = null;
    if (approval.relatedOrderId) {
      masterOrder = Store.getById('orders', approval.relatedOrderId);
    }
    if (!masterOrder && approval.relatedId) {
      masterOrder = Store.getById('orders', approval.relatedId);
    }
    if (masterOrder && masterOrder.contractsData && masterOrder.contractsData.length > 0) {
      var tabLabels = masterOrder.contractsData.map(function(c, i) {
        var active = i === 0 ? 'order-contract-tab active' : 'order-contract-tab';
        return '<button class="' + active + '" data-cidx="' + i + '">' + Helpers.escapeHtml(c.label) + '+' + Helpers.escapeHtml(c.contractNo) + '</button>';
      }).join('');
      contractsHtml = '<div style="margin-bottom:var(--space-3)">' + '<div class="order-contract-tabs" style="margin-bottom:var(--space-3)">' + tabLabels + '</div>';
      masterOrder.contractsData.forEach(function(c, i) {
        var display = i === 0 ? '' : 'none';
        contractsHtml += '<div class="contract-tab-panel" data-panel-idx="' + i + '" style="display:' + display + ';border:1px solid var(--border-light);border-radius:4px;padding:var(--space-3) var(--space-4)">' +
          '<div class="detail-card" style="grid-template-columns:1fr 1fr;margin-bottom:var(--space-3)">' +
            '<div class="detail-field"><div class="field-label">合同编号</div><div class="field-value font-mono">' + Helpers.escapeHtml(c.contractNo) + '</div></div>' +
            '<div class="detail-field"><div class="field-label">合同类型</div><div class="field-value">' + Helpers.escapeHtml(c.contractType) + '</div></div>' +
            '<div class="detail-field"><div class="field-label">乙方主体</div><div class="field-value">' + Helpers.escapeHtml(c.partyB || '-') + '</div></div>' +
            '<div class="detail-field"><div class="field-label">签约人</div><div class="field-value">' + Helpers.escapeHtml(c.signer || '-') + '</div></div>' +
            '<div class="detail-field"><div class="field-label">合同金额</div><div class="field-value"><strong style="color:var(--primary)">' + Helpers.formatMoney(c.amount) + '</strong></div></div>' +
            (c.isSealed ? '<div class="detail-field"><div class="field-label">盖章状态</div><div class="field-value">' + (c.isSealed === '是' ? '已盖章' : '未盖章') + '</div></div>' : '') +
          '</div>' +
          '<h4 style="font-size:var(--text-xs);font-weight:600;color:var(--text-secondary);margin-bottom:var(--space-2)">关联商品明细</h4>' +
          '<table class="data-table" style="font-size:var(--text-xs)">' +
            '<thead><tr><th>商品名称</th><th style="width:100px">金额</th></tr></thead>' +
            '<tbody>' + (c.items || []).map(function(item) {
              return '<tr><td>' + Helpers.escapeHtml(item.productName) + '</td><td><strong style="color:var(--primary)">' + Helpers.formatMoney(item.payable) + '</strong></td></tr>';
            }).join('') + '</tbody>' +
          '</table>' +
        '</div>';
      });
      contractsHtml += '</div>';
    }

    if (!contractsHtml) {
      contractsHtml = '<div style="padding:var(--space-4);text-align:center;color:var(--text-muted)">' + Helpers.escapeHtml(approval.description || '无合同信息') + '</div>';
    }
    html += '<h3 style="font-size:var(--text-sm);font-weight:600;color:var(--text-secondary);margin-bottom:var(--space-3)">合同信息</h3>' + contractsHtml;

    content.innerHTML = html;
    UI.render(el);

    // 合同标签切换 viewApproval
    (function() {
      var container = content.querySelector('.order-contract-tabs');
      if (container) {
        container.addEventListener('click', function(e) {
          var tab = e.target.closest('.order-contract-tab');
          if (!tab) return;
          var idx = tab.dataset.cidx;
          container.querySelectorAll('.order-contract-tab').forEach(function(t) { t.classList.remove('active'); });
          tab.classList.add('active');
          var panels = content.querySelectorAll('.contract-tab-panel');
          panels.forEach(function(p) {
            p.style.display = p.dataset.panelIdx === idx ? '' : 'none';
          });
        });
      }
    })();

    // 事件绑定
    el.querySelector('#btn-back').addEventListener('click', function() { Router.navigate('#/approvals'); });

    if (showActions) {
      var me = this;
      el.querySelector('#btn-detail-approve').addEventListener('click', function() {
        me._handleApprove(approval.id);
      });
      el.querySelector('#btn-detail-reject').addEventListener('click', function() {
        me._showRejectModal(approval.id);
      });
    }
  },

  _buildTable(approvals, actionType) {
    // actionType: '' | 'view' | 'approve'
    var container = document.createElement('div');
    container.style.cssText = 'padding-top: var(--space-4)';

    if (approvals.length === 0) {
      var emptyText = actionType === 'approve' ? '暂无待审批事项' : '暂无我的申请';
      var emptyIcon = actionType === 'approve' ? '✅' : '📋';
      var emptyDesc = actionType === 'approve' ? '需要您审批的事项将显示在此处' : '您提交的审批申请将显示在此处';
      container.innerHTML = (
        '<div class="card">' +
          '<div class="table-empty" style="padding:var(--space-8)">' +
            '<div class="empty-icon">' + emptyIcon + '</div>' +
            '<div class="empty-text">' + emptyText + '</div>' +
            '<div style="font-size:var(--text-sm);color:var(--text-muted);margin-top:var(--space-2)">' + emptyDesc + '</div>' +
          '</div>' +
        '</div>'
      );
      return container;
    }

    var columns = this._getColumns(actionType);
    var table = Components.DataTable({
      columns: columns,
      data: approvals,
      pageSize: 15,
      searchKeys: ['id', 'customerName', 'type', 'applicant', 'approver'],
      searchPlaceholder: '搜索审批流ID、客户名称...',
      emptyText: '暂无数据',
      onRowClick: function(id) {
        Router.navigate('#/approvals/view/' + id);
      }.bind(this),
    });

    container.appendChild(table);

    // 事件绑定：操作按钮
    if (actionType) {
      container.addEventListener('click', function(e) {
        var viewBtn = e.target.closest('.action-view');
        if (viewBtn) {
          Router.navigate('#/approvals/view/' + viewBtn.dataset.id);
          return;
        }
        var approveBtn = e.target.closest('.action-approve');
        if (approveBtn) {
          Router.navigate('#/approvals/view/' + approveBtn.dataset.id);
          return;
        }
      });
    }

    return container;
  },

  _showRejectModal(approvalId) {
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

    const { overlay, close } = UI.modal({ title: '驳回审批', content, footer, size: 'sm' });

    overlay.querySelector('#confirm-reject').addEventListener('click', () => {
      const reason = overlay.querySelector('#reject-reason').value;
      if (!reason || !reason.trim()) {
        UI.toast('请填写驳回原因', 'warning');
        return;
      }
      Store.update('approvals', approvalId, {
        status: 'rejected',
        rejectReason: reason.trim(),
        approvedAt: Helpers.now(),
      });
      close();
      UI.toast('已驳回', 'info');
      this.renderList();
    });
  },

  _handleApprove(approvalId) {
    UI.confirm({
      title: '审批通过',
      message: '确认通过该审批申请？',
      type: 'info',
      confirmText: '确认通过',
      onConfirm: () => {
        Store.update('approvals', approvalId, {
          status: 'approved',
          approvedAt: Helpers.now(),
        });
        UI.toast('已审批通过', 'success');
        this.renderList();
      }
    });
  },

  _renderMyApplications() {
    var approvals = Store.getAll('approvals')
      .filter(function(a) { return a.applicant === this._currentUser; }.bind(this))
      .sort(function(a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });

    return this._buildTable(approvals, 'view');
  },

  _renderMyApprovals() {
    var approvals = Store.getAll('approvals')
      .filter(function(a) { return a.approver === this._currentUser && a.status === 'pending'; }.bind(this))
      .sort(function(a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });

    return this._buildTable(approvals, 'approve');
  },

  init() {
    Router.register('#/approvals', () => this.renderList());
    Router.register('#/approvals/view/:id', ({ id }) => this.viewApproval(id));
  }
};