function Company(obj){
  this.id = obj ? obj.id : null;
  this.siret = obj ? obj.siret : null;
  this.name = obj ? obj.name : null;
  this.infoQuestionnaireReply = obj ? Operation.getId(obj.infoQuestionnaireReply.resource) : -1;
  this.logoImageUrl = obj ? obj.logoImageUrl : null;
  this.nafCode = obj ? obj.nafCode : null;
  this.industry = obj ? obj.industry : null;
  this.sales = obj ? obj.sales : null;
  this.workforce = obj ? obj.workforce : null;
  this.zipcode = obj ? obj.zipcode : null;

  this.quiz = {};
}

Company.getBySiret = function(siret){
  return $.get(CONST.url.getCompany, {
    siret : siret
  });
};

Company.prototype.setReply = function(id){
  var deferred = new $.Deferred();

  if(isNaN(this.infoQuestionnaireReply))
    deferred.resolve();
  else{
    var idReply = id ? id : this.infoQuestionnaireReply;
    var url = CONST.url.getQuestReply + "/" + idReply;

    $.get(url).done((data)=>{
      if(data.status === "ok"){
        this.infoQuestionnaireReply = data.resources[0];
        deferred.resolve();
      }
    });
  }
};

Company.prototype.setQuiz = function(){
  var deferred = new $.Deferred();

  Quiz.getCompanyQuiz().done((data)=>{
    this.quiz = new Quiz(data);
    deferred.resolve();
  });

  return deferred;
};

Company.prototype.setQuizReply = function(idReply){
  var deferred = new $.Deferred();

  $.when(this.setQuiz(), this.setReply(idReply)).done(()=>{
    var tab = this.infoQuestionnaireReply.questionAnswers;
    this.quiz.upadteAnswers(tab);

    deferred.resolve();
  });

  return deferred;
};
