function Section(obj){
  this.title = obj ? obj.title : new String();
  this.questions = new Array();

  if(obj)
    this.setQuestions(obj.questions);
}

Section.prototype.setQuestions = function(tab){
  var l = tab.length;

  for(var i=0; i<l; i++){
    this.questions.push(new Question(tab[i]));
  }
}

Section.prototype.getQuestion = function(id){
  var l = this.questions.length;

  for(var i=0; i<l; i++){
    var q = this.questions[i];
    if(q.id == id)
      return q;
  }

  return null;
}

Section.prototype.appRules = function(){
  var l = this.questions.length;

  for(var i=0; i<l; i++)
    this.questions[i].appRules();
}
