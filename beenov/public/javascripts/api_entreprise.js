function	new_entreprise_request_api(siret, data)
{

    function	fill_entreprise(api_data)
    {

	function	fill_adresse(adr) {
	    return (adr.numero_voie + " " + adr.type_voie + " " + adr.nom_voie);}

	function        get_date(timestamp)
	{
	    let day = new Date(timestamp);
	    console.log(day);
	    let dd = day.getDate();
	    let mm = day.getMonth() + 1;
	    let yyyy = day.getFullYear();
	    console.log("======\n======");
	    console.log(dd);
	    console.log(mm);
	    console.log(yyyy);
	    console.log("======\n======");
	    if(dd<10)
		dd = '0'+dd
	    if(mm<10)
		mm = '0'+mm
	    console.log(dd);
	    console.log(mm);
	    console.log(yyyy);
	    return(dd + '/' + mm + '/' + yyyy);
	}

	console.log(api_data);
	console.log(api_data.entreprise);
	$('#2').val(api_data.entreprise.raison_sociale);
	$('#3').val(api_data.entreprise.siret_siege_social);
	$('#0nTexts4').val(api_data.entreprise.mandataires_sociaux[0].nom);
	$('#1nTexts4').val(api_data.entreprise.mandataires_sociaux[0].prenom);
	$('#5').val(api_data.entreprise.mandataires_sociaux[0].date_naissance.split('-')[0]);
	$('#7').val(fill_adresse(api_data.etablissement_siege.adresse));
	$('#8').val(api_data.etablissement_siege.adresse.localite);
	$('#9').val(api_data.etablissement_siege.adresse.code_postal);
	$('#16').val(get_date(api_data.entreprise.date_creation));
	$('#18').val(api_data.etablissement_siege.naf);
    }

    
    function	get_siren(siret)
    {
	let siren = "";
	for (let i = 0; i < 9; ++i)
	{
	    siren += siret[i]
	}
	return (siren);
    }

    
    $.ajax({
	type: 'GET',
	url: "/api_entreprise?siren=" + get_siren(siret),
	success: function(body, status, XHR)
	{
	    console.log(body);
	    console.log("\n\n");
	    console.log(JSON.parse(body));	    
	    let cookie = {theme: getParameterByName("theme", window.location.href),
			  company: JSON.parse(body).entreprise.nom_commercial,
			  advisor: getCookie("username"),
			  quest: getParameterByName("questionnaire", window.location.href)}
	    document.cookie = "infomet=" + JSON.stringify(cookie); 
	    let answers = undefined;
	    let toAppend = [];
	    let i = 0;
	    while(data.sections[i] != undefined)
	    {
		j = 0;
		toAppend.push('<br /><b>' + data.sections[i].title + '</b>');
		while (data.sections[i].questions[j] != undefined)
		{
		    toAppend = toAppend.concat(append_question(data.sections[i].questions[j], answers, "quest"));
		    ++j;
		}
		++i;
	    }
	    $('#questionnairecmpn').append(toAppend);
	    fill_entreprise(JSON.parse(body));
	    Set_plugins();
	}
    });
}
