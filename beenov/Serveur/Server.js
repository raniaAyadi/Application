/*
** Require lib
*/
const   express = require('express'); /* Framework serveur */
const   body_parser = require('body-parser'); /* Parsing json et url */
const   cookieParser = require('cookie-parser');
/*
** Require perso
*/
const   session = require("./session"); /* fonction qui font le café */
const   client = require("./client");
const   meeting = require("./meeting");
const   questionnaire = require("./questionnaire");
/*
** Basic info
*/
const   port = 80;
const   app = express();
const   base_url = "http://www.beenov.fr/core/v1" /* BDD beenov */
//const base_url = "http://beenov.ccir-aquitaine.widmee.com:8001/v1"
const   protocol_version = 5;


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


        app.post('/updateReport/*', function(req, res){
                let data = req.body;
                questionnaire.updateReport(req, res, base_url, data);
        });

        app.post('/generatePDF', function(req, res){
                let data = req.body;
                questionnaire.generatePDF(req, res, base_url, data);
        })

        app.get('/downloadPDF/*', function(req, res){
                let data = req.body;
                questionnaire.downloadPDF(req, res, data);
        })

        app.get('/getReport/*', function(req, res){
                let data = req.body;
                questionnaire.getReport(req, res, base_url, data);
        });

app.post('/lostpwd', function(req, res)
         {
             let mail = req.body.mail;

             session.newpwd(mail, protocol_version, base_url, res, req.cookies.user_mail);
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
             let data = JSON.stringify({"old-password": req.body["old-password"], "new-password": req.body["new-password"] });

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
             //         res.end();
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
            console.log("GET login");
            client.sendFile(res, "./login.html");
            //res.end();
        });

app.get('/lostpwd', function(req, res)
        {
            console.log("GET lostpwd");
            client.sendFile(res, "./lostpwd.html");
            //res.end();
        });

app.get('/changepwd', function(req, res)
        {
            console.log("GET changepwd");
            client.sendFile(res, "./changepwd.html");
            //res.end();
        });

app.get('/meeting_list', function(req, res)
        {
            console.log("GET meeting_list");
            client.sendFile(res, "./meeting_list.html");
            //res.end();
        });

app.get('/questionnaire', function(req, res)
        {
            console.log("GET questionnaire")
            client.sendFile(res, "./questionnaire.html")
        });

app.get('/popup', function(req, res)
        {
            console.log("GET transfert meeting");
            client.sendFile(res, "./popup.html");
        });

app.get('/company', function(req, res)
        {
            console.log("GET company");
            client.sendFile(res, "./company.html");
        });

app.get('/prediag', function(req, res)
        {
            console.log("GET prediag");
            client.sendFile(res, "./prediag.html");
        });

/* Requetes dans page html */

app.get('/themes', function (req, res)
        {
            console.log("AJAX themes groups");
            meeting.set_themes(req, res, base_url);
        });

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
            console.log("GET reinit_pwd");
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
            questionnaire.report(req, res, base_url, JSON.parse(req.cookies.infomet).questRep.split("/")[1]);
            //res.end();
        });

/* 0 for entity -- 1 for subentity */
app.get('/entity', function(req, res)
        {
            userid = req.cookies.uid;
            session.request_userinfo(protocol_version, base_url, res, userid, req.cookies.cskey, 0);
        });

app.get('/subentity', function(req, res)
        {
            userid = req.cookies.uid;
            session.request_userinfo(protocol_version, base_url, res, userid, req.cookies.cskey, 1);
        });

app.get('/', function(req, res)
        {
            session.check_connection(req, res, base_url, "/meeting_list");
        });

app.listen(port);



app.get('/test', function(req, res)
        {
            console.log("GET test");
            client.sendFile(res, "./test.html");
            //res.end();
        });
