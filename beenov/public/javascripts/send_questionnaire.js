var is_new_entreprise = false;

function	Set_plugins()
{
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
    let posted;
    let url = '/send_questionnaire';
    console.log(questionnaire_data);
    globalVariables = {};
    get_rules("quest");
    global_rules(main_rules);
    console.log("GET COMMENTS");
    console.log(get_comments());

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
	console.log(posted);
    }
    else if (getParameterByName("newquest", window.location.href) == "true") 
    {
	posted = {
	    globalVariableValues: globalVariables,
	    contactFirstName: $("#DialogPrenom").val(),
	    contactLastName: $("#DialogNom").val(),
	    contactEmail: $("#DialogMail").val(),
	    questionnaire: { resource: "questionnaires/" + questionnaire_id },
	    sectionActions: [],
	    validatedP: validatedP,
	    questionAnswers: get_values("quest"),
	    comments: [],
	    company: { resource: "companies/" + JSON.parse(getCookie("company_info")).companies },
	    date: $("#DialogDate").val(),
	    owner: { resource: "users/" + getCookie("uid") }
	};
	console.log(posted);
    }
    else if (getParameterByName("newquest", window.location.href) == "false")
    {
	posted = {
	    globalVariableValues: globalVariables,
	    contactFirstName: $("#DialogPrenom").val(),
	    contactLastName: $("#DialogNom").val(),
	    contactEmail: $("#DialogMail").val(),
	    questionnaire: questionnaire_reply.resources[0].questionnaire,
	    sectionActions: [],
	    validatedP: validatedP,
	    questionAnswers: get_values("quest"),
	    comments: [],
	    company: questionnaire_reply.resources[0].company,
	    date: $("#DialogDate").val(),
	    owner: questionnaire_reply.resources[0].owner
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
    console.log(url);
    $.ajax({
	type: 'POST',
	url: url,
	contentType: 'application/json',
	data: JSON.stringify(posted),
	success: function(body, status, jqXHR)
	{
	    if (status == "success")
		alert("Enregistrement bien effectué");
	    if (getParameterByName("newquest", window.location.href) == "true"){
		nb_send++;
		console.log("after increment : " + nb_send);
	    }
	    console.log(posted);
	    if (window.location.pathname == "/company") {
		document.cookie = "entreprise_siret=" + getParameterByName('siret', window.location.href);
		window.location.replace('/questionnaire?newquest=true');
	    }
	    console.log(body);
	    if (reinit!= undefined)
		update_report(reinit);
	},
	error: function(text, code, item)
	{
	    alert('error');
	    console.log(text);
	    console.log(' | ' + code + ' | ' + item);
	}
    });
}
