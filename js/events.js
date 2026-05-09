/* ============================================
   CRM 系统 - 事件总线 (EventBus)
   ============================================ */
const EventBus = {
  _listeners: {},

  on(event, callback) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(callback);
    return () => this.off(event, callback);
  },

  off(event, callback) {
    if (!this._listeners[event]) return;
    this._listeners[event] = this._listeners[event].filter(cb => cb !== callback);
  },

  emit(event, ...args) {
    if (this._listeners[event]) {
      this._listeners[event].forEach(cb => cb(...args));
    }
    // 通配符支持
    const parts = event.split(':');
    if (parts.length > 1) {
      const wildcard = parts[0] + ':*';
      if (this._listeners[wildcard]) {
        this._listeners[wildcard].forEach(cb => cb(event, ...args));
      }
    }
  },

  clear() {
    this._listeners = {};
  }
};
