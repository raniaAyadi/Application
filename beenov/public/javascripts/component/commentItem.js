function CommentItem(obj){
  Item.call(this, obj);
  this.label = obj.label;
}

CommentItem.prototype = Object.create(Item.prototype);
CommentItem.prototype.constructor = CommentItem;
