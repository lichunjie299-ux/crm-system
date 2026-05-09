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
      { name: '上海锦程科技有限公司', type: '企业客户', industry: '互联网/IT', scale: '200-1000人', status: '活跃', customerSource: '派单客户', assignee: '李明', phone: '021-55667788', email: 'contact@jincheng.com', address: '上海市浦东新区张江高科技园区', tags: ['VIP', '重点客户'] },
      { name: '北京云端数据科技', type: '企业客户', industry: '互联网/IT', scale: '50-200人', status: '活跃', customerSource: '自建客户', assignee: '张华', phone: '010-88776655', email: 'info@yunduan.cn', address: '北京市海淀区中关村软件园', tags: ['合作伙伴'] },
      { name: '深圳创新信息技术', type: '企业客户', industry: '制造业', scale: '1000人以上', status: '活跃', customerSource: '派单客户', assignee: '王丽', phone: '0755-33445566', email: 'biz@chuangxin.io', address: '深圳市南山区科技园', tags: ['大客户', 'VIP'] },
      { name: '广州汇智软件', type: '企业客户', industry: '互联网/IT', scale: '50-200人', status: '沉默', customerSource: '自建客户', assignee: '王丽', phone: '020-11223344', email: 'sales@huizhi.com', address: '广州市天河区天河软件园', tags: [] },
      { name: '成都天府数字', type: '企业客户', industry: '金融', scale: '200-1000人', status: '活跃', customerSource: '派单客户', assignee: '张华', phone: '028-66778899', email: 'info@tianfu.cn', address: '成都市高新区天府三街', tags: ['重点客户'] },
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

    // 商机
    const oppData = [
      { name: '企业ERP+锦程', customerId: customerRecords[0].id, brandName: '锦程', intendedProduct: '微商城,智慧零售', purchaseType: '新开', customerNeed: '企业需要一套完整的ERP系统，包括财务和库存管理模块', source: '推广', dataValidity: '有效', stage: '确定合作', amount: 298000, probability: '70', expectedCloseDate: this._futureDate(15), assignee: '李明', department: '销售一部', oppSource: '派单商机', stageChangedAt: this._pastDate(3), keyAction: '完成合同条款确认', keyActionDate: this._futureDate(5), contactId: contactRecords[0]?.id || '' },
      { name: 'CRM系统+云端', customerId: customerRecords[1].id, brandName: '云端', intendedProduct: '智慧零售,智慧服务', purchaseType: '新开', customerNeed: '零售业务数字化升级，需CRM与智慧门店系统', source: '自拓', dataValidity: '有效', stage: '方案认可', amount: 88000, probability: '50', expectedCloseDate: this._futureDate(30), assignee: '张华', department: '销售二部', oppSource: '自建商机', stageChangedAt: this._pastDate(6), keyAction: '提交最终方案书', keyActionDate: this._futureDate(7), contactId: contactRecords[1]?.id || '' },
      { name: '数据平台+创新', customerId: customerRecords[2].id, brandName: '创新', intendedProduct: '智慧商超,智慧购百', purchaseType: '增购', customerNeed: '现有商超系统需要升级数据分析和客户管理能力', source: '推广', dataValidity: '未生效', stage: '需求确认', amount: 198000, probability: '30', expectedCloseDate: this._futureDate(45), assignee: '李明', department: '销售一部', oppSource: '派单商机', stageChangedAt: this._pastDate(5), keyAction: '安排产品演示会', keyActionDate: this._futureDate(3), contactId: contactRecords[2]?.id || '' },
      { name: '系统升级+汇智', customerId: customerRecords[3].id, brandName: '汇智', intendedProduct: 'SaaS二开', purchaseType: '续约', customerNeed: '现有系统SaaS二开需求，增加定制化报表功能', source: '自拓', dataValidity: '已作废', stage: '需求待确认', amount: 68000, probability: '10', expectedCloseDate: this._futureDate(60), assignee: '王丽', department: '销售二部', oppSource: '自建商机', stageChangedAt: this._pastDate(2), keyAction: '电话回访确认需求', keyActionDate: this._futureDate(2), contactId: contactRecords[3]?.id || '' },
      { name: '金融系统+天府', customerId: customerRecords[4].id, brandName: '天府', intendedProduct: '定制开发', purchaseType: '新开', customerNeed: '金融行业定制化开发，需对接银行支付系统', source: '推广', dataValidity: '有效', stage: '赢单', amount: 350000, probability: '100', assignee: '张华', department: '销售一部', oppSource: '派单商机', stageChangedAt: this._pastDate(1), keyAction: '完成合同签署', keyActionDate: this._pastDate(1), contactId: contactRecords[4]?.id || '' },
      { name: '培训服务+锦程', customerId: customerRecords[0].id, brandName: '锦程', intendedProduct: '增值服务', purchaseType: '增值', customerNeed: '员工培训及系统运维增值服务', source: '自拓', dataValidity: '有效', stage: '赢单', amount: 24000, probability: '100', assignee: '李明', department: '销售一部', oppSource: '自建商机', stageChangedAt: this._pastDate(2), keyAction: '交付培训材料', keyActionDate: this._pastDate(2), contactId: contactRecords[0]?.id || '' },
      { name: '硬件采购+创新', customerId: customerRecords[2].id, brandName: '创新', intendedProduct: '经销零售,本地生活', purchaseType: '增购', customerNeed: '经销零售和本地生活业务拓展，需新增相关系统模块', source: '推广', dataValidity: '未生效', stage: '合同签约', amount: 105000, probability: '90', expectedCloseDate: this._futureDate(20), assignee: '王丽', department: '销售二部', oppSource: '派单商机', stageChangedAt: this._pastDate(2), keyAction: '跟进合同盖章流程', keyActionDate: this._futureDate(3), contactId: contactRecords[2]?.id || '' },
    ];

    const oppRecords = oppData.map(o => Store.create('opportunities', o));

    // 为赢单的商机创建订单
    const wonOpps = oppRecords.filter(o => o.stage === '赢单');
    wonOpps.forEach(opp => {
      const order = Store.create('orders', {
        orderNo: Helpers.generateOrderNo(),
        customerId: opp.customerId,
        opportunityId: opp.id,
        items: [
          { productId: productRecords[0].id, productName: productRecords[0].name, quantity: 1, unitPrice: opp.amount, subtotal: opp.amount }
        ],
        totalAmount: opp.amount,
        status: opp.amount > 100000 ? '执行中' : '已完成',
      });
      Store.update('opportunities', opp.id, { convertedOrderId: order.id });
    });

    // 跟进记录
    const followupData = [
      { relatedType: 'opportunity', relatedId: oppRecords[0].id, type: '拜访', content: '上门拜访，演示ERP系统核心功能，客户反馈良好，对财务模块和库存模块特别感兴趣', nextFollowDate: this._futureDate(3) },
      { relatedType: 'opportunity', relatedId: oppRecords[0].id, type: '电话', content: '电话沟通报价细节，客户希望能提供优惠方案' },
      { relatedType: 'opportunity', relatedId: oppRecords[1].id, type: '会议', content: '线上会议进行需求调研，确认CRM系统需要对接现有OA系统', nextFollowDate: this._futureDate(5) },
      { relatedType: 'opportunity', relatedId: oppRecords[2].id, type: '邮件', content: '发送数据分析平台方案书和报价单', nextFollowDate: this._futureDate(7) },
      { relatedType: 'customer', relatedId: customerRecords[0].id, type: '微信', content: '日常客户关系维护，了解使用情况和新需求' },
      { relatedType: 'customer', relatedId: customerRecords[2].id, type: '电话', content: '电话回访，客户对当前服务满意度较高' },
      { relatedType: 'lead', relatedId: leadRecords[5].id, type: '电话', content: '首次电话联系，客户对数据分析平台有初步意向', nextFollowDate: this._futureDate(2) },
      { relatedType: 'lead', relatedId: leadRecords[7].id, type: '邮件', content: '发送产品资料和公司简介' },
      { relatedType: 'opportunity', relatedId: oppRecords[6].id, type: '拜访', content: '现场勘查硬件需求，确定服务器配置方案' },
      { relatedType: 'customer', relatedId: customerRecords[4].id, type: '会议', content: '项目启动会议，确认金融系统实施计划和里程碑' },
    ];

    followupData.forEach((f, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i * 2 - 1);
      d.setHours(9 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 60));
      f.createdAt = d.toISOString();
      Store.create('followups', f);
    });

    // ========== 公海演示数据 ==========

    // 线索公海：3条掉保线索
    const poolLeadData = [
      { customerName: '武汉长江智联科技', customerType: '企业客户', contactInfo: '黄志远 13611229988', cleanTag: '有效线索-转客户', cleanMemo: '超期未转化，已掉入公海', region: '武汉', industry: '制造业', bizLine: '杭州营销中心', productLine: '零售SaaS', source: '展会', status: '跟进中', assignee: '李明', poolStatus: 'in_pool', poolReason: '超21天未转客户', originalAssignee: '李明' },
      { customerName: '厦门鹭岛软件', customerType: '企业客户', contactInfo: '林小燕 13799887766', cleanTag: '暂未接通-继续清洗', cleanMemo: '待二次核实，已掉入公海', region: '厦门', industry: '互联网/IT', bizLine: '广州营销中心', productLine: '新零售', source: '网站表单', status: '新线索', assignee: '王丽', poolStatus: 'in_pool', poolReason: '超21天未转客户', originalAssignee: '王丽' },
      { customerName: '合肥创新谷信息', customerType: '企业客户', contactInfo: '何建国 13855667788', cleanTag: '有效线索-转客户', cleanMemo: '手动放入公海，需重新分配', region: '合肥', industry: '互联网/IT', bizLine: '上海营销中心', productLine: '新零售', source: '电话咨询', status: '跟进中', assignee: '张华', poolStatus: 'in_pool', poolReason: '手动放入公海', originalAssignee: '张华' },
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

    // 客户公海：3条掉保客户（含关联掉保商机）
    const poolCustomerData = [
      { name: '大连海天集团', type: '企业客户', industry: '制造业', scale: '1000人以上', status: '公海', phone: '0411-88776655', email: 'info@haitian.cn', address: '大连市高新区软件园路18号', tags: [], poolStatus: 'in_pool', poolReason: '超3天无拜访', originalAssignee: '王丽' },
      { name: '昆明云滇数据', type: '企业客户', industry: '互联网/IT', scale: '50-200人', status: '公海', phone: '0871-3344556', email: 'biz@yundian.io', address: '昆明市五华区科技路88号', tags: [], poolStatus: 'in_pool', poolReason: '超90天未成单', originalAssignee: '李明' },
      { name: '福州闽江智能', type: '企业客户', industry: '制造业', scale: '200-1000人', status: '公海', phone: '0591-87654321', email: 'info@minjiangsmart.cn', address: '福州市鼓楼区软件大道66号', tags: [], poolStatus: 'in_pool', poolReason: '超3天无拜访', originalAssignee: '张华' },
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

    // 为公海客户创建掉保的商机
    Store.create('opportunities', {
      name: 'MES系统+海天', customerId: poolCustomerRecords[0].id, brandName: '海天', intendedProduct: '定制开发', purchaseType: '新开', dataValidity: '未生效', stage: '需求待确认', amount: 158000, probability: '10', assignee: '', department: '销售二部', source: '展会', poolStatus: 'in_pool', poolReason: '客户掉保（超3天无拜访）', originalAssignee: '王丽', stageChangedAt: this._pastDate(10),
      expectedCloseDate: (() => { const d = new Date(); d.setDate(d.getDate() + 60); return d.toISOString().split('T')[0]; })(),
    });
    Store.create('opportunities', {
      name: '云平台+云滇', customerId: poolCustomerRecords[1].id, brandName: '云滇', intendedProduct: '微盟云三方产品', purchaseType: '新开', dataValidity: '有效', stage: '方案认可', amount: 98000, probability: '50', assignee: '', department: '销售一部', source: '电话咨询', poolStatus: 'in_pool', poolReason: '客户掉保（超90天未成单）', originalAssignee: '李明', stageChangedAt: this._pastDate(12),
      expectedCloseDate: (() => { const d = new Date(); d.setDate(d.getDate() + 30); return d.toISOString().split('T')[0]; })(),
    });
    Store.create('opportunities', {
      name: 'MES升级+闽江', customerId: poolCustomerRecords[2].id, brandName: '闽江', intendedProduct: '连锁零售', purchaseType: '续费', dataValidity: '有效', stage: '需求确认', amount: 128000, probability: '30', assignee: '', department: '销售一部', source: '展会', poolStatus: 'in_pool', poolReason: '客户掉保（超3天无拜访）', originalAssignee: '张华', stageChangedAt: this._pastDate(8),
      expectedCloseDate: (() => { const d = new Date(); d.setDate(d.getDate() + 40); return d.toISOString().split('T')[0]; })(),
    });
    // 为闽江智能添加一条5天前的电话跟进（无拜访记录，触发3天无拜访掉保）
    const minjiangFollowupDate = new Date();
    minjiangFollowupDate.setDate(minjiangFollowupDate.getDate() - 5);
    Store.create('followups', {
      relatedType: 'customer',
      relatedId: poolCustomerRecords[2].id,
      type: '电话',
      content: '电话回访客户，了解MES系统升级需求进展',
      createdAt: minjiangFollowupDate.toISOString(),
    });

    // 待审核客户：1条（90天未成单但有高阶段商机）
    const pendingCustomer = Store.create('customers', {
      name: '青岛海信智联', type: '企业客户', industry: '制造业', scale: '200-1000人', status: '活跃', phone: '0532-6677889', email: 'sales@hisenzhilian.com', address: '青岛市崂山区科技城', tags: ['重点客户'],
      poolStatus: 'pending_review', poolReason: '超90天未成单（待审核）', originalAssignee: '张华',
    });
    // 为待审核客户创建高阶段商机
    Store.create('opportunities', {
      name: '智慧零售+海信智联', customerId: pendingCustomer.id, brandName: '海信智联', intendedProduct: '智慧零售', purchaseType: '新开', dataValidity: '有效', stage: '确定合作', amount: 488000, probability: '70', assignee: '张华', department: '销售一部', source: '转介绍', oppSource: '派单商机', stageChangedAt: this._pastDate(4),
      expectedCloseDate: (() => { const d = new Date(); d.setDate(d.getDate() + 15); return d.toISOString().split('T')[0]; })(),
    });
    Store.create('opportunities', {
      name: '微商城+海信智联', customerId: pendingCustomer.id, brandName: '海信智联', intendedProduct: '微商城', purchaseType: '新开', dataValidity: '有效', stage: '方案认可', amount: 268000, probability: '50', assignee: '张华', department: '销售一部', source: '网站表单', oppSource: '自建商机', stageChangedAt: this._pastDate(9),
      expectedCloseDate: (() => { const d = new Date(); d.setDate(d.getDate() + 25); return d.toISOString().split('T')[0]; })(),
    });
    // 为待审核客户添加跟进记录（超过7天前）
    const pendingFollowupDate = new Date();
    pendingFollowupDate.setDate(pendingFollowupDate.getDate() - 10);
    Store.create('followups', {
      relatedType: 'customer',
      relatedId: pendingCustomer.id,
      type: '电话',
      content: '与客户技术总监沟通数字化转型方案，客户对报价有异议，需进一步协商',
      createdAt: pendingFollowupDate.toISOString(),
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
  }
};
