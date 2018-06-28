var ItemFactory = {
  createItem : function(obj){
    switch (obj.type){
      case CONST.itemType.comment :
      return new CommentItem(obj);

      case CONST.itemType.questionAnswer :
      return new QuestionAnswerItem(obj);

      case CONST.itemType.chart :
      return new ChartItem(obj);

      case CONST.itemType.subsectionTitle :
      return new SubsectionTitleItem(obj);

      case CONST.itemType.namedComment :
      return new NamedCommentItem(obj);

      case CONST.itemType.infoSheets :
      return new InfoSheetsItem(obj);

      case CONST.itemType.commentGroup :
      return new CommentGroupItem(obj);

      case CONST.itemType.staticImage :
      return new StaticImageItem(obj);

      case CONST.itemType.image :
      return new ImageItem(obj);

      case CONST.itemType.variableValue:
      return new VariableValueItem(obj);

      case CONST.itemType.smileyRank :
      return new SmileyRankItem(obj);

      case CONST.itemType.appendixCompanyInfo :
      return new AppendixCompanyInfoItem(obj);

      case CONST.itemType.pageJump :
      return new PageJumpItem(obj);

      case CONST.itemType.lineJump :
       return new PageJumpItem(obj);

      case CONST.itemType.sectionActions :
      return new SectionActionsItem(obj);

      case CONST.itemType.sectionHeader :
      return new SectionHeaderItem(obj);

      case CONST.itemType.appendixQuestionnaireReply :
      return new AppendixQuestionnaireReplyItem(obj);
    }
  }
}
