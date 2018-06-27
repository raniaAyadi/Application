const	request = require('request');
const	client = require('./client');

function        create_url(base_url, path_url, data)
{
    let url_params = '?' + Object.keys(data).map((i) => i+'='+data[i]).join('&');
    let url = base_url + path_url + url_params;
    return (url);
}

var	set_themes = function (req, res, base_url)
{
    let url = create_url(base_url, '/theme-groups', {'session-key': req.cookies.cskey});

    request.get(url, function(err, response, body)
		{
		    let json = JSON.parse(body);
		    if (err)
		    {
			console.log(err);
			res.status(204).end();
		    }
		    else {
			res.send(json);
			res.status(200).end();
		    }
		});
}

var	get_list = function(req, res, base_url)
{
    let url = create_url(base_url, '/questionnaire-replies-metadata', {'session-key': req.cookies.cskey});
    console.log(url);
    request.get(url, function(err, response, body)
		{
		    let json = JSON.parse(body);
		    if (err)
		    {
			console.log(err);
			res.status(204).end();
		    }
		    else {
			res.send(json.resources);
			res.status(200).end();
			console.log("Json send");
    }
  });
    // var fs = require('fs');
    // fs.readFile('liste.json', 'utf8', function(erreur, donnees){
    //   if(erreur)
    //     throw erreur;
    //     let json = JSON.parse(donnees);
    //     res.send(json.resources);
    //     res.status(200).end();
    //     console.log("Json send");
    // });
}

exports.get_list = get_list;
exports.set_themes = set_themes;
