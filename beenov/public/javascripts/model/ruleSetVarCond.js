function RuleSetVarCond(tab){
  this.action = tab[2];
  this.cond = tab[1];
  this.type = CONST.rule.RuleSetVarCond;
}

RuleSetVarCond.prototype.evaluateCond = function(answer){
  var quiz = Meeting.instance.object.quiz;
  var globalVariableValues = quiz.globalVariableValues;

  var value = (this.cond[1] === "$answer") ? answer : globalVariableValues[this.cond[1]];
  var cond = value + "==" + this.cond[2];

  try{
    return eval(cond);
  }
  catch(error){
    return false;
  }
}

RuleSetVarCond.prototype.appRule = function(answer){
  if(this.evaluateCond(answer) === true){
    var ruleSetVar = new RuleSetVar(this.action);
    ruleSetVar.appRule(answer);
  }
};
