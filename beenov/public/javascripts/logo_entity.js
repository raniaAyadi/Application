$(document).ready(function()
{
	$.ajax(
	{
		type: "GET",
		url: "entity",
		dataType: "json",
		success : function(data)
		{
			let path_logo = data.resources[0].logoImageUrl;
			let toAppend = '<img src="' + path_logo +  '" class="credits">';

			$('#bottom').append(toAppend);
		}
	});

	$.ajax(
	{
		type: "GET",
		url: "subentity",
		dataType: "json",
		success : function(data)
		{
			let path_logo = data.resources[0].logoImageUrl;
			let toAppend = '<img src="' + path_logo +  '" class="credits">';

			$('#bottom').append(toAppend);
		}
	});
});