var RuleFactory = {
  createRule : function(tab, isGlobal){
    if(isGlobal)
      return (tab[0] === "if") ? new GlobalRuleSetVarCond(tab) : new GlobalRuleSetVar(tab);
    else
      return (tab[0] === "if") ? new RuleSetVarCond(tab) : new RuleSetVar(tab);
  },

  getRuleByJSON : function(json){
    var rule = json;

    switch (json.type){
      case CONST.rule.ruleSetVar :
      rule.__proto__ = RuleSetVar.prototype;
      break;

      case CONST.rule.ruleSetVarCond :
      rule.__proto__ = RuleSetVarCond.prototype;
      break;

      case CONST.rule.globalRuelSetVar :
      rule.__proto__ = GlobalRuleSetVar.prototype;
      break;

      case CONST.rule.globalRuelSetVarCond :
      rule.__proto__ = GlobalRuleSetVarCond.prototype;
      break;
    }

    return rule;
  }
};
