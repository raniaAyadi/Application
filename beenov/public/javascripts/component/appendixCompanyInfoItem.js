function AppendixCompanyInfoItem(obj){
  Item.call(this, obj);
  this.label = "Fiche signalétique de l'entreprise";
}

AppendixCompanyInfoItem.prototype = Object.create(Item.prototype);
AppendixCompanyInfoItem.prototype.constructor = AppendixCompanyInfoItem;
