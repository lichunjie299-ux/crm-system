/* ============================================
   CRM 系统 - 外勤记录模块
   ============================================ */
const FieldVisits = {
  COLLECTION: 'fieldVisits',

  TYPE_MAP: { '上门拜访': 'success', '会议拜访': 'warning' },

  renderList() {
    UI.setPageTitle('外勤记录', [{ label: '协同办公', hash: '#/field-visits' }, { label: '外勤记录' }]);

    const allData = Store.getAll(this.COLLECTION);

    const el = document.createElement('div');
    el.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <h2 class="page-title">外勤记录</h2>
          <p class="page-subtitle">查看所有员工外勤拜访记录，共 ${allData.length} 条</p>
        </div>
      </div>
      <div id="table-container"></div>
    `;

    const table = Components.DataTable({
      columns: [
        { key: 'employeeName', label: '员工姓名', width: '80px', sortable: true },
        { key: 'customerName', label: '客户名称', width: '130px' },
        { key: 'visitDate', label: '拜访日期', width: '100px', sortable: true, render: v => v || '-' },
        { key: 'visitType', label: '拜访类型', width: '90px', render: v => Components.Badge(v || '-', FieldVisits.TYPE_MAP[v] || 'gray') },
        { key: 'purpose', label: '拜访目的', width: '100px', render: v => v || '-' },
        { key: 'content', label: '拜访内容', render: v => Helpers.escapeHtml(Helpers.truncate(v, 80)) || '-' },
        { key: 'location', label: '拜访地点', width: '120px', render: v => v || '-' },
      ],
      data: allData,
      searchKeys: ['employeeName', 'customerName', 'purpose', 'content', 'location'],
      searchPlaceholder: '搜索员工、客户、内容...',
      emptyText: '暂无外勤记录',
      sortKey: 'visitDate',
    });

    el.querySelector('#table-container').appendChild(table);

    UI.render(el);
  },

  init() {
    Router.register('#/field-visits', () => this.renderList());
  }
};
