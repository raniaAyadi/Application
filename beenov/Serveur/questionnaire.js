const   request = require('request');
const	questions = require('./question_type');

function        create_get_url(base_url, path_url, data)
{
    let url_params = '?' + Object.keys(data).map((i) => i+'='+data[i]).join('&');
    let url = base_url + path_url + url_params;
    return (url);
}

function	parse_question(question)
{
    let json;

    json = { 'text': question.text, 'helpText': question.helpText, 'id': question.id, 'type': question.responseSpec.type, 'rules': question.rules, 'mandatory': false, 'displayCondition': question.displayCondition};

    if (json.type == "text")
    {
	json.typeOptions = questions.type_text(question);
    }
    else if (json.type == "nTexts")
    {
	json.typeOptions = questions.type_nTexts(question);
    }
    else if (json.type == "1Choice" || json.type == "nChoices")
    {
	json.typeOptions = questions.type_1Choice(question);
    }
    else if (json.type == "nMTexts" || json.type == "nMLongTexts" || json.type == "n1Choice")
    {
	json.typeOptions = questions.type_nM(question);
    }
    if (question.mandatoryP == true)
    {
	json.mandatory = true;
    }
    return(json);
}

function	parse_questionnaireinfo(json_old)
{
    let		json_new = { 'sections': [], 'id': json_old.resources[0].id, 'rules': json_old.resources[0].rules};
    /* json old */
    let		i = 0;
    let		j;
    /* json new */
    let		k = 0;
    let		l;

    while (json_old.resources[0].sections[i] != undefined)
    {
	j = 0;
	l = 0;
	json_new.sections[k] = { 'title': json_old.resources[0].sections[i].title, 'id':  json_old.resources[0].sections[i].id, questions: [] };
	while (json_old.resources[0].sections[i].questions[j] != undefined)
	{
	    json_new.sections[k].questions[l] = parse_question(json_old.resources[0].sections[i].questions[j]);
	    ++l;
	    ++j
	}
	++i;
	++k;
    }
    return (json_new);
}

var     api_entreprise = function (req, res)
{
    let url =  "https://api.apientreprise.fr/v2/entreprises/" + req.query.siren + "?token=ttlJM3OyWi8WM07CO5i674yv5pqVh13g";

    request.get(url, function(err, response, body)
		{
		    if (err)
		    {
			res.status(204).end();
			return;
		    }
		    else {
			res.send(body);
			res.status(200).end();
		    }
		});
}

var	questionnaire_entreprise = function(req, res, base_url)
{
    let url = create_get_url(base_url, "/questionnaires/company-info", {'session-key': req.cookies.cskey});
    request.get(url, function(err, response, body)
		{
		    let json = JSON.parse(body);
		    if (err || json.status == 'error')
		    {
			res.status(204).end();
			return;
		    }
		    else {
			res.send(parse_questionnaireinfo(json));
			res.status(200).end();
		    }
		});
}

var     info_entreprise = function (req, res, base_url)
{
    let url = create_get_url(base_url, "/companies", { 'session-key': req.cookies.cskey, 'siret':req.query.siret.split('"').join('')});

    let cookie;
    request.get(url, function(comp_err, comp_res, comp_body)
		{
		    if (JSON.parse(comp_body).resources.length == 0)
		    {
			res.send({status: "new"});
			res.status(200).end();
			return;
		    }
		    cookie = { companies: JSON.parse(comp_res.body).resources[0].id };
		    let url2 = create_get_url(base_url, '/' + JSON.parse(comp_body).resources[0].infoQuestionnaireReply.resource, { 'session-key': req.cookies.cskey });
		    request.get(url2, function(reply_err, reply_res, reply_body)
				{
				    cookie.reply = JSON.parse(reply_body).resources[0].id;
				    res.cookie('company_info', JSON.stringify(cookie));
				    res.send(JSON.parse(reply_body));
				    res.status(200).end();
				});
		});
}


var fiches_conseil = function(req, res, base_url)
{
    let url = create_get_url(base_url, "/advice-info-sheets", {'session-key': req.cookies.cskey});
    request.get(url, function(err, response, body)
		{
		    let json = JSON.parse(body);
		    if (err || json.status == 'error')
		    {
			res.status(204).end();
			return;
		    }
		    else
		    {
			res.send(json);
			res.status(200).end();
		    }

		});
}

var fiches_produit = function(req, res, base_url)
{
    let url = create_get_url(base_url, "/product-info-sheets", {'session-key': req.cookies.cskey});
    request.get(url, function(err, response, body)
		{
		    let json = JSON.parse(body);
		    if (err || json.status == 'error')
		    {
			res.status(204).end();
			return;
		    }
		    else
		    {
			res.send(json);
			res.status(200).end();
		    }

		});
}

var lo = function(protocol_version, base_url, res, cskey, data)
{
    let url = create_get_url(base_url, "/" + data.quest, {'session-key': cskey});
    request.get(url, function(err, response, body)
		{
		    let json = JSON.parse(body);
		    if (err || json.status == 'error')
		    {
			res.status(204).end();
			return;
		    }
		    else
		    {
			res.send(parse_questionnaireinfo(json));
			res.status(200).end();
		    }

		});
}

var get_quest = function(protocol_version, base_url, res, cskey, data)
{
    if(parseInt(data.quest))
      var url = create_get_url(base_url, "/questionnaires/" + data.quest, {'session-key': cskey});
    else
      var url = create_get_url(base_url, "/" + data.quest, {'session-key': cskey});
    request.get(url, function(err, response, body)
		{
		    let json = JSON.parse(body);
		    if (err || json.status == 'error')
		    {
			res.status(204).end();
			return;
		    }
		    else
		    {
			res.send(parse_questionnaireinfo(json));
			res.status(200).end();
		    }

		});
}

var getAverage = function(req, res, base_url){
  var idQuest = JSON.parse(req.cookies.infomet).quest;
  var url = base_url+'/companies-average-variable-values?'
  +'company={"resource":"'+req.param("idCompany")+'"}&'+
  'variable-name='+req.param("variableName")+'&session-key='+req.cookies.cskey+
  '&questionnaire={"resource":"'+idQuest+'"}';

  request.get(url, function(err, response, body)
  {
      let json = JSON.parse(body);
      if (err || json.status == 'error')
      {
    res.status(204).end();
      }
      else
      {
    res.send(json);
    res.status(200).end();
      }
  });
}

var     send_questionnaire_reply = function(req, res, base_url)
{
  if(req.param('id'))
    var url = create_get_url(base_url, '/questionnaire-replies/'+req.param('id'), {'session-key': req.cookies.cskey});
  else
    var url = create_get_url(base_url, '/' + JSON.parse(req.cookies.infomet).questRep, {'session-key': req.cookies.cskey});
    request.get(url, function(err, response, body)
		{
		    let json = JSON.parse(body);
		    if (err || json.status == 'error')
		    {
			res.status(204).end();
		    }
		    else
		    {
			res.send(json);
			res.status(200).end();
		    }
		});
}

var aide_domains = function(req, res, base_url)
{
    let url = create_get_url(base_url, '/semaphore/get-valid-domains', {'session-key' : req.cookies.cskey});

    request.get(url, function(comp_err, comp_res, comp_body)
		{
		    res.send(comp_body);
		    res.status(200).end();
		});
}

var aide_means = function(req, res, base_url)
{
    let url = create_get_url(base_url, '/semaphore/get-valid-means', {'session-key' : req.cookies.cskey});

    request.get(url, function(comp_err, comp_res, comp_body)
		{
		    res.send(comp_body);
		    res.status(200).end();
		});
}

var aide_industries = function(req, res, base_url)
{
    let url = create_get_url(base_url, '/semaphore/get-valid-industries', {'session-key' : req.cookies.cskey});

    request.get(url, function(comp_err, comp_res, comp_body)
		{
		    res.send(comp_body);
		    res.status(200).end();
		});
}

var helpsheet = function(protocol_version, base_url, res, cskey, data)
{
    let json = {"ape-code" : data.ape, "city-insee-zip" : data.insee, "department" : data.dept, "domain-id" : data.domain, "industry-id" : data.industry, "means-id" : data.means, "session-key" : cskey};
    let url = create_get_url(base_url, '/semaphore/search-info-sheets', json);

    request.post(
	{
	    url: url,
	    json: json
	}, function(err, resp, body)
	{
	    if (err || body.status == 'error')
	    {
		res.status(204).end();
	    }
	    else
	    {
		res.send(body);
		res.status(200).end();
	    }
	});
}

var onehelp = function(protocol_version, base_url, res, cskey, data)
{
    let url = create_get_url(base_url, "/semaphore-info-sheets/" + data.idsheet, {"session-key" : cskey});

    request.get(url, function(err, resp, body)
		{
		    if (err || body.status == 'error')
		    {
			res.status(204).end();
			return;
		    }
		    else
		    {
			res.send(body);
			res.status(200).end();
		    }
		});
}

var     post_questionnaire_data = function(req, res, base_url, data)
{
    let url;
    var id_new_companies;
    if (req.query.company == "true" && req.query.newent != "true")
    {
	url = create_get_url(base_url, '/questionnaire-replies/' + JSON.parse(req.cookies.company_info).reply, {'session-key': req.cookies.cskey});
    }
    else if (req.query.newquest == "false")
    {
	url = create_get_url(base_url, "/" + JSON.parse(req.cookies.infomet).questRep, {'session-key': req.cookies.cskey});
    }
    else if (req.query.newquest == "true" || req.query.newent == "true")
    {
	if (parseInt(req.query.nbsend) == 0 || req.query.newent == "true")
	{
	    url = create_get_url(base_url, '/questionnaire-replies', {'session-key': req.cookies.cskey});
	}
	else if (parseInt(req.query.nbsend) > 0)
	{
	    url = create_get_url(base_url, '/questionnaire-replies/' + req.cookies.newquest, {'session-key': req.cookies.cskey});
	}
    }
    /* ============================*/
    if (req.query.company == "true" && req.query.newent == "true")
    {
	let company_url = create_get_url(base_url, '/companies', {'session-key': req.cookies.cskey});

	let postBody =
	    '--0123456789\r\n' +
	    'Content-Disposition: form-data; name="siret"\r\n\r\n' +
	    '"' + req.query.siret + '"\r\n' +
	    '--0123456789--\r\n'
	;
	let header = {
	    "Content-Type" : "multipart/form-data; boundary=0123456789",
	    "Content-Length" : Buffer.byteLength(postBody, 'utf8')
	};

	let options = {
	    url: company_url,
	    headers: header,
	    body: postBody,
	}
	request.post(options, function(err, response, body)
		     {
			 if (err)
			 {
			     return;
			 }

			 id_new_companies = JSON.parse(body).id;
			 data.company = {resource: "companies/" + id_new_companies};
			 res.cookie("company_info", JSON.stringify({ 'companies': id_new_companies}));
			 request.post({url: url,
				       json: data},function(err2, response2, body2)
				      {

					  if (err2)
					  {
					      return;
					  }
					  res.status(200).end();
					  let url2 = create_get_url(base_url, '/companies/' + id_new_companies, {'session-key': req.cookies.cskey});
					  request.post({url: url2,
							json: {siret: data.globalVariableValues["company-siret"], 'info-questionnaire-reply':{resource: "questionnaire-replies/" + body2.id }}},
						       function(err3, response3, body3)
						       {
							   if (err)
							   {
							   }
						       })
				      });
		     });
	return;
    }
    /* =================================== */
    request.post({url: url,
		  json: data},function(err, response, body)
		 {
		     if (err || body.status == 'error')
		     {
			 res.status(204).end();
		     }
		     else
		     {
			 if (req.query.newquest == "true" && parseInt(req.query.nbsend) == 0)
			 {
			     res.cookie("newquest", body.id);
			 }
			 if (body.status == "ok")
			     res.status(200).end();
			 else
			     res.status(400).end();
			 if (req.query.company == "true")
			 {

			     let url2;
			     url2 = create_get_url(base_url, '/companies/' + JSON.parse(req.cookies.company_info).companies, {'session-key': req.cookies.cskey});
			     request.post({url: url2,
					   json: {siret: data.globalVariableValues["company-siret"], 'info-questionnaire-reply':{resource: "questionnaire-replies/" + JSON.parse(req.cookies.company_info).reply }}},
					  function(err2, response2, body2)
					  {
					      if (err2 || body2.status == "error")
					      {
					      }
					  });
			 }
		     }
		 });
}

var		sumup_basis = function(req, res, base_url, quest)
{
    let url = (base_url + '/report-templates?' + 'questionnaire={"resource":"' + quest + '"}' + '&session-key=' + req.cookies.cskey);

    request.get(url, function(err, resp, body)
		{
		    if (err || body.status == 'error')
		    {
			res.status(204).end();
			return;
		    }
		    else
		    {
			res.send(body);
			res.status(200).end();
		    }
		});
}


var		radarchart = function(req, res, base_url, json)
{
    let url = create_get_url(base_url, '/radar-chart', {"session-key": req.cookies.cskey});

    request.post(
	{
	    url: url,
	    json: json.data,
	    encoding: null
	}, function(err, resp, body)
	{
	    if (err || body.status == 'error')
	    {
		res.status(204).end();
	    }
	    else
	    {
		res.status(200).end(body);
	    }
	});
}

var		scatterchart = function(req, res, base_url, json)
{
    let url = create_get_url(base_url, '/scatter-chart', {"session-key": req.cookies.cskey});

    let data = {
	"questionnaire":{"resource":json.questionnaire.resource},
	"y-variable-name":json["var-name"].y,
	"y-max-value":parseInt(json.max_values["y-max"]),
	"x-variable-name":json["var-name"].x,
	"industry":parseInt(json.industry),
	"height":parseInt(json.size.height),
	"show-same-size-and-industry-average":false,
	"y-label":json.labels["y"],
	"x-max-value":parseInt(json.max_values["x-max"]),
	"x-value":json.values["x"],
	"x-label":json.labels["x"],
	"width":parseInt(json.size.width),
	"workforce":parseInt(json.workforce),
	"y-value":json.values["y"],
	"show-same-industry-average":false,
	"show-same-size-average":false}

    request.post(
	{
	    url: url,
	    json: data,
	    encoding: null
	}, function(err, resp, body)
	{
	    if (err || body.status == 'error')
	    {
		res.status(204).end(body.status);
	    }
	    else
	    {
		res.status(200).end(body);
	    }
	});
}

var		scatterchart2 = function(req, res, base_url, json)
{
    let url = create_get_url(base_url, '/scatter-chart', {"session-key": req.cookies.cskey});

    request.post(
	{
	    url: url,
	    json: json,
	    encoding: null
	}, function(err, resp, body)
	{
	    if (err || body.status == 'error')
	    {
		res.status(204).end(body.status);
	    }
	    else
	    {
		res.status(200).end(body);
	    }
	});
}

var		barchart = function(req, res, base_url, json)
{
    let url = create_get_url(base_url, '/chart', {"session-key": req.cookies.cskey});

    request.post(
	{
	    url: url,
	    json: json,
	    encoding: null
	}, function(err, resp, body)
	{
	    if (err || body.status == 'error')
	    {
		res.status(204).end();
	    }
	    else
	    {
		res.status(200).end(body);
	    }
	});
}

var generatePDF = function(req, res, base_url, data){
  let url = base_url + '/generate-pdf-report'+'?session-key=' + req.cookies.cskey;
  request.post(
{
    url: url,
    "Accept-Language" : 'fr-FR,en;q=0.5',
    "Accept-Encoding" : 'gzip,deflate',
    "Accept" : "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    json: data,
}, function(err, resp, body)
{
    if (err || body.status == 'error')
    {
  res.send(body);
  res.status(204).end();
    }
    else
    {
  res.send(body);
  res.status(200).end();
    }
});
}


var updateReport = function(req, res, base_url, data){
  let url = base_url + '/reports/'+req.params['0']+'?session-key=' + req.cookies.cskey;
  request.post(
{
    url: url,
    json: data,
}, function(err, resp, body)
{
    if (err || body.status == 'error')
    {
  res.send(body);
  res.status(204).end();
    }
    else
    {
  res.send(body);
  res.status(200).end();
    }
});
}

var addReport = function(req, res, base_url, data){
  let url = base_url + '/reports'+'?session-key=' + req.cookies.cskey;
  request.post(
{
    url: url,
    json: data,
}, function(err, resp, body)
{
    if (err || body.status == 'error')
    {
  res.send(body);
  res.status(204).end();
    }
    else
    {
  res.send(body);
  res.status(200).end();
    }
});
}

var getReport = function(req, res, base_url, data){
  let url = base_url + '/reports/'+req.params['0']+'?session-key=' + req.cookies.cskey;
  request.get(
{
    url: url,
}, function(err, resp, body)
{
    if (err || body.status == 'error')
    {
  res.send(body);
  res.status(204).end();
    }
    else
    {
  res.send(body);
  res.status(200).end();
    }
});
}


var	savereport = function(req, res, base_url, data)
{
    let url = "";
    url += base_url + '/reports?questionnaire-reply={"resource":"questionnaire-replies/' + JSON.parse(req.cookies.infomet).questRep.split("/")[1] + '"}&session-key=' + req.cookies.cskey;

    request.get(url, function(err, response, body)
		{
		    if (err)
		    {
			res.status(204).end();
			return;
		    }
		    else
		    {
			let target = JSON.parse(body).resources[0].id;
			url = create_get_url(base_url, '/chart/' + target, {"session-key": req.cookies.cskey});
			request.post(
			    {
				url: url,
				json: JSON.stringify(body),
				encoding: null
			    }, function(err, resp, stuff)
			    {
				if (err || stuff.status == 'error')
				{
				    res.status(204).end();
				}
				else
				{
				    res.status(200).end(stuff);
				}
			    });
		    }
		});
}

var	report = function(req, res, base_url, idmet)
{
    let url = base_url + '/reports?questionnaire-reply={"resource":"questionnaire-replies/' + JSON.parse(req.cookies.infomet).questRep.split("/")[1] + '"}&session-key=' + req.cookies.cskey;

    request.get(url, function(err, resp, body)
		{
		    if (err || body.status == 'error')
		    {
			res.status(204).end();
			return;
		    }
		    else
		    {
			res.send(body);
			res.status(200).end();
		    }
		});
}

var	firstreport = function(req, res, base_url, data)
{
    let url = base_url + '/reports?session-key=' + req.cookies.cskey;
    request.post(
	{
	    url: url,
	    json: data,
	}, function(err, resp, body)
	{
	    if (err || body.status == 'error')
	    {
		res.send(body);
		res.status(204).end();
	    }
	    else
	    {
		res.send(body);
		res.status(200).end();
	    }
	});
}

var	post_questionnaire_entreprise = function (req, res, base_url)
{
     request.post({url: create_get_url(base_url, "/questionnaire-replies/" + req.query.reply, {'session-key': req.cookies.cskey}),
		  json: req.body}, function(err, response, body)
		 {
		     request.post({url : create_get_url(base_url, '/companies/' + JSON.parse(req.cookies.company_info).companies, {'session-key': req.cookies.cskey}),
				   json : {siret: req.body.globalVariableValues["company-siret"], 'info-questionnaire-reply':{resource: "questionnaire-replies/" + JSON.parse(req.cookies.company_info).reply }}}, function(err2, response2, body2)
				  {
				  });
		 });



}

exports.questionnaire_entreprise = questionnaire_entreprise;
exports.addReport = addReport;
exports.updateReport = updateReport;
exports.generatePDF = generatePDF;
exports.getReport = getReport;
exports.fiches_conseil = fiches_conseil;
exports.fiches_produit = fiches_produit;
exports.info_entreprise = info_entreprise;
exports.get_quest = get_quest;
exports.send_questionnaire_reply = send_questionnaire_reply;
exports.aide_domains = aide_domains;
exports.aide_means = aide_means;
exports.aide_industries = aide_industries;
exports.helpsheet = helpsheet;
exports.onehelp = onehelp;
exports.post_questionnaire_data = post_questionnaire_data;
exports.sumup_basis = sumup_basis;
exports.radarchart = radarchart;
exports.scatterchart = scatterchart;
exports.scatterchart2 = scatterchart2;
exports.barchart = barchart;
exports.api_entreprise = api_entreprise;
exports.savereport = savereport;
exports.getAverage = getAverage;
exports.report = report;
exports.post_questionnaire_entreprise = post_questionnaire_entreprise;
exports.firstreport = firstreport;
