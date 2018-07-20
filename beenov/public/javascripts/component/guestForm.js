function GuestForm() {
  this.company = {};
}

GuestForm.prototype.submit = function(contactData){
  var deferred = $.Deferred();
  var siret = contactData.siret;

  var user = User.currentUser;
  user.firstName = contactData.contactFirstName;
  user.lastName = contactData.contactLastName;
  user.email = contactData.contactEmail;

  Company.setCompany(siret).done(()=>{
    this.company = Company.getCurrentCompany();
    Company.currentCompany = this.company;
    localStorage.removeItem("company");

    this.company.save(false).done(() => {
      var quiz = AutoDiag.quiz;
      Quiz.addEmptyQuiz(this.company.id, quiz.id, contactData).done((data)=>{
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
