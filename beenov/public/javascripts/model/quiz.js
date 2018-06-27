function Quiz(obj){
  this.id = obj ? obj.id : null;
  this.rules = obj ? obj.rules : new Array();

  this.globalVariableValues = {};

  this.sections = new Array();
  if(obj)
    this.setSections(obj.sections);
}

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
}
