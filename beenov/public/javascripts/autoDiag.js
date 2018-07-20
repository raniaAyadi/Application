var AutoDiag = {
  guestSubmit : new Event("guestSubmit")
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
  }).fail(()=>{
    alert("Vérifiez l'URL");
    Operation.eraseCookie(CONST.cookie.currentUser, CONST.cookie.sessionKey);
    window.location.href = CONST.url.login;
  });
};

AutoDiag.displayQuiz = function(){
  var siret = Company.currentCompany.siret
  var nameEntreprise = Company.currentCompany.name;
  var zipCode = Company.currentCompany.zipcode;

  var name = User.currentUser.firstName + ' ' + User.currentUser.lastName;
  var mail = User.currentUser.email;
  var nameAdvisor = AutoDiag.advisor.lastName;
  var theme = AutoDiag.subTheme.name;
  var subject = "Beenov\' - Auto Diagnostic";

  var msg = '<br/>Bonjour' + nameAdvisor + ',<br/><br/>'
  +'L\'entrepneur de l\'entreprise: ' + nameEntreprise + ', de code postale: '+ zipCode + ', et de SIRET : '+ siret
  +'  '+ name + '  a rempli le questionnaire: '
  + theme  + '.<br/> '
  + 'Veuillez le contacter sur son email: ' + mail;
  AutoDiag.advisor.receiveEmail(msg,subject); //subj et text html
  // .done((data)=>console.log(data)).fail((data)=>console.log(data));

  var guestFormC = document.querySelector("beenov-guest-form");
  guestFormC.remove();

  var infomet = JSON.parse(Operation.getCookie("infomet"));
  infomet.advisor = AutoDiag.advisor.firstName + " " + AutoDiag.advisor.lastName;
  infomet.theme = AutoDiag.subTheme.name;
  document.cookie = "infomet=" + JSON.stringify(infomet) + ";path=/";

  var autoQuiz = document.querySelector("#quiz");
  autoQuiz.append(new AutoQuizComponent());

};

$(document).ready(function(){
  User.guestLogin().done((user)=>{
    User.setCurrentUser(user);
    AutoDiag.checkUrl();
    document.body.addEventListener("guestSubmit", AutoDiag.displayQuiz);
  });
});
