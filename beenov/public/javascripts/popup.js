/*
** Request the server for the list of the Beenov users.
** The database sorts which users you can access to according to your entity and permissions.
** The callback function writes the names in the select from.
*/

$(document).ready(function()
{
	$.ajax(
	{
		type: "GET",
		url : "/get_users",
		dataType: "json",
		success : function(data)
		{
			var toAppend = [];
			var i;
			for (i = 0; i < data.length; i++)
			{
				toAppend[i] += '<option>' + data[i]['lastName'] + " " + data[i]['firstName'] + ' ' + data[i]['id'] + '</option>';
			}
			toAppend = toAppend.sort();
			toAppend = toAppend.join();
			$('#adviser').append(toAppend);
		}
	});
	$('#newadv').click(function()
	{
		let idMeeting = getQueryVariable('met');
		let idQuest = getQueryVariable('qst')
		let user = $('#adviser').val();

		console.log("entry");
		if (idMeeting && user && idQuest)
		{
			idMeeting = idMeeting.split('/')[1]
			user = user.split(' ')[lastword(user)];
			alert(user);
			alert(idMeeting);
			alert(idQuest);
		}
/* requete POST & redirection meeting_list */
		let target = "users/" + user;
		$.ajax(
		{
			type: "POST",
			url : "/givemeeting",
			data: {"owner":{"resource":target, "idmet": idQuest}},
			success : (function(html, textStatus, jqXHR)
			{
				alert("youhou");
			}),
			error : (function(texte, code, item)
			{
				alert("damn son");
			}),
		});
	});

});

/*
** 1st: get the id of the selected meeting.
** 2nd: get the id of the selected user, recieving the meeting.
** 3th: send the request to the server.
*/

function lastword(user)
{
	var i = 0;
	var word = 0;

	while (user[i])
	{
		if (user[i] == ' ')
		{
			word += 1;
		}
		i += 1;
	}
	return (word);
}

function getQueryVariable(variable) {
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	var i = 0;

	for (i = 0; i < vars.length; i++)
	{
		var pair = vars[i].split("=");

		if (pair[0] == variable)
		{
			return pair[1];
		}
	} 
	alert('Query Variable ' + variable + ' not found');
}
