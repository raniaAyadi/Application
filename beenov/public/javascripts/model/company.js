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

  if(isNaN(this.infoQuestionnaireReply) || this.infoQuestionnaireReply < 0)
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

Company.getCompanyByJSON = function(json){
  json.__proto__ = Company.prototype;
  json.quiz = Quiz.getQuizByJSON(json.quiz);

  return json;
}

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

Company.verifyByAPI = function(siret){
  var url = CONST.APIEntreprise.url + siret;
  var data = {
    token : CONST.APIEntreprise.token,
    context : CONST.APIEntreprise.context,
    object : CONST.APIEntreprise.object,
    recipient : CONST.APIEntreprise.recipient
  };

  return $.get(url , data);
};

Company.setCompany = function(siret){
  var deferred = new $.Deferred();

  Company.getBySiret(siret).done((data)=>{
    var obj;

    if(data.resources[0]){
      obj = new Company(data.resources[0]);
      obj.setQuizReply().done(()=> {
        localStorage.setItem("company", JSON.stringify(obj));
        deferred.resolve();
      });
    }

    else{
      obj = new Company();
      $.when(obj.setQuiz(), obj.setAnswersByAPI(siret)).done(()=> {
        localStorage.setItem("company", JSON.stringify(obj));
        deferred.resolve();
      }).fail(()=> deferred.reject());
    }
  });

  return deferred;
};

Company.prototype.setAnswersByAPI = function(siret){
  var deferred = new $.Deferred();

  Company.verifyByAPI(siret).done((data)=>{
    var c = data.etablissement;

    this.quiz.getQuestionByTitle(CONST.companyQuizTitles.name).answer = c.adresse.l1;
    this.quiz.getQuestionByTitle(CONST.companyQuizTitles.date).answer = Operation.getDate(c.date_creation_etablissement);
    this.quiz.getQuestionByTitle(CONST.companyQuizTitles.SIRET).answer = c.siret;
    this.quiz.getQuestionByTitle(CONST.companyQuizTitles.address).answer = c.adresse.l4;
    this.quiz.getQuestionByTitle(CONST.companyQuizTitles.city).answer = c.commune_implantation.value;
    this.quiz.getQuestionByTitle(CONST.companyQuizTitles.postalCode).answer = c.commune_implantation.code;
    this.quiz.getQuestionByTitle(CONST.companyQuizTitles.NAF).answer = c.naf;

    deferred.resolve();
  }).fail(()=>deferred.reject());

  return deferred;
};
