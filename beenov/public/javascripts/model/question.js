function Question(obj){
  if(obj){
    this.title = obj.text;
    this.helpText = obj.helpText;
    this.id = obj.id;
    this.type = obj.type;
    this.rules = obj.rules;
    this.answer = obj.answer;
    this.typeOptions = obj.typeOptions;
  }
}

Question.prototype.getAnswerData = function(){
  var answerData = {
    answer : null,
    type : this.type
  };
  switch (this.type){
    case CONST.questionType.choice :
    answerData.answer = this.typeOptions.options[this.answer-1];
    break;

    case CONST.questionType.n1Choice :
    answerData.answer = new Array();

    var l = this.answer.length;
    for(var i=0; i<l; i++){
      var obj = {
        row : this.typeOptions.rowLabels[i],
        column : this.typeOptions.columnLabels[this.answer[i]-1]
      };

      answerData.answer.push(obj);
    }
    break;


    case CONST.questionType.nChoices :
    answerData.answer = new Array();
    var l = this.answer.length;

    for(var i=0; i<l; i++){
      var index = this.answer[i]-1;
      answerData.answer.push(this.typeOptions.options[index]);
    }
    break;


    case CONST.questionType.nMTexts :
    answerData.answer = new Array();
    var l = this.answer.length;

    for (var i = 0; i < l ; i++) {
          answerData.answer.push(this.answer[i]);
    }
      break;


    default :
    answerData.answer = this.answer;
  }

  return answerData;
};
