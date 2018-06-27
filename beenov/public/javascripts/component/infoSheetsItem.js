function InfoSheetsItem(obj){
  Item.call(this, obj);
  this.titre = "Les Fiches";
  this.label = "Glisser et déposer des fiches depuis le panier pour en ajouter";
}

InfoSheetsItem.prototype = Object.create(Item.prototype);
InfoSheetsItem.prototype.constructor = InfoSheetsItem;
