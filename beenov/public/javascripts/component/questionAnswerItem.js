function QuestionAnswerItem(obj){
  Item.call(this, obj);
  this.label = obj.label;
  this.question = Operation.getId(obj.question.resource);
}

QuestionAnswerItem.prototype = Object.create(Item.prototype);
QuestionAnswerItem.prototype.constructor = QuestionAnswerItem;

QuestionAnswerItem.prototype.setQuestion = function(){
  return Meeting.getCurrentMeeting().done(()=>{
    var meeting = Meeting.instance.object;
    this.question = meeting.getQuestion(this.question);
  }).promise();
};

QuestionAnswerItem.prototype.getAnswer = function(){
  return this.question.getAnswerData();
};

QuestionAnswerItem.prototype.getJSON = function(){
  var json = {};
  json.comment = this.comment;
  json.label = this.label;
  json.type = this.type;
  json.answer = this.question.answer;
  json.visible = this.visible;

  json.question = {};
  json.question.resource = "questions/"+this.question.id;

  return json;
}
