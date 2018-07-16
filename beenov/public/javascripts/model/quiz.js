function Quiz(obj){
  this.id = obj ? obj.id : null;
  this.globalVariableValues = {};

  this.sections = new Array();
  if(obj)
    this.setSections(obj.sections);

  if(obj)
    this.setRules(obj.rules);
}

Quiz.addEmptyQuiz = function(companyId){
  var emptyQuiz = {
    comments : [],
    contactEmail : "user@user.fr",
    contactFirstName : "test",
    contactLastName : "test",
    globalVariableValues : {},
    date : Operation.getDate(new Date()),
    questionAnswers : [],
    sectionActions : [],
    validatedP : false
  };

  emptyQuiz.owner = {
    resource : "users/" + window.getCookie(CONST.cookie.currentUser)
  };
  emptyQuiz.company = {
    resource : "companies/" + companyId
  };
  emptyQuiz.questionnaire = {
    resource : window.getParameterByName("questionnaire")
  };

  return $.ajax({
      type:"POST",
      url : CONST.url.addReply,
      contentType: 'application/json',
      data : JSON.stringify(emptyQuiz)
    });
};

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
  var deferred = $.Deferred();

  $.ajax({
    type: "POST",
    url: CONST.url.getQuiz,
    data: {"quest" : id}
  }).done((data)=>{
    if(data)
      deferred.resolve(data);
    else
      deferred.reject("quiz not found");
  });

  return deferred;
};

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
};

Quiz.getQuizByJSON = function(json){
  json.__proto__ = Quiz.prototype;

  for(var i in json.sections)
    json.sections[i] = Section.getSectionByJSON(json.sections[i]);

  for(var i in json.rules)
      json.rules[i] = RuleFactory.getRuleByJSON(json.rules[i]);

  return json;
};

Quiz.prototype.upadteAnswers = function(tab){
  if(!tab)
    return;

  var me = this;
  tab.forEach((elt)=>{
    var id = Operation.getId(elt.question.resource)
    var q = me.getQuestion(id);

    q.answer = elt.answer;
  });
};

Quiz.prototype.getQuestionByTitle = function(title){
  for(var i in this.sections){
    var q = this.sections[i].getQuestionByTitle(title);

    if(q)
      return q;
  }

  return null;
};

Quiz.prototype.getReplyJSON = function(){
  var tab = new Array();

  this.sections.forEach(s => tab = tab.concat(s.getReplyJSON()));

  return tab;
};
