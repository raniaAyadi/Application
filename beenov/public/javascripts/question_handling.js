var     questionnaire_data = { text: [],
			       textarea: [],
			       /* 1Choice */	       radios: [],
			       /* nChoices */	       checkboxes: [],
			       nTexts: [],
			       nMTexts: [],
			       nMLongTexts: [],
			       n1Choice: [],
			       matrix: [],
			       city: [],
					 groupableComment: [] };

var     company_data = { text: [],
			 textarea: [],
			 /* 1Choice */	       radios: [],
			 /* nChoices */	       checkboxes: [],
			 nTexts: [],
			 nMTexts: [],
			 nMLongTexts: [],
			 n1Choice: [],
			 matrix: [],
			 city: [],
		 groupableComment: [] };

var city_state = 0;

var	mandatories = { texts: [],
			/* 1Choice */	       radios: [],
			/* nChoices */	       checkboxes: [],
			nTexts: [],
			n1Choice: []};

var	mandatories_company = { texts: [],
				/* 1Choice */	       radios: [],
				/* nChoices */	       checkboxes: [],
				nTexts: [],
				n1Choice: []};

var	display = [];

var is_mandatory_not_fill = 0;

function	check_mandatories(e)
{
    let list;

    // if (e == undefined)
    // {
    // 	console.log("wut");
    // 	list = mandatories_company;
    // }
    // else
	list = mandatories;
    is_mandatory_not_fill = 0;
    function	button_save()
    {
			console.log("button_save");
	let state = -1;
	const data = ['#savequest', '#save', '#companysave'];
	if (window.location.pathname == "/company")
	    state = 0;
	else if (window.location.pathname == "/questionnaire")
	    state = 1;
	if (state == -1)
	    return;
	if (is_mandatory_not_fill > 0)
	    $(data[state]).attr('disabled', "");
	else if (is_mandatory_not_fill == 0)
	    $(data[state]).removeAttr('disabled');
    }

    function	check_inputs(tmp)
    {
	if (tmp.val().length == 0)
	{
	    ++is_mandatory_not_fill;
	    tmp.addClass("redinput");
	}
	else if (tmp.hasClass("redinput") == true)
	{
	    tmp.removeClass("redinput");
	}
    }

    function	check_radios(tmp, id)
    {
	if (isNaN(parseInt(tmp.val())) == true)
	{
	    ++is_mandatory_not_fill;
	    $('input[name=' + id + ']').addClass("redinput");
	}
	else if (tmp.hasClass("redinput") == true)
	{
	    $('input[name=' + id + ']') .removeClass("redinput");
	}
    }

    if (list.texts.length > 0)
    {
	for (let i = 0; list.texts[i] != undefined; ++i) {
	    let tmp = $('#' + list.texts[i]);
	    check_inputs(tmp);
	}
    }
    if (list.nTexts.length > 0)
    {
	for (let i = 0; list.nTexts[i] != undefined; ++i) {
	    for (let j = 0; j < list.nTexts[i].length; ++j) {
		let tmp = $('#' + j + list.nTexts[i].id);
		check_inputs(tmp);
	    }
	}
    }
    if (list.radios.length > 0)
    {
	for (let i = 0; list.radios[i] != undefined; ++i) {
	    let tmp = $('input[name=' + list.radios[i] + ']:checked');
	    check_radios(tmp, list.radios[i]);
	}
    }
    if (list.n1Choice.length > 0)
     {
	for (let i = 0; list.n1Choice[i] != undefined; ++i) {
	    for (let j = 0; j < list.n1Choice[i].length; ++j) {
		let tmp = $('input[name=' + j + 'n1Choice' + list.n1Choice[i].id + ']:checked');
		check_radios(tmp, list.n1Choice[i].id);
 	    }
 	}
     }
    if (list.checkboxes.length > 0)
    {
 	let count;
	for (let i = 0; list.checkboxes[i] != undefined; ++i) {
 	    count = 0;
	    for (let j = 0; j < list.checboxes[i].length; ++j) {
		let tmp = $('input[name=' + j + 'check' + list.checkboxes[i].id);
 		if (tmp.is('checked'))
 		    count++
 	    }
	    if (count == 0) {
		++is_mandatory_not_fill;
		tmp.addClass("redinput");
	    }
	    else if (tmp.hasClass("redinput") == true)
		tmp.removeClass("redinput");
	}
    }
    button_save();
}

function	citycheck(e)
{
    let id = e.target.id.split('-')[1];
    if (e.target.checked == true)
    {
	console.log("remove");
	$('#cityinput-' + id).removeClass("city");
    }
    else
    {
	console.log("add");
	$('#cityinput-' + id).addClass("city");
    }
}

function	cityclose_button_event(e)
{
    let id = e.target.id.split('-')[1];
    $('#citylist-' + id).remove();
    $('#cityclose-' + id).remove();
    $('#cityinput-' + id).prop('disabled', false);
}

function	check_input_city(e)
{

    function	input_city_get_datalist(value, id)
    {
	    $.ajax({
		type: "GET",
		url: "https://geo.api.gouv.fr/communes?fields=code,nom&codePostal=" + value,
		error: function(json)
		{
		    console.log("API GOUV FAILED");
		},
		success: function(json)
		{
		    console.log("SUCCESS");
		    // if ($.isEmptyObject(json) == true)
		    // 	return;
		    let list = [];
		    if ($.isEmptyObject(json) == false)
			$('#' + id).append('<select city="true" id="citylist-' + id + '"></select><button  id="cityclose-' + id + '" type="button" class="cityclose">&#10006</button>');
		    console.log($('#citylist-' + id));
		    for(let i = 0; json[i] != undefined; ++i)
		    {
			console.log(i);
			$('#citylist-' + id).append('<option value="' + json[i].code + ',' + value + '">' + value + ' (' + json[i].nom + ')' + '</option>');
			$('#cityinput-' + id).prop('disabled', true);
		    }

				(function(){
					var input = document.querySelector("input[city='true']");
					if(input) input.remove();
					var select = document.querySelector("select[city='true']");
					var close = document.querySelector("button[class='cityclose']");

					if(close && select){
						close.onclick = ()=>{
							var div = select.parentElement;
							div.append(input);
						}
					}
					/*if(select){
						//input.value = select.options[0].innerText
						select.onchange = ()=>input.value = select.options[select.selectedIndex].innerText;
					}*/
				})();
		}
	    });
    }


    function	is_num(value) {
	let i = 0;
	while (i < value.length)
	{
	    if (value.charCodeAt(i) < 48 || value.charCodeAt(i) > 57) {
		return (false);
	    }
	    ++i;
	}
	return (true);
    }

    if (e.currentTarget.value.length == 4)
    {
	if (is_num(e.currentTarget.value + e.originalEvent.key) == true)
	    input_city_get_datalist(e.currentTarget.value + e.originalEvent.key, e.target.id.split('-')[1]);
    }
}


function        check_input_monetary(e)
{
    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
	(e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) || // Allow: Ctrl+A
	(e.keyCode == 67 && (e.ctrlKey === true || e.metaKey === true)) || // Allow: Ctrl+C
	(e.keyCode == 88 && (e.ctrlKey === true || e.metaKey === true)) ||   // Allow: Ctrl+A
	(e.keyCode >= 35 && e.keyCode <= 39) || // Allow: home, end, left, right
	((e.shiftKey && (e.keyCode >= 48 && e.keyCode <= 57)) || (e.keyCode >= 96 && e.keyCode <= 105)) || e.keyCode == 188)//Allow numbers and numbers + shift key
	{// let it happen, don't do anything
		return;
	}// Ensure that it is a number and stop the keypress
    if ((!e.shiftKey && (e.keyCode < 48 || e.keyCode > 57)) || (e.keyCode < 96 || e.keyCode > 105) || e.keyCode == 188)
    {
	e.preventDefault();
    }
}

function        check_input_numeric(e) /* type de text pris en charge : numeric, percent, zipcode, siret */
{
    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
	(e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) ||
	(e.keyCode == 67 && (e.ctrlKey === true || e.metaKey === true)) ||
	(e.keyCode == 88 && (e.ctrlKey === true || e.metaKey === true)) ||
	(e.keyCode >= 35 && e.keyCode <= 39) ||
	((e.shiftKey && (e.keyCode >= 48 && e.keyCode <= 57)) || (e.keyCode >= 96 && e.keyCode <= 105)))
    {
	return;
    }
    if ((!e.shiftKey && (e.keyCode < 48 || e.keyCode > 57)) || (e.keyCode < 96 || e.keyCode > 105))
    {
	e.preventDefault();
    }
}

function	question_type_porterMatrix(question, answers)
{
    function	create_1Choice_matrix(list, answer, pos, id)
    {
	let radios;

	radios = '<br /><input type="radio" name="' + id + 'matrix' + pos + '" value="0|' + list[0] + '" ';
	if (answer != null && answer == 0)
	    radios += "checked";
	radios += '> &nbsp' + list[0]  + '</input>';

	radios += '<br /><input type="radio" name="' + id + 'matrix' + pos + '" value="1|' + list[1] + '" ';
	if (answer != null && answer == 1)
	    radios += "checked";
	radios += '> &nbsp' + list[1] + '</input>';

	radios += '<br /><input type="radio" name="' + id + 'matrix' + pos + '" value="2|' + list[2] + '" ';
	if (answer != null && answer == 2)
	    radios += "checked";
	radios += '> &nbsp' + list[2] + '</input>';

	return (radios);
    }

    questionnaire_data.matrix.push(question.id);
    let matrix_answer = undefined;
    let matrix_html;
    if (answers != undefined)
    {
	for (let j = 0; answers[j] != undefined; ++j)
	{
	    if (answers[j].question.resource.split('/')[1] == question.id)
	    {
		matrix_answer = [answers[j].answer[0], answers[j].answer[2], answers[j].answer[4], answers[j].answer[6], answers[j].answer[8]];
		console.log(matrix_answer);
		break;
	    }
	}

    }

		console.log(matrix_html);
    matrix_html = "<table><tr><td></td><td>Comment ressentez-vous la menace des nouveaux entrants ?</td><td></td></tr>";
    /* 1ere question */
    matrix_html += "<tr><td></td><td>" + create_1Choice_matrix(["Les barrières à l'entrée sont élevées (techniques ; financières ; culturelles ; juridique ; normatives)",
								"le produit est peu différencié ou bien les techniques de fabrication sont plutôt conventionnelles",
								"Il n\'y a pas de berrières à l'entrée ; le produit est basique et les savoir-faire sont facilement accessibles"], matrix_answer != undefined ? matrix_answer[0] : null, 0, question.id) + "</td><td></td></tr>";

    matrix_html += "<tr><td>Comment ressentez-vous le pouvoir de négociation des fournisseurs ?</td><td>Comment ressentez-vous l'intensité de la concurence directe ?</td><td>Comment ressentez-vous le pouvoir de négociation des clients ?</td></tr>";
    /* 2eme question */
    matrix_html += "<tr><td>" + create_1Choice_matrix(["L\'offre des fournisseurs est peu différenciée (ou bien : le poids des achats dans le coût du produit est faible)",
								"Les fournisseurs sont en mesure de nous dicter leurs conditions en terme de prix, délai, etc...",
						       "Certains de nos fournisseurs essaient de se débarrasser de nous (ou bien : deviennent des concurrents)"], matrix_answer != undefined ? matrix_answer[1] : null, 1, question.id);
    /* 3eme question */
    matrix_html += "</td><td>" + create_1Choice_matrix(["les concurents sont peu agressifs car atomisés et/ou cette activité n'est pas essentielle pour eux",
								"Les concurrents sont peu agressif sur prix, délai, etc... Sans pour autant innover spécialement",
							"Les concurents sont nombreux et agressif ; certains d'entre eux ont une offre différenciée"], matrix_answer != undefined ? matrix_answer[2] : null, 2, question.id);
    /* 4eme question */
    matrix_html += "</td><td>" + create_1Choice_matrix(["les clients sont plutôt (voir \"très\") dépendant de nos produits et savoir-faire (protégés le cas échéant)",
								"Les clients fondent leur décision d'acaht essnetiellement sur les critères prix, délai, etc...",
								"Certains de nos clients nous font de plus en plus d'infidélités (ou bien : deviennent des concurrents)"], matrix_answer != undefined ? matrix_answer[3] : null, 3, question.id) + "</td></tr>";

    matrix_html += "<tr><td></td><td>Comment ressentez-vous la menace de produits et/ou services de substitution ?</td><td></td></tr>";
    /* 5eme question */
    matrix_html += "<tr><td></td><td>" + create_1Choice_matrix(["les clients sont plutôt (voir \"très\") dépendant de nos produits et savoir-faire (protégés le cas échéant)",
								"Les clients fondent leur décision d'acaht essnetiellement sur les critères prix, délai, etc...",
								"Certains de nos clients nous font de plus en plus d'infidélités (ou bien : deviennent des concurrents)"], matrix_answer != undefined ? matrix_answer[4] : null, 4, question.id) + "</td><td></td></tr></table>";
		return (matrix_html);
}

function	question_type_city(question, answers, type) //Pas de prise en compte de ce type de question par la BDD
{
	var ok = false;
    if (type == "quest")
	questionnaire_data.city.push({ id: question.id, rules: question.rules });
    else if (type == "company")
	company_data.city.push({ id: question.id, rules: question.rules });
    function	is_insee(insee) {
	if (insee[2] == '0' && insee[3] == '0' && insee[4] == '0')
	    return (false)
	return (true);
    }

    let balise;
    let city_answer;
    if (answers != undefined)
    {
	for (let j = 0; answers[j] != undefined; ++j)
	{
	    if (answers[j].question.resource.split('/')[1] == question.id)
	    {
		city_answer = answers[j].answer;
		var ok = true;
		break;
	    }
	}
    }
    balise += '<div id="' + question.id + '">CEDEX ? <input type="checkbox" id="citycheck-' + question.id + '" class="citycheck" ';


		/*if (city_answer != undefined && is_insee(city_answer.split(',')[0]) == false)
    {
	balise += 'checked></input><br /><input type="text" id="cityinput-' + question.id + '" maxlength="5" class="numeric" list="citylist-' + question.id + '" autocomplete="off"></div>';
    }
    else if (city_answer != undefined && is_insee(city_answer.split(',')[0]) == true)
    {
	balise += '><br /><input type="text" ' + 'id="cityinput-' + question.id + '" class="city numeric" maxlength="5" list="citylist-' + question.id + '" autocomplete="off" value="' + city_answer.split(';')[1]  + '" disabled>' + '<select city="true" id="citylist-' + question.id + '">' + '<option value="' + city_answer + '">' + city_answer.split(';')[1] + ' (' + city_answer.split(';')[2] + ')' + '</option>'  + '</select><button  id="cityclose-' + question.id + '" type="button" class="cityclose">&#10006</button>' + '</div>';
    }
    else
    {*/
			console.log("undefined city");
			if(ok)
			var valueOk = city_answer.split(',')[1];
			else {
				var valueOk = "";
			}
	balise += '><br /><input city="true" type="text" value="' + valueOk +  '" id="cityinput-' + question.id + '" class="city numeric" maxlength="5" list="citylist-' + question.id +  '" autocomplete="off"></div>';
    //}

    return (balise);
}

function        question_type_nChoices(question, toReturn, answers, type)
{
    let i = 0;
    let choice_answer = undefined;
    if (answers != undefined)
    {
	for (let j = 0; answers[j] != undefined; ++j)
	{
	    if (answers[j].question.resource.split('/')[1] == question.id)
	    {
		choice_answer = answers[j].answer;
		break;
	    }
	}
    }
    if (question.typeOptions.options != undefined)
    {
	while (question.typeOptions.options[i] != undefined)
	{
	    let balise = '<br /><input type="checkbox" value="' + (i + 1) + '" name ="' + i + 'check'  + question.id + '" ';
	    if (choice_answer != undefined)
	    {
		for (let k = 0; choice_answer[k] != undefined; ++k)
		{
		    if (choice_answer[k] == (i + 1))
			balise += 'checked';
		}
	    }
	    balise += '> ' + question.typeOptions.options[i];
	    ++i;
	    toReturn.push(balise);
	}
    }
    if (type == "quest")
	questionnaire_data.checkboxes.push({ id: question.id, length: i, rules: question.rules });
    else if (type == "company")
	company_data.checkboxes.push({ id: question.id, length: i, rules: question.rules });
    if (question.mandatory == true && type == "quest")
	mandatories.checkboxes.push({id: question.id, length: i});
    else if (question.mandatory == true && type == "company")
	mandatories_company.checkboxes.push({id: question.id, length: i});
    return(toReturn);
}

function        question_type_n1Choice(question, toReturn, answers, type)
{
    let choice_answer = undefined;
    if (answers != undefined)
    {
	for (let i = 0; answers[i] != undefined; ++i)
	{
	    if (answers[i].question.resource.split('/')[1] == question.id)
	    {
		choice_answer = answers[i].answer;
		break;
	    }
	}
    }
    toReturn.push('<table id="' + question.id + '">', '<tr>','<th></th>');
    for (let i = 0; i < question.typeOptions.columnLabels.length; ++i)
    {
	toReturn.push('<th>' + question.typeOptions.columnLabels[i] + '</th>');
    }
    let k;
    toReturn.push('</tr>');
    for (k = 0; k < question.typeOptions.rowLabels.length; ++k)
    {
	toReturn.push('<tr>');
	for (let j = 0; j < question.typeOptions.columnLabels.length + 1; ++j)
	{
	    if (j == 0)
	    {
		if (question.typeOptions.rowLabels[k] == "")
		{
		    toReturn.push('<th></th>');
		}
		else
		{
		    toReturn.push('<th>' + question.typeOptions.rowLabels[k] + '</th>');
		}
	    }
	    else
	    {
		let balise = '<td><input type="radio" name="' + k + 'n1Choice' + question.id + '" value="' + j + '"';
		if (choice_answer != undefined && parseInt(choice_answer[k]) == j)
		{
		    balise += 'checked></td>';
		}
		else
		{
		    balise += '></td>';
		}
		toReturn.push(balise);
	    }
	}
	toReturn.push('</tr>')
    }
    if (type == "quest")
	questionnaire_data.n1Choice.push({ id: question.id, length: k, rules: question.rules });
    else if (type == "company")
	company_data.n1Choice.push({ id: question.id, length: k, rules: question.rules });
    if (question.mandatory == true && type == "quest")
	mandatories.n1Choice.push({id: question.id, length: k});
    else if (question.mandatory == true && type == "company")
	mandatories_company.n1Choice.push({id: question.id, length: k});
    toReturn.push('</table>');
    return (toReturn);
}

function        question_type_nMLongTexts(question, toReturn, answers, type)
{
    let nMLongTexts_answer = undefined;
    if (answers != undefined)
    {
	for (let i = 0; answers[i] != undefined; ++i)
	{
	    if (answers[i].question.resource.split('/')[1] == question.id)
	    {
		nMLongTexts_answer = answers[i].answer;
		break;
	    }
	}
    }
    toReturn.push('<table id="' + question.id + '">', '<tr>','<th></th>');
    for (let i = 0; i < question.typeOptions.columnLabels.length; ++i)
    {
	toReturn.push('<th>' + question.typeOptions.columnLabels[i] + '</th>');
    }

    toReturn.push('</tr>');
    let k = 0;
    for (let i = 0; i < question.typeOptions.rowLabels.length; ++i)
    {
	toReturn.push('<tr>');
	for (let j = 0; j < question.typeOptions.columnLabels.length + 1; ++j)
	{
	    if (j == 0)
	    {
		if (question.typeOptions.rowLabels[i] == "")
		{
		    toReturn.push('<th></th>');
		}
		else
		{
		    toReturn.push('<th>' + question.typeOptions.rowLabels[i] + '</th>');
		}
	    }
	    else
	    {
		let balise = '<td><textarea id="' + k + 'nMLongTexts' + question.id + '" class="LTexts" rows="5">';
		if (nMLongTexts_answer != undefined)
		{
		    if(nMLongTexts_answer[k] != null)
			balise += nMLongTexts_answer[k];
		}
		k++;
		balise += '</textarea></td>';
		toReturn.push(balise);
	    }
	}
	toReturn.push('</tr>')
    }
    if (type == "quest")
	questionnaire_data.nMLongTexts.push({ id: question.id, length: k, rules: question.rules});
    else if (type == "company")
	company_data.nMLongTexts.push({ id: question.id, length: k, rules: question.rules});
    if (question.mandatory == true && type == "quest")
	mandatories.nTexts.push({id: "nMLongtexts" + question.id, length: k});
    else if (question.mandatory == true && type == "company")
	mandatories_company.nTexts.push({id: "nMLongtexts" + question.id, length: k});
    toReturn.push('</table>');
    return (toReturn);
}

function        question_type_nMTexts(question, toReturn, answers, type)
{
    let nMTexts_answer = undefined;
    if (answers != undefined)
    {
	for (let i = 0; answers[i] != undefined; ++i)
	{
	    if (answers[i].question.resource.split('/')[1] == question.id)
	    {
		nMTexts_answer = answers[i].answer;
		break;
	    }
	}
    }
    toReturn.push('<table id="' + question.id + '">', '<tr>','<th></th>');
    for (let i = 0; i < question.typeOptions.columnLabels.length; ++i)
    {
	toReturn.push('<th>' + question.typeOptions.columnLabels[i] + '</th>');
    }

    toReturn.push('</tr>');
    let k = 0;
    for (let i = 0; i < question.typeOptions.rowLabels.length; ++i)
    {
	toReturn.push('<tr>');
	for (let j = 0; j < question.typeOptions.columnLabels.length + 1; ++j)
	{
	    if (j == 0)
	    {
		if (question.typeOptions.rowLabels[i] == "")
		{
		    toReturn.push('<th></th>');
		}
		else
		{
		    toReturn.push('<th>' + question.typeOptions.rowLabels[i] + '</th>');
		}
	    }
	    else
	    {
		let balise = '<td><input type="text" id="' + k  + 'nMTexts' + question.id + '" ';
		if (nMTexts_answer != undefined)
		{
		    if (nMTexts_answer[k] != null)
			balise += 'value="' + nMTexts_answer[k] + '"';
		}
		k++;
		balise += '></td>';
		toReturn.push(balise);
	    }
	}
	toReturn.push('</tr>')
    }
    if (type == "quest")
	questionnaire_data.nMTexts.push({ id: question.id, length: k, rules: question.rules});
    else if (type == "company")
	company_data.nMTexts.push({ id: question.id, length: k, rules: question.rules});
    if (question.mandatory == true && type == "quest")
 	mandatories.nTexts.push({id: "nMTexts" + question.id, length: k});
    else if (question.mandatory == true && type == "company")
	mandatories_company.nTexts.push({id: "nMTexts" + question.id, length: k});
    toReturn.push('</table>');
    return (toReturn);
}

function        question_type_nTexts(question, toReturn, answers, type)
{
    let i = 0;
    let nTexts_answer = undefined;
    let balise;
    if (answers != undefined)
    {
	for (let j = 0; answers[j] != undefined; ++j)
	{
	    if (answers[j].question.resource.split('/')[1] == question.id)
	    {
		nTexts_answer = answers[j].answer;
		break;
	    }
	}
    }
    while (question.typeOptions.textLabels[i])
    {
	balise = '<br />' + question.typeOptions.textLabels[i] + '<br /><input id ="' + i + 'nTexts' + question.id  + '" type="text" class ="' + question.typeOptions.textTypes[i] + '"'
	if (nTexts_answer != undefined)
	{
	    if (nTexts_answer[i] != null)
		balise += 'value="' + nTexts_answer[i] + '"';
	}
	balise += '>';
	toReturn.push(balise);
	++i;
    }
    if (type == "quest")
	questionnaire_data.nTexts.push({id: question.id, length: i, rules: question.rules});
    else if (type == "company")
	company_data.nTexts.push({id: question.id, length: i, rules: question.rules});
    if (question.mandatory == true && type == "quest")
 	mandatories.nTexts.push({id: "nTexts" + question.id, length: i});
    else if (question.mandatory == true && type == "company")
	mandatories_company.nTexts.push({id: "nTexts" + question.id, length: i});
    return (toReturn);
}

function        question_type_text(question, answers, type)
{

    let balise;
    if (type == "quest")
	questionnaire_data.text.push({id: question.id, rules: question.rules});
    else if (type == "company")
	company_data.text.push({id: question.id, rules: question.rules});
    if (question.mandatory == true && type == "quest")
 	mandatories.texts.push(question.id);
    else if (question.mandatory == true && type == "company")
	mandatories_company.texts.push(question.id);

	if(question.typeOptions.textType === "numeric" || question.typeOptions.textType === "monetary"
|| question.typeOptions.textType === "percent"){
		balise = '<br /><input id ="' + question.id  + '" type="number" class="controle" ';
	}
	else if (question.typeOptions.textType === "url") {
balise = '<br /><input id ="' + question.id  + '" type="url" pattern="https://*.*" class="controle" ';
	}

	else if(question.typeOptions.textType === "email"){
balise = '<br /><input id ="' + question.id  + '" type="email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" class="controle" ';
	}

	else if (question.typeOptions.textType === "phone") {
		balise = '<br /><input id ="' + question.id  + '" type="tel" pattern="[0-9]{10}" class="controle" ';
	}

	else if(question.typeOptions.textType === "siret"){
		balise = '<br /><input id ="' + question.id  + '" type="text" siret="true" pattern="[0-9]{14}" class="controle" ';
	}

	else if(question.typeOptions.textType === "zipcode"){
		balise = '<br /><input id ="' + question.id  + '" type="text" pattern="[0-9]{5}" class="controle" ';
	}

	else if(question.typeOptions.textType === "naf"){
		balise = '<br /><input id ="' + question.id  + '" type="text" pattern="[0-9]{4}[A-Z]" class="controle" ';
	}

	else {

	balise = '<br /><input id ="' + question.id  + '" type="text" class="' + question.typeOptions.textType + '" ';
}
    if (question.typeOptions.maxLength != undefined)
    {
	balise += 'maxlength="' + question.typeOptions.maxLength + '" ';
    }
    if (answers != undefined)
    {
	for (let i = 0; answers[i] != undefined; ++i)
	{
	    if (answers[i].question.resource.split('/')[1] == question.id)
	    {
		if (answers[i].answer != null)
		    balise += 'value="' + answers[i].answer + '"';
		break;
	    }
	}
    }
    balise += '>'
    if (question.typeOptions.textType == "percent")
	balise += ' %';

		return (balise);
}

function        question_type_1Choice(question, toReturn, answers, type)
{
    let i = 0;
    let choice_answer = undefined;
    if (type == "quest")
	questionnaire_data.radios.push({id: question.id, rules: question.rules});
    else if (type == "company")
	company_data.radios.push({id: question.id, rules: question.rules});
    if (question.mandatory == true && type == "quest")
 	mandatories.radios.push(question.id);
    else if (question.mandatory == true && type == "company")
	mandatories_company.radios.push(question.id);
    if (answers != undefined)
    {
	for (let j = 0; answers[j] != undefined; ++j)
	{
	    if (answers[j].question.resource.split('/')[1] == question.id)
	    {
		choice_answer = answers[j].answer;
		break;
	    }
	}
    }
    if (question.typeOptions.options != undefined)
    {
	while (question.typeOptions.options[i] != undefined)
	{
	    let balise = '<br /><input type="radio" value="' + (i + 1) + '" name ="' + question.id + '" ';
	    if (choice_answer != undefined && parseInt(choice_answer) == (i + 1))
		balise += 'checked>';
	    else
		balise += '>';
	    balise += ' ' + question.typeOptions.options[i];
	    ++i;
	    toReturn.push(balise);
	}
    }

  return(toReturn);

}

function question_type_groupableComment(question, answers , type) {
	let balise = '<br /><textarea id="' + question.id + '"class="comment">';

	if (type == "quest")
questionnaire_data.groupableComment.push({id: question.id, rules: question.rules});
	else if (type == "company")
company_data.groupableComment.push({id: question.id, rules: question.rules});
	if (question.mandatory == true && type == "quest")
mandatories.texts.push(question.id);
	else if (question.mandatory == true && type == "company")
mandatories_company.texts.push(question.id);
	if (answers != undefined)
	{
for (let i = 0; answers[i] != undefined; ++i)
{
		if (answers[i].question.resource.split('/')[1] == question.id)
		{
	if (answers[i].answer != "null")
			balise += answers[i].answer;
	break;
		}
}
	}
	balise += '</textarea>';
	return (balise);
}


function	question_type_textarea(question, answers, type)
{
    let balise = '<br /><textarea id="' + question.id + '"class="wysiwyg editeur">';

    if (type == "quest")
	questionnaire_data.textarea.push({id: question.id, rules: question.rules});
    else if (type == "company")
	company_data.textarea.push({id: question.id, rules: question.rules});
    if (question.mandatory == true && type == "quest")
	mandatories.texts.push(question.id);
    else if (question.mandatory == true && type == "company")
	mandatories_company.texts.push(question.id);
    if (answers != undefined)
    {
	for (let i = 0; answers[i] != undefined; ++i)
	{
	    if (answers[i].question.resource.split('/')[1] == question.id)
	    {
		if (answers[i].answer != "null")
		    balise += answers[i].answer;
		break;
	    }
	}
    }
    balise += '</textarea>';
    return (balise);
}

function	append_question(question, answers, type)
{
    let toReturn = [];
    if (question.displayCondition != null)
    {
	display.push({'id' : question.id, 'condition': question.displayCondition.expression[1]});
	toReturn.push('<div id="display-' + question.id + '" hidden="">');
    }
		console.log(question.text);
    toReturn.push('<br /><label>'+ question.text + '</label>');
		if (question.helpText)
		toReturn.push('<br/> <span class="title">' +question.helpText+ '</span>');
    if (question.type == "text")
    {
	toReturn.push(question_type_text(question, answers, type));

    }
    else if (question.type == "textarea")
    {
	toReturn.push(question_type_textarea(question, answers, type));
    }
    else if (question.type == "1Choice")
    {
	toReturn = question_type_1Choice(question, toReturn, answers, type);
    }
    else if (question.type == "nTexts")
    {
	toReturn = question_type_nTexts(question, toReturn, answers, type);
    }
    else if (question.type == "nMTexts")
    {
	toReturn = question_type_nMTexts(question, toReturn, answers, type);
    }
    else if (question.type == "nMLongTexts")
    {
	toReturn = question_type_nMLongTexts(question, toReturn, answers, type);
    }
    else if (question.type == "n1Choice")
    {
	toReturn = question_type_n1Choice(question, toReturn, answers, type);
    }
    else if (question.type == "nChoices")
    {
	toReturn = question_type_nChoices(question, toReturn, answers, type);
    }
    else if (question.type == "porterMatrix")
    {
	toReturn.push(question_type_porterMatrix(question, answers, type));
    }
		else if (question.type == "groupableComment") {
	toReturn.push(question_type_groupableComment(question , answers , type));
		}
		// else if (question.type == "cfa"){
		//
		// }
    else if (question.type == "city")
    {
	toReturn.push(question_type_city(question, answers, type));
    }
    else
	toReturn.push("");
    if (question.displayCondition != undefined)
	toReturn.push('</div>');
    return (toReturn);
}
