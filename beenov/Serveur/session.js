const	request = require("request");
const	nodemailer = require('nodemailer'); /* automatic email sender for forgotten password*/
const	jsonfile = require('jsonfile');

const	client = require("./client");


function	create_login_url(base_url, path_url, data)
{
	let	url_params = '?' + Object.keys(data).map((i) => i+'='+data[i]).join('&');
	url_params = url_params.replace('@', '%40');
	let	url = base_url + path_url + url_params;
	return (url);
}

function	create_get_url(base_url, path_url, data)
{
	let url_params = '?' + Object.keys(data).map((i) => i+'='+data[i]).join('&');
	let url = base_url + path_url + url_params;
	return (url);
}

var	login_user = function (mail, mdp, protocol_version, base_url, response)
{
	let url = create_login_url(base_url, '/open-session', {'password' : mdp, 'email' : mail, 'protocol-version' : protocol_version});

	request.get(url, function(err, res, body)
		{
			let json = JSON.parse(body);
			if (err || json.status == 'error')
			{
			console.log(err);
			response.redirect("/login");
			response.status(204).end();
			return;
			}
			else {
			response.cookie('uid', json.userId);
			response.cookie('cskey', json.sessionKey);
			url = create_get_url(base_url, '/users/' + json.userId, {'session-key' : json.sessionKey});
			request.get(url, function(err, res, body)
					{
					json = JSON.parse(body);
					if (err || json.status == 'error')
					{
						console.log(err);
						response.redirect("/login");
						response.status(204).end();
						return;
					}
					else {
						let username = json.resources[0]["firstName"] + " " + json.resources[0]["lastName"];
						console.log(username);
						response.cookie('username', username);
						response.redirect("/meeting_list");
						response.status(200).end();
					}
					});
			}
		});
}

var	newpwd = function (mail, protocol_version, base_url, response)
{
	let	transporter = nodemailer.createTransport(
	{
		service: 'webmail.gandi.net/',
		auth: {
			user: 'noreply@beenov.com',
			pass: 'beenov-noreply33%'
			}
	});

	let	mailOptions = {
		from: 'noreply@beenov.com', // https://webmail.gandi.net/ 
		to: req.cookies.user_mail,
		subject: 'Beenov\' - Changement de mot de passe',
		text: '',
		html: 'Bonjour,<br >Veuillez suivre le lien suivant pour changer votre mot de passe: <br >'
		+ 'lien généré'
		+ '<br >Si vous n\'avez pas demandé de changement de mot de passe, merci de contacter le support Beenov.<br >'
	};

	transporter.sendMail(mailOptions, function(error, info)
	{
		if(error)
		{
			console.log(error);
		}
		else
		{
			console.log('Message sent: ' + info.response);
		}
	});
}

var	reinitpwd = function (mdp1, mdp2, protocol_version, base_url, response, session_key)
{
	let	url = create_get_url(base_url, '/change-password', mdp1);
	let	value = {"newPassword": {mdp1}};

	request.post({
		url: url,
		json: value
	}, function(err, res, body)
	{
		let	json = JSON.parse(body);
		if (err || json.status == 'error')
		{
			console.log(err);
			response.redirect("/reinit_pwd");
			response.status(204).end();
			return;
		}
		else 
		{
			console.log('Password succesfully updated.');
			response.redirect("/login");
			response.status(200).end();
			return;
		}
	});
}

var changemdp = function(value, protocol_version, base_url, response, cskey)
{
	let	url = create_get_url(base_url, '/change-password', {"session-key": cskey});
	//let	value = {"old-password": oldmdp, "new-password": mdp1};

	console.log(url);
	request.post({
		url: url,
		json: value
	}, function(err, res, body)
	{
		console.log(body);
		if (err || body.status == 'error')
		{
			console.log(err);
			response.redirect("/changepwd");
			response.status(204).end();
			return;
		}
		else 
		{
			console.log('Password succesfully updated.');
			response.redirect("/meeting_list");
			response.status(200).end();
			return;
		}
	});
}


var	check_connection = function (req, response, base_url, redirect)
{
	if (req.cookies.uid  != undefined &&
	req.cookies.cskey != undefined)
	{
	let url = create_get_url(base_url, '/users/' + req.cookies.uid, {'session-key' : req.cookies.cskey});
	request.get(url, function(err, res, body)
		{
			let json = JSON.parse(body);
			if (err || json.status == 'error')
			{
				console.log(err);
				response.redirect("/login");
				response.status(204).end();
				return "ok";
			}
			else {
				let username = json.resources[0]["firstName"] + " " + json.resources[0]["lastName"];
				response.cookie('username', username);
				response.redirect(redirect);
				response.status(200).end();
				return "no";
			}
		});
	}
	else {
	console.log("Check cookies redirect login");
	response.redirect("/login");
	response.end();
	}
}

var get_users = function(protocol_version, base_url, req, res, cskey)
{
	let url = create_get_url(base_url, '/users', {'session-key' : req.cookies.cskey});

	request.get(url, function(err, req, body)
	{
		let json = JSON.parse(body);
		if (err)
		{
			console.log(err);
			res.status(204).end();
		}
		else
		{
			res.send(json.resources);
			res.status(200).end();
			console.log("Json send");
		}
	});
}

/* Logo entity - subentity */
var	request_logoname = function(protocol_version, base_url, res, target, cskey)
{
	let url = create_get_url(base_url, target, {'session-key' : cskey});

	request.get(url, function(err, resp, body)
	{
		let json = JSON.parse(body);

		if (json.status == "error")
		{
			console.log(json.errorType);
			res.status(204).end();
		}
		else
	    {
		console.log(json)
			let path_logo = json.resources[0].logoImageUrl;
			res.send(json);
			res.status(200).end();
		}
	});
}

var	request_userinfo = function(protocol_version, base_url, res, userid, cskey, option)
{
	let url = create_get_url(base_url, '/users/' + userid.toString(), {'session-key' : cskey});

	request.get(url, function(err, resp, body)
	{
		let json = JSON.parse(body);

		if (err)
		{
			console.log(err);
			res.status(204).end();
		}
		else if (json.status == "error")
		{
			res.redirect('./login');
			res.status(204).end();
		}
		else
		{
			console.log(json);
			switch(option)
			{
				case 0:
					let entity = "/" + json.resources[0].entity.resource;
					request_logoname(protocol_version, base_url, res, entity, cskey);
					break;
				case 1:
					let subentity = "/" + json.resources[0].subentity.resource;
					request_logoname(protocol_version, base_url, res, subentity, cskey);
					break;
			}
		}
	});
}

var exportGRC = function(protocol_version, base_url, res, cskey, meeting)
{
	let url = create_get_url(base_url, '/export-grc-questionnaire-reply-summary', {'session-key' : cskey});

	request.post(
	{
		url: url,
		json: meeting
	}, function(err, resp, body)
	{
		if (err || body.status == 'error')
		{
			console.log(err);
			res.status(204).end();
		}
		else
		{
			res.send(body);
			res.status(204).end();
		}
	});
}


var changeowner = function (protocol_version, base_url, res, cskey, data)
{
	let url = create_get_url(base_url, '/' + data.owner.idmet, {'session-key' : cskey});
	console.log(url);

	request.post(
	{
		url: url,
		json: data
	}, function(err, resp, body)
	{
		if (err || body.status == 'error')
		{
			console.log(err);
			res.status(204).end();
		}
		else 
		{
			res.status(200).end();
		}
	});
}

var removemeeting = function (protocol_version, base_url, res, cskey, data)
{
	let url = create_get_url(base_url, '/' + data.qst + '/delete', {'session-key' : cskey});

	request.post(
	{
		url: url,
		json: {"whatever" : "_"}
	}, function(err, resp, body)
	{
		console.log(body);
		if (err || body.status == 'error')
		{
			console.log(err);
			res.status(204).end();
		}
		else 
		{
			res.redirect('./meeting_list');
			res.status(200).end();
		}
	});
}

exports.login_user = login_user;
exports.newpwd = newpwd;
exports.reinitpwd = reinitpwd;
exports.changemdp = changemdp;
exports.check_connection = check_connection;
exports.get_users = get_users;
exports.request_userinfo = request_userinfo;
exports.exportGRC = exportGRC;
exports.changeowner = changeowner;
exports.removemeeting = removemeeting;
