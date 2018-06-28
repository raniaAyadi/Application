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
      selectAllMeeting : 'get_meeting_list',
      getThemes :'themes',
      getCompanyQuiz : 'questionnaire-entreprise',
      getCompany : 'info-entreprise',
      getQuiz : 'getquest',
      getQuizReply : 'info-questionnaire',
      getReports : 'report',
      getReportById : 'getReport',
      updateReport : 'updateReport',
      generatePDF : 'generatePDF',
      downloadPDF : 'downloadPDF/'
    },

    cookie : {
      currentMeeting : 'infomet'
    },

    component :{
      lastReportName : "Dernier Rapport"
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
      cfa : 'cfa'

    }
}
