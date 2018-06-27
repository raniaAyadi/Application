function	tab_rules(id, type, var_name, rules_data)
{
    if (rules_data[0] == "table-cell")
    {
	let cell = (parseInt(rules_data[4]) * parseInt(rules_data[3])) + parseInt(rules_data[5]);
	globalVariables[var_name] = $('#' + cell + type + id).val();
    }
    else if (rules_data[0] == "table-row")
    {
	let values;

	for (let i = parseInt(rules_data[4]) * parseInt(rules_data[3]);
	     i < (parseInt(rules_data[4]) * parseInt(rules_data[3])) + parseInt(rules_data[3]); ++i)
	{
	    if (globalVariables[var_name] == undefined)
		globalVariables[var_name] = [];
	    globalVariables[var_name].push($('#' + i + type + id).val());
	}
    }
    else if (rules_data[0] == "table-column")
    {
	for (let i = parseInt(rules_data[4]);
	     i < parseInt(rules_data[2]) * parseInt(rules_data[3]) - 1;
	     i = i + parseInt(rules_data[2]))
	{
	    if (globalVariables[var_name] == undefined)
		globalVariables[var_name] = [];
	    globalVariables[var_name].push($('#' + i + type + id).val());
	}
    }
}

function	checkboxes_to_list(id, length)
{
    let list = [];
    for(let i = 0; i < length; ++i)
    {
	if ($('input[name=' + i + 'check' + id + ']').is(':checked'))
	{
	    let value = parseInt($('input[name=' + i + 'check' + id + ']').val());
	    if (isNaN(value) == false)
		list.push(value);
	}
    }
    return (list);
}

function	list_value(type, length, id)
{
    let list = [];
    let tmp;
    for(let i = 0; i < length; ++i)
    {
	tmp = $('#' + i + type + id).val();
	list.push(tmp == "null" ? null : tmp) 
    }
    return (list);
}

function	text_rules(text)
{
    let i;
    let j;
    let value;
    for (i = 0; text[i] != undefined; ++i)
    {
	if (text[i].rules != undefined)
	{
	    for (j = 0; text[i].rules[j] != undefined; ++j)
	    {
		if (text[i].rules[j].expression[0] == "set")
		{
		    value = (text[i].rules[j].expression[2] == "$answer" ?
			     $('#' + text[i].id).val() : text[i].rules[j].expression[2]);
		    if (value.length != 0)
			globalVariables[text[i].rules[j].expression[1]] = value;
		}
		else if (text[i].rules[j].expression[0] == "if" && ( (text[i].rules[j].expression[1][1] == "$answer" ? $('#' + text[i].id).val() : text[i].rules[j].expression[1][1])
								     == text[i].rules[j].expression[1][2]))
		{
		    if (text[i].rules[j].expression[2][0] == "set")
		    {
			value = (text[i].rules[j].expression[2][2] == "$answer" ?
				 $('#' + text[i].id).val() : text[i].rules[j].expression[2][2]);
			if (value.length != 0)
			    globalVariables[text[i].rules[j].expression[2][1]] = value;
		    }
		    else if (text[i].rules[j].expression[2][0] == "append")
		    {
			if (Array.isArray(globalVariables[text[i].rules[j].expression[2][1]]) == false)
			    globalVariables[text[i].rules[j].expression[2][1]] = [];
			value = text[i].rules[j].expression[2][2] == "$answer" ?
			    $('#' + text[i].id).val() : text[i].rules[j].expression[2][2];
			if (value.length != 0)
			    globalVariables[text[i].rules[j].expression[2][1]].push(value);
		    }
		}
		else if (text[i].rules[j].expression[0] == "append")
		{
		    if (Array.isArray(globalVariables[text[i].rules[j].expression[1]]) == false)
			globalVariables[text[i].rules[j].expression[1]] = [];
		    value = text[i].rules[j].expression[2] == "$answer" ?
			$('#' + text[i].id).val() : text[i].rules[j].expression[2];
		    if (value.length != 0)
			globalVariables[text[i].rules[j].expression[1]].push(value);
		}
	    }
	}
    }
}

function        textarea_rules(textarea)
{
    let i;
    let j;
    for (i = 0; textarea[i] != undefined; ++i)
    {
	if (textarea[i].rules != undefined)
	{
	    for (j = 0; textarea[i].rules[j] != undefined; ++j)
	    {
		if (textarea[i].rules[j].expression[0] == "set")
		{
		    globalVariables[textarea[i].rules[j].expression[1]] = (textarea[i].rules[j].expression[2] == "$answer" ?
									   $('#' + textarea[i].id).val() : textarea[i].rules[j].expression[2]);
		}
 		else if (textarea[i].rules[j].expression[0] == "if" && ( (textarea[i].rules[j].expression[0][1] == "$answer" ? $('#' + textarea[i].id).val() : textarea[i].rules[j].expression[1][1])
									 == textarea[i].rules[j].expression[1][2]))
		{
		    if (textarea[i].rules[j].expression[2][0] == "set")
		    {
			globalVariables[textarea[i].rules[j].expression[2][1]] = (textarea[i].rules[j].expression[2][2] == "$answer" ?
										  $('#' + textarea[i].id).val() : textarea[i].rules[j].expression[2][2]);
		    }
		    else if (textarea[i].rules[j].expression[2][0] == "append")
		    {
			if (Array.isArray(globalVariables[textarea[i].rules[j].expression[2][1]]) == false)
			    globalVariables[textarea[i].rules[j].expression[2][1]] = [];
			globalVariables[textarea[i].rules[j].expression[2][1]].push(textarea[i].rules[j].expression[2][2] == "$answer" ?
										    $('#' + textarea[i].id).val() : textarea[i].rules[j].expression[2][2]);
		    }
		}
		else if (textarea[i].rules[j].expression[0] == "append")
		{
		    if (Array.isArray(globalVariables[textarea[i].rules[j].expression[1]]) == false)
			globalVariables[textarea[i].rules[j].expression[1]] = [];
		    globalVariables[textarea[i].rules[j].expression[1]].push(textarea[i].rules[j].expression[2] == "$answer" ?
									     $('#' + textarea[i].id).val() : textarea[i].rules[j].expression[2]);
		}
	    }
	}
    }
}

function        radios_rules(radios)
{
    let i;
    let j;
    let value;
    for (i = 0; radios[i] != undefined; ++i)
    {
	if (radios[i].rules != undefined)
	{
	    for (j = 0; radios[i].rules[j] != undefined; ++j)
	    {
		if (radios[i].rules[j].expression[0] == "set")
		{
		    value = (radios[i].rules[j].expression[2] == "$answer" ?
			     parseInt($('input[name=' + radios[i].id + ']:checked').val()) : radios[i].rules[j].expression[2]);
		    if (isNaN(value) == false)
			globalVariables[radios[i].rules[j].expression[1]] = value;
		}
		else if (radios[i].rules[j].expression[0] == "if" && ( (radios[i].rules[j].expression[0][1] == "$answer" ? parseInt($('input[name=' + radios[i].id + ']:checked').val()) : radios[i].rules[j].expression[1][1])
								       == radios[i].rules[j].expression[1][2]))
		{
		    if (radios[i].rules[j].expression[2][0] == "set")
		    {
			value = (radios[i].rules[j].expression[2][2] == "$answer" ?
				 parseInt($('input[name=' + radios[i].id + ']:checked').val()) : radios[i].rules[j].expression[2][2]);
			if (isNaN(value) == false)
			    globalVariables[radios[i].rules[j].expression[2][1]] = value;
		    }
		    else if (radios[i].rules[j].expression[2][0] == "append")
		    {
			if (Array.isArray(globalVariables[radios[i].rules[j].expression[2][1]]) == false)
			    globalVariables[radios[i].rules[j].expression[2][1]] = [];
			value = radios[i].rules[j].expression[2][2] == "$answer" ?
			    parseInt($('input[name=' + radios[i].id + ']:checked').val()) : radios[i].rules[j].expression[2][2];
			if (isNaN(value) == false)
			    globalVariables[radios[i].rules[j].expression[2][1]].push(value);
		    }
		}
		else if (radios[i].rules[j].expression[0] == "append")
		{
		    
		    value = radios[i].rules[j].expression[2] == "$answer" ?
			parseInt($('input[name=' + radios[i].id + ']:checked').val()) : radios[i].rules[j].expression[2];
		    if (isNaN(value) == false)
		    {
			if (Array.isArray(globalVariables[radios[i].rules[j].expression[1]]) == false)
			    globalVariables[radios[i].rules[j].expression[1]] = [];
			globalVariables[radios[i].rules[j].expression[1]].push(value);
		    }
		}
	    }
	}
    }
}

function        checkboxes_rules(checkboxes)
{
    let i;
    for (i = 0; checkboxes[i] != undefined; ++i)
    {
	let json;
	if (checkboxes[i].rules != undefined)
	{
	    for (let j = 0; checkboxes[i].rules[j] != undefined; ++j)
	    {
		if (checkboxes[i].rules[0].expression[0] == "set")
		{
		    globalVariables[checkboxes[i].rules[0].expression[1]] = (checkboxes[i].rules[0].expression[2] == "$answer" ?
									     checkboxes_to_list(checkboxes[i].id, checkboxes[i].length) : checkboxes[i].rules[0].expression[2]);
		}
		else if (checkboxes[i].rules[0].expression[0] == "append")
		{
		    if (Array.isArray(globalVariables[checkboxes[i].rules[0].expression[1]]) == false)
			globalVariables[checkboxes[i].rules[0].expression[1]] = [];
		    globalVariables[checkboxes[i].rules[0].expression[1]].push(checkboxes[i].rules[0].expression[2] == "$answer" ?
									       checkboxes_to_list(checkboxes[i].id, checkboxes[i].length) : checkboxes[i].rules[0].expression[2]);
		}
	    }
	}
    }
}


function        nTexts_rules(nTexts)
{
    let i;
    let j;
    for (i = 0; nTexts[i] != undefined; ++i)
    {
	if (nTexts[i].rules != undefined)
	{
	    for (j = 0; nTexts[i].rules[j] != undefined; ++j)
	    {
		if (nTexts[i].rules[j].expression[0] == "set")
		{
		    globalVariables[nTexts[i].rules[j].expression[1]] = (nTexts[i].rules[j].expression[2] == "$answer" ?
									 list_value('nTexts', nTexts[i].length, nTexts[i].id)  : nTexts[i].rules[j].expression[2]);
		}
		else if (nTexts[i].rules[j].expression[0] == "append")
		{
		    if (Array.isArray(globalVariables[nTexts[i].rules[j].expression[1]]) == false)
			globalVariables[nTexts[i].rules[j].expression[1]] = [];
		    globalVariables[nTexts[i].rules[j].expression[1]].push(nTexts[i].rules[j].expression[2] == "$answer" ?
									   list_value('nTexts', nTexts[i].length, nTexts[i].id) : nTexts[i].rules[j].expression[2]);
		}
	    }
	}
    }
}

function	nMTexts_rules(nMTexts)
{
    let j;
    let rules = [];

    for (let i = 0; nMTexts[i] != undefined; ++i)
    {
	if (nMTexts[i].rules != undefined)
	{
	    for (j = 0; nMTexts[i].rules[j] != undefined; ++j)
	    {
		if (nMTexts[i].rules[j].expression[0] == "set")
		{
		    if (Array.isArray(nMTexts[i].rules[j].expression[2]) == true)
		    {
			tab_rules(nMTexts[i].id, 'nMTexts', nMTexts[i].rules[j].expression[1], nMTexts[i].rules[j].expression[2]);
		    }
		    else
		    {
			globalVariables[nMTexts[i].rules[j].expression[1]] = (nMTexts[i].rules[j].expression[2] == "$answer" ?
									      list_value('nMTexts', nMTexts[i].length, nMTexts[i].id)  : nMTexts[i].rules[j].expression[2]);
		    }
		}
		else if (nMTexts[i].rules[j].expression[0] == "append")
		{
		    if (Array.isArray(globalVariables[nMTexts[i].rules[j].expression[1]]) == false)
			globalVariables[nMTexts[i].rules[j].expression[1]] = [];
		    globalVariables[nMTexts[i].rules[j].expression[1]].push(nMTexts[i].rules[j].expression[2] == "$answer" ?
									    list_value('nMTexts', nMTexts[i].length, nMTexts[i].id) : nMTexts[i].rules[j].expression[2]);
		}
	    }
	}
    }
}

function        nMLongTexts_rules(nMLongTexts)
{
    let j;
    let rules = [];

    for (let i = 0; nMLongTexts[i] != undefined; ++i)
    {
	if (nMLongTexts[i].rules != undefined)
	{
	    for (j = 0; nMLongTexts[i].rules[j] != undefined; ++j)
	    {
		if (nMLongTexts[i].rules[j].expression[0] == "set")
		{
		    if (Array.isArray(nMLongTexts[i].rules[j].expression[2]) == true)
		    {
			tab_rules(nMLongTexts[i].id, 'nMLongTexts', nMLongTexts[i].rules[j].expression[1], nMLongTexts[i].rules[j].expression[2]);
		    }
		    else
		    {
			globalVariables[nMLongTexts[i].rules[j].expression[1]] = (nMLongTexts[i].rules[j].expression[2] == "$answer" ?
										  list_value('nMLongTexts', nMLongTexts[i].length, nMLongTexts[i].id)  : nMLongTexts[i].rules[j].expression[2]);
		    }
		}
		else if (nMLongTexts[i].rules[j].expression[0] == "append")
		{
		    if (Array.isArray(globalVariables[nMLongTexts[i].rules[j].expression[1]]) == false)
			globalVariables[nMLongTexts[i].rules[j].expression[1]] = [];
		    globalVariables[nMLongTexts[i].rules[j].expression[1]].push(nMLongTexts[i].rules[j].expression[2] == "$answer" ?
										list_value('nMLongTexts', nMLongTexts[i].length, nMLongTexts[i].id) : nMLongTexts[i].rules[j].expression[2]);
		}
	    }
	}
    }
}


function	n1Choice_rules(n1Choice)
{
    let i;
    let rules = [];

    for (let j = 0; n1Choice[j] != undefined; j++)
    {
	let val = [];
	for (i = 0; i < n1Choice[j].length; ++i)
	{
	    let tmp = $('input[name=' + i + 'n1Choice' + n1Choice[j].id + ']:checked').val();
	    
	}
	rules.push({ rules: val,
		     question: {resource: "questions/" + n1Choice[j].id}
		   });
    }
    return (rules);
}

function	get_rules(type)
{
    let data;
    if (type == "quest")
	data = questionnaire_data;
    else if (type == "company")
	data = company_data;
    if (data.text != undefined)
    {
	text_rules(data.text);
    }
    if (data.textarea != undefined)
    {
	textarea_rules(data.textarea);
    }
    if (data.radios != undefined)
    {
	radios_rules(data.radios);
    }
    if (data.checkboxes != undefined)
    {
	checkboxes_rules(data.checkboxes);
    }
    if (data.nTexts != undefined)
    {
	nTexts_rules(data.nTexts);
    }
    if (data.nMTexts != undefined)
    {
	nMTexts_rules(data.nMTexts);
    }
    if (data.nMLongTexts != undefined)
    {
	nMLongTexts_rules(data.nMLongTexts);
    }
}
