function VariableValueItem(obj){
  Item.call(this, obj);
  this.maxValue = obj.maxValue;
  this.name=obj.name;
  this.variableName = obj.variable;

  this.variableValue = null;
  this.variableAverage = {};
}

VariableValueItem.prototype = Object.create(Item.prototype);
VariableValueItem.prototype.constructor = VariableValueItem;

VariableValueItem.prototype.setVariableValue = function(){
  var deferred = new $.Deferred();

  Meeting.getCurrentMeeting().done(()=>{
    var meeting = Meeting.instance.object;
    var variablesGlobales = meeting.quiz.globalVariableValues;

    this.variableValue = variablesGlobales[this.variableName];

    meeting.getAverage(this.variableName).done((data)=>{
      if(data.status === "ok")
        this.variableAverage = data;

      else
        this.variableAverage = null;

      deferred.resolve();
    });
  });

  return deferred;
};
