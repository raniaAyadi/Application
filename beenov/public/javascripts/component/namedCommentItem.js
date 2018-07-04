function NamedCommentItem(obj){
  Item.call(this, obj);
  this.setComment(obj.name);
  //this.comment = "içi on voit le commentaire";


}

NamedCommentItem.prototype = Object.create(Item.prototype);
NamedCommentItem.prototype.constructor = NamedCommentItem;


NamedCommentItem.prototype.setComment = function (name){
    this.comment = "";

  Meeting.getCurrentMeeting().done(()=>{
    var meeting = Meeting.instance.object;
    this.comment = meeting.quiz.globalVariableValues[name]; //renvoie le nom et le text de commentaire
  });
};
