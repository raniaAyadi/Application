function	equal_to(a, b)
{
    if (a == b)
	return (true);
    return (false);
}

function	not_equal_to(a, b)
{
    if (a != b)
	return (true);
    return (false);
}

function	greater_than(a, b)
{
    if (a > b)
	return (true);
    return (false);
}

function	less_than(a, b)
{
    if (a < b)
	return (true);
    return (false);
}

function	greater_than_or_equal(a, b)
{
    if (a >= b)
	return (true);
    return (false);
}

function	less_than_or_equal(a, b)
{
    if (a <= b)
	return (true);
    return (false);
}

function	check_condition(condition_value, id)
{
    if (condition_value == true)
	$('#display-' + id).removeAttr('hidden');
    else
	$('#display-' + id).attr('hidden', "");
}

function	parse_display()
{
    get_rules("quest");
    for (let i = 0; display[i] != undefined; ++i)
    {
	if (display[i].condition[0] == "=")
	{
	    check_condition(equal_to(display[i].condition[2], globalVariables[display[i].condition[1]]), display[i].id);
	}
	else if (display[i].condition[0] == "!=")
	{
	    check_condition(not_equal_to(display[i].condition[2], globalVariables[display[i].condition[1]]), display[i].id);
	}
	else if (display[i].condition[0] == ">")
	{
	    check_condition(greater_than(display[i].condition[2], globalVariables[display[i].condition[1]]), display[i].id);
	}
	else if (display[i].condition[0] == "<")
	{
	    check_condition(less_than(display[i].condition[2], globalVariables[display[i].condition[1]]), display[i].id);
	}
	else if (display[i].condition[0] == ">=")
	{
	    check_condition(greater_than_or_equal(display[i].condition[2], globalVariables[display[i].condition[1]]), display[i].id);
	}
	else if (display[i].condition[0] == "<=")
	{
	    check_condition(less_than_or_equal(display[i].condition[2], globalVariables[display[i].condition[1]]), display[i].id);
	}
	    
    }
}
