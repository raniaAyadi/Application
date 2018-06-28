function AppendixQuestionnaireReplyItem(obj){
  Item.call(this, obj);
  this.label = "Réponses au questionnaires";
}

AppendixQuestionnaireReplyItem.prototype = Object.create(Item.prototype);
AppendixQuestionnaireReplyItem.prototype.constructor = AppendixQuestionnaireReplyItem;
