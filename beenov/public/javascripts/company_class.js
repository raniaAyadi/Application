function Company(obj){
  this.siret = obj ? obj.siret : null;
  this.name = obj ? obj.name : null;
  this.nafCode = obj ? obj.nafCod : null;
  this.workForce = obj ? obj.workForce : null;
  this.owner = obj ? obj.owner : null;
  this.industry = obj ? obj.industry : null;
  this.id = obj ? obj.id : null;
}

Company.prototype.getActivity = function(){
  return CONST.sector_list[this.industry];
}

Company.getCompany = function(siret){
  return $.ajax({
    type : "GET",
  	url : CONST.url.getCompany,
    data : {
      siret : siret
    },
  	datatype: "json"
  });
}
