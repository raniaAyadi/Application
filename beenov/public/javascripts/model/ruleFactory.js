var RuleFactory = {
  createRule : function(tab, isGlobal){
    if(isGlobal)
      return (tab[0] === "if") ? new GlobalRuleSetVarCond(tab) : new GlobalRuleSetVar(tab);
    else
      return (tab[0] === "if") ? new RuleSetVarCond(tab) : new RuleSetVar(tab);
  }
};
