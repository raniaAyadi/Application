function Quiz(obj){
  this.id = obj ? obj.id : null;
  this.globalVariableValues = {};

  this.sections = new Array();
  if(obj)
    this.setSections(obj.sections);

  if(obj)
    this.setRules(obj.rules);
}

Quiz.prototype.setRules = function(tab){
  if(! tab){
    this.rules = null;
    return ;
  }

  this.rules = new Array();
  for(var i in tab){
    var rule = RuleFactory.createRule(tab[i].expression, true);
    this.rules.push(rule);
  }
};

Quiz.prototype.setSections = function(tab){
  if(tab){
    var l = tab.length;
    for(var i=0; i<l; i++)
      this.sections.push(new Section(tab[i]));
  }
}

Quiz.getCompanyQuiz = function(){
  return $.ajax({
    type: "GET",
    url: CONST.url.getCompanyQuiz,
  	datatype: "json"
  });
}

Quiz.getById = function(id){
  return $.ajax({
    type: "POST",
    url: 'getquest',
    data: {"quest" : id}
  });
}

Quiz.prototype.getQuestion = function(id){
  var l = this.sections.length;

  for(var i=0; i<l; i++){
    var s = this.sections[i];
    var q = s.getQuestion(id);

    if(q)
      return q;
  }

  return null;
}

Quiz.prototype.setAnswers = function(idQuizReply){
  return $.ajax({
    type: "GET",
    url: CONST.url.getQuizReply,
    data: {"id" : idQuizReply}
  }).done((data)=>{
    this.company = data.resources[0].company;
    this.globalVariableValues = data.resources[0].globalVariableValues;

    var reply = data.resources[0].questionAnswers;
    var l = reply.length;

    for(var i=0; i<l; i++){
      var id = Operation.getId(reply[i].question.resource);
      var question = this.getQuestion(id)

      question.answer = reply[i].answer;
    }
  });
};

Quiz.prototype.appQuestionRules = function(){
  var l = this.sections.length;
  for(var i=0; i<l; i++)
    this.sections[i].appRules();
};

Quiz.prototype.appQuizRules = function(){
  for(var i in this.rules)
    this.rules[i].appRule();
};

Quiz.prototype.appRules = function(){
  this.appQuestionRules();
  this.appQuizRules();
}

// Quiz.prototype.updateAnswers = function(obj){
//   if(!obj)
//     return;
//

//}
