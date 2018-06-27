function Meeting(obj, isCurrent){
  this.thematique = obj.theme;
  this.advisor = obj.advisor;
  this.company = obj.company;

  var id = Operation.getId(obj.quest);
  this.quiz = {};
  this.quizReply = Operation.getId(obj.questRep);

  this.setQuiz(id).done(()=>{
    this.setAnswers(this.quizReply).done(()=>{
      if(isCurrent)
        Meeting.instance.deferred.resolve();
    });
  });
}

Meeting.prototype.setCompany = function(){

}

Meeting.prototype.setQuiz = function(id){
  if(id)
    return Quiz.getById(id).done((data)=>this.quiz = new Quiz(data));
}

Meeting.prototype.setAnswers = function(id){
  return this.quiz.setAnswers(id);
}

Meeting.prototype.update = function(){
  return this.quiz.setAnswers(this.quizReply);
}

Meeting.getAll = function(){
  return $.ajax({
    type : 'GET',
    url : CONST.url.selectAllMeeting,
    dataType : 'json'
  });
};

Meeting.getThemes = function(){
  return $.ajax({
    /* liste des thèmes */
    type: "GET",
  	url: CONST.url.getThemes,
  	dataType: "json"
  });
}

Meeting.delete = function(qstReply){
  return $.ajax({
    type: 'POST',
    url: 'delete',
    data: {"whatever" : '_', "qst" : qstReply}
  });
}

Meeting.getCurrentMeeting = function(){
  if(Meeting.instance == undefined){
    Meeting.instance = {
      deferred : new $.Deferred(),
      object : {}
    };

    var obj = JSON.parse(Operation.getCookie(CONST.cookie.currentMeeting));
    Meeting.instance.object = new Meeting(obj, true);
  }

  return Meeting.instance.deferred.promise();
}

Meeting.prototype.getQuestion = function(id){
  return this.quiz.getQuestion(id);
}
