function SectionActionsItem(obj){
  Item.call(this, obj);
  // this.label = "The section actions item";
  this.comment= "";
  console.log(this.comment);
}

SectionActionsItem.prototype = Object.create(Item.prototype);
SectionActionsItem.prototype.constructor = SectionActionsItem;
