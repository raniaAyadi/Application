function Company(obj){
  this.id = obj ? obj.id : null;
  this.siret = obj ? obj.siret : null;
  this.name = obj ? obj.name : null;
  this.infoQuestionnaireReply = (obj && obj.infoQuestionnaireReply.resource) ? Operation.getId(obj.infoQuestionnaireReply.resource) : -1;
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

Company.prototype.saveReply = function(isNew){
  var url = isNew ? CONST.url.addReply : CONST.url.updateReply + this.infoQuestionnaireReply;

  var data = this.getReplyJSON();
  var deferred = new $.Deferred();

  $.ajax({
    type : "POST",
    url : url,
    contentType : "application/json",
    data : JSON.stringify(data)
  }).done((data)=>{
    if(data.status === "ok"){
      this.infoQuestionnaireReply = data.id;
      deferred.resolve();
    }
    else
      deferred.reject();
  });

  return deferred;
};

Company.prototype.addCompany = function(){
  var deferred = new $.Deferred();
  var me = this;

  $.post(CONST.url.addCompany, {
    siret : me.siret
  }).done((data)=>{
    data = JSON.parse(data);
    if(data.status === "ok"){
      this.id = data.id;
      deferred.resolve();
    }
    else
      deferred.reject();
  });

  return deferred;
};

Company.prototype.updateCompany = function(){
  var json = this.getCompanyJSON();
  var id = this.id;

  return $.ajax({
    type : "POST",
    url : CONST.url.updateCompany + id,
    data : JSON.stringify(json),
    contentType : "application/json"
  });
};

Company.prototype.save = function(update){
  var update = (update === undefined) ? true : update;
  var deferred = $.Deferred();

  if(this.id){
    if(update)
      return this.saveReply();
    else
      deferred.resolve();
  }
  else
    this.addCompany().done(()=>this.saveReply(true).done(()=>this.updateCompany().done(()=>deferred.resolve())));

  return deferred;
};

Company.prototype.setReply = function(id){
  var deferred = new $.Deferred();

  if(this.infoQuestionnaireReply < 0)
    deferred.resolve();
  else{
    var idReply = id ? id : this.infoQuestionnaireReply;
    var url = CONST.url.getQuestReply + "/" + idReply;

    $.get(url).done((data)=>{
      if(data.status === "ok"){
        var tab = data.resources[0].questionAnswers;
        deferred.resolve(tab);
      }
    });
  }

  return deferred;
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

  $.when(this.setQuiz(), this.setReply(idReply)).done((data1, data2)=>{
    this.quiz.upadteAnswers(data2);

    deferred.resolve();
  });

  return deferred;
};

Company.verifyByAPI = function(siret){
  var url = CONST.url.verifyByAPI + siret;
  return $.get(url);
};

Company.getById = function(id){
  var deferred = $.Deferred();

  $.get(CONST.url.getCompanyById + id).done((data)=>{
    var company = new Company(data.resources[0]);
    deferred.resolve(company);
  });

  return deferred;
};

Company.prototype.getCoord = function(){
  console.log(this);
  var coord = {};

  coord.postalCode = this.zipcode;
  coord.nafCode = this.nafCode;
  coord.name = this.name;

  return coord;
};

Company.prototype.saveGuestForm = function(){

};

Company.setCompany = function(siret){
  var deferred = new $.Deferred();

  Company.getBySiret(siret).done((data)=>{
    var obj;

    if(data.resources[0]){
      obj = new Company(data.resources[0]);
      console.log(obj);
      obj.setQuizReply().done(()=> {
        localStorage.setItem("company", JSON.stringify(obj));
        deferred.resolve();
      });
    }

    else{
      obj = new Company();
      obj.siret = siret;

      $.when(obj.setQuiz(), obj.setAnswersByAPI(siret)).done(()=> {
        localStorage.setItem("company", JSON.stringify(obj));
        deferred.resolve();
      }).fail(()=> deferred.reject());
    }
  });

  return deferred;
};

Company.getCurrentCompany = function(){
  var json = JSON.parse(localStorage.getItem("company"));
  return Company.getCompanyByJSON(json);
};

Company.prototype.setAnswersByAPI = function(siret){
  var deferred = new $.Deferred();

  Company.verifyByAPI(siret).done((data)=>{
    data = JSON.parse(data);
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

Company.prototype.getCompanyJSON = function(){
  var json = {};
  var me = this;

  json["info-questionnaire-reply"] = {
    resource : "questionnaire-replies/" + me.infoQuestionnaireReply
  };
  json.siret = this.siret;

  return json;
};

Company.prototype.getReplyJSON = function(){
  var json = {};
  var me = this;

  json.company = {
    resource : "companies/" + me.id
  };
  json.owner = {
    resource : "users/" + Operation.getCookie(CONST.cookie.currentUser)
  };
  json.questionnaire = {
    resource : "questionnaires/" + me.quiz.id
  };

  json.contactEmail = null;
  json.contactFirstName = null;
  json.contactLastName = null;
  json.validatedP = false;
  json.sectionActions = [];
  json.comments = [];

  json.date = Operation.getDate(new Date());
  json.questionAnswers = this.quiz.getReplyJSON();

  this.quiz.appRules();
  json.globalVariableValues = this.quiz.globalVariableValues;

  return json;
};
