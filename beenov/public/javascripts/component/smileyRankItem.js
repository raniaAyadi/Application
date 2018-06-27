function SmileyRankItem(obj){
  Item.call(this, obj);
  this.label = obj.label;
  this.variableName = obj.variable;
  this.variableValue = null;
}

SmileyRankItem.prototype = Object.create(Item.prototype);
SmileyRankItem.prototype.constructor = SmileyRankItem;



SmileyRankItem.prototype.setVariableValue = function(){
  this.variableValue = null;

  return Meeting.getCurrentMeeting().done(()=>{
      var meeting = Meeting.instance.object;
      var variablesGlobales = meeting.quiz.globalVariableValues;

      this.variableValue = variablesGlobales[this.variableName];
    });
};
