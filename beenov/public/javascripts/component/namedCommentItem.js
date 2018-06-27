function NamedCommentItem(obj){
  Item.call(this, obj);
  // this.setComment(obj.name);
  this.comment = "içi on voit le commentaire";
console.log(this.comment);
console.log("named comment");
}

NamedCommentItem.prototype = Object.create(Item.prototype);
NamedCommentItem.prototype.constructor = NamedCommentItem;

// NamedCommentItem.prototype.setComment = function (name){
//   this.comment = {
//     name : name,
//     text : "içi on voit le commentaire"
//   };
  //
  // Meeting.getCurrentMeeting().done(()=>{
  //   var meeting = Meeting.instance.object;
  //   this.comment = meeting.getCommentByName(name); //renvoie le nom et le text de commentaire
  //};
// };
