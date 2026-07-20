#!/bin/bash
# Patch opportunities.js placeholders
FILE='/Users/chunjie/Desktop/01_工作资料/Claude空间/crm-system-claude/js/modules/opportunities.js'
cp "$FILE" "${FILE}.bak"

sed -i '' \
  -e "s/placeholder: '如：XX公司ERP项目'/placeholder: '意向产品+品牌名'/" \
  -e "s/placeholder: '品牌名称'/placeholder: '经营品牌，无则填\"无\"'/" \
  -e "s/placeholder: '详细描述客户的核心诉求、痛点或采购目标'/placeholder: '客户的核心诉求/痛点/目标'/" \
  -e "s/placeholder: '本月关键动作'/placeholder: '核心跟进任务内容概述'/" \
  "$FILE"

echo "Done. Verify:"
grep -n "placeholder:" "$FILE" | head -15
