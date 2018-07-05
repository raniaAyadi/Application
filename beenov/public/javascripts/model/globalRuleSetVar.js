function GlobalRuleSetVar(tab){
  this.varDest = tab[1];
  this.action = tab[2];
}

GlobalRuleSetVar.prototype.appRule = function(){
  var quiz = Meeting.instance.object.quiz;
  var globalVariableValues = quiz.globalVariableValues;

  if(this.action[0] === "list"){
    globalVariableValues[this.varDest] = new Array();
    var l = this.action.length;

    for(var i=1; i<l; i++){
      if(this.action[i])
        globalVariableValues[this.varDest].push(this.action[i]);
    }
  }

  else if(this.action[0] === "set-comment")
    globalVariableValues[this.varDest] = this.action[1];

  else{
    var sum = 0;
    var list = globalVariableValues[this.action[1]];
    console.log(list);
    if( ! list || list.length === 0)
    {
        globalVariableValues[this.varDest]= 0;
        return;
    }
    var l = list.length;

    for(var i=0; i<l; i++)
      sum += list[i];

    globalVariableValues[this.varDest] = (this.action[0] === "sum") ? sum : sum/l;
  }

};
