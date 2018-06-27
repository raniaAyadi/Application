function	compte_rendu(data)
{
    if (data.resources.length >= 1)
    {
	let i = 0;
	let toAppend = "";

	$('#sumup_type').append('<br /><select name="rendu_type" id="rendu_type"><option selected disabled hidden style="display: none" value="">Choisissez un modèle</option></select><br />');
	while (data.resources[i])
	{
	    toAppend += '<option onclick="generate_sumup(report_temp)">' + data.resources[i].name + '</option>';
	    ++i;
	}
	$('#rendu_type').append(toAppend);
  document.querySelector('#rendu_type').onclick = function(){
    document.querySelector("beenov-report").setAttribute("name", this.value);
  };
    }
    else
    {
	fail_compte_rendu()
    }
}

function	fail_compte_rendu()
{
    toAppend = "Aucun type de compte-rendu n'est disponible pour cet entretien.";
    $('#sumup_type').append(toAppend);
}

function	update_report(reinit)
{
    if (reinit == 2)
    {
	let cookie = {theme: JSON.parse(getCookie("infomet")).theme,
		      company: JSON.parse(getCookie("infomet")).company,
		      advisor: JSON.parse(getCookie("infomet")).advisor,
		      quest: JSON.parse(getCookie("infomet")).quest,
		      questRep: "questionnaire-replies/" + getCookie("newquest")};
	console.log(cookie)
	document.cookie = "infomet=" + JSON.stringify(cookie);
	$.ajax(
	    {
		type: "GET",
		url: 'info-questionnaire',
		datatype: "json",
		success: function(json)
		{
		    questionnaire_reply = json;
		    if (json.resources != undefined)
			validatedP = json.resources[0].validatedP;
		    reponses = questionnaire_reply.resources[0].questionAnswers;
		    quest_action = questionnaire_reply.resources[0].sectionActions;
		    globalVariables = questionnaire_reply.resources[0].globalVariableValues;
		    infocomp = {
			"Workforce": questionnaire_reply.resources[0].companyWorkforce,
			"Industry": questionnaire_reply.resources[0].companyIndustry,
		    };
		    get_comments();

		    let data;
		    data = generate_report(1);

		    $.ajax(
			{
			    type: "POST",
			    url: "/firstreport",
			    data: JSON.stringify(data),
			    success : (function(datarep)
				       {
					   console.log(datarep);
					   //	idreport = datarep;
					   generate_sumup(report_temp);
				       }),
			    error : (function(datarep)
				     {
					 console.log(datarep);
				     }),
			});
		}
	    });
    }
    else
    {
	generate_sumup(report_temp);
    }
}

function findlane(data, line)
{
    let i = 0;
    while (data.resources[i])
    {
	if (data.resources[i].name == line)
	{
	    return (i);
	}
	++i;
    }
    return (-1);
}

function	existingreport(comment)//array of the stored comments
{
    let i = 0;

    while (report.resources[0].items[i])
    {
	if (report.resources[0].items[i].type == "section-header")
	{
	    section_header2(i);
	}
	else if (report.resources[0].items[i].type == "section-actions")
	{
	    section_actions2(i);
	}
	else if (report.resources[0].items[i].type == "question-answer")
	{
	    question_answer2(i);
	}
	else if (report.resources[0].items[i].type == "line-jump")
	{
	    line_jump2(i);
	}
	else if (report.resources[0].items[i].type == "page-jump")
	{
	    page_jump2(i);
	}
	else if (report.resources[0].items[i].type == "appendix-company-info")
	{
	    appendix_company_info2(i);
	}
	else if (report.resources[0].items[i].type == "subsection-title")
	{
	    subsection_title2(i);
	}
	else if (report.resources[0].items[i].type == "chart")
	{
	    chart2(i);
	}
	else if (report.resources[0].items[i].type == "smiley-rank")
	{
	    smiley_rank2(i);
	}
	else if (report.resources[0].items[i].type == "comment")
	{
	    comment2(i);
	}
	else if (report.resources[0].items[i].type == "variable-value")
	{
	    variable_value2(i);
	}
	else if (report.resources[0].items[i].type == "scatter-chart")
	{
	    scatter_chart2(i);
	}
	else if (report.resources[0].items[i].type == "comment-group")
	{
	    comment_group2(i);
	}
	else if (report.resources[0].items[i].type == "info-sheets")
	{
	    info_sheets2(i);
	}
	else if (report.resources[0].items[i].type == "image")
	{
	    image2(i);
	}
	else
	{
	    console.log(report.resources[0].items[i].type);
	    console.log(i);
	}
	++i;
    }
}

function	image2(index)
{
    let	toAppend = '<div class="col-md-12" id="sumup' + index + '">';
    toAppend += '<div class="col-md-10">';
    toAppend += '<p class="title">' + report.resources[0].items[index].label + '</p>';

    toAppend += '</div><div class="col-md-2">';
    if (report.resources[0].items[index].visible == true)
	toAppend += '<button type="button" onclick="hideshow(' + index + ')" id="hide_' + index + '">Masquer</button>';
    else
	toAppend += '<button type="button" onclick="hideshow(' + index + ')" id="hide_' + index + '">Afficher</button>';

    if (report.resources[0].items[index].fileName == null)
	toAppend += '<button type="button" onclick="insertpic(' + index + ')">Modifier</button>';
    else
	toAppend += '<button type="button" onclick="insertpic(' + index + ')">Retirer</button>';

    if (report.resources[0].items[index].comment == null)
	toAppend += '<button type="button" onclick="commentreport(' + index + ')">Commenter</button></div></div><br /><hr>';
    else
	toAppend += '<button type="button" onclick="removecomment(' + index + ')">Supprimer</button></div><input type="text" id="comment' + id + '"></div><br /><hr>';
    $("#listrendu").append(toAppend);
}

function	insertpic(index)
{
    let toAppend = "";
    if (report.resources[0].items[index].fileName == null)
    {
	toAppend += '<input type="button" value="Parcourir" id="btninputfile2">';
	toAppend += '<input type="file" name="logo" id="inputfile2" style="display: none">';
	toAppend += '<img id="pict" src="#" hidden="true">';
	$("#sumup" + index + " > div:eq(0)").append(toAppend);
    }
    else
    {
	$("#sumup" + index + " > div:eq(0)").remove();
    }

    let	element = $('#hide_' + id);

    if(element != null && element[0].firstChild.data == 'Masquer')
    {
	element[0].firstChild.data = 'Afficher';
	$('#sumup' + id + ' div:eq(0)').attr("class", "col-md-10 darken");
    }
    else if(element != null && element[0].firstChild.data == 'Afficher')
    {
	element[0].firstChild.data = 'Masquer';
	$('#sumup' + id + ' div:eq(0)').attr("class", "col-md-10");
    }
}

function readURL2(input)
{
    if (input.files && input.files[0])
    {
	var reader = new FileReader();

	reader.onload = function (e)
	{
	    $('#pict').removeAttr('hidden');
	    $('#pict').attr('src', e.target.result);
	}
	reader.readAsDataURL(input.files[0]);
    }
}

function	info_sheets2(index)
{
    let	toAppend = '<div class="col-md-12" id="sumup' + index + '">';
    toAppend += '<div class="col-md-10">';
    toAppend += '<p class="title">' + report.resources[0].items[index].type + '</p>';

    toAppend += '</div><div class="col-md-2">';
    if (report.resources[0].items[index].visible == true)
	toAppend += '<button type="button" onclick="hideshow(' + index + ')" id="hide_' + index + '">Masquer</button></div></div><br /><hr>';
    else
	toAppend += '<button type="button" onclick="hideshow(' + index + ')" id="hide_' + index + '">Afficher</button></div></div><br /><h>';
    $("#listrendu").append(toAppend);
}

function	comment_group2(index)
{
    let	toAppend = '<div class="col-md-12" id="sumup' + index + '">';
    toAppend += '<div class="col-md-10">';
    toAppend += '<p class="title">' + report.resources[0].items[index].label + '</p>';

   if (report.resources[0].items[index].commentParagraphs != null)
    {
	toAppend += '<p>' + report.resources[0].items[index].commentParagraphs + '</p>'
    }

    toAppend += '</div><div class="col-md-2">';
    if (report.resources[0].items[index].visible == true)
	toAppend += '<button type="button" onclick="hideshow(' + index + ')" id="hide_' + index + '">Masquer</button>';
    else
	toAppend += '<button type="button" onclick="hideshow(' + index + ')" id="hide_' + index + '">Afficher</button>';

    if (report.resources[0].items[index].comment == null)
	toAppend += '<button type="button" onclick="commentreport(' + index + ')">Commenter</button></div></div><br /><hr>';
    else
	toAppend += '<button type="button" onclick="removecomment(' + index + ')">Supprimer</button></div><input type="text" id="comment' + id + '"></div><br /><hr>';
    $("#listrendu").append(toAppend);
}

function	scatter_chart2(index)
{
    let	toAppend = '<div class="col-md-12" id="sumup' + index + '">';
    toAppend += '<div class="col-md-10">';
    toAppend += '<p class="title">' + report.resources[0].items[index].name + '</p>';


    let json = report.resources[0].items[index];

    toAppend += '<img id="img' + index + '">';
    $.ajaxSetup({ headers:{ 'Content-Type': "application/json" } });

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/scatterchart2");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.responseType = 'arraybuffer';
    xhr.onload = function(e)
    {
	$("#img" + index).attr("src", "data:image/png;base64," + base64ArrayBuffer(e.currentTarget.response));
	legend(json.labelColors, json.labels, index);
    };
    xhr.send(JSON.stringify(json));

    toAppend += '</div><div class="col-md-2">';
    if (report.resources[0].items[index].visible == true)
	toAppend += '<button type="button" onclick="hideshow(' + index + ')" id="hide_' + index + '">Masquer</button>';
    else
	toAppend += '<button type="button" onclick="hideshow(' + index + ')" id="hide_' + index + '">Afficher</button>';

    if (report.resources[0].items[index].comment == null)
	toAppend += '<button type="button" onclick="commentreport(' + index + ')">Commenter</button></div></div><br /><hr>';
    else
	toAppend += '<button type="button" onclick="removecomment(' + index + ')">Supprimer</button></div><input type="text" id="comment' + id + '"></div><br /><hr>';
    $("#listrendu").append(toAppend);
}

function	variable_value2(index)
{
    let	toAppend = '<div class="col-md-12" id="sumup' + index + '">';
    toAppend += '<div class="col-md-10">';
    toAppend += '<p class="title">' + report.resources[0].items[index].name + '</p>';

    if (report.resources[0].items[index].value != null)
    {
	toAppend += '<p>' + report.resources[0].items[index].value + ' / ' + report.resources[0].items[index].maxValue + '</p>'
    }
    else
    {
	toAppend += '<p> Valeur non assignée / ' + report.resources[0].items[index].maxValue + '</p>'
    }

    toAppend += '</div><div class="col-md-2">';
    if (report.resources[0].items[index].visible == true)
	toAppend += '<button type="button" onclick="hideshow(' + index + ')" id="hide_' + index + '">Masquer</button>';
    else
	toAppend += '<button type="button" onclick="hideshow(' + index + ')" id="hide_' + index + '">Afficher</button>';

    if (report.resources[0].items[index].comment == null)
	toAppend += '<button type="button" onclick="commentreport(' + index + ')">Commenter</button></div></div><br /><hr>';
    else
	toAppend += '<button type="button" onclick="removecomment(' + index + ')">Supprimer</button></div><input type="text" id="comment' + id + '"></div><br /><hr>';
    $("#listrendu").append(toAppend);
}

function	comment2(index)
{
    let	toAppend = '<div class="col-md-12" id="sumup' + index + '">';
    toAppend += '<div class="col-md-10">';
    toAppend += '<p class="title">' + report.resources[0].items[index].label + '</p>';

    if (report.resources[0].items[index].text != null)
    {
	toAppend += '<p>' + report.resources[0].items[index].text + '</p>'
    }

    toAppend += '</div><div class="col-md-2">';
    if (report.resources[0].items[index].visible == true)
	toAppend += '<button type="button" onclick="hideshow(' + index + ')" id="hide_' + index + '">Masquer</button>';
    else
	toAppend += '<button type="button" onclick="hideshow(' + index + ')" id="hide_' + index + '">Afficher</button>';

    if (report.resources[0].items[index].comment == null)
	toAppend += '<button type="button" onclick="commentreport(' + index + ')">Commenter</button></div></div><br /><hr>';
    else
	toAppend += '<button type="button" onclick="removecomment(' + index + ')">Supprimer</button></div><input type="text" id="comment' + id + '"></div><br /><hr>';
    $("#listrendu").append(toAppend);
}

function	smiley_rank2(index)
{
    let	toAppend = '<div class="col-md-12" id="sumup' + index + '">';
    toAppend += '<div class="col-md-10">';
    let picture = ["sad0-1.png", "sad0-1.png", "sceptical2-3.png", "sceptical2-3.png", "happy4-5.png","happy4-5.png"]
    toAppend += '<p class="title">' + report.resources[0].items[index].label + '</p>';
    if (isNumeric(report.resources[0].items[index].value))
    {
	toAppend += '<img src="' + picture[report.resources[0].items[index].value] + '">'
    }
    else
    {
	toAppend += "<p>Valeur invalide</p>"
    }
    toAppend += '</div><div class="col-md-2">';
    if (report.resources[0].items[index].visible == true)
	toAppend += '<button type="button" onclick="hideshow(' + index + ')" id="hide_' + index + '">Masquer</button>';
    else
	toAppend += '<button type="button" onclick="hideshow(' + index + ')" id="hide_' + index + '">Afficher</button>';

    if (report.resources[0].items[index].comment == null)
	toAppend += '<button type="button" onclick="commentreport(' + index + ')">Commenter</button></div></div><br /><hr>';
    else
	toAppend += '<button type="button" onclick="removecomment(' + index + ')">Supprimer</button></div><input type="text" id="comment' + id + '"></div><br /><hr>';
    $("#listrendu").append(toAppend);
}

function	chart2(index)
{
    let	toAppend = '<div class="col-md-12" id="sumup' + index + '"><h4 style="font-style:italic;">' + report.resources[0].items[index].title + '</h4>';
    toAppend += '<div class="col-md-10">';
    report.resources[0].items[index].height = 300;
    report.resources[0].items[index].width = 550;
    toAppend += '<img id="img' + index + '">';
    $.ajaxSetup({ headers:{ 'Content-Type': "application/json" } });
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/barchart");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.responseType = 'arraybuffer';
    xhr.onload = function(e)
    {
	$("#img" + index).attr("src", "data:image/png;base64," + base64ArrayBuffer(e.currentTarget.response));
	if (report.resources[0].items[index].chartType == "bar" || report.resources[0].items[index].chartType == "radar")
	    legend(report.resources[0].items[index].dataSeriesColors, report.resources[0].items[index].dataSeriesNames, index);
	else
	    legend(report.resources[0].items[index].labelColors, report.resources[0].items[index].labels, index);
    };
    xhr.send(JSON.stringify(report.resources[0].items[index]));

    toAppend += '</div><div class="col-md-2">';
    if (report.resources[0].items[index].visible == true)
	toAppend += '<button type="button" onclick="hideshow(' + index + ')" id="hide_' + index + '">Masquer</button>';
    else
	toAppend += '<button type="button" onclick="hideshow(' + index + ')" id="hide_' + index + '">Afficher</button>';

    if (report.resources[0].items[index].comment == null)
	toAppend += '<button type="button" onclick="commentreport(' + index + ')">Commenter</button></div></div><br /><hr>';
    else
	toAppend += '<button type="button" onclick="removecomment(' + index + ')">Supprimer</button></div><input type="text" id="comment' + id + '"></div><br /><hr>';
    $("#listrendu").append(toAppend);

}

function	subsection_title2(index)
{
    let toAppend = "";
    toAppend += '<div class="col-md-12" id="sumup' + index +'"><h3 class="title">' + report.resources[0].items[index].text + '</h3>';
    toAppend += '<div class="col-md-10">';
    toAppend += '</div><div class="col-md-2">';

    $("#listrendu").append(toAppend);
}

function	appendix_company_info2(index)
{
    let toAppend = "";
    toAppend += '<div class="col-md-12" id="sumup' + index +'">';
    toAppend += '<div class="col-md-10"><p style="font-style: italic" class="title">Fiche signalétique de l\'entreprise</p>';
    toAppend += '</div><div class="col-md-2">';
    if (report.resources[0].items[index].visible == true)
	toAppend += '<button type="button" onclick="hideshow(' + index + ')" id="hide_' + index + '">Masquer</button></div></div><br /><hr>';
    else
	toAppend += '<button type="button" onclick="hideshow(' + index + ')" id="hide_' + index + '">Afficher</button></div></div><br /><hr>';
    $("#listrendu").append(toAppend);
}

function	line_jump2(index)
{
    let toAppend = "";
    toAppend += '<div class="col-md-12" id="sumup' + index + '">';
    for (let i = 0; i < report.resources[0].items[i].count; ++i)
    {
	toAppend += "<br />";
    }
    toAppend += "</div>";
    $("#listrendu").append(toAppend);
}

function	page_jump2(index)
{
    let toAppend = "";
    toAppend += '<div class="col-md-12" id="sumup' + index + '">';
    toAppend += '<p style="text-align: center"> --- Saut de page --- </p>';
    toAppend += "</div>";
    $("#listrendu").append(toAppend);
}

function	question_answer2(index)
{
    for (let i = 0; reponses[i]; ++i)
    {
	if (reponses[i].question["resource"] == report.resources[0].items[index].question.resource && reponses[i].answer)
	{
	    let toAppend = "";
	    let idquestion = findquestion(reponses[i].question["resource"]);

	    if ((findquestionindex(report.resources[0].items[index].question.resource, questions.sections)) == -1)
	    {
		return;
	    }
	    toAppend += '<div class="col-md-12" id="sumup' + index + '">';
	    toAppend += '<div class="col-md-10">';
	    if (typeof(reponses[i].answer) == "object" && questions.sections[idquestion[0]].questions[idquestion[1]]
		&& (questions.sections[idquestion[0]].questions[idquestion[1]].type == "nMTexts"
		    || questions.sections[idquestion[0]].questions[idquestion[1]].type == "nMLongTexts"))
	    {
		toAppend += createTable(idquestion[1], idquestion[0]);
	    }
	    else
	    {
		toAppend += '<p class="title">' + questions.sections[idquestion[0]].questions[idquestion[1]].text + '</p>';
		if (questions.sections[idquestion[0]].questions[idquestion[1]].type == "1Choice")
		{
		    toAppend += '<p>' + questions.sections[idquestion[0]].questions[idquestion[1]].typeOptions.options[reponses[i].answer - 1] + '</p>';
		}
		else if (questions.sections[idquestion[0]].questions[idquestion[1]].type == "Schéma de Porter")
		{
		    console.log("porter matrix");
		    console.log(reponses[i].answer);
		    toAppend += createPorterMatrix(idquestion[1], idquestion[0], reponses[i].answer);
		}
		else
		    toAppend += '<p>' + reponses[i].answer + '</p>';
	    }
	    toAppend += '</div><div class="col-md-2">';
	    if (report.resources[0].items[index].visible == true)
		toAppend += '<button type="button" onclick="hideshow(' + index + ')" id="hide_' + index + '">Masquer</button>';
	    else
		toAppend += '<button type="button" onclick="hideshow(' + index + ')" id="hide_' + index + '">Afficher</button>';

	    if (report.resources[0].items[index].comment == null)
		toAppend += '<button type="button" onclick="commentreport(' + index + ')">Commenter</button></div></div><br /><hr>';
	    else
		toAppend += '<button type="button" onclick="removecomment(' + index + ')">Supprimer</button></div><input type="text" id="comment' + id + '"></div><br /><hr>';
	    $("#listrendu").append(toAppend);
	}
    }
}

function	section_actions2(index)
{
    let toAppend = "";
    toAppend += '<div class="col-md-12" id="sumup' + index +'"><h4>' + report.resources[0].items[index].title + '</h4>';
    toAppend += '<div class="col-md-10">';
    if (report.resources[0].items[index].answer != undefined)
     {
        for (let i = 0; report.resources[0].items[index].answer[i]; ++i)
 	{
	    if (quest_action[i].section["resource"] == target)
	    {
		toAppend += '<span class="title">Action à court terme: </span>' + quest_action[i].actions["shortTerm"];
		toAppend += '<br /><span class="title">Action à moyen terme: </span>' + quest_action[i].actions["mediumTerm"];
		toAppend += '<br /><span class="title">Action à long terme: </span>' + quest_action[i].actions["longTerm"];
		toAppend += '<br /><span class="title">Action sans échéance: </span>' + quest_action[i].actions["noTerm"];
	    }
 	}
    }
    else
    {
	toAppend += "section non renseignée";
    }
     toAppend += '</div><div class="col-md-2">';
    if (report.resources[0].items[index].visible == true)
	toAppend += '<button type="button" onclick="hideshow(' + index + ')" id="hide_' + index + '">Masquer</button>';
    else
	toAppend += '<button type="button" onclick="hideshow(' + index + ')" id="hide_' + index + '">Afficher</button>';

    if (report.resources[0].items[index].comment == null)
	toAppend += '<button type="button" onclick="commentreport(' + index + ')">Commenter</button></div></div><br /><hr>';
    else
	toAppend += '<button type="button" onclick="removecomment(' + index + ')">Supprimer</button></div><input type="text" id="comment' + id + '"></div><br /><hr>';
    $("#listrendu").append(toAppend);
}

function	section_header2(index)
{
    let toAppend = "";
    toAppend += '<div class="col-md-12" id="sumup' + index + '"><h4>' + report.resources[0].items[index].title + '</h4>';
    toAppend += '<div class="col-md-10">';

    toAppend += '</div><div class="col-md-2">';

    if (report.resources[0].items[index].visible == true)
	toAppend += '<button type="button" onclick="hideshow(' + index + ')" id="hide_' + index + '">Masquer</button></div><hr>';
    else
	toAppend += '<button type="button" onclick="hideshow(' + index + ')" id="hide_' + index + '">Afficher</button></div><hr>';
    $("#listrendu").append(toAppend);
}

function	generate_sumup(data)
{
    let comment = {};
    get_rules("quest");
    global_rules(main_rules);
    comment = get_comments();
    $('#listrendu > *').remove();
    if (report != null && report.status == "ok" && report.resources[0] != undefined)
    {
	existingreport(comment);
    }
    else
    {
 	let toAppend = "";
	let i = findlane(data, $('#rendu_type').val());
	div_sumup = 0;
	if (i == -1)
	    return;
	for (let sect = 0; data.resources[i].sections[sect]; ++sect)
	{
	    toAppend += '<h2>' + data.resources[i].sections[sect].title + '</h2>';
	    for (let item = 0; data.resources[i].sections[sect].items[item]; ++item)
	    {
		if (quest_action && data.resources[i].sections[sect].items[item].type == "section-actions")
		{
		    toAppend += section_actions(data.resources[i].sections[sect].items[item].section, data.resources[i].sections[sect].items[item].name);
		}
		else if (data.resources[i].sections[sect].items[item].type == "question-answer")
		{
		    toAppend += question_anwser(data.resources[i].sections[sect].items[item], sect);
		}
		else if (data.resources[i].sections[sect].items[item].type == "subsection-title")
		{
		    toAppend += subsection_title(data.resources[i].sections[sect].items[item].text);
		}
		else if (data.resources[i].sections[sect].items[item].type == "radar-chart")
		{
		    toAppend += radar_chart(data.resources[i].sections[sect].items[item]);
		}
		else if (data.resources[i].sections[sect].items[item].type == "variable-value")
		{
		    toAppend += variable_value(data.resources[i].sections[sect].items[item]);
		}
		else if (data.resources[i].sections[sect].items[item].type == "static-image")
		{
		    console.log("STATIC IMAGE");
		    console.log(sect + ' - ' + item);
		    toAppend += static_image(data.resources[i].sections[sect].items[item]);
		}
		else if (data.resources[i].sections[sect].items[item].type == "scatter-chart")
		{
		    toAppend += scatter_chart(data.resources[i].sections[sect].items[item]);
		}
		else if (data.resources[i].sections[sect].items[item].type == "chart")
		{
		    toAppend += chart(data.resources[i].sections[sect].items[item]);
		}
		else if (data.resources[i].sections[sect].items[item].type == "page-jump")
		{
		    toAppend += page_jump();
		}
		else if (data.resources[i].sections[sect].items[item].type == "smiley-rank")
		{
		    toAppend += smiley_rank(data.resources[i].sections[sect].items[item]);
		}
		else if (data.resources[i].sections[sect].items[item].type == "comment" || data.resources[i].sections[sect].items[item].type == "comment-group")
		{
		    toAppend += comment_(data.resources[i].sections[sect].items[item]);
		}
		else if (data.resources[i].sections[sect].items[item].type == "comments")
		{
		    toAppend += basic_comments(data.resources[i].sections[sect].items[item]);
		}
		else if (data.resources[i].sections[sect].items[item].type == "named-comment")
		{
		    toAppend += named_comment(data.resources[i].sections[sect].items[item], comment);
		}
		else if (data.resources[i].sections[sect].items[item].type == "image")
		{
		    toAppend += image(data.resources[i].sections[sect].items[item]);
		}
		else if (data.resources[i].sections[sect].items[item].type == "appendix-company-info")
		{
		    toAppend += appendix_company_info(data.resources[i].sections[sect].items[item]);
		}
		else if (data.resources[i].sections[sect].items[item].type == "section-actions")
		{
		    toAppend += section_actionsREC(data.resources[i].sections[sect].items[item]);
		}
		else if (data.resources[i].sections[sect].items[item].type == "info-sheets")
		{
		    toAppend += info_sheets(data.resources[i].sections[sect].items[item]);
		}
		else
		{
		    console.log(data.resources[i].sections[sect].items[item])
		    if (data.resources[i].sections[sect].items[item].question)
			toAppend += '<div class="col-md-12" id="sumup' + div_sumup + ' ' + data.resources[i].sections[sect].items[item].question.resource + '">';
		    else
			toAppend += '<div class="col-md-12" id="sumup' + div_sumup + '">';
		    toAppend += '<div class="col-md-10"><h4>' + data.resources[i].sections[sect].items[item].name + '</h4>';
		    toAppend += '<p>' + data.resources[i].sections[sect].items[item].type + '</p>';
		    toAppend += '</div><div class="col-md-2"></div></div><br /><hr>';
		}
		++div_sumup;
	    }
		$('#listrendu').append(toAppend);
		toAppend = "";
	}
    }
}

function	section_actionsREC(target, name)
{
    toAppend += '<div class="col-md-12" id="sumup' + div_sumup + ' ' + data.question.resource + '"><h4>' + name + '</h4>';
    toAppend += '<div class="col-md-10">';
    for (let i = 0; quest_action[i]; ++i)
    {
	if (quest_action[i].section["resource"] == target)
	{
	    toAppend += '<span class="title">Action à court terme: </span>' + quest_action[i].actions["shortTerm"];
	    toAppend += '<br /><span class="title">Action à moyen terme: </span>' + quest_action[i].actions["mediumTerm"];
	    toAppend += '<br /><span class="title">Action à long terme: </span>' + quest_action[i].actions["longTerm"];
	    toAppend += '<br /><span class="title">Action sans échéance: </span>' + quest_action[i].actions["noTerm"];
	}
    }

    toAppend += '</div><div class="col-md-2"><button type="button" onclick="hideshow(' + div_sumup + ')" id="hide_' + div_sumup + '">Masquer</button><button type="button" onclick="commentreport(' + div_sumup + ')">Commenter</button></div></div><br /><hr>';
    return (toAppend);
}

function	question_anwser(data, sect)
{
    let toAppend = "";
    toAppend += '<div class="col-md-12" id="sumup' + div_sumup + '" value="'+ data.question.resource + '">';
    toAppend += '<div class="col-md-10">';
    if (reponses == null)
    {
	let idquestion = findquestion(data.question["resource"]);
    	toAppend += '<p class="title">' + questions.sections[idquestion[0]].questions[idquestion[1]].text + '</p>';
    }
    for (let i = 0; reponses && reponses[i]; ++i)
    {
	if (reponses[i].question["resource"] == data.question.resource && reponses[i].answer)
	{
	    let idquestion = findquestion(reponses[i].question["resource"]);
	    if (sect != 0)
	    {
		if ((findquestionindex(data.question.resource, questions.sections)) == -1)
		{
		    toAppend += '</div><div class="col-md-2"><button type="button" onclick="hideshow(' + div_sumup + ')" id="hide_' + div_sumup + '">Masquer</button><button type="button" onclick="commentreport(' + div_sumup + ')">Commenter</button></div></div><br /><hr>';
		    return (toAppend);
		}
	    }

	    if (typeof(reponses[i].answer) == "object" && questions.sections[idquestion[0]].questions[idquestion[1]] && (questions.sections[idquestion[0]].questions[idquestion[1]].type == "nMTexts" || questions.sections[idquestion[0]].questions[idquestion[1]].type == "nMLongTexts"))
	    {
		toAppend += createTable(idquestion[1], idquestion[0]);
	    }
	    else if (data.label == "Schéma de Porter" || questions.sections[idquestion[0]].questions[idquestion[1]].type == "porterMatrix")
	    {
		toAppend += createPorterMatrix(idquestion[1], idquestion[0], reponses[i].answer);
	    }
	    else
	    {
		toAppend += '<p class="title">' + questions.sections[idquestion[0]].questions[idquestion[1]].text + '</p>';
		if (questions.sections[idquestion[0]].questions[idquestion[1]].type == "1Choice")
		{
		    toAppend += '<p>' + questions.sections[idquestion[0]].questions[idquestion[1]].typeOptions.options[reponses[i].answer - 1] + '</p>';
		}
		else
		    toAppend += '<p>' + reponses[i].answer + '</p>';
	    }
	}
    }
    toAppend += '</div><div class="col-md-2"><button type="button" onclick="hideshow(' + div_sumup + ')" id="hide_' + div_sumup + '">Masquer</button><button type="button" onclick="commentreport(' + div_sumup + ')">Commenter</button></div></div><br /><hr>';
    return (toAppend);
}

function	findquestion(target)
{
    let i = 0;
    let u = 0;

    while (questions.sections[i])
    {
	while (questions.sections[i].questions[u])
	{
	    if (questions.sections[i].questions[u].id == target.split("/")[1])
		return ([i, u]);
	    ++u;
	}
	u = 0;
	++i;
    }
    return ([0, 0]);
}

function	findquestionindex(questionId, section)
{
    for (let u = 0; section[u]; ++u)
    {
	for (let i = 0; section[u].questions[i]; ++i)
	{
	    if (section[u].questions[i].id == questionId.split('/')[1])
	    {
		return (i);
	    }
	}
    }
    return (-1);
}

function	createPorterMatrix(index, sect, rep)
{
  console.log("createPorterMatrix");
  console.log(rep);
    let	toAppend = "";
    let porterQuestion = porterBase();
    let color = ["#ff1a1a", "#ffff33", "#00ff00"];
    toAppend += '<span class="title">' + questions.sections[sect].questions[index].text + '</span><br />';
    toAppend += '<table><tr><th></th><th>Comment ressentez-vous la menace des nouveaux entrants ?</th><th></th></tr>';
    toAppend += '<tr><td></td><td style="background-color:' + color[rep[0]] + '">' + porterQuestion[0][rep[0]] + '</td><td></td></tr>';

    toAppend += '<tr><th>Comment ressentez-vous le pouvoir de négociation des fournisseurs ?</th>';
    toAppend += '<th>Comment ressentez-vous l\'intensité de la concurence directe ?</th>';
    toAppend += '<th>Comment ressentez-vous le pouvoir de négociation des clients ?</th></tr>';
    toAppend += '<tr><td style="background-color:' + color[rep[2]] + '">' + porterQuestion[1][rep[2]] + '</td>';
    toAppend += '<td style="background-color:' + color[rep[4]] + '">' + porterQuestion[2][rep[4]] + '</td>';
    toAppend += '<td style="background-color:' + color[rep[6]] + '">' + porterQuestion[3][rep[6]] + '</td></tr>';

    toAppend += '<tr><th></th><th>Comment ressentez-vous la menace de produits et/ou services de substitution ?</th><th></th></tr>';
    toAppend += '<tr><td></td><td style="background-color:' + color[rep[8]] + '">' + porterQuestion[4][rep[8]] + '</td><td></td></tr>';
    toAppend += '</table>';
    return (toAppend);
}

function	porterBase()
{
    let porterQuestion = [[],[],[],[],[]];

    porterQuestion[0][0] = 'Les barrières à l\'entrée sont élevées (techniques ; financières ; culturelles ; juridique ; normatives)';
    porterQuestion[0][1] = 'Le produit est peu différencié ou bien les techniques de fabrication sont plutôt conventionnelles';
    porterQuestion[0][2] = 'Il n\'y a pas de berrières à l\'entrée ; le produit est basique et les savoir-faire sont facilement accessibles';

    porterQuestion[1][0] = 'L\'offre des fournisseurs est peu différenciée (ou bien : le poids des achats dans le coût du produit est faible)';
    porterQuestion[1][1] = 'Les fournisseurs sont en mesure de nous dicter leurs conditions en terme de prix, délai, etc...';
    porterQuestion[1][2] = 'Certains de nos fournisseurs essaient de se débarrasser de nous (ou bien : deviennent des concurrents)';

    porterQuestion[2][0] = 'Les concurents sont peu agressifs car atomisés et/ou cette activité n\'est pas essentielle pour eux';
    porterQuestion[2][1] = 'Les concurents sont peu agressifs car atomisés et/ou cette activité n\'est pas essentielle pour eux';
    porterQuestion[2][2] = 'Les concurents sont nombreux et agressif ; certains d\'entre eux ont une offre différenciée';

    porterQuestion[3][0] = 'Les clients sont plutôt (voir "très") dépendant de nos produits et savoir-faire (protégés le cas échéant)';
    porterQuestion[3][1] = 'Les clients fondent leur décision d\'acaht essnetiellement sur les critères prix, délai, etc...';
    porterQuestion[3][2] = 'Certains de nos clients nous font de plus en plus d\'infidélités (ou bien : deviennent des concurrents)';

    porterQuestion[4][0] = 'Les clients sont plutôt (voir "très") dépendant de nos produits et savoir-faire (protégés le cas échéant)';
    porterQuestion[4][1] = 'Les clients fondent leur décision d\'achat essnetiellement sur les critères prix, délai, etc...';
    porterQuestion[4][2] = 'Certains de nos clients nous font de plus en plus d\'infidélités (ou bien : deviennent des concurrents)';
    return (porterQuestion);
}

function	createTable(index, sect)
{
    let toAppend = "";
    let nbrcol = questions.sections[sect].questions[index].typeOptions.columnLabels.length;
    let nbrline = questions.sections[sect].questions[index].typeOptions.rowLabels.length;
    let answer = 0;
    let idAns = 0;
    let i = 0;
    let j = 0;

    toAppend += '<span class="title">' + questions.sections[sect].questions[index].text + '</span><br />';
    toAppend += '<table><tr><th> </th>'
    for (nbrcol = 0; questions.sections[sect].questions[index].typeOptions.columnLabels[nbrcol]; ++nbrcol)
    {
	toAppend += '<th>' + questions.sections[sect].questions[index].typeOptions.columnLabels[nbrcol] + '</th>';
    }
    toAppend += '</tr>';
    while (i < nbrline)
    {
	toAppend += '<tr><th>' + questions.sections[sect].questions[index].typeOptions.rowLabels[i] + '</th>';
	while (j < nbrcol)
	{
	    while (reponses[idAns].question.resource && reponses[idAns].question.resource.split("/")[1] != questions.sections[sect].questions[index].id)
	    {
		idAns += 1;
	    }
	    if (reponses[idAns].answer[answer] != null)
		toAppend += '<td>' + reponses[idAns].answer[answer] + '</td>';
	    else
		toAppend += "<td></td>"
	    ++j;
	    ++answer;
	    idAns = 0;
	}
	toAppend += "</tr>";
	++i;
	j = 0;
    }
    toAppend += '</th></table>';
    return (toAppend);
}

function	subsection_title(name)
{
    let toAppend = '<div  class="col-md-12" id="sumup' + div_sumup + '"><h3 class="title">' + name + '</h3></div>';
    toAppend += '<div class="col-md-10">';
    toAppend += '</div><div class="col-md-2"></div></div><br />';
    return (toAppend);
}

function	chart(data)
{
    let	json;
    let	index = div_sumup;
    let	toAppend = '<div class="col-md-12" id="sumup' + div_sumup + '"><h4 style="font-style:italic;">' + data.title + '</h4>';
    toAppend += '<div class="col-md-10">';
    switch (data.chartType)
    {
	case ("bar"):
	json = create_barchart_json(data);
	break;
	case ("pie"):
	json = create_piechart_json(data);
	break;
	case ("radar"):
	json = create_radarchartV2_json(data);
	break;
	default:
	toAppend += "Chart type isn't handled yet</div>";
	return (toAppend);
    }

    toAppend += '<img id="img' + div_sumup + '">';
    $.ajaxSetup({ headers:{ 'Content-Type': "application/json" } });

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/barchart");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.responseType = 'arraybuffer';
    xhr.onload = function(e)
    {
	$("#img" + index).attr("src", "data:image/png;base64," + base64ArrayBuffer(e.currentTarget.response));
	if (json.data.chartType == "bar" || json.data.chartType == "radar")
	    legend(json.data.dataSeriesColors, json.data.dataSeriesNames, index);
	else
	    legend(json.data.labelColors, json.data.labels, index);

    };
    xhr.send(JSON.stringify(json.data));
    toAppend += '</div><div class="col-md-2"><button type="button" onclick="hideshow(' + div_sumup + ')" id="hide_' + div_sumup + '">Masquer</button><button type="button" onclick="commentreport(' + div_sumup + ')">Commenter</button></div></div><br /><hr>';
    return (toAppend);
}

function	create_radarchartV2_json(data)
{
    let json =	{
	"data": {
	    'dataSeriesNames':[],
	    'dataSeriesValues':[],
	    'dataSeriesColors':[],
	    'labelColors':data.labelColors,
	    'labels':data.labels,
	    'options':data.options,
	    'valueDisplayType':data.valueDisplayType,
	    'chartType':data.chartType,
	    'title':data.title,
	    'maxValue':data.maxValue,
	    'height':300,
	    'width':550,
	},
    };

    for (let i = 0; data.dataSeries[i]; ++i)
    {
	json.data.dataSeriesNames[i] = data.dataSeries[i].name;
	json.data.dataSeriesValues[i] = globalVariables[data.dataSeries[i].list];
	json.data.dataSeriesColors[i] = data.dataSeries[i].color;
    }
    console.log(json);
    return (json)
}

function	create_piechart_json(data)
{
    let json =	{
	'data':{
	    'dataSeriesNames':[data.dataSeries[0].name],
	    'dataSeriesValues':[],
	    'dataSeriesColors':[data.dataSeries[0].color],
	    'labelColors':data.labelColors,
	    'labels':data.labels,
	    'options':data.options,
	    'valueDisplayType':data.valueDisplayType,
	    'chartType':data.chartType,
	    'title':data.title,
	    'maxValue':data.maxValue,
	    'height':300,
	    'width':550,
	}
    };
    let values = [];
    for (let i = 0; data.dataSeries[0].variables != null && data.dataSeries[0].variables[i]; i++)
    {
	values[i] = globalVariables[data.dataSeries[0].variables[i]]
    }
    json.data.dataSeriesValues[0] = values
    return (json);
}

function	create_barchart_json(data)
{
    let json =	{
	'data':{
	    'dataSeriesNames':[],
	    'dataSeriesValues':[],
	    'dataSeriesColors':[],
	    'labelColors':data.labelColors,
	    'labels':data.labels,
	    'options':data.options,
	    'valueDisplayType':data.valueDisplayType,
	    'chartType':data.chartType,
	    'title':data.title,
	    'maxValue':data.maxValue,
	    'height':300,
	    'width':550,
	}
    };
    for (let i = 0; data.dataSeries[i]; i++)
    {
	json.data.dataSeriesNames[i] = data.dataSeries[i].name
	json.data.dataSeriesColors[i] = data.dataSeries[i].color
	json.data.dataSeriesValues[i] = globalVariables[data.dataSeries[i].list]
    }
    return (json);
}

function	scatter_chart(data)
{
    console.log(data);
    let json = create_scatterchart_json(data);
    let index = div_sumup;
    let toAppend = "";
    if (data.question)
	toAppend += '<div class="col-md-12" id="sumup' + div_sumup + ' ' + data.question.resource + '"><h4>' + data.name + '</h4>';
    else
	toAppend += '<div class="col-md-12" id="sumup' + div_sumup + '"><h4>' + data.name + '</h4>';
    toAppend += '<div class="col-md-10">';
    toAppend += '<img id="img' + div_sumup + '">';
    $.ajaxSetup({ headers:{ 'Content-Type': "application/json" } });

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/scatterchart");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.responseType = 'arraybuffer';
    xhr.onload = function(e)
    {
	$("#img" + index).attr("src", "data:image/png;base64," + base64ArrayBuffer(e.currentTarget.response));
	legend(json.data.labelColors, json.data.labels, index);
    };
    xhr.send(JSON.stringify(json.data));

    toAppend += '</div><div class="col-md-2"><button type="button" onclick="hideshow(' + div_sumup + ')" id="hide_' + div_sumup + '">Masquer</button><button type="button" onclick="commentreport(' + div_sumup + ')">Commenter</button></div></div><br /><hr>';
    return (toAppend);
}

function	create_scatterchart_json(data)
{
    let json =	{
	'data':{
	    'questionnaire':{'resource':JSON.parse(getCookie('infomet')).quest},
	    'values':{'x': globalVariables[official_glbvariable_name(data.xVariable)], 'y': globalVariables[official_glbvariable_name(data.yVariable)]},
	    'max_values':{'x-max': data.xMaxValue,'y-max': data.yMaxValue},
	    'var-name':{'x': data.xVariable, 'y':data.yVariable},
	    'labels':{'x':data.xLabel, 'y':data.yLabel },
	    'workforce':infocomp['Workforce'],
	    'industry':infocomp['Industry'],
	    'show-same-size-average':false,
	    'show-same-size-and-industry-average':false,
	    'show-same-industry-average':false,
	    'size':{'height':450, 'width':550}
	}
    };
    if (json.data.values["x"] === "undefined")
	json.data.values["x"] = 0;
    if (json.data.values["y"] === "undefined")
	json.data.values["y"] = 0;
    return (json);
}

function	radar_chart(data)
{
    let json = create_radarchart_json(data);
    let index = div_sumup;
    let toAppend = "";
    if (data.question)
	toAppend += '<div class="col-md-12" id="sumup' + div_sumup + ' ' + data.question.resource + '"><h4>' + data.name + '</h4>';
    else
	toAppend += '<div class="col-md-12" id="sumup' + div_sumup + '"><h4>' + data.name + '</h4>';
    toAppend += '<div class="col-md-10">';
    toAppend += '<img id="img' + div_sumup + '">';

    $.ajaxSetup({ headers:{ 'Content-Type': "application/json" } });

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/radarchart");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.responseType = 'arraybuffer';
    xhr.onload = function(e)
    {
	$("#img" + index).attr("src", "data:image/png;base64," + base64ArrayBuffer(e.currentTarget.response));
	legend(json.data.labelColors, json.data.labels, index);
    };
    xhr.send(JSON.stringify(json));

    toAppend += '</div><div class="col-md-2"><button type="button" onclick="hideshow(' + div_sumup + ')" id="hide_' + div_sumup + '">Masquer</button><button type="button" onclick="commentreport(' + div_sumup + ')">Commenter</button></div></div><br /><hr>';
    return (toAppend);
}

function create_radarchart_json(data)
{
    let json =	{
	'data':{
	    'questionnaire':{'resource':JSON.parse(getCookie('infomet')).quest},
	    'variable-names':[],
	    'height':450,
	    'industry':infocomp['Industry'],
	    'max-value':5,
	    'workforce':infocomp['Workforce'],
	    'show-same-size-average':false,
	    'values':[],
	    'labels':[],
	    'show-same-size-and-industry-average':false,
	    'show-same-industry-average':false,
	    'width':550
	}
    };
    for (let i = 0; data.variables[i]; ++i)
    {
	json.data['variable-names'][i] = data.variables[i];
	let name = official_glbvariable_name(data.variables[i]);
	json.data['values'][i] = globalVariables[name];
    }
    for (let i = 0; data.labels[i]; ++i)
    {
	json.data['labels'][i] = data.labels[i];
    }
    return (json);
}

function	legend(colors, names, index)
{
    let toAppend = "";
    let i = 0;

    while (colors && names && colors[i] && names[i])
    {
	toAppend += '<div class="legend" style="background:#' + colors[i] + '">' + names[i] + '</div><br />';
	++i;
    }
    $('#sumup' + index + ' div:eq(0)').append(toAppend);
    $('#img' + index).attr("style", "float:left");
}

function	variable_value(data)
{
    console.log(data)
    let value = 0;
    let comparator = data['maxValue'];
    let toAppend = "";
    if (data.question)
	toAppend += '<div class="col-md-12" id="sumup' + div_sumup + ' ' + data.question.resource + '">';
    else
	toAppend += '<div class="col-md-12" id="sumup' + div_sumup + '">';
    toAppend += '<div class="col-md-10">';
    toAppend += '<h4>' + data.name + '<span class="title">&nbsp'
    value = globalVariables[official_glbvariable_name(data.variable)];

    toAppend += value + '/' + comparator;
    toAppend += '</span></h4></div><div class="col-md-2"><button type="button" onclick="hideshow(' + div_sumup + ')" id="hide_' + div_sumup + '">Masquer</button></div></div><br /><hr>';
    return (toAppend);
}

function	static_image(data)
{
    let toAppend = '<div class="col-md-12" id="sumup' + div_sumup + ' ' + data.question.resource + '">';
    toAppend += '<div class="col-md-10">';
    toAppend += '<p class="title">' + data.label + '</p>';
    toAppend += '<img src="' + data.url + '">';
    toAppend += '</div><div class="col-md-2"><button type="button" onclick="hideshow(' + div_sumup + ')" id="hide_' + div_sumup + '">Masquer</button><button type="button" onclick="commentreport(' + div_sumup + ')">Commenter</button></div></div><br /><hr>';
}

function	page_jump()
{
    let toAppend = "";
    toAppend += "<p><br /> -- Saut de page -- <br /></p>";
    return (toAppend);
}

function	smiley_rank(data)
{
    let toAppend = '<div class="col-md-12" id="sumup' + div_sumup + '">';
    toAppend += '<div class="col-md-10">';

    let picture = ["sad0-1.png", "sad0-1.png", "sceptical2-3.png", "sceptical2-3.png", "happy4-5.png","happy4-5.png"]
    toAppend += '<p class="title">' + data.label + '</p>';
    if (isNumeric(globalVariables[data.variable]))
    {
	toAppend += '<img src="' + picture[globalVariables[data.variable]] + '">'
    }
    else
    {
	toAppend += "<p>Valeur invalide</p>"
    }
    toAppend += '</div><div class="col-md-2"><button type="button" onclick="hideshow(' + div_sumup + ')" id="hide_' + div_sumup + '">Masquer</button><button type="button" onclick="commentreport(' + div_sumup + ')">Commenter</button></div></div><br /><hr>';
    return (toAppend);
}

function	comment_(data)
{
    let toAppend = '<div class="col-md-12" id="sumup' + div_sumup + '">';
    toAppend += '<div class="col-md-10">';
    toAppend += '<p style="font-style: italic">' + data.label + '</p>';
    toAppend += '</div><div class="col-md-2"><button type="button" onclick="hideshow(' + div_sumup + ')" id="hide_' + div_sumup + '">Masquer</button></div></div><hr><br />';
    return (toAppend);
}

function	basic_comments(data)
{
    let toAppend = '<div class="col-md-12" id="sumup' + div_sumup + '">';
    toAppend += '<div class="col-md-10">';
    toAppend += '</div><div class="col-md-2"><button type="button" onclick="hideshow(' + div_sumup + ')" id="hide_' + div_sumup + '">Masquer</button><button type="button" onclick="commentreport(' + div_sumup + ')">Commenter</button></div></div><hr><br />';
    return (toAppend);
}

function	named_comment(data, comment)
{
    if (comment[data.name] != undefined)
    {
	let toAppend = '<div class="col-md-12" id="sumup' + div_sumup + '">';
	toAppend += '<div class="col-md-10">';
	toAppend += '<p style="font-style: italic">' + comment[data.name] + '</p>';
	toAppend += '</div><div class="col-md-2"><button type="button" onclick="hideshow(' + div_sumup + ')" id="hide_' + div_sumup + '">Masquer</button></div></div><br /><hr>';
	return (toAppend);
    }
    else return ("");
}

function	image(data)
{
    let toAppend = "";
    if (data.question)
	toAppend += '<div class="col-md-12" id="sumup' + div_sumup + ' ' + data.question.resource + '">';
    else
	toAppend += '<div class="col-md-12" id="sumup' + div_sumup + '">';
    toAppend += '<div class="col-md-10">';
    toAppend += '<p style="font-style: italic" class="title">' + data.label + '</p>';
    toAppend += '<input type="file" name="image" id="inputfile"><img id="pictr" src="#">';
    toAppend += '</div><div class="col-md-2"><button type="button" onclick="hideshow(' + div_sumup + ')" id="hide_' + div_sumup + '">Masquer</button><button type="button" onclick="commentreport(' + div_sumup + ')">Commenter</button></div></div><br /><hr>';
    return (toAppend);
}

function	readURL(input) //for the treatment of the implemented image
{
    if (input.files && input.files[0])
    {
	var reader = new FileReader();

	reader.onload = function (e)
	{
	    $('#pictr').attr('src', e.target.result);
	}
	reader.readAsDataURL(input.files[0]);
    }
}

function	appendix_company_info(data)
{
    let toAppend = '<br /><div class="col-md-12" id="sumup' + div_sumup + '">';
    toAppend += '<div class="col-md-10">';
    toAppend += '<p style="font-style: italic" class="title">Fiche signalétique de l\'entreprise</p>';
    toAppend += '</div><div class="col-md-2"><button type="button" onclick="hideshow(' + div_sumup + ')" id="hide_' + div_sumup + '">Masquer</button></div></div><br /><hr>';
    return (toAppend);
}

function	section_actions(data)
{
    let toAppend = "";
    if (data.question)
	toAppend += '<div class="col-md-12" id="sumup' + div_sumup + ' ' + data.question.resource + '"><h4>' + data.name + '</h4>';
    else
	toAppend += '<div class="col-md-12" id="sumup' + div_sumup + '"><h4>' + data.name + '</h4>';
    toAppend += '<div class="col-md-10">';
    for (let i = 0; quest_action[i]; ++i)
    {
	if (quest_action[i].section["resource"] == target)
	{
	    toAppend += '<span class="title">Action à court terme: </span>' + quest_action[i].actions["shortTerm"];
	    toAppend += '<br /><span class="title">Action à moyen terme: </span>' + quest_action[i].actions["mediumTerm"];
	    toAppend += '<br /><span class="title">Action à long terme: </span>' + quest_action[i].actions["longTerm"];
	    toAppend += '<br /><span class="title">Action sans échéance: </span>' + quest_action[i].actions["noTerm"];
	}
    }
    toAppend += '</div><div class="col-md-2"><button type="button" onclick="hideshow(' + div_sumup + ')" id="hide_' + div_sumup + '">Masquer</button><button type="button" onclick="commentreport(' + div_sumup + ')">Commenter</button></div></div><br /><hr>';
     return (toAppend);
}

function	info_sheets(data)
{
    let toAppend = '<div class="col-md-12" id="sumup' + div_sumup + '">';
    toAppend += '<div class="col-md-10">';
    toAppend += '<p style="font-style: italic" class="title">' + data.type + '</p>';
    toAppend += '</div><div class="col-md-2"><button type="button" onclick="hideshow(' + div_sumup + ')" id="hide_' + div_sumup + '">Masquer</button></div></div><br /><hr>';
    return (toAppend);
}

/* switch from 'global-variable' form to 'globalVariable' form */
function	official_glbvariable_name(name)
{	let i = 1;
	name = name.split("-")

	while (name[i])
	{
	    name[i] = name[i].charAt(0).toUpperCase() + name[i].slice(1);
	    name[0] = name[0] + name[i];
	    ++i;
	}
	return (name[0]);
}

function isNumeric(n)
{
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function hideshow(id)
{
    let	element = $('#hide_' + id);

    if(element != null && element[0].firstChild.data == 'Masquer')
    {
	element[0].firstChild.data = 'Afficher';
	$('#sumup' + id + ' div:eq(0)').attr("class", "col-md-10 darken");
    }
    else if(element != null && element[0].firstChild.data == 'Afficher')
    {
	element[0].firstChild.data = 'Masquer';
	$('#sumup' + id + ' div:eq(0)').attr("class", "col-md-10");
    }
}

function	commentreport(id)
{
    let toAppend = '<input type="text" id="comment' + id + '">';
    $("#sumup" + id).append(toAppend);
    $("#sumup" + id + " > div:eq(1) > button:eq(1)").remove();


    $("#sumup" + id + " > div:eq(1)").append('<button type="button" onclick="removecomment(' + id + ')">Supprimer</button>');
}

function	removecomment(id)
{
    $("#sumup" + id + " > div:eq(1) > button:eq(1)").remove();
    $("#sumup" + id + " > input").remove();
    $("#sumup" + id + " > div:eq(1)").append('<button type="button" onclick="commentreport(' + id + ')">Commenter</button>');
}

/* ----------------------------------------- */

//report_temp
//questions
//reponses

/*
** Handled types:
**
** section-header
** question-answers
** appendix-info-comp
** line-jump
** page-jump
** subsection-title
*/

function	get_answer(id)
{
    let answer;
    for (let i = 0; reponses[i]; ++i)
    {
	if (reponses[i].question["resource"] == id)
	{
	    answer = reponses[i].answer;
	    return (answer);
	}
    }
}

function	generate_report(rep)
{
    if (report_temp == null || questions == null || reponses == null || questionnaire_reply == null)
    {
	alert("Génération impossible: données manquantes. Veuillez recharger la page.");
	return;
    }
    console.log("report template");
    console.log(report_temp);
    console.log("questions");
    console.log(questions);
    console.log("reponses");
    console.log(reponses);
    console.log("questionnaire_reply");
    console.log(questionnaire_reply);
    let json = create_report_json()
    let i = 0;
    let u = 0;
    while (report_temp.resources[0].sections[i])
    {
	let section = rep_section_header(i)
	if (section != undefined)
	    json.items.push(section);
	console.log(i)
	while (report_temp.resources[0].sections[i].items[u])
	{
	    let item = {};

	    if (report_temp.resources[0].sections[i].items[u].type == "question-answer")
		item = rep_question_answer(i, u);
	    else if (report_temp.resources[0].sections[i].items[u].type == "chart")
		item = rep_chart(i, u);
	    else if (report_temp.resources[0].sections[i].items[u].type == "subsection-title")
		item = rep_subsection_title(i, u);
	    else if (report_temp.resources[0].sections[i].items[u].type == "smiley-rank")
		item = rep_smiley_rank(i, u);
	    else if (report_temp.resources[0].sections[i].items[u].type == "appendix-company-info")
		item = rep_appendix_company_info(i, u);
	    else if (report_temp.resources[0].sections[i].items[u].type == "page-jump")
		item = rep_page_jump(i, u);
	    else if (report_temp.resources[0].sections[i].items[u].type == "comment")
		item = rep_comment(i, u);
	    else if (report_temp.resources[0].sections[i].items[u].type == "section-actions")
		item = rep_section_actions(i, u);
	    else if (report_temp.resources[0].sections[i].items[u].type == "variable-value")
		item = rep_variable_value(i, u);
	    else
	    {
		console.log(i + " -- " + u);
		console.log(report_temp.resources[0].sections[i].items[u].type);
	    }
	    if (item && item != undefined)
		json.items.push(item);
	    ++u;
	}
	u = 0;
	++i;
    }
//    json += "]}";
    console.log(json)
    if (rep == undefined)
	sendreport(json);
    else
	return (json)
}

function	sendreport(json)
{
    $.ajax(
	{
	    type: "POST",
	    url: "/savereport",
	    data: JSON.stringify(json),
	    success : (function(info)
		       {
			   console.log(info)
		       }),
	    error : (function(err)
		     {
			 console.log(err);
		     }),
	});
}

function	create_report_json()// hardbasis of the report
{
    let json = {
	"questionnaire-reply":{"resource": "questionnaire-replies/" + questionnaire_reply.resources[0].id},
	"company":{"resource": questionnaire_reply.resources[0].company.resource},
	"template":{"resource": "report-templates/" + report_temp.resources[0].id},
	"show-subsections-in-toc": null,
	"is-landscape": null,
	"show-first-page": null,
	"items":[],
    };
    console.log(json);
    return (json);
}

function	rep_section_header(sect)
{
    let section = {
	"comment": null,
	"visible": true,
	"title": report_temp.resources[0].sections[sect].title,
	"type": "section-header",
    };
    return (section);
}

function	rep_variable_value(sect, item)
{
    let visibility = true; // checker l'état du bouton
    let node = {
	"comment": null,
	"visible": visibility,
	"type": "variable-value",
	"showMean": true,
	"value": globalVariables[report_temp.resources[0].sections[sect].items[item].variable],
	"company": {"resource": "companies/" + JSON.parse(getCookie("company_info")).companies},
	"variableName": report_temp.resources[0].sections[sect].items[item].variable,
	"name": report_temp.resources[0].sections[sect].items[item].name,
	"maxValue": report_temp.resources[0].sections[sect].items[item].maxValue,
    };
    console.log(node)
    return (node);
}

function	rep_section_actions(sect, item)
{
    console.log(report_temp.resources[0].sections[sect].items[item])
    let node = {
	"comment": null,
	"visible": true,
	"type": "section-actions",
	"section": report_temp.resources[0].sections[sect].items[item].section,
	"sectionActions":"",
	"title": report_temp.resources[0].sections[sect].items[item].name,
    };
    return (node);
}

function	rep_comment(sect, item)
{
    console.log(report_temp.resources[0].sections[sect].items[item])
    let visibility = true; // checker l'état du bouton
    let node = {
	"comment": null,
	"visible": visibility,
	"type": "comment",
	"label": report_temp.resources[0].sections[sect].items[item].label,
	"text": null,
    };
    return (node);
}

function	rep_appendix_company_info(sect, item)
{
    let visibility = true; // checker l'état du bouton
    let node = {
	"comment": null,
	"visible": visibility,
	"type": "appendix-company-info",
    };
    return (node);
}

function	rep_line_jump()
{
    let node = {
	"comment": null,
	"visible": true,
	"type": "line-jump",
	"count": 1,
    };
    return (node);
}

function	rep_page_jump()
{
    let node = {
	"comment": null,
	"visible": true,
	"type": "page-jump",
    };
    return (node);
}

function	rep_subsection_title(sect, item)
{
    let node = {
	"comment": null,
	"visible": true,
	"type": "subsection-title",
	"text":report_temp.resources[0].sections[sect].items[item].text,
    };
    return (node);
}

function	rep_question_answer(sect, item)
{
    let rep = findquestion(report_temp.resources[0].sections[sect].items[item].question.resource);
    let visibility = true;
    if ($('div [value="' + report_temp.resources[0].sections[sect].items[item].question.resource + '"] > div:eq(0)').hasClass("darken"))
	visibility = false;
    let comment = null;
    if ($('div [value="' + report_temp.resources[0].sections[sect].items[item].question.resource + '"] > input').val() != null)
	comment = $('div [value="' + report_temp.resources[0].sections[sect].items[item].question.resource + '"] > input').val();
    let node = {
	"comment": comment,
	"visible": visibility,
	"type": "question-answer",
	"question": {"resource": report_temp.resources[0].sections[sect].items[item].question.resource},
	"label": questions.sections[rep[0]].questions[rep[1]].text,
	"responseSpec": {"type": questions.sections[rep[0]].questions[rep[1]].type},
	"answer": null,
    };
    if ((node.answer = get_answer(report_temp.resources[0].sections[sect].items[item].question.resource)) == undefined)
	node.answer = null;
    if (node.responseSpec.type == "1Choice" || node.responseSpec.type == "nChoices") //textarea: nothing to do
    {
	node.responseSpec.options = questions.sections[rep[0]].questions[rep[1]].typeOptions.options;
    }
    else if (node.responseSpec.type == "nMTexts" || node.responseSpec.type == "nMLongTexts")
    {
	node.responseSpec.type = questions.sections[rep[0]].questions[rep[1]].type;
	node.responseSpec.rowLabels = questions.sections[rep[0]].questions[rep[1]].typeOptions.rowLabels;
	node.responseSpec.columnLabels = questions.sections[rep[0]].questions[rep[1]].typeOptions.columnLabels;
    }
    return (node);
}

function	rep_chart(sect, item)
{
    let visibility = true;
    let comment = null;
    let node = { // globalVariables[official_glbvariable_name(data.xVariable)]
	"comment": comment,
	"dataSeriesValues": [globalVariables[report_temp.resources[0].sections[sect].items[item].dataSeries[0].list]],
	"dataSeriesNames": [report_temp.resources[0].sections[sect].items[item].dataSeries[0].name],
	"dataSeriesColors": [report_temp.resources[0].sections[sect].items[item].dataSeries[0].color],
	"title": report_temp.resources[0].sections[sect].items[item].title,
	"valueDisplayType": report_temp.resources[0].sections[sect].items[item].valueDisplayType,
	"visible": visibility,
	"type": "chart",
	"chartType": report_temp.resources[0].sections[sect].items[item].chartType,
	"labels": report_temp.resources[0].sections[sect].items[item].labels,
	"labelColors": report_temp.resources[0].sections[sect].items[item].labelColors,
	"options": report_temp.resources[0].sections[sect].items[item].options
    };

    if (typeof(node.dataSeriesValues[0]) == "undefined" || report_temp.resources[0].sections[sect].items[item].dataSeries[0].variables != undefined)
    {
	console.log(report_temp.resources[0].sections[sect].items[item].dataSeries[0]);
	if (report_temp.resources[0].sections[sect].items[item].dataSeries[0].variables != null)
	    {
		let lel = [];
		for (let i = 0; report_temp.resources[0].sections[sect].items[item].dataSeries[0].variables[i] != null; ++i)
		{

		    lel[i] = globalVariables[report_temp.resources[0].sections[sect].items[item].dataSeries[0].variables[i]];
		}
		node.dataSeriesValues[0] = lel
	    }
    }
    return (node)
}

function	rep_smiley_rank(sect, item)
{
    let comment = null;
    let node = {
	"variableName": report_temp.resources[0].sections[sect].items[item].variable,
	"value": globalVariables[report_temp.resources[0].sections[sect].items[item].variable],
	"label": report_temp.resources[0].sections[sect].items[item].label,
	"comment": comment,
	"visible": true,
	"type": "line-jump",
    };
    return (node);
}
