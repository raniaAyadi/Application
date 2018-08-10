var Report ={
  getReports : function(){
    return $.get(CONST.url.getReports);
  },

  getReportById : function(id){
    return $.get(CONST.url.getReportById+"/"+id);
  },

  updateReport : function(id, report){
    var x = report.getJSON();
    var xhr = new XMLHttpRequest();

    xhr.open("POST", CONST.url.updateReport+"/"+id);
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.send(JSON.stringify(x));

    return xhr;
  },

  generatePDF : function(report){
    var x = report.getJSON();
    var xhr = new XMLHttpRequest();

    xhr.open("POST", CONST.url.generatePDF);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Accept-language", 'fr-FR,en;q=0.5');
    xhr.setRequestHeader("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
    xhr.send(JSON.stringify(x));

    return xhr;
  },

  generateEmptyPDF : function(quest){
    var x = {
      questionnaire : {
        resource : quest
      }
    };
    var xhr = new XMLHttpRequest();

    xhr.open("POST", CONST.url.generateEmptyPDF);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Accept-language", 'fr-FR,en;q=0.5');
    xhr.setRequestHeader("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
    xhr.send(JSON.stringify(x));

    return xhr;
  },

  addReport : function(report){
    var x = report.getJSON();
    var xhr = new XMLHttpRequest();

    xhr.open("POST", CONST.url.addReport);
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.send(JSON.stringify(x));

    return xhr;
  }
};
