function User(obj){
  if(obj){
    obj = obj.resources ? obj.resources[0] : obj;

    this.id = obj.id;
    this.email = obj.email;
    this.firstName = obj.firstName;
    this.lastName = obj.lastName;
    this.role = obj.role;
    this.subentity = obj.subentity ? Operation.getId(obj.subentity.resource) : null;
    this.entity = obj.entity ? Operation.getId(obj.entity.resource) : null;

    this.initThemes(obj.themeGroups);
  }
}

User.guestLogin = function(){
  var deferred = $.Deferred();

  $.get(CONST.url.guestLogin).done((data)=>{
    if(data.status === "ok")
      User.getById(data.userId).done( user => deferred.resolve(new User(user)) );
    else
      deferred.reject();
  })

  return deferred;
}

User.prototype.isAdmin = function(){
  return this.role === "entity-admin";
}

User.setCurrentUser = function(user){
  var deferred = $.Deferred();

  if(User.currentUser)
    deferred.resolve();

  if(user instanceof User){
    User.currentUser = user;
    deferred.resolve();
  }
  else if(!isNaN(user)){
    User.getById(user).done((data) => {
      User.currentUser = new User(data);
      deferred.resolve();
    }).fail(() => deferred.reject());
  }

  return deferred;
}

User.prototype.initThemes = function(data){
  this.themes = new Array();
  if(data)
    data.forEach(th => this.themes.push(Operation.getId(th.resource)));
};

User.getAll = function(){
  var deferred = new $.Deferred();

  if(User.allUsers)
    deferred.resolve();
  else
    $.get(CONST.url.getAllUsers).done( data => {
      User.allUsers = new Array();
      data.forEach( u => User.allUsers.push(new User(u)));
      deferred.resolve();
    });

    return deferred;
};

User.getById = function(id){
  var deferred = $.Deferred();

  $.get(CONST.url.getUser + id).done((data)=>{
    if(data.status === "ok")
      deferred.resolve(data);
    else deferred.reject("user not found");
  });

  return deferred;
}

User.prototype.isMySubentity = function(id){
  var idE =  this.subentity instanceof Entity ? this.subentity.id : this.subentity;
  return idE == id;
};

User.prototype.isMyEntity = function(id){
  var idE =  this.entity instanceof Entity ? this.entity.id : this.entity;
  return idE == id;
};

User.prototype.setSubentity = function(){
  var deferred = new $.Deferred();

  Entity.getSubentity(this.subentity).done((data)=>{
    this.subentity = new Entity(data);
    deferred.resolve();
  });

  return deferred;
};

User.prototype.setThemes = function(){
  var deferred = new $.Deferred();

  Theme.getAllThemes().done(()=>{
    for(var i in this.themes)
      if(this.themes[i] instanceof Theme === false)
        this.themes[i] = Theme.allThemes.find( th => th.id == this.themes[i]);

    deferred.resolve();
  });

  return deferred;
};
