function SubsectionTitleItem(obj){
  Item.call(this, obj);
  this.text = obj.text;
}

SubsectionTitleItem.prototype = Object.create(Item.prototype);
SubsectionTitleItem.prototype.constructor = SubsectionTitleItem;
