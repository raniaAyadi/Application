/*
** Require lib
*/
const	express = require('express'); /* Framework serveur */
const	body_parser = require('body-parser'); /* Parsing json et url */
const	cookieParser = require('cookie-parser');
/*
** Require perso
*/
const	session = require("./session"); /* fonction qui font le café */
const	client = require("./client");
const	meeting = require("./meeting");
const	questionnaire = require("./questionnaire");
/*
** Basic info
*/
const	port = 80;
const	app = express();
const	base_url = "http://www.beenov.fr/core/v1" /* BDD beenov */
//const	base_url = "http://beenov.ccir-aquitaine.widmee.com:8001/v1"
const	protocol_version = 5;


/*
** Crée chemin pour tous les .html en ./beenov/public | Ex : "http://0.0.0.0/login.html"  => ouvre sur la page login.html
*/

app.use(express.static(__dirname + '/../public/stylesheets'));
app.use(express.static(__dirname + '/../public/images'));
app.use(express.static(__dirname + '/../public/front'));
app.use(express.static(__dirname + '/../public/javascripts'));
app.use(express.static(__dirname + '/../public/Htmleditor'));


/*
** Ajout read format Json(de grande taille) et URL
*/
app.use(cookieParser());
app.use(body_parser.json({parameterLimit: 10000, extended: false, limit: 1024 * 1024 * 10}));
app.use(body_parser.urlencoded({parameterLimit: 10000, extended: false, limit: 1024 * 1024 * 10}));

/*
** METHOD post pour connexion interface conseiller
*/
app.post('/userlogin', function(req, res)
	 {
	     let mail = req.body.mail;
	     let mdp = req.body.mdp

	     session.login_user(mail, mdp, protocol_version, base_url, res);
	 });

	 app.post('/savereport', function(req, res)
	 	 {
	 	     console.log("POST savereport");
	 	     let data = req.body;
	 	     questionnaire.savereport(req, res, base_url, data)
	 	 });

app.post('/addReport', function(req, res){
	let data = req.body;
	questionnaire.addReport(req, res, base_url, data);
});

app.get('/verifyByAPI/*', function(req, res){
	meeting.verifyByAPI(req, res);
});

app.post('/addCompany', function(req, res){
	let data = req.body;
	meeting.addCompany(req, res, base_url, data);
});

	app.post('/updateReport/*', function(req, res){
		let data = req.body;
		questionnaire.updateReport(req, res, base_url, data);
	});

	app.post('/generatePDF', function(req, res){
		let data = req.body;
		questionnaire.generatePDF(req, res, base_url, data);
	})

	app.get('/getReport/*', function(req, res){
		let data = req.body;
		questionnaire.getReport(req, res, base_url, data);
	});

app.get('/getAverage', function(req, res){
	let data = req.body;
	questionnaire.getAverage(req, res, base_url ,data);
});

app.post('/mailAutoDiag',function(req,res)
	{		let data = req.body;
			session.mailToUser(req, protocol_version, base_url, res,data.mail, data.subject, data.msg);
	});

app.post('/lostpwd', function(req, res)
	 {
	     let mail = req.body.mail;

	     session.newpwd(req,mail, protocol_version, base_url, res);
	 });

app.post('/reinit_pwd', function(req, res)
	 {
	     let mdp1 = req.body.mdp1;
	     let mdp2 = req.body.mdp2;

	     session.reinitpwd(mdp1, mdp2, protocol_version, base_url, res, req.cookies.cskey);
	 });

app.post('/change-password', function(req, res)
	 {
	     console.log("POST attempt to change pwd");
	     let data = JSON.stringify({"old-password": req.body["old-password"], "new-password": req.body["new-password"] });

	     session.changemdp(data, protocol_version, base_url, res, req.cookies.cskey);
	 });

app.post('/exportGRC', function(req, res)
	 {
	     console.log("POST grc");
	     let meeting = req.body;
	     session.exportGRC(protocol_version, base_url, res, req.cookies.cskey, meeting);
	 });

app.post('/givemeeting', function(req, res)
	 {
	     console.log("POST transfert_meet");
	     let data = req.body;
	     session.changeowner(protocol_version, base_url, res, req.cookies.cskey, data);
	 });

app.post('/delete', function(req, res)
	 {
	     console.log("POST deletion");
	     let data = req.body;
	     session.removemeeting(protocol_version, base_url, res, req.cookies.cskey, data);
	 });

app.post('/getquest', function(req, res)
	 {
	     console.log("POST getquest");
	     let data = req.body;
	     questionnaire.get_quest(protocol_version, base_url, res, req.cookies.cskey, data);
	     //res.end();
	 });

app.post('/helpsheet', function(req, res)
	 {
	     console.log("POST helpsheet");
	     let data = req.body;
	     questionnaire.helpsheet(protocol_version, base_url, res, req.cookies.cskey, data);
	     //res.end();
	 });

app.post('/onehelp', function(req, res)
	 {
	     console.log("POST onehelp");
	     let data = req.body;
	     questionnaire.onehelp(protocol_version, base_url, res, req.cookies.cskey, data);
	     //		res.end();
	 });

app.post('/send_questionnaire', function(req, res)
	 {
	     console.log("POST send_questionnaire");
	     questionnaire.post_questionnaire_data(req, res, base_url, req.body);
	 });

app.post('/radarchart', function(req, res)
	 {
	     console.log("POST radarchart");
	     let data = req.body;
	     questionnaire.radarchart(req, res, base_url, data)
	 });

app.post('/scatterchart', function(req, res)
	 {
	     console.log("POST scatterchart");
	     let data = req.body;
	     questionnaire.scatterchart(req, res, base_url, data)
	 });

app.post('/scatterchart2', function(req, res)
	 {
	     console.log("POST scatterchart2");
	     let data = req.body;
	     questionnaire.scatterchart2(req, res, base_url, data)
	 });

app.post('/barchart', function(req, res)
	 {
	     console.log("POST barchart");
	     let data = req.body;
	     questionnaire.barchart(req, res, base_url, data)
	 });

app.post('/firstreport', function(req, res)
	{
	    console.log("GET firstreport");
	    let data = req.body;
	    questionnaire.firstreport(req, res, base_url, data);
	    //res.end();
	});

app.post('/company-quest', function(req, res)
	 {
	     questionnaire.post_questionnaire_entreprise(req, res, base_url);
	 });
/* ----------------------------- */
/* Requetes pour page html */

app.get('/login', function(req, res)
	{
	    client.sendFile(res, "./login.html");

	});



app.get('/lostpwd', function(req, res)
	{
	    console.log("GET lostpwd");
			if(req.cookies.uid == 25629){
				res.redirect("/login");
				res.clearCookie("uid");
				res.clearCookie("cskey");
				res.status(204).end();
		}
		else
	    client.sendFile(res, "./lostpwd.html");
	    //res.end();
	});

app.get("/autoLogin", function(req, res){
	session.autoLogin(protocol_version, base_url, res);
});

app.get('/changepwd', function(req, res)
	{
	    console.log("GET changepwd");
			if(req.cookies.uid == 25629){
				res.redirect("/login");
				res.clearCookie("uid");
				res.clearCookie("cskey");
				res.status(204).end();
		}
		else
	    client.sendFile(res, "./changepwd.html");
	    //res.end();
	});

app.get("/autoDiag/[0-9]*/[0-9]*", function(req, res){
	client.sendFile(res, "./autoDiag.html");
});

app.get('/meeting_list', function(req, res)
	{
	    if(req.cookies.uid == 25629){
				res.clearCookie("uid");
				res.clearCookie("cskey");
				res.redirect("/login");
				res.status(204).end();
		}
		else
			client.sendFile(res, "./meeting_list.html");
	    //res.end();
	});

app.get('/questionnaire', function(req, res)
	{
	    console.log("GET questionnaire")
			if(req.cookies.uid == 25629 || req.cookies.uid == ""){
				res.clearCookie("uid");
				res.clearCookie("cskey");
				res.clearCookie("infomet");
				res.clearCookie("company_info")
				res.redirect("/login");
				res.status(204).end();
		}
		else
	    client.sendFile(res, "./questionnaire.html")
	});

app.get('/popup', function(req, res)
	{
		if(req.cookies.uid == 25629){
			res.clearCookie("uid");
			res.clearCookie("cskey");
			res.redirect("/login");
			res.status(204).end();
	}
	else
	    client.sendFile(res, "./popup.html");
	});

app.get('/company', function(req, res)
	{
		if(req.cookies.uid == 25629){
			res.clearCookie("uid");
			res.clearCookie("cskey");
			res.redirect("/login");
			res.status(204).end();
	}
	else
	    client.sendFile(res, "./company.html");
	});

app.get('/prediag', function(req, res)
	{
		if(req.cookies.uid == 25629){
			res.clearCookie("uid");
			res.clearCookie("cskey");
			res.redirect("/login");
			res.status(204).end();
	}
	else
	    client.sendFile(res, "./prediag.html");
	});

/* Requetes dans page html */

app.get('/themes', function (req, res)
	{
	    console.log("AJAX themes groups");
	    meeting.set_themes(req, res, base_url);
	});

app.get("/getCompanyById/*", function(req, res){
	questionnaire.getCompanyById(req, res,base_url);
})

app.get('/get_meeting_list', function(req, res)
	{
	    console.log("AJAX Request done on get_meeting_list");
	    meeting.get_list(req, res, base_url);
	});

app.get('/get_users', function(req, res)
	{
	    console.log("GET list of users");
	    session.get_users(protocol_version, base_url, req, res, req.cookies.cskey);
	});

app.get('/questionnaire-entreprise', function(req, res)
	{
	    console.log("GET questionnaire-entreprise")
	    questionnaire.questionnaire_entreprise(req, res, base_url);
	});

app.post('/questionnaire-replies', function(req, res){
	let data = req.body;
	meeting.addMeeting(req, res, base_url, data);
});

app.post('/updateReply/*', function(req, res){
	let data = req.body;
	meeting.updateMeetingReply(req, res, base_url, data);
});

app.post("/updateCompany/*", function(req, res){
	let data = req.body;
	meeting.updateCompany(req, res, base_url, data);
});

app.get('/info-entreprise', function(req, res)
	{
	    questionnaire.info_entreprise(req, res, base_url);
	});

app.get('/info-questionnaire', function(req, res)
	{
	    questionnaire.send_questionnaire_reply(req, res, base_url);
	});


app.get('/api_entreprise', function(req, res)
	{
	    questionnaire.api_entreprise(req, res);
	    console.log("API entreprise");
	});

app.get('/reinit_pwd', function(req, res)
	{
		if(req.cookies.uid == 25629){
			res.clearCookie("uid");
			res.clearCookie("cskey");
			res.redirect("/login");
			res.status(204).end();
	}
	else
	    client.sendFile(res, "./reinit_pwd.html");
	    //res.end();
	});

app.get('/advice_sheet', function(req, res)
	{
	    console.log("GET advice_sheet");
	    questionnaire.fiches_conseil(req, res, base_url);
	    //res.end();
	});

app.get('/product_sheet', function(req, res)
	{
	    console.log("GET product_sheet");
	    questionnaire.fiches_produit(req, res, base_url);
	    //res.end();
	});

app.get('/valid_domains', function(req, res)
	{
	    console.log("GET domains");
	    questionnaire.aide_domains(req, res, base_url);
	    //res.end();
	});

app.get('/valid_means', function(req, res)
	{
	    console.log("GET means");
	    questionnaire.aide_means(req, res, base_url);
	    //res.end();
	});

app.get('/getCompany', function(req, res){
	questionnaire.getCompany(req, res, base_url);
});

app.get('/getQuestReply/*', function(req, res){
	questionnaire.getQuestReply(req, res, base_url);
});

app.get('/valid_industries', function(req, res)
	{
	    console.log("GET industries");
	    questionnaire.aide_industries(req, res, base_url);
	    //res.end();
	});

app.get('/report-templates', function(req, res)
	{
	    console.log("GET report-templates");
	    questionnaire.sumup_basis(req, res, base_url, JSON.parse(req.cookies.infomet).quest);
	    //res.end();
	});

app.get('/report', function(req, res)
	{
	    console.log("GET report");
			console.log(req.cookies);
	    questionnaire.report(req, res, base_url, JSON.parse(req.cookies.infomet).questRep.split("/")[1]);
	    //res.end();
	});



app.get('/user/*', function(req, res){
	session.getUser(req, res, base_url);
});

/* 0 for entity -- 1 for subentity */
app.get('/entity', function(req, res)
	{
	    userid = req.cookies.uid;
	    session.request_userinfo(protocol_version, base_url, res, userid, req.cookies.cskey, 0);
	});

app.get("/getSubentity/*", function(req, res){
	session.getSubentity(req, res, base_url);
});

app.get('/subentity', function(req, res)
	{
	    userid = req.cookies.uid;
	    session.request_userinfo(protocol_version, base_url, res, userid, req.cookies.cskey, 1);
	});

app.get('/infoMail', function(req, res)
	{
			client.sendFile(res, "./infoMail.html");
	});

app.get('/', function(req, res)
	{
	    session.check_connection(req, res, base_url, "/meeting_list");
	});

app.listen(port);



app.get('/test', function(req, res)
	{
		if(req.cookies.uid == 25629){
			res.clearCookie("uid");
			res.clearCookie("cskey");
			res.redirect("/login");
			res.status(204).end();
	}
	else
	    client.sendFile(res, "./test.html");
	    //res.end();
	});
