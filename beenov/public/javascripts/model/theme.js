function Theme(obj){
  obj = obj.resources ? obj.resources[0] : obj;

  this.id = obj.id;
  this.name = obj.name;
  this.setThemes(obj.themes);
}

Theme.prototype.setThemes = function(data){
  this.themes = new Array();
  if(data)
    data.forEach(th=>{
      var x = new Theme(th);
      x.themeGroup = this.id;
      x.questionnaire = Operation.getId(th.questionnaire.resource);

      this.themes.push(x);
    })
};

Theme.getAllThemes = function(){
  var deferred = new $.Deferred();

  if(Theme.allThemes)
    deferred.resolve();
  else
    $.get(CONST.url.getAllThemes).done((data) =>{
      Theme.allThemes = new Array();
      data.resources.forEach( th => Theme.allThemes.push(new Theme(th)));
      deferred.resolve();
    });

  return deferred;
};

Theme.getThemeById = function(id){
  var deferred = new $.Deferred();

  Theme.getAllThemes().done(() => {
    var th = Theme.allThemes.find( elt => elt.id == id);
    deferred.resolve(th);
  });

  return deferred;
};
