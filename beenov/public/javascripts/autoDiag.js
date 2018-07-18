var AutoDiag = {
  guestSubmit : new Event("guestSubmit")
};

AutoDiag.checkUrl = function(){
  var url = window.location.href;
  var params = url.split('/');
  var data = {};

  data.idUser = params[params.length - 2];
  data.idQuiz = params[params.length - 1];

  $.when(User.getById(data.idUser), Quiz.getById(data.idQuiz)).done((user, quiz) => {
    AutoDiag.advisor = new User(user);
    AutoDiag.quiz = new Quiz(quiz);

  }).fail(()=>{
    alert("Vérifiez l'URL");
    window.location.href = CONST.url.login;
  });
};

AutoDiag.displayQuiz = function(){
  var guestFormC = document.querySelector("beenov-guest-form");
  guestFormC.remove();

  var autoQuiz = document.querySelector("#quiz");
  autoQuiz.append(new AutoQuizComponent());

  var report = document.querySelector("#beenov-report");
  report.append(new ReportComponent());
};

$(document).ready(function(){
  AutoDiag.checkUrl();
  document.body.addEventListener("guestSubmit", AutoDiag.displayQuiz);
});
