var AutoDiag = {
  guestSubmit : new Event("guestSubmit")
};

AutoDiag.checkUrl = function(){
  var url = window.location.href;
  var params = url.split('/');
  var data = {};

  data.idUser = params[params.length - 2];
  data.idSubtheme = params[params.length - 1];

  $.when(User.getById(data.idUser), Theme.getSubtheme(data.idSubtheme)).done((user, theme)=>{
    AutoDiag.advisor = new User(user);
    AutoDiag.subTheme = theme;

    var idQuest = theme.questionnaire;
    Quiz.getById(idQuest).done( quiz => AutoDiag.quiz = new Quiz(quiz));
  }).fail(()=>{
    alert("Vérifiez l'URL");
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

  var report = document.querySelector("#beenov-report");
  report.append(new ReportComponent());
};

$(document).ready(function(){
  AutoDiag.checkUrl();
  document.body.addEventListener("guestSubmit", AutoDiag.displayQuiz);
});
