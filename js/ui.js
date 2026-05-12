/* ============================================
   CRM 系统 - 通用 UI 工具
   ============================================ */
const UI = {
  // SVG 图标库
  icons: {
    dashboard: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>',
    leads: '<svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>',
    customers: '<svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    contacts: '<svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    opportunities: '<svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
    orders: '<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
    followups: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    products: '<svg viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
    search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    plus: '<svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    edit: '<svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
    trash: '<svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>',
    eye: '<svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
    close: '<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    check: '<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>',
    chevronLeft: '<svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>',
    chevronRight: '<svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>',
    chevronDown: '<svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>',
    arrowRight: '<svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
    menu: '<svg viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
    download: '<svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
    upload: '<svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
    refresh: '<svg viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>',
    alert: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
    info: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12.01" y2="16"/><line x1="12" y1="8" x2="12" y2="12"/></svg>',
    convert: '<svg viewBox="0 0 24 24"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>',
    phone: '<svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    mail: '<svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
    settings: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    filter: '<svg viewBox="0 0 24 24"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>',
    trendUp: '<svg viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
    trendDown: '<svg viewBox="0 0 24 24"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>',
    calendar: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  },

  // 获取图标 HTML
  icon(name, size) {
    const svg = this.icons[name] || '';
    if (size) return `<span class="icon" style="width:${size}px;height:${size}px">${svg}</span>`;
    return svg;
  },

  // 金额格式化（供内部模板使用）
  _formatMoney(amount) {
    if (amount == null || isNaN(amount)) return '0.00';
    return Number(amount).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  },

  // Toast 通知
  toast(message, type = 'success', duration = 3000) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const iconMap = {
      success: 'check',
      error: 'alert',
      warning: 'alert',
      info: 'alert'
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-icon"><svg viewBox="0 0 24 24">${this.icons[iconMap[type]] || ''}</svg></span>
      <span class="toast-content">${Helpers.escapeHtml(message)}</span>
      <span class="toast-close" onclick="this.parentElement.remove()"><svg viewBox="0 0 24 24">${this.icons.close}</svg></span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('removing');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  // 模态框
  modal({ title, content, size, onClose, footer }) {
    // 移除已有模态框
    this.closeModal();

    const sizeClass = size === 'lg' ? 'modal-lg' : size === 'sm' ? 'modal-sm' : '';
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal ${sizeClass}">
        <div class="modal-header">
          <h3 class="modal-title">${Helpers.escapeHtml(title)}</h3>
          <button class="modal-close" data-close-modal><svg viewBox="0 0 24 24">${this.icons.close}</svg></button>
        </div>
        <div class="modal-body">${typeof content === 'string' ? content : ''}</div>
        ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
      </div>
    `;

    document.body.appendChild(overlay);

    // 如果 content 是 DOM 元素
    if (content instanceof HTMLElement) {
      overlay.querySelector('.modal-body').appendChild(content);
    }

    // 关闭事件
    const close = () => {
      overlay.remove();
      if (onClose) onClose();
    };

    overlay.querySelectorAll('[data-close-modal]').forEach(btn => btn.addEventListener('click', close));
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });

    // ESC 关闭
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        close();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);

    return { overlay, close };
  },

  // 关闭模态框
  closeModal() {
    const existing = document.getElementById('modal-overlay');
    if (existing) existing.remove();
  },

  // 确认框
  confirm({ title, message, type = 'danger', confirmText = '确认', cancelText = '取消', onConfirm }) {
    const iconName = type === 'danger' ? 'alert' : type === 'warning' ? 'alert' : 'check';
    const btnClass = type === 'danger' ? 'btn-danger' : type === 'warning' ? 'btn-warning' : 'btn-primary';

    const content = `
      <div class="confirm-icon ${type}"><svg viewBox="0 0 24 24">${this.icons[iconName]}</svg></div>
      <div class="confirm-title">${Helpers.escapeHtml(title)}</div>
      <div class="confirm-message">${Helpers.escapeHtml(message)}</div>
    `;

    const footer = `
      <button class="btn btn-secondary" data-close-modal>${Helpers.escapeHtml(cancelText)}</button>
      <button class="btn ${btnClass}" id="confirm-ok">${Helpers.escapeHtml(confirmText)}</button>
    `;

    const { overlay, close } = this.modal({ title: '', content, footer, size: 'sm' });
    // 隐藏 header
    overlay.querySelector('.modal-header').style.display = 'none';
    overlay.querySelector('.modal-body').style.paddingTop = 'var(--space-8)';

    overlay.querySelector('#confirm-ok').addEventListener('click', () => {
      close();
      if (onConfirm) onConfirm();
    });
    overlay.querySelectorAll('[data-close-modal]').forEach(btn => btn.addEventListener('click', close));
  },

  // 表单模态框
  formModal({ title, fields, data, size, onSubmit }) {
    const form = this.buildForm(fields, data);

    const footer = `
      <button class="btn btn-secondary" data-close-modal>取消</button>
      <button class="btn btn-primary" id="form-submit">保存</button>
    `;

    const { overlay, close } = this.modal({ title, content: form, size: size || 'default', footer });

    overlay.querySelector('#form-submit').addEventListener('click', () => {
      const formData = this.getFormData(overlay, fields);
      if (!formData) return; // 验证失败
      close();
      if (onSubmit) onSubmit(formData);
    });

    // 回车提交
    overlay.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        overlay.querySelector('#form-submit').click();
      }
    });

    return { overlay, close };
  },

  // 构建表单 HTML
  buildForm(fields, data = {}) {
    const html = fields.map(f => {
      const value = data[f.key] != null ? data[f.key] : (f.default != null ? f.default : '');
      const required = f.required ? '<span class="required">*</span>' : '';
      const fullWidth = f.fullWidth ? ' full-width' : '';
      let input = '';

      switch (f.type) {
        case 'select':
          const options = (f.options || []).map(o => {
            const optVal = typeof o === 'string' ? o : o.value;
            const optLabel = typeof o === 'string' ? o : o.label;
            const selected = value == optVal ? ' selected' : '';
            return `<option value="${Helpers.escapeHtml(optVal)}"${selected}>${Helpers.escapeHtml(optLabel)}</option>`;
          }).join('');
          input = `<select class="form-select" name="${f.key}" ${f.disabled ? 'disabled' : ''}>
            <option value="">请选择${f.label}</option>${options}</select>`;
          break;
        case 'textarea':
          input = `<textarea class="form-textarea" name="${f.key}" placeholder="${f.placeholder || ''}" rows="${f.rows || 3}" ${f.disabled ? 'disabled' : ''}>${Helpers.escapeHtml(String(value))}</textarea>`;
          break;
        case 'date':
          input = `<input type="date" class="form-input" name="${f.key}" value="${Helpers.escapeHtml(String(value))}" ${f.disabled ? 'disabled' : ''}>`;
          break;
        case 'number':
          input = `<input type="number" class="form-input" name="${f.key}" value="${Helpers.escapeHtml(String(value))}" placeholder="${f.placeholder || ''}" step="${f.step || 'any'}" min="${f.min != null ? f.min : ''}" ${f.disabled ? 'disabled' : ''}>`;
          break;
        case 'tags':
          const tags = Array.isArray(value) ? value : [];
          input = `
            <div class="tags-input" data-name="${f.key}">
              <div class="tags-list">${tags.map(t => `<span class="tag">${Helpers.escapeHtml(t)}<span class="tag-remove" data-tag="${Helpers.escapeHtml(t)}">&times;</span></span>`).join('')}</div>
              <input type="text" class="form-input tag-input" placeholder="输入后按回车添加" style="margin-top:4px">
            </div>`;
          break;
        case 'multiSelect':
          const selectedVals = Array.isArray(value) ? value : (value ? String(value).split(',') : []);
          const msOptions = (f.options || []).map(o => {
            const optVal = typeof o === 'string' ? o : o.value;
            const optLabel = typeof o === 'string' ? o : o.label;
            const checked = selectedVals.includes(optVal) ? ' checked' : '';
            return `<label class="multi-select-item"><input type="checkbox" name="${f.key}" value="${Helpers.escapeHtml(optVal)}"${checked}><span class="multi-select-label">${Helpers.escapeHtml(optLabel)}</span></label>`;
          }).join('');
          input = `<div class="multi-select-group" data-name="${f.key}">${msOptions}</div>`;
          break;
        case 'file':
          input = `<div class="file-input-wrapper" data-name="${f.key}">
            <input type="file" class="form-file" name="${f.key}" accept="${f.accept || ''}" ${f.multiple ? 'multiple' : ''}>
            <div class="file-list" data-file-list></div>
          </div>`;
          break;
        case 'productAmountList':
          const paItems = Array.isArray(value) && value.length > 0 ? value : [{ product: '', amount: '' }];
          const prodOpts = f.options || [];
          input = `<div class="product-amount-list" data-name="${f.key}">
            <div class="pa-items" data-pa-items>
              ${paItems.map((item, i) => {
                const optsHtml = prodOpts.map(o => {
                  const optVal = typeof o === 'string' ? o : o.value;
                  const optLabel = typeof o === 'string' ? o : o.label;
                  const selected = item.product === optVal ? ' selected' : '';
                  return `<option value="${Helpers.escapeHtml(optVal)}"${selected}>${Helpers.escapeHtml(optLabel)}</option>`;
                }).join('');
                return `<div class="pa-row" data-index="${i}">
                  <select class="form-select pa-product" data-pa-index="${i}">
                    <option value="">选择产品</option>
                    ${optsHtml}
                  </select>
                  <input type="number" class="form-input pa-amount" value="${item.amount || ''}" placeholder="预计成交金额（元）" step="0.01" min="0" data-pa-index="${i}">
                  <button type="button" class="btn btn-sm pa-remove" data-pa-index="${i}" ${paItems.length <= 1 ? 'style="display:none"' : ''}>
                    <svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>`;
              }).join('')}
            </div>
            <div class="pa-total" data-pa-total>合计金额：¥<span data-pa-total-amount>${this._formatMoney(paItems.reduce((s, i) => s + (parseFloat(i.amount) || 0), 0))}</span></div>
            <button type="button" class="btn btn-secondary btn-sm pa-add"><svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> 添加意向产品</button>
          </div>`;
          break;
        case 'dropConditionBuilder':
          const dcItems = Array.isArray(value) && value.length > 0 ? value : [{ type: 'noDeal', days: '' }];
          input = `<div class="drop-condition-builder" data-name="${f.key}">
            <div class="dc-items" data-dc-items>
              ${dcItems.map((item, i) => {
                const isLast = i === dcItems.length - 1;
                return `<div class="dc-row" data-index="${i}">
                  <select class="form-select dc-type" data-dc-index="${i}">
                    <option value="noDeal" ${item.type === 'noDeal' ? 'selected' : ''}>X天未成单掉保</option>
                    <option value="noVisit" ${item.type === 'noVisit' ? 'selected' : ''}>X天未拜访掉保</option>
                    <option value="noOpportunity" ${item.type === 'noOpportunity' ? 'selected' : ''}>X天未创建商机掉保</option>
                  </select>
                  <div class="dc-days-group">
                    <input type="number" class="form-input dc-days" value="${item.days || ''}" placeholder="天数" min="1" data-dc-index="${i}">
                    <span class="dc-days-label">天</span>
                  </div>
                  <button type="button" class="btn btn-sm btn-text dc-remove" data-dc-index="${i}" ${dcItems.length <= 1 ? 'style="display:none"' : ''}>
                    <svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                  ${!isLast ? '<div class="dc-or">或</div>' : ''}
                </div>`;
              }).join('')}
            </div>
            <button type="button" class="btn btn-secondary btn-sm dc-add"><svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> 添加条件</button>
          </div>`;
          break;
        default:
          input = `<input type="${f.type || 'text'}" class="form-input" name="${f.key}" value="${Helpers.escapeHtml(String(value))}" placeholder="${f.placeholder || ''}" ${f.disabled ? 'disabled' : ''}>`;
      }

      return `<div class="form-group${fullWidth}">
        <label class="form-label">${Helpers.escapeHtml(f.label)}${required}</label>
        ${input}
      </div>`;
    }).join('');

    const el = document.createElement('div');
    el.className = 'form-grid';
    el.innerHTML = html;

    // 标签输入处理
    el.querySelectorAll('.tags-input').forEach(container => {
      const input = container.querySelector('.tag-input');
      const list = container.querySelector('.tags-list');
      const tags = new Set(Array.from(list.querySelectorAll('.tag')).map(t => t.textContent.replace('×', '').trim()));

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && input.value.trim()) {
          e.preventDefault();
          const val = input.value.trim();
          if (!tags.has(val)) {
            tags.add(val);
            const tag = document.createElement('span');
            tag.className = 'tag';
            tag.innerHTML = `${Helpers.escapeHtml(val)}<span class="tag-remove" data-tag="${Helpers.escapeHtml(val)}">&times;</span>`;
            list.appendChild(tag);
          }
          input.value = '';
        }
      });

      list.addEventListener('click', (e) => {
        const remove = e.target.closest('.tag-remove');
        if (remove) {
          tags.delete(remove.dataset.tag);
          remove.parentElement.remove();
        }
      });
    });

    // 掉保条件构建器动态交互
    el.querySelectorAll('.drop-condition-builder').forEach(builder => {
      const itemsContainer = builder.querySelector('[data-dc-items]');
      const addBtn = builder.querySelector('.dc-add');

      function dcUpdateOr() {
        const rows = itemsContainer.querySelectorAll('.dc-row');
        rows.forEach((row, i) => {
          let orEl = row.querySelector('.dc-or');
          if (i < rows.length - 1) {
            if (!orEl) {
              orEl = document.createElement('div');
              orEl.className = 'dc-or';
              orEl.textContent = '或';
              row.appendChild(orEl);
            }
          } else {
            if (orEl) orEl.remove();
          }
        });
      }

      function dcAddRow(type, days) {
        const idx = itemsContainer.children.length;
        const row = document.createElement('div');
        row.className = 'dc-row';
        row.dataset.index = idx;
        row.innerHTML = `
          <select class="form-select dc-type" data-dc-index="${idx}">
            <option value="noDeal">X天未成单掉保</option>
            <option value="noVisit">X天未拜访掉保</option>
            <option value="noOpportunity">X天未创建商机掉保</option>
          </select>
          <div class="dc-days-group">
            <input type="number" class="form-input dc-days" value="${days || ''}" placeholder="天数" min="1" data-dc-index="${idx}">
            <span class="dc-days-label">天</span>
          </div>
          <button type="button" class="btn btn-sm btn-text dc-remove" data-dc-index="${idx}">
            <svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>`;
        if (type) row.querySelector('.dc-type').value = type;
        itemsContainer.appendChild(row);
        // Show remove on all rows
        itemsContainer.querySelectorAll('.dc-remove').forEach(b => b.style.display = '');
        dcUpdateOr();
      }

      // Remove row
      itemsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.dc-remove');
        if (!btn) return;
        const rows = itemsContainer.querySelectorAll('.dc-row');
        if (rows.length <= 1) return;
        btn.closest('.dc-row').remove();
        if (itemsContainer.querySelectorAll('.dc-row').length <= 1) {
          itemsContainer.querySelector('.dc-remove').style.display = 'none';
        }
        dcUpdateOr();
      });

      // Add row
      if (addBtn) {
        addBtn.addEventListener('click', () => dcAddRow('noDeal', ''));
      }
    });

    // 产品-金额列表动态交互（添加/删除/合计）
    el.querySelectorAll('.product-amount-list').forEach(list => {
      const itemsContainer = list.querySelector('[data-pa-items]');
      const totalSpan = list.querySelector('[data-pa-total-amount]');
      const addBtn = list.querySelector('.pa-add');
      const prodOpts = list.querySelector('.pa-product')?.innerHTML || '';

      function paUpdateTotal() {
        let total = 0;
        itemsContainer.querySelectorAll('.pa-amount').forEach(inp => {
          total += parseFloat(inp.value) || 0;
        });
        if (totalSpan) totalSpan.textContent = UI._formatMoney(total);
      }

      function paAddRow(productVal, amountVal) {
        const idx = itemsContainer.children.length;
        const row = document.createElement('div');
        row.className = 'pa-row';
        row.dataset.index = idx;
        row.innerHTML = `
          <select class="form-select pa-product" data-pa-index="${idx}">
            ${prodOpts}
          </select>
          <input type="number" class="form-input pa-amount" value="${amountVal || ''}" placeholder="预计成交金额（元）" step="0.01" min="0" data-pa-index="${idx}">
          <button type="button" class="btn btn-sm pa-remove" data-pa-index="${idx}">
            <svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>`;
        if (productVal) row.querySelector('.pa-product').value = productVal;
        // 显示全部行的删除按钮
        itemsContainer.querySelectorAll('.pa-remove').forEach(b => b.style.display = '');
        itemsContainer.appendChild(row);
        paUpdateTotal();
      }

      // 删除行
      itemsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.pa-remove');
        if (!btn) return;
        const rows = itemsContainer.querySelectorAll('.pa-row');
        if (rows.length <= 1) return;
        btn.closest('.pa-row').remove();
        if (itemsContainer.querySelectorAll('.pa-row').length <= 1) {
          itemsContainer.querySelector('.pa-remove').style.display = 'none';
        }
        paUpdateTotal();
      });

      // 金额变更时更新合计
      itemsContainer.addEventListener('input', (e) => {
        if (e.target.classList.contains('pa-amount')) paUpdateTotal();
      });

      // 添加行
      if (addBtn) {
        addBtn.addEventListener('click', () => paAddRow('', ''));
      }
    });

    return el;
  },

  // 获取表单数据（带验证）
  getFormData(container, fields) {
    const data = {};
    let valid = true;

    // 清除旧错误
    container.querySelectorAll('.form-error').forEach(e => e.remove());
    container.querySelectorAll('.error').forEach(e => e.classList.remove('error'));

    fields.forEach(f => {
      if (f.type === 'tags') {
        const tagsContainer = container.querySelector(`[data-name="${f.key}"]`);
        data[f.key] = tagsContainer ? Array.from(tagsContainer.querySelectorAll('.tag')).map(t => t.textContent.replace('\u00d7', '').trim()) : [];
        return;
      }
    
      if (f.type === 'multiSelect') {
        const msGroup = container.querySelector(`[data-name="${f.key}"]`);
        const checked = msGroup ? Array.from(msGroup.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value) : [];
        data[f.key] = checked;
        if (f.required && checked.length === 0) {
          valid = false;
          const group = container.querySelector(`[data-name="${f.key}"]`);
          if (group) {
            group.classList.add('error');
            const err = document.createElement('div');
            err.className = 'form-error';
            err.textContent = `请至少选择一个${f.label}`;
            group.parentElement.appendChild(err);
          }
          return;
        }
        return;
      }
    
      if (f.type === 'file') {
        const fileInput = container.querySelector(`input[type="file"][name="${f.key}"]`);
        data[f.key] = fileInput && fileInput.files.length > 0 ? Array.from(fileInput.files).map(fi => fi.name).join(',') : (data[f.key] || '');
        return;
      }

      if (f.type === 'dropConditionBuilder') {
        const dcContainer = container.querySelector(`[data-name="${f.key}"]`);
        const items = [];
        if (dcContainer) {
          dcContainer.querySelectorAll('.dc-row').forEach(row => {
            const type = row.querySelector('.dc-type')?.value || '';
            const days = parseInt(row.querySelector('.dc-days')?.value) || 0;
            if (type && days > 0) {
              items.push({ type, days });
            }
          });
        }
        data[f.key] = items;
        // 自动生成显示文本
        data.dropRule = items.map(c => {
          if (c.type === 'noDeal') return `超${c.days}天未成单掉保`;
          if (c.type === 'noVisit') return `超${c.days}天未拜访掉保`;
          if (c.type === 'noOpportunity') return `超${c.days}天未创建商机掉保`;
          return '';
        }).join(' / ');
        if (f.required && items.length === 0) {
          valid = false;
          const err = document.createElement('div');
          err.className = 'form-error';
          err.textContent = `请至少配置一个${f.label}`;
          if (dcContainer) dcContainer.parentElement.appendChild(err);
        }
        return;
      }

      if (f.type === 'productAmountList') {
        const paContainer = container.querySelector(`[data-name="${f.key}"]`);
        const items = [];
        let totalAmount = 0;
        if (paContainer) {
          paContainer.querySelectorAll('.pa-row').forEach(row => {
            const product = row.querySelector('.pa-product')?.value || '';
            const amountStr = row.querySelector('.pa-amount')?.value || '';
            if (product) {
              const amt = parseFloat(amountStr) || 0;
              items.push({ product, amount: amt });
              totalAmount += amt;
            }
          });
        }
        data[f.key] = items;
        data.amount = totalAmount;
        if (f.required && items.length === 0) {
          valid = false;
          const err = document.createElement('div');
          err.className = 'form-error';
          err.textContent = `请至少添加一个${f.label}`;
          if (paContainer) paContainer.parentElement.appendChild(err);
          return;
        }
        return;
      }

      const el = container.querySelector(`[name="${f.key}"]`);
      if (!el) return;

      let value = el.value.trim();

      if (f.type === 'number' && value !== '') {
        value = parseFloat(value);
      }

      // 验证
      if (f.required && (value === '' || value == null)) {
        valid = false;
        el.classList.add('error');
        const err = document.createElement('div');
        err.className = 'form-error';
        err.textContent = `${f.label}不能为空`;
        el.parentElement.appendChild(err);
        return;
      }

      data[f.key] = value;
    });

    return valid ? data : null;
  },

  // 设置页面标题（顶栏内品牌区域不变，面包屑显示在品牌区后）
  setPageTitle(title, breadcrumbs) {
    const topbarLeft = document.querySelector('.topbar-left');
    if (!topbarLeft) return;

    // 保持品牌区域不变，更新面包屑/标题区域
    let html = `
      <button class="btn-sidebar-toggle" id="btn-sidebar-toggle">
        <svg viewBox="0 0 24 24" style="width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
      <div class="topbar-brand">
        <div class="brand-icon">N</div>
        <span class="brand-text">涅槃 CRM</span>
        <span class="brand-sub">企业服务管理平台</span>
      </div>`;

    if (breadcrumbs && breadcrumbs.length) {
      html += '<div class="topbar-breadcrumb">';
      breadcrumbs.forEach((b, i) => {
        if (i > 0) html += '<span class="sep">/</span>';
        if (b.hash) {
          html += `<a href="${b.hash}">${Helpers.escapeHtml(b.label)}</a>`;
        } else {
          html += `<span>${Helpers.escapeHtml(b.label)}</span>`;
        }
      });
      html += '</div>';
    }

    topbarLeft.innerHTML = html;

    // 重新绑定汉堡按钮
    const btn = document.getElementById('btn-sidebar-toggle');
    if (btn) {
      btn.addEventListener('click', () => {
        document.querySelector('.sidebar').classList.toggle('open');
      });
    }
  },

  // 渲染内容区
  render(html) {
    const content = document.getElementById('app-content');
    if (content) {
      if (typeof html === 'string') {
        content.innerHTML = html;
      } else if (html instanceof HTMLElement) {
        content.innerHTML = '';
        content.appendChild(html);
      }
    }
  }
};
