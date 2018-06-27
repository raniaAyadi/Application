function PageJumpItem(obj){
  Item.call(this, obj);

}

PageJumpItem.prototype = Object.create(Item.prototype);
PageJumpItem.prototype.constructor = PageJumpItem;
