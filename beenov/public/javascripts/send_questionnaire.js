var is_new_entreprise = false;

function	Set_plugins()
{
  console.log("hi");
    $('.wysiwyg').trumbowyg({
	lang: 'fr',
	btns: ['formatting','bold', 'italic',
	       'underline','justifyLeft', 'justifyCenter',
	       'justifyRight', 'justifyFull']
    });
    $("div[style='z-index: 9999;width: 100%; position: relative']").remove();
    $('.datepicker').datepicker({
        closeText: "Fermer",
        prevText: "Précédent",
        nextText: "Suivant",
        currentText: "Aujourd'hui",
        monthNames: [ "janvier", "février", "mars", "avril", "mai", "juin",
		      "juillet", "août", "septembre", "octobre", "novembre", "décembre" ],
        monthNamesShort: [ "janv.", "févr.", "mars", "avr.", "mai", "juin",
			   "juil.", "août", "sept.", "oct.", "nov.", "déc." ],
        dayNames: [ "dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi" ],
        dayNamesShort: [ "dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam." ],
        dayNamesMin: [ "D","L","M","M","J","V","S" ],
        weekHeader: "Sem.",
        dateFormat: "dd/mm/yy",
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: "" });
    check_mandatories();
}

function	getCurrentDate()
{
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth();
    let yyyy = today.getFullYear();

    if(dd<10) {
	dd = '0'+dd
    }

    if(mm<10) {
	mm = '0'+mm
    }

    return(dd + '/' + mm + '/' + yyyy);
}

function        getParameterByName(name, url)
{
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
	results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
	var c = ca[i];
	while (c.charAt(0) == ' ') {
	    c = c.substring(1);
	}
	if (c.indexOf(name) == 0) {
	    return c.substring(name.length, c.length);
	}
    }
    return "";
}


var nb_send = 0;
var validatedP = false;

function	send_questionnaire(reinit)
{

    var isAutoDiag = window.hasOwnProperty("AutoDiag");
    let posted;
    let url = '/send_questionnaire';
    globalVariables = {};
    get_rules("quest");
    global_rules(main_rules);

    if (window.location.pathname == "/company")
    {
	posted = {
	    globalVariableValues: globalVariables,
	    contactFirstName: null,
	    contactLastName: null,
	    contactEmail: null,
	    questionnaire: { resource: "questionnaires/" + questionnaire_id },
	    sectionActions: [],
	    validatedP: false,
	    questionAnswers: get_values("quest"),
	    comments: [],
	    company: { resource: "companies/" + JSON.parse(getCookie("company_info")).companies },
	    date: getCurrentDate(),
	    owner: { resource: "users/" + getCookie("uid") }
	};
    }
    else if (getParameterByName("newquest", window.location.href) == "true")
    {
	posted = {
	    globalVariableValues: globalVariables,
	    contactFirstName: $("#DialogPrenom").val() || "",
	    contactLastName: $("#DialogNom").val() || "",
	    contactEmail: $("#DialogMail").val() || "",
	    questionnaire: { resource: "questionnaires/" + questionnaire_id },
	    sectionActions: [],
	    validatedP: validatedP,
	    questionAnswers: get_values("quest"),
	    comments: [],
	    company: { resource: "companies/" + JSON.parse(getCookie("company_info")).companies },
	    date: $("#DialogDate").val() || Operation.getDate(new Date()),
	    owner: { resource: "users/" + getCookie("uid") }
	};
    }
    else if (getParameterByName("newquest", window.location.href) == "false"|| isAutoDiag)
    {
      if(isAutoDiag){
        var companyJson = JSON.parse(getCookie("company_info"));
        var company = {
          resource : "companies/" + companyJson.companies
        };
        var ownerId = AutoDiag.advisor.id;
        var ownerAuto = {
          resource : "users/" + ownerId
        };
        var  questAuto = {
          resource : "questionnaires/" + AutoDiag.quiz.id
        };
      }

	posted = {
	    globalVariableValues: globalVariables,
	    contactFirstName: $("#DialogPrenom").val() || (isAutoDiag ? User.currentUser.firstName : "unkown"),
	    contactLastName: $("#DialogNom").val() || (isAutoDiag ? User.currentUser.lastName : "unkown"),
	    contactEmail: $("#DialogMail").val() || (isAutoDiag ?  User.currentUser.email : "unkown"),
	    questionnaire: isAutoDiag ? questAuto : questionnaire_reply.resources[0].questionnaire,
	    sectionActions: [],
	    validatedP: validatedP,
	    questionAnswers: get_values("quest"),
	    comments: [],
	    company: isAutoDiag ? company : questionnaire_reply.resources[0].company,
	    date: $("#DialogDate").val() || Operation.getDate(new Date()),
	    owner: isAutoDiag ? ownerAuto : questionnaire_reply.resources[0].owner
	};

    }
    if (window.location.pathname == "/company")
	url += '?company=true';
    else
	url += '?company=false';
    if (is_new_entreprise == true)
    {
	url += "&newent=true&siret=" + getParameterByName("siret", window.location.href);
    }
    url += '&newquest=' + getParameterByName("newquest", window.location.href);
    if (getParameterByName("newquest", window.location.href) == "true")
    {
	url += "&nbsend=" + nb_send;
    }

    if(Meeting.instance){
      url = CONST.url.sendQuestReply + "?company=false&newquest=false";
      var quiz = Meeting.instance.object.quiz;
      quiz.upadteAnswers(posted.questionAnswers);
      quiz.appRules();
      posted.globalVariableValues = quiz.globalVariableValues;
    }

    var deferred = $.Deferred();

    $.ajax({
  	type: 'POST',
  	url: url,
  	contentType: 'application/json',
  	data: JSON.stringify(posted),
  	success: function(body, status, jqXHR)
  	{
  	    if (status == "success" && reinit)
  		alert("Enregistrement bien effectué");
  	    if (getParameterByName("newquest", window.location.href) == "true"){
  		nb_send++;
  	    }
  	    if (window.location.pathname == "/company") {
  		document.cookie = "entreprise_siret=" + getParameterByName('siret', window.location.href);
  		window.location.replace('/questionnaire?newquest=true');
  	    }

  	    if (reinit!= undefined){
          var reportComponent = document.querySelector("beenov-report");

          if(reportComponent)
            reportComponent.updateItems();
        }

        deferred.resolve();
  	},
  	error: function(text, code, item)
  	{
  	    alert('error');
        deferred.reject();
  	}
      });



    var aux = JSON.parse(Operation.getCookie(CONST.cookie.currentMeeting));
    if(!aux.questRep){
      deferred.resolve();
      posted.questionAnswers = [];
      posted.questionnaire.resource = aux.quest;
      posted.globalVariableValues = {};

      $.ajax({
        type:"POST",
        url : "questionnaire-replies",
        contentType: 'application/json',
        data : JSON.stringify(posted)
      }).done((data)=>{
        aux.questRep = "questionnaire-replies/"+data.id;
        document.cookie = "infomet=" + JSON.stringify(aux);
        });
      }

      return deferred;
}
