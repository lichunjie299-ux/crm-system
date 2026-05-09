/* ============================================
   CRM 系统 - Hash 路由系统
   ============================================ */
const Router = {
  _routes: [],
  _currentRoute: null,

  // 注册路由
  register(pattern, handler) {
    // pattern: '#/leads', '#/leads/view/:id'
    const regex = new RegExp('^' + pattern.replace(/:(\w+)/g, '(?<$1>[^/]+)') + '$');
    this._routes.push({ pattern, regex, handler });
  },

  // 解析当前 hash
  _parseHash() {
    const hash = window.location.hash || '#/dashboard';
    return hash;
  },

  // 匹配并执行路由
  _resolve(hash) {
    for (const route of this._routes) {
      const match = hash.match(route.regex);
      if (match) {
        const params = match.groups || {};
        this._currentRoute = { hash, pattern: route.pattern, params };
        route.handler(params);
        EventBus.emit('route:changed', this._currentRoute);
        return true;
      }
    }
    // 未匹配，跳转到 dashboard
    this.navigate('#/dashboard');
    return false;
  },

  // 编程式导航
  navigate(hash) {
    if (window.location.hash === hash) {
      // 如果 hash 相同，手动触发
      this._resolve(hash);
    } else {
      window.location.hash = hash;
    }
  },

  // 获取当前路由
  current() {
    return this._currentRoute;
  },

  // 启动
  start() {
    window.addEventListener('hashchange', () => {
      this._resolve(this._parseHash());
    });
    // 初始加载
    this._resolve(this._parseHash());
  }
};
