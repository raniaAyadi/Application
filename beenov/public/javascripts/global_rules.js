var	comments = [];

function	global_rules(rules)
{
    comments = [];
    function	somme(list)
    {
	let val = 0;
	for (let j = 0; j < list.length; ++j)
	{
	    val += list[j];
	}
	return (val);
    }
    if (rules != undefined)
    {
	for (let i = 0; rules[i] != undefined; ++i)
	{
	    if (rules[i].expression[0] == "set")
	    {
		if (rules[i].expression[2][0] == "sum" && globalVariables[rules[i].expression[2][1]] != undefined)
		{
		    globalVariables[rules[i].expression[1]] = somme(globalVariables[rules[i].expression[2][1]]);
		}
		else if (rules[i].expression[2][0] == "mean" && globalVariables[rules[i].expression[2][1]] != undefined)
		{
		    globalVariables[rules[i].expression[1]] = somme(globalVariables[rules[i].expression[2][1]]) / globalVariables[rules[i].expression[2][1]].length;
		}
		else if (rules[i].expression[2][0] == "list")
		{
		    if (globalVariables[rules[i].expression[1]] == undefined)
		    {
			globalVariables[rules[i].expression[1]] = [];
		    }
		    for (let j = 1; j < rules[i].expression[2].length; ++j)
			globalVariables[rules[i].expression[1]].push(rules[i].expression[2][j]);
		}
			
	    }
	    else if (rules[i].expression[0] == "if")
	    {
		comments.push(rules[i].expression);
	    }
	}
    }
}

function	get_comments()
{
    console.log("COMMENTS");
    console.log(comments);
    //    global_rules(main_rules);
    //    get_rules();

    function	check_condition_comment(condition, value, var_name)
    {
	let val;
	console.log(value + " " + condition + " " + globalVariables[var_name]);
	if (condition == "=")
	    val = equal_to(globalVariables[var_name], value);
	else if (condition == "!=")
	    val = not_equal_to(globalVariables[var_name], value);
	else if (condition == ">")
	    val = greater_than(globalVariables[var_name], value);
	else if (condition == "<")
	    val = less_than(globalVariables[var_name], value);
	else if (condition == ">=")
	    val = greater_than_or_equal(globalVariables[var_name], value);
	else if (condition == "<=")
	    val = less_than_or_equal(globalVariables[var_name], value);
	return (val);
    }

    function	check_condition_comment2(condition, value, var_name)
    {
	let val;
	console.log(value + " " + condition + " " + globalVariables[var_name]);
	if (condition == "=")
	    val = equal_to(value, globalVariables[var_name]);
	else if (condition == "!=")
	    val = not_equal_to(value, globalVariables[var_name]);
	else if (condition == ">")
	    val = greater_than(value, globalVariables[var_name]);
	else if (condition == "<")
	    val = less_than(value, globalVariables[var_name]);
	else if (condition == ">=")
	    val = greater_than_or_equal(value, globalVariables[var_name]);
	else if (condition == "<=")
	    val = less_than_or_equal(value, globalVariables[var_name]);
	return (val);
    }
    
    function	and(condition1, condition2)
    {
	if (check_condition_comment2(condition1[0], condition1[1], condition1[2]) == true &&
	    check_condition_comment(condition2[0], condition2[2], condition2[1]) == true)
	    return (true);
	else
	    return (false);
    }

    let comment_list = {};
    console.log(comments);
    for (let i = 0; i < comments.length; ++i)
    {
	console.log("condition : " + comments[i][1][0] + "\nvalue : " + comments[i][1][2] + "\nvar_name : " + comments[i][1][1]);
	if (comments[i][1][0] == "and")
	{
	    if (and(comments[i][1][1], comments[i][1][2]) == true)
	    {
		comment_list[comments[i][2][1]] = comments[i][2][2];
	    }
	}
	else if (check_condition_comment2(comments[i][1][0], comments[i][1][2], comments[i][1][1]) == true)
	{
	    comment_list[comments[i][2][1]] = comments[i][2][2];
	}	
    }
    return (comment_list);
}
