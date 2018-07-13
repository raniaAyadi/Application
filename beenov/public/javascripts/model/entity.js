function Entity(obj){
  if(obj){
    obj = obj.resources ? obj.resources[0] : obj;

    this.id = obj.id;
    this.name = obj.name;
    this.setSubentities(obj.subentities);
  }
}

Entity.prototype.setSubentities = function(data){
  this.subentities = new Array();
  if(data)
    data.forEach((sub)=>{
      var x = new Entity(sub);
      x.entity = this.id;
      this.subentities.push(x);
    });
}

Entity.getAll = function(){
  var deferred = new $.Deferred();
  if(Entity.allEntities)
    deferred.resolve();
  else
    $.get(CONST.url.getAllEntities).done((data) => {
      Entity.allEntities = new Array();
      data.resources.forEach( e => Entity.allEntities.push(new Entity(e)));
      deferred.resolve();
    });

  return deferred;
};

Entity.getSubentity = function(id){
  return $.get(CONST.url.getSubentity + id);
};

Entity.prototype.isEntity = function(){
  return this.entity === undefined;
};

Entity.prototype.setUsers = function(){
  var deferred = new $.Deferred();
  var fn = this.isEntity() ? User.prototype.isMyEntity : User.prototype.isMySubentity;

  User.getAll().done(() => {
    this.users = User.allUsers.filter( u => fn.call(u, this.id));
    deferred.resolve();
  });

  return deferred;
};
