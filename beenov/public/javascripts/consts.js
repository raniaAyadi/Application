var CONST = {};
CONST.baseUrl = window.location.origin + "/";

var CONST = {
  sector_list : [ "undefined",
                  "Activités alimentaires",
                  "Activités agroalimentaires",
                  "Bois papier carton",
                  "BTP construction",
                  "Commerce",
                  "Electronique",
                  "Equipement industriel",
                  "Fabrication, production",
                  "Hotel, café, restaurant",
                  "Informatique",
                  "Mécanique",
                  "Médical",
                  "Service à la personne",
                  "Service aux entreprises",
                  "TIC",
                  "Autre" ],

    url : {
      selectAllMeeting : CONST.baseUrl + 'get_meeting_list',
      getThemes : CONST.baseUrl + 'themes',
      getCompanyQuiz : CONST.baseUrl + 'questionnaire-entreprise',
      getCompany : CONST.baseUrl + 'info-entreprise',
      getQuiz : CONST.baseUrl + 'getquest',
      getQuizReply : CONST.baseUrl + 'info-questionnaire',
      getReports : CONST.baseUrl + 'report',
      getReportById : CONST.baseUrl + 'getReport',
      updateReport : CONST.baseUrl + 'updateReport',
      generatePDF : CONST.baseUrl + 'generatePDF',
      addReport : CONST.baseUrl + 'addReport',
      getAverage : CONST.baseUrl + 'getAverage',
      getCompany : CONST.baseUrl + "getCompany",
      getQuestReply : CONST.baseUrl + "getQuestReply",
      updateReply : CONST.baseUrl + "updateReply/",
      addCompany : CONST.baseUrl + "addCompany",
      addReply : CONST.baseUrl + "questionnaire-replies",
      updateCompany : CONST.baseUrl + "updateCompany/",
      verifyByAPI : CONST.baseUrl + "verifyByAPI/",
      getAllEntities : CONST.baseUrl + 'entities',
      getAllUsers : CONST.baseUrl + "get_users",
      getUser : CONST.baseUrl + 'user/',
      getSubentity : CONST.baseUrl + 'getSubentity/',
      getAllThemes : CONST.baseUrl + 'themes',
      getCompanyById : CONST.baseUrl + 'getCompanyById/',
      login : CONST.baseUrl + "login",
      autoDiag : CONST.baseUrl + "autoDiag/",
      sendQuestReply : CONST.baseUrl + "send_questionnaire",
      guestLogin : CONST.baseUrl + "autoLogin",
      mailAutoDiag : CONST.baseUrl + "mailAutoDiag"
    },

    rule :{
      globalRuelSetVar : "GlobalRuleSetVar",
      globalRuelSetVarCond : "GlobalRuleSetVarCond",
      ruleSetVar : "RuleSetVar",
      ruleSetVarCond : "RuleSetVarCond"
    },

    APIEntreprise :{
      url : "https://entreprise.api.gouv.fr/v2/etablissements/",
      CCI_AQUITAINE_SIRET : "13002249400012",
      RENAULT_BORD_SIRET : "31221230102076",
      token : "ttlJM3OyWi8WM07CO5i674yv5pqVh13g",
      context : 'APS',
      recipient : '0',
      object : 'dev'
    },
    
    cookie : {
      currentMeeting : 'infomet',
      currentUser : "uid",
      sessionKey : "cskey",
    },

    component :{
      lastReportName : "Dernier Rapport",
      advice : "advice-info-sheets",
      semaphore : "semaphore-info-sheet-descriptors",
      product : "product-info-sheets"
    },

    companyQuizTitles : {
      date : 'Date de création',
      NAF : 'Code NAF',
      name : "Dénomination sociale / Nom de l'entreprise",
      SIRET : 'Numéro SIRET',
      address : 'Adresse',
      city : 'Localité / Ville',
      postalCode : 'Code postal',
    },

    itemType : {
      comment : 'comment',
      questionAnswer : 'question-answer',
      chart : 'chart',
      subsectionTitle : 'subsection-title',
      staticImage : 'static-image',
      appendixCompanyInfo : 'appendix-company-info',
      pageJump : 'page-jump',
      image : 'image',
      smileyRank : 'smiley-rank',
      lineJumb : 'line-jump',
      sectionActions : 'section-actions',
      variableValue : 'variable-value',
      namedComment : 'named-comment',
      infoSheets : 'info-sheets',
      commentGroup : 'comment-group',
      sectionHeader : 'section-header',
      appendixQuestionnaireReply : 'appendix-questionnaire-reply'
    },

    chart : {
      width : 550,
      height : 300,
      type : {
        bar : 'bar',
        pie : 'pie',
        radar : 'radar'
      },
      data : "data:image/png;base64,",
      sourceType : {
        list : "list",
        variables : "variables"
      }
    },

    questionType : {
      text : "text",
      choice : '1Choice',
      nChoices : 'nChoices',
      porterMatrix : "porterMatrix",
      textarea : 'textarea',
      nTexts : 'nTexts',
      nMTexts : 'nMTexts',
      nMLongTexts : 'nMLongTexts',
      n1Choice : 'n1Choice',
      city : 'city',
      groupableComment : 'groupableComment',
      cfa : 'cfa',
      textType : {
        free : 'free',
      siret : 'siret',
      datepicker : 'datepicker',
      naf : 'naf',
      percent : 'percent',
      zipcode : 'zipcode',
      email : 'email',
      numeric : 'numeric'
      }

    },

}
