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
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.send(JSON.stringify(x));

    return xhr;
  },

  downloadPDF : function(url){
    var file = JSON.parse(url);
    file = file.url;
    file =  file.split('/');
    file = file[file.length-1];

    var xhr = new XMLHttpRequest();

    xhr.open("GET", CONST.url.downloadPDF+file);
    xhr.responseType = "arraybuffer";
    xhr.send();
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
