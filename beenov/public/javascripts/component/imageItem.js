function ImageItem(obj){
  Item.call(this, obj);
  this.label = "";
  this.fileName = obj.fileName ? obj.fileName : null;
}

ImageItem.prototype = Object.create(Item.prototype);
ImageItem.prototype.constructor = ImageItem;

ImageItem.prototype.setFileName = function(name){
  this.fileName = "upload_"+name;
}
