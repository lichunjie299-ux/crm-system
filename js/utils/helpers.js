/* ============================================
   CRM 系统 - 工具函数
   ============================================ */
const Helpers = {
  // ID 生成
  generateId(prefix) {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  },

  // 日期格式化
  formatDate(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  },

  formatDateTime(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return `${this.formatDate(dateStr)} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  },

  formatRelativeTime(dateStr) {
    if (!dateStr) return '-';
    const now = Date.now();
    const diff = now - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}小时前`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}天前`;
    return this.formatDate(dateStr);
  },

  // 金额格式化
  formatMoney(amount) {
    if (amount == null || isNaN(amount)) return '¥0.00';
    return '¥' + Number(amount).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  },

  formatMoneyShort(amount) {
    if (amount == null || isNaN(amount)) return '¥0';
    if (amount >= 10000) return '¥' + (amount / 10000).toFixed(1) + '万';
    return '¥' + Number(amount).toLocaleString('zh-CN', { maximumFractionDigits: 0 });
  },

  // 订单编号生成
  generateOrderNo() {
    const settings = JSON.parse(localStorage.getItem('crm_settings') || '{}');
    const counter = (settings.orderCounter || 0) + 1;
    settings.orderCounter = counter;
    localStorage.setItem('crm_settings', JSON.stringify(settings));
    const date = new Date();
    const dateStr = `${date.getFullYear()}${String(date.getMonth()+1).padStart(2,'0')}${String(date.getDate()).padStart(2,'0')}`;
    return `ORD-${dateStr}-${String(counter).padStart(3,'0')}`;
  },

  // 防抖
  debounce(fn, delay = 300) {
    let timer;
    return function(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  },

  // 截断文本
  truncate(str, len = 30) {
    if (!str) return '';
    return str.length > len ? str.substr(0, len) + '...' : str;
  },

  // HTML 转义
  escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  // 获取名字首字
  getInitials(name) {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  },

  // 颜色哈希
  stringToColor(str) {
    if (!str) return 'var(--primary)';
    const colors = ['var(--primary)', 'var(--success)', 'var(--warning)', 'var(--danger)', 'var(--info)', 'hsl(271,91%,50%)'];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  },

  // 今天的日期字符串
  today() {
    return new Date().toISOString().split('T')[0];
  },

  // ISO 时间戳
  now() {
    return new Date().toISOString();
  }
};
