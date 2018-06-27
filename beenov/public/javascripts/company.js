var	globalVariables = {};
var	questionnaire_reply;
var	questionnaire_id;
var	main_rules;

function	show_questionnaire(data)
{
    let	toAppend = [];
    let	i = 0;
    let	j;

    console.log(data);
    questionnaire_id = data.id;
    $.ajax({
	type: "GET",
	url: 'info-entreprise?siret="' + getParameterByName("siret", window.location.href) + '"',
	datatype: "json",
	success: function(json)
	{
	    if (json.status == "new")
	    {
		is_new_entreprise = true;
		new_entreprise_request_api(getParameterByName("siret", window.location.href), data);
		return;
	    }
	    else
	    {
		      let cookie = {theme: getParameterByName("theme", window.location.href),
			      company: json.resources[0].companyName,
			      advisor: getCookie("username"),
			      quest: getParameterByName("questionnaire", window.location.href)}
		document.cookie = "infomet=" + JSON.stringify(cookie); 
		questionnaire_reply = json;
		let answers = json.resources[0].questionAnswers;
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
	    }
	    console.log(toAppend);
	    $('#questionnairecmpn').append(toAppend);
	    Set_plugins();
	}
    });
}

$(document).ready(function()
		  {
		      $.ajax({
			  type: "GET",
			  url: "questionnaire-entreprise",
			  datatype: "json",
			  success: show_questionnaire
		      });

		      $('#btninputfile').on('click', function()
					    {
						$('#inputfile').click();
					    });
		      
		      $("#inputfile").change(function()
					     {
						 readURL(this);
					     });
		      $('#questionnairecmpn').on('keydown', '.city' ,check_input_city);
		      $('#questionnairecmpn').on('keydown', '.siret' ,check_input_numeric);
		      $('#questionnairecmpn').on('keydown', '.zipcode' ,check_input_numeric);
		      $('#questionnairecmpn').on('keydown', '.numeric' ,check_input_numeric);
		      $('#questionnairecmpn').on('keydown', '.percent' ,check_input_numeric);
		      $('#questionnairecmpn').on('keydown', '.monetary' ,check_input_monetary);

		      $('#savequest').on('click', send_questionnaire);
		      $('#questionnairecmpn').on('click', '.cityclose' ,cityclose_button_event);
		      $('#questionnairecmpn').on('click', '.citycheck' ,citycheck);
		      $('#questionnairecmpn').on('click focus focusin focusout blur', check_mandatories);
		      
		  });    

function readURL(input)
{
    if (input.files && input.files[0])
    {
	var reader = new FileReader();

	reader.onload = function (e)
	{
	    $('#pictr').removeAttr('hidden');
	    $('#pictr').attr('src', e.target.result);
	}
	reader.readAsDataURL(input.files[0]);
    }
}

