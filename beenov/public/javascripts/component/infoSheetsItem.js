function InfoSheetsItem(obj){
  Item.call(this, obj);
  this.titre = "Les Fiches";
  this.label = "Glisser et déposer des fiches depuis le panier pour en ajouter";
  this.infoSheets = obj.infoSheets ? obj.infoSheets : new Array();
}

InfoSheetsItem.prototype = Object.create(Item.prototype);
InfoSheetsItem.prototype.constructor = InfoSheetsItem;

InfoSheetsItem.prototype.addInfoSheet = function(resource){
  var obj = {
    resource : resource
  };

  this.infoSheets.push(obj);
};

InfoSheetsItem.prototype.removeInfoSheet = function(resource){
  this.infoSheets = this.infoSheets.filter(
    elt => elt.resource != resource
  );
}
