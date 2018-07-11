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

var updateCompany = function(req, res, base_url, data){
  let url = create_url(base_url, '/companies/'+req.params['0'], {'session-key': req.cookies.cskey});
  request.post({url:url, json:data},
    function(err, response, body){
      console.log(body);
      if(err)
      res.status(204);
      else{
        res.send(body);
        res.status(200).end();
      }
  });
};

var addCompany = function(req, res, base_url, data){
  let url = create_url(base_url, '/companies', {'session-key' : req.cookies.cskey});
  let postBody =
      '--0123456789\r\n' +
      'Content-Disposition: form-data; name="siret"\r\n\r\n' +
      '"' + data.siret + '"\r\n' +
      '--0123456789--\r\n'
  ;
  let header = {
	    "Content-Type" : "multipart/form-data; boundary=0123456789",
	    "Content-Length" : Buffer.byteLength(postBody, 'utf8')
	};


  request.post({url : url, body : postBody, headers : header}, function(err, response, body)
  {
//      let json = JSON.parse(body);
      if (err)
      {
    res.status(204).end();
      }
      else {
    res.send(body);
    res.status(200).end();
  }
})
};

var addMeeting = function(req, res, base_url, data){
  let url = create_url(base_url, '/questionnaire-replies', {'session-key' : req.cookies.cskey});
  request.post({url:url, json:data},
    function(err, response, body){
      console.log(body);
      if(err)
      res.status(204);
      else{
        res.send(body);
        res.status(200).end();
      }
  });
};

var updateMeetingReply = function(req, res, base_url, data){
  let url = create_url(base_url, '/questionnaire-replies/'+req.params['0'], {'session-key': req.cookies.cskey});
  request.post({url:url, json:data},
    function(err, response, body){
      if(err)
      res.status(204);
      else{
        res.send(body);
        res.status(200).end();
      }
  });
};

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

exports.addMeeting = addMeeting;
exports.updateCompany = updateCompany;
exports.updateMeetingReply = updateMeetingReply;
exports.get_list = get_list;
exports.set_themes = set_themes;
exports.addCompany = addCompany;
