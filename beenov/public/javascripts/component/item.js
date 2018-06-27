function Item(obj){
  this.type = obj.type;
  this.comment =obj.comment ? obj.comment : null;
  this.visible = obj.visible ? obj.visible : false;
}
