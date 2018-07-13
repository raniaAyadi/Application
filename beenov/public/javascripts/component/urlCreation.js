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

UrlCreation.prototype.setSubentitiesUsers = function(id){
  var deferred = $.Deferred();

  var subentity = this.entity.subentities.find( elt => elt.id == id);
  if(! subentity){
    deferred.reject("subentity not found, verify your id");
    return deferred;
  }

  subentity.setUsers().done(() => deferredr.resolve());
  return deferred;
};
