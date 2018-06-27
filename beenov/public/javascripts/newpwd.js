/*
** Error handling: alerting the user that he failed his password changing, 
** discribing the mistake(s) in a single alert message.
*/
function warning(oldpwd, mdp1, mdp2)
{
	var msg = "Merci de bien remplir tout les champs. ";
	if (oldpwd == false)
	{
		msg += "\n- Entrez votrs mot de passe actuel dans la premier champ.";
	}
	if (mdp1 == false || mdp2 == false)
	{
		msg += "\n- Entrez votre nouveau mot de passe dans les deux champs prévus à cet effet.";
	}
	if (mdp1 !== mdp2)
	{
		msg += "\n- Attention: les deux nouveaux mots de passe sont différents.";
	}
	return (msg);
}

/*
** Send to the server a POST request to modify the password
*/
function askserver(oldpwd, mdp1)
{
	let data = {
			"old-password": oldpwd,
			"new-password": mdp1
	};
	console.log(data);
	$.ajax(
	{
		type: 'POST',
		url: '/change-password',
		data: data,
		success: (function(html)
		{
/*			replie = JSON.parse(html);*/
			if (html.status == 'ok')
			{
				alert("Mot de passe modifié");
			}
			else
			{
				console.log("return:" + html.status);
				alert('Une erreur est survenue, veuillez retenter l\'opération.');
			}
		})
	});
}

/*
** Called in the html, this function decides the acceptability of the given arguments 
** and whether accept or reject them.
*/
$(document).ready(function()
{
	console.log("1st entry");
	$("#button").click(function()
	{
		var	oldpwd = $('input[name=mdpold]').val();
		var mdp1 = $('input[name=mdp1]').val();
		var mdp2 = $('input[name=mdp2]').val();
		if (oldpwd && mdp1 && mdp1 === mdp2)
		{
			console.log("2nd entry");
			console.log("bite");
			console.log("old pwd : " + oldpwd + " || new pwd :" + mdp1);
			askserver(oldpwd, mdp1);
			console.log("posted");
		}
		else
		{
			console.log("3th entry");
			alert(warning(oldpwd, mdp1, mdp2));
		}
		return false;
	});
});
