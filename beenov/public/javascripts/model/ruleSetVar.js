function RuleSetVar(tab){
  this.varDest = tab[1];
  this.action = tab[0];
  this.varSource = tab[2];
  this.type = CONST.rule.ruleSetVar;
}

RuleSetVar.prototype.appRule = function(answer, quiz){
  quiz = quiz || Meeting.instance.object.quiz;
  var globalVariableValues = quiz.globalVariableValues;
  var value = (this.varSource === "$answer") ? answer : this.varSource;

  if(this.action === "append"){
    globalVariableValues[this.varDest] = globalVariableValues[this.varDest] || new Array();
    if(value)
      globalVariableValues[this.varDest].push(value);
  }

  else{
    if(Array.isArray(value) && answer){
      var nbRows = value[2];
      var nbCol = value[3];

      if(nbRows === 0 || nbCol === 0)
        return;

      var l = answer.length ;
      var  answerMatrice = new Array(nbRows);
      var i=0;

      for(var j=0; j<nbRows; j++){
        answerMatrice[j] = new Array();
        for(var k=i; k<i+nbCol; k++){
          if(answer[k])
            answerMatrice[j].push(parseInt(answer[k]));
        }

        i+=nbCol;
      }

      globalVariableValues[this.varDest] = new Array();
      switch(value[0]){
        case "table-row":
          globalVariableValues[this.varDest] = answerMatrice[value[4]];
        break;

        case "table-column":
          for(var i in answerMatrice){
            var toPush = answerMatrice[i][value[4]];
            if(toPush)
              globalVariableValues[this.varDest].push(toPush);
          }
        break;

        case "table-cell":
          if(answerMatrice[value[4]][value[5]])
            globalVariableValues[this.varDest].push(answerMatrice[value[4]][value[5]]);
          break;
      }
    }

    else
      globalVariableValues[this.varDest] = value ? value : 0;
  }
};
