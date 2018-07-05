function ChartItem(obj){
  Item.call(this, obj);

  this.chartType = obj.chartType;
  this.title = obj.title;
  this.valueDisplayType = obj.valueDisplayType;
  this.maxValue = obj.maxValue;
  this.options = obj.options;

  this.labelColors = obj.labelColors;
  this.labels = obj.labels;

  this.width = obj.width ? obj.width : 550;
  this.height = obj.height ? obj.height : 300;

  this.dataSeriesNames = new Array();
  this.dataSeriesColors = new Array();
  this.dataSeries = obj.dataSeries;

  if(obj.dataSeries){
    this.setDataSeriesColors(obj.dataSeries);
    this.setDataSeriesNames(obj.dataSeries);
    this.dataSeriesValues = {};
  }

  else{
    this.dataSeriesNames = obj.dataSeriesNames;
    this.dataSeriesColors = obj.dataSeriesColors;
    this.dataSeriesValues = obj.dataSeriesValues;
  }
}

ChartItem.prototype = Object.create(Item.prototype);
ChartItem.prototype.constructor = ChartItem;

ChartItem.prototype.setDataSeriesColors = function(data){
  var l = data.length;
  for (var i=0; i<l ;i++)
    this.dataSeriesColors.push(data[i].color);
}

ChartItem.prototype.setDataSeriesNames = function(data){
  var l = data.length;
  for (var i=0; i<l ;i++)
    this.dataSeriesNames.push(data[i].name);
}

ChartItem.prototype.setDataSeriesValues = function(data){
  var l = data.length;
  this.dataSeriesValues = new Array();

  return Meeting.getCurrentMeeting().done(()=>{

      for(var i=0; i<l; i++){
        switch (data[i].sourceType){
          case CONST.chart.sourceType.list :
          var values = Meeting.instance.object.quiz.globalVariableValues[data[i].list]

          this.dataSeriesValues.push(values);
          break;

          case CONST.chart.sourceType.variables :
          var l2 = data[i].variables.length;
          var values = new Array();

          for(var j=0; j<l2; j++){
            var name = data[i].variables[j];
            var value = Meeting.instance.object.quiz.globalVariableValues[name];

            if(value === "")
              value = 0;
            values.push(parseFloat(value));
          }

          if(values.length === 1)
            value = parseFloat(values);

          this.dataSeriesValues.push(values);
          break;
        }
      }
    });
};

ChartItem.prototype.setData = function(){
  var json = {};
  var deferred = new $.Deferred();

  this.setDataSeriesValues(this.dataSeries).done(()=>this.getChart(deferred));

  return deferred.promise();
};

ChartItem.prototype.getChart = function(deferred){
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/barchart");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.responseType = 'arraybuffer';

  var obj = this;
  xhr.onload = function(e){
    obj.data = e.target.response;
    deferred.resolve();
  };

  xhr.send(JSON.stringify(this));
};

ChartItem.prototype.legend = function(){
  var colors = (this.chartType === CONST.chart.type.pie) ?
                this.labelColors : this.dataSeriesColors;
  var names =  (this.chartType === CONST.chart.type.pie) ?
                this.labels : this.dataSeriesNames;

  return {
    colors : colors,
    names : names
  };
};
