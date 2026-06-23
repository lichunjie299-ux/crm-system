/* ============================================
   CRM 移动端 - App 核心
   ============================================ */
const MobileApp = {
  _currentView: null,
  _backStack: [],

  init() {
    window.addEventListener('hashchange', () => this._handleRoute());
    // Tab bar click handlers
    document.querySelectorAll('.tab-item').forEach(tab => {
      tab.addEventListener('click', () => {
        const route = tab.dataset.tab;
        this._backStack = [];
        if (route === 'leads') location.hash = '#/mobile/leads';
        else if (route === 'customers') location.hash = '#/mobile/customers';
        else if (route === 'opportunities') location.hash = '#/mobile/opportunities';
      });
    });
    this._handleRoute();
  },

  _handleRoute() {
    const hash = location.hash || '#/mobile/leads';
    this._updateTabBar(hash);

    if (hash.startsWith('#/mobile/leads/view/')) {
      const id = hash.split('/view/')[1];
      MobileLeads.renderDetail(id);
    } else if (hash.startsWith('#/mobile/leads')) {
      MobileLeads.renderList();
    } else if (hash.startsWith('#/mobile/customers/view/')) {
      const id = hash.split('/view/')[1];
      MobileCustomers.renderDetail(id);
    } else if (hash.match(/^#\/mobile\/customers\/(os|is|ls)$/)) {
      MobileCustomers.renderList(hash.split('/')[3]);
    } else if (hash.startsWith('#/mobile/customers')) {
      MobileCustomers.renderList('os');
    } else if (hash.startsWith('#/mobile/opportunities/view/')) {
      const id = hash.split('/view/')[1];
      MobileOpportunities.renderDetail(id);
    } else if (hash.startsWith('#/mobile/opportunities')) {
      MobileOpportunities.renderList();
    } else {
      location.hash = '#/mobile/leads';
    }
  },

  _updateTabBar(hash) {
    document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
    if (hash.includes('/leads')) document.querySelector('[data-tab="leads"]')?.classList.add('active');
    else if (hash.includes('/customers')) document.querySelector('[data-tab="customers"]')?.classList.add('active');
    else if (hash.includes('/opportunities')) document.querySelector('[data-tab="opportunities"]')?.classList.add('active');
  },

  // Navigation helpers
  setNav(title, leftContent, rightContent) {
    document.getElementById('nav-left').innerHTML = leftContent || '';
    document.getElementById('nav-title').textContent = title;
    document.getElementById('nav-right').innerHTML = rightContent || '';
  },

  setNavBack(onBack) {
    const backBtn = `<button class="nav-btn nav-btn-back" id="nav-back-btn">
      <svg viewBox="0 0 12 20"><path d="M10 18L2 10l8-8" stroke="#007AFF" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg> 返回
    </button>`;
    document.getElementById('nav-left').innerHTML = backBtn;
    document.getElementById('nav-back-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      if (onBack) onBack();
      else history.back();
    });
  },

  setNavRight(text, onClick, danger) {
    const cls = danger ? 'nav-btn nav-btn-danger nav-btn-bold' : 'nav-btn nav-btn-bold';
    document.getElementById('nav-right').innerHTML = `<button class="${cls}" id="nav-right-btn">${text}</button>`;
    document.getElementById('nav-right-btn')?.addEventListener('click', onClick);
  },

  hideTabBar() {
    document.getElementById('tab-bar').style.display = 'none';
    document.getElementById('page-container').classList.add('no-tab');
  },

  showTabBar() {
    document.getElementById('tab-bar').style.display = 'flex';
    document.getElementById('page-container').classList.remove('no-tab');
  },

  // Get content container
  getContainer() {
    return document.getElementById('page-container');
  },

  // Toast
  toast(message, type) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const el = document.createElement('div');
    el.className = 'toast' + (type ? ` toast-${type}` : '');
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity 0.3s'; setTimeout(() => el.remove(), 300); }, 1500);
  },

  // Confirm dialog
  confirm({ title, message, confirmText, cancelText, destructive, onConfirm }) {
    const overlay = document.createElement('div');
    overlay.className = 'confirm-overlay';
    overlay.innerHTML = `
      <div class="confirm-dialog">
        ${title ? `<div class="confirm-title">${title}</div>` : ''}
        <div class="confirm-message">${message || ''}</div>
        <div class="confirm-btns">
          <button class="confirm-btn" id="confirm-cancel">${cancelText || '取消'}</button>
          <button class="confirm-btn ${destructive ? 'confirm-btn-destructive' : 'confirm-btn-bold'}" id="confirm-ok">${confirmText || '确定'}</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.querySelector('#confirm-cancel').addEventListener('click', () => overlay.remove());
    overlay.querySelector('#confirm-ok').addEventListener('click', () => {
      overlay.remove();
      if (onConfirm) onConfirm();
    });
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
  },

  // Action Sheet
  actionSheet({ title, buttons, cancelText }) {
    const overlay = document.createElement('div');
    overlay.className = 'action-sheet-overlay';
    const sheet = document.createElement('div');
    sheet.className = 'action-sheet';
    let html = '';
    if (title) html += `<div class="action-sheet-title">${title}</div>`;
    buttons.forEach((b, i) => {
      html += `<button class="action-sheet-btn ${b.destructive ? 'destructive' : ''}" data-index="${i}">${b.label}</button>`;
    });
    html += `<button class="action-sheet-cancel" id="action-cancel">${cancelText || '取消'}</button>`;
    sheet.innerHTML = html;
    document.body.appendChild(overlay);
    document.body.appendChild(sheet);
    const close = () => { overlay.remove(); sheet.remove(); };
    overlay.addEventListener('click', close);
    sheet.querySelector('#action-cancel').addEventListener('click', close);
    buttons.forEach((b, i) => {
      sheet.querySelector(`[data-index="${i}"]`).addEventListener('click', () => {
        close();
        if (b.onClick) b.onClick();
      });
    });
  },

  // Build label-value pair for detail cards
  detailRow(label, value) {
    const val = value && value !== '-' && value !== '' ? value : '<span class="detail-value-empty">未填写</span>';
    return `<div class="detail-row"><span class="detail-label">${label}</span><span class="detail-value">${val}</span></div>`;
  },

  // Badge helper
  badge(text, type) {
    const t = type || 'gray';
    return `<span class="cell-badge cell-badge-${t}">${text}</span>`;
  },

  // Stage badge
  stageBadge(stage) {
    const map = { '需求待确认': 'primary', '需求确认': 'info', '方案认可': 'warning', '确定合作': 'warning', '合同签约': 'info', '赢单': 'success', '输单': 'danger' };
    return this.badge(stage, map[stage] || 'gray');
  },

  // Format money
  formatMoney(amount) {
    if (amount == null || isNaN(amount)) return '¥0.00';
    return '¥' + Number(amount).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  },

  formatDate(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  },

  // Search input helper
  createSearchBar(placeholder, onInput) {
    const div = document.createElement('div');
    div.className = 'search-bar';
    div.innerHTML = `
      <div class="search-bar-inner">
        <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        <input type="text" placeholder="${placeholder || '搜索...'}" id="mobile-search-input">
      </div>
    `;
    div.querySelector('input').addEventListener('input', (e) => {
      if (onInput) onInput(e.target.value);
    });
    return div;
  },

  // Simple list cell builder
  createListCell(title, subtitle, rightContent, onClick) {
    const div = document.createElement('div');
    div.className = 'list-cell list-cell-chevron list-cell-link';
    div.innerHTML = `
      <div class="list-cell-content">
        <div class="list-cell-title">${title}</div>
        ${subtitle ? `<div class="list-cell-subtitle">${subtitle}</div>` : ''}
      </div>
      ${rightContent ? `<div class="list-cell-right">${rightContent}</div>` : ''}
    `;
    if (onClick) div.addEventListener('click', onClick);
    return div;
  },

  // Segmented control
  createSegmented(items, activeIndex, onChange) {
    const div = document.createElement('div');
    div.className = 'segmented-control';
    items.forEach((item, i) => {
      const btn = document.createElement('button');
      btn.className = 'seg-item' + (i === activeIndex ? ' active' : '');
      btn.textContent = item.label;
      btn.addEventListener('click', () => {
        div.querySelectorAll('.seg-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (onChange) onChange(item.value, i);
      });
      div.appendChild(btn);
    });
    return div;
  },

  // Simple form modal (iOS style full screen)
  showForm({ title, fields, data, onSubmit }) {
    const overlay = document.createElement('div');
    overlay.className = 'form-overlay';
    const modal = document.createElement('div');
    modal.className = 'form-modal';

    // Group fields by category (simple = all in one group)
    const fieldMap = {};
    fields.forEach(f => { fieldMap[f.key] = f; });

    let bodyHtml = '<div class="form-body">';
    bodyHtml += '<div class="form-group">';
    fields.forEach(f => {
      const val = data ? (data[f.key] || '') : '';
      bodyHtml += `<div class="form-label">${f.label}</div>`;
      const requiredAttr = f.required ? 'required' : '';
      if (f.type === 'select') {
        const opts = f.options || [];
        let optHtml = '<option value="">请选择</option>';
        opts.forEach(o => {
          const ov = typeof o === 'object' ? o.value : o;
          const ol = typeof o === 'object' ? o.label : o;
          const sel = val === ov ? 'selected' : '';
          optHtml += `<option value="${ov}" ${sel}>${ol}</option>`;
        });
        bodyHtml += `<div class="form-cell"><span class="form-cell-label">${f.label}</span><select class="form-cell-select" name="${f.key}" ${requiredAttr}>${optHtml}</select></div>`;
      } else if (f.type === 'textarea') {
        bodyHtml += `<div class="form-cell" style="flex-direction:column;align-items:stretch"><textarea class="form-cell-textarea" name="${f.key}" placeholder="${f.placeholder || ''}" ${requiredAttr}>${val}</textarea></div>`;
      } else if (f.type === 'date') {
        bodyHtml += `<div class="form-cell"><span class="form-cell-label">${f.label}</span><input type="date" class="form-cell-input" name="${f.key}" value="${val}" ${requiredAttr}></div>`;
      } else {
        bodyHtml += `<div class="form-cell"><span class="form-cell-label">${f.label}</span><input type="${f.type === 'email' ? 'email' : 'text'}" class="form-cell-input" name="${f.key}" value="${Helpers.escapeHtml(val)}" placeholder="${f.placeholder || ''}" ${requiredAttr}></div>`;
      }
    });
    bodyHtml += '</div></div>';

    modal.innerHTML = `
      <div class="form-nav">
        <button class="nav-btn" id="form-cancel">取消</button>
        <div class="form-nav-title">${title}</div>
        <button class="nav-btn nav-btn-bold" id="form-save">保存</button>
      </div>
      ${bodyHtml}
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(modal);

    const close = () => { overlay.remove(); modal.remove(); };
    overlay.addEventListener('click', close);
    modal.querySelector('#form-cancel').addEventListener('click', close);

    modal.querySelector('#form-save').addEventListener('click', () => {
      const formData = {};
      let valid = true;
      fields.forEach(f => {
        const input = modal.querySelector(`[name="${f.key}"]`);
        if (!input) return;
        let val = input.value;
        if (f.required && !val) { valid = false; }
        formData[f.key] = val;
      });
      if (!valid) {
        this.toast('请填写所有必填字段', 'error');
        return;
      }
      close();
      if (onSubmit) onSubmit(formData);
    });

    return modal;
  },

  // Follow-up form
  showFollowUpForm(relatedType, relatedId, onSuccess) {
    this.showForm({
      title: '写跟进',
      fields: [
        { key: 'type', label: '跟进方式', type: 'select', required: true, options: ['电话', '拜访', '邮件', '微信', '会议', '其他'] },
        { key: 'content', label: '跟进内容', type: 'textarea', required: true, placeholder: '记录跟进详情...' },
        { key: 'nextFollowDate', label: '下次跟进日期', type: 'date' },
      ],
      data: { type: '电话' },
      onSubmit: (formData) => {
        formData.relatedType = relatedType;
        formData.relatedId = relatedId;
        Store.create('followups', formData);
        this.toast('跟进记录已添加');
        if (onSuccess) onSuccess(formData);
      }
    });
  }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => MobileApp.init());
