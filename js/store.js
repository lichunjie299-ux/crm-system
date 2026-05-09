/* ============================================
   CRM 系统 - 数据层 (Store)
   ============================================ */
const Store = {
  _cache: {},
  _prefix: 'crm_',

  // 获取集合（带缓存）
  _getCollection(collection) {
    if (!this._cache[collection]) {
      try {
        const raw = localStorage.getItem(this._prefix + collection);
        this._cache[collection] = raw ? JSON.parse(raw) : [];
      } catch (e) {
        console.error('Store: 读取失败', collection, e);
        this._cache[collection] = [];
      }
    }
    return this._cache[collection];
  },

  // 保存集合到 localStorage
  _saveCollection(collection) {
    try {
      localStorage.setItem(this._prefix + collection, JSON.stringify(this._cache[collection] || []));
    } catch (e) {
      console.error('Store: 保存失败（可能存储空间不足）', e);
      UI.toast('数据保存失败，存储空间可能不足', 'error');
    }
  },

  // 获取全部记录
  getAll(collection) {
    return [...this._getCollection(collection)];
  },

  // 按 ID 获取
  getById(collection, id) {
    return this._getCollection(collection).find(item => item.id === id) || null;
  },

  // 条件查询
  query(collection, filterFn) {
    return this._getCollection(collection).filter(filterFn);
  },

  // 计数
  count(collection, filterFn) {
    if (filterFn) return this.query(collection, filterFn).length;
    return this._getCollection(collection).length;
  },

  // 新增
  create(collection, data) {
    const items = this._getCollection(collection);
    const now = Helpers.now();
    const record = {
      ...data,
      id: data.id || Helpers.generateId(collection.replace(/s$/, '')),
      createdAt: now,
      updatedAt: now
    };
    items.unshift(record);
    this._saveCollection(collection);
    EventBus.emit(`data:changed:${collection}`, { action: 'create', record });
    return record;
  },

  // 更新
  update(collection, id, data) {
    const items = this._getCollection(collection);
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return null;
    const record = {
      ...items[index],
      ...data,
      id: items[index].id,
      createdAt: items[index].createdAt,
      updatedAt: Helpers.now()
    };
    items[index] = record;
    this._saveCollection(collection);
    EventBus.emit(`data:changed:${collection}`, { action: 'update', record });
    return record;
  },

  // 删除
  delete(collection, id) {
    const items = this._getCollection(collection);
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return false;
    const record = items.splice(index, 1)[0];
    this._saveCollection(collection);
    EventBus.emit(`data:changed:${collection}`, { action: 'delete', record });
    return true;
  },

  // 导出全部数据
  exportAll() {
    const collections = ['leads', 'customers', 'contacts', 'opportunities', 'orders', 'followups', 'products', 'settings'];
    const data = {};
    collections.forEach(c => {
      const raw = localStorage.getItem(this._prefix + c);
      if (raw) data[c] = JSON.parse(raw);
    });
    return data;
  },

  // 导入数据
  importAll(data) {
    Object.keys(data).forEach(c => {
      localStorage.setItem(this._prefix + c, JSON.stringify(data[c]));
      this._cache[c] = data[c];
    });
    EventBus.emit('data:imported');
  },

  // 清空
  clear(collection) {
    if (collection) {
      this._cache[collection] = [];
      localStorage.removeItem(this._prefix + collection);
      EventBus.emit(`data:changed:${collection}`, { action: 'clear' });
    } else {
      const collections = ['leads', 'customers', 'contacts', 'opportunities', 'orders', 'followups', 'products'];
      collections.forEach(c => {
        this._cache[c] = [];
        localStorage.removeItem(this._prefix + c);
      });
      EventBus.emit('data:cleared');
    }
  },

  // 检查是否有数据
  isEmpty() {
    return this.count('leads') === 0 && this.count('customers') === 0;
  }
};
