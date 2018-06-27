function TemplateSection(obj){
  this.title = obj.title;
  this.setItems(obj.items);
}

TemplateSection.prototype.setItems = function(tab){
  this.items = new Array();

  var l = tab.length;
  for(var i=0; i<l; i++){
    var item = ItemFactory.createItem(tab[i]);
    this.items.push(item);
  }
}
