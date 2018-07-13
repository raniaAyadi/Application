function UrlCreation(){
}

UrlCreation.prototype.getAllEntities = function(){
  var deferred = $.Deferred();

  Entity.getAll().done(() => {
    this.entities = Entity.allEntities
    deferred.resolve();
  });

  return deferred;
};

UrlCreation.prototype.setEntity = function(id){
  var deferred = $.Deferred();

  this.entity =  this.entities.find( elt => elt.id == id);
  if(! this.entity){
    deferred.reject("entity nod found, check your id");
    return deferred;
  }

  this.entity.setUsers().done(() => deferred.resolve());
  return deferred;
};

UrlCreation.prototype.getAllThemes = function(){
  var deferred = $.Deferred();

  Theme.getAllThemes().done(()=>{
    this.themes = Theme.allThemes;
    deferred.resolve();
  });

  return deferred;
};

UrlCreation.prototype.setTheme = function(id){
  var deferred = $.Deferred();

  this.theme = this.themes.find( elt => elt.id == id);
  if(! this.theme)
    deferred.reject("theme not found, check your id");
  else
    deferred.resolve();

  return deferred;
}

UrlCreation.prototype.getUsers = function(){
  var idE = this.subentity ? this.subentity.id : this.entity.id;
  var fn = this.subentity ? User.prototype.isMySubentity : User.prototype.isMyEntity;
  var idTh = this.theme.id;

  console.log(fn);
  console.log(idE);
  var users = this.entity.users.filter( elt => (elt.themes.indexOf(idTh) >= 0) && (fn.call(elt, idE))) ;

  return users;
};

UrlCreation.prototype.setSubentity = function(id){
  var deferred = $.Deferred();

  this.subentity = this.entity.subentities.find( elt => elt.id == id);
  if(! this.subentity){
    deferred.reject("subentity not found, verify your id");
    return deferred;
  }

  this.subentity.setUsers().done(() => deferred.resolve());
  return deferred;
};
