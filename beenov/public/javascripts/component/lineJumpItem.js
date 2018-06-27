function LineJumpItem(obj){
  Item.call(this, obj);
  this.count= obj.count;
}

LineJumpItem.prototype = Object.create(Item.prototype);
LineJumpItem.prototype.constructor = LineJumpItem;
