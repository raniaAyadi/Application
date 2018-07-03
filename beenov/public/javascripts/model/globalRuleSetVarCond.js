function GlobalRuleSetVarCond(tab){
  this.action = tab[2];
  this.cond = tab[1];
}

GlobalRuleSetVarCond.prototype.evaluateCond = function(){
  var quiz = Meeting.instance.object.quiz;
  var globalVariableValues = quiz.globalVariableValues;

  var value = globalVariableValues[this.cond[1]];
  var cond = value + "==" + this.cond[2] ;

  try{
    return eval(cond);
  }
  catch(error){
    return false;
  }
}

GlobalRuleSetVarCond.prototype.appRule = function(){
  if(this.evaluateCond() === true){
    var action = [this.action[0], this.action[2]];
    var tab = [null, this.action[1], action];
    var ruleSetVar = new GlobalRuleSetVar(tab);

    ruleSetVar.appRule();
  }
};
