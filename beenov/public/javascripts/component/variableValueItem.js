function VariableValueItem(obj){
  Item.call(this, obj);
  this.maxValue = obj.maxValue;
  this.name=obj.name;
  this.variableName = obj.variable;

  this.variableValue = null;
}

VariableValueItem.prototype = Object.create(Item.prototype);
VariableValueItem.prototype.constructor = VariableValueItem;

VariableValueItem.prototype.setVariableValue = function(){
  this.variableValue = null;

  return Meeting.getCurrentMeeting().done(()=>{
      var meeting = Meeting.instance.object;
      var variablesGlobales = meeting.quiz.globalVariableValues;

      this.variableValue = variablesGlobales[this.variableName];
    });
};
