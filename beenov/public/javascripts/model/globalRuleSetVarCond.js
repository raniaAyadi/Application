function GlobalRuleSetVarCond(tab){
  this.action = tab[2];
  this.cond = tab[1];
}

GlobalRuleSetVarCond.prototype.evaluateCond = function(){
  var quiz = Meeting.instance.object.quiz;
  var globalVariableValues = quiz.globalVariableValues;
  var value = globalVariableValues[this.cond[1]];

  var condSymbole = this.cond[0];

  if (condSymbole == "and") {
    cond1 = this.cond[1][0];
    cond2 = this.cond[2][0];
    condSymbole = "&&";
    var condValue1 = this.cond[1][1] + cond1 + globalVariableValues[this.cond[1][2]];
    var condvalue2 = globalVariableValues[this.cond[2][1]] + cond2 + this.cond[2][2];
    var cond = condValue1 + condSymbole +condvalue2;
  }

  else {

    if (condSymbole == "=") condSymbole = "=="
    else
    {
      if (condSymbole == "/=") condSymbole = "! =";
    }

    var cond = value + condSymbole + this.cond[2] ;
}

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
  else {
    var quiz = Meeting.instance.object.quiz;
    var globalVariableValues = quiz.globalVariableValues;

    console.log(this.action);
    globalVariableValues[this.action[1]] = "";
  }
};
