/* ============================================
   CRM 系统 - 演示种子数据
   ============================================ */
const SeedData = {

  shouldSeed() {
    return Store.isEmpty();
  },

  seed() {
    if (!this.shouldSeed()) {
      // 已有数据时，仍检查是否需要补充 IS/LS 私海数据 / 售前调用数据
      this._seedPrivateSeas();
      this._seedPreSales();
      return;
    }

    // 产品
    const products = [
      { name: '微商城', productId: '100723860100100', category: '解决方案', productLine: '新零售、TSO', price: 58000, unit: '套', status: '在售', description: '微商城解决方案' },
      { name: '智慧零售', productId: '100724476100100', category: '解决方案', productLine: '零售SaaS，TSO', price: 68000, unit: '套', status: '在售', description: '智慧零售解决方案' },
      { name: '智慧购百', productId: '100762071100100', category: '解决方案', productLine: '零售SaaS', price: 58000, unit: '套', status: '在售', description: '智慧购百解决方案' },
      { name: '客户运营', productId: '131169482100100', category: '解决方案', productLine: '零售SaaS', price: 38000, unit: '套', status: '在售', description: '客户运营解决方案' },
      { name: '智慧零售-安心购', productId: '127769103100100', category: '解决方案', productLine: '零售SaaS', price: 28000, unit: '套', status: '在售', description: '智慧零售安心购解决方案' },
      { name: '智慧购百-安心购', productId: '127768808100100', category: '解决方案', productLine: '零售SaaS', price: 28000, unit: '套', status: '在售', description: '智慧购百安心购解决方案' },
      { name: '企微助手', productId: '100758365100100', category: '解决方案', productLine: '新零售、零售SaaS，TSO、智慧商超', price: 48000, unit: '套', status: '在售', description: '企微助手解决方案' },
      { name: '企微小助手', productId: '133551060100100', category: '解决方案', productLine: '新零售、零售SaaS', price: 28000, unit: '套', status: '在售', description: '企微小助手解决方案' },
      { name: '智慧生鲜', productId: '101023570100100', category: '解决方案', productLine: '智慧商超', price: 38000, unit: '套', status: '在售', description: '智慧生鲜解决方案' },
      { name: '智慧商超', productId: '101023701100100', category: '解决方案', productLine: '智慧商超', price: 48000, unit: '套', status: '在售', description: '智慧商超解决方案' },
      { name: '智慧医药', productId: '101988578100100', category: '解决方案', productLine: '智慧医药', price: 58000, unit: '套', status: '在售', description: '智慧医药解决方案' },
      { name: '本地生活解决方案', productId: '126972636100100', category: '解决方案', productLine: '新零售', price: 38000, unit: '套', status: '在售', description: '本地生活解决方案' },
      { name: '批发商城', productId: '126751754100100', category: '解决方案', productLine: '新零售', price: 28000, unit: '套', status: '在售', description: '批发商城解决方案' },
      { name: '智慧零售宠物行业', productId: '137094669100100', category: '解决方案', productLine: '零售SAAS', price: 38000, unit: '套', status: '在售', description: '智慧零售宠物行业解决方案' },
      { name: '视频号营销助手', productId: '127619385100100', category: '解决方案', productLine: '视频号', price: 8800, unit: '年', status: '在售', description: '视频号营销助手' },
      { name: '智慧门店', productId: '140657283100100', category: '解决方案', productLine: '零售SAAS', price: 28000, unit: '套', status: '在售', description: '智慧门店解决方案' },
      { name: '微盟星启GEO解决方案-旧', productId: '143025247100100', category: '解决方案', productLine: 'GEO', price: 38000, unit: '套', status: '在售', description: '微盟星启GEO解决方案（旧版）' },
      { name: '微盟星启GEO解决方案', productId: '147746223100100', category: '解决方案', productLine: 'GEO', price: 48000, unit: '套', status: '在售', description: '微盟星启GEO解决方案' },
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
      { name: '上海锦程科技有限公司', type: '企业客户', businessLine: '上海营销中心', productLine: '新零售', region: '上海', industry: '互联网/IT', status: '活跃', customerSource: '自拓线索', assignee: '李春洁', isBrandCustomer: '是', brandName: '锦程', storeCount: '11-30家', phone: '021-55667788', email: 'contact@jincheng.com', address: '上海市浦东新区张江高科技园区', tags: ['VIP', '重点客户'] },
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

    // 商机 - 生成50条演示数据
    const oppData = [];
    const productNameList = ['微商城', '智慧零售', '智慧购百', '智慧商超', '智慧生鲜', '批发商城', '本地生活', '视频号营销助手', '智慧零售宠物行业', '智慧门店', '微盟星启', '智慧美业', '智慧服务', '企微助手', '企微小助手'];
    const stages = ['需求待确认', '需求确认', '方案认可', '确定合作', '合同签约', '赢单', '输单'];
    const sources = ['推广', '自拓', '展会', '转介绍', '网站表单', '电话咨询'];
    const purchaseTypes = ['新开', '续约', '增购', '增值'];
    const departments = ['销售一部', '销售二部'];
    const assignees = ['李明', '张华', '王丽', '李春洁'];
    const oppSources = ['派单商机', '自建商机'];
    const dataValidities = ['有效', '有效', '有效', '有效', '未生效', '已作废'];

    // 保持原有6条核心记录位置不动
    const coreRecords = [
      { name: '微商城+锦程', customerIdx: 0, brand: '锦程', prods: [['微商城', 198000], ['智慧零售', 100000]], amount: 298000, purchase: '新开', need: '企业需要一套完整的ERP系统，包括财务和库存管理模块', source: '推广', validity: '有效', stage: '确定合作', prob: 70, closeDays: 15, assignee: '李明', dept: '销售一部', oppSrc: '派单商机', stageDays: 3, action: '完成合同条款确认', actionDays: 5, contact: 0 },
      { name: '智慧零售+云端', customerIdx: 1, brand: '云端', prods: [['智慧零售', 58000], ['智慧服务', 30000]], amount: 88000, purchase: '新开', need: '零售业务数字化升级，需CRM与智慧门店系统', source: '自拓', validity: '有效', stage: '方案认可', prob: 50, closeDays: 30, assignee: '张华', dept: '销售二部', oppSrc: '自建商机', stageDays: 6, action: '提交最终方案书', actionDays: 7, contact: 1 },
      { name: 'Saas二开+汇智', customerIdx: 3, brand: '汇智', prods: [['企微小助手', 68000]], amount: 68000, purchase: '续约', need: '现有系统SaaS二开需求，增加定制化报表功能', source: '自拓', validity: '已作废', stage: '需求待确认', prob: 10, closeDays: 60, assignee: '王丽', dept: '销售二部', oppSrc: '自建商机', stageDays: 2, action: '电话回访确认需求', actionDays: 2, contact: 3 },
      { name: '定制开发+天府', customerIdx: 4, brand: '天府', prods: [['智慧服务', 350000]], amount: 350000, purchase: '新开', need: '金融行业定制化开发，需对接银行支付系统', source: '推广', validity: '有效', stage: '赢单', prob: 100, closeDays: -5, assignee: '张华', dept: '销售一部', oppSrc: '派单商机', stageDays: 1, action: '完成合同签署', actionDays: -1, contact: 4 },
      { name: '培训服务+锦程', customerIdx: 0, brand: '锦程', prods: [['智慧服务', 24000]], amount: 24000, purchase: '增值', need: '员工培训及系统运维增值服务', source: '自拓', validity: '有效', stage: '赢单', prob: 100, closeDays: -8, assignee: '李明', dept: '销售一部', oppSrc: '自建商机', stageDays: 2, action: '交付培训材料', actionDays: -2, contact: 0 },
      { name: '经销零售+创新', customerIdx: 2, brand: '创新', prods: [['智慧零售', 65000], ['本地生活', 40000]], amount: 105000, purchase: '增购', need: '经销零售和本地生活业务拓展，需新增相关系统模块', source: '推广', validity: '未生效', stage: '合同签约', prob: 90, closeDays: 20, assignee: '王丽', dept: '销售二部', oppSrc: '派单商机', stageDays: 2, action: '跟进合同盖章流程', actionDays: 3, contact: 2 },
    ];

    // 扩展客户池（共15个客户用于50条商机）
    const customerPool = [
      { id: 0, brands: ['锦程', '锦程科技', '锦程集团'] },
      { id: 1, brands: ['云端', '云端数据', '云端科技'] },
      { id: 2, brands: ['创新', '创新信息', '创新技术'] },
      { id: 3, brands: ['汇智', '汇智软件', '汇智科技'] },
      { id: 4, brands: ['天府', '天府数字', '天府科技'] },
      { id: 0, brands: ['锦程云', '锦程新零售'] },
      { id: 1, brands: ['云智联', '云服务'] },
      { id: 2, brands: ['创智', '创想'] },
      { id: 3, brands: ['智联汇', '汇智通'] },
      { id: 4, brands: ['天行者', '天府云'] },
      { id: 0, brands: ['锦盛', '锦华'] },
      { id: 1, brands: ['云数据', '云计算'] },
      { id: 2, brands: ['新创', '新科技'] },
      { id: 3, brands: ['智慧汇', '汇英才'] },
      { id: 4, brands: ['天成', '天府星'] },
    ];

    // 更多品牌名
    const brandNames = ['锦程', '云端', '创新', '汇智', '天府', '锦程云', '云智联', '创智', '智联汇', '天行者', '锦盛', '云数据', '新创', '智慧汇', '天成'];

    const channels = ['涅槃', '麒麟', 'WMS'];
    const riskLevels = ['高风险', '有风险', '无风险'];

    // 前6条核心记录
    const coreFollowUp = ['跟进中', '跟进中', '跟进中', '已签约', '已签约', '已签约'];
    coreRecords.forEach((r, idx) => {
      oppData.push({
        name: r.name, customerId: customerRecords[r.customerIdx].id, brandName: r.brand,
        intendedProducts: r.prods.map(p => ({ product: p[0], amount: p[1] })),
        amount: r.amount, purchaseType: r.purchase, customerNeed: r.need, source: r.source,
        dataValidity: r.validity, stage: r.stage, probability: String(r.prob),
        followUpStage: coreFollowUp[idx],
        channel: channels[idx % channels.length],
        riskLevel: riskLevels[idx % riskLevels.length],
        collaborator: '朱鸣超',
        initiator: r.assignee,
        expectedCloseDate: r.closeDays > 0 ? this._futureDate(r.closeDays) : this._pastDate(Math.abs(r.closeDays)),
        assignee: r.assignee, department: r.dept, oppSource: r.oppSrc,
        stageChangedAt: this._pastDate(r.stageDays), keyAction: r.action,
        keyActionDate: r.actionDays > 0 ? this._futureDate(r.actionDays) : this._pastDate(Math.abs(r.actionDays)),
        contactId: contactRecords[r.contact]?.id || ''
      });
    });

    // 额外44条随机商机
    const extraOppNames = [
      'ERP系统', '数字化转型', 'CRM升级', '电商平台', 'OA办公', '数据分析', '云计算', '大数据', 'AI智能', '物联网',
      '供应链', '仓储管理', '物流系统', '财务系统', '人力资源', '项目管理', '客户画像', '精准营销', '会员体系', '积分商城',
      '小程序', '直播电商', '私域运营', '渠道管理', '门店管理', '订单系统', '支付系统', '安全审计', '报表系统', '数据中台',
      '智能客服', '知识图谱', '流程自动化', '电子签章', '发票系统', '预算管理', '绩效考核', '招聘系统', '培训平台', '企业社交',
      '协同办公', '文档管理', '移动办公', '混合云'
    ];

    for (let i = 0; i < 44; i++) {
      const cp = customerPool[i % customerPool.length];
      const cIdx = cp.id;
      const brand = brandNames[i % brandNames.length];
      const stage = stages[i % stages.length];
      const prob = { '需求待确认': '10', '需求确认': '30', '方案认可': '50', '确定合作': '70', '合同签约': '90', '赢单': '100', '输单': '0' }[stage];
      const isClosed = stage === '赢单' || stage === '输单';
      const prodCount = 1 + (i % 3);
      const prods = [];
      let totalAmt = 0;
      const usedProducts = new Set();
      for (let p = 0; p < prodCount; p++) {
        const prod = productNameList[(i * 3 + p) % productNameList.length];
        if (usedProducts.has(prod)) continue;
        usedProducts.add(prod);
        const amt = (i + 1) * 10000 + p * 5000 + Math.floor(Math.random() * 10000);
        prods.push({ product: prod, amount: amt });
        totalAmt += amt;
      }
      const validity = dataValidities[i % dataValidities.length];
      const assignee = assignees[i % assignees.length];
      const dept = departments[i % departments.length];
      const source = sources[i % sources.length];
      const purchase = purchaseTypes[i % purchaseTypes.length];
      const oppSrc = oppSources[i % oppSources.length];
      const stageDays = 1 + (i % 20);
      const closeDays = isClosed ? -(1 + (i % 10)) : 5 + (i % 60);
      const actionDays = isClosed ? -(1 + (i % 5)) : 1 + (i % 15);

      // 跟进阶段（售前商机专用）
      const followUpStages = ['跟进中', '跟进中', '跟进中', '已暂停', '已拒单'];
      const followUpStageMap = { '赢单': '已签约', '合同签约': '已签约', '输单': '已丢单' };
      const followUpStage = followUpStageMap[stage] || followUpStages[i % followUpStages.length];

      oppData.push({
        name: extraOppNames[i] + '+' + brand,
        customerId: customerRecords[cIdx].id, brandName: brand,
        intendedProducts: prods, amount: totalAmt, purchaseType: purchase,
        customerNeed: '客户需要' + extraOppNames[i] + '解决方案，推进企业数字化升级',
        source: source, dataValidity: validity, stage: stage, probability: prob,
        followUpStage: followUpStage,
        channel: channels[i % channels.length],
        riskLevel: riskLevels[i % riskLevels.length],
        collaborator: '朱鸣超',
        initiator: assignee,
        expectedCloseDate: closeDays > 0 ? this._futureDate(closeDays) : this._pastDate(Math.abs(closeDays)),
        assignee: assignee, department: dept, oppSource: oppSrc,
        stageChangedAt: this._pastDate(stageDays),
        keyAction: isClosed ? '已完成阶段任务' : '跟进客户需求方案',
        keyActionDate: actionDays > 0 ? this._futureDate(actionDays) : this._pastDate(Math.abs(actionDays)),
        contactId: contactRecords[cIdx]?.id || ''
      });
    }

    const oppRecords = oppData.map(o => Store.create('opportunities', o));

    // 为赢单的商机创建订单（主订单+子订单结构）
    const wonOpps = oppRecords.filter(o => o.stage === '赢单');
    const masterOrders = [];
    const subOrders = [];

    // 主订单1：锦程企业ERP项目
    const master1 = Store.create('orders', {
      orderNo: 'ORD-2026-001', customerId: customerRecords[0].id, opportunityId: oppRecords[4].id,
      orderType: '标准订单', orderSource: '涅槃', currency: 'CNY', listPrice: 222000,
      originalPrice: 198000, discount: 24000, payableAmount: 198000, paymentMethod: '银行转账',
      submitter: '李明', status: '已完成', approvalStatus: '已审批',
      contractsData: [{ label: '合同1', contractNo: 'HT-2026-001', contractType: '标准合同', partyB: '上海微盟企业发展有限公司', isSealed: '是', signer: '李明', amount: 222000, items: [{ productName: '企业版ERP系统', payable: 198000 }, { productName: '员工培训课程', payable: 24000 }] }],
      createdAt: this._pastDateTime(20), updatedAt: this._pastDateTime(15),
    });
    masterOrders.push(master1);
    Store.update('opportunities', oppRecords[4].id, { convertedOrderId: master1.id });
    // 子订单1-1：企业版ERP系统
    subOrders.push(Store.create('orders', {
      orderNo: 'ORD-2026-001-01', customerId: customerRecords[0].id, parentOrderId: master1.id,
      orderType: '软件产品', orderSource: '涅槃', currency: 'CNY', listPrice: 198000,
      originalPrice: 198000, discount: 0, payableAmount: 198000, paymentMethod: '银行转账',
      submitter: '李明', status: '已完成', approvalStatus: '已审批',
      createdAt: this._pastDateTime(20), updatedAt: this._pastDateTime(15),
    }));
    // 子订单1-2：员工培训课程
    subOrders.push(Store.create('orders', {
      orderNo: 'ORD-2026-001-02', customerId: customerRecords[0].id, parentOrderId: master1.id,
      orderType: '培训课程', orderSource: '涅槃', currency: 'CNY', listPrice: 24000,
      originalPrice: 24000, discount: 0, payableAmount: 24000, paymentMethod: '银行转账',
      submitter: '李明', status: '已完成', approvalStatus: '已审批',
      createdAt: this._pastDateTime(18), updatedAt: this._pastDateTime(15),
    }));

    // 主订单2：天府金融系统开发
    const master2 = Store.create('orders', {
      orderNo: 'ORD-2026-002', customerId: customerRecords[4].id, opportunityId: oppRecords[3].id,
      orderType: '标准订单', orderSource: '麒麟', currency: 'CNY', listPrice: 380000,
      originalPrice: 350000, discount: 30000, payableAmount: 350000, paymentMethod: '银行转账',
      submitter: '张华', status: '已付款', approvalStatus: '已审批',
      contractsData: [{ label: '合同1', contractNo: 'HT-2026-002', contractType: '标准合同', partyB: '上海微盟企业发展有限公司', isSealed: '是', signer: '张华', amount: 380000, items: [{ productName: '定制开发服务', payable: 350000 }] }],
      createdAt: this._pastDateTime(12), updatedAt: this._pastDateTime(3),
    });
    masterOrders.push(master2);
    Store.update('opportunities', oppRecords[3].id, { convertedOrderId: master2.id });
    // 子订单2-1：定制开发服务
    subOrders.push(Store.create('orders', {
      orderNo: 'ORD-2026-002-01', customerId: customerRecords[4].id, parentOrderId: master2.id,
      orderType: '技术服务', orderSource: '麒麟', currency: 'CNY', listPrice: 350000,
      originalPrice: 350000, discount: 0, payableAmount: 350000, paymentMethod: '银行转账',
      submitter: '张华', status: '已付款', approvalStatus: '已审批',
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

    // 购物车演示数据（为客户1添加2个商品）
    const cartSeedData = [
      {
        customerId: customerRecords[0].id,
        productName: '智慧美业解决方案',
        category: '软件产品',
        price: 29400,
        activityTag: '限时活动价',
        productType: '解决方案商品',
        period: '3年',
        salesMethod: '固定期限',
        version: '专业版',
        originalPrice: 29400,
        discountRate: '100.00%',
        quantity: 1,
        payable: 29400,
        paymentTerm: '1年',
      },
      {
        customerId: customerRecords[0].id,
        productName: '企微助手',
        category: '软件产品',
        price: 11800,
        productType: '解决方案商品',
        period: '1年',
        salesMethod: '固定期限',
        version: '标准版',
        originalPrice: 11800,
        discountRate: '100.00%',
        quantity: 1,
        payable: 11800,
        paymentTerm: '1年',
      },
    ];
    cartSeedData.forEach(c => Store.create('cartItems', c));

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

    // 为公海和待审核商机补充跟进阶段
    poolOppRecords.concat(pendingOppRecords).forEach(o => {
      Store.update('opportunities', o.id, { followUpStage: '跟进中' });
    });

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

    // ========== IS私海 / 零售私海 演示数据 ==========
    this._seedPrivateSeas();

    // ========== 审批演示数据 ==========
    this._seedApprovals(this._pastDate, this._futureDate, {
      customerRecords, oppRecords, orderRecords, masterOrders,
    });

    // ========== 外勤记录演示数据 ==========
    this._seedFieldVisits();

    // ========== 售前调用演示数据 ==========
    this._seedPreSales(customerRecords, contactRecords, oppRecords);

    console.log('CRM 演示数据已注入（含公海数据）');
  },

  _seedPrivateSeas() {
    // 检查是否已有 IS/LS 私海客户数据
    const existingIS = Store.getAll('customers').filter(c => c.privateSea === 'is');
    if (existingIS.length > 0) return; // 已有则跳过

    // IS私海演示客户（5个）
    const isCustomerData = [
      { name: '上海云帆科技发展有限公司', type: '企业客户', businessLine: '上海营销中心', productLine: '新零售', region: '上海', industry: '互联网/IT', status: '活跃', customerSource: '自拓线索', isBrandCustomer: '是', brandName: '云帆', storeCount: '11-30家', phone: '021-66889900', email: 'contact@yunfan.com', address: '上海市徐汇区漕河泾开发区', tags: ['IS客户'], privateSea: 'is' },
      { name: '北京智行者科技股份有限公司', type: '企业客户', businessLine: '北京营销中心', productLine: '零售SaaS', region: '北京', industry: '互联网/IT', status: '活跃', customerSource: '自拓线索', isBrandCustomer: '是', brandName: '智行者', storeCount: '1-10家', phone: '010-55667788', email: 'info@zhixingzhe.cn', address: '北京市朝阳区望京SOHO', tags: ['IS客户', '重点客户'], privateSea: 'is' },
      { name: '深圳前海创新数据技术有限公司', type: '企业客户', businessLine: '深圳营销中心', productLine: '智慧商超', region: '深圳', industry: '制造业', status: '活跃', customerSource: '自拓线索', isBrandCustomer: '是', brandName: '前海创新', storeCount: '31-50家', phone: '0755-22334455', email: 'biz@qianhaidata.io', address: '深圳市前海深港合作区', tags: ['IS客户', '大客户'], privateSea: 'is' },
      { name: '杭州数智云图科技有限公司', type: '企业客户', businessLine: '杭州营销中心', productLine: '零售SaaS', region: '杭州', industry: '互联网/IT', status: '沉默', customerSource: '自拓线索', isBrandCustomer: '否', brandName: '', storeCount: '1-10家', phone: '0571-88990011', email: 'info@shuzhiyun.com', address: '杭州市余杭区未来科技城', tags: ['IS客户'], privateSea: 'is' },
      { name: '广州云享互联信息技术有限公司', type: '企业客户', businessLine: '广州营销中心', productLine: '新零售', region: '广州', industry: '互联网/IT', status: '活跃', customerSource: '自拓线索', isBrandCustomer: '是', brandName: '云享互联', storeCount: '11-30家', phone: '020-77889900', email: 'sales@yunxiang.com', address: '广州市海珠区琶洲互联网集聚区', tags: ['IS客户'], privateSea: 'is' },
    ];

    const isContactData = [
      { name: '刘浩然', title: 'CEO', phone: '13800138001', email: 'liuhr@yunfan.com', isPrimary: true },
      { name: '王子涵', title: '技术总监', phone: '13800138002', email: 'wangzh@zhixingzhe.cn', isPrimary: true },
      { name: '陈雨桐', title: '运营总监', phone: '13800138003', email: 'chenyt@qianhaidata.io', isPrimary: true },
      { name: '张宇轩', title: '项目经理', phone: '13800138004', email: 'zhangyx@shuzhiyun.com', isPrimary: true },
      { name: '林诗琪', title: '市场总监', phone: '13800138005', email: 'linsq@yunxiang.com', isPrimary: true },
    ];

    const isCustomerRecords = isCustomerData.map(c => Store.create('customers', c));
    const isContactRecords = isContactData.map((c, i) => {
      c.customerId = isCustomerRecords[i].id;
      return Store.create('contacts', c);
    });
    // 关联主要联系人
    isCustomerRecords.forEach((c, i) => {
      Store.update('customers', c.id, { primaryContactId: isContactRecords[i].id });
    });

    // 零售私海演示客户（5个）
    const lsCustomerData = [
      { name: '上海永辉连锁超市有限公司', type: '企业客户', businessLine: '上海营销中心', productLine: '智慧商超', region: '上海', industry: '零售', status: '活跃', customerSource: '自拓线索', isBrandCustomer: '是', brandName: '永辉超市', storeCount: '101-500家', phone: '021-99887766', email: 'contact@yonghui.cn', address: '上海市闵行区虹桥商务区', tags: ['零售客户', '连锁'], privateSea: 'ls' },
      { name: '北京华联生活百货有限公司', type: '企业客户', businessLine: '北京营销中心', productLine: '零售SaaS', region: '北京', industry: '零售', status: '活跃', customerSource: '自拓线索', isBrandCustomer: '是', brandName: '华联生活', storeCount: '31-50家', phone: '010-88776655', email: 'info@hualianlife.cn', address: '北京市西城区金融街', tags: ['零售客户'], privateSea: 'ls' },
      { name: '深圳天虹数科商业有限公司', type: '企业客户', businessLine: '深圳营销中心', productLine: '零售SaaS', region: '深圳', industry: '零售', status: '活跃', customerSource: '自拓线索', isBrandCustomer: '是', brandName: '天虹', storeCount: '51-100家', phone: '0755-88776655', email: 'biz@tianhong.cn', address: '深圳市福田区华强北', tags: ['零售客户', '重点客户'], privateSea: 'ls' },
      { name: '成都红旗连锁商业有限公司', type: '企业客户', businessLine: '杭州营销中心', productLine: '智慧商超', region: '成都', industry: '零售', status: '沉默', customerSource: '自拓线索', isBrandCustomer: '是', brandName: '红旗连锁', storeCount: '500家以上', phone: '028-66778899', email: 'info@hongqi.cn', address: '成都市锦江区春熙路', tags: ['零售客户'], privateSea: 'ls' },
      { name: '广州广百百货商业有限公司', type: '企业客户', businessLine: '广州营销中心', productLine: '新零售', region: '广州', industry: '零售', status: '活跃', customerSource: '自拓线索', isBrandCustomer: '是', brandName: '广百百货', storeCount: '11-30家', phone: '020-55667788', email: 'sales@guangbai.com', address: '广州市天河区天河路', tags: ['零售客户'], privateSea: 'ls' },
    ];

    const lsContactData = [
      { name: '黄雨薇', title: '数字化总监', phone: '13900139001', email: 'huangyw@yonghui.cn', isPrimary: true },
      { name: '周明辉', title: '运营副总', phone: '13900139002', email: 'zhoumh@hualianlife.cn', isPrimary: true },
      { name: '吴思远', title: 'CIO', phone: '13900139003', email: 'wusy@tianhong.cn', isPrimary: true },
      { name: '郑雅文', title: '信息部经理', phone: '13900139004', email: 'zhengyw@hongqi.cn', isPrimary: true },
      { name: '许志强', title: '电商总监', phone: '13900139005', email: 'xuzq@guangbai.com', isPrimary: true },
    ];

    const lsCustomerRecords = lsCustomerData.map(c => Store.create('customers', c));
    const lsContactRecords = lsContactData.map((c, i) => {
      c.customerId = lsCustomerRecords[i].id;
      return Store.create('contacts', c);
    });
    lsCustomerRecords.forEach((c, i) => {
      Store.update('customers', c.id, { primaryContactId: lsContactRecords[i].id });
    });
  },

  _seedApprovals(pastDate, futureDate, refs) {
    const { customerRecords, oppRecords, orderRecords, masterOrders } = refs;

    // 已有的审批（提单生成的审批会由提交时自动创建，这里仅创建几条演示数据）
    const approvalData = [
      // 李春洁发起的申请（显示在「我的申请」）
      {
        title: '合同审批-锦程科技',
        description: '锦程科技-微商城合同，金额 ¥240,000',
        type: 'contract',
        applicant: '李春洁',
        status: 'pending',
        relatedType: 'contract',
        relatedOrderId: masterOrders.length > 0 ? masterOrders[0].id : '',
        customerId: customerRecords[0].id,
        customerName: '上海锦程科技有限公司',
        businessLine: '上海营销中心',
        amount: 240000,
        approver: '李明',
        rejectReason: '',
        approvedAt: '',
      },
      {
        title: '订单审批-云端数据',
        description: '云端数据-智慧零售订单，金额 ¥88,000',
        type: 'order',
        applicant: '李春洁',
        status: 'approved',
        relatedType: 'order',
        relatedId: masterOrders.length > 0 ? masterOrders[0].id : '',
        customerId: customerRecords[1].id,
        customerName: '北京云端数据科技',
        businessLine: '北京营销中心',
        amount: 88000,
        approver: '李明',
        rejectReason: '',
        approvedAt: pastDate(2),
      },
      // 需要李春洁审批的（显示在「我的审批」）
      {
        title: '合同审批-创新信息',
        description: '深圳创新信息-智慧零售合同，金额 ¥105,000',
        type: 'contract',
        applicant: '王丽',
        status: 'pending',
        relatedType: 'contract',
        relatedOrderId: masterOrders.length > 0 ? masterOrders[0].id : '',
        customerId: customerRecords[2].id,
        customerName: '深圳创新信息技术',
        businessLine: '深圳营销中心',
        amount: 105000,
        approver: '李春洁',
        rejectReason: '',
        approvedAt: '',
      },
      {
        title: '订单审批-天府数字',
        description: '成都天府数字-定制开发订单，金额 ¥350,000',
        type: 'order',
        applicant: '张华',
        status: 'pending',
        relatedType: 'order',
        relatedId: masterOrders.length > 1 ? masterOrders[1].id : '',
        customerId: customerRecords[4].id,
        customerName: '成都天府数字',
        businessLine: '杭州营销中心',
        amount: 350000,
        approver: '李春洁',
        rejectReason: '',
        approvedAt: '',
      },
    ];

    approvalData.forEach((a, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i * 3 - 1);
      d.setHours(10 + Math.floor(Math.random() * 6), Math.floor(Math.random() * 60));
      a.createdAt = d.toISOString();
      a.updatedAt = d.toISOString();
      Store.create('approvals', a);
    });
  },

  _seedFieldVisits() {
    const employees = ['李春洁', '李明', '张华', '王丽'];
    const customers = ['上海锦程科技有限公司', '北京云端数据科技', '深圳创新信息技术', '广州汇智软件', '杭州西湖互联', '武汉黄鹤信息', '成都天府数字'];
    const visitTypes = ['上门拜访', '会议拜访'];
    const purposes = ['产品演示', '需求调研', '合同签订', '售后服务', '方案汇报', '客情维护', '技术交流'];
    const locations = ['客户公司会议室', '客户公司前台', '公司接待室', '线上会议', '客户门店', '咖啡厅', '酒店会议室'];
    const contents = [
      '为客户演示了微商城核心功能，客户对数据看板模块非常感兴趣，表示下周内部讨论后反馈',
      '详细沟通了智慧零售系统的定制需求，客户希望增加会员管理模块的个性化功能',
      '与客户签订智慧零售解决方案合同，确认了实施排期和交付里程碑',
      '回访客户系统使用情况，解决了个别门店数据同步异常的问题，客户表示满意',
      '汇报了项目的整体方案设计思路，客户CTO对技术架构方案表示认可，提出了部分优化建议',
      '与客户进行日常客情沟通，了解客户近期业务规划，探讨了进一步合作的可能性',
      '与客户技术团队进行技术交流，针对API对接方案进行了深入讨论，达成一致意见',
      '向客户展示了最新版本的产品功能，客户对AI智能推荐模块表现出浓厚兴趣',
      '上门处理客户反馈的订单数据异常问题，经排查为接口配置问题，已现场修复',
      '与客户进行季度业务复盘会议，总结了合作成果，制定了下一季度的推广计划',
    ];

    const records = [
      { employeeName: '李春洁', customerName: '上海锦程科技有限公司', visitType: '上门拜访', purpose: '产品演示', content: contents[0], location: '客户公司会议室' },
      { employeeName: '李明', customerName: '北京云端数据科技', visitType: '上门拜访', purpose: '需求调研', content: contents[1], location: '客户公司会议室' },
      { employeeName: '张华', customerName: '深圳创新信息技术', visitType: '会议拜访', purpose: '合同签订', content: contents[2], location: '线上会议' },
      { employeeName: '王丽', customerName: '广州汇智软件', visitType: '电话拜访', purpose: '售后服务', content: contents[3], location: '线上会议' },
      { employeeName: '李春洁', customerName: '杭州西湖互联', visitType: '上门拜访', purpose: '方案汇报', content: contents[4], location: '客户公司前台' },
      { employeeName: '李明', customerName: '武汉黄鹤信息', visitType: '客户接待', purpose: '客情维护', content: contents[5], location: '公司接待室' },
      { employeeName: '张华', customerName: '成都天府数字', visitType: '会议拜访', purpose: '技术交流', content: contents[6], location: '酒店会议室' },
      { employeeName: '王丽', customerName: '上海锦程科技有限公司', visitType: '上门拜访', purpose: '产品演示', content: contents[7], location: '客户公司会议室' },
      { employeeName: '李明', customerName: '深圳创新信息技术', visitType: '上门拜访', purpose: '售后服务', content: contents[8], location: '客户门店' },
      { employeeName: '李春洁', customerName: '北京云端数据科技', visitType: '会议拜访', purpose: '客情维护', content: contents[9], location: '咖啡厅' },
    ];

    records.forEach((r, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i * 3 - 1);
      d.setHours(9 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 60));
      r.createdAt = d.toISOString();
      r.updatedAt = d.toISOString();
      // 设置 visitDate 为日期字符串
      r.visitDate = d.toISOString().split('T')[0];
      Store.create('fieldVisits', r);
    });
  },

  _seedPreSales(customerRecords, contactRecords, oppRecords) {
    // 如果无参数传入（后续加载时重刷数据），从 Store 重新获取
    if (!customerRecords) {
      const existingCount = Store.count('preSales');
      if (existingCount >= 26) return; // 已经够数了
      Store.clear('preSales');
      customerRecords = Store.getAll('customers');
      contactRecords = Store.getAll('contacts');
      oppRecords = Store.getAll('opportunities');
      if (customerRecords.length < 3) return;
    }

    // 辅助：按名称查找客户/联系人/商机
    const _findCust = (name) => customerRecords.find(c => c.name === name || (c.name && c.name.includes(name)));
    const _findContact = (name) => contactRecords.find(c => c.name === name);
    const _findOpp = (keyword) => oppRecords.find(o => o.name && o.name.includes(keyword));
    const _storeCount = (cust) => cust ? (cust.storeCount || '-') : '-';

    // 通用字段模板
    const _base = (custIdx, contactIdx, oppIdx) => ({
      customerId: customerRecords[custIdx]?.id || '',
      customerName: customerRecords[custIdx]?.name || '',
      industry: customerRecords[custIdx]?.industry || '',
      region: customerRecords[custIdx]?.region || '',
      offlineStoreCount: _storeCount(customerRecords[custIdx]),
      contactId: contactRecords[contactIdx]?.id || '',
      contactName: contactRecords[contactIdx]?.name || '',
      contactTitle: contactRecords[contactIdx]?.title || '',
      contactPhone: contactRecords[contactIdx]?.phone || '',
      opportunityIds: oppRecords[oppIdx] ? [oppRecords[oppIdx].id] : [],
      oppNames: oppRecords[oppIdx]?.name || '',
      productNames: (oppRecords[oppIdx]?.intendedProducts || []).map(p => p.product).join('、'),
      totalAmount: oppRecords[oppIdx]?.amount || 0,
    });

    const records = [
      // === 6条核心记录 ===
      {
        preSaleNo: 'SQ-20260516-01', initiator: '李春洁', department: '销售部', status: '待提交',
        isNewCustomer: '老客', brandName: '锦程',
        currentMiniProgramProvider: '有赞', currentCRMProvider: 'Salesforce', currentWecomProvider: '企微官方',
        competitor: '微盟', switchReason: '服务响应速度慢，无法满足快速迭代需求',
        decisionProcess: '技术评估→采购审批→高层决策',
        projectBackground: '锦程科技现有微商城系统使用已满3年，当前系统在性能扩展性上存在瓶颈，需要进行系统升级改造以满足业务增长需求。',
        projectStage: '选型阶段（招标采购/方案选型）',
        coreNeeds: '需要一套高可用的微商城解决方案，支持多租户架构、高并发场景下的稳定运行，以及完善的数据分析能力',
        priorCommunication: '前期已与客户技术总监进行2次技术交流，客户对微盟产品表现出浓厚兴趣，已提供初步方案',
        expectedLaunchDate: '2026-08', projectBudget: '20～50万元',
        supportCategory: '系统演示', notes: '客户要求使用真实数据进行演示，需要提前准备制造业客户案例',
        ..._base(0, 0, 0),
      },
      {
        preSaleNo: 'PS-2026-002', initiator: '李明', department: '销售部', status: '审批中',
        appliedAt: '2026-05-15',
        isNewCustomer: '新客', brandName: '云端',
        currentMiniProgramProvider: '无', currentCRMProvider: '自研CRM', currentWecomProvider: '企业微信官方',
        competitor: '尘锋信息', switchReason: '无',
        decisionProcess: '部门评估→IT评审→CEO审批',
        projectBackground: '云端数据科技为互联网/IT行业客户，目前处于数字化转型初期，需要构建完整的智慧零售解决方案体系。',
        projectStage: '需求阶段/未立项/立项中（预算需申请）',
        coreNeeds: '智慧零售系统、CRM客户管理、企微助手一体化解决方案，需要打通线上线下的数据链路',
        priorCommunication: '参加行业展会时初步接触，后续进行了一次线上会议介绍产品能力，客户反馈积极',
        expectedLaunchDate: '2026-09', projectBudget: '5～10万元',
        supportCategory: '方案设计', notes: '竞品尘锋信息也在接触中，需要尽快输出差异化方案',
        ..._base(1, 2, 1),
      },
      {
        preSaleNo: 'PS-2026-003', initiator: '张华', department: '市场部', status: '已通过',
        appliedAt: '2026-05-10',
        isNewCustomer: '老客', brandName: '创新',
        currentMiniProgramProvider: '微盟', currentCRMProvider: '微盟', currentWecomProvider: '微盟',
        competitor: '有赞', switchReason: '无',
        decisionProcess: '业务部门发起→技术评审→管理层确认',
        projectBackground: '深圳创新信息为制造业客户，已有零售系统基础，需要经销零售和本地生活业务拓展。',
        projectStage: '完成立项阶段（预算已确定）',
        coreNeeds: '经销零售系统扩展、本地生活业务模块、多门店管理功能增强',
        priorCommunication: '已与客户CTO进行多轮技术交流，确认了系统架构方向，客户对经销零售API对接方案表示认可',
        expectedLaunchDate: '2026-07', projectBudget: '10～20万元',
        supportCategory: '系统对接', notes: '需要对接客户现有ERP系统，建议提前安排技术预研',
        ..._base(2, 3, 5),
      },
      {
        preSaleNo: 'PS-2026-004', initiator: '李春洁', department: '销售部', status: '已驳回',
        appliedAt: '2026-05-08',
        isNewCustomer: '新客', brandName: '汇智',
        currentMiniProgramProvider: '有赞', currentCRMProvider: 'Salesforce', currentWecomProvider: '企业微信官方',
        competitor: '销售易', switchReason: '现有服务商无法满足定制化需求',
        decisionProcess: 'IT部门调研→采购部招标→管理层决策',
        projectBackground: '汇智软件当前SaaS系统无法满足业务发展需要，需要进行二次开发和功能增强。',
        projectStage: '需求阶段/未立项/立项中（预算需申请）',
        coreNeeds: 'SaaS系统二次开发，增加定制化报表功能和数据看板',
        priorCommunication: '初次电话沟通，客户表达了SaaS二开需求，但需求范围尚未明确',
        expectedLaunchDate: '2026-10', projectBudget: '5～10万元',
        supportCategory: '功能定制', notes: '需求范围不明确，建议先安排需求调研会',
        rejectReason: '当前售前资源紧张，请与客户重新沟通时间安排，建议延后1周提交',
        ..._base(3, 5, 2),
      },
      {
        preSaleNo: 'PS-2026-005', initiator: '王丽', department: '技术部', status: '待提交',
        appliedAt: '2026-05-14',
        isNewCustomer: '新客', brandName: '天府',
        currentMiniProgramProvider: '无', currentCRMProvider: '无', currentWecomProvider: '企业微信官方',
        competitor: '用友', switchReason: '首次采购，无前任服务商',
        decisionProcess: '信息部牵头→业务部门调研→集团审批',
        projectBackground: '成都天府数字为金融行业客户，需要定制化金融系统开发服务，要求满足金融行业合规标准。',
        projectStage: '需求阶段/未立项/立项中（预算需申请）',
        coreNeeds: '金融行业定制化开发，对接银行支付系统，满足等保三级合规要求',
        priorCommunication: '与客户信息部主管进行初步沟通，客户对金融支付系统定制开发有明确需求',
        expectedLaunchDate: '2026-12', projectBudget: '50～100万元',
        supportCategory: '方案设计', notes: '金融合规要求较高，建议安排有金融行业经验的售前团队支持',
        ..._base(4, 6, 3),
      },
      {
        preSaleNo: 'PS-2026-006', initiator: '李春洁', department: '销售部', status: '审批中',
        appliedAt: '2026-05-17',
        isNewCustomer: '老客', brandName: '锦程',
        currentMiniProgramProvider: '微盟', currentCRMProvider: '微盟', currentWecomProvider: '微盟',
        competitor: '', switchReason: '无，老客户增购',
        decisionProcess: '采购部直接发起→管理层审批',
        projectBackground: '锦程科技为我司老客户，现有系统使用情况良好，本次为增购培训服务和微商城扩展功能。',
        projectStage: '完成立项阶段（预算已确定）',
        coreNeeds: '员工培训服务、微商城功能扩展、智慧零售系统升级',
        priorCommunication: '老客户关系维护良好，客户采购经理已明确表达增购意向，需要售前制定培训方案',
        expectedLaunchDate: '2026-07', projectBudget: '20～50万元',
        supportCategory: '方案设计', notes: '老客户增购，建议给予适当优惠政策',
        ..._base(0, 1, 4),
        opportunityIds: (oppRecords[4] && oppRecords[0]) ? [oppRecords[4].id, oppRecords[0].id] : [],
        oppNames: '培训服务+锦程、微商城+锦程',
        productNames: '智慧服务、微商城、智慧零售',
        totalAmount: (oppRecords[4]?.amount || 0) + (oppRecords[0]?.amount || 0),
      },

      // === 新增20条记录 ===
      {
        preSaleNo: 'PS-2026-007', initiator: '李明', department: '销售部', status: '待提交',
        appliedAt: '2026-05-18',
        isNewCustomer: '老客', brandName: '锦程',
        currentMiniProgramProvider: '微盟', currentCRMProvider: '微盟', currentWecomProvider: '微盟',
        competitor: '有赞', switchReason: '无',
        decisionProcess: '技术部评估→采购审批',
        projectBackground: '锦程科技ERP系统使用多年，性能瓶颈日益明显，需要进行系统升级和迁移。',
        projectStage: '选型阶段（招标采购/方案选型）',
        coreNeeds: 'ERP系统升级改造，提升系统性能和扩展能力',
        priorCommunication: '配合客户IT部门进行了现有系统评估，制定了初步升级方案',
        expectedLaunchDate: '2026-09', projectBudget: '10～20万元',
        supportCategory: '系统演示', notes: '建议准备ERP系统升级的成功案例进行演示',
        ..._base(0, 0, 6),
      },
      {
        preSaleNo: 'PS-2026-008', initiator: '张华', department: '市场部', status: '已通过',
        appliedAt: '2026-05-12',
        isNewCustomer: '老客', brandName: '锦程',
        currentMiniProgramProvider: '微盟', currentCRMProvider: '微盟', currentWecomProvider: '微盟',
        competitor: '', switchReason: '无',
        decisionProcess: '培训需求评估→采购确认',
        projectBackground: '锦程科技员工培训需求已确认，需要制定系统的培训课程体系和实施计划。',
        projectStage: '完成立项阶段（预算已确定）',
        coreNeeds: '员工产品使用培训、系统运维培训、最佳实践分享',
        priorCommunication: '已完成客户需求调研，明确了培训目标和预期效果',
        expectedLaunchDate: '2026-06', projectBudget: '小于5万元',
        supportCategory: '方案设计', notes: '培训课程需根据客户实际使用场景定制',
        ..._base(0, 1, 4),
      },
      {
        preSaleNo: 'PS-2026-009', initiator: '王丽', department: '技术部', status: '审批中',
        appliedAt: '2026-05-19',
        isNewCustomer: '新客', brandName: '云端',
        currentMiniProgramProvider: '无', currentCRMProvider: '自研', currentWecomProvider: '企业微信',
        competitor: '销售易', switchReason: '首次采购',
        decisionProcess: 'CEO直接推动→部门配合调研',
        projectBackground: '云端数据科技启动全面数字化转型，从零开始构建数字化业务体系。',
        projectStage: '需求阶段/未立项/立项中（预算需申请）',
        coreNeeds: '数字化转型整体规划、智慧零售系统搭建、数据中台建设',
        priorCommunication: '与客户运营总监进行多次沟通，客户数字化转型需求迫切，但预算尚未完全确定',
        expectedLaunchDate: '2026-11', projectBudget: '20～50万元',
        supportCategory: '方案设计', notes: '项目范围较大，建议分阶段实施，先做智慧零售再做数据中台',
        ..._base(1, 2, 7),
      },
      {
        preSaleNo: 'PS-2026-010', initiator: '李春洁', department: '销售部', status: '已驳回',
        appliedAt: '2026-05-07',
        isNewCustomer: '新客', brandName: '云端',
        currentMiniProgramProvider: '有赞', currentCRMProvider: 'Salesforce', currentWecomProvider: '企业微信',
        competitor: '有赞', switchReason: '现有功能无法满足业务发展需要',
        decisionProcess: 'IT部调研→采购招标',
        projectBackground: '云端数据科技对现有智慧零售系统功能不满意，希望更换更强大的解决方案。',
        projectStage: '选型阶段（招标采购/方案选型）',
        coreNeeds: '竞品分析和差异化方案展示',
        priorCommunication: '客户正在评估多家供应商，需要通过竞品分析展示我司产品的差异化优势',
        expectedLaunchDate: '2026-08', projectBudget: '10～20万元',
        supportCategory: '方案设计', notes: '竞品分析需要市场部统一协调资源',
        rejectReason: '竞品分析需要市场部统一协调资源，请通过市场部渠道重新提交申请',
        ..._base(1, 2, 1),
      },
      {
        preSaleNo: 'PS-2026-011', initiator: '李明', department: '客服部', status: '待提交',
        appliedAt: '2026-05-20',
        isNewCustomer: '老客', brandName: '创新',
        currentMiniProgramProvider: '微盟', currentCRMProvider: '微盟', currentWecomProvider: '微盟',
        competitor: '', switchReason: '无',
        decisionProcess: '售后回访→需求评估→升级方案',
        projectBackground: '深圳创新信息售后服务阶段，需要对现有系统进行使用情况复盘，挖掘二期合作机会。',
        projectStage: '完成立项阶段（预算已确定）',
        coreNeeds: '系统使用情况复盘、二期需求挖掘、本地生活业务扩展',
        priorCommunication: '客户售后回访满意度较高，有进一步合作意向，需要制定二期扩展方案',
        expectedLaunchDate: '2026-08', projectBudget: '5～10万元',
        supportCategory: '系统对接', notes: '二期项目需要对接本地生活平台，需提前进行技术预研',
        ..._base(2, 4, 5),
      },
      {
        preSaleNo: 'PS-2026-012', initiator: '张华', department: '市场部', status: '审批中',
        appliedAt: '2026-05-21',
        isNewCustomer: '老客', brandName: '创新',
        currentMiniProgramProvider: '微盟', currentCRMProvider: '自研CRM', currentWecomProvider: '企业微信',
        competitor: '尘锋信息', switchReason: '现有CRM系统功能不足',
        decisionProcess: '运营部发起→IT评估→管理层审批',
        projectBackground: '深圳创新信息技术需要对现有CRM系统进行升级改造，增加智能营销和客户画像功能。',
        projectStage: '需求阶段/未立项/立项中（预算需申请）',
        coreNeeds: 'CRM系统升级、企微助手集成、客户数据平台搭建',
        priorCommunication: '与客户CTO和运营团队进行了多次技术交流，确认了系统升级方向和预算范围',
        expectedLaunchDate: '2026-10', projectBudget: '20～50万元',
        supportCategory: '功能定制', notes: '需要配合客户现有CRM系统进行接口对接，建议提前安排技术调研',
        ..._base(2, 3, 8),
      },
      {
        preSaleNo: 'PS-2026-013', initiator: '王丽', department: '技术部', status: '已通过',
        appliedAt: '2026-05-09',
        isNewCustomer: '老客', brandName: '创新',
        currentMiniProgramProvider: '微盟', currentCRMProvider: '微盟', currentWecomProvider: '微盟',
        competitor: '', switchReason: '无',
        decisionProcess: '技术部门直接推进',
        projectBackground: '配合客户进行微商城POC测试，验证高并发场景下的系统性能和稳定性，为正式签约做准备。',
        projectStage: '完成立项阶段（预算已确定）',
        coreNeeds: 'POC测试方案设计、高并发性能测试、测试报告输出',
        priorCommunication: '已与客户技术团队确认POC测试范围和验收标准',
        expectedLaunchDate: '2026-06', projectBudget: '10～20万元',
        supportCategory: '系统演示', notes: 'POC测试环境需要模拟客户真实业务场景，建议提前准备测试数据',
        ..._base(2, 4, 0),
      },
      {
        preSaleNo: 'PS-2026-014', initiator: '李春洁', department: '销售部', status: '待提交',
        appliedAt: '2026-05-22',
        isNewCustomer: '新客', brandName: '汇智',
        currentMiniProgramProvider: '有赞', currentCRMProvider: 'Salesforce', currentWecomProvider: '企业微信',
        competitor: '有赞、微盟', switchReason: '需要更强大的电商平台能力',
        decisionProcess: '业务部调研→IT选型→管理层决策',
        projectBackground: '广州汇智软件计划自建电商平台，目前处于技术选型阶段，需要进行技术可行性评估。',
        projectStage: '需求阶段/未立项/立项中（预算需申请）',
        coreNeeds: '电商平台技术选型评估、系统架构设计、产品功能对比分析',
        priorCommunication: '与客户总经理进行了初步沟通，客户希望了解我司电商解决方案的完整能力',
        expectedLaunchDate: '2026-09', projectBudget: '20～50万元',
        supportCategory: '系统演示', notes: '客户同时在看有赞和微盟产品，需要突出我司电商解决方案的差异化优势',
        ..._base(3, 5, 9),
      },
      {
        preSaleNo: 'PS-2026-015', initiator: '李明', department: '销售部', status: '审批中',
        appliedAt: '2026-05-23',
        isNewCustomer: '新客', brandName: '汇智',
        currentMiniProgramProvider: '有赞', currentCRMProvider: '无', currentWecomProvider: '无',
        competitor: 'Salesforce', switchReason: '现有服务商配合度低',
        decisionProcess: 'IT部评估→采购审批',
        projectBackground: '广州汇智软件SaaS二开需求增补，需要在原有二开基础上增加新的功能模块。',
        projectStage: '需求阶段/未立项/立项中（预算需申请）',
        coreNeeds: 'SaaS二开需求增补、开发工作量评估、实施方案优化',
        priorCommunication: '已与客户技术团队沟通增补需求，需要重新评估开发工作量和实施周期',
        expectedLaunchDate: '2026-10', projectBudget: '5～10万元',
        supportCategory: '功能定制', notes: '需要在原有二开方案基础上进行扩展，建议先做需求评审',
        ..._base(3, 5, 2),
      },
      {
        preSaleNo: 'PS-2026-016', initiator: '张华', department: '市场部', status: '已通过',
        appliedAt: '2026-05-06',
        isNewCustomer: '新客', brandName: '天府',
        currentMiniProgramProvider: '无', currentCRMProvider: '无', currentWecomProvider: '无',
        competitor: '泛微', switchReason: '首次采购',
        decisionProcess: '信息部牵头→集团数字化办公室审批',
        projectBackground: '成都天府数字启动OA系统集成项目，需要将OA系统与现有业务系统进行打通。',
        projectStage: '选型阶段（招标采购/方案选型）',
        coreNeeds: 'OA系统集成、业务流程自动化、移动办公能力',
        priorCommunication: '已配合客户信息部完成初步需求调研和技术方案交流，客户对成功案例展示印象深刻',
        expectedLaunchDate: '2026-08', projectBudget: '10～20万元',
        supportCategory: '系统对接', notes: '需要安排有OA系统集成经验的售前工程师现场支持',
        ..._base(4, 6, 10),
      },
      {
        preSaleNo: 'PS-2026-017', initiator: '王丽', department: '技术部', status: '已驳回',
        appliedAt: '2026-05-05',
        isNewCustomer: '新客', brandName: '天府',
        currentMiniProgramProvider: '无', currentCRMProvider: '无', currentWecomProvider: '无',
        competitor: '用友', switchReason: '首次采购',
        decisionProcess: '信息部调研→合规部门审核→招标',
        projectBackground: '成都天府数字金融合规项目，需要提供金融行业合规性技术论证方案。',
        projectStage: '需求阶段/未立项/立项中（预算需申请）',
        coreNeeds: '金融合规技术论证、第三方安全检测方案、合规认证支持',
        priorCommunication: '仅进行了初步电话沟通，客户需求尚不明确，需要进一步调研',
        expectedLaunchDate: '2026-12', projectBudget: '50～100万元',
        supportCategory: '方案设计', notes: '金融合规论证需要法务部门参与，建议先内部沟通',
        rejectReason: '金融合规论证需要法务部门参与，请与法务部沟通后再提交申请',
        ..._base(4, 6, 3),
      },
      {
        preSaleNo: 'PS-2026-018', initiator: '李春洁', department: '销售部', status: '待提交',
        appliedAt: '2026-05-24',
        isNewCustomer: '新客', brandName: '云端',
        currentMiniProgramProvider: '无', currentCRMProvider: '自研', currentWecomProvider: '企业微信',
        competitor: ' GrowingIO', switchReason: '自研系统无法满足数据分析需求',
        decisionProcess: '数据分析部门发起→IT评估→采购',
        projectBackground: '北京云端数据科技业务快速发展，需要建设专业的数据分析平台支撑业务决策。',
        projectStage: '需求阶段/未立项/立项中（预算需申请）',
        coreNeeds: '数据分析平台建设、数据中台技术方案、业务报表体系搭建',
        priorCommunication: '与客户运营总监沟通数据分析需求，客户对数据中台概念认可，但预算尚未明确',
        expectedLaunchDate: '2026-09', projectBudget: '10～20万元',
        supportCategory: '方案设计', notes: '建议提供数据中台建设方案与成功案例',
        ..._base(1, 2, 11),
      },
      {
        preSaleNo: 'PS-2026-019', initiator: '李明', department: '销售部', status: '审批中',
        appliedAt: '2026-05-25',
        isNewCustomer: '老客', brandName: '锦程',
        currentMiniProgramProvider: '微盟', currentCRMProvider: '微盟', currentWecomProvider: '微盟',
        competitor: '阿里云', switchReason: '无',
        decisionProcess: '技术部评估→董事会审批',
        projectBackground: '锦程科技启动整体上云项目，需要将现有业务系统迁移至云端，实现基础设施的弹性扩展。',
        projectStage: '选型阶段（招标采购/方案选型）',
        coreNeeds: '现有系统评估、云架构设计、迁移方案规划、灾备方案',
        priorCommunication: '与客户技术总监进行多次技术交流，客户对上云方案有明确需求，正在评估多家云服务商',
        expectedLaunchDate: '2026-10', projectBudget: '50～100万元',
        supportCategory: '方案设计', notes: '项目涉及金额较大，建议安排资深售前架构师支持',
        ..._base(0, 0, 12),
      },
      {
        preSaleNo: 'PS-2026-020', initiator: '张华', department: '客服部', status: '已通过',
        appliedAt: '2026-05-04',
        isNewCustomer: '老客', brandName: '汇智',
        currentMiniProgramProvider: '有赞', currentCRMProvider: 'Salesforce', currentWecomProvider: '企业微信',
        competitor: '', switchReason: '无',
        decisionProcess: '客服部发起→业务部门确认',
        projectBackground: '广州汇智软件售后服务体系搭建，需要建立标准化的售后服务流程和工单管理系统。',
        projectStage: '完成立项阶段（预算已确定）',
        coreNeeds: '售后服务流程设计、服务蓝图规划、客户成功体系搭建',
        priorCommunication: '已配合客户完成了需求调研和初步方案设计，客户对方案方向表示认可',
        expectedLaunchDate: '2026-07', projectBudget: '5～10万元',
        supportCategory: '方案设计', notes: '售后服务体系建设需要参考行业最佳实践',
        ..._base(3, 5, 13),
      },
      {
        preSaleNo: 'PS-2026-021', initiator: '王丽', department: '技术部', status: '待提交',
        appliedAt: '2026-05-26',
        isNewCustomer: '老客', brandName: '锦程',
        currentMiniProgramProvider: '微盟', currentCRMProvider: '微盟', currentWecomProvider: '微盟',
        competitor: '', switchReason: '无',
        decisionProcess: '创新实验室推动→技术委员会评估',
        projectBackground: '锦程科技探索AI技术在业务中的应用场景，需要技术预研和可行性验证。',
        projectStage: '需求阶段/未立项/立项中（预算需申请）',
        coreNeeds: 'AI应用场景探索、技术预研、可行性验证、概念验证（POC）',
        priorCommunication: '与客户创新实验室团队进行了初步交流，客户对AI智能推荐、智能客服等场景感兴趣',
        expectedLaunchDate: '2026-12', projectBudget: '10～20万元',
        supportCategory: '系统演示', notes: 'AI项目前期以咨询和概念验证为主，需要安排AI产品专家支持',
        ..._base(0, 0, 14),
      },
      {
        preSaleNo: 'PS-2026-022', initiator: '李春洁', department: '销售部', status: '审批中',
        appliedAt: '2026-05-27',
        isNewCustomer: '新客', brandName: '天府',
        currentMiniProgramProvider: '无', currentCRMProvider: '无', currentWecomProvider: '无',
        competitor: '中科曙光', switchReason: '首次采购',
        decisionProcess: 'IoT事业部发起→集团数字化中心审批',
        projectBackground: '成都天府数字启动IoT设备数据采集和智能分析项目，需要物联网平台技术支持。',
        projectStage: '需求阶段/未立项/立项中（预算需申请）',
        coreNeeds: '物联网平台搭建、设备数据采集、智能分析、可视化大屏',
        priorCommunication: '与客户IoT事业部进行了2次技术交流，客户对物联网平台方案有初步需求',
        expectedLaunchDate: '2026-11', projectBudget: '20～50万元',
        supportCategory: '方案设计', notes: '物联网项目需要硬件和软件整体方案，建议安排IoT领域售前专家',
        ..._base(4, 6, 15),
      },
      {
        preSaleNo: 'PS-2026-023', initiator: '李明', department: '销售部', status: '已通过',
        appliedAt: '2026-05-03',
        isNewCustomer: '新客', brandName: '云端',
        currentMiniProgramProvider: '有赞', currentCRMProvider: '自研ERP', currentWecomProvider: '企业微信',
        competitor: '京东云', switchReason: '需要专业供应链解决方案',
        decisionProcess: '供应链部门发起→IT支撑→管理层审批',
        projectBackground: '北京云端数据科技供应链管理数字化升级，需要打通上下游数据链路。',
        projectStage: '完成立项阶段（预算已确定）',
        coreNeeds: '供应链管理系统、仓储物流对接、供应商协同平台',
        priorCommunication: '已完成方案输出和产品演示，正在等待客户内部评审结果',
        expectedLaunchDate: '2026-08', projectBudget: '20～50万元',
        supportCategory: '系统对接', notes: '需要对接客户现有ERP和WMS系统',
        ..._base(1, 2, 16),
      },
      {
        preSaleNo: 'PS-2026-024', initiator: '张华', department: '市场部', status: '待提交',
        appliedAt: '2026-05-27',
        isNewCustomer: '老客', brandName: '创新',
        currentMiniProgramProvider: '微盟', currentCRMProvider: '微盟', currentWecomProvider: '微盟',
        competitor: '', switchReason: '无',
        decisionProcess: '门店运营部发起→IT支持',
        projectBackground: '深圳创新信息技术仓储管理系统升级，需要引入智能仓储解决方案提升运营效率。',
        projectStage: '需求阶段/未立项/立项中（预算需申请）',
        coreNeeds: 'WMS仓储管理系统、智能分拣、库存管理优化',
        priorCommunication: '与客户运营团队初步沟通仓储管理痛点，客户希望进行现场调研后出具体方案',
        expectedLaunchDate: '2026-09', projectBudget: '10～20万元',
        supportCategory: '系统演示', notes: '需要安排仓储管理系统专家进行现场调研',
        ..._base(2, 3, 17),
      },
      {
        preSaleNo: 'PS-2026-025', initiator: '王丽', department: '技术部', status: '已驳回',
        appliedAt: '2026-05-02',
        isNewCustomer: '新客', brandName: '汇智',
        currentMiniProgramProvider: '有赞', currentCRMProvider: '无', currentWecomProvider: '无',
        competitor: '顺丰科技', switchReason: '需要专业物流系统',
        decisionProcess: '物流部门发起→IT选型',
        projectBackground: '广州汇智软件物流系统升级需求，需要引入专业的物流管理系统。',
        projectStage: '需求阶段/未立项/立项中（预算需申请）',
        coreNeeds: '物流管理系统、配送路径优化、物流追踪、仓储联动',
        priorCommunication: '初步电话沟通，客户需求描述不够清晰，缺少详细的需求文档',
        expectedLaunchDate: '2026-10', projectBudget: '10～20万元',
        supportCategory: '功能定制', notes: '提交信息不完整，缺少客户需求文档和预算信息',
        rejectReason: '提交信息不完整，缺少客户需求文档和预算信息，请补充后重新提交',
        ..._base(3, 5, 18),
      },
      {
        preSaleNo: 'PS-2026-026', initiator: '李春洁', department: '销售部', status: '审批中',
        appliedAt: '2026-05-26',
        isNewCustomer: '新客', brandName: '天府',
        currentMiniProgramProvider: '无', currentCRMProvider: '金蝶', currentWecomProvider: '企业微信',
        competitor: '金蝶', switchReason: '现有财务系统无法满足集团化管理需求',
        decisionProcess: '财务部发起→集团数字化办公室评审→董事会审批',
        projectBackground: '成都天府数字财务系统数字化转型，需要实现财务集中管理和智能化核算。',
        projectStage: '选型阶段（招标采购/方案选型）',
        coreNeeds: '财务系统升级、集团财务管控、智能核算、数据可视化',
        priorCommunication: '与客户财务总监进行了需求调研，客户对财务系统数字化转型路线图有清晰规划',
        expectedLaunchDate: '2026-09', projectBudget: '20～50万元',
        supportCategory: '方案设计', notes: '财务系统项目敏感度高，需要签署NDA后再进行详细交流',
        ..._base(4, 6, 19),
      },
    ];

    records.forEach((r, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i * 1 - 1);
      d.setHours(9 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 60));
      r.createdAt = d.toISOString();
      r.updatedAt = d.toISOString();
      Store.create('preSales', r);
    });
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
