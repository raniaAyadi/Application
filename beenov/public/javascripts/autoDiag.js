var AutoDiag = {
  guestSubmit : new Event("guestSubmit"),
  reportSubmit : new Event("reportSubmit")
};

AutoDiag.checkUrl = function(){
  var url = window.location.href;
  var data = {};

  var params = url.split('/');
  data.idUser = params[params.length - 2];
  data.idSubtheme = params[params.length - 1];

  $.when(User.getById(data.idUser), Theme.getSubtheme(data.idSubtheme)).done((user, theme)=>{
    AutoDiag.advisor = new User(user);
    AutoDiag.subTheme = theme;

    var idQuest = theme.questionnaire;
    Quiz.getById(idQuest).done( quiz => AutoDiag.quiz = new Quiz(quiz));
    document.querySelector("#autoTitre").innerText += AutoDiag.subTheme.name;
  }).fail(()=>{
    alert("Vérifiez l'URL");
    Operation.eraseCookie(CONST.cookie.currentUser, CONST.cookie.sessionKey);
    window.location.href = CONST.url.login;
  });
};

AutoDiag.displayQuiz = function(){
  var guestFormC = document.querySelector("beenov-guest-form");
  guestFormC.remove();

  var infomet = JSON.parse(Operation.getCookie("infomet"));
  infomet.advisor = AutoDiag.advisor.firstName + " " + AutoDiag.advisor.lastName;
  infomet.theme = AutoDiag.subTheme.name;
  document.cookie = "infomet=" + JSON.stringify(infomet) + ";path=/";

  var autoQuiz = document.querySelector("#quiz");
  autoQuiz.append(new AutoQuizComponent());

};

AutoDiag.sendEmail = function(e){
  console.log("send Email"+e.test);
  let data = {
       'siret': Company.currentCompany.siret,
       'zipCode': Company.currentCompany.zipcode,
       'nameEntreprise': Company.currentCompany.name,
       'nameUser': User.currentUser.firstName + ' ' + User.currentUser.lastName,
       'mailUser': User.currentUser.email,
       'nameAdvisor': AutoDiag.advisor.lastName,
       'theme' : AutoDiag.subTheme.name,
       'pdfLink' : AutoDiag.pdfLink
     };
   AutoDiag.advisor.receiveEmail(data);
}

$(document).ready(function(){
  User.guestLogin().done((user)=>{
    User.setCurrentUser(user);
    AutoDiag.checkUrl();
    document.body.addEventListener("guestSubmit", AutoDiag.displayQuiz);
    document.body.addEventListener("reportSubmit", AutoDiag.sendEmail);
  });
});
