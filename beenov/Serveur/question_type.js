var	type_text = function(question)
{
    let json = {};
    if (question.responseSpec.minLength != undefined)
    {
	json.minLength = question.responseSpec.minLength;
    }
    if (question.responseSpec.maxLength != undefined)
    {
	json.maxLength = question.responseSpec.maxLength;
    }
    console.log(question.responseSpec.textType);
    if (question.responseSpec.textType == "date")
	json.textType = "datepicker";
    else
	json.textType = question.responseSpec.textType;
    return (json);
}

var	type_nTexts = function(question)
{
    let json = {};
    json.textTypes = question.responseSpec.textTypes;
    json.textLabels = question.responseSpec.textLabels;
    return (json);
}

var	type_nM = function(question)
{
    let json = {};
    json.rowLabels = question.responseSpec.rowLabels;
    json.columnLabels = question.responseSpec.columnLabels;
    return (json);
}

var	type_1Choice = function(question)
{
    let json = {};
    json.options = question.responseSpec.options;
    return (json);
}

exports.type_text = type_text;
exports.type_nTexts = type_nTexts;
exports.type_nM = type_nM;
exports.type_1Choice = type_1Choice;
