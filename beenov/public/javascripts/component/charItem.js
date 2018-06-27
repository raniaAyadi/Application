function ChartItem(obj){
  Item.call(this, obj);
  this.title = obj.title;
  this.labelColors = obj.labelColors;
  this.labels = obj.labels;
  this.maxValue = obj.maxValue;
  this.options = obj.options;
  this.chartType = obj.chartType;
  this.valueDisplayType = obj.valueDisplayType;
  this.dataSeries = obj.dataSeries;

  this.width = CONST.chart.width;
  this.height = CONST.chart.height;
  this.data = {};
  this.labelColors = obj.labelColors;
  this.labels = obj.labels;

  if(obj.dataSeries)
    this.setDataSeries(obj.dataSeries);

  this.dataSeriesNames = obj.dataSeriesNames;
  this.dataSeriesColors = obj.dataSeriesColors;
  this.dataSeriesValues = obj.dataSeriesValues;
}

ChartItem.prototype = Object.create(Item.prototype);
ChartItem.prototype.constructor = ChartItem;

ChartItem.prototype.setDataSeries = function(obj){
  var length = obj.length;
  this.dataSeriesNames = new Array();
  this.dataSeriesColors = new Array();

  for(var i=0; i<length ;i++){
    this.dataSeriesNames.push(obj[i].name);
    this.dataSeriesColors.push(obj[i].color);
  }
};

ChartItem.prototype.setData = function(){
  var json = {};
  var deferred = new $.Deferred();

  Meeting.getCurrentMeeting().done(()=>{
    var meeting = Meeting.instance.object;
    var globalVariableValues = meeting.quiz.globalVariableValues;

    switch (this.chartType){
      case CONST.chart.type.bar :
      json = Operation.create_barchart_json(this, globalVariableValues);
      break;

      case CONST.chart.type.radar :
      json = Operation.create_radarchartV2_json(this, globalVariableValues);
      break;

      case CONST.chart.type.pie :
      json = Operation.create_piechart_json(this, globalVariableValues);
      break;

    }

  }).done(()=>{
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/barchart");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.responseType = 'arraybuffer';

    var obj = this;
    xhr.onload = function(e){
      obj.data = e.target.response;
      deferred.resolve();
    };

    this.dataSeriesNames = json.dataSeriesNames;
    this.dataSeriesColors = json.dataSeriesColors;
    this.dataSeriesValues = json.dataSeriesValues;

    xhr.send(JSON.stringify(json.data));
  });

  return deferred.promise();
};

ChartItem.prototype.legend = function(){
  var colors = (this.chartType == CONST.chart.type.pie) ? this.labelColors : this.dataSeriesColors;
  var names = (this.chartType == CONST.chart.type.pie) ? this.labels : this.dataSeriesNames;
  var index = this.dataSeriesNames ? this.datathis.dataSeriesNames.length : 0;
  return {
    colors : colors,
    names : names,
    index : index
  };
};
