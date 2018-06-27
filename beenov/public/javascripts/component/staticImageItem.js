function StaticImageItem(obj){
  Item.call(this, obj);

    this.url = obj.url;
    this.fileName= obj.fileName;
    this.label = obj.label;
}

StaticImageItem.prototype = Object.create(Item.prototype);
StaticImageItem.prototype.constructor = StaticImageItem;
