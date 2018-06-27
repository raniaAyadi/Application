function SectionHeaderItem(obj){
  Item.call(this, obj);
  this.title = obj.title;
}

SectionHeaderItem.prototype = Object.create(Item.prototype);
SectionHeaderItem.prototype.constructor = SectionHeaderItem;
