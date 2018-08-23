const	request = require('request');
const	client = require('./client');

function        create_url(base_url, path_url, data)
{
    let url_params = '?' + Object.keys(data).map((i) => i+'='+data[i]).join('&');
    let url = base_url + path_url + url_params;
    return (url);
}


var verifyByAPI = function(req, res){
  let url = "https://entreprise.api.gouv.fr/v2/etablissements/";
  url += req.params['0'];
  url += "?token=ttlJM3OyWi8WM07CO5i674yv5pqVh13g&context=APS&object=dev&recipient=0"
  // var data = {
  //   token : "ttlJM3OyWi8WM07CO5i674yv5pqVh13g",
  //   context : 'APS',
  //   object : 'dev',
  //   recipient : '0'
  // };
  console.log(url);

  request.get(url, function(err, response, body)
    {
      var json = JSON.parse(body);
      console.log(json.gateway_error);
      if (json.gateway_error == true)
      {
    res.status(422).end();
      }
      else {
    res.send(body);
    res.status(200).end();
      }
  });

};

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
      if(err)
      res.status(204);
      else{
        updateMeetingFile(base_url,body.id, req.cookies.cskey);
        res.send(body);
        res.status(200).end();
      }
  });
};

var updateMeetingFile = function(base_url, id, cskey){
  let url = base_url+"/questionnaire-replies/"+id+"?session-key="+cskey;

  request.get(url, function(err, response, body)
  {
      let json = JSON.parse(body);
      if(json.status === "ok") {
        var fs = require('fs');

        var chaine = fs.readFileSync("liste.json", "UTF-8");
        var list = JSON.parse(chaine);

        console.log("updateMeetingFile");
        console.log(json.resources[0]);
        json.resources[0].questionnaireReply = {
          resource : "questionnaire-replies/"+id
        };

        list.push(json.resources[0]);
        fs.writeFileSync("liste.json", JSON.stringify(list), "UTF-8");
      }
  });
}

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
    /*let url = create_url(base_url, '/questionnaire-replies-metadata', {'session-key': req.cookies.cskey});
    console.log(url);
    request.get(url, function(err, response, body)
		{
      try{
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
  }
  catch(ex){
    res.status(500).end()
  }
});*/

     var fs = require('fs');
     var chaine = fs.readFileSync("liste.json", "UTF-8");
     var json = JSON.parse(chaine);

     res.send(json);
     res.status(200).end();
};

var	webServiceGetMeetings = function(req, res, base_url)
{
     var fs = require('fs');
     var chaine = fs.readFileSync("liste.json", "UTF-8");
     var tab = JSON.parse(chaine);

     var json ={
       status : "ok",
       resources : tab
     };

     res.send(json);
     res.status(200).end();
}

exports.webServiceGetMeetings = webServiceGetMeetings;
exports.addMeeting = addMeeting;
exports.verifyByAPI = verifyByAPI;
exports.updateCompany = updateCompany;
exports.updateMeetingReply = updateMeetingReply;
exports.get_list = get_list;
exports.set_themes = set_themes;
exports.addCompany = addCompany;
