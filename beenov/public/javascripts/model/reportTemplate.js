function ReportTemplate(obj){
  this.isLandscape = obj ? obj.isLandscape : null;
  this.id = obj.template ? Operation.getId(obj.template.resource) : obj.id;
  this.idReport = obj.template ? obj.id : null;

  this.name = obj ? obj.name : null;
  this.showFirstPage = obj ? obj.showFirstPage : null;
  this.showSubsectionsInToc = obj ? obj.showSubsectionsInToc : null;

  if(obj){
    var aux = obj.sections;
    if(!aux)
      aux = [{
        items : obj.items,
        title : ""
      }];
      this.setSections(aux);
    }

  else
    this.sections = null;
}

ReportTemplate.prototype.setSections = function(tab){
  var l = tab.length;
  this.sections = new Array();

  for(var i=0; i<l; i++){
    var newS = new TemplateSection(tab[i]);
    this.sections.push(newS);
  }
}

ReportTemplate.getAllCurrent = function(){
  if(ReportTemplate.allCurrent === undefined){
    ReportTemplate.allCurrent = new Array();

    return $.ajax({
        type: "GET",
        url: "/report-templates",
        dataType: "json"}
      ).done((data)=>{
        var l = data.resources.length;
        for(var i=0; i<l; i++){
          var newT = new ReportTemplate(data.resources[i]);
          ReportTemplate.allCurrent.push(newT);
        }
      });
    }
};

ReportTemplate.prototype.getJSON = function(){
  var json = {};
  json.company = Meeting.instance.object.quiz.company;
  json["is-landscape"] = this.isLandscape ? this.isLandscape : false;
  json["show-first-page"] = this.showFirstPage;
  json["show-subsections-in-toc"] = this.showSubsectionsInToc;

  json.template = {};
  json.template.resource = "report-templates/"+this.id;
  json.items = new Array();

  json["questionnaire-reply"] = {};
  json["questionnaire-reply"].resource = JSON.parse(Operation.getCookie("infomet")).questRep;


  for(var j in this.sections){
    var s = this.sections[j];
    var obj = {
      type : CONST.itemType.sectionHeader,
      visible : true,
      title : s.title
    };

    var aux = new SectionHeaderItem(obj);
    if(aux.title)
      json.items.push(aux);

    var l = s.items.length;
    for(var i=0; i<l; i++){
      if(s.items[i]){
        if(s.items[i].type === CONST.itemType.questionAnswer)
          json.items.push(s.items[i].getJSON());
          else
          json.items.push(s.items[i]);
        }
      }

    }

  return json;
}

ReportTemplate.getByName = function(name){
  var l = ReportTemplate.allCurrent.length;
  for(var i=0; i<l; i++){
    var temp = ReportTemplate.allCurrent[i];
    if(temp.name == name)
      return temp;
  }
};

ReportTemplate.prototype.getItem = function(idSect, idItem){
  return this.sections[idSect].items[idItem];
};
