function	porterMatrix_values(matrix)
{
    let answers = [];
    for (let i = 0; matrix[i] != undefined; ++i)
    {
	let answer = [];
	for (let j = 0; j < 5; ++j)
	{
	    let val = $('input[name=' + matrix[i] + 'matrix' + j + ']:checked');
	    console.log(val);
	    if (val.length > 0)
	    {
		val = val.val().split('|');
		answer = answer.concat([parseInt(val[0]), val[1]]);
	    }
	    else
	    {
		answer = answer.concat([-1, ""]);
	    }
	}
	answers.push({'answer': answer,
		      'question': {resource: "questions/" + matrix[i]}});
    }
    return (answers);
}

function	city_values(city)
{
    let answers = [];
    for (let i = 0; city[i] != undefined; ++i)
    {
	if ($('#citycheck-' + city[i].id).is(':checked'))
	{
	    let value = $('#cityinput-' + city[i].id).val();
	    console.log(value);
	    answers.push({'answer': value[0] + value[1] + "000;" + value,
			  'question': {resource: 'questions/' + city[i].id}});
	}
	else if ($('#cityinput-' + city[i].id).val().length == 5)
	{
	    answers.push({'answer': $('#citylist-' + city[i].id).val(),
			  'question': {resource: 'questions/' + city[i].id}});
	}
    }
    console.log(answers);
    return (answers);
}

function	text_values(text)
{
    let i;
    let answers = [];
    for (i = 0; text[i] != undefined; ++i)
    {
	let val = $('#' + text[i].id).val();
	if (val.length != 0)
	{
	    answers.push({ answer: val,
			   question: { resource: "questions/" + text[i].id }
			 });
	}
    }
    return (answers);
}

function	textarea_values(textarea)
{
    let i;
    let answers = [];
    for (i = 0; textarea[i] != undefined; ++i)
    {
	let val = $('#' + textarea[i].id).val();
	if (val.length != 0)
	{
	    answers.push({ answer: val,
			   question: { resource: "questions/" + textarea[i].id }
			 });
	}
    }
    return (answers);
}

function	radios_values(radios)
{
    let i;
    let answers = [];
    for (i = 0; radios[i] != undefined; ++i)
    {
	let value = parseInt($('input[name=' + radios[i].id + ']:checked').val());
	if (isNaN(value) == false)
	{
	    answers.push({ answer: value,
			   question: { resource: "questions/" + radios[i].id }
			 });
	}
    }
    return (answers);
}

function	checkboxes_values(checkboxes)
{
    let i;
    let answers = [];
    for (i = 0; checkboxes[i] != undefined; ++i)
    {
	let val = [];
	for (let j = 0; j < checkboxes[i].length; ++j)
	{
	    if ($('input[name=' + j + 'check' + checkboxes[i].id + ']').is(':checked'))
	    {
		val.push(parseInt($('input[name=' + j + 'check' + checkboxes[i].id + ']').val()));
	    }
	}
	answers.push({ answer: val,
		       question: { resource: "questions/" + checkboxes[i].id }
		     });
		    
    }
    return (answers);
}

function	nTexts_values(nTexts)
{
    let i;
    let answers = [];

    for (let j = 0; nTexts[j] != undefined; ++j)
    {
	let val = [];
	for (i = 0; i < nTexts[j].length; ++i)
	{
	    let value = $('#' + i + 'nTexts' + nTexts[j].id).val();
	    if (value.length != 0)
	    {
		val.push(value);
	    }
	    else
	    {
		val.push("");
	    }
		
	}
	answers.push({ answer: val,
		       question: { resource: "questions/" + nTexts[j].id }
		     });
    }
    return (answers);
}

function	nMTexts_values(nMTexts)
{
    let i;
    let answers = [];

    for (let j = 0; nMTexts[j] != undefined; ++j)
    {
	let val = [];
	for (i = 0; i < nMTexts[j].length; ++i)
	{
	    let value = $('#' + i + 'nMTexts' + nMTexts[j].id).val();
	    if (value.length != 0)
	    {
		val.push(value);
	    }
	    else
	    {
		val.push("");
	    }
	}
	answers.push({ answer: val,
		       question: { resource: "questions/" + nMTexts[j].id }
		     });
    }
    return (answers);
}

function	nMLongTexts_values(nMLongTexts)
{
    let i;
    let answers = [];

    for (let j = 0; nMLongTexts[j] != undefined; ++j)
    {
	console.log(nMLongTexts[j].id);
	let val = [];
	for (i = 0; i < nMLongTexts[j].length; ++i)
	{
	    let value = $('#' + i + 'nMLongTexts' + nMLongTexts[j].id).val();
	    if (value.length != 0)
	    {
		val.push(value);
	    }
	    else
	    {
		val.push("");
	    }
	}
	answers.push({ answer: val,
		       question: { resource: "questions/" + nMLongTexts[j].id }
		     });
    }
    return (answers);
}

function	n1Choice_values(n1Choice)
{
    let i;
    let answers = [];

    console.log(n1Choice);
    for (let j = 0; n1Choice[j] != undefined; j++)
    {
	let val = [];
	for (i = 0; i < n1Choice[j].length; ++i)
	{
	    val.push(parseInt($('input[name=' + i + 'n1Choice' + n1Choice[j].id + ']:checked').val()));				     
	}
	answers.push({ answer: val,
		       question: {resource: "questions/" + n1Choice[j].id}
		     });
    }
    return (answers);
}

function	get_values(type)
 {
     let data;
     if (type == "quest")
	 data = questionnaire_data;
     else if (type == "company")
	 data = company_data;
     console.log("VALUES");
     console.log(data);
     let answers = [];
     if (data.text != undefined)
     {
	 answers = answers.concat(text_values(data.text));
     }
     if (data.textarea != undefined)
     {
	 answers = answers.concat(textarea_values(data.textarea));
     }
     if (data.radios != undefined)
     {
	 answers = answers.concat(radios_values(data.radios));
     }
     if (data.checkboxes != undefined)
     {
	 answers = answers.concat(checkboxes_values(data.checkboxes));
     }
     if (data.nTexts != undefined)
     {
	answers = answers.concat(nTexts_values(data.nTexts));
     }
     if (data.nMTexts != undefined)
     {
	 answers = answers.concat(nMTexts_values(data.nMTexts));
     }
     if (data.nMLongTexts != undefined)
     {
	 answers = answers.concat(nMLongTexts_values(data.nMLongTexts));
     }
     if (data.matrix != undefined)
     {
	 answers = answers.concat(porterMatrix_values(data.matrix));
     }
     if (data.n1Choice != undefined)
     {
	 answers = answers.concat(n1Choice_values(data.n1Choice));
     }
     if (data.city != undefined)
     {
	 answers = answers.concat(city_values(data.city));
     }
     return (answers);
 }
 
