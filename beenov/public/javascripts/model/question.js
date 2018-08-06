function Question(obj){
  if(obj){
    this.title = obj.text;
    this.helpText = obj.helpText;
    this.id = obj.id;
    this.type = obj.type;
    this.answer = obj.answer;
    this.typeOptions = obj.typeOptions;
    this.mandatory = (obj.title === "Forme juridique") ? true : obj.mandatory;
    this.setRules(obj.rules);
  }

}

Question.prototype.setRules = function(tab){
  if(! tab){
    this.rules = null;
    return ;
  }

  this.rules = new Array();
  for(var i in tab){
    var rule = RuleFactory.createRule(tab[i].expression);
    this.rules.push(rule);
  }
};

Question.prototype.getReplyJSON = function(){
  var json = {};
  var me = this;

  json.answer = this.answer;
  json.question = {
    resource : "questions/" + me.id
  };

  return json;
}

Question.prototype.getAnswerData = function(){
  var answerData = {
    answer : null,
    type : this.type
  };
  switch (this.type){
    case CONST.questionType.choice :
    answerData.answer = this.typeOptions.options[this.answer-1];
    break;

    case CONST.questionType.n1Choice :
    answerData.answer = new Array();

    var l = this.answer ? this.answer.length : 0;
    for(var i=0; i<l; i++){
      var obj = {
        row : this.typeOptions.rowLabels[i],
        column : this.typeOptions.columnLabels[this.answer[i]-1]
      };

      answerData.answer.push(obj);
    }
    break;


    case CONST.questionType.nChoices :
    answerData.answer = new Array();
    var l = this.answer ? this.answer.length : 0;

    for(var i=0; i<l; i++){
      var index = this.answer[i]-1;
      answerData.answer.push(this.typeOptions.options[index]);
    }
    break;


    case CONST.questionType.nMTexts :
    answerData.answer = new Array();
    var l = this.answer ? this.answer.length : 0;

    for (var i = 0; i < l ; i++) {
      answerData.answer.push(this.answer[i]);
    }
    break;


    default :
    answerData.answer = this.answer;
  }

  return answerData;
};

Question.prototype.appRules = function(quiz){
  for(var i in this.rules)
    this.rules[i].appRule(this.answer, quiz);

}

Question.getQuestionByJSON = function(json){
  json.__proto__ = Question.prototype;
  for(var i in json.rules)
    json.rules[i] = RuleFactory.getRuleByJSON(json.rules[i]);

  json.mandatory = (json.title === "Forme juridique") ? true : json.mandatory;
  return json;
};
