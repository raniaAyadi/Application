function CommentGroupItem(obj){
  Item.call(this, obj);
  this.label = obj.label;
}

CommentGroupItem.prototype = Object.create(Item.prototype);
CommentGroupItem.prototype.constructor = CommentGroupItem;
