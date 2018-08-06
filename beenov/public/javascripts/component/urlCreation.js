function UrlCreation(){
}

UrlCreation.prototype.checkPermission = function(userId){
  var deferred = $.Deferred();

  User.setCurrentUser(userId).done(()=>{
    if(User.currentUser.role === "entity-admin" || User.currentUser.role === "general-admin")
      deferred.resolve();
    else
      deferred.reject();
  });

  return deferred;
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

UrlCreation.prototype.setUser = function(id){
  var users = this.getUsers();
  var user = users.find(elt => elt.id == id);

  this.user = user;
}

UrlCreation.prototype.getAllThemes = function(){
  var deferred = $.Deferred();

  Theme.getAllThemes().done(()=>{
    this.themes = Theme.allThemes;
    deferred.resolve();
  });

  return deferred;
};

UrlCreation.prototype.setTheme = function(id,idSelected){
  var themeGroup = this.themes.find( elt => elt.id == id);
  this.theme = themeGroup.themes.find( elt => elt.id == idSelected );
}

UrlCreation.prototype.getUsers = function(){
  if(!this.entity || !this.theme)
    return [];

  var idE = this.subentity ? this.subentity.id : this.entity.id;
  var idTh = this.theme.themeGroup;
  var fn = this.subentity ? User.prototype.isMySubentity : User.prototype.isMyEntity;


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
