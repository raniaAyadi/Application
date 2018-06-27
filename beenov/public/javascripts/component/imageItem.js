function ImageItem(obj){
  Item.call(this, obj);
  this.label = "";
}

ImageItem.prototype = Object.create(Item.prototype);
ImageItem.prototype.constructor = ImageItem;
