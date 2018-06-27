function Item(obj){
  this.type = obj.type;
  this.comment =obj.comment ? obj.comment : null;

  if(obj.visible)
    this.visible = obj.visible;
  else
    this.visible = (obj.visible === undefined) ? true : false;
}
