var Operation = {
  IndustryType : function	(nb){
  	for (let i = 0; i < 17; i++)
  	{
  	    if (i == nb)
  		return (CONST.sector_list[i]);
  	}
  	return ("error");
  },

  invert_date : function(date){
    if(date){
  	   let	pieces = date.split('/');
  	    pieces.reverse();
  	     return (pieces.join('-'));
       }
    else
      return null;
  },

  convertObjectToArray : function(obj){
    var tab = new Array();
    for(var i in obj){
      tab.push(obj[i]);
    }

    return tab;
  },

  getCookie : function(cname){
    var name = cname + "=";
  	var decodedCookie = decodeURIComponent(document.cookie);
  	var ca = decodedCookie.split(';');
  	for(var i = 0; i <ca.length; i++)
  	{
  		var c = ca[i];
  		while (c.charAt(0) == ' ')
  		{
  			c = c.substring(1);
  		}
  		if (c.indexOf(name) == 0)
  		{
  			return c.substring(name.length, c.length);
  		}
  	}

    return "";
  },

  check_siret : function (code) {
    var len = code.length
  	var parity = len % 2
  	var sum = 0
  	for (var i = len-1; i >= 0; i--) {
  	var d = parseInt(code.charAt(i))
  	if (i % 2 == parity) { d *= 2 }
  	if (d > 9) { d -= 9 }
  	sum += d
  	}
  	return sum % 10
  },

  readUrl : function(input, selected){
    if (input.files && input.files[0]){
      var reader = new FileReader();
      reader.onload = function (e){
      $(selected).removeAttr('hidden');
      $(selected).attr('src', e.target.result);
    }

    reader.readAsDataURL(input.files[0]);
    }
  },

  getId : function(str){
    if(isNaN(str))
      return parseInt(str.split('/')[1]);
    else
      return str;
  },

  getValueFromJsonCookie : function(cname, prop){
    var data = JSON.parse(this.getCookie(cname));
    return data[prop];
  },

  getSectIdItemId : function(id){
    var tab = id.split('/');
    return {
      idSect : tab[0],
      idItem : tab[1]
    };
  },

  create_barchart_json : function(data, globalVariables){
      let json =	{
        'data':{
          'dataSeriesNames':[],
          'dataSeriesValues':[],
          'dataSeriesColors':[],
          'labelColors':data.labelColors,
  	      'labels':data.labels,
  	      'options':data.options,
  	      'valueDisplayType':data.valueDisplayType,
  	      'chartType':data.chartType,
  	      'title':data.title,
          'maxValue':data.maxValue,
  	      'height':data.height,
  	      'width':data.width,
          'visible':true,
          'type':'chart',
          'comment':null
        }
      };

      if(data.dataSeries)
        for (let i = 0; data.dataSeries[i]; i++){
          json.data.dataSeriesNames[i] = data.dataSeries[i].name;
  	      json.data.dataSeriesColors[i] = data.dataSeries[i].color;
  	      json.data.dataSeriesValues[i] = globalVariables[data.dataSeries[i].list];
        }
      else{
        json.data.dataSeriesNames == data.dataSeriesNames;
        json.data.dataSeriesColors = data.dataSeriesColors;
        json.data.dataSeriesValues = data.dataSeriesValues;
      }

      return json;
  },

  create_radarchartV2_json : function(data, globalVariables){
    let json =	{
      "data": {
  	  'dataSeriesNames':[],
  	  'dataSeriesValues':[],
  	  'dataSeriesColors':[],
  	  'labelColors':data.labelColors,
  	  'labels':data.labels,
  	  'options':data.options,
  	  'valueDisplayType':data.valueDisplayType,
  	  'chartType':data.chartType,
  	  'title':data.title,
  	  'maxValue':data.maxValue,
  	  'height':300,
  	  'width':550,
    },
  };

  if(data.dataSeries)
    for (let i = 0; data.dataSeries[i]; ++i){
      json.data.dataSeriesNames[i] = data.dataSeries[i].name;
  	  json.data.dataSeriesValues[i] = globalVariables[data.dataSeries[i].variables];
  	  json.data.dataSeriesColors[i] = data.dataSeries[i].color;
    }

  else{
    json.data.dataSeriesNames == data.dataSeriesNames;
    json.data.dataSeriesColors = data.dataSeriesColors;
    json.data.dataSeriesValues = data.dataSeriesValues;
  }

  return (json)
  },

  create_piechart_json : function(data, globalVariableValues){
    console.log(data)
      let json =	{
        'data':{
        'dataSeriesNames':[data.dataSeries[0].name],
        'dataSeriesValues':[],
        'dataSeriesColors':[data.dataSeries[0].color],
        'labelColors':data.labelColors,
        'labels':data.labels,
        'options':data.options,
        'valueDisplayType':data.valueDisplayType,
        'chartType':data.chartType,
        'title':data.title,
        'maxValue':data.maxValue,
        'height':300,
        'width':550,
      }
    };

    let values = [];
    for (let i = 0; data.dataSeries[0].variables != null && data.dataSeries[0].variables[i]; i++)
      values[i] = globalVariables[data.dataSeries[0].variables[i]]

    json.data.dataSeriesValues[0] = values
    return (json);
  },

  base64ArrayBuffer : function (arrayBuffer){
      var base64    = ''
      var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

      var bytes         = new Uint8Array(arrayBuffer)
      var byteLength    = bytes.byteLength
      var byteRemainder = byteLength % 3
      var mainLength    = byteLength - byteRemainder

      var a, b, c, d
      var chunk

      // Main loop deals with bytes in chunks of 3
      for (var i = 0; i < mainLength; i = i + 3) {
  	// Combine the three bytes into a single integer
  	chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

  	// Use bitmasks to extract 6-bit segments from the triplet
  	a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
  	b = (chunk & 258048)   >> 12 // 258048   = (2^6 - 1) << 12
  	c = (chunk & 4032)     >>  6 // 4032     = (2^6 - 1) << 6
  	d = chunk & 63               // 63       = 2^6 - 1

  	// Convert the raw binary segments to the appropriate ASCII encoding
  	base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
      }

      // Deal with the remaining bytes and padding
      if (byteRemainder == 1) {
  	chunk = bytes[mainLength]

  	a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

  	// Set the 4 least significant bits to zero
  	b = (chunk & 3)   << 4 // 3   = 2^2 - 1

  	base64 += encodings[a] + encodings[b] + '=='
      } else if (byteRemainder == 2) {
  	chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

  	a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
  	b = (chunk & 1008)  >>  4 // 1008  = (2^6 - 1) << 4

  	// Set the 2 least significant bits to zero
  	c = (chunk & 15)    <<  2 // 15    = 2^4 - 1

  	base64 += encodings[a] + encodings[b] + encodings[c] + '='
      }

      return base64
  },
  createPorterMatrix : function(rep, title){
    let	toAppend = "";
    let porterQuestion = this.porterBase();
    let color = ["#ff1a1a", "#ffff33", "#00ff00"];
    toAppend += '<span class="title">' + title + '</span><br />';
    toAppend += '<table><tr><th></th><th>Comment ressentez-vous la menace des nouveaux entrants ?</th><th></th></tr>';
    toAppend += '<tr><td></td><td style="background-color:' + color[rep[0]] + '">' + porterQuestion[0][rep[0]] + '</td><td></td></tr>';

    toAppend += '<tr><th>Comment ressentez-vous le pouvoir de négociation des fournisseurs ?</th>';
    toAppend += '<th>Comment ressentez-vous l\'intensité de la concurence directe ?</th>';
    toAppend += '<th>Comment ressentez-vous le pouvoir de négociation des clients ?</th></tr>';
    toAppend += '<tr><td style="background-color:' + color[rep[2]] + '">' + porterQuestion[1][rep[2]] + '</td>';
    toAppend += '<td style="background-color:' + color[rep[4]] + '">' + porterQuestion[2][rep[4]] + '</td>';
    toAppend += '<td style="background-color:' + color[rep[6]] + '">' + porterQuestion[3][rep[6]] + '</td></tr>';

    toAppend += '<tr><th></th><th>Comment ressentez-vous la menace de produits et/ou services de substitution ?</th><th></th></tr>';
    toAppend += '<tr><td></td><td style="background-color:' + color[rep[8]] + '">' + porterQuestion[4][rep[8]] + '</td><td></td></tr>';
    toAppend += '</table>';
    return (toAppend);
  },

  porterBase : function(){
    let porterQuestion = [[],[],[],[],[]];

    porterQuestion[0][0] = 'Les barrières à l\'entrée sont élevées (techniques ; financières ; culturelles ; juridique ; normatives)';
    porterQuestion[0][1] = 'Le produit est peu différencié ou bien les techniques de fabrication sont plutôt conventionnelles';
    porterQuestion[0][2] = 'Il n\'y a pas de berrières à l\'entrée ; le produit est basique et les savoir-faire sont facilement accessibles';

    porterQuestion[1][0] = 'L\'offre des fournisseurs est peu différenciée (ou bien : le poids des achats dans le coût du produit est faible)';
    porterQuestion[1][1] = 'Les fournisseurs sont en mesure de nous dicter leurs conditions en terme de prix, délai, etc...';
    porterQuestion[1][2] = 'Certains de nos fournisseurs essaient de se débarrasser de nous (ou bien : deviennent des concurrents)';

    porterQuestion[2][0] = 'Les concurents sont peu agressifs car atomisés et/ou cette activité n\'est pas essentielle pour eux';
    porterQuestion[2][1] = 'Les concurents sont peu agressifs car atomisés et/ou cette activité n\'est pas essentielle pour eux';
    porterQuestion[2][2] = 'Les concurents sont nombreux et agressif ; certains d\'entre eux ont une offre différenciée';

    porterQuestion[3][0] = 'Les clients sont plutôt (voir "très") dépendant de nos produits et savoir-faire (protégés le cas échéant)';
    porterQuestion[3][1] = 'Les clients fondent leur décision d\'acaht essnetiellement sur les critères prix, délai, etc...';
    porterQuestion[3][2] = 'Certains de nos clients nous font de plus en plus d\'infidélités (ou bien : deviennent des concurrents)';

    porterQuestion[4][0] = 'Les clients sont plutôt (voir "très") dépendant de nos produits et savoir-faire (protégés le cas échéant)';
    porterQuestion[4][1] = 'Les clients fondent leur décision d\'achat essnetiellement sur les critères prix, délai, etc...';
    porterQuestion[4][2] = 'Certains de nos clients nous font de plus en plus d\'infidélités (ou bien : deviennent des concurrents)';
    return (porterQuestion);
  },

  appendTemplate : function(obj, currentDoc, id){
    var template = currentDoc.querySelector(id);
    var copie = document.importNode(template.content, true);
    obj.appendChild(copie);
  },

  createNMTexts :function(answer,typeOptions)
  {
        let toAppend = "";
        let nbrcol = typeOptions.columnLabels.length;
        let nbrline = typeOptions.rowLabels.length;
        let nbAns = 0;
        let i = 0;
        let j = 0;
        let h = 0;
        toAppend += '<table class="table-hover"><tr><th> </th>'
        for (nbrcol = 0; typeOptions.columnLabels[nbrcol]; ++nbrcol)
        {
            toAppend += '<th>' + typeOptions.columnLabels[nbrcol] + '</th>';
        }
        toAppend += '</tr>';

  while (i < nbrline)
  {
    toAppend += '<tr><th>' + typeOptions.rowLabels[i] + '</th>';

      while (j < nbrcol)
        {
            while (answer[nbAns] != null)
              {
                  nbAns += 1;
              }

          if (answer[h] != null && h < nbAns )
              toAppend += '<td>' + answer[h] + '</td>';
          else
              toAppend += "<td></td>"

          ++j;
          ++h
          nbAns = 0;
        }

    toAppend += "</tr>";
    ++i;
    j = 0;
  }
        toAppend += '</th></table>';
        return (toAppend);
        },

    createNMLongTexts : function(answer, typeOptions)
    {
            let toAppend = "";
            let nbrcol = typeOptions.columnLabels.length;
            let nbrline = typeOptions.rowLabels.length;
            let nbAns = 0;
            let i = 0;
            let j = 0;
            let h = 0;
            toAppend += '<table class="table-hover"><tr><th> </th>'
            for (nbrcol = 0; typeOptions.columnLabels[nbrcol]; ++nbrcol)
            {
                toAppend += '<th>' + typeOptions.columnLabels[nbrcol] + '</th>';
            }
            toAppend += '</tr>';

      while (i < nbrline)
      {
                toAppend += '<tr><th>' + typeOptions.rowLabels[i] + '</th>';

          while (j < nbrcol)
            {
                while (answer[nbAns] != null)
                  {
                      nbAns += 1;
                  }

              if (answer[h] != null && h < nbAns )
                  toAppend += '<td>' + answer[h] + '</td>';
              else
                  toAppend += "<td></td>"

              ++j;
              ++h
              nbAns = 0;
            }

        toAppend += "</tr>";
        ++i;
        j = 0;
      }
            toAppend += '</th></table>';
            return (toAppend);
    },

  createN1Choice : function(answer, typeOptions)
          {
            let toAppend = "";
            let nbrcol = typeOptions.columnLabels.length;
            let nbrline = typeOptions.rowLabels.length;
            let nbAns = 0;
            let i = 0;
            let j = 0;
            let h = 0;

            toAppend += '<table class="table-hover"><tr><th> </th>'
            for (nbrcol = 0; typeOptions.columnLabels[nbrcol]; ++nbrcol)
            {
                toAppend += '<th>' + typeOptions.columnLabels[nbrcol] + '</th>';
            }
            toAppend += '</tr>';

      while (i < nbrline)
      {
            toAppend += '<tr><th>' + typeOptions.rowLabels[i] + '</th>';

                if (answer[i].column == undefined){
                  while (j<nbrcol) {
                      toAppend += "<td></td>"
                      j++
                     }
                     j=0;
                  }
            else {
              while (j < nbrcol)
                {
                      if (answer[i].column == typeOptions.columnLabels[j])
                            toAppend += '<td align="center">x</td>';

                      else {
                        toAppend += "<td></td>"
                      }

                  ++j;
               }
          }
        toAppend += "</tr>";
        ++i;
        j = 0;

      }
            toAppend += '</th></table>';
            return (toAppend);
    },

    getDate : function(timestamp){
      let day = new Date(timestamp);
      let dd = day.getDate();
      let mm = day.getMonth() + 1;
      let yyyy = day.getFullYear();

      if(dd<10)
        dd = '0'+dd
      if(mm<10)
        mm = '0'+mm
      return(dd + '/' + mm + '/' + yyyy);
    },
}
