/* ============================================
   CRM 系统 - 演示种子数据
   ============================================ */
const SeedData = {

  shouldSeed() {
    return Store.isEmpty();
  },

  seed() {
    if (!this.shouldSeed()) return;

    // 产品
    const products = [
      { name: '企业版 ERP 系统', code: 'P001', category: '软件产品', price: 198000, unit: '套', status: '在售', description: '包含财务、采购、销售、库存等核心模块' },
      { name: '标准版 CRM 系统', code: 'P002', category: '软件产品', price: 68000, unit: '套', status: '在售', description: '客户关系管理系统标准版' },
      { name: '数据分析平台', code: 'P003', category: '软件产品', price: 128000, unit: '年', status: '在售', description: '企业级数据分析与可视化平台' },
      { name: '技术咨询服务', code: 'S001', category: '咨询服务', price: 2000, unit: '人/天', status: '在售', description: '技术架构咨询与方案设计' },
      { name: '系统集成服务', code: 'S002', category: '技术服务', price: 50000, unit: '次', status: '在售', description: '企业系统集成与定制开发' },
      { name: '员工培训课程', code: 'T001', category: '培训课程', price: 800, unit: '人/天', status: '在售', description: '系统操作培训' },
      { name: '服务器硬件套装', code: 'H001', category: '硬件设备', price: 35000, unit: '套', status: '在售', description: '高性能服务器套装' },
      { name: '云托管服务', code: 'S003', category: '技术服务', price: 3600, unit: '年', status: '在售', description: '应用云端托管与运维' },
    ];

    const productRecords = products.map(p => Store.create('products', p));

    // 线索
    const leadData = [
      { customerName: '上海锦程科技有限公司', customerType: '企业客户', contactInfo: '张伟 13812345678', cleanTag: '有效线索-转客户', cleanMemo: '号码验证通过，意向明确', region: '上海', industry: '互联网/IT', bizLine: '上海营销中心', productLine: '新零售', source: '市场活动-展会', status: '新线索', assignee: '李明' },
      { customerName: '北京云端数据科技', customerType: '企业客户', contactInfo: '王芳 13987654321', cleanTag: '有效线索-转客户', cleanMemo: '客户主动来电，需求清晰', region: '北京', industry: '互联网/IT', bizLine: '北京营销中心', productLine: '零售SaaS', source: '市场活动-展会', status: '跟进中', assignee: '张华' },
      { customerName: '深圳创新信息技术', customerType: '企业客户', contactInfo: '李娜 13611223344', cleanTag: '有效线索-转客户', cleanMemo: 'CTO亲自对接，预算充足', region: '深圳', industry: '制造业', bizLine: '深圳营销中心', productLine: '智慧商超', source: '市场活动-展会', status: '跟进中', assignee: '李明' },
      { customerName: '广州汇智软件', customerType: '企业客户', contactInfo: '陈强 13755668899', cleanTag: '暂未接通-继续清洗', cleanMemo: '待二次确认联系方式', region: '广州', industry: '互联网/IT', bizLine: '广州营销中心', productLine: '到店', source: '市场活动-展会', status: '新线索', assignee: '王丽' },
      { customerName: '成都天府数字', customerType: '企业客户', contactInfo: '赵敏 13866778899', cleanTag: '有效线索-转客户', cleanMemo: '金融行业客户，需合规审核', region: '成都', industry: '金融', bizLine: '杭州营销中心', productLine: '零售SaaS', source: '市场活动-展会', status: '新线索', assignee: '张华' },
      { customerName: '杭州西湖互联', customerType: '企业客户', contactInfo: '孙磊 13922334455', cleanTag: '暂未接通-继续清洗', cleanMemo: '广告引流线索，待核实', region: '杭州', industry: '互联网/IT', bizLine: '上海营销中心', productLine: '视频号', source: '市场活动-展会', status: '跟进中', assignee: '李明' },
      { customerName: '南京紫金山科技', customerType: '企业客户', contactInfo: '周洁 13533447788', cleanTag: '无效线索-放弃公海', cleanMemo: '号码已停机，无法联系', region: '南京', industry: '零售', bizLine: '广州营销中心', productLine: '新零售', source: '市场活动-展会', status: '已关闭', assignee: '王丽', remark: '需求与产品不匹配' },
      { customerName: '武汉黄鹤信息', customerType: '企业客户', contactInfo: '吴刚 13644556677', cleanTag: '有效线索-转客户', cleanMemo: '线索有效，已安排拜访', region: '武汉', industry: '互联网/IT', bizLine: '杭州营销中心', productLine: '定制开发', source: '市场活动-展会', status: '跟进中', assignee: '张华' },
      { customerName: '重庆山城数据', customerType: '企业客户', contactInfo: '郑琳 13777889900', cleanTag: '有效线索-转客户', cleanMemo: '转介绍客户，决策链清晰', region: '重庆', industry: '金融', bizLine: '上海营销中心', productLine: '新零售', source: '市场活动-展会', status: '新线索', assignee: '李明' },
      { customerName: '西安古都科技', customerType: '企业客户', contactInfo: '钱进 13888990011', cleanTag: '暂未接通-继续清洗', cleanMemo: '表单提交，信息待核实', region: '西安', industry: '制造业', bizLine: '北京营销中心', productLine: '零售SaaS', source: '市场活动-展会', status: '新线索', assignee: '王丽' },
      { customerName: '天津滨海软件', customerType: '企业客户', contactInfo: '冯雪 13299001122', cleanTag: '有效线索-转客户', cleanMemo: '微信咨询转来，意向中等', region: '天津', industry: '互联网/IT', bizLine: '深圳营销中心', productLine: '智慧商超', source: '市场活动-展会', status: '跟进中', assignee: '张华' },
      { customerName: '长沙星城信息', customerType: '企业客户', contactInfo: '许强 13100112233', cleanTag: '暂未接通-继续清洗', cleanMemo: '展会收集名片，待跟进', region: '长沙', industry: '零售', bizLine: '上海营销中心', productLine: '智慧商超', source: '市场活动-展会', status: '新线索', assignee: '李明' },
    ];

    const leadRecords = leadData.map((l, i) => {
      const d = new Date();
      d.setDate(d.getDate() - Math.floor(Math.random() * 30));
      l.createdAt = d.toISOString();
      l.updatedAt = d.toISOString();
      return Store.create('leads', l);
    });

    // 将部分线索转化为客户
    const convertedLeads = leadRecords.slice(0, 5);
    const customerData = [
      { name: '上海锦程科技有限公司', type: '企业客户', businessLine: '上海营销中心', productLine: '新零售', region: '上海', industry: '互联网/IT', status: '活跃', customerSource: '自拓线索', assignee: '李明', isBrandCustomer: '是', brandName: '锦程', storeCount: '11-30家', phone: '021-55667788', email: 'contact@jincheng.com', address: '上海市浦东新区张江高科技园区', tags: ['VIP', '重点客户'] },
      { name: '北京云端数据科技', type: '企业客户', businessLine: '北京营销中心', productLine: '零售SaaS', region: '北京', industry: '互联网/IT', status: '活跃', customerSource: '自拓线索', assignee: '张华', isBrandCustomer: '是', brandName: '云端', storeCount: '1-10家', phone: '010-88776655', email: 'info@yunduan.cn', address: '北京市海淀区中关村软件园', tags: ['合作伙伴'] },
      { name: '深圳创新信息技术', type: '企业客户', businessLine: '深圳营销中心', productLine: '智慧商超', region: '深圳', industry: '制造业', status: '活跃', customerSource: '自拓线索', assignee: '王丽', isBrandCustomer: '是', brandName: '创新', storeCount: '51-100家', phone: '0755-33445566', email: 'biz@chuangxin.io', address: '深圳市南山区科技园', tags: ['大客户', 'VIP'] },
      { name: '广州汇智软件', type: '企业客户', businessLine: '广州营销中心', productLine: '到店', region: '广州', industry: '互联网/IT', status: '沉默', customerSource: '自拓线索', assignee: '王丽', isBrandCustomer: '否', brandName: '', storeCount: '无门店', phone: '020-11223344', email: 'sales@huizhi.com', address: '广州市天河区天河软件园', tags: [] },
      { name: '成都天府数字', type: '企业客户', businessLine: '杭州营销中心', productLine: '零售SaaS', region: '成都', industry: '金融', status: '活跃', customerSource: '自拓线索', assignee: '张华', isBrandCustomer: '是', brandName: '天府', storeCount: '1-10家', phone: '028-66778899', email: 'info@tianfu.cn', address: '成都市高新区天府三街', tags: ['重点客户'] },
    ];

    const customerRecords = customerData.map((c, i) => {
      c.sourceLeadId = convertedLeads[i].id;
      const record = Store.create('customers', c);
      // 更新线索为已转化
      Store.update('leads', convertedLeads[i].id, { status: '已转化', convertedCustomerId: record.id });
      return record;
    });

    // 联系人
    const contactData = [
      { customerId: customerRecords[0].id, name: '张伟', title: '技术总监', phone: '13812345678', email: 'zhangwei@jincheng.com', isPrimary: true },
      { customerId: customerRecords[0].id, name: '李静', title: '采购经理', phone: '13812345679', email: 'lijing@jincheng.com', isPrimary: false },
      { customerId: customerRecords[1].id, name: '王芳', title: '运营总监', phone: '13987654321', email: 'wangfang@yunduan.cn', isPrimary: true },
      { customerId: customerRecords[2].id, name: '李娜', title: 'CTO', phone: '13611223344', email: 'lina@chuangxin.io', isPrimary: true },
      { customerId: customerRecords[2].id, name: '刘洋', title: '项目经理', phone: '13611223345', email: 'liuyang@chuangxin.io', isPrimary: false },
      { customerId: customerRecords[3].id, name: '陈强', title: '总经理', phone: '13755668899', email: 'chenqiang@huizhi.com', isPrimary: true },
      { customerId: customerRecords[4].id, name: '赵敏', title: '信息部主管', phone: '13866778899', email: 'zhaomin@tianfu.cn', isPrimary: true },
    ];

    const contactRecords = contactData.map(c => Store.create('contacts', c));

    // 为主客户关联主要联系人（primaryContactId）
    Store.update('customers', customerRecords[0].id, { primaryContactId: contactRecords[0].id });
    Store.update('customers', customerRecords[1].id, { primaryContactId: contactRecords[2].id });
    Store.update('customers', customerRecords[2].id, { primaryContactId: contactRecords[3].id });
    Store.update('customers', customerRecords[3].id, { primaryContactId: contactRecords[5].id });
    Store.update('customers', customerRecords[4].id, { primaryContactId: contactRecords[6].id });

    // 商机
    const oppData = [
      { name: '微商城+锦程', customerId: customerRecords[0].id, brandName: '锦程', intendedProducts: [{ product: '微商城', amount: 198000 }, { product: '智慧零售', amount: 100000 }], amount: 298000, purchaseType: '新开', customerNeed: '企业需要一套完整的ERP系统，包括财务和库存管理模块', source: '推广', dataValidity: '有效', stage: '确定合作', probability: '70', expectedCloseDate: this._futureDate(15), assignee: '李明', department: '销售一部', oppSource: '派单商机', stageChangedAt: this._pastDate(3), keyAction: '完成合同条款确认', keyActionDate: this._futureDate(5), contactId: contactRecords[0]?.id || '' },
      { name: '智慧零售+云端', customerId: customerRecords[1].id, brandName: '云端', intendedProducts: [{ product: '智慧零售', amount: 58000 }, { product: '智慧服务', amount: 30000 }], amount: 88000, purchaseType: '新开', customerNeed: '零售业务数字化升级，需CRM与智慧门店系统', source: '自拓', dataValidity: '有效', stage: '方案认可', probability: '50', expectedCloseDate: this._futureDate(30), assignee: '张华', department: '销售二部', oppSource: '自建商机', stageChangedAt: this._pastDate(6), keyAction: '提交最终方案书', keyActionDate: this._futureDate(7), contactId: contactRecords[1]?.id || '' },
      { name: 'Saas二开+汇智', customerId: customerRecords[3].id, brandName: '汇智', intendedProducts: [{ product: '企微小助手', amount: 68000 }], amount: 68000, purchaseType: '续约', customerNeed: '现有系统SaaS二开需求，增加定制化报表功能', source: '自拓', dataValidity: '已作废', stage: '需求待确认', probability: '10', expectedCloseDate: this._futureDate(60), assignee: '王丽', department: '销售二部', oppSource: '自建商机', stageChangedAt: this._pastDate(2), keyAction: '电话回访确认需求', keyActionDate: this._futureDate(2), contactId: contactRecords[3]?.id || '' },
      { name: '定制开发+天府', customerId: customerRecords[4].id, brandName: '天府', intendedProducts: [{ product: '智慧服务', amount: 350000 }], amount: 350000, purchaseType: '新开', customerNeed: '金融行业定制化开发，需对接银行支付系统', source: '推广', dataValidity: '有效', stage: '赢单', probability: '100', assignee: '张华', department: '销售一部', oppSource: '派单商机', stageChangedAt: this._pastDate(1), keyAction: '完成合同签署', keyActionDate: this._pastDate(1), contactId: contactRecords[4]?.id || '' },
      { name: '培训服务+锦程', customerId: customerRecords[0].id, brandName: '锦程', intendedProducts: [{ product: '智慧服务', amount: 24000 }], amount: 24000, purchaseType: '增值', customerNeed: '员工培训及系统运维增值服务', source: '自拓', dataValidity: '有效', stage: '赢单', probability: '100', assignee: '李明', department: '销售一部', oppSource: '自建商机', stageChangedAt: this._pastDate(2), keyAction: '交付培训材料', keyActionDate: this._pastDate(2), contactId: contactRecords[0]?.id || '' },
      { name: '经销零售+创新', customerId: customerRecords[2].id, brandName: '创新', intendedProducts: [{ product: '智慧零售', amount: 65000 }, { product: '本地生活', amount: 40000 }], amount: 105000, purchaseType: '增购', customerNeed: '经销零售和本地生活业务拓展，需新增相关系统模块', source: '推广', dataValidity: '未生效', stage: '合同签约', probability: '90', expectedCloseDate: this._futureDate(20), assignee: '王丽', department: '销售二部', oppSource: '派单商机', stageChangedAt: this._pastDate(2), keyAction: '跟进合同盖章流程', keyActionDate: this._futureDate(3), contactId: contactRecords[2]?.id || '' },
    ];

    const oppRecords = oppData.map(o => Store.create('opportunities', o));

    // 为赢单的商机创建订单（主订单+子订单结构）
    const wonOpps = oppRecords.filter(o => o.stage === '赢单');
    const masterOrders = [];
    const subOrders = [];

    // 主订单1：锦程企业ERP项目
    const master1 = Store.create('orders', {
      orderNo: 'ORD-2026-001', customerId: customerRecords[0].id, opportunityId: oppRecords[4].id,
      orderType: '标准订单', listPrice: 222000, originalPrice: 198000, discount: 24000,
      payableAmount: 198000, submitter: '李明', status: '已完成', approvalStatus: '已审批',
      createdAt: this._pastDateTime(20), updatedAt: this._pastDateTime(15),
    });
    masterOrders.push(master1);
    Store.update('opportunities', oppRecords[4].id, { convertedOrderId: master1.id });
    // 子订单1-1：企业版ERP系统
    subOrders.push(Store.create('orders', {
      orderNo: 'ORD-2026-001-01', customerId: customerRecords[0].id, parentOrderId: master1.id,
      orderType: '软件产品', listPrice: 198000, originalPrice: 198000, discount: 0,
      payableAmount: 198000, submitter: '李明', status: '已完成', approvalStatus: '已审批',
      createdAt: this._pastDateTime(20), updatedAt: this._pastDateTime(15),
    }));
    // 子订单1-2：员工培训课程
    subOrders.push(Store.create('orders', {
      orderNo: 'ORD-2026-001-02', customerId: customerRecords[0].id, parentOrderId: master1.id,
      orderType: '培训课程', listPrice: 24000, originalPrice: 24000, discount: 0,
      payableAmount: 24000, submitter: '李明', status: '已完成', approvalStatus: '已审批',
      createdAt: this._pastDateTime(18), updatedAt: this._pastDateTime(15),
    }));

    // 主订单2：天府金融系统开发
    const master2 = Store.create('orders', {
      orderNo: 'ORD-2026-002', customerId: customerRecords[4].id, opportunityId: oppRecords[3].id,
      orderType: '标准订单', listPrice: 380000, originalPrice: 350000, discount: 30000,
      payableAmount: 350000, submitter: '张华', status: '执行中', approvalStatus: '已审批',
      createdAt: this._pastDateTime(12), updatedAt: this._pastDateTime(3),
    });
    masterOrders.push(master2);
    Store.update('opportunities', oppRecords[3].id, { convertedOrderId: master2.id });
    // 子订单2-1：定制开发服务
    subOrders.push(Store.create('orders', {
      orderNo: 'ORD-2026-002-01', customerId: customerRecords[4].id, parentOrderId: master2.id,
      orderType: '技术服务', listPrice: 350000, originalPrice: 350000, discount: 0,
      payableAmount: 350000, submitter: '张华', status: '执行中', approvalStatus: '已审批',
      createdAt: this._pastDateTime(12), updatedAt: this._pastDateTime(3),
    }));

    const orderRecords = [...masterOrders, ...subOrders];

    // 合同
    const contractData = [
      { contractNo: 'HT-2026-001', contractType: '标准合同', customerId: customerRecords[0].id, isSealed: '是', amount: 222000, status: '已归档', signer: '李明', signDate: this._pastDate(15), relatedOrderNo: master1.orderNo, remark: '锦程企业ERP项目标准合同' },
      { contractNo: 'HT-2026-002', contractType: '标准合同', customerId: customerRecords[4].id, isSealed: '是', amount: 380000, status: '已归档', signer: '张华', signDate: this._pastDate(8), relatedOrderNo: master2.orderNo, remark: '天府金融定制开发合同' },
      { contractNo: 'HT-2026-003', contractType: '非标合同', customerId: customerRecords[2].id, isSealed: '否', amount: 105000, status: '待归档', signer: '王丽', signDate: this._pastDate(1), relatedOrderNo: '', remark: '创新经销零售项目非标合同，待盖章后归档' },
      { contractNo: 'HT-2026-004', contractType: '标准合同', customerId: customerRecords[1].id, isSealed: '是', amount: 88000, status: '已归档', signer: '张华', signDate: this._pastDate(8), relatedOrderNo: '', remark: '云端智慧零售项目合同' },
      { contractNo: 'HT-2026-005', contractType: '非标合同', customerId: customerRecords[3].id, isSealed: '否', amount: 68000, status: '已作废', signer: '王丽', signDate: this._pastDate(15), relatedOrderNo: '', remark: '汇智SaaS二开合同，客户已取消合作' },
      { contractNo: 'HT-2026-006', contractType: '标准合同', customerId: customerRecords[0].id, isSealed: '否', amount: 24000, status: '待归档', signer: '李明', signDate: this._pastDate(2), relatedOrderNo: '', remark: '锦程培训增值服务合同' },
    ];
    contractData.forEach(c => Store.create('contracts', c));

    // ========== 公海演示数据 ==========

    // 线索公海：7条掉保线索
    const poolLeadData = [
      { customerName: '武汉长江智联科技', customerType: '企业客户', contactInfo: '黄志远 13611229988', cleanTag: '有效线索-转客户', cleanMemo: '超期未转化，已掉入公海', region: '武汉', industry: '制造业', bizLine: '杭州营销中心', productLine: '零售SaaS', source: '展会', status: '跟进中', assignee: '李明', poolStatus: 'in_pool', poolReason: '超21天未转客户', originalAssignee: '李明' },
      { customerName: '厦门鹭岛软件', customerType: '企业客户', contactInfo: '林小燕 13799887766', cleanTag: '暂未接通-继续清洗', cleanMemo: '待二次核实，已掉入公海', region: '厦门', industry: '互联网/IT', bizLine: '广州营销中心', productLine: '新零售', source: '网站表单', status: '新线索', assignee: '王丽', poolStatus: 'in_pool', poolReason: '超21天未转客户', originalAssignee: '王丽' },
      { customerName: '合肥创新谷信息', customerType: '企业客户', contactInfo: '何建国 13855667788', cleanTag: '有效线索-转客户', cleanMemo: '手动放入公海，需重新分配', region: '合肥', industry: '互联网/IT', bizLine: '上海营销中心', productLine: '新零售', source: '电话咨询', status: '跟进中', assignee: '张华', poolStatus: 'in_pool', poolReason: '手动放入公海', originalAssignee: '张华' },
      { customerName: '苏州工业园区科技', customerType: '企业客户', contactInfo: '沈浩 15912348899', cleanTag: '有效线索-转客户', cleanMemo: '客户需求已过期，超21天未跟进', region: '苏州', industry: '制造业', bizLine: '上海营销中心', productLine: '智慧商超', source: '市场活动', status: '跟进中', assignee: '李明', poolStatus: 'in_pool', poolReason: '超21天未转客户', originalAssignee: '李明' },
      { customerName: '东莞华强电子', customerType: '企业客户', contactInfo: '刘伟 15877665544', cleanTag: '暂未接通-继续清洗', cleanMemo: '多次电话无人接听，超过21天', region: '东莞', industry: '制造业', bizLine: '深圳营销中心', productLine: '定制开发', source: '电话外呼', status: '新线索', assignee: '王丽', poolStatus: 'in_pool', poolReason: '超21天未转客户', originalAssignee: '王丽' },
      { customerName: '郑州中原数据', customerType: '企业客户', contactInfo: '马超 15033446677', cleanTag: '有效线索-转客户', cleanMemo: '销售离职后手动放入公海', region: '郑州', industry: '互联网/IT', bizLine: '杭州营销中心', productLine: '零售SaaS', source: '展会', status: '跟进中', assignee: '张华', poolStatus: 'in_pool', poolReason: '手动放入公海', originalAssignee: '刘洋' },
      { customerName: '南昌赣江信息科技', customerType: '企业客户', contactInfo: '周文 15288990011', cleanTag: '无效线索-放弃公海', cleanMemo: '需求不匹配，销售放弃后放入公海', region: '南昌', industry: '零售', bizLine: '广州营销中心', productLine: '到店', source: '网站表单', status: '已关闭', assignee: '李明', poolStatus: 'in_pool', poolReason: '手动放入公海', originalAssignee: '李明' },
    ];
    poolLeadData.forEach(l => {
      const d = new Date();
      d.setDate(d.getDate() - 30 - Math.floor(Math.random() * 15)); // 30-45天前创建
      l.createdAt = d.toISOString();
      l.updatedAt = d.toISOString();
      const poolD = new Date();
      poolD.setDate(poolD.getDate() - Math.floor(Math.random() * 5));
      l.poolDate = poolD.toISOString();
      Store.create('leads', l);
    });

    // 客户公海：7条掉保客户（含关联掉保商机）
    const poolCustomerData = [
      { name: '大连海天集团', type: '企业客户', businessLine: '北京营销中心', productLine: '智慧服务', region: '大连', industry: '制造业', status: '公海', isBrandCustomer: '是', brandName: '海天', storeCount: '500家以上', customerSource: '自拓线索', phone: '0411-88776655', email: 'info@haitian.cn', address: '大连市高新区软件园路18号', tags: [], poolStatus: 'in_pool', poolReason: '超3天无拜访', originalAssignee: '王丽' },
      { name: '昆明云滇数据', type: '企业客户', businessLine: '深圳营销中心', productLine: '企微小助手', region: '昆明', industry: '互联网/IT', status: '公海', isBrandCustomer: '是', brandName: '云滇', storeCount: '1-10家', customerSource: '自拓线索', phone: '0871-3344556', email: 'biz@yundian.io', address: '昆明市五华区科技路88号', tags: [], poolStatus: 'in_pool', poolReason: '超90天未成单', originalAssignee: '李明' },
      { name: '福州闽江智能', type: '企业客户', businessLine: '广州营销中心', productLine: '智慧零售', region: '福州', industry: '制造业', status: '公海', isBrandCustomer: '是', brandName: '闽江', storeCount: '31-50家', customerSource: '自拓线索', phone: '0591-87654321', email: 'info@minjiangsmart.cn', address: '福州市鼓楼区软件大道66号', tags: [], poolStatus: 'in_pool', poolReason: '超3天无拜访', originalAssignee: '张华' },
      { name: '济南泉城科技', type: '企业客户', businessLine: '杭州营销中心', productLine: '企微小助手', region: '济南', industry: '互联网/IT', status: '公海', isBrandCustomer: '是', brandName: '泉城科技', storeCount: '1-10家', customerSource: '自拓线索', phone: '0531-88990011', email: 'sales@quancheng.tech', address: '济南市历下区泉城路188号', tags: ['潜力客户'], poolStatus: 'in_pool', poolReason: '超90天未成单', originalAssignee: '李明' },
      { name: '贵阳大数据产业基地', type: '企业客户', businessLine: '广州营销中心', productLine: '新零售', region: '贵阳', industry: '互联网/IT', status: '公海', isBrandCustomer: '是', brandName: '贵阳大数据', storeCount: '101-500家', customerSource: '自拓线索', phone: '0851-5566778', email: 'info@gydata.cn', address: '贵阳市观山湖区大数据产业园', tags: [], poolStatus: 'in_pool', poolReason: '超3天无拜访', originalAssignee: '王丽' },
      { name: '哈尔滨冰雪科技', type: '企业客户', businessLine: '北京营销中心', productLine: '智慧商超', region: '哈尔滨', industry: '零售', status: '公海', isBrandCustomer: '是', brandName: '冰雪', storeCount: '11-30家', customerSource: '自拓线索', phone: '0451-2233445', email: 'contact@bingxue.tech', address: '哈尔滨市南岗区学府路56号', tags: [], poolStatus: 'in_pool', poolReason: '手动放入公海', originalAssignee: '张华' },
      { name: '长春北国数据', type: '企业客户', businessLine: '深圳营销中心', productLine: '定制开发', region: '长春', industry: '金融', status: '公海', isBrandCustomer: '是', brandName: '北国', storeCount: '1-10家', customerSource: '自拓线索', phone: '0431-7788990', email: 'biz@beiguo.cn', address: '长春市净月区生态大街200号', tags: ['历史客户'], poolStatus: 'in_pool', poolReason: '超90天未成单', originalAssignee: '刘洋' },
    ];
    const poolCustomerRecords = poolCustomerData.map(c => {
      const d = new Date();
      d.setDate(d.getDate() - 120 - Math.floor(Math.random() * 30)); // 120-150天前创建
      c.createdAt = d.toISOString();
      c.updatedAt = d.toISOString();
      const poolD = new Date();
      poolD.setDate(poolD.getDate() - Math.floor(Math.random() * 3));
      c.poolDate = poolD.toISOString();
      return Store.create('customers', c);
    });

    // 为公海客户创建联系人
    const poolContactData = [
      { customerId: poolCustomerRecords[0].id, name: '王磊', title: 'IT总监', phone: '0411-88776601', email: 'wanglei@haitian.cn', isPrimary: true },
      { customerId: poolCustomerRecords[1].id, name: '杨芳', title: '运营经理', phone: '0871-3344557', email: 'yangfang@yundian.io', isPrimary: true },
      { customerId: poolCustomerRecords[2].id, name: '陈明', title: '生产总监', phone: '0591-87654322', email: 'chenming@minjiangsmart.cn', isPrimary: true },
      { customerId: poolCustomerRecords[3].id, name: '孙丽', title: '市场总监', phone: '0531-88990012', email: 'sunli@quancheng.tech', isPrimary: true },
      { customerId: poolCustomerRecords[4].id, name: '赵刚', title: '运营主管', phone: '0851-5566779', email: 'zhaogang@gydata.cn', isPrimary: true },
      { customerId: poolCustomerRecords[5].id, name: '刘雪', title: '门店总监', phone: '0451-2233446', email: 'liuxue@bingxue.tech', isPrimary: true },
      { customerId: poolCustomerRecords[6].id, name: '周强', title: '财务总监', phone: '0431-7788991', email: 'zhouqiang@beiguo.cn', isPrimary: true },
    ];
    const poolContactRecords = poolContactData.map(c => Store.create('contacts', c));

    // 为公海客户创建掉保的商机（关联联系人）
    const poolOppRecords = [
      Store.create('opportunities', {
        name: 'MES系统+海天', customerId: poolCustomerRecords[0].id, brandName: '海天', intendedProducts: [{ product: '智慧服务', amount: 158000 }], amount: 158000, purchaseType: '新开', dataValidity: '未生效', stage: '需求待确认', probability: '10', assignee: '', department: '销售二部', source: '展会', poolStatus: 'in_pool', poolReason: '客户掉保（超3天无拜访）', originalAssignee: '王丽', stageChangedAt: this._pastDate(10), contactId: poolContactRecords[0].id,
        expectedCloseDate: (() => { const d = new Date(); d.setDate(d.getDate() + 60); return d.toISOString().split('T')[0]; })(),
      }),
      Store.create('opportunities', {
        name: '云平台+云滇', customerId: poolCustomerRecords[1].id, brandName: '云滇', intendedProducts: [{ product: '企微小助手', amount: 98000 }], amount: 98000, purchaseType: '新开', dataValidity: '有效', stage: '方案认可', probability: '50', assignee: '', department: '销售一部', source: '电话咨询', poolStatus: 'in_pool', poolReason: '客户掉保（超90天未成单）', originalAssignee: '李明', stageChangedAt: this._pastDate(12), contactId: poolContactRecords[1].id,
        expectedCloseDate: (() => { const d = new Date(); d.setDate(d.getDate() + 30); return d.toISOString().split('T')[0]; })(),
      }),
      Store.create('opportunities', {
        name: 'MES升级+闽江', customerId: poolCustomerRecords[2].id, brandName: '闽江', intendedProducts: [{ product: '智慧零售', amount: 128000 }], amount: 128000, purchaseType: '续费', dataValidity: '有效', stage: '需求确认', probability: '30', assignee: '', department: '销售一部', source: '展会', poolStatus: 'in_pool', poolReason: '客户掉保（超3天无拜访）', originalAssignee: '张华', stageChangedAt: this._pastDate(8), contactId: poolContactRecords[2].id,
        expectedCloseDate: (() => { const d = new Date(); d.setDate(d.getDate() + 40); return d.toISOString().split('T')[0]; })(),
      }),
      Store.create('opportunities', {
        name: '微盟云+泉城科技', customerId: poolCustomerRecords[3].id, brandName: '泉城科技', intendedProducts: [{ product: '企微小助手', amount: 68000 }], amount: 68000, purchaseType: '新开', dataValidity: '有效', stage: '需求待确认', probability: '10', assignee: '', department: '销售二部', source: '展会', poolStatus: 'in_pool', poolReason: '客户掉保（超90天未成单）', originalAssignee: '李明', stageChangedAt: this._pastDate(15), contactId: poolContactRecords[3].id,
        expectedCloseDate: (() => { const d = new Date(); d.setDate(d.getDate() + 45); return d.toISOString().split('T')[0]; })(),
      }),
      Store.create('opportunities', {
        name: '连锁零售+贵阳大数据', customerId: poolCustomerRecords[4].id, brandName: '贵阳大数据', intendedProducts: [{ product: '智慧零售', amount: 88000 }], amount: 88000, purchaseType: '新开', dataValidity: '有效', stage: '需求待确认', probability: '20', assignee: '', department: '销售一部', source: '电话咨询', poolStatus: 'in_pool', poolReason: '客户掉保（超3天无拜访）', originalAssignee: '王丽', stageChangedAt: this._pastDate(7), contactId: poolContactRecords[4].id,
        expectedCloseDate: (() => { const d = new Date(); d.setDate(d.getDate() + 30); return d.toISOString().split('T')[0]; })(),
      }),
      Store.create('opportunities', {
        name: '智慧商超+冰雪科技', customerId: poolCustomerRecords[5].id, brandName: '冰雪科技', intendedProducts: [{ product: '智慧商超', amount: 45000 }], amount: 45000, purchaseType: '新开', dataValidity: '未生效', stage: '需求待确认', probability: '10', assignee: '', department: '销售二部', source: '推广', poolStatus: 'in_pool', poolReason: '客户掉保（手动放入公海）', originalAssignee: '张华', stageChangedAt: this._pastDate(20), contactId: poolContactRecords[5].id,
        expectedCloseDate: (() => { const d = new Date(); d.setDate(d.getDate() + 60); return d.toISOString().split('T')[0]; })(),
      }),
      Store.create('opportunities', {
        name: '金融系统+北国数据', customerId: poolCustomerRecords[6].id, brandName: '北国数据', intendedProducts: [{ product: '智慧服务', amount: 128000 }], amount: 128000, purchaseType: '续约', dataValidity: '有效', stage: '需求确认', probability: '30', assignee: '', department: '销售一部', source: '转介绍', poolStatus: 'in_pool', poolReason: '客户掉保（超90天未成单）', originalAssignee: '刘洋', stageChangedAt: this._pastDate(25), contactId: poolContactRecords[6].id,
        expectedCloseDate: (() => { const d = new Date(); d.setDate(d.getDate() + 40); return d.toISOString().split('T')[0]; })(),
      }),
    ];

    // 待审核客户：1条（90天未成单但有高阶段商机）
    const pendingCustomer = Store.create('customers', {
      name: '青岛海信智联', type: '企业客户', businessLine: '北京营销中心', productLine: '智慧零售', region: '青岛', industry: '制造业', status: '活跃', isBrandCustomer: '是', brandName: '海信智联', storeCount: '101-500家', customerSource: '自拓线索', phone: '0532-6677889', email: 'sales@hisenzhilian.com', address: '青岛市崂山区科技城', tags: ['重点客户'],
      poolStatus: 'pending_review', poolReason: '超90天未成单（待审核）', originalAssignee: '张华',
    });
    // 为待审核客户创建联系人
    const pendingContactRecord = Store.create('contacts', {
      customerId: pendingCustomer.id, name: '韩冰', title: '数字化转型总监', phone: '0532-6677890', email: 'hanbing@hisenzhilian.com', isPrimary: true,
    });
    // 为待审核客户创建高阶段商机（关联联系人）
    const pendingOppRecords = [
      Store.create('opportunities', {
        name: '智慧零售+海信智联', customerId: pendingCustomer.id, brandName: '海信智联', intendedProducts: [{ product: '智慧零售', amount: 488000 }], amount: 488000, purchaseType: '新开', dataValidity: '有效', stage: '确定合作', probability: '70', assignee: '张华', department: '销售一部', source: '转介绍', oppSource: '派单商机', stageChangedAt: this._pastDate(4), contactId: pendingContactRecord.id,
        expectedCloseDate: (() => { const d = new Date(); d.setDate(d.getDate() + 15); return d.toISOString().split('T')[0]; })(),
      }),
      Store.create('opportunities', {
        name: '微商城+海信智联', customerId: pendingCustomer.id, brandName: '海信智联', intendedProducts: [{ product: '微商城', amount: 268000 }], amount: 268000, purchaseType: '新开', dataValidity: '有效', stage: '方案认可', probability: '50', assignee: '张华', department: '销售一部', source: '网站表单', oppSource: '自建商机', stageChangedAt: this._pastDate(9), contactId: pendingContactRecord.id,
        expectedCloseDate: (() => { const d = new Date(); d.setDate(d.getDate() + 25); return d.toISOString().split('T')[0]; })(),
      }),
    ];

    // 跟进记录（所有商机均已创建后统一生成，确保每个商机都有关联跟进）
    const followupData = [
      // 正式商机跟进
      { relatedType: 'opportunity', relatedId: oppRecords[0].id, type: '拜访', content: '上门拜访，演示ERP系统核心功能，客户反馈良好，对财务模块和库存模块特别感兴趣', nextFollowDate: this._futureDate(3) },
      { relatedType: 'opportunity', relatedId: oppRecords[0].id, type: '电话', content: '电话沟通报价细节，客户希望能提供优惠方案' },
      { relatedType: 'opportunity', relatedId: oppRecords[1].id, type: '会议', content: '线上会议进行需求调研，确认CRM系统需要对接现有OA系统', nextFollowDate: this._futureDate(5) },
      { relatedType: 'opportunity', relatedId: oppRecords[2].id, type: '邮件', content: '发送数据分析平台方案书和报价单' },
      { relatedType: 'opportunity', relatedId: oppRecords[3].id, type: '拜访', content: '上门拜访客户CTO，深入沟通金融支付系统定制需求' },
      { relatedType: 'opportunity', relatedId: oppRecords[3].id, type: '电话', content: '电话确认技术方案细节，客户对接口方案表示认可' },
      { relatedType: 'opportunity', relatedId: oppRecords[4].id, type: '邮件', content: '发送培训课程大纲和培训排期方案' },
      { relatedType: 'opportunity', relatedId: oppRecords[4].id, type: '微信', content: '微信沟通培训时间安排，确认6月开展首期培训' },
      { relatedType: 'opportunity', relatedId: oppRecords[5].id, type: '拜访', content: '现场勘查硬件需求，确定服务器配置方案' },
      { relatedType: 'opportunity', relatedId: oppRecords[5].id, type: '会议', content: '合同条款确认会议，双方达成一致意见', nextFollowDate: this._futureDate(2) },
      // 客户跟进
      { relatedType: 'customer', relatedId: customerRecords[0].id, type: '微信', content: '日常客户关系维护，了解使用情况和新需求' },
      { relatedType: 'customer', relatedId: customerRecords[2].id, type: '电话', content: '电话回访，客户对当前服务满意度较高' },
      { relatedType: 'customer', relatedId: customerRecords[4].id, type: '会议', content: '项目启动会议，确认金融系统实施计划和里程碑' },
      // 线索跟进
      { relatedType: 'lead', relatedId: leadRecords[5].id, type: '电话', content: '首次电话联系，客户对数据分析平台有初步意向', nextFollowDate: this._futureDate(2) },
      { relatedType: 'lead', relatedId: leadRecords[7].id, type: '邮件', content: '发送产品资料和公司简介' },
      // 公海商机跟进
      { relatedType: 'opportunity', relatedId: poolOppRecords[0].id, type: '拜访', content: '拜访海天集团IT部门，了解MES系统升级需求' },
      { relatedType: 'opportunity', relatedId: poolOppRecords[1].id, type: '会议', content: '线上会议沟通云平台方案，客户对技术架构表示满意' },
      { relatedType: 'opportunity', relatedId: poolOppRecords[2].id, type: '电话', content: '电话确认MES升级需求范围，客户需要增加质检模块' },
      { relatedType: 'opportunity', relatedId: poolOppRecords[3].id, type: '邮件', content: '发送微盟云平台产品介绍和合作案例' },
      { relatedType: 'opportunity', relatedId: poolOppRecords[4].id, type: '电话', content: '电话沟通连锁零售系统需求，客户表示还有内部预算待审批' },
      { relatedType: 'opportunity', relatedId: poolOppRecords[5].id, type: '拜访', content: '拜访客户门店，实地调研智慧商超系统使用场景' },
      { relatedType: 'opportunity', relatedId: poolOppRecords[6].id, type: '会议', content: '线上会议讨论金融系统接口方案，客户技术团队全程参与' },
      // 待审核商机跟进
      { relatedType: 'opportunity', relatedId: pendingOppRecords[0].id, type: '拜访', content: '拜访海信智联总部，进行智慧零售系统最终演示' },
      { relatedType: 'opportunity', relatedId: pendingOppRecords[0].id, type: '电话', content: '电话沟通合同细节，客户对付款方式有特殊要求' },
      { relatedType: 'opportunity', relatedId: pendingOppRecords[1].id, type: '微信', content: '微信发送微商城建设方案，客户反馈需要调整首页设计' },
    ];

    followupData.forEach((f, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i * 2 - 1);
      d.setHours(9 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 60));
      f.createdAt = d.toISOString();
      Store.create('followups', f);
    });

    console.log('CRM 演示数据已注入（含公海数据）');
  },

  _futureDate(days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  },

  _pastDate(days) {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString();
  },

  _pastDateTime(days) {
    const d = new Date();
    d.setDate(d.getDate() - days);
    d.setHours(9, 30, 0, 0);
    return d.toISOString();
  }
};
