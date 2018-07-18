function GuestForm() {
  this.company = {};
}

GuestForm.prototype.submit = function(siret){
  var deferred = $.Deferred();

  Company.setCompany(siret).done(()=>{
    this.company = Company.getCurrentCompany();
    localStorage.removeItem("company");

    this.company.save(false).done(() => {
      var quiz = AutoDiag.quiz;
      Quiz.addEmptyQuiz(this.company.id, quiz.id).done((data)=>{
        var cookie = {
          quest: "questionnaires/" + quiz.id,
          questRep : "questionnaire-replies/"+data.id
        };
        document.cookie = "infomet=" + JSON.stringify(cookie)+";path=/";

        var me = this;
        var infoCompany = {
          companies : me.company.id,
          reply : me.company.infoQuestionnaireReply
        };

        document.cookie = "company_info=" + JSON.stringify(infoCompany)+";path=/";
        deferred.resolve();

      }).fail(data => deferred.reject(data));
    });

  }).fail((data) => deferred.reject(data));

  return deferred;
};
